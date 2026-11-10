'use client';
/* oxlint-disable next/no-img-element, next/no-html-link-for-pages */
import { useRef, useState } from 'react';
import {
  ArrowUpRight,
  Globe2,
  Search,
  Compass,
  Link2,
  Contact,
  MessageCircle,
  Video,
  Users,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
  'apple-music': '/assets/social-platforms/apple-music.svg',
  bluesky: '/assets/social-platforms/bluesky.svg',
  google: '/assets/social-platforms/google.webp',
  kick: '/assets/social-platforms/kick.svg',
  pinterest: '/assets/social-platforms/pinterest.svg',
  rumble: '/assets/social-platforms/rumble.svg',
  snapchat: '/assets/social-platforms/snapchat.svg',
  soundcloud: '/assets/social-platforms/soundcloud.svg',
  spotify: '/assets/social-platforms/spotify.svg',
  telegram: '/assets/social-platforms/telegram.svg',
  threads: '/assets/social-platforms/threads.svg',
  twitch: '/assets/social-platforms/twitch.svg',
  linktree: '/assets/social-platforms/linktree.svg',
  linkedin: '/assets/social-platforms/linkedin.svg',
};
const platformIcons: Record<string, typeof Globe2> = {
  cosmos: Compass,
  komi: Link2,
  linkbio: Contact,
  linkme: Link2,
  truthsocial: MessageCircle,
  kwai: Video,
  'creator-tools': Users,
};
function PlatformIcon({ platform }: { platform: string }) {
  const Icon = platformIcons[platform] || Globe2;
  return logos[platform] ? (
    <img src={logos[platform]} alt="" width="28" height="28" loading="lazy" />
  ) : (
    <Icon size={23} aria-hidden="true" />
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
  const [expanded, setExpanded] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
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
        className={`${styles.filters} ${social.platforms}`}
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
            <PlatformIcon platform={g.id} />
            {g.name}
            <span>{g.count}</span>
          </button>
        ))}
      </fieldset>
      <div className={social.resultBar} ref={resultsRef}>
        <output className={styles.count} aria-live="polite">
          {entries.length} {entries.length === 1 ? 'API' : 'APIs'}{' '}
          {platform !== 'all' || query
            ? 'matching your selection'
            : 'available'}
        </output>
        {(platform !== 'all' || query) && (
          <button
            type="button"
            data-learn-action="clear_filters"
            onClick={() => {
              setPlatform('all');
              setQuery('');
              setExpanded(false);
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
          No APIs match these filters. Try a different platform or search term.
        </p>
      )}
    </section>
  );
}
