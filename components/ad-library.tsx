'use client';

/* oxlint-disable next/no-img-element */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Download,
  Eye,
  LoaderCircle,
  Play,
  Search,
  Sparkles,
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
  product: string;
  reach?: string;
  views?: number;
  cover: string;
  video: string;
  sourceUrl: string;
};

type Catalog = { ads: Ad[] };

function adDownloadUrl(ad: Ad) {
  return `https://www.nexscope.ai/api/video-download?url=${encodeURIComponent(ad.video)}&filename=tiktok-ad-${ad.id}.mp4`;
}

const AdCard = memo(function AdCard({
  ad,
  playing,
  canPreview,
  onPlay,
  onRemix,
}: {
  ad: Ad;
  playing: boolean;
  canPreview: boolean;
  onPlay: (id: string) => void;
  onRemix: (ad: Ad) => void;
}) {
  const [previewing, setPreviewing] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(previewTimer.current), []);
  const stopPreview = () => {
    clearTimeout(previewTimer.current);
    setPreviewing(false);
    setPreviewReady(false);
  };
  const active = playing || (canPreview && previewing);

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
            previewTimer.current = setTimeout(() => setPreviewing(true), 180);
          }
        }}
        onPointerLeave={() => {
          if (!playing) stopPreview();
        }}
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
        {active && (
          // The source ads do not provide separate caption files.
          // oxlint-disable-next-line jsx-a11y/media-has-caption
          <video
            className={styles.player}
            src={ad.video}
            data-ready={previewReady}
            muted
            autoPlay
            loop
            playsInline
            onPlaying={() => setPreviewReady(true)}
            onError={() => {
              stopPreview();
              if (playing) onPlay(ad.id);
            }}
          />
        )}
        {active && !previewReady && (
          <output
            className={styles.loadingPreview}
            aria-label="Loading video preview"
          >
            <LoaderCircle
              className={styles.spinner}
              size={26}
              aria-hidden="true"
            />
          </output>
        )}
        <button
          type="button"
          className={styles.playMark}
          data-previewing={active}
          aria-label={`Preview ${ad.product}`}
          aria-pressed={playing}
          onClick={(event) => {
            // A mouse click should leave the current hover preview alone.
            if (
              !playing &&
              event.detail &&
              event.nativeEvent instanceof PointerEvent &&
              event.nativeEvent.pointerType === 'mouse' &&
              !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            )
              return;
            clearTimeout(previewTimer.current);
            setPreviewing(false);
            if (playing) setPreviewReady(false);
            onPlay(ad.id);
          }}
        >
          {playing ? (
            <X size={23} aria-hidden="true" />
          ) : (
            <Play size={26} fill="currentColor" aria-hidden="true" />
          )}
        </button>
        <div className={styles.cardDetails}>
          <span className={styles.cardTopic}>
            {markets[ad.market]} · {ad.topic}
          </span>
          <h2>{ad.product}</h2>
          {ad.advertiser && (
            <span className={styles.advertiser}>{ad.advertiser}</span>
          )}
        </div>
      </div>
      <button
        type="button"
        className={styles.remix}
        aria-haspopup="dialog"
        onClick={() => {
          stopPreview();
          onRemix(ad);
        }}
      >
        <Sparkles size={15} aria-hidden="true" /> Remix
      </button>
      <footer className={styles.cardFooter}>
        <a
          className={styles.download}
          href={adDownloadUrl(ad)}
          aria-label={`Download ${ad.product}`}
          title="Download MP4"
        >
          <Download size={16} aria-hidden="true" />
        </a>
        {(ad.reach || typeof ad.views === 'number') && (
          <div className={styles.stats}>
            {typeof ad.views === 'number' ? (
              <span
                title={`Reported video views: ${ad.views.toLocaleString('en-US')}`}
              >
                <Eye size={15} aria-hidden="true" />
                <span className="sr-only">Reported video views: </span>
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(ad.views)}
              </span>
            ) : (
              <span title={`Reported reach: ${ad.reach}`}>
                <Eye size={15} aria-hidden="true" />
                <span className="sr-only">Reported reach: </span>
                {ad.reach}
              </span>
            )}
          </div>
        )}
      </footer>
    </article>
  );
});

function RemixDialog({
  ad,
  cloneUrl,
  onClose,
}: {
  ad: Ad;
  cloneUrl: string;
  onClose: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<
    'copying' | 'opening' | 'opened' | 'blocked' | 'failed'
  >();
  const isLibraryLink = new URL(ad.sourceUrl).hostname === 'library.tiktok.com';

  useEffect(() => {
    if (copyStatus !== 'opening') return;

    const timer = window.setTimeout(() => {
      const nextTab = window.open('about:blank', '_blank');
      if (!nextTab) {
        setCopyStatus('blocked');
        return;
      }
      nextTab.opener = null;
      nextTab.location.replace(cloneUrl);
      setCopyStatus('opened');
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [cloneUrl, copyStatus]);

  const copyVideoLink = async () => {
    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(ad.sourceUrl);
      setCopyStatus('opening');
    } catch {
      setCopyStatus('failed');
    }
  };

  const copied =
    copyStatus === 'opening' ||
    copyStatus === 'opened' ||
    copyStatus === 'blocked';
  const canOpenManually =
    copyStatus === 'opened' ||
    copyStatus === 'blocked' ||
    copyStatus === 'failed';

  return (
    <div className={styles.confirmation}>
      <header className={styles.dialogHeader}>
        <h2 id="ad-remix-title">Remix this ad for your product</h2>
        <button type="button" aria-label="Close" onClick={onClose}>
          <X size={22} aria-hidden="true" />
        </button>
        <p id="ad-remix-description">
          {isLibraryLink ? (
            <>
              Download the MP4, then choose Upload video in Video Clone.
              {' '}<a href={ad.sourceUrl} target="_blank" rel="noopener noreferrer">
                View original ad on TikTok
              </a>
            </>
          ) : (
            'Copy the original TikTok video link and paste it into Video Clone as a reference.'
          )}
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
          aria-label="Original TikTok link"
          readOnly
          value={ad.sourceUrl}
          onFocus={(event) => event.currentTarget.select()}
        />
      )}
      {copyStatus && copyStatus !== 'copying' && (
        <output className={styles.previewTip} data-copied={copied}>
          {copied && <Check size={16} aria-hidden="true" />}
          {copyStatus === 'opening' &&
            'TikTok link copied. Opening Video Clone…'}
          {copyStatus === 'opened' &&
            'TikTok link copied.'}
          {copyStatus === 'blocked' &&
            'TikTok link copied. Select Open Video Clone to continue.'}
          {copyStatus === 'failed' && 'Select the TikTok link above to copy it.'}
        </output>
      )}
      <div className={styles.actions}>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        {isLibraryLink && (
          <a href={adDownloadUrl(ad)} className={styles.create}>
            <Download size={16} aria-hidden="true" /> Download MP4
          </a>
        )}
        {isLibraryLink || canOpenManually ? (
          <a
            href={cloneUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={isLibraryLink ? undefined : styles.create}
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
            disabled={copyStatus === 'copying' || copyStatus === 'opening'}
            onClick={() => void copyVideoLink()}
          >
            Copy link &amp; open Video Clone{' '}
            <ArrowUpRight size={16} aria-hidden="true" />
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
  const onPlay = useCallback((id: string) => {
    setPlayingId((current) => (current === id ? null : id));
  }, []);
  const onRemix = useCallback((ad: Ad) => {
    setPlayingId(null);
    setSelected(ad);
  }, []);
  const search = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      !search
        ? catalog.ads
        : catalog.ads.filter((ad) =>
            [
              ad.advertiser,
              ad.product,
              ad.topic,
              markets[ad.market],
              ad.id,
            ].some((value) => value?.toLowerCase().includes(search)),
          ),
    [catalog.ads, search],
  );
  const visible = results.slice(0, limit);
  const visibleCount = visible.length;
  const hasMore = visible.length < results.length;

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
          // A jump to the guide can leave the load button just above the viewport.
          const guide =
            location.hash === '#ad-library-guide'
              ? document.getElementById('ad-library-guide')
              : null;
          if (guide && guide.getBoundingClientRect().top < window.innerHeight)
            return;
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
            <h1 id="ad-library-title">Ad Library</h1>
            <p>
              Explore real TikTok ads. Turn a creative you like into a reference
              for your next product video.
            </p>
          </div>
          <a
            className={styles.pricing}
            href="https://www.nexscope.ai/pricing?co-from=learn"
            data-track-tool="pricing"
            data-cta-placement="ad-library-hero"
          >
            <img
              src="/ad-library-pricing.webp"
              width={80}
              height={80}
              alt=""
              decoding="async"
            />
            <span className={styles.pricingCopy}>
              {showAnnualOffer && <strong>50% off your first year</strong>}
              <span className={styles.pricingAction}>
                View pricing <ArrowUpRight size={15} aria-hidden="true" />
              </span>
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
          <a
            className={styles.faqLink}
            href="#ad-library-guide"
            onClick={(event) => {
              const guide = document.getElementById('ad-library-guide');
              if (
                !guide ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              if (location.hash !== event.currentTarget.hash)
                history.pushState(null, '', event.currentTarget.hash);
              guide.focus({ preventScroll: true });
              guide.scrollIntoView({ behavior: 'instant' });
            }}
          >
            How it works <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      {visibleCount === 0 && (
        <output className={styles.empty}>No ads match your search.</output>
      )}
      {visibleCount > 0 && (
        <div className={styles.adGrid}>
          {visible.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              playing={playingId === ad.id}
              canPreview={!playingId && !selected}
              onPlay={onPlay}
              onRemix={onRemix}
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
