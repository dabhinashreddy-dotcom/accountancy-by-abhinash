/* AI Tutor regression suite — run from the site root:   node tests/tutor-regression-tests.js
   (Node 18+; no packages.)  Dev only, not loaded by the website.

   Locks in the behaviour we must not break:
     A. Case-question pipeline (Task 2) — the four activity sections travel to the
        tutor with real content, survive a localStorage round-trip, and grade picks.
     B. Solving a case through AICore + follow-up that keeps context.
     C. Practice-bank questions (byRaw identity path) still work.
     D. New chapter solvers (cash book, final accounts, rectification) return right answers.
     E. Existing solvers (GST, depreciation, BRS, trial balance) still agree with hand-work. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function section(t) { console.log("\n" + t); }

const sandbox = { console }; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + ";this.__D=APP_DATA;", sandbox);
const D = sandbox.__D;
const Know = require(path.join(ROOT, "ai-knowledge.js"));
const Core = require(path.join(ROOT, "ai-tutor-core.js"));
const Solver = require(path.join(ROOT, "ai-solver.js"));
const kb = Know.init(D, {});

function throughWire(srcKey, raw, meta) {
  const q = Know.describe(srcKey, raw, meta || {});
  const wire = Know.toWire(q);
  const back = Know.fromWire(JSON.parse(JSON.stringify(wire)));  // simulate localStorage
  return { q, wire, back };
}

/* ---------------- A. case-question pipeline ---------------- */
section("A. Case-question pipeline (four sections, real content, round-trip, picks)");
{
  const labCase = D.pres.decisionLab[0];
  let r = throughWire("pres.decisionLab", labCase);
  ok(r.wire.text && r.wire.text.length > 80, "decisionLab wire has text");
  ok(r.back.kind === "case" && r.back.extra.caseSteps.length === labCase.steps.length, "decisionLab steps restored");
  ok(r.back.extra.caseSteps.every(s => s.q && s.options && s.options.length && s.answerIndex != null && s.explanation), "decisionLab steps complete");
  ok(r.back.chapterId === "pres", "decisionLab chapter pres");
  // live picks: one right, one wrong
  r = throughWire("pres.decisionLab", labCase, { getPicks: () => labCase.steps.map((s, i) => i === 0 ? { index: s.answerIndex, label: s.options[s.answerIndex] } : { index: (s.answerIndex + 1) % s.options.length, label: s.options[(s.answerIndex + 1) % s.options.length] }) });
  ok(r.back.extra.caseSteps[0].pickCorrect === true && r.back.extra.caseSteps[1].pickCorrect === false, "decisionLab picks graded");
  ok(r.back.extra.picksGiven === labCase.steps.length, "decisionLab picksGiven counted");

  const detCase = D.roe.auditCases[0];
  r = throughWire("roe.auditCases", detCase);
  ok(r.wire.text.length > 80 && /books show/i.test(r.wire.text), "errorDetective text includes records");
  ok(r.back.extra.caseSteps.length === detCase.questions.length, "errorDetective steps");

  const adjCase = D.adj.adjustmentCases[0];
  r = throughWire("adj.adjustmentCases", adjCase);
  ok(r.wire.text.length > 80 && r.back.extra.caseSteps.length === adjCase.questions.length, "adjustmentStudio steps");

  const bCase = D.fs.builderCases[0];
  r = throughWire("fs.builderCases", bCase, { getPicks: () => bCase.placements.map((p, i) => i === 0 ? { code: p.answer, label: p.answer } : { code: "BS-L", label: "Balance Sheet — Liability" }) });
  ok(r.wire.text.length > 150 && /Trial Balance/i.test(r.wire.text), "builder text includes TB");
  ok(r.back.extra.caseSteps.length === bCase.placements.length, "builder steps");
  ok(r.back.extra.caseSteps[0].pickCorrect === true, "builder first pick correct");
}

/* ---------------- B. solve a case + follow-up ---------------- */
section("B. Solving a case through AICore, then a context-keeping follow-up");
{
  const bCase = D.fs.builderCases[0];
  const wire = Know.toWire(Know.describe("fs.builderCases", bCase, { getPicks: () => bCase.placements.map(p => ({ code: p.answer, label: p.answer })) }));
  const q = Know.fromWire(JSON.parse(JSON.stringify(wire)));
  const res = Core.respond(kb, "Please solve this question step by step.", Core.newState(), { question: q, mode: "steps" });
  ok(!!res.answer, "AICore answered the case");
  const txt = res.answer ? res.answer.text : "";
  ok(/\*\*Q1\./.test(txt) || /\*\*Q1\b/.test(txt), "answer lists Q1");
  ok(/Trading|Balance Sheet|P&L|Profit/i.test(txt), "answer mentions statements");
  ok(/✅|❌/.test(txt), "picks graded in answer");
  const res2 = Core.respond(kb, "Why is that correct for Q1?", res.state, { question: q, mode: "steps" });
  ok(!!res2.answer && res2.answer.text.length > 20, "follow-up 'why Q1' answered");
}

/* ---------------- C. practice-bank byRaw path ---------------- */
section("C. Practice-bank questions (byRaw identity) unaffected");
{
  const rawQ = D.pres.numericals[0];
  const qb = Know.describe("pres.numericals", rawQ, {});
  ok(qb && qb.text && qb.text.length > 10, "practice-bank describe still fine");
}

/* ---------------- D. new chapter solvers ---------------- */
section("D. New solvers — cash book, final accounts, rectification");
function solve(t) { return Solver.solve(t); }
{
  let r = solve("Trading account: opening stock 10000, purchases 50000, closing stock 12000, sales 80000, wages 5000. Find gross profit.");
  ok(r && r.domain === "final-accounts" && r.answer && Math.abs(r.answer.value - 27000) < 0.5, "final-accounts gross profit 27000", r && r.answer && r.answer.value);
  ok(r.checks.every(c => c.ok), "final-accounts checks pass");

  r = solve("Final accounts: opening stock 20000, purchases 150000, sales 220000, closing stock 30000, rent 12000, commission received 3000. Find net profit.");
  ok(r && r.domain === "final-accounts" && Math.abs(r.inputs.netProfit - 71000) < 0.5, "final-accounts net profit 71000", r && r.inputs && r.inputs.netProfit);
  ok(/Net profit = ₹71,000/.test(r.answer.text), "net profit shown in the answer text");

  r = solve("Cash Book: opening cash in hand 5000; received from Ram 10000; paid rent 2000; sold goods for 3000; bought furniture 4000. Find closing cash balance.");
  ok(r && r.domain === "cashbook" && Math.abs(r.answer.value - 12000) < 0.5, "cashbook closing cash 12000", r && r.answer && r.answer.value);

  r = solve("Opening cash 2000; paid salaries 1500; received commission 400; sold scrap for 100. Find closing cash balance.");
  ok(r && r.domain === "cashbook" && Math.abs(r.answer.value - 1000) < 0.5, "cashbook closing cash 1000", r && r.answer && r.answer.value);

  r = solve("A transaction of 2500 was wrongly recorded as 5200. Rectify the error.");
  ok(r && r.domain === "rectification" && Math.abs(r.answer.value - 2700) < 0.5, "rectification amount error 2700", r && r.answer && r.answer.value);

  r = solve("Cash received from Anil 5000 was wrongly credited to Sunil. Rectify.");
  ok(r && r.domain === "rectification" && /Debit Sunil/i.test(r.answer.text) && /Credit Anil/i.test(r.answer.text), "rectification receipt party swap", r && r.answer && r.answer.text);

  r = solve("Wages of 3000 paid to Ram were wrongly debited to Shyam instead of Ram. Rectify.");
  ok(r && r.domain === "rectification" && /Debit Ram/i.test(r.answer.text) && /Credit Shyam/i.test(r.answer.text), "rectification payment party swap", r && r.answer && r.answer.text);

  // a rectification with no figure at all is intentionally left to the knowledge base
  // (the solver only engages when the sentence carries a number)
  ok(solve("Wages paid to Ram were wrongly debited to Shyam instead of Ram. Rectify.") === null, "figure-less rectification falls through to the KB");
}

/* ---------------- E. existing solvers unchanged ---------------- */
section("E. Existing solvers still agree with hand-work");
{
  let r = solve("Goods worth 50000 with trade discount 10% and GST 18% intra-state. Find the invoice value.");
  ok(r && r.domain === "gst", "gst still detected");
  r = solve("Machine costing 200000 depreciated 10% p.a. under WDV for 2 years. Find depreciation for year 1.");
  ok(r && r.domain === "depreciation" && Math.abs(r.answer.value - 20000) < 0.5, "depreciation WDV year 1 = 20000", r && r.answer && r.answer.value);
  r = solve("Cash book balance 15000; cheque issued not presented 3000. Find pass book balance.");
  ok(r && r.domain === "brs", "brs still detected");
  r = solve("Trial balance: Cash 5000 Dr, Capital 5000 Cr, Purchases 2000 Dr, Creditors 2000 Cr. Does it agree?");
  ok(r && r.domain === "trial-balance" && r.answer && r.answer.value === 0, "trial balance agrees");
}

/* ---------------- report ---------------- */
console.log("\n" + "=".repeat(60));
console.log("Tutor regression tests: " + pass + " passed / " + fail + " failed");
if (failures.length) {
  console.log("\nFailures:"); failures.slice(0, 40).forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
