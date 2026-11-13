'use client';
/* oxlint-disable next/no-img-element, jsx-a11y/media-has-caption -- Official Inspiration clips have no supplied caption tracks; do not invent captions. */
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import styles from './home-video-examples.module.css';
import { videoLandingUrl, type VideoWorkflowId } from '@/lib/video-directory';

type Example = {
  title: string;
  poster: string;
  video: string;
  sourceImage: string | null;
  duration: number | null;
  ratio: string | null;
};
export default function HomeVideoExamples({
  examples,
  entryPage = 'learn_home',
  workflow = 'image-to-video',
  workflowName = 'Image to Video',
  exampleLabel = 'Official Inspiration',
  showWorkflowCta = false,
}: {
  examples: Example[];
  entryPage?: string;
  workflow?: VideoWorkflowId;
  workflowName?: string;
  exampleLabel?: string;
  showWorkflowCta?: boolean;
}) {
  const destination = videoLandingUrl(workflow);
  const headingId = useId();
  const [active, setActive] = useState<Example | null>(null);
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const firstPlay = useRef(false);
  useEffect(() => {
    if (!active || !dialog.current) return;
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
  const close = () => {
    dialog.current?.close();
    setActive(null);
  };
  const play = () => {
    if (firstPlay.current || !active) return;
    firstPlay.current = true;
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.(
      'event',
      'video_example_play',
      {
        example_title: active.title,
        workflow,
        entry_page: entryPage,
      },
    );
  };
  return (
    <>
      <div className={styles.grid}>
        {examples.map((example) => (
          <article className={styles.card} key={example.video}>
            <button
              type="button"
              className={styles.preview}
              aria-label={`Preview ${example.title}`}
              data-learn-action="open_video_preview"
              data-learn-item={workflow}
              onClick={() => {
                firstPlay.current = false;
                setFailed(false);
                setActive(example);
              }}
            >
              <img
                src={example.poster}
                alt={example.title}
                width="600"
                height="800"
                loading="lazy"
                decoding="async"
              />
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.play} aria-hidden="true">
                <Play size={21} fill="currentColor" />
              </span>
              <span className={styles.exampleTag}>{exampleLabel}</span>
              {example.sourceImage && (
                <img
                  className={styles.source}
                  src={example.sourceImage}
                  alt={`Source for ${example.title}`}
                  width="48"
                  height="64"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className={styles.duration}>
                {example.duration ? `${example.duration}s` : 'Video'}
                {example.ratio ? ` · ${example.ratio}` : ''}
              </span>
            </button>
            <div className={styles.caption}>
              <div>
                <h3>{example.title}</h3>
                <p>{workflowName} example</p>
              </div>
              <a
                className={showWorkflowCta ? styles.workflowLink : undefined}
                href={destination}
                target="_blank"
                rel="noopener"
                data-track
                data-track-tool={workflow}
                aria-label={`Open ${workflowName} for a project like ${example.title}`}
              >
                {showWorkflowCta && `Try ${workflowName}`}
                <ArrowUpRight size={19} />
              </a>
            </div>
          </article>
        ))}
      </div>
      <dialog
        className={styles.dialog}
        ref={dialog}
        onClose={() => setActive(null)}
        onCancel={() => setActive(null)}
        aria-labelledby={headingId}
      >
        {active && (
          <div className={styles.dialogInner}>
            <div className={styles.dialogHeading}>
              <div>
                <span>{exampleLabel.toUpperCase()}</span>
                <h3 id={headingId}>{active.title}</h3>
              </div>
              <button
                type="button"
                aria-label="Close video preview"
                onClick={close}
              >
                <X size={21} />
              </button>
            </div>
            {failed ? (
              <output className={styles.error}>
                This preview is unavailable. Open {workflowName} to explore the
                examples.
              </output>
            ) : (
              <video
                src={active.video}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                preload="none"
                onPlay={play}
                onError={() => setFailed(true)}
                aria-label={`${active.title} video preview`}
              />
            )}
            <a
              className={styles.dialogCta}
              href={destination}
              target="_blank"
              rel="noopener"
              data-track
              data-track-tool={workflow}
            >
              Create with {workflowName} <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
