/* ------------------------------------------------------------------
   Scheduler core — the server-side delivery engine, kept in a plain
   CommonJS module so it can be unit-tested without Netlify.
   push-scheduler.mjs (the Netlify scheduled function) is a thin
   wrapper around runScheduler().

   For each subscribed device it asks the pure decision engine
   (lib/schedule.js) whether something is due and then runs the v89
   delivery pipeline: CLAIM the idempotency key → SEND → CONFIRM (only
   after the push service accepted it) or RETRY (transient failure
   backs off exponentially; a key never enters the confirmed ledger
   until delivery actually succeeded — failures are never labelled
   "sent").

   Delivery-loop safeguards:
   - master switch, pause, quiet hours, permitted days, weekend flag,
     per-day budget — all enforced inside decide();
   - ENDPOINT RE-VALIDATION at send time (SSRF allowlist in
     validate.isEndpoint): the scheduler only makes outbound requests
     to known push-service hosts;
   - dead subscriptions (404/410) are marked invalid and skipped from
     then on; invalid records older than 30 days are deleted;
   - transient send failures are retried by later runs with backoff
     (2/10/30 min, then given up honestly — reported as gaveUp, never
     as sent);
   - a per-device claim (TTL 5 min) keeps two overlapping runs from
     sending the same key; Blobs has no atomic CAS so the claim narrows
     but cannot fully eliminate that race (documented, not hidden);
   - every device is wrapped so one broken record can't abort the run;
   - v88: Netlify scheduled functions are cut off after ~30 s, so work
     runs in small parallel batches and stops cleanly at a time
     budget (anything left over is simply picked up next run, and the
     confirmed ledger guarantees nothing successful is sent twice).
   ------------------------------------------------------------------ */

const S = require("./schedule");
const V = require("./validate");
const vapid = require("./vapid");
const store = require("./store");

const BATCH = 8;                       // devices processed in parallel
const DEFAULT_BUDGET_MS = 22000;       // stop starting new batches after this
const INVALID_RETENTION_MS = 30 * 86400000;
const RETRY_BACKOFF_MS = [2 * 60000, 10 * 60000, 30 * 60000];  // after attempt 1 / 2
const MAX_SEND_ATTEMPTS = 3;

async function processDevice(deviceId, now, broadcast, summary, deps) {
  summary.devices++;
  try {
    const rec = await deps.store.getSub(deviceId);
    if (!rec) { summary.skipped++; return; }
    if (rec.status === "invalid") {
      if (rec.lastFailure && now.getTime() - rec.lastFailure > INVALID_RETENTION_MS) {
        await deps.store.removeSub(deviceId);
        summary.purged++;
      } else summary.skipped++;
      return;
    }

    /* v89 — ENDPOINT RE-VALIDATION AT SEND TIME (SSRF): the stored
       endpoint must still be a whitelisted push-service URL before the
       server performs an outbound request to it. A record written
       before the allowlist existed (or tampered with in storage) can
       never turn the scheduler into an internal relay. */
    if (!V.isEndpoint(rec.endpoint)) {
      await deps.store.markInvalid(deviceId);
      summary.invalid++;
      return;
    }

    const prefsRaw = await deps.store.getPrefs(deviceId);
    const prefs = S.sanitizePrefs(prefsRaw, prefsRaw && prefsRaw.tz);
    if (!prefs.master) { summary.skipped++; return; }
    if (prefs.pausedUntil && now.getTime() < prefs.pausedUntil) { summary.skipped++; return; }

    const snap = S.sanitizeSnapshot(await deps.store.getSnapshot(deviceId));
    /* v89 — the decision engine sees the CONFIRMED ledger plus pending
       keys that must still be skipped (fresh in-flight claim, backing
       off); retry-due and stale-claim keys re-enter the decision so a
       later run can try them again. */
    let delivery;
    if (deps.store.getDelivery) delivery = await deps.store.getDelivery(deviceId);
    else {
      const legacy = (await deps.store.getSent(deviceId)) || {};
      delivery = { sent: legacy.sent || {}, pending: {} };
    }
    const sentView = { sent: (deps.store.effectiveSentMap || store.effectiveSentMap)(delivery, now.getTime()) };
    const decision = S.decide(now, prefs, snap, sentView, broadcast);
    if (!decision.send) { summary.skipped++; return; }
    const send = decision.send;
    const sendKeys = [send.idempotencyKey].concat((send.extraKeys || []).map(k => k.key));

    /* v89 — CLAIM before the outbound request: a concurrent run that
       finds a fresh claim backs off. The confirmed ledger is written
       only AFTER the push service accepted the notification. */
    if (!deps.store.claimSend) { summary.skipped++; return; }
    const claim = await deps.store.claimSend(deviceId, send.idempotencyKey, sendKeys, now.getTime());
    if (!claim.ok) { summary.skipped++; return; }

    const res = await deps.sendPush(rec, {
      kind: "scheduled",
      category: send.category,
      title: send.title,
      body: send.body,
      url: send.route,
      tag: send.tag,
      actions: send.actions,
      timestamp: send.timestamp
    });

    if (res.ok) {
      await deps.store.confirmSent(deviceId, send.idempotencyKey);
      await deps.store.markDelivered(deviceId);
      summary.sent++;
    } else if (res.status === 404 || res.status === 410) {
      /* Dead subscription: the notification can never arrive. Burn the
         key (the device turns invalid from now on) — counted as
         invalid, never as "sent". */
      await deps.store.confirmSent(deviceId, send.idempotencyKey);
      await deps.store.markInvalid(deviceId);
      summary.invalid++;
    } else {
      /* TRANSIENT failure (network error or 5xx): back off and let a
         later run try again. The key stays OUT of the confirmed
         ledger — a failed delivery is never labelled "sent". After
         MAX_SEND_ATTEMPTS it is burned as an honest give-up. */
      const attempt = (claim.entry && claim.entry.attempts) || 1;
      const backoff = RETRY_BACKOFF_MS[Math.min(attempt - 1, RETRY_BACKOFF_MS.length - 1)];
      let r = { retry: false };
      try {
        r = await deps.store.scheduleRetry(deviceId, send.idempotencyKey, res.status || 0, backoff, MAX_SEND_ATTEMPTS, now.getTime());
      } catch (e2) { r = { retry: false }; }
      if (r && r.retry) summary.retried++; else summary.gaveUp++;
      summary.errors++;
    }
    /* If sendPush itself threw, the catch below counts the error and
       the claim simply expires after CLAIM_TTL_MS — the key becomes
       sendable again, so a crash costs at most one delay plus at most
       one possible duplicate (documented honestly in the setup doc). */
  } catch (e) {
    summary.errors++;
  }
}

/* deps is injectable for tests; production uses the real modules. */
async function runScheduler(opts) {
  opts = opts || {};
  const deps = {
    store: opts.store || store,
    sendPush: opts.sendPush || vapid.sendPush,
    vapidConfigured: opts.vapidConfigured || vapid.vapidConfigured
  };
  const nowFn = opts.nowFn || (() => new Date());
  const startedAt = Date.now();
  const budget = opts.budgetMs || DEFAULT_BUDGET_MS;
  const summary = { ranAt: startedAt, devices: 0, sent: 0, skipped: 0, invalid: 0, purged: 0, errors: 0, deferred: 0, retried: 0, gaveUp: 0, disabled: null };

  if (!deps.vapidConfigured()) {
    summary.disabled = "vapid-not-configured";
    return summary;
  }

  let deviceIds = [];
  try { deviceIds = await deps.store.listDeviceIds(); }
  catch (e) { summary.errors++; summary.disabled = "storage-unavailable"; return summary; }

  const now = nowFn();
  const broadcast = await deps.store.getBroadcast().catch(() => null);

  for (let i = 0; i < deviceIds.length; i += BATCH) {
    if (Date.now() - startedAt > budget) { summary.deferred = deviceIds.length - i; break; }
    const batch = deviceIds.slice(i, i + BATCH);
    await Promise.all(batch.map(id => processDevice(id, now, broadcast, summary, deps)));
  }

  /* Housekeeping (bounded, best-effort, never affects delivery). */
  if (deps.store.pruneRateLimits && Date.now() - startedAt < budget) {
    try { summary.prunedCounters = await deps.store.pruneRateLimits(Date.now(), 100); } catch (e) { /* ignore */ }
  }
  return summary;
}

module.exports = { runScheduler: runScheduler, BATCH: BATCH };
