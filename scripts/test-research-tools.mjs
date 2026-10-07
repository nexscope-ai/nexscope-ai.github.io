import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  asRows, compareKeywordSamples, display, isInsufficientCreditsError, readStoredKey, runResearchAnalysis, runResearchApi,
  saveStoredKey,
  safeLink,
} from '../lib/research-tool-api.ts';
import { reportEvidence } from '../lib/research-report-evidence.ts';
import { researchTools } from '../lib/research-tools.ts';
import { toolCards } from '../lib/tool-plaza.ts';
import { dataCreditsUrl } from '../lib/tool-credit-modal.ts';
import {
  amazonBullets, amazonDescription, amazonSignals, amazonSpecifications, amazonVariants,
  nicheSignals, percentage, quantityTiers, reportedPrice, sortSupplierEntries, supplierSignals,
} from '../lib/research-result-format.ts';

void test('only the three requested research tools are registered for static pages', () => {
  assert.deepEqual(researchTools.map((tool) => tool.slug), [
    'amazon-niche-opportunity-evaluator',
    'amazon-product-price-checker',
    '1688-wholesale-price-finder',
  ]);
  assert.equal(new Set(researchTools.map((tool) => tool.slug)).size, 3);
  assert.equal(researchTools.some((tool) => tool.slug.includes('video')), false);
  assert.equal(researchTools.some((tool) => tool.slug.includes('margin')), false);
});

void test('nested provider rows, missing metrics and bounded keyword gaps are preserved', () => {
  assert.equal(asRows({ data: { data: [{ keyword: 'bag' }] } }).length, 1);
  assert.equal(asRows({ stores: [{ storeDomain: 'example.com' }] }).length, 1);
  assert.equal(display(null), 'Not reported');
  assert.equal(display(0), '0');
  assert.deepEqual(compareKeywordSamples([{ keyword: 'Lunch Bag' }], [
    { keyword: 'lunch bag' }, { keyword: 'cooler bag' },
  ]).map((row) => row.keyword), ['cooler bag']);
  assert.equal(safeLink('javascript:alert(1)'), null);
});

void test('React tool key helper uses the shared localStorage key and migrates a previous session value', () => {
  const previousLocal = globalThis.localStorage;
  const previousSession = globalThis.sessionStorage;
  const local = new Map();
  const session = new Map([['nexscope.tools.api-key.v1', 'nk-old']]);
  globalThis.localStorage = {
    getItem(key) { return local.get(key) ?? null; },
    setItem(key, value) { local.set(key, value); },
    removeItem(key) { local.delete(key); },
  };
  globalThis.sessionStorage = {
    getItem(key) { return session.get(key) ?? null; },
    setItem(key, value) { session.set(key, value); },
    removeItem(key) { session.delete(key); },
  };
  try {
    assert.equal(readStoredKey(), 'nk-old');
    assert.equal(local.get('nexscope.tools.api-key.v1'), 'nk-old');
    assert.equal(session.size, 0);
    saveStoredKey(' nk-new ');
    assert.equal(readStoredKey(), 'nk-new');
    saveStoredKey('');
    assert.equal(readStoredKey(), '');
  } finally {
    if (previousLocal === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousLocal;
    if (previousSession === undefined) delete globalThis.sessionStorage;
    else globalThis.sessionStorage = previousSession;
  }
});

void test('niche results reveal reported demand, competition and entry signals with correctly scaled rates', () => {
  const groups = nicheSignals({
    searchVolumeWeekly: 864710, unitsSoldWeekly: 0, productCount: 85, avgPrice: 19.82,
    top5BrandsClickShare: 0.34, launchRateSemiannual: 1, returnRateAnnual: 0.0234,
    searchVolumeGrowthWeekly: -0.1256, brandCount: 59, cpc: { medium: 0.89 },
    successfulLaunchedSemiannual: 2, profitMarginGt50PctSkuRatio: 0.075159,
  }, 'US');
  assert.deepEqual(groups.primary.find((item) => item.label === 'Top 5 brands’ click share')?.value, '34%');
  assert.deepEqual(groups.primary.find((item) => item.label === 'New launch success (6 mo.)')?.value, '100%');
  assert.deepEqual(groups.primary.find((item) => item.label === 'Weekly units sold')?.value, '0');
  assert.deepEqual(groups.demand.find((item) => item.label === 'Weekly search growth')?.value, '-12.56%');
  assert.deepEqual(groups.competition.find((item) => item.label === 'CPC median')?.value, '$0.89');
  assert.deepEqual(groups.entry.find((item) => item.label === 'Products with >50% margin')?.value, '7.52%');
  assert.equal(percentage(null), null);
});

void test('1688 results preserve zero, orders and sales while omitting absent fields and parsing tiers safely', () => {
  const row = {
    price: 7.5, consignPrice: 7.5, currency: '¥', quantityBegin: 1,
    salesOrderCount: 5987, salesQuantity: 6165, estimatedSalesAmount: 46237,
    deliveryTime: '48', availableDate: '2025-08-01', company: 'Example supplier',
    quantityPrices: '[{"quantity":"≥1","value":"¥7.50"}]',
  };
  const groups = supplierSignals(row);
  assert.equal(reportedPrice(row.price, row.currency), '¥7.5');
  assert.equal(groups.primary.find((item) => item.label === 'Orders (provider period)')?.value, '5,987');
  assert.equal(groups.primary.find((item) => item.label === 'Estimated sales (provider period)')?.value, '¥46,237');
  assert.equal(groups.primary.some((item) => item.label === 'Category'), false);
  assert.deepEqual(quantityTiers(row.quantityPrices), [{ quantity: '≥1', price: '¥7.50' }]);
  assert.deepEqual(quantityTiers('{bad json'), []);
  assert.deepEqual(quantityTiers([{ quantity: '10', value: '¥6' }, { quantity: '', value: '¥5' }]), [{ quantity: '10', price: '¥6' }]);
});

void test('1688 candidate sorting keeps provider order stable and puts unreported prices last', () => {
  const candidates = [
    { offerId: 'a', price: 10, quantityBegin: 3, salesOrderCount: 0 },
    { offerId: 'b', price: 5, quantityBegin: 1, salesOrderCount: 8 },
    { offerId: 'c', quantityBegin: 2, salesOrderCount: 4 },
    { offerId: 'd', price: 0, salesOrderCount: 8 },
  ];
  const ids = (sort) => sortSupplierEntries(candidates, sort).map(({ row }) => row.offerId);
  assert.deepEqual(ids('provider'), ['a', 'b', 'c', 'd']);
  assert.deepEqual(ids('price-asc'), ['b', 'a', 'c', 'd']);
  assert.deepEqual(ids('price-desc'), ['a', 'b', 'c', 'd']);
  assert.deepEqual(ids('min-order'), ['b', 'c', 'a', 'd']);
  assert.deepEqual(ids('orders-desc'), ['b', 'd', 'c', 'a']);
});

void test('Amazon price results show promotions and buyer context without inventing missing data', () => {
  const row = {
    extractedPrice: 24.99, extractedOldPrice: 32.99, currency: 'USD',
    discount: '24% off', saveWithCoupon: '$2 coupon', rating: 4.6, ratings: 724,
    boughtLastMonthCount: 0, prime: false, stock: 'In stock', brand: 'Example',
    productDetails: { manufacturer: 'Example Co', productDimensions: '8 x 4 in' },
    customerReviews: { fiveStar: 500, oneStar: 0 },
    aboutItem: ['Lightweight design', { text: 'Reusable cover' }, null],
    itemSpecifications: { Material: 'Cotton', Nested: { ignored: true } },
    variants: [{ title: 'Color', items: [{ name: 'Blue' }, { asin: 'B072MQ5BRX' }] }],
  };
  const groups = amazonSignals(row);
  assert.equal(groups.primary.find((item) => item.label === 'Previous price')?.value, '$32.99');
  assert.equal(groups.primary.find((item) => item.label === 'Bought last month')?.value, '0');
  assert.equal(groups.primary.find((item) => item.label === 'Prime')?.value, 'No');
  assert.equal(groups.promotions.find((item) => item.label === 'Coupon savings')?.value, '$2 coupon');
  assert.equal(groups.specifications.find((item) => item.label === 'Dimensions')?.value, '8 x 4 in');
  assert.equal(groups.reviewDistribution.find((item) => item.label === '1 star')?.value, '0');
  assert.deepEqual(amazonBullets(row), ['Lightweight design', 'Reusable cover']);
  assert.deepEqual(amazonSpecifications(row), [{ label: 'Material', value: 'Cotton' }]);
  assert.deepEqual(amazonVariants(row), [{ title: 'Color', items: ['Blue', 'B072MQ5BRX'] }]);
  assert.equal(amazonDescription({ description: 'A useful product description.' }), 'A useful product description.');
  assert.equal(amazonDescription({ productDescription: '{"aplus":true}' }), null);
  assert.equal(amazonSignals({}).primary.length, 0);
});

void test('Amazon and 1688 price lookups are independent paid API tools', async () => {
  const amazon = researchTools.find((item) => item.kind === 'amazon-price');
  const supplier = researchTools.find((item) => item.kind === 'supplier-price');
  assert.equal(amazon?.primaryApi, 'amazon-product-detail');
  assert.equal(supplier?.primaryApi, '1688-product-search');
  assert.deepEqual(amazon?.additionalApis, []);
  assert.deepEqual(supplier?.additionalApis, []);
  assert.match(amazon.method, /no margin calculation is performed/);
  assert.match(supplier.method, /no margin calculation is performed/);
  assert.match(amazon.method, /LLM analysis request runs automatically/);
  assert.match(supplier.method, /LLM analysis request runs automatically/);
  assert.match(researchTools.find((item) => item.kind === 'niche')?.method || '', /LLM analysis request automatically/);
  const runtime = await readFile(new URL('../components/price-lookup-runtime.tsx', import.meta.url), 'utf8');
  assert.match(runtime, /runResearchApi\(slug/);
  assert.doesNotMatch(runtime, /marginScenario|Calculate margin|Free local calculation/);
});

void test('all static tool workflows stack setup above full-width results', async () => {
  const root = new URL('../', import.meta.url);
  const researchRuntime = await readFile(new URL('components/research-tool-runtime.tsx', root), 'utf8');
  const priceRuntime = await readFile(new URL('components/price-lookup-runtime.tsx', root), 'utf8');
  const workflowRoute = await readFile(new URL('app/tools/[slug]/page.tsx', root), 'utf8');
  const plannerRoute = await readFile(new URL('app/tools/seo-keyword-planner/page.tsx', root), 'utf8');
  const researchStyles = await readFile(new URL('public/assets/research-tools.css', root), 'utf8');
  const workflowStyles = await readFile(new URL('public/assets/workflow-tools.css', root), 'utf8');
  const plannerStyles = await readFile(new URL('public/assets/seo-keyword-planner.css', root), 'utf8');
  assert.match(researchRuntime, /<div className="rt-grid">[\s\S]*?<div className="rt-panel rt-form-panel">[\s\S]*?<div className="rt-panel rt-results">/);
  assert.match(priceRuntime, /<div className="rt-grid">[\s\S]*?<div className="rt-panel rt-form-panel">[\s\S]*?<div className="rt-panel rt-results">/);
  assert.match(researchStyles, /\.research-tool-page \.rt-grid\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
  assert.match(researchStyles, /\.rt-workflow--amazon \.rt-form\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(researchStyles, /\.rt-workflow--amazon \.rt-form>\.rt-key-box\{grid-column:1\/-1\}/);
  assert.match(researchStyles, /\.rt-workflow--price \.rt-form>\.rt-primary\{[^}]*grid-column:1\/-1;[^}]*white-space:normal/);
  assert.match(researchStyles, /@media\(max-width:700px\)\{\.research-tool-page \.rt-workflow--price \.rt-form\{grid-template-columns:1fr\}/);
  assert.doesNotMatch(researchStyles, /\.rt-workflow--amazon \.rt-form>\.rt-primary\{[^}]*white-space:nowrap/);
  assert.match(workflowRoute, /className="wf-shell"[\s\S]*?className="wf-input-panel"[\s\S]*?className="wf-output-panel"/);
  assert.match(workflowStyles, /\.wf-shell\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
  assert.match(plannerRoute, /className="seo-workspace-grid"[\s\S]*?className="seo-card seo-form-card"[\s\S]*?className="seo-card seo-results-card"/);
  assert.match(plannerStyles, /\.seo-workspace-grid\{[^}]*grid-template-columns:minmax\(0,1fr\)/);
});

void test('AI report evidence is bounded, preserves zero and excludes raw HTML or unrelated data', () => {
  const niche = reportEvidence('niche', { data: { data: [{ nicheId: 'n-1', nicheTitle: 'lunch box',
    unitsSoldWeekly: 0, top5BrandsClickShare: 0.34, rawHtml: '<secret>' }] } }, 'lunch box', 'US');
  assert.equal(niche?.resultCount, 1);
  assert.equal(niche?.data[0].unitsSoldWeekly, 0);
  assert.equal(niche?.data[0].top5BrandsClickShare, 0.34);
  assert.equal(JSON.stringify(niche).includes('rawHtml'), false);
  assert.equal(reportEvidence('niche', { data: [] }, 'none', 'US'), null);

  const amazon = reportEvidence('amazon-price', { products: [{ asin: 'B072MQ5BRX', title: 'Item',
    extractedPrice: 0, currency: 'USD', rawHtmlFile: 'private/raw.html',
    aboutItem: ['Lightweight'], customerReviews: { oneStar: 0 } }] }, 'B072MQ5BRX', 'amazon.com');
  assert.equal(amazon?.products[0].extractedPrice, 0);
  assert.equal(amazon?.products[0].customerReviews.oneStar, 0);
  assert.equal(JSON.stringify(amazon).includes('rawHtmlFile'), false);
  assert.equal(reportEvidence('amazon-price', { products: [] }, 'B072MQ5BRX', 'amazon.com'), null);

  const supplier = reportEvidence('supplier-price', { products: [{ offerId: 123, price: 7.5,
    currency: '¥', quantityPrices: '[{"quantity":"≥1","value":"¥7.50"}]', secret: 'omit' }] }, '瑜伽垫', '');
  assert.equal(supplier?.products[0].offerId, 123);
  assert.deepEqual(supplier?.products[0].quantityPrices, [{ quantity: '≥1', price: '¥7.50' }]);
  assert.equal(JSON.stringify(supplier).includes('secret'), false);
});

void test('LLM analysis uses a separate authenticated endpoint without rerunning source API', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return new Response(JSON.stringify({ code: 0, ts: '1', data: { language: 'English', analysis: '## Findings\n\n- Evidence.' } }), { status: 200 });
  };
  try {
    const markdown = await runResearchAnalysis('1688-product-search', { products: [{ price: 0 }] }, 'test-key');
    assert.equal(markdown, '## Findings\n\n- Evidence.');
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/1688-product-search\/analyze$/);
    assert.equal(calls[0].options.headers.Authorization, 'Bearer test-key');
    assert.equal(calls[0].options.credentials, 'omit');
    assert.deepEqual(JSON.parse(calls[0].options.body), { language: 'English', rawData: { products: [{ price: 0 }] } });
    await assert.rejects(runResearchAnalysis('unknown-skill', {}, 'test-key'), /Unsupported/);
    assert.equal(calls.length, 1);
    globalThis.fetch = async () => new Response(JSON.stringify({ code: 1001, ts: '1', msg: 'Insufficient credits.' }), { status: 200 });
    await assert.rejects(runResearchAnalysis('amazon-product-detail', { products: [] }, 'test-key'), /Insufficient credits/);
  } finally { globalThis.fetch = original; }
});

void test('only explicit platform credit failures trigger the Data top-up path', async () => {
  const original = globalThis.fetch;
  try {
    for (const code of [13011, 16002, 17001, 18001, 440215, -40002]) {
      globalThis.fetch = async () => new Response(JSON.stringify({ code, msg: 'Account has insufficient credits.', data: null }), { status: 200 });
      await assert.rejects(runResearchApi('amazon-product-detail', {}, 'test-key'), isInsufficientCreditsError);
    }
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'payment required' }), { status: 402 });
    await assert.rejects(runResearchAnalysis('amazon-product-detail', {}, 'test-key'), isInsufficientCreditsError);
    globalThis.fetch = async () => new Response(JSON.stringify({ code: 13011, msg: 'Insufficient credits' }), { status: 400 });
    await assert.rejects(runResearchApi('amazon-product-detail', {}, 'test-key'), isInsufficientCreditsError);
    globalThis.fetch = async () => new Response(JSON.stringify({ code: 1001, ts: '1', msg: 'Insufficient credits is only example text.' }), { status: 200 });
    await assert.rejects(runResearchApi('amazon-product-detail', {}, 'test-key'), (error) => !isInsufficientCreditsError(error));
    const url = new URL(dataCreditsUrl('/tools/amazon-product-price-checker/'));
    assert.equal(url.origin, 'https://www.nexscope.ai');
    assert.equal(url.pathname, '/seller/billing');
    assert.equal(url.searchParams.get('mode'), 'data');
    assert.equal(url.searchParams.get('utm_content'), 'amazon-product-price-checker');
    assert.equal(url.hash, '#top-up');
  } finally { globalThis.fetch = original; }
});

void test('every static tools route shares the credit modal host and error event', async () => {
  const root = new URL('../', import.meta.url);
  const layout = await readFile(new URL('app/tools/layout.tsx', root), 'utf8');
  const host = await readFile(new URL('components/tool-credit-modal-host.tsx', root), 'utf8');
  const workflow = await readFile(new URL('public/assets/workflow-tools.js', root), 'utf8');
  const planner = await readFile(new URL('public/assets/seo-keyword-planner.js', root), 'utf8');
  const price = await readFile(new URL('components/price-lookup-runtime.tsx', root), 'utf8');
  const research = await readFile(new URL('components/research-tool-runtime.tsx', root), 'utf8');
  assert.match(layout, /<ToolCreditModalHost\s*\/>/);
  assert.match(host, /TOOL_CREDIT_MODAL_EVENT/);
  assert.match(host, /Buy Data credits/);
  for (const source of [workflow, planner]) assert.match(source, /nexscope:insufficient-credits/);
  for (const source of [price, research]) assert.match(source, /showToolCreditModal/);
});

void test('API request sends the visitor key only as bearer auth and omits credentials', async () => {
  const original = globalThis.fetch;
  let seen;
  globalThis.fetch = async (url, options) => {
    seen = { url, options };
    return new Response(JSON.stringify({ code: 0, ts: '1', data: { data: [] } }), {
      status: 200, headers: { 'content-type': 'application/json' },
    });
  };
  try {
    await runResearchApi('shopify-store-query', { searchKey: 'example' }, 'test-key');
    assert.equal(seen.url, 'https://api.nexscope.ai/api/skill-api/v1/skills/shopify-store-query/run');
    assert.equal(seen.options.headers.Authorization, 'Bearer test-key');
    assert.equal(seen.options.credentials, 'omit');
    assert.equal(seen.options.referrerPolicy, 'no-referrer');
    assert.equal(seen.options.body.includes('test-key'), false);
  } finally { globalThis.fetch = original; }
});

void test('direct provider success and business failures are interpreted separately', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ code: '200', errcode: 200, items: [] }), { status: 200 });
    assert.deepEqual(asRows(await runResearchApi('chuhaijiang-tiktok-ad-search', { country: 'us' }, 'test-key')), []);
    globalThis.fetch = async () => new Response(JSON.stringify({ code: 99001, ts: '1', data: null }), { status: 200 });
    await assert.rejects(runResearchApi('shopify-store-query', {}, 'test-key'), /did not complete/);
  } finally { globalThis.fetch = original; }
});

void test('only requested new routes appear in the plaza, sitemap and analytics exception list', async () => {
  const script = await readFile(new URL('./prepare-github-pages.mjs', import.meta.url), 'utf8');
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  for (const tool of researchTools) {
    assert.ok(script.includes(`'${tool.slug}'`));
    assert.ok(sitemap.includes(`/tools/${tool.slug}/`));
    assert.ok(toolCards.some((card) => card.href === `/tools/${tool.slug}/`));
  }
  for (const slug of [
    'shopify-competitor-store-snapshot',
    'amazon-keyword-exposure-gap',
    'tiktok-ad-product-evidence',
    'ai-shopping-readiness-check',
  ]) {
    assert.ok(!script.includes(`'${slug}'`));
    assert.ok(!sitemap.includes(`/tools/${slug}/`));
    assert.ok(!toolCards.some((card) => card.href === `/tools/${slug}/`));
  }
});
