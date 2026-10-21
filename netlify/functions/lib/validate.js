/* ------------------------------------------------------------------
   Validation + rate-limit helpers for the push functions. PURE — no
   dependencies — so tests/push-notification-tests.js can exercise the
   exact logic the server runs.
   ------------------------------------------------------------------ */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const B64URL_RE = /^[A-Za-z0-9_-]+$/;

/* Hard caps — a subscription POST should never be near this big. */
const MAX_BODY_BYTES = 8 * 1024;
const MAX_ENDPOINT_LEN = 512;
const MAX_KEY_LEN = 256;

function isDeviceId(v) {
  return typeof v === "string" && UUID_RE.test(v);
}

/* ------------------------------------------------------------------
   v89 — SSRF hardening (Part 8). The scheduler makes OUTBOUND REQUESTS
   to stored endpoints, so "any https URL" is not safe validation: a
   crafted subscription like https://127.0.0.1:8443/… or
   https://169.254.169.254/… would turn the server into an internal
   probe/relay. Endpoints are therefore ALLOWLISTED to the push services
   browsers actually use — exact-hostname or dot-boundary-suffix rules
   only, never naive "endsWith" (which would accept
   fcm.googleapis.com.evil.example). IP literals (v4/v6), credentials,
   non-443 ports, trailing dots and whitespace are all rejected.
   Re-validated AGAINST THE STORED VALUE at send time (run-scheduler +
   push-test), so a record written before this allowlist existed can
   never be used for an outbound request. */
const PUSH_HOST_EXACT = [
  "fcm.googleapis.com",                 // Chrome / Edge / Android
  "android.googleapis.com",             // legacy FCM endpoints
  "gcm-http.googleapis.com",            // legacy GCM endpoints
  "mtalk.google.com",                   // legacy GCM endpoints
  "updates.push.services.mozilla.com",  // Firefox
  "api.push.apple.com",                 // Safari production
  "api.sandbox.push.apple.com",         // Safari sandbox
  "api.development.push.apple.com"      // Safari development
];
const PUSH_HOST_SUFFIX = [
  "notify.windows.com",  // WNS (Edge/Chrome on Windows)
  "notify.live.net",     // WNS
  "notify.live.com"      // WNS
];
const IPV4_RE = /^\d{1,3}(\.\d{1,3}){3}$/;
const WS_RE = /[\s\x00-\x1f]/;

function hostnameAllowed(host) {
  if (typeof host !== "string" || !host) return false;
  if (host.charAt(0) === "[") return false;               // IPv6 literal
  if (IPV4_RE.test(host)) return false;                   // IPv4 literal
  if (host.charAt(host.length - 1) === ".") return false; // trailing-dot bypass
  if (PUSH_HOST_EXACT.indexOf(host) !== -1) return true;
  for (let i = 0; i < PUSH_HOST_SUFFIX.length; i++) {
    const s = PUSH_HOST_SUFFIX[i];
    /* dot-boundary suffix match: "db3.notify.windows.com" yes,
       "notify.windows.com.evil.example" / "xnotify.windows.com" no */
    if (host.length > s.length + 1 && host.slice(-(s.length + 1)) === "." + s) return true;
  }
  return false;
}

function isEndpoint(v) {
  if (typeof v !== "string" || !v.length || v.length > MAX_ENDPOINT_LEN) return false;
  if (WS_RE.test(v)) return false;                         // whitespace/control chars
  try {
    const u = new URL(v);
    if (u.protocol !== "https:") return false;             // never http/javascript/data
    if (u.username || u.password) return false;            // no credentials in URLs
    if (u.port && u.port !== "443") return false;          // default port only
    return hostnameAllowed((u.hostname || "").toLowerCase());
  } catch (e) { return false; }
}

function isB64UrlKey(v) {
  return typeof v === "string" && v.length > 10 && v.length <= MAX_KEY_LEN && B64URL_RE.test(v);
}

/* Full subscription object check (the browser's PushSubscription JSON). */
function isSubscription(sub) {
  return !!sub && typeof sub === "object" &&
    isEndpoint(sub.endpoint) &&
    !!sub.keys && typeof sub.keys === "object" &&
    isB64UrlKey(sub.keys.p256dh) && isB64UrlKey(sub.keys.auth);
}

function bodyTooLarge(rawBody) {
  if (typeof rawBody !== "string") return false;
  return Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES;
}

/* Parse JSON safely; returns null on garbage. */
function parseJson(raw) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try { const v = JSON.parse(raw); return (v && typeof v === "object") ? v : null; }
  catch (e) { return null; }
}

/* Best-effort, per-device, per-action rate limiting. Counters live in
   the same Blobs store as everything else (no atomic increment — this
   is a courtesy limiter on top of Netlify's platform protections).
   bucket = current window start (epoch ms), computed from `now` so the
   logic is testable. */
const RATE_WINDOWS = {
  subscribe: { windowMs: 60 * 60 * 1000, max: 12 },   // 12/hour
  unsubscribe: { windowMs: 60 * 60 * 1000, max: 12 },
  sync: { windowMs: 60 * 60 * 1000, max: 120 },       // snapshot syncs are frequent-ish
  test: { windowMs: 60 * 60 * 1000, max: 5 },         // test pushes: 5/hour
  /* v89 — exam access codes (exam-access.js): a student typing codes
     should never get more than a handful of tries per hour, per
     candidate identity. The codes themselves live only in env vars. */
  examunlock: { windowMs: 60 * 60 * 1000, max: 10 },  // 10 code tries/hour
  examadmin: { windowMs: 60 * 60 * 1000, max: 12 }    // 12 report checks/hour
};

/* v89 — preference days validation shared by the handlers. A prefs
   object that carries an EXPLICIT days list must carry at least one
   valid weekday (0–6); an empty (or garbage-only) list is a clear
   client error, answered with 400 "no-days-selected" so the UI can say
   so — never silently reinterpreted as "all week". Absent/invalid-typed
   days mean "defaults apply" (sanitizePrefs fills them in). */
function prefsDaysError(prefs) {
  if (!prefs || typeof prefs !== "object" || !Array.isArray(prefs.days)) return null;
  const days = prefs.days.filter(d => Number.isInteger(d) && d >= 0 && d <= 6);
  return days.length ? null : "no-days-selected";
}

function rateBucket(action, now) {
  const w = RATE_WINDOWS[action];
  if (!w) return null;
  return Math.floor(now.getTime() / w.windowMs);
}

function rateKey(deviceId, action, bucket) {
  return "rl:" + action + ":" + deviceId + ":" + bucket;
}

function rateAllows(action, count) {
  const w = RATE_WINDOWS[action];
  if (!w) return true;
  return (Number(count) || 0) < w.max;
}

module.exports = {
  isDeviceId: isDeviceId,
  isEndpoint: isEndpoint,
  isSubscription: isSubscription,
  bodyTooLarge: bodyTooLarge,
  parseJson: parseJson,
  prefsDaysError: prefsDaysError,
  RATE_WINDOWS: RATE_WINDOWS,
  rateBucket: rateBucket,
  rateKey: rateKey,
  rateAllows: rateAllows
};
