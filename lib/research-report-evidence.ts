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

function compactDetails(value: unknown, maxEntries = 20): RecordValue {
  const output: RecordValue = {};
  for (const [key, item] of Object.entries(asRecord(value)).slice(0, maxEntries)) {
    if (typeof item === 'string' && item.trim()) output[key.slice(0, 80)] = item.trim().slice(0, 180);
    else if (typeof item === 'number' && Number.isFinite(item)) output[key.slice(0, 80)] = item;
    else if (typeof item === 'boolean') output[key.slice(0, 80)] = item;
  }
  return output;
}

export function reportEvidence(kind: ReportKind, response: RecordValue, query: string, market: string): RecordValue | null {
  const rows = asRows(response);
  if (kind === 'niche') {
    if (!rows.length) return null;
    const keys = ['nicheId', 'nicheTitle', 'translationZh', 'demand', 'searchVolumeWeekly', 'searchVolumeQuarterly',
      'searchVolumeGrowthWeekly', 'searchVolumeGrowthQuarterly', 'unitsSoldWeekly', 'unitsSoldQuarterly',
      'clickCountWeekly', 'clickCountQuarterly', 'clickToSaleConversionWeekly',
      'clickConversionRateQuarterly', 'searchConversionRateWeekly', 'searchConversionRateQuarterly',
      'productCount', 'brandCount', 'avgPrice', 'minimumPrice', 'maximumPrice', 'top5BrandsClickShare',
      'top5ProductsClickShare', 'launchRateSemiannual', 'newProductsLaunchedSemiannual',
      'successfulLaunchedSemiannual', 'returnRateAnnual', 'profitMarginGt50PctSkuRatio', 'acos',
      'breakEvenRatio', 'avgBrandAgeNow', 'avgBrandAgeQuarterly', 'sponsoredProductsPercentage'];
    return { keyword: query.slice(0, 100), countryCode: market, resultCount: rows.length,
      providerTotal: typeof response.total === 'number' ? response.total : null, returnedCount: rows.length,
      data: rows.map((row) => ({ ...compact(row, keys), cpc: compact(asRecord(row.cpc), ['low', 'medium', 'high']) })),
      caveat: 'A bounded niche sample; provider estimates, not proof of profit or future demand. Ratios are raw fractions (0.34 = 34%).' };
  }
  if (kind === 'amazon-price') {
    const product = rows.find((row) => typeof row.asin === 'string' && row.asin.toUpperCase() === query.toUpperCase());
    if (!product) return null;
    const keys = ['asin', 'title', 'brand', 'currency', 'extractedPrice', 'price', 'extractedOldPrice',
      'oldPrice', 'discount', 'saveWithCoupon', 'rating', 'ratings', 'boughtLastMonthCount',
      'stock', 'prime', 'delivery', 'seller', 'date', 'boughtLastMonth', 'badges',
      'dimension', 'weight', 'climatePledgeFriendly', 'snapEbtEligible'];
    return { asin: query.toUpperCase(), amazonDomain: market,
      products: [{ ...compact(product, keys),
        description: typeof product.description === 'string' ? product.description.slice(0, 1000) : null,
        reviewsSummary: typeof product.reviewsSummary === 'string' ? product.reviewsSummary.slice(0, 600) : null,
        productDetails: compactDetails(product.productDetails),
        itemSpecifications: compactDetails(product.itemSpecifications),
        customerReviews: compact(asRecord(product.customerReviews), ['fiveStar', 'fourStar', 'threeStar', 'twoStar', 'oneStar']),
        aboutItem: amazonBullets(product).slice(0, 10).map((item) => item.slice(0, 260)),
        variantGroupCount: Array.isArray(product.variants) ? product.variants.length : null }],
      caveat: 'A single listing snapshot, not a guaranteed checkout price. No competitor prices or price history were requested.' };
  }
  const products = rows.filter((row) => {
    const price = numeric(row.price);
    const identifier = pick(row, 'offerId', 'asin');
    return (typeof row.title === 'string' && Boolean(row.title.trim())) || (price !== null && price > 0)
      || (typeof identifier === 'string' && Boolean(identifier.trim()))
      || (typeof identifier === 'number' && Number.isSafeInteger(identifier));
  });
  if (!products.length) return null;
  const keys = ['offerId', 'title', 'company', 'price', 'consignPrice', 'currency',
    'quantityBegin', 'salesOrderCount', 'salesQuantity', 'estimatedSalesAmount', 'deliveryTime',
    'levelName', 'unit', 'shopId', 'dataType'];
  return { keyWord: query.slice(0, 50), asOfDateUtc: new Date().toISOString().slice(0, 10), resultCount: products.length,
    providerTotal: typeof response.total === 'number' ? response.total : null,
    returnedCount: rows.length, includedCount: products.length,
    products: products.map((row) => ({ ...compact(row, keys),
      listingId: typeof row.asin === 'string' ? row.asin : undefined,
      quantityPrices: quantityTiers(row.quantityPrices) })),
    analysisTask: 'Analyze all returned 1688 supplier candidates using their reported prices, quantity tiers and provider sales fields. listingId and offerId identify 1688 listings, never Amazon ASINs. Source availability dates are intentionally excluded because their provider meaning is not verified; do not discuss future availability, launch timing or preorder status. Do not infer a sales period when none is supplied, or treat listed prices as verified quotes.',
    caveat: 'Search candidates, not verified quotes or proof of product equivalence. Sales periods may be unspecified. Confirm quantity tiers, currency, shipping and supplier terms.' };
}
