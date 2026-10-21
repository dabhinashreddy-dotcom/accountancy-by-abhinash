/* ============================================================
   v88 integration suite — REAL @netlify/blobs client + REAL store.js +
   REAL function handlers, against a LOCAL MOCK of Netlify's Blobs edge
   server (an in-memory HTTP server). Dev only.

   What this proves:  the code path that failed silently before v88
   (Lambda-compat functions never calling connectLambda) now works, the
   handlers persist and read back real records through the real client,
   and the scheduler enumerates + sends through the real store.
   What it does NOT prove: that Netlify's production Blobs service
   accepts the requests (that is the live test), or any real push
   delivery (push-service sends are mocked here).

   Run:  node tests/push-blobs-integration-tests.js
   ============================================================ */
const http = require("http");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0; const failures = [];
function ok(c, n, d) { if (c) pass++; else { fail++; failures.push(n + (d ? " — " + d : "")); } }
console.log("push-blobs-integration-tests (real client, MOCK Netlify edge server)");

const data = new Map();   // "store/key" -> body string
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  const parts = u.pathname.split("/").filter(Boolean);      // [site, store, key?]
  if (req.headers.authorization !== "Bearer test-token") { res.writeHead(401); return res.end(); }
  const store = parts[1], key = parts[2] ? decodeURIComponent(parts[2]) : null;
  const k = store + "/" + key;
  let body = "";
  req.on("data", c => body += c);
  req.on("end", () => {
    if (!key) {                                             // list
      const prefix = u.searchParams.get("prefix") || "";
      const blobs = [...data.keys()].filter(x => x.startsWith(store + "/")).map(x => x.slice(store.length + 1))
        .filter(x => x.startsWith(prefix)).map(x => ({ key: x, etag: "e", size: 1 }));
      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ blobs: blobs, directories: [] }));
    }
    if (req.method === "PUT") { data.set(k, body); res.writeHead(200); return res.end(); }
    if (req.method === "DELETE") { data.delete(k); res.writeHead(204); return res.end(); }
    if (!data.has(k)) { res.writeHead(404); return res.end(); }
    res.writeHead(200); res.end(data.get(k));
  });
});

(async function main() {
  await new Promise(r => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const wp = require(path.join(ROOT, "node_modules/web-push"));
  const store = require(path.join(ROOT, "netlify/functions/lib/store.js"));
  const RS = require(path.join(ROOT, "netlify/functions/lib/run-scheduler.js"));

  /* A Lambda-style event exactly as Netlify delivers it to classic functions. */
  const blobsB64 = Buffer.from(JSON.stringify({ url: "http://127.0.0.1:" + port, token: "test-token" })).toString("base64");
  const evt = (body, method) => ({
    httpMethod: method || "POST", body: body === undefined ? "" : JSON.stringify(body),
    blobs: blobsB64, headers: { "x-nf-site-id": "site-123", "x-nf-deploy-id": "deploy-1" }
  });

  const kp = wp.generateVAPIDKeys();
  process.env.VAPID_PUBLIC_KEY = kp.publicKey;
  process.env.VAPID_PRIVATE_KEY = kp.privateKey;
  process.env.VAPID_SUBJECT = "mailto:owner@example.com";

  const H = n => require(path.join(ROOT, "netlify/functions/" + n + ".js")).handler;
  const call = async (n, body, method) => { const r = await H(n)(evt(body, method)); return { status: r.statusCode, body: JSON.parse(r.body) }; };

  /* 1. WITHOUT connect (the pre-v88 behaviour) storage must fail loudly. */
  delete process.env.NETLIFY_BLOBS_CONTEXT; delete globalThis.netlifyBlobsContext;
  let threw = null;
  try { await store.getSub("11111111-1111-4111-8111-111111111111"); } catch (e) { threw = e; }
  ok(threw && /not been configured/i.test(String(threw.message)), "I1 without connect(), the Blobs client refuses to work (this is the bug v88 fixes)", threw && threw.message);

  /* 2. push-config with a connected event → configured:true via a real write/read/delete. */
  let r = await call("push-config", undefined, "GET");
  ok(r.status === 200 && r.body.configured === true && r.body.storage.ok === true && r.body.publicKey === kp.publicKey,
    "I2 push-config reports configured:true after a real storage self-test", JSON.stringify(r.body));
  ok(![...data.keys()].some(k => k.includes("selftest")), "I2 the self-test cleans up after itself");

  /* 3. subscribe → persisted through the real client. */
  const id = "55555555-5555-4555-8555-555555555555";
  const sub = { endpoint: "https://fcm.googleapis.com/fcm/send/real-ish", keys: { p256dh: "B".repeat(60), auth: "c".repeat(22) } };
  r = await call("push-subscribe", { deviceId: id, subscription: sub, prefs: { time: "09:00" }, snapshot: { tz: "UTC", streak: 2 }, label: "Test" });
  ok(r.status === 200 && r.body.ok && r.body.saved, "I3 subscribe succeeds through the real Blobs client", JSON.stringify(r.body));
  ok(data.has("site:aba-push/sub:" + id) && data.has("site:aba-push/prefs:" + id) && data.has("site:aba-push/snap:" + id), "I3 subscription, preferences and snapshot are physically stored");

  /* 4. sync + unsubscribe round trip. */
  r = await call("push-sync", { deviceId: id, prefs: { time: "07:45" } });
  ok(r.status === 200 && r.body.subscribed === true, "I4 sync reads the stored subscription back");
  ok(JSON.parse(data.get("site:aba-push/prefs:" + id)).time === "07:45", "I4 updated preferences were persisted");

  /* 4b. v89 — an explicitly empty weekday list is a clear 400, never
     silently stored as "all week". */
  r = await call("push-sync", { deviceId: id, prefs: { days: [] } });
  ok(r.status === 400 && r.body.error === "no-days-selected",
    "I4b an empty day list is rejected with a clear message and nothing is stored", JSON.stringify(r.body));
  r = await call("push-subscribe", { deviceId: "77777777-7777-4777-8777-777777777777", subscription: sub, prefs: { days: [] } });
  ok(r.status === 400 && r.body.error === "no-days-selected",
    "I4b subscribe applies the same rule", JSON.stringify(r.body));
  ok(!data.has("site:aba-push/sub:77777777-7777-4777-8777-777777777777"), "I4b a rejected subscribe persists nothing");

  /* 5. test notification: real handler + real store; the push-service call is MOCKED. */
  const vapid = require(path.join(ROOT, "netlify/functions/lib/vapid.js"));
  const origSend = wp.sendNotification;
  let sentTo = null;
  wp.sendNotification = async (s, payload) => { sentTo = { s, payload: JSON.parse(payload) }; return { statusCode: 201 }; };
  r = await call("push-test", { deviceId: id });
  ok(r.status === 200 && r.body.sent === true && sentTo && sentTo.payload.kind === "test" && sentTo.s.endpoint === sub.endpoint,
    "I5 [push service MOCKED] test endpoint sends the stored subscription a labelled test payload", JSON.stringify(r.body));

  wp.sendNotification = async () => { const e = new Error("gone"); e.statusCode = 410; throw e; };
  r = await call("push-test", { deviceId: id });
  ok(r.status === 409 && r.body.error === "subscription-expired", "I5 [MOCKED 410] expired subscription → 409 subscription-expired");
  ok(JSON.parse(data.get("site:aba-push/sub:" + id)).status === "invalid", "I5 the subscription is marked invalid in storage");

  /* 5b. v89 SSRF — the STORED endpoint is re-validated before any
     outbound request, even for records written long ago. */
  {
    const rec = JSON.parse(data.get("site:aba-push/sub:" + id));
    rec.endpoint = "https://127.0.0.1:9/internal-probe";
    rec.status = "active";               // a legacy record written before the allowlist
    data.set("site:aba-push/sub:" + id, JSON.stringify(rec));
    let probed = false;
    wp.sendNotification = async () => { probed = true; return { statusCode: 201 }; };
    r = await call("push-test", { deviceId: id });
    ok(r.status === 409 && r.body.reason === "endpoint-not-allowed",
      "I5b [SSRF] a non-allowlisted stored endpoint is refused before any outbound request", JSON.stringify(r.body));
    ok(!probed, "I5b the push service was never contacted for the rejected endpoint");
    ok(JSON.parse(data.get("site:aba-push/sub:" + id)).status === "invalid", "I5b the offending subscription is invalidated");
  }

  /* 6. scheduler over the real store (modern-format function: env context set globally). */
  r = await call("push-subscribe", { deviceId: id, subscription: sub, prefs: { time: "09:00" }, snapshot: { tz: "UTC", streak: 4 }, label: "Test" });
  ok(r.body.status === "active", "I6 re-subscribing revives an invalid subscription");
  const delivered = [];
  wp.sendNotification = async (s, payload) => { delivered.push(JSON.parse(payload)); return { statusCode: 201 }; };
  const when = () => new Date(Date.UTC(2026, 9, 21, 10, 0, 0));       // Wed 10:00 UTC
  let sum = await RS.runScheduler({ nowFn: when });
  ok(sum.devices === 1 && sum.sent >= 1 && delivered.length >= 1, "I6 [push service MOCKED] scheduler lists devices from the real store and delivers", JSON.stringify(sum));
  const n1 = delivered.length;
  for (let i = 0; i < 6; i++) await RS.runScheduler({ nowFn: when });
  const tags = delivered.map(d => d.category);
  ok(new Set(tags).size === tags.length, "I6 repeated runs never repeat a notification (ledger persisted in Blobs)", JSON.stringify(tags));
  ok(JSON.parse(data.get("site:aba-push/sent:" + id)).sent && Object.keys(JSON.parse(data.get("site:aba-push/sent:" + id)).sent).length >= n1, "I6 the delivery ledger is stored");

  /* 6b. v89 — the claim → send → confirm/retry pipeline through the
     REAL store (physical Blobs records), push service MOCKED:
     a failed delivery is pending+backoff, never "sent"; the retry
     after the backoff confirms it. */
  {
    const id2 = "66666666-6666-4666-8666-666666666666";
    await call("push-subscribe", { deviceId: id2, subscription: sub, prefs: { time: "09:00" }, snapshot: { tz: "UTC" }, label: "Retry" });
    let clock = Date.UTC(2026, 9, 21, 10, 0, 0);
    const when2 = () => new Date(clock);
    let attempts = 0;
    wp.sendNotification = async () => { attempts++; const e = new Error("boom"); e.statusCode = 503; throw e; };
    let s2 = await RS.runScheduler({ nowFn: when2 });
    ok(s2.retried === 1 && s2.gaveUp === 0, "I8 [MOCKED 503] the real store schedules a retry — a failure is never recorded as sent", JSON.stringify(s2));
    const rec8 = JSON.parse(data.get("site:aba-push/sent:" + id2));
    ok(Object.keys(rec8.sent || {}).length === 0, "I8 the confirmed ledger stays physically EMPTY after a failed send");
    ok(Object.keys(rec8.pending || {}).length === 1, "I8 the pending claim (with backoff) is persisted in Blobs");
    await RS.runScheduler({ nowFn: when2 });          // same instant: inside backoff
    ok(attempts === 1, "I8 a scheduler run inside the backoff window makes no attempt");
    clock += 3 * 60000;                               // 2-minute backoff elapsed
    wp.sendNotification = async (s, payload) => { attempts++; delivered.push(JSON.parse(payload)); return { statusCode: 201 }; };
    s2 = await RS.runScheduler({ nowFn: when2 });
    ok(attempts === 2 && s2.sent === 1, "I8 the retry after the backoff succeeds and is counted as sent", JSON.stringify(s2));
    const rec8b = JSON.parse(data.get("site:aba-push/sent:" + id2));
    ok(Object.keys(rec8b.pending || {}).length === 0 && Object.keys(rec8b.sent || {}).length > 0,
      "I8 after success the pending entry is gone and the key is confirmed in Blobs");
    const before8 = attempts;
    await RS.runScheduler({ nowFn: when2 });
    ok(attempts === before8, "I8 a confirmed key is never sent again");
  }

  r = await call("push-unsubscribe", { deviceId: id });
  ok(r.status === 200 && r.body.removed === true && !data.has("site:aba-push/sub:" + id) && data.has("site:aba-push/prefs:" + id), "I7 unsubscribe removes the subscription, keeps preferences");

  wp.sendNotification = origSend;
  server.close();
  console.log(`\npush-blobs-integration-tests: ${pass} passed, ${fail} failed`);
  if (fail) { console.log("Failures:"); failures.forEach(f => console.log("  x " + f)); process.exit(1); }
})().catch(e => { console.error(e); server.close(); process.exit(1); });
