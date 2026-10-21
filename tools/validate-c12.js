/* ============================================================
   tools/validate-c12.js — v86 Class 12 content validator.
   Loads every Class 12 data unit exactly the way the browser does
   (data.js → data-12.js → data-12a..j.js → classes.js) and checks
   the expanded content against the project's schema:

     · every one of the 13 chapters carries the target minimums
       (practice 25, quiz 25, flashcards 20, important questions 15,
       interactive cases 6)
     · every MCQ has >= 2 options, an in-range answerIndex, a
       non-empty explanation and valid Easy/Medium/Hard metadata
     · every numerical's stated answer agrees with the option the
       answerIndex points at (the explanation must mention the same
       figure)
     · ids are unique inside each bank and never collide with the
       other class
     · flashcards have a front and a back
     · important questions carry type, marks, q and answer
     · every activity case validates against its engine's schema

   Run:  node tools/validate-c12.js        (exit 1 on any failure)
   ============================================================ */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

const FILES = ["data.js", "data-12.js", "data-12a.js", "data-12b.js", "data-12c.js",
  "data-12d.js", "data-12e.js", "data-12f.js", "data-12g.js", "data-12h.js",
  "data-12i.js", "data-12j.js", "data-12k.js", "data-12l.js", "classes.js"];

const MIN = { practice: 25, quiz: 25, flashcards: 20, iq: 15, cases: 6 };

let errors = [], warnings = [];
const err = m => errors.push(m);
const warn = m => warnings.push(m);

function loadAll(files) {
  const sb = { console };
  sb.window = sb; sb.self = sb;
  vm.createContext(sb);
  const present = files.filter(f => fs.existsSync(path.join(ROOT, f)));
  /* load the data units first and snapshot the PRISTINE Class 11
     banks, then load classes.js — its browser self-install merges the
     Class 12 arrays into APP_DATA as soon as it evaluates. The data
     units declare APP_DATA with const, so it is only reachable from
     code evaluated in this same context: the snapshot therefore runs
     as an appended tail expression. */
  present.slice(0, -1).forEach(f => {
    /* a half-written sibling unit must not block another unit from
       being validated — record it and keep going */
    try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sb, { filename: f }); }
    catch (e) { sb.__loadErrors = sb.__loadErrors || []; sb.__loadErrors.push(f + ": " + e.message); }
  });
  vm.runInContext(
    "\n;globalThis.__c11QuizIds=(APP_DATA.quiz||[]).map(function(q){return q.id;});" +
    "globalThis.__c11FcIds=(APP_DATA.flashcards||[]).map(function(q){return q.id;});", sb);
  vm.runInContext(fs.readFileSync(path.join(ROOT, present[present.length - 1]), "utf8") +
    "\n;globalThis.__A=APP_DATA;globalThis.__C12=C12_DATA;globalThis.__CR=ClassRegistry;",
    sb, { filename: present[present.length - 1] });
  return sb;
}

const sb = loadAll(FILES);
(sb.__loadErrors || []).forEach(m => warn("a sibling unit could not be loaded (ignore unless it is yours): " + m));
const APP_DATA = sb.__A, C12 = sb.__C12, CR = sb.__CR;
/* cross-class collision check, using the pre-install Class 11 banks */
const c11QuizIds = new Set(sb.__c11QuizIds);
const c11FcIds = new Set(sb.__c11FcIds);
C12.quiz.forEach(q => { if (c11QuizIds.has(q.id)) err("quiz id " + q.id + " collides with Class 11"); });
C12.flashcards.forEach(q => { if (c11FcIds.has(q.id)) err("flashcard id " + q.id + " collides with Class 11"); });
CR.install(APP_DATA, C12);
const audit = CR.auditIds(APP_DATA, C12);
audit.forEach(e => err("class audit: " + e));

const DIFFS = { Easy: 1, Medium: 1, Hard: 1 };

function checkMcq(q, where, opts) {
  opts = opts || {};
  if (!q || typeof q !== "object") { err(where + ": not an object"); return; }
  const text = q.q || q.question;
  if (typeof text !== "string" || text.trim().length < 8) err(where + ": empty/short question text");
  if (!Array.isArray(q.options) || q.options.length < 2) { err(where + ": needs >= 2 options"); return; }
  if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length) {
    err(where + ": answerIndex " + q.answerIndex + " out of range (0.." + (q.options.length - 1) + ")"); return;
  }
  /* case sub-questions carry their working in `reasoning` */
  const expl = String(opts.explanationOf ? opts.explanationOf(q) : q.explanation);
  if (expl.trim().length < 10) err(where + ": missing explanation/reasoning");
  if (!opts.skipDifficulty && !DIFFS[q.difficulty]) err(where + ": bad difficulty " + JSON.stringify(q.difficulty));
  const correct = String(q.options[q.answerIndex]);
  const uniq = new Set(q.options.map(o => String(o).trim().toLowerCase()));
  if (uniq.size !== q.options.length) err(where + ": duplicate options " + JSON.stringify(q.options));
  /* the explanation must agree with the option it calls correct.
     The figure check only applies when the option IS (essentially) a
     number or a number + unit word — a prose option such as "An
     inflow of ₹5,000" explains the reasoning in words, so forcing the
     explanation to repeat every token would produce false alarms. */
  const digits = s => (String(s).match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => x.replace(/,/g, ""));
  const UNIT_ONLY = /^(?:times?|years?|purchase|of|the|a|an|per|annum|months?|%|x|×|:|-|\s)*$/i;
  const core = correct.replace(/[\d,₹%.\s×x\-]/g, "");
  const isNumericAnswer = core === "" || UNIT_ONLY.test(correct.replace(/[\d,₹%.\s×x\-]/g, " "));
  if (isNumericAnswer) {
    const correctNums = digits(correct);
    if (correctNums.length) {
      const explNums = digits(expl);
      const missing = correctNums.filter(n => !explNums.some(e => e === n || Math.abs(parseFloat(e) - parseFloat(n)) < 0.011));
      if (missing.length) err(where + ": explanation never states the correct figure " + missing.join(",") + " (correct = " + correct + ")");
    }
  }
  if (/₹|Rs\.?\s?\d/.test(correct) && !/₹|Rs\.?/i.test(expl)) warn(where + ": money answer with no rupee sign in the explanation");
}

function checkFlashcard(c, where) {
  if (!c || typeof c !== "object") { err(where + ": not an object"); return; }
  if (typeof c.front !== "string" || c.front.trim().length < 6) err(where + ": empty front");
  if (typeof c.back !== "string" || c.back.trim().length < 6) err(where + ": empty back");
  if (c.front && c.back && c.front.trim() === c.back.trim()) err(where + ": front equals back");
}

function checkIQ(q, where) {
  if (!q || typeof q !== "object") { err(where + ": not an object"); return; }
  if (typeof q.q !== "string" || q.q.trim().length < 10) err(where + ": empty question");
  if (typeof q.answer !== "string" || q.answer.trim().length < 20) err(where + ": answer too short to be useful");
  if (typeof q.marks !== "number" || q.marks <= 0) err(where + ": bad marks");
  const okType = ["Short Answer", "Long Answer", "Case-Based", "Assertion-Reason"];
  if (okType.indexOf(q.type) === -1) err(where + ": unknown type " + JSON.stringify(q.type));
}

function checkActivity(act, chId) {
  if (!act || !act.type) { err(chId + ": no activity"); return 0; }
  const t = act.type;
  let cases = [];
  if (t === "journal") {
    cases = act.entries || [];
    cases.forEach((en, i) => {
      const w = chId + ".activity.entries[" + i + "]";
      if (!en || typeof en.prompt !== "string" || en.prompt.trim().length < 8) err(w + ": empty prompt");
      if (!Array.isArray(en.dr) || en.dr.length < 2) err(w + ": needs >= 2 debit choices");
      if (!Array.isArray(en.cr) || en.cr.length < 2) err(w + ": needs >= 2 credit choices");
      if (typeof en.drAccount !== "string" || !en.dr) err(w + ": missing drAccount");
      else if (en.dr.indexOf(en.drAccount) === -1) err(w + ": drAccount not among dr choices");
      if (typeof en.crAccount !== "string" || !en.cr) err(w + ": missing crAccount");
      else if (en.cr.indexOf(en.crAccount) === -1) err(w + ": crAccount not among cr choices");
      if (typeof en.amount !== "number" || !isFinite(en.amount)) err(w + ": bad amount");
    });
  } else if (t === "calc") {
    cases = act.problems || [];
    cases.forEach((pr, i) => {
      const w = chId + ".activity.problems[" + i + "]";
      if (!pr || typeof pr.prompt !== "string" || pr.prompt.trim().length < 8) err(w + ": empty prompt");
      if (!Array.isArray(pr.inputs) || !pr.inputs.length) { err(w + ": no inputs"); return; }
      if (!pr.answers || typeof pr.answers !== "object") { err(w + ": no answers"); return; }
      pr.inputs.forEach(inp => {
        if (!inp || !inp.key) { err(w + ": input without key"); return; }
        const a = pr.answers[inp.key];
        if (typeof a !== "number" || !isFinite(a)) err(w + ": answers." + inp.key + " not numeric");
        const inPrompt = String(pr.prompt).replace(/[, ]/g, "").indexOf(String(a).replace(/,/g, "")) !== -1;
        if (inPrompt === false) {
          /* the figure may be given in a different phrasing; only warn */
          warn(w + ": answer " + a + " for '" + inp.key + "' not literally found in the prompt — double-check it");
        }
      });
    });
  } else if (t === "statement") {
    cases = act.statements || [];
    cases.forEach((st, i) => {
      const w = chId + ".activity.statements[" + i + "]";
      if (!Array.isArray(st.rows) || !st.rows.length) { err(w + ": no rows"); return; }
      if (!st.title && !st.prompt) warn(w + ": neither title nor prompt");
      st.rows.forEach((r, ri) => {
        if (!r || typeof r.label !== "string" || !r.label.trim()) err(w + ".rows[" + ri + "]: empty label");
        if (typeof r.answer !== "string" || !r.answer) err(w + ".rows[" + ri + "]: no answer");
        if (Array.isArray(r.options) && r.options.indexOf(r.answer) === -1) err(w + ".rows[" + ri + "]: answer not among options");
        if (st.needsAmount && r.amount != null && typeof r.amount !== "number") err(w + ".rows[" + ri + "]: bad amount");
      });
    });
  } else if (t === "classify" || t === "match") {
    cases = act.sets || [];
    cases.forEach((set, i) => {
      const w = chId + ".activity.sets[" + i + "]";
      if (t === "classify") {
        if (!Array.isArray(set.buckets) || set.buckets.length < 2) err(w + ": needs >= 2 buckets");
        if (!Array.isArray(set.items) || !set.items.length) { err(w + ": no items"); return; }
        set.items.forEach((it, ii) => {
          if (!it || typeof it.label !== "string" || !it.label.trim()) err(w + ".items[" + ii + "]: empty label");
          else if (set.buckets.indexOf(it.bucket) === -1) err(w + ".items[" + ii + "]: bucket not in buckets list");
        });
      } else {
        if (!Array.isArray(set.pairs) || set.pairs.length < 2) { err(w + ": needs >= 2 pairs"); return; }
        const rights = set.pairs.map(p => p && p.right);
        if (new Set(rights).size !== rights.length) err(w + ": duplicate right-hand partners");
        set.pairs.forEach((p, ii) => {
          if (!p || typeof p.left !== "string" || !p.left.trim()) err(w + ".pairs[" + ii + "]: empty left");
          if (!p || typeof p.right !== "string" || !p.right.trim()) err(w + ".pairs[" + ii + "]: empty right");
        });
      }
    });
  } else {
    err(chId + ": unknown activity type " + JSON.stringify(t));
    return 0;
  }
  return cases.length;
}

/* ---------------- run the checks ---------------- */
/* Optional argv chapter ids limit BOTH the report and the minimum
   checks to those chapters (everything is still loaded, so cross-bank
   id-collision checks still see the whole registry). */
const ONLY = process.argv.slice(2).filter(a => !a.startsWith("-"));
const only = id => !ONLY.length || ONLY.indexOf(id) !== -1;
const rows = [];
let totals = { practice: 0, quiz: 0, flashcards: 0, iq: 0, cases: 0, examCases: 0, examNumericals: 0 };

C12.chapters.forEach(c => {
  if (!only(c.id)) return;
  const cont = C12.content[c.id] || {};
  const practice = cont.numericals || [];
  const quiz = C12.quiz.filter(q => q.chapter === c.id);
  const fc = C12.flashcards.filter(q => q.chapter === c.id);
  const iq = C12.importantQuestions[c.id] || [];
  const cases = checkActivity(cont.activity, c.id);
  const examCases = cont.examCases || [], examNumericals = cont.examNumericals || [];

  practice.forEach((q, i) => checkMcq(q, c.id + ".numericals[" + (q.id != null ? q.id : i + 1) + "]"));
  quiz.forEach(q => checkMcq(q, "quiz#" + q.id));
  fc.forEach(q => checkFlashcard(q, "flashcard#" + q.id));
  iq.forEach((q, i) => checkIQ(q, c.id + ".iq[" + (i + 1) + "]"));
  examCases.forEach((ec, i) => {
    const w = c.id + ".examCases[" + (ec.id != null ? ec.id : i + 1) + "]";
    if (typeof ec.passage !== "string" || ec.passage.trim().length < 20) err(w + ": passage too short");
    if (!Array.isArray(ec.subs) || ec.subs.length < 2) err(w + ": needs >= 2 sub-questions");
    else ec.subs.forEach((s, si) => checkMcq(s, w + ".subs[" + (si + 1) + "]", {
      skipDifficulty: true,
      explanationOf: x => x.reasoning || x.explanation || ""
    }));
  });
  examNumericals.forEach((n, i) => {
    const w = c.id + ".examNumericals[" + (n.id != null ? n.id : i + 1) + "]";
    if (typeof n.q !== "string" || n.q.trim().length < 8) err(w + ": empty q");
    if (typeof n.value !== "number" || !isFinite(n.value)) err(w + ": value not numeric");
    if (typeof n.explanation !== "string" || n.explanation.trim().length < 10) err(w + ": no explanation");
  });

  /* duplicate detection inside each bank */
  const seenP = new Set();
  practice.forEach(q => { if (seenP.has(q.id)) err(c.id + ": duplicate practice id " + q.id); seenP.add(q.id); });

  totals.practice += practice.length; totals.quiz += quiz.length;
  totals.flashcards += fc.length; totals.iq += iq.length; totals.cases += cases;
  totals.examCases += examCases.length; totals.examNumericals += examNumericals.length;

  const short = (v, min) => v >= min ? String(v) : (v + " !!");
  rows.push([
    c.id.padEnd(5),
    short(practice.length, MIN.practice).padEnd(8),
    short(quiz.length, MIN.quiz).padEnd(8),
    short(fc.length, MIN.flashcards).padEnd(8),
    short(iq.length, MIN.iq).padEnd(8),
    short(cases, MIN.cases).padEnd(8),
    String(examCases.length).padEnd(10),
    String(examNumericals.length)
  ].join(" | "));

  [["practice", practice.length, MIN.practice], ["quiz", quiz.length, MIN.quiz],
   ["flashcards", fc.length, MIN.flashcards], ["important questions", iq.length, MIN.iq],
   ["interactive cases", cases, MIN.cases]].forEach(([name, v, min]) => {
    if (v < min) err(c.id + ": " + name + " = " + v + " (minimum " + min + ")");
  });
});

console.log("ch   | practice | quiz    | fc       | impQ    | cases   | examCases | examNum");
console.log(rows.join("\n"));
console.log("TOTALS " + JSON.stringify(totals));
console.log("C12 totals: quiz=" + C12.quiz.length + " flashcards=" + C12.flashcards.length);
console.log("merged APP_DATA: quiz=" + APP_DATA.quiz.length + " flashcards=" + APP_DATA.flashcards.length +
  " importantQuestions=" + Object.keys(APP_DATA.importantQuestions).length);


console.log("\n" + "=".repeat(60));
if (warnings.length) { console.log("WARNINGS (" + warnings.length + ")"); warnings.slice(0, 60).forEach(w => console.log("  ~ " + w)); if (warnings.length > 60) console.log("  … " + (warnings.length - 60) + " more"); }
if (errors.length) { console.log("ERRORS (" + errors.length + ")"); errors.slice(0, 80).forEach(e => console.log("  ✗ " + e)); if (errors.length > 80) console.log("  … " + (errors.length - 80) + " more"); }
else console.log("No errors.");
process.exit(errors.length ? 1 : 0);
