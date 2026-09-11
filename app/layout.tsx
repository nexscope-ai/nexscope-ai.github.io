import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexscope-ai.github.io'),
  title: 'Nexscope Commerce Intelligence | Ecommerce Data Workflows',
  description:
    'Structured ecommerce intelligence for product research, Shopify competitor analysis, SEO and AI search visibility, review analysis, and supplier sourcing.',
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
    siteName: 'Nexscope Commerce Intelligence',
    title: 'Nexscope Commerce Intelligence | Ecommerce Data Workflows',
    description:
      'Structured ecommerce intelligence for product research, Shopify competitor analysis, SEO and AI search visibility, review analysis, and supplier sourcing.',
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
