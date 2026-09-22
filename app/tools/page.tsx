/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { toolCards, toolCategories } from '@/lib/tool-plaza';
import styles from './tools.module.css';

export const metadata: Metadata = {
  title: 'Ecommerce Tools for Research, SEO & AI Video | Nexscope',
  description:
    'Find Nexscope tools for Amazon keyword and review research, website SEO audits, and AI product videos. Choose a workflow, then use the tool on the official Nexscope site.',
  alternates: { canonical: 'https://learn.nexscope.ai/tools/' },
  openGraph: {
    type: 'website',
    siteName: 'Nexscope',
    url: 'https://learn.nexscope.ai/tools/',
    title: 'Explore Nexscope Ecommerce Tools',
    description:
      'Find the right research, SEO or creative workflow for your next ecommerce decision.',
  },
};

export default function ToolsPage() {
  return (
    <div className={styles.page}>
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
            <a href="https://www.nexscope.ai/api-docs?co-from=githubIO&utm_source=github_pages&utm_medium=referral&utm_campaign=tool_plaza">
              API docs
            </a>
          </div>
          <a
            className={styles.navcta}
            data-track
            href="https://www.nexscope.ai/?co-from=githubIO&utm_source=github_pages&utm_medium=referral&utm_campaign=tool_plaza"
          >
            Explore Nexscope ↗
          </a>
        </nav>
      </header>
      <main id="main" className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>NEXSCOPE TOOL DIRECTORY</p>
          <h1>
            Find the right tool.
            <br />
            <span>Put the next idea to work.</span>
          </h1>
          <p>
            Start with the question you need to answer. Choose a focused tool,
            read its workflow, and run it on the official Nexscope site. Check
            access and credit requirements on the tool page before you begin.
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
            <a href="https://www.nexscope.ai/api-docs?co-from=githubIO">
              API docs ↗
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
