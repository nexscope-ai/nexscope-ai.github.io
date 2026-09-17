/* Native anchors deliberately perform full navigation between exported HTML pages.
 * Images are pre-sized static assets; GitHub Pages has no image optimization server. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import styles from './home.module.css';

const tracking =
  '?co-from=githubIO&utm_source=github.io&utm_medium=referral&utm_campaign=homepage';
const explore = `https://www.nexscope.ai/apis${tracking}`;
const docs = `https://www.nexscope.ai/api-docs${tracking}`;
export const metadata: Metadata = {
  title: 'Nexscope | Ecommerce Data, AI Agents & Product Videos',
  description:
    'Research products, competitors and keywords with Nexscope. Connect ecommerce data to AI agents through APIs and MCP, or create AI product videos for your brand.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Nexscope | Ecommerce Data, AI Agents & Product Videos',
    description:
      'From product research to AI-powered workflows and product videos. Find your next move with Nexscope.',
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
    text: 'Explore Amazon products, keywords and customer reviews. Compare competitors and turn customer language into better listing ideas.',
    href: '/amazon-research.html',
    cta: 'Explore Amazon research',
    tags: ['Product research', 'Keywords', 'Review insights'],
  },
  {
    number: '02',
    title: 'Give your AI agent real context.',
    audience: 'DEVELOPERS & AI BUILDERS',
    text: 'Bring structured ecommerce data into your applications. Use REST APIs, MCP tools and skills to build research workflows around your questions.',
    href: '/ecommerce-ai-agents.html',
    cta: 'Build with ecommerce data',
    tags: ['REST APIs', 'MCP', 'Agent skills'],
  },
  {
    number: '03',
    title: 'Turn product assets into creative.',
    audience: 'BRANDS & CREATIVE TEAMS',
    text: 'Create AI videos from product images, build product talking videos or use video replication to explore a new creative direction.',
    href: '/ai-product-videos.html',
    cta: 'Explore AI product videos',
    tags: ['Image to video', 'Product talking', 'Video replication'],
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
                logo: 'https://nexscope-ai.github.io/logo.png',
              },
              {
                '@type': 'WebSite',
                name: 'Nexscope',
                url: 'https://nexscope-ai.github.io/',
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
            <a href="#solutions">Solutions</a>
            <a href="/ecommerce-ai-tools/">Resources</a>
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
            <p className={styles.eyebrow}>ECOMMERCE DATA × AI CREATION</p>
            <h1>
              Research smarter.
              <br />
              Build with AI.
              <br />
              <em>Create what’s next.</em>
            </h1>
            <p className={styles.lead}>
              Nexscope brings ecommerce data and AI creative tools into your
              workflow. Research products, power your agents and turn product
              assets into videos.
            </p>
            <div className={styles.actions}>
              <a className={styles.button} data-track href={explore}>
                Explore Nexscope ↗
              </a>
              <a className={styles.textlink} href="#solutions">
                Find your use case ↓
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
              <span className={styles.icon}>01</span>
              <div>
                <b>Understand the market</b>
                <p>Products · Keywords · Reviews</p>
              </div>
            </div>
            <div className={styles.connector} aria-hidden="true">
              ↓
            </div>
            <div className={styles.flowcard}>
              <span className={styles.icon}>02</span>
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
                <p>AI-generated product videos</p>
                <a href="/ai-product-videos.html" data-track>
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
          <p className={styles.eyebrow}>ONE PLATFORM. YOUR WAY TO WORK.</p>
          <h2>What are you building next?</h2>
          <p className={styles.intro}>
            Start with the outcome you need. Explore the tools behind it.
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
                Inform a listing update, build an agent-assisted report or
                explore product video concepts. Review outputs before
                publishing.
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
          <p className={styles.eyebrow}>THE NEXSCOPE RESOURCE LIBRARY</p>
          <h2 id="resources-heading">Learn it. Check it. Put it to work.</h2>
          <p className={styles.intro}>Practical guides, inspectable case studies and fresh perspectives for your next ecommerce decision.</p>
          <div className={styles.cards}>
            {[
              { title: 'Practical guides', text: 'Build a competitor shortlist, qualify keywords or turn review insights into a clearer listing.', href: '/ecommerce-ai-tools/guides/', cta: 'Find a workflow' },
              { title: 'Amazon price history', text: 'Track price, BSR, rating, seller-count and sales signals without mistaking estimates for seller-account data.', href: '/ecommerce-ai-tools/amazon-price-history/', cta: 'Read the guide' },
              { title: 'What is an MCP server?', text: 'Understand how AI hosts, clients and ecommerce tools connect—and what to verify before production use.', href: '/ecommerce-ai-tools/what-is-an-mcp-server/', cta: 'Explore MCP' },
              { title: 'Case studies', text: 'Look inside documented workflows, including the source evidence and the limits of each sample.', href: '/ecommerce-ai-tools/case-studies/', cta: 'Explore the evidence' },
              { title: 'Trends & insights', text: 'Make sense of AI shopping, marketplace intelligence and the tools changing ecommerce research.', href: '/ecommerce-ai-tools/ecommerce-trends/', cta: 'Read the journal' },
            ].map((item) => (
              <article className={styles.card} key={item.href}>
                <h3>{item.title}</h3><p>{item.text}</p>
                <a className={styles.textlink} href={item.href}>{item.cta} →</a>
              </article>
            ))}
          </div>
        </section>
        <section className={`${styles.wrap} ${styles.closing}`}>
          <p>YOUR NEXT MOVE STARTS HERE</p>
          <h2>Bring better context to commerce.</h2>
          <p>Find the data and creative tools that fit your workflow.</p>
          <a className={styles.button} data-track href={explore}>
            Explore Nexscope ↗
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
          <a href="/ecommerce-ai-tools/">Resource library</a>
          <a data-track href={docs}>
            API docs
          </a>
          <a href="https://t.me/+r3m0s6Z1CcI2NTZh">Telegram community ↗</a>
        </div>
        <p className={styles.disclosure}>
          Some links include referral tracking. The referrer may earn a
          commission. Product availability and terms are shown on nexscope.ai.
        </p>
      </footer>
    </div>
  );
}
