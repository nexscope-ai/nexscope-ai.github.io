export type Trend = {
  id: string;
  slug: string;
  category: 'AI Commerce' | 'Industry Report' | 'Growth Strategy';
  date: string;
  source: string;
  sourceUrl: string;
  title: string;
  summary: string;
  signal: string;
  score: number;
  readingTime: string;
  featured?: boolean;
  whatChanged: string[];
  whyItMatters: string[];
  actions: string[];
  nexscopePrompt: string;
  mapTitle: string;
  mapSummary: string;
  marketNodes: MarketNode[];
};

export type MarketNode = {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  role: string;
};

export const trends: Trend[] = [
  {
    id: '01',
    slug: 'ai-agents-move-to-checkout',
    category: 'AI Commerce',
    date: '2026.09.08',
    source: 'Mastercard',
    sourceUrl:
      'https://www.mastercard.com/global/en/news-and-trends/stories/2026/future-of-shopping-and-payments.html',
    title: 'AI agents are moving from “help me choose” to “buy it for me”',
    summary:
      'Payment networks are building the trust, authorization, and security rails for agent-led transactions. For sellers, structured product data that AI can discover and understand is becoming a new traffic channel.',
    signal: 'High-growth signal',
    score: 89,
    readingTime: '4 min read',
    featured: true,
    whatChanged: [
      'AI shopping is moving beyond product recommendations toward transactions completed on a shopper’s behalf.',
      'Payment providers are defining the permissions, identity checks, and controls needed for agent-led purchases.',
      'The shopping interface is shifting from a list of links to a conversation that can move all the way to checkout.',
    ],
    whyItMatters: [
      'AI agents need clean, structured, and current product information to compare options with confidence. Missing attributes, inconsistent pricing, or unclear availability can remove a product from consideration before a shopper ever sees a product page.',
      'This creates a new layer of commerce visibility. Sellers will need to monitor not only search rank and ad position, but also when and why their products appear in AI-generated answers.',
    ],
    actions: [
      'Audit your highest-value listings for complete attributes, current pricing, inventory, and unambiguous product claims.',
      'Test the questions buyers ask AI before purchasing in your category, then compare which products are recommended.',
      'Map your product data to the use cases, constraints, and comparison criteria that matter most in purchase decisions.',
    ],
    nexscopePrompt:
      'Analyze fast-growing products in my category and show the product attributes, pricing signals, and customer pain points that could influence an AI shopping recommendation.',
    mapTitle: 'Where agent-led commerce may surface first',
    mapSummary:
      'An editorial watch map for payment infrastructure, cross-border adoption, and APAC commerce operations.',
    marketNodes: [
      {
        city: 'New York',
        region: 'North America',
        latitude: 40.71,
        longitude: -74.01,
        role: 'Payment infrastructure',
      },
      {
        city: 'London',
        region: 'Europe',
        latitude: 51.51,
        longitude: -0.13,
        role: 'Cross-border adoption',
      },
      {
        city: 'Singapore',
        region: 'Southeast Asia',
        latitude: 1.35,
        longitude: 103.82,
        role: 'Commerce operations',
      },
    ],
  },
  {
    id: '02',
    slug: 'new-commerce-data-content-ai-era',
    category: 'Industry Report',
    date: '2026.08.29',
    source: 'CAC China',
    sourceUrl: 'https://www.cac.gov.cn/2026-08/29/c_1789665114197079.htm',
    title: 'New commerce enters the “data × content × AI” era',
    summary:
      'China’s 2026 New Ecommerce Development Report highlights new business models, regional shifts, and industry standards. Trend analysis now needs to connect attention with product, market, and content data.',
    signal: 'Structural opportunity',
    score: 82,
    readingTime: '5 min read',
    whatChanged: [
      'China’s new ecommerce agenda now spans platform innovation, regional ecosystems, governance, and emerging operating models.',
      'AI is becoming part of the commerce infrastructure rather than a standalone content-production tool.',
      'Growth increasingly depends on connecting market signals with the content and operational systems that can act on them.',
    ],
    whyItMatters: [
      'A viral topic is not automatically a product opportunity. Teams need to connect attention data with marketplace demand, competitor density, customer feedback, and creative performance before acting.',
      'The advantage shifts toward sellers who can shorten the loop between detecting a market change, validating it, and publishing relevant product content.',
    ],
    actions: [
      'Create a repeatable weekly review that combines platform news with product, keyword, price, and competitor signals.',
      'Separate short-lived content spikes from structural category growth before committing inventory or ad budget.',
      'Build a shared evidence trail so product, content, and advertising teams act on the same market picture.',
    ],
    nexscopePrompt:
      'Compare recent demand, competition, pricing, and review signals for three products in my target category, then rank the opportunities by evidence strength.',
    mapTitle: 'China’s data, content, and commerce corridor',
    mapSummary:
      'Monitoring nodes for policy direction, platform ecosystems, merchant operations, and cross-border spillover.',
    marketNodes: [
      {
        city: 'Beijing',
        region: 'North China',
        latitude: 39.9,
        longitude: 116.4,
        role: 'Policy and standards',
      },
      {
        city: 'Hangzhou',
        region: 'East China',
        latitude: 30.27,
        longitude: 120.15,
        role: 'Platform ecosystem',
      },
      {
        city: 'Shenzhen',
        region: 'South China',
        latitude: 22.54,
        longitude: 114.06,
        role: 'Merchant operations',
      },
      {
        city: 'Singapore',
        region: 'Southeast Asia',
        latitude: 1.35,
        longitude: 103.82,
        role: 'Cross-border signal',
      },
    ],
  },
  {
    id: '03',
    slug: 'conversational-product-discovery',
    category: 'AI Commerce',
    date: '2026.03.24',
    source: 'OpenAI',
    sourceUrl:
      'https://openai.com/index/powering-product-discovery-in-chatgpt/',
    title: 'Conversational product discovery is rewriting the storefront',
    summary:
      'Shopping search is becoming more visual and contextual. Beyond keyword rank, product attributes, review signals, and trustworthy data will influence what AI recommends.',
    signal: 'New traffic channel',
    score: 86,
    readingTime: '4 min read',
    whatChanged: [
      'Product discovery in ChatGPT is becoming richer, more visual, and better connected to a shopper’s intent.',
      'Consumers can move from an open-ended need to a shortlist without translating that need into rigid search keywords.',
      'Product feeds and merchant data have a larger role in how accurately products are understood and presented.',
    ],
    whyItMatters: [
      'A product page is no longer the guaranteed first impression. An AI-generated comparison may frame the category, define the criteria, and create the shortlist before a shopper visits a store.',
      'Brands need content that answers real questions clearly and product data that supports factual, confident recommendations across many shopping contexts.',
    ],
    actions: [
      'Identify the natural-language questions customers ask before they know your brand or exact product type.',
      'Make differentiators, compatibility, sizing, materials, and use cases explicit in product data and page copy.',
      'Track which competitors appear in AI shopping answers and study the evidence supporting those recommendations.',
    ],
    nexscopePrompt:
      'Check the AI visibility of my product category, identify recurring comparison criteria, and show which competing products are most often positioned as strong options.',
    mapTitle: 'Markets to monitor for conversational discovery',
    mapSummary:
      'A watch map for launch activity and shopper adoption across North America, Europe, and Asia-Pacific.',
    marketNodes: [
      {
        city: 'San Francisco',
        region: 'North America',
        latitude: 37.77,
        longitude: -122.42,
        role: 'Product launch signal',
      },
      {
        city: 'London',
        region: 'Europe',
        latitude: 51.51,
        longitude: -0.13,
        role: 'Shopper behavior',
      },
      {
        city: 'Sydney',
        region: 'Asia-Pacific',
        latitude: -33.87,
        longitude: 151.21,
        role: 'Adoption watch',
      },
    ],
  },
  {
    id: '04',
    slug: 'ucp-ai-shopping-infrastructure',
    category: 'Growth Strategy',
    date: '2026.01.11',
    source: 'Google',
    sourceUrl:
      'https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/',
    title: 'UCP makes products easier to discover and buy through AI',
    summary:
      'Google and its retail partners introduced a common protocol for product discovery, checkout, and post-purchase support. Sellers need product data that machines can reliably understand.',
    signal: 'Infrastructure shift',
    score: 80,
    readingTime: '5 min read',
    whatChanged: [
      'Google introduced the Universal Commerce Protocol with support from a broad group of commerce and retail companies.',
      'The protocol is designed to help AI agents interact with commerce systems across discovery, checkout, and post-purchase tasks.',
      'Merchant data is becoming the bridge between conversational interfaces and the systems that complete a transaction.',
    ],
    whyItMatters: [
      'Commerce protocols can reduce the friction of connecting each retailer to each AI experience separately. That can accelerate the number of places where a product is discoverable and purchasable through an agent.',
      'For sellers, the strategic work starts with data quality: consistent identifiers, complete attributes, reliable availability, and policies that an automated system can interpret.',
    ],
    actions: [
      'Review product feeds for missing fields, inconsistent identifiers, stale availability, and variant confusion.',
      'Prioritize structured data for products with high demand but weak conversion or incomplete merchandising.',
      'Document fulfillment, returns, and customer-support policies in clear language that automated systems can use.',
    ],
    nexscopePrompt:
      'Audit the market data and listing structure for my target products, then identify missing attributes and information gaps that could reduce discoverability in AI shopping experiences.',
    mapTitle: 'The emerging UCP adoption landscape',
    mapSummary:
      'Monitoring nodes for protocol development, retail adoption, and high-scale mobile commerce markets.',
    marketNodes: [
      {
        city: 'Mountain View',
        region: 'North America',
        latitude: 37.39,
        longitude: -122.08,
        role: 'Protocol development',
      },
      {
        city: 'Toronto',
        region: 'North America',
        latitude: 43.65,
        longitude: -79.38,
        role: 'Retail adoption',
      },
      {
        city: 'London',
        region: 'Europe',
        latitude: 51.51,
        longitude: -0.13,
        role: 'Commerce ecosystem',
      },
      {
        city: 'New Delhi',
        region: 'South Asia',
        latitude: 28.61,
        longitude: 77.21,
        role: 'Mobile commerce scale',
      },
    ],
  },
];

export const filters = [
  'All',
  'AI Commerce',
  'Industry Report',
  'Growth Strategy',
];

export function getTrendBySlug(slug: string) {
  return trends.find((trend) => trend.slug === slug);
}
