'use client';

/* oxlint-disable next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Link2,
  Pause,
  Play,
  Search,
  Star,
  Volume2,
  VolumeX,
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

type Catalog = { origin: string; capturedOn: string; ads: Ad[] };
const savedAdsKey = 'nexscope-ad-library-saved';
const cardDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

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
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pinned, setPinned] = useState(false);

  const toggle = () => {
    if (!active) {
      setPinned(true);
      setReady(false);
      setMuted(true);
      onPreview(true);
      return;
    }
    const player = video.current;
    if (!player) return;
    if (player.paused) {
      setPinned(true);
      void player.play().catch(() => setFailed(true));
    } else {
      player.pause();
    }
  };

  return (
    <article className={styles.card}>
      <div
        className={styles.poster}
        data-previewing={active && ready}
        style={{ aspectRatio: `${ad.posterWidth} / ${ad.posterHeight}` }}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse' || failed || active) return;
          if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          setPinned(false);
          setMuted(true);
          setReady(false);
          onPreview(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse' && !pinned) onPreview(false);
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
            ref={video}
            src={origin + ad.video}
            muted={muted}
            autoPlay
            playsInline
            aria-hidden="true"
            onPlaying={() => {
              setPlaying(true);
              setReady(true);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => onPreview(false)}
            onError={() => {
              setFailed(true);
              setReady(false);
              setPlaying(false);
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
          aria-label={`${active && playing ? 'Pause' : 'Play'} ad by ${ad.advertiser}`}
          onClick={failed ? onDetails : toggle}
        >
          {active && playing ? (
            <Pause size={18} fill="currentColor" aria-hidden="true" />
          ) : (
            <Play size={22} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        {active && ready && (
          <button
            type="button"
            className={styles.sound}
            aria-label={muted ? 'Unmute ad' : 'Mute ad'}
            onClick={() => {
              if (video.current) video.current.muted = !muted;
              setMuted(!muted);
            }}
          >
            {muted ? (
              <VolumeX size={17} aria-hidden="true" />
            ) : (
              <Volume2 size={17} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      <dl className={styles.stats}>
        <div>
          <dt>Reach</dt>
          <dd>{ad.reach}</dd>
        </div>
        <div>
          <dt>First shown</dt>
          <dd>
            <time dateTime={ad.firstShown}>
              {cardDate.format(new Date(ad.firstShown))}
            </time>
          </dd>
        </div>
        <div>
          <dt>Last shown</dt>
          <dd>
            <time dateTime={ad.lastShown}>
              {cardDate.format(new Date(ad.lastShown))}
            </time>
          </dd>
        </div>
      </dl>
      <div className={styles.cardActions}>
        <button type="button" className={styles.adDetails} onClick={onDetails}>
          Ad details
        </button>
        <div>
          <a
            href={adSource(ad.id)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open original TikTok ad"
          >
            <Link2 size={19} aria-hidden="true" />
          </a>
          <button
            type="button"
            aria-pressed={saved}
            aria-label="Save ad"
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
    </article>
  );
}

export function AdLibrary({
  catalog,
  createUrl,
}: {
  catalog: Catalog;
  createUrl: string;
}) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(pageSize);
  const [preview, setPreview] = useState<string | null>(null);
  const [savedAds, setSavedAds] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selected, setSelected] = useState<Ad | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
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
                setVideoFailed(false);
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
      <p className={styles.source}>
        Source: TikTok Commercial Content Library · Snapshot from{' '}
        {catalog.capturedOn}
      </p>
      <dialog
        className={styles.dialog}
        ref={dialog}
        aria-labelledby="ad-preview-title"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <>
            <div className={styles.dialogHeader}>
              <div>
                <span className={styles.market}>
                  {markets[selected.market]} · {selected.topic}
                </span>
                <h2 id="ad-preview-title">{selected.advertiser}</h2>
              </div>
              <button
                type="button"
                aria-label="Close ad preview"
                onClick={() => dialog.current?.close()}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            {videoFailed ? (
              <p className={styles.videoError}>
                This video could not be loaded.
              </p>
            ) : (
              /* oxlint-disable-next-line jsx-a11y/media-has-caption -- Third-party ads have no supplied caption tracks. */
              <video
                key={selected.id}
                controls
                autoPlay
                playsInline
                src={catalog.origin + selected.video}
                poster={catalog.origin + selected.poster}
                onError={() => setVideoFailed(true)}
              />
            )}
            <p className={styles.details}>
              Reported reach {selected.reach} · First shown{' '}
              {selected.firstShown}
            </p>
            <div className={styles.actions}>
              <a
                href={adSource(selected.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on TikTok <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a
                href={createUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.create}
                data-track-tool="image-to-video"
                data-cta-placement="ad-library-preview"
              >
                Create from a product image{' '}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
