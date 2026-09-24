// Keep every Learn -> Nexscope handoff attributable without forwarding arbitrary input.
const officialProductHosts = new Set(['www.nexscope.ai', 'nexscope.ai']);
const campaignFromPath = () => {
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1) || 'homepage';
  return slug.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toLowerCase();
};
const contentFromLink = (link, target) => {
  const explicit = link.dataset.utmContent || target.searchParams.get('utm_content') || '';
  if (/^(early_cta|inline_link|final_cta)$/.test(explicit)) return explicit;
  if (link.closest('footer')) return 'final_cta';
  if (link.closest('main') && link.matches('[class*="button"], [class*="cta"]')) return 'early_cta';
  return 'inline_link';
};

const rewriteProductLink = (link) => {
  const target = new URL(link.href, window.location.href);
  if (!officialProductHosts.has(target.hostname)) return false;
  target.searchParams.delete('fpr');
  target.searchParams.set('co-from', 'learn');
  target.searchParams.set('utm_source', 'learn.nexscope.ai');
  target.searchParams.set('utm_medium', 'referral');
  target.searchParams.set('utm_campaign', link.dataset.utmCampaign || campaignFromPath());
  target.searchParams.set('utm_content', contentFromLink(link, target));
  link.setAttribute('data-track', 'start_using');
  link.href = target.href;
  return true;
};

document.querySelectorAll('a[href]').forEach(rewriteProductLink);
document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href]');
  if (link) rewriteProductLink(link);
}, true);
