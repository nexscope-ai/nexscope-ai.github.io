import { access, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const origin = 'https://learn.nexscope.ai';
const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('"', '&quot;');
export async function generateSitemap(directory, paths) {
  const entries = [];
  for (const path of [...new Set(paths)].sort((a, b) => a.localeCompare(b))) {
    const html = await readFile(
      new URL(
        path === '/' ? 'index.html' : `${path.slice(1)}index.html`,
        directory,
      ),
      'utf8',
    );
    const canonicalTag = html.match(
      /<link\b[^>]*rel=["']canonical["'][^>]*>/i,
    )?.[0];
    const canonical = canonicalTag?.match(/href=["']([^"']+)/i)?.[1];
    if (!canonical || new URL(canonical).href !== new URL(path, origin).href)
      throw new Error(`Canonical mismatch for ${path}: ${canonical}`);
    if (
      /<meta\b[^>]*content=["'][^"']*noindex/i.test(html) ||
      /http-equiv=["']refresh/i.test(html)
    )
      continue;
    // Navigation and structured-data changes shipped in this revision affect every root page.
    // This is a fixed release date, not the build time. Future page edits use git history.
    let date = '';
    const source =
      path === '/' ? 'app/page.tsx' : `app/${path.slice(1)}page.tsx`;
    let sources = [source];
    try {
      await access(new URL(`../${source}`, import.meta.url));
    } catch {
      sources = path.startsWith('/tools/')
        ? [
            'app/tools/[slug]/page.tsx',
            'lib/workflow-tools.ts',
            'lib/research-tools.ts',
          ]
        : ['app/[slug]/page.tsx', 'lib/guides.ts'];
    }
    try {
      const gitDate = execFileSync(
        'git',
        ['log', '-1', '--format=%cs', '--', ...sources],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      date = [date, gitDate, '2026-10-27']
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
        .at(-1);
    } catch {
      date = [date, '2026-10-27']
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
        .at(-1);
    }
    entries.push(
      `<url><loc>${escapeXml(canonical)}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`,
    );
  }
  await writeFile(
    new URL('sitemap.xml', directory),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`,
  );
  console.log(
    `Generated root sitemap: ${entries.length} canonical, indexable HTML pages.`,
  );
}
