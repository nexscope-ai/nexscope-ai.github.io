import { videoLandingUrl } from '@/lib/video-directory';
import type { Metadata } from 'next';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import { AdLibrary } from '@/components/ad-library';
import catalog from '@/lib/ad-library-catalog.json';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from './ad-library.module.css';

const title = 'Remix TikTok Product Ads | Nexscope Ad Library';
const description =
  'Browse TikTok product ads by keyword, compare reported reach, and use an original TikTok video as a reference in Nexscope Video Clone.';
const annualPlans = pricingSnapshot.plans.filter(
  (plan) => plan.billingPeriod === 12,
);
const showAnnualOffer =
  annualPlans.length > 0 &&
  annualPlans.every(
    (plan) =>
      plan.introductoryPrice !== null &&
      plan.introductoryPrice * 2 === plan.price,
  );

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/ad-library/' },
  openGraph: {
    title,
    description,
    url: '/ad-library/',
    type: 'website',
    siteName: 'Nexscope',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: 'https://learn.nexscope.ai/ad-library/',
  name: 'Nexscope Ad Library',
  description,
  inLanguage: 'en',
  publisher: NEXSCOPE_ORGANIZATION,
};

export default function AdLibraryPage() {
  return (
    <div className={styles.page}>
      <MarketingHeader active="ad-library" campaign="ad-library" />
      <main className={styles.wrap}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pageSchema).replace(/</g, '\\u003c'),
          }}
        />
        <AdLibrary
          catalog={catalog}
          cloneUrl={videoLandingUrl('video-replication')}
          showAnnualOffer={showAnnualOffer}
        />
        <section
          className={styles.usageGuide}
          aria-labelledby="ad-library-guide"
        >
          <h2 id="ad-library-guide">
            How to use a TikTok ad as a video reference
          </h2>
          <p>
            Search by product, advertiser or keyword and play an ad
            to see how it introduces the product. Compare the opening shot,
            demonstration and call to action before choosing a reference.
          </p>
          <p>
            Select Remix to copy the video link. Paste it into Video
            Clone as a reference, then add images of your own product. Reported
            reach shows the range of unique viewers for each original ad.
          </p>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
