import { DirectionPage, directionMetadata } from '@/components/future-direction-page';

export const metadata = directionMetadata('creative');

export default function CreativeWorkspacePage() {
  return <DirectionPage kind="creative" />;
}
