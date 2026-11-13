'use client';

/* oxlint-disable next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Download,
  Eye,
  Play,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import styles from '@/app/ad-library/ad-library.module.css';
import gradient from '@/app/gradient-title.module.css';

const pageSize = 24;
const markets: Record<string, string> = {
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
};

type Ad = {
  id: string;
  advertiser: string;
  market: string;
  topic: string;
  product: string;
  reach: string;
  cover: string;
  video: string;
};

type Catalog = { ads: Ad[] };
function AdCard({
  ad,
  playing,
  canPreview,
  onPlay,
  onRemix,
}: {
  ad: Ad;
  playing: boolean;
  canPreview: boolean;
  onPlay: () => void;
  onRemix: () => void;
}) {
  const [hostedFailed, setHostedFailed] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const stopPreview = () => {
    setPreviewing(false);
    setPreviewReady(false);
  };
  const downloadUrl = `https://www.nexscope.ai/api/video-download?url=${encodeURIComponent(ad.video)}&filename=tiktok-ad-${ad.id}.mp4`;

  return (
    <article className={styles.card}>
      <div
        className={styles.media}
        onPointerEnter={(event) => {
          if (
            canPreview &&
            event.pointerType === 'mouse' &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ) {
            setPreviewing(true);
          }
        }}
        onPointerLeave={stopPreview}
      >
        {ad.cover && (
          <img
            src={ad.cover}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}
        {canPreview && previewing && (
          // Muted decorative preview. The playback button opens the full player.
          // oxlint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={`${styles.player} ${styles.hoverPreview}`}
            src={ad.video}
            data-ready={previewReady}
            aria-hidden="true"
            muted
            autoPlay
            loop
            playsInline
            onPlaying={() => setPreviewReady(true)}
            onError={stopPreview}
          />
        )}
        {playing ? (
          <>
            {!hostedFailed ? (
              // The source ads do not provide separate caption files.
              // oxlint-disable-next-line jsx-a11y/media-has-caption
              <video
                className={styles.player}
                src={ad.video}
                controls
                autoPlay
                playsInline
                onError={() => setHostedFailed(true)}
              />
            ) : (
              <output className={styles.playerStatus}>Video preview unavailable.</output>
            )}
            <button
              type="button"
              className={styles.closePlayer}
              aria-label="Close video"
              onClick={onPlay}
            >
              <X size={19} aria-hidden="true" />
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.playMark}
            aria-label={`Play ${ad.product}`}
            onClick={() => {
              stopPreview();
              onPlay();
            }}
          >
            <Play size={22} fill="currentColor" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className={styles.cardDetails}>
        <span className={styles.cardTopic}>
          {markets[ad.market]} · {ad.topic}
        </span>
        <h2>{ad.product}</h2>
        {ad.advertiser && (
          <span className={styles.advertiser}>{ad.advertiser}</span>
        )}
      </div>
      <button
        type="button"
        className={styles.remix}
        aria-haspopup="dialog"
        onClick={onRemix}
      >
        <Sparkles size={15} aria-hidden="true" /> Remix
      </button>
      <footer className={styles.cardFooter}>
        <a
          className={styles.download}
          href={downloadUrl}
          aria-label={`Download ${ad.product}`}
          title="Download MP4"
        >
          <Download size={16} aria-hidden="true" />
        </a>
        <div className={styles.stats}>
          <span title={`Reported reach: ${ad.reach}`}>
            <Eye size={15} aria-hidden="true" />
            <span className="sr-only">Reported reach: </span>
            {ad.reach}
          </span>
        </div>
      </footer>
    </article>
  );
}

function RemixDialog({
  ad,
  cloneUrl,
  onClose,
}: {
  ad: Ad;
  cloneUrl: string;
  onClose: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<'copied' | 'failed'>();
  const videoUrl = ad.video;

  const copyVideoLink = async () => {
    let nextTab: Window | null = null;
    try {
      const copying = navigator.clipboard.writeText(videoUrl);
      nextTab = window.open('about:blank', '_blank');
      if (nextTab) nextTab.opener = null;
      await copying;
      setCopyStatus('copied');
      nextTab?.location.replace(cloneUrl);
    } catch {
      nextTab?.close();
      setCopyStatus('failed');
    }
  };

  return (
    <div className={styles.confirmation}>
      <header className={styles.dialogHeader}>
        <h2 id="ad-remix-title">Remix this ad for your product</h2>
        <button type="button" aria-label="Close" onClick={onClose}>
          <X size={22} aria-hidden="true" />
        </button>
        <p id="ad-remix-description">
          Copy this video’s link, then paste it into Video Clone as a reference.
        </p>
      </header>
      <div className={styles.remixReference}>
        {ad.cover && <img src={ad.cover} alt="" width={48} height={58} />}
        <div>
          <span>{ad.advertiser || markets[ad.market]}</span>
          <strong>{ad.product}</strong>
        </div>
      </div>
      {copyStatus === 'failed' && (
        <input
          className={styles.copyFallback}
          aria-label="Video link"
          readOnly
          value={videoUrl}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
      {copyStatus && (
        <output className={styles.previewTip} data-copied={copyStatus === 'copied'}>
          {copyStatus === 'copied' && <Check size={16} aria-hidden="true" />}
          {copyStatus === 'copied'
            ? 'Video link copied.'
            : 'Select the video link above to copy it.'}
        </output>
      )}
      <div className={styles.actions}>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        {copyStatus ? (
          <a
            href={cloneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.create}
            data-track-tool="video-replication"
            data-cta-placement="ad-library-preview"
          >
            Open Video Clone <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            className={styles.create}
            data-learn-action="copy_and_open_video_clone"
            data-learn-item="video-replication"
            onClick={() => void copyVideoLink()}
          >
            Copy link &amp; open Video Clone <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export function AdLibrary({
  catalog,
  cloneUrl,
  showAnnualOffer,
}: {
  catalog: Catalog;
  cloneUrl: string;
  showAnnualOffer: boolean;
}) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(pageSize);
  const [selected, setSelected] = useState<Ad | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const loadMore = useRef<HTMLButtonElement>(null);
  const masonry = useRef<HTMLDivElement>(null);
  const search = query.trim().toLowerCase();
  const results = catalog.ads
    .filter(
      (ad) =>
        !search ||
        [ad.advertiser, ad.product, ad.topic, markets[ad.market], ad.id].some(
          (value) => value?.toLowerCase().includes(search),
        ),
    );
  const visible = results.slice(0, limit);
  const visibleCount = visible.length;
  const hasMore = visible.length < results.length;

  useLayoutEffect(() => {
    const grid = masonry.current;
    if (!grid || !('ResizeObserver' in window)) return;

    const cards = Array.from(grid.children) as HTMLElement[];
    const pack = () => {
      const style = getComputedStyle(grid);
      const unit = Number.parseFloat(style.getPropertyValue('--masonry-unit'));
      const gap = Number.parseFloat(style.columnGap);
      // Measure all cards before writing spans so a resize needs only one layout pass.
      const spans = cards.map((card) =>
        Math.ceil((card.getBoundingClientRect().height + gap) / unit),
      );
      cards.forEach((card, index) => {
        card.style.setProperty('--masonry-span', String(spans[index]));
      });
      grid.dataset.packed = 'true';
    };
    pack();
    const observer = new ResizeObserver(pack);
    cards.forEach((card) => observer.observe(card));
    observer.observe(grid);
    return () => observer.disconnect();
  }, [visibleCount, query]);

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);

  useEffect(() => {
    const button = loadMore.current;
    if (!button || !hasMore || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          setLimit(limit + pageSize);
        }
      },
      { rootMargin: '0px 0px 240px' },
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, [hasMore, limit, query]);

  return (
    <>
      <section className={styles.hero} aria-labelledby="ad-library-title">
        <div className={styles.heroIntro}>
          <div>
            <h1 id="ad-library-title" className={gradient.text}>
              Ad Library
            </h1>
            <p>Find a TikTok ad you like and use it as a reference for your own product video.</p>
          </div>
          <a
            className={styles.pricing}
            href="https://www.nexscope.ai/pricing?co-from=learn"
            data-track-tool="pricing"
            data-cta-placement="ad-library-hero"
          >
            {showAnnualOffer && <strong>50% off your first year</strong>}
            <span>
              View pricing <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </a>
        </div>
        <div className={styles.heroActions}>
          <label className={styles.search}>
            <Search size={21} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search ads"
              placeholder="Search by product, advertiser, or keyword"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLimit(pageSize);
                setPlayingId(null);
              }}
            />
          </label>
          <a className={styles.faqLink} href="#ad-library-faq">How it works <span aria-hidden="true">↓</span></a>
        </div>
      </section>
      {visibleCount === 0 && (
        <output className={styles.empty}>No ads match your search.</output>
      )}
      {visibleCount > 0 && (
        <div className={styles.masonry} ref={masonry}>
          {visible.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              playing={playingId === ad.id}
              canPreview={!playingId && !selected}
              onPlay={() => setPlayingId(playingId === ad.id ? null : ad.id)}
              onRemix={() => {
                setPlayingId(null);
                setSelected(ad);
              }}
            />
          ))}
        </div>
      )}
      {hasMore && (
        <button
          type="button"
          className={styles.more}
          ref={loadMore}
          onClick={() => setLimit(limit + pageSize)}
        >
          Load more ads
        </button>
      )}
      <dialog
        className={styles.dialog}
        ref={dialog}
        aria-labelledby="ad-remix-title"
        aria-describedby="ad-remix-description"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <RemixDialog
            key={selected.id}
            ad={selected}
            cloneUrl={cloneUrl}
            onClose={() => dialog.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}
