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

const library = '/ecommerce-ai-tools';
const topics = [
  [
    'research',
    'Product & market research',
    'Compare demand, competitors, keywords and reviews across Amazon, Shopify and TikTok Shop.',
  ],
  [
    'visibility',
    'SEO & AI visibility',
    'Check index access, product facts and AI referral traffic before prioritizing changes.',
  ],
  [
    'sourcing',
    'Sourcing & 1688',
    'Connect marketplace questions to image-search candidates, offer details and supplier verification.',
  ],
  [
    'agents',
    'APIs & AI agents',
    'Choose REST or MCP workflows by input, returned fields, marketplace coverage and credit requirements.',
  ],
  [
    'creative',
    'Product images & video',
    'Plan product media, compare model workflows and inspect identity-preservation limits.',
  ],
  [
    'evidence',
    'Evidence & case studies',
    'Inspect dated requests, observed outputs, source artifacts and the limits of each test.',
  ],
] as const;
const evidence = [
  [
    'portable-blender-keyword-competitor',
    'Keyword estimates and competitor sampling',
    '2026-10-07',
    'Ten keyword ideas and ten Amazon results; one result was outside the intended product category.',
  ],
  [
    'portable-blender-amazon-1688',
    'Amazon-to-1688 sourcing workflow',
    '2026-10-07',
    'Ten candidate offers and two detail records; similarity does not verify the factory or an identical SKU.',
  ],
  [
    'amazon-price-series',
    'Amazon price-series response',
    '2026-09-30',
    'Four returned observations; a requested time range does not establish continuous historical coverage.',
  ],
  [
    'gpt-image-2-5-flare',
    'Reference-image editing and product fidelity',
    '2026-09-23',
    'One recorded image edit with credit use and an exact-SKU preservation failure.',
  ],
] as const;

export const metadata: Metadata = {
  title: 'Ecommerce Research, SEO & API Evidence | Nexscope Learn',
  description:
    'Official Nexscope guides, tools and dated evidence for ecommerce product research, SEO, AI visibility, 1688 sourcing, APIs and product media.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nexscope Learn — Research, Workflows & Evidence',
    description:
      'Start with a task. Inspect the evidence. Choose your next ecommerce workflow.',
    url: '/',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexscope Learn — Research, Workflows & Evidence',
    description: 'Official guides, tools and dated ecommerce evidence.',
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
                url: 'https://learn.nexscope.ai/',
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://learn.nexscope.ai/#webpage',
                name: 'Ecommerce Research, SEO & API Evidence',
                url: 'https://learn.nexscope.ai/',
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
                mainEntity: {
                  '@type': 'ItemList',
                  itemListElement: topics.map(([slug, name], index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name,
                    url: `https://learn.nexscope.ai${library}/topics/${slug}/`,
                  })),
                },
              },
            ],
          }),
        }}
      />
      <script src="/campaigns.js?v=3" defer />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader campaign="homepage" />
      <main id="main">
        <section className={`${styles.wrap} ${styles.hero}`}>
          <p className={styles.eyebrow}>
            OFFICIAL NEXSCOPE LEARNING & EVIDENCE CENTER
          </p>
          <h1>
            Make your next commerce decision.
            <br />
            <em>Start with the evidence.</em>
          </h1>
          <p className={styles.lead}>
            Nexscope Learn helps sellers, brands, agencies and developers
            research products, improve search visibility, source candidates and
            build with ecommerce APIs. Follow a practical workflow, inspect its
            evidence and understand its limits before acting.
          </p>
          <div className={styles.actions}>
            <a className={styles.button} href="#topics">
              Choose your task <ArrowRight size={17} />
            </a>
            <a
              className={styles.heroTextLink}
              href={`${library}/api-evidence/`}
            >
              Inspect real tests <ArrowRight size={16} />
            </a>
          </div>
          <p className={styles.micro}>
            Guides and evidence by Nexscope · Current product access, pricing
            and terms on nexscope.ai
          </p>
          <nav
            className={styles.sellerResourceLinks}
            aria-label="Research by marketplace"
          >
            <a href="/amazon-research/">Amazon research →</a>
            <a href="/shopify-competitor-product-research/">
              Shopify competitors →
            </a>
            <a href="/tools/tiktok-shop-new-product-validator/">
              TikTok Shop validation →
            </a>
            <a href="/1688-supplier-product-sourcing/">1688 sourcing →</a>
          </nav>
        </section>
        <section className={`${styles.wrap} ${styles.mapSection}`} id="topics">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>START WITH YOUR TASK</p>
              <h2>Six paths to a more informed decision.</h2>
            </div>
            <p>
              Each path connects guides, tools, evidence and official product
              documentation.
            </p>
          </div>
          <div className={styles.sceneGrid}>
            {topics.map(([slug, title, description]) => (
              <a
                className={styles.sceneCard}
                key={slug}
                href={`${library}/topics/${slug}/`}
              >
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Explore this workflow →</strong>
              </a>
            ))}
          </div>
        </section>
        <section
          className={`${styles.wrap} ${styles.evidenceSection}`}
          id="evidence"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>DATED TEST RECORDS</p>
              <h2>See what was actually returned.</h2>
            </div>
            <p>
              Test records describe individual observations. They do not
              establish ongoing availability or business outcomes.
            </p>
          </div>
          <div className={styles.sceneGrid}>
            {evidence.map(([slug, title, date, description]) => (
              <a
                className={styles.sceneCard}
                key={slug}
                href={`${library}/api-evidence/${slug}/`}
              >
                <span>
                  Record updated <time dateTime={date}>{date}</time>
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Inspect inputs, output and limits →</strong>
              </a>
            ))}
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.method}`}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>HOW TO USE THE EVIDENCE</p>
              <h2>Connect an observation to a decision.</h2>
            </div>
          </div>
          <div className={styles.methodGrid}>
            <div>
              <h3>1. Define the task</h3>
              <p>
                Choose a marketplace, comparable products and a time window.
                Sellers can start with demand or reviews; developers can start
                with a required response field.
              </p>
            </div>
            <div>
              <h3>2. Inspect the source</h3>
              <p>
                Separate returned observations, provider estimates and vendor
                claims. Check the source date and limitations before comparing
                numbers.
              </p>
            </div>
            <div>
              <h3>3. Run a bounded test</h3>
              <p>
                Use the linked tool or API documentation. Verify current access,
                coverage and credit requirements, then record the result before
                expanding.
              </p>
            </div>
          </div>
          <nav
            className={styles.sellerResourceLinks}
            aria-label="Complete workflows"
          >
            <a href={`${library}/portable-blender-market-research-case-study/`}>
              Demand → competitors → sourcing →
            </a>
            <a href="/ecommerce-seo-ai-search-visibility/">
              Index access → visibility → measurement →
            </a>
            <a href={`${library}/ecommerce-api-for-ai-agents/`}>
              Required evidence → API → agent →
            </a>
          </nav>
        </section>
        <HomeLibrary />
        <section className={`${styles.wrap} ${styles.closing}`}>
          <p>WORK WITH YOUR OWN PRODUCT</p>
          <h2>Get feedback on one product page.</h2>
          <span>
            Request free editorial feedback on product details and visuals.
            Approved submissions may receive a public Gallery page linked to the
            original store.
          </span>
          <a
            className={styles.button}
            data-showcase-submit-cta="root-home-footer"
            href={`${library}/product-showcase/submit/`}
          >
            Get product-page feedback <ArrowRight size={17} />
          </a>
          <p>
            <a href={`${library}/product-showcase/`}>
              Browse seller-submitted products →
            </a>
          </p>
        </section>
      </main>
      <footer className={`${styles.wrap} ${styles.footer}`}>
        <div>
          <a href="/">Nexscope Learn</a>
          <p>Practical workflows. Inspectable evidence.</p>
        </div>
        <nav className={styles.footerlinks} aria-label="Footer">
          <a href={`${library}/`}>Resource library</a>
          <a href="/tools/">Tools</a>
          <a href={`${library}/ecommerce-trends/`}>Insights</a>
          <a href={`${library}/alternatives/`}>Comparisons</a>
          <a href={`${library}/product-showcase/`}>Product Gallery</a>
          <a href={`${library}/community/`}>Community</a>
          <a href="/about/">About Nexscope</a>
          <a href={`${library}/about/`}>About Learn</a>
          <a href={`${library}/editorial-policy/`}>Editorial policy</a>
          <a href="/security/">Security</a>
          <a href="/contact/">Contact</a>
          <a href="https://www.nexscope.ai/api-docs?co-from=learn">API docs</a>
          <a href="https://www.nexscope.ai/privacy">Privacy</a>
          <a href="https://www.nexscope.ai/terms">Terms</a>
          <a href="#analytics-preferences">Cookie settings</a>
        </nav>
        <p className={styles.disclosure}>
          Nexscope publishes these resources about its own products. Compare
          linked primary sources and inspect test limits. Current access,
          credits and terms are shown on nexscope.ai.
        </p>
      </footer>
    </div>
  );
}
