export const directionArtwork = [
  '/assets/growth-report/pciqute-square-preview.jpg',
  '/assets/growth-report/pciqute-wide-preview.jpg',
  '/assets/growth-report/pciqute-vertical-preview.jpg',
] as const;

export const futureDirections = {
  radar: {
    feature: 'product_opportunity_radar',
    slug: 'product-opportunity-radar',
    title: 'Ecommerce Product Opportunity Radar',
    headline: 'See where your next product opportunity is.',
    description: 'Explore a proposed ecommerce market map that brings together bestseller signals, price ranges and category trends to help sellers shortlist products.',
    intro: 'Start with a market and a category. See which products merit a closer look before you spend time or money sourcing them.',
    preview: 'Market opportunity map',
    previewDescription: 'Illustrative research points in the United States, Germany and Japan.',
    labels: ['United States · Kitchen storage', 'Germany · Home organization', 'Japan · Compact appliances'],
    scenario: 'You are comparing kitchen storage products for a new market. Review the bestselling formats and price range, then look at recent demand before deciding which products to research.',
    steps: [
      ['Pick a market', 'Choose the country and category where you plan to sell.'],
      ['Read the signals', 'Review bestseller activity, the range of observed prices and recent category movement in the same market.'],
      ['Build a shortlist', 'Save the offers that match your price range and flag what to verify before sourcing.'],
    ],
  },
  growth: {
    feature: 'product_growth_workspace',
    slug: 'product-growth-workspace',
    title: 'Product Growth Workspace',
    headline: 'Know what to fix first on your product page.',
    description: 'Explore a proposed product growth workspace that prioritizes listing issues, turns findings into actions and helps sellers review their changes.',
    intro: 'Bring a product page and turn scattered findings into a short list of changes you can make and check.',
    preview: 'Prioritized listing actions',
    previewDescription: 'Illustrative tasks for a compact kitchen scale listing.',
    labels: ['Show the scale’s dimensions', 'Clarify the battery requirements', 'Show the display during use'],
    scenario: 'A kitchen scale listing leaves key questions unanswered. Start by showing dimensions, clarify battery requirements, then check whether the updated page answers both questions.',
    steps: [
      ['Review the listing', 'Collect product facts, shopper questions and evidence from comparable offers.'],
      ['Prioritize the fixes', 'Turn each issue into a specific edit and order the list by importance and effort.'],
      ['Review the changes', 'Keep the original version and check how the new listing addresses each issue.'],
    ],
  },
  creative: {
    feature: 'product_creative_workspace',
    slug: 'product-creative-workspace',
    title: 'AI Product Creative Workspace',
    headline: 'Turn one product brief into a set of creative assets.',
    description: 'Explore a proposed AI creative workspace for ecommerce product images, listing visuals and short product videos from a shared brief.',
    intro: 'Start with one product and message. Plan the main image, the detail images and a short video together so each format stays on brief.',
    preview: 'Creative formats for one product',
    previewDescription: 'Illustrative layouts using a product from an existing Nexscope example.',
    labels: ['Square product image', 'Wide detail visual', 'Vertical video concept'],
    scenario: 'A seller needs to show how a paint roller extends. Plan a square product image, a wide measurement graphic and a vertical video that demonstrates the extension.',
    steps: [
      ['Define the message', 'Write down the feature to show, the audience and what the viewer needs to understand.'],
      ['Plan the formats', 'Assign a purpose to the main image, the detail visuals and the short video.'],
      ['Review one set together', 'Check that the product, dimensions and claims match across every format.'],
    ],
  },
} as const;

export type FutureDirection = keyof typeof futureDirections;
