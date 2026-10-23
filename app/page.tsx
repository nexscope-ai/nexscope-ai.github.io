/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import HomeLibrary from './home-library';
import styles from './home.module.css';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import MarketingHeader from '@/components/marketing-header';

const tracking = '?co-from=learn';
const docs = `https://www.nexscope.ai/api-docs${tracking}`;

export const metadata: Metadata = {
  title: 'Free Product Page Review & Seller Resources | Nexscope',
  description:
    'Get free product-page feedback and an approved public Gallery listing linked to your store. Explore Nexscope seller guides, tools and API workflows.',
  keywords: [
    'free product page review',
    'professional product page feedback',
    'free product showcase for online sellers',
    'product listing improvement advice',
    'ecommerce product visibility help',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Free Product Page Review & Seller Resources | Nexscope',
    description:
      'Get free product-page feedback and a public Gallery page if approved. Find seller guides and tools for your next product decision.',
    url: '/',
    siteName: 'Nexscope',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Product Page Review & Seller Resources | Nexscope',
    description:
      'Get free product-page feedback and a public Gallery page if approved. Find seller guides and tools for your next product decision.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const sellerProblems = [
  {
    id: 'product-visibility',
    label: 'DISCOVERY',
    title: 'My product needs more visibility',
    description:
      'Get a second look at product facts and search language, plus an additional public showcase if approved.',
    link: 'Explore product visibility help',
  },
  {
    id: 'product-page-review',
    label: 'BUYER CLARITY',
    title: 'Visitors arrive but do not buy',
    description:
      'Check whether your product details, images and compatibility information leave buyer questions unanswered.',
    link: 'Explore product-page feedback',
  },
  {
    id: 'product-media-review',
    label: 'PRODUCT VISUALS',
    title: 'My photos do not explain the product',
    description:
      'Review variant accuracy, scale, included items and real use before planning new photos or video.',
    link: 'Explore image and video feedback',
  },
] as const;

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
                name: 'Nexscope Learning Hub',
                url: 'https://learn.nexscope.ai/',
                inLanguage: 'en',
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://learn.nexscope.ai/#webpage',
                url: 'https://learn.nexscope.ai/',
                name: 'Free Product Page Review & Seller Resources',
                description:
                  'Free product-page feedback, a public Product Gallery if approved, and seller resources for product visibility, research, SEO and creative workflows.',
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
                about: [
                  { '@type': 'Thing', name: 'Ecommerce product research' },
                  {
                    '@type': 'Thing',
                    name: 'Amazon keyword and review research',
                  },
                  {
                    '@type': 'Thing',
                    name: 'Ecommerce SEO and AI search visibility',
                  },
                  {
                    '@type': 'Thing',
                    name: 'Ecommerce APIs and Model Context Protocol',
                  },
                  {
                    '@type': 'Thing',
                    name: 'AI product image and video creation',
                  },
                ],
              },
            ],
          }),
        }}
      />
      <script src="/campaigns.js" defer />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader
        campaign="homepage"
        explorePath="/apis"
        productReviewCta
      />

      <main id="main">
        <section className={`${styles.wrap} ${styles.hero}`} id="overview">
          <p className={styles.eyebrow}>NEXSCOPE · FREE PRODUCT-PAGE REVIEW</p>
          <h1>
            Improve your product page.
            <br />
            <em>Add a place to be seen.</em>
          </h1>
          <p className={styles.lead}>
            Submit one product for professional feedback on its title,
            description and visuals. If approved and published, it also gets a
            free Product Gallery page linked to your store—another place for
            shoppers to discover it.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.button}
              data-showcase-submit-cta="root-home-hero"
              href="/ecommerce-ai-tools/product-showcase/submit/"
            >
              Get free product-page feedback <ArrowRight size={17} />
            </a>
            <a
              className={styles.heroTextLink}
              href="/ecommerce-ai-tools/product-showcase/"
            >
              Explore the Gallery <ArrowRight size={16} />
            </a>
          </div>
          <p className={styles.micro}>
            Free review and approved listing · No store connection · Your store
            handles purchases
          </p>

          <div
            className={styles.workflow}
            aria-label="How the free product-page review works"
          >
            <div className={styles.workflowStep}>
              <span>01 · SHARE ONE PRODUCT</span>
              <strong>Start with what you sell</strong>
              <p>
                Public product URL or ASIN · Short description · One accurate
                image
              </p>
            </div>
            <span className={styles.workflowArrow} aria-hidden="true">
              →
            </span>
            <div className={`${styles.workflowStep} ${styles.workflowCenter}`}>
              <span>02 · READ YOUR REVIEW</span>
              <strong>Get specific feedback</strong>
              <p>
                See clear strengths and meaningful gaps on your private page
              </p>
            </div>
            <span className={styles.workflowArrow} aria-hidden="true">
              →
            </span>
            <div className={styles.workflowStep}>
              <span>03 · SHOW YOUR PRODUCT</span>
              <strong>Add a discovery route</strong>
              <p>
                A free public Gallery page linked to your store, if approved and
                published
              </p>
            </div>
          </div>
          <p className={styles.workflowNote}>
            Save your private review link. No fixed review deadline or automatic
            status email. Publication, indexing, traffic and sales are not
            guaranteed.
          </p>
        </section>

        <section
          className={`${styles.wrap} ${styles.sellerProblems}`}
          aria-labelledby="seller-problems-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>START WITH YOUR SELLER PROBLEM</p>
              <h2 id="seller-problems-title">
                What is holding your product back?
              </h2>
            </div>
            <p>Choose the help that fits your product page.</p>
          </div>
          <div className={styles.sellerProblemGrid}>
            {sellerProblems.map((problem) => (
              <a
                className={styles.sellerProblemCard}
                key={problem.id}
                data-seller-help={problem.id}
                href={`/ecommerce-ai-tools/seller-help/${problem.id}/`}
              >
                <span>{problem.label}</span>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
                <strong>
                  {problem.link} <ArrowRight size={16} />
                </strong>
              </a>
            ))}
          </div>
          <div className={styles.sellerExample}>
            <div>
              <strong>See what a published product page looks like.</strong>
              <p>
                Inspect the format, product details and original listing link.
                This example does not establish traffic or sales results.
              </p>
            </div>
            <a href="/ecommerce-ai-tools/product-showcase/product/336e970a-19aa-4a7d-9361-7b056f55d4f1/">
              View a published example <ArrowRight size={16} />
            </a>
          </div>
          <nav
            className={styles.sellerResourceLinks}
            aria-label="More seller resources"
          >
            <a href="/tools/">Find a tool →</a>
            <a href="/ecommerce-ai-tools/guides/">Read seller tutorials →</a>
            <a href="/ecommerce-ai-tools/community/">Get official help →</a>
          </nav>
        </section>

        <HomeLibrary />

        <section className={`${styles.wrap} ${styles.closing}`}>
          <p>START WITH ONE PRODUCT</p>
          <h2>Give your listing a fresh pair of eyes.</h2>
          <span>
            Request free editorial feedback. A public Gallery page follows if
            approved and published.
          </span>
          <a
            className={styles.button}
            data-showcase-submit-cta="root-home-footer"
            href="/ecommerce-ai-tools/product-showcase/submit/"
          >
            Get free product-page feedback <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        <div>
          <a href="/" aria-label="Nexscope home">
            <img
              className={styles.logo}
              src="/logo.png"
              alt="Nexscope"
              width="165"
              height="32"
            />
          </a>
          <p>Ecommerce intelligence. AI-powered possibilities.</p>
        </div>
        <div className={styles.footerlinks}>
          <a href="/tools/">Tools</a>
          <a href="/ecommerce-ai-tools/">Learn</a>
          <a href="/about/">About</a>
          <a href="/security/">Security</a>
          <a href="/contact/">Contact</a>
          <a href="/ecommerce-ai-tools/editorial-policy/">Editorial policy</a>
          <a data-track href={docs}>
            API docs
          </a>
          <a href="https://www.nexscope.ai/privacy">Privacy</a>
          <a href="https://www.nexscope.ai/terms">Terms</a>
          <a href="#analytics-preferences">Cookie settings</a>
        </div>
        <p className={styles.disclosure}>
          Links to Nexscope may include campaign parameters for attribution.
          Current product availability, access, credits and terms are shown on
          nexscope.ai.
        </p>
      </footer>
    </div>
  );
}
