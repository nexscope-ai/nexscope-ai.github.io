// Keep every Learn -> Nexscope handoff attributable without forwarding arbitrary input.
const officialProductHosts = new Set(['www.nexscope.ai', 'nexscope.ai']);

const rewriteProductLink = (link) => {
  const target = new URL(link.href, window.location.href);
  if (!officialProductHosts.has(target.hostname)) return false;
  target.searchParams.delete('fpr');
  target.searchParams.set('co-from', 'learn');
  // Internal subdomain navigation must preserve the visitor's original acquisition source.
  // oxlint-disable-next-line unicorn/no-useless-spread -- Snapshot keys before mutating URLSearchParams.
  for (const key of [...target.searchParams.keys()]) {
    if (key.startsWith('utm_')) target.searchParams.delete(key);
  }
  if (!['/privacy', '/terms'].includes(target.pathname)) link.setAttribute('data-track', 'start_using');
  link.href = target.href;
  return true;
};

document.querySelectorAll('a[href]').forEach(rewriteProductLink);
document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href]');
  if (link) rewriteProductLink(link);
}, true);
