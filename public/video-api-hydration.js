const entry = document.querySelector(
  'script[src="/video-api-hydration.js"]',
).dataset.entry;
const dependencies = new Set(
  [...document.querySelectorAll('link[rel="modulepreload"]')]
    .map((link) => link.getAttribute('href'))
    .filter((path) => path?.startsWith('/_next/static/chunks/')),
);
dependencies.add(entry);

try {
  // A rejected React client module can replace the entire document with an
  // error page. Fetch its files without executing them, since some import the
  // entry point themselves.
  const responses = await Promise.all(
    [...dependencies].map((path) => fetch(path, { cache: 'force-cache' })),
  );
  if (responses.every((response) =>
    response.ok && /(?:java|ecma)script/i.test(response.headers.get('content-type') ?? ''),
  )) {
    await import(entry);
  }
} catch {
  // The static catalog and its links remain usable when enhancement fails.
}
