'use client';
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { useState } from 'react';
import {
  ArrowUpRight,
  Search,
  Clapperboard,
  Image,
  Sparkles,
} from 'lucide-react';
import catalog from '@/lib/video-api-directory.json';
import { videoModelIcon } from '@/lib/video-model-icons.mjs';
import styles from '@/app/video/video.module.css';
import { trackDirectoryAction } from '@/lib/directory-analytics.mjs';
import { videoApiChoices, relatedVideoApi } from '@/lib/video-api-choices.mjs';

const categoryIcons = {
  'video-generation-models': Clapperboard,
  'image-generation-models': Image,
  'multimodal-ai': Sparkles,
};

export default function VideoApiDirectory() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const categories = [
    ...new Map(
      catalog.entries.map((item) => [item.category, item.categoryName]),
    ).entries(),
  ];
  const visible = catalog.entries.filter(
    (item) =>
      (category === 'all' || category === item.category) &&
      `${item.name} ${item.description} ${item.categoryName}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const chooseCategory = (next: string, searchQuery = query) => {
    setCategory(next);
    trackDirectoryAction('video_api_filter', {
      data_category: next,
      result_count: catalog.entries.filter(
        (item) =>
          (next === 'all' || item.category === next) &&
          `${item.name} ${item.description} ${item.categoryName}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
      ).length,
    });
  };
  return (
    <section
      id="apis"
      className={styles.section}
      aria-labelledby="video-api-title"
    >
      <h2 id="video-api-title" className={styles.apiSearchLabel}>Browse video and image APIs</h2>
      <label className={styles.apiSearch}>
        <Search size={19} aria-hidden="true" />
        <span className={styles.apiSearchLabel}>Search Video & Image APIs</span>
        <input
          id="api-search"
          type="search"
          data-learn-search
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => {
            if (query.trim())
              trackDirectoryAction('video_api_search', {
                query_length: Math.min(query.trim().length, 500),
                result_count: visible.length,
                data_category: category,
              });
          }}
          placeholder="Search by model, task or API name"
        />
      </label>
      <fieldset
        className={styles.filters}
        aria-label="Filter Video & Image APIs"
      >
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => chooseCategory('all')}
          data-learn-action="filter_api_category"
          data-learn-item="all"
        >
          All APIs ({catalog.entries.length})
        </button>
        {categories.map(([id, name]) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => chooseCategory(id)}
            data-learn-action="filter_api_category"
            data-learn-item={id}
          >
            {name} (
            {catalog.entries.filter((item) => item.category === id).length})
          </button>
        ))}
      </fieldset>
      <details className={styles.apiTaskGuide}>
        <summary>See example API workflows</summary>
        <div className={styles.apiChoices}>
          {videoApiChoices
            .filter((choice) => relatedVideoApi(choice.id, catalog.entries))
            .map((choice) => (
              <article key={choice.id}>
                <h3>{choice.title}</h3>
                <dl>
                  <div>
                    <dt>You bring</dt>
                    <dd>{choice.input}</dd>
                  </div>
                  <div>
                    <dt>You get</dt>
                    <dd>{choice.output}</dd>
                  </div>
                </dl>
                {choice.slug ? (
                  <a
                    href={`https://www.nexscope.ai/api-docs/${choice.slug}?view=playground&co-from=learn`}
                    data-track
                    data-track-tool={choice.slug}
                    data-cta-placement="video-task-start"
                  >
                    {choice.label} <ArrowUpRight size={16} />
                  </a>
                ) : (
                  <a
                    href="#api-search"
                    onClick={() => {
                      setQuery('');
                      chooseCategory(choice.category || 'all', '');
                    }}
                  >
                    {choice.label} →
                  </a>
                )}
                <a href={choice.guide}>Read the preparation guide →</a>
              </article>
            ))}
        </div>
      </details>
      <output className={styles.count} aria-live="polite">
        {visible.length} {visible.length === 1 ? 'API' : 'APIs'} found
      </output>
      <div className={styles.apiGrid}>
        {visible.map((item) => {
          const modelLogo = videoModelIcon(item.slug);
          const Icon =
            categoryIcons[item.category as keyof typeof categoryIcons] ??
            Sparkles;
          return (
            <article
              key={item.slug}
              className={styles.apiCard}
              data-api-category={item.category}
            >
              <a
                className={styles.apiCardLink}
                href={`https://www.nexscope.ai/api-docs/${item.slug}?view=playground&co-from=learn`}
                data-track
                data-track-tool={item.slug}
                data-cta-placement="video-api-directory"
              >
                <div className={styles.apiCardTop}>
                  <span className={styles.apiTypeIcon}>
                    {modelLogo ? (
                      <img
                        src={modelLogo}
                        alt=""
                        width="40"
                        height="40"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Icon size={24} aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles.apiTypeBadge}>
                    {item.category === 'video-generation-models'
                      ? 'VIDEO'
                      : item.category === 'image-generation-models'
                        ? 'IMAGE'
                        : 'MULTIMODAL'}
                  </span>
                </div>
                <span className={styles.apiCategory}>{item.categoryName}</span>
                <h3>{item.name}</h3>
                <p title={item.description}>{item.description}</p>
                <span className={styles.apiCardCta}>
                  Open API playground{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <p>No APIs match your search. Try another model or task.</p>
      )}
      <p className={styles.caption}>
        Check supported inputs, output formats, task status and current credit
        costs in each API&apos;s documentation before integrating.
      </p>
    </section>
  );
}
