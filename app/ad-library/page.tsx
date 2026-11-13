import { videoLandingUrl } from '@/lib/video-directory';
import type { Metadata } from 'next';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import { AdLibrary } from '@/components/ad-library';
import catalog from '@/lib/ad-library-catalog.json';
import pricingSnapshot from '@/lib/pricing-snapshot.json';
import { NEXSCOPE_ORGANIZATION } from '@/lib/site-metadata';
import styles from './ad-library.module.css';
import videoStyles from '@/app/video/video.module.css';

const title = 'TikTok Ad Library for Ecommerce Videos | Nexscope';
const description =
  'Search TikTok ads by product, advertiser or keyword. Preview ecommerce videos, compare reported reach, and use a reference to create your own ad with Nexscope.';
const pageUrl = 'https://learn.nexscope.ai/ad-library/';
const socialImage = {
  url: 'https://learn.nexscope.ai/og-ad-library.jpg',
  width: 1200,
  height: 630,
  alt: 'Nexscope TikTok Ad Library with two illustrated product video previews',
};
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
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImage],
  },
};

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  url: pageUrl,
  name: title,
  description,
  image: socialImage.url,
  inLanguage: 'en',
  publisher: NEXSCOPE_ORGANIZATION,
};

const faqs = [
  {
    q: 'What is the Nexscope Ad Library?',
    a: 'The Nexscope Ad Library is a curated collection of TikTok ads from Germany, France and Italy. Search the collection by product, advertiser or keyword to find examples of how brands open an ad, demonstrate a product and ask viewers to take action.',
  },
  {
    q: 'How do I use a TikTok ad as a reference for my own video?',
    a: 'Select Remix and choose “Copy link & open Video Clone” to copy the original TikTok link. Paste a TikTok video post link into Video Clone. If the original is a TikTok Ads Library page, download the MP4 from the card and upload it as your reference.',
  },
  {
    q: 'What does reported reach mean on an ad card?',
    a: 'Reported reach is the audience range reported for the original ad, such as 1K–10K. Some cards show total video views, which can include repeat views. Choose your reference based on how well the hook, demonstration and pacing fit your product.',
  },
  {
    q: 'How do I preview or download an ad?',
    a: 'Hover over a video to preview it without sound. On touch devices or when using a keyboard, select the preview button to start or stop playback. Use the download icon below the card to save the reference video.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${pageUrl}#ad-library-faq`,
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
          id="ad-library-guide"
          className={styles.jumpTarget}
          aria-labelledby="ad-library-guide-title"
          tabIndex={-1}
        >
          <div className={videoStyles.checklist}>
            <div>
              <h2 id="ad-library-guide-title">
                How to turn a TikTok ad into a product video brief
              </h2>
              <p className={videoStyles.costNote}>
                Pick a reference that demonstrates your type of product. For a kitchen
                scale, look for a clear close-up of the display and a quick demo of
                someone weighing an ingredient.
              </p>
              {/* Use document navigation for this link in the static export. */}
              {/* oxlint-disable-next-line next/no-html-link-for-pages */}
              <a className={videoStyles.guide} href="/video/">
                Compare Nexscope video workflows →
              </a>
            </div>
            <ol>
              <li>
                <strong>Identify the hook</strong>
                <p>Write down what the opening shot shows and the problem it introduces.</p>
              </li>
              <li>
                <strong>Plan your own shots</strong>
                <p>
                  Use the reference for pacing and shot order. Show your actual product
                  and use footage, images and music you have permission to use.
                </p>
              </li>
              <li>
                <strong>Review before publishing</strong>
                <p>
                  Check that the generated video shows the right product, keeps packaging
                  text legible and makes claims you can support.
                </p>
              </li>
            </ol>
          </div>
        </section>
        <section
          id="ad-library-faq"
          className={`${videoStyles.section} ${styles.jumpTarget}`}
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
