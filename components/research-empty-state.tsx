type Props = {
  message: string;
  note?: string;
};

export default function ResearchEmptyState({ message, note }: Props) {
  return <output className="rt-data-empty" aria-live="polite">
    <div className="rt-data-empty-count" aria-hidden="true"><strong>0</strong><span>RESULTS</span></div>
    <div className="rt-data-empty-copy">
      <span className="rt-kicker">NO SOURCE DATA</span>
      <h3>No data available</h3>
      <p>{message}</p>
      {note && <small>{note}</small>}
    </div>
  </output>;
}
