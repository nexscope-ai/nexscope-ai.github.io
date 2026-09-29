import type { Metadata } from 'next';
import './globals.css';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn.nexscope.ai'),
  title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
  description:
    'Find Nexscope ecommerce tools, guides, case studies and insights for product research, Amazon listing optimization, SEO, AI agents, and AI product image and video creation.',
  verification: {
    other: {
      'msvalidate.01': 'D2CD3A6DCC807F7EBBB0F0DCCC490644',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '280x280' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Nexscope',
    title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
    description:
      'Practical ecommerce tools, workflow guides and evidence from Nexscope.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
    description: 'Practical ecommerce tools, workflow guides and evidence from Nexscope.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
