import { writeFile } from 'node:fs/promises';
import { loadSubscriptionPlans } from '../lib/public-pricing.mjs';

const plans = await loadSubscriptionPlans();
await writeFile(
  new URL('../lib/pricing-snapshot.json', import.meta.url),
  JSON.stringify(
    { checkedAt: plans.length ? new Date().toISOString() : null, plans },
    null,
    2,
  ) + '\n',
);
console.log(
  `Prepared ${plans.length} current monthly and annual subscription plans for static export.`,
);
