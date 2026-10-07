export type ToolCard = {
  name: string;
  description: string;
  href: string;
  access: string;
  category: 'research' | 'pricing' | 'tiktok' | 'visibility' | 'creative';
  guide?: { label: string; href: string };
};

const officialTool = (slug: string) =>
  `https://www.nexscope.ai/tools/${slug}?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=tool_plaza`;

export const toolCards: ToolCard[] = [
  {
    name: 'Amazon Niche Opportunity Evaluator',
    description: 'Compare niche demand, brand concentration, product launches and returns for one Amazon keyword.',
    href: '/tools/amazon-niche-opportunity-evaluator/',
    access: 'Bring your own API key · credits apply', category: 'research',
  },
  {
    name: 'Amazon Product Price Checker',
    description: 'Check one ASIN’s reported Amazon listing price, currency, previous price and rating.',
    href: '/tools/amazon-product-price-checker/',
    access: 'Bring your own API key · credits apply', category: 'pricing',
  },
  {
    name: '1688 Wholesale Price Finder',
    description: 'Compare a shortlist of reported 1688 wholesale prices, minimum orders and supplier details.',
    href: '/tools/1688-wholesale-price-finder/',
    access: 'Bring your own API key · credits apply', category: 'pricing',
  },
  {
    name: 'Amazon to 1688 Supplier Finder',
    description:
      'Start with an Amazon ASIN, find visually similar 1688 listings, then inspect supplier terms and minimum order quantities.',
    href: '/tools/amazon-to-1688-supplier-finder/',
    access: 'Bring your own API key · credits apply',
    category: 'pricing',
    guide: {
      label: 'Sourcing overview',
      href: '/1688-supplier-product-sourcing/',
    },
  },
  {
    name: 'TikTok Shop New-Product Validator',
    description:
      'Review a dated new-product ranking, then inspect sales windows and related video evidence for products you select.',
    href: '/tools/tiktok-shop-new-product-validator/',
    access: 'Bring your own API key · credits apply',
    category: 'tiktok',
  },
  {
    name: 'TikTok Shop Product-to-Creator Match',
    description:
      'Find creators associated with a TikTok Shop product, then inspect profiles and product-tagged videos.',
    href: '/tools/tiktok-shop-creator-match/',
    access: 'Bring your own API key · credits apply',
    category: 'tiktok',
  },
  {
    name: 'Free Amazon Keyword Research',
    description:
      'Explore related Amazon keywords, search volume, trends and competition before planning a listing update.',
    href: officialTool('free-amazon-keyword-research-tool'),
    access: '3 free searches per day',
    category: 'research',
    guide: {
      label: 'Keyword research guide',
      href: '/ecommerce-ai-tools/amazon-competitor-keyword-research/',
    },
  },
  {
    name: 'Amazon Review Analyzer',
    description:
      'Analyze a bounded sample of low-star reviews and turn customer complaints into product questions worth testing.',
    href: officialTool('amazon-review-analyzer'),
    access: 'Sign-in and credits may be required',
    category: 'research',
    guide: {
      label: 'Review analysis guide',
      href: '/ecommerce-ai-tools/amazon-negative-review-analysis/',
    },
  },
  {
    name: 'AI Amazon Listing Optimizer',
    description:
      'Audit an Amazon listing with ASIN, keyword, traffic and history evidence, then review a prioritized optimization plan.',
    href: officialTool('amazon-listing-optimization-tool'),
    access: 'Sign-in and credits required',
    category: 'visibility',
    guide: {
      label: 'Listing optimization guide',
      href: '/ecommerce-ai-tools/amazon-listing-optimization-tool/',
    },
  },
  {
    name: 'Google-to-Amazon Keyword Research Workflow',
    description:
      'Expand Google keyword ideas, then inspect Amazon US competitors for one selected phrase in a deliberate API workflow.',
    href: '/tools/seo-keyword-planner/',
    access: 'Bring your own API key · credits apply',
    category: 'research',
    guide: {
      label: 'Amazon keyword research guide',
      href: '/ecommerce-ai-tools/amazon-competitor-keyword-research/',
    },
  },
  {
    name: 'Website SEO Auditor',
    description:
      'Check a public ecommerce page for SEO and content evidence, then prioritize what to review next.',
    href: officialTool('website-seo-auditor'),
    access: 'Sign-in and credits may be required',
    category: 'visibility',
    guide: {
      label: 'Ecommerce SEO audit guide',
      href: '/ecommerce-ai-tools/website-seo-audit-guide/',
    },
  },
  {
    name: 'AI Product Image Generator',
    description:
      'Create product-focused images and ad concepts with supported models, reviewable settings and product-accuracy guidance.',
    href: officialTool('ai-image-generator'),
    access: 'Sign-in and credits required',
    category: 'creative',
    guide: {
      label: 'Product image guide',
      href: '/ecommerce-ai-tools/ai-product-image-generator/',
    },
  },
  {
    name: 'AI Video Generator',
    description:
      'Turn a product photo and a motion prompt into a video concept with supported models and settings.',
    href: officialTool('ai-video-generator'),
    access: 'Sign-in and credits required',
    category: 'creative',
    guide: {
      label: 'Image-to-video guide',
      href: '/ecommerce-ai-tools/ai-video-generator/',
    },
  },
];

export const toolCategories = [
  {
    id: 'research',
    label: 'Market research',
    summary: 'Explore demand, keywords, competitors and customer feedback.',
  },
  {
    id: 'pricing',
    label: 'Prices & sourcing',
    summary:
      'Check Amazon and 1688 prices and investigate supplier candidates.',
  },
  {
    id: 'tiktok',
    label: 'TikTok Shop',
    summary: 'Investigate products, sales evidence and associated creators.',
  },
  {
    id: 'visibility',
    label: 'Listings & SEO',
    summary: 'Improve listings and review what search engines can see.',
  },
  {
    id: 'creative',
    label: 'AI creative',
    summary: 'Create product imagery and video concepts.',
  },
] as const;
