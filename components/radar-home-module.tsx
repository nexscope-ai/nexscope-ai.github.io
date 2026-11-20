/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { ArrowRight } from 'lucide-react';
import {
  radarPromotionPath,
  radarSocialImage,
  radarTitle,
} from '@/lib/radar-promotion';
import styles from '@/app/product-research-radar/radar-promotion.module.css';

export default function RadarHomeModule() {
  return (
    <section className={styles.homeModule} aria-labelledby="home-radar-title">
      <div className={styles.homeCopy}>
        <h2
          id="home-radar-title"
          data-learn-section="home-product-research-radar"
        >
          {radarTitle}
        </h2>
        <p>
          See what sells on Amazon and TikTok Shop, read buyer feedback, and
          find similar products from 1688 suppliers.
        </p>
        <a
          className={styles.primary}
          href={radarPromotionPath}
          data-learn-action="open_radar_promotion"
          data-cta-placement="home-radar"
        >
          Explore the Radar <ArrowRight size={17} aria-hidden="true" />
        </a>
      </div>
      <img
        className={styles.homeVisual}
        src={radarSocialImage}
        width={1200}
        height={628}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}
