type Props = {
  message: string;
  note?: string;
};

export default function ResearchEmptyState({ message, note }: Props) {
  return <output className="rt-data-empty" aria-live="polite">
    <span className="rt-data-empty-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.5 15.5 4.2 4.2M8.5 10.8h4.6" />
      </svg>
    </span>
    <div className="rt-data-empty-copy">
      <span className="rt-data-empty-label">No results</span>
      <h3>No data available</h3>
      <p>{message}</p>
      {note && <small>{note}</small>}
    </div>
  </output>;
}
