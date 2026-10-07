/* Native links connect the exported root site to the Jekyll learning section. */
/* oxlint-disable next/no-html-link-for-pages */
/* oxlint-disable next/no-css-tags -- Shared static workflow styles are loaded only on tool pages. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MarketingHeader from '@/components/marketing-header';
import WorkflowMarketSelect from '@/components/workflow-market-select';
import WorkflowRuntime from '@/components/workflow-runtime';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';
import { getWorkflowTool, workflowTools } from '@/lib/workflow-tools';

type WorkflowPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return workflowTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: WorkflowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getWorkflowTool(slug);
  if (!tool) return { title: 'Tool not found | Nexscope' };
  const url = `https://learn.nexscope.ai/tools/${tool.slug}/`;
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    referrer: 'no-referrer',
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: 'Nexscope',
      url,
      title: tool.title,
      description: tool.description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const tool = getWorkflowTool(slug);
  if (!tool) notFound();
  const url = `https://learn.nexscope.ai/tools/${tool.slug}/`;
  const apiKeyUrl = new URL('https://www.nexscope.ai/seller/api-access');
  apiKeyUrl.search = new URLSearchParams({
    tab: 'api-keys',
    mode: 'data',
    'co-from': 'learn',
    utm_source: 'learn.nexscope.ai',
    utm_medium: 'referral',
    utm_campaign: `workflow_${tool.slug}`,
    utm_content: 'get_api_key',
  }).toString();
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: tool.title,
        description: tool.description,
        mainEntity: { '@id': `${url}#app` },
        isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
        publisher: { '@id': 'https://www.nexscope.ai/#organization' },
      },
      {
        '@type': 'WebApplication',
        '@id': `${url}#app`,
        name: tool.name,
        url,
        description: tool.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        featureList: tool.resultPreview,
        publisher: { '@id': 'https://www.nexscope.ai/#organization' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Tools',
            item: 'https://learn.nexscope.ai/tools/',
          },
          { '@type': 'ListItem', position: 2, name: tool.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="workflow-tool-page">
      <link rel="stylesheet" href="/assets/workflow-tools.css?v=14" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll('<', '\\u003c'),
        }}
      />
      <a className="wf-skip" href="#main-content">
        Skip to content
      </a>
      <MarketingHeader active="tools" campaign={`workflow_${tool.slug}`} />
      <main className="wrap" id="main-content">
        <nav className="wf-breadcrumb" aria-label="Breadcrumb">
          <a href="/tools/">Tools</a>
          <span aria-hidden="true">/</span>
          <span>{tool.name}</span>
        </nav>
        <section className="wf-hero">
          <div className="wf-hero-copy">
            <span className="wf-eyebrow">{tool.eyebrow}</span>
            <h1>
              {tool.headline[0]}
              <br />
              <span>{tool.headline[1]}</span>
            </h1>
            <p>{tool.lead}</p>
            <div className="wf-hero-chips" aria-label="Workflow features">
              <span>Use your own API key</span>
              <span>Evidence-first results</span>
              <span>No store connection</span>
            </div>
            <div className="wf-hero-actions">
              <a className="wf-primary" href="#workflow-title">
                Start the workflow <span aria-hidden="true">↘</span>
              </a>
              <span>Only selected API requests use credits.</span>
            </div>
          </div>
          <div
            className="wf-hero-example"
            aria-label="Illustrative workflow preview"
          >
            <div className="wf-hero-example-head">
              <span>FROM INPUT TO ACTION</span>
              <span>Illustrative workflow</span>
            </div>
            <h2>One input. A clearer next step.</h2>
            <div className="wf-example-source">
              <span>START WITH</span>
              <strong>{tool.preview.input}</strong>
            </div>
            <span className="wf-example-arrow" aria-hidden="true">
              ↓
            </span>
            <div className="wf-example-outcome">
              <span>INVESTIGATE</span>
              <strong>{tool.preview.outcome}</strong>
              <p>{tool.preview.note}</p>
            </div>
          </div>
        </section>
        <section
          className="wf-decision-guide"
          aria-labelledby="wf-decision-title"
        >
          <div>
            <span className="wf-eyebrow">THE SHORT ANSWER</span>
            <h2 id="wf-decision-title">{tool.decisionGuide.question}</h2>
            <p>{tool.decisionGuide.answer}</p>
          </div>
          <div>
            <strong>How it works</strong>
            <p>{tool.decisionGuide.method}</p>
          </div>
          <div>
            <strong>What it cannot prove</strong>
            <p>{tool.decisionGuide.limit}</p>
            {tool.decisionGuide.evidence && (
              <a href={tool.decisionGuide.evidence.href}>
                {tool.decisionGuide.evidence.label}
              </a>
            )}
          </div>
        </section>
        <div className="wf-workspace-heading">
          <div>
            <span className="wf-eyebrow">A focused research workflow</span>
            <h2>From input to evidence.</h2>
          </div>
          <span>Bring your Nexscope API key to run</span>
        </div>
        <section
          className="wf-shell"
          data-workflow-tool={tool.mode}
          aria-labelledby="workflow-title"
        >
          <div className="wf-input-panel">
            <div className="wf-panel-heading">
              <div>
                <span className="wf-panel-step">01 / SET UP</span>
                <h2 id="workflow-title">{tool.formTitle}</h2>
                <p>{tool.formLead}</p>
              </div>
            </div>
            <div className="wf-form" data-tool-form="">
              <div className="wf-fields">
                <label>
                  {tool.inputLabel}
                  <input
                    name={tool.inputName}
                    type={tool.inputType || 'text'}
                    placeholder={tool.inputPlaceholder}
                    inputMode={tool.inputType === 'date' ? undefined : 'text'}
                    autoComplete="off"
                    spellCheck={false}
                    aria-required="true"
                    aria-describedby={`wf-${tool.inputName}-error`}
                  />
                  <span
                    className="wf-field-error"
                    id={`wf-${tool.inputName}-error`}
                    data-error-for={tool.inputName}
                    role="alert"
                  />
                </label>
                <WorkflowMarketSelect
                  label={tool.marketLabel}
                  name={tool.marketName}
                  options={tool.marketOptions}
                />
              </div>
              {tool.fieldNote && (
                <p className="wf-field-note">{tool.fieldNote}</p>
              )}
              <div className="wf-key-section">
                <div className="wf-key-heading">
                  <label htmlFor="wf-api-key">Your Nexscope API key</label>
                  <a
                    href={apiKeyUrl.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get an API key ↗
                  </a>
                </div>
                <input
                  id="wf-api-key"
                  name="apiKey"
                  type="text"
                  placeholder="Paste your key here"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-required="true"
                  aria-describedby="wf-api-key-error"
                />
                <span
                  className="wf-field-error"
                  id="wf-api-key-error"
                  data-error-for="apiKey"
                  role="alert"
                />
                <p className="wf-key-note">
                  Saved in this tab&apos;s sessionStorage for these Nexscope
                  tools. Clear the field to remove it; it is not placed in
                  cookies or the URL.
                </p>
              </div>
              <div className="wf-form-actions">
                <button className="wf-primary" type="button" data-run-tool="">
                  {tool.buttonLabel}
                </button>
                <p>{tool.creditNote}</p>
              </div>
              <div className="wf-credit-note">
                <strong>{tool.creditChip}</strong>
                <span>
                  API calls may consume credits; inspect one result only when
                  needed.
                </span>
              </div>
            </div>
            <output data-tool-status="" aria-live="polite">
              {tool.initialStatus}
            </output>
          </div>
          <noscript>
            <p className="wf-noscript">
              JavaScript is required to run this API workflow. No API key is
              submitted without it.
            </p>
          </noscript>
          <div className="wf-output-panel" id="workflow-results">
            <div className="wf-output-heading">
              <div>
                <span className="wf-panel-step">02 / REVIEW</span>
                <h2>Your findings</h2>
              </div>
              <span className="wf-output-state" aria-live="polite">
                No analysis yet
              </span>
            </div>
            <div className="wf-results-empty">
              <span className="wf-empty-symbol" aria-hidden="true">
                ✦
              </span>
              <h3>Start with one input. Review the evidence here.</h3>
              <p>
                The shortlist appears after the first request. Choose an item to
                load deeper detail only when it is useful.
              </p>
              <div className="wf-preview-list">
                <span>WHAT YOU&apos;LL SEE</span>
                {tool.resultPreview.map((item, index) => (
                  <div key={item}>
                    <b>{String(index + 1).padStart(2, '0')}</b>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div data-tool-results="" />
          </div>
        </section>
        <section
          className="wf-explainer"
          aria-label="How to interpret the results"
        >
          {tool.explainers.map((item) => (
            <div key={item.label}>
              <b>{item.label}</b>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
          ))}
        </section>
        <section className="wf-faq" aria-labelledby="workflow-faq-title">
          <h2 id="workflow-faq-title">Frequently asked questions</h2>
          {tool.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </section>
        <section className="wf-more">
          <h2>Inspect the underlying APIs.</h2>
          <p>
            Check current fields, limits, credit prices and access before
            running large batches.
          </p>
          <div className="wf-more-links">
            {tool.apiLinks.map((api) => (
              <a key={api.href} href={api.href}>
                {api.label}
              </a>
            ))}
            <a href="/tools/">All tools →</a>
          </div>
        </section>
      </main>
      <footer className="wf-footer">
        <div className="wrap">
          <a href="/">Nexscope</a>
          <nav aria-label="Footer">
            <a href="/tools/">Tools</a>
            <a href="/ecommerce-ai-tools/">Learn</a>
            <a href="/ecommerce-ai-tools/about/">About</a>
            <a href="/ecommerce-ai-tools/editorial-policy/">Editorial policy</a>
            <a href="https://www.nexscope.ai/privacy">Privacy</a>
            <a href="https://www.nexscope.ai/terms">Terms</a>
            <a href="https://www.nexscope.ai/api-docs">API docs ↗</a>
          </nav>
        </div>
      </footer>
      <WorkflowRuntime />
    </div>
  );
}
