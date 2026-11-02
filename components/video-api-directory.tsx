'use client';
/* oxlint-disable next/no-html-link-for-pages */
import { useState } from 'react';
import { ArrowUpRight, Search, Code2 } from 'lucide-react';
import catalog from '@/lib/video-api-directory.json';
import styles from '@/app/video/video.module.css';

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
        {visible.map((item) => (
          <article key={item.slug} className={styles.apiCard}>
            <span className={styles.eyebrow}>
              <Code2 size={14} aria-hidden="true" /> {item.categoryName}
            </span>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <a
              href={`https://www.nexscope.ai/api-docs/${item.slug}?view=playground&co-from=learn`}
              data-track
              data-track-tool={item.slug}
              data-cta-placement="video-api-directory"
            >
              Open API playground{' '}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
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
