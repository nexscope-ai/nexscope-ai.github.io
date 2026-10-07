'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import { display, numeric, safeLink, type RecordValue } from '@/lib/research-tool-api';
import { quantityTiers, reportedPrice, supplierSignals } from '@/lib/research-result-format';
import ResearchSignalGrid from '@/components/research-signal-grid';

function count(value: unknown): string {
  const number = numeric(value);
  return number === null ? '—' : new Intl.NumberFormat('en-US').format(number);
}

export default function SupplierResultCard({ row, index }: { row: RecordValue; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const signals = supplierSignals(row);
  const tiers = quantityTiers(row.quantityPrices);
  const title = typeof row.title === 'string' && row.title.trim() ? row.title.trim() : 'Untitled listing';
  const id = typeof row.offerId === 'string' ? row.offerId.trim()
    : typeof row.offerId === 'number' && Number.isSafeInteger(row.offerId) ? String(row.offerId) : '';
  const listingUrl = safeLink(row.asinUrl) || (/^\d+$/.test(id) ? `https://detail.1688.com/offer/${id}.html` : null);
  const storeUrl = safeLink(row.shopUrl);
  const imageUrl = safeLink(row.imageUrl);
  const price = reportedPrice(row.price, row.currency) ?? '—';
  const minimumOrder = display(row.quantityBegin);
  const store = display(row.company);
  const detailSignals = [...signals.primary.filter(({ label }) => label === 'Dropship price' || label === 'Estimated sales (provider period)'), ...signals.details];
  const hasDetails = detailSignals.length > 0 || tiers.length > 0 || Boolean(listingUrl || storeUrl || id);

  return <li className={`rt-supplier-row${expanded ? ' is-expanded' : ''}`}>
    <div className="rt-supplier-identity">
      {imageUrl ? <Image src={imageUrl} alt="" width={64} height={64} unoptimized loading="lazy" referrerPolicy="no-referrer" /> : <div className="rt-supplier-image-placeholder" aria-hidden="true">No image</div>}
      <div><span className="rt-index">LISTING {index + 1}</span><h5>{title}</h5></div>
    </div>
    <div className="rt-supplier-cell rt-supplier-price"><span>Listed price</span><strong>{price}</strong></div>
    <div className="rt-supplier-cell"><span>Minimum order</span><strong>{minimumOrder === 'Not reported' ? '—' : minimumOrder}</strong></div>
    <div className="rt-supplier-cell"><span>Provider activity</span><strong>{count(row.salesOrderCount)} orders</strong><small>{count(row.salesQuantity)} units sold</small></div>
    <div className="rt-supplier-cell rt-supplier-store"><span>Store</span><strong>{store === 'Not reported' ? '—' : store}</strong></div>
    <div className="rt-supplier-action">{hasDetails && <button type="button" className="rt-secondary" aria-expanded={expanded} aria-controls={detailsId} onClick={() => setExpanded((value) => !value)}>{expanded ? 'Hide details' : 'View details'}</button>}</div>
    {hasDetails && <div className="rt-supplier-expanded" id={detailsId} hidden={!expanded}>
      {detailSignals.length > 0 && <section className="rt-signal-section"><h6>Additional listing signals</h6><ResearchSignalGrid items={detailSignals} /></section>}
      {tiers.length > 0 && <section className="rt-signal-section"><h6>Quantity price tiers</h6><div className="rt-tier-list">{tiers.map((tier, tierIndex) => <div key={`${tier.quantity}-${tierIndex}`}><span>{tier.quantity}</span><strong>{tier.price}</strong></div>)}</div></section>}
      <div className="rt-result-links">
        {listingUrl && <a href={listingUrl} target="_blank" rel="noopener noreferrer">Open 1688 listing ↗</a>}
        {storeUrl && <a href={storeUrl} target="_blank" rel="noopener noreferrer">Open store ↗</a>}
        {!listingUrl && id && <span>Offer ID: {display(id)}</span>}
      </div>
    </div>}
  </li>;
}
