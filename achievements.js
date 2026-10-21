/* ============================================================
   ACHIEVEMENTS — Accountancy by Abhinash (v79)

   Replaces the nine old badges that were tied to a single narrow
   activity (a running XP counter and four chapter-specific
   "mastered" flags) with nine achievements measured against what a
   student actually does on the site: questions attempted, days
   studied in a row, chapters completed end-to-end, bookmarks kept,
   mistakes reworked in the Mistake Book, and a real completed Exam
   Mode paper.

   Rules this module enforces:
     * Stable ids. Nothing reuses a retired id, so an existing
       student's saved STATE.badges can never silently "pre-unlock"
       a new achievement.
     * Explicit criteria, carried with the achievement so the
       Performance page can show what is still to do.
     * Idempotent. awardNew()/grant() push the id into state.badges
       the moment they award it, so re-running (refresh, repeated
       renders, several events in one tick) never double-counts.
     * Event achievements are NOT derived from stored totals. An Exam
       Mode achievement is granted only from a validly completed
       attempt (status "submitted"), never from a security-terminated
       one, so a disqualified attempt can never unlock it.
     * No state is ever reset or reduced here — XP, progress, solved
       questions and existing earned badges are left untouched.

   Pure and DOM-free: browser (window.Achievements) and Node
   (module.exports), covered by tests/achievements-tests.js.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Achievements = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* The nine retired badges — kept here ONLY so tests and audits can
     prove they are gone from every presentation and from the award
     logic. They are never awarded and never rendered. */
  var RETIRED = [
    { id: "first-solve", name: "First Solve" },
    { id: "ten-solved", name: "Ledger Apprentice" },
    { id: "fifty-solved", name: "Balance Keeper" },
    { id: "streak-3", name: "3-Day Streak" },
    { id: "xp-100", name: "Century Club" },
    { id: "mastered-eq", name: "Equation Mastered" },
    { id: "mastered-dc", name: "Debit & Credit Mastered" },
    { id: "mastered-jr", name: "Journal Mastered" },
    { id: "mastered-lg", name: "Ledger Mastered" }
  ];

  var ACHIEVEMENTS = [
    {
      id: "ach-first-question",
      name: "First Step",
      criteria: "Attempt your first question in any chapter.",
      kind: "state",
      test: function (m) { return m.questionsAttempted >= 1; }
    },
    {
      id: "ach-25-questions",
      name: "Steady Practice",
      criteria: "Attempt 25 questions across the chapters.",
      kind: "state",
      test: function (m) { return m.questionsAttempted >= 25; }
    },
    {
      id: "ach-100-questions",
      name: "Question Centurion",
      criteria: "Attempt 100 questions across the chapters.",
      kind: "state",
      test: function (m) { return m.questionsAttempted >= 100; }
    },
    {
      id: "ach-streak-7",
      name: "Seven-Day Streak",
      criteria: "Study on seven consecutive days.",
      kind: "state",
      test: function (m) { return m.streak >= 7; }
    },
    {
      id: "ach-chapter-complete",
      name: "Chapter Completed",
      criteria: "Finish every learning stage in one chapter (100%).",
      kind: "state",
      test: function (m) { return m.chaptersCompleted >= 1; }
    },
    {
      id: "ach-full-syllabus",
      name: "Full Syllabus Completed",
      criteria: "Reach 100% in all eighteen chapters.",
      kind: "state",
      test: function (m, state) {
        var total = 18;
        if (state && state.chapterProgress) {
          var keys = Object.keys(state.chapterProgress);
          if (keys.length) total = keys.length;
        }
        return m.chaptersCompleted >= total;
      }
    },
    {
      id: "ach-10-bookmarks",
      name: "Ten Bookmarks",
      criteria: "Bookmark ten questions to come back to.",
      kind: "state",
      test: function (m) { return m.bookmarks >= 10; }
    },
    {
      id: "ach-10-mistakes-fixed",
      name: "Ten Mistakes Reformed",
      criteria: "Work ten Mistake Book entries all the way up to Mastered.",
      kind: "state",
      test: function (m) { return m.mistakesMastered >= 10; }
    },
    {
      id: "ach-exam-pass",
      name: "Exam Mode Pass",
      criteria: "Score 60% or more in a completed Exam Mode paper.",
      kind: "event",
      test: null   // granted only from a validly completed attempt
    }
  ];

  var EXAM_ACHIEVEMENT_ID = "ach-exam-pass";
  var EXAM_PASS_MARK = 60;

  /* What a student has actually done, derived from persisted state. */
  function metricsFromState(state) {
    state = state || {};
    var solved = state.solved || {};
    var solvedKeys = Object.keys(solved);
    var attempts = solvedKeys.length;
    var correct = solvedKeys.filter(function (k) { return solved[k] && solved[k].correct; }).length;
    var progress = state.chapterProgress || {};
    var chaptersCompleted = Object.keys(progress).filter(function (k) { return progress[k] >= 100; }).length;
    var mistakes = state.mistakeBook || {};
    var mistakesMastered = Object.keys(mistakes).filter(function (k) { return mistakes[k] && mistakes[k].status === "mastered"; }).length;
    return {
      questionsAttempted: attempts,
      questionsCorrect: correct,
      streak: state.streak || 0,
      chaptersCompleted: chaptersCompleted,
      bookmarks: Array.isArray(state.bookmarks) ? state.bookmarks.length : 0,
      mistakesMastered: mistakesMastered,
      xp: state.xp || 0
    };
  }

  function ensureBadgeArray(state) {
    if (!state) return [];
    if (!Array.isArray(state.badges)) state.badges = [];
    return state.badges;
  }

  function getAchievement(id) {
    for (var i = 0; i < ACHIEVEMENTS.length; i++) if (ACHIEVEMENTS[i].id === id) return ACHIEVEMENTS[i];
    return null;
  }

  function isEarned(state, id) {
    return !!(state && Array.isArray(state.badges) && state.badges.indexOf(id) >= 0);
  }

  /* Award every state-based achievement the student now qualifies for.
     Ids are pushed into state.badges immediately, so calling this a
     hundred times awards each achievement at most once. Returns only
     the achievements that are genuinely new in this call. */
  function awardNew(state) {
    var earned = [];
    if (!state) return earned;
    var badges = ensureBadgeArray(state);
    var m = metricsFromState(state);
    ACHIEVEMENTS.forEach(function (a) {
      if (a.kind !== "state" || typeof a.test !== "function") return;
      if (badges.indexOf(a.id) >= 0) return;
      if (!a.test(m, state)) return;
      badges.push(a.id);
      earned.push(a);
    });
    return earned;
  }

  /* Grant one specific (event-based) achievement. Returns the
     achievement if it was newly earned, otherwise null — so repeated
     calls for the same event never double-count. */
  function grant(state, id) {
    var a = getAchievement(id);
    if (!a || !state) return null;
    var badges = ensureBadgeArray(state);
    if (badges.indexOf(id) >= 0) return null;
    badges.push(id);
    return a;
  }

  /* A security-terminated attempt must never unlock an exam
     achievement. Only a validly completed paper does. */
  function examAchievementAllowed(attemptStatus, certificateEligible) {
    if (attemptStatus !== "submitted") return false;
    if (certificateEligible === false) return false;
    return true;
  }

  return {
    RETIRED: RETIRED,
    ACHIEVEMENTS: ACHIEVEMENTS,
    EXAM_ACHIEVEMENT_ID: EXAM_ACHIEVEMENT_ID,
    EXAM_PASS_MARK: EXAM_PASS_MARK,
    metricsFromState: metricsFromState,
    getAchievement: getAchievement,
    isEarned: isEarned,
    awardNew: awardNew,
    grant: grant,
    examAchievementAllowed: examAchievementAllowed
  };
});
