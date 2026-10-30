/* oxlint-disable next/no-html-link-for-pages */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The named table region needs keyboard focus for horizontal scrolling. */
import type { Metadata } from 'next';
import { ArrowRight, Check, PackagePlus } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import HomepagePricing from '@/components/homepage-pricing';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import {
  pricingRows,
  pricingMoney,
  subscriptionService,
} from '@/lib/pricing-content.mjs';
import styles from './pricing.module.css';

const faqs = [
  {
    q: 'Which Nexscope plan should I choose?',
    a: 'Choose a plan by monthly credit demand and billing commitment. Compare the monthly allocation for Starter, Growth and Pro, then check the documented cost of your selected APIs or video settings before estimating capacity. Choose Data-only top-ups if you only need Data APIs without a subscription. Product Gallery listings do not require a paid plan.',
  },
  {
    q: 'Does yearly billing save money on every plan?',
    a: 'Not necessarily. Compare the standard yearly monthly equivalent with the same tier’s standard monthly price in the table. Introductory discounts are separate from yearly savings. Yearly billing requires the full year’s payment upfront, even when a price is displayed as a monthly equivalent.',
  },
  {
    q: 'What does a subscription cover?',
    a: 'Nexscope subscriptions provide a monthly credit allocation for supported ecommerce Data APIs, image generation and video generation. The credits used depend on the operation, model and settings. Check the cost shown in the official workspace or API documentation before running a task.',
  },
  {
    q: 'How are yearly plans billed?',
    a: 'Yearly plans are paid upfront for the full year. The large monthly amount is the yearly total divided by 12, not a monthly payment. Credits are allocated monthly. The card also shows the first-year total and the subsequent yearly renewal price when an introductory offer applies.',
  },
  {
    q: 'Who can use the first-subscription offer?',
    a: 'The displayed introductory prices apply to eligible new subscribers. The main Nexscope site determines eligibility and confirms the final payable amount. After the introductory period, the subscription renews at the standard price shown on the card.',
  },
  {
    q: 'Do unused subscription credits roll over?',
    a: 'No. Subscription credits renew each month and unused subscription credits do not roll over. Review the monthly allocation before choosing your plan.',
  },
  {
    q: 'Can I buy Data API credits without a subscription?',
    a: 'Yes. Data-only credit top-ups are available without a subscription. These credits cover Data API usage and do not cover image or video generation. Check the official pricing page for current top-up options and terms.',
  },
  {
    q: 'Do I need a subscription to list a product?',
    a: 'No. Product Gallery submission, editorial review, and approved listing and display are completely free. A subscription is not required to submit a product for review.',
  },
];

export const metadata: Metadata = {
  title: 'Nexscope Pricing | Compare API & AI Video Subscription Plans',
  description:
    'Compare Nexscope monthly and yearly subscriptions, shared API and video credits, introductory offers and renewal prices. Product Gallery listings stay free.',
  alternates: { canonical: '/pricing/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'Nexscope Pricing — Subscriptions & Shared Credits',
    description:
      'Compare monthly and yearly plans for ecommerce operators and developers.',
    url: '/pricing/',
    type: 'website',
    siteName: 'Nexscope Learn',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexscope Pricing | Ecommerce APIs & AI Video Plans',
    description:
      'Compare monthly and yearly billing, credit allocations and eligible introductory offers.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function PricingPage() {
  const rows: ((typeof pricingSnapshot.plans)[number] & {
    cycle: string;
    monthlyEquivalent: number;
    intro: number | null;
    url: string;
  })[] = pricingRows(pricingSnapshot.plans);
  const checkedAt = pricingSnapshot.checkedAt;
  const monthly = rows.filter((plan) => plan.billingPeriod === 1);
  const answer = monthly.length
    ? `Nexscope subscriptions combine ecommerce Data APIs with AI image and video creation. Standard monthly plans range from ${pricingMoney(Math.min(...monthly.map((plan) => plan.price)))} to ${pricingMoney(Math.max(...monthly.map((plan) => plan.price)))} USD. Yearly plans are paid upfront; monthly credits renew without rollover. Compare standard rates separately from eligible first-subscription discounts. Product Gallery submission and approved display remain free.`
    : 'Nexscope subscriptions combine ecommerce Data APIs with AI image and video creation. Yearly plans are paid upfront; monthly credits renew without rollover. Check the official pricing page for current rates and introductory offer eligibility. Product Gallery submission and approved display remain free.';
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              NEXSCOPE_ORGANIZATION,
              subscriptionService(pricingSnapshot.plans),
              {
                '@type': 'WebPage',
                '@id': 'https://learn.nexscope.ai/pricing/#webpage',
                name: 'Nexscope Pricing',
                description: answer,
                inLanguage: 'en',
                url: 'https://learn.nexscope.ai/pricing/',
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
                mainEntity: {
                  '@id': 'https://learn.nexscope.ai/pricing/#subscriptions',
                },
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Nexscope Learn',
                    item: 'https://learn.nexscope.ai/',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Pricing',
                    item: 'https://learn.nexscope.ai/pricing/',
                  },
                ],
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map(({ q, a }) => ({
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: { '@type': 'Answer', text: a },
                })),
              },
            ],
          }).replace(/</g, '\u003c'),
        }}
      />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader
        campaign="learn-pricing"
        homepageFocus
        productReviewCta
        active="pricing"
      />
      <main id="main">
        <section className={styles.hero}>
          <nav aria-label="Breadcrumb">
            <a href="/">Nexscope Learn</a>
            <span>/</span>
            <span aria-current="page">Pricing</span>
          </nav>
          <p className={styles.eyebrow}>NEXSCOPE SUBSCRIPTION PRICING</p>
          <h1>
            Nexscope pricing for
            <br />
            <em>ecommerce APIs & AI video.</em>
          </h1>
          <p>{answer}</p>
          <div className={styles.jumpLinks} aria-label="Pricing sections">
            <a href="#subscription-title">Subscription plans</a>
            <a href="#compare-plans">Compare standard prices</a>
            <a href="#choose-plan">Choose a plan</a>
            <a href="#pricing-faq-title">Billing questions</a>
          </div>
        </section>
        <HomepagePricing plans={pricingSnapshot.plans} />
        <section
          className={styles.comparison}
          id="compare-plans"
          aria-labelledby="compare-plans-title"
        >
          <p className={styles.eyebrow}>MONTHLY VS YEARLY · USD</p>
          <h2 id="compare-plans-title">What does each Nexscope plan cost?</h2>
          <p>
            Compare the amount charged, the monthly equivalent and your monthly
            credit allocation. Introductory prices apply only to eligible first
            subscriptions; subsequent renewals use the standard rate.
          </p>
          {rows.length ? (
            <section
              className={styles.tableWrap}
              aria-label="Subscription price comparison"
              tabIndex={0}
            >
              <table>
                <caption>
                  Nexscope subscription prices in USD. Yearly totals are paid
                  upfront.
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Plan / billing</th>
                    <th scope="col">Standard charge</th>
                    <th scope="col">Standard monthly equivalent</th>
                    <th scope="col">Eligible first charge</th>
                    <th scope="col">Credits / month</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((plan) => (
                    <tr key={plan.sku}>
                      <th scope="row">
                        {plan.name}
                        <span>{plan.cycle}</span>
                      </th>
                      <td>
                        {pricingMoney(plan.price)}
                        <span>
                          per{' '}
                          {plan.billingPeriod === 12
                            ? 'year, upfront'
                            : 'month'}
                        </span>
                      </td>
                      <td>
                        {pricingMoney(plan.monthlyEquivalent)}
                        <span>per month equivalent</span>
                      </td>
                      <td>
                        {plan.intro
                          ? pricingMoney(plan.intro)
                          : 'No offer listed'}
                        <span>
                          {plan.intro
                            ? `first ${plan.billingPeriod === 12 ? 'year, upfront' : 'month'} only`
                            : 'Check final eligibility'}
                        </span>
                      </td>
                      <td>{plan.credits.toLocaleString('en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : (
            <p>
              Current plan prices are unavailable here.{' '}
              <a
                href="https://www.nexscope.ai/pricing?co-from=learn"
                target="_blank"
                rel="noopener"
              >
                Check official Nexscope pricing.
              </a>
            </p>
          )}
          <p className={styles.sourceNote}>
            Source:{' '}
            <a
              href="https://www.nexscope.ai/pricing?co-from=learn"
              target="_blank"
              rel="noopener"
            >
              official Nexscope pricing
            </a>{' '}
            and the{' '}
            <a
              href="https://api.nexscope.ai/api/order/subscribe/plans"
              target="_blank"
              rel="noopener"
            >
              public subscription catalog
            </a>
            .{' '}
            {checkedAt && (
              <>
                Prices checked{' '}
                <time dateTime={checkedAt}>
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'Asia/Shanghai',
                  }).format(new Date(checkedAt))}
                </time>
                .{' '}
              </>
            )}
            Final prices and eligibility are confirmed on Nexscope.
          </p>
        </section>
        <section
          className={styles.decision}
          id="choose-plan"
          aria-labelledby="choose-plan-title"
        >
          <div>
            <p className={styles.eyebrow}>MATCH THE PLAN TO THE WORK</p>
            <h2 id="choose-plan-title">Which option fits your workflow?</h2>
            <p>
              Estimate your monthly tasks first, then compare the required
              credits with each plan. A credit allocation is not a fixed number
              of API results or videos.
            </p>
          </div>
          <div className={styles.decisionGrid}>
            <article>
              <h3>Creating in the browser</h3>
              <p>
                A subscription fits operators making product images or videos
                regularly. Check model, duration and resolution costs using your
                own product before committing to a year.
              </p>
              <a
                href="https://www.nexscope.ai/seller/video-generation/image-to-video?co-from=learn"
                target="_blank"
                rel="noopener"
              >
                Inspect Image to Video <ArrowRight size={14} />
              </a>
            </article>
            <article>
              <h3>Building with Data APIs</h3>
              <p>
                A subscription fits recurring marketplace research combined with
                creative work. Browse the Data directory and check each
                operation’s inputs and credit cost.
              </p>
              <a href="/data/">
                Find the right Data API <ArrowRight size={14} />
              </a>
            </article>
            <article>
              <h3>Only need Data APIs?</h3>
              <p>
                Consider Data-only top-ups for Data API usage without a
                subscription. They do not cover image or video generation.
              </p>
              <a href="#data-api-topups">
                Review Data-only options <ArrowRight size={14} />
              </a>
            </article>
          </div>
          <div className={styles.boundaries}>
            <h3>Check before subscribing</h3>
            <ul>
              <li>
                If you only want a public Product Gallery listing, you do not
                need a paid subscription.
              </li>
              <li>
                If your usage is irregular, account for monthly credit expiry
                before choosing an annual commitment.
              </li>
              <li>
                If you need a specific model, marketplace or throughput, verify
                its current access and limits in the official workspace or
                documentation first.
              </li>
            </ul>
            <p>
              <strong>Budget method:</strong> expected API requests × the
              documented credit cost, plus the estimated credits for your image
              and video tasks. Variable-cost operations and model settings can
              change the total.
            </p>
          </div>
        </section>
        <section className={styles.topUps} id="data-api-topups">
          <div>
            <p className={styles.eyebrow}>DATA API TOP-UPS</p>
            <h2>Only need marketplace data?</h2>
            <p>
              Buy Data-only credits without a subscription. Image and video
              generation use subscription credits; Data top-ups are for Data
              APIs.
            </p>
          </div>
          <a
            href="https://www.nexscope.ai/pricing?co-from=learn"
            target="_blank"
            rel="noopener"
            data-track-tool="data-api-topups"
          >
            See current top-up options <ArrowRight size={16} />
          </a>
        </section>
        <section className={styles.freeGallery}>
          <PackagePlus size={24} />
          <p>
            <strong>Product Gallery is completely free.</strong> Submission,
            review and approved display require no subscription.
          </p>
          <a
            href="/ecommerce-ai-tools/product-showcase/submit/"
            data-showcase-submit-cta="pricing-gallery"
          >
            List a product free <ArrowRight size={14} />
          </a>
        </section>
        <section className={styles.faq} aria-labelledby="pricing-faq-title">
          <div>
            <p className={styles.eyebrow}>BILLING, WITHOUT THE GUESSWORK</p>
            <h2 id="pricing-faq-title">
              Your pricing questions,
              <br />
              answered.
            </h2>
          </div>
          <div>
            {faqs.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <p className={styles.priceNote}>
          <Check size={14} /> Final prices and offer eligibility are confirmed
          on the main Nexscope site.
        </p>
      </main>
      <LearnFooter />
    </div>
  );
}
