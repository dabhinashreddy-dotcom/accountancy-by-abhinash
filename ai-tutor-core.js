/* ============================================================
   AI TUTOR — CORE  (ai-tutor-core.js)
   ------------------------------------------------------------
   The thinking layer that sits between the student's message and
   the knowledge index.  The SAME file runs in the browser (offline
   tutor) and in the Netlify function (prompt preparation), so both
   always agree on intent, topic and context.

     message + chat memory + attached question
        1. UNDERSTAND   what does the student want?  (act, style, topic, "that" = ?)
        2. RESOLVE      which topic / question / earlier answer does it refer to?
        3. RETRIEVE     role-aware search of the site's own content
        4. REASON       accounting rules + deterministic solver (ai-solver.js)
        5. COMPOSE      synthesise one natural answer at the right length/level
        6. VALIDATE     solver self-checks, journal Dr = Cr, stored-answer audit
        7. REMEMBER     structured state for the next follow-up

   Everything is pure: no DOM, no network, and it never touches app state
   (XP, progress, Accounting Cycle data…). It only returns an answer object and
   an updated copy of the conversation state.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ai-calc.js"), require("./ai-knowledge.js"), require("./ai-solver.js"));
  else root.AICore = factory(root.AICalc, root.AIKnowledge, root.AISolver);
})(typeof self !== "undefined" ? self : this, function (Calc, Know, Solver) {
  "use strict";
  const U_ = Know.util;
  const inr = Calc.inr;

  /* =========================================================
     1. SMALL TEXT TOOLS
     ========================================================= */
  const ABBR = [["L.F.", "L¤F¤"], ["e.g.", "e¤g¤"], ["i.e.", "i¤e¤"], ["Dr.", "Dr¤"], ["Cr.", "Cr¤"], ["A/c.", "A/c¤"], ["No.", "No¤"], ["etc.", "etc¤"], ["vs.", "vs¤"], ["Rs.", "Rs¤"]];
  function sentences(text) {
    let t = String(text || "").replace(/\s+/g, " ").trim(); if (!t) return [];
    ABBR.forEach(([a, b]) => { t = t.split(a).join(b); });
    t = t.replace(/\.{3}/g, "¤¤¤").replace(/(\d)\.(\d)/g, "$1¤$2");
    const out = t.match(/[^.!?]+(?:[.!?]+['"”’)]*|$)/g) || [t];
    return out.map(s => s.replace(/¤/g, ".").trim()).filter(Boolean);
  }
  function words(s) { return String(s || "").trim().split(/\s+/).filter(Boolean); }
  function firstSentences(text, n, maxWords) {
    const ss = sentences(text); let out = [], wc = 0;
    for (const s of ss) { if (out.length >= (n || 2)) break; const w = words(s).length; if (out.length && maxWords && wc + w > maxWords) break; out.push(s); wc += w; }
    return out.join(" ");
  }
  function ensureStop(s) { s = String(s || "").trim(); return s && !/[.!?…)'"”]$/.test(s) ? s + "." : s; }
  function decap(s) { s = String(s || ""); return /^(The |A |An |It |This |In |Every |Each |Think |Not )/.test(s) || !/^[A-Z][a-z]/.test(s) ? s.replace(/^([A-Z])(?=[a-z])/, c => c.toLowerCase()) : s; }
  function cap(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }
  function titleCase(s) { return String(s || "").replace(/\b([a-z])/g, c => c.toUpperCase()).replace(/\b(Of|And|The|For|To|In|A|An)\b(?!^)/g, m => m.toLowerCase()).replace(/^./, c => c.toUpperCase()); }
  function pick(arr, n) { return arr[Math.abs(n | 0) % arr.length]; }
  function bullets(arr) { return arr.map(s => "- " + s).join("\n"); }
  function strip(s) { return U_.stripHtml(s); }

  // Everyday-language glossary used when a student asks for "simpler". Meaning is never changed — only words.
  const PLAIN = [
    [/\s+—\s+which is why\b/gi, ". That is why"], [/,\s+which is why\b/gi, ". That is why"],
    [/\bchronological order\b/gi, "the order in which they happen"], [/\bchronologically\b/gi, "day by day"], [/\bchronological\b/gi, "day-by-day"],
    [/\bsystematically\b/gi, "in an organised way"], [/\banaly[sz]ed\b/gi, "worked out"], [/\bobsolescence\b/gi, "becoming out of date"],
    [/\btangible\b/gi, "physical"], [/\bgradual and permanent decrease in the value\b/gi, "slow, permanent fall in the value"], [/\bnon-cash charge\b/gi, "expense that doesn't involve paying any cash"],
    [/\bderived from\b/gi, "taken from"], [/\bpertaining to\b/gi, "about"], [/\bcommence(s|d)?\b/gi, "start$1"], [/\bsubsequently\b/gi, "later"], [/\bfurthermore\b/gi, "also"],
    [/\bnumerous\b/gi, "many"], [/\bapproximately\b/gi, "about"], [/\bascertain(s|ed)?\b/gi, "find out"], [/\butili[sz]e(s|d)?\b/gi, "use$1"], [/\bremuneration\b/gi, "pay"],
    [/\bobtain(s|ed)?\b/gi, "get$1"], [/\bprior to\b/gi, "before"], [/\bin respect of\b/gi, "for"], [/\bconsequently\b/gi, "so"], [/\bhence\b/gi, "so"], [/\bthereby\b/gi, "and so"],
    [/\bpreparation of\b/gi, "making"], [/\bdesignated\b/gi, "named"], [/\bspecific\b/gi, "particular"], [/\bregarding\b/gi, "about"], [/\binvolving\b/gi, "that involve"],
    [/\bpermanent\b/gi, "lasting"], [/\bunderlying\b/gi, "basic"], [/\bfacilitates?\b/gi, "helps with"], [/\bin accordance with\b/gi, "following"]
  ];
  function plainify(text) {
    let t = String(text || "");
    PLAIN.forEach(([re, to]) => { t = t.replace(re, to); });
    // break long sentences at natural joints into short ones
    const out = [];
    sentences(t).forEach(s => {
      if (words(s).length <= 24) { out.push(s); return; }
      const parts = s.split(/\s+—\s+|;\s+|,\s+(?:which|because|so that|while|and then)\s+/);
      parts.forEach((p, i) => { p = p.trim(); if (p.length > 3) out.push(ensureStop(i === 0 ? p : cap(p))); });
    });
    return out.join(" ");
  }
  // the one idea of an answer: first sentence, cut at the first natural joint if it is long
  function mainPoint(text, maxWords) {
    let s = sentences(strip(text))[0] || ""; const lim = maxWords || 24;
    if (words(s).length > lim) { const cut = s.split(/\s+—\s+|;\s+|,\s+(?:which|because|so that|while)\s+/)[0]; if (words(cut).length >= 6) s = cut; }
    if (words(s).length > lim + 6) s = words(s).slice(0, lim).join(" ");
    return ensureStop(s.replace(/[,:;—-]+$/, ""));
  }
  function sentencesAbout(text, tokens, max) {
    const ss = sentences(text); if (!tokens || !tokens.length) return ss.slice(0, max || 2);
    const set = new Set(tokens);
    const hit = ss.filter(s => U_.tokenize(s).some(t => set.has(t)));
    return (hit.length ? hit : ss).slice(0, max || 2);
  }

  /* =========================================================
     2. CONVERSATION STATE  (structured; scoped to ONE chat)
     ========================================================= */
  function newState() {
    return { v: 2, topic: null, intent: null, lastUser: "", lastAnswer: null, numerical: null, question: null, attempt: null, correction: null,
      assumptions: [], pendingPractice: null, clarification: null, mode: null, repeats: {}, usedExamples: [], usedDocs: [], usedPractice: [], confusion: 0, stepIdx: 0, turn: 0 };
  }
  function cleanState(s) {
    const n = Object.assign(newState(), s && typeof s === "object" ? s : {});
    n.repeats = n.repeats && typeof n.repeats === "object" ? n.repeats : {};
    ["usedExamples", "usedDocs", "usedPractice", "assumptions"].forEach(k => { if (!Array.isArray(n[k])) n[k] = []; });
    return n;
  }
  // The compact form that travels to the backend (bounded sizes; the server validates again)
  function wireState(s) {
    s = cleanState(s); const la = s.lastAnswer;
    return {
      topic: s.topic ? { chapterId: s.topic.chapterId || null, label: String(s.topic.label || "").slice(0, 80), tokens: (s.topic.tokens || []).slice(0, 8) } : null,
      intent: s.intent || null, lastUser: String(s.lastUser || "").slice(0, 400),
      lastAnswer: la ? { text: String(la.text || "").slice(0, 1800), act: la.act || null, kind: la.kind || null } : null,
      numerical: s.numerical ? { domain: s.numerical.domain, sourceText: String(s.numerical.sourceText || "").slice(0, 500), answerText: String(s.numerical.answerText || "").slice(0, 300) } : null,
      attempt: s.attempt ? String(s.attempt).slice(0, 300) : null, confusion: s.confusion | 0, mode: s.mode || null
    };
  }
  function sanitizeWireState(w) {
    if (!w || typeof w !== "object") return newState();
    const s = newState(); const str = (v, n) => typeof v === "string" ? v.slice(0, n) : "";
    if (w.topic && typeof w.topic === "object") s.topic = { chapterId: str(w.topic.chapterId, 20) || null, label: str(w.topic.label, 80), tokens: Array.isArray(w.topic.tokens) ? w.topic.tokens.slice(0, 8).map(x => str(String(x), 30)) : [] };
    s.intent = str(w.intent, 30) || null; s.lastUser = str(w.lastUser, 400);
    if (w.lastAnswer && typeof w.lastAnswer === "object") s.lastAnswer = { text: str(w.lastAnswer.text, 1800), act: str(w.lastAnswer.act, 30) || null, kind: str(w.lastAnswer.kind, 20) || null, topic: s.topic };
    if (w.numerical && typeof w.numerical === "object") s.numerical = { domain: str(w.numerical.domain, 30), sourceText: str(w.numerical.sourceText, 500), answerText: str(w.numerical.answerText, 300), inputs: null };
    s.attempt = str(w.attempt, 300) || null; s.confusion = Math.min(5, w.confusion | 0); s.mode = ["hint", "steps", "final"].includes(w.mode) ? w.mode : null;
    return s;
  }

  /* =========================================================
     3. UNDERSTANDING THE MESSAGE
     ========================================================= */
  // Words that carry the INTENT, not the topic — removed before looking for "what is this about?"
  const INTENT_WORDS = new Set(("agree agrees agreed tally tallies tallied explain explained explaining explanation describe define definition meaning mean means tell teach show give make say simple simply simpler easy easier easily short shorter brief briefly detail details detailed depth more less another again also example examples instance format layout columns column feature features importance important importantly why how work works working use used uses useful purpose need needed necessary reason difference differences between compare comparison versus summary summarise summarize revise revision recap quiz test practice question questions problem problems answer answers solve solution please kindly want like know understand understood get got now next then okay ok yes sure thing things basic basics concept concepts topic chapter main point points key idea ideas words word language terms way ways step steps final full complete whole entire just only little bit lot much many some any all each every one two three can could would should will shall may might let lets let's give gimme want wanna need can't cannot won't isn't aren't doesn't don't didn't what's who's here there such called named kind kinds type types sort sorts tl dr nutshell gist crux core overall overview clear clearly clarify expand elaborate continue go ahead help").split(/\s+/).map(w => U_.stem(w)));
  const ANAPHORA = /\b(it|its|that|this|these|those|they|them|one|same|above|previous|last|earlier|there)\b/;
  const UNRELATED_CUES = /\b(france|paris|london|india'?s? (capital|president)|prime minister|president of|cricket|football|ipl|movie|film|song|singer|actor|weather|recipe|cook|python|java(script)?|html|code|coding|program(ming)?|joke|poem|story|love|girlfriend|boyfriend|game|minecraft|youtube|instagram|whatsapp|politic|election|history of|capital of|who is the (king|queen)|bitcoin|crypto|stock market tips|horoscope|astrology)\b/;
  const SMALL = {
    greet: /^(hi+|hello+|hey+|hii+|heyy+|namaste|good (morning|afternoon|evening)|hola|yo|sup)\b[\s!.,?]*(there|tutor|sir|ma'?am|abhinash|buddy|friend)?[\s!.?]*$/,
    howru: /^(how are you|how'?s it going|how do you do|what'?s up|how are things)\b/,
    thanks: /^(thanks?( a lot| so much)?|thank you( so much| very much)?|thx|ty|much appreciated|appreciate it|great,? thanks?)\b/,
    ack: /^(ok(ay)?|okk+|k|kk|got it|gotcha|i see|i got it|understood|fine|alright|all right|cool|nice|great|good|perfect|awesome|makes sense|that makes sense|right|hmm+|ah+|oh+|i understand( now)?|that helps)[\s!.,]*$/,
    bye: /^(bye|goodbye|good night|see you|see ya|cya|talk later|that'?s all)\b/,
    abilities: /(what can you do|what do you do|how can you help|can you help( me)?\b|help me\b[\s!.?]*$|^help\b|who are you|what are you|are you (an? )?(ai|bot|human|robot|real)|what is your name|what'?s your name|how do i use (you|this)|how does this work|what are your features|can you solve)/
  };
  const CONFUSED = /(i (don'?t|do not|dont) (get|understand|follow|know)|i('| a)?m (confused|lost|stuck|not getting)|\bconfus(ed|ing)\b|makes? no sense|doesn'?t make sense|didn'?t (get|understand|follow)|not clear|still (don'?t|do not|dont|not|confused)|explain (it |that )?(once )?again|too (hard|difficult|complicated|complex)|i can'?t understand|unclear|what do you mean|don'?t get it|cannot understand|go slower|slowly)/;
  const RE = {
    repeat: /(repeat (that|it|the (answer|explanation))|say (that|it) again|once more|tell me again|come again)/,
    rephrase: /(rephrase|say (that|it) (differently|another way)|in other words|put it another way|different words|reword)/,
    mistake: /(find (my|the) mistake|where did i go wrong|what('?s| is| was) wrong with (my|the)|why (was|is|am i|were) (my|i)?.{0,18}wrong|what did i do wrong|my mistake|correct my|where am i wrong|why (is|was) my (answer|attempt) (wrong|incorrect)|why wrong)/,
    check: /(check (my|the) (answer|work|solution|attempt)|is (this|that|my answer|it) (right|correct|ok|okay|true)|am i (right|correct)|did i (get|do) (it|this|that)|verify (my|this)|my answer (is|was)|i (got|think|answered|solved)\b|is my .{0,20}correct)/,
    practice: /(practice|quiz\b|test me|give me (a |an |one |some )?([\w.-]+ ){0,3}(question|problem|mcq|numerical|exercise|sum)s?|ask me (a |an )?(question|something)|(another|next|one more|new) (question|problem|mcq|numerical)|(now|then|next).{0,20}\b(question|problem)\b|try (one|a question|something)|set a question|exam question|want (to )?(practice|practise))/,
    whatif: /^(what if|what happens if|what would happen if|suppose|assume|if instead|and if|but if|how about if|now if)\b/,
    compare: /(difference(s)? (between|in|of)|differentiate|distinguish|compare|comparison|\bvs\.?\b|versus|how (is|are|does|do) .{1,40} different|contrast|same as|similarit)/,
    importance: /(importan(t|ce)|why (is|are|do|does|should|must|would) .{0,40}(need|needed|necessary|used|use|prepared|maintained|required|study|learn|matter)|why (do|should) (we|i|you) (need|use|prepare|study|learn|maintain)|\bneed (for|of)\b|significance|advantages? of|purpose of|what is the use of|uses? of|benefit)/,
    why: /(^why\b|\bwhy (is|are|was|were|do|does|did|must|should|can'?t|isn'?t|aren'?t|has|have|would|will)\b|reason (for|behind|why)|how come|what'?s the (reason|logic|point)|\bwhy\?*$)/,
    another: /(another|one more|different|more examples?|next example|new example|else|again)/,
    example: /(example|e\.g\.|for instance|illustrat|demonstrate|sample|show me with (some )?numbers|with numbers|with figures|numerical example|real[- ]life|live example|\b(?:give|show|write|pass|make|prepare|record|post|draft|need|want)\b[^.!?]{0,30}\bentr(?:y|ies)\b)/,
    format: /(format|layout|proforma|specimen|columns?\b|ruling|structure of|how (is|are) (it|they|a|an|the)?.{0,25}(written|presented|drawn|prepared|set out|laid out|recorded)|template|draw)/,
    features: /(features?|characteristics?|properties|types? of|kinds? of|classification|categories|elements of|components? of|advantages|disadvantages|limitations|objectives? of|merits|demerits|rules? of|principles? of)/,
    formula: /(formula|how (to|do (i|we)) (calculate|compute|find|work out)|rule (for|of|to)|method (to|of|for)|steps? (to|for|of)|procedure|treatment of)/,
    summarize: /(summar(y|ise|ize)|revise|revision|recap|quick (notes?|revision|review)|key points|important points|overview|brief me|in a nutshell|chapter (notes|summary))/,
    define: /^(what|who|which)\s*('?s|is|are|was|were|does)?\b|^define\b|(meaning|definition) of|what do you mean by|^(what|who)\b/,
    explain: /(explain|describe|tell me about|teach|walk me through|help me understand|talk about|elaborate on|discuss|clarify|brief on|notes on|know about|learn about)/,
    how: /^how\b/,
    simplify: /(simpl(e|er|y|ify|ified)|easy|easier|easily|layman|plain (english|words|language)|kid|beginner|child|basic words|dumb it|like i('| a)?m (5|five)|eli5|everyday (words|language)|less technical|non[- ]technical)/,
    shorten: /(short(er|en)?\b|brief(ly)?\b|concise|crisp|few lines|one line|two lines|one sentence|tl;?dr|main point|key point|gist|nutshell|crux|core idea|sum it up|boil it down|in a line|compress|cut it down)/,
    expand: /(more detail|in detail|detailed|in depth|elaborate|expand|go deeper|tell me more|explain more|explain further|more about|what else|continue|go on|say more|add more|further)/,
    solve: /(solve|answer|work out|do|try|attempt|show (me )?(the )?(solution|answer|working))\b.{0,24}\b(this|that|it|the question|the problem|one)\b|^(solve|show solution|show the solution|show answer|reveal)/,
    nextstep: /(next step|what next|then what|and then|continue the (solution|steps)|go on with the steps|what('?s| is) the next)/,
    cycle: /(accounting cycle|steps of (the )?accounting|accounting process|from (a )?transaction to (the )?(final|trial)|journal.{0,12}ledger.{0,12}trial|cycle generator)/,
    lookup: /(where (can i|do i|is|are) (find|read|see|learn)|which chapter|in which (chapter|section)|open (the )?(chapter|notes|theory)|show me (the )?(theory|notes|chapter)|link to)/,
    finalOnly: /(just (tell|give) me the (final )?answer|only (the )?(final )?answer|final answer( only)?|answer only|just the answer|no steps|without (the )?steps|only result)/,
    stepsAll: /(show (me )?(all )?(the )?steps|step[- ]by[- ]step|full solution|complete solution|show (the )?(full )?working|all steps|each step|detailed (solution|steps))/,
    hintOnly: /^(give me )?(a )?hint\b|hint (please|only)|just a hint|give (me )?a clue/,
    txn: /\b(paid|purchased|bought|sold|received|introduced|withdrew|withdrawn|deposited|borrowed|invested|started (business|a business)|commenced|returned|settled|depreciation charged|wages paid|rent paid|salary paid|goods (sent|returned|taken))\b/
  };
  function hasAmounts(t) { return Solver.figures(Solver.norm(t)).some(f => !f.unit); }
  function hasAnyFigures(t) { return Solver.figures(Solver.norm(t)).length > 0; }

  // topic content tokens: the message minus intent/function words
  function contentTokens(text) {
    const toks = U_.tokenize(text);
    return toks.filter(t => !INTENT_WORDS.has(t) && !U_.STOP.has(t));
  }
  function expandTokens(tokens) {
    const W = Object.create(null); tokens.forEach(t => { W[t] = 1; });
    tokens.forEach(t => { (U_.SYNONYMS[t] || []).forEach(s => { const st = U_.stem(s); if (!U_.STOP.has(s) && !W[st]) W[st] = 0.45; }); });
    return W;
  }
  function idf(kb, t) { const df = kb.df[t] || 0; return Math.log(1 + (kb.N - df + 0.5) / (df + 0.5)); }
  const TOPIC_KINDS = new Set(["theory", "concept", "revision", "example", "formula", "mindmap"]);

  // Which part of the course is this about?  Title-level matching (not body keyword luck).
  function resolveTopic(kb, tokens, text) {
    const raw = tokens.slice();
    let chapterFromKw = Know.detectChapterByKeywords(text);
    if (!raw.length) return chapterFromKw ? { chapterId: chapterFromKw, label: kb.chapterNames[chapterFromKw] || chapterFromKw, tokens: [], explicit: true, chapterOnly: true } : null;
    const W = Object.create(null); raw.forEach(t => { W[t] = 1; });      // title matching uses the student's own words only
    let total = 0; Object.keys(W).forEach(t => { total += W[t] * idf(kb, t); });
    const votes = Object.create(null); let best = null, bestCov = 0;
    kb.docs.forEach(d => {
      if (!TOPIC_KINDS.has(d.kind) || !d.tTokens || !d.tTokens.size) return;
      let cov = 0; Object.keys(W).forEach(t => { if (d.tTokens.has(t)) cov += W[t] * idf(kb, t); });
      cov /= total; if (cov <= 0.12) return;
      // a title that is exactly the topic beats a long title that merely contains it
      const tight = cov * (1 / (0.6 + 0.4 * d.tTokens.size));
      votes[d.chapterId] = (votes[d.chapterId] || 0) + cov * cov;
      if (tight > bestCov && (d.kind === "theory" || d.kind === "concept")) { bestCov = tight; best = d; }
    });
    let chapterId = Object.keys(votes).sort((a, b) => votes[b] - votes[a])[0] || null;
    if (best && best.chapterId !== chapterId && votes[best.chapterId] >= votes[chapterId] * 0.8) chapterId = best.chapterId;
    if (chapterFromKw && (!chapterId || chapterFromKw !== chapterId) && votes[chapterFromKw]) chapterId = chapterFromKw;
    if (!chapterId && chapterFromKw) chapterId = chapterFromKw;
    const explicit = !!(best && bestCov >= 0.38) || !!chapterFromKw;
    // label: the student's own words, unless a block's title says exactly the same thing in nicer form
    const stems = new Set(raw);
    const words0 = String(text || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter(w => w && stems.has(U_.stem(w)) && !U_.STOP.has(w));
    let label = titleCase((words0.length ? words0 : raw).join(" "));
    if (best && best.chapterId === chapterId && best.tTokens.size <= raw.length + 1 && raw.every(t => best.tTokens.has(t) || (U_.SYNONYMS[t] || []).some(sy => best.tTokens.has(U_.stem(sy))))) label = titleCase(U_.topicTitle(best.title).replace(/\s*\([^)]*\)/g, ""));
    if (!chapterId && !explicit) return { chapterId: null, label: titleCase(raw.join(" ")), tokens: raw, explicit: false };
    return { chapterId, label, tokens: raw, explicit: true, bestDocId: best ? best.id : null };
  }

  function understand(kb, text, state, opts) {
    opts = opts || {}; state = cleanState(state);
    const raw = String(text || "").trim();
    const t = raw.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");
    const t2 = t.replace(/[?!.]+$/g, "").trim();
    const U = { raw, text: t2, act: "explain", style: {}, anaphoric: false, topic: null, target: "none", numeric: false, followUp: false, small: null, parts: null, hasQuestion: !!opts.question };

    // ----- style (how the student wants it) — explicit wording always beats the chat's previous mode -----
    U.style.simple = RE.simplify.test(t); U.style.short = RE.shorten.test(t); U.style.detailed = RE.expand.test(t) && /(detail|depth|thorough)/.test(t) || /\bdetailed\b|in detail/.test(t);
    U.style.final = RE.finalOnly.test(t); U.style.steps = RE.stepsAll.test(t); U.style.hint = RE.hintOnly.test(t.trim());
    U.style.numbers = /(with numbers|with figures|numerical|with (an )?amount)/.test(t);

    // ----- reply to a pending clarification question ("intra-state", "18%", "yes") -----
    if (state.clarification && raw.length <= 70 && !RE.define.test(t2) && !RE.why.test(t) && !SMALL.thanks.test(t2)) {
      const short = words(raw).length <= 8;
      if (short && (hasAnyFigures(raw) || /^(yes|no|yeah|nope|slm|wdv|intra|inter|igst|cgst|cash book|pass ?book|overdraft|favou?rable|inclusive|exclusive|taxable|not subject|subject)\b/.test(t2))) { U.act = "clarify"; U.followUp = true; return U; }
    }
    // ----- small talk (no retrieval at all) -----
    if (t2.length <= 60) {
      if (SMALL.greet.test(t2)) { U.act = "smalltalk"; U.small = "greet"; return U; }
      if (SMALL.thanks.test(t2)) { U.act = "smalltalk"; U.small = "thanks"; return U; }
      if (SMALL.bye.test(t2)) { U.act = "smalltalk"; U.small = "bye"; return U; }
      if (SMALL.howru.test(t2)) { U.act = "smalltalk"; U.small = "howru"; return U; }
      if (SMALL.ack.test(t2)) { U.act = "smalltalk"; U.small = "ack"; return U; }
      if (SMALL.abilities.test(t2)) { U.act = "smalltalk"; U.small = "abilities"; return U; }
    }
    if (CONFUSED.test(t) && words(t2).length <= 14) { U.act = "confused"; U.followUp = true; return U; }

    // ----- topic -----
    /* v83 — "Give me a Class 12 Accountancy question" (the welcome chip) is a
       practice request: the class label is site metadata, not a topic. Without
       this the fuzzy title match could map "class accountancy" to a chapter. */
    const tokens0 = contentTokens(raw);
    const metaPractice = RE.practice.test(t) && /\b(class|cbse)\s*(11|12|xi|xii)\b/.test(t);
    const metaStop = new Set(["class", "cbse", "11", "12", "xi", "xii", "accountancy"].map(w => U_.stem(w)));
    const tokens = metaPractice ? tokens0.filter(w => !metaStop.has(w)) : tokens0;
    U.anaphoric = ANAPHORA.test(t);
    const rt = resolveTopic(kb, tokens, t);
    const explicit = !!(rt && rt.explicit && (tokens.length || rt.chapterOnly));
    // Any NEW subject beats the old one: tokens we could not place in the course still count as a topic switch
    if (explicit) U.topic = rt; else if (tokens.length) U.topic = rt || { chapterId: null, label: titleCase(tokens.join(" ")), tokens, explicit: false };
    U.explicitTopic = explicit;

    // ----- act -----
    const ctxHas = !!(state.lastAnswer || state.numerical || opts.question);
    const isNum = hasAmounts(raw) && (Solver.looksNumerical(raw));
    // compare / what-if need the original wording
    if (RE.mistake.test(t)) U.act = "mistake";
    else if (RE.check.test(t) && (hasAnyFigures(raw) || /(option|answer|mcq)\b|^\(?[a-d]\)?[.)]?\s/.test(t2) || state.pendingPractice || opts.question)) U.act = "check";
    else if (RE.repeat.test(t) && ctxHas) U.act = "repeat";
    else if (RE.rephrase.test(t) && ctxHas) U.act = "rephrase";
    else if (RE.whatif.test(t2) && (state.numerical || hasAnyFigures(raw) || explicit)) U.act = "whatif";
    else if (RE.cycle.test(t)) U.act = "cycle";
    else if (RE.practice.test(t) && (!isNum || metaPractice)) U.act = "practice";
    else if (RE.nextstep.test(t) && (opts.question || state.numerical || state.lastAnswer)) U.act = "nextstep";
    else if (RE.compare.test(t) && !isNum) { U.act = "compare"; U.parts = splitCompare(raw, kb); }
    else if (RE.importance.test(t) && !isNum) U.act = "importance";
    else if (RE.why.test(t) && !isNum && !/^(why|how)\b.*\b(not|without)\b.{0,10}\d/.test(t)) U.act = "why";
    else if (RE.example.test(t) && !isNum) U.act = RE.another.test(t) && state.usedExamples.length ? "another" : (/another|one more|more examples?/.test(t) ? "another" : "example");
    else if (RE.solve.test(t) && (opts.question || state.pendingPractice || state.numerical) && !isNum) U.act = "solve";
    // "solve one using WDV" / "work out a problem on GST" with nothing attached: nothing to solve yet,
    // so demonstrate the method on a worked problem of the topic at hand (never a bare definition)
    else if (RE.solve.test(t) && !isNum && !opts.question && (explicit || ctxHas)) U.act = "example";
    else if (!explicit && U.style.final && ctxHas && !isNum && !RE.practice.test(t)) U.act = "shorten";
    else if (!explicit && U.style.steps && ctxHas && !isNum && !RE.practice.test(t)) U.act = "expand";
    else if (!explicit && RE.shorten.test(t) && ctxHas && !isNum) U.act = "shorten";
    else if (!explicit && RE.simplify.test(t) && ctxHas && !isNum) U.act = "simplify";
    else if (!explicit && RE.expand.test(t) && ctxHas && !isNum) U.act = "expand";
    else if (RE.format.test(t) && !isNum) U.act = "format";
    else if (RE.formula.test(t) && !isNum && (explicit || ctxHas)) U.act = "formula";
    else if (RE.features.test(t) && !isNum) U.act = "features";
    else if (RE.summarize.test(t) && !isNum) U.act = "summarize";
    else if (isNum) U.act = (RE.txn.test(t) && !/\b(find|calculate|compute|what|how much|determine|ascertain)\b/.test(t)) ? "transaction" : "numerical";
    else if (RE.define.test(t2) && !RE.explain.test(t)) U.act = (U.style.detailed ? "explain" : "define");
    else if (RE.how.test(t2)) U.act = "explain";
    else if (RE.explain.test(t)) U.act = "explain";
    else if (explicit && tokens.length <= 4) U.act = "define";
    else if (RE.lookup.test(t)) U.act = "lookup";
    else if (RE.solve.test(t)) U.act = "solve";
    else if (!explicit && !ctxHas && !hasAnyFigures(raw)) U.act = (UNRELATED_CUES.test(t) || !tokens.length) ? "unrelated" : "unknown";
    else U.act = ctxHas && !explicit ? "followup" : (hasAnyFigures(raw) ? "numerical" : "explain");

    // unrelated-topic guard: obvious non-accounting subjects, even if a word like "capital" appears
    if (!["smalltalk", "confused", "repeat", "rephrase", "check", "mistake", "clarify", "practice", "nextstep"].includes(U.act) && UNRELATED_CUES.test(t) && !opts.question) {
      const vocabHit = tokens.filter(tk => kb.docs.some(d => d.tTokens && d.tTokens.has(tk)) ).length;
      if (!rt || !rt.explicit || vocabHit / Math.max(1, tokens.length) <= 0.5) U.act = "unrelated";
    }
    U.followUp = ["simplify", "shorten", "expand", "example", "another", "why", "importance", "repeat", "rephrase", "followup", "nextstep", "solve", "format", "features", "formula", "whatif", "check", "practice"].includes(U.act) && !explicit;
    U.numeric = isNum;

    // ----- what does "this / that / it" point at? -----
    if (opts.question && !explicit && (U.anaphoric || !tokens.length || ["solve", "nextstep", "mistake", "check", "why", "explain", "simplify", "shorten", "expand", "example", "another"].includes(U.act))) U.target = "question";
    else if (!explicit && state.numerical && ["simplify", "shorten", "expand", "why", "whatif", "check", "solve", "nextstep", "importance", "repeat", "rephrase"].includes(U.act) && state.lastAnswer && state.lastAnswer.kind === "numerical") U.target = "numerical";
    else if (U.topic && (explicit || !state.topic)) U.target = "topic";
    else if (state.topic || state.lastAnswer) { U.target = state.lastAnswer && state.lastAnswer.kind === "numerical" ? "numerical" : "topic"; if (!U.topic || !U.topic.explicit) U.topic = state.topic ? Object.assign({}, state.topic, { explicit: false }) : U.topic; }
    if (U.target === "topic" && !U.topic && state.topic) U.topic = Object.assign({}, state.topic, { explicit: false });
    if (opts.question && !U.topic) U.topic = { chapterId: opts.question.chapterId || null, label: opts.question.chapterName || "", tokens: [], explicit: false };
    return U;
  }

  function splitCompare(raw, kb) {
    const m = /(?:difference(?:s)? (?:between|in|of)|differentiate (?:between)?|distinguish (?:between)?|compare)\s+(.+?)\s+(?:and|&|vs\.?|versus|with|from|or)\s+(.+?)[?.!]*$/i.exec(raw) || /(.+?)\s+(?:vs\.?|versus)\s+(.+?)[?.!]*$/i.exec(raw);
    if (!m) return null;
    const a = contentTokens(m[1]), b = contentTokens(m[2]);
    return a.length && b.length ? { a: { raw: m[1].trim(), tokens: a }, b: { raw: m[2].trim(), tokens: b } } : null;
  }

  /* =========================================================
     4. ROLE-AWARE RETRIEVAL  ("multi-query": one targeted look-up per kind of content)
     ========================================================= */
  const ROLE_FIT = {
    define:     { definition: 3.0, concept: 1.7, comparison: 1.5, purpose: 0.6, features: 0.55, rules: 0.5, format: 0.22, example: 0.3, other: 0.55, revision: 0.7, formula: 0.5, mindmap: 0.3, mistake: 0.2 },
    explain:    { definition: 2.6, concept: 1.5, comparison: 1.0, purpose: 1.4, features: 1.3, rules: 0.9, format: 0.5, example: 0.8, other: 0.7, revision: 0.8, formula: 0.6, mindmap: 0.4, mistake: 0.5 },
    importance: { purpose: 3.2, definition: 1.0, concept: 1.4, features: 0.9, comparison: 0.6, rules: 0.5, format: 0.2, other: 0.6, revision: 0.7, example: 0.3, formula: 0.3, mindmap: 0.3, mistake: 0.2 },
    features:   { features: 3.2, concept: 1.2, definition: 1.2, purpose: 1.0, comparison: 0.7, rules: 0.6, format: 0.3, other: 0.6, revision: 0.9, example: 0.3, formula: 0.3, mindmap: 0.6, mistake: 0.2 },
    format:     { format: 3.6, rules: 1.1, definition: 0.7, concept: 1.0, features: 0.6, purpose: 0.3, comparison: 0.3, other: 0.5, revision: 0.5, example: 0.5, formula: 0.5, mindmap: 0.2, mistake: 0.2 },
    rules:      { rules: 3.0, formula: 2.4, format: 1.0, definition: 1.0, concept: 1.3, features: 0.8, purpose: 0.5, comparison: 0.5, other: 0.7, revision: 0.9, example: 0.7, mindmap: 0.3, mistake: 0.5 },
    compare:    { comparison: 3.2, concept: 1.5, definition: 1.4, features: 1.0, purpose: 0.5, rules: 0.5, format: 0.3, other: 0.5, revision: 0.6, example: 0.3, formula: 0.3, mindmap: 0.3, mistake: 0.2 },
    revise:     { revision: 3.0, definition: 2.0, features: 1.6, purpose: 1.2, concept: 1.2, comparison: 0.8, rules: 0.9, format: 0.6, other: 0.6, example: 0.4, formula: 1.0, mindmap: 1.2, mistake: 0.8 },
    mistake:    { mistake: 3.0, rules: 1.2, definition: 0.8, concept: 1.0, features: 0.6, purpose: 0.5, comparison: 0.5, format: 0.4, other: 0.5, revision: 0.5, example: 0.3, formula: 0.5, mindmap: 0.2 }
  };
  const IS_WORD = /^(is|are|means|refers|called|known)$/;
  // the first sentence whose SUBJECT is the topic and which says "is/are/means" — the sentence that actually defines it
  function definingSentence(d, tokens) {
    if (!tokens.length || (d.kind !== "theory" && d.kind !== "concept")) return null;
    const ss = d._ss || (d._ss = sentences(d.parts && d.parts.p ? d.parts.p : d.text));
    for (const sn of ss) {
      const ws = sn.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/).filter(Boolean);
      const head = U_.tokenize(ws.slice(0, 9).join(" "));
      if (tokens.every(t => head.includes(t)) && ws.slice(0, 12).some(w => IS_WORD.test(w))) return sn;
    }
    return null;
  }
  function scoreDocs(kb, topic, roleKey, o) {
    o = o || {};
    const tokens = (topic && topic.tokens) || []; const W = expandTokens(tokens);
    let total = 0; Object.keys(W).forEach(t => { total += W[t] * idf(kb, t); });
    let totalTitle = 0; tokens.forEach(t => { totalTitle += idf(kb, t); });
    const fit = ROLE_FIT[roleKey] || ROLE_FIT.explain; const chapterId = topic && topic.chapterId;
    const res = [];
    kb.docs.forEach(d => {
      if (!TOPIC_KINDS.has(d.kind) && !(o.kinds && o.kinds.includes(d.kind))) return;
      let titleCov = 0, bodyCov = 0;
      if (total > 0) {
        Object.keys(W).forEach(t => { const w = W[t] * idf(kb, t); if (W[t] === 1 && d.tTokens && d.tTokens.has(t)) titleCov += idf(kb, t); if (d.tf[t]) bodyCov += w; });
        titleCov = totalTitle ? titleCov / totalTitle : 0;
        bodyCov = Math.min(1, totalTitle ? bodyCov / totalTitle : bodyCov / total);     // relative to the student's OWN words; synonyms only add a bonus
      }
      const chapterFactor = chapterId ? (d.chapterId === chapterId ? 1 : (titleCov >= 0.9 ? 0.55 : 0.18)) : 1;
      const level = roleKey === "explain" && o.depth === "detailed" ? 1 : (d.level === "advanced" ? (o.depth === "detailed" ? 1.0 : 0.55) : 1);
      const roleFit = fit[d.role] != null ? fit[d.role] : 0.6;
      // a concept card whose whole title IS the topic ("Depreciation", "Debit") is the definition, whatever its role label
      const conceptIsTopic = d.kind === "concept" && total > 0 && titleCov >= 0.85 && d.tTokens.size <= tokens.length + 1 ? (roleKey === "define" || roleKey === "explain" ? 1.8 : 1.1) : 1;
      let s = (3 * titleCov + bodyCov + (total > 0 ? 0.08 : 0.4)) * chapterFactor * roleFit * level * conceptIsTopic;
      const defSent = (roleKey === "define" || roleKey === "explain") && total > 0 && chapterFactor >= 0.55 ? definingSentence(d, tokens) : null;
      if (defSent) s *= 1.7;
      if (!total && chapterId && d.chapterId === chapterId) s = (0.4 + (d.level === "simple" ? 0.3 : 0)) * roleFit * (1 - Math.min(0.5, d.order / 60));
      if (o.avoid && o.avoid.has(d.id)) s *= 0.35;
      if (s > 0.05) res.push({ doc: d, score: s, titleCov, bodyCov, defSent });
    });
    res.sort((a, b) => b.score - a.score);
    return res;
  }
  function gather(kb, topic, roleKey, o) {
    const ranked = scoreDocs(kb, topic, roleKey, o);
    const first = (roles, minTitle) => (ranked.find(r => roles.includes(r.doc.role) && (!minTitle || r.titleCov >= minTitle)) || {}).doc || null;
    const G = { ranked };
    G.definition = first(["definition"], 0.3) || ranked.filter(r => r.doc.role === "concept" && r.titleCov >= 0.6).map(r => r.doc)[0] || first(["definition", "concept", "comparison"]) || (ranked[0] && ranked[0].doc) || null;
    G.top = ranked[0] ? ranked[0].doc : null;
    G.defSentence = (ranked.find(r => r.doc === G.definition) || {}).defSent || null;
    const relevant = r => r.titleCov >= 0.3 || r.bodyCov >= 0.55;      // must really be ABOUT the topic
    const rank = (roles, ex, n) => ranked.filter(r => roles.includes(r.doc.role) && r.doc !== ex && r.score > 0.15 && (relevant(r) || !((topic && topic.tokens) || []).length)).slice(0, n).map(r => r.doc);
    G.purpose = rank(["purpose"], G.definition, 2);
    G.features = rank(["features"], G.definition, 2);
    G.supporting = ranked.filter(r => ["concept", "purpose", "features", "rules", "other"].includes(r.doc.role) && r.doc !== G.definition && relevant(r) && r.score > 0.2).slice(0, 4).map(r => r.doc);
    G.format = ranked.filter(r => r.doc.role === "format").slice(0, 3).map(r => r.doc);
    G.rules = rank(["rules", "formula"], G.definition, 3);
    G.comparison = rank(["comparison"], null, 2);
    G.example = ranked.filter(r => r.doc.kind === "example").slice(0, 2).map(r => r.doc);
    G.mistake = rank(["mistake"], null, 2);
    G.revision = ranked.filter(r => r.doc.role === "revision").slice(0, 2).map(r => r.doc);
    return G;
  }
  function chapterFormulaDocs(kb, topic) {
    const tokens = (topic && topic.tokens) || [];
    const W = expandTokens(tokens);
    return kb.docs.filter(d => d.kind === "formula" && (!topic.chapterId || d.chapterId === topic.chapterId)).map(d => {
      let c = 0; Object.keys(W).forEach(t => { if (d.tTokens.has(t) || d.tf[t]) c += W[t]; }); return { d, c };
    }).filter(x => !tokens.length || x.c > 0).sort((a, b) => b.c - a.c).slice(0, 4).map(x => x.d);
  }
  function sourceFor(kb, d) {
    if (!d) return null; const ch = d.chapterName || kb.chapterNames[d.chapterId] || "";
    const sec = d.kind === "concept" ? "Key Concepts" : d.section;
    return { label: `Based on: ${ch ? ch + " → " : ""}${sec}`, route: d.chapterId ? "ch-" + d.chapterId : null };
  }
  function uniqSources(list) { const seen = new Set(), out = []; list.forEach(s => { if (s && !seen.has(s.label)) { seen.add(s.label); out.push(s); } }); return out.slice(0, 2); }

  /* =========================================================
     5. ANSWER COMPOSITION — concept answers
     ========================================================= */
  const LEAD_INS = ["", "Put simply, ", "In short, "];
  const ANALOGY_INS = ["In simple words: ", "Think of it this way: ", "A simple way to picture it: "];
  function analogyLine(p2, v) {
    if (!p2) return "";
    let s = firstSentences(p2, 2, 45);
    if (/^think of (it|them|this) as /i.test(s)) return pick(ANALOGY_INS, v) + s.replace(/^think of (it|them|this) as /i, "it is like ").replace(/^it is like a?n?\s*/i, m => m).replace(/^/, "");
    return pick(ANALOGY_INS, v) + decap(s);
  }
  function leadText(d, topic, n, maxWords) {
    if (!d) return "";
    const src = d.parts && d.parts.p ? d.parts.p : d.text;
    if (d.role === "comparison" || (d.kind === "concept" && /\bvs\.?\b/i.test(d.title))) return sentencesAbout(src, expandTokensList(topic), n || 2).join(" ");
    return firstSentences(src, n || 2, maxWords || 60);
  }
  function expandTokensList(topic) { return topic && topic.tokens ? topic.tokens : []; }

  function composeConcept(kb, topic, act, U, state, G, variant, depth) {
    const D = G.definition; const used = [];
    const parts = { definition: "", analogy: "", purpose: [], features: [], example: "", formula: "" };
    if (!D) return null;
    used.push(D);
    // an ALTERNATIVE meaning must really define the topic: its first sentence has the topic as its subject ("The Journal is where…")
    const subjectIs = (d) => { const first = sentences(d.parts && d.parts.p || d.text)[0] || ""; const ws = first.toLowerCase().split(/\s+/).slice(0, 8); const tk = (topic && topic.tokens) || []; const hasTopic = ws.some(w => tk.includes(U_.stem(w.replace(/[^a-z]/g, "")))); return hasTopic && ws.some(w => /^(is|are|means)$/.test(w)); };
    const alt = G.ranked.find(r => r.doc !== D && r.doc.kind === "concept" && r.bodyCov >= 0.5 && r.doc.role !== "format" && r.doc.role !== "comparison" && subjectIs(r.doc));
    let lead = leadText(D, topic, depth === "short" ? 1 : 2, 55);
    if (G.defSentence) {
      const ss = sentences(D.parts && D.parts.p ? D.parts.p : D.text); const i = ss.indexOf(G.defSentence);
      if (i > 0 && i <= 5 && depth !== "short") lead = ss.slice(0, i + 1).join(" ");          // the opening explainer builds up to the definition
      else if (i >= 0) lead = ss.slice(i, i + (depth === "short" ? 1 : 2)).join(" ");
    }
    let formulaInlined = false;
    if (/:\s*$/.test(lead) && D.parts && D.parts.formula) { lead = lead.replace(/:\s*$/, ":") + " " + strip(D.parts.formula).replace(/\s+$/, ""); formulaInlined = true; }
    parts.definition = lead; parts.analogy = D.parts && D.parts.p2 ? analogyLine(D.parts.p2, variant) : "";
    parts.formula = D.parts && D.parts.formula && !formulaInlined ? strip(D.parts.formula) : "";
    const lines = [];
    const v = variant % 3;
    // --- the meaning, worded slightly differently each time the same question is asked ---
    if (v === 1 && alt && depth !== "detailed") { lines.push(ensureStop(leadText(alt.doc, topic, 1, 45))); used.push(alt.doc); const rest = sentences(parts.definition).slice(1).join(" "); if (rest) lines.push(rest); }
    else if (v === 2 && parts.analogy && depth !== "detailed") { lines.push(ensureStop(parts.analogy.replace(/^(In simple words: |Think of it this way: |A simple way to picture it: )/, "").replace(/^./, c => c.toUpperCase()))); lines.push(LEAD_INS[2] + decap(mainPoint(parts.definition, 28))); parts.analogy = ""; }
    else lines.push(LEAD_INS[v] + (v ? decap(parts.definition) : parts.definition));
    if (parts.analogy && depth !== "short") lines.push(parts.analogy);
    // a one-line definition is thin: add what a second relevant block says about the same thing
    if (!parts.analogy && words(parts.definition).length < 30 && depth !== "short") {
      const have = new Set(U_.tokenize(lines.join(" ")));
      const cands = G.ranked.filter(r => r.doc !== D && !used.includes(r.doc) && ["theory", "concept"].includes(r.doc.kind) && ["definition", "other", "features", "concept", "comparison"].includes(r.doc.role) && (r.titleCov >= 0.3 || r.bodyCov >= 0.55)).slice(0, 5);
      for (const sup of cands) {
        // only a sentence that is ABOUT the topic: it starts with it ("Debtor: A person who owes…"), searched across the whole block incl. term lists
        const tk = topic.tokens || [];
        const about = sentences(sup.doc.text).filter(x => { const head = U_.tokenize(x.split(/\s+/).slice(0, 4).join(" ")); return tk.length && tk.every(t => head.includes(t)); }).slice(0, 2).join(" ");
        const sn = about || (sup.titleCov >= 0.3 ? sentencesAbout(sup.doc.parts && sup.doc.parts.p || sup.doc.text, tk, 2).join(" ") : "");
        const toks = U_.tokenize(sn); let inter = 0; toks.forEach(w => { if (have.has(w)) inter++; });
        if (sn && toks.length && inter / toks.length < 0.6) { lines.push(firstSentences(sn, 2, 48)); used.push(sup.doc); parts.supplement = firstSentences(sn, 2, 48); break; }
      }
    }
    if (parts.formula && depth !== "short") lines.push("**Formula:** " + parts.formula);
    // --- why it matters / key points (only when the question wants more than a definition) ---
    if (act === "explain" || depth === "detailed") {
      const detailed = depth === "detailed";
      const seenTok = [new Set(U_.tokenize(lines.join(" ")))];
      const novel = (txt) => { const a = new Set(U_.tokenize(txt)); if (!a.size) return false; return seenTok.every(b => { let inter = 0; a.forEach(w => { if (b.has(w)) inter++; }); return inter / a.size < 0.55; }) && (seenTok.push(a), true); };
      // (1) why it matters: a dedicated purpose block, otherwise the reasons written into the topic's own definitions
      const purposeDocs = G.purpose.slice(0, detailed ? 2 : 1);
      if (purposeDocs.length) purposeDocs.forEach(d => { used.push(d); const sn = firstSentences(d.parts && d.parts.p || d.text, detailed ? 2 : 1, 40); if (sn && novel(sn)) parts.purpose.push(sn); });
      else { const m = mineReasons(kb, G, topic); m.lines.filter(novel).slice(0, 2).forEach(l => parts.purpose.push(l)); m.docs.forEach(d => { if (!used.includes(d)) used.push(d); }); }
      if (parts.purpose.length) lines.push("**Why it matters:** " + parts.purpose.join(" "));
      // (2) features / main points
      const pts = [];
      G.features.slice(0, detailed ? 2 : 1).forEach(d => { if (used.includes(d)) return; used.push(d); const items = d.parts && d.parts.items; const numbered = items && items.length && /^\d+[.)]\s/.test(items[0]); if (items && items.length && !numbered && !/:\s*$/.test((d.parts && d.parts.p) || "")) items.slice(0, detailed ? 6 : 3).forEach(it => pts.push(strip(it))); else pts.push(`**${d.title}:** ${pointText(d, 1, 38)}`); });
      if (detailed) G.supporting.filter(d => !used.includes(d) && d.role !== "format" && novel(firstSentences(d.parts && d.parts.p || d.text, 1, 38))).slice(0, 3).forEach(d => { used.push(d); pts.push(`**${d.title.replace(/^Chapter \d+\s*[—-]\s*/, "")}:** ${pointText(d, 2, 50)}`); });
      // (3) the format, as a supporting point only
      const fmtRel = G.ranked.find(r => r.doc.role === "format" && r.titleCov >= 0.3);
      if (fmtRel && !detailed) { used.push(fmtRel.doc); pts.push(`**Format at a glance:** ${pointText(fmtRel.doc, 1, 40)} (ask me for the full format)`); }
      if (pts.length) lines.push("**Key points**\n" + bullets(pts.slice(0, detailed ? 8 : 4)));
      if (detailed) {
        const adv = G.ranked.filter(r => r.doc.level === "advanced" && r.doc.chapterId === topic.chapterId && !used.includes(r.doc) && r.doc.kind === "theory" && (r.titleCov >= 0.3 || r.bodyCov >= 0.55)).slice(0, 2);
        adv.forEach(r => { used.push(r.doc); lines.push(`**${r.doc.title}**\n${firstSentences(r.doc.parts && r.doc.parts.p || r.doc.text, 3, 80)}`); });
        if (fmtRel) { const i = used.indexOf(fmtRel.doc); if (i < 0) used.push(fmtRel.doc); lines.push(`**Format:** ${pointText(fmtRel.doc, 1, 50)}`); }
        const mk = G.mistake[0]; if (mk) { used.push(mk); lines.push(`**Common mistake:** ${pointText(mk, 1, 45)}`); }
      }
    }
    // a short card that never names its own subject ("Assumes the business will continue…") must still tell the
    // student WHICH concept this is — prefix the block's own title when the answer never mentions the topic
    const textJoined = lines.filter(Boolean).join("\n\n");
    const keyWords = U_.tokenize(String(topic.label || "") + " " + String(D.title || ""));
    const low = textJoined.toLowerCase();
    if (keyWords.length && !keyWords.some(w => w.length > 3 && low.includes(w))) {
      lines.unshift(`**${cap(String(D.title || topic.label).replace(/^Chapter \d+\s*[—-]\s*/, ""))}:**`);
    }
    return { text: lines.filter(Boolean).join("\n\n"), parts, used };
  }

  /* =========================================================
     6. EXAMPLES AND PRACTICE FROM THE SITE'S OWN QUESTION BANK
     ========================================================= */
  function questionSolutionMini(kb, q) {
    const lines = [];
    switch (q.kind) {
      case "journal": lines.push(Solver.journalMd((q.extra.entries || []).map(e => ({ account: String(e.particulars).replace(/\s+/g, " ").trim(), dr: e.dr != null ? e.dr : null, cr: e.cr != null ? e.cr : null })), q.extra.narration)); break;
      case "equation": lines.push(`**Answer:** ${inr(q.answer)}${q.explanation ? "\n\n" + strip(q.explanation) : ""}`); break;
      case "txn": lines.push(`**Answer:** ${strip(q.answer)}`); break;
      case "dc": lines.push((q.extra.accounts || []).map(a => `- **${a.name}** (${a.type}) — ${a.treatment}: ${a.reason}`).join("\n")); break;
      case "brs": lines.push(`**Answer:** ${strip(q.answer).split(". ")[0]}.`); break;
      default: if (q.correctText) lines.push(`**Answer:** ${strip(q.correctText)}${q.explanation ? "\n\n" + strip(q.explanation) : ""}`); else if (q.answer) lines.push(`**Answer:** ${strip(q.answer)}`);
    }
    return lines.join("\n\n");
  }
  function pickQuestion(kb, topic, state, kinds, usedKey, scope) {
    const tokens = (topic && topic.tokens) || []; const W = expandTokens(tokens);
    const used = new Set(state[usedKey] || []);
    let pool = kb.questions.filter(q => (!topic || !topic.chapterId || q.chapterId === topic.chapterId) && q.section !== "Quiz" && q.section !== "Important Questions" && (!kinds || kinds.includes(q.kind)) && (!q.chapterId || !scope || !scope.length || scope.indexOf(q.chapterId) !== -1));
    if (!pool.length) pool = kb.questions.filter(q => (!topic || !topic.chapterId || q.chapterId === topic.chapterId) && (!q.chapterId || !scope || !scope.length || scope.indexOf(q.chapterId) !== -1));
    pool = pool.filter(q => q.text.length < 420);
    const scored = pool.map(q => { let c = 0; const qt = new Set(U_.tokenize(q.text)); Object.keys(W).forEach(t => { if (qt.has(t)) c += W[t]; }); return { q, c: c + (used.has(q.id) ? -100 : 0) + (q.srcKey && /numericals$/.test(q.srcKey) ? 0.3 : 0) }; });
    scored.sort((a, b) => b.c - a.c);
    const top = scored.slice(0, 6).filter(s => s.c > -50);
    return top.length ? top[(state.turn || 0) % top.length].q : null;
  }
  const EXAMPLE_KINDS = { jr: ["journal", "dc"], dc: ["dc"], lg: ["journal", "posting"], eq: ["equation"], cb: ["txn"], sp2: ["txn"], brs: ["brs", "txn"], gst: ["gstbill"], tb: ["tbcheck"], intro: ["mcq"], terms: ["mcq"], tbase: ["mcq"], basis: ["mcq"], dep: ["mcq"], pres: ["mcq"], roe: ["mcq"], fs: ["mcq"], adj: ["mcq"] };
  // Worked numeric examples computed live by the solver (so the figures are always right)
  const CANNED = {
    dep: (t, i) => { const wdv = /wdv|written|diminishing|reducing/.test(t); const L = wdv
      ? ["A machine costing ₹1,00,000 is depreciated at 10% per annum under the written down value method for 3 years.", "A computer costing ₹40,000 is depreciated at 25% per annum under the written down value method for 2 years.", "Furniture costing ₹60,000 is depreciated at 20% per annum under the written down value method for 2 years."]
      : ["A machine costing ₹1,00,000 is depreciated at 10% per annum under the straight line method for 3 years.", "A machine costing ₹80,000 with residual value ₹8,000 is depreciated at 10% per annum under the straight line method. Find the annual depreciation.", "Furniture costing ₹50,000 is depreciated at 20% per annum under the straight line method for 2 years."]; return L[i % L.length]; },
    gst: (t, i) => ["Goods worth ₹50,000 are sold with a trade discount of 10% and GST at 18%. Find the invoice value.", "Goods worth ₹20,000 are sold to a customer in another state with GST at 12% (inter-state). Find the invoice value.", "Goods worth ₹10,000 are sold with GST at 5% and freight of ₹500 subject to GST. Find the invoice value."][i % 3],
    brs: (t, i) => ["Balance as per Cash Book is ₹25,000. A cheque of ₹5,000 issued has not been presented. Bank charges of ₹200 are not yet in the Cash Book. Find the balance as per Pass Book.", "Balance as per Pass Book is ₹40,000. Cheques issued ₹6,000 have not been presented. Interest credited by the bank ₹500 is not yet in the Cash Book. Find the balance as per Cash Book.", "Balance as per Cash Book is ₹30,000. A cheque of ₹8,000 deposited has not been collected. A direct credit by the bank of ₹2,000 is not yet in the Cash Book. Find the balance as per Pass Book."][i % 3],
    eq: (t, i) => ["Assets are ₹5,00,000 and liabilities are ₹1,50,000. Find the capital.", "Capital is ₹3,00,000 and liabilities are ₹80,000. Find the total assets.", "Assets ₹1,00,000, liabilities ₹30,000. The business purchased goods on credit for ₹10,000. Then paid creditors ₹4,000. Find the new capital position."][i % 3],
    tb: (t, i) => ["Trial balance: Cash ₹60,000 (Dr), Capital ₹50,000 (Cr), Purchases ₹30,000 (Dr), Sales ₹40,000 (Cr), Rent ₹5,000 (Dr), Creditors ₹5,000 (Cr). Does it agree?", "Trial balance: Cash ₹20,000 (Dr), Capital ₹30,000 (Cr), Purchases ₹25,000 (Dr), Sales ₹35,000 (Cr), Salary ₹8,000 (Dr), Creditors ₹5,000 (Cr). Does it agree?"][i % 2]
  };
  function exampleAnswer(kb, topic, U, state, another) {
    const ch = topic && topic.chapterId; const txt = (U.text || "") + " " + ((topic && topic.tokens) || []).join(" ");
    // 1) calculation chapters: a worked example computed live by the solver (figures are always right)
    if (CANNED[ch]) {
      const wdvTag = /wdv|written|diminishing|reducing/.test(txt) ? "wdv" : "std";
      const n = state.usedExamples.filter(x => x.indexOf("canned:" + ch + ":" + wdvTag) === 0).length;
      const src = CANNED[ch](txt, n);
      const r = Solver.solve(src);
      if (r && !r.needs) return { text: `**Example**\n\n${src}\n\n${Solver.render(r, "steps")}`, sources: [], kind: "numerical", numerical: r, exampleId: "canned:" + ch + ":" + wdvTag + ":" + n };
    }
    // 2) a worked example written into the chapter itself
    const W = expandTokens((topic && topic.tokens) || []);
    const ex = kb.docs.filter(d => d.kind === "example" && (!ch || d.chapterId === ch) && !state.usedExamples.includes("doc:" + d.id));
    if (ex.length) { const d = ex[(state.turn || 0) % ex.length]; return { text: `**Example — ${d.title}**\n\n${d.text}`, sources: [sourceFor(kb, d)], exampleId: "doc:" + d.id }; }
    // 3) a solved question from this chapter's practice material
    const q = pickQuestion(kb, topic, state, EXAMPLE_KINDS[ch], "usedExamples");
    if (q) {
      const sol = questionSolutionMini(kb, q);
      return { text: `**Example**${q.kind === "journal" ? " — pass the journal entry for:" : ""}\n\n${q.text}\n\n${sol}`, sources: [{ label: `Related topic: ${q.section}${q.chapterName ? " — " + q.chapterName : ""}`, route: q.chapterId ? "ch-" + q.chapterId : null }], exampleId: q.id };
    }
    if (CANNED[ch]) { const src = CANNED[ch](txt); const r = Solver.solve(src); if (r && !r.needs) return { text: `**Example**\n\n${src}\n\n${Solver.render(r, "steps")}`, sources: [], kind: "numerical", numerical: r, exampleId: "canned:" + ch }; }
    return null;
  }

  /* =========================================================
     7. QUESTION-FOCUSED ANSWERS (Ask AI / Mistake Book)
     ========================================================= */
  function questionSteps(kb, q) {
    const out = [];
    if (q.kind === "case" && q.extra && Array.isArray(q.extra.caseSteps) && q.extra.caseSteps.length) {
      q.extra.caseSteps.forEach((s, i) => out.push(`**Q${i + 1}.** ${s.q}` +
        (s.options && typeof s.answerIndex === "number" && s.answerIndex >= 0 && s.options[s.answerIndex] ? ` → ${String.fromCharCode(65 + s.answerIndex)}. ${strip(s.options[s.answerIndex])}` : "") +
        (s.explanation ? ` ${strip(s.explanation)}` : "")));
    } else if (q.kind === "brs" && q.raw && q.raw.items) {
      out.push(`Start from the balance as per **${q.raw.startingPoint}** = ${inr(Math.abs(q.raw.startingBalance))}${q.raw.startingBalance < 0 ? " (Overdraft)" : ""}.`);
      q.raw.items.forEach(i => out.push(`**${i.label}** → ${i.correctAnswer} ${inr(i.amount)}. ${strip(i.reasoning)}`));
      out.push(`**${q.raw.targetLabel} = ${inr(Math.abs(q.raw.finalBalance))}${q.raw.finalBalance < 0 ? " (Overdraft)" : ""}**`);
    } else if (q.steps && q.steps.length) q.steps.forEach(s => out.push(strip(s)));
    else if (q.kind === "journal" && q.extra.entries) { out.push("Identify the accounts involved and their type (asset, liability, income, expense…)."); out.push("Decide which account is debited and which is credited, using the rules of debit and credit."); out.push("Write the entry:\n\n" + questionSolutionMini(kb, q)); }
    else if (q.explanation) sentences(strip(q.explanation)).forEach(s => out.push(s));
    else if (q.correctText) out.push(`The correct answer is **${strip(q.correctText)}**.`);
    return out;
  }
  function whyQuestion(kb, q, U, state) {
    const lines = [];
    if (q.kind === "case" && q.extra && Array.isArray(q.extra.caseSteps) && q.extra.caseSteps.length) {
      // "why is B correct for question 2?" -> that step; otherwise the steps the
      // student's words actually mention; otherwise a short list of the first few.
      const steps = q.extra.caseSteps;
      const ask = U && U.text ? U.text : "";
      const n = /(?:q(?:uestion)?\s*#?\s*)(\d{1,2})\b/.exec(ask);
      let sel = [];
      if (n) { const i = parseInt(n[1], 10) - 1; if (steps[i]) sel = [steps[i]]; }
      if (!sel.length) { const W = new Set(U_.tokenize(ask)); sel = steps.filter(s => U_.tokenize(s.q).some(t => W.has(t))); }
      if (!sel.length) sel = steps.slice(0, 3);
      sel.forEach(s => lines.push(`**${strip(s.q)}** → ${s.options && typeof s.answerIndex === "number" && s.answerIndex >= 0 && s.options[s.answerIndex] ? String.fromCharCode(65 + s.answerIndex) + ". " + strip(s.options[s.answerIndex]) : ""}` +
        (s.explanation ? "\n" + strip(s.explanation) : "")));
    } else if (q.kind === "brs" && q.raw && q.raw.items) {
      const items = q.raw.items; const ask = U.text;
      // "why is THIS added" -> the item the student most plausibly means (word overlap), else all items
      const W = new Set(U_.tokenize(ask)); let sel = items.filter(i => U_.tokenize(i.label).some(t => W.has(t)));
      if (!sel.length) sel = items;
      sel.forEach(i => lines.push(`**${i.label}** is treated as **${i.correctAnswer}**. ${strip(i.reasoning)}`));
    } else if (q.explanation) lines.push(strip(q.explanation));
    else if (q.steps && q.steps.length) lines.push(q.steps.map(strip).join(" "));
    else if (q.correctText) lines.push(`The answer is **${strip(q.correctText)}**.`);
    if (!lines.length) return null;
    return lines.join("\n\n");
  }
  function numberFrom(s) { const m = /-?\d[\d,]*(?:\.\d+)?/.exec(String(s || "").replace(/₹/g, "")); return m ? parseFloat(m[0].replace(/,/g, "")) : null; }
  function mistakeAnswer(kb, q, U, state, studentAns) {
    const sa = studentAns || (q.extra && q.extra.studentAnswer) || state.attempt;
    const correct = q.correctText ? strip(q.correctText) : (q.answer != null ? strip(String(q.answer)) : "");
    const lines = [];
    if (!sa) return null;
    lines.push(`**Your answer:** ${strip(sa)}`);
    if (correct) lines.push(`**Correct answer:** ${correct}`);
    let diag = "";
    const sn = numberFrom(sa), cn = numberFrom(correct);
    if (q.kind === "brs" && q.raw && sn != null) {
      const c = q.raw; const sgn = x => x; const target = c.finalBalance;
      let base = c.startingBalance;
      const eff = c.items.map(i => ({ label: i.label, amt: i.amount, e: i.correctAnswer === "Add" ? 1 : -1 }));
      const total = (flip) => base + eff.reduce((a, it, idx) => a + it.amt * (flip === "all" ? -it.e : flip === idx ? -it.e : it.e), 0);
      if (Math.abs(total("all") - sn) < 0.5 || Math.abs(Math.abs(total("all")) - Math.abs(sn)) < 0.5 && sn !== 0) diag = "You treated every item the wrong way round (Add instead of Less and the reverse). Check which book you are starting from — starting from the other book reverses each Add/Less.";
      else { const idx = eff.findIndex((it, k) => Math.abs(total(k) - sn) < 0.5); if (idx >= 0) diag = `You treated **${eff[idx].label}** as ${eff[idx].e === 1 ? "Less" : "Add"}; it should be **${eff[idx].e === 1 ? "Add" : "Less"}**.`;
        else if (eff.length && Math.abs(Math.abs(base) - Math.abs(sn)) < 0.5) diag = "That is just the starting balance — the adjustments have not been applied."; }
    }
    if (!diag && sn != null && cn != null && sn !== cn) {
      const d = Math.abs(sn - cn); diag = `Your figure differs from the correct one by ${inr(d)}${sn > cn ? " (too high)" : " (too low)"}.`;
      const res = Solver.solve(q.text);
      if (res && !res.needs && res.answer && res.answer.value != null) { const dg = Solver.diagnoseNumber(res, sn); if (dg && dg.reason) diag = "It looks like " + dg.reason + "."; }
      else if (q.kind === "equation" && sn === Math.abs(cn)) diag = "Check the sign — the value is right in size but wrong in direction.";
    }
    if (!diag && q.options && q.options.length) {
      const opt = q.options.find(o => strip(o).toLowerCase() === strip(sa).toLowerCase() || (strip(sa).length > 12 && strip(o).toLowerCase().includes(strip(sa).toLowerCase().slice(0, 25))));
      diag = opt ? `The option you chose does not fit what the question asks — compare it carefully with the correct one.` : "";
    }
    if (diag) lines.push("**Where it went wrong:** " + diag);
    const why = q.kind === "brs" && q.raw ? q.raw.items.map(i => `- **${i.label}** → ${i.correctAnswer}: ${strip(i.reasoning)}`).join("\n") : (q.explanation ? strip(q.explanation) : (q.steps && q.steps.length ? q.steps.map(strip).join(" ") : ""));
    if (why) lines.push("**Why the correct answer is right**\n" + why);
    return lines.join("\n\n");
  }

  /* =========================================================
     8. SMALL TALK AND OTHER SHORT REPLIES
     ========================================================= */
  function smalltalk(kind, state, opts) {
    /* v83 — class-aware labels; the defaults reproduce the v82 strings byte for byte */
    const clsLabel = String((opts && opts.classLabel) || "Class 11 Accountancy");
    const clsShort = clsLabel.replace(/ Accountancy$/, "");
    const numExamples = clsLabel.indexOf("12") !== -1
      ? "goodwill valuation, revaluation of assets, partnership reconstitution, share capital and debentures, company financial statements, accounting ratios and cash flow"
      : "GST, depreciation, BRS, trial balance, ledger balancing, the accounting equation, provisions, interest and discounts";
    const n = state.turn || 0;
    switch (kind) {
      case "greet": return { text: pick(["Hi! 👋 I'm your Accountancy tutor. Ask me about any " + clsShort + " topic — a concept, a numerical, a journal entry — or paste a question and we'll work through it.", "Hello! Good to see you. What would you like to study today — a concept, a calculation, or a question you're stuck on?", "Hey there! Tell me a topic or paste a question, and I'll help you step by step."], n), quick: ["practice"] };
      case "howru": return { text: "I'm doing well, thank you! Ready when you are — which topic shall we look at?", quick: ["practice"] };
      case "thanks": return { text: pick(["You're welcome! Want to try a practice question on this, or move to another topic?", "Happy to help! Shall we try one for practice?", "Glad that helped. Ask me anything else whenever you like."], n), quick: ["practice"] };
      case "ack": return { text: pick(["Great. Want an example, a practice question, or shall we move on to something else?", "Good! Shall we try a question on it, or look at another topic?"], n), quick: ["practice", "another-example"] };
      case "bye": return { text: "Good luck with your studies! Come back whenever you're stuck. 👋", quick: [] };
      case "abilities": return { text: "Here's how I can help with " + clsLabel + ":\n\n- **Explain concepts** from your chapters — in short, in simple words, or in detail\n- **Solve numericals step by step** — " + numExamples + "\n- **Pass journal entries** and check them\n- **Answer questions** from the practice banks and detectives (use the **Ask Tutor** button on any question)\n- **Check your answer** or find your mistake\n- **Give practice questions**, examples and quick revision\n\nI work from this site's own chapters, so tell me a topic or paste a question to begin.", quick: ["practice"] };
    }
    return null;
  }

  /* =========================================================
     9. THE MAIN ENTRY: respond()
     ========================================================= */
  function sourceListFromDocs(kb, docs) { return uniqSources(docs.filter(Boolean).map(d => sourceFor(kb, d))); }
  function mkAnswer(o) { return Object.assign({ text: "", act: null, kind: "concept", topic: null, sources: [], quick: [], assumptions: [], confidence: "high", parts: null, numerical: null, used: [] }, o); }
  const CHAPTER_SUGGEST = { intro: "What is accounting?", terms: "What is a debtor?", tbase: "Explain the going concern concept", basis: "Explain accrual basis", eq: "What is the accounting equation?", dc: "Explain the golden rules of debit and credit", jr: "What is a journal?", lg: "What is a ledger?", cb: "What is a cash book?", sp2: "What is a purchases book?", brs: "What is a bank reconciliation statement?", gst: "What is GST?", tb: "What is a trial balance?", dep: "What is depreciation?", pres: "What is the difference between a provision and a reserve?", roe: "How do I rectify an error found after the trial balance?", fs: "How is gross profit calculated?", adj: "What are the two effects of closing stock?" };

  function respond(kb, text, state0, opts) {
    opts = opts || {};
    const state = cleanState(state0);
    const q = opts.question ? (opts.question.kind !== undefined && opts.question.raw !== undefined ? opts.question : Know.resolveWire(kb, opts.question)) : null;
    const U = understand(kb, text, state, { question: q });
    state.turn++;
    let ans = null;
    try { ans = route(kb, U, state, q, opts); } catch (e) { ans = null; if (opts.debug) throw e; }
    if (ans) finish(kb, U, state, ans, text, q);
    return ans ? { answer: ans, state, understanding: U } : { answer: null, state, understanding: U };
  }

  function modeFor(U, state, opts) {
    if (U.style.hint) return "hint"; if (U.style.final) return "final"; if (U.style.steps) return "steps";
    return (opts && opts.mode) || state.mode || "steps";
  }

  function route(kb, U, state, q, opts) {
    const act = U.act; const last = state.lastAnswer;
    const topic = U.topic || state.topic || null;
    const mode = modeFor(U, state, opts);

    switch (act) {
      case "smalltalk": { const a = smalltalk(U.small, state, opts); return mkAnswer(Object.assign(a, { act, kind: "chat", topic: state.topic })); }
      case "unrelated": return mkAnswer({ act, kind: "chat", text: "That one is outside what I can help with here — I'm your " + (opts.classLabel || "Class 11 Accountancy") + " tutor, and I only want to give you answers I can stand behind. If you'd like, ask me something from your syllabus, for example " + (/12/.test(opts.classLabel || "") ? "**“What is goodwill?”** or **“Explain share capital”**" : "**“What is a journal?”** or **“Explain depreciation”**") + ".", quick: ["practice"], confidence: "low" });
      case "unknown": return null;
      case "confused": return confusedAnswer(kb, U, state, q, opts);
      case "repeat": case "rephrase": return repeatAnswer(kb, U, state, q, opts, act);
      case "clarify": return clarifyAnswer(kb, U, state, q, opts);
      case "numerical": case "transaction": return numericalAnswer(kb, U, state, q, opts, mode);
      case "whatif": return whatIfAnswer(kb, U, state, q, opts, mode);
      case "cycle": return cycleAnswer(kb, U, state, opts);
      case "practice": return practiceAnswer(kb, U, state, q, opts && opts.chapterScope);
      case "check": case "mistake": return checkAnswer(kb, U, state, q, opts);
      case "lookup": return lookupAnswer(kb, U, state);
      case "why": { const aw = accountWhyAnswer(kb, U, state); if (aw) return aw; break; }
    }
    // ----- follow-ups about an attached question -----
    if (U.target === "question" && q) { const a = questionFollowUp(kb, U, state, q, opts, mode); if (a) return a; }
    // ----- follow-ups about the previously solved numerical -----
    if (U.target === "numerical" && state.numerical && last && last.kind === "numerical") { const a = numericalFollowUp(kb, U, state, opts, mode); if (a) return a; }
    // ----- solve a pending practice question -----
    if (act === "solve") {
      if (state.pendingPractice) { const pq = kb.questionById[state.pendingPractice.qid]; if (pq) { state.pendingPractice = null; return mkAnswer({ act, kind: "question", topic, text: Know._solveStored(kb, pq), sources: [{ label: `Related topic: ${pq.section}${pq.chapterName ? " — " + pq.chapterName : ""}`, route: pq.chapterId ? "ch-" + pq.chapterId : null }], quick: ["why", "practice"] }); } }
      if (state.numerical) { const a = numericalFollowUp(kb, Object.assign({}, U, { act: "expand" }), state, opts, "steps"); if (a) return a; }
      return mkAnswer({ act, kind: "chat", topic, text: "Which question would you like me to solve? Paste it here with its figures, or ask for a practice question first.", quick: ["practice"], confidence: "low" });
    }
    // ----- conceptual acts -----
    return conceptRoute(kb, U, state, q, opts, topic);
  }

  /* ----- concept-level answers ----- */
  function conceptRoute(kb, U, state, q, opts, topic) {
    const act = U.act; const last = state.lastAnswer;
    // Nothing to refer to yet ("explain that more simply" as the very first message): ask, never guess.
    if (!last && !state.topic && !(topic && (topic.chapterId || (topic.tokens || []).length)))
      return mkAnswer({ act, kind: "chat", text: "Happy to — what topic or question should I use? Ask me about a concept first and I'll build on it.", quick: ["practice"], confidence: "low" });
    // follow-ups transform / extend the PREVIOUS answer and never start a fresh unrelated search
    if (["simplify", "shorten", "expand", "example", "another", "why", "importance", "followup"].includes(act) && U.followUp) {
      if (!last && !topic) return mkAnswer({ act, kind: "chat", text: "Happy to — what topic or question should I use? Ask me about a concept first and I'll build on it.", quick: ["practice"], confidence: "low" });
    }
    const tkey = topic ? (topic.label || (topic.tokens || []).join(" ")) : "";
    // ----- transform previous answer -----
    if (act === "simplify" && last && U.followUp) return simplifyPrevious(kb, U, state, topic);
    if (act === "shorten" && last && U.followUp) return shortenPrevious(kb, U, state, topic);
    if (act === "expand" && last && U.followUp) return expandPrevious(kb, U, state, topic);
    if (act === "followup" && last) return expandPrevious(kb, U, state, topic);

    if (!topic || (!topic.chapterId && !(topic.tokens || []).length)) {
      if (state.topic) topic = state.topic; else return null;
    }
    const variantKey = act + ":" + tkey; const variant = (state.repeats[variantKey] || 0);
    state.repeats[variantKey] = variant + 1;
    const avoid = new Set(state.usedDocs || []);

    if (act === "example" || act === "another") {
      const ex = exampleAnswer(kb, topic, U, state, act === "another");
      if (ex) return mkAnswer({ act, kind: ex.kind || "example", topic, text: ex.text, sources: ex.sources || [], quick: ["another-example", "practice", "why"], numerical: ex.numerical || null, exampleId: ex.exampleId });
      return mkAnswer({ act, kind: "chat", topic, text: `I don't have a ready example for **${topic.label || "this topic"}** in this chapter. Give me your own figures or a transaction and I'll work it out step by step.`, quick: ["practice"], confidence: "low" });
    }
    if (act === "compare") return compareAnswer(kb, U, state, topic);
    if (act === "summarize") return summarizeAnswer(kb, U, state, topic);
    if (act === "formula") return formulaAnswer(kb, U, state, topic);

    const roleKey = { define: "define", explain: "explain", importance: "importance", why: "importance", features: "features", format: "format" }[act] || "explain";
    const depth = U.style.detailed ? "detailed" : (U.style.short || act === "define" ? (act === "define" ? "define" : "short") : "normal");
    const G = gather(kb, topic, roleKey, { depth: U.style.detailed ? "detailed" : "normal" });
    // A subject the course doesn't contain: say so rather than retrieve something loosely related
    if (!G.top || (!topic.explicit && (topic.tokens || []).length && G.ranked[0].titleCov < 0.3 && G.ranked[0].bodyCov < 0.5))
      return mkAnswer({ act, kind: "chat", topic: state.topic, text: `I couldn't find **${topic.label || "that"}** in your ${opts.classLabel || "Class 11 Accountancy"} chapters, and I'd rather not guess. Could you rephrase it, or tell me which chapter it is from? You can also ask about a topic such as ${/12/.test(opts.classLabel || "") ? "**goodwill** or **accounting ratios**" : "**depreciation** or **trial balance**"}, or paste a question.`, quick: ["practice"], confidence: "low" });

    if (act === "importance" || act === "why") {
      let docs = G.purpose.slice(0, 2); let bodies = [];
      if (docs.length) {
        docs.forEach(d => { const hasItems = d.parts && d.parts.items && d.parts.items.length; if (d.parts && d.parts.p) bodies.push(firstSentences(d.parts.p, 2, 60)); else if (!hasItems) bodies.push(firstSentences(d.text, 2, 60)); if (hasItems) d.parts.items.slice(0, 3).forEach(it => bodies.push("- " + strip(it))); });
      } else {
        const mined = mineReasons(kb, G, topic); docs = mined.docs; bodies = mined.lines.map(l => "- " + l);
      }
      if (!bodies.length) return mkAnswer(Object.assign(composeConceptFallback(kb, topic, G, U), { act }));
      const head = variant % 2 === 1 ? `**The reason for ${topic.label || "it"}**` : `**Why ${topic.label || "it"} matters**`;
      const textOut = head + "\n\n" + bodies.join("\n\n").replace(/\n\n- /g, "\n- ");
      return mkAnswer({ act, topic, text: textOut, parts: { purpose: bodies }, used: docs, sources: sourceListFromDocs(kb, docs), quick: ["explain-simply", "another-example", "practice"] });
    }
    if (act === "features") {
      const docs = G.features.length ? G.features : G.supporting.slice(0, 2);
      if (!docs.length) return mkAnswer(Object.assign(composeConceptFallback(kb, topic, G, U), { act }));
      const out = [];
      docs.forEach(d => { const items = d.parts && d.parts.items; out.push(`**${d.title}**\n` + (items && items.length ? bullets(items.slice(0, 7).map(strip)) : firstSentences(d.parts && d.parts.p || d.text, 3, 90))); });
      return mkAnswer({ act, topic, text: out.join("\n\n"), used: docs, sources: sourceListFromDocs(kb, docs), quick: ["explain-simply", "another-example", "practice"] });
    }
    if (act === "format") {
      const docs = G.format.length ? G.format : [G.top];
      const out = [];
      docs.slice(0, 2).forEach(d => {
        const items = d.parts && d.parts.items; const p = d.parts && d.parts.p ? d.parts.p : "";
        out.push(`**${d.title}**\n` + (p ? ensureStop(firstSentences(p, 2, 70)) + (items && items.length ? "\n" : "") : "") + (items && items.length ? bullets(items.slice(0, 7).map(strip)) : (!p ? firstSentences(d.text, 3, 90) : "")));
      });
      return mkAnswer({ act, topic, text: out.join("\n\n"), used: docs, sources: sourceListFromDocs(kb, docs), quick: ["example", "explain-simply", "practice"] });
    }
    // define / explain
    const c = composeConcept(kb, topic, act, U, state, G, variant, U.style.detailed ? "detailed" : (act === "define" || U.style.short ? (U.style.short && act === "explain" ? "short" : "define") : "normal"));
    if (!c) return null;
    let textOut = c.text;
    if (U.style.simple) { textOut = simplifiedFrom(c.parts, G, topic, 0) || plainify(textOut); }
    return mkAnswer({ act, topic, text: textOut, parts: c.parts, used: c.used, sources: sourceListFromDocs(kb, c.used), quick: act === "define" ? ["explain-simply", "example", "why"] : ["explain-simply", "example", "practice"] });
  }
  // When the chapter has no block titled "Importance/Need/Purpose of X", the reasons are still written into its
  // definitions and concept cards ("…before it is posted…", "…without…"). Pull out the sentences that give a reason.
  const REASON_CUE = /\b(because|so that|in order to|ensures?|helps?|allows?|enables?|makes? it (possible|easy)|without|before (anything|it|they|being|posting|any)|only after|proof|evidence|avoid|prevents?|important|necessary|essential|basis for|source of|tells? us)\b/i;
  function mineReasons(kb, G, topic) {
    const cands = [];
    G.ranked.filter(r => (r.titleCov >= 0.3 || r.bodyCov >= 0.55) && ["theory", "concept"].includes(r.doc.kind) && r.doc.role !== "format").slice(0, 8).forEach(r => {
      sentences(r.doc.parts && r.doc.parts.p ? r.doc.parts.p + " " + (r.doc.parts.p2 || "") : r.doc.text).forEach(sn => {
        const cues = (sn.match(new RegExp(REASON_CUE.source, "gi")) || []).length; if (!cues || words(sn).length < 6 || words(sn).length > 45) return;
        cands.push({ sn, doc: r.doc, score: cues * 2 + (r.doc.role === "definition" || r.doc.role === "concept" ? 1 : 0) + r.titleCov * 2 + r.bodyCov });
      });
    });
    cands.sort((a, b) => b.score - a.score);
    const picked = [], docs = [], seen = [];
    cands.forEach(c => { if (picked.length >= 3) return; const t = new Set(U_.tokenize(c.sn)); if (seen.some(o => { let i = 0; t.forEach(w => { if (o.has(w)) i++; }); return i / (t.size || 1) > 0.62; })) return; seen.push(t); picked.push(ensureStop(c.sn)); if (!docs.includes(c.doc)) docs.push(c.doc); });
    return { lines: picked, docs };
  }
  // one readable line for a block; a lead-in that ends with ":" gets its list items appended ("…Subsidiary Books: Cash Book, Purchases Book…")
  function pointText(d, n, maxWords) {
    const p = firstSentences(d.parts && d.parts.p || d.text, n, maxWords);
    const items = d.parts && d.parts.items;
    if (/:\s*$/.test(p) && items && items.length) return p.replace(/:\s*$/, ": ") + items.slice(0, 6).map(it => strip(it).replace(/^\d+[.)]\s*/, "").split(/:\s/)[0]).join(", ") + ".";
    return ensureStop(p);
  }
  function composeConceptFallback(kb, topic, G, U) {
    const d = G.definition || G.top; if (!d) return { text: "" };
    return { text: `**${d.title}**\n\n${firstSentences(d.parts && d.parts.p || d.text, 3, 90)}`, used: [d], sources: sourceListFromDocs(kb, [d]), topic, quick: ["explain-simply", "practice"] };
  }

  // -- "explain that more simply": same meaning, easier words, SHORTER (never a fresh search) --
  function analogyClause(an) {
    let t = String(an || "").replace(/^(In simple words: |Think of it this way: |A simple way to picture it: )/, "").trim();
    const first = sentences(t)[0] || t;
    let c = words(first).length > 26 ? first.split(/\s+—\s+/)[0] : first;
    c = plainify(c).replace(/[,:;—-]+$/, "");
    c = c.replace(/^it is like\s+/i, "it is like ");
    return ensureStop(c);
  }
  function simplifiedFrom(parts, G, topic, maxWordsTotal) {
    if (!parts || !parts.definition) return null;
    const first = sentences(strip(parts.definition))[0] || parts.definition;
    const main = sentences(plainify(first)).slice(0, 2).join(" ");
    const an = parts.analogy ? analogyClause(parts.analogy) : "";
    const lines = ["**In simple words**", main];
    if (an) lines.push(/^it is like/i.test(an) ? an.replace(/^it is like\s+/i, "Think of it as ") : "Think of it like this: " + decap(an));
    let out = lines.join("\n\n");
    if (maxWordsTotal && words(out).length >= maxWordsTotal && an) out = lines.slice(0, 2).join("\n\n");
    return out;
  }
  function simplifyPrevious(kb, U, state, topic) {
    const last = state.lastAnswer; const n = (state.repeats["simplify:" + (last.act || "")] = (state.repeats["simplify:" + (last.act || "")] || 0) + 1);
    // numerical answer -> plain narration
    if (last.kind === "numerical" && state.numerical) { const r = rerun(state); if (r) return mkAnswer({ act: "simplify", kind: "numerical", topic: last.topic || topic, text: "**In simple words**\n\n" + Solver.renderPlain(r), numerical: r, quick: ["example", "practice", "why"], sources: [] }); }
    // question-style answer -> simplify its explanation
    if (last.kind === "question" && last.parts && last.parts.explanation) {
      const plain = plainify(last.parts.explanation);
      return mkAnswer({ act: "simplify", kind: "question", topic: last.topic || topic, text: "**In simple words**\n\n" + sentences(plain).slice(0, 4).map((s, i) => (i === 0 ? s : "- " + s)).join("\n").replace(/\n- /, "\n\n- "), quick: ["another-example", "practice"], sources: last.sources || [], parts: last.parts });
    }
    const parts = last.parts;
    if (parts && parts.definition) {
      const rest = [];
      let body = simplifiedFrom(parts, null, topic, Math.max(20, words(last.text).length - 6));
      // second time asked: even shorter, one idea only
      if (n >= 2) body = `**In one line**\n\n${plainify(mainPoint(parts.definition, 18))}`;
      // never longer than what we are simplifying
      if (words(body).length >= words(last.text).length) body = `**In simple words**\n\n${plainify(mainPoint(parts.definition, 20))}`;
      return mkAnswer({ act: "simplify", topic: last.topic || topic, text: body, parts, used: last.used || [], quick: ["example", "why", "practice"], sources: last.sources || [] });
    }
    // generic: plain-language version of the previous text, trimmed
    const plain = plainify(strip(last.text).replace(/\*\*/g, ""));
    return mkAnswer({ act: "simplify", topic: last.topic || topic, text: "**In simple words**\n\n" + sentences(plain).slice(0, 3).join(" "), quick: ["example", "practice"], sources: last.sources || [] });
  }
  function shortenPrevious(kb, U, state, topic) {
    const last = state.lastAnswer;
    if (last.kind === "numerical" && state.numerical) { const r = rerun(state); if (r) return mkAnswer({ act: "shorten", kind: "numerical", topic: last.topic || topic, text: Solver.render(r, "final"), numerical: r, quick: ["why", "practice"] }); }
    const base = last.parts && last.parts.definition ? last.parts.definition : strip(last.text).replace(/\*\*/g, "");
    return mkAnswer({ act: "shorten", topic: last.topic || topic, text: `**Main point:** ${mainPoint(base, 22)}`, parts: last.parts, used: last.used || [], quick: ["explain-simply", "example"], sources: last.sources || [] });
  }
  function expandPrevious(kb, U, state, topic) {
    const last = state.lastAnswer; topic = last.topic || topic;
    if (last.kind === "numerical" && state.numerical) { const r = rerun(state); if (r) return mkAnswer({ act: "expand", kind: "numerical", topic, text: Solver.render(r, "steps"), numerical: r, quick: ["example", "why", "practice"] }); }
    if (!topic) return null;
    const used = new Set((state.usedDocs || []).concat((last.used || []).map(d => d.id)));
    const G = gather(kb, topic, "explain", { depth: "detailed" });
    const fresh = G.ranked.filter(r => !used.has(r.doc.id) && r.doc.chapterId === topic.chapterId && ["theory", "concept"].includes(r.doc.kind) && r.bodyCov > 0.15 && r.doc.role !== "format").slice(0, 3);
    if (fresh.length) {
      const out = fresh.map(r => `**${U_.topicTitle(r.doc.title)}**\n${firstSentences(r.doc.parts && r.doc.parts.p || r.doc.text, 3, 80)}`);
      return mkAnswer({ act: "expand", topic, text: "Here is more detail:\n\n" + out.join("\n\n"), used: fresh.map(r => r.doc), sources: sourceListFromDocs(kb, fresh.map(r => r.doc)), quick: ["explain-simply", "example", "practice"] });
    }
    const ex = exampleAnswer(kb, topic, U, state, false);
    if (ex) return mkAnswer({ act: "expand", topic, kind: ex.kind || "example", text: "That covers the main ideas. Here is an example to make it concrete:\n\n" + ex.text, sources: ex.sources || [], numerical: ex.numerical || null, quick: ["practice", "why"] });
    return mkAnswer({ act: "expand", topic, kind: "chat", text: "That covers everything I have on this topic in your chapter. Would you like an example or a practice question?", quick: ["example", "practice"], confidence: "medium" });
  }

  function confusedAnswer(kb, U, state, q, opts) {
    const last = state.lastAnswer; state.confusion = (state.confusion || 0) + 1; const c = state.confusion;
    if (!last && !q) return mkAnswer({ act: "confused", kind: "chat", text: "No problem — we'll go slowly. Which topic or question is giving you trouble? Tell me the topic (for example “journal” or “depreciation”) and I'll explain it from the very start.", quick: ["practice"], confidence: "low" });
    if (c === 1) { const a = last ? (last.kind === "numerical" || (last.parts && last.parts.definition) ? simplifyPrevious(kb, U, state, state.topic) : null) : null; if (a) { a.text = "No worries — let me say it more simply.\n\n" + a.text + "\n\nWhich part is still unclear? I can give an example or go step by step."; a.act = "confused"; a.quick = ["example", "why", "practice"]; return a; } }
    if (c === 2 && state.topic) { const ex = exampleAnswer(kb, state.topic, Object.assign({}, U, { style: { numbers: true } }), state, true); if (ex) return mkAnswer({ act: "confused", kind: ex.kind || "example", topic: state.topic, text: "Let's try it with a real example instead.\n\n" + ex.text + "\n\nTell me which step feels unclear and I'll go through it slowly.", sources: ex.sources || [], numerical: ex.numerical || null, quick: ["explain-simply", "practice"] }); }
    if (q) { const steps = questionSteps(kb, q); if (steps.length) return mkAnswer({ act: "confused", kind: "question", topic: state.topic, text: "Let's take it one small step at a time.\n\n" + steps.slice(0, 2).map((s, i) => `**Step ${i + 1}.** ${s}`).join("\n\n") + "\n\nSay “next step” when you're ready for the next one.", quick: ["why", "explain-simply"] }); }
    return mkAnswer({ act: "confused", kind: "chat", topic: state.topic, text: "Let's slow right down. Which of these would help most?\n\n- The **meaning** in one simple line\n- A **small example**\n- **Why** it works this way\n\nTell me, or point at the exact word or step that feels unclear.", quick: ["explain-simply", "example", "why"], confidence: "medium" });
  }
  function repeatAnswer(kb, U, state, q, opts, act) {
    const last = state.lastAnswer; if (!last) return null;
    if (act === "rephrase" && last.act && last.topic && last.kind === "concept") {
      const key = (last.act === "define" || last.act === "explain" ? last.act : "define") + ":" + (last.topic.label || (last.topic.tokens || []).join(" "));
      const G = gather(kb, last.topic, last.act === "explain" ? "explain" : "define", {});
      const depth = last.act === "explain" ? "normal" : "define"; const variant = (state.repeats[key] = (state.repeats[key] || 0) + 1);
      const c = composeConcept(kb, last.topic, last.act === "explain" ? "explain" : "define", U, state, G, variant, depth);
      if (c) return mkAnswer({ act, topic: last.topic, text: c.text, parts: c.parts, used: c.used, sources: sourceListFromDocs(kb, c.used), quick: ["explain-simply", "example", "practice"] });
    }
    return mkAnswer({ act, kind: last.kind, topic: last.topic, text: last.text, parts: last.parts, numerical: null, sources: last.sources || [], quick: ["explain-simply", "example"] });
  }

  /* ----- numerical routing (calculation first) ----- */
  function rerun(state) {
    const n = state.numerical; if (!n || !n.sourceText) return null;
    const r = Solver.solve(n.sourceText, n.domain ? { domain: n.domain } : {}); return r && !r.needs ? r : null;
  }
  function similarStored(kb, text) {
    try { const f = Know._findQuestion(kb, text); return f && f.similarity >= 0.55 ? f : null; } catch (e) { return null; }
  }
  function numericalAnswer(kb, U, state, q, opts, mode) {
    let text = U.raw;
    if (U.act === "transaction") {
      // GST-bearing transactions get their journal entry; plain transactions are left to the journal engine
      if (/gst/i.test(text) && !/journal|pass/i.test(text)) text += " Pass the journal entry.";
    }
    const r = Solver.solve(text, {});
    if (!r) {
      if (U.act === "transaction") return null;      // plain transaction -> the journal engine (Accounting Cycle logic) handles it
      return null;
    }
    if (r.needs) {
      state.clarification = { domain: r.domain || null, ask: r.needs, originalText: text };
      return mkAnswer({ act: U.act, kind: "chat", topic: topicForDomain(kb, r.domain) || state.topic, text: r.needs, quick: [], confidence: "low" });
    }
    state.clarification = null;
    return finishNumerical(kb, U, state, r, text, mode);
  }
  function topicForDomain(kb, d) { const map = { gst: "gst", depreciation: "dep", brs: "brs", "trial-balance": "tb", equation: "eq", ledger: "lg", provision: "pres", adjustment: "adj", interest: "basis", discount: "terms", arithmetic: null }; const ch = map[d]; const L = { gst: "GST", dep: "Depreciation", brs: "Bank Reconciliation", tb: "Trial Balance", eq: "Accounting Equation", lg: "Ledger", basis: "Interest", terms: "Discounts", pres: "Provisions and Reserves", adj: "Adjustments in Final Accounts" }; return ch ? { chapterId: ch, label: L[ch] || kb.chapterNames[ch] || ch, tokens: [], explicit: false } : null; }
  function finishNumerical(kb, U, state, r, text, mode) {
    const sim = similarStored(kb, text);
    let body = Solver.render(r, mode);
    const topic = topicForDomain(kb, r.domain) || state.topic;
    const srcs = [];
    if (sim && sim.question) srcs.push({ label: `Related topic: ${sim.question.section}${sim.question.chapterName ? " — " + sim.question.chapterName : ""}`, route: sim.question.chapterId ? "ch-" + sim.question.chapterId : null });
    if (!r.ok) body += "\n\nI'm not fully certain of one of the checks on this working — please verify the figures against your textbook.";
    const a = mkAnswer({ act: U.act, kind: "numerical", topic, text: body, sources: srcs, numerical: r, assumptions: r.assumptions, quick: mode === "hint" ? ["show-solution", "explain-simply"] : ["explain-simply", "why", "practice"], confidence: r.ok ? "high" : "medium" });
    if (mode === "hint") a.quick = ["show-solution"];
    return a;
  }
  function clarifyAnswer(kb, U, state, q, opts) {
    const c = state.clarification; if (!c) return null;
    const merged = c.originalText + ". " + U.raw;
    const r = Solver.solve(merged, c.domain ? { domain: c.domain } : {});
    if (!r || r.needs) { state.clarification = r && r.needs ? { domain: r.domain || c.domain, ask: r.needs, originalText: merged } : null; return r && r.needs ? mkAnswer({ act: "clarify", kind: "chat", topic: state.topic, text: r.needs, confidence: "low" }) : null; }
    state.clarification = null; return finishNumerical(kb, U, state, r, merged, modeFor(U, state, opts));
  }
  function whatIfAnswer(kb, U, state, q, opts, mode) {
    let prev = null;
    if (state.numerical && state.numerical.sourceText) prev = Solver.solve(state.numerical.sourceText, state.numerical.domain ? { domain: state.numerical.domain } : {});
    if (prev && !prev.needs) {
      const r = Solver.whatIf(prev, U.raw);
      if (r && !r.needs) { r.assumptions = (r.assumptions || []).concat([]); const a = finishNumerical(kb, U, state, r, r.sourceText || U.raw, mode); a.text = `Changing that, here is the new working:\n\n` + a.text; return a; }
    }
    // no numbers to change: treat it as a concept question about the thing mentioned
    if (U.topic && U.topic.tokens && U.topic.tokens.length) { const topic = U.topic; const G = gather(kb, topic, "explain", {}); const c = G.top && composeConcept(kb, topic, "explain", U, state, G, 0, "normal"); if (c) return mkAnswer({ act: "whatif", topic, text: c.text + (state.topic && state.topic.chapterId === topic.chapterId ? "\n\nGive me figures (cost, rate, years) and I'll show it with numbers." : ""), parts: c.parts, used: c.used, sources: sourceListFromDocs(kb, c.used), quick: ["example", "practice"] }); }
    return mkAnswer({ act: "whatif", kind: "chat", topic: state.topic, text: "Tell me what should change (for example the rate, the method, or the amount) and I'll redo it with the new figures.", quick: [], confidence: "low" });
  }
  function numericalFollowUp(kb, U, state, opts, mode) {
    const r = rerun(state); if (!r) return null; const topic = state.topic;
    switch (U.act) {
      case "simplify": return mkAnswer({ act: "simplify", kind: "numerical", topic, text: "**In simple words**\n\n" + Solver.renderPlain(r), numerical: r, quick: ["example", "practice"] });
      case "shorten": return mkAnswer({ act: "shorten", kind: "numerical", topic, text: Solver.render(r, "final"), numerical: r, quick: ["why", "practice"] });
      case "expand": case "solve": case "nextstep": return mkAnswer({ act: U.act, kind: "numerical", topic, text: Solver.render(r, "steps"), numerical: r, quick: ["explain-simply", "why", "practice"] });
      case "why": case "importance": {
        const why = domainWhy(r);
        return mkAnswer({ act: U.act, kind: "numerical", topic, text: "**Why we do it this way**\n\n" + why, numerical: r, sources: [], quick: ["explain-simply", "example", "practice"] });
      }
      case "example": case "another": return null;
    }
    return null;
  }
  function domainWhy(r) {
    switch (r.domain) {
      case "gst": return "- A **trade discount** is given on the list price before the sale, so the customer never actually pays that part — GST is therefore charged only on the reduced amount (the taxable value).\n- GST is charged **on top of** the taxable value, so the buyer pays taxable value + GST.\n- Within one state the tax is shared equally: half goes to the Centre (**CGST**) and half to the State (**SGST**). Between states it is a single **IGST**.";
      case "depreciation": return "- An asset wears out over its useful life, so its cost is spread over those years instead of being charged all in the year of purchase (the **matching** idea).\n- **SLM** charges the same amount every year; **WDV** charges a fixed % on the *reducing* book value, so the charge is higher in early years when the asset is most productive.\n- Depreciation is a non-cash expense: it reduces profit and the asset's book value, but no cash leaves the business.";
      case "brs": return "- The Cash Book and the Pass Book record the same bank account from two sides, so differences arise only from **timing** (cheques not yet presented or collected) or entries one side has not recorded yet (charges, direct credits, errors).\n- Each item is Added or Deducted so that the balance moves from one book's figure to the other's.";
      case "trial-balance": return "- Every transaction has equal debit and credit effects (**double entry**), so if all accounts are listed on their normal side, total debits must equal total credits.\n- If they differ, an error exists that affects one side only.";
      case "equation": return "- Everything the business owns (assets) is funded either by outsiders (liabilities) or by the owner (capital), so **Assets = Liabilities + Capital** always holds.";
      case "provision": return "- A **provision** is made now because some debtors may not pay later (**prudence**): the expected loss is charged to this year's profit.\n- Bad debts are written off first, so the provision is calculated only on the debts that remain.";
      case "adjustment": return "- Under the **accrual** basis, income and expenses belong to the period they relate to, not the period in which cash moves — so amounts due or paid in advance must be adjusted at the year end.";
      case "discount": return "- A discount changes what is actually paid or received, so the difference must be recorded: **discount allowed** (an expense for us) or **discount received** (a gain).";
      case "interest": return "- Interest is the charge for using money over time: Amount × Rate × Time. Interest on capital rewards the owner; interest on drawings charges the owner for money taken out early.";
      case "ledger": return "- Balancing shows the net position of the account: the difference between the two sides is carried down so the account can continue in the next period.";
      default: return "Each step follows directly from the rule for this type of problem — the working above shows which rule was used in each line.";
    }
  }

  /* ----- attached-question follow-ups ----- */
  function questionFollowUp(kb, U, state, q, opts, mode) {
    const act = U.act; const topic = state.topic || { chapterId: q.chapterId, label: q.chapterName || "", tokens: [] };
    const srcs = [{ label: `Related topic: ${q.section}${q.chapterName ? " — " + q.chapterName : ""}`, route: q.chapterId ? "ch-" + q.chapterId : null }];
    const base = (o) => mkAnswer(Object.assign({ kind: "question", topic, sources: srcs, quick: ["explain-simply", "why", "practice"] }, o));
    if (act === "solve" || (act === "explain" && U.style.steps)) {
      // numeric questions are re-solved by code; stored structure is used for the rest
      const full = Know._solveStored(kb, q, { hint: mode === "hint" });
      if (mode === "hint") { const hint = (q.extra && q.extra.hint) || "Look at what the question gives you, decide which rule applies, then work one step at a time."; return base({ act, text: `💡 **Hint:** ${hint}\n\nTry it yourself first — say **“show solution”** when you want the full working.`, quick: ["show-solution"], parts: { explanation: q.explanation || "" } }); }
      return base({ act, text: full, parts: { explanation: q.explanation || (q.raw && q.raw.items ? q.raw.items.map(i => strip(i.reasoning)).join(" ") : "") } });
    }
    if (act === "explain" || act === "define") {
      const lines = [`This is a **${q.section}** question${q.chapterName ? " from **" + q.chapterName + "**" : ""}.`];
      const G = gather(kb, { chapterId: q.chapterId, tokens: contentTokens(q.text).slice(0, 8) }, "rules", {});
      const rule = G.rules[0] || G.definition; if (rule) lines.push(`**The idea behind it:** ${ensureStop(firstSentences(rule.parts && rule.parts.p || rule.text, 2, 60))}`);
      const why = whyQuestion(kb, q, U, state); if (why) lines.push("**How the answer comes about**\n" + why); else if (q.correctText) lines.push(`**Answer:** ${strip(q.correctText)}`);
      return base({ act, text: lines.join("\n\n"), parts: { explanation: why || "" }, sources: srcs.concat(rule ? [sourceFor(kb, rule)] : []).slice(0, 2) });
    }
    if (act === "why" || act === "importance") { const why = whyQuestion(kb, q, U, state); if (why) return base({ act, text: why, parts: { explanation: why } }); return null; }
    if (act === "simplify") {
      const why = (state.lastAnswer && state.lastAnswer.parts && state.lastAnswer.parts.explanation) || whyQuestion(kb, q, U, state) || "";
      if (why) { const plain = sentences(plainify(why)).slice(0, 4).map(s => "- " + s).join("\n"); return base({ act, text: "**In simple words**\n\n" + plain + (q.correctText ? `\n\nSo the answer is **${strip(q.correctText)}**.` : q.kind === "brs" && q.raw ? `\n\nSo the answer is **${q.raw.targetLabel} = ${inr(Math.abs(q.raw.finalBalance))}${q.raw.finalBalance < 0 ? " (Overdraft)" : ""}**.` : ""), parts: { explanation: why } }); }
      return null;
    }
    if (act === "shorten") { const ans = q.correctText ? strip(q.correctText) : (q.kind === "brs" && q.raw ? `${q.raw.targetLabel} = ${inr(Math.abs(q.raw.finalBalance))}${q.raw.finalBalance < 0 ? " (Overdraft)" : ""}` : (q.answer != null ? strip(String(q.answer)) : "")); const why = whyQuestion(kb, q, U, state); return base({ act, text: `**Answer:** ${ans}` + (why ? "\n\n" + mainPoint(why, 30) : "") }); }
    if (act === "expand" || act === "followup") { const why = whyQuestion(kb, q, U, state); const G = gather(kb, { chapterId: q.chapterId, tokens: contentTokens(q.text).slice(0, 8) }, "explain", {}); const extra = G.definition ? "\n\n**Related idea:** " + ensureStop(firstSentences(G.definition.parts && G.definition.parts.p || G.definition.text, 2, 60)) : ""; return base({ act, text: (why || "") + extra, sources: srcs.concat(G.definition ? [sourceFor(kb, G.definition)] : []).slice(0, 2) }); }
    if (act === "nextstep") {
      const steps = questionSteps(kb, q); if (!steps.length) return null;
      const i = Math.min(state.stepIdx || 0, steps.length - 1); state.stepIdx = (state.stepIdx || 0) + 1;
      const done = i >= steps.length - 1;
      return base({ act, text: `**Step ${i + 1} of ${steps.length}.** ${steps[i]}` + (done ? "\n\nThat was the last step." : "\n\nSay “next step” to continue."), quick: done ? ["why", "practice"] : ["why", "explain-simply"] });
    }
    if (act === "example" || act === "another") { const topicQ = { chapterId: q.chapterId, label: q.chapterName, tokens: contentTokens(q.text).slice(0, 6) }; const ex = exampleAnswer(kb, topicQ, U, state, act === "another"); if (ex) return mkAnswer({ act, kind: ex.kind || "example", topic, text: ex.text, sources: ex.sources || [], numerical: ex.numerical || null, quick: ["another-example", "practice"], exampleId: ex.exampleId }); }
    return null;
  }

  /* ----- checking a student's answer ----- */
  function checkAnswer(kb, U, state, q, opts) {
    const raw = U.raw;
    if (q) {
      // Multi-step activity case: "is B right for Q2?" / "I chose provision for Q1"
      if (q.kind === "case" && q.extra && Array.isArray(q.extra.caseSteps) && q.extra.caseSteps.length) {
        const steps = q.extra.caseSteps;
        const ask = String(U.raw || "");
        const n = /(?:q(?:uestion)?\s*#?\s*)(\d{1,2})\b/.exec(ask);
        const W = new Set(U_.tokenize(ask.replace(/q(?:uestion)?\s*#?\s*\d+/gi, " ")));
        let idx = -1;
        if (n) { const i = parseInt(n[1], 10) - 1; if (i >= 0 && i < steps.length) idx = i; }
        if (idx < 0) idx = steps.findIndex(s => U_.tokenize(s.q).some(t => W.has(t)));
        const letter = /\b([a-e])\b/i.exec(ask.replace(/answer|option|choices?|chose|choose|picked|is|it|my|correct|right|the|for|in|of|q\d+/gi, " "));
        const li = letter ? letter[1].toLowerCase().charCodeAt(0) - 97 : -1;
        if (idx >= 0) {
          const s = steps[idx];
          const hasAns = s.options && typeof s.answerIndex === "number" && s.answerIndex >= 0 && s.options[s.answerIndex] != null;
          if (li >= 0 && s.options && li < s.options.length && hasAns) {
            const ok = li === s.answerIndex;
            return mkAnswer({ act: "check", kind: "question", topic: state.topic,
              text: ok ? `✅ **Correct!** For Q${idx + 1}, ${String.fromCharCode(65 + li)}. ${strip(s.options[li])} is right.\n\n${s.explanation ? strip(s.explanation) : ""}`.trim()
                       : `Not quite — for Q${idx + 1}, ${String.fromCharCode(65 + li)}. ${strip(s.options[li])} isn't the right choice.\n\n**Correct:** ${String.fromCharCode(65 + s.answerIndex)}. ${strip(s.options[s.answerIndex])}\n\n${s.explanation ? strip(s.explanation) : ""}`.trim(),
              quick: ["why", "practice"] });
          }
          return mkAnswer({ act: "check", kind: "question", topic: state.topic,
            text: `**Q${idx + 1}: ${strip(s.q)}**\n\n${hasAns ? `**Answer:** ${String.fromCharCode(65 + s.answerIndex)}. ${strip(s.options[s.answerIndex])}\n\n` : ""}${s.explanation ? strip(s.explanation) : ""}`.trim(),
            quick: ["why", "practice"] });
        }
        if (li >= 0) return mkAnswer({ act: "check", kind: "question", topic: state.topic, text: `Which step do you mean? This problem has ${steps.length} parts — say, for example, “is option ${letter[1].toUpperCase()} right for Q2?”`, confidence: "low", quick: ["why"] });
      }
      const studentFromText = (() => { const m = /(?:my answer is|i (?:got|think|answered|solved)|answer[: ]+is?|=)\s*(.+)$/i.exec(raw); return m ? m[1].trim() : null; })();
      const sa = studentFromText || (q.extra && q.extra.studentAnswer) || state.attempt;
      if (U.act === "mistake" || !studentFromText) {
        if (sa) { const a = mistakeAnswer(kb, q, U, state, sa); if (a) return mkAnswer({ act: U.act, kind: "question", topic: state.topic, text: a, sources: [{ label: `Related topic: ${q.section}${q.chapterName ? " — " + q.chapterName : ""}`, route: q.chapterId ? "ch-" + q.chapterId : null }], quick: ["explain-simply", "practice"] }); }
        return mkAnswer({ act: U.act, kind: "chat", topic: state.topic, text: "Type your answer (for example “my answer is ₹26,000” or the option you chose) and I'll compare it with the correct working and point out exactly where it differs.", confidence: "low" });
      }
      state.attempt = studentFromText;
      const a = mistakeAnswer(kb, q, U, state, studentFromText);
      const sn = numberFrom(studentFromText), cn = numberFrom(q.correctText || (q.answer != null ? String(q.answer) : "")); const right = (sn != null && cn != null && Math.abs(sn - cn) < 0.5) || (q.correctText && strip(studentFromText).toLowerCase() === strip(q.correctText).toLowerCase());
      if (right) return mkAnswer({ act: "check", kind: "question", topic: state.topic, text: `✅ **Correct!** ${strip(studentFromText)} is right.\n\n${whyQuestion(kb, q, U, state) || ""}`.trim(), quick: ["practice", "why"] });
      return mkAnswer({ act: "check", kind: "question", topic: state.topic, text: a || `Not quite — the correct answer is **${q.correctText ? strip(q.correctText) : q.answer}**.`, quick: ["explain-simply", "practice"] });
    }
    // pending practice question
    if (state.pendingPractice) {
      const pq = kb.questionById[state.pendingPractice.qid];
      if (pq && pq.options) {
        const letter = /(?:^|\s|\()([a-d])(?:\)|\.|\s|$)/i.exec(raw.replace(/answer|option|is|my|i|think/gi, " "));
        const idx = letter ? letter[1].toLowerCase().charCodeAt(0) - 97 : pq.options.findIndex(o => strip(o).toLowerCase() === raw.toLowerCase().trim());
        if (idx >= 0 && idx < pq.options.length) {
          const ok = idx === pq.correctIndex; if (ok) state.pendingPractice = null;
          return mkAnswer({ act: "check", kind: "question", topic: state.topic, text: ok ? `✅ **Correct!** ${strip(pq.options[idx])}\n\n${strip(pq.explanation || "")}` : `Not quite — ${strip(pq.options[idx])} isn't right.\n\n**Correct answer:** ${strip(pq.correctText)}\n\n${strip(pq.explanation || "")}`, quick: ["practice", "why"] });
        }
      }
    }
    // numeric answer against the last solved numerical
    if (state.numerical) {
      const r = rerun(state); const n = numberFrom(raw.replace(/.*(?:my answer is|i got|i think|answer is|=)/i, ""));
      if (r && n != null) { const dg = Solver.diagnoseNumber(r, n); if (dg && dg.right) return mkAnswer({ act: "check", kind: "numerical", topic: state.topic, text: `✅ **Correct!** ${inr(n)} matches the working.\n\n${r.answer.text}`, quick: ["practice", "why"] }); if (dg) return mkAnswer({ act: "check", kind: "numerical", topic: state.topic, text: `Not quite. I get **${r.answer.text.replace(/^[^=]*=\s*/, "")}**, not ${inr(n)}.${dg.reason ? "\n\nIt looks like " + dg.reason + "." : ""}\n\n${Solver.render(r, "steps")}`, numerical: r, quick: ["explain-simply", "practice"] }); }
    }
    return mkAnswer({ act: U.act, kind: "chat", topic: state.topic, text: "Sure — type your answer (a figure, an option letter, or your journal entry) and I'll check it against the working.", confidence: "low" });
  }

  /* ----- practice ----- */
  function practiceAnswer(kb, U, state, q, scope) {
    const topic = (U.topic && U.topic.chapterId ? U.topic : null) || state.topic || (q ? { chapterId: q.chapterId, tokens: [] } : null);
    const kinds = topic && topic.chapterId ? EXAMPLE_KINDS[topic.chapterId] : null;
    const pq = pickQuestion(kb, topic || {}, state, kinds && kinds.length ? null : null, "usedPractice", scope);
    if (!pq) return mkAnswer({ act: "practice", kind: "chat", text: "Tell me which chapter or topic you'd like to practise, and I'll set a question.", quick: [], confidence: "low" });
    state.usedPractice.push(pq.id); state.pendingPractice = { qid: pq.id };
    const lines = [`Here's one to try${pq.chapterName ? " (" + pq.chapterName + ")" : ""}:`, `**${pq.text}**`];
    if (pq.options && pq.options.length) lines.push(pq.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${strip(o)}`).join("\n"));
    lines.push("Work it out, then tell me your answer — or ask for a **hint** or say **“show solution”**.");
    return mkAnswer({ act: "practice", kind: "practice", topic: topic || state.topic, text: lines.join("\n\n"), sources: [{ label: `Related topic: ${pq.section}${pq.chapterName ? " — " + pq.chapterName : ""}`, route: pq.chapterId ? "ch-" + pq.chapterId : null }], quick: ["hint", "show-solution"], practiceId: pq.id });
  }

  /* ----- compare / summarize / formula / cycle / lookup ----- */
  function compareAnswer(kb, U, state, topic) {
    const P = U.parts;
    if (!P) { const G = gather(kb, topic, "compare", {}); const d = G.comparison[0] || G.top; if (!d) return null; return mkAnswer({ act: "compare", topic, text: `**${d.title}**\n\n${firstSentences(d.parts && d.parts.p || d.text, 4, 120)}`, used: [d], sources: sourceListFromDocs(kb, [d]), quick: ["explain-simply", "example"] }); }
    const ta = resolveTopic(kb, P.a.tokens, P.a.raw) || { chapterId: topic && topic.chapterId, tokens: P.a.tokens };
    const tb = resolveTopic(kb, P.b.tokens, P.b.raw) || { chapterId: topic && topic.chapterId, tokens: P.b.tokens };
    const ch = (topic && topic.explicit && topic.chapterId) || ta.chapterId || tb.chapterId;
    ta.chapterId = ta.chapterId || ch; tb.chapterId = tb.chapterId || ch;
    // a block that is itself a comparison of exactly these two things
    const both = P.a.tokens.concat(P.b.tokens); const W = Object.create(null); both.forEach(t => { W[t] = 1; });   // titles are matched on the student's own words only
    const cmp = kb.docs.filter(d => d.role === "comparison" && (!ch || d.chapterId === ch || d.chapterId === ta.chapterId || d.chapterId === tb.chapterId)).map(d => { let c = 0; Object.keys(W).forEach(t => { if (d.tTokens.has(t)) c += W[t]; }); return { d, c }; }).sort((x, y) => y.c - x.c)[0];
    const defA = gather(kb, Object.assign({}, ta, { tokens: P.a.tokens }), "define", {}), defB = gather(kb, Object.assign({}, tb, { tokens: P.b.tokens }), "define", {});
    const mean = (G, toks) => G.definition ? ensureStop(sentencesAbout(G.definition.parts && G.definition.parts.p || G.definition.text, toks, 1).join(" ")) : "";
    const lines = [];
    const ma = mean(defA, P.a.tokens), mb = mean(defB, P.b.tokens);
    if (defA.definition && defA.definition === defB.definition) {
      const pairTopic = { chapterId: ch, label: `${titleCase(P.a.raw)} vs ${titleCase(P.b.raw)}`, tokens: both, explicit: true };
      const Gp = gather(kb, pairTopic, "define", {}); const cc = composeConcept(kb, pairTopic, "define", U, state, Gp, 0, "define");
      lines.push(cc ? cc.text : `**${U_.topicTitle(defA.definition.title)}**\n${firstSentences(defA.definition.parts && defA.definition.parts.p || defA.definition.text, 3, 80)}`);
    }
    else if (ma && mb && ma !== mb) lines.push(`| | ${titleCase(P.a.raw)} | ${titleCase(P.b.raw)} |\n| --- | --- | --- |\n| **Meaning** | ${ma.replace(/\|/g, "/")} | ${mb.replace(/\|/g, "/")} |`);
    if (cmp && cmp.c > 0) lines.push(`**${cmp.d.title}**\n${firstSentences(cmp.d.parts && cmp.d.parts.p || cmp.d.text, 3, 100)}`);
    if (!lines.length) return null;
    const used = [cmp && cmp.c > 0 ? cmp.d : null, defA.definition, defB.definition].filter(Boolean);
    return mkAnswer({ act: "compare", topic: { chapterId: ch, label: `${titleCase(P.a.raw)} vs ${titleCase(P.b.raw)}`, tokens: both, explicit: true }, text: lines.join("\n\n"), used, sources: sourceListFromDocs(kb, used), quick: ["explain-simply", "example", "practice"] });
  }
  function summarizeAnswer(kb, U, state, topic) {
    if (!topic || !topic.chapterId) return null;
    const ch = topic.chapterId;
    const hasTokens = topic.tokens && topic.tokens.length && !topic.chapterOnly;
    if (hasTokens) { const G = gather(kb, topic, "revise", {}); const docs = [G.definition].concat(G.revision).concat(G.features.slice(0, 1)).filter(Boolean); if (docs.length) { const out = []; docs.slice(0, 3).forEach(d => out.push(`**${U_.topicTitle(d.title)}**\n${firstSentences(d.parts && d.parts.p || d.text, 2, 70)}`)); return mkAnswer({ act: "summarize", topic, text: "**Quick revision**\n\n" + out.join("\n\n"), used: docs, sources: sourceListFromDocs(kb, docs), quick: ["practice", "explain-simply"] }); } }
    const simple = kb.docs.filter(d => d.chapterId === ch && d.kind === "theory" && d.level === "simple").slice(0, 6);
    const rev = kb.docs.filter(d => d.chapterId === ch && d.kind === "revision").slice(0, 2);
    const out = simple.map(d => `**${U_.topicTitle(d.title)}** — ${ensureStop(mainPoint(d.parts && d.parts.p || d.text, 26))}`);
    if (!out.length && !rev.length) return null;
    return mkAnswer({ act: "summarize", topic, text: `**${kb.chapterNames[ch] || "Chapter"} — summary**\n\n` + bullets(out) + (rev.length ? "\n\n" + rev.map(d => firstSentences(d.text, 2, 60)).join("\n\n") : ""), used: simple.concat(rev), sources: uniqSources([sourceFor(kb, simple[0] || rev[0])]), quick: ["practice", "explain-simply"] });
  }
  function formulaAnswer(kb, U, state, topic) {
    const G = gather(kb, topic, "rules", {}); const fdocs = chapterFormulaDocs(kb, topic);
    const out = []; const used = [];
    fdocs.slice(0, 3).forEach(d => { out.push(`**${d.title}:** ${strip(d.text.replace(/^[^:]*:\s*/, ""))}`); used.push(d); });
    G.rules.slice(0, 2).forEach(d => { if (d.parts && d.parts.formula) { out.push(`**${U_.topicTitle(d.title)}:** ${strip(d.parts.formula)}`); used.push(d); } });
    if (G.definition && G.definition.parts && G.definition.parts.formula && !used.includes(G.definition)) { out.push(`**Formula:** ${strip(G.definition.parts.formula)}`); used.push(G.definition); }
    if (!out.length) { const c = composeConcept(kb, topic, "explain", U, state, G, 0, "normal"); return c ? mkAnswer({ act: "formula", topic, text: c.text, used: c.used, sources: sourceListFromDocs(kb, c.used), quick: ["example", "practice"] }) : null; }
    return mkAnswer({ act: "formula", topic, text: out.join("\n\n"), used, sources: sourceListFromDocs(kb, used), quick: ["example", "explain-simply", "practice"] });
  }
  // "Why is salary debited?" — classify the account, then apply the rule of debit and credit for that class
  function accountWhyAnswer(kb, U, state) {
    const m = /why\s+(?:is|are|do we|does|should|must)\s+(?:the\s+)?(.+?)\s+(debited|credited|debit|credit)\b/i.exec(U.raw); if (!m) return null;
    const info = Calc.classifyAccount(m[1]); if (!info) return null;
    const side = /^d/i.test(m[2]) ? "debited" : "credited";
    const nm = titleCase(m[1].trim());
    const rule = info.nature.startsWith("Expense") ? "Nominal accounts: **debit all expenses and losses**, credit all incomes and gains." : info.nature === "Asset" ? "An asset increases on the **debit** side." : info.nature === "Liability" ? "A liability increases on the **credit** side." : info.nature.startsWith("Income") ? "Nominal accounts: **credit all incomes and gains**." : info.nature.indexOf("Capital") === 0 ? "Capital is what the business owes the owner, so it increases on the **credit** side." : info.nature.indexOf("Reduces purchases") === 0 || info.nature.indexOf("Reduces sales") === 0 ? "A return reverses the original sale or purchase, so it sits on the opposite side." : "This account reduces the owner's capital, so it is **debited** when the owner takes money out.";
    const normal = info.normal.toLowerCase() === "debit" ? "debited" : "credited";
    const because = normal === side ? `So **${nm} A/c is ${side}** when it **increases** — that is the usual side for this kind of account.` : `That is the opposite of its normal side, so **${nm} A/c is ${side}** only when it **decreases** (a reversal, refund or payment).`;
    const G = gather(kb, { chapterId: "dc", tokens: [info.type === "Nominal" ? "nominal" : info.type === "Real / Personal" ? "real" : "personal"] }, "rules", {});
    const src = G.rules[0] || G.definition;
    return mkAnswer({ act: "why", topic: { chapterId: "dc", label: "Rules of Debit & Credit", tokens: ["debit", "credit"], explicit: true }, text: `**${nm} A/c** is a **${info.type}** account (${info.nature}), so its normal balance is **${info.normal}**.\n\n${rule}\n\n${because}`, used: src ? [src] : [], sources: src ? sourceListFromDocs(kb, [src]) : [], quick: ["explain-simply", "example", "practice"] });
  }
  function cycleAnswer(kb, U, state, opts) {
    const stages = [["jr", "Journal", "Every transaction is first recorded here, in date order."], ["lg", "Ledger", null], ["tb", "Trial Balance", null], ["dc", "Final Accounts", null]];
    const lines = ["**The accounting cycle** — how a business transaction travels from first record to final reports:", "**Transaction → Journal → Ledger → Trial Balance → Final Accounts**"];
    const used = [];
    const jr = gather(kb, { chapterId: "jr", tokens: ["journal"] }, "define", {}); if (jr.definition) { used.push(jr.definition); lines.push(`1. **Journal** — ${ensureStop(mainPoint(jr.definition.parts && jr.definition.parts.p || jr.definition.text, 30))}`); }
    const lg = gather(kb, { chapterId: "lg", tokens: ["ledger"] }, "define", {}); const lgd = kb.docs.find(d => d.chapterId === "lg" && d.kind === "theory"); if (lgd) { used.push(lgd); lines.push(`2. **Ledger** — ${ensureStop(mainPoint(lgd.text, 30))}`); }
    const tb = gather(kb, { chapterId: "tb", tokens: ["trial", "balance"] }, "define", {}); if (tb.definition) { used.push(tb.definition); lines.push(`3. **Trial Balance** — ${ensureStop(mainPoint(tb.definition.parts && tb.definition.parts.p || tb.definition.text, 30))}`); }
    lines.push("4. **Final Accounts** — the Trading and Profit & Loss Account and the Balance Sheet are prepared from the Trial Balance to show profit or loss and the financial position.");
    if (opts.hasCycle) lines.push("You can watch this flow for your own transactions in the Accounting Cycle tool.");
    return mkAnswer({ act: "cycle", topic: { chapterId: "jr", label: "Accounting cycle", tokens: [] }, text: lines.join("\n\n"), used, sources: sourceListFromDocs(kb, used), quick: ["example", "practice"] });
  }
  function lookupAnswer(kb, U, state) {
    const topic = U.topic || state.topic; if (!topic || !topic.chapterId) return mkAnswer({ act: "lookup", kind: "chat", text: "Tell me the topic and I'll point you to the right chapter.", confidence: "low" });
    const G = gather(kb, topic, "explain", {}); const d = G.definition || G.top;
    return mkAnswer({ act: "lookup", topic, text: `You'll find **${topic.label || "this topic"}** in **${kb.chapterNames[topic.chapterId] || topic.chapterId}**${d ? " — see “" + d.title + "” in " + (d.section === "Key Concepts" ? "Key Concepts" : "the Theory tab") : ""}. Tap the chapter link below to open it.`, used: d ? [d] : [], sources: d ? sourceListFromDocs(kb, [d]) : [], quick: ["explain-simply", "practice"] });
  }

  /* =========================================================
     10. REMEMBER (state update after an answer)
     ========================================================= */
  function finish(kb, U, state, ans, text, q) {
    state.lastUser = String(text || "").slice(0, 500);
    state.intent = ans.act || U.act;
    if (ans.topic && (ans.topic.chapterId || (ans.topic.tokens && ans.topic.tokens.length) || ans.topic.label)) state.topic = { chapterId: ans.topic.chapterId || null, label: ans.topic.label || "", tokens: (ans.topic.tokens || []).slice(0, 8), explicit: !!ans.topic.explicit };
    else if (U.topic && U.topic.explicit) state.topic = { chapterId: U.topic.chapterId, label: U.topic.label, tokens: U.topic.tokens.slice(0, 8), explicit: true };
    if (ans.kind !== "chat") {
      state.lastAnswer = { text: String(ans.text).slice(0, 2500), act: ans.act, kind: ans.kind, topic: state.topic, parts: ans.parts ? JSON.parse(JSON.stringify(ans.parts)) : null, used: (ans.used || []).map(d => ({ id: d.id, title: d.title })), sources: ans.sources || [], variant: 0 };
      (ans.used || []).forEach(d => { if (d && d.id != null && !state.usedDocs.includes(d.id)) state.usedDocs.push(d.id); });
      state.usedDocs = state.usedDocs.slice(-40);
    } else if (!state.lastAnswer) state.lastAnswer = null;
    if (ans.numerical) { state.numerical = { domain: ans.numerical.domain, sourceText: ans.numerical.sourceText || text, inputs: ans.numerical.inputs, answerText: ans.numerical.answer ? ans.numerical.answer.text : "" }; state.stepIdx = 0; }
    else if (ans.kind === "concept" && U.target === "topic" && U.explicitTopic) state.numerical = null;
    if (ans.exampleId && !state.usedExamples.includes(ans.exampleId)) state.usedExamples.push(ans.exampleId);
    if (ans.assumptions && ans.assumptions.length) state.assumptions = ans.assumptions.slice(0, 5);
    if (ans.practiceId) state.pendingPractice = { qid: ans.practiceId };
    if (ans.act !== "confused" && ans.kind !== "chat") state.confusion = 0;
    if (U.act === "nextstep") { /* stepIdx managed in handler */ } else if (q && U.act === "solve") state.stepIdx = 0;
    if (U.act === "numerical") state.pendingPractice = null;
  }
  // used by callers that obtained an answer from another engine (journal engine / backend) and still want memory
  function observe(kb, state0, text, reply, o) {
    const state = cleanState(state0); o = o || {};
    state.turn++; state.lastUser = String(text || "").slice(0, 500);
    const U = understand(kb, text, state0, { question: o.question || null });
    const fake = { act: U.act, kind: o.kind || (U.numeric ? "numerical" : "concept"), text: String(reply || ""), topic: U.topic && (U.topic.explicit || !state.topic) ? U.topic : state.topic, sources: o.sources || [], used: [], parts: null, numerical: null };
    if (["smalltalk", "unrelated", "confused", "unknown"].includes(U.act)) fake.kind = "chat";
    if (o.numericalText) { fake.numerical = { domain: o.domain || null, sourceText: o.numericalText, inputs: {}, answer: null }; fake.kind = "numerical"; }
    // keep definition-style parts so a later "explain simply" still works when the reply came from the backend
    if (fake.kind === "concept") fake.parts = { definition: firstSentences(strip(reply).replace(/\*\*/g, ""), 2, 55), analogy: "" };
    finish(kb, U, state, fake, text, o.question || null);
    return state;
  }

  /* =========================================================
     11. FOR THE BACKEND MODEL — same understanding, richer instruction
     ========================================================= */
  function prepare(kb, text, state0, opts) {
    opts = opts || {}; const state = cleanState(state0);
    const q = opts.question ? Know.resolveWire(kb, opts.question) : null;
    const U = understand(kb, text, state, { question: q });
    const topic = U.topic || state.topic;
    const parts = [];
    const last = state.lastAnswer;
    const lastTxt = last ? String(last.text || "").slice(0, 1400) : "";
    const subject = topic && topic.label ? ` Topic: ${topic.label}.` : "";
    const inst = {
      simplify: `The student asks you to explain your PREVIOUS answer more simply.${subject} Keep exactly the same meaning and topic; use everyday words and short sentences; shorter than before. Do NOT start a new topic or search for something new.`,
      shorten: `The student wants your PREVIOUS answer shorter.${subject} Give only the main point in 1–3 lines.`,
      expand: `The student wants MORE detail on your previous answer.${subject} Add useful detail or an example; do not repeat it word for word.`,
      example: `The student wants an example of the SAME topic.${subject} ${U.style.numbers ? "Use numbers and work it out." : "Keep it small and concrete."}`,
      another: `The student wants ANOTHER example of the same topic.${subject} It must differ from the example already given.`,
      why: `The student asks WHY about the previous answer / attached question.${subject} Give the reason behind it, not a repeat of the answer.`,
      importance: `The student asks why this matters.${subject} Explain its purpose and importance.`,
      define: `The student asks what it IS.${subject} Answer with the MEANING first (2–5 lines): what it is, what it is used for, and the key idea. Mention formats/columns only briefly, if at all. Do not dump a format or a table unless asked.`,
      explain: `The student wants an explanation of the CONCEPT.${subject} Start with the meaning, then purpose, then the main points, and a tiny example if useful. Match length to the question. Do not answer with only a format.`,
      format: `The student asks specifically for the FORMAT / layout.${subject} Show the format (columns/proforma) clearly.`,
      features: `The student asks for features / types / characteristics.${subject}`,
      compare: `The student asks for a comparison.${subject} Use a small table of differences.`,
      confused: `The student is confused. Do not repeat your last answer. Use simpler words, a different angle or a small example, step by step.`,
      practice: `The student wants a practice question${topic && topic.label ? " on " + topic.label : ""}. Set ONE question suitable for Class 11 and do not give the answer yet.`,
      mistake: `The student asks why their answer was wrong. Compare their answer with the correct answer and name the exact difference.`,
      check: `The student wants their answer checked. Compare it with the correct working and say clearly whether it is right.`,
      whatif: `The student asks a "what if" about the previous problem. Re-solve with the change, using the calculator tools.`,
      repeat: `The student asked you to repeat; restate your previous answer.`, rephrase: `Say your previous answer again in different words — same facts and accounting treatment.`,
      smalltalk: `This is casual conversation, not an accounting question. Reply briefly and warmly, and invite a topic. Do not retrieve or quote course content.`,
      unrelated: `This is outside Accountancy. Reply briefly and kindly, say you are an Accountancy tutor, and redirect to the syllabus. Do not pretend to know.`
    }[U.act];
    parts.push(`STUDENT INTENT (auto-detected): ${U.act}${U.style.simple ? " + simple wording" : ""}${U.style.short ? " + short" : ""}${U.style.detailed ? " + detailed" : ""}${U.style.final ? " + final answer only" : ""}${U.style.steps ? " + full steps" : ""}. ${topic && topic.label ? "Topic: " + topic.label + (topic.chapterId ? " (" + (kb.chapterNames[topic.chapterId] || topic.chapterId) + ")" : "") + "." : ""} Refers to: ${U.target}.`);
    if (inst) parts.push("WHAT TO DO: " + inst);
    if (last && U.followUp && ["simplify", "shorten", "expand", "example", "another", "why", "importance", "confused", "repeat", "rephrase", "followup", "whatif", "nextstep", "check"].includes(U.act)) parts.push(`YOUR PREVIOUS ANSWER (the "that" / "it" the student means):\n"""${lastTxt}"""`);
    if (state.lastUser && U.followUp) parts.push(`The student's previous message was: "${state.lastUser.slice(0, 200)}"`);
    if (state.attempt) parts.push(`The student's own attempt: ${state.attempt}`);
    // calc-first: deterministic solver result when the message is numerical (or a numerical follow-up)
    let solved = null;
    if (["numerical", "transaction", "clarify", "whatif"].includes(U.act) || (U.act === "solve" && state.numerical)) {
      let srcText = U.raw;
      if (U.act === "clarify" && state.clarification) srcText = state.clarification.originalText + ". " + U.raw;
      if (U.act === "whatif" && state.numerical && state.numerical.sourceText) { const prev = Solver.solve(state.numerical.sourceText, state.numerical.domain ? { domain: state.numerical.domain } : {}); const w = prev && !prev.needs ? Solver.whatIf(prev, U.raw) : null; if (w) solved = w; }
      if (!solved) solved = Solver.solve(srcText, {});
    }
    if (solved && solved.needs) parts.push(`MISSING INFORMATION: ${solved.needs}\nAsk the student for exactly this (or state a sensible assumption), do not guess.`);
    else if (solved) parts.push("VERIFIED SOLUTION (computed and validated by code — use these exact figures; explain them, do not recompute differently):\n" + Solver.render(solved, "steps") + (solved.ok ? "" : "\n(One internal check did not pass — say you are not fully sure and show the working.)"));
    else if (["define", "explain", "format", "features", "importance", "why", "compare", "formula", "summarize", "example", "another", "expand", "simplify"].includes(U.act) && topic && (topic.chapterId || (topic.tokens || []).length)) {
      // role-aware content: the RIGHT kind of block for what was asked
      const roleKey = { define: "define", explain: "explain", format: "format", features: "features", importance: "importance", why: "importance", compare: "compare", formula: "rules", summarize: "revise" }[U.act] || "explain";
      const G = gather(kb, topic, roleKey, { depth: U.style.detailed ? "detailed" : "normal" });
      const picks = []; const add = d => { if (d && !picks.includes(d)) picks.push(d); };
      if (roleKey === "define" || roleKey === "explain") { add(G.definition); G.purpose.forEach(add); G.supporting.slice(0, 2).forEach(add); G.features.slice(0, 1).forEach(add); }
      else if (roleKey === "format") G.format.forEach(add); else if (roleKey === "importance") { G.purpose.forEach(add); add(G.definition); } else G.ranked.slice(0, 4).forEach(r => add(r.doc));
      if (picks.length) parts.push("WEBSITE CHAPTER CONTENT (use as your source; combine naturally, do not paste it block by block):\n" + picks.slice(0, 5).map(d => `[${d.chapterName || ""} → ${d.section} → ${d.title}] ${U_.clip(d.text, 600)}`).join("\n"));
    }
    return { understanding: U, solved, state, question: q, instruction: parts.join("\n\n"), retrievalQuery: topic && topic.label ? `${topic.label} ${U.act}` : String(text || "") };
  }

  return { newState, cleanState, wireState, sanitizeWireState, understand, respond, prepare, observe, gather, resolveTopic, plainify, mainPoint, sentences, firstSentences, domainWhy, contentTokens, ROLE_FIT };
});
