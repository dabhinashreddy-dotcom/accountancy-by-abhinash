/* Quick Revision suite — run from the site root:   node tests/revision-tests.js
   (Node 18+; no packages.)  Dev only, not loaded by the website.

   A. Every one of the 18 chapters ships a quickRevision block
   B. Each block carries the required learning layers
   C. List-shaped blocks hold non-empty strings; object blocks hold well-formed rows
   D. app.js: "Quick Revision" is the LAST tab on every chapter, and the shared
      renderer + the 3 previously-missing chapters are wired up
   E. search-index.js: every revision key (incl. examPoints/formulas/distinctions) is indexed
   F. renderRevisionHub lists all 18 chapters with a Quick Revision deep-link */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); }
}
function section(t) { console.log("\n" + t); }

const sandbox = { console }; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + ";this.__D=APP_DATA;", sandbox);
const D = sandbox.__D;
const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const idxSrc = fs.readFileSync(path.join(ROOT, "search-index.js"), "utf8");

/* all 18 chapters, keyed by their APP_DATA property name */
const CHAPTERS = ["intro", "terms", "tbase", "basis", "equation", "debitCredit", "journal",
  "ledger", "cashBook", "specialBooks2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj"];

/* ---------------- A. every chapter has a block ---------------- */
section("A. Every chapter ships a quickRevision block");
CHAPTERS.forEach(ch => {
  const qr = D[ch] && D[ch].quickRevision;
  ok(qr && typeof qr === "object", ch + " has quickRevision");
});

/* ---------------- B. required layers ---------------- */
section("B. Required learning layers (definition, method, mistakes, mnemonic, exam points)");
const LIST_METHODS = ["calculationSteps", "balancingSteps", "postingRules", "addLessLogic"];
CHAPTERS.forEach(ch => {
  const qr = (D[ch] || {}).quickRevision;
  if (!qr) return;
  ok(typeof qr.definition === "string" && qr.definition.trim().length > 40, ch + ".definition present");
  const method = LIST_METHODS.some(k => Array.isArray(qr[k]) && qr[k].length);
  ok(method, ch + " has a step-by-step method block");
  ok(Array.isArray(qr.commonMistakes) && qr.commonMistakes.length >= 2, ch + " has common mistakes");
  ok(typeof qr.mnemonic === "string" && qr.mnemonic.trim().length > 10, ch + " has a mnemonic");
  ok(Array.isArray(qr.examPoints) && qr.examPoints.length >= 3, ch + " has exam points");
});

/* ---------------- C. block shapes ---------------- */
section("C. Block shapes (strings non-empty, formulas well-formed, distinctions paired)");
CHAPTERS.forEach(ch => {
  const qr = (D[ch] || {}).quickRevision;
  if (!qr) return;
  ["keyPoints", "rules", "commonMistakes", "examPoints"].concat(LIST_METHODS).forEach(k => {
    if (qr[k] == null) return;
    ok(Array.isArray(qr[k]) && qr[k].every(s => typeof s === "string" && s.trim().length > 10),
      ch + "." + k + " is a list of non-empty strings");
  });
  if (qr.stepsTitle != null) ok(typeof qr.stepsTitle === "string" && qr.stepsTitle.trim(), ch + ".stepsTitle is a string");
  if (qr.rulesTitle != null) ok(typeof qr.rulesTitle === "string" && qr.rulesTitle.trim(), ch + ".rulesTitle is a string");
  if (qr.formulas != null) {
    ok(Array.isArray(qr.formulas) && qr.formulas.length > 0 &&
      qr.formulas.every(f => f && typeof f.label === "string" && typeof f.expr === "string" && f.expr.trim()),
      ch + ".formulas are {label, expr} pairs");
  }
  if (qr.distinctions != null) {
    ok(Array.isArray(qr.distinctions) && qr.distinctions.length > 0 &&
      qr.distinctions.every(d => d && Array.isArray(d.rows) && d.rows.length > 0 &&
        d.rows.every(r => Array.isArray(r) && r.length === 2 && typeof r[0] === "string")),
      ch + ".distinctions are {head?, rows:[[a,b]]}");
  }
  if (qr.formats != null) {
    ok(Array.isArray(qr.formats) && qr.formats.length > 0 &&
      qr.formats.every(f => f && Array.isArray(f.rows) && f.rows.length > 0),
      ch + ".formats are {title?, rows:[...]}");
  }
});

/* ---------------- D. app.js wiring ---------------- */
section("D. app.js — Quick Revision is the last tab everywhere, shared renderer wired");
// count tab arrays with Quick Revision last
{
  const re = /const tabs = \[([^\]]*)\]/g; let m, withQR = 0, qrLast = 0;
  while ((m = re.exec(appSrc))) {
    const arr = m[1].split(",").map(s => s.trim().replace(/^["']|["']$/g, ""));
    const i = arr.indexOf("Quick Revision");
    if (i !== -1) { withQR++; if (i === arr.length - 1) qrLast++; }
  }
  // the 4 chapters using renderNewChapterShell pass their tabs as the 3rd arg
  const shellRe = /renderNewChapterShell\(root,\s*"[a-z0-9]+",\s*\[([^\]]*)\]/g;
  let sm, shellWithQR = 0, shellQRLast = 0;
  while ((sm = shellRe.exec(appSrc))) {
    const arr = sm[1].split(",").map(s => s.trim().replace(/^["']|["']$/g, ""));
    const i = arr.indexOf("Quick Revision");
    if (i !== -1) { shellWithQR++; if (i === arr.length - 1) shellQRLast++; }
  }
  ok(withQR + shellWithQR >= 18, "at least 18 chapter tab arrays include Quick Revision",
    "hand-built " + withQR + " + shell " + shellWithQR);
  ok(qrLast === withQR && shellQRLast === shellWithQR, "Quick Revision is the last tab in every chapter array",
    (qrLast + shellQRLast) + "/" + (withQR + shellWithQR) + " last");
}
ok(/function renderQuickRevision\(panel, data, opts\)/.test(appSrc), "shared renderQuickRevision(panel, data, opts) exists");
["renderEqPracticeBank", "renderDCPracticeBank", "renderJRPracticeBank"].forEach(fn => {
  ok(appSrc.includes(fn), "dispatch for " + fn + " present");
});
// the three previously-missing chapters call the shared renderer with their accent
["var(--c-eq)", "var(--c-dc)", "var(--c-jr)"].forEach(accent => {
  ok(appSrc.includes(accent), "chapter accent " + accent + " used by a Quick Revision dispatch");
});
// the 12 existing wrappers delegate to the shared renderer
["renderIntroQuickRevision", "renderTermsQuickRevision", "renderTbaseQuickRevision", "renderBasisQuickRevision",
  "renderLedgerQuickRevision", "renderCashBookQuickRevision", "renderSp2QuickRevision", "renderBrsQuickRevision",
  "renderGstQuickRevision", "renderTbQuickRevision", "renderDepQuickRevision", "renderChNewQuickRevision"
].forEach(fn => {
  const m = new RegExp("function " + fn + "\\([^)]*\\) \\{\\s*renderQuickRevision\\(", "m").test(appSrc);
  ok(m, fn + " delegates to renderQuickRevision");
});

/* ---------------- E. search index covers new keys ---------------- */
section("E. search-index.js — examPoints + object blocks indexed");
["examPoints", "postingRules", "addLessLogic"].forEach(k => ok(idxSrc.includes("\"" + k + "\"") || idxSrc.includes("'" + k + "'"), "listKey " + k + " indexed"));
["formulas", "formats", "distinctions"].forEach(k => ok(idxSrc.includes("qr." + k), "object block qr." + k + " indexed"));

/* ---------------- F. hub lists every chapter ---------------- */
section("F. renderRevisionHub deep-links every chapter");
{
  const hubStart = appSrc.indexOf("function renderRevisionHub");
  const hubSrc = appSrc.slice(hubStart, hubStart + 4200);
  const routes = (hubSrc.match(/"ch-[a-z0-9]+"/g) || []);
  CHAPTERS.forEach(ch => {
    // map APP_DATA key to its route slug
    const slug = { specialBooks2: "sp2", debitCredit: "dc", journal: "jr", cashBook: "cb",
      equation: "eq", ledger: "lg", brs: "brs", gst: "gst", tb: "tb", dep: "dep" }[ch] || ch;
    ok(routes.includes('"ch-' + slug + '"'), "hub card for ch-" + slug);
  });
  ok(hubSrc.includes('"Quick Revision"'), "hub cards pass the Quick Revision tab for deep-linking");
}

/* ---------------- report ---------------- */
console.log("\n" + "=".repeat(60));
console.log("Revision tests: " + pass + " passed / " + fail + " failed");
if (failures.length) {
  console.log("\nFailures:");
  failures.slice(0, 40).forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
