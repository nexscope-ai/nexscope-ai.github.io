import {
  amazonReviewMarkets,
  productDemandMarkets,
  searchVisibilityMarkets,
  shopifyFilterMarkets,
  sourcingValidationMarkets,
  type MarketNode,
} from '@/lib/market-coverage';

export type ApiCapability = {
  slug: string;
  name: string;
  description: string;
  outputs: string[];
};

export type { MarketNode } from '@/lib/market-coverage';

export type Guide = {
  id: string;
  slug: string;
  category:
    | 'Product Research'
    | 'Shopify Intelligence'
    | 'SEO & AI Visibility'
    | 'Customer Insights'
    | 'Sourcing';
  date: string;
  title: string;
  summary: string;
  signal: string;
  readingTime: string;
  featured?: boolean;
  keywords: string[];
  problemPoints: string[];
  dataAnswers: string[];
  workflow: string[];
  nexscopePrompt: string;
  apiCapabilities: ApiCapability[];
  mapTitle: string;
  mapSummary: string;
  mapBadge: string;
  mapDisclaimer: string;
  marketNodes: MarketNode[];
};

export const guides: Guide[] = [
  {
    id: '01',
    slug: 'ecommerce-product-demand-validation',
    category: 'Product Research',
    date: '2026.09.11',
    title: 'How to validate ecommerce product demand before you invest',
    summary:
      'A practical product-research workflow for comparing demand, competition, pricing, reviews, and growth signals before committing inventory or advertising budget.',
    signal: 'Validate before you buy',
    readingTime: '7 min read',
    featured: true,
    keywords: [
      'ecommerce product research',
      'product demand validation',
      'Amazon market research API',
      'winning product research',
    ],
    problemPoints: [
      'A high sales estimate can reflect a mature, expensive market rather than an opportunity a new seller can enter.',
      'Demand, seller density, price, margin, review depth, and search momentum often live in different tools and cannot be compared consistently.',
      'Teams commit to samples, inventory, and ads before defining the evidence that would make a product worth testing.',
    ],
    dataAnswers: [
      'Start at market level. Compare category revenue, seller and brand concentration, new-product share, average price, ratings, BSR, and estimated margin before looking at individual listings.',
      'Then move to product candidates. Filter by sales, revenue, review count, rating, price, listing quality, seller type, click growth, and conversion indicators. Use search-interest history as supporting evidence—not as proof of marketplace sales.',
      'For shortlisted ASINs, compare historical price, promotions, Buy Box, BSR, seller count, rating, reviews, and daily sales estimates. A one-day snapshot cannot show whether a product is durable or temporarily boosted.',
      'A strong candidate is not simply popular. It has enough demand, a realistic price and margin window, evidence of recent entry, and a weakness you can address in the product or offer.',
    ],
    workflow: [
      'Write an entry thesis: target market, price band, minimum margin, maximum review barrier, and the customer problem you intend to solve.',
      'Screen category markets first, then shortlist products that fit the thesis instead of searching for a single “winning product.”',
      'Compare marketplace demand with search-interest direction, then inspect price, BSR, seller-count, and sales history for shortlisted ASINs. Remove candidates supported by only one metric.',
      'Save the evidence and define a small validation test before ordering inventory or increasing ad spend.',
    ],
    nexscopePrompt:
      'Compare product opportunities for my target keyword. Rank the markets by demand, competition, new-product share, price, reviews, growth, and margin signals, then explain which assumptions still need testing.',
    apiCapabilities: [
      {
        slug: 'amazon-market-research',
        name: 'Amazon Market Research API',
        description:
          'Screen Amazon category markets by size, concentration, seller structure, new-product share, price, rating, BSR, and margin ranges.',
        outputs: ['Market size', 'Seller density', 'New-product share'],
      },
      {
        slug: 'amazon-product-discovery',
        name: 'Amazon Product Discovery API',
        description:
          'Find keyword-based product candidates using click growth, conversion, pricing, review, and profitability indicators.',
        outputs: ['Click growth', 'Conversion signals', 'Product economics'],
      },
      {
        slug: 'amazon-product-database',
        name: 'Amazon Product Database API',
        description:
          'Filter products across supported Amazon marketplaces by price, sales, revenue, reviews, rating, BSR, listing quality, and seller type.',
        outputs: ['Sales and revenue', 'Reviews and rating', 'Listing quality'],
      },
      {
        slug: 'google-trends-by-keywords',
        name: 'Google Trends Keyword API',
        description:
          'Compare how search interest changes over time and across regions as a supporting demand signal.',
        outputs: [
          'Interest over time',
          'Regional demand',
          'Keyword comparison',
        ],
      },
      {
        slug: 'amazon-product-price-series',
        name: 'Amazon Product Price Series API',
        description:
          'Validate shortlisted ASINs with historical price, promotion, Buy Box, BSR, seller-count, rating, review-count, and monthly-sold observations.',
        outputs: [
          'Price and promotion history',
          'BSR history',
          'Seller changes',
        ],
      },
      {
        slug: 'amazon-sales-estimates',
        name: 'Amazon Sales Estimates API',
        description:
          'Compare day-level sales estimates and the last known price across supported Amazon marketplaces.',
        outputs: [
          'Daily sales estimates',
          'Last known price',
          'Date-range comparison',
        ],
      },
    ],
    mapTitle: '18 demand regions, with coverage shown by signal',
    mapSummary:
      'Google Trends provides the shared 18-region demand layer. Amazon coverage is narrower and is labeled separately for discovery, catalog, sales, and price-history research.',
    mapBadge: '18 explicit Trend regions',
    mapDisclaimer:
      'Coverage varies by API. The map labels the strongest verified signal available for each region; it does not imply every Amazon endpoint is available in all 18 regions.',
    marketNodes: productDemandMarkets,
  },
  {
    id: '02',
    slug: 'shopify-competitor-product-research',
    category: 'Shopify Intelligence',
    date: '2026.09.11',
    title: 'How to research Shopify stores, products, and competitors',
    summary:
      'Use external Shopify market signals to benchmark products and stores by pricing, weekly sales, ads, traffic, assortment, and growth—without confusing competitor estimates with your own analytics.',
    signal: 'Build a market benchmark',
    readingTime: '6 min read',
    keywords: [
      'Shopify competitor research',
      'Shopify product research',
      'Shopify store analysis',
      'Shopify winning products',
    ],
    problemPoints: [
      'Your own Shopify dashboard shows what happened in your store, but it does not explain how your price, assortment, or advertising activity compares with the market.',
      'Manual competitor research produces a few memorable examples instead of a repeatable peer set.',
      'Product, store, ad, traffic, and social signals are often copied into spreadsheets at different times and lose their context.',
    ],
    dataAnswers: [
      'Product-level research can filter Shopify listings by keyword or URL, price, weekly sales, listing date, Facebook ad activity, store competition, supplier availability, and shipping country.',
      'Store-level research can compare country, store age, product count, ad count, estimated monthly visits and orders, social followers, categories, and activity status.',
      'These are external market-intelligence signals. Use them to build hypotheses and peer groups; use Shopify Analytics and your measurement stack for your own conversion and revenue truth.',
    ],
    workflow: [
      'Define a peer group by category, country, price band, and store maturity before comparing performance.',
      'Identify products with sustained weekly sales or revenue growth, then inspect how many stores sell them and whether paid ads are active.',
      'Compare assortment size, traffic, order estimates, ad counts, and social reach across the shortlisted stores.',
      'Turn the differences into tests for positioning, price, assortment, or creative—not claims about causal performance.',
    ],
    nexscopePrompt:
      'Find Shopify stores and products in my category and country. Compare price, weekly sales, revenue growth, competition, ads, assortment, visits, and order estimates, then identify the most useful benchmarks for my store.',
    apiCapabilities: [
      {
        slug: 'shopify-product-query',
        name: 'Shopify Product Query API',
        description:
          'Filter standalone-store products by keyword, URL, price, weekly sales, listing date, Facebook ads, competition, supplier availability, and country.',
        outputs: ['Weekly sales', 'Revenue growth', 'Competition and ads'],
      },
      {
        slug: 'shopify-store-query',
        name: 'Shopify Store Query API',
        description:
          'Research stores by domain, country, age, assortment, ad activity, estimated visits and orders, and social reach.',
        outputs: [
          'Store profile',
          'Traffic and order estimates',
          'Ad and social signals',
        ],
      },
    ],
    mapTitle: 'Country filters for consistent Shopify comparisons',
    mapSummary:
      'Shopify product and store research accepts a country-code filter. These 18 markets are practical comparison examples, not a closed platform coverage list.',
    mapBadge: 'Open country filter',
    mapDisclaimer:
      'The public Shopify API contract accepts a country code but does not publish a fixed country enum. These markers are filter examples and research contexts, not guaranteed exhaustive coverage.',
    marketNodes: shopifyFilterMarkets,
  },
  {
    id: '03',
    slug: 'ecommerce-seo-ai-search-visibility',
    category: 'SEO & AI Visibility',
    date: '2026.09.11',
    title: 'How to diagnose ecommerce SEO and AI search visibility',
    summary:
      'Separate technical indexation checks from regional demand and AI-discovery research, then inspect how commercial queries appear in Google AI Mode.',
    signal: 'Measure discovery, then diagnose',
    readingTime: '7 min read',
    keywords: [
      'ecommerce SEO audit',
      'AI search visibility',
      'Google AI Mode ecommerce',
      'product visibility API',
    ],
    problemPoints: [
      'A store can earn impressions without meaningful clicks or sales, but that does not reveal whether the constraint is indexation, search demand, answer-engine visibility, or the offer itself.',
      'Traditional rank checks miss product recommendations and citations inside AI-generated answers, while AI screenshots are too inconsistent to benchmark manually.',
      'No external market API can prove why Google did not index a page. Canonicals, robots rules, redirects, rendering, and crawl errors require Google Search Console and a technical crawler.',
    ],
    dataAnswers: [
      'Google AI Mode results can reveal answer text, cited domains, shopping elements, product cards, and the sources surfaced for a commercial query.',
      'Google Trends adds interest-over-time and regional context. It helps distinguish weak demand from weak visibility, but it is not a substitute for Search Console clicks, impressions, or indexing reports.',
      'The current Google AI Mode API accepts a keyword but does not publish a region selector. Treat each response as a discovery snapshot and keep regional demand analysis separate.',
    ],
    workflow: [
      'Use Search Console and a technical crawler first to verify indexation, canonical selection, robots directives, redirects, rendering, structured data, and crawl errors.',
      'Build a stable query set around category terms, product problems, comparisons, and purchase questions in each target market.',
      'Compare search-interest direction with Google AI Mode answers, citations, and product cards. Save dated snapshots if you need to compare changes over time.',
      'Turn gaps into specific tests for page structure, product evidence, FAQs, entity clarity, and third-party mentions, then remeasure the same query set.',
    ],
    nexscopePrompt:
      'Inspect Google AI Mode results for my commercial query set. Compare answers, citations, shopping elements, product cards, and regional search-interest direction, then separate content opportunities from technical SEO checks I must verify elsewhere.',
    apiCapabilities: [
      {
        slug: 'google-ai-mode-search',
        name: 'Google AI Mode Search API',
        description:
          'Inspect Google AI Mode answers, cited sources, shopping elements, and product cards for commercial queries.',
        outputs: [
          'AI answer text',
          'Cited domains',
          'Shopping and product elements',
        ],
      },
      {
        slug: 'google-trends-by-keywords',
        name: 'Google Trends Keyword API',
        description:
          'Compare search-interest direction across time and regions to add demand context to visibility research.',
        outputs: [
          'Interest over time',
          'Regional demand',
          'Keyword comparison',
        ],
      },
    ],
    mapTitle: '18 explicit regions for demand context',
    mapSummary:
      'Use regional Google Trends data to establish demand context, then inspect Google AI Mode separately for the same commercial intent.',
    mapBadge: '18 explicit Trend regions',
    mapDisclaimer:
      'These are Google Trends regions. The current Google AI Mode Search API accepts a keyword but does not publish a region selector, so this map does not claim region-specific AI Mode coverage.',
    marketNodes: searchVisibilityMarkets,
  },
  {
    id: '04',
    slug: 'amazon-review-customer-insights',
    category: 'Customer Insights',
    date: '2026.09.11',
    title: 'How to turn Amazon reviews into customer insights',
    summary:
      'Move beyond average star ratings by separating recurring complaints, positive outcomes, purchase objections, and product-improvement opportunities.',
    signal: 'Read the market in customer language',
    readingTime: '6 min read',
    keywords: [
      'Amazon review analysis',
      'customer pain point analysis',
      'competitor review research',
      'Amazon reviews API',
    ],
    problemPoints: [
      'Average ratings hide the difference between a rare defect and a recurring customer problem.',
      'Teams copy a handful of dramatic reviews into a brief without checking frequency, star level, recency, or verified-purchase status.',
      'Insights stay disconnected from product requirements, listing copy, support content, and creative testing.',
    ],
    dataAnswers: [
      'ASIN-level review data can be filtered by star rating, keyword, recency or helpfulness, verified purchase, and media presence across supported Amazon marketplaces.',
      'Niche-level review analysis organizes positive and negative themes by keyword, including topic, mention share, and example language for supported markets.',
      'The goal is not automated sentiment alone. It is a traceable connection between a repeated customer statement and a product, content, or service decision.',
    ],
    workflow: [
      'Collect a balanced sample across star ratings and separate verified purchases, recent reviews, and media-backed evidence.',
      'Cluster repeated problems, desired outcomes, comparison language, and common questions without removing the original examples.',
      'Compare your product with category-level themes to distinguish brand-specific issues from market-wide expectations.',
      'Translate the strongest themes into product fixes, listing proof, FAQs, and testable creative angles.',
    ],
    nexscopePrompt:
      'Analyze reviews for this ASIN and its niche. Separate recurring complaints, desired outcomes, objections, and positive proof, show supporting examples, and turn the strongest themes into product and listing actions.',
    apiCapabilities: [
      {
        slug: 'amazon-reviews-list',
        name: 'Amazon Product Reviews API',
        description:
          'Retrieve reviews for one ASIN with star, keyword, sort, verified-purchase, and media filters across supported marketplaces.',
        outputs: [
          'Review text and rating',
          'Verified and Vine flags',
          'Helpful and media signals',
        ],
      },
      {
        slug: 'amazon-niche-reviews-by-keyword',
        name: 'Amazon Niche Reviews API',
        description:
          'Analyze positive and negative review topics for a keyword-defined niche, with mention share and representative examples.',
        outputs: [
          'Review topics',
          'Mention share',
          'Positive and negative examples',
        ],
      },
    ],
    mapTitle: '15 verified Amazon review regions',
    mapSummary:
      'Product review retrieval spans 15 Amazon regions. Niche-level review analysis is currently narrower and is labeled separately.',
    mapBadge: '15 explicit review regions',
    mapDisclaimer:
      'Product review coverage is available for the 15 regions shown. Niche review analysis is explicitly available for the United States, Germany, and Japan.',
    marketNodes: amazonReviewMarkets,
  },
  {
    id: '05',
    slug: '1688-supplier-product-sourcing',
    category: 'Sourcing',
    date: '2026.09.11',
    title: 'How to find and compare 1688 suppliers with product data',
    summary:
      'Search by keyword or image, compare wholesale and dropship pricing, minimum order quantity, sales, supplier identity, and delivery signals before contacting a factory.',
    signal: 'Connect demand to supply',
    readingTime: '7 min read',
    keywords: [
      '1688 supplier search',
      '1688 image search API',
      'global product sourcing',
      'find supplier by image',
    ],
    problemPoints: [
      'A product idea found on Amazon, TikTok, or Shopify still requires a separate supplier search with unfamiliar language, pricing tiers, and seller signals.',
      'The cheapest visible price may apply only at a high quantity and may not match the dropship, customization, or delivery requirement.',
      'Visual matches are reviewed manually, making it difficult to compare similar products and supplier credibility at scale.',
    ],
    dataAnswers: [
      'Keyword search can compare wholesale price, dropship price, quantity tiers, minimum order quantity, orders, units sold, estimated sales, supplier type, verification, services, and delivery filters.',
      'Image search can find visually similar products and return price, minimum order quantity, monthly sales, repurchase rate, trade score, service score, seller identity, and dispatch location.',
      'Bestseller billboard data adds a sourcing-discovery layer, but supplier qualification still requires direct verification, samples, commercial terms, and compliance checks.',
    ],
    workflow: [
      'Translate the product requirement into material, dimensions, target cost, minimum order quantity, customization, and delivery constraints.',
      'Run both keyword and image searches so naming differences do not hide visually comparable supplier products.',
      'Shortlist suppliers using total unit economics, order thresholds, sales evidence, seller identity, service, and dispatch signals.',
      'Request samples and verify product, company, compliance, capacity, and terms before making a purchase decision.',
    ],
    nexscopePrompt:
      'Find 1688 supplier products matching this reference and requirement. Compare wholesale and dropship price, MOQ, sales, repurchase, supplier identity, service, and delivery signals, then create a shortlist for manual verification.',
    apiCapabilities: [
      {
        slug: '1688-product-search',
        name: '1688 Product Search API',
        description:
          'Search products and suppliers with price, dropship, sales, MOQ, company, verification, service, and delivery filters.',
        outputs: [
          'Wholesale and dropship price',
          'MOQ and sales',
          'Supplier identity',
        ],
      },
      {
        slug: '1688-search-by-image',
        name: '1688 Search by Image API',
        description:
          'Find visually similar supplier products from an image and compare commercial and seller signals.',
        outputs: [
          'Visual matches',
          'Repurchase and trade score',
          'Dispatch and seller data',
        ],
      },
      {
        slug: '1688-product-billboard',
        name: '1688 Product Billboard API',
        description:
          'Query 1688 bestseller rankings to discover active wholesale product and sourcing directions.',
        outputs: [
          'Bestseller rankings',
          'Product discovery',
          'Sourcing signals',
        ],
      },
    ],
    mapTitle: '12 destination contexts to validate after sourcing',
    mapSummary:
      'Use supplier data to build a shortlist, then validate demand, samples, commercial terms, logistics, and compliance in representative destination markets.',
    mapBadge: 'Destination contexts',
    mapDisclaimer:
      'The sourcing APIs return product, supplier, pricing, MOQ, sales, and dispatch data; they do not expose a destination-market region filter. These 12 markers are validation contexts, not API coverage.',
    marketNodes: sourcingValidationMarkets,
  },
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
