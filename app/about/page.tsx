/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import SiteInfoPage from '@/components/site-info-page';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from '../site-info.module.css';

const url = 'https://learn.nexscope.ai/about/';

export const metadata: Metadata = {
  title: 'About Nexscope | Ecommerce Intelligence & AI Creation',
  description:
    'Learn what Nexscope does, who it serves, which official web properties it maintains, and how to verify its product, API and learning resources.',
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    url,
    siteName: 'Nexscope',
    title: 'About Nexscope',
    description:
      'Nexscope helps ecommerce teams research marketplaces, use APIs and create product content with AI.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Nexscope',
    description:
      'Official information about the Nexscope brand, products and web properties.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const supportingLinks = [
  {
    href: 'https://www.nexscope.ai/?co-from=learn',
    label: 'Nexscope product',
    description: 'Current product access, pricing and account experience.',
  },
  {
    href: 'https://www.nexscope.ai/api-docs?co-from=learn',
    label: 'API documentation',
    description: 'Current endpoints, schemas, inputs and access requirements.',
  },
  {
    href: '/ecommerce-ai-tools/about/',
    label: 'About the learning center',
    description: 'Audience, content types and evidence practices for this hub.',
  },
] as const;

const officialProfiles = [
  {
    href: 'https://www.linkedin.com/company/nexscope-ai/',
    label: 'LinkedIn',
    account: 'Nexscope.AI',
    mark: 'in',
  },
  {
    href: 'https://x.com/Nexscope_ai',
    label: 'X',
    account: '@Nexscope_ai',
    mark: 'X',
  },
  {
    href: 'https://www.youtube.com/@Nexscope-AI',
    label: 'YouTube',
    account: '@Nexscope-AI',
    mark: '▶',
  },
  {
    href: 'https://www.tiktok.com/@nexscope_ai',
    label: 'TikTok',
    account: '@nexscope_ai',
    mark: '♪',
  },
  {
    href: 'https://github.com/nexscope-ai',
    label: 'GitHub',
    account: 'nexscope-ai',
    mark: '</>',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              NEXSCOPE_ORGANIZATION,
              {
                '@type': 'AboutPage',
                '@id': `${url}#webpage`,
                url,
                name: 'About Nexscope',
                description:
                  'Official information about the Nexscope brand, products and web properties.',
                about: { '@id': 'https://www.nexscope.ai/#organization' },
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
              },
            ],
          }),
        }}
      />
      <SiteInfoPage
        campaign="brand_about"
        eyebrow="ABOUT NEXSCOPE"
        title="About Nexscope"
        lead="Nexscope helps ecommerce teams use marketplace data to find opportunities, then turn those insights into clearer listings, product images and videos. Sellers can work in browser tools, while developers can connect documented REST APIs and MCP tools."
        supportingTitle="Verify current Nexscope information"
        supportingLinks={supportingLinks}
        lastReviewed="October 23, 2026"
      >
        <section>
          <h2>From marketplace evidence to product content</h2>
          <p>
            Start with a specific ecommerce question, inspect the available
            evidence, and use the result to decide what to improve or create.
            These public tools show four practical starting points.
          </p>
          <div className={styles.cards}>
            <div className={styles.card}>
              <h3>
                <a href="https://www.nexscope.ai/tools/amazon-review-analyzer?co-from=learn">
                  Find buyer needs in product reviews
                </a>
              </h3>
              <p>
                Analyze a bounded review sample to identify repeated complaints,
                product questions and language worth checking against the listing.
              </p>
            </div>
            <div className={styles.card}>
              <h3>
                <a href="https://www.nexscope.ai/tools/seo-keyword-planner?co-from=learn">
                  Compare keywords and competing products
                </a>
              </h3>
              <p>
                Review keyword demand and related Amazon products before choosing
                which search terms or positioning questions to investigate.
              </p>
            </div>
            <div className={styles.card}>
              <h3>
                <a href="https://www.nexscope.ai/tools/ai-video-generator?co-from=learn">
                  Turn product images into video concepts
                </a>
              </h3>
              <p>
                Use authorized product images to create video drafts, then review
                product accuracy, motion and claims before publishing.
              </p>
            </div>
            <div className={styles.card}>
              <h3>
                <a href="https://www.nexscope.ai/api-docs?co-from=learn">
                  Connect ecommerce data to an application or AI agent
                </a>
              </h3>
              <p>
                Inspect current REST endpoint schemas, examples and access
                requirements, or review the supported MCP integration path.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Who Nexscope serves</h2>
          <ul>
            <li>Sellers and brands evaluating products and marketplace signals.</li>
            <li>Agencies and analysts preparing reviewable ecommerce briefs.</li>
            <li>
              Developers integrating ecommerce data with applications or AI
              agents.
            </li>
            <li>
              Creative teams producing product imagery and videos from authorized
              assets.
            </li>
          </ul>
        </section>

        <section>
          <h2>Official Nexscope web properties</h2>
          <dl className={styles.details}>
            <div>
              <dt>nexscope.ai</dt>
              <dd>
                The product site and source of truth for current access, pricing,
                account features and API documentation.
              </dd>
            </div>
            <div>
              <dt>learn.nexscope.ai</dt>
              <dd>
                The official learning hub for tools, workflows, dated API evidence,
                case studies and ecommerce analysis.
              </dd>
            </div>
            <div>
              <dt>github.com/nexscope-ai</dt>
              <dd>
                Public repositories, examples, issue tracking and community
                discussions maintained by the Nexscope team.
              </dd>
            </div>
          </dl>
        </section>

        <section>
          <h2>Company and accountability</h2>
          <p>
            Nexscope is operated by ECOCREATE TECHNOLOGY PTE. LTD., a company
            incorporated in Singapore. The official{' '}
            <a href="https://www.nexscope.ai/privacy?co-from=learn">
              Privacy Policy
            </a>{' '}
            and{' '}
            <a href="https://www.nexscope.ai/terms?co-from=learn">
              Terms of Service
            </a>{' '}
            identify
            the legal policies that apply to the service.
          </p>
          <p>
            Product capabilities, marketplace coverage, credits and access rules
            can change. Check the live product interface and official API
            documentation before relying on a capability in production.
          </p>
          <div className={styles.callout}>
            <strong>Evidence, not guarantees</strong>
            <p>
              Nexscope learning resources separate observed results, official
              documentation, provider estimates, proposed workflows and unknowns.
              Read the{' '}
              <a href="/ecommerce-ai-tools/editorial-policy/">
                editorial and evidence policy
              </a>{' '}
              for the complete method.
            </p>
          </div>
        </section>

        <section>
          <h2>Official profiles</h2>
          <p>
            These account names and destinations match the social links published
            on the Nexscope product website. External profiles open in a new tab.
          </p>
          <div className={styles.profileGrid}>
            {officialProfiles.map((profile) => (
              <a
                className={styles.profileLink}
                href={profile.href}
                key={profile.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.profileMark} aria-hidden="true">
                  {profile.mark}
                </span>
                <span className={styles.profileText}>
                  <strong>{profile.label}</strong>
                  <span>{profile.account}</span>
                </span>
                <span className={styles.externalMark} aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>
      </SiteInfoPage>
    </>
  );
}
