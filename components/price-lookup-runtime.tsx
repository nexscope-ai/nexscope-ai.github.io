'use client';

import { useEffect, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import AmazonPriceResultCard from '@/components/amazon-price-result-card';
import ResearchAnalysisReport from '@/components/research-analysis-report';
import SupplierResultCard from '@/components/supplier-result-card';
import type { ResearchTool } from '@/lib/research-tools';
import { reportEvidence } from '@/lib/research-report-evidence';
import { guardResearchReport } from '@/lib/research-report-guard';
import { sortSupplierEntries, type SupplierSort } from '@/lib/research-result-format';
import { asRows, display, isInsufficientCreditsError, numeric, readStoredKey, runResearchAnalysis, runResearchApi, saveStoredKey, subscribeStoredKey, type RecordValue } from '@/lib/research-tool-api';
import { showToolCreditModal } from '@/lib/tool-credit-modal';

type Props = { tool: ResearchTool; apiKeyUrl: string };
const INITIAL_VISIBLE_SUPPLIERS = 5;
const MARKETS = [
  { value: 'amazon.com', label: 'United States · amazon.com' },
  { value: 'amazon.co.uk', label: 'United Kingdom · amazon.co.uk' },
  { value: 'amazon.de', label: 'Germany · amazon.de' },
  { value: 'amazon.co.jp', label: 'Japan · amazon.co.jp' },
];
const SUPPLIER_SORT_OPTIONS: { value: SupplierSort; label: string }[] = [
  { value: 'provider', label: 'Provider order' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'min-order', label: 'Minimum order: low to high' },
  { value: 'orders-desc', label: 'Reported orders: high to low' },
];

export default function PriceLookupRuntime({ tool, apiKeyUrl }: Props) {
  const amazon = tool.kind === 'amazon-price';
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('');
  const [market, setMarket] = useState('amazon.com');
  const [result, setResult] = useState<RecordValue | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [supplierSort, setSupplierSort] = useState<SupplierSort>('provider');
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<'query' | 'apiKey' | ''>('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const busy = loading || reportLoading;
  const slug = amazon ? 'amazon-product-detail' : '1688-product-search';

  // Browser storage is shared with the other Nexscope tool pages.
  // oxlint-disable-next-line react/react-compiler
  useEffect(() => { setApiKey(readStoredKey()); return subscribeStoredKey(setApiKey); }, []);
  useEffect(() => () => abortRef.current?.abort(), []);

  function fail(field: 'query' | 'apiKey', message: string) {
    setFieldError(field); setError(message);
    const input = field === 'query' ? inputRef.current : keyRef.current;
    window.setTimeout(() => input?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 0);
    window.setTimeout(() => input?.focus({ preventScroll: true }), 150);
  }

  async function analyze(data: RecordValue, term: string, selectedMarket: string, controller: AbortController) {
    const evidence = reportEvidence(amazon ? 'amazon-price' : 'supplier-price', data, term, selectedMarket);
    if (!evidence) return;
    setReportLoading(true); setReportError(''); setReport('');
    try { setReport(guardResearchReport(amazon ? 'amazon-price' : 'supplier-price', await runResearchAnalysis(slug, evidence, apiKey, controller.signal), evidence)); }
    catch (cause) {
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
        if (isInsufficientCreditsError(cause)) showToolCreditModal('analysis');
        setReportError(cause instanceof Error ? cause.message : 'AI analysis failed.');
      }
    } finally { if (abortRef.current === controller) setReportLoading(false); }
  }

  async function retryAnalysis() {
    if (!result || busy) return;
    const controller = new AbortController(); abortRef.current = controller;
    await analyze(result, submittedQuery, market, controller);
    if (abortRef.current === controller) abortRef.current = null;
  }

  async function run() {
    const term = query.trim();
    if (amazon && !/^[A-Z0-9]{10}$/i.test(term)) { fail('query', 'Enter a valid 10-character Amazon ASIN.'); return; }
    if (!amazon && (!/[\u3400-\u9fff]/u.test(term) || term.length > 50)) {
      fail('query', 'Enter a Simplified Chinese product term, up to 50 characters.'); return;
    }
    if (!apiKey.trim()) { fail('apiKey', 'Enter your Nexscope API key to run this request.'); return; }
    abortRef.current?.abort();
    const controller = new AbortController(); abortRef.current = controller;
    setLoading(true); setReportLoading(false); setReport(''); setReportError('');
    setSupplierSort('provider'); setShowAllSuppliers(false);
    setError(''); setFieldError(''); setResult(null); setSubmittedQuery(term);
    try {
      const data = await runResearchApi(slug, amazon
        ? { asins: term.toUpperCase(), amazonDomain: market, returnRelatedProducts: false, returnAuthorsReviews: false, returnBoughtTogether: false }
        : { keyWord: term, searchType: 1, pageIndex: 1, pageSize: 10 }, apiKey, controller.signal);
      setResult(data);
      setLoading(false);
      await analyze(data, term, market, controller);
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
        if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
        setError(cause instanceof Error ? cause.message : 'Request failed.');
      }
    } finally { if (abortRef.current === controller) { setLoading(false); abortRef.current = null; } }
  }

  const rows = asRows(result);
  const product = amazon ? rows.find((row) => typeof row.asin === 'string' && row.asin.toUpperCase() === submittedQuery.toUpperCase()) : null;
  const suppliers = amazon ? [] : rows.filter((row) => {
    const price = numeric(row.price);
    return (typeof row.title === 'string' && Boolean(row.title.trim())) || (price !== null && price > 0)
      || (typeof row.offerId === 'string' && Boolean(row.offerId.trim()))
      || (typeof row.offerId === 'number' && Number.isSafeInteger(row.offerId));
  });
  const supplierEntries = sortSupplierEntries(suppliers, supplierSort);
  const visibleSupplierEntries = showAllSuppliers ? supplierEntries : supplierEntries.slice(0, INITIAL_VISIBLE_SUPPLIERS);

  return <section className={`rt-workflow rt-workflow--price ${amazon ? 'rt-workflow--amazon' : 'rt-workflow--supplier'}`} id="workflow" aria-labelledby="workflow-title">
    <div className="rt-heading"><span className="rt-kicker">A FOCUSED PRICE LOOKUP</span><h2 id="workflow-title">From search to reported price.</h2></div>
    <div className="rt-grid">
      <div className="rt-panel rt-form-panel">
        <div className="rt-panel-head"><span className="rt-kicker">01 / SET UP</span><h3>{tool.question}</h3><p>{tool.method}</p></div>
        <div className="rt-form">
          <div className="rt-field"><label className="rt-label" htmlFor="rt-price-query">{amazon ? 'Amazon ASIN' : '1688 product term (Simplified Chinese)'}</label>
            <input id="rt-price-query" ref={inputRef} value={query} disabled={busy} onChange={(event) => { setQuery(event.target.value); setResult(null); setReport(''); setReportError(''); if (fieldError === 'query') { setFieldError(''); setError(''); } }}
              placeholder={amazon ? 'B072MQ5BRX' : '瑜伽垫'} autoComplete="off" spellCheck={false} aria-invalid={fieldError === 'query'}
              aria-describedby={fieldError === 'query' ? 'rt-price-query-error' : undefined} />
            {fieldError === 'query' && <span className="rt-error" id="rt-price-query-error" role="alert">{error}</span>}
          </div>
          {amazon && <div className="rt-field"><span className="rt-label">Amazon marketplace</span>
            <Select value={market} disabled={busy} onValueChange={(value) => { if (value) { setMarket(value); setResult(null); setReport(''); setReportError(''); } }}>
              <SelectTrigger className="rt-select" aria-label="Amazon marketplace">{MARKETS.find((item) => item.value === market)?.label}</SelectTrigger>
              <SelectContent className="rt-select-popup" align="start" alignItemWithTrigger={false}>
                {MARKETS.map((item) => <SelectItem className="rt-select-option" key={item.value} value={item.value}>{item.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>}
          <div className="rt-key-box"><div className="rt-key-head"><label htmlFor="rt-price-key">Your Nexscope API key</label><a href={apiKeyUrl} target="_blank" rel="noopener noreferrer">Get an API key ↗</a></div>
            <input id="rt-price-key" ref={keyRef} value={apiKey} disabled={busy} onChange={(event) => { setApiKey(event.target.value); saveStoredKey(event.target.value); if (fieldError === 'apiKey') { setFieldError(''); setError(''); } }}
              type="text" autoComplete="off" spellCheck={false} placeholder="Paste your key here" aria-invalid={fieldError === 'apiKey'}
              aria-describedby={fieldError === 'apiKey' ? 'rt-price-key-error' : undefined} />
            {fieldError === 'apiKey' && <span className="rt-error" id="rt-price-key-error" role="alert">{error}</span>}
          </div>
          <button className="rt-primary" type="button" disabled={busy} onClick={run}>{loading ? 'Loading prices…' : reportLoading ? 'Generating report…' : amazon ? 'Check Amazon price + AI report ↗' : 'Find 1688 prices + AI report ↗'}</button>
          <p className="rt-cost">{amazon ? 'Amazon Product Detail: 21 credits. After data returns, an AI analysis starts automatically and uses additional model-based credits. No AI call is made if no usable result is returned.' : '1688 lookup: 12 credits. An AI report follows usable results and uses additional model credits; empty results do not trigger analysis.'}</p>
          {error && !fieldError && <p className="rt-global-error" role="alert">{error}</p>}
        </div>
      </div>
      <div className="rt-panel rt-results">
        <div className="rt-panel-head rt-results-head"><div><span className="rt-kicker">02 / REVIEW</span><h3>{amazon ? 'Amazon listing' : '1688 price candidates'}</h3></div><span>{loading ? 'Loading data' : result ? 'Ready' : 'No lookup yet'}</span></div>
        <div className="rt-result-body">
          {loading && <output className="rt-loading" aria-live="polite"><p>{amazon ? 'Looking up the Amazon listing…' : 'Searching 1688 supplier listings…'}</p><div className="rt-skeleton" /><div className="rt-skeleton short" /><div className="rt-skeleton" /></output>}
          {!loading && !result && <div className="rt-empty"><div className="rt-star">✦</div><h4>Run one API lookup.</h4><p>{amazon ? 'Review the reported listing price and currency before using it in a sourcing decision.' : 'Compare reported wholesale prices and minimum orders; confirm supplier terms before buying.'}</p><div className="rt-preview"><b>WHAT YOU&apos;LL SEE</b>{tool.preview.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</div>)}</div></div>}
          {!loading && result && amazon && (product ? <AmazonPriceResultCard product={product} /> : <p className="rt-note">No matching product was returned for this ASIN. The API request may still have consumed credits.</p>)}
          {!loading && result && !amazon && <>
            <h4>{suppliers.length} priced or identifiable listings</h4>
            <p className="rt-note">These are search candidates, not verified quotes or proof that listings represent the same product. Sales are provider-reported for an unspecified period; verify quantity tiers, currency and supplier terms before buying.</p>
            {suppliers.length ? <>
              <div className="rt-supplier-toolbar">
                <span>Showing {visibleSupplierEntries.length} of {suppliers.length} candidates</span>
                <div className="rt-supplier-sort"><span>Sort by</span>
                  <Select value={supplierSort} onValueChange={(value) => { if (value) { setSupplierSort(value as SupplierSort); setShowAllSuppliers(false); } }}>
                    <SelectTrigger className="rt-select rt-supplier-sort-trigger" aria-label="Sort 1688 listings">{SUPPLIER_SORT_OPTIONS.find((option) => option.value === supplierSort)?.label}</SelectTrigger>
                    <SelectContent className="rt-select-popup" align="end" alignItemWithTrigger={false}>
                      {SUPPLIER_SORT_OPTIONS.map((option) => <SelectItem className="rt-select-option" key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rt-supplier-list-head" aria-hidden="true"><span>Listing</span><span>Price</span><span>Min. order</span><span>Provider activity</span><span>Store</span><span>Details</span></div>
              <ol className="rt-supplier-list">
                {visibleSupplierEntries.map(({ row, index }) => <SupplierResultCard row={row} index={index} key={`${display(row.offerId)}-${index}`} />)}
              </ol>
              {suppliers.length > INITIAL_VISIBLE_SUPPLIERS && <button className="rt-secondary rt-supplier-more" type="button" onClick={() => setShowAllSuppliers((value) => !value)}>{showAllSuppliers ? `Show first ${INITIAL_VISIBLE_SUPPLIERS}` : `Show all ${suppliers.length} listings`}</button>}
            </> : <p className="rt-note">No usable listings were returned for this term.</p>}
          </>}
        </div>
      </div>
    </div>
    {!loading && result && (amazon ? Boolean(product) : suppliers.length > 0) && <ResearchAnalysisReport markdown={report} loading={reportLoading} error={reportError} onRetry={retryAnalysis} />}
  </section>;
}
