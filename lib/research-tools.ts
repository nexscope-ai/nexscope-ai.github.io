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

// Only these tools are published as static routes; deferred implementations stay unlisted.
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
