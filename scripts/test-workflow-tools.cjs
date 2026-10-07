/* oxlint-disable typescript/no-require-imports, typescript/no-floating-promises, typescript/unbound-method */
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');
const moduleScope = { exports: {} };
runInNewContext(readFileSync(join(__dirname, '..', 'public', 'assets', 'workflow-tools-core.js'), 'utf8'),
  { module: moduleScope, URL, Intl });
const core = moduleScope.exports;

test('Amazon input accepts supported marketplaces and rejects lookalike hosts', () => {
  assert.equal(core.amazonAsin('b072mq5brx'), 'B072MQ5BRX');
  assert.equal(core.amazonAsin('https://www.amazon.co.uk/gp/product/B08N5WRWNW'), 'B08N5WRWNW');
  assert.equal(core.amazonDomainFromUrl('https://www.amazon.co.uk/dp/B08N5WRWNW'), 'amazon.co.uk');
  assert.equal(core.amazonAsin('https://amazon.com.evil.test/dp/B072MQ5BRX'), null);
  assert.equal(core.amazonAsin('http://www.amazon.com/dp/B072MQ5BRX'), null);
});

test('large product and creator IDs remain strings', () => {
  assert.equal(core.productId({ asin: '1732052189676081387' }), '1732052189676081387');
  assert.equal(core.productId({ productId: Number('1732052189676081387') }), null);
  assert.equal(core.creatorId({ user_id: '7302162228386776110' }), '7302162228386776110');
  assert.equal(core.creatorId({ user_id: Number('7302162228386776110') }), null);
});

test('creator shortlists omit empty records but keep identifiable profiles', () => {
  const rows = [
    { user_id: null, nickname: null, unique_id: null },
    { user_id: '7302162228386776110', nickname: null },
    { user_id: null, nickname: '  Useful creator  ' },
    { unique_id: ' @sample.creator ' },
  ];
  assert.equal(core.creatorIdentity(rows[0]).usable, false);
  assert.equal(core.creatorIdentity(rows[1]).id, '7302162228386776110');
  assert.equal(core.creatorIdentity(rows[2]).nickname, 'Useful creator');
  assert.equal(core.creatorIdentity(rows[3]).handle, 'sample.creator');
  assert.deepEqual(core.usableCreators(rows), rows.slice(1));
});

test('sales pace distinguishes missing values from reported zero', () => {
  assert.equal(core.salesPace({ totalSale7dCnt: null, totalSale30dCnt: 30 }), null);
  assert.equal(core.salesPace({ totalSale7dCnt: 0, totalSale30dCnt: 0 }).ratio, null);
  assert.equal(core.salesPace({ totalSale7dCnt: 14, totalSale30dCnt: 30 }).ratio, 2);
});

test('missing metrics remain missing and zero remains zero', () => {
  assert.equal(core.formatNumber(null), 'Not reported');
  assert.equal(core.formatNumber(0), '0');
  assert.equal(core.formatMoney(null, 'CNY'), 'Not reported');
});

test('ranking and detail cards include cumulative sales, GMV, ratings and reviews', () => {
  const ui = readFileSync(join(__dirname, '..', 'public', 'assets', 'workflow-tools.js'), 'utf8');
  for (const field of ['totalSaleCnt', 'totalSaleGmvAmt', 'productRating', 'reviewCount']) {
    assert.ok(ui.includes(`product.${field}`), `${field} is shown in the results`);
  }
  for (const field of ['totalSaleGmv1dAmt', 'totalSaleGmv7dAmt', 'totalSaleGmv30dAmt',
    'totalVideo30dCnt', 'totalIflVideo30dCnt', 'totalLive30dCnt', 'totalViews30dCnt']) {
    assert.ok(ui.includes(`product.${field}`), `${field} is shown in detail`);
  }
  assert.ok(!ui.includes('currencyFor('), 'currency is not inferred from the market');
});

test('supplier lookup requires a matching ASIN and HTTPS image', () => {
  const product = core.amazonProduct({ products: [
    { asin: 'B000000001', imageUrl: 'https://example.com/wrong.jpg' },
    { asin: 'B072MQ5BRX', imageUrl: 'javascript:alert(1)', productImageUrls: ['https://example.com/right.jpg'] },
  ] }, 'B072MQ5BRX');
  assert.equal(core.amazonImage(product), 'https://example.com/right.jpg');
  assert.equal(core.amazonProduct({ products: [] }, 'B072MQ5BRX'), null);
});

test('provider records are read from the documented envelope', () => {
  assert.deepEqual(core.rows({ data: { items: [{ user_id: '7302162228386776110' }] } }, 'creator'),
    [{ user_id: '7302162228386776110' }]);
  assert.deepEqual(core.rows({ products: [{ asin: '1732052189676081387' }] }),
    [{ asin: '1732052189676081387' }]);
});

test('video lists omit placeholder-only records but retain usable descriptions or safe links', () => {
  const productVideos = [
    { video_id: '123' },
    { video_desc: '   ', video_play_count: 0 },
    { video_desc: 'A real clip', video_play_count: 0 },
    { share_url: 'https://www.tiktok.com/@seller/video/123' },
    { share_url: 'javascript:alert(1)', video_play_count: 50 },
  ];
  assert.deepEqual(core.usableVideos(productVideos, 'product'), [productVideos[2], productVideos[3]]);
  assert.deepEqual(core.usableVideos([{ tiktok_creator_detail_video_desc: 'Tagged product' },
    { tiktok_creator_detail_video_id: '456' }], 'creator'),
  [{ tiktok_creator_detail_video_desc: 'Tagged product' }]);
});

test('skill calls use only allowlisted URLs and Authorization, not query parameters', async () => {
  let request;
  const fetcher = async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ code: 0, data: { products: [] } }) };
  };
  await core.runSkill(fetcher, 'tiktok-new-product-rank', { date: '2026-10-05' }, 'nk-test');
  assert.equal(request.url, `${core.API_BASE}/tiktok-new-product-rank/run`);
  assert.equal(request.options.headers.Authorization, 'Bearer nk-test');
  assert.equal(request.options.credentials, 'omit');
  assert.equal(request.options.cache, 'no-store');
  assert.ok(!request.url.includes('nk-test'));
  await assert.rejects(core.runSkill(fetcher, '../another-path', {}, 'nk-test'), /Unsupported/);
});

test('HTTP success with business failure is not displayed as a result', async () => {
  const fetcher = async () => ({ ok: true, json: async () => ({ code: 99001, msg: 'secret diagnostics' }) });
  await assert.rejects(core.runSkill(fetcher, 'amazon-product-detail', {}, 'nk-test'), /code 99001/);
});

test('auth failures never echo the key or provider diagnostics', async () => {
  const fetcher = async () => ({ ok: false, status: 401 });
  await assert.rejects(core.runSkill(fetcher, '1688-search-by-image', {}, 'nk-secret'),
    error => !error.message.includes('nk-secret') && /key was rejected/.test(error.message));
});

test('the root-site routes, sitemap and analytics exception cover all three tools', () => {
  const root = join(__dirname, '..');
  const route = readFileSync(join(root, 'app', 'tools', '[slug]', 'page.tsx'), 'utf8');
  const data = readFileSync(join(root, 'lib', 'workflow-tools.ts'), 'utf8');
  const sitemap = readFileSync(join(root, 'public', 'sitemap.xml'), 'utf8');
  const exportScript = readFileSync(join(root, 'scripts', 'prepare-github-pages.mjs'), 'utf8');
  const directory = readFileSync(join(root, 'app', 'tools', 'page.tsx'), 'utf8');
  const analytics = readFileSync(join(root, 'public', 'analytics.js'), 'utf8');
  for (const slug of ['amazon-to-1688-supplier-finder', 'tiktok-shop-new-product-validator', 'tiktok-shop-creator-match']) {
    assert.ok(data.includes(`slug: '${slug}'`));
    assert.ok(sitemap.includes(`https://learn.nexscope.ai/tools/${slug}/`));
    assert.ok(exportScript.includes(`'${slug}'`));
  }
  assert.match(route, /name="apiKey"\s+type="text"/);
  assert.match(route, /https:\/\/www\.nexscope\.ai\/seller\/api-access/);
  assert.match(route, /tab: 'api-keys'/);
  assert.match(route, /mode: 'data'/);
  assert.match(route, /'co-from': 'learn'/);
  assert.match(route, /utm_source: 'learn\.nexscope\.ai'/);
  assert.match(route, /utm_medium: 'referral'/);
  assert.match(route, /utm_campaign: `workflow_\$\{tool\.slug\}`/);
  assert.doesNotMatch(route, /data-toggle-key/);
  assert.doesNotMatch(route, /wf-privacy|Sent only to api\.nexscope\.ai/);
  assert.match(route, /data-run-tool/);
  assert.doesNotMatch(route, /<form\b/i);
  assert.match(exportScript, /interactiveWorkflowSlugs\.some[\s\S]*index\.html/);
  assert.match(directory, /data-track-tool=/);
  assert.match(analytics, /workflow_open_click/);
  assert.match(route, /decisionGuide\.question/);
});
