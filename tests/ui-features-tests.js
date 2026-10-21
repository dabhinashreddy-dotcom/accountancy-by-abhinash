/* ============================================================
   v82 suite — ui-features.js (behaviour) + app.js/styles.css/index.html wiring
   Run from the site root:   node tests/ui-features-tests.js
   Node 18+, no packages. Dev only — not loaded by the website.

   A. XP registry: once-ever, per-day, capped counters, pruning
   B. Recent Activity: normalize, dedupe keys, corruption handling, cap
   C. Section navigation: syllabus order, final-chapter end state
   D. Important Questions dropdown options + quiz config key + XP policy
   E. Source wiring: flashcard flip, dropdown, activity opening, XP gates,
      section nav, toast system, first-visit + exam toasts, versions,
      no local/localhost URLs in production code
   ============================================================ */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) {
  if (cond) pass++;
  else { fail++; failures.push(name + (detail ? " — " + detail : "")); }
}
function section(t) { console.log("\n" + t); }

const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const app = read("app.js");
const styles = read("styles.css");
const indexHtml = read("index.html");
const swJs = read("sw.js");
const UIF = require(path.join(ROOT, "ui-features.js"));

/* ============================================================
   A. XP REGISTRY
   ============================================================ */
section("A. XP registry (once / daily / capped / pruning)");

{
  const xp = {};
  ok(UIF.awardOnce(xp, "q|intro-1", 1000) === true, "awardOnce first claim pays");
  ok(UIF.awardOnce(xp, "q|intro-1", 2000) === false, "awardOnce second claim refused");
  ok(UIF.isClaimed(xp, "q|intro-1") === true, "isClaimed true after claim");
  ok(UIF.isClaimed(xp, "q|other") === false, "isClaimed false for unknown key");
  ok(UIF.awardOnce(xp, "", 1000) === false, "awardOnce rejects empty key");
  ok(xp["q|intro-1"].kind === "once" && xp["q|intro-1"].at === 1000, "once entry stores {at, kind}");
}

{
  const dayA = new Date(2026, 0, 5, 9, 0, 0).getTime();
  const dayA2 = new Date(2026, 0, 5, 23, 59, 0).getTime();
  const dayB = new Date(2026, 0, 6, 0, 1, 0).getTime();
  const xp = {};
  ok(UIF.awardDaily(xp, "quiz|all|all", dayA) === true, "awardDaily pays on first use of the day");
  ok(UIF.awardDaily(xp, "quiz|all|all", dayA2) === false, "awardDaily refuses later the same day");
  ok(UIF.isDailyClaimed(xp, "quiz|all|all", dayA2) === true, "isDailyClaimed same day");
  ok(UIF.awardDaily(xp, "quiz|all|all", dayB) === true, "awardDaily pays on the next day");
  ok(UIF.dayKey(dayA) !== UIF.dayKey(dayB), "dayKey differs across days");
}

{
  const day = new Date(2026, 2, 10, 12, 0, 0).getTime();
  const xp = {};
  ok(UIF.bumpDaily(xp, "ai-tutor", 5, day) === true, "bumpDaily 1st allowed");
  ok(UIF.bumpDaily(xp, "ai-tutor", 5, day) === true, "bumpDaily 2nd allowed");
  ok(UIF.dailyCount(xp, "ai-tutor", day) === 2, "dailyCount = 2 after two bumps");
  ok(UIF.dailyLeft(xp, "ai-tutor", 5, day) === 3, "dailyLeft = 3 of 5");
  for (let i = 0; i < 3; i++) UIF.bumpDaily(xp, "ai-tutor", 5, day);
  ok(UIF.bumpDaily(xp, "ai-tutor", 5, day) === false, "bumpDaily refuses past the cap");
  ok(UIF.dailyLeft(xp, "ai-tutor", 5, day) === 0, "dailyLeft = 0 at cap");
  ok(UIF.bumpDaily(xp, "ai-tutor", 5, day + 86400000) === true, "cap resets next day");
}

{
  const now = new Date(2026, 4, 1).getTime();
  const old = now - 6 * 86400000;
  const xp = {
    "q|ever": { at: old, kind: "once" },                 // permanent — must survive
    "d:Mon May 4 2026|quiz": { at: now - 3 * 86400000, day: "x", kind: "daily" }, // fresh — survive
    "c:old|gen": { count: 3, at: old, day: "x", kind: "cap" },                    // stale — drop
    "garbage": null,                                     // corrupt — drop
    "legacy-bare": old - 100000000                       // legacy number stamp — drop
  };
  const removed = UIF.prune(xp, now, 4);
  ok(xp["q|ever"] !== undefined, "prune keeps once-ever claims (even old ones)");
  ok(xp["d:Mon May 4 2026|quiz"] !== undefined, "prune keeps fresh daily claims");
  ok(xp["c:old|gen"] === undefined, "prune drops stale capped counters");
  ok(xp["garbage"] === undefined, "prune drops corrupt null entries");
  ok(xp["legacy-bare"] === undefined, "prune drops legacy bare timestamps");
  ok(removed === 3, "prune reports how many entries it removed", String(removed));
}

/* ============================================================
   B. RECENT ACTIVITY
   ============================================================ */
section("B. Recent activity (normalize / dedupe / corruption)");

{
  const now = new Date(2026, 5, 1).getTime();
  const s = UIF.normalizeActivity("Solved Intro Q1 (easy)", { now });
  ok(s && s.text === "Solved Intro Q1 (easy)", "plain string logActivity call is normalized");
  ok(s && typeof s.id === "string" && s.id.length > 0, "normalized entry gets an id");
  ok(s && s.at === now, "string entry stamps the current time");
  ok(s && s.route === null, "string entry has no route (renders as plain text)");
  ok(s && s.key && s.key.indexOf("t|") === 0, "text-only entries dedupe by text key");
}

{
  const now = new Date(2026, 5, 1).getTime();
  ok(UIF.normalizeActivity(null, { now }) === null, "null input dropped");
  ok(UIF.normalizeActivity(42, { now }) === null, "non-object input dropped");
  ok(UIF.normalizeActivity({}, { now }) === null, "object without text dropped");
  ok(UIF.normalizeActivity({ text: "   " }, { now }) === null, "whitespace-only text dropped");
  ok(UIF.normalizeActivity({ text: "hi", at: "not-a-number" }, { now }).at === now, "invalid timestamp repaired to now");
}

{
  const now = new Date(2026, 5, 1).getTime();
  const e = UIF.normalizeActivity({
    type: "practice", text: "Basic Accounting Terms Q7 solved (hard)",
    route: "ch-terms", tab: "Practice Bank", qid: 7, difficulty: "hard",
    status: "solved", chapterId: "terms"
  }, { now });
  ok(e.route === "ch-terms" && e.tab === "Practice Bank" && e.qid === 7, "structured fields survive normalization");
  ok(e.difficulty === "hard" && e.status === "solved" && e.chapterId === "terms", "difficulty/status/chapter survive normalization");
  ok(e.key && e.key.indexOf("r|") === 0, "routed entries derive a route-based key");
}

{
  const now = new Date(2026, 5, 1).getTime();
  const mk = (route, qid) => UIF.normalizeActivity({ text: "x", route, tab: "T", qid, type: "practice" }, { now });
  let list = [];
  for (let i = 0; i < 3; i++) list = UIF.pushActivity(list, mk("ch-jr", 3), 12);
  ok(list.length === 1, "same activity recorded 3× keeps one row (dedupe by key)");
  list = UIF.pushActivity(list, mk("ch-jr", 4), 12);
  ok(list.length === 2, "different question adds a second row");
  ok(list[0].key !== list[1].key, "distinct keys per question");
  for (let i = 0; i < 20; i++) list = UIF.pushActivity(list, mk("ch-tb", i), UIF.ACTIVITY_LIMIT);
  ok(list.length === UIF.ACTIVITY_LIMIT, "history capped at the activity limit", String(list.length));
  ok(list[0].qid === 19, "newest entry is first");
}

{
  const now = new Date(2026, 5, 1).getTime();
  let list = UIF.pushActivity([], { text: "Completed every learning stage in Journal 🎉", at: now - 5000 }, 12);
  list = UIF.pushActivity(list, { text: "Completed every learning stage in Journal 🎉", at: now }, 12);
  ok(list.length === 1 && list[0].at === now, "legacy {text,at} rows dedupe by text and refresh the timestamp");
  const corrupt = UIF.pushActivity([null, undefined, { text: "" }, { text: "keep me" }], { text: "new", at: now }, 12);
  ok(corrupt.length === 2, "null/corrupt rows are filtered out by pushActivity", String(corrupt.length));
}

/* ============================================================
   C. SECTION NAVIGATION
   ============================================================ */
section("C. Section navigation planning (syllabus order)");

{
  const chs = ["intro", "terms", "adj"];   // deliberately NOT alphabetical
  const titles = { intro: "Introduction", terms: "Basic Terms", adj: "Adjustments" };
  const tabs = ["Introduction", "Theory", "Mind Map", "Practice Bank", "Quick Revision"];

  const mid = UIF.planSectionNav({ route: "ch-intro", chapters: chs, tabTitles: tabs, tabIndex: 1, chapterTitles: titles });
  ok(mid && mid.kind === "section" && mid.nextIndex === 2 && mid.nextTitle === "Mind Map", "middle tab plans the next section", JSON.stringify(mid));
  ok(mid && mid.current === 2 && mid.total === 5, "section plan reports position X of Y");

  const lastOfChapter = UIF.planSectionNav({ route: "ch-intro", chapters: chs, tabTitles: tabs, tabIndex: 4, chapterTitles: titles });
  ok(lastOfChapter && lastOfChapter.kind === "chapter" && lastOfChapter.nextRoute === "ch-terms", "last section jumps to the NEXT CHAPTER in syllabus order", JSON.stringify(lastOfChapter));
  ok(lastOfChapter && lastOfChapter.nextTitle === "Basic Terms", "next chapter uses its real display name");

  const final = UIF.planSectionNav({ route: "ch-adj", chapters: chs, tabTitles: tabs, tabIndex: 4, chapterTitles: titles });
  ok(final && final.kind === "final" && final.nextRoute === "chapters-list", "last chapter + last section ends at the chapter list (valid end state)", JSON.stringify(final));

  ok(UIF.planSectionNav({ route: "home", chapters: chs, tabTitles: tabs, tabIndex: 0 }) === null, "non-chapter routes get no footer");
  ok(UIF.planSectionNav({ route: "ch-nope", chapters: chs, tabTitles: tabs, tabIndex: 0 }) === null, "unknown chapter gets no footer");

  const noTabs = UIF.planSectionNav({ route: "ch-intro", chapters: chs, tabTitles: [], tabIndex: -1, chapterTitles: titles });
  ok(noTabs && noTabs.kind === "chapter", "missing tab info falls back to the next chapter (never an invalid route)", JSON.stringify(noTabs));
}

/* ============================================================
   D. DROPDOWN OPTIONS / QUIZ KEY / XP POLICY
   ============================================================ */
section("D. Important Questions options, quiz key, XP policy");

{
  const chapters = [{ id: "intro", num: 1, name: "Introduction to Accounting" },
                    { id: "adj", num: 18, name: "Adjustment in Preparation" }];
  const opts = UIF.buildIQChapterOptions(chapters, { intro: 8, adj: 0 });
  ok(opts.length === 3, "options = all + each chapter");
  ok(opts[0].value === "all" && opts[0].count === 8, "All Chapters first with the real total");
  ok(opts[1].value === "intro" && opts[1].count === 8 && opts[1].empty === false, "chapter option carries its count");
  ok(opts[2].value === "adj" && opts[2].count === 0 && opts[2].empty === true, "empty category is flagged, not dropped");
  const labelled = UIF.buildIQChapterOptions(chapters, { intro: 8, adj: 0 }, c => "Ch." + c.num + " Short");
  ok(labelled[1].label === "Ch.1 Short", "custom label function is used");
}

{
  ok(UIF.quizConfigKey(["jr", "intro"], "all") === UIF.quizConfigKey(["intro", "jr"], "all"), "quiz config key is order-insensitive");
  ok(UIF.quizConfigKey("all", "all") !== UIF.quizConfigKey("intro", "all"), "different chapter sets get different keys");
  ok(UIF.quizConfigKey(undefined, undefined) === "all|all", "quiz config key defaults to all|all");
}

{
  const P = UIF.XP_POLICY;
  ok(P.practiceQuestion === 4 && P.practicePenalty === 1, "established question XP/penalty unchanged (4 / -1)");
  ok(P.quizQuestion === 2 && P.quizCompletionPerPoint === 2, "established quiz rewards unchanged (2/question, score×2)");
  ok(P.flashDeckCap === 20, "established flashcard cap unchanged (20)");
  ok(P.tutorPerMessage === 1 && P.tutorDailyMax === 5, "tutor policy: 1 XP, max 5/day");
  ok(P.generatorProblem === 3 && P.generatorDailyMax === 10, "generator policy: 3 XP, max 10/day");
}

/* ============================================================
   E. SOURCE WIRING
   ============================================================ */
section("E. Wiring in app.js / styles.css / index.html / sw.js");

/* ---- E1. Flashcards: real flip, keyboard, honest XP ---- */
ok(/flashState\.flipped = !flashState\.flipped;\s*cardEl\.classList\.toggle\("is-flipped"/.test(app),
  "flip toggles is-flipped on the live element (no re-render, so the 3D transition plays)");
ok(!/#flashCardEl\\"\)\.addEventListener\(\\"click\\", \(\) => \{ flashState\.flipped = !flashState\.flipped; renderFlashArea\(area\); \}\)/.test(app),
  "old re-render-on-flip pattern is gone");
ok(/cardEl\.addEventListener\(\s*"keydown"/.test(app), "flashcard flips with the keyboard (Enter/Space)");
ok(/role="button" tabindex="0" aria-pressed/.test(app), "flashcard exposes role/tabindex/aria-pressed");
ok(/\.flashcard-face \{[^}]*backface-visibility: hidden/s.test(styles), "faces use backface-visibility (opaque back)");
ok(/-webkit-backface-visibility/.test(styles), "webkit backface prefix present for Safari");
ok(/\.flashcard-face \{[^}]*overflow-y: auto/s.test(styles), "long answers scroll inside the face");
ok(/html\.reduce-motion \.flashcard/.test(styles), "reduced-motion class kills the flip animation");
ok(/prefers-reduced-motion: reduce\)[^{]*\{[^}]*\.flashcard \{ transition-duration: 0\.01ms/s.test(styles) || /@media \(prefers-reduced-motion: reduce\) \{[\s\S]{0,200}?\.flashcard \{ transition-duration/s.test(styles),
  "prefers-reduced-motion media query supported");
ok(/flash-deck\|/.test(app), "flashcard deck XP goes through the daily gate (flash-deck| key)");
ok(/awardXPDaily\(gateKey, Math\.min\(20, flashState\.knownCount\)/.test(app), "deck bonus keeps the established min(20, known) value");
ok(!/addXP\(Math\.min\(20, flashState\.knownCount\)/.test(app), "flashcards no longer call addXP directly (unguarded)");

/* ---- E2. Important Questions dropdown ---- */
ok(/iqChapterSelect/.test(app), "chapter chip scroller replaced by a <select> (iqChapterSelect)");
ok(/<select id="iqChapterSelect" class="iq-select" aria-describedby="iqPickerHint">/.test(app), "select markup exists with label + aria-describedby");
ok(/UIF\.buildIQChapterOptions\(/.test(app), "dropdown options are built from the website's real chapter list");
{
  const iqBlock = app.slice(app.indexOf("function renderImportantQuestions"), app.indexOf("function renderIQList"));
  ok(/routeQueryString/.test(iqBlock), "?ch= deep-link is honoured on Important Questions");
  ok(!/chFilterBar/.test(iqBlock), "old 19-chapter chip scroller is gone from Important Questions");
  ok(/typeFilterBar/.test(iqBlock), "existing question-format filters kept");
  ok(/iq-state|select\.value !== iqState\.chapter|syncHint/.test(iqBlock), "dropdown state stays in sync with the displayed list");
}
ok(/iqcard-\$\{q\.chapter\}-\$\{q\.idx\}/.test(app), "IQ cards get stable ids for deep-opening");
ok(/No \$\{what\} for \$\{where\} yet/.test(app), "empty IQ category shows a specific, helpful message");

/* ---- E3. Structured, clickable Recent Activity ---- */
ok(/function logActivity\(input\)/.test(app), "logActivity accepts structured input");
ok(/UIF\.normalizeActivity\(input/.test(app), "logActivity normalizes through ui-features");
ok(/UIF\.pushActivity\(STATE\.activityLog, entry, UIF\.ACTIVITY_LIMIT\)/.test(app), "logActivity dedupes by stable key and caps the list");
ok(/function openActivity\(entry\)/.test(app), "openActivity resolves an entry to its destination");
ok(/row\.addEventListener\(\s*"click", \(\) => openActivity\(a\)\)/.test(app), "home activity rows are clickable");
ok(/el\(clickable \? "button" : "div", `activity-row\$\{clickable \? " is-clickable" : " is-static"\}`\)/.test(app), "rows render as buttons only when a real destination exists");
ok(/PENDING_OPEN/.test(app) && /consumePendingOpen\(\)/.test(app), "pending deep-open consumed after the chapter renders");
ok(/This activity is no longer available/.test(app), "friendly message when the destination is gone");
ok(/afterRouteRender\(root, route\)/.test(app), "renderRoute calls the afterRouteRender hook");
ok((app.match(/type: "practice"/g) || []).length >= 10, "practice solves log structured activities", String((app.match(/type: "practice"/g) || []).length));
ok(/type: "exam"/.test(app), "exam completions log an activity");
ok(/type: "quiz"/.test(app), "quiz completions log an activity");
ok(/type: "flashcards"/.test(app), "flashcard deck completions log an activity");
ok((app.match(/logActivity\(/g) || []).length > 0 && !/logActivity\(`Complete|logActivity\("Complete the|logActivity\(`Solved |logActivity\(`Reviewed a \$\{/.test(app),
  "no plain-string logActivity call sites remain (except legacy-tolerant normalization)");

/* ---- E4. XP gates at every repeatable reward ---- */
ok(/function awardXPOnce\(/.test(app) && /function awardXPDaily\(/.test(app) && /function xpBumpDaily\(/.test(app),
  "the three XP gate helpers exist");
ok(/awardXPOnce\(qKey, 2, "Quiz question correct"\)/.test(app), "quiz question XP is once-ever per question");
ok(/awardXPOnce\(qKey, -XP_WRONG_PENALTY, "Quiz question incorrect"\)/.test(app), "quiz penalty claims the same once-only key");
ok(/awardXPDaily\("quiz\|" \+ cfgKey/.test(app), "quiz completion bonus is once-per-day per quiz set");
ok(/xpBumpDaily\("ai-tutor", 5\)/.test(app), "AI tutor XP capped at 5/day");
ok(/xpBumpDaily\("eq-generator", 10\)/.test(app), "generator XP capped at 10/day");
ok(/xpDailyLeft\("eq-generator", 10\)/.test(app), "generator penalties stop once the daily quota is spent");
ok(/cbEntryKey/.test(app) && /awardXPOnce\(cbEntryKey, 4, "Cash book entry recorded"\)/.test(app), "cash book entry XP is once per entry");
ok(/awardXPOnce\("cb-balanced\|/.test(app), "cash book balanced XP is once per scenario");
ok(/awardXPOnce\(sbCaseKey/.test(app), "books-detective XP is once per case");
ok(/awardXPOnce\("round\|terms"/.test(app) && /awardXPOnce\("round\|tbase"/.test(app), "matching rounds pay once ever");
ok(/awardXPOnce\("selfq\|" \+ solvedKey/.test(app), "self-assessed correct pays once per question");
ok(/awardXPOnce\("aia\|"/.test(app), "Accounting in Action scenario reveal pays once ever");
ok((app.match(/awardXPOnce\("selfq\|/g) || []).length === 3, "all three self-assessed builders are gated", String((app.match(/awardXPOnce\("selfq\|/g) || []).length));
ok(/awardOnce\(STATE\.xpOnce/.test(app) && /awardDaily\(STATE\.xpOnce/.test(app) && /bumpDaily\(STATE\.xpOnce/.test(app),
  "gates delegate bookkeeping to ui-features");
ok(/xpOnce: \{\}/.test(app), "STATE carries the xpOnce registry");
ok(!/addXP\(0,/.test(app), "no call site awards 0 XP (would be a hollow reward toast)");

/* ---- E5. Next Section / Next Chapter ---- */
ok(/function appendSectionNav\(/.test(app) && /bar\.id = "sectionNavFooter"/.test(app), "section navigation footer is appended to chapter pages");
ok(/UIF\.planSectionNav\(\{/.test(app), "footer uses the tested planner");
ok(/Next Section: \$\{escapeHtml\(plan\.nextTitle\)\}/.test(app), "shows the real next-section title");
ok(/Next Chapter: \$\{escapeHtml\(plan\.nextTitle\)\}/.test(app), "shows the real next-chapter title");
ok(/data-nav="final"/.test(app) && /navigate\("chapters-list"\)/.test(app), "last chapter ends at the chapter list");
ok(/function activeChapters\(\)\s*\{\s*return ClassRegistry\.chaptersOf\(/.test(app) && /activeChapters\(\)\.map\(c => c\.id\)/.test(app),
   "chapter order comes from the registry's syllabus order (APP_DATA order, not alphabetical)");
ok(/getElementById\("sectionNavFooter"\)/.test(app) && /if \(!bar\)/.test(app), "footer is never duplicated (id-guarded upsert)");
ok(/document\.addEventListener\("click"/.test(app) && /\.chip\[data-tab\]/.test(app), "tab switches update the footer");
ok(/setAttribute\("aria-label", "Section and chapter navigation"\)/.test(app) && /setAttribute\("role", "navigation"\)/.test(app), "footer is a labelled navigation landmark");

/* ---- E6. Toast system ---- */
ok(/function toast\(msg, type = "success", icon = "check-circle", opts = \{\}\)/.test(app), "toast() extended with options (backward compatible)");
ok(/dataset\.toastKey === dupKey/.test(app), "duplicate toasts are suppressed while on screen");
ok(/root\.children\.length > 3/.test(app), "toast stack capped at 3 (never obstructive)");
ok(/class="toast-close" aria-label="Dismiss notification"/.test(app), "toasts have a manual dismiss button");
ok(/t\.setAttribute\(\s*"role", \(type === "error" \|\| type === "warning"\) \? "alert" : "status"\)/.test(app), "role=alert for warning/error, role=status otherwise");
ok(/opts\.duration/.test(app), "configurable duration");
ok(styles.includes(".toast.info {"), "info toast variant styled");
ok(styles.includes(".toast.warning {"), "warning toast variant styled");
ok(styles.includes(".toast-close"), "toast close button styled");
ok(styles.includes(".toast-body") && styles.includes(".toast-title"), "toast title/body layout styled");
ok(styles.includes("animation: toastIn") && styles.includes(".toast.leaving"), "toast entry/exit animations present");
ok(styles.includes(".toast-root { left: 12px; right: 12px; bottom: 84px;"), "mobile toasts sit above the bottom nav");

/* ---- E6a. First-visit home toast ---- */
ok(/About this website/.test(app), 'first-visit toast uses the exact title "About this website"');
ok(/function maybeShowAboutToast\(\)/.test(app) && /aboutToastDone/.test(app), "first-visit toast has a persisted once-only flag");
ok(/}, 2600\);/.test(app), "toast waits ~2.6 s after the home page renders (2–3 s window)");
ok(/aboutToastDone = true;\s*saveState\(\);/.test(app), "flag persisted the moment it shows (never re-triggers)");
ok(/currentRoute\(\) !== "home"\) return;/.test(app), "toast never appears if the student already left home");

/* ---- E6b. Exam attempt-exhausted toast ---- */
{
  const msg = "Don't have a code? Ask Abinash to unlock more attempts.";
  const count = app.split(msg).length - 1;
  ok(count === 2, "exam unlock message appears exactly twice (both exhausted-start paths)", String(count));
  ok(/error === "daily-limit"\) \{[\s\S]{0,700}?toast\("Don't have a code\?/.test(app), "toast fires when the API refuses a start (daily limit)");
  ok(/if \(exhausted\) \{[\s\S]{0,300}?toast\("Don't have a code\?/.test(app), "toast fires when the Start button is already exhausted");
  ok(!/renderExamDashboard[\s\S]*?function[\s\S]{0,50}toast\("Don't have a code/.test(app), "message is event-driven, not rendered on a normal dashboard pass");
  ok(app.includes('code: "daily-limit", error: "daily-limit"') && !/start\.body\.error === "daily-limit"[\s\S]{0,200}addXP/.test(app),
    "daily-limit refusal does not decrement/consume an attempt or move XP");
}

/* ---- E7. Versions, service worker, no local URLs ---- */
/* Version pins are asserted as FLOORS, not exact strings: forgetting a
   bump after a release (the regression this guards) still fails, while
   a legitimate higher pin in a later release does not. */
{
  const appPin = /app\.js\?v=(\d+)/.exec(indexHtml);
  const cssPin = /styles\.css\?v=(\d+)/.exec(indexHtml);
  const swPin = /aba-cache-v(\d+)/.exec(swJs);
  ok(!!appPin, "index.html carries an app.js?v=N cache-buster");
  ok(!!appPin && Number(appPin[1]) >= 65, "app.js cache-busted to v65 or newer", appPin ? "v" + appPin[1] : "missing");
  ok(!!cssPin && Number(cssPin[1]) >= 49, "styles.css cache-busted to v49 or newer", cssPin ? "v" + cssPin[1] : "missing");
  ok(!!swPin && Number(swPin[1]) >= 47, "service worker cache bumped to v47 or newer", swPin ? "v" + swPin[1] : "missing");
}
ok(/"\.\/ui-features\.js"/.test(swJs), "ui-features.js precached for offline use");
ok(!/https?:\/\/localhost|https?:\/\/127\.0\.0\.1|https?:\/\/0\.0\.0\.0|\/\/localhost:\d+/.test(app + indexHtml + styles), "no localhost/local URLs in production code");

/* ---- E8. Existing suites keep their contracts ---- */
ok(/function addXP\(amount, reason\)/.test(app), "addXP signature unchanged for existing call sites");
ok(/toast\(`\+\$\{amount\} XP — \$\{reason\}`, "xp", "sparkles"\)/.test(app), "XP reward toast format unchanged");
ok(/STATE\.xp = Math\.max\(0, STATE\.xp \+ amount\)/.test(app), "XP total math unchanged (floor at 0)");

/* ============================================================ */
console.log(`\nui-features-tests: ${pass} passed, ${fail} failed`);
if (fail) { console.log("Failures:"); failures.forEach(f => console.log("  ✗ " + f)); process.exit(1); }
