import gradientTitle from '@/app/gradient-title.module.css';

export default function ApiCatalogHero({
  title,
  description,
  size,
  catalog,
  example,
}: {
  title: string;
  description: string;
  size: string;
  catalog: string;
  example?: { slug: string; label: string; placement: string };
}) {
  return (
    <>
      <link rel="stylesheet" href="/api-catalog.css" precedence="default" />
      <section className="catalog-hero" aria-labelledby="catalog-title">
        <div>
          <h1 id="catalog-title">
            <span className={gradientTitle.text}>{title}</span> APIs
          </h1>
          <p className="catalog-description">{description}</p>
          <p className="catalog-size">{size}</p>
        </div>
        <aside className="catalog-trial" aria-label="API trial">
          <p>
            <strong>1,000 free credits</strong> for new accounts
          </p>
          <p>
            Valid for 3 days.{' '}
            <a
              href="https://www.nexscope.ai/pricing?co-from=learn"
              data-cta-placement={`${catalog}-hero-free-trial`}
            >
              Trial details
            </a>
          </p>
          {example && (
            <a
              href={`https://www.nexscope.ai/api-docs/${example.slug}?view=playground&co-from=learn`}
              data-track-tool={example.slug}
              data-cta-placement={example.placement}
            >
              {example.label} ↗
            </a>
          )}
        </aside>
      </section>
    </>
  );
}
