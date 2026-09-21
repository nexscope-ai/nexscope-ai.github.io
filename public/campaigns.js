// Preserve only campaign attribution, never arbitrary query parameters or credentials.
const incoming = new URLSearchParams(window.location.search);
const allowed = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];
document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[href]');
  if (!link) return;
  const target = new URL(link.href);
  if (
    target.hostname !== 'www.nexscope.ai' &&
    target.origin !== window.location.origin
  ) return;
  for (const key of link.hasAttribute('data-track') ? allowed : []) {
    const value = incoming.get(key);
    if (value && value.length <= 200) target.searchParams.set(key, value);
  }
  target.searchParams.delete('fpr');
  if (target.hostname === 'www.nexscope.ai') target.searchParams.set('co-from', 'githubIO');
  link.href = target.href;
}, true);
