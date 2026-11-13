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
import videoStyles from '@/app/video/video.module.css';

const title = 'Remix TikTok Product Ads | Nexscope Ad Library';
const description =
  'Search and preview TikTok product ads, compare reported reach, and use an ad as a reference for your own product video in Nexscope Video Clone.';
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

const faqs = [
  {
    q: 'What is the Nexscope Ad Library?',
    a: 'The Nexscope Ad Library is a collection of TikTok ads you can browse and preview for product video ideas. Search by product, advertiser or keyword to find examples of how brands open an ad, demonstrate a product and ask viewers to take action.',
  },
  {
    q: 'How do I use a TikTok ad as a reference for my own video?',
    a: 'Select Remix on an ad, then choose “Copy link & open Video Clone.” Paste the copied video link into Video Clone as a reference, then add your own product images. You can use the ad’s pacing or structure as inspiration for your own creative.',
  },
  {
    q: 'What does reported reach mean on an ad card?',
    a: 'Reported reach is the range of unique viewers reported for the original ad. It helps you compare how widely the ads were seen. Use it alongside the video itself when choosing a reference for your product.',
  },
  {
    q: 'How do I preview or download an ad?',
    a: 'On desktop, hover over a video to preview it without sound. Select the play button for playback controls, including on touch devices. Use the download icon below the card to save the reference video.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://learn.nexscope.ai/ad-library/#ad-library-faq',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function AdLibraryPage() {
  return (
    <div className={styles.page}>
      <MarketingHeader active="ad-library" campaign="ad-library" />
      <main className={styles.wrap}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([pageSchema, faqSchema]).replace(/</g, '\\u003c'),
          }}
        />
        <AdLibrary
          catalog={catalog}
          cloneUrl={videoLandingUrl('video-replication')}
          showAnnualOffer={showAnnualOffer}
        />
        <section
          id="ad-library-faq"
          className={`${videoStyles.section} ${styles.faqSection}`}
          aria-labelledby="ad-library-faq-title"
        >
          <div className={videoStyles.sectionHeading}>
            <h2 id="ad-library-faq-title">Ad Library FAQ</h2>
          </div>
          <div className={videoStyles.faq}>
            {faqs.map(({ q, a }, index) => (
              <details key={q} open={index === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
