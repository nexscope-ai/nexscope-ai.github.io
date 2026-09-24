'use client';
/* Native anchors keep the statically exported pages and Jekyll resources interoperable. */
/* oxlint-disable next/no-html-link-for-pages */

import { useMemo, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import styles from './home.module.css';

type Entry = {
  title: string;
  description: string;
  area: string;
  kind: 'Tool' | 'Guide' | 'Insight' | 'API evidence';
  href: string;
  path: string;
  boundary: string;
};

const entries: Entry[] = [
  { title: 'Free Amazon keyword research', description: 'Explore related Amazon keywords, search volume and competition before planning a listing update.', area: 'Product research', kind: 'Tool', href: 'https://www.nexscope.ai/tools/free-amazon-keyword-research-tool?co-from=learn', path: 'Keyword → related terms → listing questions', boundary: 'Search metrics are estimates; tool access and coverage may change.' },
  { title: 'Amazon competitor keyword research', description: 'Compare a seed keyword, competing products and selected ASIN keyword evidence.', area: 'Product research', kind: 'Guide', href: '/ecommerce-ai-tools/amazon-competitor-keyword-research/', path: 'Seed keyword → comparable ASINs → keyword gaps', boundary: 'Google metrics and Amazon marketplace metrics are not interchangeable.' },
  { title: 'Amazon review analyzer', description: 'Turn a bounded sample of low-star reviews into customer questions worth testing.', area: 'Product research', kind: 'Tool', href: 'https://www.nexscope.ai/tools/amazon-review-analyzer?co-from=learn', path: 'Reviews → recurring complaints → testable questions', boundary: 'A review sample cannot represent every customer or prove demand.' },
  { title: '1688 image search sourcing', description: 'Use a product photo to find candidate listings, then compare prices, MOQ and product details.', area: 'Sourcing', kind: 'Insight', href: '/ecommerce-ai-tools/ecommerce-trends/1688-image-search-sourcing/', path: 'Product photo → candidate offers → supplier checks', boundary: 'A visual match is not proof of manufacturer identity or supplier reliability.' },
  { title: '1688 Search By Image API test', description: 'Inspect a dated request, observed response and known limitations from an image-search test.', area: 'Sourcing', kind: 'API evidence', href: '/ecommerce-ai-tools/api-evidence/1688-image-search/', path: 'Test input → API response → interpretation', boundary: 'A single successful test does not guarantee identical results for every image.' },
  { title: 'Website SEO audit guide', description: 'Separate technical indexing checks from content relevance and AI-answer visibility.', area: 'SEO & visibility', kind: 'Guide', href: '/ecommerce-ai-tools/website-seo-audit-guide/', path: 'URL → audit findings → prioritized fixes', boundary: 'An audit identifies issues; it cannot guarantee rankings or citations.' },
  { title: 'AI referral traffic in GA4', description: 'Understand how AI referrals appear in analytics and where attribution can be incomplete.', area: 'SEO & visibility', kind: 'Guide', href: '/ecommerce-ai-tools/ai-referral-traffic-ga4/', path: 'Referral source → channel rules → reporting', boundary: 'A missing referral is not proof that no AI system mentioned a page.' },
  { title: 'Ecommerce MCP server', description: 'Connect agent workflows to ecommerce tools while keeping API credentials on the server.', area: 'Agents & APIs', kind: 'Guide', href: '/ecommerce-ai-tools/ecommerce-mcp-server/', path: 'Agent question → tool call → structured result', boundary: 'Review permissions, returned fields and costs before production use.' },
  { title: 'Ecommerce AI agents', description: 'Explore REST APIs, MCP tools and skills for research workflows built on commerce data.', area: 'Agents & APIs', kind: 'Tool', href: '/ecommerce-ai-agents/', path: 'Business question → data retrieval → agent answer', boundary: 'Agent outputs still need human review and source checking.' },
  { title: 'AI product video workflows', description: 'Turn approved product visuals into video concepts and assess the output before publishing.', area: 'Images & video', kind: 'Tool', href: '/ai-product-videos/', path: 'Product assets → video generation → review', boundary: 'Generation may introduce visual or claim inaccuracies.' },
  { title: 'AI video generator guide', description: 'Plan a product video from a clear brief, suitable assets and a review checklist.', area: 'Images & video', kind: 'Guide', href: '/ecommerce-ai-tools/ai-video-generator/', path: 'Brief → generation → quality review', boundary: 'Use assets you have rights to use and follow marketplace policies.' },
  { title: 'Amazon review API test', description: 'Review a documented request and observed review data from a Nexscope API test.', area: 'Product research', kind: 'API evidence', href: '/ecommerce-ai-tools/api-evidence/amazon-reviews-list/', path: 'Test input → returned reviews → limits', boundary: 'Observed data is tied to the tested request and time.' },
];

const areas = ['All scenarios', 'Product research', 'Sourcing', 'SEO & visibility', 'Agents & APIs', 'Images & video'];
const kinds = ['All sources', 'Tool', 'Guide', 'Insight', 'API evidence'];

export default function HomeLibrary() {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('All scenarios');
  const [kind, setKind] = useState('All sources');
  const [expandAll, setExpandAll] = useState(false);
  const filtered = useMemo(() => entries.filter((entry) =>
    (area === 'All scenarios' || entry.area === area) &&
    (kind === 'All sources' || entry.kind === kind) &&
    `${entry.title} ${entry.description} ${entry.area} ${entry.kind}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [query, area, kind]);
  const visibleAreas = areas.slice(1).filter((item) => filtered.some((entry) => entry.area === item));

  return (
    <section className={styles.librarySection} id="library" aria-labelledby="library-heading">
      <div className={styles.wrap}>
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>THE RESOURCE LIBRARY</p><h2 id="library-heading">See the task. Follow the workflow.</h2></div>
          <p>Each record points to an existing Nexscope page. The short path is a reading aid; check the linked source for details and limitations.</p>
        </div>
        <div className={styles.libraryControls}>
          <label className={styles.searchField}><Search size={18} aria-hidden="true" /><span className={styles.srOnly}>Search resources</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a tool, workflow or topic..." /></label>
          <label className={styles.selectField}><span className={styles.srOnly}>Scenario</span><select value={area} onChange={(event) => setArea(event.target.value)}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className={styles.selectField}><span className={styles.srOnly}>Source type</span><select value={kind} onChange={(event) => setKind(event.target.value)}>{kinds.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className={styles.libraryMeta}><span>Showing <strong>{filtered.length}</strong> / {entries.length} resources</span><label><input type="checkbox" checked={expandAll} onChange={(event) => setExpandAll(event.target.checked)} /> Show evidence notes</label></div>
        {visibleAreas.length === 0 && <p className={styles.empty}>No matching resources. Try another search or filter.</p>}
        {visibleAreas.map((item, areaIndex) => <div className={styles.libraryGroup} key={item}>
          <div className={styles.groupHead}><span>{String(areaIndex + 1).padStart(2, '0')}</span><h3>{item}</h3><span className={styles.groupCount}>{filtered.filter((entry) => entry.area === item).length} resources</span></div>
          <div className={styles.entryGrid}>{filtered.filter((entry) => entry.area === item).map((entry) => <article className={styles.entry} key={entry.title}>
            <div className={styles.entryTop}><span>NEXSCOPE</span><span className={styles.kind}>{entry.kind}</span></div>
            <h4>{entry.title}</h4><p>{entry.description}</p>
            <div className={styles.path}><span>WORKFLOW</span><strong>{entry.path}</strong></div>
            <div className={styles.entryActions}><a href={entry.href} data-track>Open resource <ArrowRight size={15} /></a><span>{entry.area}</span></div>
            {expandAll && <div className={styles.boundary}><b>Evidence & boundary</b><p>{entry.boundary}</p></div>}
            {!expandAll && <details className={styles.boundaryDisclosure}><summary>Evidence & boundary</summary><p>{entry.boundary}</p></details>}
          </article>)}</div>
        </div>)}
        <div className={styles.libraryMore}><a href="/ecommerce-ai-tools/">Browse the complete learning center <ArrowRight size={16} /></a></div>
      </div>
    </section>
  );
}
