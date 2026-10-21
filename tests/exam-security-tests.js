/* Exam session integrity — regression tests.   Run:  node tests/exam-security-tests.js
   (Node 18+, no packages.)  Dev only, not loaded by the website.

   Drives exam-security.js (createExamSession) with a fake storage and
   clock so every behaviour students depend on is executed:
     A  start persists an active attempt; synchronous writes
     B  the countdown derives from the stored deadline — a refresh,
        a reopened tab or a shifted device clock adds no time
     C  progress saving: answers/marked/index survive round trips
     D  load-time recovery: null / active (RESTORED, not killed) /
        expired (saved answers kept for submission) / submitted / void
     E  interruptions are counted and persisted, never disqualifying
     F  submission is final; clear() refuses to drop a live attempt
     G  one device, one live attempt (double-click cannot open two)
     H  clock integrity: a dragged system clock cannot extend the paper
*/
const path = require("path");
const ExamSecurity = require(path.resolve(__dirname, "..", "exam-security.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

/* ---- fake storage + injected clock ---- */
function makeEnv() {
  const store = new Map();
  const storage = {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: k => { store.delete(k); }
  };
  let clock = 1_700_000_000_000;          // arbitrary fixed epoch
  const changes = [];
  const env = {
    storage, changes,
    now: () => clock,
    advance: ms => { clock += ms; },
    raw: () => storage.getItem(ExamSecurity.STORAGE_KEY),
    stored: () => JSON.parse(env.raw() || "null"),
    session(extra) {
      return ExamSecurity.createExamSession(Object.assign({
        storage, now: env.now,
        onChange: rec => changes.push(rec.status)
      }, extra || {}));
    },
    /* A fresh session object over the SAME storage — what the next
       page load creates after a refresh, crash or closed tab. */
    reload(extra) { return env.session(extra); }
  };
  return env;
}

const QS = n => Array.from({ length: n }, (_, i) => ({ id: "q" + i, q: "Q" + i, options: ["a", "b"], i }));

function beginFull(session, env, opts) {
  opts = opts || {};
  return session.begin(Object.assign({
    id: "ATT-TEST-1", paperId: "full", title: "Full Syllabus",
    candidateName: "Test Student", durationMinutes: 30,
    startedAt: env.now(), deadlineAt: env.now() + 30 * 60 * 1000,
    questions: QS(5)
  }, opts));
}

/* ================= A. start + synchronous persistence ================= */
section("A. Start persists an active attempt (synchronously)");
{
  const env = makeEnv();
  const s = env.session();
  const rec = beginFull(s, env);
  eq(rec.status, "active", "begin() creates an active record");
  eq(env.stored().id, "ATT-TEST-1", "the record is on storage immediately");
  eq(env.stored().answers.length, 5, "one answer slot per question");
  eq(env.stored().visited[0], true, "the first question is marked visited");
  ok(env.changes.length >= 1, "onChange fired for the write");

  // A failed storage write must not throw.
  const dead = ExamSecurity.createExamSession({
    storage: { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } },
    now: env.now
  });
  let threw = false;
  try { beginFull(dead, env); } catch (e) { threw = true; }
  ok(!threw, "a blocked storage never throws into the UI");
}

/* ================= B. deadline-based countdown ================= */
section("B. The countdown comes from the deadline, not a counter");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  const deadlineAt = env.stored().deadlineAt;
  eq(s.secondsLeft(), 1800, "exactly 30 minutes at start");
  env.advance(10 * 60 * 1000);                 // ten minutes pass
  eq(s.secondsLeft(), 1200, "ten minutes later, 20 minutes remain");
  // An explicit reference time (restore maths): one million ms BEFORE
  // now shows the deadline distance + 1000 seconds.
  eq(s.secondsLeft(s.read(), env.now() - 1000 * 1000), 2200, "an explicit at-time is honoured (restore maths)");

  // Refresh: a brand-new session object, same storage, same deadline.
  const s2 = env.reload();
  eq(s2.secondsLeft(), 1200, "a refresh does NOT reset the countdown");
  eq(s2.read().deadlineAt, deadlineAt, "the stored deadline is untouched by a reload");

  // Device clock tampering: moving the local clock backwards cannot
  // extend the paper, because the deadline itself is absolute.
  const skewed = ExamSecurity.createExamSession({
    storage: env.storage,
    now: () => env.now() - 60 * 60 * 1000       // clock an hour behind
  });
  // secondsLeft uses now() from the record's perspective — with a
  // backwards clock the remaining time INFLATES on screen, so the app
  // sets the server clock first; verify the server-clock correction.
  const s3 = env.session();
  s3.setServerClock(env.now());                  // skew = 0 in this test env
  eq(s3.getClockOffset(), 0, "server clock with no skew offsets nothing");

  // Expired math
  env.advance(30 * 60 * 1000);
  eq(env.reload().secondsLeft(), 0, "at the deadline, zero seconds remain");
  eq(env.reload().isExpired(), true, "at the deadline the attempt reads expired");
}

/* ================= C. progress saving ================= */
section("C. Progress is written synchronously on every change");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  const answers = [1, null, 0, null, 2];
  s.saveProgress({ answers, marked: [false, true, false, false, false], index: 2 });
  const stored = env.stored();
  eq(stored.answers[0], 1, "the first answer is persisted");
  eq(stored.answers[1], null, "an unanswered slot stays null");
  eq(stored.marked[1], true, "a mark-for-review flag is persisted");
  eq(stored.index, 2, "the current question index is persisted");
  eq(stored.visited[2], true, "jumping to a question marks it visited");

  // Length mismatches are ignored rather than corrupting the record.
  s.saveProgress({ answers: [0], marked: [], index: 99 });
  eq(env.stored().answers.length, 5, "a short answers array cannot clobber the record");
  eq(env.stored().index, 2, "an out-of-range index is ignored");

  // Progress cannot be written into a submitted attempt.
  s.markSubmitted();
  eq(s.saveProgress({ answers: [2, 2, 2, 2, 2] }), null, "a submitted attempt accepts no further progress");
  eq(env.stored().answers[0], 1, "the submitted answers are unchanged");
}

/* ================= D. recovery on the next load ================= */
section("D. Recovery after refresh / crash / expiry");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  s.saveProgress({ answers: [1, 0, null, null, null], index: 1 });

  // Browser dies with no event — next load finds the attempt.
  const s2 = env.reload();
  const rec = s2.recover();
  eq(rec.state, "active", "an unfinished, unexpired attempt is RESTORED, not terminated");
  eq(rec.record.answers[0], 1, "the saved answers come back with it");
  eq(rec.record.deadlineAt, env.stored().deadlineAt, "the original deadline comes back with it");

  // Repeating recovery is idempotent.
  eq(s2.recover().state, "active", "recovery is idempotent across repeat loads");

  // Past the deadline: flagged expired so the app SUBMITS the saved work.
  env.advance(31 * 60 * 1000);
  const s3 = env.reload();
  const expired = s3.recover();
  eq(expired.state, "expired", "a past-deadline attempt recovers as expired");
  eq(expired.record.answers[0], 1, "expired recovery keeps the saved answers for grading");
  eq(s3.read().answers[0], 1, "the saved answers are still on disk after expiry");
}
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  s.markSubmitted({ certId: "ACC-JAN2026-0001" });
  const s2 = env.reload();
  eq(s2.recover().state, "submitted", "a submitted attempt is recovered as submitted");
  eq(s2.recover().record.summary.certId, "ACC-JAN2026-0001", "the stored summary survives the reload");
}
{
  const env = makeEnv();
  eq(env.session().recover().state, null, "nothing stored → recover() reports null");
}
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  s.void();
  eq(env.reload().recover().state, "void", "a voided attempt recovers as void (start fresh)");
}

/* ================= E. interruptions are counted, not punished ========= */
section("E. Interruption tracking (transparent, never disqualifying)");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  eq(s.noteInterruption("tab-or-app-hidden"), 1, "the first interruption returns count 1");
  eq(s.noteInterruption("window-focus-lost"), 2, "the second returns count 2");
  eq(env.stored().interruptionCount, 2, "the count is persisted");
  eq(env.stored().interruptions.length, 2, "each interruption keeps its reason");
  eq(env.stored().status, "active", "interruptions never change the attempt status");
  eq(env.reload().recover().state, "active", "an interrupted attempt is still RESTORABLE");

  for (let i = 0; i < 30; i++) s.noteInterruption("navigated");
  eq(env.stored().interruptionCount, 32, "the total keeps counting");
  eq(env.stored().interruptions.length, 20, "the detail list is capped at 20 entries");

  ok(ExamSecurity.reasonText("page-reloaded").indexOf("reloaded") !== -1, "reason text maps the reload reason");
  eq(ExamSecurity.reasonText("unknown-reason"), "The examination was interrupted.", "unknown reasons fall back safely");
  s.markSubmitted();
  eq(s.noteInterruption("tab-or-app-hidden"), null, "a finished attempt records no more interruptions");
}

/* ================= F. submission is final ================= */
section("F. Submission finality and clear() safety");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  const out = s.markSubmitted({ result: { resultStatus: "PASS" }, certId: "ACC-OCT2026-0105" });
  eq(out.status, "submitted", "markSubmitted() flips the status");
  eq(env.stored().submittedAt, env.now(), "the submission timestamp is persisted");
  eq(env.stored().summary.certId, "ACC-OCT2026-0105", "the summary (result + cert id) is persisted");

  // clear() must never drop a LIVE attempt…
  const env2 = makeEnv();
  const s2 = env2.session();
  beginFull(s2, env2);
  eq(s2.clear(), false, "clear() refuses to drop a live active attempt");
  ok(env2.raw() !== null, "the live attempt is still on disk after clear()");
  // …but a finished one can be forgotten.
  s2.markSubmitted();
  eq(s2.clear(), true, "clear() forgets a submitted attempt");
  eq(env2.raw(), null, "the record is gone after clear()");
}

/* ================= G. one device, one live attempt ================= */
section("G. Double-start cannot open two live attempts");
{
  const env = makeEnv();
  const s = env.session();
  const first = beginFull(s, env);
  env.advance(5000);
  const second = s.begin({ id: "ATT-OTHER", questions: QS(3), startedAt: env.now(), deadlineAt: env.now() + 1000 });
  ok(second.id === first.id, "a second begin() returns the SAME live attempt");
  eq(env.stored().id, "ATT-TEST-1", "the stored attempt is unchanged by the double-start");
  eq(env.stored().answers.length, 5, "the original paper's answer slots are intact");

  // Once the stored attempt has expired, a begin() may replace it
  // (the expired one is recovered for submission by the app first —
  // begin() only yields once it is no longer active-and-unexpired).
  env.advance(31 * 60 * 1000);
  const third = s.begin({ id: "ATT-NEW", questions: QS(2), startedAt: env.now(), deadlineAt: env.now() + 1000 });
  eq(third.id, "ATT-NEW", "an expired attempt no longer blocks a new begin()");
}

section("H. Clock integrity — a moved system clock cannot extend the paper");
{
  const env = makeEnv();
  let mono = 5_000_000;                       // monotonic ms, injected alongside `now`
  const s = env.session({ monotonicNow: () => mono });
  const rec = beginFull(s, env);
  eq(rec.clockAnomalies, 0, "H a fresh attempt starts with the anomaly counter at 0");

  const before = s.secondsLeft();             // first live read anchors the segment
  env.advance(60_000); mono += 60_000;        // time passes honestly on BOTH clocks
  const stepped = s.secondsLeft();
  eq(stepped, before - 60, "H clocks in step: countdown is the plain deadline maths");

  env.advance(-600_000);                      // student drags the system clock BACK 10 min
  const afterBack = s.secondsLeft();
  eq(afterBack, stepped, "H dragging the clock back adds no time — monotonic clamp holds");

  const stored = env.stored();
  eq(stored.clockAnomalies, 1, "H the adjustment is counted once on the attempt");
  eq(stored.interruptionCount, 1, "H it is also recorded as a visible interruption");
  eq(stored.interruptions[stored.interruptions.length - 1].reason, "clock-adjusted", "H the interruption carries the clock-adjusted reason");

  env.advance(600_000); mono += 60_000;       // real time resumes, in step again
  const recovered = s.secondsLeft();
  ok(recovered <= stepped, "H after the jump the countdown never exceeds the honest value", `recovered ${recovered} vs ${stepped}`);
}

/* ================= I. disqualification (the anti-cheat path) =====
   One incident consumes exactly one attempt: the status flips
   once, one violation is written, and afterwards the record can
   never be restored, re-progressed or submitted. */
section("I. Disqualification is terminal, idempotent, single-record");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);

  ok(s.noteInterruption("tab-or-app-hidden") === 1, "interruption counted before any violation");
  const dq = s.disqualify("tab-or-app-switched", "hidden past the grace window");
  ok(dq && dq.status === "disqualified", "the first disqualify flips the status");
  ok(dq.violation && dq.violation.reason === "tab-or-app-switched", "the violation records its reason");
  ok(dq.violation.detail === "hidden past the grace window", "the violation records the detail");
  ok(typeof dq.violation.text === "string" && dq.violation.text.length > 10, "the violation carries readable text");
  ok(dq.violations.length === 1, "exactly ONE violation entry is written");
  ok(typeof dq.disqualifiedAt === "number", "the disqualification is timestamped");
  eq(env.stored().status, "disqualified", "the violation lands in storage synchronously");

  // A burst of detector events for the same incident is a no-op.
  s.disqualify("screenshot-attempt", "second event, same incident");
  const again = s.read();
  ok(again.status === "disqualified", "status stays disqualified");
  ok(again.violations.length === 1, "a second disqualify writes no second violation");
  ok(again.violation.reason === "tab-or-app-switched", "the FIRST reason wins — one incident, one record");

  // Nothing can breathe life back into the record.
  ok(s.saveProgress({ answers: [1, 0, 0, 0, 0] }) === null, "progress cannot be saved on a disqualified attempt");
  ok(s.markSubmitted() === null, "a disqualified attempt can never become submitted");
  ok(s.read().status === "disqualified", "still disqualified after the submit attempt");
  ok(s.recover().state === "disqualified", "load-time recovery reports disqualified");
  ok(s.recover().record.violation.reason === "tab-or-app-switched", "the reason survives a reload");

  // Interruption bookkeeping kept working up to the violation.
  ok(s.read().interruptionCount >= 2, "interruptions remain counted alongside the violation");

  // clear() is allowed afterwards (set up a NEW attempt), and the
  // cleared record never comes back.
  ok(s.clear() === true, "a disqualified session record may be cleared to start over");
  ok(s.recover().state === null, "nothing remains after clearing");
  const fresh = s.begin({ id: "ATT-NEW", questions: QS(2) });
  ok(fresh.status === "active" && fresh.id === "ATT-NEW", "a fresh attempt starts cleanly after the clear");
}

/* begin() over a disqualified record never hands it back as if it
   were a live paper (defence in depth for the start flow). */
section("I1b. begin() never resumes a disqualified record");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  s.disqualify("navigation-attempt", "left the paper");
  const started = s.begin({ id: "ATT-REPL", questions: QS(2) });
  ok(started.status === "active" && started.id === "ATT-REPL", "a new record replaces it — never resumed as active");
}

/* An interruption can NEVER disqualify on its own — that is the
   whole separation this module exists to hold. */
section("I2. Interruptions alone never disqualify");
{
  const env = makeEnv();
  const s = env.session();
  beginFull(s, env);
  ["tab-or-app-hidden", "window-focus-lost", "navigated", "page-reloaded", "clock-adjusted"].forEach((r) => s.noteInterruption(r));
  eq(s.read().status, "active", "five interruptions later the attempt is still active");
  ok(s.recover().state === "active", "and it still recovers as active");
  ok(s.read().violations.length === 0, "no violation entry was written");
}

/* ---------- static structure of the app layer ----------
   The browser cannot run here, but these assert the WIRING the
   spec requires: every detector funnels into ONE disqualification
   path, the navigation guard exists, and the verify surface and
   QR are gone. */
section("I3. app.js wiring: one funnel, guarded navigation, no verify surface");
{
  const fs2 = require("fs");
  const app = fs2.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
  const count = (t) => app.split(t).length - 1;
  ok(count("examSession.disqualify") === 1, "exactly one session-disqualify call site in app.js");
  ok(count("action === \"disqualify\"") === 1, "the store exposes the disqualify action");
  ok(count("examViolationDetected(\"tab-or-app-switched\"") >= 1, "hidden-page detector funnels into the path");
  ok(count("examViolationDetected(\"screenshot-attempt\"") >= 1, "capture detector funnels into the path");
  ok(count("examViolationDetected(\"navigation-attempt\"") >= 1, "navigation detector funnels into the path");
  ok(count("examNavigationBlocked") >= 3, "navigate() and renderRoute() both call the navigation guard");
  ok(!app.includes("examNoteNavigationInterruption"), "the old record-only navigation path is gone");
  ok(!app.includes("certificate-verify"), "the certificate-verify route is gone from app.js");
  ok(app.includes("Attempt already finished") && app.includes('rec.status !== "active"'), "the store refuses to disqualify a submitted attempt");
  ok(app.includes("examState.submitting || examState.terminating"), "a submission in flight or a second event cannot re-trigger");
  ok(app.includes("function examCertificateEligible"), "the certificate eligibility gate exists");
  ok(app.includes("body.classList.add(\"exam-live\")"), "the lockdown class is applied while a paper runs");
  ok(app.includes("body.classList.remove(\"exam-live\")"), "the lockdown class is removed when the paper ends");

  const cert = fs2.readFileSync(path.resolve(__dirname, "..", "certificate.js"), "utf8");
  ok(!cert.includes("qrcode") && !cert.includes("QRCode"), "no QR library remains in certificate.js");
  ok(!cert.includes("Scan to verify"), "no scan-to-verify claim remains");
  ok(!cert.includes("certificate-verify") && !cert.includes("renderVerifyView"), "no verify route/view remains");
  ok(cert.includes("assets/cert-border-bg.jpg"), "the ornate border image is the certificate background");
  ok(cert.includes("function certGate"), "every export path passes the eligibility gate");

  const rules = fs2.readFileSync(path.resolve(__dirname, "..", "exam-rules.js"), "utf8");
  ok(!rules.includes("certificateVerifyUrl"), "the verify-URL helper is gone from exam-rules.js");
}

/* ---------- I4. immediate, synchronous visibility handling ----------
    A backgrounded mobile page can be FROZEN by the browser, so a
    delayed callback may never run until the student returns — the
    exact bug these tests pin down. The disqualification decision must
    live synchronously inside the visibilitychange handler, with the
    unload sequence (refresh/close: beforeunload → pagehide →
    visibilitychange — verified by tests/probe-lifecycle.html in
    Chromium) excluded through the examPageUnloading marker. */
section("I4. visibility handling is immediate, synchronous and unload-aware");
{
  const fs2 = require("fs");
  const app = fs2.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
  const slice = (from, to) => {
    const a = app.indexOf(from);
    if (a === -1) return "";
    const b = app.indexOf(to, a);
    return b === -1 ? "" : app.slice(a, b);
  };

  const vis = slice("function examOnVisibilityChange()", "/* The page is going away");
  const visCode = vis.replace(/\/\/[^\n]*/g, "");   // explanatory comments are not code
  ok(vis.length > 100, "the visibility handler is present");
  ok(!/setTimeout/.test(visCode), "the visibility handler uses NO timer — the decision is synchronous");
  ok(!/await/.test(visCode), "the visibility handler awaits nothing — it cannot be suspended mid-decision");
  ok(vis.includes('noteInterruption("tab-or-app-hidden")'), "the hidden interruption is recorded synchronously first");
  ok(vis.includes("if (examPageUnloading) return;"), "unload markers (refresh/close/navigation) are excluded before disqualifying");
  ok(vis.includes('examViolationDetected("tab-or-app-switched"'), "a confirmed tab/app switch funnels into the central path immediately");

  const bu = slice("function examOnBeforeUnload(e)", "/* Viewport / split-screen SIGNAL");
  ok(bu.includes("examPageUnloading = true"), "beforeunload arms the unload marker (earliest navigation signal)");
  const ph = slice("function examOnPageHide()", "/* bfcache restore");
  ok(ph.includes("examPageUnloading = true"), "pagehide arms the unload marker as well");
  const ps = slice("function examOnPageShow(e)", "/* Browser-native warning");
  ok(ps.includes("examPageUnloading = false"), "pageshow disarms the unload marker on bfcache restore");
  ok(ps.includes('rec.status === "disqualified"'), "a restored page re-checks the stored record: disqualified can never revive as valid");

  /* Cancelled-dialog regression guard. beforeunload CAN be cancelled:
     navigation aborts and NO pagehide/pageshow/other event fires
     (verified in-browser), which would leave examPageUnloading armed
     forever and silently disable every later tab-switch DQ. A guarded
     setTimeout must disarm the marker exactly in that case. */
  ok(/setTimeout/.test(bu), "beforeunload schedules a disarm guard for the cancelled-dialog case");
  ok(bu.includes("examPageHideSeen = false"), "beforeunload resets the pagehide-seen flag for this navigation attempt");
  ok(bu.includes("!examPageHideSeen") && bu.includes('visibilityState === "visible"'),
     "the guard disarms only when pagehide never fired AND the page is still visible (cancelled dialog)");
  ok(!/setTimeout/.test(visCode), "the visibility decision itself still uses NO timer (unchanged)");
  ok(ph.includes("examPageHideSeen = true"), "pagehide marks the navigation as a REAL unload so the guard cannot disarm it");
  ok(ps.includes("examPageHideSeen = false"), "pageshow clears the pagehide-seen flag for the fresh page");

  const vd = slice("async function examViolationDetected(reason, detail)", "function examAttachListeners()");
  ok(vd.includes('examState.status = EXAM_STATUS.TERMINATED'), "the central handler flips the status synchronously");
  const saveAt = vd.indexOf('const saveP = examApi("save"');
  const disqAt = vd.indexOf('const disqP = examApi("disqualify"');
  const awaitAt = vd.indexOf("await saveP");
  ok(saveAt !== -1 && disqAt !== -1, "both store writes are INVOKED (not awaited) up front");
  ok(saveAt !== -1 && awaitAt !== -1 && saveAt < awaitAt, "the save store mutation runs before the first await");
  ok(disqAt !== -1 && awaitAt !== -1 && disqAt < awaitAt, "the disqualify store mutation runs before the first await — synchronous persistence");
  ok(vd.includes("examToggleSheet(false)"), "a disqualification closes any open palette sheet and backdrop");

  const oc = slice("function examOnViewportChange()", "/* Print: blocked");
  ok(oc.includes('noteInterruption("viewport-changed")'), "a large viewport collapse is RECORDED");
  ok(!oc.includes("examViolationDetected"), "a resize alone NEVER disqualifies (no false positives)");

  const pb = slice("function examOnPasteBlocked(e)", "function examOnContextMenu");
  ok(pb.includes('examBlockEvent("paste-attempt"'), "paste is blocked and recorded during an active paper");

  const at = slice("function examAttachListeners()", "function examDetachListeners()");
  const dt = slice("function examDetachListeners()", "Honest submission: a summary dialog");
  ["visibilitychange", "blur", "pagehide", "pageshow", "beforeunload", "afterprint",
   "resize", "keydown", "keyup", "copy", "cut", "paste", "contextmenu", "selectstart", "beforeprint"
  ].forEach((ev) => {
    ok(at.includes(`addEventListener("${ev}"`), `listener attached: ${ev}`);
    ok(dt.includes(`removeEventListener("${ev}"`), `listener detached: ${ev}`);
  });
  ok(dt.includes('classList.remove("ex-sheet-open")'), "detaching cleans any stale palette sheet lock from the body");
}

/* ---------- I5. question palette sheet: open/close reliability ----
   The old mobile backdrop was body.ex-sheet-open::after — a
   pseudo-element that could receive no events and survived re-renders
   as an invisible tap-eating overlay (the mobile freeze). These
   checks pin the repaired wiring: a real dismissible backdrop,
   close-before-navigate, Escape, scroll-lock restore, self-healing
   after renders and no duplicate handlers. */
section("I5. Question Palette sheet: reliable open/close wiring");
{
  const fs2 = require("fs");
  const app = fs2.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
  const css = fs2.readFileSync(path.resolve(__dirname, "..", "styles.css"), "utf8");
  const slice = (from, to) => {
    const a = app.indexOf(from);
    if (a === -1) return "";
    const b = app.indexOf(to, a);
    return b === -1 ? "" : app.slice(a, b);
  };

  ok(css.includes(".ex-sheet-backdrop"), "the backdrop is a real, styled element");
  ok(!css.includes("body.ex-sheet-open::after"), "the un-dismissable pseudo-element backdrop is gone");
  ok(css.includes("overscroll-behavior: contain"), "the mobile sheet contains its own scroll (no background rubber-banding)");
  ok(css.includes("100dvh"), "the mobile sheet is clamped to the dynamic viewport (notch / URL-bar safe)");
  ok(css.includes(".ex-side-col { position: fixed"), "the sheet stays a fixed bottom sheet");

  const mk = slice("function examSheetEnsureBackdrop()", "let examSheetPrevOverflow");
  ok(mk.includes("if (examSheetBackdropEl()) return;"), "opening twice never stacks duplicate backdrops");
  ok(mk.includes('bd.addEventListener("click"'), "the backdrop has its own click-to-dismiss handler");
  ok(mk.includes('document.addEventListener("keydown", examSheetOnEscape, true)'), "Escape handling is registered with the backdrop");
  ok(!mk.includes("examViolationDetected"), "dismissing the palette is never a security event");

  const esc = slice("function examSheetOnEscape(e)", "function examSheetEnsureBackdrop()");
  ok(esc.includes('e.key === "Escape"') && esc.includes("examToggleSheet(false)"), "Escape closes the palette");

  const tg = slice("function examToggleSheet(open)", "/* Self-heal after any full re-render");
  ok(tg.includes("examSheetRemoveBackdrop()"), "closing removes the backdrop element");
  ok(tg.includes("document.body.style.overflow = examSheetPrevOverflow"), "closing restores the exact previous body scroll state");
  ok(tg.includes('classList.toggle("ex-sheet-open", willOpen)'), "the body lock class tracks the real open state");

  const nm = slice("function examSheetNormalize()", "function examGotoQuestion");
  ok(nm.includes("examSheetRemoveBackdrop()"), "self-heal removes any orphan backdrop");
  ok(nm.includes('classList.remove("ex-sheet-open")'), "self-heal clears the body lock class");
  ok(app.includes("examSheetNormalize();"), "renderExamActive self-heals sheet state on every render");

  const panel = slice("function examPalettePanel()", "/* Recolour palette buttons");
  const closeAt = panel.indexOf("examToggleSheet(false)");
  const goAt = panel.indexOf("examGotoQuestion(i)");
  ok(closeAt !== -1 && goAt !== -1 && closeAt < goAt, "tapping a question closes the sheet BEFORE navigation re-renders");
  ok(panel.includes('closest(".ex-pq")'), "the palette uses delegated clicks (handlers survive re-renders)");
  ok(panel.includes('$("#exSheetClose", panel)'), "the close button is wired on the panel itself");

  ok(app.includes("renderExamTerminated"), "the disqualification screen renders for a recorded violation");
}

/* ---------- I6. v89 Part 6: privileged codes are server-side only --
    The unlock codes and the admin token once shipped in PLAINTEXT in
    app.js — every downloaded copy of the site held every secret. These
    assertions keep them out of every delivered file: the legacy codes
    can never reappear in the browser code, the ONLY call site is the
    dedicated client module, and the server reads the codes from
    environment variables with no hardcoded fallback. */
section("I6. v89 Part 6: unlock/admin secrets are server-side only");
{
  const fs2 = require("fs");
  const rd = (p) => fs2.readFileSync(path.resolve(__dirname, "..", p), "utf8");
  const app = rd("app.js");
  const client = rd("exam-access-client.js");
  const html = rd("index.html");
  const sw = rd("sw.js");
  const server = rd("netlify/functions/exam-access.js") + "\n" + rd("netlify/functions/lib/exam-access.js");

  /* 1. the legacy plaintext codes are gone from the delivered code */
  ["0MK77", "MK25072010", "ABA-ADMIN-2026"].forEach((secret) => {
    ok(app.indexOf(secret) === -1 && client.indexOf(secret) === -1,
      "legacy code " + secret + " is not in the browser code");
  });
  ok(!app.includes("examSecretEqual"), "the local secret-compare helper is gone from app.js");
  ok(!/function examAccessVerify/.test(app), "app.js no longer declares the privileged-code check itself");

  /* 2. the one browser call site lives in the dedicated client module,
     loaded before app.js (core-shell invariant: ai-tests section G) */
  ok(/fetch\("\/\.netlify\/functions\/exam-access"/.test(client),
    "exam-access-client.js performs the single server call");
  const cIdx = html.indexOf("exam-access-client.js"), aIdx = html.indexOf("app.js?v=");
  ok(cIdx !== -1 && aIdx !== -1 && cIdx < aIdx, "index.html loads the client module BEFORE app.js");
  ok(sw.includes('"./exam-access-client.js"'), "the client module is precached with the app shell");

  /* 3. the server reads the codes ONLY from environment variables and
     compares them timing-safely; no hardcoded default may reappear */
  ok(server.includes("EXAM_UNLOCK_TWO") && server.includes("EXAM_UNLOCK_UNLIMITED") && server.includes("EXAM_ADMIN_TOKEN"),
    "the server reads all three privileged values from env vars");
  ok(!/(===|==)\s*["'](0MK77|MK25072010|ABA-ADMIN-2026)["']/.test(server),
    "no legacy code is hardcoded on the server either");
  ok(server.includes("timingSafeEqual"), "the server comparison is timing-safe");
  ok(server.includes('purpose === "unlock"') && server.includes('purpose === "admin"'),
    "the server judges both purposes");

  /* 4. the client never judges locally — it only interprets a verdict
     and fails honestly when the service is unreachable */
  ok(/reachable: false/.test(client), "an unreachable server produces an honest failure object");
  ok(!/EXAM_UNLOCK|EXAM_ADMIN|0MK77/.test(client), "the client module contains no code material at all");
}

console.log("\n" + "=".repeat(60));
console.log(`Exam security tests: ${pass} passed / ${fail} failed`);
if (failures.length) {
  console.log("\nFAILURES");
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
