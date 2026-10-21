# Notifications — how they work now (v87: genuine Web Push)

v87 replaces the page-only local reminders with a **real Web Push system**:
the browser subscribes once, the subscription is saved on the server
(Netlify Functions + Netlify Blobs), and a **scheduled server function**
(`push-scheduler`, every 15 minutes) decides — in the student's own time
zone — whether a reminder is due. Delivery therefore works **even when the
site is closed and the device is on the lock screen**.

The local timer from earlier versions still exists, but only as an honest
last-resort fallback: it is never armed while server push is active.

## The pipeline (client)

`push-manager.js` (`window.ABAPush`) owns the entire lifecycle:

1. capability check (`serviceWorker` + `PushManager` + `Notification` + secure context);
2. permission — requested **only** inside `enable()`, which runs **only** when the
   student presses a button (onboarding card or Settings). Nothing requests
   permission on load, ever;
3. service worker registration, VAPID public key fetch (`push-config`);
4. `pushManager.subscribe({ userVisibleOnly, applicationServerKey })`;
5. POST the subscription + preferences + a **real-data** progress snapshot to
   `push-subscribe`;
6. **success is reported only after the server confirms the save** — offline,
   unconfigured or failed saves are reported as failures, never as success;
7. a genuine labelled test push confirms the pipeline end-to-end.

Identity: an anonymous device id (`localStorage.aba_device`, a random UUID).
It is a capability token for that device's subscription — not an account.
"Reset all data" deletes it and unsubscribes the device.

## The pipeline (server)

`netlify/functions/push-scheduler.mjs` runs every 15 minutes (the schedule is declared in the function file itself; core logic in `lib/run-scheduler.js`).
Per subscribed device, the pure engine `lib/schedule.js` evaluates the stored
preferences and snapshot and returns **at most one** notification:

* priority: streak → daily study → unfinished practice → mistake book →
  revision → exam prep;
* always enforced: master switch, pause, quiet hours (midnight wrap
  supported), permitted days, weekend switch, per-day budget (1–4);
* separate slots: **weekly summary** (Monday 09:00–12:00 local, once per ISO
  week, only with real week data) and **site updates** (one per broadcast
  version, set via the admin-only `push-broadcast` function);
* every send is keyed for idempotency and recorded **before** the send, so a
  double scheduler run can never double-notify;
* dead subscriptions (404/410 from the push service) are marked invalid and
  skipped from then on.

## Honest categories

* **Server-delivered** (work while the site is closed): daily study, streak,
  unfinished practice, mistake book, revision, exam prep, weekly summary,
  site updates.
* **Page-open only** (labelled as such in Settings): focus-session complete
  (Pomodoro), achievements. The browser cannot run our timer in the
  background, so these are shown locally while the site is open — the UI says
  so instead of pretending.

Notification copy never invents scores, dates or statistics; the only data a
message may reference is something the student actually did (e.g. "Your
Journal activity is still waiting").

## Platform limits (stated in the UI too)

* **iPhone/iPad**: Web Push works from iOS 16.4+, but only for a site added
  to the Home Screen (Share → Add to Home Screen). The Settings card and the
  onboarding flow say this.
* **Desktop/Android**: any recent Chrome, Edge, Firefox or Safari.
* Notification permission is **never** requested automatically; a student who
  declines is never prompted again (the card is dismissible with "Not Now"
  and does not return).

## Where things live

| Piece | File |
| --- | --- |
| Client lifecycle + Settings/Home UI | `push-manager.js` |
| Service worker (`push` + `notificationclick`) | `sw.js` |
| Decision engine (pure, unit-tested) | `netlify/functions/lib/schedule.js` |
| Endpoints | `netlify/functions/push-{config,subscribe,unsubscribe,sync,test,broadcast}.js` + `push-scheduler.mjs` |
| Storage (subscriptions, prefs, snapshots, ledgers) | `netlify/functions/lib/store.js` (Netlify Blobs) |
| Setup / deployment guide | `PUSH-NOTIFICATIONS-SETUP.md` |
| Tests | `tests/push-notification-tests.js` |

Server-side scheduling, real end-to-end delivery, and every gate are covered
by the test suite; what the suite **cannot** verify is a live delivery through
Apple/Google/Mozilla push services (that requires a deployed site with VAPID
keys) — see `docs/PUSH-DELIVERY-REPORT-v87.md` for exactly what was verified
and what was not.
