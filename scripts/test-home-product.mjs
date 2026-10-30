import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectHomeProduct } from './refresh-home-product.mjs';

const first = {
  publicUuid: '336e970a-19aa-4a7d-9361-7b056f55d4f1',
  publishedAt: '1791624870000',
};
const second = {
  publicUuid: 'd693a492-b61c-4ee2-8390-d5c4a7140748',
  publishedAt: '1793326284000',
};
const list = (products) => ({ code: 0, data: { enabled: true, products } });
const detail = (item) => ({
  code: 0,
  data: {
    ...item,
    productName: 'Current ranked product',
    imageUrls: ['javascript:alert(1)', 'https://cdn.example.com/public.jpg'],
    seoConfig: { description: 'Public product description' },
    privateEmail: 'not-for-publication@example.com',
  },
});
test('the API ranking selects the example; later-ranked details cannot replace the winner', () => {
  assert.equal(projectHomeProduct(list([first, second]), detail(second)), null);
  const product = projectHomeProduct(list([first, second]), detail(first));
  assert.ok(product.href.includes(first.publicUuid));
  assert.equal(product.description, 'Public product description');
  assert.equal(product.image, 'https://cdn.example.com/public.jpg');
  assert.equal('privateEmail' in product, false);
  assert.ok(
    projectHomeProduct(list([second, first]), detail(second)).href.includes(
      second.publicUuid,
    ),
  );
});
test('empty, disabled and unpublished products have no public example', () => {
  assert.equal(projectHomeProduct(list([]), detail(first)), null);
  assert.equal(
    projectHomeProduct(
      { code: 0, data: { enabled: false, products: [first] } },
      detail(first),
    ),
    null,
  );
  assert.equal(
    projectHomeProduct(list([first]), detail({ ...first, publishedAt: null })),
    null,
  );
});
