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
          <a href="/video-apis/" data-track-tool="video-api-directory">
            Video &amp; Image APIs
          </a>
          <a href="/social/">Social APIs</a>
          <a href="/video/" data-track-tool="video-directory">
            Video workflows
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
          Nexscope publishes this directory. API access and
          credits follow the selected operation’s official documentation.
        </p>
      </footer>
    </div>
  );
}
