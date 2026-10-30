import {
  ImagePlay,
  Link2,
  Video,
  Clapperboard,
  Layers3,
  Code2,
} from 'lucide-react';

export const videoWorkflows = [
  {
    name: 'Image to Video',
    path: 'image-to-video',
    icon: ImagePlay,
    description:
      'Animate product photos with a motion prompt and your preferred format.',
    input: 'Product photos → video',
  },
  {
    name: 'URL to Video',
    path: 'url-to-video',
    icon: Link2,
    description:
      'Start with a product link, review imported details and plan a video script.',
    input: 'Product link → video workflow',
  },
  {
    name: 'Avatar Video',
    path: 'product-talking-video',
    icon: Video,
    description:
      'Build an avatar-led product story from images, a prompt and language settings.',
    input: 'Product + presenter → story',
  },
  {
    name: 'Video Clone',
    path: 'video-replication',
    icon: Clapperboard,
    description:
      'Use a reference clip and your product images to explore a similar video concept.',
    input: 'Reference clip → new concept',
  },
  {
    name: 'Bulk Video',
    path: 'bulk-video',
    icon: Layers3,
    description:
      'Organize batches, schedule video creation and review results in one workspace.',
    input: 'Multiple products → batches',
  },
  {
    name: 'Model Library',
    path: 'api',
    icon: Code2,
    description:
      'Explore image and video models, their supported inputs and online testers.',
    input: 'Model + inputs → generation',
  },
] as const;

export const workflowUrl = (path: string) =>
  `https://www.nexscope.ai/seller/video-generation/${path}?co-from=learn`;
