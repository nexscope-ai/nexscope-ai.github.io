import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function buildDataApiDocs() {
  const source = resolve(root, existsSync(join(root,'.api-docs-source/scripts/build_api_docs.mjs')) ? '.api-docs-source' : '../ecommerce-ai-tools');
  const { buildRoot } = await import(pathToFileURL(join(source,'scripts/build_api_docs.mjs')).href);
  const snapshot = JSON.parse(await readFile(join(source,'scripts/data/api-docs.public.json'),'utf8'));
  const paths = await buildRoot(snapshot,join(root,'dist/client/api'));
  if (paths.length !== 1 || paths[0] !== '/api/') throw new Error('Only the API square may be published; local detail pages are disabled');
  console.log(`Generated ${paths.length} root Data API pages.`);
  return paths;
}
