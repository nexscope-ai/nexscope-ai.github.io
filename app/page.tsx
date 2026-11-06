/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  ClipboardCheck,
  Database,
  Globe2,
  PackagePlus,
  Sparkles,
  MessageCircle,
  Search,
  Users,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import HomeVideoExamples from '@/components/home-video-examples';
import exampleSnapshot from '@/lib/home-video-examples.json';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import creditSnapshot from '@/lib/data-credit-snapshot.json';
import homeProductSnapshot from '@/lib/home-product-snapshot.json';
import socialCatalog from '@/lib/social-api-directory.json';
import { pricingMoney } from '@/lib/pricing-content.mjs';
import {
  entrySubscription,
  estimatedCapacity,
  historicalAverage,
  publicCostExamples,
} from '@/lib/home-value.mjs';
import { videoWorkflows, workflowUrl } from '@/lib/home-video-workflows';
import { HOME_SOCIAL_IMAGE, NEXSCOPE_ORGANIZATION } from '@/lib/site-metadata';
import styles from './home-sections.module.css';

const gallery = '/ecommerce-ai-tools/product-showcase/';
const submit = `${gallery}submit/`;
const publishedProduct = homeProductSnapshot.product;
const summary =
  'Nexscope helps ecommerce operators create product videos and developers build with marketplace Data APIs. Explore official video examples, choose a workflow, or get a human-reviewed Product Growth Report. Product Gallery listings are free.';
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
    a: 'Explore ecommerce Data APIs for marketplace research and Social APIs for profiles, posts, comments, search and transcripts. Choose an endpoint by platform and task, then open its official playground to inspect required inputs and responses. API requests use your own credentials and follow the selected operation’s requirements.',
  },
  {
    q: 'Is the Product Growth Report the same as a free Gallery listing?',
    a: 'No. The growth report is a separately quoted credit-based service for one product and target market, reviewed before delivery. Choose at least one paid service; SEO and GEO analyses are included. Gallery submission, review and approved display remain completely free.',
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
  title: 'Nexscope Learn | Data APIs, Videos & Product Growth',
  description:
    'Build with Data and Social APIs, create product videos, or get a human-reviewed Product Growth Report. Product Gallery listings are completely free.',
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
    title: 'Nexscope Learn — APIs, Videos & Product Growth',
    description: summary,
    siteName: 'Nexscope Learn',
    url: '/',
    type: 'website',
    images: [HOME_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexscope Learn | Data APIs, Videos & Product Growth',
    description: summary,
    images: [HOME_SOCIAL_IMAGE],
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
                name: 'Ecommerce APIs, video workflows and product growth services',
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
                      name: 'Product Growth Report and free Product Gallery',
                      url: 'https://learn.nexscope.ai/#product-growth',
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
            workflows with marketplace APIs. Get a clearer plan for your product
            with a reviewed growth report, or publish a free Gallery listing.
          </p>
          <nav
            className={styles.quickNav}
            aria-label="Explore the three homepage modules"
          >
            <a className={styles.quickLink} href="#for-ecommerce-developers">
              <span className={styles.quickIcon}>
                <Code2 size={20} aria-hidden="true" />
              </span>
              <span className={styles.quickCopy}>
                <strong>For ecommerce developers</strong>
                <span>Build with ecommerce and social media APIs.</span>
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
                <span>Create product videos from your own materials.</span>
              </span>
              <ArrowDownRight
                className={styles.quickArrow}
                size={18}
                aria-hidden="true"
              />
            </a>
            <a className={styles.quickLink} href="#product-growth">
              <span className={styles.quickIcon}>
                <ClipboardCheck size={20} aria-hidden="true" />
              </span>
              <span className={styles.quickCopy}>
                <strong>For every product team</strong>
                <span>Growth reports and free product listings.</span>
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
              its documented inputs and results. For profiles, posts and
              comments, explore the{' '}
              <a href="/social/" data-track-tool="social-directory">
                Social API directory
              </a>
              .
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
          <section
            className={styles.socialFeature}
            aria-labelledby="home-social-title"
          >
            <div className={styles.socialFeatureIntro}>
              <p className={styles.valueEyebrow}>SOCIAL & CONTENT DATA APIS</p>
              <h3 id="home-social-title">
                Build with the conversations behind the market.
              </h3>
              <p>
                Bring social profiles, posts, comments, search results and
                transcripts into your research tools and apps. Explore{' '}
                {socialCatalog.entries.length} published operations and choose
                the endpoint that fits your platform and task.
              </p>
              <div
                className={styles.platforms}
                aria-label="Social platform examples"
              >
                {[
                  ['Instagram', '/assets/video-channels/instagram.svg'],
                  ['TikTok', '/assets/video-channels/tiktok.webp'],
                  ['YouTube', '/assets/video-channels/youtube.svg'],
                  ['Reddit', '/assets/social-platforms/reddit.svg'],
                  ['LinkedIn', '/assets/social-platforms/linkedin.svg'],
                  ['X / Twitter', '/assets/social-platforms/x.svg'],
                ].map(([name, logo]) => (
                  <span key={name}>
                    <img
                      src={logo}
                      alt=""
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                    {name}
                  </span>
                ))}
              </div>
              <a
                className={styles.primary}
                href="/social/"
                data-track-tool="social-directory"
                data-cta-placement="home-developers-social"
              >
                Explore Social APIs <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.socialTasks}>
              {(
                [
                  [
                    Users,
                    'Research creators',
                    'Inspect public profiles and available post data before building your shortlist.',
                  ],
                  [
                    MessageCircle,
                    'Understand discussions',
                    'Explore comments and replies to review questions, feedback and context.',
                  ],
                  [
                    Search,
                    'Discover content',
                    'Find platform search and transcript endpoints for your content research workflow.',
                  ],
                ] as const
              ).map(([Icon, title, description]) => (
                <div key={title}>
                  <Icon size={22} aria-hidden="true" />
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
              <p className={styles.socialScope}>
                Coverage, available fields and access requirements vary by
                endpoint. Inspect a response in the official playground before
                integrating.
              </p>
            </div>
          </section>
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
                  Estimates checked {creditSnapshot.checkedAt.slice(0, 10)}.
                  Other APIs have different costs. This is an allocation
                  estimate, not a per-call cash price.
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
              <a href="/video/" data-track-tool="video-directory">
                Compare all video workflows <ArrowRight size={16} />
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
        </section>

        <section
          className={`${styles.module} ${styles.growthModule}`}
          id="product-growth"
          aria-labelledby="growth-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span>03</span> FOR OPERATORS & DEVELOPERS
              </p>
              <h2 id="growth-title">
                Know what to improve.
                <br />
                <em>Give your product a clearer next step.</em>
              </h2>
            </div>
            <p className={styles.moduleIntro}>
              Get recommendations for one product and market, or create a free
              public source of product facts. Two separate services for the same
              product team.
            </p>
          </div>
          <div className={styles.growthFeature}>
            <div>
              <p className={styles.eyebrow}>
                PRODUCT GROWTH REPORT · PAID SERVICES
              </p>
              <h3>
                One product link.
                <br />A plan you can act on.
              </h3>
              <p>
                Choose AI mention analysis, competitor research, keywords,
                product copy or advertising images. Receive a report reviewed by
                a person before delivery, with findings, available evidence and
                recommended changes.
              </p>
              <div className={styles.growthTags}>
                <span>SEO & GEO included</span>
                <span>Human review before delivery</span>
                <span>Expected within 24 hours</span>
              </div>
              <a
                className={styles.primary}
                href="/product-growth-report/"
                data-track-tool="product-growth-report"
                data-cta-placement="home-growth-report"
              >
                Explore the growth report{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <p className={styles.dataNote}>
                Choose at least one paid service. Review your credit quote
                before submitting. You apply the recommendations.
              </p>
            </div>
            <div className={styles.growthOutline}>
              <span>FROM PRODUCT PAGE TO NEXT ACTION</span>
              <ol>
                <li>
                  <strong>Your product & market</strong>
                  <p>
                    Start with an Amazon listing or public store product page.
                  </p>
                </li>
                <li>
                  <strong>Your chosen analysis or creative services</strong>
                  <p>Focus on the questions and materials you need.</p>
                </li>
                <li>
                  <strong>A reviewed, downloadable delivery</strong>
                  <p>
                    Read your HTML report and download purchased PNG images.
                  </p>
                </li>
              </ol>
            </div>
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
            {publishedProduct && (
              <article className={styles.publishedExample}>
                <a
                  href={publishedProduct.href}
                  aria-label={`View ${publishedProduct.title}`}
                >
                  <img
                    src={publishedProduct.image}
                    alt={publishedProduct.title}
                    width="420"
                    height="320"
                    loading="lazy"
                  />
                </a>
                <div>
                  <span className={styles.publishedBadge}>
                    PUBLISHED GALLERY EXAMPLE
                  </span>
                  <h4>{publishedProduct.title}</h4>
                  <p>{publishedProduct.description}</p>
                  <a href={publishedProduct.href}>
                    See the real product page <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            )}
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
