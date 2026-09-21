import { copyFile, mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';

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

// Vinext exports a /name.html page route as name.html.html. Publish it at its
// established URL instead so existing links, canonicals and search signals stay put.
const campaignRoutes = [
  'amazon-research',
  'ecommerce-ai-agents',
  'ai-product-videos',
  'ai-video-generator',
];
await Promise.all(campaignRoutes.map(async (slug) => {
  const exportedPage = new URL(`${slug}.html.html`, clientDirectory);
  await copyFile(exportedPage, new URL(`${slug}.html`, clientDirectory));
  await unlink(exportedPage);
}));

// Include analytics on every exported page, including standalone campaigns.
async function addAnalytics(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await addAnalytics(file);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      if (!html.includes('</head>')) continue;
      const scripts = [];
      if (!html.includes('src="/analytics.js?v=5"')) {
        scripts.push('<script src="/analytics.js?v=5" defer></script>');
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
