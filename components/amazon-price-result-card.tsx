import Image from 'next/image';
import ResearchSignalGrid from '@/components/research-signal-grid';
import { display, pick, safeLink, type RecordValue } from '@/lib/research-tool-api';
import {
  amazonBullets, amazonDescription, amazonSignals, amazonSpecifications,
  amazonVariants, reportedPrice,
} from '@/lib/research-result-format';

export default function AmazonPriceResultCard({ product }: { product: RecordValue }) {
  const title = typeof product.title === 'string' && product.title.trim() ? product.title.trim() : 'Untitled Amazon listing';
  const signals = amazonSignals(product);
  const bullets = amazonBullets(product);
  const specs = amazonSpecifications(product);
  const description = amazonDescription(product);
  const variants = amazonVariants(product);
  const reviewSummary = typeof product.reviewsSummary === 'string' && product.reviewsSummary.trim()
    ? product.reviewsSummary.trim().slice(0, 1600) : null;
  const delivery = typeof product.delivery === 'string' && product.delivery.trim() ? product.delivery.trim() : null;
  const imageUrls = [product.imageUrl, product.thumbnail, ...(Array.isArray(product.productImageUrls) ? product.productImageUrls : [])]
    .map(safeLink).filter((url): url is string => Boolean(url));
  const images = [...new Set(imageUrls)].slice(0, 5);
  const link = safeLink(pick(product, 'asinUrl', 'linkClean', 'link'));
  const hasDetails = bullets.length + specs.length + variants.length + signals.specifications.length
    + signals.reviewDistribution.length + Number(Boolean(description)) + Number(Boolean(reviewSummary)) + Math.max(images.length - 1, 0) > 0;

  return <article className="rt-item rt-amazon-item">
    <span className="rt-index">AMAZON PRODUCT · {display(product.asin)}</span>
    <div className={`rt-amazon-top${images.length ? ' has-image' : ''}`}>
      {images[0] && <Image src={images[0]} alt={title} width={110} height={110} unoptimized loading="lazy" referrerPolicy="no-referrer" />}
      <div>
        {typeof product.brand === 'string' && product.brand.trim() && <span className="rt-product-brand">{product.brand.trim()}</span>}
        <h5>{title}</h5>
        <p className="rt-price-value">{reportedPrice(pick(product, 'extractedPrice', 'price'), product.currency) ?? 'Price not reported'}</p>
      </div>
    </div>
    {signals.promotions.length > 0 && <div className="rt-promotion-box"><ResearchSignalGrid items={signals.promotions} /></div>}
    <ResearchSignalGrid items={signals.primary} />
    {delivery && <p className="rt-delivery"><strong>Delivery:</strong> {delivery}</p>}
    {hasDetails && <details className="rt-details"><summary>View product details and review signals</summary>
      {bullets.length > 0 && <section className="rt-signal-section"><h6>Product highlights</h6><ul className="rt-product-bullets">{bullets.map((bullet, index) => <li key={`${index}-${bullet.slice(0, 20)}`}>{bullet}</li>)}</ul></section>}
      {description && <section className="rt-signal-section"><h6>Description</h6><p className="rt-product-copy">{description}</p></section>}
      {(signals.specifications.length > 0 || specs.length > 0) && <section className="rt-signal-section"><h6>Specifications</h6><ResearchSignalGrid items={[...signals.specifications, ...specs]} /></section>}
      {(signals.reviewDistribution.length > 0 || reviewSummary) && <section className="rt-signal-section"><h6>Review context</h6><ResearchSignalGrid items={signals.reviewDistribution} />{reviewSummary && <p className="rt-product-copy">{reviewSummary}</p>}</section>}
      {variants.length > 0 && <section className="rt-signal-section"><h6>Reported variants</h6>{variants.map((group, index) => <p className="rt-product-copy" key={`${group.title}-${index}`}><strong>{group.title}:</strong> {group.items.join(' · ')}</p>)}</section>}
      {images.length > 1 && <section className="rt-signal-section"><h6>Product images</h6><div className="rt-product-gallery">{images.slice(1).map((url, index) => <Image src={url} alt={`${title} view ${index + 2}`} width={74} height={74} unoptimized loading="lazy" referrerPolicy="no-referrer" key={url} />)}</div></section>}
    </details>}
    <p className="rt-note">Listing data is a snapshot, not a guaranteed checkout price. Seller, promotions and delivery location can change the offer.</p>
    {link && <div className="rt-result-links"><a href={link} target="_blank" rel="noopener noreferrer">Open Amazon listing ↗</a></div>}
  </article>;
}
