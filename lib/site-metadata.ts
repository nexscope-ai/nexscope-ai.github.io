export const DEFAULT_SOCIAL_IMAGE = {
  url: 'https://learn.nexscope.ai/og-default.png?v=2',
  width: 1200,
  height: 630,
  alt: 'Nexscope Learn — practical guides for ecommerce teams',
} as const;

export const HOME_SOCIAL_IMAGE = {
  url: 'https://learn.nexscope.ai/og-home-v2.png',
  width: 1672,
  height: 941,
  alt: 'Nexscope Data and Social APIs, AI product videos, Product Growth Reports and free Product Gallery',
} as const;

export const VIDEO_SOCIAL_IMAGE = {
  url: 'https://learn.nexscope.ai/og-video.png',
  width: 1672,
  height: 941,
  alt: 'Nexscope turns product images into product videos, listing videos and avatar videos',
} as const;

export const SOCIAL_API_SOCIAL_IMAGE = {
  url: 'https://learn.nexscope.ai/og-social.png',
  width: 1672,
  height: 941,
  alt: 'Nexscope Social Media APIs connect profiles, posts, comments and video transcripts to research workflows',
} as const;

export const GROWTH_REPORT_SOCIAL_IMAGE = {
  url: 'https://learn.nexscope.ai/og-product-growth-report.png',
  width: 1672,
  height: 941,
  alt: 'Nexscope turns a product link into a human-reviewed Product Growth Report with selected analyses, copy and advertising images',
} as const;

export const NEXSCOPE_SOCIAL_PROFILES = [
  'https://www.linkedin.com/company/nexscope-ai/',
  'https://x.com/Nexscope_ai',
  'https://www.youtube.com/@Nexscope-AI',
  'https://www.tiktok.com/@nexscope_ai',
  'https://github.com/nexscope-ai',
] as const;

export const NEXSCOPE_ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://www.nexscope.ai/#organization',
  name: 'Nexscope',
  legalName: 'ECOCREATE TECHNOLOGY PTE. LTD.',
  url: 'https://www.nexscope.ai/',
  description:
    'Nexscope is an ecommerce intelligence and AI-creative platform for sellers, brands, agencies and developers.',
  logo: {
    '@type': 'ImageObject',
    url: 'https://learn.nexscope.ai/logo.png',
  },
  sameAs: NEXSCOPE_SOCIAL_PROFILES,
} as const;
