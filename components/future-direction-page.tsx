/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { DirectionFollow } from './direction-follow';
import { DirectionPreview } from './direction-preview';
import { NexscopeLogo } from './nexscope-logo';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';
import { futureDirections, type FutureDirection } from '@/lib/future-directions';
import styles from './future-directions.module.css';

export function directionMetadata(kind: FutureDirection): Metadata {
  const direction = futureDirections[kind];
  const title = direction.title + ' | Nexscope Learn';
  const url = '/' + direction.slug + '/';
  return {
    title, description: direction.description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: 'website', siteName: 'Nexscope', title, description: direction.description, url, images: [DEFAULT_SOCIAL_IMAGE] },
    twitter: { card: 'summary_large_image', title, description: direction.description, images: [DEFAULT_SOCIAL_IMAGE] },
  };
}

export function DirectionPage({ kind }: { kind: FutureDirection }) {
  const direction = futureDirections[kind];

  return (
    <div className={styles.page} data-direction={kind}>
      <header className={styles.header}>
        <div className={styles.wrap}>
          <a href="/" aria-label="Nexscope Learn home"><NexscopeLogo /></a>
          <a href="/" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> Nexscope Learn</a>
        </div>
      </header>
      <main id="main" className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="direction-title">
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{direction.title}</p>
            <h1 id="direction-title">{direction.headline}</h1>
            <p className={styles.lede}>{direction.intro}</p>
            <DirectionFollow key={direction.feature} feature={direction.feature} />
          </div>
          <DirectionPreview kind={kind} />
        </section>
        <section className={styles.workflow} aria-labelledby="direction-workflow">
          <h2 id="direction-workflow">How it could work</h2>
          <p>{direction.scenario}</p>
          <ol>
            {direction.steps.map(([title, description]) => (
              <li key={title}><h3>{title}</h3><p>{description}</p></li>
            ))}
          </ol>
        </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.wrap}>
          <a href="/">Nexscope Learn</a>
          <a href="#analytics-preferences">Cookie settings</a>
        </div>
      </footer>
    </div>
  );
}
