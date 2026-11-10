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

function loadAnalytics(
  consent = 'granted',
  traffic,
  cookie = '',
  href = 'https://learn.nexscope.ai/tools/?utm_source=chatgpt.com&token=private',
) {
  const listeners = new Map();
  const appendedScripts = [];
  const location = new URL(href);
  const history = {
    pushState(_state, _title, url) {
      if (url) location.href = new URL(url, location).href;
    },
    replaceState(_state, _title, url) {
      if (url) location.href = new URL(url, location).href;
    },
  };
  const document = {
    cookie,
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
    history,
    addEventListener: (name, listener) =>
      listeners.set(`window:${name}`, [
        ...(listeners.get(`window:${name}`) || []),
        listener,
      ]),
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
  return { window, listeners, appendedScripts, location };
}

function pageViews(dataLayer) {
  return dataLayer.filter((args) => args[0] === 'event' && args[1] === 'page_view');
}

function consentDefaults(dataLayer) {
  return dataLayer.filter((args) => args[0] === 'consent' && args[1] === 'default');
}

void test('subscription banner reports visibility and clicks on home, directory and article pages', () => {
  const featureScript = readFileSync(new URL('../public/learn-feature-analytics.js', import.meta.url), 'utf8');
  for (const path of ['/', '/data/1688-sourcing/', '/ecommerce-ai-tools/guides/temu-product-research-api/']) {
    const events = [];
    const listeners = new Map();
    let observeVisibility;
    let disconnected = false;
    const link = {
      href: 'https://www.nexscope.ai/pricing?co-from=learn',
      hasAttribute: (name) => name === 'data-subscription-offer',
      getAttribute: (name) => name === 'data-cta-placement' ? 'subscription-banner' : null,
    };
    const context = {
      URL,
      location: new URL(`https://learn.nexscope.ai${path}`),
      window: {
        gtag: (...args) => events.push(args),
        nexscopeTrafficAttribution: { trafficSource: 'chatgpt.com', trafficMedium: 'ai_referral' },
      },
      document: {
        addEventListener: (name, listener) => listeners.set(name, listener),
        querySelector: () => link,
        querySelectorAll: () => [],
      },
      IntersectionObserver: class {
        constructor(callback) { observeVisibility ??= callback; }
        observe() {}
        disconnect() { disconnected = true; }
      },
    };
    runInNewContext(featureScript, context);
    runInNewContext(featureScript, context);
    observeVisibility([{ intersectionRatio: 0.2 }]);
    assert.equal(events.length, 0);
    observeVisibility([{ intersectionRatio: 0.5 }]);
    assert.equal(disconnected, true);
    assert.equal(events[0][1], 'subscription_offer_view');
    listeners.get('click')({ type: 'click', target: { closest: () => link } });
    const clicks = events.filter((event) => event[1] === 'subscription_offer_click');
    assert.equal(clicks.length, 1);
    assert.equal(clicks[0][2].source_page, path);
    assert.equal(clicks[0][2].cta_placement, 'subscription-banner');
    assert.equal(clicks[0][2].traffic_source, 'chatgpt.com');
    assert.equal(clicks[0][2].co_from, 'learn');
    assert.equal(clicks[0][2].destination_path, '/pricing');
  }
});

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
  assert.equal(configs[0][2].cookie_domain, 'nexscope.ai');
  assert.equal(configs[0][2].send_page_view, false);
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
    1,
  );
  assert.equal(appendedScripts.length, 1);
  assert.equal(
    appendedScripts[0].src,
    'https://www.googletagmanager.com/gtag/js?id=G-55CJ5T3HHS',
  );
  assert.equal(script.includes('G-DJD5Y220T1'), false);
});

void test('shared consent cookie is respected and denied visits still queue one minimal page view', () => {
  const shared = loadAnalytics(
    '',
    undefined,
    'nexscope_analytics_consent_v1=granted',
  );
  assert.equal(consentDefaults(shared.window.dataLayer).length, 1);
  assert.equal(shared.window.dataLayer[0][2].analytics_storage, 'granted');
  assert.equal(shared.window.dataLayer[0][2].ad_storage, 'granted');
  const denied = loadAnalytics('denied');
  assert.equal(consentDefaults(denied.window.dataLayer).length, 1);
  assert.equal(denied.window.dataLayer[0][2].analytics_storage, 'denied');
  assert.equal(denied.window.dataLayer[0][2].ad_storage, 'denied');
  assert.equal(pageViews(denied.window.dataLayer).length, 1);
  assert.equal(denied.appendedScripts.length, 1);
  const cookieDenied = loadAnalytics(
    '',
    undefined,
    'other=1; nexscope_analytics_consent_v1=denied',
  );
  assert.equal(consentDefaults(cookieDenied.window.dataLayer).length, 1);
  const deniedChoice = cookieDenied.window.dataLayer[0][2];
  assert.equal(deniedChoice.analytics_storage, 'denied');
  assert.equal(deniedChoice.ad_storage, 'denied');
  assert.equal(deniedChoice.ad_user_data, 'denied');
  assert.equal(deniedChoice.ad_personalization, 'denied');
  assert.equal(deniedChoice.region, undefined);
});

void test('visitors without a stored choice are measured outside opt-in regions', () => {
  const { window } = loadAnalytics('');
  const defaults = consentDefaults(window.dataLayer);
  assert.equal(defaults.length, 2);
  assert.equal(defaults[0][2].analytics_storage, 'denied');
  assert.equal(defaults[0][2].ad_storage, 'denied');
  assert.equal(defaults[0][2].ad_user_data, 'denied');
  assert.equal(defaults[0][2].ad_personalization, 'denied');
  for (const code of ['DE', 'FR', 'GB', 'CH', 'IS', 'NO']) {
    assert.ok(defaults[0][2].region.includes(code), code);
  }
  assert.equal(defaults[0][2].region.includes('US'), false);
  assert.equal(defaults[1][2].analytics_storage, 'granted');
  assert.equal(defaults[1][2].ad_storage, 'granted');
  assert.equal(defaults[1][2].region, undefined);
  assert.equal(pageViews(window.dataLayer).length, 1);
  assert.ok(
    window.dataLayer.some(
      (args) => args[0] === 'set' && args[1] === 'url_passthrough' && args[2] === true,
    ),
  );
});

void test('page location keeps ads click ids and drops unrelated query params', () => {
  const gclid = `CjwKCAjw${'A'.repeat(120)}`;
  const { window } = loadAnalytics(
    'granted',
    undefined,
    '',
    `https://learn.nexscope.ai/tools/?utm_source=google&utm_medium=cpc&gclid=${gclid}&gbraid=0A1B_gbraid.1&wbraid=WBRAID-1&gad_source=1&msclkid=bing-click&token=private&fbclid=social`,
  );
  const location = window.dataLayer.find((args) => args[0] === 'config')[2]
    .page_location;
  const params = new URL(location).searchParams;
  assert.equal(params.get('utm_source'), 'google');
  assert.equal(params.get('utm_medium'), 'cpc');
  assert.equal(params.get('gclid'), gclid);
  assert.equal(params.get('gbraid'), '0A1B_gbraid.1');
  assert.equal(params.get('wbraid'), 'WBRAID-1');
  assert.equal(params.get('gad_source'), '1');
  assert.equal(params.get('msclkid'), 'bing-click');
  assert.equal(params.has('token'), false);
  assert.equal(params.has('fbclid'), false);
  assert.equal(location.includes('private'), false);
});

void test('client-side navigations send one page view per sanitized URL', () => {
  const { window, listeners } = loadAnalytics('granted');
  assert.equal(pageViews(window.dataLayer).length, 1);
  window.history.pushState({}, '', '/pricing/?token=private&gclid=CLICKID');
  const views = pageViews(window.dataLayer);
  assert.equal(views.length, 2);
  assert.equal(
    views[1][2].page_location,
    'https://learn.nexscope.ai/pricing/?gclid=CLICKID',
  );
  assert.equal(
    views[1][2].page_referrer,
    'https://learn.nexscope.ai/tools/?utm_source=chatgpt.com',
  );
  assert.equal(views[1][2].landing_path, '/tools/');
  window.history.replaceState({}, '', '/pricing/?token=private&gclid=CLICKID');
  assert.equal(pageViews(window.dataLayer).length, 2);
  window.location.href =
    'https://learn.nexscope.ai/tools/?utm_source=chatgpt.com&token=private';
  for (const listener of listeners.get('window:popstate')) listener();
  const restored = pageViews(window.dataLayer);
  assert.equal(restored.length, 3);
  assert.equal(
    restored[2][2].page_location,
    'https://learn.nexscope.ai/tools/?utm_source=chatgpt.com',
  );
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
