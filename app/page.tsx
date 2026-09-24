/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { ArrowDown, ArrowRight, BookOpen, Code2, Image, Search, ShoppingBag } from 'lucide-react';
import HomeLibrary from './home-library';
import styles from './home.module.css';

const tracking = '?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=homepage';
const explore = `https://www.nexscope.ai/apis${tracking}`;
const docs = `https://www.nexscope.ai/api-docs${tracking}`;

export const metadata: Metadata = {
  title: 'Ecommerce Research, SEO & AI Creation Guides | Nexscope',
  description: 'Research product demand, competitor keywords, customer reviews and SEO visibility. Explore ecommerce API, MCP, AI image and product-video workflows.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Ecommerce Research, SEO & AI Creation Guides | Nexscope',
    description: 'Research demand, keywords, customer reviews and search visibility, then explore ecommerce APIs and AI product-creation workflows.',
    url: '/',
    siteName: 'Nexscope',
    type: 'website',
  },
};

const scenes = [
  { id: 'product-research', title: 'Product & market research', summary: 'Find demand, compare products and understand customer feedback.', icon: Search, count: 'Research', href: '/amazon-research/' },
  { id: 'keyword-listing', title: 'Keywords & listings', summary: 'Connect search intent, competitor signals and listing decisions.', icon: ShoppingBag, count: 'Optimization', href: '/ecommerce-ai-tools/amazon-competitor-keyword-research/' },
  { id: 'sourcing', title: 'Sourcing & 1688', summary: 'Turn product images into candidates, then verify the offers.', icon: Search, count: 'Sourcing', href: '/ecommerce-ai-tools/ecommerce-trends/1688-image-search-sourcing/' },
  { id: 'seo-visibility', title: 'SEO & AI visibility', summary: 'Diagnose discoverability and separate search traffic from AI mentions.', icon: BookOpen, count: 'Visibility', href: '/ecommerce-seo-ai-search-visibility/' },
  { id: 'agents-api', title: 'Agents & ecommerce APIs', summary: 'Bring structured commerce data into developer and agent workflows.', icon: Code2, count: 'Build', href: '/ecommerce-ai-agents/' },
  { id: 'creative', title: 'Images & product video', summary: 'Create product assets and review every output before publishing.', icon: Image, count: 'Create', href: '/ai-product-videos/' },
] as const;

export default function Home() {
  return (
    <div className={styles.home}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@graph': [
          { '@type': 'Organization', '@id': 'https://www.nexscope.ai/#organization', name: 'Nexscope', url: 'https://www.nexscope.ai/', logo: 'https://learn.nexscope.ai/logo.png' },
          { '@type': 'WebSite', '@id': 'https://learn.nexscope.ai/#website', name: 'Nexscope Learning Hub', url: 'https://learn.nexscope.ai/', publisher: { '@id': 'https://www.nexscope.ai/#organization' } },
          {
            '@type': 'CollectionPage',
            '@id': 'https://learn.nexscope.ai/#webpage',
            url: 'https://learn.nexscope.ai/',
            name: 'Ecommerce Research, SEO & AI Creation Guides',
            description: 'A learning hub for ecommerce product demand, competitor keywords, customer reviews, SEO visibility, APIs, MCP and AI product creation.',
            isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
            about: [
              { '@type': 'Thing', name: 'Ecommerce product research' },
              { '@type': 'Thing', name: 'Amazon keyword and review research' },
              { '@type': 'Thing', name: 'Ecommerce SEO and AI search visibility' },
              { '@type': 'Thing', name: 'Ecommerce APIs and Model Context Protocol' },
              { '@type': 'Thing', name: 'AI product image and video creation' },
            ],
          },
        ],
      }) }} />
      <script src="/campaigns.js" defer />
      <a className={styles.skip} href="#main">Skip to content</a>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="Primary navigation">
          <a href="/" aria-label="Nexscope home"><img className={styles.logo} src="/logo.png" alt="Nexscope" width="165" height="32" /></a>
          <div className={styles.navlinks}>
            <a href="/tools/">Tools</a>
            <a href="/ecommerce-ai-tools/">Learn</a>
            <a data-track href={docs}>API docs</a>
          </div>
          <a className={styles.button} data-track href={explore}>Explore Nexscope ↗</a>
        </nav>
      </header>

      <main id="main">
        <section className={`${styles.wrap} ${styles.hero}`} id="overview">
          <p className={styles.eyebrow}>NEXSCOPE COMMERCE ATLAS</p>
          <h1>Research the market.<br /><em>Turn evidence into the next move.</em></h1>
          <p className={styles.lead}>Research product demand, competitor keywords, customer reviews and search visibility. Then use practical guides to connect ecommerce APIs to AI agents or turn approved product assets into images and videos.</p>
          <div className={styles.actions}>
            <a className={styles.button} href="#library">Explore resources <ArrowRight size={17} /></a>
            <a className={styles.heroTextLink} href="#map">Browse by scenario <ArrowDown size={16} /></a>
          </div>
          <p className={styles.micro}>Official Nexscope learning hub · Product access and coverage vary by tool</p>

          <div className={styles.workflow} aria-label="Nexscope ecommerce workflow">
            <div className={styles.workflowStep}><span>MARKETPLACE SIGNALS</span><strong>Research the opportunity</strong><p>Products · buyer keywords · competing ASINs · reviews</p></div>
            <span className={styles.workflowArrow} aria-hidden="true">→</span>
            <div className={`${styles.workflowStep} ${styles.workflowCenter}`}><span>NEXSCOPE RESEARCH</span><strong>Find the next move</strong><p>Compare demand, listing gaps and customer objections</p></div>
            <span className={styles.workflowArrow} aria-hidden="true">→</span>
            <div className={styles.workflowStep}><span>CREATE & BUILD</span><strong>Put insights to work</strong><p>Listing plans · AI images and video · API/MCP workflows</p></div>
          </div>
          <p className={styles.workflowNote}>Review data and generated outputs before use; marketplace coverage and tool access vary.</p>
        </section>

        <section className={styles.statStrip} aria-label="Browse Nexscope content">
          <div className={styles.wrap}>
            <a href="/tools/"><strong>Tools</strong><span>Open a focused product workflow <ArrowRight size={15} /></span></a>
            <a href="/ecommerce-ai-tools/guides/"><strong>Guides</strong><span>Learn the practical steps <ArrowRight size={15} /></span></a>
            <a href="/ecommerce-ai-tools/api-evidence/"><strong>Evidence</strong><span>Review documented API tests <ArrowRight size={15} /></span></a>
            <a data-track href={docs}><strong>API docs</strong><span>Check fields and access <ArrowRight size={15} /></span></a>
          </div>
          <p>Coverage, freshness and credit requirements depend on the specific Nexscope product or API.</p>
        </section>

        <section className={styles.mapSection} id="map">
          <div className={styles.wrap}>
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>EXPLORE BY SCENARIO</p><h2>Start with the question you care about.</h2></div><p>Six ways into the Nexscope learning hub. Choose one area and go directly to a relevant workflow.</p></div>
            <div className={styles.sceneGrid}>
              {scenes.map((scene) => <a className={styles.sceneCard} href={scene.href} key={scene.id} data-track>
                <div className={styles.sceneTop}><scene.icon size={25} strokeWidth={1.6} /><span>{scene.count}</span></div>
                <h3>{scene.title}</h3><p>{scene.summary}</p><ArrowRight className={styles.sceneArrow} size={18} aria-hidden="true" />
              </a>)}
            </div>
            <p className={styles.mapNote}>Each scenario leads to an existing Nexscope page; tool availability and marketplace coverage may differ.</p>
          </div>
        </section>

        <HomeLibrary />

        <section className={`${styles.wrap} ${styles.method}`} id="method">
          <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>HOW TO READ THIS HUB</p><h2>Use the workflow. Check the boundary.</h2></div><p>Practical starting points are most useful when their source and limits stay visible.</p></div>
          <div className={styles.methodGrid}>
            <article><span>01</span><h3>Find the right entry</h3><p>Search the library or start with a scenario. Tools, guides, insights and evidence each answer a different kind of question.</p></article>
            <article><span>02</span><h3>Follow the source</h3><p>Open the linked page and inspect its cited data, publication date, tested inputs and limitations where available.</p></article>
            <article><span>03</span><h3>Verify before action</h3><p>Marketplace figures, estimates and AI outputs can change. Confirm important decisions with current product and business data.</p></article>
          </div>
          <div className={styles.methodLinks}><a href="/ecommerce-ai-tools/">All learning resources <ArrowRight size={16} /></a><a href="/tools/">All tools <ArrowRight size={16} /></a><a data-track href={docs}>Official API documentation <ArrowRight size={16} /></a></div>
        </section>

        <section className={`${styles.wrap} ${styles.closing}`}>
          <p>YOUR NEXT COMMERCE WORKFLOW</p><h2>Turn a question into a clearer next step.</h2>
          <span>Explore a tool, read the guide and decide what to test.</span>
          <a className={styles.button} href="/tools/">Explore Nexscope tools <ArrowRight size={17} /></a>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        <div><a href="/" aria-label="Nexscope home"><img className={styles.logo} src="/logo.png" alt="Nexscope" width="165" height="32" /></a><p>Ecommerce intelligence. AI-powered possibilities.</p></div>
        <div className={styles.footerlinks}><a href="/tools/">Tools</a><a href="/ecommerce-ai-tools/">Learn</a><a data-track href={docs}>API docs</a><a href="#analytics-preferences">Privacy</a></div>
        <p className={styles.disclosure}>Some links include referral tracking. The referrer may earn a commission. Product availability and terms are shown on nexscope.ai.</p>
      </footer>
    </div>
  );
}
