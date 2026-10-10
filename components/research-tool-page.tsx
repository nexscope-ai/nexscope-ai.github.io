/* Native links connect the exported static site to the Jekyll learning section. */
/* oxlint-disable next/no-html-link-for-pages, next/no-css-tags */
import MarketingHeader from '@/components/marketing-header';
import PriceLookupRuntime from '@/components/price-lookup-runtime';
import ExpansionToolRuntime from '@/components/expansion-tool-runtime';
import ResearchToolRuntime from '@/components/research-tool-runtime';
import type { ResearchTool } from '@/lib/research-tools';

export default function ResearchToolPage({ tool }: { tool: ResearchTool }) {
  const expansionTool = ['price-history', 'asin-gap', 'ai-shopping-check', 'tiktok-momentum', 'sourcing-demand'].includes(tool.kind);
  const url = `https://learn.nexscope.ai/tools/${tool.slug}/`;
  const apiKeyUrl = new URL('https://www.nexscope.ai/seller/api-access');
  apiKeyUrl.search = new URLSearchParams({
    tab: 'api-keys', mode: 'data', 'co-from': 'learn',
    utm_source: 'learn.nexscope.ai', utm_medium: 'referral',
    utm_campaign: `workflow_${tool.slug}`, utm_content: 'get_api_key',
  }).toString();
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: tool.title,
        description: tool.description, isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
        mainEntity: { '@id': `${url}#app` } },
      { '@type': 'WebApplication', '@id': `${url}#app`, name: tool.name, url,
        description: tool.description, applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web', featureList: tool.preview },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Tools', item: 'https://learn.nexscope.ai/tools/' },
        { '@type': 'ListItem', position: 2, name: tool.name, item: url },
      ] },
      ...(tool.faqs?.length ? [{ '@type': 'FAQPage', '@id': `${url}#faq`,
        mainEntity: tool.faqs.map((faq) => ({ '@type': 'Question', name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }] : []),
    ],
  };
  return <div className="research-tool-page">
    <link rel="stylesheet" href="/assets/research-tools.css?v=11" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }} />
    <MarketingHeader active="tools" campaign={`workflow_${tool.slug}`} />
    <main className="rt-wrap" id="main-content">
      <nav className="rt-breadcrumb" aria-label="Breadcrumb"><a href="/tools/">Tools</a><span>/</span><span>{tool.name}</span></nav>
      <section className="rt-hero">
        <div className="rt-hero-copy"><span className="rt-kicker">{tool.eyebrow}</span><h1>{tool.headline}</h1><p>{tool.lead}</p>
          <div className="rt-hero-actions"><a className="rt-primary" href="#workflow-title">Start the workflow ↘</a><span>Bring your own API key · review credit use before you run</span></div>
        </div>
        <div className="rt-hero-preview"><span>{expansionTool ? 'FROM INPUT TO AI REPORT' : 'FROM INPUT TO EVIDENCE'}</span><h2>{expansionTool ? 'One question. A focused analysis.' : 'One question. Reviewable evidence.'}</h2>
          {tool.preview.map((item, index) => <div key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</div>)}
        </div>
      </section>
      {tool.answer && <section className="rt-answer" aria-labelledby="rt-answer-title">
        <span className="rt-kicker">THE SHORT ANSWER</span>
        <h2 id="rt-answer-title">What can {tool.name} tell you?</h2>
        <p>{tool.answer}</p>
      </section>}
      <section className="rt-decision" aria-label="Method and limitations">
        <div><strong>HOW THIS WORKS</strong><p>{tool.method}</p></div>
        <div><strong>WHAT IT CANNOT PROVE</strong><p>{tool.limit}</p></div>
      </section>
      {expansionTool
        ? <ExpansionToolRuntime tool={tool} apiKeyUrl={apiKeyUrl.toString()} />
        : tool.kind === 'amazon-price' || tool.kind === 'supplier-price'
        ? <PriceLookupRuntime tool={tool} apiKeyUrl={apiKeyUrl.toString()} />
        : <ResearchToolRuntime tool={tool} apiKeyUrl={apiKeyUrl.toString()} />}
      {tool.faqs?.length ? <section className="rt-faq" aria-labelledby="rt-faq-title">
        <span className="rt-kicker">DECISION QUESTIONS</span>
        <h2 id="rt-faq-title">Before you use this result</h2>
        <div className="rt-faq-list">{tool.faqs.map((faq) => <details key={faq.question}>
          <summary>{faq.question}</summary><p>{faq.answer}</p>
        </details>)}</div>
      </section> : null}
      <section className="rt-more"><h2>Inspect the APIs behind this workflow.</h2><p>Confirm current parameters, credit prices and access before running a larger research batch.</p>
        <div className="rt-more-links">{[tool.primaryApi, ...tool.additionalApis].map((slug) => <a key={slug} href={`https://www.nexscope.ai/api-docs/${slug}?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=workflow_${tool.slug}`}>{slug} ↗</a>)}<a href="/tools/">All ecommerce tools →</a></div>
      </section>
    </main>
    <footer className="rt-footer"><div className="rt-wrap"><a href="/">Nexscope</a><nav aria-label="Footer"><a href="/tools/">Tools</a><a href="/ecommerce-ai-tools/">Learn</a><a href="/about/">About</a><a href="/security/">Security</a><a href="/contact/">Contact</a><a href="https://www.nexscope.ai/privacy">Privacy</a><a href="https://www.nexscope.ai/terms">Terms</a></nav></div></footer>
  </div>;
}
