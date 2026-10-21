# QUESTION AUTHORING SPEC — Accountancy by Abhinash (Exam Mode expansion)

This file is the single contract for every newly authored examination question.
Agents write ONE fragment file; a build step concatenates the fragments into
`questions-expanded.js`. Nothing in this file may change the existing practice
bank, the seven existing exam modes, or any unrelated feature.

---

## 1. Output file

Write ONLY the file you are assigned. Do not modify any other project file.

```js
/* ============================================================
   EXPANDED EXAM BANK — <group name>
   Authored for the CBSE Class 11 Accountancy (055) syllabus.
   Generated source fragment; concatenated into questions-expanded.js.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.EXAM_Q_<GROUP> = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return [
    { ...question 1... },
    ...
  ];
});
```

File must be valid UTF-8 JavaScript. Use the `₹` character directly (UTF-8),
never `Rs.`, `INR` or `?`.

---

## 2. Question object schema (ALL fields shown; include every one that applies)

```js
{
  "id": "x-jr-0001",              // REQUIRED. string. Pattern: x-<chapterId>-<4 digits>,
                                  // sequential from 0001 within your chapter. Globally unique.
  "chapter": "jr",                // REQUIRED. one of the 18 chapter ids (table below)
  "topic": "Journalising",        // REQUIRED. short syllabus topic (<= 40 chars)
  "type": "mcq",                  // REQUIRED. one of: mcq | multi | numerical | matching | case
  "difficulty": "Easy",           // REQUIRED. Easy | Medium | Hard
  "marks": 1,                     // REQUIRED. integer >= 1. For "case" = sum of sub marks.
  "q": "Question text…",          // REQUIRED for every type (for "case" this is the stem above the passage)

  // --- type "mcq" -------------------------------------------------
  "options": ["…", "…", "…", "…"],// REQUIRED. exactly 4 options (never 3).
  "answerIndex": 2,               // REQUIRED. index of the ONE correct option (0..3)

  // --- type "multi" (select ALL that apply; 2-3 correct of 4-5) ----
  "options": ["…", "…", "…", "…"],// REQUIRED. exactly 4 or 5 options
  "answers": [0, 2],              // REQUIRED. ALL correct indices, ascending, length >= 2

  // --- type "numerical" (enter a number) ---------------------------
  "value": 45000,                 // REQUIRED. the exact correct number
  "tolerance": 0,                 // REQUIRED. allowed absolute error. 0 unless rounding allows more.
  "unit": "₹",                    // OPTIONAL. prefix/suffix shown to the student ("₹", "%", "months", "years")
  "prefix": "₹",                  // OPTIONAL. display BEFORE the input box (use for ₹ amounts)
  "suffix": "",                   // OPTIONAL. display AFTER the input box (use for "%", "years")

  // --- type "matching" ---------------------------------------------
  "left": ["…", "…", "…", "…"],   // REQUIRED. 4 items to be matched (column A)
  "right": ["…", "…", "…", "…", "…"], // REQUIRED. 5 options (one is a decoy that matches nothing)
  "answerSlots": [0, 3, 1, 4],    // REQUIRED. for EACH left item, the index of its correct right item

  // --- type "case" (a case study / competency passage) --------------
  "passage": "Longer scenario text…", // REQUIRED. shared passage shown ONCE
  "subs": [ { ...sub-question... }, ... ],  // REQUIRED. 2 or 3 sub-questions
  // sub-question object:
  //   { "q": "…", "type": "mcq"|"multi"|"numerical",
  //     "difficulty": "Medium",          // optional, defaults to the case difficulty
  //     "marks": 1,                      // REQUIRED, integer >=1; sum must equal question.marks
  //     "options": [...], "answerIndex": … , "answers": […],
  //     "value": …, "tolerance": …, "prefix": …, "suffix": …,
  //     "explanation": "…" }             // REQUIRED on every sub

  "explanation": "Why the answer is right, with the working shown.", // REQUIRED (case: overall explanation)
  "tags": ["competency"],          // REQUIRED array, may be []. See allowed tags below.
  "image": {                       // OPTIONAL — only when an image genuinely helps
     "src": "assets/questions/xyz.svg",
     "alt": "Meaningful alternative text describing the visual.",
     "table": "Text/table alternative rendered under the image for accessibility."
  },
  "provenance": { "kind": "new", "verified": true }  // ALWAYS exactly this. Never mention it in q/options.
}
```

### Allowed `tags` (use only these strings)
`"competency"`, `"hots"`, `"numerical"`, `"image"`, `"assertion-reason"`,
`"statement"`, `"application"`, `"case-study"`, `"conceptual"`.

An assertion–reason MCQ and a statement-based MCQ are still `type: "mcq"`;
they carry the matching tag and use the canonical option wording:

* **assertion–reason** options must be exactly:
  `["Both A and R are true and R is the correct explanation of A",
   "Both A and R are true but R is not the correct explanation of A",
   "A is true but R is false",
   "A is false but R is true"]`
  and `q` must present (A) assertion and (R) reason lines.
* **statement** questions list statements (i)/(ii)/(iii) in `q` and the options
  choose combinations, e.g. `["(i) and (ii) only", "(ii) and (iii) only", …]`.

---

## 3. Chapter ids (18 — the CBSE Class 11 Accountancy syllabus actually used by this site)

| id | chapter |
|----|---------|
| intro | 1 Introduction to Accounting |
| terms | 2 Basic Accounting Terms |
| tbase | 3 Theory Base of Accounting, Accounting Standards & Ind AS |
| basis | 4 Bases of Accounting |
| eq | 5 Accounting Equation |
| dc | 6 Rules of Debit & Credit |
| jr | 7 Journal |
| lg | 8 Ledger |
| cb | 9 Cash Book |
| sp2 | 10 Other Books (Purchase/Sales/Returns/Journal Proper/Petty Cash) |
| brs | 11 Bank Reconciliation Statement |
| gst | 12 Accounting of GST |
| tb | 13 Trial Balance |
| dep | 14 Depreciation |
| pres | 15 Provisions and Reserves |
| roe | 16 Rectification of Errors |
| fs | 17 Financial Statements of Sole Proprietorship |
| adj | 18 Adjustments in Financial Statements |

---

## 4. IN SCOPE / OUT OF SCOPE (verified against the official CBSE curriculum PDF)

**Never author a question on any of these — they are NOT in the Class 11 syllabus:**

* Bills of Exchange
* Computerised Accounting / spreadsheet / Tally (Class 12 topic; Class 11 has only Project Work)
* Partnership or Company accounts, share capital, debentures (Class 12)
* Not-for-Profit organisations (Class 12)
* Accounting Ratios, Comparative/Common-size statements, Cash Flow (Class 12)
* Change of depreciation method (the curriculum says "Excluding change of method")
* Conversion method for Incomplete Records
* Detailed treatment of individual Accounting Standards (only meaning, applicability,
  objectives, advantages, limitations are in scope)
* Interest on partners, goodwill valuation, etc.

**In scope and expected:**

* Unit 1 (12 marks) — Introduction to Accounting, Basic Accounting Terms,
  Theory Base of Accounting (concepts, assumptions, GAAP, Accounting Standards,
  Ind AS), Bases of Accounting, GST characteristics & advantages.
* Unit 2 (44 marks) — Vouchers & source documents, Accounting Equation,
  Rules of Debit & Credit, Journal, Special purpose books (Cash Book simple /
  with bank column / petty cash book, Purchases book, Sales book, Purchases
  return book, Sales return book, Journal proper — including trade discount,
  freight and cartage for SIMPLE GST calculation), Ledger, Bank Reconciliation
  Statement, Depreciation (SLM, WDV; recording — charging to asset account and
  creating provision/accumulated depreciation; disposal of asset), Provisions &
  Reserves (types incl. secret reserve), Trial Balance (balance method only),
  Classification of errors and their effect on the Trial Balance, detection &
  rectification, Suspense Account.
* Unit 3 (24 marks) — Financial statements: revenue/capital receipts and
  expenditure, deferred revenue expenditure, opening entry, Trading & P&L A/c
  (gross profit, operating profit, net profit), Balance Sheet (grouping and
  marshalling), all listed year-end adjustments (closing stock, outstanding
  expenses, prepaid expenses, accrued income, income received in advance,
  depreciation, bad debts, provision for doubtful debts, provision for discount
  on debtors, abnormal loss, goods taken for personal use / staff welfare,
  interest on capital, manager's commission).
* **Incomplete Records** (Statement of Affairs method) is in the syllabus but this
  website has no chapter for it — do NOT author questions for it.

---

## 5. Quality rules (a validator enforces every one of these)

1. **Genuinely different.** Never reword an existing question, never change only
   names/numbers/option order of another question to make a "new" one. Two
   questions in your file must not test the same fact in the same way.
2. **Unique id**, unique question text (compared across your own file).
3. **Exactly one unambiguous correct answer.** Distractors must be plausible and
   definitely wrong. For `multi`, every option in `answers` must be correct and
   every option NOT in `answers` must be wrong.
4. **Numericals must actually compute.** Put the arithmetic in the explanation.
   Use realistic Class 11 figures with clean results. Round paise away unless the
   question is about rounding. State units.
5. **No answer-position bias.** Spread `answerIndex` across 0,1,2,3 — roughly a
   quarter each. (The site shuffles options at render time, but the source data
   must not be lopsided.)
6. **No leaks.** Never write "PYQ", "previous year", "sample paper", a year, a
   URL, "source", "CBSE question", or any provenance statement anywhere the
   student sees (`q`, `options`, `passage`, `left`, `right`, `image.alt`).
   Provenance lives ONLY in the `provenance` object.
7. **Student-facing text only shows the chapter name** — do not put chapter
   numbers or syllabus/unit commentary inside `q`.
8. **Difficulty**: roughly 35% Easy, 45% Medium, 20% Hard in your file.
9. **Type mix** (per chapter, see your assignment): the counts are a minimum.
10. **Marks**: `mcq`/`multi`/`numerical`/`matching` are usually 1. For `case`,
    sub-questions may carry 1 or 2 marks so a case totals 3–5 marks. Keep
    `question.marks` equal to the sum of `subs[].marks`.
11. **Explanation quality**: a student should be able to learn from it. Numericals
    show the working line by line.
12. **No typographical errors**, no ambiguous wording, correct accounting
    terminology and formats (Dr/Cr, ₹ Indian digit grouping 1,00,000).
13. **Images**: only use image objects if your assignment tells you the exact
    filenames available. Otherwise write no `image` field at all — never invent
    a src path.
14. Do not add fields that are not in the schema.

---

## 6. Difficulty and Indian numbering conventions

* Amounts in Indian grouping: `₹4,50,000`, `₹1,20,000`, `₹7,500`.
* Use `₹` inside text; inside `numerical` values use a plain JS number (`450000`).
* Percentages: `12%`, `2.5%`.
* Dates: `31st March, 2025` style.

---

## 7. Per-chapter quantity minimums (HARD requirement)

Every chapter needs **at least 36 authored questions**. Of those:

| type | minimum per chapter |
|------|---------------------|
| `mcq` | 15 |
| `case` | 4 |
| `multi` | 4 |
| `matching` | 2 |
| `numerical` | 3 (aim for 6–10 in eq, jr, lg, cb, brs, gst, tb, dep, fs, adj) |
| remaining | any type (more mcq / case / numerical / multi) |

Difficulty spread in every chapter file: about 35% Easy, 45% Medium, 20% Hard.

Tags: at least 6 questions per chapter tagged `"competency"` and at least 5
tagged `"hots"`. At least 4 per chapter tagged `"assertion-reason"` or
`"statement"` combined (conceptual chapters should reach 6).

**Total across all 18 chapters must be >= 648 authored questions.** Quality
beats volume: a wrong or ambiguous question fails the validator and is removed,
so verify before you finish.

