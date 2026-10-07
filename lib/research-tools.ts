export type ResearchToolKind =
  | 'niche'
  | 'shopify'
  | 'keyword-gap'
  | 'tiktok-ads'
  | 'ai-readiness'
  | 'amazon-price'
  | 'supplier-price';

export type ResearchTool = {
  slug: string;
  kind: ResearchToolKind;
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  lead: string;
  question: string;
  method: string;
  limit: string;
  primaryApi: string;
  additionalApis: string[];
  preview: string[];
};

export const researchTools: ResearchTool[] = [
  {
    slug: 'amazon-niche-opportunity-evaluator',
    kind: 'niche',
    name: 'Amazon Niche Opportunity Evaluator',
    title: 'Amazon Niche Opportunity Evaluator | Nexscope',
    description: 'Compare Amazon niche demand, concentration, launches and return signals for one keyword. Bring your own API key.',
    eyebrow: 'AMAZON MARKET RESEARCH',
    headline: 'Is this Amazon niche worth a closer look?',
    lead: 'Search one local-market keyword and compare demand with concentration, launch and return signals. Review the underlying metrics rather than relying on a single score.',
    question: 'Which niche deserves deeper validation?',
    method: 'One Amazon Niche Info by Keyword request returns a bounded list of related niches. If data is returned, an LLM analysis request automatically interprets that sample.',
    limit: 'A niche snapshot does not prove profit, sourcing feasibility, or future demand. Missing fields remain unreported.',
    primaryApi: 'amazon-niche-info-by-keyword',
    additionalApis: [],
    preview: ['Niche demand and product count', 'Search volume and brand concentration', 'New-launch signals and AI Markdown report'],
  },
  {
    slug: 'shopify-competitor-store-snapshot',
    kind: 'shopify',
    name: 'Shopify Competitor Store Snapshot',
    title: 'Shopify Competitor Store Snapshot | Nexscope',
    description: 'Find Shopify stores by name or domain, compare available store metrics, and inspect matching products on demand.',
    eyebrow: 'SHOPIFY COMPETITOR RESEARCH',
    headline: 'Turn a store search into a competitor snapshot.',
    lead: 'Find a store, compare its reported catalogue, visits, orders and ads, then request product matches only for the store you choose.',
    question: 'What can a public Shopify store snapshot tell you?',
    method: 'Store Query produces candidates. An optional Product Query searches the selected store URL; the two requests are separate and may use credits.',
    limit: 'Provider metrics are estimates or snapshots, not verified merchant analytics. This is not continuous monitoring or a complete catalogue export.',
    primaryApi: 'shopify-store-query',
    additionalApis: ['shopify-product-query'],
    preview: ['Candidate stores and domains', 'Reported traffic, orders and ads', 'Optional matching products'],
  },
  {
    slug: 'amazon-keyword-exposure-gap',
    kind: 'keyword-gap',
    name: 'Amazon Keyword Exposure Gap',
    title: 'Amazon Keyword Exposure Gap | Nexscope',
    description: 'Compare two Amazon ASIN keyword samples to find competitor-only exposure and ranking gaps.',
    eyebrow: 'AMAZON KEYWORD INTELLIGENCE',
    headline: 'See where a competitor appears and you do not.',
    lead: 'Look up one ASIN, then deliberately load a competitor. Compare the returned keyword samples with search-volume and rank context.',
    question: 'Which competitor keywords merit review?',
    method: 'Each ASIN requires its own keyword request. The gap is computed only from the returned page-1 samples, not the whole marketplace.',
    limit: 'Absence from this bounded sample is not proof of zero impressions or no ranking. Check intent and listing relevance before targeting a phrase.',
    primaryApi: 'amazon-asin-keywords',
    additionalApis: [],
    preview: ['Your sampled keywords', 'Competitor-only sampled keywords', 'Search volume and organic/ad rank'],
  },
  {
    slug: 'tiktok-ad-product-evidence',
    kind: 'tiktok-ads',
    name: 'TikTok Ad & Product Evidence',
    title: 'TikTok Ad & Product Evidence | Nexscope',
    description: 'Search TikTok ads by keyword, inspect reported ad metrics, and load products associated with one ad on demand.',
    eyebrow: 'TIKTOK AD RESEARCH',
    headline: 'Connect an ad shortlist to product evidence.',
    lead: 'Review a small ad shortlist, then choose one ad to request its associated products. Keep ad performance and product-level claims separate.',
    question: 'Which ad is worth investigating next?',
    method: 'Ad Search returns a bounded page of ads. Ad Related Products is a separate request made only for an ad you select.',
    limit: 'An associated product is not proof that the ad caused sales. Provider metric units and freshness should be checked before comparing ads.',
    primaryApi: 'chuhaijiang-tiktok-ad-search',
    additionalApis: ['chuhaijiang-tiktok-ad-related-products'],
    preview: ['Ad headline and reported performance', 'Country and ad identifier', 'Optional associated products'],
  },
  {
    slug: 'ai-shopping-readiness-check',
    kind: 'ai-readiness',
    name: 'AI Shopping Readiness Check',
    title: 'AI Shopping Readiness Check | Nexscope',
    description: 'Inspect a public product page’s SEO evidence, then optionally sample one AI answer and its citations.',
    eyebrow: 'AI SEARCH & PAGE EVIDENCE',
    headline: 'Check the page before you claim AI visibility.',
    lead: 'Inspect a product page’s title, description, canonical and headings. If useful, separately sample one buyer question and its cited sources.',
    question: 'Does the page provide usable evidence for discovery?',
    method: 'Page SEO Details is the first request. A separate, higher-cost AI Search Citation Sample is optional and explicitly triggered.',
    limit: 'A sampled answer is not a rank tracker, index status check, or guarantee that your page appears for other users or prompts.',
    primaryApi: 'seo-page-evidence',
    additionalApis: ['seo-ai-search-citation-sample'],
    preview: ['Page title, description, canonical and H1', 'Coverage and missing reasons', 'Optional one-answer citation sample'],
  },
  {
    slug: 'amazon-product-price-checker',
    kind: 'amazon-price',
    name: 'Amazon Product Price Checker',
    title: 'Amazon Product Price Checker | Nexscope',
    description: 'Look up an Amazon ASIN and review its reported price, promotions, ratings, delivery and product details with your own API key.',
    eyebrow: 'AMAZON PRICE RESEARCH',
    headline: 'See the price an Amazon listing reports.',
    lead: 'Choose a marketplace and look up one ASIN. Review the reported price with promotions, buyer signals, delivery and available product details.',
    question: 'What price does this Amazon listing report?',
    method: 'One Amazon Product Detail API request looks up a single ASIN for 21 credits. If a matching listing returns, a separate LLM analysis request runs automatically; no margin calculation is performed.',
    limit: 'Prices can change with time, location, seller, delivery and promotions. An API snapshot is not a guaranteed checkout price.',
    primaryApi: 'amazon-product-detail',
    additionalApis: [],
    preview: ['Current price, previous price and promotions', 'Ratings, recent purchases and availability', 'Product details and AI Markdown report'],
  },
  {
    slug: '1688-wholesale-price-finder',
    kind: 'supplier-price',
    name: '1688 Wholesale Price Finder',
    title: '1688 Wholesale Price Finder | Nexscope',
    description: 'Search 1688 wholesale listings by Simplified Chinese product term and review reported prices, MOQ and supplier details with your own API key.',
    eyebrow: '1688 SOURCING PRICES',
    headline: 'Compare prices from 1688 supplier listings.',
    lead: 'Search one product term in Simplified Chinese, then inspect a bounded shortlist of reported wholesale prices and minimum orders.',
    question: 'What wholesale prices do 1688 listings report?',
    method: 'One 1688 Product Search API request returns up to 10 candidates for 12 credits. If usable listings return, a separate LLM analysis request runs automatically; no margin calculation is performed.',
    limit: 'A listed price is not a negotiated quote. Quantity tiers, currency, shipping, supplier reliability and product equivalence require verification.',
    primaryApi: '1688-product-search',
    additionalApis: [],
    preview: ['Wholesale and dropship prices', 'Minimum order quantity and supplier details', 'AI Markdown sourcing report'],
  },
];

export const getResearchTool = (slug: string) => researchTools.find((tool) => tool.slug === slug);
