import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { repositoryRoot } from './lib.mjs';

const [inventoryArgument] = process.argv.slice(2);
if (!inventoryArgument)
  throw new Error(
    'Usage: node scripts/curate-customization.mjs <internal-inventory.json>',
  );
const inventory = JSON.parse(await readFile(path.resolve(inventoryArgument), 'utf8'));
const docs = await readFile(
  path.join(repositoryRoot, '..', 'customize', 'custom-scripts.mdx'),
  'utf8',
);
const candidates = inventory.repositories.mint.records;
const hooks = [];
const gaps = [];
const add = (
  usage,
  purpose,
  availability,
  category,
  example,
  overrides = {},
  records = candidates,
) => {
  const matches = records.filter(
    (record) => record.usage === usage || record.name === usage,
  );
  if (matches.length === 0) {
    gaps.push({
      usage,
      reason: 'No matching producer in the pinned public client source',
    });
    return;
  }
  const sources = [
    ...new Map(
      matches.map((record) => [
        `${record.source.file}:${record.source.line}`,
        record.source,
      ]),
    ).values(),
  ];
  hooks.push({
    name: matches[0].name,
    usage,
    purpose,
    owner: [...new Set(matches.map((record) => record.owner))],
    availability,
    stability: 'documented-best-effort',
    category,
    example,
    source: {
      repository: 'mintlify/mint',
      revision: inventory.repositories.mint.revision,
      locations: sources,
    },
    verification: { source: 'matched', browser: 'pending' },
    ...overrides,
  });
};
for (const match of docs.matchAll(/^\s*- `(#?[a-z][a-z0-9-]*)`: (.+)$/gm)) {
  const [token, purpose] = match.slice(1);
  let usage = `.${token}`;
  let category = 'class';
  if (token.startsWith('#')) {
    usage = token;
    category = 'id';
  } else if (
    !candidates.some((record) => record.usage === usage) &&
    candidates.some((record) => record.category === 'element' && record.usage === token)
  ) {
    usage = token;
    category = 'element';
  }
  add(
    usage,
    purpose,
    'Only when the owning component or feature is rendered; layout hooks vary with theme, page mode, viewport, and configuration. Inspect the listed producers before changing geometry.',
    category,
    `document.querySelector(${JSON.stringify(usage)})`,
    token === 'card-group' ? { stability: 'deprecated', replacement: '<Columns>' } : {},
  );
}
const componentNames = {
  directory: 'Generated directory root',
  'theme-toggle': 'Appearance toggle control',
  'theme-preference-menu': 'Appearance preference menu',
  'media-actions': 'Media action controls',
  'mermaid-container': 'Mermaid diagram wrapper',
  'mermaid-controls-wrapper': 'Mermaid zoom controls',
  'mermaid-fullscreen-controls': 'Fullscreen diagram controls',
  'mermaid-fullscreen-backdrop': 'Fullscreen diagram backdrop',
  'mermaid-fullscreen-modal': 'Fullscreen diagram modal',
  'primary-header-button': 'Sequoia primary navbar button',
  'directory-page': 'Generated directory page row',
  'directory-card': 'Generated directory card',
  'directory-group-root': 'Generated directory root',
  'directory-group': 'Generated directory group',
};
for (const [name, purpose] of Object.entries(componentNames)) {
  const usage = `[data-component-name=${JSON.stringify(name)}]`;
  add(
    usage,
    purpose,
    'Present only when the corresponding feature renders; fullscreen Mermaid nodes depend on open state, directory nodes depend on generated directory configuration, and primary-header-button is Sequoia-specific.',
    'component-name',
    `document.querySelector(${JSON.stringify(usage)})`,
    { stability: 'source-observed' },
  );
}
const parts = {
  'card-content-container': 'Card inner content wrapper',
  'card-icon': 'Card icon wrapper or image',
  'card-title': 'Card title',
  'card-content': 'Card description',
  'card-image': 'Card image when img is set',
  'card-cta': 'Card call-to-action label when cta is set',
  'tabs-list': 'Tabs button row',
  'tab-button': 'Tab button representation',
  'tab-content': 'Mounted tab content',
  'tree-file-icon': 'Tree file icon',
  'tree-file-title': 'Tree file name',
  'tree-file-highlight-bg': 'Highlighted file background',
  'tree-file-highlight-bar': 'Highlighted file accent',
  'tree-folder-title': 'Tree folder name',
  'tree-folder-icon-open': 'Expanded folder icon',
  'tree-folder-icon-closed': 'Collapsed folder icon',
  'tree-folder-children-wrapper': 'Expanded folder descendants',
  'tree-folder-children-line': 'Folder descendant guide',
  'tree-folder-highlight-bg': 'Highlighted folder background',
  'tree-folder-highlight-bar': 'Highlighted folder accent',
  'tree-folder-highlight-tint': 'Highlighted folder descendant tint',
  'contact-support-button': 'Assistant contact-support link',
  'contact-support-icon': 'Contact-support icon wrapper',
  'contact-support-text': 'Contact-support label',
};
for (const [part, purpose] of Object.entries(parts)) {
  const usage = `[data-component-part=${JSON.stringify(part)}]`;
  add(
    usage,
    purpose,
    'Only when this part is mounted. Card icon/image/CTA depend on props; highlighted Tree parts require highlight; folder children depend on expansion; assistant support depends on configuration.',
    'part',
    `${usage} { border-radius: 0.5rem; }`,
    { stability: 'source-observed' },
  );
}
const packageIconParts = inventory.repositories.components.records.filter(
  (record) => record.usage === '[data-component-part="icon-svg"]',
);
add(
  '[data-component-part="icon-svg"]',
  'Standalone component-package icon SVG part',
  'Available in the standalone @mintlify/components Icon implementation; the inspected hosted client has a different icon renderer and does not establish this part.',
  'part',
  '[data-component-part="icon-svg"] { background-color: #2563eb; }',
  {
    stability: 'source-observed',
    source: {
      repository: 'mintlify/components',
      revision: inventory.repositories.components.revision,
      locations: packageIconParts.map((record) => record.source),
    },
  },
  packageIconParts,
);
const variables = {
  '--primary': ['Primary brand RGB channels', 'rgb(var(--primary))'],
  '--primary-light': [
    'Brand RGB channels used by dark appearance',
    'rgb(var(--primary-light))',
  ],
  '--primary-dark': ['Dark brand RGB channels', 'rgb(var(--primary-dark))'],
  '--color-primary': ['Full primary CSS color alias', 'var(--color-primary)'],
  '--color-primary-light': [
    'Full light brand CSS color alias',
    'var(--color-primary-light)',
  ],
  '--color-primary-dark': [
    'Full dark brand CSS color alias',
    'var(--color-primary-dark)',
  ],
  '--color-background-light': [
    'Full light background CSS color alias',
    'var(--color-background-light)',
  ],
  '--color-background-dark': [
    'Full dark background CSS color alias',
    'var(--color-background-dark)',
  ],
  '--font-family-body-custom': [
    'Runtime body font family',
    'var(--font-family-body-custom)',
  ],
  '--font-family-headings-custom': [
    'Runtime heading font family',
    'var(--font-family-headings-custom)',
  ],
  '--font-family-mono-custom': [
    'Runtime monospace font family',
    'var(--font-family-mono-custom)',
  ],
  '--font-weight-body-custom': [
    'Runtime body font weight',
    'var(--font-weight-body-custom)',
  ],
  '--font-weight-headings-custom': [
    'Runtime heading font weight',
    'var(--font-weight-headings-custom)',
  ],
  '--background-light': [
    'Configured light background RGB channels',
    'rgb(var(--background-light))',
  ],
  '--background-dark': [
    'Configured or derived dark background RGB channels',
    'rgb(var(--background-dark))',
  ],
  '--code-padding-right': [
    'Code toolbar reservation; varies with controls and state',
    'var(--code-padding-right, 48px)',
  ],
  '--banner-height': ['Runtime-measured banner geometry', 'var(--banner-height, 0px)'],
  '--topbar-tabs-height': [
    'Runtime topbar tab geometry',
    'var(--topbar-tabs-height, 0rem)',
  ],
  '--mintlify-slot-header-height': [
    'Runtime header-slot geometry',
    'var(--mintlify-slot-header-height, 4rem)',
  ],
  '--tree-highlight': ['Tree highlight base color', 'var(--tree-highlight)'],
  '--tree-highlight-accent': ['Tree highlight accent', 'var(--tree-highlight-accent)'],
  '--tree-highlight-text': ['Tree highlight text color', 'var(--tree-highlight-text)'],
  '--tree-highlight-bg': ['Tree highlight background color', 'var(--tree-highlight-bg)'],
  '--tree-highlight-bg-hover': [
    'Tree highlight hover background',
    'var(--tree-highlight-bg-hover)',
  ],
  '--tree-highlight-tint': [
    'Highlighted Tree descendant tint',
    'var(--tree-highlight-tint)',
  ],
};
for (const [name, [purpose, example]] of Object.entries(variables)) {
  const declarations = candidates.filter(
    (record) => record.name === name && record.category === 'css-variable',
  );
  add(
    name,
    purpose,
    'Scope follows the listed declaration/consumer. Configuration owns brand/background values; code and header/banner dimensions are state-managed; Tree colors are local to .tree.',
    'css-variable',
    example,
    {
      stability: 'source-observed',
      declarations: declarations.map((record) => ({
        scope: record.scope,
        value: record.defaultValue,
        source: record.source,
      })),
      valueFormat: purpose.includes('RGB channels')
        ? 'space-separated RGB channels'
        : 'CSS value; inspect declarations and the reference for units and runtime ownership',
    },
  );
}
const apis = {
  'window.mintlify.user': [
    'Identified user content',
    'window.mintlify?.user',
    'Record<string, unknown> | undefined',
  ],
  'window.mintlify.geo': [
    'Approximate edge-provided visitor location',
    'window.mintlify?.geo?.country',
    '{ country?: string; region?: string; continent?: string } | undefined',
  ],
  'window.mintlify.api.playground.setServerVariables': [
    'Replace the runtime server-variable overlay',
    'window.mintlify?.api?.playground?.setServerVariables?.({ region: "example" })',
    '(variables: Record<string, string>) => void',
  ],
  'window.mintlify.api.playground.clearServerVariables': [
    'Clear the runtime server-variable overlay',
    'window.mintlify?.api?.playground?.clearServerVariables?.()',
    '() => void',
  ],
};
for (const [name, [purpose, example, signature]] of Object.entries(apis)) {
  add(
    name,
    purpose,
    'Browser only; properties are optional during initialization. User requires authentication/personalization; geo requires edge metadata; playground methods require initialization.',
    'browser-api',
    example,
    { signature, stability: name.endsWith('.geo') ? 'source-observed' : 'documented' },
  );
}
const states = [
  [
    '[data-active="true"]',
    'Active tab representation',
    'React serializes the Tab boolean as a string, including false. Scope to [data-component-part="tab-button"].',
    'value',
    'true',
    'Tab.tsx',
  ],
  [
    '[data-active="false"]',
    'Inactive tab representation',
    'Both true and false values retain the attribute. Presence alone does not identify an active tab.',
    'value',
    'false',
    'Tab.tsx',
  ],
  [
    '.toc-item[data-active]',
    'Active table-of-contents item',
    'The TOC scroll producer toggles attribute presence. This differs from Tab boolean serialization.',
    'presence',
    null,
    'TocActiveState.tsx',
  ],
  [
    '.tree-folder[aria-expanded="true"]',
    'Expanded tree folder row',
    'Only openable folders publish aria-expanded; it is on the role=treeitem row. Children mount when expanded.',
    'value',
    'true',
    'Tree/folder.tsx',
  ],
  [
    '.tree-folder[aria-expanded="false"]',
    'Collapsed tree folder row',
    'The false value retains the attribute. Empty/non-openable folders omit it.',
    'value',
    'false',
    'Tree/folder.tsx',
  ],
  [
    '.tree-file[aria-current="true"]',
    'Highlighted tree file row',
    'Only highlighted files publish this value; highlighting is separate from focus.',
    'value',
    'true',
    'Tree/file.tsx',
  ],
];
for (const [usage, purpose, availability, serialization, value, fileSuffix] of states) {
  let attribute = 'data-active';
  if (usage.includes('aria-expanded')) attribute = 'aria-expanded';
  else if (usage.includes('aria-current')) attribute = 'aria-current';
  const matches = candidates.filter(
    (record) =>
      record.name === attribute &&
      record.source.file.endsWith(fileSuffix) &&
      (fileSuffix !== 'Tab.tsx' || record.source.file.includes('/components/Tabs/')),
  );
  if (matches.length === 0) {
    gaps.push({ usage, reason: 'No matching state producer' });
    continue;
  }
  hooks.push({
    name: usage,
    usage,
    purpose,
    owner: [...new Set(matches.map((record) => record.owner))],
    availability,
    stability: 'source-observed',
    category: 'state',
    example: `document.querySelector(${JSON.stringify(usage)})`,
    serialization,
    value,
    source: {
      repository: 'mintlify/mint',
      revision: inventory.repositories.mint.revision,
      locations: matches.map((record) => record.source),
    },
    verification: { source: 'matched', browser: 'pending' },
  });
}
for (const event of ['mintlify:user', 'mintlify:api-playground-inputs']) {
  let payload = 'CustomEvent<{ server: Record<string, string> }>';
  let timing =
    'After replacement or clear of the runtime server-variable overlay; no separate initial-ready notification is promised.';
  if (event === 'mintlify:user') {
    payload = 'CustomEvent<Record<string, unknown> | null>';
    timing =
      'After the user producer updates window.mintlify.user, including initial resolution; subscribe before reading the current value.';
  }
  add(
    event,
    'Notify browser listeners after the corresponding user or server-variable update',
    'window dispatch target; register a listener before reading the current value and remove the same listener during cleanup.',
    'event',
    `window.addEventListener(${JSON.stringify(event)}, handler)`,
    {
      target: 'window',
      payload,
      timing,
      stability: event === 'mintlify:user' ? 'documented' : 'source-observed',
    },
  );
}
const result = {
  schemaVersion: 1,
  selectionPolicy:
    'Explicit documented ID/class names plus the reviewed parts, variables, APIs, and events in curate-customization.mjs. No raw internal ID promotion. Source-observed entries are compatibility guidance, not stability promises.',
  revisions: Object.fromEntries(
    Object.entries(inventory.repositories).map(([name, value]) => [name, value.revision]),
  ),
  hooks: [...new Map(hooks.map((hook) => [hook.usage, hook])).values()].sort((a, b) =>
    a.usage.localeCompare(b.usage),
  ),
  gaps,
};
const output = path.join(
  repositoryRoot,
  'context',
  'skills',
  'mintlify-customization',
  'reference',
  'inventory.json',
);
await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(
  `Curated ${result.hooks.length} hooks; ${gaps.length} source mismatches remain explicit.`,
);
