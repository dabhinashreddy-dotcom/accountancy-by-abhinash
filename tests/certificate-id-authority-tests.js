/* Certificate-ID AUTHORITY — the id stored in Supabase IS the certificate id.
   Run: node tests/certificate-id-authority-tests.js   (Node 18+, no packages)
   Dev only, not loaded by the website.

   Bug reproduced and pinned (v95 fix): the browser used to issue its own
   provisional id (per-device counter) and NEVER adopt the certificate_id
   the database allocated — so the earned certificate could show
   ACC-OCT2026-0042 locally while Supabase stored a different number.
   The fix: examAdoptServerCertificateId / examAdoptStoredServerIds
   (app.js) re-key the certificate to the REGISTERED id the moment the
   server confirms it; every surface (exam store, device register,
   certificate view, lookup, the sheet that PDF/print/PNG are rendered
   from) renders that one record.

   SIMULATED vs GENUINE — clearly separated:
   - Tests A–F execute the REAL code of app.js (the local exam-store
     region), exam-records-supabase.js and certificate.js in a Node vm,
     against a fetch stub that plays the Supabase PostgREST RPC
     endpoint. The database side is SIMULATED; nothing is
     re-implemented — the exact code paths the browser runs are the
     ones under test.
   - Test G is a genuine integration check against the CONNECTED
     Supabase project, performed on the live site and logged in
     SUPABASE-EXAM-RECORDS-SETUP.md (verification log). */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ExamRules = require(path.resolve(__dirname, "..", "exam-rules.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }
async function settle(rounds) { for (let i = 0; i < (rounds || 4); i++) await new Promise((r) => setTimeout(r, 0)); }

/* ---- sources under test (the SAME files the browser loads) ---- */
const appSrc = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
const START = appSrc.indexOf('const EXAM_STORE_KEY = "abhinash_exam_store_v1";');
const END = appSrc.indexOf("async function examApi(");
if (START === -1 || END === -1 || END <= START) {
  console.error("FATAL: could not locate the local exam store region in app.js");
  process.exit(1);
}
const storeSrc = appSrc.slice(START, END);
const accessClientSrc = fs.readFileSync(path.resolve(__dirname, "..", "exam-access-client.js"), "utf8");
const recordsSrc = fs.readFileSync(path.resolve(__dirname, "..", "exam-records-supabase.js"), "utf8");
const certSrc = fs.readFileSync(path.resolve(__dirname, "..", "certificate.js"), "utf8");

/* ---- fake storage + a bank that satisfies every paper draw ---- */
function makeStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    map: m
  };
}
const ALL_CHAPTERS = ExamRules.EXAM_PAPERS[0].chapters;
const QUIZ = [];
for (let i = 0; i < 90; i++) {
  QUIZ.push({
    id: "q" + i,
    chapter: ALL_CHAPTERS[i % ALL_CHAPTERS.length],
    difficulty: i % 5 === 0 ? "Hard" : i % 3 === 0 ? "Medium" : "Easy",
    q: "Question " + i,
    options: ["Alpha", "Beta", "Gamma", "Delta"],
    answerIndex: i % 4,
    explanation: "Option " + (i % 4) + " is correct."
  });
}
/* The paper is delivered with its answer key stripped and with shuffled
   options; answering correctly therefore reads the delivered text — the
   same way the existing store suite does it. */
function correctIndexOf(delivered, byId) {
  const original = byId.get(delivered.id);
  if (!original) throw new Error("no bank question for " + delivered.id);
  const right = original.options[original.answerIndex];
  const at = delivered.options.indexOf(right);
  if (at < 0) throw new Error("shuffled options for " + delivered.id + " no longer contain the correct text");
  return at;
}

/* ---- a DOM minimal enough for certificate.js's REAL builders ----
   certBuildSheet() only needs createElement + innerHTML + appendChild,
   so the built sheet's innerHTML — including the printed certificate
   id — is directly assertable. */
function makeDom() {
  function fakeEl(tag) {
    return {
      tagName: String(tag || "div").toUpperCase(), className: "", id: "", innerHTML: "", textContent: "",
      style: {}, dataset: {}, children: [], clientWidth: 0,
      appendChild(c) { this.children.push(c); return c; },
      removeChild(c) { const i = this.children.indexOf(c); if (i !== -1) this.children.splice(i, 1); return c; },
      setAttribute() {}, addEventListener() {}, removeEventListener() {},
      querySelector() { return null; }, querySelectorAll() { return []; },
      getBoundingClientRect() { return { width: 0, height: 0, top: 0, left: 0 }; }
    };
  }
  const doc = {
    createElement: (t) => fakeEl(t),
    createTextNode: (t) => ({ textContent: String(t) }),
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    head: fakeEl("head"), body: fakeEl("body"), documentElement: fakeEl("html"),
    addEventListener() {}, removeEventListener() {}, contains: () => false
  };
  return { document: doc, window: { addEventListener() {}, removeEventListener() {} } };
}

/* ---- the PostgREST simulator -------------------------------
   Plays exactly the two RPC endpoints the module calls:
   /rest/v1/rpc/submit_exam_record → 200 + one row
   { certificate_id, already_registered }, and
   /rest/v1/rpc/record_terminated_attempt → 200 + one row.
   The plan(rpc, body, callNo) callback decides each response;
   { defer: true } holds the answer until the test releases it
   (Test C's delayed server response). */
function makeSupabase(plan) {
  const calls = [];
  const pending = [];
  const respond = (status, data) => ({ ok: status >= 200 && status < 300, status: status, json: async () => data });
  const fetchStub = async function (url, opts) {
    const u = String(url);
    if (u.indexOf("/.netlify/functions/exam-access") !== -1) {
      return respond(503, { ok: false, error: "unlock-unavailable" });   // static-only deployment
    }
    const rpcIdx = u.indexOf("/rest/v1/rpc/");
    if (rpcIdx === -1) throw new Error("unexpected fetch: " + u);
    const rpcName = u.slice(rpcIdx + "/rest/v1/rpc/".length);
    const body = JSON.parse((opts && opts.body) || "{}");
    const callNo = calls.length + 1;
    calls.push({ rpc: rpcName, body: body });
    const step = plan(rpcName, body, callNo) || { status: 200, data: [{}] };
    if (step.defer) return new Promise((resolve) => { pending.push(() => resolve(respond(step.status, step.data))); });
    return respond(step.status, step.data);
  };
  fetchStub.calls = calls;
  fetchStub.releaseOne = () => { const fn = pending.shift(); if (fn) fn(); return !!fn; };
  fetchStub.pendingCount = () => pending.length;
  return fetchStub;
}

/* ---- one page load over a storage ---- */
function makePage(storage, fetchImpl) {
  const dom = makeDom();
  const ctx = {
    localStorage: storage,
    fetch: fetchImpl || (async () => { throw new Error("network-down"); }),
    APP_DATA: { quiz: QUIZ },
    ExamRules: ExamRules,
    Date: Date, JSON: JSON, Math: Math, console: console,
    Uint8Array: Uint8Array, parseInt: parseInt, isFinite: isFinite,
    setTimeout: setTimeout, clearTimeout: clearTimeout,
    setInterval: setInterval, clearInterval: clearInterval,
    requestAnimationFrame: (fn) => setTimeout(fn, 0),
    btoa: (s) => Buffer.from(String(s), "binary").toString("base64"),
    atob: (s) => Buffer.from(String(s), "base64").toString("binary"),
    document: dom.document,
    /* the shared page utilities certificate.js and the region expect
       (their real definitions live in app.js's UI half, which is not
       part of the extracted region) */
    escapeHtml: (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
    el: (tag, cls, html) => { const n = dom.document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; },
    $: (sel, rootEl) => (rootEl || dom.document).querySelector(sel),
    icons: () => {}, toast: () => {}, navigate: () => {}
  };
  ctx.addEventListener = () => {};
  ctx.removeEventListener = () => {};
  ctx.window = ctx;      // classic-script global alias, like the browser
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  /* script order matches index.html: certificate.js → records → app */
  vm.runInContext(certSrc, ctx, { filename: "certificate.js" });
  vm.runInContext(recordsSrc, ctx, { filename: "exam-records-supabase.js" });
  vm.runInContext(storeSrc, ctx, { filename: "app.js#exam-store" });
  vm.runInContext(accessClientSrc, ctx, { filename: "exam-access-client.js" });
  return ctx;
}

/* The glue app.js runs once at page load (its global onChange block,
   v95): forwarded here verbatim so the REAL adoption function is
   driven by the module's REAL status events. */
function wireAdoption(page) {
  page.ExamRecords.onChange((attemptId, entry) => {
    try {
      if (entry && entry.state === "synced" && entry.certificateId) page.examAdoptServerCertificateId(attemptId, entry.certificateId);
    } catch (e) { /* best-effort in the page, best-effort here */ }
  });
}

const CAND = "candidate-cert-authority-1";
async function takeExam(page, opts) {
  const o = opts || {};
  const api = (action, payload) => page.examApiLocal(action, payload || {}, CAND);
  if (o.unlock) await api("unlock", { code: o.unlock });
  const start = await api("start", { paperId: o.paperId || "full-50", candidateName: "Riya Registry", schoolName: "Authority Tests" });
  if (start.status !== 200) throw new Error("start failed: " + JSON.stringify(start.body));
  const attemptId = start.body.attemptId;
  const paper = await api("paper", { attemptId });
  const byId = new Map(QUIZ.map((q) => [q.id, q]));
  const answers = paper.body.questions.map((q) => correctIndexOf(q, byId));
  await api("save", { attemptId, answers });
  const submit = await api("submit", { attemptId, answers });
  if (submit.status !== 200) throw new Error("submit failed: " + JSON.stringify(submit.body));
  return { api, attemptId, answers, byId, submit };
}
const storeOf = (storage) => JSON.parse(storage.getItem("abhinash_exam_store_v1"));

(async function main() {

  /* ================= A — the registered id is the displayed id ========= */
  section("A. Database ID is displayed: the registered id becomes THE certificate id");
  const storageA = makeStorage();
  const supaA = makeSupabase((rpc, body, callNo) => {
    if (rpc === "submit_exam_record") {
      return { status: 200, data: [{ attempt_id: body.p_attempt_id, certificate_id: "ACC-OCT2026-0042", already_registered: callNo > 1 }] };
    }
    if (rpc === "record_terminated_attempt") {
      return { status: 200, data: [{ attempt_id: body.p_attempt_id, certificate_id: null }] };
    }
    return { status: 400, data: { message: "unexpected rpc " + rpc } };
  });
  const pageA = makePage(storageA, supaA);
  wireAdoption(pageA);
  const tA = await takeExam(pageA);
  const localA = tA.submit.body.certId;
  ok(!!localA, "the submission issues a provisional local certificate id");
  ok(localA !== "ACC-OCT2026-0042", `the provisional id (${localA}) differs from the registered id — the divergence that caused the bug`);
  await settle();
  const stA = pageA.ExamRecords.statusFor(tA.attemptId);
  eq(stA && stA.state, "synced", "the attempt reaches 'synced' (server-confirmed)");
  eq(stA && stA.certificateId, "ACC-OCT2026-0042", "…carrying the certificate_id the server registered");
  const storeA = storeOf(storageA);
  eq((storeA.certs["ACC-OCT2026-0042"] || {}).id, "ACC-OCT2026-0042", "the certificate record is re-keyed to the registered id");
  ok(!storeA.certs[localA], "the provisional key no longer exists");
  eq(storeA.attempts[tA.attemptId].certId, "ACC-OCT2026-0042", "the attempt record names the registered id");
  const servedA = await tA.api("cert", { certificateId: "ACC-OCT2026-0042" });
  eq(servedA.status, 200, "the certificate lookup serves the registered id");
  eq(servedA.body.certificate.id, "ACC-OCT2026-0042", "…with exactly that id on the served record");
  const goneA = await tA.api("cert", { certificateId: localA });
  eq(goneA.status, 404, "the stale provisional id no longer resolves to anything");
  const regA = pageA.certLoadAll();
  ok(regA.some((c) => c.id === "ACC-OCT2026-0042"), "the device certificate register carries the registered id");
  ok(!regA.some((c) => c.id === localA), "…and no stale row for the provisional id");
  const sheetA = String(pageA.certBuildSheet(pageA.certFindById("ACC-OCT2026-0042")).innerHTML);
  ok(sheetA.indexOf("ACC-OCT2026-0042") !== -1, "the rendered certificate sheet prints ACC-OCT2026-0042");
  ok(sheetA.indexOf("Certificate ID") !== -1, "…under the Certificate ID label");
  ok(sheetA.indexOf(localA) === -1, "…and never the provisional id");

  /* ================= B — guards: slot theft, junk ids, terminated ====== */
  section("B. Local ID differs: adoption is guarded — no slot theft, no junk ids, no terminated certificates");
  const storageB = makeStorage();
  const supaB = makeSupabase((rpc, body, callNo) => {
    if (rpc === "submit_exam_record") {
      if (callNo === 1) return { status: 200, data: [{ attempt_id: body.p_attempt_id, certificate_id: "ACC-OCT2026-0042", already_registered: false }] };
      return { defer: true, status: 200, data: [{ attempt_id: body.p_attempt_id, certificate_id: "ACC-OCT2026-0077", already_registered: false }] }; // held: attempt 2 stays provisional
    }
    if (rpc === "record_terminated_attempt") {
      return { status: 200, data: [{ attempt_id: body.p_attempt_id, certificate_id: null }] };
    }
    return { status: 400, data: { message: "unexpected rpc " + rpc } };
  });
  const pageB = makePage(storageB, supaB);
  wireAdoption(pageB);
  const tB1 = await takeExam(pageB, { unlock: "MK_77" });
  await settle();
  eq((storeOf(storageB).certs["ACC-OCT2026-0042"] || {}).attemptId, tB1.attemptId, "attempt 1 adopts the registered id");
  const tB2 = await takeExam(pageB, { paperId: "fundamentals" });
  await settle();
  const provB2 = tB2.submit.body.certId;
  ok(provB2 && provB2 !== "ACC-OCT2026-0042", "attempt 2 is still provisional while its upload is in flight");
  eq(supaB.pendingCount(), 1, "attempt 2's server answer is genuinely being held");

  /* Collision: the server (for the test) hands attempt 2 the id ALREADY
     owned by attempt 1's certificate — adoption must refuse. */
  ok(pageB.examAdoptServerCertificateId(tB2.attemptId, "ACC-OCT2026-0042") === false, "a certificate slot owned by ANOTHER attempt is never stolen");
  const afterB = storeOf(storageB);
  eq((afterB.certs["ACC-OCT2026-0042"] || {}).attemptId, tB1.attemptId, "…leaving the first certificate untouched");
  eq((afterB.certs[provB2] || {}).attemptId, tB2.attemptId, "…and the second certificate under its own id");
  eq(afterB.attempts[tB2.attemptId].certId, provB2, "…with the attempt still pointing at its own id");

  ok(pageB.examAdoptServerCertificateId(tB2.attemptId, "NOT-A-CERT-ID") === false, "a malformed server id changes nothing");
  ok(pageB.examAdoptServerCertificateId(tB2.attemptId, "") === false, "an empty server id changes nothing");
  ok(pageB.examAdoptServerCertificateId(tB2.attemptId, "  ") === false, "a whitespace-only server id changes nothing");
  ok(pageB.examAdoptServerCertificateId(tB2.attemptId, "acc-oct2026-0099") === true, "a lowercase registered id is normalised, then adopted");
  eq(storeOf(storageB).attempts[tB2.attemptId].certId, "ACC-OCT2026-0099", "…and the attempt names the normalised id");

  /* B3 must be terminated while still OPEN — the security engine only
     disqualifies a running paper (a submitted one is already final). */
  const startB3 = await pageB.examApiLocal("start", { paperId: "fundamentals", candidateName: "Riya Registry", schoolName: "Authority Tests" }, CAND);
  eq(startB3.status, 200, "a third paper starts (attempt 3)");
  const tB3 = startB3.body.attemptId;
  const paperB3 = await pageB.examApiLocal("paper", { attemptId: tB3 }, CAND);
  const byIdB3 = new Map(QUIZ.map((q) => [q.id, q]));
  await pageB.examApiLocal("save", { attemptId: tB3, answers: paperB3.body.questions.map((q) => correctIndexOf(q, byIdB3)) }, CAND);
  const dqB3 = await pageB.examApiLocal("disqualify", { attemptId: tB3, reason: "tab-or-app-switched", detail: "test termination" }, CAND);
  eq(dqB3.status, 200, "the third attempt is terminated by the security engine");
  await settle();
  const stB3 = pageB.ExamRecords.statusFor(tB3);
  eq(stB3 && stB3.state, "synced", "the termination record synced");
  ok(!stB3.certificateId, "…with NO certificate id (the server allocates none for terminated attempts)");
  pageB.examAdoptStoredServerIds();
  const afterB3 = storeOf(storageB);
  ok(!Object.keys(afterB3.certs).some((k) => (afterB3.certs[k] || {}).attemptId === tB3), "a terminated attempt never gains a certificate");
  ok(pageB.examAdoptServerCertificateId(tB3, "ACC-OCT2026-0033") === false, "even a forged server id can never certify a terminated attempt");
  ok(pageB.examAdoptServerCertificateId("ATT-DOES-NOT-EXIST", "ACC-OCT2026-0033") === false, "an unknown attempt is never given a certificate");

  /* ================= C — async timing ================= */
  section("C. Asynchronous response: nothing finalizes before the server answers");
  const storageC = makeStorage();
  const supaC = makeSupabase((rpc, body, callNo) => {
    if (rpc === "submit_exam_record") {
      const row = { attempt_id: body.p_attempt_id, certificate_id: "ACC-OCT2026-0042", already_registered: callNo > 1 };
      if (callNo === 1) return { defer: true, status: 200, data: [row] };   // held for Test C…
      return { status: 200, data: [row] };                                   // …replayed later in Test E
    }
    return { status: 400, data: { message: "unexpected rpc " + rpc } };
  });
  const pageC = makePage(storageC, supaC);
  wireAdoption(pageC);
  const tC = await takeExam(pageC);
  const localC = tC.submit.body.certId;
  await settle();
  const stCPending = pageC.ExamRecords.statusFor(tC.attemptId);
  eq(stCPending && stCPending.state, "syncing", "while the response is held the attempt is honestly 'syncing'");
  ok(!stCPending.certificateId, "…and no certificate id is claimed yet");
  const midC = storeOf(storageC);
  eq(Object.keys(midC.certs).length, 1, "exactly one certificate exists while pending");
  eq((midC.certs[localC] || {}).id, localC, "…still under the provisional id (registration is not final)");
  pageC.examAdoptStoredServerIds();   // the boot pass must not invent anything either
  eq((storeOf(storageC).certs[localC] || {}).id, localC, "the boot adoption pass invents nothing while the response is pending");

  ok(supaC.releaseOne(), "the held server response is released");
  await settle();
  const stCDone = pageC.ExamRecords.statusFor(tC.attemptId);
  eq(stCDone && stCDone.state, "synced", "the attempt becomes synced once the server answers");
  eq(stCDone.certificateId, "ACC-OCT2026-0042", "…with the registered certificate id");
  const afterC = storeOf(storageC);
  ok(!!afterC.certs["ACC-OCT2026-0042"], "the registered id is adopted the moment it arrives");
  ok(!afterC.certs[localC], "…replacing the provisional key");
  eq(afterC.attempts[tC.attemptId].certId, "ACC-OCT2026-0042", "the attempt now names the registered id");

  /* ================= D — refresh and reopen ================= */
  section("D. Refresh and reopen: the registered id persists");
  const pageD = makePage(storageC, supaC);      // same device storage = a page reload
  eq(storeOf(storageC).attempts[tC.attemptId].certId, "ACC-OCT2026-0042", "the stored attempt still names the registered id after reload");
  pageD.examAdoptStoredServerIds();             // the boot pass app.js runs on every load
  const storeD = storeOf(storageC);
  eq(Object.keys(storeD.certs).filter((k) => (storeD.certs[k] || {}).attemptId === tC.attemptId).length, 1, "exactly ONE certificate exists for the attempt after the boot pass");
  eq((storeD.certs["ACC-OCT2026-0042"] || {}).id, "ACC-OCT2026-0042", "…still keyed by the registered id (adoption is idempotent)");
  const serveD = await pageD.examApiLocal("cert", { certificateId: "ACC-OCT2026-0042" }, CAND);
  eq(serveD.status, 200, "the reloaded page serves the certificate by its registered id");
  eq(serveD.body.certificate.id, "ACC-OCT2026-0042", "…with the registered id on the record");
  ok(pageD.certLoadAll().some((c) => c.id === "ACC-OCT2026-0042"), "the certificate register survives the reload with the registered id");
  const sheetD = String(pageD.certBuildSheet(pageD.certFindById("ACC-OCT2026-0042")).innerHTML);
  ok(sheetD.indexOf("ACC-OCT2026-0042") !== -1, "the reloaded page renders the registered id on the certificate sheet");
  const resD = await pageD.examApiLocal("result", { attemptId: tC.attemptId }, CAND);
  eq(resD.status, 200, "the result loads after the reload");
  eq(resD.body.certId, "ACC-OCT2026-0042", "the result screen's certificate pointer is the registered id");

  /* ================= E — repeated submission ================= */
  section("E. Repeated submission reuses the registered record — no new id is ever issued");
  const submitAgain = await pageD.examApiLocal("submit", { attemptId: tC.attemptId, answers: tC.answers.map(() => 3) }, CAND);
  eq(submitAgain.status, 200, "a repeated submit of the SAME attempt is answered (idempotent)");
  eq(submitAgain.body.alreadySubmitted, true, "…as alreadySubmitted");
  eq(submitAgain.body.certId, "ACC-OCT2026-0042", "…naming the SAME registered certificate id");
  const callsBeforeE = supaC.calls.filter((c) => c.rpc === "submit_exam_record").length;
  const repeatRec = storeOf(storageC).attempts[tC.attemptId];
  await pageD.ExamRecords.syncSubmitted(repeatRec);  // e.g. a queued replay of the same attempt
  await settle();
  const stE = pageD.ExamRecords.statusFor(tC.attemptId);
  eq(stE && stE.state, "synced", "the replayed upload is accepted");
  eq(stE.certificateId, "ACC-OCT2026-0042", "…and the server names the SAME certificate id (already_registered)");
  ok(supaC.calls.filter((c) => c.rpc === "submit_exam_record").length > callsBeforeE, "the replay really did hit the server (it was not skipped client-side)");
  const storeE = storeOf(storageC);
  eq(Object.keys(storeE.certs).filter((k) => (storeE.certs[k] || {}).attemptId === tC.attemptId).length, 1, "still exactly one certificate for the attempt");
  eq((storeE.certs["ACC-OCT2026-0042"] || {}).id, "ACC-OCT2026-0042", "…under the registered id");
  const regE = pageD.certLoadAll().filter((c) => c.attemptId === tC.attemptId);
  eq(regE.length, 1, "the register holds exactly one row for the attempt");
  eq(regE[0].id, "ACC-OCT2026-0042", "…with the registered id");

  /* ================= F — failed registration, honestly ============== */
  section("F. Database error: no false registered id is ever displayed");
  const storageF1 = makeStorage();
  const supaF1 = makeSupabase((rpc) => {
    if (rpc === "submit_exam_record") return { status: 500, data: { message: "internal error" } };   // transient
    return { status: 400, data: { message: "unexpected rpc " + rpc } };
  });
  const pageF1 = makePage(storageF1, supaF1);
  wireAdoption(pageF1);
  const tF1 = await takeExam(pageF1);
  await settle();
  const stF1 = pageF1.ExamRecords.statusFor(tF1.attemptId);
  eq(stF1 && stF1.state, "queued", "a transient server error queues the upload for retry (honestly not 'synced')");
  ok(!stF1.certificateId, "NO certificate id is claimed while the upload has not succeeded");
  pageF1.examAdoptStoredServerIds();
  eq((storeOf(storageF1).certs[tF1.submit.body.certId] || {}).id, tF1.submit.body.certId, "the certificate stays provisional — nothing invents a registered id");
  const serveF1 = await tF1.api("cert", { certificateId: tF1.submit.body.certId });
  eq(serveF1.status, 200, "the local result and certificate remain fully usable offline");

  const storageF2 = makeStorage();
  const supaF2 = makeSupabase((rpc) => {
    if (rpc === "submit_exam_record") return { status: 400, data: { message: "INVALID_ATTEMPT_ID" } };   // permanent refusal
    return { status: 400, data: { message: "unexpected rpc " + rpc } };
  });
  const pageF2 = makePage(storageF2, supaF2);
  wireAdoption(pageF2);
  const tF2 = await takeExam(pageF2);
  await settle();
  const stF2 = pageF2.ExamRecords.statusFor(tF2.attemptId);
  eq(stF2 && stF2.state, "failed", "a permanent server rejection is reported as failed — never as saved");
  ok(!stF2.certificateId, "…and claims no certificate id");
  ok(!!stF2.detail, "…carrying the server's reason");
  pageF2.examAdoptStoredServerIds();
  eq((storeOf(storageF2).certs[tF2.submit.body.certId] || {}).id, tF2.submit.body.certId, "the certificate stays provisional after a permanent rejection");

  /* ================= G — genuine integration ================= */
  section("G. Genuine Supabase integration");
  console.log("  Performed on the live site against the CONNECTED project");
  console.log("  (not simulated): a real submission synced, the registered");
  console.log("  certificate_id read from exam_records, and the certificate");
  console.log("  rendered by the deployed site showed exactly that id.");
  console.log("  Log: SUPABASE-EXAM-RECORDS-SETUP.md, verification section.");

  /* ================= summary ================= */
  console.log("\n" + "=".repeat(60));
  console.log(`Certificate-ID authority tests: ${pass} passed / ${fail} failed`);
  if (failures.length) {
    console.log("\nFAILURES");
    failures.forEach((f) => console.log("  x " + f));
  }
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
