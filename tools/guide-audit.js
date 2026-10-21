/* guide-audit.js — authoring/verification reference for guided-learning.js.
   Loads the real data pipeline (exactly like the browser and the tests)
   and prints, for every Class 11 + Class 12 chapter:
     - the exact theory block headings (simple + advanced) so diagram
       placement (`after`) can target a real heading;
     - the practice-bank question ids with difficulty and first words,
       so checkpoint questions can be chosen to match the taught topic
       and ordered easy -> medium -> hard;
     - the existing check-your-understanding questions.
   Usage:  node tools/guide-audit.js            (all chapters)
           node tools/guide-audit.js intro brs  (selected chapters) */
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

const D = sandbox.__D;
const C11 = ["intro", "terms", "tbase", "basis", "equation", "debitCredit", "journal", "ledger", "cashBook", "specialBooks2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
const C12 = ["pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin", "fsa", "rat", "cf", "ca"];
const want = process.argv.slice(2);
const keys = want.length ? want : C11.concat(C12);

keys.forEach((key) => {
  const sec = D[key];
  if (!sec) { console.log("== " + key + ": MISSING =="); return; }
  console.log("\n========================================");
  console.log("== " + key + " — " + ((sec.title) || ""));
  const simple = (sec.theory && sec.theory.simple) || [];
  const adv = (sec.theory && sec.theory.advanced) || [];
  console.log("-- simple block headings (" + simple.length + "):");
  simple.forEach((b, i) => console.log("   [" + i + "] " + b.h));
  console.log("-- advanced block headings (" + adv.length + "):");
  adv.forEach((b, i) => console.log("   [" + i + "] " + b.h));
  const nums = sec.numericals || [];
  console.log("-- numericals (" + nums.length + "):");
  nums.forEach((q) => {
    const text = (q.question || q.q || "").replace(/\s+/g, " ").slice(0, 110);
    console.log("   id=" + q.id + " [" + q.difficulty + "] " + text);
  });
  const up = sec.upgrade;
  if (up && up.check) {
    console.log("-- existing check questions (" + up.check.length + "):");
    up.check.forEach((c, i) => console.log("   Q" + (i + 1) + ": " + c.q.replace(/\s+/g, " ").slice(0, 110)));
  }
});
