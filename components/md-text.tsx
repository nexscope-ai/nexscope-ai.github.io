'use client';

// Adapted from web/src/components/chat/MdText.tsx so static tools render the
// same GFM tables, lists and inline formatting as the web app.
import { memo, useMemo } from 'react';
import ReactMarkdown, { defaultUrlTransform, type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Remove blank lines between Markdown table rows (common in generated reports). */
function normalizeTables(src: string): string {
  const lines = src.split('\n');
  const isTableLine = (line: string) => /^\s*\|.*\|\s*$/.test(line);
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (isTableLine(lines[i])) {
      let next = i + 1;
      while (next < lines.length && lines[next].trim() === '') next++;
      if (next < lines.length && isTableLine(lines[next])) i = next - 1;
    }
  }
  return out.join('\n');
}

function normalizeSkillReferences(src: string): string {
  return src.replace(/@\[([^\]]+)]\((skill:[^)]+)\)/g, '[@$1]($2)');
}

function transformUrl(url: string): string {
  return url.startsWith('skill:') ? url : defaultUrlTransform(url);
}

const REMARK_PLUGINS = [remarkGfm];

function buildComponents(inverted: boolean, documentMode = false): Components {
  const headStrong = inverted ? 'text-white' : 'text-slate-900';
  const subHead = inverted ? 'text-white/90' : 'text-slate-700';
  const linkCls = inverted
    ? 'text-white underline underline-offset-2 decoration-white/60 hover:decoration-white'
    : 'text-violet-600 underline underline-offset-2 hover:text-violet-700';
  const inlineCodeStyle = inverted
    ? { background: 'rgba(255,255,255,0.18)', color: '#fff' }
    : { background: '#F1F5F9', color: '#8B5CF6' };
  const blockquoteCls = inverted
    ? 'my-1 border-l-2 pl-3 text-white/80'
    : 'my-1 border-l-2 pl-3 text-slate-500';
  const blockquoteStyle = inverted
    ? { borderColor: 'rgba(255,255,255,0.5)' }
    : { borderColor: '#CBD5E1' };
  const hrCls = inverted ? 'my-2 border-white/30' : 'my-2 border-slate-200';
  const thCls = inverted
    ? 'border border-white/30 px-2 py-1 text-left font-semibold text-white'
    : 'border border-slate-200 px-2 py-1 text-left font-semibold text-slate-800';
  const thStyle = inverted
    ? { background: 'rgba(255,255,255,0.12)' }
    : { background: '#F8FAFC' };
  const tdCls = inverted
    ? 'border border-white/30 px-2 py-1 align-top'
    : 'border border-slate-200 px-2 py-1 align-top';

  return {
    h1: ({ children }) => (
      <h1 className={`${documentMode ? 'mb-3 mt-0 text-[20px] tracking-[-0.02em]' : 'mb-1 mt-2 text-[16px]'} font-bold ${headStrong}`}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className={`${documentMode ? 'mb-2 mt-6 text-[16px] tracking-[-0.015em] first:mt-0 lg:[column-span:all]' : 'mb-0.5 mt-2 text-[15px]'} font-bold ${headStrong}`}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className={`${documentMode ? 'mb-1.5 mt-5 break-after-avoid text-[13px] tracking-[-0.01em]' : 'mb-0.5 mt-1.5 text-[13px]'} font-semibold ${subHead}`}>{children}</h3>
    ),
    p: ({ children }) => <p className={documentMode ? 'text-[13px] leading-6' : 'leading-relaxed'}>{children}</p>,
    strong: ({ children }) => <strong className={`font-semibold ${headStrong}`}>{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => (
      <ul className={documentMode ? 'my-2 break-inside-avoid list-outside list-disc space-y-1 pl-5 marker:text-slate-300' : 'my-1 list-inside list-disc space-y-0.5'}>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className={documentMode ? 'my-2 break-inside-avoid list-outside list-decimal space-y-1 pl-5 marker:text-slate-400' : 'my-1 list-inside list-decimal space-y-0.5'}>{children}</ol>
    ),
    li: ({ children }) => <li className={documentMode ? 'pl-1 text-[13px] leading-6' : 'leading-relaxed'}>{children}</li>,
    a: ({ href, children }) => {
      if (href?.startsWith('skill:')) {
        const encodedId = href.slice('skill:'.length);
        let skillId = encodedId;
        try { skillId = decodeURIComponent(encodedId); } catch { /* Keep malformed legacy IDs unchanged. */ }
        const label = typeof children === 'string' ? children.replace(/^@/, '') : undefined;
        const skillCls = inverted
          ? 'inline-flex items-center rounded-md border border-white/25 bg-white/15 px-1.5 py-0.5 text-[12px] font-medium text-white no-underline'
          : 'inline-flex items-center rounded-md border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[12px] font-medium text-violet-700 no-underline hover:border-violet-300 hover:bg-violet-100';
        return <a href={`/seller/skills/${encodeURIComponent(skillId)}?mode=data`} aria-label={label} data-skill-reference={skillId} className={skillCls}>{children}</a>;
      }
      return <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{children}</a>;
    },
    code: ({ className, children, ...rest }) => {
      const isInline = !/language-/.test(className ?? '');
      if (isInline) return <code {...rest} className="px-1 py-0.5 rounded text-[12px]" style={inlineCodeStyle}>{children}</code>;
      return <code {...rest} className={`${className ?? ''} text-[12px]`}>{children}</code>;
    },
    pre: ({ children }) => <pre className="my-2 max-w-full overflow-x-auto rounded-lg p-3 text-[12px]" style={{ background: '#0F172A', color: '#E2E8F0' }}>{children}</pre>,
    blockquote: ({ children }) => <blockquote className={documentMode ? 'mb-5 max-w-3xl border-0 p-0 text-[14px] font-medium leading-6 text-slate-500 lg:[column-span:all]' : blockquoteCls} style={documentMode ? undefined : blockquoteStyle}>{children}</blockquote>,
    hr: () => <hr className={hrCls} />,
    table: ({ children }) => <div className="my-2 max-w-full overflow-x-auto"><table className="min-w-full border-collapse text-[13px]">{children}</table></div>,
    th: ({ children }) => <th className={thCls} style={thStyle}>{children}</th>,
    td: ({ children }) => <td className={tdCls}>{children}</td>,
  };
}

const COMPONENTS_NORMAL = buildComponents(false);
const COMPONENTS_INVERTED = buildComponents(true);
const COMPONENTS_DOCUMENT = buildComponents(false, true);

type DocumentSection = { title: string; body: string };

function splitDocumentSections(text: string): { intro: string; sections: DocumentSection[] } | null {
  const lines = text.split('\n');
  const intro: string[] = [];
  const sections: DocumentSection[] = [];
  let current: DocumentSection | null = null;
  for (const line of lines) {
    const heading = line.match(/^###\s+(.+?)\s*$/);
    if (heading) {
      if (current) sections.push({ ...current, body: current.body.trim() });
      current = { title: heading[1].trim(), body: '' };
      continue;
    }
    if (current) current.body += `${line}\n`;
    else intro.push(line);
  }
  if (current) sections.push({ ...current, body: current.body.trim() });
  return sections.length >= 2 ? { intro: intro.join('\n').trim(), sections } : null;
}

function MdTextInner({ text, inverted = false, variant = 'message' }: {
  text: string;
  inverted?: boolean;
  variant?: 'message' | 'document';
}) {
  const normalized = useMemo(() => normalizeSkillReferences(normalizeTables(text)), [text]);
  const documentSections = useMemo(
    () => variant === 'document' ? splitDocumentSections(normalized) : null,
    [normalized, variant],
  );
  if (!text) return null;
  if (documentSections) return (
    <div className="md-text skill-document w-full break-words text-slate-600 [overflow-wrap:anywhere]">
      {documentSections.intro ? <div className="mb-7 max-w-[880px] text-[14px] font-medium leading-6 text-slate-500 sm:mb-8">
        <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={COMPONENTS_DOCUMENT} urlTransform={transformUrl}>{documentSections.intro}</ReactMarkdown>
      </div> : null}
      <div data-testid="skill-document-grid" className="grid max-w-[920px] grid-cols-1 gap-y-8">
        {documentSections.sections.map((section, index) => <section key={`${section.title}-${index}`} className="min-w-0 border-t border-slate-200 pt-4">
          <h3 className="text-[14px] font-bold tracking-[-0.015em] text-slate-900">{section.title}</h3>
          <div className="mt-2"><ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={COMPONENTS_DOCUMENT} urlTransform={transformUrl}>{section.body}</ReactMarkdown></div>
        </section>)}
      </div>
    </div>
  );

  const rootCls = variant === 'document'
    ? 'md-text skill-document max-w-[820px] break-words text-slate-600 [overflow-wrap:anywhere]'
    : inverted
      ? 'md-text space-y-1 text-white leading-relaxed break-words [overflow-wrap:anywhere]'
      : 'md-text space-y-1 text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]';
  const components = variant === 'document' ? COMPONENTS_DOCUMENT : inverted ? COMPONENTS_INVERTED : COMPONENTS_NORMAL;
  return <div className={rootCls}><ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={components} urlTransform={transformUrl}>{normalized}</ReactMarkdown></div>;
}

const MdText = memo(MdTextInner);
export default MdText;
