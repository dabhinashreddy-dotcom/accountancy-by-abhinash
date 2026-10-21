/* GET /.netlify/functions/push-config
   Returns the VAPID public key and whether server push is fully
   configured AND able to store subscriptions. The public key is public
   by design (it is sent to the browser during subscription); the
   private key never leaves the server environment. The response is
   no-store so a rotated key is picked up immediately.

   v88: `configured` is true only when
     (1) all three VAPID variables are present and VALID (right length,
         a genuine key pair, a mailto:/https: subject), AND
     (2) a real write/read/delete against Netlify Blobs succeeds.
   Failures name the variable (never its value) so the problem can be
   fixed without guessing:
     reason: "vapid-missing" | "vapid-invalid" | "storage-unavailable" */

const { json } = require("./lib/http");
const { vapidStatus, publicKey } = require("./lib/vapid");
const store = require("./lib/store");

exports.handler = async function handler(event) {
  store.connect(event);
  const vapid = vapidStatus();
  const storage = await store.selfTest();
  const configured = vapid.ok && storage.ok;
  const reason = configured ? null
    : vapid.missing.length ? "vapid-missing"
    : !vapid.ok ? "vapid-invalid"
    : "storage-unavailable";
  return json(200, {
    ok: true,
    configured: configured,
    reason: reason,
    publicKey: configured ? publicKey() : null,
    vapid: { ok: vapid.ok, missing: vapid.missing, problems: vapid.problems },
    storage: { ok: storage.ok, error: storage.ok ? null : storage.error }
  });
};
