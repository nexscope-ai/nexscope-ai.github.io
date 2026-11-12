'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Eye,
  Heart,
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
  url: string;
  plays: number;
  likes: number;
};

type Catalog = { ads: Ad[] };
const compactNumber = new Intl.NumberFormat('en-US', { notation: 'compact' });
const fullNumber = new Intl.NumberFormat('en-US');

function AdCard({ ad, onRemix }: { ad: Ad; onRemix: () => void }) {
  return (
    <article className={styles.card}>
      <a
        className={styles.videoLink}
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.playMark}>
          <Play size={21} fill="currentColor" aria-hidden="true" />
        </span>
        <span className={styles.cardTopic}>
          {markets[ad.market]} · {ad.topic}
        </span>
        <h2>{ad.product}</h2>
        {ad.advertiser && (
          <span className={styles.advertiser}>{ad.advertiser}</span>
        )}
        <span className={styles.watch}>
          Watch on TikTok <ArrowUpRight size={15} aria-hidden="true" />
        </span>
      </a>
      <button
        type="button"
        className={styles.remix}
        aria-haspopup="dialog"
        onClick={onRemix}
      >
        <Sparkles size={15} aria-hidden="true" /> Remix
      </button>
      <footer className={styles.cardFooter}>
        <div className={styles.stats}>
          <span title={`${fullNumber.format(ad.plays)} plays`}>
            <Eye size={15} aria-hidden="true" />
            <span className="sr-only">{fullNumber.format(ad.plays)} plays</span>
            <span aria-hidden="true">{compactNumber.format(ad.plays)}</span>
          </span>
          <span title={`${fullNumber.format(ad.likes)} likes`}>
            <Heart size={15} aria-hidden="true" />
            <span className="sr-only">{fullNumber.format(ad.likes)} likes</span>
            <span aria-hidden="true">{compactNumber.format(ad.likes)}</span>
          </span>
        </div>
      </footer>
    </article>
  );
}

function RemixDialog({
  videoUrl,
  cloneUrl,
  onClose,
}: {
  videoUrl: string;
  cloneUrl: string;
  onClose: () => void;
}) {
  const [copyStatus, setCopyStatus] = useState<'copied' | 'failed'>();

  const copyVideoLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('failed');
    }
  };

  return (
    <div className={styles.confirmation}>
      <header className={styles.dialogHeader}>
        <span className={styles.remixMark}>
          <Sparkles size={22} aria-hidden="true" />
        </span>
        <button type="button" aria-label="Close" onClick={onClose}>
          <X size={22} aria-hidden="true" />
        </button>
      </header>
      <h2 id="ad-remix-title">Want to make this ad your own?</h2>
      <p id="ad-remix-description">
        Use this TikTok video as a reference to make an ad for your own product.
        Paste the copied link into Video Clone to get started.
      </p>
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
        <output className={styles.previewTip}>
          {copyStatus === 'copied'
            ? 'Video link copied.'
            : 'Select the video link above to copy it.'}
        </output>
      )}
      <div className={styles.actions}>
        <button type="button" onClick={onClose}>
          Cancel
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
    )
    .sort((a, b) => b.plays - a.plays);
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
        <div>
          <h1 id="ad-library-title">
            Remix a TikTok ad <em className={gradient.text}>you like</em>
          </h1>
          <p>
            Browse product ads for inspiration, then use a video as a reference
            to make your own in Nexscope Video Clone.
          </p>
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
              }}
            />
          </label>
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
      </section>
      {visibleCount === 0 && (
        <output className={styles.empty}>No ads match your search.</output>
      )}
      {visibleCount > 0 && (
        <div className={styles.masonry} ref={masonry}>
          {visible.map((ad) => (
            <AdCard key={ad.id} ad={ad} onRemix={() => setSelected(ad)} />
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
            videoUrl={selected.url}
            cloneUrl={cloneUrl}
            onClose={() => dialog.current?.close()}
          />
        )}
      </dialog>
    </>
  );
}
