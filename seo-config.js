/* ============================================================
   ACCOUNTANCY BY ABINASH — CENTRAL SEO ROUTE CONFIGURATION
   ------------------------------------------------------------
   Single source of truth for every route's search metadata:
   title, meta description, canonical path, breadcrumb trail,
   structured-data inputs, and (for public pages) the original
   educational content that tools/build-seo-pages.js prerenders
   into crawlable HTML at a stable, human-readable URL.

   UMD-style: the browser gets window.SEO_CONFIG, Node (tests and
   the build script) gets module.exports. No dependencies.

   All page content below is original teaching material written
   for this project — not copied from any textbook or website.
   ============================================================ */
(function (root, factory) {
  var mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  if (root) root.SEO_CONFIG = mod;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  /* The real deployed origin. Used for canonical URLs, sitemap,
     robots.txt and Open Graph — always absolute. */
  var ORIGIN = "https://accountancybyabhinash.netlify.app";

  var SITE = {
    name: "Accountancy By Abinash",
    defaultTitle: "Class 11 & 12 Accountancy Notes for CBSE | Accountancy By Abinash",
    defaultDescription:
      "Free interactive CBSE Class 11 and Class 12 Accountancy platform: chapter notes, solved numericals, quizzes, flashcards, revision, important questions and an AI Tutor.",
    language: "en-IN",
    ogImage: ORIGIN + "/assets/brand/icon-512.png",
    /* Bump when page content meaningfully changes; feeds sitemap lastmod. */
    releaseDate: "2026-10-17",
    developer: "D. Abhinash Reddy",
    academicSession: "CBSE 2026-27"
  };

  /* Parent trail shared by every Class 11 chapter/resource page. */
  var CLASS_TRAIL = [
    { label: "Home", route: "home" },
    { label: "Class 11 Accountancy", route: "chapters-list" }
  ];

  /* Parent trail shared by every Class 12 chapter/resource page (v83). */
  var CLASS12_TRAIL = [
    { label: "Home", route: "home" },
    { label: "Class 12 Accountancy", route: "chapters-list-12" }
  ];

  /* ------------------------------------------------------------
     Route registry. Keyed by the app's internal route id.
       path      — stable canonical URL (null = hash-only/private)
       noindex   — true for personal/utility views
       inSitemap — true for public indexable pages
       title/description/keywords — unique per route
       h1/lead/sections/faq/related — prerendered page content
     ------------------------------------------------------------ */
  var ROUTES = {

    /* ===================== HOME ===================== */
    "home": {
      path: "/",
      inSitemap: true,
      title: SITE.defaultTitle,
      description: SITE.defaultDescription,
      keywords: ["class 11 accountancy", "class 12 accountancy", "cbse accountancy notes", "accountancy by abhinash", "free accountancy learning"],
      h1: "Class 11 and Class 12 Accountancy Notes, Practice and Revision — Free CBSE Learning Platform",
      lead: "Accountancy By Abhinash is a free, interactive learning platform for CBSE Class 11 and Class 12 Commerce students. It covers both syllabuses in full — 18 Class 11 chapters from Introduction to Accounting to Adjustments in Financial Statements, and 13 Class 12 chapters from Partnership Fundamentals to Computerised Accounting — with chapter notes, solved numericals, quizzes, flashcards, revision sheets, important questions, a timed exam mode and an AI Tutor. Choose your class on your first visit and switch any time. No sign-up, no fees.",
      includeChapterIndex: true,
      chapterIndexClass: "both",
      sections: [
        {
          h2: "What You Get on This Website",
          body:
            "<ul>" +
            "<li><b>Chapter notes</b> — theory, definitions, formats and rules for every chapter of both syllabuses (Class 11 and Class 12), with mind maps for quick visual revision.</li>" +
            "<li><b>Solved examples</b> — journal entries, ledger postings, cash book and trial balance workings, bank reconciliation statements and depreciation on the Class 11 side; goodwill valuation, revaluation and realisation statements, share capital entries, ratios and cash flow on the Class 12 side — each worked step by step.</li>" +
            "<li><b>Practice bank</b> — hundreds of practice questions per chapter with answers and explanations.</li>" +
            "<li><b>Quiz</b> — hundreds of multiple-choice questions with instant feedback, filterable by class and chapter.</li>" +
            "<li><b>Flashcards</b> — decks for every chapter of both classes, for fast revision of definitions, rules and formats.</li>" +
            "<li><b>Formula &amp; format sheet</b> — every formula, format and golden rule in one place.</li>" +
            "<li><b>Important questions</b> — exam-focused question banks chapter by chapter.</li>" +
            "<li><b>Exam Mode</b> — a timed mock exam that scores you and generates a downloadable certificate.</li>" +
            "<li><b>Mistake Book &amp; performance tracking</b> — every wrong answer is recorded automatically so you can revise exactly what you got wrong.</li>" +
            "<li><b>AI Tutor</b> — ask accounting doubts in plain language and get explanations grounded in this site's chapter content.</li>" +
            "</ul>"
        },
        {
          h2: "How to Study on This Site",
          body:
            "<p>Pick your class on your first visit — <a href=\"/class-11-accountancy/\">Class 11 chapter list</a> or <a href=\"/class-12-accountancy/\">Class 12 chapter list</a>. Read the theory and definitions, attempt the solved examples yourself before revealing the solution, then test understanding with the chapter quiz and flashcards. Revise with the <a href=\"/class-11-accountancy/revision/\">quick revision</a> notes and the <a href=\"/class-11-accountancy/formula-sheet/\">formula sheet</a> before exams, and use <a href=\"/class-11-accountancy/exam-mode/\">Exam Mode</a> for full-length timed practice.</p>"
        },
        {
          h2: "Who Is This For?",
          body:
            "<p>Written for CBSE Class 11 and Class 12 Commerce students following the current Accountancy syllabus (academic session 2026-27), and useful for anyone learning double-entry book-keeping from scratch — including students of other boards and teachers looking for clear worked explanations. Everything on the site is free.</p>"
        }
      ],
      faq: [
        { q: "Is Accountancy By Abhinash free to use?", a: "Yes, for both classes. Every chapter note, quiz, flashcard deck, revision sheet and the Exam Mode are completely free, and no account or sign-up is required." },
        { q: "Which syllabus does this website follow?", a: "Both CBSE Accountancy syllabuses for the 2026-27 session — Class 11 (18 chapters) and Class 12 (13 chapters, including both Part B options). Explanations are original teaching material written for this project, not official CBSE publications." },
        { q: "Do I need to create an account?", a: "No. Your progress, bookmarks and mistake book are stored locally on your own device — nothing is uploaded and no login exists." }
      ]
    },

    /* ===================== HUB / RESOURCE PAGES ===================== */
    "chapters-list": {
      path: "/class-11-accountancy/",
      inSitemap: true,
      title: "Class 11 Accountancy Notes: All 18 CBSE Chapters | Accountancy By Abinash",
      description: "Complete index of CBSE Class 11 Accountancy chapter notes — from Introduction to Accounting to Adjustments in Financial Statements, with quizzes and revision.",
      keywords: ["class 11 accountancy notes", "cbse class 11 accountancy chapters", "accountancy chapter wise notes", "class 11 commerce notes"],
      h1: "Class 11 Accountancy — Complete Chapter List (CBSE)",
      lead: "Every chapter of the CBSE Class 11 Accountancy syllabus, in teaching order. Open a chapter for its theory and definitions, mind map, solved examples, practice bank, quiz questions and flashcards.",
      includeChapterIndex: true,
      sections: [
        {
          h2: "How Each Chapter Is Organised",
          body:
            "<p>Each chapter opens with an introduction to orient you, then breaks into focused tabs: <b>Theory &amp; Concepts</b> for definitions and rules with worked examples, a <b>Mind Map</b> for visual revision, <b>Format &amp; Rules</b> for formats and golden rules, a <b>Practice Bank</b> of solved questions, <b>Quick Revision</b> for last-minute recap, plus chapter quiz questions and flashcards. Several chapters add an interactive studio — a Depreciation Lab, an Error Detective, a Statement Builder and an Adjustment Studio — so you learn by doing rather than only reading.</p>"
        },
        {
          h2: "Suggested Study Order",
          body:
            "<p>Follow the chapter order. Chapters 1–4 build the language and logic of accounting (terms, concepts, bases). Chapters 5–10 are the recording cycle — equation, debit and credit rules, journal, ledger and the subsidiary books. Chapters 11–14 cover bank reconciliation, GST, trial balance and depreciation. Chapters 15–18 finish the syllabus with provisions and reserves, rectification of errors, financial statements and the adjustments that connect them.</p>"
        }
      ],
      faq: [
        { q: "How many chapters are there in CBSE Class 11 Accountancy?", a: "The syllabus followed here has 18 chapters, from Introduction to Accounting (Chapter 1) to Adjustment in Preparation of Financial Statements (Chapter 18)." },
        { q: "Can I study a chapter independently, or must I follow the order?", a: "Each chapter page is self-contained with its own definitions, examples and practice, but chapters 5–10 build directly on the vocabulary of chapters 1–4, so following the order works best the first time through." },
        { q: "Are the notes enough for exam revision?", a: "The quick revision tab of each chapter, plus the formula sheet and important questions, are designed as revision tools — but they summarise the chapter, so use them after studying the full notes at least once." }
      ]
    },

    "quiz": {
      path: "/class-11-accountancy/quiz/",
      inSitemap: true,
      title: "Class 11 Accountancy MCQs with Answers (500+) | Accountancy By Abinash",
      description: "Practice 500+ Class 11 Accountancy MCQs with instant answers and explanations. Filter by chapter, from Accounting Equation to Adjustments in Financial Statements.",
      keywords: ["class 11 accountancy mcq", "accountancy mcq with answers", "class 11 commerce mcq", "accountancy quiz online free"],
      h1: "Class 11 Accountancy MCQ Quiz — 500+ Questions with Answers",
      lead: "A free multiple-choice quiz covering every chapter of the CBSE Class 11 Accountancy syllabus. Answer, get an instant explanation, and let wrong answers flow into your Mistake Book for revision.",
      sections: [
        {
          h2: "How the Quiz Works",
          body:
            "<p>Choose a chapter filter or attempt a mixed quiz across all 18 chapters. Each question is graded immediately with a short explanation of why the answer is right — definitions, rules and calculations are both covered. Questions you get wrong are added to your Mistake Book automatically, with a mastery streak that clears them once you answer correctly twice in a row.</p>"
        },
        {
          h2: "Which Chapters Are Covered?",
          body:
            "<p>Every chapter: accounting terms, theory base and accounting standards, bases of accounting, the accounting equation, debit and credit rules, journal, ledger, cash book, other subsidiary books, bank reconciliation statement, GST accounting, trial balance, depreciation, provisions and reserves, rectification of errors, financial statements of sole proprietorship and adjustments in financial statements.</p>"
        }
      ],
      faq: [
        { q: "Are answers explained, not just marked right or wrong?", a: "Yes — every question shows a short explanation after you answer, so a wrong attempt still teaches you the concept." },
        { q: "Can I attempt a mixed quiz across all chapters?", a: "Yes. Choose the 'all chapters' option for a round-robin mix, or filter to a single chapter for focused practice." },
        { q: "Where do my mistakes go?", a: "Every wrong answer is recorded in your Mistake Book (stored on your device) so you can revise exactly what you got wrong before an exam." }
      ],
      related: [{ label: "Flashcards for quick revision", route: "flashcards" }, { label: "Important questions for exams", route: "important-questions" }]
    },

    "flashcards": {
      path: "/class-11-accountancy/flashcards/",
      inSitemap: true,
      title: "Class 11 Accountancy Flashcards for Quick Revision | Accountancy By Abinash",
      description: "360+ free Class 11 Accountancy flashcards — 20 per chapter — covering definitions, golden rules, formats and formulas for fast CBSE revision.",
      keywords: ["class 11 accountancy flashcards", "accountancy revision cards", "accountancy definition cards", "class 11 commerce revision"],
      h1: "Class 11 Accountancy Flashcards — 360+ Cards for Quick Revision",
      lead: "Twenty revision flashcards for every chapter of the CBSE Class 11 Accountancy syllabus: definitions, rules, formats and formulas. Flip, self-grade and track which chapters you have mastered.",
      sections: [
        {
          h2: "How to Use Flashcards Effectively",
          body:
            "<p>Read the front, answer out loud, then flip to check. Grade yourself honestly — the deck remembers which chapters you are weak in and shows your mastery percentage per chapter. Use flashcards for 10-minute daily revision, right before a quiz, or as a final sweep before an exam alongside the <a href=\"/class-11-accountancy/revision/\">quick revision notes</a>.</p>"
        }
      ],
      faq: [
        { q: "How many flashcards are there?", a: "360+ cards — 20 for each of the 18 chapters." },
        { q: "Are the cards based on the CBSE syllabus?", a: "Yes. Cards cover the definitions, rules, formats and formulas of the CBSE Class 11 Accountancy syllabus, written as original study material for this site." }
      ],
      related: [{ label: "Quiz with 500+ MCQs", route: "quiz" }, { label: "Quick revision notes", route: "revision" }]
    },

    "revision": {
      path: "/class-11-accountancy/revision/",
      inSitemap: true,
      title: "Class 11 Accountancy Revision Notes & Quick Recap | Accountancy By Abinash",
      description: "Fast chapter-by-chapter revision for CBSE Class 11 Accountancy — key definitions, rules, formats and worked logic in one place for last-minute exam prep.",
      keywords: ["class 11 accountancy revision notes", "accountancy quick revision", "class 11 accountancy summary", "accountancy exam prep"],
      h1: "Class 11 Accountancy — Quick Revision Notes",
      lead: "Condensed revision for every chapter: the definitions, rules, formats and logic you need in the final days before an exam, with links back to the full chapter notes when a topic needs a deeper read.",
      sections: [
        {
          h2: "How to Revise Class 11 Accountancy in the Last Few Days",
          body:
            "<p>Work through the chapters in syllabus order. For each: skim the quick revision card, attempt the flashcards cold, then re-attempt questions you previously got wrong from your Mistake Book. Finish with the <a href=\"/class-11-accountancy/formula-sheet/\">formula and format sheet</a> and one timed <a href=\"/class-11-accountancy/exam-mode/\">Exam Mode</a> attempt to rehearse exam pacing.</p>"
        }
      ],
      faq: [
        { q: "What is the fastest way to revise Class 11 Accountancy?", a: "Chapter quick-revision cards → flashcards → your Mistake Book → formula sheet → one timed mock exam. This order fixes weak spots first and leaves recall practice for last." },
        { q: "Are revision notes a substitute for studying the chapter?", a: "No. They summarise each chapter for recall. Study the full chapter notes at least once before relying on revision summaries." }
      ]
    },

    "important-questions": {
      path: "/class-11-accountancy/important-questions/",
      inSitemap: true,
      title: "Class 11 Accountancy Important Questions | Accountancy By Abinash",
      description: "Chapter-wise important questions for CBSE Class 11 Accountancy — exam-focused questions with answers across all 18 chapters, from journal entries to financial statements.",
      keywords: ["class 11 accountancy important questions", "accountancy exam questions class 11", "cbse accountancy question bank", "class 11 accountancy practice questions"],
      h1: "Class 11 Accountancy Important Questions — Chapter-wise Question Bank",
      lead: "Exam-focused questions for every chapter of the CBSE Class 11 Accountancy syllabus, with answers. Practise the questions most likely to test core concepts — journal entries, ledger posting, reconciliation, depreciation and financial statement preparation.",
      sections: [
        {
          h2: "How to Practise These Questions",
          body:
            "<p>Attempt each question on paper (or on the built-in scratch pad and whiteboard) before revealing the answer. Mark questions you could not complete and let the <a href=\"/class-11-accountancy/revision/\">revision notes</a> and flashcards cover the theory behind them. Two honest timed attempts beat five careless ones.</p>"
        }
      ],
      faq: [
        { q: "Are these official CBSE board questions?", a: "No. These are original practice questions written for this site, modelled on the kinds of problems the syllabus requires — not leaked or official board papers, and not a prediction of any exam." }
      ],
      related: [{ label: "Quiz with answers", route: "quiz" }, { label: "Formula & format sheet", route: "formula-sheet" }]
    },

    "formula-sheet": {
      path: "/class-11-accountancy/formula-sheet/",
      inSitemap: true,
      title: "Class 11 Accountancy Formula Sheet | Accountancy By Abinash",
      description: "Complete Class 11 Accountancy formula and format sheet — accounting equation, golden rules, depreciation formulas, financial statement formats and adjustment treatments.",
      keywords: ["class 11 accountancy formulas", "accountancy format sheet", "accounting golden rules", "depreciation formulas class 11", "trading account format"],
      h1: "Class 11 Accountancy Formula &amp; Format Sheet",
      lead: "Every formula, account format and golden rule of the CBSE Class 11 Accountancy syllabus in one place: the accounting equation, debit–credit rules, depreciation methods, cash book and bank reconciliation formats, and the trading account, profit &amp; loss account and balance sheet structures.",
      sections: [
        {
          h2: "The Formulas Every Class 11 Student Should Know",
          body:
            "<ul>" +
            "<li><b>Accounting equation:</b> Assets = Capital + Liabilities</li>" +
            "<li><b>Gross profit (Trading A/c):</b> Net Sales − Cost of Goods Sold, where Cost of Goods Sold = Opening Stock + Purchases + Direct Expenses − Closing Stock</li>" +
            "<li><b>Net profit:</b> Gross Profit − Indirect Expenses + Indirect Income</li>" +
            "<li><b>Depreciation (Straight Line Method):</b> (Cost − Residual Value) ÷ Useful Life</li>" +
            "<li><b>Written Down Value:</b> Book value at year start − Depreciation for the year</li>" +
            "<li><b>Bank reconciliation balance (from pass book):</b> Balance per pass book + deposits not yet credited + bank charges not recorded − cheques issued not yet presented (adjust signs to the given direction)</li>" +
            "</ul>" +
            "<p>Full formats — including the three-column cash book, ledger, journal, trial balance, trading account, profit &amp; loss account and balance sheet — are inside the formula sheet page.</p>"
        }
      ],
      faq: [
        { q: "Is the formula sheet enough for numericals?", a: "Formulas give you the tool, not the method. Practise full numericals from each chapter's practice bank so you learn when to apply which formula." },
        { q: "Which depreciation method does CBSE Class 11 use?", a: "Both straight line method (SLM) and written down value method (WDV) are in the syllabus. SLM charges a fixed amount every year; WDV charges a fixed rate on the reducing book value." }
      ]
    },

    "accounting-cycle": {
      path: "/class-11-accountancy/accounting-cycle/",
      inSitemap: true,
      title: "Accounting Cycle: Journal to Financial Statements | Accountancy By Abinash",
      description: "Understand the full accounting cycle — how a business transaction travels from source document to journal, ledger, trial balance and final accounts, step by step.",
      keywords: ["accounting cycle class 11", "steps of accounting process", "journal to balance sheet", "accounting process explained"],
      h1: "The Accounting Cycle — From Transaction to Financial Statements",
      lead: "The accounting cycle is the sequence every business follows: identify a transaction, record it in the journal, post it to the ledger, extract a trial balance, apply year-end adjustments, and prepare the financial statements. This page walks through each step with a worked transaction.",
      sections: [
        {
          h2: "The Eight Steps of the Accounting Cycle",
          body:
            "<ol>" +
            "<li><b>Identify the transaction</b> — only events measurable in money are recorded.</li>" +
            "<li><b>Record in the journal</b> — every transaction becomes a double entry with a narration.</li>" +
            "<li><b>Post to the ledger</b> — journal entries are transferred to individual accounts.</li>" +
            "<li><b>Prepare a trial balance</b> — list ledger balances to check arithmetic accuracy.</li>" +
            "<li><b>Make adjustments</b> — closing stock, outstanding and prepaid expenses, depreciation and bad debts at year end.</li>" +
            "<li><b>Prepare the Trading Account</b> — to find gross profit.</li>" +
            "<li><b>Prepare the Profit &amp; Loss Account</b> — to find net profit or net loss.</li>" +
            "<li><b>Prepare the Balance Sheet</b> — to show the financial position on the last day.</li>" +
            "</ol>"
        },
        {
          h2: "One Transaction, All the Way Through",
          body:
            "<p>Example: goods worth ₹20,000 are bought on credit from Ramesh. The <b>journal</b> records Purchases A/c Dr ₹20,000, to Ramesh A/c ₹20,000. The <b>ledger</b> debits the Purchases account and credits Ramesh's account. Both balances appear in the <b>trial balance</b>. At year end, if the goods are unsold they form part of <b>closing stock</b>, which appears as a credit in the Trading Account and an asset in the <b>Balance Sheet</b> — the two-effect rule that connects the cycle's end back to its start.</p>"
        }
      ],
      faq: [
        { q: "What is the correct order of the accounting cycle?", a: "Journal → ledger → trial balance → year-end adjustments → trading account → profit &amp; loss account → balance sheet (with closing entries and the reversal of the opening entry at the end)." },
        { q: "Why is the trial balance needed before final accounts?", a: "It proves that total debits equal total credits across all ledger accounts, catching arithmetic slips before they reach the financial statements." }
      ]
    },

    "exam-mode": {
      path: "/class-11-accountancy/exam-mode/",
      inSitemap: true,
      title: "Class 11 Accountancy Timed Practice Exam | Accountancy By Abinash",
      description: "Take a timed Class 11 Accountancy mock exam — mixed or chapter-specific, auto-scored, with a downloadable certificate and a review of every question you got wrong.",
      keywords: ["class 11 accountancy mock test", "accountancy practice exam", "accountancy timed test", "accountancy exam practice online"],
      h1: "Class 11 Accountancy Exam Mode — Timed Mock Exams with Certificates",
      lead: "Practise real exam conditions: a timer, mixed questions across all 18 chapters or a single chapter, instant scoring, and a downloadable certificate when you finish. Every mistake is saved to your Mistake Book for targeted revision.",
      sections: [
        {
          h2: "What Happens in Exam Mode",
          body:
            "<p>Choose your chapters, question count and time limit. The exam draws questions round-robin across chapters so no topic dominates. Navigation is logged while the timer runs, answers are locked when time expires, and the result screen explains every question. Your score, time used and certificate are stored on your device — nothing is uploaded.</p>"
        }
      ],
      faq: [
        { q: "Is Exam Mode like the real board exam?", a: "It mimics the pressure — timed, mixed-syllabus, auto-scored — but the question style is this site's own practice material, not actual CBSE board papers." },
        { q: "Can I retake an exam?", a: "Yes, as many times as you like. Repeating a mixed exam after revising your Mistake Book is one of the most effective ways to raise your score." }
      ]
    },

    "ai-tutor": {
      path: "/ai-tutor/",
      inSitemap: true,
      title: "AI Tutor for Class 11 Accountancy — Ask Doubts | Accountancy By Abinash",
      description: "Free AI Tutor for Class 11 Accountancy: ask doubts in plain language, get step-by-step explanations, hints and solutions grounded in this site's chapter content.",
      keywords: ["ai tutor accountancy", "class 11 accountancy doubts", "accountancy solver online", "ask accounting questions free"],
      h1: "AI Tutor for Class 11 Accountancy",
      lead: "Stuck on a journal entry, a reconciliation difference or a depreciation numerical? Ask the AI Tutor in plain language. It detects the topic, walks through the working step by step, and links back to the relevant chapter notes — designed as a learning assistant that shows its reasoning, not a shortcut that hides it.",
      sections: [
        {
          h2: "What the AI Tutor Can Help With",
          body:
            "<ul>" +
            "<li><b>Numericals</b> — type a question (or paste figures) and get a step-by-step working with the final answer, plus a hint-only mode if you want to try first.</li>" +
            "<li><b>Concepts</b> — definitions and explanations for every chapter, from the accounting equation to adjustments.</li>" +
            "<li><b>Topic detection</b> — it identifies whether your doubt belongs to BRS, GST, depreciation, journal, ledger or another topic and answers in that context.</li>" +
            "</ul>" +
            "<p><b>Honest limitation:</b> the tutor is an automated assistant. Its workings are usually reliable for syllabus-level questions, but always verify figures against your textbook — treat it as a patient practice partner, not an examiner.</p>"
        }
      ],
      faq: [
        { q: "Is the AI Tutor free?", a: "Yes, free on this site with no sign-up." },
        { q: "Can the AI Tutor replace studying the chapters?", a: "No. It is best used to unblock a specific doubt while working through the chapter notes and practice bank." }
      ]
    },

    "about": {
      path: "/about/",
      inSitemap: true,
      title: "About This Free Class 11 Accountancy Platform | Accountancy By Abinash",
      description: "What Accountancy By Abinash is: a free, no-signup interactive learning platform for CBSE Class 11 Accountancy, built by D. Abhinash Reddy with original study material.",
      keywords: ["about accountancy by abhinash", "free class 11 accountancy platform", "interactive accountancy learning"],
      h1: "About Accountancy By Abinash",
      lead: "A free, interactive learning platform built to help Class 11 Commerce students learn, practice, revise and understand Accountancy in one place — instead of jumping between a textbook, videos, a doubt app and a revision notebook.",
      sections: [
        {
          h2: "What This Website Offers",
          body:
            "<p>Chapter learning with theory and concepts, numerical practice with step-by-step solutions, interactive tools (a Depreciation Lab and detective-style case challenges for Bank Reconciliation, GST billing and Trial Balance), quizzes, flashcards, formula revision, important questions, a timed Exam Mode with downloadable certificates, a Mistake Book that tracks and revisits your wrong answers, bookmarks, performance tracking and an AI-powered tutor — covering all 18 chapters of the CBSE Class 11 Accountancy syllabus.</p>"
        },
        {
          h2: "Who Built It and How Content Is Made",
          body:
            "<p>Designed and developed by <b>D. Abhinash Reddy</b> as an independent personal project — not a company product, and still evolving. All explanations, examples and questions on the site are original study material written for this platform; nothing is copied from textbooks or other websites. Syllabus coverage follows the CBSE Class 11 Accountancy curriculum (academic session 2026-27), but the site is not an official CBSE publication and claims no board endorsement. Your data — progress, bookmarks, mistakes — stays in your own browser; there are no accounts and nothing is uploaded.</p>"
        },
        {
          h2: "How to Use the Site",
          body:
            "<p>1. Pick a chapter. 2. Learn the concepts in Theory &amp; Concepts. 3. Practise numericals before revealing solutions. 4. Ask the AI Tutor when stuck. 5. Test with the quiz or Exam Mode. 6. Revise with flashcards, the formula sheet and your Mistake Book. 7. Track progress with XP, streaks and chapter percentages.</p>"
        }
      ],
      faq: [
        { q: "Is this an official CBSE website?", a: "No. It is an independent, free study platform that follows the CBSE Class 11 Accountancy syllabus. It is not affiliated with or endorsed by CBSE." },
        { q: "Is the content original?", a: "Yes. All explanations, examples, questions and flashcards were written for this platform. External references are credited where used." },
        { q: "How is the website funded?", a: "It is a free personal project. There are no paid tiers and no student data is collected or sold — everything you do stays in your browser." }
      ]
    },

    /* ===================== CHAPTER 1 ===================== */
    "ch-intro": {
      path: "/class-11-accountancy/introduction-to-accounting/",
      inSitemap: true,
      title: "Introduction to Accounting Class 11: Notes | Accountancy By Abinash",
      description: "Free Class 11 notes on Introduction to Accounting — what accounting is, its objectives, book-keeping vs accounting, and who uses accounting information, with examples.",
      keywords: ["introduction to accounting class 11", "what is accounting", "objectives of accounting", "book keeping vs accounting"],
      h1: "Introduction to Accounting — Class 11 Accountancy Notes (CBSE)",
      lead: "Chapter 1 of CBSE Class 11 Accountancy explains what accounting is, why businesses keep financial records, and who reads them. This page covers the definition, objectives, book-keeping versus accounting, and the basic terminology you will use all year.",
      sections: [
        {
          h2: "What Is Accounting?",
          body:
            "<p>Accounting is the process of <b>identifying, measuring, recording and communicating</b> the financial results of a business's economic transactions to interested users. In plain terms: a business writes down what happened with money, measures it in rupees, summarises it, and reports it so that owners and others can make decisions.</p>" +
            "<p>Every recorded event must be measurable in money — hiring a manager is important, but it enters the accounting records only when it is paid for.</p>"
        },
        {
          h2: "Objectives of Accounting",
          body:
            "<ol>" +
            "<li><b>Systematic records</b> — memory is unreliable; books keep a permanent, verifiable history.</li>" +
            "<li><b>Profit or loss</b> — the Trading and Profit &amp; Loss Account shows whether the business earned a profit or suffered a loss.</li>" +
            "<li><b>Financial position</b> — the Balance Sheet shows what the business owns and owes on a given date.</li>" +
            "<li><b>Assisting decisions</b> — owners, banks and tax authorities use the reports to plan and decide.</li>" +
            "<li><b>Legal and tax compliance</b> — proper records support GST filings, audits and statutory requirements.</li>" +
            "</ol>"
        },
        {
          h2: "Book-Keeping vs Accounting",
          body:
            "<p><b>Book-keeping</b> is the <i>recording</i> stage — journal and ledger work. <b>Accounting</b> is broader: it includes summarising, analysing and communicating the recorded information. Book-keeping is the foundation; accounting is the structure built on it. In small businesses one person often does both.</p>"
        }
      ],
      faq: [
        { q: "Who uses accounting information?", a: "Owners, managers, banks and lenders, investors, the government (tax and regulation) and creditors — anyone whose decision depends on the business's financial performance and position." },
        { q: "Is every business event recorded in accounting?", a: "No. Only economic events measurable in money are recorded. Qualitative events like staff morale matter to managers but not to the books." },
        { q: "What comes after recording in the accounting process?", a: "Classifying (ledger), summarising (trial balance and financial statements), analysing and communicating — the accounting cycle covered later in this site." }
      ],
      related: [{ label: "Basic Accounting Terms", route: "ch-terms" }, { label: "The Accounting Cycle", route: "accounting-cycle" }]
    },

    /* ===================== CHAPTER 2 ===================== */
    "ch-terms": {
      path: "/class-11-accountancy/accounting-terms/",
      inSitemap: true,
      title: "Basic Accounting Terms Class 11 Notes | Accountancy By Abinash",
      description: "Class 11 notes on basic accounting terms — capital, assets, liabilities, revenue, expenses, debtors and creditors — each defined with simple examples.",
      keywords: ["basic accounting terms class 11", "capital and drawings", "assets and liabilities meaning", "accounting terminology"],
      h1: "Basic Accounting Terms — Class 11 Accountancy Notes (CBSE)",
      lead: "Chapter 2 defines the vocabulary every accountant uses: entity, capital, drawings, assets, liabilities, revenue, expenses, goods, transactions, debtors and creditors. Clear definitions with examples, and the links between them.",
      sections: [
        {
          h2: "Capital, Drawings and the Business Entity",
          body:
            "<p>Under the <b>business entity concept</b>, the business is treated as separate from its owner. What the owner invests is <b>capital</b> (a liability of the business to the owner); what the owner withdraws for personal use is <b>drawings</b>, which reduce capital. Capital is not revenue — an investment is not income.</p>" +
            "<p>Example: Meera invests ₹3,00,000 to start a shop. Capital = ₹3,00,000. She later withdraws ₹5,000 for personal use. Drawings = ₹5,000; her capital reduces to ₹2,95,000.</p>"
        },
        {
          h2: "Assets, Liabilities and the Accounting Equation",
          body:
            "<p><b>Assets</b> are resources owned that give future benefit — cash, stock, furniture, debtors. <b>Liabilities</b> are amounts owed to outsiders — creditors, loans, bills payable. The relationship is the accounting equation: <b>Assets = Capital + Liabilities</b>.</p>" +
            "<p>Assets are classified as fixed (long-term, like machinery), current (converted to cash within a year, like stock), tangible (physical, like furniture) and intangible (non-physical but valuable, like goodwill).</p>"
        },
        {
          h2: "Revenue, Expenses, Profit and Loss",
          body:
            "<p><b>Revenue/income</b> is what the business earns from selling goods or services (sales, commission received). <b>Expenses</b> are costs incurred to earn that revenue (rent, salaries, depreciation). When revenue exceeds expenses there is <b>profit</b>; the reverse is a <b>loss</b>. Expenses are matched against the revenue of the same period — never against capital.</p>" +
            "<p><b>Debtors</b> are people who owe the business money (goods sold on credit); <b>creditors</b> are people the business owes money to (goods bought on credit). <b>Goods</b> means stock-in-trade bought for resale — not fixed assets like furniture.</p>"
        }
      ],
      faq: [
        { q: "Is capital the same as profit?", a: "No. Capital is the owner's investment (a liability to the business); profit is the excess of revenue over expenses, which increases capital." },
        { q: "What is the difference between an asset and an expense?", a: "An asset gives benefit over many years (machinery); an expense is a cost consumed in earning revenue this year (rent). A ₹50,000 machine is an asset; a ₹5,000 annual repair is an expense." },
        { q: "Who is a creditor and who is a debtor?", a: "A creditor is someone the business owes money to (a supplier of credit goods); a debtor is someone who owes the business money (a customer who bought on credit)." }
      ],
      related: [{ label: "Accounting Equation", route: "ch-eq" }, { label: "Introduction to Accounting", route: "ch-intro" }]
    },

    /* ===================== CHAPTER 3 ===================== */
    "ch-tbase": {
      path: "/class-11-accountancy/theory-base-of-accounting/",
      inSitemap: true,
      title: "Theory Base of Accounting Class 11: Concepts | Accountancy By Abinash",
      description: "Class 11 notes on the theory base of accounting — GAAP, accounting concepts and conventions, and Indian Accounting Standards (Ind AS), explained with examples.",
      keywords: ["theory base of accounting class 11", "accounting concepts class 11", "gaap india", "ind as accounting standards", "accounting conventions"],
      h1: "Theory Base of Accounting, Concepts &amp; Standards — Class 11 Notes (CBSE)",
      lead: "Chapter 3 explains the foundation every accounting rule rests on: the concepts and conventions of accounting, the framework known as GAAP, and the Accounting Standards issued in India that make financial statements comparable across companies.",
      sections: [
        {
          h2: "What Are Accounting Concepts and Conventions?",
          body:
            "<p><b>Concepts</b> are the basic assumptions on which the books rest: <b>business entity</b> (business ≠ owner), <b>going concern</b> (the business will continue), <b>money measurement</b> (only monetary events are recorded), <b>accounting period</b> (results are reported in yearly slices), <b>cost concept</b> (assets record at cost), <b>dual aspect</b> (every transaction has two sides — the basis of double entry), <b>revenue recognition</b> (revenue is recorded when earned, not when paid) and <b>matching</b> (expenses are matched to the revenue of the same period).</p>"
        },
        {
          h2: "Conventions and Qualitative Characteristics",
          body:
            "<p><b>Conventions</b> are widely accepted practices: <b>full disclosure</b> (report everything that affects understanding), <b>consistency</b> (use the same method year to year), <b>prudence/conservatism</b> (anticipate no profit, but provide for all possible losses) and <b>materiality</b> (give proper treatment to items that influence decisions).</p>"
        },
        {
          h2: "Accounting Standards in India",
          body:
            "<p><b>GAAP</b> (Generally Accepted Accounting Principles) is the common framework that makes financial statements comparable. In India, the <b>Institute of Chartered Accountants of India (ICAI)</b> issues <b>Accounting Standards (AS)</b>, and <b>Ind AS</b> (Indian Accounting Standards), converged with international standards, for specified classes of companies. Standards reduce creative accounting and let investors compare companies on the same basis.</p>"
        }
      ],
      faq: [
        { q: "What is GAAP?", a: "Generally Accepted Accounting Principles — the common set of concepts, conventions and rules that underlie financial accounting everywhere, so that statements prepared by different businesses are comparable." },
        { q: "What is the difference between a concept and a convention?", a: "A concept is a foundational assumption (for example, going concern). A convention is an accepted practice followed for reliability and comparability (for example, prudence or consistency)." },
        { q: "Who issues accounting standards in India?", a: "The Institute of Chartered Accountants of India (ICAI) issues both AS and Ind AS. Specified companies apply Ind AS; others apply AS, subject to the Companies Act and SEBI requirements." }
      ],
      related: [{ label: "Bases of Accounting", route: "ch-basis" }, { label: "Basic Accounting Terms", route: "ch-terms" }]
    },

    /* ===================== CHAPTER 4 ===================== */
    "ch-basis": {
      path: "/class-11-accountancy/bases-of-accounting/",
      inSitemap: true,
      title: "Bases of Accounting Class 11: Cash & Accrual | Accountancy By Abinash",
      description: "Class 11 notes on bases of accounting — cash basis, accrual basis and hybrid basis — with a worked comparison showing how each reports profit differently.",
      keywords: ["bases of accounting class 11", "cash basis vs accrual basis", "accrual accounting meaning", "hybrid basis accounting"],
      h1: "Bases of Accounting — Cash &amp; Accrual Basis Class 11 Notes (CBSE)",
      lead: "Chapter 4 compares the three bases of accounting. The cash basis records income and expenses only when money actually moves; the accrual basis records them when they are earned or incurred, whatever the payment date. The difference decides when profit appears.",
      sections: [
        {
          h2: "Cash Basis, Accrual Basis and Hybrid",
          body:
            "<p><b>Cash basis:</b> income is recorded when cash is received, expenses when cash is paid. Simple, but it mixes next year's money into this year's results and cannot show credit transactions properly.</p>" +
            "<p><b>Accrual basis:</b> income is recorded when <i>earned</i> and expenses when <i>incurred</i>, regardless of when cash changes hands. This matches the matching concept and is the basis required by accounting standards — CBSE problems assume accrual unless stated otherwise.</p>" +
            "<p><b>Hybrid basis:</b> a mixture of the two (for example, cash basis for expenses and accrual for income). It has no theoretical standing but exists in practice.</p>"
        },
        {
          h2: "Worked Comparison",
          body:
            "<p>In March 2026 a shop makes sales of ₹40,000, of which ₹30,000 is collected in March and ₹10,000 in April. Rent for March of ₹5,000 is paid in April.</p>" +
            "<ul>" +
            "<li><b>Cash basis income:</b> ₹30,000 (only what was collected). Expense: ₹0. Profit shown: ₹30,000.</li>" +
            "<li><b>Accrual basis income:</b> ₹40,000 (all of it earned in March). Expense: ₹5,000 (incurred in March). Profit: ₹35,000.</li>" +
            "</ul>" +
            "<p>Same business, same cash — two different profits. That is why the basis must be stated.</p>"
        }
      ],
      faq: [
        { q: "Which basis is followed in CBSE Class 11 problems?", a: "Unless a question says otherwise, assume the accrual basis — income when earned, expenses when incurred." },
        { q: "Why is cash basis considered less reliable?", a: "It lets timing of payments distort results: a business can look profitable simply because debtors paid early, or unprofitable because a big expense was prepaid." },
        { q: "What is an example of hybrid basis?", a: "A shop that records sales when cash is received (cash basis) but records credit purchases when invoiced (accrual basis) — a mixture with no single theoretical foundation." }
      ],
      related: [{ label: "Theory Base of Accounting", route: "ch-tbase" }, { label: "Financial Statements of Sole Proprietorship", route: "ch-fs" }]
    },

    /* ===================== CHAPTER 5 ===================== */
    "ch-eq": {
      path: "/class-11-accountancy/accounting-equation/",
      inSitemap: true,
      title: "Accounting Equation Class 11: Notes & Examples | Accountancy By Abinash",
      description: "Free Class 11 notes on the accounting equation — Assets = Capital + Liabilities — with a step-by-step worked example showing how each transaction affects the equation.",
      keywords: ["accounting equation class 11", "assets capital liabilities equation", "accounting equation examples", "effect of transactions on accounting equation"],
      h1: "Accounting Equation — Class 11 Accountancy Notes, Examples &amp; Questions (CBSE)",
      lead: "The accounting equation is the backbone of double-entry book-keeping: <b>Assets = Capital + Liabilities</b>. Every transaction keeps it balanced. Chapter 5 of CBSE Class 11 Accountancy shows how, with a series of transactions you can apply one by one.",
      sections: [
        {
          h2: "What Is the Accounting Equation and Why Does It Always Balance?",
          body:
            "<p>Everything a business owns (assets) is funded either by the owner (capital) or by outsiders (liabilities). So the two sides must always be equal. A transaction may change assets, capital and liabilities — but never in a way that breaks the balance, because every transaction has two effects of equal amount (the dual aspect concept).</p>"
        },
        {
          h2: "Rules for Applying Transactions",
          body:
            "<ul>" +
            "<li>Capital increases with profit and investments; it decreases with drawings and losses.</li>" +
            "<li>If an asset increases, another asset decreases, or capital/liabilities increase by the same amount.</li>" +
            "<li>If a liability increases, an asset increases by the same amount (or another liability decreases).</li>" +
            "</ul>"
        },
        {
          h2: "Worked Example — Step by Step",
          body:
            "<p>Start: A starts business with cash ₹2,00,000 and furniture ₹50,000.</p>" +
            "<ul>" +
            "<li>Assets (cash 2,00,000 + furniture 50,000) = 2,50,000 = Capital 2,50,000 ✓</li>" +
            "<li>Goods worth ₹20,000 bought on credit: stock rises 20,000, creditors rise 20,000 → Assets 2,70,000 = Capital 2,50,000 + Liabilities 20,000 ✓</li>" +
            "<li>Cash ₹10,000 paid to a creditor: cash falls 10,000, creditor falls 10,000 → Assets 2,60,000 = Capital 2,50,000 + Liabilities 10,000 ✓</li>" +
            "</ul>" +
            "<p>The equation survived every transaction because each had two equal effects.</p>"
        }
      ],
      faq: [
        { q: "What is the accounting equation in simple words?", a: "Assets = Capital + Liabilities — what the business owns equals what the owner and creditors have funded." },
        { q: "Can the equation ever be unequal?", a: "No, in valid double entry. If your totals differ, either a transaction was recorded with unequal sides or a figure was posted wrongly — that is exactly what a trial balance later checks." },
        { q: "How does profit affect the equation?", a: "Profit increases capital, which increases the right side; the matching increase appears on the asset side (cash or debtors). Loss does the reverse." }
      ],
      related: [{ label: "Rules of Debit &amp; Credit", route: "ch-dc" }, { label: "Journal", route: "ch-jr" }, { label: "Basic Accounting Terms", route: "ch-terms" }]
    },

    /* ===================== CHAPTER 6 ===================== */
    "ch-dc": {
      path: "/class-11-accountancy/debit-and-credit/",
      inSitemap: true,
      title: "Rules of Debit and Credit Class 11 | Accountancy By Abinash",
      description: "Class 11 notes on the rules of debit and credit — golden rules for personal, real and nominal accounts, and the modern rules, with clear examples.",
      keywords: ["rules of debit and credit class 11", "golden rules of accounting", "debit and credit meaning", "personal real nominal accounts"],
      h1: "Rules of Debit &amp; Credit — Class 11 Accountancy Notes (CBSE)",
      lead: "Every journal entry depends on knowing which account to debit and which to credit. Chapter 6 teaches both approaches: the traditional golden rules (classified by account type) and the modern rules (classified by what the item is — asset, liability, income or expense).",
      sections: [
        {
          h2: "What Do Debit and Credit Actually Mean?",
          body:
            "<p>Debit simply means an entry on the <b>left</b> side of an account; credit means an entry on the <b>right</b>. They do not inherently mean good or bad, gain or loss — the effect depends on the type of account. Every transaction has one debit and one credit of equal total (double entry).</p>"
        },
        {
          h2: "The Golden Rules (Traditional Approach)",
          body:
            "<ul>" +
            "<li><b>Personal account</b> (people and firms): <i>Debit the receiver, credit the giver.</i></li>" +
            "<li><b>Real account</b> (assets/property): <i>Debit what comes in, credit what goes out.</i></li>" +
            "<li><b>Nominal account</b> (expenses, losses, incomes, gains): <i>Debit all expenses and losses, credit all incomes and gains.</i></li>" +
            "</ul>"
        },
        {
          h2: "The Modern Rules (By Account Element)",
          body:
            "<ul>" +
            "<li><b>Asset</b> — increase: debit; decrease: credit.</li>" +
            "<li><b>Liability</b> — increase: credit; decrease: debit.</li>" +
            "<li><b>Capital</b> — increase: credit; decrease: debit.</li>" +
            "<li><b>Income/Gain</b> — increase: credit.</li>" +
            "<li><b>Expense/Loss</b> — increase: debit.</li>" +
            "</ul>" +
            "<p>Example: goods bought for cash ₹5,000. Purchases (expense/nominal) is debited; Cash (asset/real) is credited — both approaches agree.</p>"
        }
      ],
      faq: [
        { q: "Does credit mean the business earned money?", a: "Not always. Credit is just the right-hand side. A credit to cash means cash went out; a credit to sales means revenue was earned." },
        { q: "Which approach should I memorise — golden or modern rules?", a: "Learn whichever clicks first, but be able to use both: CBSE questions and later chapters use the golden classification (personal/real/nominal), while final accounts are easier with the modern elements (asset/liability/income/expense)." },
        { q: "Why is a person's account sometimes not used even though a person is involved?", a: "Under the modern approach you think in elements: buying goods on credit raises the liability 'creditors' rather than naming each person, though in journal entries the individual creditor is usually named." }
      ],
      related: [{ label: "Journal", route: "ch-jr" }, { label: "Accounting Equation", route: "ch-eq" }]
    },

    /* ===================== CHAPTER 7 ===================== */
    "ch-jr": {
      path: "/class-11-accountancy/journal/",
      inSitemap: true,
      title: "Journal Entries Class 11 with Solutions | Accountancy By Abinash",
      description: "Class 11 journal notes with solved entries — journal format, narration, compound entries and the rules applied to everyday transactions, step by step.",
      keywords: ["journal entries class 11", "journal format", "solved journal entries", "narration in journal", "compound journal entry"],
      h1: "Journal &amp; Journal Entries — Class 11 Accountancy Notes with Solutions (CBSE)",
      lead: "The journal is the book of original entry: every transaction is recorded here first, in double entry, with a short explanation called a narration. Chapter 7 teaches the format, the reasoning behind each entry, and worked solutions for common transactions.",
      sections: [
        {
          h2: "Journal Format",
          body:
            "<p>Columns: <b>Date</b> · <b>Particulars</b> (debit account first, then 'To' the credit account, then the narration in brackets) · <b>L.F.</b> · <b>Debit (₹)</b> · <b>Credit (₹)</b>. One transaction = one entry block. Debit total always equals credit total.</p>"
        },
        {
          h2: "Worked Entries",
          body:
            "<p><b>Started business with cash ₹2,00,000:</b> Cash A/c … Dr ₹2,00,000 · To Capital A/c ₹2,00,000 · (Being capital introduced). Cash comes in (real: debit); owner is the giver (personal: credit).</p>" +
            "<p><b>Bought goods for cash ₹8,000:</b> Purchases A/c … Dr ₹8,000 · To Cash A/c ₹8,000 · (Being goods purchased for cash). Expense/nominal: debit; cash goes out: credit.</p>" +
            "<p><b>Sold goods on credit ₹12,000 to Ravi:</b> Ravi A/c … Dr ₹12,000 · To Sales A/c ₹12,000 · (Being goods sold on credit). Ravi receives goods (receiver: debit); income (credit).</p>"
        },
        {
          h2: "Compound Entries and the Opening Entry",
          body:
            "<p>A <b>compound entry</b> has one debit and several credits (or vice versa) for a single transaction — e.g. buying machinery and goods together. The <b>opening entry</b> is passed at the start of a new year to bring forward assets, liabilities and capital: Assets A/c Dr, to Liabilities A/c, to Capital A/c.</p>"
        }
      ],
      faq: [
        { q: "What is a narration?", a: "A one-line explanation in brackets under the entry describing what the entry records — for example '(Being goods purchased for cash)'. It is compulsory in the journal format." },
        { q: "Why is the debit entry written first?", a: "Convention: the account to be debited is written first with its amount in the debit column, then the credit account prefixed with 'To', keeping entries readable and uniform." },
        { q: "How do I decide an entry when I'm stuck?", a: "Ask the two questions of double entry: what came in or was received (debit), and what went out or was given (credit) — then verify with the golden or modern rules. The AI Tutor's hint mode is designed for exactly this practice." }
      ],
      related: [{ label: "Ledger", route: "ch-lg" }, { label: "Rules of Debit &amp; Credit", route: "ch-dc" }]
    },

    /* ===================== CHAPTER 8 ===================== */
    "ch-lg": {
      path: "/class-11-accountancy/ledger/",
      inSitemap: true,
      title: "Ledger Class 11: Notes, Formats & Questions | Accountancy By Abinash",
      description: "Class 11 ledger notes — what a ledger is, how to post from the journal, the ledger format, balancing accounts, and worked posting examples.",
      keywords: ["ledger class 11", "ledger account format", "posting to ledger", "balancing ledger accounts", "ledger questions"],
      h1: "Ledger — Class 11 Accountancy Notes, Format &amp; Posting Examples (CBSE)",
      lead: "The ledger is the principal book of account: every journal entry is posted into individual accounts so you can see the balance of each person, asset, expense and income at a glance. Chapter 8 covers posting, the ledger format, and how accounts are balanced.",
      sections: [
        {
          h2: "What Is a Ledger and Why Post to It?",
          body:
            "<p>The journal records transactions chronologically; the <b>ledger</b> classifies them by account. Posting transfers each journal entry to the two affected accounts — the debit side of one, the credit side of the other. Ledger balances feed the trial balance and, ultimately, the financial statements.</p>"
        },
        {
          h2: "Ledger Format and Balancing",
          body:
            "<p>Each account has: <b>Date</b> · <b>Particulars</b> (with the cross-referenced journal folio, e.g. J1) · <b>Journal Folio (J.F.)</b> · <b>Amount (₹)</b> — on a left (debit) and right (credit) side. To balance: total both sides, put the difference on the lighter side and carry it down as the <b>balance c/d</b>, then re-write it as <b>balance b/d</b> on the heavier side. Debit-balanced accounts are shown 'Dr', credit-balanced 'Cr'.</p>"
        },
        {
          h2: "Worked Posting Example",
          body:
            "<p>From the entry 'Cash A/c Dr ₹2,00,000; to Capital A/c ₹2,00,000': the Cash account gets ₹2,00,000 on its <i>debit</i> side (particulars: 'To Capital A/c'), and the Capital account gets ₹2,00,000 on its <i>credit</i> side (particulars: 'By Cash A/c'). Both postings are cross-referenced to the journal page — that cross-reference is what makes errors traceable.</p>"
        }
      ],
      faq: [
        { q: "What is the difference between journal and ledger?", a: "The journal is chronological and records transactions first; the ledger is analytical and holds one account per item, showing balances you can read at a glance." },
        { q: "What does 'By' mean in a ledger account?", a: "'By' introduces a credit-side entry and 'To' a debit-side entry — a formatting convention, not part of double entry itself." },
        { q: "Which accounts normally have a debit balance?", a: "Assets, expenses, losses, purchases and drawings. Incomes, liabilities, capital and sales normally carry credit balances." }
      ],
      related: [{ label: "Journal", route: "ch-jr" }, { label: "Trial Balance", route: "ch-tb" }]
    },

    /* ===================== CHAPTER 9 ===================== */
    "ch-cb": {
      path: "/class-11-accountancy/cash-book/",
      inSitemap: true,
      title: "Cash Book Class 11: Types, Format & Questions | Accountancy By Abinash",
      description: "Class 11 cash book notes — simple, two-column and three-column cash books and the petty cash book, with format, contra entries and solved examples.",
      keywords: ["cash book class 11", "three column cash book", "petty cash book", "contra entry", "cash book format"],
      h1: "Cash Book — Class 11 Accountancy Notes, Types &amp; Solved Questions (CBSE)",
      lead: "The cash book records every receipt and payment of cash (and bank transactions). In small businesses it replaces the cash account in the ledger entirely. Chapter 9 covers the simple, two-column and three-column cash books, the petty cash book, and contra entries.",
      sections: [
        {
          h2: "Types of Cash Book",
          body:
            "<ul>" +
            "<li><b>Simple (single column)</b> — only cash receipts and payments.</li>" +
            "<li><b>Two column</b> — adds a <b>discount</b> column (allowed and received).</li>" +
            "<li><b>Three column</b> — adds <b>cash and bank columns</b>; records discounts plus all cash and bank movements, including cheques.</li>" +
            "<li><b>Petty cash book</b> — a separate register for small daily expenses, maintained on the imprest system (a fixed float, say ₹2,000, replenished to that amount).</li>" +
            "</ul>"
        },
        {
          h2: "Contra Entries (Three-Column Cash Book)",
          body:
            "<p>A <b>contra entry</b> affects both cash and bank simultaneously and is marked 'C' in the L.F. column: e.g. withdrawing ₹5,000 from bank for office use (cash column debit, bank column credit), or depositing ₹3,000 cash into the bank (bank debit, cash credit).</p>"
        },
        {
          h2: "Worked Example",
          body:
            "<p>Receipt: cheque from debtor ₹7,500, discount allowed ₹500 — cash/bank column receives ₹7,500; discount column (Dr side) ₹500. Payment: cheque to creditor ₹4,400 with discount received ₹600 — bank column pays ₹4,400; discount received (Cr side) ₹600. The bank column's balance connects directly to the Bank Reconciliation Statement chapter when the pass book differs.</p>"
        }
      ],
      faq: [
        { q: "Is a cash book an account or a book?", a: "It is a book of original entry that functions as the cash and bank accounts — entries are posted from it directly to the ledger, or to a cash account in the ledger, depending on the system used." },
        { q: "What is the imprest system?", a: "The petty cashier is given a fixed float (imprest). When receipts equal that float again, the petty cash book is replenished — making overspending instantly visible." },
        { q: "Why does the cash book balance rarely match the bank statement?", a: "Timing differences (cheques not yet presented or credited) and unrecorded bank charges — reconciled in the Bank Reconciliation Statement chapter." }
      ],
      related: [{ label: "Bank Reconciliation Statement", route: "ch-brs" }, { label: "Other Books", route: "ch-sp2" }]
    },

    /* ===================== CHAPTER 10 ===================== */
    "ch-sp2": {
      path: "/class-11-accountancy/other-books/",
      inSitemap: true,
      title: "Other Books Class 11: Purchases, Sales & Bills | Accountancy By Abinash",
      description: "Class 11 notes on special purpose books — purchases book, sales book, returns books, bills receivable and bills payable books — with formats and examples.",
      keywords: ["special purpose books class 11", "purchases book format", "sales book", "bills receivable book", "subsidiary books"],
      h1: "Special Purpose Books — Purchases, Sales &amp; Bills Books (CBSE Class 11)",
      lead: "Businesses with many credit transactions keep subsidiary books instead of writing every entry in the journal. This chapter covers the purchases book, sales book, purchases and sales returns books, and the bills receivable and bills payable books — what goes in each and how it posts to the ledger.",
      sections: [
        {
          h2: "Purchases and Sales Books",
          body:
            "<p>The <b>purchases book</b> records credit purchases of goods only (never cash purchases or asset purchases). The <b>sales book</b> records credit sales of goods only. Each entry carries date, invoice number, party name and amount; totals post to the Purchases and Sales accounts monthly.</p>"
        },
        {
          h2: "Returns Books",
          body:
            "<p><b>Purchases returns book</b> (returns outward) records goods sent back to suppliers; <b>sales returns book</b> (returns inward) records goods returned by customers. Entries credit the party and debit the respective returns account.</p>"
        },
        {
          h2: "Bills Receivable and Bills Payable Books",
          body:
            "<p>A <b>bill of exchange</b> is a written promise to pay a fixed amount on a fixed date. The <b>bills receivable book</b> lists bills the business will receive (accepted by customers); the <b>bills payable book</b> lists bills the business has accepted to pay suppliers. On maturity the bill is dishonoured or honoured — a linked concept used again in rectification of errors.</p>"
        }
      ],
      faq: [
        { q: "Does the purchases book record cash purchases?", a: "No. Cash purchases go straight into the cash book; the purchases book records credit purchases of goods only." },
        { q: "Why are separate books needed at all?", a: "Recording thousands of similar credit transactions in one journal is slow and error-prone. Specialisation (division of labour) speeds recording and lets one person specialise per book." },
        { q: "Is a furniture purchase entered in the purchases book?", a: "No. Furniture is an asset, not goods for resale — it is journalised directly, even if bought on credit." }
      ],
      related: [{ label: "Cash Book", route: "ch-cb" }, { label: "Journal", route: "ch-jr" }]
    },

    /* ===================== CHAPTER 11 ===================== */
    "ch-brs": {
      path: "/class-11-accountancy/bank-reconciliation-statement/",
      inSitemap: true,
      title: "Bank Reconciliation Statement Class 11: Notes | Accountancy By Abinash",
      description: "Class 11 BRS notes — why cash book and pass book differ, causes of difference, BRS format and a fully solved bank reconciliation statement example.",
      keywords: ["bank reconciliation statement class 11", "brs class 11", "why cash book and pass book differ", "bank reconciliation example", "pass book balance"],
      h1: "Bank Reconciliation Statement (BRS) — Class 11 Notes &amp; Solved Example (CBSE)",
      lead: "A bank reconciliation statement explains the difference between the bank column of your cash book and the bank's pass book. They should agree, but timing differences and unrecorded charges almost always separate them — BRS finds and itemises every one.",
      sections: [
        {
          h2: "Why Do the Cash Book and Pass Book Differ?",
          body:
            "<ul>" +
            "<li>Cheques issued but <b>not yet presented</b> for payment (your books show the payment; the bank has not paid it).</li>" +
            "<li>Cheques <b>deposited but not yet credited</b> by the bank.</li>" +
            "<li><b>Bank charges</b>, interest or direct debits the bank records that you have not.</li>" +
            "<li><b>Direct collections</b> (interest, dividends) credited by the bank you have not recorded.</li>" +
            "<li><b>Errors</b> on either side.</li>" +
            "</ul>"
        },
        {
          h2: "Fully Solved Example",
          body:
            "<p>Pass book balance: ₹50,000 (Cr). Cheques issued ₹8,000 not yet presented. Cheques deposited ₹6,000 not yet credited. Bank charges ₹500 debited by bank, not recorded in the cash book.</p>" +
            "<p>Balance as per pass book ₹50,000 · <b>Add</b> cheques deposited not credited ₹6,000 · <b>Add</b> bank charges not recorded ₹500 · <b>Less</b> cheques issued not presented ₹8,000 = <b>₹48,500 = balance as per cash book</b> ✓</p>" +
            "<p>(Why these signs: anything the bank has not yet done keeps your cash book <i>lower</i> or <i>higher</i> in a predictable direction — undeposited cheques and unrecorded charges make your cash book lower than reality suggests, while unpresented cheques make your bank balance look higher than the bank's.)</p>"
        },
        {
          h2: "When Is a BRS Prepared?",
          body:
            "<p>Traditionally at the end of each month or before the final accounts. Under the accrual system with a separate cash account, a BRS is still useful for spotting unrecorded charges and errors early — and it is a guaranteed part of the Class 11 exam pattern.</p>"
        }
      ],
      faq: [
        { q: "What is a pass book?", a: "The bank statement — the bank's record of your account, which is the mirror image of your cash book's bank column (your deposits are its credits, your withdrawals its debits)." },
        { q: "Does a BRS detect all errors?", a: "No. It explains timing differences and many one-sided errors, but errors that affect both books equally (like a wrong amount recorded consistently) need other checks." },
        { q: "What does 'not presented' mean?", a: "You have issued a cheque and credited it in your cash book, but the payee has not yet banked it, so the bank has not debited your account — a pure timing difference." }
      ],
      related: [{ label: "Cash Book", route: "ch-cb" }, { label: "Rectification of Errors", route: "ch-roe" }]
    },

    /* ===================== CHAPTER 12 ===================== */
    "ch-gst": {
      path: "/class-11-accountancy/gst/",
      inSitemap: true,
      title: "GST Accounts Class 11: Entries & Examples | Accountancy By Abinash",
      description: "Class 11 GST accounting notes — CGST, SGST and IGST, input tax credit, intra-state vs inter-state supply, and the journal entries for GST transactions.",
      keywords: ["accounting of gst class 11", "cgst sgst igst entries", "input tax credit class 11", "gst journal entries", "intra state inter state supply"],
      h1: "Accounting of GST — Class 11 Notes: CGST, SGST, IGST &amp; Entries (CBSE)",
      lead: "Goods and Services Tax is a single indirect tax on the supply of goods and services. Chapter 12 of Class 11 Accountancy focuses on how GST appears in the books: the three tax components, input tax credit, and the entries for purchase and sale under GST.",
      sections: [
        {
          h2: "CGST, SGST and IGST",
          body:
            "<p>For an <b>intra-state</b> supply (buyer and seller in the same state), GST is split equally into <b>CGST</b> (Central) and <b>SGST</b> (State). For an <b>inter-state</b> supply, a single <b>IGST</b> (Integrated) is charged, later apportioned between centre and states. Rates differ by goods; Class 11 questions state the rate.</p>"
        },
        {
          h2: "Input Tax Credit (ITC)",
          body:
            "<p>GST a business pays on its purchases is <b>input tax</b>; GST charged on sales is <b>output tax</b>. The business pays only the difference to the government: <b>net GST payable = output tax − input tax</b>. The credit mechanism prevents tax-on-tax (cascading).</p>"
        },
        {
          h2: "Worked Entries",
          body:
            "<p>Purchase of goods ₹20,000 + 18% GST, intra-state: Purchases A/c Dr ₹20,000 · Input CGST A/c Dr ₹1,800 · Input SGST A/c Dr ₹1,800 · To Supplier A/c ₹23,600. Sale at ₹30,000 + 18%: Customer A/c Dr ₹35,400 · To Sales A/c ₹30,000 · To Output CGST A/c ₹2,700 · To Output SGST A/c ₹2,700. Net to government: output ₹5,400 − input ₹3,600 = ₹1,800.</p>"
        }
      ],
      faq: [
        { q: "What is the difference between CGST, SGST and IGST?", a: "CGST and SGST apply to sales within a state, split equally (central and state share). IGST applies to sales between states as a single tax." },
        { q: "What does input tax credit mean?", a: "The right to deduct GST already paid on purchases from the GST payable on sales — you pay only the net difference." },
        { q: "Are 'input GST' accounts assets or expenses?", a: "They are current assets — recoverable from the government through input tax credit — so a debit balance of input tax appears on the asset side of the balance sheet until adjusted." }
      ],
      related: [{ label: "Journal", route: "ch-jr" }, { label: "Financial Statements", route: "ch-fs" }]
    },

    /* ===================== CHAPTER 13 ===================== */
    "ch-tb": {
      path: "/class-11-accountancy/trial-balance/",
      inSitemap: true,
      title: "Trial Balance Class 11: Preparation & Methods | Accountancy By Abinash",
      description: "Class 11 trial balance notes — what a trial balance is, the three methods of preparation, its format, what errors it can and cannot detect, with a worked example.",
      keywords: ["trial balance class 11", "trial balance format", "balance method totals method", "errors not detected by trial balance", "trial balance example"],
      h1: "Trial Balance — Class 11 Accountancy Notes, Methods &amp; Example (CBSE)",
      lead: "A trial balance lists every ledger account with its debit or credit balance to prove that total debits equal total credits. It is the bridge between the ledger and the financial statements — a check, not a guarantee.",
      sections: [
        {
          h2: "Methods of Preparation",
          body:
            "<ul>" +
            "<li><b>Balance method</b> — use the closing balance of each account (most common; used for final accounts).</li>" +
            "<li><b>Totals method</b> — total each account's debit and credit sides; the heavier side is the balance.</li>" +
            "<li><b>List of balances method</b> — write balances without totals.</li>" +
            "</ul>"
        },
        {
          h2: "Worked Example",
          body:
            "<p>From ledger balances: Cash ₹42,000 Dr · Bank ₹18,000 Dr · Purchases ₹2,00,000 Dr · Sales ₹3,20,000 Cr · Debtors ₹36,000 Dr · Creditors ₹28,000 Cr · Capital ₹2,48,000 Cr. Total Dr = 42,000+18,000+2,00,000+36,000 = ₹2,96,000. Total Cr = 3,20,000+28,000+2,48,000 = ₹2,96,000 ✓ The trial balance tallies.</p>"
        },
        {
          h2: "What the Trial Balance Cannot Detect",
          body:
            "<p>A tallying trial balance does <b>not</b> prove the books are error-free. It cannot detect: an entry <b>completely omitted</b>; the <b>wrong account used</b> (both sides correct, wrong head); a <b>compensating error</b> (two errors cancelling out); an entry recorded with the <b>wrong amount on both sides</b>; or a <b>commission error</b> of equal value. These surface through other checks — including the suspense account used while locating them.</p>"
        }
      ],
      faq: [
        { q: "Why does a trial balance tally?", a: "Because double entry makes every transaction add equal amounts to total debits and total credits — if the ledger followed the rules, the totals must agree." },
        { q: "Which errors does a trial balance detect?", a: "One-sided errors: wrong arithmetic in an account, posting to the wrong side, casting errors, or posting only one side of an entry." },
        { q: "Is the trial balance a final account?", a: "No. It is an interim statement used to prepare the trading account, profit &amp; loss account and balance sheet." }
      ],
      related: [{ label: "Ledger", route: "ch-lg" }, { label: "Rectification of Errors", route: "ch-roe" }, { label: "Financial Statements", route: "ch-fs" }]
    },

    /* ===================== CHAPTER 14 ===================== */
    "ch-dep": {
      path: "/class-11-accountancy/depreciation/",
      inSitemap: true,
      title: "Depreciation Class 11: Methods & Numericals | Accountancy By Abinash",
      description: "Class 11 depreciation notes — meaning and causes, straight line vs written down value methods with formulas, journal entries and a solved numerical.",
      keywords: ["depreciation class 11", "straight line method", "written down value method", "depreciation journal entry", "wdv slm numerical"],
      h1: "Depreciation — Class 11 Accountancy Notes: SLM, WDV &amp; Solved Numericals (CBSE)",
      lead: "Depreciation is the fall in value of a fixed asset over time, charged as an expense against the years that benefit from it. Chapter 14 covers why assets depreciate, the two methods in the syllabus — straight line and written down value — and fully worked numericals.",
      sections: [
        {
          h2: "What Is Depreciation and Why Does It Happen?",
          body:
            "<p>A machine's value falls because of <b>wear and tear</b> from use, the <b>passage of time</b> (weathering) and <b>obsolescence</b> (newer technology makes it outdated). Charging depreciation matches this cost against the revenue the asset helps earn (matching concept) and shows the asset at a realistic value.</p>" +
            "<p>Key terms: <b>cost</b> (purchase price plus installation), <b>residual/scrap value</b> (expected value at end of life), <b>useful life</b> (years of service), <b>depreciable amount</b> = cost − residual value.</p>"
        },
        {
          h2: "Straight Line Method (SLM) vs Written Down Value (WDV)",
          body:
            "<p><b>SLM</b> charges the same amount every year: Depreciation = (Cost − Residual Value) ÷ Useful Life. Example: a machine costing ₹1,00,000 with ₹10,000 residual value over 9 years → (1,00,000 − 10,000) ÷ 9 = <b>₹10,000 per year</b>. Book value falls by a fixed amount each year.</p>" +
            "<p><b>WDV</b> charges a fixed <i>rate</i> on the reducing book value. Example: ₹50,000 asset at 20% WDV: Year 1 dep = ₹10,000 (WDV ₹40,000); Year 2 dep = 20% × 40,000 = ₹8,000 (WDV ₹32,000). The charge falls each year.</p>"
        },
        {
          h2: "Journal Entries and the Disposal Connection",
          body:
            "<p>Annual charge: <i>Depreciation A/c … Dr; To Machinery A/c</i> (or Accumulated Depreciation A/c). On disposal, the asset account (with its accumulated depreciation) is closed against the disposal account, and any difference is profit or loss on disposal — a concept that feeds rectification and final accounts.</p>"
        }
      ],
      faq: [
        { q: "Which method gives a higher expense in early years?", a: "WDV — it charges a percentage of a higher opening book value, so year 1 matches SLM but later years charge more than a straight line would at the end of life. Total depreciation over life is the same (cost − scrap)." },
        { q: "Is depreciation an expense or an asset?", a: "An expense (nominal account), debited to the profit &amp; loss account — and it reduces the asset's book value shown in the balance sheet." },
        { q: "Why deduct residual value in SLM?", a: "Because that portion of the cost is not consumed — the business expects to recover it at the end of the asset's life, so only the depreciable amount is charged over the years." }
      ],
      related: [{ label: "Provisions and Reserves", route: "ch-pres" }, { label: "Adjustments in Financial Statements", route: "ch-adj" }]
    },

    /* ===================== CHAPTER 15 ===================== */
    "ch-pres": {
      path: "/class-11-accountancy/provisions-and-reserves/",
      inSitemap: true,
      title: "Provisions and Reserves Class 11 Notes | Accountancy By Abinash",
      description: "Class 11 notes on provisions and reserves — definitions, the key differences, types of reserves (general, specific, secret), reserve fund and worked entries.",
      keywords: ["provisions and reserves class 11", "provision vs reserve", "general reserve specific reserve secret reserve", "reserve fund meaning"],
      h1: "Provisions and Reserves — Class 11 Accountancy Notes (CBSE)",
      lead: "Both provisions and reserves keep a business financially safe, but they are not the same thing. A provision meets a known, present obligation of uncertain amount; a reserve is surplus set aside for future strengthening or a specific purpose. Chapter 15 defines each, contrasts them, and covers the types of reserves.",
      sections: [
        {
          h2: "What Is a Provision in Accounting?",
          body:
            "<p>A <b>provision</b> is created for a <i>present obligation</i> whose exact amount is uncertain — for example provision for doubtful debts (some debtors will not pay), provision for depreciation, or provision for warranty claims. It is <b>mandatory</b> when the obligation exists (prudence requires providing for all probable losses) and is debited to the profit &amp; loss account. The provision for doubtful debts, for instance, is created by debiting <i>Provision for Doubtful Debts A/c</i> and crediting the provision account.</p>"
        },
        {
          h2: "What Is a Reserve?",
          body:
            "<p>A <b>reserve</b> is an appropriation of profit — surplus retained in the business instead of being withdrawn. It strengthens the business financially or funds a known future expense. Creation is at the discretion of the management (except where law requires, like a dividend equalisation reserve). Reserves are credited from profit, and the debit side is profit (or the profit &amp; loss appropriation account).</p>"
        },
        {
          h2: "Types of Reserves and the Difference Table",
          body:
            "<p><b>General reserve</b> — no specific purpose; strengthens overall finances. <b>Specific reserve</b> — created for a defined purpose (e.g. dividend equalisation, repair reserve); cannot be used elsewhere. <b>Secret reserve</b> — hidden from outsiders by understating profit or overstating liability (e.g. writing off an asset fully while it still has life); strengthens against future losses but reduces transparency.</p>" +
            "<table><thead><tr><th>Basis</th><th>Provision</th><th>Reserve</th></tr></thead><tbody>" +
            "<tr><td>Nature</td><td>Charge against profit (debit)</td><td>Appropriation of profit (credit from profit)</td></tr>" +
            "<tr><td>Purpose</td><td>Meet a present obligation of uncertain amount</td><td>Strengthen finances or fund a future need</td></tr>" +
            "<tr><td>Necessity</td><td>Required when obligation exists</td><td>Discretionary (except where law requires)</td></tr>" +
            "</tbody></table>"
        }
      ],
      faq: [
        { q: "Is every reserve a fund?", a: "No. A reserve becomes a fund only when the amount is separately invested (e.g. a repair fund invested in securities). Until then it is just retained profit." },
        { q: "Can a secret reserve be shown in the balance sheet?", a: "By definition it is not disclosed to outsiders — which is why it is controversial and restricted for companies, though the concept is studied in Class 11." },
        { q: "What is the difference between provision for depreciation and depreciation itself?", a: "Depreciation is the annual charge (expense). A provision for depreciation (or accumulated depreciation account) is the cumulative record of those charges against the asset." }
      ],
      related: [{ label: "Depreciation", route: "ch-dep" }, { label: "Financial Statements", route: "ch-fs" }]
    },

    /* ===================== CHAPTER 16 ===================== */
    "ch-roe": {
      path: "/class-11-accountancy/rectification-of-errors/",
      inSitemap: true,
      title: "Rectification of Errors Class 11: Notes & Practice | Accountancy By Abinash",
      description: "Class 11 rectification of errors notes — types of errors, suspense account, effect on trial balance, and worked rectification entries for common mistakes.",
      keywords: ["rectification of errors class 11", "types of accounting errors", "suspense account", "rectification entries", "errors affecting trial balance"],
      h1: "Rectification of Errors — Class 11 Accountancy Notes, Types &amp; Entries (CBSE)",
      lead: "Errors happen in every set of books. Rectification of errors is the process of finding what went wrong and passing a correcting entry — before the final accounts if possible, or through a suspense account if the trial balance has already disagreed.",
      sections: [
        {
          h2: "What Is Rectification of Errors in Accounting?",
          body:
            "<p><b>Rectification of errors</b> means identifying and correcting mistakes in recording, classifying, or posting financial transactions so the accounts show the true result. An error that has affected the profit figure requires a <b>rectifying (prior period adjustment) entry</b>; errors before the preparation of final accounts can be corrected directly in the books.</p>"
        },
        {
          h2: "Types of Errors",
          body:
            "<ul>" +
            "<li><b>Errors of omission</b> — an entry completely or partially left out (does not affect the trial balance if both sides are omitted).</li>" +
            "<li><b>Errors of commission</b> — right account type, wrong account or wrong amount (e.g. ₹500 written as ₹50).</li>" +
            "<li><b>Errors of principle</b> — treating a capital item as revenue (repairing a building charged as an asset purchase, or vice versa) — the books tally but the classification is wrong.</li>" +
            "<li><b>Compensating errors</b> — two mistakes that cancel each other, so the trial balance still tallies.</li>" +
            "<li><b>Casting/posting errors</b> — arithmetic slips or one-sided posting — these <i>do</i> make the trial balance disagree.</li>" +
            "</ul>"
        },
        {
          h2: "The Suspense Account and Worked Rectification",
          body:
            "<p>When the trial balance disagrees, the difference is put into a <b>suspense account</b> so the final accounts can still be prepared while the errors are hunted down. As each error is located, the suspense account is reduced; when all are rectified, it closes to zero.</p>" +
            "<p>Example: salary paid ₹4,500 was posted to the debit of Ramesh (personal account) instead of the Salary account. Rectify: <i>Salary A/c Dr ₹4,500; To Ramesh A/c ₹4,500</i> — removing the wrong debit and creating the right one.</p>"
        }
      ],
      faq: [
        { q: "Which errors do not affect the trial balance?", a: "Complete omission of a transaction, compensating errors, errors of principle (classification) and any mistake recorded with the same wrong amount on both sides — all leave debits = credits." },
        { q: "Why is a suspense account needed?", a: "So final accounts can proceed while an unlocated difference hangs in the suspense account; it is cleared to zero once every error is found." },
        { q: "When is a rectifying entry required instead of a simple correction?", a: "When the books are closed and the error has affected the reported profit — the correction then passes through a prior period adjustment (rectification) entry rather than editing last year's books." }
      ],
      related: [{ label: "Trial Balance", route: "ch-tb" }, { label: "Bank Reconciliation Statement", route: "ch-brs" }, { label: "Quiz with answers", route: "quiz" }]
    },

    /* ===================== CHAPTER 17 ===================== */
    "ch-fs": {
      path: "/class-11-accountancy/financial-statements-of-sole-proprietorship/",
      inSitemap: true,
      title: "Financial Statements: Sole Proprietorship Class 11 | Accountancy By Abinash",
      description: "Class 11 notes on financial statements of sole proprietorship — trading account, profit & loss account and balance sheet formats, with a fully worked example.",
      keywords: ["financial statements of sole proprietorship class 11", "trading account format", "profit and loss account class 11", "balance sheet format", "gross profit net profit"],
      h1: "Financial Statements of Sole Proprietorship — Trading A/c, P&amp;L A/c &amp; Balance Sheet (CBSE)",
      lead: "The final accounts of a sole proprietor consist of the Trading Account (gross profit), the Profit &amp; Loss Account (net profit) and the Balance Sheet (financial position). Chapter 17 teaches each format and how the three connect — with a fully worked set.",
      sections: [
        {
          h2: "How to Prepare a Trading Account",
          body:
            "<p>The Trading Account finds <b>gross profit</b> from direct trade activity. Debit side: opening stock, purchases (less returns), direct expenses (carriage inward, wages, freight). Credit side: sales (less returns) and closing stock. <b>Cost of Goods Sold = Opening Stock + Purchases + Direct Expenses − Closing Stock</b>; Gross Profit = Net Sales − COGS.</p>" +
            "<p>Worked: Opening stock ₹40,000 + purchases ₹2,00,000 + wages ₹12,000 − closing stock ₹50,000 → COGS ₹2,02,000. Sales ₹3,20,000 − ₹2,02,000 = <b>Gross Profit ₹1,18,000</b>.</p>"
        },
        {
          h2: "How to Prepare the Profit &amp; Loss Account",
          body:
            "<p>Starts with gross profit on the credit side. Debit side: indirect expenses — salaries, rent, depreciation, bad debts, discount allowed, advertising. Credit side: indirect income — commission received, discount received. <b>Net Profit = Gross Profit − Indirect Expenses + Indirect Income</b>. Worked: ₹1,18,000 − ₹48,000 indirect expenses = <b>Net Profit ₹70,000</b>.</p>"
        },
        {
          h2: "How to Prepare the Balance Sheet",
          body:
            "<p>The Balance Sheet shows the position on the last day: <b>Liabilities side</b> — capital (adjusted for net profit less drawings), long-term loans, creditors, bills payable, outstanding expenses. <b>Assets side</b> — fixed assets (machinery less depreciation), current assets (closing stock, debtors less bad debts provision, cash, bank, prepaid expenses), and accrued income. Both sides must tally — that balance is the accounting equation again.</p>"
        }
      ],
      faq: [
        { q: "What is the difference between gross profit and net profit?", a: "Gross profit is what remains after the direct costs of goods only (COGS). Net profit is what remains after all indirect expenses too — the bottom line that adds to capital." },
        { q: "Does the balance sheet show profit directly?", a: "No — net profit is carried into the capital account on the liabilities side. The balance sheet shows the resulting financial position, not the period's performance." },
        { q: "In what order are the statements prepared?", a: "Trading account first (gross profit), then profit &amp; loss account (net profit), then balance sheet — each one's answer feeding the next." }
      ],
      related: [{ label: "Adjustments in Financial Statements", route: "ch-adj" }, { label: "Trial Balance", route: "ch-tb" }, { label: "Formula &amp; format sheet", route: "formula-sheet" }]
    },

    /* ===================== CHAPTER 18 ===================== */
    "ch-adj": {
      path: "/class-11-accountancy/adjustments-in-financial-statements/",
      inSitemap: true,
      title: "Adjustments in Financial Statements Class 11 | Accountancy By Abinash",
      description: "Class 11 notes on adjustments in financial statements — closing stock, outstanding and prepaid expenses, depreciation and bad debts, each with its double effect.",
      keywords: ["adjustments in financial statements class 11", "closing stock adjustment", "outstanding expenses", "prepaid expenses adjustment", "two effect of adjustments"],
      h1: "Adjustments in Financial Statements — Closing Stock, Outstanding &amp; Prepaid Expenses (CBSE)",
      lead: "Adjustments are additional year-end facts given outside the trial balance that must be shown with <b>two effects</b> each — one in the profit &amp; loss account or trading account, one in the balance sheet. Chapter 18 covers every adjustment in the syllabus and a worked set.",
      sections: [
        {
          h2: "The Two-Effect Principle",
          body:
            "<p>Because the final accounts must stay on accrual basis, every adjustment touches two statements: an income/expense effect and an asset/liability effect. Forgetting the second effect is the most common exam mistake — a trial balance will still tally while the statements quietly go wrong.</p>"
        },
        {
          h2: "Every Adjustment, Both Effects",
          body:
            "<ul>" +
            "<li><b>Closing stock</b> — credit in Trading A/c (reduces COGS); asset in Balance Sheet. It sits <i>outside</i> the trial balance because it is found after the year's records are totalled.</li>" +
            "<li><b>Outstanding expenses</b> (wages ₹5,000 unpaid) — add to the expense in P&amp;L A/c; show as a liability in Balance Sheet.</li>" +
            "<li><b>Prepaid expenses</b> (insurance ₹2,000 paid in advance) — deduct from the expense in P&amp;L A/c; show as an asset in Balance Sheet.</li>" +
            "<li><b>Accrued income</b> (₹3,000 earned not received) — add to income in P&amp;L A/c; asset in Balance Sheet.</li>" +
            "<li><b>Income received in advance</b> — deduct from income in P&amp;L A/c; liability in Balance Sheet.</li>" +
            "<li><b>Depreciation</b> — debit in P&amp;L A/c; deduct from the asset in Balance Sheet.</li>" +
            "<li><b>Bad debts &amp; further bad debts</b> — charge to P&amp;L A/c; reduce debtors in Balance Sheet. <b>Provision for doubtful debts</b> — charge the increase to P&amp;L A/c; deduct from debtors.</li>" +
            "</ul>"
        },
        {
          h2: "Worked Example",
          body:
            "<p>From the trial balance figures of the previous chapter (sales ₹3,20,000, COGS ₹2,02,000 including wages ₹12,000, gross profit ₹1,18,000), apply: closing stock ₹50,000 (already used in COGS — now also an asset), wages outstanding ₹5,000 (P&amp;L debit + liability), insurance prepaid ₹2,000 (P&amp;L credit + asset), depreciation on machinery ₹8,000. Adjusted net profit = 70,000 − 5,000 + 2,000 − 8,000 = <b>₹59,000</b>. Balance Sheet assets gain closing stock ₹50,000 and prepaid insurance ₹2,000; liabilities gain wages outstanding ₹5,000; capital rises by the adjusted net profit.</p>"
        }
      ],
      faq: [
        { q: "Why is closing stock outside the trial balance?", a: "Because it is counted after the books are totalled — it is not a ledger balance. That is the general signal that an item needs two effects in the final accounts." },
        { q: "Do outstanding expenses increase or decrease profit?", a: "They decrease profit — the expense is charged in full for the year even though part of it is unpaid, and the unpaid part becomes a liability." },
        { q: "What is the rule of thumb to avoid mistakes?", a: "For every adjustment outside the trial balance, write both effects before touching any statement: one profit/loss effect and one asset/liability effect. The Adjustment Studio on this site drills exactly this." }
      ],
      related: [{ label: "Financial Statements of Sole Proprietorship", route: "ch-fs" }, { label: "Provisions and Reserves", route: "ch-pres" }, { label: "Trial Balance", route: "ch-tb" }]
    },

    /* ===================== CLASS 12 — HUB (v83) ===================== */
    "chapters-list-12": {
      path: "/class-12-accountancy/",
      inSitemap: true,
      title: "Class 12 Accountancy Notes: All 13 CBSE Chapters | Accountancy By Abinash",
      description: "Complete index of CBSE Class 12 Accountancy chapter notes for session 2026-27 — partnership firms, company accounts, financial statement analysis, cash flow and computerised accounting.",
      keywords: ["class 12 accountancy notes", "cbse class 12 accountancy chapters", "class 12 commerce notes", "accountancy chapter wise notes class 12"],
      h1: "Class 12 Accountancy — Complete Chapter List (CBSE)",
      lead: "Every chapter of the CBSE Class 12 Accountancy syllabus for session 2026-27, in teaching order: Part A on partnership firms and company accounts, plus both Part B pathways. Each chapter carries theory, formats and rules, a mind map, a practice bank, a chapter-specific interactive activity and a quick revision sheet.",
      includeChapterIndex: true,
      chapterIndexClass: "12",
      sections: [
        {
          h2: "How Each Chapter Is Organised",
          body:
            "<p>Every chapter opens with an introduction, then breaks into focused tabs: <b>Theory</b> for detailed explanations and adjustments, <b>Formulas and Rules</b> for standard formats and golden rules, a <b>Mind Map</b> for visual revision, a <b>Practice Bank</b> of checked multiple-choice questions, a unique <b>interactive activity</b> — a journal-entry lab, a valuation or settlement calculator, a revaluation or realisation statement builder, a classifier or a ratio match-up — and a <b>Quick Revision</b> tab for the day before an exam.</p>"
        },
        {
          h2: "Part A, Part B, and Both Pathways",
          body:
            "<p>The theory paper is worth 80 marks: <b>Part A</b> carries Accounting for Partnership Firms (36 marks) and Accounting for Companies (24 marks), while <b>Part B</b> carries 20 marks through one of two options — <i>Analysis of Financial Statements with the Cash Flow Statement</i>, or <i>Computerised Accounting</i>. The remaining 20 marks come from the Project Work or Practical Work attached to your option. Both options are written up in full here, so you can study whichever your school has allotted without hunting for a second website.</p>"
        },
        {
          h2: "Suggested Study Order",
          body:
            "<p>Follow the chapter order. Chapters 1–3 build the vocabulary of partnership accounting (appropriation, goodwill, changing ratios). Chapters 4–6 handle the three events that reconstitute a firm: admission, retirement and dissolution. Chapters 7–9 switch to company accounts — share capital, debentures and the Schedule III statements. Chapters 10–12 cover Part B Option 1 (analysis, ratios, cash flow), and chapter 13 covers Part B Option 2 (computerised accounting).</p>"
        }
      ],
      faq: [
        { q: "How many chapters are in CBSE Class 12 Accountancy?", a: "Thirteen chapters are covered here, from Partnership Fundamentals to Computerised Accounting, following the syllabus order for the 2026-27 session." },
        { q: "Which Part B option does this website follow?", a: "Both. Option 1 (Analysis of Financial Statements and Cash Flow Statement) and Option 2 (Computerised Accounting) are fully written — study the option your school has allotted; the site never forces a choice." },
        { q: "Is this the official CBSE material?", a: "No, and it does not claim to be. Every page is original teaching material written for this project against the published CBSE curriculum — free to use, but not an official CBSE publication." }
      ],
      related: [{ label: "Partnership Fundamentals", route: "ch-pf" }, { label: "Accounting for Share Capital", route: "ch-sc" }, { label: "Cash Flow Statement", route: "ch-cf" }]
    },

    /* ===================== CLASS 12 — PART A: PARTNERSHIP ===================== */
    "ch-pf": {
      path: "/class-12-accountancy/partnership-fundamentals/",
      inSitemap: true,
      title: "Partnership Fundamentals Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on partnership fundamentals — profit and loss appropriation, interest on capital and drawings, partners salary, guarantee of profits and fixed versus fluctuating capital.",
      keywords: ["partnership fundamentals class 12", "profit and loss appropriation account", "interest on capital partnership", "guarantee of profit to partner", "fixed and fluctuating capital accounts"],
      h1: "Partnership Fundamentals — P&amp;L Appropriation, Interest, Salary and Guarantee (CBSE)",
      lead: "Chapter 1 of CBSE Class 12 Accountancy sets up how a partnership firm divides what it earns: how net profit becomes divisible profit, what a partnership deed can provide for, and how each partner's capital account is actually maintained.",
      sections: [
        {
          h2: "From Net Profit to Divisible Profit",
          body:
            "<p>The Profit and Loss Appropriation Account starts with the net profit brought down from the Profit and Loss Account and applies the deed's provisions: <b>interest on capital</b> and <b>partners' salary or commission</b> on the debit side, <b>interest on drawings</b> on the credit side. What remains — the <b>divisible profit</b> — is split between the partners in their profit-sharing ratio.</p>" +
            "<p>Worked: net profit ₹1,20,000; interest on capital A ₹6,000 and B ₹4,000; salary to A ₹12,000; interest on drawings from A ₹2,000. Divisible profit = 1,20,000 − 6,000 − 4,000 − 12,000 + 2,000 = <b>₹1,00,000</b>, split 3:2 → A ₹60,000, B ₹40,000.</p>" +
            "<p>These items are normally <b>appropriations</b> (paid only out of profit) unless the deed makes them a charge against profit — in which case they are deducted even in a loss. Interest on a partner's loan, however, is always a <b>charge</b>.</p>"
        },
        {
          h2: "Fixed vs Fluctuating Capital Accounts",
          body:
            "<ul><li><b>Fixed capital:</b> the capital account itself never changes — only the introduction or withdrawal of capital touches it. Salary, interest, drawings and profit are kept in separate accounts (current account, drawings account).</li><li><b>Fluctuating capital:</b> everything is merged into one capital account, so its balance moves every accounting period. This is the <b>default</b> when the deed is silent.</li></ul>"
        },
        {
          h2: "Guarantee of Minimum Profit",
          body:
            "<p>Under a guarantee, a partner is assured a minimum share of profit — by the firm, by one specific partner, or by the remaining partners together. If the guaranteed partner's actual share falls short, the <b>deficiency is borne by the guaranteeing partners</b> in their agreed proportions (usually their own profit-sharing ratio), and only what is left after that deficiency is distributed among the rest.</p>"
        }
      ],
      faq: [
        { q: "Is interest on capital an appropriation or a charge?", a: "An appropriation unless the partnership deed expressly makes it a charge against profit. Interest on a partner's loan, by contrast, is always a charge." },
        { q: "What happens to interest on capital when profit is insufficient?", a: "When the deed provides for interest but profit cannot cover it, the interest is reduced proportionately — in the ratio of the profits actually available — so the full amount is never manufactured." },
        { q: "Which capital method applies when the deed says nothing?", a: "Fluctuating capital accounts — one account per partner carrying every adjustment — because the fixed-capital system needs the deed to say so." }
      ],
      related: [{ label: "Goodwill: Nature and Valuation", route: "ch-gw" }, { label: "Admission of a Partner", route: "ch-adm" }, { label: "Retirement and Death", route: "ch-ret" }]
    },

    "ch-gw": {
      path: "/class-12-accountancy/goodwill-valuation/",
      inSitemap: true,
      title: "Goodwill Valuation Class 12:3 Methods | Accountancy By Abinash",
      description: "Free Class 12 notes on goodwill valuation — meaning and factors of goodwill, super profit, and valuation by average profit, super profit and capitalisation methods with worked figures.",
      keywords: ["goodwill valuation class 12", "super profit method", "average profit method goodwill", "capitalisation method goodwill", "valuation of goodwill"],
      h1: "Goodwill: Nature and Valuation — Average Profit, Super Profit and Capitalisation (CBSE)",
      lead: "Chapter 2 explains what goodwill actually represents, the moments a partnership needs it valued, and the three methods examiners use: average profit, super profit and capitalisation — each with its own formula and its own worked numbers.",
      sections: [
        {
          h2: "What Goodwill Measures",
          body:
            "<p>Goodwill is the value of a business <b>beyond its tangible assets</b> — the reputation that lets it earn more than a typical return. The factors that build it: a favourable location, consistent product or service quality, an experienced management team, a loyal customer base, and earnings running above the normal rate for the industry.</p>" +
            "<p>It is valued when a partnership is reconstituted — a partner is admitted, retires or dies, or the firm is sold or amalgamated. Internally generated goodwill is <b>not recorded as an asset</b> in the books; it is computed for the purpose of settling partners.</p>"
        },
        {
          h2: "The Three Valuation Methods",
          body:
            "<ul>" +
            "<li><b>Average Profit method:</b> Goodwill = average annual profits × number of years' purchase.</li>" +
            "<li><b>Super Profit method:</b> Super Profit = average profit − normal profit, where normal profit = capital employed × normal rate of return. Goodwill = super profit × years' purchase.</li>" +
            "<li><b>Capitalisation methods:</b> of super profit → super profit ÷ normal rate; of average profit → (average profit ÷ normal rate) − capital employed.</li>" +
            "</ul>" +
            "<p>Worked: average profit ₹1,80,000, capital employed ₹12,00,000, normal rate 10%, three years' purchase. Normal profit = ₹1,20,000 → super profit = <b>₹60,000</b> → goodwill = <b>₹1,80,000</b>. Capitalisation check: 60,000 ÷ 0.10 = <b>₹6,00,000</b>, and (1,80,000 ÷ 0.10) − 12,00,000 = <b>₹6,00,000</b> — both capitalisation routes agree.</p>"
        },
        {
          h2: "Reading 'Years' Purchase' Correctly",
          body:
            "<p>Years' purchase is not a time period the firm has existed — it is the number of past years of surplus performance the buyer is paying for. A figure of three means three years of super profit are capitalised into the price. Raising the multiplier raises goodwill proportionally, which is why the exam states it plainly and you simply multiply.</p>"
        }
      ],
      faq: [
        { q: "What is the formula for super profit?", a: "Super profit = average profit of the years considered minus normal profit, where normal profit = capital employed multiplied by the normal rate of return." },
        { q: "Is goodwill shown as an asset in the balance sheet?", a: "Only purchased goodwill is recorded. Goodwill the firm generated itself is valued for partnership settlements but is not carried as an asset." },
        { q: "Do both capitalisation methods give the same answer?", a: "Yes when the inputs are consistent — capitalising super profit, and capitalising average profit and subtracting capital employed, both return the same goodwill figure. That agreement is a quick exam check." }
      ],
      related: [{ label: "Partnership Fundamentals", route: "ch-pf" }, { label: "Change in Profit-Sharing Ratio", route: "ch-psr" }, { label: "Admission of a Partner", route: "ch-adm" }]
    },

    "ch-psr": {
      path: "/class-12-accountancy/change-in-profit-sharing-ratio/",
      inSitemap: true,
      title: "Change in Profit-Sharing Ratio Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on change in profit-sharing ratio — sacrificing ratio and gaining ratio, the revised ratio, revaluation of assets and liabilities, and why accumulation must be settled.",
      keywords: ["change in profit sharing ratio class 12", "sacrificing ratio formula", "gaining ratio formula", "revaluation account partners", "revised profit sharing ratio"],
      h1: "Change in Profit-Sharing Ratio — Sacrifice, Gain and Revaluation (CBSE)",
      lead: "Chapter 3 covers what happens when existing partners re-slice the same profit pie: how to compute the new ratio, who sacrificed and who gained, and why every accumulated gain or loss must be settled at the moment the ratio changes.",
      sections: [
        {
          h2: "Sacrificing and Gaining Ratios",
          body:
            "<ul><li><b>Sacrificing ratio</b> = old ratio − new ratio. A positive result means that partner gave up a slice for someone else.</li><li><b>Gaining ratio</b> = new ratio − old ratio. It mirrors the sacrifice exactly — every rupee one partner forgoes is picked up by another.</li></ul>" +
            "<p>Worked: A and B share profits 2:1; they revise to 3:2. A: 2/3 − 3/5 = 10/15 − 9/15 = <b>1/15 sacrificed</b>. B: 1/3 − 2/5 = 5/15 − 6/15 = <b>1/15 gained</b>. The two always sum to zero.</p>"
        },
        {
          h2: "Why Revalue at the Moment of Change",
          body:
            "<p>Assets and liabilities may have moved years past their book values — a building appreciated, stock depreciated, a claim understated. Those unrealised gains and losses were being shared in the <b>old</b> ratio. The instant the ratio changes, the <b>gaining partner</b> would otherwise inherit the other side's history. So every asset and liability is revalued, the resulting profit or loss goes to the <b>old partners in the old ratio</b>, and the revised balance sheet starts from current values.</p>"
        },
        {
          h2: "Reserves, Accumulated Profits and Losses",
          body:
            "<p>General reserve, reserve fund, profit and loss credit balances, investments fluctuation fund — all belong to the old ratio and are credited to the old partners. Accumulated losses and debits on the other side are debited to them the same way. Nothing accumulated survives the reconstitution untouch.</p>"
        }
      ],
      faq: [
        { q: "How do you compute the sacrificing ratio?", a: "Old ratio minus new ratio, partner by partner. The partner with a positive result has sacrificed; the one with a negative result has gained." },
        { q: "Where does revaluation profit go?", a: "To the old partners in their old profit-sharing ratio — because the gain built up under the old agreement, before the change." },
        { q: "What happens to reserves when the ratio changes?", a: "They are distributed among the old partners in the old ratio, added to their capital (or current) accounts, so the revised balance sheet carries no accumulated residue." }
      ],
      related: [{ label: "Goodwill: Nature and Valuation", route: "ch-gw" }, { label: "Admission of a Partner", route: "ch-adm" }, { label: "Partnership Fundamentals", route: "ch-pf" }]
    },

    "ch-adm": {
      path: "/class-12-accountancy/admission-of-partner/",
      inSitemap: true,
      title: "Admission of a Partner Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on admission of a partner — revaluation account, new profit-sharing ratio, sacrificing ratio, premium for goodwill and adjustment of partners capital.",
      keywords: ["admission of partner class 12", "revaluation account format", "premium for goodwill", "new profit sharing ratio admission", "capital adjustment partners"],
      h1: "Admission of a Partner — Revaluation, Goodwill Premium and Capital Adjustment (CBSE)",
      lead: "Chapter 4 walks through a partnership reconstitution from the new partner's arrival: what gets revalued before the ratios move, how goodwill brought in reaches the sacrificing partners, and how capital is rebalanced to fit the new ratio.",
      sections: [
        {
          h2: "The Revaluation Account",
          body:
            "<p>The revaluation account is a nominal account. On the <b>debit</b> side: fall in asset values, rises in liabilities, writing off any fictitious asset. On the <b>credit</b> side: rise in asset values, falls in liabilities. The balance — profit or loss — transfers to the <b>old partners in their old ratio</b>.</p>" +
            "<p>Worked: machinery book ₹2,00,000 revalued to ₹1,85,000 (−15,000), a debtor asset rising from ₹50,000 to ₹55,000 (+5,000), a liability of ₹30,000 now ₹34,000 (−4,000). Net result: <b>revaluation loss ₹14,000</b>, borne by the old partners in the old ratio.</p>"
        },
        {
          h2: "Goodwill: The Premium Method",
          body:
            "<p>The new partner brings cash for their share of the firm's goodwill. That amount is credited to the <b>sacrificing partners in their sacrificing ratio</b> — the partners who stepped aside to make room. If goodwill already appears in the books, the old partners write it off among themselves in the old ratio first, so the same reputation is never counted twice.</p>"
        },
        {
          h2: "Capital Adjustment and the Revised Balance Sheet",
          body:
            "<p>New capital is fixed for the firm as a whole and expressed in the new ratio; each partner's capital account is then adjusted by introducing cash or paying the excess out. Finally, the revised balance sheet is drawn with revalued assets and liabilities, reserves already distributed, and the new capital structure in place.</p>"
        }
      ],
      faq: [
        { q: "Who gets the revaluation profit?", a: "The old partners, in their old profit-sharing ratio, because revaluation measures what accrued before the new partner arrived." },
        { q: "How is goodwill brought in by the new partner treated?", a: "It is credited to the sacrificing partners in their sacrificing ratio under the premium method — compensation for the profit slice they gave up." },
        { q: "What if goodwill already exists in the firm's books?", a: "The old partners write it off among themselves in the old ratio at reconstitution, then apply the premium method cleanly to the new amount." }
      ],
      related: [{ label: "Change in Profit-Sharing Ratio", route: "ch-psr" }, { label: "Retirement and Death", route: "ch-ret" }, { label: "Goodwill: Nature and Valuation", route: "ch-gw" }]
    },

    "ch-ret": {
      path: "/class-12-accountancy/retirement-and-death-of-partner/",
      inSitemap: true,
      title: "Retirement and Death of a Partner Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on retirement and death of a partner — settling the outgoing partner, gaining ratio, share of profit up to date of death, loan account and executors account.",
      keywords: ["retirement of partner class 12", "death of partner accounting", "gaining ratio formula", "share of profit up to date of death", "executors account partner"],
      h1: "Retirement and Death of a Partner — Settlement, Gain Ratio and Profit Up to Date (CBSE)",
      lead: "Chapter 5 covers both exits from a partnership: how the outgoing partner's full account is settled on retirement, and how a deceased partner's share of profit is computed for the months up to the date of death before the executor is paid.",
      sections: [
        {
          h2: "Settlement: What the Outgoing Partner Receives",
          body:
            "<p>The outgoing partner's account is credited with their share of <b>revaluation profit</b>, their share of <b>reserves and accumulated profits</b>, and their share of <b>goodwill</b> — the last compensated by the <b>gaining partners in the gaining ratio</b>, since they are the ones buying the outgoing partner's profit share. Their adjusted capital balance is then added up. If the amount is not paid immediately, it is carried as the <b>retiring partner's loan account</b> until settled.</p>"
        },
        {
          h2: "Gaining Ratio",
          body:
            "<p>Gaining ratio = new ratio − old ratio. After a retirement, the continuing partners pick up the departing partner's share, usually but not necessarily in their existing ratio. This ratio drives goodwill compensation — it is the price of the gain.</p>"
        },
        {
          h2: "Share of Profit Up to the Date of Death",
          body:
            "<p>When a partner dies mid-year, their share of profit for the period from the last balance sheet to the date of death is estimated on one of two bases:</p>" +
            "<ul><li><b>Time basis:</b> last year's profit (or an average of recent years' profits) × fraction of the year × the deceased's share. For a death on 30 September of an April–March year, that is six twelfths.</li>" +
            "<li><b>Product basis:</b> used when profits moved sharply — each period's profit is multiplied by the months it stayed in force, the products are totalled and divided by total months, giving a weighted average to which the deceased's share is applied.</li></ul>" +
            "<p>The deceased's capital account gathers this profit along with reserves, revaluation and goodwill, and the total is paid to the <b>executor's account</b>.</p>"
        }
      ],
      faq: [
        { q: "What is the gaining ratio after a retirement?", a: "New ratio minus old ratio for each continuing partner. It measures how much of the departing partner's share each one picked up." },
        { q: "How is the outgoing partner's goodwill share funded?", a: "By the gaining partners, in the gaining ratio — cash or adjustment against capital, credited to the retiring partner." },
        { q: "Time basis or product basis for death profit?", a: "Time basis when profits are steady across the year; product basis when profits fluctuated sharply, since it weights each period's profit by how long it lasted." }
      ],
      related: [{ label: "Admission of a Partner", route: "ch-adm" }, { label: "Dissolution of a Partnership Firm", route: "ch-dis" }, { label: "Partnership Fundamentals", route: "ch-pf" }]
    },

    "ch-dis": {
      path: "/class-12-accountancy/dissolution-of-partnership-firm/",
      inSitemap: true,
      title: "Dissolution of Partnership Firm Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on dissolution of a partnership firm — types of dissolution, realisation account, realising assets, settling liabilities, expenses and dividing the final cash.",
      keywords: ["dissolution of partnership firm class 12", "realisation account format", "settlement of accounts dissolution", "profit on realisation", "dissolution of firm vs partnership"],
      h1: "Dissolution of a Partnership Firm — Realisation, Settlement and the Final Division (CBSE)",
      lead: "Chapter 6 closes the books for good: the difference between dissolving a partnership and dissolving a firm, the realisation account that converts everything into cash, and how the final cash pile is divided among the partners.",
      sections: [
        {
          h2: "Dissolution of Partnership vs Dissolution of Firm",
          body:
            "<ul><li><b>Dissolution of partnership</b> — the firm's constitution changes: a partner leaves, the deed is rewritten, but the business continues.</li><li><b>Dissolution of firm</b> — the entire business is wound up, assets sold, liabilities paid, operations stopped. Unless the partners agree otherwise, a dissolution of partnership among all partners amounts to dissolution of the firm.</li><li>Types of dissolution include voluntary dissolution by agreement and dissolution by court, alongside the statutory form that follows the end of the partnership itself.</li></ul>"
        },
        {
          h2: "The Realisation Account",
          body:
            "<p>A nominal account built to close every balance-sheet item. <b>Debit side:</b> assets transferred at book value (cash and bank balances stay out), later the liabilities actually paid and the expenses of dissolution. <b>Credit side:</b> liabilities transferred at book value, later the cash realised from each asset. The <b>balance</b> — profit or loss on realisation — goes to the partners in their <b>profit-sharing ratio</b>.</p>" +
            "<p>Worked: assets ₹2,00,000 and liabilities ₹80,000 transferred; assets realise ₹1,75,000; liabilities paid ₹78,000; realisation expenses ₹7,000. Credits = 1,75,000 + 80,000 = ₹2,55,000; debits = 2,00,000 + 78,000 + 7,000 = ₹2,85,000 → <b>realisation loss ₹30,000</b>, shared between the partners in the profit-sharing ratio.</p>"
        },
        {
          h2: "Dividing the Cash",
          body:
            "<p>Cash is applied in statutory order: realisation expenses paid, then any amount due to partners for loans, then — after every outside liability is gone — the surplus goes to the partners against their capital account balances, which already carry their share of reserves and of the realisation profit or loss. Whatever remains is split in the profit-sharing ratio, and the cash/bank account closes at zero.</p>"
        }
      ],
      faq: [
        { q: "What is the realisation account for?", a: "It converts every asset and liability of the dissolved firm into cash terms so the resulting profit or loss can be measured and shared — nothing else may be opened once dissolution begins." },
        { q: "Where does profit or loss on realisation go?", a: "To the partners in their profit-sharing ratio, credited or debited against their capital accounts before the final cash division." },
        { q: "What is paid first from the cash available?", a: "Realisation expenses, then amounts owed to partners for their loans, then outside liabilities — only the surplus reaches partners' capital accounts." }
      ],
      related: [{ label: "Retirement and Death", route: "ch-ret" }, { label: "Partnership Fundamentals", route: "ch-pf" }, { label: "Financial Statements of a Company", route: "ch-cfin" }]
    },

    /* ===================== CLASS 12 — PART A: COMPANIES ===================== */
    "ch-sc": {
      path: "/class-12-accountancy/accounting-for-share-capital/",
      inSitemap: true,
      title: "Accounting for Share Capital Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on accounting for share capital — issue and allotment of shares, over and under subscription, calls in advance and arrears, forfeiture, reissue and Schedule III disclosure.",
      keywords: ["accounting for share capital class 12", "issue of shares journal entries", "forfeiture and reissue of shares", "calls in arrears and advance", "securities premium account"],
      h1: "Accounting for Share Capital — Issue, Allotment, Forfeiture and Reissue (CBSE)",
      lead: "Chapter 7 takes a company from publishing a share issue to forfeiting a defaulting shareholder's holding: the journal entries at application, allotment and call stages, how over- and under-subscription are handled, and where the balances land under Schedule III.",
      sections: [
        {
          h2: "Issue, Allotment and Calls",
          body:
            "<p>Share capital is raised in stages, each with its own entry: at <b>application</b>, money received goes to the Share Application Money account; at <b>allotment</b>, that account is transferred to share capital — and to Securities Premium Account where shares are issued at a premium; at each <b>call</b>, the bank account is debited and share capital credited.</p>" +
            "<p><b>Over-subscription</b> is handled by rejecting applications or allotting in a fixed proportion; <b>under-subscription</b> means the issue is filled only up to what was subscribed (and is invalid below the minimum subscription the Companies Act requires).</p>"
        },
        {
          h2: "Calls in Advance and Calls in Arrears",
          body:
            "<ul><li><b>Calls in arrears</b> — a shareholder fails to pay a call. The unpaid amount is recorded separately against that shareholder; the company's called-up capital still stands.</li><li><b>Calls in advance</b> — a shareholder pays before the call is due. The money sits in a separate calls-in-advance account and is transferred to share capital only when that call actually becomes due. This course computes no interest on either — the figures stay simple.</li></ul>"
        },
        {
          h2: "Forfeiture and Reissue of Shares",
          body:
            "<p>When a shareholder defaults, the company may forfeit their shares: share capital is debited up to the amount called, the amount already paid is credited to the Share Forfeited Account, and anything unpaid is credited to calls-in-arrears.</p>" +
            "<p>Forfeited shares may later be <b>re-issued</b> — at par, at a discount covered by the forfeited amount, or at a premium. On re-issue the Share Forfeited Account absorbs any discount allowed, and the <b>balance still standing in it is transferred to Capital Reserve</b> — a profit the company keeps even if the shareholder never returned.</p>" +
            "<p>Concepts to know for the exam: shares issued <b>for consideration other than cash</b>, <b>private placement</b>, <b>sweat equity</b> and the <b>Employee Stock Option Plan</b> — each brings shares into existence without (or besides) a cash application.</p>"
        }
      ],
      faq: [
        { q: "What happens to securities premium money?", a: "It is credited to Securities Premium Account and kept apart from share capital — a premium is capital receipt, not profit to be distributed." },
        { q: "Where does the balance of the share forfeited account go on reissue?", a: "To Capital Reserve — only the amount remaining after covering any discount allowed on re-issue." },
        { q: "How is under-subscription different from over-subscription?", a: "Under-subscription means fewer applications than shares offered, so allotment is limited to subscriptions received. Over-subscription means more applications than shares, so applications are rejected or partially allotted." }
      ],
      related: [{ label: "Accounting for Debentures", route: "ch-deb" }, { label: "Financial Statements of a Company", route: "ch-cfin" }, { label: "Goodwill: Nature and Valuation", route: "ch-gw" }]
    },

    "ch-deb": {
      path: "/class-12-accountancy/accounting-for-debentures/",
      inSitemap: true,
      title: "Accounting for Debentures Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on accounting for debentures — issue at par, premium and discount, interest on debentures, collateral security, and writing off loss on issue as financial cost.",
      keywords: ["accounting for debentures class 12", "issue of debentures at discount", "interest on debentures entry", "writing off loss on issue of debentures", "debentures as collateral security"],
      h1: "Accounting for Debentures — Issue, Interest and Writing Off the Loss (CBSE)",
      lead: "Chapter 8 treats a debenture as what it is: a company's loan in certificate form. You will issue them at par, premium or discount, pay periodic interest, and write off the loss that arises at the moment of issue.",
      sections: [
        {
          h2: "What a Debenture Is, and Its Types",
          body:
            "<p>A debenture is a certificate acknowledging a <b>loan</b> to the company — its holders are creditors, not owners, and they receive interest whatever the profit position, because interest on debentures is a charge against profit. Debentures are classified by security (secured or naked), by transferability (registered or bearer) and by redemption terms, and they may be issued for consideration other than cash as well.</p>"
        },
        {
          h2: "Issue at Par, Premium and Discount",
          body:
            "<ul><li><b>At par:</b> bank debited, debentures account credited with the full face value.</li><li><b>At premium:</b> the excess over face value is credited to Securities Premium — a debenture issued at a premium acknowledges more loan than face value, and the premium stays apart.</li><li><b>At discount:</b> the shortfall is a loss on issue, recognised immediately and written off (next section).</li></ul>"
        },
        {
          h2: "Interest and Writing Off the Loss on Issue",
          body:
            "<p><b>Interest on debentures</b> is paid periodically: Debenture Interest account debited, bank credited; the interest total is carried to the Statement of Profit and Loss as a <b>financial cost</b>. No TDS computation forms part of this course.</p>" +
            "<p>The <b>loss on issue</b> — discount plus any premium payable on redemption stated at issue — is written off in the year of issue itself: first out of any Securities Premium available, and the rest from the Statement of Profit and Loss as a financial cost (following AS-16 borrowing-cost logic). <b>Debentures as collateral security</b> is the concept where a company hypothecates debentures to a lender without creating a liability for them until the lender actually acts — an entry-free disclosure fact, not a normal issue.</p>"
        }
      ],
      faq: [
        { q: "Are debenture holders owners of the company?", a: "No — they are creditors who lent to the company. That is why interest is a charge payable even in a loss-making year, unlike partner-style appropriations." },
        { q: "How is loss on issue of debentures treated?", a: "Written off immediately: Securities Premium first if available, and any balance as a financial cost in the Statement of Profit and Loss." },
        { q: "What are debentures issued as collateral security?", a: "Debentures handed to a lender as security for a loan. They are disclosed, not treated as an issue of debentures for cash, unless the lender enforces the security." }
      ],
      related: [{ label: "Accounting for Share Capital", route: "ch-sc" }, { label: "Financial Statements of a Company", route: "ch-cfin" }, { label: "Cash Flow Statement", route: "ch-cf" }]
    },

    "ch-cfin": {
      path: "/class-12-accountancy/financial-statements-of-company/",
      inSitemap: true,
      title: "Financial Statements of a Company Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on financial statements of a company — Schedule III headings, statement of profit and loss, company balance sheet, divisible profit and the notes that explain them.",
      keywords: ["financial statements of a company class 12", "schedule iii balance sheet", "statement of profit and loss company", "divisible profit company", "notes to accounts schedule iii"],
      h1: "Financial Statements of a Company — Reading Schedule III (CBSE)",
      lead: "Chapter 9 presents the statements every listed company must publish under Schedule III to the Companies Act 2013: the vertical balance sheet, the statement of profit and loss, and the notes that turn line items into information.",
      sections: [
        {
          h2: "What Company Financial Statements Are For",
          body:
            "<p>Company accounts exist so that shareholders, lenders, the government and employees can judge performance and position without reading the ledgers. Their <b>nature</b> is periodic summary; their <b>uses and importance</b> run from dividend decisions to credit evaluation and tax administration — with well-known <b>limitations</b>: historical cost, inflation, window-dressing possibilities and the fact that accounting policy choices differ between firms.</p>"
        },
        {
          h2: "Schedule III Structure",
          body:
            "<p>The <b>Balance Sheet</b> is vertical: <b>Equity and Liabilities</b> — share capital, reserves and surplus, non-current liabilities, current liabilities, and <b>Assets</b> — non-current assets, current assets, each under prescribed major headings and sub-headings.</p>" +
            "<p>The <b>Statement of Profit and Loss</b> runs revenue from operations, other income, and expenses (employee benefits, cost of materials, depreciation, other expenses) down to profit before tax, then tax and profit for the period — each figure explained by the <b>notes to accounts</b>. This course's statements keep to the Schedule III major headings, without exceptional or extraordinary items.</p>"
        },
        {
          h2: "From Net Profit to Divisible Profit",
          body:
            "<p><b>Divisible profit</b> is what the board can actually distribute: net profit less transfers to reserves (as the problem instructs), less any prior-year adjustments, and less any appropriation the shareholders have approved. Dividend is then declared on that base — a company's profit belongs to shareholders only after the reserves decision is taken.</p>"
        }
      ],
      faq: [
        { q: "How is a company balance sheet different from a sole proprietorship one?", a: "It is a prescribed vertical format under Schedule III with standard major headings — share capital, reserves and surplus, non-current and current liabilities and assets — rather than the free-form liabilities-and-assets layout." },
        { q: "What are notes to accounts?", a: "The disclosures beneath each statement figure: how a balance is made up, which accounting policy applies, and what the number excludes. They are part of the statements, not an appendix." },
        { q: "What is divisible profit?", a: "Net profit adjusted for transfers to reserves and prior adjustments — the amount actually available for distribution to shareholders." }
      ],
      related: [{ label: "Accounting for Share Capital", route: "ch-sc" }, { label: "Analysis of Financial Statements", route: "ch-fsa" }, { label: "Accounting for Debentures", route: "ch-deb" }]
    },

    /* ===================== CLASS 12 — PART B: OPTION 1 ===================== */
    "ch-fsa": {
      path: "/class-12-accountancy/analysis-of-financial-statements/",
      inSitemap: true,
      title: "Analysis of Financial Statements Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on analysis of financial statements — meaning, objectives, tools, comparative statements with worked changes and common-size statements as percentages.",
      keywords: ["analysis of financial statements class 12", "comparative statement example", "common size statement", "horizontal and vertical analysis", "tools of financial analysis"],
      h1: "Analysis of Financial Statements — Comparative and Common-Size Statements (CBSE)",
      lead: "Chapter 10 turns two years of company statements into meaning: what analysis is for, its tools and limits, and the two statements examiners ask you to actually prepare — comparative and common-size.",
      sections: [
        {
          h2: "Meaning, Objectives and Limitations",
          body:
            "<p>Financial statement analysis means selecting, classifying and interpreting the figures in published statements so a decision can be taken. Its <b>objectives</b>: assess profitability and financial position, judge managerial efficiency, forecast earning capacity, compare across years and across firms. Its <b>limitations</b>: inflation distorts historical figures, accounting policies differ between companies, window-dressing is possible, and inter-firm comparison needs similar conditions.</p>"
        },
        {
          h2: "Comparative Statements (Horizontal Analysis)",
          body:
            "<p>A comparative statement places two years side by side and adds two columns per item: <b>absolute change</b> (current year − previous year) and <b>percentage change</b> (absolute change ÷ previous year × 100). Worked: revenue from operations rises from ₹6,00,000 to ₹7,20,000 — absolute change <b>+₹1,20,000</b>, percentage change <b>+20%</b>. The same pair of columns runs down the entire statement, so a reader sees at a glance which lines moved and by how much.</p>"
        },
        {
          h2: "Common-Size Statements (Vertical Analysis)",
          body:
            "<p>A common-size statement converts every figure into a <b>percentage of a base</b>: in the profit and loss statement, revenue from operations; in the balance sheet, the total of each side. A cost at 42% of revenue this year against 46% last year tells the structure story immediately, regardless of the company's size — which is exactly why common-size statements compare firms of different scales where absolute figures cannot.</p>"
        }
      ],
      faq: [
        { q: "What is the base for a common-size profit and loss statement?", a: "Revenue from operations — every income and expense line is expressed as its percentage of that figure." },
        { q: "Comparative or common-size: which one shows trend?", a: "Comparative statements show the trend across years with absolute and percentage change; common-size statements show the internal structure of a single year." },
        { q: "Why is financial analysis limited?", a: "Historical-cost figures ignore inflation, policy choices differ between firms, window-dressing is possible, and comparison across firms only holds when the conditions are comparable." }
      ],
      related: [{ label: "Accounting Ratios", route: "ch-rat" }, { label: "Financial Statements of a Company", route: "ch-cfin" }, { label: "Cash Flow Statement", route: "ch-cf" }]
    },

    "ch-rat": {
      path: "/class-12-accountancy/accounting-ratios/",
      inSitemap: true,
      title: "Accounting Ratios Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on accounting ratios — liquidity, solvency, activity and profitability ratios, each with its formula and a short worked computation.",
      keywords: ["accounting ratios class 12", "current ratio formula", "quick ratio example", "gross profit ratio calculation", "debt equity ratio"],
      h1: "Accounting Ratios — Liquidity, Solvency, Activity and Profitability (CBSE)",
      lead: "Chapter 11 puts every ratio into one of four families and computes them from statement figures: liquidity for the short term, solvency for the long term, activity for how hard assets work, and profitability for the bottom line.",
      sections: [
        {
          h2: "The Four Families",
          body:
            "<ul>" +
            "<li><b>Liquidity</b> — current ratio (current assets ÷ current liabilities) and quick ratio (liquid assets ÷ current liabilities, where liquid assets leave out inventory and prepaid expenses).</li>" +
            "<li><b>Solvency</b> — debt-equity ratio (long-term debt ÷ shareholders' funds), total assets to debt, and proprietary ratio.</li>" +
            "<li><b>Activity</b> — inventory turnover, trade receivables turnover, trade payables turnover and working capital turnover, each measuring how quickly a balance cycles through.</li>" +
            "<li><b>Profitability</b> — gross profit ratio, net profit ratio and return on investment (profit before interest and tax ÷ capital employed).</li>" +
            "</ul>"
        },
        {
          h2: "Worked Computations",
          body:
            "<ul><li>Current assets ₹1,60,000, inventories ₹60,000, current liabilities ₹80,000 → current ratio = 1,60,000 ÷ 80,000 = <b>2:1</b>; quick ratio = (1,60,000 − 60,000) ÷ 80,000 = <b>1.25:1</b>.</li>" +
            "<li>Long-term debt ₹3,00,000, shareholders' funds ₹5,00,000 → debt-equity = <b>0.6:1</b>.</li>" +
            "<li>Revenue from operations ₹8,00,000, cost of revenue ₹6,00,000 → gross profit ₹2,00,000 → gross profit ratio = <b>25%</b>.</li></ul>"
        },
        {
          h2: "What a Ratio Actually Says",
          body:
            "<p>A ratio is a relationship, not a verdict — its meaning comes from comparing it with the firm's own past ratios, the industry norm and the stated accounting policies. A current ratio of 2:1 is conventionally comfortable; the same figure built from slow-moving inventory is less reassuring, which is exactly why the quick ratio is computed alongside.</p>"
        }
      ],
      faq: [
        { q: "Why exclude inventory from the quick ratio?", a: "Inventory is the least liquid current asset — it must be sold first, and often at a discount. Quick ratio tests whether short-term dues can be met without depending on those sales." },
        { q: "What is the formula for the gross profit ratio?", a: "Gross profit divided by revenue from operations, multiplied by 100, expressed as a percentage." },
        { q: "How is return on investment computed?", a: "Profit before interest and tax divided by capital employed (long-term funds employed in the business), multiplied by 100." }
      ],
      related: [{ label: "Analysis of Financial Statements", route: "ch-fsa" }, { label: "Cash Flow Statement", route: "ch-cf" }, { label: "Financial Statements of a Company", route: "ch-cfin" }]
    },

    "ch-cf": {
      path: "/class-12-accountancy/cash-flow-statement/",
      inSitemap: true,
      title: "Cash Flow Statement Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on the cash flow statement under AS 3 — operating, investing and financing activities, the indirect method and the standard year-end adjustments.",
      keywords: ["cash flow statement class 12", "operating investing financing activities", "indirect method cash flow", "as 3 cash flow", "adjustments cash flow statement"],
      h1: "Cash Flow Statement — Operating, Investing and Financing (AS 3, Indirect Method)",
      lead: "Chapter 12 classifies every rupee that moved during the year into one of three activities and builds the statement by the indirect method — starting from profit before tax and converting it into cash, one adjustment at a time.",
      sections: [
        {
          h2: "Cash, Cash Equivalents and the Three Activities",
          body:
            "<p><b>Cash</b> is cash in hand and demand deposits; <b>cash equivalents</b> are short-term, highly liquid investments readily convertible to known cash amounts (current investments count as marketable securities unless stated otherwise). The activities:</p>" +
            "<ul><li><b>Operating</b> — the enterprise's core revenue-generating transactions: cash from customers, cash paid to suppliers and employees.</li>" +
            "<li><b>Investing</b> — acquisition and disposal of long-term assets and other investments not included in cash equivalents.</li>" +
            "<li><b>Financing</b> — transactions that change the size and composition of the owners' capital and borrowings: share issues, borrowings, dividend and interest paid.</li></ul>"
        },
        {
          h2: "The Indirect Method, Step by Step",
          body:
            "<p>Start with <b>profit before tax</b>. Add back non-cash charges (depreciation, amortisation) and non-operating losses (loss on sale of assets); deduct non-operating gains (profit on sale). Then adjust for working-capital movement: an <b>increase in a current asset is deducted</b>, a decrease added; an <b>increase in a current liability is added</b>, a decrease deducted. The result is cash generated from operations — the heart of the statement.</p>" +
            "<p>Worked: profit before tax ₹2,00,000; depreciation ₹30,000; loss on sale ₹5,000; inventories up ₹20,000; trade payables up ₹10,000 → 2,00,000 + 30,000 + 5,000 − 20,000 + 10,000 = <b>₹2,25,000</b>.</p>"
        },
        {
          h2: "The Standard Adjustments",
          body:
            "<ul><li><b>Depreciation and amortisation</b> — never a cash flow; add back.</li><li><b>Profit or loss on sale of assets (including investments)</b> — strip out of operating; the sale proceeds themselves are an investing inflow.</li><li><b>Dividend</b> — interim dividend paid is a financing outflow in the year paid; a proposed dividend is accounted for in the following year, after declaration.</li><li><b>Tax</b> — treated as operating until paid; the amount actually paid is deducted.</li></ul>" +
            "<p>Two rules worth memorising: bank overdraft and cash credit are short-term borrowings (financing), and current investments are treated as marketable securities unless the question says otherwise.</p>"
        }
      ],
      faq: [
        { q: "Is depreciation added or deducted in the indirect method?", a: "Added back — it reduced profit but no cash left the business." },
        { q: "How is an increase in inventory treated?", a: "Deducted from cash generated from operations: cash was tied up buying stock that has not yet been sold." },
        { q: "Where does bank overdraft appear?", a: "As a short-term borrowing under financing activities — it is money the business drew, not money it holds." }
      ],
      related: [{ label: "Accounting Ratios", route: "ch-rat" }, { label: "Analysis of Financial Statements", route: "ch-fsa" }, { label: "Accounting for Debentures", route: "ch-deb" }]
    },

    /* ===================== CLASS 12 — PART B: OPTION 2 ===================== */
    "ch-ca": {
      path: "/class-12-accountancy/computerised-accounting/",
      inSitemap: true,
      title: "Computerised Accounting Class 12 Notes | Accountancy By Abinash",
      description: "Class 12 notes on computerised accounting — CAS features, software packages, electronic spreadsheets, account heads, data validation, statements and system security.",
      keywords: ["computerised accounting class 12", "features of computerised accounting", "electronic spreadsheet accounting", "data validation spreadsheet", "system security accounting software"],
      h1: "Computerised Accounting — CAS, Spreadsheets, Account Heads and Security (CBSE)",
      lead: "Chapter 13 — the Computerised Accounting option — covers what a CAS does and how, the spreadsheet skills behind it (formulae, charts, validation), how account heads are codified, and the security every accounting system needs.",
      sections: [
        {
          h2: "Overview and Features of CAS",
          body:
            "<p>Computerised accounting replaces manual recording with software that captures transactions once and generates every statement from them. Its <b>features</b>: speed in recording and reporting, accuracy free of arithmetic slips, scalability across volumes, versatility in report formats, reliability through backup, and connectivity across users. <b>Software packages</b> are generic (standardised accounting for many businesses), specific (built for one industry, e.g. a hospital or school) and tailored (customised for one organisation's needs).</p>"
        },
        {
          h2: "Electronic Spreadsheets in Accounting",
          body:
            "<p>An electronic spreadsheet is a grid of cells addressed by column and row, where formulas recalculate the whole sheet whenever an input changes. Its accounting applications in this syllabus: <b>bank reconciliation</b> (matching book and statement balances with formulae), <b>asset accounting</b> (depreciation schedules by SLM or WDV), <b>loan repayment schedules</b> (EMI tables by changing rate or tenure) and <b>ratio analysis</b> (ratios recomputed live as figures update).</p>" +
            "<p><b>Data representation</b> follows: bar, column, line and pie charts turn the same tables into visual statements. Standard functions you should recognise: SUM, AVERAGE, IF for conditional tests, and VLOOKUP for matching values across tables.</p>"
        },
        {
          h2: "Account Heads, Data Entry and Statements",
          body:
            "<p>Account heads are organised by a <b>codification</b> — a code that identifies each head and its place in a <b>hierarchy</b> (primary heads, sub-heads, sub-sub-heads), so vouchers post to the correct account and reports group correctly. <b>Data entry, validation and verification</b> keep the inputs honest: lists restrict entries to valid choices, ranges reject impossible figures, cross-checks confirm totals. <b>Adjusting entries</b>, closing entries and opening entries then produce the statements, exactly as in manual accounting — only faster.</p>"
        },
        {
          h2: "System Security",
          body:
            "<p>An accounting system holds the firm's most sensitive numbers, so security is a feature, not an afterthought: user identification and role-based access, strong passwords changed regularly, systematic backup kept at a separate location, and protection against viruses and unauthorised access. The need is simple — an accounting system is only as trustworthy as the controls around it.</p>"
        }
      ],
      faq: [
        { q: "What is the difference between generic, specific and tailored packages?", a: "Generic packages serve any business with standard features; specific packages are built for one industry's needs; tailored packages are customised for a single organisation." },
        { q: "Why use spreadsheets for accounting at all?", a: "Because one changed input instantly recalculates every dependent figure — depreciation schedules, loan EMIs and ratios all update together, which manual recomputation cannot match." },
        { q: "What does data validation do?", a: "It restricts what can be entered into a cell — a list of allowed values, a numeric range, or a format — so impossible or inconsistent data is rejected at entry instead of discovered in the reports." }
      ],
      related: [{ label: "Analysis of Financial Statements", route: "ch-fsa" }, { label: "Financial Statements of a Company", route: "ch-cfin" }, { label: "Accounting Ratios", route: "ch-rat" }]
    },

    /* ===================== PRIVATE / UTILITY VIEWS ===================== */
    "more": { path: null, noindex: true, title: "More Tools | Accountancy By Abinash", description: "Additional study tools and settings." },
    "practice-hub": { path: null, noindex: true, title: "Practice Hub | Accountancy By Abinash", description: "Choose a practice activity." },
    "settings": { path: null, noindex: true, title: "Settings | Accountancy By Abinash", description: "Personalise your learning experience." },
    "performance": { path: null, noindex: true, title: "Performance | Accountancy By Abinash", description: "Your progress and performance summary." },
    "bookmarks": { path: null, noindex: true, title: "Bookmarks | Accountancy By Abinash", description: "Questions and topics you bookmarked." },
    "mistake-book": { path: null, noindex: true, title: "Mistake Book | Accountancy By Abinash", description: "Every question you got wrong, with explanations to revise." },
    "certificate-view": { path: null, noindex: true, title: "Certificate | Accountancy By Abinash", description: "Your exam completion certificate." },
    "admin-report": { path: null, noindex: true, title: "Admin Report | Accountancy By Abinash", description: "Private examination administration report." }
  };

  /* ------------------------------------------------------------
     Helpers
     ------------------------------------------------------------ */
  function pathFor(route) {
    var r = ROUTES[route];
    return r && r.path ? r.path : null;
  }
  function routeForPath(path) {
    if (!path) return null;
    var norm = path.replace(/\/index\.html$/, "/");
    if (norm !== "/" && norm.charAt(norm.length - 1) !== "/") norm += "/";
    for (var id in ROUTES) {
      if (ROUTES[id].path === norm) return id;
    }
    return null;
  }
  function isPublic(route) {
    var r = ROUTES[route];
    return !!(r && r.path && !r.noindex);
  }
  function publicRoutes() {
    return Object.keys(ROUTES).filter(isPublic);
  }
  /* Breadcrumb trail for a route (array of {label, path}). */
  function breadcrumbFor(route) {
    var r = ROUTES[route];
    if (!r) return [{ label: "Home", path: "/" }];
    var trail = [{ label: "Home", path: "/" }];
    if (route !== "home") {
      if (route !== "chapters-list" && r.path && r.path.indexOf("/class-11-accountancy/") === 0) {
        trail.push({ label: "Class 11 Accountancy", path: ROUTES["chapters-list"].path });
      }
      if (route !== "chapters-list-12" && r.path && r.path.indexOf("/class-12-accountancy/") === 0) {
        trail.push({ label: "Class 12 Accountancy", path: ROUTES["chapters-list-12"].path });
      }
      trail.push({ label: r.title ? (r.h1 ? stripTags(r.h1) : route) : route, path: r.path });
    }
    return trail;
  }
  function stripTags(html) {
    return String(html || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ");
  }

  return {
    ORIGIN: ORIGIN,
    SITE: SITE,
    ROUTES: ROUTES,
    CLASS_TRAIL: CLASS_TRAIL,
    CLASS12_TRAIL: CLASS12_TRAIL,
    pathFor: pathFor,
    routeForPath: routeForPath,
    isPublic: isPublic,
    publicRoutes: publicRoutes,
    breadcrumbFor: breadcrumbFor,
    stripTags: stripTags
  };
});
