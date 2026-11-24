import { existsSync } from 'node:fs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { addTryExamples } from './data-api-try-examples.mjs';

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
  const generatedIndex = await readFile(
    new URL('data/index.html', new URL('../dist/client/', import.meta.url)),
    'utf8',
  );
  const sharedNavigationMarkers = [
    'class="nav-dropdown"',
    'href="/pricing/"',
  ];
  const missingNavigationMarkers = sharedNavigationMarkers.filter(
    (marker) => !generatedIndex.includes(marker),
  );
  if (missingNavigationMarkers.length) {
    throw new Error(
      `Generated Data API page is missing shared Learn navigation: ${missingNavigationMarkers.join(', ')}`,
    );
  }
  if (
    !paths.includes('/data/') ||
    paths.some((path) => !/^\/data\/(?:[a-z0-9-]+\/)?$/.test(path))
  )
    throw new Error(
      'Only the Data category square and category pages may be published',
    );
  // The shared generator also serves the content site. On Learn, send catalog
  // visitors straight to the main site's tester while preserving the API slug.
  await Promise.all(paths.map(async (path) => {
    const file = join(root, 'dist/client', path.slice(1), 'index.html');
    const html = path === '/data/'
      ? generatedIndex
          .replace('</head>', '<link rel="stylesheet" href="/api-catalog.css"></head>')
          .replace(
            /(<nav class="api-intent-navigation" aria-label="Common ecommerce data tasks">)([^]*?)(<\/nav>)/,
            (_, opening, links, closing) =>
              opening.replace('<nav ', '<nav id="platform-shortcuts" ') +
              links.replaceAll(' →</a>', '</a>') + closing,
          )
      : await readFile(file, 'utf8');
    const withTesterLinks = html.replace(
      /<a\b[^>]*\bdata-api-slug="[a-z0-9-]+"[^>]*>/g,
      (link) => {
        const placement = link.includes('data-cta-placement=')
          ? ''
          : ' data-cta-placement="data-api-card-tester"';
        return link.replace(
          /href="(https:\/\/www\.nexscope\.ai\/api-docs\/[a-z0-9-]+)\?co-from=learn"/,
          `href="$1?co-from=learn#online-test"${placement}`,
        );
      },
    );
    await writeFile(
      file,
      addTryExamples(
        withTesterLinks.replaceAll('View API docs <span', 'Try this API <span'),
        path,
        snapshot.entries,
      ),
    );
  }));
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
  const docsAlias = join(root, 'dist/client/api-docs');
  await mkdir(docsAlias, { recursive: true });
  await writeFile(
    join(docsAlias, 'index.html'),
    '<!doctype html><html lang="en" data-legacy-redirect><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=https://www.nexscope.ai/api-docs?co-from=learn"><title>Nexscope API Docs</title></head><body><a href="https://www.nexscope.ai/api-docs?co-from=learn">Open the official Nexscope API Docs</a><script>const target=new URL("https://www.nexscope.ai/api-docs");target.search=location.search;target.searchParams.set("co-from","learn");target.hash=location.hash;location.replace(target.href)</script></body></html>',
  );
  console.log(`Generated ${paths.length} root Data API pages.`);
  return paths;
}
