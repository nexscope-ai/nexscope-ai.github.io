'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages */
import { useState } from 'react';
import { ArrowUpRight, Globe2, Search, Coins, Sparkles } from 'lucide-react';
import catalog from '@/lib/social-api-directory.json';
import styles from '@/app/video/video.module.css';
import social from '@/app/social/social.module.css';
const logos: Record<string, string> = {
  tiktok: '/assets/video-channels/tiktok.webp',
  instagram: '/assets/video-channels/instagram.svg',
  youtube: '/assets/video-channels/youtube.svg',
  amazon: '/assets/video-channels/amazon.webp',
  facebook: '/assets/social-platforms/facebook.svg',
  reddit: '/assets/social-platforms/reddit.svg',
  twitter: '/assets/social-platforms/x.svg',
  github: '/assets/social-platforms/github.svg',
};
function PlatformIcon({ platform }: { platform: string }) {
  return logos[platform] ? (
    <img src={logos[platform]} alt="" width="28" height="28" loading="lazy" />
  ) : (
    <Globe2 size={23} aria-hidden="true" />
  );
}
const groups = [
  ...new Map(
    catalog.entries.map((e) => [e.platform, e.platformName]),
  ).entries(),
]
  .map(([id, name]) => ({
    id,
    name,
    count: catalog.entries.filter((e) => e.platform === id).length,
  }))
  .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
export default function SocialApiDirectory() {
  const [platform, setPlatform] = useState('all');
  const [query, setQuery] = useState('');
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const entries = catalog.entries.filter(
    (e) =>
      (platform === 'all' || platform === e.platform) &&
      words.every((w) =>
        `${e.name} ${e.description} ${e.platformName}`
          .toLowerCase()
          .includes(w),
      ),
  );
  return (
    <section
      id="apis"
      className={social.directory}
      aria-labelledby="social-api-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>Browse by platform and task</p>
          <h2 id="social-api-title">Find your next social data API.</h2>
        </div>
        <p>
          Search for profiles, posts, comments, search results or transcripts.
          Available fields and inputs depend on the endpoint.
        </p>
      </div>
      <label className={styles.apiSearch}>
        <Search size={19} aria-hidden="true" />
        <span className={styles.apiSearchLabel}>Search social APIs</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try Instagram profiles, YouTube transcripts or Reddit comments…"
        />
      </label>
      <fieldset
        className={`${styles.filters} ${social.platforms}`}
        aria-label="Filter social APIs by platform"
      >
        <button
          type="button"
          aria-pressed={platform === 'all'}
          onClick={() => setPlatform('all')}
        >
          All platforms <span>{catalog.entries.length}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={platform === g.id}
            onClick={() => setPlatform(g.id)}
          >
            <PlatformIcon platform={g.id} />
            {g.name}
            <span>{g.count}</span>
          </button>
        ))}
      </fieldset>
      <div className={social.resultBar}>
        <output className={styles.count} aria-live="polite">
          {entries.length} {entries.length === 1 ? 'API' : 'APIs'}{' '}
          {platform !== 'all' || query
            ? 'matching your selection'
            : 'available'}
        </output>
        {(platform !== 'all' || query) && (
          <button
            type="button"
            onClick={() => {
              setPlatform('all');
              setQuery('');
            }}
          >
            Clear filters
          </button>
        )}
      </div>
      <div className={styles.apiGrid}>
        {entries.map((e) => (
          <article className={styles.apiCard} key={e.slug}>
            <a
              className={styles.apiCardLink}
              href={`https://www.nexscope.ai/api-docs/${e.slug}?view=playground&co-from=learn`}
              data-track
              data-track-tool={e.slug}
              data-cta-placement="social-api-directory"
            >
              <div className={styles.apiCardTop}>
                <span className={social.platformIcon}>
                  <PlatformIcon platform={e.platform} />
                </span>
                <span className={social.newBadge}>
                  <Sparkles size={12} aria-hidden="true" />
                  NEW
                </span>
              </div>
              <span className={styles.apiCategory}>{e.platformName}</span>
              <h3>{e.name}</h3>
              <p title={e.description}>{e.description}</p>
              <div className={social.cardBottom}>
                <span className={styles.apiCardCta}>
                  Open API playground{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
                <span
                  className={social.credits}
                  title="Historical credits per call, with a 10-credit reporting floor. Check current pricing in official documentation."
                >
                  <Coins size={14} aria-hidden="true" />
                  {e.creditRange}
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>
      {!entries.length && (
        <p className={social.empty}>
          No APIs match these filters. Try a different platform or search term.
        </p>
      )}
      <p className={styles.caption}>
        Credit ranges reflect available historical statistics with a 10-credit
        reporting floor. “-” means no estimate is available. Check current costs
        and input requirements in the official playground.
      </p>
    </section>
  );
}
