'use client';

/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import styles from './marketing-header.module.css';

type MarketingHeaderProps = {
  active?: 'tools';
  campaign: string;
  explorePath?: '/apis' | '/';
  productReviewCta?: boolean;
};

export default function MarketingHeader({
  active,
  campaign: _campaign,
  explorePath = '/',
  productReviewCta = false,
}: MarketingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tracking = '?co-from=learn';

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a
          className={styles.brand}
          href="/"
          aria-label="Nexscope learning home"
        >
          <img src="/logo.png" alt="Nexscope" width="165" height="32" />
        </a>
        <button
          ref={toggleRef}
          className={styles.toggle}
          type="button"
          aria-label={
            menuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-controls="marketing-primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <nav
          className={styles.navigation}
          id="marketing-primary-navigation"
          aria-label="Primary navigation"
          data-open={menuOpen}
        >
          <ul>
            <li>
              <a
                href="/tools/"
                aria-current={active === 'tools' ? 'page' : undefined}
              >
                Tools
              </a>
            </li>
            <li>
              <a href="/ecommerce-ai-tools/">Learn</a>
            </li>
            <li>
              <a href="/ecommerce-ai-tools/product-showcase/">
                Product Gallery
              </a>
            </li>
            <li>
              <a href="/ecommerce-ai-tools/community/">Community</a>
            </li>
            <li>
              <a
                data-track
                href={`https://www.nexscope.ai/api-docs${tracking}`}
              >
                API docs
              </a>
            </li>
            <li>
              <a
                className={styles.cta}
                data-track={productReviewCta ? undefined : true}
                data-showcase-submit-cta={
                  productReviewCta ? 'root-navigation' : undefined
                }
                href={
                  productReviewCta
                    ? '/ecommerce-ai-tools/product-showcase/submit/'
                    : `https://www.nexscope.ai${explorePath}${tracking}`
                }
              >
                {productReviewCta
                  ? 'Get free feedback →'
                  : 'Explore Nexscope ↗'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
