/* POST /.netlify/functions/push-sync
   Updates notification preferences and/or the progress snapshot for a
   device that is already subscribed. Called by the site whenever a
   setting changes, when the student completes something meaningful
   (streak tick, mistakes reviewed, practice finished) and once per
   page load — throttled by a generous per-device rate limit.

   Body: { deviceId, prefs?, snapshot? }

   Only sanitised fields are ever stored; unknown fields are dropped. */

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
  if (b.prefs === undefined && b.snapshot === undefined) return badRequest("nothing-to-sync");
  /* v89 — same rule as subscribe: empty weekday list = 400 with a
     clear message, never a silent "all week". */
  const daysErr = V.prefsDaysError(b.prefs);
  if (daysErr) return badRequest(daysErr);

  try {
    const bucket = V.rateBucket("sync", new Date());
    const n = await store.bumpRate(b.deviceId, "sync", bucket);
    if (!V.rateAllows("sync", n)) return tooMany();

    /* Syncing preferences for a device with no subscription is harmless
       (it only prepares prefs for a future opt-in), but syncing a
       master=true with no subscription would lie about delivery — the
       client always re-reads status after sync. */
    const sub = await store.getSub(b.deviceId);

    if (b.prefs !== undefined) {
      const prev = (await store.getPrefs(b.deviceId)) || null;
      const merged = S.sanitizePrefs(b.prefs, b.prefs && b.prefs.tz);
      /* Never silently re-enable master on a device that unsubscribed. */
      if (!sub) merged.master = false;
      else if (prev && prev.master === false && b.prefs.master === undefined) merged.master = false;
      await store.putPrefs(b.deviceId, merged);
    }
    if (b.snapshot !== undefined) {
      await store.putSnapshot(b.deviceId, S.sanitizeSnapshot(b.snapshot));
    }

    return json(200, { ok: true, subscribed: !!sub, status: sub ? sub.status : "none" });
  } catch (e) {
    return serverError();
  }
};
