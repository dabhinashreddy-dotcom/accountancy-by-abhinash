/* POST /.netlify/functions/push-test
   Sends a GENUINE Web Push message through the push service for this
   device's stored subscription. The site never falls back to a local
   notification while claiming a server test succeeded — if this
   endpoint fails, the UI reports the failure.

   Body: { deviceId }

   Notes on honesty: a 202 from the push service means the message was
   accepted for delivery, which is the strongest signal a server can
   get; actual display still depends on the OS/browser state. The UI
   wording mirrors that. */

const { json, badRequest, tooMany, serverError, readBody } = require("./lib/http");
const V = require("./lib/validate");
const { vapidConfigured, sendPush } = require("./lib/vapid");
const store = require("./lib/store");

exports.handler = async function handler(event) {
  store.connect(event);   // v88: required for Netlify Blobs in classic-format functions
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "method-not-allowed" });

  const parsed = readBody(event);
  if (parsed.error) return badRequest(parsed.error);
  const b = parsed.body;

  if (!V.isDeviceId(b.deviceId)) return badRequest("bad-device-id");

  if (!vapidConfigured()) return json(503, { ok: false, error: "vapid-not-configured" });

  try {
    const bucket = V.rateBucket("test", new Date());
    const n = await store.bumpRate(b.deviceId, "test", bucket);
    if (!V.rateAllows("test", n)) return tooMany();

    const rec = await store.getSub(b.deviceId);
    if (!rec) return json(409, { ok: false, error: "no-subscription" });
    if (rec.status === "invalid") return json(409, { ok: false, error: "subscription-expired" });

    /* v89 — SSRF: re-validate the STORED endpoint against the push
       service allowlist before any outbound request. A record written
       before the allowlist existed can never make this endpoint an
       open relay; the subscription is invalidated so the UI offers a
       fresh one. */
    if (!V.isEndpoint(rec.endpoint)) {
      await store.markInvalid(b.deviceId);
      return json(409, { ok: false, error: "subscription-expired", reason: "endpoint-not-allowed" });
    }

    const payload = {
      kind: "test",
      title: "This is a test notification \u{1F514}",
      body: "Everything is connected. Your scheduled reminders will arrive like this.",
      url: "#settings",
      tag: "aba-test",
      category: "test",
      actions: [{ action: "open", title: "Open Settings", url: "#settings" }],
      timestamp: Date.now()
    };

    const res = await sendPush({ endpoint: rec.endpoint, keys: rec.keys }, payload);

    if (res.ok) {
      await store.markDelivered(b.deviceId);
      return json(200, { ok: true, sent: true, accepted: true, status: res.status });
    }
    if (res.status === 404 || res.status === 410) {
      await store.markInvalid(b.deviceId);
      return json(409, { ok: false, error: "subscription-expired", status: res.status });
    }
    return json(502, { ok: false, error: "send-failed", status: res.status });
  } catch (e) {
    if (String(e && e.message) === "vapid-not-configured") return json(503, { ok: false, error: "vapid-not-configured" });
    return serverError();
  }
};
