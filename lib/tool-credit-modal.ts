export const TOOL_CREDIT_MODAL_EVENT = 'nexscope:insufficient-credits';

export type CreditShortfallStage = 'data' | 'analysis';

export function showToolCreditModal(stage: CreditShortfallStage = 'data'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOOL_CREDIT_MODAL_EVENT, { detail: { stage } }));
}

export function dataCreditsUrl(pathname: string): string {
  void pathname;
  const url = new URL('https://www.nexscope.ai/seller/billing');
  url.search = new URLSearchParams({
    mode: 'data',
    'co-from': 'learn',
  }).toString();
  url.hash = 'top-up';
  return url.toString();
}
