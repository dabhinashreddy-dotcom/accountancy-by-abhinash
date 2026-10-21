/* POST /.netlify/functions/push-unsubscribe
   Removes this device's subscription (and its delivery ledger) but
   KEEPS the student's notification preferences, so re-enabling later
   restores every category/schedule choice.

   Body: { deviceId }

   "Paused" and "unsubscribed" are different things: pausing keeps the
   subscription and only silences sends (handled in prefs.pausedUntil);
   this endpoint performs the real removal. */

const { json, badRequest, tooMany, serverError, readBody } = require("./lib/http");
const V = require("./lib/validate");
const store = require("./lib/store");

exports.handler = async function handler(event) {
  store.connect(event);   // v88: required for Netlify Blobs in classic-format functions
  if (event.httpMethod !== "POST") return json(405, { ok: false, error: "method-not-allowed" });

  const parsed = readBody(event);
  if (parsed.error) return badRequest(parsed.error);
  const b = parsed.body;

  if (!V.isDeviceId(b.deviceId)) return badRequest("bad-device-id");

  try {
    const bucket = V.rateBucket("unsubscribe", new Date());
    const n = await store.bumpRate(b.deviceId, "unsubscribe", bucket);
    if (!V.rateAllows("unsubscribe", n)) return tooMany();

    const existed = !!(await store.getSub(b.deviceId));
    await store.removeSub(b.deviceId);
    return json(200, { ok: true, removed: existed });
  } catch (e) {
    return serverError();
  }
};
