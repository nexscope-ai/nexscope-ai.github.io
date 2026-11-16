import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

void test('hydration observer preserves acquisition when React inserts new official links', () => {
  class Element {
    matches() { return false; }
    querySelectorAll() { return []; }
  }
  class Anchor extends Element {
    constructor(href) { super(); this.href = href; }
    matches() { return true; }
  }
  const first = new Anchor('https://nexscope.ai/apis?utm_source=learn.nexscope.ai&utm_medium=referral');
  const body = new Element();
  body.querySelectorAll = () => [first];
  let observe;
  class Observer { constructor(callback) { observe = callback; } observe() {} }
  const code = readFileSync(new URL('../public/outbound-attribution.js', import.meta.url), 'utf8');
  runInNewContext(code, { URL, HTMLAnchorElement: Anchor, Element, MutationObserver: Observer, document: { body, documentElement: {}, readyState: 'complete', addEventListener() {} } });
  assert.equal(first.href, 'https://www.nexscope.ai/apis?co-from=learn');
  const inserted = new Anchor('https://www.nexscope.ai/api-docs?utm_campaign=old&view=api');
  observe([{type: 'childList', addedNodes: [inserted]}]);
  assert.equal(inserted.href, 'https://www.nexscope.ai/api-docs?view=api&co-from=learn');
  const report = new Anchor(
    'https://www.nexscope.ai/product-growth-report?co-from=learn&report_entry=growth-hero#request',
  );
  observe([{ type: 'childList', addedNodes: [report] }]);
  const destination = new URL(report.href);
  assert.equal(destination.searchParams.get('report_entry'), 'growth-hero');
  assert.deepEqual(destination.searchParams.getAll('co-from'), ['learn']);
  assert.equal(destination.hash, '#request');
});

void test('runtime handoffs preserve acquisition and do not mark legal links as tool starts', () => {
  const makeLink = (href) => ({
    href,
    attributes: {},
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
  });
  const links = [
    makeLink(
      'https://www.nexscope.ai/apis?utm_source=learn.nexscope.ai&utm_campaign=homepage',
    ),
    makeLink('https://www.nexscope.ai/privacy'),
    makeLink('/tools/'),
  ];
  const code = readFileSync(
    new URL('../public/campaigns.js', import.meta.url),
    'utf8',
  );
  runInNewContext(code, {
    URL,
    window: {
      location: {
        href: 'https://learn.nexscope.ai/?utm_source=chatgpt.com&token=private',
      },
    },
    document: { querySelectorAll: () => links, addEventListener() {} },
  });
  const target = new URL(links[0].href);
  assert.equal(target.searchParams.get('co-from'), 'learn');
  assert.deepEqual([...target.searchParams.keys()], ['co-from']);
  assert.equal(links[0].attributes['data-track'], 'start_using');
  assert.equal(links[1].attributes['data-track'], undefined);
  assert.equal(links[2].href, '/tools/');
});

void test('reports the Learn request entry only for recognized report application links', () => {
  const code = readFileSync(new URL('../public/learn-feature-analytics.js', import.meta.url), 'utf8');
  const location = new URL('https://learn.nexscope.ai/product-growth-report/');
  const listeners = new Map();
  const events = [];
  runInNewContext(code, {
    URL,
    location,
    window: { gtag: (...args) => events.push(args) },
    document: { addEventListener: (name, callback) => listeners.set(name, callback) },
  });
  const click = (href) => {
    const link = { href, getAttribute: () => null, closest: () => null };
    listeners.get('click')({ type: 'click', target: { closest: () => link } });
    return events.at(-1);
  };
  const [command, name, properties] = click(
    'https://www.nexscope.ai/product-growth-report?co-from=learn&report_entry=growth-hero#request',
  );
  assert.equal(command, 'event');
  assert.equal(name, 'learn_feature_outbound_click');
  assert.equal(properties.feature_action, 'open_report_request');
  assert.equal(properties.report_entry, 'growth-hero');
  assert.equal(properties.co_from, 'learn');
  assert.equal(click('https://www.nexscope.ai/product-growth-report?report_entry=unknown')[2].report_entry, undefined);
  assert.equal(click('https://www.nexscope.ai/reports/product-growth-example-en.html?report_entry=growth-hero')[2].report_entry, undefined);
  location.pathname = '/';
  assert.equal(click('https://www.nexscope.ai/product-growth-report?report_entry=growth-hero')[2].report_entry, undefined);
});
