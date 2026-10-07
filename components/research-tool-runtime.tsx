'use client';

import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import MdText from '@/components/md-text';
import NicheResultCard from '@/components/niche-result-card';
import ResearchAnalysisReport from '@/components/research-analysis-report';
import type { ResearchTool } from '@/lib/research-tools';
import { reportEvidence } from '@/lib/research-report-evidence';
import {
  asRecord, asRows, compareKeywordSamples, display,
  isInsufficientCreditsError, pick, readStoredKey, runResearchAnalysis, runResearchApi, safeLink, saveStoredKey, subscribeStoredKey,
  type RecordValue,
} from '@/lib/research-tool-api';
import { showToolCreditModal } from '@/lib/tool-credit-modal';

type Props = { tool: ResearchTool; apiKeyUrl: string };
type FormValues = Record<string, string>;
const MARKET_OPTIONS = {
  niche: [{ value: 'US', label: 'United States' }, { value: 'DE', label: 'Germany' }, { value: 'JP', label: 'Japan' }],
  amazon: [{ value: 'US', label: 'United States' }, { value: 'UK', label: 'United Kingdom' }, { value: 'DE', label: 'Germany' }, { value: 'JP', label: 'Japan' }],
  tiktok: [{ value: 'us', label: 'United States' }, { value: 'uk', label: 'United Kingdom' }, { value: 'de', label: 'Germany' }],
};
const INITIAL: FormValues = {
  keyword: '', market: 'US', store: '', asin: '', competitorAsin: '',
  country: 'us', url: '', prompt: '',
};

function metric(label: string, value: unknown, suffix = '') {
  if (value === null || value === undefined || value === '') return null;
  return <div className="rt-metric" key={label}><span>{label}</span><strong>{display(value)}{suffix}</strong></div>;
}

function listSource(value: RecordValue | null): RecordValue[] {
  if (!value) return [];
  return asRows(value);
}

function titleOf(row: RecordValue, fallback: string): string {
  return display(pick(row, 'nicheTitle', 'storeName', 'title', 'ad_title', 'productName', 'subject', 'name', 'keyword')) === 'Not reported'
    ? fallback : display(pick(row, 'nicheTitle', 'storeName', 'title', 'ad_title', 'productName', 'subject', 'name', 'keyword'));
}

function LoadingResults({ message }: { message: string }) {
  return <output className="rt-loading" aria-live="polite">
    <p>{message}</p><div className="rt-skeleton" /><div className="rt-skeleton short" /><div className="rt-skeleton" />
  </output>;
}

function CustomSelect({ label, value, options, onChange, disabled }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; disabled?: boolean;
}) {
  return <div className="rt-field"><span className="rt-label">{label}</span>
    <Select value={value} disabled={disabled} onValueChange={(next) => { if (next) onChange(next); }}>
      <SelectTrigger className="rt-select" aria-label={label}>{options.find((item) => item.value === value)?.label}</SelectTrigger>
      <SelectContent className="rt-select-popup" align="start" alignItemWithTrigger={false}>
        {options.map((option) => <SelectItem className="rt-select-option" key={option.value} value={option.value}>{option.label}</SelectItem>)}
      </SelectContent>
    </Select>
  </div>;
}

export default function ResearchToolRuntime({ tool, apiKeyUrl }: Props) {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [apiKey, setApiKey] = useState('');
  const [primary, setPrimary] = useState<RecordValue | null>(null);
  const [resultMarket, setResultMarket] = useState('US');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [secondary, setSecondary] = useState<RecordValue | null>(null);
  const [report, setReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState<'primary' | 'secondary' | ''>('');
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const kind = tool.kind;
  const busy = Boolean(loading) || reportLoading;

  // Browser storage must be read after hydration.
  // oxlint-disable-next-line react/react-compiler
  useEffect(() => { setApiKey(readStoredKey()); return subscribeStoredKey(setApiKey); }, []);
  useEffect(() => () => abortRef.current?.abort(), []);
  const update = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (fieldError === name) { setFieldError(''); setError(''); }
  };
  const fail = (name: string, message: string) => {
    setFieldError(name); setError(message);
    window.setTimeout(() => fieldRefs.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
    window.setTimeout(() => fieldRefs.current[name]?.focus({ preventScroll: true }), 150);
  };
  const begin = (step: 'primary' | 'secondary') => {
    abortRef.current?.abort();
    const controller = new AbortController(); abortRef.current = controller;
    setLoading(step); setError(''); setFieldError('');
    return controller.signal;
  };
  const finish = () => { setLoading(''); abortRef.current = null; };
  const requireKey = () => {
    if (apiKey.trim()) return true;
    fail('apiKey', 'Enter your Nexscope API key to run this request.');
    return false;
  };

  async function analyzeNiche(data: RecordValue, query: string, market: string, signal: AbortSignal) {
    const evidence = reportEvidence('niche', data, query, market);
    if (!evidence) return;
    setReportLoading(true); setReportError(''); setReport('');
    try { setReport(await runResearchAnalysis(tool.primaryApi, evidence, apiKey, signal)); }
    catch (cause) {
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
        if (isInsufficientCreditsError(cause)) showToolCreditModal('analysis');
        setReportError(cause instanceof Error ? cause.message : 'AI analysis failed.');
      }
    } finally { if (!signal.aborted) setReportLoading(false); }
  }

  async function retryNicheAnalysis() {
    if (kind !== 'niche' || !primary || busy) return;
    const controller = new AbortController(); abortRef.current = controller;
    await analyzeNiche(primary, submittedQuery, resultMarket, controller.signal);
    if (abortRef.current === controller) abortRef.current = null;
  }

  async function runPrimary() {
    const inputName = kind === 'niche' || kind === 'tiktok-ads' ? 'keyword'
      : kind === 'shopify' ? 'store' : kind === 'keyword-gap' ? 'asin' : 'url';
    const input = values[inputName]?.trim() || '';
    if (!input) { fail(inputName, 'Enter a value to begin.'); return; }
    if (kind === 'keyword-gap' && !/^[A-Z0-9]{10}$/i.test(input)) { fail(inputName, 'Enter a valid 10-character ASIN.'); return; }
    if (kind === 'ai-readiness' && !safeLink(input)) { fail(inputName, 'Enter a public HTTPS URL without credentials.'); return; }
    if (!requireKey()) return;
    const body: RecordValue = kind === 'niche' ? { keyword: input, countryCode: values.market, page: 1, pageSize: 10 }
      : kind === 'shopify' ? { searchKey: input, page: 1, pageSize: 10 }
      : kind === 'keyword-gap' ? { asin: input.toUpperCase(), country: values.market, pageNum: 1, pageSize: 10, desc: true }
      : kind === 'tiktok-ads' ? { country: values.country, keyword: input, page: 1, pageSize: 5 }
      : { url: input };
    setPrimary(null); setSecondary(null); setSelected(null);
    setReport(''); setReportError(''); setReportLoading(false);
    if (kind === 'niche') { setResultMarket(values.market); setSubmittedQuery(input); }
    const signal = begin('primary');
    try {
      const data = await runResearchApi(tool.primaryApi, body, apiKey, signal);
      setPrimary(data);
      if (kind === 'niche') { setLoading(''); await analyzeNiche(data, input, values.market, signal); }
    }
    catch (cause) {
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
        if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
        setError(cause instanceof Error ? cause.message : 'Request failed.');
      }
    }
    finally { if (abortRef.current?.signal === signal) finish(); }
  }

  async function runSecondary(index?: number) {
    if (!requireKey()) return;
    let slug = ''; let body: RecordValue = {};
    if (kind === 'shopify') {
      const row = listSource(primary)[index ?? -1];
      const raw = pick(row || {}, 'storeDomain', 'storeLink', 'storeUrl', 'domain', 'url');
      const domain = typeof raw === 'string' ? raw.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';
      if (!domain) { setError('No usable store domain was returned for this item.'); return; }
      slug = 'shopify-product-query'; body = { searchKey: `https://${domain}`, page: 1, pageSize: 10 };
    } else if (kind === 'keyword-gap') {
      const asin = values.competitorAsin.trim().toUpperCase();
      if (!/^[A-Z0-9]{10}$/.test(asin)) { fail('competitorAsin', 'Enter a valid 10-character competitor ASIN.'); return; }
      if (asin === values.asin.trim().toUpperCase()) { fail('competitorAsin', 'Choose a different ASIN for comparison.'); return; }
      slug = 'amazon-asin-keywords'; body = { asin, country: values.market, pageNum: 1, pageSize: 10, desc: true };
    } else if (kind === 'tiktok-ads') {
      const row = listSource(primary)[index ?? -1];
      const id = pick(row || {}, 'ad_id', 'adId', 'id');
      const idText = typeof id === 'string' ? id : typeof id === 'number' && Number.isSafeInteger(id) ? String(id) : '';
      if (!/^\d{10,25}$/.test(idText)) { setError('No usable ad ID was returned for this item.'); return; }
      slug = 'chuhaijiang-tiktok-ad-related-products'; body = { id: idText, country: values.country, page: 1, pageSize: 5 };
    } else if (kind === 'ai-readiness') {
      if (!values.prompt.trim()) { fail('prompt', 'Enter one buyer question to sample.'); return; }
      slug = 'seo-ai-search-citation-sample'; body = { prompt: values.prompt.trim() };
    } else return;
    setSelected(index ?? null); setSecondary(null);
    const signal = begin('secondary');
    try { setSecondary(await runResearchApi(slug, body, apiKey, signal)); }
    catch (cause) {
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
        if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
        setError(cause instanceof Error ? cause.message : 'Request failed.');
      }
    }
    finally { if (abortRef.current?.signal === signal) finish(); }
  }

  const input = (name: string, label: string, placeholder: string, note?: string) =>
    <div className="rt-field" key={name}>
      <label className="rt-label" htmlFor={`rt-${name}`}>{label}</label>
      <input id={`rt-${name}`} ref={(element) => { fieldRefs.current[name] = element; }}
        value={values[name] || ''} onChange={(event) => update(name, event.target.value)}
        type="text" placeholder={placeholder} disabled={busy}
        autoComplete="off" spellCheck={false} aria-invalid={fieldError === name}
        aria-describedby={fieldError === name ? `rt-error-${name}` : undefined} />
      {fieldError === name && <span id={`rt-error-${name}`} className="rt-error" role="alert">{error}</span>}
      {note && <small>{note}</small>}
    </div>;

  const rows = listSource(primary);
  const extraRows = listSource(secondary);
  const ownGap = kind === 'keyword-gap' && secondary ? compareKeywordSamples(rows, extraRows) : [];
  const seoResult = asRecord(primary?.result);
  const snapshots = Array.isArray(seoResult.snapshots) ? seoResult.snapshots.map(asRecord) : [];
  const aiResult = asRecord(secondary?.result);
  const citations = Array.isArray(aiResult.citations) ? aiResult.citations.map(asRecord) : [];

  return <section className="rt-workflow" id="workflow" aria-labelledby="workflow-title">
    <div className="rt-heading"><span className="rt-kicker">A FOCUSED WORKFLOW</span><h2 id="workflow-title">From input to evidence.</h2></div>
    <div className="rt-grid">
      <div className="rt-panel rt-form-panel">
        <div className="rt-panel-head"><span className="rt-kicker">01 / SET UP</span><h3>{tool.question}</h3><p>{tool.method}</p></div>
        <div className="rt-form">
          {kind === 'niche' && <>{input('keyword', 'Amazon niche keyword', 'e.g. insulated lunch bag', 'Use the language of the selected marketplace.')}
            <CustomSelect label="Marketplace" value={values.market} options={MARKET_OPTIONS.niche} disabled={busy} onChange={(value) => update('market', value)} /></>}
          {kind === 'shopify' && input('store', 'Store name or domain', 'e.g. example.com', 'One bounded page of matching stores is requested.')}
          {kind === 'keyword-gap' && <>{input('asin', 'Your Amazon ASIN', 'B072MQ5BRX')}
            <CustomSelect label="Marketplace" value={values.market} options={MARKET_OPTIONS.amazon} disabled={busy} onChange={(value) => update('market', value)} /></>}
          {kind === 'tiktok-ads' && <>{input('keyword', 'Ad search keyword', 'e.g. beauty')}
            <CustomSelect label="TikTok market" value={values.country} options={MARKET_OPTIONS.tiktok} disabled={busy} onChange={(value) => update('country', value)} /></>}
          {kind === 'ai-readiness' && input('url', 'Public product page URL', 'https://example.com/products/item', 'Only public HTTPS pages are supported.')}
          <div className="rt-key-box">
            <div className="rt-key-head"><label htmlFor="rt-api-key">Your Nexscope API key</label><a href={apiKeyUrl} target="_blank" rel="noopener noreferrer">Get an API key ↗</a></div>
            <input id="rt-api-key" ref={(element) => { fieldRefs.current.apiKey = element; }} value={apiKey} disabled={busy}
              onChange={(event) => { setApiKey(event.target.value); saveStoredKey(event.target.value); if (fieldError === 'apiKey') { setFieldError(''); setError(''); } }}
              type="text" autoComplete="off" spellCheck={false} placeholder="Paste your key here" aria-invalid={fieldError === 'apiKey'} />
            {fieldError === 'apiKey' && <span className="rt-error" role="alert">{error}</span>}
            <small>Saved in this browser&apos;s localStorage and shared with Nexscope tools until cleared. Use a trusted device; API requests are sent only to api.nexscope.ai after you start.</small>
          </div>
          <button className="rt-primary" type="button" disabled={busy} onClick={runPrimary}>
            {loading === 'primary' ? 'Loading evidence…' : reportLoading ? 'Generating report…' : kind === 'niche' ? 'Compare niches + AI report ↗' : kind === 'shopify' ? 'Find stores ↗' : kind === 'keyword-gap' ? 'Load my keywords ↗' : kind === 'tiktok-ads' ? 'Search ads ↗' : 'Inspect page ↗'}
          </button>
          <p className="rt-cost">{kind === 'ai-readiness' ? 'Page evidence: estimated 10 credits. Citation sample is a separate, higher-cost step.' : kind === 'tiktok-ads' ? 'Ad search: 38 credits. Related products: another 38 credits if requested.' : kind === 'keyword-gap' ? 'Each ASIN keyword request: 12 credits. The competitor call is optional.' : kind === 'niche' ? 'Niche lookup: 12 credits. After data returns, an AI analysis starts automatically and uses additional model-based credits. No AI call is made for an empty result.' : 'API requests may consume credits. Check current pricing in the API reference.'}</p>
          {error && !fieldError && <p className="rt-global-error" role="alert">{error}</p>}
        </div>
      </div>
      <div className="rt-panel rt-results">
        <div className="rt-panel-head rt-results-head"><div><span className="rt-kicker">02 / REVIEW</span><h3>Your findings</h3></div><span>{loading ? 'Loading' : primary || secondary ? 'Ready' : 'No analysis yet'}</span></div>
        <div className="rt-result-body">
          {loading === 'primary' && <LoadingResults message="The first evidence request is running…" />}
          {!primary && !secondary && !loading && <div className="rt-empty"><div className="rt-star">✦</div><h4>Start with one input.</h4><p>Evidence appears here after the first request. Further requests are made only when you choose them.</p><div className="rt-preview"><b>WHAT YOU&apos;LL SEE</b>{tool.preview.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div></div>}
          {kind === 'niche' && primary && <><h4>{rows.length} niche snapshots returned · {resultMarket}</h4><p className="rt-note">Compare reported signals, not an invented composite score. Rates are shown as percentages; provider coverage and freshness are not guaranteed.</p>{rows.length ? rows.map((row, index) => <NicheResultCard row={row} index={index} market={resultMarket} key={`${display(row.nicheId)}-${index}`} />) : <p>No niche rows were returned for this query.</p>}</>}
          {kind === 'shopify' && primary && <><h4>{rows.length} store candidates returned</h4><p className="rt-note">Traffic and order fields are provider-reported, not store owner analytics.</p>{rows.length ? rows.map((row, index) => <article className="rt-item" key={`${display(row.storeDomain)}-${index}`}><span className="rt-index">STORE {index + 1}</span><h5>{titleOf(row, 'Unnamed store')}</h5><p>{display(pick(row, 'storeDomain', 'domain', 'storeLink'))}</p><div className="rt-metrics">{metric('Products', row.productNum)}{metric('Monthly visits', row.monthlyVisit)}{metric('Monthly orders', row.monthOrderNum)}{metric('Ads', row.advertiseCount)}</div><button type="button" className="rt-secondary" disabled={Boolean(loading)} onClick={() => runSecondary(index)}>Inspect matching products · 25 credits</button>{selected === index && loading === 'secondary' && <LoadingResults message="Loading product matches for this store…" />}{selected === index && secondary && <div className="rt-nested"><h6>{extraRows.length} product matches</h6>{extraRows.length ? extraRows.map((product, i) => <div key={i} className="rt-small-row"><strong>{titleOf(product, 'Unnamed product')}</strong><span>{display(pick(product, 'minPrice', 'price', 'salePrice'))}</span></div>) : <p>No matching products were returned.</p>}</div>}</article>) : <p>No matching stores were returned.</p>}</>}
          {kind === 'keyword-gap' && primary && <><h4>{rows.length} keywords returned for your ASIN</h4><p className="rt-note">Page 1 only. A separate competitor request is needed to compare samples.</p><div className="rt-compare-form">{input('competitorAsin', 'Competitor ASIN', 'B08N5WRWNW')}<button type="button" className="rt-secondary" disabled={Boolean(loading)} onClick={() => runSecondary()}>Compare competitor · 12 credits</button></div>{loading === 'secondary' && <LoadingResults message="Loading competitor keyword sample…" />}{secondary && <><h5>{ownGap.length} competitor-only terms in these samples</h5><p className="rt-note">The competitor returned {extraRows.length} keywords. Missing from your sample does not prove zero exposure.</p>{ownGap.length ? ownGap.map((row, index) => <div className="rt-keyword" key={`${display(row.keyword)}-${index}`}><strong>{display(row.keyword)}</strong><div className="rt-metrics">{metric('Weekly searches', row.weeklySearchVolume)}{metric('Natural rank', row.productNaturalRank)}{metric('Ad rank', row.productAdRank)}{metric('Traffic share', row.trafficShare)}</div></div>) : <p>No competitor-only term appeared in these bounded samples.</p>}</>}</>}
          {kind === 'tiktok-ads' && primary && <><h4>{rows.length} ads returned</h4><p className="rt-note">Ad metrics are provider-reported; they do not establish causal product sales.</p>{rows.length ? rows.map((row, index) => <article className="rt-item" key={`${display(pick(row, 'ad_id', 'id'))}-${index}`}><span className="rt-index">AD {index + 1}</span><h5>{titleOf(row, 'Untitled ad')}</h5><p>Ad ID {display(pick(row, 'ad_id', 'adId', 'id'))}</p><div className="rt-metrics">{metric('Reported GMV', pick(row, 'total_gmv', 'totalGmv'))}{metric('ROAS', pick(row, 'ad_roas', 'roas'))}{metric('Video plays', pick(row, 'video_play_count', 'videoPlayCount'))}</div><button type="button" className="rt-secondary" disabled={Boolean(loading)} onClick={() => runSecondary(index)}>Load associated products · 38 credits</button>{selected === index && loading === 'secondary' && <LoadingResults message="Loading products associated with this ad…" />}{selected === index && secondary && <div className="rt-nested"><h6>{extraRows.length} associated products</h6>{extraRows.length ? extraRows.map((item, i) => <div className="rt-small-row" key={i}><strong>{titleOf(item, 'Unnamed product')}</strong><span>ID {display(pick(item, 'product_id', 'productId', 'id'))}</span></div>) : <p>No associated products were returned.</p>}</div>}</article>) : <p>No ads were returned for this keyword and market.</p>}</>}
          {kind === 'ai-readiness' && primary && <><h4>Page evidence: {display(primary.status)}</h4><p className="rt-note">Collected page evidence, not an AI ranking score.</p>{snapshots.length ? snapshots.map((snapshot, index) => { const evidence = asRecord(snapshot.evidence); const h1 = Array.isArray(evidence.h1) ? evidence.h1.filter(Boolean).join(' · ') : null; return <article className="rt-item" key={index}><span className="rt-index">SNAPSHOT {index + 1}</span><h5>{display(evidence.title)}</h5><div className="rt-metrics">{metric('HTTP status', evidence.httpStatus)}{metric('Canonical', evidence.canonical)}{metric('H1', h1)}{metric('Text length', evidence.textLength)}</div>{typeof evidence.description === 'string' && <p>{evidence.description}</p>}{Array.isArray(snapshot.missing) && snapshot.missing.length > 0 && <p className="rt-note">Missing evidence: {snapshot.missing.map((item) => display(asRecord(item).field)).join(', ')}</p>}</article>; }) : <p>No page snapshots were returned. Check the API coverage status.</p>}
            <div className="rt-optional"><h5>Optional: sample one AI answer</h5><p>Estimated 152 credits. This is one ChatGPT answer and citation observation, not continuous visibility tracking.</p>{input('prompt', 'Buyer question to sample', 'What is the best insulated lunch bag for work?')}<button type="button" className="rt-secondary" disabled={Boolean(loading)} onClick={() => runSecondary()}>Sample one answer · estimated 152 credits</button></div>
            {loading === 'secondary' && <LoadingResults message="Collecting one AI answer and its citations…" />}{secondary && <div className="rt-nested"><h5>Citation sample: {display(secondary.status)}</h5>{typeof aiResult.answerMarkdown === 'string' && <MdText text={aiResult.answerMarkdown} />}{citations.length ? <><h6>{citations.length} cited sources</h6>{citations.map((citation, index) => <div className="rt-small-row" key={index}><strong>{display(pick(citation, 'title', 'sourceName', 'domain'))}</strong>{safeLink(citation.url) && <a href={safeLink(citation.url)!} target="_blank" rel="noopener noreferrer">Open source ↗</a>}</div>)}</> : <p>No citations were reported in this sample.</p>}</div>}</>}
        </div>
      </div>
    </div>
    {kind === 'niche' && primary && rows.length > 0 && <ResearchAnalysisReport markdown={report} loading={reportLoading} error={reportError} onRetry={retryNicheAnalysis} />}
  </section>;
}
