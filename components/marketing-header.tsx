'use client';

/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
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

const headerMenuEvent = 'nexscope-header-menu';

function NavigationDropdown({
  label,
  current,
  items,
}: {
  label: string;
  current?: boolean;
  items: NavigationDropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
  }
  const containsMenu = useCallback(
    (node: Node | null) => {
      if (!node) return false;
      const element = node instanceof Element ? node : node.parentElement;
      if (!element) return false;
      if (triggerRef.current?.contains(element)) return true;
      const popup = document.getElementById(menuId);
      if (popup?.contains(element)) return true;
      return Boolean(element.closest('[data-base-ui-focus-guard]'));
    },
    [menuId],
  );

  useEffect(() => {
    if (!open) return;
    const closeOthers = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== menuId) setOpen(false);
    };
    window.addEventListener(headerMenuEvent, closeOthers);
    window.dispatchEvent(new CustomEvent(headerMenuEvent, { detail: menuId }));
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (!containsMenu(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node) {
        if (!containsMenu(next)) setOpen(false);
        return;
      }
      const active = document.activeElement;
      if (active instanceof Node && containsMenu(active)) return;
      if (!document.hasFocus()) setOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a[href]');
      const popup = document.getElementById(menuId);
      if (link && popup?.contains(link)) setOpen(false);
    };
    const close = () => setOpen(false);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', close);
    window.addEventListener('hashchange', close);
    window.addEventListener('pageshow', close);
    return () => {
      window.removeEventListener(headerMenuEvent, closeOthers);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('focusout', onFocusOut);
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', close);
      window.removeEventListener('hashchange', close);
      window.removeEventListener('pageshow', close);
    };
  }, [containsMenu, menuId, open]);

  return (
    <li>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          ref={triggerRef}
          className={styles.dropdownTrigger}
          aria-controls={menuId}
          aria-current={current ? 'page' : undefined}
          aria-expanded={open}
        >
          {label} <ChevronDown aria-hidden="true" size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          id={menuId}
          className={styles.dropdownMenu}
          align="start"
          side="bottom"
          sideOffset={24}
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
  const pathname = usePathname();
  const [navPath, setNavPath] = useState(pathname);
  if (pathname !== navPath) {
    setNavPath(pathname);
    setMenuOpen(false);
  }
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
                  href: '/video-apis/',
                  label: 'Video & Image APIs',
                  trackTool: 'video-api-directory',
                  current: active === 'video-apis',
                },
                {
                  href: '/social/',
                  label: 'Social APIs',
                  trackTool: 'social-directory',
                  current: active === 'social',
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
