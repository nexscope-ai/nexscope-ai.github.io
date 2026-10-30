import { readFile, writeFile } from 'node:fs/promises';

export const exampleFeed =
  'https://api.nexscope.ai/claw/marketing-video/examples?workflowType=IMAGE_TO_VIDEO&limit=12';
const preferredTitles = [
  'Poolside Sunglasses',
  'A Happy Mealtime',
  'A Little Care, Every Day',
];

function publicMedia(value, extensions) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'store.nexscope.ai' &&
      url.pathname.startsWith('/prod/marketing-video-example/') &&
      !url.search &&
      !url.hash &&
      !url.username &&
      !url.password &&
      extensions.test(url.pathname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function projectHomeExamples(payload) {
  if (payload?.code !== 0) throw new Error('Public examples unavailable');
  const data = payload.data;
  const rows = Array.isArray(data) ? data : (data?.records ?? data?.list);
  if (!Array.isArray(rows)) throw new Error('Invalid public examples envelope');
  const valid = rows.flatMap((item) => {
    if (
      item.workflowType !== 'IMAGE_TO_VIDEO' ||
      typeof item.title !== 'string' ||
      !item.title.trim()
    )
      return [];
    const poster = publicMedia(item.coverImageUrl, /\.(?:jpe?g|png|webp)$/i);
    const video = publicMedia(item.previewVideoUrl, /\.mp4$/i);
    if (!poster || !video) return [];
    return [
      {
        title: item.title.trim().slice(0, 120),
        poster,
        video,
        sourceImage: publicMedia(item.sourceImageUrl, /\.(?:jpe?g|png|webp)$/i),
        duration:
          Number.isFinite(item.durationSeconds) && item.durationSeconds > 0
            ? item.durationSeconds
            : null,
        ratio: /^\d{1,2}:\d{1,2}$/.test(item.aspectRatio ?? '')
          ? item.aspectRatio
          : null,
      },
    ];
  });
  const rank = (title) => {
    const index = preferredTitles.indexOf(title);
    return index === -1 ? preferredTitles.length : index;
  };
  return valid
    .filter(
      (item, index) =>
        valid.findIndex((other) => other.video === item.video) === index,
    )
    .sort((a, b) => rank(a.title) - rank(b.title))
    .slice(0, 3);
}

export async function refreshHomeExamples() {
  const file = new URL('../lib/home-video-examples.json', import.meta.url);
  const previous = JSON.parse(await readFile(file, 'utf8'));
  try {
    const response = await fetch(exampleFeed, {
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Public examples HTTP error');
    const examples = projectHomeExamples(await response.json());
    if (!examples.length) throw new Error('No approved public examples');
    const data = {
      updatedAt:
        JSON.stringify(previous.examples) === JSON.stringify(examples)
          ? previous.updatedAt
          : new Date().toISOString(),
      examples,
    };
    await writeFile(file, JSON.stringify(data, null, 2) + '\n');
    console.log(
      `Prepared ${examples.length} public Inspiration examples; videos load on request only.`,
    );
  } catch {
    if (!Array.isArray(previous.examples) || !previous.examples.length)
      throw new Error('No public Inspiration examples available');
    console.warn(
      'Public Inspiration refresh unavailable; retaining reviewed examples.',
    );
  }
}
