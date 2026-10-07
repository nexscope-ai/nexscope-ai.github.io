export const TOOL_CREDIT_MODAL_EVENT = 'nexscope:insufficient-credits';

export type CreditShortfallStage = 'data' | 'analysis';

export function showToolCreditModal(stage: CreditShortfallStage = 'data'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOOL_CREDIT_MODAL_EVENT, { detail: { stage } }));
}

export function dataCreditsUrl(pathname: string): string {
  const path = pathname.match(/^\/tools\/([a-z0-9-]+)\/?$/)?.[1] || 'tools';
  const url = new URL('https://www.nexscope.ai/seller/billing');
  url.search = new URLSearchParams({
    mode: 'data',
    'co-from': 'learn',
    utm_source: 'learn.nexscope.ai',
    utm_medium: 'referral',
    utm_campaign: 'tool_credit_shortfall',
    utm_content: path,
  }).toString();
  url.hash = 'top-up';
  return url.toString();
}
