/**
 * The agent setup prompt lives in two files:
 *
 *   snippets/setup-agent-prompt.mdx       — <Prompt> card used on the quickstart
 *   snippets/setup-agent-prompt-text.mdx  — the same text as a JS string, used by
 *                                           the introduction page's own prompt card
 *
 * They have to be separate because the <Prompt> component serializes its
 * children's *source* rather than evaluating them, so it cannot be handed a
 * variable. This script fails CI if the two ever drift apart.
 */

import { readFileSync } from "node:fs";

const CARD = "snippets/setup-agent-prompt.mdx";
const TEXT = "snippets/setup-agent-prompt-text.mdx";

function fromPromptCard(path) {
  const lines = readFileSync(path, "utf8").split("\n");
  const open = lines.findIndex((l) => l.startsWith("<Prompt"));
  const close = lines.findIndex((l) => l.trim() === "</Prompt>");
  if (open === -1 || close === -1 || close < open) {
    throw new Error(`${path}: could not find a <Prompt>...</Prompt> block`);
  }
  return lines.slice(open + 1, close).join("\n").trim();
}

function fromConstant(path) {
  const src = readFileSync(path, "utf8");
  const match = src.match(/export const SETUP_AGENT_PROMPT = `([\s\S]*)`;/);
  if (!match) {
    throw new Error(`${path}: could not find the SETUP_AGENT_PROMPT template literal`);
  }
  return match[1]
    .replace(/\\`/g, "`")
    .replace(/\\\$\{/g, "${")
    .replace(/\\\\/g, "\\")
    .trim();
}

const card = fromPromptCard(CARD);
const text = fromConstant(TEXT);

if (card === text) {
  console.log(`The setup prompt matches in ${CARD} and ${TEXT}.`);
  process.exit(0);
}

const cardLines = card.split("\n");
const textLines = text.split("\n");
const firstDiff = cardLines.findIndex((line, i) => line !== textLines[i]);

console.error(`The setup prompt has drifted between ${CARD} and ${TEXT}.`);
console.error("Edit one, then copy the change into the other.\n");

if (firstDiff !== -1) {
  console.error(`First difference at line ${firstDiff + 1}:`);
  console.error(`  ${CARD}:\n    ${cardLines[firstDiff] ?? "(missing)"}`);
  console.error(`  ${TEXT}:\n    ${textLines[firstDiff] ?? "(missing)"}`);
} else {
  console.error(`${CARD} has ${cardLines.length} lines, ${TEXT} has ${textLines.length}.`);
}

process.exit(1);
