/** @type {Array<[string,string,string[]]>} */
const platformChoices = [
  [
    'instagram',
    'Instagram',
    [
      'social-instagram-profile',
      'social-instagram-post-detail',
      'social-instagram-post-comments',
    ],
  ],
  [
    'tiktok',
    'TikTok',
    [
      'social-tiktok-profile',
      'social-tiktok-profile-videos',
      'social-tiktok-video-comments',
    ],
  ],
  [
    'youtube',
    'YouTube',
    [
      'social-youtube-search',
      'social-youtube-transcript',
      'social-youtube-video-comments',
    ],
  ],
  [
    'facebook',
    'Facebook',
    [
      'social-facebook-post-comments',
      'social-facebook-post-transcript',
      'social-facebook-ad-library-search-ads',
    ],
  ],
  [
    'reddit',
    'Reddit',
    [
      'social-reddit-search',
      'social-reddit-post-detail',
      'social-reddit-post-comments',
    ],
  ],
  [
    'linkedin',
    'LinkedIn',
    [
      'social-linkedin-profile',
      'social-linkedin-search-posts',
      'social-linkedin-ads-search',
    ],
  ],
  [
    'twitter',
    'X / Twitter',
    [
      'social-twitter-profile',
      'social-twitter-search-posts',
      'social-twitter-tweet-transcript',
    ],
  ],
];
const workflows = [
  {
    title: 'Research a creator before outreach',
    question: 'How can I inspect an Instagram creator and a specific post?',
    slugs: ['social-instagram-profile', 'social-instagram-post-detail'],
    steps: [
      'Open the profile endpoint and check which profile identifier it accepts.',
      'Inspect a selected post with the post-detail endpoint. Compare the available fields rather than assuming every platform returns the same metrics.',
    ],
    review:
      'Review the returned record before using it in an outreach shortlist.',
  },
  {
    title: 'Find questions in product discussions',
    question: 'Which Reddit APIs help me explore a topic and read comments?',
    slugs: ['social-reddit-search', 'social-reddit-post-comments'],
    steps: [
      'Use the search endpoint to find relevant discussions.',
      'Choose a returned post and inspect its comments using the documented input format.',
    ],
    review:
      'Keep the original discussion links and review the context before drawing conclusions.',
  },
  {
    title: 'Review what a video says and how viewers respond',
    question: 'Can I combine a YouTube transcript with video comments?',
    slugs: ['social-youtube-transcript', 'social-youtube-video-comments'],
    steps: [
      'Check whether the transcript endpoint supports the selected video.',
      'Inspect the comments endpoint separately; a transcript and a comment thread answer different questions.',
    ],
    review:
      'Confirm language, pagination and available fields in each endpoint. A missing transcript is not an empty audience response.',
  },
];

export const socialFaqs = [
  {
    q: 'What are Nexscope Social Data APIs?',
    a: 'Nexscope Social Data APIs are platform-specific endpoints for researching social and content data. Depending on the endpoint, you can inspect profiles, posts, comments, search results or transcripts. This directory groups the published operations by platform and links to their official API playgrounds.',
  },
  {
    q: 'How do I choose a social media API for my task?',
    a: 'Choose the platform first, then the object or task: profile, post, comment, search or transcript. Use the platform table and task examples on this page to find an operation. Open its playground to check required identifiers, authentication and response fields before running a request.',
  },
  {
    q: 'Are social APIs and ecommerce Data APIs the same collection?',
    a: 'They have separate directories on Nexscope Learn. Social APIs focus on social and content research, while the ecommerce Data directory covers marketplace and product research. TikTok social content operations and TikTok Shop commerce operations can serve different tasks; choose the endpoint by its documented input and output.',
  },
  {
    q: 'Do all social platforms return the same fields or fresh data?',
    a: 'No. Coverage, returned fields and availability vary by platform and endpoint. This directory does not promise a universal refresh interval. Check the specific documentation and inspect the response before relying on a field, transcript or metric.',
  },
  {
    q: 'Where can I test a Nexscope social API?',
    a: 'Use an Open API playground link on this page. It opens the corresponding official Nexscope API page in playground view. Review authentication, required parameters and current credit costs there before executing a request.',
  },
  {
    q: 'Are the workflow examples on this page tested API results?',
    a: 'The examples are endpoint-selection walkthroughs based on the published Nexscope API catalog. They are not live call results or guarantees that a particular profile, post, comment or transcript will be returned. Validate your own input in the official playground.',
  },
];

export function socialGuide(entries) {
  const bySlug = new Map(entries.map((e) => [e.slug, e]));
  const link = (slug) =>
    bySlug.has(slug)
      ? [
          {
            slug,
            name: bySlug.get(slug).name,
            url: `https://www.nexscope.ai/api-docs/${slug}?view=playground&co-from=learn`,
          },
        ]
      : [];
  const platforms = platformChoices.flatMap(([id, name, slugs]) => {
    const count = entries.filter((e) => e.platform === id).length;
    return count ? [{ id, name, count, links: slugs.flatMap(link) }] : [];
  });
  return {
    platforms,
    workflows: workflows
      .map((w) => ({ ...w, links: w.slugs.flatMap(link) }))
      .filter((w) => w.links.length === w.slugs.length),
  };
}
