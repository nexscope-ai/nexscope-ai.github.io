'use client';

import { ArrowUpRight } from 'lucide-react';
import styles from './product-video-demo.module.css';

const workspaceUrl =
  'https://www.nexscope.ai/seller/video-generation/video-replication?co-from=learn';

export default function CreateProductVideoLink({ placement }: { placement: string }) {
  return (
    <a
      className={styles.primary}
      href={workspaceUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-track=""
      data-track-tool="video-replication"
      data-cta-placement={placement}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.open(event.currentTarget.href, '_blank', 'noopener,noreferrer');
      }}
    >
      Create my product video <ArrowUpRight size={18} aria-hidden />
    </a>
  );
}
