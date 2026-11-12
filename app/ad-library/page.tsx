import type { Metadata } from 'next';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import { AdLibrary } from '@/components/ad-library';
import catalog from '@/lib/ad-library-catalog.json';
import { videoWorkspaceUrl } from '@/lib/video-directory';
import gradient from '@/app/gradient-title.module.css';
import styles from './ad-library.module.css';

export const metadata: Metadata = {
  title: 'TikTok Video Ad Library for Ecommerce | Nexscope',
  description:
    'Browse TikTok video ads by market and keyword. Watch product ad examples, compare reported reach ranges, and create a video from your own product image.',
  alternates: { canonical: '/ad-library/' },
};

export default function AdLibraryPage() {
  return (
    <div className={styles.page}>
      <MarketingHeader active="ad-library" campaign="ad-library" />
      <main className={styles.wrap}>
        <header className={styles.hero}>
          <h1>
            TikTok <em className={gradient.text}>Ad Library</em>
          </h1>
          <p>
            Find product video ideas by browsing real TikTok ads from Germany,
            France and Italy.
          </p>
        </header>
        <AdLibrary
          catalog={catalog}
          createUrl={videoWorkspaceUrl('image-to-video')}
        />
      </main>
      <LearnFooter />
    </div>
  );
}
