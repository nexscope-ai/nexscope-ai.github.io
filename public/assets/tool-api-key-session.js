(function (root, factory) {
  const session = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = session;
  if (root) root.NexscopeToolApiKeySession = session;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  const STORAGE_KEY = 'nexscope.tools.api-key.v1';

  function read() {
    try { return root.sessionStorage.getItem(STORAGE_KEY) || ''; }
    catch { return ''; }
  }

  function write(value) {
    const key = String(value || '').trim();
    try {
      if (key) root.sessionStorage.setItem(STORAGE_KEY, key);
      else root.sessionStorage.removeItem(STORAGE_KEY);
      return true;
    } catch { return false; }
  }

  function bind(input) {
    if (!input || input.dataset.toolApiKeySessionBound === 'true') return;
    input.dataset.toolApiKeySessionBound = 'true';
    input.value = read();
    input.addEventListener('input', () => { write(input.value); });
    root.addEventListener?.('pageshow', () => { input.value = read(); });
  }

  return { STORAGE_KEY, read, write, bind };
});
