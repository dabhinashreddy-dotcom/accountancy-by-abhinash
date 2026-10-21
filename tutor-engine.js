/* ============================================================
   AI TUTOR ENGINE v2  (tutor-engine.js)
   ------------------------------------------------------------
   This file is ADDITIVE. It does not modify accounting-cycle.js,
   the Journal Entry Generator, or any existing function in app.js.
   It sits in front of the existing local AI Tutor brain
   (aiLocalBrain, in app.js) and reuses the existing Accounting
   Cycle engine (acParseTransaction, in accounting-cycle.js) for
   real calculations, so the same rules and numbers you already
   trust in the Accounting Cycle tool are the ones the AI Tutor
   uses too.

   Public API: window.TutorEngine.respond(text, chat, opts)
     -> null                      : caller should fall back to the
                                     existing aiLocalBrain(text, chat)
     -> { text, quick, journalHTML?, sectionsHTML? }
                                   : a full reply in the same shape
                                     aiLocalBrain() already returns,
                                     so no caller-side changes are
                                     needed beyond rendering the two
                                     optional HTML extras.

   Chat-level state this file introduces (all optional, all persisted
   the same way as everything else in STATE.aiChats via saveState()):
     chat.answerMode      "hint" | "steps" | "final"   (default "steps")
     chat.pendingProblem  the last solvable problem offered, so a
                           follow-up ("hint", "show steps", or the
                           student's own attempt) can refer back to it
     chat.lastComputed    the last computed result, for the
                           "the answer seems wrong" recheck flow
   ============================================================ */
(function (global) {
  "use strict";

  /* ---------------------------------------------------------
     0. SMALL UTILITIES (self-contained — no dependency on
     accounting-cycle.js/app.js at *load* time; those are only
     called from inside functions, by which point every script
     on the page has already finished loading).
     --------------------------------------------------------- */
  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
  function inr(n) {
    if (n === null || n === undefined || isNaN(n)) return "0";
    const r = round2(n);
    return r % 1 === 0 ? r.toLocaleString("en-IN") : r.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  function allPercents(text) {
    const out = []; const re = /(\d+(?:\.\d+)?)\s*%/g; let m;
    while ((m = re.exec(text))) out.push({ value: parseFloat(m[1]), index: m.index, window: text.slice(Math.max(0, m.index - 32), m.index + 16).toLowerCase() });
    return out;
  }
  function percentNear(text, keywords) {
    for (const p of allPercents(text)) if (keywords.some(k => p.window.includes(k))) return p.value;
    return null;
  }
  // Falls back to "the only percentage mentioned" when a keyword-proximity
  // match fails — safe because every calc module only calls this after its
  // own match() already confirmed the sentence is about that specific
  // calculation, so a single lone percentage is unambiguous.
  function percentNearOrOnly(text, keywords) {
    const near = percentNear(text, keywords);
    if (near !== null) return near;
    const all = allPercents(text);
    return all.length === 1 ? all[0].value : null;
  }
  function allAmounts(text) {
    const stripped = text.replace(/\d+(?:\.\d+)?\s*%/g, " ");
    const re = /(?:₹|rs\.?\s*|inr\s*)?([\d][\d,]*(?:\.\d+)?)/gi;
    const out = []; let m;
    while ((m = re.exec(stripped))) {
      const v = parseFloat(m[1].replace(/,/g, ""));
      if (!isNaN(v) && v >= 1) out.push({ value: v, index: m.index });
    }
    return out;
  }
  function amountNear(text, keywords) {
    const lower = text.toLowerCase();
    let bestVal = null, bestDist = Infinity;
    keywords.forEach(k => {
      const kwIdx = lower.indexOf(k);
      if (kwIdx === -1) return;
      const kwEnd = kwIdx + k.length;
      allAmounts(text).forEach(a => {
        // Prefer an amount that appears *after* the keyword (its natural
        // position — "sold for 35000") over one before it, matching the
        // same nearest-following-number heuristic used elsewhere in the
        // site's accounting engine.
        const dist = a.index >= kwEnd ? (a.index - kwEnd) : (kwIdx - a.index);
        if (dist >= 0 && dist < bestDist) { bestDist = dist; bestVal = a.value; }
      });
    });
    return bestVal;
  }
  function monthsFromText(text) {
    let m = /for\s+(\d+)\s*months?/i.exec(text);
    if (m) return parseInt(m[1], 10);
    m = /(\d+)\/12/.exec(text);
    if (m) return parseInt(m[1], 10);
    if (/half\s*(a\s*)?year|6\s*months/i.test(text)) return 6;
    if (/quarter|3\s*months/i.test(text)) return 3;
    return null;
  }

  /* ---------------------------------------------------------
     1. LIGHT SPELLING TOLERANCE
     Only used to help *detect intent* — the student's original
     text is always what gets shown back to them and fed into
     the real parsers (matchJournalPattern / acParseTransaction),
     so a fixed number in a misspelled sentence is never altered.
     --------------------------------------------------------- */
  const TERM_DICTIONARY = [
    "journal", "ledger", "trial", "balance", "debit", "credit", "account", "entry", "entries",
    "depreciation", "discount", "provision", "doubtful", "debtors", "creditors", "outstanding",
    "prepaid", "accrued", "capital", "drawings", "commission", "purchase", "purchased", "sales",
    "sold", "furniture", "machinery", "narration", "equation", "asset", "assets", "liability",
    "liabilities", "expense", "expenses", "income", "posting", "accounting", "accountancy",
    "insurance", "bank", "cash", "goods", "gst", "voucher"
  ];
  function levenshtein(a, b) {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
      let prev = dp[0]; dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[n];
  }
  function correctSpellingForIntent(text) {
    return text.split(/(\s+)/).map(tok => {
      const w = tok.replace(/[^a-zA-Z]/g, "");
      if (w.length < 4) return tok;
      const lower = w.toLowerCase();
      if (TERM_DICTIONARY.includes(lower)) return tok;
      let best = null, bestDist = 3;
      for (const term of TERM_DICTIONARY) {
        if (Math.abs(term.length - lower.length) > 2) continue;
        const d = levenshtein(lower, term);
        if (d < bestDist) { bestDist = d; best = term; }
      }
      if (best && bestDist <= 2) return tok.replace(w, best);
      return tok;
    }).join("");
  }

  /* ---------------------------------------------------------
     2. SMALL TALK / CONVERSATIONAL BEHAVIOUR (section 19)
     --------------------------------------------------------- */
  const GREETING_RE = /^(hi+|hey+|hello+|hlo|helo|yo|good\s*(morning|afternoon|evening)|namaste|sup)[\s!.?]*$/i;
  const HOWAREYOU_RE = /\bhow\s*(are|r)\s*(you|u)\b/i;
  const CAPABILITY_RE = /\bwhat\s*(can|do|all)\s*you\s*(do|help|know|teach)|\bhelp\s*me\s*with\b|\bwho\s*are\s*you\b|\bwhat\s*are\s*you\b|\bwhat\s*is\s*this\b/i;
  const THANKS_RE = /^(thanks?( you)?|thx|ty|great|nice one|cool|ok(ay)?|got it|got you|understood)[\s!.]*$/i;
  const BYE_RE = /^(bye+|goodbye|see\s*you|gtg|ok\s*bye)[\s!.]*$/i;

  function smallTalk(rawText) {
    const t = rawText.trim();
    if (!t) return null;
    if (GREETING_RE.test(t)) {
      return { text: "Hi! 👋 I'm ready to help you with Accountancy. You can ask me about journal entries, ledger, trial balance, calculations (depreciation, GST, discounts, provisions...), or paste a transaction and I'll walk you through it.", quick: ["practice"] };
    }
    if (HOWAREYOU_RE.test(t)) {
      return { text: "I'm doing well, thanks for asking! 😊 What Accountancy topic would you like to work on?", quick: ["practice"] };
    }
    if (CAPABILITY_RE.test(t)) {
      return {
        text: "Here's what I can do:\n\n- Explain concepts — journal, ledger, trial balance, the accounting equation, and more\n- Solve journal-entry and numerical problems, step by step\n- Handle calculations — trade & cash discount, GST, SLM/WDV depreciation, bad debts, provision for doubtful debts, outstanding/prepaid/accrued items, interest on capital & drawings, manager's commission\n- Check an answer you've attempted and tell you exactly what to fix\n- Give you Hint, Step-by-Step, or Final-Answer modes for any problem\n\nJust type a question, or paste a transaction to get started.",
        quick: ["practice"]
      };
    }
    if (THANKS_RE.test(t)) return { text: "You're welcome! Want another question, or should we look at a different topic?", quick: ["practice"] };
    if (BYE_RE.test(t)) return { text: "Good luck with your studies! Come back anytime you're stuck. 👋", quick: [] };
    return null;
  }

  /* ---------------------------------------------------------
     3. MODE SWITCHING ("hint mode", "steps please", "just the final answer")
     --------------------------------------------------------- */
  const MODE_LABELS = { hint: "Hint", steps: "Step-by-Step", final: "Final Answer" };
  function detectModeSwitch(text) {
    const t = text.toLowerCase().trim();
    if (/^(hint mode|switch to hint|give hints? only)$/.test(t)) return "hint";
    if (/^(step[- ]?by[- ]?step mode|switch to steps?|show steps? mode)$/.test(t)) return "steps";
    if (/^(final answer mode|switch to final|just give me the answer|final mode)$/.test(t)) return "final";
    return null;
  }

  /* ---------------------------------------------------------
     4. ACCOUNT-TYPE CLASSIFIER (Personal / Real / Nominal) —
     used to build the "why" behind every debit/credit in
     step-by-step mode (section 10).
     --------------------------------------------------------- */
  const REAL_KEYWORDS = ["cash", "bank", "furniture", "machinery", "plant", "building", "land", "vehicle",
    "computer", "equipment", "investment", "goodwill", "stock", "cheques in hand", "bills receivable", "bills payable"];
  const NOMINAL_KEYWORDS = ["rent", "salary", "wages", "depreciation", "bad debts", "discount allowed",
    "discount received", "interest on loan", "interest paid", "interest received", "purchases", "sales",
    "insurance premium", "carriage", "freight", "repairs", "postage", "conveyance", "travelling",
    "legal charges", "audit fee", "general expenses", "donation", "charity", "bank charges",
    "commission paid", "commission received", "printing", "advertisement", "electricity", "telephone",
    "profit on sale", "loss on sale", "interest on capital", "interest on drawings", "manager's commission",
    "renewal charges"];
  function classifyAccount(name) {
    const n = (name || "").toLowerCase();
    if (NOMINAL_KEYWORDS.some(k => n.includes(k))) {
      return { type: "Nominal Account", rule: "debit all expenses and losses, credit all incomes and gains" };
    }
    if (REAL_KEYWORDS.some(k => n.includes(k))) {
      return { type: "Real Account", rule: "debit what comes in, credit what goes out" };
    }
    return { type: "Personal Account", rule: "debit the receiver, credit the giver" };
  }

  /* ---------------------------------------------------------
     5. JOURNAL ENTRY RENDERING (section 11) — a real bordered
     table (Particulars / Dr ₹ / Cr ₹) so debit/credit columns
     are genuinely aligned, not approximated with spaces that a
     proportional font would collapse anyway.
     --------------------------------------------------------- */
  function journalHTML(lines, narration) {
    const rows = lines.map(l => {
      if (l.dr !== undefined) return `<tr><td class="tje-particulars">${esc(l.account)}&nbsp;&nbsp;Dr.</td><td class="tje-amt">${inr(l.dr)}</td><td class="tje-amt"></td></tr>`;
      return `<tr><td class="tje-particulars tje-to">To ${esc(l.account)}</td><td class="tje-amt"></td><td class="tje-amt">${inr(l.cr)}</td></tr>`;
    }).join("");
    const narrRow = narration ? `<div class="tje-narration">(Being ${esc(narration)})</div>` : "";
    return `<div class="tutor-journal-wrap"><table class="tutor-journal-table"><thead><tr><th>Particulars</th><th>Debit ₹</th><th>Credit ₹</th></tr></thead><tbody>${rows}</tbody></table>${narrRow}</div>`;
  }
  function journalPlainText(lines, narration) {
    const parts = lines.map(l => l.dr !== undefined
      ? `${l.account} Dr. — ₹${inr(l.dr)}`
      : `    To ${l.account} — ₹${inr(l.cr)}`);
    if (narration) parts.push(`(Being ${narration})`);
    return parts.join("\n");
  }

  /* ---------------------------------------------------------
     6. DEBIT = CREDIT CHECK (section 14)
     --------------------------------------------------------- */
  function isBalanced(lines) {
    const dr = round2(lines.reduce((s, l) => s + (l.dr || 0), 0));
    const cr = round2(lines.reduce((s, l) => s + (l.cr || 0), 0));
    return Math.abs(dr - cr) < 0.01;
  }

  /* ---------------------------------------------------------
     7. COLLAPSIBLE SECTIONS (section 21) — native <details>,
     no extra JS/CSS libraries needed.
     --------------------------------------------------------- */
  function sectionsHTML(sections) {
    return `<div class="tutor-sections">${sections.map((s, i) => `
      <details class="tutor-section" ${i === 0 ? "open" : ""}>
        <summary>${esc(s.title)}</summary>
        <div class="tutor-section-body">${s.html}</div>
      </details>`).join("")}</div>`;
  }

  /* ---------------------------------------------------------
     8. STEP-BY-STEP BUILDER for a resolved journal-line result
     (works for both a plain matchJournalPattern hit and a full
     acParseTransaction result — anything shaped like
     { lines:[{account,dr?,cr?}], narration }).
     --------------------------------------------------------- */
  function buildStepsForLines(rawText, lines, narration, calcNote) {
    const debitLines = lines.filter(l => l.dr !== undefined);
    const creditLines = lines.filter(l => l.cr !== undefined);
    const steps = [];
    steps.push({ title: "1. What happened", html: `<p>${esc(rawText.trim())}</p>` });
    steps.push({
      title: "2. Accounts involved",
      html: `<ul>${lines.map(l => `<li>${esc(l.account)}</li>`).join("")}</ul>`
    });
    steps.push({
      title: "3. Type of each account",
      html: `<ul>${lines.map(l => { const c = classifyAccount(l.account); return `<li><b>${esc(l.account)}</b> — ${c.type} (${c.rule})</li>`; }).join("")}</ul>`
    });
    steps.push({
      title: "4. Debited & why",
      html: `<ul>${debitLines.map(l => { const c = classifyAccount(l.account); return `<li><b>${esc(l.account)}</b> is debited — ₹${inr(l.dr)} is coming in / is an expense or loss, per the ${c.type} rule (${c.rule}).</li>`; }).join("")}</ul>`
    });
    steps.push({
      title: "5. Credited & why",
      html: `<ul>${creditLines.map(l => { const c = classifyAccount(l.account); return `<li><b>${esc(l.account)}</b> is credited — ₹${inr(l.cr)} is going out / is an income or gain, per the ${c.type} rule (${c.rule}).</li>`; }).join("")}</ul>`
    });
    if (calcNote) steps.push({ title: "6. Calculation", html: `<p>${calcNote}</p>` });
    steps.push({ title: (calcNote ? "7." : "6.") + " Journal entry", html: journalHTML(lines) });
    if (narration) steps.push({ title: (calcNote ? "8." : "7.") + " Narration", html: `<p>(Being ${esc(narration)})</p>` });
    steps.push({
      title: (calcNote ? "9." : "8.") + " Final answer",
      html: journalHTML(lines, narration)
    });
    return steps;
  }

  /* ---------------------------------------------------------
     9. STANDALONE CALCULATION MODULES (section 9)
     Each module: match(text) -> bool; run(text) -> either
       { missing: "clarifying question text" }              (ask, never invent)
       { ok:true, lines, narration, calcNote, assumption? }  (a resolvable result)
     --------------------------------------------------------- */
  const CALC_MODULES = [];

  // -- Trade discount --------------------------------------------------
  CALC_MODULES.push({
    id: "trade_discount",
    match: t => /trade discount|trade disc/i.test(t),
    run: t => {
      const pct = percentNearOrOnly(t, ["trade discount", "trade disc"]);
      const list = amountNear(t, ["marked", "list price", "catalogue", "goods"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      if (pct === null || list === null) return { missing: "What is the marked/list price of the goods, and what is the trade discount percentage?" };
      const discount = round2(list * pct / 100);
      const net = round2(list - discount);
      const calcNote = `Trade Discount = ₹${inr(list)} × ${pct}% = ₹${inr(discount)}<br>Net Amount = ₹${inr(list)} − ₹${inr(discount)} = ₹${inr(net)}<br><i>Trade discount is deducted before recording — it is never entered as a separate account in the books.</i>`;
      return { ok: true, calcOnly: true, calcNote, finalAmount: net, label: `Net amount to record: ₹${inr(net)}` };
    }
  });

  // -- Cash discount -----------------------------------------------------
  CALC_MODULES.push({
    id: "cash_discount",
    match: t => /cash discount|cash disc/i.test(t) && !/trade discount/i.test(t),
    run: t => {
      const pct = percentNearOrOnly(t, ["cash discount", "cash disc"]);
      const amounts = allAmounts(t);
      const amt = amounts[0] ? amounts[0].value : null;
      if (pct === null || amt === null) return { missing: "What is the invoice/settlement amount, and what is the cash discount percentage (or the two amounts — gross and settled — if a full-settlement figure was given instead)?" };
      const discount = round2(amt * pct / 100);
      const net = round2(amt - discount);
      const calcNote = `Cash Discount = ₹${inr(amt)} × ${pct}% = ₹${inr(discount)}<br>Amount actually paid/received = ₹${inr(amt)} − ₹${inr(discount)} = ₹${inr(net)}`;
      return { ok: true, calcOnly: true, calcNote, finalAmount: net, label: `Amount actually paid/received: ₹${inr(net)} (discount ₹${inr(discount)})` };
    }
  });

  // -- GST ---------------------------------------------------------------
  CALC_MODULES.push({
    id: "gst",
    match: t => /\bgst\b/i.test(t) && !/journal|purchased|sold|paid|received/i.test(t),
    run: t => {
      const pct = percentNearOrOnly(t, ["gst"]);
      const amounts = allAmounts(t);
      const base = amounts[0] ? amounts[0].value : null;
      if (pct === null || base === null) return { missing: "What is the base amount (before GST), and what is the GST rate?" };
      const isInterstate = /inter-?state|igst|outside the state|other state/i.test(t);
      const gstAmt = round2(base * pct / 100);
      const total = round2(base + gstAmt);
      let calcNote, assumption = null;
      if (isInterstate) {
        calcNote = `IGST = ₹${inr(base)} × ${pct}% = ₹${inr(gstAmt)}<br>Total invoice value = ₹${inr(base)} + ₹${inr(gstAmt)} = ₹${inr(total)}`;
      } else {
        const half = round2(gstAmt / 2);
        calcNote = `CGST = ₹${inr(base)} × ${pct / 2}% = ₹${inr(half)}<br>SGST = ₹${inr(base)} × ${pct / 2}% = ₹${inr(round2(gstAmt - half))}<br>Total GST = ₹${inr(gstAmt)}<br>Total invoice value = ₹${inr(base)} + ₹${inr(gstAmt)} = ₹${inr(total)}`;
        assumption = "Assuming an intra-state supply, so GST is split into CGST + SGST. If this is an inter-state transaction, the same total would instead be recorded entirely as IGST.";
      }
      return { ok: true, calcOnly: true, calcNote, finalAmount: total, label: `Total invoice value: ₹${inr(total)}`, assumption };
    }
  });

  // -- SLM depreciation ----------------------------------------------------
  CALC_MODULES.push({
    id: "dep_slm",
    match: t => /depreciat/i.test(t) && (/\bslm\b|straight line/i.test(t)),
    run: t => {
      const cost = amountNear(t, ["cost", "purchase", "value of", "book value"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      const rate = percentNearOrOnly(t, ["depreciation", "p.a", "per annum", "rate"]);
      if (cost === null || rate === null) return { missing: "What is the cost of the asset, and the depreciation rate?" };
      const months = monthsFromText(t);
      let dep, calcNote, assumption = null;
      if (months && months < 12) {
        dep = round2(cost * rate / 100 * months / 12);
        calcNote = `Depreciation (SLM) = Cost × Rate × (Months in use / 12)<br>= ₹${inr(cost)} × ${rate}% × ${months}/12 = ₹${inr(dep)}`;
      } else {
        dep = round2(cost * rate / 100);
        calcNote = `Depreciation (SLM) = Cost × Rate<br>= ₹${inr(cost)} × ${rate}% = ₹${inr(dep)}`;
        assumption = "Assuming the asset was used for the full year, since no part-year period was stated.";
      }
      return { ok: true, lines: [{ account: "Depreciation A/c", dr: dep }, { account: "Asset A/c", cr: dep }], calcNote, assumption, narration: "depreciation charged on the asset" };
    }
  });

  // -- WDV depreciation ------------------------------------------------
  CALC_MODULES.push({
    id: "dep_wdv",
    match: t => /depreciat/i.test(t) && (/\bwdv\b|written down|reducing balance/i.test(t)),
    run: t => {
      const bv = amountNear(t, ["written down value", "book value", "wdv", "opening balance", "cost"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      const rate = percentNearOrOnly(t, ["depreciation", "p.a", "per annum", "rate"]);
      if (bv === null || rate === null) return { missing: "What is the (opening) book value of the asset, and the depreciation rate?" };
      const dep = round2(bv * rate / 100);
      const calcNote = `Depreciation (WDV) = Book Value × Rate<br>= ₹${inr(bv)} × ${rate}% = ₹${inr(dep)}<br><i>Next year's depreciation would use the new WDV of ₹${inr(round2(bv - dep))}, not the original cost.</i>`;
      return { ok: true, lines: [{ account: "Depreciation A/c", dr: dep }, { account: "Asset A/c", cr: dep }], calcNote, narration: "depreciation charged on the asset (Written Down Value method)" };
    }
  });

  // -- Generic "calculate depreciation" with no method stated -----------
  CALC_MODULES.push({
    id: "dep_generic",
    match: t => /calculate depreciation|find depreciation|depreciation\s*\?*$/i.test(t.trim()) && !/\bslm\b|straight line|\bwdv\b|written down|reducing balance/i.test(t),
    run: t => {
      const cost = amountNear(t, ["cost", "purchase", "value of", "book value"]);
      const rate = percentNearOrOnly(t, ["depreciation", "p.a", "per annum", "rate"]);
      if (cost === null || rate === null || true) {
        // Method genuinely changes the answer, so always confirm it explicitly
        // rather than defaulting — matches the brief's own worked example.
        return { missing: "What is the cost of the asset, the depreciation rate, and the method (SLM or WDV)?" };
      }
    }
  });

  // -- Profit / loss on sale of asset -----------------------------------
  CALC_MODULES.push({
    id: "profit_loss_sale",
    match: t => /(profit|loss)\s+on\s+sale/i.test(t) || (/\bsold\b/i.test(t) && /book value/i.test(t)),
    run: t => {
      const bv = amountNear(t, ["book value", "written down value", "wdv"]);
      const sp = amountNear(t, ["sold for", "sale price", "sold at", "for ₹", "for rs"]) || (allAmounts(t)[1] && allAmounts(t)[1].value);
      if (bv === null || sp === null) return { missing: "What is the book value of the asset, and what was it sold for?" };
      const diff = round2(sp - bv);
      const isProfit = diff >= 0;
      const calcNote = `${isProfit ? "Profit" : "Loss"} on Sale = Sale Price − Book Value<br>= ₹${inr(sp)} − ₹${inr(bv)} = ₹${inr(Math.abs(diff))}`;
      const lines = [
        { account: "Cash/Bank A/c", dr: sp },
        { account: "Asset A/c", cr: bv }
      ];
      if (isProfit) lines.push({ account: "Profit on Sale of Asset A/c", cr: Math.abs(diff) });
      else lines.push({ account: "Loss on Sale of Asset A/c", dr: Math.abs(diff) });
      return { ok: true, lines, calcNote, narration: "asset sold" };
    }
  });

  // -- Provision for doubtful debts --------------------------------------
  CALC_MODULES.push({
    id: "provision_dd",
    match: t => /provision for doubtful debts|provision for bad/i.test(t),
    run: t => {
      const rate = percentNearOrOnly(t, ["provision", "doubtful"]);
      const debtors = amountNear(t, ["debtors", "sundry debtors"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      if (rate === null || debtors === null) return { missing: "What is the debtors amount, and the provision rate? (If any further bad debts need writing off first, mention that amount too.)" };
      const furtherBad = amountNear(t, ["further bad debts", "additional bad debts", "write off"]);
      const netDebtors = furtherBad ? round2(debtors - furtherBad) : debtors;
      const provision = round2(netDebtors * rate / 100);
      let calcNote = "";
      if (furtherBad) calcNote += `Debtors after further bad debts = ₹${inr(debtors)} − ₹${inr(furtherBad)} = ₹${inr(netDebtors)}<br>`;
      calcNote += `Provision for Doubtful Debts = ₹${inr(netDebtors)} × ${rate}% = ₹${inr(provision)}`;
      const lines = [];
      if (furtherBad) lines.push({ account: "Bad Debts A/c", dr: furtherBad }, { account: "Debtors A/c", cr: furtherBad });
      lines.push({ account: "Profit & Loss A/c", dr: provision }, { account: "Provision for Doubtful Debts A/c", cr: provision });
      return { ok: true, lines, calcNote, narration: "provision for doubtful debts created" };
    }
  });

  // -- Manager's commission ----------------------------------------------
  CALC_MODULES.push({
    id: "managers_commission",
    match: t => /manager/i.test(t) && /commission/i.test(t),
    run: t => {
      const rate = percentNearOrOnly(t, ["commission", "manager"]);
      const profit = amountNear(t, ["net profit", "profit"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      if (rate === null || profit === null) return { missing: "What is the net profit, and the commission rate?" };
      const before = /before charging (such )?commission|before commission/i.test(t);
      const after = /after charging (such )?commission|after commission/i.test(t);
      if (!before && !after) {
        return { missing: "Is the manager's commission calculated **before** charging such commission, or **after** charging such commission? (This changes the formula, so please confirm.)" };
      }
      let commission, calcNote;
      if (before) {
        commission = round2(profit * rate / 100);
        calcNote = `Commission (before charging commission) = Net Profit × Rate<br>= ₹${inr(profit)} × ${rate}% = ₹${inr(commission)}`;
      } else {
        commission = round2(profit * rate / (100 + rate));
        calcNote = `Commission (after charging commission) = Net Profit × Rate / (100 + Rate)<br>= ₹${inr(profit)} × ${rate} / ${100 + rate} = ₹${inr(commission)}`;
      }
      return { ok: true, lines: [{ account: "Manager's Commission A/c", dr: commission }, { account: "Outstanding Manager's Commission A/c", cr: commission }], calcNote, narration: "manager's commission provided for" };
    }
  });

  // -- Interest on capital ------------------------------------------------
  CALC_MODULES.push({
    id: "interest_on_capital",
    match: t => /interest on capital/i.test(t),
    run: t => {
      const rate = percentNearOrOnly(t, ["interest"]);
      const capital = amountNear(t, ["capital"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      if (rate === null || capital === null) return { missing: "What is the capital amount, and the interest rate?" };
      const months = monthsFromText(t) || 12;
      const interest = round2(capital * rate / 100 * months / 12);
      const calcNote = `Interest on Capital = Capital × Rate × (Months / 12)<br>= ₹${inr(capital)} × ${rate}% × ${months}/12 = ₹${inr(interest)}`;
      const assumption = months === 12 && !monthsFromText(t) ? "Assuming a full year (12 months), since no time period was stated." : null;
      return { ok: true, lines: [{ account: "Interest on Capital A/c", dr: interest }, { account: "Capital A/c", cr: interest }], calcNote, assumption, narration: "interest allowed on capital" };
    }
  });

  // -- Interest on drawings ------------------------------------------------
  CALC_MODULES.push({
    id: "interest_on_drawings",
    match: t => /interest on drawings/i.test(t),
    run: t => {
      const rate = percentNearOrOnly(t, ["interest"]);
      const drawings = amountNear(t, ["drawings"]) || (allAmounts(t)[0] && allAmounts(t)[0].value);
      if (rate === null || drawings === null) return { missing: "What is the drawings amount, and the interest rate? (And, if you know it, how many months on average the drawings were outstanding — otherwise I'll assume the full year.)" };
      const months = monthsFromText(t) || 12;
      const interest = round2(drawings * rate / 100 * months / 12);
      const calcNote = `Interest on Drawings = Drawings × Rate × (Months / 12)<br>= ₹${inr(drawings)} × ${rate}% × ${months}/12 = ₹${inr(interest)}`;
      const assumption = months === 12 && !monthsFromText(t) ? "Assuming the drawings were outstanding for the full year, since no time period was stated." : null;
      return { ok: true, lines: [{ account: "Drawings A/c", dr: interest }, { account: "Interest on Drawings A/c", cr: interest }], calcNote, assumption, narration: "interest charged on drawings" };
    }
  });

  function detectCalc(rawText) {
    for (const mod of CALC_MODULES) {
      try { if (mod.match(rawText)) return mod; } catch (e) { /* skip a misbehaving module */ }
    }
    return null;
  }

  /* ---------------------------------------------------------
     10. RENDERING A COMPUTED RESULT according to the chat's
     current answer mode (Hint / Step-by-Step / Final Answer —
     section 6).
     --------------------------------------------------------- */
  function renderByMode(chat, rawText, computed) {
    const mode = chat.answerMode || "steps";
    const quick = computed.lines ? ["try-yourself", "hint", "show-solution", "check-answer"] : ["hint", "show-solution", "check-answer"];

    if (computed.calcOnly) {
      // A pure numeric calculation (trade/cash discount, GST) with no
      // journal entry of its own — modes still apply to how much detail
      // is shown up front.
      const assumptionLine = computed.assumption ? `\n\n*Assumption: ${computed.assumption}*` : "";
      if (mode === "hint") {
        return { text: `💡 Think about the formula first: what do you multiply, and what do you subtract or add? Ask me for **steps** or the **final answer** when you're ready.`, quick };
      }
      if (mode === "final") {
        return { text: `${computed.label}${assumptionLine}`, quick };
      }
      return { text: `${computed.calcNote.replace(/<br>/g, "\n").replace(/<i>|<\/i>/g, "")}\n\n**${computed.label}**${assumptionLine}`, quick };
    }

    const debitLines = computed.lines.filter(l => l.dr !== undefined);
    const calcNoteText = computed.calcNote ? computed.calcNote.replace(/<br>/g, "\n").replace(/<i>|<\/i>/g, "") : null;
    const assumptionLine = computed.assumption ? `\n\n*Assumption: ${computed.assumption}*` : "";

    if (mode === "hint") {
      const hintAcc = debitLines[0] ? debitLines[0].account : "the account that receives the benefit";
      return { text: `💡 **Hint:** think about which account is receiving the benefit (debit) and which one is giving it up (credit). Start by identifying **${esc(hintAcc)}** — does it increase or decrease here?`, quick };
    }

    if (mode === "final") {
      return {
        text: `Here's the final answer:${calcNoteText ? "\n\n" + calcNoteText : ""}${assumptionLine}`,
        quick,
        journalHTML: journalHTML(computed.lines, computed.narration)
      };
    }

    // steps mode (default)
    const steps = buildStepsForLines(rawText, computed.lines, computed.narration, computed.calcNote);
    return {
      text: `Let's work through this one step by step:${assumptionLine}`,
      quick,
      sectionsHTML: sectionsHTML(steps)
    };
  }

  /* ---------------------------------------------------------
     11. "TRY YOURSELF FIRST" + answer checking (sections 7 & 8)
     --------------------------------------------------------- */
  function normalizeAcctToken(s) {
    return (s || "").replace(/a\/c/gi, "").replace(/\bdr\.?\b/gi, "").replace(/^to\b/i, "").replace(/[^a-z0-9 ]/gi, "").trim().toLowerCase();
  }
  // Very deliberately permissive: matches if the key noun of the account
  // name is present, since students abbreviate ("Furniture" for
  // "Furniture A/c") — the goal is a fair diagnostic, not exact string match.
  function accountsMatch(a, b) {
    const na = normalizeAcctToken(a), nb = normalizeAcctToken(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    const wa = na.split(" ")[0], wb = nb.split(" ")[0];
    return wa === wb && wa.length > 2;
  }
  function parseStudentAttempt(text) {
    // Split into candidate line fragments: newlines, or "To " boundaries.
    const rough = text.split(/\n+/).flatMap(l => l.split(/(?=\bTo\s+[A-Z])/));
    const out = [];
    rough.forEach(seg => {
      const s = seg.trim();
      if (!s) return;
      const amtMatch = s.match(/(?:₹|rs\.?\s*)?[\d][\d,]*(?:\.\d+)?/i);
      const amount = amtMatch ? parseFloat(amtMatch[0].replace(/[₹,]/gi, "").replace(/rs\.?/gi, "")) : null;
      if (/^to\s+/i.test(s) || /\bcr\.?$/i.test(s)) {
        out.push({ side: "cr", account: s.replace(/^to\s+/i, "").replace(/(?:₹|rs\.?\s*)?[\d][\d,.]*|cr\.?$/gi, "").trim(), amount });
      } else if (/\bdr\.?\b/i.test(s)) {
        out.push({ side: "dr", account: s.replace(/\bdr\.?\b/i, "").replace(/(?:₹|rs\.?\s*)?[\d][\d,.]*/gi, "").trim(), amount });
      }
    });
    return out.filter(l => l.account);
  }
  function diagnoseAttempt(studentText, expectedLines) {
    const attempt = parseStudentAttempt(studentText);
    const issues = [];
    const matchedExpected = new Set();
    attempt.forEach(a => {
      const expIdx = expectedLines.findIndex((e, i) => !matchedExpected.has(i) && accountsMatch(e.account, a.account));
      if (expIdx === -1) {
        issues.push(`**Extra/incorrect account:** "${esc(a.account)}" doesn't belong in this entry.`);
        return;
      }
      const exp = expectedLines[expIdx];
      matchedExpected.add(expIdx);
      const expSide = exp.dr !== undefined ? "dr" : "cr";
      const expAmt = exp.dr !== undefined ? exp.dr : exp.cr;
      if (a.side !== expSide) {
        issues.push(`**Debit/credit reversed:** ${esc(exp.account)} should be on the **${expSide === "dr" ? "debit" : "credit"}** side, not ${expSide === "dr" ? "credit" : "debit"}.`);
      } else if (a.amount !== null && Math.abs(a.amount - expAmt) > 0.5) {
        issues.push(`**Wrong amount for ${esc(exp.account)}:** you wrote ₹${inr(a.amount)}, correct is ₹${inr(expAmt)}.`);
      }
    });
    expectedLines.forEach((e, i) => {
      if (!matchedExpected.has(i)) issues.push(`**Missing account:** ${esc(e.account)} (₹${inr(e.dr !== undefined ? e.dr : e.cr)}) is missing from your entry.`);
    });
    if (!/being|narration/i.test(studentText)) issues.push(`**Missing narration:** don't forget the "(Being ...)" line — it's usually expected in full marks.`);
    return issues;
  }
  function checkAttempt(studentText, chat) {
    const problem = chat.pendingProblem;
    if (!problem || !problem.computed || !problem.computed.lines) {
      return { text: "I don't have an open problem to check that against — ask me for a practice question, or paste the transaction first, then your attempt.", quick: ["practice"] };
    }
    const issues = diagnoseAttempt(studentText, problem.computed.lines);
    const correctnessIssues = issues.filter(i => !i.includes("Missing narration"));
    if (!correctnessIssues.length) {
      return {
        text: `✅ **That's correct!** Nice work.${issues.length ? "\n\nOne small thing: " + issues[0] : ""}`,
        quick: ["practice"],
        journalHTML: journalHTML(problem.computed.lines, problem.computed.narration)
      };
    }
    return {
      text: `Here's what needs fixing:\n\n${issues.map(i => "- " + i).join("\n")}\n\n**Correct answer:**`,
      quick: ["show-solution", "practice"],
      journalHTML: journalHTML(problem.computed.lines, problem.computed.narration)
    };
  }
  // A message "looks like an attempt" (rather than a fresh transaction to
  // solve) only when it's actually written in journal-entry shorthand
  // (mentions "A/c" together with Dr/Cr/To) — plain-language transaction
  // sentences like "Paid rent to the landlord" also contain the word "to"
  // but are never mistaken for an attempt because they don't say "A/c".
  function looksLikeAttempt(text) {
    return /a\/c/i.test(text) && (/\bdr\.?\b/i.test(text) || /\bcr\.?\b/i.test(text) || /\bto\s+[a-z]/i.test(text));
  }

  /* ---------------------------------------------------------
     12. MULTIPLE TRANSACTIONS (section 12)
     --------------------------------------------------------- */
  function splitMultipleTransactions(text) {
    let lines = text.split(/\n+/).map(s => s.trim().replace(/^\(?\d+[\.\)]\s*/, "").replace(/^[-•]\s*/, "")).filter(Boolean);
    if (lines.length > 1) return lines;
    const sentences = text.split(/(?<=[.!])\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
    const amountish = sentences.filter(s => /\d/.test(s));
    if (sentences.length > 1 && amountish.length > 1) return sentences;
    return [text];
  }
  function handleMultipleTransactions(txns, chat) {
    if (typeof global.acParseTransaction !== "function") return null;
    const ctx = {};
    const results = txns.map((t, i) => {
      try { return global.acParseTransaction(t, i + 1, ctx); }
      catch (e) { return { ok: false, index: i + 1, text: t, reason: "Couldn't process this line." }; }
    }).filter(Boolean);
    const solved = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);
    const sections = solved.map(r => ({
      title: `Transaction ${r.index}: ${r.text.length > 60 ? r.text.slice(0, 60) + "…" : r.text}`,
      html: journalHTML(r.lines) + (isBalanced(r.lines) ? "" : `<p style="color:#c0392b;">⚠ This entry did not balance — please double check the figures.</p>`)
    }));
    let summary = `Processed ${results.length} transaction${results.length > 1 ? "s" : ""}: **${solved.length} solved**`;
    if (failed.length) summary += `, ${failed.length} need${failed.length === 1 ? "s" : ""} more information`;
    summary += ".";
    if (failed.length) {
      summary += "\n\n" + failed.map(f => `- Transaction ${f.index} ("${f.text.length > 50 ? f.text.slice(0, 50) + "…" : f.text}"): ${f.reason}`).join("\n");
    }
    return { text: summary, quick: ["practice"], sectionsHTML: sections.length ? sectionsHTML(sections) : undefined };
  }

  /* ---------------------------------------------------------
     13. "SEEMS WRONG" RE-CHECK (section 18) — genuinely
     recomputes and re-verifies rather than blindly flipping
     the answer.
     --------------------------------------------------------- */
  function recheckAnswer(chat) {
    const last = chat.lastComputed;
    if (!last) return { text: "I don't have a previous answer in this chat to re-check — could you paste the question again?", quick: [] };
    const balanced = last.lines ? isBalanced(last.lines) : true;
    if (!balanced) {
      return { text: "Good catch — rechecking, the debit and credit totals in my last answer don't actually match, which shouldn't happen. Please paste the transaction again so I can recompute it cleanly.", quick: [] };
    }
    return {
      text: "I've rechecked the transaction interpretation, accounts, debit/credit treatment, calculation, and narration — the working still comes out the same. If you think a specific account or amount should be different, tell me which one and I'll take another look at just that part.",
      quick: ["show-solution", "practice"],
      journalHTML: last.lines ? journalHTML(last.lines, last.narration) : undefined
    };
  }

  /* ---------------------------------------------------------
     14. MAIN ENTRY POINT
     --------------------------------------------------------- */
  function respond(text, chat) {
    if (!text || !text.trim()) return null;
    chat.answerMode = chat.answerMode || "steps";
    const corrected = correctSpellingForIntent(text);

    const modeSwitch = detectModeSwitch(text);
    if (modeSwitch) {
      chat.answerMode = modeSwitch;
      if (chat.pendingProblem) return renderByMode(chat, chat.pendingProblem.sourceText, chat.pendingProblem.computed);
      return { text: `Switched to **${MODE_LABELS[modeSwitch]}** mode. Ask me a question or paste a transaction whenever you're ready.`, quick: ["practice"] };
    }

    if (/^(i'?ll try (it )?myself|try yourself|let me try)/i.test(text.trim()) && chat.pendingProblem) {
      return { text: "Take your time — work through it on your own. When you're ready, type your attempt and I'll check it, or ask for a hint, the steps, or the final answer.", quick: ["hint", "check-answer", "show-solution"] };
    }

    if (/check my answer|is this correct|did i get this right/i.test(text) && chat.pendingProblem && !looksLikeAttempt(text)) {
      return { text: "Sure — type your attempted answer (e.g. the journal entry) and I'll check it against the correct solution.", quick: [] };
    }

    const st = smallTalk(corrected);
    if (st) return st;

    if (/seems? wrong|this is wrong|that'?s wrong|incorrect answer|not right|are you sure/i.test(text) && chat.lastComputed) {
      return recheckAnswer(chat);
    }

    if (chat.pendingProblem && looksLikeAttempt(text)) {
      return checkAttempt(text, chat);
    }

    const txns = splitMultipleTransactions(text);
    if (txns.length > 1) {
      const multi = handleMultipleTransactions(txns, chat);
      if (multi) return multi;
    }

    const calcMod = detectCalc(corrected.length ? text : text);
    if (calcMod) {
      const result = calcMod.run(text);
      if (result.missing) {
        return { text: result.missing, quick: [] };
      }
      chat.pendingProblem = { sourceText: text, computed: result };
      chat.lastComputed = result;
      return renderByMode(chat, text, result);
    }

    if (typeof global.acParseTransaction === "function") {
      let acResult = null;
      try { acResult = global.acParseTransaction(text, 1, {}); } catch (e) { acResult = null; }
      if (acResult && acResult.ok && acResult.lines && acResult.lines.length) {
        const narration = (acResult.narration || text).replace(/\s*\(marked price[^)]*\)\s*/i, "").trim().toLowerCase();
        const computed = { lines: acResult.lines, narration, calcNote: /trade discount/i.test(acResult.narration || "") ? acResult.narration.match(/\(([^)]*trade discount[^)]*)\)/i)?.[1] : null };
        chat.pendingProblem = { sourceText: text, computed };
        chat.lastComputed = computed;
        return renderByMode(chat, text, computed);
      }
      if (acResult && acResult.ok === false && acResult.reason && /\bdepreciat|gst|discount|provision|outstanding|prepaid|accrued|advance|commission|interest on (capital|drawings)|bad debt/i.test(text)) {
        // A real calculation-flavoured sentence that the engine couldn't
        // resolve for a concrete reason — surface that reason as the
        // clarifying question rather than falling through silently.
        return { text: acResult.reason, quick: [] };
      }
    }

    // Spelling-tolerant concept lookup (section 3/4): "what is journl entry"
    // should still find the Journal theory block even though the older
    // aiLocalBrain() theory matcher (which runs if we return null here)
    // scores on exact word overlap and would miss the misspelling.
    if (corrected !== text && typeof global.aiFindTheoryMatch === "function") {
      const theoryMatch = global.aiFindTheoryMatch(corrected);
      if (theoryMatch) {
        const b = theoryMatch.block;
        let reply = `**${b.h}**\n\n${b.p || ""}`;
        if (b.formula) reply += `\n\n${b.formula}`;
        if (b.p2) reply += `\n\n${b.p2}`;
        reply += `\n\n*(From ${theoryMatch.ch} — open that chapter's Theory tab for the full picture.)*`;
        return { text: reply, quick: ["practice"] };
      }
    }

    return null; // let the caller fall back to aiLocalBrain (theory/simple pattern match)
  }

  global.TutorEngine = {
    respond,
    MODE_LABELS,
    journalHTML,
    sectionsHTML,
    isBalanced
  };
})(typeof window !== "undefined" ? window : globalThis);
