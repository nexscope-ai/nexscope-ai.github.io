import { pricingRows } from './pricing-content.mjs';

export function entrySubscription(plans) {
  const rows = pricingRows(plans);
  const annual = rows.filter((plan) => plan.billingPeriod === 12);
  const candidates = annual.length
    ? annual
    : rows.filter((plan) => plan.billingPeriod === 1);
  const selected = candidates.sort(
    (a, b) =>
      (a.intro ?? a.price) / a.billingPeriod -
      (b.intro ?? b.price) / b.billingPeriod,
  )[0];
  return selected
    ? {
        ...selected,
        monthlyAmount:
          (selected.intro ?? selected.price) / selected.billingPeriod,
      }
    : null;
}

export function estimatedCapacity(credits, creditsPerTask) {
  if (
    !Number.isFinite(credits) ||
    credits <= 0 ||
    !Number.isFinite(creditsPerTask) ||
    creditsPerTask <= 0
  )
    return null;
  return Math.floor(credits / creditsPerTask);
}

export function historicalAverage(snapshot, slug) {
  const average = snapshot?.available
    ? snapshot.statistics?.[slug]?.average
    : null;
  return typeof average === 'number' && Number.isFinite(average) && average > 0
    ? Math.max(10, Math.round(average))
    : null;
}

// Public estimates on the official pricing page, verified on this date.
// These illustrate one specified setting; they are not costs for every video or API.
export const publicCostExamples = {
  verifiedOn: '2026-10-30',
  video: {
    name: 'Seedance 2.0 Fast',
    setting: '720p · 5 seconds',
    credits: 550,
  },
  data: { name: '1688 Search by Image' },
};
