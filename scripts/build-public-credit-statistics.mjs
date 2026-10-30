import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(
  root,
  existsSync(
    join(root, '.api-docs-source/scripts/public-credit-statistics.mjs'),
  )
    ? '.api-docs-source'
    : '../ecommerce-ai-tools',
);
const { fetchPublicCreditStatistics } = await import(
  pathToFileURL(join(source, 'scripts/public-credit-statistics.mjs')).href
);
const result = await fetchPublicCreditStatistics();
await writeFile(
  join(root, 'lib/data-credit-snapshot.json'),
  JSON.stringify(result, null, 2) + '\n',
);
console.log(
  result.available
    ? `Fetched ${Object.keys(result.statistics).length} public API credit statistics.`
    : 'Public API credit statistics unavailable; unknown ranges will display a dash.',
);
