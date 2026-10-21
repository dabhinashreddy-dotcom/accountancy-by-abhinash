/* ------------------------------------------------------------------
   Push scheduling engine — PURE logic, no dependencies.
   Used by netlify/functions/push-scheduler.js (server) and directly
   by tests/push-notification-tests.js (plain Node, no npm packages).

   Design rules (from the product spec):
   - Never invent data: a category with no real snapshot data is skipped.
   - At most ONE notification per scheduler run per device (no piles of
     reminders arriving at once), chosen by priority.
   - Routine daily categories share a per-day budget (maxDaily).
   - Weekly summary: at most one per ISO week. Exam-prep: one per week.
   - Quiet hours, permitted days, weekend switch and pause are always
     respected. Idempotency keys make a double scheduler run harmless.
   - Timestamps are evaluated in the student's own IANA time zone.
   ------------------------------------------------------------------ */

/* Category ids. "focus" and "achievements" are page-context only (the
   site must be open) — they are handled client-side and are NEVER
   returned by decide(); they exist here so the settings list is
   defined in one place. */
const CATEGORIES = [
  "daily-study", "streak", "mistake-book", "unfinished-practice",
  "revision", "exam-prep", "weekly-summary", "site-updates",
  "focus", "achievements"
];

/* Sent by the server scheduler (in priority order, highest first). */
const SERVER_CATEGORIES = [
  "streak", "daily-study", "unfinished-practice", "mistake-book",
  "revision", "exam-prep", "weekly-summary", "site-updates"
];

const DEFAULT_PREFS = {
  master: false,
  categories: {
    "daily-study": true, "streak": true, "mistake-book": true,
    "unfinished-practice": true, "revision": true, "exam-prep": true,
    "weekly-summary": true, "site-updates": true,
    "focus": true, "achievements": true
  },
  time: "18:00",                 // preferred reminder time, student local
  days: [1, 2, 3, 4, 5, 6, 0],   // 0 = Sunday
  weekends: true,                // false → Sat/Sun suppressed entirely
  quiet: { start: "22:00", end: "07:00" },
  tz: "",                        // IANA name; "" → device decides client-side
  maxDaily: 2,                   // routine-per-day budget
  pausedUntil: null              // epoch ms, or null
};

/* Safe destinations only — mirrors the app's hash routes. The service
   worker re-validates the same list; anything else opens #home. */
const SAFE_ROUTES = [
  "home", "about", "chapters-list", "practice-hub", "mistake-book",
  "accounting-cycle", "more", "bookmarks", "quiz", "flashcards",
  "formula-sheet", "important-questions", "exam-mode", "performance",
  "settings", "ai-tutor", "certificate-view",
  "ch-intro", "ch-terms", "ch-tbase", "ch-basis", "ch-eq", "ch-dc",
  "ch-jr", "ch-lg", "ch-cb", "ch-sp2", "ch-brs", "ch-gst", "ch-tb",
  "ch-dep", "ch-pres", "ch-roe", "ch-fs", "ch-adj"
];

/* Class 12 chapter routes are dynamic (ch-<registry id>) — accept the
   known C12 ids too so a Class 12 student's reminder opens the right
   page. Mirrors data-12.js registry ids. */
const C12_CHAPTER_IDS = [
  "pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin",
  "fsa", "rat", "cf", "ca"
];
C12_CHAPTER_IDS.forEach(id => SAFE_ROUTES.push("ch-" + id));

function safeUrl(route) {
  const r = String(route || "").replace(/^#/, "").split("?")[0];
  return SAFE_ROUTES.indexOf(r) === -1 ? "#home" : "#" + r;
}

/* ---------------- time helpers (IANA-aware, dependency-free) -------- */

function isValidTz(tz) {
  if (!tz || typeof tz !== "string") return false;
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }); return true; }
  catch (e) { return false; }
}

function toMinutes(hhmm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm || ""));
  if (!m) return null;
  const h = +m[1], min = +m[2];
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/* Local wall-clock parts of an instant in a time zone. */
function localParts(now, tz) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz || "UTC", hour12: false,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", weekday: "short"
  });
  const p = {};
  fmt.formatToParts(now).forEach(x => { p[x.type] = x.value; });
  /* en-US 24h can yield hour "24" at midnight in some engines. */
  const hour = (+p.hour) % 24;
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: +p.year, month: +p.month, day: +p.day,
    hour: hour, minute: +p.minute,
    dow: dayMap[p.weekday] !== undefined ? dayMap[p.weekday] : now.getUTCDay(),
    dateKey: p.year + "-" + p.month + "-" + p.day,
    minutes: hour * 60 + (+p.minute)
  };
}

/* ISO week key "YYYY-Www" (weekly summary / exam-prep idempotency). */
function isoWeekKey(now, tz) {
  const parts = localParts(now, tz);
  const d = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  /* Thursday of the current ISO week determines the year. */
  const dayNum = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const fDayNum = (firstThu.getUTCDay() + 6) % 7;
  firstThu.setUTCDate(firstThu.getUTCDate() - fDayNum + 3);
  const week = 1 + Math.round((d - firstThu) / (7 * 86400000));
  return d.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
}

/* Quiet-hours test on local minutes; the window may wrap midnight. */
function inQuietHours(minutes, quiet) {
  const s = toMinutes(quiet && quiet.start), e = toMinutes(quiet && quiet.end);
  if (s === null || e === null || s === e) return false;
  return s < e ? (minutes >= s && minutes < e) : (minutes >= s || minutes < e);
}

/* Day-of-week permission: weekends=false blocks Sat(6)/Sun(0) even if
   the day list includes them; otherwise the day list decides. */
function dayAllowed(dow, prefs) {
  if (!prefs.weekends && (dow === 0 || dow === 6)) return false;
  return Array.isArray(prefs.days) && prefs.days.indexOf(dow) !== -1;
}

/* ---------------- preferences / snapshot sanitising ----------------- */

function sanitizePrefs(raw, deviceTz) {
  const p = JSON.parse(JSON.stringify(DEFAULT_PREFS));
  if (!raw || typeof raw !== "object") {
    p.tz = isValidTz(deviceTz) ? deviceTz : "UTC";
    return p;
  }
  p.master = raw.master === true;
  if (raw.categories && typeof raw.categories === "object") {
    CATEGORIES.forEach(c => { if (typeof raw.categories[c] === "boolean") p.categories[c] = raw.categories[c]; });
  }
  const t = toMinutes(raw.time);
  if (t !== null) {
    p.time = String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
  }
  if (Array.isArray(raw.days)) {
    const days = raw.days.filter(d => Number.isInteger(d) && d >= 0 && d <= 6);
    /* v89 — an EXPLICIT empty list means "no days selected", never
       "all days". dayAllowed() then never passes, so routine
       reminders simply do not fire (site-updates, an operational
       category, still may). The subscribe/sync endpoints reject an
       empty list with 400 "no-days-selected" so the UI can tell the
       student; this function keeps the value honest for direct use. */
    p.days = days;
  }
  if (typeof raw.weekends === "boolean") p.weekends = raw.weekends;
  if (raw.quiet && typeof raw.quiet === "object") {
    const qs = toMinutes(raw.quiet.start), qe = toMinutes(raw.quiet.end);
    if (qs !== null) p.quiet.start = String(Math.floor(qs / 60)).padStart(2, "0") + ":" + String(qs % 60).padStart(2, "0");
    if (qe !== null) p.quiet.end = String(Math.floor(qe / 60)).padStart(2, "0") + ":" + String(qe % 60).padStart(2, "0");
  }
  p.tz = isValidTz(raw.tz) ? raw.tz : (isValidTz(deviceTz) ? deviceTz : "UTC");
  const md = Number(raw.maxDaily);
  if (Number.isFinite(md)) p.maxDaily = Math.max(1, Math.min(4, Math.round(md)));
  if (Number.isFinite(raw.pausedUntil) && raw.pausedUntil > 0) p.pausedUntil = raw.pausedUntil;
  return p;
}

function sanitizeSnapshot(raw) {
  const s = {
    streak: 0, activeToday: false, mistakeCount: 0,
    unfinished: null, lastStudiedAt: 0, week: null, appVersion: ""
  };
  if (!raw || typeof raw !== "object") return s;
  if (Number.isFinite(raw.streak) && raw.streak > 0) s.streak = Math.min(3650, Math.round(raw.streak));
  s.activeToday = raw.activeToday === true;
  if (Number.isFinite(raw.mistakeCount) && raw.mistakeCount > 0) s.mistakeCount = Math.min(9999, Math.round(raw.mistakeCount));
  if (raw.unfinished && typeof raw.unfinished === "object" && raw.unfinished.route) {
    s.unfinished = {
      route: safeUrl(raw.unfinished.route),
      label: String(raw.unfinished.label || "").slice(0, 60),
      at: Number.isFinite(raw.unfinished.at) ? raw.unfinished.at : 0
    };
  }
  if (Number.isFinite(raw.lastStudiedAt) && raw.lastStudiedAt > 0) s.lastStudiedAt = raw.lastStudiedAt;
  if (raw.week && typeof raw.week === "object") {
    s.week = {
      questions: Number.isFinite(raw.week.questions) ? Math.max(0, Math.round(raw.week.questions)) : 0,
      xp: Number.isFinite(raw.week.xp) ? Math.max(0, Math.round(raw.week.xp)) : 0,
      chaptersStudied: Number.isFinite(raw.week.chaptersStudied) ? Math.max(0, Math.round(raw.week.chaptersStudied)) : 0,
      mistakesReviewed: Number.isFinite(raw.week.mistakesReviewed) ? Math.max(0, Math.round(raw.week.mistakesReviewed)) : 0
    };
  }
  if (typeof raw.appVersion === "string") s.appVersion = raw.appVersion.slice(0, 24);
  return s;
}

/* ---------------- notification copy (privacy-safe) ------------------- */

function messageFor(category, snap) {
  switch (category) {
    case "streak":
      return {
        title: "Keep Your Learning Routine Going",
        body: "Complete a little revision or practice today to keep your study routine alive.",
        route: "home"
      };
    case "daily-study":
      return {
        title: "Time for a Little Accountancy Practice \u{1F4DA}",
        body: "Spend a few minutes revising a chapter or solving a question today.",
        route: "home"
      };
    case "unfinished-practice": {
      const label = snap && snap.unfinished && snap.unfinished.label ? snap.unfinished.label : "";
      return {
        title: "Continue Your Accountancy Practice",
        body: label ? "Your " + label + " activity is still waiting for you." : "You have a learning activity waiting for you.",
        route: snap && snap.unfinished ? snap.unfinished.route : "practice-hub"
      };
    }
    case "mistake-book":
      return {
        title: "A Few Questions Need Another Look",
        body: "You have questions waiting for review in your Mistake Book.",
        route: "mistake-book"
      };
    case "revision":
      return {
        title: "Time to Revise a Chapter",
        body: "Revisit a topic you have studied and strengthen your understanding.",
        route: "chapters-list"
      };
    case "exam-prep":
      return {
        title: "Ready for an Accountancy Practice Test?",
        body: "Take a practice test when you have time to review your understanding.",
        route: "exam-mode"
      };
    case "weekly-summary":
      return {
        title: "Your Weekly Learning Summary",
        body: "Review your practice activity, questions completed and topics you may want to revisit.",
        route: "performance"
      };
    default:
      return null;
  }
}

function actionsFor(category) {
  switch (category) {
    case "mistake-book":
      return [{ action: "open", title: "Open Mistake Book", url: "#mistake-book" }];
    case "unfinished-practice":
      return [{ action: "open", title: "Continue Studying", url: "#practice-hub" }];
    case "weekly-summary":
      return [{ action: "open", title: "View Progress", url: "#performance" }];
    default:
      return [{ action: "open", title: "Open", url: "#home" }];
  }
}

/* ------------------------- the decision core ------------------------ */

/* Decide whether a notification is due for one device.
   Inputs:  now      – Date (the scheduler's clock)
            prefs    – sanitised preferences
            snap     – sanitised progress snapshot (may be all-defaults)
            sent     – { sent: { "cat:YYYY-MM-DD": epochMs, ... } }
            broadcast – optional { version, title, body, url } or null
   Output:  { send: null } or { send: { category, title, body, route,
            tag, actions, idempotencyKey } } plus debug reasons. */
function decide(now, prefs, snap, sent, broadcast) {
  const sentMap = (sent && sent.sent && typeof sent.sent === "object") ? sent.sent : {};
  const result = { send: null, reasons: [] };
  const skip = (why) => { result.reasons.push(why); return result; };

  if (!prefs.master) return skip("master-off");
  if (prefs.pausedUntil && now.getTime() < prefs.pausedUntil) return skip("paused");

  const tz = isValidTz(prefs.tz) ? prefs.tz : "UTC";
  const loc = localParts(now, tz);
  const quiet = inQuietHours(loc.minutes, prefs.quiet);
  const dayOk = dayAllowed(loc.dow, prefs);
  const startMin = toMinutes(prefs.time);
  const inWindow = startMin !== null && loc.minutes >= startMin;
  const dateKey = loc.dateKey;
  const dayKey = (cat) => cat + ":" + dateKey;
  const wasSent = (key) => Object.prototype.hasOwnProperty.call(sentMap, key);
  const todaySentCount = Object.keys(sentMap).filter(k => k.endsWith(":" + dateKey)).length;
  const budgetLeft = prefs.maxDaily - todaySentCount;

  /* -- weekly summary: its own slot, one per ISO week --------------- */
  /* v89 — consistent preference enforcement: the weekly digest now
     respects the student's day list and the per-day budget like every
     routine category. Its documented exception remains the fixed
     09:00–12:00 Monday slot (a digest has no other time). Quiet hours
     were already respected. */
  const weekKey = isoWeekKey(now, tz);
  if (prefs.categories["weekly-summary"]) {
    const key = "weekly-summary:" + weekKey;
    if (wasSent(key)) result.reasons.push("weekly-already-sent");
    else if (!snap.week) result.reasons.push("weekly-no-data");
    else if (loc.dow !== 1) result.reasons.push("weekly-not-monday");
    else if (!dayOk) result.reasons.push("weekly-day-not-allowed");
    else if (loc.minutes < 9 * 60 || loc.minutes >= 12 * 60) result.reasons.push("weekly-window");
    else if (quiet) result.reasons.push("weekly-quiet");
    else if (budgetLeft <= 0) result.reasons.push("weekly-budget-used");
    else if (snap.week.questions === 0 && snap.week.xp === 0) result.reasons.push("weekly-empty-period");
    else return finish("weekly-summary", key);
  }

  /* -- site updates: broadcast, one per version --------------------- */
  /* DOCUMENTED OPERATIONAL EXCEPTION (v89): a site update is rare,
     one-per-version operational information, not a routine reminder —
     it deliberately ignores the preferred time of day and the daily
     budget. It still respects the master switch, pause, quiet hours,
     the category toggle and the student's day list, so it can never
     become a stream of messages against the student's wishes. */
  if (prefs.categories["site-updates"] && broadcast && broadcast.version) {
    const key = "site-updates:" + String(broadcast.version).slice(0, 24);
    if (wasSent(key)) result.reasons.push("updates-already-sent");
    else if (quiet) result.reasons.push("updates-quiet");
    else if (!dayOk) result.reasons.push("updates-day");
    else {
      return {
        send: {
          category: "site-updates", idempotencyKey: key,
          title: String(broadcast.title || "A New Update Is Ready").slice(0, 120),
          body: String(broadcast.body || "Accountancy By Abhinash has been updated — take a quick look.").slice(0, 200),
          route: safeUrl(broadcast.url || "home"),
          tag: "site-updates",
          actions: [{ action: "open", title: "See What's New", url: safeUrl(broadcast.url || "home") }],
          timestamp: now.getTime()
        },
        reasons: result.reasons
      };
    }
  }

  /* -- routine categories: one per run, by priority, budget-checked -- */
  if (quiet) return skip("quiet-hours");
  if (!dayOk) return skip("day-not-allowed");
  if (!inWindow) return skip("before-preferred-time");
  if (budgetLeft <= 0) return skip("daily-budget-used");

  const order = ["streak", "daily-study", "unfinished-practice", "mistake-book", "revision", "exam-prep"];
  for (const cat of order) {
    if (!prefs.categories[cat]) { result.reasons.push(cat + ":off"); continue; }
    if (wasSent(dayKey(cat))) { result.reasons.push(cat + ":already-today"); continue; }

    if (cat === "streak") {
      if (snap.streak <= 0) { result.reasons.push("streak:none"); continue; }
      if (snap.activeToday) { result.reasons.push("streak:goal-done"); continue; }
      if (loc.minutes >= 22 * 60) { result.reasons.push("streak:too-late"); continue; }
      return finish(cat, dayKey(cat));
    }
    if (cat === "daily-study") {
      if (snap.activeToday) { result.reasons.push("daily:goal-done"); continue; }
      return finish(cat, dayKey(cat));
    }
    if (cat === "unfinished-practice") {
      const u = snap.unfinished;
      if (!u) { result.reasons.push("unfinished:none"); continue; }
      if (u.at && now.getTime() - u.at < 2 * 3600 * 1000) { result.reasons.push("unfinished:too-recent"); continue; }
      const last = sentMap["unfinished-practice:lastAt"];
      if (last && now.getTime() - last < 48 * 3600 * 1000) { result.reasons.push("unfinished:cooldown"); continue; }
      return finish(cat, dayKey(cat), "unfinished-practice:lastAt", now.getTime());
    }
    if (cat === "mistake-book") {
      if (snap.mistakeCount <= 0) { result.reasons.push("mistakes:none"); continue; }
      const last = sentMap["mistake-book:lastAt"];
      if (last && now.getTime() - last < 72 * 3600 * 1000) { result.reasons.push("mistakes:cooldown"); continue; }
      return finish(cat, dayKey(cat), "mistake-book:lastAt", now.getTime());
    }
    if (cat === "revision") {
      if (!snap.lastStudiedAt) { result.reasons.push("revision:never-studied"); continue; }
      const age = now.getTime() - snap.lastStudiedAt;
      if (age < 3 * 86400000) { result.reasons.push("revision:recent"); continue; }
      const last = sentMap["revision:lastAt"];
      if (last && now.getTime() - last < 72 * 3600 * 1000) { result.reasons.push("revision:cooldown"); continue; }
      return finish(cat, dayKey(cat), "revision:lastAt", now.getTime());
    }
    if (cat === "exam-prep") {
      const key = "exam-prep:" + weekKey;
      if (wasSent(key)) { result.reasons.push("exam:already-week"); continue; }
      if (loc.dow !== 0 && loc.dow !== 6 && loc.dow !== 5) { result.reasons.push("exam:not-weekend"); continue; }
      return finish(cat, key);
    }
  }
  return skip("nothing-due");

  function finish(category, idempotencyKey, extraKey, extraVal) {
    const msg = messageFor(category, snap);
    if (!msg) return skip(category + ":no-message");
    const send = {
      category: category,
      idempotencyKey: idempotencyKey,
      title: msg.title,
      body: msg.body,
      route: safeUrl(msg.route),
      tag: "aba-" + category,
      actions: actionsFor(category),
      timestamp: now.getTime()
    };
    if (extraKey) send.extraKeys = [{ key: extraKey, value: extraVal }];
    return { send: send, reasons: result.reasons };
  }
}

module.exports = {
  CATEGORIES: CATEGORIES,
  SERVER_CATEGORIES: SERVER_CATEGORIES,
  DEFAULT_PREFS: DEFAULT_PREFS,
  SAFE_ROUTES: SAFE_ROUTES,
  safeUrl: safeUrl,
  isValidTz: isValidTz,
  toMinutes: toMinutes,
  localParts: localParts,
  isoWeekKey: isoWeekKey,
  inQuietHours: inQuietHours,
  dayAllowed: dayAllowed,
  sanitizePrefs: sanitizePrefs,
  sanitizeSnapshot: sanitizeSnapshot,
  messageFor: messageFor,
  actionsFor: actionsFor,
  decide: decide
};
