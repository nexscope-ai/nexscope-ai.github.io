/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import {
  ArrowRight,
  Code2,
  MessageCircle,
  Search,
  UserRound,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import SocialApiDirectory from '@/components/social-api-directory';
import catalog from '@/lib/social-api-directory.json';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from '@/app/video/video.module.css';
import social from './social.module.css';
const title = 'Social Media Data APIs for Developers | Nexscope';
const description =
  'Explore social media and content data APIs for TikTok, Instagram, YouTube, Facebook, Reddit and more. Find profiles, posts, comments, search and transcript endpoints.';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/social/' },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: '/social/',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};
export default function SocialPage() {
  const platforms = new Set(catalog.entries.map((e) => e.platform)).size;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      NEXSCOPE_ORGANIZATION,
      {
        '@type': 'CollectionPage',
        '@id': 'https://learn.nexscope.ai/social/#page',
        url: 'https://learn.nexscope.ai/social/',
        name: title,
        description,
        inLanguage: 'en',
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: catalog.entries.length,
          itemListElement: catalog.entries.map((e, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: e.name,
            url: `https://www.nexscope.ai/api-docs/${e.slug}?view=playground&co-from=learn`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Nexscope Learn',
            item: 'https://learn.nexscope.ai/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Social Data APIs',
            item: 'https://learn.nexscope.ai/social/',
          },
        ],
      },
    ],
  };
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <MarketingHeader
        active="social"
        campaign="social-directory"
        homepageFocus
      />
      <main className={styles.wrap}>
        <section className={social.hero}>
          <p className={styles.eyebrow}>Nexscope social & content data APIs</p>
          <h1>
            Social insights.
            <br />
            <em>Ready for your next build.</em>
          </h1>
          <p className={styles.lead}>
            Find the right endpoint for social profiles, posts, comments, search
            results and transcripts. Explore {catalog.entries.length} published
            APIs across {platforms} platform and tool groups, then test your
            request in the official playground.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href="#apis">
              Explore social APIs <ArrowRight size={17} />
            </a>
            <a className={styles.secondary} href="/data/">
              Looking for ecommerce data? <ArrowRight size={15} />
            </a>
          </div>
          <div className={social.taskGrid}>
            {[
              {
                Icon: UserRound,
                title: 'Research creators',
                text: 'Find profile, content and creator-related endpoints.',
              },
              {
                Icon: MessageCircle,
                title: 'Understand conversations',
                text: 'Explore posts, comments and replies where supported.',
              },
              {
                Icon: Search,
                title: 'Discover content',
                text: 'Compare platform search and transcript APIs.',
              },
              {
                Icon: Code2,
                title: 'Build your workflow',
                text: 'Inspect inputs and responses before integrating.',
              },
            ].map(({ Icon, title, text }) => (
              <div key={title}>
                <Icon size={21} aria-hidden="true" />
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
        <SocialApiDirectory />
        <section className={social.nextStep}>
          <h2>Start with one question and one endpoint.</h2>
          <p>
            Open a matching API playground, review the required parameters and
            inspect a response before adding it to your workflow.
          </p>
          <a href="/pricing/">
            Compare subscription plans <ArrowRight size={15} />
          </a>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
