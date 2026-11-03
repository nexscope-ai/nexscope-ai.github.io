// Related integration options, not a claim about models used in Inspiration clips.
export const videoApiChoices = [
  {
    id: 'image-to-video',
    title: 'Animate a product photo',
    input: 'Product reference images and a motion prompt.',
    output:
      'A generated clip; duration and reference support depend on the model.',
    category: 'video-generation-models',
    label: 'Compare video generation models',
    guide: '/ecommerce-ai-tools/ai-video-generator/',
  },
  {
    id: 'video-replication',
    title: 'Build a reference-led video',
    input:
      'Reference assets and your own product materials, with permission to use them.',
    output: 'A new product marketing video guided by the supplied reference.',
    slug: 'ai-video-reclone',
    label: 'Inspect the Video Reclone API',
    guide:
      '/ecommerce-ai-tools/ecommerce-trends/tiktok-shop-ai-ugc-video-seller-workflow/',
  },
  {
    id: 'product-talking-video',
    title: 'Create a talking sales video',
    input:
      'The product materials and sales content required by the selected API.',
    output:
      'A generated sales video to review for product accuracy and spoken claims.',
    slug: 'sales-talking-video',
    label: 'Inspect the Sales Talking Video API',
    guide:
      '/ecommerce-ai-tools/ecommerce-trends/tiktok-shop-ai-ugc-video-seller-workflow/',
  },
];

export function relatedVideoApi(workflow, entries) {
  const choice = videoApiChoices.find((item) => item.id === workflow);
  if (!choice) return null;
  if (choice.slug && !entries.some((item) => item.slug === choice.slug))
    return null;
  if (
    choice.category &&
    !entries.some((item) => item.category === choice.category)
  )
    return null;
  return choice;
}
