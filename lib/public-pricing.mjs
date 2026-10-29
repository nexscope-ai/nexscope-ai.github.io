export const PRICING_ENDPOINT =
  'https://api.nexscope.ai/api/order/subscribe/plans';

function cents(value) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
  const amount = Number(value);
  return Number.isSafeInteger(amount) ? amount : null;
}

export function monthlyPlans(response, billingPeriod = 1) {
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
        plan.billingPeriod !== billingPeriod ||
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
          billingPeriod,
          level: Number.isSafeInteger(plan.level) ? plan.level : null,
          introductoryPrice:
            intro !== null && intro > 0 && intro < price ? intro : null,
          popular: plan.popular === true,
        },
      ];
    })
    .sort((a, b) => a.price - b.price || a.sku.localeCompare(b.sku));
}

export function annualSavings(plan, plans) {
  if (plan.billingPeriod !== 12 || plan.level === null) return null;
  const monthly = plans.find(
    (item) => item.billingPeriod === 1 && item.level === plan.level,
  );
  if (!monthly) return null;
  const perMonth = Math.max(0, monthly.price - plan.price / 12);
  return {
    perMonth,
    percent: Math.round((perMonth / monthly.price) * 100),
    monthlyPrice: monthly.price,
  };
}

export async function loadSubscriptionPlans(fetcher = fetch) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetcher(PRICING_ENDPOINT, {
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error('Pricing HTTP failure');
      const catalog = await response.json();
      return [...monthlyPlans(catalog), ...monthlyPlans(catalog, 12)];
    } catch {
      if (attempt < 2) continue;
      console.warn(
        '[homepage-pricing] Public catalog unavailable; showing pricing link only.',
      );
      return [];
    }
  }
  return [];
}

export async function loadMonthlyPlans(fetcher = fetch) {
  return (await loadSubscriptionPlans(fetcher)).filter(
    (plan) => plan.billingPeriod === 1,
  );
}
