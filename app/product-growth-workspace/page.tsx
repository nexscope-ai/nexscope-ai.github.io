import { DirectionPage, directionMetadata } from '@/components/future-direction-page';

export const metadata = directionMetadata('growth');

export default function GrowthWorkspacePage() {
  return <DirectionPage kind="growth" />;
}
