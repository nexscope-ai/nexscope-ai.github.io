/* oxlint-disable typescript/no-require-imports, typescript/no-floating-promises, typescript/unbound-method */
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const moduleScope = { exports: {} };
runInNewContext(readFileSync(join(__dirname, '..', 'public', 'assets', 'seo-keyword-planner.js'), 'utf8'),
  { module: moduleScope, URL, Intl });
const planner = moduleScope.exports;

test('English topic validation matches the original 1–10 word, 80-character boundary', () => {
  assert.equal(planner.validateSeed(' insulated   lunch bag '), '');
  assert.match(planner.validateSeed(''), /Enter/);
  assert.match(planner.validateSeed('商品'), /English/);
  assert.match(planner.validateSeed('one two three four five six seven eight nine ten eleven'), /1–10/);
});

test('keyword expansion keeps seed first, deduplicates, caps at ten and preserves missing metrics', () => {
  const expanded = { items: [{ keyword: 'Lunch Bag' }, { keyword: 'cold lunch bag' }, { keyword: 'insulated lunch bag' }] };
  const measured = { items: [{ normalizedKeyword: 'insulated lunch bag', searchVolume: 0, keywordDifficulty: 25 }, { inputKeyword: 'cold lunch bag', searchVolume: 100, keywordDifficulty: null }] };
  const items = planner.keywordItems('insulated lunch bag', expanded, measured);
  assert.equal(items.length, 3);
  assert.deepEqual(Array.from(items, item => item.keyword), ['insulated lunch bag', 'Lunch Bag', 'cold lunch bag']);
  assert.equal(items[0].searchVolume, 0);
  assert.equal(items[1].searchVolume, null);
  assert.equal(items[2].keywordDifficulty, null);
  const many = planner.keywordItems('seed', { items: Array.from({ length: 20 }, (_, i) => ({ keyword: `idea ${i}` })) }, {});
  assert.equal(many.length, 10);
});

test('competitor parser accepts nested envelopes but excludes invalid and duplicate ASINs', () => {
  const products = planner.parseCompetitors({ data: { result: { products: [
    { asin: 'B072MQ5BRX', title: 'First', imageUrl: 'javascript:alert(1)', monthlySalesUnits: 0, ratings: 45 },
    { asin: 'B072MQ5BRX', title: 'Duplicate' },
    { asin: 'bad', title: 'Invalid' },
    { asin: 'B08N5WRWNW', title: 'Second', imageUrl: 'https://example.com/img.jpg', monthlySalesRevenue: 99 },
  ] } } });
  assert.equal(products.length, 2);
  assert.equal(products[0].imageUrl, '');
  assert.equal(products[0].monthlySalesUnits, 0);
  assert.equal(products[0].ratings, 45);
  assert.equal(products[1].imageUrl, 'https://example.com/img.jpg');
  assert.equal(products[1].monthlySalesUnits, null);
  assert.throws(() => planner.parseCompetitors({ result: {} }), /No readable competitor data/);
});

test('CSV escapes spreadsheet formulas and the report uses only the returned product sample', () => {
  const csv = planner.csv([{ keyword: '=HYPERLINK("bad")', searchVolume: null, keywordDifficulty: 3 }]);
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes("'=HYPERLINK"));
  const result = { keyword: 'insulated lunch bag', collectedAt: '2026-10-07T00:00:00Z', products: [{ asin: 'B072MQ5BRX' }] };
  const payload = planner.analysisPayload(result);
  assert.equal(payload.language, 'English');
  assert.equal(payload.rawData.sampleSize, 1);
  assert.match(payload.rawData.scope, /Google keyword metrics are not Amazon search volume/);
  assert.match(planner.reportMarkdown(result, 'Summary'), /Summary/);
});

test('API requests carry visitor key only in Authorization and never use credentials or referrer', async () => {
  let captured;
  const fetcher = async (url, options) => {
    captured = { url, options };
    return { ok: true, status: 200, json: async () => ({ code: 0, data: { status: 'SUCCESS', result: { items: [] } } }) };
  };
  const data = await planner.callSkill(fetcher, 'seo-keyword-expand', 'run', { keyword: 'bags' }, 'nk-example');
  assert.equal(data.status, 'SUCCESS');
  assert.equal(captured.url, `${planner.API_BASE}/seo-keyword-expand/run`);
  assert.equal(captured.options.headers.Authorization, 'Bearer nk-example');
  assert.equal(captured.options.credentials, 'omit');
  assert.equal(captured.options.referrerPolicy, 'no-referrer');
  assert.ok(!captured.options.body.includes('nk-example'));
  await assert.rejects(planner.callSkill(fetcher, 'seo-keyword-expand', 'analyze', {}, 'nk-example'), /Unsupported/);
});

test('analysis reads its report while processing remains an explicit non-final state', async () => {
  const analyzed = await planner.callSkill(async () => ({ ok: true, status: 200, json: async () => ({ code: 0, data: { analysis: 'Summary' } }) }), 'amazon-competitor-lookup', 'analyze', {}, 'nk-example');
  assert.equal(planner.extractAnalysis(analyzed), 'Summary');
  await assert.rejects(planner.callSkill(async () => ({ ok: true, status: 200, json: async () => ({ code: 0, data: { status: 'PROCESSING' } }) }), 'seo-keyword-metrics', 'run', {}, 'nk-example'), /not confirmed/);
});

test('production export includes the new route and does not inject third-party analytics beside the API key', () => {
  const root = join(__dirname, '..');
  const route = readFileSync(join(root, 'app', 'tools', 'seo-keyword-planner', 'page.tsx'), 'utf8');
  const directory = readFileSync(join(root, 'lib', 'tool-plaza.ts'), 'utf8');
  const exportScript = readFileSync(join(root, 'scripts', 'prepare-github-pages.mjs'), 'utf8');
  const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');
  assert.match(route, /name="apiKey" type="text"/);
  assert.match(route, /tab: 'api-keys', mode: 'data'/);
  assert.match(directory, /href: '\/tools\/seo-keyword-planner\/'/);
  assert.match(exportScript, /'seo-keyword-planner'/);
  assert.match(exportScript, /interactiveWorkflowSlugs\.some.*index\.html/);
  assert.match(sitemap, /https:\/\/learn\.nexscope\.ai\/tools\/seo-keyword-planner\//);
});
