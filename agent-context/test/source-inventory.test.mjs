import assert from 'node:assert/strict';
import test from 'node:test';
import {
  extractConstants,
  extractCss,
  extractTypeScript,
  parseSource,
} from '../scripts/source-inventory.mjs';
import { validateReferenceLinks } from '../scripts/validation.mjs';

test('extracts selectors without confusing IDs, classes, elements, and conditional parts', () => {
  const source = `enum Classes { Card = 'card' }
enum Identifiers { Sidebar = 'sidebar' }
const Example = ({ active }) => <div id={Identifiers.Sidebar} className={Classes.Card}>
  <card data-component-part={active ? 'open-icon' : 'closed-icon'} data-active={active} />
</div>;`;
  const records = extractTypeScript(
    'example.tsx',
    source,
    extractConstants(parseSource('example.tsx', source)),
  );
  assert.ok(
    records.some((record) => record.usage === '.card' && record.category === 'class'),
  );
  assert.ok(
    records.some((record) => record.usage === '#sidebar' && record.category === 'id'),
  );
  assert.ok(
    records.some((record) => record.usage === 'card' && record.category === 'element'),
  );
  assert.ok(
    records.some(
      (record) =>
        record.usage === '[data-component-part="open-icon"]' &&
        record.condition === 'active',
    ),
  );
  assert.ok(
    records.some(
      (record) =>
        record.usage === '[data-component-part="closed-icon"]' &&
        record.condition === '!(active)',
    ),
  );
  assert.ok(
    records.some(
      (record) =>
        record.name === 'data-active' &&
        record.serialization === 'requires-producer-review',
    ),
  );
});

test('extracts optional browser signatures and event producers and listeners', () => {
  const source = `interface Window { mintlify?: { api?: { playground?: { clearServerVariables?: () => void } } } }
window.dispatchEvent(new CustomEvent('example:changed', { detail: { value: 'synthetic' } }));
window.addEventListener('example:changed', onChange);
window.removeEventListener('example:changed', onChange);`;
  const records = extractTypeScript('example.ts', source);
  const api = records.find(
    (record) => record.name === 'window.mintlify.api.playground.clearServerVariables',
  );
  assert.equal(api.signature, '() => void');
  assert.equal(api.optional, true);
  const events = records.filter((record) => record.category === 'event');
  assert.deepEqual(
    events.map((record) => record.method),
    ['dispatchEvent', 'addEventListener', 'removeEventListener'],
  );
  assert.ok(events.every((record) => record.target === 'window'));
  assert.match(events[0].payloadExpression, /detail/);
});

test('extracts CSS variable declarations with scope, value format, and source location', () => {
  const records = extractCss(
    'example.css',
    ':root { --primary: 1 2 3; }\nhtml.dark .example { --gap: 12px; }',
  );
  const primary = records.find((record) => record.name === '--primary');
  assert.equal(primary.scope, ':root');
  assert.equal(primary.defaultValue, '1 2 3');
  const gap = records.find((record) => record.name === '--gap');
  assert.equal(gap.scope, 'html.dark .example');
  assert.equal(gap.source.line, 2);
});

test('rejects missing references and links escaping the installed bundle', () => {
  assert.throws(
    () =>
      validateReferenceLinks(
        new Map([['SKILL.md', '[Missing](reference/missing.md)']]),
        'example',
      ),
    /missing bundled reference/,
  );
  assert.throws(
    () =>
      validateReferenceLinks(
        new Map([['SKILL.md', '[Escape](../outside.md)']]),
        'example',
      ),
    /missing bundled reference/,
  );
  validateReferenceLinks(
    new Map([
      ['SKILL.md', '[Recipe](reference/recipes.md#example)'],
      ['reference/recipes.md', '[Entry](../SKILL.md)'],
    ]),
    'example',
  );
});
