import { readFile, writeFile, rename } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const clean = (value) =>
  String(value ?? '')
    .replace(/\bREST\s*(?:or|and|\/)\s*MCP\b/gi, 'REST')
    .replace(/\bAPI\s*(?:or|and|\/)\s*MCP\b/gi, 'API')
    .replace(/\bMCP\b/gi, 'API')
    .trim();
const creativeCategories = new Set([
  'image-generation-models',
  'video-generation-models',
  'multimodal-ai',
]);

export function projectVideoApisFromCatalog(payload, sitemap) {
  const catalog = payload?.data ?? payload;
  if (
    catalog?.source !== 'server' ||
    !Array.isArray(catalog.skills) ||
    !Array.isArray(catalog.categories)
  ) {
    throw new Error('Official Video & Image catalog is unavailable');
  }
  const categories = new Map(
    catalog.categories.map((item) => [item.slug, item.name]),
  );
  const published = new Set(
    [
      ...sitemap.matchAll(
        /<loc>https:\/\/www\.nexscope\.ai\/api-docs\/([a-z0-9-]+)\/?<\/loc>/g,
      ),
    ].map((match) => match[1]),
  );
  const entries = catalog.skills
    .filter(
      (item) =>
        creativeCategories.has(item.categorySlug) &&
        item.apiReady !== false &&
        published.has(item.slug),
    )
    .map((item) => {
      if (
        !slugPattern.test(item.slug) ||
        !categories.has(item.categorySlug)
      ) {
        throw new Error('Invalid Video & Image API: ' + item.slug);
      }
      const name = clean(item.name);
      const description = clean(item.description || item.summary);
      if (!name || !description)
        throw new Error('Missing Video & Image API copy: ' + item.slug);
      return {
        slug: item.slug,
        name,
        description,
        category: item.categorySlug,
        categoryName: categories.get(item.categorySlug),
      };
    });
  if (
    !entries.length ||
    new Set(entries.map((item) => item.slug)).size !== entries.length
  ) {
    throw new Error('Official Video & Image membership is empty or duplicated');
  }
  return { entries };
}

export function projectVideoApis(html, sitemap) {
  const script = html.match(
    /<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i,
  );
  const page = script && JSON.parse(script[1])?.props?.pageProps;
  if (
    page?.catalogAvailable !== true ||
    !Array.isArray(page.catalog?.skills) ||
    !Array.isArray(page.catalog.categories) ||
    !Array.isArray(page._publicDirectoryFallback?.apis) ||
    !Array.isArray(page.selectorGroups)
  )
    throw new Error('Official Video & Image directory is unavailable');
  // The official compact catalog contains Data + Creative; the public Data
  // directory excludes Creative. Use actual membership, never slug prefixes.
  const data = new Set(
    page._publicDirectoryFallback.apis.map((item) => item.slug),
  );
  const categories = new Map(
    page.catalog.categories.map((item) => [item.slug, item.name]),
  );
  const published = new Set(
    [
      ...sitemap.matchAll(
        /<loc>https:\/\/www\.nexscope\.ai\/api-docs\/([a-z0-9-]+)\/?<\/loc>/g,
      ),
    ].map((match) => match[1]),
  );
  const entries = page.catalog.skills
    .filter((item) => !data.has(item.slug))
    .map((item) => {
      if (
        !slugPattern.test(item.slug) ||
        !slugPattern.test(item.categorySlug) ||
        !categories.has(item.categorySlug) ||
        !published.has(item.slug) ||
        item.apiReady === false
      ) {
        throw new Error(
          'Invalid or unpublished Video & Image API: ' + item.slug,
        );
      }
      const name = clean(item.name);
      const description = clean(item.description || item.summary);
      if (!name || !description)
        throw new Error('Missing Video & Image API copy: ' + item.slug);
      return {
        slug: item.slug,
        name,
        description,
        category: item.categorySlug,
        categoryName: categories.get(item.categorySlug),
      };
    });
  const slugs = new Set(entries.map((item) => item.slug));
  const grouped = page.selectorGroups
    .filter((group) => entries.some((item) => item.category === group.slug))
    .flatMap((group) => group.skills.map((item) => item.slug));
  if (
    !entries.length ||
    entries.length !== page.directoryCounts?.creative ||
    slugs.size !== entries.length ||
    grouped.length !== slugs.size ||
    grouped.some((slug) => !slugs.has(slug))
  ) {
    throw new Error(
      'Official Video & Image membership does not match the published count or groups',
    );
  }
  return { entries };
}

export async function refreshVideoApis() {
  const read = async (url) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(30000),
          redirect: 'error',
          headers: {
            'Cache-Control': 'no-cache',
            Accept: 'text/html,application/xml',
          },
        });
        if (!response.ok)
          throw new Error(
            'Official Video & Image source HTTP ' + response.status,
          );
        return await response.text();
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
  };
  const file = new URL('../lib/video-api-directory.json', import.meta.url);
  try {
    const [catalogText, sitemap] = await Promise.all([
      read('https://www.nexscope.ai/api/skill-api/catalog'),
      read('https://www.nexscope.ai/sitemap.xml'),
    ]);
    const snapshot = projectVideoApisFromCatalog(
      JSON.parse(catalogText),
      sitemap,
    );
    const temporary = new URL(file.href + '.tmp');
    await writeFile(temporary, JSON.stringify(snapshot, null, 2) + '\n');
    await rename(temporary, file);
    console.log(
      `Refreshed ${snapshot.entries.length} official Video & Image APIs.`,
    );
  } catch (error) {
    // The official page may temporarily change its server-rendered payload.
    // Keep the last published directory so an upstream markup change cannot
    // block an otherwise valid static-site deployment.
    const previous = JSON.parse(await readFile(file, 'utf8'));
    if (
      !Array.isArray(previous.entries) ||
      !previous.entries.length ||
      previous.entries.some(
        (entry) =>
          !slugPattern.test(entry.slug) ||
          typeof entry.name !== 'string' ||
          typeof entry.description !== 'string',
      )
    ) {
      throw error;
    }
    console.warn(
      `Official Video & Image directory refresh failed; retained ${previous.entries.length} previously published APIs.`,
    );
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await refreshVideoApis();
