/* Native anchors keep the exported GitHub Pages site interoperable with the Jekyll section. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import { ArrowRight, Compass, Home, Search } from 'lucide-react';
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

const recoveryLinks = [
  {
    label: 'Tools',
    title: 'Open the tool plaza',
    description: 'Start with a focused product research, SEO or creative workflow.',
    href: '/tools/',
  },
  {
    label: 'Learning center',
    title: 'Browse ecommerce guides',
    description: 'Find practical tutorials, comparisons, trends and API evidence.',
    href: '/ecommerce-ai-tools/',
  },
  {
    label: 'Nexscope',
    title: 'Explore product capabilities',
    description: 'Review available ecommerce APIs and AI creation tools.',
    href: `https://www.nexscope.ai/apis${tracking}`,
  },
] as const;

export default function NotFound() {
  return (
    <div className={homeStyles.home}>
      <a className={homeStyles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader campaign="404_recovery" explorePath="/apis" />

      <main id="main" className={styles.main}>
        <section className={styles.hero} aria-labelledby="not-found-title">
          <div className={styles.copy}>
            <p className={styles.eyebrow}>ROUTE NOT FOUND · 404</p>
            <h1 id="not-found-title">
              This page isn’t in the atlas.
              <em>Your next workflow still is.</em>
            </h1>
            <p className={styles.lead}>
              The address may be outdated, incomplete or moved. Return to the
              Nexscope Learning Hub, or continue with the task you came to solve.
            </p>
            <div className={styles.actions}>
              <a className={homeStyles.button} href="/">
                <Home size={17} aria-hidden="true" />
                Return to the Learning Hub
              </a>
              <a className={styles.secondaryButton} href="/tools/">
                Browse tools <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className={styles.routeMap} aria-label="Route recovery illustration">
            <span className={styles.number} aria-hidden="true">
              404
            </span>
            <div className={styles.routeCard}>
              <Search size={20} strokeWidth={1.7} aria-hidden="true" />
              <div>
                <span>Requested route</span>
                <strong>Page not found</strong>
              </div>
            </div>
            <div className={styles.routeLine} aria-hidden="true">
              <span />
              <ArrowRight size={17} />
              <span />
            </div>
            <div className={`${styles.routeCard} ${styles.routeCardActive}`}>
              <Compass size={20} strokeWidth={1.7} aria-hidden="true" />
              <div>
                <span>Recommended route</span>
                <strong>Nexscope Learning Hub</strong>
                <small>Tools · Guides · Tested workflows</small>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.recovery} aria-labelledby="recovery-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>USEFUL PLACES</p>
              <h2 id="recovery-title">Choose a clearer route forward.</h2>
            </div>
            <p>These are the main entry points across learn.nexscope.ai.</p>
          </div>
          <div className={styles.linkGrid}>
            {recoveryLinks.map((link, index) => (
              <a href={link.href} key={link.title}>
                <span>
                  {String(index + 1).padStart(2, '0')} · {link.label}
                </span>
                <strong>{link.title}</strong>
                <p>{link.description}</p>
                <b>
                  Continue <ArrowRight size={16} aria-hidden="true" />
                </b>
              </a>
            ))}
          </div>
        </section>
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
          <a href={`https://www.nexscope.ai/api-docs${tracking}`}>API docs</a>
          <a href="#analytics-preferences">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
