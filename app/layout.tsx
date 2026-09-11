import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexscope-ai.github.io'),
  title: 'Commerce Signal Radar | Ecommerce Trends & Market Intelligence',
  description:
    'Track the ecommerce shifts changing product discovery, advertising measurement, pricing, product feeds, and AI shopping—then investigate them with structured market data.',
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
    siteName: 'Commerce Signal Radar by Nexscope',
    title: 'Commerce Signal Radar | Ecommerce Trends & Market Intelligence',
    description:
      'Current ecommerce signals across AI shopping, product feeds, pricing, attribution, and checkout—connected to structured market data.',
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
