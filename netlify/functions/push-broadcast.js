/* POST /.netlify/functions/push-broadcast   (ADMIN ONLY)

   Sets the one-off "site updates" broadcast record the scheduler
   reads. Every subscribed device receives it at most once per
   `version` (the scheduler's idempotency key), and never during the
   student's quiet hours or on a disabled day.

   Auth: the request must include `token` equal to the ADMIN_TOKEN
   environment variable (set it in the Netlify UI; it is never
   committed). If ADMIN_TOKEN is unset the endpoint refuses to run at
   all, rather than falling open.

   Body: {
     token:   string,
     version: string (1..24 chars) — bump it for every new broadcast,
     title:   string (1..120),
     body:    string (1..200),
     url:     optional route (validated against SAFE_ROUTES by the
              scheduler; anything unknown opens #home)
   }

   Example (Netlify CLI):
     netlify functions:invoke push-broadcast --data \
       '{"token":"…","version":"2026-10-18a","title":"New Practice Sets",
         "body":"Fresh GST practice questions just landed.","url":"ch-gst"}'
*/

const crypto = require("crypto");
const { json, badRequest, readBody } = require("./lib/http");
const store = require("./lib/store");

function tokenMatches(expected, given) {
  /* Compare digests so length differences don't leak through
     timingSafeEqual's fixed-length requirement (and so an empty
     ADMIN_TOKEN can never be matched by an empty body token). */
  if (typeof expected !== "string" || !expected) return false;
  if (typeof given !== "string" || !given) return false;
  const a = crypto.createHash("sha256").update(expected).digest();
  const b = crypto.createHash("sha256").update(given).digest();
  return crypto.timingSafeEqual(a, b);
}

function str(v, min, max) {
  if (typeof v !== "string") return null;
  const s = v.replace(/\s+/g, " ").trim();
  if (s.length < min || s.length > max) return null;
  return s;
}

exports.handler = async function handler(event) {
  store.connect(event);   // v88: required for Netlify Blobs in classic-format functions
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "method-not-allowed" });

  const parsed = readBody(event);
  if (parsed.error) return badRequest(parsed.error);
  const b = parsed.body;

  if (!tokenMatches(process.env.ADMIN_TOKEN, b.token)) {
    /* Same response for "wrong token" and "not configured" so the
       endpoint tells an attacker nothing about the deployment. */
    return json(403, { ok: false, error: "forbidden" });
  }

  const version = str(b.version, 1, 24);
  const title = str(b.title, 1, 120);
  const body = str(b.body, 1, 200);
  if (!version || !title || !body) {
    return badRequest("version/title/body required (1-24 / 1-120 / 1-200 chars)");
  }
  const url = typeof b.url === "string" && b.url ? str(b.url, 1, 64) : "home";

  try {
    await store.setBroadcast({ version, title, body, url, createdAt: Date.now() });
    return json(200, { ok: true, version });
  } catch (e) {
    return json(500, { ok: false, error: "server-error" });
  }
};
