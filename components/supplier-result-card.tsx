import Image from 'next/image';
import { display, safeLink, type RecordValue } from '@/lib/research-tool-api';
import { quantityTiers, reportedPrice, supplierSignals } from '@/lib/research-result-format';
import ResearchSignalGrid from '@/components/research-signal-grid';

export default function SupplierResultCard({ row, index }: { row: RecordValue; index: number }) {
  const signals = supplierSignals(row);
  const tiers = quantityTiers(row.quantityPrices);
  const title = typeof row.title === 'string' && row.title.trim() ? row.title.trim() : 'Untitled listing';
  const id = typeof row.offerId === 'string' ? row.offerId.trim()
    : typeof row.offerId === 'number' && Number.isSafeInteger(row.offerId) ? String(row.offerId) : '';
  const listingUrl = safeLink(row.asinUrl) || (/^\d+$/.test(id) ? `https://detail.1688.com/offer/${id}.html` : null);
  const storeUrl = safeLink(row.shopUrl);
  const imageUrl = safeLink(row.imageUrl);
  const more = signals.details.length + tiers.length;

  return <article className="rt-item rt-supplier-item">
    <span className="rt-index">1688 LISTING {index + 1}</span>
    <div className={`rt-supplier-top${imageUrl ? ' has-image' : ''}`}>
      {imageUrl && <Image src={imageUrl} alt="" width={78} height={78} unoptimized loading="lazy" referrerPolicy="no-referrer" />}
      <div><h5>{title}</h5><p className="rt-price-value">{reportedPrice(row.price, row.currency) ?? 'Price not reported'}</p></div>
    </div>
    <ResearchSignalGrid items={signals.primary} />
    {more > 0 && <details className="rt-details"><summary>View {more} more listing details</summary>
      {tiers.length > 0 && <section className="rt-signal-section"><h6>Quantity price tiers</h6><div className="rt-tier-list">{tiers.map((tier, tierIndex) => <div key={`${tier.quantity}-${tierIndex}`}><span>{tier.quantity}</span><strong>{tier.price}</strong></div>)}</div></section>}
      {signals.details.length > 0 && <section className="rt-signal-section"><h6>Listing and fulfillment</h6><ResearchSignalGrid items={signals.details} /></section>}
    </details>}
    <div className="rt-result-links">
      {listingUrl && <a href={listingUrl} target="_blank" rel="noopener noreferrer">Open 1688 listing ↗</a>}
      {storeUrl && <a href={storeUrl} target="_blank" rel="noopener noreferrer">Open store ↗</a>}
    </div>
    {!listingUrl && id && <p className="rt-note">Offer ID: {display(id)}</p>}
  </article>;
}
