/* tools/dup-scan-c12.js — one-off v86 audit: near-duplicate detection
   across every Class 12 question surface (practice, quiz, examCases,
   examNumericals). Reports pairs whose normalized text overlaps heavily.
   Run: node tools/dup-scan-c12.js  */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const UNITS = ["data-12a.js", "data-12b.js", "data-12c.js", "data-12d.js", "data-12e.js",
  "data-12f.js", "data-12g.js", "data-12h.js", "data-12i.js", "data-12j.js",
  "data-12k.js", "data-12l.js"].filter(f => fs.existsSync(path.join(ROOT, f)));
const sb = { console }; sb.window = sb; sb.self = sb; vm.createContext(sb);
["data.js", "data-12.js"].concat(UNITS, ["classes.js"]).forEach((f, i, arr) => {
  const tail = i === arr.length - 1 ? "\n;globalThis.__C12=C12_DATA;" : "";
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8") + tail, sb, { filename: f });
});
const C12 = sb.__C12;

const items = [];
C12.chapters.forEach(c => {
  const cont = C12.content[c.id] || {};
  (cont.numericals || []).forEach((n, i) => items.push({ k: `practice:${c.id}#${n.id != null ? n.id : i}`, t: n.question, o: n.options }));
  (cont.examCases || []).forEach((e, i) => {
    items.push({ k: `case:${c.id}#${e.id != null ? e.id : i}`, t: (e.title || "") + " " + (e.passage || ""), o: null });
    (e.subs || []).forEach((s, j) => items.push({ k: `case:${c.id}#${e.id || i}.s${j}`, t: s.q, o: s.options }));
  });
  (cont.examNumericals || []).forEach((e, i) => items.push({ k: `examNum:${c.id}#${e.id != null ? e.id : i}`, t: e.q, o: null }));
});
C12.quiz.forEach(q => items.push({ k: `quiz:${q.chapter}#${q.id}`, t: q.q, o: q.options }));

const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set(["the", "a", "an", "of", "is", "are", "to", "in", "and", "for", "on", "at", "by", "or", "it", "be", "as", "with"]);
const words = s => new Set(norm(s).split(" ").filter(w => w.length > 2 && !STOP.has(w)));
const jac = (A, B) => {
  if (!A.size || !B.size) return 0;
  let inter = 0; A.forEach(w => { if (B.has(w)) inter++; });
  return inter / (A.size + B.size - inter);
};

const prepared = items.map(it => ({ ...it, n: norm(it.t), w: words(it.t) }));
let hits = 0;
for (let i = 0; i < prepared.length; i++) {
  for (let j = i + 1; j < prepared.length; j++) {
    const a = prepared[i], b = prepared[j];
    if (a.k.split(":")[0] !== b.k.split(":")[0]) continue;   // same surface only
    const s = jac(a.w, b.w);
    if (s >= 0.62) {
      hits++;
      console.log(`  ${(s * 100).toFixed(0)}%  [${a.k}] vs [${b.k}]`);
      console.log(`        A: ${a.t.slice(0, 110)}`);
      console.log(`        B: ${b.t.slice(0, 110)}`);
    }
  }
}
console.log(`\nscanned ${prepared.length} items — ${hits} near-duplicate pair(s) at >=62% overlap`);
