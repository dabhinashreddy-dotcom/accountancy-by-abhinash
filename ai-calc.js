/* ============================================================
   AI TUTOR — DETERMINISTIC CALCULATION ENGINE  (ai-calc.js)
   ------------------------------------------------------------
   Pure functions, no DOM, no network, no eval(). Works in the
   browser (window.AICalc) and in Node / Netlify Functions
   (require("./ai-calc.js")).

   WHY THIS FILE EXISTS
   The language model is good at *understanding* a problem but
   not guaranteed to be good at arithmetic. So the AI Tutor's
   pipeline is:

     model understands the problem  ->  structured inputs
     -> THIS FILE does the arithmetic  ->  model explains it

   Every function returns { ..., steps: [...], assumptions: [...] }
   so the same result can be shown to a student, handed back to
   the model as a tool result, or used to validate a stored /
   generated answer.

   Money is kept to 2 decimals using integer-paise rounding.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.AICalc = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- number helpers ---------- */
  function r2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
  function isNum(n) { return typeof n === "number" && isFinite(n); }
  function inr(n) {
    if (!isNum(n)) return "—";
    const v = r2(n);
    const neg = v < 0;
    const s = Math.abs(v).toLocaleString("en-IN", Number.isInteger(v) ? {} : { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (neg ? "−" : "") + "₹" + s;
  }
  // "₹1,20,000" / "Rs. 5,000" / "12%" / "1.5" -> number (null when not a number)
  function parseNumber(x) {
    if (isNum(x)) return x;
    if (typeof x !== "string") return null;
    const m = /(-|−)?\s*(?:₹|rs\.?|inr)?\s*([\d][\d,]*(?:\.\d+)?)/i.exec(x.trim());
    if (!m) return null;
    const v = parseFloat(m[2].replace(/,/g, ""));
    return (m[1] ? -1 : 1) * v;
  }
  function need(obj, keys, fn) {
    const missing = keys.filter(k => !isNum(obj[k]));
    if (missing.length) { const e = new Error(fn + ": missing or invalid " + missing.join(", ")); e.missing = missing; throw e; }
  }

  /* ---------- safe arithmetic expression evaluator ----------
     Recursive descent. Supports: + - * / ^, × ÷ x, parentheses,
     ₹ and thousands commas, "%" (postfix), and "A% of B".
     Accounting-style percent: "50000 + 18%" means 50000 + 18% of 50000. */
  function evaluate(input) {
    if (typeof input !== "string" || !input.trim()) throw new Error("Empty expression");
    if (input.length > 300) throw new Error("Expression too long");
    let s = input
      .replace(/₹|rs\.?|inr/gi, " ")
      .replace(/(\d),(?=\d{2,3}\b)/g, "$1")
      .replace(/×|✕|\*/g, "*").replace(/÷/g, "/").replace(/−|–/g, "-")
      .replace(/(\d)\s*x\s*(?=[\d(])/gi, "$1*")
      .replace(/(\d+(?:\.\d+)?)\s*%\s*of\s*/gi, "($1/100)*")
      .replace(/\s+/g, "");
    if (!/^[0-9+\-*/^().%]+$/.test(s)) throw new Error("Unsupported characters in expression");
    let i = 0;
    function peek() { return s[i]; }
    function number() {
      const m = /^\d*\.?\d+/.exec(s.slice(i));
      if (!m) throw new Error("Number expected");
      i += m[0].length;
      let v = parseFloat(m[0]);
      if (peek() === "%") { i++; return { v: v / 100, pct: true }; }
      return { v, pct: false };
    }
    function primary() {
      if (peek() === "(") {
        i++; const r = additive();
        if (peek() !== ")") throw new Error("Missing )");
        i++;
        if (peek() === "%") { i++; return { v: r.v / 100, pct: true }; }
        return r;
      }
      if (peek() === "-") { i++; const r = primary(); return { v: -r.v, pct: r.pct }; }
      if (peek() === "+") { i++; return primary(); }
      return number();
    }
    function power() {
      let base = primary();
      if (peek() === "^") { i++; const ex = power(); return { v: Math.pow(base.v, ex.v), pct: false }; }
      return base;
    }
    function multiplicative() {
      let left = power();
      while (peek() === "*" || peek() === "/") {
        const op = s[i++]; const right = power();
        if (op === "*") left = { v: left.v * right.v, pct: false };
        else { if (right.v === 0) throw new Error("Division by zero"); left = { v: left.v / right.v, pct: false }; }
      }
      return left;
    }
    function additive() {
      let left = multiplicative();
      while (peek() === "+" || peek() === "-") {
        const op = s[i++]; const right = multiplicative();
        const rv = right.pct ? left.v * right.v : right.v; // accounting-style percent
        left = { v: op === "+" ? left.v + rv : left.v - rv, pct: false };
      }
      return left;
    }
    const out = additive();
    if (i !== s.length) throw new Error("Unexpected '" + s[i] + "'");
    if (!isFinite(out.v)) throw new Error("Result is not a finite number");
    return r2(out.v);
  }

  /* ---------- percentages / discount ---------- */
  function percentOf(base, pct) {
    need({ base, pct }, ["base", "pct"], "percentOf");
    const v = r2(base * pct / 100);
    return { value: v, steps: [`${pct}% of ${inr(base)} = ${inr(base)} × ${pct}/100 = ${inr(v)}`], assumptions: [] };
  }
  function discount({ listPrice, discountPct, discountAmt }) {
    need({ listPrice }, ["listPrice"], "discount");
    const d = isNum(discountAmt) ? r2(discountAmt) : r2(listPrice * (discountPct || 0) / 100);
    const net = r2(listPrice - d);
    return { discount: d, net, steps: [
      isNum(discountAmt) ? `Discount = ${inr(d)}` : `Discount = ${inr(listPrice)} × ${discountPct}/100 = ${inr(d)}`,
      `Net amount = ${inr(listPrice)} − ${inr(d)} = ${inr(net)}`
    ], assumptions: [] };
  }

  /* ---------- GST invoice ----------
     Mirrors the site's GST Bill Detective convention:
       taxable = list price − trade discount (+ freight, only if freight is subject to GST)
       GST     = taxable × rate
       invoice = taxable + GST (+ freight, if freight is NOT subject to GST)
     Cash discount (if given) is NOT deducted before GST (it is allowed after the invoice). */
  function gst(o) {
    const assumptions = [];
    const steps = [];
    const rate = o.ratePct;
    need({ rate }, ["rate"], "gst");
    let listPrice = o.listPrice;
    let tradeDiscount = 0;
    let freight = isNum(o.freight) ? o.freight : 0;
    const freightTaxable = o.freightTaxable !== false; // default: freight on the same invoice is taxable
    if (isNum(o.freight) && o.freightTaxable === undefined) assumptions.push("Freight/cartage is treated as part of the taxable value (it is billed together with the goods).");
    let taxable, afterTD;

    if (o.inclusive && isNum(o.totalInclusive)) {
      // GST-inclusive total -> back-calculate
      const total = o.totalInclusive;
      taxable = r2(total / (1 + rate / 100));
      const g = r2(total - taxable);
      steps.push(`Invoice value (GST included) = ${inr(total)}`,
        `Taxable value = ${inr(total)} × 100/${100 + rate} = ${inr(taxable)}`,
        `GST = ${inr(total)} − ${inr(taxable)} = ${inr(g)}`);
      assumptions.push(`The given amount already includes ${rate}% GST.`);
      return finishGst({ taxable, rate, inter: !!o.interState, steps, assumptions, listPrice: null, tradeDiscount: 0, freight: 0, freightTaxable: true, invoiceOverride: total });
    }

    need({ listPrice }, ["listPrice"], "gst");
    steps.push(`List price = ${inr(listPrice)}`);
    if (isNum(o.tradeDiscountAmt) || isNum(o.tradeDiscountPct)) {
      tradeDiscount = isNum(o.tradeDiscountAmt) ? r2(o.tradeDiscountAmt) : r2(listPrice * o.tradeDiscountPct / 100);
      steps.push(isNum(o.tradeDiscountAmt) ? `Trade discount = ${inr(tradeDiscount)}` : `Trade discount (${o.tradeDiscountPct}%) = ${inr(listPrice)} × ${o.tradeDiscountPct}/100 = ${inr(tradeDiscount)}`);
    }
    afterTD = r2(listPrice - tradeDiscount);
    steps.push(tradeDiscount ? `Taxable value = ${inr(listPrice)} − ${inr(tradeDiscount)} = ${inr(afterTD)}` : `Taxable value = ${inr(afterTD)} (no trade discount)`);
    taxable = afterTD;
    if (freight && freightTaxable) {
      taxable = r2(afterTD + freight);
      steps.push(`Freight ${inr(freight)} is subject to GST, so Taxable value = ${inr(afterTD)} + ${inr(freight)} = ${inr(taxable)}`);
    }
    return finishGst({ taxable, rate, inter: !!o.interState, steps, assumptions, listPrice, tradeDiscount, freight, freightTaxable });
  }
  function finishGst(c) {
    const { taxable, rate, inter, steps, assumptions } = c;
    const gstTotal = r2(taxable * rate / 100);
    steps.push(`GST = ${inr(taxable)} × ${rate}/100 = ${inr(gstTotal)}`);
    let cgst = 0, sgst = 0, igst = 0;
    if (inter) { igst = gstTotal; steps.push(`Inter-state sale → IGST = ${inr(igst)}`); }
    else {
      cgst = r2(gstTotal / 2); sgst = r2(gstTotal - cgst);
      steps.push(`Intra-state sale → CGST = SGST = ${inr(gstTotal)} ÷ 2 = ${inr(cgst)} each`);
    }
    let invoice = r2(taxable + gstTotal);
    if (c.freight && c.freightTaxable === false) {
      invoice = r2(invoice + c.freight);
      steps.push(`Freight ${inr(c.freight)} is NOT subject to GST, so it is added after GST.`);
    }
    if (isNum(c.invoiceOverride)) invoice = r2(c.invoiceOverride);
    steps.push(`Invoice value = ${inr(taxable)} + ${inr(gstTotal)}${c.freight && c.freightTaxable === false ? " + " + inr(c.freight) : ""} = ${inr(invoice)}`);
    if (!inter) assumptions.push("Sale treated as intra-state (CGST + SGST). Use IGST if the buyer is in another state.");
    return { listPrice: c.listPrice, tradeDiscount: c.tradeDiscount, taxable, ratePct: rate, gstTotal, cgst, sgst, igst, freight: c.freight, invoice, steps, assumptions };
  }
  // Parse the site's own GST Bill Detective `billText` ({goods, discount, gstRate, freight}).
  // Handles "₹20,000", "40 units @ ₹250 = ₹10,000", "18% (inter-state: IGST)", "₹500 (no GST)".
  function gstFromBillText(b) {
    const goodsStr = String(b.goods || "");
    const eq = goodsStr.split("=");
    const listPrice = parseNumber(eq.length > 1 ? eq[eq.length - 1] : goodsStr);
    const discStr = String(b.discount || "None");
    const tradeDiscountPct = /%/.test(discStr) ? parseNumber(discStr) : undefined;
    const tradeDiscountAmt = !/%/.test(discStr) && /\d/.test(discStr) ? parseNumber(discStr) : undefined;
    const rateStr = String(b.gstRate || "");
    const ratePct = parseNumber(rateStr);
    const interState = /inter-?state|igst/i.test(rateStr);
    const frStr = String(b.freight || "None");
    const hasFreight = /\d/.test(frStr);
    const freight = hasFreight ? parseNumber(frStr) : 0;
    const freightTaxable = hasFreight ? !/no gst|not subject|exempt/i.test(frStr) : true;
    return gst({ listPrice, tradeDiscountPct, tradeDiscountAmt, ratePct, freight, freightTaxable, interState });
  }

  /* ---------- depreciation ---------- */
  function depreciation(o) {
    const method = String(o.method || "SLM").toUpperCase().startsWith("W") ? "WDV" : "SLM";
    need(o, ["cost"], "depreciation");
    const residual = isNum(o.residual) ? o.residual : 0;
    const years = isNum(o.years) ? Math.max(1, Math.floor(o.years)) : 1;
    const months = isNum(o.monthsFirstYear) ? o.monthsFirstYear : 12;
    const assumptions = [];
    let rate = o.ratePct;
    if (!isNum(rate) && isNum(o.lifeYears) && method === "SLM") {
      // SLM charges (cost − residual) × rate; a life of n years means the rate is 100/n % of that depreciable amount.
      rate = 100 / o.lifeYears;
      assumptions.push(`With a life of ${o.lifeYears} years, the straight-line charge each year = (${inr(o.cost)} − ${inr(residual)}) ÷ ${o.lifeYears}.`);
    }
    need({ rate }, ["rate"], "depreciation");
    const rows = []; const steps = [];
    let opening = o.cost;
    for (let y = 1; y <= years; y++) {
      const frac = y === 1 ? months / 12 : 1;
      let dep = method === "SLM" ? (o.cost - residual) * rate / 100 * frac : opening * rate / 100 * frac;
      dep = r2(dep);
      if (method === "WDV" && opening - dep < residual) dep = r2(Math.max(0, opening - residual));
      const closing = r2(opening - dep);
      rows.push({ year: y, opening: r2(opening), depreciation: dep, closing });
      steps.push(method === "SLM"
        ? `Year ${y}: (${inr(o.cost)} − ${inr(residual)}) × ${rate}/100${frac !== 1 ? " × " + months + "/12" : ""} = ${inr(dep)}; book value = ${inr(closing)}`
        : `Year ${y}: ${inr(opening)} × ${rate}/100${frac !== 1 ? " × " + months + "/12" : ""} = ${inr(dep)}; book value = ${inr(closing)}`);
      opening = closing;
    }
    if (months !== 12) assumptions.push(`Year 1 charged for ${months} months (${months}/12 of a full year).`);
    return { method, ratePct: r2(rate), rows, totalDepreciation: r2(rows.reduce((a, r) => a + r.depreciation, 0)), finalBookValue: rows[rows.length - 1].closing, steps, assumptions };
  }
  // Profit/loss on sale of an asset
  function assetSale({ bookValue, salePrice }) {
    need({ bookValue, salePrice }, ["bookValue", "salePrice"], "assetSale");
    const diff = r2(salePrice - bookValue);
    return { result: diff === 0 ? "No profit, no loss" : diff > 0 ? "Profit on sale" : "Loss on sale", amount: Math.abs(diff),
      steps: [`Sale price ${inr(salePrice)} − Book value ${inr(bookValue)} = ${inr(diff)} → ${diff > 0 ? "profit" : diff < 0 ? "loss" : "nil"}`], assumptions: [] };
  }

  /* ---------- accounting equation ---------- */
  function equation(o) {
    const have = ["assets", "liabilities", "capital"].filter(k => isNum(o[k]));
    if (have.length < 2) throw new Error("equation: need any two of assets, liabilities, capital");
    const out = { assets: o.assets, liabilities: o.liabilities, capital: o.capital };
    const steps = [];
    if (!isNum(o.assets)) { out.assets = r2(o.liabilities + o.capital); steps.push(`Assets = Liabilities + Capital = ${inr(o.liabilities)} + ${inr(o.capital)} = ${inr(out.assets)}`); }
    else if (!isNum(o.liabilities)) { out.liabilities = r2(o.assets - o.capital); steps.push(`Liabilities = Assets − Capital = ${inr(o.assets)} − ${inr(o.capital)} = ${inr(out.liabilities)}`); }
    else if (!isNum(o.capital)) { out.capital = r2(o.assets - o.liabilities); steps.push(`Capital = Assets − Liabilities = ${inr(o.assets)} − ${inr(o.liabilities)} = ${inr(out.capital)}`); }
    else {
      const ok = r2(o.assets) === r2(o.liabilities + o.capital);
      steps.push(`Check: ${inr(o.liabilities)} + ${inr(o.capital)} = ${inr(o.liabilities + o.capital)}; Assets = ${inr(o.assets)} → ${ok ? "equation holds" : "equation does NOT hold (difference " + inr(o.assets - o.liabilities - o.capital) + ")"}`);
      out.holds = ok;
    }
    return Object.assign(out, { steps, assumptions: [] });
  }
  // Closing capital: opening + profit + additional capital − loss − drawings
  function closingCapital({ opening = 0, additional = 0, profit = 0, loss = 0, drawings = 0 }) {
    const v = r2(opening + additional + profit - loss - drawings);
    return { closingCapital: v, steps: [`Closing capital = ${inr(opening)} + ${inr(additional)} + ${inr(profit)} − ${inr(loss)} − ${inr(drawings)} = ${inr(v)}`], assumptions: [] };
  }

  /* ---------- trial balance ---------- */
  function trialBalance(rows) {
    if (!Array.isArray(rows) || !rows.length) throw new Error("trialBalance: rows required");
    let dr = 0, cr = 0;
    rows.forEach(r => { need(r, ["amount"], "trialBalance row"); const side = String(r.side || "").toLowerCase(); if (side.startsWith("d")) dr += r.amount; else if (side.startsWith("c")) cr += r.amount; else throw new Error("trialBalance: side must be Dr or Cr for " + r.name); });
    dr = r2(dr); cr = r2(cr); const diff = r2(dr - cr);
    return { debitTotal: dr, creditTotal: cr, difference: diff, agrees: diff === 0,
      steps: [`Total Debit = ${inr(dr)}`, `Total Credit = ${inr(cr)}`, diff === 0 ? "Both columns agree → Trial Balance tallies." : `Difference = ${inr(Math.abs(diff))} (${diff > 0 ? "Debit" : "Credit"} side is higher)`], assumptions: [] };
  }

  /* ---------- ledger account balancing ---------- */
  function ledgerBalance({ debits = [], credits = [], opening = 0, openingSide = "Dr" }) {
    let dr = debits.reduce((a, b) => a + b, 0), cr = credits.reduce((a, b) => a + b, 0);
    if (opening) { if (/^d/i.test(openingSide)) dr += opening; else cr += opening; }
    dr = r2(dr); cr = r2(cr);
    const bal = r2(Math.abs(dr - cr));
    const side = dr === cr ? "Nil" : dr > cr ? "Debit" : "Credit";
    const total = r2(Math.max(dr, cr));
    return { debitTotal: dr, creditTotal: cr, balance: bal, balanceSide: side, grandTotal: total,
      steps: [`Debit side total = ${inr(dr)}`, `Credit side total = ${inr(cr)}`,
        side === "Nil" ? "Both sides are equal — the account is closed (nil balance)." : `Balance = ${inr(bal)} ${side} → written as "${side === "Debit" ? "By" : "To"} Balance c/d" on the ${side === "Debit" ? "credit" : "debit"} side so both sides total ${inr(total)}; then brought down as "${side === "Debit" ? "To" : "By"} Balance b/d" on the ${side.toLowerCase()} side.`], assumptions: [] };
  }

  /* ---------- Bank Reconciliation Statement ----------
     Effects are defined from CASH BOOK -> PASS BOOK. Starting from the
     PASS BOOK reverses every Add/Less. An overdraft does NOT change the
     Add/Less direction (it only changes how the balance is labelled),
     which matches the site's BRS Detective rules. */
  const BRS_RULES = [
    // [regex on (cleaned) label, effect from Cash Book -> Pass Book, group]
    // --- timing differences ---
    [/not (yet )?(been )?presented|issued.*not.*present|unpresented/i, "Add", "Timing difference"],
    [/not (yet )?(been )?(collected|credited|cleared)|deposited.*not.*(collect|credit|clear)|uncollected/i, "Less", "Timing difference"],
    // --- bank entries not yet in the Cash Book ---
    [/dishonou?r/i, "Less", "Bank entry"],
    [/interest (charged|debited)|bank'?s? (charge|commission)|charges? (debited|charged)|commission charged|bill-collection charges|bank charges/i, "Less", "Bank entry"],
    [/interest (credited|collected)|dividend|direct (deposit|collection|credit)|bill collected|investment proceeds|other direct bank credit|collected by bank/i, "Add", "Bank entry"],
    [/direct (payment|debit)|paid directly|standing instruction|locker rent|other direct bank debit|premium paid/i, "Less", "Bank entry"],
    // --- Cash Book errors (wording is unambiguous) ---
    [/cheque issued.*omitted|payment.*omitted/i, "Less", "Cash Book error"],
    [/cheque issued.*(entered|recorded) twice|cheque issued.*twice/i, "Add", "Cash Book error"],
    [/cheque deposit(ed)?.*omitted|receipt.*omitted|bank transaction \(receipt\).*omitted/i, "Add", "Cash Book error"],
    [/cheque deposit(ed)?.*(recorded|entered)? ?short/i, "Add", "Cash Book error"],
    [/cheque issued.*(recorded|entered)? ?short/i, "Less", "Cash Book error"],
    [/receipts side (is )?overcast|payments side (is )?undercast/i, "Less", "Cash Book error"],
    [/receipts side (is )?undercast|payments side (is )?overcast/i, "Add", "Cash Book error"],
    [/receipt wrongly entered on the payments side|deposit recorded as a withdrawal/i, "Add", "Cash Book error"],
    [/payment wrongly entered on the receipts side|withdrawal recorded as a deposit/i, "Less", "Cash Book error"],
    // --- bank errors ---
    [/bank (wrongly )?debited (the account|an excess)|bank wrongly debited/i, "Less", "Bank error"],
    [/bank (wrongly )?credited (the account|an excess)|bank wrongly credited/i, "Add", "Bank error"],
    [/bank entered another customer'?s? transaction/i, "Less", "Bank error"],
    [/bank omitted a transaction/i, "Add", "Bank error"]
  ];
  function brsClassify(label) {
    // Ignore parentheticals such as "(overdraft, Pass Book start)" or "(Cash Book error)".
    const clean = String(label || "").replace(/\s*\([^)]*\)/g, "").trim() || String(label || "");
    for (const [re, effect, group] of BRS_RULES) if (re.test(clean)) return { effect, group };
    return null; // genuinely needs reading of the wording (e.g. wrong closing balance, wrong carry-forward)
  }
  function brsEffect(effectFromCashBook, startingPoint) {
    const flip = /^p/i.test(startingPoint || "");
    if (!flip) return effectFromCashBook;
    return effectFromCashBook === "Add" ? "Less" : "Add";
  }
  function brsSolve({ startingPoint = "Cash Book", startingBalance, items = [] }) {
    need({ startingBalance }, ["startingBalance"], "brsSolve");
    const from = /^p/i.test(startingPoint) ? "Pass Book" : "Cash Book";
    const target = from === "Cash Book" ? "Pass Book" : "Cash Book";
    let bal = startingBalance;
    const steps = [`Balance as per ${from} = ${fmtBal(startingBalance)}`];
    items.forEach(it => {
      need(it, ["amount"], "brs item");
      const eff = /^a/i.test(it.effect) ? "Add" : "Less";
      bal = eff === "Add" ? bal + it.amount : bal - it.amount;
      steps.push(`${eff === "Add" ? "+" : "−"} ${inr(it.amount)}  (${it.label || "item"})`);
    });
    bal = r2(bal);
    steps.push(`Balance as per ${target} = ${fmtBal(bal)}`);
    return { from, target, finalBalance: bal, steps, assumptions: ["Negative figures mean an overdraft (credit balance as per Cash Book / debit balance as per Pass Book)."] };
  }
  function fmtBal(n) { return n < 0 ? `${inr(Math.abs(n))} (Overdraft)` : inr(n); }

  /* ---------- provisions, outstanding/prepaid, interest, commission ---------- */
  function provisionDoubtful({ debtors, badDebts = 0, provisionPct, openingProvision = 0, discountPct = 0 }) {
    need({ debtors, provisionPct }, ["debtors", "provisionPct"], "provisionDoubtful");
    const afterBad = r2(debtors - badDebts);
    const steps = [`Debtors after bad debts = ${inr(debtors)} − ${inr(badDebts)} = ${inr(afterBad)}`];
    const newProv = r2(afterBad * provisionPct / 100);
    steps.push(`Provision required (${provisionPct}%) = ${inr(afterBad)} × ${provisionPct}/100 = ${inr(newProv)}`);
    steps.push(`Opening provision = ${inr(openingProvision)}`);
    const charge = r2(newProv - openingProvision);
    steps.push(charge >= 0 ? `Charge to Profit & Loss = ${inr(newProv)} − ${inr(openingProvision)} = ${inr(charge)}` : `Reversal credited to Profit & Loss = ${inr(openingProvision)} − ${inr(newProv)} = ${inr(-charge)}`);
    return { debtorsAfterBadDebts: afterBad, newProvision: newProv, chargeToPL: charge, steps, assumptions: ["Provision is calculated on debtors remaining after writing off bad debts."] };
  }
  function outstandingPrepaid({ annualOrPeriodAmount, monthsTotal = 12, monthsCovered, paid }) {
    const perMonth = annualOrPeriodAmount / monthsTotal;
    const steps = [];
    if (isNum(paid)) {
      const expense = r2(perMonth * monthsCovered);
      const diff = r2(paid - expense);
      steps.push(`Expense for the period = ${inr(perMonth)} × ${monthsCovered} = ${inr(expense)}`);
      steps.push(diff > 0 ? `Prepaid = Paid ${inr(paid)} − Expense ${inr(expense)} = ${inr(diff)}` : diff < 0 ? `Outstanding = Expense ${inr(expense)} − Paid ${inr(paid)} = ${inr(-diff)}` : "Nothing outstanding or prepaid.");
      return { expense, prepaid: diff > 0 ? diff : 0, outstanding: diff < 0 ? -diff : 0, steps, assumptions: [] };
    }
    const amt = r2(perMonth * monthsCovered);
    steps.push(`${inr(perMonth)} per month × ${monthsCovered} months = ${inr(amt)}`);
    return { amount: amt, steps, assumptions: [] };
  }
  function interestOnCapital({ capital, ratePct, months = 12 }) {
    need({ capital, ratePct }, ["capital", "ratePct"], "interestOnCapital");
    const v = r2(capital * ratePct / 100 * months / 12);
    return { interest: v, steps: [`Interest on capital = ${inr(capital)} × ${ratePct}/100 × ${months}/12 = ${inr(v)}`], assumptions: [] };
  }
  function interestOnDrawings({ drawings, ratePct, months }) {
    need({ drawings, ratePct, months }, ["drawings", "ratePct", "months"], "interestOnDrawings");
    const v = r2(drawings * ratePct / 100 * months / 12);
    return { interest: v, steps: [`Interest on drawings = ${inr(drawings)} × ${ratePct}/100 × ${months}/12 = ${inr(v)}`], assumptions: [] };
  }
  function commission({ netProfit, ratePct, basis = "before" }) {
    need({ netProfit, ratePct }, ["netProfit", "ratePct"], "commission");
    const before = String(basis).startsWith("b");
    const v = before ? r2(netProfit * ratePct / 100) : r2(netProfit * ratePct / (100 + ratePct));
    return { commission: v, steps: [before ? `Commission = ${inr(netProfit)} × ${ratePct}/100 = ${inr(v)} (on profit BEFORE charging commission)` : `Commission = ${inr(netProfit)} × ${ratePct}/(100 + ${ratePct}) = ${inr(v)} (on profit AFTER charging commission)`], assumptions: [] };
  }

  /* ---------- final accounts: trading + profit & loss ---------- */
  // Cost of goods sold, gross profit and net profit from the usual
  // final-accounts figures. Every figure the student gives is used, so the
  // result can be shown as a Trading + P&L account and independently checked.
  function tradingResults(i) {
    i = i || {};
    const os = Number(i.openingStock) || 0, pur = Number(i.purchases) || 0, purRet = Number(i.purchaseReturns) || 0;
    const de = Number(i.directExpenses) || 0, cs = Number(i.closingStock) || 0;
    const netPur = r2(pur - purRet);
    const cogs = r2(os + netPur + de - cs);
    const sal = Number(i.sales) || 0, salRet = Number(i.salesReturns) || 0;
    const netSal = r2(sal - salRet);
    const gp = r2(netSal - cogs);
    const indExp = Number(i.indirectExpenses) || 0, indInc = Number(i.indirectIncomes) || 0;
    const np = r2(gp + indInc - indExp);
    const steps = [
      `Net purchases = Purchases ${inr(pur)} − Purchase returns ${inr(purRet)} = ${inr(netPur)}`,
      `Cost of Goods Sold = Opening stock ${inr(os)} + Net purchases ${inr(netPur)} + Direct expenses ${inr(de)} − Closing stock ${inr(cs)} = ${inr(cogs)}`,
      `Net sales = Sales ${inr(sal)} − Sales returns ${inr(salRet)} = ${inr(netSal)}`,
      `Gross profit = Net sales ${inr(netSal)} − COGS ${inr(cogs)} = ${inr(gp)}`,
      `Net profit = Gross profit ${inr(gp)} + Indirect incomes ${inr(indInc)} − Indirect expenses ${inr(indExp)} = ${inr(np)}`
    ];
    return { openingStock: r2(os), netPurchases: netPur, directExpenses: r2(de), closingStock: r2(cs), cogs,
      netSales: netSal, grossProfit: gp, indirectExpenses: r2(indExp), indirectIncomes: r2(indInc), netProfit: np,
      steps, assumptions: [] };
  }

  /* ---------- journal-entry validation ---------- */
  function journalBalanced(lines) {
    let dr = 0, cr = 0;
    (lines || []).forEach(l => { dr += Number(l.dr) || 0; cr += Number(l.cr) || 0; });
    return { debit: r2(dr), credit: r2(cr), balanced: r2(dr) === r2(cr) && dr > 0 };
  }
  // Pull ₹ figures out of a markdown table / text and check any journal-looking table balances.
  function checkMarkdownJournal(md) {
    const issues = [];
    const tables = String(md || "").split(/\n\s*\n/).filter(b => /\|/.test(b) && /dr/i.test(b) && /cr/i.test(b));
    tables.forEach(t => {
      const rows = t.split("\n").map(l => l.trim()).filter(l => l.startsWith("|"));
      if (rows.length < 3) return;
      const head = rows[0].split("|").map(c => c.trim().toLowerCase()).filter((c, i, a) => !(i === 0 && c === "") && !(i === a.length - 1 && c === ""));
      const di = head.findIndex(c => /^dr/.test(c) || /debit/.test(c));
      const ci = head.findIndex(c => /^cr/.test(c) || /credit/.test(c));
      if (di < 0 || ci < 0) return;
      let dr = 0, cr = 0, hasTotal = false;
      rows.slice(2).forEach(r => {
        const cells = r.split("|").map(c => c.trim()).filter((c, i, a) => !(i === 0 && c === "") && !(i === a.length - 1 && c === ""));
        if (/^\**\s*total/i.test(cells[0] || "")) { hasTotal = true; return; }
        dr += parseNumber(cells[di]) || 0; cr += parseNumber(cells[ci]) || 0;
      });
      if (!hasTotal && r2(dr) !== r2(cr)) issues.push(`Journal table: total Dr ${inr(dr)} ≠ total Cr ${inr(cr)}`);
    });
    return issues;
  }

  /* ---------- account classification (vocabulary layer) ---------- */
  const ACCOUNT_RULES = [
    [/\b(cash|bank|furniture|machinery|plant|building|land|vehicle|motor|computer|equipment|stock|inventory|goods in hand|debtors?|bills? receivable|investments?|prepaid|accrued income|advance to|loose tools|patents?|trade ?marks?|goodwill|fixed deposit|leasehold)\b/i, { type: "Real / Personal", nature: "Asset", normal: "Debit" }],
    [/\b(creditors?|bills? payable|loan|outstanding|income received in advance|advance from|unearned|overdraft|mortgage|provision for)\b/i, { type: "Personal", nature: "Liability", normal: "Credit" }],
    [/\b(capital)\b/i, { type: "Personal", nature: "Capital (owner's equity)", normal: "Credit" }],
    [/\b(drawings?)\b/i, { type: "Personal", nature: "Reduces capital", normal: "Debit" }],
    [/\b(sales?|income|interest received|interest earned|commission received|discount received|rent received|dividend|bad debts recovered|revenue|gain|profit on)\b/i, { type: "Nominal", nature: "Income / Gain", normal: "Credit" }],
    [/\b(purchases?|salary|salaries|wages?|rent|rates|insurance|interest paid|commission paid|discount allowed|bad debts?|depreciation|carriage|freight|cartage|repairs?|printing|stationery|advertis|telephone|electricity|loss|expenses?|postage|travelling|audit|bank charges)\b/i, { type: "Nominal", nature: "Expense / Loss", normal: "Debit" }]
  ];
  function classifyAccount(name) {
    const n = String(name || "");
    // returns/ discount allowed fix-ups before generic rules
    if (/purchases? return|returns outward/i.test(n)) return { type: "Nominal", nature: "Reduces purchases (contra-expense)", normal: "Credit" };
    if (/sales? return|returns inward/i.test(n)) return { type: "Nominal", nature: "Reduces sales (contra-income)", normal: "Debit" };
    if (/outstanding (expense|salary|rent|wages)|outstanding/i.test(n) && !/income/i.test(n)) return { type: "Personal", nature: "Liability", normal: "Credit" };
    if (/prepaid|accrued income/i.test(n)) return { type: "Personal", nature: "Asset", normal: "Debit" };
    if (/received in advance|advance income|unearned/i.test(n)) return { type: "Personal", nature: "Liability", normal: "Credit" };
    for (const [re, info] of ACCOUNT_RULES) if (re.test(n)) return info;
    return null;
  }

  /* ---------- tool registry (used by the Netlify function as model tools) ---------- */
  const TOOLS = {
    calculate: {
      description: "Evaluate an arithmetic expression exactly (supports + - * / ^, parentheses, % and 'x% of y'). Use this for ANY arithmetic instead of computing in your head.",
      input_schema: { type: "object", properties: { expression: { type: "string", description: "e.g. '50000 * 18%' or '(20000 - 2000) * 18 / 100'" } }, required: ["expression"] },
      run: a => ({ value: evaluate(a.expression), expression: a.expression })
    },
    gst_invoice: {
      description: "Compute a GST invoice: trade discount, taxable value, CGST/SGST or IGST, invoice total. Also back-calculates from a GST-inclusive total.",
      input_schema: { type: "object", properties: {
        listPrice: { type: "number" }, tradeDiscountPct: { type: "number" }, tradeDiscountAmt: { type: "number" },
        freight: { type: "number" }, freightTaxable: { type: "boolean", description: "true if freight is subject to GST (default true)" },
        ratePct: { type: "number" }, interState: { type: "boolean", description: "true => IGST, false => CGST+SGST" },
        inclusive: { type: "boolean" }, totalInclusive: { type: "number", description: "GST-inclusive invoice total (with inclusive=true)" } }, required: ["ratePct"] },
      run: a => gst(a)
    },
    depreciation: {
      description: "Depreciation schedule by SLM (straight line) or WDV (written down value).",
      input_schema: { type: "object", properties: { cost: { type: "number" }, residual: { type: "number" }, ratePct: { type: "number" }, lifeYears: { type: "number" }, years: { type: "number" }, method: { type: "string", enum: ["SLM", "WDV"] }, monthsFirstYear: { type: "number" } }, required: ["cost", "method"] },
      run: a => depreciation(a)
    },
    accounting_equation: {
      description: "Solve Assets = Liabilities + Capital for the missing item, or check that it holds.",
      input_schema: { type: "object", properties: { assets: { type: "number" }, liabilities: { type: "number" }, capital: { type: "number" } } },
      run: a => equation(a)
    },
    trial_balance: {
      description: "Total the debit and credit columns of a trial balance and check whether it agrees.",
      input_schema: { type: "object", properties: { rows: { type: "array", items: { type: "object", properties: { name: { type: "string" }, amount: { type: "number" }, side: { type: "string", enum: ["Dr", "Cr"] } }, required: ["amount", "side"] } } }, required: ["rows"] },
      run: a => trialBalance(a.rows)
    },
    ledger_balance: {
      description: "Total both sides of a ledger account and find the balance c/d and its side.",
      input_schema: { type: "object", properties: { debits: { type: "array", items: { type: "number" } }, credits: { type: "array", items: { type: "number" } }, opening: { type: "number" }, openingSide: { type: "string", enum: ["Dr", "Cr"] } } },
      run: a => ledgerBalance(a)
    },
    bank_reconciliation: {
      description: "Apply Add/Less items to a starting balance to reach the other book's balance. Decide Add/Less from the BRS rules; this tool only does the arithmetic. Negative startingBalance = overdraft.",
      input_schema: { type: "object", properties: { startingPoint: { type: "string", enum: ["Cash Book", "Pass Book"] }, startingBalance: { type: "number" }, items: { type: "array", items: { type: "object", properties: { label: { type: "string" }, effect: { type: "string", enum: ["Add", "Less"] }, amount: { type: "number" } }, required: ["effect", "amount"] } } }, required: ["startingPoint", "startingBalance", "items"] },
      run: a => brsSolve(a)
    },
    provision_doubtful_debts: {
      description: "Provision for doubtful debts after bad debts, and the charge to profit & loss.",
      input_schema: { type: "object", properties: { debtors: { type: "number" }, badDebts: { type: "number" }, provisionPct: { type: "number" }, openingProvision: { type: "number" } }, required: ["debtors", "provisionPct"] },
      run: a => provisionDoubtful(a)
    },
    interest_calc: {
      description: "Interest on capital or drawings (simple interest for a number of months).",
      input_schema: { type: "object", properties: { kind: { type: "string", enum: ["capital", "drawings"] }, amount: { type: "number" }, ratePct: { type: "number" }, months: { type: "number" } }, required: ["kind", "amount", "ratePct"] },
      run: a => a.kind === "drawings" ? interestOnDrawings({ drawings: a.amount, ratePct: a.ratePct, months: a.months || 6 }) : interestOnCapital({ capital: a.amount, ratePct: a.ratePct, months: a.months || 12 })
    },
    trading_results: {
      description: "Final accounts figures: cost of goods sold, net sales, gross profit and net profit from the usual Trading & P&L figures.",
      input_schema: { type: "object", properties: { openingStock: { type: "number" }, purchases: { type: "number" }, purchaseReturns: { type: "number" }, directExpenses: { type: "number" }, closingStock: { type: "number" }, sales: { type: "number" }, salesReturns: { type: "number" }, indirectExpenses: { type: "number" }, indirectIncomes: { type: "number" } } },
      run: a => tradingResults(a)
    }
  };
  function runTool(name, args) {
    const t = TOOLS[name];
    if (!t) return { error: "Unknown tool: " + name };
    try { return t.run(args || {}); } catch (e) { return { error: String(e.message || e) }; }
  }
  function toolSchemas() {
    return Object.keys(TOOLS).map(k => ({ name: k, description: TOOLS[k].description, input_schema: TOOLS[k].input_schema }));
  }

  return {
    r2, inr, parseNumber, evaluate,
    percentOf, discount, gst, gstFromBillText, depreciation, assetSale,
    equation, closingCapital, trialBalance, ledgerBalance,
    brsSolve, brsClassify, brsEffect, BRS_RULES,
    provisionDoubtful, outstandingPrepaid, interestOnCapital, interestOnDrawings, commission, tradingResults,
    journalBalanced, checkMarkdownJournal, classifyAccount,
    TOOLS, runTool, toolSchemas
  };
});
