import { pricingBillingUrl } from './pricing-navigation.mjs';

export const pricingMoney = (cents) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);

export function pricingRows(plans) {
  return plans
    .filter(
      (plan) =>
        [1, 12].includes(plan.billingPeriod) &&
        Number.isSafeInteger(plan.price) &&
        plan.price > 0 &&
        Number.isSafeInteger(plan.credits) &&
        plan.credits >= 0,
    )
    .map((plan) => ({
      ...plan,
      cycle: plan.billingPeriod === 12 ? 'Yearly' : 'Monthly',
      monthlyEquivalent: plan.price / plan.billingPeriod,
      intro:
        Number.isSafeInteger(plan.introductoryPrice) &&
        plan.introductoryPrice > 0 &&
        plan.introductoryPrice < plan.price
          ? plan.introductoryPrice
          : null,
      url: pricingBillingUrl(plan),
    }));
}

export function subscriptionService(plans) {
  const rows = pricingRows(plans);
  return {
    '@type': 'Service',
    '@id': 'https://learn.nexscope.ai/pricing/#subscriptions',
    name: 'Nexscope ecommerce API and AI creative subscriptions',
    serviceType: 'Ecommerce Data API, image and video generation subscription',
    provider: { '@id': 'https://www.nexscope.ai/#organization' },
    url: 'https://learn.nexscope.ai/pricing/',
    ...(rows.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Nexscope monthly and yearly subscriptions',
            itemListElement: rows.map((plan) => ({
              '@type': 'Offer',
              name: `${plan.name} — ${plan.cycle}`,
              price: (plan.price / 100).toFixed(2),
              priceCurrency: 'USD',
              url: plan.url,
              description: `${pricingMoney(plan.price)} charged ${plan.cycle === 'Yearly' ? 'upfront per year' : 'per month'} at the standard rate; ${plan.credits.toLocaleString('en-US')} credits allocated monthly. Eligible first-subscription offers are separate from this standard price. Unused subscription credits do not roll over.`,
              itemOffered: {
                '@type': 'Service',
                name: `Nexscope ${plan.name} subscription`,
              },
            })),
          },
        }
      : {}),
  };
}
