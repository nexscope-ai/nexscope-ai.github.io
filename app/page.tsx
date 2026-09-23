/* Native anchors deliberately perform full navigation between exported HTML pages.
 * Images are pre-sized static assets; GitHub Pages has no image optimization server. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { BookOpen, ChartNoAxesCombined, Code2, FileSearch, Search } from 'lucide-react';
import styles from './home.module.css';

const tracking =
  '?co-from=githubIO&utm_source=github.io&utm_medium=referral&utm_campaign=homepage';
const explore = `https://www.nexscope.ai/apis${tracking}`;
const docs = `https://www.nexscope.ai/api-docs${tracking}`;
export const metadata: Metadata = {
  title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
  description:
    'Find Nexscope ecommerce tools, practical guides and case studies for product research, Amazon listing optimization, SEO, AI agents, and AI product images and videos.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
    description:
      'Find a tool, follow a workflow and check the evidence behind your next ecommerce decision.',
    url: '/',
    siteName: 'Nexscope',
    type: 'website',
  },
};
const audiences = [
  {
    number: '01',
    title: 'Find your next product opportunity.',
    audience: 'SELLERS & RESEARCH TEAMS',
    text: 'Explore Amazon products, keywords, reviews and listing evidence. Compare competitors and turn those signals into prioritized listing changes to test.',
    href: '/amazon-research/',
    cta: 'Explore Amazon research',
    tags: ['Product research', 'Keywords', 'Listing optimization'],
  },
  {
    number: '02',
    title: 'Give your AI agent real context.',
    audience: 'DEVELOPERS & AI BUILDERS',
    text: 'Bring structured ecommerce data into your applications. Use REST APIs, MCP tools and skills to build research workflows around your questions.',
    href: '/ecommerce-ai-agents/',
    cta: 'Build with ecommerce data',
    tags: ['REST APIs', 'MCP', 'Agent skills'],
  },
  {
    number: '03',
    title: 'Turn product assets into images and videos.',
    audience: 'BRANDS & CREATIVE TEAMS',
    text: 'Create AI product images, turn approved visuals into videos, or use video replication to explore a new creative direction.',
    href: '/ai-product-videos/',
    cta: 'Explore AI product videos',
    tags: ['Product images', 'Image to video', 'Video replication'],
  },
];
export default function Home() {
  return (
    <div className={styles.home}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': 'https://www.nexscope.ai/#organization',
                name: 'Nexscope',
                url: 'https://www.nexscope.ai/',
                logo: 'https://learn.nexscope.ai/logo.png',
              },
              {
                '@type': 'WebSite',
                name: 'Nexscope',
                url: 'https://learn.nexscope.ai/',
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
              },
            ],
          }),
        }}
      />
      <script src="/campaigns.js" defer />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="/" aria-label="Nexscope home">
            <img
              className={styles.logo}
              src="/logo.png"
              alt="Nexscope"
              width="165"
              height="32"
            />
          </a>
          <div className={styles.navlinks}>
            <a href="/tools/">Tools</a>
            <a href="/ecommerce-ai-tools/">Learn</a>
            <a data-track href={docs}>
              API docs
            </a>
          </div>
          <a className={styles.button} data-track href={explore}>
            Explore Nexscope ↗
          </a>
        </nav>
      </header>
      <main id="main">
        <section className={`${styles.wrap} ${styles.hero}`}>
          <div>
            <p className={styles.eyebrow}>TOOLS × WORKFLOWS × EVIDENCE</p>
            <h1>
              Find the right tool.
              <br />
              Learn the workflow.
              <br />
              <em>Build what&apos;s next.</em>
            </h1>
            <p className={styles.lead}>
              Explore practical tools and evidence-led guides for product
              research, Amazon listing optimization, ecommerce SEO, AI agents,
              and AI product images and videos. Start with a task, then put it
              to work on Nexscope.
            </p>
            <div className={styles.actions}>
              <a className={styles.button} href="/tools/">
                Explore tools →
              </a>
              <a className={styles.secondaryButton} href="/ecommerce-ai-tools/">
                Browse guides →
              </a>
            </div>
            <p className={styles.micro}>
              For sellers, developers and creative teams.
              <br />
              Official product platform:{' '}
              <a href="https://www.nexscope.ai/?co-from=githubIO">nexscope.ai</a>
            </p>
          </div>
          <div
            className={styles.visual}
            aria-label="Nexscope capability overview"
          >
            <div className={styles.visualtop}>
              YOUR NEXT COMMERCE WORKFLOW <span>↗</span>
            </div>
            <div className={styles.flowcard}>
              <span className={styles.icon} aria-hidden="true">
                <Search size={20} strokeWidth={1.8} />
              </span>
              <div>
                <b>Understand the market</b>
                <p>Products · Keywords · Reviews</p>
              </div>
            </div>
            <div className={styles.connector} aria-hidden="true">
              ↓
            </div>
            <div className={styles.flowcard}>
              <span className={styles.icon} aria-hidden="true">
                <Code2 size={20} strokeWidth={1.8} />
              </span>
              <div>
                <b>Build on the evidence</b>
                <p>APIs · MCP · Agent skills</p>
              </div>
            </div>
            <div className={styles.connector} aria-hidden="true">
              ↓
            </div>
            <div className={styles.flowcard}>
              <img
                src="https://www.nexscope.ai/video-lab/seedance-20-hand-wash-poster.png"
                alt="Hand wash product video example"
                width="72"
                height="88"
              />
              <div>
                <b>Bring your product to life</b>
                <p>AI-generated product images and videos</p>
                <a href="/ai-product-videos/" data-track>
                  Explore creative tools →
                </a>
              </div>
            </div>
            <p className={styles.visualnote}>
              Choose one capability or combine them in your own workflow.
            </p>
          </div>
        </section>
        <div className={`${styles.wrap} ${styles.platforms}`}>
          <span>Explore ecommerce data</span>
          <b>Amazon</b>
          <b>TikTok Shop</b>
          <b>Shopify</b>
          <b>Walmart</b>
          <b>eBay</b>
          <b>Etsy</b>
        </div>
        <p className={`${styles.wrap} ${styles.coverage}`}>
          Platform coverage, fields and regions vary by API. Check the catalog
          for your use case.
        </p>
        <section className={`${styles.wrap} ${styles.section}`} id="solutions">
          <p className={styles.eyebrow}>START WITH A GOAL</p>
          <h2>What do you need to do?</h2>
          <p className={styles.intro}>
            See the bigger workflow, then choose the tool that fits.
          </p>
          <div className={styles.cards}>
            {audiences.map((item) => (
              <article className={styles.card} key={item.number}>
                <span className={styles.number}>
                  {item.number} / {item.audience}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className={styles.tags}>
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a className={styles.textlink} href={item.href} data-track>
                  {item.cta} →
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.band}`}>
          <div>
            <p className={styles.eyebrow}>FROM QUESTION TO NEXT STEP</p>
            <h2>
              Less tab-hopping.
              <br />
              More useful context.
            </h2>
            <p>
              Start with a product, keyword or competitor. Bring the evidence
              into the tools you already use, then decide what to test next.
            </p>
            <a className={styles.textlink} href={docs} data-track>
              Explore the API documentation →
            </a>
          </div>
          <ol className={styles.steps}>
            <li>
              <b>Ask a focused question.</b>
              <p>
                Which keywords describe your product? What do reviewers care
                about? What does a competitor offer?
              </p>
            </li>
            <li>
              <b>Choose the right data.</b>
              <p>
                Check API inputs, market coverage and returned fields. Keep
                source limitations in view.
              </p>
            </li>
            <li>
              <b>Put it to work.</b>
              <p>
                Inform and prioritize a listing update, build an agent-assisted
                report, or explore product image and video concepts. Review
                outputs before publishing.
              </p>
            </li>
          </ol>
        </section>
        <section className={`${styles.wrap} ${styles.section} ${styles.faq}`}>
          <p className={styles.eyebrow}>GOOD TO KNOW</p>
          <h2>A few things before you start.</h2>
          <details>
            <summary>Do I need to be a developer?</summary>
            <p>
              API and MCP integrations are designed for technical workflows. For
              product video creation, explore Nexscope’s web tools. Each linked
              page explains where to begin.
            </p>
          </details>
          <details>
            <summary>Does every API cover every marketplace?</summary>
            <p>
              No. Coverage, freshness and available fields depend on the API and
              market. Review the catalog before building your workflow.
              Estimates are not audited sales figures.
            </p>
          </details>
          <details>
            <summary>How do access and credits work?</summary>
            <p>
              Sign in to Nexscope to check current offers and credit
              requirements. API calls require the documented authentication.
              Usage costs and video model availability vary by tool.
            </p>
          </details>
          <details>
            <summary>Can I publish AI-generated videos directly?</summary>
            <p>
              Review product accuracy, claims and visual quality first. Use
              assets you have permission to use, and follow platform rules for
              AI content and advertising. Generated outputs can contain errors.
            </p>
          </details>
        </section>
        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="resources-heading">
          <p className={styles.eyebrow}>THE NEXSCOPE LEARNING CENTER</p>
          <h2 id="resources-heading">Learn the method. Check the evidence.</h2>
          <p className={styles.intro}>Choose a practical guide, inspect a documented workflow, or follow what is changing in ecommerce.</p>
          <div className={styles.cards}>
            {[
              { title: 'Case studies', text: 'See how ecommerce questions become practical research and workflow decisions.', href: '/ecommerce-ai-tools/case-studies/', cta: 'Read case studies', icon: ChartNoAxesCombined },
              { title: 'Practical tutorials', text: 'Follow focused workflows for Amazon, Shopify, SEO, sourcing and AI creation.', href: '/ecommerce-ai-tools/guides/', cta: 'Browse tutorials', icon: BookOpen },
              { title: 'API evidence', text: 'Inspect dated inputs, observed outputs, credit use and limitations from real Nexscope tests.', href: '/ecommerce-ai-tools/api-evidence/', cta: 'Inspect the evidence', icon: FileSearch },
            ].map((item) => (
              <article className={styles.card} key={item.href}>
                <span className={styles.icon} aria-hidden="true">
                  <item.icon size={20} strokeWidth={1.8} />
                </span>
                <h3>{item.title}</h3><p>{item.text}</p>
                <a className={styles.textlink} href={item.href}>{item.cta} →</a>
              </article>
            ))}
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.closing}`}>
          <p>YOUR NEXT MOVE STARTS HERE</p>
          <h2>Bring better context to commerce.</h2>
          <p>Choose a tool, follow a guide, then test the result in your own workflow.</p>
          <a className={styles.button} href="/tools/">
            Find a tool →
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
          <a data-track href={docs}>
            API docs
          </a>
          <a href="#analytics-preferences">Privacy</a>
        </div>
        <p className={styles.disclosure}>
          Some links include referral tracking. The referrer may earn a
          commission. Product availability and terms are shown on nexscope.ai.
        </p>
      </footer>
    </div>
  );
}
