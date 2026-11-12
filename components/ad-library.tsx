'use client';

/* oxlint-disable next/no-img-element */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, Search, X } from 'lucide-react';
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

export function AdLibrary({
  catalog,
  createUrl,
}: {
  catalog: Catalog;
  createUrl: string;
}) {
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState('');
  const [topic, setTopic] = useState('');
  const [sort, setSort] = useState('reach');
  const [limit, setLimit] = useState(pageSize);
  const [selected, setSelected] = useState<Ad | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const loadMore = useRef<HTMLButtonElement>(null);
  const masonry = useRef<HTMLDivElement>(null);
  const search = query.trim().toLowerCase();
  const topics = [...new Set(catalog.ads.map((ad) => ad.topic))].sort();
  const results = catalog.ads
    .filter(
      (ad) =>
        (!market || ad.market === market) &&
        (!topic || ad.topic === topic) &&
        (!search ||
          [ad.advertiser, ad.topic, markets[ad.market], ad.id].some((value) =>
            value?.toLowerCase().includes(search),
          )),
    )
    .sort((a, b) =>
      sort === 'newest'
        ? b.firstShown.localeCompare(a.firstShown) || b.maxReach - a.maxReach
        : b.maxReach - a.maxReach,
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
  }, [visibleCount, query, market, topic, sort]);

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
  }, [hasMore, limit, query, market, topic, sort]);

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
            }}
          />
        </label>
        <div className={styles.filters}>
          <label>
            Market
            <select
              value={market}
              onChange={(event) => {
                setMarket(event.target.value);
                setLimit(pageSize);
              }}
            >
              <option value="">All markets</option>
              {Object.entries(markets).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Keyword
            <select
              value={topic}
              onChange={(event) => {
                setTopic(event.target.value);
                setLimit(pageSize);
              }}
            >
              <option value="">All keywords</option>
              {topics.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            Sort by
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setLimit(pageSize);
              }}
            >
              <option value="reach">Highest reach</option>
              <option value="newest">Most recently first shown</option>
            </select>
          </label>
        </div>
      </section>
      <output className={styles.results}>
        {results.length
          ? `Showing ${visible.length} of ${results.length} ads`
          : 'No ads match your filters.'}
      </output>
      {visibleCount > 0 && (
        <div className={styles.masonry} ref={masonry}>
          {visible.map((ad) => (
            <article className={styles.card} key={ad.id}>
              <button
                type="button"
                className={styles.poster}
                style={{
                  aspectRatio: `${ad.posterWidth} / ${ad.posterHeight}`,
                }}
                aria-label={`Play ad by ${ad.advertiser}`}
                onClick={() => {
                  setSelected(ad);
                  setVideoFailed(false);
                }}
              >
                <img
                  src={catalog.origin + ad.poster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
                <span className={styles.play}>
                  <Play fill="currentColor" size={22} aria-hidden="true" />
                </span>
              </button>
              <div className={styles.cardBody}>
                <span className={styles.market}>
                  {markets[ad.market]} · {ad.topic}
                </span>
                <h2>{ad.advertiser}</h2>
                <dl>
                  <dt>Reported reach</dt>
                  <dd>{ad.reach}</dd>
                </dl>
              </div>
            </article>
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
                href={`https://library.tiktok.com/ads/detail/?ad_id=${selected.id}`}
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
