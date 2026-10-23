import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { fileURLToPath } from 'node:url';

const script = readFileSync(
  join(
    fileURLToPath(new URL('.', import.meta.url)),
    '..',
    'public',
    'analytics.js',
  ),
  'utf8',
);

function loadAnalytics(consent = 'granted', traffic) {
  const listeners = new Map();
  const appendedScripts = [];
  const location = new URL(
    'https://learn.nexscope.ai/tools/?utm_source=chatgpt.com&token=private',
  );
  const document = {
    title: 'Learn tools | Nexscope',
    referrer: 'https://chatgpt.com/c/private-chat',
    head: { appendChild: (node) => appendedScripts.push(node) },
    body: { append() {} },
    createElement: () => ({
      style: {},
      setAttribute() {},
      append() {},
      addEventListener() {},
    }),
    addEventListener: (name, listener) =>
      listeners.set(name, [...(listeners.get(name) || []), listener]),
  };
  const window = {
    dataLayer: [],
    location,
    nexscopeTrafficAttribution: traffic,
  };
  const context = {
    window,
    location,
    document,
    localStorage: { getItem: () => consent },
    URL,
    URLSearchParams,
  };
  runInNewContext(script, context);
  runInNewContext(script, context);
  return { window, listeners, appendedScripts };
}

void test('seller CTA clicks preserve the acquisition source without tracking unrelated links or sensitive query strings', () => {
  const { window, listeners } = loadAnalytics('granted', {
    trafficSource: 'outreach_email',
    trafficMedium: 'email',
    trafficCampaign: 'product_gallery_invite',
    trafficLandingPath: '/',
  });
  const click = (href, attributes) => {
    const link = {
      href,
      getAttribute: (name) => attributes[name] || null,
      hasAttribute: () => false,
    };
    for (const listener of listeners.get('click'))
      listener({ target: { closest: () => link } });
  };
  click(
    'https://learn.nexscope.ai/ecommerce-ai-tools/product-showcase/submit/?email=private@example.com',
    { 'data-showcase-submit-cta': 'root-home-hero' },
  );
  click(
    'https://learn.nexscope.ai/ecommerce-ai-tools/seller-help/product-visibility/',
    { 'data-seller-help': 'product-visibility' },
  );
  click('https://other.example/ecommerce-ai-tools/product-showcase/submit/', {
    'data-showcase-submit-cta': 'wrong-site',
  });
  click('https://learn.nexscope.ai/other/', {
    'data-showcase-submit-cta': 'wrong-path',
  });
  const events = window.dataLayer.filter((args) => args[0] === 'event');
  const submissions = events.filter(
    (args) => args[1] === 'product_showcase_submit_click',
  );
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0][2].traffic_source, 'outreach_email');
  assert.equal(submissions[0][2].traffic_landing_path, '/');
  assert.equal(
    events.filter((args) => args[1] === 'seller_help_open').length,
    1,
  );
  assert.equal(JSON.stringify(events).includes('private@example.com'), false);
});

void test('Learn sends one privacy-safe initial page view to the main GA4 stream', () => {
  const { window, appendedScripts } = loadAnalytics();
  const configs = window.dataLayer.filter((args) => args[0] === 'config');
  assert.equal(configs.length, 1);
  assert.equal(configs[0][1], 'G-55CJ5T3HHS');
  assert.equal(configs[0][2].cookie_domain, 'auto');
  assert.equal(configs[0][2].page_title, 'Learn tools | Nexscope');
  assert.equal(
    configs[0][2].page_location,
    'https://learn.nexscope.ai/tools/?utm_source=chatgpt.com',
  );
  assert.equal(configs[0][2].page_referrer, 'https://chatgpt.com');
  assert.equal(
    window.dataLayer.filter(
      (args) => args[0] === 'event' && args[1] === 'page_view',
    ).length,
    0,
  );
  assert.equal(appendedScripts.length, 1);
  assert.equal(
    appendedScripts[0].src,
    'https://www.googletagmanager.com/gtag/js?id=G-55CJ5T3HHS',
  );
  assert.equal(script.includes('G-DJD5Y220T1'), false);
});

void test('Learn-to-main click event retains path context without internal campaign tags', () => {
  const { window, listeners } = loadAnalytics();
  const link = {
    href: 'https://www.nexscope.ai/api-docs?co-from=learn',
    getAttribute: () => null,
    hasAttribute: (name) => name === 'data-track',
  };
  for (const listener of listeners.get('click'))
    listener({ target: { closest: () => link } });
  const event = window.dataLayer.find(
    (args) => args[0] === 'event' && args[1] === 'start_using_click',
  );
  assert.ok(event);
  assert.equal(event[2].link_domain, 'www.nexscope.ai');
  assert.equal(event[2].link_path, '/api-docs');
  assert.equal(event[2].co_from, 'learn');
  assert.equal('campaign_source' in event[2], false);
});
