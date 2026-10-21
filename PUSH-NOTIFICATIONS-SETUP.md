# Web Push setup (v88 backend, v89-audited) — beginner guide

This site sends **real push notifications**. A small backend (Netlify
Functions + Netlify Blobs storage) keeps each student's subscription and
sends reminders on a schedule. Everything in the code is already done —
what remains is **four things only you can do in your Netlify account**.

> This guide reflects the v89 delivery audit: honest retry states
> (§11), the endpoint allowlist (§12), preference enforcement
> (§13) and what the server does and does not trust (§14).
> Full environment-variable list: `docs/ENV-AND-DEPLOYMENT-v89.md`.

> Plain-English glossary
> * **Environment variable** — a private setting stored in Netlify (like a
>   password the website can read but visitors cannot).
> * **VAPID keys** — a matching pair of codes that prove to Google/Apple/
>   Mozilla that the notifications really come from *your* site. The
>   **public** key is safe to share. The **private** key is a secret.
> * **Function** — a small program that Netlify runs for your site.
> * **Blobs** — Netlify's built-in storage where subscriptions are saved.

---

## WHAT I MUST DO

Tick each box as you finish it.

- [ ] **1. Add 3 environment variables** in Netlify (names and values below;
      the private value is in the separate secret file you were given — it
      is not in this ZIP).
- [ ] **2. Storage:** nothing to switch on (see section 4). You only check it.
- [ ] **3. Redeploy production** so the variables and the new code go live.
- [ ] **4. Check the status page** (section 6) shows `"configured": true`.
- [ ] **5. Test on your device:** Settings → Notifications → Enable → Send
      test notification (sections 7–8).

Do not run the key generator again after you have deployed — a new pair
would stop every existing subscription from working.

---

## 1. The three environment variables

| Name | Value | Secret? |
| --- | --- | --- |
| `VAPID_PUBLIC_KEY` | `BE1doMBFjzXi8ZC7tb1mlWO4oD1dYCzwEEmsH8sC76rqQvoAT1ETQogD_zRXzVZojf5xTVW0JJIhxz0MRhLTaU8` | No (public) |
| `VAPID_PRIVATE_KEY` | *copy it from the separate file `NETLIFY-SECRET-VALUES.txt`* | **YES — never share, never commit** |
| `VAPID_SUBJECT` | `https://accountancybyabhinash.netlify.app` | No |

Copy each value exactly. No quote marks, no spaces before/after. (The
server cleans accidental spaces and quotes, but don't rely on it.)

Optional, only if you want to broadcast "site update" notifications:
`ADMIN_TOKEN` = any long random text you invent (see section 10). Skip it
otherwise.

Two more *optional* variables belong to Exam Mode, not to push:
`EXAM_UNLOCK_TWO`, `EXAM_UNLOCK_UNLIMITED` and `EXAM_ADMIN_TOKEN` (see
`docs/ENV-AND-DEPLOYMENT-v89.md`). With them unset, Exam Mode's unlock box
honestly answers "the check service isn't configured" (503) instead of
guessing locally — nothing else changes.

## 2. Where to add them in Netlify

1. Sign in at <https://app.netlify.com> and open your site
   (**accountancybyabhinash**).
2. Left menu: **Project configuration** → **Environment variables**.
3. Click **Add a variable** (a **Add a single variable** option may appear
   — choose it).
4. Type the **Key** (e.g. `VAPID_PUBLIC_KEY`), paste the **Value**.
5. Leave **Scopes** on *All scopes* (the Functions scope must be included)
   and **Deploy contexts** on *All deploy contexts* (or at least
   **Production**).
6. Click **Create variable**. Repeat for all three.

Netlify only applies new variables to a **new deploy** — that is step 5.

## 3. Deployment context and Functions

* The notification **scheduler** runs **only on the Production deploy**
  (Netlify does not run scheduled functions on deploy previews or branch
  deploys). Make sure you deploy to **Production**.
* Functions are picked up automatically from `netlify/functions`
  (`netlify.toml` already says so, and pins Node 22, which the storage
  library needs). You change nothing.
* After the deploy, open **Functions** in the Netlify menu. You should
  see: `push-config`, `push-subscribe`, `push-sync`, `push-test`,
  `push-unsubscribe`, `push-broadcast`, and `push-scheduler` with a
  **Scheduled** badge (every 15 minutes). If the list is empty, the
  functions did not deploy — see section 9.
* Scheduled functions are limited to 30 seconds; the code already keeps
  to a time budget.

## 4. Storage setup (Netlify Blobs)

**There is nothing to create or switch on.** The code uses Netlify Blobs,
which is built into Netlify, belongs to your site automatically and needs
no database, connection string or extra account. The store is named
`aba-push` and is created the first time something is saved.

You will *prove* storage works in section 6 — the status page performs a
real write/read/delete and reports `"storage": {"ok": true}`.

## 5. How to redeploy production

Use the method you normally use to publish this site:

* **Connected to GitHub (recommended):** put the files from this ZIP in the
  repository, commit and push to your production branch. Netlify builds
  and deploys by itself. To redeploy without a code change:
  **Deploys** → **Trigger deploy** → **Deploy site**.
* **Netlify CLI:** from the project folder run
  `npm install` then `netlify deploy --build --prod`.
* **Drag-and-drop upload:** this can publish the pages, but I could not
  confirm that it installs the functions' npm packages (`web-push`,
  `@netlify/blobs`). If section 6 shows the functions missing or failing,
  switch to GitHub or the CLI.

Wait until the deploy shows **Published**.

## 6. The exact configuration check

Open this address in any browser (replace nothing — it is your site):

**<https://accountancybyabhinash.netlify.app/.netlify/functions/push-config>**

### Expected SUCCESS response

```json
{
  "ok": true,
  "configured": true,
  "reason": null,
  "publicKey": "BE1doMBFjzXi8ZC7tb1mlWO4oD1dYCzwEEmsH8sC76rqQvoAT1ETQogD_zRXzVZojf5xTVW0JJIhxz0MRhLTaU8",
  "vapid":   { "ok": true, "missing": [], "problems": [] },
  "storage": { "ok": true, "error": null }
}
```

`publicKey` must equal the public key you entered.

### What a failure means

| You see | Meaning | Fix |
| --- | --- | --- |
| Page not found / 404 | Functions were not deployed | Section 9, point 1 |
| `"reason": "vapid-missing"` and `"missing": [...]` | The listed variable(s) are not set for Functions / Production | Add them (section 2), redeploy |
| `"reason": "vapid-invalid"` and `"problems": [...]` | Set, but wrong. `wrong-length` / `not-base64url` = copy/paste error. `must-be-mailto-or-https` = bad subject. `does-not-match-private-key` = public and private keys are not from the same pair | Re-copy the values from the original source; redeploy |
| `"reason": "storage-unavailable"` | Keys are fine but Netlify Blobs could not be reached from the function | Section 9, point 3 |
| `"configured": true` | Backend is ready | Continue |

The response only ever names variables — it never shows your private key.

## 7. Enable notifications on the website

1. Open the site **after** the deploy and refresh once (a stale copy may
   be cached; closing and reopening the tab helps).
2. Go to **Settings → Notifications**. The Delivery line should no longer
   say "missing delivery keys".
3. Tap **Enable Notifications** and press **Allow** in the browser prompt.
4. **iPhone/iPad:** Web Push needs iOS/iPadOS **16.4+** and the site added
   to the **Home Screen** (Share → Add to Home Screen). Open it from the
   Home Screen icon, then enable. This is an Apple rule.
5. Settings should now say **Delivery: active**.

## 8. Send a real test notification

Settings → Notifications → **Send test notification**. A notification
titled "This is a test notification 🔔" should appear within seconds.
(Enabling also sends one automatically.) Limit: 5 tests per hour.

This test is sent by the server through Google/Apple/Mozilla's push
service — a real push, not a local pop-up. Whether it appears while the
browser is **fully closed** depends on your phone/computer's settings
(battery saver, Do Not Disturb, browser background limits). The
scheduled reminders can only be confirmed by waiting for one at your
chosen time; I could not test live delivery from here.

## 9. If delivery still fails

1. **`push-config` is 404 / Functions list is empty** — the functions did
   not deploy. Redeploy from GitHub or the CLI (section 5). Check the
   deploy log for errors; the log should mention functions bundling.
2. **`vapid-missing` / `vapid-invalid`** — fix the variables as in the
   table in section 6, then **redeploy**.
3. **`storage-unavailable`** — open **Logs → Functions → push-config** in
   Netlify and read the error. Blobs normally needs no setup; if the error
   mentions the environment not being configured, make sure you deployed
   *this* version of the code (v88) and are on Node 22 (`netlify.toml`).
4. **Enable says "server didn't confirm"** — open the browser's
   developer console (Network tab) and look at the `push-subscribe`
   response; `500` means storage; `400` means a malformed request.
5. **Test says "isn't subscribed on the server"** — tap Enable again. (The
   site now also repairs this by itself the next time you open it.)
6. **Test works but scheduled reminders never come** — check the Functions
   list shows `push-scheduler` as **Scheduled**; open it, click **Run now**
   and read the log line `push-scheduler {…}`. `"disabled":
   "vapid-not-configured"` = keys; `"disabled": "storage-unavailable"` =
   storage; `sent: 0, skipped: N` is normal when nothing is due (quiet
   hours, daily limit, nothing to remind about, reminders paused).
7. **Android works, iPhone silent** — site not on the Home Screen, or iOS
   older than 16.4.
8. **Permission shows "denied"** — unblock in the browser's Site settings
   → Notifications, then reload.
9. **Subscription expired** (HTTP 404/410 from the push service) — the
   site detects this, marks it invalid, and re-registers on your next
   visit. Tap Enable if it doesn't.

## 10. Optional: site-update broadcasts

Only if you set `ADMIN_TOKEN`:

```bash
netlify functions:invoke push-broadcast --data \
  '{"token":"<ADMIN_TOKEN>","version":"2026-10-19a",
    "title":"New Practice Sets","body":"Fresh GST questions just landed.",
    "url":"ch-gst"}'
```

Bump `version` for every new broadcast. Each device gets it at most once.

---

## 11. How delivery honesty works (v89 audit)

The scheduler never claims a notification was sent unless a push service
accepted it:

* **claim → send → confirm.** A run first *claims* the device+message
  (a short-lived record, 5 minutes) so two overlapping runs cannot both
  send it; only after the push service returns an accepted status is the
  message written to the confirmed ledger.
* **Transient failures retry with backoff.** A 5xx/timeouts/429 are
  scheduled for retry after **2 min, then 10 min, then 30 min** (maximum
  **3 attempts**). Later runs pick them up automatically.
* **Then an honest give-up.** After the third failed attempt the message is
  burned into the ledger as **gaveUp** — it is never counted as `sent`,
  and it never retries forever. The scheduler's run summary reports
  `sent`, `retried` and `gaveUp` separately; `gaveUp > 0` means real
  messages were lost to push-service errors (check your function logs).
* **Gone means gone.** HTTP 404/410 from the push service marks the
  subscription invalid immediately (no retries for a dead subscription);
  the site re-subscribes on the next visit.
* **Honest duplicate window.** If the scheduler crashes *between* a
  successful send and the confirm write, the claim expires and the next
  run may resend that one message — the alternative (writing "sent"
  first) silently loses messages, which is worse. Claims narrow but —
  because the storage layer has no atomic compare-and-set — cannot fully
  eliminate that window. Expect at most one duplicate in that rare case;
  idempotency keys keep everything else exactly-once.

## 12. Where the server will send (endpoint allowlist)

To stop the test/scheduler endpoints from being turned into an open relay,
the server only posts to **known push-service hosts**: Google FCM/GCM,
Mozilla's updates.push.services.mozilla.com, Apple's api.push.apple.com
(sandbox/development variants) and Microsoft's notify.windows.com /
notify.live.net / notify.live.com — exact hosts or suffix matches with a
dot boundary. IP literals, credentials in the URL, non-443 ports, trailing
dots and control characters are refused. The check runs **when a
subscription is stored** and **again immediately before every send**; a
stored endpoint that no longer qualifies is marked invalid instead of
probed (409 `endpoint-not-allowed` on the test path).

## 13. What preferences actually enforce

* **Days:** each category may fire only on a day you selected. An
  **explicit empty day list means no scheduled days** — subscribe/sync
  reject it with `400 no-days-selected` so the UI can say so, while a
  never-configured device keeps the default days. Routines never fire on
  a non-selected day.
* **Quiet hours, daily budget, master switch, pause** apply to every
  category — 1–4 routine reminders per day (`maxDaily`), one category per
  run by priority.
* **Weekly summary:** one per ISO week, Monday 09:00–12:00 local, and now
  **also respects your day list and the daily budget**
  (`weekly-day-not-allowed`, `weekly-budget-used`), plus the existing
  no-data/already-sent checks.
* **Site updates (broadcast):** an operational exception, documented as
  such — an update announcement ignores the preferred *time* and the daily
  *budget* (otherwise a busy week could swallow it), but still respects
  the master switch, pause, quiet hours, the category toggle and your day
  list (`updates-day`).

## 14. What the server trusts (read this once)

* **Server-backed:** subscriptions, rate limits, the confirmed/retrying/
  gave-up ledger, endpoint allowlisting, budgets, quiet hours and every
  scheduler decision — all in Netlify Blobs, all re-checked on each run.
* **Client-supplied (not a security boundary):** the anonymous device id
  (a random UUID in your browser — there is no login), your preference
  choices, and your week's activity snapshot. Clearing site data makes the
  device "new". Rate limits are per device id, so they slow abuse but
  cannot stop a determined attacker creating fresh ids — that is stated
  plainly, never presented as authentication.
* **Device id honesty:** the id is created with `crypto.randomUUID()`
  (or a `getRandomValues`-based UUID). If the browser offers no secure
  randomness, Enable refuses with `no-secure-device-id` rather than
  falling back to guessable ids.
* **No cheat-proof claims.** Push preferences and the exam's local store
  live on the device; only privileged codes (exam unlock/admin) and all
  delivery decisions are server-verified.

---

## Reference: how it works (v88 backend, v89 audited)

* **Scheduling:** `netlify/functions/push-scheduler.mjs`, every 15 minutes
  (UTC cron; each student's own time zone, quiet hours, permitted days and
  daily limit are applied by `lib/schedule.js`). At most one notification
  per device per run, 1–4 routine reminders per day, weekly summary once
  per week (day list + budget enforced, Monday 09:00–12:00 local).
* **Delivery state** (§11): claim → send → confirm; retries 2/10/30 min
  up to 3 attempts; honest `gaveUp`; 404/410 burns the key.
* **Storage keys** (store `aba-push`): `sub:`, `prefs:`, `snap:`, `sent:`,
  `claim:` (5-minute in-flight claims), `rl:` (hourly rate-limit counters,
  pruned automatically), `broadcast`. Invalid subscriptions are kept 30
  days then deleted.
* **Limits:** 12 subscribes/hour, 120 syncs/hour, 5 tests/hour per device,
  10 exam-unlock tries/hour and 12 admin checks/hour (same store); request
  bodies capped at 8 KB; push endpoints must be `https` **and** pass the
  allowlist (§12).
* **Identity:** an anonymous per-device UUID created from
  `crypto.randomUUID()` in `localStorage` — not a login. Clearing site
  data unsubscribes that device.
* **Honest limits:** a server "accepted" response means the push service
  took the message; the phone/browser still decides whether to show it.
  Closed-browser delivery is not guaranteed on every device.
