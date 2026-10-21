#!/usr/bin/env node
/* ============================================================
   KNOWLEDGE BASE VALIDATOR  (dev tool — not loaded by the website)
   Run from the site root:   node tools/validate-knowledge.js

   One place to maintain and test the AI Tutor's knowledge base:

     A. Content audit   — every chapter ships a complete Quick Revision
                          block and every registered question source has items
     B. Index report    — how many documents the KB actually indexed, split
                          by chapter / kind / section; flags chapters with
                          zero coverage and duplicate question ids
     C. Retrieval       — a fixture of real student queries (including
                          misspellings, which must survive the fuzzy fallback)
                          must land on the right documents
     D. Case pipeline   — the four activity sections must describe real
                          case questions through toWire/fromWire

   Exits 1 when anything fails, so it can be wired into npm test.
   ============================================================ */
"use strict";
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function section(t) { console.log("\n" + t); }
const rule = () => console.log("-".repeat(64));

/* ---------- load the site's own modules exactly as the browser does ---------- */
const sandbox = { console }; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + ";this.__D=APP_DATA;", sandbox);
const D = sandbox.__D;
const Know = require(path.join(ROOT, "ai-knowledge.js"));
const kb = Know.init(D, {});

const CHAPTER_KEYS = ["intro", "terms", "tbase", "basis", "equation", "debitCredit", "journal",
  "ledger", "cashBook", "specialBooks2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
// the KB keys chapters by its short route ids (eq, dc, jr, lg, cb, sp2)
const INDEX_IDS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "lg", "cb", "sp2",
  "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
const QR_REQUIRED = ["definition", "commonMistakes", "mnemonic", "examPoints"];
const QR_METHODS = ["calculationSteps", "balancingSteps", "postingRules", "addLessLogic"];

/* ================= A. content audit ================= */
section("A. Content audit — quick revision blocks + question sources");
rule();
CHAPTER_KEYS.forEach(ch => {
  const qr = D[ch] && D[ch].quickRevision;
  ok(!!qr, ch + " has a quickRevision block");
  if (!qr) return;
  QR_REQUIRED.forEach(k => ok(qr[k] != null && (typeof qr[k] === "string" ? qr[k].trim() : qr[k].length), ch + "." + k + " present"));
  ok(QR_METHODS.some(m => Array.isArray(qr[m]) && qr[m].length), ch + " has a step-by-step method");
});

const srcEmpty = [];
Object.keys(Know.SOURCES).forEach(srcKey => {
  const S = Know.SOURCES[srcKey];
  if (S.runtime) return;                    // deliberately empty (runtime-built pools)
  try {
    const list = S.list(D);
    if (!list || !list.length) srcEmpty.push(srcKey);
  } catch (e) { srcEmpty.push(srcKey + " (THREW: " + e.message + ")"); }
});
ok(srcEmpty.length === 0, "every registered question source has items", srcEmpty.join(", "));

/* ================= B. index report ================= */
section("B. Index report");
rule();
const docs = kb.docs || [];
ok(docs.length > 800, "KB indexed a substantial corpus (" + docs.length + " docs)");
const byChapter = {}, byKind = {}, bySection = {};
docs.forEach(d => {
  const c = d.chapterId || "(global)";
  byChapter[c] = (byChapter[c] || 0) + 1;
  byKind[d.kind] = (byKind[d.kind] || 0) + 1;
  bySection[d.section] = (bySection[d.section] || 0) + 1;
});
console.log("  by chapter: " + Object.keys(byChapter).length + " groups — " +
  Object.entries(byChapter).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ":" + v).join(", "));
console.log("  by kind:    " + Object.entries(byKind).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ":" + v).join(", "));
console.log("  top sections: " + Object.entries(bySection).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => k + ":" + v).join(", "));
// every chapter should be represented in the index
ok(INDEX_IDS.every(ch => byChapter[ch] > 0), "every chapter is represented in the index",
  INDEX_IDS.filter(ch => !byChapter[ch]).join(", "));
// unique question ids
const seen = new Set(); let dup = 0;
docs.forEach(d => { if (d.qid) { if (seen.has(d.qid)) dup++; seen.add(d.qid); } });
ok(dup === 0, "question ids are unique", dup + " duplicates");
// revision docs exist for all chapters
const revChapters = new Set(docs.filter(d => d.kind === "revision").map(d => d.chapterId));
ok(INDEX_IDS.every(ch => revChapters.has(ch)), "Quick Revision docs indexed for all chapters",
  INDEX_IDS.filter(ch => !revChapters.has(ch)).join(", "));

/* ================= C. retrieval fixture ================= */
section("C. Retrieval — real queries (incl. misspellings) land on the right docs");
rule();
// Each fixture: the query must surface a title matching `top` within the
// first three results. `top` is tested against the joined top-3 titles.
const FIXTURE = [
  { q: "What is a journal entry?", top: /journal/i },
  { q: "define liability", top: /liabilit/i },
  { q: "what is a liability", top: /liabilit/i },
  { q: "trial balnce", top: /trial balance/i },                       // typo → fuzzy fallback
  { q: "depreciaton", top: /depreciat/i },                            // typo → fuzzy fallback
  { q: "reciept and payment", top: /cash|receipt|payment/i },         // typo → fuzzy fallback
  { q: "capital expenditure", top: /capital expenditure/i },
  { q: "bank reconciliation statement", top: /reconcil|pass book|cash book|brs/i },
  { q: "gst input tax credit", top: /gst/i },
  { q: "format of balance sheet", top: /balance sheet/i },
  { q: "rectification of errors", top: /rectif|error/i },
  { q: "cash book", top: /cash book/i },
  { q: "accounting equation", top: /equation|assets/i },
  { q: "difference between trial balance and balance sheet", top: /trial balance|balance sheet/i },
  { q: "what is depreciation", top: /depreciat/i },
  { q: "balancing a ledger account", top: /ledger|balanc/i },
  { q: "closing stock adjustment", top: /closing stock|adjustment/i },
  { q: "debit and credit rules", top: /debit|credit/i },
  { q: "quick revision of gst", top: /gst/i },
  { q: "narration in journal", top: /narration|journal/i }
];
FIXTURE.forEach(f => {
  const res = Know.search(f.q, { limit: 3 });
  const titles = res.map(r => r.doc.title).join(" || ");
  ok(f.top.test(titles), JSON.stringify(f.q) + " → " + f.top, res.length ? titles.slice(0, 140) : "NO RESULTS");
});
// exact-question lookup must still work (question-bank identity path)
{
  const q = D.brs.numericals && D.brs.numericals[0];
  if (q && q.question) {
    const hit = Know.findQuestion(q.question);
    ok(!!hit, "findQuestion resolves a stored question");
  }
}

/* ================= D. case pipeline ================= */
section("D. Case pipeline — the four activity sections travel to the tutor");
rule();
const CASE_SOURCES = [
  ["pres.decisionLab", D.pres.decisionLab, "steps"],
  ["roe.auditCases", D.roe.auditCases, "questions"],
  ["adj.adjustmentCases", D.adj.adjustmentCases, "questions"],
  ["fs.builderCases", D.fs.builderCases, "placements"]
];
CASE_SOURCES.forEach(([key, list, stepKey]) => {
  ok(list && list.length, key + " has cases");
  if (!list || !list.length) return;
  const wire = Know.toWire(Know.describe(key, list[0], {}));
  ok(!!wire && !!wire.text && wire.text.length > 80, key + " describes real text (" + (wire ? wire.text.length : 0) + " chars)");
  const back = Know.fromWire(JSON.parse(JSON.stringify(wire)));
  ok(back.kind === "case" && Array.isArray(back.extra.caseSteps) && back.extra.caseSteps.length === list[0][stepKey].length,
    key + " restores caseSteps through a storage round-trip");
  ok(back.extra.caseSteps.every(s => s.q && Array.isArray(s.options) && s.options.length && s.answerIndex != null && s.explanation),
    key + " every step has question, options, answer and explanation");
});

/* ================= report ================= */
console.log("\n" + "=".repeat(64));
console.log("Knowledge base validation: " + pass + " passed / " + fail + " failed");
if (failures.length) {
  console.log("\nFailures:");
  failures.slice(0, 50).forEach(f => console.log("  x " + f));
  process.exit(1);
}
