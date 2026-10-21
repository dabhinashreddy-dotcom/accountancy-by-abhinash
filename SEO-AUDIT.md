# ACCOUNTANCY BY ABINASH — SEO & GEO OPTIMISATION REPORT

**Site:** https://accountancybyabhinash.netlify.app/
**Scope:** complete technical + on-page + GEO optimisation of the existing codebase (no plugins, no framework rewrite).
**Academic session referenced:** CBSE 2026–27.
**Date:** 12 October 2026

---

## 1. Technical SEO issues discovered (audit)

The site is — and remains — a **single-page application** with hash-based routing (`/#journal`, `/#quiz`, …). The audit, done by reading the actual code before touching it, found:

| # | Issue | Impact |
|---|-------|--------|
| 1 | One single `index.html` — the only crawlable URL. Every chapter, quiz, revision page etc. existed only as a JS state behind a hash. | Search/AI crawlers could index essentially one page with one title. |
| 2 | Exactly **one** title & meta description (the home tags), overwritten at runtime via `document.title`. No per-route descriptions, canonicals, or social tags. | No on-page relevance for chapter queries; duplicate/absent metadata for every view. |
| 3 | **No `sitemap.xml`, no `robots.txt`, no `404.html`.** | No crawl guidance; hard errors on bad URLs. |
| 4 | `netlify.toml` had a catch-all `/* → /index.html` **status 200** rewrite. | Every nonsense URL returned 200 with the homepage — soft-404s and near-duplicate URLs. |
| 5 | Navigation was 26 `<button data-route>` controls (sidebar + bottom nav); important content was reachable only through clicks, the carousel or the internal search. | Critical pages had no crawlable link path at all. |
| 6 | No structured data anywhere. | No machine-readable page/site identity, breadcrumbs or FAQs. |
| 7 | All asset references were document-relative (`styles.css`, `data.js`, `assets/…`), and the service worker registered as `sw.js`. | Harmless only at `/`; any real sub-page URL would 404 ~20 assets and mis-scope the SW. |
| 8 | Footer had no site directory; images lacked intrinsic dimensions (`logo-full.png` 900×313 shown at 320 px); no preconnect for the third-party icon script. | Weak internal linking; layout shift; slower first connection. |
| 9 | No `lang` regionalisation (`lang="en"`), no `theme-color`/OG consistency checks, brand spelled inconsistently in places ("Abhinash" vs the actual name "Abinash"). | Minor trust/snippet inconsistencies. |

An internal checklist was built from these findings and every item was implemented in the codebase, not just reported.

---

## 2. Metadata, URL, indexing and sitemap improvements implemented

**Architecture — prerendered hybrid (chosen over a rewrite):**
- New central config **`seo-config.js`**: one registry entry per route — stable path, unique title, description, keywords, H1, lead, sections, FAQ, related links, breadcrumb trail, `noindex`/`inSitemap` flags. Single source of truth for the build, the runtime and the tests.
- **`tools/build-seo-pages.js`** generates **29 indexable pages** with real directory URLs matching the suggested patterns:
  `/`, `/class-11-accountancy/`, and `/class-11-accountancy/<slug>/` for all 18 chapters plus `quiz/`, `flashcards/`, `revision/`, `important-questions/`, `formula-sheet/`, `accounting-cycle/`, `exam-mode/`, plus `/ai-tutor/` and `/about/`.
- Each generated page carries its **own** `<title>`, meta description, meta keywords, `index,follow`, **canonical**, `og:*` and `twitter:*` tags, static breadcrumb, and prerendered crawlable content inside `#view-root` — then the existing SPA boots on top, so students lose nothing.
- **`seo.js`** keeps every tag in sync during client-side navigation (title, description, keywords, canonical, robots, OG/Twitter, breadcrumbs, and the page JSON-LD including the FAQ node). Private views (`settings`, `bookmarks`, `mistake-book`, `performance`, `practice-hub`, `certificate-view`, `more`) are explicitly `noindex` with the canonical removed — verified in-browser.
- URLs: hash still carries the route (exam guard and hashchange router untouched), while `history.replaceState` keeps the path in step, so shared links always name the page they show. Existing `/#route` links keep working; no previously public URL had to change (there were none), so **no redirects were needed**.
- **Titles**: every public route has a distinct, ≤ 75-character title ending in `| Accountancy By Abinash`, worded for real student queries (e.g. *"Rectification of Errors Class 11: Notes & Practice"*, *"Journal Entries Class 11 with Solutions"*). Raw text in config, escaped exactly once at emission — the previous double-encoding (`&amp;` showing up in social tags) is gone.
- **`sitemap.xml`**: all 29 canonical URLs, ISO `lastmod` fed from a single `releaseDate` field (not faked per-deploy), validated against the pages on disk; private routes excluded.
- **`robots.txt`**: `User-agent: * / Allow: /` + the deployed sitemap URL; no `Disallow` anywhere; no credentials.
- **`404.html`**: `noindex` + 20 crawlable recovery links (home, chapter list, all 18 chapters).
- **`netlify.toml`**: catch-all 200 rewrite **removed** (unknown URLs now genuinely 404) and a build command added (`node tools/build-seo-pages.js`) so metadata regenerates from config on every deploy.

---

## 3. Chapter & educational content improvements

- Every chapter page is prerendered with **original teaching content as plain HTML text**: a lead paragraph, descriptive H2/H3 sections, "Key concepts" definitions written to stand alone (definition-first, so a reader arriving from a search snippet understands the section without the rest of the site), worked explanations, and a **chapter-specific FAQ** based on genuine student questions (not a duplicated list).
- Home page now has real landing copy that is visible *without JS*: one clear H1, what the platform offers (notes, solved examples, 500+ quiz questions, 360+ flashcards, formula sheet, important questions, Exam Mode, Mistake Book, AI Tutor), a **crawlable index of all 18 chapters**, "How to study on this site", "Who is this for" (CBSE 2026-27 session, stated as original material, **not** an official CBSE publication), and an FAQ. The carousel still exists visually but no longer carries the page's meaning.
- Claims stayed honest: no invented citations, page numbers, endorsements, exam predictions or "official" wording; the developer credit (D. Abhinash Reddy) and the original-material disclaimer are consistent across pages, metadata and JSON-LD.
- Fixed a brand typo discovered by the tests (`Abhinash` → `Abinash` in the Ch.18 title).
- All pre-existing learning tools, banks and progress features are untouched (full test suite proves it).

---

## 4. Internal linking and structured data

**Internal links**
- 27 sidebar/bottom-nav items are now real `<a href>` anchors (public routes), intercepted by one click handler for in-app navigation — crawlers get ordinary links, students get the SPA. Remaining `<button>` nav items are only private views.
- New **footer site directory**: 29 descriptive-anchor links (all chapters + quiz, flashcards, revision, important questions, formula sheet, accounting cycle, exam mode, AI tutor, about).
- Visible **breadcrumbs** on every content page (Home → Class 11 Accountancy → page) plus per-page "related chapter" links.
- `tools/check-links.js` resolves every `href`/`src` in all 30 HTML files against disk — it caught and I fixed a wrong `/class-11-accountancy/mcq-quiz/` path (correct: `/quiz/`). No links to removed features (the retired Numerical Solver is absent everywhere).
- All asset references are now root-absolute (`/styles.css`, `/app.js`, `/assets/…`, `/sw.js`) so nested routes load correctly.

**Structured data (JSON-LD)**
- `WebSite` on home; `WebPage` + `BreadcrumbList` (+ `FAQPage` where the config has FAQs) on every public page — matching the visible title, breadcrumb and FAQ exactly, using canonical URLs. Kept in sync on client navigation.
- Deliberately **not** added: invented `Organization`, ratings/reviews, `Course`/`Product`, author credentials, or Sitelinks-searchbox markup (unsupported). No schema claims it cannot back.

---

## 5. AI-search discoverability (GEO)

- Key explanations exist as **crawlable text** with explicit headings; direct loads of any chapter URL return full content in the HTML (verified: e.g. the Rectification of Errors page ships its complete notes before JS runs).
- Definitions and worked explanations are self-contained; heading text states the answer ("What…", "How…", "Errors that Affect vs. Do NOT Affect the Trial Balance").
- Consistent canonicals, a complete sitemap, crawlable anchors, accurate titles/descriptions, and stable URLs give retrieval systems unambiguous page identity.
- No GEO myths implemented: no `llms.txt`, no fake AI-specific tags, no hidden keyword blocks, no unsupported schema; nothing blocks ordinary crawlers. AI Tutor sample answers remain presented as tutoring output, not as sourced facts.

---

## 6. Performance & accessibility changes

- Root-absolute paths fixed a real failure class (≈20 asset 404s on any nested URL) — measured clean console after the fix.
- `logo-full.png` given intrinsic `width="900" height="313"` (was layout-shifting at 320 px); other images already carry dimensions; decorative logos use `alt=""`, meaningful ones have real alt text; no broken images found.
- Added `preconnect` for unpkg (the only third-party script host); fonts already use `display=swap` with preconnects.
- Cache versions bumped for changed files (`app.js?v=57`, `seo.js?v=3`, `seo-config.js?v=2`, `certificate.js?v=15`); service-worker caching untouched and unaffected (URLs are unchanged at the root).
- Responsive/semantic baseline verified: one `<h1>` per page, logical H2/H3s, keyboard-reachable links, skip link, `lang="en-IN"`, readable contrast per existing design; mobile bottom-nav converted to crawlable links too.
- Honest limits: lucide still loads as a render-blocking `@latest` script (changing its load order risks icons); no Lighthouse/field CWV data was available in this environment, so no Core Web Vitals numbers are claimed.

---

## 7. Tests performed and results

**New suite — `tests/seo-tests.js` (added to `npm test`): 1141 assertions, 0 failed.**
Sections: config uniqueness/length/encoding → rendered metadata per page (titles, descriptions, canonical = origin+path, og/twitter parity, single H1, JSON-LD parse + URL/position/FAQ agreement, crawlable content length, breadcrumbs) → sitemap completeness/validity/exclusivity → robots rules → home head + crawlable nav counts → app.js/seo.js integration → link resolution → removed-route and honest-404 guards (including "no catch-all rewrite" and "root-absolute assets only").

**Full suite (`npm test`) — exit 0:**
426 cycle + 308 calculator + 168 AI + 237 AI-intelligence + 115 solver + 53 exam-security + 3097 search + 147 achievements + **1141 SEO** = **5692 assertions, 0 failures**; AI probe 18/18, Cycle probe 19/19.

**Browser verification (local server, real Chromium):**
- Direct loads of `/class-11-accountancy/journal/`, `/…/rectification-of-errors/`, `/…/bank-reconciliation-statement/` → correct title/canonical/OG/breadcrumb/JSON-LD, full content, **zero console errors and zero asset 404s**.
- Client navigation (footer link → journal, → revision) → title, description, canonical, OG URL, breadcrumbs and JSON-LD (incl. FAQ) all update; URL path stays truthful.
- Unknown URL → **HTTP 404** with the noindex recovery page (20 links).
- Private route `/#settings` → `noindex,follow`, canonical removed.
- HTTP checks: `/` 200, chapter 200, `/chapter` (no slash) → 301 to slash form, `robots.txt`/`sitemap.xml` 200, removed URL 404.

**Build validation:** `node tools/build-seo-pages.js` regenerates all 29 pages + sitemap + robots + 404 idempotently; `node tools/check-links.js` → "links ok — 30 HTML files checked".

One transient observation: an AI index **timing** assertion (budget 2500 ms) flaked twice while the machine was loaded (3.4 s, 5.6 s) and passes consistently at ~1100–1300 ms — load-related, not a code regression.

---

## 8. Limitations & remaining external steps

1. **Nothing is deployed or indexed by this work.** The live site changes only when this ZIP is deployed to Netlify; no Google Search Console or Bing Webmaster Tools account was available, so verification, indexing requests, IndexNow and rank/citation monitoring are **not** claimed. After deploying: submit `sitemap.xml` in GSC + Bing, and inspect 2–3 chapter URLs.
2. Search engines decide their own snippets; good source metadata is provided, display is not guaranteed.
3. No field/lab CWV data available here — run Lighthouse on the deployed site for real numbers.
4. `lucide@latest` stays unpinned and render-blocking (deliberate, to avoid icon regressions); a pinned version + deferred load is a recommended follow-up.
5. `og:image` is the shared brand icon (512×512), not per-chapter art; acceptable but could be upgraded.
6. The index-build timing test can flake on a loaded machine; consider a relative or median-based threshold later.
7. Deploying to Netlify runs `tools/build-seo-pages.js` automatically; if you deploy as plain static files instead, run it once locally first (already done — output is included in this ZIP).

---

*All educational content, progress tracking, quizzes, flashcards, exam mode, AI Tutor and other study tools were preserved and re-verified.*
