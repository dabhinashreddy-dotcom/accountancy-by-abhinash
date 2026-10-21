/* AI Tutor intelligence tests — run from the site root:   node tests/ai-intelligence-tests.js
   (Node 18+, no packages.)  Dev only; not loaded by the website.

   A  intent classification (wording + chat memory + attached question)
   B  the exact scenarios from the v78 brief (tests 1–9, 11–14), run with NO API key (offline path)
   C  "What is X?" vs "What is the format of X?" across chapters
   D  follow-up context stays on one topic through whole conversations
   E  small talk, confusion, out-of-scope
   F  repeated questions: wording varies, accounting meaning does not
   G  attached "Ask AI" question stays the active context (every section) + Mistake Book comparison
   H  answer modes follow the student's current words
   I  memory is scoped to one chat; nothing leaks into a new chat
   J  student-facing wording and the Noupe removal (whole repository)
   K  the offline understanding IS the whole tutor (no backend exists)
*/
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const Know = require(path.join(ROOT, "ai-knowledge.js"));
const Core = require(path.join(ROOT, "ai-tutor-core.js"));
const Solver = require(path.join(ROOT, "ai-solver.js"));

let pass = 0, fail = 0; const failures = [];
const ok = (c, n, d) => { if (c) pass++; else { fail++; failures.push(n + (d ? " — " + String(d).slice(0, 260) : "")); } };
const section = t => console.log("\n" + t);

const sandbox = { console }; sandbox.window = sandbox; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + ";this.__D=APP_DATA;", sandbox);
const D = sandbox.__D;
const kb = Know.build(D, { formulaSource: fs.readFileSync(path.join(ROOT, "app.js"), "utf8") });

// run a whole conversation; returns [{t, act, target, topic, text, answer, state}]
function chat(turns, opts) {
  let st = Core.newState(); const out = [];
  for (const t of turns) {
    const r = Core.respond(kb, t, st, Object.assign({ debug: true }, opts || {})); st = r.state;
    out.push({ t, act: r.understanding.act, target: r.understanding.target, topic: st.topic, text: r.answer ? r.answer.text : null, answer: r.answer, state: st, U: r.understanding });
  }
  return out;
}
const words = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const wire = id => Know.toWire(kb.questionById[id]);

/* ================= A. intent classification ================= */
section("A. Intent classification");
const fresh = Core.newState();
const withAnswer = (() => { const s = chat(["What is Journal?"])[0].state; return s; })();
const withNumerical = (() => chat(["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value."])[0].state)();
const cases = [
  // text, state, expected act, optional style/target checks
  ["Hi", fresh, "smalltalk"], ["hello there", fresh, "smalltalk"], ["Thank you", withAnswer, "smalltalk"], ["Okay", withAnswer, "smalltalk"], ["Got it", withAnswer, "smalltalk"],
  ["What can you do?", fresh, "smalltalk"], ["Can you help me?", fresh, "smalltalk"], ["bye", withAnswer, "smalltalk"],
  ["I don't understand", withAnswer, "confused"], ["I'm confused", withAnswer, "confused"], ["This makes no sense", withAnswer, "confused"], ["Explain again", withAnswer, "confused"], ["I still don't get it", withAnswer, "confused"],
  ["What is Journal?", fresh, "define"], ["What is a journal?", fresh, "define"], ["Define depreciation", fresh, "define"], ["What is a debtor?", fresh, "define"],
  ["Explain journal", fresh, "explain"], ["Explain journal in simple words", fresh, "explain", u => u.style.simple], ["Explain trial balance in detail", fresh, "explain", u => u.style.detailed],
  ["Explain that more simply", withAnswer, "simplify", u => u.target === "topic" && u.followUp],
  ["Make it simpler", withAnswer, "simplify"], ["Explain it shorter", withAnswer, "shorten"], ["Give me the main point", withAnswer, "shorten"], ["Explain more", withAnswer, "expand"], ["Tell me more", withAnswer, "expand"],
  ["Give an example", withAnswer, "example"], ["Give me another example", withAnswer, "another"], ["One more example please", withAnswer, "another"],
  ["Why?", withAnswer, "why"], ["Why is it important?", withAnswer, "importance"], ["Why is journal important?", fresh, "importance"],
  ["What is the format of Journal?", fresh, "format"], ["Explain Journal format", fresh, "format"], ["Show me the layout of a ledger", fresh, "format"],
  ["What are the features of depreciation?", fresh, "features"], ["Types of subsidiary books", fresh, "features"],
  ["What is the difference between CGST and SGST?", fresh, "compare"], ["Debtor vs creditor", fresh, "compare"],
  ["Summarise this chapter", withAnswer, "summarize"], ["Quick revision of depreciation", fresh, "summarize"],
  ["Give me a question", withAnswer, "practice"], ["Now give me a question.", withAnswer, "practice"], ["Test me on GST", fresh, "practice"],
  ["What if WDV is used?", withNumerical, "whatif"], ["What if the GST is 12%?", withNumerical, "whatif"],
  ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", fresh, "numerical"], ["Machine ₹1,50,000, depreciation 15%", fresh, "numerical"], ["What is 18% of 50000?", fresh, "numerical"],
  ["Paid rent ₹5,000 in cash", fresh, "transaction"], ["Sold goods worth ₹20,000 on credit to Ravi", fresh, "transaction"],
  ["Check my answer, I got 53,100", withNumerical, "check"], ["Why was my answer wrong?", fresh, "mistake"],
  ["What is the capital of France?", fresh, "unrelated"], ["Tell me a joke", fresh, "unrelated"], ["Who won the IPL?", fresh, "unrelated"],
  ["Explain the accounting cycle", fresh, "cycle"],
  ["Say that again", withAnswer, "repeat"], ["Rephrase that", withAnswer, "rephrase"]
];
cases.forEach(([text, st, act, extra]) => { const u = Core.understand(kb, text, st, {}); ok(u.act === act && (!extra || extra(u)), `intent "${text}" → ${act}`, `got ${u.act} (target ${u.target})`); });
// "that" resolves by context: with an attached question it means the question; with a numerical it means the solution
const bq = kb.questions.find(q => q.srcKey === "brs.detective" && q.raw.items.length >= 2 && q.raw.startingPoint === "Cash Book" && q.raw.startingBalance > 0);
ok(Core.understand(kb, "Why is this added?", fresh, { question: bq }).target === "question", "'this' → the attached question");
ok(Core.understand(kb, "Make it simpler", withNumerical, {}).target === "numerical", "'it' → the previous numerical solution");
ok(Core.understand(kb, "Explain that more simply", withAnswer, {}).target === "topic", "'that' → the previous topic answer");
ok(Core.understand(kb, "Explain depreciation", withAnswer, {}).target === "topic" && Core.understand(kb, "Explain depreciation", withAnswer, {}).topic.label === "Depreciation", "a NEW explicit topic replaces the old one");
ok(Core.understand(kb, "Explain that more simply", fresh, {}).target !== "question", "no attached question → 'that' is not a question");

/* ================= B. the scenarios from the brief ================= */
section("B. Brief scenarios 1–14 (offline, no API key)");
const J = chat(["What is Journal?", "Explain that more simply.", "Give an example.", "Why is Journal important?", "What is the format of Journal?"]);
// 1
ok(J[0].act === "define" && /first/i.test(J[0].text) && /(order|chronolog|diary)/i.test(J[0].text) && /(debit|credit|original|recorded)/i.test(J[0].text), "T1 What is Journal? → the concept (first record, in order)", J[0].text);
ok(!/\| *Date *\|/i.test(J[0].text) && !/five columns/i.test(J[0].text) && words(J[0].text) < 110, "T1 …and NOT a format dump (short, no column table)", words(J[0].text) + " words");
ok(J[0].topic.chapterId === "jr" && /journal/i.test(J[0].topic.label), "T1 topic is Journal (chapter jr)", JSON.stringify(J[0].topic));
// 2
const E = chat(["Explain Journal."])[0];
ok(E.act === "explain" && /first/i.test(E.text) && /(order|chronolog|diary)/i.test(E.text), "T2 Explain Journal → concept first", E.text);
ok(!/^\*\*(Journal Format|The five columns)/.test(E.text.trim()) && E.text.indexOf("Format at a glance") !== 0, "T2 …format is only a supporting point, never the lead");
ok(E.text.search(/first/i) < E.text.search(/format at a glance/i) || !/format at a glance/i.test(E.text), "T2 meaning appears BEFORE any format mention");
// 3
ok(J[1].act === "simplify" && J[1].target === "topic" && J[1].topic.chapterId === "jr", "T3 'Explain that more simply' keeps the Journal topic");
ok(words(J[1].text) < words(J[0].text) && /simple words/i.test(J[1].text), "T3 …is shorter than the previous answer", words(J[1].text) + " vs " + words(J[0].text));
ok(/(journal|transaction)/i.test(J[1].text) && /first|diary|written down|recorded/i.test(J[1].text), "T3 …says the same thing (same meaning)", J[1].text);
ok(!/ledger account|cash book|subsidiary/i.test(J[1].text), "T3 …and did not wander into a fresh unrelated search");
// 4
ok(J[2].act === "example" && /example/i.test(J[2].text) && /Dr\./.test(J[2].text) && J[2].topic.chapterId === "jr", "T4 Give an example → a Journal example (entry table)", J[2].text);
// 5
ok(J[3].act === "importance" && /(matters|reason)/i.test(J[3].text) && /(ledger|posted|first|original)/i.test(J[3].text) && !/\| *Date *\|/i.test(J[3].text), "T5 Why is Journal important? → importance", J[3].text);
// 6
ok(J[4].act === "format" && /Date/.test(J[4].text) && /Particulars/.test(J[4].text) && /L\.F\./.test(J[4].text) && /Debit/i.test(J[4].text), "T6 What is the format of Journal? → the format", J[4].text);
// 7 depreciation
const DP = chat(["Explain depreciation.", "Make it simpler.", "Give an example."]);
ok(DP.every(x => x.topic && x.topic.chapterId === "dep"), "T7 topic stays Depreciation through explain → simpler → example");
ok(DP[1].act === "simplify" && words(DP[1].text) < words(DP[0].text), "T7 'Make it simpler' is a simpler, shorter depreciation answer");
ok(/depreciat/i.test(DP[2].text) && /₹/.test(DP[2].text) && /Final Answer/.test(DP[2].text), "T7 example is a worked depreciation calculation", DP[2].text);
// 8, 9
const G1 = chat(["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value."])[0];
ok(/₹53,100/.test(G1.text) && /Final Answer/.test(G1.text), "T8 invoice value ₹53,100 (45,000 + 8,100)", G1.text.slice(-200));
const G2 = chat(["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Goods ₹1,50,000, trade discount 15%, GST 18%."])[1];
ok(/₹1,50,450/.test(G2.text) && !/₹53,100/.test(G2.text), "T9 changed figures are RE-SOLVED (₹1,50,450), not the stored ₹53,100", G2.text.slice(-200));
ok(G2.answer.kind === "numerical", "T9 numerical route, not a stored-answer lookup");
// 11 / 12 attached question
const AQ = chat(["Please solve this question step by step.", "Explain this."], { question: wire(bq.id) });
ok(/Let's solve this question step by step/.test(AQ[0].text) && AQ[0].text.includes(Calc_inr(Math.abs(bq.raw.finalBalance))), "Ask AI first message solves the attached question", AQ[0].text.slice(0, 200));
ok(AQ[1].target === "question" && /BRS Detective|Bank Reconciliation/i.test(AQ[1].text), "T11 'Explain this.' refers to the attached question", AQ[1].text.slice(0, 200));
const mb = wire(bq.id); mb.studentAnswer = "₹" + (Math.abs(bq.raw.finalBalance) - 2 * bq.raw.items[0].amount).toLocaleString("en-IN");
const MB = chat(["Why was my answer wrong?"], { question: mb })[0];
ok(MB.act === "mistake" && MB.text.includes(mb.studentAnswer) && MB.text.includes(Calc_inr(Math.abs(bq.raw.finalBalance))) && /treated|differs|wrong way/i.test(MB.text), "T12 Mistake Book: compares the student's answer with the correct one and names the slip", MB.text);
function Calc_inr(n) { return require(path.join(ROOT, "ai-calc.js")).inr(n); }
// 13 another example
const AE = chat(["What is Journal?", "Give an example.", "Give another example."]);
ok(AE[2].act === "another" && AE[2].topic.chapterId === "jr" && AE[2].text !== AE[1].text, "T13 another example: same topic, a DIFFERENT example");
const AD = chat(["Explain depreciation.", "Give an example.", "Give another example.", "One more example"]);
ok(new Set(AD.slice(1).map(x => x.text)).size === 3 && AD.every(x => x.topic.chapterId === "dep"), "T13 depreciation: three different worked examples, same topic");

/* ================= C. meaning vs format ================= */
section("C. 'What is X?' vs 'format of X?'");
const topics = ["journal", "ledger", "cash book", "trial balance", "bank reconciliation statement", "depreciation", "GST", "accounting equation", "debtor"];
topics.forEach(tp => {
  const def = chat([`What is ${/^(a|an|the)\b/i.test(tp) ? "" : (/^[aeiou]/i.test(tp) ? "an " : "a ")}${tp}?`])[0];
  ok(def.text && def.act === "define" && words(def.text) <= 120, `C define "${tp}" → short concept answer`, def.text && words(def.text) + "w: " + def.text.slice(0, 160));
  ok(def.text && !/^\*\*[^*]*format/i.test(def.text.trim()), `C define "${tp}" does not lead with a format block`);
});
const fm = chat(["What is the format of Journal?"])[0], df = chat(["What is Journal?"])[0];
ok(fm.text !== df.text && /Particulars/.test(fm.text) && !/Particulars/.test(df.text), "C the two intents give different answers (format has columns, meaning does not)");
ok(chat(["Explain Journal format"])[0].act === "format", "C 'Explain Journal format' is the format intent");
ok(chat(["Explain Journal in simple words"])[0].text.indexOf("simple") >= 0 && !/Particulars/.test(chat(["Explain Journal in simple words"])[0].text), "C 'Explain Journal in simple words' → simple concept, not format");

// The site names its blocks in many different ways; definitions must still be found by what they SAY.
const defOf = q => chat([q])[0].text;
ok(/Assets\s*=/.test(defOf("What is the accounting equation?")) && /Capital/.test(defOf("What is the accounting equation?")) && !/dual aspect/i.test(defOf("What is the accounting equation?").slice(0, 120)), "C 'accounting equation' → the equation itself (Assets = …), not a side topic", defOf("What is the accounting equation?"));
ok(/cash book/i.test(defOf("What is a cash book?")) && /(receipt|payment)/i.test(defOf("What is a cash book?")) && !/subsidiary books/i.test(defOf("What is a cash book?").slice(0, 80)), "C 'cash book' → what a cash book is (not a generic subsidiary-books intro)", defOf("What is a cash book?"));
ok(/petty/i.test(defOf("What is petty cash?")) && /(small|minor|day-to-day|petty)/i.test(defOf("What is petty cash?")), "C 'petty cash' → its meaning", defOf("What is petty cash?"));
ok(/(earned|incurred|accrual)/i.test(defOf("What is accrual basis?")) && /(cash)/i.test(defOf("What is accrual basis?")), "C 'accrual basis' → recorded when earned/incurred, not when cash moves", defOf("What is accrual basis?"));
ok(/(debit|credit)/i.test(defOf("What is a trial balance?")) && /(list|total|balance)/i.test(defOf("What is a trial balance?")), "C 'trial balance' → meaning (debit/credit balances listed and totalled)", defOf("What is a trial balance?"));
ok(/CGST/.test(defOf("What is the difference between CGST and SGST?")) && !/^\*\*Input GST/.test(defOf("What is the difference between CGST and SGST?")), "C CGST vs SGST → about CGST/SGST (not Input vs Output GST)", defOf("What is the difference between CGST and SGST?"));
ok(!/Why .*(Agree|Agrees) .*matters/.test(defOf("Why does Trial Balance agree?")) && /Trial Balance/.test(defOf("Why does Trial Balance agree?")), "C 'Why does Trial Balance agree?' has a clean heading and no duplicated lines", defOf("Why does Trial Balance agree?"));
const whyTB = defOf("Why does Trial Balance agree?"); const lines = whyTB.split("\n").map(x => x.replace(/^- /, "").trim()).filter(x => x.length > 25);
ok(new Set(lines).size === lines.length, "C importance answers never print the same line twice", whyTB);

/* ================= D. long follow-up chains ================= */
section("D. Follow-up chains");
const chain = chat(["What is Journal?", "Why is it important?", "Explain that simply.", "Give an example.", "Now give me a question."]);
ok(chain.every(x => x.topic && x.topic.chapterId === "jr"), "D Journal chain: every turn stays on Journal", chain.map(x => x.topic && x.topic.chapterId).join(","));
const pq = kb.questionById[chain[4].state.pendingPractice && chain[4].state.pendingPractice.qid];
ok(pq && pq.chapterId === "jr" && chain[4].act === "practice", "D 'Now give me a question' → a Journal-chapter question", pq && pq.chapterId);
const dchain = chat(["Explain depreciation.", "What if WDV is used?", "Show me with numbers.", "Now give me a question.", "Show solution"]);
ok(dchain.every(x => x.topic && x.topic.chapterId === "dep"), "D Depreciation chain stays on depreciation");
ok(/written down value|WDV/i.test(dchain[1].text), "D 'What if WDV is used?' explains WDV");
ok(/Written Down Value|WDV/i.test(dchain[2].text) && /₹/.test(dchain[2].text), "D 'Show me with numbers' uses the WDV method from the previous turn", dchain[2].text.slice(0, 160));
ok(/Answer|Correct|✔|Why/i.test(dchain[4].text), "D 'Show solution' solves the pending question");
const gchain = chat(["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Why?", "Explain that simply", "What if the GST is 12%?", "Give me the final answer only", "Show all steps"]);
ok(/taxable|discount/i.test(gchain[1].text), "D numerical 'Why?' explains the reasoning of the same problem");
ok(/In simple words/i.test(gchain[2].text) && /53,100/.test(gchain[2].text), "D numerical 'explain simply' narrates the same solution");
ok(/₹50,400/.test(gchain[3].text), "D what-if GST 12% recomputes (₹50,400)", gchain[3].text.slice(-150));
ok(!/Working/.test(gchain[4].text) && /Final Answer/.test(gchain[4].text) && /50,400/.test(gchain[4].text), "D 'final answer only' follows the latest (what-if) problem, concisely", gchain[4].text);
ok(/Working/.test(gchain[5].text) && /50,400/.test(gchain[5].text), "D 'show all steps' gives the full working", gchain[5].text.slice(0, 120));
const cch = chat(["Cash Book balance ₹25,000. A cheque of ₹5,000 issued is not yet presented. Find the Pass Book balance.", "Why is that added?", "What if it starts from the Pass Book instead?"]);
ok(/₹30,000/.test(cch[0].text) && /(timing|presented|bank)/i.test(cch[1].text), "D BRS: 'why' stays with the BRS answer");
ok(cch[2].topic.chapterId === "brs", "D BRS what-if stays in the BRS chapter");
// clarification round-trip
const cl = chat(["Goods worth ₹30,000, find the invoice value.", "18%"]);
ok(cl[0].answer.kind === "chat" && /rate/i.test(cl[0].text) && /₹35,400/.test(cl[1].text), "D missing GST rate → asks → the one-word reply completes the solution", cl[1].text.slice(-120));

/* ================= E. small talk / confusion / out of scope ================= */
section("E. Small talk, confusion, out of scope");
const small = chat(["Hi", "What can you do?", "Thank you", "ok", "Can you help me?"]);
ok(small.every(x => x.answer && x.answer.sources.length === 0), "E small talk never cites course content");
ok(/Class 11|Accountancy|topic|study|concept|question/i.test(small[0].text) && /numerical|journal|explain/i.test(small[1].text) && !/large language|chatgpt|gpt/i.test(small[1].text), "E greeting + honest capabilities (no LLM claims)");
const conf = chat(["What is depreciation?", "I don't get it", "I still don't understand", "I'm confused"]);
ok(conf[1].text !== conf[0].text && /simple/i.test(conf[1].text), "E confusion #1 → a simpler version, not a repeat", conf[1].text.slice(0, 120));
ok(conf[2].text !== conf[1].text && /(example|₹)/i.test(conf[2].text), "E confusion #2 → a different approach (an example)");
ok(conf[3].text !== conf[2].text && /(which|what part|meaning|example)/i.test(conf[3].text), "E confusion #3 → asks which part is unclear");
const un = chat(["What is the capital of France?", "Tell me a joke"]);
ok(un.every(x => x.act === "unrelated" && /Accountancy/i.test(x.text) && x.answer.sources.length === 0), "E unrelated → brief redirect, no fake answer");
ok(!/error|exception|undefined|null/i.test(un[0].text), "E no internal errors exposed");
ok(chat(["asdf qwerty zxcv"])[0].text !== undefined || true, "E gibberish does not crash");
const accountingCycle = chat(["Explain the accounting cycle"])[0];
ok(/Journal/.test(accountingCycle.text) && /Ledger/.test(accountingCycle.text) && /Trial Balance/.test(accountingCycle.text) && /Final Accounts/.test(accountingCycle.text), "E accounting-cycle answer links Journal → Ledger → Trial Balance → Final Accounts");

/* ================= F. repeated questions ================= */
section("F. Repeated questions: wording varies, meaning does not");
function repeated(q, n) { let st = Core.newState(); const outs = []; for (let i = 0; i < n; i++) { const r = Core.respond(kb, q, st, { debug: true }); st = r.state; outs.push(r.answer.text); } return outs; }
const rep = repeated("What is a Journal?", 3);
ok(new Set(rep).size === 3, "F three asks → three different wordings", rep.map(x => x.slice(0, 40)).join(" | "));
rep.forEach((t, i) => ok(/(first|original)/i.test(t) && /(transaction)/i.test(t) && /(order|chronolog|diary|date|day)/i.test(t), `F wording #${i + 1} keeps the core facts (first record · transactions · in order)`, t));
const rep2 = repeated("What is depreciation?", 3);
ok(new Set(rep2).size >= 2, "F depreciation: wording varies");
rep2.forEach((t, i) => ok(/(gradual|decrease|fall|reduction|wear)/i.test(t) && /(asset)/i.test(t), `F depreciation wording #${i + 1} keeps the facts`, t));
const nums = ["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "A trader sold goods of ₹50,000 with 10% trade discount and 18% GST. What is the invoice value?", "invoice value? goods rs 50000 less 10 percent trade discount, gst @ 18 percent", "Find the total bill: list price ₹50,000, trade discount 10%, GST 18%"];
ok(nums.every(q => /₹53,100/.test(chat([q])[0].text)), "F four phrasings of one GST problem → the same accounting result (₹53,100)");
const rr = chat(["What is Journal?", "Rephrase that", "Say it differently"]);
ok(rr[1].text !== rr[0].text && rr[2].text !== rr[1].text && /(first|original)/i.test(rr[1].text), "F 'rephrase' keeps the meaning, changes the words");
const rep3 = repeated("Explain Journal", 3);
ok(new Set(rep3).size >= 2 && rep3.every(t => /(first|original)/i.test(t)), "F 'Explain Journal' ×3: varied wording, same facts");

/* ================= G. attached Ask-AI question in every section ================= */
section("G. Attached question = active context (every section)");
const sections = ["Practice Bank", "Accounting in Action", "Term Detective", "Concept Detective", "Basis Switch", "Balance Sheet Questions", "Journal → Ledger Practice", "Exam Questions", "BRS Detective", "GST Bill Detective", "Trial Balance Checkpoint", "Important Questions", "Quiz"];
sections.forEach(sec => {
  const q = kb.questions.find(x => x.section === sec && x.text.length > 30); if (!q) { ok(false, "G section present: " + sec); return; }
  const c = chat(["Please solve this question step by step.", "Why is this the answer?", "Explain this.", "Make it simpler."], { question: wire(q.id) });
  ok(c[0].answer && c[0].text.length > 40 && /Let's solve this question/.test(c[0].text), `G ${sec}: first turn solves the attached question`, c[0].text && c[0].text.slice(0, 100));
  ok(c.slice(1).every(x => x.answer && x.target === "question" && x.text.length > 20), `G ${sec}: follow-ups ("why / explain this / simpler") still refer to it`, c.slice(1).map(x => x.act + ":" + x.target + ":" + (x.text || "∅").slice(0, 30)).join(" | "));
});
const nx = chat(["Please solve this question step by step.", "Explain the next step.", "next step", "next step"], { question: wire(bq.id) });
ok(/Step 1 of/.test(nx[1].text) && /Step 2 of/.test(nx[2].text), "G 'Explain the next step' walks through the attached question one step at a time", nx[1].text.slice(0, 80));
const detach = chat(["Please solve this question step by step.", "What is GST?"], { question: wire(bq.id) });
ok(detach[1].U.explicitTopic && detach[1].topic.chapterId === "gst", "G a clearly NEW topic takes over even while a question is attached");
const sim = chat(["Please solve this question step by step.", "Make it simpler", "Make it shorter"], { question: wire(bq.id) });
ok(words(sim[2].text) <= words(sim[1].text) + 5, "G simpler → shorter keeps shrinking, not growing");
// mistake book without a recognisable question text
const custom = { id: null, srcKey: null, section: "Mistake Book", chapterId: "dep", kind: "custom", text: "Which method charges depreciation on the reducing balance?", options: null, correctText: "Written Down Value method", answer: null, explanation: "WDV applies the rate to the book value, which falls each year.", steps: null, hint: null, studentAnswer: "Straight Line Method" };
const cm = chat(["Why was my answer wrong?"], { question: custom })[0];
ok(/Straight Line Method/.test(cm.text) && /Written Down Value/.test(cm.text) && /reducing|book value/i.test(cm.text), "G Mistake Book (non-numeric): student answer vs correct answer + reason", cm.text);
const num = Object.assign({}, wire(kb.questions.find(q => q.srcKey === "gst.detective").id));
const gq = kb.questions.find(q => q.srcKey === "gst.detective");
const wrongNum = Object.assign({}, num, { studentAnswer: Calc_inr(gq.raw.answerValue - 7) });
ok(/differs|wrong|higher|lower|Your answer/i.test(chat(["Why was my answer wrong?"], { question: wrongNum })[0].text), "G Mistake Book (GST bill): answer compared numerically");

/* ================= H. answer modes follow the student's words ================= */
section("H. Answer modes follow the current request");
const base = "Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.";
const hint = Core.respond(kb, base, Core.newState(), { mode: "hint" }).answer.text;
ok(/Hint/.test(hint) && !/53,100/.test(hint), "H chat in Hint mode → a hint, no answer");
const hint2 = Core.respond(kb, base + " Give the full solution step by step.", Core.newState(), { mode: "hint" }).answer.text;
ok(/Working/.test(hint2) && /53,100/.test(hint2), "H explicit 'full solution' beats the chat's Hint mode");
const fin = Core.respond(kb, base + " Just tell me the answer.", Core.newState(), { mode: "steps" }).answer.text;
ok(!/Working/.test(fin) && /53,100/.test(fin), "H 'just tell me the answer' → concise final answer even in Steps mode");
const ex = Core.respond(kb, "Explain journal simply", Core.newState(), { mode: "hint" }).answer.text;
ok(!/Hint/.test(ex) && /simple/i.test(ex), "H concept questions ignore a stale Hint mode");

/* ================= I. memory is scoped to one chat ================= */
section("I. Memory scope");
let A = Core.newState(); A = Core.respond(kb, "What is Journal?", A, {}).state;
const B = Core.newState(); const bAns = Core.respond(kb, "Explain that more simply.", B, {});
ok(A.topic && A.topic.chapterId === "jr", "I chat A remembers Journal");
ok(bAns.answer && !/journal/i.test(bAns.answer.text) && /(which topic|what topic|topic or question)/i.test(bAns.answer.text), "I a NEW chat does not inherit Journal — it asks what to simplify", bAns.answer && bAns.answer.text);
ok(Core.newState().topic === null && Core.newState().lastAnswer === null && Core.newState().numerical === null && Core.newState().pendingPractice === null && Core.newState().clarification === null && Core.newState().usedExamples.length === 0, "I newState() is completely empty");
const polluted = Core.cleanState({ topic: { chapterId: "jr" }, lastAnswer: { text: "x" }, repeats: 5, usedExamples: "bad" });
ok(Array.isArray(polluted.usedExamples) && typeof polluted.repeats === "object", "I cleanState repairs malformed saved state (older chats)");
const wsx = Core.sanitizeWireState({ topic: { chapterId: "x".repeat(500), label: "y".repeat(500), tokens: new Array(50).fill("t") }, lastAnswer: { text: "z".repeat(9000) }, confusion: 99, mode: "evil" });
ok(wsx.topic.label.length <= 80 && wsx.lastAnswer.text.length <= 1800 && wsx.confusion <= 5 && wsx.mode === null, "I server-side state sanitiser bounds sizes and values");

/* ================= J. wording + Noupe ================= */
section("J. Student-facing wording and Noupe removal");
const files = [];
(function walk(d) { fs.readdirSync(d, { withFileTypes: true }).forEach(e => { if (/^(node_modules|\.git)$/.test(e.name)) return; const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|html|css|json|toml|md|webmanifest|svg|txt)$/i.test(e.name) && fs.statSync(p).size < 4e6) files.push(p); }); })(ROOT);
const noupe = files.filter(f => !/tests[\\/](ai-intelligence-tests|e2e-tutor-chat)\.js$/.test(f) && /noupe/i.test(fs.readFileSync(f, "utf8")));
ok(noupe.length === 0, "J no file in the repository mentions Noupe (script, widget, styles, storage keys, comments)", noupe.map(f => path.relative(ROOT, f)).join(", "));
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const extScripts = [...html.matchAll(/<script[^>]+src=["'](https?:[^"']+)["']/g)].map(m => m[1]);
ok(extScripts.every(u => /unpkg\.com\/lucide/.test(u)), "J the only external script left is the icon library", extScripts.join(" | "));
ok(!/data-dragging|scanForWidgets|EXCLUDE_IDS|widgetPos/.test(html + fs.readFileSync(path.join(ROOT, "app.js"), "utf8")), "J no leftover widget-dragging helper");
const visible = ["app.js", "index.html", "ai-knowledge.js", "ai-solver.js", "ai-tutor-core.js", "tutor-engine.js", "ai-calc.js"].map(f => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
["AI Tutor is still evolving", "under training", "built-in tutor", "AI service wasn't reached", "wasn't reached", "AI service isn't", "offline engine", "Answered from this site's own content", "calculator engine", "backend was unavailable", "couldn't reach the AI"].forEach(p => ok(!visible.includes(p), `J no student-facing "${p}"`));
// and none of those leaked into an actual answer
const sample = [chat(["What is Journal?", "Explain that more simply.", "Why?", "Give an example."]), chat(["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Why?"]), chat(["Hi"]), chat(["What is the capital of France?"])].flat().map(x => x.text || "").join("\n");
ok(!/Priority \d|BM25|retriev|context block|offline|tool call|backend|service/i.test(sample), "J no internal vocabulary appears in any generated answer", (/Priority \d|BM25|retriev|context block|offline|tool call|backend|service/i.exec(sample) || [])[0]);
const labels = chat(["What is Journal?"])[0].answer.sources.map(s => s.label);
ok(labels.length && labels.every(l => /^(Based on|Related topic): /.test(l)) && labels.length <= 2, "J source labels are natural ('Based on: …')", labels.join(" | "));

/* ================= L. no repetition · account reasoning · conflicts · purity ================= */
section("L. No repetition, account reasoning, data conflicts, state purity");
ok(kb.docs.every((d, i) => d.id === i), "L every indexed block has a stable id (needed to avoid repeating itself)");
const ex1 = chat(["What is depreciation?", "Explain more.", "Explain more.", "Explain more."]);
ok(new Set(ex1.slice(1).map(x => x.text)).size === 3, "L 'explain more' ×3 never repeats the same text", ex1.slice(1).map(x => (x.text || "").slice(0, 30)).join(" | "));
const usedOnce = ex1[1].answer.used.map(d => d.id), usedTwice = ex1[2].answer.used.map(d => d.id);
ok(usedTwice.every(id => !usedOnce.includes(id)), "L the second 'explain more' uses blocks the first one did not");
const sal = chat(["Why is salary debited?"])[0];
ok(/Nominal/.test(sal.text) && /Expense/.test(sal.text) && /debit/i.test(sal.text) && sal.answer.sources.length >= 1, "L 'Why is salary debited?' → account type + the rule + a source", sal.text);
ok(/Asset/.test(chat(["Why is cash debited?"])[0].text) && /Income/.test(chat(["Why is sales credited?"])[0].text) && /Capital/.test(chat(["Why is capital credited?"])[0].text), "L the same reasoning works for assets, incomes and capital");
/* brs.detective#102 is now a CONSISTENT stored answer (the data bug was fixed),
   so to keep covering the gentle-flagging behaviour we synthesise an
   inconsistency in the in-memory fixture, assert the tutor flags it softly,
   then restore the real figure. This tests the behaviour, not a data defect. */
const brsFixture = kb.questionById["brs.detective#102"];
const trueFinal = brsFixture.raw.finalBalance;
brsFixture.raw.finalBalance = trueFinal + 5000; // force an audit conflict
let badAns;
try { badAns = chat(["Please solve this question step by step."], { question: wire("brs.detective#102") })[0].text; }
finally { brsFixture.raw.finalBalance = trueFinal; } // always restore the real data
ok(/Note:\*\* the figures printed with this question/.test(badAns) && !/stored|audit|conflict|BM25|mismatch/i.test(badAns), "L an inconsistent stored answer is flagged gently, without debugging vocabulary", badAns.slice(-260));
const eq31 = chat(["Please solve this question step by step."], { question: wire("equation.numericals#31") })[0].text;
ok(!/stored|audit/i.test(eq31), "L equation Q31 (inconsistent given figures) shows no internal wording");
const coreSrc = ["ai-tutor-core.js", "ai-solver.js", "ai-calc.js", "ai-knowledge.js"].map(f => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
ok(!/\bSTATE\b|localStorage|sessionStorage|document\.|addXP|saveState|acRun|accountingCycle\.(add|set|save)/.test(coreSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "")), "L the tutor core never touches app state, XP, progress or Accounting Cycle data (pure functions)");
ok(!/console\.(log|debug|warn)/.test(coreSrc), "L no debug logging in the tutor modules");
// speed: a whole 10-turn conversation and index lookups stay fast
const t0 = Date.now(); for (let i = 0; i < 20; i++) chat(["What is Journal?", "Explain that more simply.", "Give an example.", "Why is it important?", "Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value."]); const perTurn = (Date.now() - t0) / 100;
ok(perTurn < 25, `L average reply time ${perTurn.toFixed(1)} ms per turn (index is cached, not rebuilt)`, perTurn);

/* ================= M. v80 probe regressions (found by the independent probe, not by this file) ================= */
section("M. Ambiguous asks, follow-up solving, concise mode, thin definitions");
// 1. "Give a Journal entry." used to fall through to a bare definition with no Dr/Cr at all
const M1 = chat(["Give a Journal entry."])[0];
ok(M1.act === "example", "M 'Give a Journal entry.' is an EXAMPLE request, not a definition", M1.act);
ok(/Dr\./.test(M1.text) && /Cr\./.test(M1.text), "M …and it actually prints a journal entry", M1.text.slice(0, 220));
// 2. "solve one using WDV" used to be answered with the WDV *definition* (no figures)
const M2 = chat(["Explain depreciation.", "Now solve one using WDV."]);
ok(M2[1].answer.kind === "numerical", "M 'Now solve one using WDV.' produces a worked problem", M2[1].act + "/" + (M2[1].answer && M2[1].answer.kind));
ok(/₹/.test(M2[1].text) && /wdv|written down/i.test(M2[1].text), "M …with figures, on the WDV method", M2[1].text.slice(0, 200));
ok(!(M2[1].act === "define" && !/₹/.test(M2[1].text)), "M …it is never answered as a bare definition");
// 3. "final answer only" must not repeat the whole breakdown table
const M3 = chat(["Goods ₹50,000, trade discount 10%, GST 18%. Find invoice value.", "Just give me the final answer"])[1];
ok(M3.answer.kind === "numerical" && /53,100/.test(M3.text), "M final-only keeps the right figure", M3.text);
ok(words(M3.text) < 45 && !/\*\*Working\*\*/.test(M3.text), "M final-only is short (" + words(M3.text) + " words) and has no working", M3.text.slice(0, 200));
// 4. a short concept card that never names its own subject must still tell the student what it is
const M4 = chat(["What is the accounting concept of going concern?"])[0];
ok(/going concern/i.test(M4.text), "M a one-line definition still names the concept it defines", M4.text);
ok(M4.answer.sources && M4.answer.sources.length > 0, "M …and still attributes the chapter it came from");
// 5. the same guard does not prefix answers that already mention the topic
const M5 = chat(["What is Journal?"])[0];
ok(!/^\*\*Journal:\*\*/.test(M5.text), "M answers that already say the topic are not double-labelled", M5.text.slice(0, 80));
// 6. asking for a journal entry AFTER a definition keeps the conversation on Journal
const M6 = chat(["What is Journal?", "Give a Journal entry."]);
ok(M6[1].topic && M6[1].topic.chapterId === "jr", "M the follow-up entry request stays in chapter jr", JSON.stringify(M6[1].topic));/* ================= K. the offline understanding IS the tutor ================= */
section("K. Local understanding (no backend exists)");
{
  const st1 = Core.wireState(chat(["What is Journal?"])[0].state);
  const u1 = Core.understand(kb, "Explain that more simply.", Core.sanitizeWireState(st1), {});
  ok(u1.act === "simplify" && u1.target === "topic", "the tutor reads state and reaches the same intent fully offline");
}

console.log("\nAI intelligence tests: " + pass + " passed, " + fail + " failed");
if (fail) { console.log("\nFAILURES:"); failures.forEach(f => console.log("  x " + f)); process.exit(1); }
