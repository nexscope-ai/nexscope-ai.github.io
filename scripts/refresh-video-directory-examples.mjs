import { readFile, writeFile } from 'node:fs/promises';
import { projectHomeExamples } from './refresh-home-examples.mjs';

const flows = {
  'image-to-video': 'IMAGE_TO_VIDEO',
  'url-to-video': 'URL_TO_VIDEO',
  'video-replication': 'VIDEO_REPLICATION',
};
// Public assets used by the production workflow and Bulk Video landing page.
const productionExamples = {
  'product-talking-video': [
    {
      title: 'Creator-led sandal review',
      poster: 'https://www.nexscope.ai/video-lab/ugc-sandal-review-poster.webp',
      video: 'https://www.nexscope.ai/video-lab/ugc-sandal-review.mp4',
      sourceImage: null,
      duration: null,
      ratio: null,
    },
  ],
  'bulk-video': [
    {
      title: 'Air fryer',
      poster:
        'https://www.nexscope.ai/video-lab/bulk-hero/air-fryer-poster.jpg',
      video: 'https://www.nexscope.ai/video-lab/bulk-hero/air-fryer.mp4',
      sourceImage:
        'https://www.nexscope.ai/video-lab/bulk-hero/air-fryer-product.jpeg',
      duration: 10,
      ratio: '16:9',
    },
    {
      title: 'Area rug',
      poster: 'https://www.nexscope.ai/video-lab/bulk-hero/rug-poster.jpg',
      video: 'https://www.nexscope.ai/video-lab/bulk-hero/rug.mp4',
      sourceImage:
        'https://www.nexscope.ai/video-lab/bulk-hero/rug-product.png',
      duration: 10,
      ratio: '16:9',
    },
    {
      title: 'Dog toy',
      poster: 'https://www.nexscope.ai/video-lab/bulk-hero/pet-toy-poster.jpg',
      video: 'https://www.nexscope.ai/video-lab/bulk-hero/pet-toy.mp4',
      sourceImage:
        'https://www.nexscope.ai/video-lab/bulk-hero/pet-toy-product.png',
      duration: 10,
      ratio: '16:9',
    },
  ],
};
export async function refreshVideoDirectoryExamples() {
  const file = new URL('../lib/video-directory-examples.json', import.meta.url);
  let previous = { workflows: {} };
  try {
    previous = JSON.parse(await readFile(file, 'utf8'));
  } catch {
    /* Initial export uses public feeds. */
  }
  const workflows = { ...productionExamples };
  await Promise.all(
    Object.entries(flows).map(async ([id, type]) => {
      try {
        const response = await fetch(
          `https://api.nexscope.ai/claw/marketing-video/examples?workflowType=${type}&limit=100`,
          { signal: AbortSignal.timeout(15000) },
        );
        if (!response.ok) throw new Error('Examples unavailable');
        const rows = projectHomeExamples(await response.json(), type);
        if (!rows.length) throw new Error('No public production examples');
        workflows[id] = rows;
      } catch (error) {
        if (!previous.workflows[id]?.length) throw error;
        workflows[id] = previous.workflows[id];
        console.warn(`Retaining reviewed ${id} examples.`);
      }
    }),
  );
  const updatedAt =
    JSON.stringify(previous.workflows) === JSON.stringify(workflows)
      ? previous.updatedAt
      : new Date().toISOString();
  await writeFile(
    file,
    JSON.stringify({ updatedAt, workflows }, null, 2) + '\n',
  );
  console.log(
    `Prepared examples for ${Object.keys(workflows).length} video workflows.`,
  );
}
