/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { RadarFigure } from '@/lib/radar-features';
import styles from './radar-promotion.module.css';

export default function RadarScreenshot({ figure }: { figure: RadarFigure }) {
  return (
    <figure className={styles.articleFigure}>
      <a
        href={figure.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full-size screenshot. ${figure.alt}`}
      >
        <img
          src={figure.src}
          width={figure.width}
          height={figure.height}
          alt={figure.alt}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}
