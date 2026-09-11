import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Database,
  ExternalLink,
} from 'lucide-react';
import { NexscopeLogo } from '@/components/nexscope-logo';
import { TrendMap } from '@/components/trend-map';
import { getGuideBySlug, guides } from '@/lib/guides';

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

const NEXSCOPE_APIS = 'https://www.nexscope.ai/apis';

function trackedDocsUrl(guideSlug: string, apiSlug?: string) {
  const target = apiSlug ? `${NEXSCOPE_APIS}/${apiSlug}` : NEXSCOPE_APIS;
  return `${target}?utm_source=github.io&utm_medium=referral&utm_campaign=commerce-radar&utm_content=${guideSlug}&co-from=github.io`;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Guide not found | Nexscope Commerce Guides' };
  }

  return {
    title: `${guide.title} | Nexscope Commerce Guides`,
    description: guide.summary,
    keywords: guide.keywords,
    alternates: {
      canonical: `/guides/${guide.slug}/`,
    },
    openGraph: {
      type: 'article',
      url: `/guides/${guide.slug}/`,
      title: guide.title,
      description: guide.summary,
      publishedTime: guide.date.replaceAll('.', '-'),
      modifiedTime: guide.date.replaceAll('.', '-'),
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  const guideIndex = guides.findIndex((item) => item.slug === guide.slug);
  const nextGuide = guides[(guideIndex + 1) % guides.length];
  const nexscopeUrl = trackedDocsUrl(guide.slug);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.summary,
    keywords: guide.keywords.join(', '),
    datePublished: guide.date.replaceAll('.', '-'),
    dateModified: guide.date.replaceAll('.', '-'),
    mainEntityOfPage: `https://nexscope-ai.github.io/guides/${guide.slug}/`,
    author: {
      '@type': 'Organization',
      name: 'Nexscope',
      url: 'https://www.nexscope.ai/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nexscope',
      url: 'https://www.nexscope.ai/',
    },
    citation: guide.apiCapabilities.map(
      (api) => `${NEXSCOPE_APIS}/${api.slug}`,
    ),
  };

  return (
    <main className="site-shell detail-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replaceAll('<', '\\u003c'),
        }}
      />
      <nav className="nav" aria-label="Primary navigation">
        <div className="container nav-inner">
          <a
            className="brand"
            href="/"
            aria-label="Nexscope Commerce Guides home"
          >
            <NexscopeLogo />
          </a>

          <div className="nav-links detail-nav-links">
            <a href="/#guides">All Guides</a>
            <a href="/#method">Method</a>
          </div>

          <a
            className="nav-cta"
            href={nexscopeUrl}
            target="_blank"
            rel="noreferrer"
          >
            API Docs <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <header className="detail-hero">
        <div className="container">
          <a className="back-link" href="/#guides">
            <ArrowLeft size={16} aria-hidden="true" /> Back to all guides
          </a>

          <div className="detail-hero-grid">
            <div>
              <div className="detail-meta">
                <span>{guide.category}</span>
                <span>{guide.date}</span>
                <span>{guide.readingTime}</span>
              </div>
              <h1>{guide.title}</h1>
              <p className="detail-summary">{guide.summary}</p>
              <div className="detail-source-row">
                <span>Capability source</span>
                <a href={nexscopeUrl} target="_blank" rel="noreferrer">
                  Nexscope live API catalog{' '}
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside
              className="detail-score-card"
              aria-label={`${guide.apiCapabilities.length} verified APIs in this guide`}
            >
              <div className="panel-label">
                <span>Verified APIs</span>
                <Database size={18} aria-hidden="true" />
              </div>
              <strong>
                {String(guide.apiCapabilities.length).padStart(2, '0')}
              </strong>
              <p>{guide.signal}</p>
              <div className="detail-score-line">
                <span style={{ width: '100%' }} />
              </div>
            </aside>
          </div>
        </div>
      </header>

      <article className="detail-article">
        <div className="container detail-layout">
          <aside className="detail-index" aria-label="Guide sections">
            <span>In this guide</span>
            <a href={`/guides/${guide.slug}/#the-problem`}>01 — The problem</a>
            <a href={`/guides/${guide.slug}/#market-lens`}>02 — Market lens</a>
            <a href={`/guides/${guide.slug}/#data-answers`}>
              03 — What data can answer
            </a>
            <a href={`/guides/${guide.slug}/#practical-workflow`}>
              04 — Practical workflow
            </a>
            <a href={`/guides/${guide.slug}/#nexscope-apis`}>
              05 — Nexscope APIs
            </a>
          </aside>

          <div className="detail-body">
            <section className="detail-section" id="the-problem">
              <p className="kicker">01 / The problem</p>
              <h2>Why this decision is difficult.</h2>
              <ul className="signal-list">
                {guide.problemPoints.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="detail-section map-section" id="market-lens">
              <TrendMap
                title={guide.mapTitle}
                summary={guide.mapSummary}
                nodes={guide.marketNodes}
              />
            </section>

            <section className="detail-section" id="data-answers">
              <p className="kicker">03 / What data can answer</p>
              <h2>Use evidence that matches the question.</h2>
              {guide.dataAnswers.map((paragraph) => (
                <p className="article-copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="detail-section" id="practical-workflow">
              <p className="kicker">04 / Practical workflow</p>
              <h2>Move from uncertainty to a bounded test.</h2>
              <ol className="action-list">
                {guide.workflow.map((action, index) => (
                  <li key={action}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{action}</p>
                    <CheckCircle2 size={20} aria-hidden="true" />
                  </li>
                ))}
              </ol>
            </section>

            <section className="detail-section" id="nexscope-apis">
              <p className="kicker">05 / Nexscope APIs</p>
              <h2>The live capabilities behind this workflow.</h2>
              <div className="api-capability-list">
                {guide.apiCapabilities.map((api, index) => (
                  <a
                    className="api-capability-card"
                    href={trackedDocsUrl(guide.slug, api.slug)}
                    target="_blank"
                    rel="noreferrer"
                    key={api.slug}
                  >
                    <div className="api-capability-top">
                      <span className="api-capability-number">
                        API {String(index + 1).padStart(2, '0')}
                      </span>
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </div>
                    <h3>{api.name}</h3>
                    <p>{api.description}</p>
                    <span className="api-output-list">
                      {api.outputs.map((output) => (
                        <span key={output}>{output}</span>
                      ))}
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <section className="prompt-card">
              <div className="prompt-card-top">
                <span>Turn this guide into a workflow</span>
                <span className="prompt-live">Ready to adapt</span>
              </div>
              <blockquote>“{guide.nexscopePrompt}”</blockquote>
              <a
                className="button-primary"
                href={nexscopeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open API documentation{' '}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </section>

            <footer className="next-signal">
              <span>Next guide</span>
              <a href={`/guides/${nextGuide.slug}/`}>
                <strong>{nextGuide.title}</strong>
                <ArrowRight size={24} aria-hidden="true" />
              </a>
            </footer>
          </div>
        </div>
      </article>

      <footer className="footer detail-footer">
        <div className="container footer-inner">
          <a
            className="brand"
            href="/"
            aria-label="Nexscope Commerce Guides home"
          >
            <NexscopeLogo />
          </a>
          <p className="footer-note">
            Capabilities are matched to Nexscope&apos;s current public API
            catalog. The linked documentation remains the source of truth for
            access and fields.
          </p>
          <a
            className="footer-link"
            href={nexscopeUrl}
            target="_blank"
            rel="noreferrer"
          >
            API docs <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}
