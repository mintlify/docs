const fs = require("fs");
const path = require("path");
const dirs = ["agent","ai","assistant"];
const files = [];
for (const d of dirs) for (const f of fs.readdirSync(d)) if (f.endsWith(".mdx")) files.push(path.join(d,f));
for (const p of files) {
  let text = fs.readFileSync(p,"utf8");
  text = text.replace(/^---[\s\S]*?---\n/, "");
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/<[^>]+>/g, "");
  const lines = text.split("\n");
  lines.forEach((line, idx) => {
    line = line.trim();
    if (!line) return;
    if (/^(#|[-*|]|\d+\.)/.test(line)) return;
    const sents = line.split(/(?<=[.!?])\s+/);
    for (const s of sents) {
      const words = (s.match(/\b[\w'-]+\b/g) || []);
      if (words.length > 30) console.log(`${p}:${idx+1} [${words.length}w] ${s.slice(0,260)}`);
    }
  });
}
