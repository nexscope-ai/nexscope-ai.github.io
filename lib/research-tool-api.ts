const ROOT = 'https://api.nexscope.ai/api/skill-api/v1/skills';
const STORAGE_KEY = 'nexscope.tools.api-key.v1';
const ALLOWED_SLUGS = new Set([
  'amazon-niche-info-by-keyword', 'shopify-store-query', 'shopify-product-query',
  'amazon-asin-keywords', 'chuhaijiang-tiktok-ad-search',
  'chuhaijiang-tiktok-ad-related-products', 'seo-page-evidence',
  'seo-ai-search-citation-sample', 'amazon-product-detail', '1688-product-search',
]);
const INSUFFICIENT_CREDIT_CODES = new Set([13011, 16002, 17001, 18001, 440215, -40002]);

export class InsufficientCreditsError extends Error {
  constructor() {
    super('Insufficient Data credits. Add credits to continue.');
    this.name = 'InsufficientCreditsError';
  }
}

export function isInsufficientCreditsError(value: unknown): value is InsufficientCreditsError {
  return value instanceof InsufficientCreditsError;
}

export type RecordValue = Record<string, unknown>;

export function asRecord(value: unknown): RecordValue {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {};
}

export function asRows(value: unknown): RecordValue[] {
  const source = asRecord(value);
  const nested = asRecord(source.data);
  const candidates = [source.data, source.items, source.products, source.stores, source.list,
    nested.data, nested.items, nested.products, nested.stores, nested.list, asRecord(nested.result).items];
  const rows = candidates.find(Array.isArray);
  return Array.isArray(rows) ? rows.map(asRecord) : [];
}

export function pick(record: RecordValue, ...keys: string[]): unknown {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return null;
}

export function display(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Not reported';
  if (typeof value === 'number') return Number.isFinite(value)
    ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value) : 'Not reported';
  if (typeof value === 'string' || typeof value === 'boolean') return String(value);
  return 'Not reported';
}

export function numeric(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function safeLink(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function readStoredKey(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
      return saved;
    }
    const previous = sessionStorage.getItem(STORAGE_KEY) || '';
    if (previous) {
      localStorage.setItem(STORAGE_KEY, previous);
      sessionStorage.removeItem(STORAGE_KEY);
    }
    return previous;
  } catch { return ''; }
}

export function saveStoredKey(key: string): void {
  try {
    if (key.trim()) localStorage.setItem(STORAGE_KEY, key.trim());
    else localStorage.removeItem(STORAGE_KEY);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
  } catch { /* Private browsing may deny storage; the input remains usable. */ }
}

export function subscribeStoredKey(listener: (key: string) => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener(readStoredKey());
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}

async function request(url: string, key: string, body?: RecordValue, signal?: AbortSignal): Promise<RecordValue> {
  if (!key.trim()) throw new Error('Enter your Nexscope API key first.');
  let response: Response;
  try {
    response = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${key.trim()}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new Error('Could not reach Nexscope API. Check your connection and try again.');
  }
  if (!response.ok) {
    if (response.status === 401) throw new Error('The API key was rejected. Check it and try again.');
    if (response.status === 402) throw new InsufficientCreditsError();
    if (response.status === 403) throw new Error('This API key does not have access to this operation.');
    if (response.status === 429) throw new Error('Rate limit reached. Please wait before retrying.');
    let failure: RecordValue = {};
    try { failure = asRecord(await response.json()); } catch { /* Use the HTTP fallback below. */ }
    if (INSUFFICIENT_CREDIT_CODES.has(Number(failure.code))) throw new InsufficientCreditsError();
    if (url.endsWith('/analyze')) {
      const message = pick(failure, 'msg', 'message');
      if (typeof message === 'string' && message.trim()) throw new Error(message.trim().slice(0, 240));
    }
    throw new Error(`API request failed (HTTP ${response.status}).`);
  }
  let payload: RecordValue;
  try { payload = asRecord(await response.json()); }
  catch { throw new Error('The API returned unreadable JSON.'); }
  if (INSUFFICIENT_CREDIT_CODES.has(Number(payload.code)) && ('msg' in payload || 'data' in payload)) {
    throw new InsufficientCreditsError();
  }
  const isEnvelope = payload.code !== undefined && ('ts' in payload || 'time' in payload || 'traceId' in payload);
  if (isEnvelope && Number(payload.code) !== 0) {
    if (url.endsWith('/analyze') && typeof payload.msg === 'string' && payload.msg.trim()) throw new Error(payload.msg.trim().slice(0, 240));
    throw new Error(`The API did not complete this request (code ${display(payload.code)}).`);
  }
  const data = isEnvelope ? asRecord(payload.data) : payload;
  if (!isEnvelope && data.code !== undefined && ![0, 200].includes(Number(data.code))) {
    throw new Error(`The provider did not complete this request (code ${display(data.code)}).`);
  }
  if (data.errcode !== undefined && ![0, 200].includes(Number(data.errcode))) {
    throw new Error(`The provider did not complete this request (code ${display(data.errcode)}).`);
  }
  return data;
}

export async function runResearchAnalysis(slug: string, rawData: RecordValue, key: string, signal?: AbortSignal): Promise<string> {
  if (!ALLOWED_SLUGS.has(slug)) throw new Error('Unsupported API operation.');
  const response = await request(`${ROOT}/${slug}/analyze`, key, { language: 'English', rawData }, signal);
  const content = pick(response, 'analysis') ?? pick(asRecord(response.data), 'analysis');
  if (typeof content !== 'string' || !content.trim()) throw new Error('AI analysis returned no report. Your source data is still available.');
  return content.trim();
}

export async function runResearchApi(slug: string, body: RecordValue, key: string, signal?: AbortSignal): Promise<RecordValue> {
  if (!ALLOWED_SLUGS.has(slug)) throw new Error('Unsupported API operation.');
  const data = await request(`${ROOT}/${slug}/run`, key, body, signal);
  const status = typeof data.status === 'string' ? data.status.toUpperCase() : '';
  const callId = data.callId;
  if (status !== 'PROCESSING' || typeof callId !== 'string') return data;
  if (!/^[a-f0-9-]{36}$/i.test(callId)) throw new Error('The request is processing, but its result identifier is invalid.');
  for (let read = 0; read < 8; read++) {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, 1400);
      signal?.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
    });
    const next = await request(`${ROOT}/${slug}/calls/${callId}`, key, undefined, signal);
    if (typeof next.status !== 'string' || next.status.toUpperCase() !== 'PROCESSING') return next;
  }
  throw new Error('The request is still processing. Wait and check your API call history; do not submit it again yet.');
}

export function compareKeywordSamples(own: RecordValue[], competitor: RecordValue[]): RecordValue[] {
  const ownTerms = new Set(own.map((row) => typeof row.keyword === 'string' ? row.keyword.trim().toLocaleLowerCase() : '').filter(Boolean));
  return competitor.filter((row) => {
    const term = typeof row.keyword === 'string' ? row.keyword.trim().toLocaleLowerCase() : '';
    return term && !ownTerms.has(term);
  });
}
