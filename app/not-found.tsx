/* Native anchors keep the exported GitHub Pages site interoperable with the Jekyll section. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import homeStyles from './home.module.css';
import styles from './not-found.module.css';
import { DEFAULT_SOCIAL_IMAGE } from '@/lib/site-metadata';
import MarketingHeader from '@/components/marketing-header';

const tracking =
  '?co-from=learn&utm_source=learn.nexscope.ai&utm_medium=referral&utm_campaign=404_recovery';

export const metadata: Metadata = {
  title: 'Page Not Found | Nexscope',
  description:
    'The requested Nexscope Learning Hub page could not be found. Continue with ecommerce tools, guides and tested workflows.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Page Not Found | Nexscope',
    description:
      'Continue with Nexscope ecommerce tools, guides and tested workflows.',
    siteName: 'Nexscope',
    type: 'website',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Not Found | Nexscope',
    description:
      'Continue with Nexscope ecommerce tools, guides and tested workflows.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export default function NotFound() {
  return (
    <div className={homeStyles.home}>
      <a className={homeStyles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader campaign="404_recovery" explorePath="/apis" />

      <main id="main" className={styles.main}>
        <section className={styles.hero} aria-labelledby="not-found-title">
          <div className={styles.visual} aria-hidden="true">
            <span className={styles.visualLabel}>NEXSCOPE / ERROR 404</span>
            <div className={styles.code}>
              4<span>0</span>4
            </div>
            <span className={styles.visualCaption}>
              A small detour. Plenty more to explore.
            </span>
          </div>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" /> PAGE NOT FOUND
            </p>
            <h1 id="not-found-title">Looks like this page took a detour.</h1>
            <p className={styles.lead}>
              The link may be outdated or the page may have moved. Let’s get you
              back to something useful.
            </p>
            <div className={styles.actions}>
              <a className={styles.primaryButton} href="/">
                Back to Learning Hub <span aria-hidden="true">↗</span>
              </a>
              <a className={styles.secondaryButton} href="/tools/">
                Explore tools <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
        <nav className={styles.shortcuts} aria-label="Helpful places">
          <span>Or pick up from here</span>
          <a href="/ecommerce-ai-tools/guides/">
            Guides <span aria-hidden="true">↗</span>
          </a>
          <a href="/ecommerce-ai-tools/product-showcase/">
            Product Gallery <span aria-hidden="true">↗</span>
          </a>
          <a href="/ecommerce-ai-tools/community/">
            Community <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </main>

      <footer className={`${homeStyles.wrap} ${homeStyles.footer}`}>
        <div>
          <a href="/" aria-label="Nexscope home">
            <img
              className={homeStyles.logo}
              src="/logo.png"
              alt="Nexscope"
              width="165"
              height="32"
            />
          </a>
          <p>Ecommerce intelligence. AI-powered possibilities.</p>
        </div>
        <div className={homeStyles.footerlinks}>
          <a href="/tools/">Tools</a>
          <a href="/ecommerce-ai-tools/">Learn</a>
          <a href="/about/">About</a>
          <a href="/security/">Security</a>
          <a href="/contact/">Contact</a>
          <a href={`https://www.nexscope.ai/api-docs${tracking}`}>API docs</a>
          <a href="https://www.nexscope.ai/privacy">Privacy</a>
          <a href="https://www.nexscope.ai/terms">Terms</a>
          <a href="#analytics-preferences">Cookie settings</a>
        </div>
      </footer>
    </div>
  );
}
