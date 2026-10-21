# Delivery report — v83: Class 11 + Class 12 CBSE Accountancy platform (session 2026–27)

**Date:** 17 October 2026
**Base:** `accountancy-by-abhinash-v82` (142 files, verified byte-identical to `accountancy-by-abhinash-v82.zip`)
**Deliverable:** `accountancy-by-abhinash-v83.zip` — full source, tests, docs and build tools
**Architecture:** unchanged — static vanilla-JS single-page app, UMD modules, zero dependencies, zero network calls, Netlify-style static hosting, offline via service worker. No framework, no backend, no external API was introduced.

---

## 1. File change list

v83 = **166 files** (165 source files + this report). Comparison against the pristine v82 extraction (SHA-256 per file):

### 1.1 New files (23 + this report)

| Group | Files |
|---|---|
| Class 12 SEO pages (14) | `class-12-accountancy/index.html` + 13 chapter pages: partnership-fundamentals, goodwill-valuation, change-in-profit-sharing-ratio, admission-of-partner, retirement-and-death-of-partner, dissolution-of-partnership-firm, accounting-for-share-capital, accounting-for-debentures, financial-statements-of-company, analysis-of-financial-statements, accounting-ratios, cash-flow-statement, computerised-accounting |
| Class 12 runtime (7) | `classes.js` (registry + installer), `data-12.js` (chapter directory), `data-12a.js … data-12e.js` (unit content) |
| Docs (1) | `docs/CBSE-2026-27-CLASS12-SYLLABUS-CHECKLIST.md` |
| Tests (1) | `tests/class-system-tests.js` (521 assertions) |
| Report (1) | `docs/DELIVERY-REPORT-v83.md` (this file) |

### 1.2 Modified files (47)

- **App core:** `app.js`, `index.html`, `styles.css`, `sw.js`, `package.json`
- **AI / knowledge:** `ai-knowledge.js`, `ai-tutor-core.js`
- **Exam / bank / search / SEO:** `exam-rules.js`, `question-bank.js`, `search-index.js`, `seo-config.js`, `robots.txt`, `sitemap.xml`, `tools/build-seo-pages.js`
- **Tests (4):** `tests/exam-bank-tests.js`, `tests/exam-search-tests.js`, `tests/seo-tests.js`, `tests/ui-features-tests.js`
- **Static SEO pages (29):** `404.html`, `about/index.html`, `ai-tutor/index.html`, 26 pages under `class-11-accountancy/` (home + 23 section pages + exam-mode + accounting-cycle)

### 1.3 Deleted files

None. Every v82 file remains; Numerical Solver stays removed exactly as in v82.

---

## 2. Class architecture (what was added)

- **First-visit class selector** — shown only on home to a genuine first-timer (no saved usage at all), built from the existing design tokens (same welcome-modal pattern, XP/achievement visual language). Choosing a class persists into the same `abhinash_accountancy_v1` record. It never stacks over the first-visit “About this website” toast; the About toast title is byte-identical to v82.
- **Compact class switcher** — segmented `Class 11 | Class 12` control at the top of the sidebar; switching keeps both classes' progress, bookmarks, mistakes and XP separately keyed (chapter/question ids never collide — asserted).
- **`ClassRegistry` (`classes.js`)** — the single source of truth for class metadata, chapter directories and per-class labels; every screen reads labels from it.
- **Route policy** — `ch-*` and `chapters-list-12` routes silently adopt their class (`adoptClassFromRoute`), so direct links never trigger a prompt loop. Shared tools (quiz, flashcards, formula sheet, revision, exam mode, cycle generator, tutor, calculators) keep their v82 canonical URLs under `/class-11-accountancy/…`; those URLs are class-neutral entry points, not Class-11 claims.
- **Live tab titles** — the shared screens whose content is class-scoped at runtime (chapter index, quiz, flashcards, formula sheet, important questions, exam mode, AI tutor, revision, about) show a live `document.title` that follows the active class — e.g. a Class 12 student reads “AI Tutor for Class 12 Accountancy — Ask Doubts” and “Class 12 Accountancy Notes: All 13 CBSE Chapters”. Crawler-facing metadata (seo-config, sitemap, canonical/OG tags) stays the v82 shared wording; chapter-page titles stay fixed to their one true class; and Class 11 users see byte-identical v82 titles everywhere (the dual-class home title “Class 11 & 12 …” is explicitly never rewritten).
- **State safety** — `ensureClassForBoot()`: a returning v82 user (any saved usage) is silently adopted as Class 11 and persisted; a brand-new visitor gets the selector; a storage-blocked session keeps the in-memory class for the session without looping. No key was renamed or reset.

## 3. Class 12 content (CBSE 2026–27)

13 chapters covering both Part B pathways — **Analysis of Financial Statements + Project Work** and **Computerised Accounting + Practical Work** (the pathway choice is optional and deliberately absent from the first-visit selector):

1. Partnership Fundamentals · 2. Goodwill: Nature & Valuation · 3. Change in Profit-Sharing Ratio · 4. Admission of a Partner · 5. Retirement & Death of a Partner · 6. Dissolution of a Partnership Firm · 7. Accounting for Share Capital · 8. Accounting for Debentures · 9. Financial Statements of a Company · 10. Analysis of Financial Statements · 11. Accounting Ratios · 12. Cash Flow Statement · 13. Computerised Accounting

Per chapter (mirrors the Class 11 chapter structure): theory (intro + advanced), concepts, formulas & formats, **10 practice numericals** (130 total, Easy/Medium/Hard with answer + explanation), **one unique interactive activity with verified answer checking** (5 distinct engines across the class: solver-grid, matching, sequencing, classification, statement-construction), **one unique mind map**, exam-style cases and numericals, quick revision block, flashcards and Important Questions entries. Chapter and question ids are stable and unique across both classes (asserted).

Curriculum basis: `docs/CBSE-2026-27-CLASS12-SYLLABUS-CHECKLIST.md` maps every delivered unit to the CBSE 2026–27 curriculum, including the excluded topics that were deliberately **not** shipped. No claim of CBSE approval/endorsement is made anywhere, and nothing promises that board-exam questions will appear.

**Live totals after this build (measured in-browser):** question bank 2,689 · tutor knowledge 2,252 questions / 4,035 documents · Practice Bank 701 (Class 11 571 + Class 12 130) · Quiz 638 (508 + 130) · Important Questions 263 (172 + 91) · search index 3,931 entries (asserted by the search suite) · SEO routes 43.

## 4. Shared systems made class-aware

One AI Tutor and one Accounting Cycle Generator remain (no duplicates). Also class-aware: exam mode + draw-paper (`exam-rules.js` papers carry their own `className`), quiz, flashcards, formula sheet, revision hub, Important Questions, certificate issuance (certificate `className` comes from the paper, so a Class 12 paper issues a Class 12 certificate; legacy records fall back to Class 11), search, SEO pages/sitemap, and the tutor's local brain. Quiz/exam/tutor copy derives from `ClassRegistry.CLASS_META[activeClass() || "11"]`, so Class 11 output stays byte-identical to v82.

## 5. AI Tutor — correctness fixes (with root causes)

The Class 12 welcome chip exposed four latent routing defects (the same defects made the v82 Class 11 chip mis-route — they were never exercised). All were fixed at the root:

1. **Practice-intent regex** allowed only one filler word; “Give me a Class 12 Accountancy question” (3 filler words) never matched. Widened to a strict superset (`([\w.-]+ ){0,3}`), so every v82 match still matches.
2. **Class labels are metadata, not topics.** The fuzzy title matcher mapped “class accountancy” to a chapter (Trial Balance). Fix: when a practice request names a class (`class/cbse + 11/12/xi/xii`), the label tokens are stripped from topic resolution — and the stop-list is **stem-aware** (`contentTokens` stems “class”→“clas”).
3. **Chapter scoping.** `pickQuestion` now receives the active class's chapter ids (`opts.chapterScope`), so a class never draws a practice question from the other class's chapters. Class 11 pools are provably unchanged (every Class 11 chapter is in scope).
4. **Class 12 had no Practice Bank in the knowledge index.** All 13 Class 12 chapters' numericals are now harvested through the same `SOURCES` path Class 11 uses (also making them searchable documents). The chip now draws “Practice Bank · Chapter” questions for either class, with hint / show-solution follow-ups working off `state.pendingPractice`.

Additionally: greet/abilities/unrelated/not-found replies now take a `classLabel` through the call options (Class 11 defaults reproduce the v82 strings byte-for-byte — e.g. greet shows “any Class 12 topic” for Class 12), the welcome-chip labels swap per class, the tutor's local theory matcher scans the active class's chapters only, and the About logo alt text follows the active class. `AICore.prepare()` and `CHAPTER_SUGGEST` are v82 dead code (no callers anywhere) and were deliberately left untouched. Cache pins: `ai-tutor-core.js?v=3` (v82 shipped v2), `app.js?v=63` and `aba-cache-v43` remain as shipped-in-this-build (never previously deployed), `ai-knowledge.js?v=4` likewise.

---

## 6. Validation — tests actually executed

Final state: **`npm test` → EXIT 0**, all 19 suites green, **8,982 assertions/scenarios**. The final full run was executed over the exact shipped bytes (after the very last file edit); the suites that read app source were additionally re-run green after each later edit.

| Suite | Result |
|---|---|
| run-tests (transactions + properties) | 426 / 0 |
| calculator-tests | 308 / 0 |
| ai-tests | 152 / 0 |
| ai-intelligence-tests | 229 / 0 |
| solver-tests | 115 / 0 |
| revision-tests | 247 / 0 |
| tutor-regression-tests | 32 / 0 |
| exam-security-tests | 181 / 0 |
| exam-rules-tests | 137 / 0 |
| exam-store-tests | 66 / 0 |
| exam-search-tests | 4,212 / 0 |
| exam-bank-tests | 298 / 0 |
| important-questions-xp-tests | 49 / 0 |
| achievements-tests | 147 / 0 |
| seo-tests | 1,667 / 0 |
| ui-features-tests | 158 / 0 |
| class-system-tests (new) | 521 / 0 |
| probe-tutor.js | 18 / 18 scenarios |
| probe-cycle.js | 19 / 19 scenarios |

No existing assertion was weakened to make a test pass; existing version pins were tightened to the values this build ships (they had never been deployed). New coverage added by `class-system-tests.js`: registry integrity, selector/switcher behaviour, route adoption, state migration, class-scoped exam/search/certificate wiring, offline precache of the Class 12 files.

## 7. Browser verification (actually performed, real UI)

Two origins were used: `http://localhost:4173` (live human session — **never modified**) and `http://localhost:4174` (fresh test origin, persona “Ravi”, Class 12). Everything below was executed and read back in the browser:

- First-visit selector; class switcher round-trip; C11 and C12 routes; chapter page `ch-cf` (quick-revision table); formula sheet; revision hub; flashcards; exam mode; Important Questions (91 C12); site search.
- Exam draw-paper (seed 42): 36 questions / 80 marks, class-correct.
- AI Tutor: welcome chip → real Class 12 Practice Bank question with A/B/C/D options → “show solution” answer; topic-scoped request (“give me a question about goodwill” → Goodwill chapter); greetings say “Class 12 topic”; unrelated input says “Class 12 Accountancy tutor” with Class 12 examples; abilities list Class 12 numerical examples; **Class 11 chip parity** (draws a Class 11 Practice Bank question with Class 11 label).
- About-this-website toast title byte-identical; state persistence across reloads.
- Certificate rendering: synthetic `certBuildSheet` renders **“for Class 12”** and **“for Class 11”** correctly (issuance data-flow verified statically: certificate `className` = paper `className`; Class 12 papers carry “Class 12”).
- Offline: service worker registered and active, cache `aba-cache-v43`, **39/39 `APP_SHELL` entries cached** (0 misses), including `data-12*.js`, `classes.js`, `ai-tutor-core.js`.
- **State migration:** a v82-shaped record (no `selectedClass`/`classSelectedAt`/`c12Activities`/`onboardedAt`) was written, the page reloaded, and the app silently adopted Class 11 — selector not shown, and name/XP/31 chapter-progress entries/4 tutor chats/theme/About-flag all preserved. The original record was then restored byte-for-byte (8,948 bytes, original timestamps) and re-verified. (Note: the app's `beforeunload → saveState` writer forces migration tests to keep the in-memory state consistent with any crafted storage state — this is a property of the app, not a defect.)
- **Live tab titles** across both classes: all nine shared screens verified per class — Class 12 users see “AI Tutor for Class 12 Accountancy”, “Class 12 Accountancy Notes: All 13 CBSE Chapters”, and the quiz title without the Class-11-only “(500+)” — while Class 11 chapter pages, the dual-class home title “Class 11 & 12 …”, and every Class 11 view remained byte-identical to v82 (including after switching classes back and forth, which refreshes the live title through the same render path).
- Responsiveness: 375 px viewport (same-origin iframe) — narrow media queries active, **no horizontal overflow** (scrollWidth = clientWidth = 365), class switcher and nav drawer present.
- Performance: boot DOM-complete ≈ 548 ms on the local server; AI Tutor turn ≈ **4 ms** average (10 mixed messages).

## 8. Limitations (honest)

1. **Dual brand spelling (pre-existing).** SEO titles use “Accountancy By **Abinash**” (7 letters, enforced by seo-tests) while prose/body copy uses “**Abhinash**” (8). v82 shipped this way; v83 keeps both spellings exactly as tested rather than breaking pinned title assertions.
2. **Home carousel art** still says “12 of 18 chapters” in its decorative SVG (Class 11 numbers). It is decorative artwork, not a live count; changing it would alter pinned visual assets without user benefit.
3. **Shared tool URLs** remain under `/class-11-accountancy/…` (v82 canonical, cited in the existing sitemap). They are class-neutral at runtime; `adoptClassFromRoute` ignores them on purpose. Renaming them would change shared public URLs.
4. **Tutor defect provenance:** items in §5 were latent in v82 (the welcome chip could mis-route there too). They are fixed for both classes; Class 11 answer text remains byte-identical wherever the code paths were shared.
5. **Certificate verification** was performed statically (issuance data flow) plus a synthetic render of both class labels; no full examination was played through to issue a live certificate during testing.
6. **Dead code** (`AICore.prepare`, `CHAPTER_SUGGEST`) ships untouched — unreachable, kept for minimal diff.
7. **No screenshots** are embedded in this report (captured separately when the desktop window is visible); every claim above is backed by the read-backs described.
8. **Offline behaviour** assumes at least one online visit first (same as v82): the service worker uses stale-while-revalidate with exact-URL caching.

## 9. Acceptance checklist (24 items)

| # | Requirement | Status |
|---|---|---|
| 1 | Existing Class 11 content, ids and progress preserved; v82 base byte-verified before work | ✅ 142 files verified; Class 11 outputs byte-identical (all suites green) |
| 2 | Existing UI/UX/theme/features preserved — no redesign | ✅ Only the permitted additions below were made; ui-features suite green |
| 3 | First-visit class selector (Class 11/12) in the existing design language | ✅ welcome-modal pattern; verified in browser |
| 4 | Coordinated with the first-visit “About this website” toast (title byte-identical) | ✅ selector never stacks over the toast; title byte-identical |
| 5 | Compact class switcher with class-specific labels/filters/routes | ✅ segmented control; per-class labels via `ClassRegistry`; live tab titles follow the active class on shared screens |
| 6 | Direct `class-11-…` / `class-12-…` routes adopt their class silently, no loops | ✅ `adoptClassFromRoute`; browser-verified |
| 7 | Safe state migration on `abhinash_accountancy_v1` — no resets, no storage-blocked loops | ✅ v82-shaped record → silent Class 11, zero data loss (browser test) |
| 8 | Class 12 content follows the official CBSE 2026–27 curriculum, exclusions respected | ✅ `docs/CBSE-2026-27-CLASS12-SYLLABUS-CHECKLIST.md` |
| 9 | No fabricated “official approval” claims; no board-question promises | ✅ nowhere in source or copy |
| 10 | Both Part B pathways supported; pathway choice not in the first-visit selector | ✅ Analysis+Project and Computerised Accounting units both shipped |
| 11 | Every Class 12 chapter has all Class-11-style sections | ✅ 13/13 (theory, concepts, formats, numericals, activity, exam cases, quick revision) |
| 12 | Every Class 12 chapter has a unique interactive activity with verified checking | ✅ 13/13, 5 distinct engines, answer checking asserted |
| 13 | Every Class 12 chapter has a unique mind map | ✅ 13/13 |
| 14 | Stable, unique chapter/question ids across both classes | ✅ asserted (id-collision + bank/search tests) |
| 15 | AI Tutor remains one shared **class-aware** system (no duplicates) | ✅ single core; C11 byte-parity + C12 behaviour browser-verified (§5, §7) |
| 16 | Accounting Cycle Generator remains one shared class-aware system | ✅ probe-cycle 19/19; canonical v82 URL kept |
| 17 | No fake “training”/“official” claims in the tutor | ✅ wording scan asserted by ai-intelligence suite |
| 18 | Quiz/exam/tutor strings class-aware with Class 11 output unchanged | ✅ `CLASS_META[activeClass() \|\| "11"]` pattern; tutor-regression green |
| 19 | SEO pages, sitemap, robots and search index updated for both classes | ✅ 43 routes; seo-tests 1,667 + search 4,212 green |
| 20 | `sw.js` cache/version updated; offline precache covers Class 12 | ✅ `aba-cache-v43`; 39/39 precache verified in browser |
| 21 | New tests added without weakening existing ones | ✅ +521 class-system assertions; pins tightened, none removed |
| 22 | Only tests actually executed are reported | ✅ §6 is the executed record; final `npm test` EXIT 0 |
| 23 | ZIP contains full source + tests + docs + build tools; no node_modules/secrets/caches | ✅ verified at packaging (§10) |
| 24 | Honest limitations + this report delivered with the ZIP | ✅ §8, §10 |

## 10. Package

- **Archive:** `accountancy-by-abhinash-v83.zip` — built with the repo's own `tools/make-zip.js`.
- **Contents:** all 166 files of §1 (source, tests, docs, tools), excluding `node_modules`, caches, logs and any secrets (none exist).
- **Run tests:** `npm test` (Node 18+, no packages to install).
- **Run locally:** `node tools/serve.js` or any static server on the project root.
