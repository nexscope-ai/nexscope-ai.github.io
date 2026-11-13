'use client';
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { useState } from 'react';
import {
  ArrowUpRight,
  ImagePlay,
  Link2,
  Video,
  Clapperboard,
  Layers3,
  ArrowRight,
} from 'lucide-react';
import { videoDirectory, videoLandingUrl } from '@/lib/video-directory';
import examples from '@/lib/video-directory-examples.json';
import styles from '@/app/video/video.module.css';

const icons = {
  'image-to-video': ImagePlay,
  'url-to-video': Link2,
  'product-talking-video': Video,
  'video-replication': Clapperboard,
  'bulk-video': Layers3,
};

export default function VideoWorkflowDirectory() {
  const [material, setMaterial] = useState('all');
  const visible = videoDirectory.filter(
    (item) => material === 'all' || item.material === material,
  );
  return (
    <section
      id="workflows"
      className={styles.section}
      aria-labelledby="workflow-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Choose your starting material</p>
          <h2 id="workflow-title">A workflow for what you already have.</h2>
        </div>
        <p>
          Start with one product and a clear idea. You can refine the script and
          output settings in the workspace.
        </p>
      </div>
      <fieldset className={styles.filters} aria-label="Filter video workflows">
        <button
          type="button"
          aria-pressed={material === 'all'}
          onClick={() => setMaterial('all')}
          data-learn-action="filter_workflow"
          data-learn-item="all"
        >
          All workflows
        </button>
        {videoDirectory.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={material === item.material}
            onClick={() => setMaterial(item.material)}
            data-learn-action="filter_workflow"
            data-learn-item={item.id}
          >
            {item.label}
          </button>
        ))}
      </fieldset>
      <output className={styles.count} aria-live="polite">
        {visible.length} {visible.length === 1 ? 'workflow' : 'workflows'}{' '}
        {material === 'all' ? 'to explore' : 'for your selection'}
      </output>
      <div className={styles.cards}>
        {videoDirectory.map((item, index) => {
          const Icon = icons[item.id];
          const example = examples.workflows[item.id]?.[0];
          return (
            <article
              key={item.id}
              hidden={material !== 'all' && material !== item.material}
              className={styles.card}
            >
              {example && (
                <a
                  className={styles.workflowPreview}
                  href={videoLandingUrl(item.id)}
                  data-track
                  data-track-tool={item.id}
                  data-cta-placement="video-workflow-preview"
                  aria-label={`Explore ${item.name}`}
                >
                  <img
                    src={example.poster}
                    alt={`${item.name}: ${example.title}`}
                    width="640"
                    height="360"
                    loading="lazy"
                  />
                  <span className={styles.previewLabel}>
                    <Icon size={15} aria-hidden="true" />
                    {item.name}
                  </span>
                  <span className={styles.previewArrow} aria-hidden="true">
                    <ArrowUpRight size={20} />
                  </span>
                </a>
              )}
              <div className={styles.cardTop}>
                <span className={styles.icon}>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className={styles.tag}>{item.tag}</span>
              </div>
              <h3>{item.name}</h3>
              <p className={styles.workflowName}>{item.title}</p>
              <p className={styles.description}>{item.description}</p>
              <dl className={styles.fitDetails}>
                <div>
                  <dt>Best for</dt>
                  <dd>{item.bestFor}</dd>
                </div>
                <div>
                  <dt>Output</dt>
                  <dd>{item.result}</dd>
                </div>
              </dl>
              <details className={styles.workflowDetails} data-learn-detail={item.id}>
                <summary>
                  What to prepare & how it works{' '}
                  <ArrowRight size={14} aria-hidden="true" />
                </summary>
                <div className={styles.input}>
                  <strong>Bring</strong>
                  <span>{item.inputs}</span>
                </div>
                <ol className={styles.steps}>
                  {item.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className={styles.boundary}>{item.boundary}</p>
              </details>
              <div className={styles.cardActions}>
                <a
                  className={styles.primary}
                  href={videoLandingUrl(item.id)}
                  data-track
                  data-track-tool={item.id}
                  data-cta-placement={`video-directory-${index + 1}`}
                >
                  Start {item.name}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a
                  className={styles.guide}
                  href={item.guide}
                  data-track-tool={`${item.id}-guide`}
                >
                  {item.guideLabel} →
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
