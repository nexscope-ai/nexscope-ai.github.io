import assert from 'node:assert/strict';
import { test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

void test('web MdText renders AI report tables and inline formatting', async () => {
  const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { default: MdText } = await vite.ssrLoadModule('/components/md-text.tsx');
    const report = [
      '## Competitive Landscape Analysis',
      '',
      '| Product | Brand | Price (USD) |',
      '',
      '| :--- | :--- | ---: |',
      '',
      '| YETI Daytrip | YETI | $85.00 |',
      '',
      '**Market Dominance:** YETI leads.',
      '',
      '- Check the source listing',
    ].join('\n');
    const html = renderToStaticMarkup(React.createElement(MdText, { text: report, variant: 'document' }));
    assert.match(html, /<table\b/);
    assert.match(html, /<th\b[^>]*>Product<\/th>/);
    assert.match(html, /<td\b[^>]*>YETI Daytrip<\/td>/);
    assert.match(html, /<strong\b[^>]*>Market Dominance:<\/strong>/);
    assert.match(html, /<li\b[^>]*>Check the source listing<\/li>/);
    assert.doesNotMatch(html, /\| :--- \|/);
  } finally {
    await vite.close();
  }
});
