import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Commerce Signal Radar | From Trends to Growth Opportunities',
  description:
    'Track the latest ecommerce signals and turn platform shifts, AI shopping, and growth trends into actionable opportunities.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
