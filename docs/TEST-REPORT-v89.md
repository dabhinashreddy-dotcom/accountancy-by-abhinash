# Test Report — v89 security audit

**Command:** `npm.cmd test` (Windows) / `npm test` — runs every suite in
process order and exits non-zero on any failure.
**Result after the audit:** **10,527 assertions + 37 independent probe
scenarios — 0 failed, 0 skipped (exit 0).**
Run repeatedly: before the first change (baseline), after each subsystem's
fixes, and as the final gate before packaging.

---

## 1. Suite results (final run)

| # | Suite | Passed | Failed | Skipped |
| --- | --- | ---: | ---: | ---: |
| 1 | Accounting-cycle regression (`run-tests.js`) | 426 | 0 | 0 |
| 2 | Calculator | 308 | 0 | 0 |
| 3 | AI tests | 152 | 0 | 0 |
| 4 | AI intelligence | 229 | 0 | 0 |
| 5 | Solver | 115 | 0 | 0 |
| 6 | Revision | 247 | 0 | 0 |
| 7 | Tutor regression | 32 | 0 | 0 |
| 8 | **Exam security** (incl. **I6** secrets) | **195** | 0 | 0 |
| 9 | **Exam rules** | **147** | 0 | 0 |
| 10 | **Exam store (behavioural)** (incl. §7 audit) | **88** | 0 | 0 |
| 11 | **Exam monitor** (incl. §K audit) | **439** | 0 | 0 |
| 12 | Exam search | 4862 | 0 | 0 |
| 13 | Exam bank / paper engine | 298 | 0 | 0 |
| 14 | Important-questions XP | 49 | 0 | 0 |
| 15 | Achievements | 147 | 0 | 0 |
| 16 | SEO/GEO | 1667 | 0 | 0 |
| 17 | UI features | 157 | 0 | 0 |
| 18 | Class system | 535 | 0 | 0 |
| 19 | **Push notifications** | **406** | 0 | 0 |
| 20 | **Push Blobs integration** | **28** | 0 | 0 |
| 21 | Independent probe — AI tutor | 18/18 scenarios | 0 | 0 |
| 22 | Independent probe — accounting cycle | 19/19 scenarios | 0 | 0 |
| | **Total** | **10,527 + 37** | **0** | **0** |

No suite contains a skip mechanism; nothing was marked pending, and no
assertion was deleted or relaxed during this audit.

## 2. What was added or extended for this audit

| Area | Suite | Added |
| --- | --- | --- |
| Calibration lifecycle, four-state face, engine re-arm, detector counters (Parts 2–4) | `exam-monitor-tests.js` | **Section K (K1–K7)**; suite total 383 → **439**; two initial K failures were test-config bugs (the multi-face clear window uses `multipleClearGapMs`), fixed by asserting through the same `CONFIG` functions production uses |
| Void/refund, cert fail-closed, server-authorized admin (Parts 5–6) | `exam-store-tests.js` | **Section 7, 18 assertions**; §5 rewritten to drive the real `examAccessVerify → fetch` wiring (503/403/200) |
| Secrets are server-side only (Part 6) | `exam-security-tests.js` | **Section I6, 14 assertions** (legacy codes absent everywhere, single call site, env-var-only server, timing-safe compare, honest offline object) |
| Delivery retry lifecycle, claims, `effectiveSentMap` (Part 8.1–8.2) | `push-notification-tests.js` | **F4b** block (claim→confirm→retry→gave-up + concurrency) and extended **E7** source assertions; **F4** mock store mirrors the real delivery ledger |
| SSRF allowlist (Part 8.3) | `push-notification-tests.js` | **C2** ~20 adversarial endpoint cases; send-time revalidation asserted at source level |
| | `push-blobs-integration-tests.js` | **I5b** stored-endpoint refusal with **no outbound probe** |
| Empty day list (Part 8.5) | both push suites | **B3** semantics + **I4b** `400 no-days-selected` round-trip |
| Weekly/site-updates enforcement (Part 8.4) | `push-notification-tests.js` | **A6.9–12** (day list + budget for weekly), **A7.6–8** (site-updates exception, both directions) |
| Real store retry lifecycle (Part 8.1) | `push-blobs-integration-tests.js` | **I8** full retry lifecycle on the real store + real client |

Harness changes (not assertion changes): `exam-store-tests.js` now executes
the **real** `exam-access-client.js` source inside its `vm` sandbox (the
client half moved out of `app.js`); `exam-monitor-tests.js` section K
temporarily shrinks `CONFIG.face` windows inside `try/finally` with
restore — production defaults are untouched and the policy table reads
`CONFIG` through functions precisely so tests and production share one
source of truth.

## 3. Mocked vs real matrix

| Layer | How it was tested | Real or mocked |
| --- | --- | --- |
| MediaPipe runtime + both models + fixture inference | `tests/exam-model-pipeline.html` in a real Chromium, **re-run 19 Oct 2026** | **REAL** — bundle 22 ms, wasm 3 ms, both models CPU, real face → 1 face, blank frame → no phone, phone photo → `cell phone @ 0.57` (camera step fails only because automation has no camera) |
| Exam pre-check gating, script wiring, SW `aba-cache-v50` (99 precached entries incl. new module), exam steps 1–3, storage round-trip check, Settings→Notifications | real browser against the shipped files via `tools/serve.js` | **REAL** (only console error: local `push-config` 404 — no functions on a static dev server) |
| Camera/mic **success** path, fullscreen granted during a real paper | — | **NOT RUNNABLE IN AUTOMATION** (no camera device; permission denied). The fail-closed path was verified instead; the success path needs any real camera-equipped browser |
| Violation engine, four-state face, calibration adoption, re-arm, persistence | `exam-monitor-tests.js` with faked video/audio sources driving the **real loop code** | Real logic, synthetic sensor input |
| Local exam store (start/paper/save/submit/void/cert/admin) | `exam-store-tests.js` executes the **real `app.js` region** + real `exam-access-client.js` in a Node `vm` | Real production code; `fetch` stubbed to play the server |
| Exam access server verdicts | real `lib/exam-access.js` loaded in-process (Node) + fetch stubs in the store suite | Real server logic, in-process env; **not** against a deployed Netlify site |
| Push scheduling/preferences/allowlist/sanitisers | `push-notification-tests.js` pure modules | Real modules, deterministic inputs (no network) |
| Push function handlers + store + retry lifecycle | `push-blobs-integration-tests.js`: **REAL `@netlify/blobs` client**, real `store.js`, real handlers, against an in-process HTTP mock of Netlify's Blobs edge; push-service sends mocked | Real client+code, **mocked platform edge and push services** |
| Live delivery to a real device, cron scheduler on Netlify, iOS Home Screen | — | **NOT VERIFIED HERE** — requires the deployed site + a device (steps in `PUSH-NOTIFICATIONS-SETUP.md` §6–8) |
| Accounting/Calculator/AI/Search/SEO/UI/Class suites | long-standing regression suites | Real code, fixtures (unchanged by this audit) |

## 4. Honest statement of what the tests do and don't prove

**Proven by this suite (deterministic, repeatable):** every policy
transition, the one-warning rule, idempotent termination, persistence
across reload, per-attempt engine freshness, four-state face routing,
independent detector counters, calibration adoption, fail-closed storage/
certificate gates, void/refund arithmetic, server-verdict-driven unlock and
admin paths (503/403/429/200 semantics), SSRF allowlist including
adversarial inputs, claim→send→confirm retry arithmetic, empty-days and
preference enforcement, and the absence of secrets in delivered files.

**Proven in a real browser (this audit):** model loading and real fixture
inference, pre-check fail-closed behaviour, the script/SW wiring, and the
absence of console errors in the exam and settings flows.

**Not proven here (stated, not hidden):** delivery to a real push service
or real device; Netlify-side deployment of the functions; the camera-grant
success path in automation; behaviour on Safari/iOS; and any claim against
a device owner who edits their own localStorage — the exam store is
local-only by design and the docs say so.

**On red-then-green:** the new tests were developed alongside the fixes.
They encode the corrected contract; they were **not** each independently
demonstrated to fail against the pre-audit code (the pre-audit tree was
not retained for A/B runs). The two behaviours with the strongest
independent evidence — the fullscreen-exit wiring and the plaintext-code
removal — are additionally pinned by source-level assertions (exam
security I3/I6) that reference the exact production call sites.

## 5. Baseline comparison

* Baseline (pre-audit tree): full suite green before any change.
* After the exam subsystem (Parts 2–7): exam suites green (monitor,
  rules, store, security), then full suite green.
* After the push subsystem (Part 8): push suites green, then full suite
  green.
* Final: full suite green — 10,527 + 37, exit 0 — and re-verified after
  documentation and packaging changes (docs are asserted by tests E10–E13).
