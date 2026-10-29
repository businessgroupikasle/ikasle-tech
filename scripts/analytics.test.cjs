const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(id, browser = {}) {
  const exports = {};
  const context = { exports, process: { env: { NEXT_PUBLIC_GA_MEASUREMENT_ID: id } } };
  if (browser) context.window = browser;
  const { outputText } = ts.transpileModule(readFileSync('src/lib/analytics.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  vm.runInNewContext(outputText, context);
  return { ...exports, browser };
}

test('missing and invalid IDs disable analytics without creating a queue', () => {
  for (const id of [undefined, '', 'G-INVALID<script>', 'UA-123']) {
    const analytics = load(id);
    analytics.trackEvent('generate_lead');
    assert.equal(analytics.analyticsEnabled, false);
    assert.equal(analytics.browser.dataLayer, undefined);
  }
});

test('one call queues one event for the configured property before the tag loads', () => {
  const analytics = load(' G-TEST123 ');
  analytics.trackEvent('generate_lead', { form_name: 'project_enquiry' });
  assert.equal(analytics.browser.dataLayer.length, 1);
  const [command, name, params] = analytics.browser.dataLayer[0];
  assert.equal(command, 'event');
  assert.equal(name, 'generate_lead');
  assert.equal(params.send_to, 'G-TEST123');
  assert.equal(params.form_name, 'project_enquiry');
});

test('uses the existing Google tag without replacing it or adding another event', () => {
  const calls = [];
  const gtag = (...args) => calls.push(args);
  const analytics = load('G-TEST123', { gtag });
  analytics.trackEvent('contact_click', { contact_method: 'phone' });
  assert.equal(analytics.browser.gtag, gtag);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][1], 'contact_click');
});

test('safe when invoked during server rendering', () => {
  assert.doesNotThrow(() => load('G-TEST123', null).trackEvent('generate_lead'));
});
