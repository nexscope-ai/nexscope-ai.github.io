(() => {
  if (window.nexscopeAnalyticsLoaded) return;
  window.nexscopeAnalyticsLoaded = true;
  // Learn and www.nexscope.ai share one GA4 web stream so journeys can be joined.
  const id = 'G-55CJ5T3HHS';
  const key = 'nexscope_marketing_analytics_consent';
  // Google matches these ISO codes to the visitor IP inside gtag.js. Everyone
  // else gets the unscoped default below. A stored choice replaces both.
  const optInRegions = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
    'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
    'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
  ];
  let consent;
  try { consent = localStorage.getItem(key); } catch { /* Storage unavailable. */ }
  if (consent !== 'granted' && consent !== 'denied') {
    try {
      const match = document.cookie.match(/(?:^|; )nexscope_analytics_consent_v1=([^;]*)/);
      const value = match ? decodeURIComponent(match[1]) : '';
      if (value === 'granted' || value === 'denied') consent = value;
    } catch { /* Cookie unavailable. */ }
  }

  const signals = (value) => ({
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
  window.dataLayer = window.dataLayer || [];
  // oxlint-disable-next-line prefer-rest-params -- Google gtag.js requires the Arguments object.
  window.gtag = function () { window.dataLayer.push(arguments); };
  if (consent === 'granted' || consent === 'denied') {
    window.gtag('consent', 'default', signals(consent));
  } else {
    window.gtag('consent', 'default', { ...signals('denied'), region: optInRegions });
    window.gtag('consent', 'default', signals('granted'));
  }
  window.gtag('set', 'ads_data_redaction', true);
  // Keep ad click ids on the URL when ad storage is denied, instead of cookies.
  window.gtag('set', 'url_passthrough', true);
  window.gtag('js', new Date());
  const utmParams = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'utm_id', 'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
  ];
  const clickParams = [
    'gclid', 'gbraid', 'wbraid', 'gclsrc', 'dclid', 'gad_source',
    'gad_campaignid', 'srsltid', 'msclkid',
  ];
  const pageLocation = () => {
    const page = new URL(location.href);
    const params = new URLSearchParams(page.search);
    page.search = '';
    page.hash = '';
    for (const name of utmParams) {
      const value = params.get(name);
      if (value && /^[\w .-]{1,100}$/.test(value)) page.searchParams.set(name, value);
    }
    for (const name of clickParams) {
      const value = params.get(name);
      if (value && /^[A-Za-z0-9._~-]{1,500}$/.test(value)) page.searchParams.set(name, value);
    }
    return page.href;
  };
  const initialPage = new URL(pageLocation());
  let externalReferrer = '';
  try { externalReferrer = new URL(document.referrer).origin; } catch { /* No referrer. */ }
  const traffic = window.nexscopeTrafficAttribution || {};
  const landingPath = traffic.trafficLandingPath || initialPage.pathname;
  window.gtag('config', id, {
    page_location: initialPage.href, page_title: document.title, page_referrer: externalReferrer,
    cookie_domain: 'nexscope.ai',
    // Only decorate links that leave Learn for the main site. Learn pages share
    // the nexscope.ai cookie domain, so same-site navigation needs no _gl.
    linker: { domains: ['www.nexscope.ai', 'nexscope.ai'], decorate_forms: false },
    send_page_view: false,
    content_group: 'learn', site_surface: 'learn',
    landing_source: traffic.trafficSource || 'direct_or_unknown',
    landing_medium: traffic.trafficMedium || 'none',
    landing_campaign: traffic.trafficCampaign || undefined,
    landing_path: landingPath,
    allow_google_signals: false, allow_ad_personalization_signals: false,
  });
  // One page view per distinct sanitized URL. send_page_view stays off so the
  // config hit is not counted again. History changes cover client-side routes;
  // a full load runs this script again. Same-URL replaceState is ignored.
  let lastSent = '';
  let lastReferrer = externalReferrer;
  const sendPageView = (force) => {
    const loc = pageLocation();
    if (!force && loc === lastSent) return;
    const referrerForHit = loc === lastSent ? lastReferrer : (lastSent || externalReferrer);
    lastReferrer = referrerForHit;
    lastSent = loc;
    window.gtag('event', 'page_view', {
      page_location: loc, page_title: document.title, page_referrer: referrerForHit || undefined,
      content_group: 'learn', site_surface: 'learn',
      landing_source: traffic.trafficSource || 'direct_or_unknown',
      landing_medium: traffic.trafficMedium || 'none',
      landing_path: landingPath,
      transport_type: 'beacon',
    });
  };
  sendPageView();
  if (window.history && typeof window.history.pushState === 'function') {
    for (const name of ['pushState', 'replaceState']) {
      const original = window.history[name];
      window.history[name] = function historyChange(...args) {
        const result = Reflect.apply(original, this, args);
        sendPageView();
        return result;
      };
    }
    window.addEventListener?.('popstate', () => sendPageView());
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;

  const page = initialPage;
  const sellerIntents = new Set(['product-visibility', 'product-page-review', 'product-media-review']);
  const sellerEvent = (name, properties) => {
    window.gtag('event', name, {
      ...properties,
      traffic_source: traffic.trafficSource || 'direct_or_unknown',
      traffic_medium: traffic.trafficMedium || 'none',
      traffic_campaign: traffic.trafficCampaign || undefined,
      traffic_landing_path: traffic.trafficLandingPath || page.pathname,
      source_page: page.pathname,
      transport_type: 'beacon',
    });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const reviewPlacement = link.getAttribute('data-showcase-submit-cta')
      || link.getAttribute('data-cta-placement') || 'body-link';
    if (/^[a-z0-9-]{1,60}$/.test(reviewPlacement || '') && url.origin === page.origin
        && url.pathname === '/ecommerce-ai-tools/product-showcase/submit/'
        && url.pathname !== page.pathname) {
      sellerEvent('product_showcase_submit_click', { cta_placement: reviewPlacement });
    }
    const intent = link.getAttribute('data-seller-help');
    if (sellerIntents.has(intent) && url.origin === page.origin
        && url.pathname === `/ecommerce-ai-tools/seller-help/${intent}/`) {
      sellerEvent('seller_help_open', { seller_intent: intent });
    }
    const workflow = link.getAttribute('data-track-tool');
    if (workflow && /^[a-z0-9-]{1,80}$/.test(workflow) && url.origin === location.origin) {
      window.gtag('event', 'workflow_open_click', {
        workflow, source_page: location.pathname, transport_type: 'beacon',
      });
    }
    const name = ['www.nexscope.ai', 'nexscope.ai'].includes(url.hostname) && link.hasAttribute('data-track')
      ? 'start_using_click' : null;
    if (name) window.gtag('event', name, {
      link_domain: url.hostname, link_path: url.pathname,
      co_from: url.searchParams.get('co-from') || undefined,
      source_page: location.pathname, transport_type: 'beacon',
    });
  });
  const panel = document.createElement('div');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Analytics preferences');
  panel.style.cssText = 'position:fixed;bottom:16px;right:16px;width:min(380px,calc(100vw - 32px));z-index:9999;background:#fff;color:#211f26;border:1px solid #ded9f2;border-radius:14px;padding:16px 18px;box-shadow:0 16px 48px #211f2626;font:13px/1.5 Arial';
  const message = document.createElement('p');
  message.textContent = 'Allow analytics cookies? Rejecting keeps limited, cookieless measurement.';
  message.style.cssText = 'margin:0;line-height:1.5';
  panel.append(message);
  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:12px';
  const analyticsGrantedNow = () => {
    const entry = window.google_tag_data?.ics?.entries?.analytics_storage;
    if (entry && typeof entry === 'object') {
      if (typeof entry.update === 'boolean') return entry.update;
      if (typeof entry.default === 'boolean') return entry.default;
    }
    return consent === 'granted';
  };
  for (const [label, value] of [['Allow analytics', 'granted'], ['Reject', 'denied']]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText = value === 'granted'
      ? 'padding:9px 12px;border:1px solid #6250e9;border-radius:8px;cursor:pointer;background:#6250e9;color:white;font-weight:600'
      : 'padding:9px 12px;border:1px solid #ded9f2;border-radius:8px;cursor:pointer;background:white;color:#4032a0;font-weight:600';
    button.onclick = () => {
      const alreadyGranted = analyticsGrantedNow();
      try { localStorage.setItem(key, value); } catch { /* Choice applies this visit. */ }
      try {
        document.cookie = `nexscope_analytics_consent_v1=${value}; Max-Age=31536000; Path=/; Domain=.nexscope.ai; SameSite=Lax; Secure`;
      } catch { /* Cookie unavailable. */ }
      consent = value;
      panel.remove();
      window.gtag('consent', 'update', signals(value));
      // Re-queue the landing view after opt-in. gtag keeps one page_view for
      // this URL and sends a granted engagement hit that carries the client id.
      if (value === 'granted' && !alreadyGranted) sendPageView(true);
    };
    actions.append(button);
  }
  panel.append(actions);
  // Show the prompt only where gtag resolved a denied default: EEA, UK, and
  // Switzerland, by IP. The value is filled in as gtag.js starts, so check
  // until it is known. Granted regions are not interrupted. Cookie settings
  // in the footer can still open this panel anywhere.
  script.addEventListener('load', () => {
    let tries = 0;
    const timer = setInterval(() => {
      if (consent || panel.isConnected) {
        clearInterval(timer);
        return;
      }
      const entry = window.google_tag_data?.ics?.entries?.analytics_storage;
      const decided = entry?.default;
      if (decided === false && document.body) document.body.append(panel);
      if (decided === true || decided === false || tries > 25) clearInterval(timer);
      tries += 1;
    }, 100);
  });
  document.head.appendChild(script);
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest?.('a[href]');
    if (!trigger || trigger.hash !== '#analytics-preferences' || trigger.origin !== location.origin) return;
    event.preventDefault();
    document.body.append(panel);
    panel.querySelector('button')?.focus();
  }, true);
})();
