/* oxlint-disable next/no-html-link-for-pages */
import styles from '@/app/home.module.css';

export default function LearnFooter() {
  return (
    <div className={styles.home}>
      <footer className={`${styles.wrap} ${styles.footer}`}>
        <div>
          <a href="/">Nexscope Learn</a>
          <p>Ecommerce data. Clearer product discovery.</p>
        </div>
        <nav className={styles.footerlinks} aria-label="Footer">
          <a href="/data/">Data APIs</a>
          <a href="/ecommerce-ai-tools/product-showcase/">Product Gallery</a>
          <a
            href="/ecommerce-ai-tools/product-showcase/submit/"
            data-showcase-submit-cta="root-home-footer"
          >
            List a product free
          </a>
          <a href="/tools/">Tools</a>
          <a href="/pricing/">Pricing</a>
          <a href="/ecommerce-ai-tools/">Learning library</a>
          <a href="/ecommerce-ai-tools/community/">Community</a>
          <a href="/about/">About</a>
          <a href="/security/">Security</a>
          <a href="/contact/">Contact</a>
          <a href="https://www.nexscope.ai/privacy?co-from=learn">Privacy</a>
          <a href="https://www.nexscope.ai/terms?co-from=learn">Terms</a>
          <a href="#analytics-preferences">Cookie settings</a>
        </nav>
        <p className={styles.disclosure}>
          Nexscope publishes this directory and Product Gallery. Product
          submission, review and approved display are free. API access and
          credits follow the selected operation’s official documentation.
        </p>
      </footer>
    </div>
  );
}
