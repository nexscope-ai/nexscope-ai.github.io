import { geoEqualEarth, geoGraticule10, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import landData from 'world-atlas/land-110m.json';
import type { MarketNode } from '@/lib/guides';

type TrendMapProps = {
  title: string;
  summary: string;
  badge: string;
  disclaimer: string;
  nodes: MarketNode[];
};

const width = 920;
const height = 450;

export function TrendMap({
  title,
  summary,
  badge,
  disclaimer,
  nodes,
}: TrendMapProps) {
  const topology = landData as {
    type: 'Topology';
    objects: { land: unknown };
  };
  const land = feature(topology as never, topology.objects.land as never);
  const sphere = { type: 'Sphere' } as const;
  const projection = geoEqualEarth().fitExtent(
    [
      [22, 22],
      [width - 22, height - 22],
    ],
    sphere,
  );
  const path = geoPath(projection);
  const graticule = geoGraticule10();

  return (
    <div className="trend-map-card">
      <div className="trend-map-head">
        <div>
          <p className="kicker">02 / Market lens</p>
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
        <span>{badge}</span>
      </div>

      <div className="trend-map-visual">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          aria-labelledby="market-map-title market-map-description"
        >
          <title id="market-map-title">{title}</title>
          <desc id="market-map-description">
            {summary} Regions shown:{' '}
            {nodes.map((node) => node.region).join(', ')}.
          </desc>
          <path className="map-ocean" d={path(sphere) ?? undefined} />
          <path className="map-grid" d={path(graticule) ?? undefined} />
          <path className="map-country" d={path(land as never) ?? undefined} />
          {nodes.map((node, index) => {
            const point = projection([node.longitude, node.latitude]);
            if (!point) return null;
            return (
              <g
                className="map-marker"
                transform={`translate(${point[0]} ${point[1]})`}
                key={`${node.code}-${node.role}`}
              >
                <circle className="map-marker-ring" r="13" />
                <circle className="map-marker-core" r="5" />
                <text x="11" y={index % 2 === 0 ? -11 : 20}>
                  {node.code}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="market-node-grid">
        {nodes.map((node) => (
          <div key={`${node.code}-${node.region}`}>
            <span>{node.code}</span>
            <p>
              <strong>{node.region}</strong>
              {node.city}
            </p>
            <small>{node.role}</small>
          </div>
        ))}
      </div>

      <p className="map-disclaimer">{disclaimer}</p>
    </div>
  );
}
