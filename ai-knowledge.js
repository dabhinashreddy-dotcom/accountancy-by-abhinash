/* ============================================================
   AI TUTOR — WEBSITE KNOWLEDGE LAYER  (ai-knowledge.js)
   ------------------------------------------------------------
   One file, two environments:
     * browser  -> window.AIKnowledge   (offline fallback + Ask AI)
     * Node     -> require("./ai-knowledge.js")  (Netlify function)

   It builds a search index DIRECTLY from the site's existing
   data (APP_DATA in data.js, plus the Formula Sheet that lives in
   app.js). Nothing is copied into a second database: if a
   question or theory block is edited in data.js, the AI Tutor
   sees the change on the next load.

   PIPELINE (see buildContext):
     question -> classify (type + chapter) -> exact/variant lookup
              -> BM25 search over chapters + question banks
              -> deterministic facts (ai-calc.js)
              -> audit of stored answers (conflict detection)
              -> small, bounded context for the model / offline reply

   Retrieval priority (spec §30):
     1 exact question in site data      4 accounting rules + calculation
     2 chapter content / examples       5 general model knowledge
     3 related question-bank items
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ai-calc.js"));
  else root.AIKnowledge = factory(root.AICalc);
})(typeof self !== "undefined" ? self : this, function (Calc) {
  "use strict";

  /* =========================================================
     1. TEXT UTILITIES
     ========================================================= */
  const STOP = new Set("a an the is are was were be been being of in on at to for and or but if then than that this these those it its as by with from into about what which who whom whose how why when where does do did done can could should would will shall may might me my we our you your i he she they them their there here so such also very just not no yes please tell explain give show find solve answer question work works worked simply simple briefly detail".split(" "));

  function stem(w) {
    if (w.length <= 3) return w;
    return w
      .replace(/(ies)$/, "y")
      .replace(/(sses)$/, "ss")
      .replace(/(ing|edly|ed|ly|es|s)$/, m => (w.length - m.length >= 3 ? "" : m))
      .replace(/(.)\1$/, "$1");
  }
  function stripHtml(s) { return String(s == null ? "" : s).replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }
  function normNumbers(s) { return String(s).replace(/(\d),(?=\d)/g, "$1"); }
  function tokenize(text, keepStop) {
    const t = normNumbers(stripHtml(text)).toLowerCase().replace(/₹/g, " rs ").replace(/[^a-z0-9.%\s]/g, " ").replace(/\.(?!\d)/g, " ");
    const out = [];
    t.split(/\s+/).forEach(w => {
      if (!w) return;
      if (/^\d/.test(w)) return; // numbers are handled separately (exact matching), not as BM25 terms
      w = w.replace(/%$/, "");
      if (!w) return;
      if (!keepStop && (STOP.has(w) || w.length < 2)) return;
      out.push(stem(w));
    });
    return out;
  }
  function numbersIn(text) {
    const t = normNumbers(stripHtml(text));
    const out = []; const re = /\d+(?:\.\d+)?/g; let m;
    while ((m = re.exec(t))) out.push(parseFloat(m[0]));
    return out.sort((a, b) => a - b);
  }
  function sameNumbers(a, b) { return a.length === b.length && a.every((v, i) => v === b[i]); }
  function clip(s, n) { s = String(s == null ? "" : s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; }
  function inr(n) { return Calc ? Calc.inr(n) : "₹" + n; }
  // The TB-checkpoint classify card (app.js) renders its amount with
  // `(c.amount).toLocaleString("en-IN")`. When the same case is loaded into the
  // AI Tutor, describe() must reproduce that exact figure — with the thousands
  // separators — so the attached context matches the card the student clicked.
  function grouped(n) { const v = Number(n); return isFinite(v) ? v.toLocaleString("en-IN") : String(n); }

  // Query-time synonyms (weight 0.5). Keys/values are stemmed at use.
  const SYNONYMS = {
    brs: ["bank", "reconciliation", "statement"], tb: ["trial", "balance"], gst: ["goods", "services", "tax"], slm: ["straight", "line", "method"],
    wdv: ["written", "down", "value"], dr: ["debit"], cr: ["credit"], pl: ["profit", "loss"], gaap: ["generally", "accepted", "accounting", "principles"],
    salary: ["wage", "expense", "nominal"], salaries: ["wage", "expense", "nominal"], wages: ["salary", "expense", "nominal"],
    rent: ["expense", "nominal"], debtor: ["customer", "receivable", "asset"], debtors: ["customer", "receivable", "asset"],
    creditor: ["supplier", "payable", "liability"], creditors: ["supplier", "payable", "liability"],
    passbook: ["pass", "book", "bank", "statement"], statement: ["pass", "book"], overdraft: ["negative", "credit", "balance"],
    diminishing: ["wdv", "written", "down", "value"], straight: ["slm", "line"], cgst: ["gst", "central"], sgst: ["gst", "state"], igst: ["gst", "inter"],
    drawing: ["drawings", "owner", "withdraw"], capital: ["owner", "investment"], goodwill: ["asset", "intangible"],
    cheque: ["bank", "deposit"], dishonour: ["dishonoured", "cheque", "bounce"], bounced: ["dishonoured", "cheque"],
    tally: ["agree", "trial", "balance"], tallies: ["agree", "trial", "balance"], mismatch: ["error", "disagree"],
    depreciate: ["depreciation"], accrual: ["accrued", "basis"], cash_basis: ["cash", "basis"],
    gaap: ["generally", "accepted", "principle"], prudence: ["conservatism"], conservatism: ["prudence"],
    invoice: ["bill", "gst", "taxable"], bill: ["invoice"], taxable: ["gst", "value"], freight: ["carriage", "cartage"], carriage: ["freight", "cartage"],
    settled: ["discount", "allowed", "settlement"], settlement: ["discount", "allowed"], settles: ["discount", "allowed"],
    purchase: ["purchases"], sale: ["sales"], return: ["returns"], "bad": ["bad", "debt"], provision: ["doubtful", "debt"],
    ledger: ["posting", "account"], journal: ["entry", "narration"], narration: ["journal"],
    asset: ["assets", "debit"], liability: ["liabilities", "credit"], expense: ["expenses", "nominal", "debit"], income: ["incomes", "nominal", "credit"]
  };

  // Chapter detection keywords (accounting vocabulary layer, §28/§29).
  const CHAPTER_KEYWORDS = {
    tb: ["trial balance", "debit balance", "credit balance", "tally", "agree", "error of omission", "error of principle", "compensating error", "casting error", "suspense", "checkpoint"],
    dep: ["depreciation", "depletion", "amortisation", "slm", "wdv", "straight line", "written down value", "residual value", "scrap value", "diminishing"],
    gst: ["gst", "cgst", "sgst", "igst", "input tax", "output tax", "taxable value", "invoice value", "bill detective"],
    brs: ["bank reconciliation", "brs", "pass book", "passbook", "unpresented", "uncollected", "dishonour", "overdraft", "reconcil"],
    sp2: ["purchases book", "sales book", "purchases return", "sales return", "returns outward", "returns inward", "journal proper", "debit note", "credit note"],
    cb: ["cash book", "petty cash", "contra entry", "imprest", "cash discount", "three column", "double column", "bank column"],
    lg: ["ledger", "posting", "balancing", "t-account", "balance c/d", "balance b/d"],
    jr: ["journal", "narration", "compound entry", "journal entry", "pass the entry", "pass journal"],
    dc: ["debit", "credit", "golden rule", "personal account", "real account", "nominal account", "balance sheet"],
    eq: ["accounting equation", "assets = ", "capital = ", "liabilities = "],
    basis: ["cash basis", "accrual basis", "basis of accounting", "outstanding expense", "prepaid expense", "accrued income", "advance income", "income received in advance"],
    tbase: ["going concern", "business entity", "money measurement", "cost concept", "dual aspect", "matching", "materiality", "consistency", "conservatism", "accounting standard", "ind as", "gaap", "concept detective"],
    terms: ["debtor", "creditor", "drawings", "solvent", "insolvent", "voucher", "trade discount", "term detective", "basic accounting terms"],
    intro: ["meaning of accounting", "book-keeping", "bookkeeping", "objectives of accounting", "users of accounting", "qualitative characteristics", "accounting information"],
    pres: ["provision", "provisions", "reserve", "reserves", "capital reserve", "revenue reserve", "general reserve", "sinking fund", "secret reserve", "contingency reserve", "charge against profit", "appropriation of profit"],
    roe: ["rectification", "rectify", "rectifying entry", "correcting entry", "error detective", "error of commission", "wrong account", "trial balance disagrees", "find the error", "suspense account"],
    fs: ["trading account", "profit and loss account", "financial statements", "gross profit", "net profit", "cost of goods sold", "closing stock", "sole proprietorship", "direct expense", "indirect expense", "statement builder"],
    adj: ["adjustment", "adjustments", "two effects", "both effects", "additional information", "adjustment studio", "outstanding expense", "prepaid expense", "accrued income", "income received in advance", "prepaid insurance"],
    /* v83 — Class 12 chapters */
    pf: ["partnership", "partnership deed", "profit and loss appropriation", "guarantee of profit", "fixed capital", "fluctuating capital", "appropriation account"],
    gw: ["goodwill", "super profit", "capitalised value", "average profit method", "valuation of goodwill", "normal profit", "years of purchase"],
    psr: ["profit sharing ratio", "sacrificing ratio", "gaining ratio", "new profit sharing ratio", "change in profit sharing", "revaluation", "cumulative effect"],
    adm: ["admission of a partner", "new partner", "revaluation account", "revalue", "capital adjustment", "premium for goodwill", "admission"],
    ret: ["retirement", "deceased partner", "settling the account", "share of profit up to date", "loan account of retiring partner", "gain ratio"],
    dis: ["dissolution", "realisation account", "dissolution of firm", "settlement of liabilities", "assets realised", "deficiency"],
    sc: ["share capital", "issue of shares", "forfeiture", "forfeited shares", "allotment", "calls in arrears", "calls in advance", "securities premium", "share forfeited", "under subscription"],
    deb: ["debentures", "debenture interest", "issue of debentures", "debentures issued at discount", "writing off loss on issue", "collateral security", "debentures for consideration"],
    cfin: ["schedule iii", "company accounts", "statement of profit and loss", "balance sheet of company", "notes to accounts", "divisible profit"],
    fsa: ["comparative statement", "common size statement", "horizontal analysis", "vertical analysis", "financial statement analysis", "comparative common size"],
    rat: ["accounting ratios", "liquidity ratio", "solvency ratio", "activity ratio", "profitability ratio", "current ratio", "quick ratio", "gross profit ratio", "debt equity"],
    cf: ["cash flow", "cash flow statement", "operating activities", "investing activities", "financing activities", "indirect method", "as 3"],
    ca: ["computerised accounting", "spreadsheet", "excel", "account heads", "voucher entry", "data validation", "graph and chart", "system security", "cas"]
  };
  function detectChapterByKeywords(text) {
    const l = String(text || "").toLowerCase();
    let best = null, bestN = 0;
    Object.keys(CHAPTER_KEYWORDS).forEach(ch => {
      const n = CHAPTER_KEYWORDS[ch].filter(k => l.includes(k)).length;
      if (n > bestN) { bestN = n; best = ch; }
    });
    return best;
  }

  /* =========================================================
     2. QUESTION ADAPTERS  (raw data item -> canonical shape)
     ---------------------------------------------------------
     Canonical question:
       { id, srcKey, section, chapterId, chapterName, kind,
         text, options?, correctIndex?, correctText?, answer?,
         explanation?, steps?, extra{}, raw }
     The SAME adapter is used when indexing the whole site and
     when a student clicks "Ask AI" on a rendered question, so
     the two can never drift apart.
     ========================================================= */
  function mcqFields(q) {
    const idx = q.answerIndex != null ? q.answerIndex : q.correctIndex;
    return { options: q.options || null, correctIndex: idx, correctText: q.options && idx != null ? q.options[idx] : null };
  }
  const SOURCES = {
    "intro.numericals": { section: "Practice Bank", chapter: "intro", kind: "mcq", list: d => d.intro.numericals, text: q => q.question },
    "terms.numericals": { section: "Practice Bank", chapter: "terms", kind: "mcq", list: d => d.terms.numericals, text: q => q.question },
    "tbase.numericals": { section: "Practice Bank", chapter: "tbase", kind: "mcq", list: d => d.tbase.numericals, text: q => q.question },
    "basis.numericals": { section: "Practice Bank", chapter: "basis", kind: "mcq", list: d => d.basis.numericals, text: q => q.question },
    "equation.numericals": { section: "Practice Bank", chapter: "eq", kind: "equation", list: d => d.equation.numericals },
    "debitCredit.numericals": { section: "Practice Bank", chapter: "dc", kind: "dc", list: d => d.debitCredit.numericals },
    "debitCredit.balanceSheetQuestions": { section: "Balance Sheet Questions", chapter: "dc", kind: "equation", list: d => d.debitCredit.balanceSheetQuestions },
    "debitCredit.balanceSheetStatements": { section: "Balance Sheet Statements", chapter: "dc", kind: "bsstatement", list: d => d.debitCredit.balanceSheetStatements },
    "debitCredit.commonMistakes": { section: "Common Mistakes", chapter: "dc", kind: "mistake", list: d => d.debitCredit.commonMistakes },
    "journal.numericals": { section: "Practice Bank", chapter: "jr", kind: "journal", list: d => d.journal.numericals },
    "journal.ledgerPostings": { section: "Journal → Ledger Practice", chapter: "jr", kind: "posting", list: d => d.journal.ledgerPostings },
    "ledger.practice": { section: "Journal → Ledger Practice", chapter: "lg", kind: "ledgerpractice", list: () => [], runtime: true }, // runtime pool (empty by design; see describe())
    "ledger.extraPracticeTransactions": { section: "Journal → Ledger Practice", chapter: "lg", kind: "journal", list: d => d.ledger.extraPracticeTransactions || [] },
    "ledger.examQuestions": { section: "Exam Questions", chapter: "lg", kind: "exam", list: d => flattenExam(d.ledger.examQuestions) },
    "cashBook.numericals": { section: "Practice Bank", chapter: "cb", kind: "txn", list: d => d.cashBook.numericals },
    "specialBooks2.numericals": { section: "Practice Bank", chapter: "sp2", kind: "txn", list: d => d.specialBooks2.numericals },
    "brs.numericals": { section: "Practice Bank", chapter: "brs", kind: "txn", list: d => d.brs.numericals },
    "brs.detective": { section: "BRS Detective", chapter: "brs", kind: "brs", list: d => d.brs.detective },
    "gst.numericals": { section: "Practice Bank", chapter: "gst", kind: "mcq", list: d => d.gst.numericals, text: q => q.question },
    "gst.detective": { section: "GST Bill Detective", chapter: "gst", kind: "gstbill", list: d => d.gst.detective },
    "tb.numericals": { section: "Practice Bank", chapter: "tb", kind: "mcq", list: d => d.tb.numericals, text: q => q.question },
    "tb.checkpoint": { section: "Trial Balance Checkpoint", chapter: "tb", kind: "tbcheck", list: d => d.tb.checkpoint },
    "dep.numericals": { section: "Practice Bank", chapter: "dep", kind: "mcq", list: d => d.dep.numericals, text: q => q.question },
    "pres.numericals": { section: "Practice Bank", chapter: "pres", kind: "mcq", list: d => d.pres.numericals, text: q => q.question },
    "roe.numericals": { section: "Practice Bank", chapter: "roe", kind: "mcq", list: d => d.roe.numericals, text: q => q.question },
    "fs.numericals": { section: "Practice Bank", chapter: "fs", kind: "mcq", list: d => d.fs.numericals, text: q => q.question },
    "adj.numericals": { section: "Practice Bank", chapter: "adj", kind: "mcq", list: d => d.adj.numericals, text: q => q.question },
    "pres.decisionLab": { section: "Decision Lab", chapter: "pres", kind: "mcq", list: d => flattenStepCases(d.pres.decisionLab), text: q => stepText(q) },
    "roe.auditCases": { section: "Error Detective", chapter: "roe", kind: "mcq", list: d => flattenStepCases(d.roe.auditCases), text: q => stepText(q) },
    "adj.adjustmentCases": { section: "Adjustment Studio", chapter: "adj", kind: "mcq", list: d => flattenStepCases(d.adj.adjustmentCases), text: q => stepText(q) },
    "fs.builderCases": { section: "Statement Builder", chapter: "fs", kind: "mcq", list: d => flattenBuilderPlacements(d.fs.builderCases), text: q => q.question },
    "terms.termDetective": { section: "Term Detective", chapter: "terms", kind: "mcq", list: d => d.terms.termDetective.cases, text: q => q.prompt, noId: true },
    "tbase.conceptDetective": { section: "Concept Detective", chapter: "tbase", kind: "mcq", list: d => d.tbase.conceptDetective.cases, text: q => q.prompt, noId: true },
    "basis.basisSwitch": { section: "Basis Switch", chapter: "basis", kind: "basisswitch", list: d => d.basis.basisSwitch.items },
    "basis.basisSwitch.checkpoints": { section: "Basis Switch", chapter: "basis", kind: "mcq", list: d => d.basis.basisSwitch.checkpoints, text: q => q.q, noId: true },
    "intro.actionLab": { section: "Accounting in Action", chapter: "intro", kind: "actionlab", list: d => flattenActionLab(d.intro.actionLab) },
    /* v83 — Class 12 chapter numericals, harvested exactly like the Class 11
       Practice Bank: they fill the tutor's "give me a question" pool for
       either class and, through the question -> document step below, they
       become searchable tutor content too. The guard keeps builds that do
       not load the Class 12 files (data.js-only test builds) at zero. */
    "pf.numericals": { section: "Practice Bank", chapter: "pf", kind: "mcq", list: d => (d.pf && d.pf.numericals) || [], text: q => q.question },
    "gw.numericals": { section: "Practice Bank", chapter: "gw", kind: "mcq", list: d => (d.gw && d.gw.numericals) || [], text: q => q.question },
    "psr.numericals": { section: "Practice Bank", chapter: "psr", kind: "mcq", list: d => (d.psr && d.psr.numericals) || [], text: q => q.question },
    "adm.numericals": { section: "Practice Bank", chapter: "adm", kind: "mcq", list: d => (d.adm && d.adm.numericals) || [], text: q => q.question },
    "ret.numericals": { section: "Practice Bank", chapter: "ret", kind: "mcq", list: d => (d.ret && d.ret.numericals) || [], text: q => q.question },
    "dis.numericals": { section: "Practice Bank", chapter: "dis", kind: "mcq", list: d => (d.dis && d.dis.numericals) || [], text: q => q.question },
    "sc.numericals": { section: "Practice Bank", chapter: "sc", kind: "mcq", list: d => (d.sc && d.sc.numericals) || [], text: q => q.question },
    "deb.numericals": { section: "Practice Bank", chapter: "deb", kind: "mcq", list: d => (d.deb && d.deb.numericals) || [], text: q => q.question },
    "cfin.numericals": { section: "Practice Bank", chapter: "cfin", kind: "mcq", list: d => (d.cfin && d.cfin.numericals) || [], text: q => q.question },
    "fsa.numericals": { section: "Practice Bank", chapter: "fsa", kind: "mcq", list: d => (d.fsa && d.fsa.numericals) || [], text: q => q.question },
    "rat.numericals": { section: "Practice Bank", chapter: "rat", kind: "mcq", list: d => (d.rat && d.rat.numericals) || [], text: q => q.question },
    "cf.numericals": { section: "Practice Bank", chapter: "cf", kind: "mcq", list: d => (d.cf && d.cf.numericals) || [], text: q => q.question },
    "ca.numericals": { section: "Practice Bank", chapter: "ca", kind: "mcq", list: d => (d.ca && d.ca.numericals) || [], text: q => q.question },
    /* v86 — the five Class 12 interactive activities (Journal Lab,
       Calculation Bench, Statement Builder, Classifier, Match-Up) are
       indexed case by case, so the "Ask Tutor" button on an activity
       card sends the exact case: its prompt, the model answer, the
       author's working and the chapter it belongs to. The section is
       resolved lazily from the registry, so the tutor quotes the
       activity's real title ("Appropriation Journal Lab", …) rather
       than a generic label. */
    "pf.activity":  { section: () => c12ActivityTitle("pf"),  chapter: "pf",  kind: "c12activity", list: d => flattenC12Activity(d.pf && d.pf.activity) },
    "gw.activity":  { section: () => c12ActivityTitle("gw"),  chapter: "gw",  kind: "c12activity", list: d => flattenC12Activity(d.gw && d.gw.activity) },
    "psr.activity": { section: () => c12ActivityTitle("psr"), chapter: "psr", kind: "c12activity", list: d => flattenC12Activity(d.psr && d.psr.activity) },
    "adm.activity": { section: () => c12ActivityTitle("adm"), chapter: "adm", kind: "c12activity", list: d => flattenC12Activity(d.adm && d.adm.activity) },
    "ret.activity": { section: () => c12ActivityTitle("ret"), chapter: "ret", kind: "c12activity", list: d => flattenC12Activity(d.ret && d.ret.activity) },
    "dis.activity": { section: () => c12ActivityTitle("dis"), chapter: "dis", kind: "c12activity", list: d => flattenC12Activity(d.dis && d.dis.activity) },
    "sc.activity":  { section: () => c12ActivityTitle("sc"),  chapter: "sc",  kind: "c12activity", list: d => flattenC12Activity(d.sc && d.sc.activity) },
    "deb.activity": { section: () => c12ActivityTitle("deb"), chapter: "deb", kind: "c12activity", list: d => flattenC12Activity(d.deb && d.deb.activity) },
    "cfin.activity":{ section: () => c12ActivityTitle("cfin"),chapter: "cfin",kind: "c12activity", list: d => flattenC12Activity(d.cfin && d.cfin.activity) },
    "fsa.activity": { section: () => c12ActivityTitle("fsa"), chapter: "fsa", kind: "c12activity", list: d => flattenC12Activity(d.fsa && d.fsa.activity) },
    "rat.activity": { section: () => c12ActivityTitle("rat"), chapter: "rat", kind: "c12activity", list: d => flattenC12Activity(d.rat && d.rat.activity) },
    "cf.activity":  { section: () => c12ActivityTitle("cf"),  chapter: "cf",  kind: "c12activity", list: d => flattenC12Activity(d.cf && d.cf.activity) },
    "ca.activity":  { section: () => c12ActivityTitle("ca"),  chapter: "ca",  kind: "c12activity", list: d => flattenC12Activity(d.ca && d.ca.activity) },
    "quiz": { section: "Quiz", chapter: null, kind: "mcq", list: d => d.quiz, text: q => q.q },
    "importantQuestions": { section: "Important Questions", chapter: null, kind: "iq", list: d => flattenIQ(d.importantQuestions) }
  };
  function flattenExam(eq) {
    const out = [];
    ["easy", "medium", "hard"].forEach(level => (eq && eq[level] || []).forEach((q, i) => out.push(Object.assign({ level, _i: level + "-" + (i + 1), _orig: q }, q))));
    return out;
  }
  function flattenIQ(iq) {
    const out = [];
    Object.keys(iq || {}).forEach(ch => (iq[ch] || []).forEach((q, i) => out.push(Object.assign({ chapterId: ch, _i: ch + "-" + (i + 1), _orig: q }, q))));
    return out;
  }
  function flattenActionLab(lab) {
    const out = [];
    (lab || []).forEach(sc => (sc.checkpoints || []).forEach((cp, i) => out.push({ id: `${sc.id}.${i + 1}`, scenario: sc, cp })));
    return out;
  }
  /* Chapters 15-18 activities. Each case carries a context plus 3-4 MCQ
     steps; flatten them into one question per step so the tutor can be
     asked about any single step of the interaction. */
  function flattenStepCases(cases) {
    const out = [];
    (cases || []).forEach(c => {
      const context = [c.title, c.concept, c.situation, c.adjustment, c.errorDescription]
        .filter(s => typeof s === "string" && s.trim()).join(" — ");
      (c.steps || c.questions || []).forEach((s, i) => out.push({
        id: `${c.id}.${i + 1}`,
        context,
        difficulty: c.difficulty || "",
        question: s.q,
        options: s.options,
        answerIndex: s.answerIndex,
        explanation: [s.reasoning, s.hint ? `Hint: ${s.hint}` : ""].filter(Boolean).join(" ")
      }));
    });
    return out;
  }
  function stepText(q) { return (q.context ? q.context + " — " : "") + (q.question || ""); }
  /* The Statement Builder asks where each figure belongs in the final
     accounts: five possible placements, one correct, with the reasoning
     stored as the note. */
  const BUILDER_PLACEMENT_LABELS = {
    "T-Dr": "Trading A/c — debit side",
    "T-Cr": "Trading A/c — credit side",
    "P-Dr": "Profit & Loss A/c — debit side",
    "BS-A": "Balance Sheet — assets side",
    "BS-L": "Balance Sheet — liabilities side"
  };
  const BUILDER_PLACEMENT_CODES = ["T-Dr", "T-Cr", "P-Dr", "BS-A", "BS-L"];
  function flattenBuilderPlacements(cases) {
    const out = [];
    (cases || []).forEach(c => (c.placements || []).forEach((p, i) => {
      out.push({
        id: `${c.id}.${i + 1}`,
        difficulty: c.difficulty || "",
        question: `In "${c.title}" (as on ${c.asOn}), where does this item go: ${p.label}?`,
        options: ["Trading A/c — Dr", "Trading A/c — Cr", "P&L A/c — Dr", "Balance Sheet — Asset", "Balance Sheet — Liability"],
        answerIndex: BUILDER_PLACEMENT_CODES.indexOf(p.answer),
        explanation: (BUILDER_PLACEMENT_LABELS[p.answer] ? BUILDER_PLACEMENT_LABELS[p.answer] + ". " : "") + (p.note || "")
      });
    }));
    return out;
  }

  /* =========================================================
     v86 — CLASS 12 ACTIVITY CASES (Ask Tutor on the five engines)
     The five Class 12 activity engines hand the tutor one CASE —
     the prompt, the answer key and the author's working — instead of
     the empty text a shapeless object would produce. The SAME
     normalizer runs when the index is built (whole chapter activity)
     and when a student clicks a single card, so the attached context
     can never differ from what the site indexed.
     ========================================================= */
  function c12ActivityTitle(chId) {
    try {
      if (typeof C12_DATA !== "undefined" && C12_DATA.content && C12_DATA.content[chId] &&
          C12_DATA.content[chId].activity && C12_DATA.content[chId].activity.title) {
        return C12_DATA.content[chId].activity.title;
      }
    } catch (e) { /* registry not loaded in this build — generic label */ }
    return "Interactive Activity";
  }
  /* Detects the engine from the case's own shape and returns the
     canonical { task, question, answer, explanation, extra }. An
     already-normalized object (from the index) passes straight
     through, so both call paths agree byte for byte. */
  function c12ActivityCase(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (raw.__c12act) return raw;
    const money = n => (typeof n === "number" ? inr(n) : n == null ? "" : String(n));
    const head = [raw.title, raw.prompt].filter(s => typeof s === "string" && s.trim()).join(" — ");
    if (Array.isArray(raw.dr) && typeof raw.drAccount === "string") {
      /* Engine 1 — Journal Lab */
      return {
        __c12act: true, task: "Pass the journal entry for this transaction",
        question: stripHtml(String(raw.prompt || "")),
        answer: `Dr ${raw.drAccount} — ₹${money(raw.amount)}; To ${raw.crAccount} — ₹${money(raw.amount)}`,
        explanation: stripHtml(raw.note || ""),
        extra: { debitChoices: (raw.dr || []).slice(), creditChoices: (raw.cr || []).slice(), amount: raw.amount }
      };
    }
    if (Array.isArray(raw.inputs) && raw.answers) {
      /* Engine 2 — Calculation Bench */
      const parts = (raw.inputs || []).map(inp =>
        `${stripHtml(String(inp.label))} = ${money((raw.answers || {})[inp.key])}`).filter(s => !/=\s*$/.test(s));
      return {
        __c12act: true, task: "Compute the figure(s) this problem asks for",
        question: stripHtml(String(raw.prompt || "")) + (raw.formula ? ` Formula: ${stripHtml(String(raw.formula))}` : ""),
        answer: parts.join("; "),
        explanation: stripHtml([raw.working || "", raw.note || ""].filter(Boolean).join(" ")),
        extra: { formula: raw.formula || null }
      };
    }
    if (Array.isArray(raw.rows)) {
      /* Engine 3 — Statement Builder */
      const rows = (raw.rows || []).map(r =>
        `${stripHtml(String(r.label))} → ${stripHtml(String(r.answer))}` +
        (r.amount != null ? ` (${money(r.amount)})` : ""));
      return {
        __c12act: true, task: "Complete every line of the statement",
        question: stripHtml(head),
        answer: rows.join("; "),
        explanation: stripHtml(raw.working || ""),
        extra: { head: raw.head || null, needsAmount: !!raw.needsAmount }
      };
    }
    if (Array.isArray(raw.items)) {
      /* Engine 4 — Classifier */
      return {
        __c12act: true, task: "Classify every item into its correct bucket",
        question: stripHtml(head),
        answer: (raw.items || []).map(it =>
          `${stripHtml(String(it.label))} → ${stripHtml(String(it.bucket))}`).join("; "),
        explanation: stripHtml(raw.working || ""),
        extra: { buckets: (raw.buckets || []).slice() }
      };
    }
    if (Array.isArray(raw.pairs)) {
      /* Engine 5 — Match-Up */
      return {
        __c12act: true, task: "Match each left-hand item with its right-hand partner",
        question: stripHtml(head),
        answer: (raw.pairs || []).map(p =>
          `${stripHtml(String(p.left))} ↔ ${stripHtml(String(p.right))}`).join("; "),
        explanation: stripHtml(raw.working || ""),
        extra: {}
      };
    }
    if (raw.question) {   /* already-normalized object from the index */
      return { __c12act: true, task: raw.task || "", question: raw.question,
        answer: raw.answer || "", explanation: raw.explanation || "", extra: raw.extra || {} };
    }
    return null;
  }
  /* One entry per case of a chapter's activity, each keeping _orig so
     the index's identity map points at the exact object the page
     renders (clicking that object then resolves to this question). */
  function flattenC12Activity(act) {
    if (!act) return [];
    const key = ["entries", "problems", "statements", "sets"].filter(k => Array.isArray(act[k]))[0];
    if (!key) return [];
    const out = [];
    (act[key] || []).forEach(c => {
      const n = c12ActivityCase(c);
      if (n && n.question) { n._orig = c; out.push(n); }
    });
    return out;
  }

  /* =========================================================
     ACTIVITY CASES (Decision Lab, Error Detective, Adjustment
     Studio, Statement Builder)
     These four activities render a whole CASE — a context plus
     3-4 answer steps. The index stores one question per step, so
     when the activity's "Ask Tutor" button is clicked with the
     CASE object, describeCase() rebuilds the full case (context +
     every step + the student's live picks) as one attached
     question, instead of the empty text adapt() would produce.
     ========================================================= */
  const CASE_STEPS = {
    "pres.decisionLab": c => flattenStepCases([c]),
    "roe.auditCases": c => flattenStepCases([c]),
    "adj.adjustmentCases": c => flattenStepCases([c]),
    "fs.builderCases": c => flattenBuilderPlacements([c])
  };
  function caseContextText(srcKey, c) {
    if (!c || typeof c !== "object") return "";
    if (srcKey === "fs.builderCases") {
      const tb = (c.trialBalance || []).map(t => `${t.head} ${inr(t.amount)} (${t.side})`).join(", ");
      const adj = (c.adjustments || []).map((a, i) => `${i + 1}. ${a}`).join(" ");
      return [`${c.title} (as on ${c.asOn})`, tb ? `Trial Balance: ${tb}` : "", adj ? `Additional information: ${adj}` : ""].filter(Boolean).join(". ");
    }
    const parts = [c.title, c.concept].filter(s => typeof s === "string" && s.trim());
    if (Array.isArray(c.records) && c.records.length) parts.push("What the books show: " + c.records.join("; "));
    [c.situation, c.adjustment, c.errorDescription].forEach(s => { if (typeof s === "string" && s.trim()) parts.push(s); });
    return parts.join(" — ");
  }
  /* meta.getPicks() is a function the activity provides so the picks are
     read at CLICK time (the button's own HTML was rendered earlier). Each
     pick is { index | code, label }; index/code is compared with the step's
     stored answerIndex to mark the choice right or wrong. */
  function describeCase(srcKey, raw, meta) {
    const mk = CASE_STEPS[srcKey];
    if (!mk || !raw || typeof raw !== "object" || raw.id == null) return null;
    let steps = [];
    try { steps = mk(raw) || []; } catch (e) { steps = []; }
    if (!steps.length) return null;
    let picks = null;
    try { if (meta && typeof meta.getPicks === "function") picks = meta.getPicks(); } catch (e) { picks = null; }
    const caseSteps = steps.map((s, i) => {
      const step = {
        q: stripHtml(s.question || ""),
        options: (s.options || []).map(o => stripHtml(String(o))),
        answerIndex: typeof s.answerIndex === "number" && s.answerIndex >= 0 ? s.answerIndex : null,
        explanation: stripHtml(s.explanation || "")
      };
      const p = picks && picks[i] && typeof picks[i] === "object" ? picks[i] : null;
      if (p) {
        const idx = typeof p.index === "number" ? p.index : (typeof p.code === "string" ? BUILDER_PLACEMENT_CODES.indexOf(p.code) : -1);
        if (idx >= 0) { step.studentPick = stripHtml(p.label || step.options[idx] || ""); step.pickCorrect = step.answerIndex != null && idx === step.answerIndex; }
      }
      return step;
    });
    const S = SOURCES[srcKey];
    const context = caseContextText(srcKey, raw);
    const text = (context ? context + "\n" : "") + caseSteps.map((s, i) =>
      `Q${i + 1}. ${s.q}` + (s.options.length ? ` (${s.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`).join("; ")})` : "")).join("\n");
    return {
      id: `${srcKey}#case-${raw.id}`, srcKey, section: S.section, chapterId: (meta && meta.chapterId) || S.chapter || null, chapterName: "",
      kind: "case", text, options: null, correctIndex: null, correctText: null, answer: null, explanation: "", steps: null,
      extra: { caseContext: context, caseSteps, picksGiven: caseSteps.filter(s => s.studentPick != null).length }, raw: null
    };
  }

  function adapt(srcKey, raw, meta) {
    meta = meta || {};
    const S = SOURCES[srcKey];
    if (!S) return null;
    const chapterId = meta.chapterId || (srcKey === "importantQuestions" ? raw.chapterId : null) || (raw && raw.chapter) || S.chapter || null;
    const q = {
      srcKey, section: meta.section || (typeof S.section === "function" ? S.section() : S.section), chapterId, kind: S.kind, extra: {}, raw,
      id: null, text: "", options: null, correctIndex: null, correctText: null, answer: null, explanation: "", steps: null
    };
    const idPart = raw && (raw.id != null ? raw.id : raw._i != null ? raw._i : meta.index);
    q.id = meta.questionId || (idPart != null ? `${srcKey}#${idPart}` : null);
    switch (S.kind) {
      case "mcq": {
        Object.assign(q, mcqFields(raw));
        q.text = S.text ? S.text(raw) : raw.question || raw.q || raw.prompt;
        q.explanation = raw.explanation || "";
        if (raw.format) q.extra.format = raw.format;
        break;
      }
      case "equation": {
        q.text = raw.transaction || "Given the figures below, find the missing value.";
        q.extra.given = raw.given || null; q.extra.ask = raw.ask || null;
        q.answer = raw.answer; q.steps = raw.steps || null; q.explanation = raw.explanation || ""; q.extra.hint = raw.hint;
        if (raw.given) q.text += " Given: " + Object.keys(raw.given).map(k => `${k} = ${inr(raw.given[k])}`).join(", ") + (raw.ask ? `. Find: ${raw.ask}.` : "");
        break;
      }
      case "dc": {
        q.text = raw.transaction; q.extra.accounts = raw.accounts; q.extra.modern = raw.modern; q.extra.hint = raw.hint;
        q.answer = (raw.accounts || []).map(a => `${a.name} (${a.type}) — ${a.treatment}: ${a.reason}`).join("; ");
        q.explanation = raw.explanation || ""; break;
      }
      case "journal": {
        q.text = raw.transaction; q.extra.entries = raw.entries; q.extra.hint = raw.hint; q.extra.narration = raw.narration;
        q.answer = (raw.entries || []).map(e => `${String(e.particulars).trim()} ${e.dr != null ? "Dr " + inr(e.dr) : "Cr " + inr(e.cr)}`).join("; ") + (raw.narration ? " " + raw.narration : "");
        q.explanation = raw.explanation || ""; break;
      }
      case "posting": {
        q.text = "Post this journal entry to the ledger: " + raw.journalEntry; q.extra.postings = raw.postings;
        q.answer = (raw.postings || []).map(p => `${p.account}: ${p.side} side, ${inr(p.amount)} (${p.oppositeRef})`).join("; ");
        q.explanation = raw.explanation || ""; break;
      }
      case "ledgerpractice": {
        q.text = raw.transaction; q.extra.debitAccount = raw.debitAccount; q.extra.creditAccount = raw.creditAccount;
        q.answer = `Debit ${raw.debitAccount}; Credit ${raw.creditAccount}`; q.explanation = raw.explanation || ""; break;
      }
      case "txn": {
        q.text = raw.transaction; q.answer = raw.answer; q.extra.posting = raw.posting; q.extra.hint = raw.hint;
        q.explanation = raw.explanation || ""; break;
      }
      case "brs": {
        q.text = `${raw.situation} Starting point: Balance as per ${raw.startingPoint} = ${Calc.inr(Math.abs(raw.startingBalance))}${raw.startingBalance < 0 ? " (Overdraft)" : ""}. Find: ${raw.targetLabel}.`;
        q.extra = { category: raw.category, startingPoint: raw.startingPoint, startingBalance: raw.startingBalance, targetLabel: raw.targetLabel, finalBalance: raw.finalBalance, items: raw.items };
        q.answer = `${raw.targetLabel} = ${Calc.inr(Math.abs(raw.finalBalance))}${raw.finalBalance < 0 ? " (Overdraft)" : ""}. ` + (raw.items || []).map(i => `${i.label}: ${i.correctAnswer} ${inr(i.amount)}`).join("; ");
        q.explanation = (raw.items || []).map(i => i.reasoning).join(" "); break;
      }
      case "gstbill": {
        const b = raw.billText || {};
        q.text = `GST bill — Goods: ${b.goods}; Trade discount: ${b.discount}; GST rate: ${b.gstRate}; Freight: ${b.freight}. What is the final invoice value?`;
        q.options = (raw.options || []).map(o => inr(o)); q.correctIndex = (raw.options || []).indexOf(raw.answerValue); q.correctText = inr(raw.answerValue);
        q.answer = inr(raw.answerValue); q.steps = raw.steps || null; q.extra.billText = b; break;
      }
      case "tbcheck": {
        // Keep the visible question verbatim (prompt + amount) so the attached context
        // matches the card the student clicked. The case type is carried in extra, not in
        // the text — a "[classify]" suffix made the context quote unmatchable on the card.
        q.text = raw.prompt + (raw.amount ? ` (Amount: ₹${grouped(raw.amount)})` : "");
        Object.assign(q, mcqFields(raw)); q.explanation = raw.reasoning || ""; q.extra.type = raw.type; q.extra.whereInTB = raw.whereInTB; break;
      }
      case "basisswitch": {
        q.text = `${raw.title}: ${raw.situation} How is this treated under Cash Basis and under Accrual Basis?`;
        q.extra = { title: raw.title, cash: raw.cash, accrual: raw.accrual };
        q.answer = `Cash basis — ${raw.cash.recognized}; ${raw.cash.amount}. Accrual basis — ${raw.accrual.recognized}; ${raw.accrual.amount}.`;
        q.explanation = `Cash: ${raw.cash.note} Accrual: ${raw.accrual.note}`; break;
      }
      case "actionlab": {
        const sc = raw.scenario, cp = raw.cp;
        q.text = `${sc.business} ${sc.activity} — ${cp.q}`; Object.assign(q, mcqFields(cp)); q.explanation = cp.explanation || "";
        q.extra = { business: sc.business, activity: sc.activity, whyTransaction: sc.transaction, infoCreated: sc.infoCreated, recorded: sc.recorded, decision: sc.decision };
        break;
      }
      case "exam": {
        q.text = raw.q; q.answer = raw.a; q.extra.level = raw.level; q.explanation = ""; break;
      }
      case "iq": {
        q.text = raw.q; q.answer = raw.answer; q.extra.marks = raw.marks; q.extra.type = raw.type; break;
      }
      case "bsstatement": {
        q.text = raw.prompt + " Figures: " + (raw.rawFigures || []).join("; "); q.extra.asOn = raw.asOn;
        q.answer = "Liabilities side: " + (raw.liabilitiesSide || []).map(l => `${l.label} ${inr(l.amount)}`).join("; ") + ". Assets side: " + (raw.assetsSide || []).map(l => `${l.label} ${inr(l.amount)}`).join("; ");
        break;
      }
      case "mistake": {
        q.text = raw.trap; q.answer = raw.right; q.explanation = `Wrong idea: ${raw.wrong}`; break;
      }
      case "c12activity": {
        /* v86 — a single Class 12 activity case: prompt, answer key and
           the author's working travel with the tutor request. */
        const n = c12ActivityCase(raw);
        if (n) {
          q.text = n.question || "";
          q.answer = n.answer != null ? n.answer : "";
          q.explanation = n.explanation || "";
          q.extra = Object.assign({}, n.extra || {}, { task: n.task || "", kind: "activity case" });
        }
        break;
      }
    }
    q.text = stripHtml(q.text || "");
    if (q.srcKey === "terms.termDetective" || q.srcKey === "tbase.conceptDetective" || q.srcKey === "basis.basisSwitch.checkpoints") {
      if (q.id == null) q.id = `${srcKey}#${meta.index != null ? meta.index : ""}`;
    }
    return q;
  }
  function chapterNameFor(kb, id) { return kb && kb.chapterNames[id] || id || ""; }

  /* Markdown description of a question + its stored solution, used as model context and offline reply. */
  function questionBlock(q, withAnswer) {
    const lines = [`Section: ${q.section}${q.chapterName ? " — " + q.chapterName : ""}`, `Question: ${q.text}`];
    if (q.options && q.options.length) lines.push("Options: " + q.options.map((o, i) => `(${String.fromCharCode(65 + i)}) ${stripHtml(o)}`).join("  "));
    if (q.kind === "case" && q.extra && Array.isArray(q.extra.caseSteps)) {
      lines.push("Steps of this activity problem:\n" + q.extra.caseSteps.map((s, i) =>
        `Q${i + 1}. ${s.q}${s.options && typeof s.answerIndex === "number" && s.options[s.answerIndex] != null ? " → " + String.fromCharCode(65 + s.answerIndex) + ". " + s.options[s.answerIndex] : ""}${s.explanation ? " (" + s.explanation + ")" : ""}${s.studentPick != null ? ` [student chose: ${s.studentPick}${s.pickCorrect ? ", correct" : ", WRONG"}]` : ""}`).join("\n"));
    }
    if (withAnswer) {
      if (q.correctText) lines.push(`Stored correct option: ${stripHtml(q.correctText)}`);
      if (q.answer != null && q.answer !== "") lines.push(`Stored answer: ${typeof q.answer === "number" ? inr(q.answer) : stripHtml(q.answer)}`);
      if (q.steps && q.steps.length) lines.push("Stored steps: " + q.steps.map(stripHtml).join(" | "));
      if (q.explanation) lines.push(`Stored explanation: ${stripHtml(q.explanation)}`);
      if (q.extra && q.extra.hint) lines.push(`Hint: ${stripHtml(q.extra.hint)}`);
    }
    if (q.extra && q.extra.studentAnswer) lines.push(`The student's own (marked wrong) answer: ${stripHtml(q.extra.studentAnswer)} — explain what is wrong with it and how to reach the right one.`);
    return lines.join("\n");
  }

  /* =========================================================
     3. AUDIT — recompute stored answers, report conflicts (§21, §31)
     Returns { checked: bool, ok: bool, notes: [string] }
     ========================================================= */
  function audit(q) {
    const notes = []; let checked = false;
    try {
      if (q.kind === "gstbill" && Calc) {
        checked = true;
        const r = Calc.gstFromBillText(q.extra.billText);
        if (r.invoice !== q.raw.answerValue) notes.push(`Recomputed invoice value is ${inr(r.invoice)} but the stored answer is ${inr(q.raw.answerValue)}.`);
      } else if (q.kind === "equation" && q.extra.given && q.extra.ask && /^(capital|assets|liabilities)$/.test(q.extra.ask) && Calc) {
        checked = true;
        const g = q.extra.given; const r = Calc.equation({ assets: g.assets, liabilities: g.liabilities, capital: g.capital });
        if (r[q.extra.ask] !== q.answer) notes.push(`From the given figures, ${q.extra.ask} = ${inr(r[q.extra.ask])}, but the stored answer is ${inr(q.answer)}. The question's wording and its listed figures do not agree, so solve from the wording and say so.`);
      } else if (q.kind === "brs" && Calc) {
        checked = true;
        const c = q.raw;
        const sol = Calc.brsSolve({ startingPoint: c.startingPoint, startingBalance: c.startingBalance, items: c.items.map(i => ({ effect: i.correctAnswer, amount: i.amount, label: i.label })) });
        if (sol.finalBalance !== c.finalBalance) notes.push(`Stored items give ${Calc.inr(sol.finalBalance)} but the stored final balance is ${Calc.inr(c.finalBalance)}.`);
        c.items.forEach(i => {
          const k = Calc.brsClassify(i.label);
          if (k) {
            const expect = Calc.brsEffect(k.effect, c.startingPoint);
            if (expect !== i.correctAnswer) notes.push(`For "${i.label}" starting from the ${c.startingPoint}, the BRS rule gives "${expect}" but the stored answer says "${i.correctAnswer}". Apply the rule and mention the discrepancy.`);
          }
        });
      } else if (q.kind === "journal" && Calc) {
        checked = true;
        const j = Calc.journalBalanced((q.raw.entries || []).map(e => ({ dr: e.dr, cr: e.cr })));
        if (!j.balanced) notes.push(`The stored journal entry does not balance (Dr ${inr(j.debit)} vs Cr ${inr(j.credit)}).`);
      } else if (q.kind === "tbcheck" && q.extra.type === "balance-check" && Calc) {
        const rows = parseTrialBalanceRows(q.raw.prompt);
        if (rows.length >= 3) {
          checked = true;
          const tb = Calc.trialBalance(rows);
          const stored = (q.correctText || "");
          const saysYes = /^yes/i.test(stored);
          if (saysYes !== tb.agrees) notes.push(`Totals recomputed: Dr ${inr(tb.debitTotal)}, Cr ${inr(tb.creditTotal)} — this ${tb.agrees ? "agrees" : "does not agree"}, but the stored answer says "${stored}".`);
        }
      } else if (q.kind === "mcq" && q.options && q.correctIndex != null && Calc) {
        // Simple arithmetic-flavoured MCQs (GST amount, SLM/WDV year-1 depreciation): recompute.
        const t = q.text;
        const gstM = /goods worth\s*₹?([\d,]+).*gst rate\s*(\d+(?:\.\d+)?)%.*gst amount/i.exec(t);
        if (gstM) {
          checked = true; const exp = Calc.r2(Calc.parseNumber(gstM[1]) * parseFloat(gstM[2]) / 100);
          if (Calc.parseNumber(q.correctText) !== exp) notes.push(`Recomputed GST amount is ${inr(exp)} but the stored correct option is ${q.correctText}.`);
        }
        const slm = /costing\s*₹?([\d,]+)(?:\s*\(residual value\s*₹?([\d,]+)\))?.*?(\d+(?:\.\d+)?)%.*?slm.*annual depreciation/i.exec(t);
        if (slm) {
          checked = true; const exp = Calc.r2((Calc.parseNumber(slm[1]) - (slm[2] ? Calc.parseNumber(slm[2]) : 0)) * parseFloat(slm[3]) / 100);
          if (Calc.parseNumber(q.correctText) !== exp) notes.push(`Recomputed SLM depreciation is ${inr(exp)} but the stored correct option is ${q.correctText}.`);
        }
      }
    } catch (e) { notes.push("Audit could not complete: " + e.message); }
    return { checked, ok: notes.length === 0, notes };
  }
  // "Purchases ₹48,000 (Dr), Sales ₹72,000 (Cr), ..." -> rows
  function parseTrialBalanceRows(text) {
    const rows = []; const re = /([A-Za-z][A-Za-z &'/.-]*?)\s*(?:A\/c)?\s*[:\-]?\s*₹\s*([\d,]+(?:\.\d+)?)\s*\(\s*(Dr|Cr)\.?\s*\)/g; let m;
    while ((m = re.exec(String(text)))) rows.push({ name: m[1].replace(/^(and|,)\s*/i, "").trim(), amount: Calc.parseNumber(m[2]), side: m[3] });
    return rows;
  }

  /* =========================================================
     3b. DOCUMENT ROLES  (what a block is FOR)
     The site titles its blocks consistently ("Meaning of X", "Features of X",
     "Need for X", "X Format"...). Knowing a block's role lets the tutor pick the
     RIGHT kind of content for what the student asked — "What is X?" wants the
     meaning, "What is the format of X?" wants the format — instead of whichever
     block merely shares a keyword.
     ========================================================= */
  function roleOf(d) {
    const t = String(d.title || "").toLowerCase();
    switch (d.kind) {
      case "question": return "question"; case "example": return "example"; case "formula": return "formula";
      case "pattern": return "pattern"; case "flashcard": return "flashcard"; case "mindmap": return "mindmap"; case "revision": return "revision";
    }
    if (/\bmeaning\b|\bdefinition\b/.test(t)) return "definition";        // "Meaning of X", "Meaning and Features of X"
    if (/\bformat\b|columns?\b|ruling|layout|proforma|specimen|structure of/.test(t)) return "format";
    if (/\bvs\.?\b|versus|differen|distinction|compar/.test(t)) return "comparison";
    if (/mistake|error|trap|pitfall/.test(t)) return "mistake";
    if (/\bwhy\b|purpose|importance|need for|objective|advantage|benefit|role of|functions? of|uses? of|significance/.test(t)) return "purpose";
    if (/feature|characteristic|\btypes?\b|\bkinds?\b|classification|categor|component|element|causes?\b|factors?\b/.test(t)) return "features";
    if (/\brules?\b|golden|procedure|\bsteps?\b|how to|method of|treatment|process|working|posting|balancing|adjust|compound/.test(t)) return "rules";
    if (/\bwhat\b.*\b(is|are|does|do|says|means|actually)\b|introduction|overview|concept of|nature of|basics?\b|about\b/.test(t)) return "definition";
    return d.kind === "concept" ? "concept" : "other";
  }
  // "Meaning of Depreciation" -> "Depreciation"; "What the Journal actually is" -> "Journal"
  function topicTitle(title) {
    return String(title || "").replace(/^(chapter \d+\s*[—-]\s*)/i, "")
      .replace(/^(what (the )?|meaning of |definition of |features of |characteristics of |need for |causes of |importance of |purpose of preparing an? |purpose of |objectives? \/ features of an? |objectives? of |advantages of |factors affecting the amount of |why |main characteristics of |basic idea of |introduction to |overview of |quick revision —? ?)/i, "")
      .replace(/\b(actually is|is introduced|was introduced)\b/i, "").trim();
  }

  /* =========================================================
     4. INDEX BUILDER
     ========================================================= */
  function flattenText(v, depth) {
    depth = depth || 0;
    if (v == null || depth > 6) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
    if (Array.isArray(v)) return v.map(x => flattenText(x, depth + 1)).filter(Boolean).join(" ");
    if (typeof v === "object") {
      return Object.keys(v).filter(k => !/^(id|color|icon|difficulty|isSubtotalStart|isAddition|isSubtraction|isTotal)$/i.test(k)).map(k => flattenText(v[k], depth + 1)).filter(Boolean).join(" ");
    }
    return "";
  }
  function theoryBlockText(b) {
    const parts = [b.p, b.p2, b.formula, b.note, b.example];
    if (Array.isArray(b.list)) b.list.forEach(it => parts.push(typeof it === "string" ? it : `${it.term || it.h || it.title || ""}: ${it.def || it.body || it.p || ""}`));
    if (Array.isArray(b.steps)) parts.push(b.steps.join(" "));
    if (Array.isArray(b.rows)) parts.push(flattenText(b.rows));
    return parts.filter(Boolean).join(" ");
  }
  function build(APP_DATA, opts) {
    opts = opts || {};
    const kb = { docs: [], questions: [], questionById: {}, byRaw: new WeakMap(), chapterNames: {}, chapterRoutes: {}, df: Object.create(null), avgLen: 0, formulaDocs: 0 };
    (APP_DATA.chapters || []).forEach(c => { kb.chapterNames[c.id] = c.name; kb.chapterRoutes[c.id] = "ch-" + c.id; });
    /* v83 — Class 12 chapter directory (installed into APP_DATA under
       chapter-id keys by classes.js; the C12 registry is read directly
       when it is available so names/routes cover both classes). */
    const C12_CHAPTERS = (typeof C12_DATA !== "undefined" && Array.isArray(C12_DATA.chapters)) ? C12_DATA.chapters : [];
    C12_CHAPTERS.forEach(c => { kb.chapterNames[c.id] = c.name; kb.chapterRoutes[c.id] = "ch-" + c.id; });
    const DATA_KEY = { intro: "intro", terms: "terms", tbase: "tbase", basis: "basis", eq: "equation", dc: "debitCredit", jr: "journal", lg: "ledger", cb: "cashBook", sp2: "specialBooks2", brs: "brs", gst: "gst", tb: "tb", dep: "dep", pres: "pres", roe: "roe", fs: "fs", adj: "adj",
      /* v83 — Class 12 sections live in APP_DATA under their own chapter id */
      pf: "pf", gw: "gw", psr: "psr", adm: "adm", ret: "ret", dis: "dis",
      sc: "sc", deb: "deb", cfin: "cfin", fsa: "fsa", rat: "rat", cf: "cf", ca: "ca" };

    const secCounter = Object.create(null);
    function addDoc(d) {
      d.chapterName = d.chapterName || chapterNameFor(kb, d.chapterId);
      d.text = clip(stripHtml(d.text), 1800);
      d.id = kb.docs.length;                         // stable within one index; lets answers remember which blocks they already used
      d.role = d.role || roleOf(d);
      d.tTokens = new Set(tokenize(topicTitle(d.title)));
      d.order = secCounter[d.chapterId] = (secCounter[d.chapterId] || 0) + 1;
      if (d.parts) { const c = {}; Object.keys(d.parts).forEach(k => { const v = d.parts[k]; if (v == null) return; c[k] = Array.isArray(v) ? v.map(x => typeof x === "string" ? stripHtml(x) : x) : stripHtml(v); }); d.parts = c; }
      d.tokens = tokenize(d.title + " " + d.title + " " + d.text);
      d.titleSet = new Set(tokenize(d.title));
      d.tf = Object.create(null);
      d.tokens.forEach(t => { d.tf[t] = (d.tf[t] || 0) + 1; });
      Object.keys(d.tf).forEach(t => { kb.df[t] = (kb.df[t] || 0) + 1; });
      d.len = d.tokens.length || 1;
      kb.docs.push(d);
      return d;
    }

    // ---- chapter content ----
    Object.keys(DATA_KEY).forEach(ch => {
      const data = APP_DATA[DATA_KEY[ch]]; if (!data) return;
      const theory = data.theory || {};
      ["simple", "advanced"].forEach(level => (theory[level] || []).forEach(b => addDoc({ chapterId: ch, section: "Theory", kind: "theory", title: b.h || "Theory", text: theoryBlockText(b), level, parts: { p: b.p, p2: b.p2, formula: b.formula, note: b.note, example: b.example, items: Array.isArray(b.list) ? b.list.map(it => typeof it === "string" ? it : `${it.term || it.h || it.title || ""}: ${it.def || it.body || it.p || ""}`) : null } })));
      (data.concepts || []).forEach(c => addDoc({ chapterId: ch, section: "Key Concepts", kind: "concept", title: c.title, text: c.body, parts: { p: c.body } }));
      if (data.quickRevision) {
        const qr = data.quickRevision;
        // Human, chapter-specific titles. "Quick revision — definition" × 18
        // chapters was indistinguishable in retrieval (and in answers); now a
        // query like "quick revision of gst" matches the GST block's title.
        const chNm = kb.chapterNames[ch] || data.title || ch;
        const QR_LABEL = {
          definition: "Definition", keyPoints: "Key points", rules: "Rules",
          calculationSteps: "Steps to solve", balancingSteps: "Steps to balance",
          postingRules: "Posting rules", addLessLogic: "Add / Less logic",
          formulas: "Formulas", formats: "Formats", distinctions: "Key differences",
          examPoints: "Exam points", commonMistakes: "Common mistakes",
          mnemonic: "Mnemonic", stepsTitle: "Method", rulesTitle: "Rules"
        };
        Object.keys(qr).forEach(k => addDoc({ chapterId: ch, section: "Quick Revision", kind: "revision", title: chNm + " — Quick Revision — " + (QR_LABEL[k] || k), text: flattenText(qr[k]) }));
        // Each format / distinction also becomes its own document, titled the
        // way a student asks for it ("format of balance sheet", "difference
        // between trial balance and balance sheet"), so retrieval lands on the
        // exact table instead of a generic chapter block.
        (qr.formats || []).forEach(f => {
          if (!f || !f.title) return;
          addDoc({ chapterId: ch, section: "Quick Revision", kind: "revision", title: /format/i.test(f.title) ? f.title : "Format of " + f.title, text: flattenText(f) });
        });
        (qr.distinctions || []).forEach(dg => {
          const t = dg && (dg.title || dg.head);
          if (!t) return;
          const titled = /^difference/i.test(t) ? t
            : /\bvs\.?\b/i.test(t) ? "Difference between " + t.replace(/\s+vs\.?\s+/i, " and ")
            : t;
          addDoc({ chapterId: ch, section: "Quick Revision", kind: "revision", title: titled, text: flattenText(dg) });
        });
      }
      if (ch === "lg" && data.intro) Object.keys(data.intro).forEach(k => addDoc({ chapterId: ch, section: "Introduction", kind: "theory", title: "Ledger — " + k, text: flattenText(data.intro[k]) }));
      if (ch === "lg") {
        (data.postingRules || []).forEach(r => addDoc({ chapterId: ch, section: "Posting Rules", kind: "theory", title: r.title, text: r.body }));
        if (data.balancing) addDoc({ chapterId: ch, section: "Balancing", kind: "theory", title: "Balancing a ledger account", text: flattenText(data.balancing) });
      }
      (data.illustrations || []).forEach(il => addDoc({ chapterId: ch, section: "Illustrations", kind: "example", title: il.title, text: `${il.given} ${il.working} ${flattenText(il.table)}` }));
      /* v83 — Class 12 chapter formats ("Formulas & Rules" tab) and
         activity instructions become searchable tutor documents. */
      (data.formats || []).forEach(f => { if (f && f.title) addDoc({ chapterId: ch, section: "Formulas & Rules", kind: "formula", title: f.title, text: flattenText(f) }); });
      if (data.activity && data.activity.title) {
        addDoc({ chapterId: ch, section: data.activity.title, kind: "theory", title: (kb.chapterNames[ch] || ch) + " — " + data.activity.title, text: [data.activity.instruction, flattenText((data.activity.problems || []).map(p => p.prompt))].filter(Boolean).join(" ") });
      }
      Object.keys(theory).filter(k => !/^(simple|advanced)$/.test(k)).forEach(k => addDoc({ chapterId: ch, section: "Theory", kind: "theory", title: ch + " — " + k, text: flattenText(theory[k]) }));
    });
    // mind maps
    Object.keys(APP_DATA.mindmaps || {}).forEach(ch => {
      const m = APP_DATA.mindmaps[ch];
      (m.branches || []).forEach(b => addDoc({ chapterId: ch, section: "Mind Map", kind: "mindmap", title: `${(m.center || "").replace(/\n/g, " ")} — ${b.label}`, text: (b.children || []).join(". ") }));
    });
    // journal patterns (how the site's own Journal Entry Generator classifies transactions)
    (APP_DATA.journalEntryPatterns || []).forEach(p => {
      const dr = p.debit || (p.debitTemplate) || (p.parts && p.partsSide === "debit" ? p.parts.map(x => x.template).join(" + ") : p.totalTemplate);
      const cr = p.credit || (p.creditTemplate) || (p.parts && p.partsSide === "credit" ? p.parts.map(x => x.template).join(" + ") : p.totalTemplate);
      addDoc({ chapterId: "jr", section: "Journal Patterns", kind: "pattern", title: "Journal entry for: " + (p.keywords || []).join(" / "), text: `Transaction keywords: ${(p.keywords || []).join(", ")}. Debit: ${dr}. Credit: ${cr}. ${p.narration || ""}` });
    });
    // flashcards
    (APP_DATA.flashcards || []).forEach(f => addDoc({ chapterId: f.chapter, section: "Flashcards", kind: "flashcard", title: f.front, text: f.back }));
    // formula sheet (read from the site's own renderFormulaSheet source)
    if (opts.formulaSource) extractFormulaDocs(opts.formulaSource, kb).forEach(d => { addDoc(d); kb.formulaDocs++; });

    // ---- questions ----
    Object.keys(SOURCES).forEach(srcKey => {
      const S = SOURCES[srcKey];
      let list = []; try { list = S.list(APP_DATA) || []; } catch (e) { list = []; }
      list.forEach((raw, i) => {
        const q = adapt(srcKey, raw, { index: i + 1 });
        if (!q || !q.text) return;
        q.chapterName = chapterNameFor(kb, q.chapterId);
        if (!q.id) q.id = `${srcKey}#${i + 1}`;
        if (S.noId) q.id = `${srcKey}#${i + 1}`;
        q.audit = null; // computed lazily
        kb.questions.push(q); kb.questionById[q.id] = q;
        // identity map: the object a page renders -> its canonical question (so Ask AI never re-derives ids)
        const identity = raw && (raw._orig || raw.cp || raw);
        if (identity && typeof identity === "object" && !kb.byRaw.has(identity)) kb.byRaw.set(identity, q);
        const body = [q.text, q.options ? q.options.join(" ") : "", q.correctText || "", q.answer != null ? String(q.answer) : "", q.explanation || "", q.steps ? q.steps.join(" ") : ""].join(" ");
        addDoc({ chapterId: q.chapterId, section: q.section, kind: "question", title: q.text.slice(0, 120), text: body, qid: q.id });
      });
    });

    // Many blocks do not say "Meaning" in the title. Recognise definitional blocks by what they SAY:
    // the chapter's opening explainer, or a block whose first sentence has its own title as the subject ("X is…", "Meaning: …").
    const openers = Object.create(null);
    kb.docs.forEach(d => {
      if (d.kind !== "theory") return;
      const first = (String(d.parts && d.parts.p || d.text).match(/^[^.!?]+/) || [""])[0].toLowerCase();
      const subjectIs = d.tTokens.size > 0 && [...d.tTokens].every(t => tokenize(first.split(/\s+/).slice(0, 9).join(" ")).includes(t)) && /\b(is|are|means|refers to)\b/.test(first.split(/\s+/).slice(0, 12).join(" "));
      const meaningLead = /^meaning\s*[:—-]/i.test(String(d.text));
      if (d.role === "other" || d.role === "features" || d.role === "rules") { if (meaningLead || subjectIs) d.role = "definition"; }
      if (d.role === "other" && d.level === "simple" && !openers[d.chapterId]) { openers[d.chapterId] = d; d.role = "definition"; }
    });
    kb.addDoc = addDoc;
    refreshStats(kb);
    return kb;
  }
  function refreshStats(kb) { kb.avgLen = kb.docs.reduce((a, d) => a + d.len, 0) / (kb.docs.length || 1); kb.N = kb.docs.length; }
  // The Formula Sheet lives in app.js; the browser reads it back lazily and adds it here (no second build of the index).
  function addFormulas(kb, src) {
    if (!kb || !src || kb.formulaDocs) return 0;
    const docs = extractFormulaDocs(src, kb); docs.forEach(d => { kb.addDoc(d); kb.formulaDocs++; }); refreshStats(kb); return docs.length;
  }

  // Parse the Formula Sheet straight out of app.js's renderFormulaSheet source (no duplicated content).
  function extractFormulaDocs(src, kb) {
    const start = src.indexOf("function renderFormulaSheet");
    if (start < 0) return [];
    const next = src.indexOf("\nfunction ", start + 20);
    const body = src.slice(start, next > 0 ? next : start + 60000);
    const docs = [];
    const h3 = /<h3[^>]*>([\s\S]*?)<\/h3>/g; const marks = []; let m;
    while ((m = h3.exec(body))) marks.push({ idx: m.index, title: stripHtml(m[1]) });
    marks.forEach((mk, i) => {
      const seg = body.slice(mk.idx, i + 1 < marks.length ? marks[i + 1].idx : body.length);
      const chNum = /Chapter\s+(\d+)/i.exec(mk.title);
      const chapterId = chNum ? ((kb.chapterRoutes && Object.keys(kb.chapterNames)[parseInt(chNum[1], 10) - 1]) || null) : null;
      const rowRe = /<tr>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/g; let r;
      while ((r = rowRe.exec(seg))) {
        const a = stripHtml(r[1]), b = stripHtml(r[2]);
        if (a && b) docs.push({ chapterId, section: "Formula Sheet", kind: "formula", title: a, text: `${a}: ${b}` });
      }
    });
    return docs;
  }

  const KIND_WEIGHT = { theory: 1.25, concept: 1.25, revision: 1.15, example: 1.1, mindmap: 0.95, formula: 0.9, pattern: 0.85, flashcard: 0.8 };
  /* =========================================================
     5. SEARCH (BM25 + synonyms + chapter boost)
     ========================================================= */
  /* Bounded Levenshtein — returns max+1 as soon as the distance is
     hopeless, so fuzzy matching stays cheap even on a large vocabulary. */
  function editDist(a, b, max) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const m = a.length, n = b.length;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      let rowMin = cur[0];
      for (let j = 1; j <= n; j++) {
        const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
        const v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        cur[j] = v;
        if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      const t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  /* Fuzzy fallback for TYPO TOLERANCE: a query term the index has never seen
     (usually a misspelling — "depreciaton", "reciept") is mapped onto the
     closest real vocabulary term within a small edit distance, and its weight
     handed over at a slight discount. Terms that exist in the vocabulary are
     never touched, so exact retrieval is completely unchanged. */
  function fuzzyRewrite(weights, kb) {
    for (const t in weights) {
      if (kb.df[t]) continue;                       // real term — exact match path already scored it
      if (t.length < 5) continue;                   // too short to fuzz safely
      const tol = t.length >= 7 ? 2 : 1;
      let best = null, bestD = tol + 1;
      for (const v in kb.df) {
        const d = Math.abs(v.length - t.length);
        if (d === 0 || d > tol) continue;
        const dist = editDist(t, v, tol);
        if (dist > 0 && dist < bestD) { bestD = dist; best = v; if (dist === 1) break; }
      }
      if (best) {
        const w = weights[t] * 0.7;                 // discounted: a fuzzy hit should not outrank a true hit
        if (w > (weights[best] || 0)) weights[best] = w;
        delete weights[t];
      }
    }
  }

  function search(kb, query, opts) {
    opts = opts || {};
    const qTokens = tokenize(query);
    if (!qTokens.length) return [];
    const weights = Object.create(null);
    qTokens.forEach(t => { weights[t] = (weights[t] || 0) + 1; });
    String(query).toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).forEach(w => {
      (SYNONYMS[w] || []).forEach(s => { const st = stem(s); if (!STOP.has(s)) weights[st] = Math.max(weights[st] || 0, 0.5); });
    });
    fuzzyRewrite(weights, kb);
    const k1 = 1.4, b = 0.75, N = kb.N;
    const res = [];
    const kinds = opts.kinds ? new Set(opts.kinds) : null;
    for (let i = 0; i < kb.docs.length; i++) {
      const d = kb.docs[i];
      if (kinds && !kinds.has(d.kind)) continue;
      if (opts.excludeIds && d.qid && opts.excludeIds.has(d.qid)) continue;
      let score = 0, hit = 0;
      for (const t in weights) {
        const f = d.tf[t]; if (!f) continue;
        hit++;
        const idf = Math.log(1 + (N - kb.df[t] + 0.5) / (kb.df[t] + 0.5));
        score += weights[t] * idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / kb.avgLen));
      }
      if (!score) continue;
      // coverage bonus: reward documents that match many distinct query terms
      score *= 1 + 0.35 * (hit / Math.max(1, Object.keys(weights).length));
      // title bonus: "What is a liability?" should land on the Liability concept, not a passing mention
      if (d.titleSet.size && qTokens.length <= 6) {
        let th = 0; qTokens.forEach(t => { if (d.titleSet.has(t)) th++; });
        if (th) score *= 1 + 1.4 * (th / qTokens.length) * (d.titleSet.size <= qTokens.length + 2 ? 1.3 : 0.8);
      }
      if (d.kind === "flashcard") score *= 0.85;
      if (opts.chapterId && d.chapterId === opts.chapterId) score *= 1.25;
      // priority 2 > 3: teaching content slightly above question-bank items for concept queries
      if (opts.preferTeaching) score *= KIND_WEIGHT[d.kind] || 1;
      res.push({ doc: d, score });
    }
    res.sort((x, y) => y.score - x.score);
    return res.slice(0, opts.limit || 6);
  }

  /* =========================================================
     6. EXACT / VARIANT QUESTION LOOKUP (Priority 1)
     ========================================================= */
  function questionWords(text) { return new Set(tokenize(text)); }
  function findQuestion(kb, text) {
    const qw = questionWords(text);
    const short = qw.size < 4;               // very short stems ("GST is best described as:") need near-identical wording
    if (qw.size < 2) return null;
    const qn = numbersIn(text).filter(n => n !== 0);
    let best = null, bestScore = -1, bestSim = 0, bestNum = false;
    // Narrow with BM25 first (fast), then compare precisely. Many site questions share their wording and
    // differ only in the figures, so the candidate whose NUMBERS also match must win a word-similarity tie.
    const cands = search(kb, text, { kinds: ["question"], limit: 24 });
    cands.forEach(c => {
      const q = kb.questionById[c.doc.qid]; if (!q) return;
      const dw = questionWords(q.text);
      let inter = 0; qw.forEach(w => { if (dw.has(w)) inter++; });
      const jacc = inter / (qw.size + dw.size - inter || 1);
      const contain = inter / (Math.min(qw.size, dw.size) || 1);
      const sim = (qw.size >= 6 && !short) ? Math.max(jacc, contain * 0.9) : jacc;
      const dn = numbersIn(q.text).filter(n => n !== 0);
      // Same figures in the same quantity. One stray extra number (e.g. a "Q5" label) is tolerated; a different
      // figure (₹50,000 vs ₹5,00,000) never is. Questions with no figures match on wording alone.
      const numMatch = sameNumbers(qn, dn) || (dn.length > 0 && qn.length - dn.length <= 1 && dn.every(n => qn.includes(n)));
      const score = sim + (numMatch ? 0.25 : 0) + (q.text === String(text).trim() ? 0.5 : 0);
      if (score > bestScore) { bestScore = score; best = q; bestSim = sim; bestNum = numMatch; }
    });
    if (!best) return null;
    if (short && bestSim < 0.95) return null;
    if (bestSim < 0.5) return null;
    const exact = bestSim >= 0.8 && bestNum;
    return { question: best, similarity: Math.round(bestSim * 100) / 100, exact, variant: !exact, numbersMatch: bestNum };
  }

  /* =========================================================
     7. QUESTION TYPE CLASSIFICATION (§29)
     ========================================================= */
  function classifyQuestion(text, qctx) {
    const t = String(text || "").toLowerCase();
    if (qctx && qctx.srcKey) {
      const K = { brs: "brs", gstbill: "gst", tbcheck: "trial-balance", journal: "journal-entry", posting: "ledger", ledgerpractice: "journal-entry", basisswitch: "basis", equation: "numerical", dc: "journal-entry", bsstatement: "balance-sheet", exam: "theory", iq: "theory", actionlab: "concept", txn: "classification", mistake: "error-identification" };
      if (K[qctx.kind]) return K[qctx.kind];
      if (qctx.kind === "mcq") return "mcq";
    }
    if (/\b(bank reconciliation|brs|pass ?book)\b/.test(t)) return "brs";
    if (/\b(gst|cgst|sgst|igst|invoice value|taxable value)\b/.test(t) && /\d/.test(t)) return "gst";
    if (/\bdepreciat/.test(t) && /\d/.test(t)) return "depreciation";
    if (/trial balance/.test(t)) return /error|mistake|wrong|not agree|doesn.?t tally|affect/.test(t) ? "error-identification" : "trial-balance";
    if (/\b(journal entry|pass (the )?(journal )?entry|record (the )?transaction|journalise|journalize)\b/.test(t)) return "journal-entry";
    if (/\bledger\b|\bposting\b|\bbalance c\/d\b|t-account/.test(t)) return "ledger";
    if (/balance sheet|final accounts|classify .*(asset|liabilit)/.test(t)) return "balance-sheet";
    if (/\b(cash basis|accrual basis|basis of accounting)\b/.test(t)) return "basis";
    if (/\b(error|mistake|find my|check my|wrong)\b/.test(t)) return "error-identification";
    if (/\b(provision|bad debt|outstanding|prepaid|accrued|advance)\b/.test(t) && /\d/.test(t)) return "adjustment";
    if (/(\d[\d,]*)\s*(%|percent)|\bratio\b|\bcalculate\b|\bfind the\b|\bhow much\b/.test(t) && /\d/.test(t)) return "calculation";
    if (/\b(what is|define|meaning of|what are|definition)\b/.test(t)) return "definition";
    if (/\b(why|how does|how do)\b/.test(t)) return "concept";
    if (/\b(difference between|distinguish|features|characteristics|advantages|limitations|objectives|importance)\b/.test(t)) return "theory";
    if (/\b(revise|revision|summary|summari[sz]e|chapter)\b/.test(t)) return "chapter-explanation";
    if (/\d/.test(t) && /₹|rs\.?\s*\d/.test(t)) return "numerical";
    return "general";
  }

  /* =========================================================
     8. DETERMINISTIC FACTS (§10, §11)
     Returns [{ label, headline, steps[], assumptions[], tool }]
     ========================================================= */
  function deterministicFacts(text, q) {
    const facts = [];
    if (!Calc) return facts;
    const add = (label, headline, r, tool) => facts.push({ label, headline, steps: r.steps || [], assumptions: r.assumptions || [], tool });
    try {
      // --- structured: the question came from the site's own data ---
      if (q) {
        if (q.kind === "gstbill") { const r = Calc.gstFromBillText(q.extra.billText); add("GST bill recomputed", `Invoice value = ${inr(r.invoice)}`, r, "gst_invoice"); }
        else if (q.kind === "equation" && q.extra.given && /^(capital|assets|liabilities)$/.test(q.extra.ask || "")) {
          const g = q.extra.given; const r = Calc.equation({ assets: g.assets, liabilities: g.liabilities, capital: g.capital });
          add("Accounting equation", `${q.extra.ask} = ${inr(r[q.extra.ask])}`, r, "accounting_equation");
        } else if (q.kind === "brs") {
          const c = q.raw;
          const r = Calc.brsSolve({ startingPoint: c.startingPoint, startingBalance: c.startingBalance, items: c.items.map(i => ({ effect: i.correctAnswer, amount: i.amount, label: i.label })) });
          add("BRS arithmetic", `${c.targetLabel} = ${Calc.inr(Math.abs(r.finalBalance))}${r.finalBalance < 0 ? " (Overdraft)" : ""}`, r, "bank_reconciliation");
        } else if (q.kind === "tbcheck" && q.extra.type === "balance-check") {
          const rows = parseTrialBalanceRows(q.raw.prompt);
          if (rows.length >= 3) { const r = Calc.trialBalance(rows); add("Trial Balance totals", `Dr ${inr(r.debitTotal)} / Cr ${inr(r.creditTotal)}${r.agrees ? " — agrees" : " — does not agree"}`, r, "trial_balance"); }
        }
      }
      // Free-text numericals are solved by ai-solver.js (one calculator for browser and server).
    } catch (e) { /* facts are best-effort; never block the answer */ }
    return facts;
  }

  /* =========================================================
     9. CONTEXT BUILDER (shared by backend and offline tutor)
     ========================================================= */
  function sourceLabel(kb, d) {
    const ch = d.chapterName || chapterNameFor(kb, d.chapterId);
    return { label: d.kind === "question" ? `Related topic: ${d.section}${ch ? " — " + ch : ""}` : `Based on: ${ch ? ch + " → " : ""}${d.section}`, route: d.chapterId ? "ch-" + d.chapterId : null, chapterId: d.chapterId, section: d.section, kind: d.kind };
  }
  function buildContext(kb, query, opts) {
    opts = opts || {};
    const qctx = opts.question || null;     // canonical question (Ask AI) — already adapted
    const text = String(query || "");
    const searchText = (qctx ? qctx.text + " " : "") + text;
    const type = classifyQuestion(text, qctx);
    const chapterGuess = (qctx && qctx.chapterId) || opts.chapterId || detectChapterByKeywords(searchText);
    let exact = null, stored = qctx || null;
    // Priority 1: exact (or modified) question in site data
    if (qctx && qctx.id && kb.questionById[qctx.id]) {
      stored = kb.questionById[qctx.id];
      // keep the student's own (wrong) answer when the question came from the Mistake Book
      if (qctx.extra && qctx.extra.studentAnswer) stored = Object.assign({}, stored, { extra: Object.assign({}, stored.extra, { studentAnswer: qctx.extra.studentAnswer }) });
      exact = { question: stored, similarity: 1, exact: true, variant: false, byId: true };
    }
    else if (!qctx) { const f = findQuestion(kb, text); if (f && f.similarity >= 0.62) { exact = f; stored = f.question; } }
    else { const f = findQuestion(kb, qctx.text); if (f && f.exact) { exact = f; stored = f.question; if (qctx.extra && qctx.extra.studentAnswer) stored = Object.assign({}, stored, { extra: Object.assign({}, stored.extra, { studentAnswer: qctx.extra.studentAnswer }) }); } }
    // Priority 2/3: chapter content then related questions
    const excl = new Set(stored && stored.id ? [stored.id] : []);
    const teach = search(kb, searchText, { chapterId: chapterGuess, kinds: ["theory", "concept", "revision", "example", "formula", "pattern", "flashcard", "mindmap"], limit: 4, excludeIds: excl, preferTeaching: true });
    const related = search(kb, searchText, { chapterId: chapterGuess, kinds: ["question"], limit: 3, excludeIds: excl });
    const rel = related.filter(r => r.score >= (teach[0] ? teach[0].score * 0.35 : 0));
    // Priority 4: deterministic facts
    const sameQuestion = !!(qctx || (exact && (exact.exact || exact.byId)));
    const facts = deterministicFacts(text || (qctx && qctx.text) || "", sameQuestion && stored && stored.kind ? stored : null);
    // Conflicts / audit
    let auditResult = null;
    if (sameQuestion && stored && stored.raw) { auditResult = audit(stored); }
    const sources = []; const seen = new Set();
    function pushSrc(d) { const s = sourceLabel(kb, d); const k = s.label; if (!seen.has(k)) { seen.add(k); sources.push(s); } }
    if (stored && exact) pushSrc({ kind: "question", section: stored.section, chapterId: stored.chapterId, chapterName: stored.chapterName });
    teach.slice(0, 3).forEach(r => pushSrc(r.doc));
    return { type, chapterId: chapterGuess, chapterName: chapterNameFor(kb, chapterGuess), exact, stored, teach, related: rel, facts, audit: auditResult, sources: sources.slice(0, 3) };
  }

  // Render a context object to compact text for the model prompt.
  function contextToPrompt(kb, ctx, opts) {
    opts = opts || {}; const max = opts.maxChars || 5200;
    const parts = [];
    parts.push(`QUESTION TYPE (auto-detected): ${ctx.type}${ctx.chapterName ? ` | Likely chapter: ${ctx.chapterName}` : ""}`);
    if (ctx.stored) {
      const label = ctx.exact ? (ctx.exact.exact || ctx.exact.byId ? "EXACT MATCH IN WEBSITE DATA (Priority 1)" : `CLOSE MATCH IN WEBSITE DATA (similarity ${ctx.exact.similarity}; the student's question may be a modified version — use it only as a model, re-solve with the student's numbers)`) : "QUESTION THE STUDENT CLICKED 'ASK AI' ON";
      parts.push(`${label}:\n${questionBlock(ctx.stored, true)}`);
    }
    if (ctx.audit && !ctx.audit.ok) parts.push("⚠ STORED-ANSWER CONFLICT (do not repeat an incorrect stored result; explain the discrepancy briefly):\n- " + ctx.audit.notes.join("\n- "));
    if (ctx.facts.length) parts.push("VERIFIED CALCULATIONS (computed by code, use these exact figures):\n" + ctx.facts.map(f => `• ${f.label}: ${f.headline}\n  ${f.steps.join("\n  ")}${f.assumptions.length ? "\n  Assumptions: " + f.assumptions.join(" ") : ""}`).join("\n"));
    if (ctx.teach.length) parts.push("WEBSITE CHAPTER CONTENT (Priority 2):\n" + ctx.teach.map(r => `[${r.doc.chapterName || ""} → ${r.doc.section}] ${r.doc.title}: ${clip(r.doc.text, 520)}`).join("\n"));
    if (ctx.related.length) parts.push("RELATED QUESTIONS FROM THE WEBSITE (Priority 3):\n" + ctx.related.map(r => { const q = kb.questionById[r.doc.qid]; return q ? `[${q.section}] ${clip(q.text, 200)} → ${clip(q.correctText || (q.answer != null ? String(q.answer) : "") || q.explanation, 220)}` : ""; }).filter(Boolean).join("\n"));
    let out = parts.join("\n\n");
    if (out.length > max) out = out.slice(0, max - 1) + "…";
    return out;
  }

  /* =========================================================
     10. SOLVING A STORED QUESTION  (the site's own worked answer, with
         the deterministic recomputation and any conflict note)
     ========================================================= */
  function bullets(arr) { return arr.map(s => "- " + s).join("\n"); }
  function mcqAnswerMarkdown(q) {
    const out = [];
    if (q.options) out.push("**Options**\n" + q.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${stripHtml(o)}`).join("\n"));
    if (q.correctText) out.push(`**Answer:** ${stripHtml(q.correctText)}`);
    if (q.explanation) out.push(`**Why?** ${stripHtml(q.explanation)}`);
    return out.join("\n\n");
  }
  function journalTable(entries) {
    const rows = (entries || []).map(e => `| ${String(e.particulars).replace(/\s+/g, " ").trim()} | ${e.dr != null ? inr(e.dr) : ""} | ${e.cr != null ? inr(e.cr) : ""} |`);
    const dr = (entries || []).reduce((a, e) => a + (e.dr || 0), 0), cr = (entries || []).reduce((a, e) => a + (e.cr || 0), 0);
    return ["| Account | Dr. | Cr. |", "| --- | ---: | ---: |", ...rows, `| **Total** | **${inr(dr)}** | **${inr(cr)}** |`].join("\n");
  }
  function solveStoredQuestion(kb, q, ctx) {
    const lines = [];
    lines.push("Let's solve this question step by step.");
    lines.push(`**Question** (${q.section}${q.chapterName ? " · " + q.chapterName : ""})\n${q.text}`);
    if (q.extra && q.extra.studentAnswer) lines.push(`**Your earlier answer:** ${stripHtml(q.extra.studentAnswer)} — let's check it against the correct working below.`);
    if (q.kind === "case" && q.extra && q.extra.caseContext) lines.push(`**The problem:** ${stripHtml(q.extra.caseContext)}`);
    switch (q.kind) {
      case "case": {
        // Multi-step activity case: work through every step, and grade the
        // student's own picks when they had already chosen answers.
        const steps = (q.extra && q.extra.caseSteps) || [];
        let right = 0, mine = 0;
        steps.forEach((s, i) => {
          const hasAns = s.options && typeof s.answerIndex === "number" && s.answerIndex >= 0 && s.options[s.answerIndex] != null;
          const ans = hasAns ? `**Answer:** ${String.fromCharCode(65 + s.answerIndex)}. ${stripHtml(s.options[s.answerIndex])}` : "";
          let verdict = "";
          if (s.studentPick != null) {
            mine++;
            verdict = s.pickCorrect
              ? `✅ Your choice — **${stripHtml(s.studentPick)}** — is correct.`
              : `❌ You chose **${stripHtml(s.studentPick)}**, but the right choice is ${hasAns ? `**${String.fromCharCode(65 + s.answerIndex)}. ${stripHtml(s.options[s.answerIndex])}**` : "the other one — see why below"}.`;
            if (s.pickCorrect) right++;
          }
          lines.push([`**Q${i + 1}. ${stripHtml(s.q)}**`, verdict, ans, s.explanation ? `**Why:** ${stripHtml(s.explanation)}` : ""].filter(Boolean).join("\n\n"));
        });
        if (mine) lines.push(right === steps.length
          ? `**Result:** all ${steps.length} of your choices are correct. 🎉`
          : `**Result:** ${right} of the ${mine} answers you chose are correct — go through the ❌ ones above once more.`);
        break;
      }
      case "mcq": case "tbcheck": case "actionlab":
        lines.push(mcqAnswerMarkdown(q)); break;
      case "equation": {
        if (q.extra.given) lines.push("**Given**\n" + bullets(Object.keys(q.extra.given).map(k => `${k[0].toUpperCase() + k.slice(1)} = ${inr(q.extra.given[k])}`)));
        if (q.extra.ask) lines.push(`**Required:** ${q.extra.ask}`);
        if (q.steps) lines.push("**Steps**\n" + q.steps.map((s, i) => `${i + 1}. ${stripHtml(s)}`).join("\n"));
        lines.push(`**Final Answer:** ${inr(q.answer)}`); if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "dc": {
        lines.push("**Accounts involved**\n" + "| Account | Type | Debit / Credit | Reason |\n| --- | --- | --- | --- |\n" + (q.extra.accounts || []).map(a => `| ${a.name} | ${a.type} | ${a.treatment} | ${a.reason} |`).join("\n"));
        if (q.extra.modern) lines.push(`**Modern rule:** Debit — ${q.extra.modern.debit}; Credit — ${q.extra.modern.credit}.`);
        if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "journal": {
        lines.push("**Journal Entry**\n" + journalTable(q.extra.entries)); if (q.extra.narration) lines.push(`*${q.extra.narration}*`);
        if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "ledgerpractice": {
        lines.push(`**Debit:** ${q.extra.debitAccount}\n**Credit:** ${q.extra.creditAccount}`); if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "posting": {
        lines.push("**Postings**\n" + "| Account | Side | Amount | Reference |\n| --- | --- | ---: | --- |\n" + (q.extra.postings || []).map(p => `| ${p.account} | ${p.side} | ${inr(p.amount)} | ${p.oppositeRef} |`).join("\n"));
        if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "txn": {
        lines.push(`**Answer:** ${stripHtml(q.answer)}`); if (q.extra.posting) lines.push(`**Posting / working:** ${stripHtml(q.extra.posting)}`);
        if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "brs": {
        const c = q.raw;
        lines.push(`**Starting point:** Balance as per **${c.startingPoint}** = ${Calc.inr(Math.abs(c.startingBalance))}${c.startingBalance < 0 ? " (Overdraft)" : ""}\n**Required:** ${c.targetLabel}`);
        lines.push("**Items**\n" + "| Item | Add / Less | Amount |\n| --- | --- | ---: |\n" + c.items.map(i => `| ${i.label} | ${i.correctAnswer === "Add" ? "Add" : "Less"} | ${inr(i.amount)} |`).join("\n"));
        lines.push("**Why each item?**\n" + c.items.map((i, n) => `${n + 1}. ${stripHtml(i.reasoning)}`).join("\n"));
        lines.push(`**Final Answer:** ${c.targetLabel} = ${Calc.inr(Math.abs(c.finalBalance))}${c.finalBalance < 0 ? " (Overdraft)" : ""}`); break;
      }
      case "gstbill": {
        const b = q.extra.billText;
        lines.push("**Given**\n" + bullets([`Goods: ${b.goods}`, `Trade discount: ${b.discount}`, `GST rate: ${b.gstRate}`, `Freight: ${b.freight}`]));
        lines.push("**Steps**\n" + (q.steps || []).map((s, i) => `${i + 1}. ${stripHtml(s)}`).join("\n")); lines.push(`**Final Answer:** ${q.answer}`); break;
      }
      case "basisswitch": {
        lines.push("| | Cash Basis | Accrual Basis |\n| --- | --- | --- |\n" + `| Recognised | ${q.extra.cash.recognized} | ${q.extra.accrual.recognized} |\n| Amount | ${q.extra.cash.amount} | ${q.extra.accrual.amount} |`);
        lines.push(`**Why?**\n- Cash basis: ${q.extra.cash.note}\n- Accrual basis: ${q.extra.accrual.note}`); break;
      }
      case "custom": {
        if (q.extra.studentAnswer) lines.push(`**Your answer:** ${stripHtml(q.extra.studentAnswer)}`);
        if (q.correctText || q.answer) lines.push(`**Correct answer:** ${stripHtml(q.correctText || q.answer)}`);
        if (q.explanation) lines.push(`**Why?** ${stripHtml(q.explanation)}`); break;
      }
      case "exam": case "iq": lines.push(`**Answer**\n${stripHtml(q.answer)}`); break;
      case "bsstatement": lines.push(`**Answer**\n${stripHtml(q.answer)}`); break;
      case "mistake": lines.push(`**Correct idea:** ${stripHtml(q.answer)}\n\n${stripHtml(q.explanation)}`); break;
      default: if (q.answer) lines.push(`**Answer:** ${stripHtml(q.answer)}`);
    }
    // Verified recomputation (deterministic) + conflict notes
    const v = ctx && ctx.facts && ctx.facts[0];
    if (v) lines.push(`✅ **Checked:** ${v.headline}`);
    if (ctx && ctx.audit && !ctx.audit.ok) lines.push("⚠️ **Note:** the figures printed with this question don't fully agree with each other. The working above follows the accounting rules and the question's wording — if your textbook shows something different, check it with your teacher.");
    return lines.join("\n\n");
  }

  /* =========================================================
     11. Reply validation (server side, §21)
     ========================================================= */
  function validateReply(reply, ctx) {
    const issues = [];
    if (Calc) Calc.checkMarkdownJournal(reply).forEach(i => issues.push(i));
    const missing = [];
    (ctx && ctx.facts || []).forEach(f => {
      // headline numbers must appear somewhere in the reply (as ₹ amounts or plain numbers)
      const nums = (f.headline.match(/[\d,]+(?:\.\d+)?/g) || []).map(n => n.replace(/,/g, "")).filter(n => n.length >= 3);
      const body = reply.replace(/,/g, "");
      if (nums.length && !nums.some(n => body.includes(n))) missing.push(f);
    });
    return { issues, missingFacts: missing };
  }

  /* =========================================================
     11b. Wire -> canonical question (shared by browser + server)
     Prefers the site's own copy (by id) over whatever the client sent,
     but only when the text really resembles it, so a forged/mismatched
     id can never be treated as an exact match.
     ========================================================= */
  function resolveWire(kb, wire) {
    if (!wire || typeof wire !== "object") return null;
    let q = null;
    if (wire.id && kb.questionById[wire.id]) {
      const stored = kb.questionById[wire.id];
      const a = tokenize(wire.text || "").slice(0, 12), b = new Set(tokenize(stored.text));
      const overlap = a.length ? a.filter(t => b.has(t)).length / a.length : 0;
      if (overlap >= 0.5) q = stored;
    }
    if (!q) {
      q = { id: null, srcKey: wire.srcKey || null, section: wire.section || "Question", chapterId: wire.chapterId || null, kind: wire.kind || "custom", text: stripHtml(wire.text || ""),
        options: wire.options || null, correctIndex: null, correctText: wire.correctText || null, answer: wire.answer != null ? wire.answer : null,
        explanation: wire.explanation || "", steps: wire.steps || null, extra: { hint: wire.hint || null }, raw: null };
      q.chapterName = chapterNameFor(kb, q.chapterId);
      // Multi-step activity case (Decision Lab / Error Detective / Adjustment Studio /
      // Statement Builder): restore its steps so the tutor can solve the real problem.
      if (wire.caseSteps && Array.isArray(wire.caseSteps)) {
        q.kind = "case";
        q.extra.caseContext = String(wire.caseContext || "");
        q.extra.caseSteps = wire.caseSteps.slice(0, 24).map(s => ({
          q: String(s.q || ""), options: Array.isArray(s.options) ? s.options.slice(0, 8) : [],
          answerIndex: typeof s.answerIndex === "number" ? s.answerIndex : null,
          explanation: String(s.explanation || ""), studentPick: s.studentPick || null, pickCorrect: !!s.pickCorrect
        }));
        q.extra.picksGiven = q.extra.caseSteps.filter(s => s.studentPick != null).length;
      }
    }
    if (wire.studentAnswer) { q = Object.assign({}, q, { extra: Object.assign({}, q.extra, { studentAnswer: String(wire.studentAnswer).slice(0, 500) }) }); }
    return q;
  }

  /* =========================================================
     12. Public API
     ========================================================= */
  let _kb = null;
  function init(APP_DATA, opts) { _kb = build(APP_DATA, opts); return _kb; }
  function getKB() { return _kb; }
  function describe(srcKey, raw, meta) {
    if (_kb && raw && typeof raw === "object") {
      const hit = _kb.byRaw.get(raw);
      if (hit) return hit;                       // canonical copy from the index (same id, same fields)
    }
    // Whole activity case (Decision Lab / Error Detective / Adjustment Studio /
    // Statement Builder): rebuild the full case instead of adapting a shapeless object.
    let q = null;
    if (CASE_STEPS[srcKey] && raw && typeof raw === "object" && raw.id != null && !raw.question && !raw.q) q = describeCase(srcKey, raw, meta);
    if (!q) q = adapt(srcKey, raw, meta);        // runtime-generated questions (e.g. shuffled/derived pools)
    if (!q) return null;
    if (meta && meta.chapterId) q.chapterId = meta.chapterId;
    q.chapterName = chapterNameFor(_kb, q.chapterId);
    return q;
  }
  function solve(q) {
    if (!_kb || !q) return "";
    const ctx = buildContext(_kb, q.text, { question: q });
    return solveStoredQuestion(_kb, q, ctx);
  }
  // The small, serialisable shape sent to the backend (no `raw` blob).
  function toWire(q) {
    if (!q) return null;
    const isCase = q.kind === "case";
    const w = { id: q.id, srcKey: q.srcKey, section: q.section, chapterId: q.chapterId, kind: q.kind,
      text: clip(q.text, isCase ? 6000 : 1500), options: q.options ? q.options.slice(0, 8).map(o => clip(stripHtml(o), 300)) : null,
      correctText: q.correctText ? clip(stripHtml(q.correctText), 300) : null, answer: q.answer != null ? clip(String(q.answer), 800) : null,
      explanation: clip(stripHtml(q.explanation || ""), 1200), steps: q.steps ? q.steps.slice(0, 12).map(s => clip(stripHtml(s), 300)) : null,
      hint: q.extra && q.extra.hint ? clip(stripHtml(q.extra.hint), 300) : null,
      studentAnswer: q.extra && q.extra.studentAnswer ? clip(String(q.extra.studentAnswer), 500) : undefined };
    if (isCase && q.extra && Array.isArray(q.extra.caseSteps)) {
      w.caseContext = clip(q.extra.caseContext || "", 1600);
      w.caseSteps = q.extra.caseSteps.slice(0, 24).map(s => ({
        q: clip(s.q, 400), options: (s.options || []).slice(0, 8).map(o => clip(String(o), 200)),
        answerIndex: typeof s.answerIndex === "number" ? s.answerIndex : null,
        explanation: clip(s.explanation || "", 500), studentPick: s.studentPick || null, pickCorrect: !!s.pickCorrect
      }));
    }
    return w;
  }

  return {
    build, init, getKB, addFormulas: src => addFormulas(_kb, src), describe, solve, adapt, toWire, SOURCES, resolveWire, fromWire: w => resolveWire(_kb, w),
    search: (q, o) => search(_kb, q, o), findQuestion: t => findQuestion(_kb, t),
    classifyQuestion, detectChapterByKeywords, deterministicFacts, audit, parseTrialBalanceRows,
    buildContext: (q, o) => buildContext(_kb, q, o), contextToPrompt: (c, o) => contextToPrompt(_kb, c, o),
    validateReply, questionBlock,
    // pure variants taking an explicit kb (used by tests and the server)
    _solveStored: (kb, q) => solveStoredQuestion(kb, q, buildContext(kb, q.text, { question: q })),
    _search: search, _findQuestion: findQuestion, _buildContext: buildContext, _contextToPrompt: contextToPrompt,
    util: { tokenize, numbersIn, stripHtml, clip, stem, sameNumbers, topicTitle, roleOf, SYNONYMS, STOP }
  };
});
