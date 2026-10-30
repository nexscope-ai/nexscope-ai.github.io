/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight, Check, Code2, Film, PackagePlus } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import HomepagePricing from '@/components/homepage-pricing';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';
import styles from './pricing.module.css';

const faqs = [
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
  title: 'Nexscope Pricing | Monthly & Yearly Subscription Plans',
  description:
    'Compare Nexscope monthly and yearly subscriptions, shared API and video credits, introductory offers and renewal prices. Product Gallery listings stay free.',
  alternates: { canonical: '/pricing/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Nexscope Pricing — Subscriptions & Shared Credits',
    description:
      'Compare monthly and yearly plans for ecommerce operators and developers.',
    url: '/pricing/',
    type: 'website',
    siteName: 'Nexscope Learn',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                name: 'Nexscope Pricing',
                url: 'https://learn.nexscope.ai/pricing/',
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
          }).replace(/</g, '\\u003c'),
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
          <p className={styles.eyebrow}>CREATE. RESEARCH. BUILD.</p>
          <h1>
            A plan for your
            <br />
            <em>next ecommerce workflow.</em>
          </h1>
          <p>
            For ecommerce operators creating in the browser and developers
            building with APIs. Compare the credits and billing cycle that fit
            your work.
          </p>
        </section>
        <HomepagePricing plans={pricingSnapshot.plans} />
        <section
          className={styles.planApplications}
          aria-labelledby="pricing-use-cases"
        >
          <h2 id="pricing-use-cases">
            Use your credits where the work happens.
          </h2>
          <div className={styles.applicationGrid}>
            <article>
              <Film size={24} />
              <h3>For ecommerce operators</h3>
              <p>
                Create product videos from images, a product URL or a reference
                clip. Explore avatar-led storytelling and batch workflows on the
                main site.
              </p>
              <a href="/#for-ecommerce-operators">
                Explore video workflows <ArrowRight size={15} />
              </a>
            </article>
            <article>
              <Code2 size={24} />
              <h3>For ecommerce developers</h3>
              <p>
                Research products, reviews, keywords and sourcing data through
                documented APIs. Check the inputs and credit requirements for
                each operation.
              </p>
              <a href="/data/" data-track-tool="data-directory">
                Explore Data APIs <ArrowRight size={15} />
              </a>
            </article>
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
