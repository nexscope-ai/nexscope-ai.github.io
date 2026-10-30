import { writeFile } from 'node:fs/promises';

export const galleryApi = 'https://api.nexscope.ai/api/product-showcase';
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function projectHomeProduct(list, detail) {
  if (
    list?.code !== 0 ||
    list.data?.enabled === false ||
    !Array.isArray(list.data?.products)
  )
    return null;
  const first = list.data.products[0];
  const item = detail?.code === 0 ? detail.data : null;
  if (
    !first ||
    !uuidPattern.test(first.publicUuid) ||
    !item ||
    item.publicUuid !== first.publicUuid ||
    !(Number(first.publishedAt) > 0) ||
    !(Number(item.publishedAt) > 0) ||
    typeof item.productName !== 'string' ||
    !item.productName.trim()
  )
    return null;
  const image = Array.isArray(item.imageUrls)
    ? item.imageUrls.find((value) => {
        try {
          const u = new URL(value);
          return u.protocol === 'https:' && !u.username && !u.password;
        } catch {
          return false;
        }
      })
    : null;
  if (!image) return null;
  let config = item.seoConfig;
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch {
      config = {};
    }
  }
  const title = item.productName.trim().slice(0, 240);
  const description = config?.description || config?.metaDescription;
  return {
    title,
    image,
    href: `/ecommerce-ai-tools/product-showcase/product/${item.publicUuid.toLowerCase()}/`,
    description:
      typeof description === 'string' && description.trim()
        ? description.trim().slice(0, 180)
        : `Explore ${title} in the Nexscope Product Gallery.`,
  };
}

export async function refreshHomeProduct(fetcher = fetch) {
  let product = null;
  try {
    const get = async (url) => {
      const response = await fetcher(url, {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('Public Gallery unavailable');
      return response.json();
    };
    const list = await get(`${galleryApi}/products?pageNum=1&pageSize=1`);
    const first = list?.data?.products?.[0];
    if (
      list.code === 0 &&
      list.data?.enabled !== false &&
      uuidPattern.test(first?.publicUuid ?? '')
    ) {
      product = projectHomeProduct(
        list,
        await get(`${galleryApi}/products/${first.publicUuid}`),
      );
    }
  } catch {
    /* Hide unavailable examples rather than retaining an old product. */
  }
  await writeFile(
    new URL('../lib/home-product-snapshot.json', import.meta.url),
    JSON.stringify({ product }, null, 2) + '\n',
  );
  console.log(
    product
      ? 'Prepared the highest-ranked public Gallery example.'
      : 'No current public Gallery example; example card hidden.',
  );
  return product;
}
