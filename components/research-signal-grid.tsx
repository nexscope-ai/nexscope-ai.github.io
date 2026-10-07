import type { Signal } from '@/lib/research-result-format';

export default function ResearchSignalGrid({ items }: { items: Signal[] }) {
  if (!items.length) return null;
  return <div className="rt-metrics">{items.map(({ label, value }, index) => <div className="rt-metric" key={`${label}-${index}`}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}
