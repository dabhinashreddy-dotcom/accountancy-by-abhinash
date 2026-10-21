# Delivery report — v93: exam security hardening + encoding repair

**Project:** Accountancy By Abinash (Class 11 Accountancy, fully static, API-free)
**Package:** `accountancy-by-abhinash-v93-exam-security-hardening.zip`
**Built on:** the v92 tree (`accountancy-by-abhinash-v92-navigation-theory-unlock.zip`)
**Prepared:** October 2026

Everything below was actually executed. Where a check was not run or a
measurement could not be taken, it says so.

---

## 1. What was delivered

1. **Mojibake repair + prevention.** v92 assembly had read/wrote sources with
   PowerShell `Get-Content -Raw` (ANSI) + `Set-Content -Encoding UTF8`,
   double-encoding `index.html` and `theory-upgrade.js`, which
   `build-seo-pages.js` then propagated to 42 pages. All repaired
   (`tools/repair-encoding.js`), BOMs restored, all 43 pages rebuilt.
   Prevention: `tests/exam-hardening-tests.js` scans every text file in the
   repo for the corruption signature on every test run, with the complete
   CP1252-continuation class (incl. `U+02C6`, `U+0192`, `U+203A`).
2. **Exam security rebuilt on one central policy** (all in-browser, local,
   vendored MediaPipe models — no backend/API/DB/remote AI/external proctoring):
   - exact **2.000 s** warnings for camera-blank, face-missing,
     face-multiple, face-proximity, voice and sound (banner countdown decoupled
     from the engine tick via an absolute deadline);
   - **confirmed phone → immediate termination** (bounded 3 s confirmation
     window, `immediate: true`, zero warnings — no 6 s grace);
   - **sustained audio 2.5–3.0 s → termination**: worst case 2.8 s (voice) /
     2.7 s (sound) from onset, computed and pinned in tests section N;
   - **mandatory pre-exam face-proximity calibration + live monitoring**:
     absolute closeness floor + centred framing + per-student measurement-only
     baseline (never a cm claim); live move-away warns once, then terminates
     on a repeat.
3. **Every built-in study tool blocked during an active exam**, three layers:
   runtime guards on all invocation pathways, tools closed at exam attach,
   and a screen CSS rule (`body.exam-live .floating-panel { display: none
   !important }`). Paper resources unchanged.
4. **Mandatory preparation callout in Step 1 of 4** (notebook/pen; phone on a
   stand at eye level; face visible and close), extended `#exInstrAgree`
   acknowledgement; Continue disabled until acknowledged; viewing consumes no
   attempt.
5. **About-page intro video removed entirely** (heading, card, player, source
   references — not CSS-hidden). `assets/video/*` files remain on disk,
   unlinked.

## 2. Confirmed bugs found and fixed

| # | Bug (root cause) | Fix |
|---|---|---|
| 1 | Mojibake from PowerShell ANSI text I/O during v92 assembly (+ SEO propagation) | Full repair + rebuild; hardening-suite scan; **PowerShell text I/O on sources banned** |
| 2 | Loader glyph `U+2212` corrupted to a 3-char CP1252 sequence; escaped the v92 repair **and** the first v93 scan (missing `U+02C6` class) — found by reading the rendered page in a real browser | Glyph repaired in all 43 pages; marker class widened; repair map extended |
| 3 | Monitor health loop read `cfg.recovery.healthIntervalMs` (undefined) → `setInterval(fn, undefined)` = ~1 ms hot loop for the whole exam | Reads `cfg.inference.healthIntervalMs`; pinned by tests |
| 4 | Face boxes with mixed shapes silently produced zero IoU (multi-face merges never fired) | `normBox`/`boxIou` normalisation; unit-tested |
| 5 | Study panels had no runtime guard, and the CSS hiding rule existed **only inside `@media print`** (browser-verified: computed `display: block` on screen) | Runtime guards + close-on-attach + a real screen rule; the test walks the media-query stack so a print-only rule can never pass again |
| 6 | `face-multiple` missing from `exam-security.js` `REASONS` | Added (+ `face-proximity`) |
| 7 | Phone termination had a 6 s grace | Bounded confirmation, then immediate termination |
| 8 | `face-proximity` check stuck at "Not started" when the camera cannot start (verdict cascade sits inside `if (feedOk)`; the no-feed `else` never learned the new check) — found by the live browser smoke | Fails honestly ("Needs a live camera feed first"); denied/no-device/no-frames cases pinned in tests |

## 3. Files changed

`index.html` (+42 pages + 404 rebuilt), `theory-upgrade.js` (encoding only),
`app.js`, `styles.css`, `exam-monitor.js`, `exam-security.js`, `exam-rules.js`,
`sw.js` (`aba-cache-v55`), `package.json`, `tools/repair-encoding.js`,
`EXAM-SECURITY-TESTING.md` (new §0A), `docs/DELIVERY-REPORT-v93.md` (this
file), `tests/exam-monitor-tests.js`, new `tests/exam-hardening-tests.js`.

Version pins: `app.js?v=73`, `styles.css?v=51`, `theory-upgrade.js?v=2`,
`exam-rules.js?v=4`, `exam-security.js?v=3`, `exam-monitor.js?v=6`,
SW `aba-cache-v55`.

## 4. Tests run

Full `npm test` chain, Node v26.9.0 — **11,336 assertions + 37 probe
scenarios, 0 failed**, two consecutive green end-to-end runs (the known
load-sensitive "index builds fast" flake did not fire). Key suites:
exam-monitor 710/0, **exam-hardening 94/0 (new)**, exam-security 195/0,
exam-rules 148/0, exam-store 98/0, seo 1667/0, search 4862/0, push 406/0 +
28/0, probes 18/18 + 19/19. `tools/repair-encoding.js` re-run as a final
guard: no markers anywhere.

## 5. Real-browser verification (desktop, local server)

Service worker unregistered, caches cleared; 1 camera + 1 mic present.
Verified live: v93 pins on all 44 documents; no mojibake anywhere; preloader
glyphs correct; About video gone (no heading, no `<video>`); Step 1 callout
with all three points and the Continue gate; study-tool lock (refusal toast,
panel stays closed, fullscreen refused, forced-visible panel computes
`display: none` on screen); pre-check with the **real webcam** — models
Ready, camera/mic permission denied by the automation environment and
reported honestly, dependent checks fail with dependency copy, Begin stays
disabled; after fix #8 the proximity row shows an honest Failed instead of
"Not started". Screenshot captured.

**Measured:** denied-path pre-check settles ≤ 8.4 s (first-poll upper bound,
one machine).

## 6. Honest limitations

- **No live-camera wall-clock runs were possible in this environment**
  (the automation browser denies camera/mic permission and cannot grant it).
  The proximity-READY path, warning banners and audio termination are covered
  by the behavioural suites (fake clock, mock providers) — no real-hardware
  timings are claimed for v93. The v91 log in `EXAM-SECURITY-TESTING.md` §0.7
  remains the last real-hardware measurement record.
- **Mobile timings unmeasurable** (no physical device); layout untouched.
- **Repeat-after-clear** on a cleared audio/camera violation terminates
  immediately (one-warning policy) — deliberate and documented.
- **Cadence quantisation:** the banner is exactly 2 s; the engine's action
  follows within one loop tick (camera 500 ms / face 700 ms / audio 100 ms).
- **Face proximity is a frame fraction, never a centimetre distance.**
- No push-notification, PWA, chapter, tutor, certificate, XP or class-system
  behaviour was changed; those suites all pass unchanged.
