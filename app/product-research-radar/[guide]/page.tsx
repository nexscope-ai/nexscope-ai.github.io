/* oxlint-disable next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import LearnFooter from '@/components/learn-footer';
import MarketingHeader from '@/components/marketing-header';
import { radarGuides } from '@/lib/radar-guides';
import {
  liveRadarUrl,
  radarGuidePath,
  radarPromotionPath,
  radarTitle,
} from '@/lib/radar-promotion';
import {
  DEFAULT_SOCIAL_IMAGE,
  NEXSCOPE_ORGANIZATION,
} from '@/lib/site-metadata';
import styles from '../radar-promotion.module.css';

type Props = { params: Promise<{ guide: string }> };

export function generateStaticParams() {
  return radarGuides.map(({ slug }) => ({ guide: slug }));
}

async function getGuide(params: Props['params']) {
  const { guide: slug } = await params;
  return radarGuides.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await getGuide(params);
  if (!guide) notFound();
  const path = radarGuidePath(guide.slug);
  const title = `${guide.title} | Nexscope Learn`;
  return {
    title,
    description: guide.description,
    keywords: guide.keywords,
    authors: [{ name: 'Nexscope', url: 'https://www.nexscope.ai/' }],
    alternates: { canonical: path },
    openGraph: {
      title,
      description: guide.description,
      type: 'article',
      url: path,
      publishedTime: guide.updated,
      modifiedTime: guide.updated,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: guide.description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}

const publishedDate = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export default async function RadarGuidePage({ params }: Props) {
  const guide = await getGuide(params);
  if (!guide) notFound();
  const url = `https://learn.nexscope.ai${radarGuidePath(guide.slug)}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updated,
    dateModified: guide.updated,
    author: NEXSCOPE_ORGANIZATION,
    publisher: NEXSCOPE_ORGANIZATION,
    mainEntityOfPage: url,
    inLanguage: 'en',
    citation: guide.sources.map((source) => source.href),
  };

  return (
    <div className={styles.page}>
      <MarketingHeader campaign={guide.slug} />
      <main id="main" className={styles.wrap}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(article).replaceAll('<', '\\u003c'),
          }}
        />
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <a href="/">Nexscope Learn</a>
          <span aria-hidden="true">/</span>
          <a href={radarPromotionPath}>{radarTitle}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{guide.topic}</span>
        </nav>
        <article className={styles.article}>
          <header className={styles.articleHero}>
            <p className={styles.topic}>
              {guide.topic} ·{' '}
              <time dateTime={guide.updated}>
                {publishedDate.format(new Date(guide.updated))}
              </time>
            </p>
            <h1>{guide.title}</h1>
            <p className={styles.lead}>{guide.summary}</p>
          </header>
          <div className={styles.articleLayout}>
            <nav className={styles.toc} aria-label="In this guide">
              <p>In this guide</p>
              <ol>
                {guide.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={styles.articleBody}>
              <section
                className={styles.takeaways}
                aria-labelledby="takeaways-title"
              >
                <h2 id="takeaways-title">Key takeaways</h2>
                <ul>
                  {guide.takeaways.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
              {guide.sections.map((section) => (
                <section key={section.id} id={section.id}>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.table && (
                    <div className={styles.tableWrap}>
                      <table>
                        <caption>{section.title}</caption>
                        <thead>
                          <tr>
                            {section.table.headers.map((header) => (
                              <th key={header} scope="col">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map(([label, ...cells]) => (
                            <tr key={label}>
                              <th scope="row">{label}</th>
                              {cells.map((cell, index) => (
                                <td key={section.table?.headers[index + 1]}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {section.checklist && (
                    <ul>
                      {section.checklist.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <section
                className={styles.articleCta}
                aria-labelledby="guide-next-step"
              >
                <h2 id="guide-next-step">Try the next step</h2>
                <a
                  className={styles.primary}
                  href={liveRadarUrl}
                  data-learn-action="open_radar_guide_tool"
                >
                  Open Product Research Radar{' '}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
                <a href={guide.nextStep.href}>{guide.nextStep.label}</a>
                <a href={`${radarPromotionPath}#guides`}>
                  Browse all Radar guides
                </a>
              </section>
              <section aria-labelledby="guide-sources">
                <h2 id="guide-sources">Sources</h2>
                <ul>
                  {guide.sources.map((source) => (
                    <li key={source.href}>
                      <a href={source.href}>{source.label}</a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
      </main>
      <LearnFooter />
    </div>
  );
}
