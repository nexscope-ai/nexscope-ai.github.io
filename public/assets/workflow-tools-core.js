(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  if (root) root.NexscopeWorkflowCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const API_BASE = 'https://api.nexscope.ai/api/skill-api/v1/skills';
  const AMAZON_DOMAINS = Object.freeze(['amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.co.jp']);
  const SKILLS = Object.freeze({
    'amazon-product-detail': 21,
    '1688-search-by-image': 10,
    '1688-product-detail': null,
    'tiktok-new-product-rank': 10,
    'tiktok-batch-product-detail': 10,
    'chuhaijiang-tiktok-product-related-videos': 38,
    'chuhaijiang-tiktok-product-related-creators': 38,
    'chuhaijiang-tiktok-creator-detail': 19,
    'chuhaijiang-tiktok-creator-related-videos': 38,
  });

  function asObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function firstNonempty(...values) {
    return values.find(value => value !== undefined && value !== null && value !== '') ?? null;
  }

  function amazonAsin(input) {
    const value = String(input || '').trim();
    if (/^[A-Z0-9]{10}$/i.test(value)) return value.toUpperCase();
    try {
      const url = new URL(value);
      if (!amazonDomainFromUrl(value)) return null;
      const match = url.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:\/|$)/i);
      return match ? match[1].toUpperCase() : null;
    } catch {
      return null;
    }
  }

  function amazonDomainFromUrl(input) {
    try {
      const url = new URL(String(input || '').trim());
      if (url.protocol !== 'https:' || url.username || url.password) return null;
      return AMAZON_DOMAINS.find(domain =>
        url.hostname.toLowerCase() === domain || url.hostname.toLowerCase() === `www.${domain}`
      ) || null;
    } catch {
      return null;
    }
  }

  function safeHttpsUrl(value) {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && url.username === '' && url.password === '' ? url.href : null;
    } catch {
      return null;
    }
  }

  function productId(row) {
    const value = firstNonempty(row?.productId, row?.product_id, row?.asin, row?.id);
    if (typeof value === 'number' && !Number.isSafeInteger(value)) return null;
    const text = value == null ? '' : String(value);
    return /^\d{10,25}$/.test(text) ? text : null;
  }

  function creatorId(row) {
    const value = firstNonempty(row?.user_id, row?.uid, row?.creator_id, row?.id);
    if (typeof value === 'number' && !Number.isSafeInteger(value)) return null;
    const text = value == null ? '' : String(value);
    return /^\d{10,25}$/.test(text) ? text : null;
  }

  function creatorIdentity(row) {
    const record = asObject(row);
    const id = creatorId(record);
    const nickname = typeof record.nickname === 'string' ? record.nickname.trim() : '';
    const handle = typeof record.unique_id === 'string' ? record.unique_id.trim().replace(/^@/, '') : '';
    return {
      id,
      nickname,
      handle,
      usable: Boolean(id || nickname || handle),
    };
  }

  function usableCreators(rows) {
    return asArray(rows).filter(row => creatorIdentity(row).usable);
  }

  function salesPace(product) {
    const sevenDays = number(product?.totalSale7dCnt);
    const thirtyDays = number(product?.totalSale30dCnt);
    if (sevenDays === null || thirtyDays === null) return null;
    return {
      sevenDayDaily: sevenDays / 7,
      thirtyDayDaily: thirtyDays / 30,
      ratio: thirtyDays > 0 ? (sevenDays / 7) / (thirtyDays / 30) : null,
    };
  }

  function amazonProduct(data, asin) {
    return asArray(asObject(data).products).find(item =>
      String(item?.asin || '').toUpperCase() === asin
    ) || null;
  }

  function amazonImage(product) {
    const candidates = [product?.imageUrl, ...asArray(product?.productImageUrls), product?.image, product?.thumbnail];
    return candidates.map(safeHttpsUrl).find(Boolean) || null;
  }

  function rows(data, type) {
    if (type === 'creator' || type === 'video') {
      return asArray(asObject(asObject(data).data).items);
    }
    return asArray(asObject(data).products);
  }

  function videoFields(video, flavor) {
    const row = asObject(video);
    const creator = flavor === 'creator';
    const rawDescription = creator ? row.tiktok_creator_detail_video_desc : row.video_desc;
    return {
      description: typeof rawDescription === 'string' ? rawDescription.trim() : '',
      views: creator ? row.tiktok_creator_detail_video_play_count : row.video_play_count,
      href: safeHttpsUrl(creator ? row.tiktok_creator_detail_video_share_url : row.share_url),
    };
  }

  function usableVideos(videos, flavor) {
    return asArray(videos).filter(video => {
      const { description, href } = videoFields(video, flavor);
      return Boolean(description || href);
    });
  }

  function number(value) {
    if (value === null || value === undefined || value === '') return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  function formatNumber(value) {
    const numeric = number(value);
    return numeric === null ? 'Not reported' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numeric);
  }

  function formatMoney(value, currency) {
    const numeric = number(value);
    return numeric === null ? 'Not reported' : `${currency} ${formatNumber(numeric)}`;
  }

  async function runSkill(fetcher, slug, payload, key, options = {}) {
    if (!Object.prototype.hasOwnProperty.call(SKILLS, slug)) throw new Error('Unsupported API workflow.');
    if (typeof key !== 'string' || !key.trim()) throw new Error('Enter your API key first.');
    const response = await fetcher(`${API_BASE}/${slug}/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      signal: options.signal,
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error('The API key was rejected. Check the key and try again.');
      if (response.status === 402) throw insufficientCreditsError();
      if (response.status === 403) throw new Error('This account does not have access to this API.');
      if (response.status === 429) throw new Error('The API rate limit was reached. Wait before trying again.');
      let failure;
      try { failure = await response.json(); } catch { /* Use the HTTP fallback below. */ }
      if (isInsufficientCreditsCode(failure?.code)) throw insufficientCreditsError();
      throw new Error(`The API request failed (HTTP ${response.status}).`);
    }
    let result;
    try { result = await response.json(); }
    catch { throw new Error('The API returned an unreadable response.'); }
    if (isInsufficientCreditsCode(result?.code)) throw insufficientCreditsError();
    if (result?.code !== 0) {
      throw new Error(`The API did not complete this request (code ${String(result?.code ?? 'unknown')}).`);
    }
    const data = asObject(result.data);
    const status = String(data.status || '').toUpperCase();
    if (status && !['SUCCESS', 'SUCCEEDED', 'COMPLETED', 'DONE'].includes(status)) {
      throw new Error(`The API task is ${status.toLowerCase()}; no final result was returned.`);
    }
    if (data.errcode != null && ![0, 200].includes(Number(data.errcode))) {
      throw new Error(`The data provider did not complete this request (code ${String(data.errcode)}).`);
    }
    return data;
  }

  function isInsufficientCreditsCode(code) {
    return [13011, 16002, 17001, 18001, 440215, -40002].includes(Number(code));
  }

  function insufficientCreditsError() {
    const error = new Error('Insufficient Data credits. Add credits to continue.');
    error.name = 'InsufficientCreditsError';
    return error;
  }

  return {
    version: 6, API_BASE, SKILLS, amazonAsin, amazonDomainFromUrl, amazonProduct, amazonImage, asArray, asObject,
    creatorId, creatorIdentity, firstNonempty, formatMoney, formatNumber, number, productId,
    rows, runSkill, safeHttpsUrl, salesPace, usableCreators, usableVideos, videoFields,
  };
});
