import type { Metadata } from 'next';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import { AdLibrary } from '@/components/ad-library';
import catalog from '@/lib/ad-library-catalog.json';
import { videoWorkspaceUrl } from '@/lib/video-directory';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import gradient from '@/app/gradient-title.module.css';
import styles from './ad-library.module.css';

const title = 'TikTok Ad Library for Ecommerce Video Inspiration | Nexscope';
const description =
  'Explore TikTok ad examples, compare reported reach, and download a reference clip to adapt its style to your own product in Nexscope Video Clone.';

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
        <header className={styles.hero}>
          <h1>
            <em className={gradient.text}>Ad Library</em>
          </h1>
          <p>
            Pick an ad you like and recreate the style for your own product.
          </p>
        </header>
        <AdLibrary
          catalog={catalog}
          cloneUrl={videoWorkspaceUrl('video-replication')}
        />
        <section
          className={styles.usageGuide}
          aria-labelledby="ad-library-guide"
        >
          <h2 id="ad-library-guide">
            How to use a TikTok ad as a video reference
          </h2>
          <p>
            Search by advertiser or keyword and open an ad to see how it
            introduces the product. Compare the opening shot, demonstration and
            call to action before choosing a reference.
          </p>
          <p>
            Download the clip, then upload it and add your product images in
            Video Clone. Reported reach estimates how many people saw the
            original ad. Use the reach range to compare exposure across ads.
          </p>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
