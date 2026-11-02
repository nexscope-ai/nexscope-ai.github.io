await import('./build-public-pricing.mjs');
await import('./build-public-credit-statistics.mjs');
const { refreshHomeExamples } = await import('./refresh-home-examples.mjs');
await refreshHomeExamples();
const { refreshVideoDirectoryExamples } =
  await import('./refresh-video-directory-examples.mjs');
await refreshVideoDirectoryExamples();
const { refreshVideoApis } = await import('./refresh-video-api-directory.mjs');
await refreshVideoApis();
const { refreshHomeProduct } = await import('./refresh-home-product.mjs');
await refreshHomeProduct();
