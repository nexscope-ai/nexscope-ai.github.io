'use client';
import { useState } from 'react';
import HomeVideoExamples from './home-video-examples';
import { videoDirectory } from '@/lib/video-directory';
import snapshot from '@/lib/video-directory-examples.json';
import styles from '@/app/video/video.module.css';

export default function VideoDirectoryExamples() {
  const [active, setActive] = useState('image-to-video');
  return (
    <>
      <fieldset className={styles.filters} aria-label="Choose example workflow">
        {videoDirectory.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={active === item.id}
            onClick={() => setActive(item.id)}
          >
            {item.name}
          </button>
        ))}
      </fieldset>
      {videoDirectory.map((item) => (
        <div
          key={item.id}
          hidden={active !== item.id}
          className={styles.exampleGroup}
        >
          <h3>{item.name} examples</h3>
          <HomeVideoExamples
            examples={snapshot.workflows[item.id]}
            workflow={item.id}
            workflowName={item.name}
            exampleLabel={
              item.id === 'product-talking-video'
                ? 'Official workspace demo'
                : item.id === 'bulk-video'
                  ? 'Official product example'
                  : 'Official Inspiration'
            }
            entryPage="video_directory"
            showWorkflowCta
          />
        </div>
      ))}
    </>
  );
}
