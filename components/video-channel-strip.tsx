/* oxlint-disable next/no-img-element */
import styles from '@/app/video/video.module.css';

const channels = [
  { name: 'Seedance', logo: 'seedream-seedance.webp' },
  { name: 'Kling', logo: 'kling.webp' },
  { name: 'Wan', logo: 'wan.webp' },
  { name: 'Hailuo', logo: 'hailuo.webp' },
  { name: 'MiniMax', logo: 'minimax.webp' },
  { name: 'Happy Horse', logo: 'happy-horse.webp' },
];

const imageChannels = [
  { name: 'Nano Banana', logo: 'nano-banana.webp' },
  { name: 'GPT Image', logo: 'gpt-image.webp' },
  { name: 'Seedream', logo: 'seedream-seedance.webp' },
];

export default function VideoChannelStrip({
  compact = false,
}: { compact?: boolean }) {
  const items = compact ? [...imageChannels, ...channels] : channels;
  const className = compact
    ? `${styles.channelStrip} ${styles.channelStripCompact}`
    : styles.channelStrip;
  return (
    <section
      className={className}
      aria-label={
        compact ? 'Image and video generation models' : 'Video generation models'
      }
    >
      {!compact && (
        <div className={styles.channelHeading}>
          <div>
            <p className={styles.eyebrow}>Explore video generation models.</p>
            <p className={styles.channelCaption}>
              Compare video models, then open the matching API playground.
            </p>
          </div>
        </div>
      )}
      <div className={styles.channelViewport}>
        <div className={styles.channelTrack}>
          {[0, 1].map((copy) => (
            <ul
              className={styles.channelGroup}
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {items.map((channel) => (
                <li key={channel.name} className={styles.channelItem}>
                  <img
                    src={`/assets/video-models/${channel.logo}`}
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
