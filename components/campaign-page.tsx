/* Campaign links cross independently exported static sections. */
/* oxlint-disable next/no-html-link-for-pages, next/no-img-element, next/no-css-tags */
import type { Campaign } from '@/lib/campaigns';
import { CampaignEvidence } from '@/components/campaign-evidence';

function CampaignVisual({ campaign }: { campaign: Campaign }) {
  if (campaign.visual === 'amazon') {
    return (
      <div className="panel">
        <div className="panelhead"><span>AMAZON RESEARCH BRIEF</span><span className="dots">● ● ●</span></div>
        <div className="panelbody">
          <span className="label">Start with a buyer question</span>
          <div className="query">What do shoppers want from a travel mug?</div>
          {[
            ['Search intent', 'Relevant terms · demand · seasonality'],
            ['Competitor visibility', 'ASIN keywords · organic vs. paid'],
            ['Customer questions', 'Fit · cleaning · everyday use'],
          ].map(([title, detail], index) => (
            <div className="signal" key={title}>
              <span className="marker">0{index + 1}</span>
              <div><strong>{title}</strong><small>{detail}</small></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (campaign.visual === 'agents') {
    return (
      <div className="panel codepanel">
        <div className="panelhead"><span>NEXSCOPE / DEVELOPER WORKFLOW</span><span className="dots">● ● ●</span></div>
        <div className="panelbody">
          <span className="label">Example request body</span>
          <div className="query">amazon-keyword-expansion</div>
          <pre>{'{\n  '}<span className="codeaccent">&quot;marketplace&quot;</span>{': "us",\n  '}<span className="codeaccent">&quot;searchTerms&quot;</span>{': "travel mug",\n  '}<span className="codeaccent">&quot;needCount&quot;</span>{': 10\n}'}</pre>
          <div className="pipeline"><span>Question</span><span>API data</span><span>Analysis</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="films">
      {campaign.videoImages?.map((image, index) => (
        <div className="film" key={image.src}>
          <img src={image.src} width="360" height="560" alt={image.alt}
            fetchPriority={campaign.slug === 'ai-video-generator' && index === 0 ? 'high' : undefined} />
          <span>{image.label}</span>
        </div>
      ))}
    </div>
  );
}

function GeneratorExtra({ campaign }: { campaign: Campaign }) {
  if (campaign.slug !== 'ai-video-generator') return null;
  return (
    <>
      <section className="campaign-section">
        <span className="campaign-eyebrow">Give the model a clear brief</span>
        <h2>A product video prompt worth starting with.</h2>
        <div className="card">
          <p>“Slowly push the camera toward the product on a warm, neutral studio surface. Use soft side lighting. Keep the product centered and finish with a steady close-up of its main detail.”</p>
          <p className="micro">A prompt idea—not a guarantee of output. Add details specific to your uploaded image.</p>
        </div>
        <div className="cards">
          <article className="card"><h3>Specify one movement</h3><p>Start with a slow push-in or gentle orbit. A focused direction is easier to evaluate than several competing actions.</p></article>
          <article className="card"><h3>Keep the setting intentional</h3><p>Name the surface, lighting and background. Choose a scene that makes the product easy to understand.</p></article>
          <article className="card"><h3>Check before publishing</h3><p>Inspect packaging text, logos, product geometry and claims. Generative video can introduce details that were not in your source image.</p></article>
        </div>
      </section>
      <section className="workflow">
        <div><span className="campaign-eyebrow">Choose for your task</span><h2>Find a model that fits your first take.</h2></div>
        <div>
          <p>Nexscope&apos;s tool currently lists models including Seedance, Kling, Wan and MiniMax. Available duration, resolution, reference inputs and credit estimates vary by selection.</p>
          <p>Compare suitable models with the same photo and prompt. Judge product fidelity, motion and framing—not just the model name. Check the live generator for current options.</p>
          <a data-track="" href={campaign.cta.href}>Compare options in the generator ↗</a>
        </div>
      </section>
    </>
  );
}

function CampaignSchema({ campaign }: { campaign: Campaign }) {
  const url = `https://learn.nexscope.ai/${campaign.slug}/`;
  const about = campaign.slug === 'ecommerce-ai-agents'
    ? [
        { '@type': 'Thing', name: 'Ecommerce APIs' },
        { '@type': 'Thing', name: 'Model Context Protocol' },
        { '@type': 'Thing', name: 'AI agents' },
        { '@type': 'Thing', name: 'Marketplace research' },
      ]
    : campaign.slug === 'amazon-research'
      ? [
          { '@type': 'Thing', name: 'Amazon product research' },
          { '@type': 'Thing', name: 'Competitor keyword research' },
          { '@type': 'Thing', name: 'Customer review analysis' },
        ]
      : [{ '@type': 'Thing', name: 'AI product video generation' }];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: campaign.title,
        description: campaign.description,
        inLanguage: 'en',
        about,
        isPartOf: { '@id': 'https://learn.nexscope.ai/#website' },
        publisher: { '@id': 'https://www.nexscope.ai/#organization' },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        url: `${url}#faq`,
        mainEntity: campaign.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
      ...(campaign.slug === 'ai-video-generator'
        ? [{
            '@type': 'SoftwareApplication',
            '@id': 'https://www.nexscope.ai/tools/ai-video-generator#software',
            name: 'Nexscope AI Video Generator',
            url: 'https://www.nexscope.ai/tools/ai-video-generator',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web browser',
          }]
        : []),
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replaceAll('<', '\\u003c') }} />;
}

export function CampaignPage({ campaign }: { campaign: Campaign }) {
  const generator = campaign.slug === 'ai-video-generator';
  return (
    <>
      <link rel="stylesheet" href="/campaigns.css?v=3" />
      <script src="/campaigns.js?v=2" defer />
      <CampaignSchema campaign={campaign} />
      <div className={`campaign-page${campaign.visual === 'video' ? ' video' : ''}`}>
        <a className="skip" href="#main">Skip to content</a>
        <header>
          <div className="wrap campaign-nav">
            <a href="/" aria-label="Nexscope home"><img className="logo" src="/logo.png" width="165" height="32" alt="Nexscope" /></a>
            <nav className="navlinks" aria-label="Primary navigation">
              <a href="/tools/">Tools</a>
              <a href="/ecommerce-ai-tools/">Learn</a>
              <a data-track="" href="https://www.nexscope.ai/api-docs?co-from=githubIO">API docs ↗</a>
            </nav>
          </div>
        </header>
        <main id="main" className="wrap">
          <section className="campaign-hero">
            <div>
              <span className="campaign-eyebrow">{campaign.audience}</span>
              <h1>{campaign.headline}</h1>
              <p className="lead">{campaign.lead}</p>
              <a className="button" data-track="" href={campaign.cta.href}>{campaign.cta.label}</a>
              <p className="micro">{campaign.ctaNote}</p>
            </div>
            <div className="visual">
              <CampaignVisual campaign={campaign} />
              <p className="caption">{campaign.visualCaption}</p>
            </div>
          </section>
          <div className="strip"><b>{generator ? 'Start with a product image' : 'Built for ecommerce work'}</b>{campaign.strip.map((item) => <span key={item}>{item}</span>)}</div>
          <CampaignEvidence slug={campaign.slug} />
          <section className="campaign-section">
            <span className="campaign-eyebrow">{campaign.section.eyebrow}</span>
            <h2>{campaign.section.title}</h2>
            <p className="intro">{campaign.section.intro}</p>
            <div className="cards">
              {campaign.section.cards.map((card) => (
                <article className="card" key={card.title}>
                  {card.number && <span className="num">{card.number}</span>}
                  <h3>{card.title}</h3><p>{card.text}</p>
                  {card.tag && <span className="api">{card.tag}</span>}
                </article>
              ))}
            </div>
          </section>
          <section id={campaign.workflow.id} className="workflow">
            <div>
              <span className="campaign-eyebrow">{campaign.workflow.eyebrow}</span>
              <h2>{campaign.workflow.title}</h2>
              {campaign.workflow.intro && <p className="intro">{campaign.workflow.intro}</p>}
              {campaign.workflow.cta && <a className="button" data-track="" href={campaign.cta.href}>{campaign.workflow.cta}</a>}
            </div>
            <ol className="steps">
              {campaign.workflow.steps.map((step) => <li key={step.title}><b>{step.title}</b><span>{step.text}</span></li>)}
            </ol>
          </section>
          <GeneratorExtra campaign={campaign} />
          <section id="faq" className="campaign-section faq">
            <h2>{generator ? 'AI video generator FAQ' : 'A few things to know.'}</h2>
            {campaign.faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </section>
          <section className="closing">
            <h2>{campaign.closing.title}</h2>
            <p>{campaign.closing.text}</p>
            {campaign.closing.resource && <p>{campaign.closing.resource.prefix}<a href={campaign.closing.resource.href}>{campaign.closing.resource.label}</a></p>}
            <a className="button" data-track="" href={campaign.cta.href}>{campaign.cta.label}</a>
            {campaign.closing.note && <p className="micro">{campaign.closing.note}</p>}
          </section>
        </main>
        <footer>
          <div className="wrap">
            <div className="foot">
              <span>© 2026 Nexscope · {generator ? 'Product research' : 'Commerce research'} &amp; creative tools{campaign.footerExtra && <> · <a href={campaign.footerExtra.href}>{campaign.footerExtra.label}</a></>}</span>
              <div className="footlinks">
                <a href="/">Nexscope home</a>
                <a href="/tools/">Tools</a>
                <a href="/ecommerce-ai-tools/">Learn</a>
                {generator && campaign.footerExtra && <a href={campaign.footerExtra.href}>{campaign.footerExtra.label}</a>}
                <a href="https://www.nexscope.ai/privacy">Privacy</a>
                <a href="https://www.nexscope.ai/terms">Terms</a>
              </div>
            </div>
            <p className="disclosure">{campaign.footerDisclosure ?? 'Some Nexscope links include referral tracking; the referrer may receive a commission if you make a purchase. Product availability and terms are determined by Nexscope.'}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
