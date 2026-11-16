import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import CreateProductVideoLink from './create-product-video-link';
import gradientTitle from '@/app/gradient-title.module.css';
import styles from './product-video-demo.module.css';

const route = '/product-video-demo/';
const title = 'Create a TikTok-Style Product Demo Video | Nexscope';
const description =
  'Watch a 12-second portable blender demo and learn how to turn your product photos and a reference clip into a short ecommerce video with Nexscope Video Clone.';
const media = '/product-video-demo-media';
const poster = `${media}/portable-blender.webp`;
const video = `${media}/portable-blender.mp4`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: route },
  openGraph: { title, description, url: route, images: [poster] },
  twitter: { card: 'summary_large_image', title, description, images: [poster] },
};

const shots = [
  ['00–04', 'Show what goes in', 'Start close on the fruit and the clear blender cup. Viewers can see exactly what the product is for.'],
  ['04–08', 'Show it working', 'A close-up of the button connects the action with the movement inside the cup.'],
  ['08–12', 'Show what comes out', 'End on the pour and hold briefly on the finished smoothie next to the product.'],
];

export default function ProductVideoDemoPage() {
  return (
    <div className={styles.page}>
      <MarketingHeader active="video" campaign="product-video-demo" />
      <main id="main" className={styles.wrap}>
        <section className={styles.hero} aria-labelledby="demo-title">
          <div className={styles.copy}>
            <h1 id="demo-title">Create a <em className={gradientTitle.text}>TikTok-style product demo</em> for your store.</h1>
            <p>Watch a portable blender go from fruit to smoothie in 12 seconds. Then make your own version with your product photos and a reference video you have permission to use.</p>
            <div className={styles.actions}>
              <CreateProductVideoLink placement="product-demo-hero" />
              <a className={styles.textLink} href="#shot-plan">See the shot plan <ArrowRight size={16} aria-hidden /></a>
            </div>
          </div>
          <figure className={styles.demo}>
            <video
              controls
              playsInline
              muted
              preload="none"
              width={720}
              height={1280}
              poster={poster}
              aria-label="12-second AI-generated portable blender product demo"
              data-learn-demo="portable-blender"
            >
              <source src={video} type="video/mp4" />
              <track kind="descriptions" label="English" srcLang="en" src={`${media}/portable-blender.vtt`} />
            </video>
            <figcaption>Portable blender · Original AI-generated Nexscope demo · 12 sec</figcaption>
          </figure>
        </section>
        <section className={styles.shots} id="shot-plan" aria-labelledby="shot-title">
          <h2 id="shot-title">Tell the product story in three shots</h2>
          <ol>
            {shots.map(([timing, name, detail], index) => (
              <li key={timing}>
                {/* oxlint-disable-next-line next/no-img-element -- WebP stills are pre-optimized for static hosting. */}
                <img src={`${media}/shot-${index + 1}.webp`} alt="" width={480} height={480} loading="lazy" decoding="async" />
                <div><span>{timing}s</span><h3>{name}</h3><p>{detail}</p></div>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.next} aria-labelledby="make-title">
          <div>
            <h2 id="make-title">Try the same format with your product</h2>
            <p>Bring clear product photos and a short clip you have permission to use. In Video Clone, add your reference, upload your product photos, and describe what should happen in each shot.</p>
          </div>
          <CreateProductVideoLink placement="product-demo-shot-plan" />
        </section>
        <p className={styles.source}>
          Creative reference: Crew Supply Co.’s hands-on ASMR demo for its Old Fashioned Infusion Kit reached nearly 1.5 million views, according to TikTok. <a href="https://ads.tiktok.com/business/en-US/inspiration/crew-supply-co.-585">Read the TikTok case study <ArrowUpRight size={14} aria-hidden /></a>
        </p>
      </main>
      <LearnFooter />
    </div>
  );
}
