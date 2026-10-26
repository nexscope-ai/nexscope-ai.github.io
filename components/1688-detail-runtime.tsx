'use client';
/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Named horizontal-scroll regions must be keyboard-focusable. */

import { useEffect, useRef, useState } from 'react';
import ResearchAnalysisReport from '@/components/research-analysis-report';
import {
  isInsufficientCreditsError,
  readStoredKey,
  saveStoredKey,
  subscribeStoredKey,
} from '@/lib/research-tool-api';
import { showToolCreditModal } from '@/lib/tool-credit-modal';
import { runResearchApi, runResearchAnalysis } from '@/lib/research-tool-api';
import {
  detailEvidence,
  exampleOffer,
  merchandiseSubtotal,
  normalizeOffer,
  offerCsv,
  parseOfferId,
  validQuantity,
  type OfferDetail,
} from '@/lib/1688-detail';
import styles from './1688-detail.module.css';

type Snapshot = { offer: OfferDetail; collectedAt: string; demo: boolean };
function download(name: string, text: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function DetailRuntime({ apiKeyUrl }: { apiKeyUrl: string }) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [filter, setFilter] = useState('');
  const [priceChoice, setPriceChoice] = useState('');
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [report, setReport] = useState('');
  const [reportError, setReportError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<'query' | 'report' | ''>('');
  const [shown, setShown] = useState(20);
  const controller = useRef<AbortController | null>(null);
  const errorRef = useRef<HTMLParagraphElement | null>(null);
  const keyInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setKey(readStoredKey()));
    const unsubscribe = subscribeStoredKey(setKey);
    return () => {
      cancelAnimationFrame(frame);
      unsubscribe();
      controller.current?.abort();
    };
  }, []);
  const fail = (message: string) => {
    setError(message);
    requestAnimationFrame(() => errorRef.current?.focus());
  };
  const resetResult = () => {
    setSnapshot(null);
    setReport('');
    setReportError('');
    setPriceChoice('');
    setFilter('');
    setShown(20);
    setError('');
  };
  const safeError = (cause: unknown) =>
    (cause instanceof Error ? cause.message : 'Request failed.').replaceAll(
      key || '__no_key__',
      '[redacted]',
    );
  async function lookup(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const id = parseOfferId(input);
    if (!id) {
      fail(
        'Enter a positive offer ID or an HTTPS detail.1688.com/offer/ID.html product link.',
      );
      return;
    }
    if (validQuantity(quantity) === null) {
      fail('Enter a whole quantity from 1 to 9,999,999.');
      return;
    }
    if (!key.trim()) {
      fail(
        'Enter your Nexscope API key. It stays in this page until you clear it or leave.',
      );
      return;
    }
    resetResult();
    const request = new AbortController();
    controller.current = request;
    setBusy('query');
    try {
      const result = await runResearchApi(
        '1688-product-detail',
        { offerId: id },
        key,
        request.signal,
      );
      if (request.signal.aborted) return;
      const offer = normalizeOffer(result, id);
      if (!offer) {
        fail('No identifiable offer was returned. No AI analysis was started.');
        return;
      }
      setSnapshot({
        offer,
        collectedAt: new Date().toISOString(),
        demo: false,
      });
    } catch (cause) {
      if (isInsufficientCreditsError(cause)) showToolCreditModal('data');
      if (!request.signal.aborted) fail(safeError(cause));
    } finally {
      if (controller.current === request) {
        controller.current = null;
        setBusy('');
      }
    }
  }
  async function analyze() {
    if (busy || !snapshot || snapshot.demo) return;
    const count = validQuantity(quantity);
    if (count === null) {
      fail('Enter a whole quantity from 1 to 9,999,999.');
      return;
    }
    if (!key.trim()) {
      fail('Enter your Nexscope API key to request AI analysis.');
      return;
    }
    const request = new AbortController();
    controller.current = request;
    setBusy('report');
    setReport('');
    setReportError('');
    setError('');
    try {
      const markdown = await runResearchAnalysis(
        '1688-product-detail',
        detailEvidence(snapshot.offer, count, snapshot.collectedAt),
        key,
        request.signal,
      );
      if (!request.signal.aborted) setReport(markdown);
    } catch (cause) {
      if (isInsufficientCreditsError(cause)) showToolCreditModal('analysis');
      if (!request.signal.aborted) setReportError(safeError(cause));
    } finally {
      if (controller.current === request) {
        controller.current = null;
        setBusy('');
      }
    }
  }
  const offer = snapshot?.offer;
  const visibleRows =
    offer?.rows.filter((row) =>
      `${row.id} ${row.attributes}`
        .toLowerCase()
        .includes(filter.toLowerCase()),
    ) || [];
  const prices = offer
    ? [
        ...(offer.retail !== null
          ? [
              {
                id: 'product-retail',
                label: `Product one-piece price · CNY ${offer.retail}`,
                price: offer.retail,
                minimum: 1,
                retail: true,
              },
            ]
          : []),
        ...offer.tiers.map((t) => ({
          id: t.id,
          label: `Product tier: ${t.minimum}+ · CNY ${t.price}`,
          price: t.price,
          minimum: t.minimum,
          retail: false,
        })),
        ...offer.rows.flatMap((row, index) => [
          ...(row.wholesale !== null
            ? [
                {
                  id: `sku-${index}-wholesale`,
                  label: `SKU ${row.id}: wholesale · CNY ${row.wholesale}`,
                  price: row.wholesale,
                  minimum: 0,
                  retail: false,
                },
              ]
            : []),
          ...(row.retail !== null
            ? [
                {
                  id: `sku-${index}-retail`,
                  label: `SKU ${row.id}: one-piece · CNY ${row.retail}`,
                  price: row.retail,
                  minimum: 1,
                  retail: true,
                },
              ]
            : []),
        ]),
      ]
    : [];
  const chosen = prices.find((p) => p.id === priceChoice);
  const count = validQuantity(quantity);
  const subtotal =
    chosen && count !== null ? merchandiseSubtotal(chosen.price, count) : null;
  const wrongQuantity =
    chosen &&
    count !== null &&
    ((chosen.retail && count !== 1) ||
      count < chosen.minimum ||
      (offer?.minimum !== null &&
        offer?.minimum !== undefined &&
        count < offer.minimum));
  return (
    <section className={styles.workspace} aria-labelledby="workflow-title">
      <div className={styles.heading}>
        <span className="rt-kicker">ONE OFFER, REVIEWABLE EVIDENCE</span>
        <h2 id="workflow-title">Inspect before you source.</h2>
        <p>
          Query the listing first. Generate an AI report only when you choose.
        </p>
      </div>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={lookup}>
          <span className="rt-kicker">01 / YOUR OFFER</span>
          <h3>Look up a 1688 product</h3>
          <label htmlFor="detail-offer">Product link or offer ID</label>
          <input
            id="detail-offer"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              resetResult();
            }}
            disabled={!!busy}
            placeholder="https://detail.1688.com/offer/1234567890123.html"
            autoComplete="off"
            spellCheck={false}
            required
          />
          <label htmlFor="detail-quantity">Intended purchase quantity</label>
          <input
            id="detail-quantity"
            type="number"
            min="1"
            max="9999999"
            step="1"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setReport('');
              setReportError('');
            }}
            disabled={!!busy}
            required
          />
          <p className={styles.note}>
            For comparison and arithmetic only. Confirm the exact SKU, pack
            unit, MOQ and price tier with the supplier.
          </p>
          <div className={styles.labelRow}>
            <label htmlFor="detail-key">Your Nexscope API key</label>
            <a href={apiKeyUrl} target="_blank" rel="noopener noreferrer">
              Get a key ↗
            </a>
          </div>
          <div className={styles.keyInput}>
            <input
              id="detail-key"
              ref={keyInputRef}
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                saveStoredKey(e.target.value);
                setError('');
              }}
              disabled={!!busy}
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste your API key"
            />
            {key && (
              <button
                type="button"
                className={styles.clearKey}
                disabled={!!busy}
                aria-label="Clear API key"
                title="Clear API key"
                onClick={() => {
                  setKey('');
                  saveStoredKey('');
                  setError('');
                  keyInputRef.current?.focus();
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M6 18 18 6" />
                </svg>
              </button>
            )}
          </div>
          <p className={styles.note}>
            Saved in this browser&apos;s localStorage and shared with other
            Nexscope tools until cleared. Use a trusted device; requests are
            sent to api.nexscope.ai only after you start them.
          </p>
          <p className={styles.cost}>
            Lookup uses API credits. AI analysis is a separate request that may
            use additional credits.{' '}
            <a
              href="https://www.nexscope.ai/api-docs/1688-product-detail?view=api&co-from=learn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check current access and cost ↗
            </a>
          </p>
          <button className="rt-primary" type="submit" disabled={!!busy}>
            {busy === 'query'
              ? 'Looking up offer…'
              : 'Look up product · uses credits'}
          </button>
          <button
            className="rt-secondary"
            type="button"
            disabled={!!busy}
            onClick={() => {
              resetResult();
              setSnapshot({
                offer: normalizeOffer(exampleOffer, '1234567890123')!,
                collectedAt: new Date().toISOString(),
                demo: true,
              });
            }}
          >
            View an example · no API call
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
                  'Stopped waiting. The server may have processed or charged the request; check call history before retrying.',
                );
              }}
            >
              Stop waiting
            </button>
          )}
          {error && (
            <p
              className={styles.error}
              role="alert"
              tabIndex={-1}
              ref={errorRef}
            >
              {error}
            </p>
          )}
        </form>
        <div
          className={styles.results}
          aria-busy={busy === 'query'}
          aria-live="polite"
        >
          {!offer && (
            <div className={styles.empty}>
              <span className="rt-kicker">02 / SOURCE DATA</span>
              <h3>A clearer view of one offer.</h3>
              <p>
                Inspect SKU prices, minimums and shipping fields before
                generating an interpretation.
              </p>
              <ul>
                <li>Variant table with source identifiers</li>
                <li>Wholesale and single-piece prices kept separate</li>
                <li>Optional AI report and CSV export</li>
              </ul>
              <p className={styles.note}>
                No results are loaded automatically. Use the example to explore
                without a key.
              </p>
            </div>
          )}
          {offer && snapshot && (
            <>
              <div className={styles.summary}>
                <span className={styles.badge}>
                  {snapshot.demo
                    ? 'ILLUSTRATIVE EXAMPLE · NOT LIVE DATA'
                    : 'API SNAPSHOT'}
                </span>
                <h3>{offer.title}</h3>
                <p>
                  Offer {offer.offerId} · {offer.company}
                </p>
                <p className={styles.note}>
                  Collected {snapshot.collectedAt} ·{' '}
                  {snapshot.demo ? (
                    <span>Example ID — not a verified listing</span>
                  ) : (
                    <a
                      href={`https://detail.1688.com/offer/${offer.offerId}.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open source listing ↗
                    </a>
                  )}
                </p>
                <dl>
                  <div>
                    <dt>Minimum order</dt>
                    <dd>{offer.minimum ?? 'Not reported'}</dd>
                  </div>
                  <div>
                    <dt>Unit</dt>
                    <dd>{offer.unit}</dd>
                  </div>
                  <div>
                    <dt>Returned SKUs</dt>
                    <dd>{offer.returnedSkuCount}</dd>
                  </div>
                  <div>
                    <dt>Pricing model code</dt>
                    <dd>{offer.quoteType}</dd>
                  </div>
                </dl>
              </div>
              <div className={styles.section}>
                <h3>Listing and seller evidence</h3>
                <p className={styles.note}>
                  These are provider fields from the queried product, not a
                  supplier verification or current purchase quote.
                </p>
                <dl className={styles.factGrid}>
                  <div>
                    <dt>Category</dt>
                    <dd>{offer.category}</dd>
                  </div>
                  <div>
                    <dt>Listing status</dt>
                    <dd>{offer.status}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{offer.createdAt}</dd>
                  </div>
                  <div>
                    <dt>Reported stock</dt>
                    <dd>{offer.stock}</dd>
                  </div>
                  <div>
                    <dt>Reported sold units</dt>
                    <dd>{offer.soldOut}</dd>
                  </div>
                </dl>
                {!!offer.attributes.length && (
                  <details>
                    <summary>
                      Product attributes · {offer.attributes.length}
                    </summary>
                    <dl className={styles.factGrid}>
                      {offer.attributes.map((item, index) => (
                        <div key={`${item.name}-${index}`}>
                          <dt>{item.name || 'Unnamed attribute'}</dt>
                          <dd>{item.value || 'Not reported'}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
                <details>
                  <summary>View all returned API fields</summary>
                  <pre className={styles.rawData}>
                    {JSON.stringify(offer.sourceFields, null, 2)}
                  </pre>
                </details>
              </div>
              <div className={styles.section}>
                <div className={styles.toolbar}>
                  <h3>SKU evidence</h3>
                  <button
                    type="button"
                    className="rt-secondary"
                    onClick={() =>
                      download(
                        `1688-${offer.offerId}${snapshot.demo ? '-EXAMPLE' : ''}.csv`,
                        offerCsv(offer, snapshot.collectedAt),
                        'text/csv;charset=utf-8',
                      )
                    }
                  >
                    Export SKU CSV
                  </button>
                </div>
                <label htmlFor="detail-filter">
                  Filter SKU ID or attributes
                </label>
                <input
                  id="detail-filter"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setShown(20);
                  }}
                  placeholder="Color, size or SKU ID"
                />
                <p className={styles.note}>
                  CNY prices as reported. Wholesale prices do not establish the
                  applicable price for your quantity. Zero stock is preserved;
                  missing fields stay unreported.
                </p>
                {offer.returnedSkuCount > offer.rows.length && (
                  <p className={styles.note}>
                    Showing and exporting {offer.rows.length} of{' '}
                    {offer.returnedSkuCount} returned SKUs.
                  </p>
                )}
                <section
                  className={styles.tableWrap}
                  aria-label="SKU evidence table"
                  tabIndex={0}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>SKU ID</th>
                        <th>Attributes</th>
                        <th>Wholesale · CNY</th>
                        <th>One-piece · CNY</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.slice(0, shown).map((row, i) => (
                        <tr key={`${row.id}-${i}`}>
                          <td>{row.id}</td>
                          <td>{row.attributes}</td>
                          <td>{row.wholesale ?? 'Not reported'}</td>
                          <td>{row.retail ?? 'Not reported'}</td>
                          <td>{row.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
                {!visibleRows.length && (
                  <p>
                    {offer.rows.length
                      ? 'No SKUs match this filter.'
                      : 'No SKU rows were reported for this offer.'}
                  </p>
                )}
                {visibleRows.length > shown && (
                  <button
                    type="button"
                    className="rt-secondary"
                    onClick={() => setShown((n) => n + 20)}
                  >
                    Show 20 more SKUs
                  </button>
                )}
              </div>
              <div className={styles.section}>
                <h3>Price tiers and merchandise subtotal</h3>
                <p>
                  Choose a reported price yourself. This calculation does not
                  determine which tier applies.
                </p>
                <label htmlFor="detail-price">
                  Price to use for arithmetic
                </label>
                <select
                  id="detail-price"
                  value={priceChoice}
                  onChange={(e) => setPriceChoice(e.target.value)}
                >
                  <option value="">Choose a source price</option>
                  {prices.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {subtotal !== null && (
                  <p className={styles.subtotal}>
                    CNY {chosen?.price} × {count} ={' '}
                    <strong>CNY {subtotal}</strong>
                    <small>
                      Merchandise only; excludes freight, taxes, fees and
                      supplier confirmation.
                    </small>
                  </p>
                )}
                {wrongQuantity && (
                  <p className={styles.error}>
                    Your quantity conflicts with a reported minimum or the
                    selected single-piece price. This is arithmetic, not an
                    eligible order quote.
                  </p>
                )}
                <p className={styles.note}>
                  Pricing model code: 0 = product-quantity basis without SKUs; 1
                  = SKU-specification basis; 2 = SKUs with product-quantity
                  basis. Confirm unit and current terms before using a product
                  tier for a SKU.
                </p>
              </div>
              <div className={styles.section}>
                <h3>Shipping evidence</h3>
                {offer.shipping.length ? (
                  <section
                    className={styles.tableWrap}
                    aria-label="Shipping evidence table"
                    tabIndex={0}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Source field</th>
                          <th>Reported value</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offer.shipping.map((row, i) => (
                          <tr key={i}>
                            <td>{row.field}</td>
                            <td>{row.value}</td>
                            <td>{row.unit || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                ) : (
                  <p>No supported shipping fields were reported.</p>
                )}
                <p className={styles.note}>
                  Weight units differ by field. No international freight quote
                  or factory verification is implied.
                </p>
              </div>
              <div className={styles.section}>
                <span className="rt-kicker">
                  03 / OPTIONAL AI INTERPRETATION
                </span>
                <h3>Turn the evidence into a review checklist.</h3>
                <p>
                  The report uses up to 30 SKU rows, 30 tiers and 30 shipping
                  fields. It separates source facts, unknowns and follow-up
                  checks. Verify its interpretation against the tables.
                </p>
                <button
                  type="button"
                  className="rt-primary"
                  disabled={!!busy || snapshot.demo}
                  onClick={analyze}
                >
                  {busy === 'report'
                    ? 'Generating report…'
                    : 'Generate AI report · may use credits'}
                </button>
                {snapshot.demo && (
                  <p className={styles.note}>
                    AI analysis is disabled for this illustrative example. Query
                    a real offer first.
                  </p>
                )}
                <ResearchAnalysisReport
                  markdown={report}
                  loading={busy === 'report'}
                  error={reportError}
                  onRetry={analyze}
                />
                {report && (
                  <button
                    type="button"
                    className="rt-secondary"
                    onClick={() =>
                      download(
                        `1688-${offer.offerId}-report.md`,
                        `# 1688 offer analysis\n\nOffer: ${offer.offerId}\nCollected: ${snapshot.collectedAt}\nQuantity: ${quantity}\n\nAI interpretation; verify against source evidence.\n\n${report}`,
                        'text/markdown;charset=utf-8',
                      )
                    }
                  >
                    Download report
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
