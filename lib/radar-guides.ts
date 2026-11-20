type RadarGuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  checklist?: string[];
  table?: { headers: string[]; rows: string[][] };
  figure?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
};

export type RadarGuide = {
  slug: string;
  topic: string;
  title: string;
  description: string;
  keywords: string[];
  updated: string;
  summary: string;
  takeaways: string[];
  sections: RadarGuideSection[];
  sources: { href: string; label: string }[];
  nextStep: { href: string; label: string };
};

export const radarGuides: RadarGuide[] = [
  {
    slug: 'tiktok-shop-trending-products',
    topic: 'TikTok Shop',
    title: 'How to Find Trending Products on TikTok Shop',
    description:
      'Use TikTok Shop best sellers, comparable sales periods, shoppable videos and customer reviews to shortlist products worth a small test.',
    keywords: [
      'TikTok Shop trending products',
      'TikTok Shop best sellers',
      'TikTok Shop product research',
    ],
    updated: '2026-11-20',
    summary:
      'Start with a category ranking in one country. Compare two completed weeks, then check how a product sells and what buyers say before planning a test.',
    takeaways: [
      'Shortlist products in the country you plan to sell in and record the same dates for every listing.',
      'Compare how much a product sold with how quickly its sales changed.',
      'Check the sales channels, creator activity and reviews before writing a test brief.',
    ],
    sections: [
      {
        id: 'build-a-shortlist',
        title: 'Start with a market and category',
        paragraphs: [
          'Choose the country you can ship to, then narrow your scan to a category you can demonstrate on video. A strong US kitchen listing is a reasonable lead for a US seller. Research the United Kingdom separately if that is where the product will launch.',
          'Browse TikTok Shop best sellers in Seller Center or start with a dated ranking. Collect five to ten comparable products, including a newer listing. Record the product and shop names, the price you observed, reported units sold and the dates covered. Keep bundle sizes and variant differences in the same note so you can compare like with like.',
          'Use the number of distinct shops as a quick check. If most of the relevant listings belong to one shop, look for a reason its distribution is hard to match. A launch based on a specific creator or a known brand audience has different requirements from one where several sellers are already making sales.',
        ],
      },
      {
        id: 'compare-weeks',
        title: 'Compare two completed weeks',
        paragraphs: [
          'Use the same listing and ranking source for both weeks. The example below uses reported US Kitchenware units from FastMoss, pulled November 16, 2026. The spoon-and-lid rest still sold more units in the second week, while the chopping board had faster growth.',
          'That gives you different follow-up questions. For the spoon rest, check whether a deal ended, a variant sold out or one creator stopped posting. For the chopping board, look for another seller with traction and check whether buyers valued the board itself or a particular bundle and price.',
          'In the Radar sales panel, daily average makes a 7-day and a 30-day summary easier to compare. For a week-over-week comparison, use two non-overlapping weeks with the same length. Keep any discount, stock or creator campaign notes alongside the figures.',
        ],
        table: {
          headers: ['Product', 'Nov 2–8', 'Nov 9–15', 'Change'],
          rows: [
            [
              'Stainless steel chopping board',
              '2,822 units',
              '3,570 units',
              '+26.5%',
            ],
            [
              'Stainless steel spoon and lid rest',
              '6,333 units',
              '4,445 units',
              '−29.8%',
            ],
          ],
        },
      },
      {
        id: 'check-sales-channels',
        title: 'Find out where the sales came from',
        paragraphs: [
          'Open a candidate’s sales details and look at the reported video, livestream and marketplace sales amounts and shares. A video-heavy product invites a content test. Start by looking for demonstrations you can reproduce with your own product and footage, such as showing how a board stays steady on a wet counter.',
          'Check the associated videos and creators when those counts are available. Inspect several videos and record the buyer question each one answers. A good brief specifies the demonstration, the audience and the claim you can verify. Views, reported units and creator counts describe different parts of that decision.',
          'If you plan to work with creators, capture the currently displayed commission and confirm applicable terms in your own Seller Center. Add the cost of samples, content and fulfillment to your test budget before deciding how much you can afford to spend.',
        ],
      },
      {
        id: 'run-a-small-test',
        title: 'Turn reviews into one testable change',
        paragraphs: [
          'Read a batch of recent reviews for each shortlisted listing. Tag recurring complaints by issue, such as confusing dimensions, a loose handle or awkward cleaning. Log the variant when it is available and check whether similar comments appear across independent listings.',
          'Pick one change you can deliver and show. A listing can demonstrate exact dimensions and cleaning in a short clip. A product change may need a supplier sample to prove it. Give your test a fixed budget and duration, then record what would make you continue, adjust or stop.',
        ],
        checklist: [
          'One market, category and product variant',
          'Two completed periods and a note on promotions',
          'One buyer problem and one demonstration to test',
        ],
      },
    ],
    sources: [
      {
        label: 'FastMoss US weekly product ranking study, November 2026',
        href: 'https://www.fastmoss.com/blog/tiktok-shop-product-hunting-2026/',
      },
      {
        label: 'TikTok Shop Seller University on Product Ranking',
        href: 'https://seller-us.tiktok.com/university/essay?knowledge_id=8671803954595597',
      },
      {
        label: 'Nexscope TikTok Product Analytics Detail',
        href: 'https://www.nexscope.ai/api-docs/tiktok-product-analytics-api?co-from=learn',
      },
    ],
    nextStep: {
      label: 'Compare TikTok Shop sales momentum',
      href: '/tools/tiktok-shop-bestseller-momentum/',
    },
  },
  {
    slug: 'amazon-product-research',
    topic: 'Amazon',
    title: 'How to Do Amazon Product Research for a New SKU',
    description:
      'Validate an Amazon niche with long-tail keywords, comparable listings, sales ranks, price history and recent customer reviews.',
    keywords: [
      'Amazon product research',
      'Amazon niche research',
      'Amazon long-tail keywords',
      'what to sell on Amazon',
    ],
    updated: '2026-11-20',
    summary:
      'Use a search trend to pick a product idea, then check whether matching Amazon listings sell at a price you can support and where you can improve the offer.',
    takeaways: [
      'Capture the marketplace and the exact search phrases buyers use.',
      'Compare similar variants in the same category and separate seasonal spikes from typical demand.',
      'Find a recurring review complaint you can resolve and verify on a sample.',
    ],
    sections: [
      {
        id: 'start-with-search-intent',
        title: 'Turn a search trend into a product brief',
        paragraphs: [
          'Google’s Holiday 100, published November 9, 2026, identified “ski mug” as a breakout search. Treat that as a lead for Amazon product research. Decide whether your buyer wants a winter gift, a ceramic drinking mug or a travel cup with a lid before you build a shortlist.',
          'Pick one marketplace and search for a specific phrase, such as “ceramic ski mug gift.” Use a related-phrase lookup to see which sizes, materials and use cases shoppers actually include. Inspect the results for each phrase you keep. You can have relevant search demand even when the largest query in the list is too broad for your product.',
          'Keep Google search interest, Amazon keyword estimates and reported Amazon units in distinct columns. The sources describe different behavior. When checking keyword change, compare the same phrase and marketplace across comparable periods. Record the date and expect holidays to affect the comparison.',
        ],
      },
      {
        id: 'pick-comparable-listings',
        title: 'Compare listings that serve the same shopper',
        figure: {
          src: '/product-research-radar/amazon-market-research.webp',
          width: 1536,
          height: 1024,
          alt: 'The Radar shows Amazon and Pet Supplies filters, the United States highlighted on the globe, and a list of ranked products.',
          caption:
            'Product Research Radar example for Amazon US Pet Supplies. Rankings shown are dated November 20, 2026.',
        },
        paragraphs: [
          'Create a shortlist of about six comparable ASINs. Start from matching keyword results and browse Amazon Best Sellers for category context. Note each product’s size, material, price, rating count and whether the listing is a set. A single mug and a two-piece gift set have different prices, shipping costs and buyer expectations.',
          'Best Sellers Rank helps place a listing within its category. Compare the same category and note when listings belong to different subcategories. Check monthly units where reported, the historical price range and the dates of any ranking moves. A sudden rank improvement during a price cut is a reason to check what happened at a typical price.',
          'Look for a newer comparable listing with some sales traction. Record how it differs from the established products and whether the change is something your own team can supply. If evidence for newer listings is sparse, extend the observation period before committing inventory.',
        ],
        table: {
          headers: ['Record', 'How to use it'],
          rows: [
            [
              'Search phrase and exact monthly estimate',
              'Check how closely demand matches the product you can supply.',
            ],
            [
              'Comparable ASIN, category and variants',
              'Compare price and rank within the relevant group.',
            ],
            [
              'Price history and reported units',
              'Separate typical sales conditions from discounted periods.',
            ],
            [
              'Repeated review issue',
              'Write one product or listing improvement to test.',
            ],
          ],
        },
      },
      {
        id: 'read-reviews-for-design',
        title: 'Use reviews to choose what to improve',
        paragraphs: [
          'Start with recent low-star reviews and read a set of higher ratings for context. Verify which variant the review describes and whether the same issue appears on more than one ASIN. For a ceramic gift mug, take note when reviews consistently mention shipping damage, unclear capacity or packaging that cannot be used as a gift.',
          'Turn the issue into a checkable requirement. A packaging requirement could specify how the handle is protected and how a sample should arrive after shipping. A listing requirement could specify an image that shows usable capacity next to a familiar object. Check whether an issue appears across buyers or stems from an individual preference.',
        ],
      },
      {
        id: 'make-a-test-decision',
        title: 'Decide whether the niche earns a test',
        paragraphs: [
          'Estimate contribution per unit using a realistic selling price and written supplier, shipping and fulfillment costs. Include a budget for acquisition and returns. Run the same calculation at the typical price and at a holiday discount so you can see how much price movement the offer can absorb.',
          'Use a short decision note. Specify the retailer and search term, the comparable listings, the change you intend to make, and the largest sample or inventory commitment you can justify. For an explicitly seasonal search, decide when you would run the test and when that window closes.',
        ],
        checklist: [
          'The keyword matches the product and marketplace',
          'The cost model works at a realistic sale price',
          'The proposed improvement can be checked before a larger order',
        ],
      },
    ],
    sources: [
      {
        label: 'Google Holiday 100 search trends, November 2026',
        href: 'https://blog.google/products-and-platforms/products/shopping/holiday-100-gift-guide-2026/',
      },
      {
        label:
          'Amazon’s guide to Best Sellers and other product-research signals',
        href: 'https://sell.amazon.com/blog/product-ideas',
      },
      {
        label: 'Amazon Product Opportunity Explorer',
        href: 'https://sell.amazon.com/blog/product-opportunity-explorer',
      },
      {
        label: 'Nexscope Amazon Keyword Expansion',
        href: 'https://www.nexscope.ai/api-docs/amazon-keyword-expansion?co-from=learn',
      },
    ],
    nextStep: {
      label: 'Explore Amazon research tools',
      href: '/amazon-research/',
    },
  },
  {
    slug: '1688-image-search-supplier-guide',
    topic: '1688 sourcing',
    title: 'How to Find 1688 Suppliers by Image',
    description:
      'Use 1688 image search to shortlist suppliers. Check the exact variant, minimum order quantity, quantity pricing, shipping and samples before buying.',
    keywords: [
      '1688 image search',
      '1688 suppliers',
      'how to source from 1688',
      '1688 minimum order quantity',
    ],
    updated: '2026-11-20',
    summary:
      'Start with a clear product photo. Open the closest 1688 offers and compare the price and order terms for the same variant before ordering samples.',
    takeaways: [
      'Prepare the photo and exact specifications before searching.',
      'Verify the variant, order minimum, price tiers and carton details for each offer.',
      'Compare the delivered cost and use a sample checklist before placing an order.',
    ],
    sections: [
      {
        id: 'prepare-the-image',
        title: 'Search with a photo and a sourcing brief',
        paragraphs: [
          '1688 image search helps you find listings that look like the product in a reference photo. Use a clear photo of the item by itself. If you have both a front view and a photo showing the detail that matters, start with the more specific one and keep the second available for a follow-up.',
          'Write down the features the photo cannot establish. A stainless steel chopping board, one of the kitchen products tracked by FastMoss in November 2026, could match many results with different dimensions, edge finish or material. Capture the size, thickness, edge treatment, surface finish and packaging your target customer needs.',
          'From a product detail in the Radar, open 1688 sourcing and choose a product photo. Shortlist visually similar items and open their order details. Some listings supply additional SKU, inventory, price-tier or shipping data. Ask suppliers to confirm the fields that matter to your brief.',
        ],
      },
      {
        id: 'check-the-offer',
        title: 'Compare prices for the same variant and quantity',
        paragraphs: [
          'Record the 1688 offer link and selected SKU. Check whether the first quoted price belongs to the size and material you need, and whether the minimum applies per SKU, per colour or to the full order. If the listing gives a price tier, match it with the quantity you can realistically buy.',
          'Request a written quotation for the same specification and delivery destination from each serious candidate. Ask how many sellable items come in a carton, how the item is packed and when production can start. Confirm the quote currency. Include packaging and labelling requirements when asking for the price so that the quotes cover the same work.',
          'Use available stock as a prompt to ask about the selected variant. Stock shown in an offer can change during the research process. Confirm availability again when you move from sampling to ordering.',
        ],
        table: {
          headers: ['Compare', 'What to verify'],
          rows: [
            [
              'Exact specification',
              'SKU, material, dimensions, finish and reference photos.',
            ],
            [
              'Minimum order and tier price',
              'The quantity needed to get the selected variant at the quoted rate.',
            ],
            [
              'Packing and timeline',
              'Carton count, packed dimensions and weight, dispatch location and lead time.',
            ],
            [
              'Sampling terms',
              'Sample cost, shipping to your destination and production differences.',
            ],
          ],
        },
      },
      {
        id: 'estimate-landed-cost',
        title: 'Calculate delivered cost in one currency',
        paragraphs: [
          'Compare offers after adding the costs required to receive sellable stock. Convert quotes into the same currency using the same rate and date. Include packing, inspection, transport and applicable importing costs. Divide the landed total by the number of expected sellable units.',
          'For illustration, a quote of $2.10 per unit plus $0.30 for packaging, $0.85 for freight and $0.20 for inspection is $3.45 per unit before any other costs. If a quote bundles packing or freight into the base price, remove the matching line from the comparison so you count it once.',
          'Check the cost of the smallest viable order as well as the larger quoted tier. A cheaper unit price at a larger minimum ties up more cash and may make a product harder to test. Confirm the dates and quantities before comparing the final shortlist.',
        ],
      },
      {
        id: 'check-a-sample',
        title: 'Use a sample to approve or reject the offer',
        paragraphs: [
          'Order a sample of the exact variant you intend to sell. Measure it, photograph it in normal use and check it against the issue you found in marketplace reviews. For a board, check the surface and edge finish as well as the material information supplied with the sample. Record who confirmed the details and when.',
          'Turn that record into a repeatable approval checklist. If you continue, confirm that packaging and production specifications will match the approved sample. Keep the offer link and written quote in the same record so you can compare any changes when you place an order.',
        ],
        checklist: [
          'Sample matches the selected SKU and written specifications',
          'Landed cost uses the actual quantity and current quote',
          'Lead time and packaging fit the planned test',
        ],
      },
    ],
    sources: [
      {
        label: 'Nexscope 1688 Search By Image',
        href: 'https://www.nexscope.ai/api-docs/1688-search-by-image?co-from=learn',
      },
      {
        label: 'Nexscope 1688 Product Detail',
        href: 'https://www.nexscope.ai/api-docs/1688-product-detail?co-from=learn',
      },
      {
        label: 'FastMoss November 2026 kitchenware research',
        href: 'https://www.fastmoss.com/blog/tiktok-shop-product-hunting-2026/',
      },
    ],
    nextStep: {
      label: 'Try the Amazon to 1688 Supplier Finder',
      href: '/tools/amazon-to-1688-supplier-finder/',
    },
  },
];
