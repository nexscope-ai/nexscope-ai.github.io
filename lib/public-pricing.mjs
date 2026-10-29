export const PRICING_ENDPOINT =
  'https://api.nexscope.ai/api/order/subscribe/plans';

function cents(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const amount = Number(value);
  return Number.isSafeInteger(amount) ? amount : null;
}

export function monthlyPlans(response) {
  if (response?.code !== 0 || !Array.isArray(response.data)) {
    throw new Error('Public pricing catalog unavailable');
  }
  return response.data
    .flatMap((plan) => {
      const price = cents(plan.price);
      const intro = cents(plan.introductoryPrice);
      const credits = cents(plan.presentCredit);
      if (
        plan.status !== true ||
        plan.billingPeriod !== 1 ||
        price === null ||
        price <= 0 ||
        credits === null ||
        typeof plan.name !== 'string' ||
        !plan.name.trim() ||
        typeof plan.sku !== 'string' ||
        !plan.sku
      )
        return [];
      return [
        {
          sku: plan.sku,
          name: plan.name,
          price,
          credits,
          introductoryPrice:
            intro !== null && intro > 0 && intro < price ? intro : null,
          popular: plan.popular === true,
        },
      ];
    })
    .sort((a, b) => a.price - b.price || a.sku.localeCompare(b.sku));
}

export async function loadMonthlyPlans(fetcher = fetch) {
  try {
    const response = await fetcher(PRICING_ENDPOINT, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Pricing HTTP failure');
    return monthlyPlans(await response.json());
  } catch {
    console.warn(
      '[homepage-pricing] Public catalog unavailable; showing pricing link only.',
    );
    return [];
  }
}
