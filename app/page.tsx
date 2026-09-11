'use client';

import { lazy, Suspense, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Database,
  Radar,
  Search,
  Sparkles,
} from 'lucide-react';
import { NexscopeLogo } from '@/components/nexscope-logo';
import { guideFilters, guides } from '@/lib/guides';

const CommerceGlobe = lazy(() =>
  import('@/components/commerce-globe').then((module) => ({
    default: module.CommerceGlobe,
  })),
);

const NEXSCOPE_URL =
  'https://www.nexscope.ai/apis?utm_source=github.io&utm_medium=referral&utm_campaign=commerce-radar&co-from=github.io';
const API_COUNT = new Set(
  guides.flatMap((guide) => guide.apiCapabilities.map((api) => api.slug)),
).size;

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const visibleGuides = guides.filter(
    (guide) => activeFilter === 'All' || guide.category === activeFilter,
  );

  return (
    <main className="site-shell">
      <nav className="nav radar-nav" aria-label="Primary navigation">
        <div className="container nav-inner">
          <a
            className="brand"
            href="#top"
            aria-label="Nexscope Commerce Guides home"
          >
            <NexscopeLogo dark />
          </a>

          <div className="nav-links">
            <a href="#guides">Guides</a>
            <a href="#method">Method</a>
            <a href="#workflow">Workflow</a>
          </div>

          <a
            className="nav-cta"
            href={NEXSCOPE_URL}
            target="_blank"
            rel="noreferrer"
          >
            API Docs <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <header className="situation-hero" id="top">
        <div className="container situation-grid">
          <div className="situation-copy">
            <p className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              Ecommerce decision radar · 5 practical guides
            </p>
            <h1>Turn ecommerce uncertainty into evidence.</h1>
            <p className="hero-copy">
              Five practical guides built around recurring seller questions and
              the live Nexscope APIs that can help answer them.
            </p>

            <div className="situation-metrics" aria-label="Guide summary">
              <div>
                <strong>{String(guides.length).padStart(2, '0')}</strong>
                <span>decision guides</span>
              </div>
              <div>
                <strong>{String(API_COUNT).padStart(2, '0')}</strong>
                <span>live API capabilities</span>
              </div>
              <div>
                <strong>05</strong>
                <span>problem areas</span>
              </div>
            </div>

            <div className="hero-actions">
              <a className="button-primary" href="#guides">
                Explore the guides <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                className="button-secondary dark-secondary"
                href={NEXSCOPE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Explore Nexscope APIs
              </a>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="globe-panel globe-loading">
                <span>Loading decision guide map…</span>
              </div>
            }
          >
            <CommerceGlobe />
          </Suspense>
        </div>

        <div className="container situation-foot">
          <span>Built from recurring merchant questions</span>
          <span>{API_COUNT} verified API capabilities</span>
          <span>Drag the globe or select a guide</span>
        </div>
      </header>

      <section className="section signals-section" id="guides">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">Seller decision guides</p>
              <h2 className="section-title">
                Start with the question blocking your next move.
              </h2>
            </div>
            <p className="section-intro">
              Each guide connects a recurring ecommerce problem to a practical
              research workflow and the exact live Nexscope APIs that support
              it.
            </p>
          </div>

          <fieldset className="filter-row">
            <legend className="sr-only">Filter guides</legend>
            {guideFilters.map((filter) => (
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

          {visibleGuides.length > 0 ? (
            <div className="stories-grid">
              {visibleGuides.map((guide, index) => (
                <article
                  className={`story-card ${index === 0 ? 'featured' : ''}`}
                  key={guide.id}
                >
                  <div className="card-topline">
                    <span className="category-label">{guide.category}</span>
                    <span className="card-score">
                      {guide.apiCapabilities.length} APIs
                    </span>
                  </div>

                  <div className="card-body">
                    <p className="card-index">
                      {guide.id} / {guide.date}
                    </p>
                    <h3>
                      <a href={`/guides/${guide.slug}/`}>{guide.title}</a>
                    </h3>
                    <p className="story-summary">{guide.summary}</p>
                  </div>

                  <footer className="card-footer">
                    <span className="source-link">
                      <span className="live-dot" aria-hidden="true" />{' '}
                      Capability-backed
                    </span>
                    <a className="read-more" href={`/guides/${guide.slug}/`}>
                      Open guide <ArrowRight size={15} aria-hidden="true" />
                    </a>
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
              Every guide connects three layers.
            </h2>
            <p>
              Start with the blocked decision, identify the evidence that can
              reduce uncertainty, and finish with a bounded next step.
            </p>
          </div>

          <div className="method-list">
            <article>
              <span className="method-icon">
                <Search size={18} aria-hidden="true" />
              </span>
              <div>
                <small>01 · Observe</small>
                <h3>What decision is blocked?</h3>
                <p>
                  Define the commercial question before collecting more data.
                </p>
              </div>
            </article>
            <article>
              <span className="method-icon">
                <BarChart3 size={18} aria-hidden="true" />
              </span>
              <div>
                <small>02 · Interpret</small>
                <h3>Which data can answer it?</h3>
                <p>
                  Combine relevant signals without pretending one metric is
                  proof.
                </p>
              </div>
            </article>
            <article>
              <span className="method-icon">
                <Radar size={18} aria-hidden="true" />
              </span>
              <div>
                <small>03 · Validate</small>
                <h3>What should happen next?</h3>
                <p>
                  Turn the evidence into a specific, measurable research or
                  market test.
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
              <p className="kicker">From question to workflow</p>
              <h2>Put commerce intelligence to work in Nexscope.</h2>
              <p>
                Research markets, compare evidence, and connect structured
                ecommerce data to the tools and agents your team already uses.
              </p>
              <a
                className="button-primary button-on-dark"
                href={NEXSCOPE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Open API documentation{' '}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>

            <div className="workflow-list" aria-label="Nexscope workflow">
              <div>
                <span>
                  <Database size={18} aria-hidden="true" />
                </span>
                <p>
                  <strong>Research the market</strong>Query products, stores,
                  reviews, suppliers, search demand, and AI visibility.
                </p>
              </div>
              <div>
                <span>
                  <Sparkles size={18} aria-hidden="true" />
                </span>
                <p>
                  <strong>Compare the evidence</strong>Turn separate signals
                  into a traceable decision brief.
                </p>
              </div>
              <div>
                <span>
                  <Radar size={18} aria-hidden="true" />
                </span>
                <p>
                  <strong>Connect your workflow</strong>Use REST APIs, MCP, or
                  Skills in the environment where your team works.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a
            className="brand"
            href="#top"
            aria-label="Nexscope Commerce Guides home"
          >
            <NexscopeLogo />
          </a>
          <p className="footer-note">
            Guides distinguish verified API capabilities from checks that still
            require first-party analytics or manual validation.
          </p>
          <a
            className="footer-link"
            href={NEXSCOPE_URL}
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
