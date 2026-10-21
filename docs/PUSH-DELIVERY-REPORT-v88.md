# v88 — Web Push repair: what was wrong, what changed, what is verified

## Diagnosis (from the real v87 source)

The Settings message *"missing delivery keys / Delivery: not connected"* is
produced when `push-config` reports `configured:false`, i.e. the three
`VAPID_*` environment variables are not set on the deployed site. That part
is a Netlify task. **But inspecting the code showed two further defects that
would have kept delivery broken even after the keys were added:**

1. **Blobs never connected.** All functions use Netlify's classic
   (Lambda-compatible) handler format, where the Blobs environment is not
   configured automatically; `connectLambda(event)` was never called, so
   every storage call would throw. Also the store object was cached across
   invocations (stale per-invocation credentials).
2. **`store.getJSON()` does not exist** in the installed `@netlify/blobs`
   v11 (JSON is read with `get(key, { type: "json" })`). The old code's
   catch-all turned that error into "record not found", so reads silently
   returned nothing: no preferences, no ledger, and no device list for the
   scheduler's decisions.

Also found: key presence was checked but not validity (a bad subject or
mismatched pair would only fail later at send time); the schedule was
declared twice (`netlify.toml` and in code); the scheduler processed devices
one by one with no regard for Netlify's 30-second scheduled-function limit;
a browser subscription created under a different VAPID key would be reused
forever; a server-side expired/lost subscription was never repaired by the
client; rate-limit counters were never cleaned up.

## Changes (files touched)

* `netlify/functions/lib/store.js` — `connect(event)` (connectLambda), no
  store caching, `get(...,{type:"json"})`, real read errors propagate,
  `selfTest()`, `pruneRateLimits()`.
* `netlify/functions/lib/vapid.js` — full validation (lengths, base64url,
  subject form, public/private pair match), values cleaned of quotes/spaces,
  `vapidStatus()`; 8 s send timeout; safe push topic.
* `netlify/functions/push-{config,subscribe,sync,unsubscribe,test,broadcast}.js`
  — call `store.connect(event)`; `push-config` now reports VAPID validity
  **and** a real storage write/read/delete, with a `reason` code.
* `netlify/functions/push-scheduler.js` → `push-scheduler.mjs` (modern
  function format, schedule in code) + `lib/run-scheduler.js` (testable core:
  parallel batches, time budget, purge of invalid subscriptions after 30
  days, housekeeping). `netlify.toml`: duplicate schedule removed.
* `push-manager.js` (v3) — accurate status text per reason; replaces a
  subscription made with a different VAPID key; self-repairs when the
  server lost/expired the record (no permission prompt). `sw.js` cache v48;
  `index.html` + prerendered pages pin `push-manager.js?v=3`.
* `tests/push-notification-tests.js` (+~60 assertions),
  `tests/push-blobs-integration-tests.js` (new), `package.json`
  (`vapid:generate`, test chain), `tools/generate-vapid-keys.js`,
  `PUSH-NOTIFICATIONS-SETUP.md`, `NOTIFICATIONS.md`.

Not changed: Settings UI structure, categories, scheduling rules, themes,
student progress, PWA/offline behaviour, every unrelated feature.

## Verified locally

* Full `npm test` chain (all pre-existing suites + the new ones).
* **Mocked (labelled in the test names):** push-service responses,
  storage in the unit suite, scheduler dependencies.
* **Integration (real `@netlify/blobs` client + real store.js + real
  handlers against a local mock of Netlify's Blobs edge server):** proves
  the pre-v88 failure mode, then that connect → config self-test →
  subscribe → sync → test → scheduler → unsubscribe all persist and read
  back correctly.
* The generated key pair validates (right lengths, public matches private)
  and signs a VAPID token.

## NOT verified (needs your live site)

* Netlify's production Blobs service and the deployed Functions bundle.
* A real push through Google/Apple/Mozilla, display on a device, behaviour
  with the browser fully closed, and an actual scheduled run at 15-minute
  intervals. No claim of live delivery is made.
