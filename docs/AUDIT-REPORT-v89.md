# Security & Reliability Audit — v89 (Exam Security + Web Push)

**Scope.** The two subsystems named in the brief: the Web Push
Notification System and the Exam Security System of
`accountancy-by-abhinash` (base: the v89 proctored-exam build). Only
required files were modified; chapters, AI Tutor, certificates, XP/streaks,
quiz, themes, mobile layouts, navigation and the PWA/offline behaviour are
untouched, and the full test suite passes before and after
(`docs/TEST-REPORT-v89.md`).

**Method.** Every finding below was confirmed by reading the shipped code
(and, where possible, by a test or a real-browser run that demonstrates the
behaviour). Each fix is accompanied by tests that encode the corrected
contract. Nothing was weakened or removed to make the suite green; where
test harnesses changed, they now execute *more* of the real code (see the
test report).

**Naming.** This build supersedes the previous deliverable. Deliverables:
new ZIP, `EXAM-SECURITY-TESTING.md`, `PUSH-NOTIFICATIONS-SETUP.md`, this
report, `docs/TEST-REPORT-v89.md`, `docs/ENV-AND-DEPLOYMENT-v89.md`.

---

## Part 2 — Audio calibration: one lifecycle per attempt, demonstrably live

| | |
| --- | --- |
| **Confirmed problem** | Pre-checks calibrated *a* audio watcher, but the live monitor resolved its watcher independently. If the runtime recreated the watcher (e.g. a `releaseAll()` race during the check), voice detection ran **uncalibrated** — thresholds derived from a different (or no) ambient sample. Nothing proved the calibrated instance was the one the engine would hear. |
| **Root cause** | Instance capture instead of live resolution; no adoption step; readiness reported on trust. |
| **Fix** | `providers.audio` exposes a **live getter** (`get watcher() { return rt.mic.watcher; }`); pre-checks return `res.calibration`; before Begin is enabled the app verifies the *current* watcher is calibrated and **adopts** the validated gates onto it (`applyCalibration`) if it was recreated; a live probe gates readiness; `reset()` preserves the calibration for the attempt. |
| **Files** | `exam-monitor.js` (`applyCalibration`, precheck result, probe), `app.js` (getter, adoption block). |
| **Tests** | `exam-monitor-tests.js` K1 (adoption + gates actually used by voice detection), K2 (reset preserves calibration), K7 (pre-checks calibrate THE live watcher). |

## Part 3 — Exactly-one-face policy: four states, independent counters

| | |
| --- | --- |
| **Confirmed Problem** | (a) During the paper, the live loop only distinguished *face present* vs *face missing* — **two or more faces was "present" and therefore fine**, although the pre-check demanded exactly one: a second person could sit down mid-exam undetected. (b) A detector exception/no-verdict was processed like an ordinary sample — a failing model could be misread as "no face". (c) Face and phone detector failures shared bookkeeping. |
| **Root cause** | Policy modelled before the audit: presence-only; no per-detector health. |
| **Fix** | The face loop now has **four distinct states** — `none`, `exactly-one`, `multiple`, `detector-failing`. `multiple` must persist `multipleConfirmMs` before it is confirmed (one stray frame is never proof), then follows the standard one-warning-then-terminate policy as the new `face-multiple` violation (its own `multipleWarnGraceMs` / `multipleClearGapMs` windows); `detector-failing` reports *no* violation and counts in the **face detector's own health**. Face and phone keep independent failure counters exposed via `detectorHealth()`; `stop()` resets them per attempt. |
| **Files** | `exam-monitor.js` (face loop, `VIOLATIONS["face-multiple"]`, `detectorHealth`, `noteDetectorFailure/Success`). |
| **Tests** | K5 (recurring multi-face → exactly one warning → termination recording `face-multiple`), K6 (counter independence), K7 (pre-check blocks on zero **and** multiple faces), plus policy-table coverage in section A. |

## Part 4 — Fresh engine lifecycle per attempt

| | |
| --- | --- |
| **Confirmed Problem** | The engine was not guaranteed fresh per attempt: `warned` flags, timers and status from attempt N could leak into attempt N+1 (suppressing a first warning or firing a spurious termination), and `load()` accepted any stored record. |
| **Fix** | `reset()` returns the engine to a clean per-attempt state (calibration kept, detectors/health cleared); `load()` is **attemptId-guarded** — a record naming a different attempt is refused, a TERMINATED record restores as TERMINATED without re-firing, and even a SUBMITTED engine can be re-armed for the next attempt. |
| **Files** | `exam-monitor.js` (engine `reset`/`load`/arm), `app.js` (`examArmSecurityEngine` call sites). |
| **Tests** | K3 (re-arm from every state), K4 (SUBMITTED re-armable; attemptId guard), F/F2 (existing state-machine + persistence suites). |

## Part 5 — Fail-closed storage, certificates, paper-load rollback

| | |
| --- | --- |
| **Confirmed problem A** | The mandatory "Answer saving" pre-check did not test the real storage mechanism. With localStorage unavailable (private browsing, quota), the store silently ran from **memory**: the check passed, the exam ran, and every answer vanished on reload. |
| **Fix A** | `status` performs a genuine localStorage write (day-record roll) and reports `storageUnavailable` when persistence failed; the pre-check blocks the exam with an actionable message; `EXAM_STORE_OK` tracks later failures honestly. |
| **Confirmed problem B** | Certificate eligibility was not fail-closed: a certificate record could be served while the attempt it names was **active** (or its record missing/unreadable) — a `404` should be the only answer for anything not proven `SUBMITTED`. |
| **Fix B** | `cert` gate: any `attemptId` must resolve to a `submitted` attempt or the certificate is refused (404); missing/unreadable record → 404; disqualified/active/voided → 404; unreadable storage → `certificateEligible()` false; legacy certificates with no `attemptId` keep working. |
| **Confirmed problem C** | A paper load that failed after `start` had already consumed the daily slot burned it permanently — no rollback existed. |
| **Fix C** | Attempts record `paperDelivered` when questions are actually served; a new **`void`** action refunds the slot **only** when no paper was delivered and no work was saved (guarded against underflow and same-day rollover); after delivery or any save, `void` is refused (409). The attempt is kept as `voided`, never deleted. |
| **Files** | `app.js` (store `status/save/void/cert`, `certificateEligible`, precheck provider). |
| **Tests** | `exam-store-tests.js` §7 (refund, refused void after delivery/save, cert fail-closed ×2, legacy cert, admin verdicts), §1–6 (happy path, idempotent submit, injected-certificate refusal); pre-check blocking in `exam-monitor-tests.js` §H (store broken → `beginOk()` false). |

## Part 6 — Unlock/admin secrets moved server-side (no obfuscation)

| | |
| --- | --- |
| **Confirmed Problem (critical)** | The unlock codes and the admin token were **hardcoded in `app.js`** — every downloaded copy of the site contained every secret, and "verification" was a local string comparison the student could read. |
| **Fix** | New server function `netlify/functions/exam-access.js` + `lib/exam-access.js`: codes exist only as env vars (`EXAM_UNLOCK_TWO`, `EXAM_UNLOCK_UNLIMITED`, `EXAM_ADMIN_TOKEN`); comparison uses SHA-256 digests with `crypto.timingSafeEqual` (length never leaks, empty input can never match); the endpoint reveals nothing about which/how many codes exist. Verdicts: `200 {grant}` / `403 invalid` / `429 rate-limited` (10 unlock + 12 admin per hour per candidate, Blobs-backed with a documented in-memory fallback) / `503 unlock-unavailable` when unset / admin unset indistinguishable from wrong (403). The client (`examAccessVerify` in the new `exam-access-client.js`) sends one POST with an 8 s timeout and **fails honestly offline** — no local judgement path exists. The local ≥8-failure counter remains purely as UI hysteresis and grants nothing. |
| **Files** | `netlify/functions/exam-access.js`, `netlify/functions/lib/exam-access.js`, `netlify/functions/lib/validate.js`, `exam-access-client.js` (new), `app.js` (unlock/admin actions rewritten to verdict-driven grants), `index.html` (script tag), `sw.js` (precache). |
| **Tests** | `exam-store-tests.js` §5 + §7 (unreachable → 503, wrong code → 403, correct → grant, offline admin → 503 not fake 401), `exam-security-tests.js` **I6** (legacy codes absent from every delivered file, the single call site is the client module, the server reads env vars and compares timing-safely), `ai-tests.js` G (core shell files still contain **zero** `fetch("/.netlify/functions…")` — the call lives only in the dedicated client module, mirroring `push-manager.js`), `push-notification-tests.js` E13 (no key material anywhere in the repo). |

## Part 7 — One idempotent termination handler, immediate media release

| | |
| --- | --- |
| **Confirmed Problem (critical)** | `examOnFullscreenChange` read `rt.fullscreen.**isActive**` while the runtime exposes `active` (a function). The `TypeError` threw **inside the event listener**, so **fullscreen-exit termination never fired** — the strictest rule in the policy table was dead code in production. |
| **Fix** | The handler calls `rt.fullscreen.active()` behind a `typeof` guard; termination routes through `examSecurityTerminate()` → engine/funnel only. |
| **Confirmed Problem 2** | Camera/microphone streams were released only on the *next render* after termination — the webcam indicator could stay on after an attempt ended. |
| **Fix 2** | The single funnel `examViolationDetected()` now calls `examReleaseExamMedia()` (idempotent: stops the live loops, removes the panel/banner, `releaseAll()` the streams) **immediately**, before any store I/O. The funnel guards: not-active → no-op, submission-in-flight wins, `terminating` flag blocks re-entry; `disqualify` in the store is idempotent; a 409 (another tab already finished the attempt) aligns local state instead of contradicting it. |
| **Files** | `app.js` (`examOnFullscreenChange`, `examViolationDetected`, `examReleaseExamMedia`, `examSecurityTerminate`). |
| **Tests** | `exam-monitor-tests.js` §I/J (funnel wiring, idempotent termination), `exam-security-tests.js` I3 (exactly one funnel, guarded navigation), `exam-rules-tests.js` (policy table: fullscreen-exit = terminate). |

## Part 8 — Push: retryable delivery, safe claims, SSRF, preferences, crypto ids

### 8.1 Delivery state (was: "failed = sent")

| | |
| --- | --- |
| **Confirmed Problem (critical)** | The idempotency ledger was written **before** sending. Any failure after that write (5xx, timeout, quota) left the message recorded as sent **forever** — silent, permanent message loss, reported as success. |
| **Fix** | Full **claim → send → confirm** model in `lib/store.js` + `lib/run-scheduler.js`: `claim:{deviceId}` (5-minute `CLAIM_TTL_MS`); the confirmed ledger is written **only** when the push service accepts. Transient failures (non-404/410) back off via `RETRY_BACKOFF_MS = [2, 10, 30 min]`, `MAX_SEND_ATTEMPTS = 3`, then an honest burn: counted `gaveUp`, **never** `sent`, never retried again. 404/410 → key burned + `markInvalid` (no retries for dead subscriptions). Run summaries report `sent` / `retried` / `gaveUp` separately. |
| **Honest residual** | Netlify Blobs has no atomic compare-and-set: claims *narrow* the duplicate window but cannot eliminate it (crash between send and confirm → claim expires → possible single duplicate). Documented in `PUSH-NOTIFICATIONS-SETUP.md` §11, not hidden. |

### 8.2 Concurrency-safe claims

Overlapping scheduler runs both see a fresh claim → second run skips
(`in-flight`), so a device+message is sent at most once per claim window.
Claim records carry the message key and expire in 5 minutes.

### 8.3 SSRF allowlist (was: any URL)

| | |
| --- | --- |
| **Confirmed Problem (critical)** | The server accepted **any** `https` subscription endpoint and would `POST` to it — a student (or anyone able to write a subscription) could point the server at internal/metadata hosts of the platform (SSRF), using the function as a relay. |
| **Fix** | `lib/validate.js`: exact-host + dot-boundary-suffix **allowlist** (FCM/GCM/Android, Mozilla, Apple prod/sandbox/dev, Microsoft WNS ×3); rejects IP literals (v4/v6), credentials, non-443 ports, trailing dots, whitespace/control chars, non-https schemes. Enforced at **subscribe/sync storage** *and* re-validated at **send time** (scheduler and push-test) — records written before the allowlist can never drive an outbound request; invalid → `markInvalid` / 409 `endpoint-not-allowed`, with **no probe attempt**. |
| **Tests** | ~20 adversarial endpoint cases (push C2), stored-endpoint refusal with no outbound call (blobs I5b), source-level send-time revalidation assertions (push E7). |

### 8.4 Consistent preference enforcement

| | |
| --- | --- |
| **Confirmed Problem** | `weekly-summary` skipped the student's day list and the daily budget; `site-updates` skipped the day list — categories fired on days the student had not permitted. |
| **Fix** | Weekly now checks `dayOk` (`weekly-day-not-allowed`) and `budgetLeft` (`weekly-budget-used`) in addition to its documented Monday 09:00–12:00 window, quiet hours and idempotency. `site-updates` keeps a **documented operational exception** (ignores preferred *time* and daily *budget* so announcements are not silently swallowed) while respecting master switch, pause, quiet hours, category toggle and day list (`updates-day`). |
| **Tests** | A6.9–12 (weekly day-list + budget), A7.6–8 (site-updates exception both ways). |

### 8.5 Explicit empty-daylist behaviour

| | |
| --- | --- |
| **Confirmed Problem** | An empty `days` array was ambiguous: silent no-days vs defaults vs error — three code paths could disagree. |
| **Fix** | One explicit rule: `sanitizePrefs` keeps an **explicit** `days: []` as "no scheduled days"; subscribe/sync **reject** it with `400 no-days-selected` (server message via `prefsDaysError()`) so the UI can explain; the client's `normalizePrefs` never sends an empty list (keeps defaults); the scheduler treats an explicit empty list as no days (routines never fire). Client/server asymmetry is documented in `PUSH-NOTIFICATIONS-SETUP.md` §13. |
| **Tests** | B3 (semantics), I4b (400 round-trip). |

### 8.6 Cryptographic device ids

| | |
| --- | --- |
| **Confirmed Problem** | The per-device id fell back to `Math.random()` — a predictable "identity" underpinning rate limits and delivery state. |
| **Fix** | `crypto.randomUUID()`, else a v4 UUID from `getRandomValues`; if no secure randomness exists, `enable()` **refuses** with `no-secure-device-id` (honest failure; no weak fallback). |
| **Files** | `push-manager.js`. |
| **Tests** | D-section assertions for id shape, uniqueness and the refusal path. |

### 8.7 Accurate diagnostics

`push-test` revalidates the **stored** endpoint before sending (409
`endpoint-not-allowed` + `markInvalid` instead of a misleading generic
failure); status/test messages distinguish *unconfigured keys*, *storage
unavailable*, *rate-limited*, *not subscribed* and *endpoint refused*; no
path labels a failed send as delivered.

## Part 9 — Trust boundaries, stated honestly

`PUSH-NOTIFICATIONS-SETUP.md` §14 now documents exactly what is
server-backed (subscriptions, rate limits, delivery ledger, allowlist,
budgets, quiet hours, every scheduler decision — all in Blobs) versus
client-supplied and **not** a security boundary (anonymous device id,
preferences, activity snapshot; clearing site data resets identity; rate
limits slow abuse but cannot stop fresh-id farming). The exam section of
`EXAM-SECURITY-TESTING.md` §13 states the same for the local examination
store: fail-closed gates protect integrity against refreshes, races and
inconsistent records — **not** against the device owner editing their own
localStorage. No cheat-proof claims are made anywhere in the deliverables.

## Part 10 — Tests

New/extended coverage: monitor **section K** (K1–K7; suite total 383 → 439),
store **section 7** (18: void/refund, cert fail-closed, admin verdicts) +
rewritten unlock section for server verdicts, push **F4b**
(retry-lifecycle + concurrency + `effectiveSentMap`), **C2** (adversarial
endpoints), **B3/I4b** (empty days), **A6.9–12/A7.6–8** (preference
enforcement), **I5b** (stored-endpoint refusal), **E7** (send-time
revalidation source assertions). Suite totals and the mocked-vs-real
matrix: `docs/TEST-REPORT-v89.md`.

## Part 11 — Full suite, deployment hygiene

* `npm.cmd test`: **10,527 assertions + 37 probe scenarios — 0 failed,
  0 skipped** (exit 0), run after every relevant change.
* `sw.js`: `CACHE_NAME` **`aba-cache-v49` → `aba-cache-v50`**;
  `./exam-access-client.js` added to the app-shell precache; cache-busters
  bumped in `index.html` (`app?v=66`, `exam-monitor?v=2`, `exam-rules?v=3`,
  `push-manager?v=4`, new `exam-access-client?v=1`). Verified in a real
  browser: SW v50 installed, controller active, 99 precached entries.
* **No secrets in the ZIP**: no VAPID key material (test E13), no unlock
  code, no admin token — codes exist only as Netlify env vars; the repo is
  scanned by an automated hygiene test on every run.
* `package-lock.json` added for reproducible function dependency installs
  (regenerable; `tools/make-zip.js` historically excluded lockfiles — the
  tool policy was left unchanged and the lockfile stays in the working
  tree).

## Part 12 — Deliverables

1. **New ZIP** — `accountancy-by-abhinash-v89-security-audit.zip`
   (built with `tools/make-zip.js`, contents verified).
2. `EXAM-SECURITY-TESTING.md` — rewritten for this audit.
3. `PUSH-NOTIFICATIONS-SETUP.md` — updated (delivery model, allowlist,
   preference enforcement, trust boundaries, env vars).
4. `docs/AUDIT-REPORT-v89.md` — this report.
5. `docs/TEST-REPORT-v89.md` — counts, matrix, verified/unverified.
6. `docs/ENV-AND-DEPLOYMENT-v89.md` — environment-variable and
   deployment list.

---

## Reviewed and deliberately NOT changed (with reasons)

* **Exam store remains localStorage-based.** Making it server-backed would
  be a backend rewrite of the exam feature — explicitly out of scope
  ("preserve existing functionality"); instead the honest boundary is
  documented (§Part 9) and the *client-side* integrity rules were made
  fail-closed.
* **`site-updates` ignoring time and daily budget** is a deliberate,
  documented operational exception, not an oversight.
* **Rate limiting is a courtesy layer** (Blobs lacks atomic increments;
  instances are ephemeral) — documented as such in code and docs, layered
  on Netlify's platform protections.
* **Claims cannot fully eliminate duplicates** on Blobs (no CAS) — the
  residual window is documented rather than papered over.
* **Voice detection stays an engineered detector** (energy + voiced
  periodicity), not speech recognition — unchanged by design, stated
  honestly.
