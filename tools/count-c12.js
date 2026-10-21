/* tools/count-c12.js — count Class 12 content per chapter (v86 audit) */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
function runScripts(files) {
  const sb = { console };
  sb.window = sb; sb.self = sb;
  vm.createContext(sb);
  files.forEach((f, i) => {
    const tail = i === files.length - 1 ? "\n;globalThis.__APP_DATA=APP_DATA;globalThis.__C12_DATA=C12_DATA;globalThis.__CR=ClassRegistry;" : "";
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8") + tail, sb, { filename: f });
  });
  return sb;
}
/* every expansion unit participates when present, so the counter
   always reports the live post-expansion totals */
const UNITS = ["data-12a.js", "data-12b.js", "data-12c.js", "data-12d.js", "data-12e.js",
  "data-12f.js", "data-12g.js", "data-12h.js", "data-12i.js", "data-12j.js",
  "data-12k.js", "data-12l.js"].filter(f => fs.existsSync(path.join(ROOT, f)));
const sb = runScripts(["data.js", "data-12.js"].concat(UNITS, ["classes.js"]));
const APP_DATA = sb.__APP_DATA, C12_DATA = sb.__C12_DATA, CR = sb.__CR;
CR.install(APP_DATA, C12_DATA);

const chs = C12_DATA.chapters;
let tot = { practice: 0, quiz: 0, fc: 0, iq: 0, cases: 0 };
const rows = [];
chs.forEach(c => {
  const cont = C12_DATA.content[c.id] || {};
  const practice = (cont.numericals || []).length;
  const quiz = C12_DATA.quiz.filter(q => q.chapter === c.id).length;
  const fc = C12_DATA.flashcards.filter(q => q.chapter === c.id).length;
  const iq = (C12_DATA.importantQuestions[c.id] || []).length;
  const a = cont.activity || null;
  let cases = 0;
  if (a) {
    ["cases", "items", "questions", "entries", "problems", "sets", "rounds", "tasks", "statements"].forEach(k => {
      if (Array.isArray(a[k])) cases = Math.max(cases, a[k].length);
    });
    if (!cases && Array.isArray(a.pairs)) cases = a.pairs.length;
    if (!cases) cases = 1;
  }
  tot.practice += practice; tot.quiz += quiz; tot.fc += fc; tot.iq += iq; tot.cases += cases;
  rows.push([c.id, practice, quiz, fc, iq, (a ? a.type + "(" + cases + ")" : "NONE")].join(" | "));
});
console.log("ch  | practice | quiz | flashcards | impQ | activity");
rows.forEach(r => console.log(r));
console.log("TOTALS", JSON.stringify(tot));
console.log("C12 quiz:", C12_DATA.quiz.length, "flashcards:", C12_DATA.flashcards.length, "APP_DATA.quiz:", APP_DATA.quiz.length, "APP_DATA.flashcards:", APP_DATA.flashcards.length);
const idc = {}; C12_DATA.quiz.forEach(q => { idc[q.id] = (idc[q.id] || 0) + 1; });
console.log("dup quiz ids:", Object.keys(idc).filter(k => idc[k] > 1));
const idf = {}; C12_DATA.flashcards.forEach(q => { idf[q.id] = (idf[q.id] || 0) + 1; });
console.log("dup fc ids:", Object.keys(idf).filter(k => idf[k] > 1));
// sample structures
console.log("\n-- sample quiz:", JSON.stringify(C12_DATA.quiz[0]));
console.log("\n-- sample flashcard:", JSON.stringify(C12_DATA.flashcards[0]));
console.log("\n-- sample numerical:", JSON.stringify((C12_DATA.content.pf.numericals || [])[0]));
console.log("\n-- sample iq:", JSON.stringify(C12_DATA.importantQuestions.pf[0]));
console.log("\n-- activity keys pf:", JSON.stringify(Object.keys(C12_DATA.content.pf.activity)));
