'use client';

/* oxlint-disable next/no-html-link-for-pages */
import { useEffect, useState } from 'react';
import { ArrowUpRight, Bot, Check, Copy } from 'lucide-react';
import styles from '@/app/home-sections.module.css';

const guideUrl = '/ecommerce-ai-tools/ecommerce-mcp-server/';

export default function HomeMcpBanner({
  endpointUrl,
  setupUrl,
}: {
  endpointUrl: string;
  setupUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [copyTick, setCopyTick] = useState(0);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied, copyTick]);

  async function copyEndpoint() {
    try {
      await navigator.clipboard.writeText(endpointUrl);
    } catch {
      return;
    }
    setCopied(true);
    setCopyTick((tick) => tick + 1);
  }

  return (
    <section
      id="mcp"
      className={styles.mcpBanner}
      aria-labelledby="mcp-banner-title"
    >
      <div className={styles.mcpLead}>
        <span className={styles.mcpMark} aria-hidden="true">
          <Bot size={16} />
        </span>
        <span className={styles.mcpPill}>MCP</span>
        <div className={styles.mcpLeadText}>
          <p id="mcp-banner-title" className={styles.mcpHeadline}>
            Plug every API into your AI agent via MCP
          </p>
          <p className={styles.mcpSubline}>Claude, Cursor, and Codex</p>
        </div>
      </div>
      <div className={styles.mcpEndpoint} data-copied={copied ? 'true' : 'false'}>
        <span className={styles.srOnly}>MCP endpoint</span>
        <code>{endpointUrl}</code>
        <button
          type="button"
          className={styles.mcpCopy}
          onClick={copyEndpoint}
          aria-label={copied ? 'Copied' : 'Copy MCP endpoint'}
        >
          {copied ? (
            <Check size={13} aria-hidden="true" />
          ) : (
            <Copy size={13} aria-hidden="true" />
          )}
          <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <output className={styles.srOnly} aria-live="polite">
          {copied ? 'Copied' : ''}
        </output>
      </div>
      <div className={styles.mcpActions}>
        <a className={styles.mcpGuide} href={guideUrl}>
          MCP setup guide
        </a>
        <a
          className={styles.mcpConnect}
          href={setupUrl}
          target="_blank"
          rel="noopener"
          data-track
          data-cta-placement="home-mcp"
        >
          Connect MCP <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
