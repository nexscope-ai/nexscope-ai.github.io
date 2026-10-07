(function (root, factory) {
  const session = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = session;
  if (root) root.NexscopeToolApiKeySession = session;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const STORAGE_KEY = 'nexscope.tools.api-key.v1';

  function read() {
    try {
      const saved = root.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        try { root.sessionStorage?.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
        return saved;
      }
      const previous = root.sessionStorage?.getItem(STORAGE_KEY) || '';
      if (previous) {
        root.localStorage.setItem(STORAGE_KEY, previous);
        root.sessionStorage.removeItem(STORAGE_KEY);
      }
      return previous;
    } catch { return ''; }
  }

  function write(value) {
    const key = String(value || '').trim();
    try {
      if (key) root.localStorage.setItem(STORAGE_KEY, key);
      else root.localStorage.removeItem(STORAGE_KEY);
      try { root.sessionStorage?.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
      return true;
    } catch { return false; }
  }

  function bind(input) {
    if (!input || input.dataset.toolApiKeySessionBound === 'true') return;
    input.dataset.toolApiKeySessionBound = 'true';
    input.value = read();
    input.addEventListener('input', () => { write(input.value); });
    root.addEventListener?.('pageshow', () => { input.value = read(); });
    root.addEventListener?.('storage', (event) => {
      if (event.key === STORAGE_KEY) input.value = read();
    });
  }

  return { STORAGE_KEY, storage: 'localStorage', read, write, bind };
});
