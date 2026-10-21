# Accounting Cycle tests

Run from the site's root folder (Node 16+ — no packages to install):

    node --check accounting-cycle.js
    node tests/run-tests.js

* `cases-a.js` … `cases-d.js` — 383 example transactions/sequences with exact expected journals or statuses
  (VALID / UNCERTAIN / INVALID / NO_ENTRY_REQUIRED), including the required regression cases and unseen paraphrases.
  Group 35 in `cases-d.js` is the v80 probe-regression group: every defect the independent probe found, with its
  exact expected journal, so none can come back silently.
* `properties.js` — 32 property / invariant / full-pipeline checks (debit = credit, zero state change from non-VALID
  transactions, paid↔received and cash↔cheque metamorphic tests, generated compound grids, Journal → Ledger →
  Trial Balance → Final Accounts consistency, chronological ordering, account identity).
* `loader.js` — loads the browser script `accounting-cycle.js` into a Node `vm` sandbox.

These files are not loaded by the website; they are only for development.

# Calculator tests

    node tests/calculator-tests.js

Unit tests for `calculator.js` (the Study Tools calculator): the expression engine (order of operations, accounting-style
percent, DEG/RAD trig, factorial/power/roots/logs, error messages, number formatting, no-eval safety), the input model
(operator rules, ± / CE / AC / Backspace / Delete, history, memory, keyboard mapping incl. numpad) and a 4,000-case fuzz run.


# AI Tutor tests

    node tests/ai-tests.js        # 150 checks, no packages needed
    node tests/e2e-ask-ai.js      # 59 browser checks (needs `npm i -D playwright`)

* `ai-tests.js` — (A) `ai-calc.js` against hand-computed figures (GST, discount, SLM/WDV, equation, trial balance, ledger,
  BRS, provision, interest, expression-evaluator safety); (B) every stored GST/BRS/journal/equation/trial-balance answer in
  `data.js` re-computed by code (the audit that powers the tutor's conflict warnings); (C) index coverage and unique ids;
  (D) retrieval — including the deliberate "answer is in a chapter, NOT in the tutor prompt" test; (E) exact / modified
  question lookup; (F) offline answers for pasted numericals and concepts; (G) the Netlify function with a mocked model
  (retrieval context, calculator tool loop, journal-balance validation retry, forged-id handling, input validation, no key leakage).
* `e2e-ask-ai.js` — real Chromium: for a question in every section it clicks **Ask AI**, checks the question/section/chapter
  reach the tutor and the backend request, an answer comes back (mock backend and offline tutor), and that XP / solved /
  mistakes / bookmarks / selected answers are untouched.


# v78 additions

    node tests/ai-intelligence-tests.js   # 237 checks — intent, memory, concept vs format, follow-up chains, rephrasing, attached questions, removed third-party widget
    node tests/solver-tests.js            # 115 checks — hand-computed numericals across every Class 11 calculation type, fail-safes
    node tests/e2e-tutor-chat.js          # 58 browser checks — conversation with no AI service, Clear/New Chat, Ask Tutor, themes, removed third-party widget

`ai-intelligence-tests.js` runs the exact scenarios from the v78 brief (tests 1–9 and 11–14) through the offline path, so they
pass with no API key. Section K proves the Netlify function builds the same understanding (intent + previous answer + the right
kind of content block) for the model. Section M holds the v80 regressions found by the probe below.

# v80 independent probes

    npm run test:probe       # full reports — 18 tutor scenarios + 19 accounting-cycle scenarios
    (npm test runs both with --quiet: failures only, and they break the build)

These two files exist to attack the systems from outside, not to restate what the unit suites already assert.

* `probe-tutor.js` — drives whole multi-turn conversations through `ai-tutor-core.js` against the real `data.js`
  index (no API key, no mocks) and prints the answer that actually came back. Scenarios cover the canonical
  ambiguity set ("What is Journal?" vs "Explain Journal" vs "What is the format of Journal" vs "Give a Journal
  entry" vs "Why is Journal important?"), chained follow-ups ("explain it more simply" → "give me an example" →
  "now solve one using WDV"), final-answer-only, style matching, thin one-line definitions, and new-chat reset.
* `probe-cycle.js` — runs representative problems through `acRunCycle` / `acParseTransaction` and checks the
  accounting answer itself: compound entries, trade vs cash discount vs GST, prepaid splits, bad-debt write-offs,
  provisions, opening lists, chronological order, and that the Trial Balance still balances after each one.

Both print what they got, so a wrong-but-balanced answer is visible instead of hidden behind a green tick.

# Exam security, store and palette tests (v83)

    node tests/exam-security-tests.js   # 181 checks — session integrity, immediate disqualification wiring, palette wiring
    node tests/exam-store-tests.js      # 66 checks — the REAL local exam store from app.js, executed in a Node vm
    node tests/exam-rules-tests.js      # 137 checks — grades, pass mark, certificate IDs, IST daily policy, security policy table

* `exam-security-tests.js` — `exam-security.js` behaviours (deadline-based countdown, synchronous progress,
  recovery, interruptions, terminal/idempotent disqualification, clock integrity) plus app-layer wiring:
  section I4 pins the IMMEDIATE visibility policy (no timer, no await in the handler; unload markers from
  beforeunload/pagehide exclude refresh/close; both store writes happen before the first await; resize is
  record-only; paste blocked; attach/detach listener symmetry), including a regression guard for the
  CANCELLED-beforeunload case: `beforeunload` arms the marker, but a dismissed dialog fires no other event,
  so a guarded `setTimeout` disarms it (only when `pagehide` never fired and the page is still visible) —
  otherwise one cancelled refresh would silently disable every later tab-switch disqualification. Section I5
  pins the Question Palette sheet fix (real dismissible backdrop element, close-before-navigate, Escape,
  scroll-lock restore, self-healing after re-renders, no pseudo-element overlay).
* `exam-store-tests.js` — extracts the local examination store region of `app.js` (`EXAM_STORE_KEY` …
  `examApiLocal`) and runs the real code in a Node `vm` against fake storage: happy paper → result +
  certificate; one attempt consumed per start; one incident → one violation (burst events are no-ops, the
  first reason wins); disqualified attempts refuse save/submit/result/cert — including an injected certificate
  record; refresh/reopening never revives a disqualified attempt; idempotent submission; resume-after-refresh
  returns every saved answer.
* `probe-lifecycle.html` — a dev-only page that records the real unload event order into localStorage.
  Verified in Chromium: `beforeunload → pagehide → visibilitychange(hidden)` on reload, and visibilitychange
  alone on tab/app switches. This order is what lets `app.js` tell a refresh (restore) from a tab switch
  (immediate disqualification) without any timer.
* `palette-width-harness.html` — a dev-only page that embeds the running exam in a same-origin iframe at a
  target width (320 / 360 / 375 / 390 px) and drives the Question Palette inside it: open, close-button first
  tap, backdrop dismissal, Escape, close-before-navigate, six reopen cycles (no stale backdrop, scroll-lock
  restored), no horizontal overflow, sheet fits the width, the close button stays inside the viewport once the
  slide-up transition settles, and the closed sheet eats no taps across a 15-point probe grid. Open it in a
  browser, click a width or **Run all widths**, and read the JSON result.

  **Step 9 — the added question formats.** At every width it then walks **every question in the paper** and
  checks that the right control really rendered: a case study shows one `.ex-sub` card per part whose printed
  marks add up exactly to the question's marks and whose parts each have their widget (options / input /
  select); a matching row has one `<select>` per left item; an MCQ or multi has its full option count; a
  numerical has its input — and `scrollWidth` never exceeds the viewport on any of them. This is the check
  that caught the `classList.add("ex-options is-single")` defect, which aborted every MCQ render and, inside
  a case study, silently dropped the remaining parts.

  Measurement is **polled, not timed on a fixed sleep**: `renderRoute()` waits out a 110 ms view transition
  before it swaps `#view-root`, and a background iframe stretches that further, so a fixed delay measures the
  *previous* question. The harness waits until `.ex-q-head` reads `Question <n> ` (trailing space so
  "Question 1" can never match "Question 10") before measuring, and reports a `TIMEOUT` marker if it never
  arrives. Likewise the close button is polled until it has real geometry — a hidden button is 0×0 and would
  otherwise pass the in-viewport bounds test as a false pass.

  Run it with **one tab holding the attempt**. The paper is shared through `localStorage`, so several exam
  tabs open at once make each context re-render over the other's writes and the numbers go unreliable.

  **Which paper it walks.** Step 9 must run on the **CBSE Board Mock Test**. The seven legacy modes draw
  only 1-mark questions, and no case study in the bank is worth 1 mark — measured on the built repository,
  the `marks===1` pool is 1,848 questions (mcq 1357 / numerical 355 / multi 87 / matching 49) and contains
  **zero cases**, so a legacy paper can never exercise the case renderer. The harness therefore clicks the
  CBSE card by name, and if a *different* paper is already live it retires that attempt first. The retire is
  **dev-only** and edits this browser's own profile: `app.js` restores a paper through
  `abhinash_exam_store_v1`'s `day.activeAttemptId`, not through `ExamSecurity`, so the harness voids that
  stored attempt and clears the pointer, then reloads for a clean mode list. A retired attempt still counts
  against the day's limit, and nothing in the shipped source is touched.

  **Four traps worth knowing about**, all hit while getting stable numbers out of it:

  1. *`done()` used to fire twice.* `walkQuestions()` calls `done()` when the walk finishes, and the driver
     called it again immediately after starting. Each width therefore handed control to the next width while
     its own walk was still driving the iframe — which is exactly what made multi-width runs erratic
     (option counts landing on multiples of 4, cases counting half their parts).
  2. *Edit the file, then bust the cache.* The service worker serves `/tests/` stale-while-revalidate, so a
     plain reload can keep running yesterday's copy of the harness while the file on disk is already fixed.
     Open it as `/tests/palette-width-harness.html?v=<timestamp>` when iterating.
  3. *Step 9 used to race steps 2–8.* The format walk sat **outside** the `until()` callback that performs the
     palette steps, so it began the instant `startExam` returned and ran concurrently with them — the two
     fought over the same iframe, and the numbers shifted with how long the sheet transition happened to
     take. It is chained now: `runStep9()` is called at the end of the palette sequence.
  4. *A `var` inside a callback is not visible in a sibling function.* `finishOpen()` referenced `cbBtn`,
     which was declared inside the poll that calls it. That threw a `ReferenceError` and killed the whole
     width run **silently** — no results, no error on screen, just a harness that never advanced. Attach a
     `window.onerror` collector before trusting a quiet run.

# Expanded question bank and paper engine tests (v85)

    node tests/exam-bank-tests.js              # 267 checks — repository integrity + every paper rule
    node tests/important-questions-xp-tests.js #  49 checks — revealing an answer awards no XP

* `exam-bank-tests.js` — builds the real repository (`data.js` + generated `questions-expanded.js`) through
  `question-bank.js` and then runs the paper engine against it, section by section:

  * **A. Repository integrity** — unique ids compared *as text* (so numeric id `1` cannot collide with string
    `"1"`); a valid shape and a usable answer key on every item; no two questions left sharing a normalised
    wording fingerprint; every duplicate the build reports is genuinely absent; nothing malformed silently
    discarded; at least 40 questions in every one of the 18 chapters; multi / matching / numerical / case
    all well supplied; HOTS and competency tags present; every image question has alt text *and* a local
    asset file that really exists; and no student-facing string names a source, year or paper.
  * **B. The eight modes** — the original seven are pinned by id, title, question count, duration, pass mark
    and maximum marks so they cannot drift; the eighth is named exactly *CBSE Board Mock Test*, runs 180
    minutes, is out of 80, has 52 questions, carries a blueprint, sets no negative marking and covers all
    18 chapters.
  * **C. Blueprint compliance** — 40 independent draws, all satisfying marks, count, section shape (A–E in
    order), the published unit weightage 12 / 44 / 24 and the CBSE cognitive split; repeated draws provably
    differ; an unbuildable blueprint is *refused* (`blueprint-not-met`) rather than shown with a wrong total;
    the legacy `drawQuestions` path still behaves for the original seven papers.
  * **D. Shuffling** — sections stay in A–E order while the inside of each section is reshuffled; a case
    study travels whole and its parts still add up to its marks; no id appears twice in a paper.
  * **E. Answer-key integrity** — over 400 questions, the presented option list is a *permutation* (never a
    rewrite), the key still points at the same words afterwards, the same seed always reproduces the same
    layout, a different seed really moves things, the original bank object is never mutated, the permutation
    map is never carried onto the delivered object, and a case study's sub-keys follow its shuffled options.
  * **F. No-repeat** — unseen preferred, an exhausted pool still fills, and the fallback draw still totals
    80 marks with Unit 1/2/3 at 12/44/24.
  * **G. Grading** — exact marks for mcq, multi (net picks), numerical (tolerance), matching (slot ratio) and
    case (sum of parts); no negative marking anywhere; `evaluatePaper` returns section/unit/chapter/typology
    breakdowns; a free-text or keyless question is *refused* rather than guessed; and `evaluatePaper` is
    checked to agree with the original `evaluateAttempt` on the single-answer papers.
  * **H. Sanitising** — out-of-range, duplicate and nonsense answers dropped; a bad case part cannot spoil a
    good one; `isAnswered` for every shape including option index `0` and a partly answered case.
  * **I. CBSE honesty** — no official Class XI sample paper is claimed, the record says Class XI exams are
    school-conducted, the units total 80, the cognitive split totals 80 and 100 %, and neither the mode nor
    the shipped sources claim an official paper.

* `important-questions-xp-tests.js` — extracts the *real* `renderIQList()` click handler out of `app.js` by
  bracket matching and **executes it eleven times** with stubs (first reveal, repeat reveals, bookmark,
  a page refresh that rebuilds the handler over reloaded state, and a second question), asserting addXP is
  never called and totals zero XP, while the solved marker is written exactly once and the activity log is
  untouched. Also asserts no XP-granting alias or counter mutation exists anywhere in `renderIQList()`, the
  old reward string is gone from the whole file, nothing resets `STATE.xp` / achievements / the solved map,
  and every other XP reward on the site (including the now-capped exam reward) is still present.

Both suites are development-only and are not loaded by the website.

## Full suite results

    node tests/run-tests.js                      426 passed, 0 failed
    node tests/calculator-tests.js               308 passed, 0 failed
    node tests/ai-tests.js                       152 passed, 0 failed
    node tests/ai-intelligence-tests.js          229 passed, 0 failed
    node tests/solver-tests.js                   115 passed, 0 failed
    node tests/exam-security-tests.js            181 passed, 0 failed
    node tests/exam-rules-tests.js               137 passed, 0 failed
    node tests/exam-search-tests.js             3097 passed, 0 failed
    node tests/achievements-tests.js             147 passed, 0 failed
    node tests/seo-tests.js                     1149 passed, 0 failed
    node tests/exam-store-tests.js                66 passed, 0 failed
    node tests/exam-bank-tests.js                267 passed, 0 failed
    node tests/important-questions-xp-tests.js    49 passed, 0 failed

                                              6323 passed, 0 failed
