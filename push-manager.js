/* ------------------------------------------------------------------
   push-manager.js — genuine Web Push client for Accountancy By Abhinash.

   This module owns the ENTIRE push subscription lifecycle:
     capability checks → permission (only on explicit student action)
     → service worker registration → VAPID public key fetch
     → PushManager.subscribe() → POST to the server → confirmation.

   Honesty rules baked in everywhere:
     • The browser permission prompt is NEVER requested automatically —
       only inside enable(), which is only called from a button the
       student pressed (onboarding card / settings).
     • Success is only reported after the server confirms the save.
     • "Paused" (silence for a while, subscription kept) and
       "Unsubscribed" (this device removed from delivery) are different
       states with different wording.
     • Focus-session and achievement notifications are page-context
       only (the site must be open) — labelled as such in Settings.

   Identity: a random anonymous device id (localStorage "aba_device").
   It is a capability token for THIS device's subscription — not an
   account. Clearing site data starts a new identity (documented in
   PUSH-NOTIFICATIONS-SETUP.md).

   The pure helpers are exported on ABAPush.core so the test suite can
   exercise the exact logic the browser runs.
   ------------------------------------------------------------------ */
(function () {
  "use strict";

  /* ---------------- constants ---------------- */

  var DEVICE_KEY = "aba_device";          // { id, createdAt }
  var PREFS_KEY = "aba_push_prefs";       // prefs mirror (server is source of truth)
  var WEEK_KEY = "aba_push_week";         // weekly counters for the summary
  var SYNC_MIN_MS = 60000;                // min gap between automatic snapshot syncs

  var ENDPOINTS = {
    config: "/.netlify/functions/push-config",
    subscribe: "/.netlify/functions/push-subscribe",
    unsubscribe: "/.netlify/functions/push-unsubscribe",
    sync: "/.netlify/functions/push-sync",
    test: "/.netlify/functions/push-test"
  };

  /* The ten notification categories. "server" categories are scheduled
     and delivered by the backend (work while the site is closed).
     "local" categories fire from this page while it is open — the
     settings UI says so plainly instead of pretending otherwise. */
  var CATEGORIES = [
    { id: "daily-study", scope: "server", name: "Daily Study Reminder",
      desc: "One gentle nudge at your preferred time to revise or solve something." },
    { id: "streak", scope: "server", name: "Daily Streak",
      desc: "A reminder on days you haven't studied yet, to keep your routine alive." },
    { id: "unfinished-practice", scope: "server", name: "Unfinished Practice",
      desc: "Come back to a chapter you started but haven't finished." },
    { id: "mistake-book", scope: "server", name: "Mistake Book",
      desc: "When questions are waiting for review in your Mistake Book." },
    { id: "revision", scope: "server", name: "Revision",
      desc: "A periodic nudge to revisit chapters you studied a few days ago." },
    { id: "exam-prep", scope: "server", name: "Exam Preparation",
      desc: "A weekend reminder to take a practice test and check your understanding." },
    { id: "weekly-summary", scope: "server", name: "Weekly Progress Summary",
      desc: "One summary each week — your real practice activity, nothing invented." },
    { id: "site-updates", scope: "server", name: "Important Website Updates",
      desc: "Occasional notes when a new feature or improvement ships." },
    { id: "focus", scope: "local", name: "Focus Session Complete",
      desc: "When a Pomodoro session ends. Shown while the site is open — the timer cannot run in the background." },
    { id: "achievements", scope: "local", name: "Achievements",
      desc: "When you unlock a genuine new achievement. Shown while the site is open." }
  ];

  var DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // index = getDay()
  var DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];                              // Mon…Sun for display

  var DEFAULT_PREFS = {
    master: false,
    categories: {
      "daily-study": true, "streak": true, "unfinished-practice": true,
      "mistake-book": true, "revision": true, "exam-prep": true,
      "weekly-summary": true, "site-updates": true, "focus": true, "achievements": true
    },
    time: "18:00",
    days: [1, 2, 3, 4, 5, 6, 0],
    weekends: true,
    quiet: { start: "22:00", end: "07:00" },
    tz: "",
    maxDaily: 2,
    pausedUntil: null
  };

  /* runtime delivery state — never rendered as "enabled" unless both
     the local subscription AND the server save are confirmed. */
  var runtime = {
    configured: null,   // null = not fetched yet, bool once known
    configReason: null, // v88: vapid-missing | vapid-invalid | storage-unavailable | null
    configChecked: false, // a real config request has completed (or failed)
    subscribed: false,  // PushSubscription exists on this device
    serverSaved: false, // server confirmed the subscription record
    serverStatus: "none",
    lastError: null,
    lastSyncAt: 0,
    syncTimer: null,
    booted: false,
    visWired: false
  };

  /* ---------------- small utilities ---------------- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  /* Toasts belong to app.js — forward through its global and never
     break a flow if it is missing (e.g. during tests). */
  function say(msg, type, icon, opts) {
    try {
      if (typeof window !== "undefined" && typeof window.toast === "function") window.toast(msg, type || "success", icon || "bell", opts);
    } catch (e) { /* never let a missing toast break a flow */ }
  }

  function deviceTz() {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; }
    catch (e) { return "UTC"; }
  }

  function urlB64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = atob(base64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  /* ---------------- pure helpers (exported for tests) ---------------- */

  /* ISO week key "YYYY-Www" — mirrors the server's lib/schedule.js so a
     weekly summary can never be sent twice in one reporting period. */
  function isoWeekKey(date, tz) {
    var fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz || "UTC", year: "numeric", month: "2-digit", day: "2-digit"
    });
    var p = {};
    fmt.formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    var d = new Date(Date.UTC(+p.year, +p.month - 1, +p.day));
    var dayNum = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - dayNum + 3);
    var firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    var fDayNum = (firstThu.getUTCDay() + 6) % 7;
    firstThu.setUTCDate(firstThu.getUTCDate() - fDayNum + 3);
    var week = 1 + Math.round((d - firstThu) / (7 * 86400000));
    return d.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
  }

  /* "HH:MM" with real clock ranges (the input widget constrains
     format; this guards hand-edited/corrupt storage too). */
  function isHHMM(s) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(String(s || ""));
    if (!m) return false;
    return (+m[1]) <= 23 && (+m[2]) <= 59;
  }

  /* Fill any missing prefs fields from a stored/corrupt mirror so the
     UI can always render. The server re-sanitises on every save. */
  function normalizePrefs(raw) {
    var p = {
      master: DEFAULT_PREFS.master,
      categories: {},
      time: DEFAULT_PREFS.time,
      days: DEFAULT_PREFS.days.slice(),
      weekends: DEFAULT_PREFS.weekends,
      quiet: { start: DEFAULT_PREFS.quiet.start, end: DEFAULT_PREFS.quiet.end },
      tz: DEFAULT_PREFS.tz,
      maxDaily: DEFAULT_PREFS.maxDaily,
      pausedUntil: null
    };
    CATEGORIES.forEach(function (c) { p.categories[c.id] = DEFAULT_PREFS.categories[c.id]; });
    if (raw && typeof raw === "object") {
      if (typeof raw.master === "boolean") p.master = raw.master;
      if (raw.categories && typeof raw.categories === "object") {
        CATEGORIES.forEach(function (c) {
          if (typeof raw.categories[c.id] === "boolean") p.categories[c.id] = raw.categories[c.id];
        });
      }
      if (isHHMM(raw.time)) p.time = raw.time;
      if (Array.isArray(raw.days)) {
        var d = raw.days.filter(function (x) { return Number.isInteger(x) && x >= 0 && x <= 6; });
        /* v89 — client-side ONLY: an empty (or garbage) list keeps the
           defaults so the settings UI always shows a valid week and the
           server never receives days: []. The SERVER treats an explicit
           empty list as "no days selected" (no routine sends) and the
           endpoints reject it with 400 "no-days-selected" — the two
           behaviours are deliberate and documented. */
        if (d.length) p.days = d;
      }
      if (typeof raw.weekends === "boolean") p.weekends = raw.weekends;
      if (raw.quiet && typeof raw.quiet === "object") {
        if (isHHMM(raw.quiet.start)) p.quiet.start = raw.quiet.start;
        if (isHHMM(raw.quiet.end)) p.quiet.end = raw.quiet.end;
      }
      if (typeof raw.tz === "string" && raw.tz) p.tz = raw.tz;
      if (Number.isFinite(raw.maxDaily)) p.maxDaily = Math.max(1, Math.min(4, Math.round(raw.maxDaily)));
      if (Number.isFinite(raw.pausedUntil) && raw.pausedUntil > 0) p.pausedUntil = raw.pausedUntil;
    }
    if (!p.tz) p.tz = deviceTz();
    return p;
  }

  /* Assemble the progress snapshot from plain inputs — pure so tests
     can verify that NO value is ever invented (every field derives
     from something the student actually did). */
  function buildSnapshotCore(input) {
    var now = input.now || Date.now();
    var midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    var todayStart = midnight.getTime();
    var log = Array.isArray(input.activityLog) ? input.activityLog : [];
    var activeToday = log.some(function (e) {
      return e && typeof e.at === "number" && e.at >= todayStart;
    });
    var lastAt = 0;
    log.forEach(function (e) { if (e && typeof e.at === "number" && e.at > lastAt) lastAt = e.at; });
    var week = input.week && typeof input.week === "object" ? input.week : null;
    return {
      tz: input.tz || deviceTz(),
      streak: Number.isFinite(input.streak) && input.streak > 0 ? Math.floor(input.streak) : 0,
      activeToday: !!activeToday,
      mistakeCount: Number.isFinite(input.mistakeCount) && input.mistakeCount > 0 ? Math.floor(input.mistakeCount) : 0,
      unfinished: input.unfinished && input.unfinished.route
        ? { route: String(input.unfinished.route), label: String(input.unfinished.label || "").slice(0, 60),
            /* A real "when did they walk away" time: prefer a supplied
               positive one, else the newest activity on record. 0 means
               "unknown", which the server treats as "no gate". */
            at: Number.isFinite(input.unfinished.at) && input.unfinished.at > 0 ? input.unfinished.at : lastAt }
        : null,
      lastStudiedAt: Number.isFinite(input.lastStudiedAt) && input.lastStudiedAt > 0 ? input.lastStudiedAt : lastAt,
      week: week
        ? {
            questions: Math.max(0, Math.round(Number(wordCountSafe(week.questions)))),
            xp: Math.max(0, Math.round(Number(wordCountSafe(week.xp)))),
            chaptersStudied: Math.max(0, Math.round(Number(wordCountSafe(week.chaptersStudied)))),
            mistakesReviewed: Math.max(0, Math.round(Number(wordCountSafe(week.mistakesReviewed))))
          }
        : null,
      appVersion: String(input.appVersion || "").slice(0, 24)
    };
  }
  function wordCountSafe(n) { return Number.isFinite(n) ? n : 0; }

  /* ---------------- device identity + prefs storage ---------------- */

  function readJson(key) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* blocked */ }
  }

  function deviceId() {
    var rec = readJson(DEVICE_KEY);
    if (rec && typeof rec.id === "string" && rec.id) return rec.id;
    /* v89 — this id is the system's capability token for push
       subscription management, so it MUST come from a CSPRNG.
       randomUUID() where available, else a v4 UUID built from
       getRandomValues(); Math.random() is never acceptable here. If
       neither exists (or crypto is blocked), FAIL SAFE: return null so
       enable() refuses to subscribe rather than minting a guessable
       identity. */
    var id = null;
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) id = crypto.randomUUID();
      else if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        var b = new Uint8Array(16);
        crypto.getRandomValues(b);
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        var hex = [];
        for (var i = 0; i < 16; i++) hex.push((b[i] + 0x100).toString(16).slice(1));
        id = hex.slice(0, 4).join("") + "-" + hex.slice(4, 6).join("") + "-" +
             hex.slice(6, 8).join("") + "-" + hex.slice(8, 10).join("") + "-" +
             hex.slice(10).join("");
      }
    } catch (e) { id = null; }
    if (!id) return null;
    writeJson(DEVICE_KEY, { id: id, createdAt: Date.now() });
    return id;
  }

  var prefsCache = null;
  function loadPrefs() {
    if (!prefsCache) prefsCache = normalizePrefs(readJson(PREFS_KEY));
    return prefsCache;
  }
  function savePrefs(p) {
    prefsCache = normalizePrefs(p);
    writeJson(PREFS_KEY, prefsCache);
  }

  /* Weekly counters — real tallies kept in the browser and synced to
     the server; the weekly summary never fabricates figures. */
  function loadWeek() {
    var tz = deviceTz();
    var key = isoWeekKey(new Date(), tz);
    var w = readJson(WEEK_KEY);
    if (!w || w.key !== key) {
      w = { key: key, questions: 0, xp: 0, chapters: [], mistakesReviewed: 0 };
      writeJson(WEEK_KEY, w);
    }
    if (!Array.isArray(w.chapters)) w.chapters = [];
    return w;
  }
  function saveWeek(w) { writeJson(WEEK_KEY, w); }

  /* ---------------- capability + registration ---------------- */

  function supported() {
    return !!(navigator.serviceWorker && "PushManager" in window && "Notification" in window && window.isSecureContext);
  }
  function permission() {
    try { return Notification.permission; } catch (e) { return "default"; }
  }
  function getReg() {
    return navigator.serviceWorker.register("/sw.js").then(function () { return navigator.serviceWorker.ready; });
  }

  /* True when an existing browser subscription was created with the
     given VAPID public key (base64url). Unknown → assume it matches. */
  function sameServerKey(sub, publicKeyB64) {
    try {
      var cur = sub && sub.options && sub.options.applicationServerKey;
      if (!cur) return true;
      var a = new Uint8Array(cur), b = urlB64ToUint8Array(publicKeyB64);
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
      return true;
    } catch (e) { return true; }
  }

  function fetchConfig() {
    return fetch(ENDPOINTS.config, { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        runtime.configChecked = true;
        runtime.configured = !!(j && j.ok && j.configured && j.publicKey);
        /* v88: remember WHY the server isn't ready so the message can be
           accurate (missing keys vs invalid keys vs storage problem). */
        runtime.configReason = runtime.configured ? null : ((j && j.reason) || null);
        return runtime.configured ? j : null;
      })
      .catch(function () {
        /* The request itself failed — record that a check HAPPENED so the
           UI can say "couldn't reach the server" instead of forever
           claiming a check is still in progress. */
        runtime.configChecked = true;
        runtime.configured = null;
        runtime.configReason = null;
        return null;
      });
  }

  function api(path, body) {
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) { return { status: r.status, body: j }; });
    }).catch(function () { return null; });
  }

  function deviceLabel() {
    var ua = navigator.userAgent || "";
    var browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera"
      : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome"
      : /Safari\//.test(ua) ? "Safari" : "Browser";
    var os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android"
      : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Mac OS/.test(ua) ? "macOS"
      : /Linux/.test(ua) ? "Linux" : "";
    return (browser + (os ? " on " + os : "")).slice(0, 80);
  }

  /* ---------------- snapshot ---------------- */

  function buildSnapshot() {
    var chapterProgress = (typeof STATE !== "undefined" && STATE.chapterProgress) ? STATE.chapterProgress : {};
    var unfinished = null;
    var partialId = null;
    try {
      if (typeof activeChapterIds === "function" && typeof activeChapterMap === "function") {
        var ids = activeChapterIds();
        var map = activeChapterMap();
        for (var i = 0; i < ids.length; i++) {
          var pct = chapterProgress[ids[i]] || 0;
          if (pct > 0 && pct < 100) { partialId = ids[i]; break; }
        }
        if (partialId && map[partialId]) unfinished = { route: "ch-" + partialId, label: map[partialId].name, at: 0 };
      }
    } catch (e) { /* keep unfinished null — never invent */ }

    var mistakeCount = 0;
    try {
      if (typeof STATE !== "undefined" && STATE.mistakeBook) {
        mistakeCount = Object.keys(STATE.mistakeBook).length;
      }
    } catch (e) { mistakeCount = 0; }

    var w = loadWeek();
    return buildSnapshotCore({
      tz: deviceTz(),
      streak: (typeof STATE !== "undefined") ? STATE.streak : 0,
      activityLog: (typeof STATE !== "undefined") ? STATE.activityLog : [],
      mistakeCount: mistakeCount,
      unfinished: unfinished,
      week: { questions: w.questions, xp: w.xp, chaptersStudied: w.chapters.length, mistakesReviewed: w.mistakesReviewed }
    });
  }

  /* ---------------- status ---------------- */

  function isPaused() {
    var p = loadPrefs();
    return !!(p.pausedUntil && Date.now() < p.pausedUntil);
  }
  function active() {
    return !!(runtime.subscribed && runtime.serverSaved && loadPrefs().master && !isPaused());
  }
  function status() {
    return {
      supported: supported(),
      permission: supported() ? permission() : "unsupported",
      configured: runtime.configured,
      configChecked: runtime.configChecked,
      master: loadPrefs().master,
      subscribed: runtime.subscribed,
      serverSaved: runtime.serverSaved,
      serverStatus: runtime.serverStatus,
      paused: isPaused(),
      pausedUntil: loadPrefs().pausedUntil,
      active: active()
    };
  }

  /* ---------------- the enable flow ---------------- */

  /* Full subscription pipeline. Only ever called from a student's
     explicit button press — never on load, never on visit. Returns
     { ok, code } and toasts honestly at each failure point. */
  function enable() {
    if (!supported()) {
      say("This browser can't receive notifications. On iPhone or iPad, add this site to your Home Screen first (Share → Add to Home Screen).", "error", "bell-off");
      return Promise.resolve({ ok: false, code: "unsupported" });
    }
    if (permission() === "denied") {
      say("Notifications are blocked for this site. To turn them on: tap the lock icon in the address bar → Site settings → Notifications → Allow, then reload.", "error", "bell-off");
      return Promise.resolve({ ok: false, code: "denied" });
    }

    var permPromise = permission() === "granted"
      ? Promise.resolve("granted")
      : Notification.requestPermission();

    return permPromise.then(function (perm) {
      if (perm !== "granted") {
        say("No problem — nothing was turned on. You can enable notifications any time from Settings.", "info", "bell-off");
        return { ok: false, code: "not-granted" };
      }
      return fetchConfig().then(function (cfg) {
        if (!cfg) {
          say(runtime.configured === false
            ? "Notifications aren't set up correctly on this deployment yet. " + configProblemText(runtime.configReason)
            : "Couldn't reach the notification server — check your connection and try again.", "error", "cloud-off");
          return { ok: false, code: runtime.configured === false ? "unconfigured" : "offline" };
        }
        return getReg().then(function (reg) {
          return reg.pushManager.getSubscription().then(function (sub) {
            /* v88: a subscription made with a DIFFERENT server key (an
               earlier attempt, or a rotated key) can never receive
               messages signed with the current key — drop it and make a
               fresh one. */
            if (sub && !sameServerKey(sub, cfg.publicKey)) {
              return sub.unsubscribe().catch(function () { /* ignore */ }).then(function () { return null; });
            }
            return sub;
          }).then(function (sub) {
            /* v89 — fail safe: without a CSPRNG there is no secure
               device identity, so we refuse to create a browser
               subscription the server could not honestly attribute. */
            var did = deviceId();
            if (!did) {
              runtime.lastError = "no-secure-device-id";
              say("This browser can't create a secure device id (crypto is unavailable), so notifications can't be enabled.", "error", "shield-alert");
              return { ok: false, code: "no-secure-device-id" };
            }
            var subPromise = sub
              ? Promise.resolve(sub)
              : reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlB64ToUint8Array(cfg.publicKey)
                });
            return subPromise.then(function (subscription) {
              var prefs = loadPrefs();
              prefs.master = true;
              prefs.tz = deviceTz();
              savePrefs(prefs);
              /* Never claim success before the server confirms. */
              return api(ENDPOINTS.subscribe, {
                deviceId: did,
                subscription: subscription.toJSON ? subscription.toJSON() : subscription,
                prefs: prefs,
                snapshot: buildSnapshot(),
                label: deviceLabel()
              }).then(function (res) {
                if (res && res.body && res.body.ok === true) {
                  runtime.subscribed = true;
                  runtime.serverSaved = true;
                  runtime.serverStatus = res.body.status || "active";
                  runtime.lastError = null;
                  runtime.lastSyncAt = Date.now();
                  if (typeof STATE !== "undefined") {
                    STATE.notificationsEnabled = true;
                    STATE.notifyHour = parseInt(prefs.time.split(":")[0], 10) || 18;
                    STATE.notificationsPromptDismissed = true;
                    try { saveState(); } catch (e) { /* page owns state */ }
                  }
                  say("Notifications enabled — reminders will reach this device even when the site is closed.", "success", "bell-ring");
                  /* Labelled confirmation push through the real server
                     pipeline; a failed test never revokes the saved
                     subscription, it is only reported honestly. */
                  test().then(function (t) {
                    if (!t.ok) say("Your subscription is saved, but the confirmation notification didn't go through: " + (t.message || "unknown error") + ". You can retry from Settings.", "error", "alert-triangle");
                  });
                  return { ok: true };
                }
                /* Server did not confirm — undo the local optimism. */
                runtime.serverSaved = false;
                runtime.lastError = res ? (res.body && res.body.error) || "save-failed" : "offline";
                if (typeof STATE !== "undefined") {
                  STATE.notificationsEnabled = false;
                  try { saveState(); } catch (e) { /* page owns state */ }
                }
                say(res
                  ? "The server didn't confirm the subscription (" + (res.body && res.body.error || "error") + ") — notifications are NOT on yet. Please try again."
                  : "Couldn't reach the notification server — notifications are NOT on yet. Check your connection and try again.", "error", "cloud-off");
                return { ok: false, code: runtime.lastError };
              });
            });
          });
        });
      });
    }).catch(function () {
      say("Something went wrong setting up notifications — nothing was turned on.", "error", "alert-triangle");
      return { ok: false, code: "exception" };
    });
  }

  /* ---------------- disable / pause / unsubscribe ---------------- */

  function disable() {
    var prefs = loadPrefs();
    prefs.master = false;
    savePrefs(prefs);
    var did = deviceId();
    var finishLocal = function () {
      runtime.subscribed = false;
      runtime.serverSaved = false;
      runtime.serverStatus = "none";
      if (typeof STATE !== "undefined") {
        STATE.notificationsEnabled = false;
        try { saveState(); } catch (e) { /* page owns state */ }
      }
    };
    return getReg()
      .then(function (reg) { return reg.pushManager.getSubscription(); })
      .then(function (sub) { return sub ? sub.unsubscribe() : null; })
      .catch(function () { /* already gone */ })
      .then(function () { return api(ENDPOINTS.unsubscribe, { deviceId: did }); })
      .then(function () { finishLocal(); })
      .catch(function () { finishLocal(); });
  }

  function forgetEverything() {
    return disable().then(function () {
      try { localStorage.removeItem(DEVICE_KEY); } catch (e) { /* blocked */ }
      try { localStorage.removeItem(PREFS_KEY); } catch (e) { /* blocked */ }
      try { localStorage.removeItem(WEEK_KEY); } catch (e) { /* blocked */ }
      prefsCache = null;
    });
  }

  function pause(ms) {
    var prefs = loadPrefs();
    prefs.pausedUntil = Date.now() + ms;
    savePrefs(prefs);
    say("Notifications paused — the subscription stays saved and reminders resume automatically.", "info", "moon");
    return syncNow(true);
  }
  function resume() {
    var prefs = loadPrefs();
    prefs.pausedUntil = null;
    savePrefs(prefs);
    say("Reminders resumed.", "success", "bell-ring");
    return syncNow(true);
  }

  function restoreDefaults() {
    var prefs = loadPrefs();
    var keepMaster = prefs.master;
    var restored = normalizePrefs(null);
    restored.master = keepMaster;
    restored.tz = deviceTz();
    savePrefs(restored);
    if (typeof STATE !== "undefined") {
      STATE.notifyHour = parseInt(restored.time.split(":")[0], 10) || 18;
      try { saveState(); } catch (e) { /* page owns state */ }
    }
    say("Notification preferences restored to defaults.", "success", "rotate-ccw");
    return syncNow(true);
  }

  /* ---------------- test notification (real server push) ---------------- */

  function test() {
    if (!supported() || permission() !== "granted") {
      return Promise.resolve({ ok: false, message: "notifications aren't enabled in this browser" });
    }
    return api(ENDPOINTS.test, { deviceId: deviceId() }).then(function (res) {
      if (res && res.body && res.body.ok) {
        say("Test notification sent — check your notifications.", "success", "bell-ring");
        return { ok: true };
      }
      var msg = !res ? "the server is unreachable"
        : res.status === 409 ? "this device isn't subscribed on the server (or the subscription expired) — turn notifications off and on again"
        : res.status === 429 ? "too many tests in the last hour — try again shortly"
        : res.status === 503 ? "the server is missing its delivery keys"
        : "the push service refused the message";
      say("Test failed: " + msg + ".", "error", "alert-triangle");
      return { ok: false, message: msg };
    }).catch(function () {
      say("Test failed: the server is unreachable.", "error", "cloud-off");
      return { ok: false, message: "server unreachable" };
    });
  }

  /* ---------------- prefs editing + sync ---------------- */

  function updatePrefs(patch) {
    var prefs = loadPrefs();
    Object.keys(patch).forEach(function (k) {
      if (k === "categories") {
        Object.keys(patch.categories).forEach(function (c) { prefs.categories[c] = !!patch.categories[c]; });
      } else if (k === "quiet") {
        if (patch.quiet.start) prefs.quiet.start = patch.quiet.start;
        if (patch.quiet.end) prefs.quiet.end = patch.quiet.end;
      } else {
        prefs[k] = patch[k];
      }
    });
    savePrefs(prefs);
    if (typeof STATE !== "undefined" && patch.time) {
      STATE.notifyHour = parseInt(prefs.time.split(":")[0], 10) || 18;
      try { saveState(); } catch (e) { /* page owns state */ }
    }
    /* Preferences only matter to the scheduler for subscribed devices —
       skip the network entirely otherwise (keeps browsing light). */
    if (!runtime.serverSaved) return Promise.resolve({ ok: false, skipped: true });
    return syncNow(true);
  }

  function syncNow(force) {
    if (!runtime.serverSaved) return Promise.resolve({ ok: false, skipped: true });
    if (!force && Date.now() - runtime.lastSyncAt < SYNC_MIN_MS) return Promise.resolve({ ok: false, throttled: true });
    runtime.lastSyncAt = Date.now();
    return api(ENDPOINTS.sync, {
      deviceId: deviceId(),
      prefs: loadPrefs(),
      snapshot: buildSnapshot()
    }).then(function (res) {
      if (res && res.body && res.body.ok) {
        runtime.serverStatus = res.body.status || runtime.serverStatus;
        if (res.body.subscribed === false || res.body.status === "invalid") {
          /* Endpoint rotation, server-side cleanup, or the push service
             reported the subscription dead (404/410): the browser may
             still hold a subscription, but the server can't use it.
             v88: quietly repair it (no permission prompt — permission
             is already granted) instead of leaving the student stuck. */
          runtime.serverSaved = false;
          return recoverSubscription(res.body.status === "invalid");
        }
        return { ok: true };
      }
      return { ok: false };
    }).catch(function () { return { ok: false }; });
  }

  /* v88 — self-healing. Re-registers this device with the server when it
     lost (or expired) the stored subscription. Never asks for
     permission; only runs when permission is already granted and the
     student has reminders switched on. `replace` = the push service
     declared the old endpoint dead, so a brand-new browser
     subscription is created. At most one attempt per page load. */
  function recoverSubscription(replace) {
    if (runtime.recovering || runtime.recovered) return Promise.resolve({ ok: false, skipped: true });
    if (!supported() || permission() !== "granted" || !loadPrefs().master) return Promise.resolve({ ok: false, skipped: true });
    runtime.recovering = true;
    return fetchConfig().then(function (cfg) {
      if (!cfg) return { ok: false };
      return getReg().then(function (reg) {
        return reg.pushManager.getSubscription().then(function (sub) {
          if (sub && (replace || !sameServerKey(sub, cfg.publicKey))) {
            return sub.unsubscribe().catch(function () { /* ignore */ }).then(function () { return null; });
          }
          return sub;
        }).then(function (sub) {
          return sub || reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(cfg.publicKey)
          });
        }).then(function (subscription) {
          return api(ENDPOINTS.subscribe, {
            deviceId: deviceId(),
            subscription: subscription.toJSON ? subscription.toJSON() : subscription,
            prefs: loadPrefs(),
            snapshot: buildSnapshot(),
            label: deviceLabel()
          });
        });
      }).then(function (res) {
        if (res && res.body && res.body.ok === true) {
          runtime.subscribed = true;
          runtime.serverSaved = true;
          runtime.serverStatus = res.body.status || "active";
          if (typeof STATE !== "undefined") { STATE.notificationsEnabled = true; try { saveState(); } catch (e) { /* page owns state */ } }
          return { ok: true, recovered: true };
        }
        return { ok: false };
      });
    }).catch(function () { return { ok: false }; })
      .then(function (r) { runtime.recovering = false; runtime.recovered = true; return r; });
  }

  /* Dirty-flag sync: frequent student activity must not spam the
     server — one trailing sync per quiet window, plus a flush when the
     tab is hidden (which is when reminder-relevant state matters). */
  function markDirty() {
    if (!runtime.serverSaved) return;
    if (runtime.syncTimer) clearTimeout(runtime.syncTimer);
    runtime.syncTimer = setTimeout(function () { runtime.syncTimer = null; syncNow(false); }, 30000);
  }
  function flushSync() {
    if (runtime.syncTimer) { clearTimeout(runtime.syncTimer); runtime.syncTimer = null; }
    syncNow(false);
  }

  /* ---------------- activity hooks (real data only) ---------------- */

  var QUESTION_TYPES = { practice: 1, case: 1, quiz: 1, flashcards: 1, exam: 1 };
  var DONE_STATUSES = { solved: 1, completed: 1, passed: 1 };

  function noteActivity(entry) {
    try {
      var w = loadWeek();
      if (entry && typeof entry === "object") {
        var type = String(entry.type || "");
        var status = String(entry.status || "");
        if (QUESTION_TYPES[type] && DONE_STATUSES[status]) w.questions += 1;
        /* Chapters come from the real entry: chapterId when present,
           otherwise the "ch-<id>" route the practice UI logs. */
        var ch = entry.chapterId || null;
        if (!ch && typeof entry.route === "string" && entry.route.indexOf("ch-") === 0) ch = entry.route.slice(3);
        if (ch && w.chapters.indexOf(ch) === -1) w.chapters.push(String(ch).slice(0, 24));
        saveWeek(w);
      }
      markDirty();
    } catch (e) { /* counters are best-effort */ }
  }
  function noteXp(amount) {
    try {
      if (!Number.isFinite(amount) || amount <= 0) return;
      var w = loadWeek();
      w.xp += Math.round(amount);
      saveWeek(w);
      markDirty();
    } catch (e) { /* best-effort */ }
  }
  function noteMistakeReviewed() {
    try {
      var w = loadWeek();
      w.mistakesReviewed += 1;
      saveWeek(w);
      markDirty();
    } catch (e) { /* best-effort */ }
  }

  /* ---------------- local (page-open) notifications ---------------- */

  function localNotify(opts) {
    try {
      if (!supported() || permission() !== "granted") return;
      var prefs = loadPrefs();
      if (opts.category && !prefs.categories[opts.category]) return;
      var payload = {
        body: opts.body || "",
        icon: "/assets/brand/icon-192.png",
        badge: "/assets/brand/icon-192.png",
        tag: opts.tag || "aba-local",
        data: { url: opts.url || "#home" },
        timestamp: Date.now()
      };
      navigator.serviceWorker.ready.then(function (reg) {
        reg.showNotification(opts.title || "Accountancy By Abhinash", payload);
      }).catch(function () {
        try { void new Notification(opts.title || "Accountancy By Abhinash", payload); } catch (e) { /* blocked */ }
      });
    } catch (e) { /* a blocked notification must never break the page */ }
  }

  function localFocusComplete() {
    localNotify({
      category: "focus",
      title: "Focus Session Complete \u23F1\uFE0F",
      body: "Nice — that session is done. Take a short break before the next one.",
      tag: "aba-focus",
      url: "#home"
    });
  }

  function achievementUnlocked(list) {
    try {
      var prefs = loadPrefs();
      if (!prefs.categories.achievements) return;
      (list || []).slice(0, 3).forEach(function (a) {
        if (!a || !a.name) return;
        localNotify({
          category: "achievements",
          title: "Achievement unlocked: " + a.name,
          body: "Open your dashboard to see it in your badge collection.",
          tag: "aba-ach-" + (a.id || a.name),
          url: "#home"
        });
      });
    } catch (e) { /* best-effort */ }
  }

  /* ---------------- status copy (honest states) ---------------- */

  /* Accurate wording per server-reported reason (v88). */
  function configProblemText(reason) {
    if (reason === "vapid-invalid") return "This deployment's notification keys are set but not valid (wrong format or not a matching pair), so reminders can't be delivered. Nothing is broken on your device.";
    if (reason === "storage-unavailable") return "This deployment's notification server can't reach its storage (Netlify Blobs), so reminders can't be saved or delivered. Nothing is broken on your device.";
    return "This deployment's notification server isn't configured yet (missing delivery keys), so reminders can't be delivered. Nothing is broken on your device.";
  }

  function statusCopy(s) {
    if (!s.supported) return { tone: "warn", text: "This browser can't receive notifications. Try Chrome, Edge, Firefox, or Safari 16.4+ (on iPhone or iPad: add this site to your Home Screen first — Share → Add to Home Screen)." };
    if (s.permission === "denied") return { tone: "warn", text: "Notifications are blocked for this site. To re-enable: tap the lock/info icon in the address bar → Site settings → Notifications → Allow, then reload this page." };
    if (s.configured === false) return { tone: "warn", text: configProblemText(s.configReason) };
    if (s.configured === null) return s.configChecked
      ? { tone: "warn", text: "Couldn't reach the notification server (offline, or Web Push isn't deployed here) — reminders can't be set up right now. It's checked again on every page load." }
      : { tone: "info", text: "Checking the notification server…" };
    if (s.active) return { tone: "ok", text: "Active — reminders are delivered to this device even when the site is closed." };
    if (s.paused) return { tone: "info", text: "Paused — your subscription is saved but reminders are silenced for now. Resume below whenever you like." };
    if (s.master && s.subscribed && !s.serverSaved) return { tone: "warn", text: "Saved on this device but not yet confirmed by the server — tap Enable again to finish connecting." };
    if (s.permission === "granted" && !s.master) return { tone: "info", text: "Permission granted, but reminders are off. Tap Enable to turn them on." };
    return { tone: "info", text: "Reminders are off. Turn them on below — you choose what you get and when." };
  }

  /* ---------------- settings UI ---------------- */

  function renderSettingsHTML() {
    var s = status();
    var p = loadPrefs();
    var copy = statusCopy(s);

    if (!s.supported) {
      return '<label>Notifications</label>' +
        '<p style="font-size:0.85rem; color:var(--flag); margin:6px 0 0;">' + esc(copy.text) + "</p>";
    }

    var pill = function (tone, label, icon) {
      var color = tone === "ok" ? "var(--good, #2D6A4F)" : tone === "warn" ? "var(--flag, #B23A2F)" : "var(--ink-soft)";
      return '<span class="notif-pill" style="color:' + color + ';"><i data-lucide="' + icon + '" style="width:13px;height:13px;"></i> ' + esc(label) + "</span>";
    };

    var permLabel = s.permission === "granted" ? "Permission: granted" : s.permission === "denied" ? "Permission: blocked" : "Permission: not asked";
    var deliverLabel = s.active ? "Delivery: active" : s.paused ? "Delivery: paused" : s.subscribed ? "Delivery: not connected" : "Delivery: off";

    var html = "";
    html += "<label>Notifications</label>";
    html += '<div class="notif-status-row">' +
      pill(s.permission === "granted" ? "ok" : s.permission === "denied" ? "warn" : "info", permLabel, s.permission === "granted" ? "check-circle" : s.permission === "denied" ? "ban" : "circle") +
      pill(s.active ? "ok" : s.paused ? "info" : "warn", deliverLabel, s.active ? "bell-ring" : s.paused ? "moon" : "bell-off") +
      "</div>";
    html += '<p style="font-size:0.8rem; color:' + (copy.tone === "warn" ? "var(--flag)" : "var(--ink-faint)") + '; margin:6px 0 0;">' + esc(copy.text) + "</p>";

    var actions = [];
    if (!s.master || !s.subscribed) {
      actions.push('<button class="btn-primary sm ripple-surface" id="notifEnableBtn" type="button"><i data-lucide="bell"></i> Enable Notifications</button>');
    } else {
      if (s.paused) actions.push('<button class="btn-ghost sm ripple-surface" id="notifResumeBtn" type="button"><i data-lucide="bell-ring"></i> Resume reminders</button>');
      else actions.push('<button class="btn-ghost sm ripple-surface" id="notifPauseBtn" type="button"><i data-lucide="moon"></i> Pause reminders</button>');
      actions.push('<button class="btn-ghost sm ripple-surface" id="notifTestBtn" type="button"><i data-lucide="send"></i> Send test notification</button>');
      actions.push('<button class="btn-danger sm ripple-surface" id="notifUnsubBtn" type="button"><i data-lucide="bell-off"></i> Unsubscribe this device</button>');
    }
    html += '<div class="notif-actions">' + actions.join("") + "</div>";

    /* iOS honesty note — Web Push on iPhone/iPad needs the installed
       web app; saying so here beats a silent failure later. */
    if (/iPhone|iPad|iPod/.test(navigator.userAgent || "")) {
      html += '<p style="font-size:0.78rem; color:var(--ink-faint); margin:8px 0 0;">On iPhone and iPad, notifications only work when this site is added to your Home Screen (Share → Add to Home Screen). Open it from the Home Screen icon after that.</p>';
    }

    /* ---- what you'll get (10 categories, individually toggleable) ---- */
    html += '<div class="notif-cats">';
    CATEGORIES.forEach(function (c) {
      var on = !!p.categories[c.id];
      html += '<label class="notif-cat' + (on ? " on" : "") + '">' +
        '<input type="checkbox" data-cat="' + c.id + '"' + (on ? " checked" : "") + ">" +
        '<span class="notif-cat-body">' +
        '<span class="notif-cat-name">' + esc(c.name) +
        (c.scope === "local" ? ' <span class="notif-scope">while the site is open</span>' : "") + "</span>" +
        '<span class="notif-cat-desc">' + esc(c.desc) + "</span>" +
        "</span></label>";
    });
    html += "</div>";

    /* ---- schedule controls ---- */
    html += '<div class="notif-sched">';
    html += '<div class="notif-sched-row"><span class="notif-sched-label">Preferred time</span>' +
      '<input type="time" id="notifTimeInput" value="' + esc(p.time) + '"></div>';

    html += '<div class="notif-sched-row"><span class="notif-sched-label">Days</span><span class="notif-days">';
    DAY_ORDER.forEach(function (d) {
      html += '<button type="button" class="chip notif-day' + (p.days.indexOf(d) !== -1 ? " active" : "") + '" data-day="' + d + '" aria-pressed="' + (p.days.indexOf(d) !== -1) + '">' + DAY_LABELS[d] + "</button>";
    });
    html += "</span></div>";

    html += '<div class="notif-sched-row"><span class="notif-sched-label">Weekends</span>' +
      '<button type="button" class="chip' + (p.weekends ? " active" : "") + '" id="notifWeekendBtn" aria-pressed="' + !!p.weekends + '">' + (p.weekends ? "Reminders on" : "No weekend reminders") + "</button></div>";

    html += '<div class="notif-sched-row"><span class="notif-sched-label">Quiet hours</span><span class="notif-quiet">' +
      '<input type="time" id="notifQuietStart" value="' + esc(p.quiet.start) + '" aria-label="Quiet hours start">' +
      '<span aria-hidden="true">→</span>' +
      '<input type="time" id="notifQuietEnd" value="' + esc(p.quiet.end) + '" aria-label="Quiet hours end"></span></div>';

    html += '<div class="notif-sched-row"><span class="notif-sched-label">Time zone</span>' +
      '<span class="notif-tz">' + esc(p.tz || deviceTz()) + "</span></div>";

    html += '<div class="notif-sched-row"><span class="notif-sched-label">Max per day</span>' +
      '<select id="notifMaxDaily">' +
      [1, 2, 3, 4].map(function (n) { return '<option value="' + n + '"' + (p.maxDaily === n ? " selected" : "") + ">" + n + " reminder" + (n > 1 ? "s" : "") + " a day</option>"; }).join("") +
      "</select></div>";
    html += "</div>";

    html += '<div class="notif-foot">' +
      '<button type="button" class="btn-ghost sm" id="notifRestoreBtn"><i data-lucide="rotate-ccw"></i> Restore default preferences</button>' +
      "</div>";
    html += '<p style="font-size:0.76rem; color:var(--ink-faint); margin:8px 0 0;">Reminders are scheduled on the server from the progress saved on this device. This device has an anonymous ID (not an account) — clearing site data resets it. Streaks, scores and dates in notifications are never invented; you only ever get reminders about what you actually did.</p>';

    return html;
  }

  function wireSettings(refresh) {
    var rerender = function () {
      refresh && refresh();
    };

    var enableBtn = $("#notifEnableBtn");
    if (enableBtn) enableBtn.addEventListener("click", function () {
      enableBtn.disabled = true;
      enable().then(rerender);
    });

    var testBtn = $("#notifTestBtn");
    if (testBtn) testBtn.addEventListener("click", function () { test(); });

    var pauseBtn = $("#notifPauseBtn");
    if (pauseBtn) pauseBtn.addEventListener("click", function () { pause(24 * 3600 * 1000).then(rerender); });

    var resumeBtn = $("#notifResumeBtn");
    if (resumeBtn) resumeBtn.addEventListener("click", function () { resume().then(rerender); });

    var unsubBtn = $("#notifUnsubBtn");
    if (unsubBtn) unsubBtn.addEventListener("click", function () {
      var go = function () {
        disable().then(function () {
          say("This device was unsubscribed — you won't receive reminders here anymore. Your study data is untouched.", "success", "bell-off");
          rerender();
        });
      };
      if (typeof uiConfirm === "function") {
        uiConfirm("Reminders will stop for this device. Your XP, progress and settings stay exactly as they are.", { title: "Unsubscribe this device?", confirmLabel: "Unsubscribe" }).then(function (ok) { if (ok) go(); });
      } else { go(); }
    });

    $all("input[data-cat]").forEach(function (input) {
      input.addEventListener("change", function () {
        var patch = { categories: {} };
        patch.categories[input.dataset.cat] = input.checked;
        var row = input.closest(".notif-cat");
        if (row) row.classList.toggle("on", input.checked);
        updatePrefs(patch);
      });
    });

    var timeInput = $("#notifTimeInput");
    if (timeInput) timeInput.addEventListener("change", function () {
      if (isHHMM(timeInput.value)) updatePrefs({ time: timeInput.value });
    });

    $all(".notif-day").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var day = parseInt(btn.dataset.day, 10);
        var p = loadPrefs();
        var days = p.days.slice();
        var idx = days.indexOf(day);
        if (idx === -1) days.push(day);
        else if (days.length > 1) days.splice(idx, 1);
        else { say("Keep at least one day selected.", "info", "info"); return; }
        days.sort(function (a, b) { return a - b; });
        btn.classList.toggle("active", days.indexOf(day) !== -1);
        btn.setAttribute("aria-pressed", String(days.indexOf(day) !== -1));
        updatePrefs({ days: days });
      });
    });

    var weekendBtn = $("#notifWeekendBtn");
    if (weekendBtn) weekendBtn.addEventListener("click", function () {
      var next = !loadPrefs().weekends;
      weekendBtn.classList.toggle("active", next);
      weekendBtn.setAttribute("aria-pressed", String(next));
      weekendBtn.textContent = next ? "Reminders on" : "No weekend reminders";
      updatePrefs({ weekends: next });
    });

    var quietStart = $("#notifQuietStart");
    if (quietStart) quietStart.addEventListener("change", function () {
      if (isHHMM(quietStart.value)) updatePrefs({ quiet: { start: quietStart.value } });
    });
    var quietEnd = $("#notifQuietEnd");
    if (quietEnd) quietEnd.addEventListener("change", function () {
      if (isHHMM(quietEnd.value)) updatePrefs({ quiet: { end: quietEnd.value } });
    });

    var maxDaily = $("#notifMaxDaily");
    if (maxDaily) maxDaily.addEventListener("change", function () {
      updatePrefs({ maxDaily: parseInt(maxDaily.value, 10) || 2 });
    });

    var restoreBtn = $("#notifRestoreBtn");
    if (restoreBtn) restoreBtn.addEventListener("click", function () {
      restoreDefaults().then(rerender);
    });
  }

  /* ---------------- onboarding card (home) ---------------- */

  /* Shown at most once, only to students who haven't decided yet, and
     NEVER triggers the browser permission prompt by itself. */
  function maybeShowOnboardingCard(root) {
    try {
      if (!root || typeof document === "undefined") return false;
      if (!supported()) return false;
      if (permission() === "denied") return false;
      if (typeof STATE !== "undefined") {
        if (STATE.notificationsEnabled) return false;
        if (STATE.notificationsPromptDismissed) return false;
        if (!STATE.onboardedAt) return false;
      }
      if (document.getElementById("welcomeModalOverlay") || document.getElementById("classSelOverlay")) return false;
      if (document.getElementById("notifOnboardCard")) return false;
      var card = document.createElement("div");
      card.className = "card-solid notif-onboard";
      card.id = "notifOnboardCard";
      card.setAttribute("role", "region");
      card.setAttribute("aria-label", "Notification onboarding");
      card.innerHTML =
        '<div class="notif-onboard-head">' +
        '<span class="notif-onboard-icon" aria-hidden="true"><i data-lucide="bell-ring"></i></span>' +
        "<div>" +
        "<h3>Stay on Track with Accountancy</h3>" +
        "<p>Get optional reminders for revision, unfinished practice, your Mistake Book and your daily streak — delivered to this device even when the site is closed.</p>" +
        "</div></div>" +
        '<div class="notif-onboard-actions">' +
        '<button class="btn-primary sm ripple-surface" id="notifOnboardEnable" type="button"><i data-lucide="bell"></i> Enable Notifications</button>' +
        '<button class="btn-ghost sm ripple-surface" id="notifOnboardNotNow" type="button">Not Now</button>' +
        '<button class="btn-ghost sm ripple-surface" id="notifOnboardSettings" type="button"><i data-lucide="settings"></i> Notification Settings</button>' +
        "</div>" +
        '<p class="notif-onboard-fine">Nothing turns on until you press Enable. You choose what you get and when — pause or unsubscribe any time in Settings.</p>';
      /* Insert right after the greeting so it's seen without pushing
         the dashboard down the page. */
      if (root.children.length > 1) root.insertBefore(card, root.children[1]);
      else root.appendChild(card);
      try { window.lucide && window.lucide.createIcons && window.lucide.createIcons(); } catch (e) { /* icons are decorative */ }

      $("#notifOnboardEnable", card).addEventListener("click", function () {
        var btn = $("#notifOnboardEnable", card);
        btn.disabled = true;
        enable().then(function (res) {
          if (res && res.ok) card.remove();
          else btn.disabled = false;
        });
      });
      $("#notifOnboardNotNow", card).addEventListener("click", function () {
        if (typeof STATE !== "undefined") {
          STATE.notificationsPromptDismissed = true;
          try { saveState(); } catch (e) { /* page owns state */ }
        }
        card.remove();
      });
      $("#notifOnboardSettings", card).addEventListener("click", function () {
        if (typeof navigate === "function") navigate("settings");
      });
      return true;
    } catch (e) { return false; }
  }

  /* ---------------- boot ---------------- */

  function onBoot() {
    if (runtime.booted) return;
    runtime.booted = true;

    if (!runtime.visWired) {
      runtime.visWired = true;
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") flushSync();
      });
    }

    if (!supported()) {
      if (typeof STATE !== "undefined" && STATE.notificationsEnabled) {
        STATE.notificationsEnabled = false;
        try { saveState(); } catch (e) { /* page owns state */ }
      }
      return;
    }

    /* Learn the server's real configuration state on every load (one tiny
       no-store GET) so Settings can report "unconfigured"/"unreachable"
       honestly instead of sitting on "checking…". */
    fetchConfig();

    /* Reconcile honest state on every load: the browser is the source
       of truth about whether a subscription still exists. */
    getReg().then(function (reg) {
      return reg.pushManager.getSubscription();
    }).then(function (sub) {
      if (!sub) {
        if (runtime.subscribed || (typeof STATE !== "undefined" && STATE.notificationsEnabled)) {
          runtime.subscribed = false;
          runtime.serverSaved = false;
          if (typeof STATE !== "undefined") {
            STATE.notificationsEnabled = false;
            try { saveState(); } catch (e) { /* page owns state */ }
          }
          var prefs = loadPrefs();
          if (prefs.master) { prefs.master = false; savePrefs(prefs); }
        }
        return null;
      }
      runtime.subscribed = true;
      if (!loadPrefs().master) return null;
      /* A subscription exists and the student wants reminders — make
         sure the server still knows about it (cheap idempotent sync). */
      runtime.serverSaved = true;   // optimistic; syncNow verifies below
      return syncNow(true).then(function (r) {
        if (!r || !r.ok) runtime.serverSaved = false;
      });
    }).catch(function () { /* never break boot on push checks */ });
  }

  /* ---------------- public surface ---------------- */

  var ABAPush = {
    /* lifecycle */
    onBoot: onBoot,
    enable: enable,
    disable: disable,
    test: test,
    pause: pause,
    resume: resume,
    unsubscribeDevice: disable,
    forgetEverything: forgetEverything,
    restoreDefaults: restoreDefaults,
    updatePrefs: updatePrefs,
    syncNow: syncNow,
    /* activity hooks */
    noteActivity: noteActivity,
    noteXp: noteXp,
    noteMistakeReviewed: noteMistakeReviewed,
    /* page-open notifications */
    localFocusComplete: localFocusComplete,
    achievementUnlocked: achievementUnlocked,
    /* UI */
    renderSettingsHTML: renderSettingsHTML,
    wireSettings: wireSettings,
    maybeShowOnboardingCard: maybeShowOnboardingCard,
    /* state */
    status: status,
    isActive: active,
    loadPrefs: loadPrefs,
    /* pure core, exported for tests */
    core: {
      CATEGORIES: CATEGORIES,
      DEFAULT_PREFS: DEFAULT_PREFS,
      ENDPOINTS: ENDPOINTS,
      normalizePrefs: normalizePrefs,
      buildSnapshotCore: buildSnapshotCore,
      isoWeekKey: isoWeekKey,
      statusCopy: statusCopy
    }
  };

  /* Browser: publish the manager (classic script). Node: export the
     pure core so tests/push-notification-tests.js can exercise the
     exact logic the browser runs — DOM touchpoints stay unreachable. */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ABAPush.core;
  }
  if (typeof window !== "undefined" && window.document) {
    window.ABAPush = ABAPush;
  }
})();
