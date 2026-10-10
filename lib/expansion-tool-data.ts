import { asRecord, numeric, type RecordValue } from './research-tool-api.ts';

export type DatedValue = { time: string; value: number; inWindow: boolean };

export function pricePoints(data: RecordValue | null, key: string, days: number, now = new Date()): DatedValue[] {
  if (!data) return [];
  const minTime = new Date(now.getTime() - days * 86_400_000).getTime();
  const raw = data[key];
  if (!Array.isArray(raw)) return [];
  return raw.map(asRecord).flatMap((row) => {
    const value = numeric(row.value);
    const time = typeof row.time === 'string' ? row.time.trim() : '';
    const parsed = Date.parse(time.replace(' ', 'T'));
    if (value === null || value < 0 || !time || !Number.isFinite(parsed)) return [];
    return [{ time, value, inWindow: parsed >= minTime && parsed <= now.getTime() }];
  }).sort((a, b) => Date.parse(a.time.replace(' ', 'T')) - Date.parse(b.time.replace(' ', 'T')));
}

export function validAsin(value: string): boolean { return /^[A-Z0-9]{10}$/i.test(value.trim()); }

export function validPastDate(value: string, today = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    && value < today.toISOString().slice(0, 10);
}

export function safePublicUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) return false;
    const host = url.hostname.toLowerCase();
    return host.includes('.') && host !== 'localhost' && !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)
      && !host.endsWith('.local') && !host.endsWith('.internal');
  } catch { return false; }
}

export function productJsonLd(html: unknown): RecordValue[] {
  if (typeof html !== 'string' || !html) return [];
  const products: RecordValue[] = [];
  const scripts = html.slice(0, 2_000_000).matchAll(/<script\b(?=[^>]*\btype\s*=\s*["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script\s*>/gi);
  const visit = (value: unknown, depth = 0): void => {
    if (depth > 6 || products.length >= 10) return;
    if (Array.isArray(value)) { value.forEach((item) => visit(item, depth + 1)); return; }
    const row = asRecord(value);
    const type = row['@type'];
    if (type === 'Product' || (Array.isArray(type) && type.includes('Product'))) products.push(row);
    if (row['@graph']) visit(row['@graph'], depth + 1);
  };
  let count = 0;
  for (const match of scripts) {
    if (++count > 8) break;
    try { visit(JSON.parse(match[1])); } catch { /* Malformed JSON-LD is not usable product evidence. */ }
  }
  return products;
}
