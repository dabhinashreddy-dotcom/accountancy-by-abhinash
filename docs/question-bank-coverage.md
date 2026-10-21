# Question bank coverage report

Per-chapter inventory of the central repository that serves every exam mode.

Figures below are **generated, not typed by hand**. Reproduce them with:

```
node tools/build-question-bank.js          # rebuilds questions-expanded.js
node tests/exam-bank-tests.js              # integrity + engine suite
```

Generated at the state shipped in this package: **2,300 questions** across 18
chapters, built from 4 source layers, with 20 duplicate-wording items dropped
and 0 malformed items discarded.

---

## 1. Counting method

A question is counted **only if all of the following hold**. Anything failing a
check is either repaired or excluded — never counted.

1. **Unique id.** Compared as text, so a numeric id `1` can never collide with a
   string id `"1"`.
2. **Valid shape.** Known `type`, known `chapter`, `difficulty` of
   Easy/Medium/Hard, stem of at least 8 characters, explanation of at least 20
   characters, `marks` an integer 1–20.
3. **Answer key present and self-consistent.** MCQ index inside the option list;
   multi indices inside the option list with at least one correct pick; matching
   slot count equal to the left column and every slot inside the right column;
   numerical a finite number with a stated tolerance; case with 2–4 sub-questions
   whose marks sum exactly to the question's marks.
4. **No duplicate wording.** Two questions sharing a normalised fingerprint
   (question stem + passage + prompt + every sub-stem) are the same question, so
   the second one is dropped. The build reports each drop, and the test asserts
   every reported drop really is absent from the repository.
5. **Not counted twice.** A case-study counts as **one** case study, no matter
   how many sub-questions it has. Its sub-questions are *not* also counted as
   separate MCQs — which is why "Case" and "MCQ" columns do not overlap.
6. **Descriptive items are counted for coverage only.** They carry
   `examEligible: false` and are excluded from every paper, so they never inflate
   the exam-eligible figure. See the limitation in §4.

Two columns need a note:

- **Exam-eligible** — the subset that can actually appear in a paper. The gap
  between *Total* and *Exam-eligible* is exactly the descriptive items.
- **New / Adapted** — `New` = authored for this site; `Adapted` = taken from the
  site's own existing material (practice bank, chapter questions, Important
  Questions). Provenance is internal metadata and is never shown to a student.

---

## 2. Per-chapter coverage

| # | Chapter | Total | MCQ | Multi | Matching | Numerical | Case | Descr. | Image | Competency | HOTS | Easy/Med/Hard | Exam-eligible | New | Adapted |
|---|---------|-------|-----|-------|----------|-----------|------|--------|-------|------------|------|--------------|---------------|-----|---------|
| 1 | 1. Introduction to Accounting | 96 | 66 | 6 | 3 | 5 | 8 | 8 | 0 | 14 | 7 | 28/48/20 | 88 | 42 | 54 |
| 2 | 2. Basic Accounting Terms | 140 | 110 | 5 | 3 | 6 | 8 | 8 | 0 | 10 | 7 | 26/98/16 | 132 | 42 | 98 |
| 3 | 3. Theory Base of Accounting | 138 | 109 | 6 | 2 | 6 | 7 | 8 | 0 | 10 | 6 | 26/91/21 | 130 | 40 | 98 |
| 4 | 4. Bases of Accounting | 114 | 85 | 5 | 2 | 7 | 7 | 8 | 0 | 9 | 8 | 24/71/19 | 106 | 40 | 74 |
| 5 | 5. Accounting Equation | 157 | 37 | 5 | 2 | 97 | 8 | 8 | 3 | 11 | 10 | 52/65/40 | 149 | 45 | 112 |
| 6 | 6. Debit and Credit | 69 | 36 | 5 | 2 | 10 | 8 | 8 | 0 | 10 | 7 | 22/33/14 | 61 | 41 | 28 |
| 7 | 7. Journal | 112 | 68 | 6 | 3 | 13 | 10 | 12 | 3 | 11 | 8 | 27/61/24 | 100 | 52 | 60 |
| 8 | 8. Ledger | 123 | 39 | 5 | 3 | 14 | 9 | 53 | 3 | 13 | 7 | 34/57/32 | 70 | 50 | 73 |
| 9 | 9. Cash Book | 112 | 70 | 5 | 4 | 12 | 9 | 12 | 3 | 12 | 9 | 35/56/21 | 100 | 49 | 63 |
| 10 | 10. Subsidiary Books | 79 | 40 | 5 | 3 | 11 | 10 | 10 | 0 | 14 | 7 | 24/42/13 | 69 | 46 | 33 |
| 11 | 11. Bank Reconciliation Statement | 196 | 58 | 4 | 2 | 114 | 8 | 10 | 3 | 9 | 7 | 90/90/16 | 186 | 44 | 152 |
| 12 | 12. GST (with Tally) | 165 | 129 | 5 | 2 | 11 | 8 | 10 | 0 | 11 | 7 | 71/71/23 | 155 | 42 | 123 |
| 13 | 13. Trial Balance | 207 | 167 | 4 | 3 | 14 | 9 | 10 | 3 | 17 | 7 | 89/87/31 | 197 | 50 | 157 |
| 14 | 14. Depreciation | 121 | 79 | 4 | 3 | 15 | 8 | 12 | 3 | 11 | 9 | 41/65/15 | 109 | 49 | 72 |
| 15 | 15. Provisions and Reserves | 107 | 63 | 6 | 3 | 8 | 17 | 10 | 0 | 18 | 6 | 32/54/21 | 97 | 43 | 64 |
| 16 | 16. Rectification of Errors | 108 | 64 | 5 | 3 | 9 | 17 | 10 | 0 | 20 | 11 | 29/55/24 | 98 | 44 | 64 |
| 17 | 17. Financial Statements | 123 | 70 | 8 | 3 | 14 | 18 | 10 | 3 | 22 | 14 | 40/59/24 | 113 | 64 | 59 |
| 18 | 18. Adjustments in F/S | 133 | 67 | 6 | 3 | 16 | 31 | 10 | 0 | 36 | 15 | 35/65/33 | 123 | 61 | 72 |
| — | **Total (18 chapters)** | **2300** | **1357** | **95** | **49** | **382** | **200** | **217** | **24** | **258** | **152** | **725/1168/407** | **2083** | **844** | **1456** |

Every chapter has **at least 40 questions**; the smallest is Chapter 6 (Debit and
Credit) at 69 and the largest is Chapter 13 (Trial Balance) at 207.

---

## 3. Totals by every other axis

**Source layer**

| Layer | Count | What it is |
|---|---|---|
| quiz | 508 | The site's existing 18-chapter MCQ quiz |
| authored | 846 | Written for this expansion (844 survive dedupe) |
| practice | 749 | Harvested from the existing practice bank |
| descriptive | 217 | Important Questions / revision long answers |
| **Repository total** | **2300** | after 20 duplicate-wording drops |

**By type**

| Type | Count |
|---|---|
| mcq | 1357 |
| numerical | 382 |
| case | 200 |
| descriptive | 217 |
| multi | 95 |
| matching | 49 |

**By marks**

| Marks | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Count | 1876 | 37 | 141 | 152 | 25 | 69 |

**By CBSE unit** — u1 Theoretical Framework 488 · u2 Accounting Process 1556 ·
u3 Financial Statements 256.

**By difficulty** — Easy 725 · Medium 1168 · Hard 407.

**By tag** — numerical 517 · conceptual 311 · competency 258 · case-study 126 ·
hots 152 · application 83 · assertion-reason 61 · statement 45 · image 24.

**By provenance** — new 844 · adapted 1456.

---

## 4. Limitations

These are real and are recorded rather than hidden.

1. **Descriptive questions never appear in a paper.** All 217 long-answer items
   are auto-grading-incompatible, so they are marked `examEligible: false` and
   used for coverage, Important Questions and revision only. A student sitting
   any of the eight modes is never asked to type free text. The consequence is
   that Sections C/D/E of the Board Mock are **case studies built from
   auto-gradable parts**, not free-written descriptive answers.

2. **"Incomplete Records" is in the syllabus but has no chapter on the site**, so
   that topic is uncovered. It needs a new chapter before it can be assessed.

3. **Some pools are deeper than others.** Every blueprint batch has at least 4×
   its per-paper demand, but the multi-mark Unit-3 pools (3-mark and 6-mark) are
   the narrowest at 10 and 12 respectively, so repeated mock attempts on the
   Financial Statements chapters will reuse questions sooner than elsewhere.

4. **Provenance is not authenticity.** Because no Class XI previous-year or
   sample paper is publicly verifiable, **no question is claimed to be an
   authentic past-paper question.** The 844 "new" items are original; the 1,456
   "adapted" items come from the site's own material. See
   [`CBSE-PATTERN-BASIS.md`](./CBSE-PATTERN-BASIS.md) §6.

5. **Difficulty labels are editorial**, assigned at authoring time against the
   syllabus rather than calibrated against measured student performance.

---

## 5. Supply against the Board Mock blueprint

Measured against the real built bank, using exactly the filter `drawPaper` applies
(type + unit + marks per batch):

| Section | Marks | Unit | Types | Need | Have | Status |
|---|---|---|---|---|---|---|
| A | 1 | u1 | mcq+multi+matching | 12 | 400 | ok |
| A | 1 | u2 | mcq+multi+matching+numerical | 26 | 1253 | ok |
| A | 1 | u3 | mcq+numerical | 2 | 156 | ok |
| B | 2 | u2 | numerical | 3 | 14 | ok |
| B | 2 | u2 | case | 1 | 12 | ok |
| C | 3 | u2 | case+numerical | 2 | 33 | ok |
| C | 3 | u3 | case+numerical | 2 | 10 | ok |
| D | 4 | u2 | case | 1 | 50 | ok |
| D | 4 | u3 | case | 1 | 23 | ok |
| E | 6 | u3 | case | 2 | 12 | ok |

Every batch clears 4× its per-paper demand, and `drawPaper` succeeds on
25/25 attempted draws. Two batches were originally empty or razor-thin and were
filled specifically for this: a 2-mark Unit-2 case pool (Section B) and a
Unit-3 3/4/6-mark pool (Sections C, D, E).
