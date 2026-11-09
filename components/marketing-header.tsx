'use client';

/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import styles from './marketing-header.module.css';
import { videoWorkspaceUrl } from '@/lib/video-directory';

type MarketingHeaderProps = {
  active?: 'tools' | 'pricing' | 'video' | 'video-apis' | 'social' | 'growth';
  campaign: string;
  explorePath?: '/apis' | '/';
  productReviewCta?: boolean;
  homepageFocus?: boolean;
  videoCta?: boolean;
};

type NavigationDropdownItem = {
  href: string;
  label: string;
  trackTool?: string;
  current?: boolean;
};

function NavigationDropdown({
  label,
  current,
  items,
}: {
  label: string;
  current?: boolean;
  items: NavigationDropdownItem[];
}) {
  return (
    <li>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={styles.dropdownTrigger}
          aria-current={current ? 'page' : undefined}
        >
          {label} <ChevronDown aria-hidden="true" size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={styles.dropdownMenu}
          align="start"
          side="bottom"
          sideOffset={6}
        >
          {items.map((item) => (
            <DropdownMenuItem
              key={item.href}
              className={styles.dropdownItem}
              render={
                <a
                  href={item.href}
                  data-track-tool={item.trackTool}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              }
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

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
            <NavigationDropdown
              label="APIs"
              current={
                active === 'tools' ||
                active === 'social' ||
                active === 'video-apis'
              }
              items={[
                {
                  href: '/data/',
                  label: 'Data APIs',
                  trackTool: 'data-directory',
                  current: active === 'tools',
                },
                {
                  href: '/social/',
                  label: 'Social APIs',
                  trackTool: 'social-directory',
                  current: active === 'social',
                },
                {
                  href: '/video-apis/',
                  label: 'Video & Image APIs',
                  trackTool: 'video-api-directory',
                  current: active === 'video-apis',
                },
              ]}
            />
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
              <a
                href="/product-growth-report/"
                aria-current={active === 'growth' ? 'page' : undefined}
              >
                Product Growth Report
              </a>
            </li>
            <NavigationDropdown
              label="Resources"
              current={active === 'pricing'}
              items={[
                { href: '/ecommerce-ai-tools/', label: 'Guides & resources' },
                {
                  href: '/pricing/',
                  label: 'Pricing',
                  current: active === 'pricing',
                },
              ]}
            />
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
