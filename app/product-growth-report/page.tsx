/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  Link2,
  Check,
  Rocket,
  RefreshCw,
  Package,
  MessagesSquare,
  ScanSearch,
  Search,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import {
  GROWTH_REPORT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import gradientTitle from '@/app/gradient-title.module.css';
import styles from './report.module.css';
import GrowthReportExample, {
  reportExampleUrl,
} from '@/components/growth-report-example';
import {
  productGrowthReportUrl,
} from '@/lib/growth-report-links';

const title = 'Ecommerce Product Page Audit & Growth Report | Nexscope';
const description =
  'Get a human-reviewed audit for an Amazon or store product page. SEO and GEO analyses are included free when you select at least one paid service.';
const services = [
  {
    icon: MessagesSquare,
    name: 'AI mentions',
    deliverable: 'See how AI answers describe your product.',
  },
  {
    icon: ScanSearch,
    name: 'Competitors',
    deliverable: 'Compare your listing with relevant alternatives.',
  },
  {
    icon: Search,
    name: 'Keywords',
    deliverable: 'Find useful phrases and where to place them.',
  },
  {
    icon: FileText,
    name: 'Listing copy',
    deliverable: 'Get suggested titles, bullets and FAQs.',
  },
  {
    icon: ImageIcon,
    name: 'Ad images',
    deliverable: 'Choose 1–20 downloadable PNGs, priced per image.',
  },
];
const faqs = [
  {
    q: 'What is the Nexscope Product Growth Report?',
    a: 'It is a one-time, human-reviewed analysis and optional creative service for one product and target market. Choose at least one paid service: AI mentions, competitors, keywords, copy or advertising images. SEO and GEO analyses are included. You receive recommendations and selected materials, then apply the changes yourself.',
  },
  {
    q: 'What product links can I submit?',
    a: 'Submit an Amazon product detail page or a publicly accessible product page from an independent store. Choose one target market and report language. Access restrictions or insufficient product information can limit the analysis. Submitting a URL does not connect your private store or advertising account.',
  },
  {
    q: 'Can I request only the free SEO and GEO analyses?',
    a: 'No. Select at least one of the five paid services. Search visibility analysis (SEO) and AI search readiness analysis (GEO) are included with that selection. They identify page information and evidence gaps; they do not verify live Google rankings, traffic or guaranteed AI recommendations.',
  },
  {
    q: 'How much does a report cost, and when am I charged?',
    a: 'The current credit quote depends on your chosen services, image quantity and any applicable offer. Review it in the request form before confirming. Credits are deducted when your submission succeeds, not while browsing or filling in the form. This page does not quote a fixed cash price.',
  },
  {
    q: 'When will I receive my report?',
    a: 'Delivery is expected within 24 hours after submission, with human review before release. This is an estimate, not a guaranteed service-level deadline. Check the latest request status or your history; you do not need to keep the page open. You can choose a readiness notification to your registered email.',
  },
  {
    q: 'What can I download?',
    a: 'Read the delivered report online and download it as HTML. If you selected advertising images, preview, enlarge and download the delivered PNG files separately. Auto sizing chooses dimensions for the creative direction; it does not mean unlimited resolution.',
  },
  {
    q: 'What if my request cannot be fulfilled?',
    a: 'If your request is rejected, you receive a visible reason and the credits actually deducted for that request are returned. This is a credit return, not a cash refund. Unlimited revisions, unconditional cancellation and post-delivery refunds are not included promises.',
  },
  {
    q: 'Does Nexscope apply the changes or guarantee more sales?',
    a: 'You apply the recommendations yourself. This is a one-product, one-market analysis, not ongoing monitoring, website editing or ad management. Indexing, rankings, AI citations, traffic and sales are not guaranteed. AI mention findings describe tested questions and samples, not whole-market exposure.',
  },
  {
    q: 'Is this the same as a free Product Gallery listing?',
    a: 'No. Product Growth Report services have a credit quote. Product Gallery submission, editorial review and approved display are completely free and use a separate submission process. Neither requires purchasing the other.',
  },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/product-growth-report/' },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: '/product-growth-report/',
    type: 'website',
    images: [GROWTH_REPORT_SOCIAL_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [GROWTH_REPORT_SOCIAL_IMAGE],
  },
};

export default function ProductGrowthReport() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      NEXSCOPE_ORGANIZATION,
      {
        '@type': 'WebPage',
        '@id': 'https://learn.nexscope.ai/product-growth-report/#webpage',
        url: 'https://learn.nexscope.ai/product-growth-report/',
        name: title,
        description,
        dateModified: '2026-11-10',
        citation: {
          '@type': 'DigitalDocument',
          name: 'PCIQUTE condensed report example',
          url: reportExampleUrl,
          publisher: { '@id': NEXSCOPE_ORGANIZATION['@id'] },
        },
        mainEntity: {
          '@id': 'https://learn.nexscope.ai/product-growth-report/#service',
        },
      },
      {
        '@type': 'Service',
        '@id': 'https://learn.nexscope.ai/product-growth-report/#service',
        name: 'Nexscope Product Growth Report',
        serviceType: 'Product analysis and creative services',
        provider: { '@id': NEXSCOPE_ORGANIZATION['@id'] },
        description,
        url: productGrowthReportUrl,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Nexscope Learn',
            item: 'https://learn.nexscope.ai/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Product Growth Report',
            item: 'https://learn.nexscope.ai/product-growth-report/',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  };
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll('<', '\\u003c'),
        }}
      />
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <MarketingHeader active="growth" campaign="product-growth-report" />
      <main id="main" className={styles.main}>
        <section className={styles.hero}>
          <div>
            <h1>
              <span className={gradientTitle.text}>Product Growth</span> Report
            </h1>
            <p className={styles.lead}>
              Find what to fix first on one Amazon or store product page. Get
              prioritized recommendations reviewed by our team.
            </p>
            <div className={styles.heroActions}>

              <a
                className={styles.textLink}
                href="#report-example"
                data-cta-placement="growth-hero"
              >
                See a real example <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <p className={styles.includedAnalyses}>
              See your credit total before signing in.
            </p>
            <ul className={styles.heroFacts}>
              <li>One product · One market</li>
              <li>Expected within 24 hours</li>
            </ul>
          </div>
          <aside
            className={styles.reportOutline}
            aria-label="Finding from the public report example"
          >
            <div className={styles.outlineHeader}>
              <ClipboardCheck size={18} aria-hidden="true" />
              <span>From a real report · Amazon UK</span>
            </div>
            <div className={styles.outlineBody}>
              <img
                className={styles.outlineImage}
                src="/assets/growth-report/pciqute-product-reference.jpg"
                width={320}
                height={320}
                alt="PCIQUTE paint roller set from the sample report"
              />
              <div>
                <p className={styles.outlineFinding}>
                  Show how the roller measures 60–160 cm.
                </p>
                <p className={styles.outlineAction}>
                  Add both measurement points to a product image, then use the
                  same range in your listing.
                </p>
                <a
                  className={styles.outlineLink}
                  href={`${reportExampleUrl}?co-from=learn#module-seo`}
                  data-track
                  data-cta-placement="growth-hero-evidence"
                  target="_blank"
                  rel="noopener"
                >
                  Read the finding <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>
        </section>
        <nav className={styles.sectionNav} aria-label="Product report guide">
          <a href="#services" data-cta-placement="growth-section-nav">
            What you get
          </a>
          <a href="#report-example" data-cta-placement="growth-section-nav">
            Example
          </a>
          <a href="#process" data-cta-placement="growth-section-nav">
            How it works
          </a>
          <a href="#questions" data-cta-placement="growth-section-nav">
            FAQ
          </a>
        </nav>
        <section
          className={styles.section}
          id="services"
          aria-labelledby="services-title"
        >
          <h2 id="services-title" data-learn-section="growth-report-services">
            What you can get
          </h2>
          <p className={styles.intro}>
            Choose the services you need for your product.
          </p>
          <div className={styles.services}>
            {services.map(({ icon: Icon, name, deliverable }) => (
              <article key={name}>
                <Icon size={20} aria-hidden="true" />
                <div>
                  <h3>{name}</h3>
                  <p>{deliverable}</p>
                </div>
              </article>
            ))}
          </div>
          <p className={styles.included}>
            <strong>SEO and GEO analyses included</strong> when you select a
            paid service.
          </p>
        </section>
        <GrowthReportExample />
        <section
          className={styles.section}
          id="process"
          aria-labelledby="process-title"
        >
          <h2 id="process-title">How it works</h2>
          <ol className={styles.steps}>
            <li>
              <div className={styles.stepPreview} aria-hidden="true">
                <div className={styles.previewLabel}>
                  <Link2 size={16} /> Product link
                </div>
                <div className={styles.urlPreview}>
                  <span>amazon.com/dp/your-product</span>
                  <Check size={16} />
                </div>
                <div className={styles.previewPills}>
                  <span>Market</span>
                  <span>Language</span>
                  <span>Services</span>
                </div>
              </div>
              <div className={styles.stepCopy}>
                <span className={styles.stepNumber}>01</span>
                <h3>Add a product link</h3>
                <p>Choose a market, report language and services.</p>
              </div>
            </li>
            <li>
              <div className={styles.stepPreview} aria-hidden="true">
                <div className={styles.previewLabel}>
                  <ClipboardCheck size={16} /> Your selection
                </div>
                <div className={styles.quoteRow}>
                  <span>Selected services</span>
                  <Check size={15} />
                </div>
                <div className={styles.quoteRow}>
                  <span>Credit total</span>
                  <span>Review before submitting</span>
                </div>
                <div className={styles.previewButton}>
                  Check the quote <ArrowRight size={13} />
                </div>
              </div>
              <div className={styles.stepCopy}>
                <span className={styles.stepNumber}>02</span>
                <h3>Check the quote</h3>
                <p>Review the total, then sign in to submit.</p>
              </div>
            </li>
            <li>
              <a
                className={styles.reportPreview}
                href={reportExampleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the example Product Growth Report"
              >
                <img
                  src="/assets/growth-report/pciqute-square-preview.jpg"
                  width="480"
                  height="480"
                  loading="lazy"
                  alt="Product creative from the example growth report"
                />
                <div className={styles.reportPreviewCopy}>
                  <span className={styles.previewLabel}>
                    <FileText size={16} /> Product report
                  </span>
                  <strong>Findings &amp; next steps</strong>
                  <span>
                    Explore the real example <ArrowUpRight size={13} />
                  </span>
                </div>
              </a>
              <div className={styles.stepCopy}>
                <span className={styles.stepNumber}>03</span>
                <h3>Get your report</h3>
                <p>
                  Read it online or download it with any images you ordered.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <section
          className={styles.section}
          id="audience"
          aria-labelledby="audience-title"
        >
          <h2 id="audience-title">Who it’s for</h2>
          <div className={styles.audienceCards}>
            <article>
              <Rocket size={25} aria-hidden="true" />
              <div>
                <h3>Launching a product</h3>
                <p>Plan your listing, copy and creative before launch.</p>
              </div>
            </article>
            <article>
              <RefreshCw size={25} aria-hidden="true" />
              <div>
                <h3>Refreshing a listing</h3>
                <p>Find what to improve on an existing product page.</p>
              </div>
            </article>
            <article>
              <Package size={25} aria-hidden="true" />
              <div>
                <h3>Planning with your team</h3>
                <p>Turn one product review into clear next steps.</p>
              </div>
            </article>
          </div>
        </section>
        <section
          className={styles.section}
          id="which-option"
          aria-labelledby="option-title"
        >
          <p className={styles.eyebrow}>THREE DIFFERENT JOBS</p>
          <h2 id="option-title">Report, API or free product listing?</h2>
          <div className={styles.compareWrap}>
            <table>
              <caption>Choose by the outcome you need.</caption>
              <thead>
                <tr>
                  <th scope="col">Your goal</th>
                  <th scope="col">Start here</th>
                  <th scope="col">What you receive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    Decide what to improve on one product page
                  </th>
                  <td>

                    <small>Credit quote before submission</small>
                  </td>
                  <td>
                    A human-reviewed report and any selected copy or images;
                    your team applies the changes.
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    Build repeatable research into your own software
                  </th>
                  <td>
                    <a href="/data/">Data APIs</a>
                    <small>Endpoint access and credits apply</small>
                  </td>
                  <td>
                    Documented API responses for you to integrate and interpret.
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    Give your product another public source of facts
                  </th>
                  <td>

                    <small>
                      Submission, review and approved display are free
                    </small>
                  </td>
                  <td>A reviewed public product page linking to your store.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className={styles.gallery}>
          <div>
            <p className={styles.eyebrow}>A SEPARATE, COMPLETELY FREE OPTION</p>
            <h2>Need a public page for your product?</h2>
            <p>
              Product Gallery brings approved product facts, images and your
              store link into one public page. Submission, review and approved
              display are completely free. A growth report is not required.
            </p>
          </div>

        </section>
        <section
          className={styles.section}
          id="questions"
          aria-labelledby="faq-title"
        >
          <p className={styles.eyebrow}>BEFORE YOU SUBMIT</p>
          <h2 id="faq-title">Your questions, answered.</h2>
          <div className={styles.faq}>
            {faqs.map(({ q, a }, index) => (
              <details key={q} data-learn-detail={`faq-${index + 1}`}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className={styles.final}>
          <p className={styles.eyebrow}>START WITH ONE PRODUCT</p>
          <h2>Choose a clearer next step.</h2>
          <p>
            Choose the services you need and see your credit total before
            signing in.
          </p>

          <small>
            Recommendations and materials for your team to apply. No guaranteed
            rankings, AI recommendations or sales outcomes.
          </small>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
