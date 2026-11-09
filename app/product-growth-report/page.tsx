/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardCheck,
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
import styles from './report.module.css';
import GrowthReportExample, {
  reportExampleUrl,
} from '@/components/growth-report-example';

const configure =
  'https://www.nexscope.ai/product-growth-report?co-from=learn#request';
const title = 'Product Growth Report for Ecommerce Sellers | Nexscope';
const description =
  'Get a human-reviewed Nexscope Product Growth Report. Choose AI mentions, competitors, keywords, copy or ad images; SEO and GEO are included with paid services.';
const services = [
  {
    icon: MessagesSquare,
    name: 'AI mentions & recommendations',
    question: 'Does your product appear in the answers you test?',
    text: 'Review sampled buying questions and answers. Distinguish brand mentions, product identification and explicit recommendations, with available evidence and sampling scope.',
    deliverable: 'Questions, observed answers and supporting evidence',
  },
  {
    icon: ScanSearch,
    name: 'Competitor analysis',
    question: 'What alternatives might a buyer consider?',
    text: 'Review relevant alternatives, source links and observable differences. Use the findings to clarify how your product fits a particular buyer or situation.',
    deliverable: 'Relevant alternatives and observable differences',
  },
  {
    icon: Search,
    name: 'Keyword optimization',
    question: 'How might buyers look for your product?',
    text: 'Get product, use-case and purchase-intent keyword directions, with suggested placement and reasons. Search volume is not invented when valid sources are unavailable.',
    deliverable: 'Keyword directions, placement and rationale',
  },
  {
    icon: FileText,
    name: 'Product copy rewriting',
    question: 'How could your page explain the product more clearly?',
    text: 'Get suggested titles, selling points, descriptions and FAQs based on supported product facts. Apply the recommendations in your own listing or store.',
    deliverable: 'Suggested product copy grounded in your facts',
  },
  {
    icon: ImageIcon,
    name: 'Product advertising images',
    question: 'What creative assets do you need next?',
    text: 'Choose 1–20 images, an overall creative direction and requirements for each image. Use Auto sizing or enter custom dimensions. Images are reviewed before delivery.',
    deliverable: 'Previewable, downloadable PNG images · priced per image',
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
        dateModified: '2026-11-06',
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
        url: configure,
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
            <p className={styles.eyebrow}>NEXSCOPE PRODUCT GROWTH REPORT</p>
            <h1>
              Product Growth Report.
              <br />
              <em>Know what to improve next.</em>
            </h1>
            <p className={styles.lead}>
              Nexscope Product Growth Report is a one-time, human-reviewed
              analysis for one product and target market. Choose AI mention
              analysis, competitors, keywords, copy or advertising images. SEO
              and GEO analyses are included with your paid selection. Receive
              findings, available evidence and recommended changes; your team
              applies the improvements.
            </p>
            <a
              className={styles.primary}
              href={configure}
              data-track
              data-track-tool="product-growth-report"
              data-cta-placement="growth-hero"
              target="_blank"
              rel="noopener"
            >
              Choose your services <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className={styles.textLink} href="#report-example">
              Explore a report example{' '}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <p className={styles.small}>
              One product · One target market · Credit quote before submission
            </p>
          </div>
          <aside
            className={styles.reportOutline}
            aria-label="Report structure illustration, not a customer report"
          >
            <div className={styles.outlineHeader}>
              <ClipboardCheck size={26} aria-hidden="true" />
              <span>
                FROM A PRODUCT LINK
                <br />
                <strong>TO A CLEARER ACTION PLAN</strong>
              </span>
            </div>
            <p className={styles.outlineLabel}>
              REPORT STRUCTURE · ILLUSTRATION
            </p>
            {[
              'What we observed',
              'What the evidence supports',
              'What to change first',
            ].map((label, i) => (
              <div className={styles.outlineRow} key={label}>
                <span>0{i + 1}</span>
                <strong>{label}</strong>
                <div className={styles.lines}>
                  <i />
                  <i />
                </div>
              </div>
            ))}
            <p className={styles.review}>
              <Check size={16} aria-hidden="true" /> Human review before
              delivery
            </p>
          </aside>
        </section>
        <div className={styles.facts}>
          <span>Amazon & public store product pages</span>
          <span>SEO & GEO included with paid services</span>
          <span>Expected delivery within 24 hours</span>
        </div>
        <nav className={styles.sectionNav} aria-label="Product report guide">
          <a href="#report-example">Report example</a>
          <a href="#audience">Is it for me?</a>
          <a href="#services">Choose services</a>
          <a href="#which-option">Compare options</a>
          <a href="#process">How it works</a>
          <a href="#questions">Questions</a>
        </nav>
        <GrowthReportExample />
        <section
          className={styles.section}
          id="audience"
          aria-labelledby="audience-title"
        >
          <p className={styles.eyebrow}>FOR OPERATORS AND DEVELOPERS</p>
          <h2 id="audience-title">Less guesswork around one product.</h2>
          <div className={styles.audiences}>
            <article>
              <h3>For product and marketing teams</h3>
              <p>
                Turn a page you want to improve into a focused review, copy
                suggestions or creative assets. Choose a service for your next
                launch, listing revision or campaign brief.
              </p>
            </article>
            <article>
              <h3>For developers and teams building commerce tools</h3>
              <p>
                Get a reviewed product-level brief to inform content
                requirements and implementation priorities. You receive a
                report; this service does not change your application or
                automate website updates.
              </p>
            </article>
          </div>
          <div className={styles.fitGrid}>
            <div>
              <h3>A useful fit when…</h3>
              <ul>
                <li>
                  You are reviewing a product page before a launch or revision.
                </li>
                <li>
                  You need evidence and priorities for a specific product and
                  market.
                </li>
                <li>
                  You want selected copy or image assets alongside the analysis.
                </li>
              </ul>
            </div>
            <div>
              <h3>Choose another approach when…</h3>
              <ul>
                <li>
                  You need ongoing monitoring, live attribution or ad-account
                  management.
                </li>
                <li>
                  You need someone to implement website changes or guarantee
                  rankings and sales.
                </li>
              </ul>
            </div>
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
                    <a
                      href={configure}
                      data-track
                      data-cta-placement="growth-comparison-report"
                    >
                      Product Growth Report
                    </a>
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
                    <a
                      href="/ecommerce-ai-tools/product-showcase/submit/"
                      data-showcase-submit-cta="growth-comparison-gallery"
                    >
                      Free Product Gallery
                    </a>
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
        <section
          className={styles.section}
          id="services"
          aria-labelledby="services-title"
        >
          <p className={styles.eyebrow}>CHOOSE YOUR SCOPE</p>
          <h2 id="services-title">Buy the help you need.</h2>
          <p className={styles.intro}>
            Select at least one service. Add another only when it answers a
            question or produces something your team needs.
          </p>
          <div className={styles.services}>
            {services.map(
              ({ icon: Icon, name, question, text, deliverable }) => (
                <article key={name}>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{name}</h3>
                  <strong>{question}</strong>
                  <p>{text}</p>
                  <span>{deliverable}</span>
                </article>
              ),
            )}
          </div>
          <div className={styles.included}>
            <div>
              <p className={styles.eyebrow}>
                INCLUDED WITH YOUR SELECTED SERVICES
              </p>
              <h3>A clearer foundation for search and AI.</h3>
            </div>
            <div>
              <p>
                <strong>Search visibility analysis (SEO)</strong>
                <br />
                Review accessible page structure, metadata and content gaps.
              </p>
              <p>
                <strong>AI search readiness analysis (GEO)</strong>
                <br />
                Identify gaps in product identity, use cases, answers and
                supporting facts.
              </p>
              <small>
                Included analyses cannot be requested alone. They are not proof
                of Google indexing or a guarantee of AI recommendations.
              </small>
            </div>
          </div>
        </section>
        <section
          className={styles.section}
          id="process"
          aria-labelledby="process-title"
        >
          <p className={styles.eyebrow}>
            A CLEAR START AND A TANGIBLE DELIVERY
          </p>
          <h2 id="process-title">From link to reviewed recommendations.</h2>
          <ol className={styles.steps}>
            <li>
              <span>01</span>
              <h3>Tell us about the product</h3>
              <p>
                Provide a public product URL, target market and report language.
                Add your priorities and choose services or image requirements.
              </p>
            </li>
            <li>
              <span>02</span>
              <h3>Confirm your credit quote</h3>
              <p>
                Review the current total, sign in and confirm. Credits are
                deducted on successful submission. Image quantity affects your
                total.
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>Review and use your delivery</h3>
              <p>
                Check status without keeping the page open. After human review,
                read and download your HTML report and purchased PNG images.
              </p>
            </li>
          </ol>
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
          <a
            href="/ecommerce-ai-tools/product-showcase/submit/"
            data-showcase-submit-cta="growth-report-gallery"
          >
            List your product for free{' '}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </section>
        <section
          className={styles.section}
          id="questions"
          aria-labelledby="faq-title"
        >
          <p className={styles.eyebrow}>BEFORE YOU SUBMIT</p>
          <h2 id="faq-title">Your questions, answered.</h2>
          <div className={styles.faq}>
            {faqs.map(({ q, a }) => (
              <details key={q}>
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
            See the available services and your current credit quote on Nexscope
            before committing.
          </p>
          <a
            className={styles.primary}
            href={configure}
            data-track
            data-track-tool="product-growth-report"
            data-cta-placement="growth-bottom"
            target="_blank"
            rel="noopener"
          >
            Build your report request{' '}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
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
