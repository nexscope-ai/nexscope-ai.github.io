/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import LearnFooter from '@/components/learn-footer';
import MarketingHeader from '@/components/marketing-header';
import { radarFeatures, radarQuestions } from '@/lib/radar-features';
import { radarGuides } from '@/lib/radar-guides';
import {
  liveRadarUrl,
  radarGuidePath,
  radarPromotionPath,
  radarSocialImage,
  radarTitle,
} from '@/lib/radar-promotion';
import gradientTitle from '../gradient-title.module.css';
import styles from './radar-promotion.module.css';
import RadarScreenshot from './radar-screenshot';

const description =
  'See how Nexscope Product Research Radar works. Find Amazon and TikTok Shop products, compare sales, read reviews and find similar 1688 offers.';
const shareImage = {
  url: `https://learn.nexscope.ai${radarSocialImage}`,
  width: 1200,
  height: 628,
  alt: 'Nexscope Product Research Radar. See what sells by market on Amazon and TikTok Shop.',
};

export const metadata: Metadata = {
  title: 'Product Research Radar for Amazon and TikTok Shop | Nexscope',
  description,
  alternates: { canonical: radarPromotionPath },
  openGraph: {
    title: radarTitle,
    description,
    url: radarPromotionPath,
    type: 'website',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: radarTitle,
    description,
    images: [shareImage],
  },
};

export default function RadarPromotionPage() {
  return (
    <div className={styles.page}>
      <MarketingHeader campaign="product-research-radar" />
      <main id="main" className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/">Nexscope Learn</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{radarTitle}</span>
        </nav>
        <section className={styles.hero} aria-labelledby="radar-title">
          <div className={styles.heroCopy}>
            <h1 id="radar-title">
              Product Research
              <br />
              <em className={gradientTitle.text}>Radar</em>
            </h1>
            <p className={styles.lead}>
              Nexscope Product Research Radar helps sellers decide which Amazon
              or TikTok Shop products are worth testing. Pick a market, find
              listings and compare their sales and customer reviews. Then use a
              listing photo to find similar 1688 offers and check order terms
              before contacting a supplier.
            </p>
            <a
              className={styles.primary}
              href={liveRadarUrl}
              data-learn-action="open_live_radar"
              data-cta-placement="radar-hero"
            >
              Open Product Research Radar{' '}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <p className={styles.access}>
              Browse public rankings. Live research requires sign-in and uses
              Data credits. <a href="/pricing/">See Data plans</a>.
            </p>
          </div>
          <img
            className={styles.preview}
            src={radarSocialImage}
            width={shareImage.width}
            height={shareImage.height}
            alt={shareImage.alt}
            fetchPriority="high"
            decoding="async"
          />
        </section>
        <section
          id="research-workflow"
          className={styles.section}
          aria-labelledby="workflow-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="workflow-title" data-learn-section="radar-workflow">
              How to research a product with Radar
            </h2>
            <p>
              Start with your target market. Each screenshot shows where to look
              and what the result can help you decide.
            </p>
          </div>
          <nav
            className={styles.featureJump}
            aria-label="Jump to a Radar feature"
          >
            <ul>
              {radarFeatures.map(({ id, title }) => (
                <li key={id}>
                  <a href={`#${id}`}>{title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.features}>
            {radarFeatures.map(({ id, title, answer, detail, figures }) => (
              <section
                id={id}
                key={id}
                className={styles.feature}
                aria-labelledby={`${id}-title`}
              >
                <div className={styles.featureCopy}>
                  <h3 id={`${id}-title`}>{title}</h3>
                  <p>{answer}</p>
                  <p>{detail}</p>
                </div>
                <div className={styles.featureImages}>
                  {figures.map((figure) => (
                    <RadarScreenshot key={figure.src} figure={figure} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
        <section
          className={styles.section}
          id="questions"
          aria-labelledby="questions-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="questions-title">Frequently asked questions</h2>
          </div>
          <dl className={styles.questions}>
            {radarQuestions.map(({ question, answer }) => (
              <div key={question}>
                <dt>{question}</dt>
                <dd>{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section
          className={styles.section}
          id="guides"
          aria-labelledby="guides-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="guides-title" data-learn-section="radar-guides">
              Product research guides
            </h2>
            <p>
              Follow a worked example, then apply the same checks to your own
              shortlist.
            </p>
          </div>
          <ul className={styles.guideGrid}>
            {radarGuides.map((guide) => (
              <li key={guide.slug}>
                <a
                  href={radarGuidePath(guide.slug)}
                  data-learn-action="open_radar_guide"
                  data-learn-item={guide.slug}
                >
                  <span className={styles.topic}>{guide.topic}</span>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <span className={styles.readLink}>
                    Read guide <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
