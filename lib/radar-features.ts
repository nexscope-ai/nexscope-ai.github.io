export type RadarFigure = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

function screenshot(
  name: string,
  width: number,
  height: number,
  alt: string,
  caption: string,
): RadarFigure {
  return {
    src: `/product-research-radar/${name}.webp`,
    width,
    height,
    alt,
    caption,
  };
}

export const radarScreens = {
  rankings: screenshot(
    'nexscope-radar-amazon-rankings',
    1488,
    1008,
    'Nexscope Product Research Radar with Amazon US Pet Supplies selected, a market globe, and a ranked product list.',
    'Nexscope Radar showing Amazon US Pet Supplies on November 20, 2026.',
  ),
  tiktokRankings: screenshot(
    'tiktok-market-rankings',
    1376,
    726,
    'TikTok Shop Top products tab with the United Kingdom selected and a weekly best sellers list.',
    'Sample data. TikTok Shop rankings show units sold during the week printed above the list.',
  ),
  keywordSearch: screenshot(
    'product-keyword-search',
    1376,
    720,
    'The Find products tab pairs an Amazon keyword form with price and estimated monthly units for matching products.',
    'Sample data. A keyword search shows products, prices and estimated monthly units for the chosen marketplace.',
  ),
  keywordPhrases: screenshot(
    'amazon-related-search-phrases',
    832,
    480,
    'Amazon related search phrases showing monthly searches, monthly change and the expanded details for one phrase.',
    'Sample data. Expand a phrase to see available details, such as three-month change and the most common category.',
  ),
  amazonSales: screenshot(
    'amazon-sales-history',
    870,
    433,
    'Amazon sales history showing a 30-day chart of reported monthly units, with tabs for category rank, pricing and seller count.',
    'Sample data. Switch between monthly sales, category rank, pricing and seller count in the same date range.',
  ),
  amazonReviews: screenshot(
    'amazon-customer-reviews',
    870,
    515,
    'Amazon customer reviews filtered to two stars, with dates, product variations and review text.',
    'Sample data. Load one Amazon star rating at a time to read recent reviews for that rating.',
  ),
  tiktokSales: screenshot(
    'tiktok-sales-channels',
    870,
    467,
    'TikTok Shop sales summary with units, reported revenue and a breakdown for shoppable videos, live streams and the marketplace.',
    'Sample data. The TikTok Shop sales panel compares reported sales channels for the selected period.',
  ),
  tiktokReviews: screenshot(
    'tiktok-customer-reviews',
    870,
    459,
    'TikTok Shop review list with star colors, dates, variants and text from the first batch.',
    'Sample data. TikTok Shop loads reviews in batches. You can request more at the end of the list.',
  ),
  tiktokVideos: screenshot(
    'tiktok-product-videos',
    870,
    408,
    'TikTok Shop product video results with creator handles, views, units sold and a link to Video Clone.',
    'Sample data. Product videos can be opened on TikTok or passed to Video Clone as a reference.',
  ),
  imageSearch: screenshot(
    '1688-image-search',
    870,
    395,
    '1688 sourcing panel with a selected reference photo and similar offers showing prices and order minimums.',
    'Sample data. The image search returns 1688 listings with visually similar products.',
  ),
  orderTerms: screenshot(
    '1688-order-terms',
    830,
    430,
    'An expanded 1688 order detail panel with supplier, stock, dispatch location, quantity prices and variants.',
    'Sample data. Review the reported terms for a specific 1688 offer and confirm them with the supplier.',
  ),
};

export const radarFeatures = [
  {
    id: 'market-rankings',
    title: 'Which products sell in my market?',
    answer:
      'Use Top products to find candidates in a specific country and category. Choose Amazon or TikTok Shop, then pick a market on the globe or from the country list.',
    detail:
      'Check the dates and the units label before comparing listings. Amazon shows estimated monthly units, and TikTok Shop rankings show weekly units.',
    figures: [radarScreens.rankings, radarScreens.tiktokRankings],
  },
  {
    id: 'keyword-product-search',
    title: 'What products match my idea?',
    answer:
      'Open Find products and search for a product name, material or use case in the market where you want to sell.',
    detail:
      'Use the matching listings and their prices and reported units to build a shortlist. Compare variants, sizes and bundles before drawing a conclusion from the price.',
    figures: [radarScreens.keywordSearch],
  },
  {
    id: 'amazon-search-phrases',
    title: 'What phrases do shoppers search for on Amazon?',
    answer:
      'Enable Also find related search phrases before searching on Amazon. Open Related search phrases to see estimated monthly searches and recent changes for the phrases returned.',
    detail:
      'Choose phrases that match your material, size or use case. One phrase can have high demand and still describe a different product. The estimates apply to the selected Amazon marketplace.',
    figures: [radarScreens.keywordPhrases],
  },
  {
    id: 'amazon-sales-history',
    title: 'How has an Amazon listing performed over time?',
    answer:
      'Open a product and use Sales to check reported monthly units, category rank and price history where available. Start with a 30-day view and widen the period to investigate a spike.',
    detail:
      'Compare rank within the same category. Review sales and prices together to see whether a discount coincided with a change in demand.',
    figures: [radarScreens.amazonSales],
  },
  {
    id: 'tiktok-sales-channels',
    title: 'What drives sales on TikTok Shop?',
    answer:
      'Open Sales for a TikTok Shop product and choose a 7- or 30-day period. Check reported units and revenue, then see how much revenue came from shoppable videos, live streams and the TikTok Shop marketplace.',
    detail:
      'Choose which channel to investigate first. Compare like periods, or use the daily average to put summaries of different lengths in context.',
    figures: [radarScreens.tiktokSales],
  },
  {
    id: 'customer-reviews',
    title: 'What do buyers like or complain about?',
    answer:
      'Use Customer reviews to look for issues you can fix, such as confusing instructions or weak packaging. Amazon loads recent reviews for the star rating you select. TikTok Shop loads one page at a time.',
    detail:
      'Check the variant and look for the same issue across several reviews and listings before changing your product or its listing.',
    figures: [radarScreens.amazonReviews, radarScreens.tiktokReviews],
  },
  {
    id: 'tiktok-product-videos',
    title: 'Which TikTok videos are worth studying?',
    answer:
      'Open Product videos to see linked videos alongside their reported views and units sold. Compare several demonstrations to find a format you could test with your own product.',
    detail:
      'Open the original to understand how it presents the product. You can also send the link to Video Clone as a reference.',
    figures: [radarScreens.tiktokVideos],
  },
  {
    id: '1688-sourcing',
    title: 'Which 1688 offers should I ask about?',
    answer:
      'Choose a listing photo in 1688 sourcing and run Search by photo. Open Order details on a match to check what the supplier reports for the variant, order minimum, prices by quantity and dispatch details.',
    detail:
      'An image match is a lead. Confirm specifications, stock, shipping costs and sample terms directly before placing an order.',
    figures: [radarScreens.imageSearch, radarScreens.orderTerms],
  },
];

export const radarQuestions = [
  {
    question: 'Can I use Product Research Radar without signing in?',
    answer:
      'You can browse available public rankings. Sign in to run live product searches and lookups. Live requests use Data credits.',
  },
  {
    question: 'Can I compare Amazon units with TikTok Shop units?',
    answer:
      'Check the date range and definition on each result first. Amazon ranking cards show estimated monthly units. TikTok Shop ranking cards report weekly units. Use comparable periods when assessing demand.',
  },
  {
    question: 'Can the Radar tell me if a product will be profitable?',
    answer:
      'It helps you shortlist products and suppliers. Calculate your own margin from a current quote, fulfillment costs, returns and customer acquisition costs before ordering inventory.',
  },
];
