/* ============================================================
   data-12.js — Accountancy By Abhinash (v83)
   Class 12 chapter registry. The chapter metadata lives here; the
   per-chapter educational content is registered by the unit files
   data-12a.js … data-12e.js through C12_DATA.register().

   Chapter ids are stable, syllabus-ordered and can never collide
   with the 18 Class 11 ids (intro…adj) — the full id list is
   asserted by tests/class12-content-tests.js.

   Content follows the CBSE Class XII Accountancy syllabus for the
   academic session 2026-27 (verified against the official curriculum
   PDF and the prescribed NCERT textbooks — see
   docs/CBSE-2026-27-CLASS12-SYLLABUS-CHECKLIST.md). All text is
   original teaching material written for this project.
   ============================================================ */
"use strict";

const C12_DATA = {

  /* ---- Chapter directory, official syllabus order ----
     Part A: Accounting for Partnership Firms (pf…dis)
     Part A: Accounting for Companies (sc, deb, cfin)
     Part B (Option 1): Financial Statement Analysis (fsa, rat, cf)
     Part B (Option 2): Computerised Accounting (ca)          */
  chapters: [
    {
      id: "pf", num: 1, class: "12",
      slug: "partnership-fundamentals",
      name: "Partnership Fundamentals",
      short: "Partnership Basics",
      tagline: "Deed or no deed — how a firm's profits, capital and past mistakes actually get divided",
      icon: "users", color: "var(--c-pf)",
      unit: "Unit 1 · Accounting for Partnership Firms"
    },
    {
      id: "gw", num: 2, class: "12",
      slug: "goodwill-valuation",
      name: "Goodwill: Nature & Valuation",
      short: "Goodwill",
      tagline: "What a firm's reputation is worth — and the three methods examiners use to price it",
      icon: "gem", color: "var(--c-gw)",
      unit: "Unit 1 · Accounting for Partnership Firms"
    },
    {
      id: "psr", num: 3, class: "12",
      slug: "change-in-profit-sharing-ratio",
      name: "Change in Profit-Sharing Ratio",
      short: "PSR Change",
      tagline: "When partners re-slice the same profit pie — sacrifice, gain and revaluation",
      icon: "pie-chart", color: "var(--c-psr)",
      unit: "Unit 1 · Accounting for Partnership Firms"
    },
    {
      id: "adm", num: 4, class: "12",
      slug: "admission-of-partner",
      name: "Admission of a Partner",
      short: "Admission",
      tagline: "A new face at the table: revalue everything before the ratios change",
      icon: "user-plus", color: "var(--c-adm)",
      unit: "Unit 1 · Accounting for Partnership Firms"
    },
    {
      id: "ret", num: 5, class: "12",
      slug: "retirement-and-death-of-partner",
      name: "Retirement & Death of a Partner",
      short: "Retirement/Death",
      tagline: "Settling a partner's full account — including profit up to the date of death",
      icon: "user-minus", color: "var(--c-ret)",
      unit: "Unit 1 · Accounting for Partnership Firms"
    },
    {
      id: "dis", num: 6, class: "12",
      slug: "dissolution-of-partnership-firm",
      name: "Dissolution of a Partnership Firm",
      short: "Dissolution",
      tagline: "Closing the books for good: realisation, settlement and the final cash divide",
      icon: "archive", color: "var(--c-dis)",
      unit: "Unit 1 · Accounting for Partnership Firms"
    },
    {
      id: "sc", num: 7, class: "12",
      slug: "accounting-for-share-capital",
      name: "Accounting for Share Capital",
      short: "Share Capital",
      tagline: "From allotment to forfeiture — every entry behind a company's equity",
      icon: "building-2", color: "var(--c-sc)",
      unit: "Unit 2 · Accounting for Companies"
    },
    {
      id: "deb", num: 8, class: "12",
      slug: "accounting-for-debentures",
      name: "Accounting for Debentures",
      short: "Debentures",
      tagline: "A company's loan in certificate form: issue, interest and writing off the loss",
      icon: "file-text", color: "var(--c-deb)",
      unit: "Unit 2 · Accounting for Companies"
    },
    {
      id: "cfin", num: 9, class: "12",
      slug: "financial-statements-of-company",
      name: "Financial Statements of a Company",
      short: "Company Accounts",
      tagline: "Reading Schedule III — what a company must disclose, and why",
      icon: "table-2", color: "var(--c-cfin)",
      unit: "Unit 2 · Accounting for Companies"
    },
    {
      id: "fsa", num: 10, class: "12",
      slug: "analysis-of-financial-statements",
      name: "Analysis of Financial Statements",
      short: "FS Analysis",
      tagline: "Comparative and common-size statements — trend and structure at a glance",
      icon: "bar-chart-3", color: "var(--c-fsa)",
      unit: "Unit 3 · Analysis of Financial Statements"
    },
    {
      id: "rat", num: 11, class: "12",
      slug: "accounting-ratios",
      name: "Accounting Ratios",
      short: "Ratios",
      tagline: "Fifteen ratios that turn two numbers into a verdict on liquidity, solvency and profit",
      icon: "gauge", color: "var(--c-rat)",
      unit: "Unit 3 · Analysis of Financial Statements"
    },
    {
      id: "cf", num: 12, class: "12",
      slug: "cash-flow-statement",
      name: "Cash Flow Statement",
      short: "Cash Flow",
      tagline: "Every rupee classified as operating, investing or financing — the AS-3 indirect method",
      icon: "activity", color: "var(--c-cf)",
      unit: "Unit 4 · Cash Flow Statement"
    },
    {
      id: "ca", num: 13, class: "12",
      slug: "computerised-accounting",
      name: "Computerised Accounting",
      short: "Computerised",
      tagline: "CAS features, spreadsheets, account heads and system security — the alternative pathway",
      icon: "layout-grid", color: "var(--c-ca)",
      unit: "Option 2 · Computerised Accounting"
    }
  ],

  content: {},              // chId → chapter learning content (registered by unit files)
  mindmaps: {},             // chId → { center, branches }
  quiz: [],                 // Class 12 MCQs (ids 70001+)
  flashcards: [],           // Class 12 flashcards (ids 71001+)
  importantQuestions: {},   // chId → [{ type, marks, q, answer, explanation }]
  formulas: {},             // chId → formula-sheet data
  revision: {}              // chId → revision-hub data
};

/* Unit files register their chapters through this helper. Merges
   content, mind maps, important questions, formulas and revision
   by chapter id, and appends quiz / flashcard arrays.

   content[chId] schema (used by renderC12Chapter in app.js):
     {
       theory:    { simple: [blocks], advanced: [blocks] },  // {h, p, p2?, formula?, list?:[{term,def}]}
       concepts:  [{ title, body }],
       formats:   [{ title, note?, head: [..], rows: [[..]] }],  // "Formulas & Rules" tab
       numericals:[{ id, difficulty, q, options, answerIndex, explanation }],
       activity:  { type, title, instruction, ...engine fields },
       quickRevision: { definition, keyPoints, formulas?, formats?, distinctions?,
                        examPoints?, commonMistakes?, mnemonic?, method?: {steps:[..]} }
     }
   The chapter's `formats` array doubles as the Formula Sheet entry
   for that chapter when no separate `formulas[id]` is given. */
/* v86 — ADDITIVE UNITS: data-12f.js … data-12l.js extend chapters the
   original unit files already registered instead of replacing them.
   register() therefore MERGES when a chapter id is seen twice:
     · additive list fields (numericals, examCases, examNumericals,
       concepts, formats and both theory layers) are concatenated;
     · the chapter's activity object grows in place — engine type,
       title and instruction stay exactly as the original unit wrote
       them, only the case list grows (journal to entries, calc to
       problems, statement to statements, classify/match to sets);
     · importantQuestions arrays are concatenated, never replaced, so
       existing question numbering and bookmarks stay valid;
     · any other field keeps the newer value.
   A first registration behaves exactly as before, so the original
   v83 unit files are unaffected by this rule. */
const C12_CONTENT_LIST_KEYS = ["numericals", "examCases", "examNumericals", "concepts", "formats"];
const C12_ACTIVITY_CASE_KEYS = ["entries", "problems", "statements", "sets"];

function c12MergeList(existing, incoming) {
  const a = Array.isArray(existing) ? existing : [];
  const b = Array.isArray(incoming) ? incoming : [];
  return a.concat(b);
}

function c12MergeContent(existing, incoming) {
  if (!existing || typeof existing !== "object") return incoming;
  if (!incoming || typeof incoming !== "object") return existing;
  const out = {};
  Object.keys(existing).forEach(k => { out[k] = existing[k]; });
  Object.keys(incoming).forEach(k => { out[k] = incoming[k]; });
  C12_CONTENT_LIST_KEYS.forEach(k => {
    if (existing[k] !== undefined || incoming[k] !== undefined) out[k] = c12MergeList(existing[k], incoming[k]);
  });
  if (existing.theory || incoming.theory) {
    const t = {};
    if (existing.theory) Object.keys(existing.theory).forEach(k => { t[k] = existing.theory[k]; });
    if (incoming.theory) Object.keys(incoming.theory).forEach(k => { t[k] = incoming.theory[k]; });
    t.simple = c12MergeList(existing.theory && existing.theory.simple, incoming.theory && incoming.theory.simple);
    t.advanced = c12MergeList(existing.theory && existing.theory.advanced, incoming.theory && incoming.theory.advanced);
    out.theory = t;
  }
  if (existing.activity && incoming.activity && existing.activity.type === incoming.activity.type) {
    const act = {};
    Object.keys(existing.activity).forEach(k => { act[k] = existing.activity[k]; });
    Object.keys(incoming.activity).forEach(k => { act[k] = incoming.activity[k]; });
    C12_ACTIVITY_CASE_KEYS.forEach(k => {
      if (existing.activity[k] !== undefined || incoming.activity[k] !== undefined) {
        act[k] = c12MergeList(existing.activity[k], incoming.activity[k]);
      }
    });
    act.type = existing.activity.type;
    act.title = existing.activity.title || incoming.activity.title;
    act.instruction = existing.activity.instruction || incoming.activity.instruction;
    out.activity = act;
  }
  if (existing.quickRevision && incoming.quickRevision) {
    const qr = {};
    Object.keys(existing.quickRevision).forEach(k => { qr[k] = existing.quickRevision[k]; });
    Object.keys(incoming.quickRevision).forEach(k => { qr[k] = incoming.quickRevision[k]; });
    ["keyPoints", "formats", "distinctions", "examPoints", "commonMistakes"].forEach(k => {
      if (existing.quickRevision[k] !== undefined || incoming.quickRevision[k] !== undefined) {
        qr[k] = c12MergeList(existing.quickRevision[k], incoming.quickRevision[k]);
      }
    });
    out.quickRevision = qr;
  }
  return out;
}

C12_DATA.register = function (part) {
  if (!part || typeof part !== "object") return;
  const keys = Object.keys(part.content || {});
  keys.forEach(id => {
    C12_DATA.content[id] = c12MergeContent(C12_DATA.content[id], part.content[id]);
    if (!C12_DATA.formulas[id] && C12_DATA.content[id] && C12_DATA.content[id].formats) {
      C12_DATA.formulas[id] = C12_DATA.content[id].formats;
    }
  });
  Object.keys(part.mindmaps || {}).forEach(id => { C12_DATA.mindmaps[id] = part.mindmaps[id]; });
  Object.keys(part.importantQuestions || {}).forEach(id => {
    const prevQ = C12_DATA.importantQuestions[id];
    const nextQ = part.importantQuestions[id];
    C12_DATA.importantQuestions[id] =
      (Array.isArray(prevQ) && Array.isArray(nextQ)) ? prevQ.concat(nextQ) : nextQ;
  });
  Object.keys(part.formulas || {}).forEach(id => { C12_DATA.formulas[id] = part.formulas[id]; });
  Object.keys(part.revision || {}).forEach(id => { C12_DATA.revision[id] = part.revision[id]; });
  if (Array.isArray(part.quiz)) C12_DATA.quiz = C12_DATA.quiz.concat(part.quiz);
  if (Array.isArray(part.flashcards)) C12_DATA.flashcards = C12_DATA.flashcards.concat(part.flashcards);
};
