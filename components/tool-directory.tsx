'use client';

/* oxlint-disable next/no-img-element */

import { useState } from 'react';
import { toolCards, toolCategories, type ToolCard } from '@/lib/tool-plaza';
import styles from '@/app/tools/tools.module.css';

export default function ToolDirectory() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ToolCard['category']>('all');
  const search = query.trim().toLocaleLowerCase();
  const visibleTools = toolCards.filter((tool) => {
    if (category !== 'all' && tool.category !== category) return false;
    if (!search) return true;
    const categoryLabel =
      toolCategories.find((item) => item.id === tool.category)?.label ?? '';
    return [tool.name, tool.description, tool.access, categoryLabel]
      .join(' ')
      .toLocaleLowerCase()
      .includes(search);
  });

  return (
    <section className={styles.directory} aria-labelledby="directory-title">
      <div className={styles.directoryIntro}>
        <div>
          <p className={styles.eyebrow}>FIND YOUR WORKFLOW</p>
          <h2 id="directory-title">What do you need to do?</h2>
          <p>
            Search by product, platform or task, then choose a focused workflow.
          </p>
        </div>
        <span className={styles.totalCount}>
          {toolCards.length} tools available
        </span>
      </div>

      <div className={styles.finder}>
        <label className={styles.searchLabel} htmlFor="tool-search">
          Search tools
        </label>
        <div className={styles.searchWrap}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Amazon, 1688, TikTok, SEO…"
            autoComplete="off"
          />
        </div>
        <div className={styles.filters} aria-label="Filter tools by task">
          <button
            type="button"
            className={styles.filter}
            aria-pressed={category === 'all'}
            onClick={() => setCategory('all')}
          >
            All tools <span>{toolCards.length}</span>
          </button>
          {toolCategories.map((item) => (
            <button
              type="button"
              key={item.id}
              id={item.id}
              className={styles.filter}
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
              title={item.summary}
            >
              {item.id === 'visibility' && (
                <span
                  id="optimization"
                  className={styles.anchorAlias}
                  aria-hidden="true"
                />
              )}
              {item.label}
              <span>
                {toolCards.filter((tool) => tool.category === item.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.resultHeader}>
        <p aria-live="polite">
          Showing <strong>{visibleTools.length}</strong> of {toolCards.length}{' '}
          tools
        </p>
        <span>Choose a tool to see its inputs and credit requirements.</span>
      </div>

      {visibleTools.length ? (
        <div className={styles.grid}>
          {visibleTools.map((tool) => {
            const isLearnTool = tool.href.startsWith('/tools/');
            const categoryLabel = toolCategories.find(
              (item) => item.id === tool.category,
            )?.label;
            return (
              <article
                className={styles.card}
                data-category={tool.category}
                key={tool.name}
              >
                <div className={styles.cardTop}>
                  <span className={styles.mark} aria-hidden="true">
                    <img
                      src={tool.icon}
                      alt=""
                      width="64"
                      height="64"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className={styles.location}>
                    {isLearnTool ? 'On Learn' : 'On Nexscope'}
                  </span>
                </div>
                <span className={styles.cardCategory}>{categoryLabel}</span>
                <h3>{tool.name}</h3>
                <p className={styles.cardDescription}>{tool.description}</p>
                <p className={styles.access}>{tool.access}</p>
                <div className={styles.cardLinks}>
                  <a
                    className={styles.toolLink}
                    data-track
                    data-track-tool={
                      isLearnTool ? tool.href.split('/')[2] : undefined
                    }
                    href={tool.href}
                  >
                    Open tool <span aria-hidden="true">↗</span>
                  </a>
                  {tool.guide && (
                    <a className={styles.guideLink} href={tool.guide.href}>
                      {tool.guide.label} →
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.empty}>
          <span aria-hidden="true">⌕</span>
          <h3>No matching tools</h3>
          <p>Try a different keyword or view the complete directory.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
          >
            Show all tools
          </button>
        </div>
      )}
    </section>
  );
}
