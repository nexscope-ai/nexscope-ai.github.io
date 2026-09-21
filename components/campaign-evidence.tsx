const amazonCase = 'https://learn.nexscope.ai/ecommerce-ai-tools/amazon-review-case-study/';
const imageSearchCase = 'https://learn.nexscope.ai/ecommerce-ai-tools/ecommerce-trends/1688-image-search-sourcing/';

const videoExamples = {
  handSoap: {
    title: 'Hand Soap Showcase',
    source: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/image/c8d8d1ab-e0c4-4c58-a441-18d128891719.png',
    cover: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/image/e4185d2d-3cf6-4791-ab98-f4b489d9cccf.jpg',
    video: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/video/8c05b5a9-a884-4e52-b82d-1b34585fa662.mp4',
    model: 'Seedance 2.0 Fast',
    settings: '10 s · 9:16 · reference-image mode',
  },
  petToy: {
    title: 'Pet Toy Showcase',
    source: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/image/aaf6e71a-780d-4f8a-8a5d-26bbd9cfce6a.png',
    cover: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/image/0b069329-cb2a-4365-8db1-02e679587626.jpg',
    video: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/video/35472d56-230c-4000-845d-6d494693747b.mp4',
    model: 'Seedance 2.0 Fast',
    settings: '10 s · 9:16 · reference-image mode',
  },
  hairClip: {
    title: 'Hair Clip UGC',
    source: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/image/cec6f7dc-f32b-40cf-b5d7-277778de17fa.png',
    cover: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/image/114d1ea2-d4b3-4d77-941d-3b8501dffde6.jpg',
    video: 'https://nexscope-test.s3.us-east-1.amazonaws.com/test/marketing-video-example/video/6a0d8b94-b017-4182-90cf-54c93138499c.mp4',
    model: 'Seedance 2.0 Fast',
    settings: '10 s · 9:16 · product-talking-video workflow',
  },
} as const;

function VideoExample({ example }: { example: (typeof videoExamples)[keyof typeof videoExamples] }) {
  return (
    <figure className="evidence-video-example">
      <div className="evidence-image-pair">
        <div>
          <span>Input reference</span>
          <img src={example.source} alt={`${example.title} input reference image`} width="480" height="480" loading="lazy" decoding="async" />
        </div>
        <div>
          <span>Frame from output</span>
          <img src={example.cover} alt={`${example.title} frame extracted from the generated video`} width="480" height="480" loading="lazy" decoding="async" />
        </div>
      </div>
      <figcaption>
        <strong>{example.title}</strong>
        <span>{example.model} · {example.settings}</span>
        <a href={example.video} target="_blank" rel="noopener noreferrer">Watch the recorded output ↗</a>
      </figcaption>
    </figure>
  );
}

export function CampaignEvidence({ slug }: { slug: string }) {
  if (slug === 'amazon-research') {
    return (
      <section id="evidence" className="evidence-section" aria-labelledby="amazon-evidence-title">
        <div className="evidence-heading">
          <span className="eyebrow">Observed result / Amazon US</span>
          <h2 id="amazon-evidence-title">What did one review research run actually return?</h2>
          <p><strong>Ten of 20 requested low-star reviews were returned</strong> for ASIN B0G1FVPYNW on September 15, 2026. Four of those ten comments mentioned size or capacity. That is a listing-research hypothesis, not a measured conversion lift or a claim about all buyers.</p>
        </div>
        <figure className="evidence-figure">
          <img src="/evidence/amazon-review-run.svg" width="1200" height="570" loading="lazy" decoding="async" alt="Amazon US test chart: 20 low-star reviews requested, 10 returned; nine were one-star, one was two-star, and four of the returned comments mentioned size or capacity." />
          <figcaption>Source: <a href={amazonCase}>Nexscope Amazon review case study</a>. Input: ASIN B0G1FVPYNW, US market, ten one-star and ten two-star reviews requested. The sample was intentionally low-rated; it cannot establish the listing&apos;s overall rating, sales, conversion rate or return rate.</figcaption>
        </figure>
      </section>
    );
  }

  if (slug === 'ecommerce-ai-agents') {
    return (
      <section id="evidence" className="evidence-section" aria-labelledby="agent-evidence-title">
        <div className="evidence-heading">
          <span className="eyebrow">Observed API result / 1688</span>
          <h2 id="agent-evidence-title">Why should an agent inspect the business response code?</h2>
          <p><strong>The JSON business code carried the decisive outcome in a documented 1688 image-search test.</strong> Three image-URL attempts returned code 13007 without a credit deduction. A raw Base64 JPEG request returned code 0, ten first-page products and a ten-credit charge. An agent should preserve that distinction before it recommends any candidate.</p>
        </div>
        <figure className="evidence-figure">
          <img src="/evidence/1688-image-search-run.svg" width="1200" height="570" loading="lazy" decoding="async" alt="1688 image-search test chart: three public-image-URL attempts failed with business code 13007 and no credit deduction; one Base64 JPEG request succeeded with code 0, ten products and ten credits charged." />
          <figcaption>Source: <a href={imageSearchCase}>Nexscope 1688 image-search test</a>, September 20, 2026. Input was a generated, unbranded bottle concept—not an actual SKU. The result demonstrates response handling, not supplier verification, product equivalence or a guaranteed success rate for Base64.</figcaption>
        </figure>
      </section>
    );
  }

  if (slug === 'ai-product-videos') {
    return (
      <section id="evidence" className="evidence-section" aria-labelledby="product-video-evidence-title">
        <div className="evidence-heading">
          <span className="eyebrow">Recorded video examples</span>
          <h2 id="product-video-evidence-title">What do the inputs and output frames look like?</h2>
          <p><strong>Two recorded Nexscope examples show different workflows:</strong> a reference-led pet-toy showcase and a product-talking hair-clip concept. Each comparison pairs the stored input reference with a frame extracted from its generated video, plus the recorded model and settings.</p>
        </div>
        <div className="evidence-video-grid">
          <VideoExample example={videoExamples.petToy} />
          <VideoExample example={videoExamples.hairClip} />
        </div>
        <p className="evidence-limit">Source: Nexscope&apos;s internal example set prepared September 8, 2026; the linked source images, covers and MP4 files were checked for availability September 21. These are existing examples, not a new run or a controlled model comparison. Credits, completion time and product-accuracy scores were not recorded.</p>
      </section>
    );
  }

  return (
    <section id="evidence" className="evidence-section" aria-labelledby="generator-evidence-title">
      <div className="evidence-heading">
        <span className="eyebrow">Recorded image-to-video example</span>
        <h2 id="generator-evidence-title">What did one product image become?</h2>
        <p><strong>This recorded hand-soap example has a 10-second, 9:16 output</strong> made with Seedance 2.0 Fast in reference-image mode. The figure shows its stored input reference beside a frame extracted from the generated clip; the MP4 is available to inspect in full.</p>
      </div>
      <div className="evidence-video-grid evidence-video-grid-single">
        <VideoExample example={videoExamples.handSoap} />
      </div>
      <p className="evidence-limit">Source: Nexscope&apos;s internal example set prepared September 8, 2026; linked assets were checked for availability September 21. This is an existing showcase, not a generation performed in this session. It does not measure label accuracy, conversion, rendering time or credits used. Review your own output before publishing.</p>
    </section>
  );
}
