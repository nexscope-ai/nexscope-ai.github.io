/* Native anchors keep exported GitHub Pages routes and the Jekyll section interoperable. */
/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import SiteInfoPage from '@/components/site-info-page';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from '../site-info.module.css';

const url = 'https://learn.nexscope.ai/contact/';
const supportEmail =
  'mailto:service@nexscope.ai?subject=Nexscope%20support%20request';

export const metadata: Metadata = {
  title: 'Contact Nexscope | Support, Sales & Security',
  description:
    'Contact Nexscope for account, billing, product, API, sales, editorial or security questions and choose the correct public or private support channel.',
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    url,
    siteName: 'Nexscope',
    title: 'Contact Nexscope',
    description:
      'Choose the right Nexscope channel for product, account, API, sales, editorial or security questions.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Nexscope',
    description:
      'Official Nexscope contact and support channels.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const supportingLinks = [
  {
    href: supportEmail,
    label: 'Email Nexscope',
    description: 'Private account, billing, sales, security or data matters.',
  },
  {
    href: 'https://github.com/nexscope-ai/ecommerce-ai-tools/discussions/categories/q-a',
    label: 'Community Q&A',
    description: 'Public tool, API, REST and MCP usage questions.',
  },
  {
    href: 'https://github.com/nexscope-ai/ecommerce-ai-tools/issues/new/choose',
    label: 'Issue tracker',
    description: 'Reproducible bugs, feature requests and content corrections.',
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                ...NEXSCOPE_ORGANIZATION,
                contactPoint: [
                  {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'service@nexscope.ai',
                  },
                  {
                    '@type': 'ContactPoint',
                    contactType: 'security issues',
                    email: 'service@nexscope.ai',
                  },
                ],
              },
              {
                '@type': 'ContactPage',
                '@id': `${url}#webpage`,
                url,
                name: 'Contact Nexscope',
                description: 'Official contact and support channels for Nexscope.',
                about: { '@id': 'https://www.nexscope.ai/#organization' },
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
              },
            ],
          }),
        }}
      />
      <SiteInfoPage
        campaign="contact"
        eyebrow="CONTACT NEXSCOPE"
        title="Choose the right channel for a faster answer."
        lead="Use private email for account, billing, sales, security and data matters. Use the public community and issue tracker for questions or reproducible problems that can be discussed without secrets."
        supportingTitle="Contact Nexscope"
        supportingLinks={supportingLinks}
        lastReviewed="October 8, 2026"
      >
        <section>
          <h2>Where to send your request</h2>
          <div className={styles.channelList}>
            <div className={styles.channel}>
              <div>
                <strong>Account, billing or sales</strong>
                <a href={supportEmail}>service@nexscope.ai</a>
              </div>
              <p>
                Use email for private account details, subscription questions,
                billing, partnerships, sales and service inquiries.
              </p>
            </div>
            <div className={styles.channel}>
              <div>
                <strong>Product or API question</strong>
                <a href="https://github.com/nexscope-ai/ecommerce-ai-tools/discussions/categories/q-a">
                  Community Q&amp;A
                </a>
              </div>
              <p>
                Ask public usage questions about Nexscope tools, REST APIs, MCP
                integrations and documented ecommerce workflows.
              </p>
            </div>
            <div className={styles.channel}>
              <div>
                <strong>Reproducible bug</strong>
                <a href="https://github.com/nexscope-ai/ecommerce-ai-tools/issues/new/choose">
                  Open an issue
                </a>
              </div>
              <p>
                Report expected and actual behavior, steps to reproduce and a
                non-sensitive error code. Redact all credentials and customer data.
              </p>
            </div>
            <div className={styles.channel}>
              <div>
                <strong>Feature or workflow idea</strong>
                <a href="https://github.com/nexscope-ai/ecommerce-ai-tools/discussions/categories/ideas">
                  Share an idea
                </a>
              </div>
              <p>
                Describe the goal, expected output and current workaround so the
                request can be evaluated in context.
              </p>
            </div>
            <div className={styles.channel}>
              <div>
                <strong>Security concern</strong>
                <a href="mailto:service@nexscope.ai?subject=Nexscope%20security%20report">
                  Send a private report
                </a>
              </div>
              <p>
                Do not publish suspected vulnerabilities. Follow the{' '}
                <a href="/security/">security reporting guidance</a> before sending
                evidence.
              </p>
            </div>
            <div className={styles.channel}>
              <div>
                <strong>Editorial correction</strong>
                <a href="https://github.com/nexscope-ai/ecommerce-ai-tools/issues/new/choose">
                  Report a correction
                </a>
              </div>
              <p>
                Include the page URL, the exact claim, the proposed correction and
                a primary source when available.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>What to include</h2>
          <ul>
            <li>Your goal and the Nexscope tool, page or endpoint involved.</li>
            <li>The marketplace, locale and relevant non-sensitive input.</li>
            <li>Expected behavior and what actually happened.</li>
            <li>A timestamp, request identifier or redacted screenshot if useful.</li>
          </ul>
          <div className={styles.callout}>
            <strong>Never send secrets in a public channel</strong>
            <p>
              Do not post API keys, passwords, tokens, cookies, payment details,
              private customer data or unredacted screenshots in GitHub Discussions
              or Issues.
            </p>
          </div>
        </section>

        <section>
          <h2>Response expectations</h2>
          <p>
            The Nexscope team checks public Q&amp;A and actionable issue reports on
            business days and aims to acknowledge them within one business day.
            This is a response target, not a guaranteed resolution time. Private
            product and service inquiries are generally reviewed within one to two
            business days.
          </p>
          <p>
            Search existing discussions and issues before opening a duplicate. A
            clear, safely redacted report is usually easier to investigate.
          </p>
        </section>
      </SiteInfoPage>
    </>
  );
}
