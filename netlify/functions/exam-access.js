/* POST /.netlify/functions/exam-access

   v89 — Part 6 of the security audit: the exam unlock codes and the
   admin report token used to live in plaintext inside app.js. The
   authorization decision now happens HERE, against environment
   variables; the shipped JavaScript contains no secret at all.

   Body: { purpose: "unlock" | "admin", code? | token?, candidateId? }

   Responses (deliberately minimal):
     200 { ok: true, grant: "two" | "unlimited" }   unlock matched
     200 { ok: true }                               admin token matched
     400 bad body / unknown purpose
     403 { ok: false, error: "invalid-code" }       nothing matched
     429 { ok: false, error: "rate-limited" }       too many tries this hour
     503 { ok: false, error: "unlock-unavailable" } no codes configured

   The client applies the returned grant to its LOCAL day record (the
   exam store is device-local by design); the server never sees exam
   attempts. Rate limiting is per candidateId, persisted in Netlify
   Blobs, with a documented in-memory fallback. */

const { json, badRequest, readBody } = require("./lib/http");
const V = require("./lib/validate");
const store = require("./lib/store");
const ACCESS = require("./lib/exam-access");

function str(v, min, max) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (s.length < min || s.length > max) return null;
  return s;
}

exports.handler = async function handler(event) {
  store.connect(event);   // required for Netlify Blobs in classic-format functions
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "method-not-allowed" });

  const parsed = readBody(event);
  if (parsed.error) return badRequest(parsed.error);
  const b = parsed.body;

  const purpose = str(b.purpose, 1, 16);
  if (purpose !== "unlock" && purpose !== "admin") return badRequest("unknown-purpose");

  const value = purpose === "unlock" ? str(b.code, 1, 64) : str(b.token, 1, 128);
  if (!value) return badRequest(purpose === "unlock" ? "code-required" : "token-required");

  /* Candidate identity: any well-formed id (the browser's exam
     candidate id or device UUID). Unparsable ids still get served,
     just under the fixed "unknown" bucket — a broken client must not
     bypass the limiter. */
  const rawId = str(b.candidateId, 8, 64);
  const candidateId = (rawId && /^[A-Za-z0-9-]+$/.test(rawId)) ? rawId : "unknown";

  try {
    const verdict = await ACCESS.verify({ purpose: purpose, value: value, candidateId: candidateId });
    if (verdict.status === "ok") {
      return purpose === "unlock"
        ? json(200, { ok: true, grant: verdict.grant })
        : json(200, { ok: true });
    }
    if (verdict.status === "rate-limited") return json(429, { ok: false, error: "rate-limited" });
    if (verdict.status === "unavailable") return json(503, { ok: false, error: "unlock-unavailable" });
    /* One answer for every mismatch — wrong code, wrong token, nothing
       configured (admin): the response never distinguishes them. */
    return json(403, { ok: false, error: purpose === "unlock" ? "invalid-code" : "forbidden" });
  } catch (e) {
    return json(500, { ok: false, error: "server-error" });
  }
};
