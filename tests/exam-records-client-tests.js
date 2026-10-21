/* Supabase exam-records client (exam-records-supabase.js) — tests.
   Run: node tests/exam-records-client-tests.js   (Node 18+, no packages)
   Dev only, not loaded by the website.

   The module is executed for real inside a Node vm against a fake
   localStorage, a fake fetch and a fake ExamRules — so the payload
   mapping, the RPC names/headers, the pending queue, the retry
   drain, the permanent-rejection handling and the honesty of every
   status are tested as they run in the browser, not re-implemented.

   Covered contract:
     1  security: the file ships the PUBLISHABLE key only — no
        secret/service-role key, no JWT secret, anywhere
     2  a completed submission maps to submit_exam_record with the
        exact server-validated argument names and honest values
     3  a FAIL is recorded too (completed ≠ passed)
     4  a network failure never claims "synced": the record is
        queued, persisted, and retried by drainQueue
     5  a server-side validation rejection (4xx) is permanent: it is
        reported as failed and dropped, never retried forever
     6  a terminated attempt maps to record_terminated_attempt with
        the violation reason; an already-submitted race is reported
        as "skipped", never as saved
     7  replaying the same attempt is client-safe: same attempt_id,
        still idempotent when the server answers already_registered
     8  the master switch disables everything without a fetch call
*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

const src = fs.readFileSync(path.resolve(__dirname, "..", "exam-records-supabase.js"), "utf8");

/* ---- fake environment ---------------------------------------- */
function resp(status, body) {
  return { ok: status >= 200 && status < 300, status: status, json: () => Promise.resolve(body) };
}
function makeFetch(handler) {
  const calls = [];
  const f = (url, opts) => {
    const call = { url: url, opts: opts, body: JSON.parse(opts.body) };
    calls.push(call);
    try { return Promise.resolve(handler(call, calls.length)); }
    catch (e) { return Promise.reject(e); }   // real fetch rejects; it never throws synchronously
  };
  f.calls = calls;
  return f;
}
function makeSandbox() {
  const storeMap = {};
  const localStorage = {
    getItem: (k) => (k in storeMap ? storeMap[k] : null),
    setItem: (k, v) => { storeMap[k] = String(v); },
    removeItem: (k) => { delete storeMap[k]; }
  };
  const timers = [];
  const ctx = {
    console, Date, JSON, Math, Promise, Error,
    localStorage,
    setTimeout: (fn, ms) => { timers.push({ fn: fn, ms: ms }); return timers.length; },
    clearTimeout: () => {},
    ExamRules: {
      getPaper: (id) => (id === "c11-mock-1"
        ? { id: id, title: "Full Syllabus Mock Examination", className: "Class 11", subject: "Accountancy" }
        : (id === "c12-partnership" ? { id: id, title: "Partnership Accounts — Unit 1", className: "Class 12", subject: "Accountancy" } : null))
    }
  };
  const sandbox = vm.createContext(ctx);
  vm.runInContext(src, sandbox, { filename: "exam-records-supabase.js" });
  return { sandbox: sandbox, localStorage: localStorage, timers: timers, storeMap: storeMap };
}
function submittedRec(over) {
  return Object.assign({
    id: "att-20261021-0001-abc",
    candidateId: "cand-1",
    candidateName: "Aarav Test",
    schoolName: "DAV School",
    paperId: "c11-mock-1",
    startedAt: 1760000000000,
    result: {
      marksObtained: 42, maxMarks: 50, percentage: 84, grade: "A",
      passed: true, resultStatus: "PASS", timeTakenSeconds: 1500
    }
  }, over || {});
}
function terminatedRec(over) {
  return Object.assign({
    id: "att-20261021-0002-def",
    candidateId: "cand-1",
    candidateName: "Aarav Test",
    schoolName: "DAV School",
    paperId: "c11-mock-1",
    startedAt: 1760000000000,
    disqualifiedAt: 1760000300000,
    violation: { reason: "copy-attempt", detail: "clipboard read", text: "Copy attempt detected", at: 1760000300000 }
  }, over || {});
}

(async () => {

  section("1 — security: publishable key only, no server secrets");
  {
    ok(!/sb_secret/i.test(src), "1 the file contains no secret (sb_secret_) key");
    ok(!/service_role/i.test(src), "1 the file contains no service_role credential");
    ok(!/eyJhbGciOiJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(src), "1 the file contains no JWT (database secret) anywhere");
    ok(src.includes("sb_publishable_"), "1 the publishable (anon-safe) key is the credential used");
    ok(src.includes("https://jiioxnpamdfurnooglub.supabase.co"), "1 the URL points at the project ref jiioxnpamdfurnooglub (ap-south-1)");
  }

  section("2 — a completed submission maps to submit_exam_record");
  {
    const { sandbox } = makeSandbox();
    const ER = sandbox.ExamRecords;
    const fetchOk = makeFetch(() => resp(200, [{ attempt_id: "att-20261021-0001-abc", certificate_id: "ACC-OCT2026-0001", already_registered: false }]));
    sandbox.fetch = fetchOk;
    ok(ER.configured() === true, "2 the module reports configured with fetch present");
    await ER.syncSubmitted(submittedRec());
    const call = fetchOk.calls[0];
    ok(!!call, "2 exactly one RPC call was made");
    eq(call.url, "https://jiioxnpamdfurnooglub.supabase.co/rest/v1/rpc/submit_exam_record", "2 the RPC endpoint is submit_exam_record on the project URL");
    eq(call.opts.method, "POST", "2 it is a POST");
    eq(call.opts.headers.apikey, "sb_publishable_yvXuGbdKRUO_MrucNy_g5A_1-6G4tl0", "2 the apikey header carries the publishable key");
    eq(call.opts.headers.Authorization, "Bearer sb_publishable_yvXuGbdKRUO_MrucNy_g5A_1-6G4tl0", "2 the Authorization bearer is the same publishable key");
    eq(call.opts.headers.Prefer, "return=representation", "2 Prefer asks for the stored row back (proof of save)");
    eq(call.body.p_attempt_id, "att-20261021-0001-abc", "2 p_attempt_id is the attempt id (the idempotency key)");
    eq(call.body.p_candidate_name, "Aarav Test", "2 p_candidate_name maps");
    eq(call.body.p_class_name, "Class 11", "2 p_class_name comes from the paper definition");
    eq(call.body.p_exam_title, "Full Syllabus Mock Examination", "2 p_exam_title comes from the paper definition");
    eq(call.body.p_result_status, "PASS", "2 p_result_status is PASS");
    eq(call.body.p_marks_obtained, 42, "2 p_marks_obtained maps");
    eq(call.body.p_max_marks, 50, "2 p_max_marks maps");
    eq(call.body.p_percentage, 84, "2 p_percentage maps");
    eq(call.body.p_school_name, "DAV School", "2 p_school_name maps");
    eq(call.body.p_subject, "Accountancy", "2 p_subject is the server-accepted value");
    eq(call.body.p_started_at, new Date(1760000000000).toISOString(), "2 p_started_at is the ISO instant of the local start");
    eq(call.body.p_time_taken_seconds, 1500, "2 p_time_taken_seconds maps");
    eq(call.body.p_verification_status, "client_reported", "2 verification is honestly labelled client_reported");
    const st = ER.statusFor("att-20261021-0001-abc");
    eq(st.state, "synced", "2 only a server-confirmed row reaches status synced");
    eq(st.certificateId, "ACC-OCT2026-0001", "2 the server-allocated certificate id is surfaced to the UI");
    eq(ER.pendingCount(), 0, "2 a successful sync leaves the pending queue empty");
  }

  section("3 — a FAIL is recorded too (completed ≠ passed)");
  {
    const { sandbox } = makeSandbox();
    const ER = sandbox.ExamRecords;
    const fetchOk = makeFetch(() => resp(200, [{ attempt_id: "x", certificate_id: "ACC-OCT2026-0002", already_registered: false }]));
    sandbox.fetch = fetchOk;
    await ER.syncSubmitted(submittedRec({
      id: "att-20261021-0003-ghi",
      paperId: "c12-partnership",
      result: { marksObtained: 18, maxMarks: 50, percentage: 36, grade: "E", passed: false, resultStatus: "FAIL", timeTakenSeconds: 900 }
    }));
    eq(fetchOk.calls[0].body.p_result_status, "FAIL", "3 a failed paper is uploaded with FAIL");
    eq(fetchOk.calls[0].body.p_class_name, "Class 12", "3 a Class 12 paper maps its own class and title");
    eq(fetchOk.calls[0].body.p_exam_title, "Partnership Accounts — Unit 1", "3 the Class 12 paper title maps");
    eq(ER.statusFor("att-20261021-0003-ghi").state, "synced", "3 a FAIL record is still a synced record");
  }

  section("4 — network failure: queued, persisted, retried; never a false 'synced'");
  {
    const { sandbox, storeMap } = makeSandbox();
    const ER = sandbox.ExamRecords;
    const fetchDown = makeFetch(() => { throw new TypeError("fetch failed"); });
    sandbox.fetch = fetchDown;
    await ER.syncSubmitted(submittedRec());
    const st = ER.statusFor("att-20261021-0001-abc");
    eq(st.state, "queued", "4 a network failure reports queued — never synced");
    ok(st.certificateId === null, "4 no certificate id is invented on failure");
    eq(ER.pendingCount(), 1, "4 the record entered the pending queue");
    ok(String(storeMap["aba_exam_records_queue_v1"] || "").includes("att-20261021-0001-abc"), "4 the queue is persisted to localStorage for a later session");

    // the drain retries while the network is still down: entry stays, tries grow
    await ER.drainQueue(true);
    const entries = ER._internals.queueLoad();
    eq(entries.length, 1, "4 a failed retry keeps the entry queued");
    ok(entries[0].tries >= 2, "4 the retry counter grows (backoff input)", "tries=" + (entries[0] && entries[0].tries));

    // network returns: drain succeeds and clears everything
    const fetchUp = makeFetch(() => resp(200, [{ attempt_id: "att-20261021-0001-abc", certificate_id: "ACC-OCT2026-0009", already_registered: false }]));
    sandbox.fetch = fetchUp;
    await ER.drainQueue(true);
    eq(fetchUp.calls.length, 1, "4 the queued payload is replayed exactly once when the network returns");
    eq(fetchUp.calls[0].body.p_attempt_id, "att-20261021-0001-abc", "4 the replay keeps the same attempt_id (server-side idempotency key)");
    eq(ER.pendingCount(), 0, "4 the queue is empty after a successful drain");
    const st2 = ER.statusFor("att-20261021-0001-abc");
    eq(st2.state, "synced", "4 the status becomes synced only after the server confirmed");
    eq(st2.certificateId, "ACC-OCT2026-0009", "4 the replay surfaces the server certificate id");
  }

  section("5 — a server validation rejection is permanent: failed, dropped, no retry loop");
  {
    const { sandbox } = makeSandbox();
    const ER = sandbox.ExamRecords;
    const fetchBad = makeFetch(() => resp(400, { message: "INVALID_CLASS_NAME" }));
    sandbox.fetch = fetchBad;
    await ER.syncSubmitted(submittedRec({ paperId: "weird-paper" }));
    const st = ER.statusFor("att-20261021-0001-abc");
    eq(st.state, "failed", "5 a 400 validation refusal is reported as failed — not synced, not queued");
    ok(String(st.detail).includes("INVALID_CLASS_NAME"), "5 the server's reason is kept for honest display");
    eq(ER.pendingCount(), 0, "5 a permanent rejection is dropped from the queue (no infinite retry)");
    await ER.drainQueue(true);
    eq(fetchBad.calls.length, 1, "5 draining afterwards makes no further call for the dropped record");
  }

  section("6 — terminated attempts: reason mapped, race reported honestly");
  {
    const { sandbox } = makeSandbox();
    const ER = sandbox.ExamRecords;
    const fetchTerm = makeFetch(() => resp(200, [{ attempt_id: "att-20261021-0002-def", stored: true, already_submitted: false }]));
    sandbox.fetch = fetchTerm;
    await ER.syncTerminated(terminatedRec());
    const call = fetchTerm.calls[0];
    eq(call.url, "https://jiioxnpamdfurnooglub.supabase.co/rest/v1/rpc/record_terminated_attempt", "6 the terminated attempt uses record_terminated_attempt");
    eq(call.body.p_attempt_id, "att-20261021-0002-def", "6 p_attempt_id maps");
    eq(call.body.p_termination_reason, "Copy attempt detected", "6 the recorded violation text becomes the termination reason");
    eq(call.body.p_security_event_code, "copy-attempt", "6 the machine reason code becomes the security event code");
    eq(call.body.p_started_at, new Date(1760000000000).toISOString(), "6 p_started_at maps");
    eq(call.body.p_time_taken_seconds, 300, "6 time_taken is the seconds from start to disqualification");
    eq(ER.statusFor("att-20261021-0002-def").state, "synced", "6 a stored termination is synced");

    // the race where a submission already won server-side
    const fetchRace = makeFetch(() => resp(200, [{ attempt_id: "att-20261021-0002-def", stored: false, already_submitted: true }]));
    sandbox.fetch = fetchRace;
    await ER.syncTerminated(terminatedRec());
    const st = ER.statusFor("att-20261021-0002-def");
    eq(st.state, "skipped", "6 an already-submitted race is reported skipped — never as a saved termination");
    ok(st.state !== "synced", "6 the UI can never show 'recorded' for a termination the server refused");
  }

  section("7 — replay safety: the same attempt always carries the same attempt_id");
  {
    const { sandbox } = makeSandbox();
    const ER = sandbox.ExamRecords;
    let n = 0;
    const fetchIdem = makeFetch(() => {
      n++;
      return n === 1
        ? resp(200, [{ attempt_id: "att-20261021-0001-abc", certificate_id: "ACC-OCT2026-0001", already_registered: false }])
        : resp(200, [{ attempt_id: "att-20261021-0001-abc", certificate_id: "ACC-OCT2026-0001", already_registered: true }]);
    });
    sandbox.fetch = fetchIdem;
    await ER.syncSubmitted(submittedRec());
    await ER.syncSubmitted(submittedRec());   // double-click / double-tab replay
    eq(fetchIdem.calls.length, 2, "7 both calls went out with the identical idempotency key");
    eq(fetchIdem.calls[0].body.p_attempt_id, fetchIdem.calls[1].body.p_attempt_id, "7 the attempt_id is byte-identical across replays");
    eq(ER.statusFor("att-20261021-0001-abc").state, "synced", "7 an already_registered answer still means the record exists (synced)");
  }

  section("8 — the master switch disables everything");
  {
    const { sandbox } = makeSandbox();
    const ER = sandbox.ExamRecords;
    const fetchNever = makeFetch(() => resp(200, []));
    sandbox.fetch = fetchNever;
    ER._config.enabled = false;
    eq(ER.configured(), false, "8 configured() is false when disabled");
    const r1 = await ER.syncSubmitted(submittedRec());
    const r2 = await ER.syncTerminated(terminatedRec());
    ok(r1 === null && r2 === null, "8 both syncs are no-ops that return null");
    eq(fetchNever.calls.length, 0, "8 not a single network call is made when disabled");
    ok(ER.statusFor("att-20261021-0001-abc") === null, "8 no status is written for a disabled sync");
  }

  /* ================= summary ================= */
  console.log("\n" + "=".repeat(60));
  console.log(`Supabase exam-records client tests: ${pass} passed / ${fail} failed`);
  if (failures.length) {
    console.log("\nFAILURES");
    failures.forEach((f) => console.log("  ✗ " + f));
    process.exit(1);
  }
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
