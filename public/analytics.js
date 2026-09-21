(() => {
  if (window.nexscopeAnalyticsLoaded) return;
  window.nexscopeAnalyticsLoaded = true;
  const id = 'G-DJD5Y220T1';
  const key = 'nexscope_marketing_analytics_consent';
  let consent;
  try { consent = localStorage.getItem(key); } catch { /* Storage unavailable. */ }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args) { window.dataLayer.push(args); };
  window.gtag('consent', 'default', {
    analytics_storage: consent === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('set', 'ads_data_redaction', true);
  window.gtag('js', new Date());
  const page = new URL(location.href);
  page.search = '';
  page.hash = '';
  for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = new URLSearchParams(location.search).get(name);
    if (value && /^[\w .-]{1,100}$/.test(value)) page.searchParams.set(name, value);
  }
  let referrer = '';
  try { referrer = new URL(document.referrer).origin; } catch { /* No referrer. */ }
  window.gtag('config', id, {
    page_location: page.href, page_referrer: referrer,
    allow_google_signals: false, allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(script);

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const name = url.hostname === 'www.nexscope.ai' && link.hasAttribute('data-track')
      ? 'start_using_click' : null;
    if (name) window.gtag('event', name, {
      link_domain: url.hostname, link_path: url.pathname,
      source_page: location.pathname, transport_type: 'beacon',
    });
  });
  const panel = document.createElement('div');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Analytics preferences');
  panel.style.cssText = 'position:fixed;bottom:16px;right:16px;width:min(380px,calc(100vw - 32px));z-index:9999;background:#fff;color:#211f26;border:1px solid #ded9f2;border-radius:14px;padding:16px 18px;box-shadow:0 16px 48px #211f2626;font:13px/1.5 Arial';
  panel.append('Allow analytics cookies? Rejecting keeps limited, cookieless measurement. ');
  for (const [label, value] of [['Allow analytics', 'granted'], ['Reject', 'denied']]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText = 'margin:12px 8px 0 0;padding:8px 12px;border:1px solid #6250e9;border-radius:8px;cursor:pointer;background:white;color:#4032a0;font-weight:600';
    button.onclick = () => {
      try { localStorage.setItem(key, value); } catch { /* Choice applies this visit. */ }
      panel.remove();
      window.gtag('consent', 'update', { analytics_storage: value });
    };
    panel.append(button);
  }
  if (!consent) document.body.append(panel);
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest?.('a[href]');
    if (!trigger || trigger.hash !== '#analytics-preferences' || trigger.origin !== location.origin) return;
    event.preventDefault();
    document.body.append(panel);
    panel.querySelector('button')?.focus();
  }, true);
})();
