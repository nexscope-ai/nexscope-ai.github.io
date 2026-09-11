import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexscope-ai.github.io'),
  title: 'Nexscope Commerce Guides | Ecommerce Data Workflows',
  description:
    'Evidence-backed guides for ecommerce product research, Shopify competitor analysis, SEO and AI search visibility, review analysis, and 1688 sourcing.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Nexscope Commerce Guides',
    title: 'Nexscope Commerce Guides | Ecommerce Data Workflows',
    description:
      'Evidence-backed guides for ecommerce product research, Shopify competitor analysis, SEO and AI search visibility, review analysis, and 1688 sourcing.',
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
