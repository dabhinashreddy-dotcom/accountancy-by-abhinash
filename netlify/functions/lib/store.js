/* ------------------------------------------------------------------
   Storage for push subscriptions, preferences, snapshots, delivery
   ledger and rate-limit counters — backed by Netlify Blobs, which is
   built into the Netlify Functions runtime (no external database, no
   connection strings, encrypted at rest, scoped to this site).

   Record layout (keys in the "aba-push" store):
     sub:{deviceId}   → subscription record (endpoint never returned)
     prefs:{deviceId} → sanitised notification preferences
     snap:{deviceId}  → progress snapshot used for reminder eligibility
     sent:{deviceId}  → { sent: { "<key>": epochMs } } idempotency ledger
     rl:<act>:<deviceId>:<bucket> → rate-limit counter
     broadcast        → optional site-update message for subscribers

   Identity model: the browser generates a random UUID (the device id)
   and keeps it in localStorage. The device id acts as a capability
   token: whoever holds it can manage that device's subscription. It
   is unguessable (122 random bits) but it is NOT authentication —
   documented in PUSH-NOTIFICATIONS-SETUP.md.
   ------------------------------------------------------------------ */

const blobs = require("@netlify/blobs");

const STORE_NAME = "aba-push";

/* v88 FIX — these functions use Netlify's classic (Lambda-compatible)
   handler format, where the Blobs environment is NOT configured
   automatically. Every handler must call connect(event) first; without
   it every storage call throws "The environment has not been
   configured to use Netlify Blobs" and subscribing silently fails.
   Modern-format functions (the scheduler) get the environment
   automatically and call connect() with no event. */
function connect(event) {
  if (event && typeof blobs.connectLambda === "function") {
    try { blobs.connectLambda(event); } catch (e) { /* event had no blobs context */ }
  }
}

/* Deliberately NOT cached across invocations: connectLambda() sets
   per-invocation credentials, and a store object created earlier would
   keep using stale ones in a warm container. getStore() is cheap. */
function store() {
  return blobs.getStore({ name: STORE_NAME });
}

/* Storage self-test for the status endpoint: a real write, read and
   delete. Returns { ok, error? } — never throws. */
async function selfTest() {
  try {
    const key = "selftest:" + Date.now();
    await store().setJSON(key, { t: Date.now() });
    const back = await store().get(key, { type: "json" });
    await store().delete(key);
    if (!back || !back.t) return { ok: false, error: "read-back-failed" };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e && e.name || "storage-error").slice(0, 60) };
  }
}

/* Reads treat "not found" as null but let genuine storage failures
   (misconfigured environment, outage) propagate, so the endpoints
   answer with an error instead of pretending the record never
   existed. */
async function getJson(key) {
  /* v88 FIX — @netlify/blobs v11 has no getJSON(); JSON is read with
     get(key, { type: "json" }). (The old call threw "not a function",
     which the old catch-all turned into "record not found".) */
  const v = await store().get(key, { type: "json" });
  return v === undefined ? null : v;
}
async function setJson(key, value) {
  await store().setJSON(key, value);
}
async function del(key) {
  try { await store().delete(key); } catch (e) { /* already gone */ }
}

/* ---- subscription record ---- */

async function getSub(deviceId) { return getJson("sub:" + deviceId); }

async function putSub(deviceId, subscription, label) {
  const now = Date.now();
  const prev = await getSub(deviceId);
  const rec = {
    deviceId: deviceId,
    endpoint: subscription.endpoint,        // server-side only, never sent out
    keys: subscription.keys,
    label: String(label || "").slice(0, 80),
    status: "active",
    createdAt: prev && prev.createdAt ? prev.createdAt : now,
    updatedAt: now,
    lastSuccess: prev && prev.lastSuccess ? prev.lastSuccess : 0,
    lastFailure: prev && prev.lastFailure ? prev.lastFailure : 0,
    failCount: 0
  };
  await setJson("sub:" + deviceId, rec);
  return rec;
}

async function markDelivered(deviceId) {
  const rec = await getSub(deviceId);
  if (!rec) return;
  rec.lastSuccess = Date.now();
  rec.failCount = 0;
  if (rec.status !== "active") rec.status = "active";
  rec.updatedAt = Date.now();
  await setJson("sub:" + deviceId, rec);
}

/* A push provider answer of 404/410 means the subscription is dead.
   We keep the record for a grace period so the UI can tell the student
   to re-enable, then the next successful subscribe overwrites it. */
async function markInvalid(deviceId) {
  const rec = await getSub(deviceId);
  if (!rec) return;
  rec.status = "invalid";
  rec.lastFailure = Date.now();
  rec.failCount = (rec.failCount || 0) + 1;
  rec.updatedAt = Date.now();
  await setJson("sub:" + deviceId, rec);
}

async function removeSub(deviceId) {
  await del("sub:" + deviceId);
  await del("sent:" + deviceId);
}

/* ---- preferences + snapshot ---- */

async function getPrefs(deviceId) { return getJson("prefs:" + deviceId); }
async function putPrefs(deviceId, prefs) { await setJson("prefs:" + deviceId, prefs); }
async function getSnapshot(deviceId) { return getJson("snap:" + deviceId); }
async function putSnapshot(deviceId, snap) { await setJson("snap:" + deviceId, snap); }

/* ---- idempotency ledger ---- */

async function getSent(deviceId) { return getJson("sent:" + deviceId); }

/* Stamp keys as CONFIRMED-sent and prune old entries. */
function stampConfirmed(rec, keys, nowMs) {
  if (!rec.sent || typeof rec.sent !== "object") rec.sent = {};
  (keys || []).forEach(k => { rec.sent[k] = nowMs; });
  Object.keys(rec.sent).forEach(k => {
    if (nowMs - rec.sent[k] > 30 * 86400000) delete rec.sent[k];
  });
}

async function recordSent(deviceId, keys) {
  const rec = (await getSent(deviceId)) || { sent: {} };
  stampConfirmed(rec, keys, Date.now());
  await setJson("sent:" + deviceId, rec);
}

/* ------------------------------------------------------------------
   v89 — delivery state model (Part 8A): claim → send → confirm/retry.

   The old flow wrote the idempotency key to the ledger BEFORE the
   outbound request, so any send failure was recorded as "sent" and the
   notification was silently dropped forever — a failed delivery
   labelled as delivered. Now:

     1. claimSend()   — reserve the key (in-flight claim, TTL 5 min)
     2. sendPush()    — outbound request to the push service
     3. confirmSent() — ONLY if the push service ACCEPTED it: every key
                        enters the confirmed ledger (duplicate guard)
                        or scheduleRetry() — transient failure backs off
                        exponentially and the key stays sendable;
                        after maxAttempts it is burned into the ledger
                        (give-up — never labelled "sent", tracked as
                        gaveUp in the run summary instead)

   Blobs has no atomic compare-and-swap, so the claim is a
   read-modify-write: two perfectly interleaved runs could still both
   send. The claim narrows that window from "the whole send" to the
   RMW gap; a crash between accept and confirm can produce one
   duplicate (the claim expires and the key re-enters the decision) —
   both residuals are documented honestly in PUSH-NOTIFICATIONS-SETUP.md
   rather than hidden behind the old always-"sent" ledger. */
const CLAIM_TTL_MS = 5 * 60 * 1000;

function emptyDelivery(rec) {
  const r = rec && typeof rec === "object" ? rec : {};
  if (!r.sent || typeof r.sent !== "object") r.sent = {};
  if (!r.pending || typeof r.pending !== "object") r.pending = {};
  return r;
}

async function getDelivery(deviceId) {
  return emptyDelivery(await getJson("sent:" + deviceId));
}

/* Reserve the primary key before the outbound request.
   Returns { ok: true, entry } when this run owns the attempt, or
   { ok: false, reason: "sent" | "in-flight" | "backoff" }. */
async function claimSend(deviceId, key, keys, nowMs) {
  const rec = await getDelivery(deviceId);
  if (rec.sent[key]) return { ok: false, reason: "sent" };
  const p = rec.pending[key];
  if (p && p.nextAt && nowMs < p.nextAt) return { ok: false, reason: "backoff" };
  if (p && !p.nextAt && nowMs - (p.at || 0) < CLAIM_TTL_MS) return { ok: false, reason: "in-flight" };
  const entry = {
    at: nowMs,
    attempts: ((p && p.attempts) || 0) + 1,
    nextAt: null,
    lastStatus: null,
    keys: (keys && keys.length) ? keys.slice() : [key]
  };
  rec.pending[key] = entry;
  await setJson("sent:" + deviceId, rec);
  return { ok: true, entry: entry };
}

/* The push service ACCEPTED the notification: move every key of the
   entry into the confirmed ledger and drop the claim. */
async function confirmSent(deviceId, key) {
  const rec = await getDelivery(deviceId);
  const p = rec.pending[key];
  const keys = (p && Array.isArray(p.keys) && p.keys.length) ? p.keys : [key];
  stampConfirmed(rec, keys, Date.now());
  delete rec.pending[key];
  await setJson("sent:" + deviceId, rec);
}

/* Transient failure: back off. After maxAttempts the entry is burned
   into the confirmed ledger (a permanent "not delivered" — decide()
   must never pick it again) and the caller reports it as gaveUp. */
async function scheduleRetry(deviceId, key, status, backoffMs, maxAttempts, nowMs) {
  const rec = await getDelivery(deviceId);
  const p = rec.pending[key];
  const attempts = (p && p.attempts) || 1;
  if (attempts >= maxAttempts) {
    const keys = (p && Array.isArray(p.keys) && p.keys.length) ? p.keys : [key];
    stampConfirmed(rec, keys, nowMs);
    delete rec.pending[key];
    await setJson("sent:" + deviceId, rec);
    return { retry: false, attempts: attempts };
  }
  if (!p) return { retry: false, attempts: attempts };   // claim vanished — nothing to retry
  p.nextAt = nowMs + backoffMs;
  p.lastStatus = Number.isFinite(status) ? status : 0;
  await setJson("sent:" + deviceId, rec);
  return { retry: true, attempts: attempts, nextAt: p.nextAt };
}

/* The view decide() must see: confirmed keys PLUS every pending key
   that should still be skipped (fresh in-flight claim, or backing off
   but not yet due). Retry-due and stale-claim keys are OMITTED, so the
   decision engine may schedule them again. */
function effectiveSentMap(delivery, nowMs, claimTtl) {
  const d = emptyDelivery(delivery);
  const view = Object.assign({}, d.sent);
  const ttl = Number.isFinite(claimTtl) ? claimTtl : CLAIM_TTL_MS;
  Object.keys(d.pending).forEach(k => {
    if (view[k]) return;
    const p = d.pending[k] || {};
    if (p.nextAt) { if (nowMs < p.nextAt) view[k] = p.nextAt; }
    else if (nowMs - (p.at || 0) < ttl) view[k] = p.at || nowMs;
    /* else: stale claim or retry-due → omitted → re-sendable */
  });
  return view;
}

/* ---- rate limiting ---- */

async function bumpRate(deviceId, action, bucket) {
  const key = "rl:" + action + ":" + deviceId + ":" + bucket;
  const cur = await getJson(key);
  const n = ((cur && cur.n) || 0) + 1;
  await setJson(key, { n: n });
  return n;
}
async function getRate(deviceId, action, bucket) {
  const cur = await getJson("rl:" + action + ":" + deviceId + ":" + bucket);
  return (cur && cur.n) || 0;
}

/* ---- broadcast (site updates) ---- */

async function getBroadcast() { return getJson("broadcast"); }
async function setBroadcast(record) { await setJson("broadcast", record); }

/* ---- housekeeping (scheduler only) ---- */

/* Rate-limit counters are per hour and useless afterwards; delete the
   ones older than two hours (bounded work per run). */
async function pruneRateLimits(nowMs, maxDeletes) {
  const hourBucket = Math.floor(nowMs / 3600000);
  let deleted = 0;
  let cursor;
  do {
    const page = await store().list({ prefix: "rl:", cursor: cursor });
    const entries = page.blobs || page.keys || [];
    for (const e of entries) {
      const key = (e && typeof e === "object") ? e.key : e;
      const bucket = Number(String(key).split(":").pop());
      if (Number.isFinite(bucket) && bucket < hourBucket - 2) {
        await del(key);
        if (++deleted >= maxDeletes) return deleted;
      }
    }
    cursor = page.nextCursor;
  } while (cursor);
  return deleted;
}

/* ---- enumeration (scheduler only) ---- */

async function listDeviceIds() {
  const out = [];
  let cursor;
  do {
    const page = await store().list({ prefix: "sub:", cursor: cursor });
    /* Shape differs across @netlify/blobs versions: newer builds return
       { blobs: [{ key }] }, older ones { keys: [key|{key}] }. Handle
       both so the scheduler never silently sees zero devices. */
    const entries = page.blobs || page.keys || [];
    entries.forEach(e => {
      const raw = (e && typeof e === "object") ? e.key : e;
      const id = String(raw || "").slice(4);   // strip "sub:"
      if (id) out.push(id);
    });
    cursor = page.nextCursor;
  } while (cursor);
  return out;
}

module.exports = {
  STORE_NAME: STORE_NAME,
  connect: connect, selfTest: selfTest, pruneRateLimits: pruneRateLimits,
  getSub: getSub, putSub: putSub,
  markDelivered: markDelivered, markInvalid: markInvalid, removeSub: removeSub,
  getPrefs: getPrefs, putPrefs: putPrefs,
  getSnapshot: getSnapshot, putSnapshot: putSnapshot,
  getSent: getSent, recordSent: recordSent,
  getDelivery: getDelivery, claimSend: claimSend,
  confirmSent: confirmSent, scheduleRetry: scheduleRetry,
  effectiveSentMap: effectiveSentMap, CLAIM_TTL_MS: CLAIM_TTL_MS,
  bumpRate: bumpRate, getRate: getRate,
  getBroadcast: getBroadcast, setBroadcast: setBroadcast,
  listDeviceIds: listDeviceIds
};
