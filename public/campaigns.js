// Preserve only campaign attribution, never arbitrary query parameters or credentials.
const incoming = new URLSearchParams(window.location.search);
const allowed = [
  'fpr',
  'co-from',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];
for (const link of document.querySelectorAll('a[data-track]')) {
  const target = new URL(link.href);
  if (
    target.hostname !== 'www.nexscope.ai' &&
    target.origin !== window.location.origin
  )
    continue;
  for (const key of allowed) {
    const value = incoming.get(key);
    if (value && value.length <= 200) target.searchParams.set(key, value);
  }
  link.href = target.href;
}
