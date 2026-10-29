const origin = 'https://www.nexscope.ai';

/** Match web's buildPricingBillingPath, with Learn attribution. */
export function pricingBillingUrl(plan) {
  const ids = { 200: 'starter', 300: 'growth', 400: 'pro' };
  const id =
    ids[plan.level] ??
    (Number.isSafeInteger(plan.level) && plan.level > 0
      ? `level-${plan.level}`
      : null);
  if (
    !id ||
    ![1, 12].includes(plan.billingPeriod) ||
    typeof plan.sku !== 'string' ||
    !plan.sku.trim()
  ) {
    return `${origin}/pricing?co-from=learn`;
  }
  const url = new URL('/seller/billing', origin);
  url.search = new URLSearchParams({
    mode: 'creative',
    source: 'pricing',
    intent: 'subscribe',
    plan: id,
    cycle: plan.billingPeriod === 12 ? 'annual' : 'monthly',
    sku: plan.sku,
    'co-from': 'learn',
  }).toString();
  url.hash = 'plans';
  return url.href;
}

/** Open in the click gesture, without authentication checks or async requests. */
export function openPricingSelection(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  // Use the actual anchor URL so the shared attribution script can retain its context.
  // Keep the referrer available to main-site analytics; noopener isolates the new tab.
  window.open(event.currentTarget.href, '_blank', 'noopener');
}
