/* ------------------------------------------------------------------
   Exam access codes (v89 — Part 6 of the security audit).

   The unlock codes and the admin token used to ship inside app.js in
   plaintext: anyone who downloaded the site held every secret. They
   now exist ONLY in Netlify environment variables. This module is the
   single place that compares an input against them.

   Environment variables (all optional):
     EXAM_UNLOCK_TWO        grants +2 attempts for today
     EXAM_UNLOCK_UNLIMITED  grants unlimited attempts for today
     EXAM_ADMIN_TOKEN       authorizes the local diagnostics report

   Properties:
   - timing-safe digest comparison (input length never leaks);
   - the endpoint reveals nothing about WHICH code matched, how many
     codes exist, or whether a guess was "close";
   - per-candidate rate limiting, persisted in Netlify Blobs through
     the shared push store, with an in-memory per-instance fallback
     when Blobs is unreachable (a courtesy layer only — documented
     honestly in PUSH-NOTIFICATIONS-SETUP.md);
   - no secret, hash or hint is ever returned to the client.
   ------------------------------------------------------------------ */

const crypto = require("crypto");
const store = require("./store");
const V = require("./validate");

/* Trimmed env values; empty/unset means "not configured". */
function codes(env) {
  const e = env || process.env;
  const one = (v) => (typeof v === "string" && v.trim()) ? v.trim() : null;
  return { two: one(e.EXAM_UNLOCK_TWO), unlimited: one(e.EXAM_UNLOCK_UNLIMITED), admin: one(e.EXAM_ADMIN_TOKEN) };
}

/* Compare digests so length differences don't leak through
   timingSafeEqual's fixed-length requirement (and so an empty
   expected value can never be matched by an empty input). */
function matches(expected, given) {
  if (typeof expected !== "string" || !expected) return false;
  if (typeof given !== "string" || !given) return false;
  const a = crypto.createHash("sha256").update(expected).digest();
  const b = crypto.createHash("sha256").update(given).digest();
  return crypto.timingSafeEqual(a, b);
}

/* ---- rate limiting ------------------------------------------------
   Primary: the shared Blobs store (persists across instances).
   Fallback: an in-memory counter per warm container. The fallback is
   NOT a strong boundary — serverless instances are ephemeral and
   distributed — it only slows down a single hot instance. Blobs
   failure never turns into an allowance: we keep counting in memory
   and the platform-level protections still apply. */

const memCounts = new Map();     // "action:id:bucket" -> n (bounded)
const MEM_MAX_KEYS = 5000;

function memBump(key) {
  const n = (memCounts.get(key) || 0) + 1;
  if (memCounts.size > MEM_MAX_KEYS && !memCounts.has(key)) memCounts.clear();
  memCounts.set(key, n);
  return n;
}

async function attemptsUsed(action, id, bucket) {
  const key = V.rateKey(id, action, bucket);
  try {
    return await store.bumpRate(id, action, bucket);
  } catch (e) {
    /* Blobs unreachable — count in memory and carry on. */
    return memBump(key);
  }
}

/* ---- the one verdict ---------------------------------------------
   Returns { status, grant? } where status is one of:
     "ok"           — a configured code/token matched (grant set for unlocks)
     "invalid"      — nothing matched (never says how close)
     "rate-limited" — the candidate exhausted this hour's tries
     "unavailable"  — nothing is configured on this deployment
*/
async function verify(opts) {
  const o = opts || {};
  const purpose = o.purpose;
  const value = typeof o.value === "string" ? o.value : "";
  const candidateId = typeof o.candidateId === "string" ? o.candidateId : "unknown";
  const now = o.now instanceof Date ? o.now : new Date();
  const c = o.env ? codes(o.env) : codes();

  if (purpose === "unlock") {
    if (!c.two && !c.unlimited) return { status: "unavailable" };
    const bucket = V.rateBucket("examunlock", now);
    const used = await attemptsUsed("examunlock", candidateId, bucket);
    if (!V.rateAllows("examunlock", used)) return { status: "rate-limited" };
    if (matches(c.unlimited, value)) return { status: "ok", grant: "unlimited" };
    if (matches(c.two, value)) return { status: "ok", grant: "two" };
    return { status: "invalid" };
  }

  if (purpose === "admin") {
    /* Indistinguishable from a wrong token when unset, exactly like
       push-broadcast's ADMIN_TOKEN gate: the endpoint tells an
       attacker nothing about the deployment. */
    if (!c.admin) return { status: "invalid" };
    const bucket = V.rateBucket("examadmin", now);
    const used = await attemptsUsed("examadmin", candidateId, bucket);
    if (!V.rateAllows("examadmin", used)) return { status: "rate-limited" };
    if (matches(c.admin, value)) return { status: "ok" };
    return { status: "invalid" };
  }

  return { status: "invalid" };
}

module.exports = { codes, matches, verify };
