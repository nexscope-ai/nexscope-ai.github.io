export type ToolCard = {
  name: string;
  description: string;
  href: string;
  access: string;
  category: 'research' | 'visibility' | 'creative';
  guide?: { label: string; href: string };
};

const officialTool = (slug: string) =>
  `https://www.nexscope.ai/tools/${slug}?co-from=githubIO&utm_source=github_pages&utm_medium=referral&utm_campaign=tool_plaza`;

export const toolCards: ToolCard[] = [
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
    name: 'SEO Keyword Planner',
    description:
      'Connect keyword evidence with competing Amazon products and build a focused research brief.',
    href: officialTool('seo-keyword-planner'),
    access: 'Sign-in and credits required',
    category: 'research',
    guide: {
      label: 'Competitor keyword workflow',
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
    label: 'Product & competitor research',
    summary: 'Find demand, compare keywords and learn from customer feedback.',
  },
  {
    id: 'visibility',
    label: 'SEO & visibility',
    summary: 'Review the pages customers and search engines see.',
  },
  {
    id: 'creative',
    label: 'AI creative',
    summary: 'Create and inspect product media before publishing.',
  },
] as const;
