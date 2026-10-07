import { display, type RecordValue } from '@/lib/research-tool-api';
import { nicheSignals, type Signal } from '@/lib/research-result-format';
import ResearchSignalGrid from '@/components/research-signal-grid';

function SignalSection({ title, items }: { title: string; items: Signal[] }) {
  if (!items.length) return null;
  return <section className="rt-signal-section"><h6>{title}</h6><ResearchSignalGrid items={items} /></section>;
}

export default function NicheResultCard({ row, index, market }: { row: RecordValue; index: number; market: string }) {
  const groups = nicheSignals(row, market);
  const title = typeof row.nicheTitle === 'string' && row.nicheTitle.trim() ? row.nicheTitle.trim() : 'Unnamed niche';
  const translation = typeof row.translationZh === 'string' && row.translationZh.trim() ? row.translationZh.trim() : null;
  const more = groups.demand.length + groups.competition.length + groups.entry.length;

  return <article className="rt-item rt-niche-item">
    <span className="rt-index">NICHE {index + 1}</span>
    <h5>{title}</h5>
    {translation && translation !== title && <p className="rt-note">{translation}</p>}
    <ResearchSignalGrid items={groups.primary} />
    {more > 0 && <details className="rt-details"><summary>View {more} more market signals</summary>
      <SignalSection title="Search demand and conversion" items={groups.demand} />
      <SignalSection title="Price and competition" items={groups.competition} />
      <SignalSection title="Launch and economics" items={groups.entry} />
      {row.nicheId != null && <p className="rt-note">Niche ID: {display(row.nicheId)}</p>}
    </details>}
  </article>;
}
