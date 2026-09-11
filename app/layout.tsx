import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://nexscope-ai.github.io'),
  title: 'Commerce Radar by Nexscope | Ecommerce Signals',
  description:
    'A focused briefing on the ecommerce, platform, and AI shifts worth acting on—powered by Nexscope.',
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
    siteName: 'Commerce Radar by Nexscope',
    title: 'Commerce Radar by Nexscope | Ecommerce Signals',
    description:
      'A focused briefing on the ecommerce, platform, and AI shifts worth acting on—powered by Nexscope.',
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
