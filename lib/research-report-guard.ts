import { asRecord, type RecordValue } from './research-tool-api.ts';
import type { ResearchToolKind } from './research-tools.ts';

const NUMBER_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

function categoryCountClaim(line: string, category: string): number | null {
  if (!line.toLowerCase().includes(category.toLowerCase())) return null;
  const match = line.match(/\b(\d+|zero|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:of|out of)\s+(?:the\s+)?(?:top\s+)?(?:10|ten)\b/i);
  if (!match) return null;
  return /^\d+$/.test(match[1]) ? Number(match[1]) : NUMBER_WORDS[match[1].toLowerCase()];
}

/** Remove only mechanically disprovable claims; do not silently rewrite source metrics. */
export function guardResearchReport(kind: ResearchToolKind, markdown: string, evidence: RecordValue): string {
  if (!markdown.trim()) return markdown;
  const today = typeof evidence.asOfDateUtc === 'string' ? evidence.asOfDateUtc : '';
  const date = typeof evidence.date === 'string' ? evidence.date : '';
  const historicalDay = kind === 'tiktok-momentum' && evidence.period === 'day' && /^\d{4}-\d{2}-\d{2}$/.test(date) && date < today;
  const categories = Array.isArray(evidence.topLevelCategoryCounts)
    ? evidence.topLevelCategoryCounts.map(asRecord).filter((row) => typeof row.category === 'string' && typeof row.count === 'number') : [];
  let removed = 0;
  const guarded = markdown.split('\n').filter((line) => {
    let unsupported = false;
    if (kind === 'supplier-price' || kind === 'sourcing-demand') unsupported = /\b(?:future availability|future date|pre.?order|not yet available)\b/i.test(line);
    if (historicalDay && /\b(?:future date|future-dated|future period|represents a forecast)\b/i.test(line)) unsupported = true;
    if (kind === 'tiktok-momentum' && categories.some((row) => {
      const claimed = categoryCountClaim(line, String(row.category));
      return claimed !== null && claimed !== row.count;
    })) unsupported = true;
    if (kind === 'ai-shopping-check' && /(?:missed opportunity (?:to qualify|for eligibility)|ineligible for rich results|implement(?:ing)? Product JSON-LD|(?:add|implement).{0,30}structured data|consolidat(?:e|ing).{0,40}(?:H1|<h1>)|single, primary <h1>|using a single, descriptive <h1>|multiple H1.{0,100}(?:ranking|penalty)|may enable rich snippet eligibility|could impact SEO performance|unpredictable indexing|potentially due to (?:inventory|stock|A\/B)|suggest(?:s|ing).{0,50}(?:out of stock|page content changed)|investigate page inconsistency|determine why different page versions|ensure the out-of-stock page)/i.test(line)) unsupported = true;
    if (kind === 'price-history' && /(?:price|discount).{0,80}(?:caused|drove|led to|resulted in).{0,80}(?:sales|units)|(?:sales|units).{0,80}(?:caused|drove|led to|resulted in).{0,80}(?:price|discount)/i.test(line)) unsupported = true;
    if (unsupported) removed++;
    return !unsupported;
  }).join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const facts: string[] = [];
  if (historicalDay) facts.push(`The selected ranking date ${date} is before ${today}; it is not a future date.`);
  if (kind === 'tiktok-momentum' && categories.length) facts.push(`Returned-sample top-level categories: ${categories.map((row) => `${String(row.category)} ${Number(row.count)}`).join('; ')}.`);
  if (kind === 'ai-shopping-check') facts.push('Product JSON-LD and H1 findings are limited to the returned page snapshots; they do not establish live-page eligibility or a ranking effect.');
  if (kind === 'supplier-price') facts.push('1688 listing identifiers are not Amazon ASINs; source availability dates were excluded from this analysis.');
  if (kind === 'asin-gap') facts.push('The compared keyword rows are bounded first-page samples; absence from one sample does not prove the ASIN never ranks for a term.');
  if (kind === 'sourcing-demand') facts.push('1688 and Amazon rows are independent search samples, not verified product matches; supplier availability dates were excluded.');
  const note = removed ? `\n\n> ${removed} unsupported AI claim${removed === 1 ? ' was' : 's were'} omitted after checking the source evidence.` : '';
  const preface = facts.length ? `> Verified source checks: ${facts.join(' ')}\n\n` : '';
  return `${preface}${kind === 'supplier-price' ? guarded.replace(/\bASINs?\b/g, '1688 listing ID') : guarded}${note}`;
}
