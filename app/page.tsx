'use client';

import { lazy, Suspense } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Database,
  Radar,
  Search,
  Sparkles,
} from 'lucide-react';
import { NexscopeLogo } from '@/components/nexscope-logo';

const CommerceGlobe = lazy(() =>
  import('@/components/commerce-globe').then((module) => ({
    default: module.CommerceGlobe,
  })),
);

const NEXSCOPE_URL =
  'https://www.nexscope.ai/apis?utm_source=github.io&utm_medium=referral&utm_campaign=commerce-radar&co-from=github.io';

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="nav radar-nav" aria-label="Primary navigation">
        <div className="container nav-inner">
          <div className="brand" aria-label="Nexscope Commerce Intelligence">
            <NexscopeLogo dark />
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
              Global ecommerce intelligence
            </p>
            <h1>Turn ecommerce uncertainty into evidence.</h1>
            <p className="hero-copy">
              Research product demand, market competition, customer language,
              supplier signals, and AI visibility with structured commerce data.
            </p>

            <div className="situation-metrics" aria-label="Platform summary">
              <div>
                <strong>API</strong>
                <span>structured commerce data</span>
              </div>
              <div>
                <strong>MCP</strong>
                <span>agent-ready access</span>
              </div>
              <div>
                <strong>REST</strong>
                <span>workflow integration</span>
              </div>
            </div>

            <div className="hero-actions">
              <a
                className="button-primary"
                href={NEXSCOPE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Explore Nexscope APIs{' '}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="globe-panel globe-loading">
                <span>Loading commerce intelligence map…</span>
              </div>
            }
          >
            <CommerceGlobe />
          </Suspense>
        </div>

        <div className="container situation-foot">
          <span>Product and market intelligence</span>
          <span>API · MCP · Skills</span>
          <span>Drag the globe or select a market node</span>
        </div>
      </header>

      <section className="section method-section" id="method">
        <div className="container method-grid">
          <div className="method-copy">
            <p className="kicker">Research model</p>
            <h2 className="section-title">
              Turn a question into a verifiable workflow.
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
          <div className="brand" aria-label="Nexscope Commerce Intelligence">
            <NexscopeLogo />
          </div>
          <p className="footer-note">
            Capability descriptions are based on the current public Nexscope API
            catalog and should be verified before implementation.
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
