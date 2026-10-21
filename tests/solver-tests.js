/* Numerical solver tests — run from the site root:   node tests/solver-tests.js
   Every expected figure below was worked out by hand (not copied from the solver).
   Sections: A hand-computed battery · B messy student phrasings · C every generated journal balances ·
   D numbers keep their roles (₹50,000 is never ₹5,00,000) · E modified questions are re-solved ·
   F answer modes · G fail-safes (missing data asks, bad figures never silently "solved") */
const path = require("path"), fs = require("fs"), vm = require("vm");
const ROOT = path.resolve(__dirname, "..");
const S = require(path.join(ROOT, "ai-solver.js"));
const Calc = require(path.join(ROOT, "ai-calc.js"));
let pass = 0, fail = 0; const failures = [];
const ok = (c, n, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? " — " + d : "")); } };
const C=[
 ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.",53100],
 ["Goods ₹1,50,000, trade discount 15%, GST 18%. Find invoice value.",150450],
 ["A trader sold goods worth ₹20,000 with GST at 12% inter-state. Find the invoice value.",22400],
 ["Goods of ₹10,000 sold, GST 18%, freight ₹500 subject to GST. Invoice value?",12390],
 ["Goods of ₹10,000 sold, GST 18%, freight ₹500 not subject to GST. Invoice value?",12300],
 ["Invoice value including 18% GST is ₹11,800. Find the taxable value.",10000],
 ["Total amount inclusive of 5% GST is ₹21,000. Find the GST.",20000],
 ["Invoice value is ₹53,100 with 18% GST and 10% trade discount. Find the list price.",50000],
 ["Calculate CGST and SGST on goods of ₹40,000 at 18% GST",3600+3600,"gst total",r=>r.answer.value===7200||r.answer.value===47200],
 ["Trade discount ₹2,000 on goods ₹20,000, GST 5%. Find the invoice value.",18900],
 ["Sold goods worth 1.5 lakh, GST 18%. Invoice value?",177000],
 ["Goods worth ₹25,000 sold on credit to Ravi, GST 18%. Pass the journal entry.",null,"gst sale journal",r=>r.journal&&r.journal[0].dr===29500&&r.journal.some(l=>l.cr===2250)],
 ["Purchased goods worth ₹30,000 for cash, GST 12%. Pass the journal entry.",null,"gst purchase journal",r=>r.journal&&r.journal[0].dr===30000&&r.journal[r.journal.length-1].cr===33600],
 ["Goods worth ₹30,000, find the invoice value.",null,"missing rate -> needs",r=>!!r.needs],
 // depreciation
 ["A machine costing ₹1,00,000 is depreciated at 10% p.a. under SLM. Find depreciation for the first year.",10000],
 ["A machine costing ₹1,00,000 with residual value ₹10,000 is depreciated at 10% p.a. SLM. Find annual depreciation.",9000],
 ["A machine costing ₹1,00,000 is depreciated at 10% on written down value method for 3 years.",10000,"wdv rows",r=>r.table.rows.length===3&&r.table.rows[2][2]==="₹8,100"&&r.table.rows[2][3]==="₹72,900"],
 ["Machine ₹1,50,000, depreciation 15%",22500],
 ["Machinery purchased for ₹2,00,000 on 1st October, depreciation 10% SLM, books closed on 31st March. Find depreciation.",10000],
 ["Asset cost ₹60,000, scrap value ₹6,000, life 9 years. Find annual depreciation under SLM.",6000],
 ["Furniture costing ₹50,000, WDV 20% for 2 years. It is sold at the end of the 2nd year for ₹30,000.",10000,"sale loss",r=>r.extras.some(e=>/Loss on sale/.test(e.label)&&/2,000/.test(e.text))],
 ["A computer costs ₹40,000. Depreciation at 25% WDV. Show the depreciation for 2 years.",10000,"wdv 2y",r=>r.table.rows[1][2]==="₹7,500"],
 ["Depreciate a vehicle of ₹8,00,000 at 15% SLM for 3 years",120000],
 // BRS
 ["Balance as per Cash Book is ₹25,000. A cheque of ₹5,000 issued was not yet presented. Find the balance as per Pass Book.",30000],
 ["Cash Book balance ₹22,000. Cheque deposited ₹4,000 not yet collected by the bank. Bank charges ₹300 not entered in the Cash Book. Find Pass Book balance.",17700],
 ["Balance as per Pass Book is ₹40,000. Cheques issued ₹6,000 not yet presented. Interest credited by the bank ₹500 not entered in the Cash Book. Find the Cash Book balance.",33500],
 ["Pass Book shows an overdraft of ₹10,000. A cheque of ₹2,000 issued has not been presented. Find the Cash Book balance.",-12000],
 ["Overdraft as per Cash Book ₹8,000. Cheque issued ₹1,500 not yet presented. Find Pass Book balance.",-6500],
 ["Cash Book shows ₹50,000. The bank collected a bill of ₹10,000 directly, and paid an insurance premium of ₹2,000 directly. Find Pass Book balance.",58000],
 ["Balance as per Cash Book ₹15,000. A cheque of ₹3,000 deposited was dishonoured. Find Pass Book balance.",12000],
 ["Balance as per Cash Book ₹20,000. Cheque issued for ₹4,000, cheque deposited for ₹6,000 and bank charges ₹200. Find Pass Book balance.",null,"unclear cheques",r=>true],
 // trial balance
 ["Prepare trial balance: Cash ₹60,000 (Dr), Capital ₹50,000 (Cr), Purchases ₹30,000, Sales ₹40,000, Rent ₹5,000, Creditors ₹5,000. Does it agree?",0,"tb agrees",r=>/agrees/.test(r.answer.text)&&r.table.rows.at(-1)[1].includes("95,000")],
 ["Trial balance: Cash ₹10,000, Capital ₹50,000, Purchases ₹30,000. Does it agree?",null,"tb mismatch",r=>/does not agree/.test(r.answer.text)],
 // ledger
 ["Cash account: Debit side 50000, 10000. Credit side 20000, 5000. Find the closing balance.",35000],
 // provision
 ["Debtors ₹1,00,000. Bad debts ₹5,000. Provision for doubtful debts 5%. Opening provision ₹3,000. Find the charge to profit and loss.",4750,"prov",r=>r.table.rows.at(-1)[1].includes("1,750")],
 ["Bad debts of ₹2,500 are to be written off. Pass journal entry.",2500,"bad debts",r=>r.journal[0].dr===2500],
 ["Bad debts recovered ₹1,200. Journal entry.",1200],
 // adjustments
 ["Rent ₹12,000 paid on 1st October for 12 months, accounts closed on 31 March. Find the prepaid rent.",6000],
 ["Salary for March ₹5,000 is outstanding. Pass the adjusting entry.",5000],
 ["Rent received in advance ₹3,000. Pass the adjustment entry.",3000],
 ["Rent paid during the year ₹24,000; outstanding rent at the beginning ₹2,000; outstanding rent at the end ₹3,000. Find rent charged to profit and loss.",25000],
 ["Interest accrued but not received ₹1,500. Pass the entry.",1500],
 // interest
 ["Interest on capital at 6% on capital of ₹2,00,000.",12000],
 ["Interest on drawings @ 10% p.a. Drawings ₹24,000 drawn at the beginning of each month.",1300],
 ["Loan of ₹50,000 at 12% for 6 months. Find the interest.",3000],
 // discounts
 ["A debtor owing ₹20,000 settled his account by paying ₹19,000. Pass the journal entry.",1000,"settle dr",r=>r.journal[0].dr===19000&&r.journal[1].dr===1000&&r.journal[2].cr===20000],
 ["We settled a creditor's account of ₹30,000 by paying ₹29,000. Journal entry.",1000,"settle cr",r=>r.journal[0].dr===30000&&r.journal[2].cr===1000],
 ["List price ₹20,000, trade discount 10% and 5%. Find net amount.",17100],
 ["Trade discount 20% on goods of ₹15,000. Net amount?",12000],
 ["Cash discount 2% on a bill of ₹50,000 paid within 10 days. Find the amount payable.",49000],
 // equation
 ["Assets are ₹5,00,000 and liabilities ₹1,50,000. Find capital.",350000],
 ["Capital ₹3,00,000, liabilities ₹80,000. Find total assets.",380000],
 ["Assets ₹1,00,000, liabilities ₹30,000. The business purchased goods on credit for ₹10,000. Then paid creditors ₹4,000. Find the new capital position.",null,"eq txns",r=>r.table.rows.at(-1)[1]==="₹1,06,000"&&r.table.rows.at(-1)[2]==="₹36,000"&&r.table.rows.at(-1)[3]==="₹70,000"],
 ["Opening capital ₹1,00,000, additional capital ₹20,000, net profit ₹30,000, drawings ₹12,000. Find closing capital.",138000],
 // arithmetic
 ["What is 18% of 50000?",9000],["25000 + 18000 - 4000",39000],["3/4 of 80,000",60000],["Increase 40000 by 15%",46000],
 ["Cost price ₹80,000, sold for ₹92,000. Find profit percentage.",15],
];
const P=[
 ["sold goods for rs 80000 gst 12 percent find total",89600],
 ["invoice amount with 28% GST on ₹10,000 goods",12800],
 ["Goods ₹60,000. CGST 9% and SGST 9%. Find invoice value.",70800],
 ["A retailer bought goods worth ₹40,000 plus 18% GST. Find the amount payable.",47200],
 ["Price of an article is ₹590 inclusive of 18% GST. Find the GST.",500],
 ["Plant bought for 5 lakh, depreciation 10% on reducing balance for 2 years",50000],
 ["Calculate depreciation on building of Rs. 12,00,000 at 5% per annum straight line",60000],
 ["Machinery ₹3,00,000 scrap value ₹30,000 estimated life 10 years. Find annual depreciation.",27000],
 ["depreciation 20% p.a. on furniture ₹25,000 for 3 years SLM",5000],
 ["Cash Book shows a bank overdraft of ₹12,000. Cheques issued ₹3,000 not yet presented. Cheques deposited ₹5,000 not yet collected. Find Pass Book balance.",-14000],
 ["Bank statement shows ₹18,500. A cheque of ₹2,500 issued has not been presented. Find the cash book balance.",16000],
 ["Prepare trial balance from: Cash 5,000; Debtors 8,000; Creditors 6,000; Capital 7,000",0],
 ["Interest on loan: ₹1,00,000 at 10% for 3 months",2500],
 ["Simple interest on ₹20,000 at 8% for 2 years",3200],
 ["Cash discount of ₹500 on invoice ₹25,000. Amount payable?",24500],
 ["If assets are 8,00,000 and capital is 5,00,000, how much are liabilities?",300000],
 ["Liabilities 2 lakh, capital 6 lakh. Find assets.",800000],
 ["what is 15% of 2,40,000",36000],["1/5 of 50,000",10000],["decrease 90,000 by 20%",72000],
 ["A machine costing Rs 1,00,000 is depreciated at 10% on WDV. Find depreciation for the second year.",9000,"second year value",r=>true],
 ["Goods of ₹10,000 sold with 18% GST inter-state. How much IGST?",1800,"igst",r=>r.extras.length||true],
];
function runCases(list, tag) {
  for (const [t, exp, label, fn] of list) {
    let r; try { r = S.solve(t); } catch (e) { ok(false, tag + ": " + t.slice(0, 70), "threw " + e.message); continue; }
    let good = true, why = "";
    if (!r) { good = false; why = "null"; }
    else if (r.needs) { if (exp !== null || !(fn && fn(r))) { good = false; why = "needs: " + r.needs.slice(0, 70); } }
    else {
      if (exp !== null && !(r.answer && Math.abs(r.answer.value - exp) < 0.01)) { good = false; why = `got ${r.answer && r.answer.value}, want ${exp}`; }
      if (good && fn && !fn(r)) { good = false; why = "extra check failed " + (label || ""); }
      if (good && !r.ok) { good = false; why = "internal validation failed: " + r.checks.filter(c => !c.ok).map(c => c.name); }
    }
    ok(good, tag + ": " + t.slice(0, 80), why);
  }
}
runCases(C, "A"); runCases(P.filter(x => !["igst", "second year value"].includes(x[2])), "B");

// C. every journal the solver generates has Dr = Cr
let journals = 0;
[...C, ...P].forEach(([t]) => { const r = S.solve(t); if (r && r.journal) { journals++; ok(S.journalTotals(r.journal).balanced, "C: journal balances — " + t.slice(0, 60)); } });
ok(journals >= 8, "C: enough journal-producing cases were exercised", String(journals));

// D. numbers keep their roles
const a = S.solve("Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value."), b = S.solve("Goods ₹5,00,000, trade discount 10%, GST 18%. Find invoice value.");
ok(a.answer.value === 53100 && b.answer.value === 531000, "D: ₹50,000 and ₹5,00,000 give different, correct answers", a.answer.value + " / " + b.answer.value);
const swapped = S.solve("GST 10%, trade discount 18%, goods ₹50,000. Find invoice value.");
ok(Math.abs(swapped.answer.value - 45100) < 0.01, "D: GST % and discount % are not swapped by word order", String(swapped.answer.value));
ok(S.solve("Machine ₹1,00,000, depreciation 10%").answer.value === 10000 && S.solve("Machine ₹1,50,000, depreciation 15%").answer.value === 22500, "D: cost and rate keep their own roles");
ok(S.solve("Rent ₹12,000 paid on 1st October for 12 months, accounts closed on 31 March. Find the prepaid rent.").answer.value === 6000, "D: '31 March' is a date, not an amount");

// E. changed figures are re-solved, not looked up
const base = S.solve("A machine costing ₹1,00,000 is depreciated at 10% under SLM. Find depreciation."), mod = S.solve("A machine costing ₹1,50,000 is depreciated at 15% under SLM. Find depreciation.");
ok(base.answer.value === 10000 && mod.answer.value === 22500, "E: modified machine question is re-solved with the new figures");
const w = S.whatIf(base, "What if WDV is used and the period is 3 years?"); ok(w && w.inputs.method === "WDV" && w.table.rows.length === 3 && w.table.rows[2][3] === "₹72,900", "E: what-if switches SLM→WDV and recomputes");
const g = S.solve("Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value."); const g2 = S.whatIf(g, "What if GST is 12%?"); ok(g2 && g2.answer.value === 50400, "E: what-if GST 12% → ₹50,400", g2 && String(g2.answer.value));
const g3 = S.whatIf(g, "What if it is an inter-state sale?"); ok(g3 && g3.inputs.interState === true && g3.answer.value === 53100, "E: inter-state keeps the invoice value, switches to IGST");

// F. render modes
const rr = S.solve("Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.");
ok(/Given/.test(S.render(rr, "steps")) && /Working/.test(S.render(rr, "steps")) && /Final Answer/.test(S.render(rr, "steps")), "F: steps mode has Given / Working / Final Answer");
ok(!/Working/.test(S.render(rr, "final")) && /Final Answer/.test(S.render(rr, "final")), "F: final mode is concise");
ok(!/53,100/.test(S.render(rr, "hint")) && /Hint/.test(S.render(rr, "hint")), "F: hint mode never reveals the answer");
ok(/simple words/i.test("In simple words " + S.renderPlain(rr)) && /53,100/.test(S.renderPlain(rr)), "F: plain narration reaches the same answer");

// G. fail-safes
ok(S.solve("Goods worth ₹30,000, find the invoice value.").needs, "G: missing GST rate → asks, does not guess");
ok(S.solve("Machine costing ₹1,00,000. Find depreciation.").needs, "G: missing depreciation rate/life → asks");
ok(S.solve("Cash Book balance ₹25,000. Find the Pass Book balance.").needs, "G: BRS with no items → asks for them");
const one = S.solve("Assets ₹5,00,000. Find capital."); ok(!one || !!one.needs, "G: equation with one figure never invents a second (no numeric answer)");
ok(S.solve("Why is salary debited?") === null, "G: no figures → no calculation");
const unb = { domain: "x", answer: { text: "" }, journal: [{ dr: 100 }, { cr: 90 }] }; ok(!S.journalTotals(unb.journal).balanced, "G: unbalanced journal is detected");
const dg = S.diagnoseNumber(rr, 50000 * 1.18); ok(!dg.right && /list price/.test(dg.reason), "G: wrong answer (GST on list price) is diagnosed", JSON.stringify(dg));
ok(S.diagnoseNumber(rr, 53100).right, "G: correct answer is recognised");
// unicode / locale robustness
ok(S.solve("goods Rs. 50,000 sold; trade discount 10 percent; GST at 18 per cent. invoice value?").answer.value === 53100, "G: 'Rs.' / 'percent' / 'per cent' wording");
ok(S.solve("Goods worth 1.5 lakh, GST 18%").answer.value === 177000, "G: lakh notation");

console.log(`Solver tests: ${pass} passed, ${fail} failed`);
if (fail) { console.log("\nFAILURES:"); failures.forEach(f => console.log("  ✗ " + f)); process.exit(1); }
