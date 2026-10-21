/* Class system — dual-class integrity, Class 12 content completeness,
   blueprint bank sufficiency, shared-tool single instances,
   class-aware SEO/routes, and offline precache.
   Run:  node tests/class-system-tests.js   (Node 18+, no packages.)
   Dev only, not loaded by the website.

   Executed, not asserted:
     A  the Class 12 registry installs into the real APP_DATA with
        zero audit errors, Class 11 keeps its exact 18-chapter
        structure, and data.js is still byte-identical to the v82
        release (the strongest C11 regression guarantee available)
     B  every one of the 13 Class 12 chapters carries the full
        teaching set — theory blocks, concepts, formats, exactly 10
        practice MCQs, a schema-valid activity with at least 8
        cases for its engine, at least 3 exam cases and 4 exam
        numericals, a complete quick revision, a mind map, 15
        important questions, exactly 25 quiz entries and 20
        flashcards on their reserved id ranges (70001–70325 and
        71001–71260)
     C  the bank builds from the installed data, the Class 12 CBSE
        board mock draws its 80-mark / 36-question blueprint on
        every seed with the official unit totals, the Class 11 mock
        still draws, every fixed paper fills its question count,
        and no C12 quiz/flashcard id is ever dropped as a duplicate
     D  the shared tools stay single instances and both classes are
        served by them: the AI Tutor knowledge base answers Class 12
        queries, and the search index carries all 13 new chapters
     E  SEO config exposes all 43 public routes including the 14
        Class 12 ones, and app.js wires the class system end to end
     F  the service worker precaches every Class 12 file and every
        script/asset the pages reference exists on disk
*/
const fs = require("fs"), vm = require("vm"), path = require("path"), crypto = require("crypto");
const ROOT = path.resolve(__dirname, "..");
const ExamRules = require(path.join(ROOT, "exam-rules.js"));
const QuestionBank = require(path.join(ROOT, "question-bank.js"));
const SEO = require(path.join(ROOT, "seo-config.js"));
const AIK = require(path.join(ROOT, "ai-knowledge.js"));
const SiteSearch = require(path.join(ROOT, "search-index.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); console.log("-".repeat(Math.max(t.length, 58))); }
function detail(o) { try { return JSON.stringify(o); } catch (e) { return String(o); } }

const C11_IDS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "lg",
                 "cb", "sp2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
/* sha256 of data.js in the user-supplied v82 release zip — any edit to
   the original Class 11 content trips this. */
const V82_DATA_SHA = "3938332eb94e4942087e8df36d704ae93bdd3f7810442f943d8719d7bec5f94c";

/* ---- load the site exactly as the browser does: classic scripts in
   order, then the self-installing registry ---------------------- */
function runScripts(files, extraTail) {
  const sb = { console };
  sb.window = sb; sb.self = sb;
  vm.createContext(sb);
  files.forEach((f, i) => {
    const tail = i === files.length - 1 ? (extraTail || "") : "";
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8") + tail, sb, { filename: f });
  });
  return sb;
}
/* the eleven Class 12 units, exactly as index.html loads them (f–l are
   the v86 expansion units; missing ones simply fail the content floors) */
const C12_UNITS = ["data-12a.js", "data-12b.js", "data-12c.js", "data-12d.js", "data-12e.js",
  "data-12f.js", "data-12g.js", "data-12h.js", "data-12i.js", "data-12j.js",
  "data-12k.js", "data-12l.js"].filter(f => fs.existsSync(path.join(ROOT, f)));
const site = runScripts(
  ["data.js", "data-12.js"].concat(C12_UNITS, ["classes.js"]),
  ";globalThis.__A=(typeof APP_DATA!=='undefined')?APP_DATA:null;" +
  ";globalThis.__C=(typeof C12_DATA!=='undefined')?C12_DATA:null;" +
  ";globalThis.__R=(typeof ClassRegistry!=='undefined')?ClassRegistry:null;");
const APP = site.__A, C12 = site.__C, ClassRegistry = site.__R;
const C11 = runScripts(["data.js"], ";globalThis.__P=APP_DATA;").__P;   // pristine v82 banks

let EXPANDED = null;
const EXP_FILE = path.join(ROOT, "questions-expanded.js");
if (fs.existsSync(EXP_FILE)) {
  const sb2 = { console }; sb2.window = sb2; vm.createContext(sb2);
  vm.runInContext(fs.readFileSync(EXP_FILE, "utf8") +
    ";globalThis.__X=(typeof EXAM_QUESTIONS_EXPANDED!=='undefined')?EXAM_QUESTIONS_EXPANDED:null;", sb2);
  EXPANDED = sb2.__X;
}

const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const swSrc = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");

const C12_IDS = (C12.chapters || []).map(c => c.id);

console.log("Class system — dual-class integrity suite");
console.log("=".repeat(60));
console.log(`Class 11: ${(APP.chapters || []).length} chapters · Class 12: ${C12_IDS.length} chapters (${C12_IDS.join(", ")})`);

/* ================================================================
   A. registry + install integrity + Class 11 regression
   ================================================================ */
section("A. Registry, install and Class 11 regression");

ok(!!APP && !!C12 && !!ClassRegistry, "A1 all eight site scripts load in browser order");
eq((APP.chapters || []).length, 18, "A2 Class 11 still has its 18 chapters");
eq(C12_IDS.length, 13, "A3 the Class 12 registry declares 13 chapters");
eq(C12_IDS.join(","), "pf,gw,psr,adm,ret,dis,sc,deb,cfin,fsa,rat,cf,ca", "A4 Class 12 chapter ids are stable and syllabus-ordered");

eq(ClassRegistry.install(APP, C12), true, "A5 install() reports success");
eq(ClassRegistry.install(APP, C12), true, "A6 install() is idempotent (a second call changes nothing)");
const auditErrors = ClassRegistry.auditIds(APP, C12);
eq(auditErrors.length, 0, "A7 auditIds() finds no collisions or missing blocks", detail(auditErrors));

eq(APP.chapters.map(c => c.id).join(","), C11_IDS.join(","),
   "A8 Class 11 chapter ids and order are unchanged");

const dataSha = crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, "data.js"))).digest("hex");
eq(dataSha, V82_DATA_SHA, "A9 data.js is byte-identical to the v82 release (Class 11 content untouched)");

/* installed banks = pristine Class 11 + Class 12, nothing lost, nothing doubled
   v86: every chapter carries 25 quiz entries and 20 flashcards (13 chapters) */
const C12_QUIZ_PER_CH = 25, C12_FC_PER_CH = 20, C12_CHAPTERS = 13;
const C12_QUIZ_TOTAL = C12_QUIZ_PER_CH * C12_CHAPTERS;   /* 325 */
const C12_FC_TOTAL = C12_FC_PER_CH * C12_CHAPTERS;       /* 260 */
eq(C12.quiz.length, C12_QUIZ_TOTAL, `A10 the Class 12 quiz bank holds ${C12_QUIZ_PER_CH} entries for each of ${C12_CHAPTERS} chapters`);
eq(C12.flashcards.length, C12_FC_TOTAL, `A11 the Class 12 flashcard bank holds ${C12_FC_PER_CH} cards for each of ${C12_CHAPTERS} chapters`);
eq(APP.quiz.length, C11.quiz.length + C12_QUIZ_TOTAL, "A12 install() concatenated the quiz bank without touching Class 11",
   `${APP.quiz.length} = ${C11.quiz.length} + ${C12_QUIZ_TOTAL}`);
eq(APP.flashcards.length, C11.flashcards.length + C12_FC_TOTAL, "A13 install() concatenated the flashcards without touching Class 11",
   `${APP.flashcards.length} = ${C11.flashcards.length} + ${C12_FC_TOTAL}`);

const expectQ = new Set(), expectF = new Set();
for (let i = 70001; i <= 70000 + C12_QUIZ_TOTAL; i++) expectQ.add(String(i));
for (let i = 71001; i <= 71000 + C12_FC_TOTAL; i++) expectF.add(String(i));
const gotQ = new Set((C12.quiz || []).map(q => String(q.id)));
const gotF = new Set((C12.flashcards || []).map(f => String(f.id)));
eq(gotQ.size, C12_QUIZ_TOTAL, "A14 every Class 12 quiz id is unique");
eq(gotF.size, C12_FC_TOTAL, "A15 every Class 12 flashcard id is unique");
eq([...expectQ].every(id => gotQ.has(id)) && [...gotQ].every(id => expectQ.has(id)), true,
   `A16 Class 12 quiz ids exactly fill 70001–${70000 + C12_QUIZ_TOTAL}`);
eq([...expectF].every(id => gotF.has(id)) && [...gotF].every(id => expectF.has(id)), true,
   `A17 Class 12 flashcard ids exactly fill 71001–${71000 + C12_FC_TOTAL}`);

const c11QuizIds = new Set((C11.quiz || []).map(q => String(q.id)));
const c11FcIds = new Set((C11.flashcards || []).map(f => String(f.id)));
eq([...gotQ].some(id => c11QuizIds.has(id)), false, "A18 no Class 12 quiz id collides with a Class 11 quiz id");
eq([...gotF].some(id => c11FcIds.has(id)), false, "A19 no Class 12 flashcard id collides with a Class 11 flashcard id");

/* ================================================================
   B. per-chapter content completeness + activity engine schemas
   ================================================================ */
section("B. Class 12 content completeness (13 chapters)");

const ENGINES = ["journal", "calc", "statement", "classify", "match"];
const DIFFS = new Set(["Easy", "Medium", "Hard"]);
const QR_METHODS = ["calculationSteps", "balancingSteps", "postingRules", "addLessLogic"];

function bad(arr, test) { return (arr || []).map((x, i) => (test(x, i) ? null : i)).filter(x => x !== null); }

C12.chapters.forEach((ch, ci) => {
  const id = ch.id, c = C12.content[id];

  /* --- registry metadata --- */
  eq(ch.num, ci + 1, `B1.${id} chapter number follows the syllabus order`);
  ok([ch.name, ch.short, ch.tagline, ch.icon, ch.color, ch.unit].every(v => typeof v === "string" && v.trim()),
     `B1.${id} registry carries name/short/tagline/icon/color/unit`);

  /* --- theory: the Class 11 shape (3 simple + 3 advanced blocks) --- */
  ok(Array.isArray(c.theory.simple) && c.theory.simple.length >= 3 &&
     bad(c.theory.simple, b => b && typeof b.h === "string" && b.h.trim() && typeof b.p === "string" && b.p.trim().length > 40).length === 0,
     `B2.${id} theory.simple has ≥3 heading+paragraph blocks`);
  ok(Array.isArray(c.theory.advanced) && c.theory.advanced.length >= 3 &&
     bad(c.theory.advanced, b => b && typeof b.h === "string" && b.h.trim() && typeof b.p === "string" && b.p.trim().length > 40).length === 0,
     `B2.${id} theory.advanced has ≥3 heading+paragraph blocks`);

  /* --- concepts + formats --- */
  ok(Array.isArray(c.concepts) && c.concepts.length >= 4 &&
     bad(c.concepts, x => x && x.title && x.body).length === 0,
     `B3.${id} has ≥4 titled concepts`);

  const fmts = c.formats || [];
  ok(fmts.length >= 2, `B4.${id} has ≥2 statement formats`, "got " + fmts.length);
  let fmtBad = [];
  fmts.forEach((f, fi) => {
    if (!f || !f.title || !Array.isArray(f.head) || !f.head.length) { fmtBad.push(`#${fi} header`); return; }
    if (!Array.isArray(f.rows) || !f.rows.length) { fmtBad.push(`#${fi} rows`); return; }
    f.rows.forEach((r, ri) => {
      if (!Array.isArray(r) || r.length !== f.head.length) fmtBad.push(`#${fi} row${ri} width ${Array.isArray(r) ? r.length : "?"} != head ${f.head.length}`);
    });
  });
  eq(fmtBad.length, 0, `B4.${id} format tables are rectangular (every row matches its header)`, detail(fmtBad.slice(0, 4)));

  /* --- practice bank: exactly 25 MCQs, usable by the shared card UX --- */
  const nums = c.numericals || [];
  eq(nums.length, 25, `B5.${id} practice bank holds exactly 25 questions`);
  let numBad = [];
  nums.forEach((n, i) => {
    if (!n || typeof n.question !== "string" || n.question.trim().length < 10) numBad.push(`#${i} stem`);
    else if (!Array.isArray(n.options) || n.options.length < 4) numBad.push(`#${i} options`);
    else if (!Number.isInteger(n.answerIndex) || n.answerIndex < 0 || n.answerIndex >= n.options.length) numBad.push(`#${i} answerIndex`);
    else if (typeof n.explanation !== "string" || n.explanation.trim().length < 10) numBad.push(`#${i} explanation`);
    else if (!DIFFS.has(n.difficulty)) numBad.push(`#${i} difficulty`);
  });
  eq(numBad.length, 0, `B5.${id} every practice question is structurally sound`, detail(numBad.slice(0, 4)));

  /* --- the unique activity, validated against its engine's contract --- */
  const act = c.activity;
  ok(!!act && ENGINES.indexOf(act.type) >= 0, `B6.${id} activity uses one of the five engines`, act ? act.type : "missing");
  if (act) {
    ok(typeof act.title === "string" && act.title.trim().length > 3, `B6.${id} activity has a real title`);
    let aBad = [];
    if (act.type === "journal") {
      (act.entries || []).forEach((en, i) => {
        if (!en || typeof en.prompt !== "string" || !en.prompt.trim()) aBad.push(`#${i} prompt`);
        else if (!Array.isArray(en.dr) || !en.dr.length || !Array.isArray(en.cr) || !en.cr.length) aBad.push(`#${i} option lists`);
        else if (en.dr.indexOf(en.drAccount) < 0) aBad.push(`#${i} drAccount not among dr choices`);
        else if (en.cr.indexOf(en.crAccount) < 0) aBad.push(`#${i} crAccount not among cr choices`);
        else if (en.drAccount === en.crAccount) aBad.push(`#${i} same account on both sides`);
        else if (typeof en.amount !== "number" || !isFinite(en.amount) || en.amount <= 0) aBad.push(`#${i} amount`);
      });
      ok((act.entries || []).length >= 8 && aBad.length === 0, `B6.${id} journal lab: entries answerable and keyed`,
         aBad.length ? detail(aBad.slice(0, 4)) : `entries=${(act.entries || []).length}`);
    } else if (act.type === "calc") {
      (act.problems || []).forEach((pr, i) => {
        if (!pr || typeof pr.prompt !== "string" || !pr.prompt.trim()) aBad.push(`#${i} prompt`);
        if (!Array.isArray(pr.inputs) || !pr.inputs.length) { aBad.push(`#${i} inputs`); return; }
        const keysSeen = new Set();   // each problem is graded on its own inputs
        pr.inputs.forEach(inp => {
          if (!inp || !inp.label || !inp.key) aBad.push(`#${i} input without label/key`);
          else if (keysSeen.has(inp.key)) aBad.push(`#${i} duplicate key ${inp.key}`);
          else {
            keysSeen.add(inp.key);
            const want = (pr.answers || {})[inp.key];
            if (typeof want !== "number" || !isFinite(want)) aBad.push(`#${i} no numeric answer for ${inp.key}`);
          }
        });
      });
      ok((act.problems || []).length >= 8 && aBad.length === 0, `B6.${id} calc bench: every field has a checked answer`,
         aBad.length ? detail(aBad.slice(0, 4)) : `problems=${(act.problems || []).length}`);
    } else if (act.type === "statement") {
      (act.statements || []).forEach((st, i) => {
        if (!st || !Array.isArray(st.rows) || !st.rows.length) { aBad.push(`#${i} rows`); return; }
        st.rows.forEach((r, ri) => {
          const opts = (r && Array.isArray(r.options) && r.options.length) ? r.options : ["Add", "Less", "Ignore"];
          if (!r || typeof r.label !== "string" || !r.label.trim()) aBad.push(`#${i}row${ri} label`);
          else if (opts.indexOf(r.answer) < 0) aBad.push(`#${i}row${ri} answer "${r.answer}" not among its own options`);
          else if (st.needsAmount && r.amount == null && !/not recorded|ignore|no entry/i.test(String(r.answer))) aBad.push(`#${i}row${ri} needs an amount`);
          else if (r.amount != null && typeof r.amount !== "number") aBad.push(`#${i}row${ri} non-numeric amount`);
        });
      });
      ok((act.statements || []).length >= 8 && aBad.length === 0, `B6.${id} statement builder: every row's answer is offered and keyed`,
         aBad.length ? detail(aBad.slice(0, 4)) : `statements=${(act.statements || []).length}`);
    } else if (act.type === "classify") {
      (act.sets || []).forEach((set, i) => {
        const buckets = (set && Array.isArray(set.buckets)) ? set.buckets : [];
        if (!set || !buckets.length || new Set(buckets).size !== buckets.length) aBad.push(`#${i} buckets`);
        if (!Array.isArray(set.items) || !set.items.length) { aBad.push(`#${i} items`); return; }
        set.items.forEach((it, ii) => {
          if (!it || typeof it.label !== "string" || !it.label.trim()) aBad.push(`#${i}item${ii} label`);
          else if (buckets.indexOf(it.bucket) < 0) aBad.push(`#${i}item${ii} bucket "${it.bucket}" not offered`);
        });
      });
      ok((act.sets || []).length >= 8 && aBad.length === 0, `B6.${id} classifier: every item's bucket is offered`,
         aBad.length ? detail(aBad.slice(0, 4)) : `sets=${(act.sets || []).length}`);
    } else if (act.type === "match") {
      (act.sets || []).forEach((set, i) => {
        const pairs = (set && Array.isArray(set.pairs)) ? set.pairs : [];
        if (!pairs.length) { aBad.push(`#${i} pairs`); return; }
        const lefts = pairs.map(p => p && p.left), rights = pairs.map(p => p && p.right);
        if (lefts.some(v => !v || typeof v !== "string")) aBad.push(`#${i} left side`);
        else if (rights.some(v => !v || typeof v !== "string")) aBad.push(`#${i} right side`);
        else if (new Set(lefts).size !== lefts.length) aBad.push(`#${i} duplicate left`);
        else if (new Set(rights).size !== rights.length) aBad.push(`#${i} duplicate right (answer would be ambiguous)`);
      });
      ok((act.sets || []).length >= 8 && aBad.length === 0, `B6.${id} match-up: pairs are one-to-one`,
         aBad.length ? detail(aBad.slice(0, 4)) : `sets=${(act.sets || []).length}`);
    }
  }

  /* --- board exam material --- */
  const cases = c.examCases || [];
  ok(cases.length >= 3, `B7.${id} has ≥3 multi-part exam cases`, "got " + cases.length);
  let caseBad = [];
  cases.forEach((cs, i) => {
    if (!cs || typeof cs.passage !== "string" || cs.passage.trim().length < 20) { caseBad.push(`#${i} passage`); return; }
    if (!Array.isArray(cs.subs) || cs.subs.length < 2) { caseBad.push(`#${i} parts`); return; }
    cs.subs.forEach((s, si) => {
      if (!s || typeof s.q !== "string" || !s.q.trim()) caseBad.push(`#${i}.${si} stem`);
      else if (!Array.isArray(s.options) || s.options.length < 2) caseBad.push(`#${i}.${si} options`);
      else if (!Number.isInteger(s.answerIndex) || s.answerIndex < 0 || s.answerIndex >= s.options.length) caseBad.push(`#${i}.${si} answerIndex`);
      else if (typeof s.reasoning !== "string" || s.reasoning.trim().length < 10) caseBad.push(`#${i}.${si} working`);
    });
  });
  eq(caseBad.length, 0, `B7.${id} every exam case part is gradable with its own working`, detail(caseBad.slice(0, 4)));

  const en = c.examNumericals || [];
  ok(en.length >= 4, `B8.${id} has ≥4 numeric-answer exam questions`, "got " + en.length);
  ok(bad(en, n => n && typeof n.q === "string" && n.q.trim().length > 10 &&
                  typeof n.value === "number" && isFinite(n.value) &&
                  typeof n.explanation === "string" && n.explanation.trim().length > 10).length === 0,
     `B8.${id} numeric questions carry a value and a worked explanation`);

  /* --- quick revision, mind map, important questions --- */
  const qr = c.quickRevision || {};
  ok(typeof qr.definition === "string" && qr.definition.trim().length > 20, `B9.${id} quick revision has a definition`);
  ok(Array.isArray(qr.keyPoints) && qr.keyPoints.length >= 4, `B9.${id} quick revision has ≥4 key points`,
     "got " + ((qr.keyPoints || []).length));
  ok(QR_METHODS.some(k => Array.isArray(qr[k]) && qr[k].length), `B9.${id} quick revision has a method block`,
     "none of " + QR_METHODS.join("/"));
  ok(Array.isArray(qr.formulas) && qr.formulas.length >= 2 &&
     qr.formulas.every(f => (typeof f === "string" && f.trim()) || (f && typeof f.expr === "string" && f.expr.trim())),
     `B9.${id} quick revision has ≥2 formulas with expressions`);
  ok(Array.isArray(qr.examPoints) && qr.examPoints.length >= 1, `B9.${id} quick revision has exam points`);
  ok(Array.isArray(qr.commonMistakes) && qr.commonMistakes.length >= 1, `B9.${id} quick revision lists common mistakes`);
  ok(typeof qr.mnemonic === "string" && qr.mnemonic.trim().length > 5, `B9.${id} quick revision has a mnemonic`);
  if (Array.isArray(qr.distinctions) && qr.distinctions.length) {
    /* rows carry one cell more than the head: aspect | side A | side B.
       The shared renderer widths the table from the data, so this rule
       is what keeps every C12 comparison complete on screen. */
    let dBad = [];
    qr.distinctions.forEach((d, di) => {
      if (!d || !d.title || !Array.isArray(d.head) || d.head.length < 2) { dBad.push(`#${di} head`); return; }
      (d.rows || []).forEach((r, ri) => {
        if (!Array.isArray(r) || r.length !== d.head.length + 1) dBad.push(`#${di}row${ri} width ${Array.isArray(r) ? r.length : "?"} != head+1 ${d.head.length + 1}`);
      });
    });
    eq(dBad.length, 0, `B9.${id} distinction rows are [aspect, side A, side B]`, detail(dBad.slice(0, 4)));
  }

  const mm = C12.mindmaps[id];
  ok(!!mm && typeof mm.center === "string" && mm.center.trim() &&
     Array.isArray(mm.branches) && mm.branches.length >= 3 &&
     mm.branches.every(b => b && b.label && Array.isArray(b.children) && b.children.length >= 2),
     `B10.${id} mind map has a centre and ≥3 branches of ≥2 leaves`);

  const iq = C12.importantQuestions[id] || [];
  ok(iq.length >= 15, `B11.${id} has ≥15 board-pattern important questions`, "got " + iq.length);
  ok(iq.every(q => q && q.type && typeof q.marks === "number" && q.marks >= 1 &&
                   typeof q.q === "string" && q.q.trim().length > 15 &&
                   typeof q.answer === "string" && q.answer.trim().length > 30),
     `B11.${id} every important question carries type, marks, question and answer`);

  const chQuiz = (C12.quiz || []).filter(q => q.chapter === id);
  eq(chQuiz.length, 25, `B12.${id} quiz holds exactly 25 entries`);
  ok(chQuiz.every(q => typeof q.q === "string" && q.q.trim() &&
                       Array.isArray(q.options) && q.options.length === 4 &&
                       Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < q.options.length &&
                       typeof q.explanation === "string" && q.explanation.trim().length > 10 &&
                       DIFFS.has(q.difficulty)),
     `B12.${id} quiz entries are gradable and explained`);

  const chFc = (C12.flashcards || []).filter(f => f.chapter === id);
  eq(chFc.length, 20, `B12.${id} flashcard deck holds exactly 20 cards`);
  ok(chFc.every(f => typeof f.front === "string" && f.front.trim() &&
                     typeof f.back === "string" && f.back.trim().length > 10),
     `B12.${id} flashcards have a front and a substantive back`);
});

/* ================================================================
   C. the bank + every paper both classes draw
   ================================================================ */
section("C. Question bank and blueprint sufficiency");

const built = QuestionBank.build(APP, EXPANDED);
const BANK = built.questions;
ok(BANK.length > 2600, "C1 the bank builds from the installed dual-class data", "size " + BANK.length);
eq(built.layerCounts.quiz, APP.quiz.length, "C2 every quiz entry (both classes) reached the bank");
ok((built.layerCounts.practice || 0) > 0 && (built.layerCounts.descriptive || 0) > 0,
   "C3 practice and descriptive layers built", detail(built.layerCounts));

function seededRng(seed) { let s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const SEEDS = [42, 1009, 7919, 12345, 31337];

const mock12 = ExamRules.getPaper("c12-cbse-board-mock");
ok(!!mock12 && !!mock12.blueprint, "C4 the Class 12 CBSE board mock exists with a blueprint");
let mockFail = null, unitBad = null;
SEEDS.forEach(seed => {
  const r = ExamRules.drawPaper(BANK, mock12, {}, seededRng(seed));
  if (!r.ok) { mockFail = mockFail || `seed ${seed}: ${r.detail || r.error} ${detail(r.missing)}`; return; }
  if (r.report.totalMarks !== 80 || r.report.questionCount !== 36) {
    mockFail = mockFail || `seed ${seed}: ${r.report.totalMarks} marks / ${r.report.questionCount} questions`;
  }
  const u = r.report.units;
  if (u.u1 !== 36 || u.u2 !== 24 || u.u3 !== 12 || u.u4 !== 8) {
    unitBad = unitBad || `seed ${seed}: ${JSON.stringify(u)}`;
  }
});
ok(!mockFail, "C5 the Class 12 board mock draws 80 marks / 36 questions on every seed", mockFail);
ok(!unitBad, "C6 the drawn paper matches the official unit totals (36 + 24 + 12 + 8)", unitBad);

const mock11 = ExamRules.getPaper("cbse-board-mock");
let c11Fail = null;
SEEDS.forEach(seed => {
  const r = ExamRules.drawPaper(BANK, mock11, {}, seededRng(seed));
  if (!r.ok) c11Fail = c11Fail || `seed ${seed}: ${r.detail || r.error}`;
});
ok(!c11Fail, "C7 the Class 11 board mock still draws its blueprint (regression)", c11Fail);

/* fixed papers (no blueprint) take the round-robin path with the same
   eligibility filter the app applies — every one must fill its count */
function appPool(paper) {
  const blueprint = paper && paper.blueprint;
  return BANK.filter(q => {
    if (!ExamRules.isExamEligible(q)) return false;
    if (paper && Array.isArray(paper.chapters) && paper.chapters.indexOf(q.chapter) < 0) return false;
    if (!blueprint && ExamRules.questionMarks(q) !== 1) return false;
    return true;
  });
}
ExamRules.EXAM_PAPERS.forEach(p => {
  if (p.blueprint) return;
  const drawn = ExamRules.drawQuestions(appPool(p), p.chapters, p.questionCount, seededRng(42));
  eq(drawn.length, p.questionCount, `C8 ${p.id} (${p.cls === "12" ? "Class 12" : "Class 11"}) fills its ${p.questionCount}-question draw`);
});

/* nothing the Class 12 student owns may be dropped as a duplicate */
const droppedC12 = built.duplicates.filter(d =>
  (d.id >= 70001 && d.id <= 70000 + C12_QUIZ_TOTAL) || (d.id >= 71001 && d.id <= 71000 + C12_FC_TOTAL));
eq(droppedC12.length, 0, "C9 no Class 12 quiz or flashcard id was dropped from the bank", detail(droppedC12.slice(0, 5)));

/* no student-facing Class 12 text may name a source, URL or paper */
const FORBIDDEN = /previous[\s-]?year['’]?\s*(question|paper|exam|board|qp)|\bPYQ\b|sample paper|official paper|board exam paper|cbse\.nic|cbse website|cbse academic|https?:\/\//i;
const LEAKY = ["q", "passage", "explanation"];
let c12leaks = [];
BANK.forEach(q => {
  if (C12_IDS.indexOf(q.chapter) < 0) return;
  const probe = [];
  LEAKY.forEach(k => { if (q[k]) probe.push(String(q[k])); });
  (q.options || []).forEach(o => probe.push(String(o)));
  (q.subs || []).forEach(s => { if (s.q) probe.push(String(s.q)); if (s.explanation) probe.push(String(s.explanation)); });
  if (probe.some(t => FORBIDDEN.test(t))) c12leaks.push(q.id);
});
eq(c12leaks.length, 0, "C10 no Class 12 question names a source, URL or paper", detail(c12leaks.slice(0, 5)));

/* ================================================================
   D. shared tools stay single — and serve both classes
   ================================================================ */
section("D. Shared tools — single instances, class-aware");

["accounting-cycle.js", "ai-calc.js", "calculator.js", "ai-solver.js", "ai-tutor-core.js",
 "tutor-engine.js", "certificate.js", "achievements.js"].forEach(f => {
  const n = (indexHtml.match(new RegExp(`src="/${f.replace(/\./g, "\\.")}(?:\\?[^"]*)?"`, "g")) || []).length;
  eq(n, 1, `D1 index.html loads ${f} exactly once`);
});
ok(!/numerical-solver/i.test(indexHtml) && !/numerical-solver/i.test(appSrc),
   "D2 the retired Numerical Solver stays removed (no script, no route)");

/* the single AI knowledge layer, built the way the browser builds it —
   data-12.js is a classic script, so C12_DATA is a global there too */
global.C12_DATA = C12;
const kb = AIK.init(APP);          // init() builds AND stores the module-level kb the way the app does
ok(kb && Array.isArray(kb.docs) && kb.docs.length > 500, "D3 the shared knowledge base builds from both classes",
   kb ? "docs " + kb.docs.length : "no kb");
function topChapters(q) { return (AIK.search(q, { limit: 8 }) || []).map(h => h.doc && h.doc.chapterId); }
const caHit = topChapters("spreadsheet applications for bank reconciliation");
ok(caHit.indexOf("ca") >= 0, "D4 the tutor answers from the Computerised Accounting chapter", detail(caHit));
const fsaHit = topChapters("comparative statement percentage change over two years");
ok(fsaHit.indexOf("fsa") >= 0, "D5 the tutor answers from the Financial Statement Analysis chapter", detail(fsaHit));
const cfHit = topChapters("operating activities indirect method cash flow");
ok(cfHit.indexOf("cf") >= 0, "D6 the tutor answers from the Cash Flow chapter", detail(cfHit));
const c11Hit = topChapters("golden rules of debit and credit");
ok(c11Hit.some(id => ["dc", "jr", "intro", "terms", "tbase"].indexOf(id) >= 0),
   "D7 the same knowledge base still answers Class 11 queries", detail(c11Hit));

const searchIdx = SiteSearch.buildSearchIndex(
  Object.assign({}, APP, { chapters: ClassRegistry.chaptersOf("12") }), {});
const routes12 = new Set(searchIdx.filter(it => it.kind === "Chapter").map(it => it.route));
eq(C12_IDS.every(id => routes12.has("ch-" + id)), true, "D8 site search lists all 13 Class 12 chapters",
   detail(C12_IDS.filter(id => !routes12.has("ch-" + id))));
ok(searchIdx.some(it => it.kind === "Quiz Question" && /^Q7\d{4}:/.test(it.title)),
   "D9 Class 12 quiz entries are searchable");
ok(searchIdx.some(it => it.source === "importantQuestions.cf"),
   "D10 Class 12 important questions are searchable");
ok(searchIdx.some(it => it.kind === "Flashcard" && it.chapter === "ca"),
   "D11 Class 12 flashcards are searchable");

/* ================================================================
   E. SEO routes + app.js class-system wiring
   ================================================================ */
section("E. SEO routes and class-system wiring");

const pubs = SEO.publicRoutes();
eq(pubs.length, 43, "E1 seo-config exposes 43 public routes");
const pubSet = new Set(pubs);
const c12Routes = ["chapters-list-12"].concat(C12_IDS.map(id => "ch-" + id));
eq(c12Routes.length, 14, "E2 there are 14 Class 12 public routes (list + 13 chapters)");
c12Routes.forEach(r => {
  ok(pubSet.has(r), `E2 ${r} is public`, "not in publicRoutes()");
  const cfg = SEO.ROUTES[r];
  ok(cfg && typeof cfg.path === "string" && cfg.path.indexOf("/class-12-accountancy/") === 0,
     `E2 ${r} is served under the Class 12 path`, cfg ? cfg.path : "no route");
});

ok(appSrc.includes('routes["ch-" + id] = renderC12Chapter'), "E3 app.js registers every Class 12 chapter route");
ok(appSrc.includes('routes["chapters-list-12"]'), "E4 app.js registers the Class 12 chapter-list route");
ok(appSrc.includes("function adoptClassFromRoute") && appSrc.includes("adoptClassFromRoute(currentRoute())"),
   "E5 direct Class 12 links adopt the class silently");
ok(appSrc.includes("function renderC12Chapter"), "E6 the data-driven Class 12 chapter renderer exists");
ok(appSrc.includes("selectedClass") && appSrc.includes("cls-option-name"),
   "E7 the first-visit class selector exists in the existing design language");
ok(appSrc.includes('toast("About this website"') || appSrc.includes('"About this website"'),
   "E8 the first-visit About toast string is intact");
ok(appSrc.includes("setActiveClass") && appSrc.includes("refreshFlashChapterLabels") &&
   appSrc.includes("refreshQuizChapterLabels"),
   "E9 the compact class switcher refreshes chapter pickers");

const fsSlice = appSrc.slice(appSrc.indexOf("function renderFormulaSheet"), appSrc.indexOf("function renderPerformance"));
ok(fsSlice.includes("ClassRegistry.CLASS_12") && fsSlice.includes("quickRevision"),
   "E10 the Formula Sheet has a Class 12 branch built from live data");
const hubSlice = appSrc.slice(appSrc.indexOf("function renderRevisionHub"), appSrc.indexOf('routes["revision"]'));
ok(hubSlice.includes("ClassRegistry.CLASS_12"),
   "E11 the Revision Hub has a Class 12 branch");
ok(fsSlice.includes('id="printBtn"') && fsSlice.includes("window.print()"),
   "E12 the Class 12 formula sheet keeps the print action");

/* ================================================================
   F. offline precache + referenced assets
   ================================================================ */
section("F. Offline precache and asset references");

const cacheName = (swSrc.match(/const CACHE_NAME = "([^"]+)"/) || [])[1];
ok(/^aba-cache-v\d+$/.test(cacheName || ""), "F1 the service worker cache name is versioned", cacheName);
const cacheNum = parseInt((cacheName || "").replace(/\D+/g, ""), 10);
ok(cacheNum >= 47, "F2 the cache version was bumped for the v87 release", cacheName);

const shellMatch = swSrc.match(/const APP_SHELL = \[([\s\S]*?)\];/);
const shell = shellMatch ? (shellMatch[1].match(/"([^"]+)"/g) || []).map(s => s.slice(1, -1)) : [];
ok(shell.length > 10, "F3 the app shell list parses", "entries " + shell.length);
["./data-12.js"].concat(C12_UNITS.map(f => "./" + f), ["./classes.js"]).forEach(f => {
  ok(shell.indexOf(f) >= 0, `F4 the service worker precaches ${f}`);
});
const shellMissing = shell.filter(f => !fs.existsSync(path.join(ROOT, f.replace(/^\.\//, ""))));
eq(shellMissing.length, 0, "F5 every precached shell file exists on disk", detail(shellMissing));

const refs = indexHtml.match(/(?:src|href)="\/([^"?]+)(?:\?[^"]*)?"/g) || [];
const refFiles = refs.map(r => (r.match(/"\/([^"?]+)/) || [])[1]).filter(Boolean);
const refMissing = [...new Set(refFiles)].filter(f => !fs.existsSync(path.join(ROOT, f)));
eq(refMissing.length, 0, "F6 every script/asset index.html references exists on disk", detail(refMissing));

["data-12.js"].concat(C12_UNITS, ["classes.js"]).forEach(f => {
  ok(new RegExp(`src="/${f.replace(/\./g, "\\.")}\\?v=\\d+"`).test(indexHtml),
     `F7 index.html loads ${f} with a cache-busting version`);
});

const styles = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
ok(styles.includes("--c-ca") && styles.includes(".cls-option") && styles.includes(".class-switch"),
   "F8 styles.css carries the Class 12 chapter tokens and the class switcher styles");

/* ================================================================ */
console.log("\n" + "=".repeat(60));
console.log(`${pass} passed · ${fail} failed`);
if (fail) {
  console.log("\nFailures:");
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
} else {
  console.log("All class-system checks passed.");
}
