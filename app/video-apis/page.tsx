/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight, Code2 } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import VideoApiDirectory from '@/components/video-api-directory';
import catalog from '@/lib/video-api-directory.json';
import { VIDEO_SOCIAL_IMAGE, NEXSCOPE_ORGANIZATION } from '@/lib/site-metadata';
import gradientTitle from '@/app/gradient-title.module.css';
import styles from '@/app/video/video.module.css';

const title = 'Video & Image Generation APIs for Ecommerce | Nexscope';
const description =
  'Browse Nexscope video generation, image generation and multimodal APIs. Search by model or task, compare capabilities and open each official API playground.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/video-apis/' },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: '/video-apis/',
    type: 'website',
    siteName: 'Nexscope Learn',
    images: [VIDEO_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [VIDEO_SOCIAL_IMAGE],
  },
};

export default function VideoApisPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      NEXSCOPE_ORGANIZATION,
      {
        '@type': 'CollectionPage',
        '@id': 'https://learn.nexscope.ai/video-apis/#page',
        url: 'https://learn.nexscope.ai/video-apis/',
        name: title,
        description,
        inLanguage: 'en',
        publisher: { '@id': NEXSCOPE_ORGANIZATION['@id'] },
        mainEntity: {
          '@type': 'ItemList',
          '@id': 'https://learn.nexscope.ai/video-apis/#api-list',
          name: 'Nexscope Video & Image APIs',
          numberOfItems: catalog.entries.length,
          itemListElement: catalog.entries.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: `https://www.nexscope.ai/api-docs/${item.slug}?view=playground&co-from=learn`,
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
            name: 'Video & Image APIs',
            item: 'https://learn.nexscope.ai/video-apis/',
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
        active="video-apis"
        campaign="video-api-directory"
      />
      <main className={styles.wrap}>
        <section className={styles.apiHero} aria-labelledby="video-apis-title">
          <h1 id="video-apis-title">
            Video &amp; <em className={gradientTitle.text}>image APIs</em>
          </h1>
          <p className={styles.lead}>
            Find a model to generate product images or videos, then try it in the API playground.
          </p>
        </section>
        <VideoApiDirectory />
        <aside className={styles.developer}>
          <Code2 size={25} aria-hidden="true" />
          <div>
            <h2>Choosing a workflow instead of an API?</h2>
            <p>
              Compare Image to Video, URL to Video, Avatar Video, Video Clone
              and Bulk Video with examples on the workflow page.
            </p>
          </div>
          <a href="/video/" data-track-tool="video-directory">
            Explore video workflows{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </aside>
      </main>
      <LearnFooter />
    </div>
  );
}
