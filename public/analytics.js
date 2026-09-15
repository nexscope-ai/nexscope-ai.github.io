(() => {
  if (window.nexscopeAnalyticsLoaded) return;
  window.nexscopeAnalyticsLoaded = true;
  const id = 'G-DJD5Y220T1';
  const key = 'nexscope_marketing_analytics_consent';
  let active = false;
  function enable() {
    if (active) return;
    active = true;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied',
    });
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
  }
  document.addEventListener('click', (event) => {
    if (!active) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const name = url.hostname === 't.me' ? 'join_telegram_click'
      : url.hostname === 'www.nexscope.ai' && link.hasAttribute('data-track')
        ? 'start_using_click' : null;
    if (name) window.gtag('event', name, {
      link_domain: url.hostname, link_path: url.pathname,
      source_page: location.pathname, transport_type: 'beacon',
    });
  });
  let consent;
  try { consent = localStorage.getItem(key); } catch { /* Storage unavailable. */ }
  if (consent === 'granted') enable();
  const panel = document.createElement('div');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Analytics preferences');
  panel.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;max-width:580px;z-index:9999;background:#fff;color:#211f26;border:1px solid #ded9f2;border-radius:12px;padding:16px;box-shadow:0 4px 24px #0002;font:14px/1.5 Arial';
  panel.append('Allow Google Analytics to measure page views, scrolling and button clicks? ');
  for (const [label, value] of [['Allow analytics', 'granted'], ['Reject', 'denied']]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.cssText = 'margin:8px 8px 0 0;padding:8px 12px;border:1px solid #6250e9;border-radius:6px;cursor:pointer;background:white;color:#4032a0';
    button.onclick = () => {
      try { localStorage.setItem(key, value); } catch { /* Choice applies this visit. */ }
      panel.remove();
      if (value === 'granted') enable();
      else if (active) {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
        window['ga-disable-' + id] = true;
        active = false;
      }
    };
    panel.append(button);
  }
  if (!consent) document.body.append(panel);
  const preferences = document.createElement('button');
  preferences.textContent = 'Analytics preferences';
  preferences.style.cssText = 'display:block;margin:16px auto;padding:8px;background:white;color:#4032a0;border:1px solid #ded9f2;border-radius:6px;cursor:pointer';
  preferences.onclick = () => document.body.append(panel);
  document.body.append(preferences);
})();
