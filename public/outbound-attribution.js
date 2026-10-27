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
    // Snapshot keys: deleting while iterating URLSearchParams can skip adjacent tags.
    // oxlint-disable-next-line unicorn/no-useless-spread -- Mutation requires a stable key list.
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_')) url.searchParams.delete(key);
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
