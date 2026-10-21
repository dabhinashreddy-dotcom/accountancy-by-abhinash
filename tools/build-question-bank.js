/* ============================================================
   tools/build-question-bank.js

   Concatenates questions-expanded/q-groupNN.js into
   questions-expanded.js — the single data file the site loads.

   Source fragments stay separate so they can be authored and
   reviewed one chapter group at a time; the shipped file stays
   one script tag.

     node tools/build-question-bank.js

   The build FAILS (exit 1) if any fragment fails to parse, if two
   questions share an id or share normalised wording, or if any
   question fails ExamRules' answer-key check.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "questions-expanded");
const OUT = path.join(ROOT, "questions-expanded.js");
const validator = require(path.join(SRC, "validate-fragment.js"));
const ExamRules = require(path.join(ROOT, "exam-rules.js"));

function main() {
  const files = fs.readdirSync(SRC)
    .filter((f) => /^q-group\d+\.js$/.test(f))
    .sort();

  if (!files.length) {
    console.error("No questions-expanded/q-groupNN.js fragments found.");
    process.exit(1);
  }

  const all = [];
  let errors = [];

  files.forEach((f) => {
    const full = path.join(SRC, f);
    let items;
    try {
      items = validator.load(full);
    } catch (e) {
      errors.push(`${f}: failed to load — ${e.message}`);
      return;
    }
    /* per-item schema check (no quantity profile: those are enforced
       by each author's own run, and by tests/question-bank-tests.js) */
    const r = validator.run(full, {});
    errors = errors.concat(r.errors.map((e) => `${f}: ${e}`));
    console.log(`${f.padEnd(18)} ${String(items.length).padStart(4)} questions`);
    items.forEach((q) => all.push(q));
  });

  /* global integrity: ids, wording, answer keys */
  const seenId = new Map();
  const seenFp = new Map();
  all.forEach((q, i) => {
    if (seenId.has(q.id)) errors.push(`duplicate id ${q.id} (${q.chapter})`);
    else seenId.set(q.id, i);
    const fp = validator.fingerprint(q);
    if (fp) {
      if (seenFp.has(fp)) errors.push(`duplicate wording: ${q.id} repeats ${all[seenFp.get(fp)].id}`);
      else seenFp.set(fp, i);
    }
    if (!ExamRules.questionKeyValid(q)) {
      errors.push(`ungradable answer key: ${q.id} (${q.type})`);
    }
    if (q.marks > 1 && q.type !== "case" && q.type !== "multi" &&
        q.type !== "numerical" && q.type !== "matching") {
      errors.push(`${q.id}: ${q.marks}-mark ${q.type} is not an auto-grad-able shape`);
    }
  });

  if (errors.length) {
    console.error(`\nBUILD FAILED — ${errors.length} problem(s):`);
    errors.slice(0, 80).forEach((e) => console.error("  x " + e));
    process.exit(1);
  }

  const body = [
    "/* ============================================================",
    "   EXPANDED EXAMINATION BANK — GENERATED FILE, DO NOT EDIT BY HAND.",
    "",
    "   Sources   : questions-expanded/q-groupNN.js",
    "   Rebuild   : node tools/build-question-bank.js",
    "   Schema    : questions-expanded/QUESTION-AUTHORING-SPEC.md",
    "   Validate  : node questions-expanded/validate-fragment.js --all",
    "",
    "   Authored for the CBSE Class 11 Accountancy (055) syllabus.",
    "   Provenance metadata is internal only and is never rendered.",
    "   ============================================================ */",
    "(function (root, factory) {",
    '  if (typeof module === "object" && module.exports) module.exports = factory();',
    "  else root.EXAM_QUESTIONS_EXPANDED = factory();",
    '})(typeof self !== "undefined" ? self : this, function () {',
    '  "use strict";',
    "  return " + JSON.stringify(all, null, 0) + ";",
    "});",
    ""
  ].join("\n");

  fs.writeFileSync(OUT, body, "utf8");

  /* summary */
  const byChapter = {}, byType = {}, byMarks = {}, byDiff = {};
  let tags = {}, provenance = {};
  all.forEach((q) => {
    byChapter[q.chapter] = (byChapter[q.chapter] || 0) + 1;
    byType[q.type] = (byType[q.type] || 0) + 1;
    byMarks[q.marks] = (byMarks[q.marks] || 0) + 1;
    byDiff[q.difficulty] = (byDiff[q.difficulty] || 0) + 1;
    (q.tags || []).forEach((t) => { tags[t] = (tags[t] || 0) + 1; });
    const k = (q.provenance && q.provenance.kind) || "?";
    provenance[k] = (provenance[k] || 0) + 1;
  });

  console.log(`\nWrote ${path.relative(process.cwd(), OUT)} — ${all.length} questions, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
  console.log("by chapter : " + JSON.stringify(byChapter));
  console.log("by type    : " + JSON.stringify(byType));
  console.log("by marks   : " + JSON.stringify(byMarks));
  console.log("difficulty : " + JSON.stringify(byDiff));
  console.log("tags       : " + JSON.stringify(tags));
  console.log("provenance : " + JSON.stringify(provenance));
}

main();
