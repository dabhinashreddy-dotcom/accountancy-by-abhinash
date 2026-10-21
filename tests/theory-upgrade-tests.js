/* ============================================================
   theory-upgrade-tests.js — v92 Part 2 structural contract.

   Loads the REAL data pipeline in a Node vm exactly as the browser
   does (data.js -> data-12.js -> data-12a..l.js -> classes.js ->
   theory-upgrade.js) and verifies, for EVERY Class 11 and Class 12
   chapter, that the theory upgrade is complete and safe:

     - every chapter has the learning chrome (introduction,
       objectives, common mistakes, recap, check-your-understanding)
       with substantive, non-empty strings;
     - every chapter's theory grew (simple and advanced both carry
       the original blocks PLUS the new ones);
     - every block has a string heading (the search index and the
       renderer both need it);
     - NO string anywhere in the upgrade contains raw HTML
       characters (< or >) — the renderers interpolate innerHTML
       unescaped, so a stray tag would break the page;
     - the context map that routes the chapter chrome into the
       shared renderer is populated for both theory arrays.

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
function eq(a, b, label, detail) { ok(a === b, label, (detail || "") + " (got " + JSON.stringify(a) + ", expected " + JSON.stringify(b) + ")"); }

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

const D = sandbox.__D;
ok(!!D && typeof D === "object", "the data pipeline loads (APP_DATA exists)");

/* ---- the complete chapter checklist (18 + 13) ---- */
const C11 = ["intro", "terms", "tbase", "basis", "equation", "debitCredit", "journal", "ledger", "cashBook", "specialBooks2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
const C12 = ["pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin", "fsa", "rat", "cf", "ca"];
/* Original block counts (pre-upgrade) + the guaranteed minimum the
   part files were authored to deliver (>= 3 new blocks and >= 3 new
   advanced blocks per chapter; ledger has no theory by design). */
const ORIG = {
  intro: [4, 7], terms: [3, 5], tbase: [3, 6], basis: [3, 5], equation: [3, 3], debitCredit: [3, 3], journal: [3, 3], ledger: [0, 0],
  cashBook: [13, 14], specialBooks2: [11, 9], brs: [8, 14], gst: [5, 10], tb: [4, 6], dep: [9, 18], pres: [6, 6], roe: [8, 6], fs: [7, 6], adj: [8, 7],
  pf: [3, 3], gw: [3, 3], psr: [3, 3], adm: [3, 3], ret: [3, 3], dis: [3, 3], sc: [3, 3], deb: [3, 3], cfin: [3, 3], fsa: [3, 3], rat: [3, 3], cf: [3, 3], ca: [3, 3]
};
const NEW_BLOCKS_MIN = 3;

function badChars(s) { return s.indexOf("<") !== -1 || s.indexOf(">") !== -1; }
function strArrOk(arr, minLen, minChars) {
  return Array.isArray(arr) && arr.length >= minLen &&
    arr.every((s) => typeof s === "string" && s.trim().length >= minChars && !badChars(s));
}

let upgraded = 0;
C11.concat(C12).forEach((key) => {
  const sec = D[key];
  ok(!!sec && typeof sec === "object", key + ": chapter content exists in APP_DATA");
  if (!sec) return;
  const up = sec.upgrade;
  ok(!!up, key + ": carries the v92 upgrade block");
  if (!up) return;
  upgraded++;

  /* A. chapter introduction — 3+ substantial paragraphs */
  ok(strArrOk(up.intro, 3, 80), key + ": introduction has 3+ substantial paragraphs",
    up.intro ? "got " + up.intro.length + " paragraph(s)" : "missing");
  /* B. learning objectives — 5+ short points */
  ok(strArrOk(up.objectives, 5, 20), key + ": learning objectives has 5+ points",
    up.objectives ? "got " + up.objectives.length : "missing");
  /* H. common mistakes — 4+ chapter-specific entries */
  ok(strArrOk(up.mistakes, 4, 25), key + ": common mistakes has 4+ entries",
    up.mistakes ? "got " + up.mistakes.length : "missing");
  /* I. quick recap — 6+ points */
  ok(strArrOk(up.summary, 6, 20), key + ": quick recap has 6+ points",
    up.summary ? "got " + up.summary.length : "missing");
  /* J. check your understanding — 3+ question/answer pairs */
  ok(Array.isArray(up.check) && up.check.length >= 3, key + ": check-your-understanding has 3+ questions",
    up.check ? "got " + up.check.length : "missing");
  if (Array.isArray(up.check)) {
    ok(up.check.every((c) => c && typeof c.q === "string" && c.q.trim().length >= 15 && typeof c.a === "string" && c.a.trim().length >= 15 && !badChars(c.q) && !badChars(c.a)),
      key + ": every check question and answer is substantive and tag-free");
  }

  /* C/D. theory grew — originals preserved, new blocks appended */
  if (key !== "ledger") {
    const simple = (sec.theory && sec.theory.simple) || [];
    const adv = (sec.theory && sec.theory.advanced) || [];
    ok(simple.length >= ORIG[key][0] + NEW_BLOCKS_MIN, key + ": theory.simple grew by >= " + NEW_BLOCKS_MIN + " blocks (originals preserved)",
      "simple=" + simple.length + ", original=" + ORIG[key][0]);
    ok(adv.length >= ORIG[key][1] + NEW_BLOCKS_MIN, key + ": theory.advanced grew by >= " + NEW_BLOCKS_MIN + " blocks (originals preserved)",
      "advanced=" + adv.length + ", original=" + ORIG[key][1]);
    ok(simple.concat(adv).every((b) => b && typeof b.h === "string" && b.h.trim().length >= 3), key + ": every theory block has a string heading");
    /* new-field sanity: enrichment fields, where present, are the right shape and tag-free */
    const newBlocks = simple.slice(ORIG[key][0]).concat(adv.slice(ORIG[key][1]));
    ok(newBlocks.every((b) => {
      const strFields = ["p", "p2", "formula", "simple", "real", "example", "note", "tip"].filter((f) => typeof b[f] === "string");
      if (strFields.some((f) => badChars(b[f]))) return false;
      if (b.list && !Array.isArray(b.list)) return false;
      if (Array.isArray(b.mistakes) && b.mistakes.some((m) => typeof m !== "string" || badChars(m))) return false;
      if (b.confusion && (typeof b.confusion !== "object" || badChars(String(b.confusion.diff || "")))) return false;
      return true;
    }), key + ": every NEW block is tag-free and well-shaped");
  } else {
    ok(!sec.theory || ((!sec.theory.simple || !sec.theory.simple.length) && (!sec.theory.advanced || !sec.theory.advanced.length)),
      "ledger: keeps its own introduction structure (no stray theory arrays)");
  }

  /* the context map the shared renderer uses (both arrays marked) */
  const map = sandbox.THEORY_CTX_MAP;
  if (key !== "ledger" && map && sec.theory) {
    ok(!!map.get(sec.theory.simple) && map.get(sec.theory.simple).kind === "simple", key + ": simple array routed through the theory context map");
    ok(!!map.get(sec.theory.advanced) && map.get(sec.theory.advanced).kind === "advanced", key + ": advanced array routed through the theory context map");
  }
});

eq(upgraded, C11.length + C12.length, "all 31 chapters (18 Class 11 + 13 Class 12) carry the upgrade");

/* every part key was a real chapter key — no typos, no strays */
const parts = sandbox.THEORY_UPGRADE_PARTS || [];
const partKeys = parts.reduce((acc, p) => acc.concat(Object.keys(p || {})), []);
ok(partKeys.every((k) => C11.indexOf(k) !== -1 || C12.indexOf(k) !== -1), "every part-file key is a real chapter key");
eq(partKeys.filter((k, i) => partKeys.indexOf(k) !== i).length, 0, "no chapter is upgraded twice (no duplicated registrations)");

console.log("\nTheory upgrade tests: " + passed + " passed, " + failed + " failed");
process.exit(failed ? 1 : 0);
