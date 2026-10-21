/* ============================================================
   EXAM SESSION INTEGRITY — Accountancy by Abhinash (v82)

   One place that owns the on-device half of an Exam Mode
   attempt: persisting it, restoring it after a refresh or a
   crash, and tracking interruptions for transparency.

   Design rules this file exists to enforce:

     * The CLOCK is the fairness mechanism. An attempt carries
       its server-issued deadline; every remaining-seconds value
       is computed FROM that deadline, so refreshing the page,
       closing the tab, losing connectivity or reopening later
       can never add a second to the paper.

     * Progress is written SYNCHRONOUSLY on every change, before
       anything else runs, so a refresh, a crash or a lost
       connection can never lose a saved answer. An active
       attempt found on the next load is RESTORED — not killed —
       exactly as the examination rules promise students.

     * An attempt past its deadline is not discarded either: it
       is flagged "expired" so the app can submit the answers
       that were honestly saved before the deadline.

     * INTERRUPTIONS (window blur, a reloaded page, a clock
       nudge) are COUNTED and shown, not punished.

     * A CONFIRMED violation — switching tab/app mid-paper or
       firing a screen-capture shortcut — DISQUALIFIES the
       attempt through disqualify(): the status flips once, one
       violation entry is written, and the record can never be
       restored, resubmitted or certified afterwards. The app
       layer funnels every detector into that single method, so
       one incident (which may fire several browser events)
       produces exactly one disqualification.
       The clock keeps running while the student is away — that
       is the real, honest consequence, and it is the same one
       a physical examination hall imposes.

     * What this module does NOT do: it never stores the answer
       key (it never sees it — the server holds the key and
       grades), it never claims to stop a second device, and it
       never resets a deadline. Only the server can issue a
       result or a certificate for an attempt.

   Works in a browser (window.ExamSecurity) and in Node
   (module.exports) so every behaviour below is covered by real,
   executed tests in tests/exam-security-tests.js.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ExamSecurity = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var STORAGE_KEY = "abhinash_exam_attempt_v1";

  /* Machine-readable interruption reasons. The UI maps these to the
     sentence the student actually sees. */
  var REASONS = {
    "tab-or-app-hidden": "You switched tab or application while the examination page was hidden.",
    "window-focus-lost": "The examination window lost focus — you switched away from the examination.",
    "navigated": "You navigated to another part of the website during the examination.",
    "page-reloaded": "The examination page was reloaded — the attempt was restored with its original deadline.",
    "resumed-after-closed": "The examination page was closed and reopened later — the original deadline still applies.",
    "clock-adjusted": "Your device clock was adjusted while the examination was running. The original deadline was kept — moving the clock cannot add time.",
    "tab-or-app-switched": "You switched to another tab, window or application while the examination was running.",
    "screenshot-attempt": "A screen-capture or screenshot shortcut was pressed while the examination was running.",
    "navigation-attempt": "You tried to leave the examination page while the paper was running.",
    "viewport-changed": "The examination window was resized to less than half its area while the paper was running (a split-screen or heavily resized window).",
    "paste-attempt": "Pasting content into the examination was attempted while the paper was running.",
    /* v89 — proctored Exam Mode violation reasons (exam-monitor.js).
       Each one is recorded by the central violation engine after the
       documented warning policy has been applied. */
    "fullscreen-exit": "Fullscreen mode was exited while the examination was running. Exam Mode requires fullscreen for the whole paper.",
    "camera-blank": "The camera picture stayed blank or covered after a warning to restore it.",
    "face-missing": "You were not visible in the camera frame after a warning.",
    "face-multiple": "More than one person was detected in the camera frame during the examination.",
    "face-proximity": "You moved too far from the position you were checked in at during the examination and did not return after a warning.",
    "phone-detected": "A mobile-phone-like object was confirmed in the camera view during the examination.",
    "voice-detected": "Speech was detected during the examination after a warning.",
    "sound-detected": "A significant prohibited sound continued after a warning.",
    "camera-lost": "The camera stopped working and monitoring could not be restored in time.",
    "microphone-lost": "The microphone stopped working and monitoring could not be restored in time.",
    "monitoring-failure": "Exam monitoring could not be restored after a technical interruption."
  };

  function reasonText(reason) {
    return REASONS[reason] || "The examination was interrupted.";
  }

  /* ----------------------------------------------------------
     createExamSession(options)
       storage        — injected so tests can drive a fake
       now()          — clock (ms); skew-corrected once the
                        server's time is known
       onChange(record) — fired after every synchronous write
     ---------------------------------------------------------- */
  function createExamSession(options) {
    var o = options || {};
    var storage = o.storage !== undefined ? o.storage : (typeof localStorage !== "undefined" ? localStorage : null);
    var storageKey = o.storageKey || STORAGE_KEY;
    var nowFn = typeof o.now === "function" ? o.now : function () { return Date.now(); };
    /* The monotonic companion is only armed in a REAL browser (no clock
       injection). Tests that fake `now` get no monotonic clamp unless
       they pass `monotonicNow` too, so fake-time suites stay deterministic. */
    var monoFn = null;
    if (typeof o.monotonicNow === "function") monoFn = o.monotonicNow;
    else if (typeof o.now !== "function" && typeof performance !== "undefined" && performance && typeof performance.now === "function") {
      monoFn = function () { return performance.now(); };
    }
    var clockOffsetMs = 0;          // serverNow - clientNow, set once

    /* CLOCK INTEGRITY — a second, monotonic reading anchors every
       countdown. The wall clock (Date.now) can be dragged backwards
       in system settings; performance.now() cannot. Live reads take
       the SHORTER of the two remaining times, so a moved clock can
       only ever shorten an attempt, never extend it, and the attempt
       records the adjustment as an interruption the student sees. */
    var segDate0 = null, segMono0 = null, segAnomalyLogged = false;
    function segmentAnchor() {
      if (segDate0 === null) {
        segDate0 = now();              // same clock domain as the stored deadline
        segMono0 = monoFn ? monoFn() : null;
      }
    }
    function noteClockDrift() {
      if (!monoFn || segAnomalyLogged) return;
      var wallMs = now() - segDate0;
      var monoMs = monoFn() - segMono0;
      if (Math.abs(wallMs - monoMs) > 3000) {
        segAnomalyLogged = true;
        var r = read();
        if (r && r.status === "active") {
          r.clockAnomalies = (r.clockAnomalies || 0) + 1;
          r.interruptionCount = (r.interruptionCount || 0) + 1;
          r.interruptions = (r.interruptions || []).concat([{ reason: "clock-adjusted", at: now() }]).slice(-20);
          write(r);   // one write: the counter AND the visible entry land together
        }
      }
    }

    /* ---------- storage ---------- */
    function write(record) {
      if (!storage) return false;
      try {
        record.updatedAt = now();
        storage.setItem(storageKey, JSON.stringify(record));
        if (typeof o.onChange === "function") { try { o.onChange(record); } catch (e) { /* UI errors never break the write */ } }
        return true;
      } catch (e) { return false; }
    }
    function read() {
      if (!storage) return null;
      try {
        var raw = storage.getItem(storageKey);
        var rec = raw ? JSON.parse(raw) : null;
        return (rec && typeof rec === "object" && rec.id) ? rec : null;
      } catch (e) { return null; }
    }
    function clearRecord() {
      if (!storage) return;
      try { storage.removeItem(storageKey); } catch (e) {}
    }

    function now() { return nowFn() + clockOffsetMs; }

    /* The server is the time authority: one skew measurement at
       start/resume, then every countdown derives from the stored
       deadline. Manipulating the visible timer or the device
       clock cannot move the deadline the server recorded. */
    function setServerClock(serverNowMs) {
      if (typeof serverNowMs === "number" && isFinite(serverNowMs)) {
        clockOffsetMs = serverNowMs - nowFn();
      }
      return clockOffsetMs;
    }
    function getClockOffset() { return clockOffsetMs; }

    /* ---------- deadline maths ---------- */
    /* With no explicit record (or null), the STORED attempt is used,
       so secondsLeft() / isExpired() always answer about the attempt
       that is actually on disk. Every value derives from the stored
       deadline — never from a decremented counter. */
    function resolveRecord(record) {
      return (record === undefined || record === null) ? read() : record;
    }
    function secondsLeft(record, atMs) {
      var rec = resolveRecord(record);
      if (!rec || typeof rec.deadlineAt !== "number") return 0;
      var live = (typeof atMs !== "number");
      var t = (live ? now() : atMs);
      var wall = Math.round((rec.deadlineAt - t) / 1000);
      if (live && monoFn) {
        // CLOCK INTEGRITY: the wall clock can be dragged backwards in
        // system settings; performance.now() cannot. Live reads take
        // the SHORTER of the two, so a moved clock can only ever
        // SHORTEN an attempt — and the adjustment is recorded as an
        // interruption the student can see.
        segmentAnchor();
        noteClockDrift();
        var mono = Math.round((rec.deadlineAt - segDate0 - (monoFn() - segMono0)) / 1000);
        if (mono < wall) wall = mono;
      }
      return Math.max(0, wall);
    }
    function isExpired(record, atMs) { var rec = resolveRecord(record); return !!rec && secondsLeft(rec, atMs) <= 0; }

    /* ---------- lifecycle ---------- */
    function begin(info) {
      info = info || {};
      var existing = read();
      // Never two live attempts on one device: if an unexpired
      // attempt already exists, it is returned instead of replaced.
      if (existing && existing.status === "active" && !isExpired(existing)) return existing;
      var t = now();
      var record = {
        id: info.id || ("ATT-" + t.toString(36).toUpperCase()),
        paperId: info.paperId || null,
        title: info.title || null,
        candidateName: info.candidateName || null,
        schoolName: info.schoolName || null,
        durationMinutes: typeof info.durationMinutes === "number" ? info.durationMinutes : null,
        startedAt: typeof info.startedAt === "number" ? info.startedAt : t,
        deadlineAt: typeof info.deadlineAt === "number" ? info.deadlineAt : t,
        status: "active",              // active → submitted | void
        answers: Array.isArray(info.questions) ? new Array(info.questions.length).fill(null) : [],
        marked: Array.isArray(info.questions) ? new Array(info.questions.length).fill(false) : [],
        visited: Array.isArray(info.questions) ? new Array(info.questions.length).fill(false) : [],
        index: 0,
        questions: Array.isArray(info.questions) ? info.questions : [],
        /* kept so a reload reproduces the exact same paper layout
           (option order is derived from this seed) */
        optionSeed: (info.optionSeed === undefined ? null : info.optionSeed),
        blueprint: info.blueprint || null,
        interruptions: [],
        interruptionCount: 0,
        violations: [],
        clockAnomalies: 0,
        submittedAt: null,
        createdAt: t
      };
      if (Array.isArray(info.questions) && info.questions.length) visitedSet(record, 0);
      write(record);
      return record;
    }

    function visitedSet(record, i) {
      if (i >= 0 && i < record.visited.length) record.visited[i] = true;
    }

    /* Every answer change, palette jump or mark toggle lands here
       first — synchronously — before any UI work continues. */
    function saveProgress(progress) {
      var record = read();
      if (!record || record.status !== "active") return null;
      if (progress) {
        if (Array.isArray(progress.answers) && progress.answers.length === record.answers.length) record.answers = progress.answers.slice();
        if (Array.isArray(progress.marked) && progress.marked.length === record.marked.length) record.marked = progress.marked.slice();
        if (typeof progress.index === "number" && progress.index >= 0 && progress.index < record.answers.length) {
          record.index = progress.index;
          visitedSet(record, progress.index);
        }
      }
      write(record);
      return record;
    }

    /* Interruption tracking: counted and persisted, never
       disqualifying. Returns the running total so the UI can show
       "3rd interruption" style feedback if it wants to. */
    function noteInterruption(reason) {
      var record = read();
      if (!record || record.status !== "active") return null;
      record.interruptionCount = (record.interruptionCount || 0) + 1;
      record.interruptions = (record.interruptions || []).concat([{ reason: reason, at: now() }]).slice(-20);
      write(record);
      return record.interruptionCount;
    }

    /* ---------- disqualification (the anti-cheating path) ----------
       The only way an active attempt becomes disqualified. Idempotent:
       the FIRST call flips the status and writes one violation entry;
       every later call for the same attempt is a no-op, so a burst of
       browser events for one incident (hidden + blur + pagehide) can
       never double-record it. A submitted attempt is never rewritten —
       a legitimate submission cannot become a violation after the
       fact. Returns the stored record, or null when there was nothing
       active to disqualify. */
    function disqualify(reason, detail) {
      var record = read();
      if (!record || record.status !== "active") return null;
      record.status = "disqualified";          // active → disqualified (terminal)
      record.disqualifiedAt = now();
      record.violation = {
        reason: reason || "unknown",
        detail: detail || null,
        text: reasonText(reason),
        at: now()
      };
      record.violations = (record.violations || []).concat([record.violation]).slice(-20);
      record.interruptionCount = (record.interruptionCount || 0) + 1;
      write(record);
      return record;
    }

    /* Load-time recovery. Returns the stored record plus a state
       the app can act on:
         null        — nothing stored
         "active"    — deadline still in the future: restore it
         "expired"   — deadline passed: submit the saved answers
         "submitted" — already finished on this device
         "void"      — unusable record (the app starts fresh)   */
    function recover() {
      var record = read();
      if (!record) return { state: null, record: null };
      if (record.status === "submitted") return { state: "submitted", record: record };
      if (record.status === "disqualified") return { state: "disqualified", record: record };
      if (record.status !== "active") return { state: "void", record: record };
      if (isExpired(record)) {
        // Not a deletion: the saved answers are exactly what must be
        // submitted for honest evaluation.
        return { state: "expired", record: record };
      }
      if (record.startedAt < now() - 60000) {
        record.reopened = true;   // closed and reopened at least a minute later
      }
      return { state: "active", record: record };
    }

    function markSubmitted(summary) {
      var record = read();
      /* Only a LIVE attempt can become submitted: a disqualified
         (or already submitted) record is terminal — a submission
         can never be written after the fact. */
      if (!record || record.status !== "active") return null;
      record.status = "submitted";
      record.submittedAt = now();
      if (summary) record.summary = summary;
      write(record);
      return record;
    }

    function void_() {
      var record = read();
      if (!record) return null;
      record.status = "void";
      record.voidedAt = now();
      write(record);
      return record;
    }

    /* Forget the stored attempt entirely — only for a submitted,
       void or DISQUALIFIED attempt the student has finished with
       (a DQ record may be cleared to set up a new attempt; the
       attempt itself stays consumed in the attempt store). */
    function clear() {
      var record = read();
      if (record && record.status === "active") return false;   // never drop a live attempt
      clearRecord();
      return true;
    }

    function getState() {
      var record = read();
      return {
        record: record,
        secondsLeft: secondsLeft(record),
        expired: isExpired(record),
        clockOffsetMs: clockOffsetMs
      };
    }

    return {
      STORAGE_KEY: storageKey,
      begin: begin,
      read: read,
      saveProgress: saveProgress,
      noteInterruption: noteInterruption,
      recover: recover,
      markSubmitted: markSubmitted,
      disqualify: disqualify,
      void: void_,
      clear: clear,
      secondsLeft: secondsLeft,
      isExpired: isExpired,
      setServerClock: setServerClock,
      getClockOffset: getClockOffset,
      now: now,
      reasonText: reasonText
    };
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    REASONS: REASONS,
    reasonText: reasonText,
    createExamSession: createExamSession
  };
});
