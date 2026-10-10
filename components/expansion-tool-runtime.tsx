'use client';

import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import MdText from '@/components/md-text';
import ResearchAnalysisReport from '@/components/research-analysis-report';
import type { ResearchTool } from '@/lib/research-tools';
import {
  asRecord, display, isInsufficientCreditsError,
  pick, readStoredKey, runResearchAnalysis, runResearchApi, safeLink, saveStoredKey, subscribeStoredKey,
  type RecordValue,
} from '@/lib/research-tool-api';
import { safePublicUrl, validAsin, validPastDate } from '@/lib/expansion-tool-data';
import { expansionReportEvidence } from '@/lib/expansion-report-evidence';
import { guardResearchReport } from '@/lib/research-report-guard';
import { showToolCreditModal } from '@/lib/tool-credit-modal';

type Props = { tool: ResearchTool; apiKeyUrl: string };
type Stage = '' | 'primary' | 'secondary' | 'analysis' | 'citation';
const MARKETS = [{ value: 'US', label: 'United States' }, { value: 'UK', label: 'United Kingdom' }, { value: 'DE', label: 'Germany' }, { value: 'JP', label: 'Japan' }];
const TIKTOK_MARKETS = [{ value: 'US', label: 'United States' }, { value: 'GB', label: 'United Kingdom' }, { value: 'DE', label: 'Germany' }, { value: 'JP', label: 'Japan' }];
const PERIODS = [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }];
const HISTORY_DAYS = [{ value: '30', label: '30 days' }, { value: '90', label: '90 days' }, { value: '180', label: '180 days' }, { value: '365', label: '365 days' }];
const MARKET_DOMAIN: Record<string, string> = { US: '1', UK: '2', DE: '3', JP: '5' };

function Skeleton({ label }: { label: string }) {
  return <output className="rt-loading" aria-live="polite"><p>{label}</p><div className="rt-skeleton" /><div className="rt-skeleton short" /><div className="rt-skeleton" /></output>;
}
function Choice({ label, value, options, onChange, disabled }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; disabled: boolean }) {
  return <div className="rt-field"><span className="rt-label">{label}</span><Select value={value} disabled={disabled} onValueChange={(next) => next && onChange(next)}><SelectTrigger className="rt-select" aria-label={label}>{options.find((item) => item.value === value)?.label}</SelectTrigger><SelectContent className="rt-select-popup" align="start" alignItemWithTrigger={false}>{options.map((item) => <SelectItem className="rt-select-option" key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div>;
}

export default function ExpansionToolRuntime({ tool, apiKeyUrl }: Props) {
  const [values, setValues] = useState<Record<string, string>>({ asin: '', competitorAsin: '', market: 'US', days: '90', url: '', prompt: '', region: 'US', period: 'day', date: '', termZh: '', termEn: '' });
  const [apiKey, setApiKey] = useState('');
  const [primary, setPrimary] = useState<RecordValue | null>(null);
  const [secondary, setSecondary] = useState<RecordValue | null>(null);
  const [report, setReport] = useState('');
  const [reportError, setReportError] = useState('');
  const [analysisHasEvidence, setAnalysisHasEvidence] = useState(false);
  const [analysisCoverage, setAnalysisCoverage] = useState<RecordValue | null>(null);
  const [stage, setStage] = useState<Stage>('');
  const [error, setError] = useState('');
  const [secondaryError, setSecondaryError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitted, setSubmitted] = useState<Record<string, string>>({});
  const controllerRef = useRef<AbortController | null>(null);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const fieldsRef = useRef<Record<string, HTMLInputElement | null>>({});
  const busy = stage !== '';
  const kind = tool.kind;

  // Browser storage is available only after hydration.
  // oxlint-disable-next-line react/react-compiler
  useEffect(() => { setApiKey(readStoredKey()); return subscribeStoredKey(setApiKey); }, []);
  useEffect(() => () => controllerRef.current?.abort(), []);
  const update = (name: string, value: string) => { setValues((current) => ({ ...current, [name]: value })); if (fieldError === name) { setFieldError(''); setError(''); } };
  const fail = (name: string, message: string) => { setFieldError(name); setError(message); window.setTimeout(() => fieldsRef.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0); window.setTimeout(() => fieldsRef.current[name]?.focus({ preventScroll: true }), 180); };
  const begin = () => { controllerRef.current?.abort(); const next = new AbortController(); controllerRef.current = next; setError(''); setSecondaryError(''); setFieldError(''); return next; };
  const requireKey = () => { if (apiKey.trim()) return true; fail('apiKey', 'Enter your Nexscope API key to run this request.'); return false; };

  function validate(): boolean {
    if (['price-history', 'asin-gap'].includes(kind)) {
      if (!validAsin(values.asin)) { fail('asin', 'Enter a valid 10-character Amazon ASIN.'); return false; }
    }
    if (kind === 'asin-gap') {
      if (!validAsin(values.competitorAsin)) { fail('competitorAsin', 'Enter a valid 10-character competitor ASIN.'); return false; }
      if (values.asin.trim().toUpperCase() === values.competitorAsin.trim().toUpperCase()) { fail('competitorAsin', 'Choose a different competitor ASIN.'); return false; }
    }
    if (kind === 'ai-shopping-check' && !safePublicUrl(values.url.trim())) { fail('url', 'Enter a public HTTP(S) product URL without credentials, IP address or custom port.'); return false; }
    if (kind === 'tiktok-momentum') {
      const period = values.period;
      const date = values.date.trim();
      const valid = period === 'day' ? /^\d{4}-\d{2}-\d{2}$/.test(date) && validPastDate(date)
        : period === 'week' ? /^\d{4}-(?:0?[1-9]|[1-4]\d|5[0-3])$/.test(date)
        : /^\d{4}-(?:0[1-9]|1[0-2])$/.test(date);
      if (!valid) { fail('date', `Enter a valid ${period} value in the shown format.`); return false; }
    }
    if (kind === 'sourcing-demand') {
      if (!values.termZh.trim() || values.termZh.trim().length > 50) { fail('termZh', 'Enter a Simplified Chinese sourcing term (up to 50 characters).'); return false; }
      if (!values.termEn.trim()) { fail('termEn', 'Enter a search term in the selected Amazon marketplace language.'); return false; }
    }
    return requireKey();
  }

  async function runSecondary(signal: AbortSignal, form: Record<string, string>): Promise<RecordValue | null> {
    setStage(kind === 'ai-shopping-check' ? 'citation' : 'secondary'); setSecondaryError('');
    try {
      let data: RecordValue | null = null;
      if (kind === 'asin-gap') data = await runResearchApi('amazon-asin-keywords', { asin: form.competitorAsin.trim().toUpperCase(), country: form.market, pageNum: 1, pageSize: 10, desc: true }, apiKey, signal);
      else if (kind === 'sourcing-demand') data = await runResearchApi('amazon-search', { keyword: form.termEn.trim(), amazonDomain: form.market === 'DE' ? 'amazon.de' : form.market === 'JP' ? 'amazon.co.jp' : form.market === 'UK' ? 'amazon.co.uk' : 'amazon.com', page: 1 }, apiKey, signal);
      else if (kind === 'ai-shopping-check') data = await runResearchApi('seo-ai-search-citation-sample', { prompt: form.prompt.trim() }, apiKey, signal);
      if (!signal.aborted) setSecondary(data);
      return data;
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return null;
      if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
      setSecondaryError(cause instanceof Error ? cause.message : 'The follow-up request failed.');
      return null;
    }
  }

  async function analyze(first: RecordValue, second: RecordValue | null, form: Record<string, string>, signal: AbortSignal) {
    const evidence = expansionReportEvidence(kind, first, second, form);
    setAnalysisHasEvidence(Boolean(evidence));
    const coverage = asRecord(evidence?.coverage);
    setAnalysisCoverage(Object.keys(coverage).length ? coverage : null);
    if (!evidence) {
      setReportError('The API returned no usable evidence for an AI report. No analysis request was sent or charged.');
      return;
    }
    setStage('analysis'); setReportError('');
    try { setReport(guardResearchReport(kind, await runResearchAnalysis(tool.primaryApi, evidence, apiKey, signal), evidence)); }
    catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
      setReportError(cause instanceof Error ? cause.message : 'AI analysis failed.');
    }
  }

  async function runPrimary() {
    if (busy || !validate()) return;
    const form = { ...values };
    const controller = begin();
    setSubmitted(form); setPrimary(null); setSecondary(null); setReport(''); setReportError(''); setAnalysisHasEvidence(false); setAnalysisCoverage(null); setStage('primary');
    window.setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
    try {
      let data: RecordValue;
      if (kind === 'price-history') data = await runResearchApi('amazon-product-price-series', { asin: form.asin.trim().toUpperCase(), domain: MARKET_DOMAIN[form.market], days: Number(form.days), showPrice: 1, showPriceList: 1, showPriceDeal: 1, showPricePrime: 1, showPriceFba: 1, showPriceFbm: 1, showPriceCoupon: 1, showBsrMain: 1, showSellerCount: 1 }, apiKey, controller.signal);
      else if (kind === 'asin-gap') data = await runResearchApi('amazon-asin-keywords', { asin: form.asin.trim().toUpperCase(), country: form.market, pageNum: 1, pageSize: 10, desc: true }, apiKey, controller.signal);
      else if (kind === 'ai-shopping-check') data = await runResearchApi('seo-page-evidence', { url: form.url.trim() }, apiKey, controller.signal);
      else if (kind === 'tiktok-momentum') data = await runResearchApi('tiktok-top-selling-products', { region: form.region, dateInfo: { type: form.period, value: form.date.trim() }, orderby: { field: 'units_sold', order: 'desc' }, page: 1, pageSize: 10 }, apiKey, controller.signal);
      else data = await runResearchApi('1688-product-search', { keyWord: form.termZh.trim(), pageIndex: 1, pageSize: 10, searchType: 1 }, apiKey, controller.signal);
      if (controller.signal.aborted) return;
      setPrimary(data);
      const second = kind === 'asin-gap' || kind === 'sourcing-demand' ? await runSecondary(controller.signal, form) : null;
      if (controller.signal.aborted || ((kind === 'asin-gap' || kind === 'sourcing-demand') && !second)) return;
      await analyze(data, second, form, controller.signal);
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === 'AbortError') return;
      if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
      setError(cause instanceof Error ? cause.message : 'The request failed.');
    } finally { if (controllerRef.current === controller) { controllerRef.current = null; setStage(''); } }
  }

  async function retrySecondary() {
    if (!primary || busy || !requireKey()) return;
    if (kind === 'ai-shopping-check' && !values.prompt.trim()) { fail('prompt', 'Enter one buyer question to sample.'); return; }
    const controller = begin();
    const second = await runSecondary(controller.signal, kind === 'ai-shopping-check' ? { ...submitted, prompt: values.prompt } : submitted);
    if (second && primary && kind !== 'ai-shopping-check' && !controller.signal.aborted) await analyze(primary, second, submitted, controller.signal);
    if (controllerRef.current === controller) { controllerRef.current = null; setStage(''); }
  }

  async function retryAnalysis() {
    if (!primary || busy || !requireKey() || ((kind === 'asin-gap' || kind === 'sourcing-demand') && !secondary)) return;
    const controller = begin();
    await analyze(primary, secondary, submitted, controller.signal);
    if (controllerRef.current === controller) { controllerRef.current = null; setStage(''); }
  }

  const input = (name: string, label: string, placeholder: string, note?: string) => <div className="rt-field" key={name}><label className="rt-label" htmlFor={`rt-exp-${name}`}>{label}</label><input id={`rt-exp-${name}`} ref={(element) => { fieldsRef.current[name] = element; }} value={values[name]} onChange={(event) => update(name, event.target.value)} type="text" disabled={busy} placeholder={placeholder} autoComplete="off" spellCheck={false} aria-invalid={fieldError === name} aria-describedby={fieldError === name ? `rt-exp-error-${name}` : undefined} />{fieldError === name && <span className="rt-error" id={`rt-exp-error-${name}`} role="alert">{error}</span>}{note && <small>{note}</small>}</div>;
  const choice = (name: string, label: string, options: { value: string; label: string }[]) => <Choice key={name} label={label} value={values[name]} options={options} onChange={(value) => update(name, value)} disabled={busy} />;
  const citationResult = asRecord(secondary?.result);
  const citations = Array.isArray(citationResult.citations) ? citationResult.citations.map(asRecord) : [];

  return <section className="rt-workflow rt-exp-workflow" aria-labelledby="workflow-title">
    <div className="rt-heading"><span className="rt-kicker">A FOCUSED WORKFLOW</span><h2 id="workflow-title">From input to AI report.</h2></div>
    <div className="rt-grid">
      <div className="rt-panel rt-form-panel"><div className="rt-panel-head"><span className="rt-kicker">01 / SET UP</span><h3>{tool.question}</h3><p>{tool.method}</p></div>
        <div className="rt-form rt-exp-form">
          {kind === 'price-history' && <>{input('asin', 'Amazon ASIN', 'B072MQ5BRX')}{choice('market', 'Marketplace', MARKETS)}{choice('days', 'Lookback period', HISTORY_DAYS)}</>}
          {kind === 'asin-gap' && <>{input('asin', 'Your ASIN', 'B072MQ5BRX')}{input('competitorAsin', 'Competitor ASIN', 'B08N5WRWNW')}{choice('market', 'Marketplace', MARKETS)}</>}
          {kind === 'ai-shopping-check' && input('url', 'Public product page URL', 'https://example.com/products/item')}
          {kind === 'tiktok-momentum' && <>{choice('region', 'TikTok Shop market', TIKTOK_MARKETS)}{choice('period', 'Ranking period', PERIODS)}{input('date', 'Period value', values.period === 'day' ? 'YYYY-MM-DD' : values.period === 'week' ? 'YYYY-weekNumber (e.g. 2026-40)' : 'YYYY-MM', 'Choose a completed period; availability varies by provider.')}</>}
          {kind === 'sourcing-demand' && <>{input('termZh', '1688 product term (Simplified Chinese)', '瑜伽垫')}{input('termEn', 'Amazon search term', 'yoga mat', 'Translate the product concept into the marketplace language yourself. The tool does not assume the products are identical.')}{choice('market', 'Amazon marketplace', MARKETS)}</>}
          <div className="rt-key-box"><div className="rt-key-head"><label htmlFor="rt-exp-api-key">Your Nexscope API key</label><a href={apiKeyUrl} target="_blank" rel="noopener noreferrer">Get an API key ↗</a></div><input id="rt-exp-api-key" ref={(element) => { fieldsRef.current.apiKey = element; }} value={apiKey} onChange={(event) => { setApiKey(event.target.value); saveStoredKey(event.target.value); if (fieldError === 'apiKey') { setFieldError(''); setError(''); } }} disabled={busy} type="text" autoComplete="off" spellCheck={false} placeholder="Paste your key here" aria-invalid={fieldError === 'apiKey'} />{fieldError === 'apiKey' && <span className="rt-error" role="alert">{error}</span>}<small>Saved in this browser’s localStorage and shared with Nexscope tools until cleared. Use a trusted device. Requests start only after you click.</small></div>
          <button className="rt-primary" type="button" disabled={busy} onClick={runPrimary}>{stage === 'primary' ? 'Loading source evidence…' : stage === 'secondary' ? 'Loading the second source…' : stage === 'analysis' ? 'Generating AI report…' : stage === 'citation' ? 'Sampling one AI answer…' : kind === 'asin-gap' || kind === 'sourcing-demand' ? 'Compare both sources + AI report ↗' : 'Generate AI report ↗'}</button>
          <p className="rt-cost">{kind === 'price-history' ? 'Price series: 10 credits.' : kind === 'asin-gap' ? 'Two ASIN keyword requests: 12 credits each (24 total if both complete).' : kind === 'ai-shopping-check' ? 'Page evidence: estimated 10 credits. Optional AI citation sample: estimated 152 more credits.' : kind === 'tiktok-momentum' ? 'Top-selling ranking: 15 credits.' : '1688 search: 12 credits; Amazon search: 21 credits (33 total if both complete).'} If usable data returns, an AI analysis request runs automatically and uses additional model-based credits. No AI request is sent for an empty result.</p>
          {error && !fieldError && <p className="rt-global-error" role="alert">{error}</p>}
        </div>
      </div>
    </div>
    {(stage === 'primary' || stage === 'secondary' || stage === 'analysis' || primary || reportError) && <div className="rt-exp-report-slot" ref={reportRef}>
      {kind === 'sourcing-demand' && analysisCoverage && <p className="rt-exp-coverage">Report input: {display(analysisCoverage.supplierIncludedCount)} of {display(analysisCoverage.supplierReturnedCount)} returned 1688 listings and {display(analysisCoverage.amazonIncludedCount)} of {display(analysisCoverage.amazonReturnedCount)} returned Amazon listings ({display(analysisCoverage.amazonSponsoredCount)} sponsored, {display(analysisCoverage.amazonOrganicCount)} organic).{analysisCoverage.analysisTruncated === true && ' Some fields or lower-ranked listings were omitted to fit the analysis limit.'}</p>}
      {(stage === 'primary' || stage === 'secondary') && <section className="rt-analysis-report" aria-busy="true"><div className="rt-analysis-head"><div><span className="rt-kicker">AI REPORT</span><h3>Analysis report</h3></div><span>Preparing</span></div><Skeleton label={stage === 'primary' ? 'Collecting source data before generating your report…' : 'Collecting the second source before generating your report…'} /></section>}
      {stage !== 'primary' && stage !== 'secondary' && secondaryError && (kind === 'asin-gap' || kind === 'sourcing-demand') && <section className="rt-analysis-report"><div className="rt-analysis-head"><div><span className="rt-kicker">AI REPORT</span><h3>Report not generated yet</h3></div><span>Second source unavailable</span></div><div className="rt-analysis-failure" role="alert"><p>{secondaryError} The first source is complete; retrying below only calls the second source.</p><button className="rt-secondary" type="button" disabled={busy} onClick={retrySecondary}>Retry second source · may use credits</button></div></section>}
      {stage !== 'primary' && stage !== 'secondary' && (!secondaryError || kind === 'ai-shopping-check') && <ResearchAnalysisReport markdown={report} loading={stage === 'analysis'} error={reportError} onRetry={analysisHasEvidence ? retryAnalysis : undefined} kicker="AI REPORT" />}
    </div>}
    {kind === 'ai-shopping-check' && primary && stage !== 'primary' && stage !== 'analysis' && <section className="rt-exp-citation-form"><div><span className="rt-kicker">OPTIONAL AI ANSWER SAMPLE</span><h3>Check one buyer question</h3><p>A separate citation sample costs an estimated 152 credits and is not continuous visibility tracking.</p></div>{input('prompt', 'Buyer question', 'What is the best insulated lunch bag for work?')}<button className="rt-secondary" type="button" disabled={busy} onClick={retrySecondary}>Sample one answer · estimated 152 credits</button>{secondaryError && <p className="rt-global-error" role="alert">{secondaryError}</p>}</section>}
    {kind === 'ai-shopping-check' && (stage === 'citation' || secondary) && <section className="rt-analysis-report" aria-labelledby="rt-exp-citation-title"><div className="rt-analysis-head"><div><span className="rt-kicker">AI ANSWER SAMPLE</span><h3 id="rt-exp-citation-title">Answer and citations</h3></div><span>{stage === 'citation' ? 'Loading' : 'Ready'}</span></div>{stage === 'citation' && <Skeleton label="Collecting one answer and its citations…" />}{secondary && <><p className="rt-note">A single answer sample can vary by time, wording, location and model.</p>{typeof citationResult.answerMarkdown === 'string' && <div className="rt-analysis-markdown"><MdText text={citationResult.answerMarkdown} variant="document" /></div>}<h4>{citations.length} reported citations</h4>{citations.map((citation, index) => <div className="rt-small-row" key={index}><strong>{display(pick(citation, 'title', 'sourceName', 'domain'))}</strong>{safeLink(citation.url) && <a href={safeLink(citation.url)!} target="_blank" rel="noopener noreferrer">Open source ↗</a>}</div>)}</>}</section>}
  </section>;
}
