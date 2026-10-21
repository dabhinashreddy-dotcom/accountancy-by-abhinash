/* Important Questions — "no XP for revealing an answer" regression.
   Run:  node tests/important-questions-xp-tests.js   (Node 18+, no packages.)
   Dev only, not loaded by the website.

   The requirement: revealing, expanding, collapsing, revisiting or
   refreshing a model answer on the Important Questions screen must
   award NO experience points, directly or indirectly, while every
   other XP reward on the site keeps working and nothing already
   earned is reset.

   What is actually executed here — not merely grepped for:
     A  the real click handler from renderIQList() is extracted from
        app.js by bracket matching and RUN several times with stubs,
        and addXP is proven not to be called on any of them
     B  the solved marker is still written exactly once, so existing
        progress and achievements that count it are not reset
     C  no other code path on that screen grants XP
     D  every other XP reward on the site is still present
     E  nothing anywhere resets XP or achievements
*/
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const APP_SRC = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); console.log("-".repeat(Math.max(t.length, 58))); }

console.log("Important Questions XP regression suite");
console.log("=".repeat(60));

/* ---------------------------------------------------------------
   locate and extract the real handler from renderIQList()
   --------------------------------------------------------------- */
const MARK = "IMPORTANT QUESTIONS AWARD NO XP";
const markAt = APP_SRC.indexOf(MARK);
ok(markAt > 0, "X0 the Important Questions no-XP comment is present");
const listenerAt = markAt > 0 ? APP_SRC.lastIndexOf('card.addEventListener("click"', markAt) : -1;
ok(listenerAt > 0, "X0b the Important Questions card click handler was located");

function matchBrace(src, openIdx) {
  let depth = 0, inStr = null, inTpl = 0;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i], p = src[i - 1];
    if (inStr) { if (c === inStr && p !== "\\") inStr = null; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "/" && src[i + 1] === "/") { const nl = src.indexOf("\n", i); if (nl < 0) break; i = nl; continue; }
    if (c === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i); if (e < 0) break; i = e + 1; continue; }
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

let HANDLER = null, handlerBody = "";
if (listenerAt > 0) {
  const open = APP_SRC.indexOf("{", listenerAt);
  const close = matchBrace(APP_SRC, open);
  ok(close > open, "X0c the handler's braces balance");
  if (close > open) { HANDLER = APP_SRC.slice(listenerAt, close + 1); handlerBody = HANDLER; }
}

/* ===============================================================
   A. run the real handler and prove addXP is never called
   =============================================================== */
section("A. The real handler awards no XP");

function click(act) {
  return { target: { closest: (sel) => (sel === "button[data-act]" ? { dataset: { act } } : null) } };
}

let handlerRuns = 0, handlerXp = [];
if (HANDLER) {
  const CH = { intro: "Ch.1 Introduction", terms: "Ch.2 Basic Terms" };

  function newHarness(state) {
    const h = {
      revealArea: { innerHTML: "" },
      STATE: state,
      xpCalls: [], saved: 0, logged: 0, bookmarks: 0, iconsCalls: 0,
      saveState: function () { h.saved++; },
      logActivity: function () { h.logged++; },
      toggleBookmark: function () { h.bookmarks++; },
      icons: function () { h.iconsCalls++; },
      q: { answer: "Capital is the owner's investment.", type: "Long Answer", chapter: "intro", idx: 0, marks: 3 },
      key: "iq-intro-0",
      chLabel: CH
    };
    h.addXP = function (n, what) { h.xpCalls.push({ n: n, what: what }); };
    return h;
  }

  /* The handler closes over revealArea / STATE / saveState / logActivity /
     toggleBookmark / icons / q / key / chLabel / addXP. Bind every one of
     them as a parameter so the REAL source text runs unmodified. */
  const arrowStart = HANDLER.indexOf("(e) =>");
  const arrowOpen = HANDLER.indexOf("{", arrowStart);
  const arrowClose = matchBrace(HANDLER, arrowOpen);
  const ARROW = HANDLER.slice(arrowStart, arrowClose + 1);
  const bind = new Function(
    "revealArea", "STATE", "saveState", "logActivity", "toggleBookmark",
    "icons", "q", "key", "chLabel", "addXP",
    `"use strict"; return (${ARROW});`
  );
  function run(h) {
    return bind(h.revealArea, h.STATE, h.saveState, h.logActivity,
                h.toggleBookmark, h.icons, h.q, h.key, h.chLabel, h.addXP);
  }

  /* --- A1: fresh student clicks Show Answer -------------------- */
  const h1 = newHarness({ solved: {}, xp: 0 });
  const run1 = run(h1);

  handlerRuns++;
  run1(click("answer"));
  eq(h1.xpCalls.length, 0, "A1 the FIRST reveal awards no XP");
  ok(h1.revealArea.innerHTML.includes("Model answer"), "A2 the model answer is still shown");
  ok(!!h1.STATE.solved["iq-intro-0"], "A3 the solved marker is still recorded");
  eq(h1.saved, 1, "A4 progress is saved exactly once on first reveal");
  eq(h1.logged, 1, "A5 the activity log still records the review");

  /* --- A4: collapsing, revisiting, re-revealing ---------------- */
  const beforeXp = h1.xpCalls.length;
  for (let i = 0; i < 6; i++) { run1(click("answer")); handlerRuns++; }
  eq(h1.xpCalls.length, beforeXp, "A6 six more reveals still award no XP");
  eq(h1.saved, 1, "A7 repeat reveals do not churn the save");
  eq(h1.logged, 1, "A8 repeat reveals do not repeat the activity log");

  /* --- A9: the AI/other button on the same card ---------------- */
  run1(click("bookmark")); handlerRuns++;
  eq(h1.xpCalls.length, 0, "A9 bookmarking from the card awards no XP");

  /* --- A10: refresh — state reloaded from disk, handler rebuilt -- */
  const reloaded = JSON.parse(JSON.stringify({ solved: h1.STATE.solved, xp: h1.STATE.xp || 0 }));
  const h2 = newHarness(reloaded);
  const run2 = bind(h2.revealArea, h2.STATE, h2.saveState, h2.logActivity,
                    h2.toggleBookmark, h2.icons, h2.q, h2.key, h2.chLabel, h2.addXP);
  run2(click("answer")); run2(click("answer")); handlerRuns += 2;
  eq(h2.xpCalls.length, 0, "A10 after a page refresh, revealing again awards no XP");
  eq(h2.saved, 0, "A11 a refresh does not re-write the solved marker");

  /* --- A12: a second, different question ----------------------- */
  const h3 = newHarness({ solved: {}, xp: 0 });
  const run3 = bind(h3.revealArea, h3.STATE, h3.saveState, h3.logActivity,
                    h3.toggleBookmark, h3.icons,
                    { answer: "Profit and Loss A/c.", type: "Short Answer", chapter: "terms", idx: 4, marks: 2 },
                    "iq-terms-4", CH);
  run3(click("answer")); handlerRuns++;
  eq(h3.xpCalls.length, 0, "A12 a different Important Question also awards no XP");

  /* --- A13: several students' worth of reveals ----------------- */
  let allXp = h1.xpCalls.length + h2.xpCalls.length + h3.xpCalls.length;
  eq(allXp, 0, "A13 across every run above, total XP awarded is zero");

  handlerXp = [h1, h2, h3].flatMap(h => h.xpCalls);
}

/* ===============================================================
   C. no other code path on that screen grants XP
   =============================================================== */
section("C. Nothing on the Important Questions screen grants XP");

if (HANDLER) {
  eq(/addXP\s*\(/.test(handlerBody), false, "C1 the extracted handler contains no addXP call");
  eq(/awardXP\s*\(|grantXP\s*\(|giveXP\s*\(/i.test(handlerBody), false,
     "C2 the handler uses no XP-granting alias");
  eq(/xp\s*\+=|xp\s*=\s*xp|\.xp\s*\+=/.test(handlerBody), false,
     "C3 the handler never adds to an xp counter directly");
}
/* the whole renderIQList function must be XP-free, not just the handler */
const fnStart = APP_SRC.indexOf("function renderIQList");
const fnEnd = fnStart > 0 ? matchBrace(APP_SRC, APP_SRC.indexOf("{", fnStart)) : -1;
ok(fnStart > 0 && fnEnd > fnStart, "C4 renderIQList() was located");
if (fnStart > 0 && fnEnd > fnStart) {
  const fnSrc = APP_SRC.slice(fnStart, fnEnd + 1);
  eq(/addXP\s*\(/.test(fnSrc), false, "C5 renderIQList() contains no addXP call");
  eq(/xp\s*(\+=|=\s*[^=])/.test(fnSrc), false, "C6 renderIQList() never mutates an xp counter");
  /* the explainable reward string must be gone from the whole file */
}
eq(APP_SRC.includes("Reviewed an important question"), false,
   "C7 the old XP reason string no longer exists anywhere in app.js");
eq(/addXP\s*\(\s*3\s*,\s*`Reviewed an important question`/.test(APP_SRC), false,
   "C8 the exact removed call does not reappear");

/* the OTHER rewards that live right next to it must still be there */
ok(/addXP\(/.test(APP_SRC), "C9 addXP is still defined and used elsewhere in app.js");

/* ===============================================================
   B. existing progress and achievements are not reset
   =============================================================== */
section("B. Existing progress is preserved");

ok(APP_SRC.includes("STATE.solved[key] = { correct: true, attempts: 1 }"),
   "B1 the solved marker is still written (achievements that count it keep working)");
ok(/saveState\(\)/.test(APP_SRC), "B2 saveState is still called for the marker");
/* v82: the review now reaches the feed as a STRUCTURED entry (same text,
   plus route/tab/qid so the row is clickable back to this question). */
ok(APP_SRC.includes("Reviewed a ${q.type} question") &&
   /logActivity\(\{\s*type: "iq", key: `iq\|\$\{q\.chapter\}\|\$\{q\.idx\}`/.test(APP_SRC),
   "B3 the review still reaches the activity feed (as a structured, clickable entry)");
if (HANDLER) {
  ok(/STATE\.solved\[key\]/.test(handlerBody), "B4 the handler still records solved state");
}
eq(/STATE\.solved\s*=\s*\{\s*\}/.test(APP_SRC), false, "B5 nothing wipes the solved map");
eq(/STATE\.xp\s*=\s*0/.test(APP_SRC), false, "B6 nothing sets xp back to zero");
eq(/STATE\.achievements\s*=\s*(\[\]|\{\})/.test(APP_SRC), false, "B7 nothing clears achievements");
eq(/removeItem\([^)]*xp/i.test(APP_SRC), false, "B8 xp is never removed from storage");

/* ===============================================================
   D. every other XP reward is still present
   =============================================================== */
section("D. Every other XP reward still exists");

const XP_CALLS = (APP_SRC.match(/addXP\s*\(/g) || []).length;
ok(XP_CALLS >= 15, `D1 at least 15 addXP call sites remain (found ${XP_CALLS})`);

/* named rewards that predate this work and must survive */
const PRESERVED = [
  ["Exam Mode paper completed", "D2 exam completion XP"],
  ["Accounting in Action", "D3 Accounting in Action XP"],
  ["Term Detective", "D4 Term Detective XP"],
  ["Concept Detective", "D5 Concept Detective XP"],
  ["Basis Switch", "D6 Basis Switch XP"],
  ["Reviewed ledger posting", "D7 Ledger XP"],
  ["Quiz answers correct", "D7b quiz XP"],
  ["Flashcard deck completed", "D7c flashcard XP"],
  ["mastered`", "D7d chapter mastery XP"]
];
PRESERVED.forEach(([needle, name]) => {
  ok(APP_SRC.includes(needle), name + " is still awarded");
});

/* the exam XP must not have been broken by the new longer paper */
const examXpLine = APP_SRC.split("\n").find(l => l.includes('"Exam Mode paper completed"'));
ok(!!examXpLine, "D8 the exam XP call is intact");
if (examXpLine) ok(/Math\.min/.test(examXpLine), "D9 the exam XP is capped so the longer paper cannot out-run the old ones");

/* the addXP function itself must still exist and add */
const addXpFn = APP_SRC.indexOf("function addXP");
ok(addXpFn > 0, "D10 addXP() is still defined");
if (addXpFn > 0) {
  const body = APP_SRC.slice(addXpFn, matchBrace(APP_SRC, APP_SRC.indexOf("{", addXpFn)) + 1);
  ok(/STATE\.xp/.test(body), "D11 addXP() still updates STATE.xp");
  eq(/return;\s*\/\/\s*disabled/i.test(body), false, "D12 addXP() has not been disabled");
}

/* achievements still award their own XP */
ok(/Achievements\.awardNew\s*\(/.test(APP_SRC) && /function grantAchievement/.test(APP_SRC),
   "D13 the achievement award paths (awardNew and grantAchievement) are still present");

/* ===============================================================
   E. summary
   =============================================================== */
section("E. What was executed");
console.log(`  Important Questions click handler runs: ${handlerRuns}`);
console.log(`  XP awarded across those runs:           ${handlerXp.length}`);
console.log(`  addXP call sites remaining in app.js:   ${XP_CALLS}`);

console.log("\n" + "=".repeat(60));
console.log(`passed: ${pass}   failed: ${fail}`);
if (fail) {
  console.log("\nFAILURES:");
  failures.forEach(f => console.log("  x " + f));
}
process.exit(fail ? 1 : 0);
