import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projectVideoApis } from './refresh-video-api-directory.mjs';
import { videoApiChoices, relatedVideoApi } from '../lib/video-api-choices.mjs';
import { trackDirectoryAction } from '../lib/directory-analytics.mjs';

test('related workflow options resolve only to currently published APIs or model groups', async () => {
  const { entries } = JSON.parse(
    await readFile(
      new URL('../lib/video-api-directory.json', import.meta.url),
      'utf8',
    ),
  );
  for (const choice of videoApiChoices)
    assert.equal(relatedVideoApi(choice.id, entries), choice);
  assert.equal(relatedVideoApi('video-replication', []), null);
  assert.equal(relatedVideoApi('image-to-video', []), null);
  assert.equal(
    relatedVideoApi('url-to-video', entries),
    null,
    'do not invent a matching API',
  );
});
test('directory measurement reports result counts without search text, credentials or extra page views', () => {
  const calls = [];
  const target = {
    location: { pathname: '/video-apis/' },
    gtag: (...args) => calls.push(args),
  };
  trackDirectoryAction(
    'video_api_search',
    {
      query_length: 9,
      result_count: 2,
      query: 'private@example.com',
      api_key: 'secret',
    },
    target,
  );
  trackDirectoryAction('page_view', {}, target);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], 'video_api_search');
  assert.equal(calls[0][2].source_page, '/video-apis/');
  assert.equal(calls[0][2].result_count, 2);
  assert.equal(JSON.stringify(calls).includes('private@example.com'), false);
  assert.equal(JSON.stringify(calls).includes('secret'), false);
});
import { videoModelIcon } from '../lib/video-model-icons.mjs';

test('fixed model APIs use the matching local logo; generic workflows retain capability icons', async () => {
  const expected = {
    'banana-2-1-image-generation': 'nano-banana',
    'gpt-image-2-5-generation': 'gpt-image',
    'seedance-2-5-video-generation': 'seedream-seedance',
    'seedream-5-pro-image-generation': 'seedream-seedance',
    'kling-3-omni-video-generation': 'kling',
    'wan-3-video-generation': 'wan',
    'hailuo-2-3-video-generation': 'hailuo',
    'minimax-h3-video-generation': 'minimax',
    'happy-horse-2-video-generation': 'happy-horse',
  };
  for (const [slug, family] of Object.entries(expected)) {
    const path = videoModelIcon(slug);
    assert.equal(path, `/assets/video-models/${family}.webp`);
    assert.ok(
      (await readFile(new URL('../public' + path, import.meta.url))).length > 0,
    );
  }
  for (const slug of [
    'image-upscale',
    'ai-video-reclone',
    'ai-model-swap',
    'unknown-future-model',
    'not-kling-workflow',
  ])
    assert.equal(videoModelIcon(slug), null);
});

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
      'https://www.nexscope.ai/api-docs/${item.slug}?view=playground&co-from=learn',
    ),
  );
  assert.ok(component.includes('data-cta-placement="video-api-directory"'));
});
