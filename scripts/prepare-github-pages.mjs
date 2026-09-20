import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';

const clientDirectory = new URL('../dist/client/', import.meta.url);
const routeSlugs = [
  'ecommerce-product-demand-validation',
  'shopify-competitor-product-research',
  'ecommerce-seo-ai-search-visibility',
  'amazon-review-customer-insights',
  '1688-supplier-product-sourcing',
];

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

// Include analytics on every exported page, including standalone campaigns.
async function addAnalytics(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await addAnalytics(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      if (!html.includes('src="/analytics.js?v=3"')) {
        await writeFile(file, html.replace('</head>', '<script src="/analytics.js?v=3" defer></script></head>'));
      }
    }
  }
}
await addAnalytics(clientDirectory);
