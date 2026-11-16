import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import CreateProductVideoLink from './create-product-video-link';
import gradientTitle from '@/app/gradient-title.module.css';
import styles from './product-video-demo.module.css';

const route = '/product-video-demo/';
const title = 'AI Product Ad Before and After | Nexscope Video Clone';
const description =
  'Compare a reference product ad with a new AI-generated version. See how Video Clone carries the shot sequence across to a different product and setting.';
const poster =
  'https://store.nexscope.ai/prod/tools/323-9a66aea57b88-slippers-poster-v5.webp';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: route },
  openGraph: { title, description, url: route, images: [poster] },
  twitter: { card: 'summary_large_image', title, description, images: [poster] },
};

const clips = [
  {
    id: 'sandals-reference',
    label: 'Reference ad',
    product: 'Brown strappy sandals',
    poster: 'https://store.nexscope.ai/prod/tools/323-17b8cd11aad8-slippers-reference-poster-v2.webp',
    video: 'https://store.nexscope.ai/prod/tools/323-f013d76cdd58-slippers-reference-v1.mp4',
  },
  {
    id: 'sandals-remake',
    label: 'Remade with AI',
    product: 'Colorful woven slides',
    poster,
    video: 'https://store.nexscope.ai/prod/tools/323-f733ac94a16b-slippers-v1.mp4',
  },
];

export default function ProductVideoDemoPage() {
  return (
    <div className={styles.page}>
      <MarketingHeader active="video" campaign="product-video-demo" />
      <main id="main" className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="demo-title">
          <div className={styles.copy}>
            <h1 id="demo-title">Turn a reference ad into <em className={gradientTitle.text}>your product video.</em></h1>
            <p>See the same sunlit product-ad setup reworked for a different pair of shoes.</p>
            <CreateProductVideoLink placement="product-demo-hero" />
          </div>
          <div className={styles.comparison} aria-label="Reference video and AI remake comparison">
            {clips.map((clip) => (
              <figure className={styles.clip} key={clip.id}>
                <figcaption>
                  <strong>{clip.label}</strong>
                  <span>{clip.product}</span>
                </figcaption>
                <video
                  controls
                  playsInline
                  muted
                  preload="none"
                  width={720}
                  height={1280}
                  poster={clip.poster}
                  aria-label={`${clip.label}: ${clip.product}`}
                  data-learn-demo={clip.id}
                >
                  <source src={clip.video} type="video/mp4" />
                </video>
              </figure>
            ))}
          </div>
        </section>
        <section className={styles.notes} aria-labelledby="comparison-title">
          <h2 id="comparison-title">A different product in a familiar setup</h2>
          <div className={styles.sequence} aria-label="Shot sequence">
            <span>Set the scene</span><ArrowRight size={16} aria-hidden />
            <span>Show the shoe details</span><ArrowRight size={16} aria-hidden />
            <span>Show the pair on foot</span>
          </div>
          <p>The remake trades brown strappy sandals for colorful woven slides while keeping the sunny stone steps and close-up product shots.</p>
        </section>
        <section className={styles.next} aria-labelledby="make-title">
          <div>
            <h2 id="make-title">Make one for your store</h2>
            <p>In Video Clone, add a reference clip you have permission to use, upload your product photos, and tell the model what to change.</p>
          </div>
          <CreateProductVideoLink placement="product-demo-shot-plan" />
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
