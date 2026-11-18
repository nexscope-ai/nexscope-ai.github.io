'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages */
import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import catalog from '@/lib/social-api-directory.json';
import { groupSocialPlatforms } from '@/lib/social-directory.mjs';
import { SocialPlatformIcon } from '@/components/social-platform-icon';
import styles from '@/app/video/video.module.css';
import social from '@/app/social/social.module.css';
const groups = groupSocialPlatforms(catalog.entries);

export default function SocialApiDirectory() {
  const [platform, setPlatform] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const previewLimit = 12;
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
      className={`catalog-directory ${social.directory}`}
      aria-labelledby="social-api-title"
    >
      <h2 id="social-api-title" className={styles.apiSearchLabel}>Browse social media APIs</h2>
      <label className="catalog-search">
        <Search size={19} aria-hidden="true" />
        <span className={styles.apiSearchLabel}>Search social APIs</span>
        <input
          type="search"
          ref={searchRef}
          data-learn-search
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setExpanded(false);
          }}
          placeholder="Try Instagram profiles, YouTube transcripts or Reddit comments…"
        />
      </label>
      <fieldset
        className="catalog-filters catalog-platform-filters"
        aria-label="Filter social APIs by platform"
      >
        <button
          type="button"
          aria-pressed={platform === 'all'}
          data-learn-action="filter_platform"
          data-learn-item="all"
          onClick={() => {
            setPlatform('all');
            setExpanded(false);
          }}
        >
          All platforms <span>{catalog.entries.length}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={platform === g.id}
            data-learn-action="filter_platform"
            data-learn-item={g.id}
            onClick={() => {
              setPlatform(g.id);
              setExpanded(false);
            }}
          >
            <SocialPlatformIcon platform={g.id} />
            {g.name}
            <span>{g.count}</span>
          </button>
        ))}
      </fieldset>
      <div className={`catalog-results ${social.resultBar}`} ref={resultsRef}>
        <output className={styles.count} aria-live="polite">
          {entries.length} {entries.length === 1 ? 'API' : 'APIs'} found
        </output>
        {(platform !== 'all' || query) && (
          <button
            type="button"
            data-learn-action="clear_filters"
            onClick={() => {
              setPlatform('all');
              setQuery('');
              setExpanded(false);
              searchRef.current?.focus();
            }}
          >
            Clear filters
          </button>
        )}
      </div>
      <div className={styles.apiGrid} id="social-api-results">
        {entries.map((e, index) => (
          <article
            className={`${styles.apiCard} ${!expanded && index >= previewLimit ? social.hiddenCard : ''}`}
            hidden={!expanded && index >= previewLimit}
            key={e.slug}
          >
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
              </div>
              <span className={styles.apiCategory}>{e.platformName}</span>
              <h3>{e.name}</h3>
              <p title={e.description}>{e.description}</p>
              <div className={social.cardBottom}>
                <span className={styles.apiCardCta}>
                  Open API playground{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>
      {entries.length > previewLimit && (
        <div className={social.expandResults}>
          <p>
            Showing {expanded ? entries.length : previewLimit} of{' '}
            {entries.length} APIs
          </p>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="social-api-results"
            data-learn-action={expanded ? 'collapse_results' : 'expand_results'}
            onClick={() => {
              setExpanded(!expanded);
              if (expanded)
                resultsRef.current?.scrollIntoView({ block: 'start' });
            }}
          >
            {expanded ? 'Show less' : `View all ${entries.length} APIs`}
            {expanded ? (
              <ChevronUp size={18} aria-hidden="true" />
            ) : (
              <ChevronDown size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      )}
      {!entries.length && (
        <p className={social.empty}>
          No matching APIs. Try another search or clear your filters.
        </p>
      )}
    </section>
  );
}
