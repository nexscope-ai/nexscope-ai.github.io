'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Database,
  ExternalLink,
  PlayCircle,
  Search,
  Sparkles,
} from 'lucide-react';
import { filters, trends } from '@/lib/trends';

const NEXSCOPE_URL =
  'https://www.nexscope.ai/?utm_source=commerce-radar&utm_medium=content&utm_campaign=trend-insights';

const tickerItems = [
  'Agentic commerce',
  'AI-native product discovery',
  'Structured product data',
  'Social-first creative',
  'Marketplace intelligence',
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Primary navigation">
        <div className="container nav-inner">
          <a
            className="brand"
            href="#top"
            aria-label="Commerce Signal Radar home"
          >
            <span className="brand-mark">N</span>
            <span>Commerce Signal Radar</span>
          </a>

          <div className="nav-links">
            <a href="#signals">Trend Signals</a>
            <a href="#playbook">Playbook</a>
            <a href="#about">About</a>
          </div>

          <a
            className="nav-cta"
            href={NEXSCOPE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Explore Nexscope <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              2026 Commerce Signals / Week 37
            </p>
            <h1>
              Plenty of hype.
              <br />
              Few real <span className="highlight">opportunities.</span>
            </h1>
            <p className="hero-copy">
              We translate the latest ecommerce headlines into growth signals
              sellers can use: what changed, why it matters, and what to
              validate next.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#signals">
                See this week’s signals{' '}
                <ArrowDownRight size={18} aria-hidden="true" />
              </a>
              <a
                className="text-link"
                href={NEXSCOPE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Validate with real commerce data{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside
            className="signal-panel"
            aria-label="This week’s trend signal strength"
          >
            <div className="panel-top">
              <div className="panel-label">
                <span>Signal intensity</span>
                <BarChart3 size={17} aria-hidden="true" />
              </div>
              <div className="score">89</div>
              <p className="score-title">
                AI shopping agents are this week’s strongest commerce signal
              </p>
            </div>
            <div className="panel-bottom">
              <p className="score-note">
                Opportunity window: product discovery, structured data,
                conversational conversion
              </p>
              <div className="meter" aria-label="Signal strength 89%">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span key={index} className={index < 9 ? 'active' : ''} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </header>

      <div className="ticker" aria-label="Trending topics">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span className="ticker-item" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="section" id="signals">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">01 / This week’s radar</p>
              <h2 className="section-title">
                Four signals reshaping ecommerce growth
              </h2>
            </div>
            <p className="section-intro">
              Not every headline deserves a strategy. These signals are
              happening now, changing the path to purchase, and actionable for
              sellers today.
            </p>
          </div>

          <div className="filter-row" role="group" aria-label="Filter trends">
            {filters.map((filter) => (
              <button
                className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="stories-grid">
            {trends.map((story) => {
              const isVisible =
                activeFilter === 'All' || activeFilter === story.category;
              return (
                <article
                  className={`story-card ${story.featured ? 'featured' : ''} ${isVisible ? '' : 'hidden'}`}
                  key={story.id}
                >
                  <div className="card-meta">
                    <span>{story.category}</span>
                    <a
                      className="source-pill"
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View source: ${story.source}`}
                    >
                      {story.source}{' '}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </div>
                  <div className="trend-number">{story.id}</div>
                  <h3>
                    <Link href={`/trends/${story.slug}`}>{story.title}</Link>
                  </h3>
                  <p className="story-summary">{story.summary}</p>
                  <footer className="card-footer">
                    <span className="signal-tag">{story.signal}</span>
                    <Link className="read-more" href={`/trends/${story.slug}`}>
                      Read signal · {story.date}{' '}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-dark" id="playbook">
        <div className="container">
          <div className="action-grid">
            <div className="action-copy">
              <p className="kicker">02 / From signal to growth</p>
              <h2 className="section-title">
                Spotting the trend is only step one.
              </h2>
              <p>
                Real opportunities need market validation. Then the insight has
                to become creative you can test and scale. Nexscope connects the
                entire workflow.
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <span className="step-number">01</span>
                <div>
                  <h3>Discover opportunities</h3>
                  <p>
                    Turn category shifts, platform updates, and market buzz into
                    research directions.
                  </p>
                </div>
                <span className="step-icon">
                  <Search size={18} aria-hidden="true" />
                </span>
              </div>
              <div className="step">
                <span className="step-number">02</span>
                <div>
                  <h3>Validate demand</h3>
                  <p>
                    Use Amazon, TikTok Shop, Google Trends, and other data to
                    assess demand and competition.
                  </p>
                </div>
                <span className="step-icon">
                  <Database size={18} aria-hidden="true" />
                </span>
              </div>
              <div className="step">
                <span className="step-number">03</span>
                <div>
                  <h3>Create content</h3>
                  <p>
                    Turn product assets into UGC-style videos ready for social
                    testing.
                  </p>
                </div>
                <span className="step-icon">
                  <PlayCircle size={18} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <div
            className="insight-strip"
            aria-label="Nexscope capabilities overview"
          >
            <div className="insight-stat">
              <strong>10+</strong>
              <span>
                Data access across leading marketplaces and commerce platforms
              </span>
            </div>
            <div className="insight-stat">
              <strong>Data + Creative</strong>
              <span>
                From product research and keywords to UGC video generation
              </span>
            </div>
            <div className="insight-stat">
              <strong>API · MCP</strong>
              <span>
                Connect with ChatGPT, Claude, and your own AI workflows
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="about">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="kicker">Ready when you are</p>
              <h2>
                Don’t guess the next winner.
                <br />
                Let the data speak.
              </h2>
              <p>
                Connect Nexscope to real ecommerce data to research products,
                markets, competitors, and keywords—then turn the opportunity
                into test-ready creative.
              </p>
              <div className="cta-actions">
                <a
                  className="button-dark"
                  href={NEXSCOPE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Try Nexscope for free{' '}
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a
                  className="mini-cta"
                  href="https://www.nexscope.ai/apis?utm_source=commerce-radar&utm_medium=content&utm_campaign=trend-insights"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore data capabilities{' '}
                  <Sparkles size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">N</span>
            <span>Commerce Signal Radar</span>
          </a>
          <p className="footer-note">
            Signals are based on public sources and provided for trend analysis
            only—not business or investment advice. Powered by Nexscope data
            capabilities.
          </p>
        </div>
      </footer>
    </main>
  );
}
