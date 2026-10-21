# Delivery report — expanded question bank + CBSE Board Mock Test

**Project:** Accountancy By Abhinash (Class 11 Accountancy, fully static, API-free)
**Package:** `Accountancy-By-Abhinash-Expanded-CBSE-Exam-Mode.zip`
**Prepared:** October 2026

Everything below was actually executed. Where a check was not run, it says so.

---

## 1. File change list

### 1.1 New files

| File | What it is |
|---|---|
| `question-bank.js` | Central repository: harvests 4 layers, dedupes by wording fingerprint, exposes `build()` / `coverage()` / `all()` / `byId()` |
| `questions-expanded.js` | **Generated.** The 846 authored exam questions (847 KB), produced by the build tool |
| `questions-expanded/QUESTION-AUTHORING-SPEC.md` | Authoring rules every fragment must satisfy |
| `questions-expanded/validate-fragment.js` | Structural + answer-key validator (`--all` runs every fragment) |
| `questions-expanded/q-group01.js` … `q-group13.js` | 13 authored question fragments |
| `tools/build-question-bank.js` | Concatenates the fragments into `questions-expanded.js` and prints the distribution |
| `assets/questions/*.svg` | 8 local diagrams for the image-based questions (19 KB total) |
| `tests/exam-bank-tests.js` | 267-check suite: repository integrity + the paper engine |
| `tests/important-questions-xp-tests.js` | 49-check suite: revealing an Important Question answer awards no XP |
| `docs/CBSE-PATTERN-BASIS.md` | What CBSE publishes, what it does not, and what the site therefore designed |
| `docs/question-bank-coverage.md` | Per-chapter coverage report + counting method + limitations |
| `docs/DELIVERY-REPORT.md` | This file |

### 1.2 Modified files

| File | What changed |
|---|---|
| `exam-rules.js` | Paper engine: `cbseBoardMock` blueprint, `drawPaper()` (type+unit+marks batches, no-repeat tiers), `presentationFor()` option shuffling, `evaluatePaper()` breakdowns, `isExamEligible()`, `questionMarks()`, `unitOfChapter()`, `typologyOf()`, `CBSE_VERIFIED`, `round2` export |
| `app.js` | Renders the new formats (mcq / multi / matching / numerical / case with sub-parts), review screen with partial credit and marks, result summary (marks, %, topic performance), instructions screen, question palette, and removal of XP for revealing Important Questions answers |
| `index.html` | Two script tags: `/questions-expanded.js?v=1`, `/question-bank.js?v=1` |
| `styles.css` | Styles for all new formats + a mobile block (sub-cards, matching rows, figure, numeric input) at ≤640 px |
| `sw.js` | `aba-cache-v38` → `aba-cache-v39`; app shell now precaches the two new scripts and the 8 SVGs |
| `exam-security.js` | `begin()` stores `optionSeed` and the `blueprint` used, so refresh reproduces the identical paper |
| `tests/exam-store-tests.js` | Answers are now resolved by **option text** (the paper delivers shuffled options); 61→66 checks |
| `tests/palette-width-harness.html` | Added step 9: at 320/360/375/390 px it walks **every** question and verifies each format renders with no horizontal overflow |
| `tests/README.md` | Documents both new suites and the full-suite results |
| `package.json` | `test` script now also runs `exam-store-tests`, `exam-bank-tests`, `important-questions-xp-tests` |

No pre-existing question, practice item, Important Question, revision note, formula sheet,
summary or quiz was deleted or rewritten. All original source material is intact.

---

## 2. Expansion summary

| Measure | Value |
|---|---|
| Authored questions added | **846** |
| Repository total (all 4 layers, after dedupe) | **2,300** |
| Duplicate-wording items dropped by the build | **20** |
| Malformed items silently discarded | **0** |
| Chapters covered | **18 / 18** (40–64 questions each) |
| Question formats now supported | **5 machine-gradable**: mcq, multi, matching, numerical, case |
| Coverage-only (never in a paper) | descriptive / long-answer — 217 items |
| Image-based questions | 24, each with alt text and a local SVG |

**Authored distribution (846 questions)**

| Type | mcq | numerical | case | multi | matching |
|---|---|---|---|---|---|
| Count | 333 | 196 | 172 | 96 | 49 |

| Marks | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Count | 638 | 38 | 43 | 74 | 25 | 28 |

| Difficulty | Easy | Medium | Hard |
|---|---|---|---|
| Count | 291 | 389 | 166 |

| Tag | conceptual | competency | numerical | hots | case-study | application | assertion-reason | statement | image |
|---|---|---|---|---|---|---|---|---|---|
| Count | 313 | 230 | 273 | 152 | 98 | 83 | 61 | 45 | 24 |

Format families actually authored, beyond plain MCQs: statement-based,
assertion–reason, correct/incorrect statements, identify-the-error, case-study,
competency, HOTS, validated numericals, image-based with alt text, matching,
sequencing and data-interpretation. Full per-chapter figures are in
[`question-bank-coverage.md`](./question-bank-coverage.md).

---

## 3. Chapter-wise counts (repository total)

| # | Chapter | Total | MCQ | Multi | Matching | Numerical | Case | Descr. | Image | Competency | HOTS | Easy/Med/Hard |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Introduction to Accounting | 96 | 66 | 6 | 3 | 5 | 8 | 8 | 0 | 14 | 7 | 28/48/20 |
| 2 | Basic Accounting Terms | 140 | 110 | 5 | 3 | 6 | 8 | 8 | 0 | 10 | 7 | 26/98/16 |
| 3 | Theory Base of Accounting | 138 | 109 | 6 | 2 | 6 | 7 | 8 | 0 | 10 | 6 | 26/91/21 |
| 4 | Bases of Accounting | 114 | 85 | 5 | 2 | 7 | 7 | 8 | 0 | 9 | 8 | 24/71/19 |
| 5 | Accounting Equation | 157 | 37 | 5 | 2 | 97 | 8 | 8 | 3 | 11 | 10 | 52/65/40 |
| 6 | Debit and Credit | 69 | 36 | 5 | 2 | 10 | 8 | 8 | 0 | 10 | 7 | 22/33/14 |
| 7 | Journal | 112 | 68 | 6 | 3 | 13 | 10 | 12 | 3 | 11 | 8 | 27/61/24 |
| 8 | Ledger | 123 | 39 | 5 | 3 | 14 | 9 | 53 | 3 | 13 | 7 | 34/57/32 |
| 9 | Cash Book | 112 | 70 | 5 | 4 | 12 | 9 | 12 | 3 | 12 | 9 | 35/56/21 |
| 10 | Subsidiary Books | 79 | 40 | 5 | 3 | 11 | 10 | 10 | 0 | 14 | 7 | 24/42/13 |
| 11 | Bank Reconciliation Statement | 196 | 58 | 4 | 2 | 114 | 8 | 10 | 3 | 9 | 7 | 90/90/16 |
| 12 | GST (with Tally) | 165 | 129 | 5 | 2 | 11 | 8 | 10 | 0 | 11 | 7 | 71/71/23 |
| 13 | Trial Balance | 207 | 167 | 4 | 3 | 14 | 9 | 10 | 3 | 17 | 7 | 89/87/31 |
| 14 | Depreciation | 121 | 79 | 4 | 3 | 15 | 8 | 12 | 3 | 11 | 9 | 41/65/15 |
| 15 | Provisions and Reserves | 107 | 63 | 6 | 3 | 8 | 17 | 10 | 0 | 18 | 6 | 32/54/21 |
| 16 | Rectification of Errors | 108 | 64 | 5 | 3 | 9 | 17 | 10 | 0 | 20 | 11 | 29/55/24 |
| 17 | Financial Statements | 123 | 70 | 8 | 3 | 14 | 18 | 10 | 3 | 22 | 14 | 40/59/24 |
| 18 | Adjustments in F/S | 133 | 67 | 6 | 3 | 16 | 31 | 10 | 0 | 36 | 15 | 35/65/33 |
| — | **Total** | **2300** | **1357** | **95** | **49** | **382** | **200** | **217** | **24** | **258** | **152** | **725/1168/407** |

---

## 4. The eight examination modes

The original seven are untouched — same ids, titles, question counts, durations,
marks and pass rules. The eighth is new.

| # | Mode | Questions | Marks | Duration | Chapters | Blueprint |
|---|---|---|---|---|---|---|
| 1 | Full Syllabus Mock Examination | 50 | 50 | 45 min | 18 | legacy draw |
| 2 | Full Syllabus Examination (Extended) | 100 | 100 | 90 min | 18 | legacy draw |
| 3 | Accounting Fundamentals — Chapters 1–4 | 25 | 25 | 25 min | 4 | legacy draw |
| 4 | Equation, Debit-Credit, Journal & Ledger — Chapters 5–8 | 25 | 25 | 25 min | 4 | legacy draw |
| 5 | Subsidiary Books & Cash Book — Chapters 9–10 | 20 | 20 | 20 min | 2 | legacy draw |
| 6 | BRS, GST & Trial Balance — Chapters 11–13 | 25 | 25 | 25 min | 3 | legacy draw |
| 7 | Depreciation to Financial Statements — Chapters 14–18 | 25 | 25 | 25 min | 5 | legacy draw |
| 8 | **CBSE Board Mock Test** | **52** | **80** | **180 min** | 18 | **formal blueprint** |

All eight keep the same start → instructions → registration → confirmation →
paper → review → submit → result flow, the same 40 % pass line, the same
2-attempts-per-day rule and the same certificate eligibility.

**CBSE Board Mock Test structure** (identical in code, instructions screen and
palette):

| Section | Items | Marks each | Total | Content |
|---|---|---|---|---|
| A | 40 | 1 | 40 | Objective — U1 ×12, U2 ×26, U3 ×2 |
| B | 4 | 2 | 8 | U2 — 3 numerical + 1 case |
| C | 4 | 3 | 12 | U2 ×2, U3 ×2 |
| D | 2 | 4 | 8 | U2 ×1, U3 ×1 |
| E | 2 | 6 | 12 | U3 ×2 |
| | **52** | | **80** | |

- Unit totals land on exactly **12 / 44 / 24**, matching CBSE's published weightage.
- No negative marking. No internal choice. (CBSE prescribes neither for Class XI.)
- Difficulty progresses Easy → Hard down the paper; the cognitive split is held
  close to CBSE's 40 / 30 / 30 as a soft constraint.
- A paper that cannot satisfy its own blueprint is **refused**, never displayed
  with a wrong mark total.

---

## 5. Verified CBSE pattern basis

Full detail in [`CBSE-PATTERN-BASIS.md`](./CBSE-PATTERN-BASIS.md). Summary:

**Checked:** the official CBSE Accountancy (055) curriculum PDFs for **2025–26**
and **2026–27**, plus the sample-paper archive for every session 2014-15 → 2025-26.

**Published by CBSE for Class XI Accountancy** (verbatim, both sessions agree):

- Theory paper **80 marks / 3 hours**; project work **20 marks** (separate).
- Unit 1 Theoretical Framework **12**, Unit 2 Accounting Process **44**,
  Unit 3 Financial Statements of Sole Proprietorship **24**.
- Remembering & Understanding **32 (40 %)**, Applying **24 (30 %)**,
  Analysing/Evaluating/Creating **24 (30 %)**.

**The most important finding:** CBSE publishes Sample Question Papers for
**Class X and XII only**. There is **no official CBSE Class XI sample paper**,
and Class XI examinations are **conducted by the school**, not by CBSE as a
board exam. So nothing could be copied, and the mock is never described as an
official, issued or sample CBSE paper.

**Not published by CBSE** (hence designed, and labelled as designed): question
count, section layout, marks-per-question scheme, internal-choice policy,
negative-marking rule, difficulty progression, question formats.

**Provenance:** recorded as internal metadata only (`new` / `adapted`), and a
test probes every student-facing string to confirm no question names a source,
year or paper. Because no Class XI previous-year or sample paper is publicly
verifiable, **no question is claimed to be an authentic past-paper question**.

**Syllabus scope:** bills of exchange, computerised accounting, partnership and
company accounts, NPO, ratios, cash flow, change of depreciation method and the
conversion method for incomplete records are all **excluded**.

---

## 6. Randomisation and no-repeat strategy

All of it lives in `exam-rules.js`.

**Paper construction (`drawPaper`)**

1. Each section declares **batches** pinning `types`, `unit` and the section's
   marks. A question enters a batch's pool only if its **type**, its **CBSE
   unit** and its **marks** all match — so the paper always totals correctly.
2. For every batch the pool is split into three **tiers**:
   1. never served for this mode (unseen),
   2. served before but not recently,
   3. served and recent.
   Tiers are consumed strictly in that order — unseen first, most-recent last.
   The stated fallback is therefore: *unseen correct-chapter → relax no-repeat →
   (marks/type/difficulty stay pinned by the batch) → most-recent last*.
3. Within a tier, `dealByChapter()` deals **round-robin across chapters**, each
   chapter's own list shuffled first, so one large chapter cannot swamp a small one.
4. After selection, order is **shuffled inside each section**; sections stay in
   A→E order, which is what a real paper does.
5. **Case studies travel whole** — they are one palette slot whose marks are the
   sum of its parts, so their parts are never split across the paper.
6. All shuffling is **Fisher–Yates over an unbiased RNG** (`shuffleWith`); no
   `sort(() => Math.random() - 0.5)` comparator anywhere.
7. The drawn ids are recorded against the mode in `store.served[paperId] =
   { seen[], recent[] }`, so presented questions stop counting as unseen.

**Option shuffling (`presentationFor`)**

- Seeded per question: `mulberry32(hash32(seed + "|" + q.id))`, so the same
  seed always reproduces the same layout and a different seed really moves it.
- Options (and matching right-column entries) are permuted with the **answer key
  remapped through the same permutation** — the key keeps pointing at the same
  words. The permutation map is **not** carried onto the delivered object, and
  the bank object itself is never mutated.
- The seed is stored as `rec.optionSeed`, so a refresh rebuilds the identical
  paper, identical option order and identical remaining time.

**Resume / refresh**

- The paper, its answers, the current index and the deadline are persisted
  before the timer ticks, so a refresh restores the **same paper and same clock**
  rather than starting a new one. A new paper only appears on a genuinely new
  attempt — and by then the served ids have been recorded, so the questions that
  were just shown are no longer "unseen".

**Blueprint supply** (measured against the real built bank with exactly the
filter `drawPaper` applies) — every batch clears 4× its per-paper demand:
A-u1 400/12, A-u2 1253/26, A-u3 156/2, B-num 14/3, B-case 12/1, C-u2 33/2,
C-u3 10/2, D-u2 50/1, D-u3 23/1, E-u3 12/2. `drawPaper` succeeded 25/25 draws.

---

## 7. Validation and test results

### 7.1 Fragment validation

```
node questions-expanded/validate-fragment.js --all
→ TOTAL ERRORS: 0      (13 fragments, no warnings)
```

### 7.2 Bank build

```
node tools/build-question-bank.js
→ Wrote questions-expanded.js — 846 questions, 847 KB
  rejected as malformed: 0
```

### 7.3 Full suite (actually executed)

```
run-tests.js                      426 passed, 0 failed
calculator-tests.js               308 passed, 0 failed
ai-tests.js                       152 passed, 0 failed
ai-intelligence-tests.js          229 passed, 0 failed
solver-tests.js                   115 passed, 0 failed
exam-security-tests.js            181 passed, 0 failed
exam-rules-tests.js               137 passed, 0 failed
exam-search-tests.js             3097 passed, 0 failed
achievements-tests.js             147 passed, 0 failed
seo-tests.js                     1149 passed, 0 failed
exam-store-tests.js                66 passed, 0 failed
exam-bank-tests.js                267 passed, 0 failed
important-questions-xp-tests.js    49 passed, 0 failed
                                  ---------
                                  6323 passed, 0 failed   ALL GREEN
```

**Not run:** `probe-tutor.js` and `probe-cycle.js` (they drive a live browser
against the local server). They are registered in `package.json` but were not
executed for this delivery.

### 7.4 What the new suites cover

`exam-bank-tests.js` (267 checks)

- **Repository integrity** — ids unique *as text* (a numeric quiz id `1` can never
  collide with string `"1"`); valid shape and a usable key on every item; **no two
  questions left sharing a wording fingerprint**; every duplicate the build reports
  really is absent; nothing malformed dropped; ≥40 questions in every chapter;
  multi/matching/numerical/case well supplied; HOTS and competency present; every
  image question has alt text **and a local asset file that exists**; no
  student-facing string names a source, year or paper.
- **Eight modes** — the original seven pinned by id/title/count/duration/marks,
  plus the new one named exactly *CBSE Board Mock Test*, 180 min, 80 marks, 52
  questions, blueprint present, no negative marking, all 18 chapters.
- **Blueprint** — 40 independent draws, each satisfying marks, count, section
  shape A→E, unit weightage 12/44/24 and the cognitive split; repeated draws
  provably differ; an unbuildable blueprint is refused; the legacy draw path
  still behaves.
- **Shuffling** — sections stay in A→E while each section's interior is
  reshuffled; a case travels whole and its parts still add up; no id appears twice.
- **Answer-key integrity** — over 400 questions: presented options are a
  *permutation*, the key still points at the same words, same seed ⇒ same layout,
  different seed ⇒ different layout, the bank object is never mutated, the
  permutation never rides on the delivered object, and a case's sub-keys follow
  its shuffled options.
- **No-repeat** — unseen preferred, an exhausted pool still fills, and the
  fallback draw still totals 80 with 12/44/24.
- **Grading** — exact marks for all five formats; no negative marking anywhere;
  section/unit/chapter/typology breakdowns; a keyless question is refused rather
  than guessed; `evaluatePaper` agrees with the original `evaluateAttempt`.
- **Sanitising** — out-of-range, duplicate and nonsense answers dropped; a bad
  case part cannot spoil a good one; `isAnswered` for every shape.
- **CBSE honesty** — no official Class XI sample paper is claimed; the record
  says Class XI exams are school-conducted; units total 80; cognitive split
  totals 80 and 100 %; neither the mode nor the shipped sources claim an
  official paper.

`important-questions-xp-tests.js` (49 checks) — see §8.

### 7.5 Browser verification (actually performed, real UI)

- Exam mode lists **all 8 modes**; bank = 2,300; expanded = 846.
- The mock card shows 52 questions / 80 marks / 180 min / 40 % pass / CBSE typology.
- Instructions screen renders all five sections with correct arithmetic, the
  question-format list and the line *"Sections A–E · 52 questions · 80 marks ·
  3 hours · no negative marking"*.
- Started a real attempt: timer 02:59:48, palette section bands **A·40, B·4,
  C·4, D·2, E·2**, first paper drew 31 mcq / 9 numerical / 9 case / 2 matching / 1 multi.
- Opened a 6-mark case (`x-fs-9113`): one palette slot, passage + 4 parts
  summing 2+2+1+1 = 6, and every answer independently recomputed
  (TB tallies 6,75,000 both sides; GP ₹85,000; NP ₹67,000; non-operating
  ₹45,000; operating ₹40,000).
- MCQ renders 4 options in a `radiogroup`; matching renders 4 rows × 5-option
  selects; numerical renders its input with prefix.
- Image questions: `figure.ex-q-fig`, local `src`, 152-character `alt`,
  `loading="lazy"`, plus a `figcaption`; the SVG serves **HTTP 200**,
  `image/svg+xml`, with `role="img"` and `aria-labelledby`.
- **Refresh / resume:** opening a second tab on the same origin restored the
  same attempt, same candidate, same position (Q51) and a correctly continued
  clock (02:50:28).

**Defect found and fixed during browser verification:** `examBuildAnswerArea()`
called `classList.add("ex-options is-single")` — a single token containing a
space, which throws `InvalidCharacterError`. That killed **every MCQ and
multi-select render**, and inside a case study it aborted the loop, so the last
part vanished and a 6-mark question only offered 5 marks of input. Fixed to
`classList.add("ex-options", multi ? "is-multi" : "is-single")`. A repo-wide
scan confirmed it was the only such call. All suites re-run green afterwards.

### 7.6 Narrow-width verification (actually performed, real UI)

`tests/palette-width-harness.html` embeds the running exam in a same-origin iframe at **320 / 360 / 375 /
390 px** and, in step 9, walks **every question in the paper** checking that each format renders completely
(case parts present and adding up to the printed marks, each part carrying its own widget; MCQ/multi option
count matching; matching select count matching; numerical input present) and that `scrollWidth` never
exceeds the viewport.

It ran against a live **CBSE Board Mock Test** attempt (52 questions, 80 marks) — the only mode that can
contain every format, since the seven legacy modes draw only 1-mark questions and the `marks===1` pool
contains **zero** case studies. Results, **identical at all four widths**:

| Width | Case | Matching | MCQ / multi | Numerical | Total | Any overflow | Broken entries |
|---|---|---|---|---|---|---|---|
| 320 px | **7 / 7** | **2 / 2** | **31 / 31** | **12 / 12** | **52 / 52** | none | **0** |
| 360 px | **7 / 7** | **2 / 2** | **31 / 31** | **12 / 12** | **52 / 52** | none | **0** |
| 375 px | **7 / 7** | **2 / 2** | **31 / 31** | **12 / 12** | **52 / 52** | none | **0** |
| 390 px | **7 / 7** | **2 / 2** | **31 / 31** | **12 / 12** | **52 / 52** | none | **0** |

Palette behaviour at all four widths, also all green: sheet fits the width, close button inside the viewport,
backdrop created once and removed, Escape closes, scroll lock restored, and a 15-point probe grid found **no
tap-eating layer** left behind by the closed sheet.

The close button measures **34 × 34 px**. That is below the 44 × 44 px touch-target guideline, so it is
recorded as a known limitation rather than a pass — it is the pre-existing `.ex-sheet-close` size, not
something this change introduced.

**Getting stable numbers took four harness fixes, all of them defects in the harness itself**, worth listing
because they explain any earlier erratic readings:

1. `done()` fired **twice** per width — once immediately and once when the walk finished — so the next width
   navigated the iframe while the previous walk was still driving it.
2. Step 9 sat **outside** the `until()` callback that performs the palette steps, so the walk ran
   **concurrently** with them and the two fought over the same iframe.
3. `finishOpen()` referenced `cbBtn`, a `var` declared inside a different callback's scope. The resulting
   `ReferenceError` killed every width run **silently** — no results, no visible error.
4. The close button was measured **mid-transition**. The sheet slides up from `translateY(103%)` over ~240 ms,
   so the button already had its full 34 × 34 box while still a screen-height below the viewport. Waiting for
   the settled state (`transform: none`) is what makes that check meaningful.

Plus one environmental trap: the service worker serves `/tests/` stale-while-revalidate, so a plain reload
kept executing the previous copy of the harness after the file on disk was already fixed. Runs below were made
with a cache-busted URL and an attached `window.onerror` collector.

---

## 8. Important Questions XP confirmation

Revealing, expanding, collapsing, reopening or refreshing an Important Question
answer awards **no XP**. Verified by `tests/important-questions-xp-tests.js`,
**49 passed / 0 failed**, which:

- extracts the *real* `renderIQList()` handler out of `app.js` by bracket
  matching and **executes it 11 times** against stubs — first reveal, repeat
  reveals, bookmark, a page refresh that rebuilds the handler over reloaded
  state, and a second question — asserting `addXP` is **never called** and total
  XP stays **0**;
- asserts the solved marker is still written exactly once and the activity log is
  untouched;
- asserts no XP-granting alias or counter mutation exists anywhere in
  `renderIQList()`, and that the old reward string is gone from the whole file;
- asserts nothing resets `STATE.xp`, achievements or the solved map;
- asserts **every other XP reward on the site is still present** (66 `addXP`
  call sites remain), including the exam-completion reward, now capped at
  `Math.min(res.correct, 50) * 3`.

Section layout and design of the Important Questions screen were not changed, and
no existing XP or achievement was reset.

---

## 9. Limitations

1. **Descriptive questions never appear in a paper.** All 217 long-answer items
   are not machine-gradable, so they carry `examEligible: false` and serve
   coverage, Important Questions and revision only. Consequence: Sections C/D/E
   of the mock are **case studies built from auto-gradable parts**, not
   free-written answers.
2. **"Incomplete Records" is in the syllabus but the site has no chapter for it**,
   so that topic is uncovered. It needs a new chapter before it can be assessed.
3. **No authentic previous-year questions exist in the bank.** No Class XI
   previous-year or sample paper is publicly verifiable, so claiming authenticity
   would be false. All 846 authored items are original; 1,456 are adapted from the
   site's own material.
4. **CBSE prescribes no question count or section layout for Class XI**, so the
   52-question five-section shape is a design choice, held to CBSE's published
   marks, hours, unit weightage and cognitive split. It is never presented as an
   official CBSE paper.
5. **Difficulty labels are editorial**, assigned at authoring time against the
   syllabus rather than calibrated on measured student performance.
6. **Some pools are deeper than others.** Every batch clears 4× demand, but the
   multi-mark Unit-3 pools are narrowest, so repeated mocks will reuse Financial
   Statements questions sooner than elsewhere.
7. **Probe suites not executed for this delivery** (`probe-tutor.js`,
   `probe-cycle.js`); they need a live browser against the local server.
8. **Width-harness results are sensitive to sharing one attempt across several
   open tabs.** Run with a single tab holding the attempt for stable numbers.

---

## 10. Package

`C:\Users\HP\Downloads\Accountancy-By-Abhinash-Expanded-CBSE-Exam-Mode.zip`

Built 16 October 2026. **134 files, 8.4 MB, 134 entries, zero backslash entry names**
(created with `ZipFileExtensions.CreateEntryFromFile`, since `Compress-Archive` writes
backslashes that unzip badly on other platforms). Entries sit at the archive root,
matching the earlier deliverables.

Verified present in the archive: `question-bank.js`, `questions-expanded.js`,
all **13** `questions-expanded/q-group*.js`, all **8** `assets/questions/*.svg`,
all **3** `docs/*.md`, `tests/exam-bank-tests.js`,
`tests/important-questions-xp-tests.js`, `tests/palette-width-harness.html`, and the
modified `app.js`, `exam-rules.js`, `styles.css`, `sw.js`, `package.json`.

`Accountancy-By-Abhinash-Exam-Security-Certificate-Fix.zip` and
`Accountancy-By-Abhinash-Exam-Security-Mobile-Fix.zip` were **not** overwritten.

---

# Addendum - v82: nine-task UI/XP/navigation release

**Package:** `accountancy-by-abhinash-v82.zip`  **Prepared:** 16 October 2026

## A. What changed

| Task | Change | Key files |
|---|---|---|
| 1 Flashcard flip | Live-element `is-flipped` toggle (real `rotateY` transition, mid-transition verified), Enter/Space + `role=button` + `aria-pressed`, scrollable opaque back, reduced-motion | `app.js`, `styles.css` |
| 2 IQ dropdown | 19-chip scroller replaced by `<select id=iqChapterSelect>` built from `UIF.buildIQChapterOptions(APP_DATA.chapters, …)`; `?ch=` deep-links; format chips keep working and now sync `active` with `aria-pressed`; honest empty state | `app.js`, `ui-features.js`, `styles.css` |
| 3 Activity | All 32 `logActivity` sites structured (`type,key,route,tab,qid,status,chapterId`); dedupe by stable key, cap 12, corruption-tolerant; rows are buttons that open the exact card (flash highlight) or explain when the destination is gone; legacy string rows render as text | `app.js`, `ui-features.js`, `styles.css` |
| 4 XP gates | `awardOnce` / `awardDaily` / `bumpDaily` registry: quiz questions + penalties once-ever, deck/quiz completion daily-once (values unchanged), tutor 5/day, generator 10/day, cash-book entries, books detective, rounds, self-assessed, AIA once-ever; `addXP(0)` silent | `app.js`, `ui-features.js` |
| 5 Section nav | `appendSectionNav` footer on every chapter: Next Section (real tab title, `Section X of Y`) -> Next Chapter (syllabus order from `APP_DATA.chapters`) -> final chapter ends at "Back to all chapters"; id-guarded single instance; updates on tab clicks | `app.js`, `ui-features.js`, `styles.css` |
| 6 Toast system | Titles, dismiss button, info/warning variants, dedupe, stack cap 3, `role=alert/status`, mobile placement above bottom nav; first-visit "About this website" (2.6 s, once-ever, storage-safe); exam exhaustion warning on both start paths with no second decrement | `app.js`, `styles.css` |
| 7 A11y/responsive | v82 stylesheet block (light/dark/reduced-motion/mobile), heading-order fix (H2->H4 skip), labels contain visible text | `styles.css`, `app.js` |
| 8 Tests | New `tests/ui-features-tests.js` (158 checks) added to the `npm test` chain; one existing assertion (`important-questions-xp-tests.js` B3) updated for the structured activity shape (behaviour identical) | `tests/*`, `package.json` |
| 9 Package | `README.md` (implementation report + honest limitations), this addendum, cache bumps `app.js?v=61`, `styles.css?v=47`, `ui-features.js?v=1`, `aba-cache-v42` | `README.md`, `index.html` (x29), `sw.js` |

New file: `ui-features.js` - a dependency-free UMD module holding every pure
rule (XP registry, activity normalisation, section planning, dropdown options,
quiz config key, XP policy constants) so behaviour is testable without a DOM.

## B. What was actually executed

1. `npm test` - **18/18 suites green after the final edit**: run-tests 426,
   calculator 308 (+320-answer audit, 0 conflicts), AI 152,
   AI-intelligence 229, solver 115, revision 247, tutor-regression 32,
   exam-security 181, exam-rules 137, exam-store 66, exam-search 3258,
   exam-bank 267, important-questions-xp 49, achievements 147, seo 1149,
   **ui-features 158**, probe-tutor 18/18, probe-cycle 19/19.
2. Browser verification against the built files (headless Chromium, local
   server): flip animation sampled mid-transition (`matrix3d(-0.58, ...)`),
   keyboard flip, dropdown change + `?ch=` deep-link, all three activity
   destination types (incl. exact-card flash and both "gone" messages),
   section-nav walk + final end state + no duplicates (1 footer across all 7
   tab switches), first-visit toast lifecycle incl. `beforeunload` flag
   persistence, exam exhaustion toast (`role=alert`, `starts` stayed 2/2),
   XP gates live (once/daily/capped), solve -> reload -> no re-award, toast
   dedupe/stack/dismiss, clean console (0 errors, 0 failed requests).
3. **Lighthouse: Accessibility 100, Best Practices 100, SEO 100**, zero
   failed audits (heading order + two label mismatches found and fixed).
4. SEO pages regenerated from the updated `index.html`
   (`node tools/build-seo-pages.js`): 28 pages + home; 0 stale `?v=` refs
   across 29 HTML files.

## C. Limitations carried forward (honest)

1. **Exam attempt limits and unlock codes are client-side** (`examApiLocal`,
   `localStorage` key `abhinash_exam_store_v1`). There is no server, so a
   determined student could edit storage; codes grant +2 attempts or an
   unlimited day **per device** and are not backend-validated. Refusing a
   start never consumes an attempt (verified). This is documented in
   `README.md` rather than dressed up as security.
2. XP/activity/progress live in per-browser `localStorage`; clearing site
   data resets them. No export feature exists.
3. XP daily caps reset at device-local midnight; exam attempts at IST
   midnight (`ExamRules.istDayKey`).
4. The "Mystery solve"-style entries with an unknown tab fall back to the
   chapter's Practice Bank and say so; entries whose route was removed render
   clickable only to deliver the "no longer available" explanation.
