import { existsSync } from 'node:fs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function buildDataApiDocs() {
  const source = resolve(
    root,
    existsSync(join(root, '.api-docs-source/scripts/build_api_docs.mjs'))
      ? '.api-docs-source'
      : '../ecommerce-ai-tools',
  );
  const { buildRoot } = await import(
    pathToFileURL(join(source, 'scripts/build_api_docs.mjs')).href
  );
  // The prebuild partitions one fresh official publication for both directories.
  const snapshot = JSON.parse(
    await readFile(join(root, 'lib/ecommerce-directory-snapshot.json'), 'utf8'),
  );
  const credits = JSON.parse(
    await readFile(join(root, 'lib/data-credit-snapshot.json'), 'utf8'),
  );
  const paths = await buildRoot(
    snapshot,
    join(root, 'dist/client/data'),
    undefined,
    credits,
  );
  if (
    !paths.includes('/data/') ||
    paths.some((path) => !/^\/data\/(?:[a-z0-9-]+\/)?$/.test(path))
  )
    throw new Error(
      'Only the Data category square and category pages may be published',
    );
  // Preserve the previously published directory address as a static alias.
  const legacy = join(root, 'dist/client/api');
  const socialAlias = join(root, 'dist/client/data/social-data');
  await mkdir(socialAlias, { recursive: true });
  await writeFile(
    join(socialAlias, 'index.html'),
    '<!doctype html><html lang="en" data-legacy-redirect><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/social/"><link rel="canonical" href="https://learn.nexscope.ai/social/"><title>Social Data APIs | Nexscope</title></head><body><a href="/social/">Explore Social Data APIs</a><script>location.replace("/social/"+location.search+location.hash)</script></body></html>',
  );
  await mkdir(legacy, { recursive: true });
  await writeFile(
    join(legacy, 'index.html'),
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/data/"><link rel="canonical" href="https://learn.nexscope.ai/data/"><title>Data API categories | Nexscope</title></head><body><a href="/data/">Explore Data API categories</a><script>location.replace("/data/"+location.search+location.hash)</script></body></html>',
  );
  console.log(`Generated ${paths.length} root Data API pages.`);
  return paths;
}
