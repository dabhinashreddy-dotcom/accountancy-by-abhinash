/* tools/guide-ref.js — v94 authoring reference. Prints, per chapter:
   theory block headings (diagram anchors), bank question ids with
   difficulty and first 90 chars, and for non-MCQ chapters the answer
   fields the checkpoint needs. Usage: node tools/guide-ref.js [key...] */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
function run(file, tail) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8") + (tail || ""), sandbox, { filename: file });
}
run("data.js", "\n;globalThis.__D = APP_DATA;");
run("data-12.js");
["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].forEach((p) => run("data-12" + p + ".js"));
run("classes.js", "\n;if (typeof ClassRegistry !== 'undefined') ClassRegistry.install();");
run("theory-upgrade.js");
run("guided-learning.js");
const D = sandbox.__D;
const KEYS = process.argv.slice(2).length ? process.argv.slice(2) :
  ["terms", "tbase", "basis", "equation", "debitCredit", "journal", "ledger", "cashBook", "specialBooks2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj",
   "pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin", "fsa", "rat", "cf", "ca"];
const short = (s, n) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, n || 90);
KEYS.forEach((key) => {
  const sec = D[key];
  if (!sec) { console.log("== " + key + " MISSING =="); return; }
  console.log("\n========================================\n== " + key + (sec.guide ? " (guide: AUTHORED)" : " (guide: none)"));
  const simple = (sec.theory && sec.theory.simple) || [];
  const advanced = (sec.theory && sec.theory.advanced) || [];
  console.log("-- simple headings (" + simple.length + "):");
  simple.forEach((b, i) => console.log("   [" + i + "] " + b.h));
  console.log("-- advanced headings (" + advanced.length + "):");
  advanced.forEach((b, i) => console.log("   [" + i + "] " + b.h));
  const bank = sec.numericals || [];
  console.log("-- numericals (" + bank.length + "):");
  bank.forEach((q) => {
    let line = "   id=" + q.id + " [" + q.difficulty + "] " + short(q.question || q.q || q.transaction, 88);
    if (q.options) line += "  opts=" + q.options.length;
    if (q.answerIndex !== undefined) line += " ans=" + q.answerIndex;
    if (key === "cashBook" || key === "specialBooks2" || key === "brs") line += "  ans=" + short(q.answer, 44);
    if (key === "ledger" || key === "journal") {
      if (q.entries) line += "  | " + q.entries.map((e) => short(e.particulars, 26)).join(" / ");
    }
    console.log(line);
  });
});
