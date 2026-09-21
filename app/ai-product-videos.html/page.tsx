import { CampaignPage } from '@/components/campaign-page';
import { campaignMetadata, campaigns } from '@/lib/campaigns';

const campaign = campaigns['ai-product-videos'];
export const metadata = campaignMetadata(campaign);

export default function Page() {
  return <CampaignPage campaign={campaign} />;
}
