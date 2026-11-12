'use client';

/* oxlint-disable next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Copy,
  Download,
  Play,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import styles from '@/app/ad-library/ad-library.module.css';

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
  reach: string;
  maxReach: number;
  firstShown: string;
  lastShown: string;
  video: string;
  poster: string;
  posterWidth: number;
  posterHeight: number;
};

type Catalog = { origin: string; ads: Ad[] };
const savedAdsKey = 'nexscope-ad-library-saved';

function adSource(id: string) {
  return `https://library.tiktok.com/ads/detail/?ad_id=${id}`;
}

function AdCard({
  ad,
  origin,
  active,
  saved,
  onPreview,
  onSave,
  onDetails,
}: {
  ad: Ad;
  origin: string;
  active: boolean;
  saved: boolean;
  onPreview: (active: boolean) => void;
  onSave: () => void;
  onDetails: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <article className={styles.card}>
      <div
        className={styles.poster}
        data-previewing={active && ready}
        style={{ aspectRatio: `${ad.posterWidth} / ${ad.posterHeight}` }}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse' || failed || active) return;
          if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          setReady(false);
          onPreview(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') onPreview(false);
        }}
      >
        <img
          src={origin + ad.poster}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
        {active && !failed && (
          /* oxlint-disable-next-line jsx-a11y/media-has-caption -- Source ads do not supply caption tracks. */
          <video
            src={origin + ad.video}
            muted
            autoPlay
            playsInline
            aria-hidden="true"
            onPlaying={() => setReady(true)}
            onEnded={() => onPreview(false)}
            onError={() => {
              setFailed(true);
              setReady(false);
            }}
          />
        )}
        <div className={styles.posterInfo}>
          <span>
            {markets[ad.market]} · {ad.topic}
          </span>
          <h2>{ad.advertiser}</h2>
        </div>
        <button
          type="button"
          className={styles.play}
          aria-label={`Open ad by ${ad.advertiser}`}
          aria-haspopup="dialog"
          onClick={onDetails}
        >
          <Play size={22} fill="currentColor" aria-hidden="true" />
        </button>
        <div className={styles.cardActions}>
          <button
            type="button"
            aria-pressed={saved}
            aria-label="Save ad"
            title="Save ad"
            onClick={onSave}
          >
            <Star
              size={19}
              fill={saved ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      <p className={styles.stats} title={`Reported reach: ${ad.reach}`}>
        <Users size={16} aria-hidden="true" />
        <span className="sr-only">Reported reach: </span>
        {ad.reach}
      </p>
    </article>
  );
}

function AdPreview({
  ad,
  origin,
  cloneUrl,
  onClose,
}: {
  ad: Ad;
  origin: string;
  cloneUrl: string;
  onClose: () => void;
}) {
  const videoUrl = origin + ad.video;
  const [videoFailed, setVideoFailed] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'copied' | 'failed'>();
  const [downloadStatus, setDownloadStatus] = useState<'loading' | 'failed'>();

  const copyVideoLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  const downloadVideo = async () => {
    setDownloadStatus('loading');
    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Video download failed');
      const file = await response.blob();
      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `tiktok-ad-${ad.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
      setDownloadStatus(undefined);
    } catch {
      setDownloadStatus('failed');
    }
  };

  return (
    <div className={styles.previewLayout}>
      <div className={styles.previewMedia}>
        {videoFailed ? (
          <p className={styles.videoError}>This video could not be loaded.</p>
        ) : (
          /* oxlint-disable-next-line jsx-a11y/media-has-caption -- Third-party ads have no supplied caption tracks. */
          <video
            controls
            autoPlay
            playsInline
            src={videoUrl}
            poster={origin + ad.poster}
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>
      <div className={styles.previewInfo}>
        <header className={styles.dialogHeader}>
          <div>
            <p className={styles.market}>
              {markets[ad.market]} · {ad.topic}
            </p>
            <h2 id="ad-preview-title">{ad.advertiser}</h2>
          </div>
          <button type="button" aria-label="Close ad preview" onClick={onClose}>
            <X size={22} aria-hidden="true" />
          </button>
        </header>
        <dl className={styles.details}>
          <div>
            <dt>Reported reach</dt>
            <dd>{ad.reach}</dd>
          </div>
          <div>
            <dt>First shown</dt>
            <dd>
              <time dateTime={ad.firstShown}>{ad.firstShown}</time>
            </dd>
          </div>
          <div>
            <dt>Last shown</dt>
            <dd>
              <time dateTime={ad.lastShown}>{ad.lastShown}</time>
            </dd>
          </div>
        </dl>
        <div className={styles.previewLinks}>
          <button type="button" onClick={() => void copyVideoLink()}>
            <Copy size={16} aria-hidden="true" /> Copy video link
          </button>
          <a href={adSource(ad.id)} target="_blank" rel="noopener noreferrer">
            View on TikTok <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <footer className={styles.previewFooter}>
          {copyStatus === 'failed' && (
            <input
              className={styles.copyFallback}
              aria-label="Video link"
              readOnly
              value={videoUrl}
              onFocus={(event) => event.currentTarget.select()}
            />
          )}
          <output className={styles.previewTip}>
            {copyStatus === 'copied' && 'Video link copied. '}
            {copyStatus === 'failed' &&
              'Select the video link above to copy it. '}
            Download the MP4 and upload it as a reference in Video Clone.
          </output>
          {downloadStatus === 'failed' && (
            <output className={styles.downloadError}>
              Download failed. Try again or{' '}
              <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                open the MP4
              </a>
              .
            </output>
          )}
          <div className={styles.actions}>
            <button
              type="button"
              disabled={downloadStatus === 'loading'}
              onClick={() => void downloadVideo()}
            >
              <Download size={16} aria-hidden="true" />
              {downloadStatus === 'loading' ? 'Downloading…' : 'Download'}
            </button>
            <a
              href={cloneUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.create}
              data-track-tool="video-replication"
              data-cta-placement="ad-library-preview"
              onClick={() => void copyVideoLink()}
            >
              Go to Video Clone <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function AdLibrary({
  catalog,
  cloneUrl,
}: {
  catalog: Catalog;
  cloneUrl: string;
}) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(pageSize);
  const [preview, setPreview] = useState<string | null>(null);
  const [savedAds, setSavedAds] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<Ad | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const loadMore = useRef<HTMLButtonElement>(null);
  const masonry = useRef<HTMLDivElement>(null);
  const search = query.trim().toLowerCase();
  const results = catalog.ads
    .filter(
      (ad) =>
        (!savedOnly || savedAds.includes(ad.id)) &&
        (!search ||
          [ad.advertiser, ad.topic, markets[ad.market], ad.id].some((value) =>
            value?.toLowerCase().includes(search),
          )),
    )
    .sort((a, b) => b.maxReach - a.maxReach);
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
  }, [visibleCount, query, savedOnly, savedAds]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored: unknown = JSON.parse(
          localStorage.getItem(savedAdsKey) ?? '[]',
        );
        if (Array.isArray(stored))
          setSavedAds(stored.filter((value) => typeof value === 'string'));
      } catch {
        // Browsing and session saves still work if storage is disabled.
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

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
  }, [hasMore, limit, query, savedOnly]);

  return (
    <>
      <section aria-label="Find TikTok ads">
        <label className={styles.search}>
          <Search size={21} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search ads"
            placeholder="Search by advertiser or keyword"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(pageSize);
              setPreview(null);
            }}
          />
        </label>
        <div className={styles.resultsBar}>
          <output className={styles.results}>
            {results.length
              ? `Showing ${visible.length} of ${results.length} ads`
              : savedOnly && savedAds.length === 0
                ? 'You haven’t saved any ads yet.'
                : 'No ads match your search.'}
          </output>
          <button
            className={styles.savedFilter}
            type="button"
            aria-pressed={savedOnly}
            onClick={() => {
              setSavedOnly(!savedOnly);
              setLimit(pageSize);
              setPreview(null);
            }}
          >
            <Star size={16} aria-hidden="true" /> Saved ads
          </button>
        </div>
      </section>
      {visibleCount > 0 && (
        <div className={styles.masonry} ref={masonry}>
          {visible.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              origin={catalog.origin}
              active={preview === ad.id}
              saved={savedAds.includes(ad.id)}
              onPreview={(active) =>
                setPreview((current) =>
                  active ? ad.id : current === ad.id ? null : current,
                )
              }
              onSave={() => {
                const next = savedAds.includes(ad.id)
                  ? savedAds.filter((id) => id !== ad.id)
                  : [...savedAds, ad.id];
                setSavedAds(next);
                try {
                  localStorage.setItem(savedAdsKey, JSON.stringify(next));
                } catch {}
              }}
              onDetails={() => {
                setPreview(null);
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
        aria-labelledby="ad-preview-title"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <AdPreview
            key={selected.id}
            ad={selected}
            origin={catalog.origin}
            cloneUrl={cloneUrl}
            onClose={() => dialog.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}
