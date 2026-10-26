import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  parseOfferId,
  validQuantity,
  decimalPrice,
  merchandiseSubtotal,
  normalizeOffer,
  detailEvidence,
  exampleOffer,
  offerCsv,
} from '../lib/1688-detail.ts';
import {
  runResearchApi,
  runResearchAnalysis,
} from '../lib/research-tool-api.ts';

test('offer identifiers remain exact strings and unsafe or unrelated links are rejected', () => {
  const id = '123456789012345678901234567890';
  assert.equal(parseOfferId(id), id);
  assert.equal(
    parseOfferId(`https://detail.1688.com/offer/${id}.html?tracking=1`),
    id,
  );
  for (const value of [
    '0',
    '01',
    '1e20',
    'https://detail.1688.com.evil.test/offer/123.html',
    'http://detail.1688.com/offer/123.html',
    'https://u:p@detail.1688.com/offer/123.html',
    'https://detail.1688.com:444/offer/123.html',
  ])
    assert.equal(parseOfferId(value), null, value);
  assert.equal(validQuantity('1'), 1);
  assert.equal(validQuantity('0'), null);
  assert.equal(validQuantity('1.5'), null);
  assert.equal(validQuantity('10000000'), null);
});
test('subtotal arithmetic preserves decimal precision and never fabricates missing prices', () => {
  assert.equal(merchandiseSubtotal('0.29', 100), '29.00');
  assert.equal(merchandiseSubtotal('12.3456', 3), '37.0368');
  assert.equal(merchandiseSubtotal('0', 2), '0.00');
  assert.equal(merchandiseSubtotal(null, 10), null);
  assert.equal(decimalPrice('¥12.50'), null);
  assert.equal(decimalPrice('Infinity'), null);
  assert.equal(decimalPrice(-1), null);
});
test('normalization preserves zero stock, missing retail prices and different shipping units', () => {
  const offer = normalizeOffer(exampleOffer, '1234567890123');
  assert(offer);
  assert.equal(offer.rows[1].stock, '0');
  assert.equal(offer.rows[1].retail, null);
  assert.equal(
    offer.shipping.find((row) => row.field === 'shippingInfo.weight').unit,
    'kg',
  );
  assert.equal(
    offer.shipping.find((row) =>
      row.field.includes('skuShippingInfoList[0].weight'),
    ).unit,
    'g',
  );
  assert.equal(normalizeOffer({}, '123'), null);
  assert.throws(
    () => normalizeOffer({ ...exampleOffer, offerId: '999' }, '1234567890123'),
    /does not match/,
  );
  assert.throws(
    () => normalizeOffer({ ...exampleOffer, offerId: 9007199254740993 }, '123'),
    /imprecise/,
  );
});
test('normalization accepts the documented product wrapper without losing SKU evidence', () => {
  for (const payload of [
    { product: exampleOffer },
    { data: { product: exampleOffer } },
  ]) {
    const offer = normalizeOffer(payload, '1234567890123');
    assert(offer);
    assert.equal(offer.rows.length, 2);
    assert.equal(offer.tiers[0].price, '12.50');
    assert.equal(offer.company, 'Example supplier (not verified)');
  }
});
test('detail report includes source listing fields and preserves the full API product for inspection', () => {
  const product = {
    ...exampleOffer,
    status: 'published',
    createDate: '2026-01-01',
    soldOut: '0',
    productAttributes: [{ attributeName: 'Material', value: 'PVC' }],
    saleInfo: { ...exampleOffer.saleInfo, amountOnSale: 0 },
  };
  const offer = normalizeOffer({ product }, '1234567890123');
  assert(offer);
  assert.equal(offer.status, 'published');
  assert.equal(offer.stock, '0');
  assert.equal(offer.soldOut, '0');
  assert.deepEqual(offer.attributes, [{ name: 'Material', value: 'PVC' }]);
  assert.equal(offer.sourceFields.productAttributes.length, 1);
  assert.equal(detailEvidence(offer, 10, '2026-10-26').listing.stock, '0');
});
test('LLM evidence is bounded, excludes unapproved raw fields and discloses omitted rows', () => {
  const raw = {
    ...exampleOffer,
    apiKey: 'secret-never-in-report',
    description: '<script>unsafe raw HTML</script>',
    skuList: Array.from({ length: 600 }, (_, i) => ({
      skuId: String(i),
      price: '1.20',
      attributes: [{ name: 'Note', value: 'x'.repeat(2000) }],
    })),
  };
  const offer = normalizeOffer(raw, '1234567890123');
  assert.equal(offer.returnedSkuCount, 600);
  assert.equal(offer.rows.length, 500);
  const evidence = detailEvidence(offer, 50, '2026-10-26T00:00:00Z');
  const json = JSON.stringify(evidence);
  assert.equal(evidence.coverage.returnedSkuCount, 600);
  assert.equal(evidence.coverage.includedSkuCount, 30);
  assert(!json.includes('secret-never-in-report'));
  assert(!json.includes('<script>'));
  assert(json.length < 54000);
  assert.match(evidence.analysisTask, /untrusted data/);
  assert.match(evidence.analysisTask, /Cite SKU row IDs/);
});
test('CSV neutralizes formula cells and retains field labels and observed identifiers', () => {
  const offer = normalizeOffer(
    {
      ...exampleOffer,
      skuList: [
        {
          skuId: '123456789012345678901',
          attributes: [{ name: '=cmd', value: 'unsafe' }],
          price: '1.20',
        },
      ],
    },
    '1234567890123',
  );
  const csv = offerCsv(offer, '2026-10-26T00:00:00Z');
  assert(csv.includes('123456789012345678901'));
  assert(csv.includes('"\'=cmd: unsafe"'));
  assert(csv.includes('wholesalePriceCNY'));
});
test(
  'lookup and AI report use separate authenticated requests without putting a key in their bodies',
  { concurrency: false },
  async () => {
    const original = globalThis.fetch;
    const calls = [];
    globalThis.fetch = async (url, options) => {
      calls.push({ url, options });
      return new Response(
        JSON.stringify({
          code: 0,
          ts: '1',
          data: String(url).endsWith('/analyze')
            ? { analysis: '## Checks\n\nSource evidence.' }
            : exampleOffer,
        }),
      );
    };
    try {
      const data = await runResearchApi(
        '1688-product-detail',
        { offerId: '1234567890123' },
        'test-key',
      );
      assert.equal(calls.length, 1);
      assert.equal(data.offerId, '1234567890123');
      const evidence = detailEvidence(
        normalizeOffer(data, '1234567890123'),
        10,
        '2026-10-26T00:00:00Z',
      );
      assert.match(
        await runResearchAnalysis('1688-product-detail', evidence, 'test-key'),
        /Source evidence/,
      );
      assert.equal(calls.length, 2);
      assert(calls[1].url.endsWith('/1688-product-detail/analyze'));
      for (const call of calls) {
        assert.equal(call.options.headers.Authorization, 'Bearer test-key');
        assert(!call.options.body.includes('test-key'));
        assert.equal(call.options.credentials, 'omit');
      }
    } finally {
      globalThis.fetch = original;
    }
  },
);
test('the new tool shares and clears the browser key but disables paid AI for the illustrative example', async () => {
  const source = await readFile(
    new URL('../components/1688-detail-runtime.tsx', import.meta.url),
    'utf8',
  );
  assert.match(source, /readStoredKey\(\)/);
  assert.match(source, /saveStoredKey\(''\)/);
  assert.match(source, /type="password"/);
  assert.match(source, /snapshot\.demo\)\s*return/);
  assert.match(source, /setReportError/);
  assert.match(source, /controller.current\?\.abort/);
});
