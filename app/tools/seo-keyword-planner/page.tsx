/* Native links connect this exported route to the Jekyll learning section. */
/* oxlint-disable next/no-html-link-for-pages, next/no-css-tags */
import type { Metadata } from 'next';
import MarketingHeader from '@/components/marketing-header';
import SeoPlannerRuntime from '@/components/seo-planner-runtime';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';

const url = 'https://learn.nexscope.ai/tools/seo-keyword-planner/';
const title = 'Google-to-Amazon Keyword Research Workflow | Nexscope';
const description =
  'Expand a US English topic into Google keyword ideas, then inspect Amazon US competitors for one selected phrase in a controlled API workflow.';
const apiKeyUrl = new URL('https://www.nexscope.ai/seller/api-access');
apiKeyUrl.search = new URLSearchParams({
  tab: 'api-keys',
  mode: 'data',
  'co-from': 'learn',
  utm_source: 'learn.nexscope.ai',
  utm_medium: 'referral',
  utm_campaign: 'workflow_seo-keyword-planner',
  utm_content: 'get_api_key',
}).toString();

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Google to Amazon keyword research',
    'Google keyword research workflow',
    'Amazon competitor research',
    'Amazon US competitor analysis',
  ],
  referrer: 'no-referrer',
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    siteName: 'Nexscope',
    url,
    title,
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const faqs = [
  {
    question: 'Are these Amazon search-volume numbers?',
    answer:
      'No. Keyword volume and difficulty come from Google keyword metrics. Amazon competitor sales are separate provider estimates for a returned sample of products.',
  },
  {
    question: 'Does opening this page use my API credits?',
    answer:
      'No. Keyword research, Amazon competitor lookup and AI report generation only run when you select their respective buttons. Each request may consume credits.',
  },
  {
    question: 'Do I need to connect my store?',
    answer:
      'No store connection is needed. You provide your own Nexscope API key for the requests you choose to run.',
  },
  {
    question: 'Does the AI report analyze customer reviews or my website?',
    answer:
      'No. It interprets only the returned Amazon product sample. Missing values remain unknown, and the conclusions should be verified against the source listings.',
  },
];
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      mainEntity: { '@id': `${url}#app` },
      isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
      publisher: { '@id': 'https://www.nexscope.ai/#organization' },
    },
    {
      '@type': 'WebApplication',
      '@id': `${url}#app`,
      name: 'Nexscope Google-to-Amazon Keyword Research Workflow',
      url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description,
      featureList: [
        'Google keyword expansion',
        'Google keyword metrics',
        'Amazon US competitor lookup',
        'Optional AI research report',
      ],
      publisher: { '@id': 'https://www.nexscope.ai/#organization' },
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map(({ question, answer }) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
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
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Google-to-Amazon Keyword Research Workflow',
          item: url,
        },
      ],
    },
  ],
};

export default function SeoKeywordPlannerPage() {
  return (
    <div className="seo-planner-page">
      <link rel="stylesheet" href="/assets/seo-keyword-planner.css?v=2" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll('<', '\\u003c'),
        }}
      />
      <a className="seo-skip" href="#main-content">
        Skip to content
      </a>
      <MarketingHeader active="tools" campaign="workflow_seo-keyword-planner" />
      <main className="seo-wrap" id="main-content">
        <nav className="seo-breadcrumb" aria-label="Breadcrumb">
          <a href="/tools/">Tools</a>
          <span aria-hidden="true">/</span>
          <span>Google-to-Amazon Workflow</span>
        </nav>
        <section className="seo-hero" aria-labelledby="seo-hero-title">
          <div className="seo-hero-copy">
            <span className="seo-eyebrow">NEXSCOPE · RESEARCH WORKFLOW</span>
            <h1 id="seo-hero-title">
              Turn Google keywords
              <br />
              <em>into an Amazon competitor brief.</em>
            </h1>
            <p>
              Expand one US English product topic into Google keyword evidence.
              Then choose a phrase to inspect a bounded Amazon US competitor
              sample and, if useful, generate an AI research report.
            </p>
            <a
              className="seo-button seo-button-primary"
              href="#planner-workspace"
            >
              Start your research <span aria-hidden="true">↘</span>
            </a>
            <p className="seo-hero-note">
              US · English · Your own API key · Credits apply only to requests
              you start
            </p>
          </div>
          <div className="seo-hero-steps" aria-label="Three-step workflow">
            <div>
              <span>01</span>
              <strong>Google keyword ideas</strong>
              <small>Up to 10 candidate phrases, volume and difficulty</small>
            </div>
            <div>
              <span>02</span>
              <strong>Amazon US competitors</strong>
              <small>A selected keyword and up to 10 returned products</small>
            </div>
            <div>
              <span>03</span>
              <strong>AI competitor report</strong>
              <small>Interpret the collected sample only when requested</small>
            </div>
          </div>
        </section>
        <section
          className="seo-explain"
          aria-label="Data sources and limitations"
        >
          <div>
            <span>GOOGLE EVIDENCE</span>
            <p>
              Search-volume and difficulty estimates describe Google keywords,
              not Amazon search demand.
            </p>
          </div>
          <div>
            <span>AMAZON EVIDENCE</span>
            <p>
              Competitor products are a limited Amazon US sample. Sales and
              revenue figures are provider estimates.
            </p>
          </div>
          <div>
            <span>YOUR CONTROL</span>
            <p>
              Every paid stage has its own button. No competitor lookup or AI
              report starts automatically.
            </p>
          </div>
        </section>
        <section
          className="seo-workspace"
          id="planner-workspace"
          data-seo-planner
          aria-labelledby="planner-title"
        >
          <div className="seo-section-title">
            <span className="seo-eyebrow">WORKSPACE</span>
            <h2 id="planner-title">Build a research shortlist</h2>
            <p>One topic. Three deliberate steps.</p>
          </div>
          <div className="seo-workspace-grid">
            <div className="seo-card seo-form-card">
              <span className="seo-step">01 / RESEARCH</span>
              <h3>Start with what you sell</h3>
              <p className="seo-muted">
                A specific English product or category works best.
              </p>
              <form data-seo-form noValidate>
                <label htmlFor="seo-topic">Product or topic</label>
                <input
                  id="seo-topic"
                  name="topic"
                  type="text"
                  maxLength={80}
                  placeholder="e.g. insulated lunch bag"
                  autoComplete="off"
                  spellCheck={false}
                  aria-describedby="seo-topic-error"
                />
                <span
                  className="seo-field-error"
                  id="seo-topic-error"
                  role="alert"
                  data-error-for="topic"
                />
                <div className="seo-key-box">
                  <div className="seo-key-heading">
                    <label htmlFor="seo-api-key">Your Nexscope API key</label>
                    <a
                      href={apiKeyUrl.toString()}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get an API key ↗
                    </a>
                  </div>
                  <input
                    id="seo-api-key"
                    name="apiKey"
                    type="text"
                    placeholder="Paste your key here"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-describedby="seo-key-error"
                  />
                  <span
                    className="seo-field-error"
                    id="seo-key-error"
                    role="alert"
                    data-error-for="apiKey"
                  />
                </div>
                <button
                  className="seo-button seo-button-primary seo-wide"
                  type="submit"
                  data-seo-research
                >
                  Find keyword opportunities <span aria-hidden="true">↗</span>
                </button>
                <p className="seo-muted seo-credit-note">
                  This action runs keyword expansion, then keyword metrics. Both
                  API requests may use credits. Your key is saved in this
                  browser&apos;s localStorage for the Nexscope tools, not in
                  cookies or the URL. Use a trusted device; clear the field to remove it.
                </p>
              </form>
              <output
                className="seo-status"
                data-seo-status
                aria-live="polite"
              />
            </div>
            <div className="seo-card seo-results-card" id="planner-results">
              <div className="seo-results-heading">
                <div>
                  <span className="seo-step">02 / REVIEW</span>
                  <h3>Your evidence</h3>
                </div>
                <span data-seo-result-state>No research yet</span>
              </div>
              <div data-seo-results>
                <div className="seo-empty">
                  <span aria-hidden="true">✦</span>
                  <h4>Begin with one product topic.</h4>
                  <p>
                    Keywords and competitor products appear here as you request
                    them. The optional AI report appears below this workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div data-seo-report />
          <noscript>
            <p>
              JavaScript is required to run this API workflow. No API key is
              submitted without it.
            </p>
          </noscript>
        </section>
        <section className="seo-faq" aria-labelledby="seo-faq-title">
          <span className="seo-eyebrow">QUESTIONS</span>
          <h2 id="seo-faq-title">Understand the evidence</h2>
          {faqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </section>
        <section className="seo-more">
          <div>
            <span className="seo-eyebrow">UNDER THE HOOD</span>
            <h2>Review the source APIs and method</h2>
            <p>
              Check current fields, access and credit prices before running
              large batches.
            </p>
          </div>
          <div>
            <a href="https://www.nexscope.ai/api-docs/seo-keyword-expand">
              Keyword expansion ↗
            </a>
            <a href="https://www.nexscope.ai/api-docs/seo-keyword-metrics">
              Keyword metrics ↗
            </a>
            <a href="https://www.nexscope.ai/api-docs/amazon-competitor-lookup">
              Amazon competitor lookup ↗
            </a>
            <a href="/ecommerce-ai-tools/amazon-competitor-keyword-research/">
              Amazon keyword research guide →
            </a>
            <a href="/ecommerce-ai-tools/editorial-policy/">
              Editorial &amp; evidence policy →
            </a>
            <a href="/tools/">All tools →</a>
          </div>
        </section>
      </main>
      <footer className="seo-footer">
        <div className="seo-wrap">
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
      <SeoPlannerRuntime />
    </div>
  );
}
