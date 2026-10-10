'use client';

import MdText from '@/components/md-text';

type Props = {
  markdown: string;
  loading: boolean;
  error: string;
  onRetry?: () => void;
  kicker?: string;
};

export default function ResearchAnalysisReport({ markdown, loading, error, onRetry, kicker = '03 / AI INTERPRETATION' }: Props) {
  if (!markdown && !loading && !error) return null;
  return <section className="rt-analysis-report" aria-labelledby="rt-analysis-title" aria-busy={loading}>
    <div className="rt-analysis-head"><div><span className="rt-kicker">{kicker}</span><h3 id="rt-analysis-title">Analysis report</h3></div><span>{loading ? 'Generating' : markdown ? 'Ready' : 'Unavailable'}</span></div>
    <p className="rt-note">Generated from the returned API sample. Verify recommendations against the source data and current market conditions.</p>
    {loading && <output className="rt-loading" aria-live="polite"><p>Source data is ready. Generating a Markdown report…</p><div className="rt-skeleton" /><div className="rt-skeleton short" /><div className="rt-skeleton" /></output>}
    {!loading && markdown && <div className="rt-analysis-markdown"><MdText text={markdown} variant="document" /></div>}
    {!loading && error && <div className="rt-analysis-failure" role="alert"><p>{error}</p>{onRetry && <button className="rt-secondary" type="button" onClick={onRetry}>Retry AI analysis · may use credits</button>}</div>}
  </section>;
}
