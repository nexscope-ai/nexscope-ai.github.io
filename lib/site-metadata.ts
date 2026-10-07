export const DEFAULT_SOCIAL_IMAGE = {
  url: 'https://learn.nexscope.ai/og-default.png',
  width: 1200,
  height: 630,
  alt: 'Nexscope ecommerce research, tools and evidence-based workflows',
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
  url: 'https://www.nexscope.ai/',
  description:
    'Nexscope is an ecommerce intelligence and AI-creative platform for sellers, brands, agencies and developers.',
  logo: {
    '@type': 'ImageObject',
    url: 'https://learn.nexscope.ai/logo.png',
  },
  sameAs: NEXSCOPE_SOCIAL_PROFILES,
} as const;
