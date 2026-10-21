/* ============================================================
   EXAM RULES — Accountancy by Abhinash
   The single authoritative source for every examination rule
   used anywhere on the site (exam UI, results, certificates,
   the exam-api Netlify Function, and the regression tests).

   Nothing here touches the DOM, storage or the network, so the
   exact same code runs in the browser, inside a Netlify
   Function, and inside Node tests — the rules can never drift
   between the client that shows a result and the server that
   issues the certificate for it.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ExamRules = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- Passing + grading -----------------------------
     The pass line is 40% exactly: 40.0 passes, 39.99 fails.
     Grades are decided from the RAW percentage (marks/max*100)
     with no intermediate rounding — only the value shown to the
     student is rounded. Grade D (33% to <40%) is deliberately a
     FAIL: pass/fail is computed separately from the grade label
     so a D can never sneak through as a pass.
     Bands are [minPct, grade, performance]; first band whose
     minPct is reached wins, so the table reads top-down.
  ------------------------------------------------------------- */
  var PASS_THRESHOLD = 40;               // % — inclusive: pct >= 40 passes
  var GRADE_BANDS = [
    { minPct: 90, grade: "A1", performance: "Outstanding" },
    { minPct: 80, grade: "A2", performance: "Excellent" },
    { minPct: 70, grade: "B1", performance: "Very Good" },
    { minPct: 60, grade: "B2", performance: "Good" },
    { minPct: 50, grade: "C1", performance: "Satisfactory" },
    { minPct: 40, grade: "C2", performance: "Pass" },
    { minPct: 33, grade: "D",  performance: "Needs Improvement" },
    { minPct: 0,  grade: "E",  performance: "Needs Significant Improvement" }
  ];
  var PASSING_GRADES = ["A1", "A2", "B1", "B2", "C1", "C2"];

  /* Raw percentage from marks — NEVER rounded. Used for every
     grade and pass/fail decision on both client and server. */
  function percentage(marks, maxMarks) {
    if (typeof maxMarks !== "number" || !isFinite(maxMarks) || maxMarks <= 0) return 0;
    if (typeof marks !== "number" || !isFinite(marks) || marks < 0) return 0;
    return (marks / maxMarks) * 100;
  }

  /* Only for display. Never feed this back into a decision. */
  function roundPct(pct) {
    if (!isFinite(pct)) return 0;
    return Math.round(pct * 100) / 100;   // 2 dp keeps 39.995 honest on screen
  }

  function gradeInfo(pct) {
    var p = (typeof pct === "number" && isFinite(pct)) ? pct : 0;
    for (var i = 0; i < GRADE_BANDS.length; i++) {
      if (p >= GRADE_BANDS[i].minPct) return GRADE_BANDS[i];
    }
    return GRADE_BANDS[GRADE_BANDS.length - 1];
  }

  function gradeFor(pct) { return gradeInfo(pct).grade; }

  /* Pass/fail is a SEPARATE decision from the grade: only the six
     grades at 40% or above are passing. A D or an E always fails. */
  function isPass(pct) {
    var p = (typeof pct === "number" && isFinite(pct)) ? pct : 0;
    return p >= PASS_THRESHOLD;
  }

  /* ---------- Evaluation -------------------------------------
     Objective (MCQ) questions only — one mark each, no negative
     marking anywhere. `questions` is the drawn paper (objects
     with id/chapter/answerIndex), `answers` is a parallel array
     of the chosen option index or null for "no response".

     Returns null when the input cannot be trusted (missing key,
     length mismatch, zero questions) so a caller can never
     publish a result computed from broken data.
  ------------------------------------------------------------- */
  function evaluateAttempt(questions, answers) {
    if (!Array.isArray(questions) || !Array.isArray(answers)) return null;
    if (!questions.length || questions.length !== answers.length) return null;
    var marks = 0, correct = 0, incorrect = 0, unanswered = 0, maxMarks = 0;
    var chapters = {};
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (!q || typeof q.answerIndex !== "number") return null;   // missing answer key
      var ch = q.chapter || "unknown";
      if (!chapters[ch]) chapters[ch] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
      chapters[ch].total++;
      maxMarks += 1;
      var given = answers[i];
      if (given === null || given === undefined) {
        unanswered++; chapters[ch].unanswered++;
      } else if (given === q.answerIndex) {
        correct++; marks++; chapters[ch].correct++;
      } else {
        incorrect++; chapters[ch].incorrect++;
      }
    }
    var pct = percentage(marks, maxMarks);
    var band = gradeInfo(pct);
    return {
      marksObtained: marks,
      maxMarks: maxMarks,
      percentage: pct,                       // raw — round only at display time
      percentageDisplay: roundPct(pct),
      grade: band.grade,
      performance: band.performance,
      passed: isPass(pct),
      resultStatus: isPass(pct) ? "PASS" : "FAIL",
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      chapterWise: chapters
    };
  }

  /* ---------- Certificate IDs --------------------------------
     Format: ACC-MONTHYYYY-NNNN
       ACC     fixed prefix
       MONTH   three-letter uppercase month of the EXAMINATION
       YYYY    four-digit year of the examination
       NNNN    sequential number within that month+year, zero
               padded — assigned by the server, never random.
     e.g. ACC-SEP2026-0010
  ------------------------------------------------------------- */
  var MONTH_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  var CERT_ID_RE = /^ACC-([A-Z]{3})(\d{4})-(\d{4})$/;

  function certIdFor(monthAbbr, year, seq) {
    var m = String(monthAbbr || "").toUpperCase();
    if (MONTH_ABBR.indexOf(m) === -1) return null;
    var y = parseInt(year, 10);
    var n = parseInt(seq, 10);
    if (!isFinite(y) || y < 1000 || y > 9999) return null;
    if (!isFinite(n) || n < 1 || n > 9999) return null;
    return "ACC-" + m + y + "-" + String(n).padStart(4, "0");
  }

  /* The month/year inside an ID always comes from the examination
     date (Asia/Kolkata), never from the device clock. */
  function certIdForDate(examDateMs, seq) {
    var parts = istParts(examDateMs);
    if (!parts) return null;
    return certIdFor(MONTH_ABBR[parts.month], parts.year, seq);
  }

  function parseCertId(id) {
    var m = CERT_ID_RE.exec(String(id || "").trim().toUpperCase());
    if (!m) return null;
    return { monthAbbr: m[1], year: parseInt(m[2], 10), seq: parseInt(m[3], 10), id: "ACC-" + m[1] + m[2] + "-" + m[3] };
  }

  function isValidCertId(id) { return parseCertId(id) !== null; }

  var SITE_ORIGIN = "https://accountancybyabhinash.netlify.app";

  /* ---------- Anti-cheating policy ---------------------------
     One table, consulted by the app layer for every monitoring
     decision, so the rules live with the rest of the examination
     rules and cannot drift from the UI.

       terminate — a confirmed violation ends the attempt as
                   DISQUALIFIED (one attempt consumed, no certificate)
       record    — counted as a visible interruption on the attempt,
                   shown to the student, never punished on its own
       block     — the browser action is prevented outright (the
                   student simply cannot do it) and recorded

     HONEST LIMIT: this is browser-side. It detects what a page can
     observe (visibility, key events, in-app navigation) and nothing
     more — an operating-system screenshot tool, a second device or
     a phone camera is outside any page's reach. The policy below
     never claims otherwise.
  ------------------------------------------------------------- */
  var EXAM_SECURITY_POLICY = {
    "tab-or-app-switched": "terminate",     // visibilitychange -> document.hidden with NO unload marker
    "screenshot-attempt": "terminate",      // detectable capture shortcuts only
    "navigation-attempt": "terminate",      // leaving the active examination view
    /* v89 — strict proctored Exam Mode. Focus loss now terminates
       (the listener only exists once permissions, system prompts and
       the pre-exam security checks are complete, so no permission
       dialog can trigger it). */
    "window-focus-lost": "terminate",
    /* v89 — leaving fullscreen ends the attempt IMMEDIATELY, with no
       grace period. Enforced from the real fullscreenchange state. */
    "fullscreen-exit": "terminate",
    /* v89 — sensor violations. Each of these follows the central
       one-warning-then-terminate policy in exam-monitor.js (the
       value below is the FINAL confirmed action); by the time the
       engine reports one as a violation, its warning is spent. */
    "camera-blank": "terminate",
    "face-missing": "terminate",
    /* v89 — a second person in frame: one warning, then terminate on
       a confirmed repeat or a grace-window overrun (same policy as
       every other sensor violation — never left unhandled). */
    "face-multiple": "terminate",
    /* v93 — moved too far from the checked-in position: one 2-second
       warning to return, then terminate if the move persists (same
       central policy as every other sensor violation). */
    "face-proximity": "terminate",
    /* v93 — a CONFIRMED phone terminates immediately: exam-monitor's
       `immediate` policy shows no warning window for this type. */
    "phone-detected": "terminate",
    "voice-detected": "terminate",
    "sound-detected": "terminate",
    "camera-lost": "terminate",
    "microphone-lost": "terminate",
    "monitoring-failure": "terminate",
    "page-reloaded": "record",              // refresh restores with the same deadline
    "page-hidden-short": "record",          // brief hidden spell already covered above by visibility
    "clock-adjusted": "record",
    "viewport-changed": "record",           // large resize / split-screen SIGNAL — a resize alone never disqualifies
    "copy-attempt": "block",                // copy/cut prevented + recorded
    "paste-attempt": "block",               // paste prevented + recorded
    "print-attempt": "block",               // print prevented + recorded
    "context-menu": "block",                // context menu prevented + recorded
    "select-attempt": "block"               // selection of question text prevented + recorded
  };

  /* How one monitoring event is treated — never undefined, never
     silently permissive: an unknown event falls back to "record". */
  function securityActionFor(event) {
    var a = EXAM_SECURITY_POLICY[event];
    return (a === "terminate" || a === "block" || a === "record") ? a : "record";
  }

  /* ---------- Daily attempt policy ---------------------------
     2 attempts per candidate per calendar day, and the day is
     the calendar day in Asia/Kolkata (UTC+5:30, no DST) — not
     UTC, not the device's own zone.
  ------------------------------------------------------------- */
  var DAILY_ATTEMPT_LIMIT = 2;
  var IST_OFFSET_MINUTES = 330;

  function istParts(ms) {
    var t = (typeof ms === "number" && isFinite(ms)) ? ms : Date.now();
    var d = new Date(t + IST_OFFSET_MINUTES * 60000);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() };
  }

  function istDayKey(ms) {
    var p = istParts(ms);
    if (!p) return null;
    return p.year + "-" + String(p.month + 1).padStart(2, "0") + "-" + String(p.day).padStart(2, "0");
  }

  /* Milliseconds until the next IST midnight — used to explain
     when attempts reset, never as the reset mechanism itself. */
  function msUntilIstMidnight(ms) {
    var t = (typeof ms === "number" && isFinite(ms)) ? ms : Date.now();
    var local = t + IST_OFFSET_MINUTES * 60000;
    var nextMidnight = Math.floor(local / 86400000) * 86400000 + 86400000;
    return nextMidnight - local;
  }

  /* ---------- The mock examinations --------------------------
     Fixed papers (not a configurable quiz) so every card can
     state exactly what the student is sitting. Chapter sets and
     counts are validated against the real question bank by
     tests/exam-rules-tests.js — a paper can never ask for more
     questions than the bank holds.
     v83: every paper carries `cls` ("11" | "12") so the Exam Mode
     screen only offers papers for the class on screen.
  ------------------------------------------------------------- */
  var ALL_CHAPTERS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "lg",
                      "cb", "sp2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
  var ALL_CHAPTERS_C12 = ["pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb",
                          "cfin", "fsa", "rat", "cf", "ca"];

  var EXAM_PAPERS = [
    {
      id: "full-50",
      cls: "11",
      title: "Full Syllabus Mock Examination",
      className: "Class 11", subject: "Accountancy",
      chapters: ALL_CHAPTERS,
      syllabus: "All 18 chapters — Introduction to Accounting through Adjustment in Financial Statements",
      questionCount: 50, durationMinutes: 45,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "full-100",
      cls: "11",
      title: "Full Syllabus Examination (Extended)",
      className: "Class 11", subject: "Accountancy",
      chapters: ALL_CHAPTERS,
      syllabus: "All 18 chapters — extended paper for full board-exam rehearsal",
      questionCount: 100, durationMinutes: 90,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "fundamentals",
      cls: "11",
      title: "Accounting Fundamentals — Chapters 1–4",
      className: "Class 11", subject: "Accountancy",
      chapters: ["intro", "terms", "tbase", "basis"],
      syllabus: "Ch.1 Introduction to Accounting · Ch.2 Basic Accounting Terms · Ch.3 Theory Base of Accounting · Ch.4 Bases of Accounting",
      questionCount: 25, durationMinutes: 25,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "journal-ledger",
      cls: "11",
      title: "Equation, Debit-Credit, Journal & Ledger — Chapters 5–8",
      className: "Class 11", subject: "Accountancy",
      chapters: ["eq", "dc", "jr", "lg"],
      syllabus: "Ch.5 Accounting Equation · Ch.6 Debit & Credit · Ch.7 Journal · Ch.8 Ledger",
      questionCount: 25, durationMinutes: 25,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "subsidiary-books",
      cls: "11",
      title: "Subsidiary Books & Cash Book — Chapters 9–10",
      className: "Class 11", subject: "Accountancy",
      chapters: ["cb", "sp2"],
      syllabus: "Ch.9 Special Purpose Books 1 — Cash Book · Ch.10 Special Purpose Books 2 — Other Books",
      questionCount: 20, durationMinutes: 20,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "brs-gst-tb",
      cls: "11",
      title: "BRS, GST & Trial Balance — Chapters 11–13",
      className: "Class 11", subject: "Accountancy",
      chapters: ["brs", "gst", "tb"],
      syllabus: "Ch.11 Bank Reconciliation Statement · Ch.12 Accounting of GST · Ch.13 Trial Balance",
      questionCount: 25, durationMinutes: 25,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "final-accounts",
      cls: "11",
      title: "Depreciation to Financial Statements — Chapters 14–18",
      className: "Class 11", subject: "Accountancy",
      chapters: ["dep", "pres", "roe", "fs", "adj"],
      syllabus: "Ch.14 Depreciation · Ch.15 Provisions and Reserves · Ch.16 Rectification of Errors · Ch.17 Financial Statements of Sole Proprietorship · Ch.18 Adjustment in Preparation of Financial Statements",
      questionCount: 25, durationMinutes: 25,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    /* ---- the eighth mode: CBSE Board Mock Test ---------------
       Class XI examinations are conducted by the school, so there is
       NO official CBSE Class XI board question paper to copy. What
       CBSE does publish for Class XI is:
         * the curriculum with unit weightage (12 / 44 / 24) and
         * the "Suggested Question Paper Design" cognitive split
           (Remembering & Understanding 32 = 40%, Applying 24 = 30%,
           Analysing/Evaluating/Creating 24 = 30%) on 80 marks.
       Neither document fixes a question count or a section layout.
       The structure below therefore delivers the VERIFIED CBSE
       totals (80 marks / 3 hours / 12-44-24 units / 40-30-30
       cognitive split) using the section-and-marks layout schools
       actually set. It is never described to students as an
       officially issued CBSE paper. See docs/CBSE-PATTERN-BASIS.md.
    ------------------------------------------------------------- */
    {
      id: "cbse-board-mock",
      cls: "11",
      title: "CBSE Board Mock Test",
      className: "Class 11", subject: "Accountancy",
      chapters: ALL_CHAPTERS,
      syllabus: "Full CBSE Class 11 Accountancy course — Unit 1 Theoretical Framework (12 marks) · Unit 2 Accounting Process (44 marks) · Unit 3 Financial Statements of Sole Proprietorship (24 marks)",
      questionCount: 52, durationMinutes: 180,
      difficulty: "CBSE typology — Remembering & Understanding 40% · Applying 30% · Analysing, Evaluating & Creating 30%",
      passingPercent: PASS_THRESHOLD,
      totalMarks: 80,
      structureNote: "Sections A–E · 52 questions · 80 marks · 3 hours · no negative marking",
      blueprint: {
        totalMarks: 80,
        durationMinutes: 180,
        negativeMarking: false,
        internalChoice: "none",
        sections: [
          { id: "A", label: "Section A", caption: "Objective questions — 1 mark each",
            marksPerQuestion: 1, count: 40, marks: 40,
            batches: [
              { n: 12, types: ["mcq", "multi", "matching"], unit: "u1" },
              { n: 26, types: ["mcq", "multi", "matching", "numerical"], unit: "u2" },
              { n: 2,  types: ["mcq", "numerical"], unit: "u3" }
            ] },
          { id: "B", label: "Section B", caption: "Very short answer — 2 marks each",
            marksPerQuestion: 2, count: 4, marks: 8,
            batches: [
              { n: 3, types: ["numerical"], unit: "u2" },
              { n: 1, types: ["case"], unit: "u2" }
            ] },
          { id: "C", label: "Section C", caption: "Short answer — 3 marks each",
            marksPerQuestion: 3, count: 4, marks: 12,
            batches: [
              { n: 2, types: ["case", "numerical"], unit: "u2" },
              { n: 2, types: ["case", "numerical"], unit: "u3" }
            ] },
          { id: "D", label: "Section D", caption: "Case-based / application — 4 marks each",
            marksPerQuestion: 4, count: 2, marks: 8,
            batches: [
              { n: 1, types: ["case"], unit: "u2" },
              { n: 1, types: ["case"], unit: "u3" }
            ] },
          { id: "E", label: "Section E", caption: "Long answer / comprehensive problem — 6 marks each",
            marksPerQuestion: 6, count: 2, marks: 12,
            batches: [
              { n: 2, types: ["case"], unit: "u3" }
            ] }
        ]
      }
    },
    /* ============================================================
       CLASS 12 PAPERS (v83)
       Built on the official CBSE Class XII Accountancy 2026-27
       course structure (80 marks theory + 20 marks project/practical):
       Part A — Accounting for Partnership Firms 36 + Accounting for
       Companies 24; Part B Option 1 — Analysis of Financial
       Statements 12 + Cash Flow Statement 8; Option 2 — Computerised
       Accounting 20. The board mock follows the official question
       paper design (Remembering & Understanding 40%, Applying 30%,
       Analysing/Evaluating/Creating 30%). As with the Class 11 mock,
       it is a practice paper modelled on the PUBLISHED DESIGN — it
       is never described as an officially issued CBSE paper.
       ============================================================ */
    {
      id: "c12-full-50",
      cls: "12",
      title: "Full Syllabus Mock Examination",
      className: "Class 12", subject: "Accountancy",
      chapters: ALL_CHAPTERS_C12,
      syllabus: "All 13 chapters — Partnership Fundamentals through Computerised Accounting",
      questionCount: 50, durationMinutes: 45,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "c12-full-100",
      cls: "12",
      title: "Full Syllabus Examination (Extended)",
      className: "Class 12", subject: "Accountancy",
      chapters: ALL_CHAPTERS_C12,
      syllabus: "All 13 chapters — extended paper for full board-exam rehearsal",
      questionCount: 100, durationMinutes: 90,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "c12-partnership",
      cls: "12",
      title: "Partnership Accounts — Unit 1",
      className: "Class 12", subject: "Accountancy",
      chapters: ["pf", "gw", "psr", "adm", "ret", "dis"],
      syllabus: "Partnership Fundamentals · Goodwill · Change in Profit-Sharing Ratio · Admission · Retirement & Death · Dissolution",
      questionCount: 30, durationMinutes: 30,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "c12-companies",
      cls: "12",
      title: "Accounting for Companies — Unit 2",
      className: "Class 12", subject: "Accountancy",
      chapters: ["sc", "deb", "cfin"],
      syllabus: "Accounting for Share Capital · Accounting for Debentures · Financial Statements of a Company",
      questionCount: 25, durationMinutes: 25,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "c12-analysis",
      cls: "12",
      title: "Financial Statement Analysis — Part B (Option 1)",
      className: "Class 12", subject: "Accountancy",
      chapters: ["fsa", "rat", "cf"],
      syllabus: "Analysis of Financial Statements · Accounting Ratios · Cash Flow Statement",
      questionCount: 25, durationMinutes: 25,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "c12-computerised",
      cls: "12",
      title: "Computerised Accounting — Part B (Option 2)",
      className: "Class 12", subject: "Accountancy",
      chapters: ["ca"],
      syllabus: "Overview of CAS · Spreadsheets · Spreadsheet business applications · Graphs & charts",
      questionCount: 15, durationMinutes: 15,
      difficulty: "Mixed (Easy to Hard)", passingPercent: PASS_THRESHOLD,
      marksPerQuestion: 1
    },
    {
      id: "c12-cbse-board-mock",
      cls: "12",
      title: "CBSE Board Mock Test",
      className: "Class 12", subject: "Accountancy",
      chapters: ALL_CHAPTERS_C12,
      syllabus: "Full CBSE Class 12 Accountancy course — Part A: Partnership Firms (36 marks) + Companies (24 marks) · Part B Option 1: Analysis of Financial Statements (12 marks) + Cash Flow Statement (8 marks) · students following Option 2 (Computerised Accounting) can rehearse with the dedicated Option 2 paper",
      questionCount: 36, durationMinutes: 180,
      difficulty: "CBSE typology — Remembering & Understanding 40% · Applying 30% · Analysing, Evaluating & Creating 30%",
      passingPercent: PASS_THRESHOLD,
      totalMarks: 80,
      structureNote: "Sections A–G · 36 questions · 80 marks · 3 hours · no negative marking · Part B shown as Option 1 (project-work pathway); both pathways share Part A",
      blueprint: {
        totalMarks: 80,
        durationMinutes: 180,
        negativeMarking: false,
        internalChoice: "none",
        sections: [
          { id: "A", label: "Section A", caption: "Objective questions — 1 mark each",
            marksPerQuestion: 1, count: 20, marks: 20,
            batches: [
              { n: 12, types: ["mcq", "numerical"], unit: "u1" },
              { n: 8,  types: ["mcq", "numerical"], unit: "u2" }
            ] },
          { id: "B", label: "Section B", caption: "Short answer — 3 marks each",
            marksPerQuestion: 3, count: 6, marks: 18,
            batches: [
              { n: 4, types: ["case", "numerical"], unit: "u1" },
              { n: 2, types: ["case", "numerical"], unit: "u2" }
            ] },
          { id: "C", label: "Section C", caption: "Short answer — 4 marks each",
            marksPerQuestion: 4, count: 3, marks: 12,
            batches: [
              { n: 2, types: ["case"], unit: "u1" },
              { n: 1, types: ["case"], unit: "u2" }
            ] },
          { id: "D", label: "Section D", caption: "Comprehensive problem — 6 marks",
            marksPerQuestion: 6, count: 1, marks: 6,
            batches: [
              { n: 1, types: ["case"], unit: "u2" }
            ] },
          { id: "E", label: "Section E", caption: "Application-based — 4 marks",
            marksPerQuestion: 4, count: 1, marks: 4,
            batches: [
              { n: 1, types: ["case"], unit: "u1" }
            ] },
          { id: "F", label: "Section F", caption: "Part B Option 1 — 4 marks each",
            marksPerQuestion: 4, count: 3, marks: 12,
            batches: [
              { n: 2, types: ["case", "numerical"], unit: "u3" },
              { n: 1, types: ["case", "numerical"], unit: "u4" }
            ] },
          { id: "G", label: "Section G", caption: "Part B Option 1 — 4 marks each",
            marksPerQuestion: 4, count: 2, marks: 8,
            batches: [
              { n: 1, types: ["case", "numerical"], unit: "u3" },
              { n: 1, types: ["case", "numerical"], unit: "u4" }
            ] }
        ]
      }
    }
  ];

  function getPaper(paperId) {
    for (var i = 0; i < EXAM_PAPERS.length; i++) {
      if (EXAM_PAPERS[i].id === paperId) return EXAM_PAPERS[i];
    }
    return null;
  }

  function maxMarksFor(paper) {
    if (!paper) return 0;
    if (typeof paper.totalMarks === "number" && paper.totalMarks > 0) return paper.totalMarks;
    if (paper.blueprint && Array.isArray(paper.blueprint.sections)) {
      return paper.blueprint.sections.reduce(function (m, s) { return m + (s.marks || 0); }, 0);
    }
    if (typeof paper.questionCount !== "number") return 0;
    var per = typeof paper.marksPerQuestion === "number" ? paper.marksPerQuestion : 1;
    return paper.questionCount * per;
  }

  /* ---------- Paper drawing ----------------------------------
     Round-robin across the paper's chapters so a chapter with a
     huge bank (Journal, Cash Book) can't swamp one with a small
     bank (Accounting Equation), then a final shuffle so the
     round-robin order isn't visible. `rng` is injectable for
     deterministic tests; defaults to Math.random.
  ------------------------------------------------------------- */
  function drawQuestions(quizBank, chapterIds, count, rng) {
    var rand = typeof rng === "function" ? rng : Math.random;
    if (!Array.isArray(quizBank) || !Array.isArray(chapterIds) || !chapterIds.length) return [];
    var target = Math.max(0, parseInt(count, 10) || 0);

    function shuffle(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(rand() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }

    var pools = {};
    chapterIds.forEach(function (ch) {
      pools[ch] = shuffle(quizBank.filter(function (q) { return q && q.chapter === ch; }));
    });
    var picked = [], round = 0;
    while (picked.length < target) {
      var tookAny = false;
      for (var k = 0; k < chapterIds.length && picked.length < target; k++) {
        var ch2 = chapterIds[(round + k) % chapterIds.length];
        if (pools[ch2].length) { picked.push(pools[ch2].shift()); tookAny = true; }
      }
      round++;
      if (!tookAny) break;                       // every pool exhausted
    }
    return shuffle(picked);
  }

  /* ==========================================================
     CBSE CLASS 11 ACCOUNTANCY — VERIFIED FACTS
     Read from CBSE's own curriculum PDF for Accountancy
     (Subject Code 055), which carries the Class XI content for
     BOTH the 2025-26 and 2026-27 sessions (the Class XI block is
     headed "(2025-26)" in each). The two files checked were:
       cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/
         Accountancy_SrSec_2025-26.pdf
       cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/
         Accountancy_SecP2_2026-27.pdf
     The SQP archive at cbseacademic.nic.in/sqp_archive.html lists
     sample question papers for Class X and Class XII only, for
     every session from 2014-15 to 2025-26 — there is no official
     CBSE Class XI sample paper, and Class XI examinations are
     conducted by the school, so no official board paper exists to
     imitate. Nothing below is presented to students as an
     officially issued CBSE question paper.
     docs/CBSE-PATTERN-BASIS.md carries the full working.
  ========================================================== */
  var CBSE_VERIFIED = {
    subjectCode: "055",
    subject: "Accountancy",
    classes: "XI",
    theoryMarks: 80,
    theoryHours: 3,
    projectMarks: 20,
    sourceTitle: "CBSE Academic curriculum, Accountancy (055), Class XI",
    sourceUrl2025_26: "https://cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Accountancy_SrSec_2025-26.pdf",
    sourceUrl2026_27: "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Accountancy_SecP2_2026-27.pdf",
    sqpArchiveUrl: "https://cbseacademic.nic.in/sqp_archive.html",
    officialSamplePaperForClassXI: false,
    unitWeightage: [
      { id: "u1", name: "Unit 1: Theoretical Framework", marks: 12 },
      { id: "u2", name: "Unit 2: Accounting Process", marks: 44 },
      { id: "u3", name: "Unit 3: Financial Statements of Sole Proprietorship", marks: 24 }
    ],
    typology: [
      { id: "RU", name: "Remembering and Understanding", marks: 32, percent: 40 },
      { id: "APP", name: "Applying", marks: 24, percent: 30 },
      { id: "AEC", name: "Analysing, Evaluating and Creating", marks: 24, percent: 30 }
    ],
    notes: [
      "Class XI examinations are conducted by the school, not by CBSE as a board exam.",
      "CBSE publishes Sample Question Papers for Class X and Class XII only.",
      "The curriculum fixes unit marks and a cognitive split, but no question count or section layout.",
      "No negative marking is prescribed for Class XI Accountancy."
    ]
  };

  /* Chapter -> CBSE unit. gst is taught as an accounting-process
     topic (journal entries, ITC) so it sits in Unit 2, while the
     pure characteristics/advantages material lives in Unit 1. */
  var CBSE_UNIT_OF_CHAPTER = {
    intro: "u1", terms: "u1", tbase: "u1", basis: "u1",
    eq: "u2", dc: "u2", jr: "u2", lg: "u2", cb: "u2", sp2: "u2",
    brs: "u2", gst: "u2", tb: "u2", dep: "u2", pres: "u2", roe: "u2",
    fs: "u3", adj: "u3",
    /* v83 — Class 12 blueprint units: u1 Partnership Firms (36),
       u2 Companies (24), u3 Analysis of Financial Statements (12),
       u4 Cash Flow Statement (8). Computerised Accounting (Option 2,
       20 marks) is u5 — outside the Option-1 board-mock batches, so
       it can never silently fill a Part A/Option 1 slot. */
    pf: "u1", gw: "u1", psr: "u1", adm: "u1", ret: "u1", dis: "u1",
    sc: "u2", deb: "u2", cfin: "u2",
    fsa: "u3", rat: "u3",
    cf: "u4",
    ca: "u5"
  };

  function unitOfChapter(chapterId) {
    return CBSE_UNIT_OF_CHAPTER[chapterId] || "u2";
  }

  /* ---------- Question formats -----------------------------
     "descriptive" questions exist in the repository (Important
     Questions, Ledger short answers) but are never drawn into a
     machine-graded paper, because free text cannot be marked
     honestly without a human. They are counted in the coverage
     report and shown in the revision areas only.
  ------------------------------------------------------------- */
  var QUESTION_TYPES = ["mcq", "multi", "numerical", "matching", "case", "descriptive"];
  var AUTO_GRADED_TYPES = ["mcq", "multi", "numerical", "matching", "case"];

  /* Cognitive typology, derived from the question itself so the
     paper can be measured against CBSE's 40/30/30 split without
     every author having to tag it. */
  function typologyOf(q) {
    if (!q || typeof q !== "object") return "RU";
    var t = Array.isArray(q.tags) ? q.tags : [];
    if (t.indexOf("competency") >= 0 || t.indexOf("hots") >= 0) return "AEC";
    if (q.type === "case") {
      if (t.indexOf("application") >= 0) return "APP";
      var subs = Array.isArray(q.subs) ? q.subs : [];
      var allNumeric = subs.length > 0 && subs.every(function (s) { return s && s.type === "numerical"; });
      return allNumeric ? "APP" : "RU";
    }
    if (q.type === "numerical") return "APP";
    if (t.indexOf("application") >= 0 || t.indexOf("numerical") >= 0) return "APP";
    if (t.indexOf("statement") >= 0 || t.indexOf("assertion-reason") >= 0) return "RU";
    return "RU";
  }

  function questionMarks(q) {
    if (q && typeof q.marks === "number" && q.marks > 0) return q.marks;
    if (q && q.type === "case" && Array.isArray(q.subs)) {
      var m = 0, ok = true;
      q.subs.forEach(function (s) { if (s && typeof s.marks === "number" && s.marks > 0) m += s.marks; else ok = false; });
      if (ok && m > 0) return m;
    }
    return 1;
  }

  /* ---------- Answer-key validity ---------------------------
     A question only enters an examination if its answer key can
     actually be graded. Anything malformed is rejected rather
     than silently awarded full marks.
  ------------------------------------------------------------- */
  function subKeyValid(s) {
    if (!s || typeof s !== "object") return false;
    if (typeof s.q !== "string" || !s.q.trim()) return false;
    if (s.type === "mcq") {
      return Array.isArray(s.options) && s.options.length >= 2 &&
             Number.isInteger(s.answerIndex) && s.answerIndex >= 0 && s.answerIndex < s.options.length;
    }
    if (s.type === "multi") {
      if (!Array.isArray(s.options) || !Array.isArray(s.answers) || s.answers.length < 1) return false;
      var seen = {};
      for (var i = 0; i < s.answers.length; i++) {
        var a = s.answers[i];
        if (!Number.isInteger(a) || a < 0 || a >= s.options.length) return false;
        if (seen[a]) return false;
        seen[a] = 1;
      }
      return true;
    }
    if (s.type === "numerical") {
      return typeof s.value === "number" && isFinite(s.value) &&
             (s.tolerance === undefined || (typeof s.tolerance === "number" && s.tolerance >= 0));
    }
    return false;
  }

  function questionKeyValid(q) {
    if (!q || typeof q !== "object") return false;
    var t = q.type || "mcq";
    if (t === "mcq") {
      return Array.isArray(q.options) && q.options.length >= 2 &&
             Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < q.options.length;
    }
    if (t === "multi") return subKeyValid({ q: "x", type: "multi", options: q.options, answers: q.answers });
    if (t === "numerical") return subKeyValid({ q: "x", type: "numerical", value: q.value, tolerance: q.tolerance });
    if (t === "matching") {
      if (!Array.isArray(q.left) || !Array.isArray(q.right) || !Array.isArray(q.answerSlots)) return false;
      if (q.left.length < 2 || q.right.length < 2 || q.answerSlots.length !== q.left.length) return false;
      for (var i = 0; i < q.answerSlots.length; i++) {
        var a = q.answerSlots[i];
        if (!Number.isInteger(a) || a < 0 || a >= q.right.length) return false;
      }
      return true;
    }
    if (t === "case") {
      if (typeof q.passage !== "string" || !q.passage.trim()) return false;
      if (!Array.isArray(q.subs) || q.subs.length < 1) return false;
      var sum = 0;
      for (var k = 0; k < q.subs.length; k++) {
        var s = q.subs[k];
        if (!subKeyValid(s)) return false;
        if (!Number.isInteger(s.marks) || s.marks < 1) return false;
        sum += s.marks;
      }
      return sum === questionMarks(q);
    }
    return false;
  }

  function isExamEligible(q) {
    if (!q || typeof q !== "object") return false;
    if (q.examEligible === false) return false;
    var t = q.type || "mcq";
    if (AUTO_GRADED_TYPES.indexOf(t) === -1) return false;
    if (!q.chapter) return false;
    if (typeof q.id === "undefined" || q.id === null || q.id === "") return false;
    return questionKeyValid(q);
  }

  /* ---------- Answer normalisation --------------------------
     Turns whatever the UI produced into the exact shape the
     grader expects, or null when the entry is empty/invalid.
     DOM-free so tests can exercise it directly.
  ------------------------------------------------------------- */
  function parseNumberLike(raw) {
    if (typeof raw === "number") return isFinite(raw) ? raw : null;
    if (typeof raw !== "string") return null;
    var s = raw.replace(/[,\s₹%]/g, "");
    if (!s.length) return null;
    if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }

  function sanitizeAnswer(type, raw, q) {
    if (type === "mcq" || type === undefined && q && (!q.type || q.type === "mcq")) {
      var opts = (q && q.options) || [];
      if (Number.isInteger(raw) && raw >= 0 && raw < opts.length) return raw;
      if (typeof raw === "string" && /^\d+$/.test(raw)) {
        var n = parseInt(raw, 10);
        if (n >= 0 && n < opts.length) return n;
      }
      return null;
    }
    if (type === "multi") {
      if (!Array.isArray(raw)) return null;
      var limit = (q && q.options) ? q.options.length : 64;
      var out = [], seen = {};
      raw.forEach(function (v) {
        if (Number.isInteger(v) && v >= 0 && v < limit && !seen[v]) { seen[v] = 1; out.push(v); }
      });
      if (!out.length) return null;
      out.sort(function (a, b) { return a - b; });
      return out;
    }
    if (type === "numerical") return parseNumberLike(raw);
    if (type === "matching") {
      if (!Array.isArray(raw)) return null;
      var n2 = (q && q.left) ? q.left.length : 0;
      if (raw.length !== n2) return null;
      var res = [], any = false;
      for (var i = 0; i < n2; i++) {
        var v = raw[i];
        var lim = (q && q.right) ? q.right.length : 0;
        if (Number.isInteger(v) && v >= 0 && v < lim) { res.push(v); any = true; }
        else res.push(null);
      }
      return any ? res : null;
    }
    if (type === "case") {
      if (!Array.isArray(raw)) return null;
      var subs = (q && q.subs) || [];
      if (raw.length !== subs.length) return null;
      var res2 = [], any2 = false;
      for (var j = 0; j < subs.length; j++) {
        var sv = sanitizeAnswer(subs[j].type, raw[j], subs[j]);
        res2.push(sv);
        if (sv !== null && sv !== undefined) any2 = true;
      }
      return any2 ? res2 : null;
    }
    /* default: legacy single-answer MCQ */
    return sanitizeAnswer("mcq", raw, q);
  }

  function isAnswered(v) {
    if (v === null || v === undefined) return false;
    if (Array.isArray(v)) return v.some(function (x) { return x !== null && x !== undefined; });
    if (typeof v === "number") return true;
    if (typeof v === "string") return v.trim().length > 0;
    return true;
  }

  function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }

  /* ---------- Grading one answer -----------------------------
     Returns marks actually earned out of `max`. Partial credit:
       multi      — one fraction of the marks per net correct pick
       matching   — marks × correct slots / slots
     mcq and numerical are all-or-nothing, as in a real paper.
  ------------------------------------------------------------- */
  function gradeAnswer(q, type, given) {
    var max = questionMarks(q);
    if (!isAnswered(given)) return { earned: 0, max: max, answered: false, correct: false };

    if (type === "mcq") {
      var ok = Number.isInteger(given) && given === q.answerIndex;
      return { earned: ok ? max : 0, max: max, answered: true, correct: ok };
    }
    if (type === "multi") {
      var keys = Array.isArray(q.answers) ? q.answers : [];
      var sel = Array.isArray(given) ? given : [];
      var hits = 0, misses = 0;
      sel.forEach(function (v) { if (keys.indexOf(v) >= 0) hits++; else misses++; });
      var full = hits === keys.length && misses === 0;
      var earned = keys.length ? Math.max(0, hits - misses) / keys.length * max : 0;
      earned = Math.min(max, earned);
      return { earned: round2(earned), max: max, answered: true, correct: full && earned >= max };
    }
    if (type === "numerical") {
      var tol = typeof q.tolerance === "number" ? q.tolerance : 0;
      var ok2 = typeof given === "number" && isFinite(given) && Math.abs(given - q.value) <= tol;
      return { earned: ok2 ? max : 0, max: max, answered: true, correct: ok2 };
    }
    if (type === "matching") {
      var slots = Array.isArray(q.answerSlots) ? q.answerSlots : [];
      var g = Array.isArray(given) ? given : [];
      var right = 0;
      for (var i = 0; i < slots.length; i++) if (g[i] === slots[i]) right++;
      var full2 = slots.length > 0 && right === slots.length;
      return { earned: round2(slots.length ? right / slots.length * max : 0), max: max, answered: true, correct: full2 };
    }
    if (type === "case") {
      var subs = Array.isArray(q.subs) ? q.subs : [];
      var gg = Array.isArray(given) ? given : [];
      var earned2 = 0, max2 = 0, answered2 = false, all2 = true;
      for (var k = 0; k < subs.length; k++) {
        var r = gradeAnswer(subs[k], subs[k].type, gg[k]);
        earned2 += r.earned; max2 += r.max;
        if (r.answered) answered2 = true;
        if (!r.correct) all2 = false;
      }
      if (max2 !== max) max2 = max;                 // trust the declared marks
      return { earned: round2(Math.min(earned2, max)), max: max, answered: answered2, correct: all2 && earned2 >= max };
    }
    /* ungradable (descriptive or unknown): never drawn, never scored */
    return { earned: 0, max: 0, answered: false, correct: false };
  }

  /* ---------- Grading a whole paper -------------------------
     Same output shape as evaluateAttempt, so results, grades,
     certificates and the regression tests all keep working. On a
     paper made only of 1-mark MCQs it returns exactly what
     evaluateAttempt returns. The extra fields (unitWise,
     typologyWise) feed the Board Mock result summary.
  ------------------------------------------------------------- */
  function evaluatePaper(questions, answers) {
    if (!Array.isArray(questions) || !Array.isArray(answers)) return null;
    if (!questions.length || questions.length !== answers.length) return null;
    var marks = 0, maxMarks = 0, correct = 0, incorrect = 0, unanswered = 0;
    var chapters = {}, units = {}, typology = {}, sections = {};

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (!q || typeof q !== "object") return null;
      var t = q.type || "mcq";
      if (AUTO_GRADED_TYPES.indexOf(t) === -1) return null;   // not gradable: refuse
      if (!questionKeyValid(q)) return null;                   // missing/invalid key: refuse

      var ch = q.chapter || "unknown";
      if (!chapters[ch]) chapters[ch] = { total: 0, correct: 0, incorrect: 0, unanswered: 0, marks: 0, max: 0 };
      var u = unitOfChapter(ch);
      if (!units[u]) units[u] = { marks: 0, max: 0, total: 0 };
      var tp = typologyOf(q);
      if (!typology[tp]) typology[tp] = { marks: 0, max: 0, total: 0 };
      var sec = q.sectionId || null;
      if (sec && !sections[sec]) sections[sec] = { marks: 0, max: 0, total: 0, correct: 0, incorrect: 0, unanswered: 0, label: q.sectionLabel || sec };

      var r = gradeAnswer(q, t, answers[i]);
      marks += r.earned;
      maxMarks += r.max;
      chapters[ch].total++;
      chapters[ch].marks += r.earned;
      chapters[ch].max += r.max;
      units[u].total++; units[u].marks += r.earned; units[u].max += r.max;
      typology[tp].total++; typology[tp].marks += r.earned; typology[tp].max += r.max;
      if (sec) {
        sections[sec].total++; sections[sec].marks += r.earned; sections[sec].max += r.max;
        if (!r.answered) sections[sec].unanswered++;
        else if (r.correct) sections[sec].correct++;
        else sections[sec].incorrect++;
      }

      if (!r.answered) { unanswered++; chapters[ch].unanswered++; }
      else if (r.correct) { correct++; chapters[ch].correct++; }
      else { incorrect++; chapters[ch].incorrect++; }
    }

    marks = round2(marks);
    var pct = percentage(marks, maxMarks);
    var band = gradeInfo(pct);
    return {
      marksObtained: marks,
      maxMarks: maxMarks,
      percentage: pct,
      percentageDisplay: roundPct(pct),
      grade: band.grade,
      performance: band.performance,
      passed: isPass(pct),
      resultStatus: isPass(pct) ? "PASS" : "FAIL",
      correct: correct,
      incorrect: incorrect,
      unanswered: unanswered,
      questionCount: questions.length,
      chapterWise: chapters,
      unitWise: units,
      typologyWise: typology,
      sectionWise: sections
    };
  }

  /* ---------- Presentation order (option shuffling) ----------
     Correct options must not sit in a fixed screen position. The
     order is derived from a stored seed plus the question id, so
     the SAME order comes back after a refresh and the stored
     answer indices still mean the same thing.
  ------------------------------------------------------------- */
  function hash32(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }

  function mulberry32(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function rngForSeed(seed) { return mulberry32(hash32(String(seed))); }

  function permutation(rand, n) {
    var a = [];
    for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(rand() * (j + 1));
      var tmp = a[j]; a[j] = a[k]; a[k] = tmp;
    }
    return a;
  }

  function remap(list, perm) {
    /* given selected indices expressed in the ORIGINAL order,
       return them expressed in the PRESENTED order */
    if (!Array.isArray(list)) return list;
    var out = [];
    list.forEach(function (v) {
      var at = perm.indexOf(v);
      if (at >= 0) out.push(at);
    });
    out.sort(function (a, b) { return a - b; });
    return out;
  }

  /* Returns a new question object whose option (and matching
     right-column) order has been shuffled. Never mutates the
     repository object — the same bank item is reused for every
     attempt. */
  function presentationFor(question, seed) {
    if (!question || typeof question !== "object") return question;
    var t = question.type || "mcq";
    var rand = rngForSeed(String(seed) + "|" + String(question.id));

    if (t === "mcq") {
      var n = question.options.length;
      if (n < 2) return question;
      var perm = permutation(rand, n);
      /* the permutation is deliberately NOT carried onto the result:
         the delivered question must not contain the map that would
         let a student reconstruct the author's original order */
      return Object.assign({}, question, {
        options: perm.map(function (i) { return question.options[i]; }),
        answerIndex: perm.indexOf(question.answerIndex)
      });
    }
    if (t === "multi") {
      var n2 = question.options.length;
      if (n2 < 2) return question;
      var perm2 = permutation(rand, n2);
      return Object.assign({}, question, {
        options: perm2.map(function (i) { return question.options[i]; }),
        answers: remap(question.answers, perm2)
      });
    }
    if (t === "matching") {
      var n3 = question.right.length;
      if (n3 < 2) return question;
      var perm3 = permutation(rand, n3);
      return Object.assign({}, question, {
        right: perm3.map(function (i) { return question.right[i]; }),
        answerSlots: question.answerSlots.map(function (v) { return perm3.indexOf(v); })
      });
    }
    if (t === "case") {
      return Object.assign({}, question, {
        subs: question.subs.map(function (s) { return presentationFor(s, seed); })
      });
    }
    return question;
  }

  /* ---------- Blueprint drawing ------------------------------
     Builds the CBSE Board Mock Test paper. Each section's
     batches pin the marks level, the allowed formats and the CBSE
     unit, so the finished paper always adds up to the blueprint.
     Selection prefers questions the student has never been served
     for this mode; only when a batch runs dry does it fall back
     to questions seen before, and only then to the most recent
     attempts. Questions are dealt chapter by chapter so one big
     chapter cannot swamp a small one, and the order is shuffled
     inside each section (sections themselves stay in A..E order,
     which is what a real paper does).
  ------------------------------------------------------------- */
  function shuffleWith(rand, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function dealByChapter(rand, pool, n, taken) {
    var byCh = {};
    pool.forEach(function (q) {
      var c = q.chapter || "unknown";
      (byCh[c] = byCh[c] || []).push(q);
    });
    var lanes = Object.keys(byCh).map(function (c) { return shuffleWith(rand, byCh[c]); });
    lanes = shuffleWith(rand, lanes);
    var out = [], round = 0;
    while (out.length < n && round < lanes.length + n) {
      var took = false;
      for (var k = 0; k < lanes.length && out.length < n; k++) {
        var lane = lanes[(round + k) % lanes.length];
        while (lane.length) {
          var cand = lane.shift();
          if (taken[cand.id]) continue;
          taken[cand.id] = 1;
          out.push(cand);
          took = true;
          break;
        }
      }
      round++;
      if (!took) break;
    }
    return out;
  }

  function drawPaper(bank, paper, opts, rng) {
    var rand = typeof rng === "function" ? rng : Math.random;
    var bp = paper && paper.blueprint;
    if (!bp || !Array.isArray(bp.sections) || !bp.sections.length) {
      return { ok: false, error: "no-blueprint", missing: [] };
    }
    var opts2 = opts || {};
    var seen = opts2.seen || [];
    var recent = opts2.recent || [];
    var seenSet = {};
    seen.forEach(function (id) { seenSet[id] = 1; });
    var recentSet = {};
    recent.forEach(function (id) { recentSet[id] = 1; });

    var chapters = paper.chapters || ALL_CHAPTERS;
    var eligible = (Array.isArray(bank) ? bank : []).filter(function (q) {
      return isExamEligible(q) && chapters.indexOf(q.chapter) >= 0;
    });

    var taken = {}, drawn = [], missing = [], sectionReports = [];

    bp.sections.forEach(function (sec) {
      var pickedHere = [];
      (sec.batches || []).forEach(function (batch) {
        var pool = eligible.filter(function (q) {
          if (!batch.types || batch.types.indexOf(q.type || "mcq") < 0) return false;
          if (batch.unit && unitOfChapter(q.chapter) !== batch.unit) return false;
          return questionMarks(q) === sec.marksPerQuestion;
        });
        var have = 0;
        var tiers = [
          pool.filter(function (q) { return !seenSet[q.id] && !recentSet[q.id]; }),
          pool.filter(function (q) { return seenSet[q.id] && !recentSet[q.id]; }),
          pool.filter(function (q) { return seenSet[q.id] && recentSet[q.id]; })
        ];
        var got = [];
        for (var ti = 0; ti < tiers.length && got.length < batch.n; ti++) {
          var need = batch.n - got.length;
          var add = dealByChapter(rand, tiers[ti], need, taken);
          got = got.concat(add);
          have += add.length;
        }
        if (have < batch.n) {
          missing.push({ section: sec.id, unit: batch.unit, types: batch.types.join("+"),
                         marks: sec.marksPerQuestion, want: batch.n, got: have,
                         pool: pool.length });
        }
        pickedHere = pickedHere.concat(got);
      });

      /* shuffle inside the section only — sections keep A..E order */
      sectionReports.push({
        id: sec.id, label: sec.label, caption: sec.caption,
        marksPerQuestion: sec.marksPerQuestion,
        count: pickedHere.length,
        planned: sec.count,
        marks: pickedHere.length * sec.marksPerQuestion,
        plannedMarks: sec.marks
      });
      shuffleWith(rand, pickedHere).forEach(function (q) {
        drawn.push(Object.assign({}, q, { sectionId: sec.id, sectionLabel: sec.label }));
      });
    });

    var totalMarks = drawn.reduce(function (m, q) { return m + questionMarks(q); }, 0);
    var planned = bp.sections.reduce(function (m, s) { return m + s.marks; }, 0);
    var plannedCount = bp.sections.reduce(function (m, s) { return m + s.count; }, 0);

    var report = {
      totalMarks: totalMarks,
      plannedMarks: planned,
      questionCount: drawn.length,
      plannedCount: plannedCount,
      sections: sectionReports,
      units: {}, typology: {}, difficulty: {}, types: {}, chapters: {}
    };
    drawn.forEach(function (q) {
      var u = unitOfChapter(q.chapter), tp = typologyOf(q), d = q.difficulty || "Mixed";
      report.units[u] = (report.units[u] || 0) + questionMarks(q);
      report.typology[tp] = (report.typology[tp] || 0) + questionMarks(q);
      report.difficulty[d] = (report.difficulty[d] || 0) + questionMarks(q);
      report.types[q.type] = (report.types[q.type] || 0) + 1;
      report.chapters[q.chapter] = (report.chapters[q.chapter] || 0) + 1;
    });

    var ok = missing.length === 0 && totalMarks === planned && drawn.length === plannedCount;
    if (!ok) {
      var errs = [];
      if (missing.length) errs.push("insufficient supply: " + JSON.stringify(missing));
      if (totalMarks !== planned) errs.push("marks " + totalMarks + " != " + planned);
      if (drawn.length !== plannedCount) errs.push("questions " + drawn.length + " != " + plannedCount);
      return { ok: false, error: "blueprint-not-met", detail: errs.join("; "), missing: missing, report: report };
    }
    return { ok: true, questions: drawn, report: report };
  }

  /* ---------- Candidate name validation ----------------------
     The name goes on a certificate, so it must be a real name
     rather than blank, whitespace, or a wall of characters.
     Returns { ok, name, reason } — `name` is trimmed but the
     student's own spelling and casing are preserved exactly.
  ------------------------------------------------------------- */
  function validateCandidateName(raw) {
    var name = String(raw == null ? "" : raw).replace(/\s+/g, " ").trim();
    if (!name) return { ok: false, name: "", reason: "empty" };
    if (name.length < 2) return { ok: false, name: name, reason: "too-short" };
    if (name.length > 60) return { ok: false, name: name, reason: "too-long" };
    if (!/[A-Za-z]/.test(name)) return { ok: false, name: name, reason: "no-letter" };
    return { ok: true, name: name, reason: null };
  }

  function validateSchoolName(raw) {
    var s = String(raw == null ? "" : raw).replace(/\s+/g, " ").trim();
    if (!s) return { ok: true, name: "", optional: true };
    if (s.length > 80) return { ok: false, name: s, reason: "too-long" };
    return { ok: true, name: s, reason: null };
  }

  return {
    PASS_THRESHOLD: PASS_THRESHOLD,
    GRADE_BANDS: GRADE_BANDS,
    PASSING_GRADES: PASSING_GRADES,
    DAILY_ATTEMPT_LIMIT: DAILY_ATTEMPT_LIMIT,
    IST_OFFSET_MINUTES: IST_OFFSET_MINUTES,
    MONTH_ABBR: MONTH_ABBR,
    EXAM_PAPERS: EXAM_PAPERS,
    SITE_ORIGIN: SITE_ORIGIN,
    EXAM_SECURITY_POLICY: EXAM_SECURITY_POLICY,
    securityActionFor: securityActionFor,
    percentage: percentage,
    roundPct: roundPct,
    /* the 2dp rule that decides the partial credit a student is scored
       on — exported so the grading tests can assert the exact value */
    round2: round2,
    gradeInfo: gradeInfo,
    gradeFor: gradeFor,
    isPass: isPass,
    evaluateAttempt: evaluateAttempt,
    certIdFor: certIdFor,
    certIdForDate: certIdForDate,
    parseCertId: parseCertId,
    isValidCertId: isValidCertId,
    istParts: istParts,
    istDayKey: istDayKey,
    msUntilIstMidnight: msUntilIstMidnight,
    getPaper: getPaper,
    maxMarksFor: maxMarksFor,
    drawQuestions: drawQuestions,
    drawPaper: drawPaper,
    CBSE_VERIFIED: CBSE_VERIFIED,
    CBSE_UNIT_OF_CHAPTER: CBSE_UNIT_OF_CHAPTER,
    unitOfChapter: unitOfChapter,
    typologyOf: typologyOf,
    questionMarks: questionMarks,
    questionKeyValid: questionKeyValid,
    isExamEligible: isExamEligible,
    QUESTION_TYPES: QUESTION_TYPES,
    AUTO_GRADED_TYPES: AUTO_GRADED_TYPES,
    sanitizeAnswer: sanitizeAnswer,
    isAnswered: isAnswered,
    gradeAnswer: gradeAnswer,
    evaluatePaper: evaluatePaper,
    presentationFor: presentationFor,
    rngForSeed: rngForSeed,
    hash32: hash32,
    shuffleWith: shuffleWith,
    validateCandidateName: validateCandidateName,
    validateSchoolName: validateSchoolName
  };
});
