/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Image,
  Search,
} from 'lucide-react';
import LearnFooter from '@/components/learn-footer';
import MarketingHeader from '@/components/marketing-header';
import { radarGuides } from '@/lib/radar-guides';
import {
  liveRadarUrl,
  radarDemoImage,
  radarGuidePath,
  radarPromotionPath,
  radarTitle,
} from '@/lib/radar-promotion';
import gradientTitle from '../gradient-title.module.css';
import styles from './radar-promotion.module.css';

const description =
  'Research Amazon and TikTok Shop products by market. Compare sales and customer reviews, then find similar 1688 suppliers by product photo.';
const previewImage = {
  url: `https://learn.nexscope.ai${radarDemoImage}`,
  width: 945,
  height: 844,
  alt: 'Product Research Radar globe with the United States selected.',
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
    images: [previewImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: radarTitle,
    description,
    images: [previewImage],
  },
};

const workflow = [
  {
    title: 'Find products',
    description:
      'Pick a platform and market. Browse best sellers or start from a product keyword. On Amazon, you can also check related search phrases.',
    icon: Search,
  },
  {
    title: 'Check what drives sales',
    description:
      'Compare reported sales and read customer reviews. For TikTok Shop, look at video, livestream and marketplace sales and open related product videos.',
    icon: BarChart3,
  },
  {
    title: 'Find similar 1688 offers',
    description:
      'Search with a product photo. Open order details to check the selected variant, minimum order, quantity pricing and available shipping information.',
    icon: Image,
  },
];

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
              See what sells on Amazon and TikTok Shop. Check why buyers choose
              it, then look for similar products on 1688.
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
              Data credits.
            </p>
          </div>
          <figure className={styles.preview}>
            <img
              src={radarDemoImage}
              width={945}
              height={844}
              alt="The Product Research Radar globe showing the United States as the selected market and locked market markers."
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              Radar preview with the United States selected
            </figcaption>
          </figure>
        </section>
        <section
          id="research-workflow"
          className={styles.section}
          aria-labelledby="workflow-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="workflow-title" data-learn-section="radar-workflow">
              What you can check before sourcing
            </h2>
            <p>
              Start with one market and one product. Use the results to decide
              what to test or ask a supplier.
            </p>
          </div>
          <ol className={styles.workflow}>
            {workflow.map(({ title, description, icon: Icon }) => (
              <li key={title}>
                <Icon size={22} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
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
