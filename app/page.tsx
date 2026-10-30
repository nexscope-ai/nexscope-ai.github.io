/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Database,
  Globe2,
  PackagePlus,
  Sparkles,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import HomeVideoExamples from '@/components/home-video-examples';
import exampleSnapshot from '@/lib/home-video-examples.json';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import creditSnapshot from '@/lib/data-credit-snapshot.json';
import { pricingMoney } from '@/lib/pricing-content.mjs';
import {
  entrySubscription,
  estimatedCapacity,
  historicalAverage,
  publicCostExamples,
} from '@/lib/home-value.mjs';
import { videoWorkflows, workflowUrl } from '@/lib/home-video-workflows';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from './home-sections.module.css';

const gallery = '/ecommerce-ai-tools/product-showcase/';
const submit = `${gallery}submit/`;
const summary =
  'Nexscope helps ecommerce operators create product videos and developers build with marketplace Data APIs. Explore official video examples, choose a workflow, or submit a product for a free reviewed Gallery listing.';
const platforms = [
  ['amazon', 'Amazon'],
  ['tiktok', 'TikTok'],
  ['1688', '1688'],
  ['shopify', 'Shopify'],
  ['shopee', 'Shopee'],
  ['walmart', 'Walmart'],
] as const;
const faqs = [
  {
    q: 'What can ecommerce operators do here?',
    a: 'Explore Image to Video, URL to Video, Avatar Video, Video Clone, Bulk Video and the Model Library. Open a workflow on the official Nexscope site to check its inputs, settings and credit requirements before creating a video.',
  },
  {
    q: 'What is available for ecommerce developers?',
    a: 'The Data API directory groups marketplace and research APIs by platform and task. Compare descriptions, recorded usage and credit ranges, then open the exact official documentation and online tester. API requests use your own credentials and follow the selected operation’s requirements.',
  },
  {
    q: 'Is listing my product completely free?',
    a: 'Yes. Product submission, editorial review, and approved product listing and display are completely free. You do not need to pay or connect a store account to submit. Save the private management link after submission to check status, read feedback and edit your details.',
  },
  {
    q: 'Does a Product Gallery listing guarantee AI recommendations?',
    a: 'An approved listing gives search and AI systems a public source of product facts, images and your store link. It supports AI discovery and GEO, but does not guarantee indexing, recommendations, traffic or sales. Purchases take place on your original store.',
  },
  {
    q: 'Where can I compare subscriptions and API credits?',
    a: 'The Pricing page shows monthly and yearly subscriptions from Nexscope’s public plan catalog. Review the upfront total, monthly credit allocation, introductory offer eligibility and renewal price. Data-only credit top-ups are also available without a subscription.',
  },
];

export const metadata: Metadata = {
  title: 'Nexscope Learn | Ecommerce AI Videos & Data APIs',
  description:
    'Create ecommerce product videos with Nexscope or build with marketplace Data APIs. Explore official video examples, subscription plans and free product listings.',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Nexscope Learn — Product Videos & Ecommerce Data APIs',
    description: summary,
    siteName: 'Nexscope Learn',
    url: '/',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexscope Learn | Ecommerce AI Videos & Data APIs',
    description: summary,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function Home() {
  const entry = entrySubscription(pricingSnapshot.plans);
  const videoCount = entry
    ? estimatedCapacity(entry.credits, publicCostExamples.video.credits)
    : null;
  const dataCost = historicalAverage(creditSnapshot, '1688-search-by-image');
  const dataCount = entry ? estimatedCapacity(entry.credits, dataCost) : null;
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              NEXSCOPE_ORGANIZATION,
              {
                '@type': 'WebSite',
                '@id': 'https://learn.nexscope.ai/#website',
                name: 'Nexscope Learn',
                url: 'https://learn.nexscope.ai/',
                description: summary,
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://learn.nexscope.ai/#webpage',
                url: 'https://learn.nexscope.ai/',
                name: 'Ecommerce AI video workflows and Data APIs',
                description: summary,
                inLanguage: 'en',
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
                mainEntity: {
                  '@type': 'ItemList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Ecommerce video workflows',
                      url: 'https://learn.nexscope.ai/#for-ecommerce-operators',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Ecommerce Data API directory',
                      url: 'https://learn.nexscope.ai/data/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Free Product Gallery',
                      url: `https://learn.nexscope.ai${gallery}`,
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'Nexscope subscriptions',
                      url: 'https://learn.nexscope.ai/pricing/',
                    },
                  ],
                },
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
      <MarketingHeader campaign="homepage" homepageFocus productReviewCta />
      <main id="main">
        <section className={styles.hero}>
          <p className={styles.eyebrow}>
            NEXSCOPE · AI TOOLS & DATA FOR ECOMMERCE
          </p>
          <h1>
            Create for your store.
            <br />
            <em>Build for ecommerce.</em>
          </h1>
          <p className={styles.heroLead}>
            Turn product photos and links into video stories. Build ecommerce
            workflows with marketplace APIs. Give your product a free public
            page to support AI discovery.
          </p>
          <nav
            className={styles.quickNav}
            aria-label="Explore the two homepage modules"
          >
            <a className={styles.quickLink} href="#for-ecommerce-developers">
              <span className={styles.quickIcon}>
                <Code2 size={20} aria-hidden="true" />
              </span>
              <span className={styles.quickCopy}>
                <strong>For ecommerce developers</strong>
                <span>Find Data APIs and build marketplace workflows.</span>
              </span>
              <ArrowDownRight
                className={styles.quickArrow}
                size={18}
                aria-hidden="true"
              />
            </a>
            <a className={styles.quickLink} href="#for-ecommerce-operators">
              <span className={styles.quickIcon}>
                <Sparkles size={20} aria-hidden="true" />
              </span>
              <span className={styles.quickCopy}>
                <strong>For ecommerce operators</strong>
                <span>Create product videos. Product listings are free.</span>
              </span>
              <ArrowDownRight
                className={styles.quickArrow}
                size={18}
                aria-hidden="true"
              />
            </a>
          </nav>
          <div className={styles.priceIntro}>
            <div className={styles.priceIntroLine}>
              <a
                className={styles.trialLink}
                href={workflowUrl('image-to-video')}
                target="_blank"
                rel="noopener"
                data-track-tool="image-to-video"
              >
                Try Image to Video <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a
                className={styles.trialLink}
                href="https://www.nexscope.ai/api-docs/1688-search-by-image?co-from=learn"
                target="_blank"
                rel="noopener"
                data-track-tool="1688-search-by-image"
              >
                Test a Data API <ArrowUpRight size={13} aria-hidden="true" />
              </a>
              <a className={styles.fromPrice} href="/pricing/">
                {entry ? (
                  <>
                    Plans from{' '}
                    <strong>
                      {pricingMoney(entry.monthlyAmount)}
                      <span>/mo</span>
                    </strong>
                    {entry.intro && (
                      <span className={styles.introBadge}>
                        {Math.round((1 - entry.intro / entry.price) * 100)}% off
                        first {entry.billingPeriod === 12 ? 'year' : 'month'}
                      </span>
                    )}
                  </>
                ) : (
                  'Explore subscription plans'
                )}{' '}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
            <p className={styles.priceTerms}>
              {entry ? (
                <>
                  {entry.intro
                    ? `Eligible first ${entry.billingPeriod === 12 ? 'year' : 'month'} on ${entry.name}: `
                    : `${entry.name}: `}
                  {pricingMoney(entry.intro ?? entry.price)}{' '}
                  {entry.billingPeriod === 12
                    ? 'billed upfront'
                    : 'billed monthly'}
                  {entry.intro
                    ? `, then ${pricingMoney(entry.price)}/${entry.billingPeriod === 12 ? 'year' : 'month'}`
                    : ` per ${entry.billingPeriod === 12 ? 'year' : 'month'}`}
                  .{' '}
                </>
              ) : null}
              USD · New accounts: 1,000 trial credits for 3 days. No credit card
              required. Trial videos are in-app only.
            </p>
          </div>
        </section>

        <section
          className={`${styles.module} ${styles.developers}`}
          id="for-ecommerce-developers"
          aria-labelledby="developers-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span>01</span> FOR ECOMMERCE DEVELOPERS
              </p>
              <h2 id="developers-title">
                The data behind
                <br />
                <em>your next build.</em>
              </h2>
            </div>
            <p className={styles.moduleIntro}>
              Bring marketplace research into your apps, internal tools and AI
              workflows. Find an operation by platform and task, then inspect
              its documented inputs and results.
            </p>
          </div>
          <div className={styles.developerGrid} id="data-apis">
            <div className={styles.dataCopy}>
              <span className={styles.dataIcon}>
                <Database size={24} aria-hidden="true" />
              </span>
              <h3>Find the right ecommerce Data API.</h3>
              <p>
                Research products, reviews, keywords, sourcing candidates and
                competitors across marketplaces.
              </p>
              <div
                className={styles.platforms}
                aria-label="Marketplace examples"
              >
                {platforms.map(([slug, name]) => (
                  <span key={slug}>
                    <img
                      src={`/data/logos/${slug}.webp`}
                      alt=""
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                    {name}
                  </span>
                ))}
              </div>
              <ul className={styles.benefits}>
                <li>
                  <Check size={16} />
                  Filter APIs by platform, category or keyword
                </li>
                <li>
                  <Check size={16} />
                  Compare recorded usage and credit ranges
                </li>
                <li>
                  <Check size={16} />
                  Open the exact official documentation and tester
                </li>
              </ul>
              <a
                className={styles.primary}
                href="/data/"
                data-track-tool="data-directory"
              >
                Explore Data APIs <ArrowRight size={16} />
              </a>
              <p className={styles.dataNote}>
                Free to browse. API requests follow the selected operation’s
                access and credit requirements.
              </p>
            </div>
            <div className={styles.codeCard}>
              <div className={styles.codeTop}>
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>START WITH THE PUBLIC CATALOG</span>
                <Code2 size={17} />
              </div>
              <div className={styles.codeBody}>
                <span className={styles.httpMethod}>GET</span>
                <span className={styles.codePath}>/api/skill-api/catalog</span>
                <pre>
                  <code>{`curl --request GET \\\n  'https://api.nexscope.ai/api/skill-api/catalog'`}</code>
                </pre>
                <div className={styles.codeComment}>
                  Discover the available operations.
                  <br />
                  Choose a Data API, check its inputs and test with your own API
                  key.
                </div>
              </div>
              <ol className={styles.apiSteps}>
                <li>
                  <span>1</span>Choose a marketplace
                </li>
                <li>
                  <span>2</span>Inspect an endpoint
                </li>
                <li>
                  <span>3</span>Test one real request
                </li>
              </ol>
              <a
                href="https://www.nexscope.ai/api-docs/1688-search-by-image?co-from=learn"
                target="_blank"
                rel="noopener"
                data-track-tool="1688-search-by-image"
              >
                Test 1688 Search by Image <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          {entry && dataCount !== null && (
            <div className={styles.valueStrip}>
              <div>
                <p className={styles.valueEyebrow}>PLAN YOUR API BUDGET</p>
                <h3>
                  About {dataCount.toLocaleString('en-US')} calls at {dataCost}{' '}
                  credits each, using historical averages.
                </h3>
                <p>
                  For example, {publicCostExamples.data.name} has a historical
                  average of {dataCost} credits per call with a 10-credit
                  minimum applied. This uses the full {entry.name} monthly
                  allocation of {entry.credits.toLocaleString('en-US')} credits
                  for that operation.
                </p>
                <small>
                  Source:{' '}
                  <a
                    href="https://api.nexscope.ai/api/skill-api/v1/credit-statistics"
                    target="_blank"
                    rel="noopener"
                  >
                    public credit statistics
                  </a>
                  , checked {creditSnapshot.checkedAt.slice(0, 10)}. Other APIs
                  have different costs. This is an allocation estimate, not a
                  per-call cash price.
                </small>
              </div>
              <a href="/data/1688-sourcing/">
                Explore 1688 APIs <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
          <div className={styles.evidenceRow}>
            <div>
              <Globe2 size={20} />
              <p>See a workflow before you build it.</p>
            </div>
            <a href="/ecommerce-ai-tools/api-evidence/portable-blender-amazon-1688/">
              Amazon-to-1688 API test <ArrowRight size={14} />
            </a>
            <a href="/ecommerce-ai-tools/api-capabilities/">
              API selection guide <ArrowRight size={14} />
            </a>
            <a href="/ecommerce-ai-tools/">
              Learning library <ArrowRight size={14} />
            </a>
          </div>
        </section>

        <section
          className={styles.module}
          id="for-ecommerce-operators"
          aria-labelledby="operators-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span>02</span> FOR ECOMMERCE OPERATORS
              </p>
              <h2 id="operators-title">
                Make your next
                <br />
                <em>product story.</em>
              </h2>
            </div>
            <div className={styles.moduleIntro}>
              <p>
                From a product photo to a video concept. Create in the browser,
                review the result and choose what fits your store.
              </p>
              <a
                href={workflowUrl('image-to-video')}
                target="_blank"
                rel="noopener"
                data-track-tool="image-to-video"
              >
                Try Image to Video <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <HomeVideoExamples examples={exampleSnapshot.examples} />
          <p className={styles.exampleNote}>
            Official Nexscope Inspiration examples. Preview a clip, then start
            with your own product. Outputs vary by input and model.
          </p>
          {entry && videoCount !== null && (
            <div className={styles.valueStrip}>
              <div>
                <p className={styles.valueEyebrow}>
                  A SMALL PLAN. ROOM TO CREATE.
                </p>
                <h3>
                  {entry.name}: {entry.credits.toLocaleString('en-US')} credits
                  every month.
                </h3>
                <p>
                  About{' '}
                  <strong>
                    {videoCount.toLocaleString('en-US')} five-second videos
                  </strong>{' '}
                  if the full allocation goes to {publicCostExamples.video.name}{' '}
                  at {publicCostExamples.video.setting} (
                  {publicCostExamples.video.credits} credits each).
                </p>
                <small>
                  Source:{' '}
                  <a
                    href="https://www.nexscope.ai/pricing?co-from=learn"
                    target="_blank"
                    rel="noopener"
                  >
                    official pricing
                  </a>
                  , checked {publicCostExamples.verifiedOn}. Costs vary by model
                  and settings. Trial video creation is in-app only; video API
                  access is excluded.
                </small>
              </div>
              <a href="/pricing/">
                Compare plans <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
          <div className={styles.subheading}>
            <h3>A starting point for every kind of product video.</h3>
            <span>Choose your workflow</span>
          </div>
          <div className={styles.workflowGrid}>
            {videoWorkflows.map(
              ({ name, path, icon: Icon, description, input }) => (
                <a
                  className={styles.workflowCard}
                  href={workflowUrl(path)}
                  key={path}
                  target="_blank"
                  rel="noopener"
                  data-track-tool={path}
                >
                  <div className={styles.workflowTop}>
                    <Icon size={22} aria-hidden="true" />
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </div>
                  <h4>{name}</h4>
                  <p>{description}</p>
                  <span>{input}</span>
                </a>
              ),
            )}
          </div>
          <div className={styles.galleryBanner} id="free-product-listings">
            <div className={styles.galleryIcon}>
              <PackagePlus size={31} aria-hidden="true" />
            </div>
            <div className={styles.galleryCopy}>
              <p className={styles.freeBadge}>100% FREE LISTING & DISPLAY</p>
              <h3>
                A clearer page for your product.
                <br />
                Another source for AI discovery.
              </h3>
              <p>
                Publish reviewed product facts, images and your store link in
                the Product Gallery. Submission, review and approved display are
                completely free.
              </p>
              <small>
                Keep your existing checkout. Indexing, AI recommendations and
                traffic are not guaranteed.
              </small>
            </div>
            <div className={styles.galleryActions}>
              <a href={submit} data-showcase-submit-cta="root-home-feature">
                List your product for free <ArrowRight size={15} />
              </a>
              <a href={gallery}>
                Browse the Product Gallery <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <div
            className={styles.galleryExample}
            aria-labelledby="gallery-example-title"
          >
            <div className={styles.galleryJourney}>
              <p className={styles.eyebrow}>SEE WHAT YOU GET</p>
              <h3 id="gallery-example-title">
                From product facts to a public Gallery page.
              </h3>
              <ol>
                <li>
                  <strong>You provide</strong>
                  <span>
                    Your product link, accurate details and a clear product
                    image. No store connection required.
                  </span>
                </li>
                <li>
                  <strong>We review</strong>
                  <span>
                    Read editorial feedback on your private management page.
                    Publication follows approval.
                  </span>
                </li>
                <li>
                  <strong>Your product gets a public page</strong>
                  <span>
                    Approved listings bring product facts, images and a link to
                    your original store together in one crawlable page.
                  </span>
                </li>
              </ol>
              <p className={styles.galleryExampleNote}>
                Submission, review and approved display are completely free. A
                clearer source of product facts can support AI discovery;
                indexing, recommendations and traffic are not guaranteed.
              </p>
              <a href={submit} data-showcase-submit-cta="home-gallery-example">
                Create your free product page <ArrowRight size={15} />
              </a>
            </div>
            <article className={styles.publishedExample}>
              <a
                href={`${gallery}product/d693a492-b61c-4ee2-8390-d5c4a7140748/`}
                aria-label="View the published PARTNER Cheese Block product page"
              >
                <img
                  src="https://store.nexscope.ai/product-showcase/uploads/5d8d2c29-6640-4833-a644-86df3991dafd-20261029.webp"
                  alt="PARTNER Cheese Block Freeze-Dried Treats — Box of 12 Sachets"
                  width="420"
                  height="320"
                  loading="lazy"
                />
              </a>
              <div>
                <span className={styles.publishedBadge}>
                  PUBLISHED GALLERY EXAMPLE
                </span>
                <h4>PARTNER Cheese Block Freeze-Dried Treats</h4>
                <p>12 sachets · 4 oz total · For cats and dogs</p>
                <ul>
                  <li>Product facts and feeding limitations</li>
                  <li>Accurate product image</li>
                  <li>Link to the original store</li>
                </ul>
                <a
                  href={`${gallery}product/d693a492-b61c-4ee2-8390-d5c4a7140748/`}
                >
                  See the real product page <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          </div>
        </section>

        <section
          className={styles.pricingStrip}
          aria-labelledby="home-pricing-title"
        >
          <div>
            <p className={styles.eyebrow}>
              <Sparkles size={13} /> PLANS FOR YOUR NEXT STEP
            </p>
            <h2 id="home-pricing-title">
              One subscription.
              <br />
              Create and build with shared credits.
            </h2>
            <p>
              Compare monthly and yearly plans, credit allocations and
              first-subscription offers. Product Gallery listings stay free.
            </p>
          </div>
          <a href="/pricing/">
            Explore subscription plans <ArrowRight size={17} />
          </a>
        </section>
        <section className={styles.faq} aria-labelledby="faq-title">
          <div>
            <p className={styles.eyebrow}>GOOD TO KNOW</p>
            <h2 id="faq-title">Before you get started.</h2>
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
      </main>
      <LearnFooter />
    </div>
  );
}
