import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export type Campaign = {
  slug: string;
  title: string;
  description: string;
  ogDescription?: string;
  twitterDescription?: string;
  image?: { src: string; alt: string };
  audience: string;
  headline: ReactNode;
  lead: string;
  cta: { label: string; href: string };
  ctaNote: ReactNode;
  visual: 'amazon' | 'agents' | 'video';
  visualCaption: string;
  videoImages?: { src: string; alt: string; label: string }[];
  strip: string[];
  section: {
    eyebrow: string;
    title: string;
    intro: string;
    cards: { number?: string; title: string; text: string; tag?: string }[];
  };
  workflow: {
    id?: string;
    eyebrow: string;
    title: ReactNode;
    intro?: ReactNode;
    cta?: string;
    steps: { title: string; text: string }[];
  };
  faqs: { question: string; answer: string }[];
  closing: {
    title: string;
    text: string;
    resource?: { prefix?: string; label: string; href: string };
    note?: string;
  };
  footerExtra?: { label: string; href: string };
  footerDisclosure?: string;
};

const tracked = (path: string, campaign: string) =>
  `https://www.nexscope.ai${path}?co-from=githubIO&utm_source=github.io&utm_medium=referral&utm_campaign=${campaign}`;

const handWash = 'https://www.nexscope.ai/video-lab/seedance-20-hand-wash-poster.png';
const hairDemo = 'https://www.nexscope.ai/video-lab/seedance-20-hair-demo-poster.png';

export const campaigns = {
  'amazon-research': {
    slug: 'amazon-research',
    title: 'Amazon Keyword & Competitor Research | Nexscope',
    description: 'Research buyer keywords, competitor visibility and customer reviews. Turn marketplace evidence into a clearer plan for your next listing update.',
    audience: 'For Amazon sellers & operators',
    headline: <>Stop guessing.<br />Find your next<br /><em>listing opportunity.</em></>,
    lead: 'Research buyer keywords, competitor visibility and customer reviews. Turn marketplace evidence into a clearer plan for your next listing update.',
    cta: { label: 'Explore Amazon data', href: tracked('/apis', 'amazon-research') },
    ctaNote: 'Opens Nexscope · Account and credits may be required',
    visual: 'amazon',
    visualCaption: 'Illustrative workflow. No live product metrics shown.',
    strip: ['Keyword discovery', 'ASIN research', 'Review insights'],
    section: {
      eyebrow: 'A focused starting point',
      title: 'Better questions. Better listing decisions.',
      intro: 'Before you rewrite a title or launch another campaign, understand how shoppers search—and what they still need to know.',
      cards: [
        { number: '01 /', title: 'Find relevant demand', text: 'Expand a seed keyword into related searches. Compare search volume, trends and ranking difficulty without confusing popularity with product fit.', tag: 'amazon-keyword-expansion' },
        { number: '02 /', title: 'See competitor visibility', text: 'Investigate the keywords associated with comparable ASINs. Compare organic and paid positions in the same market and time window.', tag: 'amazon-asin-keywords' },
        { number: '03 /', title: 'Understand buying objections', text: 'Read reviews for recurring questions about fit, quality and usability. Use real concerns to guide clearer bullets, images and FAQs.', tag: 'amazon-reviews-list' },
      ],
    },
    workflow: {
      eyebrow: 'How it works',
      title: <>From an ASIN<br />to a research brief.</>,
      intro: <>Keep the workflow focused.<br />Keep the final decision yours.</>,
      steps: [
        { title: 'Choose a focused comparison', text: 'Start with your product, a marketplace and a few genuinely comparable ASINs.' },
        { title: 'Collect the evidence', text: 'Review keyword relevance, competitor positions and review themes. Keep estimates and missing values visible.' },
        { title: 'Test one improvement', text: 'Make a focused listing change and measure results using your own seller analytics.' },
      ],
    },
    faqs: [
      { question: 'Does this automatically improve my Amazon ranking?', answer: 'No. Nexscope supplies research data to support decisions. Rankings and sales depend on many factors, and results are not guaranteed.' },
      { question: "Is competitor data my store's actual conversion rate?", answer: 'No. Provider metrics and estimates are research signals, not your private sales or conversion analytics. Verify results in your own seller reports.' },
      { question: 'Can I connect this research to an AI agent?', answer: 'Yes. Supported capabilities are available through API, MCP and Skill access. Check the current API documentation for authentication, coverage and credits.' },
    ],
    closing: {
      title: 'Your next listing update starts with a better question.',
      text: 'Bring the evidence to your product and content decisions.',
      resource: { label: 'Learn how to track Amazon price, BSR and sales history →', href: '/ecommerce-ai-tools/amazon-price-history/' },
    },
  },
  'ecommerce-ai-agents': {
    slug: 'ecommerce-ai-agents',
    title: 'Ecommerce APIs & MCP Tools for AI Agents | Nexscope',
    description: 'Learn how to connect marketplace research APIs to AI agents with MCP tools for products, competitors, keywords, reviews and traceable ecommerce evidence.',
    audience: 'For developers & automation teams',
    headline: <>Connect marketplace APIs<br /><em>to AI agents with MCP.</em></>,
    lead: 'Place a controlled MCP tool layer between an AI agent and marketplace research APIs. The agent can discover focused product, keyword, competitor and review tools while your backend keeps credentials, validation, rate limits and evidence handling outside the model context.',
    cta: { label: 'Explore the API docs', href: tracked('/api-docs', 'ecommerce-ai-agents') },
    ctaNote: 'Opens Nexscope · Account and credits may be required',
    visual: 'agents',
    visualCaption: 'Request illustration. Authentication and credits may be required.',
    strip: ['API access', 'MCP integration', 'Portable Skills'],
    section: {
      eyebrow: 'A focused starting point',
      title: 'A practical ecommerce MCP architecture.',
      intro: 'Move from a generic recommendation to a marketplace research workflow with explicit inputs, provider data and traceable limitations.',
      cards: [
        { number: '01 /', title: 'Research products', text: 'Bring marketplace product and competitor signals into your applications. Query what you need instead of manually assembling every research brief.', tag: 'Product & market data' },
        { number: '02 /', title: 'Understand search demand', text: 'Combine keyword discovery and trend analysis with your own logic. Keep marketplace volume separate from normalized trend interest.', tag: 'Keywords & trends' },
        { number: '03 /', title: 'Build with your agent', text: 'Choose supported API, MCP or Skill access. Use the documented request schemas and handle missing data, errors and credit usage explicitly.', tag: 'API · MCP · Skills' },
      ],
    },
    workflow: {
      eyebrow: 'How it works',
      title: <>A question becomes<br />a data-backed workflow.</>,
      intro: <>Keep the workflow focused.<br />Keep the final decision yours.</>,
      steps: [
        { title: 'Choose a capability', text: 'Find the relevant API and inspect its request schema, response fields and coverage.' },
        { title: 'Connect securely', text: 'Authenticate using the documented setup. Keep API credentials in your backend or agent environment—not in public pages.' },
        { title: 'Return evidence, not certainty', text: 'Use returned data to support the answer. Label estimates, missing values and conclusions that need human review.' },
      ],
    },
    faqs: [
      { question: 'How can an ecommerce team connect marketplace research APIs to AI agents using MCP?', answer: 'Put a domain-oriented MCP server between the agent and the marketplace APIs. Expose focused read-only tools, normalize provider responses, keep credentials server-side, preserve source fields and timestamps, and require human approval before any action changes a listing, price, campaign or budget.' },
      { question: 'Does one integration include every marketplace dataset?', answer: 'No. Coverage, fields and availability vary by capability and provider. Check the live catalog and documentation before building your workflow.' },
      { question: 'Can I call these APIs without authentication?', answer: 'Production calls can require authentication and credits. Follow the current documentation for the chosen API; this marketing page does not execute calls.' },
      { question: 'Does Nexscope automatically operate my store?', answer: 'The research APIs described here retrieve data. They do not imply permission to change listings, spend an advertising budget or perform store actions.' },
    ],
    closing: {
      title: 'Build agents that research before they recommend.',
      text: 'Start with one seller question and the API that can help answer it.',
      resource: { prefix: 'New to the protocol? ', label: 'Learn what an MCP server is and how ecommerce tools connect →', href: '/ecommerce-ai-tools/what-is-an-mcp-server/' },
    },
  },
  'ai-product-videos': {
    slug: 'ai-product-videos',
    title: 'AI Product Videos for Ecommerce Brands | Nexscope',
    description: 'Turn product images and creative direction into AI-generated product videos. Explore showcases, UGC-style talking videos and reference-led concepts for your next campaign.',
    audience: 'For brands & creative teams',
    headline: <>Your product.<br />Your next<br /><em>video creative.</em></>,
    lead: 'Turn product images and creative direction into AI-generated product videos. Explore showcases, UGC-style talking videos and reference-led concepts for your next campaign.',
    cta: { label: 'Create a product video', href: tracked('/seller/video-generation', 'ai-product-videos') },
    ctaNote: 'Opens Nexscope · Account and credits may be required',
    visual: 'video',
    videoImages: [
      { src: handWash, alt: 'Nexscope product video example featuring hand wash', label: 'Product showcase' },
      { src: hairDemo, alt: 'Nexscope hair product video example', label: 'UGC-style creative' },
    ],
    visualCaption: 'Nexscope example stills—not customer testimonials.',
    strip: ['Image to video', 'UGC-style concepts', 'Reference-led creation'],
    section: {
      eyebrow: 'A focused starting point',
      title: "More ways to tell your product's story.",
      intro: 'Start with the assets you already have. Explore a new scene, explain a product benefit or test a different creative direction.',
      cards: [
        { number: '01 /', title: 'Bring a product image to life', text: 'Use a product image and a prompt to explore motion, context and a new way to showcase your product.', tag: 'Image to video' },
        { number: '02 /', title: 'Explain the product', text: 'Create UGC-style talking concepts around your product and selling points. Review every claim before publishing.', tag: 'Product talking video' },
        { number: '03 /', title: 'Explore a reference-led concept', text: 'Use authorized reference material to guide a new video. Review product accuracy and likeness rather than assuming an exact reproduction.', tag: 'Video replication' },
      ],
    },
    workflow: {
      eyebrow: 'How it works',
      title: <>From product asset<br />to a creative worth testing.</>,
      intro: <>Keep the workflow focused.<br />Keep the final decision yours.</>,
      steps: [
        { title: 'Bring your own assets', text: 'Choose product images and reference material you have permission to use.' },
        { title: 'Set the creative direction', text: 'Describe the scene, benefit and format. Available duration and settings depend on the selected model.' },
        { title: 'Review, then test', text: 'Check product details, claims and artifacts. Test the approved creative in your own campaigns.' },
      ],
    },
    faqs: [
      { question: 'Are these real customer testimonials?', answer: "No. AI-generated UGC-style videos are not evidence of a real buyer's experience. Do not present synthetic speakers as genuine customers or invent endorsements." },
      { question: 'Can I use the output in marketing?', answer: 'Review the applicable terms and ensure you have rights to all uploaded images, logos, people, music and other assets. Check platform disclosure requirements before publishing.' },
      { question: 'Will every video reproduce my product exactly?', answer: 'No. Generative video can contain visual errors. Review the output carefully, and revise or regenerate when product details are inaccurate.' },
      { question: 'How long does generation take?', answer: 'Timing depends on the model, duration and processing demand. Check current settings and progress in the Nexscope workspace.' },
    ],
    closing: {
      title: 'Make your next product story a video.',
      text: 'Create a concept. Review the details. Test it with your audience.',
    },
    footerExtra: { label: 'AI video generator', href: '/ai-video-generator/' },
  },
  'ai-video-generator': {
    slug: 'ai-video-generator',
    title: 'AI Product Video Generator for Ecommerce | Nexscope',
    description: "Create ecommerce product videos from images with Nexscope's AI product video generator. Choose a model and start with 1,000 free credits.",
    ogDescription: 'One product photo. A new creative direction. Explore image-to-video generation with 1,000 free credits for new users.',
    twitterDescription: 'Turn a product image into your next video concept. New users get 1,000 free credits.',
    image: { src: handWash, alt: 'Nexscope AI-generated hand wash product showcase' },
    audience: 'Built for ecommerce creatives',
    headline: <>AI product video generator.<br />Your product.<br /><em>In its next scene.</em></>,
    lead: "Give your product photo a new creative direction. Use Nexscope's AI video generator to turn an image and a motion prompt into a video concept for your store, social feed or next ad test.",
    cta: { label: 'Try the AI video generator', href: tracked('/tools/ai-video-generator', 'ai-video-generator') },
    ctaNote: <><strong>New users get 1,000 free credits.</strong><br />Sign-in required. Credit usage varies by model and settings.</>,
    visual: 'video',
    videoImages: [
      { src: handWash, alt: 'AI-generated hand wash product video showcase', label: 'Product details in focus' },
      { src: hairDemo, alt: 'Nexscope hair accessory video showcase', label: 'A new presentation idea' },
    ],
    visualCaption: 'Existing Nexscope showcase stills. AI-generated examples; results vary.',
    strip: ['Choose a model', 'Direct the motion', 'Review your video'],
    section: {
      eyebrow: 'One asset. More creative possibilities.',
      title: 'An AI product video generator for the products you sell.',
      intro: 'A good product photo already communicates shape, material and detail. Image-to-video generation gives you a way to explore how that product could look in motion—without starting every concept from a blank page.',
      cards: [
        { number: '01 / STOREFRONT', title: 'Show the details', text: 'Explore a slow camera move, a close-up or a simple studio scene. Check the label, shape and proportions before using a result on a product page.' },
        { number: '02 / SOCIAL', title: 'Build a fresh visual hook', text: 'Try a new setting and a focused action for your next social post. Select an aspect ratio supported by the model for your intended placement.' },
        { number: '03 / CREATIVE TESTING', title: 'Compare directions', text: 'Keep the product image consistent while changing the camera movement or background. Review the results to decide which concept deserves another iteration.' },
      ],
    },
    workflow: {
      id: 'how-it-works',
      eyebrow: 'From still image to first take',
      title: 'How to use the AI video generator.',
      intro: 'Generation happens in the official Nexscope tool. This page helps you choose a starting point.',
      cta: 'Create your first video',
      steps: [
        { title: 'Upload a clear product photo', text: 'Sign in and choose an image you have permission to use. Follow the image count, format and size requirements shown for your selected model.' },
        { title: 'Choose the model and describe the motion', text: 'Set supported duration, resolution and framing. Review the credit estimate, then describe one clear action and camera movement.' },
        { title: 'Generate, inspect and download', text: 'Wait for the task to finish, review product details and visual artifacts, then download the available result. Refine the prompt if needed.' },
      ],
    },
    faqs: [
      { question: 'What is an AI video generator from images?', answer: "It uses an input image and a text prompt to create a moving scene. Nexscope's tool focuses on ecommerce product photos, with a choice of models and supported video settings." },
      { question: 'Can I try it for free?', answer: 'New Nexscope users receive 1,000 free credits. Generating a video uses credits according to the model and settings. Check the estimate before generating; free credits do not mean unlimited videos.' },
      { question: 'Do I need an API key?', answer: 'No API key needs to be entered in the web tool. Sign in with your Nexscope account to upload images and generate. Developer API access has separate requirements.' },
      { question: 'Can I generate a video from text alone?', answer: 'This tool is focused on image-to-video generation. Supply the images required by your chosen model, then use text to direct the scene and motion.' },
      { question: 'Which AI video generator model should I choose?', answer: 'Choose based on your image inputs, target duration, resolution, aspect ratio and credit estimate. There is no single best model for every product; compare outputs using the same image and prompt.' },
      { question: 'How long does it take?', answer: 'Generation runs as a background task. Timing depends on the model, settings and demand. The tool shows progress and the available output when the task completes.' },
      { question: 'Can I publish the generated videos?', answer: 'Check applicable terms, rights to your assets and platform disclosure requirements. Review the output for accuracy before publishing. AI-generated examples are not real customer endorsements.' },
    ],
    closing: {
      title: 'Turn your product photo into a video concept.',
      text: 'Open the generator, choose your model and give your product a new scene.',
      note: '1,000 free credits for new users · Usage varies by model and settings',
    },
    footerExtra: { label: 'More product video workflows', href: '/ai-product-videos/' },
    footerDisclosure: 'Some Nexscope links include referral tracking; the referrer may receive a commission if you purchase. Current availability, credits and terms are shown in the official tool.',
  },
} satisfies Record<string, Campaign>;

export type CampaignKey = keyof typeof campaigns;

export function campaignMetadata(campaign: Campaign): Metadata {
  const url = `https://learn.nexscope.ai/${campaign.slug}/`;
  return {
    title: campaign.title,
    description: campaign.description,
    alternates: { canonical: url },
    robots: campaign.slug === 'ai-video-generator' ? { index: true, follow: true, googleBot: { 'max-image-preview': 'large' } } : undefined,
    openGraph: {
      type: 'website', siteName: 'Nexscope', url, title: campaign.title,
      description: campaign.ogDescription ?? campaign.description,
      images: campaign.image ? [{ url: campaign.image.src, alt: campaign.image.alt }] : undefined,
    },
    twitter: {
      card: campaign.image ? 'summary_large_image' : 'summary',
      title: campaign.title,
      description: campaign.twitterDescription ?? campaign.description,
      images: campaign.image ? [{ url: campaign.image.src, alt: campaign.image.alt }] : undefined,
    },
  };
}
