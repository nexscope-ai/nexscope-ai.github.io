export type MarketNode = {
  code: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  role: string;
};

type MarketBase = Omit<MarketNode, 'role'>;

const GOOGLE_TRENDS_MARKETS: MarketBase[] = [
  {
    code: 'US',
    city: 'New York',
    region: 'United States',
    latitude: 40.71,
    longitude: -74.01,
  },
  {
    code: 'CA',
    city: 'Toronto',
    region: 'Canada',
    latitude: 43.65,
    longitude: -79.38,
  },
  {
    code: 'MX',
    city: 'Mexico City',
    region: 'Mexico',
    latitude: 19.43,
    longitude: -99.13,
  },
  {
    code: 'BR',
    city: 'São Paulo',
    region: 'Brazil',
    latitude: -23.55,
    longitude: -46.63,
  },
  {
    code: 'GB',
    city: 'London',
    region: 'United Kingdom',
    latitude: 51.51,
    longitude: -0.13,
  },
  {
    code: 'FR',
    city: 'Paris',
    region: 'France',
    latitude: 48.86,
    longitude: 2.35,
  },
  {
    code: 'ES',
    city: 'Madrid',
    region: 'Spain',
    latitude: 40.42,
    longitude: -3.7,
  },
  {
    code: 'NL',
    city: 'Amsterdam',
    region: 'Netherlands',
    latitude: 52.37,
    longitude: 4.9,
  },
  {
    code: 'DE',
    city: 'Berlin',
    region: 'Germany',
    latitude: 52.52,
    longitude: 13.41,
  },
  {
    code: 'IT',
    city: 'Milan',
    region: 'Italy',
    latitude: 45.46,
    longitude: 9.19,
  },
  {
    code: 'PL',
    city: 'Warsaw',
    region: 'Poland',
    latitude: 52.23,
    longitude: 21.01,
  },
  {
    code: 'SE',
    city: 'Stockholm',
    region: 'Sweden',
    latitude: 59.33,
    longitude: 18.07,
  },
  {
    code: 'TR',
    city: 'Istanbul',
    region: 'Turkey',
    latitude: 41.01,
    longitude: 28.98,
  },
  {
    code: 'AE',
    city: 'Dubai',
    region: 'United Arab Emirates',
    latitude: 25.2,
    longitude: 55.27,
  },
  {
    code: 'IN',
    city: 'Mumbai',
    region: 'India',
    latitude: 19.08,
    longitude: 72.88,
  },
  {
    code: 'SG',
    city: 'Singapore',
    region: 'Singapore',
    latitude: 1.35,
    longitude: 103.82,
  },
  {
    code: 'JP',
    city: 'Tokyo',
    region: 'Japan',
    latitude: 35.68,
    longitude: 139.69,
  },
  {
    code: 'AU',
    city: 'Sydney',
    region: 'Australia',
    latitude: -33.87,
    longitude: 151.21,
  },
];

function withRole(
  markets: MarketBase[],
  role: (market: MarketBase) => string,
): MarketNode[] {
  return markets.map((market) => ({ ...market, role: role(market) }));
}

export const globalSearchMarkets = withRole(
  GOOGLE_TRENDS_MARKETS,
  () => 'Verified search-demand region',
);

const AMAZON_CATALOG_MARKETS = new Set([
  'US',
  'GB',
  'DE',
  'IN',
  'CA',
  'FR',
  'IT',
  'ES',
  'MX',
  'JP',
]);
const AMAZON_DISCOVERY_MARKETS = new Set(['US', 'DE', 'JP']);

export const productDemandMarkets = withRole(
  GOOGLE_TRENDS_MARKETS,
  (market) => {
    if (AMAZON_DISCOVERY_MARKETS.has(market.code)) {
      return 'Discovery, catalog & Trends';
    }
    if (AMAZON_CATALOG_MARKETS.has(market.code)) {
      return 'Catalog, sales & Trends';
    }
    if (market.code === 'BR') return 'Price history & Trends';
    return 'Search-demand signal';
  },
);

export const shopifyFilterMarkets = withRole(
  GOOGLE_TRENDS_MARKETS,
  () => 'Country-code filter example',
);

export const searchVisibilityMarkets = withRole(
  GOOGLE_TRENDS_MARKETS,
  () => 'Google Trends region',
);

const AMAZON_REVIEW_MARKET_CODES = new Set([
  'US',
  'CA',
  'GB',
  'IN',
  'DE',
  'FR',
  'IT',
  'ES',
  'JP',
  'AU',
  'BR',
  'NL',
  'SE',
  'MX',
  'AE',
]);

export const amazonReviewMarkets = withRole(
  GOOGLE_TRENDS_MARKETS.filter((market) =>
    AMAZON_REVIEW_MARKET_CODES.has(market.code),
  ),
  (market) =>
    AMAZON_DISCOVERY_MARKETS.has(market.code)
      ? 'Product + niche reviews'
      : 'Product reviews',
);

const SOURCING_CONTEXT_CODES = new Set([
  'US',
  'CA',
  'MX',
  'BR',
  'GB',
  'DE',
  'FR',
  'ES',
  'AE',
  'SG',
  'JP',
  'AU',
]);

export const sourcingValidationMarkets = withRole(
  GOOGLE_TRENDS_MARKETS.filter((market) =>
    SOURCING_CONTEXT_CODES.has(market.code),
  ),
  () => 'Destination validation context',
);
