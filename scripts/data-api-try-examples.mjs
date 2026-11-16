const examples = [
  {
    category: 'data-js',
    path: '/data/amazon-keyword-sales-research/',
    slug: 'amazon-keyword-expansion',
    title: 'Find related Amazon keywords',
    request: { marketplace: 'us', searchTerms: 'yoga mat', needCount: 20 },
    result: 'Look for keywordInfoList and compare the exact and broad monthly search volumes of related terms.',
  },
  {
    category: 'data-mp-ozon',
    path: '/data/ozon-product-seller-research/',
    slug: 'ozon-product-search',
    title: 'Find competing products on Ozon',
    request: { keyword: 'кроссовки' },
    result: 'Look for products with a title, product ID, brand and seller name. The Russian keyword means “sneakers.”',
  },
];

export function addTryExamples(html, path, entries) {
  const available = examples.filter((example) =>
    (path === '/data/' || example.path === path)
    && entries.some((entry) => entry.slug === example.slug),
  );
  if (!available.length) return html;

  const cards = available.map((example) => {
    const request = JSON.stringify(example.request, null, 2);
    const tester = `https://www.nexscope.ai/api-docs/${example.slug}?co-from=learn#online-test`;
    return `<article class="api-task-card" data-api-example="${example.slug}">
      <h3>${example.title}</h3>
      <pre class="api-try-example-request"><code>${request}</code></pre>
      <p>${example.result}</p>
      <div class="api-try-example-actions">
        <button type="button" data-copy-api-example hidden>Copy JSON</button>
        <a href="${tester}" data-track="start_using" data-data-category="${example.category}" data-api-slug="${example.slug}" data-cta-placement="data-first-request">Open online test ↗</a>
      </div>
      <span class="api-caption" role="status" data-api-example-status></span>
    </article>`;
  }).join('');
  const body = `<p>Paste the example JSON into Online test with your Nexscope API key. Check the credit estimate before running it.</p>
    <div class="api-task-grid">${cards}</div>`;
  const section = path === '/data/'
    ? `<details class="api-task-section api-try-examples api-more-tasks" data-learn-detail="data-first-request"><summary>Try your first request</summary>${body}</details>`
    : `<section class="api-task-section api-try-examples" aria-labelledby="api-try-title" data-learn-section="data-first-request"><h2 id="api-try-title">Try your first request</h2>${body}</section>`;
  const directory = /<div\b[^>]*\sdata-data-directory(?=\s|>)[^>]*>/;
  if (!directory.test(html)) throw new Error(`Could not locate the API directory on ${path}`);
  const withStyles = html.replace('</head>', '<link rel="stylesheet" href="/data-api-try-examples.css"></head>');
  if (path === '/data/') return withStyles.replace('</main>', section + '</main>');
  return withStyles.replace(directory, (markup) => section + markup);
}
