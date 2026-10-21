/* ============================================================
   ui-features.js — Accountancy By Abhinash (v82)

   Pure, browser-independent helpers behind three website features:

   1. XP REGISTRY — the single anti-farming rule book. Every XP call
      site in app.js gates through these functions so a reward can be
      earned once ever (awardOnce), once per calendar day (awardDaily)
      or at most N times per day (bumpDaily). All functions mutate
      ONLY the xpOnce object handed to them and return a plain
      boolean, so they are fully testable in Node.

   2. RECENT ACTIVITY — normalize/dedupe logic for the clickable
      activity history (structured entries with stable keys, so the
      same activity never stacks up twice).

   3. SECTION NAVIGATION — planSectionNav() decides what the
      "Next Section / Next Chapter" footer should show for a chapter
      page, using the website's real syllabus order (never alphabetical).

   UMD: window.UIFeatures in the browser, module.exports for tests.
   No DOM, no storage, no network.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.UIFeatures = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DAY_MS = 86400000;

  /* ---- reward values, in one place so app.js call sites and the
     test suite can be checked against the same numbers ---- */
  const XP_POLICY = Object.freeze({
    practiceQuestion: 4,          // chapter practice question, once per question (established)
    practicePenalty: 1,           // first attempt only (established)
    quizQuestion: 2,              // quiz MCQ, once per question — ever
    quizCompletionPerPoint: 2,    // score × 2 for a completed quiz, once per quiz set per day
    flashDeckCap: 20,             // deck bonus = min(known cards, cap), once per deck per day
    tutorPerMessage: 1,           // typed tutor question
    tutorDailyMax: 5,             // …at most this many per calendar day
    generatorProblem: 3,          // equation random-generator problem
    generatorDailyMax: 10         // …at most this many per calendar day
  });

  /* ============================================================
     1. XP REGISTRY
     The xpOnce object lives at STATE.xpOnce and is persisted with the
     rest of the student's state. Every entry is { at, kind, ... } so
     stale per-day entries can be pruned while permanent ("once")
     claims are kept forever.
     ============================================================ */
  function dayKey(now) {
    return new Date(now == null ? Date.now() : now).toDateString();
  }

  /* Award at most once per key, ever. Returns true the first time. */
  function awardOnce(xpOnce, key, now) {
    if (!xpOnce || !key) return false;
    if (xpOnce[key]) return false;
    xpOnce[key] = { at: now == null ? Date.now() : now, kind: "once" };
    return true;
  }
  function isClaimed(xpOnce, key) {
    return !!(xpOnce && key && xpOnce[key]);
  }

  function dailySlotKey(key, day) { return "d:" + day + "|" + key; }
  /* Award at most once for this key on this calendar day. */
  function awardDaily(xpOnce, key, now) {
    if (!xpOnce || !key) return false;
    const day = dayKey(now);
    const slot = dailySlotKey(key, day);
    if (xpOnce[slot]) return false;
    xpOnce[slot] = { at: now == null ? Date.now() : now, day: day, kind: "daily" };
    return true;
  }
  function isDailyClaimed(xpOnce, key, now) {
    if (!xpOnce || !key) return false;
    return !!xpOnce[dailySlotKey(key, dayKey(now))];
  }

  /* Capped counter — up to `max` awards per calendar day. */
  function capSlotKey(key, day) { return "c:" + day + "|" + key; }
  function dailyCount(xpOnce, key, now) {
    if (!xpOnce || !key) return 0;
    const slot = xpOnce[capSlotKey(key, dayKey(now))];
    return (slot && typeof slot.count === "number" && slot.count) || 0;
  }
  function bumpDaily(xpOnce, key, max, now) {
    if (!xpOnce || !key) return false;
    const day = dayKey(now);
    const slot = capSlotKey(key, day);
    const cur = (xpOnce[slot] && typeof xpOnce[slot].count === "number") ? xpOnce[slot].count : 0;
    if (cur >= max) return false;
    xpOnce[slot] = { count: cur + 1, at: now == null ? Date.now() : now, day: day, kind: "cap" };
    return true;
  }
  function dailyLeft(xpOnce, key, max, now) {
    return Math.max(0, max - dailyCount(xpOnce, key, now));
  }

  /* Housekeeping: per-day entries older than keepDays (default 4) are
     dropped so STATE.xpOnce stays small; permanent "once" claims are
     never pruned. */
  function prune(xpOnce, now, keepDays) {
    if (!xpOnce || typeof xpOnce !== "object") return 0;
    const t = now == null ? Date.now() : now;
    const keepMs = (keepDays == null ? 4 : keepDays) * DAY_MS;
    let removed = 0;
    Object.keys(xpOnce).forEach(k => {
      const v = xpOnce[k];
      const isObj = v !== null && typeof v === "object";
      if (isObj && v.kind === "once") return;                          // permanent claim
      let stamp = null, kind = null, count = null;
      if (isObj) { kind = v.kind || null; count = (typeof v.count === "number") ? v.count : null; stamp = (typeof v.at === "number") ? v.at : null; }
      else if (typeof v === "number") stamp = v;                       // legacy shape: bare timestamp
      if (stamp == null && kind == null && count == null) { delete xpOnce[k]; removed++; return; }  // corrupt entry
      if (stamp != null && t - stamp > keepMs) { delete xpOnce[k]; removed++; }
    });
    return removed;
  }

  /* ============================================================
     2. RECENT ACTIVITY
     An entry: { id, at, type, text, route, tab, qid, qidNoun,
                 chapterId, difficulty, status, key }
     Old plain strings / {text, at} rows are accepted and normalized
     (they simply carry no route, so they render as plain text).
     ============================================================ */
  const ACTIVITY_LIMIT = 12;

  function makeActivityId(now, rnd) {
    const n = now == null ? Date.now() : now;
    const r = typeof rnd === "function" ? rnd() : Math.random();
    return "a" + n.toString(36) + "-" + Math.floor(r * 0xffffff).toString(36);
  }

  function str(v) { return typeof v === "string" && v.trim() ? v.trim() : null; }

  function normalizeActivity(raw, opts) {
    opts = opts || {};
    const now = opts.now == null ? Date.now() : opts.now;
    if (raw == null) return null;
    if (typeof raw === "string") raw = { text: raw };      // legacy call sites
    if (typeof raw !== "object") return null;
    const text = typeof raw.text === "string" ? raw.text.replace(/\s+/g, " ").trim() : "";
    if (!text) return null;                                // corrupt / empty → drop
    const entry = {
      id: str(raw.id) || makeActivityId(now, opts.rnd),
      at: (typeof raw.at === "number" && isFinite(raw.at) && raw.at > 0) ? raw.at : now,
      type: str(raw.type) || "general",
      text: text,
      route: str(raw.route),
      tab: str(raw.tab),
      qid: (raw.qid === undefined || raw.qid === null) ? null : raw.qid,
      qidNoun: str(raw.qidNoun) || "Q",
      chapterId: str(raw.chapterId),
      difficulty: str(raw.difficulty),
      status: str(raw.status),
      key: str(raw.key)
    };
    entry.key = entry.key || activityKey(entry);
    return entry;
  }

  /* Stable dedupe key: the same target activity recorded again just
     refreshes the existing row instead of stacking a duplicate. */
  function activityKey(e) {
    if (!e || typeof e !== "object") return null;
    if (typeof e.key === "string" && e.key) return e.key;
    if (e.route || (e.qid !== undefined && e.qid !== null)) {
      return "r|" + [e.type || "", e.route || "", e.tab || "",
        e.qid == null ? "" : String(e.qid)].join("|");
    }
    return "t|" + String(e.text || "").replace(/\s+/g, " ").trim().slice(0, 80);
  }

  /* Newest first, one row per key, capped at `limit`. Corrupt rows
     (nulls, objects without usable text) are dropped as they pass. */
  function pushActivity(list, entry, limit) {
    if (!entry) return Array.isArray(list) ? list.slice() : [];
    const key = entry.key || activityKey(entry);
    const rest = (Array.isArray(list) ? list : []).filter(e => {
      if (typeof e === "string") return e.trim() !== "";
      if (!e || typeof e !== "object") return false;
      if (typeof e.text !== "string" || !e.text.trim()) return false;
      const k = e.key || activityKey(e);
      return k !== key;
    });
    rest.unshift(entry);
    return rest.slice(0, limit || ACTIVITY_LIMIT);
  }

  /* ============================================================
     3. SECTION NAVIGATION
     Chapters and their tab order come from the website itself
     (APP_DATA.chapters + the chapter's tab bar), so the plan always
     follows the syllabus order and keeps Quick Revision last.
     ============================================================ */
  function planSectionNav(input) {
    input = input || {};
    const route = String(input.route || "");
    if (route.indexOf("ch-") !== 0) return null;
    const chapters = input.chapters || [];
    const chId = route.slice(3);
    const chIdx = chapters.indexOf(chId);
    if (chIdx === -1) return null;
    const tabs = input.tabTitles || [];
    const tabIndex = input.tabIndex;
    const hasTabInfo = typeof tabIndex === "number" && tabIndex >= 0;

    if (hasTabInfo && tabIndex < tabs.length - 1) {
      return {
        kind: "section",
        nextIndex: tabIndex + 1,
        nextTitle: tabs[tabIndex + 1],
        current: tabIndex + 1,
        total: tabs.length
      };
    }
    const nextId = chapters[chIdx + 1];
    if (nextId) {
      const titles = input.chapterTitles || {};
      return {
        kind: "chapter",
        nextRoute: "ch-" + nextId,
        nextChapterId: nextId,
        nextTitle: titles[nextId] || nextId
      };
    }
    // Final section of the final chapter — never an invalid route.
    return { kind: "final", nextRoute: "chapters-list", nextTitle: null };
  }

  /* ============================================================
     4. IMPORTANT QUESTIONS — dropdown options
     ============================================================ */
  function buildIQChapterOptions(chapters, counts, labelOf) {
    counts = counts || {};
    const list = (chapters || []).map(c => {
      const count = typeof counts[c.id] === "number" ? counts[c.id] : 0;
      let label;
      if (typeof labelOf === "function") label = labelOf(c);
      else label = "Ch." + (c.num != null ? c.num : "") + " " + c.name;
      return { value: c.id, label: label, count: count, empty: count === 0 };
    });
    const total = list.reduce((sum, o) => sum + o.count, 0);
    return [{ value: "all", label: "All Chapters", count: total, empty: total === 0 }].concat(list);
  }

  /* Identity of a quiz configuration (selected chapters + difficulty),
     order-insensitive, used as the once-per-day completion key. */
  function quizConfigKey(chapters, difficulty) {
    let chPart;
    if (Array.isArray(chapters)) chPart = chapters.slice().sort().join(",");
    else chPart = String(chapters == null ? "all" : chapters);
    return chPart + "|" + String(difficulty == null ? "all" : difficulty);
  }

  return {
    XP_POLICY: XP_POLICY,
    ACTIVITY_LIMIT: ACTIVITY_LIMIT,
    dayKey: dayKey,
    /* XP registry */
    awardOnce: awardOnce,
    isClaimed: isClaimed,
    awardDaily: awardDaily,
    isDailyClaimed: isDailyClaimed,
    dailyCount: dailyCount,
    bumpDaily: bumpDaily,
    dailyLeft: dailyLeft,
    prune: prune,
    /* Recent activity */
    normalizeActivity: normalizeActivity,
    activityKey: activityKey,
    pushActivity: pushActivity,
    makeActivityId: makeActivityId,
    /* Section navigation */
    planSectionNav: planSectionNav,
    /* Important questions */
    buildIQChapterOptions: buildIQChapterOptions,
    /* Quiz */
    quizConfigKey: quizConfigKey
  };
});
