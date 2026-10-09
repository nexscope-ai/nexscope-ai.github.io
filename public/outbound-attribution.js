// Keep official links attributed if React replaces an exported anchor after hydration.
(() => {
  const officialHosts = new Set(['nexscope.ai', 'www.nexscope.ai']);

  function decorate(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) return;
    let url;
    try {
      url = new URL(anchor.href);
    } catch {
      return;
    }
    if (url.protocol !== 'https:' || !officialHosts.has(url.hostname)) return;
    url.hostname = 'www.nexscope.ai';
    url.searchParams.set('co-from', 'learn');
    url.searchParams.set('utm_source', 'learn.nexscope.ai');
    url.searchParams.set('utm_medium', 'referral');
    if (!url.searchParams.get('utm_campaign')) {
      url.searchParams.set('utm_campaign', location.pathname.startsWith('/tools/') ? 'tool_plaza' : 'learning_center');
    }
    if (!url.searchParams.get('utm_content')) {
      const page = location.pathname.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'home';
      const label = (anchor.textContent || 'link').trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'link';
      url.searchParams.set('utm_content', `${page}_${label}`.slice(0, 120));
    }
    if (anchor.href !== url.href) anchor.href = url.href;
  }

  function decorateTree(node) {
    if (!(node instanceof Element)) return;
    if (node.matches('a[href]')) decorate(node);
    node.querySelectorAll('a[href]').forEach(decorate);
  }

  const observer = new MutationObserver((changes) => {
    for (const change of changes) {
      if (change.type === 'attributes') decorate(change.target);
      else change.addedNodes.forEach(decorateTree);
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href'],
  });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element) decorate(event.target.closest('a[href]'));
  }, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => decorateTree(document.body), { once: true });
  } else {
    decorateTree(document.body);
  }
})();
