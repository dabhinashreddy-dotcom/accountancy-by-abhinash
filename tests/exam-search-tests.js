/* Website-wide search — regression tests.   Run:  node tests/exam-search-tests.js
   (Node 18+, no packages.)  Dev only, not loaded by the website.

   Runs search-index.js against the REAL question bank in data.js and
   data-12*.js (both classes installed), so every claim below is
   executed rather than asserted:
     A  every question source is actually indexed
     B  a pasted question finds that exact question, and opens it
     C  formatting differences still match exactly (quotes, ₹, commas, &)
     D  questions that differ only in an amount stay distinct
     E  duplicate suppression
     F  destinations are real routes; the previously dead click works
     G  sensible behaviour when nothing matches
*/
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const SiteSearch = require(path.join(ROOT, "search-index.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

/* ---- real data: the site loads as classic scripts in browser order,
   then the registry self-installs Class 12 into APP_DATA — mirror that
   here so the index sees exactly what the browser sees ---- */
const sandbox = { console }; sandbox.window = sandbox; sandbox.self = sandbox; vm.createContext(sandbox);
["data.js", "data-12.js",
 "data-12a.js", "data-12b.js", "data-12c.js", "data-12d.js", "data-12e.js",
 "data-12f.js", "data-12g.js", "data-12h.js", "data-12i.js", "data-12j.js",
 "data-12k.js", "data-12l.js", "classes.js"]
  .filter(f => fs.existsSync(path.join(ROOT, f)))
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sandbox, { filename: f }));
vm.runInContext(";this.__D=APP_DATA;this.__C12=(typeof C12_DATA!=='undefined')?C12_DATA:null;", sandbox);
const D = sandbox.__D;
const C12D = sandbox.__C12;

/* Ledger practice pool (app.js merges the chapter bank with extra
   practice transactions); mirror it so the index is built exactly as
   the site builds it. */
const ledgerPool = (D.ledger.extraPracticeTransactions || []).slice();

/* the app indexes BOTH classes' chapters and banks in one index
   (records are scoped to the active class at query time) — mirror
   app.js buildSearchIndex exactly */
const INDEX = SiteSearch.buildSearchIndex(Object.assign({}, D, {
  chapters: D.chapters.concat((C12D && C12D.chapters) || [])
}), {
  pages: [
    ["Home", "home"], ["AI Tutor", "ai-tutor"], ["Chapters", "chapters-list"],
    ["Practice", "practice-hub"], ["Revision", "revision"],
    ["Performance Dashboard", "performance"], ["Bookmarks", "bookmarks"],
    ["Settings", "settings"], ["Formula Sheet", "formula-sheet"],
    ["Important Questions", "important-questions"], ["Exam Mode", "exam-mode"],
    ["Quiz", "quiz"], ["Flashcards", "flashcards"],
    ["Mistake Book", "mistake-book"],
    ["Accounting Cycle", "accounting-cycle"], ["Certificate", "certificate-view"],
    ["About This Website", "about"]
  ].map(([title, route]) => ({ title, route, aliases: [] })),
  tools: [
    ["Calculator", "floatingCalcToggle"], ["Scratch Pad", "scratchPadToggle"],
    ["Pomodoro Timer", "pomodoroToggle"], ["Whiteboard", "whiteboardToggle"],
    ["Fullscreen Study Mode", "fullscreenToggle"]
  ].map(([title, toolId]) => ({ title, toolId, action: "openTool", aliases: [] })),
  ledgerPool: ledgerPool
});

const ROUTES = new Set([
  "home", "about", "chapters-list", "practice-hub", "revision", "performance",
  "bookmarks", "settings", "formula-sheet", "important-questions", "exam-mode",
  "quiz", "flashcards", "mistake-book", "accounting-cycle",
  "certificate-view", "ai-tutor", "more",
  "ch-intro", "ch-terms", "ch-tbase", "ch-basis", "ch-eq", "ch-dc", "ch-jr",
  "ch-lg", "ch-cb", "ch-sp2", "ch-brs", "ch-gst", "ch-tb", "ch-dep",
  "ch-pres", "ch-roe", "ch-fs", "ch-adj",
  /* Class 12 — the dual-class app serves these too */
  "chapters-list-12",
  "ch-pf", "ch-gw", "ch-psr", "ch-adm", "ch-ret", "ch-dis", "ch-sc",
  "ch-deb", "ch-cfin", "ch-fsa", "ch-rat", "ch-cf", "ch-ca"
]);

function search(q, limit) { return SiteSearch.selectSearchResults(INDEX, q, limit); }
function top(q) { return search(q, 1)[0] || null; }
function sourceCount(source) { return INDEX.filter(i => i.source === source).length; }
function targetOf(item) { return SiteSearch.resolveSearchTarget(item, { currentRoute: "home", hasRoute: r => ROUTES.has(r) }); }

console.log("Website-wide search regression suite");
console.log("=".repeat(60));
console.log(`index size: ${INDEX.length} entries`);

/* ================= A. coverage ================= */
section("A. Every question source is indexed");
const EXPECTED_SOURCES = [
  ["quiz", () => D.quiz.length],
  ["flashcards", () => D.flashcards.length],
  ["journalEntryPatterns", () => D.journalEntryPatterns.length],
  ["importantQuestions.intro", () => D.importantQuestions.intro.length],
  ["importantQuestions.dep", () => D.importantQuestions.dep.length],
  ["intro.numericals", () => D.intro.numericals.length],
  ["terms.numericals", () => D.terms.numericals.length],
  ["tbase.numericals", () => D.tbase.numericals.length],
  ["basis.numericals", () => D.basis.numericals.length],
  ["eq.numericals", () => D.equation.numericals.length],
  ["dc.numericals", () => D.debitCredit.numericals.length],
  ["jr.numericals", () => D.journal.numericals.length],
  ["cb.numericals", () => D.cashBook.numericals.length],
  ["sp2.numericals", () => D.specialBooks2.numericals.length],
  ["brs.numericals", () => D.brs.numericals.length],
  ["gst.numericals", () => D.gst.numericals.length],
  ["tb.numericals", () => D.tb.numericals.length],
  ["dep.numericals", () => D.dep.numericals.length],
  ["pres.numericals", () => D.pres.numericals.length],
  ["roe.numericals", () => D.roe.numericals.length],
  ["fs.numericals", () => D.fs.numericals.length],
  ["adj.numericals", () => D.adj.numericals.length],
  ["pres.decisionLab", () => D.pres.decisionLab.length],
  ["roe.auditCases", () => D.roe.auditCases.length],
  ["adj.adjustmentCases", () => D.adj.adjustmentCases.length],
  ["fs.builderCases", () => D.fs.builderCases.length],
  ["importantQuestions.pres", () => D.importantQuestions.pres.length],
  ["importantQuestions.roe", () => D.importantQuestions.roe.length],
  ["importantQuestions.fs", () => D.importantQuestions.fs.length],
  ["importantQuestions.adj", () => D.importantQuestions.adj.length],
  ["ledger.examQuestions.easy", () => D.ledger.examQuestions.easy.length],
  ["ledger.examQuestions.medium", () => D.ledger.examQuestions.medium.length],
  ["ledger.examQuestions.hard", () => D.ledger.examQuestions.hard.length],
  ["ledger.postingRules", () => D.ledger.postingRules.length],
  ["terms.termDetective.cases", () => D.terms.termDetective.cases.length],
  ["tbase.conceptDetective.cases", () => D.tbase.conceptDetective.cases.length],
  ["basis.basisSwitch.checkpoints", () => D.basis.basisSwitch.checkpoints.length],
  ["brs.detective", () => D.brs.detective.length],
  ["tb.checkpoint", () => D.tb.checkpoint.length],
  ["dc.balanceSheetQuestions", () => D.debitCredit.balanceSheetQuestions.length],
  ["cb.illustrations", () => D.cashBook.illustrations.length],
];
EXPECTED_SOURCES.forEach(([source, countOf]) => {
  const got = sourceCount(source);
  ok(got === countOf(), `source "${source}" fully indexed`, `got ${got}, expected ${countOf()}`);
});
// chapter theory / concepts / quick revision — asserted for the chapters
// that actually store them that way (the Ledger chapter keeps its prose
// as { meaning, definition, importance, relationship } instead).
const LEDGER_PROSE = [
  "ledger.postingRules", "ledger.intro.meaning", "ledger.intro.definition",
  "ledger.intro.importance", "ledger.intro.relationship",
  "lg.quickRevision", "lg.commonMistakes", "ledger.extraPractice"
];
Object.keys(SiteSearch.CHAPTER_SECTION).forEach(chId => {
  if (chId === "lg") {
    LEDGER_PROSE.forEach(source => ok(sourceCount(source) > 0, `ledger source "${source}" indexed`));
    return;
  }
  const sec = D[SiteSearch.CHAPTER_SECTION[chId]];
  if (sec.theory && sec.theory.simple) ok(sourceCount(chId + ".theory.simple") === sec.theory.simple.length, `chapter ${chId} theory (simple) fully indexed`);
  if (sec.theory && sec.theory.advanced) ok(sourceCount(chId + ".theory.advanced") === sec.theory.advanced.length, `chapter ${chId} theory (advanced) fully indexed`);
  if (sec.concepts) ok(sourceCount(chId + ".concepts") === sec.concepts.length, `chapter ${chId} concepts fully indexed`);
  if (sec.quickRevision) ok(sourceCount(chId + ".quickRevision") > 0, `chapter ${chId} quick revision indexed`);
});
// every chapter has at least one index entry at all
Object.keys(SiteSearch.CHAPTER_SECTION).forEach(chId => {
  ok(INDEX.some(i => i.route === "ch-" + chId), `chapter ${chId} has reachable entries`);
});
ok(INDEX.length > 2000, "index is large enough to hold the whole site", `size ${INDEX.length}`);

/* ================= B. exact pasted-question matching ================= */
section("B. A pasted question finds that question");
function checkExact(questionText, expectedRoute, name) {
  const results = search(questionText, 5);
  const t = results[0];
  ok(!!t, name + " — a result is returned");
  if (!t) return;
  eq(SiteSearch.normalizeSearchText(t.text), SiteSearch.normalizeSearchText(questionText), name + " — top hit is the exact question");
  const dest = targetOf(t);
  ok(dest.type === "navigate" || dest.type === "rerender", name + " — it opens something");
  if (expectedRoute) eq(dest.route, expectedRoute, name + " — destination");
}

// 1. a multiple-choice question straight out of the quiz bank
const quizQ = D.quiz[37];
checkExact(quizQ.q, "ch-" + quizQ.chapter, "quiz bank MCQ");

// 2. a numerical from the GST chapter (has digits + ₹ signs)
const gstQ = D.gst.numericals.find(q => /[₹\d]/.test(q.question)) || D.gst.numericals[0];
checkExact(gstQ.question, "ch-gst", "GST numerical");

// 3. a chapter theory heading
checkExact(D.dep.theory.advanced[0].h, "ch-dep", "chapter theory heading");

// 4. a flashcard front
checkExact(D.flashcards[40].front, "flashcards", "flashcard front");

// 5. an Important Question (board-pattern written question)
const iq = D.importantQuestions.jr[2];
checkExact(iq.q, "important-questions", "important question");

// 6. a BRS detective situation
checkExact(D.brs.detective[3].situation, "ch-brs", "BRS detective case");

// 7. an accounting-equation numerical (has a transaction sentence)
const eqQ = D.equation.numericals.find(q => q.transaction);
checkExact(eqQ.transaction, "ch-eq", "accounting equation numerical");

// 8. a ledger exam question
checkExact(D.ledger.examQuestions.hard[2].q, "ch-lg", "ledger exam question");

// 9. a journal-entry transaction
checkExact(D.journal.numericals[5].transaction, "ch-jr", "journal transaction");

// 10. a Trial Balance checkpoint prompt
checkExact(D.tb.checkpoint[4].prompt, "ch-tb", "trial balance checkpoint");

// 11. a Cash Book illustration title
checkExact(D.cashBook.illustrations[1].title, "ch-cb", "cash book illustration");

// 12. a term-detective case prompt
checkExact(D.terms.termDetective.cases[6].prompt, "ch-terms", "terms detective case");

/* ================= C. formatting-normalised exact matching ================= */
section("C. Formatting differences still match exactly");
{
  const raw = D.quiz[100].q;
  const variants = [
    ["straight quotes", raw.replace(/"/g, "'")],
    ["extra whitespace", "   " + raw.replace(/\s+/g, "   ") + "  "],
    ["trailing punctuation", raw + "."],
    ["newlines instead of spaces", raw.replace(/ /g, "\n")],
    ["capitalised", raw.toUpperCase()],
    ["ampersand written out", raw.replace(/&/g, "and")]
  ];
  variants.forEach(([label, variant]) => {
    const t = top(variant);
    ok(!!t && SiteSearch.normalizeSearchText(t.text) === SiteSearch.normalizeSearchText(raw),
      `pasted with ${label} still finds the exact question`, t ? t.title : "no result");
  });
  // a question containing an amount, pasted with different digit grouping
  const amount = D.gst.numericals[0].question;
  const grouped = amount.replace(/(\d)(\d{3})\b/g, "$1,$2");
  const t = top(grouped);
  ok(!!t && SiteSearch.normalizeSearchText(t.text) === SiteSearch.normalizeSearchText(amount),
    "digit-grouping differences still match exactly");
}

/* ================= D. numerical distinctions ================= */
section("D. Questions that differ only in an amount stay distinct");
{
  const a = D.quiz.find(q => /₹\d+,\d{3}/.test(q.q));
  ok(!!a, "found a rupee-amount quiz question to test with");
  if (a) {
    // Build the same question with a different number and make sure it
    // is NOT reported as an exact match.
    const bumped = a.q.replace(/₹\d+,\d{3}/, "₹9,99,999");
    const t = top(bumped);
    const isExact = t && SiteSearch.normalizeSearchText(t.text) === SiteSearch.normalizeSearchText(bumped);
    ok(!isExact, "a changed amount is never treated as the same question", t ? t.title : "no result");
    // and the original still matches exactly
    const t2 = top(a.q);
    ok(!!t2 && SiteSearch.normalizeSearchText(t2.text) === SiteSearch.normalizeSearchText(a.q), "the original amount still matches exactly");
  }
  // Two depreciation questions that differ only in their figures
  const d1 = D.quiz.find(q => /₹50,000/.test(q.q));
  const d2 = D.quiz.find(q => /₹42,000/.test(q.q));
  if (d1 && d2) {
    const t1 = top(d1.q), t2 = top(d2.q);
    ok(t1 && t2 && SiteSearch.normalizeSearchText(t1.text) !== SiteSearch.normalizeSearchText(t2.text),
      "near-identical questions with different figures resolve to different questions");
  }
  // 8,000 and 8000 are the same number and must match the same question
  const withComma = D.gst.numericals.find(q => /₹\d,\d{3}/.test(q.question));
  if (withComma) {
    const noComma = withComma.question.replace(/₹(\d),(\d{3})/, "₹$1$2");
    const t = top(noComma);
    ok(!!t && SiteSearch.normalizeSearchText(t.text) === SiteSearch.normalizeSearchText(withComma.question),
      "₹8,000 and ₹8000 match the same question");
  }
}

/* ================= E. duplicate suppression ================= */
section("E. Duplicate suppression");
{
  const q = D.quiz.find(x => x.q === D.basis.numericals[0].q);   // same question in two banks
  const results = search(q ? q.q : D.quiz[0].q, 12);
  const keys = results.map(r => SiteSearch.dedupeKey(r));
  eq(new Set(keys).size, keys.length, "no duplicate keys in one result page");
  if (q) {
    const same = results.filter(r => SiteSearch.normalizeSearchText(r.text) === SiteSearch.normalizeSearchText(q.q));
    eq(same.length, 1, "a question present in two banks is returned once");
  }
  // and the index itself does not contain the same text twice for a bank
  const quizTexts = D.quiz.map(x => SiteSearch.normalizeSearchText(x.q));
  eq(new Set(quizTexts).size, quizTexts.length, "the quiz bank itself has no duplicate question texts");
}

/* ================= F. destinations ================= */
section("F. Correct destinations and working clicks");
{
  INDEX.forEach(item => {
    if (item.action === "openTool") {
      ok(!!item.toolId, `tool "${item.title}" carries a toolId`);
      return;
    }
    ok(ROUTES.has(item.route), `route "${item.route}" for "${item.title}" is a real page`);
  });
  // The tool entries open a real button on the page
  const idx = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  INDEX.filter(i => i.action === "openTool").forEach(i => {
    ok(idx.includes(`id="${i.toolId}"`), `tool "${i.title}" has a real button (#${i.toolId})`);
  });
  // Already on the target page → must re-render rather than do nothing
  {
    const item = INDEX.find(i => i.route === "ch-eq" && i.text);
    const target = SiteSearch.resolveSearchTarget(item, { currentRoute: "ch-eq", hasRoute: r => ROUTES.has(r) });
    eq(target.type, "rerender", "clicking a result for the page you are already on re-renders it");
  }
  // A route that does not exist can never be handed back
  {
    const bogus = { kind: "Page", title: "Ghost", route: "does-not-exist", aliases: [] };
    const target = SiteSearch.resolveSearchTarget(bogus, { currentRoute: "home", hasRoute: r => ROUTES.has(r) });
    eq(target.type, "navigate", "a dead route still resolves to a navigation");
    eq(target.route, "home", "a dead route falls back to Home instead of a blank page");
    eq(target.fallback, true, "the fallback is flagged");
  }
  // Tools resolve to the tool, never to a route
  {
    const tool = INDEX.find(i => i.action === "openTool");
    eq(SiteSearch.resolveSearchTarget(tool, {}).type, "tool", "tool results open the tool");
  }
}

/* ================= G. no results ================= */
section("G. Behaviour when nothing matches");
{
  eq(search("zzzqqqxyzzy", 12).length, 0, "nonsense returns no results");
  eq(search("", 12).length, 0, "an empty query returns no results");
  eq(search("   ", 12).length, 0, "a whitespace query returns no results");
  ok(SiteSearch.noResultsHint().length > 20, "an empty result set still offers a hint");
  // A partially typed real question still returns something useful
  const part = D.quiz[0].q.split(" ").slice(0, 5).join(" ");
  ok(search(part, 5).length > 0, "a partially typed question still returns results");
}

/* ================= H. ranking sanity ================= */
section("H. Ranking");
{
  const name = D.chapters[0].name;
  const t = top(name);
  ok(!!t && t.kind === "Chapter", `the chapter name ranks the chapter page first`, t ? `${t.kind}: ${t.title}` : "no result");
  const t2 = top("trial balance");
  ok(!!t2, "\"trial balance\" returns results");
  ok(search("cash book", 12).length > 3, "\"cash book\" returns several results");
}

console.log("\n" + "=".repeat(60));
console.log(`Search tests: ${pass} passed / ${fail} failed`);
if (failures.length) {
  console.log("\nFAILURES");
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
