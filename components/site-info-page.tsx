/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages */
import type { ReactNode } from 'react';
import MarketingHeader from './marketing-header';
import styles from '@/app/site-info.module.css';

type SupportingLink = {
  href: string;
  label: string;
  description: string;
};

type SiteInfoPageProps = {
  campaign: string;
  eyebrow: string;
  title: string;
  lead: string;
  supportingTitle: string;
  supportingLinks: readonly SupportingLink[];
  lastReviewed: string;
  children: ReactNode;
};

export default function SiteInfoPage({
  campaign,
  eyebrow,
  title,
  lead,
  supportingTitle,
  supportingLinks,
  lastReviewed,
  children,
}: SiteInfoPageProps) {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main-content">
        Skip to content
      </a>
      <MarketingHeader campaign={campaign} explorePath="/apis" />
      <main id="main-content">
        <header className={styles.hero}>
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1>{title}</h1>
            <p className={styles.lead}>{lead}</p>
          </div>
        </header>

        <div className={`${styles.wrap} ${styles.layout}`}>
          <article className={styles.article}>{children}</article>
          <aside className={styles.aside} aria-label={supportingTitle}>
            <p className={styles.asideLabel}>Official resources</p>
            <h2>{supportingTitle}</h2>
            <div className={styles.asideLinks}>
              {supportingLinks.map((link) => (
                <a href={link.href} key={link.href}>
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                </a>
              ))}
            </div>
            <p className={styles.reviewed}>Last reviewed: {lastReviewed}</p>
          </aside>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerInner}`}>
          <div>
            <a className={styles.footerBrand} href="/">
              Nexscope
            </a>
            <p>Ecommerce intelligence. AI-powered possibilities.</p>
          </div>
          <nav aria-label="Footer">
            <a href="/tools/">Tools</a>
            <a href="/ecommerce-ai-tools/">Learn</a>
            <a href="/about/">About</a>
            <a href="/security/">Security</a>
            <a href="/contact/">Contact</a>
            <a href="/ecommerce-ai-tools/editorial-policy/">
              Editorial policy
            </a>
            <a href="https://www.nexscope.ai/privacy">Privacy</a>
            <a href="https://www.nexscope.ai/terms">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
