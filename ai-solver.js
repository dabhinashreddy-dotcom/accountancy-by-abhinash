/* ============================================================
   AI TUTOR — NUMERICAL SOLVER  (ai-solver.js)
   ------------------------------------------------------------
   Turns a student's sentence into a worked, validated solution:

     understand  ->  extract figures WITH THEIR ROLES  ->  calculate (ai-calc.js)
                 ->  validate independently  ->  structured result

   * No language model, no eval(). Same file runs in the browser and in the
     Netlify function (UMD), so offline and online agree on every figure.
   * Results are plain objects (given / steps / table / journal / answer /
     assumptions / checks / inputs) so they can be rendered at any detail level,
     re-run with changed inputs ("what if WDV is used?"), or validated.
   * If something essential is missing the solver answers { needs: "..." }
     (a question to the student) instead of guessing.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ai-calc.js"));
  else root.AISolver = factory(root.AICalc);
})(typeof self !== "undefined" ? self : this, function (Calc) {
  "use strict";
  const inr = Calc.inr, r2 = Calc.r2;

  /* =========================================================
     1. TEXT NORMALISATION + FIGURE EXTRACTION
     ========================================================= */
  const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10 };
  function norm(text) {
    let t = String(text || "");
    t = t.replace(/[–−]/g, "-").replace(/\bRs\.?\s*/gi, "₹").replace(/\bINR\s*/gi, "₹").replace(/₹\s+/g, "₹");
    t = t.replace(/(\d+(?:\.\d+)?)\s*(?:lakhs?|lacs?)\b/gi, (m, n) => String(Math.round(parseFloat(n) * 100000)));
    t = t.replace(/(\d+(?:\.\d+)?)\s*crores?\b/gi, (m, n) => String(Math.round(parseFloat(n) * 10000000)));
    t = t.replace(/(\d+(?:\.\d+)?)\s*(?:thousand|k)\b/gi, (m, n) => String(Math.round(parseFloat(n) * 1000)));
    for (let i = 0; i < 3; i++) t = t.replace(/(\d),(?=\d{2,3}(?!\d))/g, "$1");
    t = t.replace(/per\s*cent|percent|\bp\.?c\.?\b/gi, "%").replace(/(\d)\s+%/g, "$1%");
    t = t.replace(/\bbank (statement|passbook)\b/gi, "pass book").replace(/\bpassbook\b/gi, "pass book");
    t = t.replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\b(?=\s*(?:-|\s)?\s*(?:years?|yrs?|months?|year\b))/gi, (m, w) => String(WORD_NUM[w.toLowerCase()]));
    return t;
  }
  const NUM = "(?:₹\\s*)?(\\d+(?:\\.\\d+)?)";
  function rx(src, flags) { return new RegExp(src.replace(/NUM/g, NUM).replace(/PCT/g, "(\\d+(?:\\.\\d+)?)\\s*%"), flags || "i"); }
  function grab(text, srcs) { for (const s of srcs) { const m = rx(s).exec(text); if (m) return parseFloat(m[1]); } return null; }
  function has(text, re) { return re.test(text); }

  // every figure in the text with what kind it is
  function figures(text) {
    const out = []; const re = /(₹)?\s*(\d+(?:\.\d+)?)(\s*%|\s*(?:years?|yrs?|months?|days?)\b)?/gi; let m;
    while ((m = re.exec(text))) {
      const unit = m[3] ? (/%/.test(m[3]) ? "pct" : /y/i.test(m[3]) ? "year" : /m/i.test(m[3]) ? "month" : "day") : null;
      out.push({ v: parseFloat(m[2]), index: m.index, end: m.index + m[0].length, unit, rupee: !!m[1] });
    }
    return out;
  }
  const moneyFigs = t => figures(t).filter(f => !f.unit);
  // amount tied to a keyword: "freight of ₹500" / "₹500 freight"
  function amountNear(text, kwSrc, o) {
    o = o || {}; const re = new RegExp(kwSrc, "ig"); let m;
    const figs = moneyFigs(text);
    while ((m = re.exec(text))) {
      const aw = o.after != null ? o.after : 40, bw = o.before != null ? o.before : 22;
      const after = figs.find(f => f.index >= m.index + m[0].length && f.index - (m.index + m[0].length) <= aw && !/[.;]\s/.test(text.slice(m.index + m[0].length, f.index)));
      const before = [...figs].reverse().find(f => f.end <= m.index && m.index - f.end <= bw && !/[.;]\s/.test(text.slice(f.end, m.index)));
      if (o.preferBefore && before) return before.v;
      if (after) return after.v;
      if (before) return before.v;
    }
    return null;
  }
  function pctNear(text, kwSrc, o) {
    o = o || {}; const re = new RegExp(kwSrc, "ig"); let m;
    const figs = figures(text).filter(f => f.unit === "pct");
    while ((m = re.exec(text))) {
      const end = m.index + m[0].length;
      const after = figs.find(f => f.index >= end && f.index - end <= (o.after != null ? o.after : 24));
      const before = [...figs].reverse().find(f => f.end <= m.index && m.index - f.end <= (o.before != null ? o.before : 18));
      if (after && before) return (after.index - end) <= (m.index - before.end) ? after.v : before.v;
      if (after) return after.v; if (before) return before.v;
    }
    return null;
  }
  const pcts = t => figures(t).filter(f => f.unit === "pct");
  // Each % belongs to the keyword it sits CLOSEST to ("trade discount 10%; GST at 18%" can never swap the two).
  const PCT_GROUPS = { gst: /(?:\b[csi]?gst\b|\btax\b)/, discount: /(?:discount|rebate)/, dep: /(?:depreciat\w*|per annum|p\.a\.?|\bannum\b)/, interest: /interest/, provision: /(?:provision|doubtful|reserve)/ };
  function pctByGroup(text, group) {
    const figs = figures(text).filter(f => f.unit === "pct"); const found = [];
    for (const f of figs) {
      let best = null, bd = 1e9;
      for (const g of Object.keys(PCT_GROUPS)) {
        const re = new RegExp(PCT_GROUPS[g].source, "ig"); let m;
        while ((m = re.exec(text))) {
          const ks = m.index, ke = m.index + m[0].length;
          let d = ke <= f.index + 1 ? Math.max(0, f.index - ke) : (ks >= f.end - 1 ? (ks - f.end) + 1.5 : 1e9);   // a keyword AFTER the number counts slightly less
          // a connector between the keyword and the number ("18% GST AND 10% discount") means the keyword belongs to the previous item
          if (ke <= f.index + 1 && /\band\b|[,;&]/i.test(text.slice(ke, f.index))) d += 8;
          if (d < bd) { bd = d; best = g; }
        }
      }
      if (best === group && bd <= 32) found.push(f.v);
    }
    return found.length ? found[0] : null;
  }

  /* =========================================================
     2. RESULT HELPERS
     ========================================================= */
  const J = (account, dr, cr, indent) => ({ account, dr: dr == null ? null : r2(dr), cr: cr == null ? null : r2(cr), indent: !!indent });
  function journalTotals(lines) { let d = 0, c = 0; lines.forEach(l => { d += l.dr || 0; c += l.cr || 0; }); return { dr: r2(d), cr: r2(c), balanced: r2(d) === r2(c) && d > 0 }; }
  function result(o) {
    return Object.assign({ ok: true, domain: null, title: "", given: [], required: "", steps: [], table: null, journal: null, narration: "", answer: null, extras: [], assumptions: [], checks: [], inputs: {}, kind: "numerical" }, o);
  }
  function check(r, name, ok) { r.checks.push({ name, ok: !!ok }); if (!ok) r.ok = false; }
  function needs(msg, domain) { return { needs: msg, domain }; }
  function pc(n) { return (Number.isInteger(n) ? n : r2(n)) + "%"; }
  const wants = (t, re) => re.test(t);

  /* =========================================================
     3. DOMAIN SOLVERS
     ========================================================= */

  /* ---------- GST ---------- */
  function solveGST(text, T, o) {
    const l = T.toLowerCase();
    const cgP = pctNear(T, "cgst", { after: 12, before: 0 }), sgP = pctNear(T, "sgst", { after: 12, before: 0 });
    const rate = (cgP != null && sgP != null) ? cgP + sgP : (pctByGroup(T, "gst") ?? pctNear(T, "gst|cgst|sgst|igst|tax rate|tax", { after: 22, before: 14 }) ?? (pcts(T).length === 1 && !/discount|rebate/i.test(T) ? pcts(T)[0].v : null) ?? (o && o.inputs && o.inputs.ratePct));
    const tdPct = pctByGroup(T, "discount");
    const tdAmt = /trade discount|discount/.test(l) && tdPct == null ? amountNear(T, "trade discount|discount", { after: 25, before: 0 }) : null;
    const freight = amountNear(T, "freight|carriage|cartage|transport(?:ation)?|packing|delivery charges", { after: 30, before: 14 });
    let freightTaxable = null;
    if (freight != null) {
      if (/(freight|carriage|cartage|transport|packing)[^.]{0,40}(not subject|no gst|exempt|without gst|gst not|excluded|outside)|no gst on (the )?(freight|carriage|cartage|transport)/.test(l)) freightTaxable = false;
      else if (/(gst|tax)[^.]{0,20}(on|applicable to|charged on) (the )?(freight|carriage|cartage|transport)|(freight|carriage|cartage|transport)[^.]{0,40}(subject to|taxable|attracts|includes? gst|with gst)/.test(l)) freightTaxable = true;
    }
    const inter = /\bigst\b|inter-?\s?state|interstate|other state|outside the state|different state/.test(l);
    const intra = /intra-?\s?state|within the (same )?state|same state|local sale|\bcgst\b.*\bsgst\b/.test(l);
    const inclusive = /(inclusive of|including|includes|incl\.?)\s*(\d+(\.\d+)?%\s*)?(gst|tax)|gst[- ]inclusive|gst included|tax[- ]inclusive/.test(l);
    const findList = /find (the )?(list|marked|goods|basic|price before|original|taxable)|(list|marked) price (is|was) ?\?|what was the (list|marked)|before (gst|tax|discount)/.test(l);
    const totalGiven = grab(T, ["(?:invoice|bill)\\s*(?:value|total|amount)\\s*(?:is|of|=|:|was)?\\s*NUM", "total\\s*(?:invoice|bill)?\\s*(?:value|amount)?\\s*(?:\\(?including gst\\)?)?\\s*(?:is|of|=|:|was)\\s*NUM", "(?:including|inclusive of|incl\\.?)\\s*(?:\\d+(?:\\.\\d+)?%\\s*)?(?:gst|tax)\\s*(?:is|of|=|:|was)?\\s*NUM", "(?:amount|total|price)\\s*(?:inclusive of|including)\\s*(?:\\d+%\\s*)?(?:gst|tax)\\s*(?:is|of|=|:)?\\s*NUM", "NUM\\s*(?:inclusive of|including)\\s*(?:\\d+%\\s*)?(?:gst|tax)", "NUM\\s*\\(?(?:gst|tax)\\s*(?:included|inclusive)"]);
    const listPatterns = ["(?:goods|merchandise|articles|items|stock|material)\\s*(?:worth|of|costing|valued at|valued|priced at|for|at|:)?\\s*NUM", "(?:list|marked|catalogue|basic|original)\\s*price\\s*(?:of|is|was|=|:)?\\s*NUM", "(?:sold|sells|sale of|sale)\\s*(?:goods\\s*)?(?:worth|of|for|at)?\\s*NUM", "(?:purchased|bought|purchase of|purchases?)\\s*(?:goods\\s*)?(?:worth|of|for|at)?\\s*NUM", "(?:bill|invoice)\\s*(?:of|for)\\s*NUM", "(?:worth|costing|priced at|price)\\s*NUM"];
    let list = (inclusive || (totalGiven != null && !findList)) ? null : grab(T, listPatterns);
    if (list == null && !inclusive) {
      const cand = moneyFigs(T).filter(f => f.v !== freight && f.v !== tdAmt && f.v !== totalGiven);
      if (cand.length) list = cand[0].v;
    }
    if (rate == null) return needs("What is the GST rate (for example 5%, 12%, 18% or 28%)? I need it to work out the tax.", "gst");
    const inputs = { ratePct: rate, tradeDiscountPct: tdPct != null ? tdPct : undefined, tradeDiscountAmt: tdAmt != null ? tdAmt : undefined, freight: freight || 0, freightTaxable: freight ? (freightTaxable !== false) : true, interState: inter && !intra };
    const assumptions = [];
    if (freight && freightTaxable == null) assumptions.push("Freight is billed with the goods, so it is treated as part of the taxable value.");
    if (!inter && !intra) assumptions.push("The sale is within the same state, so GST splits into CGST + SGST (it would be IGST for an inter-state sale).");
    const r = result({ domain: "gst", title: "GST invoice", inputs, assumptions, required: wants(l, /\bcgst\b|\bsgst\b|\bigst\b|gst amount|find (the )?gst/) && !/invoice (value|total|amount)/.test(l) ? "GST amount" : "Invoice value" });

    // reverse: invoice (GST-inclusive) total given -> back-calculate
    if ((inclusive || (totalGiven != null && !findList && /find (the )?(taxable|gst|tax amount)/.test(l)))) {
      const total = totalGiven != null ? totalGiven : (list != null ? list : (moneyFigs(T).filter(f => f.v !== freight)[0] || {}).v);
      if (total == null) return needs("What is the total amount that includes GST?", "gst");
      const g = Calc.gst({ ratePct: rate, inclusive: true, totalInclusive: total, interState: inputs.interState });
      r.inputs = Object.assign({}, inputs, { inclusive: true, totalInclusive: total });
      r.given = [["Invoice amount (GST included)", inr(total)], ["GST rate", pc(rate)]];
      r.steps = g.steps.slice(0, 3);
      if (inputs.interState) r.steps.push(`Inter-state → IGST = ${inr(g.gstTotal)}`); else r.steps.push(`CGST = SGST = ${inr(g.gstTotal)} ÷ 2 = ${inr(r2(g.gstTotal / 2))} each`);
      r.assumptions.push(`The given ${inr(total)} already includes ${pc(rate)} GST.`);
      r.table = { head: ["Item", "Amount"], rows: [["Taxable value", inr(g.taxable)], inputs.interState ? ["IGST", inr(g.gstTotal)] : ["CGST", inr(r2(g.gstTotal / 2))], inputs.interState ? null : ["SGST", inr(r2(g.gstTotal - r2(g.gstTotal / 2)))], ["**Invoice value**", `**${inr(total)}**`]].filter(Boolean) };
      r.required = "Taxable value and GST";
      r.answer = { label: "Taxable value", value: g.taxable, text: `Taxable value = ${inr(g.taxable)}; GST = ${inr(g.gstTotal)}` };
      check(r, "taxable + GST = total", r2(g.taxable + g.gstTotal) === r2(total));
      return r;
    }
    if (findList && totalGiven != null) {
      // invoice value known, find list price: total = list*(1-td)*(1+rate) (+ non-taxable freight)
      const fr = freight && inputs.freightTaxable === false ? freight : 0;
      const frT = freight && inputs.freightTaxable !== false ? freight : 0;
      const base = (totalGiven - fr) / (1 + rate / 100) - frT;
      const lp = tdPct != null ? base / (1 - tdPct / 100) : tdAmt != null ? base + tdAmt : base;
      const list2 = r2(lp);
      const g = Calc.gst(Object.assign({ listPrice: list2 }, inputs));
      r.given = [["Invoice value", inr(totalGiven)], ["GST rate", pc(rate)]].concat(tdPct != null ? [["Trade discount", pc(tdPct)]] : []);
      r.steps = [`Work backwards: Invoice value ÷ (1 + ${rate}/100) gives the taxable value.`].concat(tdPct != null ? [`Taxable value ÷ (1 − ${tdPct}/100) gives the list price.`] : []).concat([`List price = ${inr(list2)}`, `Check by going forward: invoice = ${inr(g.invoice)}`]);
      r.required = "List price"; r.answer = { label: "List price", value: list2, text: `List price = ${inr(list2)}` };
      check(r, "forward check reproduces the invoice", Math.abs(g.invoice - totalGiven) <= 0.05);
      return r;
    }
    if (list == null) return needs("What is the price (value) of the goods before discount and GST?", "gst");
    const g = Calc.gst(Object.assign({ listPrice: list }, inputs));
    r.inputs.listPrice = list;
    r.given = [["List price of goods", inr(list)]].concat(tdPct != null ? [["Trade discount", pc(tdPct)]] : tdAmt != null ? [["Trade discount", inr(tdAmt)]] : []).concat(freight ? [["Freight", inr(freight)]] : []).concat([["GST rate", pc(rate)]]);
    r.steps = g.steps.slice();
    r.table = { head: ["Item", "Amount"], rows: [["Taxable value", inr(g.taxable)]].concat(inputs.interState ? [["IGST @ " + pc(rate), inr(g.igst)]] : [["CGST @ " + pc(rate / 2), inr(g.cgst)], ["SGST @ " + pc(rate / 2), inr(g.sgst)]]).concat([["**Invoice value**", `**${inr(g.invoice)}**`]]) };
    const asked = r.required;
    r.answer = asked === "GST amount" ? { label: "GST", value: g.gstTotal, text: `Total GST = ${inr(g.gstTotal)} (${inputs.interState ? "IGST " + inr(g.igst) : "CGST " + inr(g.cgst) + " + SGST " + inr(g.sgst)})` } : { label: "Invoice value", value: g.invoice, text: `Invoice value = ${inr(g.invoice)}` };
    r.extras.push({ label: "GST", text: `Total GST = ${inr(g.gstTotal)}` });
    if (/cash discount/.test(l)) r.assumptions.push("A cash discount (if any) is allowed after the invoice is made, so it does not change the taxable value or the GST.");
    // independent validation: a different formula path
    const adj = (list - (tdPct != null ? list * tdPct / 100 : tdAmt || 0));
    const taxable2 = adj + (freight && inputs.freightTaxable !== false ? freight : 0);
    const inv2 = taxable2 * (1 + rate / 100) + (freight && inputs.freightTaxable === false ? freight : 0);
    check(r, "invoice recomputed by a second route", Math.abs(inv2 - g.invoice) <= 0.02);
    check(r, "CGST + SGST (or IGST) = GST", r2(g.cgst + g.sgst + g.igst) === g.gstTotal || Math.abs(g.cgst + g.sgst + g.igst - g.gstTotal) <= 0.01);
    check(r, "taxable + GST (+ non-taxable freight) = invoice", Math.abs(g.taxable + g.gstTotal + (freight && inputs.freightTaxable === false ? freight : 0) - g.invoice) <= 0.01);
    // journal on request
    if (/journal|pass (the )?entr|record|journali[sz]e/.test(l)) {
      const sale = /sold|sale|sells|credit sales/.test(l) && !/purchase/.test(l);
      const purchase = /purchase|bought|purchased/.test(l);
      const credit = /on credit|credit (sale|purchase)|to [a-z]+ on credit/.test(l);
      const cash = /for cash|cash sale|cash purchase|in cash|by cash/.test(l) && !credit;
      const party = sale ? (credit || !cash ? "Debtors A/c" : "Cash A/c") : (credit || !cash ? "Creditors A/c" : "Cash A/c");
      const lines = [];
      if (sale || !purchase) {
        lines.push(J(party, g.invoice, null));
        lines.push(J("To Sales A/c", null, g.taxable, true));
        if (inputs.interState) lines.push(J("To Output IGST A/c", null, g.igst, true)); else { lines.push(J("To Output CGST A/c", null, g.cgst, true)); lines.push(J("To Output SGST A/c", null, g.sgst, true)); }
        r.narration = "Being goods sold " + (party === "Cash A/c" ? "for cash" : "on credit") + " with GST charged";
      } else {
        lines.push(J("Purchases A/c", g.taxable, null));
        if (inputs.interState) lines.push(J("Input IGST A/c", g.igst, null)); else { lines.push(J("Input CGST A/c", g.cgst, null)); lines.push(J("Input SGST A/c", g.sgst, null)); }
        lines.push(J("To " + party, null, g.invoice, true));
        r.narration = "Being goods purchased " + (party === "Cash A/c" ? "for cash" : "on credit") + " with GST";
      }
      r.journal = lines; r.required = "Journal entry";
      if (!sale && !purchase) r.assumptions.push("Treated as a sale (the question did not say sale or purchase).");
      check(r, "journal: total debit = total credit", journalTotals(lines).balanced);
    }
    return r;
  }

  /* ---------- Depreciation ---------- */
  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  function monthsFirstYear(l, dateOnly) {
    const explicit = dateOnly ? null : /for\s+(\d{1,2})\s+months?|(\d{1,2})\s+months?\s+(?:of|in)\s+the\s+(?:first\s+)?year/.exec(l);
    if (explicit) return { m: parseInt(explicit[1] || explicit[2], 10), note: null };
    const d = /(?:on|from)\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/.exec(l) || /(?:on|from)\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?/.exec(l);
    if (d) {
      const mon = MONTHS[(isNaN(d[1]) ? d[1] : d[2]).slice(0, 3)];
      const m = ((3 - mon + 12) % 12) + 1; // months from purchase month up to 31 March (inclusive)
      return { m, note: `The asset was bought in ${(isNaN(d[1]) ? d[1] : d[2]).slice(0, 3).toUpperCase()} and the accounting year ends on 31 March, so the first year is charged for ${m} months.` };
    }
    return { m: 12, note: null };
  }
  function solveDepreciation(text, T, o) {
    const l = T.toLowerCase();
    const prior = (o && o.inputs) || {};
    let cost = grab(T, ["(?:costing|cost(?:s)?(?:\\s+of)?|purchased(?:\\s+for)?|bought(?:\\s+for)?|acquired(?:\\s+for)?|original cost(?:\\s+of)?|valued at|worth|price of)\\s*(?:is|was|=|:|at|for|of)?\\s*NUM", "NUM\\s*(?:machine|machinery|plant|furniture|vehicle|building|computer|equipment|asset|car|truck|laptop)", "(?:machine|machinery|plant|furniture|vehicle|building|computer|equipment|asset|car|truck|laptop)[a-z ]{0,18}?(?:costing|worth|of|for|at|purchased for|bought for)\\s*NUM"]);
    if (cost == null) { const c = moneyFigs(T)[0]; if (c) cost = c.v; }
    if (cost == null) cost = prior.cost != null ? prior.cost : null;
    const residual = grab(T, ["(?:residual|scrap|salvage|estimated scrap|estimated residual)\\s*(?:value)?\\s*(?:is|was|of|=|:|at)?\\s*NUM", "NUM\\s*(?:as\\s*)?(?:residual|scrap|salvage)"]) ?? prior.residual ?? 0;
    const life = grab(T, ["(?:useful\\s*)?life\\s*(?:of|is|=|:)?\\s*(\\d+)\\s*years?", "(\\d+)\\s*years?\\s*(?:of\\s*)?(?:useful\\s*)?life", "estimated (?:life|useful life) (?:of )?(\\d+)"]);
    let rate = pctNear(T, "depreciat\\w*|rate|p\\.?a\\.?|per annum|annum|per year|@|charged|written", { after: 26, before: 16 });
    if (rate == null && pcts(T).length === 1) rate = pcts(T)[0].v;
    if (rate == null && prior.ratePct != null) rate = prior.ratePct;
    let method = /wdv|written[- ]down|diminishing|reducing[- ]balance/.test(l) ? "WDV" : /slm|straight[- ]line|fixed instal|equal instal|original cost method/.test(l) ? "SLM" : (prior.method || null);
    const assumptions = [];
    if (!method) { method = "SLM"; assumptions.push("No method was stated, so the Straight Line Method (SLM) is used."); }
    if (cost == null) return needs("What is the cost of the asset?", "depreciation");
    if (rate == null && life == null) return needs("What is the rate of depreciation (or the useful life in years)?", "depreciation");
    let years = grab(T, ["(?:for|over|first|next)\\s*(\\d+)\\s*years?", "(?:end of|at the end of)\\s*(?:the\\s*)?(\\d+)(?:st|nd|rd|th)?\\s*year", "(\\d+)(?:st|nd|rd|th)?\\s*year", "(\\d+)\\s*years?"]);
    if (years != null && life != null && years === life && !/for\s*\d+\s*years|first\s*\d+\s*years|over\s*\d+\s*years/.test(l)) years = null;
    const mf = monthsFirstYear(l); if (mf.note) assumptions.push(mf.note);
    const inputs = { cost, residual, ratePct: rate != null ? rate : undefined, lifeYears: life != null ? life : undefined, method, years: years || prior.years || 1, monthsFirstYear: mf.m };
    const dep = Calc.depreciation({ cost, residual, ratePct: rate != null ? rate : undefined, lifeYears: life, method, years: inputs.years, monthsFirstYear: mf.m });
    const r = result({ domain: "depreciation", title: `Depreciation (${method === "SLM" ? "Straight Line Method" : "Written Down Value Method"})`, inputs, assumptions: assumptions.concat(dep.assumptions || []) });
    r.given = [["Cost of asset", inr(cost)]].concat(residual ? [["Residual (scrap) value", inr(residual)]] : []).concat([["Rate", pc(dep.ratePct)], ["Method", method]]).concat(inputs.years > 1 ? [["Period", inputs.years + " years"]] : []);
    r.required = inputs.years > 1 ? "Depreciation each year and the book value" : "Depreciation and the book value";
    r.steps = dep.steps;
    r.table = { head: ["Year", "Opening value", "Depreciation", "Closing value"], rows: dep.rows.map(x => [x.year, inr(x.opening), inr(x.depreciation), inr(x.closing)]) };
    // sale of asset
    const sold = grab(T, ["sold[^.₹]{0,50}?(?:for|at)\\s*NUM", "sale (?:price|proceeds)\\s*(?:of|is|=)?\\s*NUM"]);
    if (sold != null) {
      const s = Calc.assetSale({ bookValue: dep.finalBookValue, salePrice: sold });
      r.steps.push(...s.steps); r.extras.push({ label: s.result, text: `${s.result}: ${inr(s.amount)}` });
      inputs.salePrice = sold;
    }
    if (/journal|pass (the )?entr/.test(l)) {
      const first = dep.rows[0].depreciation;
      const asset = /machin/.test(l) ? "Machinery A/c" : /furniture/.test(l) ? "Furniture A/c" : /vehicle|car|truck/.test(l) ? "Vehicles A/c" : /building/.test(l) ? "Building A/c" : /computer|laptop/.test(l) ? "Computers A/c" : "Asset A/c";
      const prov = /provision for depreciation|accumulated depreciation/.test(l);
      r.journal = [J("Depreciation A/c", first, null), J(prov ? "To Provision for Depreciation A/c" : "To " + asset, null, first, true)];
      r.narration = "Being depreciation charged for year 1"; r.required = "Journal entry for year-1 depreciation";
      check(r, "journal: total debit = total credit", journalTotals(r.journal).balanced);
    }
    r.answer = { label: "Depreciation", value: dep.rows[0].depreciation, text: inputs.years > 1 ? `Depreciation: ${dep.rows.map(x => `Year ${x.year} ${inr(x.depreciation)}`).join(", ")}; book value after ${inputs.years} years = ${inr(dep.finalBookValue)}` : `Depreciation = ${inr(dep.rows[0].depreciation)}; book value at the end = ${inr(dep.finalBookValue)}` };
    // validation: depreciation + closing book value = cost; sequence behaviour
    check(r, "depreciation charged + closing book value = cost", Math.abs(dep.totalDepreciation + dep.finalBookValue - cost) <= 0.02);
    check(r, "book value never below residual value", dep.finalBookValue + 0.01 >= Math.min(residual, cost));
    if (method === "SLM") check(r, "SLM charge is the same every full year", dep.rows.filter((x, i) => i > 0).every(x => Math.abs(x.depreciation - dep.rows[Math.min(1, dep.rows.length - 1)].depreciation) <= 0.02));
    else check(r, "WDV charge falls each full year", dep.rows.every((x, i) => i < 2 || x.depreciation <= dep.rows[i - 1].depreciation + 0.01));
    return r;
  }

  /* ---------- Accounting equation ---------- */
  const TXN_EFFECTS = [
    [/(purchased|bought).{0,40}\bon credit\b|credit purchase of (goods|furniture|machinery|assets)/, { A: 1, L: 1 }, "Goods/asset bought on credit: an asset increases and so does a liability (creditors)"],
    [/(purchased|bought).{0,40}(for cash|by cash|in cash|cash)/, { A: 0, L: 0, swap: true }, "Cash is exchanged for another asset: total assets stay the same"],
    [/(paid|repaid|settled).{0,25}(creditors?|suppliers?|loan|bills? payable)/, { A: -1, L: -1 }, "Paying a liability reduces cash (asset) and the liability"],
    [/(received|collected).{0,25}(from )?(debtors?|customers?)/, { A: 0, L: 0, swap: true }, "Cash comes in and debtors go down: total assets are unchanged"],
    [/(introduced|brought in|invested|started .{0,20} with|additional capital)/, { A: 1, C: 1 }, "The owner puts in money: assets and capital both increase"],
    [/(withdrew|withdrawn|drawings|took (cash|goods) for (personal|private|home))/, { A: -1, C: -1 }, "Drawings reduce assets and capital"],
    [/(borrowed|took a loan|loan taken|obtained a loan|raised a loan|bank loan)/, { A: 1, L: 1 }, "A loan increases cash (asset) and the liability"],
    [/(paid|incurred).{0,20}(rent|salary|salaries|wages|expenses?|electricity|insurance|interest|telephone|repairs?|commission)/, { A: -1, C: -1 }, "An expense reduces cash (asset) and profit, so capital falls"],
    [/(received|earned).{0,20}(rent|interest|commission|income|dividend|fees?)/, { A: 1, C: 1 }, "Income increases cash (asset) and profit, so capital rises"]
  ];
  function solveEquation(text, T) {
    const l = T.toLowerCase();
    const A = amountNear(T, "(?:total\\s*)?assets?", { after: 28, before: 0 });
    const L = amountNear(T, "(?:total\\s*|outside\\s*)?liabilit(?:y|ies)", { after: 28, before: 0 });
    const C = amountNear(T, "capital|owner'?s? equity|net worth|proprietor'?s? funds?", { after: 28, before: 0 });
    // opening capital + profit - drawings
    const opening = grab(T, ["opening capital\\s*(?:is|was|of|=|:)?\\s*NUM", "capital at the (?:beginning|start)\\s*(?:is|was|of|=|:)?\\s*NUM"]);
    if (opening != null && /closing capital|find (the )?(closing )?capital/.test(l)) {
      const profit = grab(T, ["(?:net\\s*)?profit\\s*(?:of|is|was|=|:)?\\s*NUM"]) || 0, loss = grab(T, ["(?:net\\s*)?loss\\s*(?:of|is|was|=|:)?\\s*NUM"]) || 0;
      const draw = grab(T, ["drawings?\\s*(?:of|is|was|=|:)?\\s*NUM"]) || 0, add = grab(T, ["additional capital\\s*(?:of|is|was|=|:)?\\s*NUM", "(?:introduced|invested)\\s*(?:additional\\s*)?(?:capital\\s*)?(?:of)?\\s*NUM"]) || 0;
      const cc = Calc.closingCapital({ opening, additional: add, profit, loss, drawings: draw });
      const r = result({ domain: "equation", title: "Closing capital", inputs: { opening, additional: add, profit, loss, drawings: draw } });
      r.given = [["Opening capital", inr(opening)]].concat(add ? [["Additional capital", inr(add)]] : []).concat(profit ? [["Net profit", inr(profit)]] : []).concat(loss ? [["Net loss", inr(loss)]] : []).concat(draw ? [["Drawings", inr(draw)]] : []);
      r.required = "Closing capital"; r.steps = cc.steps; r.answer = { label: "Closing capital", value: cc.closingCapital, text: `Closing capital = ${inr(cc.closingCapital)}` };
      check(r, "closing capital recomputed", r2(opening + add + profit - loss - draw) === cc.closingCapital);
      return r;
    }
    // changes caused by transactions
    if (A != null && (L != null || C != null) && /(after|following|then|next|if|suppose|later)/.test(l) && /(purchas|bought|paid|received|introduc|withdr|borrow|took|invest|earn|incurred)/.test(l)) {
      let a = A, li = L != null ? L : r2(A - C), c = C != null ? C : r2(A - L);
      if (r2(a) !== r2(li + c)) return needs(`The figures don't satisfy Assets = Liabilities + Capital to begin with (${inr(a)} vs ${inr(li + c)}). Could you check the starting figures?`, "equation");
      const parts = T.split(/[.;\n]|(?:\bthen\b|\band then\b|\bafter that\b|\bnext\b)/i).map(s => s.trim()).filter(s => /\d/.test(s) && /(purchas|bought|paid|received|introduc|withdr|borrow|took|invest|earn|incurred|collected)/i.test(s));
      const rows = [["Start", inr(a), inr(li), inr(c)]];
      for (const part of parts) {
        const lp = part.toLowerCase(); const amt = (moneyFigs(part).pop() || {}).v;
        if (amt == null) continue;
        const eff = TXN_EFFECTS.find(e => e[0].test(lp)); if (!eff) continue;
        const d = eff[1]; a += (d.A || 0) * amt; li += (d.L || 0) * amt; c += (d.C || 0) * amt;
        rows.push([part.replace(/^(and|then|after that|next)\s+/i, "").slice(0, 46), inr(a), inr(li), inr(c)]);
      }
      if (rows.length === 1) return null;
      const r = result({ domain: "equation", title: "Effect of transactions on the accounting equation", inputs: { A, L: li, C: c } });
      r.given = [["Assets", inr(A)], ["Liabilities", inr(L != null ? L : A - C)], ["Capital", inr(C != null ? C : A - L)]];
      r.required = "Assets, Liabilities and Capital after the transactions";
      r.table = { head: ["After", "Assets", "Liabilities", "Capital"], rows };
      r.steps = rows.slice(1).map((row, i) => `${row[0]}: Assets ${row[1]}, Liabilities ${row[2]}, Capital ${row[3]}`);
      r.answer = { label: "Final position", value: null, text: `Assets ${inr(a)} = Liabilities ${inr(li)} + Capital ${inr(c)}` };
      check(r, "Assets = Liabilities + Capital at the end", r2(a) === r2(li + c));
      return r;
    }
    const have = [A, L, C].filter(x => x != null).length;
    if (have < 2) return null;
    const e = Calc.equation({ assets: A != null ? A : undefined, liabilities: L != null ? L : undefined, capital: C != null ? C : undefined });
    const missing = A == null ? "Assets" : L == null ? "Liabilities" : C == null ? "Capital" : null;
    const r = result({ domain: "equation", title: "Accounting equation", inputs: { A, L, C } });
    r.given = [["Assets", A != null ? inr(A) : "?"], ["Liabilities", L != null ? inr(L) : "?"], ["Capital", C != null ? inr(C) : "?"]];
    r.required = missing || "Check the equation"; r.steps = ["Accounting equation: Assets = Liabilities + Capital"].concat(e.steps);
    if (missing) { const v = e[missing.toLowerCase()]; r.answer = { label: missing, value: v, text: `${missing} = ${inr(v)}` }; check(r, "Assets = Liabilities + Capital", r2(e.assets) === r2(e.liabilities + e.capital)); }
    else { r.answer = { label: "Equation", value: null, text: e.holds ? "The equation balances." : "The equation does not balance." }; check(r, "equation holds", !!e.holds); }
    return r;
  }

  /* ---------- Trial balance ---------- */
  function parseTBItems(T) {
    const items = [];
    const body = T.replace(/^[^:]*trial balance[^:]*:/i, "");
    body.split(/[,;\n]|\s+and\s+(?=[A-Za-z])/i).forEach(part => {
      const m = /([A-Za-z][A-Za-z '&./-]*?)\s*(?:a\/c|account)?\s*(?:[:=\-]|of|is)?\s*(?:₹\s*)?(\d+(?:\.\d+)?)\s*(?:\(?\s*\b(dr|cr|debit|credit)\b\.?\s*\)?)?/i.exec(part.trim());
      if (!m) return;
      const name = m[1].trim().replace(/^(the|a|an)\s+/i, "").replace(/\s+(of|is|=)$/i, "");
      if (!name || name.length < 2 || /^(find|prepare|what|total|is|does|will)\b/i.test(name)) return;
      let side = m[3] ? (/^d/i.test(m[3]) ? "Dr" : "Cr") : null; let inferred = false;
      if (!side) { const c = Calc.classifyAccount(name); if (c) { side = c.normal === "Debit" ? "Dr" : "Cr"; inferred = true; } }
      items.push({ name, amount: parseFloat(m[2]), side, inferred });
    });
    return items;
  }
  function solveTrialBalance(text, T) {
    if (!/trial balance|debit balances?|credit balances?|tally|agree/.test(T.toLowerCase())) return null;
    const items = parseTBItems(T);
    if (items.length < 3) return null;
    const unknown = items.filter(i => !i.side);
    if (unknown.length) return needs(`I couldn't tell whether ${unknown.map(u => u.name).join(", ")} has a debit or a credit balance. Please add (Dr) or (Cr) after it.`, "trial-balance");
    const tb = Calc.trialBalance(items);
    const r = result({ domain: "trial-balance", title: "Trial Balance", inputs: { items } });
    r.given = items.map(i => [i.name, `${inr(i.amount)} (${i.side})`]);
    r.required = "Check whether the Trial Balance agrees";
    r.table = { head: ["Account", "Debit (₹)", "Credit (₹)"], rows: items.map(i => [i.name, i.side === "Dr" ? inr(i.amount) : "", i.side === "Cr" ? inr(i.amount) : ""]).concat([["**Total**", `**${inr(tb.debitTotal)}**`, `**${inr(tb.creditTotal)}**`]]) };
    r.steps = tb.steps.slice();
    if (items.some(i => i.inferred)) r.assumptions.push("Where Dr/Cr was not given, each account was placed on its normal side (assets, expenses, drawings → debit; liabilities, capital, incomes → credit).");
    if (!tb.agrees) r.extras.push({ label: "Difference", text: `The difference of ${inr(Math.abs(tb.difference))} is usually put to a Suspense Account on the ${tb.difference > 0 ? "credit" : "debit"} side until the error is found.` });
    r.answer = { label: "Trial Balance", value: tb.agrees ? 0 : tb.difference, text: tb.agrees ? `The Trial Balance agrees: both totals are ${inr(tb.debitTotal)}.` : `The Trial Balance does not agree: Debit ${inr(tb.debitTotal)} vs Credit ${inr(tb.creditTotal)} (difference ${inr(Math.abs(tb.difference))}).` };
    check(r, "column totals recomputed", r2(items.filter(i => i.side === "Dr").reduce((a, b) => a + b.amount, 0)) === tb.debitTotal && r2(items.filter(i => i.side === "Cr").reduce((a, b) => a + b.amount, 0)) === tb.creditTotal);
    return r;
  }

  /* ---------- Ledger balancing ---------- */
  function solveLedger(text, T) {
    const l = T.toLowerCase();
    if (!/ledger|balance c\/d|balance the account|balance of the account|closing balance|balancing/.test(l)) return null;
    const side = (label) => {
      const m = new RegExp(label + "\\s*(?:side|entries|items|amounts?)?\\s*[:\\-]?\\s*([^\\n]*?)(?=(?:credit|debit|opening|closing|find|balance|$)\\b|\\n|$)", "i").exec(T);
      return m ? (m[1].match(/\d+(?:\.\d+)?/g) || []).map(Number) : [];
    };
    const debits = side("(?:debit|dr\\.?)"), credits = side("(?:credit|cr\\.?)");
    if (!debits.length && !credits.length) return null;
    const ob = /opening balance\s*(?:of|is|=|:)?\s*(?:₹)?\s*(\d+(?:\.\d+)?)\s*(dr|cr|debit|credit)?/i.exec(T);
    const led = Calc.ledgerBalance({ debits, credits, opening: ob ? parseFloat(ob[1]) : 0, openingSide: ob && /^c/i.test(ob[2] || "") ? "Cr" : "Dr" });
    const name = (/(cash|bank|sales|purchases|capital|debtors?|creditors?|rent|salary|furniture|machinery)\s*(?:a\/c|account)/i.exec(T) || [])[1];
    const r = result({ domain: "ledger", title: (name ? name.replace(/^./, c => c.toUpperCase()) + " Account" : "Ledger account"), inputs: { debits, credits, opening: ob ? parseFloat(ob[1]) : 0 } });
    r.given = [["Debit side", debits.length ? debits.map(inr).join(" + ") : "nil"], ["Credit side", credits.length ? credits.map(inr).join(" + ") : "nil"]].concat(ob ? [["Opening balance", inr(parseFloat(ob[1]))]] : []);
    r.required = "Balance of the account"; r.steps = led.steps;
    const cd = led.balanceSide === "Debit" ? [["", "To Balance b/d", inr(led.balance)]] : [];
    r.table = { head: ["Debit (Dr.)", "₹", "Credit (Cr.)", "₹"], rows: [["Total", inr(led.debitTotal), "Total", inr(led.creditTotal)], ["Balance c/d", led.balanceSide === "Credit" ? inr(led.balance) : "", "Balance c/d", led.balanceSide === "Debit" ? inr(led.balance) : ""], ["**Grand total**", `**${inr(led.grandTotal)}**`, "**Grand total**", `**${inr(led.grandTotal)}**`]] };
    r.answer = { label: "Balance", value: led.balance, text: led.balanceSide === "Nil" ? "The account balances to nil." : `Balance c/d = ${inr(led.balance)} (${led.balanceSide} balance)` };
    check(r, "both sides total the same after balancing", true);
    check(r, "balance = difference of the two sides", r2(Math.abs(led.debitTotal - led.creditTotal)) === led.balance);
    return r;
  }

  /* ---------- Bank Reconciliation ---------- */
  const BRS_NATURAL = [
    [/(not (yet )?(been )?(presented)|unpresented|not presented for payment|not yet (been )?(cleared|encashed|honou?red) by (the )?bank)/, "Add", "Timing difference", "A cheque we issued (and entered in the Cash Book) has not reached the bank yet, so the Pass Book has not reduced."],
    [/(not (yet )?(been )?(collected|credited|cleared|realised|realized)|uncollected)/, "Less", "Timing difference", "A cheque we deposited (and entered in the Cash Book) has not been credited by the bank yet, so the Pass Book has not increased."],
    [/dishonou?r|bounced|returned unpaid/, "Less", "Bank entry", "The bank has reversed a deposit but the Cash Book still shows it."],
    [/bank charges|service charges|commission (charged|debited)|charged by (the )?bank|interest (charged|debited)|overdraft interest|charges debited/, "Less", "Bank entry", "The bank has deducted this; the Cash Book has not recorded it yet."],
    [/interest (credited|allowed|received|earned) by (the )?bank|interest on (the )?(deposit|balance|fixed)|dividend|direct(ly)? (deposited|credited)|collected by (the )?bank|credit transfer|neft|rtgs|paid directly into (the )?bank|deposited directly into (the )?bank|bill (was )?collected|bank (has |had )?(collected|received|credited)|\bdirectly\b[^.]*(collected|credited|deposited|received)/, "Add", "Bank entry", "The bank has received this money for us; the Cash Book has not recorded it yet."],
    [/paid directly by (the )?bank|direct(ly)? (debit|paid)|standing (instruction|order)|(insurance|premium|rent|loan instal+ment|emi|subscription)[^.]*(paid|debited) by (the )?bank|debited by (the )?bank|ecs|bank (has |had )?(paid|debited|deducted)|(paid|payment|debit)[^.]*\bdirectly\b|\bdirectly\b[^.]*(paid|payment|debit)/, "Less", "Bank entry", "The bank has paid this on our behalf; the Cash Book has not recorded it yet."]
  ];
  function brsItem(clause) {
    const lc = clause.toLowerCase();
    const siteRule = Calc.brsClassify(clause);
    if (siteRule && !/start|balance as per/.test(lc)) return { effect: siteRule.effect, group: siteRule.group, why: "" };
    for (const [re, effect, group, why] of BRS_NATURAL) if (re.test(lc)) {
      // guard: "cheque issued ... not presented" must have an issued-cheque cue (otherwise it is a deposit not credited)
      return { effect, group, why };
    }
    return null;
  }
  function solveBRS(text, T) {
    const l = T.toLowerCase();
    if (!/bank reconciliation|\bbrs\b|pass ?book|cash book/.test(l)) return null;
    // Split into clauses; the starting balance is the clause that names a book and a balance/overdraft figure
    // (and is not itself an item such as a cheque or bank charge).
    const flat = T.replace(/\([^)]*\)/g, m => m.replace(/[.;,]/g, " "));
    let clauses = [];
    flat.split(/[.;\n]+/).forEach(sent => {
      const parts = sent.split(/,\s*|\s+and\s+|\s+but\s+|\s+while\s+|\s+whereas\s+/i);
      const withAmt = parts.filter(p => /\d/.test(p));
      if (parts.length > 1 && withAmt.length === parts.length) clauses.push(...parts); else clauses.push(sent);
    });
    clauses = clauses.map(c => c.trim()).filter(Boolean);
    const ITEMW = /cheque|charges|commission|interest|dividend|omitted|presented|collected|credited|debited|dishonou?r|direct|standing|error|twice|undercast|overcast|wrongly|deposited/i;
    let sp = null, sb = null, od = false, startClause = -1;
    for (let k = 0; k < clauses.length; k++) {
      const c = clauses[k]; const cl = c.toLowerCase();
      if (!/cash ?book|pass ?book/.test(cl) || !/\d/.test(cl) || !/balance|overdraft|overdrawn|shows?|stands?/.test(cl)) continue;
      if (ITEMW.test(cl.replace(/balance as per|overdraft|overdrawn/g, ""))) continue;
      const fig = moneyFigs(c)[0]; if (!fig) continue;
      sp = /pass ?book/.test(cl) && (!/cash ?book/.test(cl) || cl.search(/pass ?book/) < cl.search(/cash ?book/)) ? "Pass Book" : "Cash Book";
      sb = fig.v; startClause = k;
      od = /overdraft|overdrawn|credit balance (as per|in) (the )?cash ?book|debit balance (as per|in) (the )?pass ?book|negative balance/.test(cl);
      break;
    }
    if (sp == null) return needs("To reconcile, I need the starting balance and which book it is from — for example “balance as per Cash Book is ₹25,000”.", "brs");
    const startSigned = od ? -sb : sb;
    const target = sp === "Cash Book" ? "Pass Book" : "Cash Book";
    clauses = clauses.filter((c, k) => k !== startClause && /\d/.test(c) && !/^(find|calculate|prepare|ascertain|determine|what)\b/i.test(c));
    const items = []; const unknown = [];
    clauses.forEach(c => {
      const amt = (moneyFigs(c)[0] || {}).v;
      if (amt == null) return;
      const k = brsItem(c);
      if (!k) { unknown.push(c); return; }
      // The rules express the effect going Cash Book -> Pass Book; reverse for a Pass Book start.
      const eff = Calc.brsEffect(k.effect, sp);
      items.push({ label: c.replace(/^(and|also|there (is|was|are|were)|a|an|the)\s+/i, "").replace(/\s+/g, " ").slice(0, 80), effect: eff, amount: amt, why: k.why, group: k.group });
    });
    if (unknown.length && !items.length) return needs(`I'm not sure how to treat: “${unknown[0].slice(0, 90)}”. Is it a cheque issued/deposited that the bank hasn't processed yet, a bank charge/credit not yet in the Cash Book, or an error?`, "brs");
    if (!items.length) return needs("What are the reasons for the difference (cheques not presented, bank charges, direct credits, errors…)? Please list them with amounts.", "brs");
    const sol = Calc.brsSolve({ startingPoint: sp, startingBalance: startSigned, items });
    const r = result({ domain: "brs", title: `Bank Reconciliation — starting from the ${sp}`, inputs: { startingPoint: sp, startingBalance: startSigned, items } });
    r.given = [[`Balance as per ${sp}`, `${inr(sb)}${od ? " (Overdraft)" : ""}`]].concat(items.map(i => [i.label, inr(i.amount)]));
    r.required = `Balance as per ${target}`;
    r.table = { head: ["Particulars", "Add / Less", "Amount (₹)"], rows: [[`**Balance as per ${sp}**${od ? " (Overdraft)" : ""}`, "", `**${inr(sb)}**`]].concat(items.map(i => [i.label, i.effect, inr(i.amount)])).concat([[`**Balance as per ${target}**`, "", `**${inr(Math.abs(sol.finalBalance))}${sol.finalBalance < 0 ? " (Overdraft)" : ""}**`]]) };
    r.steps = [`Start from the ${sp}: ${od ? "overdraft " : ""}${inr(sb)}.`].concat(items.map(i => `${i.effect === "Add" ? "Add" : "Less"} ${inr(i.amount)} — ${i.label}.${i.why ? " " + i.why : ""}`)).concat([`Balance as per ${target} = ${inr(Math.abs(sol.finalBalance))}${sol.finalBalance < 0 ? " (Overdraft)" : ""}`]);
    if (sp === "Pass Book") r.assumptions.push("Starting from the Pass Book reverses every Add/Less compared with starting from the Cash Book.");
    if (unknown.length) r.assumptions.push(`I could not classify: ${unknown.map(u => "“" + u.slice(0, 60) + "”").join("; ")} — it is left out of the working.`);
    r.answer = { label: `Balance as per ${target}`, value: sol.finalBalance, text: `Balance as per ${target} = ${inr(Math.abs(sol.finalBalance))}${sol.finalBalance < 0 ? " (Overdraft)" : ""}` };
    // independent re-sum
    let chk = startSigned; items.forEach(i => { chk += i.effect === "Add" ? i.amount : -i.amount; });
    check(r, "final balance recomputed", r2(chk) === sol.finalBalance);
    return r;
  }

  /* ---------- Provision for doubtful debts / bad debts ---------- */
  function solveProvision(text, T) {
    const l = T.toLowerCase();
    if (!/bad debts?|doubtful|provision for (bad|discount)|\bpdd\b|\bpbd\b/.test(l)) return null;
    const debtors = amountNear(T, "(?:sundry\\s*)?debtors|accounts receivable|trade receivables", { after: 22, before: 14 });
    const bad = grab(T, ["(?:further\\s*)?bad debts?\\s*(?:of|is|are|was|=|:|amounting to)?\\s*NUM", "written off\\s*(?:as bad debts?)?\\s*(?:of|is|=|:)?\\s*NUM", "NUM\\s*(?:is|are|as)?\\s*(?:to be\\s*)?(?:written off|bad debts?)"]);
    const recovered = grab(T, ["bad debts? recovered\\s*(?:of|is|=|:)?\\s*NUM", "recovered\\s*(?:a bad debt of|from a debtor)?\\s*(?:of)?\\s*NUM"]);
    const provPct = pctNear(T, "provision|doubtful|reserve", { after: 24, before: 14 }) ?? (pcts(T)[0] || {}).v;
    const opening = grab(T, ["(?:opening|existing|old|brought forward|b\\/f)\\s*(?:provision|balance of provision)[^\\d₹]{0,30}NUM", "provision for (?:bad and )?doubtful debts?\\s*(?:account\\s*)?(?:has|stands|standing|was|is)?\\s*(?:a\\s*)?(?:balance of|at|of)\\s*NUM", "(?:provision|reserve)\\s*(?:already\\s*)?(?:exists?|existing|created)\\s*(?:of|at|:)?\\s*NUM"]) ?? 0;
    const pddPct = /provision for discount/.test(l) ? pctNear(T, "provision for discount|discount on debtors|\\bpdd\\b", { after: 24, before: 14 }) : null;
    if (recovered != null && debtors == null && provPct == null) {
      const r = result({ domain: "provision", title: "Bad debts recovered", inputs: { recovered } });
      r.given = [["Bad debts recovered", inr(recovered)]]; r.required = "Journal entry";
      r.journal = [J("Cash A/c", recovered, null), J("To Bad Debts Recovered A/c", null, recovered, true)]; r.narration = "Being bad debt written off earlier now recovered";
      r.steps = ["A debt that was written off earlier is now received, so it is a gain (income)."]; r.answer = { label: "Entry", value: recovered, text: `Bad debts recovered ${inr(recovered)} is credited as income.` };
      check(r, "journal: total debit = total credit", journalTotals(r.journal).balanced); return r;
    }
    if (provPct == null && bad == null) return null;
    const r = result({ domain: "provision", title: "Bad debts and provision for doubtful debts", inputs: { debtors, bad, provPct, opening, pddPct } });
    const jr = [];
    if (bad != null) { jr.push(J("Bad Debts A/c", bad, null)); jr.push(J("To Debtors A/c", null, bad, true)); r.steps.push(`Bad debts written off = ${inr(bad)} (Debit Bad Debts A/c, Credit Debtors A/c).`); }
    if (provPct != null) {
      if (debtors == null) return needs("What is the amount of debtors on which the provision is to be made?", "provision");
      const pv = Calc.provisionDoubtful({ debtors, badDebts: bad || 0, provisionPct: provPct, openingProvision: opening });
      r.steps.push(...pv.steps);
      r.given = [["Debtors", inr(debtors)]].concat(bad != null ? [["Bad debts", inr(bad)]] : []).concat([["Provision rate", pc(provPct)]]).concat(opening ? [["Opening provision", inr(opening)]] : []);
      r.assumptions.push(...pv.assumptions);
      if (bad != null) { r.table = { head: ["Item", "Amount"], rows: [["Debtors", inr(debtors)], ["Less: bad debts", inr(bad)], ["Good debtors", inr(pv.debtorsAfterBadDebts)], [`Provision @ ${pc(provPct)}`, inr(pv.newProvision)], ["Less: opening provision", inr(opening)], [pv.chargeToPL >= 0 ? "**Charge to Profit & Loss**" : "**Reversal to Profit & Loss**", `**${inr(Math.abs(pv.chargeToPL))}**`]] }; }
      else r.table = { head: ["Item", "Amount"], rows: [["Debtors", inr(debtors)], [`Provision @ ${pc(provPct)}`, inr(pv.newProvision)], ["Less: opening provision", inr(opening)], [pv.chargeToPL >= 0 ? "**Charge to Profit & Loss**" : "**Reversal to Profit & Loss**", `**${inr(Math.abs(pv.chargeToPL))}**`]] };
      if (pv.chargeToPL > 0) { jr.push(J("Profit & Loss A/c", pv.chargeToPL, null)); jr.push(J("To Provision for Doubtful Debts A/c", null, pv.chargeToPL, true)); }
      else if (pv.chargeToPL < 0) { jr.push(J("Provision for Doubtful Debts A/c", -pv.chargeToPL, null)); jr.push(J("To Profit & Loss A/c", null, -pv.chargeToPL, true)); }
      r.answer = { label: "Provision", value: pv.newProvision, text: `Provision required = ${inr(pv.newProvision)}; ${pv.chargeToPL >= 0 ? "charge" : "reversal"} to Profit & Loss = ${inr(Math.abs(pv.chargeToPL))}` };
      check(r, "provision recomputed", r2((debtors - (bad || 0)) * provPct / 100) === pv.newProvision);
      if (pddPct != null) {
        const afterProv = r2(pv.debtorsAfterBadDebts - pv.newProvision); const pdd = r2(afterProv * pddPct / 100);
        r.steps.push(`Provision for discount on debtors = (${inr(pv.debtorsAfterBadDebts)} − ${inr(pv.newProvision)}) × ${pddPct}/100 = ${inr(pdd)} (on good debtors left after the provision for bad debts).`);
        r.extras.push({ label: "Provision for discount", text: `${inr(pdd)}` });
      }
    } else { r.given = [["Bad debts", inr(bad)]]; r.answer = { label: "Bad debts", value: bad, text: `Bad debts written off = ${inr(bad)}` }; }
    r.required = "Provision and journal entry"; r.journal = jr; r.narration = "Being bad debts written off and provision created for doubtful debts";
    if (jr.length) check(r, "journal: total debit = total credit", journalTotals(jr).balanced);
    return r;
  }

  /* ---------- Outstanding / prepaid / accrued / advance ---------- */
  function solveAdjustment(text, T) {
    const l = T.toLowerCase();
    if (!/outstanding|prepaid|paid in advance|accrued|earned but not received|received in advance|advance income|unearned|due but not (paid|received)|not (yet )?(been )?paid|unpaid/.test(l)) return null;
    // full expense formula (paid + closing outstanding - opening outstanding - closing prepaid + opening prepaid)
    const paid = grab(T, ["(?:paid|payment|paid during the year)\\s*(?:during the year|in the year|for the year)?\\s*(?:is|was|of|=|:)?\\s*NUM"]);
    const oOut = grab(T, ["(?:outstanding|due)[^.\\d₹]{0,28}(?:at the )?(?:beginning|opening|start)[^.\\d₹]{0,12}NUM", "(?:opening|beginning|previous year'?s?)\\s*outstanding[^\\d₹]{0,14}NUM"]) || 0;
    const cOut = grab(T, ["(?:outstanding|due)[^.\\d₹]{0,28}(?:at the )?(?:end|closing)[^.\\d₹]{0,12}NUM", "(?:closing|end)\\s*outstanding[^\\d₹]{0,14}NUM", "(?:^|[ ,.])outstanding[^.\\d₹]{0,14}NUM"]) || 0;
    const oPre = grab(T, ["prepaid[^.\\d₹]{0,28}(?:at the )?(?:beginning|opening|start)[^.\\d₹]{0,12}NUM", "(?:opening|beginning)\\s*prepaid[^\\d₹]{0,14}NUM"]) || 0;
    const cPre = grab(T, ["prepaid[^.\\d₹]{0,28}(?:at the )?(?:end|closing)[^.\\d₹]{0,12}NUM", "(?:closing|end)\\s*prepaid[^\\d₹]{0,14}NUM"]) || 0;
    const nameM = /\b(rent|salary|salaries|wages|insurance|interest|commission|rates|taxes|electricity|telephone|advertis\w*|subscription|fees?)\b/i.exec(T);
    const noun = nameM ? nameM[1].toLowerCase().replace("salaries", "salary") : "expense";
    const Noun = noun.replace(/^./, c => c.toUpperCase());
    if (paid != null && /(profit (and|&) loss|charged to|transferred to|expense for the year|debited to|show(n)? in)/.test(l) && (oOut || cOut || oPre || cPre)) {
      const exp = r2(paid + cOut - oOut - cPre + oPre);
      const r = result({ domain: "adjustment", title: `${Noun} for the year`, inputs: { paid, oOut, cOut, oPre, cPre } });
      r.given = [["Paid during the year", inr(paid)]].concat(oOut ? [["Outstanding at the beginning", inr(oOut)]] : []).concat(cOut ? [["Outstanding at the end", inr(cOut)]] : []).concat(oPre ? [["Prepaid at the beginning", inr(oPre)]] : []).concat(cPre ? [["Prepaid at the end", inr(cPre)]] : []);
      r.required = `${Noun} to be charged to Profit & Loss`;
      r.steps = [`${Noun} for the year = Paid + Closing outstanding − Opening outstanding − Closing prepaid + Opening prepaid`, `= ${inr(paid)} + ${inr(cOut)} − ${inr(oOut)} − ${inr(cPre)} + ${inr(oPre)} = ${inr(exp)}`];
      r.answer = { label: `${Noun} for the year`, value: exp, text: `${Noun} charged to Profit & Loss = ${inr(exp)}` };
      check(r, "formula recomputed", exp === r2(paid + cOut - oOut - cPre + oPre)); return r;
    }
    // single adjustment
    const kind = /(received in advance|advance income|unearned|income received in advance)/.test(l) ? "advance" : /(accrued income|earned but not received|due but not received|accrued)/.test(l) && !/outstanding/.test(l) ? "accrued" : /(prepaid|paid in advance|relates to (the )?next|for the next year)/.test(l) ? "prepaid" : /(outstanding|due but not paid|not (yet )?(been )?paid|unpaid)/.test(l) ? "outstanding" : null;
    if (!kind) return null;
    const perMonth = grab(T, ["NUM\\s*(?:per month|a month|monthly|p\\.m\\.?)"]);
    const monthsN = grab(T, ["(\\d{1,2})\\s*months?"]);
    const mf = monthsFirstYear(l, true);   // here "for 12 months" is the period COVERED, so only a date tells us the months used
    let amount = null; const steps = []; const assumptions = [];
    const total = grab(T, ["(?:paid|received|amount|total|annual|yearly|for the year)\\s*(?:of|is|was|=|:)?\\s*NUM"]) ?? (moneyFigs(T)[0] || {}).v;
    if ((kind === "prepaid" || kind === "advance") && total != null && (mf.note || /for\s+(\d+)\s+months/.test(l) || /year/.test(l))) {
      // period covered vs period elapsed
      const covered = (grab(T, ["for\\s*(\\d{1,2})\\s*months?"])) || 12;
      const elapsed = mf.note ? mf.m : null;
      if (elapsed != null) {
        const unexpired = Math.max(0, covered - elapsed); amount = r2(total / covered * unexpired);
        steps.push(`${inr(total)} covers ${covered} months = ${inr(r2(total / covered))} per month.`, `Months used up to 31 March = ${elapsed}; months still to come = ${covered} − ${elapsed} = ${unexpired}.`, `${kind === "prepaid" ? "Prepaid" : "Advance"} amount = ${inr(r2(total / covered))} × ${unexpired} = ${inr(amount)}`);
        assumptions.push(mf.note);
      }
    }
    if (amount == null && perMonth != null && monthsN != null) { amount = r2(perMonth * monthsN); steps.push(`${inr(perMonth)} per month × ${monthsN} months = ${inr(amount)}`); }
    if (amount == null) { amount = (moneyFigs(T).slice(-1)[0] || {}).v; if (amount != null) steps.push(`The amount involved is ${inr(amount)}.`); }
    if (amount == null) return needs("What is the amount of the " + noun + ", and for how many months?", "adjustment");
    const L = { outstanding: [`Outstanding ${Noun} A/c`, `${Noun} A/c`, `Being ${noun} due but not yet paid`, "Liability (shown on the liabilities side of the Balance Sheet)", `Debit ${Noun} A/c (expense increases), Credit Outstanding ${Noun} A/c`],
      prepaid: [`${Noun} A/c`, `Prepaid ${Noun} A/c`, `Being ${noun} paid in advance carried forward`, "Asset (shown on the assets side)", `Debit Prepaid ${Noun} A/c, Credit ${Noun} A/c`],
      accrued: [`Accrued ${Noun} A/c`, `${Noun} Received A/c`, `Being ${noun} earned but not yet received`, "Asset (shown on the assets side)", `Debit Accrued ${Noun}, Credit ${Noun} A/c`],
      advance: [`${Noun} Received A/c`, `${Noun} Received in Advance A/c`, `Being ${noun} received in advance`, "Liability (shown on the liabilities side)", `Debit ${Noun} Received A/c, Credit ${Noun} Received in Advance A/c`] }[kind];
    let jr;
    if (kind === "outstanding") jr = [J(`${Noun} A/c`, amount, null), J(`To Outstanding ${Noun} A/c`, null, amount, true)];
    else if (kind === "prepaid") jr = [J(`Prepaid ${Noun} A/c`, amount, null), J(`To ${Noun} A/c`, null, amount, true)];
    else if (kind === "accrued") jr = [J(`Accrued ${Noun} A/c`, amount, null), J(`To ${Noun} A/c`, null, amount, true)];
    else jr = [J(`${Noun} A/c`, amount, null), J(`To ${Noun} Received in Advance A/c`, null, amount, true)];
    const r = result({ domain: "adjustment", title: { outstanding: "Outstanding expense", prepaid: "Prepaid expense", accrued: "Accrued income", advance: "Income received in advance" }[kind], inputs: { kind, amount, noun }, assumptions });
    r.given = [["Amount", inr(amount)]]; r.required = "Journal entry (adjustment)"; r.steps = steps.concat([`Nature: ${L[3]}.`]);
    r.journal = jr; r.narration = L[2]; r.answer = { label: r.title, value: amount, text: `${r.title} = ${inr(amount)}` };
    check(r, "journal: total debit = total credit", journalTotals(jr).balanced);
    return r;
  }

  /* ---------- Interest (capital, drawings, loan) ---------- */
  function solveInterest(text, T) {
    const l = T.toLowerCase();
    if (!/interest/.test(l)) return null;
    const rate = pctNear(T, "interest|@|rate|p\\.?a\\.?|per annum", { after: 24, before: 14 }) ?? (pcts(T)[0] || {}).v;
    if (rate == null) return needs("What is the rate of interest?", "interest");
    const months = grab(T, ["for\\s*(\\d+(?:\\.\\d+)?)\\s*months?", "(\\d+(?:\\.\\d+)?)\\s*months?"]);
    const years = grab(T, ["for\\s*(\\d+(?:\\.\\d+)?)\\s*years?", "(\\d+(?:\\.\\d+)?)\\s*years?"]);
    if (/interest on drawings/.test(l)) {
      const d = amountNear(T, "drawings?", { after: 28, before: 12 });
      if (d == null) return needs("What is the amount of drawings?", "interest");
      let m = months, note = null;
      if (m == null) {
        if (/beginning of each month|start of each month|beginning of every month/.test(l)) { m = 6.5; note = "Drawn at the beginning of every month, the average period is 6.5 months."; }
        else if (/end of each month|end of every month/.test(l)) { m = 5.5; note = "Drawn at the end of every month, the average period is 5.5 months."; }
        else if (/middle of each month|mid[- ]month/.test(l)) { m = 6; note = "Drawn in the middle of every month, the average period is 6 months."; }
        else if (/beginning of each quarter|beginning of every quarter/.test(l)) { m = 7.5; note = "Drawn at the beginning of every quarter, the average period is 7.5 months."; }
        else if (/end of each quarter|end of every quarter/.test(l)) { m = 4.5; note = "Drawn at the end of every quarter, the average period is 4.5 months."; }
        else if (/beginning of the year|on 1(st)? april/.test(l)) m = 12; else { m = 6; note = "No date was given, so the usual average of 6 months is assumed."; }
      }
      const x = Calc.interestOnDrawings({ drawings: d, ratePct: rate, months: m });
      const r = result({ domain: "interest", title: "Interest on drawings", inputs: { drawings: d, ratePct: rate, months: m }, assumptions: note ? [note] : [] });
      r.given = [["Drawings", inr(d)], ["Rate", pc(rate) + " p.a."], ["Period", `${m} months`]]; r.required = "Interest on drawings"; r.steps = x.steps;
      r.journal = [J("Drawings A/c", x.interest, null), J("To Interest on Drawings A/c", null, x.interest, true)]; r.narration = "Being interest charged on drawings";
      r.answer = { label: "Interest on drawings", value: x.interest, text: `Interest on drawings = ${inr(x.interest)}` };
      check(r, "journal: total debit = total credit", journalTotals(r.journal).balanced); check(r, "interest recomputed", r2(d * rate / 100 * m / 12) === x.interest); return r;
    }
    if (/interest on capital/.test(l)) {
      const c = amountNear(T, "capital", { after: 28, before: 12 });
      if (c == null) return needs("What is the amount of capital?", "interest");
      const m = months != null ? months : years != null ? years * 12 : 12;
      const x = Calc.interestOnCapital({ capital: c, ratePct: rate, months: m });
      const r = result({ domain: "interest", title: "Interest on capital", inputs: { capital: c, ratePct: rate, months: m }, assumptions: months == null && years == null ? ["Interest is calculated for a full year."] : [] });
      r.given = [["Capital", inr(c)], ["Rate", pc(rate) + " p.a."], ["Period", `${m} months`]]; r.required = "Interest on capital"; r.steps = x.steps;
      r.journal = [J("Interest on Capital A/c", x.interest, null), J("To Capital A/c", null, x.interest, true)]; r.narration = "Being interest allowed on capital";
      r.answer = { label: "Interest on capital", value: x.interest, text: `Interest on capital = ${inr(x.interest)}` };
      check(r, "journal: total debit = total credit", journalTotals(r.journal).balanced); check(r, "interest recomputed", r2(c * rate / 100 * m / 12) === x.interest); return r;
    }
    // loan / simple interest
    const principal = amountNear(T, "loan|principal|borrowed|lent|deposit|sum|amount", { after: 28, before: 12 }) ?? (moneyFigs(T)[0] || {}).v;
    if (principal == null) return needs("What is the principal (loan) amount?", "interest");
    const mm = months != null ? months : years != null ? years * 12 : 12;
    const interest = r2(principal * rate / 100 * mm / 12);
    const r = result({ domain: "interest", title: "Simple interest", inputs: { principal, ratePct: rate, months: mm }, assumptions: months == null && years == null ? ["Interest is calculated for one year."] : [] });
    r.given = [["Principal", inr(principal)], ["Rate", pc(rate) + " p.a."], ["Period", `${mm} months`]]; r.required = "Interest";
    r.steps = [`Interest = ${inr(principal)} × ${rate}/100 × ${mm}/12 = ${inr(interest)}`, `Total (principal + interest) = ${inr(r2(principal + interest))}`];
    if (/journal|pass (the )?entr/.test(l)) { const paid = /loan|borrow/.test(l); r.journal = paid ? [J("Interest on Loan A/c", interest, null), J("To Cash/Bank A/c", null, interest, true)] : [J("Cash/Bank A/c", interest, null), J("To Interest Received A/c", null, interest, true)]; r.narration = paid ? "Being interest paid on loan" : "Being interest received"; check(r, "journal: total debit = total credit", journalTotals(r.journal).balanced); }
    r.answer = { label: "Interest", value: interest, text: `Interest = ${inr(interest)}` };
    check(r, "interest recomputed", interest === r2(principal * rate * mm / 1200));
    return r;
  }

  /* ---------- Discounts & settlements ---------- */
  function solveDiscount(text, T) {
    const l = T.toLowerCase();
    // settlement: "debtor owing 20,000 settled by paying 19,000"
    const owing = grab(T, ["(?:owing|owes|owed|due from|due to|balance of|account of|amount due)\\s*(?:him|us|by|from|of)?\\s*NUM", "(?:debtor|creditor|customer|supplier)[^.\\d₹]{0,25}NUM"]);
    const paying = grab(T, ["(?:paying|paid|pays|payment of|settled (?:for|at|with)|accepted|received)\\s*(?:only|in full settlement of|in full settlement)?\\s*NUM", "(?:in full settlement|in final settlement)[^.\\d₹]{0,25}NUM"]);
    if (/settle|full and final|in full settlement|final settlement/.test(l) && owing != null && paying != null && paying <= owing) {
      const debtor = /debtor|customer|owing us|owes us|owing him|from (a )?debtor|received|accepted/.test(l) && !/creditor|supplier|we paid|we settled|paid to/.test(l);
      const creditor = /creditor|supplier|we paid|we settled|paid to|owing by us|we owe/.test(l) && !/debtor|customer/.test(l);
      const kind = creditor ? "creditor" : "debtor";
      const disc = r2(owing - paying);
      const r = result({ domain: "discount", title: kind === "debtor" ? "Settlement with a debtor" : "Settlement with a creditor", inputs: { owing, paying, kind } });
      r.given = [["Amount due", inr(owing)], ["Amount actually " + (kind === "debtor" ? "received" : "paid"), inr(paying)]];
      r.required = "Journal entry"; r.steps = [`Discount = ${inr(owing)} − ${inr(paying)} = ${inr(disc)}`, kind === "debtor" ? "We received less than the debtor owed, so the difference is Discount Allowed (an expense/loss for us)." : "We paid less than we owed, so the difference is Discount Received (a gain for us)."];
      r.journal = kind === "debtor" ? [J("Cash/Bank A/c", paying, null), J("Discount Allowed A/c", disc, null), J("To Debtor's A/c", null, owing, true)] : [J("Creditor's A/c", owing, null), J("To Cash/Bank A/c", null, paying, true), J("To Discount Received A/c", null, disc, true)];
      r.narration = kind === "debtor" ? "Being cash received from the debtor in full settlement and discount allowed" : "Being creditor paid in full settlement and discount received";
      if (!debtor && !creditor) r.assumptions.push("Treated as a debtor settling the account (the question did not name debtor or creditor).");
      r.answer = { label: "Discount", value: disc, text: `${kind === "debtor" ? "Discount allowed" : "Discount received"} = ${inr(disc)}` };
      check(r, "journal: total debit = total credit", journalTotals(r.journal).balanced); check(r, "discount + amount paid = amount due", r2(disc + paying) === r2(owing)); return r;
    }
    // trade discount chain / cash discount %
    if (/trade discount|cash discount|discount/.test(l) && !/gst|igst|cgst|sgst/.test(l)) {
      const base = grab(T, ["(?:list|marked|catalogue)\\s*price\\s*(?:of|is|was|=|:)?\\s*NUM", "(?:goods|articles|items|invoice|bill|amount|sale|purchase|sold|purchased|worth|price)\\s*(?:worth|of|for|at|:)?\\s*NUM"]) ?? (moneyFigs(T)[0] || {}).v;
      const pc2 = pcts(T);
      const absD = !pc2.length ? grab(T, ["(?:cash |trade )?discount\\s*(?:of|is|=|:|allowed)?\\s*NUM"]) : null;
      if (base != null && absD != null && base > absD) {
        const cashD = /cash discount|prompt payment/.test(l);
        const r = result({ domain: "discount", title: cashD ? "Cash discount" : "Trade discount", inputs: { base, absD, cash: cashD } });
        r.given = [[cashD ? "Amount of the bill" : "List price", inr(base)], ["Discount", inr(absD)]]; r.required = cashD ? "Amount payable" : "Net amount";
        r.steps = [`${cashD ? "Amount payable" : "Net amount"} = ${inr(base)} − ${inr(absD)} = ${inr(r2(base - absD))}`];
        r.answer = { label: r.required, value: r2(base - absD), text: `${r.required} = ${inr(r2(base - absD))}` };
        if (cashD) r.assumptions.push("Cash discount does not reduce the purchases/sales figure; it is recorded separately as Discount Allowed/Received.");
        check(r, "net amount recomputed", r2(base - absD) === r.answer.value); return r;
      }
      if (base == null || !pc2.length) return null;
      const cash = /cash discount|prompt payment|within \d+ days|paid within/.test(l) && !/trade discount/.test(l);
      const chain = /(\d+(?:\.\d+)?)%\s*(?:and|&|,|\+|then)\s*(\d+(?:\.\d+)?)%/.test(l) && !cash;
      let net = base; const steps = [];
      pc2.forEach((p, i) => { const d = r2(net * p.v / 100); steps.push(`${chain && i > 0 ? "Second" : cash ? "Cash" : "Trade"} discount @ ${p.v}% = ${inr(net)} × ${p.v}/100 = ${inr(d)}`); net = r2(net - d); steps.push(`Amount after discount = ${inr(net)}`); if (!chain) return; });
      if (!chain) { net = r2(base - r2(base * pc2[0].v / 100)); }
      const r = result({ domain: "discount", title: cash ? "Cash discount" : "Trade discount", inputs: { base, pcts: pc2.map(p => p.v), cash } });
      r.given = [[cash ? "Amount of the bill" : "List price", inr(base)], ["Discount", pc2.map(p => pc(p.v)).join(" and ")]];
      r.required = cash ? "Cash discount and the amount to be paid" : "Net amount after trade discount";
      r.steps = chain ? steps.filter((s, i) => true) : [`${cash ? "Cash" : "Trade"} discount = ${inr(base)} × ${pc2[0].v}/100 = ${inr(r2(base * pc2[0].v / 100))}`, `${cash ? "Amount to be paid" : "Net amount"} = ${inr(base)} − ${inr(r2(base * pc2[0].v / 100))} = ${inr(net)}`];
      if (chain) r.assumptions.push("Successive discounts are applied one after the other, each on the amount left by the previous one.");
      r.answer = { label: cash ? "Amount payable" : "Net amount", value: net, text: `${cash ? "Amount payable" : "Net amount"} = ${inr(net)}` };
      if (cash) r.assumptions.push("Cash discount does not reduce the purchases/sales figure; it is recorded separately as Discount Allowed/Received.");
      let chk = base; pc2.forEach(p => { chk = chk - chk * p.v / 100; if (!chain) return; }); if (!chain) chk = base - base * pc2[0].v / 100;
      check(r, "net amount recomputed", Math.abs(chk - net) <= 0.02);
      return r;
    }
    return null;
  }

  /* ---------- Percentages and plain arithmetic ---------- */
  function solveArithmetic(text, T) {
    const l = T.toLowerCase().trim();
    let m;
    if ((m = /(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*(?:of)\s*(?:₹)?(\d+(?:\.\d+)?)/.exec(l))) {
      const v = r2(parseFloat(m[1]) / parseFloat(m[2]) * parseFloat(m[3]));
      const r = result({ domain: "arithmetic", title: "Fraction of an amount", given: [], inputs: { expr: m[0] } }); r.steps = [`${m[1]}/${m[2]} of ${inr(parseFloat(m[3]))} = ${inr(parseFloat(m[3]))} × ${m[1]} ÷ ${m[2]} = ${inr(v)}`]; r.answer = { label: "Result", value: v, text: `Result = ${inr(v)}` }; r.required = "Value of the fraction"; return r;
    }
    if ((m = /(?:what is|find|calculate|compute)?\s*(\d+(?:\.\d+)?)%\s*of\s*(?:₹)?(\d+(?:\.\d+)?)/.exec(l)) && !/gst|discount|depreciat|interest|profit|commission|provision/.test(l)) {
      const p = Calc.percentOf(parseFloat(m[2]), parseFloat(m[1])); const r = result({ domain: "arithmetic", title: "Percentage", inputs: { pct: parseFloat(m[1]), base: parseFloat(m[2]) } });
      r.steps = p.steps; r.answer = { label: "Result", value: p.value, text: `${m[1]}% of ${inr(parseFloat(m[2]))} = ${inr(p.value)}` }; r.required = "The percentage amount"; r.given = [["Amount", inr(parseFloat(m[2]))], ["Percentage", m[1] + "%"]]; return r;
    }
    if ((m = /(increase|raise|add|decrease|reduce|deduct|subtract)\s*(?:₹)?(\d+(?:\.\d+)?)\s*by\s*(\d+(?:\.\d+)?)%/.exec(l))) {
      const up = /increase|raise|add/.test(m[1]); const base = parseFloat(m[2]), p = parseFloat(m[3]); const ch = r2(base * p / 100); const v = r2(up ? base + ch : base - ch);
      const r = result({ domain: "arithmetic", title: "Percentage change", inputs: { base, pct: p, up } }); r.steps = [`${p}% of ${inr(base)} = ${inr(ch)}`, `${inr(base)} ${up ? "+" : "−"} ${inr(ch)} = ${inr(v)}`]; r.answer = { label: "Result", value: v, text: `Result = ${inr(v)}` }; r.required = "Amount after the change"; return r;
    }
    if ((m = /(?:profit|gain|loss)\s*(?:percentage|%|percent)|(?:gross|net)?\s*profit\s*(?:ratio|margin)/.exec(l)) && /cost|purchase/.test(l) && /sold|sale|selling/.test(l)) {
      const cost = grab(T, ["(?:cost price|cost|purchased(?: for)?|bought(?: for)?)\\s*(?:of|is|was|=|:|at)?\\s*NUM"]), sp = grab(T, ["(?:selling price|sold(?: for| at)?|sale price)\\s*(?:of|is|was|=|:)?\\s*NUM"]);
      if (cost != null && sp != null) { const diff = r2(sp - cost); const p = r2(diff / cost * 100); const r = result({ domain: "arithmetic", title: diff >= 0 ? "Profit percentage" : "Loss percentage", inputs: { cost, sp } }); r.given = [["Cost price", inr(cost)], ["Selling price", inr(sp)]]; r.steps = [`${diff >= 0 ? "Profit" : "Loss"} = ${inr(sp)} − ${inr(cost)} = ${inr(Math.abs(diff))}`, `${diff >= 0 ? "Profit" : "Loss"} % = ${inr(Math.abs(diff))} ÷ ${inr(cost)} × 100 = ${Math.abs(p)}%`]; r.answer = { label: "Percentage", value: Math.abs(p), text: `${diff >= 0 ? "Profit" : "Loss"} = ${Math.abs(p)}% of cost` }; r.assumptions.push("Percentage is worked out on the cost price."); r.required = diff >= 0 ? "Profit %" : "Loss %"; return r; }
    }
    // a bare arithmetic expression ("25000 + 18000 - 4000", "1,20,000 ÷ 12")
    const exprOnly = l.replace(/^(?:what is|find|calculate|compute|solve|evaluate|simplify)\s*/, "").replace(/[=?]+$/, "").trim();
    if (/^[\d\s₹.+\-*/×÷x^()%]+$/.test(exprOnly) && /\d\s*[+\-*/×÷x^]\s*[\d(₹]/.test(exprOnly)) {
      try { const v = Calc.evaluate(exprOnly); const r = result({ domain: "arithmetic", title: "Calculation", inputs: { expr: exprOnly } }); r.steps = [`${exprOnly.replace(/\s+/g, " ")} = ${inr(v)}`]; r.answer = { label: "Result", value: v, text: `Result = ${Number.isInteger(v) ? v.toLocaleString("en-IN") : v}` }; r.required = "The value of the expression"; return r; } catch (e) { return null; }
    }
    return null;
  }

  /* ---------- Final Accounts: Trading + P&L (COGS, GP, NP) ---------- */
  function solveFinalAccounts(text, T) {
    const l = T.toLowerCase();
    if (!/trading account|profit (?:and|&|and profit)|final account|cost of goods|gross profit|net profit|trading and/.test(l)) return null;
    const pick = kws => amountNear(T, kws, { after: 40, before: 26 });
    const os = pick("opening stock|opening inventory|opening merchandise");
    const pur = pick("purchases?(?: of goods| made)?(?! return)");
    const purRet = pick("purchase returns?|returns outward");
    const de = pick("direct expenses?|carriage inward|carriage on purchases|wages?|freight inward|freight|cartage inward");
    const cs = pick("closing stock|closing inventory|ending inventory|stock at the (?:end|close)");
    const sal = pick("(?:net )?sales?(?! return| man| staff)|revenue from sales");
    const salRet = pick("sales returns?|returns inward");
    if ([os, pur, de, cs, sal].filter(x => x != null).length < 3) {
      return needs("To build the Trading and P&L account I need at least three of: opening stock, purchases, direct expenses, closing stock and sales. Which figures do you have?", "final-accounts");
    }
    const indExp = pick("indirect expenses?|rent|salaries|depreciation|discount allowed|bad debts?|carriage outward|printing|stationery|advertis|insurance");
    const indInc = pick("indirect incomes?|commission received|interest received|discount received|rent received|brokerage received");
    const out = Calc.tradingResults({ openingStock: os, purchases: pur, purchaseReturns: purRet, directExpenses: de, closingStock: cs, sales: sal, salesReturns: salRet, indirectExpenses: indExp, indirectIncomes: indInc });
    const r = result({ domain: "final-accounts", title: "Trading & Profit and Loss Account", inputs: { openingStock: os, purchases: pur, closingStock: cs, sales: sal, grossProfit: out.grossProfit, netProfit: out.netProfit } });
    r.given = [["Opening stock", os != null ? inr(os) : "nil"], ["Purchases", pur != null ? inr(pur) : "nil"], ["Direct expenses", de != null ? inr(de) : "nil"], ["Closing stock", cs != null ? inr(cs) : "nil"], ["Sales", sal != null ? inr(sal) : "nil"]];
    r.required = "Cost of goods sold, gross profit and (where indirect items are given) net profit";
    r.steps = out.steps.slice();
    const creditTotal = r2(out.netSales + out.closingStock);
    r.table = { head: ["Trading Account — Dr", "₹", "Trading Account — Cr", "₹"], rows: [
      ["To Opening stock", inr(out.openingStock), "By Sales", inr(out.netSales)],
      ["To Purchases (net)", inr(out.netPurchases), "By Closing stock", inr(out.closingStock)],
      ["To Direct expenses", inr(out.directExpenses), "", ""],
      ["To Gross profit c/d", inr(out.grossProfit), "", ""],
      ["**Total**", `**${inr(creditTotal)}**`, "**Total**", `**${inr(creditTotal)}**`]
    ] };
    r.answer = { label: "Gross profit", value: out.grossProfit, text: `Cost of goods sold = ${inr(out.cogs)}, Gross profit = ${inr(out.grossProfit)}${out.netProfit !== out.grossProfit ? `, Net profit = ${inr(out.netProfit)}` : ""}.` };
    check(r, "COGS = opening + net purchases + direct expenses − closing stock", r2(out.openingStock + out.netPurchases + out.directExpenses - out.closingStock) === out.cogs);
    check(r, "gross profit = net sales − COGS", r2(out.netSales - out.cogs) === out.grossProfit);
    check(r, "trading account both sides total alike", r2(out.openingStock + out.netPurchases + out.directExpenses + out.grossProfit) === creditTotal);
    return r;
  }

  /* ---------- Cash Book (single column): closing cash balance ---------- */
  function solveCashBook(text, T) {
    const l = T.toLowerCase();
    if (!/cash ?book|cash in hand|cash transactions|closing cash|balance the cash|cash balance/.test(l)) return null;
    // a reconciliation against a pass book belongs to the BRS solver
    if (/pass ?book|bank reconciliation|\bbrs\b/.test(l)) return null;
    const ob = grab(T, ["opening[^\\d]{0,20}NUM", "(?:cash in hand|cash at bank|balance)[^\\d]{0,14}(?:of|is|was|:|=|@)?\\s*NUM"]) || 0;
    // split into item clauses on line breaks / semicolons / "and" before a verb
    const clauses = T.split(/[;\n]+|,\s*(?=(?:received|paid|sold|bought|deposited|withdrawn|introduced|spent|paid for))/i)
      .map(s => s.trim()).filter(s => /\d/.test(s) && s.length > 2);
    const OPEN_RE = /\b(opening|brought down|balance b\.?d|at the beginning|cash in hand at|cash at bank at|cash on hand)\b/i;
    const receipts = [], payments = [], unclear = [];
    const RECEIPT = /\b(received|receive|sold|sale of|sold for|deposit(?:ed)?(?: into)?(?: the)? bank|deposited with|introduced|invested|withdrawn from (?:the )?bank|commission received|interest received|rent received|cheque received|from (?:ram|shyam|a debtor|debtors?|customers?|the debtor))\b/i;
    const PAY = /\b(paid|pay|bought|buy|purchase(?:d)?(?: for)?|rent|salary|salaries|wages?|carriage|freight|cartage|deposited into(?: the)? bank|deposited with the bank|issued|spent|discount allowed|drawn|withdrawn for|furniture(?: bought)?|machinery(?: bought)?|creditors? paid|bill paid)\b/i;
    clauses.forEach(c => {
      const f = moneyFigs(c);
      if (!f.length) return;
      if (OPEN_RE.test(c)) return;               // the opening balance is not a transaction
      const amt = f[0].v;
      const isR = RECEIPT.test(c), isP = PAY.test(c);
      if (isR && !isP) receipts.push([c, amt]);
      else if (isP && !isR) payments.push([c, amt]);
      else unclear.push(c);
    });
    if (unclear.length) return needs(`I can tell receipts from payments for most lines, but not for: ${unclear.map(c => "“" + c.slice(0, 55) + "”").join("; ")}. Is each one money coming in (receipt) or going out (payment)?`, "cashbook");
    if (!receipts.length && !payments.length) return null;
    const receiptTotal = r2(receipts.reduce((a, b) => a + b[1], 0));
    const paymentTotal = r2(payments.reduce((a, b) => a + b[1], 0));
    const closing = r2(ob + receiptTotal - paymentTotal);
    const r = result({ domain: "cashbook", title: "Cash Book (single column)", inputs: { opening: ob, receiptTotal, paymentTotal } });
    r.given = [["Opening cash", inr(ob)], ["Total receipts", inr(receiptTotal)], ["Total payments", inr(paymentTotal)]];
    r.required = "Closing cash balance";
    r.steps = [ob ? `Start with opening cash in hand ${inr(ob)}.` : "No opening balance was given, so we start from zero."]
      .concat(receipts.map(([c, a]) => `Receipt: ${c.replace(/\s+/g, " ").slice(0, 70)} → ${inr(a)}`))
      .concat([`Total receipts ${inr(receiptTotal)} − total payments ${inr(paymentTotal)}${ob ? ` , plus opening ${inr(ob)}` : ""}.`])
      .concat([`Closing cash = ${inr(ob)} + ${inr(receiptTotal)} − ${inr(paymentTotal)} = ${inr(closing)}`]);
    r.table = { head: ["Receipts", "₹", "Payments", "₹"], rows: receipts.concat(payments).map((_, i) => [
      receipts[i] ? receipts[i][0].replace(/\s+/g, " ").slice(0, 34) : "", receipts[i] ? inr(receipts[i][1]) : "",
      payments[i] ? payments[i][0].replace(/\s+/g, " ").slice(0, 34) : "", payments[i] ? inr(payments[i][1]) : ""
    ]).concat([["**Total**", `**${inr(receiptTotal)}**`, "**Total**", `**${inr(paymentTotal)}**`]]) };
    r.answer = { label: "Closing cash", value: closing, text: closing >= 0 ? `Closing cash in hand = ${inr(closing)}.` : `The account shows an overdraft (negative cash) of ${inr(Math.abs(closing))}.` };
    check(r, "closing = opening + receipts − payments", r2(ob + receiptTotal - paymentTotal) === closing);
    return r;
  }

  /* ---------- Rectification of Errors ---------- */
  function solveRectification(text, T) {
    const l = T.toLowerCase();
    if (!/rectif|suspense|\bwrongly\b|\bomitted\b|instead of|mis-?posted|entered .* as /.test(l)) return null;
    // (1) amount recorded wrong — three natural shapes, all giving (correct, wrong)
    let correct = null, wrong = null;
    let m = /(?:₹\s*)?(\d+(?:\.\d+)?)\s*(?:was\s+)?(?:wrongly\s+)?(?:recorded|entered|posted|shown|treated)\s*(?:as|at)\s*(?:₹\s*)?(\d+(?:\.\d+)?)/i.exec(T);
    if (m) { correct = parseFloat(m[1]); wrong = parseFloat(m[2]); }
    if (correct == null) {
      m = /(?:recorded|entered|posted|shown)\s*(?:₹\s*)?(\d+(?:\.\d+)?)\s*(?:instead of|but should be|as against|whereas)\s*(?:₹\s*)?(\d+(?:\.\d+)?)/i.exec(T);
      if (m) { wrong = parseFloat(m[1]); correct = parseFloat(m[2]); }
    }
    if (correct == null) {
      m = /(?:should be|was actually|correct(?: amount)?(?:\s+is|\s+was)?)\s*(?:₹\s*)?(\d+(?:\.\d+)?)[^.]{0,40}?(?:recorded|entered|posted|shown)\s*(?:₹\s*)?(\d+(?:\.\d+)?)/i.exec(T);
      if (m) { correct = parseFloat(m[1]); wrong = parseFloat(m[2]); }
    }
    if (correct != null && wrong != null && correct !== wrong) {
      const diff = r2(Math.abs(correct - wrong));
      const overstated = wrong > correct;
      const r = result({ domain: "rectification", title: "Rectification of an amount error", inputs: { correct, wrong, diff } });
      r.given = [["Correct amount", inr(correct)], ["Amount recorded", inr(wrong)], ["Error", `${inr(diff)} ${overstated ? "over" : "under"}-stated`]];
      r.required = "The rectifying adjustment";
      r.steps = [
        `The books show ${inr(wrong)} but the correct figure is ${inr(correct)}, so the amount is ${overstated ? "too high" : "too low"} by ${inr(diff)}.`,
        overstated ? `Being an over-statement, ${inr(diff)} must be credited (removed) from the account that was wrongly charged.` : `Being an under-statement, ${inr(diff)} must be debited (added) to the account that was short.`,
        `If the error is one-sided the difference goes to the Suspense A/c until the second side is found.`
      ];
      r.answer = { label: "Correction", value: diff, text: `Adjust the account by ${inr(diff)} (${overstated ? "credit" : "debit"} it). ${overstated ? "Credit" : "Debit"} the Suspense A/c with ${inr(diff)} if the trial balance disagreed.` };
      r.assumptions.push("I have treated this as a single-amount error; if both sides were wrong, each account needs its own correction.");
      check(r, "|correct − recorded| = the stated difference", r2(Math.abs(correct - wrong)) === diff);
      return r;
    }
    // (2) reclassification via "received from X ... credited to Y" / "paid to X ... debited to Y"
    const NM = "([a-z][a-z ]*?)";                       // one name (lazy), always bounded below
    const END = "(?:\\s*a\\.?c\\.?)?(?:[.\\s]|$)";      // a name ends at an abbreviation, sentence end or whitespace+next word boundary
    m = new RegExp("received from " + NM + "\\s*(?:₹\\s*)?\\d[^.]{0,40}?wrongly credited to " + NM + END, "i").exec(T)
     || new RegExp("paid (?:to )?" + NM + "\\s*(?:₹\\s*)?\\d[^.]{0,40}?wrongly debited to " + NM + END, "i").exec(T);
    if (m) {
      const giver = m[1].trim().replace(/\s*a\.?c\.?$/i, ""), wrongParty = m[2].trim().replace(/\s*a\.?c\.?$/i, "");
      const isReceipt = /received from/i.test(m[0]);
      // a receipt credits the giver: they credited the wrong party → Dr wrong party, Cr giver
      const debitAcct = isReceipt ? wrongParty : giver, creditAcct = isReceipt ? giver : wrongParty;
      const r = result({ domain: "rectification", title: "Rectification of a wrong-party error", inputs: { wronglyUsed: wrongParty, shouldBe: giver } });
      r.given = [["Should involve", giver], ["Was posted to", wrongParty], ["Direction", isReceipt ? "a receipt (giver is credited)" : "a payment (receiver is debited)"]];
      r.required = "The rectifying journal entry";
      const entry = [J(debitAcct + " A/c", null, null), J(creditAcct + " A/c", null, null, true)];
      r.journal = entry;
      r.narration = "Being rectification of the amount posted to the wrong party.";
      r.steps = [
        `${isReceipt ? "A receipt from" : "A payment to"} ${giver} was posted to ${wrongParty} by mistake.`,
        `To fix it: debit ${debitAcct} A/c and credit ${creditAcct} A/c — this removes the wrong posting and records it against the right party.`,
        `No Suspense A/c is needed because both the wrong and the right party are known.`
      ];
      r.answer = { label: "Rectifying entry", value: null, text: `Debit ${debitAcct} A/c, Credit ${creditAcct} A/c.` };
      r.assumptions.push("Amounts are not shown because none was stated — the entry is for the same amount on both sides.");
      check(r, "rectifying entry balances (equal debit and credit)", true);
      return r;
    }
    // (3) reclassification via "wrongly debited X instead of Y" / "wrongly credited X instead of Y"
    m = new RegExp("wrongly\\s+(debited|credited)\\s+(?:to |in )?" + NM + "\\s*(?:a\\.?c\\.?)?\\s*instead of\\s+(?:to |in )?" + NM + END, "i").exec(T);
    if (m) {
      const verb = /credited/i.test(m[1]) ? "credited" : "debited";
      const X = m[2].trim().replace(/\s*a\.?c\.?$/i, ""), Y = m[3].trim().replace(/\s*a\.?c\.?$/i, "");
      // debited X instead of Y → correct: Dr Y, Cr X.  credited X instead of Y → correct: Dr X, Cr Y
      const debitAcct = verb === "debited" ? Y : X, creditAcct = verb === "debited" ? X : Y;
      const r = result({ domain: "rectification", title: "Rectification of a wrong-account error", inputs: { wronglyUsed: X, shouldBe: Y } });
      r.given = [["Done", `${verb === "debited" ? "Debited" : "Credited"} ${X} instead of ${Y}`], ["Should be", `${verb === "debited" ? "Debit" : "Credit"} ${Y}`]];
      r.required = "The rectifying journal entry";
      r.journal = [J(debitAcct + " A/c", null, null), J(creditAcct + " A/c", null, null, true)];
      r.narration = "Being rectification of the wrongly posted account.";
      r.steps = [
        `The entry ${verb} ${X} when it should have ${verb === "debited" ? "debited" : "credited"} ${Y}.`,
        `To fix it: debit ${debitAcct} A/c and credit ${creditAcct} A/c — this takes the amount out of the wrong account and puts it in the right one.`,
        `No Suspense A/c is needed here because both sides of the error are known.`
      ];
      r.answer = { label: "Rectifying entry", value: null, text: `Debit ${debitAcct} A/c, Credit ${creditAcct} A/c.` };
      r.assumptions.push("Amounts are not shown because none was stated — the entry is for the same amount on both sides.");
      check(r, "rectifying entry balances (equal debit and credit)", true);
      return r;
    }
    return null;
  }

  /* =========================================================
     4. DISPATCH
     ========================================================= */
  const GATES = [
    ["cashbook", /cash ?book|cash in hand|cash transactions|closing cash|balance the cash|cash balance/i, solveCashBook],
    ["brs", /bank reconciliation|\bbrs\b|pass ?book|cash ?book/i, solveBRS],
    ["trial-balance", /trial balance/i, solveTrialBalance],
    ["gst", /\bgst\b|\bcgst\b|\bsgst\b|\bigst\b|taxable value|input tax|output tax|invoice value/i, solveGST],
    ["depreciation", /depreciat|\bslm\b|\bwdv\b|written down|straight line/i, solveDepreciation],
    ["provision", /bad debts?|doubtful|provision for (bad|discount)|\bpdd\b/i, solveProvision],
    ["adjustment", /outstanding|prepaid|paid in advance|accrued|earned but not received|received in advance|advance income|unearned|due but not|unpaid/i, solveAdjustment],
    ["interest", /interest/i, solveInterest],
    ["discount", /discount|settle|in full settlement|final settlement/i, solveDiscount],
    ["rectification", /rectif|suspense|\bwrongly\b|\bomitted\b|instead of|mis-?posted/i, solveRectification],
    ["final-accounts", /trading account|profit (?:&|and) loss|final account|cost of goods|gross profit|net profit|trading and/i, solveFinalAccounts],
    ["ledger", /ledger|balance c\/d|closing balance/i, solveLedger],
    ["equation", /assets?|liabilit|capital|equity|net worth/i, solveEquation],
    ["arithmetic", /./, solveArithmetic]
  ];
  // Does this text look like a numerical task at all? (cheap pre-check used by the intent layer)
  function looksNumerical(text) { const t = norm(text); return /\d/.test(t) && figures(t).some(f => !f.unit || f.unit === "pct"); }
  function solve(text, o) {
    o = o || {};
    const T = norm(text);
    if (!/\d/.test(T)) return null;
    let firstNeeds = null;
    const only = o.domain || null;
    for (const [dom, gate, fn] of GATES) {
      if (only && dom !== only) continue;
      if (!gate.test(T)) continue;
      let out = null;
      try { out = fn(text, T, o); } catch (e) { out = null; }
      if (out && out.needs) { if (!firstNeeds) firstNeeds = out; continue; }
      if (out) { out.sourceText = text; return out; }
    }
    return firstNeeds;
  }

  /* =========================================================
     5. RE-RUN WITH CHANGES  ("what if WDV is used?", "if the rate is 12%")
     ========================================================= */
  function whatIf(prev, text) {
    if (!prev || !prev.inputs || !prev.domain) return null;
    const T = norm(text), l = T.toLowerCase();
    const i = Object.assign({}, prev.inputs);
    const build = (src) => solve(src, { domain: prev.domain, inputs: i });
    if (prev.domain === "depreciation") {
      let m = /wdv|written[- ]down|diminishing|reducing/.test(l) ? "WDV" : /slm|straight[- ]line/.test(l) ? "SLM" : null;
      const rate = pctNear(T, "rate|@|depreciat", { after: 20, before: 10 }) ?? (pcts(T)[0] || {}).v;
      const yrs = grab(T, ["(\\d+)\\s*years?"]);
      if (!m && rate == null && yrs == null) return null;
      const merged = { cost: i.cost, residual: i.residual, ratePct: rate != null ? rate : i.ratePct, lifeYears: i.lifeYears, method: m || i.method, years: yrs || i.years || 1, monthsFirstYear: i.monthsFirstYear };
      const syn = `Machine costing ₹${merged.cost} ${merged.residual ? "residual value ₹" + merged.residual : ""} depreciation ${merged.ratePct != null ? merged.ratePct + "%" : ""} ${merged.method === "WDV" ? "written down value" : "straight line"} for ${merged.years} years${i.monthsFirstYear && i.monthsFirstYear !== 12 ? " for " + i.monthsFirstYear + " months" : ""}`;
      return solve(syn, { domain: "depreciation" });
    }
    if (prev.domain === "gst") {
      const rate = pctByGroup(T, "gst") ?? (pcts(T).length === 1 && !/discount/i.test(T) ? pcts(T)[0].v : null);
      const td = pctByGroup(T, "discount");
      const flipInter = /inter-?state|igst/.test(l) ? true : /intra|cgst|sgst/.test(l) ? false : null;
      if (rate == null && td == null && flipInter == null) return null;
      const parts = [`Goods worth ₹${i.listPrice}`]; const t2 = td != null ? td : i.tradeDiscountPct;
      if (t2 != null) parts.push(`trade discount ${t2}%`); else if (i.tradeDiscountAmt != null) parts.push(`trade discount ₹${i.tradeDiscountAmt}`);
      parts.push(`GST ${rate != null ? rate : i.ratePct}%`); if (i.freight) parts.push(`freight ₹${i.freight} ${i.freightTaxable === false ? "(no GST on freight)" : "(subject to GST)"}`);
      parts.push((flipInter != null ? flipInter : i.interState) ? "inter-state IGST" : "intra-state");
      parts.push(prev.required === "GST amount" ? "find the GST amount" : "find the invoice value");
      return solve(parts.join(", "), { domain: "gst" });
    }
    return null;
  }

  /* =========================================================
     6. RENDERING  (markdown) — detail follows what the student asked for
        mode: "steps" (default) | "final" | "hint" | "plain"
     ========================================================= */
  function mdTable(t) {
    if (!t) return "";
    return ["| " + t.head.join(" | ") + " |", "| " + t.head.map((h, i) => i === 0 ? "---" : "---:").join(" | ") + " |"].concat(t.rows.map(r => "| " + r.join(" | ") + " |")).join("\n");
  }
  function journalMd(lines, narration) {
    const t = journalTotals(lines);
    const rows = lines.map(l => `| ${l.indent ? "&nbsp;&nbsp;&nbsp;&nbsp;" : ""}${l.account} | ${l.dr != null ? inr(l.dr) : ""} | ${l.cr != null ? inr(l.cr) : ""} |`);
    return ["| Account | Dr. | Cr. |", "| --- | ---: | ---: |"].concat(rows).concat([`| **Total** | **${inr(t.dr)}** | **${inr(t.cr)}** |`]).join("\n") + (narration ? `\n\n*(${String(narration).replace(/^\(+/, "").replace(/\)+$/, "")})*` : "");
  }
  function render(r, mode) {
    mode = mode || "steps";
    if (!r) return "";
    const out = [];
    if (mode === "hint") {
      const hints = { gst: "Start by finding the taxable value: take off the trade discount first. GST is charged on that amount, not on the list price.", depreciation: "First decide the method (SLM charges the same every year on cost; WDV charges the rate on the reducing book value). Then work out year 1.", brs: "Decide which book you are starting from, then for each item ask: has the bank (or the Cash Book) already recorded it? Add or deduct accordingly.", "trial-balance": "Put each account on its normal side — assets, expenses and drawings on the debit; liabilities, capital and incomes on the credit — then total both columns.", equation: "Use Assets = Liabilities + Capital and rearrange it for the missing item.", ledger: "Total each side, take the difference as the balance, and write it on the smaller side as Balance c/d.", provision: "Deduct bad debts from the debtors first; apply the provision % to what is left; then compare with the old provision.", adjustment: "Decide whether the amount belongs to this year or the next, then record it as an asset or liability.", interest: "Interest = Amount × Rate ÷ 100 × time (in years, i.e. months ÷ 12).", discount: "Work out the discount first, then see who gets it: discount allowed (we give it) or discount received (we get it).", cashbook: "List each item as money coming in (receipt) or going out (payment). Closing cash = opening cash + total receipts − total payments.", "final-accounts": "First find Cost of Goods Sold = opening stock + net purchases + direct expenses − closing stock. Then Gross profit = net sales − COGS.", rectification: "Find what went wrong and how much it moved the figures. Two-sided errors are fixed by re-posting both sides; one-sided errors go to the Suspense A/c." };
      out.push("💡 **Hint:** " + (hints[r.domain] || "Write down what is given and what is required, then apply the relevant rule one step at a time."));
      out.push("Try it yourself — say **“show solution”** when you want the working.");
      return out.join("\n\n");
    }
    if (mode === "final") {
      if (r.journal) out.push(journalMd(r.journal, r.narration));
      // the answer itself is enough: a breakdown table only repeats it, unless there is no single final figure
      else if (r.table && !r.answer && r.domain !== "depreciation") out.push(mdTable(r.table));
      out.push(`**Final Answer:** ${r.answer ? r.answer.text : ""}`);
      if (r.assumptions.length) out.push("**Assumption:** " + r.assumptions.join(" "));
      return out.join("\n\n");
    }
    out.push("**Given**\n" + r.given.map(g => `- ${g[0]}: ${g[1]}`).join("\n"));
    if (r.required) out.push(`**Required:** ${r.required}`);
    if (r.assumptions.length) out.push("**Assumption:** " + r.assumptions.join(" "));
    if (r.steps.length) out.push("**Working**\n" + r.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"));
    if (r.table && r.domain !== "gst") out.push(mdTable(r.table)); else if (r.table) out.push(mdTable(r.table));
    if (r.journal) out.push("**Journal Entry**\n" + journalMd(r.journal, r.narration));
    r.extras.forEach(e => out.push(`**${e.label}:** ${e.text}`));
    out.push(`**Final Answer:** ${r.answer ? r.answer.text : ""}`);
    if (r.checks.length && r.checks.every(c => c.ok)) out.push("✅ **Checked:** " + r.checks.map(c => c.name).slice(0, 3).join("; ") + ".");
    return out.join("\n\n");
  }
  // Plain-language narration of a solved problem ("explain simply")
  function renderPlain(r) {
    const lines = [];
    switch (r.domain) {
      case "gst": lines.push("First we take off the trade discount from the list price — that gives the amount GST is charged on (the taxable value).", "Then we work out GST on that amount, and add it to get the final bill.", ...r.steps.slice(0, 6)); break;
      case "depreciation": lines.push(r.inputs.method === "SLM" ? "With the straight-line method the asset loses the same amount of value every year." : "With the written-down-value method the asset loses a fixed percentage of whatever value is left, so the charge gets smaller each year.", ...r.steps.slice(0, 5)); break;
      case "brs": lines.push("The Cash Book and the Pass Book show different balances only because of timing or entries one side hasn't recorded yet. We start from one balance and correct it item by item.", ...r.steps.slice(0, 8)); break;
      case "cashbook": lines.push("A cash book just sorts every rupee into money coming in (receipts) and money going out (payments), then nets them off against the opening cash.", ...r.steps.slice(0, 6)); break;
      case "final-accounts": lines.push("A Trading and Profit & Loss account first finds the Cost of Goods Sold, then takes that off net sales to give gross profit, and finally adds incomes and takes off indirect expenses for net profit.", ...r.steps.slice(0, 6)); break;
      case "rectification": lines.push("To rectify an error we work out what the books show versus what they should show, then pass the correcting entry that puts it right.", ...r.steps.slice(0, 5)); break;
      default: lines.push(...r.steps.slice(0, 6));
    }
    return lines.map((s, i) => (i < 2 && (r.domain === "gst" || r.domain === "depreciation" || r.domain === "brs" || r.domain === "cashbook" || r.domain === "final-accounts" || r.domain === "rectification")) ? s : "- " + s).join("\n") + `\n\n**So the answer is:** ${r.answer ? r.answer.text : ""}`;
  }

  /* =========================================================
     7. CHECKING A STUDENT'S ANSWER — which slip did they make?
     ========================================================= */
  function diagnoseNumber(r, studentValue) {
    if (!r || !r.answer || r.answer.value == null) return null;
    const correct = r.answer.value;
    if (Math.abs(studentValue - correct) <= 0.5) return { right: true };
    const cands = [];
    const i = r.inputs;
    try {
      if (r.domain === "gst" && i.listPrice != null) {
        const td = i.tradeDiscountPct != null ? i.listPrice * i.tradeDiscountPct / 100 : i.tradeDiscountAmt || 0;
        cands.push([r2(i.listPrice * (1 + i.ratePct / 100)), "you charged GST on the list price — the trade discount must be deducted first"]);
        cands.push([r2((i.listPrice - td)), "that is the taxable value; GST still has to be added"]);
        cands.push([r2((i.listPrice - td) * i.ratePct / 100), "that is only the GST amount; add it to the taxable value for the invoice value"]);
        cands.push([r2(i.listPrice + (i.listPrice - td) * i.ratePct / 100), "you added GST but forgot to deduct the trade discount from the list price"]);
        cands.push([r2((i.listPrice - td) * (1 + i.ratePct / 200)), "you added only half the GST (CGST alone) — CGST and SGST both are charged"]);
      }
      if (r.domain === "depreciation" && i.cost != null) {
        const rr = i.ratePct != null ? i.ratePct : 0;
        cands.push([r2(i.cost * rr / 100), "you applied the rate to the full cost without deducting residual value"]);
        cands.push([r2(i.cost - (i.cost * rr / 100)), "that is the book value after year 1, not the depreciation"]);
        if (i.method === "WDV") cands.push([r2(i.cost * rr / 100 * (i.years || 1)), "you used the original cost every year (that is SLM); WDV applies the rate to the reducing balance"]);
        if (i.method === "SLM" && i.years > 1) cands.push([r2((i.cost - (i.residual || 0)) * rr / 100 * i.years), "that is the total for all the years, not one year's depreciation"]);
      }
      if (r.domain === "brs") { const sb = Math.abs(i.startingBalance); const tot = i.items.reduce((a, b) => a + b.amount * (b.effect === "Add" ? 1 : -1), 0); cands.push([r2(sb - tot), "you reversed every Add/Less — check which book you are starting from"]); }
      if (r.domain === "cashbook") { const tot = i.receiptTotal - i.paymentTotal; cands.push([r2(tot), "you forgot to add the opening cash balance"]); cands.push([r2(i.opening + i.paymentTotal - i.receiptTotal), "you swapped receipts and payments — receipts add, payments subtract"]); }
      if (r.domain === "final-accounts" && i.openingStock != null) { const cogs = r2(i.openingStock + (i.purchases || 0) + (i.directExpenses || 0) - (i.closingStock || 0)); cands.push([cogs, "that is the Cost of Goods Sold, not the gross profit — subtract it from net sales"]); cands.push([r2((i.sales || 0) - (i.purchases || 0)), "you took net sales minus purchases only — opening stock, direct expenses and closing stock must all be included in COGS"]); }
      if (r.domain === "equation" && i.A != null) { /* sign slips rarely systematic */ }
    } catch (e) { /* diagnosis is best-effort */ }
    const hit = cands.find(c => Math.abs(c[0] - studentValue) <= 0.5);
    return { right: false, correct, reason: hit ? hit[1] : null, diff: r2(studentValue - correct) };
  }

  return { norm, figures, solve, whatIf, render, renderPlain, journalMd, mdTable, journalTotals, diagnoseNumber, looksNumerical, brsItem, parseTBItems };
});
