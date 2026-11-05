import test from 'node:test';
import assert from 'node:assert/strict';
import { socialGuide } from '../lib/social-guide.mjs';

test('selection evidence reflects current published operations and removes unavailable workflow links', () => {
  const entry = (slug, platform) => ({ slug, platform, name: slug });
  const entries = [
    entry('social-reddit-search', 'reddit'),
    entry('social-reddit-post-comments', 'reddit'),
  ];
  const guide = socialGuide(entries);
  assert.equal(guide.platforms.length, 1);
  assert.equal(guide.platforms[0].count, 2);
  assert.equal(guide.workflows.length, 1);
  assert.ok(
    guide.workflows[0].links.every((l) =>
      l.url.endsWith('?view=playground&co-from=learn'),
    ),
  );
  assert.equal(socialGuide(entries.slice(0, 1)).workflows.length, 0);
  assert.equal(
    guide.platforms
      .flatMap((p) => p.links)
      .some((l) => l.slug === 'social-reddit-post-detail'),
    false,
  );
});
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
