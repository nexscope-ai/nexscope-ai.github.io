/** Make standalone model-generated bold titles render as report headings. */
export function normalizeReportHeadings(markdown: string): string {
  return markdown.replace(
    /^[ \t]*(?:\\?\*){2}([^\n*]+?)(?:\\?\*){2}[ \t]*$/gm,
    (_line, title: string) => `### ${title.trim()}`,
  );
}

/** The collection timestamp was created by this page before requesting AI analysis. */
export function removeFalseCollectionDateClaim(
  markdown: string,
  collectedAt: string,
): string {
  const day = collectedAt.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return markdown;
  let removed = 0;
  const lines = markdown.split('\n').filter((line) => {
    const refersToCollection =
      line.includes(day) &&
      /\b(?:collect(?:ed|ion)?|timestamp|report date)\b/i.test(line);
    const falseFutureClaim =
      /\b(?:future|not yet occurred|has not occurred)\b/i.test(line);
    if (refersToCollection && falseFutureClaim) {
      removed++;
      return false;
    }
    return true;
  });
  const clean = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  return removed
    ? `${clean}\n\n> ${removed} unsupported collection-time claim${removed === 1 ? ' was' : 's were'} omitted: this timestamp was recorded by the page before analysis.`
    : clean;
}
