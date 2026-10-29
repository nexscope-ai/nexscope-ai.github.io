import { writeFile } from 'node:fs/promises';
import { loadMonthlyPlans } from '../lib/public-pricing.mjs';

const plans = await loadMonthlyPlans();
await writeFile(new URL('../lib/pricing-snapshot.json', import.meta.url), JSON.stringify({ plans }, null, 2) + '\n');
console.log(`Prepared ${plans.length} current monthly subscription plans for static export.`);
