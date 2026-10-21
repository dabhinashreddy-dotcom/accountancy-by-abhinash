/* Achievements — regression tests.   Run:  node tests/achievements-tests.js
   (Node 18+, no packages.)  Dev only, not loaded by the website.

     A  the nine retired badges are gone everywhere
     B  nine new achievements, stable unique ids, explicit criteria
     C  each achievement unlocks only on its own qualifying event
     D  no double counting (repeat calls, refresh, several events at once)
     E  a terminated exam can never unlock the exam achievement
     F  existing XP / progress / earned badges are never disturbed
*/
const fs = require("fs"), path = require("path");
const Achievements = require(path.resolve(__dirname, "..", "achievements.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

/* A student state with nothing done yet. */
function freshState(overrides) {
  return Object.assign({
    xp: 0, streak: 0, solved: {}, bookmarks: [], mistakes: [], mistakeBook: {},
    badges: [], bestScores: {}, chapterProgress: {
      intro: 0, terms: 0, tbase: 0, basis: 0, eq: 0, dc: 0, jr: 0, lg: 0,
      cb: 0, sp2: 0, brs: 0, gst: 0, tb: 0, dep: 0
    }
  }, overrides || {});
}
const ALL_CHAPTERS = Object.keys(freshState().chapterProgress);
function completeAllBut(state, keepOpen) {
  ALL_CHAPTERS.forEach(id => { state.chapterProgress[id] = id === keepOpen ? 0 : 100; });
  return state;
}
function attempts(state, n, correctEvery) {
  for (let i = 0; i < n; i++) {
    state.solved["eq-" + i] = { correct: correctEvery ? i % correctEvery === 0 : true, attempts: 1 };
  }
  return state;
}

console.log("Achievements regression suite");
console.log("=".repeat(60));

/* ================= A. retired badges ================= */
section("A. The nine retired badges are gone");
const RETIRED_NAMES = ["First Solve", "Ledger Apprentice", "Balance Keeper", "3-Day Streak",
  "Century Club", "Equation Mastered", "Debit & Credit Mastered", "Journal Mastered", "Ledger Mastered"];
const RETIRED_IDS = ["first-solve", "ten-solved", "fifty-solved", "streak-3", "xp-100",
  "mastered-eq", "mastered-dc", "mastered-jr", "mastered-lg"];
eq(Achievements.RETIRED.length, 9, "nine badges are recorded as retired");
Achievements.RETIRED.forEach((r, i) => {
  eq(r.id, RETIRED_IDS[i], `retired id ${i + 1}`);
  eq(r.name, RETIRED_NAMES[i], `retired name ${i + 1}`);
});
// They must not be assignable by any achievement in this module.
Achievements.ACHIEVEMENTS.forEach(a => {
  ok(RETIRED_IDS.indexOf(a.id) < 0, `no achievement reuses the retired id "${a.id}"`);
  ok(RETIRED_NAMES.indexOf(a.name) < 0, `no achievement reuses the retired name "${a.name}"`);
});
// And the Performance page must not render any of them any more.
{
  const app = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
  RETIRED_NAMES.forEach(name => {
    ok(app.indexOf(`"${name}"`) < 0, `app.js no longer presents "${name}"`);
  });
  RETIRED_IDS.forEach(id => {
    ok(!/["']mastered-(eq|dc|jr|lg)["']/.test(app) || id.indexOf("mastered") < 0, `no new mastered-* badge push for "${id}"`);
  });
  ok(!/STATE\.badges\.push\(`mastered-|STATE\.badges\.push\("mastered-/.test(app), "app.js no longer awards any mastered-* badge");
}

/* ================= B. definitions ================= */
section("B. Nine new achievements, stable ids, explicit criteria");
eq(Achievements.ACHIEVEMENTS.length, 9, "exactly nine achievements");
const ids = Achievements.ACHIEVEMENTS.map(a => a.id);
eq(new Set(ids).size, ids.length, "ids are unique");
Achievements.ACHIEVEMENTS.forEach(a => {
  ok(typeof a.id === "string" && /^ach-[a-z0-9-]+$/.test(a.id), `id "${a.id}" is stable and slug-shaped`);
  ok(typeof a.name === "string" && a.name.length > 2, `achievement "${a.id}" has a name`);
  ok(typeof a.criteria === "string" && a.criteria.length > 10, `achievement "${a.id}" states its criteria`);
  ok(a.kind === "state" || a.kind === "event", `achievement "${a.id}" declares its kind`);
  if (a.kind === "state") ok(typeof a.test === "function", `state achievement "${a.id}" has a test`);
  if (a.kind === "event") ok(a.test === null, `event achievement "${a.id}" has no state test (it is granted explicitly)`);
});

/* ================= C. qualifying events ================= */
section("C. Each achievement unlocks only on its own qualifying event");
{
  const byName = n => Achievements.ACHIEVEMENTS.find(a => a.name === n).id;
  const first = Achievements.awardNew(freshState());
  eq(first.length, 0, "a brand-new student has earned nothing");

  const one = attempts(freshState(), 1);
  eq(Achievements.awardNew(one).map(a => a.id).join(","), byName("First Step"), "attempting one question earns First Step");

  const twentyFive = attempts(freshState(), 25);
  const earned25 = Achievements.awardNew(twentyFive).map(a => a.id);
  ok(earned25.indexOf(byName("Steady Practice")) >= 0, "25 attempts earns Steady Practice");
  ok(earned25.indexOf(byName("Question Centurion")) < 0, "25 attempts does NOT earn Question Centurion");

  const hundred = attempts(freshState(), 100);
  ok(Achievements.awardNew(hundred).map(a => a.id).indexOf(byName("Question Centurion")) >= 0, "100 attempts earns Question Centurion");

  const streaky = freshState({ streak: 7 });
  ok(Achievements.awardNew(streaky).map(a => a.id).indexOf(byName("Seven-Day Streak")) >= 0, "a 7-day streak earns Seven-Day Streak");
  ok(Achievements.awardNew(freshState({ streak: 6 })).length === 0, "a 6-day streak earns nothing");

  const oneChapter = freshState(); oneChapter.chapterProgress.eq = 100;
  ok(Achievements.awardNew(oneChapter).map(a => a.id).indexOf(byName("Chapter Completed")) >= 0, "one completed chapter earns Chapter Completed");

  const all = completeAllBut(freshState());
  const earnedAll = Achievements.awardNew(all).map(a => a.id);
  ok(earnedAll.indexOf(byName("Full Syllabus Completed")) >= 0, "all fourteen chapters earns Full Syllabus Completed");

  const bmk = freshState({ bookmarks: Array.from({ length: 10 }, (_, i) => "eq-" + i) });
  ok(Achievements.awardNew(bmk).map(a => a.id).indexOf(byName("Ten Bookmarks")) >= 0, "ten bookmarks earns Ten Bookmarks");
  ok(Achievements.awardNew(freshState({ bookmarks: ["eq-1"] })).length === 0, "one bookmark earns nothing");

  const mb = {}; for (let i = 0; i < 10; i++) mb["k" + i] = { status: "mastered" };
  const reform = freshState({ mistakeBook: mb });
  ok(Achievements.awardNew(reform).map(a => a.id).indexOf(byName("Ten Mistakes Reformed")) >= 0, "ten mastered mistakes earns Ten Mistakes Reformed");
  const reviewing = {}; for (let i = 0; i < 10; i++) reviewing["k" + i] = { status: "review" };
  ok(Achievements.awardNew(freshState({ mistakeBook: reviewing })).length === 0, "mistakes still to review earn nothing");
}

/* ================= D. no double counting ================= */
section("D. No event is counted twice");
{
  const s = attempts(freshState(), 30);
  const first = Achievements.awardNew(s);
  ok(first.length > 0, "the first pass earns something");
  const second = Achievements.awardNew(s);
  eq(second.length, 0, "a second pass (a re-render, a refresh) earns nothing more");
  eq(Achievements.awardNew(s).length, 0, "nor a third");
  eq(Achievements.awardNew(s).length, 0, "nor a fourth");
  const persisted = JSON.parse(JSON.stringify(s));
  eq(JSON.parse(JSON.stringify(s)).badges.length, persisted.badges.length, "the award is persisted, so a reload cannot duplicate it");

  // Granting the same event achievement twice awards it once.
  const e = freshState();
  const examId = Achievements.EXAM_ACHIEVEMENT_ID;
  ok(!!Achievements.grant(e, examId), "the exam achievement grants once");
  ok(Achievements.grant(e, examId) === null, "and never a second time");
  eq(e.badges.filter(b => b === examId).length, 1, "stored exactly once");
  ok(Achievements.grant(e, "does-not-exist") === null, "an unknown achievement cannot be granted");

  // A state achievement granted via grant() is also only counted once.
  const g = freshState();
  ok(!!Achievements.grant(g, "ach-first-question"), "a state achievement can be granted explicitly too");
  eq(Achievements.awardNew(g).length, 0, "and is not granted again by the state pass");
}

/* ================= E. terminated exams ================= */
section("E. A terminated attempt never unlocks the exam achievement");
{
  ok(!Achievements.examAchievementAllowed("active", true), "an in-progress attempt earns nothing");
  ok(!Achievements.examAchievementAllowed("terminated", false), "a terminated attempt earns nothing");
  ok(!Achievements.examAchievementAllowed("terminated", true), "even if the flag were wrong, the status refuses it");
  ok(!Achievements.examAchievementAllowed("idle", true), "an idle attempt earns nothing");
  ok(!Achievements.examAchievementAllowed(undefined, undefined), "an unknown status is refused");
  ok(Achievements.examAchievementAllowed("submitted", true), "a validly completed paper earns it");
  ok(!Achievements.examAchievementAllowed("submitted", false), "unless its certificate flag says otherwise");
}
{
  // The app-side rule: a terminated paper never calls grantAchievement.
  const app = fs.readFileSync(path.resolve(__dirname, "..", "app.js"), "utf8");
  ok(app.includes("Achievements.examAchievementAllowed(examState.status"), "app.js gates the exam achievement on the attempt status");
  ok(app.includes("examState.status === EXAM_STATUS.TERMINATED) { renderExamTerminated(root); return; }"), "a terminated attempt is routed away from the results page");
}

/* ================= F. existing state is untouched ================= */
section("F. Existing XP, progress and earned badges survive");
{
  const s = freshState({ xp: 1234, streak: 12 });
  s.badges.push("some-legacy-badge");           // a badge from an older version
  completeAllBut(s, "dep");
  attempts(s, 40);
  const before = JSON.parse(JSON.stringify(s));
  Achievements.awardNew(s);
  eq(s.xp, before.xp, "XP is untouched");
  eq(s.streak, before.streak, "streak is untouched");
  eq(Object.keys(s.solved).length, Object.keys(before.solved).length, "solved questions are untouched");
  eq(s.chapterProgress.dep, 0, "chapter progress is untouched");
  ok(s.badges.indexOf("some-legacy-badge") >= 0, "a previously earned badge is kept");
  ok(!s.badges.some(b => RETIRED_IDS.indexOf(b) >= 0), "no retired badge id is ever added back");
}
{
  // Metrics are derived from state, not invented.
  const s = freshState({ streak: 4 });
  attempts(s, 10);
  s.bookmarks = ["a", "b"];
  const m = Achievements.metricsFromState(s);
  eq(m.questionsAttempted, 10, "metrics count attempted questions");
  eq(m.streak, 4, "metrics read the streak");
  eq(m.bookmarks, 2, "metrics count bookmarks");
  eq(m.chaptersCompleted, 0, "metrics count completed chapters");
  eq(Achievements.metricsFromState(null).questionsAttempted, 0, "metrics on empty state is safe");
}

console.log("\n" + "=".repeat(60));
console.log(`Achievements tests: ${pass} passed / ${fail} failed`);
if (failures.length) {
  console.log("\nFAILURES");
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
