import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Radar,
} from 'lucide-react';
import { getTrendBySlug, trends } from '@/lib/trends';

type TrendPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return trends.map((trend) => ({ slug: trend.slug }));
}

export async function generateMetadata({
  params,
}: TrendPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trend = getTrendBySlug(slug);

  if (!trend) {
    return { title: 'Signal not found | Commerce Signal Radar' };
  }

  return {
    title: `${trend.title} | Commerce Signal Radar`,
    description: trend.summary,
  };
}

export default async function TrendPage({ params }: TrendPageProps) {
  const { slug } = await params;
  const trend = getTrendBySlug(slug);

  if (!trend) notFound();

  const trendIndex = trends.findIndex((item) => item.slug === trend.slug);
  const nextTrend = trends[(trendIndex + 1) % trends.length];
  const nexscopeUrl = `https://www.nexscope.ai/?utm_source=commerce-radar&utm_medium=content&utm_campaign=trend-insights&utm_content=${trend.slug}`;

  return (
    <main className="site-shell detail-shell">
      <nav className="nav" aria-label="Primary navigation">
        <div className="container nav-inner">
          <Link
            className="brand"
            href="/"
            aria-label="Commerce Signal Radar home"
          >
            <span className="brand-mark">N</span>
            <span>Commerce Signal Radar</span>
          </Link>

          <div className="nav-links detail-nav-links">
            <Link href="/#signals">All Signals</Link>
            <Link href="/#playbook">Playbook</Link>
          </div>

          <a
            className="nav-cta"
            href={nexscopeUrl}
            target="_blank"
            rel="noreferrer"
          >
            Explore Nexscope <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <header className="detail-hero">
        <div className="container">
          <Link className="back-link" href="/#signals">
            <ArrowLeft size={16} aria-hidden="true" /> Back to all signals
          </Link>

          <div className="detail-hero-grid">
            <div>
              <div className="detail-meta">
                <span>{trend.category}</span>
                <span>{trend.date}</span>
                <span>{trend.readingTime}</span>
              </div>
              <h1>{trend.title}</h1>
              <p className="detail-summary">{trend.summary}</p>
              <div className="detail-source-row">
                <span>Primary source</span>
                <a href={trend.sourceUrl} target="_blank" rel="noreferrer">
                  {trend.source} <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside
              className="detail-score-card"
              aria-label={`Signal score ${trend.score} out of 100`}
            >
              <div className="panel-label">
                <span>Signal score</span>
                <Radar size={18} aria-hidden="true" />
              </div>
              <strong>{trend.score}</strong>
              <p>{trend.signal}</p>
              <div className="detail-score-line">
                <span style={{ width: `${trend.score}%` }} />
              </div>
            </aside>
          </div>
        </div>
      </header>

      <article className="detail-article">
        <div className="container detail-layout">
          <aside className="detail-index" aria-label="Article sections">
            <span>In this signal</span>
            <a href="#what-changed">01 — What changed</a>
            <a href="#why-it-matters">02 — Why it matters</a>
            <a href="#what-to-do">03 — What to do now</a>
            <a href="#nexscope-workflow">04 — Nexscope workflow</a>
          </aside>

          <div className="detail-body">
            <section className="detail-section" id="what-changed">
              <p className="kicker">01 / What changed</p>
              <h2>The signal, without the noise.</h2>
              <ul className="signal-list">
                {trend.whatChanged.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="detail-section" id="why-it-matters">
              <p className="kicker">02 / Why it matters</p>
              <h2>The opportunity for ecommerce teams.</h2>
              {trend.whyItMatters.map((paragraph) => (
                <p className="article-copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="detail-section" id="what-to-do">
              <p className="kicker">03 / What to do now</p>
              <h2>Turn the signal into a test.</h2>
              <ol className="action-list">
                {trend.actions.map((action, index) => (
                  <li key={action}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{action}</p>
                    <CheckCircle2 size={20} aria-hidden="true" />
                  </li>
                ))}
              </ol>
            </section>

            <section className="prompt-card" id="nexscope-workflow">
              <div className="prompt-card-top">
                <span>Try this in Nexscope</span>
                <span className="prompt-live">Ready to run</span>
              </div>
              <blockquote>“{trend.nexscopePrompt}”</blockquote>
              <a
                className="button-primary"
                href={nexscopeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Validate this opportunity{' '}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </section>

            <footer className="next-signal">
              <span>Next signal</span>
              <Link href={`/trends/${nextTrend.slug}`}>
                <strong>{nextTrend.title}</strong>
                <ArrowRight size={24} aria-hidden="true" />
              </Link>
            </footer>
          </div>
        </div>
      </article>

      <footer className="footer detail-footer">
        <div className="container footer-inner">
          <Link className="brand" href="/">
            <span className="brand-mark">N</span>
            <span>Commerce Signal Radar</span>
          </Link>
          <p className="footer-note">
            Signals are based on public sources and provided for trend analysis
            only—not business or investment advice.
          </p>
        </div>
      </footer>
    </main>
  );
}
