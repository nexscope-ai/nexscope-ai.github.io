/* oxlint-disable typescript/no-require-imports, typescript/no-floating-promises, typescript/unbound-method */
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'public', 'assets', 'tool-api-key-session.js'), 'utf8');

function memoryStorage() {
  const values = new Map();
  return {
    values,
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
}

function loadSession(localStorage, sessionStorage = memoryStorage()) {
  const moduleScope = { exports: {} };
  const listeners = new Map();
  runInNewContext(source, {
    module: moduleScope, localStorage, sessionStorage,
    addEventListener(name, listener) { listeners.set(name, listener); },
  });
  moduleScope.exports.dispatchStorage = (key) => listeners.get('storage')?.({ key });
  return moduleScope.exports;
}

function fakeInput() {
  const listeners = new Map();
  return {
    dataset: {}, value: '',
    addEventListener(name, listener) { listeners.set(name, listener); },
    input(value) { this.value = value; listeners.get('input')(); },
  };
}

test('one localStorage key is shared across tool pages and an empty field removes it', () => {
  const storage = memoryStorage();
  const session = loadSession(storage);
  const firstTool = fakeInput();
  session.bind(firstTool);
  firstTool.input(' nk-example ');
  assert.equal(storage.values.get(session.STORAGE_KEY), 'nk-example');
  const secondTool = fakeInput();
  session.bind(secondTool);
  assert.equal(secondTool.value, 'nk-example');
  secondTool.input('');
  assert.equal(session.read(), '');
  assert.equal(storage.values.has(session.STORAGE_KEY), false);
  const thirdTool = fakeInput();
  session.bind(thirdTool);
  assert.equal(thirdTool.value, '');
});

test('a previous session key is migrated once and cleared from sessionStorage', () => {
  const local = memoryStorage();
  const legacy = memoryStorage();
  legacy.setItem('nexscope.tools.api-key.v1', 'nk-legacy');
  const session = loadSession(local, legacy);
  assert.equal(session.read(), 'nk-legacy');
  assert.equal(local.getItem(session.STORAGE_KEY), 'nk-legacy');
  assert.equal(legacy.getItem(session.STORAGE_KEY), null);
  session.write('');
  assert.equal(local.getItem(session.STORAGE_KEY), null);
});

test('bound inputs update when localStorage changes in another tab', () => {
  const local = memoryStorage();
  const session = loadSession(local);
  const input = fakeInput();
  session.bind(input);
  local.setItem(session.STORAGE_KEY, 'nk-from-other-tab');
  session.dispatchStorage(session.STORAGE_KEY);
  assert.equal(input.value, 'nk-from-other-tab');
});

test('tools still accept manual keys if browser localStorage is unavailable', () => {
  const session = loadSession({
    getItem() { throw new Error('Unavailable'); },
    setItem() { throw new Error('Unavailable'); },
    removeItem() { throw new Error('Unavailable'); },
  });
  const input = fakeInput();
  session.bind(input);
  assert.equal(session.read(), '');
  input.input('nk-manual');
  assert.equal(input.value, 'nk-manual');
  assert.equal(session.write('nk-manual'), false);
});

test('both tool runtimes load the same local-storage module before mounting their UI', () => {
  const root = join(__dirname, '..');
  const workflowRuntime = readFileSync(join(root, 'components', 'workflow-runtime.tsx'), 'utf8');
  const plannerRuntime = readFileSync(join(root, 'components', 'seo-planner-runtime.tsx'), 'utf8');
  const workflowUi = readFileSync(join(root, 'public', 'assets', 'workflow-tools.js'), 'utf8');
  const plannerUi = readFileSync(join(root, 'public', 'assets', 'seo-keyword-planner.js'), 'utf8');
  for (const runtime of [workflowRuntime, plannerRuntime]) assert.match(runtime, /tool-api-key-session\.js\?v=2/);
  for (const ui of [workflowUi, plannerUi]) assert.match(ui, /NexscopeToolApiKeySession\?\.bind\(keyInput\)/);
});
