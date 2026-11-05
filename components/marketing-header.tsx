'use client';

/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import styles from './marketing-header.module.css';
import { videoWorkspaceUrl } from '@/lib/video-directory';

type MarketingHeaderProps = {
  active?: 'tools' | 'pricing' | 'video' | 'social';
  campaign: string;
  explorePath?: '/apis' | '/';
  productReviewCta?: boolean;
  homepageFocus?: boolean;
  videoCta?: boolean;
};

export default function MarketingHeader({
  active,
  campaign: _campaign,
  explorePath = '/',
  productReviewCta = false,
  homepageFocus = false,
  videoCta = false,
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
            {homepageFocus ? (
              <>
                <li>
                  <a href="/data/" data-track-tool="data-directory">
                    Data APIs
                  </a>
                </li>
                <li>
                  <a
                    href="/social/"
                    data-track-tool="social-directory"
                    aria-current={active === 'social' ? 'page' : undefined}
                  >
                    Social APIs
                  </a>
                </li>
                <li>
                  <a
                    href="/video/"
                    data-track-tool="video-directory"
                    aria-current={active === 'video' ? 'page' : undefined}
                  >
                    Video workflows
                  </a>
                </li>
                <li>
                  <a
                    href="/ecommerce-ai-tools/product-showcase/"
                    data-track-tool="product-gallery"
                  >
                    Product Gallery
                  </a>
                </li>
                <li>
                  <a href="/ecommerce-ai-tools/">Guides & resources</a>
                </li>
                <li>
                  <a
                    href="/pricing/"
                    aria-current={active === 'pricing' ? 'page' : undefined}
                  >
                    Pricing
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a href="/data/">Data APIs</a>
                </li>
                <li>
                  <a
                    href="/social/"
                    data-track-tool="social-directory"
                    aria-current={active === 'social' ? 'page' : undefined}
                  >
                    Social APIs
                  </a>
                </li>
                <li>
                  <a
                    href="/video/"
                    data-track-tool="video-directory"
                    aria-current={active === 'video' ? 'page' : undefined}
                  >
                    Video workflows
                  </a>
                </li>
                <li>
                  <a href="/ecommerce-ai-tools/topics/research/">Research</a>
                </li>
                <li>
                  <a href="/ecommerce-ai-tools/topics/visibility/">
                    SEO & AI visibility
                  </a>
                </li>
                <li>
                  <a href="/ecommerce-ai-tools/topics/creative/">Creative</a>
                </li>
                <li>
                  <a data-track href="/ecommerce-ai-tools/topics/agents/">
                    APIs & agents
                  </a>
                </li>
                <li>
                  <a href="/ecommerce-ai-tools/topics/evidence/">Evidence</a>
                </li>
              </>
            )}
            <li>
              <a
                className={styles.cta}
                data-track={videoCta || !productReviewCta ? true : undefined}
                data-track-tool={videoCta ? 'image-to-video' : undefined}
                data-cta-placement={videoCta ? 'video-navigation' : undefined}
                data-showcase-submit-cta={
                  productReviewCta && !videoCta ? 'root-navigation' : undefined
                }
                href={
                  videoCta
                    ? videoWorkspaceUrl('image-to-video')
                    : productReviewCta
                      ? '/ecommerce-ai-tools/product-showcase/submit/'
                      : `https://www.nexscope.ai${explorePath}${tracking}`
                }
              >
                {videoCta
                  ? 'Create a video ↗'
                  : productReviewCta
                    ? homepageFocus
                      ? 'List a product free →'
                      : 'Get free feedback →'
                    : 'Explore Nexscope ↗'}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
