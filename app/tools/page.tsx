/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { toolCards, toolCategories } from '@/lib/tool-plaza';
import styles from './tools.module.css';

export const metadata: Metadata = {
  title: 'Ecommerce Research Tools: Keywords, Reviews, SEO & Video | Nexscope',
  description:
    'Compare ecommerce tools for product demand, competitor keywords, customer reviews, listing optimization, SEO visibility, AI product images and videos.',
  alternates: { canonical: 'https://learn.nexscope.ai/tools/' },
  openGraph: {
    type: 'website',
    siteName: 'Nexscope',
    url: 'https://learn.nexscope.ai/tools/',
    title: 'Ecommerce Research Tools for Keywords, Reviews, SEO and Video',
    description:
      'Compare focused workflows for product demand, competitor keywords, customer reviews, SEO visibility and AI product creative.',
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
          'A task-based directory for ecommerce product demand, competitor keywords, customer reviews, SEO visibility, listing optimization and AI product creative.',
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
          url: tool.href.split('?')[0],
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
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="/" aria-label="Nexscope learning home">
            <img src="/logo.png" alt="Nexscope" width="165" height="32" />
          </a>
          <div className={styles.navlinks}>
            <a href="/tools/" aria-current="page">
              Tools
            </a>
            <a href="/ecommerce-ai-tools/">Learn</a>
            <a href="https://www.nexscope.ai/api-docs?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=tool_plaza">
              API docs
            </a>
          </div>
          <a
            className={styles.navcta}
            data-track
            href="https://www.nexscope.ai/?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=tool_plaza"
          >
            Explore Nexscope ↗
          </a>
        </nav>
      </header>
      <main id="main" className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>NEXSCOPE TOOL DIRECTORY</p>
          <h1>
            Research the market.
            <br />
            <span>Choose the right ecommerce tool.</span>
          </h1>
          <p>
            Ecommerce sellers can use focused tools to validate product demand,
            compare competitor keywords, analyze customer reviews, inspect SEO
            visibility, improve listings, and create product images or videos.
            Start with one decision, choose the smallest useful workflow, and
            verify its evidence before you act.
          </p>
          <div className={styles.jumps} aria-label="Browse tools by task">
            {toolCategories.map((category) => (
              <a key={category.id} href={`#${category.id}`}>
                {category.label} <span aria-hidden="true">↘</span>
              </a>
            ))}
          </div>
        </section>
        <div className={styles.content}>
          {toolCategories.map((category) => (
            <section
              className={styles.category}
              id={category.id}
              key={category.id}
              aria-labelledby={`${category.id}-title`}
            >
              <div className={styles.categoryHead}>
                <div>
                  <p className={styles.eyebrow}>EXPLORE BY TASK</p>
                  <h2 id={`${category.id}-title`}>{category.label}</h2>
                </div>
                <p>{category.summary}</p>
              </div>
              <div className={styles.grid}>
                {toolCards
                  .filter((tool) => tool.category === category.id)
                  .map((tool) => (
                    <article className={styles.card} key={tool.name}>
                      <div className={styles.cardTop}>
                        <span className={styles.mark} aria-hidden="true">
                          <img src="/favicon.png" alt="" width="29" height="29" />
                        </span>
                        <span className={styles.access}>{tool.access}</span>
                      </div>
                      <h3>{tool.name}</h3>
                      <p>{tool.description}</p>
                      <div className={styles.cardLinks}>
                        <a
                          className={styles.toolLink}
                          data-track
                          href={tool.href}
                        >
                          Open tool ↗
                        </a>
                        {tool.guide && (
                          <a
                            className={styles.guideLink}
                            href={tool.guide.href}
                          >
                            {tool.guide.label} →
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ))}
          <section className={styles.paths} aria-labelledby="paths-title">
            <div>
              <p className={styles.eyebrow}>NEED THE BIGGER PICTURE?</p>
              <h2 id="paths-title">Explore a complete workflow.</h2>
              <p>
                These overviews connect the research question to the tools, APIs
                and decisions behind it.
              </p>
            </div>
            <div className={styles.pathLinks}>
              <a href="/ecommerce-ai-tools/">
                Nexscope learning center <span>→</span>
              </a>
              <a href="/amazon-research/">
                Amazon research <span>→</span>
              </a>
              <a href="/ai-product-videos/">
                AI product videos <span>→</span>
              </a>
              <a href="/ecommerce-ai-agents/">
                Ecommerce AI agents & APIs <span>→</span>
              </a>
            </div>
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
            <a href="/ecommerce-ai-tools/case-studies/">Case studies</a>
            <a href="https://www.nexscope.ai/api-docs?co-from=learn">
              API docs ↗
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
