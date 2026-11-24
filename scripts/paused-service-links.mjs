export function stripPausedServiceLinks(html) {
  return html.replace(/<a\b[^>]*\bhref\s*=\s*(["'])([^"']*)\1[^>]*>[\s\S]*?<\/a>/gi, (anchor, _quote, href) => {
    try {
      const url = new URL(href.replaceAll('&amp;', '&'), 'https://learn.nexscope.ai');
      const ownHost = ['learn.nexscope.ai', 'www.nexscope.ai', 'nexscope.ai'].includes(url.hostname);
      return ownHost && /\/(?:product-showcase|product-growth-report)(?:\/|$)/.test(url.pathname) ? '' : anchor;
    } catch { return anchor; }
  });
}
