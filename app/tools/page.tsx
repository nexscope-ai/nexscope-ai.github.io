/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { toolCards } from '@/lib/tool-plaza';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';
import MarketingHeader from '@/components/marketing-header';
import ToolDirectory from '@/components/tool-directory';
import styles from './tools.module.css';

export const metadata: Metadata = {
  title: 'Ecommerce Research & AI Tools | Nexscope',
  description:
    'Explore Amazon niche research, Amazon and 1688 price lookups, TikTok Shop workflows, SEO research and ecommerce creative tools.',
  alternates: { canonical: 'https://learn.nexscope.ai/tools/' },
  openGraph: {
    type: 'website',
    siteName: 'Nexscope',
    url: 'https://learn.nexscope.ai/tools/',
    title: 'Ecommerce Research and AI Tools',
    description:
      'Find focused workflows for Amazon niches and prices, 1688 sourcing, TikTok Shop research, SEO visibility and AI product creative.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecommerce Research and AI Tools',
    description:
      'Compare focused workflows for product demand, marketplace prices, customer reviews, SEO visibility and AI product creative.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function ToolsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://learn.nexscope.ai/tools/#webpage',
        url: 'https://learn.nexscope.ai/tools/',
        name: 'Ecommerce Research Tools for Keywords, Reviews, SEO and Video',
        description:
          'A task-based directory for Amazon niche and price research, 1688 sourcing, TikTok Shop product and creator research, SEO visibility and AI product creative.',
        isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
        publisher: { '@id': 'https://www.nexscope.ai/#organization' },
      },
      {
        '@type': 'ItemList',
        name: 'Nexscope ecommerce tools',
        numberOfItems: toolCards.length,
        itemListElement: toolCards.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          description: tool.description,
          url: new URL(tool.href.split('?')[0], 'https://learn.nexscope.ai')
            .href,
        })),
      },
    ],
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll('<', '\\u003c'),
        }}
      />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader active="tools" campaign="tool_plaza" />
      <main id="main" className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>NEXSCOPE TOOL DIRECTORY</p>
          <h1>
            Tools for your next
            <br />
            <span>ecommerce decision.</span>
          </h1>
          <p>
            Research demand, compare prices, investigate TikTok Shop, improve
            visibility or create product media. Find the workflow that fits your
            question, then review the evidence before you act.
          </p>
        </section>
        <div className={styles.content}>
          <ToolDirectory />
          <section className={styles.paths} aria-labelledby="paths-title">
            <div className={styles.pathsIntro}>
              <p className={styles.eyebrow}>NEED THE BIGGER PICTURE?</p>
              <h2 id="paths-title">Explore a complete workflow.</h2>
              <p>
                These overviews connect the research question to the tools, APIs
                and decisions behind it.
              </p>
            </div>
            <nav
              className={styles.pathLinks}
              aria-label="Related ecommerce guides"
            >
              <a href="/ecommerce-ai-tools/">
                Nexscope learning center <span>→</span>
              </a>
              <a href="/amazon-research/">
                Amazon research <span>→</span>
              </a>
              <a href="/ai-product-videos/">
                AI product videos <span>→</span>
              </a>
              <a href="/ai-video-generator/">
                AI video generator <span>→</span>
              </a>
              <a href="/ecommerce-ai-agents/">
                Ecommerce AI agents & APIs <span>→</span>
              </a>
              <a href="/ecommerce-ai-tools/alternatives/keepa-api/">
                Keepa API comparison <span>→</span>
              </a>
              <a href="/ecommerce-ai-tools/ecommerce-mcp-server/">
                Ecommerce MCP server setup <span>→</span>
              </a>
              <a href="/ecommerce-ai-tools/amazon-negative-review-analysis/">
                Amazon negative review workflow <span>→</span>
              </a>
              <a href="/ecommerce-ai-tools/website-seo-audit-guide/">
                Ecommerce SEO audit guide <span>→</span>
              </a>
            </nav>
          </section>
          <p className={styles.note}>
            Tool capabilities, availability, sign-in requirements and credits
            can change. The official tool page shows the current workflow. No
            API key is entered on this directory.
          </p>
        </div>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <a href="/">Nexscope</a>
          <nav aria-label="Footer">
            <a href="/tools/">Tools</a>
            <a href="/ecommerce-ai-tools/">Learn</a>
            <a href="/ecommerce-ai-tools/about/">About</a>
            <a href="/ecommerce-ai-tools/editorial-policy/">Editorial policy</a>
            <a href="https://www.nexscope.ai/privacy">Privacy</a>
            <a href="https://www.nexscope.ai/terms">Terms</a>
            <a href="#analytics-preferences">Cookie settings</a>
            <a
              data-track
              href="https://www.nexscope.ai/api-docs?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=tool_plaza&utm_content=footer_api_docs"
            >
              API docs ↗
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
