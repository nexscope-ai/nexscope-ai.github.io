'use client';
import { useState } from 'react';
import HomeVideoExamples from './home-video-examples';
import { videoDirectory } from '@/lib/video-directory';
import snapshot from '@/lib/video-directory-examples.json';
import styles from '@/app/video/video.module.css';
import apis from '@/lib/video-api-directory.json';
import { relatedVideoApi } from '@/lib/video-api-choices.mjs';
import { trackDirectoryAction } from '@/lib/directory-analytics.mjs';

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
            onClick={() => {
              setActive(item.id);
              trackDirectoryAction('video_example_workflow_filter', {
                workflow: item.id,
              });
            }}
          >
            {item.name}
          </button>
        ))}
      </fieldset>
      {videoDirectory.map((item) => {
        const related = relatedVideoApi(item.id, apis.entries);
        return (
          <div
            key={item.id}
            hidden={active !== item.id}
            className={styles.exampleGroup}
          >
            <h3>{item.name} examples</h3>
            {related && (
              <p className={styles.exampleApiLink}>
                <a
                  href={
                    related.slug
                      ? `https://www.nexscope.ai/api-docs/${related.slug}?view=playground&co-from=learn`
                      : '#apis'
                  }
                  data-track={related.slug ? '' : undefined}
                  data-track-tool={related.slug}
                  data-cta-placement="video-example-related-api"
                >
                  {related.label} →
                </a>
                <span>
                  Related integration options; these examples do not identify
                  the model or API used to produce each clip.
                </span>
              </p>
            )}
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
        );
      })}
    </>
  );
}
