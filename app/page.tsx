'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Database,
  ExternalLink,
  PlayCircle,
  Radar,
  Search,
  Sparkles,
} from 'lucide-react';
import { filters, trends } from '@/lib/trends';

const NEXSCOPE_URL =
  'https://www.nexscope.ai/?utm_source=commerce-radar&utm_medium=content&utm_campaign=trend-insights';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const visibleTrends = trends.filter(
    (trend) => activeFilter === 'All' || trend.category === activeFilter,
  );

  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Primary navigation">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="Commerce Radar home">
            <span className="brand-mark">N</span>
            <span className="brand-copy">
              <strong>Commerce Radar</strong>
              <small>by Nexscope</small>
            </span>
          </a>

          <div className="nav-links">
            <a href="#signals">Signals</a>
            <a href="#method">Method</a>
            <a href="#workflow">Workflow</a>
          </div>

          <a
            className="nav-cta"
            href={NEXSCOPE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open Nexscope <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy-block">
            <p className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              Weekly commerce intelligence · Week 37
            </p>
            <h1>The ecommerce shifts worth acting on.</h1>
            <p className="hero-copy">
              A focused briefing on the market, platform, and AI changes shaping
              how products are discovered, evaluated, and bought.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#signals">
                Review this week’s signals
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                className="button-secondary"
                href={NEXSCOPE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Validate with Nexscope
              </a>
            </div>
            <div className="trust-line" aria-label="Editorial method">
              <span>
                <Check size={14} aria-hidden="true" /> Public sources
              </span>
              <span>
                <Check size={14} aria-hidden="true" /> Actionable analysis
              </span>
              <span>
                <Check size={14} aria-hidden="true" /> Updated weekly
              </span>
            </div>
          </div>

          <aside className="brief-panel" aria-label="This week at a glance">
            <div className="brief-header">
              <div>
                <p className="panel-kicker">This week at a glance</p>
                <h2>AI moves closer to the checkout</h2>
              </div>
              <span className="week-chip">Sep 08—11</span>
            </div>

            <div className="lead-score-row">
              <div className="lead-score">
                <strong>89</strong>
                <span>/ 100</span>
              </div>
              <div className="score-context">
                <span>Signal strength</span>
                <div className="score-track" aria-label="Signal strength 89%">
                  <span style={{ width: '89%' }} />
                </div>
                <p>Strong enough to test now</p>
              </div>
            </div>

            <div className="brief-table">
              <div>
                <span>Primary shift</span>
                <strong>Agent-led transactions</strong>
              </div>
              <div>
                <span>Seller impact</span>
                <strong>Product data visibility</strong>
              </div>
              <div>
                <span>Action window</span>
                <strong>Now → 90 days</strong>
              </div>
            </div>

            <Link
              className="brief-link"
              href="/trends/ai-agents-move-to-checkout"
            >
              Read the lead signal <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </div>

        <div className="container radar-stats" aria-label="Radar summary">
          <div>
            <strong>04</strong>
            <span>signals reviewed</span>
          </div>
          <div>
            <strong>04</strong>
            <span>primary sources</span>
          </div>
          <div>
            <strong>89</strong>
            <span>highest signal score</span>
          </div>
          <div>
            <strong>Weekly</strong>
            <span>editorial cadence</span>
          </div>
        </div>
      </header>

      <section className="section signals-section" id="signals">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Signal desk</p>
              <h2 className="section-title">
                What changed—and what to do next
              </h2>
            </div>
            <p className="section-intro">
              Each briefing connects a verifiable market change to a practical
              ecommerce decision. No trend-chasing, just evidence and a next
              step.
            </p>
          </div>

          <fieldset className="filter-row">
            <legend className="sr-only">Filter signals</legend>
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
          </fieldset>

          {visibleTrends.length > 0 ? (
            <div className="stories-grid">
              {visibleTrends.map((story, index) => (
                <article
                  className={`story-card ${index === 0 ? 'featured' : ''}`}
                  key={story.id}
                >
                  <div className="card-topline">
                    <span className="category-label">{story.category}</span>
                    <span className="card-score">Signal {story.score}</span>
                  </div>

                  <div className="card-body">
                    <p className="card-index">
                      {story.id} / {story.date}
                    </p>
                    <h3>
                      <Link href={`/trends/${story.slug}`}>{story.title}</Link>
                    </h3>
                    <p className="story-summary">{story.summary}</p>
                  </div>

                  <footer className="card-footer">
                    <a
                      className="source-link"
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View source: ${story.source}`}
                    >
                      Source: {story.source}
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                    <Link className="read-more" href={`/trends/${story.slug}`}>
                      Read analysis <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </footer>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="section method-section" id="method">
        <div className="container method-grid">
          <div className="method-copy">
            <p className="kicker">Our method</p>
            <h2 className="section-title">
              A signal must survive three questions.
            </h2>
            <p>
              Headlines earn a place on the radar only when the change is
              observable, relevant to commerce teams, and specific enough to
              test.
            </p>
          </div>

          <div className="method-list">
            <article>
              <span className="method-icon">
                <Search size={18} aria-hidden="true" />
              </span>
              <div>
                <small>01 · Observe</small>
                <h3>What actually changed?</h3>
                <p>
                  Start with a named, public source—not a recycled prediction.
                </p>
              </div>
            </article>
            <article>
              <span className="method-icon">
                <BarChart3 size={18} aria-hidden="true" />
              </span>
              <div>
                <small>02 · Interpret</small>
                <h3>Why does it matter?</h3>
                <p>
                  Connect the shift to discovery, conversion, content, or
                  operations.
                </p>
              </div>
            </article>
            <article>
              <span className="method-icon">
                <Radar size={18} aria-hidden="true" />
              </span>
              <div>
                <small>03 · Validate</small>
                <h3>What can a team test?</h3>
                <p>
                  Turn the signal into a bounded research question with real
                  data.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section workflow-section" id="workflow">
        <div className="container">
          <div className="workflow-card">
            <div className="workflow-copy">
              <p className="kicker">From signal to evidence</p>
              <h2>Research the opportunity in Nexscope.</h2>
              <p>
                Move from a promising headline to product, market, keyword, and
                creative evidence—all in one commerce intelligence workspace.
              </p>
              <a
                className="button-primary button-on-dark"
                href={NEXSCOPE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Explore Nexscope <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>

            <div className="workflow-list" aria-label="Nexscope workflow">
              <div>
                <span>
                  <Database size={18} aria-hidden="true" />
                </span>
                <p>
                  <strong>Validate demand</strong>Compare product, keyword,
                  price, and competitor signals.
                </p>
              </div>
              <div>
                <span>
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <p>
                  <strong>Find the angle</strong>Turn reviews and market gaps
                  into a clear content direction.
                </p>
              </div>
              <div>
                <span>
                  <PlayCircle size={18} aria-hidden="true" />
                </span>
                <p>
                  <strong>Ship the test</strong>Create UGC-style assets for the
                  channels where buyers discover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">N</span>
            <span className="brand-copy">
              <strong>Commerce Radar</strong>
              <small>by Nexscope</small>
            </span>
          </a>
          <p className="footer-note">
            Analysis is based on public sources and is provided for research—not
            business or investment advice.
          </p>
          <a
            className="footer-link"
            href={NEXSCOPE_URL}
            target="_blank"
            rel="noreferrer"
          >
            nexscope.ai <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}
