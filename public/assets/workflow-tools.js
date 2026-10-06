(() => {
  'use strict';

  const core = window.NexscopeWorkflowCore;
  const root = document.querySelector('[data-workflow-tool]');
  if (!core || !root || root.dataset.workflowInitialized === 'true') return;
  root.dataset.workflowInitialized = 'true';

  const form = root.querySelector('[data-tool-form]');
  const status = root.querySelector('[data-tool-status]');
  const results = root.querySelector('[data-tool-results]');
  const outputState = root.querySelector('.wf-output-state');
  const keyInput = form.querySelector('[name="apiKey"]');
  const activeRequests = new Set();
  let loading = false;
  let currentRows = [];
  let selectedProductId = '';
  let selectedRegion = 'US';

  function node(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content != null) element.textContent = String(content);
    return element;
  }

  function clear(element) { element.replaceChildren(); }

  function add(parent, ...children) {
    children.filter(Boolean).forEach(child => parent.appendChild(child));
    return parent;
  }

  function text(value, fallback = 'Not reported') {
    return value === undefined || value === null || value === '' ? fallback : String(value);
  }

  function setStatus(message, kind = 'info') {
    status.hidden = false;
    status.textContent = message;
    status.dataset.kind = kind;
  }

  function setOutputState(message, kind = 'idle') {
    outputState.textContent = message;
    outputState.dataset.state = kind;
  }

  function skeleton(target, label, variant = 'cards') {
    const section = node('section', `wf-skeleton wf-skeleton-${variant}`);
    section.dataset.skeleton = '';
    section.appendChild(node('p', 'wf-skeleton-label', label));
    const count = variant === 'cards' ? 2 : 1;
    for (let index = 0; index < count; index += 1) {
      const card = node('div', 'wf-skeleton-card');
      const lines = node('div', 'wf-skeleton-lines');
      add(lines, node('span', 'wf-skeleton-bar wf-skeleton-title'),
        node('span', 'wf-skeleton-bar wf-skeleton-long'),
        node('span', 'wf-skeleton-bar wf-skeleton-short'));
      if (variant !== 'detail') card.appendChild(node('span', 'wf-skeleton-image wf-skeleton-bar'));
      card.appendChild(lines);
      section.appendChild(card);
    }
    target.appendChild(section);
    return section;
  }

  function clearSkeletons() {
    results.querySelectorAll('[data-skeleton]').forEach(placeholder => placeholder.remove());
  }

  function field(name) { return form.querySelector(`[name="${name}"]`)?.value?.trim() || ''; }

  function invalidField(name, message) {
    const error = new Error(message);
    error.fieldName = name;
    return error;
  }

  function fieldControl(name) {
    return name === 'amazonDomain' || name === 'region'
      ? form.querySelector('.wf-market-trigger')
      : form.querySelector(`[name="${name}"]`);
  }

  function clearFieldError(name) {
    if (!name) return;
    const message = form.querySelector(`[data-error-for="${name}"]`);
    if (message) message.textContent = '';
    fieldControl(name)?.removeAttribute('aria-invalid');
  }

  function clearFieldErrors() {
    form.querySelectorAll('[data-error-for]').forEach(message => clearFieldError(message.dataset.errorFor));
  }

  function showFieldError(name, message) {
    const slot = form.querySelector(`[data-error-for="${name}"]`);
    const control = fieldControl(name);
    if (!slot || !control) return setStatus(message, 'error');
    slot.textContent = message;
    control.setAttribute('aria-invalid', 'true');
    const group = slot.closest('.wf-market-field, .wf-key-section, label') || control;
    window.requestAnimationFrame(() => {
      group.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center',
      });
      control.focus({ preventScroll: true });
    });
  }

  function apiKey() {
    const key = keyInput.value.trim();
    if (!key) throw invalidField('apiKey', 'Enter your Nexscope API key first.');
    return key;
  }

  function setBusy(value) {
    loading = value;
    root.setAttribute('aria-busy', String(value));
    form.querySelectorAll('button').forEach(button => { button.disabled = value; });
    results.querySelectorAll('button').forEach(button => {
      button.disabled = value || button.dataset.locked === 'true';
    });
  }

  async function withBusy(task) {
    if (loading) return;
    clearFieldErrors();
    setBusy(true);
    let fieldFailure;
    try { await task(); }
    catch (error) {
      const hadSkeleton = Boolean(results.querySelector('[data-skeleton]'));
      clearSkeletons();
      if (hadSkeleton) {
        setOutputState(results.querySelector('.wf-result-grid') ? 'Results ready' :
          results.querySelector('.wf-source-product') ? 'Source ready' : 'No results', 'error');
      }
      if (error?.fieldName) {
        fieldFailure = error;
        status.hidden = true;
      } else {
        setStatus(error?.name === 'AbortError' ? 'The request timed out. No further API calls were made.' :
          (error?.message || 'The request could not be completed.'), 'error');
      }
    } finally {
      setBusy(false);
      if (fieldFailure) showFieldError(fieldFailure.fieldName, fieldFailure.message);
    }
  }

  async function call(slug, payload, key) {
    const controller = new AbortController();
    activeRequests.add(controller);
    const timer = window.setTimeout(() => controller.abort(), 90000);
    try {
      return await core.runSkill(window.fetch.bind(window), slug, payload, key, { signal: controller.signal });
    } catch (error) {
      if (error?.message?.startsWith('The API key was rejected.')) {
        throw invalidField('apiKey', error.message);
      }
      throw error;
    } finally {
      window.clearTimeout(timer);
      activeRequests.delete(controller);
    }
  }

  function image(url, alt) {
    const safeUrl = core.safeHttpsUrl(url);
    const frame = node('div', 'wf-image');
    if (!safeUrl) return add(frame, node('span', 'wf-image-fallback', 'Image unavailable'));
    const img = node('img');
    img.src = safeUrl;
    img.alt = alt;
    img.loading = 'lazy';
    img.referrerPolicy = 'no-referrer';
    img.addEventListener('error', () => frame.replaceChildren(node('span', 'wf-image-fallback', 'Image unavailable')));
    return add(frame, img);
  }

  function metric(label, value) {
    const item = node('div', 'wf-metric');
    return add(item, node('dt', '', label), node('dd', '', value));
  }

  function metrics(items, className = '') {
    const list = node('dl', `wf-metrics${className ? ` ${className}` : ''}`);
    items.forEach(([label, value]) => list.appendChild(metric(label, value)));
    return list;
  }

  function metricSection(title, items, note) {
    const section = node('section', 'wf-detail-section');
    add(section, node('h4', '', title), note ? node('p', 'wf-detail-note', note) : null,
      metrics(items));
    return section;
  }

  function link(label, href) {
    const safeUrl = core.safeHttpsUrl(href);
    if (!safeUrl) return null;
    const anchor = node('a', 'wf-text-link', label);
    anchor.href = safeUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.referrerPolicy = 'no-referrer';
    return anchor;
  }

  function heading(kicker, title, note) {
    const header = node('div', 'wf-result-heading');
    return add(header, node('span', 'wf-eyebrow', kicker), node('h2', '', title), note ? node('p', '', note) : null);
  }

  function empty(message) { return node('p', 'wf-empty', message); }

  function money(value, currency) { return core.formatMoney(value, currency); }

  function reportedAmount(value, currency) {
    const formatted = core.formatNumber(value);
    return formatted === 'Not reported' ? formatted : currency ? `${currency} ${formatted}` : formatted;
  }

  function supplierCard(product, index) {
    const offerId = String(product.offerId || product.asin || '');
    const card = node('article', 'wf-result-card');
    const copy = node('div', 'wf-result-copy');
    const title = node('h3', '', text(product.title, 'Untitled 1688 listing'));
    const facts = metrics([
      ['Wholesale price', money(product.price, 'CNY')],
      ['Minimum order', core.formatNumber(product.quantityBegin)],
      ['Monthly units', core.formatNumber(product.salesQuantity)],
    ]);
    const seller = node('p', 'wf-card-note', `Supplier identity: ${text(product.sellerIdentities)}`);
    const actions = node('div', 'wf-card-actions');
    if (/^\d+$/.test(offerId)) {
      const inspect = node('button', 'wf-secondary', 'Inspect supplier details');
      inspect.type = 'button';
      inspect.dataset.action = 'supplier-detail';
      inspect.dataset.index = String(index);
      actions.appendChild(inspect);
      actions.appendChild(link('Open 1688 listing ↗', `https://detail.1688.com/offer/${offerId}.html`));
    }
    add(copy, title, facts, seller, actions, node('div', 'wf-inline-detail'));
    return add(card, image(product.imageUrl, '1688 supplier product image'), copy);
  }

  function sourcingSummary(product, asin, amazonDomain) {
    const card = node('section', 'wf-source-product');
    card.setAttribute('aria-label', 'Amazon source product');
    const copy = node('div', 'wf-source-product-copy');
    const overline = node('div', 'wf-source-product-overline');
    add(overline, node('span', '', '01 / SOURCE PRODUCT'), node('span', 'wf-source-product-domain', amazonDomain));
    const titleText = text(product.title, `Amazon ASIN ${asin}`);
    const title = node('h2', 'wf-source-product-title', titleText);
    title.title = titleText;
    const facts = node('dl', 'wf-source-product-facts');
    const asinFact = node('div');
    const priceFact = node('div');
    add(asinFact, node('dt', '', 'ASIN'), node('dd', '', asin));
    add(priceFact, node('dt', '', 'Amazon price'), node('dd', '',
      money(core.firstNonempty(product.extractedPrice, product.price), product.currency || 'USD')));
    add(facts, asinFact, priceFact);
    add(copy, overline, title, facts);
    if (titleText.length > 70) {
      const fullTitle = node('details', 'wf-source-product-full');
      add(fullTitle, node('summary', '', 'View full product name'), node('p', '', titleText));
      copy.appendChild(fullTitle);
    }
    return add(card, image(core.amazonImage(product), 'Amazon source product image'), copy);
  }

  async function runSourcing() {
    const asinInput = field('asin');
    const asin = core.amazonAsin(asinInput);
    if (!asin) throw invalidField('asin', 'Enter a valid 10-character ASIN or Amazon product URL.');
    const amazonDomain = core.amazonDomainFromUrl(asinInput) || field('amazonDomain') || 'amazon.com';
    document.dispatchEvent(new CustomEvent('workflow-market-sync', {
      detail: { name: 'amazonDomain', value: amazonDomain },
    }));
    const key = apiKey();
    clear(results);
    currentRows = [];
    setOutputState('Loading source product…', 'loading');
    skeleton(results, 'Loading the Amazon source product…', 'source');
    setStatus('Looking up the Amazon product…');
    const amazonData = await call('amazon-product-detail', {
      asins: asin, amazonDomain,
      returnBoughtTogether: false, returnRelatedProducts: false, returnAuthorsReviews: false,
    }, key);
    const product = core.amazonProduct(amazonData, asin);
    if (!product) throw new Error('The Amazon API returned no matching ASIN. 1688 search was not run.');
    clearSkeletons();
    results.appendChild(sourcingSummary(product, asin, amazonDomain));
    const sourceImage = core.amazonImage(product);
    if (!sourceImage) {
      setOutputState('Source ready', 'ready');
      setStatus('The Amazon listing has no usable HTTPS image. 1688 search was not run.', 'warning');
      return;
    }
    if (sourceImage.length > 1000) {
      setOutputState('Source ready · image URL too long', 'warning');
      setStatus('The Amazon image URL exceeds the 1688 image-search limit of 1,000 characters. No 1688 search was run.', 'warning');
      return;
    }
    setOutputState('Source ready · finding suppliers…', 'loading');
    skeleton(results, 'Finding visual matches on 1688…', 'cards');
    setStatus('Searching 1688 by the Amazon product image…');
    let supplierData;
    try {
      supplierData = await call('1688-search-by-image', { imageUrl: sourceImage, page: 1, pageSize: 10 }, key);
    } catch (error) {
      if (/code 13007\b/.test(error?.message || '')) {
        throw new Error('The Amazon product loaded, but 1688 could not use its image URL. It requires a directly accessible PNG/JPEG without redirects. Try another ASIN.');
      }
      throw error;
    }
    currentRows = core.rows(supplierData);
    clearSkeletons();
    results.appendChild(heading('Supplier shortlist', `${currentRows.length} visual matches on 1688`,
      'A visual match is not proof of the same manufacturer. Compare specifications, MOQ and shipping before contacting a supplier.'));
    if (!currentRows.length) results.appendChild(empty('No supplier matches were returned for this image.'));
    else {
      const grid = node('div', 'wf-result-grid');
      currentRows.forEach((item, index) => grid.appendChild(supplierCard(item, index)));
      results.appendChild(grid);
    }
    setOutputState('Results ready', 'ready');
    setStatus('Supplier shortlist ready. Supplier details are fetched only when you choose one.', 'success');
  }

  async function inspectSupplier(button) {
    const product = currentRows[Number(button.dataset.index)];
    const offerId = String(product?.offerId || product?.asin || '');
    if (!/^\d+$/.test(offerId)) throw new Error('This supplier has no usable 1688 product ID.');
    const detailBox = button.closest('.wf-result-card').querySelector('.wf-inline-detail');
    clear(detailBox);
    skeleton(detailBox, 'Loading supplier details…', 'detail');
    setOutputState('Loading supplier detail…', 'loading');
    setStatus('Loading the selected 1688 supplier…');
    const detailData = await call('1688-product-detail', { offerId }, apiKey());
    const detail = core.asObject(detailData.product);
    if (!detail.offerId) throw new Error('The supplier detail API returned no matching product.');
    clear(detailBox);
    const tiers = core.asArray(core.asObject(detail.saleInfo).priceRanges).slice(0, 4);
    add(detailBox, node('h4', '', 'Supplier detail'), metrics([
      ['Company', text(detail.companyName)],
      ['Minimum order', core.formatNumber(detail.minOrderQuantity)],
      ['Dispatch origin', text(core.asObject(detail.shippingInfo).sendGoodsAddressText)],
      ['Offer ID', text(detail.offerId)],
    ]));
    if (tiers.length) {
      const tierList = node('ul', 'wf-tiers');
      tiers.forEach(tier => tierList.appendChild(node('li', '',
        `${core.formatNumber(tier.startQuantity)}+ units: ${money(tier.price, 'CNY')}`)));
      add(detailBox, node('h5', '', 'Reported wholesale tiers'), tierList);
    }
    button.disabled = true;
    button.dataset.locked = 'true';
    button.textContent = 'Details loaded';
    setOutputState('Results ready', 'ready');
    setStatus('Supplier detail loaded. These prices exclude freight, tax and other landed costs.', 'success');
  }

  function trendCard(product, index) {
    const id = core.productId(product);
    const card = node('article', 'wf-result-card wf-trend-card');
    const header = node('div', 'wf-trend-head');
    const title = node('div', 'wf-trend-title');
    add(title, node('h3', '', text(product.title, 'Untitled TikTok product')),
      node('p', 'wf-card-note', id ? `Product ID ${id}` : 'Product ID unavailable'));
    add(header, image(core.amazonImage(product), 'TikTok Shop product image'), title);
    const body = node('div', 'wf-trend-body');
    const button = node('button', 'wf-secondary', 'Inspect sales + videos');
    button.type = 'button';
    button.dataset.action = 'trend-detail';
    button.dataset.index = String(index);
    button.disabled = !id;
    if (!id) button.dataset.locked = 'true';
    const context = [
      product.availableDate ? `First captured ${product.availableDate}` : null,
      product.salesTrendFlagText ? `Provider trend ${product.salesTrendFlagText}` : null,
      product.currency ? `Currency ${product.currency} as reported` : 'Currency not reported',
    ].filter(Boolean).join(' · ');
    add(body, metrics([
        ['Total units', core.formatNumber(product.totalSaleCnt)],
        ['30-day units', core.formatNumber(product.totalSale30dCnt)],
        ['Total GMV', reportedAmount(product.totalSaleGmvAmt, product.currency)],
        ['30-day GMV', reportedAmount(product.totalSaleGmv30dAmt, product.currency)],
      ], 'wf-rank-primary'),
      metrics([
        ['Rating', core.formatNumber(product.productRating)],
        ['Reviews', core.formatNumber(product.reviewCount)],
        ['Average price', reportedAmount(product.price, product.currency)],
        ['Video count', core.formatNumber(product.totalVideoCnt)],
        ['Promoting creators', core.formatNumber(product.totalIflCnt)],
        ['Livestream count', core.formatNumber(product.totalLiveCnt)],
      ], 'wf-rank-secondary'),
      node('p', 'wf-card-note', context),
      button, node('div', 'wf-inline-detail'));
    return add(card, header, body);
  }

  function salesPaceSummary(product) {
    const section = node('section', 'wf-signal');
    const pace = core.salesPace(product);
    let title = 'Sales pace cannot be compared';
    let explanation = 'One or both sales windows were not reported. Missing data is not zero sales.';
    if (pace) {
      const seven = core.number(product.totalSale7dCnt);
      const thirty = core.number(product.totalSale30dCnt);
      if (seven > thirty) {
        title = 'Sales windows need verification';
        explanation = 'The reported 7-day units exceed the reported 30-day units. Check the source data before interpreting momentum.';
      } else if (thirty === 0) {
        title = 'No units reported in these windows';
        explanation = 'Both the 7-day and 30-day values are zero. This is not evidence of future demand.';
      } else {
        title = pace.ratio > 1 ? 'Recent pace is above the 30-day average' :
          pace.ratio < 1 ? 'Recent pace is below the 30-day average' : 'Recent pace matches the 30-day average';
        explanation = `7-day daily average: ${core.formatNumber(pace.sevenDayDaily)} units; 30-day daily average: ${core.formatNumber(pace.thirtyDayDaily)} units. These windows overlap and do not predict future sales.`;
      }
    }
    return add(section, node('span', 'wf-eyebrow', 'SALES PACE CHECK'), node('h4', '', title), node('p', '', explanation));
  }

  async function runTrends() {
    const date = field('date');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw invalidField('date', 'Choose a valid ranking date.');
    selectedRegion = field('region').toUpperCase();
    const key = apiKey();
    clear(results);
    currentRows = [];
    setOutputState('Loading product ranking…', 'loading');
    skeleton(results, 'Loading the new-product ranking…', 'cards');
    setStatus('Loading the selected TikTok Shop new-product ranking…');
    const ranking = await call('tiktok-new-product-rank', {
      date, region: selectedRegion, pageNum: 1, pageSize: 10,
    }, key);
    currentRows = core.rows(ranking);
    clearSkeletons();
    results.appendChild(heading('New-product shortlist', `${currentRows.length} ranked products`,
      `Snapshot for ${date} · ${selectedRegion}. Ranking position alone does not establish a durable trend.`));
    if (!currentRows.length) results.appendChild(empty('No products were returned for this date. Try an earlier date.'));
    else {
      const grid = node('div', 'wf-result-grid');
      currentRows.forEach((item, index) => grid.appendChild(trendCard(item, index)));
      results.appendChild(grid);
    }
    setOutputState('Results ready', 'ready');
    setStatus('Ranking ready. Select one product to inspect multi-period sales and related videos.', 'success');
  }

  function videoList(videos, flavor) {
    const list = node('div', 'wf-video-list');
    videos.slice(0, 5).forEach(video => {
      const item = node('div', 'wf-video-item');
      const { description, views, href } = core.videoFields(video, flavor);
      add(item, node('p', '', description || 'TikTok video'),
        views === undefined || views === null || views === '' ? null :
          node('small', '', `${core.formatNumber(views)} views`),
        link('Open video ↗', href));
      list.appendChild(item);
    });
    return list;
  }

  async function inspectTrend(button) {
    const ranked = currentRows[Number(button.dataset.index)];
    const id = core.productId(ranked);
    if (!id) throw new Error('This ranked product has no usable product ID.');
    const detailBox = button.closest('.wf-result-card').querySelector('.wf-inline-detail');
    const key = apiKey();
    clear(detailBox);
    skeleton(detailBox, 'Loading sales evidence…', 'detail');
    setOutputState('Loading sales evidence…', 'loading');
    setStatus('Comparing the selected product’s 1-, 7- and 30-day sales…');
    const detailData = await call('tiktok-batch-product-detail', { productIds: [id] }, key);
    const product = core.rows(detailData).find(item => core.productId(item) === id);
    if (!product) throw new Error('No matching product detail was returned. Video search was not run.');
    clear(detailBox);
    add(detailBox,
      node('p', 'wf-detail-intro', 'Product-detail API snapshot. Values may differ from the ranking snapshot above.'),
      salesPaceSummary(product),
      metricSection('Sales', [
        ['Total units', core.formatNumber(product.totalSaleCnt)],
        ['1-day units', core.formatNumber(product.totalSale1dCnt)],
        ['7-day units', core.formatNumber(product.totalSale7dCnt)],
        ['30-day units', core.formatNumber(product.totalSale30dCnt)],
        ['90-day units', core.formatNumber(product.totalSale90dCnt)],
      ]),
      metricSection('GMV', [
        ['Total GMV', reportedAmount(product.totalSaleGmvAmt, product.currency)],
        ['1-day GMV', reportedAmount(product.totalSaleGmv1dAmt, product.currency)],
        ['7-day GMV', reportedAmount(product.totalSaleGmv7dAmt, product.currency)],
        ['30-day GMV', reportedAmount(product.totalSaleGmv30dAmt, product.currency)],
      ], product.currency ? `Currency reported by provider: ${product.currency}` : 'Currency not specified by this detail API.'),
      metricSection('Price & reviews', [
        ['Average price (USD)', money(product.spuAvgPrice, 'USD')],
        ['Minimum SKU price (USD)', money(product.minPrice, 'USD')],
        ['Maximum SKU price (USD)', money(product.maxPrice, 'USD')],
        ['Rating', core.formatNumber(product.productRating)],
        ['Reviews', core.formatNumber(product.reviewCount)],
      ]),
      metricSection('Content activity', [
        ['Total videos', core.formatNumber(product.totalVideoCnt)],
        ['30-day videos', core.formatNumber(product.totalVideo30dCnt)],
        ['Total creators', core.formatNumber(product.totalIflCnt)],
        ['30-day creator videos', core.formatNumber(product.totalIflVideo30dCnt)],
        ['30-day livestreams', core.formatNumber(product.totalLive30dCnt)],
        ['30-day views', core.formatNumber(product.totalViews30dCnt)],
      ]));
    button.disabled = true;
    button.dataset.locked = 'true';
    button.textContent = 'Evidence loaded';
    skeleton(detailBox, 'Loading related videos…', 'detail');
    setOutputState('Sales ready · loading videos…', 'loading');
    setStatus('Sales detail loaded. Checking related public videos…');
    try {
      const videoData = await call('chuhaijiang-tiktok-product-related-videos', {
        country: selectedRegion.toLowerCase(), id, page: 1, pageSize: 5,
      }, key);
      const videos = core.usableVideos(core.rows(videoData, 'video'), 'product');
      clearSkeletons();
      if (videos.length) {
        detailBox.appendChild(node('h4', '', 'Related videos'));
        detailBox.appendChild(videoList(videos, 'product'));
      }
      setOutputState('Results ready', 'ready');
      setStatus(videos.length ? 'Sales and video evidence loaded. Provider estimates are directional, not verified sales.' :
        'Sales detail loaded. No usable related videos were returned.', videos.length ? 'success' : 'warning');
    } catch {
      clearSkeletons();
      setOutputState('Sales ready · videos unavailable', 'warning');
      setStatus('Sales detail loaded, but related videos could not be retrieved.', 'warning');
    }
  }

  function creatorCard(creator, index) {
    const identity = core.creatorIdentity(creator);
    const id = identity.id;
    const card = node('article', 'wf-result-card wf-creator-card');
    const copy = node('div', 'wf-result-copy');
    const button = node('button', 'wf-secondary', 'Inspect creator fit');
    button.type = 'button';
    button.dataset.action = 'creator-detail';
    button.dataset.index = String(index);
    button.disabled = !id;
    if (!id) button.dataset.locked = 'true';
    const title = identity.nickname || (identity.handle ? `@${identity.handle}` : `Creator ID ${id}`);
    const subtitle = identity.handle && identity.nickname ? `@${identity.handle}` :
      id ? `Creator ID ${id}` : 'Account ID not provided';
    const preview = [
      ['Followers', creator.follower_count],
      ['Videos', creator.video_count],
      ['30-day video sales', creator.video_30d_sold_count],
    ].filter(([, value]) => core.number(value) !== null);
    add(copy, node('h3', '', title), node('p', 'wf-card-note', subtitle));
    if (preview.length) copy.appendChild(metrics(preview.map(([label, value]) =>
      [label, core.formatNumber(value)]), 'wf-creator-preview'));
    copy.appendChild(node('p', 'wf-card-note', id ?
      'Open the profile to check deeper signals and product-tagged videos.' :
      'The source did not provide an account ID, so profile lookup is unavailable.'));
    add(copy, button, node('div', 'wf-inline-detail'));
    const avatar = core.safeHttpsUrl(creator.user_avatar)
      ? image(creator.user_avatar, 'TikTok creator avatar')
      : node('div', 'wf-creator-avatar', title.slice(0, 1).toUpperCase());
    if (!core.safeHttpsUrl(creator.user_avatar)) avatar.setAttribute('aria-hidden', 'true');
    return add(card, avatar, copy);
  }

  function tiktokInputId(value) {
    const raw = String(value || '').trim();
    if (/^\d{10,25}$/.test(raw)) return raw;
    try {
      const url = new URL(raw);
      if (!/(^|\.)tiktok\.com$/i.test(url.hostname)) return null;
      const match = url.pathname.match(/\/(\d{10,25})(?:\/|$)/);
      return match ? match[1] : null;
    } catch { return null; }
  }

  async function runCreators() {
    selectedProductId = tiktokInputId(field('productId'));
    if (!selectedProductId) throw invalidField('productId', 'Enter a numeric TikTok Shop product ID or product URL.');
    selectedRegion = field('region').toUpperCase();
    const key = apiKey();
    clear(results);
    currentRows = [];
    setOutputState('Loading creators…', 'loading');
    skeleton(results, 'Finding associated creators…', 'cards');
    setStatus('Finding creators associated with this product…');
    const creatorData = await call('chuhaijiang-tiktok-product-related-creators', {
      country: selectedRegion.toLowerCase(), id: selectedProductId, page: 1, pageSize: 10,
    }, key);
    const returnedRows = core.rows(creatorData, 'creator');
    currentRows = core.usableCreators(returnedRows);
    const omitted = returnedRows.length - currentRows.length;
    clearSkeletons();
    results.appendChild(heading('Creator shortlist', `${currentRows.length} identifiable creators`,
      `Product ${selectedProductId} · ${selectedRegion}. ${omitted ? `${omitted} incomplete records omitted. ` : ''}Association does not prove partnership availability.`));
    if (!currentRows.length) results.appendChild(empty(returnedRows.length ?
      `The provider returned ${returnedRows.length} records, but none had a usable creator ID, name or handle. No profile request was made.` :
      'No associated creators were returned for this product.'));
    else {
      const grid = node('div', 'wf-result-grid');
      currentRows.forEach((item, index) => grid.appendChild(creatorCard(item, index)));
      results.appendChild(grid);
    }
    setOutputState(currentRows.length ? 'Results ready' : 'No usable creators', currentRows.length ? 'ready' : 'warning');
    setStatus(currentRows.length ? 'Creator shortlist ready. Select one to inspect profile signals and product-tagged videos.' :
      'The provider returned no identifiable creators for this product. No detail request was made.', currentRows.length ? 'success' : 'warning');
  }

  async function inspectCreator(button) {
    const creator = currentRows[Number(button.dataset.index)];
    const id = core.creatorId(creator);
    if (!id) throw new Error('This creator has no usable account ID.');
    const detailBox = button.closest('.wf-result-card').querySelector('.wf-inline-detail');
    const key = apiKey();
    clear(detailBox);
    skeleton(detailBox, 'Loading creator profile…', 'detail');
    setOutputState('Loading creator profile…', 'loading');
    setStatus('Loading this creator’s profile signals…');
    const detailData = await call('chuhaijiang-tiktok-creator-detail', {
      country: selectedRegion.toLowerCase(), id, include: 'core,channel',
    }, key);
    const payload = core.asObject(detailData.data);
    const profiles = core.asArray(payload.items);
    const cores = core.asArray(core.asObject(payload.core).items);
    const channels = core.asArray(core.asObject(payload.channel).items);
    if (!profiles.length && !cores.length && !channels.length) {
      throw new Error('No creator profile was returned. Video search was not run.');
    }
    const profile = profiles.find(item => core.creatorId(item) === id) || profiles[0] || {};
    const profileCore = cores[0] || {};
    const channel = channels[0] || {};
    clear(detailBox);
    add(detailBox, node('h4', '', 'Creator profile'), metrics([
      ['Followers', core.formatNumber(profileCore.core_follower_count)],
      ['Products promoted', core.formatNumber(profileCore.core_product_count)],
      ['30-day avg. video plays', core.formatNumber(channel.channel_ec_video_30d_avg_play_count)],
      ['30-day engagement', text(channel.channel_ec_video_30d_avg_engagement_rate)],
    ]));
    const handle = String(profile.unique_id || creator.unique_id || '').replace(/^@/, '');
    if (/^[A-Za-z0-9._]{2,30}$/.test(handle)) detailBox.appendChild(link('Open TikTok profile ↗', `https://www.tiktok.com/@${handle}`));
    button.disabled = true;
    button.dataset.locked = 'true';
    button.textContent = 'Profile loaded';
    skeleton(detailBox, 'Loading product-tagged videos…', 'detail');
    setOutputState('Profile ready · loading videos…', 'loading');
    setStatus('Profile loaded. Checking for videos tagged with this exact product…');
    try {
      const videosData = await call('chuhaijiang-tiktok-creator-related-videos', {
        country: selectedRegion.toLowerCase(), id, page: 1, pageSize: 10,
      }, key);
      const matchingVideos = core.usableVideos(core.rows(videosData, 'video').filter(video =>
        String(video.tiktok_creator_detail_video_product_id || '') === selectedProductId
      ), 'creator');
      clearSkeletons();
      if (matchingVideos.length) {
        detailBox.appendChild(node('h4', '', 'Product-tagged videos in this sample'));
        detailBox.appendChild(videoList(matchingVideos, 'creator'));
      }
      setOutputState('Results ready', 'ready');
      setStatus(matchingVideos.length ? 'Creator fit evidence loaded. Review the creator’s content manually before outreach.' :
        'Creator profile loaded. No usable product-tagged videos were returned.', matchingVideos.length ? 'success' : 'warning');
    } catch {
      clearSkeletons();
      setOutputState('Profile ready · videos unavailable', 'warning');
      setStatus('Creator profile loaded, but related videos could not be retrieved.', 'warning');
    }
  }

  const runButton = form.querySelector('[data-run-tool]');
  form.addEventListener('input', event => {
    if (event.target.name) clearFieldError(event.target.name);
    if (event.target.name === 'asin') {
      const domain = core.amazonDomainFromUrl(event.target.value);
      if (domain) document.dispatchEvent(new CustomEvent('workflow-market-sync', {
        detail: { name: 'amazonDomain', value: domain },
      }));
    }
  });
  form.addEventListener('change', event => {
    if (event.target.name) clearFieldError(event.target.name);
  });
  document.addEventListener('workflow-market-change', event => clearFieldError(event.detail?.name));
  runButton.addEventListener('click', () => {
    void withBusy(async () => {
      if (root.dataset.workflowTool === 'sourcing') await runSourcing();
      else if (root.dataset.workflowTool === 'trends') await runTrends();
      else if (root.dataset.workflowTool === 'creators') await runCreators();
      if (results.childElementCount && window.innerWidth <= 850) {
        root.querySelector('.wf-output-panel').scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      }
    });
  });

  form.addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('input')) {
      event.preventDefault();
      runButton.click();
    }
  });

  results.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button || loading) return;
    void withBusy(async () => {
      if (button.dataset.action === 'supplier-detail') await inspectSupplier(button);
      else if (button.dataset.action === 'trend-detail') await inspectTrend(button);
      else if (button.dataset.action === 'creator-detail') await inspectCreator(button);
    });
  });

  window.addEventListener('pagehide', () => {
    activeRequests.forEach(controller => controller.abort());
    keyInput.value = '';
  });

  const rankingDate = form.querySelector('[name="date"]');
  if (rankingDate && !rankingDate.value) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    rankingDate.value = [yesterday.getFullYear(), String(yesterday.getMonth() + 1).padStart(2, '0'),
      String(yesterday.getDate()).padStart(2, '0')].join('-');
  }
})();
