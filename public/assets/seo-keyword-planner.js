(function (root, factory) {
  const planner = factory();
  if (typeof module === 'object' && module.exports) module.exports = planner;
  if (root) root.NexscopeSeoPlanner = planner;
  if (typeof document !== 'undefined') planner.mount();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const API_BASE = 'https://api.nexscope.ai/api/skill-api/v1/skills';
  const ALLOWED_SKILLS = new Set(['seo-keyword-expand', 'seo-keyword-metrics', 'amazon-competitor-lookup']);
  const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  function record(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function normalizeSeed(value) {
    return String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
  }

  function validateSeed(value) {
    const seed = normalizeSeed(value);
    if (!seed) return 'Enter an English product or topic.';
    if (Array.from(seed).length > 80 || seed.split(' ').length > 10) return 'Use 1–10 words and at most 80 characters.';
    const letters = Array.from(seed.matchAll(/\p{L}/gu), match => match[0]);
    if (!letters.length || letters.some(letter => !/[A-Za-z]/.test(letter))) return 'Use an English product or topic.';
    return '';
  }

  function metric(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
  }

  function safeHttpsUrl(value) {
    if (typeof value !== 'string') return '';
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch {
      return '';
    }
  }

  function keywordItems(seed, expanded, measured) {
    const words = [seed];
    for (const value of Array.isArray(record(expanded).items) ? expanded.items : []) {
      const word = record(value).keyword;
      if (typeof word !== 'string') continue;
      const trimmed = word.trim();
      if (!trimmed || Array.from(trimmed).length > 80 || words.some(item => item.toLowerCase() === trimmed.toLowerCase())) continue;
      words.push(trimmed);
      if (words.length === 10) break;
    }
    const byKeyword = new Map();
    for (const value of Array.isArray(record(measured).items) ? measured.items : []) {
      const row = record(value);
      const key = String(row.normalizedKeyword || row.inputKeyword || '').toLowerCase();
      if (key) byKeyword.set(key, row);
    }
    return words.map(keyword => {
      const row = byKeyword.get(keyword.toLowerCase());
      return {
        keyword,
        searchVolume: metric(row?.searchVolume),
        keywordDifficulty: metric(row?.keywordDifficulty),
        source: keyword === seed ? 'seed' : 'expanded',
      };
    });
  }

  function parseCompetitors(value) {
    let data = record(value);
    for (let depth = 0; depth < 4 && !Array.isArray(data.products); depth++) {
      const next = data.data ?? data.result;
      if (!next || typeof next !== 'object') break;
      data = record(next);
    }
    if (!Array.isArray(data.products)) throw new Error('No readable competitor data was returned. AI analysis was not started.');
    const seen = new Set();
    return data.products.flatMap(value => {
      const row = record(value);
      const asin = typeof row.asin === 'string' ? row.asin.toUpperCase() : '';
      if (!/^[A-Z0-9]{10}$/.test(asin) || seen.has(asin)) return [];
      seen.add(asin);
      return [{
        asin,
        title: typeof row.title === 'string' ? row.title.slice(0, 300) : '',
        brand: typeof row.brand === 'string' ? row.brand.slice(0, 100) : '',
        imageUrl: safeHttpsUrl(row.imageUrl),
        currency: /^[A-Z]{3}$/.test(row.currency) ? row.currency : 'USD',
        price: metric(row.price),
        monthlySalesUnits: metric(row.monthlySalesUnits),
        monthlySalesRevenue: metric(row.monthlySalesRevenue),
        rating: metric(row.rating),
        ratings: metric(row.ratings),
        bsr: metric(row.bsr),
      }];
    }).slice(0, 10);
  }

  function csv(items) {
    const cell = value => {
      let content = String(value ?? '');
      if (/^\s*[=+@-]/.test(content) || /^[\t\r\n]/.test(content)) content = `'${content}`;
      return `"${content.replace(/"/g, '""')}"`;
    };
    return '\uFEFF' + [
      ['keyword', 'search_volume_estimate', 'keyword_difficulty'],
      ...items.map(item => [item.keyword, item.searchVolume, item.keywordDifficulty]),
    ].map(row => row.map(cell).join(',')).join('\r\n');
  }

  function analysisPayload(result) {
    return {
      language: 'English',
      rawData: {
        marketplace: 'US', keyword: result.keyword, collectedAt: result.collectedAt,
        sampleSize: result.products.length, products: result.products,
        scope: 'Returned Amazon product sample only. Missing values are unknown. Sales are provider estimates; Google keyword metrics are not Amazon search volume. Product descriptions and review text were not retrieved.',
      },
    };
  }

  function reportMarkdown(result, report) {
    return `# Amazon competitor research: ${result.keyword}\n\nMarketplace: US\nCollected: ${result.collectedAt}\nSample: ${result.products.length} products\n\n${report}\n\nBased on a returned product sample. Sales are provider estimates. Validate AI conclusions against the source products.\n`;
  }

  function extractAnalysis(value) {
    let data = record(value);
    for (let depth = 0; depth < 4; depth++) {
      if (typeof data.analysis === 'string' && data.analysis.trim()) return data.analysis.trim();
      const next = data.data ?? data.result;
      if (!next || typeof next !== 'object') break;
      data = record(next);
    }
    throw new Error('No report was returned. Your competitor products remain available; retry analysis without fetching them again.');
  }

  async function callSkill(fetcher, slug, action, body, key, options = {}) {
    if (!ALLOWED_SKILLS.has(slug) || !['run', 'analyze'].includes(action) || (action === 'analyze' && slug !== 'amazon-competitor-lookup')) {
      throw new Error('Unsupported API workflow.');
    }
    if (!key || !key.trim()) throw new Error('Enter your API key first.');
    const response = await fetcher(`${API_BASE}/${slug}/${action}`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${key.trim()}` },
      body: JSON.stringify(body), credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal: options.signal,
    });
    if (response.status === 401) throw new Error('The API key was rejected. Check the key and try again.');
    if (response.status === 402) throw insufficientCreditsError();
    if (response.status === 403) throw new Error('This API key does not have access to the requested skill.');
    if (response.status === 429) throw new Error('The API rate limit was reached. Wait before trying again.');
    let envelope;
    try { envelope = record(await response.json()); }
    catch { throw new Error('The API returned an unreadable response. Check usage before retrying.'); }
    const code = envelope.code === null || envelope.code === undefined || envelope.code === '' ? Number.NaN : Number(envelope.code);
    const data = record(envelope.data);
    if (!response.ok || ![0, 200].includes(code) || envelope.success === false || data.success === false || envelope.error || data.error) {
      if ([13011, 16002, 17001, 18001, 440215, -40002].includes(code)) throw insufficientCreditsError();
      if ([12001, 12003, 12204].includes(code)) throw new Error('The API key was rejected. Check the key and try again.');
      throw new Error(`The API request could not be completed (HTTP ${response.status}, code ${Number.isFinite(code) ? code : 'unknown'}). Check usage before retrying.`);
    }
    const status = String(data.status || '').toUpperCase();
    if (status && !['SUCCESS', 'PARTIAL', 'EMPTY', 'SUCCEEDED', 'COMPLETED', 'DONE'].includes(status)) {
      throw new Error(`The API task is ${status.toLowerCase()}. Its final result or charge is not confirmed; check usage before starting another request.`);
    }
    if (data.errcode != null && ![0, 200].includes(Number(data.errcode))) {
      throw new Error(`The data provider did not complete this request (code ${String(data.errcode)}).`);
    }
    return data;
  }

  function insufficientCreditsError() {
    const error = new Error('Insufficient Data credits. Add credits to continue.');
    error.name = 'InsufficientCreditsError';
    return error;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function append(parent, ...children) {
    for (const child of children) if (child) parent.appendChild(child);
    return parent;
  }

  function download(content, type, filename) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = element('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function formatNumber(value) {
    return value === null ? 'Unavailable' : numberFormatter.format(value);
  }

  function formatMoney(value, currency) {
    return value === null ? 'Unavailable' : `${currency} ${formatNumber(value)}`;
  }

  function skeleton(label) {
    const box = element('div', 'seo-skeleton');
    box.setAttribute('role', 'status');
    box.setAttribute('aria-label', label);
    append(box, element('span'), element('span'), element('span'));
    box.appendChild(element('p', '', label));
    return box;
  }

  function mount() {
    const root = document.querySelector('[data-seo-planner]');
    if (!root || root.dataset.mounted === 'true') return;
    root.dataset.mounted = 'true';
    const form = root.querySelector('[data-seo-form]');
    const topicInput = form.elements.namedItem('topic');
    const markdownUnmounts = new Set();
    const keyInput = form.elements.namedItem('apiKey');
    window.NexscopeToolApiKeySession?.bind(keyInput);
    const topicError = root.querySelector('[data-error-for="topic"]');
    const keyError = root.querySelector('[data-error-for="apiKey"]');
    const submit = root.querySelector('[data-seo-research]');
    const status = root.querySelector('[data-seo-status]');
    const resultState = root.querySelector('[data-seo-result-state]');
    const results = root.querySelector('[data-seo-results]');
    const reportRoot = root.querySelector('[data-seo-report]');
    const state = { research: null, selected: '', competitors: new Map(), reports: new Map(), busy: '', error: '', errorStage: '', generation: 0 };

    function setStatus(message, isError = false) {
      status.textContent = message;
      status.classList.toggle('seo-status-error', isError);
    }

    function clearFieldErrors() {
      topicError.textContent = '';
      keyError.textContent = '';
      topicInput.removeAttribute('aria-invalid');
      keyInput.removeAttribute('aria-invalid');
    }

    function fieldError(input, node, message) {
      node.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      input.focus({ preventScroll: true });
    }

    function busy(phase) {
      state.busy = phase;
      topicInput.disabled = Boolean(phase);
      keyInput.disabled = Boolean(phase);
      submit.disabled = Boolean(phase);
      submit.textContent = phase === 'expand' ? 'Expanding keywords…' : phase === 'metrics' ? 'Checking Google metrics…' : 'Find keyword opportunities ↗';
      root.setAttribute('aria-busy', phase ? 'true' : 'false');
      resultState.textContent = phase ? 'Loading…' : state.research ? 'Results ready' : 'No research yet';
      render();
    }

    function actionError(message, stage) {
      state.error = message;
      state.errorStage = stage;
      setStatus(message, true);
      render();
    }

    function renderProduct(product) {
      const card = element('article', 'seo-product');
      if (product.imageUrl) {
        const image = element('img', 'seo-product-image');
        image.src = product.imageUrl;
        image.alt = '';
        image.loading = 'lazy';
        image.referrerPolicy = 'no-referrer';
        card.appendChild(image);
      }
      const body = element('div', 'seo-product-body');
      const link = element('a', 'seo-product-title', product.title || product.asin);
      link.href = `https://www.amazon.com/dp/${product.asin}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const identity = element('p', 'seo-muted', [product.brand, product.asin].filter(Boolean).join(' · '));
      const metrics = element('dl', 'seo-product-metrics');
      const fields = [
        ['Price', formatMoney(product.price, product.currency)],
        ['Monthly units (est.)', formatNumber(product.monthlySalesUnits)],
        ['Monthly revenue (est.)', formatMoney(product.monthlySalesRevenue, product.currency)],
        ['Rating', formatNumber(product.rating)], ['Reviews', formatNumber(product.ratings)], ['BSR', formatNumber(product.bsr)],
      ];
      for (const [label, value] of fields) append(metrics, append(element('div'), element('dt', '', label), element('dd', '', value)));
      append(body, link, identity, metrics);
      return append(card, body);
    }

    function render() {
      markdownUnmounts.forEach(unmount => unmount());
      markdownUnmounts.clear();
      results.replaceChildren();
      reportRoot.replaceChildren();
      if (!state.research) {
        if (state.busy) results.appendChild(skeleton(state.busy === 'metrics' ? 'Checking Google keyword metrics…' : 'Expanding your topic…'));
        else results.appendChild(append(element('div', 'seo-empty'), element('span', '', '✦'), element('h4', '', 'Begin with one product topic.'), element('p', '', 'Keywords and competitor products appear here as you request them. The optional AI report appears below this workspace.')));
        return;
      }
      const research = state.research;
      const heading = append(element('div', 'seo-result-section-head'),
        append(element('div'), element('span', 'seo-step', 'STEP 1 / GOOGLE KEYWORDS'), element('h4', '', `${research.items.length} keyword candidates`)),
      );
      const exportButton = element('button', 'seo-button seo-button-light', 'Download CSV ↓');
      exportButton.type = 'button';
      exportButton.disabled = Boolean(state.busy);
      exportButton.addEventListener('click', () => download(csv(research.items), 'text/csv;charset=utf-8', 'seo-keywords.csv'));
      heading.appendChild(exportButton);
      results.appendChild(heading);
      results.appendChild(element('p', 'seo-muted', `Topic: ${research.seed} · Google US/English · Missing metrics mean unavailable, not zero.`));
      if (research.partial) results.appendChild(element('p', 'seo-notice', 'The provider returned partial or empty coverage. Available values are shown below.'));
      const tableWrap = element('div', 'seo-table-wrap');
      const table = element('table', 'seo-keyword-table');
      const thead = element('thead');
      const header = element('tr');
      for (const label of ['Keyword', 'Google volume (est.)', 'Difficulty']) header.appendChild(element('th', '', label));
      thead.appendChild(header);
      const tbody = element('tbody');
      for (const item of research.items) {
        const row = element('tr');
        append(row, element('td', '', item.keyword), element('td', '', formatNumber(item.searchVolume)), element('td', '', formatNumber(item.keywordDifficulty)));
        tbody.appendChild(row);
      }
      append(table, thead, tbody);
      tableWrap.appendChild(table);
      results.appendChild(tableWrap);

      const competitorSection = element('section', 'seo-stage');
      append(competitorSection, element('span', 'seo-step', 'STEP 2 / AMAZON US'), element('h4', '', 'Choose a keyword to investigate'), element('p', 'seo-muted', 'This separate request returns up to 10 Amazon US products. Google volume is not Amazon search volume.'));
      const picker = element('div', 'seo-keyword-picker');
      picker.setAttribute('role', 'group');
      picker.setAttribute('aria-label', 'Keyword to research on Amazon');
      for (const item of research.items) {
        const button = element('button', 'seo-keyword-choice', item.keyword);
        button.type = 'button';
        button.disabled = Boolean(state.busy);
        button.setAttribute('aria-pressed', String(state.selected === item.keyword));
        button.addEventListener('click', () => { state.selected = item.keyword; state.error = ''; state.errorStage = ''; setStatus(''); render(); });
        picker.appendChild(button);
      }
      competitorSection.appendChild(picker);
      const cached = state.competitors.get(state.selected);
      const lookup = element('button', 'seo-button seo-button-primary', cached ? 'Competitors loaded' : state.busy === 'competitors' ? 'Finding Amazon competitors…' : 'Find Amazon competitors ↗');
      lookup.type = 'button';
      lookup.disabled = Boolean(state.busy || cached);
      lookup.addEventListener('click', lookupCompetitors);
      competitorSection.appendChild(lookup);
      if (state.busy === 'competitors') competitorSection.appendChild(skeleton('Finding Amazon competitor products…'));
      if (state.error && state.errorStage === 'competitors') competitorSection.appendChild(element('p', 'seo-action-error', state.error));
      results.appendChild(competitorSection);
      if (!cached) return;
      const productSection = element('section', 'seo-stage');
      append(productSection, element('span', 'seo-step', 'COMPETITOR SAMPLE'), element('h4', '', `${cached.products.length} returned products`), element('p', 'seo-muted', 'Provider sales and revenue are estimates. This sample is not the whole market. Open source listings to verify relevance.'));
      if (!cached.products.length) productSection.appendChild(element('p', 'seo-notice', 'No matching products were returned. Select another keyword. AI analysis is unavailable for an empty sample.'));
      else {
        const list = element('div', 'seo-product-list');
        cached.products.forEach(product => list.appendChild(renderProduct(product)));
        productSection.appendChild(list);
      }
      results.appendChild(productSection);
      if (!cached.products.length) return;

      const reportSection = element('section', 'seo-card seo-report-panel');
      append(reportSection, element('span', 'seo-step', 'STEP 3 / OPTIONAL AI REPORT'), element('h3', '', 'Interpret the competitor sample'), element('p', 'seo-muted', 'This is another request that may use credits. The report uses the returned products only—not reviews, a website audit or the entire market.'));
      const report = state.reports.get(state.selected);
      const analyzeButton = element('button', 'seo-button seo-button-primary', report ? 'Report generated' : state.busy === 'analyze' ? 'Analyzing competitors…' : 'Generate competitor report ↗');
      analyzeButton.type = 'button';
      analyzeButton.disabled = Boolean(state.busy || report);
      analyzeButton.addEventListener('click', analyze);
      reportSection.appendChild(analyzeButton);
      if (state.busy === 'analyze') reportSection.appendChild(skeleton('Generating an AI competitor report…'));
      if (state.error && state.errorStage === 'analyze') reportSection.appendChild(element('p', 'seo-action-error', state.error));
      if (report) {
        const content = element('div', 'seo-report');
        const markdownContainer = element('div', 'seo-report-markdown');
        content.appendChild(markdownContainer);
        const unmount = globalThis.NexscopeToolMarkdown?.render(markdownContainer, report);
        if (unmount) markdownUnmounts.add(unmount);
        else markdownContainer.textContent = report;
        const reportButton = element('button', 'seo-button seo-button-light', 'Download Markdown ↓');
        reportButton.type = 'button';
        reportButton.addEventListener('click', () => download(reportMarkdown(cached, report), 'text/markdown;charset=utf-8', 'amazon-competitor-report.md'));
        append(content, reportButton, element('p', 'seo-muted', 'Validate the AI conclusions against the source products before making decisions.'));
        reportSection.appendChild(content);
      }
      reportRoot.appendChild(reportSection);
    }

    async function request(slug, action, body) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      try { return await callSkill(fetch, slug, action, body, keyInput.value, { signal: controller.signal }); }
      catch (error) {
        if (error?.name === 'InsufficientCreditsError') {
          window.dispatchEvent(new CustomEvent('nexscope:insufficient-credits', { detail: { stage: action === 'analyze' ? 'analysis' : 'data' } }));
        }
        if (error?.name === 'AbortError') throw new Error('The request timed out. The provider may still be processing it; check usage before retrying.');
        if (error instanceof TypeError) throw new Error('Could not reach the Nexscope API. Check the network and usage before retrying.');
        throw error;
      } finally { clearTimeout(timeout); }
    }

    async function runResearch(event) {
      event.preventDefault();
      if (state.busy) return;
      clearFieldErrors();
      const seed = normalizeSeed(topicInput.value);
      const topicProblem = validateSeed(seed);
      if (topicProblem) return fieldError(topicInput, topicError, topicProblem);
      if (!keyInput.value.trim()) return fieldError(keyInput, keyError, 'Enter your Nexscope API key.');
      const requestId = ++state.generation;
      state.research = null;
      state.selected = '';
      state.competitors.clear();
      state.reports.clear();
      state.error = '';
      state.errorStage = '';
      setStatus('Expanding your topic…');
      busy('expand');
      try {
        const expanded = await request('seo-keyword-expand', 'run', {
          idempotencyKey: crypto.randomUUID(), market: 'US', language: 'en', keyword: seed, limit: 10, sources: ['suggestions', 'related'],
        });
        if (requestId !== state.generation) return;
        busy('metrics');
        setStatus('Checking Google keyword metrics…');
        const expandedResult = record(expanded.result);
        const words = keywordItems(seed, expandedResult, {} ).map(item => item.keyword);
        const measured = await request('seo-keyword-metrics', 'run', {
          idempotencyKey: crypto.randomUUID(), market: 'US', language: 'en', keywords: words,
        });
        if (requestId !== state.generation) return;
        state.research = {
          seed, collectedAt: new Date().toISOString(),
          partial: !['SUCCESS', 'SUCCEEDED', 'COMPLETED', 'DONE'].includes(String(expanded.status || '').toUpperCase()) || !['SUCCESS', 'SUCCEEDED', 'COMPLETED', 'DONE'].includes(String(measured.status || '').toUpperCase()),
          items: keywordItems(seed, expandedResult, record(measured.result)),
        };
        state.selected = state.research.items[0].keyword;
        setStatus('Keyword research is ready. Choose a keyword before requesting Amazon data.');
      } catch (error) {
        if (requestId === state.generation) actionError(error instanceof Error ? error.message : 'Keyword research failed. Check usage before retrying.', 'research');
      } finally { if (requestId === state.generation) busy(''); }
    }

    async function lookupCompetitors() {
      if (state.busy || !state.research || !state.selected || state.competitors.has(state.selected)) return;
      const keyword = state.selected;
      const requestId = ++state.generation;
      state.error = '';
      state.errorStage = '';
      setStatus(`Finding Amazon US competitors for “${keyword}”…`);
      busy('competitors');
      try {
        const response = await request('amazon-competitor-lookup', 'run', { marketplace: 'US', keyword, matchType: 1, page: 1, size: 10 });
        if (requestId !== state.generation) return;
        const result = { keyword, collectedAt: new Date().toISOString(), products: parseCompetitors(response) };
        state.competitors.set(keyword, result);
        setStatus(`${result.products.length} Amazon products loaded. AI analysis has not started.`);
      } catch (error) {
        if (requestId === state.generation) actionError(error instanceof Error ? error.message : 'Competitor lookup failed. Check usage before retrying.', 'competitors');
      } finally { if (requestId === state.generation) busy(''); }
    }

    async function analyze() {
      const result = state.competitors.get(state.selected);
      if (state.busy || !result?.products.length || state.reports.has(state.selected)) return;
      const keyword = state.selected;
      const requestId = ++state.generation;
      state.error = '';
      state.errorStage = '';
      setStatus(`Analyzing the competitor sample for “${keyword}”…`);
      busy('analyze');
      try {
        const response = await request('amazon-competitor-lookup', 'analyze', analysisPayload(result));
        if (requestId !== state.generation) return;
        state.reports.set(keyword, extractAnalysis(response));
        setStatus('The competitor report is ready. Verify conclusions against source products.');
      } catch (error) {
        if (requestId === state.generation) actionError(error instanceof Error ? error.message : 'AI analysis failed. Your competitor products remain available.', 'analyze');
      } finally { if (requestId === state.generation) busy(''); }
    }

    form.addEventListener('submit', runResearch);
    topicInput.addEventListener('input', () => { topicError.textContent = ''; topicInput.removeAttribute('aria-invalid'); state.error = ''; setStatus(''); });
    keyInput.addEventListener('input', () => { keyError.textContent = ''; keyInput.removeAttribute('aria-invalid'); state.error = ''; setStatus(''); });
  }

  return { version: 4, API_BASE, normalizeSeed, validateSeed, keywordItems, parseCompetitors, csv, analysisPayload, reportMarkdown, extractAnalysis, callSkill, mount };
});
