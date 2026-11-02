export const videoDirectory = [
  {
    id: 'image-to-video',
    name: 'Image to Video',
    material: 'photo',
    label: 'I have product photos',
    tag: 'A simple place to start',
    bestFor: 'A product reveal, moving packshot or scene-led social clip.',
    result: 'A generated product clip guided by your photos and motion brief.',
    title: 'Give your product photos some motion.',
    description:
      'Create a product showcase or scene from your images and a motion direction. Use a template or describe the result you want.',
    inputs:
      'Clear product photos. Add a short motion description, or choose a template.',
    steps: [
      'Add product images',
      'Choose a template or motion direction',
      'Review settings and generate',
    ],
    guide: '/ecommerce-ai-tools/ai-video-generator/',
    guideLabel: 'Prepare your first product video',
    boundary:
      'Reference images, first/end frames and audio inputs depend on the selected model.',
  },
  {
    id: 'url-to-video',
    name: 'URL to Video',
    material: 'link',
    label: 'I have a product link',
    tag: 'From listing to story',
    bestFor: 'Sellers who want to start from an existing product listing.',
    result:
      'A product video built from reviewed listing details, images and script.',
    title: 'Turn a product page into a video brief.',
    description:
      'Import product details and images, choose a marketing angle, then review an AI script or write your own before generating.',
    inputs:
      'An accessible product page URL. Review imported facts and choose suitable images.',
    steps: [
      'Import and check product details',
      'Choose an angle and edit the script',
      'Choose a presenter if needed and generate',
    ],
    guide: '/ecommerce-ai-tools/url-to-video-guide/',
    guideLabel: 'Follow the product-link workflow',
    boundary:
      'Link extraction depends on the source page. Confirm product facts and promotion terms before generating.',
  },
  {
    id: 'product-talking-video',
    name: 'Avatar Video',
    material: 'presenter',
    label: 'I want a presenter',
    tag: 'Explain the product',
    bestFor: 'A presenter-led product introduction or feature explanation.',
    result:
      'An AI-presenter product video based on your chosen script concept.',
    title: 'Put a presenter in your product story.',
    description:
      'Combine product images, an available avatar and your selling points. Review AI script concepts and edit the wording for your audience.',
    inputs:
      'Product images, an available avatar and accurate product facts or selling points.',
    steps: [
      'Add your product and choose an avatar',
      'Create or edit a script concept',
      'Set language, market and output options',
    ],
    guide:
      '/ecommerce-ai-tools/ecommerce-trends/tiktok-shop-ai-ugc-video-seller-workflow/',
    guideLabel: 'Plan a product-led UGC video',
    boundary:
      'An AI presenter is not a customer testimonial. Review the script for unsupported claims.',
  },
  {
    id: 'video-replication',
    name: 'Video Clone',
    material: 'reference',
    label: 'I have a reference video',
    tag: 'Adapt an idea',
    bestFor:
      'Exploring a reference-led creative concept with your own product.',
    result: 'A new product video guided by a selected reference segment.',
    title: 'Bring a reference. Make a new concept.',
    description:
      'Use a TikTok link or upload a reference clip, select the relevant segment, then add your product images and review the generation prompt.',
    inputs:
      'A reference video you have permission to use, plus images of your own product.',
    steps: [
      'Resolve or upload a reference clip',
      'Confirm a segment and add product images',
      'Review the prompt and generate a new version',
    ],
    guide:
      '/ecommerce-ai-tools/ecommerce-trends/tiktok-shop-ai-ugc-video-seller-workflow/',
    guideLabel: 'Prepare reference-led ad creative',
    boundary:
      'Reference guidance does not guarantee an identical shot, product appearance or performance.',
  },
  {
    id: 'bulk-video',
    name: 'Bulk Video',
    material: 'batch',
    label: 'I have multiple products',
    tag: 'For repeatable production',
    bestFor: 'Teams making repeatable videos for several products.',
    result: 'A batch of product video jobs to review, retry and download.',
    title: 'Organize a catalog of video projects.',
    description:
      'Prepare several products, review their analysed profiles, choose templates and submit a batch. Monitor results and retry failed items.',
    inputs:
      'Product names, images and reviewed product information for each item.',
    steps: [
      'Organize products and review their facts',
      'Choose templates and check the quote',
      'Generate, review and download results',
    ],
    guide: '/ecommerce-ai-tools/ai-video-generator/',
    guideLabel: 'Check quality with one product first',
    boundary:
      'Test one representative product before a large batch. Available settings and costs come from the workspace.',
  },
] as const;

export type VideoWorkflowId = (typeof videoDirectory)[number]['id'];

export const videoWorkspaceUrl = (id: VideoWorkflowId | 'api') =>
  `https://www.nexscope.ai/seller/video-generation/${id}?co-from=learn`;

export const videoDirectoryFaqs = [
  {
    q: 'How much does a product video cost?',
    a: 'Generation uses Nexscope credits. The amount depends on the workflow, model and output settings. Open the relevant workspace and review its current credit estimate before generating; use the official Plans & Billing page for current credit and subscription options.',
  },
  {
    q: 'Can I publish a generated product video without checking it?',
    a: 'Review it first. Check the exact product and variant, packaging text, spoken claims and motion against your real product. These workflows generate creative assets; they do not verify product claims or guarantee advertising approval or sales.',
  },
  {
    q: 'Which workflow should I try first?',
    a: 'If you have a clear product photo, start with Image to Video. Choose URL to Video for an accessible product page, Avatar Video for a presenter-led story, Video Clone for a reference-led concept, or Bulk Video after checking a representative single-product result.',
  },
  {
    q: 'Does this page generate videos?',
    a: 'This is a workflow selection guide. Each Start button opens the matching Nexscope workspace, where you sign in, provide your materials, review available settings and check the credit estimate before generating.',
  },
  {
    q: 'Are all models and settings available in every workflow?',
    a: 'No. Image limits, duration, resolution, aspect ratio and supported reference inputs vary by model and workflow. Use the available controls and estimate in the selected workspace rather than assuming an option applies everywhere.',
  },
  {
    q: 'Can I use the examples as evidence of my own result?',
    a: 'Examples are grouped by their matching workflow and come from Nexscope public Inspiration or production workflow demos. They illustrate possible outputs, not a guarantee for your product. Review your own generated video for product accuracy, claims and suitability before publishing.',
  },
];
