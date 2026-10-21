# AI Tutor — how it works (v81)

    Student message  (typed, pasted, photo, or "Ask Tutor" on any question)
        │
        ▼  ai-tutor-core.js  — the SAME file runs in the browser and in the Netlify function
    1 UNDERSTAND   intent (define / explain / simplify / shorten / expand / example / why / importance / format /
                   compare / practice / check / mistake / what-if / numerical / small talk …), style (simple, short,
                   detailed, final-only, full steps) and WHAT "that / it / this" REFERS TO
                   (the previous answer, the previous numerical, the attached question, or a new topic)
    2 REMEMBER     structured, per-chat state: topic, last answer, current numerical, pending practice question,
                   pending clarification, used examples/blocks, confusion count … (a New Chat starts empty)
    3 RETRIEVE     role-aware search of the site's own content (ai-knowledge.js index): "What is X?" prefers the block
                   that DEFINES X; "format of X" prefers the format block; "why" prefers purpose/reasons.
                   Typo-tolerant: a query term the index has never seen ("depreciaton", "reciept") is mapped to the
                   closest real vocabulary term (bounded edit distance ≤ 2) at a slight score discount — exact
                   terms are never altered.
    4 SOLVE        ai-solver.js — figures are extracted WITH their roles, calculated by code, validated by a second route
    5 COMPOSE      one natural answer, length matched to the question; wording varies when the same thing is re-asked
                   (facts and accounting rules never do)
    6 VALIDATE     solver self-checks, journal Dr = Cr, stored-answer audit (gentle note if the page's own figures disagree)
        │
        └─ the browser composes the answer itself with steps 1–6 (the ONLY path now —
           there is no AI service, no endpoint and no API key anywhere in the project)

## Files
* `ai-calc.js` — exact arithmetic building blocks (GST, depreciation, equation, trial balance, ledger, BRS, provisions,
  interest, **trading/P&L: `tradingResults()` → COGS, net sales, gross profit, net profit**).
* `ai-solver.js` — text → solution for all of the above plus discounts, settlements, adjustments, percentages, and the
  chapter-specific solvers **cash book** (single-column receipts vs payments → closing cash), **final accounts**
  (Trading + P&L from the usual figures) and **rectification of errors** (amount over/under-statement and
  wrong-party/wrong-account swaps → the correcting entry; figure-less rectification questions fall through to the
  knowledge base by design, because `solve()` only engages when the sentence carries a number).
  `whatIf()` re-solves with a changed method/rate/amount; `diagnoseNumber()` names a student's likely slip.
* `ai-knowledge.js` — the index built FROM `data.js` (nothing is copied). Add a question list to `SOURCES` and it becomes
  searchable and Ask-Tutor-able. Block roles (definition / purpose / features / format / …) are detected from titles AND content.
* `ai-tutor-core.js` — intent, memory, retrieval-by-role, composition. Pure functions; never touches XP, progress or
  Accounting Cycle data.
* `tutor-engine.js` — unchanged: plain transactions → journal entries (Accounting Cycle logic), mode switches, its own practice problems.
  (The former `netlify/functions/ai-tutor.js` endpoint and `ANTHROPIC_API_KEY` setup are **gone** — the project no longer
  contains any backend function or external AI service.)

## Ask Tutor button
`aiAskBtn(srcKey, rawQuestion, meta)` in `app.js` — one delegated capture-phase handler for the whole site, so a click never
reaches a card's own handlers (no answer is submitted/selected, no XP, no progress, no bookmark change).
Case-style sections (Decision Lab, Error Detective, Statement Builder, Adjustment Studio) travel with their **real problem
state**: `describeCase` serialises every step (question, options, correct index, explanation) plus the student's live picks
through `toWire`/`resolveWire`, so the tutor grades, explains and follows up on the exact case the student was solving.
Styles: `.ask-tutor*` in `styles.css` (idle dashed outline → hover solid + spark → press → "opening"; honours reduced-motion).

## Tests
    npm test            # accounting cycle · calculators · AI · intelligence · solver · revision · tutor regression
                        # · exam security · exam rules · search · achievements · tutor probe · cycle probe
    npm run test:probe  # the two independent probes in full (npm test only surfaces their failures)
    node tools/validate-knowledge.js   # knowledge-base audit in one place: content, index report,
                        # retrieval fixture (incl. misspellings), case pipeline

# v80 changes

Found by the independent probes (`tests/probe-tutor.js`, `tests/probe-cycle.js`) — real failures, not spec wishes:

**Tutor**
* "Give a Journal entry." (and "show me the entry", "pass a problem", …) was classified as a *definition* ask and
  answered with prose and no Dr/Cr at all. Entry-request verbs now route to the **example** action, which prints a
  real journal entry and keeps the conversation's active topic.
* "Now solve one using WDV." after a depreciation explanation was answered with the WDV *definition* — no figures,
  no working. With nothing attached to solve, the tutor now demonstrates the method on a worked problem of the
  topic in hand.
* "Just give me the final answer" still printed the full breakdown table under the answer. Final-only now suppresses
  the table when a single final figure exists (a table is still shown when the answer has no single figure).
* A one-line concept card that never names its own subject (e.g. "Assumes the business will continue…") left the
  student guessing. Cards that never mention their own topic are now prefixed with the block's title; cards that
  already name the topic are untouched.

**Accounting Cycle**
* Capital introduction silently DROPPED current assets: "Started business with cash ₹40,000 and debtors ₹10,000"
  lost the debtors. Bills receivable also hijacked the sentence into the bills-of-exchange interpreter. Both now
  post correctly, and liabilities the proprietor brought along (creditors, bills payable) reduce capital.
* Bare final-accounts adjustments were INVALID: "Bad debts ₹6,000." and "Discount allowed ₹1,000." now write off
  against the Debtors (or the named debtor). Provisions still take priority when the same line also asks for one.
* The prepaid split only fired on "of which"/"including". "Paid insurance ₹12,000 in cash; ₹2,000 is prepaid."
  now splits correctly.
* The opening-balance line merger ran past the end of a complete opening list and swallowed the NEXT transaction
  into the opening journal. Merging now stops as soon as the accumulated group balances; an incomplete list still
  merges across lines.
* "Capital ₹90,000" written inline in a bare list was treated as an asset, so Capital was debited 90,000 *and*
  credited a second derived 90,000. It is now recognised as the stated capital, and when the stated capital
  contradicts assets − liabilities the engine REFUSES with an explanation instead of silently guessing a figure.

# v81 changes

**Quick Revision everywhere (Task 1)**
* All 18 chapters now end with a **Quick Revision** tab — the previously-missing Accounting Equation, Debit & Credit
  and Journal chapters got a new block, and the four older "Revision" tabs were renamed and moved last. One shared
  renderer (`renderQuickRevision` in `app.js`) draws every block type (definition → rules → method → formulas →
  formats → distinctions → exam points → common mistakes → mnemonic), so the look is identical everywhere.
* The Revision hub lists all 18 chapters and deep-links straight into the Quick Revision tab of each.
* `search-index.js` indexes the new keys (exam points, formats, formulas, distinctions).

**Ask Tutor carries real case state (Task 2)**
* Decision Lab / Error Detective / Statement Builder / Adjustment Studio questions are `kind: "case"`: every step's
  question, options, correct index and explanation travel with the question, and the student's picks are read **live**
  at click time (`meta.getPicks()`), so arriving in the tutor shows graded picks, not a flattened blob of text.
* Follow-ups keep the case context (`questionFollowUp` / `whyQuestion` / `checkAnswer` all understand `caseSteps`).

**Solving depth (Task 3)**
* New solvers: **Cash Book** (classifies receipts vs payments, validates closing = opening + receipts − payments,
  asks a clarifying question instead of guessing when a line is ambiguous), **Final Accounts** (COGS → gross profit →
  net profit with three independent checks), **Rectification** (amount errors and wrong-party/wrong-account swaps →
  correcting entries that balance). All three are registered in `GATES`, own hints, own plain-language intros and
  diagnose candidates for common slips.
* Fuzzy retrieval: unseen (misspelled) query terms are rewritten to the nearest real vocabulary term (edit distance ≤ 2,
  discounted weight). Exact queries are untouched — proven by the retrieval fixture in `tools/validate-knowledge.js`.
* Knowledge-base document titles now name their chapter ("Accounting of GST — Quick Revision — Formulas" instead of
  eighteen identical "Quick revision — definition"), and each Quick Revision **format/distinction** is its own document
  titled the way a student asks ("Format of Balance Sheet (as at …)", "Difference between Provision and Reserve").
* Honest local-model evaluation written up in `AI-LOCAL-MODEL.md` — still not bundled; see that file for why.

**Tutor UI (Task 4)**
* One reply at a time: Send is disabled while a reply is being prepared (also blocks double-Enter and rapid chips).
* Real error state: if the engine throws, the typing indicator clears, a `role="alert"` card appears with **Try again**,
  and the student's message is never lost. Regenerate keeps the previous answer if a re-run fails.
* Accessibility: live status region (`role="status"` announcements for thinking/replied/error), labelled controls,
  `maxlength` on the input, IME-composition guard (Enter confirms Japanese/Chinese/Korean candidates instead of sending).
* Empty input gets gentle feedback ("Type your question first") instead of silently doing nothing.

**Removed (Task 5)**
* The Hint / Steps / Final mode buttons, their handlers, styles and shortcuts are gone. The tutor still gives hints,
  step-by-step work and final-only answers in chat — the quick chips (Hint / Show solution / Check answer / Practice)
  drive that, and Clear still empties the conversation.

**Tests (Task 6)**
* `tests/revision-tests.js` (247 checks) locks the 18-chapter structure, tab order, renderer wiring, search indexing
  and hub deep-links; `tests/tutor-regression-tests.js` (32 checks) locks the case pipeline, the new solvers and
  regression guards on the old ones; `tools/validate-knowledge.js` is the one-place KB audit. All wired into `npm test`.
