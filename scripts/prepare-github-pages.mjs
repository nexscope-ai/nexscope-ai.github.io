import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  unlink,
  writeFile,
} from 'node:fs/promises';

import {
  interactiveWorkflowSlugs,
  routeSlugs,
  publishedPaths,
} from './site-routes.mjs';
const clientDirectory = new URL('../dist/client/', import.meta.url);

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
      if (!html.includes('src="/traffic-attribution.js?v=1"')) {
        scripts.push(
          '<script src="/traffic-attribution.js?v=1" defer></script>',
        );
      }
      if (!html.includes('src="/analytics.js?v=10"')) {
        scripts.push('<script src="/analytics.js?v=10" defer></script>');
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

// Keep Learn-to-main links within the same GA4 session. Published anchors,
// including card and tool links, must not start a new acquisition campaign.
const officialAnchor = /(<a\b[^>]*?\bhref\s*=\s*)(["'])(.*?)\2/gi;
const decodeAttribute = (value) => value.replace(/&(?:amp|#38|#x26);/gi, '&');
const escapeAttribute = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

async function attributeOfficialLinks(directory) {
  let pageCount = 0;
  let linkCount = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = new URL(
      entry.name + (entry.isDirectory() ? '/' : ''),
      directory,
    );
    if (entry.isDirectory()) {
      const nested = await attributeOfficialLinks(file);
      pageCount += nested.pageCount;
      linkCount += nested.linkCount;
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    pageCount += 1;
    const original = await readFile(file, 'utf8');
    const updated = original.replace(
      officialAnchor,
      (whole, prefix, quote, rawHref) => {
        const href = decodeAttribute(rawHref);
        let url;
        try {
          url = new URL(href);
        } catch {
          return whole;
        }
        if (
          url.protocol !== 'https:' ||
          !['nexscope.ai', 'www.nexscope.ai'].includes(url.hostname)
        ) {
          return whole;
        }
        linkCount += 1;
        url.hostname = 'www.nexscope.ai';
        url.searchParams.set('co-from', 'learn');
        // oxlint-disable-next-line unicorn/no-useless-spread -- Snapshot the keys before deleting from URLSearchParams.
        for (const key of [...url.searchParams.keys()]) {
          if (key.startsWith('utm_')) url.searchParams.delete(key);
        }
        return `${prefix}${quote}${escapeAttribute(url.toString())}${quote}`;
      },
    );
    for (const match of updated.matchAll(officialAnchor)) {
      const url = new URL(
        decodeAttribute(match[3]),
        'https://learn.nexscope.ai',
      );
      if (url.hostname !== 'www.nexscope.ai') continue;
      if (
        url.searchParams.get('co-from') !== 'learn' ||
        [...url.searchParams.keys()].some((key) => key.startsWith('utm_'))
      ) {
        throw new Error(
          `Invalid Learn-to-main attribution on ${file.pathname}`,
        );
      }
    }
    if (updated !== original) await writeFile(file, updated);
  }
  return { pageCount, linkCount };
}

const outboundAttribution = await attributeOfficialLinks(clientDirectory);
console.log(
  `Attributed ${outboundAttribution.linkCount} official links across ${outboundAttribution.pageCount} exported pages.`,
);

// Read the canonical HTML actually exported instead of maintaining a second URL list.
const { generateSitemap } = await import('./generate-sitemap.mjs');
await generateSitemap(clientDirectory, publishedPaths);
