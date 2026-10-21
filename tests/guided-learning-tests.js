/* ============================================================
   guided-learning-tests.js — v94 guided learning journey
   structural contract.

   Loads the REAL data pipeline in a Node vm exactly as the browser
   does (data.js -> data-12.js -> data-12a..l.js -> classes.js ->
   theory-upgrade.js -> guided-learning.js) and verifies, for EVERY
   Class 11 and Class 12 chapter, that the guided journey data is
   complete, honest and safe:

     - every chapter carries a .guide block merged by the applier;
     - hook / connects / readiness / checkpoint / recall / diagrams
       are present, substantive and tag-free (< and > are banned —
       the renderers interpolate innerHTML unescaped);
     - every checkpoint id resolves to a REAL question in this
       chapter's own bank, in the right format for that chapter,
       with a valid answer and explanation;
     - every diagram anchors to exactly one theory block heading
       (or the "intro-end" sentinel for ledger), so a diagram can
       never float free of its text or duplicate across tabs;
     - the stage plan covers all 31 chapters, stage membership is
       unambiguous and the pure roadmap state machine behaves;
     - the part files never author the same chapter twice.

   Nothing is mocked: this executes the shipped files.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
let passed = 0, failed = 0;
function ok(cond, label, detail) {
  if (cond) { passed++; }
  else { failed++; console.error("  x " + label + (detail ? " — " + detail : "")); }
}

/* ---- load the real pipeline in a browser-like sandbox ---- */
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);
function run(file, tail) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8") + (tail || ""), sandbox, { filename: file });
}
run("data.js", "\n;globalThis.__D = APP_DATA;");
run("data-12.js");
["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"].forEach((p) => run("data-12" + p + ".js"));
run("classes.js", "\n;if (typeof ClassRegistry !== 'undefined') ClassRegistry.install();");
run("theory-upgrade.js");
run("guided-learning.js");

const D = sandbox.__D;
const GL = sandbox.window.GuidedLearn;
ok(!!D && typeof D === "object", "the data pipeline loads (APP_DATA exists)");
ok(!!GL && typeof GL === "object", "guided-learning.js exposes window.GuidedLearn");

/* ---- the complete chapter checklist (18 + 13) ---- */
const C11 = ["intro", "terms", "tbase", "basis", "equation", "debitCredit", "journal", "ledger", "cashBook", "specialBooks2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
const C12 = ["pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin", "fsa", "rat", "cf", "ca"];
/* Route ids (STATE/progress side) for every chapter; six Class 11
   chapters differ from their APP_DATA key. */
const ROUTE = {
  intro: "intro", terms: "terms", tbase: "tbase", basis: "basis", equation: "eq", debitCredit: "dc",
  journal: "jr", ledger: "lg", cashBook: "cb", specialBooks2: "sp2", brs: "brs", gst: "gst",
  tb: "tb", dep: "dep", pres: "pres", roe: "roe", fs: "fs", adj: "adj",
  pf: "pf", gw: "gw", psr: "psr", adm: "adm", ret: "ret", dis: "dis", sc: "sc", deb: "deb",
  cfin: "cfin", fsa: "fsa", rat: "rat", cf: "cf", ca: "ca"
};
const ALL = C11.concat(C12);

function badChars(s) { return typeof s === "string" && (s.indexOf("<") !== -1 || s.indexOf(">") !== -1); }
function walkStrings(obj, visit, trail) {
  trail = trail || "";
  if (typeof obj === "string") { visit(obj, trail); return; }
  if (Array.isArray(obj)) { obj.forEach((v, i) => walkStrings(v, visit, trail + "[" + i + "]")); return; }
  if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((k) => walkStrings(obj[k], visit, trail ? trail + "." + k : k));
  }
}

/* ---- GuidedLearn id mapping matches the authored route map ---- */
if (GL) {
  ok(GL.routeToDataKey("eq") === "equation" && GL.routeToDataKey("dc") === "debitCredit" &&
    GL.routeToDataKey("jr") === "journal" && GL.routeToDataKey("lg") === "ledger" &&
    GL.routeToDataKey("cb") === "cashBook" && GL.routeToDataKey("sp2") === "specialBooks2",
    "routeToDataKey maps the six renamed chapters");
  ok(GL.routeToDataKey("gst") === "gst" && GL.dataKeyToRoute("pf") === "pf",
    "routeToDataKey/dataKeyToRoute pass through identity chapters");
}

/* ---- replicate the bank access the app has (CHAPTER_BANK lives in
   app.js, which needs the DOM; the data side is identical) ---- */
const LG_POOL = (() => {
  const fromJournal = (D.journal.numericals || [])
    .filter((q) => q.entries && q.entries.length === 2)
    .map((q) => ({ id: q.id, difficulty: q.difficulty, transaction: q.transaction, explanation: q.explanation }));
  const extra = (D.ledger.extraPracticeTransactions || [])
    .map((q) => ({ id: 1000 + q.id, difficulty: q.difficulty, transaction: q.transaction, explanation: q.explanation }));
  return fromJournal.concat(extra);
})();
const CB_OPTS = (function () {
  /* option lists copied from app.js — the checkpoint must offer the
     exact same fixed lists the bank does */
  return {
    cb: ["Debit side — Cash column", "Credit side — Cash column", "Debit side — Bank column", "Credit side — Bank column", "Contra entry — both sides (Cash & Bank)", "Not recorded in the Cash Book (Journal Proper)"]
  };
})();

function bankOf(dataKey) {
  if (dataKey === "ledger") return LG_POOL;
  const sec = D[dataKey];
  return (sec && Array.isArray(sec.numericals)) ? sec.numericals : null;
}
const DIFF_RANK = { easy: 0, Easy: 0, medium: 1, Medium: 1, hard: 2, Hard: 2 };

/* ============================================================
   1. EVERY chapter carries a complete, safe guide block
   ============================================================ */
let guideCount = 0;
ALL.forEach((key) => {
  const sec = D[key];
  const routeId = ROUTE[key];
  ok(!!sec && typeof sec === "object", key + ": chapter content exists in APP_DATA");
  if (!sec) return;
  const g = sec.guide;
  ok(!!g && typeof g === "object", key + ": carries a .guide block (merged by the applier)");
  if (!g) return;
  guideCount++;

  /* No raw HTML characters anywhere in the guide data */
  let tagFree = true, tagWhere = "";
  walkStrings(g, (s, trail) => { if (badChars(s)) { tagFree = false; tagWhere = trail; } });
  ok(tagFree, key + ": no < or > anywhere in the guide data", tagWhere ? "found in " + tagWhere : "");

  /* hook — an engaging, substantive opener */
  ok(typeof g.hook === "string" && g.hook.trim().length >= 60, key + ": hook is a substantive opener (60+ chars)",
    g.hook ? "got " + g.hook.trim().length + " chars" : "missing");

  /* connects — at least one genuine link, substantive */
  ok(!!g.connects && typeof g.connects === "object" &&
    ((typeof g.connects.before === "string" && g.connects.before.trim().length >= 40) ||
     (typeof g.connects.after === "string" && g.connects.after.trim().length >= 40)),
    key + ": connects carries at least one genuine syllabus link (40+ chars)");

  /* readiness — a real pre-theory question */
  const r = g.readiness;
  ok(!!r && typeof r === "object" && typeof r.q === "string" && r.q.trim().length >= 30,
    key + ": readiness has a substantive question");
  if (r) {
    ok(Array.isArray(r.options) && r.options.length >= 2 && r.options.length <= 4 &&
      r.options.every((o) => typeof o === "string" && o.trim().length >= 5),
      key + ": readiness has 2-4 substantive options");
    ok(typeof r.answer === "number" && r.answer >= 0 && Array.isArray(r.options) && r.answer < r.options.length,
      key + ": readiness answer indexes a real option");
    ok(typeof r.explain === "string" && r.explain.trim().length >= 60,
      key + ": readiness explanation teaches (60+ chars)");
  }

  /* checkpoint — 2..4 ids from this chapter's own bank */
  const cp = g.checkpoint;
  ok(Array.isArray(cp) && cp.length >= 2 && cp.length <= 4, key + ": checkpoint carries 2-4 question ids",
    cp ? "got " + cp.length : "missing");
  if (Array.isArray(cp)) {
    const bank = bankOf(key);
    ok(!!bank && bank.length > 0, key + ": the chapter bank exists for checkpoint resolution");
    let lastRank = -1, orderOk = true;
    cp.forEach((qid) => {
      const q = bank ? bank.find((x) => x.id === qid) : null;
      ok(!!q, key + ": checkpoint id " + qid + " resolves to a real question in this chapter's bank");
      if (!q) return;
      ok(typeof q.difficulty === "string" && DIFF_RANK[q.difficulty] !== undefined,
        key + ": Q" + qid + " has a known difficulty");
      /* format checks per chapter family */
      if (key === "equation") {
        ok(Array.isArray(q.steps) && q.steps.length >= 2 && typeof q.answer === "number" &&
          typeof q.explanation === "string" && q.explanation.trim().length >= 20,
          key + ": Q" + qid + " is a full equation question (steps + answer + explanation)");
      } else if (key === "debitCredit") {
        ok(typeof q.transaction === "string" && Array.isArray(q.accounts) && q.accounts.length >= 2 &&
          q.modern && typeof q.modern.debit === "string" && typeof q.modern.credit === "string" &&
          typeof q.explanation === "string", key + ": Q" + qid + " is a full debit/credit classification question");
      } else if (key === "journal") {
        ok(typeof q.transaction === "string" && Array.isArray(q.entries) && q.entries.length >= 2 &&
          q.entries.every((e) => e && typeof e.particulars === "string") &&
          typeof q.explanation === "string", key + ": Q" + qid + " is a full journal entry question");
      } else if (key === "ledger") {
        ok(typeof q.transaction === "string" && typeof q.explanation === "string",
          key + ": Q" + qid + " is a full ledger posting question");
      } else if (key === "cashBook" || key === "specialBooks2" || key === "brs") {
        const opts = key === "cashBook" ? CB_OPTS.cb : null;
        ok(typeof q.transaction === "string" && typeof q.answer === "string" &&
          typeof q.explanation === "string" && typeof q.posting === "string",
          key + ": Q" + qid + " is a full placement question (answer + posting + explanation)");
        if (opts) ok(opts.indexOf(q.answer) !== -1, key + ": Q" + qid + " answer is one of the fixed option labels");
      } else {
        ok(Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 4 &&
          typeof q.answerIndex === "number" && q.answerIndex >= 0 && q.answerIndex < q.options.length &&
          typeof (q.question || q.q) === "string" && (q.question || q.q).trim().length >= 15 &&
          typeof q.explanation === "string" && q.explanation.trim().length >= 20,
          key + ": Q" + qid + " is a complete MCQ (options + answerIndex + explanation)");
      }
      /* difficulty ascends across the checkpoint (easy -> hard) */
      const rank = DIFF_RANK[q.difficulty];
      if (rank < lastRank) orderOk = false;
      lastRank = Math.max(lastRank, rank);
    });
    ok(orderOk, key + ": checkpoint questions ascend in difficulty (easy before hard)");
  }

  /* recall — an attempt-first set of 2-6 honest Q/A pairs */
  const rc = g.recall;
  ok(!!rc && Array.isArray(rc.items) && rc.items.length >= 2 && rc.items.length <= 6,
    key + ": recall carries 2-6 items", rc && rc.items ? "got " + rc.items.length : "missing");
  if (rc && Array.isArray(rc.items)) {
    ok(rc.items.every((it) => it && typeof it.q === "string" && it.q.trim().length >= 15 &&
      typeof it.a === "string" && it.a.trim().length >= 40),
      key + ": every recall item has a real question and a substantial answer");
    if (typeof rc.intro === "string") ok(rc.intro.trim().length >= 20, key + ": recall intro, when present, is substantive");
  }

  /* diagrams — anchored to exactly one block heading (or intro-end) */
  const dg = g.diagrams;
  ok(Array.isArray(dg) && dg.length >= 1 && dg.length <= 4, key + ": carries 1-4 anchored diagrams",
    dg ? "got " + dg.length : "missing");
  if (Array.isArray(dg)) {
    const headings = []
      .concat((sec.theory && Array.isArray(sec.theory.simple) ? sec.theory.simple : []).map((b) => b.h))
      .concat((sec.theory && Array.isArray(sec.theory.advanced) ? sec.theory.advanced : []).map((b) => b.h));
    dg.forEach((d, i) => {
      ok(typeof d.caption === "string" && d.caption.trim().length >= 20,
        key + ": diagram " + (i + 1) + " has a meaningful caption");
      if (key === "ledger") {
        ok(d.after === "intro-end", key + ": diagram " + (i + 1) + " uses the intro-end sentinel");
      } else {
        const matches = headings.filter((h) => h === d.after).length;
        ok(matches === 1, key + ": diagram " + (i + 1) + " anchors to exactly one block heading",
          '"' + d.after + '" matches ' + matches + " block(s)");
      }
      /* the pure builder must produce a semantic figure for it */
      if (GL) {
        const html = GL.buildDiagram(d);
        ok(typeof html === "string" && html.indexOf("<figure") !== -1 && html.indexOf("<figcaption") !== -1,
          key + ": diagram " + (i + 1) + " builds to a semantic figure");
      }
    });
    /* the anchor API finds what the renderer will look for */
    if (GL && key !== "ledger") {
      const first = dg[0];
      ok(GL.diagramAfter(g, first.after) === first, key + ": GuidedLearn.diagramAfter resolves the anchored diagram");
    }
  }
});
ok(guideCount === 31, "all 31 chapters carry the guided-journey data", "got " + guideCount);

/* ============================================================
   2. The part files never author the same chapter twice
   ============================================================ */
const parts = sandbox.window.GUIDED_PARTS || [];
ok(Array.isArray(parts) && parts.length >= 4, "guided-learning.js pushes at least 4 part objects");
const seenKeys = {};
let dupes = [];
parts.forEach((part) => {
  if (!part || typeof part !== "object") return;
  Object.keys(part).forEach((k) => {
    if (seenKeys[k]) dupes.push(k);
    seenKeys[k] = true;
  });
});
ok(dupes.length === 0, "no chapter is authored in two different parts", dupes.join(", "));
ALL.forEach((key) => ok(!!seenKeys[key], key + ": appears in exactly one part file section"));

/* ============================================================
   3. The stage plan + pure roadmap state machine
   ============================================================ */
if (GL) {
  const planIds = GL.allPlanIds();
  ALL.forEach((key) => {
    const routeId = ROUTE[key];
    const plan = GL.stagePlan(routeId);
    ok(!!plan && typeof plan === "object", routeId + ": has a four-stage tab plan");
    if (!plan) return;
    ok(["learn", "understand", "practise", "remember"].every((s) => Array.isArray(plan[s]) && plan[s].length >= 1),
      routeId + ": every stage names at least one tab");
    /* no tab may belong to two stages (ambiguous navigation) */
    const all = [].concat(plan.learn, plan.understand, plan.practise, plan.remember);
    ok(new Set(all).size === all.length, routeId + ": no tab belongs to two stages at once");
    /* stageOfTab resolves every planned tab + falls back to practise */
    all.forEach((tab) => ok(GL.stageOfTab(tab, plan) !== null, routeId + ": stageOfTab resolves the " + tab + " tab"));
    ok(GL.stageOfTab("Some Dynamic Activity Lab", plan) === "practise",
      routeId + ": unknown (activity) tabs fall through to practise");
    /* firstStageTab finds a real tab for every stage */
    ["learn", "understand", "practise", "remember"].forEach((s) => {
      const t = GL.firstStageTab(routeId, s, all);
      ok(typeof t === "string" && plan[s].indexOf(t) !== -1,
        routeId + ": firstStageTab finds a " + s + " tab (" + t + ")");
    });
  });
  ok(planIds.length === 31, "the stage plan covers all 31 chapters", "got " + planIds.length);

  /* pure roadmap state machine */
  const fresh = GL.stageStates({ progress: 0, activeStage: "learn" });
  ok(fresh.length === 4 && fresh[0].state === "current" && fresh[1].state === "todo" &&
    fresh[2].state === "todo" && fresh[3].state === "todo", "fresh chapter: Learn is the current stage");
  const learned = GL.stageStates({ readinessAt: 1, progress: 0, activeStage: "understand" });
  ok(learned[0].state === "done" && learned[1].state === "current", "readiness submitted: Learn done, Understand current");
  const practised = GL.stageStates({ readinessAt: 1, understandAt: 1, progress: 100, activeStage: "practise" });
  ok(practised[2].state === "done", "progress 100: Practise is done");
  const partial = GL.stageStates({ readinessAt: 1, progress: 40, activeStage: "practise" });
  ok(partial[2].state === "current" && partial[2].sub === "40% solved", "partial progress reports the real percentage");
  const allDone = GL.stageStates({ readinessAt: 1, understandAt: 1, rememberAt: 1, progress: 100 });
  ok(allDone.every((s) => s.state === "done"), "every genuine marker done: the whole journey is done");
  const clamped = GL.stageStates({ progress: 150 });
  ok(clamped[2].sub === "all questions solved" && clamped[2].state === "done",
    "progress is clamped to 100 (150 behaves exactly like 100)");
}

/* ============================================================
   4. Source wiring — the shipped files actually use all of this
   ============================================================ */
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const glTag = indexHtml.indexOf('src="/guided-learning.js');
const appTag = indexHtml.indexOf('src="/app.js');
ok(glTag !== -1, "index.html loads guided-learning.js");
ok(glTag !== -1 && appTag !== -1 && glTag < appTag, "guided-learning.js loads before app.js");
ok(indexHtml.indexOf('src="/theory-upgrade.js') !== -1 && indexHtml.indexOf('src="/theory-upgrade.js') < glTag,
  "guided-learning.js loads after theory-upgrade.js");

const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
["function renderJourneyStepper", "function updateJourneyStepper", "function glAppendReadiness",
 "function glAppendCheckpoint", "function glAppendRecall", "function glAppendReviseStrip",
 "function glMcqCard", "function glDualChoiceCard", "function glChoiceCard", "function glChapterKeyOf",
 "guide: {}", "window.GuidedLearn.diagramAfter"].forEach((needle) => {
  ok(appSrc.indexOf(needle) !== -1, "app.js wires: " + needle);
});
ok(appSrc.indexOf("function theoryChrome") !== -1 &&
  appSrc.slice(appSrc.indexOf("function theoryChrome")).indexOf("glAppendCheckpoint") !== -1,
  "theoryChrome renders the guided checkpoint");

const css = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
[".gl-roadmap", ".gl-hook", ".gl-readiness", ".gl-checkpoint", ".gl-recall", ".gl-revise",
 ".gl-diagram", ".gl-flow", ".gl-taccount", ".gl-eqdiag"].forEach((sel) => {
  ok(css.indexOf(sel) !== -1, "styles.css styles " + sel);
});

const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
ok(sw.indexOf('"./guided-learning.js"') !== -1, "sw.js precaches guided-learning.js");
ok(/aba-cache-v\d+/.test(sw), "sw.js carries a versioned cache name");

const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
ok(pkg.scripts.test.indexOf("guided-learning-tests.js") !== -1, "package.json runs the guided-learning tests");

/* ---- report ---- */
console.log("\n  guided-learning-tests: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
