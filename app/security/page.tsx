import type { Metadata } from 'next';
import SiteInfoPage from '@/components/site-info-page';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from '../site-info.module.css';

const url = 'https://learn.nexscope.ai/security/';
const securityEmail =
  'mailto:service@nexscope.ai?subject=Nexscope%20security%20report';

export const metadata: Metadata = {
  title: 'Security at Nexscope | Reporting & Data Protection',
  description:
    'Review Nexscope security practices, credential-handling guidance and the private channel for reporting a potential vulnerability.',
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    url,
    siteName: 'Nexscope',
    title: 'Security at Nexscope',
    description:
      'Published safeguards, credential guidance and security-reporting instructions for Nexscope.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Security at Nexscope',
    description:
      'Published safeguards, credential guidance and security-reporting instructions for Nexscope.',
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

const supportingLinks = [
  {
    href: securityEmail,
    label: 'Report a security concern',
    description: 'Use a private email channel; do not open a public issue.',
  },
  {
    href: 'https://www.nexscope.ai/privacy',
    label: 'Privacy Policy',
    description: 'Data collection, use, retention, safeguards and privacy rights.',
  },
  {
    href: 'https://www.nexscope.ai/terms',
    label: 'Terms of Service',
    description: 'The current terms governing use of the Nexscope service.',
  },
] as const;

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              NEXSCOPE_ORGANIZATION,
              {
                '@type': 'WebPage',
                '@id': `${url}#webpage`,
                url,
                name: 'Security at Nexscope',
                description:
                  'Nexscope security practices, credential guidance and vulnerability-reporting instructions.',
                about: { '@id': 'https://www.nexscope.ai/#organization' },
                isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
              },
            ],
          }),
        }}
      />
      <SiteInfoPage
        campaign="security"
        eyebrow="SECURITY"
        title="Protecting accounts, data and ecommerce workflows."
        lead="Nexscope uses technical and organizational safeguards designed to protect the personal information it processes. This page summarizes published practices and explains how to report a potential security issue privately."
        supportingTitle="Security and policy links"
        supportingLinks={supportingLinks}
        lastReviewed="October 8, 2026"
      >
        <section>
          <h2>Published security practices</h2>
          <p>
            Nexscope&apos;s Privacy Policy identifies the following safeguards.
            Their implementation and scope may evolve with the service.
          </p>
          <div className={styles.cards}>
            <div className={styles.card}>
              <h3>Encryption</h3>
              <p>Encryption of data in transit and at rest.</p>
            </div>
            <div className={styles.card}>
              <h3>Assessment</h3>
              <p>Regular security assessments and penetration testing.</p>
            </div>
            <div className={styles.card}>
              <h3>Access controls</h3>
              <p>Access controls and authentication mechanisms.</p>
            </div>
            <div className={styles.card}>
              <h3>People and process</h3>
              <p>Employee training on data protection.</p>
            </div>
          </div>
          <div className={styles.callout}>
            <strong>No absolute-security claim</strong>
            <p>
              No internet transmission or storage system can be guaranteed to be
              completely secure. The{' '}
              <a href="https://www.nexscope.ai/privacy">Privacy Policy</a> is the
              source of truth for Nexscope&apos;s current published data-security
              statement.
            </p>
          </div>
        </section>

        <section>
          <h2>Protect credentials when using Nexscope</h2>
          <ul>
            <li>
              Enter API keys only in the intended Nexscope product or documented
              client configuration. Do not paste them into public issues,
              discussions, screenshots or articles.
            </li>
            <li>
              Redact bearer tokens, cookies, authorization headers, payment details
              and private customer data before sharing a request or error example.
            </li>
            <li>
              Treat a key as compromised if it was exposed. Revoke or rotate it
              through the appropriate account controls before continuing.
            </li>
            <li>
              Connected selling-partner authorization uses the supported
              authorization flow; Nexscope does not request or store a selling
              partner&apos;s Seller Central username or password.
            </li>
          </ul>
        </section>

        <section>
          <h2>Report a potential vulnerability</h2>
          <p>
            Email <a href={securityEmail}>service@nexscope.ai</a> with the subject
            “Nexscope security report.” Do not disclose an unpatched issue in a
            public GitHub issue or community discussion.
          </p>
          <h3>Include enough information to reproduce the issue</h3>
          <ol>
            <li>The affected Nexscope domain, page, API endpoint or feature.</li>
            <li>Clear reproduction steps and the observed security impact.</li>
            <li>Relevant timestamps, request identifiers and redacted evidence.</li>
            <li>A safe way for the Nexscope team to contact you.</li>
          </ol>
          <h3>Keep the report safe</h3>
          <p>
            Do not include passwords, live API keys, session tokens, payment data,
            unnecessary personal information or another user&apos;s private data. If
            sensitive evidence is required, first ask the team to arrange an
            appropriate transfer method.
          </p>
        </section>

        <section>
          <h2>Scope of this page</h2>
          <p>
            This is a public security overview, not a certification report,
            penetration-test result, bug-bounty promise or service-level agreement.
            Nexscope does not claim a security certification here unless an official
            current document is linked explicitly.
          </p>
        </section>
      </SiteInfoPage>
    </>
  );
}
