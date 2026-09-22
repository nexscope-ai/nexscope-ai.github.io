import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

const clientDirectory = new URL('../dist/client/', import.meta.url);
const routeSlugs = [
  'ecommerce-product-demand-validation',
  'shopify-competitor-product-research',
  'ecommerce-seo-ai-search-visibility',
  'amazon-review-customer-insights',
  '1688-supplier-product-sourcing',
  'amazon-research',
  'ecommerce-ai-agents',
  'ai-product-videos',
  'ai-video-generator',
  'tools',
];

// Keep the root sitemap aligned with the routes this repository actually publishes.
// The Jekyll learning-center sitemap is maintained by its own repository.
const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
const listedUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  new URL(match[1]).href,
);
const listedSet = new Set(listedUrls);
const expectedSet = new Set(
  ['/', ...routeSlugs.map((slug) => `/${slug}/`)].map(
    (path) => new URL(path, 'https://learn.nexscope.ai').href,
  ),
);
const missing = [...expectedSet].filter((url) => !listedSet.has(url));
const extra = [...listedSet].filter((url) => !expectedSet.has(url));
if (listedUrls.length !== listedSet.size || missing.length || extra.length) {
  throw new Error(
    `Root sitemap must match published routes. Missing: ${missing.join(', ') || 'none'}; extra: ${extra.join(', ') || 'none'}; duplicates: ${listedUrls.length - listedSet.size}`,
  );
}

await Promise.all(
  routeSlugs.map(async (slug) => {
    const routeDirectory = new URL(`${slug}/`, clientDirectory);
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(
      new URL(`${slug}.html`, clientDirectory),
      new URL('index.html', routeDirectory),
    );
  }),
);

await copyFile(
  new URL('../public/.nojekyll', import.meta.url),
  new URL('../dist/client/.nojekyll', import.meta.url),
);

// GitHub Pages cannot return an HTTP 301 from static files. Keep the previous
// .html URLs as immediate HTML redirects so existing links remain usable.
const campaignRoutes = [
  'amazon-research',
  'ecommerce-ai-agents',
  'ai-product-videos',
  'ai-video-generator',
];
await Promise.all(campaignRoutes.map(async (slug) => {
  const target = `/${slug}/`;
  const html = `<!doctype html><html lang="en" data-legacy-redirect><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://learn.nexscope.ai${target}"><title>Page moved | Nexscope</title><script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p></body></html>`;
  await writeFile(new URL(`${slug}.html`, clientDirectory), html);
}));

// Include analytics on every exported page, including standalone campaigns.
async function addAnalytics(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await addAnalytics(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      if (!html.includes('</head>')) continue;
      if (html.includes('data-legacy-redirect')) continue;
      const scripts = [];
      if (!html.includes('src="/analytics.js?v=6"')) {
        scripts.push('<script src="/analytics.js?v=6" defer></script>');
      }
      if (!html.includes('src="https://analytics.ahrefs.com/analytics.js"')) {
        scripts.push('<script src="https://analytics.ahrefs.com/analytics.js" data-key="q6pDSjaAKMskPeTdzPWCtQ" async></script>');
      }
      if (scripts.length) {
        await writeFile(file, html.replace('</head>', `${scripts.join('')}</head>`));
      }
    }
  }
}
await addAnalytics(clientDirectory);
