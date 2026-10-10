export type ResearchToolKind =
  | 'niche'
  | 'shopify'
  | 'keyword-gap'
  | 'tiktok-ads'
  | 'ai-readiness'
  | 'amazon-price'
  | 'supplier-price'
  | 'price-history'
  | 'asin-gap'
  | 'ai-shopping-check'
  | 'tiktok-momentum'
  | 'sourcing-demand';

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
  answer?: string;
  faqs?: { question: string; answer: string }[];
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
  {
    slug: 'amazon-price-history-analyzer', kind: 'price-history',
    name: 'Amazon Price History Analyzer', title: 'Amazon Price History Analyzer | Nexscope',
    description: 'Inspect observed Amazon price changes, discounts and seller signals over a selected period. Bring your own API key.',
    eyebrow: 'AMAZON PRICE HISTORY', headline: 'Was this Amazon price really a deal?',
    lead: 'Look beyond today’s price. Generate an AI report from dated price, deal and seller-count observations for one ASIN.',
    question: 'How has this ASIN’s reported price changed?',
    method: 'One Amazon Product Price Series request returns dated observations, followed automatically by a separate AI analysis when usable data is available. No continuous daily prices are invented.',
    limit: 'Returned observations may be sparse or outside the requested window. The lowest observed price is not automatically a promotion.',
    primaryApi: 'amazon-product-price-series', additionalApis: [],
    preview: ['Dated price evidence', 'AI Markdown trend report', 'Sparse observations clearly qualified'],
    answer: 'This tool checks timestamped price, Buy Box, deal and seller-count observations for one Amazon ASIN. It helps you compare observed highs and lows in a selected period, but sparse observations cannot prove the price on every intervening day or show that a discount caused a sales change.',
    faqs: [
      { question: 'Does the lowest observed price prove there was a promotion?', answer: 'No. It is the lowest value in the returned observations. Confirm the timestamp, offer type and any separately reported deal signal before calling it a promotion.' },
      { question: 'Is monthlySold a daily sales count?', answer: 'No. It is a provider-reported rolling monthly estimate at an observation point, not units sold on that date.' },
      { question: 'Will this tool fill gaps between price observations?', answer: 'No. The report uses returned timestamps only and does not invent a continuous daily price series.' },
    ],
  },
  {
    slug: 'reverse-asin-keyword-gap', kind: 'asin-gap',
    name: 'Reverse ASIN Keyword Gap', title: 'Reverse ASIN Keyword Gap | Nexscope',
    description: 'Compare two Amazon ASIN keyword samples to find competitor-only terms, ranks and search demand.',
    eyebrow: 'AMAZON KEYWORD GAP', headline: 'Which search terms does a rival ASIN appear for?',
    lead: 'Compare bounded reverse-ASIN keyword samples for your listing and one competitor in a concise AI report.',
    question: 'Which competitor terms are absent from my sample?',
    method: 'Two sequential Amazon ASIN Keywords requests retrieve the first ten terms for each ASIN. After both return, a separate AI analysis compares only the sampled rows.',
    limit: 'A missing term in a bounded API sample does not prove the listing has zero visibility for that term.',
    primaryApi: 'amazon-asin-keywords', additionalApis: [],
    preview: ['Competitor-only sampled terms', 'AI Markdown comparison report', 'Sample size and ranking caveats'],
    answer: 'This tool compares the first ten returned reverse-ASIN keyword rows for your listing and one competitor. It identifies terms appearing only in the competitor sample and reports available rank and search-demand fields. A term missing from your sample is a research lead, not proof that your ASIN never ranks for it.',
    faqs: [
      { question: 'Does a competitor-only term prove my listing has no visibility?', answer: 'No. Each request is a bounded first-page sample. A missing row may appear on another page or in another reporting period.' },
      { question: 'How many keyword rows are compared?', answer: 'The page requests up to ten rows per ASIN. The report states the returned sample counts and compares only those rows.' },
      { question: 'Is the AI report a complete keyword audit?', answer: 'No. Use the reported ranks and search fields as leads, then validate promising terms with a broader keyword export or listing research.' },
    ],
  },
  {
    slug: 'ai-shopping-product-data-checker', kind: 'ai-shopping-check',
    name: 'AI Shopping Product Data Checker', title: 'AI Shopping Product Data Checker | Nexscope',
    description: 'Review public product-page evidence and optionally sample one AI shopping answer and citations.',
    eyebrow: 'AI SHOPPING READINESS', headline: 'What can AI shopping systems read on this page?',
    lead: 'Check collected product-page evidence first, then optionally sample one buyer question to inspect answer citations.',
    question: 'Is the product page supplying reviewable evidence?',
    method: 'Page Evidence collects a bounded snapshot, then a separate AI analysis generates the report. An optional AI Search Citation Sample may consume substantially more credits.',
    limit: 'A page snapshot and one answer sample do not prove ongoing AI visibility, ranking or Merchant Center eligibility.',
    primaryApi: 'seo-page-evidence', additionalApis: ['seo-ai-search-citation-sample'],
    preview: ['Page evidence and missing fields', 'AI Markdown readiness report', 'Optional answer and citation sample'],
    answer: 'This tool reviews a collected snapshot of a public product page, including returned metadata and detectable Product JSON-LD in the supplied HTML. You can separately request one AI answer-and-citation sample. Neither result proves continuous AI visibility, live-page eligibility or future citations.',
    faqs: [
      { question: 'Does missing Product JSON-LD mean the live page has no structured data?', answer: 'No. Detection is limited to the HTML returned in the collected snapshot. Other formats or JavaScript-rendered content may not be included.' },
      { question: 'Does one AI answer sample establish visibility?', answer: 'No. Answers can vary with question wording, time, location and model. Treat the optional citation request as one observation, not a ranking or tracking report.' },
      { question: 'Can I check a private or local page?', answer: 'No. This page accepts a public HTTP or HTTPS URL and rejects local addresses, IP addresses, credentials and custom ports.' },
    ],
  },
  {
    slug: 'tiktok-shop-bestseller-momentum', kind: 'tiktok-momentum',
    name: 'TikTok Shop Bestseller Momentum', title: 'TikTok Shop Bestseller Momentum | Nexscope',
    description: 'Inspect a dated TikTok Shop top-selling product list with reported unit sales, GMV and growth signals.',
    eyebrow: 'TIKTOK SHOP MOMENTUM', headline: 'Which TikTok Shop products are moving now?',
    lead: 'Select a market and ranking period. Compare top-selling products by the provider’s reported units, GMV and growth.',
    question: 'Which ranked products show sales momentum?',
    method: 'One TikTok Top Selling Products request retrieves up to ten ranked products, followed automatically by a separate AI analysis when usable data is available.',
    limit: 'A ranking snapshot is not a sales forecast or proof of causal video performance.',
    primaryApi: 'tiktok-top-selling-products', additionalApis: [],
    preview: ['Dated top-selling products', 'AI Markdown momentum report', 'Unit sales, GMV and growth caveats'],
    answer: 'This tool analyzes a dated TikTok Shop top-selling product sample for the selected market and period. It keeps period-specific unit sales and GMV separate from all-time totals, then identifies patterns in the returned ranking. A snapshot cannot forecast sales or prove that a video caused a product to grow.',
    faqs: [
      { question: 'Are all-time and period sales the same metric?', answer: 'No. The report labels all-time, one-day, seven-day and thirty-day provider fields separately and uses the period selected in the form for comparisons.' },
      { question: 'Does a top-selling ranking predict future winners?', answer: 'No. It describes products returned for one market and date or period. Ranking position and reported growth are not forecasts.' },
      { question: 'Can the report identify what caused a sales increase?', answer: 'No. The ranking alone cannot attribute sales to a creator, video, promotion or other marketing action.' },
    ],
  },
  {
    slug: '1688-amazon-demand-matcher', kind: 'sourcing-demand',
    name: '1688 to Amazon Demand Matcher', title: '1688 to Amazon Demand Matcher | Nexscope',
    description: 'Compare a 1688 product shortlist with an Amazon keyword search snapshot using separate, reviewable queries.',
    eyebrow: 'CROSS-MARKET SOURCING', headline: 'Does this 1688 idea have Amazon search evidence?',
    lead: 'Provide a Simplified Chinese sourcing term and its Amazon-market search term. Get an AI report comparing both returned samples.',
    question: 'What do the two marketplaces actually report?',
    method: 'First request a bounded 1688 product shortlist, then an Amazon search snapshot. A separate AI analysis runs after both sources return.',
    limit: 'Keyword similarity does not establish that listings are the same product, that demand is profitable or that suppliers are verified.',
    primaryApi: '1688-product-search', additionalApis: ['amazon-search'],
    preview: ['1688 offers and Amazon demand signals', 'AI Markdown comparison report', 'No invented product match or margin score'],
    answer: 'This tool runs a 1688 product search and a separate Amazon keyword search, then compares the two returned samples in one report. It helps you inspect supplier terms alongside marketplace prices, ratings and reported sales signals. Similar keywords do not verify that listings are identical or profitable.',
    faqs: [
      { question: 'Why do I enter both a Chinese and an Amazon search term?', answer: 'The two searches use different marketplaces and languages. You choose the intended product concept for each, rather than relying on an unverified automatic translation.' },
      { question: 'Does the report verify an exact 1688-to-Amazon product match?', answer: 'No. The searches return independent listing samples. Confirm specifications, supplier identity and product equivalence yourself before sourcing.' },
      { question: 'Does the tool calculate profit or convert CNY to USD?', answer: 'No. It has no verified exchange rate, freight, platform fees or negotiated supplier quote, so it does not compute margins or convert currencies.' },
    ],
  },
];

export const getResearchTool = (slug: string) => researchTools.find((tool) => tool.slug === slug);
