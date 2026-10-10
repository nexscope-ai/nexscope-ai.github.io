import { asRecord, asRows, compareKeywordSamples, numeric, type RecordValue } from './research-tool-api.ts';
import { pricePoints, productJsonLd, type DatedValue } from './expansion-tool-data.ts';
import { quantityTiers } from './research-result-format.ts';
import type { ResearchToolKind } from './research-tools.ts';

function compact(row: RecordValue, keys: string[]): RecordValue {
  const result: RecordValue = {};
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) result[key] = value.trim().slice(0, 240);
    else if (typeof value === 'number' && Number.isFinite(value)) result[key] = value;
    else if (typeof value === 'boolean') result[key] = value;
  }
  return result;
}

function summarizeDatedPoints(points: DatedValue[]): RecordValue {
  const minimum = points.reduce((best, point) => point.value < best.value ? point : best, points[0]);
  const maximum = points.reduce((best, point) => point.value > best.value ? point : best, points[0]);
  const chosen = new Map<string, DatedValue>();
  const add = (point: DatedValue) => chosen.set(`${point.time}|${point.value}`, point);
  for (let index = 0; index < Math.min(points.length, 38); index++) {
    add(points[Math.round(index * (points.length - 1) / Math.max(1, Math.min(points.length, 38) - 1))]);
  }
  add(minimum); add(maximum);
  const observations = [...chosen.values()].sort((left, right) => Date.parse(left.time.replace(' ', 'T')) - Date.parse(right.time.replace(' ', 'T')))
    .map(({ time, value }) => ({ time, value }));
  return { observationCount: points.length, includedCount: observations.length,
    firstObserved: { time: points[0].time, value: points[0].value },
    lastObserved: { time: points.at(-1)!.time, value: points.at(-1)!.value },
    minimumObserved: { time: minimum.time, value: minimum.value },
    maximumObserved: { time: maximum.time, value: maximum.value }, observations };
}

function compactStrings(value: unknown, limit = 8): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string')
    .slice(0, limit).map((item) => item.slice(0, 100)) : [];
}

export function expansionReportEvidence(
  kind: ResearchToolKind,
  primary: RecordValue,
  secondary: RecordValue | null,
  form: Record<string, string>,
): RecordValue | null {
  const rows = asRows(primary);
  if (kind === 'price-history') {
    const days = Number(form.days);
    const keys = ['price', 'buyboxPrice', 'priceList', 'priceDeal', 'pricePrime', 'priceFba', 'priceFbm', 'priceCoupon', 'sellerCount', 'rating', 'ratingCount', 'monthlySold'];
    const series = Object.fromEntries(keys.map((key) => {
      const points = pricePoints(primary, key, days).filter((point) => point.inWindow);
      return [key, points.length ? summarizeDatedPoints(points) : null];
    }).filter(([, value]) => value !== null));
    if (!Object.keys(series).length) return null;
    return { asin: form.asin.toUpperCase(), marketplace: form.market, lookbackDays: days, series,
      analysisTask: 'Compare observed dated points only. monthlySold is a rolling monthly estimate at each observation, not sales on that day. A coincident price and sales change is not evidence that the price caused the sales change. Do not imply continuous prices or causal promotion effects between sparse observations.',
      caveat: 'Only returned dated observations are evidence. Up to 40 observations per series are spread across the full selected window, with exact first, latest, low and high values retained. Negative provider sentinels were excluded. Do not infer values between observations or imply a continuous price history.' };
  }
  if (kind === 'asin-gap') {
    if (!secondary) return null;
    const competitor = asRows(secondary);
    if (!rows.length && !competitor.length) return null;
    const keys = ['keyword', 'translateKeyword', 'weeklySearchVolume', 'keywordPopularityRank',
      'totalSearchResultProductCount', 'productNaturalRank', 'naturalRankDisplay', 'productAdRank',
      'adRankDisplay', 'trafficShare', 'naturalTrafficShare', 'paidTrafficShare',
      'naturalTrafficScore', 'sponsoredProductsScore', 'brandAdScore', 'videoAdScore',
      'sponsoredRecommendationScore', 'clickConcentrationShare', 'clickToPurchaseConversionRate',
      'periodEndDate', 'updateTime'];
    const keyword = (row: RecordValue) => ({ ...compact(row, keys),
      displayPositionTypes: compactStrings(row.displayPositionTypes),
      trafficCharacteristicMarkers: compactStrings(row.trafficCharacteristicMarkers),
      conversionPerformanceMarkers: compactStrings(row.conversionPerformanceMarkers) });
    return { ownAsin: form.asin.toUpperCase(), competitorAsin: form.competitorAsin.toUpperCase(), marketplace: form.market,
      ownSampleCount: rows.length, competitorSampleCount: competitor.length,
      ownKeywords: rows.map(keyword), competitorKeywords: competitor.map(keyword),
      competitorOnlyInSamples: compareKeywordSamples(rows, competitor).map(keyword),
      caveat: 'Both responses are bounded first-page samples. Absence from one sample does not prove the ASIN does not rank for a term.' };
  }
  if (kind === 'ai-shopping-check') {
    const result = asRecord(primary.result);
    const snapshots = Array.isArray(result.snapshots) ? result.snapshots.map(asRecord) : [];
    if (!snapshots.length) return null;
    return { url: form.url, collectionStatus: primary.status, snapshotCount: snapshots.length,
      includedSnapshotCount: Math.min(snapshots.length, 4),
      snapshots: snapshots.slice(0, 4).map((snapshot) => {
        const evidence = asRecord(snapshot.evidence);
        const products = productJsonLd(evidence.html);
        return { page: compact(evidence, ['url', 'title', 'description', 'canonical', 'httpStatus', 'textLength']),
          productJsonLdDetection: {
            detectedCount: products.length,
            htmlAvailable: typeof evidence.html === 'string',
            htmlCharactersScanned: typeof evidence.html === 'string' ? Math.min(evidence.html.length, 2_000_000) : 0,
            htmlCharactersReturned: typeof evidence.html === 'string' ? evidence.html.length : 0,
          },
          h1: Array.isArray(evidence.h1) ? evidence.h1.slice(0, 5).map((value) => String(value).slice(0, 240)) : typeof evidence.h1 === 'string' ? evidence.h1.slice(0, 240) : null,
          missing: Array.isArray(snapshot.missing) ? snapshot.missing.slice(0, 20).map((value) => compact(asRecord(value), ['field', 'path', 'reason', 'source'])) : [],
          productSchema: products.slice(0, 5).map((product) => ({
            ...compact(product, ['name', 'sku', 'gtin', 'gtin12', 'gtin13', 'description']),
            brand: compact(asRecord(product.brand), ['name']),
            offer: compact(asRecord(Array.isArray(product.offers) ? product.offers[0] : product.offers), ['price', 'priceCurrency', 'availability']),
            rating: compact(asRecord(product.aggregateRating), ['ratingValue', 'reviewCount']),
          })) };
      }),
      analysisTask: 'Interpret the bounded collected snapshots, not a complete live website audit. productSchema only represents Product JSON-LD detected in returned HTML, not all possible structured-data formats or JavaScript-rendered content. If no Product JSON-LD was detected, state exactly that; do not claim the website has no product structured data or is ineligible for rich results. Multiple H1 tags alone do not prove a search ranking penalty. Do not infer why two snapshots differ without evidence.',
      caveat: 'A collected page snapshot, not continuous AI Shopping visibility. Missing fields are unknown, not zero. Product JSON-LD detection is limited to the returned HTML excerpt; absence here does not prove absence on the live page. Do not claim an AI platform cited or recommended this product without a separate citation sample.' };
  }
  if (kind === 'tiktok-momentum') {
    if (!rows.length) return null;
    const unitsField = form.period === 'day' ? 'totalSale1dCnt' : form.period === 'week' ? 'totalSale7dCnt' : 'totalSale30dCnt';
    const gmvField = form.period === 'day' ? 'totalSaleGmv1dAmt' : form.period === 'week' ? 'totalSaleGmv7dAmt' : 'totalSaleGmv30dAmt';
    const highest = (field: string) => rows.map((row, index) => ({ row, rank: index + 1, value: numeric(row[field]) }))
      .filter((item) => item.value !== null)
      .sort((left, right) => right.value! - left.value!)[0];
    const topUnits = highest(unitsField);
    const topGmv = highest(gmvField);
    const categoryCounts = Object.entries(rows.reduce<Record<string, number>>((counts, row) => {
      const category = typeof row.categoryName === 'string' && row.categoryName.trim() ? row.categoryName.trim() : 'Unreported';
      counts[category] = (counts[category] ?? 0) + 1;
      return counts;
    }, {})).map(([category, count]) => ({ category, count })).sort((left, right) => right.count - left.count);
    const topLevelCategoryCounts = Object.entries(rows.reduce<Record<string, number>>((counts, row) => {
      const category = typeof row.categoryName === 'string' && row.categoryName.trim()
        ? row.categoryName.split(/\s*->\s*/)[0].trim() : 'Unreported';
      counts[category] = (counts[category] ?? 0) + 1;
      return counts;
    }, {})).map(([category, count]) => ({ category, count })).sort((left, right) => right.count - left.count);
    const keys = ['productId', 'asin', 'title', 'region', 'price', 'minPrice', 'maxPrice', 'currency',
      'totalSale1dCnt', 'totalSale7dCnt', 'totalSale30dCnt', 'totalSaleCnt',
      'totalSaleGmv1dAmt', 'totalSaleGmv7dAmt', 'totalSaleGmv30dAmt', 'totalSaleGmvAmt',
      'growthRate', 'shopName', 'shopTotalUnitsSold', 'categoryName', 'productCommissionRate',
      'offShelvesText', 'reviewCount', 'productRating'];
    return { region: form.region, period: form.period, date: form.date,
      asOfDateUtc: new Date().toISOString().slice(0, 10), returnedProducts: rows.length,
      periodMetricFields: { units: unitsField, gmv: gmvField }, categoryCounts, topLevelCategoryCounts,
      topByPeriodUnits: topUnits ? { rank: topUnits.rank, title: topUnits.row.title, units: topUnits.value } : null,
      topByPeriodGmv: topGmv ? { rank: topGmv.rank, title: topGmv.row.title, gmv: topGmv.value } : null,
      products: rows.map((row) => compact(row, keys)),
      analysisTask: 'Analyze this bounded ranking sample using the selected period fields in periodMetricFields. Use the supplied topLevelCategoryCounts, categoryCounts and topByPeriodUnits/topByPeriodGmv as exact computed facts; never call the highest-unit product the highest-GMV product unless both facts agree. For a day ranking with date earlier than asOfDateUtc, it is a past date, never a future date or forecast. Reported zero growth is zero in the provider field, not proof that sales were stable. Do not infer causal marketing drivers or guaranteed future momentum.',
      caveat: 'Provider-reported ranking snapshots for the selected market and period. Do not mix all-time, 1-day, 7-day and 30-day measures or interpret a ranking as guaranteed future demand.' };
  }
  if (kind === 'sourcing-demand') {
    if (!secondary) return null;
    const amazon = asRows(secondary);
    if (!rows.length && !amazon.length) return null;
    const supplierCandidates: RecordValue[] = rows.map((row) => ({
      ...compact(row, ['offerId', 'title', 'shopId', 'company', 'sourceTool', 'sourceType', 'price', 'consignPrice', 'currency',
        'quantityBegin', 'salesOrderCount', 'salesQuantity', 'estimatedSalesAmount', 'unit',
        'deliveryTime', 'levelName', 'dataType', 'asinUrl']),
      listingId: typeof row.asin === 'string' ? row.asin : undefined,
      quantityPrices: quantityTiers(row.quantityPrices),
    }));
    const amazonResults = amazon.map((row) => compact(row, ['asin', 'asinUrl', 'title', 'keyword', 'sourceTool', 'sourceType', 'position',
      'sponsored', 'price', 'extractedPrice', 'oldPrice', 'extractedOldPrice', 'currency', 'rating',
      'ratings', 'monthlySalesUnits', 'monthlySalesRevenue', 'delivery', 'badges', 'offers', 'options']));
    const coverage: RecordValue = {
      supplierReturnedCount: rows.length,
      supplierIncludedCount: supplierCandidates.length,
      amazonProviderTotal: typeof secondary.total === 'number' ? secondary.total : null,
      amazonReturnedCount: amazon.length,
      amazonIncludedCount: amazonResults.length,
      amazonSponsoredCount: amazon.filter((row) => row.sponsored === true).length,
      amazonOrganicCount: amazon.filter((row) => row.sponsored === false).length,
      analysisTruncated: false,
    };
    const evidence: RecordValue = {
      workflow: '1688 supply versus Amazon search evidence', sourcingTerm: form.termZh,
      amazonTerm: form.termEn, marketplace: form.market, asOfDate: new Date().toISOString().slice(0, 10), coverage,
      supplierCandidates, amazonResults,
      analysisTask: 'Compare the two independent search samples. Distinguish sponsored from organic Amazon listings; discuss reported price, sales, rating, reviews, and 1688 supplier terms. State data coverage and uncertainty. 1688 listingId/offerId are not Amazon ASINs. Source availability dates are intentionally excluded because their meaning is not verified; do not discuss future availability or preorder status. Do not convert CNY to USD because no exchange rate was provided. Do not claim exact product equivalence, verified supplier quotes, or profit.',
      caveat: 'Independent search samples, not verified product matches, supplier quotes or proof of profit. Sales periods and product equivalence may be unknown. No exchange rate, freight or fees were provided; do not convert currency or calculate margins.',
    };
    // The analysis endpoint truncates input at 60,000 characters. Keep every returned
    // product whenever possible; discard verbose context before discarding ranked rows.
    const maxChars = 54_000;
    if (JSON.stringify(evidence).length > maxChars) {
      for (const row of amazonResults) {
        for (const key of ['asinUrl', 'delivery', 'badges', 'offers', 'options']) delete row[key];
      }
      for (const row of supplierCandidates) delete row.asinUrl;
      coverage.analysisTruncated = true;
      coverage.omittedFieldsForSize = ['asinUrl', 'delivery', 'badges', 'offers', 'options'];
    }
    while (JSON.stringify(evidence).length > maxChars && amazonResults.length > 10) {
      amazonResults.pop();
      coverage.analysisTruncated = true;
      coverage.amazonIncludedCount = amazonResults.length;
    }
    while (JSON.stringify(evidence).length > maxChars && supplierCandidates.length > 3) {
      supplierCandidates.pop();
      coverage.analysisTruncated = true;
      coverage.supplierIncludedCount = supplierCandidates.length;
    }
    return evidence;
  }
  return null;
}
