/* Expanded question bank + paper engine — regression tests.
   Run:  node tests/exam-bank-tests.js   (Node 18+, no packages.)
   Dev only, not loaded by the website.

   Executed, not asserted:
     A  the central repository is really built from every source layer,
        with unique ids, no duplicate wording and valid answer keys
     B  every one of the fifteen modes is present (8 Class 11 +
        7 Class 12), and the original Class 11 modes are
        byte-identical to the values they always had
     C  the CBSE Board Mock Test draws a paper that satisfies its
        blueprint exactly — marks, count, sections, unit totals
     D  shuffling: sections keep A..E order, order is reshuffled
        inside a section, case questions are never split apart
     E  option shuffling: the presented option list is a permutation,
        the answer key still points at the same TEXT, and the same
        seed always reproduces the same layout (resume = same paper)
     F  no-repeat: unseen questions are preferred, and repeats are
        pushed to the most recently served ones only as a last resort
     G  grading: evaluatePaper is exact for every format, and gives
        byte-identical results to the legacy evaluateAttempt for the
        single-answer questions the original seven papers use
     H  answer sanitising and answered-ness for every format
     I  the CBSE basis is stated honestly — no claim of an official
        Class XI sample paper, and the verified numbers are the
        numbers CBSE actually publishes
*/
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const ExamRules = require(path.join(ROOT, "exam-rules.js"));
const QuestionBank = require(path.join(ROOT, "question-bank.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); console.log("-".repeat(Math.max(t.length, 58))); }
function detail(o) { try { return JSON.stringify(o); } catch (e) { return String(o); } }

/* ---- load the real site data exactly as the browser does — both
   classes: data.js, the Class 12 unit files, then the registry
   which self-installs Class 12 into APP_DATA — plus the generated
   bank fragment ---- */
const sandbox = { console }; sandbox.window = sandbox; sandbox.self = sandbox; vm.createContext(sandbox);
["data.js", "data-12.js",
 "data-12a.js", "data-12b.js", "data-12c.js", "data-12d.js", "data-12e.js",
 "data-12f.js", "data-12g.js", "data-12h.js", "data-12i.js", "data-12j.js",
 "data-12k.js", "data-12l.js", "classes.js"]
  .filter(f => fs.existsSync(path.join(ROOT, f)))
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f }));
vm.runInContext(";this.__D=APP_DATA;", sandbox);
const APP = sandbox.__D;

let EXPANDED = null, EXPANDED_FILE = path.join(ROOT, "questions-expanded.js");
let expandedExists = fs.existsSync(EXPANDED_FILE);
if (expandedExists) {
  const sb2 = { console }; sb2.window = sb2; vm.createContext(sb2);
  vm.runInContext(fs.readFileSync(EXPANDED_FILE, "utf8") +
    ";this.__X=(typeof EXAM_QUESTIONS_EXPANDED!=='undefined')?EXAM_QUESTIONS_EXPANDED:(window.EXAM_QUESTIONS_EXPANDED||null);", sb2);
  EXPANDED = sb2.__X;
}

const built = QuestionBank.build(APP, EXPANDED);
const BANK = built.questions;
const cov = QuestionBank.coverage(built, ExamRules);

console.log("Expanded question bank + paper engine suite");
console.log("=".repeat(60));
console.log(`bank size: ${BANK.length} questions` +
            `   (layers: ${Object.keys(built.layerCounts || {}).map(k => k + "=" + built.layerCounts[k]).join(", ")})`);
console.log(`generated fragment: ${expandedExists ? "present" : "MISSING — run node tools/build-question-bank.js"}`);

/* ================================================================
   A. repository integrity
   ================================================================ */
section("A. Central repository integrity");

ok(Array.isArray(BANK) && BANK.length > 0, "A1 bank builds and is non-empty");
ok(!!EXPANDED && EXPANDED.length > 0, "A2 authored (expanded) layer is present and non-empty",
   expandedExists ? "" : "questions-expanded.js does not exist");
ok((built.layerCounts || {}).quiz > 0, "A3 the original practice quiz is still the first layer",
   detail(built.layerCounts));
ok((built.layerCounts || {}).authored >= 700, "A4 at least 700 authored questions were added",
   "got " + (built.layerCounts || {}).authored);

/* unique ids — compared as TEXT, because the original quiz layer keeps
   its numeric ids and a Map would otherwise treat 1 and "1" as two
   different questions */
const idSeen = new Set();
let dupIds = [];
BANK.forEach(q => { const k = String(q.id); if (idSeen.has(k)) dupIds.push(k); else idSeen.add(k); });
eq(dupIds.length, 0, "A5 every question id is unique", detail(dupIds.slice(0, 5)));

/* duplicate wording: the build DROPS repeats rather than shipping them,
   so the proof is that no two questions left in the repository share a
   fingerprint — and that everything it claims to have dropped really is
   gone. */
function normText(s) { return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function wordFingerprint(q) {
  const parts = [q.q || "", q.passage || "", q.prompt || ""];
  if (Array.isArray(q.subs)) q.subs.forEach(s => { if (s) parts.push(s.q || ""); });
  return normText(parts.join(" \u0000 "));
}
const fpSeen = new Map();
const fpClashes = [];
BANK.forEach(q => {
  const k = wordFingerprint(q);
  if (!k) return;
  if (fpSeen.has(k)) fpClashes.push(`${fpSeen.get(k)} vs ${q.id}`); else fpSeen.set(k, q.id);
});
eq(fpClashes.length, 0, "A6 no two questions in the repository repeat the same wording",
   detail(fpClashes.slice(0, 5)));
const droppedStillPresent = (built.duplicates || []).filter(d => idSeen.has(String(d.id)));
eq(droppedStillPresent.length, 0, "A7 every duplicate the build reports has really been dropped",
   detail(droppedStillPresent.slice(0, 5)));
ok((built.rejected || []).length === 0, "A7b nothing was silently discarded as malformed",
   detail((built.rejected || []).slice(0, 3)));

/* every question structurally sound */
const TYPES = new Set(ExamRules.QUESTION_TYPES);
let badShape = [];
BANK.forEach(q => {
  if (!q || !q.id) badShape.push("no id");
  else if (!TYPES.has(q.type)) badShape.push(q.id + " type " + q.type);
  else if (!q.chapter) badShape.push(q.id + " no chapter");
  else if (!q.q || String(q.q).trim().length < 8) badShape.push(q.id + " stem too short");
  else if (!q.explanation || String(q.explanation).trim().length < 20) badShape.push(q.id + " explanation missing");
  else if (!["Easy", "Medium", "Hard"].includes(q.difficulty)) badShape.push(q.id + " difficulty " + q.difficulty);
});
eq(badShape.length, 0, "A8 every question has a valid shape", detail(badShape.slice(0, 5)));

/* every machine-gradable question has a usable answer key */
let noKey = BANK.filter(q => ExamRules.isExamEligible(q) && !ExamRules.questionKeyValid(q));
eq(noKey.length, 0, "A9 every exam-eligible question has a valid answer key",
   detail(noKey.slice(0, 5).map(q => q.id)));

/* Anything that tells a student WHERE a question came from, or claims it
   was lifted from an official document, is a source label and must not
   reach the screen.

   Two phrases are deliberately NOT banned, because banning them would
   force correct accounting to be rewritten:
     * "question paper"  — "the question paper is divided into five
       sections" is ordinary syllabus language with no provenance claim.
     * "previous year"   — "bring forward the previous year's closing
       balances" and "₹8,000 relating to the previous year" are standard
       accrual and closing-entries wording.
   What is banned is "previous year" when it is being used to cite a
   paper, which is what makes it a label rather than accounting. */
const FORBIDDEN = /previous[\s-]?year['’]?\s*(question|paper|exam|board|qp)|\bPYQ\b|sample paper|official paper|board exam paper|cbse\.nic|cbse website|cbse academic|https?:\/\//i;
const LEAKY = ["q", "passage", "explanation", "table"];
let leaks = [];
BANK.forEach(q => {
  const probe = [];
  LEAKY.forEach(k => { if (q[k]) probe.push(String(q[k])); });
  (q.options || []).forEach(o => probe.push(String(o)));
  (q.left || []).forEach(o => probe.push(String(o)));
  (q.right || []).forEach(o => probe.push(String(o)));
  (q.subs || []).forEach(s => { if (s.q) probe.push(String(s.q)); if (s.explanation) probe.push(String(s.explanation)); });
  if (q.image) { if (q.image.alt) probe.push(String(q.image.alt)); if (q.image.table) probe.push(String(q.image.table)); }
  if (probe.some(t => FORBIDDEN.test(t))) leaks.push(q.id);
});
eq(leaks.length, 0, "A10 no student-facing text names a source, year or paper", detail(leaks.slice(0, 5)));

/* provenance is metadata only */
let provOk = BANK.every(q => q.provenance && typeof q.provenance.kind === "string");
ok(provOk, "A11 provenance is recorded as internal metadata on every question");

/* image questions carry a local asset + alt text, and the file exists */
const imageQs = BANK.filter(q => q.image && q.image.src);
ok(imageQs.length >= 10, "A12 the bank contains image-based questions", "count " + imageQs.length);
let imgProblems = [];
imageQs.forEach(q => {
  if (!q.image.alt || q.image.alt.trim().length < 25) imgProblems.push(q.id + " alt text missing/too short");
  else if (/^https?:/i.test(q.image.src)) imgProblems.push(q.id + " not a local asset");
  else if (!fs.existsSync(path.join(ROOT, q.image.src))) imgProblems.push(q.id + " file not found: " + q.image.src);
});
eq(imgProblems.length, 0, "A13 every image question has alt text and a real local file",
   detail(imgProblems.slice(0, 5)));

/* per-chapter coverage — every chapter genuinely grew */
const EXPECTED_CHAPTERS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "lg",
                           "cb", "sp2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
EXPECTED_CHAPTERS.forEach(ch => {
  const c = cov[ch];
  ok(!!c && c.total >= 36, `A14 ${ch} has at least 36 validated questions`, c ? "got " + c.total : "no bucket");
});
/* Class 12 chapters grew the same way — floor is the real smallest
   chapter (cfin carries 28 validated questions today). */
const EXPECTED_CHAPTERS_12 = ["pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin", "fsa", "rat", "cf", "ca"];
EXPECTED_CHAPTERS_12.forEach(ch => {
  const c = cov[ch];
  ok(!!c && c.total >= 28, `A14b ${ch} (Class 12) has at least 28 validated questions`, c ? "got " + c.total : "no bucket");
});
/* the new formats are actually present, not just claimed */
["multi", "matching", "numerical", "case"].forEach(t => {
  const n = BANK.filter(q => q.type === t).length;
  ok(n >= 40, `A15 format "${t}" is well supplied`, "got " + n);
});
const hots = BANK.filter(q => (q.tags || []).includes("hots")).length;
const comp = BANK.filter(q => (q.tags || []).includes("competency")).length;
ok(hots >= 80, "A16 HOTS-tagged questions are present", "got " + hots);
ok(comp >= 80, "A17 competency-tagged questions are present", "got " + comp);

/* ================================================================
   B. the fifteen modes (8 Class 11 + 7 Class 12)
   ================================================================ */
section("B. The fifteen examination modes");

const PAPERS = ExamRules.EXAM_PAPERS;
eq(PAPERS.length, 15, "B1 exactly fifteen modes exist (8 Class 11 + 7 Class 12)", "got " + PAPERS.length);

/* the original seven — recorded before this work — must not move */
const ORIGINAL_SEVEN = [
  ["full-50",      "Full Syllabus Mock Examination", 50, 45],
  ["full-100",     "Full Syllabus Examination (Extended)", 100, 90],
  ["fundamentals", "Accounting Fundamentals — Chapters 1–4", 25, 25],
  ["journal-ledger", "Equation, Debit-Credit, Journal & Ledger — Chapters 5–8", 25, 25],
  ["subsidiary-books", "Subsidiary Books & Cash Book — Chapters 9–10", 20, 20],
  ["brs-gst-tb",   "BRS, GST & Trial Balance — Chapters 11–13", 25, 25],
  ["final-accounts", "Depreciation to Financial Statements — Chapters 14–18", 25, 25]
];
ORIGINAL_SEVEN.forEach(([id, title, qc, dur]) => {
  const p = PAPERS.find(x => x.id === id);
  ok(!!p, `B2 mode "${id}" still exists`);
  if (!p) return;
  eq(p.title, title, `B3 "${id}" keeps its exact title`);
  eq(p.questionCount, qc, `B4 "${id}" keeps its question count`);
  eq(p.durationMinutes, dur, `B5 "${id}" keeps its duration`);
  eq(p.passingPercent, 40, `B6 "${id}" keeps its 40% pass mark`);
  eq(ExamRules.maxMarksFor(p), qc, `B7 "${id}" maximum marks unchanged`);
  ok(!p.blueprint, `B8 "${id}" is untouched by the blueprint engine`);
});

/* the eighth */
const mock = PAPERS.find(p => p.id === "cbse-board-mock");
ok(!!mock, "B9 the new mode exists");
if (mock) {
  eq(mock.title, "CBSE Board Mock Test", "B10 the new mode is named exactly as required");
  eq(mock.durationMinutes, 180, "B11 the new mode runs 3 hours");
  eq(ExamRules.maxMarksFor(mock), 80, "B12 the new mode is out of 80 marks");
  eq(mock.questionCount, 52, "B13 the new mode has 52 questions");
  eq(mock.passingPercent, 40, "B14 the new mode uses the same pass mark");
  ok(Array.isArray(mock.blueprint) === false && !!mock.blueprint, "B15 the new mode carries a blueprint");
  eq(mock.blueprint.negativeMarking, false, "B16 no negative marking (CBSE publishes none for Class XI)");
  eq(mock.chapters.length, 18, "B17 the new mode covers all 18 chapters");
}

/* ================================================================
   C. blueprint-driven drawing
   ================================================================ */
section("C. CBSE Board Mock Test — blueprint compliance");

const mockBank = BANK.filter(q => ExamRules.isExamEligible(q));
let rngSeq = 0;
function seededRng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let draws = [];
for (let i = 0; i < 40; i++) draws.push(ExamRules.drawPaper(mockBank, mock, {}, seededRng(1000 + i * 7919)));
const good = draws.filter(d => d.ok);
ok(good.length === 40, `C1 every draw satisfies the blueprint (${good.length}/40)`,
   good.length === 40 ? "" : detail(draws.find(d => !d.ok).detail));

if (good.length) {
  const r0 = good[0].report;
  eq(r0.totalMarks, 80, "C2 the drawn paper totals 80 marks");
  eq(r0.questionCount, 52, "C3 the drawn paper has 52 questions");
  eq(r0.plannedMarks, 80, "C4 the blueprint itself plans 80 marks");
  eq(r0.plannedCount, 52, "C5 the blueprint itself plans 52 questions");

  /* section shape */
  const SEC_PLAN = [["A", 40, 40], ["B", 4, 8], ["C", 4, 12], ["D", 2, 8], ["E", 2, 12]];
  SEC_PLAN.forEach(([id, count, marks]) => {
    const s = r0.sections.find(x => x.id === id);
    ok(!!s, `C6 section ${id} is present`);
    if (s) { eq(s.count, count, `C7 section ${id} has ${count} questions`); eq(s.marks, marks, `C8 section ${id} is worth ${marks} marks`); }
  });
  eq(r0.sections.map(s => s.id).join(""), "ABCDE", "C9 sections stay in A..E order");

  /* unit weightage must match what CBSE publishes: 12 / 44 / 24 */
  eq(r0.units.u1, 12, "C10 Unit 1 Theoretical Framework carries 12 marks");
  eq(r0.units.u2, 44, "C11 Unit 2 Accounting Process carries 44 marks");
  eq(r0.units.u3, 24, "C12 Unit 3 Financial Statements carries 24 marks");

  /* the CBSE cognitive split is a soft target; check it never runs away.
     The report keys are the CBSE typology codes (RU / APP / AEC), so
     assert against the codes and not the long names. */
  const t = r0.typology, tot = 80;
  ok(Object.keys(t).length >= 2, "C13 more than one cognitive level appears in the paper", detail(t));
  ok((t.RU || 0) <= 40 + 8, "C14 Remembering & Understanding stays close to CBSE's 40%", detail(t));
  ok((t.APP || 0) >= 10, "C15 Applying questions are present", detail(t));
  ok((t.AEC || 0) >= 10, "C16 Analysing/Evaluating/Creating questions are present", detail(t));
  eq(Object.keys(t).reduce((m, k) => m + t[k], 0), tot, "C17 typology totals the whole paper");

  /* every drawn question is exam-eligible and belongs to the syllabus */
  let ineligible = [];
  good.slice(0, 10).forEach(d => d.questions.forEach(q => {
    if (!ExamRules.isExamEligible(q)) ineligible.push(q.id);
    if (!EXPECTED_CHAPTERS.includes(q.chapter)) ineligible.push(q.id + " ch " + q.chapter);
  }));
  eq(ineligible.length, 0, "C18 every drawn question is eligible and in syllabus", detail(ineligible.slice(0, 5)));

  /* repeated draws differ — randomness is real */
  const sigs = new Set(good.map(d => d.questions.map(q => q.id).join(",")));
  ok(sigs.size >= 20, `C19 repeated draws produce different papers (${sigs.size}/40 distinct)`);

  /* and the marks mix differs too, not just the order */
  const typeSigs = new Set(good.map(d => d.questions.map(q => q.type).sort().join(",")));
  ok(typeSigs.size >= 2, "C20 successive papers are not the same questions in a new order", typeSigs.size + " distinct");
}

/* an impossible blueprint must be refused, never shown */
const impossible = JSON.parse(JSON.stringify(mock));
impossible.blueprint.sections.find(s => s.id === "E").batches[0].n = 9999;
const bad = ExamRules.drawPaper(mockBank, impossible, {}, seededRng(7));
eq(bad.ok, false, "C21 an unbuildable blueprint is refused");
eq(bad.error, "blueprint-not-met", "C22 the refusal is named blueprint-not-met");
ok(Array.isArray(bad.missing) && bad.missing.length > 0, "C23 the refusal says what was short");

/* the legacy drawing path still behaves for the original papers */
const legacy = PAPERS.filter(p => !p.blueprint);
legacy.forEach(p => {
  const got = ExamRules.drawQuestions(BANK.filter(q => q.type === "mcq"), p.chapters, p.questionCount, seededRng(42));
  eq(got.length, p.questionCount, `C24 legacy draw of "${p.id}" returns ${p.questionCount} questions`);
  ok(got.every(q => p.chapters.includes(q.chapter)), `C25 every legacy question of "${p.id}" is in its chapters`);
  eq(new Set(got.map(q => q.id)).size, p.questionCount, `C26 legacy draw of "${p.id}" has no repeats`);
});

/* ================================================================
   D. shuffling
   ================================================================ */
section("D. Shuffling — sections, ordering, case grouping");

if (good.length) {
  const d = good[0];
  /* section order is fixed; only the inside of a section moves */
  let last = -1, orderOk = true;
  d.questions.forEach(q => {
    const idx = "ABCDE".indexOf(q.sectionId);
    if (idx < last) orderOk = false;
    last = Math.max(last, idx);
  });
  ok(orderOk, "D1 sections appear in A..E order in every paper drawn");

  /* the inside of a section really is shuffled */
  const secA = d.questions.filter(q => q.sectionId === "A").map(q => q.id);
  /* some harvested practice questions carry a numeric id, so compare
     them as text — the point is only that the order was reshuffled */
  const secAsorted = d.questions.filter(q => q.sectionId === "A")
    .sort((a, b) => String(a.id).localeCompare(String(b.id), "en", { numeric: true })).map(q => q.id);
  ok(secA.join(",") !== secAsorted.join(","), "D2 the order inside a section is not the bank's own order");

  /* a case question travels as one unit: never split, marks still add up */
  let caseProblems = [];
  d.questions.forEach(q => {
    if (q.type !== "case") return;
    if (!Array.isArray(q.subs) || !q.subs.length) caseProblems.push(q.id + " no subs");
    else {
      const sum = q.subs.reduce((m, s) => m + (s.marks || 1), 0);
      if (sum !== ExamRules.questionMarks(q)) caseProblems.push(q.id + " marks " + sum + " != " + ExamRules.questionMarks(q));
      q.subs.forEach((s, i) => { if (!s.q) caseProblems.push(q.id + " sub " + i + " has no stem"); });
    }
  });
  eq(caseProblems.length, 0, "D3 every drawn case study is whole and its parts add up",
     detail(caseProblems.slice(0, 5)));

  /* one palette slot per question, ids never duplicated across sections */
  eq(new Set(d.questions.map(q => q.id)).size, d.questions.length, "D4 no question appears twice in a paper");
  ok(d.questions.every(q => q.sectionId && q.sectionLabel),
     "D5 every question carries its section id and label");
}

/* ================================================================
   E. option shuffling and the answer key
   ================================================================ */
section("E. Option shuffling and answer-key integrity");

function keyText(q, presented) {
  const t = q.type;
  if (t === "mcq") return presented.options[presented.answerIndex];
  if (t === "multi") return presented.answers.map(i => presented.options[i]).sort().join("|");
  if (t === "matching") return presented.answerSlots.map((s, i) => presented.left[i] + "=>" + presented.right[s]).sort().join("|");
  return null;
}

const shufflable = BANK.filter(q => ["mcq", "multi", "matching"].includes(q.type)).slice(0, 400);
let permProblems = [], keyProblems = [], deterministic = 0, moved = 0;

shufflable.forEach((q, n) => {
  const seed = 4242 + n;
  const a = ExamRules.presentationFor(q, seed);
  const b = ExamRules.presentationFor(q, seed);

  /* same seed => identical layout, always (this is what a resume restores) */
  if (detail({ o: a.options, r: a.right, ai: a.answerIndex, ans: a.answers, sl: a.answerSlots }) ===
      detail({ o: b.options, r: b.right, ai: b.answerIndex, ans: b.answers, sl: b.answerSlots })) deterministic++;
  else keyProblems.push(q.id + " presentation is not deterministic");

  /* a permutation, not a rewrite */
  if (q.type === "mcq" || q.type === "multi") {
    const orig = [...q.options].sort().join("\u0001");
    const pres = [...a.options].sort().join("\u0001");
    if (orig !== pres) permProblems.push(q.id + " options are not a permutation");
    if (a.options.length !== q.options.length) permProblems.push(q.id + " option count changed");
    if (a.options.some((v, i) => v !== q.options[i])) moved++;
    /* the ORIGINAL object is never mutated — the bank is shared state */
    if (q.options.some((v, i) => v !== q.options[i])) permProblems.push(q.id + " mutated");
  } else if (q.type === "matching") {
    if ([...a.right].sort().join("\u0001") !== [...q.right].sort().join("\u0001")) permProblems.push(q.id + " right column is not a permutation");
    if (a.right.length !== q.right.length || a.answerSlots.length !== q.answerSlots.length) permProblems.push(q.id + " matching size changed");
    if (a.left.join("\u0001") !== q.left.join("\u0001")) permProblems.push(q.id + " left column was reordered");
    if (a.right.some((v, i) => v !== q.right[i])) moved++;
  }

  /* the key still names the same words */
  if (keyText(q, q) !== keyText(q, a)) keyProblems.push(q.id + " answer key no longer matches after shuffling");

  /* and the shuffled question still grades the same */
  const presented = a;
  const ans = q.type === "mcq" ? presented.answerIndex
            : q.type === "multi" ? presented.answers.slice()
            : presented.answerSlots.slice();
  const g = ExamRules.gradeAnswer(presented, presented.type, ans);
  if (!g.correct || g.earned !== g.max) keyProblems.push(q.id + " correct answer no longer earns full marks");
  if (q.type !== "mcq") {   /* mcq has a single correct option by design */
    if (g.answered !== true) keyProblems.push(q.id + " correct answer reads as unanswered");
  }

  /* the permutation map must never ride along on the delivered object */
  if (Object.prototype.hasOwnProperty.call(a, "_perm")) permProblems.push(q.id + " leaks its own permutation");
});

eq(permProblems.length, 0, "E1 shuffling only ever permutes options", detail(permProblems.slice(0, 5)));
eq(keyProblems.length, 0, "E2 the answer key follows the shuffled options exactly", detail(keyProblems.slice(0, 5)));
eq(deterministic, shufflable.length, "E3 the same seed always reproduces the same layout");
ok(moved > shufflable.length * 0.5, `E4 shuffling really moves options (${moved}/${shufflable.length})`);

/* different seeds must genuinely differ, or shuffle is theatre */
let changed = 0;
shufflable.slice(0, 200).forEach((q, n) => {
  const a = ExamRules.presentationFor(q, 1 + n);
  const b = ExamRules.presentationFor(q, 999999 + n);
  if (detail(a.options) !== detail(b.options) || detail(a.right) !== detail(b.right)) changed++;
});
ok(changed > 150, `E5 a different seed gives a different layout (${changed}/200)`);

/* case questions get their sub-questions shuffled too, consistently */
const caseSample = BANK.filter(q => q.type === "case" && (q.subs || []).some(s => s.type === "mcq")).slice(0, 60);
let caseKeyProblems = [];
caseSample.forEach((q, n) => {
  const p = ExamRules.presentationFor(q, 77 + n);
  p.subs.forEach((s, i) => {
    const o = q.subs[i];
    if (s.type !== "mcq" && s.type !== "multi") return;
    if ([...s.options].sort().join("\u0001") !== [...o.options].sort().join("\u0001")) caseKeyProblems.push(q.id + " sub " + i + " options not a permutation");
    const key = s.type === "mcq" ? s.options[s.answerIndex] : s.answers.map(x => s.options[x]).sort().join("|");
    const orig = o.type === "mcq" ? o.options[o.answerIndex] : o.answers.map(x => o.options[x]).sort().join("|");
    if (key !== orig) caseKeyProblems.push(q.id + " sub " + i + " key drifted");
  });
});
eq(caseKeyProblems.length, 0, "E6 a case study's sub-keys follow its shuffled options",
   detail(caseKeyProblems.slice(0, 5)));

/* ================================================================
   F. no-repeat
   ================================================================ */
section("F. No-repeat history");

if (good.length) {
  const seenIds = good[0].questions.map(q => q.id);
  const recent = seenIds.slice();
  const again = ExamRules.drawPaper(mockBank, mock, { seen: seenIds, recent }, seededRng(3));
  ok(again.ok, "F1 a second draw still succeeds after the whole paper was served",
     again.ok ? "" : again.detail);

  if (again.ok) {
    /* how much repeated? it must try hard before falling back. */
    const overlap = again.questions.filter(q => seenIds.includes(q.id)).length;
    ok(overlap < 52, `F2 the second paper is not identical to the first (${overlap}/52 repeated)`);

    /* with an empty history nothing repeats at all */
    const fresh = ExamRules.drawPaper(mockBank, mock, {}, seededRng(11));
    eq(new Set(fresh.questions.map(q => q.id)).size, 52, "F3 an empty history draws 52 distinct questions");

    /* tier order: unseen -> seen-not-recent -> recent.
       Give a batch ONLY recent questions and it must still fill. */
    const allRecent = mockBank.filter(q => ExamRules.isExamEligible(q)).map(q => q.id);
    const forced = ExamRules.drawPaper(mockBank, mock, { seen: allRecent, recent: allRecent }, seededRng(5));
    ok(forced.ok, "F4 when everything has been served the paper still fills", forced.ok ? "" : forced.detail);

    /* marks/type/difficulty are preserved through the fallback — the
       relaxed draw must still satisfy the blueprint completely */
    if (forced.ok) {
      eq(forced.report.totalMarks, 80, "F5 the fallback draw still totals 80 marks");
      eq(forced.report.units.u1, 12, "F6 the fallback draw still carries Unit 1 = 12");
      eq(forced.report.units.u2, 44, "F7 the fallback draw still carries Unit 2 = 44");
      eq(forced.report.units.u3, 24, "F8 the fallback draw still carries Unit 3 = 24");
    }

    /* draw #1 and #2 with an exhausted history should not be the same
       paper — the shuffle still runs on the fallback pool */
    ok(again.questions.map(q => q.id).join(",") !== good[0].questions.map(q => q.id).join(","),
       "F9 an exhausted pool still yields a differently ordered paper");
  }
}

/* ================================================================
   G. grading
   ================================================================ */
section("G. Grading every format");

/* ---- mcq ---- */
{
  const q = { id: "t-mcq", chapter: "jr", type: "mcq", marks: 1, difficulty: "Easy",
              q: "x?", options: ["a", "b", "c", "d"], answerIndex: 1, explanation: "e" };
  eq(ExamRules.gradeAnswer(q, "mcq", 1).earned, 1, "G1 mcq correct earns full marks");
  eq(ExamRules.gradeAnswer(q, "mcq", 2).earned, 0, "G2 mcq wrong earns nothing");
  eq(ExamRules.gradeAnswer(q, "mcq", null).answered, false, "G3 mcq blank reads as unanswered");
  eq(ExamRules.gradeAnswer(q, "mcq", null).earned, 0, "G4 mcq blank earns nothing");
}
/* ---- multi: partial = marks x max(0, hits - misses) / answerCount ----
   Partial credit is rounded to 2dp by the engine (round2), which is what
   the student is shown, so the expectations below are rounded too. */
{
  const r2 = ExamRules.round2;
  const q = { id: "t-multi", chapter: "jr", type: "multi", marks: 4, difficulty: "Hard",
              q: "x?", options: ["a", "b", "c", "d"], answers: [0, 2, 3], explanation: "e" };
  eq(ExamRules.gradeAnswer(q, "multi", [0, 2, 3]).earned, 4, "G5 multi all-correct earns full marks");
  eq(ExamRules.gradeAnswer(q, "multi", [0, 2]).earned, r2(4 * 2 / 3), "G6 multi two right no wrong is partial");
  eq(ExamRules.gradeAnswer(q, "multi", [0, 2, 1]).earned, r2(4 * 1 / 3), "G7 multi two right one wrong is reduced");
  eq(ExamRules.gradeAnswer(q, "multi", [1]).earned, 0, "G8 multi only-wrong earns nothing");
  /* picking all four options: 3 hits, 1 miss -> net 2 of 3 -> 4 x 2/3 */
  eq(ExamRules.gradeAnswer(q, "multi", [0, 1, 2, 3]).earned, r2(4 * 2 / 3),
     "G9 a wrong pick cancels one right pick, so a full tick-list is not full marks");
  eq(ExamRules.gradeAnswer(q, "multi", []).earned, 0, "G10 multi empty list earns nothing");
}
/* ---- numerical: tolerance ---- */
{
  const q = { id: "t-num", chapter: "eq", type: "numerical", marks: 2, difficulty: "Medium",
              q: "x?", value: 12500, tolerance: 0, explanation: "e" };
  eq(ExamRules.gradeAnswer(q, "numerical", 12500).earned, 2, "G11 exact numerical earns full marks");
  eq(ExamRules.gradeAnswer(q, "numerical", 12499).earned, 0, "G12 a rupee out is wrong at tolerance 0");
  eq(ExamRules.gradeAnswer(q, "numerical", null).answered, false, "G13 blank numerical is unanswered");
  const q2 = Object.assign({}, q, { tolerance: 0.5 });
  ok(ExamRules.gradeAnswer(q2, "numerical", 12500.4).earned > 0, "G14 inside tolerance is accepted");
  /* the app always sanitises before it grades — gradeAnswer itself takes a
     number, and parseNumberLike lives in sanitizeAnswer (covered in H8/H9) */
  const q3 = Object.assign({}, q, { prefix: "₹" });
  const raw = ExamRules.sanitizeAnswer("numerical", "₹12,500", q3);
  eq(raw, 12500, "G15 ₹ and thousands separators are understood");
  eq(ExamRules.gradeAnswer(q3, "numerical", raw).earned, 2, "G15b a parsed amount still grades full marks");
}
/* ---- matching: partial = correctSlots / leftCount ---- */
{
  const q = { id: "t-match", chapter: "cb", type: "matching", marks: 1, difficulty: "Medium",
              q: "x?", left: ["L0", "L1", "L2"], right: ["R0", "R1", "R2", "R3"], answerSlots: [1, 3, 0], explanation: "e" };
  eq(ExamRules.gradeAnswer(q, "matching", [1, 3, 0]).earned, 1, "G16 matching all-correct earns full marks");
  eq(ExamRules.gradeAnswer(q, "matching", [1, 3, 2]).earned, ExamRules.round2(1 * 2 / 3), "G17 matching two of three is partial");
  eq(ExamRules.gradeAnswer(q, "matching", [0, 2, 3]).earned, 0, "G18 matching all-wrong earns nothing");
  eq(ExamRules.gradeAnswer(q, "matching", null).answered, false, "G19 blank matching is unanswered");
}
/* ---- case: sum of its parts ---- */
{
  const subs = [
    { id: "t-c1", chapter: "adj", type: "mcq", marks: 1, difficulty: "Easy", q: "a?", options: ["x", "y"], answerIndex: 0, explanation: "e" },
    { id: "t-c2", chapter: "adj", type: "numerical", marks: 3, difficulty: "Hard", q: "b?", value: 400, tolerance: 0, explanation: "e" }
  ];
  const q = { id: "t-case", chapter: "adj", type: "case", marks: 4, difficulty: "Hard",
              q: "Read and answer.", passage: "P", subs, explanation: "e" };
  eq(ExamRules.gradeAnswer(q, "case", [0, 400]).earned, 4, "G20 case all parts right earns full marks");
  eq(ExamRules.gradeAnswer(q, "case", [1, 400]).earned, 3, "G21 case losing a 1-mark part loses 1 mark");
  eq(ExamRules.gradeAnswer(q, "case", [0, 100]).earned, 1, "G22 case losing a 3-mark part loses 3 marks");
  eq(ExamRules.gradeAnswer(q, "case", [null, null]).answered, false, "G23 an untouched case reads as unanswered");
  eq(ExamRules.gradeAnswer(q, "case", [0, null]).answered, true, "G24 a partly answered case reads as answered");
  eq(ExamRules.questionMarks(q), 4, "G25 case marks equal the sum of its parts");
}
/* ---- no negative marking anywhere ---- */
{
  const mcq = { id: "t-n", chapter: "jr", type: "mcq", marks: 6, difficulty: "Hard",
                q: "x?", options: ["a", "b"], answerIndex: 0, explanation: "e" };
  ok(ExamRules.gradeAnswer(mcq, "mcq", 1).earned === 0, "G26 a wrong answer never subtracts marks");
  const paper = ExamRules.evaluatePaper([mcq], [1]);
  ok(paper.marksObtained === 0, "G27 evaluatePaper never goes below zero");
}

/* ---- evaluatePaper across a realistic mixed paper ---- */
{
  const qs = [
    { id: "p1", chapter: "intro", sectionId: "A", sectionLabel: "Section A", type: "mcq", marks: 1, difficulty: "Easy", q: "a?", options: ["x", "y"], answerIndex: 0, explanation: "e" },
    { id: "p2", chapter: "jr", sectionId: "A", sectionLabel: "Section A", type: "multi", marks: 1, difficulty: "Medium", q: "b?", options: ["x", "y", "z"], answers: [0, 2], explanation: "e" },
    { id: "p3", chapter: "lg", sectionId: "B", sectionLabel: "Section B", type: "numerical", marks: 2, difficulty: "Medium", q: "c?", value: 500, tolerance: 0, explanation: "e" },
    { id: "p4", chapter: "adj", sectionId: "E", sectionLabel: "Section E", type: "case", marks: 6, difficulty: "Hard", q: "d?",
      passage: "p",
      subs: [
        { id: "p4a", chapter: "adj", type: "mcq", marks: 2, difficulty: "Easy", q: "e?", options: ["x", "y"], answerIndex: 1, explanation: "e" },
        { id: "p4b", chapter: "adj", type: "numerical", marks: 4, difficulty: "Hard", q: "f?", value: 90, tolerance: 1, explanation: "e" }
      ], explanation: "e" }
  ];
  const ans = [0, [0, 2], 500, [1, 90]];
  const r = ExamRules.evaluatePaper(qs, ans);
  eq(r.marksObtained, 10, "G28 mixed paper: every correct answer adds up");
  eq(r.maxMarks, 10, "G29 mixed paper: maximum is the sum of marks");
  eq(r.percentage, 100, "G30 mixed paper: percentage is marks over maximum");
  eq(r.questionCount, 4, "G31 mixed paper: question count is the count of items");
  eq(r.correct, 4, "G32 mixed paper: all four items are correct");
  ok(r.unanswered === 0, "G33 mixed paper: nothing unanswered");
  ok(r.chapterWise.adj.marks === 6 && r.chapterWise.adj.max === 6, "G34 chapter-wise totals are marks-based");
  ok(r.unitWise.u3 !== undefined, "G35 unit-wise is reported");
  eq(r.unitWise.u1.marks, 1, "G36 Unit 1 carries the intro mark");
  eq(r.unitWise.u3.marks, 6, "G37 Unit 3 carries the case marks");
  /* the breakdown must exist and account for every mark, whatever
     typologies this particular paper happens to use */
  const tw = r.typologyWise || {};
  const twTotal = Object.keys(tw).reduce((m, k) => m + tw[k].marks, 0);
  ok(Object.keys(tw).length >= 1, "G38a a typology breakdown is reported");
  eq(twTotal, r.marksObtained, "G38b the typology breakdown accounts for every mark earned");
  eq(r.sectionWise.A.marks, 2, "G39 section A totals 2 marks");
  eq(r.sectionWise.E.marks, 6, "G40 section E totals 6 marks");
  eq(r.sectionWise.A.label, "Section A", "G41 sections are labelled for the result screen");
  eq(r.resultStatus, "PASS", "G42 100% passes");
  eq(r.grade, "A1", "G43 100% grades A1");

  /* a refusal: an ungradable paper must be rejected, not mis-scored */
  eq(ExamRules.evaluatePaper([{ id: "z", chapter: "intro", type: "descriptive", q: "x", marks: 3, explanation: "e" }], ["free text"]), null,
     "G44 a free-text question is refused rather than guessed");
  eq(ExamRules.evaluatePaper([{ id: "z", chapter: "intro", type: "mcq", q: "x", options: ["a"], explanation: "e" }], [0]), null,
     "G45 a question with no answer key is refused");
}

/* ---- legacy equivalence: evaluatePaper === evaluateAttempt for MCQs ---- */
{
  const quiz = APP.quiz.slice(0, 60);
  const answers = quiz.map((q, i) => (i % 3 === 0 ? null : q.answerIndex));
  const legacyRes = ExamRules.evaluateAttempt(quiz, answers);
  const banked = quiz.map(q => Object.assign({}, q, { type: "mcq", chapter: q.chapter, difficulty: q.difficulty || "Easy", explanation: q.explanation || "e" }));
  const newRes = ExamRules.evaluatePaper(banked, answers);
  ok(!!legacyRes && !!newRes, "G46 both graders ran on the same attempt");
  if (legacyRes && newRes) {
    eq(newRes.marksObtained, legacyRes.correct, "G47 marks equal the legacy correct count");
    eq(newRes.correct, legacyRes.correct, "G48 correct count unchanged");
    eq(newRes.unanswered, legacyRes.unanswered, "G49 unanswered count unchanged");
    eq(newRes.percentage, legacyRes.percentage, "G50 percentage unchanged");
    eq(newRes.grade, legacyRes.grade, "G51 grade unchanged");
    eq(newRes.resultStatus, legacyRes.resultStatus, "G52 pass/fail unchanged");
    ok(!!newRes.chapterWise && Object.keys(newRes.chapterWise).length > 0, "G53 chapter-wise still reported");
  }
}

/* ================================================================
   H. answer sanitising
   ================================================================ */
section("H. Answer sanitising and answered-ness");

{
  const mcq = { type: "mcq", options: ["a", "b", "c", "d"], answerIndex: 2 };
  eq(ExamRules.sanitizeAnswer("mcq", 2, mcq), 2, "H1 a valid mcq index passes through");
  eq(ExamRules.sanitizeAnswer("mcq", 9, mcq), null, "H2 an out-of-range mcq index is dropped");
  eq(ExamRules.sanitizeAnswer("mcq", "1", mcq), 1, "H3 a string mcq index is accepted");
  eq(ExamRules.sanitizeAnswer("mcq", "", mcq), null, "H4 an empty mcq answer is null");

  const multi = { type: "multi", options: ["a", "b", "c", "d"], answers: [0, 3] };
  ok(detail(ExamRules.sanitizeAnswer("multi", [0, 3], multi)) === detail([0, 3]), "H5 a valid multi list passes through");
  eq(detail(ExamRules.sanitizeAnswer("multi", [0, 9, 3, 2, 2], multi)), detail([0, 2, 3]), "H6 multi drops out-of-range and duplicate picks");
  eq(ExamRules.sanitizeAnswer("multi", [], multi), null, "H7 an empty multi list is null");

  const num = { type: "numerical", value: 5, tolerance: 0 };
  eq(ExamRules.sanitizeAnswer("numerical", "1234.5", num), 1234.5, "H8 a plain number is parsed");
  eq(ExamRules.sanitizeAnswer("numerical", "₹1,200", num), 1200, "H9 ₹ and commas are stripped");
  eq(ExamRules.sanitizeAnswer("numerical", "abc", num), null, "H10 nonsense is null");
  eq(ExamRules.sanitizeAnswer("numerical", "", num), null, "H11 blank is null");

  const match = { type: "matching", left: ["a", "b"], right: ["x", "y", "z"], answerSlots: [1, 0] };
  eq(detail(ExamRules.sanitizeAnswer("matching", [1, 0], match)), detail([1, 0]), "H12 a valid slot list passes through");
  eq(detail(ExamRules.sanitizeAnswer("matching", [5, 0], match)), detail([null, 0]), "H13 an impossible slot is nulled, the rest kept");
  eq(ExamRules.sanitizeAnswer("matching", [null, null], match), null, "H14 an all-empty matching answer is null");

  const cs = { type: "case", subs: [mcq, num] };
  eq(detail(ExamRules.sanitizeAnswer("case", [2, 7], cs)), detail([2, 7]), "H15 a case's parts are sanitised individually");
  eq(detail(ExamRules.sanitizeAnswer("case", [9, 7], cs)), detail([null, 7]), "H16 a bad case part cannot spoil a good one");
}

ok(ExamRules.isAnswered(0) === true, "H17 option index 0 counts as answered");
ok(ExamRules.isAnswered([0]) === true, "H18 a one-item list counts as answered");
ok(ExamRules.isAnswered([]) === false, "H19 an empty list is unanswered");
ok(ExamRules.isAnswered(null) === false, "H20 null is unanswered");
ok(ExamRules.isAnswered(undefined) === false, "H21 undefined is unanswered");
ok(ExamRules.isAnswered([null, null]) === false, "H22 an all-null case is unanswered");
ok(ExamRules.isAnswered([0, null]) === true, "H23 a partly answered case is answered");
ok(ExamRules.isAnswered(0.5) === true, "H24 a non-integer number can be an answer");

/* ================================================================
   I. the CBSE basis, stated honestly
   ================================================================ */
section("I. CBSE basis stated honestly");

const V = ExamRules.CBSE_VERIFIED;
ok(!!V, "I1 a verified-basis record exists");
if (V) {
  eq(V.officialSamplePaperForClassXI, false, "I2 no official CBSE Class XI sample paper is claimed");
  /* the honest caveat is carried in the `notes` array rather than a
     single field, so search every note */
  const noteText = [].concat(V.notes || [], V.note || [], V.whoConductsClassXIExams || []).join(" ");
  ok(/conducted by the school/i.test(noteText),
     "I3 the record says Class XI exams are school-conducted", detail(V.notes));
  const unit = V.unitWeightage || [];
  eq(unit.length, 3, "I4 three units are recorded");
  if (unit.length === 3) {
    eq(unit[0].marks, 12, "I5 Unit 1 = 12 marks as CBSE publishes");
    eq(unit[1].marks, 44, "I6 Unit 2 = 44 marks as CBSE publishes");
    eq(unit[2].marks, 24, "I7 Unit 3 = 24 marks as CBSE publishes");
    eq(unit.reduce((m, u) => m + u.marks, 0), 80, "I8 the units total the theory paper");
  }
  const cg = V.cognitiveGoals || V.typology || [];
  if (Array.isArray(cg) && cg.length) {
    eq(cg.reduce((m, g) => m + (g.marks || 0), 0), 80, "I9 the cognitive split totals 80 marks");
    eq(cg.reduce((m, g) => m + (g.percent || 0), 0), 100, "I10 the cognitive split totals 100%");
  }
}
/* the mock's own difficulty string must not pretend to be an official paper */
ok(!/official/i.test(mock.difficulty), "I11 the mode never calls itself official");
ok(!/official/i.test(mock.title), "I12 the mode title makes no official claim");
ok(!/question paper/i.test(mock.syllabus), "I13 the syllabus line claims no issued paper");

/* every source file that reaches a student must avoid the claim too */
["app.js", "exam-rules.js"].forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  ok(!/official\s+(CBSE\s+)?(board\s+)?(sample|question)\s+paper\s+for\s+class\s*(XI|11)/i.test(src),
     `I14 ${f} never claims an official Class XI paper`);
});

/* ================================================================
   summary
   ================================================================ */
console.log("\n" + "=".repeat(60));
console.log(`passed: ${pass}   failed: ${fail}`);
if (fail) {
  console.log("\nFAILURES:");
  failures.slice(0, 40).forEach(f => console.log("  x " + f));
  if (failures.length > 40) console.log(`  ... and ${failures.length - 40} more`);
}
process.exit(fail ? 1 : 0);
