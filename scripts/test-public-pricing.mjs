import test from 'node:test';
import assert from 'node:assert/strict';
import { monthlyPlans, loadMonthlyPlans } from '../lib/public-pricing.mjs';

const plan = {
  status: true,
  billingPeriod: 1,
  price: '2900',
  introductoryPrice: '1450',
  presentCredit: '30000',
  sku: 'starter',
  name: 'Starter',
};
test('monthly prices use cents and exclude annual, withdrawn and malformed plans', () => {
  const result = monthlyPlans({
    code: 0,
    data: [
      { ...plan, price: '6900', sku: 'growth' },
      plan,
      { ...plan, billingPeriod: 12 },
      { ...plan, status: false },
      { ...plan, price: '-1' },
      { ...plan, price: '9007199254740993' },
    ],
  });
  assert.equal(result.length, 2);
  assert.equal(result[0].price, 2900);
  assert.equal(result[0].introductoryPrice, 1450);
  assert.equal(result[0].credits, 30000);
  assert.equal(
    monthlyPlans({ code: 0, data: [{ ...plan, introductoryPrice: '9900' }] })[0]
      .introductoryPrice,
    null,
  );
});
test('business errors and unavailable network never produce invented prices', async () => {
  assert.throws(() => monthlyPlans({ code: 401, data: [plan] }));
  assert.deepEqual(
    await loadMonthlyPlans(async () => {
      throw new Error('offline');
    }),
    [],
  );
  assert.deepEqual(
    await loadMonthlyPlans(async () => ({
      ok: true,
      json: async () => ({ code: 0, data: [] }),
    })),
    [],
  );
});
