'use client';
/* oxlint-disable next/no-img-element, jsx-a11y/media-has-caption -- Official Inspiration clips have no supplied caption tracks; do not invent captions. */
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import styles from './home-video-examples.module.css';

type Example = {
  title: string;
  poster: string;
  video: string;
  sourceImage: string | null;
  duration: number | null;
  ratio: string | null;
};
const destination =
  'https://www.nexscope.ai/seller/video-generation/image-to-video?co-from=learn';

export default function HomeVideoExamples({
  examples,
}: {
  examples: Example[];
}) {
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
        workflow: 'image-to-video',
        entry_page: 'learn_home',
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
              <span className={styles.exampleTag}>Official Inspiration</span>
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
                <p>Image to Video example</p>
              </div>
              <a
                href={destination}
                target="_blank"
                rel="noopener"
                data-track-tool="image-to-video"
                aria-label={`Create an image-to-video project like ${example.title}`}
              >
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
        aria-labelledby="home-example-title"
      >
        {active && (
          <div className={styles.dialogInner}>
            <div className={styles.dialogHeading}>
              <div>
                <span>OFFICIAL INSPIRATION</span>
                <h3 id="home-example-title">{active.title}</h3>
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
                This preview is unavailable. Open Image to Video to explore the
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
              data-track-tool="image-to-video"
            >
              Create your own product video <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
