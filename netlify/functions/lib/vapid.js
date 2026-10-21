/* ------------------------------------------------------------------
   VAPID + web-push plumbing. The private key only ever exists in the
   server environment variables — it is never sent to a browser and
   never written to the repository.
     VAPID_PUBLIC_KEY   base64url VAPID public key
     VAPID_PRIVATE_KEY  base64url VAPID private key
     VAPID_SUBJECT      mailto:you@example.com or https://your-site
   Generate with:  npm run vapid:generate
   (see PUSH-NOTIFICATIONS-SETUP.md for the exact steps.)

   v88: the three variables are now VALIDATED, not just checked for
   presence. A pasted value with stray quotes/spaces is cleaned; a
   wrong-length key, a bad subject, or a public key that does not match
   the private key is reported by name (never by value) so the status
   endpoint and the Settings card can say exactly what is wrong.
   ------------------------------------------------------------------ */

const crypto = require("crypto");
const webpush = require("web-push");

const B64URL_RE = /^[A-Za-z0-9_-]+$/;

/* Env values are often pasted with surrounding spaces, newlines or
   quotes. Clean them rather than failing on invisible characters. */
function clean(v) {
  if (typeof v !== "string") return "";
  let s = v.trim();
  if (s.length >= 2 && ((s[0] === '"' && s[s.length - 1] === '"') || (s[0] === "'" && s[s.length - 1] === "'"))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

function readEnv(env) {
  env = env || process.env;
  return {
    publicKey: clean(env.VAPID_PUBLIC_KEY),
    privateKey: clean(env.VAPID_PRIVATE_KEY),
    subject: clean(env.VAPID_SUBJECT)
  };
}

function b64urlToBuf(s) {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

/* Full validation. Returns
     { ok, missing:[names], problems:[{variable, code}] }
   Only variable NAMES and fixed codes are returned — never key material. */
function vapidStatus(env) {
  const v = readEnv(env);
  const missing = [];
  const problems = [];
  if (!v.publicKey) missing.push("VAPID_PUBLIC_KEY");
  if (!v.privateKey) missing.push("VAPID_PRIVATE_KEY");
  if (!v.subject) missing.push("VAPID_SUBJECT");

  let pubBuf = null, privBuf = null;
  if (v.publicKey) {
    if (!B64URL_RE.test(v.publicKey)) problems.push({ variable: "VAPID_PUBLIC_KEY", code: "not-base64url" });
    else {
      pubBuf = b64urlToBuf(v.publicKey);
      if (pubBuf.length !== 65 || pubBuf[0] !== 4) { problems.push({ variable: "VAPID_PUBLIC_KEY", code: "wrong-length" }); pubBuf = null; }
    }
  }
  if (v.privateKey) {
    if (!B64URL_RE.test(v.privateKey)) problems.push({ variable: "VAPID_PRIVATE_KEY", code: "not-base64url" });
    else {
      privBuf = b64urlToBuf(v.privateKey);
      if (privBuf.length !== 32) { problems.push({ variable: "VAPID_PRIVATE_KEY", code: "wrong-length" }); privBuf = null; }
    }
  }
  if (v.subject && !/^(mailto:[^\s@]+@[^\s@]+\.[^\s@]+|https:\/\/[^\s]+)$/i.test(v.subject)) {
    problems.push({ variable: "VAPID_SUBJECT", code: "must-be-mailto-or-https" });
  }
  /* The two keys must be a genuine pair. */
  if (pubBuf && privBuf) {
    try {
      const ecdh = crypto.createECDH("prime256v1");
      ecdh.setPrivateKey(privBuf);
      if (!ecdh.getPublicKey().equals(pubBuf)) problems.push({ variable: "VAPID_PUBLIC_KEY", code: "does-not-match-private-key" });
    } catch (e) {
      problems.push({ variable: "VAPID_PRIVATE_KEY", code: "invalid-key" });
    }
  }
  return { ok: missing.length === 0 && problems.length === 0, missing: missing, problems: problems };
}

function vapidConfigured(env) {
  return vapidStatus(env).ok;
}

/* The cleaned public key to hand to browsers. */
function publicKey(env) {
  return readEnv(env).publicKey;
}

function ensureVapid() {
  if (!vapidConfigured()) throw new Error("vapid-not-configured");
  const v = readEnv();
  /* Re-applied on every call (cheap) so a warm container can never
     hold stale details. */
  webpush.setVapidDetails(v.subject, v.publicKey, v.privateKey);
  return webpush;
}

/* Send one push payload to one subscription.
   Returns { ok, status } — status 404/410 means the subscription is
   permanently dead and the caller should mark it invalid. */
async function sendPush(subscription, payload) {
  const wp = ensureVapid();
  try {
    const res = await wp.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys
      },
      JSON.stringify(payload),
      {
        TTL: 2 * 24 * 3600,        // expire undeliverable messages after 2 days
        urgency: "normal",
        /* Topic must be URL-safe base64 characters, max 32. */
        topic: payload && payload.tag ? (String(payload.tag).replace(/[^A-Za-z0-9_-]/g, "-").slice(0, 32) || undefined) : undefined,
        timeout: 8000               // never let one slow push service stall a scheduler run
      }
    );
    return { ok: true, status: res.statusCode };
  } catch (e) {
    const status = e && e.statusCode ? e.statusCode : 0;
    return { ok: false, status: status, error: String(e && e.message || e).slice(0, 200) };
  }
}

module.exports = {
  vapidConfigured: vapidConfigured,
  vapidStatus: vapidStatus,
  publicKey: publicKey,
  ensureVapid: ensureVapid,
  sendPush: sendPush
};
