/* ============================================================
   Fragment validator — questions-expanded/validate-fragment.js

   Checks authored exam questions against the authoring spec
   (questions-expanded/QUESTION-AUTHORING-SPEC.md).

   Usage:
     node questions-expanded/validate-fragment.js <file.js> [--chapter jr] [--min 36]
     node questions-expanded/validate-fragment.js --all
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const TYPES = ["mcq", "multi", "numerical", "matching", "case"];
const DIFFS = ["Easy", "Medium", "Hard"];
const CHAPTERS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "lg",
  "cb", "sp2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];
const TAGS = ["competency", "hots", "numerical", "image", "assertion-reason",
  "statement", "application", "case-study", "conceptual"];
const AR_OPTIONS = [
  "Both A and R are true and R is the correct explanation of A",
  "Both A and R are true but R is not the correct explanation of A",
  "A is true but R is false",
  "A is false but R is true"
];

/* Provenance must never reach the student-facing surface. */
const FORBIDDEN = [
  /\bpyq\b/i, /previous[\s-]?year/i, /past[\s-]?paper/i, /sample[\s-]?paper/i,
  /\bcbe\s*sample\b/i, /question\s*paper\s*source/i, /source\s*:/i, /https?:\/\//i,
  /\bwww\./i, /\bcbse\s+question\b/i, /\bboard\s+paper\s+of\s+20/i, /\bextracted\s+from\b/i
];

function norm(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function fingerprint(q) {
  const parts = [q.q || "", (q.passage || "")];
  (q.subs || []).forEach((s) => parts.push(s.q || ""));
  return norm(parts.join(" "));
}

function load(file) {
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { module: { exports: {} }, exports: {} };
  const fn = new Function("module", "exports",
    code + "\n; return (typeof module === 'object' && module.exports && module.exports.length !== undefined) ? module.exports : null;");
  const out = fn(sandbox.module, sandbox.exports);
  if (Array.isArray(out)) return out;
  throw new Error("fragment did not export an array: " + file);
}

function checkItem(q, i, opts, errors, warns) {
  const where = (label) => `item[${i}] (${q && q.id ? q.id : "?"}) ${label}`;
  if (!q || typeof q !== "object") { errors.push(`item[${i}] is not an object`); return; }
  if (typeof q.id !== "string" || !/^x-[a-z0-9]{1,5}-\d{4}$/.test(q.id)) errors.push(where("bad id"));
  if (opts.chapter && q.chapter !== opts.chapter) errors.push(where(`chapter must be "${opts.chapter}" got "${q.chapter}"`));
  if (CHAPTERS.indexOf(q.chapter) === -1) errors.push(where("unknown chapter"));
  if (typeof q.topic !== "string" || !q.topic.trim() || q.topic.length > 60) errors.push(where("topic missing/too long"));
  if (TYPES.indexOf(q.type) === -1) errors.push(where("bad type"));
  if (DIFFS.indexOf(q.difficulty) === -1) errors.push(where("bad difficulty"));
  if (!Number.isInteger(q.marks) || q.marks < 1 || q.marks > 20) errors.push(where("marks must be 1..20 integer"));
  if (typeof q.q !== "string" || q.q.trim().length < 8) errors.push(where("q missing"));
  if (typeof q.explanation !== "string" || q.explanation.trim().length < 12) errors.push(where("explanation missing/too short"));
  if (!Array.isArray(q.tags)) errors.push(where("tags must be an array (may be empty)"));
  else q.tags.forEach((t) => { if (TAGS.indexOf(t) === -1) errors.push(where(`unknown tag "${t}"`)); });
  if (!q.provenance || q.provenance.kind !== "new" || q.provenance.verified !== true) errors.push(where("provenance must be {kind:'new',verified:true}"));

  const studentText = [q.q, q.passage, (q.options || []).join(" "), (q.left || []).join(" "),
    (q.right || []).join(" "), (q.subs || []).map((s) => s.q + " " + (s.options || []).join(" ")).join(" ")].join(" \u0000 ");
  FORBIDDEN.forEach((re) => { if (re.test(studentText)) errors.push(where(`student-facing text matches ${re}`)); });

  if (q.image) {
    if (typeof q.image.src !== "string" || !/^assets\/questions\/[a-z0-9._-]+$/i.test(q.image.src)) errors.push(where("image.src must be assets/questions/<file>"));
    if (typeof q.image.alt !== "string" || q.image.alt.length < 15) errors.push(where("image.alt too short"));
    if (typeof q.image.table !== "string" || q.image.table.length < 15) errors.push(where("image.table (text alternative) required"));
  }

  if (q.type === "mcq") {
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(where("mcq needs exactly 4 options"));
    else if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3) errors.push(where("answerIndex out of range"));
    else if (new Set(q.options.map(norm)).size !== 4) errors.push(where("mcq options must be distinct"));
  } else if (q.type === "multi") {
    if (!Array.isArray(q.options) || q.options.length < 4 || q.options.length > 5) errors.push(where("multi needs 4-5 options"));
    if (!Array.isArray(q.answers) || q.answers.length < 2) errors.push(where("multi needs >=2 correct answers"));
    else {
      const uniq = new Set(q.answers);
      if (uniq.size !== q.answers.length) errors.push(where("multi answers duplicate"));
      q.answers.forEach((a) => { if (!Number.isInteger(a) || a < 0 || a >= (q.options || []).length) errors.push(where("multi answer index out of range")); });
      const sorted = q.answers.slice().sort((a, b) => a - b);
      if (sorted.join() !== q.answers.join()) errors.push(where("multi answers must be ascending"));
      if (q.answers.length >= (q.options || []).length) errors.push(where("multi cannot mark every option correct"));
    }
  } else if (q.type === "numerical") {
    if (typeof q.value !== "number" || !isFinite(q.value)) errors.push(where("numerical value must be a finite number"));
    if (typeof q.tolerance !== "number" || q.tolerance < 0) errors.push(where("tolerance must be >= 0"));
    if (q.tolerance > 0 && q.tolerance > Math.abs(q.value) * 0.05) warns.push(where("tolerance is very wide"));
    ["prefix", "suffix", "unit"].forEach((k) => { if (q[k] !== undefined && typeof q[k] !== "string") errors.push(where(k + " must be a string")); });
  } else if (q.type === "matching") {
    if (!Array.isArray(q.left) || q.left.length < 3) errors.push(where("matching needs >=3 left items"));
    if (!Array.isArray(q.right) || q.right.length < 4) errors.push(where("matching needs >=4 right options"));
    if (!Array.isArray(q.answerSlots)) errors.push(where("answerSlots required"));
    else {
      if (Array.isArray(q.left) && q.answerSlots.length !== q.left.length) errors.push(where("answerSlots length must equal left length"));
      const seen = new Set();
      q.answerSlots.forEach((a, k) => {
        if (!Number.isInteger(a) || a < 0 || a >= (q.right || []).length) errors.push(where(`answerSlots[${k}] out of range`));
        if (seen.has(a)) errors.push(where(`answerSlots reuses right option ${a}`));
        seen.add(a);
      });
      if (Array.isArray(q.left) && q.left.length === q.answerSlots.length && new Set(q.left.map(norm)).size !== q.left.length) errors.push(where("left items must be distinct"));
      if (Array.isArray(q.right) && new Set(q.right.map(norm)).size !== q.right.length) errors.push(where("right options must be distinct"));
    }
  } else if (q.type === "case") {
    if (typeof q.passage !== "string" || q.passage.trim().length < 60) errors.push(where("case passage too short"));
    if (!Array.isArray(q.subs) || q.subs.length < 2 || q.subs.length > 4) errors.push(where("case needs 2-4 subs"));
    else {
      let sum = 0;
      q.subs.forEach((s, k) => {
        const w2 = `case sub[${k}]`;
        if (!s || typeof s !== "object") { errors.push(where(w2 + " not an object")); return; }
        if (typeof s.q !== "string" || s.q.trim().length < 6) errors.push(where(w2 + " q missing"));
        if (TYPES.indexOf(s.type) === -1 || s.type === "case" || s.type === "matching") errors.push(where(w2 + " type must be mcq|multi|numerical"));
        if (typeof s.explanation !== "string" || s.explanation.trim().length < 12) errors.push(where(w2 + " explanation missing"));
        if (!Number.isInteger(s.marks) || s.marks < 1) errors.push(where(w2 + " marks invalid"));
        else sum += s.marks;
        if (s.type === "mcq") {
          if (!Array.isArray(s.options) || s.options.length !== 4) errors.push(where(w2 + " needs 4 options"));
          if (!Number.isInteger(s.answerIndex) || s.answerIndex < 0 || s.answerIndex > 3) errors.push(where(w2 + " answerIndex out of range"));
        } else if (s.type === "multi") {
          if (!Array.isArray(s.options) || s.options.length < 4) errors.push(where(w2 + " needs >=4 options"));
          if (!Array.isArray(s.answers) || s.answers.length < 2) errors.push(where(w2 + " needs >=2 answers"));
        } else if (s.type === "numerical") {
          if (typeof s.value !== "number" || !isFinite(s.value)) errors.push(where(w2 + " value invalid"));
          if (typeof s.tolerance !== "number" || s.tolerance < 0) errors.push(where(w2 + " tolerance invalid"));
        }
      });
      if (sum !== q.marks) errors.push(where(`marks ${q.marks} != sum of subs ${sum}`));
    }
  }
}

function summarise(items) {
  const byType = {}, byDiff = {}, byTag = {}, ansPos = {};
  let codes = 0;
  items.forEach((q) => {
    byType[q.type] = (byType[q.type] || 0) + 1;
    byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    (q.tags || []).forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; });
    if (q.type === "mcq") { ansPos[q.answerIndex] = (ansPos[q.answerIndex] || 0) + 1; codes++; }
    (q.subs || []).forEach((s) => { if (s.type === "mcq") { ansPos[s.answerIndex] = (ansPos[s.answerIndex] || 0) + 1; codes++; } });
  });
  return { byType, byDiff, byTag, ansPos, mcqCodes: codes };
}

function run(file, opts) {
  const errors = [], warns = [];
  let items;
  try { items = load(file); }
  catch (e) { return { errors: [file + " failed to load: " + e.message], warns: [], items: [] }; }

  const seenIds = new Set();
  const seenFp = new Map();
  items.forEach((q, i) => {
    checkItem(q, i, opts, errors, warns);
    if (q && q.id) {
      if (seenIds.has(q.id)) errors.push(`item[${i}] duplicate id ${q.id}`);
      seenIds.add(q.id);
    }
    const fp = q ? fingerprint(q) : "";
    if (fp) {
      if (seenFp.has(fp)) errors.push(`item[${i}] (${q.id}) duplicates the text of item[${seenFp.get(fp)}]`);
      else seenFp.set(fp, i);
    }
  });

  if (opts.min && items.length < opts.min) errors.push(`only ${items.length} questions, minimum is ${opts.min}`);
  const s = summarise(items);

  if (opts.profile === "long") {
    /* Multi-mark bank: supplies the 2/3/4/6-mark slots of the CBSE
       Board Mock Test. Schema checks already ran; here we only care
       that every chapter has long-form material and that each mark
       level is adequately stocked. */
    const needMarks = { 2: 24, 3: 18, 4: 18, 6: 18 };
    const byMarks = {};
    const byCh = {};
    items.forEach((q) => {
      if (!q) return;
      byMarks[q.marks] = (byMarks[q.marks] || 0) + 1;
      (byCh[q.chapter] = byCh[q.chapter] || []).push(q);
    });
    Object.keys(needMarks).forEach((m) => {
      if ((byMarks[m] || 0) < needMarks[m]) errors.push(`only ${byMarks[m] || 0} questions of ${m} marks, need ${needMarks[m]}`);
    });
    CHAPTERS.forEach((ch) => {
      const long = (byCh[ch] || []).filter((q) => q.marks >= 2).length;
      if (long < 3) errors.push(`chapter "${ch}" has only ${long} multi-mark questions, minimum 3`);
    });
    items.forEach((q, i) => {
      if ([1, 2, 3, 4, 6].indexOf(q.marks) === -1) errors.push(`item[${i}] (${q.id}) marks ${q.marks} is not one of 1,2,3,4,6`);
      if (q.marks > 1 && q.type === "case") {
        if (!q.subs || !q.subs.length) errors.push(`item[${i}] (${q.id}) multi-mark case has no subs`);
      }
      if (q.marks > 1 && q.type === "mcq") {
        /* a multi-mark single MCQ is only sound as an assertion-reason
           or statement question, where partial credit is meaningless */
        const t = q.tags || [];
        if (t.indexOf("assertion-reason") === -1 && t.indexOf("statement") === -1) {
          warns.push(`item[${i}] (${q.id}) is a ${q.marks}-mark single-answer mcq — make sure this is deliberate`);
        }
      }
    });
    void s;
  } else if (opts.min) {
    /* per-chapter minimums, mirroring spec section 7 */
    const byCh = {};
    items.forEach((q) => { if (q && q.chapter) (byCh[q.chapter] = byCh[q.chapter] || []).push(q); });
    const need = { mcq: 15, case: 4, multi: 4, matching: 2, numerical: 3 };
    Object.keys(byCh).forEach((ch) => {
      const list = byCh[ch];
      const t = {}, tag = {}, diff = {};
      list.forEach((q) => {
        t[q.type] = (t[q.type] || 0) + 1;
        diff[q.difficulty] = (diff[q.difficulty] || 0) + 1;
        (q.tags || []).forEach((x) => { tag[x] = (tag[x] || 0) + 1; });
      });
      if (list.length < 36) errors.push(`chapter "${ch}" has ${list.length} questions, minimum 36`);
      Object.keys(need).forEach((k) => { if ((t[k] || 0) < need[k]) errors.push(`chapter "${ch}" type "${k}" has ${t[k] || 0}, minimum ${need[k]}`); });
      if ((tag.competency || 0) < 6) errors.push(`chapter "${ch}" needs >=6 "competency" questions, got ${tag.competency || 0}`);
      if ((tag.hots || 0) < 5) errors.push(`chapter "${ch}" needs >=5 "hots" questions, got ${tag.hots || 0}`);
      if (((tag["assertion-reason"] || 0) + (tag.statement || 0)) < 4) errors.push(`chapter "${ch}" needs >=4 assertion-reason or statement questions`);
      const pct = (d) => list.length ? (diff[d] || 0) / list.length * 100 : 0;
      if (pct("Easy") < 20 || pct("Easy") > 55) warns.push(`chapter "${ch}": Easy share ${pct("Easy").toFixed(0)}% (aim ~35%)`);
      if (pct("Hard") < 8 || pct("Hard") > 35) warns.push(`chapter "${ch}": Hard share ${pct("Hard").toFixed(0)}% (aim ~20%)`);
      const zeros = list.reduce((n, q) => n + (q.type === "mcq" && q.answerIndex === 0 ? 1 : 0), 0);
      const mcqs = list.filter((q) => q.type === "mcq").length;
      if (mcqs && zeros / mcqs > 0.55) warns.push(`chapter "${ch}": answerIndex 0 holds ${(zeros / mcqs * 100).toFixed(0)}% of its MCQs`);
    });
    void s;
  }
  return { errors, warns, items, summary: s };
}

function main() {
  const args = process.argv.slice(2);
  let files, opts = {};
  if (args[0] === "--all") {
    const dir = __dirname;
    files = fs.readdirSync(dir).filter((f) => /^q-.*\.js$/.test(f)).map((f) => path.join(dir, f)).sort();
    const mi = args.indexOf("--min");
    if (mi >= 0) opts.min = parseInt(args[mi + 1], 10);
  } else {
    files = [args[0]];
    const ci = args.indexOf("--chapter");
    if (ci >= 0) opts.chapter = args[ci + 1];
    const mi = args.indexOf("--min");
    if (mi >= 0) opts.min = parseInt(args[mi + 1], 10);
    const pi = args.indexOf("--profile");
    if (pi >= 0) opts.profile = args[pi + 1];
  }
  let bad = 0;
  const allIds = new Map();
  files.forEach((f) => {
    const r = run(f, opts);
    r.items.forEach((q) => {
      if (!q) return;
      if (allIds.has(q.id)) r.errors.push(`GLOBAL duplicate id ${q.id} also used in ${allIds.get(q.id)}`);
      allIds.set(q.id, f);
    });
    console.log("\n=== " + path.basename(f) + " ===");
    console.log(`questions: ${r.items.length}`);
    if (r.summary) {
      console.log("types:      " + JSON.stringify(r.summary.byType));
      console.log("difficulty: " + JSON.stringify(r.summary.byDiff));
      console.log("tags:       " + JSON.stringify(r.summary.byTag));
      console.log("answerPos:  " + JSON.stringify(r.summary.ansPos));
    }
    if (r.warns.length) { console.log("WARNINGS:"); r.warns.forEach((w) => console.log("  ! " + w)); }
    if (r.errors.length) { bad += r.errors.length; console.log("ERRORS:"); r.errors.slice(0, 60).forEach((e) => console.log("  x " + e)); }
    else console.log("OK");
  });
  console.log(`\nTOTAL ERRORS: ${bad}`);
  process.exit(bad ? 1 : 0);
}

if (require.main === module) main();
module.exports = { load, run, fingerprint, norm, CHAPTERS, TYPES };
