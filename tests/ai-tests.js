/* AI Tutor tests — run from the site root:   node tests/ai-tests.js
   (Node 18+; no packages.)  Dev only, not loaded by the website.

   A. Deterministic calculators vs. hand-computed figures
   B. Stored answers across ALL site question data re-checked by the calculators
   C. Index coverage (every required section is searchable, ids unique)
   D. Retrieval (chapter content is found even though it is NOT in the tutor prompt)
   E. Exact / modified-question lookup
   F. Offline answers for pasted, un-banked numericals and concepts
   G. Backend handler (mock model): retrieval context, tool loop, validation, security
*/
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const Calc = require(path.join(ROOT, "ai-calc.js"));
const Know = require(path.join(ROOT, "ai-knowledge.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

const sandbox = { console }; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + ";this.__D=APP_DATA;", sandbox);
const D = sandbox.__D;
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const t0 = Date.now();
const kb = Know.build(D, { formulaSource: appSrc });
const buildMs = Date.now() - t0;

/* ---------------- A. calculators ---------------- */
section("A. Deterministic calculators");
eq(Calc.evaluate("50000 * 18%"), 9000, "₹50,000 × 18%");
eq(Calc.evaluate("18% of 50000"), 9000, "18% of 50000");
eq(Calc.evaluate("50000 + 18%"), 59000, "accounting-style 50000 + 18%");
eq(Calc.evaluate("(20000 - 2000) * 18 / 100"), 3240, "bracketed GST");
eq(Calc.evaluate("₹1,20,000 ÷ 12"), 10000, "Indian digit grouping and ÷");
eq(Calc.evaluate("2 ^ 3 ^ 2"), 512, "power is right-associative");
for (const bad of ["process.exit()", "1; alert(1)", "constructor", "1/0", "((1)", ""]) {
  let threw = false; try { Calc.evaluate(bad); } catch (e) { threw = true; }
  ok(threw, `evaluate rejects ${JSON.stringify(bad)}`);
}
let g = Calc.gst({ listPrice: 50000, tradeDiscountPct: 10, ratePct: 18 });
eq(g.taxable, 45000, "GST taxable 50,000 − 10%"); eq(g.gstTotal, 8100, "GST 18% of 45,000"); eq(g.cgst, 4050, "CGST"); eq(g.sgst, 4050, "SGST"); eq(g.invoice, 53100, "invoice value");
g = Calc.gst({ listPrice: 20000, ratePct: 12, interState: true }); eq(g.igst, 2400, "IGST 12% of 20,000"); eq(g.cgst, 0, "no CGST on inter-state"); eq(g.invoice, 22400, "IGST invoice");
g = Calc.gst({ listPrice: 10000, ratePct: 18, freight: 500, freightTaxable: true }); eq(g.invoice, 12390, "GST with taxable freight (10,500 × 1.18)");
g = Calc.gst({ listPrice: 10000, ratePct: 18, freight: 500, freightTaxable: false }); eq(g.invoice, 12300, "GST with non-taxable freight");
g = Calc.gst({ ratePct: 18, inclusive: true, totalInclusive: 11800 }); eq(g.taxable, 10000, "back-calculate from GST-inclusive total"); eq(g.gstTotal, 1800, "GST inside inclusive total");
let d = Calc.depreciation({ cost: 100000, residual: 10000, ratePct: 10, method: "SLM", years: 3 });
eq(d.rows[0].depreciation, 9000, "SLM yr1"); eq(d.finalBookValue, 73000, "SLM book value after 3 yrs");
d = Calc.depreciation({ cost: 100000, ratePct: 10, method: "WDV", years: 3 });
eq(d.rows[0].depreciation, 10000, "WDV yr1"); eq(d.rows[1].depreciation, 9000, "WDV yr2"); eq(d.rows[2].depreciation, 8100, "WDV yr3"); eq(d.finalBookValue, 72900, "WDV book value");
d = Calc.depreciation({ cost: 120000, ratePct: 10, method: "SLM", years: 1, monthsFirstYear: 6 }); eq(d.rows[0].depreciation, 6000, "SLM part-year (6/12)");
eq(Calc.assetSale({ bookValue: 72900, salePrice: 70000 }).result, "Loss on sale", "asset sale loss");
eq(Calc.equation({ assets: 500000, liabilities: 150000 }).capital, 350000, "equation: capital");
eq(Calc.equation({ liabilities: 150000, capital: 350000 }).assets, 500000, "equation: assets");
eq(Calc.equation({ assets: 500000, capital: 350000 }).liabilities, 150000, "equation: liabilities");
eq(Calc.closingCapital({ opening: 100000, additional: 20000, profit: 30000, drawings: 12000 }).closingCapital, 138000, "closing capital");
let tb = Calc.trialBalance([{ name: "Cash", amount: 5000, side: "Dr" }, { name: "Capital", amount: 4000, side: "Cr" }, { name: "Sales", amount: 1000, side: "Cr" }]); ok(tb.agrees, "TB agrees");
tb = Calc.trialBalance([{ name: "Cash", amount: 5000, side: "Dr" }, { name: "Capital", amount: 4000, side: "Cr" }]); eq(tb.difference, 1000, "TB difference");
let lb = Calc.ledgerBalance({ debits: [50000, 10000], credits: [20000, 5000] }); eq(lb.balance, 35000, "ledger balance"); eq(lb.balanceSide, "Debit", "ledger side"); eq(lb.grandTotal, 60000, "ledger grand total");
let b = Calc.brsSolve({ startingPoint: "Cash Book", startingBalance: 25000, items: [{ effect: "Add", amount: 5000 }, { effect: "Less", amount: 2000 }] }); eq(b.finalBalance, 28000, "BRS from Cash Book");
b = Calc.brsSolve({ startingPoint: "Pass Book", startingBalance: -4000, items: [{ effect: "Less", amount: 1000 }] }); eq(b.finalBalance, -5000, "BRS overdraft start");
eq(Calc.brsEffect("Add", "Pass Book"), "Less", "Pass Book start reverses Add→Less"); eq(Calc.brsEffect("Less", "Cash Book"), "Less", "Cash Book start keeps effect");
eq(Calc.brsClassify("Cheque issued, not yet presented (overdraft, Pass Book start)").effect, "Add", "BRS classify ignores parentheticals");
let pv = Calc.provisionDoubtful({ debtors: 100000, badDebts: 5000, provisionPct: 5, openingProvision: 3000 }); eq(pv.newProvision, 4750, "provision 5% of 95,000"); eq(pv.chargeToPL, 1750, "provision charge to P&L");
eq(Calc.interestOnCapital({ capital: 200000, ratePct: 6, months: 12 }).interest, 12000, "interest on capital");
eq(Calc.interestOnDrawings({ drawings: 24000, ratePct: 10, months: 6 }).interest, 1200, "interest on drawings (6 months)");
eq(Calc.commission({ netProfit: 110000, ratePct: 10, basis: "after" }).commission, 10000, "commission on profit after charging it");
ok(Calc.journalBalanced([{ dr: 100 }, { cr: 100 }]).balanced, "journal balanced"); ok(!Calc.journalBalanced([{ dr: 100 }, { cr: 90 }]).balanced, "journal unbalanced");
ok(Calc.checkMarkdownJournal("| Account | Dr. | Cr. |\n| --- | ---: | ---: |\n| Cash A/c | ₹100 | |\n| Capital A/c | | ₹90 |").length === 1, "markdown journal checker flags imbalance");
ok(Calc.checkMarkdownJournal("| Account | Dr. | Cr. |\n| --- | ---: | ---: |\n| Cash A/c | ₹1,00,000 | |\n| Capital A/c | | ₹1,00,000 |").length === 0, "markdown journal checker accepts balanced table");
eq(Calc.classifyAccount("Salary").nature, "Expense / Loss", "classify Salary"); eq(Calc.classifyAccount("Outstanding rent").nature, "Liability", "classify outstanding rent");
eq(Calc.classifyAccount("Prepaid insurance").nature, "Asset", "classify prepaid"); eq(Calc.classifyAccount("Purchases return").normal, "Credit", "classify purchases return");
eq(Calc.runTool("calculate", { expression: "100 * 18%" }).value, 18, "tool: calculate"); ok(Calc.runTool("nope", {}).error, "unknown tool reports error"); ok(Calc.runTool("gst_invoice", {}).error, "tool with missing input reports error, does not throw");

/* ---------------- B. audit of stored data ---------------- */
section("B. Stored site answers re-checked by the calculators");
let gstOk = 0; D.gst.detective.forEach(c => { if (Calc.gstFromBillText(c.billText).invoice === c.answerValue) gstOk++; });
eq(gstOk, D.gst.detective.length, `GST Bill Detective: all ${D.gst.detective.length} invoice values recomputed`);
let brsArith = 0, brsRule = 0, brsRuleTotal = 0; const brsConflicts = [];
D.brs.detective.forEach(c => {
  const r = Calc.brsSolve({ startingPoint: c.startingPoint, startingBalance: c.startingBalance, items: c.items.map(i => ({ effect: i.correctAnswer, amount: i.amount })) });
  if (r.finalBalance === c.finalBalance) brsArith++;
  c.items.forEach(i => { const k = Calc.brsClassify(i.label); if (k) { brsRuleTotal++; if (Calc.brsEffect(k.effect, c.startingPoint) === i.correctAnswer) brsRule++; else brsConflicts.push(`${c.id}: ${i.label}`); } });
});
eq(brsArith, D.brs.detective.length, `BRS Detective: all ${D.brs.detective.length} final balances recomputed`);
ok(brsRule / brsRuleTotal >= 0.97, `BRS Add/Less rules agree with stored answers (${brsRule}/${brsRuleTotal})`, brsConflicts.join("; "));
let jr = 0, jrTot = 0; D.journal.numericals.concat(D.ledger.extraPracticeTransactions || []).forEach(q => { if (q.entries) { jrTot++; if (Calc.journalBalanced(q.entries.map(e => ({ dr: e.dr, cr: e.cr }))).balanced) jr++; } });
eq(jr, jrTot, `Journal numericals: Dr = Cr in all ${jrTot}`);
const audited = kb.questions.map(q => ({ q, a: Know.audit(q) })).filter(x => x.a.checked);
const conflicts = audited.filter(x => !x.a.ok);
console.log(`   audit: ${audited.length} stored answers re-computed by code; ${conflicts.length} conflict(s)`);
conflicts.forEach(x => console.log(`   • [${x.q.section} ${x.q.id}] ${x.a.notes.join(" ")}`));
ok(audited.length >= 250, "audit covers a broad set of stored answers", String(audited.length));
// Known data items are surfaced (not hidden): the audit must flag them so the tutor can warn the student.
ok(conflicts.every(x => x.a.notes.length > 0), "every conflict carries an explanation");
/* Both formerly-known data issues (equation.numericals#31 and brs.detective#102)
   have been corrected in data.js, so the audit must now re-compute every stored
   answer with zero conflicts. Keep this assertion strict: any future drift
   between the stored answers and the calculators will fail here. */
eq(conflicts.length, 0, "audit finds zero stored-answer conflicts (both former known data issues fixed)", conflicts.map(x => `${x.q.id}: ${x.a.notes.join(" ")}`).join(" | "));
eq(conflicts.filter(x => x.q.id === "equation.numericals#31").length, 0, "equation.numericals#31 now agrees with the calculator");
eq(conflicts.filter(x => x.q.id === "brs.detective#102").length, 0, "brs.detective#102 now agrees with the calculator");

/* ---------------- C. index coverage ---------------- */
section("C. Index coverage");
const bySection = {}; kb.questions.forEach(q => { bySection[q.section] = (bySection[q.section] || 0) + 1; });
["Practice Bank", "Accounting in Action", "Term Detective", "Concept Detective", "Basis Switch", "Balance Sheet Questions", "Balance Sheet Statements", "Journal → Ledger Practice", "Exam Questions", "BRS Detective", "GST Bill Detective", "Trial Balance Checkpoint", "Quiz", "Important Questions"].forEach(sec => ok(bySection[sec] > 0, `indexed section: ${sec}`, String(bySection[sec])));
const kinds = {}; kb.docs.forEach(d => { kinds[d.kind] = (kinds[d.kind] || 0) + 1; });
["theory", "concept", "revision", "example", "formula", "pattern", "flashcard", "mindmap", "question"].forEach(k => ok(kinds[k] > 0, `indexed content kind: ${k}`, String(kinds[k])));
const ids = new Set(); let dup = 0; kb.questions.forEach(q => { if (ids.has(q.id)) dup++; ids.add(q.id); });
eq(dup, 0, "question ids are unique");
ok(kb.questions.every(q => q.text && q.text.length > 5), "every indexed question has text");
const chaptersWithPB = new Set(kb.questions.filter(q => q.section === "Practice Bank").map(q => q.chapterId));
const PB_CHAPTERS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "cb", "sp2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
PB_CHAPTERS.forEach(ch => ok(chaptersWithPB.has(ch), `Practice Bank indexed for chapter ${ch}`));
eq(chaptersWithPB.size, PB_CHAPTERS.length, `Practice Bank indexed for all ${PB_CHAPTERS.length} chapters that have one (Ledger practice is its own tab)`);
ok(kb.questions.some(q => q.chapterId === "lg" && q.section === "Journal → Ledger Practice" || q.chapterId === "lg" && q.section === "Exam Questions"), "Ledger chapter questions indexed (Journal → Ledger Practice / Exam Questions)");
ok(kb.formulaDocs > 40, "Formula Sheet parsed from app.js", String(kb.formulaDocs));
// Nothing is duplicated: identity map points at the original objects
ok(kb.byRaw.get(D.brs.detective[3]) && kb.byRaw.get(D.brs.detective[3]).raw === D.brs.detective[3], "questions reference the ORIGINAL data objects (no copies)");
ok(buildMs < 2500, `index builds fast (${buildMs} ms for ${kb.docs.length} docs)`);
console.log(`   ${kb.questions.length} questions + ${kb.docs.length - kb.questions.length} content blocks indexed in ${buildMs} ms`);

/* ---------------- D. retrieval ---------------- */
section("D. Retrieval — answer NOT in the tutor prompt, but IN a chapter");
const tutorPrompt = fs.readFileSync(path.join(ROOT, "tutor-engine.js"), "utf8");
function top(q, n) { return Know._search(kb, q, { limit: n || 5, kinds: ["theory", "concept", "revision", "example", "formula", "mindmap", "pattern", "flashcard"], preferTeaching: true }); }
const cases = [
  ["Why is salary debited?", d => d.chapterId === "dc" || /salary|expense|nominal/i.test(d.title + d.text)],
  ["How does BRS work?", d => d.chapterId === "brs"],
  ["What is the difference between CGST and SGST?", d => d.chapterId === "gst"],
  ["Explain accrual basis simply", d => d.chapterId === "basis"],
  ["Why does Trial Balance agree?", d => d.chapterId === "tb"],
  ["What is a liability?", d => /liabilit/i.test(d.title + d.text)],
  ["difference between SLM and WDV depreciation", d => d.chapterId === "dep"],
  ["what is petty cash imprest system", d => d.chapterId === "cb"],
  ["what is a contra entry", d => d.chapterId === "cb"],
  ["going concern concept", d => d.chapterId === "tbase"],
  ["what is a debit note", d => d.chapterId === "sp2"],
  ["why are drawings debited", d => d.chapterId === "dc" || /drawing/i.test(d.title + d.text)],
  ["balancing a ledger account balance c/d", d => d.chapterId === "lg"]
];
cases.forEach(([q, test]) => { const r = top(q, 4); ok(r.some(x => test(x.doc)), `retrieves relevant chapter content: "${q}"`, r.map(x => x.doc.chapterId + ":" + x.doc.title.slice(0, 30)).join(" | ")); });
// Data-driven: query by the heading of 60 random theory blocks -> that block must be in the top 4.
let hit = 0, tried = 0; const theoryDocs = kb.docs.filter(d => d.kind === "theory" && d.title.length > 12 && d.text.length > 120);
const step = Math.max(1, Math.floor(theoryDocs.length / 60));
for (let i = 0; i < theoryDocs.length && tried < 60; i += step) { const d = theoryDocs[i]; tried++; if (Know._search(kb, d.title, { limit: 4 }).some(x => x.doc === d || (x.doc.title === d.title && x.doc.chapterId === d.chapterId))) hit++; }
ok(hit / tried >= 0.85, `heading → block recall@4 = ${hit}/${tried}`);
// The deliberate retrieval test: a fact that exists only in chapter data.
const needle = D.dep.theory.simple.concat(D.dep.theory.advanced).find(b => b.p && b.p.length > 80);
if (needle) {
  ok(!tutorPrompt.includes(needle.p.slice(0, 60)), "needle fact is NOT in the tutor prompt/engine files");
  const r = Know._buildContext(kb, needle.h, {});
  ok(r.teach.some(x => x.doc.text.includes(needle.p.slice(0, 40))), `tutor retrieves "${needle.h}" from chapter data`);
  ok(Know._contextToPrompt(kb, r, {}).includes(needle.p.slice(0, 40)), "retrieved text is placed in the model context");
}
const ctxSize = Know._contextToPrompt(kb, Know._buildContext(kb, "Why is salary debited?", {}), { maxChars: 5200 }).length;
ok(ctxSize < 5300, `context stays small (${ctxSize} chars) — not the whole site`);

/* ---------------- E. exact / modified question lookup ---------------- */
section("E. Exact and modified-question lookup");
let exactHit = 0, exactTot = 0;
kb.questions.filter((_, i) => i % 7 === 0).forEach(q => { exactTot++; const f = Know._findQuestion(kb, q.text); if (f && f.exact && (f.question.id === q.id || f.question.text === q.text || f.similarity === 1)) exactHit++; });
ok(exactHit / exactTot >= 0.97, `exact lookup: ${exactHit}/${exactTot} sampled questions found by their own text`);
const sample = kb.questions.find(q => q.section === "Practice Bank" && /₹\s?\d/.test(q.text) && q.text.length > 80);
const modified = sample.text.replace(/₹\s?([\d,]+)/, (m, n) => "₹" + (parseInt(n.replace(/,/g, ""), 10) + 7000).toLocaleString("en-IN"));
const mf = Know._findQuestion(kb, modified); ok(mf && mf.question.id === sample.id && !mf.exact && mf.variant, "modified numbers → matched as a VARIANT, not an exact match", JSON.stringify(mf && { id: mf.question.id, sim: mf.similarity, exact: mf.exact }));
ok(Know._findQuestion(kb, "What is the capital of France and who painted the Mona Lisa today?") === null, "unrelated text matches no stored question");

/* ---------------- F. offline answers ---------------- */
section("F. Offline tutor on pasted / un-banked questions");
const Core = require(path.join(ROOT, "ai-tutor-core.js"));
function offline(text, state) { const r = Core.respond(kb, text, state || Core.newState(), {}); return r.answer ? { text: r.answer.text, state: r.state, sources: r.answer.sources } : null; }
let r = offline("Goods worth ₹50,000 sold, trade discount 10%, GST 18%. Find the invoice value.");
ok(r && /53,100/.test(r.text) && /4,050/.test(r.text), "GST numerical solved exactly (invoice ₹53,100, CGST ₹4,050)", r && r.text.slice(0, 160));
r = offline("A machine costing ₹1,00,000 with residual value ₹10,000 is depreciated at 10% p.a. under SLM. Find annual depreciation.");
ok(r && /9,000/.test(r.text), "SLM numerical solved exactly (₹9,000)", r && r.text.slice(0, 160));
r = offline("A machine costing ₹1,00,000 is depreciated at 10% p.a. on written down value method for 3 years.");
ok(r && /72,900/.test(r.text), "WDV 3-year numerical solved (book value ₹72,900)", r && r.text.slice(0, 160));
r = offline("Total assets are ₹5,00,000 and liabilities are ₹1,50,000. Find the capital using the accounting equation.");
ok(r && /3,50,000/.test(r.text), "Accounting equation solved (capital ₹3,50,000)", r && r.text.slice(0, 160));
r = offline("What is a liability?"); ok(r && /liabilit/i.test(r.text), "definition answered from chapter content");
r = offline("Why is salary debited?"); ok(r && /(Nominal|expense)/i.test(r.text) && /(debit)/i.test(r.text), "'Why is salary debited' explained from the site's rules", r && r.text.slice(0, 200));
r = offline("How does BRS work?"); ok(r && /bank|reconcil/i.test(r.text), "BRS concept answered from site content");
// A stored question solved with the site's own explanation + verified recomputation
const brsQ = kb.questions.find(q => q.srcKey === "brs.detective");
r = Core.respond(kb, "Please solve this question step by step.", Core.newState(), { question: brsQ }); ok(r.answer && /Final Answer/.test(r.answer.text) && /Checked:/.test(r.answer.text), "Ask AI on BRS Detective: solved + verified");
const gstQ = kb.questions.find(q => q.srcKey === "gst.detective");
r = Core.respond(kb, "Please solve this question step by step.", Core.newState(), { question: gstQ }); ok(r.answer && r.answer.text.includes(Calc.inr(gstQ.raw.answerValue)), "Ask AI on GST Bill Detective: final invoice shown");
// BRS starting point is read from the data, never assumed
const pbQ = kb.questions.find(q => q.srcKey === "brs.detective" && q.raw.startingPoint === "Pass Book");
r = Core.respond(kb, "Please solve this question step by step.", Core.newState(), { question: pbQ }); ok(r.answer && /Pass Book/.test(r.answer.text.split("Items")[0]), "BRS question starting from Pass Book keeps its starting point");
// Follow-up memory
let st = Core.newState(); st = Core.respond(kb, "Explain depreciation", st, {}).state; const follow = Core.respond(kb, "Give me an example", st, {});
ok(follow.answer && /depreciat/i.test(follow.answer.text), "follow-up 'give me an example' stays on depreciation", follow.answer && follow.answer.text.slice(0, 120));/* ---------------- G. no remote-service wiring in browser-served files ---------------- */
section("G. No remote-service wiring in browser-served files");
{
  const publicFiles = ["app.js", "index.html", "ai-calc.js", "ai-knowledge.js", "tutor-engine.js", "sw.js"].map(f => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
  ok(!/sk-ant-|x-api-key|ANTHROPIC_API_KEY/.test(publicFiles), "no provider key / header in any browser-served file");
  ok(publicFiles.indexOf("fetch(" + String.fromCharCode(34) + "/.netlify/functions") === -1 && publicFiles.indexOf("fetch(" + String.fromCharCode(39) + "/.netlify/functions") === -1, "browser code never fetches a Netlify Function");
}

console.log("\nAI tests: " + pass + " passed, " + fail + " failed");
if (fail) { console.log("\nFAILURES:"); failures.forEach(f => console.log("  x " + f)); process.exit(1); }
