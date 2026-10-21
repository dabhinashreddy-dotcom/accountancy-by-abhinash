# v87 — Web Push delivery: what was built, verified, and not verified

Date: 2026-10-18 · Scope: genuine server-scheduled Web Push for
Accountancy By Abhinash (v87)

## What was built

**Client** (`push-manager.js`, ~1,100 lines, loaded before `app.js`):

* full subscribe pipeline — capability check → permission (only on an explicit
  button press) → service worker registration → VAPID public key fetch →
  `pushManager.subscribe()` → server save → confirmation; success is claimed
  only after the server confirms;
* honest state model: supported / permission / subscription / server-saved /
  paused / unconfigured / unreachable — Settings never shows "enabled" unless
  the server has confirmed the subscription;
* Settings card master switch, 10 individually toggleable categories,
  preferred time, day chips, weekend switch, quiet hours, timezone display,
  max-per-day (1–4), pause (24h / 7d / resume), unsubscribe (with confirm),
  restore defaults, genuine server test push;
* Home onboarding card "Stay on Track with Accountancy" (Enable / Not Now /
  Notification Settings) — shown at most once, never triggers the browser
  prompt by itself, never returns after "Not Now" or unsubscribe;
* anonymous device UUID (`aba_device`) outside `STATE`/export; prefs mirror
  (`aba_push_prefs`); real weekly counters (`aba_push_week`) fed by
  `logActivity` / `addXP` / `mistakeBookRecordCorrect`;
* dirty-flag snapshot sync (≤1/minute, flush on tab hide) to
  `push-sync`; local (page-open) notifications for Pomodoro completion and
  achievements, category-gated and labelled "while the site is open".

**Server** (`netlify/functions`, CommonJS, Node 22):

* `push-config` (public key), `push-subscribe`, `push-unsubscribe`,
  `push-sync`, `push-test` (genuine `web-push` send), `push-broadcast`
  (ADMIN_TOKEN-gated), `push-scheduler` (cron `*/15 * * * *`);
* pure engine `lib/schedule.js`: priority order, ≤1 send/run, 1–4/day budget,
  quiet hours (wrapping midnight), day list + weekend switch, pause,
  weekly summary slot (Mon 09:00–12:00 local, one per ISO week, real data
  only), broadcast slot (one per version), per-category data gates (no
  invented content), privacy-safe copy, safe-route validation;
* `lib/store.js` (Netlify Blobs `aba-push`, 30-day-pruned idempotency
  ledger, rate counters), `lib/vapid.js` (env-only VAPID, TTL 2 days,
  404/410 → mark invalid), `lib/validate.js` (UUID/endpoint/subscription
  validation, 8 KB body cap, rate windows).

**Service worker** (`sw.js`, cache v47): `push` handler renders server
payloads (title/body/icon/badge/tag/actions/timestamp), `notificationclick`
resolves action buttons, and every destination is re-validated against a
`SAFE_ROUTES` allowlist mirrored from the server (anything else opens
`#home`); `/.netlify/` is excluded from the stale-while-revalidate cache.

## Verified in this environment (automated tests)

`tests/push-notification-tests.js` (150+ assertions) plus the full existing
suites (`npm test`):

* every engine gate (master/pause/quiet/days/weekends/time/budget), priority
  order, per-category data gates, weekly/exam-prep/broadcast idempotency,
  simulated double-run safety, timezone determinism (same instant → UTC
  sends, IST is in quiet hours);
* sanitizers vs hostile input (evil routes, padded keys, out-of-range times,
  oversized counters, non-object snapshots);
* validation + rate-limit windows; client prefs normalisation and real-data
  snapshot building; client/server ISO-week parity;
* static wiring: SW push handler + action validation + cache v47 + shell
  precache, index.html pins (app v65, styles v49, push-manager v1) and load
  order, `requestPermission` exists **only** inside `ABAPush.enable()`,
  Settings/Home/reset/boot hooks present, Netlify cron + Node 22 config,
  all functions present, no committed VAPID key material.

## NOT verified here (labelled honestly)

* **Live end-to-end delivery** through Apple/Google/Mozilla push services:
  this requires a deployed Netlify site with real VAPID keys and a real
  browser granting permission. The test push, the scheduler run against the
  Blobs store, and lock-screen display on iOS/Android/desktop must be checked
  after deployment — `PUSH-NOTIFICATIONS-SETUP.md` §4 lists the exact steps.
* Netlify's scheduled-function behaviour in production (the schedule is
  declared both in `netlify.toml` and in `exports.config`).
* iOS Home Screen installation flow on a physical device (Apple requires
  iOS 16.4+ and an installed web app).

No claim of "verified real-world delivery" is made anywhere in this release.
The app states the same limits to students (Settings + setup guide).
