# Delivery report — v94: the guided learning journey (LEARN → UNDERSTAND → PRACTISE → REMEMBER)

**Project:** Accountancy By Abinash (Classes 11 and 12, fully static, API-free)
**Package:** `accountancy-by-abhinash-v94-guided-learning.zip`
**Built on:** the v93 tree (`accountancy-by-abhinash-v93-exam-security-hardening.zip`)
**Prepared:** October 2026

Everything below was actually executed. Where a check was not run or a
measurement could not be taken, it says so.

---

## 1. What was delivered

All **31 chapters** (18 Class 11 + 13 Class 12) now run as a guided
**LEARN → UNDERSTAND → PRACTISE → REMEMBER** journey. Nothing was replaced —
the guide adds content and one roadmap card on top of the existing chapter
pages, practice banks, exams, tutor, flashcards and class system.

| Stage | What the student actually does | Marked complete only when |
|---|---|---|
| **1 LEARN** | rewritten Introduction: hook → why it matters → objectives → what this connects to → a 4–6 option readiness guess with honest feedback → CTA into the theory | the readiness guess is **submitted** (`glLearnDone`) |
| **2 UNDERSTAND** | guided theory blocks with anchored diagrams, then a **checkpoint** built from the chapter's own question bank | a checkpoint question is **answered correctly** (`glUnderstandDone`) |
| **3 PRACTISE** | the existing practice bank (unchanged) | real solved-practice progress hits 100% — `STATE.chapterProgress` is **computed, never stored** |
| **4 REMEMBER** | attempt-first recall prompts: write it, then reveal (or admit "I blanked on this one") | **every** recall item has been revealed or skipped honestly (`glRememberDone`) |

Honesty rules that are enforced in code and pinned in tests:

* no stage is completed by a timer, a scroll or a decorative button;
* `stageStates` clamps: 150% progress still reads `all questions solved`
  (state `done`), never a fake "100% solved" claim;
* XP is once-ever per chapter per rule — `guide-rd|` **4 XP** (readiness) and
  `guide-rcl|` **6 XP** (recall) — and cannot be re-farmed by revisiting;
* checkpoints reuse the practice bank's **exact solved keys and XP rules**, so
  a checkpoint answer and the same question in practice can never double-award;
* a wrong checkpoint answer still lands in the **Mistake Book** with its
  explanation, exactly like practice.

### Content authored for this release (measured from the shipped file)

| Piece | Count |
|---|---|
| Chapter guides | **31 / 31** |
| Hooks (chapter-specific, original) | 31 |
| Readiness checks | 31 (123 options total) |
| "What this connects to" links | 31 forward + 29 backward, using the site's own chapter numbers |
| Checkpoint questions reused from the real bank | **94** across 31 chapters |
| Diagrams | **61** — table 28, steps 20, compare 7, flow 3, equation 2, T-account 1 |
| Recall prompts | **155** across 31 chapters |

Diagrams are anchored to the **exact theory block heading** they explain (or
the `intro-end` sentinel in the ledger chapter) and rendered as semantic
`<figure>/<figcaption>` inside `.gl-diag-slot`, escaped — never floating loose
in the page.

## 2. Architecture (why it is safe)

* **`guided-learning.js` (new, `?v=1`)** — pure data + pure API. Per-chapter
  guide parts are pushed onto `window.GUIDED_PARTS` and merged into
  `APP_DATA[key].guide` by `window.GuidedLearn` (`STAGES`, `stagePlan`,
  `stageOfTab`, `stageStates`, `guideDataOf`, `diagramAfter`, `esc`,
  `buildDiagram`). It runs after `theory-upgrade.js` and before `app.js`.
* **`app.js`** — DOM/state wiring only: the rewritten `theoryChrome(panel,
  data, kind, accent)` (same signature, all 4 existing call sites untouched),
  the roadmap, readiness, checkpoint cards (`glMcqCard`, `glChoiceCard`,
  `glDualChoiceCard`, plus the hosted `renderQuestionCard`/`renderDCQuestionCard`/
  `renderJRQuestionCard` formats), the recall widget, revise strip and the
  diagram insertion points in `renderLedgerIntro` / `renderCashBookTheoryBlocks`.
* **`styles.css`** — one self-contained `v94` block at the end of the file
  (lines 4586–4735): light values come from existing variables, `html.dark`
  refinements, `@media (max-width: 760px)` (roadmap 4 → 2 columns) and
  `@media (max-width: 460px)` (roadmap 1 column, hook padding, flow stacked,
  T-account stacked), plus `prefers-reduced-motion`.
* **No new backend, API, database, remote model, package or network call.**
  All state is the existing `localStorage`; all content is local files.

## 3. Files changed

`guided-learning.js` **(new)**, `tests/guided-learning-tests.js` **(new)**,
`app.js`, `styles.css`, `index.html`, `sw.js`, `package.json`, `README.md`,
`docs/DELIVERY-REPORT-v94.md` **(new)**, and three authoring/audit helpers that
are not loaded at runtime: `tools/guide-audit.js`, `tools/guide-ref.js`,
`tools/guide-headings.js`.

Version pins: `guided-learning.js?v=1`, `app.js?v=74`, `styles.css?v=52`,
SW `aba-cache-v56` with `./guided-learning.js` added to the precache list.

## 4. Tests actually run

Full `npm test` chain — **25 suites, 12,843 assertions + 37 probe scenarios,
0 failed, exit code 0** (log: `%TEMP%\aba-v94-fulltest.log`, run after the
final source edits, with the authoring temp files already deleted).

Per suite: run-tests 426/0 · calculator 308/0 · ai 152/0 · ai-intelligence
229/0 · solver 115/0 · revision 247/0 · tutor-regression 32/0 ·
exam-security 195/0 · exam-rules 148/0 · exam-store 98/0 · theory-upgrade
433/0 · **guided-learning 1507/0 (new)** · exam-monitor 710/0 ·
exam-hardening 94/0 · exam-search 4862/0 · exam-bank 298/0 ·
important-questions-xp 49/0 · achievements 147/0 · seo 1667/0 ·
ui-features 157/0 · class-system 535/0 · push-notification 406/0 ·
push-blobs 28/0 · probe-tutor 18/18 · probe-cycle 19/19.
`tools/repair-encoding.js`'s mojibake scan (inside exam-hardening) reported
clean on this run too.

The new suite locks the contract end to end: 31 guides present; byte-exact
anchors resolve (duplicated headings avoided); **no `<` or `>` characters** in
any interpolated guide string (the renderers use `innerHTML` unescaped);
`GL.stagePlan` learn/understand never share a tab (eq / dc / jr use `Theory`
vs `Concepts`); stage-state honesty (the 150% clamp assertion); checkpoint
solved keys identical to the practice bank's keys; once-ever XP guards; and
the v94 CSS (dark + both mobile breakpoints) present in `styles.css`.

## 5. Real-browser verification (local server, `node tools/serve.js`)

Verified live on `http://127.0.0.1:4173`:

* **Class 11 · Trial Balance** — roadmap with honest subs; hook; readiness
  (4 options + "Check my guess", correct feedback *"YES — THAT IS THE IDEA"*,
  "Leads to" connects); Learn → `readiness checked`; Format & Rules checkpoint
  with real bank questions (Easy Q1 + Medium Q15); attempt-first recall
  (textarea → "Reveal answer" / "I blanked on this one"); revise strip;
  mistakes. Answering Q1 flipped Understand → `checkpoint cleared`, Practise →
  a real `4% solved`, and revealing all 5 recall items flipped Remember →
  `recap recalled`.
* **Class 12 · Partnership Fundamentals** — C12 chapters carry the full
  roadmap/hook/readiness/CTA and their diagrams on the **Introduction** tab,
  with the checkpoint/recall/revise/mistakes on the **Theory** tab; both deed
  diagrams render inside `.gl-diag-slot` directly after their own theory
  blocks.
* **Equation** — checkpoint renders 3 compact MCQ cards.
* **Journal** — hosted `renderJRQuestionCard` checkpoint (Q1 + Q15 from this
  chapter's bank, correct answers matched).
* **Ledger** — dual debit/credit card: choosing *Cash A/c* + *Capital A/c* and
  checking answered *"Correct! Cash A/c is debited (posted 'To Capital A/c');
  Capital A/c is credited (posted 'By Cash A/c')"* → Understand
  `checkpoint cleared`, Practise `1% solved`.
* **Cash Book** — choice card with real Q14 (contra) + Q17 (dishonoured
  cheque); the contra answer graded Correct with its explanation → Understand
  `checkpoint cleared`, Practise `2% solved`.
* **Themes** — `ocean`/`forest` applied with `html.dark`: `--paper` resolves
  `#0F1115`, roadmap/checkpoint/recall borders and text switch to the dark
  line/ink values (light-mode values come from the same variables).
* **Regression** — `#home` and `#exam-mode` render normally with **zero**
  guided-learning elements leaking outside chapter routes.

**Console:** the only error on every page is
`404 /.netlify/functions/push-config` — expected, because the local server is
a plain static file server with no Netlify Functions. No JavaScript errors
from the guide.

**Responsive:** the v94 media queries were verified by reading the shipped CSS
and confirming the DOM they target (`.gl-rm-stages`, `.gl-hook`, `.gl-flow`,
`.gl-taccount`, tables inside `.table-scroll`).

## 6. Honest limitations

1. **No device emulation in this environment** — the browser tooling cannot
   resize the viewport, so the 760 px / 460 px layouts were verified by CSS
   inspection against the real DOM, not by rendering at a phone width. No
   physical-device run was made.
2. **Screenshots were unavailable for the last checks** (the automation window
   was not visible to the capture tool); earlier screenshots of the roadmap,
   hook, readiness, checkpoint, recall and diagrams are in the session. The
   later checks (ledger/cash-book checkpoints, themes, home/exam regression)
   were verified from live DOM text, computed styles and console output.
3. **Practise can never be "completed" by the guide** — it reads real solved
   practice, so it stays at whatever the student has actually solved.
4. **Recall prompts are self-revealed**, not machine-graded: the site cannot
   read handwriting, so the widget measures attempt + reveal, honestly
   labelled `recap recalled`, and never claims the answer was *correct*.
5. **XP for the guide is once-ever per chapter** (4 + 6 XP); a student who
   wants to redo the readiness check in a later visit will not be paid twice —
   deliberate, to keep it un-farmable.
6. The existing honest limitations of the site (client-side exam limits,
   offline tutor, `localStorage` progress) are unchanged and still described
   in `README.md`.
