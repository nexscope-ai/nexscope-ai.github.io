import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  unlink,
  writeFile,
} from 'node:fs/promises';

const clientDirectory = new URL('../dist/client/', import.meta.url);
const interactiveWorkflowSlugs = [
  'amazon-to-1688-supplier-finder',
  'tiktok-shop-new-product-validator',
  'tiktok-shop-creator-match',
  'seo-keyword-planner',
  'amazon-niche-opportunity-evaluator',
  'amazon-product-price-checker',
  '1688-wholesale-price-finder',
  'amazon-price-history-analyzer',
  'reverse-asin-keyword-gap',
  'ai-shopping-product-data-checker',
  'tiktok-shop-bestseller-momentum',
  '1688-amazon-demand-matcher',
];
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
  'about',
  'security',
  'contact',
  'tools',
  ...interactiveWorkflowSlugs.map((slug) => `tools/${slug}`),
];

// Keep the root sitemap aligned with the routes this repository actually publishes.
// The Jekyll learning-center sitemap is maintained by its own repository.
const sitemap = await readFile(
  new URL('../public/sitemap.xml', import.meta.url),
  'utf8',
);
const listedUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => new URL(match[1]).href,
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

// Remove duplicate flat .html files once the canonical directory routes exist.
await Promise.all(
  routeSlugs.map((slug) => unlink(new URL(`${slug}.html`, clientDirectory))),
);

await copyFile(
  new URL('../public/.nojekyll', import.meta.url),
  new URL('../dist/client/.nojekyll', import.meta.url),
);

// GitHub Pages cannot return an HTTP 301 from static files. Keep the remaining
// established legacy URL usable while its external links are migrated.
const campaignRoutes = ['ecommerce-ai-agents'];
await Promise.all(
  campaignRoutes.map(async (slug) => {
    const target = `/${slug}/`;
    const html = `<!doctype html><html lang="en" data-legacy-redirect><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="https://learn.nexscope.ai${target}"><title>Page moved | Nexscope</title><script>location.replace(${JSON.stringify(target)} + location.search + location.hash)</script></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p></body></html>`;
    await writeFile(new URL(`${slug}.html`, clientDirectory), html);
  }),
);

// Include analytics on every exported page, including standalone campaigns.
async function addAnalytics(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(
      entry.name + (entry.isDirectory() ? '/' : ''),
      directory,
    );
    if (entry.isDirectory()) await addAnalytics(file);
    else if (entry.name.endsWith('.html')) {
      // BYOK workflow pages must not load third-party analytics scripts beside a user-entered API key.
      if (
        interactiveWorkflowSlugs.some((slug) =>
          file.pathname.endsWith(`/tools/${slug}/index.html`),
        )
      )
        continue;
      const html = await readFile(file, 'utf8');
      if (!html.includes('</head>')) continue;
      if (html.includes('data-legacy-redirect')) continue;
      const scripts = [];
      if (!html.includes('src="/analytics.js?v=8"')) {
        scripts.push('<script src="/analytics.js?v=8" defer></script>');
      }
      if (!html.includes('src="https://analytics.ahrefs.com/analytics.js"')) {
        scripts.push(
          '<script src="https://analytics.ahrefs.com/analytics.js" data-key="q6pDSjaAKMskPeTdzPWCtQ" async></script>',
        );
      }
      if (scripts.length) {
        await writeFile(
          file,
          html.replace('</head>', `${scripts.join('')}</head>`),
        );
      }
    }
  }
}
await addAnalytics(clientDirectory);

// Attribute the actual published anchors, including links supplied by card
// data and tool pages. Canonical, schema, image, and script URLs stay clean.
const officialAnchor = /(<a\b[^>]*?\bhref\s*=\s*)(["'])(.*?)\2/gi;
const decodeAttribute = (value) =>
  value.replace(/&(?:amp|#38|#x26);/gi, '&');
const escapeAttribute = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

async function attributeOfficialLinks(directory) {
  let pageCount = 0;
  let linkCount = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) {
      const nested = await attributeOfficialLinks(file);
      pageCount += nested.pageCount;
      linkCount += nested.linkCount;
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    pageCount += 1;
    const pageName = file.pathname
      .slice(clientDirectory.pathname.length)
      .replace(/(?:\/index)?\.html$/, '')
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_+|_+$/g, '') || 'home';
    let index = 0;
    const original = await readFile(file, 'utf8');
    const updated = original.replace(officialAnchor, (whole, prefix, quote, rawHref) => {
      const href = decodeAttribute(rawHref);
      let url;
      try {
        url = new URL(href);
      } catch {
        return whole;
      }
      if (url.protocol !== 'https:' || !['nexscope.ai', 'www.nexscope.ai'].includes(url.hostname)) {
        return whole;
      }
      index += 1;
      url.hostname = 'www.nexscope.ai';
      url.searchParams.set('co-from', 'learn');
      url.searchParams.set('utm_source', 'learn.nexscope.ai');
      url.searchParams.set('utm_medium', 'referral');
      if (!url.searchParams.get('utm_campaign')) {
        url.searchParams.set('utm_campaign', pageName.startsWith('tools_') ? 'tool_plaza' : 'learning_center');
      }
      if (!url.searchParams.get('utm_content')) {
        url.searchParams.set('utm_content', `${pageName}_link_${index}`);
      }
      return `${prefix}${quote}${escapeAttribute(url.toString())}${quote}`;
    });
    for (const match of updated.matchAll(officialAnchor)) {
      const url = new URL(decodeAttribute(match[3]), 'https://learn.nexscope.ai');
      if (url.hostname !== 'www.nexscope.ai') continue;
      for (const key of ['co-from', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
        if (!url.searchParams.get(key)) throw new Error(`Missing ${key} on ${file.pathname}`);
      }
    }
    if (updated !== original) await writeFile(file, updated);
    linkCount += index;
  }
  return { pageCount, linkCount };
}

const outboundAttribution = await attributeOfficialLinks(clientDirectory);
console.log(`Attributed ${outboundAttribution.linkCount} official links across ${outboundAttribution.pageCount} exported pages.`);
