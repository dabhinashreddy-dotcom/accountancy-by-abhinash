/* INDEPENDENT PROBE — 19 representative Class 11 problems run through the accounting-cycle
   engine, checking the accounting ANSWER itself (not just Dr = Cr). Full report by default;
   `--quiet` prints failures only.
   npm test runs it with --quiet (failures break the build); `npm run test:probe` shows all.
   Run:  node tests/probe-cycle.js            (full report)
         node tests/probe-cycle.js --quiet    (failures only)                 */
const load = require("./loader.js");
const E = load();
const QUIET = process.argv.includes("--quiet");

const near = (a, b, tol) => Math.abs(a - b) < (tol || 0.011);
let n = 0, bad = 0;
const fmt = l => (l.dr !== undefined ? "Dr " + l.account + " " + l.dr : "Cr " + l.account + " " + l.cr);
const F = r => (r && r.lines ? r.lines.map(fmt).join("; ") : (r ? r.status + " " + (r.reason || "") : "null"));

function one(text, ctx) { return E.acParseTransaction(text, 1, ctx || {}); }
function run(text, closing) { return E.acRunCycle(text, closing || 0); }

const S = [];
const scenario = (name, fn) => S.push({ name, fn });

/* ---------------- compound / multi-amount ---------------- */
scenario("three expenses in one sentence, compound entry", () => {
  const r = one("Paid salary ₹5,000, rent ₹2,000 and carriage inward ₹1,500 in cash.");
  if (r.status !== "VALID") return r.status + " " + r.reason;
  const dr = r.lines.filter(l => l.dr !== undefined);
  if (dr.length !== 3) return "expected 3 debits: " + F(r);
  const cr = r.lines.find(l => l.cr !== undefined);
  if (!cr || cr.account !== "Cash A/c" || !near(cr.cr, 8500)) return "cash credit wrong: " + F(r);
  return null;
});

scenario("discount is on the list price, GST on the taxable value", () => {
  const r = one("Sold goods ₹20,000 less trade discount 10%, plus CGST 9% and SGST 9%, for cash.");
  if (r.status !== "VALID") return r.status + " " + r.reason;
  const dr = r.lines.find(l => l.account === "Cash A/c");
  if (!dr) return "no cash debit: " + F(r);
  if (!near(dr.dr, 21240)) return "cash should be 18,000 + 3,240 = 21,240, got " + dr.dr + " → " + F(r);
  return null;
});

/* ---------------- chronological ---------------- */
scenario("later-dated depreciation before an earlier purchase is reordered", () => {
  const r = run("Apr 15: Charge depreciation on machinery @10% p.a. for 1 month.\nApr 01: Purchased machinery ₹1,20,000 for cash.", 0);
  if (r.incomplete) return "reported incomplete: " + JSON.stringify(r.summary);
  const first = r.results[0].text;
  if (!/Apr 01/.test(first)) return "order: " + r.results.map(x => x.text).join(" | ");
  return null;
});

/* ---------------- opening balances ---------------- */
scenario("opening balances build the first journal and a balanced TB", () => {
  const r = run("Cash ₹40,000; Bank ₹25,000; Debtors ₹30,000; Creditors ₹20,000; Stock ₹15,000; Capital ₹90,000", 0);
  if (r.summary.processed < 1) return "nothing parsed: " + JSON.stringify(r.summary);
  if (!r.tb.balanced) return "TB unbalanced " + r.tb.totalDebit + " vs " + r.tb.totalCredit;
  if (!r.tb.checks.ok) return JSON.stringify(r.tb.checks);
  return null;
});

/* ---------------- state: partial mutation ---------------- */
scenario("an INVALID transaction leaves the state untouched", () => {
  const ctx = {};
  one("Started business with cash ₹1,00,000.", ctx);
  const before = JSON.stringify({ b: ctx.balances, c: ctx.cashBalance });
  const r = one("Paid something with no amount at all.", ctx);
  const after = JSON.stringify({ b: ctx.balances, c: ctx.cashBalance });
  if (before !== after) return "state mutated on " + r.status + ": " + r.reason;
  if (r.status === "VALID") return "sentence with no amount was accepted: " + F(r);
  return null;
});

scenario("an UNCERTAIN transaction reports a reason, not silence", () => {
  const r = one("Paid ₹5,000 towards something unclear and unspecified.", {});
  if (r.status === "VALID") return "silently accepted: " + F(r);
  if (!r.reason || r.reason.length < 15) return "no explanation: " + JSON.stringify(r.reason);
  return null;
});

/* ---------------- ledger / TB / final accounts consistency ---------------- */
const CYCLE = [
  "Apr 01: Commenced business with Cash ₹1,50,000, Goods ₹50,000 and Furniture ₹40,000.",
  "Apr 04: Purchased goods from Ramesh ₹40,000 plus CGST 9% and SGST 9% on credit.",
  "Apr 09: Sold goods to Suresh ₹70,000 plus CGST 9% and SGST 9% on credit.",
  "Apr 14: Paid rent ₹6,000 and salaries ₹9,000 by cheque.",
  "Apr 20: Received a cheque from Suresh for the full amount, discount allowed ₹1,000.",
  "Apr 26: Paid Ramesh in full, discount received ₹500.",
  "Apr 30: Charge depreciation on furniture @10% p.a. for 6 months."
].join("\n");

scenario("Journal → Ledger → Trial Balance → Final Accounts all agree", () => {
  const r = run(CYCLE, 60000);
  if (r.incomplete) return "incomplete: " + JSON.stringify(r.summary) + " " + JSON.stringify(r.failures.map(f => f.reason));
  if (!r.tb.balanced) return "TB unbalanced " + r.tb.totalDebit + " vs " + r.tb.totalCredit;
  if (!r.tb.checks.ok) return "TB checks: " + JSON.stringify(r.tb.checks);
  const jd = r.journalLines.reduce((s, l) => s + (l.dr || 0), 0);
  const ld = Object.values(r.ledgers).reduce((s, l) => s + l.totalDr, 0);
  if (!near(jd, ld)) return "journal " + jd + " ≠ ledger " + ld;
  if (!r.fa.bs.balanced) return "balance sheet " + r.fa.bs.totalAssets + " vs " + r.fa.bs.totalLiabilities;
  // ledger balances must equal the TB rows
  for (const row of r.tb.rows) {
    const led = r.ledgers[row.account];
    if (!led) return "TB row with no ledger: " + row.account;
    const bal = Math.abs(led.balance);
    if (!near(bal, row.debit + row.credit)) return "TB row ≠ ledger balance for " + row.account;
  }
  return null;
});

scenario("closing stock is not double counted", () => {
  const r = run(CYCLE, 60000);
  const stocks = r.fa.bs.assets.filter(a => /stock|goods/i.test(a.label));
  if (stocks.length !== 1) return "stock rows: " + JSON.stringify(stocks.map(s => s.label + "=" + s.amount));
  if (!near(stocks[0].amount, 60000)) return "closing stock should be 60,000, got " + stocks[0].amount;
  return null;
});

scenario("GST net payable lands on the liabilities side once", () => {
  const r = run(CYCLE, 60000);
  const gst = r.fa.bs.liabilities.filter(x => /GST/i.test(x.label));
  if (gst.length !== 1) return "GST rows: " + JSON.stringify(gst.map(x => x.label + "=" + x.amount));
  if (!near(gst[0].amount, 5400)) return "net GST should be output 12,600 − input 7,200 = 5,400, got " + gst[0].amount;
  return null;
});

scenario("ledger balances feed trading / P&L (gross profit, net profit)", () => {
  const r = run(CYCLE, 60000);
  // Sales 70,000 − COGS (50,000 + 40,000 − 60,000 = 30,000) = 40,000 gross profit
  if (!near(r.fa.trading.grossProfit, 40000)) return "gross profit " + r.fa.trading.grossProfit;
  const exp = r.fa.pl.dr.reduce((s, x) => s + x.amount, 0);
  const inc = r.fa.pl.cr.reduce((s, x) => s + x.amount, 0);
  if (!near(r.fa.pl.netProfit, inc - exp)) return "net profit " + r.fa.pl.netProfit + " ≠ " + (inc - exp);
  return null;
});

/* ---------------- failed transactions are exposed ---------------- */
scenario("failures are listed with their own text and reason", () => {
  const r = run("Started business with cash ₹1,00,000.\nPaid commission ₹500 in cash.\nCorrected an error relating to purchase of furniture.", 0);
  if (!r.incomplete) return "not flagged incomplete";
  if (!r.failures.length) return "no failures surfaced";
  if (r.failures.some(f => !f.text || !f.reason)) return "a failure has no text/reason: " + JSON.stringify(r.failures);
  if (r.failures.some(f => f.lines && f.lines.length)) return "a failed transaction still exposes committed lines";
  return null;
});

/* ---------------- account identity ---------------- */
scenario("same account written two ways ends up in one ledger", () => {
  const r = run("Started business with cash ₹60,000.\nPaid carriage inward ₹1,200.\nPaid carriage inwards ₹800.\nPaid Carriage Inward ₹500.", 0);
  const names = Object.keys(r.ledgers).filter(x => /carriage/i.test(x));
  if (names.length !== 1) return JSON.stringify(names);
  if (!near(r.ledgers[names[0]].totalDr, 2500)) return "total " + r.ledgers[names[0]].totalDr;
  return null;
});

scenario("party name capitalisation does not split a ledger", () => {
  const r = run("Started business with cash ₹50,000.\nSold goods to rahul ₹10,000 on credit.\nReceived ₹4,000 from Rahul in cash.", 0);
  const names = Object.keys(r.ledgers).filter(x => /rahul/i.test(x));
  if (names.length !== 1) return JSON.stringify(names);
  return null;
});

/* ---------------- common Class 11 adjustments ---------------- */
scenario("outstanding and prepaid expenses reach FA correctly", () => {
  const r = run("Started business with cash ₹1,00,000.\nPaid salaries ₹25,000 in cash; ₹5,000 still outstanding.\nPaid insurance ₹12,000 in cash; ₹2,000 prepaid.", 0);
  if (!r.fa.bs.balanced) return "BS " + r.fa.bs.totalAssets + " vs " + r.fa.bs.totalLiabilities;
  if (!r.fa.pl.dr.some(x => x.label === "Salary" && near(x.amount, 30000))) return "salary in P&L: " + JSON.stringify(r.fa.pl.dr);
  if (!r.fa.pl.dr.some(x => /Insurance/i.test(x.label) && near(x.amount, 10000))) return "insurance in P&L: " + JSON.stringify(r.fa.pl.dr);
  if (!r.fa.bs.liabilities.some(x => /Outstanding Salary/i.test(x.label) && near(x.amount, 5000))) return "no outstanding salary liability";
  if (!r.fa.bs.assets.some(x => /Prepaid Insurance/i.test(x.label) && near(x.amount, 2000))) return "no prepaid asset: " + JSON.stringify(r.fa.bs.assets.map(a => a.label));
  return null;
});

scenario("abnormal loss: insurance claim + remaining loss hits P&L", () => {
  const r = run("Started business with cash ₹2,00,000 and goods ₹80,000.\nGoods costing ₹20,000 were destroyed by fire; insurance claim admitted ₹15,000.", 0);
  if (!r.fa.bs.balanced) return "BS " + r.fa.bs.totalAssets + " vs " + r.fa.bs.totalLiabilities;
  const lossRows = r.fa.pl.dr.filter(x => /Loss|fire/i.test(x.label));
  if (!lossRows.length) return "no loss row in P&L: " + JSON.stringify(r.fa.pl.dr);
  if (!near(lossRows[0].amount, 5000)) return "net loss should be 5,000, got " + lossRows[0].amount;
  return null;
});

scenario("bad debts then provision on the remaining debtors", () => {
  const r = run("Cash ₹50,000; Debtors ₹1,00,000; Stock ₹30,000; Capital ₹1,80,000\nBad debts ₹6,000.\nCreate provision for doubtful debts at 5% of remaining debtors.", 0);
  if (!r.fa.bs.balanced) return "BS " + r.fa.bs.totalAssets + " vs " + r.fa.bs.totalLiabilities;
  const bd = r.fa.pl.dr.find(x => /Bad Debts/i.test(x.label));
  const pr = r.fa.pl.dr.find(x => /Provision for Doubtful/i.test(x.label));
  if (!bd || !near(bd.amount, 6000)) return "bad debts: " + JSON.stringify(r.fa.pl.dr.map(x => x.label + "=" + x.amount));
  if (!pr || !near(pr.amount, 4700)) return "provision should be 5% of 94,000 = 4,700, got " + (pr && pr.amount);
  return null;
});

scenario("interest on capital is an expense that is added back to capital", () => {
  const r = run("Started business with cash ₹1,00,000.\nCharge interest on capital @10% p.a. for the year.", 0);
  if (!r.fa.bs.balanced) return "BS " + r.fa.bs.totalAssets + " vs " + r.fa.bs.totalLiabilities;
  if (!r.fa.pl.dr.some(x => /Interest on Capital/i.test(x.label) && near(x.amount, 10000))) return "IOC not charged to P&L: " + JSON.stringify(r.fa.pl.dr.map(x => x.label + "=" + x.amount));
  // capital 1,00,000 + IOC 10,000 − the 10,000 P&L charge = 1,00,000 closing
  if (!near(r.fa.capitalBreakdown.closing, 100000)) return "closing capital " + JSON.stringify(r.fa.capitalBreakdown);
  return null;
});

scenario("interest on drawings uses the recorded drawings balance", () => {
  const r = run("Started business with cash ₹1,00,000.\nWithdrew cash for personal use ₹40,000.\nCharge interest on drawings @5% p.a. for the year.", 0);
  if (!r.fa.bs.balanced) return "BS " + r.fa.bs.totalAssets + " vs " + r.fa.bs.totalLiabilities;
  if (!r.fa.pl.cr.some(x => /Interest on Drawings/i.test(x.label) && near(x.amount, 2000))) return "IOD missing: " + JSON.stringify(r.fa.pl.cr.map(x => x.label + "=" + x.amount));
  return null;
});

/* ---------------- ambiguity ---------------- */
scenario("a transaction with two plausible readings is not silently guessed", () => {
  const r = one("Paid ₹5,000.", {});
  if (r.status === "VALID") return "accepted with no account named: " + F(r);
  if (!r.reason) return "no reason given";
  return null;
});

/* ---------------- runner ---------------- */
console.log("Accounting Cycle independent probe — " + S.length + " scenarios\n");
for (const s of S) {
  let err = null;
  try { err = s.fn(); } catch (e) { err = "THREW: " + (e.stack || e.message).split("\n").slice(0, 3).join(" | "); }
  n++;
  if (err) { bad++; console.log("FAIL  " + s.name + "\n        - " + err); }
  else if (!QUIET) console.log("ok    " + s.name);
}
console.log("\nprobe: " + (n - bad) + "/" + n + " scenarios clean");
process.exitCode = bad ? 1 : 0;
