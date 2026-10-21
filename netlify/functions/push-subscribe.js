/* POST /.netlify/functions/push-subscribe
   Saves (or refreshes) a browser push subscription together with the
   student's notification preferences and initial progress snapshot.

   Body: { deviceId, subscription: {endpoint, keys:{p256dh, auth}},
           prefs?, snapshot?, label? }

   Rules:
   - full validation before anything is written;
   - per-device rate limit;
   - success is only reported AFTER the record is persisted;
   - the response never echoes the endpoint or the auth secret. */

const { json, badRequest, tooMany, serverError, readBody } = require("./lib/http");
const V = require("./lib/validate");
const S = require("./lib/schedule");
const store = require("./lib/store");

exports.handler = async function handler(event) {
  store.connect(event);   // v88: required for Netlify Blobs in classic-format functions
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "method-not-allowed" });

  const parsed = readBody(event);
  if (parsed.error) return badRequest(parsed.error);
  const b = parsed.body;

  if (!V.isDeviceId(b.deviceId)) return badRequest("bad-device-id");
  if (!V.isSubscription(b.subscription)) return badRequest("bad-subscription");
  /* v89 — an explicitly empty weekday list is a client error with a
     clear message (the UI keeps the previous days instead of sending
     one), never silently stored as "all week". */
  const daysErr = V.prefsDaysError(b.prefs);
  if (daysErr) return badRequest(daysErr);

  try {
    const bucket = V.rateBucket("subscribe", new Date());
    const n = await store.bumpRate(b.deviceId, "subscribe", bucket);
    if (!V.rateAllows("subscribe", n)) return tooMany();

    const prefs = S.sanitizePrefs(b.prefs, b.snapshot && b.snapshot.tz);
    prefs.master = true;                     // subscribing means the student opted in
    await store.putPrefs(b.deviceId, prefs);

    if (b.snapshot) await store.putSnapshot(b.deviceId, S.sanitizeSnapshot(b.snapshot));

    const rec = await store.putSub(b.deviceId, b.subscription, b.label);

    return json(200, {
      ok: true,
      saved: true,
      status: rec.status,
      createdAt: rec.createdAt
    });
  } catch (e) {
    return serverError();
  }
};
