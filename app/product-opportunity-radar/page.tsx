import { DirectionPage, directionMetadata } from '@/components/future-direction-page';

export const metadata = directionMetadata('radar');

export default function OpportunityRadarPage() {
  return <DirectionPage kind="radar" />;
}
