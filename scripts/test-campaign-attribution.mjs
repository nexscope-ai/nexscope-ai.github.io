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
