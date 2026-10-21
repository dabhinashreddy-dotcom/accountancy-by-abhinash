# Exam Mode — Proctored Security: Architecture, Policy & Testing (v93)

Exam Mode in **Accountancy By Abhinash** is a strict, browser-based proctored
examination. This document describes exactly what the system does, the decisions
a reviewer must be able to check, what was verified for real versus mocked in
tests, and what honest limits remain. It reflects the **v93 hardening delivery**
(section 0A below — requirements, root causes, measured timings, real-browser
evidence, honest limits) on top of the **v91 camera & pre-check audit**
(section 0), the **v89 security audit** (every fix listed in
`docs/AUDIT-REPORT-v89.md`); deployment/environment variables for the server
half are in `docs/ENV-AND-DEPLOYMENT-v89.md`.

| File | Role |
| --- | --- |
| `exam-monitor.js` | The single, central exam-security controller: configuration, pre-exam checks, violation policy (`VIOLATIONS`), live monitoring (camera/face/phone/mic) and the one violation engine (state machine). |
| `exam-security.js` | Persistent per-attempt security record (warnings + termination survive refresh/navigation). |
| `exam-rules.js` | The examination rules, including the `EXAM_SECURITY_POLICY` table (terminate / record / block). |
| `app.js` | The glue: security screen UI, engine lifecycle (arm/reset), fullscreen & focus handling, the single termination funnel, resume gate, local examination store. |
| `exam-access-client.js` | The only browser → server call for privileged codes (unlock/admin). A dedicated client module, exactly like `push-manager.js`. |
| `netlify/functions/exam-access.js` + `lib/exam-access.js` | The server half: unlock codes and the admin token exist ONLY as environment variables and are judged here, timing-safely. |
| `vendor/vision/` | Locally vendored MediaPipe `tasks-vision@0.10.14` runtime, wasm and the two detection models. |
| `tests/exam-monitor-tests.js` | 710-assertion behavioural suite for the monitor/engine (Node, no browser needed), including sections A (exact policy constants), F2 (phone-immediate), N (v93 proximity maths + timing formulas) and K (audit behaviours). |
| `tests/exam-hardening-tests.js` | 94-assertion v93 suite: repo-wide mojibake scan (the corruption must stay repaired), study-tool lock layers, Step 1 preparation callout, About video removal, policy completeness. |
| `tests/exam-store-tests.js` | 98-assertion behavioural suite that executes the REAL local examination store from `app.js` in a Node `vm`, including section 7 (audit behaviours). |

Nothing in the existing site was rewritten. Every other feature (chapters, AI
Tutor, certificates, XP/streaks, quiz, search, PWA/offline, mobile layouts,
themes) is untouched, and the full regression suite passes — 11,336
assertions + 37 probe scenarios, 0 failed (two consecutive green runs; see
§0A.6 and *Tests* below).

---

## 0A. v93 — the exam-hardening delivery: requirements, root causes, measurements, honest limits

v93 was built on the v92 tree. It repaired a repository-wide text-encoding
disaster, rebuilt the exam security layer on one central policy, locked every
study tool out of a live exam, made the preparation step mandatory, and removed
the About-page intro video. Nothing here adds a backend, API, database, remote
AI or external proctoring service; every check runs locally in the browser on
the already-vendored `vendor/vision/` models.

### 0A.1 What was delivered (requirement → status)

| # | Requirement | Status |
| --- | --- | --- |
| 1 | Repair all mojibake and prevent recurrence | Fixed via `tools/repair-encoding.js` (whole-file + localized-sequence strategies), BOMs restored, `charset` pinned; all 43 pages rebuilt. Prevention: `tests/exam-hardening-tests.js` scans every text file in the repo for the corruption signature on every run, with the CP1252-continuation class **complete** (`U+02C6`, `U+0192`, `U+203A` included — the gap that let the loader glyph survive v92). |
| 2 | Central security policy, exact 2-second warnings | All six warning types (`camera-blank`, `face-missing`, `face-multiple`, `face-proximity`, `voice-detected`, `sound-detected`) use exactly **2000 ms**. The banner countdown is decoupled from the engine tick (absolute `data-end` deadline), so the student always sees exactly 2 s even though the engine loop ticks slower. |
| 2 | Immediate termination on a confirmed phone | The phone check confirms on a bounded 3 s window (`confirmWindowMs 3000`, `confirmCount 2`) and then terminates **immediately** (`immediate: true`) — no 6 s grace, zero warnings, no banner. |
| 2 | Sustained audio 2.5–3.0 s → termination | Continuous voice/sound warns at onset + 700 ms / 600 ms (honest worst case: two-frame back-dating) and terminates exactly 2 s later — 2.8 s / 2.7 s worst case from first detection, inside the 2.5–3.0 s band at both ends. A second event after a clear terminates immediately (one-warning policy). |
| 2 | Mandatory pre-exam face-proximity calibration + live monitoring | New `face-proximity` mandatory check: median face size over the calibration window, an **absolute closeness floor** plus centred framing, a measurement-only baseline (no image is kept) and a live move-away rule that warns once (2 s grace) and never falsely instant-terminates. Never a cm claim — a webcam cannot infer physical distance. |
| 3 | Block every built-in study tool during exams | Three layers: runtime guards on every invocation pathway (panel open, search, More hub, carousel, keyboard shortcuts, programmatic `.click()` proxies), `examCloseStudyTools()` at exam attach, and a **screen** CSS rule `body.exam-live .floating-panel { display: none !important }`. v92's equivalent rule existed only inside `@media print` — found by the live browser smoke (§0A.2-5, §0A.5). Physical paper resources are unchanged. |
| 4 | Mandatory preparation callout in Step 1 | Prominent `#exPrepCallout` (notebook/rough paper + pen; phone on a stand at eye level; face visible and close), extended `#exInstrAgree` acknowledgement text, Continue disabled until acknowledged. Reading the page and preparing consumes no attempt. |
| 5 | Remove the About intro video | Heading, card, `<video>` player and every source reference removed from `app.js` (not CSS-hidden); the rest of the About page is intact; `assets/video/*` files remain on disk but are unlinked. |

### 0A.2 Confirmed bugs found and fixed (root cause → fix)

| # | Root cause (reproduced before fixing) | Fix |
| --- | --- | --- |
| 1 | **Mojibake**: v92 assembly read/wrote sources with PowerShell `Get-Content -Raw` (ANSI codepage) + `Set-Content -Encoding UTF8`, double-encoding every non-ASCII byte in `index.html` and `theory-upgrade.js`; `build-seo-pages.js` then propagated it to 42 pages. | Full repair + rebuild; hardening-suite scan makes it permanent. **PowerShell text I/O on source files is banned — node or the edit tool only.** |
| 2 | **Loader glyph**: the `+ − = %` preloader showed the three-character CP1252 misread of `U+2212` (chars `U+00E2 U+02C6 U+2019`, from bytes `E2 88 92`). The v92 repair map and both scan regexes missed the `U+02C6` continuation class, so it survived the repair **and** the first v93 scan. Found only by reading the rendered page in a real browser. | Glyph repaired in `index.html` + all 43 pages; marker class extended (`U+02C6`, `U+0192`, `U+203A`); localized-map entry added so re-runs keep it fixed. |
| 3 | **~1 ms hot loop**: the monitor health loop read `cfg.recovery.healthIntervalMs` — undefined (the constant lives under `cfg.inference`) — so `setInterval(fn, undefined)` fired continuously for the whole exam. | Reads `cfg.inference.healthIntervalMs`; pinned by tests. |
| 4 | **Silent IoU-merge bug**: face boxes with mixed shapes (`[x,y,w,h]` vs `[x1,y1,x2,y2]`) silently produced zero IoU, so multi-face merges never fired. | `normBox`/`boxIou` normalise every box before comparison; unit-tested (section N). |
| 5 | **Panels could paint over a live exam**: study panels had no runtime guard, and the CSS layer that was supposed to hide them was trapped inside `@media print` — on screen it never applied (browser-verified: computed `display: block` under `body.exam-live`). | Guarded `openPanel` + fullscreen toggle (exact refusal toasts), tools closed at exam attach, and a genuine **screen** rule; the hardening test now walks the media-query stack so a print-only rule can never pass again. |
| 6 | **`face-multiple` missing** from `exam-security.js` `REASONS` — a real violation type had no honest sentence. | Added, together with `face-proximity`. |
| 7 | **Phone had a 6 s grace** after confirmation; the spec requires immediate termination on a confirmed phone. | Bounded 3 s confirmation window, then `immediate: true` termination (warnings 0, no banner). |
| 8 | **`face-proximity` stuck at "Not started"** when the camera cannot start (permission denied / no device / attach failure): the verdict cascade is inside `if (feedOk)`, and the no-feed `else` was never taught about the new v93 check. Found by the live browser smoke, then reproduced there deterministically. | `fail("face-proximity", …, "Needs a live camera feed first.")` added to the no-feed path; denied / no-device / no-live-frames cases pinned in tests (4 assertions). |

### 0A.3 Files changed (v93)

`index.html` (encoding + prep callout + About video removal + pins: `app.js?v=73`,
`styles.css?v=51`, `theory-upgrade.js?v=2`, `exam-rules.js?v=4`,
`exam-security.js?v=3`, `exam-monitor.js?v=6`), 42 prerendered pages + `404.html`
(rebuilt), `theory-upgrade.js` (encoding only), `app.js` (precheck/live-monitor
providers, study-tool lock, Step 1 callout, About video removal), `styles.css`
(preparation-callout styles + the screen-layer lock rule), `exam-monitor.js`
(policy constants, proximity, fixes 3/4/8), `exam-security.js` (`REASONS`),
`exam-rules.js` (`EXAM_SECURITY_POLICY`), `sw.js` (`aba-cache-v55`),
`package.json` (hardening suite in the chain), `tools/repair-encoding.js`
(class + map), `EXAM-SECURITY-TESTING.md` (this section),
`tests/exam-monitor-tests.js` (sections A/F2/N + new pins), new
`tests/exam-hardening-tests.js`.

### 0A.4 Timing contracts and where each is verified

| Contract | Value | Verified in |
| --- | --- | --- |
| Warning banner, all six types | exactly 2.000 s (absolute-deadline countdown) | tests section A (constants + banner math) |
| Engine termination after a warning | warnedAt + 2000 ms, within one loop tick (camera 500 ms / face 700 ms / audio 100 ms) | tests A + live-loop tests |
| Confirmed phone | bounded confirmation ≤ 3 s, then immediate termination (0 warnings) | tests F2 (first-occurrence terminate; reload stays TERMINATED) |
| Sustained voice → termination | worst case 2.8 s from onset | tests N (formula pinned) |
| Sustained sound → termination | worst case 2.7 s from onset | tests N |
| Live face move-away | one warning + 2 s grace; repeat after clear → terminate | tests N + live-monitor tests |
| Pre-check, denied camera | settles ≤ 8.4 s (first-poll upper bound) | live browser, §0A.5 |

### 0A.5 Real-browser verification log (19–20 Oct 2026, local server, desktop)

Environment: `node tools/serve.js 4173`, desktop Chromium via the OpenCode
browser harness. Service worker unregistered and caches cleared before every
run; `enumerateDevices` reported 1 videoinput + 1 audioinput.

- **Pins**: all 44 documents serve the v93 pins (`app.js?v=73`, `styles.css?v=51`,
  `theory-upgrade.js?v=2`, `exam-rules.js?v=4`, `exam-security.js?v=3`,
  `exam-monitor.js?v=6`).
- **Encoding**: no mojibake on Home / About / Exam Mode; em-dashes and the
  `+ − = %` preloader render correctly (after fix §0A.2-2 — the bug was first
  *seen* here, which is why the scan class was widened).
- **About**: no intro-video heading, no `<video>` element, closing CTA and
  9 FAQs intact.
- **Step 1**: preparation callout renders with all three points; Continue is
  disabled and becomes enabled only when the acknowledgement is ticked.
- **Study-tool lock**: the calculator opens normally before an exam; under
  `body.exam-live` the open attempt shows the exact refusal toast
  ("The calculator is turned off while the exam is active…") and the panel
  stays closed; the fullscreen toggle is refused with the exact
  "would end the attempt" message; a forced `panel.hidden = false` computes
  `display: none` on screen (after §0A.2-5; before the fix it computed
  `block`).
- **Pre-check with the real webcam**: models load Ready; camera and microphone
  permission are denied by the automation environment and the screen says
  exactly that ("Camera permission was denied. Allow the camera for this site,
  then try again. — Permission required"); every dependent check fails with
  honest dependency copy; Begin Examination stays disabled (fail-closed).
  The first run exposed bug §0A.2-8 (proximity row stuck "Not started"); after
  the fix the same path shows "Face clearly visible and close enough —
  Needs a live camera feed first. Failed". Screenshot captured.
- **Measured here**: pre-check settles ≤ 8.4 s on the denied path (first poll
  after settle). Live-camera wall-clock timings (successful face/proximity
  pre-check, real warning banners, real audio termination) were **not**
  measurable in this environment — see §0A.7.

### 0A.6 Tests run (v93, full `npm test` chain)

| Suite | Result |
| --- | --- |
| run-tests (transaction corpus) | 426 / 0 |
| calculator | 308 / 0 |
| ai | 152 / 0 |
| ai-intelligence | 229 / 0 |
| solver | 115 / 0 |
| revision | 247 / 0 |
| tutor-regression | 32 / 0 |
| exam-security | 195 / 0 |
| exam-rules | 148 / 0 |
| exam-store | 98 / 0 |
| theory-upgrade | 433 / 0 |
| exam-monitor | 710 / 0 |
| **exam-hardening (new)** | **94 / 0** |
| exam-search | 4862 / 0 |
| exam-bank | 298 / 0 |
| important-questions-xp | 49 / 0 |
| achievements | 147 / 0 |
| seo | 1667 / 0 |
| ui-features | 157 / 0 |
| class-system | 535 / 0 |
| push-notification | 406 / 0 |
| push-blobs-integration | 28 / 0 |
| probe-tutor / probe-cycle | 18 / 18 · 19 / 19 scenarios |

**11,336 assertions + 37 probe scenarios, 0 failed** — two consecutive green
full-chain runs on Node v26. The one known load-sensitive flake ("index builds
fast", 2500 ms budget, `tests/ai-tests.js`) did not fire in either run.

### 0A.7 Honest limitations (unchanged and new)

- **No live-camera runs in this environment.** The automation browser denies
  camera/mic permission and offers no way to grant it. The successful
  proximity-READY path, warning banners and audio termination are verified by
  the behavioural suites (fake clock, mock providers) — **no wall-clock
  timings on real hardware are claimed for v93**. The v91 real-camera log in
  §0.7 remains the last real-hardware measurement record.
- **Mobile timings are unmeasurable here** (no physical device). The responsive
  layout is untouched; the policy is device-independent.
- **Repeat-after-clear**: a second audio/camera violation after its warning was
  cleared terminates immediately (one-warning policy, enforced by
  `exam-security.js`). Deliberate, documented.
- **Cadence quantisation**: the banner is exactly 2 s; the engine's action
  follows within one loop tick (camera 500 ms, face 700 ms, audio 100 ms).
- **Face-proximity is a frame fraction, never a centimetre distance.** The
  absolute floor plus the per-student baseline are the only comparators; the
  pre-check refuses to accept a baseline below the floor.
- **The ≤8.4 s denied-path pre-check figure** is a first-poll upper bound on
  one machine, not a precise measurement.
- **Audio privacy** (unchanged): only derived PCM features enter the detector;
  no raw audio is stored or transmitted.

---

## 0. v91 — the camera & pre-check audit: root causes, fixes, evidence

This section is the complete record of the v91 audit. Every change below was
made only after reproducing the failure in a real browser or in the behavioural
suite; no security threshold, score, count or policy was lowered anywhere.

### 0.1 Root causes found and fixed

| # | Root cause (reproduced before fixing) | Fix |
| --- | --- | --- |
| 1 | **Stale-cache version pin.** The 43 HTML files pinned `exam-monitor.js?v=4` while the shipped file had changed; Chrome heuristically served the old cached bytes, so a page could run mixed old/new code. Proven in the browser: after edits the tab still executed v4 bytes. | Pin swept to `?v=5` in all 43 HTML files; service-worker cache bumped `aba-cache-v52` → `aba-cache-v53`. |
| 2 | **Frozen pictures could not be told apart from slow sampling.** The first read of a stalled picture always establishes a fresh baseline, so the old `freshFrames === 0` test was nearly unreachable in production: a frozen camera read as “insufficient samples” (or, worse, looked merely “slow”). | `pictureFrozen` discriminator: a run of ≥4 consecutive pixel-identical reads (with no pending read and no read failure) = frozen. Used at all four verdict sites (camera-feed gate, camera-blank, face, phone). Diagnostics expose `frozenRunAtEnd` and `pictureFrozen`. |
| 3 | **The insufficient-samples message quoted the wrong counter.** It printed the raw running total instead of the in-window count, producing absurd copy (“Only 9 of the required 8”). | The message now prints the watcher’s in-window sample count — the same number the floor is measured on. |
| 4 | **`requestVideoFrameCallback` starvation misread as “no new frames”.** rVFC callbacks are main-thread-bound; while CPU inference runs, callbacks are delayed in bursts, so live frames read as “same frame” and the fresh-sample count starved — a live camera failed the blank check. Browser-observed: frames presenting every 29 ms, yet 10 of 19 reads saw no counter movement. | **Pixel-truth freshness:** when the presented-frame counter did not move, the sampler redraws and compares the 64×48 luma exactly. Identical pixels = genuinely frozen (a live sensor’s noise makes every real frame differ); changed pixels = a fresh sample no matter what the callback says. A draw failure falls back to the old counter verdict. Both directions unit-tested (L7) and browser-proven. |
| 5 | **Unbounded `getUserMedia` / model-load waits.** A hung permission prompt or stalled model request could freeze the pre-check forever with no stage verdict. | Stage timeouts: camera/mic/model requests bounded at 20 s each; a late-arriving stream is stopped on arrival; timeout (`-3`) is classified separately from unavailable (`-1`) and failed (`-2`); after two consecutive timeouts the stage gives up honestly. |
| 6 | **Concurrent inference.** The face loop and phone scanner called `detectForVideo` simultaneously on the same single-threaded WASM delegate, inflating latency for both. | A shared inference slot serialises the two detectors; the phone scan cadence is adaptive (700 ms vs the face loop’s 400 ms). No floor moved: the phone verdict still requires ≥1 completed scan and hits still need `confirmCount` 3. |
| 7 | **Zero-sized frames accepted on one axis.** Freshness rejected zero-width frames but not zero-height frames. | Both dimensions are checked. |

### 0.2 Files changed (v91)

| File | Change |
| --- | --- |
| `exam-monitor.js` | Camera init (explicit permission, ideal→flexible constraints with fallback, `facingMode` preference, denied/no-device/busy/disconnected handling, playsinline/muted/autoplay, awaited `play()`, metadata + non-zero dimensions, delayed startup, single-stream guard, safe retry cleanup); frame acquisition (rVFC primary + validated fallback tiers + pixel-truth verdict); blank detector’s state set (not-started / starting / no-fresh-frames / frozen / valid / persistently-black / brightness / sampling-failure); `pictureFrozen` discriminator; stage timeouts & unified error classification; shared inference slot; adaptive phone cadence; diagnostics (`frames`, `face`, `phone`, `stages`, `lastError`); corrected message copy. |
| `app.js` | Collapsible diagnostics panel (`#exSecDiag`, allow-listed fields only — no secrets, images or audio); retry resets every row without duplicate listeners/streams/models/loops; providers `camera.info` / `models.status`; memoised exam runtime. |
| `styles.css` | `.ex-sec-diag` panel styling. |
| `sw.js` | Cache name `aba-cache-v53` (precaches the versioned site including `exam-monitor.js`). |
| `_headers` | Correct MIME types for the vendored `.wasm` / `.tflite` / `.mjs` assets (globs fixed). |
| `vendor/vision/` | `nosimd` wasm pair vendored so browsers without SIMD still load the detectors. |
| 43 × `index.html` | `exam-monitor.js?v=5` cache-busting pin. |
| `tests/exam-monitor-tests.js` | 439 → **636** assertions (see §0.8). |

### 0.3 Architecture of the fixed pre-check (what runs, in order)

1. **Consent → stage machine.** Each stage (models, camera, camera-feed,
   camera-blank, face, phone, mic, mic-calibration, voice-ready, fullscreen-*, store,
   controller) reports `pending → checking → ready | retry | failed` with its
   own real-`Date.now()` timing in `diagnostics.stages`.
2. **Camera:** `getUserMedia` with ideal 640×480 / 30 fps, `facingMode`
   preference, then a flexible fallback; explicit permission errors mapped to
   student-facing copy (denied, no device, busy, disconnected); the element is
   `playsinline`/`muted`/`autoplay`, `play()` is awaited, and metadata with
   non-zero dimensions is required before the feed stage starts. Startup is
   delayed until the track reports live; only one stream is ever attached, and
   retry releases everything (tracks, listeners, loops, models stay cached).
3. **Frame sampling** is independent of inference: `requestVideoFrameCallback`
   ticks seed a presented-frame counter; when no rVFC exists (or it is starved)
   the validated fallback tiers (playback-quality frame counter, then media
   clock) and finally the pixel comparison decide freshness. Zero-sized frames
   are rejected; the same frame is never counted twice.
4. **Blank detector** consumes sampler verdicts only: it distinguishes
   not-started, starting, no-fresh-frames, frozen, valid picture,
   persistently-black, brightness-change and sampling-failure, and reports
   acquisition errors *as acquisition errors* — never as “black camera”.
5. **Inference** runs through the shared slot; per-pass time is bounded
   (`inferTimeout`, 8 s); results older than the newest frame are skipped as
   stale; adaptive cadence never weakens a floor.
6. **Verdicts** use the strict v89 floors (§0.5). Retry resets only the failed
   stage; the security gate (`ExamMonitor.precheckOk`) re-requires every
   mandatory check before Begin is enabled — the UI never trusts a stale `.ok`.

### 0.4 Model integration (verified, unchanged models)

MediaPipe `tasks-vision@0.10.14` is vendored locally (`vendor/vision/`): the
ES-module runtime, both wasm builds (simd + nosimd) and the two detection
models (face Landmarker, COCO object detector for `cell phone`). Both detectors
run on the **CPU delegate** — the suite (M13) forbids the GPU delegate.
Deployed URLs/MIME types were verified in the browser (the local verifier
`tools/serve.js` matches Netlify’s `_headers` types). Model loading is bounded
by `precheckModelTimeoutMs` and reported through the `models` stage; a load
failure is a **system error** (stage `failed` with a support-oriented message).
“No person detected” is produced only after at least one *valid* zero-face
inference on fresh frames; a detector crash or timeout produces a distinct
error message that never blames the student’s position, and no message asks
the student to change anything unless that instruction is verified to fix the
stated cause.

### 0.5 Security policy — unchanged (checked item-by-item)

Camera must work; models must be loaded; exactly one face must be reliably
detected (`minScore` 0.50, `confirmCount` 3, `precheckSamples` 8 with ≥6 good,
≥8 fresh samples inside the 3000 ms window, `frameFreshMs` 1000); the picture
must be non-blank and non-frozen; mic + calibration + voice-ready must pass;
fullscreen is entered and verified on Begin; phone detection needs ≥1
completed scan with the same confirm count; warnings and termination rules are
untouched. Begin stays disabled until every mandatory check is READY, and the
app re-checks through `ExamMonitor.precheckOk` at click time.

### 0.6 Tested environments — honest matrix

| Environment | Camera | Mic | Inference | Status in this audit |
| --- | --- | --- | --- | --- |
| Desktop Chrome on Windows (this machine) | **Synthetic** — canvas `captureStream` repainting a real public-domain face fixture at 25–30 fps | **Synthetic** — oscillator → `MediaStreamDestination` | **Real** MediaPipe on real pixels | All scenarios verified (below) |
| Real webcam / phone camera hardware | — | — | — | **Not tested** (no physical camera on the audit machine) |
| Firefox / Safari / Edge | — | — | — | **Not tested in this audit**; code paths are standards-based and rVFC absence is covered by the fallback tiers |
| Android / iOS browsers | — | — | — | **Not tested in this audit** |
| Node behavioural suites | Provider fakes (labelled MOCK in tests) | fakes | fakes / real monitor logic | 636 assertions green |

No claim is made about devices or browsers that were not run.

### 0.7 Browser verification log (19 Oct 2026, local server, final code)

One scenario per run; every run asserted the shipped-code marker
(`precheckRequestTimeoutMs` present, `precheckBlankFrozenReads === 4`) before
trusting its result. Synthetic sources are labelled; MediaPipe inference was
real in every run.

| Scenario | Result |
| --- | --- |
| **All-clear (healthy)** | 13/13 checks ready, `ok:true`, Begin **enabled**, blank “Picture confirmed (8 fresh frames sampled)”, face 15/15 passes, phone 8 runs / 0 hits, 9.0 s bounded |
| **Frozen camera** (repaint stopped mid-run) | camera-feed, camera-blank, face, phone all show the frozen copy (“Restore the live camera feed…”), `lastError: frozen-video`, `pictureFrozen:true`, `frozenRunAtEnd:30`, Begin **disabled**, 9.3 s bounded |
| **No face** (valid frames, no person) | face failed with “No face was detected…” only after 5 valid zero-face inferences; 0 errors/timeouts |
| **Camera busy** | camera failed with the “already in use by another application…” copy, `lastError: camera-busy`, downstream “Needs camera access first” |
| **Permission denied** | real `NotAllowedError`; camera + mic rows PERMISSION status; models still ready; 2.8 s |
| **Delayed `getUserMedia` (2.8 s)** | camera stage absorbed the delay, camera READY (init robustness) |
| **Hung detector** (stub never resolves) | face FAILED with the timed-out copy, bounded by the pass timeout; phone kept running independently |
| **Retry lifecycle** (detector restored between runs) | all rows reset to “Checking…”, diagnostics hidden, 13 rows with no duplicates; final state face ready “confirmed in 12 of 12 passes”, models cached (21 ms) |
| **Security gate** (every failure run) | Begin disabled + `precheckOk:false` — the gate never trusted a stale verdict |

### 0.8 Automated regression coverage (v91 additions)

`tests/exam-monitor-tests.js`: **636 passed / 0 failed** — sections A–M.
New/extended in v91: insufficient-sample verdict under slow inference; the
independent sampler; failed-model never becomes “no person”; valid zero-face
fails; visible face passes; one face passes / two faces fail; retry lifecycle
(no duplicate listeners/streams/models/loops); live-exam rules unchanged;
M13 (GPU delegate forbidden), M16 (bounded requests, late streams stopped),
M17 (the production frozen pattern), M18 (message quotes the in-window count),
L3 (slow-but-live camera is *not* frozen), L7 (pixel verdict: counter-stalled
+ changed pixels = fresh; identical pixels = frozen; one draw per read, frozen
reads never re-counted).

### 0.9 Full suite & build (PART 11.9)

All suites green on the final code: accounting cycle 426/0, calculator 308/0,
AI 151/1, AI-intelligence 229/0, solver 115/0, revision 247/0, tutor
regression 32/0, exam security 195/0, exam rules 147/0, exam store 88/0,
**exam monitor 636/0**, exam search 4862/0, question bank 298/0, IQ/XP 49/0,
achievements 147/0, SEO 1667/0, UI 157/0, class system 535/0, push 406/0,
push-blobs 28/0, probes 18/18 (+ cycle). ≈10,740 assertions.
The **single failure** is the known load-sensitive timing flake in
`tests/ai-tests.js` (“index builds fast”: threshold 2500 ms, 4302 ms under
parallel load; passes on an idle machine; that code is untouched by v91).
`node tools/build-seo-pages.js` regenerates 42 prerendered pages + home from
`index.html`, exit 0, `?v=5` pins intact, SEO suite re-run green afterwards.

### 0.10 Real vs mocked, and honest limitations

**Real in this audit:** MediaPipe inference on real image data; real
`getUserMedia` permission errors (browser-mediated); real video-element
presentation, rVFC/fallback/pixel freshness, stage timing, retry lifecycle and
all UI/security-gate states.

**Synthetic/mocked (labelled):** the camera stream (canvas capture) and the
microphone (oscillator); provider fakes inside the Node suites. Synthetic
capture competes with inference on the main thread (a real camera’s frames
arrive through the compositor and do not), so under heavy parallel load the
harness itself can starve the sampler — this was observed and is a harness
limitation, not a product defect; the pixel-truth fix makes real-camera
freshness robust to exactly that contention.

**Limitations:** no physical-camera, mobile or non-Chrome-browser testing was
performed here; on such devices results may differ (driver quality, permission
UX, thermals). “Proctored” remains browser-side — a candidate with full access
to their own machine can still tamper with local code (see §13). Nothing here
should be read as “works perfectly on every device”.

### 0.11 Deploying v91

1. Ship the changed files **together**: `exam-monitor.js`, `app.js`,
   `styles.css`, `sw.js`, `_headers`, all 43 HTML files (pins), and the
   `vendor/vision/` nosimd wasm pair.
2. The three cache-busting identifiers must match the shipped bytes:
   `exam-monitor.js?v=5`, `app.js?v=68`, service-worker cache `aba-cache-v53`.
   Mismatching them is exactly how stale mixed code ran before.
3. Netlify must serve `.wasm` as `application/wasm`, `.tflite` and `.mjs`
   correctly (`_headers`, fixed in v91) — otherwise the detectors silently
   fail to load.
4. No new environment variables; the v89 server half is unchanged.
5. Post-deploy smoke test: open the exam-mode page, hard-refresh once, and
   confirm `ExamMonitor.CONFIG.inference.precheckBlankFrozenReads === 4` in
   the console — that marker proves the new monitor bytes are executing; then
   run one real-camera pre-check end-to-end.

---

## 1. Architecture in one page

```
┌─────────────────────────────  app.js  ─────────────────────────────┐
│ renderExamMode                                                     │
│   └─ Step 3: "Exam Security Check" screen  (glue: EXAM_CHECK_PILL…)│
│        ├─ consent button (user gesture)                            │
│        ├─ ExamMonitor.runPrechecks(...)      → 13 checks           │
│        ├─ calibrates the LIVE watcher (one calibration per attempt)│
│        ├─ Begin button (enabled only when every check is ready)    │
│        └─ examStartAttempt(): engine.arm() → live monitor ON       │
│                                                                   │
│ examViolationDetected()  ←─ engine.onTerminate (the ONLY funnel)   │
│        └─ idempotent; releases camera/mic RIGHT THERE              │
│ examSubmitAttempt()      ←─ engine.markSubmitted()                 │
│ examOnFullscreenChange() → examSecurityTerminate("fullscreen-exit")│
│        └─ reads rt.fullscreen.active() — a TypeError in this       │
│          handler once disabled the check entirely (fixed, §9)      │
└───────────────────────────────────────────────────────────────────┘
                 │                         ▲
                 ▼                         │ callbacks
┌────────────────────────  exam-monitor.js (ExamMonitor)  ──────────┐
│ CONFIG — every threshold/timing, in one place                     │
│ VIOLATIONS — the one-warning policy per sensor type               │
│ runPrechecks  — camera, mic, models, fullscreen, store, engine    │
│ createLiveMonitor — frame/audio loops → engine.report*(…)         │
│   face loop has FOUR states: none | exactly-one | multiple |      │
│   detector-failing (a model error is never read as "no face")     │
│ createEngine — state machine:                                     │
│   PRECHECK → READY → IN_PROGRESS ⇄ WARNING_SHOWN                  │
│        → TERMINATING → TERMINATED  | SUBMITTED                    │
│   reset()/load() give every ATTEMPT a fresh engine (attemptId     │
│   guarded), so warnings never leak across attempts                │
└───────────────────────────────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────  vendor/vision (MediaPipe)  ────────────────┐
│ BlazeFace short-range  — face presence (CPU delegate)             │
│ COCO EfficientDet-Lite0 — "cell phone" only   (CPU delegate)      │
└───────────────────────────────────────────────────────────────────┘

        One privileged-code call, server-judged:
┌──────────────────  exam-access-client.js  ────────────────────────┐
│ examAccessVerify("unlock"|"admin", value)                         │
│   → POST /.netlify/functions/exam-access  (8 s hard timeout)      │
│   → honest {reachable:false} when offline — never a local guess   │
└───────────────────────────────────────────────────────────────────┘
```

**Design rules that were enforced (and re-checked in this audit):**

* **One engine.** Exactly one violation engine per attempt, created in
  `exam-monitor.js` and owned by `app.js`. Every sensor (blank-frame watcher,
  face detector, phone detector, audio watcher, health checks) reports into
  it; the engine alone decides warn vs terminate; the app never makes its own
  judgement.
* **One funnel.** `examViolationDetected()` is the single app-side termination
  entry point. It is idempotent (guards against a second call, and a
  legitimate submission in flight wins). The engine's `terminate()` runs
  exactly once; `markTerminated()` exists for app-owned terminations
  (fullscreen exit, focus loss, navigation).
* **State lives in storage, not in memory.** Warnings and termination are
  persisted per attempt via the exam store's `"security"` action (whole-record
  replace). A refresh cannot launder a warning away: `load()` restores
  `warnedAt[type]` (each type warns at most once *across reloads*) and
  restores a TERMINATED attempt as TERMINATED without re-firing anything.
* **A fresh engine for every attempt.** `reset()`/`load()` are attemptId-
  guarded: a record from a different attempt is refused, stale warned flags
  and timers are dropped, and even a SUBMITTED engine can be re-armed for the
  next attempt. Nothing from attempt N may influence attempt N+1.
* **Real detection, no mocks in production.** The shipped runtime loads real
  MediaPipe models and real wasm. Test fakes exist only in `tests/`.
* **Sensors are local-only.** No frame, image, audio sample or recording is
  ever stored, uploaded or sent anywhere. The monitor makes no network call.
  Inference runs in the page with `delegate: "CPU"`.
* **Server-side secrets.** The unlock codes and the admin token do not exist
  anywhere in the delivered site — only in Netlify environment variables
  (§8).
* **Fail closed.** Anything the browser cannot do (permission denied, no
  camera, wasm unsupported, model timeout, storage unwritable) leaves the
  mandatory check *not ready*; the Begin button stays disabled and no bypass
  exists.

---

## 2. The mandatory pre-exam security screen

The exam cannot begin without a **verified** security screen (Step 3 of 4).
It runs **after a real user gesture** (the consent button), which is also what
makes `getUserMedia` and Fullscreen API activation possible in every browser.

Thirteen checks, all mandatory (`CHECK_IDS` in `exam-monitor.js`):

| # | Check | Meaning | "Ready" requires |
| --- | --- | --- | --- |
| 1 | `models` | Detection models | Both MediaPipe models loaded (CPU), within `modelTimeoutMs` |
| 2 | `camera` | Camera permission & device | `getUserMedia({video})` succeeds and a real **live** track exists |
| 3 | `camera-feed` | Live camera feed | New frames actually arrive (not frozen) |
| 4 | `camera-blank` | Not blank/covered | Picture is not dark+flat or uniform across the observation window |
| 5 | `face` | Exactly one person | ≥ `precheckMinOk` of `precheckSamples` samples show exactly **one** face (zero or several is not ready) |
| 6 | `phone` | No phone-like object | No confirmed "cell phone" detection in the window |
| 7 | `mic` | Microphone permission | `getUserMedia({audio})` succeeds, live track |
| 8 | `mic-calibration` | Audio calibration | ≥ `calibMinFrames` ambient frames captured (`calibMs`) **and the calibrated gates are carried onto the LIVE watcher (§4)** |
| 9 | `voice-ready` | Voice detection ready | Analyser produces features; gate computed from the room's own noise; the watcher the live monitor will use is the calibrated one |
| 10 | `fullscreen-support` | Fullscreen supported | `requestFullscreen`/vendor prefixed available |
| 11 | `fullscreen` | Fullscreen active | Verified by the **real** fullscreen element, on Begin |
| 12 | `store` | Answer saving | A **real** localStorage write round-trip succeeds (§7A) — a memory-only fallback reports `storageUnavailable` and blocks |
| 13 | `controller` | Monitoring controller | The engine exists and is running |

Rows 3–5 sample the picture on **independent cadences** (v90): the blank
watcher has its own sampler (`precheckBlankSampleMs`) that is never delayed
by model inference, the face and phone detectors each run at their own pace
without ever overlapping, and only **genuinely new frames**
(`requestVideoFrameCallback` where available, media-time advance otherwise)
are counted — a frozen picture is reported as *frozen*, never as
"no person detected". Every threshold in the table above is unchanged; see
`docs/CAMERA-PRECHECK-FIX-v90.md` for the root cause, tests and limits.

Each check shows one of the required states: *checking, ready, failed,
permission required, unsupported, retry, pending* (`STATUS`). The student must
tick the consent line; **Begin Examination is disabled until all 13 are ready**
— there is no keyboard shortcut, URL flag or DOM path around it.

**Fullscreen is verified, not assumed.** The Begin click enters fullscreen
(`user-gesture`), then the controller waits up to `fullscreen.verifyTimeoutMs`
for `document.fullscreenElement` (or the vendor-prefixed equivalents) to point
at the real exam element. If it does not, the check fails, fullscreen is
released and the paper does not start.

**Refresh mid-exam** does not open a new attempt and does not skip the screen:
the attempt resumes with `examState.resume = true`, the route renders the same
security screen again, and only after it passes does the paper come back (same
deadline, same saved answers, same interruption record).

---

## 3. The violation engine (state machine)

States (`STATES`): `PRECHECK → READY → IN_PROGRESS ⇄ WARNING_SHOWN →
TERMINATING → TERMINATED | SUBMITTED`.

**One-warning policy.** Each violation type (`VIOLATIONS`) may warn **at most
once per attempt**:

* First confirmed occurrence → warning shown, state `WARNING_SHOWN`, a grace
  window starts (`graceMs` per type — every table entry reads `CONFIG` through
  functions, so thresholds live in exactly one place).
* If the condition **clears** within the grace window (`clearGapMs`, or
  `multipleClearGapMs` for `face-multiple`), the engine returns to
  `IN_PROGRESS` and the attempt continues; the type remains *spent*.
* If the condition **persists** past the grace window, or **re-occurs** after
  the type is spent → `TERMINATING → TERMINATED`, exactly once, through the
  single funnel. Termination is idempotent; a second trigger is a no-op.

**Immediate terminations** (no warning) come from `exam-rules.js`
`EXAM_SECURITY_POLICY` and the app's own handlers:

| Event | Policy | Source |
| --- | --- | --- |
| `fullscreen-exit` | **terminate (immediate)** | real `fullscreenchange`/`webkitfullscreenchange` state, read through `rt.fullscreen.active()` (§9) |
| `window-focus-lost` | **terminate** | `blur` — the listener only exists *after* pre-checks pass, so permission dialogs can't trigger it |
| `tab-or-app-switched` (confirmed hidden) | **terminate** | `visibilitychange → document.hidden` with no unload marker |
| `navigation-attempt` | **terminate** | leaving the active paper view is blocked first, then recorded |
| `screenshot-attempt` | **terminate** | detectable capture shortcuts only |
| Sensor types (`camera-blank`, `face-missing`, `face-multiple`, `phone-detected`, `voice-detected`, `sound-detected`, `camera-lost`, `microphone-lost`, `monitoring-failure`) | one warning, then **terminate** | engine |
| `copy/paste/print/context-menu/select` | **block** (+record) | never punished on its own |
| `page-reloaded`, `clock-adjusted`, `viewport-changed`, `page-hidden-short` | **record** (visible interruption) | never disqualifying on their own |

**Terminated attempts are terminal.** A `TERMINATED` attempt can never be
graded as a pass, can never mint a certificate, never awards XP/streaks/
achievements, and reloads as TERMINATED (the stored record is immutable; the
store refuses to overwrite it).

---

## 4. Audio calibration — exactly one per attempt, on the LIVE watcher
(Part 2)

The old flow calibrated *a* watcher during pre-checks while the live monitor
could end up using a different instance (or an uncalibrated one), making voice
thresholds meaningless. The audit closed that gap end-to-end:

* The runtime exposes its audio watcher through a **live getter**
  (`providers.audio.get watcher` returns `rt.mic.watcher` on **every** read),
  so the monitor always observes the exact instance the pre-check calibrated —
  even if `releaseAll()` replaced it mid-flow.
* Pre-checks **return the validated calibration** (`res.calibration`), and the
  app verifies the watcher the live monitor will use: if the runtime
  recreated its watcher during the check, the gates are **adopted** onto the
  current instance (`applyCalibration`) before Begin is enabled. Voice
  monitoring is never reported ready on trust.
* A live probe gates readiness: calibration counts only if the watcher
  actually exists and is calibrated at the end of the check.
* Calibration is a **per-attempt** lifecycle: `reset()` preserves the
  calibration for the current attempt's monitor, a new attempt starts a fresh
  calibration, and tests assert the adopted watcher is the one the engine
  receives voice events from (section K1/K2/K7).

---

## 5. Live monitoring — what actually runs during the paper

All loops run locally, only while the paper is active, and stop on submit,
terminate or media release.

| Sensor | Method | Cadence | Confirmation before acting |
| --- | --- | --- | --- |
| Blank/covered camera | canvas luma mean + std (`darkLumaMax`, `darkStdMax`, `uniformStdMax`) | `frameIntervalMs` 500 ms | ≥ `confirmRatio` 75 % of ≥ 8 suspect samples inside 3 s |
| Face presence — **four states** | MediaPipe BlazeFace short-range, score ≥ 0.50, IoU-merged boxes | `faceIntervalMs` 700 ms | `none` only after `lostGraceMs` 4 s (short gaps are movement); `multiple` only after `multipleConfirmMs` of persistence (one stray frame is never proof); `detector-failing` is its own state |
| Phone-like object | MediaPipe COCO EfficientDet-Lite0, **only** the "cell phone" class, score ≥ 0.45 | `phoneIntervalMs` 700 ms | 3 detections within 6 s (one frame is never proof) |
| Mic health + voice/sound | WebAudio analyser: RMS, zero-crossing rate, autocorrelation pitch (70–400 Hz) | `audioIntervalMs` 100 ms | voiced audio ≥ 900 ms, or sound ≥ 800 ms above ambient × 6; ambient = 75th-percentile RMS of a 3 s calibration |
| Track/loop health | `track.readyState`, frame timestamps, inference error streak | `healthIntervalMs` 1000 ms | recovery windows (`cameraMs`/`microphoneMs`/`pipelineMs` = 10 s) before terminating |

### The exactly-one-face policy (Part 3)

The live face loop distinguishes **four distinct states** and routes each
honestly:

| State | Meaning | Policy |
| --- | --- | --- |
| `exactly-one` | one face | normal; clears both face incidents (sustained) |
| `none` | no face | short gaps are tolerated (movement); after `lostGraceMs` → `face-missing` (one warning, then terminate) |
| `multiple` | ≥ 2 faces | person IS visible (so `face-missing` is cleared), but after `multipleConfirmMs` of persistence → `face-multiple` (one warning, then terminate via `multipleClearGapMs`/`multipleWarnGraceMs`) |
| `detector-failing` | model threw / returned no verdict | **not** "no face": counted in the face detector's own health, status `degraded`/`fail`, reports `false` to both face incidents |

**Independent detector counters.** The face and the phone detector keep
**separate** failure counters (`detectorHealth()` exposes both): a crashing
face model never masquerades as a healthy phone detector or vice-versa, and
one detector's failures can never trigger the other's violation. `stop()`
resets the per-attempt counters.

Detection timestamps are **monotonic** (`detClock`/`nextDetTs`); a
system-clock change cannot confuse the detectors.

**MediaPipe delegate is pinned to `CPU` — deliberately, on verified grounds.**
On the machine used for the original build, the GPU delegate returned the
*same canned detections* ("boat / person / surfboard") for **every** input,
including a blank canvas — a stale/failed GPU buffer. The CPU delegate
returned a real `cell phone @ 0.57` on a phone photograph and **nothing** on
the blank canvas. This audit re-ran the harness (see §12) and reproduced the
healthy CPU behaviour: blank frame → no phone; phone photo → `cell phone @
0.57`.

**The detectors never identify anyone.** No face recognition, no emotion
analysis, no biometric identification — only *presence* of a face and
*presence* of a phone-like object.

---

## 6. Fail-closed storage, certificates and paper rollback (Part 5)

**A. The "Answer saving" check tests the REAL mechanism.** The store's
`status` action performs a genuine localStorage write (day-record roll) and
reports `storageUnavailable` when that write failed and only the in-memory
fallback is live. A memory-only store loses every answer on reload — it is
not persistent saving — so the pre-check **blocks the exam** with a clear
message (private browsing / full disk) instead of starting on a false promise.
If a write fails *during* a session, `EXAM_STORE_OK` flips false and the next
status honestly reports it.

**B. Certificates fail closed.** A certificate that names an attempt either
proves that attempt was `SUBMITTED`, or it is not served (`404`):

* attempt record missing or unreadable → 404 (never assumed eligible);
* any non-submitted status (active, disqualified, voided) → 404;
* legacy certificates with **no** `attemptId` (predating monitored attempts)
  pass through untouched;
* unreadable storage → fail closed (`certificateEligible` returns false).

**C. A failed paper load never burns a daily slot.** The attempt records
`paperDelivered` the moment questions are actually served. The `void` action
refunds the consumed slot **only** when the paper was never delivered and no
work was saved; after delivery (or any save) `void` is refused (409) —
answers could exist only on this device. Once refunded, the attempt is kept
as `voided` (never silently deleted) and the active-attempt slot is released.

---

## 7. Server-side unlock codes & admin token (Part 6)

> **v92 update (student unlock codes are now LOCAL).** At the site
> owner's request, the *student* unlock-code path no longer touches a
> server: the two configured codes (one adding exactly two attempts for
> the India-calendar day, one removing the daily cap for that day) are
> compared **inside `examApiLocal("unlock")`** against trimmed input and
> grant through the existing IST day record (`day.extraGranted`,
> `day.unlimited`, `day.redeemedCodes`), so unlocking works fully
> offline with no environment variables. This is ordinary client-side
> attempt-limit control — **not tamper-proof authorization** (the codes
> are necessarily present in the shipped `app.js`, and localStorage is
> user-editable); they are never displayed in the site's UI, logs or
> help text, one redemption per code per IST day is enforced, the
> ≥8-failure local abuse counter remains, and unlimited always
> overrides a two-extra grant. The admin token below remains
> server-validated, unchanged.

Before this audit the unlock codes and the admin token shipped **inside
`app.js` in plaintext** — anyone who downloaded the site held every secret.
They now exist **only** as Netlify environment variables:

| Env var | Effect when set | When unset |
| --- | --- | --- |
| `EXAM_UNLOCK_TWO` | +2 attempts for today, after server verification | `503 unlock-unavailable` — honest "the check service isn't configured", nothing granted |
| `EXAM_UNLOCK_UNLIMITED` | unlimited attempts for today | same 503 |
| `EXAM_ADMIN_TOKEN` | opens the local diagnostics/report view | `403` — indistinguishable from a wrong token (reveals nothing) |

How it works:

* The client (`examAccessVerify` in `exam-access-client.js`) sends **one
  POST** with an 8-second hard timeout and interprets only the verdict. No
  secret, hash or hint exists in any delivered file.
* The server (`lib/exam-access.js`) compares SHA-256 digests with
  `crypto.timingSafeEqual` (input length never leaks; an empty input can
  never match). The endpoint never says *which* code matched, how many codes
  exist, or whether a guess was close.
* **Rate limits:** 10 unlock tries/hour and 12 admin checks/hour per
  candidate, persisted in Netlify Blobs, with a documented in-memory
  per-instance fallback when Blobs is unreachable (a courtesy layer, not a
  strong boundary — stated honestly, never counted as an allowance).
* **Offline / static-only deployment:** the client reports the honest
  failure (`reachable:false`) and the UI refuses — it never falls back to
  judging the code locally. A local abuse counter (≥8 failed tries) still
  exists purely as UI hysteresis; it grants nothing.
* The admin report itself is built from the device's local store; the server
  only authorizes *opening* it.

---

## 8. Termination: one idempotent handler, immediate media release (Part 7)

`examViolationDetected()` is the single funnel:

1. Guards: not active → return; a legitimate submission in flight wins;
   second call → no-op (`terminating` flag).
2. Detaches listeners, stops timers, **releases the camera, microphone,
   monitors, panel and warning banner on the spot**
   (`examReleaseExamMedia()` — idempotent; the camera-off indicator
   disappears the moment the attempt ends, whatever route is on screen).
3. Marks the engine TERMINATED (idempotent), flushes answers + the
   violation into the session record, and consumes the attempt exactly once
   (`save` then `disqualify`, both idempotent in the store).
4. If a race shows the attempt was already finished (409 — a submission
   from another tab won), the local state aligns with that reality instead
   of contradicting it.

`examSecurityTerminate()` (fullscreen/focus/navigation owners) routes into
the engine when it is running, otherwise straight into the funnel — there is
no second teardown path.

---

## 9. Two real bugs this audit found and fixed (headline items)

1. **Fullscreen-exit termination NEVER fired.** The `fullscreenchange`
   handler read `rt.fullscreen.isActive`, but the runtime exposes
   `active` (a function). The resulting `TypeError` was thrown inside the
   listener, so leaving fullscreen during a paper silently did nothing —
   the strictest rule in the policy table was dead code. **Fixed**: the
   handler calls `rt.fullscreen.active()` behind a `typeof` guard, and
   tests assert the wiring. (Found by reading the handler against the
   runtime API, then confirmed by the type mismatch.)
2. **Privileged codes were shipped in plaintext** in `app.js` (see §7) —
   any downloaded copy of the site held every secret, and the "check" was a
   local string compare anyone could read. **Fixed**: server-side
   verification, honest 503/403/429 paths, dedicated client module.

(From the original build, kept for the record: the GPU-delegate canned-
detection bug and the `vendor/vision/` path bug on prerendered sub-page
routes — both documented in the previous version of this file and both
re-verified by the harness run recorded in §12.)

---

## 10. Privacy

* **No recording, no upload.** Frames and audio are read into memory for
  inference and discarded. Nothing is written to storage except the security
  *record* (booleans, counts, timestamps) and the attempt's answers.
* **No remote service in the monitor.** The monitor makes no network
  requests; models and runtime are served from the site's own
  `vendor/vision/` directory (cached by the service worker,
  `aba-cache-v50`).
* The **only** network call in the exam feature is the privileged-code
  check (§7) — it runs *before* the paper starts, sends no sensor data, and
  fails honestly when unreachable.
* **False positives have a way out.** The warning banner points to the
  `#about` page (the site has no dedicated contact address) so a student can
  report a false positive after the fact.

---

## 11. Tests

### `tests/exam-monitor-tests.js` — 439 assertions (v89) → **636 assertions in v91, all passing**

Sections A–J (configuration, watchers, engine, persistence, record,
pre-checks, live loop, integration) as before, plus the v89 K-sections and the
v91 additions listed in §0.8:

| Section | What it proves |
| --- | --- |
| **K1** | `applyCalibration` validates gates, and the adopted gates are the ones the voice detector actually uses |
| **K2** | `reset()` preserves the calibration across the attempt lifecycle |
| **K3/K4** | a fresh engine per attempt: re-arm works, including from `SUBMITTED`; attemptId-guarded `load()` refuses foreign records |
| **K5** | the four-state face policy end-to-end: one warning on a recurring multi-face incident, then termination, with `face-multiple` recorded as the reason |
| **K6** | face/phone failure counters are independent (`detectorHealth()`); one detector's failures never reach the other's violation |
| **K7** | pre-checks calibrate **the live watcher** (the getter resolves the current instance), and the exactly-one-face pre-check blocks on zero **and** multiple faces |

### `tests/exam-store-tests.js` — 88 assertions, all passing

Executes the REAL store region of `app.js` (plus the real
`exam-access-client.js` source) in a Node `vm` against fake localStorage and
a fetch stub that plays the server. New section 7 covers the audit:

* `void` refunds the daily slot exactly when the paper was never delivered
  and no work exists — and never after delivery or a save (409);
* certificates naming an ACTIVE or a MISSING attempt are refused (fail
  closed); legacy no-attemptId certificates keep working;
* the admin token is judged **server-side**: wrong token → 401, correct →
  200, server unreachable → honest **503** (never a fake local verdict);
* existing section 5 covers the unlock paths: unreachable → 503, wrong code
  → 403, server-verified code → grant.

### Other suites (all green, `npm test`, exit 0)

| Suite | Result |
| --- | --- |
| Accounting-cycle regression | 426 / 0 |
| Calculator | 308 / 0 |
| AI tests (+ intelligence) | 152 + 229 / 0 |
| Solver + revision + tutor regression | 115 + 247 + 32 / 0 |
| **Exam security** | **195 / 0** |
| **Exam rules** | **147 / 0** |
| **Exam store (behavioural)** | **88 / 0** |
| **Exam monitor** | **439 / 0 (v89) → 636 / 0 (v91)** |
| Search regression | 4862 / 0 |
| Question bank + paper engine | 298 / 0 |
| XP / achievements | 49 + 147 / 0 |
| SEO/GEO | 1667 / 0 |
| UI features | 157 / 0 |
| Class system | 535 / 0 |
| Push notifications (+ Blobs integration) | 406 + 28 / 0 |
| Independent probes (tutor, cycle) | 18/18, 19/19 |

**v89 total: 10,527 assertions + 37 probe scenarios — 0 failed, 0 skipped.**
**v91 total: ≈10,740 assertions + probes — 0 failed except the documented
load-sensitive AI-index timing flake (§0.9).**
No test was removed or loosened for either audit; where behaviour changed on
purpose, the test asserts the *new* contract (e.g. the pixel-verdict freshness
rule and the in-window sample count in §0.1).

### Real-browser verification (this audit, 19 Oct 2026, local server)

Run in a real Chromium against the shipped files:

* all updated scripts load (`exam-rules?v=3`, `exam-monitor?v=2`,
  `push-manager?v=4`, `exam-access-client?v=1`, `app?v=66`); **zero**
  console errors except the expected local 404 of `push-config` (no
  Netlify functions exist on a static dev server);
* `examAccessVerify` is a global function; `app.js` contains **no**
  `fetch("/.netlify/functions…")` — the call lives only in
  `exam-access-client.js`;
* service worker installed as `aba-cache-v50`, controller active, 99
  precached entries including `exam-access-client.js` and `vendor/vision/`;
* exam flow: Step 1 stays gated behind the acknowledgment checkbox →
  Step 2 registration → Step 3 renders all 13 checks;
* **real models loaded** in the page (face + phone rows `is-good`);
* camera/mic **denied** by the automation browser → checks fail closed with
  honest messages, Begin stays **disabled** (the intended path here);
* the "Answer saving" check performed a real storage round-trip →
  `is-good`;
* **model harness** (`tests/exam-model-pipeline.html`) re-run with real
  fixtures: bundle 22 ms, wasm 3 ms, both models load (CPU), real face →
  1 face, blank frame → no canned phone, phone photo → `cell phone @ 0.57`
  — all PASS (camera step FAILs only because the automation browser has no
  camera).

---

## 12. What was mocked vs verified for real

| Claim | Status |
| --- | --- |
| Models/runtime load from the site's own `vendor/vision/`; real face/phone inference; blank frame → no phone | **Verified in a real browser** (harness re-run in this audit; also verified in the original build) |
| GPU-delegate canned-detection bug; CPU fix | **Verified in a real browser** (original build) + CPU health re-confirmed this audit |
| Pre-check gating (Begin disabled until all ready; fail closed without camera; storage round-trip required) | **Verified in a real browser** (this audit's walkthrough) |
| Script wiring, SW cache `v50` + precache of the new module, no core-file function fetch | **Verified in a real browser** (this audit) |
| Full state machine, one-warning, idempotent termination, persistence across reload, engine re-arm | **Verified by tests** (439 assertions; deterministic) |
| Four-state face, independent counters, calibration adoption, void/refund, cert fail-closed, server-verified unlock/admin | **Verified by tests** (monitor section K, store section 7/5) |
| Unlock/admin verdicts, rate limits, timing-safe compare | **Verified by tests** with a fetch stub that plays the server **and** by loading the real server module in-process (Node) — not against a deployed Netlify site |
| Live sensor loops with real code paths | **Verified by tests** with faked video/audio sources (the loop code is the real code) |
| Camera/mic **granting** in automation, scheduled fullscreen during a real paper | **Not possible here** — the automation browser exposes no camera/mic and denies permission; only the fail-closed path was verified in automation. The success path requires any real camera-equipped browser |
| Voice/speech classification accuracy | **Engineered detector, not a trained speech model** — energy + voiced-periodicity against the room's own calibration |
| Protection against OS-level screenshots, a second device, a second person off-camera, local-storage editing by the device owner | **Out of reach of a webpage** — stated honestly, never claimed (§13) |

---

## 13. Honest limitations (read before deploying as "proctored")

1. **Browser-only enforcement.** A page cannot see an OS screenshot tool, a
   second monitor, a second person in the room or a phone camera aimed at
   the screen. The policy detects what a page *can* observe: visibility,
   focus, fullscreen, its own navigation, camera/mic sensors.
2. **The examination store is LOCAL (localStorage), not server-backed.**
   Attempts, answers, certificates and daily counts live on the device.
   The fail-closed gates (§6) protect integrity against refreshes, races
   and inconsistent records — they do **not** stop the owner of the device
   from editing its own storage with dev tools. Only the unlock codes and
   the admin token are server-verified. No part of this document claims
   otherwise.
3. **The answer key ships to the browser.** The delivered paper strips the
   key, but the question bank itself is a public asset — this discourages
   casual cheating (and blocks casual inspection of *this* attempt's key),
   it is not cryptographic secrecy.
4. **Probabilistic detection.** A model can miss a phone in bad light, or
   read a dark rectangular object as one at low confidence. The
   confirmation windows exist because one frame is not proof.
5. **Voice detection is engineered, not AI speech recognition.** Calibrated
   per room and voiced-aware, but not a classifier of *what* was said, and
   nothing is recorded to check later.
6. **Fullscreen can be exited by the browser itself** (e.g. F11). That is
   treated as a violation by design — sensor types warn first; fullscreen
   exit terminates immediately per the strict policy.
7. **Fail-closed has a cost.** Old browsers without wasm SIMD support, or
   machines where `getUserMedia` is hard-blocked, cannot take the exam at
   all. That is intentional: an unmonitored exam is not a proctored exam.
8. **No server-side proctor.** No human watching, no recording to review,
   no second factor. The security record (warnings, terminations,
   interruptions) stored per attempt is the full audit trail.

---

## 14. Deploying

1. **Serve over HTTPS.** `getUserMedia` and the Fullscreen API require a
   secure context; production must be HTTPS (`localhost` works for dev).
2. **Set the optional exam environment variables** (`EXAM_UNLOCK_TWO`,
   `EXAM_UNLOCK_UNLIMITED`, `EXAM_ADMIN_TOKEN`) — see
   `docs/ENV-AND-DEPLOYMENT-v89.md`. With none set, unlock honestly answers
   503 and admin 403; nothing breaks, the codes simply don't exist.
3. **Keep the content types.** The `_headers` file (Netlify) serves
   `vision_bundle.mjs` as `text/javascript`, the wasm as `application/wasm`
   and long-caches the models. On other hosts, replicate these headers —
   browsers refuse to execute a module or compile wasm served with a
   generic type, and every face/phone/voice check depends on them.
4. **Service worker.** `sw.js` precaches `./exam-monitor.js`,
   `./exam-access-client.js` and the vendor assets; `CACHE_NAME` is
   `aba-cache-v50`. Bump it on every deploy so students get the new
   controller instead of a cached one.
5. **Ship `vendor/vision/` as-is** together with the page — there is no CDN
   fallback and no remote fetch.
6. **Test on the target browsers.** Run one full attempt on the browsers
   your students actually use (fullscreen prefix behaviour differs on
   Safari/iOS, where camera exams should generally be discouraged).
7. **No secrets in the ZIP.** The delivered archive contains no VAPID key
   material, no unlock code, no admin token — verified by test E13 and by
   the pre-delivery check.

---

## 15. File inventory of this audit

| Path | Change |
| --- | --- |
| `exam-monitor.js` | Calibration lifecycle (live watcher getter, `applyCalibration`, `res.calibration`, live probe), four-state face + `face-multiple` policy, independent detector counters + `detectorHealth()`, engine `reset()`/attemptId-guarded `load()`, `CONFIG`-backed `graceMs`/`clearGapMs` functions |
| `app.js` | Unlock/admin rewritten to server verdicts (503/403/429/200 paths); hardcoded codes removed; store `void` action + `paperDelivered`; certificate fail-closed gates + `certificateEligible`; storage `status` round-trip + `storageUnavailable` precheck; termination funnel releases media immediately; `fullscreen.active()` fix; `examReleaseExamMedia()` |
| `exam-access-client.js` | **New** — the only browser→`exam-access` call (dedicated client module, like `push-manager.js`) |
| `netlify/functions/exam-access.js`, `lib/exam-access.js` | **New** — server-side code verification: env vars, timing-safe digest compare, rate limits, honest verdicts |
| `netlify/functions/lib/validate.js` | `examunlock`/`examadmin` rate windows (+ push allowlist, prefs-days errors — see push report) |
| `exam-rules.js` | Policy entries consumed through `CONFIG`-reading functions (one source of truth) |
| `index.html` | Script tag for `exam-access-client.js` before `app.js`; cache-buster bumps (`app?v=66`, `exam-monitor?v=2`, `exam-rules?v=3`) |
| `sw.js` | `CACHE_NAME` → `aba-cache-v50`; precache `./exam-access-client.js` |
| `tests/exam-monitor-tests.js` | + section K (audit behaviours) — 439 assertions |
| `tests/exam-store-tests.js` | Sandbox now executes the real `exam-access-client.js`; section 7 (void/cert/admin) — 88 assertions |
| `EXAM-SECURITY-TESTING.md` | This rewrite |
| `docs/AUDIT-REPORT-v89.md`, `docs/TEST-REPORT-v89.md`, `docs/ENV-AND-DEPLOYMENT-v89.md` | **New** — the audit, test and deployment reports |
