'use client';

import { useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Database,
  ExternalLink,
  PlayCircle,
  Search,
  Sparkles,
} from 'lucide-react';

const NEXSCOPE_URL =
  'https://www.nexscope.ai/?utm_source=commerce-radar&utm_medium=content&utm_campaign=trend-insights';

const stories = [
  {
    id: '01',
    category: 'AI 电商',
    date: '2026.09.08',
    source: 'Mastercard',
    sourceUrl:
      'https://www.mastercard.com/global/en/news-and-trends/stories/2026/future-of-shopping-and-payments.html',
    title: 'AI Agent 正从“帮你选”走向“替你买”',
    summary:
      '支付网络开始为代理式交易建立信任、授权与安全边界。对卖家而言，商品数据是否结构化、可发现、可被 AI 准确理解，正在成为新的流量入口。',
    signal: '高增长信号',
    featured: true,
  },
  {
    id: '02',
    category: '行业报告',
    date: '2026.08.29',
    source: '中国网信网',
    sourceUrl: 'https://www.cac.gov.cn/2026-08/29/c_1789665114197079.htm',
    title: '新电商进入“数据 × 内容 × AI”深度融合期',
    summary:
      '《中国新电商发展报告（2026）》聚焦制度规范、多元业态与区域格局。热点不再只看声量，更要连接商品、市场与内容数据。',
    signal: '结构性机会',
  },
  {
    id: '03',
    category: 'AI 电商',
    date: '2026.03.24',
    source: 'OpenAI',
    sourceUrl: 'https://openai.com/index/powering-product-discovery-in-chatgpt/',
    title: '对话式商品发现，正在重写品牌的首屏',
    summary:
      '购物搜索变得更可视化、更有上下文。传统关键词排名之外，产品属性、评价信号与可信数据将共同影响 AI 推荐。',
    signal: '新流量入口',
  },
  {
    id: '04',
    category: '增长策略',
    date: '2026.01.11',
    source: 'Google',
    sourceUrl:
      'https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/',
    title: 'UCP 让商品更容易进入 AI 购物链路',
    summary:
      'Google 联合零售生态推出通用商业协议，商品发现、结账和售后将更容易被代理调用。卖家需要提前整理可供机器理解的数据资产。',
    signal: '基础设施',
  },
];

const filters = ['全部', 'AI 电商', '行业报告', '增长策略'];
const tickerItems = [
  'Agentic commerce',
  'AI-native product discovery',
  'Structured product data',
  'Social-first creative',
  'Marketplace intelligence',
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('全部');

  return (
    <main className="site-shell">
      <nav className="nav" aria-label="主导航">
        <div className="container nav-inner">
          <a className="brand" href="#top" aria-label="电商热点雷达首页">
            <span className="brand-mark">N</span>
            <span>电商热点雷达</span>
          </a>

          <div className="nav-links">
            <a href="#signals">趋势信号</a>
            <a href="#playbook">行动路径</a>
            <a href="#about">关于本页</a>
          </div>

          <a className="nav-cta" href={NEXSCOPE_URL} target="_blank" rel="noreferrer">
            去 Nexscope <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              2026 电商信号 / 第 37 周
            </p>
            <h1>
              热点很多。
              <br />
              <span className="highlight">机会</span>很少。
            </h1>
            <p className="hero-copy">
              我们把近期电商热点翻译成卖家真正能用的增长信号：发生了什么、为什么重要，以及下一步该验证什么。
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#signals">
                查看本周信号 <ArrowDownRight size={18} aria-hidden="true" />
              </a>
              <a className="text-link" href={NEXSCOPE_URL} target="_blank" rel="noreferrer">
                用真实电商数据验证 <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <aside className="signal-panel" aria-label="本周趋势信号强度">
            <div className="panel-top">
              <div className="panel-label">
                <span>Signal intensity</span>
                <BarChart3 size={17} aria-hidden="true" />
              </div>
              <div className="score">89</div>
              <p className="score-title">AI 购物代理成为本周最强电商变量</p>
            </div>
            <div className="panel-bottom">
              <p className="score-note">机会窗口：商品发现、结构化数据、对话式转化</p>
              <div className="meter" aria-label="信号强度 89%">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span key={index} className={index < 9 ? 'active' : ''} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </header>

      <div className="ticker" aria-label="热门话题">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span className="ticker-item" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="section" id="signals">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker">01 / 本周雷达</p>
              <h2 className="section-title">正在改变电商增长的 4 个信号</h2>
            </div>
            <p className="section-intro">
              不是所有热搜都值得追。以下信号同时满足三个条件：正在发生、影响交易链路、卖家现在就能行动。
            </p>
          </div>

          <div className="filter-row" role="group" aria-label="筛选趋势">
            {filters.map((filter) => (
              <button
                className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="stories-grid">
            {stories.map((story) => {
              const isVisible = activeFilter === '全部' || activeFilter === story.category;
              return (
                <article
                  className={`story-card ${story.featured ? 'featured' : ''} ${isVisible ? '' : 'hidden'}`}
                  key={story.id}
                >
                  <div className="card-meta">
                    <span>{story.category}</span>
                    <a
                      className="source-pill"
                      href={story.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`查看来源：${story.source}`}
                    >
                      {story.source} <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </div>
                  <div className="trend-number">{story.id}</div>
                  <h3>{story.title}</h3>
                  <p className="story-summary">{story.summary}</p>
                  <footer className="card-footer">
                    <span className="signal-tag">{story.signal}</span>
                    <a className="read-more" href={story.sourceUrl} target="_blank" rel="noreferrer">
                      {story.date} <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-dark" id="playbook">
        <div className="container">
          <div className="action-grid">
            <div className="action-copy">
              <p className="kicker">02 / 从热点到增长</p>
              <h2 className="section-title">看见趋势，只是第一步。</h2>
              <p>
                真正的机会需要用市场数据验证，再把洞察变成能投放、能转化的内容。Nexscope 把这条链路放进同一个工作流。
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <span className="step-number">01</span>
                <div>
                  <h3>发现机会</h3>
                  <p>从热点、类目与平台变化里找到值得继续研究的方向。</p>
                </div>
                <span className="step-icon"><Search size={18} aria-hidden="true" /></span>
              </div>
              <div className="step">
                <span className="step-number">02</span>
                <div>
                  <h3>验证需求</h3>
                  <p>连接 Amazon、TikTok Shop、Google Trends 等数据，判断需求与竞争。</p>
                </div>
                <span className="step-icon"><Database size={18} aria-hidden="true" /></span>
              </div>
              <div className="step">
                <span className="step-number">03</span>
                <div>
                  <h3>生成内容</h3>
                  <p>把产品素材转成适合社媒测试的 UGC 风格短视频。</p>
                </div>
                <span className="step-icon"><PlayCircle size={18} aria-hidden="true" /></span>
              </div>
            </div>
          </div>

          <div className="insight-strip" aria-label="Nexscope 能力概览">
            <div className="insight-stat">
              <strong>10+</strong>
              <span>覆盖主流电商与市场平台的数据入口</span>
            </div>
            <div className="insight-stat">
              <strong>Data + Creative</strong>
              <span>从选品研究、关键词洞察到 UGC 视频生成</span>
            </div>
            <div className="insight-stat">
              <strong>API · MCP</strong>
              <span>可接入 ChatGPT、Claude 与自有 AI 工作流</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="about">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <p className="kicker">Ready when you are</p>
              <h2>别猜下一个爆品。<br />让数据先说话。</h2>
              <p>
                使用 Nexscope 连接真实电商数据，研究产品、市场、竞品与关键词；找到机会后，继续生成可测试的电商创意。
              </p>
              <div className="cta-actions">
                <a className="button-dark" href={NEXSCOPE_URL} target="_blank" rel="noreferrer">
                  免费体验 Nexscope <ArrowRight size={18} aria-hidden="true" />
                </a>
                <a
                  className="mini-cta"
                  href="https://www.nexscope.ai/apis?utm_source=commerce-radar&utm_medium=content&utm_campaign=trend-insights"
                  target="_blank"
                  rel="noreferrer"
                >
                  查看数据能力 <Sparkles size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">N</span>
            <span>电商热点雷达</span>
          </a>
          <p className="footer-note">
            热点信息来自公开资料，仅用于趋势研判，不构成经营或投资建议。由 Nexscope 数据能力支持。
          </p>
        </div>
      </footer>
    </main>
  );
}
