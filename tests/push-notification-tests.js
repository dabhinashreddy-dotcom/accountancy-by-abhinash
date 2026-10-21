/* ============================================================
   v87 suite — Web Push notification system
   Run from the site root:   node tests/push-notification-tests.js
   Node 18+, no packages (only the pure modules are required).
   Dev only — not loaded by the website.

   A. Scheduling engine (netlify/functions/lib/schedule.js):
      master/pause/quiet/days/weekends/time-window/budget gates,
      priority order, per-category data gates, weekly summary slot,
      exam-prep weekly slot, site-update broadcast, idempotency,
      timezone determinism, privacy-safe copy, local-only categories
      never scheduled by the server.
   B. Sanitisers: prefs/snapshot/timezone input can be hostile.
   C. Validation + rate-limit windows (lib/validate.js).
   D. Client core (push-manager.js): prefs normalisation, real-data
      snapshot building, ISO-week parity with the server, honest
      status copy.
   E. Static wiring: service worker push handler + route validation,
      index.html pins and script order, app.js delegation (no
      permission prompts left), Netlify config, no leaked secrets,
      docs present.
   ============================================================ */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) {
  if (cond) pass++;
  else { fail++; failures.push(name + (detail ? " — " + detail : "")); }
}
function eq(a, b, name) {
  const same = JSON.stringify(a) === JSON.stringify(b);
  ok(same, name, same ? "" : "expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
}
function section(t) { console.log("\n" + t); }
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");

const S = require(path.join(ROOT, "netlify/functions/lib/schedule.js"));
const V = require(path.join(ROOT, "netlify/functions/lib/validate.js"));
const PMC = require(path.join(ROOT, "push-manager.js"));

/* ---- fixtures ------------------------------------------------ */
const HOUR = 3600 * 1000, DAY = 86400 * 1000;
const TUE_1900 = new Date(Date.UTC(2026, 0, 6, 19, 0, 0));   // Tuesday, 19:00 UTC
const TUE_DATE = "2026-01-06";
const MON_1000 = new Date(Date.UTC(2026, 0, 5, 10, 0, 0));   // Monday, 10:00 UTC (weekly window)
const FRI_1900 = new Date(Date.UTC(2026, 0, 9, 19, 0, 0));   // Friday, 19:00 UTC
const THU_1900 = new Date(Date.UTC(2026, 0, 8, 19, 0, 0));   // Thursday, 19:00 UTC
const SAT_1900 = new Date(Date.UTC(2026, 0, 10, 19, 0, 0));  // Saturday, 19:00 UTC

function prefs(over) {
  const p = JSON.parse(JSON.stringify(S.DEFAULT_PREFS));
  p.master = true;      // engine tests assume the student opted in
  p.tz = "UTC";
  if (over) Object.keys(over).forEach(k => {
    if (k === "categories") Object.assign(p.categories, over.categories);
    else p[k] = over[k];
  });
  return p;
}
function snap(over) {
  const s = { streak: 0, activeToday: false, mistakeCount: 0, unfinished: null, lastStudiedAt: 0, week: null, appVersion: "" };
  if (over) Object.assign(s, over);
  return s;
}
function dec(now, p, s, sent, bc) {
  return S.decide(now, p, s, { sent: sent || {} }, bc || null);
}
const JOURNAL_UNFINISHED = { route: "#ch-jr", label: "Journal", at: 0 };

/* ============================================================
   A. SCHEDULING ENGINE
   ============================================================ */
section("A1. master switch, pause, base due case");

{
  const r = dec(TUE_1900, prefs({ master: false }), snap(), {});
  eq(r.send, null, "A1.1 master=false never sends");
  eq(r.reasons[0], "master-off", "A1.1 reason is master-off");

  const r2 = dec(TUE_1900, prefs({ pausedUntil: TUE_1900.getTime() + 1000 }), snap(), {});
  eq(r2.send, null, "A1.2 paused device never sends");
  ok(r2.reasons.indexOf("paused") !== -1, "A1.2 reason is paused");

  const r3 = dec(TUE_1900, prefs({ pausedUntil: TUE_1900.getTime() - 1000 }), snap(), {});
  ok(r3.send && r3.send.category === "daily-study", "A1.3 expired pause resumes sending");
}

section("A2. quiet hours (including the midnight wrap)");

{
  const r = dec(new Date(Date.UTC(2026, 0, 6, 23, 0, 0)), prefs(), snap(), {});
  eq(r.send, null, "A2.1 no send inside quiet hours");
  ok(r.reasons.indexOf("quiet-hours") !== -1, "A2.1 reason is quiet-hours");

  const q = { start: "22:00", end: "07:00" };
  ok(S.inQuietHours(23 * 60, q) === true, "A2.2 23:00 is quiet (wrap window)");
  ok(S.inQuietHours(3 * 60 + 30, q) === true, "A2.2 03:30 is quiet");
  ok(S.inQuietHours(6 * 60 + 59, q) === true, "A2.2 06:59 still quiet");
  ok(S.inQuietHours(7 * 60, q) === false, "A2.2 07:00 exactly is not quiet");
  ok(S.inQuietHours(21 * 60 + 59, q) === false, "A2.2 21:59 not quiet");
  ok(S.inQuietHours(12 * 60, q) === false, "A2.2 midday never quiet");
  ok(S.inQuietHours(23 * 60, { start: "22:00", end: "22:00" }) === false, "A2.2 equal start/end disables quiet hours");
  ok(S.inQuietHours(12 * 60, null) === false, "A2.2 missing quiet block is safe");
}

section("A3. preferred time, permitted days, weekend switch");

{
  const r = dec(new Date(Date.UTC(2026, 0, 6, 17, 0, 0)), prefs(), snap(), {});
  eq(r.send, null, "A3.1 nothing before the preferred time");
  ok(r.reasons.indexOf("before-preferred-time") !== -1, "A3.1 reason is before-preferred-time");

  const wdOnly = prefs({ days: [1, 2, 3, 4, 5] });
  const r2 = dec(SAT_1900, wdOnly, snap(), {});
  eq(r2.send, null, "A3.2 Saturday excluded by the day list never sends");
  ok(r2.reasons.indexOf("day-not-allowed") !== -1, "A3.2 reason is day-not-allowed");

  const r3 = dec(SAT_1900, prefs({ weekends: false }), snap(), {});
  eq(r3.send, null, "A3.3 weekends=false blocks Saturday even though days includes it");
  ok(r3.reasons.indexOf("day-not-allowed") !== -1, "A3.3 reason is day-not-allowed");

  const r4 = dec(new Date(Date.UTC(2026, 0, 11, 19, 0, 0)), prefs({ weekends: false }), snap(), {});
  eq(r4.send, null, "A3.3 weekends=false blocks Sunday too");
}

section("A4. per-day budget");

{
  const sent = {};
  sent["streak:" + TUE_DATE] = 1;
  sent["daily-study:" + TUE_DATE] = 1;
  const r = dec(TUE_1900, prefs({ maxDaily: 2 }), snap(), sent);
  eq(r.send, null, "A4.1 maxDaily=2 with two sent today stops the day");
  ok(r.reasons.indexOf("daily-budget-used") !== -1, "A4.1 reason is daily-budget-used");

  const r2 = dec(TUE_1900, prefs({ maxDaily: 3 }), snap({ activeToday: true, mistakeCount: 1 }), sent);
  ok(r2.send && r2.send.category === "mistake-book",
    "A4.2 maxDaily=3 leaves room for exactly one more", r2.send && r2.send.category);
}

section("A5. priority order, category data gates, idempotency keys");

{
  const richSnap = snap({
    streak: 5, activeToday: false, mistakeCount: 2,
    unfinished: { route: "#ch-jr", label: "Journal", at: TUE_1900.getTime() - 3 * HOUR },
    lastStudiedAt: TUE_1900.getTime() - 4 * DAY,
    week: { questions: 12, xp: 400, chaptersStudied: 3, mistakesReviewed: 2 }
  });
  const sent = {};

  const r1 = dec(TUE_1900, prefs({ maxDaily: 4 }), richSnap, sent);
  ok(r1.send && r1.send.category === "streak", "A5.1 streak outranks every other category");
  eq(r1.send.idempotencyKey, "streak:" + TUE_DATE, "A5.1 streak key is per-day");
  eq(r1.send.route, "#home", "A5.1 streak route is #home");
  eq(r1.send.tag, "aba-streak", "A5.1 tag is category-derived");
  ok(r1.send.timestamp === TUE_1900.getTime(), "A5.1 timestamp is the scheduler clock");
  sent[r1.send.idempotencyKey] = TUE_1900.getTime();

  const r2 = dec(TUE_1900, prefs({ maxDaily: 4 }), richSnap, sent);
  ok(r2.send && r2.send.category === "daily-study", "A5.2 daily-study follows streak");
  sent[r2.send.idempotencyKey] = TUE_1900.getTime();

  const r3 = dec(TUE_1900, prefs({ maxDaily: 4 }), richSnap, sent);
  ok(r3.send && r3.send.category === "unfinished-practice", "A5.3 unfinished practice next (3h old > 2h gate)");
  eq(r3.send.route, "#ch-jr", "A5.3 route comes from the real unfinished chapter");
  ok(r3.send.body.indexOf("Journal") !== -1, "A5.3 body names the real chapter");
  ok(Array.isArray(r3.send.extraKeys) && r3.send.extraKeys[0].key === "unfinished-practice:lastAt",
    "A5.3 records the cooldown key");
  sent[r3.send.idempotencyKey] = TUE_1900.getTime();
  (r3.send.extraKeys || []).forEach(k => { sent[k.key] = k.value; });

  const r4 = dec(TUE_1900, prefs({ maxDaily: 4 }), richSnap, sent);
  ok(r4.send && r4.send.category === "mistake-book", "A5.4 mistake-book next (real pending count)");
  ok(r4.send.extraKeys[0].key === "mistake-book:lastAt", "A5.4 records its cooldown key");
  eq(r4.send.route, "#mistake-book", "A5.4 route opens the Mistake Book");
  sent[r4.send.idempotencyKey] = TUE_1900.getTime();
  sent[r4.send.extraKeys[0].key] = TUE_1900.getTime();

  const r5 = dec(TUE_1900, prefs({ maxDaily: 4 }), richSnap, sent);
  eq(r5.send, null, "A5.5 budget (4) exhausted ends the day");
  ok(r5.reasons.indexOf("daily-budget-used") !== -1, "A5.5 reason is daily-budget-used");
}

{
  /* Gates that must SKIP a category, not invent a substitute. */
  const doneToday = {}; doneToday["daily-study:" + TUE_DATE] = 1;

  const g1 = dec(TUE_1900, prefs(), snap({ streak: 7, activeToday: true }), {});
  eq(g1.send, null, "A5.6 goal done today suppresses streak AND daily-study");
  ok(g1.reasons.indexOf("streak:goal-done") !== -1 && g1.reasons.indexOf("daily:goal-done") !== -1,
    "A5.6 both goal-done reasons are reported");

  const g2 = dec(TUE_1900, prefs(), snap({ unfinished: { route: "#ch-jr", label: "Journal", at: TUE_1900.getTime() - 30 * 60000 } }), doneToday);
  eq(g2.send, null, "A5.7 unfinished <2h old is skipped (student just left)");
  ok(g2.reasons.indexOf("unfinished:too-recent") !== -1, "A5.7 reason is unfinished:too-recent");

  const cool = { ["daily-study:" + TUE_DATE]: 1, "unfinished-practice:lastAt": TUE_1900.getTime() - 47 * HOUR };
  const g3 = dec(TUE_1900, prefs(), snap({ unfinished: { route: "#ch-jr", label: "Journal", at: TUE_1900.getTime() - 5 * HOUR } }), cool);
  eq(g3.send, null, "A5.8 unfinished inside its 48h cooldown is skipped");
  ok(g3.reasons.indexOf("unfinished:cooldown") !== -1, "A5.8 reason is unfinished:cooldown");

  const g4 = dec(TUE_1900, prefs(), snap({ unfinished: { route: "#ch-jr", label: "Journal", at: TUE_1900.getTime() - 5 * HOUR } }),
    { ["daily-study:" + TUE_DATE]: 1, "unfinished-practice:lastAt": TUE_1900.getTime() - 49 * HOUR });
  ok(g4.send && g4.send.category === "unfinished-practice", "A5.8b past the cooldown it sends again");

  const m1 = dec(TUE_1900, prefs(), snap({ activeToday: true, mistakeCount: 0 }), {});
  ok(m1.reasons.indexOf("mistakes:none") !== -1, "A5.9 zero pending mistakes skips the category");

  const m2 = dec(TUE_1900, prefs(), snap({ activeToday: true, mistakeCount: 2 }),
    { "mistake-book:lastAt": TUE_1900.getTime() - 71 * HOUR });
  eq(m2.send, null, "A5.10 mistake-book inside its 72h cooldown is skipped");
  ok(m2.reasons.indexOf("mistakes:cooldown") !== -1, "A5.10 reason is mistakes:cooldown");

  const v1 = dec(TUE_1900, prefs(), snap({ lastStudiedAt: 0 }), doneToday);
  ok(v1.reasons.indexOf("revision:never-studied") !== -1, "A5.11 never-studied skips revision");

  const v2 = dec(TUE_1900, prefs(), snap({ lastStudiedAt: TUE_1900.getTime() - 2 * DAY }), doneToday);
  ok(v2.reasons.indexOf("revision:recent") !== -1, "A5.12 revision only fires 3+ days after last study");

  const v3 = dec(TUE_1900, prefs({ maxDaily: 4 }), snap({ lastStudiedAt: TUE_1900.getTime() - 4 * DAY }), doneToday);
  ok(v3.send && v3.send.category === "revision", "A5.13 stale study sends a revision nudge");
  eq(v3.send.route, "#chapters-list", "A5.13 route opens the chapter list");
  ok(v3.send.extraKeys[0].key === "revision:lastAt", "A5.13 records its cooldown key");

  const e1 = dec(THU_1900, prefs(), snap({}), { "daily-study:2026-01-08": 1 });
  ok(e1.reasons.indexOf("exam:not-weekend") !== -1, "A5.14 exam-prep only fires Fri/Sat/Sun");
  eq(e1.send, null, "A5.14 nothing else due on Thursday");
}

section("A6. weekly summary slot");

{
  const week = { questions: 12, xp: 400, chaptersStudied: 3, mistakesReviewed: 2 };

  const r = dec(MON_1000, prefs(), snap({ streak: 5, activeToday: true, week }), {});
  ok(r.send && r.send.category === "weekly-summary", "A6.1 Monday 10:00 with real week data sends the summary");
  eq(r.send.idempotencyKey, "weekly-summary:2026-W02", "A6.1 key is one per ISO week");
  eq(r.send.route, "#performance", "A6.1 route opens the dashboard");
  eq(r.send.actions[0].url, "#performance", "A6.1 action opens the dashboard");

  const sent = {}; sent[r.send.idempotencyKey] = 1;
  const r2 = dec(MON_1000, prefs(), snap({ streak: 5, activeToday: true, week }), sent);
  eq(r2.send, null, "A6.2 a second run the same week never re-sends the summary");
  ok(r2.reasons.indexOf("weekly-already-sent") !== -1, "A6.2 reason is weekly-already-sent");

  ok(dec(new Date(Date.UTC(2026, 0, 6, 10, 0, 0)), prefs(), snap({ week }), {}).reasons.indexOf("weekly-not-monday") !== -1,
    "A6.3 summaries only go out on Monday");
  ok(dec(new Date(Date.UTC(2026, 0, 5, 13, 0, 0)), prefs(), snap({ week }), {}).reasons.indexOf("weekly-window") !== -1,
    "A6.4 outside the 09:00-12:00 local window nothing goes out");
  ok(dec(MON_1000, prefs(), snap({ week: null }), {}).reasons.indexOf("weekly-no-data") !== -1,
    "A6.5 no week data ever means no summary (no invented numbers)");
  ok(dec(MON_1000, prefs(), snap({ week: { questions: 0, xp: 0, chaptersStudied: 0, mistakesReviewed: 0 } }), {}).reasons.indexOf("weekly-empty-period") !== -1,
    "A6.6 an empty week is skipped, not summarised as activity");
  ok(dec(MON_1000, prefs({ quiet: { start: "09:00", end: "11:00" } }), snap({ week }), {}).reasons.indexOf("weekly-quiet") !== -1,
    "A6.7 quiet hours hold back the summary too");
  const off = dec(MON_1000, prefs({ categories: { "weekly-summary": false } }), snap({ week }), {});
  ok(off.reasons.every(x => x.indexOf("weekly") === -1), "A6.8 disabled category is not evaluated at all");

  /* v89 — consistent preference enforcement: the weekly digest now
     respects the day list and the per-day budget like everything else. */
  const rDays = dec(MON_1000, prefs({ days: [2, 3, 4] }), snap({ week }), {});
  ok(rDays.send === null && rDays.reasons.indexOf("weekly-day-not-allowed") !== -1,
    "A6.9 the weekly summary respects the student's day list (Monday not permitted → no digest)");
  /* probe Monday's routine key to learn the exact dateKey suffix */
  const probe = dec(MON_1000, prefs({ time: "09:00", categories: { "weekly-summary": false } }), snap({ streak: 5, activeToday: false, week }), {});
  ok(probe.send && probe.send.category === "streak", "A6.10 probe: a routine send exists on this Monday");
  const monSuffix = ":" + probe.send.idempotencyKey.split(":").slice(1).join(":");
  const usedUp = {}; usedUp["streak" + monSuffix] = MON_1000.getTime();
  const rBudget = dec(MON_1000, prefs({ maxDaily: 1 }), snap({ streak: 5, activeToday: true, week }), usedUp);
  ok(rBudget.send === null && rBudget.reasons.indexOf("weekly-budget-used") !== -1,
    "A6.11 the weekly summary counts against the per-day budget (budget exhausted → skipped, reported honestly)");
  const rBudgetLeft = dec(MON_1000, prefs({ maxDaily: 2 }), snap({ streak: 5, activeToday: true, week }), usedUp);
  ok(rBudgetLeft.send && rBudgetLeft.send.category === "weekly-summary",
    "A6.12 with budget remaining the digest still goes out in its window");
}

section("A7. site updates (broadcast) slot");

{
  const BC = { version: "v87", title: "Practice Sets Expanded", body: "Fresh GST practice questions just landed.", url: "ch-gst" };

  const r = dec(TUE_1900, prefs(), snap(), {}, BC);
  ok(r.send && r.send.category === "site-updates", "A7.1 an unseen broadcast reaches the device");
  eq(r.send.idempotencyKey, "site-updates:v87", "A7.1 one send per broadcast version");
  eq(r.send.route, "#ch-gst", "A7.1 broadcast route passes SAFE_ROUTES validation");
  eq(r.send.title, "Practice Sets Expanded", "A7.1 title comes from the admin record");

  const sent = { "site-updates:v87": 1 };
  const r2 = dec(TUE_1900, prefs(), snap(), sent, BC);
  ok(r2.send && r2.send.category === "daily-study", "A7.2 already-sent broadcast frees the run for routine work");
  ok(r2.reasons.indexOf("updates-already-sent") !== -1, "A7.2 reason is updates-already-sent");

  const off = dec(TUE_1900, prefs({ categories: { "site-updates": false } }), snap(), {}, BC);
  ok(off.send && off.send.category === "daily-study" && off.reasons.every(x => x.indexOf("updates") === -1),
    "A7.3 opt-out of site updates never evaluates the broadcast");

  const none = dec(TUE_1900, prefs(), snap(), {}, null);
  ok(none.send && none.send.category === "daily-study", "A7.4 no broadcast record behaves as normal");

  const wknd = dec(SAT_1900, prefs({ weekends: false }), snap(), {}, BC);
  eq(wknd.send, null, "A7.5 weekend opt-out holds back broadcasts as well");
  ok(wknd.reasons.indexOf("updates-day") !== -1, "A7.5 reason is updates-day");

  /* v89 — the DOCUMENTED operational exception, pinned as behaviour:
     a site update (rare, one per version) ignores the preferred time
     of day and the daily budget, but never quiet hours, master,
     pause, the toggle or the day list. */
  const busyLedger = {
    "daily-study:2026-01-06": 1, "streak:2026-01-06": 1,
    "unfinished-practice:2026-01-06": 1, "mistake-book:2026-01-06": 1
  };
  const noon = new Date(Date.UTC(2026, 0, 6, 12, 0, 0));   // before the 19:00 preferred time
  const exc = dec(noon, prefs({ time: "19:00", maxDaily: 1 }), snap(), busyLedger, BC);
  ok(exc.send && exc.send.category === "site-updates",
    "A7.6 documented exception: a site update ignores the preferred time AND the exhausted daily budget");
  const quietBC = dec(new Date(Date.UTC(2026, 0, 6, 23, 0, 0)), prefs(), snap(), {}, BC);
  ok(quietBC.send === null && quietBC.reasons.indexOf("updates-quiet") !== -1,
    "A7.7 the exception never extends to quiet hours (23:00 → updates-quiet)");
  const paused = dec(noon, prefs({ pausedUntil: noon.getTime() + 3600000 }), snap(), {}, BC);
  ok(paused.send === null && paused.reasons.indexOf("paused") !== -1,
    "A7.8 pause holds back broadcasts too");
}

section("A8. local-only categories and one-per-run invariant");

{
  ok(S.CATEGORIES.length === 10, "A8.1 ten categories exist");
  ok(S.SERVER_CATEGORIES.indexOf("focus") === -1 && S.SERVER_CATEGORIES.indexOf("achievements") === -1,
    "A8.2 focus/achievements are never server-scheduled");
  ok(S.DEFAULT_PREFS.categories.focus === true && S.DEFAULT_PREFS.categories.achievements === true,
    "A8.3 they still exist as preferences (page-open scope)");

  const r = dec(TUE_1900, prefs({ maxDaily: 4 }), snap({
    streak: 5, mistakeCount: 2,
    unfinished: { route: "#ch-jr", label: "Journal", at: 0 },
    lastStudiedAt: TUE_1900.getTime() - 4 * DAY,
    week: { questions: 12, xp: 400, chaptersStudied: 3, mistakesReviewed: 2 }
  }), {});
  ok(r.send && S.SERVER_CATEGORIES.indexOf(r.send.category) !== -1,
    "A8.4 a fully-due device still receives exactly one server category", r.send && r.send.category);
}

section("A9. double-run safety (simulated scheduler loop)");

{
  const sent = {};
  const cats = [], keys = [];
  for (let i = 0; i < 6; i++) {
    const r = dec(TUE_1900, prefs({ maxDaily: 4 }), snap({
      streak: 5, mistakeCount: 2,
      unfinished: { route: "#ch-jr", label: "Journal", at: TUE_1900.getTime() - 3 * HOUR },
      lastStudiedAt: TUE_1900.getTime() - 4 * DAY
    }), sent);
    if (r.send) {
      /* mirrors store.recordSent(): every key stamped with the run time */
      sent[r.send.idempotencyKey] = TUE_1900.getTime();
      (r.send.extraKeys || []).forEach(k => { sent[k.key] = k.value; });
      keys.push(r.send.idempotencyKey);
      cats.push(r.send.category);
    } else cats.push(null);
  }
  eq(cats, ["streak", "daily-study", "unfinished-practice", "mistake-book", null, null],
    "A9.1 six runs produce the priority chain then silence — never a duplicate");
  eq(new Set(keys).size, keys.length, "A9.2 every idempotency key is unique");
}

section("A10. timezone determinism (same instant, different students)");

{
  const NOW = new Date(Date.UTC(2026, 0, 5, 18, 30, 0));  // Monday 18:30 UTC = Tuesday 00:00 IST

  const utc = dec(NOW, prefs({ tz: "UTC" }), snap(), {});
  ok(utc.send && utc.send.category === "daily-study" && utc.send.idempotencyKey === "daily-study:2026-01-05",
    "A10.1 UTC student gets their Monday nudge");

  const ist = dec(NOW, prefs({ tz: "Asia/Kolkata" }), snap(), {});
  eq(ist.send, null, "A10.2 IST student is inside quiet hours at the same instant");
  ok(ist.reasons.indexOf("quiet-hours") !== -1, "A10.2 reason is quiet-hours");

  const pu = S.localParts(NOW, "UTC");
  eq([pu.hour, pu.dow, pu.dateKey], [18, 1, "2026-01-05"], "A10.3 localParts in UTC");
  const pi = S.localParts(NOW, "Asia/Kolkata");
  eq([pi.hour, pi.dow, pi.dateKey], [0, 2, "2026-01-06"], "A10.3 localParts in IST");
}

section("A11. streak edge cases and privacy-safe copy");

{
  /* 22:00+ suppresses the streak reminder (students are winding down);
     quiet hours normally own that window, so disable them here. */
  const late = prefs({ quiet: { start: "00:00", end: "00:00" } });
  const r = dec(new Date(Date.UTC(2026, 0, 6, 22, 30, 0)), late, snap({ streak: 3 }), {});
  ok(r.reasons.indexOf("streak:too-late") !== -1, "A11.1 no streak nudge after 22:00 local");
  ok(r.send && r.send.category === "daily-study", "A11.1 without quiet hours the daily slot may still fire");

  const cats = ["streak", "daily-study", "unfinished-practice", "mistake-book", "revision", "exam-prep", "weekly-summary"];
  cats.forEach(c => {
    const m = S.messageFor(c, snap({ unfinished: JOURNAL_UNFINISHED }));
    ok(!!m && !/\d/.test(m.title) && !/\d/.test(m.body),
      "A11.2 " + c + " copy contains no numbers (no invented stats)");
    ok(!!m && m.body.indexOf("undefined") === -1 && m.title.indexOf("undefined") === -1,
      "A11.2 " + c + " copy never leaks undefined fields");
  });
  ok(S.messageFor.length === 2, "A11.3 messageFor takes only (category, snapshot) — no student name");
  S.actionsFor("unfinished-practice").concat(S.actionsFor("mistake-book"), S.actionsFor("weekly-summary")).forEach(a => {
    ok(S.SAFE_ROUTES.indexOf(String(a.url).replace(/^#/, "")) !== -1,
      "A11.4 action route is on the safe list: " + a.url);
  });
}

/* ============================================================
   B. SANITISERS — hostile input can never widen behaviour
   ============================================================ */
section("B. sanitizePrefs / sanitizeSnapshot / helpers");

{
  const p = S.sanitizePrefs(null, "Asia/Kolkata");
  eq(p.tz, "Asia/Kolkata", "B1 missing prefs adopt the device timezone");
  eq(S.sanitizePrefs(null, "Mars/Olympus").tz, "UTC", "B1 invalid device timezone falls back to UTC");

  const q = S.sanitizePrefs({ master: "true", time: "9:05", days: [1, 1, 2, "x", 9], maxDaily: 0,
    quiet: { start: "25:00", end: "07:30" }, pausedUntil: -5, evil: "dropped" }, "UTC");
  eq(q.master, false, "B2 master accepts only literal true");
  eq(q.time, "09:05", "B2 time is normalised to zero-padded HH:MM");
  eq(q.days, [1, 1, 2], "B2 day list drops non-integers and out-of-range values");
  eq(q.maxDaily, 1, "B2 maxDaily clamps to the 1-4 band (0 → 1)");
  eq(q.quiet.start, "22:00", "B2 invalid quiet start keeps the default");
  eq(q.quiet.end, "07:30", "B2 valid quiet end is kept");
  eq(q.pausedUntil, null, "B2 negative pause is ignored");
  ok(q.evil === undefined, "B2 unknown fields are dropped");

  eq(S.sanitizePrefs({ time: "9:5" }, "UTC").time, "18:00", "B3 malformed time keeps the default");
  eq(S.sanitizePrefs({ time: "29:00" }, "UTC").time, "18:00", "B3 out-of-range hour keeps the default");
  /* v89 — explicit-empty semantics (was: "empty keeps all 7 days").
     An EXPLICIT empty list now means "no days selected": routine
     categories never fire (dayAllowed fails), and the endpoints reject
     it with 400 "no-days-selected" so the student is told. The client
     never sends one (normalizePrefs keeps the defaults/previous week),
     so only hand-crafted requests ever see this. */
  eq(S.sanitizePrefs({ days: [] }, "UTC").days.length, 0, "B3 an explicit empty day list means NO days (never a silent all-week)");
  eq(S.sanitizePrefs({ days: ["x", 9] }, "UTC").days.length, 0, "B3 a garbage-only day list also means no days (handlers reject it)");
  eq(V.prefsDaysError({ days: [] }), "no-days-selected", "B3 empty day lists carry a clear error code for handlers");
  eq(V.prefsDaysError({ days: [1, 3] }), null, "B3 valid day lists pass");
  eq(V.prefsDaysError({}), null, "B3 an absent days field means defaults apply (no error)");
  eq(V.prefsDaysError(undefined), null, "B3 absent prefs means defaults apply (no error)");
  eq(S.sanitizePrefs(undefined, "UTC").days.length, 7, "B3 absent prefs still default to the full week");
  eq(S.sanitizePrefs({ maxDaily: 99 }, "UTC").maxDaily, 4, "B3 maxDaily clamps high values to 4");
  eq(S.sanitizePrefs({ maxDaily: "abc" }, "UTC").maxDaily, 2, "B3 non-numeric maxDaily keeps the default");

  const s = S.sanitizeSnapshot({ streak: 99999, activeToday: 1, mistakeCount: -7,
    unfinished: { route: "evil://x", label: "x".repeat(90), at: "zz" },
    lastStudiedAt: -1, week: { questions: -5, xp: "20", chaptersStudied: 2.6, mistakesReviewed: null } });
  eq(s.streak, 3650, "B4 streak clamps to a sane ceiling");
  eq(s.activeToday, false, "B4 activeToday accepts only boolean true");
  eq(s.mistakeCount, 0, "B4 negative mistake counts become zero");
  eq(s.unfinished.route, "#home", "B4 unknown unfinished routes open #home");
  ok(s.unfinished.label.length === 60, "B4 unfinished label is capped at 60 chars");
  eq(s.unfinished.at, 0, "B4 non-numeric timestamps become 0 (no gate, no invention)");
  eq(s.lastStudiedAt, 0, "B4 negative lastStudiedAt becomes 0");
  eq(s.week, { questions: 0, xp: 0, chaptersStudied: 3, mistakesReviewed: 0 }, "B4 week numbers clamp to finite non-negative");

  const g = S.sanitizeSnapshot("garbage");
  eq(g, { streak: 0, activeToday: false, mistakeCount: 0, unfinished: null, lastStudiedAt: 0, week: null, appVersion: "" },
    "B5 non-object snapshots become all-defaults");

  eq(S.safeUrl("ch-jr"), "#ch-jr", "B6 safeUrl keeps a known route");
  eq(S.safeUrl("#ch-jr"), "#ch-jr", "B6 safeUrl accepts an already-hashed route");
  eq(S.safeUrl("ch-jr?tab=x"), "#ch-jr", "B6 safeUrl strips query strings");
  eq(S.safeUrl("nope"), "#home", "B6 safeUrl rejects unknown routes");
  eq(S.safeUrl("javascript:alert(1)"), "#home", "B6 safeUrl rejects non-route schemes");

  eq(S.toMinutes("07:00"), 420, "B7 toMinutes parses HH:MM");
  eq(S.toMinutes("7:5"), null, "B7 toMinutes rejects malformed input");
  ok(S.isValidTz("Asia/Kolkata") === true && S.isValidTz("Mars/Olympus") === false && S.isValidTz("") === false,
    "B8 timezone validation uses the real Intl database");

  ok(S.dayAllowed(1, { days: [1, 2, 3], weekends: true }) === true, "B9 listed weekday is allowed");
  ok(S.dayAllowed(4, { days: [1, 2, 3], weekends: true }) === false, "B9 unlisted weekday is blocked");
  ok(S.dayAllowed(0, { days: [0, 6], weekends: false }) === false, "B9 weekends=false blocks Sunday even when listed");

  eq(S.isoWeekKey(new Date(Date.UTC(2026, 0, 6, 12)), "UTC"), "2026-W02", "B10 isoWeekKey: mid-week Tuesday");
  eq(S.isoWeekKey(new Date(Date.UTC(2025, 11, 29, 12)), "UTC"), "2026-W01", "B10 isoWeekKey: Dec 29 belongs to 2026 week 1");
  const wk = ["2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-18"]
    .map(d => S.isoWeekKey(new Date(d + "T12:00:00Z"), "UTC"));
  eq([...new Set(wk)], ["2026-W42"], "B10 every day of one ISO week shares its key");
  eq(S.isoWeekKey(new Date("2026-10-19T12:00:00Z"), "UTC"), "2026-W43", "B10 the next Monday starts a new week");
}

/* ============================================================
   C. VALIDATION + RATE LIMITS
   ============================================================ */
section("C. validate.js");

{
  const uuid = "3f2c9e10-1234-4abc-8def-567890abcdef";
  ok(V.isDeviceId(uuid) === true, "C1 a real v4 UUID is accepted");
  ok(V.isDeviceId(uuid.toUpperCase()) === true, "C1 UUIDs are case-insensitive");
  ok(V.isDeviceId("not-a-uuid") === false, "C1 garbage device ids are rejected");
  ok(V.isDeviceId("3f2c9e1012344abcdef567890abcdef") === false, "C1 unhyphenated ids are rejected");
  ok(V.isDeviceId("3f2c9e10-1234-6abc-8def-567890abcdef") === false, "C1 unknown UUID versions are rejected");
  ok(V.isDeviceId(42) === false && V.isDeviceId(null) === false, "C1 non-strings are rejected");

  /* v89 — SSRF hardening: endpoints are allowlisted to real push
     services. Exact-host and dot-boundary-suffix rules only. */
  ok(V.isEndpoint("https://fcm.googleapis.com/fcm/send/abc") === true, "C2 FCM endpoints are accepted");
  ok(V.isEndpoint("https://updates.push.services.mozilla.com/wpush/v2/gAAAA") === true, "C2 Mozilla endpoints are accepted");
  ok(V.isEndpoint("https://api.push.apple.com/3/device/abc") === true, "C2 Apple production endpoints are accepted");
  ok(V.isEndpoint("https://db3.notify.windows.com/api/warp/abc") === true, "C2 WNS subdomain endpoints are accepted (dot-boundary suffix)");
  ok(V.isEndpoint("http://example.com/push") === false, "C2 plain http is rejected");
  ok(V.isEndpoint("javascript:alert(1)") === false, "C2 javascript: URLs are rejected");
  ok(V.isEndpoint("ftp://example.com") === false, "C2 non-http(s) schemes are rejected");
  ok(V.isEndpoint("https://" + "a".repeat(600)) === false, "C2 absurdly long endpoints are rejected");
  ok(V.isEndpoint("not a url") === false && V.isEndpoint(7) === false, "C2 malformed values are rejected");
  ok(V.isEndpoint("https://127.0.0.1:8443/push") === false, "C2 loopback IP literals are rejected (no internal relay)");
  ok(V.isEndpoint("https://169.254.169.254/latest/meta-data") === false, "C2 cloud metadata IPs are rejected");
  ok(V.isEndpoint("https://10.0.0.5/push") === false && V.isEndpoint("https://192.168.1.7/push") === false,
    "C2 private-range IPv4 literals are rejected");
  ok(V.isEndpoint("https://[::1]/push") === false && V.isEndpoint("https://[fd00::1]/push") === false,
    "C2 IPv6 literals are rejected");
  ok(V.isEndpoint("https://localhost/push") === false && V.isEndpoint("https://internal.corp/push") === false,
    "C2 non-allowlisted hostnames are rejected");
  ok(V.isEndpoint("https://fcm.googleapis.com.evil.example/fcm") === false,
    "C2 suffix-confusion hosts are rejected (dot boundary, not endsWith)");
  ok(V.isEndpoint("https://xfcm.googleapis.com/fcm") === false, "C2 host-prefix lookalikes are rejected (exact match only)");
  ok(V.isEndpoint("https://db3.notify.windows.com.evil.example/x") === false,
    "C2 WNS suffix confusion is rejected");
  ok(V.isEndpoint("https://fcm.googleapis.com:8443/fcm") === false, "C2 non-443 ports are rejected");
  ok(V.isEndpoint("https://user:pass@fcm.googleapis.com/fcm") === false, "C2 credentials in the URL are rejected");
  ok(V.isEndpoint("https://fcm.googleapis.com./fcm") === false, "C2 trailing-dot host bypass is rejected");
  /* Backslash trick: the WHATWG URL parser normalises \ to / inside
     https URLs, so the host can never be redirected off the
     allowlisted service — assert the neutralisation itself. */
  eq(new URL("https://fcm.googleapis.com\\@evil.example/fcm").hostname, "fcm.googleapis.com",
    "C2 backslash obfuscation cannot change the host (normalised to a path)");

  const goodSub = {
    endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
    keys: { p256dh: "B".repeat(87), auth: "A".repeat(43) }
  };
  ok(V.isSubscription(goodSub) === true, "C3 a full browser subscription is accepted");
  ok(V.isSubscription({ endpoint: goodSub.endpoint, keys: { p256dh: goodSub.keys.p256dh } }) === false,
    "C3 missing auth secret is rejected");
  ok(V.isSubscription({ endpoint: goodSub.endpoint, keys: { p256dh: "b=".repeat(20), auth: goodSub.keys.auth } }) === false,
    "C3 padded/invalid base64url keys are rejected");
  ok(V.isSubscription({ endpoint: "http://x", keys: goodSub.keys }) === false,
    "C3 http endpoint anywhere is rejected");
  ok(V.isSubscription(null) === false && V.isSubscription("x") === false, "C3 non-objects are rejected");

  ok(V.bodyTooLarge("a".repeat(8 * 1024)) === false, "C4 an 8KB body is allowed");
  ok(V.bodyTooLarge("a".repeat(8 * 1024 + 1)) === true, "C4 beyond 8KB is refused");
  eq(V.parseJson("{"), null, "C4 malformed JSON returns null");
  eq(V.parseJson("42"), null, "C4 non-object JSON returns null");
  ok(typeof V.parseJson("{\"a\":1}") === "object", "C4 valid JSON parses");

  ok(V.rateAllows("test", 4) === true && V.rateAllows("test", 5) === false, "C5 test pushes cap at 5/hour");
  ok(V.rateAllows("subscribe", 11) === true && V.rateAllows("subscribe", 12) === false, "C5 subscribes cap at 12/hour");
  ok(V.rateAllows("sync", 119) === true && V.rateAllows("sync", 120) === false, "C5 syncs cap at 120/hour");
  ok(V.rateAllows("unknown-action", 9999) === true, "C5 unknown actions are not rate-limited (fail open by design)");
  const b = V.rateBucket("test", new Date(1000 * 3600 * 5));
  eq(b, 5, "C5 buckets are whole windows");
  eq(V.rateKey("dev1", "test", 5), "rl:test:dev1:5", "C5 rate keys are namespaced per action/device/window");
}

/* ============================================================
   D. CLIENT CORE (push-manager.js pure helpers)
   ============================================================ */
section("D. push-manager core");

{
  const d = PMC.normalizePrefs(null);
  eq(d.time, "18:00", "D1 default time survives missing storage");
  eq(d.days.length, 7, "D1 all seven days default on");
  eq(d.maxDaily, 2, "D1 default daily budget is 2");
  ok(typeof d.tz === "string" && d.tz.length > 0, "D1 timezone falls back to the device zone");
  eq(Object.keys(d.categories).length, 10, "D1 all ten categories exist locally");

  const p = PMC.normalizePrefs({ master: true, categories: { streak: false, focus: false }, time: "07:30",
    days: [3], weekends: false, quiet: { start: "21:15", end: "06:40" }, maxDaily: 4 });
  eq(p.master, true, "D2 master persists");
  eq(p.categories.streak, false, "D2 individual category toggles persist");
  eq(p.categories.focus, false, "D2 the local focus category toggles too");
  eq(p.categories["daily-study"], true, "D2 untouched categories keep their default");
  eq(p.time, "07:30", "D2 custom time persists");
  eq(p.days, [3], "D2 day list persists");
  eq(p.weekends, false, "D2 weekend switch persists");
  eq(p.quiet, { start: "21:15", end: "06:40" }, "D2 quiet window persists");
  eq(p.maxDaily, 4, "D2 maxDaily persists");

  const c = PMC.normalizePrefs({ time: "99:99", quiet: { start: "nope" }, days: [9, "x"], maxDaily: "x" });
  eq(c.time, "18:00", "D3 out-of-range times are discarded");
  eq(c.quiet.start, "22:00", "D3 malformed quiet times are discarded");
  eq(c.days.length, 7, "D3 out-of-range days are discarded");
  eq(c.maxDaily, 2, "D3 non-numeric maxDaily is discarded");

  const today = new Date();
  const nowMs = today.getTime();
  const s1 = PMC.buildSnapshotCore({ streak: 4, activityLog: [{ at: nowMs }], mistakeCount: 2,
    unfinished: { route: "#ch-jr", label: "Journal", at: 0 },
    week: { questions: 5, xp: 120 } });
  eq(s1.activeToday, true, "D4 activity today is derived from the real activity log");
  eq(s1.streak, 4, "D4 streak passes through");
  eq(s1.unfinished.at, nowMs, "D4 unfinished 'at' falls back to the newest real activity");
  eq(s1.week, { questions: 5, xp: 120, chaptersStudied: 0, mistakesReviewed: 0 }, "D4 week counters coerce cleanly");

  const s2 = PMC.buildSnapshotCore({ streak: 0, activityLog: [{ at: nowMs - 25 * HOUR }], lastStudiedAt: nowMs - 3 * DAY });
  eq(s2.activeToday, false, "D4 yesterday's activity is not 'today' (no fake goal state)");
  eq(s2.lastStudiedAt, nowMs - 3 * DAY, "D4 lastStudiedAt passes through");

  const s3 = PMC.buildSnapshotCore({ streak: -1, activityLog: "junk", mistakeCount: "x" });
  eq(s3.streak, 0, "D4 negative streaks become 0");
  eq(s3.activeToday, false, "D4 a missing activity log means nothing was done");
  eq(s3.week, null, "D4 no week counters means no summary data");

  const dates = [new Date(Date.UTC(2026, 0, 1, 12)), new Date(Date.UTC(2026, 0, 5, 12)),
    new Date(Date.UTC(2026, 0, 6, 12)), new Date(Date.UTC(2026, 9, 18, 12)), new Date(Date.UTC(2025, 11, 29, 12))];
  dates.forEach(dt => {
    eq(PMC.isoWeekKey(dt, "UTC"), S.isoWeekKey(dt, "UTC"),
      "D5 client/server ISO-week parity for " + dt.toISOString().slice(0, 10));
  });

  const pmIds = PMC.CATEGORIES.map(c => c.id).sort().join(",");
  eq(pmIds, [...S.CATEGORIES].sort().join(","), "D6 client and server agree on the ten category ids");
  ok(PMC.CATEGORIES.length === 10 && PMC.CATEGORIES.every(c => c.id && c.name && c.desc),
    "D6 ten client category definitions, each named and described");
  ok(PMC.CATEGORIES.filter(c => c.scope === "local").map(c => c.id).sort().join(",") === "achievements,focus",
    "D6 focus/achievements are the page-open categories on the client too");

  const sc = (over) => PMC.statusCopy(Object.assign(
    { supported: true, permission: "default", configured: null, master: false, subscribed: false,
      serverSaved: false, paused: false, active: false }, over));
  ok(sc({ supported: false }).text.indexOf("Home Screen") !== -1, "D7 unsupported copy names the iOS Home Screen path");
  ok(sc({ permission: "denied" }).text.indexOf("Allow") !== -1, "D7 denied copy explains re-enabling");
  ok(sc({ configured: false }).text.indexOf("isn't configured") !== -1, "D7 unconfigured server is stated plainly");
  ok(sc({ configured: null, configChecked: true }).text.indexOf("Couldn't reach") !== -1,
    "D7 a failed server check says so instead of claiming 'checking…' forever");
  ok(sc({ configured: null, configChecked: false }).text.indexOf("Checking") !== -1,
    "D7 only a genuinely pending check says 'checking…'");
  ok(sc({ configured: true, active: true }).text.indexOf("even when the site is closed") !== -1, "D7 active copy states real delivery");
  ok(sc({ configured: true, paused: true }).text.indexOf("Paused") !== -1, "D7 paused copy names the paused state");
  ok(sc({ configured: true, permission: "granted" }).text.indexOf("Enable") !== -1, "D7 granted-but-off copy asks to enable");
  ok(sc({ configured: true }).tone === "info" && sc({ configured: true }).text.indexOf("off") !== -1, "D7 default copy says reminders are off");

  Object.keys(PMC.ENDPOINTS).forEach(k => {
    const fn = "netlify/functions/" + PMC.ENDPOINTS[k].split("/").pop() + ".js";
    ok(fs.existsSync(path.join(ROOT, fn)), "D8 endpoint maps to a deployed function: " + fn);
  });
}

/* ============================================================
   E. STATIC WIRING
   ============================================================ */
section("E. static wiring (sw / html / app / netlify / docs / secrets)");

const sw = read("sw.js");
const indexHtml = read("index.html");
const app = read("app.js");
const pmSrc = read("push-manager.js");
const netlifyToml = read("netlify.toml");
const pkg = read("package.json");

{
  /* service worker */
  ok(/self\.addEventListener\("push"/.test(sw), "E1 the service worker has a push handler");
  ok(/aba-cache-v(\d+)/.test(sw) && Number(/aba-cache-v(\d+)/.exec(sw)[1]) >= 48, "E1 cache bumped to v48+");
  const shellList = (sw.match(/const APP_SHELL = \[([\s\S]*?)\];/) || [])[1] || "";
  ok(shellList.indexOf("./push-manager.js") !== -1, "E1 push-manager.js is precached with the shell");
  ok(/pathname\.startsWith\("\/\.netlify\/"\)/.test(sw), "E1 the fetch handler never caches backend functions");
  ok(/event\.action/.test(sw) && /actionUrls/.test(sw), "E1 notification action buttons resolve per-button URLs");
  ok(/SAFE_ROUTES/.test(sw) && /safeRouteUrl\(raw\)/.test(sw), "E1 click destinations are re-validated against SAFE_ROUTES");

  const swRoutes = ((sw.match(/const SAFE_ROUTES = \[([\s\S]*?)\];/) || [])[1].match(/"([^"]+)"/g) || []).map(x => x.slice(1, -1));
  const missingInSw = S.SAFE_ROUTES.filter(r => swRoutes.indexOf(r) === -1);
  eq(missingInSw, [], "E2 the SW route allowlist mirrors the server's SAFE_ROUTES exactly");

  /* index.html */
  const pmIdx = indexHtml.indexOf("push-manager.js?v=");
  const appIdx = indexHtml.indexOf("app.js?v=");
  ok(pmIdx !== -1 && pmIdx < appIdx, "E3 index.html loads push-manager.js before app.js (versioned)");
  ok(Number(/app\.js\?v=(\d+)/.exec(indexHtml)[1]) >= 65, "E3 app.js pin at v65+");
  ok(Number(/styles\.css\?v=(\d+)/.exec(indexHtml)[1]) >= 49, "E3 styles.css pin at v49+");
  ok(!/requestPermission/.test(indexHtml), "E3 the browser prompt is never triggered from HTML");

  /* app.js delegation */
  ok(!/requestPermission/.test(app), "E4 app.js contains no permission requests (single owner: push-manager.js)");
  ok((pmSrc.match(/requestPermission/g) || []).length === 1, "E4 push-manager.js contains exactly one requestPermission call");
  ok(/function enable\(\)[\s\S]{0,2500}requestPermission/.test(pmSrc), "E4 that call lives inside enable() (student-initiated only)");
  const cardSlice = pmSrc.slice(pmSrc.indexOf("function maybeShowOnboardingCard"), pmSrc.indexOf("function onBoot"));
  ok(cardSlice.length > 0 && cardSlice.indexOf("requestPermission") === -1,
    "E4 the onboarding card itself never triggers the prompt");
  ok(/maybeShowOnboardingCard\(root\)/.test(app), "E4 the home route offers the onboarding card");
  ok(/ABAPush\.renderSettingsHTML\(\)/.test(app) && /ABAPush\.wireSettings\(refreshNotifUI\)/.test(app),
    "E4 Settings renders and wires through the push manager");
  ok(/ABAPush\.forgetEverything\(\)/.test(app), "E4 full data reset drops the anonymous device identity");
  ok(/ABAPush\.onBoot\(\)/.test(app), "E4 boot reconciles push state honestly");
  ok(/ABAPush\.noteActivity\(entry\)/.test(app), "E4 activity hook feeds the weekly counters");
  ok(/ABAPush\.noteXp\(amount\)/.test(app), "E4 XP hook feeds the weekly counters");
  ok(/ABAPush\.achievementUnlocked\(earned\)/.test(app), "E4 achievement hook (page-open, category-gated)");
  ok(/ABAPush\.localFocusComplete\(\)/.test(app), "E4 Pomodoro hook (page-open, category-gated)");
  ok(/ABAPush\.noteMistakeReviewed\(\)/.test(app), "E4 mistake-review hook feeds the weekly counters");
  ok(/ABAPush\.isActive\(\)/.test(app), "E4 the local fallback timer stands down when server push is active");
  ok(!/showNotifStep|wmEnableNotifBtn/.test(app), "E4 the welcome modal no longer asks for notification permission");
  ok(!/aba_device/.test(app), "E4 the device identity stays outside STATE (never exported)");

  /* push-manager copy */
  ok(cardSlice.indexOf("Stay on Track with Accountancy") !== -1, "E5 the card uses the specified headline");
  ok(cardSlice.indexOf("Enable Notifications") !== -1 && cardSlice.indexOf("Not Now") !== -1 &&
     cardSlice.indexOf("Notification Settings") !== -1, "E5 the card offers Enable / Not Now / Notification Settings");
  ok(pmSrc.indexOf("while the site is open") !== -1, "E5 local categories are honestly labelled in Settings");
  ok(pmSrc.indexOf("Pause reminders") !== -1 && pmSrc.indexOf("Resume reminders") !== -1, "E5 pause/resume controls exist");
  ok(pmSrc.indexOf("Unsubscribe this device") !== -1, "E5 unsubscribe control exists");
  ok(pmSrc.indexOf("Restore default preferences") !== -1, "E5 restore-defaults control exists");
  ok(pmSrc.indexOf("Send test notification") !== -1, "E5 server test control exists");
  ok(pmSrc.indexOf("notifQuietStart") !== -1 && pmSrc.indexOf("notifQuietEnd") !== -1, "E5 quiet-hours inputs exist");
  ok(pmSrc.indexOf("notifMaxDaily") !== -1 && /\[1, 2, 3, 4\]\.map/.test(pmSrc), "E5 max-per-day control offers 1-4 (matching the server band)");
  ok(/function onBoot\(\)[\s\S]{0,1600}fetchConfig\(\)/.test(pmSrc), "E5 boot checks the server config so the status is honest from the start");

  /* netlify + functions */
  ok(/functions = "netlify\/functions"/.test(netlifyToml), "E6 netlify.toml points at the functions dir");
  ok(/NODE_VERSION = "22"/.test(netlifyToml), "E6 Node 22 is pinned for @netlify/blobs");
  ok(!/schedule\s*=/.test(netlifyToml), "E6 netlify.toml has no duplicate schedule (single source of truth in the function)");
  ["push-config", "push-subscribe", "push-unsubscribe", "push-sync", "push-test", "push-broadcast"]
    .forEach(fn => ok(fs.existsSync(path.join(ROOT, "netlify/functions/" + fn + ".js")),
      "E6 function exists: " + fn));
  ok(fs.existsSync(path.join(ROOT, "netlify/functions/push-scheduler.mjs")), "E6 function exists: push-scheduler.mjs");
  ok(!fs.existsSync(path.join(ROOT, "netlify/functions/push-scheduler.js")), "E6 no duplicate legacy push-scheduler.js");
  ["schedule", "validate", "store", "vapid", "http", "run-scheduler"].forEach(lib =>
    ok(fs.existsSync(path.join(ROOT, "netlify/functions/lib/" + lib + ".js")), "E6 lib exists: lib/" + lib + ".js"));

  const schedWrap = read("netlify/functions/push-scheduler.mjs");
  ok(/export const config = \{ schedule: "\*\/15 \* \* \* \*" \}/.test(schedWrap), "E7 the scheduler declares its 15-minute schedule in code");
  ok(/export default async/.test(schedWrap), "E7 the scheduler uses the modern function format (Blobs auto-configured)");
  const sched = read("netlify/functions/lib/run-scheduler.js");
  /* v89 — the delivery pipeline is claim → send → confirm/retry. A
     key enters the confirmed ledger only AFTER the push service
     accepted the send; failures back off and retry, never "sent". */
  const claimIdx = sched.indexOf("await deps.store.claimSend(");
  const sendIdx = sched.indexOf("await deps.sendPush(rec");
  const confirmIdx = sched.indexOf("await deps.store.confirmSent(");
  ok(claimIdx !== -1 && sendIdx !== -1 && claimIdx < sendIdx,
    "E7 the idempotency key is CLAIMED before the send (concurrency guard)");
  ok(confirmIdx !== -1 && sendIdx < confirmIdx,
    "E7 the confirmed ledger is written only AFTER the push service accepted the send");
  ok(sched.indexOf("scheduleRetry(") !== -1 && /summary\.retried|summary\.gaveUp/.test(sched),
    "E7 transient failures schedule a retry and are never recorded as sent");
  ok(/V\.isEndpoint\(rec\.endpoint\)/.test(sched),
    "E7 the stored endpoint is re-validated against the allowlist before any outbound request");
  ok(/catch \(e\)/.test(sched), "E7 per-device failures cannot abort the run");

  const testFn = read("netlify/functions/push-test.js");
  ok(/web-push|sendPush/.test(testFn) && /sendPush\(/.test(testFn),
    "E8 the test endpoint is a genuine server push, not a local echo");
  const subFn = read("netlify/functions/push-subscribe.js");
  ok(!/json\(200, \{[^}]*endpoint/s.test(subFn), "E8 subscription responses never echo the endpoint");

  /* package + docs */
  ok(pkg.indexOf("push-notification-tests.js") !== -1, "E9 the test chain runs this suite");
  ok(/"web-push"/.test(pkg) && /"@netlify\/blobs"/.test(pkg), "E9 runtime dependencies are declared");
  const setup = read("PUSH-NOTIFICATIONS-SETUP.md");
  ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT", "ADMIN_TOKEN", "push-broadcast", "Home Screen", "Blobs"]
    .forEach(tok => ok(setup.indexOf(tok) !== -1, "E10 setup guide covers " + tok));
  ok(/Web Push/.test(read("NOTIFICATIONS.md")), "E11 NOTIFICATIONS.md describes the real Web Push system");
  ok(fs.existsSync(path.join(ROOT, "docs/PUSH-DELIVERY-REPORT-v87.md")), "E12 the v87 delivery report exists");
}

{
  /* secrets hygiene: no VAPID key material may exist anywhere in the repo */
  const walk = (dir, out) => {
    fs.readdirSync(dir).forEach(name => {
      if (name === "node_modules" || name === ".git") return;
      const full = path.join(dir, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full, out);
      else if (/\.(js|json|html|css|md|toml|yml|yaml|txt)$/.test(name)) out.push(full);
    });
    return out;
  };
  const files = walk(ROOT, []).filter(f => f.indexOf(path.join(ROOT, "tests")) !== 0);
  const keyRe = /(VAPID_PRIVATE_KEY|VAPID_PUBLIC_KEY)\s*[=:]\s*["'][A-Za-z0-9_-]{30,}["']/;
  const pemRe = /BEGIN [A-Z ]*PRIVATE KEY/;
  const leaks = files.filter(f => {
    const src = fs.readFileSync(f, "utf8");
    return keyRe.test(src) || pemRe.test(src);
  });
  eq(leaks.map(f => path.relative(ROOT, f)), [], "E13 no VAPID key material is committed anywhere");
}


/* ============================================================
   F. v88 — backend defects found by inspecting the real source.
   (Pure/mocked: nothing here talks to Netlify or a push service.)
   ============================================================ */
section("F. v88 backend: Blobs connection, VAPID validation, status endpoint, scheduler core");

const crypto = require("crypto");
const wpkg = require(path.join(ROOT, "node_modules/web-push"));
const VP = require(path.join(ROOT, "netlify/functions/lib/vapid.js"));
const ST = require(path.join(ROOT, "netlify/functions/lib/store.js"));
const RS = require(path.join(ROOT, "netlify/functions/lib/run-scheduler.js"));

/* F1 — every classic-format function must call store.connect(event)
   before touching storage (the cause of silent Blobs failures). */
["push-subscribe", "push-sync", "push-unsubscribe", "push-test", "push-broadcast", "push-config"].forEach(fn => {
  const src = read("netlify/functions/" + fn + ".js");
  const h = src.indexOf("exports.handler");
  const c = src.indexOf("store.connect(event)");
  ok(h !== -1 && c > h && c - h < 140, "F1 " + fn + " calls store.connect(event) first thing in the handler");
});
{
  const storeSrc = read("netlify/functions/lib/store.js");
  ok(/connectLambda/.test(storeSrc), "F1 store.js uses @netlify/blobs connectLambda");
  ok(!/\blet cached\b|\bcached =/.test(storeSrc), "F1 the Blobs store object is not cached across invocations");
}

/* F2 — VAPID validation with a REAL generated pair (generated in-memory
   by web-push for the test; never written to disk). */
{
  const pair = wpkg.generateVAPIDKeys();
  const good = { VAPID_PUBLIC_KEY: pair.publicKey, VAPID_PRIVATE_KEY: pair.privateKey, VAPID_SUBJECT: "mailto:owner@example.com" };
  ok(VP.vapidStatus(good).ok === true, "F2 a genuine matching pair + mailto subject validates");
  ok(VP.vapidStatus(Object.assign({}, good, { VAPID_SUBJECT: "https://example.com" })).ok === true, "F2 https subject validates");
  ok(VP.vapidStatus({}).ok === false && VP.vapidStatus({}).missing.length === 3, "F2 nothing set → all three reported missing by name");
  eq(VP.vapidStatus(Object.assign({}, good, { VAPID_PRIVATE_KEY: "" })).missing, ["VAPID_PRIVATE_KEY"], "F2 only the missing variable is named");
  ok(VP.vapidStatus(Object.assign({}, good, { VAPID_SUBJECT: "owner@example.com" })).problems.some(p => p.variable === "VAPID_SUBJECT"),
    "F2 a subject without mailto:/https: is rejected");
  ok(VP.vapidStatus(Object.assign({}, good, { VAPID_PUBLIC_KEY: "abc" })).problems.some(p => p.code === "wrong-length"), "F2 a truncated public key is rejected");
  ok(VP.vapidStatus(Object.assign({}, good, { VAPID_PRIVATE_KEY: "not base64url!!" })).problems.some(p => p.code === "not-base64url"), "F2 a non-base64url private key is rejected");
  const other = wpkg.generateVAPIDKeys();
  ok(VP.vapidStatus(Object.assign({}, good, { VAPID_PUBLIC_KEY: other.publicKey })).problems.some(p => p.code === "does-not-match-private-key"),
    "F2 a public key that does not match the private key is rejected");
  const wrapped = { VAPID_PUBLIC_KEY: '  "' + pair.publicKey + '"\n', VAPID_PRIVATE_KEY: " " + pair.privateKey + " ", VAPID_SUBJECT: " mailto:owner@example.com " };
  ok(VP.vapidStatus(wrapped).ok === true, "F2 pasted quotes / spaces / newlines are cleaned, not fatal");
  const leak = JSON.stringify(VP.vapidStatus(Object.assign({}, good, { VAPID_PUBLIC_KEY: other.publicKey })));
  ok(leak.indexOf(pair.privateKey) === -1 && leak.indexOf(pair.publicKey) === -1, "F2 validation output never contains key material");
}

/* F3 — push-config through its real handler, with the storage layer
   MOCKED (label: mocked storage). */
(async function () {
  const pair = wpkg.generateVAPIDKeys();
  const saved = {};
  ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"].forEach(k => { saved[k] = process.env[k]; });
  const origSelfTest = ST.selfTest, origConnect = ST.connect;
  const cfgHandler = require(path.join(ROOT, "netlify/functions/push-config.js")).handler;
  const call = async () => { const r = await cfgHandler({}); return { status: r.statusCode, body: JSON.parse(r.body) }; };
  try {
    ST.connect = () => {};
    ST.selfTest = async () => ({ ok: true });

    ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"].forEach(k => delete process.env[k]);
    let r = await call();
    ok(r.status === 200 && r.body.configured === false && r.body.reason === "vapid-missing" && r.body.publicKey === null,
      "F3 [mocked storage] no env vars → configured:false, reason vapid-missing, no key");
    eq(r.body.vapid.missing, ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"], "F3 [mocked storage] missing variables are listed by name");

    process.env.VAPID_PUBLIC_KEY = pair.publicKey; process.env.VAPID_PRIVATE_KEY = pair.privateKey; process.env.VAPID_SUBJECT = "not-a-subject";
    r = await call();
    ok(r.body.configured === false && r.body.reason === "vapid-invalid", "F3 [mocked storage] an invalid subject → reason vapid-invalid");

    process.env.VAPID_SUBJECT = "mailto:owner@example.com";
    r = await call();
    ok(r.body.configured === true && r.body.publicKey === pair.publicKey && r.body.reason === null, "F3 [mocked storage] valid env + working storage → configured:true with the public key");
    ok(JSON.stringify(r.body).indexOf(pair.privateKey) === -1, "F3 the private key is never in the config response");

    ST.selfTest = async () => ({ ok: false, error: "MissingBlobsEnvironmentError" });
    r = await call();
    ok(r.body.configured === false && r.body.reason === "storage-unavailable" && r.body.publicKey === null,
      "F3 [mocked storage] valid keys but broken storage → configured:false, storage-unavailable (status reflects the real backend)");
  } finally {
    ST.selfTest = origSelfTest; ST.connect = origConnect;
    Object.keys(saved).forEach(k => { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; });
  }

  /* ---------- F4 scheduler core with a fully MOCKED store + sender ---------- */
  function makeMockStore(devices) {
    const calls = { sent: [], delivered: [], invalid: [], removed: [], ledger: {}, pending: {} };
    const CLAIM_TTL = 5 * 60 * 1000;
    return {
      calls: calls,
      listDeviceIds: async () => Object.keys(devices),
      getSub: async id => devices[id].sub,
      getPrefs: async id => devices[id].prefs,
      getSnapshot: async id => devices[id].snap,
      getSent: async id => calls.ledger[id] ? { sent: calls.ledger[id] } : null,
      recordSent: async (id, keys) => { calls.ledger[id] = calls.ledger[id] || {}; keys.forEach(k => { calls.ledger[id][k] = Date.now(); }); },
      /* v89 — the claim/confirm/retry delivery state, mirroring the
         real store's semantics over the same in-memory ledger. */
      getDelivery: async id => ({ sent: calls.ledger[id] || {}, pending: calls.pending[id] || {} }),
      claimSend: async (id, key, keys, nowMs) => {
        calls.ledger[id] = calls.ledger[id] || {}; calls.pending[id] = calls.pending[id] || {};
        if (calls.ledger[id][key]) return { ok: false, reason: "sent" };
        const p = calls.pending[id][key];
        if (p && p.nextAt && nowMs < p.nextAt) return { ok: false, reason: "backoff" };
        if (p && !p.nextAt && nowMs - (p.at || 0) < CLAIM_TTL) return { ok: false, reason: "in-flight" };
        const entry = { at: nowMs, attempts: ((p && p.attempts) || 0) + 1, nextAt: null, lastStatus: null, keys: (keys && keys.length) ? keys.slice() : [key] };
        calls.pending[id][key] = entry;
        return { ok: true, entry: entry };
      },
      confirmSent: async (id, key) => {
        calls.ledger[id] = calls.ledger[id] || {}; calls.pending[id] = calls.pending[id] || {};
        const p = calls.pending[id][key];
        ((p && p.keys) || [key]).forEach(k => { calls.ledger[id][k] = Date.now(); });
        delete calls.pending[id][key];
      },
      scheduleRetry: async (id, key, status, backoffMs, maxAttempts, nowMs) => {
        calls.ledger[id] = calls.ledger[id] || {}; calls.pending[id] = calls.pending[id] || {};
        const p = calls.pending[id][key];
        const attempts = (p && p.attempts) || 1;
        if (attempts >= maxAttempts) {
          ((p && p.keys) || [key]).forEach(k => { calls.ledger[id][k] = nowMs; });
          delete calls.pending[id][key];
          return { retry: false, attempts: attempts };
        }
        if (!p) return { retry: false, attempts: attempts };
        p.nextAt = nowMs + backoffMs; p.lastStatus = status || 0;
        return { retry: true, attempts: attempts, nextAt: p.nextAt };
      },
      markDelivered: async id => { calls.delivered.push(id); },
      markInvalid: async id => { calls.invalid.push(id); },
      removeSub: async id => { calls.removed.push(id); },
      getBroadcast: async () => ({ version: "v-test", title: "Site update", body: "Something new is live.", url: "home", createdAt: Date.now() }),
      pruneRateLimits: async () => 0
    };
  }
  /* v89 — endpoints must be on the push-service allowlist now (send-time
     re-validation), so mock devices use a realistic FCM endpoint. */
  const goodSub = { status: "active", endpoint: "https://fcm.googleapis.com/fcm/send/mock-device", keys: { p256dh: "p".repeat(20), auth: "a".repeat(20) }, lastFailure: 0 };
  const idA = "11111111-1111-4111-8111-111111111111";
  const idB = "22222222-2222-4222-8222-222222222222";
  const idC = "33333333-3333-4333-8333-333333333333";
  const idD = "44444444-4444-4444-8444-444444444444";
  const basePrefs = S.sanitizePrefs({ master: true, tz: "UTC", time: "09:00", quiet: { start: "22:00", end: "06:00" } }, "UTC");
  /* 10:00 UTC on a Wednesday: inside the allowed window, outside quiet hours. */
  const wed10 = () => new Date(Date.UTC(2026, 9, 21, 10, 0, 0));

  {
    const devices = {};
    devices[idA] = { sub: goodSub, prefs: basePrefs, snap: {} };
    devices[idB] = { sub: goodSub, prefs: Object.assign({}, basePrefs, { master: false }), snap: {} };
    devices[idC] = { sub: Object.assign({}, goodSub, { status: "invalid", lastFailure: Date.now() - 40 * 86400000 }), prefs: basePrefs, snap: {} };
    devices[idD] = { sub: Object.assign({}, goodSub, { status: "invalid", lastFailure: Date.now() - 1000 }), prefs: basePrefs, snap: {} };
    const ms = makeMockStore(devices);
    const pushes = [];
    const sendPush = async (rec, payload) => { pushes.push(payload); return { ok: true, status: 201 }; };

    let sum = await RS.runScheduler({ store: ms, sendPush, vapidConfigured: () => true, nowFn: wed10 });
    ok(sum.devices === 4, "F4 [mocked] scheduler visits every device");
    ok(!ms.calls.delivered.includes(idB), "F4 [mocked] a device with master switch off gets nothing");
    ok(ms.calls.removed.includes(idC) && sum.purged === 1, "F4 [mocked] an invalid subscription older than 30 days is purged");
    ok(!ms.calls.removed.includes(idD) && !pushes.some(p => false) && !ms.calls.delivered.includes(idD), "F4 [mocked] a recently-invalid subscription is skipped, not sent to, not yet purged");
    ok(sum.sent === ms.calls.delivered.length, "F4 [mocked] summary.sent matches deliveries");

    /* duplicate prevention: repeated runs at the same moment may send the
       NEXT due category (daily budget) but never the same one twice, and
       the stream must dry up (frequency limit). */
    for (let i = 0; i < 8; i++) await RS.runScheduler({ store: ms, sendPush, vapidConfigured: () => true, nowFn: wed10 });
    const cats = pushes.filter(p => p.category).map(p => p.category + "|" + p.tag);
    ok(new Set(cats).size === cats.length, "F4 [mocked] repeated scheduler runs never send the same notification twice (idempotency ledger)");
    const afterAll = pushes.length;
    await RS.runScheduler({ store: ms, sendPush, vapidConfigured: () => true, nowFn: wed10 });
    ok(pushes.length === afterAll, "F4 [mocked] once the daily budget is used up, further runs send nothing (frequency limit)");
    const perDevice = pushes.length; // device A only (B off, C purged, D invalid)
    ok(perDevice <= 4, "F4 [mocked] no device ever exceeds the maximum daily reminder budget (" + perDevice + " ≤ 4)");
  }
  {
    const devices = {}; devices[idA] = { sub: goodSub, prefs: basePrefs, snap: {} };
    const ms = makeMockStore(devices);
    const sum = await RS.runScheduler({ store: ms, sendPush: async () => ({ ok: false, status: 410 }), vapidConfigured: () => true, nowFn: wed10 });
    ok(sum.invalid === 1 && ms.calls.invalid.includes(idA), "F4 [mocked] a 410 from the push service marks the subscription invalid (expiry handling)");
  }
  {
    const devices = {}; devices[idA] = { sub: goodSub, prefs: basePrefs, snap: {} };
    const ms = makeMockStore(devices);
    const sum = await RS.runScheduler({ store: ms, sendPush: async () => ({ ok: false, status: 500 }), vapidConfigured: () => true, nowFn: wed10 });
    ok(sum.errors === 1 && ms.calls.invalid.length === 0, "F4 [mocked] a transient 5xx counts as an error but does NOT invalidate the subscription");
    ok(sum.retried === 1 && sum.gaveUp === 0, "F4 [mocked] a transient 5xx schedules a retry (not a give-up)");
    const ledger = ms.calls.ledger[idA] || {};
    ok(Object.keys(ledger).length === 0, "F4 [mocked] a failed delivery is NEVER written to the confirmed ledger (never labelled 'sent')");
    const pend = Object.values(ms.calls.pending[idA] || {})[0];
    ok(pend && pend.nextAt > wed10().getTime() && pend.lastStatus === 500,
      "F4 [mocked] the pending entry carries the backoff deadline and the last status for diagnostics");
  }
  /* ---------- F4b retry lifecycle: transient failure → backoff →
       recovery, and honest give-up after the attempt cap ---------- */
  /* site-updates off so the retried category under test is the only
     thing that can fire (the broadcast otherwise competes first). */
  const retryPrefs = S.sanitizePrefs({ master: true, tz: "UTC", time: "09:00", quiet: { start: "22:00", end: "06:00" }, categories: { "site-updates": false } }, "UTC");
  {
    const devices = {}; devices[idA] = { sub: goodSub, prefs: retryPrefs, snap: {} };
    const ms = makeMockStore(devices);
    let failNext = 1;
    let attemptsSeen = 0;
    const sendPush = async () => { attemptsSeen++; return failNext-- > 0 ? { ok: false, status: 503 } : { ok: true, status: 201 }; };
    let clock = wed10().getTime();
    const run = () => RS.runScheduler({ store: ms, sendPush, vapidConfigured: () => true, nowFn: () => new Date(clock) });

    await run();                                   // attempt 1 → 503, backs off 2 min
    ok(attemptsSeen === 1, "F4b the first failure consumed exactly one attempt");
    await run();                                   // same instant: still backing off
    ok(attemptsSeen === 1, "F4b a run inside the backoff window does NOT retry yet");
    clock += 3 * 60000;                            // 2-minute backoff elapsed
    await run();                                   // attempt 2 → success
    ok(attemptsSeen === 2, "F4b the retry fires after the backoff window");
    const ledger = ms.calls.ledger[idA] || {};
    ok(Object.keys(ledger).length > 0, "F4b after the successful retry the key enters the confirmed ledger");
    ok(ms.calls.delivered.includes(idA), "F4b the successful retry is counted as delivered");
    const before = attemptsSeen;
    await run();
    ok(attemptsSeen === before, "F4b a confirmed key is never sent again (idempotency holds across retries)");
  }
  {
    const devices = {}; devices[idA] = { sub: goodSub, prefs: retryPrefs, snap: {} };
    const ms = makeMockStore(devices);
    let attemptsSeen = 0;
    const sendPush = async () => { attemptsSeen++; return { ok: false, status: 500 }; };
    let clock = wed10().getTime();
    const run = () => RS.runScheduler({ store: ms, sendPush, vapidConfigured: () => true, nowFn: () => new Date(clock) });
    await run(); clock += 3 * 60000;               // attempt 1, backoff elapsed
    await run(); clock += 11 * 60000;              // attempt 2, backoff elapsed
    await run();                                   // attempt 3 → cap reached → give-up
    ok(attemptsSeen === 3, "F4b a permanently failing send is attempted at most 3 times");
    clock += 31 * 60000;
    const sumLast = await run();
    ok(attemptsSeen === 3 && sumLast.sent === 0, "F4b after the give-up the key is burned — no more attempts, no silent re-sends");
    ok(Object.keys(ms.calls.ledger[idA] || {}).length > 0, "F4b the give-up burns the key so the loop cannot spin forever");
    ok(ms.calls.invalid.length === 0, "F4b an honest give-up never pretends the subscription is invalid");
  }
  {
    /* concurrency guard: two overlapping runs — the second sees the
       fresh claim and backs off instead of double-sending. */
    const devices = {}; devices[idA] = { sub: goodSub, prefs: retryPrefs, snap: {} };
    const ms = makeMockStore(devices);
    const now = wed10().getTime();
    const keys = ["daily-study:2026-10-21"];
    const first = await ms.claimSend(idA, keys[0], keys, now);
    ok(first.ok === true, "F4b the first run claims the key");
    const second = await ms.claimSend(idA, keys[0], keys, now + 1000);
    ok(second.ok === false && second.reason === "in-flight", "F4b a concurrent run finds the claim in-flight and backs off");
    /* the REAL pure view function (store.effectiveSentMap) over the
       same states the scheduler produces */
    const S_mod = require(path.join(ROOT, "netlify/functions/lib/store"));
    const effView = S_mod.effectiveSentMap({ sent: {}, pending: { [keys[0]]: first.entry } }, now + 1000);
    ok(effView[keys[0]] !== undefined, "F4b the real effectiveSentMap hides an in-flight claim from decide()");
    const staleView = S_mod.effectiveSentMap({ sent: {}, pending: { [keys[0]]: Object.assign({}, first.entry, { at: now - 10 * 60000 }) } }, now);
    ok(staleView[keys[0]] === undefined, "F4b a stale claim (crashed run) becomes sendable again after the TTL");
    const dueView = S_mod.effectiveSentMap({ sent: {}, pending: { [keys[0]]: Object.assign({}, first.entry, { nextAt: now - 1 }) } }, now);
    ok(dueView[keys[0]] === undefined, "F4b a retry whose backoff elapsed re-enters the decision");
    const waitingView = S_mod.effectiveSentMap({ sent: {}, pending: { [keys[0]]: Object.assign({}, first.entry, { nextAt: now + 60000 }) } }, now);
    ok(waitingView[keys[0]] !== undefined, "F4b a retry still inside its backoff stays skipped");
    const confirmedView = S_mod.effectiveSentMap({ sent: { [keys[0]]: now }, pending: {} }, now);
    ok(confirmedView[keys[0]] === now, "F4b confirmed keys pass through unchanged");
  }
  {
    const devices = {}; devices[idA] = { sub: goodSub, prefs: basePrefs, snap: {} };
    const ms = makeMockStore(devices);
    let called = 0;
    const sum = await RS.runScheduler({ store: ms, sendPush: async () => { called++; return { ok: true }; }, vapidConfigured: () => false, nowFn: wed10 });
    ok(called === 0 && sum.disabled === "vapid-not-configured", "F4 scheduler with invalid/missing VAPID config sends nothing and says why");
  }
  {
    const ms = makeMockStore({}); ms.listDeviceIds = async () => { throw new Error("blobs down"); };
    const sum = await RS.runScheduler({ store: ms, sendPush: async () => ({ ok: true }), vapidConfigured: () => true, nowFn: wed10 });
    ok(sum.disabled === "storage-unavailable" && sum.errors === 1, "F4 [mocked] a storage outage is reported, not swallowed as 'zero devices'");
  }
  {
    /* one throwing device must not abort the others */
    const devices = {}; devices[idA] = { sub: goodSub, prefs: basePrefs, snap: {} }; devices[idB] = { sub: goodSub, prefs: basePrefs, snap: {} };
    const ms = makeMockStore(devices);
    const orig = ms.getSub; ms.getSub = async id => { if (id === idA) throw new Error("boom"); return orig(id); };
    const sum = await RS.runScheduler({ store: ms, sendPush: async () => ({ ok: true, status: 201 }), vapidConfigured: () => true, nowFn: wed10 });
    ok(sum.errors === 1 && sum.sent === 1, "F4 [mocked] one broken device record does not abort the run");
  }
  {
    /* time budget: with a zero budget nothing starts and the remainder is deferred */
    const devices = {}; devices[idA] = { sub: goodSub, prefs: basePrefs, snap: {} };
    const ms = makeMockStore(devices);
    const sum = await RS.runScheduler({ store: ms, sendPush: async () => ({ ok: true }), vapidConfigured: () => true, nowFn: wed10, budgetMs: -1 });
    ok(sum.deferred === 1 && sum.sent === 0, "F4 [mocked] the 30-second function limit is respected via a time budget (work is deferred, not lost)");
  }

  /* ---------- F5 HTTP handlers with MOCKED store: API responses ---------- */
  {
    const origStore = {}; ["connect", "bumpRate", "getSub", "getPrefs", "putPrefs", "putSnapshot", "putSub", "removeSub", "markDelivered", "markInvalid"].forEach(k => { origStore[k] = ST[k]; });
    const db = { subs: {}, prefs: {}, snaps: {} };
    ST.connect = () => {};
    ST.bumpRate = async () => 1;
    ST.getSub = async id => db.subs[id] || null;
    ST.getPrefs = async id => db.prefs[id] || null;
    ST.putPrefs = async (id, p) => { db.prefs[id] = p; };
    ST.putSnapshot = async (id, p) => { db.snaps[id] = p; };
    ST.putSub = async (id, sub, label) => { db.subs[id] = { deviceId: id, endpoint: sub.endpoint, keys: sub.keys, status: "active", createdAt: 1, label }; return db.subs[id]; };
    ST.removeSub = async id => { delete db.subs[id]; };
    ST.markDelivered = async () => {};
    ST.markInvalid = async id => { if (db.subs[id]) db.subs[id].status = "invalid"; };
    const H = n => require(path.join(ROOT, "netlify/functions/" + n + ".js")).handler;
    const post = async (n, body) => { const r = await H(n)({ httpMethod: "POST", body: JSON.stringify(body) }); return { status: r.statusCode, body: JSON.parse(r.body) }; };
    const sub = { endpoint: "https://fcm.googleapis.com/fcm/send/abc123", keys: { p256dh: "B".repeat(40), auth: "c".repeat(22) } };

    let r = await post("push-subscribe", { deviceId: "nope", subscription: sub });
    ok(r.status === 400 && r.body.error === "bad-device-id", "F5 [mocked store] subscribe rejects a bad device id");
    r = await post("push-subscribe", { deviceId: idA, subscription: { endpoint: "http://insecure.example/x", keys: sub.keys } });
    ok(r.status === 400 && r.body.error === "bad-subscription", "F5 [mocked store] subscribe rejects a non-https endpoint");
    r = await post("push-subscribe", { deviceId: idA, subscription: sub, prefs: { time: "08:30", categories: { streak: true } }, snapshot: { tz: "Asia/Kolkata", streak: 3 }, label: "Chrome on Android" });
    ok(r.status === 200 && r.body.ok && r.body.saved && r.body.status === "active", "F5 [mocked store] valid subscribe persists and reports saved");
    ok(JSON.stringify(r.body).indexOf("fcm.googleapis") === -1, "F5 subscribe response does not echo the endpoint");
    ok(db.subs[idA] && db.prefs[idA] && db.prefs[idA].master === true && db.prefs[idA].time === "08:30", "F5 [mocked store] subscription + preferences were actually stored");
    ok(db.prefs[idA].tz === "Asia/Kolkata", "F5 [mocked store] the device time zone is stored with the preferences");

    r = await post("push-sync", { deviceId: idA, prefs: { time: "07:15" } });
    ok(r.status === 200 && r.body.subscribed === true && db.prefs[idA].time === "07:15", "F5 [mocked store] preference sync updates stored preferences");
    r = await post("push-sync", { deviceId: idB, prefs: { master: true } });
    ok(r.status === 200 && r.body.subscribed === false && db.prefs[idB].master === false, "F5 [mocked store] sync can never switch reminders on for an unsubscribed device");
    r = await post("push-sync", { deviceId: idA });
    ok(r.status === 400, "F5 sync with nothing to sync is a 400");

    /* test endpoint */
    const e0 = ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"].map(k => process.env[k]);
    ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"].forEach(k => delete process.env[k]);
    r = await post("push-test", { deviceId: idA });
    ok(r.status === 503 && r.body.error === "vapid-not-configured", "F5 test notification without keys → 503 vapid-not-configured (not a fake success)");
    const kp = wpkg.generateVAPIDKeys();
    process.env.VAPID_PUBLIC_KEY = kp.publicKey; process.env.VAPID_PRIVATE_KEY = kp.privateKey; process.env.VAPID_SUBJECT = "mailto:owner@example.com";
    r = await post("push-test", { deviceId: idC });
    ok(r.status === 409 && r.body.error === "no-subscription", "F5 [mocked store] test for a device with no subscription → 409 no-subscription");
    db.subs[idD] = Object.assign({}, db.subs[idA], { status: "invalid" });
    r = await post("push-test", { deviceId: idD });
    ok(r.status === 409 && r.body.error === "subscription-expired", "F5 [mocked store] test for an expired subscription → 409 subscription-expired");
    ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"].forEach((k, i) => { if (e0[i] === undefined) delete process.env[k]; else process.env[k] = e0[i]; });

    r = await post("push-unsubscribe", { deviceId: idA });
    ok(r.status === 200 && r.body.removed === true && !db.subs[idA] && db.prefs[idA], "F5 [mocked store] unsubscribe removes the subscription but keeps preferences");

    /* storage outage → honest 500, not a fake success */
    ST.bumpRate = async () => { throw new Error("storage down"); };
    r = await post("push-subscribe", { deviceId: idA, subscription: sub });
    ok(r.status === 500 && r.body.ok === false, "F5 [mocked store] a storage failure returns 500 (the client then says notifications are NOT on)");
    Object.keys(origStore).forEach(k => { ST[k] = origStore[k]; });
  }

  /* ---------- F6 client + service worker static checks ---------- */
  ok(/function sameServerKey\(/.test(pmSrc) && /!sameServerKey\(sub, cfg\.publicKey\)/.test(pmSrc), "F6 client replaces a subscription made with a different VAPID key");
  ok(/function recoverSubscription\(/.test(pmSrc) && /recoverSubscription\(res\.body\.status === "invalid"\)/.test(pmSrc), "F6 client self-heals when the server lost/expired its record");
  ok(/function configProblemText\(/.test(pmSrc) && /vapid-invalid/.test(pmSrc) && /storage-unavailable/.test(pmSrc), "F6 Settings explains missing keys vs invalid keys vs storage problems separately");
  ok(/addEventListener\("push"/.test(sw) && /showNotification/.test(sw), "F6 service worker shows notifications from push events");
  ok(/event\.notification\.close\(\)/.test(sw) && /openWindow/.test(sw), "F6 service worker handles notification clicks (focus or open)");

  console.log(`\npush-notification-tests: ${pass} passed, ${fail} failed`);
  if (fail) { console.log("Failures:"); failures.forEach(f => console.log("  x " + f)); process.exit(1); }
})().catch(e => { console.error(e); process.exit(1); });

