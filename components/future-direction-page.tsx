import type { Metadata } from 'next';
import MarketingHeader from './marketing-header';
import LearnFooter from './learn-footer';
import { DirectionPreview } from './direction-preview';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';
import { futureDirections, type FutureDirection } from '@/lib/future-directions';

export function directionMetadata(kind: FutureDirection): Metadata {
  const direction = futureDirections[kind];
  const title = direction.title + ' | Nexscope Learn';
  const url = '/' + direction.slug + '/';
  return {
    title, description: direction.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: 'website', siteName: 'Nexscope', title, description: direction.description, url, images: [DEFAULT_SOCIAL_IMAGE] },
    twitter: { card: 'summary_large_image', title, description: direction.description, images: [DEFAULT_SOCIAL_IMAGE] },
  };
}

export function DirectionPage({ kind }: { kind: FutureDirection }) {
  return (
    <>
      <MarketingHeader campaign={futureDirections[kind].slug} />
      <DirectionPreview key={kind} kind={kind} />
      <LearnFooter />
    </>
  );
}
