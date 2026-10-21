/* Exam rules — the single authoritative grading module. Run:
   node tests/exam-rules-tests.js   (Node 18+, no packages.)
   Dev only, not loaded by the website.

   Every boundary the examination promises students is executed here:
     A  grade boundaries (90/80/70/60/50/40/33), raw vs rounded
     B  pass/fail is SEPARATE from the grade — exactly 40% passes,
        D and E always fail, no negative marking anywhere
     C  evaluateAttempt: marks, counts, chapter-wise, safety
     D  certificate IDs: ACC-MONTHYYYY-NNNN, exam-month, sequence
     E  daily policy: Asia/Kolkata day keys and midnight reset
     F  candidate/school validation and paper drawing
*/
const path = require("path");
const ExamRules = require(path.resolve(__dirname, "..", "exam-rules.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }

/* ================= A. grade boundaries ================= */
section("A. Grade boundaries (exact edges)");
{
  const g = pct => ExamRules.gradeFor(pct);
  eq(g(100), "A1", "100 → A1");
  eq(g(90), "A1", "exactly 90 → A1");
  eq(g(89.999), "A2", "just below 90 → A2");
  eq(g(80), "A2", "exactly 80 → A2");
  eq(g(79.999), "B1", "just below 80 → B1");
  eq(g(70), "B1", "exactly 70 → B1");
  eq(g(69.999), "B2", "just below 70 → B2");
  eq(g(60), "B2", "exactly 60 → B2");
  eq(g(59.999), "C1", "just below 60 → C1");
  eq(g(50), "C1", "exactly 50 → C1");
  eq(g(49.999), "C2", "just below 50 → C2");
  eq(g(40), "C2", "exactly 40 → C2 (Pass band)");
  eq(g(39.999), "D", "just below 40 → D");
  eq(g(33), "D", "exactly 33 → D");
  eq(g(32.999), "E", "just below 33 → E");
  eq(g(0), "E", "0 → E");
  eq(g(NaN), "E", "NaN degrades to the lowest band, never throws");

  const perf = p => ExamRules.gradeInfo(p).performance;
  eq(perf(95), "Outstanding", "A1 performance text");
  eq(perf(45), "Pass", "C2 performance text");
  eq(perf(35), "Needs Improvement", "D performance text");
  eq(perf(10), "Needs Significant Improvement", "E performance text");
}

/* ================= B. pass/fail separate from grade ================= */
section("B. Pass mark is 40%, computed from the RAW percentage");
{
  eq(ExamRules.isPass(40), true, "exactly 40% PASSES");
  eq(ExamRules.isPass(40.0001), true, "above 40% passes");
  eq(ExamRules.isPass(39.9999), false, "just below 40% FAILS (no rounding up)");
  eq(ExamRules.isPass(33.5), false, "33.5% → D → FAIL (grade D never passes)");
  eq(ExamRules.isPass(33), false, "exactly 33% → D → FAIL");
  eq(ExamRules.isPass(32), false, "below 33% → E → FAIL");
  eq(ExamRules.isPass(NaN), false, "NaN is a FAIL, not a crash");

  // Every band maps to the promised result status.
  const expect = [[100, "PASS"], [90, "PASS"], [80, "PASS"], [70, "PASS"], [60, "PASS"],
                  [50, "PASS"], [40, "PASS"], [39.9, "FAIL"], [33, "FAIL"], [32.9, "FAIL"], [0, "FAIL"]];
  expect.forEach(([p, want]) => {
    const band = ExamRules.gradeInfo(p);
    eq(band.grade + "→" + (ExamRules.isPass(p) ? "PASS" : "FAIL"),
      band.grade + "→" + want,
      `${p}% (${band.grade}) must be ${want}`);
  });

  // Percentage maths: raw value, display rounding only.
  eq(ExamRules.percentage(3, 4), 75, "3/4 → 75%");
  eq(ExamRules.percentage(0, 0), 0, "0/0 is 0, not NaN");
  eq(ExamRules.percentage(-5, 10), 0, "negative marks cannot go below 0");
  eq(ExamRules.roundPct(76.666), 76.67, "roundPct rounds the DISPLAY value to 2dp");
  eq(Math.trunc(ExamRules.roundPct(39.995)), 39, "39.995 displays as 39.99 — never rounded up to a pass");
  ok(Math.abs(ExamRules.roundPct(39.9949) - 39.99) < 1e-9, "roundPct rounds to 2 decimals");
}

/* ================= C. evaluateAttempt ================= */
section("C. evaluateAttempt — the whole result object");
{
  const qs = [
    { id: 1, chapter: "jr", q: "Q1", options: ["a", "b", "c"], answerIndex: 0 },
    { id: 2, chapter: "jr", q: "Q2", options: ["a", "b", "c"], answerIndex: 1 },
    { id: 3, chapter: "lg", q: "Q3", options: ["a", "b", "c"], answerIndex: 2 },
    { id: 4, chapter: "lg", q: "Q4", options: ["a", "b", "c"], answerIndex: 0 },
    { id: 5, chapter: "eq", q: "Q5", options: ["a", "b", "c"], answerIndex: 1 }
  ];
  // 3 correct, 1 wrong, 1 blank → 3/5 = 60% → B2 PASS
  const r = ExamRules.evaluateAttempt(qs, [0, 1, 2, 1, null]);
  eq(r.marksObtained, 3, "3 correct → 3 marks (wrong answers cost NOTHING)");
  eq(r.maxMarks, 5, "max marks = question count");
  eq(r.percentage, 60, "3/5 → 60%");
  eq(r.grade, "B2", "60% → B2");
  eq(r.resultStatus, "PASS", "60% passes");
  eq(r.correct, 3, "correct count");
  eq(r.incorrect, 1, "incorrect count");
  eq(r.unanswered, 1, "unanswered count");
  eq(r.correct + r.incorrect + r.unanswered, 5, "counts add up to the paper");
  eq(r.chapterWise.jr.correct, 2, "chapter-wise: both Journal questions correct");
  eq(r.chapterWise.jr.total, 2, "chapter-wise total per chapter");
  eq(r.chapterWise.lg.incorrect, 1, "chapter-wise: 1 wrong in Ledger");
  eq(r.chapterWise.eq.unanswered, 1, "a chapter answered blank counts its unanswered question");

  // Zero marks → E FAIL
  const zero = ExamRules.evaluateAttempt(qs, [1, 2, 0, 2, 0]);
  eq(zero.marksObtained, 0, "all wrong → 0 marks");
  eq(zero.resultStatus, "FAIL", "0% fails");
  eq(zero.grade, "E", "0% → E");

  // Negative marking is NEVER applied: every non-null answer that
  // differs from the key yields 0, not -1.
  const allWrong = ExamRules.evaluateAttempt(qs, [1, 2, 0, 1, 0]);
  eq(allWrong.marksObtained, 0, "all wrong still scores 0 (no negative marking)");

  // Invalid input safety: never a crash, never a bogus result.
  eq(ExamRules.evaluateAttempt(null, []), null, "missing questions → null (no result issued)");
  eq(ExamRules.evaluateAttempt(qs, null), null, "missing answers → null");
  eq(ExamRules.evaluateAttempt([], []), null, "empty paper → null");
  eq(ExamRules.evaluateAttempt([{ id: 9 }], [0]), null, "a question with no answer key refuses to grade");
}

/* ================= D. certificate IDs ================= */
section("D. Certificate ID format ACC-MONTHYYYY-NNNN");
{
  // September 2026 (month index 8), number 10 → ACC-SEP2026-0010
  const sep = Date.UTC(2026, 8, 12, 10, 0, 0);
  eq(ExamRules.certIdForDate(sep, 10), "ACC-SEP2026-0010", "the spec example: ACC-SEP2026-0010");
  eq(ExamRules.certIdForDate(sep, 1), "ACC-SEP2026-0001", "first of the month");
  eq(ExamRules.certIdForDate(sep, 105), "ACC-SEP2026-0105", "spec example: ACC-SEP2026-0105");

  const jan = Date.UTC(2026, 0, 15, 12, 0, 0);   // 17:30 IST the same day
  eq(ExamRules.certIdForDate(jan, 1), "ACC-JAN2026-0001", "January uses JAN");
  const jul = Date.UTC(2026, 6, 1, 0, 0, 0);
  eq(ExamRules.certIdForDate(jul, 3), "ACC-JUL2026-0003", "spec example: ACC-JUL2026-0003");
  const mar = Date.UTC(2026, 2, 15, 12, 0, 0);
  eq(ExamRules.certIdForDate(mar, 2), "ACC-MAR2026-0002", "spec example: ACC-MAR2026-0002");

  // Validation + parsing
  ok(ExamRules.isValidCertId("ACC-SEP2026-0010"), "the example ID validates");
  ok(!ExamRules.isValidCertId("ACC-SEP2026-00101"), "five-digit serials do not validate");
  ok(!ExamRules.isValidCertId("XYZ-SEP2026-0001"), "wrong prefix does not validate");
  ok(!ExamRules.isValidCertId("ACC-SEPT2026-0001"), "four-letter month does not validate");
  ok(!ExamRules.isValidCertId(""), "empty does not validate");
  const parsed = ExamRules.parseCertId("ACC-SEP2026-0010");
  eq(parsed.monthAbbr, "SEP", "parse returns the month abbreviation");
  eq(parsed.year, 2026, "parse returns the year");
  eq(parsed.seq, 10, "parse returns the serial");

  // The online-verification surface is gone: no verify-URL helper
  // remains anywhere in the rules module.
  ok(!("certificateVerifyUrl" in ExamRules), "certificateVerifyUrl was removed with the verify route");
}

/* ================= E. Asia/Kolkata daily policy ================= */
section("E. Daily policy: midnight is IST, not UTC");
{
  eq(ExamRules.DAILY_ATTEMPT_LIMIT, 2, "default limit is 2 attempts/day");
  // 2026-03-10 19:00 UTC = 2026-03-11 00:30 IST (already the next day)
  const mar10_19utc = Date.UTC(2026, 2, 10, 19, 0, 0);
  eq(ExamRules.istDayKey(mar10_19utc), "2026-03-11", "19:00 UTC is the NEXT calendar day in IST");
  const mar10_18utc = Date.UTC(2026, 2, 10, 18, 0, 0);    // 23:30 IST
  eq(ExamRules.istDayKey(mar10_18utc), "2026-03-10", "18:00 UTC is still TODAY in IST (23:30)");
  const mar10_1830utc = Date.UTC(2026, 2, 10, 18, 30, 0);  // 00:00 IST sharp
  eq(ExamRules.istDayKey(mar10_1830utc), "2026-03-11", "18:30 UTC is IST midnight — the NEXT day begins");
  const mar10_1829utc = Date.UTC(2026, 2, 10, 18, 29, 59);
  eq(ExamRules.istDayKey(mar10_1829utc), "2026-03-10", "one second before IST midnight stays today");

  // msUntilIstMidnight is positive below midnight and resets after.
  const before = Date.UTC(2026, 2, 10, 18, 0, 0);   // 23:30 IST → 30 min left
  eq(ExamRules.msUntilIstMidnight(before), 30 * 60 * 1000, "30 minutes to IST midnight");
  const after = Date.UTC(2026, 2, 10, 18, 30, 1);   // 00:00:01 IST next day
  ok(ExamRules.msUntilIstMidnight(after) > 23 * 3600 * 1000, "just after IST midnight, nearly a full day remains");

  const parts = ExamRules.istParts(mar10_19utc);
  eq(parts.day, 11, "IST parts report the IST calendar day");
  eq(parts.month, 2, "IST parts month (0-based)");
}

/* ================= F. validation + paper drawing ================= */
section("F. Candidate validation and paper drawing");
{
  ok(ExamRules.validateCandidateName("Ananya Sharma").ok, "a normal name validates");
  eq(ExamRules.validateCandidateName("  Ananya Sharma  ").name, "Ananya Sharma", "the name is trimmed");
  eq(ExamRules.validateCandidateName("   ").reason, "empty", "whitespace-only is empty");
  eq(ExamRules.validateCandidateName("A").reason, "too-short", "single character is too short");
  eq(ExamRules.validateCandidateName("x".repeat(61)).reason, "too-long", "61 characters is too long");
  eq(ExamRules.validateCandidateName("12345").reason, "no-letter", "digits-only is not a name");
  eq(ExamRules.validateCandidateName("Ananya Sharma").ok, true, "mixed-case name stays in its exact spelling");
  ok(ExamRules.validateSchoolName("").ok, "an empty school is allowed (optional)");
  ok(!ExamRules.validateSchoolName("s".repeat(81)).ok, "an 81-character school name is rejected");

  const paper = ExamRules.EXAM_PAPERS[0];
  ok(paper && paper.questionCount > 0, "the first paper declares its question count");
  eq(ExamRules.maxMarksFor(paper), paper.questionCount, "maximum marks = one per question");
  eq(ExamRules.getPaper("no-such-paper"), null, "an unknown paper id yields null");

  // drawQuestions: right count, right chapters, no duplicates.
  const fakeBank = [];
  for (let c = 0; c < 3; c++) for (let i = 0; i < 40; i++) fakeBank.push({ id: `ch${c}-q${i}`, chapter: "abc"[c], difficulty: "Easy", q: "Q", options: ["a", "b"], answerIndex: 0 });
  const drawn = ExamRules.drawQuestions(fakeBank, ["a", "b", "c"], 30);
  eq(drawn.length, 30, "draws exactly the requested count");
  eq(new Set(drawn.map(q => q.id)).size, 30, "never draws the same question twice");
  ok(drawn.every(q => ["a", "b", "c"].includes(q.chapter)), "only the paper's chapters are drawn");
  const short = ExamRules.drawQuestions(fakeBank, ["a"], 100);
  eq(short.length, 40, "a too-large draw stops at what exists rather than duplicating");
}

/* ================= G. anti-cheating policy table =================
   The app funnels every browser event through securityActionFor()
   before acting, so this table IS the behaviour contract: which
   events terminate an attempt, which are merely blocked, and which
   are only recorded. An unknown event must never fall through to
   something permissive by accident. */
section("G. Security policy: terminate vs block vs record");
{
  const P = ExamRules.EXAM_SECURITY_POLICY;
  ok(P && typeof P === "object", "the policy table is exported");
  const allowed = ["terminate", "block", "record"];
  for (const k of Object.keys(P)) ok(allowed.includes(P[k]), "policy[" + k + "] = " + P[k] + " is a legal action");

  eq(ExamRules.securityActionFor("tab-or-app-switched"), "terminate", "a hidden paper past the grace window terminates");
  eq(ExamRules.securityActionFor("screenshot-attempt"), "terminate", "a capture shortcut terminates");
  eq(ExamRules.securityActionFor("navigation-attempt"), "terminate", "leaving the active paper terminates");
  eq(ExamRules.securityActionFor("window-focus-lost"), "terminate", "v89: losing focus of the examination window is a STRICT termination (spec requirement)");
  eq(ExamRules.securityActionFor("page-reloaded"), "record", "a refresh records and restores, never punishes");
  eq(ExamRules.securityActionFor("page-hidden-short"), "record", "a brief hidden spell only records");
  eq(ExamRules.securityActionFor("clock-adjusted"), "record", "clock nudges only record");
  eq(ExamRules.securityActionFor("copy-attempt"), "block", "copy is blocked, not terminating");
  eq(ExamRules.securityActionFor("print-attempt"), "block", "print is blocked, not terminating");
  eq(ExamRules.securityActionFor("context-menu"), "block", "right-click is blocked, not terminating");
  eq(ExamRules.securityActionFor("select-attempt"), "block", "selection is blocked, not terminating");

  // Unknown events fall back to record — never to terminate, never
  // silently permissive.
  eq(ExamRules.securityActionFor("never-heard-of-it"), "record", "an unknown event falls back to record");
  eq(ExamRules.securityActionFor(""), "record", "the empty event falls back to record");
  eq(ExamRules.securityActionFor(undefined), "record", "undefined falls back to record");

  // Every terminate-class event the app detects is present in the table.
  ["tab-or-app-switched", "screenshot-attempt", "navigation-attempt"].forEach((k) =>
    eq(P[k], "terminate", k + " is present and terminate-class"));
}

console.log("\n" + "=".repeat(60));
console.log(`Exam rules tests: ${pass} passed / ${fail} failed`);
if (failures.length) {
  console.log("\nFAILURES");
  failures.forEach(f => console.log("  ✗ " + f));
  process.exit(1);
}
