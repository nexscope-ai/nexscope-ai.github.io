/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clapperboard,
  Database,
  Globe2,
  Users,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import HomeExampleCard from '@/components/home-example-card';
import HomeMcpBanner from '@/components/home-mcp-banner';
import HomeVideoExamples from '@/components/home-video-examples';
import RadarHomeModule from '@/components/radar-home-module';
import exampleSnapshot from '@/lib/home-video-examples.json';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import creditSnapshot from '@/lib/data-credit-snapshot.json';
import dataCatalog from '@/lib/ecommerce-directory-snapshot.json';
import socialCatalog from '@/lib/social-api-directory.json';
import { groupSocialPlatforms } from '@/lib/social-directory.mjs';
import { SocialPlatformIcon } from '@/components/social-platform-icon';
import videoApiCatalog from '@/lib/video-api-directory.json';
import { pricingMoney } from '@/lib/pricing-content.mjs';
import {
  entrySubscription,
  estimatedCapacity,
  historicalAverage,
  publicCostExamples,
} from '@/lib/home-value.mjs';
import { videoWorkflows } from '@/lib/home-video-workflows';
import { videoWorkflowUrl } from '@/lib/video-directory';
import { HOME_SOCIAL_IMAGE, NEXSCOPE_ORGANIZATION } from '@/lib/site-metadata';
import gradientTitle from './gradient-title.module.css';
import styles from './home-sections.module.css';

const homeTitle =
  'Nexscope Learn | Ecommerce Data APIs, MCP, and AI Image & Video';
const homeDescription =
  'See Nexscope ecommerce data APIs, the MCP server for AI agents, social APIs, and AI image and video generation, with an example request and response shape for each.';
const summary =
  'Nexscope Learn shows ecommerce data APIs, an MCP server for AI agents, social APIs, and AI image and video generation. Each section includes an example request and response shape.';
const mcpUrl = 'https://api.nexscope.ai/mcp';
const mcpSetupUrl = 'https://www.nexscope.ai/mcp-data?co-from=learn';
const dataPlatforms = dataCatalog.platforms.filter(({ logo }) => logo);
const hiddenHomeSocialPlatforms = new Set([
  'creator-tools',
  'kwai',
  'truthsocial',
  'komi',
  'linkbio',
  'linkme',
]);
const socialPlatforms = groupSocialPlatforms(socialCatalog.entries).filter(
  ({ id }) => !hiddenHomeSocialPlatforms.has(id),
);
const dataExample = `curl -X POST 'https://api.nexscope.ai/amazon/product/detail' \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
  "amazonDomain": "amazon.com",
  "asins": "B072MQ5BRX,B08N5WRWNW"
}'`;
const dataResponse = `{
  "code": 0,
  "data": {
    "total": 1,
    "products": [
      {
        "asin": "B072MQ5BRX",
        "title": "<listing title>",
        "brand": "<brand>",
        "extractedPrice": "<number>",
        "currency": "$"
      }
    ]
  }
}`;
const videoExample = `curl -X POST 'https://api.nexscope.ai/video/seedance20VideoGeneration' \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
  "imageUrl": "https://example.com/source-image.jpg",
  "prompt": "Keep the product consistent while the camera slowly orbits and highlights material details.",
  "resolution": "720p",
  "videoTime": 10
}'`;
const videoResponse = `{
  "code": 0,
  "data": {
    "status": "PENDING",
    "taskId": "example-task",
    "result": null
  }
}`;
const socialExample = `curl -X POST 'https://api.nexscope.ai/instagram/profile' \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
  "handle": "scrapecreators"
}'`;
const socialResponse = `{
  "code": 0,
  "data": {
    "platform": "instagram",
    "profile": null,
    "resourceStatus": "NOT_FOUND",
    "fetchedAt": "2026-10-28T00:00:00Z"
  }
}`;
const mcpExample = `URL: https://api.nexscope.ai/mcp
Transport: Streamable HTTP
Authorization: Bearer YOUR_API_KEY

{
  "jsonrpc": "2.0",
  "id": "tool-call-1",
  "method": "tools/call",
  "params": {
    "name": "nexscope_amazon_product_detail",
    "arguments": {
      "asins": "B072MQ5BRX"
    }
  }
}`;
const faqs = [
  {
    q: 'What can ecommerce operators do here?',
    a: 'Explore Image to Video, URL to Video, Avatar Video, Video Clone, Bulk Video and the Model Library. Open a workflow on the official Nexscope site to check its inputs, settings and credit requirements before creating a video.',
  },
  {
    q: 'What is available for ecommerce developers?',
    a: 'Use ecommerce Data APIs, the MCP server at https://api.nexscope.ai/mcp, Social APIs, and Video and Image APIs. The homepage shows one example request and response shape for each. Live calls use your own credentials and follow the selected operation’s requirements.',
  },
  {
    q: 'Where can I compare subscriptions and API credits?',
    a: 'The Pricing page shows monthly and yearly subscriptions from Nexscope’s public plan catalog. Review the upfront total, monthly credit allocation, introductory offer eligibility and renewal price. Data-only credit top-ups are also available without a subscription.',
  },
];
const videoApiCategories = [
  {
    id: 'image-generation-models',
    name: 'Image generation',
    summary: 'Create and edit product visuals',
    channels: [
      ['Google Gemini', 'nano-banana.webp'],
      ['OpenAI', 'gpt-image.webp'],
      ['ByteDance', 'seedream-seedance.webp'],
      ['Alibaba', 'wan.webp'],
    ],
  },
  {
    id: 'video-generation-models',
    name: 'Video generation',
    summary: 'Turn product assets into motion',
    channels: [
      ['ByteDance', 'seedream-seedance.webp'],
      ['Kuaishou', 'kling.webp'],
      ['Alibaba', 'wan.webp'],
      ['MiniMax', 'minimax.webp'],
    ],
  },
  {
    id: 'multimodal-ai',
    name: 'Multimodal AI',
    summary: 'Explore image and video workflows',
    channels: [
      ['Google Gemini', 'nano-banana.webp'],
      ['OpenAI', 'gpt-image.webp'],
      ['ByteDance', 'seedream-seedance.webp'],
      ['Alibaba', 'wan.webp'],
    ],
  },
] as const;

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    siteName: 'Nexscope Learn',
    url: '/',
    type: 'website',
    images: [HOME_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
    images: [HOME_SOCIAL_IMAGE],
  },
};

export default function Home() {
  const entry = entrySubscription(pricingSnapshot.plans);
  const videoCount = entry
    ? estimatedCapacity(entry.credits, publicCostExamples.video.credits)
    : null;
  const dataCost = historicalAverage(creditSnapshot, '1688-search-by-image');
  const dataCount = entry ? estimatedCapacity(entry.credits, dataCost) : null;
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              NEXSCOPE_ORGANIZATION,
              {
                '@type': 'WebSite',
                '@id': 'https://learn.nexscope.ai/#website',
                name: 'Nexscope Learn',
                url: 'https://learn.nexscope.ai/',
                description: summary,
                publisher: { '@id': 'https://www.nexscope.ai/#organization' },
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://learn.nexscope.ai/#webpage',
                url: 'https://learn.nexscope.ai/',
                name: homeTitle,
                description: summary,
                inLanguage: 'en',
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
                mainEntity: {
                  '@type': 'ItemList',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Ecommerce Data API directory',
                      url: 'https://learn.nexscope.ai/data/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Ecommerce MCP server',
                      url: 'https://learn.nexscope.ai/#mcp',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Social Media API directory',
                      url: 'https://learn.nexscope.ai/social/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'AI product video workflows',
                      url: 'https://learn.nexscope.ai/video/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 5,
                      name: 'Video and Image API directory',
                      url: 'https://learn.nexscope.ai/video-apis/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 7,
                      name: 'Nexscope subscriptions',
                      url: 'https://learn.nexscope.ai/pricing/',
                    },
                  ],
                },
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map(({ q, a }) => ({
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: { '@type': 'Answer', text: a },
                })),
              },
            ],
          }).replace(/</g, '\\u003c'),
        }}
      />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader campaign="homepage" />
      <main id="main">
        <section className={styles.hero}>
          <p className={styles.eyebrow}>
            NEXSCOPE · ECOMMERCE DATA, MCP, AND CREATIVE APIS
          </p>
          <h1>
            Ecommerce data APIs.
            <br />
            <em className={gradientTitle.text}>
              MCP for AI agents. AI image and video.
            </em>
          </h1>
          <p className={styles.heroLead}>
            Look up marketplace products, connect Codex, Claude, or Cursor to
            the Nexscope MCP server, and generate product images and video. Each
            section below shows one example request and the response shape.
          </p>
          <nav className={styles.heroActions} aria-label="Primary actions">
            <a
              className={styles.primary}
              href="/data/"
              data-track-tool="data-directory"
              data-cta-placement="home-hero-data"
            >
              Explore Data APIs <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              className={styles.secondaryCta}
              href={mcpSetupUrl}
              target="_blank"
              rel="noopener"
              data-track
              data-cta-placement="home-hero-mcp"
            >
              Connect MCP <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              className={styles.secondaryCta}
              href="https://www.nexscope.ai/tools/ai-video-generator?co-from=learn#generator"
              data-track
              target="_blank"
              rel="noopener"
              data-track-tool="ai-video-generator"
              data-cta-placement="home-hero-video"
            >
              Create a video <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a className={styles.secondaryCta} href="https://www.nexscope.ai/tools/ai-image-generator?co-from=learn#generator" data-track data-track-tool="ai-image-generator" data-cta-placement="home-hero-image">
              Create an image <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>
          <p className={styles.priceTerms}>
            {entry ? (
              <>
                <a href="/pricing/">
                  Plans from {pricingMoney(entry.monthlyAmount)}/mo
                </a>
                .{' '}
              </>
            ) : (
              <>
                <a href="/pricing/">Compare subscription plans</a>.{' '}
              </>
            )}
            USD. New accounts receive 1,000 trial credits for 3 days. No credit
            card required. Trial videos stay in the app.
          </p>
        </section>

        <RadarHomeModule />

        <section
          className={`${styles.module} ${styles.developers}`}
          id="for-ecommerce-developers"
          aria-labelledby="developers-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span className={styles.moduleIndex}>01 / 03</span> DATA,
                SOCIAL, AND CREATIVE APIS
              </p>
              <h2 id="developers-title" data-learn-section="home-developers">
                One example for
                <br />
                <em>each API collection.</em>
              </h2>
            </div>
            <p className={styles.moduleIntro}>
              Marketplace, social, and creative APIs. The samples show the
              documented request and the fields a response can include.
            </p>
            <HomeMcpBanner endpointUrl={mcpUrl} setupUrl={mcpSetupUrl} />
          </div>
          <div className={styles.developerGrid} id="data-apis">
            <div className={styles.dataCopy}>
              <p className={styles.apiSubmoduleLabel}>DATA APIS</p>
              <span className={styles.dataIcon}>
                <Database size={24} aria-hidden="true" />
              </span>
              <h3 id="data-api-submodule-title">
                Find the right ecommerce Data API.
              </h3>
              <p>
                Research products, reviews, keywords, sourcing candidates and
                competitors across marketplaces.
              </p>
              <div
                className={styles.platforms}
                role="list"
                aria-label="Data API platforms"
              >
                {dataPlatforms.map(({ kind, label, logo }) => (
                  <span key={kind} role="listitem" data-platform={kind}>
                    <img
                      src={`/data/logos/${logo}`}
                      alt=""
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                    {label}
                  </span>
                ))}
              </div>
              <ul className={styles.benefits}>
                <li>
                  <Check size={16} />
                  Filter APIs by platform, category or keyword
                </li>
                <li>
                  <Check size={16} />
                  Compare recorded usage and credit ranges
                </li>
                <li>
                  <Check size={16} />
                  Open the exact official documentation and tester
                </li>
              </ul>
              <a
                className={styles.primary}
                href="/data/"
                data-track-tool="data-directory"
                data-cta-placement="home-developers-data"
              >
                Explore Data APIs <ArrowRight size={16} />
              </a>
              <p className={styles.dataNote}>
                Free to browse. API requests follow the selected operation’s
                access and credit requirements.
              </p>
            </div>
            <HomeExampleCard
              kicker="EXAMPLE · AMAZON PRODUCT DETAIL"
              exampleId="amazon-product"
              outcome="See the product identity, title, brand and price fields available for your listing comparison."
              playground="https://www.nexscope.ai/api-docs/amazon-product-detail?view=documentation&co-from=learn#online-test"
              request={dataExample}
              response={dataResponse}
              mcp={mcpExample}
            />
          </div>
          <section
            className={styles.videoApiModule}
            id="video-image-apis"
            aria-labelledby="video-api-submodule-title"
          >
            <div className={styles.developerGrid}>
              <div className={styles.dataCopy}>
                <p className={styles.apiSubmoduleLabel}>
                  VIDEO &amp; IMAGE APIS
                </p>
                <span className={styles.dataIcon}>
                  <Clapperboard size={24} aria-hidden="true" />
                </span>
                <h3 id="video-api-submodule-title">
                  Image in, video task out.
                </h3>
                <p>
                  Create product visuals, turn images into videos and explore
                  multimodal models for creative applications.
                </p>
                <div
                  className={styles.platforms}
                  aria-label="Video and image API categories"
                >
                  {videoApiCategories.map(({ id, name, channels }) => (
                    <span key={id}>
                      <span
                        className={styles.videoChannelStack}
                        role="img"
                        aria-label={`${channels
                          .map(([channel]) => channel)
                          .join(', ')} model channels`}
                      >
                        {channels.slice(0, 4).map(([channel, logo]) => (
                          <img
                            key={channel}
                            src={`/assets/video-models/${logo}`}
                            alt=""
                            title={channel}
                            width="20"
                            height="20"
                            loading="lazy"
                          />
                        ))}
                      </span>
                      {name}
                    </span>
                  ))}
                </div>
                <p className={styles.videoChannelNote}>
                  Channel logos show example models in this collection.
                </p>
                <ul className={styles.benefits}>
                  <li>
                    <Check size={16} />
                    Browse {videoApiCatalog.entries.length} published APIs by
                    capability
                  </li>
                  <li>
                    <Check size={16} />
                    Compare model inputs and supported workflows
                  </li>
                  <li>
                    <Check size={16} />
                    Open official docs and playgrounds
                  </li>
                </ul>
                <a
                  className={styles.primary}
                  href="/video-apis/"
                  data-track-tool="video-api-directory"
                  data-cta-placement="home-developers-video-apis"
                >
                  Explore Video &amp; Image APIs <ArrowRight size={16} />
                </a>
                <p className={styles.dataNote}>
                  Browse model options and check each API&apos;s documentation
                  for supported inputs and credit requirements.
                </p>
              </div>
              <HomeExampleCard
                kicker="EXAMPLE · SEEDANCE VIDEO"
                exampleId="seedance-video"
                outcome="Submit an image and motion prompt, then use the returned task ID to check generation progress."
                playground="https://www.nexscope.ai/api-docs/seedance-2-0-video-generation?view=playground&co-from=learn"
                request={videoExample}
                response={videoResponse}
              />
            </div>
          </section>
          <section
            className={styles.socialFeature}
            id="social-apis"
            aria-labelledby="home-social-title"
          >
            <div className={`${styles.developerGrid} ${styles.socialApiGrid}`}>
              <div
                className={`${styles.dataCopy} ${styles.socialFeatureIntro}`}
              >
                <p className={styles.apiSubmoduleLabel}>SOCIAL APIS</p>
                <span className={styles.dataIcon}>
                  <Users size={24} aria-hidden="true" />
                </span>
                <h3 id="home-social-title">
                  A profile handle in, a profile record out.
                </h3>
                <p>
                  Bring public profiles, posts, comments, search results and
                  transcripts into your research tools. Browse{' '}
                  {socialCatalog.entries.length} Social API operations by
                  platform and workflow.
                </p>
                <div
                  className={styles.platforms}
                  role="list"
                  aria-label="Social API platforms"
                >
                  {socialPlatforms.map(({ id, name }) => (
                    <span key={id} role="listitem" data-platform={id}>
                      <SocialPlatformIcon platform={id} size={20} />
                      {name}
                    </span>
                  ))}
                </div>
                <a
                  className={styles.primary}
                  href="/social/"
                  data-track-tool="social-directory"
                  data-cta-placement="home-developers-social"
                >
                  Explore Social APIs{' '}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
              <HomeExampleCard
                kicker="EXAMPLE · INSTAGRAM PROFILE"
                exampleId="instagram-profile"
                outcome="Check the returned profile status before using it in creator research. This sample illustrates a profile-not-found result."
                playground="https://www.nexscope.ai/api-docs/social-instagram-profile?view=documentation&co-from=learn#online-test"
                request={socialExample}
                response={socialResponse}
              />
            </div>
          </section>
          {entry && dataCount !== null && (
            <div className={styles.valueStrip}>
              <div>
                <p className={styles.valueEyebrow}>PLAN YOUR API BUDGET</p>
                <h3>
                  About {dataCount.toLocaleString('en-US')} calls at {dataCost}{' '}
                  credits each, using historical averages.
                </h3>
                <p>
                  For example, {publicCostExamples.data.name} has a historical
                  average of {dataCost} credits per call with a 10-credit
                  minimum applied. This uses the full {entry.name} monthly
                  allocation of {entry.credits.toLocaleString('en-US')} credits
                  for that operation.
                </p>
                <small>
                  Estimates checked {creditSnapshot.checkedAt.slice(0, 10)}.
                  Other APIs have different costs. This is an allocation
                  estimate, not a per-call cash price.
                </small>
              </div>
              <a href="/data/1688-sourcing/">
                Explore 1688 APIs <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
          <div className={styles.evidenceRow}>
            <div>
              <Globe2 size={20} />
              <p>See a workflow before you build it.</p>
            </div>
            <a href="/ecommerce-ai-tools/api-evidence/portable-blender-amazon-1688/">
              Amazon-to-1688 API test <ArrowRight size={14} />
            </a>
            <a href="/ecommerce-ai-tools/api-capabilities/">
              API selection guide <ArrowRight size={14} />
            </a>
            <a href="/ecommerce-ai-tools/">
              Learning library <ArrowRight size={14} />
            </a>
          </div>
        </section>

        <section
          className={styles.module}
          id="for-ecommerce-operators"
          aria-labelledby="operators-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span className={styles.moduleIndex}>02 / 03</span> FOR
                ECOMMERCE OPERATORS
              </p>
              <h2 id="operators-title" data-learn-section="home-operators">
                Product video
                <br />
                <em>workflows.</em>
              </h2>
            </div>
            <div className={styles.moduleIntro}>
              <p>
                Preview official examples, then open a workflow with your own
                product photo or link.
              </p>
              <a
                href="/video/"
                data-track-tool="video-directory"
                data-cta-placement="home-operators-video"
              >
                Compare video workflows <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <HomeVideoExamples examples={exampleSnapshot.examples} />
          <p className={styles.exampleNote}>
            Official Nexscope Inspiration examples. Preview a clip, then start
            with your own product. Outputs vary by input and model.
          </p>
          {entry && videoCount !== null && (
            <div className={styles.valueStrip}>
              <div>
                <p className={styles.valueEyebrow}>
                  A SMALL PLAN. ROOM TO CREATE.
                </p>
                <h3>
                  {entry.name}: {entry.credits.toLocaleString('en-US')} credits
                  every month.
                </h3>
                <p>
                  About{' '}
                  <strong>
                    {videoCount.toLocaleString('en-US')} five-second videos
                  </strong>{' '}
                  if the full allocation goes to {publicCostExamples.video.name}{' '}
                  at {publicCostExamples.video.setting} (
                  {publicCostExamples.video.credits} credits each).
                </p>
                <small>
                  Source:{' '}
                  <a
                    href="https://www.nexscope.ai/pricing?co-from=learn"
                    target="_blank"
                    rel="noopener"
                  >
                    official pricing
                  </a>
                  , checked {publicCostExamples.verifiedOn}. Costs vary by model
                  and settings. Trial video creation is in-app only; video API
                  access is excluded.
                </small>
              </div>
              <a href="/pricing/">
                Compare plans <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          )}
          <div className={styles.subheading}>
            <h3>A starting point for every kind of product video.</h3>
            <span>Choose your workflow</span>
          </div>
          <div className={styles.workflowGrid}>
            {videoWorkflows.map(
              ({ name, path, icon: Icon, description, input }) => (
                <a
                  className={styles.workflowCard}
                  href={videoWorkflowUrl(path)}
                  key={path}
                  target="_blank"
                  rel="noopener"
                  data-track-tool={path}
                >
                  <div className={styles.workflowTop}>
                    <Icon size={22} aria-hidden="true" />
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </div>
                  <h4>{name}</h4>
                  <p>{description}</p>
                  <span>{input}</span>
                </a>
              ),
            )}
          </div>
        </section>

        <section
          className={styles.pricingStrip}
          aria-labelledby="home-pricing-title"
        >
          <div>
            <p className={styles.eyebrow}>SUBSCRIPTIONS</p>
            <h2 id="home-pricing-title" data-learn-section="home-pricing">
              Plans, credits, and what stays free.
            </h2>
            <p>
              Monthly and yearly plans share credits across API calls and video
              creation. <a href="/pricing/">See plan details</a>
            </p>
          </div>
        </section>
        <section className={styles.faq} aria-labelledby="faq-title">
          <div>
            <p className={styles.eyebrow}>GOOD TO KNOW</p>
            <h2 id="faq-title">Before you get started.</h2>
          </div>
          <div>
            {faqs.map(({ q, a }) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
