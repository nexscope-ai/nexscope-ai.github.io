'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Tables need a keyboard-scrollable region. */

import { useEffect, useRef, useState } from 'react';
import ResearchAnalysisReport from '@/components/research-analysis-report';
import {
  isInsufficientCreditsError,
  readStoredKey,
  runResearchAnalysis,
  runResearchApi,
  safeLink,
  saveStoredKey,
  subscribeStoredKey,
  type RecordValue,
} from '@/lib/research-tool-api';
import { showToolCreditModal } from '@/lib/tool-credit-modal';
import {
  buildMarketplaceRequest,
  MARKETPLACE_CONFIG,
  marketplaceEvidence,
  normalizeMarketplaceReport,
  reportCell,
  reportCsv,
  type MarketplaceKind,
  type MarketplaceReport,
} from '@/lib/marketplace-report';
import styles from './1688-detail.module.css';

const markets = [
  ['SG', 'Singapore · SGD'],
  ['MY', 'Malaysia · MYR'],
  ['TH', 'Thailand · THB'],
  ['PH', 'Philippines · PHP'],
  ['ID', 'Indonesia · IDR'],
  ['VN', 'Vietnam · VND'],
  ['TW', 'Taiwan · TWD'],
  ['BR', 'Brazil · BRL'],
  ['MX', 'Mexico · MXN'],
  ['CL', 'Chile · CLP'],
  ['CO', 'Colombia · COP'],
];

function download(name: string, value: string, type: string) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function sourceUrl(kind: MarketplaceKind, row: RecordValue): string | null {
  const candidate =
    kind === '1688-selection'
      ? row.asinUrl
      : kind === 'shopee-competitor'
        ? (row.shopeeUrl ?? row.productUrl)
        : (row.productPageUrl ?? row.productUrl);
  return safeLink(candidate);
}
function scalarText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : '';
}

export default function MarketplaceReportRuntime({
  kind,
  apiKeyUrl,
}: {
  kind: MarketplaceKind;
  apiKeyUrl: string;
}) {
  const config = MARKETPLACE_CONFIG[kind];
  const [keyword, setKeyword] = useState('');
  const [market, setMarket] = useState('SG');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxMoq, setMaxMoq] = useState('');
  const [minSold, setMinSold] = useState('');
  const [period, setPeriod] = useState('rolling');
  const [month, setMonth] = useState('');
  const [key, setKey] = useState('');
  const [snapshot, setSnapshot] = useState<{
    report: MarketplaceReport;
    request: RecordValue;
    collectedAt: string;
  } | null>(null);
  const [filter, setFilter] = useState('');
  const [shown, setShown] = useState(20);
  const [reportText, setReportText] = useState('');
  const [error, setError] = useState('');
  const [reportError, setReportError] = useState('');
  const [busy, setBusy] = useState<'query' | 'report' | ''>('');
  const controller = useRef<AbortController | null>(null);
  const keyRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setKey(readStoredKey()));
    const unsubscribe = subscribeStoredKey(setKey);
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      controller.current?.abort();
    };
  }, []);
  const reset = () => {
    setSnapshot(null);
    setReportText('');
    setReportError('');
    setError('');
    setShown(20);
    setFilter('');
  };
  const safeError = (cause: unknown) =>
    (cause instanceof Error ? cause.message : 'Request failed.').replaceAll(
      key || '__no_key__',
      '[redacted]',
    );

  async function query(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!key.trim()) {
      setError('Enter your Nexscope API key to run the data query.');
      return;
    }
    let request: RecordValue;
    try {
      request = buildMarketplaceRequest(kind, {
        keyword,
        market,
        minPrice,
        maxPrice,
        maxMoq,
        minSold,
        period,
        month,
      });
    } catch (cause) {
      setError(safeError(cause));
      return;
    }
    reset();
    const run = new AbortController();
    controller.current = run;
    setBusy('query');
    try {
      const response = await runResearchApi(
        config.api,
        request,
        key,
        run.signal,
      );
      if (!run.signal.aborted)
        setSnapshot({
          report: normalizeMarketplaceReport(kind, response),
          request,
          collectedAt: new Date().toISOString(),
        });
    } catch (cause) {
      if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
      if (!run.signal.aborted) setError(safeError(cause));
    } finally {
      if (controller.current === run) {
        controller.current = null;
        setBusy('');
      }
    }
  }

  async function analyze() {
    if (busy || !snapshot || !snapshot.report.rows.length) return;
    if (!key.trim()) {
      setReportError('Enter your API key to generate the AI report.');
      return;
    }
    const run = new AbortController();
    controller.current = run;
    setBusy('report');
    setReportText('');
    setReportError('');
    try {
      const content = await runResearchAnalysis(
        config.api,
        marketplaceEvidence(
          kind,
          snapshot.report,
          snapshot.request,
          snapshot.collectedAt,
        ),
        key,
        run.signal,
      );
      if (!run.signal.aborted) setReportText(content);
    } catch (cause) {
      if (isInsufficientCreditsError(cause)) showToolCreditModal('analysis');
      if (!run.signal.aborted) setReportError(safeError(cause));
    } finally {
      if (controller.current === run) {
        controller.current = null;
        setBusy('');
      }
    }
  }

  const rows =
    snapshot?.report.rows.filter((row) =>
      [row.title, row.company, row.shopName, row.sellerName, row.brandName]
        .map(scalarText)
        .join(' ')
        .toLocaleLowerCase()
        .includes(filter.toLocaleLowerCase()),
    ) || [];
  return (
    <section className={styles.workspace} aria-labelledby="workflow-title">
      <div className={styles.heading}>
        <span className="rt-kicker">SOURCE DATA FIRST</span>
        <h2 id="workflow-title">{config.title}</h2>
        <p>{config.lead}</p>
      </div>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={query}>
          <span className="rt-kicker">01 / SET UP</span>
          <h3>Choose your search</h3>
          <label htmlFor="market-keyword">
            {kind === '1688-selection'
              ? '1688 product term · Simplified Chinese'
              : kind === 'ozon-selection'
                ? 'Ozon product term · Russian'
                : 'Shopee product keyword'}
          </label>
          <input
            id="market-keyword"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              reset();
            }}
            maxLength={100}
            placeholder={
              kind === '1688-selection'
                ? '瑜伽垫'
                : kind === 'ozon-selection'
                  ? 'кроссовки'
                  : 'phone case'
            }
            required
            disabled={!!busy}
          />
          {kind === 'shopee-competitor' && (
            <>
              <label htmlFor="market-station">Shopee marketplace</label>
              <select
                id="market-station"
                value={market}
                onChange={(e) => {
                  setMarket(e.target.value);
                  reset();
                }}
                disabled={!!busy}
              >
                {markets.map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </>
          )}
          <label htmlFor="market-min">
            Minimum price ·{' '}
            {kind === 'shopee-competitor'
              ? 'marketplace currency'
              : config.currency}
          </label>
          <input
            id="market-min"
            type="number"
            min="0"
            step="any"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              reset();
            }}
            placeholder="Optional"
            disabled={!!busy}
          />
          <label htmlFor="market-max">
            Maximum price ·{' '}
            {kind === 'shopee-competitor'
              ? 'marketplace currency'
              : config.currency}
          </label>
          <input
            id="market-max"
            type="number"
            min="0"
            step="any"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              reset();
            }}
            placeholder="Optional"
            disabled={!!busy}
          />
          {kind === '1688-selection' && (
            <>
              <label htmlFor="market-moq">Maximum minimum-order quantity</label>
              <input
                id="market-moq"
                type="number"
                min="0"
                step="1"
                value={maxMoq}
                onChange={(e) => {
                  setMaxMoq(e.target.value);
                  reset();
                }}
                placeholder="Optional"
                disabled={!!busy}
              />
            </>
          )}
          {kind === 'shopee-competitor' && (
            <>
              <label htmlFor="market-sold">Minimum sold · last 30 days</label>
              <input
                id="market-sold"
                type="number"
                min="0"
                step="1"
                value={minSold}
                onChange={(e) => {
                  setMinSold(e.target.value);
                  reset();
                }}
                placeholder="Optional"
                disabled={!!busy}
              />
            </>
          )}
          {kind === 'ozon-selection' && (
            <>
              <label htmlFor="market-period">Statistics period</label>
              <select
                id="market-period"
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  reset();
                }}
                disabled={!!busy}
              >
                <option value="rolling">Rolling last 30 days</option>
                <option value="month">Complete historical month</option>
              </select>
              {period === 'month' && (
                <>
                  <label htmlFor="market-month">Historical month</label>
                  <input
                    id="market-month"
                    type="month"
                    value={month}
                    onChange={(e) => {
                      setMonth(e.target.value);
                      reset();
                    }}
                    required
                    disabled={!!busy}
                  />
                  <p className={styles.note}>
                    The provider uses the first day of the following month as
                    its searchDate to select this complete month.
                  </p>
                </>
              )}
            </>
          )}
          <div className={styles.labelRow}>
            <label htmlFor="market-key">Your Nexscope API key</label>
            <a href={apiKeyUrl} target="_blank" rel="noopener noreferrer">
              Get a key ↗
            </a>
          </div>
          <div className={styles.keyInput}>
            <input
              id="market-key"
              ref={keyRef}
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                saveStoredKey(e.target.value);
              }}
              autoComplete="off"
              placeholder="Paste your API key"
              disabled={!!busy}
            />
            {key && (
              <button
                type="button"
                className={styles.clearKey}
                aria-label="Clear API key"
                title="Clear API key"
                disabled={!!busy}
                onClick={() => {
                  setKey('');
                  saveStoredKey('');
                  keyRef.current?.focus();
                }}
              >
                ×
              </button>
            )}
          </div>
          <p className={styles.note}>
            Saved in this browser&apos;s localStorage and shared with other
            Nexscope tools until cleared. Use a trusted device; API requests
            start only after you click.
          </p>
          <p className={styles.cost}>
            A data query uses API credits. AI analysis is a separate, optional
            request that may use additional credits.{' '}
            <a
              href={`https://www.nexscope.ai/api-docs/${config.api}?view=api&co-from=learn`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Check current cost ↗
            </a>
          </p>
          <button className="rt-primary" type="submit" disabled={!!busy}>
            {busy === 'query'
              ? 'Loading source data…'
              : 'Get API report · uses credits'}
          </button>
          {!!busy && (
            <button
              className="rt-secondary"
              type="button"
              onClick={() => {
                controller.current?.abort();
                controller.current = null;
                setBusy('');
                setError(
                  'Stopped waiting. The API may have completed and charged this request; check call history before retrying.',
                );
              }}
            >
              Stop waiting
            </button>
          )}
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </form>
        <div className={styles.results} aria-busy={busy === 'query'}>
          {!snapshot && (
            <div className={styles.empty}>
              <span className="rt-kicker">02 / API REPORT</span>
              <h3>Real source data appears here.</h3>
              <p>
                Run a query to review product rows, filters and source fields.
                No sample or AI result is presented as live evidence.
              </p>
            </div>
          )}
          {snapshot && (
            <>
              <div className={styles.summary}>
                <span className={styles.badge}>
                  API SNAPSHOT · {config.source}
                </span>
                <h3>
                  {snapshot.report.rows.length
                    ? `${snapshot.report.rows.length} products returned`
                    : 'No data available'}
                </h3>
                <p className={styles.note}>
                  Collected {snapshot.collectedAt} · Query{' '}
                  {String(
                    snapshot.request.keyWord ??
                      snapshot.request.keyword ??
                      (Array.isArray(snapshot.request.keywords)
                        ? snapshot.request.keywords[0]
                        : ''),
                  )}{' '}
                  {kind === 'shopee-competitor'
                    ? `· ${scalarText(snapshot.request.station)}`
                    : ''}{' '}
                  ·{' '}
                  {kind === 'ozon-selection'
                    ? snapshot.request.searchDate
                      ? `Complete historical month selected by ${scalarText(snapshot.request.searchDate)}`
                      : 'Rolling last 30 days'
                    : kind === '1688-selection'
                      ? '30-day source period'
                      : 'Last 30 days for period metrics'}
                </p>
                {snapshot.report.total !== null && (
                  <p className={styles.note}>
                    Provider matched total: {snapshot.report.total}. This page
                    displays only the first {snapshot.report.rows.length}{' '}
                    returned rows.
                  </p>
                )}
                <details>
                  <summary>View exact API request filters</summary>
                  <pre className={styles.rawData}>
                    {JSON.stringify(snapshot.request, null, 2)}
                  </pre>
                </details>
                {!snapshot.report.rows.length && (
                  <p>
                    No matching products were returned for these filters. Adjust
                    the keyword, market or price range and run a new query. No
                    AI analysis was requested.
                  </p>
                )}
              </div>
              {!!snapshot.report.rows.length && (
                <div className={styles.section}>
                  <div className={styles.toolbar}>
                    <h3>Product evidence</h3>
                    <button
                      className="rt-secondary"
                      type="button"
                      onClick={() =>
                        download(
                          `${kind}-${new Date(snapshot.collectedAt).toISOString().slice(0, 10)}.csv`,
                          reportCsv(snapshot.report, snapshot.collectedAt),
                          'text/csv;charset=utf-8',
                        )
                      }
                    >
                      Export returned rows · CSV
                    </button>
                  </div>
                  <label htmlFor="market-filter">
                    Filter these returned rows
                  </label>
                  <input
                    id="market-filter"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      setShown(20);
                    }}
                    placeholder="Product, store, brand or seller"
                  />
                  <p className={styles.note}>
                    All values below come from the API response. Missing values
                    stay unreported; prices are not converted between
                    currencies.
                  </p>
                  {kind === 'ozon-selection' && (
                    <p className={styles.note}>
                      Search matches can include accessories and related items.
                      Check each product title before treating these rows as an
                      exact-product market sample.
                    </p>
                  )}
                  <section
                    className={styles.tableWrap}
                    aria-label="API product report table"
                    tabIndex={0}
                  >
                    <table>
                      <thead>
                        <tr>
                          {snapshot.report.fields.map((field) => (
                            <th
                              key={field.key}
                              title={`API field: ${field.source}`}
                            >
                              {field.label}
                            </th>
                          ))}
                          <th>Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.slice(0, shown).map((row, index) => (
                          <tr
                            key={`${scalarText(row.offerId ?? row.pid ?? row.sku ?? row.productId ?? row.asin) || 'row'}-${index}`}
                          >
                            {snapshot.report.fields.map((field) => (
                              <td key={field.key}>
                                {reportCell(row[field.key])}
                              </td>
                            ))}
                            <td>
                              {sourceUrl(kind, row) ? (
                                <a
                                  href={sourceUrl(kind, row)!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Listing ↗
                                </a>
                              ) : (
                                'Not reported'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                  {!rows.length && <p>No rows match your filter.</p>}
                  {rows.length > shown && (
                    <button
                      className="rt-secondary"
                      type="button"
                      onClick={() => setShown((n) => n + 20)}
                    >
                      Show more rows
                    </button>
                  )}
                  <details>
                    <summary>View all returned fields for each product</summary>
                    {rows.map((row, index) => (
                      <details key={`raw-${index}`}>
                        <summary>
                          Row {index + 1} · {reportCell(row.title)}
                        </summary>
                        <pre className={styles.rawData}>
                          {JSON.stringify(row, null, 2)}
                        </pre>
                      </details>
                    ))}
                  </details>
                </div>
              )}
              {!!snapshot.report.rows.length && (
                <div className={styles.section}>
                  <h3>Optional AI interpretation</h3>
                  <p className={styles.note}>
                    The AI receives all {snapshot.report.rows.length} returned
                    product rows from this first API page, the filters and field
                    definitions. It does not call the marketplace again. Verify
                    claims against the table.
                  </p>
                  <button
                    className="rt-primary"
                    type="button"
                    disabled={!!busy}
                    onClick={analyze}
                  >
                    {busy === 'report'
                      ? 'Generating report…'
                      : 'Generate AI report · additional credits'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ResearchAnalysisReport
        markdown={reportText}
        loading={busy === 'report'}
        error={reportError}
        onRetry={analyze}
      />
    </section>
  );
}
