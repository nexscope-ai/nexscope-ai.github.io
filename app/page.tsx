/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  Database,
  PackagePlus,
  Globe2,
  Code2,
  Check,
} from 'lucide-react';
import styles from './home.module.css';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import MarketingHeader from '@/components/marketing-header';

const library = '/ecommerce-ai-tools';
const gallery = `${library}/product-showcase/`;
const submit = `${gallery}submit/`;
const homeSummary =
  'Nexscope Learn helps developers find ecommerce Data APIs and sellers publish free product listings. Explore marketplace data for apps and AI workflows, or submit a product for a reviewed public page with facts, images and your store link.';
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
    q: 'Who should use the Nexscope Data API directory?',
    a: 'The directory is for developers, analysts and teams choosing ecommerce data for applications or AI workflows. Browsing is free. Before running a request, use the selected API’s official documentation to check its inputs, marketplace coverage, returned fields and credit requirements.',
  },
  {
    q: 'Is listing my product completely free?',
    a: 'Yes. Product submission, editorial review, and approved product listing and display are completely free. You do not need to pay or connect a store account to submit.',
  },
  {
    q: 'How can a Gallery page help with AI discovery?',
    a: 'An approved public page brings product facts, images and a link to your store together in a format search and AI systems can access. This supports generative engine optimization (GEO), but does not guarantee indexing, AI citations, traffic or sales.',
  },
  {
    q: 'What happens after I submit a product?',
    a: 'Save the private management link shown after submission. Use it to check status, read editorial feedback and make changes when needed. Products remain offline until approved and published; there is no fixed review deadline or automatic status email.',
  },
  {
    q: 'Can shoppers buy directly from the Product Gallery?',
    a: 'Purchases take place on your original store or marketplace listing. A Nexscope Product Gallery page presents the product and links shoppers to that destination. You keep your existing checkout and fulfillment process.',
  },
];
const resources = [
  {
    title: 'Amazon-to-1688 API test',
    description:
      'Inspect a dated Amazon-to-1688 sourcing test, its returned records and its limits.',
    href: `${library}/api-evidence/portable-blender-amazon-1688/`,
    label: 'Public API test',
  },
  {
    title: 'Prepare your product for AI search',
    description:
      'Learn which product facts make a page easier to understand and verify.',
    href: `${library}/product-page-geo-ai-shopping/`,
    label: 'Product GEO guide',
  },
  {
    title: 'Explore the learning library',
    description:
      'Find marketplace research, tools, tutorials and worked examples.',
    href: `${library}/`,
    label: 'All resources',
  },
];
const paths = [
  {
    title: 'Build a data workflow',
    icon: Code2,
    href: '/data/',
    label: 'Find your first API',
    steps: [
      [
        'Choose an operation',
        'Start with the marketplace and information you need.',
      ],
      [
        'Test one request',
        'Review required inputs, returned fields and current credit requirements.',
      ],
      [
        'Connect it to your app',
        'Use the documented REST API in your application or AI workflow.',
      ],
    ],
  },
  {
    title: 'Publish a free product listing',
    icon: Globe2,
    href: submit,
    label: 'Start a free submission',
    steps: [
      [
        'Add your product facts',
        'Share a public product URL or ASIN, accurate details and a clear image.',
      ],
      [
        'Save your private review link',
        'Check status, read feedback and edit your submission when needed.',
      ],
      [
        'Get a public page after approval',
        'Your product page brings its facts and media together and links to your store.',
      ],
    ],
  },
];

export const metadata: Metadata = {
  title: 'Ecommerce Data APIs & Free Product Listings | Nexscope Learn',
  description:
    'Browse Nexscope ecommerce Data APIs. Submit a product for free review and, if approved, a public listing built for search and AI discovery.',
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
    siteName: 'Nexscope Learn',
    title: 'Nexscope Learn — Ecommerce Data APIs & Free Product Listings',
    description:
      'Find the data for your next build. Give your product a free public page after review.',
    url: '/',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Data APIs & Free Product Listings',
    description:
      'Two ways to get started with Nexscope: explore ecommerce data or submit a product for free.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function Home() {
  return (
    <div className={styles.home}>
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
                description: homeSummary,
                url: 'https://learn.nexscope.ai/',
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://learn.nexscope.ai/#webpage',
                name: 'Ecommerce Data APIs & Free Product Listings',
                description: homeSummary,
                url: 'https://learn.nexscope.ai/',
                inLanguage: 'en',
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
                mainEntity: {
                  '@type': 'ItemList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Ecommerce Data API directory',
                      url: 'https://learn.nexscope.ai/data/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Free ecommerce Product Gallery',
                      url: `https://learn.nexscope.ai${gallery}`,
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
      <script src="/campaigns.js?v=3" defer />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader campaign="homepage" homepageFocus productReviewCta />
      <main id="main">
        <section className={`${styles.wrap} ${styles.focusHero}`}>
          <p className={styles.eyebrow}>NEXSCOPE · FOR BUILDERS AND SELLERS</p>
          <h1>
            Ecommerce Data APIs.
            <br />
            <em>Free product listings.</em>
          </h1>
          <p className={styles.focusLead}>{homeSummary}</p>
        </section>

        <section
          className={`${styles.wrap} ${styles.featurePair}`}
          aria-label="Choose your next step"
        >
          <article
            className={`${styles.primaryFeature} ${styles.dataFeature}`}
            id="data-apis"
          >
            <div className={styles.featureTop}>
              <span className={styles.featureIcon}>
                <Database size={23} />
              </span>
              <span className={styles.audienceTag}>
                FOR DEVELOPERS & AI BUILDERS
              </span>
            </div>
            <p className={styles.featureKicker}>DATA API DIRECTORY</p>
            <h2>
              Find ecommerce data.
              <br />
              Build your next workflow.
            </h2>
            <p className={styles.featureDescription}>
              Nexscope’s Data API directory helps developers and analysts find
              ecommerce data by platform and task. Open the matching official
              documentation to check inputs, results and credits before testing.
            </p>
            <div
              className={styles.platformPreview}
              aria-label="Supported marketplace examples"
            >
              {platforms.map(([logo, label]) => (
                <span key={logo}>
                  <img
                    src={`/data/logos/${logo}.webp`}
                    width="23"
                    height="23"
                    alt=""
                  />
                  {label}
                </span>
              ))}
            </div>
            <ul className={styles.featureBenefits}>
              {[
                'Find APIs by platform, category or keyword',
                'Compare purposes and recorded usage',
                'Open the exact API documentation and online test',
              ].map((text) => (
                <li key={text}>
                  <Check size={16} />
                  {text}
                </li>
              ))}
            </ul>
            <div className={styles.featureBottom}>
              <a
                className={styles.button}
                href="/data/"
                data-track-tool="data-directory"
              >
                Explore Data APIs <ArrowRight size={17} />
              </a>
              <p>Free to browse. API requests may use credits.</p>
            </div>
            <a
              className={styles.galleryBrowse}
              href={`${library}/api-capabilities/`}
            >
              How to choose your first API <ArrowRight size={15} />
            </a>
          </article>
          <article
            className={`${styles.primaryFeature} ${styles.galleryFeature}`}
            id="free-product-listings"
          >
            <div className={styles.featureTop}>
              <span className={styles.featureIcon}>
                <PackagePlus size={23} />
              </span>
              <span className={styles.freeTag}>
                100% FREE LISTING & DISPLAY
              </span>
            </div>
            <p className={styles.featureKicker}>PRODUCT GALLERY</p>
            <h2>
              Free product listings.
              <br />
              Built for AI discovery.
            </h2>
            <p className={styles.featureDescription}>
              Nexscope Product Gallery publishes reviewed product facts, images
              and your store link on a free public page. This gives search and
              AI systems another source for understanding what you sell.
            </p>
            <div
              className={styles.productPreview}
              aria-label="What your product page brings together"
            >
              <span className={styles.productPreviewIcon}>
                <PackagePlus size={34} />
              </span>
              <div>
                <strong>Your product, clearly presented.</strong>
                <span>Product facts · Images · Your store link</span>
              </div>
              <span className={styles.productPreviewGlobe}>
                <Globe2 size={21} />
              </span>
            </div>
            <ul className={styles.featureBenefits}>
              {[
                'A public product page after editorial approval',
                'Clear product context to support AI discovery & GEO',
                'Shoppers follow the link to your original store',
              ].map((text) => (
                <li key={text}>
                  <Check size={16} />
                  {text}
                </li>
              ))}
            </ul>
            <div className={styles.featureBottom}>
              <a
                className={`${styles.button} ${styles.galleryButton}`}
                href={submit}
                data-showcase-submit-cta="root-home-feature"
              >
                List your product for free <ArrowRight size={17} />
              </a>
              <p>No payment or store connection required.</p>
            </div>
            <a
              className={styles.galleryBrowse}
              href={gallery}
              data-track-tool="product-gallery"
            >
              Browse the Product Gallery <ArrowRight size={15} />
            </a>
          </article>
        </section>

        <section
          className={`${styles.wrap} ${styles.nextSteps}`}
          aria-labelledby="next-steps-title"
        >
          <div className={styles.focusSectionHeading}>
            <p className={styles.eyebrow}>A SIMPLE NEXT STEP</p>
            <h2 id="next-steps-title">
              Choose your path. Start with one task.
            </h2>
          </div>
          <div className={styles.pathGrid}>
            {paths.map((path) => (
              <article key={path.href}>
                <div className={styles.pathTitle}>
                  <path.icon size={21} />
                  <h3>{path.title}</h3>
                </div>
                <ol>
                  {path.steps.map(([title, text], i) => (
                    <li key={title}>
                      <span>0{i + 1}</span>
                      <div>
                        <strong>{title}</strong>
                        <p>{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <a
                  href={path.href}
                  data-track-tool={
                    path.href === '/data/' ? 'data-directory' : undefined
                  }
                  data-showcase-submit-cta={
                    path.href === submit ? 'root-home-steps' : undefined
                  }
                >
                  {path.label} <ArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className={`${styles.wrap} ${styles.supportingResources}`}
          aria-labelledby="resource-title"
        >
          <div className={styles.focusSectionHeading}>
            <p className={styles.eyebrow}>HELP WHEN YOU NEED IT</p>
            <h2 id="resource-title">A little guidance before you start.</h2>
          </div>
          <div className={styles.resourceTriplet}>
            {resources.map((item) => (
              <a key={item.href} href={item.href}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ArrowRight size={19} aria-hidden="true" />
              </a>
            ))}
          </div>
          <nav
            className={styles.secondaryResources}
            aria-label="More Nexscope resources"
          >
            <a href="/tools/">Ecommerce tools</a>
            <a href={`${library}/topics/research/`}>Market research</a>
            <a href={`${library}/topics/sourcing/`}>Sourcing & 1688</a>
            <a href={`${library}/topics/creative/`}>Images & video</a>
            <a href={`${library}/api-evidence/`}>API evidence</a>
            <a href={`${library}/community/`}>Community</a>
          </nav>
        </section>

        <section
          className={`${styles.wrap} ${styles.homeFaq}`}
          aria-labelledby="faq-title"
        >
          <div className={styles.focusSectionHeading}>
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
      <footer className={`${styles.wrap} ${styles.footer}`}>
        <div>
          <a href="/">Nexscope Learn</a>
          <p>Ecommerce data. Clearer product discovery.</p>
        </div>
        <nav className={styles.footerlinks} aria-label="Footer">
          <a href="/data/">Data APIs</a>
          <a href={gallery}>Product Gallery</a>
          <a href={submit} data-showcase-submit-cta="root-home-footer">
            List a product free
          </a>
          <a href="/tools/">Tools</a>
          <a href={`${library}/`}>Learning library</a>
          <a href={`${library}/community/`}>Community</a>
          <a href="/about/">About</a>
          <a href="/security/">Security</a>
          <a href="/contact/">Contact</a>
          <a href="https://www.nexscope.ai/privacy">Privacy</a>
          <a href="https://www.nexscope.ai/terms">Terms</a>
          <a href="#analytics-preferences">Cookie settings</a>
        </nav>
        <p className={styles.disclosure}>
          Nexscope publishes this directory and Product Gallery. Product
          submission, review and approved display are free. API access and
          credits follow the selected operation’s official documentation.
        </p>
      </footer>
    </div>
  );
}
