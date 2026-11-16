export const productGrowthReportUrl = 'https://www.nexscope.ai/product-growth-report';

type ReportEntry =
  | 'growth-hero'
  | 'growth-example-next-action'
  | 'growth-comparison-report'
  | 'growth-bottom';

export function reportRequestHref(entry: ReportEntry) {
  const url = new URL(productGrowthReportUrl);
  url.searchParams.set('co-from', 'learn');
  url.searchParams.set('report_entry', entry);
  url.hash = 'request';
  return url.href;
}
