/* oxlint-disable typescript/no-require-imports, typescript/no-floating-promises, typescript/unbound-method */
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { runInNewContext } = require('node:vm');

const source = readFileSync(join(__dirname, '..', 'public', 'assets', 'tool-api-key-session.js'), 'utf8');

function loadSession(storage) {
  const moduleScope = { exports: {} };
  runInNewContext(source, { module: moduleScope, sessionStorage: storage, addEventListener() {} });
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

test('one sessionStorage key is shared across tool pages and an empty field removes it', () => {
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); },
  };
  const session = loadSession(storage);
  const firstTool = fakeInput();
  session.bind(firstTool);
  firstTool.input(' nk-example ');
  assert.equal(values.get(session.STORAGE_KEY), 'nk-example');
  const secondTool = fakeInput();
  session.bind(secondTool);
  assert.equal(secondTool.value, 'nk-example');
  secondTool.input('');
  assert.equal(session.read(), '');
  const thirdTool = fakeInput();
  session.bind(thirdTool);
  assert.equal(thirdTool.value, '');
});

test('tools still accept manual keys if browser sessionStorage is unavailable', () => {
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

test('both tool runtimes load the same session module before mounting their UI', () => {
  const root = join(__dirname, '..');
  const workflowRuntime = readFileSync(join(root, 'components', 'workflow-runtime.tsx'), 'utf8');
  const plannerRuntime = readFileSync(join(root, 'components', 'seo-planner-runtime.tsx'), 'utf8');
  const workflowUi = readFileSync(join(root, 'public', 'assets', 'workflow-tools.js'), 'utf8');
  const plannerUi = readFileSync(join(root, 'public', 'assets', 'seo-keyword-planner.js'), 'utf8');
  for (const runtime of [workflowRuntime, plannerRuntime]) assert.match(runtime, /tool-api-key-session\.js\?v=1/);
  for (const ui of [workflowUi, plannerUi]) assert.match(ui, /NexscopeToolApiKeySession\?\.bind\(keyInput\)/);
});
