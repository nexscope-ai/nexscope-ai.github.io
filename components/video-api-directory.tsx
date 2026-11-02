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
  return (
    <section
      id="apis"
      className={styles.section}
      aria-labelledby="video-api-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.eyebrow}>For developers & creative teams</p>
          <h2 id="video-api-title">Video & Image APIs</h2>
        </div>
        <p>
          Explore {catalog.entries.length} APIs from Nexscope&apos;s Video &
          Image collection. Compare image generation, video models and
          multimodal tools, then open the matching API documentation.
        </p>
      </div>
      <label className={styles.apiSearch}>
        <Search size={19} aria-hidden="true" />
        <span className={styles.apiSearchLabel}>Search Video & Image APIs</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
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
          onClick={() => setCategory('all')}
        >
          All APIs ({catalog.entries.length})
        </button>
        {categories.map(([id, name]) => (
          <button
            key={id}
            type="button"
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {name} (
            {catalog.entries.filter((item) => item.category === id).length})
          </button>
        ))}
      </fieldset>
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
