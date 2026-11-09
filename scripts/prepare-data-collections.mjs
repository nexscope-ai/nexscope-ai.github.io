import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  splitDataCollections,
  projectSocialDirectory,
} from '../lib/social-directory.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(
  root,
  existsSync(
    join(root, '.api-docs-source/scripts/refresh-data-api-snapshot.mjs'),
  )
    ? '.api-docs-source'
    : '../ecommerce-ai-tools',
);
const fetchPublicText = async (url, accept) => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, {
        redirect: 'error',
        signal: AbortSignal.timeout(25000),
        headers: { Accept: accept, 'Cache-Control': 'no-cache' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      if (attempt === 1) throw error;
    }
  }
};
const fetchCurrentSocialApis = async () => {
  const [catalogText, sitemap] = await Promise.all([
    fetchPublicText(
      'https://www.nexscope.ai/api/skill-api/catalog',
      'application/json',
    ),
    fetchPublicText('https://www.nexscope.ai/sitemap.xml', 'application/xml'),
  ]);
  const payload = JSON.parse(catalogText);
  const catalog = payload.data ?? payload;
  if (
    catalog.source !== 'server' ||
    !Array.isArray(catalog.skills) ||
    !Array.isArray(catalog.categories) ||
    !catalog.categories.some((category) => category.slug === 'social-data')
  ) {
    throw new Error('Official Social API catalog is unavailable');
  }
  const published = new Set(
    [
      ...sitemap.matchAll(
        /<loc>https:\/\/www\.nexscope\.ai\/api-docs\/([a-z0-9-]+)\/?<\/loc>/g,
      ),
    ].map((match) => match[1]),
  );
  const social = catalog.skills.filter(
    (entry) =>
      entry.categorySlug === 'social-data' &&
      entry.apiReady !== false &&
      published.has(entry.slug),
  );
  if (!social.length) throw new Error('No published Social APIs found');
  return social;
};
const { refreshSnapshot } = await import(
  pathToFileURL(join(source, 'scripts/refresh-data-api-snapshot.mjs')).href
);
// Catalog and sitemap caches can briefly expose different publication versions.
// Retry the whole validated publication; never publish an empty Social directory.
let collections;
let socialDirectorySnapshot;
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    const snapshot = await refreshSnapshot(source);
    // The official Data feed intentionally excludes the separate Social
    // collection. When it does not include Social entries, refresh Ecommerce
    // from the live feed and retain the published Social snapshot below.
    const hasSocialCollection = snapshot.entries.some(
      (entry) => entry.categorySlug === 'social-data',
    );
    if (hasSocialCollection) {
      collections = splitDataCollections(snapshot);
      socialDirectorySnapshot = null;
    } else {
      const ecommerce = snapshot.entries.filter(
        (entry) => entry.categorySlug !== 'social-data',
      );
      if (!ecommerce.length) {
        throw new Error('Official Ecommerce Data collection is unavailable');
      }
      collections = {
        social: null,
        ecommerce: { ...snapshot, entries: ecommerce },
      };
      try {
        collections.social = await fetchCurrentSocialApis();
      } catch (error) {
        const previous = JSON.parse(
          await readFile(join(root, 'lib/social-api-directory.json'), 'utf8'),
        );
        if (!Array.isArray(previous.entries) || !previous.entries.length) {
          throw error;
        }
        socialDirectorySnapshot = previous;
        console.warn(
          `Official Social API refresh failed; retained ${previous.entries.length} previously published APIs.`,
        );
      }
    }
    break;
  } catch (error) {
    if (attempt === 2) throw error;
  }
}
const { social, ecommerce } = collections;
const socialEntries = socialDirectorySnapshot?.entries ?? social;
if (!Array.isArray(socialEntries) || !socialEntries.length) {
  throw new Error('Published Social API directory is unavailable');
}
const credits = JSON.parse(
  await readFile(join(root, 'lib/data-credit-snapshot.json'), 'utf8'),
);
await writeFile(
  join(root, 'lib/ecommerce-directory-snapshot.json'),
  JSON.stringify(ecommerce, null, 2) + '\n',
);
await writeFile(
  join(root, 'lib/social-api-directory.json'),
  JSON.stringify(
    !socialDirectorySnapshot
      ? { entries: projectSocialDirectory(social, credits) }
      : socialDirectorySnapshot,
    null,
    2,
  ) + '\n',
);
console.log(
  social
    ? `Prepared ${ecommerce.entries.length} ecommerce APIs and ${socialEntries.length} social APIs from the official catalog.`
    : `Prepared ${ecommerce.entries.length} ecommerce APIs and retained ${socialEntries.length} previously published Social APIs.`,
);
