# CBSE Class 11 Accountancy — verified basis for the exam papers

This file records **exactly what CBSE publishes** for Class XI Accountancy, what the
site therefore had to design itself, and what is explicitly *not* claimed. It is
internal documentation. None of it is shown on any student-facing screen.

---

## 1. What was checked, and where

Two official CBSE curriculum documents were retrieved and read in full:

| Session | Document | URL |
|---|---|---|
| 2025–26 | *Accountancy (055), Senior Secondary Curriculum* | `cbseacademic.nic.in/web_material/CurriculumMain26/SrSec/Accountancy_SrSec_2025-26.pdf` |
| 2026–27 | *Accountancy (055), Senior Secondary (Part 2)* | `cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Accountancy_SecP2_2026-27.pdf` |

Both sessions agree on every number quoted below, so the paper design is not
tied to a single year's document.

The CBSE sample-paper archive (`cbseacademic.nic.in/sqp_archive.html`) was also
walked from 2014–15 through 2025–26.

These facts are recorded on the engine as `ExamRules.CBSE_VERIFIED` so the code
and this document cannot drift apart, and so a test can assert the honesty rules
(`tests/exam-bank-tests.js`, section I).

---

## 2. The single most important finding

**CBSE publishes Sample Question Papers for Class X and Class XII only. There is
no official CBSE Class XI sample paper, and there never has been.**

Class XI examinations are conducted by the school, not by CBSE as a board exam.
CBSE's own curriculum for Class XI states the syllabus and its weightage; it does
not set, issue or endorse a Class XI question paper.

### What this means for the "CBSE Board Mock Test"

The mode is named *CBSE Board Mock Test* because it rehearses the **paper CBSE
prescribes the syllabus for** — not because it reproduces a paper CBSE issued.
It can never be an official CBSE Class XI paper, because no such document exists
to copy.

The site never states or implies otherwise. On the instructions screen the paper
is described by its own structure, and the mode carries no "official", "issued"
or "sample paper" wording.

---

## 3. What CBSE *does* publish for Class XI Accountancy

Everything in this section is taken verbatim from the two curriculum PDFs above.

| Item | Published value |
|---|---|
| Subject | Accountancy, code **055** |
| Theory paper | **80 marks**, **3 hours** |
| Project work | **20 marks** (separate from the theory paper) |
| Unit 1 — Theoretical Framework | **12 marks** |
| Unit 2 — Accounting Process | **44 marks** |
| Unit 3 — Financial Statements of Sole Proprietorship | **24 marks** |
| Cognitive split — Remembering & Understanding | **32 marks (40 %)** |
| Cognitive split — Applying | **24 marks (30 %)** |
| Cognitive split — Analysing, Evaluating & Creating | **24 marks (30 %)** |

The three units total 12 + 44 + 24 = **80**, matching the theory paper, and the
three cognitive levels total 32 + 24 + 24 = **80** and 40 % + 30 % + 30 % = **100 %**.

The 20-mark project is **not** part of this paper and is not simulated anywhere.

---

## 4. What CBSE does *not* publish

These are the gaps that the site had to fill by design rather than by reference.
Each is a real limitation and is not disguised anywhere in the product.

| Gap | Consequence |
|---|---|
| No question count per paper | The 52-question count is a design choice |
| No section layout (A/B/C/D/E) | The five-section structure is a design choice |
| No marks-per-question scheme | 1 / 2 / 3 / 4 / 6 marks per section is a design choice |
| No internal-choice policy | The mock sets **no** internal choice |
| No negative-marking rule | The mock sets **no** negative marking |
| No difficulty progression rule | Easy → Hard ordering within the paper is a design choice |
| No question formats prescribed | The mix of MCQ / multi / matching / numerical / case is a design choice |
| No Class XI sample paper at all | Nothing could be copied, so **no** question is presented as a previous year, sample or board question |

Because CBSE prescribes no negative marking for Class XI, the mock awards none.
Negative marking is only ever added if a future session's official document
prescribes it — which it does not today.

---

## 5. The designed structure, and why it is defensible

The mock keeps the **three published constants** exact — 80 marks, three hours,
and unit weightage 12 / 44 / 24 — and builds a section layout around them that is
conventional for a CBSE Class XI theory paper:

| Section | Items | Marks each | Section total | Content |
|---|---|---|---|---|
| A | 40 | 1 | 40 | Objective: MCQ, multi-select, matching, numerical — U1 ×12, U2 ×26, U3 ×2 |
| B | 4 | 2 | 8 | Short answers (U2): 3 numerical + 1 case |
| C | 4 | 3 | 12 | U2 ×2, U3 ×2 — case studies and numericals |
| D | 2 | 4 | 8 | U2 ×1, U3 ×1 — case studies |
| E | 2 | 6 | 12 | U3 ×2 — comprehensive case studies |
| | **52** | | **80** | |

- **Unit totals come out at exactly 12 / 44 / 24**, verified on every draw.
- **Cognitive typology** is targeted at the published 40 / 30 / 30 split and
  treated as a soft constraint (each level is checked to stay within about ±5
  percentage points). The unit split, by contrast, is a hard constraint.
- **Difficulty progresses** Easy → Hard down the paper: objective items first,
  comprehensive case studies last.
- **Total marks and question count are always consistent** — the engine refuses
  to display any paper whose drawn marks or count do not match its own blueprint.

If a blueprint cannot be satisfied from the bank, `ExamRules.drawPaper` returns
`{ ok: false, error: "blueprint-not-met" }` and the paper is never shown, rather
than being displayed with a silently wrong mark total.

---

## 6. Provenance policy

Every question carries `provenance` as **internal metadata only**:

- `{ kind: "new", verified: true }` — authored for this site against the syllabus.
- `{ kind: "adapted", source: "site:…", verified: true }` — taken from the site's
  own existing material (practice bank, chapter questions, Important Questions).

No "previous year question", "PYQ", "sample paper", "official paper" or external
URL may appear anywhere in a question, passage, option, sub-question or
explanation. This is enforced by `tests/exam-bank-tests.js` (test A10), which
probes every student-facing string in the repository.

Two phrases are deliberately **not** banned, because banning them would force
correct accounting to be rewritten:

- *"question paper"* — "the question paper is divided into five sections" is
  ordinary syllabus language carrying no provenance claim.
- *"previous year"* — "bring forward the previous year's closing balances" and
  "₹8,000 relating to the previous year" are standard accrual and
  closing-entries wording. What is banned is *"previous year"* when followed by
  *question / paper / exam / board*, i.e. when it is being used to cite a paper.

**Authenticity, stated plainly:** because no Class XI previous-year or sample
paper is publicly verifiable, **no question in this bank is claimed to be an
authentic past paper question.** All 844 authored questions are original; the
remaining 1,456 are adapted from the site's own material. The coverage report
counts them separately for this reason.

---

## 7. Syllabus scope

In scope (per the curriculum PDFs): Theoretical Framework; Accounting Process
including the accounting equation, debit and credit, journal, ledger, subsidiary
books, cash book, bank reconciliation, GST, trial balance, depreciation,
provisions and reserves, rectification of errors; Financial Statements of Sole
Proprietorship including year-end adjustments.

**Deliberately excluded** — these are in the older syllabus or in other classes
and must not appear:

- Bills of exchange
- Computerised accounting
- Partnership and company accounts
- Not-for-Profit organisations
- Accounting ratios and cash-flow statements
- Change in the method of depreciation
- Conversion method for incomplete records
- Detailed individual Accounting Standards

### Known gap

**"Incomplete Records (Accounts from Incomplete Records)"** is part of the
current Unit 2 syllabus, but the site has **no chapter for it**. It is therefore
not covered by this question bank. This is recorded here rather than papered
over; the topic needs a new chapter before it can be assessed.

---

## 8. Summary of honesty claims

| Claim | Status |
|---|---|
| "Based on the official CBSE Class XI Accountancy curriculum" | **Yes** — 80 marks, 3 hours, units 12 / 44 / 24, typology 40 / 30 / 30 |
| "An official CBSE question paper" | **No — never claimed, and never true** |
| "Contains previous year / board questions" | **No — never claimed, and unverifiable** |
| "Negative marking applies" | **No** — CBSE prescribes none for Class XI |
| "20-mark project simulated" | **No** — the project is not part of this theory paper |
| "Latest CBSE syllabus" | Claimed only as far as the checked 2025–26 and 2026–27 documents support |
