/* v93 hardening — regression tests.   Run:  node tests/exam-hardening-tests.js
   (Node 18+, no packages.)  Dev only, not loaded by the website.

   The behavioural monitor contracts (proximity maths, the mandatory
   pre-check verdict, the live move-away rule, immediate phone, the
   audio timing band) live in tests/exam-monitor-tests.js sections A/F/
   I/N. This suite covers the v93 contract that is verified from SOURCE
   and file STATE:
     A  Encoding: repo-wide mojibake scan, BOM checks, charset pin —
        the v93 text-encoding repair, kept repaired forever
     B  Study-tool lock: the runtime guards, the close-on-attach pass
        and the CSS layer that keeps panels out of the exam screen
     C  Step 1 preparation callout: content, mandatory acknowledgement,
        no attempt consumed by reading
     D  About: the "Watch: A quick look at the website" video section
        is truly removed (not CSS-hidden)
     E  Policy completeness: every violation type has a REASONS
        sentence and an EXAM_SECURITY_POLICY action; the health-loop
        interval bug stays fixed; the warning banner counts down the
        engine's real grace
*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const M = require(path.join(ROOT, "exam-monitor.js"));
const ExamSecurity = require(path.join(ROOT, "exam-security.js"));
const ExamRules = require(path.join(ROOT, "exam-rules.js"));

const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
const cssSrc = fs.readFileSync(path.join(ROOT, "styles.css"), "utf8");
const indexSrc = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const monitorSrc = fs.readFileSync(path.join(ROOT, "exam-monitor.js"), "utf8");

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

/* ============================================================
   A. ENCODING — the v93 repair must stay repaired.
   The corruption signature is a CP1252 re-decode of UTF-8 bytes:
   Ã/Â/â followed by continuation-range chars, or the replacement
   character. tools/repair-encoding.js contains this regex LITERALLY
   (it is the repair itself), so it is excluded with a comment. */
section("A. Encoding: repo-wide mojibake scan, BOM checks, charset");
{
  const MARKERS = /[\u00C3\u00C2\u00E2][\u0080-\u00BF\u00A0-\u00FF\u20AC\u2013-\u201E\u2020-\u2022\u2026\u2030\u2039\u2122\u0152-\u0161\u0178-\u017E\u02DC\u0192\u02C6\u203A]|\uFFFD/;
  const SKIP_DIRS = new Set(["node_modules", ".git", "vision", "dist-tmp"]);
  const SKIP_FILES = new Set(["tools/repair-encoding.js"]);   /* holds this regex LITERALLY - it IS the repair */
  const EXT = new Set([".html", ".js", ".css", ".md", ".json", ".svg", ".webmanifest", ".txt"]);
  const scanned = [];
  const bad = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name)) walk(abs);
      } else if (EXT.has(path.extname(e.name)) &&
                 !SKIP_FILES.has(path.relative(ROOT, abs).split(path.sep).join("/"))) {
        scanned.push(abs);
        const src = fs.readFileSync(abs, "utf8");
        const m = src.match(MARKERS);
        if (m) bad.push(path.relative(ROOT, abs) + " :: " + JSON.stringify(m.slice(0, 3)));
      }
    }
  })(ROOT);
  ok(scanned.length >= 190, "the scan really covers the tree", scanned.length + " files scanned");
  eq(bad.length, 0, "no file anywhere carries the double-encoding mojibake signature", bad.join(" | "));

  // BOMs (a PowerShell write artifact) stay gone from the shipped text.
  const bomCheck = (rel) => {
    const b = fs.readFileSync(path.join(ROOT, rel)).subarray(0, 3);
    return !(b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF);
  };
  ok(bomCheck("index.html"), "index.html carries no BOM");
  ok(bomCheck("theory-upgrade.js"), "theory-upgrade.js carries no BOM");
  ok(bomCheck("app.js"), "app.js carries no BOM");
  ok(bomCheck("styles.css"), "styles.css carries no BOM");

  // The template every page is built from declares UTF-8.
  ok(/<meta charset="UTF-8"\s*\/?>/.test(indexSrc), "index.html declares <meta charset=\"UTF-8\">");

  // The theory upgrade loads and keeps its structure after repair.
  const sandbox = { console };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "theory-upgrade.js"), "utf8"), sandbox);
  const parts = sandbox.THEORY_UPGRADE_PARTS;
  ok(Array.isArray(parts) && parts.length >= 4, "theory-upgrade.js still parses into its parts", String(parts && parts.length));
  const k = Object.keys(parts[0] || {});
  ["intro", "terms", "tbase", "basis", "equation", "debitCredit"].forEach((key) =>
    ok(k.indexOf(key) !== -1, "theory-upgrade part 1 keeps chapter key " + key));

  // The repaired copy is the only pipeline into the generated pages.
  const about = fs.readFileSync(path.join(ROOT, "about", "index.html"), "utf8");
  ok(!MARKERS.test(about), "generated pages are rebuilt from the clean template");
}

/* ============================================================
   B. STUDY-TOOL LOCK — an active exam blocks every built-in tool
   on every pathway, with a clear message and without touching the
   exam itself. */
section("B. Study-tool lock: guards, close-on-attach, CSS layer");
{
  // 1. openPanel — the central funnel every pathway uses — refuses.
  ok(/function openPanel\(id\) \{\s*\n\s*if \(examToolsLocked\(\)\)/.test(appSrc),
    "openPanel refuses to open a tool while the exam is live");
  ok(/function examToolsLocked\(\)/.test(appSrc), "the lock predicate exists");
  ok(/classList\.contains\("exam-live"\)/.test(appSrc), "the lock reads the exam-live body class");

  // 2. the blocked invoke gets a CLEAR message and changes nothing.
  ok(/function examToolBlockedNotice/.test(appSrc), "a blocked invoke has a dedicated notice");
  ok(/is turned off while the exam is active/.test(appSrc), "the notice says the tool is off during the exam");

  // 3. the study-fullscreen toggle must not exit the EXAM's fullscreen.
  const fsIdx = appSrc.indexOf('$("#fullscreenToggle").addEventListener("click"');
  ok(fsIdx > 0, "the study fullscreen toggle is wired");
  const fsHandler = appSrc.slice(fsIdx, fsIdx + 700);
  ok(/examToolsLocked\(\)/.test(fsHandler), "the fullscreen toggle is guarded (exiting fullscreen would end a valid exam)");
  ok(/would end the attempt/.test(fsHandler), "the blocked fullscreen invoke explains the consequence");

  // 4. every PANEL_IDS tool is covered and the attach pass closes them.
  const panelIds = /const PANEL_IDS = \[([^\]]+)\]/.exec(appSrc);
  ok(!!panelIds, "PANEL_IDS exists");
  if (panelIds) {
    ["floatingCalc", "scratchPad", "pomodoroPanel", "whiteboardPanel"].forEach((id) =>
      ok(panelIds[1].indexOf(id) !== -1, "PANEL_IDS covers " + id));
  }
  const attach = /function examAttachListeners\(\) \{[\s\S]*?\n\}/.exec(appSrc);
  ok(!!attach && /examCloseStudyTools\(\)/.test(attach[0]),
    "the exam attach pass really closes the study tools");
  const closeTools = /function examCloseStudyTools\(\) \{[\s\S]*?\n\}/.exec(appSrc);
  ok(!!closeTools, "the close-on-attach helper exists");
  if (closeTools) {
    ok(/PANEL_IDS\.forEach/.test(closeTools[0]), "it closes every tool panel");
    ok(/clearInterval\(pomodoroInterval\)/.test(closeTools[0]), "it stops the pomodoro interval (no mid-exam ticking/confetti)");
    ok(/pomodoroRunning = false/.test(closeTools[0]), "it resets the pomodoro running flag");
  }

  // 5. CSS SCREEN layer: even a direct DOM write cannot PAINT a tool.
  //    (A print-only rule would NOT protect the screen — walk the
  //    media-query stack so this can never pass on @media print.)
  (function () {
    const blanked = cssSrc.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
    const stackAt = (idx) => {
      const stack = []; let pending = null;
      for (let i = 0; i < idx; i++) {
        const ch = blanked[i];
        if (ch === "@") {
          let j = i; while (j < blanked.length && blanked[j] !== "{" && blanked[j] !== ";") j++;
          pending = blanked.slice(i, j).trim();
        } else if (ch === "{") { stack.push(pending || "rule"); pending = null; }
        else if (ch === "}") { stack.pop(); }
      }
      return stack;
    };
    const sel = "body.exam-live .floating-panel";
    let screenOk = false, i = -1;
    while ((i = cssSrc.indexOf(sel, i + 1)) !== -1) {
      const st = stackAt(i);
      if (!st.some((t) => /^@media\s+print/.test(t))) {
        screenOk = /display:\s*none\s*!\s*important/.test(cssSrc.slice(i, i + 220).replace(/\s+/g, " "));
        break;
      }
    }
    ok(screenOk, "CSS hides .floating-panel under body.exam-live OUTSIDE @media print (the screen layer)");
  })();
  ok(/@media print[^@]*body\.exam-live \.floating-panel/s.test(cssSrc.replace(/\s+/g, " ")) ||
     /@media print \{[^}]*body\.exam-live[^}]*\.floating-panel/s.test(cssSrc.replace(/\n/g, " ")),
    "the print layer keeps the same guarantee on paper");
}

/* ============================================================
   C. STEP 1 PREPARATION CALLOUT — prominent, mandatory, and free
   of any attempt consumption. */
section("C. Step 1 preparation callout");
{
  ok(/ex-prep-callout/.test(appSrc), "the preparation callout exists in Step 1");
  ok(/exPrepCallout/.test(appSrc), "the callout has its id for tests and support");
  // The three required preparation points, in meaning:
  ok(/notebook or rough paper and a pen/.test(appSrc), "callout: notebook/rough paper and a pen");
  ok(/phone on a stand at eye level/.test(appSrc), "callout: phone on a stand at eye level");
  ok(/face clearly visible/.test(appSrc) && /close to the camera/.test(appSrc), "callout: face visible and close to the camera");

  // The existing checkbox is REUSED and its text now also acknowledges
  // the preparation (single mandatory acknowledgement).
  const agreeRe = /<input type="checkbox" id="exInstrAgree">\s*\n\s*<span>([\s\S]*?)<\/span>/.exec(appSrc);
  ok(!!agreeRe, "the #exInstrAgree checkbox is reused");
  if (agreeRe) {
    ok(/I am prepared/.test(agreeRe[1]), "the agreement text includes the preparation acknowledgement");
    ok(/notebook or rough paper and a pen/.test(agreeRe[1]), "the agreement text names the notebook/rough paper and pen");
    ok(/stand at eye level/.test(agreeRe[1]), "the agreement text names the phone-on-a-stand at eye level");
    ok(/face will stay visible and close to the camera/.test(agreeRe[1]), "the agreement text commits to a visible, close face");
  }

  // Continue stays disabled until the box is ticked.
  ok(/id="exInstrNext"[^>]*\sdisabled>/.test(appSrc), "the Continue button renders disabled");
  ok(/chk\.addEventListener\("change", \(\) => \{ btn\.disabled = !chk\.checked; \}\)/.test(appSrc),
    "Continue enables only through the acknowledgement checkbox");

  // Reading the instructions consumes nothing: the renderer touches
  // no attempt, timer, listener or monitoring start.
  const instrSlice = appSrc.slice(appSrc.indexOf("function renderExamInstructions"),
    appSrc.indexOf("STEP 2 — candidate registration"));
  ok(instrSlice.length > 1000, "the instructions renderer was found for inspection");
  ok(!/examStartAttempt|examAttachListeners|examStartLiveMonitoring|createEngine/.test(instrSlice),
    "viewing Step 1 never starts an attempt, listeners or monitoring");
}

/* ============================================================
   D. ABOUT — the video section is removed, not hidden. */
section("D. About: the watch-video section is gone");
{
  ok(!/Watch: A quick look/.test(appSrc), "the video heading is gone from app.js");
  ok(!/about-website\.mp4/.test(appSrc), "the video source is gone from app.js");
  ok(!/about-website-poster\.jpg/.test(appSrc), "the video poster is gone from app.js");
  const aboutPage = fs.readFileSync(path.join(ROOT, "about", "index.html"), "utf8");
  ok(!/about-website|Watch: A quick look/.test(aboutPage), "the generated About page carries no video reference");
  ok(!/about-website|Watch: A quick look/.test(indexSrc), "index.html carries no video reference");
  // The rest of About is untouched: the closing CTA still exists.
  ok(/aboutStartBtn2/.test(appSrc), "the closing CTA after the FAQ block is untouched");
}

/* ============================================================
   E. POLICY COMPLETENESS — nothing the monitor can terminate on is
   missing a student-facing sentence or a policy action, and the v93
   wiring fixes stay in place. */
section("E. Policy completeness and v93 wiring");
{
  const violationKeys = Object.keys(M.VIOLATIONS);
  ok(violationKeys.indexOf("face-proximity") !== -1, "face-proximity is a monitored violation type");
  violationKeys.forEach((k) => {
    ok(!!ExamSecurity.REASONS[k], "every violation has a REASONS sentence: " + k);
    ok(ExamSecurity.reasonText(k) !== "The examination was interrupted.",
      "the sentence is specific, not the fallback: " + k);
    eq(ExamRules.EXAM_SECURITY_POLICY[k], "terminate", "every violation type maps to terminate: " + k);
  });
  ok(!!ExamSecurity.REASONS["face-multiple"], "the previously missing face-multiple sentence exists");

  // The health-loop interval bug stays fixed (undefined used to become
  // a ~1ms tight loop: the constant lives under CONFIG.inference).
  ok(/cfg\.inference\.healthIntervalMs/.test(monitorSrc), "the live health loop reads the REAL interval");
  ok(!/cfg\.recovery\.healthIntervalMs/.test(monitorSrc), "the undefined cfg.recovery.healthIntervalMs is gone");

  // The warning banner counts down the engine's REAL grace via an
  // absolute deadline (all warned violations are exactly 2000ms —
  // pinned in exam-monitor-tests section A).
  ok(/Math\.max\(1, Math\.round\(\(ev\.graceMs \|\| 6000\) \/ 1000\)\)/.test(appSrc),
    "the banner derives its countdown from ev.graceMs");
  ok(/data-end="\$\{Date\.now\(\) \+ grace \* 1000\}"/.test(appSrc),
    "the countdown uses an absolute deadline (a re-render cannot restart it)");

  // Phone: immediate termination through the single terminate() path.
  ok(/policy\.immediate/.test(monitorSrc), "the immediate policy branch exists in report()");
  ok(M.VIOLATIONS["phone-detected"].immediate === true, "phone-detected is immediate");
  ok(/terminate\(type, detail/.test(monitorSrc), "the immediate branch still routes through the single terminate() path");
}

/* ============================================================ */
console.log("\n" + "=".repeat(60));
console.log(`Exam hardening tests: ${pass} passed / ${fail} failed`);
if (fail) {
  console.log("\nFAILURES");
  failures.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
