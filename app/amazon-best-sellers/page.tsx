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
import snapshot from '@/lib/amazon-us-home-kitchen-best-sellers.json';
import styles from '../tiktok-shop-bestsellers/rankings.module.css';

const path = '/amazon-best-sellers/';
const title = 'Amazon US Best Sellers in Home & Kitchen | Nexscope Learn';
const description =
  'Browse the top 10 products on Amazon’s US Home & Kitchen Best Sellers list, with ASINs, observed prices and ratings.';
const date = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
}).format(new Date(snapshot.date));
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const integer = new Intl.NumberFormat('en-US');

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

export default function AmazonBestSellersPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: 'https://learn.nexscope.ai' + path,
    temporalCoverage: snapshot.date,
    isBasedOn: snapshot.source,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: snapshot.products.length,
      itemListElement: snapshot.products.map((item) => ({
        '@type': 'ListItem',
        position: item.rank,
        name: item.name,
        url: 'https://www.amazon.com/dp/' + item.asin,
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
      <MarketingHeader campaign="amazon-best-sellers" />
      <main className={styles.wrap}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/data/">Data APIs</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Amazon Best Sellers</span>
        </nav>
        <section
          className={styles.hero}
          aria-labelledby="amazon-rankings-title"
        >
          <div className={styles.heroCopy}>
            <div className={styles.metadata}>
              <span>
                <MapPin size={15} aria-hidden="true" /> {snapshot.market}
              </span>
              <span>
                <CalendarDays size={15} aria-hidden="true" />{' '}
                <time dateTime={snapshot.date}>{date}</time>
              </span>
            </div>
            <h1 id="amazon-rankings-title">
              Amazon
              <br />
              <em>Best Sellers</em>
            </h1>
            <p>
              See the ten highest-ranked products on Amazon US in Home &amp;
              Kitchen, with observed prices and ratings.
            </p>
            <a href="#rankings" className={styles.heroLink}>
              View the top 10 <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <ol className={styles.podium} aria-label="Three leading products">
            {snapshot.products.slice(0, 3).map((item) => (
              <li key={item.asin}>
                <a
                  href={'#product-' + item.asin}
                  aria-label={'Rank ' + item.rank + ', ' + item.name}
                >
                  <img src={item.image} alt="" width={240} height={240} />
                  <span className={styles.podiumRank}>#{item.rank}</span>
                  <span className={styles.podiumUnits}>
                    {usd.format(item.price)}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
        <section
          id="rankings"
          className={styles.rankings}
          aria-labelledby="rankings-heading"
        >
          <div className={styles.sectionHead}>
            <div>
              <h2 id="rankings-heading">Home &amp; Kitchen Top 10</h2>
              <p>Amazon US category ranking observed on {date}.</p>
            </div>
            <a href={snapshot.source} className={styles.textLink}>
              See Amazon’s current ranking{' '}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.tableFrame}>
            <table className={styles.table} aria-labelledby="rankings-heading">
              <thead>
                <tr>
                  <th scope="col" aria-sort="ascending">
                    Rank
                  </th>
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Ratings</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.products.map((item) => (
                  <tr key={item.asin} id={'product-' + item.asin}>
                    <td>
                      <span className={styles.rank}>
                        {String(item.rank).padStart(2, '0')}
                      </span>
                    </td>
                    <th scope="row" aria-label={item.name}>
                      <div className={styles.product}>
                        <img
                          src={item.image}
                          alt=""
                          width={62}
                          height={62}
                          loading="lazy"
                        />
                        <div>
                          <a href={'https://www.amazon.com/dp/' + item.asin}>
                            {item.name}
                          </a>
                          <small>{item.asin}</small>
                          <small className={styles.mobileStats}>
                            {usd.format(item.price)} ·{' '}
                            {integer.format(item.ratings)} ratings
                          </small>
                        </div>
                      </div>
                    </th>
                    <td>{usd.format(item.price)}</td>
                    <td className={styles.units}>
                      {item.rating.toFixed(1)} / 5
                    </td>
                    <td>{integer.format(item.ratings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className={styles.method}>
            <summary>Source and ranking methodology</summary>
            <p>
              Positions are from Amazon’s public US Home &amp; Kitchen Best
              Sellers list. Amazon ranks listings using sales data. Prices and
              ratings are observations from {date} and can change. Amazon
              publishes rank positions here while unit sales are undisclosed.
            </p>
          </details>
        </section>
        <section className={styles.api} aria-labelledby="amazon-data-heading">
          <span className={styles.apiIcon}>
            <Layers3 size={24} aria-hidden="true" />
          </span>
          <div>
            <h2 id="amazon-data-heading">
              Research a product beyond the ranking
            </h2>
            <p>
              Look up ASINs and reviews, or check the{' '}
              <a className={styles.textLink} href="/tiktok-shop-bestsellers/">
                TikTok Shop weekly chart
              </a>
              .
            </p>
          </div>
          <a
            className={styles.apiLink}
            href="/data/amazon-front-data/"
            data-data-category="data-amazon-front-data"
            data-cta-placement="amazon-best-sellers"
          >
            Explore Amazon Data APIs <ArrowRight size={17} aria-hidden="true" />
          </a>
        </section>
      </main>
      <LearnFooter />
    </div>
  );
}
