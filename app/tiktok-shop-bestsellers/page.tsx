/* oxlint-disable next/no-html-link-for-pages, next/no-img-element */
import type { Metadata } from 'next';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Layers3,
  MapPin,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing-header';
import LearnFooter from '@/components/learn-footer';
import snapshot from '@/lib/tiktok-shop-bestsellers-us.json';
import styles from './rankings.module.css';

const path = '/tiktok-shop-bestsellers/';
const title = 'TikTok Shop US Best Sellers This Week | Nexscope Learn';
const description =
  'See the top 10 TikTok Shop US products ranked by reported weekly units sold, with shop, price and estimated GMV.';
const apiUrl =
  'https://www.nexscope.ai/api-docs/tiktok-top-selling-products?co-from=learn&view=playground';
const integer = new Intl.NumberFormat('en-US');
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});
const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});
const shortDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const weekLabel = `${shortDate.format(new Date(snapshot.start))}–${shortDate.format(new Date(snapshot.end))}, ${snapshot.end.slice(0, 4)}`;
const products = snapshot.products;
const totalUnits = products.reduce((total, item) => total + item.units, 0);
const categories = new Map<string, number>();
for (const product of products)
  categories.set(product.category, (categories.get(product.category) ?? 0) + 1);
const [leadingCategory, leadingCategoryCount] = [...categories.entries()].sort(
  (a, b) => b[1] - a[1],
)[0];

function priceLabel(price: number, maxPrice: number) {
  return maxPrice > price
    ? `${usd.format(price)}–${usd.format(maxPrice)}`
    : usd.format(price);
}

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

export default function TikTokShopBestsellersPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: `https://learn.nexscope.ai${path}`,
    temporalCoverage: `${snapshot.start}/${snapshot.end}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
      })),
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />
      <MarketingHeader campaign="tiktok-shop-bestsellers" />
      <main className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/data/">Data APIs</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">TikTok Shop Best Sellers</span>
        </nav>
        <section className={styles.hero} aria-labelledby="rankings-title">
          <div className={styles.heroCopy}>
            <div className={styles.metadata}>
              <span>
                <MapPin size={15} aria-hidden="true" /> United States
              </span>
              <span>
                <CalendarDays size={15} aria-hidden="true" /> {weekLabel}
              </span>
            </div>
            <h1 id="rankings-title">
              TikTok Shop
              <br />
              <em>Best Sellers</em>
            </h1>
            <p>
              See which products sold the most on TikTok Shop US during the
              selected week.
            </p>
            <a href="#rankings" className={styles.heroLink}>
              View the top 10 <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <ol className={styles.podium} aria-label="Three leading products">
            {products.slice(0, 3).map((product, index) => (
              <li key={product.id}>
                <a
                  href={`#product-${product.id}`}
                  aria-label={`Rank ${index + 1}, ${product.name}`}
                >
                  <img src={product.image} alt="" width={240} height={240} />
                  <span className={styles.podiumRank}>#{index + 1}</span>
                  <span className={styles.podiumUnits}>
                    {compact.format(product.units)} <small>units</small>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.metrics} aria-label="Top ten summary">
          <div>
            <span>Units sold across the top 10</span>
            <strong>{integer.format(totalUnits)}</strong>
          </div>
          <div>
            <span>Leading category in the top 10</span>
            <strong>{leadingCategory}</strong>
          </div>
          <div>
            <span>Products in that category</span>
            <strong>
              {leadingCategoryCount} / {products.length}
            </strong>
          </div>
        </section>

        <section
          id="rankings"
          className={styles.rankings}
          aria-labelledby="rankings-heading"
        >
          <div className={styles.sectionHead}>
            <div>
              <h2 id="rankings-heading">The Top 10</h2>
              <p>Ranked by reported units sold during {weekLabel}.</p>
            </div>
            <a
              href={apiUrl}
              className={styles.textLink}
              data-track-tool="tiktok-top-selling-products"
            >
              Try the ranking API <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.tableFrame}>
            <table className={styles.table} aria-labelledby="rankings-heading">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col" aria-sort="descending">
                    Units sold <ArrowDown size={13} aria-hidden="true" />
                  </th>
                  <th scope="col">Est. GMV</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id} id={`product-${product.id}`}>
                    <td>
                      <span className={styles.rank}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <th scope="row" aria-label={product.name}>
                      <div className={styles.product}>
                        <img
                          src={product.image}
                          alt=""
                          width={62}
                          height={62}
                          loading="lazy"
                        />
                        <div>
                          <a
                            href={`https://www.tiktok.com/view/product/${product.id}`}
                          >
                            {product.name}
                          </a>
                          <small>
                            {product.shop} · {product.category}
                          </small>
                          <small className={styles.mobileStats}>
                            {priceLabel(product.price, product.maxPrice)} ·{' '}
                            {compactUsd.format(product.gmv)} est. GMV
                          </small>
                        </div>
                      </div>
                    </th>
                    <td>{priceLabel(product.price, product.maxPrice)}</td>
                    <td className={styles.units}>
                      {integer.format(product.units)}
                    </td>
                    <td>{compactUsd.format(product.gmv)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className={styles.method}>
            <summary>Data source and methodology</summary>
            <p>
              Source: FastMoss via the Nexscope TikTok Top Selling Products API.
              We requested the US market for week {snapshot.week} and ranked the
              returned products by reported weekly units sold. Prices reflect
              the returned listing prices, and estimated GMV covers the selected
              week. The summary covers the ten products shown.
            </p>
          </details>
        </section>

        <section className={styles.api} aria-labelledby="data-api-heading">
          <span className={styles.apiIcon}>
            <Layers3 size={24} aria-hidden="true" />
          </span>
          <div>
            <h2 id="data-api-heading">
              Research a different market or category
            </h2>
            <p>
              Choose another period, inspect a product, or pull rankings into
              your own workflow.
            </p>
          </div>
          <a
            className={styles.apiLink}
            href="/data/"
            data-track-tool="data-api-directory"
          >
            Browse Data APIs <ArrowRight size={17} aria-hidden="true" />
          </a>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
