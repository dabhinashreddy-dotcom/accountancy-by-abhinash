# Environment variables & deployment — v89 security-audit build

Everything this build reads from the environment, what happens when a
variable is missing, and the exact deploy checklist. Beginner-friendly
push setup stays in `PUSH-NOTIFICATIONS-SETUP.md`; the exam security
document is `EXAM-SECURITY-TESTING.md`.

---

## 1. Complete environment-variable list

### Required for Web Push (3)

| Variable | Value | Secret? | If missing |
| --- | --- | --- | --- |
| `VAPID_PUBLIC_KEY` | the public key printed in `PUSH-NOTIFICATIONS-SETUP.md` §1 | No | `push-config` reports `vapid-missing`; Enable shows "missing delivery keys"; nothing is sent |
| `VAPID_PRIVATE_KEY` | from your private secret file (**not in the ZIP**) | **YES** | same as above |
| `VAPID_SUBJECT` | `https://<your-site>.netlify.app` | No | same; must be `mailto:` or `https:` |

### Optional for Web Push (1)

| Variable | Value | Secret? | If missing |
| --- | --- | --- | --- |
| `ADMIN_TOKEN` | any long random string you invent | **YES** | `push-broadcast` refuses every request (403) — site-update broadcasts simply don't work; everything else unaffected |

### Optional for Exam Mode privileged codes (3)

| Variable | Value | Secret? | If missing |
| --- | --- | --- | --- |
| `EXAM_UNLOCK_TWO` | a code that grants +2 attempts for the day | **YES** | unlock answers `503 unlock-unavailable` — the UI says the check service isn't configured; no code can ever be judged locally |
| `EXAM_UNLOCK_UNLIMITED` | a code that grants unlimited attempts for the day | **YES** | same 503 |
| `EXAM_ADMIN_TOKEN` | authorizes opening the local diagnostics report | **YES** | admin answers `403`, indistinguishable from a wrong token |

Rules that hold for every one of them:

* Values live **only** in Netlify (Site configuration → Environment
  variables, *All scopes*, *All deploy contexts* at least Production).
  They are applied on the **next deploy**.
* Nothing secret ships in the ZIP: no VAPID material, no unlock code, no
  admin token. This is enforced by test **E13** (repo-wide key scan) and
  exam-security **I6** (legacy plaintext codes absent everywhere).
* Server comparisons are timing-safe SHA-256 digest compares; responses
  never reveal which value matched, how many exist, or how close a guess
  was.
* Rate limits per candidate identity: 12 subscribes/hour, 120 syncs/hour,
  5 tests/hour, 10 unlock tries/hour, 12 admin checks/hour (Blobs-backed;
  in-memory fallback per warm instance when Blobs is unreachable).
* No login/identity system exists anywhere; the "candidate id" and
  device id are anonymous per-device values in browser storage.

Platform-provided (never set by you): the Blobs connection details
(`NETLIFY_SITES` / site id) are injected by Netlify into the function
runtime; the code reads them implicitly.

## 2. What must be true after deploy

1. **Functions list** (Netlify → Functions): `push-config`,
   `push-subscribe`, `push-sync`, `push-test`, `push-unsubscribe`,
   `push-broadcast`, `exam-access` (all `2xx` under
   `/.netlify/functions/<name>`) plus `push-scheduler` with a
   **Scheduled** badge (`*/15 * * * *`, UTC, production only).
2. **Runtime:** Node 22 (pinned in `netlify.toml`; `@netlify/blobs`
   requires ≥ 22.12).
3. **Status check:** `GET /.netlify/functions/push-config` returns
   `"configured": true` with `"storage": {"ok": true}` (expected JSON in
   `PUSH-NOTIFICATIONS-SETUP.md` §6).
4. **Exam access check (with the codes configured):**
   `POST /.netlify/functions/exam-access` with
   `{"purpose":"unlock","code":"wrong"}` → **403 `invalid-code`**;
   `{"purpose":"unlock","code":""}` → **400 `code-required`**;
   `{"purpose":"unlock"}` (no body value) → **400**;
   with the variables removed → **503 `unlock-unavailable`**.
5. **Static headers** (`_headers`): `vision_bundle.mjs` →
   `text/javascript`, wasm → `application/wasm`, long cache for
   `.tflite` — without these every face/phone check fails (browsers
   refuse mis-typed modules/wasm).
6. **HTTPS** in production (`getUserMedia`, Fullscreen, Push, service
   worker all require a secure context).
7. **Service worker:** clients pick up `aba-cache-v50` on the next visit
   after the deploy (bump it again on the *next* code deploy). The shell
   precache includes `./exam-access-client.js` and `vendor/vision/`.
8. **Cache-busters in `index.html`:** `app.js?v=66`,
   `exam-monitor.js?v=2`, `exam-rules.js?v=3`, `push-manager.js?v=4`,
   `exam-access-client.js?v=1` (plus unchanged pins for the rest).

## 3. Deploy checklist

- [ ] ZIP extracted / repo updated with these files (no secrets inside —
      verify: no `VAPID_PRIVATE_KEY` value, no unlock code, no admin
      token anywhere in the archive).
- [ ] Environment variables set in Netlify (table above), Scopes =
      *All scopes*.
- [ ] Deploy to **Production** (scheduled functions and env vars apply
      only there).
- [ ] Section 2 checks 1–6 pass.
- [ ] On a phone: Settings → Notifications → Enable → Send test
      notification (real delivery; `PUSH-NOTIFICATIONS-SETUP.md` §7–8).
- [ ] On a camera-equipped computer: one full exam attempt through the
      security screen (13 checks green → Begin → submit), and one
      unlock-code attempt against the configured server.

## 4. What was verified where (summary)

* **Tested in CI-style runs (every `npm test`):** all server logic
  (scheduling, delivery state machine, allowlist, sanitizers, exam
  access verdicts) executed in-process; real `@netlify/blobs` client
  against a local mock edge; no secrets in the tree.
* **Verified in a real browser (19 Oct 2026, local static server):**
  script wiring, SW `aba-cache-v50` with 99 precached entries, exam
  pre-check fail-closed behaviour, real MediaPipe model loading and
  fixture inference, settings/notifications UI.
* **NOT verified from here (needs your deployment):** live push delivery
  to a real device, cron scheduling on Netlify, the Blobs service in
  production, unlock codes against the deployed function, camera-grant
  success on real hardware, Safari/iOS behaviour. Each has a concrete
  verification step in sections 2–3 above.

## 5. Notes for maintainers

* `package.json` declares `web-push` + `@netlify/blobs`; a
  `package-lock.json` exists in the working tree for reproducible
  installs (Netlify installs dependencies at build time either way; the
  packaging tool historically excludes lockfiles from the ZIP).
* Regenerate VAPID keys **never** after subscribers exist
  (`npm run vapid:generate` would orphan every subscription).
* Bump `sw.js` `CACHE_NAME` on every deploy that changes shipped files.
