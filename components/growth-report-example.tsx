/* oxlint-disable next/no-img-element */
import { ArrowUpRight } from 'lucide-react';
import styles from '@/app/product-growth-report/report.module.css';

// Facts selected from the public example, not package entitlements or live data.
export const reportExampleUrl =
  'https://www.nexscope.ai/reports/product-growth-example-en.html';
const sections = [
  {
    title: 'Search visibility: make the specification clear',
    anchor: 'module-seo',
    evidence:
      'The saved listing states approximately 60–160 cm working length with the roller setup attached.',
    action:
      'Explain the measurement endpoints consistently in the title, bullets, FAQ and a measured setup image. Do not turn it into a 2 m pole claim.',
    check:
      'Confirm the actual assembled measurement and inspect the published listing on mobile.',
  },
  {
    title: 'AI readiness: keep product identity consistent',
    anchor: 'module-geo',
    evidence:
      'The sample identifies the brand PCIQUTE, model UKPT129NA and ASIN B0HDC7BHX5, with existing FAQ material.',
    action:
      'Use the same identity, roller sizes and rod-count explanation across product fields and merchant-owned references.',
    check:
      'Check each statement against the real product. Readiness improvements are separate from measured AI mentions.',
  },
  {
    title: 'AI mentions: inspect the answer, not just the name',
    anchor: 'module-ai_mentions',
    evidence:
      'This example includes 21 saved answers to seven buying questions: 14 ChatGPT responses and seven Gemini responses.',
    action:
      'Read the exact answer and cited product. A saved ChatGPT answer mentions PCIQUTE; a corresponding Gemini answer names different options.',
    check:
      'The collections are not a matched visibility-rate study. One citation is Nexscope-owned: affiliated evidence, not independent endorsement.',
  },
  {
    title: 'Competitors: compare the complete offer',
    anchor: 'module-competitors',
    evidence:
      'The sample reviews four direct peers, a benchmark and selected buyer-review summaries. It identifies differences in kit contents and available feedback.',
    action:
      'Compare the exact kit, included pole, seller, delivery and variant before making a price or suitability claim.',
    check:
      'Saved ratings and prices can change. One buyer account does not establish a product defect rate.',
  },
  {
    title: 'Keywords: connect a phrase to a truthful placement',
    anchor: 'module-keywords',
    evidence:
      '“Paint roller set with extension pole” appears in the supplied Google UK and Amazon UK autocomplete evidence.',
    action:
      'Use the relevant category phrase in the title or first bullet where accurate. Explain sectional rods without implying a different telescopic mechanism.',
    check:
      'Autocomplete is phrase-discovery evidence, not search volume, ranking or proven demand.',
  },
  {
    title: 'Copy: turn the finding into a usable draft',
    anchor: 'module-copywriting',
    evidence:
      'The sample provides a British-English title, five bullets and a product description based on the listed kit.',
    action:
      'Keep the brand, 17-piece contents, 9-inch and 4-inch roller sizes and the stated working-length basis clear.',
    check:
      'Verify pack contents, measurements and current field limits before applying the draft.',
  },
  {
    title: 'Images: review a concept before using it',
    anchor: 'module-ad_images',
    evidence:
      'Three embedded advertising previews show a square product composition, a wide decorating scene and a vertical roller detail.',
    action:
      'Choose the concept that suits your placement and check geometry, connectors and included items against the reference.',
    check:
      'These JPEG previews are not original-resolution deliveries. Generated scenes are not photographed product tests.',
  },
];
const previews = [
  {
    file: 'pciqute-square-preview.jpg',
    title: 'Product-first composition',
    alt: 'PCIQUTE paint roller set — square advertising concept preview',
    width: 480,
    height: 480,
  },
  {
    file: 'pciqute-wide-preview.jpg',
    title: 'Decorating scene',
    alt: 'PCIQUTE paint roller set — illustrative decorating scene preview',
    width: 560,
    height: 293,
  },
  {
    file: 'pciqute-vertical-preview.jpg',
    title: 'Roller detail',
    alt: 'PCIQUTE paint roller set — vertical roller and handle concept preview',
    width: 360,
    height: 640,
  },
];

export default function GrowthReportExample() {
  return (
    <section
      className={styles.section}
      id="report-example"
      aria-labelledby="example-title"
    >
      <p className={styles.eyebrow}>
        SEE THE FINDING, THE EVIDENCE AND THE NEXT ACTION
      </p>
      <h2 id="example-title" data-learn-section="growth-report-example">
        A product report, unpacked.
      </h2>
      <div
        className={styles.actionPreview}
        aria-label="One finding turned into a next step"
      >
        <div>
          <span>01 · Product fact</span>
          <h3>What does 60–160 cm measure?</h3>
          <p>
            The saved listing describes working length with the roller attached.
          </p>
        </div>
        <div>
          <span>02 · Recommended change</span>
          <h3>Show the measurement.</h3>
          <p>
            Label both endpoints in an image and use the same range in the
            title, bullets and FAQ.
          </p>
        </div>
        <div>
          <span>03 · Your next action</span>
          <h3>Verify, then update.</h3>
          <p>
            Measure the assembled kit before applying the copy. The report
            provides the plan; your team makes the changes.
          </p>
        </div>
      </div>
      <p className={styles.sampleNote}>
        This is a recommendation from the public example, not a measured
        improvement in sales or AI visibility.
      </p>
      <a
        className={styles.sourceLink}
        href="https://www.nexscope.ai/product-growth-report?co-from=learn#request"
        target="_blank"
        rel="noopener"
        data-track="start_using"
        data-cta-placement="growth-example-next-action"
      >
        Choose a focus for my product{' '}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
      <div className={styles.sampleIntro}>
        <img
          src="/assets/growth-report/pciqute-product-reference.jpg"
          alt="PCIQUTE 17-piece paint roller set — product reference from the public example"
          width="320"
          height="320"
          loading="lazy"
        />
        <div>
          <h3>PCIQUTE 17-piece paint roller set</h3>
          <p>
            Amazon UK · ASIN B0HDC7BHX5 · Saved report dated 5 November 2026
          </p>
          <p>
            The useful starting point was not “add more keywords.” It was to
            explain the assembled working length, strengthen product evidence
            and investigate a connection-related buyer account before making
            durability claims.
          </p>
          <a
            className={styles.sourceLink}
            href={`${reportExampleUrl}?co-from=learn`}
            target="_blank"
            rel="noopener"
            data-track
            data-cta-placement="growth-example-full"
          >
            Open the complete public example{' '}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className={styles.sampleNote}>
        This is a condensed reference example published by Nexscope, not a
        customer success story or a fresh live audit. Its counts, findings and
        selected services describe this sample only; they are not a fixed
        package or a promise of better rankings or sales.
      </p>
      <div className={styles.sampleSections}>
        {sections.map((section, index) => (
          <details
            key={section.anchor}
            open={index === 0}
            data-learn-detail={section.anchor}
          >
            <summary>
              <span>0{index + 1}</span>
              {section.title}
            </summary>
            <div className={styles.sampleDetails}>
              <dl>
                <div>
                  <dt>Observed evidence</dt>
                  <dd>{section.evidence}</dd>
                </div>
                <div>
                  <dt>Recommended action</dt>
                  <dd>{section.action}</dd>
                </div>
                <div>
                  <dt>What to verify</dt>
                  <dd>{section.check}</dd>
                </div>
              </dl>
              <a
                className={styles.sourceLink}
                href={`${reportExampleUrl}?co-from=learn#${section.anchor}`}
                target="_blank"
                rel="noopener"
                data-track
                data-cta-placement={`growth-example-${section.anchor}`}
              >
                Read this section and its sources{' '}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </details>
        ))}
      </div>
      <div className={styles.previewGrid}>
        {previews.map((preview) => (
          <figure key={preview.file}>
            <a
              href={`${reportExampleUrl}?co-from=learn#module-ad_images`}
              target="_blank"
              rel="noopener"
              aria-label={`View ${preview.title} in the full report`}
              data-cta-placement="growth-example-image"
            >
              <img
                src={`/assets/growth-report/${preview.file}`}
                alt={preview.alt}
                width={preview.width}
                height={preview.height}
                loading="lazy"
              />
            </a>
            <figcaption>
              {preview.title}
              <span>Advertising concept preview</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className={styles.sampleNote}>
        The images above are the small previews embedded in the public report.
        Original delivery dimensions are not verified here. Check product
        accuracy and placement requirements before using generated creative.
      </p>
      <a
        className={styles.sourceLink}
        href={`${reportExampleUrl}?co-from=learn#actions`}
        target="_blank"
        rel="noopener"
        data-track
        data-cta-placement="growth-example-actions"
      >
        See the prioritised action plan{' '}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
