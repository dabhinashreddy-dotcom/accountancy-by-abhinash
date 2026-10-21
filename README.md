# Accountancy By Abhinash — Class 11 Accountancy (fully static, API-free)

A single-page, offline-capable study site for CBSE Classes 11 and 12 Accountancy:
chapters with practice banks, detectives and studios, flashcards, quizzes,
Important Questions, an offline AI tutor, calculators, mistake book,
achievements, progress, and a timed Exam Mode with printable certificates.

No build step, no framework, no backend, no network calls at runtime.
Open `index.html` from any static host (Netlify, GitHub Pages, a local folder).

---

## What this release (v94) changed — the guided learning journey

Every chapter (31 total: 18 Class 11 + 13 Class 12) now runs as a guided
**LEARN → UNDERSTAND → PRACTISE → REMEMBER** journey instead of dumping theory,
practice and revision into one flat page.

### 1. A roadmap that only tells the truth

`theoryChrome()` renders a **Chapter journey** card at the top of the chapter:
four stages, each with a live, activity-based status line.

| Stage | Completed when | Status text you see |
|---|---|---|
| 1 Learn | the readiness guess is submitted | `readiness checked` |
| 2 Understand | a checkpoint question is answered correctly | `checkpoint cleared` |
| 3 Practise | real solved-practice progress (computed, never stored) | `4% solved` |
| 4 Remember | every recall prompt is revealed or skipped honestly | `recap recalled` |

Nothing is marked done because a timer ran or a button was pressed — each
stage is tied to the activity it names. XP is awarded once per chapter per
rule (`guide-rd|` 4 XP, `guide-rcl|` 6 XP) and can never be re-farmed.

### 2. `guided-learning.js` — the guide data and its API

A new file (loaded after `theory-upgrade.js`) holds per-chapter guide parts
pushed to `window.GUIDED_PARTS`, merged into `APP_DATA[key].guide` by
`window.GuidedLearn`:

* **Learn opener** — hook → why it matters → objectives → what this connects
  to (using the site's own chapter numbers) → a readiness guess with 4–6 real
  options and honest feedback → CTA into the theory.
* **Understand closer** — mistakes students actually make → recap →
  **checkpoint** → recall prompts → a revise-when strip.
* **6 diagram types** (`flow`, `steps`, `compare`, `table`, `taccount`,
  `equation`) anchored to the exact theory block they explain (or the
  `intro-end` sentinel for the ledger), rendered as semantic
  `<figure>/<figcaption>` inside `.gl-diag-slot`.
* **Checkpoints reuse the chapter's own question bank** with the same solved
  keys and XP rules as practice — MCQ chapters get compact cards, journal /
  depreciation / journalising get the hosted `renderQuestionCard` /
  `renderDCQuestionCard` / `renderJRQuestionCard` formats, ledger gets a
  dual debit/credit card, and cash book / special books / BRS get the
  multiple-choice card. A wrong answer still lands in the Mistake Book.
* **Recall is attempt-first** — write it, then reveal (or admit "I blanked on
  this one"). There are no self-assess buttons that hand out completion.

### 3. What did not change

No new backend, API, database or remote model; no second progress/reward
system; every existing route, exam, theme, AI Tutor, flashcard and class
toggle keeps working (the guide only *adds* content and one roadmap card).

### 4. Tests

New `tests/guided-learning-tests.js` (**1507 assertions**) locks the contract:
31 guides present, byte-exact anchors resolve, no `<`/`>` in interpolated
guide strings, stage plans never collide, honest stage states (150% progress
still reads `all questions solved`), checkpoint keys match the real practice
keys, XP-once guards, dark/mobile CSS present. The full `npm test` chain is
green end-to-end.

Cache-busted for this release: `guided-learning.js` precached,
`app.js?v=74`, `styles.css?v=52`, service worker `aba-cache-v56`.

Full detail: `docs/DELIVERY-REPORT-v94.md`.

---

## Historical: what the v82 release changed

Nine tasks, all implemented in the shipped code — not planned, implemented.

### 1. Flashcards flip in real 3D

The card is a single DOM element with `transform-style: preserve-3d` and two
absolutely-positioned faces. Flipping toggles `.is-flipped` **on the live
element**, so the browser animates `transform` from `rotateY(0)` to
`rotateY(180deg)` over 0.55s — verified mid-transition
(`matrix3d(-0.58, …)`), which a text swap can never produce.

* Click / tap flips; **Enter and Space** flip from the keyboard
  (`role="button" tabindex="0"`, `aria-pressed` tracks the face).
* Front and back share the exact same box, so faces stay aligned;
  `backface-visibility: hidden` (+ `-webkit-` prefix) keeps the back opaque
  (no mirrored text bleeding through).
* Long answers scroll inside the face (`overflow-y: auto`, auto-margined
  content so nothing clips at the top).
* Reduced motion (`prefers-reduced-motion` or the app's own
  `html.reduce-motion`) collapses the transition to ~0 — the state still
  changes, it just doesn't spin.

### 2. Chapter dropdown on Important Questions

The 19-chip horizontal scroller is a native `<select id="iqChapterSelect">`
built from `UIFeatures.buildIQChapterOptions(APP_DATA.chapters, counts, …)` —
i.e. from the website's own chapter list, with the real per-chapter counts
(`All Chapters (172)`, `Ch.7 Journal (12)`, …). It has a visible label, a
hint wired via `aria-describedby`, keyboard access for free (native control),
and it stays synchronised with the list (selection → re-filter → count label
`Showing N questions from …`, `role="status"`).

* Deep links: `#important-questions?ch=jr` (and `#flashcards?ch=cb`) select
  the chapter on load, so activity rows and shared links open the right set.
* The existing question-format chips (All / Short / Long / Case-Based /
  Assertion-Reason) keep working — including `aria-pressed` **and** the
  visual active state (a desync found and fixed in this pass).
* An empty category says so precisely: *"No Long Answer questions for
  Ch.12 GST yet. Pick another chapter in the dropdown above, or choose a
  different format."*

### 3. Recent Activity is structured, clickable and honest

Every `logActivity()` call now writes a structured record
(`type, key, text, route, tab, qid, qidNoun, difficulty, status, chapterId, at`)
normalised and de-duplicated through `UIFeatures.normalizeActivity` /
`pushActivity` (one row per stable key, newest first, capped at 12).
Plain-string calls and legacy `{text, at}` rows still render — as plain text,
never as dead buttons.

Clicking a row opens the **exact** destination:

| Entry type | What happens |
|---|---|
| Practice / case / statement | chapter route → correct tab → the card is scrolled to and flashed |
| Important Question | `#important-questions?ch=…` → dropdown syncs → `#iqcard-<ch>-<idx>` flashed |
| Flashcards deck | `#flashcards?ch=…` → the right deck filter is active |
| Quiz / exam / chapter | the section itself is the destination |

If the destination no longer exists the student is told, honestly:
removed route → *"This activity is no longer available — it may have been
removed in an update."*; missing section → *"...its section is open instead."*
Corrupt rows (nulls, empty text, bad timestamps) are dropped at load and at
push time; a bad timestamp is repaired to "now". No activity is ever
fabricated — rows only exist where a real event wrote them.

### 4. XP that can't be farmed

A registry in `ui-features.js` backs three gates used by `app.js`:

* `awardOnce(key, …)` — **once ever**, per stable ID. Quiz questions pay on
  the first attempt only (the penalty path claims the same key, mirroring the
  chapter-practice rule); matching rounds, self-assessed questions, cash-book
  entries, the balanced cash book, books-detective cases and the AIA
  scenario are all once-ever.
* `awardDaily(key, …)` — **once per calendar day**. The flash-deck completion
  bonus (`flash-deck|<chapter>`, value unchanged: `min(20, known)`) and the
  quiz completion bonus (`quiz|<chapters>|<difficulty>`, value unchanged:
  score × 2) are daily-once per set. When the gate is already closed the UI
  says *"Today's … is already earned — replays are still good practice."*
  instead of pretending a reward happened.
* `bumpDaily(key, cap, …)` — **capped counters**: AI tutor 5 paid questions
  per day, generator 10 solved problems per day (generator penalties also
  stop once the quota is spent — free practice is free both ways).

`addXP(0, …)` is now silent (no toast, no pulse). Established reward values
(4/question, −1 wrong, 2/quiz-question, deck cap 20, exam 3/answer capped 50)
are untouched, totals stay consistent, and the XP UI updates immediately.
Rewards fire only from real, verified events — never from refresh, re-click,
or navigation (`STATE.solved` and the gate registry together make re-earning
impossible; verified by reloading mid-session).

### 5. Next Section / Next Chapter on every chapter

`appendSectionNav()` appends one `role=navigation` footer (labelled
*"Section and chapter navigation"*) to every chapter page, driven by
`UIFeatures.planSectionNav`:

* mid-chapter → **Next Section: &lt;real tab title&gt;** (`Section 3 of 5`);
* last section of a chapter → **Next Chapter: &lt;real next chapter name&gt;**,
  following `APP_DATA.chapters` — the **syllabus order, not alphabetical**;
* last section of the last chapter (Ch.18 Adjustments) → **Back to all
  chapters** — a valid end state, not a dead button;
* Quick Revision is still the final tab everywhere (regression-tested);
* the footer is id-guarded (verified: exactly 1 across all 7 tab switches),
  updates on every tab click, and never renders on non-chapter routes.

### 6. One toast system for the whole website

`toast(msg, type, icon, opts)` now supports titles, a manual dismiss button,
info/success/warning/error types, configurable duration, and de-duplication
while a twin is on screen. Entry/exit animations play; the stack never
exceeds 3 toasts (verified: 5 pushes → 3 kept); `role="alert"` for
warning/error, `role="status"` otherwise; on ≤640px toasts sit above the
bottom nav. All existing `toast(...)` call sites still work unchanged.

* **First visit** (~2.6s after the home page renders): *"About this
  website"* with the platform summary, shown **once ever** — the flag is
  persisted the moment it shows, so a reload can't re-trigger it (verified:
  including under `beforeunload → saveState`). Storage blocked → degrades to
  showing it once per session, never loops.
* **Exam attempts exhausted**: when the student actually tries to start a
  paper whose daily attempts are gone — from the paper card **or** from a
  failed start — a warning toast says exactly *"Don't have a code? Ask
  Abinash to unlock more attempts."* It is event-driven (never rendered on a
  normal dashboard pass), and the refusing API call does **not** consume a
  second attempt (verified: `starts` stayed at 2/2).

### 7. Responsive, accessible, consistent

New styles for the flip card, dropdown, activity rows, section footer and
toast variants live in one v82 block at the end of `styles.css` (light +
dark + reduced-motion + mobile covered). Heading order on the home page was
fixed (H2 → H4 skip), and labels now contain their visible text.

**Lighthouse (this build, run against the local server): Accessibility 100,
Best Practices 100, SEO 100 — zero failed audits.**

### 8. Testing (actually executed)

`npm test` — **all 18 suites green**, including the new
`tests/ui-features-tests.js` (158 assertions: XP registry behaviour, activity
normalise/dedupe/corruption, section-nav planning in syllabus order, dropdown
option building, quiz-config key, XP policy constants, and ~100 source-wiring
checks across `app.js`/`styles.css`/`index.html`/`sw.js`).

Suites: run-tests 426 · calculator 308 (+320 stored-answer audit, 0 conflicts)
· AI 152 · AI-intelligence 229 · solver 115 · revision 247 · tutor-regression
32 · exam-security 181 · exam-rules 137 · exam-store 66 · exam-search 3258 ·
exam-bank 267 · important-questions-xp 49 · achievements 147 · seo 1149 ·
ui-features 158 · probe-tutor 18/18 · probe-cycle 19/19.

**Browser verification (headless Chromium against the built files):**
flip animation confirmed by mid-transition matrix sampling; dropdown change +
deep-link; activity click-through for all three destination types incl. the
two "destination gone" messages; section-nav walk across a whole chapter and
the final end state; first-visit toast lifecycle; exam exhaustion toast with
no double decrement; once/daily/capped XP gates exercised live; `+4 XP` solve
→ reload → no re-award; toast dedupe/stack/dismiss/roles; clean console
(0 errors, 0 failed requests).

### 9. Deliverable

`~/Downloads/accountancy-by-abhinash-v82.zip` (built by `tools/make-zip.js`):
full source, all 28 prerendered SEO pages, docs, tests, tools. Cache-busted
for this release: `app.js?v=61`, `styles.css?v=47`, `ui-features.js?v=1`,
service worker `aba-cache-v42` (new file precached). No secrets, no
`node_modules`, no lockfiles, no caches, no old zips.

---

## Honest limitations

1. **Exam attempt limits are client-side only.** There is no server: attempt
   counting, the daily cap (2/day, IST midnight) and the unlock codes all
   live in `localStorage` (`abhinash_exam_store_v1`) via `examApiLocal`.
   A student who knows DevTools could edit their own storage — that is a
   property of a fully static site, not a bug in the limit. The unlock-code
   flow (`redeem`) grants +2 attempts or an unlimited day **for that device
   only**; codes are not validated against any backend, so treat them as a
   classroom convenience (ask Abinash for a code), not as security.
   Nothing here is presented as server-enforced.
2. **The "AI Tutor" is fully offline** — pattern/solver/knowledge based, no
   network, no API key (verified by a no-remote-wiring test).
3. **Progress lives in this browser's `localStorage`.** Clearing site data
   resets XP, solved questions and activity. Export/backup is not yet built.
4. **Flashcard "known" counts one flip per card per deck session**, and the
   completion bonus is daily-once by design — replaying a deck the same day
   is free practice.
5. **Daily XP caps** (tutor 5, generator 10) reset at calendar midnight
   (device-local for XP; IST for exam attempts, per `ExamRules.istDayKey`).

## Running it

```powershell
npm install           # only for the push suites (web-push, @netlify/blobs)
npm test              # full regression chain (25 suites)
node tools/serve.js   # local server on :4173
node tools/make-zip.js ~/Downloads/accountancy-by-abhinash-v94-guided-learning.zip
```

Deploy = copy the folder to any static host. Netlify: publish directory `.`,
no build command.
