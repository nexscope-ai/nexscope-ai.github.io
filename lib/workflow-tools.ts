export type WorkflowTool = {
  slug: string;
  mode: 'sourcing' | 'trends' | 'creators';
  name: string;
  title: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  headline: [string, string];
  lead: string;
  preview: { input: string; outcome: string; note: string };
  decisionGuide: {
    question: string;
    answer: string;
    method: string;
    limit: string;
    evidence?: { label: string; href: string };
  };
  resultPreview: string[];
  formTitle: string;
  formLead: string;
  creditChip: string;
  inputLabel: string;
  inputName: string;
  inputPlaceholder?: string;
  inputType?: 'text' | 'date';
  marketLabel: string;
  marketName: 'amazonDomain' | 'region';
  marketOptions: { value: string; label: string }[];
  fieldNote?: string;
  buttonLabel: string;
  creditNote: string;
  initialStatus: string;
  explainers: { label: string; title: string; body: string }[];
  faqs: { question: string; answer: string }[];
  apiLinks: { label: string; href: string }[];
};

const amazonMarkets = [
  { value: 'amazon.com', label: 'United States' },
  { value: 'amazon.co.uk', label: 'United Kingdom' },
  { value: 'amazon.de', label: 'Germany' },
  { value: 'amazon.co.jp', label: 'Japan' },
];

const tiktokMarkets = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'PH', label: 'Philippines' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'SG', label: 'Singapore' },
];

export const workflowTools: WorkflowTool[] = [
  {
    slug: 'amazon-to-1688-supplier-finder',
    mode: 'sourcing',
    name: 'Amazon to 1688 Supplier Finder',
    title: 'Amazon to 1688 Supplier Finder | Nexscope',
    description:
      'Enter an Amazon ASIN to find visually similar 1688 listings, compare price and MOQ, and inspect selected suppliers with your own API key.',
    keywords: [
      'Amazon to 1688 supplier finder',
      'find 1688 supplier from Amazon product',
      'Amazon product sourcing by image',
    ],
    eyebrow: 'Amazon sourcing workflow',
    headline: ['Find 1688 suppliers', 'from an Amazon ASIN.'],
    lead: 'Start with a product you can see on Amazon. This workflow extracts its product image, searches 1688 for visual matches, and lets you inspect the supplier records worth a closer look.',
    preview: {
      input: 'An Amazon product listing',
      outcome: 'A shortlist of visual matches on 1688',
      note: 'Compare specifications, minimum orders and supplier terms before sourcing.',
    },
    decisionGuide: {
      question: 'Can an Amazon ASIN identify the right 1688 supplier?',
      answer:
        'It can produce a shortlist of visually similar 1688 offers, but cannot identify the original factory or prove that materials and specifications match.',
      method:
        'Amazon Product Detail supplies the product image; 1688 Search By Image returns candidate offers; Product Detail runs only for a selected offer.',
      limit:
        'Verify samples, supplier identity, MOQ, freight, taxes and compliance separately. A public image URL may fail the image-search requirements.',
      evidence: {
        label: 'Inspect a dated 1688 image-search test →',
        href: '/ecommerce-ai-tools/api-evidence/1688-image-search/',
      },
    },
    resultPreview: [
      'Amazon source product',
      '1688 candidate listings',
      'Supplier detail on selection',
    ],
    formTitle: 'Find supplier candidates',
    formLead: 'Use one ASIN or a standard Amazon product URL.',
    creditChip: 'First run: about 31 credits',
    inputLabel: 'Amazon ASIN or product URL',
    inputName: 'asin',
    inputPlaceholder: 'B072MQ5BRX or https://www.amazon.com/dp/...',
    marketLabel: 'Amazon marketplace',
    marketName: 'amazonDomain',
    marketOptions: amazonMarkets,
    fieldNote:
      'For an Amazon URL, the marketplace is detected from the link. For an ASIN, choose the marketplace above.',
    buttonLabel: 'Find 1688 suppliers ↗',
    creditNote:
      'Amazon detail: 21 credits · 1688 image search: 10 credits. Supplier detail is optional and charged separately.',
    initialStatus:
      'Enter an ASIN and your key to begin. No API call has been made.',
    explainers: [
      {
        label: '01 / Image match',
        title: 'Compare, do not assume.',
        body: 'Visual similarity helps shortlist listings. It does not prove factory identity, equal materials, or product authenticity.',
      },
      {
        label: '02 / Wholesale terms',
        title: 'Check MOQ and tiers.',
        body: 'Compare stated minimum order quantity and wholesale tiers before contacting a supplier.',
      },
      {
        label: '03 / Landed cost',
        title: 'Calculate separately.',
        body: 'Prices are shown in their source currency. Freight, duties, returns, and marketplace fees are not included.',
      },
    ],
    faqs: [
      {
        question: 'Does a visual match prove it is the same manufacturer?',
        answer:
          'No. Inspect specifications and order samples. Similar-looking products can come from different suppliers and differ materially.',
      },
      {
        question: 'Does the tool calculate profit margin?',
        answer:
          'No. Amazon retail and 1688 wholesale prices may use different currencies and exclude landed costs.',
      },
      {
        question: 'When are API credits used?',
        answer:
          'The first run calls Amazon Product Detail and 1688 Search By Image. Supplier Detail runs only when you select one result.',
      },
    ],
    apiLinks: [
      {
        label: 'Amazon Product Detail →',
        href: 'https://www.nexscope.ai/api-docs/amazon-product-detail',
      },
      {
        label: '1688 Search By Image →',
        href: 'https://www.nexscope.ai/api-docs/1688-search-by-image',
      },
    ],
  },
  {
    slug: 'tiktok-shop-new-product-validator',
    mode: 'trends',
    name: 'TikTok Shop New-Product Validator',
    title: 'TikTok Shop New-Product Validator | Nexscope',
    description:
      'Review a dated TikTok Shop new-product ranking, then inspect multi-period sales and related videos for selected products using your own Nexscope API key.',
    keywords: [
      'TikTok Shop trending products',
      'TikTok Shop new product research',
      'TikTok Shop product validator',
    ],
    eyebrow: 'TikTok Shop product research',
    headline: ['Find a rising product.', 'Then test the signal.'],
    lead: 'A ranking can surface candidates, but it cannot tell the whole story. Compare short and longer sales windows, creator activity, and related public videos before you shortlist a new product.',
    preview: {
      input: 'A dated market ranking',
      outcome: 'Sales windows and video evidence',
      note: 'A single-day spike is a signal to investigate, not proof of demand.',
    },
    decisionGuide: {
      question: 'Does a TikTok Shop new-product ranking prove demand?',
      answer:
        'No. A dated ranking is a discovery list. Compare the selected product’s 7- and 30-day daily sales pace, ratings and content activity before deciding whether to investigate it further.',
      method:
        'New Product Rank returns a market snapshot; Batch Product Detail supplies the selected product’s metrics; related videos are requested only after selection.',
      limit:
        'Provider metrics may be estimated, missing or updated at different times. Related videos and recent sales do not prove future demand.',
    },
    resultPreview: [
      'New-product shortlist',
      '1-, 7- and 30-day sales',
      'Related videos on selection',
    ],
    formTitle: 'Start with a market snapshot',
    formLead:
      'Choose a date with available data. Newest rankings may be delayed.',
    creditChip: 'Ranking: about 10 credits',
    inputLabel: 'Ranking date',
    inputName: 'date',
    inputType: 'date',
    marketLabel: 'TikTok Shop market',
    marketName: 'region',
    marketOptions: tiktokMarkets,
    buttonLabel: 'Show new products ↗',
    creditNote:
      'Inspecting one product later adds about 48 credits for detail and related-video evidence.',
    initialStatus: 'Choose a market and date. No API call has been made.',
    explainers: [
      {
        label: '01 / Discovery',
        title: 'Ranked is not validated.',
        body: 'Use the ranking to locate recently noticed products, not to infer future sales.',
      },
      {
        label: '02 / Momentum',
        title: 'Compare time windows.',
        body: 'Look at 1-, 7-, and 30-day units together. A single-day spike is not a sustained trend.',
      },
      {
        label: '03 / Content',
        title: 'Check the videos.',
        body: 'Related video records provide examples of product exposure. They do not prove causality or audited revenue.',
      },
    ],
    faqs: [
      {
        question: 'Does a ranked product have proven long-term demand?',
        answer:
          'No. The ranking is a dated snapshot. Inspect multiple sales windows and independent demand signals before sourcing stock.',
      },
      {
        question: 'Are these audited sales figures?',
        answer:
          'No. Marketplace-provider metrics are directional estimates or sampled signals.',
      },
      {
        question: 'When does the tool use more credits?',
        answer:
          'Only after you select a product does it request detailed sales metrics and related videos.',
      },
    ],
    apiLinks: [
      {
        label: 'New Product Rank →',
        href: 'https://www.nexscope.ai/api-docs/tiktok-new-product-rank',
      },
      {
        label: 'Batch Product Detail →',
        href: 'https://www.nexscope.ai/api-docs/tiktok-batch-product-detail',
      },
    ],
  },
  {
    slug: 'tiktok-shop-creator-match',
    mode: 'creators',
    name: 'TikTok Shop Product-to-Creator Match',
    title: 'TikTok Shop Product-to-Creator Match | Nexscope',
    description:
      'Enter a TikTok Shop product ID to find associated creators, inspect profile signals, and check product-tagged videos with your own Nexscope API key.',
    keywords: [
      'find TikTok Shop affiliate creators',
      'TikTok Shop product creator match',
      'TikTok creator product research',
    ],
    eyebrow: 'TikTok Shop creator research',
    headline: ['Find creators connected', 'to your product.'],
    lead: 'Start with a TikTok Shop product ID. See creators associated with it, then inspect profile signals and product-tagged video evidence before building an outreach shortlist.',
    preview: {
      input: 'A TikTok Shop product',
      outcome: 'Creators associated with that product',
      note: 'Check profile fit and exact product-tagged videos before outreach.',
    },
    decisionGuide: {
      question: 'Are associated creators ready for partnership outreach?',
      answer:
        'Not automatically. An association can start a shortlist, but account identity, audience fit and videos tagged with the exact product should be checked before outreach.',
      method:
        'Product Related Creators supplies the initial records; Creator Detail and Creator Related Videos run only when a usable creator is selected.',
      limit:
        'The source may omit creator names, account IDs or images. Association does not establish availability, rates, consent or sales impact.',
    },
    resultPreview: [
      'Associated creator shortlist',
      'Creator profile signals',
      'Product-tagged videos on selection',
    ],
    formTitle: 'Build a creator shortlist',
    formLead:
      'Use a numeric TikTok Shop product ID or a product URL containing it.',
    creditChip: 'Shortlist: about 38 credits',
    inputLabel: 'TikTok Shop product ID or URL',
    inputName: 'productId',
    inputPlaceholder: '1732052189676081387',
    marketLabel: 'TikTok Shop market',
    marketName: 'region',
    marketOptions: tiktokMarkets,
    buttonLabel: 'Find associated creators ↗',
    creditNote:
      'Inspecting one selected creator later adds about 57 credits for profile and video evidence.',
    initialStatus:
      'Enter a TikTok Shop product ID and your key. No API call has been made.',
    explainers: [
      {
        label: '01 / Association',
        title: 'Start from the product.',
        body: 'Shortlist creators the provider associates with this product, rather than browsing a generic popularity chart.',
      },
      {
        label: '02 / Profile',
        title: 'Inspect the audience signal.',
        body: 'Review follower and content metrics in their original reported units. Missing values stay visibly missing.',
      },
      {
        label: '03 / Proof',
        title: 'Check exact tags.',
        body: 'Only a video explicitly tagged with this product ID is shown as product-specific video evidence.',
      },
    ],
    faqs: [
      {
        question: 'Does this tool contact creators automatically?',
        answer:
          'No. It is read-only research. Partnership availability, rates and fit require your own review and outreach.',
      },
      {
        question: 'Are all creator videos about this product?',
        answer:
          'No. The tool separates exact product-tagged videos from general creator activity.',
      },
      {
        question: 'When are more credits used?',
        answer:
          'Creator Detail and Creator Related Videos run only after you choose a creator from the shortlist.',
      },
    ],
    apiLinks: [
      {
        label: 'Product Related Creators →',
        href: 'https://www.nexscope.ai/api-docs/chuhaijiang-tiktok-product-related-creators',
      },
      {
        label: 'Creator Detail →',
        href: 'https://www.nexscope.ai/api-docs/chuhaijiang-tiktok-creator-detail',
      },
    ],
  },
];

export function getWorkflowTool(slug: string) {
  return workflowTools.find((tool) => tool.slug === slug);
}
