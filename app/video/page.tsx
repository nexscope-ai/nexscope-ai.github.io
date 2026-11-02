/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- The horizontal table scroller needs keyboard focus on narrow screens. */
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Play, Check, Code2 } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import VideoDirectoryExamples from '@/components/video-directory-examples';
import VideoWorkflowDirectory from '@/components/video-workflow-directory';
import VideoApiDirectory from '@/components/video-api-directory';
import examples from '@/lib/home-video-examples.json';
import videoApis from '@/lib/video-api-directory.json';
import {
  videoDirectory,
  videoDirectoryFaqs,
  videoWorkspaceUrl,
} from '@/lib/video-directory';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from './video.module.css';

const title = 'AI Video Workflows, Video & Image APIs | Nexscope Learn';
const description =
  'Compare five AI product video workflows and explore Nexscope Video & Image APIs. Watch examples, find image and video models, and open the matching documentation.';
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/video/' },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: '/video/',
    type: 'website',
    siteName: 'Nexscope Learn',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function VideoDirectoryPage() {
  const example = examples.examples[0];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      NEXSCOPE_ORGANIZATION,
      {
        '@type': 'CollectionPage',
        '@id': 'https://learn.nexscope.ai/video/#page',
        url: 'https://learn.nexscope.ai/video/',
        name: title,
        description,
        inLanguage: 'en',
        publisher: { '@id': NEXSCOPE_ORGANIZATION['@id'] },
        mainEntity: { '@id': 'https://learn.nexscope.ai/video/#workflow-list' },
      },
      {
        '@type': 'ItemList',
        '@id': 'https://learn.nexscope.ai/video/#workflow-list',
        name: 'Nexscope product video workflows',
        numberOfItems: videoDirectory.length,
        itemListElement: videoDirectory.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          description: `${item.bestFor} ${item.result}`,
          url: videoWorkspaceUrl(item.id),
        })),
      },
      {
        '@type': 'ItemList',
        '@id': 'https://learn.nexscope.ai/video/#apis',
        name: 'Nexscope Video & Image APIs',
        numberOfItems: videoApis.entries.length,
        itemListElement: videoApis.entries.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          url: `https://www.nexscope.ai/api-docs/${item.slug}?co-from=learn`,
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
            name: 'Video workflows',
            item: 'https://learn.nexscope.ai/video/',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: videoDirectoryFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
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
        active="video"
        campaign="video-directory"
        homepageFocus
        videoCta
      />
      <main className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="video-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Nexscope video workflow directory</p>
            <h1 id="video-title">
              AI product videos.
              <br />
              Start with what you have.
            </h1>
            <p className={styles.lead}>
              Nexscope offers five AI product video workflows for ecommerce
              sellers and creative teams: Image to Video, URL to Video, Avatar
              Video, Video Clone and Bulk Video. Choose by the material you
              already have, compare the outputs below, then open the matching
              workspace to review settings and credit estimates before
              generating.
            </p>
            <div className={styles.heroActions}>
              <a
                href={videoWorkspaceUrl('image-to-video')}
                className={styles.primary}
                data-track
                data-track-tool="image-to-video"
                data-cta-placement="video-hero"
              >
                Animate a product photo <ArrowUpRight size={17} />
              </a>
              <a href="#comparison" className={styles.secondary}>
                Compare all workflows <ArrowRight size={15} />
              </a>
              <a href="#apis" className={styles.secondary}>
                Browse Video & Image APIs <ArrowRight size={15} />
              </a>
            </div>
            <ul className={styles.benefits}>
              <li>
                <Check size={15} />5 focused workflows
              </li>
              <li>
                <Check size={15} />
                Review scripts and settings
              </li>
              <li>
                <Check size={15} />
                Check credits before generating
              </li>
            </ul>
          </div>
          <div className={styles.heroVisual}>
            <a
              href="#examples"
              aria-label={`See the official ${example.title} Image to Video example`}
              className={styles.resultFrame}
            >
              <img
                src={example.poster}
                alt={`${example.title}, official example poster`}
                width="600"
                height="800"
                fetchPriority="high"
              />
              <span className={styles.resultLabel}>
                <Play size={14} />
                Official Image to Video example
              </span>
            </a>
            {example.sourceImage && (
              <div className={styles.sourceFrame}>
                <img
                  src={example.sourceImage}
                  alt={`Original product used for ${example.title}`}
                  width="160"
                  height="200"
                />
                <span>Product photo</span>
              </div>
            )}
            <div className={styles.visualNote}>
              <span className={styles.noteDot} />
              Start with a photo.<strong>Explore the possibilities.</strong>
            </div>
          </div>
        </section>
        <section
          className={styles.section}
          id="comparison"
          aria-labelledby="compare-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>
                Choose by the job, not the model name
              </p>
              <h2 id="compare-title">
                Which AI video workflow fits your product?
              </h2>
            </div>
            <p>
              Start with photos for motion, a listing for a script, an avatar
              for a presenter, a clip for creative direction, or a batch after a
              single-product test.
            </p>
          </div>
          <nav
            className={styles.jumpLinks}
            aria-label="Video directory sections"
          >
            <a href="#workflows">Step-by-step workflows →</a>
            <a href="#examples">Watch official examples →</a>
            <a href="#costs">Credits & preparation →</a>
          </nav>
          <section
            className={styles.comparison}
            aria-label="Compare five product video workflows"
            aria-describedby="comparison-hint"
            tabIndex={0}
          >
            <table>
              <caption>
                Compare Nexscope video workflows by starting material, best fit
                and output.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Workflow</th>
                  <th scope="col">Start with</th>
                  <th scope="col">Best for</th>
                  <th scope="col">What you get</th>
                </tr>
              </thead>
              <tbody>
                {videoDirectory.map((item) => (
                  <tr key={item.id}>
                    <th scope="row">
                      <a
                        href={videoWorkspaceUrl(item.id)}
                        data-track
                        data-track-tool={item.id}
                        data-cta-placement="video-comparison"
                        aria-label={`Start ${item.name} from comparison`}
                      >
                        {item.name}{' '}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </th>
                    <td>{item.inputs}</td>
                    <td>{item.bestFor}</td>
                    <td>{item.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p id="comparison-hint" className={styles.tableHint}>
            On a small screen, scroll the table sideways to compare all columns.
          </p>
        </section>
        <VideoWorkflowDirectory />
        <section
          id="examples"
          className={styles.section}
          aria-labelledby="examples-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>
                See the starting point and result
              </p>
              <h2 id="examples-title">See what each workflow can create.</h2>
            </div>
            <p>
              Browse official Inspiration clips and production demos by
              workflow. Preview a result, then open the matching workspace for
              your product.
            </p>
          </div>
          <VideoDirectoryExamples />
          <p className={styles.caption}>
            These are Nexscope&apos;s own examples, not independent reviews or a
            promise of your result. Your output depends on the materials, model
            and settings you choose.
          </p>
        </section>
        <section
          id="costs"
          className={styles.checklist}
          aria-labelledby="prepare-title"
        >
          <div>
            <p className={styles.eyebrow}>Before your first generation</p>
            <h2 id="prepare-title">What do you need before generating?</h2>
            <p className={styles.costNote}>
              Generation uses credits. Review the current estimate in your
              chosen workspace before submitting a job.
            </p>
            <a
              className={styles.guide}
              href="https://www.nexscope.ai/pricing?co-from=learn"
              data-track
              data-track-tool="video-pricing"
              data-cta-placement="video-costs"
            >
              View official plans & credits <ArrowUpRight size={14} />
            </a>
            <a
              className={styles.guide}
              href="/ecommerce-ai-tools/ai-video-generator/"
            >
              Read the product video guide →
            </a>
          </div>
          <ol>
            <li>
              <strong>Prepare useful materials</strong>
              <p>
                Use clear images of the exact product. Have permission to use
                any reference footage and presenter assets.
              </p>
            </li>
            <li>
              <strong>Make one deliberate choice</strong>
              <p>
                Pick a single audience, selling point and intended placement.
                Check the script and estimate before generating.
              </p>
            </li>
            <li>
              <strong>Review before publishing</strong>
              <p>
                Check product shape, labels, claims and motion. Keep the useful
                result; revise the brief if it misses the mark.
              </p>
            </li>
          </ol>
        </section>
        <section className={styles.section} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Good to know</p>
              <h2 id="faq-title">AI product video questions, answered.</h2>
            </div>
          </div>
          <div className={styles.faq}>
            {videoDirectoryFaqs.map((faq) => (
              <details key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
        <VideoApiDirectory />
        <aside className={styles.developer}>
          <Code2 size={25} />
          <div>
            <h2>Building a video integration?</h2>
            <p>
              Explore the model library and its documented inputs. API
              integration is a separate path from these guided workflows.
            </p>
          </div>
          <a
            href={videoWorkspaceUrl('api')}
            data-track
            data-track-tool="video-model-library"
          >
            Explore models <ArrowUpRight size={16} />
          </a>
        </aside>
      </main>
      <LearnFooter />
    </div>
  );
}
