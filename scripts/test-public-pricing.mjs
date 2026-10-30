import test from 'node:test';
import assert from 'node:assert/strict';
import { pricingRows, subscriptionService } from '../lib/pricing-content.mjs';
import {
  pricingBillingUrl,
  openPricingSelection,
} from '../lib/pricing-navigation.mjs';
import {
  monthlyPlans,
  loadMonthlyPlans,
  loadSubscriptionPlans,
  annualSavings,
} from '../lib/public-pricing.mjs';

const plan = {
  status: true,
  billingPeriod: 1,
  price: '2900',
  introductoryPrice: '1450',
  presentCredit: '30000',
  sku: 'starter',
  name: 'Starter',
  level: 200,
};
test('billing destinations preserve exact SKU and cycle using the main-site pricing intent', () => {
  for (const [level, name] of [
    [200, 'starter'],
    [300, 'growth'],
    [400, 'pro'],
    [500, 'level-500'],
  ]) {
    for (const period of [1, 12]) {
      const sku = `sku-${level}-${period}`;
      const url = new URL(
        pricingBillingUrl({ level, billingPeriod: period, sku }),
      );
      assert.equal(url.origin, 'https://www.nexscope.ai');
      assert.equal(url.pathname, '/seller/billing');
      assert.deepEqual(Object.fromEntries(url.searchParams), {
        mode: 'creative',
        source: 'pricing',
        intent: 'subscribe',
        plan: name,
        cycle: period === 12 ? 'annual' : 'monthly',
        sku,
        'co-from': 'learn',
      });
      assert.equal(url.hash, '#plans');
      assert.equal(url.searchParams.has('price'), false);
    }
  }
  assert.equal(
    new URL(
      pricingBillingUrl({ level: null, billingPeriod: 12, sku: 'unknown' }),
    ).pathname,
    '/pricing',
  );
});
test('ordinary click opens one attributed URL synchronously without login checks; modified clicks keep native behavior', () => {
  const original = globalThis.window;
  const opened = [];
  let prevented = 0;
  globalThis.window = { open: (...args) => opened.push(args) };
  try {
    const event = {
      button: 0,
      defaultPrevented: false,
      currentTarget: {
        href: pricingBillingUrl({
          level: 300,
          billingPeriod: 12,
          sku: 'growth-yearly',
        }),
      },
      preventDefault() {
        prevented += 1;
      },
    };
    openPricingSelection(event);
    assert.deepEqual(opened, [
      [event.currentTarget.href, '_blank', 'noopener'],
    ]);
    assert.equal(prevented, 1);
    for (const modifier of [
      { ctrlKey: true },
      { metaKey: true },
      { shiftKey: true },
      { altKey: true },
      { button: 1 },
      { defaultPrevented: true },
    ])
      openPricingSelection({ ...event, ...modifier });
    assert.equal(opened.length, 1);
    assert.equal(prevented, 1);
  } finally {
    if (original === undefined) delete globalThis.window;
    else globalThis.window = original;
  }
});
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
test('annual savings compare matching tiers without combining introductory discounts', () => {
  const catalog = [
    {
      ...plan,
      name: 'Growth',
      level: 300,
      sku: 'growth-monthly',
      price: '6900',
    },
    {
      ...plan,
      name: 'Growth',
      level: 300,
      sku: 'growth-yearly',
      billingPeriod: 12,
      price: '66000',
      introductoryPrice: '33000',
    },
    {
      ...plan,
      sku: 'starter-yearly',
      billingPeriod: 12,
      price: '34800',
      introductoryPrice: '17400',
    },
    plan,
  ];
  const raw = { code: 0, data: catalog };
  const plans = [...monthlyPlans(raw), ...monthlyPlans(raw, 12)];
  assert.deepEqual(
    annualSavings(
      plans.find((p) => p.sku === 'growth-yearly'),
      plans,
    ),
    { perMonth: 1400, percent: 20, monthlyPrice: 6900 },
  );
  assert.equal(
    annualSavings(
      plans.find((p) => p.sku === 'starter-yearly'),
      plans,
    ).perMonth,
    0,
  );
  assert.equal(annualSavings({ billingPeriod: 12, level: null }, plans), null);
});
test('annual catalog preserves upfront totals, monthly credits and independent annual discounts', async () => {
  const annual = {
    ...plan,
    sku: 'starter-yearly',
    billingPeriod: 12,
    price: '34800',
    introductoryPrice: '17400',
  };
  const result = await loadSubscriptionPlans(async () => ({
    ok: true,
    json: async () => ({ code: 0, data: [plan, annual] }),
  }));
  assert.equal(result.length, 2);
  assert.equal(result[1].billingPeriod, 12);
  assert.equal(result[1].price, 34800);
  assert.equal(result[1].introductoryPrice / 12 / 100, 14.5);
  assert.equal(result[1].introductoryPrice * 2, result[1].price);
  assert.equal(result[1].credits, 30000);
  assert.deepEqual(monthlyPlans({ code: 0, data: [plan] }, 12), []);
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
test('a temporary catalog failure is retried before using the fallback', async () => {
  let attempts = 0;
  const result = await loadSubscriptionPlans(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error('temporary timeout');
    return { ok: true, json: async () => ({ code: 0, data: [plan] }) };
  });
  assert.equal(attempts, 2);
  assert.equal(result[0].sku, 'starter');
});

test('comparison rows and structured offers preserve full annual charges, not introductory monthly equivalents', () => {
  const plans = [
    {
      sku: 'growth-yearly',
      name: 'Growth',
      level: 300,
      billingPeriod: 12,
      price: 66000,
      credits: 75000,
      introductoryPrice: 33000,
    },
  ];
  const [row] = pricingRows(plans);
  assert.equal(row.monthlyEquivalent, 5500);
  assert.equal(row.intro, 33000);
  const [offer] = subscriptionService(plans).hasOfferCatalog.itemListElement;
  assert.equal(offer.price, '660.00');
  assert.equal(offer.priceCurrency, 'USD');
  assert.match(offer.description, /upfront per year/);
  assert.match(offer.url, /cycle=annual/);
  assert.match(offer.url, /co-from=learn/);
});

test('unavailable or invalid pricing cannot generate a zero-price offer', () => {
  assert.equal('hasOfferCatalog' in subscriptionService([]), false);
  assert.equal(
    pricingRows([{ price: 0, credits: 30000, billingPeriod: 1 }]).length,
    0,
  );
  assert.equal(
    pricingRows([
      {
        price: 2900,
        credits: 30000,
        billingPeriod: 1,
        introductoryPrice: 2900,
      },
    ])[0].intro,
    null,
  );
});
