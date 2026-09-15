import { copyFile, mkdir } from 'node:fs/promises';

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
