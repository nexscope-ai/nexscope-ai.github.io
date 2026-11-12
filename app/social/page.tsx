/* oxlint-disable next/no-html-link-for-pages */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The named comparison region needs keyboard focus for horizontal scrolling. */
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import SocialApiDirectory from '@/components/social-api-directory';
import catalog from '@/lib/social-api-directory.json';
import { socialGuide, socialFaqs } from '@/lib/social-guide.mjs';
import gradientTitle from '@/app/gradient-title.module.css';
import {
  SOCIAL_API_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from '@/app/video/video.module.css';
import social from './social.module.css';
const title = 'Social Media APIs for Profiles, Posts & Video | Nexscope';
const description =
  'Find Nexscope social media APIs for profiles, posts, comments and video transcripts. Compare platforms and test the right endpoint in its official playground.';
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
    images: [SOCIAL_API_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [SOCIAL_API_SOCIAL_IMAGE],
  },
};
export default function SocialPage() {
  const guide = socialGuide(catalog.entries);
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
        publisher: { '@id': NEXSCOPE_ORGANIZATION['@id'] },
        about: [
          'Social media APIs',
          'Social content research',
          'Creator research',
        ],
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
        '@type': 'FAQPage',
        mainEntity: socialFaqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
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
      />
      <main className={styles.wrap}>
        <section className={social.hero}>
          <h1>Social media <em className={gradientTitle.text}>APIs</em></h1>
          <p className={styles.lead}>
            Find APIs for social profiles, posts, comments, ads and transcripts.
          </p>
        </section>
        <SocialApiDirectory />
        <section
          id="platforms"
          className={social.guideSection}
          aria-labelledby="social-platforms-title"
        >
          <p className={styles.eyebrow}>
            Platform coverage, from the published catalog
          </p>
          <h2 id="social-platforms-title">
            Which social API should you start with?
          </h2>
          <p>
            Pick the platform where the content lives, then choose a profile,
            post, comment, search or transcript operation. Counts below come
            from the APIs listed in this directory; examples link to the
            corresponding official documentation.
          </p>
          <section
            className={social.tableWrap}
            tabIndex={0}
            aria-label="Social API platform comparison"
          >
            <table>
              <caption>
                Selected social platforms and documented API starting points
              </caption>
              <thead>
                <tr>
                  <th scope="col">Platform</th>
                  <th scope="col">Published APIs</th>
                  <th scope="col">Example operations</th>
                </tr>
              </thead>
              <tbody>
                {guide.platforms.map((p) => (
                  <tr key={p.id}>
                    <th scope="row">{p.name}</th>
                    <td>{p.count}</td>
                    <td>
                      {p.links.map((l) => (
                        <a
                          key={l.slug}
                          href={l.url}
                          data-track
                          data-track-tool={l.slug}
                          data-cta-placement="social-platform-comparison"
                        >
                          {l.name} <ArrowRight size={13} aria-hidden="true" />
                        </a>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p className={styles.caption}>
            Source:{' '}
            <a href="https://www.nexscope.ai/api-docs?tab=data&co-from=learn">
              Nexscope official API catalog
            </a>
            . The full directory below also includes content, music, community
            and creator-tool operations.
          </p>
        </section>
        <section
          id="workflows"
          className={social.guideSection}
          aria-labelledby="social-workflow-title"
        >
          <p className={styles.eyebrow}>From a question to an endpoint</p>
          <h2 id="social-workflow-title">Three ways to start your research.</h2>
          <p>
            These are selection walkthroughs using documented endpoints, not
            live API test results. Use your own input in the playground to
            verify availability.
          </p>
          <div className={social.workflowGrid}>
            {guide.workflows.map((w) => (
              <article key={w.title}>
                <h3>{w.title}</h3>
                <p>
                  <strong>{w.question}</strong>
                </p>
                <ol>
                  {w.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <div className={social.workflowLinks}>
                  {w.links.map((l) => (
                    <a
                      key={l.slug}
                      href={l.url}
                      data-track
                      data-track-tool={l.slug}
                      data-cta-placement="social-workflow-guide"
                    >
                      {l.name}
                      <ArrowRight size={13} aria-hidden="true" />
                    </a>
                  ))}
                </div>
                <p className={social.reviewNote}>{w.review}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          id="social-faq"
          className={social.guideSection}
          aria-labelledby="social-faq-title"
        >
          <p className={styles.eyebrow}>Before your first request</p>
          <h2 id="social-faq-title">Nexscope Social API questions.</h2>
          <div className={social.faqList}>
            {socialFaqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={social.nextStep}>
          <h2>Start with one question and one endpoint.</h2>
          <p>
            Open a matching API playground, review the required parameters and
            inspect a response before adding it to your workflow.
          </p>
          <a href="/pricing/">
            Compare subscription plans <ArrowRight size={15} />
          </a>
          <p>
            Working on products or marketplace research?{' '}
            <a href="/data/">Explore ecommerce Data APIs</a>. Creating product
            content? <a href="/video/">Compare AI video workflows</a>.
          </p>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
