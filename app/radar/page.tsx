'use client';

import { lazy, Suspense } from 'react';
import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { NexscopeLogo } from '@/components/nexscope-logo';

const CommerceGlobe = lazy(() =>
  import('@/components/commerce-globe').then((module) => ({
    default: module.CommerceGlobe,
  })),
);

const NEXSCOPE_BASE_URL =
  'https://www.nexscope.ai/apis?utm_source=github.io&utm_medium=referral&utm_campaign=commerce-radar';
const NEXSCOPE_URL = `${NEXSCOPE_BASE_URL}&utm_content=homepage-live-brief&co-from=github.io`;

const hotSignals = [
  {
    id: '01',
    platform: 'Google Ads',
    date: 'Sep 02, 2026',
    dateTime: '2026-09-02',
    topic: 'Measurement',
    title: 'Attribution is becoming a stack, not a single report.',
    summary:
      'Google is telling marketers to reconcile real-time attribution with incrementality tests and media mix modeling instead of letting one dashboard make the decision.',
    watch:
      'Where channel-level conversion claims diverge from blended revenue and margin.',
    source:
      'https://blog.google/products/ads-commerce/ads-decoded-podcast-measurement-stack/',
  },
  {
    id: '02',
    platform: 'Amazon',
    date: 'Aug 12, 2026',
    dateTime: '2026-08-12',
    topic: 'AI discovery',
    title: 'Conversational product discovery is replacing filter-first search.',
    summary:
      'Amazon describes Alexa for Shopping as a new retail interface built around open-ended questions, personalized comparisons, images, and purchase context.',
    watch:
      'Which product attributes, review themes, and use cases survive when a shopper asks a question instead of typing a keyword.',
    source:
      'https://www.aboutamazon.com/news/retail/alexa-for-shopping-learn-and-be-curious-podcast',
  },
  {
    id: '03',
    platform: 'Google',
    date: 'Aug 19, 2026',
    dateTime: '2026-08-19',
    topic: 'Product feeds',
    title: 'Holiday readiness now starts inside the product feed.',
    summary:
      'Google is pushing merchants to prepare Merchant Center earlier, making availability, identifiers, pricing, and product detail quality an immediate acquisition concern.',
    watch:
      'Missing or stale fields that can suppress product matching before campaign optimization even begins.',
    source:
      'https://blog.google/products/ads-commerce/ads-decoded-podcast-merchant-center-holidays/',
  },
  {
    id: '04',
    platform: 'Shopify',
    date: 'Jun 17, 2026',
    dateTime: '2026-06-17',
    topic: 'Agentic commerce',
    title: 'Shopify opened its agentic commerce layer to developers.',
    summary:
      'UCP and Catalog API make structured merchant data available to AI shopping surfaces, shifting discovery from storefront pages toward machine-readable catalogs.',
    watch:
      'Whether product data is complete enough for agents to understand variants, availability, delivery, and purchase constraints.',
    source: 'https://www.shopify.com/news/spring-26-edition-dev',
  },
  {
    id: '05',
    platform: 'Amazon',
    date: 'Jun 24, 2026',
    dateTime: '2026-06-24',
    topic: 'Price intelligence',
    title: 'Price history is moving into the purchase decision.',
    summary:
      'Amazon now surfaces longer price-history windows through Alexa for Shopping, giving buyers more context to challenge promotions and compare deal quality.',
    watch:
      'Price volatility, promotion depth, Buy Box movement, and the gap between a visible discount and a durable price advantage.',
    source:
      'https://www.aboutamazon.com/news/retail/how-to-check-amazon-price-history',
  },
  {
    id: '06',
    platform: 'Google',
    date: 'May 19, 2026',
    dateTime: '2026-05-19',
    topic: 'Checkout',
    title: 'The cart is expanding beyond the merchant storefront.',
    summary:
      'Google introduced Universal Cart across Search, Gemini, YouTube, and Gmail, with price-drop, stock, and compatibility intelligence built into the journey.',
    watch:
      'How pricing, inventory, product compatibility, and checkout handoff behave when discovery begins outside the store.',
    source:
      'https://blog.google/products-and-platforms/products/shopping/google-shopping-cart/',
  },
] as const;

const orderedHotSignals = [...hotSignals].sort((left, right) =>
  right.dateTime.localeCompare(left.dateTime),
);

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Commerce Signal Radar',
  description:
    'Current ecommerce signals across AI shopping, product feeds, measurement, pricing, and checkout.',
  url: 'https://nexscope-ai.github.io/radar/',
  dateModified: '2026-09-11',
  publisher: {
    '@type': 'Organization',
    name: 'Nexscope',
    url: 'https://www.nexscope.ai/',
  },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: orderedHotSignals.length,
    itemListElement: orderedHotSignals.map((signal, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: signal.title,
      url: `https://nexscope-ai.github.io/radar/#signal-${signal.id}`,
    })),
  },
};

function nexscopeSignalUrl(signalId: string) {
  return `${NEXSCOPE_BASE_URL}&utm_content=homepage-signal-${signalId}&co-from=github.io`;
}

export default function Home() {
  return (
    <main className="pulse-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="pulse-nav" aria-label="Primary navigation">
        <div className="container pulse-nav-inner">
          <div className="pulse-brand-row">
            <div className="brand" aria-label="Nexscope">
              <NexscopeLogo dark />
            </div>
            <a href="/">Nexscope home</a>
          </div>

          <a
            className="pulse-nav-link"
            href={NEXSCOPE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Explore data <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <div className="pulse-ticker" aria-label="Topics being monitored">
        <div className="container pulse-ticker-track">
          <strong>
            <span aria-hidden="true" /> Live watch
          </strong>
          <p>Agentic shopping</p>
          <p>Product-feed quality</p>
          <p>Attribution truth</p>
          <p>Price transparency</p>
        </div>
      </div>

      <header className="pulse-hero">
        <div className="container pulse-hero-grid">
          <article className="pulse-lead">
            <div className="pulse-lead-meta">
              <span>Lead signal / AI commerce</span>
              <time dateTime="2026-09-11">
                <Clock3 size={13} aria-hidden="true" /> Updated Sep 11, 2026
              </time>
            </div>

            <h1>The storefront is moving into the answer.</h1>
            <p>
              Google, Amazon, and Shopify are pushing product discovery,
              comparison, and checkout into AI-assisted surfaces. Product data
              is no longer back-office plumbing—it is distribution.
            </p>

            <div className="pulse-lead-footer">
              <div className="pulse-source-row" aria-label="Signal sources">
                <span>Google</span>
                <span>Amazon</span>
                <span>Shopify</span>
              </div>
              <a href={NEXSCOPE_URL} target="_blank" rel="noreferrer">
                Investigate the shift{' '}
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </article>

          <div className="pulse-globe-wrap">
            <Suspense
              fallback={
                <div className="globe-panel globe-loading">
                  <span>Loading market radar…</span>
                </div>
              }
            >
              <CommerceGlobe />
            </Suspense>
          </div>
        </div>
      </header>

      <section className="pulse-feed-section" aria-labelledby="hot-now-title">
        <div className="container">
          <header className="pulse-section-head">
            <div>
              <p>Commerce radar / Current signals</p>
              <h2 id="hot-now-title">
                What changed—and what sellers should investigate next.
              </h2>
            </div>
            <span>Edition 09.11.26</span>
          </header>

          <div className="pulse-feed-grid">
            {orderedHotSignals.map((signal, index) => (
              <article
                className={`pulse-signal-card ${index === 0 ? 'pulse-signal-featured' : ''}`}
                id={`signal-${signal.id}`}
                key={signal.id}
              >
                <div className="pulse-card-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{signal.platform}</p>
                  <time dateTime={signal.dateTime}>{signal.date}</time>
                </div>

                <div className="pulse-card-body">
                  <p>{signal.topic}</p>
                  <h3>{signal.title}</h3>
                  <p>{signal.summary}</p>
                </div>

                <div className="pulse-watch">
                  <span>Watch next</span>
                  <p>{signal.watch}</p>
                </div>

                <div className="pulse-card-footer">
                  <a href={signal.source} target="_blank" rel="noreferrer">
                    Official source{' '}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                  <a
                    href={nexscopeSignalUrl(signal.id)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore the data <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pulse-convert" aria-labelledby="pulse-convert-title">
        <div className="container pulse-convert-grid">
          <div>
            <p>From headline to evidence</p>
            <h2 id="pulse-convert-title">
              A trend tells you what changed. Data tells you where to act.
            </h2>
          </div>
          <div>
            <p>
              Compare product demand, pricing, reviews, stores, suppliers, and
              search signals with APIs built for commerce research workflows.
            </p>
            <a href={NEXSCOPE_URL} target="_blank" rel="noreferrer">
              Open Nexscope API docs{' '}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <footer className="pulse-footer">
        <div className="container pulse-footer-inner">
          <NexscopeLogo dark />
          <p>
            Editorial signal desk based on official platform updates. Not a live
            market-price feed.
          </p>
          <span>Updated Sep 11, 2026</span>
        </div>
      </footer>
    </main>
  );
}
