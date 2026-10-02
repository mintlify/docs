import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';

export function parseSource(file, text) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function unwrap(node) {
  while (node && (ts.isAsExpression(node) || ts.isParenthesizedExpression(node))) {
    node = node.expression;
  }
  return node;
}

function literal(node) {
  node = unwrap(node);
  if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
    return node.text;
  }
  return undefined;
}

function literalBranches(node, constants, source) {
  node = unwrap(node);
  const resolved = literal(node) ?? constants.get(node?.getText(source));
  if (resolved !== undefined) return [{ value: resolved }];
  if (node && ts.isConditionalExpression(node)) {
    return [
      ...literalBranches(node.whenTrue, constants, source).map((branch) => ({
        ...branch,
        condition: node.condition.getText(source),
      })),
      ...literalBranches(node.whenFalse, constants, source).map((branch) => ({
        ...branch,
        condition: `!(${node.condition.getText(source)})`,
      })),
    ];
  }
  return [];
}

function walk(node, visit) {
  visit(node);
  ts.forEachChild(node, (child) => walk(child, visit));
}

export function extractConstants(source) {
  const constants = new Map();
  walk(source, (node) => {
    if (ts.isEnumDeclaration(node)) {
      for (const member of node.members) {
        const value = literal(member.initializer);
        if (value !== undefined)
          constants.set(`${node.name.text}.${member.name.getText(source)}`, value);
      }
    }
    if (!ts.isVariableDeclaration(node)) return;
    const name = node.name.getText(source);
    const value = literal(node.initializer);
    if (value !== undefined) constants.set(name, value);
    const object = unwrap(node.initializer);
    if (!object || !ts.isObjectLiteralExpression(object)) return;
    for (const property of object.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const value = literal(property.initializer);
      if (value === undefined) continue;
      const key = property.name.getText(source).replace(/^['"]|['"]$/g, '');
      constants.set(`${name}.${key}`, value);
      if (name === '_classes') constants.set(`Classes.${key}`, value);
    }
  });
  return constants;
}

function owningComponent(node, source) {
  for (let current = node.parent; current; current = current.parent) {
    if (ts.isFunctionDeclaration(current) && current.name) return current.name.text;
    if (
      ts.isVariableDeclaration(current) &&
      current.initializer &&
      (ts.isArrowFunction(current.initializer) ||
        ts.isFunctionExpression(current.initializer))
    )
      return current.name.getText(source);
  }
  return path.basename(source.fileName);
}

export function extractTypeScript(file, text, constants = new Map()) {
  const source = parseSource(file, text);
  const records = [];
  const append = (record) => records.push(record);
  const add = (node, category, name, usage, details = {}) => {
    const location = source.getLineAndCharacterOfPosition(node.getStart(source));
    append({
      category,
      name,
      usage,
      owner: owningComponent(node, source),
      source: { file, line: location.line + 1 },
      stability: 'unreviewed',
      ...details,
    });
  };
  walk(source, (node) => {
    if (ts.isJsxAttribute(node)) {
      const attribute = node.name.getText(source);
      const initializer = node.initializer;
      const valueNode =
        initializer && ts.isJsxExpression(initializer)
          ? initializer.expression
          : initializer;
      const expression = valueNode?.getText(source) ?? 'true';
      const resolved = literal(valueNode) ?? constants.get(expression);
      if (attribute === 'className' && valueNode) {
        walk(valueNode, (part) => {
          const text = literal(part);
          if (text !== undefined) {
            for (const token of text.split(/\s+/)) {
              if (/^[a-zA-Z_][\w-]*$/.test(token))
                add(node, 'class', token, `.${token}`, { literal: true });
            }
          }
          if (!ts.isPropertyAccessExpression(part)) return;
          const reference = part.getText(source);
          if (!reference.startsWith('Classes.')) return;
          const value = constants.get(reference);
          if (value !== undefined)
            add(node, 'class', value, `.${value}`, { constant: reference });
        });
      }
      if (attribute === 'id') {
        if (resolved !== undefined) add(node, 'id', resolved, `#${resolved}`);
        else add(node, 'dynamic-id', expression, null, { valueExpression: expression });
      }
      if (
        attribute.startsWith('data-') ||
        attribute.startsWith('aria-') ||
        attribute === 'disabled'
      ) {
        const branches = literalBranches(valueNode, constants, source);
        if (branches.length > 0) {
          for (const branch of branches) {
            add(
              node,
              'attribute',
              attribute,
              `[${attribute}=${JSON.stringify(branch.value)}]`,
              branch,
            );
          }
        } else {
          add(node, 'state', attribute, `[${attribute}]`, {
            valueExpression: expression,
            serialization: 'requires-producer-review',
          });
        }
      }
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      if (/^[a-z][a-z0-9-]*$/.test(tag)) add(node, 'element', tag, tag);
    }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text;
      if (['setAttribute', 'removeAttribute', 'toggleAttribute'].includes(method)) {
        const attribute =
          literal(node.arguments[0]) ?? constants.get(node.arguments[0]?.getText(source));
        if (attribute)
          add(node, 'state-producer', attribute, `[${attribute}]`, {
            method,
            valueExpression: node.arguments[1]?.getText(source),
          });
      }
      if (['dispatchEvent', 'addEventListener', 'removeEventListener'].includes(method)) {
        const argument = node.arguments[0];
        let eventNode = argument;
        if (argument && ts.isNewExpression(argument)) eventNode = argument.arguments?.[0];
        const event = literal(eventNode) ?? constants.get(eventNode?.getText(source));
        if (event) {
          const details = {
            method,
            target: node.expression.expression.getText(source),
            payloadExpression: undefined,
          };
          if (argument && ts.isNewExpression(argument))
            details.payloadExpression = argument.arguments?.[1]?.getText(source);
          add(node, 'event', event, event, details);
        }
      }
    }
    if (ts.isInterfaceDeclaration(node) && node.name.text === 'Window') {
      const visitMembers = (members, prefix) => {
        for (const member of members) {
          if (!ts.isPropertySignature(member) || !member.name || !member.type) continue;
          const name = `${prefix}.${member.name.getText(source)}`;
          if (name === 'window.mintlify' || name.startsWith('window.mintlify.')) {
            add(member, 'browser-api', name, name, {
              signature: member.type.getText(source),
              optional: Boolean(member.questionToken),
            });
          }
          if (ts.isTypeLiteralNode(member.type)) visitMembers(member.type.members, name);
        }
      };
      visitMembers(node.members, 'window');
    }
  });
  for (const match of text.matchAll(/--[a-zA-Z][\w-]*/g)) {
    const location = source.getLineAndCharacterOfPosition(match.index);
    append({
      category: 'css-variable-use',
      name: match[0],
      usage: `var(${match[0]})`,
      owner: path.basename(file),
      source: { file, line: location.line + 1 },
      stability: 'unreviewed',
    });
  }
  return records;
}

export function extractCss(file, text) {
  const records = [];
  const append = (record) => records.push(record);
  const root = postcss.parse(text, { from: file });
  root.walkDecls((declaration) => {
    if (!declaration.prop.startsWith('--')) return;
    let scope = ':root';
    if (declaration.parent.type === 'rule') scope = declaration.parent.selector;
    else if (declaration.parent.type === 'atrule') scope = `@${declaration.parent.name}`;
    append({
      category: 'css-variable',
      name: declaration.prop,
      usage: `var(${declaration.prop})`,
      defaultValue: declaration.value,
      scope,
      owner: path.basename(file),
      source: { file, line: declaration.source.start.line },
      stability: 'unreviewed',
    });
  });
  root.walkRules((rule) => {
    append({
      category: 'css-selector',
      name: rule.selector,
      usage: rule.selector,
      owner: path.basename(file),
      source: { file, line: rule.source.start.line },
      stability: 'unreviewed',
    });
  });
  return records;
}

async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (
      entry.isDirectory() &&
      !['node_modules', '.git', '__test__', 'test', '_props'].includes(entry.name)
    ) {
      files.push(...(await sourceFiles(file)));
    } else if (
      entry.isFile() &&
      /\.(tsx?|css)$/.test(file) &&
      !/\.(test|stories)\./.test(file)
    ) {
      files.push(file);
    }
  }
  return files.sort();
}

export async function inventoryRepository(root, directories) {
  const files = (
    await Promise.all(
      directories.map((directory) => sourceFiles(path.join(root, directory))),
    )
  )
    .flat()
    .sort();
  const sources = await Promise.all(
    files.map(async (file) => [
      path.relative(root, file).split(path.sep).join('/'),
      await readFile(file, 'utf8'),
    ]),
  );
  const constants = new Map();
  for (const [file, text] of sources) {
    if (!file.endsWith('.css')) {
      for (const [key, value] of extractConstants(parseSource(file, text)))
        constants.set(key, value);
    }
  }
  const records = sources.flatMap(([file, text]) => {
    if (file.endsWith('.css')) return extractCss(file, text);
    return extractTypeScript(file, text, constants);
  });
  let revision = 'unknown';
  try {
    revision = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
    }).trim();
  } catch {}
  return { revision, files: sources.map(([file]) => file), records };
}
