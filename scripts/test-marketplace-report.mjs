import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildMarketplaceRequest,
  marketplaceEvidence,
  normalizeMarketplaceReport,
  reportCell,
  reportCsv,
} from '../lib/marketplace-report.ts';

test('each marketplace sends documented filters and keeps period semantics explicit', () => {
  assert.deepEqual(
    buildMarketplaceRequest('1688-selection', {
      keyword: '瑜伽垫',
      minPrice: '5',
      maxPrice: '50',
      maxMoq: '100',
    }),
    {
      keyWord: '瑜伽垫',
      pageIndex: 1,
      pageSize: 20,
      cycle: '30',
      beginPrice: 5,
      endPrice: 50,
      endStartQuantity: 100,
    },
  );
  assert.deepEqual(
    buildMarketplaceRequest('shopee-competitor', {
      keyword: 'phone case',
      market: 'SG',
      minSold: '50',
    }),
    {
      station: 'SG',
      keyword: 'phone case',
      page: 1,
      pageSize: 20,
      soldMin: 50,
    },
  );
  assert.deepEqual(
    buildMarketplaceRequest('ozon-selection', {
      keyword: 'кроссовки',
      period: 'month',
      month: '2026-09',
      maxPrice: '5000',
    }),
    {
      page: {
        page: 1,
        pageSize: 20,
        orders: [{ field: 'sales', direction: 'DESC' }],
      },
      keywords: ['кроссовки'],
      price: { max: 5000 },
      searchDate: '2026-10-01',
    },
  );
  assert.throws(
    () => buildMarketplaceRequest('1688-selection', { keyword: 'yoga mat' }),
    /Simplified Chinese/,
  );
  assert.throws(
    () =>
      buildMarketplaceRequest('shopee-competitor', {
        keyword: 'case',
        market: 'XX',
      }),
    /marketplace/,
  );
  assert.throws(
    () =>
      buildMarketplaceRequest('ozon-selection', {
        keyword: 'чехол',
        minPrice: '50',
        maxPrice: '10',
      }),
    /exceed/,
  );
});

test('API report preserves every returned first-page row, zero metrics and distinct Shopee sales fields', () => {
  const response = {
    totalSize: 72,
    products: [
      {
        pid: 'a',
        title: 'Case A',
        sold: 0,
        estimateSold: 30,
        historicalSold: 400,
        price: 3.5,
        shopName: 'Shop A',
      },
      {
        pid: 'b',
        title: 'Case B',
        sold: 20,
        estimateSold: 0,
        historicalSold: 70,
        price: 6,
        shopName: 'Shop B',
      },
    ],
  };
  const report = normalizeMarketplaceReport('shopee-competitor', response);
  assert.equal(report.total, 72);
  assert.equal(report.rows.length, 2);
  assert.equal(reportCell(report.rows[0].sold), '0');
  assert.equal(reportCell(null), 'Not reported');
  const evidence = marketplaceEvidence(
    'shopee-competitor',
    report,
    { station: 'SG' },
    '2026-10-26T00:00:00Z',
  );
  assert.equal(evidence.coverage.analyzedRows, 2);
  assert.equal(evidence.products[0].estimateSold, 30);
  assert.equal(evidence.products[1].historicalSold, 70);
  assert.match(reportCsv(report, '2026-10-26T00:00:00Z'), /"20","0","70"/);
});

test('Ozon data array, 1688 products array and CSV formula safety are retained', () => {
  const ozon = normalizeMarketplaceReport('ozon-selection', {
    total: 1,
    data: [
      { sku: 123, title: 'Товар', sales: 0, revenue: 100, reviewRating: 4.5 },
    ],
  });
  assert.equal(ozon.rows[0].sales, 0);
  const wholesale = normalizeMarketplaceReport('1688-selection', {
    total: 1,
    products: [
      { title: '=SUM(A1:A2)', price: 12, consignPrice: 15, quantityBegin: 10 },
    ],
  });
  assert.equal(wholesale.rows.length, 1);
  assert.match(reportCsv(wholesale, '2026-10-26'), /'\=SUM\(A1:A2\)/);
});
