'use client';

import { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { annualSavings } from '@/lib/public-pricing.mjs';
import {
  pricingBillingUrl,
  openPricingSelection,
} from '@/lib/pricing-navigation.mjs';
import styles from './homepage-pricing.module.css';

type Plan = {
  sku: string;
  name: string;
  price: number;
  credits: number;
  billingPeriod: number;
  introductoryPrice: number | null;
  popular: boolean;
  level: number | null;
};
const pricingUrl = 'https://www.nexscope.ai/pricing?co-from=learn';
const dollars = (cents: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);

export default function HomepagePricing({ plans }: { plans: Plan[] }) {
  const hasAnnual = plans.some((plan) => plan.billingPeriod === 12);
  const [cycle, setCycle] = useState(hasAnnual ? 12 : 1);
  const selected = plans.filter((plan) => plan.billingPeriod === cycle);
  const halfOff =
    selected.length > 0 &&
    selected.every(
      (plan) =>
        plan.introductoryPrice !== null &&
        plan.introductoryPrice * 2 === plan.price,
    );

  return (
    <section className={styles.section} aria-labelledby="subscription-title">
      <div className={styles.heading}>
        {halfOff ? (
          <p className={styles.offer}>
            <Sparkles size={15} aria-hidden="true" />
            FIRST SUBSCRIPTION <strong>50% OFF</strong>
          </p>
        ) : (
          <p className={styles.eyebrow}>NEXSCOPE PLANS</p>
        )}
        <h2 id="subscription-title">
          {halfOff
            ? 'More possibilities. Half the price to start.'
            : 'More possibilities. A plan for your next step.'}
        </h2>
        <p>One subscription for ecommerce data, images and videos.</p>
      </div>
      {plans.length > 0 && (
        <fieldset className={styles.toggle}>
          <legend>Choose your billing cycle</legend>
          {[1, 12].map((period) => (
            <label key={period}>
              <input
                type="radio"
                name="home-billing-cycle"
                value={period}
                checked={cycle === period}
                onChange={() => setCycle(period)}
                disabled={!plans.some((plan) => plan.billingPeriod === period)}
              />
              <span>{period === 12 ? 'Yearly' : 'Monthly'}</span>
            </label>
          ))}
        </fieldset>
      )}
      <p className={styles.cycleNote}>
        {cycle === 12
          ? 'Yearly billing · paid upfront · prices shown as a monthly equivalent'
          : 'Monthly billing · no annual prepayment'}{' '}
        · USD
      </p>

      {[1, 12].map((period) => (
        <div className={styles.grid} hidden={cycle !== period} key={period}>
          {plans
            .filter((plan) => plan.billingPeriod === period)
            .map((plan) => {
              const annual = period === 12;
              const intro = plan.introductoryPrice;
              const display = intro ?? plan.price;
              const savings = annualSavings(plan, plans);
              const discount =
                intro !== null
                  ? Math.round((1 - intro / plan.price) * 100)
                  : null;
              return (
                <article
                  key={plan.sku}
                  className={`${styles.card} ${plan.popular ? styles.featured : ''}`}
                >
                  <div className={styles.identity}>
                    <h3>{plan.name}</h3>
                    {plan.popular && <span>Most popular</span>}
                  </div>
                  <div className={styles.priceLabel}>
                    {discount !== null ? (
                      <>
                        <s>{dollars(plan.price / period)}</s>
                        <span>
                          {discount}% off your{' '}
                          {annual ? 'first year' : 'first month'}
                        </span>
                      </>
                    ) : (
                      <span>Standard {annual ? 'annual' : 'monthly'} rate</span>
                    )}
                  </div>
                  <p className={styles.price}>
                    <strong>{dollars(display / period)}</strong>
                    <span>/ month{annual && <small>billed yearly</small>}</span>
                  </p>
                  <div className={styles.billing}>
                    <p>
                      {annual
                        ? `${dollars(display)} billed ${intro !== null ? 'for the first year' : 'annually'}.`
                        : intro !== null
                          ? `${dollars(display)} for your first month.`
                          : 'Billed monthly.'}
                    </p>
                    {intro !== null && (
                      <p>
                        Then {dollars(plan.price)}/{annual ? 'year' : 'month'}.
                      </p>
                    )}
                  </div>
                  <a
                    href={pricingBillingUrl(plan)}
                    target="_blank"
                    rel="noopener"
                    onClick={openPricingSelection}
                    data-track-tool="subscription-pricing"
                  >
                    Choose {plan.name}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <div className={styles.features}>
                    <p>
                      <Check size={16} aria-hidden="true" />
                      <strong>
                        {plan.credits.toLocaleString('en-US')}
                      </strong>{' '}
                      credits / month
                    </p>
                    <p>
                      <Check size={16} aria-hidden="true" />
                      Data, image & video APIs
                    </p>
                    <p>
                      <Check size={16} aria-hidden="true" />
                      Credits renewed every month
                    </p>
                  </div>
                  {annual && savings && (
                    <div
                      className={`${styles.comparison} ${savings.perMonth > 0 ? styles.saving : ''}`}
                    >
                      <strong>
                        Yearly {dollars(plan.price / 12)}/mo vs monthly{' '}
                        {dollars(savings.monthlyPrice)}/mo
                      </strong>
                      <span>
                        {savings.perMonth > 0
                          ? `Save ${dollars(savings.perMonth)}/mo with yearly billing. `
                          : ''}
                        Standard rates before the first-subscription offer.
                      </span>
                    </div>
                  )}
                </article>
              );
            })}
        </div>
      ))}
      {plans.length === 0 && (
        <a
          className={styles.fallback}
          href={pricingUrl}
          data-track-tool="subscription-pricing"
        >
          See current subscription prices
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      )}
      <p className={styles.terms}>
        First-subscription offers are for eligible new subscribers. Eligibility
        and final prices are confirmed on the main site. Monthly credit
        allocations do not roll over.
      </p>
      <div className={styles.bottom}>
        <p>
          Only need data?{' '}
          <a href={pricingUrl}>
            Explore Data API top-ups
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        </p>
        <p>
          <Check size={15} aria-hidden="true" />
          Product listings & display are always free.
        </p>
      </div>
    </section>
  );
}
