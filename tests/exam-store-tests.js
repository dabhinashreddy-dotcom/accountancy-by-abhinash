/* Local examination store — BEHAVIOURAL regression tests.
   Run: node tests/exam-store-tests.js   (Node 18+, no packages)
   Dev only, not loaded by the website.

   The other exam suites test exam-rules.js / exam-security.js as
   modules and app.js as static wiring. This file goes one step
   further: it extracts the LOCAL EXAMINATION STORE region of app.js
   (EXAM_STORE_KEY … examApiLocal) and executes the REAL code in a
   Node vm against a fake localStorage — so start/paper/save/
   disqualify/submit/result/cert run here as they run in the browser,
   not as a re-implementation.

   Covered behaviours (the security contract):
     1  a happy paper: start → paper → save → submit → result + certificate
     2  exactly ONE attempt is consumed per start; a disqualification
        consumes the running attempt and no others
     3  one incident → one violation: a burst of detector events is a
        no-op, the FIRST reason wins
     4  a disqualified attempt can never be submitted, re-saved,
        returned as a result, or served a certificate — including an
        injected certificate record
     5  refresh/reopen (fresh store object over the same storage)
        never revives a disqualified attempt as valid
     6  submission is idempotent: a double-click cannot produce two
        results or two certificates
     7  resume after refresh: a live attempt's saved answers come back
*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const ExamRules = require(path.resolve(__dirname, "..", "exam-rules.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

/* ---- extract the store region from app.js ---- */
const appSrc = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
const START = appSrc.indexOf('const EXAM_STORE_KEY = "abhinash_exam_store_v1";');
/* v89 — the region now ends after examCandidateId(): the unlock path
   calls examCandidateId (server-side code check, Part 6), so the
   identity helper must be inside the executed slice. Its partner
   examAccessVerify() moved to its own client module
   (exam-access-client.js — the same dedicated-module split
   push-manager.js uses), so THAT file's real source is executed in
   the sandbox below instead. */
const END = appSrc.indexOf("async function examApi(");
if (START === -1 || END === -1 || END <= START) {
  console.error("FATAL: could not locate the local exam store region in app.js");
  process.exit(1);
}
const storeSrc = appSrc.slice(START, END);
const accessClientSrc = fs.readFileSync(path.resolve(__dirname, "..", "exam-access-client.js"), "utf8");

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

/* The paper is delivered with its answer key stripped AND with each
   question's options shuffled into a fresh order. Answering correctly
   therefore has to work the way a student does: read the option text and
   pick the one that is right. Doing it by raw index would silently
   answer at random — which is also a useful proof that the delivered key
   still lines up with the shuffled options. */
function correctIndexOf(delivered, byId) {
  const original = byId.get(delivered.id);
  if (!original) throw new Error("no bank question for " + delivered.id);
  const right = original.options[original.answerIndex];
  const at = delivered.options.indexOf(right);
  if (at < 0) throw new Error("shuffled options for " + delivered.id + " no longer contain the correct text");
  return at;
}

/* v89 — Part 6: unlock codes and the admin token now live ONLY in the
   server function (netlify/functions/exam-access.js + env vars). The
   code under test is the REAL client half — examAccessVerify, executed
   in the sandbox from exam-access-client.js — so the sandbox gets a
   fetch stub that plays the server exactly like the function does:
   validate against configured codes, timing-irrelevant here, and
   answer 200-grant / 403 / 503. With NO configuration the default
   stub simulates an UNREACHABLE server (fetch throws), which is what a
   static-only deployment sees — and nothing may be granted. */
function makeAccessServer(config) {
  const cfg = config || {};
  return async function fetchStub(url, opts) {
    if (String(url).indexOf("/.netlify/functions/exam-access") === -1) {
      throw new Error("unexpected fetch: " + url);
    }
    const body = JSON.parse((opts && opts.body) || "{}");
    const value = String(body.code || body.token || "");
    const respond = (status, data) => ({ ok: status >= 200 && status < 300, status: status, json: async () => data });
    if (body.purpose === "unlock") {
      if (!cfg.unlimited && !cfg.two) return respond(503, { ok: false, error: "unlock-unavailable" });
      if (cfg.unlimited && cfg.unlimited === value) return respond(200, { ok: true, grant: "unlimited" });
      if (cfg.two && cfg.two === value) return respond(200, { ok: true, grant: "two" });
      return respond(403, { ok: false, error: "invalid-code" });
    }
    if (body.purpose === "admin") {
      if (cfg.admin && cfg.admin === value) return respond(200, { ok: true });
      return respond(403, { ok: false, error: "forbidden" });
    }
    return respond(400, { ok: false, error: "unknown-purpose" });
  };
}

/* A context = one page load. A new context over the SAME storage is
   exactly what a refresh/reopen creates. */
function makePage(storage, fetchImpl) {
  const ctx = {
    localStorage: storage,
    /* No fetch configured → every privileged-code check fails as
       "network unreachable" (the honest static-deployment path). */
    fetch: fetchImpl || (async () => { throw new Error("network-down"); }),
    APP_DATA: { quiz: QUIZ },
    ExamRules: ExamRules,
    Date: Date, JSON: JSON, Math: Math, console: console,
    Uint8Array: Uint8Array, parseInt: parseInt, isFinite: isFinite,
    setTimeout: setTimeout, clearTimeout: clearTimeout
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(storeSrc, ctx, { filename: "app.js#exam-store" });
  /* The real client half of the server-side code check: the same
     source the browser loads via <script src="/exam-access-client.js">. */
  vm.runInContext(accessClientSrc, ctx, { filename: "exam-access-client.js" });
  return ctx;
}

const CAND = "candidate-regression-1";

(async function main() {

  /* ================= 1. happy path ================= */
  section("1. A complete, valid paper: start → paper → save → submit");
  const storage = makeStorage();
  const page = makePage(storage);
  const api = (action, payload) => page.examApiLocal(action, payload || {}, CAND);

  const status0 = await api("status");
  eq(status0.status, 200, "status answers 200");
  eq(status0.body.used, 0, "no attempts used yet today");

  const start = await api("start", { paperId: "full-50", candidateName: "Aarav Regression", schoolName: "Test School" });
  eq(start.status, 200, "start answers 200");
  ok(!!start.body.attemptId, "an attempt id is issued");
  const attemptId = start.body.attemptId;
  eq(start.body.used, 1, "starting consumes exactly one attempt");
  eq(start.body.alreadyActive, undefined, "the first start is not an alreadyActive resume");

  // A double-click start lands on the SAME attempt.
  const start2 = await api("start", { paperId: "full-50", candidateName: "Aarav Regression" });
  eq(start2.body.attemptId, attemptId, "a second start returns the SAME live attempt");
  eq(start2.body.alreadyActive, true, "and flags it as already active");

  const paper = await api("paper", { attemptId });
  eq(paper.status, 200, "the paper loads");
  eq(paper.body.questions.length, 50, "50 questions drawn");
  ok(paper.body.questions.every((q) => q.answerIndex === undefined), "the delivered paper carries NO answer key");
  ok(paper.body.questions.every((q) => typeof q.q === "string" && Array.isArray(q.options)), "every question has text and options");

  // Answer everything CORRECTLY by reading the delivered option text,
  // which is how a student answers after the options have been shuffled.
  const byId = new Map(QUIZ.map((q) => [q.id, q]));
  const answers = paper.body.questions.map((q) => correctIndexOf(q, byId));
  const save = await api("save", { attemptId, answers });
  eq(save.status, 200, "progress saves");

  const submit = await api("submit", { attemptId, answers });
  eq(submit.status, 200, "submission succeeds");
  eq(submit.body.result.marksObtained, 50, "every correct answer is marked");
  eq(submit.body.result.resultStatus, "PASS", "50/50 passes");
  eq(submit.body.result.grade, "A1", "50/50 is grade A1");
  eq(submit.body.result.correct, 50, "correct count matches");
  ok(!!submit.body.certId, "a certificate id is issued");
  ok(!!submit.body.certificate && submit.body.certificate.id === submit.body.certId, "the certificate record returns with the result");

  const cert = await api("cert", { certificateId: submit.body.certId });
  eq(cert.status, 200, "the certificate is retrievable");
  eq(cert.body.certificate.candidateName, "Aarav Regression", "the certificate carries the candidate name");
  ok(cert.body.certificate.owner === undefined, "the owner key is never served to the client");

  // Idempotent submission: a double-click after the fact changes nothing.
  const submitAgain = await api("submit", { attemptId, answers: answers.map(() => 3) });
  eq(submitAgain.status, 200, "a repeated submit is answered (idempotent)");
  eq(submitAgain.body.alreadySubmitted, true, "…as alreadySubmitted");
  eq(submitAgain.body.certId, submit.body.certId, "the SAME certificate id — no double issuance");
  const storeAfter = JSON.parse(storage.getItem("abhinash_exam_store_v1"));
  eq(Object.keys(storeAfter.certs).length, 1, "exactly one certificate exists in the register");

  /* ================= 2. disqualification ================= */
  section("2. Disqualification: immediate, once, terminal");
  const startDQ = await api("start", { paperId: "fundamentals", candidateName: "Aarav Regression" });
  eq(startDQ.status, 200, "a second paper starts (attempt 2)");
  const dqId = startDQ.body.attemptId;
  eq(startDQ.body.used, 2, "two attempts consumed so far");

  const paperDQ = await api("paper", { attemptId: dqId });
  const halfAnswers = paperDQ.body.questions.map((q, i) => (i % 2 ? correctIndexOf(q, byId) : null));
  await api("save", { attemptId: dqId, answers: halfAnswers });

  // A burst of detector events for ONE incident.
  const dq1 = await api("disqualify", { attemptId: dqId, reason: "tab-or-app-switched", detail: "hidden while running" });
  eq(dq1.status, 200, "the first disqualify succeeds");
  eq(dq1.body.disqualified, true, "…and reports the disqualification");
  eq(dq1.body.reason, "tab-or-app-switched", "…with the detected reason");
  for (let i = 0; i < 5; i++) {
    const burst = await api("disqualify", { attemptId: dqId, reason: "screenshot-attempt" });
    eq(burst.body.alreadyDisqualified, true, `burst event ${i + 1} is a no-op`);
  }
  const rec = JSON.parse(storage.getItem("abhinash_exam_store_v1")).attempts[dqId];
  eq(rec.status, "disqualified", "the stored record is disqualified");
  eq(rec.violation.reason, "tab-or-app-switched", "the FIRST reason wins — one incident, one record");
  ok((rec.violations || []).length <= 1, "at most one violation entry exists");

  // The attempt is consumed exactly once: starts unchanged by the burst.
  const statusDQ = await api("status");
  eq(statusDQ.body.used, 2, "the violation burst consumed no ADDITIONAL attempts");

  // Terminal: no save, no submit, no result.
  const saveDQ = await api("save", { attemptId: dqId, answers: halfAnswers });
  eq(saveDQ.status, 409, "a disqualified attempt accepts no saves");
  const submitDQ = await api("submit", { attemptId: dqId, answers: halfAnswers });
  eq(submitDQ.status, 409, "a disqualified attempt can never be submitted");
  eq(submitDQ.body.error, "Attempt is not open for submission", "submission is refused with the finished-attempt error");
  const resultDQ = await api("result", { attemptId: dqId });
  eq(resultDQ.status, 409, "a disqualified attempt has no result");

  // The active-attempt slot is released, never left live.
  const dayRec = JSON.parse(storage.getItem("abhinash_exam_store_v1")).day;
  eq(dayRec.activeAttemptId, null, "no live paper remains on the device after disqualification");

  /* ================= 3. certificates for DQ attempts ================= */
  section("3. A disqualified attempt can never serve a certificate");
  {
    const storeObj = JSON.parse(storage.getItem("abhinash_exam_store_v1"));
    // Inject a certificate record for the DQ'd attempt by hand — the
    // gate must hold even against a tampered local register.
    const injectedId = ExamRules.certIdForDate(Date.now(), 9999);
    storeObj.certs[injectedId] = {
      id: injectedId, status: "valid", owner: CAND, candidateName: "Aarav Regression",
      attemptId: dqId, resultStatus: "PASS"
    };
    storage.setItem("abhinash_exam_store_v1", JSON.stringify(storeObj));
    const injected = await api("cert", { certificateId: injectedId });
    eq(injected.status, 404, "an injected certificate for a disqualified attempt is REFUSED");
    // A legitimate certificate from attempt 1 still works.
    const legit = await api("cert", { certificateId: submit.body.certId });
    eq(legit.status, 200, "a valid certificate remains retrievable");
  }

  /* ================= 4. refresh / reopening ================= */
  section("4. Refresh and reopening: disqualified stays disqualified");
  const page2 = makePage(storage);          // a fresh page over the same storage
  const api2 = page2.examApiLocal.bind(page2, "?", {}, CAND);
  const apiReload = (action, payload) => page2.examApiLocal(action, payload || {}, CAND);
  void api2;
  const hist = await apiReload("history");
  eq(hist.status, 200, "history loads after a reload");
  const dqEntry = hist.body.history.find((h) => h.attemptId === dqId);
  ok(!!dqEntry && dqEntry.status === "disqualified", "the disqualified status survives a reload");
  ok(!!dqEntry && !!dqEntry.violation && dqEntry.violation.reason === "tab-or-app-switched", "the violation reason survives a reload");
  const submitReload = await apiReload("submit", { attemptId: dqId, answers: halfAnswers });
  eq(submitReload.status, 409, "a reloaded page still cannot submit the disqualified attempt");
  const paperReload = await apiReload("paper", { attemptId: dqId });
  eq(paperReload.status, 200, "the paper payload itself is intact (the UI restore path, not the store, blocks it)");

  /* ================= 5. resume after refresh (live attempt) ===== */
  section("5. Resume after refresh: saved answers come back");
  /* v92 Part 3 — the two unlock codes are validated LOCALLY (no
     server, no network, no env variables). Prove the whole local
     contract against the real examApiLocal on a page with NO access
     server at all: wrong code, the two-extra grant and its
     no-duplicate rule (with whitespace-trimmed matching), and the
     unlimited grant the rest of this section rides on. */
  const wrongUnlock = await apiReload("unlock", { code: "NOT-THE-CODE" });
  eq(wrongUnlock.status, 403, "a wrong code is refused (403 invalid-code) with no server involved");
  eq(JSON.parse(storage.getItem("abhinash_exam_store_v1")).day.unlimited, false, "…and lifts nothing");

  const twoUnlock = await apiReload("unlock", { code: "MK_77" });
  eq(twoUnlock.status, 200, "the local two-extra code is accepted without any network");
  eq(twoUnlock.body.granted, 2, "…and grants exactly two additional attempts");
  eq(twoUnlock.body.limit, 4, "…making today's limit 2 + 2 = 4");
  const again = await apiReload("unlock", { code: "  MK_77  " });
  eq(again.status, 200, "re-entering the same code is answered honestly");
  eq(again.body.alreadyRedeemed, true, "…as already redeemed, never a duplicate grant");
  eq(JSON.parse(storage.getItem("abhinash_exam_store_v1")).day.extraGranted, 2, "…and the extra grant stays at exactly 2 (surrounding whitespace is trimmed)");

  // Lift the daily limit through the same unlock path students use.
  // NOTE: each page context caches the store in memory (exactly like a
  // browser tab), so the grant and the rest of section 5 must run on
  // the SAME context that received it.
  const unlock = await apiReload("unlock", { code: "0_ABA_77" });
  eq(unlock.status, 200, "the local unlimited code is accepted");
  eq(unlock.body.unlimited, true, "…and lifts the daily limit");

  const start3 = await apiReload("start", { paperId: "subsidiary-books", candidateName: "Aarav Regression" });
  eq(start3.status, 200, "a third paper starts after the refresh");
  const att3 = start3.body.attemptId;
  const paper3 = await apiReload("paper", { attemptId: att3 });
  const answers3 = paper3.body.questions.map((q, i) => (i % 2 ? correctIndexOf(q, byId) : null));
  await apiReload("save", { attemptId: att3, answers: answers3 });

  const page3 = makePage(storage);          // refresh again
  const api3 = (action, payload) => page3.examApiLocal(action, payload || {}, CAND);
  const paper3b = await api3("paper", { attemptId: att3 });
  eq(paper3b.status, 200, "the live attempt survives a second refresh");
  const saved = paper3b.body.questions.map((q) => q.saved);
  ok(JSON.stringify(saved) === JSON.stringify(answers3), "every saved answer comes back after the refresh");

  const submit3 = await api3("submit", { attemptId: att3, answers: answers3 });
  eq(submit3.status, 200, "the resumed attempt submits normally");
  // Every odd-indexed slot was answered with its correct key: the
  // drawn paper for this 2-chapter bank is 10 questions long.
  eq(submit3.body.result.correct, Math.ceil(paper3b.body.questions.length / 2), "every resumed, correctly answered question is marked correct");

  /* ================= 6. ownership + malformed input ============= */
  section("6. Ownership, malformed input and honest failures");
  const foreign = await api3("paper", { attemptId: att3 });           // right id…
  eq(foreign.status, 200, "the owning candidate reads the attempt");
  const otherPage = makePage(storage);
  const other = await otherPage.examApiLocal("paper", { attemptId: att3 }, "someone-else");
  eq(other.status, 404, "a different candidate id gets 404 for the same attempt");
  const badSave = await api3("save", { attemptId: att3, answers: [0, 1] });
  eq(badSave.status, 409, "a submitted attempt refuses saves even with fresh answers");
  const badStart = await api3("start", { paperId: "no-such-paper", candidateName: "X Y" });
  eq(badStart.status, 400, "an unknown paper is refused");
  const badName = await api3("start", { paperId: "full-50", candidateName: "" });
  eq(badName.status, 400, "an empty candidate name is refused");
  const unknown = await api3("nonsense", {});
  eq(unknown.status, 400, "an unknown action is refused");

  /* v92 Part 3 — IST-midnight reset of unlock grants, and the
     unlimited-beats-two precedence, on an ISOLATED store clone so the
     rest of the suite keeps its own state. */
  {
    const midStore = JSON.parse(storage.getItem("abhinash_exam_store_v1"));
    midStore.day.day = "2000-01-01";                 // pretend it is yesterday in IST
    const stM = makeStorage();
    stM.setItem("abhinash_exam_store_v1", JSON.stringify(midStore));
    const midPage = makePage(stM);
    const midApi = (action, payload) => midPage.examApiLocal(action, payload || {}, CAND);
    const freshDay = await midApi("status");
    eq(freshDay.body.unlimited, false, "after the India-calendar day rolls over, yesterday's unlimited grant is gone");
    eq(freshDay.body.limit, 2, "…and the limit is the normal 2 again");
    eq(freshDay.body.remaining, 2, "…with both attempts fresh");
    await midApi("unlock", { code: "MK_77" });
    const unlim = await midApi("unlock", { code: "0_ABA_77" });
    eq(unlim.body.unlimited, true, "unlimited takes precedence over an earlier two-extra grant");
    const stAfter = JSON.parse(stM.getItem("abhinash_exam_store_v1"));
    eq(stAfter.day.extraGranted, 2, "…while the two-extra grant is kept on record (harmless under unlimited)");
    ok(stAfter.day.redeemedCodes.indexOf("two") !== -1 && stAfter.day.redeemedCodes.indexOf("unlimited") !== -1, "…and both redemptions are recorded once each for the day");
  }

  /* ================= 7. v89 audit: slot refunds, paper delivery,
     certificate fail-closed, server-authorized admin ============= */
  section("7. v89 audit: void refunds the slot, certs fail closed, admin is server-authorized");
  {
    const st7 = makeStorage();
    const page7 = makePage(st7, makeAccessServer({ admin: "SERVER-ADMIN-TOKEN" }));
    const api7 = (action, payload) => page7.examApiLocal(action, payload || {}, CAND);
    const dayOf = () => (JSON.parse(st7.getItem("abhinash_exam_store_v1") || "{}").day) || {};
    const attemptsOf = () => (JSON.parse(st7.getItem("abhinash_exam_store_v1") || "{}").attempts) || {};

    /* a start that never delivers a paper can be VOIDED — and the
       daily slot comes back (Part 5C: a failed paper load never burns
       an attempt) */
    const startsBefore = dayOf().starts || 0;
    const sA = await api7("start", { paperId: "full-50", candidateName: "Aarav Regression" });
    eq(sA.status, 200, "7 a paper starts");
    eq(dayOf().starts, startsBefore + 1, "7 start consumes exactly one daily slot");
    const attA = sA.body.attemptId;
    const vBad = await api7("void", { attemptId: "no-such-attempt" });
    eq(vBad.status, 404, "7 voiding an unknown attempt is refused");
    const vA = await api7("void", { attemptId: attA });
    eq(vA.status, 200, "7 an undelivered, untouched attempt can be voided");
    eq(dayOf().starts, startsBefore, "7 the daily slot is REFUNDED");
    eq(dayOf().activeAttemptId, null, "7 the active-attempt slot is released");
    eq(attemptsOf()[attA].status, "voided", "7 the attempt is recorded as voided, not silently deleted");

    /* once the paper is ON SCREEN (or any work is saved), voiding is
       refused — answers could exist only on this device */
    const sB = await api7("start", { paperId: "full-50", candidateName: "Aarav Regression" });
    eq(sB.status, 200, "7 a second paper starts after the refund");
    const attB = sB.body.attemptId;
    const pB = await api7("paper", { attemptId: attB });
    eq(pB.status, 200, "7 the paper is delivered");
    const vB1 = await api7("void", { attemptId: attB });
    eq(vB1.status, 409, "7 once the paper is delivered, void is refused");
    await api7("save", { attemptId: attB, answers: [null, null, 0] });
    const vB2 = await api7("void", { attemptId: attB });
    eq(vB2.status, 409, "7 an attempt with saved work can never be voided");
    eq(dayOf().starts, startsBefore + 1, "7 neither refused void consumed or refunded anything");

    /* certificates FAIL CLOSED (Part 5B) — a fresh page so the cert
       injections below are read from storage, not the cached store */
    const injectedActive = ExamRules.certIdForDate(Date.now(), 4242);
    let stObj = JSON.parse(st7.getItem("abhinash_exam_store_v1"));
    stObj.certs[injectedActive] = { id: injectedActive, status: "valid", owner: CAND, candidateName: "Aarav Regression", attemptId: attB, resultStatus: "PASS" };
    st7.setItem("abhinash_exam_store_v1", JSON.stringify(stObj));
    const pageC = makePage(st7, makeAccessServer({}));
    const apiC = (action, payload) => pageC.examApiLocal(action, payload || {}, CAND);
    const certActive = await apiC("cert", { certificateId: injectedActive });
    eq(certActive.status, 404, "7 a certificate naming an ACTIVE attempt is refused (fail closed)");

    const injectedMissing = ExamRules.certIdForDate(Date.now(), 4243);
    stObj = JSON.parse(st7.getItem("abhinash_exam_store_v1"));
    stObj.certs[injectedMissing] = { id: injectedMissing, status: "valid", owner: CAND, attemptId: "attempt-that-never-existed", resultStatus: "PASS" };
    st7.setItem("abhinash_exam_store_v1", JSON.stringify(stObj));
    const pageD = makePage(st7, makeAccessServer({}));
    const certMissing = await pageD.examApiLocal("cert", { certificateId: injectedMissing }, CAND);
    eq(certMissing.status, 404, "7 a certificate whose attempt record is missing is refused (fail closed)");

    const injectedLegacy = ExamRules.certIdForDate(Date.now(), 4244);
    stObj = JSON.parse(st7.getItem("abhinash_exam_store_v1"));
    stObj.certs[injectedLegacy] = { id: injectedLegacy, status: "valid", owner: CAND, candidateName: "Aarav Regression", resultStatus: "PASS" };
    st7.setItem("abhinash_exam_store_v1", JSON.stringify(stObj));
    const pageE = makePage(st7, makeAccessServer({}));
    const certLegacy = await pageE.examApiLocal("cert", { certificateId: injectedLegacy }, CAND);
    eq(certLegacy.status, 200, "7 legacy certificates with NO attempt id keep working untouched");

    /* admin report: the token is judged SERVER-side (Part 6) */
    const adminWrong = await api7("admin", { token: "WRONG-TOKEN" });
    eq(adminWrong.status, 401, "7 a wrong admin token is refused by the server verdict");
    const adminOk = await api7("admin", { token: "SERVER-ADMIN-TOKEN" });
    eq(adminOk.status, 200, "7 the server-verified admin token opens the local report");
    const pageOff = makePage(st7);   /* default fetch stub = network down */
    const adminOff = await pageOff.examApiLocal("admin", { token: "SERVER-ADMIN-TOKEN" }, CAND);
    eq(adminOff.status, 503, "7 an offline admin check fails honestly (503), never a fake 401");
  }

  /* ================= summary ================= */
  console.log("\n" + "=".repeat(60));
  console.log(`Exam store (behavioural) tests: ${pass} passed / ${fail} failed`);
  if (failures.length) {
    console.log("\nFAILURES");
    failures.forEach((f) => console.log("  ✗ " + f));
    process.exit(1);
  }
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
