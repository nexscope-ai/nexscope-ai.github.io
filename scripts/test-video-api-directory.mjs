import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projectVideoApis } from './refresh-video-api-directory.mjs';

function fixture() {
  return {
    catalogAvailable: true,
    directoryCounts: { creative: 1 },
    catalog: {
      categories: [
        { slug: 'new-creative-category', name: 'New creative category' },
      ],
      skills: [
        {
          slug: 'future-model',
          name: 'Future model',
          description: 'Generate product images.',
          categorySlug: 'new-creative-category',
        },
        {
          slug: 'data-video-research',
          name: 'Video research',
          categorySlug: 'data-research',
        },
      ],
    },
    _publicDirectoryFallback: {
      apis: [{ slug: 'data-video-research' }, { slug: 'seo-search' }],
    },
    selectorGroups: [
      { slug: 'new-creative-category', skills: [{ slug: 'future-model' }] },
    ],
  };
}
const html = (page) =>
  `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: page } })}</script>`;
const sitemap = '<loc>https://www.nexscope.ai/api-docs/future-model</loc>';
test('creative membership uses official tab partition rather than category names or prefixes', () => {
  const entries = projectVideoApis(html(fixture()), sitemap).entries;
  assert.deepEqual(
    entries.map((item) => item.slug),
    ['future-model'],
  );
  assert.equal(entries[0].categoryName, 'New creative category');
  assert.deepEqual(Object.keys(entries[0]).sort(), [
    'category',
    'categoryName',
    'description',
    'name',
    'slug',
  ]);
});
test('incomplete, duplicate, withdrawn and unpublished catalog entries fail closed', () => {
  assert.throws(() => projectVideoApis('', sitemap));
  for (const mutate of [
    (page) => {
      page.directoryCounts.creative = 2;
    },
    (page) => {
      page.catalog.skills.push(page.catalog.skills[0]);
    },
    (page) => {
      page.catalog.skills[0].apiReady = false;
    },
    (page) => {
      page.selectorGroups[0].skills = [];
    },
    (page) => {
      page.catalog.skills[0].slug = '../unsafe';
    },
  ]) {
    const page = fixture();
    mutate(page);
    assert.throws(() => projectVideoApis(html(page), sitemap));
  }
  assert.throws(() => projectVideoApis(html(fixture()), ''));
});
test('saved public directory has unique safe entries and links retain Learn attribution', async () => {
  const snapshot = JSON.parse(
    await readFile(
      new URL('../lib/video-api-directory.json', import.meta.url),
      'utf8',
    ),
  );
  assert.ok(snapshot.entries.length > 0);
  assert.equal(
    new Set(snapshot.entries.map((item) => item.slug)).size,
    snapshot.entries.length,
  );
  for (const item of snapshot.entries)
    assert.match(item.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const component = await readFile(
    new URL('../components/video-api-directory.tsx', import.meta.url),
    'utf8',
  );
  assert.ok(
    component.includes(
      'https://www.nexscope.ai/api-docs/${item.slug}?co-from=learn',
    ),
  );
  assert.ok(component.includes('data-cta-placement="video-api-directory"'));
});
