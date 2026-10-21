/* INDEPENDENT PROBE — 18 representative student conversations run through the offline
   tutor, printing what actually came back so weaknesses are found by inspection instead
   of assumed away. Full report by default; `--quiet` prints failures only.
   npm test runs it with --quiet (failures break the build); `npm run test:probe` shows all.
   Run:  node tests/probe-tutor.js            (full report)
         node tests/probe-tutor.js --quiet    (failures only)                */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const Know = require(path.join(ROOT, "ai-knowledge.js"));
const Core = require(path.join(ROOT, "ai-tutor-core.js"));

const sandbox = { console }; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + ";this.__D=APP_DATA;", sandbox);
const kb = Know.build(sandbox.__D, { formulaSource: fs.readFileSync(path.join(ROOT, "app.js"), "utf8") });

const QUIET = process.argv.includes("--quiet");
const words = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;
let n = 0, bad = 0;
const failures = [];

function chat(turns, opts) {
  let st = Core.newState(); const out = [];
  for (const t of turns) {
    const r = Core.respond(kb, t, st, Object.assign({ debug: true }, opts || {}));
    st = r.state;
    out.push({ t, act: r.understanding.act, target: r.understanding.target,
               topic: st.topic, text: r.answer ? r.answer.text : "", answer: r.answer, U: r.understanding, state: st });
  }
  return out;
}

/* Each scenario: {name, turns:[...], check(last, all) -> [problem strings]} */
const S = [];
const scenario = (name, turns, check, opts) => S.push({ name, turns, check, opts });

/* ---------- 1. The brief's canonical ambiguity set ---------- */
scenario("What is Journal? = meaning, not format", ["What is Journal?"], a => {
  const p = [];
  const t = a[0].text;
  if (a[0].act !== "define") p.push("act=" + a[0].act + " (want define)");
  if (!/(first|chronolog|diary|order)/i.test(t)) p.push("no meaning: " + t.slice(0, 160));
  if (/\|\s*Date\s*\|/i.test(t) || /L\.F\./.test(t)) p.push("leaked the format table");
  if (words(t) > 120) p.push("too long for a definition: " + words(t) + " words");
  return p;
});

scenario("Explain Journal = conceptual, format only supporting", ["Explain Journal."], a => {
  const p = [], t = a[0].text;
  if (a[0].act !== "explain") p.push("act=" + a[0].act);
  if (!/(first|chronolog|diary|order)/i.test(t)) p.push("no meaning: " + t.slice(0, 160));
  if (/^[\s*]*(Journal Format|\*\*Format)/.test(t.trim())) p.push("format led the answer");
  return p;
});

scenario("What is the format of Journal? = the format", ["What is the format of Journal?"], a => {
  const p = [], t = a[0].text;
  if (a[0].act !== "format") p.push("act=" + a[0].act);
  if (!/Date/.test(t) || !/Particulars/.test(t)) p.push("no columns: " + t.slice(0, 160));
  return p;
});

scenario("Give a Journal entry = an example entry", ["Give a Journal entry."], a => {
  const p = [], t = a[0].text;
  if (!/Dr\.?/.test(t)) p.push("no Dr line: " + t.slice(0, 200));
  if (!/Cr\.?/.test(t)) p.push("no Cr line: " + t.slice(0, 200));
  return p;
});

scenario("Why is Journal important? = importance", ["Why is Journal important?"], a => {
  const p = [], t = a[0].text;
  if (a[0].act !== "importance") p.push("act=" + a[0].act);
  if (!/(ledger|posted|original|evidence|first)/i.test(t)) p.push("no reasons: " + t.slice(0, 160));
  if (/\|\s*Date\s*\|/i.test(t)) p.push("format table in an importance answer");
  return p;
});

/* ---------- 2. Multi-turn memory chains from the brief ---------- */
scenario("chain: depreciation → simpler → example → why → format",
  ["Explain depreciation.", "Explain it more simply.", "Give me an example.", "Why does it happen?", "What is the format of the depreciation account?"],
  (a, all) => {
    const p = [];
    if (a[1].act !== "simplify") p.push("turn2 act=" + a[1].act);
    if (words(a[1].text) >= words(a[0].text)) p.push("simpler answer not shorter: " + words(a[1].text) + " vs " + words(a[0].text));
    if (!/depreciat/i.test(a[1].text)) p.push("turn2 lost the topic: " + a[1].text.slice(0, 140));
    if (!/depreciat/i.test(a[2].text)) p.push("turn3 example not about depreciation: " + a[2].text.slice(0, 140));
    if (!/₹/.test(a[2].text)) p.push("turn3 example has no figures: " + a[2].text.slice(0, 140));
    if (a[3].act !== "why" && a[3].act !== "importance") p.push("turn4 act=" + a[3].act);
    if (a.every(x => x.topic && x.topic.chapterId && x.topic.chapterId !== "dep"))
      p.push("topic drifted off dep: " + a.map(x => x.topic && x.topic.chapterId).join(","));
    return p;
  });

scenario("chain: topic switch 'Now solve one using WDV' reuses context",
  ["Explain depreciation.", "Now solve one using WDV."],
  (a) => {
    const p = [];
    if (!a[1].answer || a[1].answer.kind !== "numerical") p.push("act=" + a[1].act + " kind=" + (a[1].answer && a[1].answer.kind));
    if (!/wdv|written down/i.test(a[1].text)) p.push("WDV not used: " + a[1].text.slice(0, 200));
    if (!/₹/.test(a[1].text)) p.push("no figures: " + a[1].text.slice(0, 160));
    return p;
  });

scenario("'it/that/this' resolve to the previous answer, not a new search",
  ["Explain the accounting equation.", "Why is that important?", "Give me an example of that."],
  (a) => {
    const p = [];
    if (a[1].act !== "why" && a[1].act !== "importance") p.push("turn2 act=" + a[1].act);
    if (a[1].target === "topic" && a[1].topic && !/equation/i.test(a[1].topic.label))
      p.push("turn2 topic=" + JSON.stringify(a[1].topic));
    if (a[2].act !== "example" && a[2].act !== "another") p.push("turn3 act=" + a[2].act);
    if (!/equation|assets|liabilit|capital/i.test(a[2].text)) p.push("turn3 off-topic: " + a[2].text.slice(0, 160));
    return p;
  });

scenario("new chat resets context (no leakage)", ["Explain depreciation."], () => {
  const p = [];
  // a genuinely fresh state must carry no topic, no answer and no numerical
  const fresh = Core.newState();
  if (fresh.topic) p.push("fresh state has a topic: " + JSON.stringify(fresh.topic));
  if (fresh.lastAnswer) p.push("fresh state carries a previous answer");
  if (fresh.numerical) p.push("fresh state carries a numerical");
  if (fresh.clarification) p.push("fresh state carries a clarification");
  // and an anaphoric follow-up with nothing behind it must NOT pretend to know
  const r = Core.respond(kb, "Explain that more simply", Core.newState(), { debug: true });
  if (r.understanding.act === "simplify" && r.understanding.target === "topic" && !r.understanding.topic)
    p.push("simplify with no prior context resolved to a topic that does not exist");
  return p;
});

/* ---------- 3. Style / length matching ---------- */
scenario("final answer only", ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Just give the final answer"],
  (a) => {
    const p = [];
    if (words(a[1].text) > 40) p.push("final-only answer is " + words(a[1].text) + " words: " + a[1].text.slice(0, 200));
    if (!/53,100/.test(a[1].text)) p.push("wrong final figure: " + a[1].text.slice(0, 200));
    return p;
  });

scenario("step-by-step shows ordered working", ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Show me the full working, step by step"],
  (a) => {
    const p = [];
    if (words(a[1].text) < words(a[0].text)) p.push("steps answer shorter than the original");
    if (!/\b1\.?[\s)]|\bstep/i.test(a[1].text)) p.push("no ordered steps: " + a[1].text.slice(0, 200));
    if (!/53,100/.test(a[1].text)) p.push("steps answer lost the figure");
    return p;
  });

scenario("short request shortens, does not re-retrieve long content",
  ["Explain the golden rules of accounting in detail.", "Make it short"],
  (a) => {
    const p = [];
    if (a[1].act !== "shorten") p.push("act=" + a[1].act);
    if (words(a[1].text) >= words(a[0].text)) p.push("not shorter: " + words(a[1].text) + " vs " + words(a[0].text));
    return p;
  });

/* ---------- 4. Ambiguity is flagged, not invented ---------- */
scenario("underspecified numerical asks instead of guessing",
  ["A machine was bought. Find depreciation."],
  (a) => {
    const p = [];
    if (!a[0].answer) p.push("no answer object");
    const t = a[0].text;
    if (/(assum|need|please (tell|specify|provide)|which method|cost|rate|useful life)/i.test(t) === false)
      p.push("did not ask for the missing figures: " + t.slice(0, 220));
    if (a[0].answer.kind === "numerical" && !/\?/.test(t)) p.push("solved without the data: " + t.slice(0, 220));
    return p;
  });

/* ---------- 5. Numerical re-solve on changed figures ---------- */
scenario("changed figures are re-solved, not recalled",
  ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Goods ₹1,50,000, trade discount 15%, GST 18%. Find invoice value."],
  (a) => {
    const p = [];
    if (!/1,50,450|150450/.test(a[1].text.replace(/\s/g, ""))) p.push("expected ₹1,50,450: " + a[1].text.slice(-220));
    if (/53,100/.test(a[1].text)) p.push("stale stored answer leaked");
    return p;
  });

scenario("what-if changes the method and re-solves",
  ["Machine cost ₹2,00,000, useful life 5 years, SLM. Find depreciation.", "What if WDV is used instead?"],
  (a) => {
    const p = [];
    if (a[1].act !== "whatif") p.push("act=" + a[1].act);
    if (!/40,000/.test(a[0].text)) p.push("SLM baseline wrong: " + a[0].text.slice(-160));
    if (!/wdv|written down/i.test(a[1].text)) p.push("WDV not named: " + a[1].text.slice(0, 200));
    return p;
  });

/* ---------- 6. Check / mistake flows ---------- */
scenario("check my answer compares against the correct result",
  ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "I got ₹50,000. Check my answer"],
  (a) => {
    const p = [];
    if (a[1].act !== "check") p.push("act=" + a[1].act);
    if (!/53,100/.test(a[1].text)) p.push("correct answer missing: " + a[1].text.slice(0, 220));
    if (!/(wrong|incorrect|not quite|differs|correct)/i.test(a[1].text)) p.push("no verdict: " + a[1].text.slice(0, 220));
    return p;
  });

/* ---------- 7. Retrieval from real site content ---------- */
scenario("answer comes from a chapter, not the tutor prompt",
  ["What is the accounting concept of going concern?"],
  (a) => {
    const p = [];
    if (!/going concern/i.test(a[0].text)) p.push("off topic: " + a[0].text.slice(0, 180));
    if (!a[0].answer || !a[0].answer.sources || !a[0].answer.sources.length) p.push("no source attribution");
    return p;
  });

scenario("teach me = interactive build-up",
  ["Teach me what a ledger is"],
  (a) => {
    const p = [];
    if (words(a[0].text) < 20) p.push("too terse for teach mode: " + a[0].text.slice(0, 120));
    return p;
  });

/* runner ------------------------------------------------------------------ */
console.log("AI Tutor independent probe — " + S.length + " scenarios\n");
for (const sc of S) {
  let probs = [];
  try {
    const out = chat(sc.turns, sc.opts);
    probs = sc.check(out, out) || [];
  } catch (e) {
    probs = ["THREW: " + e.message];
  }
  n++;
  if (probs.length) {
    bad++;
    failures.push({ name: sc.name, probs });
    console.log("FAIL  " + sc.name);
    probs.forEach(p => console.log("        - " + p));
  } else if (!QUIET) {
    console.log("ok    " + sc.name);
  }
}
console.log("\nprobe: " + (n - bad) + "/" + n + " scenarios clean");
if (failures.length && QUIET) console.log(failures.map(f => f.name).join("\n"));
process.exitCode = bad ? 1 : 0;
