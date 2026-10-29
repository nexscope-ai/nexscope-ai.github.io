import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateSitemap } from './generate-sitemap.mjs';

void test('sitemap uses canonical HTML and excludes noindex routes without changing dates per build', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nexscope-sitemap-'));
  try {
    await writeFile(
      join(dir, 'index.html'),
      '<link rel="canonical" href="https://learn.nexscope.ai">',
    );
    await mkdir(join(dir, 'private'));
    await writeFile(
      join(dir, 'private/index.html'),
      '<link rel="canonical" href="https://learn.nexscope.ai/private/"><meta name="robots" content="noindex">',
    );
    const url = pathToFileURL(`${dir}/`);
    await generateSitemap(url, ['/', '/private/']);
    const first = await readFile(join(dir, 'sitemap.xml'), 'utf8');
    assert.equal((first.match(/<url>/g) || []).length, 1);
    assert.ok(!first.includes('/private/'));
    await generateSitemap(url, ['/', '/private/']);
    assert.equal(await readFile(join(dir, 'sitemap.xml'), 'utf8'), first);
    await writeFile(
      join(dir, 'index.html'),
      '<link rel="canonical" href="https://example.org/">',
    );
    await assert.rejects(generateSitemap(url, ['/']), /Canonical mismatch/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

void test('Data API sitemap uses source publication dates and rejects missing generated pages', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'nexscope-api-sitemap-'));
  await mkdir(join(dir, 'api/example'), { recursive: true });
  await writeFile(join(dir, 'api/example/index.html'), '<link rel="canonical" href="https://learn.nexscope.ai/api/example/"><meta property="article:modified_time" content="2026-10-28T09:45:47.193Z">');
  const url = pathToFileURL(`${dir}/`);
  await generateSitemap(url, ['/api/example/']);
  const map = await readFile(join(dir, 'sitemap.xml'), 'utf8');
  assert.ok(map.includes('<loc>https://learn.nexscope.ai/api/example/</loc>'));
  assert.ok(map.includes('<lastmod>2026-10-28T09:45:47.193Z</lastmod>'));
  assert.ok(!map.includes('/ecommerce-ai-tools/'));
  await assert.rejects(generateSitemap(url, ['/api/missing/']), /ENOENT/);
});
