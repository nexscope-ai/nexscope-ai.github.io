import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Commerce Radar by Nexscope | Ecommerce Signals',
  description:
    'A focused briefing on the ecommerce, platform, and AI shifts worth acting on—powered by Nexscope.',
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
