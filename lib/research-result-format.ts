import { asRecord, display, numeric, pick, type RecordValue } from './research-tool-api.ts';

const MARKET_CURRENCY: Record<string, string> = { US: 'USD', DE: 'EUR', JP: 'JPY' };
export type Signal = { label: string; value: string };

function signal(label: string, value: unknown): Signal | null {
  const rendered = display(value);
  return rendered === 'Not reported' ? null : { label, value: rendered };
}

function signals(...items: (Signal | null)[]): Signal[] {
  return items.filter((item): item is Signal => item !== null);
}

export function percentage(value: unknown): string | null {
  const fraction = numeric(value);
  if (fraction === null) return null;
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(fraction * 100)}%`;
}

export function marketplacePrice(value: unknown, market: string): string | null {
  const price = numeric(value);
  if (price === null) return null;
  const currency = MARKET_CURRENCY[market];
  if (!currency) return display(price);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

export function reportedPrice(value: unknown, currency: unknown): string | null {
  const price = numeric(value);
  if (price === null || price <= 0) return null;
  const unit = typeof currency === 'string' ? currency.trim().toUpperCase() : '';
  if (/^[A-Z]{3}$/.test(unit)) {
    try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: unit }).format(price); }
    catch { /* Keep the reported unit without guessing a currency. */ }
  }
  if (['$', '€', '£', '¥', '￥'].includes(unit)) return `${unit}${display(price)}`;
  return `${display(price)}${unit ? ` ${unit}` : ' · currency not reported'}`;
}

export function amazonSignals(row: RecordValue) {
  const details = asRecord(row.productDetails);
  const reviews = asRecord(row.customerReviews);
  return {
    primary: signals(
      signal('Previous price', reportedPrice(pick(row, 'extractedOldPrice', 'oldPrice'), row.currency)),
      signal('Rating', row.rating),
      signal('Reviews', row.ratings),
      signal('Bought last month', pick(row, 'boughtLastMonthCount', 'boughtLastMonth')),
      signal('Availability', row.stock),
      signal('Prime', typeof row.prime === 'boolean' ? row.prime ? 'Yes' : 'No' : null),
    ),
    promotions: signals(
      signal('Discount', row.discount),
      signal('Coupon savings', row.saveWithCoupon),
    ),
    specifications: signals(
      signal('Brand', row.brand),
      signal('Dimensions', pick(row, 'dimension', 'productDimensions') ?? details.productDimensions),
      signal('Weight', row.weight),
      signal('Manufacturer', details.manufacturer),
      signal('Units', details.units),
      signal('UPC', details.upc),
    ),
    reviewDistribution: signals(
      signal('5 stars', reviews.fiveStar),
      signal('4 stars', reviews.fourStar),
      signal('3 stars', reviews.threeStar),
      signal('2 stars', reviews.twoStar),
      signal('1 star', reviews.oneStar),
    ),
  };
}

export function amazonBullets(row: RecordValue): string[] {
  if (!Array.isArray(row.aboutItem)) return [];
  return row.aboutItem.slice(0, 12).map((item) => {
    const value = typeof item === 'string' ? item : pick(asRecord(item), 'text', 'content');
    return typeof value === 'string' ? value.trim() : '';
  }).filter(Boolean).slice(0, 8);
}

export function amazonSpecifications(row: RecordValue): Signal[] {
  return Object.entries(asRecord(row.itemSpecifications)).filter(([key, value]) =>
    Boolean(key.trim()) && (typeof value === 'string' || typeof value === 'number') && display(value) !== 'Not reported'
  ).slice(0, 12).map(([key, value]) => ({
    label: key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').trim().slice(0, 80),
    value: display(value).slice(0, 220),
  }));
}

export function amazonDescription(row: RecordValue): string | null {
  for (const value of [row.description, row.productDescription]) {
    if (typeof value !== 'string') continue;
    const text = value.trim();
    // The provider may return A+ content as JSON or HTML, neither of which is readable prose.
    if (text && !text.startsWith('{') && !text.startsWith('[') && !text.startsWith('<')) return text.slice(0, 2400);
  }
  return null;
}

export type AmazonVariantGroup = { title: string; items: string[] };

export function amazonVariants(row: RecordValue): AmazonVariantGroup[] {
  if (!Array.isArray(row.variants)) return [];
  return row.variants.slice(0, 4).map((value) => {
    const group = asRecord(value);
    const items = Array.isArray(group.items) ? group.items.slice(0, 8).map((item) => {
      const variant = asRecord(item);
      const name = pick(variant, 'name', 'asin');
      return typeof name === 'string' ? name.trim() : '';
    }).filter(Boolean) : [];
    return { title: typeof group.title === 'string' && group.title.trim() ? group.title.trim() : 'Options', items };
  }).filter((group) => group.items.length > 0);
}

export function nicheSignals(row: RecordValue, market: string) {
  const cpc = asRecord(row.cpc);
  return {
    primary: signals(
      signal('Weekly searches', row.searchVolumeWeekly),
      signal('Weekly units sold', row.unitsSoldWeekly),
      signal('Products', row.productCount),
      signal('Average price', marketplacePrice(row.avgPrice, market)),
      signal('Top 5 brands’ click share', percentage(row.top5BrandsClickShare)),
      signal('New launch success (6 mo.)', percentage(row.launchRateSemiannual)),
      signal('Annual return rate', percentage(row.returnRateAnnual)),
    ),
    demand: signals(
      signal('Quarterly searches', row.searchVolumeQuarterly),
      signal('Weekly search growth', percentage(row.searchVolumeGrowthWeekly)),
      signal('Quarterly search growth', percentage(row.searchVolumeGrowthQuarterly)),
      signal('Quarterly units sold', row.unitsSoldQuarterly),
      signal('Weekly clicks', row.clickCountWeekly),
      signal('Quarterly clicks', row.clickCountQuarterly),
      signal('Weekly click-to-sale rate', percentage(row.clickToSaleConversionWeekly)),
      signal('Quarterly click conversion', percentage(row.clickConversionRateQuarterly)),
      signal('Weekly search conversion', percentage(row.searchConversionRateWeekly)),
      signal('Quarterly search conversion', percentage(row.searchConversionRateQuarterly)),
    ),
    competition: signals(
      signal('Lowest price', marketplacePrice(row.minimumPrice, market)),
      signal('Highest price', marketplacePrice(row.maximumPrice, market)),
      signal('Brands', row.brandCount),
      signal('Top 5 products’ click share', percentage(row.top5ProductsClickShare)),
      signal('Average brand age (current)', row.avgBrandAgeNow),
      signal('Average brand age (quarterly)', row.avgBrandAgeQuarterly),
      signal('CPC low', marketplacePrice(cpc.low, market)),
      signal('CPC median', marketplacePrice(cpc.medium, market)),
      signal('CPC high', marketplacePrice(cpc.high, market)),
    ),
    entry: signals(
      signal('New products launched (6 mo.)', row.newProductsLaunchedSemiannual),
      signal('Successful launches (6 mo.)', row.successfulLaunchedSemiannual),
      signal('Products with >50% margin', percentage(row.profitMarginGt50PctSkuRatio)),
      signal('Break-even ratio', percentage(row.breakEvenRatio)),
      signal('Advertising cost of sale', percentage(row.acos)),
    ),
  };
}

export function supplierSignals(row: RecordValue) {
  return {
    primary: signals(
      signal('Dropship price', reportedPrice(row.consignPrice, row.currency)),
      signal('Minimum order', row.quantityBegin),
      signal('Orders (provider period)', row.salesOrderCount),
      signal('Units sold (provider period)', row.salesQuantity),
      signal('Estimated sales (provider period)', reportedPrice(row.estimatedSalesAmount, row.currency)),
      signal('Store', row.company),
    ),
    details: signals(
      signal('Delivery time (provider value)', row.deliveryTime),
      signal('Listing date', row.availableDate),
      signal('Category', row.levelName),
      signal('Offer ID', row.offerId),
    ),
  };
}

export type QuantityTier = { quantity: string; price: string };

export function quantityTiers(value: unknown): QuantityTier[] {
  let source = value;
  if (typeof source === 'string') {
    try { source = JSON.parse(source); }
    catch { return []; }
  }
  if (!Array.isArray(source)) return [];
  return source.slice(0, 10).map((item) => {
    const row: RecordValue = asRecord(item);
    const quantity = pick(row, 'quantity', 'minQuantity', 'startQuantity');
    const price = pick(row, 'value', 'price');
    return { quantity: display(quantity), price: display(price) };
  }).filter((tier) => tier.quantity !== 'Not reported' && tier.price !== 'Not reported').slice(0, 6);
}
