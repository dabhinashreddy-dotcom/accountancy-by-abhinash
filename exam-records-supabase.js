/* ============================================================
   exam-records-supabase.js — Accountancy By Abhinash
   Server-side persistence for finished examinations.

   Every COMPLETED examination (PASS or FAIL) and every
   SECURITY-TERMINATED attempt is written to the Supabase project
   `accountancy-by-abhinash-exam-records` (exam_records table) so a
   result or a disqualification is never again lost when this
   device's storage is cleared. The write goes through two
   SECURITY DEFINER RPCs (submit_exam_record /
   record_terminated_attempt) that are idempotent per attempt_id:
   retrying, retrying from two tabs, or replaying a queued record
   can never create a second row or a second certificate.

   SECURITY MODEL — the only credential in this file is the
   PUBLISHABLE (anon-safe) API key, which Supabase documents as safe
   to ship in browser code. The secret/service-role key and the
   database password exist nowhere in this repository. The browser
   cannot read or write exam_records directly (RLS has no anon
   policies); it can only call the two RPCs, which validate and
   normalise every input server-side, allocate the certificate id
   server-side (ACC-<MONYYYY>-0001, atomic, exactly once per
   attempt) and refuse to let a terminated attempt become a
   certificate record or vice versa.

   HONESTY CONTRACT (unchanged from the local store's promises):
     * the local attempt store stays authoritative — this module
       can never fail, block or alter a submission, disqualification,
       result, certificate or grade;
     * a status is only ever "synced" when the SERVER confirmed the
       row; a failed upload is reported as failed/queued, never as
       saved;
     * offline attempts are queued in localStorage and retried
       automatically (page load, reconnect, periodic backoff);
     * the certificate id shown to the student keeps coming from the
       existing local issuer (ExamRules.certIdForDate); the server
       independently allocates its own id for the same attempt —
       both share the same attempt_id, which is the join key.
   ============================================================ */
(function (root) {
  "use strict";

  /* ---- configuration -------------------------------------------
     The Supabase project URL contains the project REF
     (jiioxnpamdfurnooglub, region ap-south-1 Mumbai) and the key
     below is the publishable key from that project's API settings.
     Both are public by design. */
  var CFG = {
    url: "https://jiioxnpamdfurnooglub.supabase.co",
    publishableKey: "sb_publishable_yvXuGbdKRUO_MrucNy_g5A_1-6G4tl0",
    rpcSubmit: "submit_exam_record",
    rpcTerminated: "record_terminated_attempt",
    enabled: true,          // master switch; false disables all syncing
    timeoutMs: 12000,       // per-request timeout
    maxQueuedEntries: 40,   // hard cap on the pending queue
    cooldownMs: 20000,      // base cooldown between retries of one entry
    cooldownCapMs: 300000   // max cooldown (5 min) per entry
  };

  var QUEUE_KEY = "aba_exam_records_queue_v1";
  var STATUS_KEY = "aba_exam_records_status_v1";

  /* ---- tiny guarded environment helpers ----------------------- */
  function storage() {
    try { return root.localStorage || null; } catch (e) { return null; }
  }
  function readJSON(key, fallback) {
    var s = storage();
    if (!s) return fallback;
    try {
      var raw = s.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    var s = storage();
    if (!s) return;
    try { s.setItem(key, JSON.stringify(value)); } catch (e) { /* quota / private mode — best-effort */ }
  }
  function now() { return Date.now(); }
  function fetchImpl() {
    try {
      if (typeof root.fetch === "function") return root.fetch.bind(root);
    } catch (e) { /* ignore */ }
    return null;
  }

  /* ---- status map: what the UI may honestly claim ------------- */
  /* States: "syncing" (request in flight), "synced" (server
     confirmed the row), "queued" (kept locally, will retry),
     "failed" (server rejected it — permanent, not retried),
     "skipped" (server already held a final record for this attempt). */
  var listeners = [];
  function setStatus(attemptId, state, extra) {
    var map = readJSON(STATUS_KEY, {});
    map[attemptId] = { state: state, at: now(), certificateId: extra && extra.certificateId || null, detail: extra && extra.detail || null };
    writeJSON(STATUS_KEY, map);
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](attemptId, map[attemptId]); } catch (e) { /* one bad listener must not break the rest */ }
    }
  }
  function statusFor(attemptId) {
    var map = readJSON(STATUS_KEY, {});
    return map[attemptId] || null;
  }

  /* ---- the pending queue -------------------------------------- */
  /* Entries: { kind: "submit"|"terminated", attemptId, args, tries,
     lastTry, queuedAt }. Persisted so a closed tab resumes the
     upload later. */
  function queueLoad() {
    var q = readJSON(QUEUE_KEY, []);
    return Array.isArray(q) ? q : [];
  }
  function queueSave(q) { writeJSON(QUEUE_KEY, q.slice(-CFG.maxQueuedEntries)); }
  function queuePut(entry) {
    var q = queueLoad().filter(function (e) { return e && e.attemptId !== entry.attemptId; });
    q.push(entry);
    queueSave(q);
  }
  function queueDrop(attemptId) {
    queueSave(queueLoad().filter(function (e) { return e && e.attemptId !== attemptId; }));
  }
  function pendingCount() { return queueLoad().length; }

  /* ---- one RPC call ------------------------------------------- */
  /* Returns { ok:true, rows:[…] } or { ok:false, http, message,
     permanent }. "permanent" marks a server-side validation
     rejection that will never succeed on retry. */
  function rpc(name, args) {
    var doFetch = fetchImpl();
    if (!doFetch) return Promise.resolve({ ok: false, message: "fetch-unavailable", permanent: false });
    var controller = null;
    var opts = {
      method: "POST",
      headers: {
        "apikey": CFG.publishableKey,
        "Authorization": "Bearer " + CFG.publishableKey,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(args)
    };
    var tick = null;
    if (typeof root.AbortController === "function") {
      try {
        controller = new root.AbortController();
        opts.signal = controller.signal;
        if (typeof root.setTimeout === "function") {
          tick = root.setTimeout(function () { try { controller.abort(); } catch (e) {} }, CFG.timeoutMs);
        }
      } catch (e) { controller = null; }
    }
    var clear = function () {
      if (tick !== null && typeof root.clearTimeout === "function") { try { root.clearTimeout(tick); } catch (e) {} }
    };
    return doFetch(CFG.url + "/rest/v1/rpc/" + name, opts).then(function (resp) {
      clear();
      return resp.json().catch(function () { return null; }).then(function (body) {
        if (resp.ok) {
          var rows = Array.isArray(body) ? body : (body && typeof body === "object" ? [body] : []);
          return { ok: true, rows: rows };
        }
        var msg = (body && (body.message || body.details || body.hint || body.error)) || ("http-" + resp.status);
        // 400/404/422 from our RPCs = server-side validation refusal
        // (INVALID_ATTEMPT_ID, INVALID_CLASS_NAME, …). Retrying the
        // identical payload can never succeed, so it is permanent.
        var permanent = resp.status === 400 || resp.status === 404 || resp.status === 422;
        return { ok: false, http: resp.status, message: String(msg).slice(0, 200), permanent: permanent };
      });
    }).catch(function (err) {
      clear();
      var msg = (err && err.name === "AbortError") ? "timeout" : ((err && err.message) || "network-error");
      return { ok: false, message: String(msg).slice(0, 200), permanent: false };
    });
  }

  /* ---- payload mapping ---------------------------------------- */
  function paperFor(rec) {
    try {
      if (typeof root.ExamRules !== "undefined" && typeof root.ExamRules.getPaper === "function") {
        return root.ExamRules.getPaper(rec.paperId) || null;
      }
    } catch (e) { /* ignore */ }
    return null;
  }
  function isoOf(ms) {
    if (typeof ms !== "number" || !(ms > 0)) return null;
    try { return new Date(ms).toISOString(); } catch (e) { return null; }
  }
  function secondsBetween(fromMs, toMs) {
    if (typeof fromMs !== "number" || typeof toMs !== "number" || !(toMs >= fromMs)) return null;
    return Math.max(0, Math.round((toMs - fromMs) / 1000));
  }
  /* Class must be one of the two the server accepts; every paper in
     exam-rules.js declares it, and a missing one falls back to the
     site's own default rather than failing the upload. */
  function classOf(paper) {
    var c = paper && paper.className;
    return (c === "Class 11" || c === "Class 12") ? c : "Class 11";
  }
  function mapSubmitted(rec) {
    var paper = paperFor(rec);
    var r = rec.result || {};
    var status = r.resultStatus === "PASS" || r.resultStatus === "FAIL" ? r.resultStatus : (r.passed ? "PASS" : "FAIL");
    return {
      p_attempt_id: rec.id,
      p_candidate_name: rec.candidateName || "",
      p_class_name: classOf(paper),
      p_paper_id: rec.paperId,
      p_exam_title: (paper && paper.title) || rec.paperId,
      p_result_status: status,
      p_marks_obtained: (typeof r.marksObtained === "number") ? r.marksObtained : null,
      p_max_marks: (typeof r.maxMarks === "number") ? r.maxMarks : null,
      p_percentage: (typeof r.percentage === "number") ? Math.round(r.percentage * 100) / 100 : null,
      p_grade: r.grade || null,
      p_school_name: rec.schoolName || null,
      p_subject: "Accountancy",
      p_started_at: isoOf(rec.startedAt),
      p_time_taken_seconds: (typeof r.timeTakenSeconds === "number") ? Math.round(r.timeTakenSeconds) : null,
      p_verification_status: "client_reported"
    };
  }
  function mapTerminated(rec) {
    var paper = paperFor(rec);
    var v = rec.violation || {};
    var reasonText = v.text || v.detail || v.reason || "terminated";
    var endedAt = rec.disqualifiedAt || (v && v.at) || null;
    return {
      p_attempt_id: rec.id,
      p_candidate_name: rec.candidateName || "",
      p_class_name: classOf(paper),
      p_paper_id: rec.paperId,
      p_exam_title: (paper && paper.title) || rec.paperId,
      p_termination_reason: String(reasonText).slice(0, 300),
      p_security_event_code: (typeof v.reason === "string" && v.reason) ? v.reason.slice(0, 80) : null,
      p_school_name: rec.schoolName || null,
      p_subject: "Accountancy",
      p_started_at: isoOf(rec.startedAt),
      p_time_taken_seconds: endedAt ? secondsBetween(rec.startedAt, endedAt) : null
    };
  }

  /* ---- attempt outcomes --------------------------------------- */
  function handleSubmitResponse(attemptId, res) {
    if (res.ok) {
      var row = res.rows && res.rows[0] ? res.rows[0] : null;
      setStatus(attemptId, "synced", { certificateId: row && row.certificate_id ? row.certificate_id : null });
      return true;
    }
    if (res.permanent) {
      // The server refused this payload outright — retrying the same
      // data forever would only lie by omission. Report it honestly.
      setStatus(attemptId, "failed", { detail: res.message });
      return false;
    }
    queuePut({ kind: "submit", attemptId: attemptId, args: lastArgs[attemptId] || null, tries: 1, lastTry: now(), queuedAt: now() });
    setStatus(attemptId, "queued", { detail: res.message });
    scheduleDrain();
    return false;
  }
  function handleTerminatedResponse(attemptId, res) {
    if (res.ok) {
      var row = res.rows && res.rows[0] ? res.rows[0] : null;
      if (row && row.already_submitted) {
        // The submission won the race server-side; the terminated
        // event is correctly NOT stored. Never claim it was saved.
        setStatus(attemptId, "skipped", { detail: "already-submitted" });
        return true;
      }
      setStatus(attemptId, "synced", null);
      return true;
    }
    if (res.permanent) {
      setStatus(attemptId, "failed", { detail: res.message });
      return false;
    }
    queuePut({ kind: "terminated", attemptId: attemptId, args: lastArgs[attemptId] || null, tries: 1, lastTry: now(), queuedAt: now() });
    setStatus(attemptId, "queued", { detail: res.message });
    scheduleDrain();
    return false;
  }

  /* The last built args per attempt, so a queued retry replays the
     exact same validated payload (idempotency key = attempt_id). */
  var lastArgs = {};

  /* ---- public: fire-and-forget sync entry points --------------- */
  /* Called from the exam store's submit / disqualify actions. Both
     return a promise for tests; the store never awaits or trusts
     them — the local attempt remains authoritative. */
  function syncSubmitted(rec) {
    try {
      if (!CFG.enabled || !configured() || !rec || !rec.id || !rec.result) return Promise.resolve(null);
      var args = mapSubmitted(rec);
      lastArgs[rec.id] = args;
      setStatus(rec.id, "syncing", null);
      return rpc(CFG.rpcSubmit, args).then(function (res) {
        handleSubmitResponse(rec.id, res);
        return res;
      });
    } catch (e) {
      try { setStatus(rec.id, "queued", { detail: "client-error" }); } catch (e2) {}
      return Promise.resolve(null);
    }
  }
  function syncTerminated(rec) {
    try {
      if (!CFG.enabled || !configured() || !rec || !rec.id) return Promise.resolve(null);
      var args = mapTerminated(rec);
      lastArgs[rec.id] = args;
      setStatus(rec.id, "syncing", null);
      return rpc(CFG.rpcTerminated, args).then(function (res) {
        handleTerminatedResponse(rec.id, res);
        return res;
      });
    } catch (e) {
      try { setStatus(rec.id, "queued", { detail: "client-error" }); } catch (e2) {}
      return Promise.resolve(null);
    }
  }

  /* ---- the retry drain ---------------------------------------- */
  /* Processes the queue oldest-first. Each entry has its own
     cooldown so a dead network is retried with growing patience
     instead of a tight loop; a forced drain (reconnect, page load)
     ignores the cooldown. A permanent rejection drops the entry
     (status already "failed"); anything else stays queued. */
  var draining = false;
  var drainTimer = null;
  function drainOne(entry, force) {
    if (!entry || !entry.attemptId || !entry.kind) return Promise.resolve(true);
    var wait = Math.min(CFG.cooldownMs * Math.pow(2, Math.min(entry.tries || 0, 5)), CFG.cooldownCapMs);
    if (!force && entry.lastTry && (now() - entry.lastTry) < wait) return Promise.resolve(true);
    var name = entry.kind === "terminated" ? CFG.rpcTerminated : CFG.rpcSubmit;
    var args = entry.args || lastArgs[entry.attemptId];
    if (!args) { queueDrop(entry.attemptId); return Promise.resolve(true); }   // nothing replayable
    return rpc(name, args).then(function (res) {
      if (res.ok) {
        queueDrop(entry.attemptId);
        if (entry.kind === "terminated") handleTerminatedResponse(entry.attemptId, res);
        else handleSubmitResponse(entry.attemptId, res);
        return true;
      }
      if (res.permanent) {
        queueDrop(entry.attemptId);
        setStatus(entry.attemptId, "failed", { detail: res.message });
        return true;
      }
      entry.tries = (entry.tries || 0) + 1;
      entry.lastTry = now();
      entry.detail = res.message;
      queuePut(entry);
      return false;
    });
  }
  function drainQueue(force) {
    if (draining) return Promise.resolve(false);
    if (!CFG.enabled || !configured()) return Promise.resolve(false);
    draining = true;
    var q = queueLoad();
    var i = 0;
    function step() {
      if (i >= q.length) {
        draining = false;
        if (queueLoad().length > 0) scheduleDrain();
        return null;
      }
      var entry = q[i++];
      return drainOne(entry, !!force).then(step);
    }
    return step();
  }
  /* Backoff scheduler: 15s → 30s → 60s → … → 10 min, only while the
     queue is non-empty. All timer use is guarded so the module runs
     in bare-bone environments too. */
  var scheduleDelay = 15000;
  function scheduleDrain() {
    if (typeof root.setTimeout !== "function") return;
    if (drainTimer !== null) return;
    if (queueLoad().length === 0) return;
    drainTimer = root.setTimeout(function () {
      drainTimer = null;
      drainQueue(false).then(function () {
        if (queueLoad().length > 0) {
          scheduleDelay = Math.min(scheduleDelay * 2, 600000);
          scheduleDrain();
        } else {
          scheduleDelay = 15000;
        }
      });
    }, scheduleDelay);
  }

  /* ---- public surface ----------------------------------------- */
  function configured() {
    return !!(CFG.enabled && CFG.url && CFG.publishableKey && fetchImpl());
  }
  var API = {
    configured: configured,
    syncSubmitted: syncSubmitted,
    syncTerminated: syncTerminated,
    drainQueue: drainQueue,
    pendingCount: pendingCount,
    statusFor: statusFor,
    /* onChange(fn) subscribes to status changes for the honest UI
       lines; it returns an unsubscribe function. */
    onChange: function (fn) {
      if (typeof fn !== "function") return function () {};
      listeners.push(fn);
      return function () {
        var idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },
    /* test/diagnostics hooks — no secrets, no data export */
    _config: CFG,
    _internals: { rpc: rpc, mapSubmitted: mapSubmitted, mapTerminated: mapTerminated, queueLoad: queueLoad }
  };
  root.ExamRecords = API;

  /* ---- boot: resume queued uploads ---------------------------- */
  try {
    if (typeof root.setTimeout === "function") {
      root.setTimeout(function () { drainQueue(false); }, 3000);   // don't fight the first paint
    }
    if (typeof root.addEventListener === "function") {
      root.addEventListener("online", function () { drainQueue(true); });
    }
    if (typeof root.document !== "undefined" && root.document && typeof root.document.addEventListener === "function") {
      root.document.addEventListener("visibilitychange", function () {
        if (root.document.visibilityState === "visible") drainQueue(false);
      });
    }
  } catch (e) { /* boot best-effort; the store remains authoritative */ }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
