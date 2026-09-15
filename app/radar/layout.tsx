import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Commerce Signal Radar | Nexscope',
  alternates: { canonical: '/radar/' },
  openGraph: { title: 'Commerce Signal Radar | Nexscope', url: '/radar/' },
};
export default function RadarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
