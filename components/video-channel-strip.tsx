'use client';
/* oxlint-disable next/no-img-element */
import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import styles from '@/app/video/video.module.css';

const channels = [
  { name: 'TikTok', logo: 'tiktok.webp' },
  { name: 'Amazon', logo: 'amazon.webp' },
  { name: 'Instagram', logo: 'instagram.svg' },
  { name: 'Shopify', logo: 'shopify.webp' },
  { name: 'YouTube', logo: 'youtube.svg' },
  { name: 'Etsy', logo: 'etsy.webp' },
  { name: 'Walmart', logo: 'walmart.webp' },
];

export default function VideoChannelStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      className={styles.channelStrip}
      aria-label="Ecommerce and social content channels"
    >
      <div className={styles.channelHeading}>
        <div>
          <p className={styles.eyebrow}>
            Your store. Your social feed. Your next campaign.
          </p>
          <p className={styles.channelCaption}>
            Plan product stories for storefronts and social feeds.
          </p>
        </div>
        <button
          type="button"
          className={styles.channelPause}
          aria-label={
            paused
              ? 'Resume channel logo animation'
              : 'Pause channel logo animation'
          }
          onClick={() => setPaused(!paused)}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      <div
        className={styles.channelViewport}
        data-paused={paused}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch') setPaused(true);
        }}
      >
        <div className={styles.channelTrack}>
          {[0, 1].map((copy) => (
            <ul
              className={styles.channelGroup}
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {channels.map((channel) => (
                <li key={channel.name} className={styles.channelItem}>
                  <img
                    src={`/assets/video-channels/${channel.logo}`}
                    alt=""
                    width="30"
                    height="30"
                    loading="lazy"
                  />
                  <span>{channel.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
