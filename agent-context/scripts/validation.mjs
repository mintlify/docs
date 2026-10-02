import path from 'node:path';

export function validateReferenceLinks(files, label) {
  for (const [file, contents] of files) {
    if (!file.endsWith('.md')) continue;
    for (const match of contents.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
      const link = match[1];
      if (/^(https?:|mailto:|#|\/)/.test(link)) continue;
      const target = path.posix.normalize(
        path.posix.join(
          path.posix.dirname(file),
          decodeURIComponent(link.split(/[?#]/)[0]),
        ),
      );
      if (target.startsWith('../') || !files.has(target)) {
        throw new Error(`${label}/${file}: missing bundled reference ${link}`);
      }
    }
  }
}

export function validateInventory(inventory) {
  if (
    inventory.schemaVersion !== 1 ||
    !Array.isArray(inventory.hooks) ||
    inventory.hooks.length === 0
  ) {
    throw new Error('Customization inventory is empty or has an unsupported schema');
  }
  const usages = new Set();
  for (const hook of inventory.hooks) {
    for (const field of [
      'name',
      'usage',
      'purpose',
      'availability',
      'stability',
      'category',
      'example',
    ]) {
      if (typeof hook[field] !== 'string' || hook[field].length === 0)
        throw new Error(`${hook.name}: missing ${field}`);
    }
    if (usages.has(hook.usage)) throw new Error(`Duplicate hook: ${hook.usage}`);
    usages.add(hook.usage);
    if (
      !Array.isArray(hook.owner) ||
      hook.owner.length === 0 ||
      !hook.source?.revision ||
      !hook.source.locations?.length
    ) {
      throw new Error(`${hook.name}: missing owner or source provenance`);
    }
    if (hook.category === 'class' && !hook.usage.startsWith('.'))
      throw new Error(`${hook.name}: class selector lost its dot`);
    if (hook.category === 'id' && !hook.usage.startsWith('#'))
      throw new Error(`${hook.name}: ID selector lost its hash`);
    if (hook.category === 'event' && (!hook.target || !hook.payload || !hook.timing))
      throw new Error(`${hook.name}: incomplete event semantics`);
    if (hook.category === 'browser-api' && !hook.signature)
      throw new Error(`${hook.name}: missing API signature`);
  }
}
