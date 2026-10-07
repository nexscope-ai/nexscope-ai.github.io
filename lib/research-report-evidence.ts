import { asRecord, asRows, numeric, pick, type RecordValue } from './research-tool-api.ts';
import { amazonBullets, quantityTiers } from './research-result-format.ts';

export type ReportKind = 'niche' | 'amazon-price' | 'supplier-price';

function compact(row: RecordValue, keys: string[]): RecordValue {
  const output: RecordValue = {};
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) output[key] = value.trim().slice(0, 260);
    else if (typeof value === 'number' && Number.isFinite(value)) output[key] = value;
    else if (typeof value === 'boolean') output[key] = value;
  }
  return output;
}

export function reportEvidence(kind: ReportKind, response: RecordValue, query: string, market: string): RecordValue | null {
  const rows = asRows(response);
  if (kind === 'niche') {
    if (!rows.length) return null;
    const keys = ['nicheId', 'nicheTitle', 'demand', 'searchVolumeWeekly', 'searchVolumeQuarterly',
      'searchVolumeGrowthWeekly', 'searchVolumeGrowthQuarterly', 'unitsSoldWeekly', 'unitsSoldQuarterly',
      'productCount', 'brandCount', 'avgPrice', 'minimumPrice', 'maximumPrice', 'top5BrandsClickShare',
      'top5ProductsClickShare', 'launchRateSemiannual', 'newProductsLaunchedSemiannual',
      'successfulLaunchedSemiannual', 'returnRateAnnual', 'profitMarginGt50PctSkuRatio', 'acos'];
    return { keyword: query.slice(0, 100), countryCode: market, resultCount: rows.length,
      data: rows.slice(0, 10).map((row) => ({ ...compact(row, keys), cpc: compact(asRecord(row.cpc), ['low', 'medium', 'high']) })),
      caveat: 'A bounded niche sample; provider estimates, not proof of profit or future demand. Ratios are raw fractions (0.34 = 34%).' };
  }
  if (kind === 'amazon-price') {
    const product = rows.find((row) => typeof row.asin === 'string' && row.asin.toUpperCase() === query.toUpperCase());
    if (!product) return null;
    const keys = ['asin', 'title', 'brand', 'currency', 'extractedPrice', 'price', 'extractedOldPrice',
      'oldPrice', 'discount', 'saveWithCoupon', 'rating', 'ratings', 'boughtLastMonthCount',
      'stock', 'prime', 'delivery', 'seller', 'date'];
    return { asin: query.toUpperCase(), amazonDomain: market,
      products: [{ ...compact(product, keys),
        productDetails: compact(asRecord(product.productDetails), ['manufacturer', 'productDimensions', 'units']),
        customerReviews: compact(asRecord(product.customerReviews), ['fiveStar', 'fourStar', 'threeStar', 'twoStar', 'oneStar']),
        aboutItem: amazonBullets(product).map((item) => item.slice(0, 260)) }],
      caveat: 'A single listing snapshot, not a guaranteed checkout price. No competitor prices or price history were requested.' };
  }
  const products = rows.filter((row) => {
    const price = numeric(row.price);
    const identifier = pick(row, 'offerId', 'asin');
    return (typeof row.title === 'string' && Boolean(row.title.trim())) || (price !== null && price > 0)
      || (typeof identifier === 'string' && Boolean(identifier.trim()))
      || (typeof identifier === 'number' && Number.isSafeInteger(identifier));
  }).slice(0, 10);
  if (!products.length) return null;
  const keys = ['asin', 'offerId', 'title', 'company', 'price', 'consignPrice', 'currency',
    'quantityBegin', 'salesOrderCount', 'salesQuantity', 'estimatedSalesAmount', 'deliveryTime',
    'availableDate', 'levelName', 'unit'];
  return { keyWord: query.slice(0, 50), resultCount: products.length,
    products: products.map((row) => ({ ...compact(row, keys), quantityPrices: quantityTiers(row.quantityPrices) })),
    caveat: 'Search candidates, not verified quotes or proof of product equivalence. Sales periods may be unspecified. Confirm quantity tiers, currency, shipping and supplier terms.' };
}
