import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://learn.nexscope.ai'),
  title: 'Nexscope | Ecommerce Data, AI Agents & Product Videos',
  description:
    'Research products, competitors and keywords, build AI-powered workflows and create product videos with Nexscope.',
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
    siteName: 'Nexscope',
    title: 'Nexscope | Ecommerce Data, AI Agents & Product Videos',
    description:
      'Ecommerce data, API and MCP workflows, and AI product video creation with Nexscope.',
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
