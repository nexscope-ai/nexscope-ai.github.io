export const radarPromotionPath = '/product-research-radar/';
export const radarDemoImage = '/product-research-radar/market-globe.webp';
export const radarTitle = 'Product Research Radar';

export const liveRadarUrl =
  'https://www.nexscope.ai/product-opportunity-radar?co-from=learn';

export function radarGuidePath(slug: string) {
  return `${radarPromotionPath}${slug}/`;
}
