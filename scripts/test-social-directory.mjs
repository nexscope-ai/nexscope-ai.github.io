import test from 'node:test';
import assert from 'node:assert/strict';
import {
  splitDataCollections,
  projectSocialDirectory,
} from '../lib/social-directory.mjs';
test('official category separates social APIs without moving TikTok Shop commerce APIs', () => {
  const social = {
    slug: 'social-instagram-profile',
    categorySlug: 'social-data',
    name: 'Instagram profile',
    description: 'Read a profile',
    privateField: 'never publish',
  };
  const commerce = {
    slug: 'tiktok-shop-search',
    categorySlug: 'tiktok-social-commerce',
  };
  const snapshot = { entries: [social, commerce], scope: 'data' };
  const split = splitDataCollections(snapshot);
  assert.deepEqual(split.social, [social]);
  assert.deepEqual(split.ecommerce.entries, [commerce]);
  assert.equal(snapshot.entries.length, 2);
  assert.throws(
    () => splitDataCollections({ entries: [social, social, commerce] }),
    /Duplicate/,
  );
  assert.throws(
    () => splitDataCollections({ entries: [commerce] }),
    /unavailable/,
  );
  const projected = projectSocialDirectory(split.social, {
    available: true,
    statistics: { [social.slug]: { minimum: 1, maximum: 10 } },
  })[0];
  assert.equal(projected.platformName, 'Instagram');
  assert.equal(projected.creditRange, '10');
  assert.equal('privateField' in projected, false);
  assert.equal(
    projectSocialDirectory(split.social, { available: false })[0].creditRange,
    '-',
  );
});
