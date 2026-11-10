(() => {
  if (window.nexscopeFeatureAnalyticsLoaded) return;
  window.nexscopeFeatureAnalyticsLoaded = true;

  const gallery = '/ecommerce-ai-tools/product-showcase';
  const paths = new Map([
    ['/', 'home'],
    ['/data', 'data_apis'],
    ['/social', 'social_apis'],
    ['/video-apis', 'video_image_apis'],
    ['/video', 'video_workflows'],
    [gallery, 'product_gallery'],
    ['/product-growth-report', 'product_growth_report'],
  ]);
  const mainHosts = new Set(['nexscope.ai', 'www.nexscope.ai']);
  const cleanPath = (path) => path.replace(/\/+$/, '') || '/';
  const featureFor = (path) => paths.get(path)
    || (path.startsWith('/data/') ? 'data_apis' : undefined)
    || (path === gallery + '/submit' || path.startsWith(gallery + '/product/')
      ? 'product_gallery' : undefined);
  const token = (value) => /^[a-z0-9_-]{1,80}$/i.test(value || '') ? value : undefined;

  function emit(name, properties) {
    if (typeof window.gtag !== 'function') return;
    const traffic = window.nexscopeTrafficAttribution || {};
    window.gtag('event', name, {
      ...properties,
      source_page: location.pathname,
      traffic_source: traffic.trafficSource || 'direct_or_unknown',
      traffic_medium: traffic.trafficMedium || 'none',
      transport_type: 'beacon',
    });
  }

  function interaction(feature, action, item, placement) {
    emit('learn_feature_interaction', {
      learn_feature: feature, feature_action: action, feature_item: item, cta_placement: placement,
    });
  }

  function trackClick(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const source = cleanPath(location.pathname);
    const feature = featureFor(source);
    const link = event.target.closest?.('a[href]');
    if (link) {
      const destination = new URL(link.href, location.href);
      const path = cleanPath(destination.pathname);
      const section = token(destination.hash.slice(1));
      const placement = token(link.getAttribute('data-cta-placement'))
        || token(link.getAttribute('data-showcase-submit-cta'))
        || (link.closest('nav[aria-label="Primary navigation"]') ? 'primary-navigation'
          : link.closest('footer') ? 'footer' : 'body');

      if (destination.origin === location.origin) {
        const target = featureFor(path);
        if (path !== source && (target || feature)) {
          const name = target && target !== feature
            ? 'learn_feature_entry_click' : 'learn_feature_interaction';
          emit(name, {
            learn_feature: name === 'learn_feature_entry_click' ? target : feature,
            source_feature: feature,
            feature_action: path === gallery + '/submit' ? 'open_submission'
              : path.startsWith(gallery + '/product/') ? 'open_product' : 'open_page',
            destination_path: destination.pathname,
            feature_item: section,
            cta_placement: placement,
          });
        } else if (feature && path === source && section && !['main', 'analytics-preferences'].includes(section)) {
          interaction(feature, 'jump_to_section', section, placement);
        }
        return;
      }
      if (destination.protocol !== 'https:' || !mainHosts.has(destination.hostname)) return;
      if (link.hasAttribute('data-subscription-offer') && path === '/pricing') {
        emit('subscription_offer_click', {
          offer_id: 'first_subscription_50_off',
          discount_percent: 50,
          cta_placement: placement,
          destination_host: destination.hostname,
          destination_path: destination.pathname,
          co_from: destination.searchParams.get('co-from') === 'learn' ? 'learn' : undefined,
        });
      }
      if (path === '/privacy' || path === '/terms') return;
      let action = 'open_main_site';
      if (path === '/product-growth-report') action = 'open_report_request';
      else if (path === '/reports/product-growth-example-en.html') action = 'open_report_example';
      else if (path === '/api-docs' || path.startsWith('/api-docs/')) action = 'open_api';
      else if (path.startsWith('/seller/video-generation/')) action = 'open_video_workspace';
      else if (path === '/seller/billing' || path === '/pricing') action = 'open_pricing';
      else if (path === '/mcp-data') action = 'open_mcp_setup';
      if (!feature && !action.startsWith('open_report_')) return;
      if (action === 'open_main_site' && !link.hasAttribute('data-track')) return;
      emit('learn_feature_outbound_click', {
        learn_feature: action.startsWith('open_report_') ? 'product_growth_report' : feature,
        source_feature: feature,
        feature_action: action,
        feature_item: token(link.getAttribute('data-track-tool')) || (action === 'open_report_example' ? section : undefined),
        destination_path: destination.pathname,
        cta_placement: placement,
        co_from: destination.searchParams.get('co-from') === 'learn' ? 'learn' : undefined,
      });
      return;
    }

    if (!feature || event.type !== 'click') return;
    const control = event.target.closest?.('[data-learn-action], button[data-platform-filter], button[data-directory-view]');
    if (control) {
      if (control.getAttribute('aria-pressed') === 'true') return;
      const action = token(control.getAttribute('data-learn-action'))
        || (control.hasAttribute('data-platform-filter') ? 'filter_platform' : 'switch_directory_view');
      const item = token(control.getAttribute('data-learn-item')
        || control.getAttribute('data-platform-filter') || control.getAttribute('data-directory-view'));
      interaction(feature, action, item, undefined);
      return;
    }
    const disclosure = event.target.closest?.('summary')?.parentElement;
    if (disclosure?.matches('details[data-learn-detail]') && !disclosure.open) {
      interaction(feature, 'expand_detail', token(disclosure.getAttribute('data-learn-detail')), undefined);
    }
  }

  document.addEventListener('click', trackClick, true);
  document.addEventListener('auxclick', trackClick, true);
  const offer = document.querySelector('[data-subscription-offer]');
  if (offer && typeof IntersectionObserver === 'function') {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.intersectionRatio >= 0.5)) return;
      observer.disconnect();
      emit('subscription_offer_view', {
        offer_id: 'first_subscription_50_off',
        discount_percent: 50,
        cta_placement: 'subscription-banner',
        destination_path: '/pricing',
      });
    }, { threshold: 0.5 });
    observer.observe(offer);
  }
  document.addEventListener('change', (event) => {
    const input = event.target;
    const feature = featureFor(cleanPath(location.pathname));
    if (feature && input.matches?.('input[type="search"][data-learn-search], [data-data-directory] input[type="search"]')
        && input.value.trim()) {
      interaction(feature, 'search_directory', undefined, undefined);
    }
  });

  const feature = featureFor(cleanPath(location.pathname));
  if (feature && typeof IntersectionObserver === 'function') {
    const seen = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.intersectionRatio < 0.5) continue;
        observer.unobserve(entry.target);
        const section = token(entry.target.getAttribute('data-learn-section'));
        if (!section || seen.has(section)) continue;
        seen.add(section);
        emit('learn_feature_section_view', {
          learn_feature: feature, feature_item: section,
        });
      }
    }, { threshold: 0.5 });
    for (const heading of document.querySelectorAll('[data-learn-section]')) observer.observe(heading);
  }
})();
