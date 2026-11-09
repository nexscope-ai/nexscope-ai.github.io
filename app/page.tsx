/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clapperboard,
  Database,
  Globe2,
  PackagePlus,
  Users,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import HomeExampleCard from '@/components/home-example-card';
import HomeMcpBanner from '@/components/home-mcp-banner';
import HomeVideoExamples from '@/components/home-video-examples';
import exampleSnapshot from '@/lib/home-video-examples.json';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import creditSnapshot from '@/lib/data-credit-snapshot.json';
import homeProductSnapshot from '@/lib/home-product-snapshot.json';
import socialCatalog from '@/lib/social-api-directory.json';
import videoApiCatalog from '@/lib/video-api-directory.json';
import { pricingMoney } from '@/lib/pricing-content.mjs';
import {
  entrySubscription,
  estimatedCapacity,
  historicalAverage,
  publicCostExamples,
} from '@/lib/home-value.mjs';
import { videoWorkflows, workflowUrl } from '@/lib/home-video-workflows';
import { HOME_SOCIAL_IMAGE, NEXSCOPE_ORGANIZATION } from '@/lib/site-metadata';
import gradientTitle from './gradient-title.module.css';
import styles from './home-sections.module.css';

const gallery = '/ecommerce-ai-tools/product-showcase/';
const submit = `${gallery}submit/`;
const publishedProduct = homeProductSnapshot.product;
const homeTitle =
  'Nexscope Learn | Ecommerce Data APIs, MCP, and AI Image & Video';
const homeDescription =
  'See Nexscope ecommerce data APIs, the MCP server for AI agents, social APIs, and AI image and video generation, with an example request and response shape for each.';
const summary =
  'Nexscope Learn shows ecommerce data APIs, an MCP server for AI agents, social APIs, and AI image and video generation. Each section includes an example request and response shape. A human-reviewed Product Growth Report and the free Product Gallery remain available.';
const mcpUrl = 'https://api.nexscope.ai/mcp';
const mcpSetupUrl = 'https://www.nexscope.ai/mcp-data?co-from=learn';
const platforms = [
  ['amazon', 'Amazon'],
  ['tiktok', 'TikTok Shop'],
  ['1688', '1688'],
  ['shopify', 'Shopify'],
  ['shopee', 'Shopee'],
  ['walmart', 'Walmart'],
  ['ozon', 'Ozon'],
] as const;
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
    q: 'Is the Product Growth Report the same as a free Gallery listing?',
    a: 'No. The growth report is a separately quoted credit-based service for one product and target market, reviewed before delivery. Choose at least one paid service; SEO and GEO analyses are included. Gallery submission, review and approved display remain completely free.',
  },
  {
    q: 'Is listing my product completely free?',
    a: 'Yes. Product submission, editorial review, and approved product listing and display are completely free. You do not need to pay or connect a store account to submit. Save the private management link after submission to check status, read feedback and edit your details.',
  },
  {
    q: 'Does a Product Gallery listing guarantee AI recommendations?',
    a: 'An approved listing gives search and AI systems a public source of product facts, images and your store link. It supports AI discovery and GEO, but does not guarantee indexing, recommendations, traffic or sales. Purchases take place on your original store.',
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
                      position: 6,
                      name: 'Product Growth Report and free Product Gallery',
                      url: 'https://learn.nexscope.ai/#product-growth',
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
      <MarketingHeader campaign="homepage" homepageFocus productReviewCta />
      <main id="main">
        <section className={styles.hero}>
          <p className={styles.eyebrow}>
            NEXSCOPE · ECOMMERCE DATA, MCP, AND CREATIVE APIS
          </p>
          <h1>
            Ecommerce data APIs.
            <br />
            <em className={gradientTitle.text}>MCP for AI agents. AI image and video.</em>
          </h1>
          <p className={styles.heroLead}>
            Look up marketplace products, connect Codex, Claude, or Cursor to
            the Nexscope MCP server, and generate product images and video.
            Each section below shows one example request and the response shape.
          </p>
          <nav className={styles.heroActions} aria-label="Primary actions">
            <a
              className={styles.primary}
              href="/data/"
              data-track-tool="data-directory"
            >
              Explore Data APIs <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              className={styles.primary}
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
              href={workflowUrl('image-to-video')}
              target="_blank"
              rel="noopener"
              data-track-tool="image-to-video"
            >
              Try Image to Video <ArrowUpRight size={15} aria-hidden="true" />
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

        <section
          className={`${styles.module} ${styles.developers}`}
          id="for-ecommerce-developers"
          aria-labelledby="developers-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span className={styles.moduleIndex}>01 / 03</span> DATA, SOCIAL,
                AND CREATIVE APIS
              </p>
              <h2 id="developers-title">
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
                aria-label="Marketplace examples"
              >
                {platforms.map(([slug, name]) => (
                  <span key={slug}>
                    <img
                      src={`/data/logos/${slug}.webp`}
                      alt=""
                      width="20"
                      height="20"
                      loading="lazy"
                    />
                    {name}
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
                  aria-label="Social platform examples"
                >
                  {[
                    ['Instagram', '/assets/video-channels/instagram.svg'],
                    ['TikTok', '/assets/video-channels/tiktok.webp'],
                    ['YouTube', '/assets/video-channels/youtube.svg'],
                    ['Reddit', '/assets/social-platforms/reddit.svg'],
                    ['LinkedIn', '/assets/social-platforms/linkedin.svg'],
                    ['X / Twitter', '/assets/social-platforms/x.svg'],
                  ].map(([name, logo]) => (
                    <span key={name}>
                      <img
                        src={logo}
                        alt=""
                        width="20"
                        height="20"
                        loading="lazy"
                      />
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
              <h2 id="operators-title">
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
              <a href="/video/" data-track-tool="video-directory">
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
                  href={workflowUrl(path)}
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
          className={`${styles.module} ${styles.growthModule}`}
          id="product-growth"
          aria-labelledby="growth-title"
        >
          <div className={styles.moduleHeading}>
            <div>
              <p className={styles.moduleLabel}>
                <span className={styles.moduleIndex}>03 / 03</span> FOR PRODUCT
                TEAMS
              </p>
              <h2 id="growth-title">
                The next step for
                <br />
                <em>your product.</em>
              </h2>
            </div>
            <p className={styles.moduleIntro}>
              Get a human-reviewed action plan for one product and market, or
              publish a free listing with verified product facts.
            </p>
          </div>
          <div className={styles.growthFeature}>
            <div>
              <p className={styles.eyebrow}>
                PRODUCT GROWTH REPORT · PAID SERVICES
              </p>
              <h3>
                One product link.
                <br />A plan you can act on.
              </h3>
              <p>
                Choose AI mention analysis, competitor research, keywords,
                product copy or advertising images. Receive a report reviewed by
                a person before delivery, with findings, available evidence and
                recommended changes.
              </p>
              <div className={styles.growthTags}>
                <span>SEO & GEO included</span>
                <span>Human review before delivery</span>
                <span>Expected within 24 hours</span>
              </div>
              <a
                className={styles.primary}
                href="/product-growth-report/"
                data-track-tool="product-growth-report"
                data-cta-placement="home-growth-report"
              >
                Explore the growth report{' '}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <p className={styles.dataNote}>
                Choose at least one paid service. Review your credit quote
                before submitting. You apply the recommendations.
              </p>
            </div>
            <div className={styles.growthOutline}>
              <span>FROM PRODUCT PAGE TO NEXT ACTION</span>
              <ol>
                <li>
                  <strong>Your product & market</strong>
                  <p>
                    Start with an Amazon listing or public store product page.
                  </p>
                </li>
                <li>
                  <strong>Your chosen analysis or creative services</strong>
                  <p>Focus on the questions and materials you need.</p>
                </li>
                <li>
                  <strong>A reviewed, downloadable delivery</strong>
                  <p>
                    Read your HTML report and download purchased PNG images.
                  </p>
                </li>
              </ol>
            </div>
          </div>
          <div className={styles.galleryBanner} id="free-product-listings">
            <div className={styles.galleryIcon}>
              <PackagePlus size={31} aria-hidden="true" />
            </div>
            <div className={styles.galleryCopy}>
              <p className={styles.freeBadge}>100% FREE LISTING & DISPLAY</p>
              <h3>
                A clearer page for your product.
                <br />
                Another source for AI discovery.
              </h3>
              <p>
                Publish reviewed product facts, images and your store link in
                the Product Gallery. Submission, review and approved display are
                completely free.
              </p>
              <small>
                Keep your existing checkout. Indexing, AI recommendations and
                traffic are not guaranteed.
              </small>
            </div>
            <div className={styles.galleryActions}>
              <a href={submit} data-showcase-submit-cta="root-home-feature">
                List your product for free <ArrowRight size={15} />
              </a>
              <a href={gallery}>
                Browse the Product Gallery <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <div
            className={styles.galleryExample}
            aria-labelledby="gallery-example-title"
          >
            <div className={styles.galleryJourney}>
              <p className={styles.eyebrow}>SEE WHAT YOU GET</p>
              <h3 id="gallery-example-title">
                From product facts to a public Gallery page.
              </h3>
              <ol>
                <li>
                  <strong>You provide</strong>
                  <span>
                    Your product link, accurate details and a clear product
                    image. No store connection required.
                  </span>
                </li>
                <li>
                  <strong>We review</strong>
                  <span>
                    Read editorial feedback on your private management page.
                    Publication follows approval.
                  </span>
                </li>
                <li>
                  <strong>Your product gets a public page</strong>
                  <span>
                    Approved listings bring product facts, images and a link to
                    your original store together in one crawlable page.
                  </span>
                </li>
              </ol>
              <p className={styles.galleryExampleNote}>
                Submission, review and approved display are completely free. A
                clearer source of product facts can support AI discovery;
                indexing, recommendations and traffic are not guaranteed.
              </p>
              <a href={submit} data-showcase-submit-cta="home-gallery-example">
                Create your free product page <ArrowRight size={15} />
              </a>
            </div>
            {publishedProduct && (
              <article className={styles.publishedExample}>
                <a
                  href={publishedProduct.href}
                  aria-label={`View ${publishedProduct.title}`}
                >
                  <img
                    src={publishedProduct.image}
                    alt={publishedProduct.title}
                    width="420"
                    height="320"
                    loading="lazy"
                  />
                </a>
                <div>
                  <span className={styles.publishedBadge}>
                    PUBLISHED GALLERY EXAMPLE
                  </span>
                  <h4>{publishedProduct.title}</h4>
                  <p>{publishedProduct.description}</p>
                  <a href={publishedProduct.href}>
                    See the real product page <ArrowUpRight size={14} />
                  </a>
                </div>
              </article>
            )}
          </div>
        </section>

        <section
          className={styles.pricingStrip}
          aria-labelledby="home-pricing-title"
        >
          <div>
            <p className={styles.eyebrow}>SUBSCRIPTIONS</p>
            <h2 id="home-pricing-title">Plans, credits, and what stays free.</h2>
            <p>
              Monthly and yearly plans share credits across API calls and video
              creation. Product Gallery submission, review, and approved display
              stay free.{' '}
              <a href="/pricing/">See plan details</a>
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
