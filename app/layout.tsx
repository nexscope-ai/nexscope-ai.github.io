import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn.nexscope.ai'),
  title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
  description:
    'Find Nexscope ecommerce tools, guides, case studies and insights for product research, SEO, AI agents and creative work.',
  alternates: {
    canonical: '/',
  },
  verification: {
    other: {
      'msvalidate.01': 'D2CD3A6DCC807F7EBBB0F0DCCC490644',
    },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Nexscope',
    title: 'Nexscope Learning Hub | Ecommerce Tools & Guides',
    description:
      'Practical ecommerce tools, workflow guides and evidence from Nexscope.',
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
