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
const { refreshSnapshot } = await import(
  pathToFileURL(join(source, 'scripts/refresh-data-api-snapshot.mjs')).href
);
// Catalog and sitemap caches can briefly expose different publication versions.
// Retry the whole validated publication; never publish an empty Social directory.
let collections;
for (let attempt = 0; attempt < 3; attempt++) {
  try {
    collections = splitDataCollections(await refreshSnapshot(source));
    break;
  } catch (error) {
    if (attempt === 2) throw error;
  }
}
const { social, ecommerce } = collections;
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
    { entries: projectSocialDirectory(social, credits) },
    null,
    2,
  ) + '\n',
);
console.log(
  `Prepared ${ecommerce.entries.length} ecommerce APIs and ${social.length} social APIs from the same official publication.`,
);
