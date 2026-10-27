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
