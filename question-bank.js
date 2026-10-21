/* ============================================================
   QUESTION BANK — Accountancy by Abhinash
   The single structured repository every examination mode draws
   from. Nothing here touches the DOM, storage or the network, so
   it runs unchanged in the browser and inside the Node tests.

   The repository is assembled from four layers:

     1. the site's existing QUIZ BANK (APP_DATA.quiz) — kept
        byte-for-byte, ids unchanged, so existing solved-marks,
        the search index and every practice screen keep working;
     2. the newly authored bank in questions-expanded.js —
        written to questions-expanded/QUESTION-AUTHORING-SPEC.md
        and validated by questions-expanded/validate-fragment.js;
     3. the chapter practice material already on the site
        (numerical MCQs, term/concept detectives, basis switch
        checkpoints, trial-balance checkpoints, accounting-equation
        and BRS numericals, GST detective bills, adjustment cases,
        audit cases and decision labs) converted into examination
        format without altering the originals;
     4. descriptive material (Important Questions and Ledger short
        answers), counted in the coverage report but never drawn
        into a machine-graded paper, because free text cannot be
        marked honestly without a human.

   Layer 3 reuses questions rather than duplicating them, and
   layer 1 is never modified — the practice bank, the chapter
   screens and the XP they award are exactly as they were.

   Provenance metadata (kind / source / verification) lives only
   in this object and is stripped before any student-facing view.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuestionBank = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Chapter content keys in APP_DATA do not all match the chapter
     ids used by ExamRules, so the mapping is explicit. v83: Class 12
     content sections are installed into APP_DATA under their own
     chapter id (classes.js), so they map to themselves. */
  var CONTENT_KEY = {
    intro: "intro", terms: "terms", tbase: "tbase", basis: "basis",
    eq: "equation", dc: "debitCredit", jr: "journal", lg: "ledger",
    cb: "cashBook", sp2: "specialBooks2", brs: "brs", gst: "gst",
    tb: "tb", dep: "dep", pres: "pres", roe: "roe", fs: "fs", adj: "adj",
    pf: "pf", gw: "gw", psr: "psr", adm: "adm", ret: "ret", dis: "dis",
    sc: "sc", deb: "deb", cfin: "cfin", fsa: "fsa", rat: "rat",
    cf: "cf", ca: "ca"
  };
  var CHAPTER_IDS = ["intro", "terms", "tbase", "basis", "eq", "dc", "jr", "lg",
                     "cb", "sp2", "brs", "gst", "tb", "dep", "pres", "roe", "fs", "adj",
                     "pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb", "cfin",
                     "fsa", "rat", "cf", "ca"];

  /* Chapters whose APP_DATA chapter object carries MCQ-shaped
     `numericals` (question/options/answerIndex) that convert 1:1. */
  var MCQ_NUMERICAL_CHAPTERS = ["intro", "terms", "tbase", "basis", "gst", "tb",
                                "dep", "pres", "roe", "fs", "adj",
                                "pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb",
                                "cfin", "fsa", "rat", "cf", "ca"];

  /* v83 — Class 12 chapters scanned for examCases (multi-part board
     problems) and examNumericals (numeric-answer questions). */
  var C12_HARVEST_IDS = ["pf", "gw", "psr", "adm", "ret", "dis", "sc", "deb",
                         "cfin", "fsa", "rat", "cf", "ca"];

  function norm(s) {
    return String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  /* Content fingerprint used for duplicate detection: two questions
     with the same normalised wording are the same question. */
  function fingerprint(q) {
    if (!q || typeof q !== "object") return "";
    var parts = [q.q || "", q.passage || "", q.prompt || ""];
    if (Array.isArray(q.subs)) q.subs.forEach(function (s) { if (s) parts.push(s.q || ""); });
    return norm(parts.join(" \u0000 "));
  }

  function difficultyOf(x) {
    var d = x && x.difficulty;
    return d === "Easy" || d === "Medium" || d === "Hard" ? d : "Medium";
  }

  function num(x) { return typeof x === "number" && isFinite(x) ? x : null; }

  function expl(x) {
    return typeof x === "string" && x.trim() ? x.trim() : "";
  }

  /* ---------- layer 1: the existing quiz bank ---------------- */
  function fromQuiz(app) {
    var out = [];
    if (!app || !Array.isArray(app.quiz)) return out;
    app.quiz.forEach(function (q) {
      if (!q || typeof q !== "object") return;
      out.push({
        id: q.id, chapter: q.chapter, topic: q.topic || null,
        type: "mcq", difficulty: difficultyOf(q), marks: 1,
        q: q.q, options: (q.options || []).slice(),
        answerIndex: q.answerIndex, explanation: expl(q.explanation),
        tags: Array.isArray(q.tags) ? q.tags.slice() : [],
        provenance: { kind: "adapted", source: "site:quiz", verified: true }
      });
    });
    return out;
  }

  /* ---------- layer 2: the newly authored bank --------------- */
  function fromExpanded(expanded) {
    if (!Array.isArray(expanded)) return [];
    return expanded.filter(function (q) { return q && typeof q === "object"; }).map(function (q) {
      var copy = {};
      Object.keys(q).forEach(function (k) { copy[k] = q[k]; });
      if (!copy.provenance) copy.provenance = { kind: "new", verified: true };
      if (!Array.isArray(copy.tags)) copy.tags = [];
      return copy;
    });
  }

  /* ---------- layer 3: converted chapter practice ------------ */
  function mcq(chapter, id, q, options, answerIndex, explanation, difficulty, source, tags) {
    if (typeof q !== "string" || !q.trim()) return null;
    if (!Array.isArray(options) || options.length < 2) return null;
    if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= options.length) return null;
    return {
      id: id, chapter: chapter, topic: null, type: "mcq",
      difficulty: difficultyOf({ difficulty: difficulty }), marks: 1,
      q: q.trim(), options: options.slice(), answerIndex: answerIndex,
      explanation: expl(explanation), tags: Array.isArray(tags) ? tags : [],
      provenance: { kind: "adapted", source: source, verified: true }
    };
  }

  function numerical(chapter, id, q, value, explanation, difficulty, source, tags) {
    if (typeof q !== "string" || !q.trim()) return null;
    var v = num(value);
    if (v === null) return null;
    return {
      id: id, chapter: chapter, topic: null, type: "numerical",
      difficulty: difficultyOf({ difficulty: difficulty }), marks: 1,
      q: q.trim(), value: v, tolerance: 0,
      explanation: expl(explanation), tags: Array.isArray(tags) ? tags : ["numerical"],
      provenance: { kind: "adapted", source: source, verified: true }
    };
  }

  function caseQ(chapter, id, passage, subs, difficulty, source) {
    if (typeof passage !== "string" || passage.trim().length < 20) return null;
    if (!Array.isArray(subs) || subs.length < 2) return null;
    var clean = [], total = 0;
    for (var i = 0; i < subs.length; i++) {
      var s = subs[i];
      if (!s || typeof s.q !== "string" || !s.q.trim()) return null;
      if (!Array.isArray(s.options) || !Number.isInteger(s.answerIndex)) return null;
      if (s.answerIndex < 0 || s.answerIndex >= s.options.length) return null;
      clean.push({
        q: s.q.trim(), type: "mcq", marks: 1,
        options: s.options.slice(), answerIndex: s.answerIndex,
        explanation: expl(s.reasoning) || expl(s.hint) || expl(s.explanation)
      });
      total += 1;
    }
    if (clean.length < 2) return null;

    /* A harvested case study never came with a summary paragraph, only
       with per-part workings. Rather than ship an empty explanation (or
       invent a summary that would claim more than the source supports),
       say plainly where the working lives — but only when every part
       really does carry one, so this can never paper over a gap. */
    var withWorking = clean.filter(function (s) { return !!s.explanation; }).length;
    var topExpl = withWorking === clean.length
      ? "This case study has " + clean.length + " parts worth " + total +
        " mark" + (total === 1 ? "" : "s") + ". Each part carries its own worked " +
        "explanation — open the part you want to review."
      : "";

    return {
      id: id, chapter: chapter, topic: null, type: "case",
      difficulty: difficultyOf({ difficulty: difficulty }), marks: total,
      q: "Read the situation carefully and answer every part that follows.",
      passage: passage.trim(), subs: clean,
      explanation: topExpl,
      tags: ["case-study", "competency"],
      provenance: { kind: "adapted", source: source, verified: true }
    };
  }

  function descriptive(chapter, id, q, answer, marks, difficulty, source) {
    if (typeof q !== "string" || !q.trim()) return null;
    if (typeof answer !== "string" || !answer.trim()) return null;
    return {
      id: id, chapter: chapter, topic: null, type: "descriptive",
      difficulty: difficultyOf({ difficulty: difficulty }),
      marks: typeof marks === "number" && marks > 0 ? marks : 3,
      q: q.trim(), answer: answer.trim(), explanation: answer.trim(),
      tags: [],
      examEligible: false,
      provenance: { kind: "adapted", source: source, verified: true }
    };
  }

  function ch(app, id) { return app ? app[CONTENT_KEY[id]] : null; }

  function harvest(app) {
    var out = [];

    /* -- MCQ-shaped chapter numericals (11 chapters) ---------- */
    MCQ_NUMERICAL_CHAPTERS.forEach(function (cid) {
      var c = ch(app, cid);
      if (!c || !Array.isArray(c.numericals)) return;
      c.numericals.forEach(function (n, i) {
        if (!n) return;
        var got = mcq(cid, "h-" + cid + "-n" + (n.id != null ? n.id : i + 1),
          n.question, n.options, n.answerIndex, n.explanation, n.difficulty,
          "site:" + cid + ".numericals");
        if (got) out.push(got);
      });
    });

    /* -- term / concept detectives and basis checkpoints ------ */
    (function () {
      var c = ch(app, "terms");
      if (c && c.termDetective && Array.isArray(c.termDetective.cases)) {
        c.termDetective.cases.forEach(function (n, i) {
          var got = mcq("terms", "h-terms-td" + (i + 1), n && n.prompt, n && n.options,
            n && n.answerIndex, n && n.explanation, n && n.difficulty, "site:terms.termDetective");
          if (got) out.push(got);
        });
      }
    })();
    (function () {
      var c = ch(app, "tbase");
      if (c && c.conceptDetective && Array.isArray(c.conceptDetective.cases)) {
        c.conceptDetective.cases.forEach(function (n, i) {
          var got = mcq("tbase", "h-tbase-cd" + (i + 1), n && n.prompt, n && n.options,
            n && n.answerIndex, n && n.explanation, n && n.difficulty, "site:tbase.conceptDetective");
          if (got) out.push(got);
        });
      }
    })();
    (function () {
      var c = ch(app, "basis");
      if (c && c.basisSwitch && Array.isArray(c.basisSwitch.checkpoints)) {
        c.basisSwitch.checkpoints.forEach(function (n, i) {
          var got = mcq("basis", "h-basis-bs" + (i + 1), n && n.q, n && n.options,
            n && n.answerIndex, n && n.explanation, null, "site:basis.basisSwitch");
          if (got) out.push(got);
        });
      }
    })();
    (function () {
      var c = ch(app, "tb");
      if (c && Array.isArray(c.checkpoint)) {
        c.checkpoint.forEach(function (n, i) {
          var got = mcq("tb", "h-tb-cp" + (n.id != null ? n.id : i + 1),
            n && n.prompt, n && n.options, n && n.correctIndex,
            n && (n.reasoning || n.whereInTB), n && n.difficulty, "site:tb.checkpoint");
          if (got) out.push(got);
        });
      }
    })();

    /* -- accounting-equation numericals ----------------------- */
    (function () {
      var c = ch(app, "eq");
      if (!c || !Array.isArray(c.numericals)) return;
      c.numericals.forEach(function (n, i) {
        if (!n || num(n.answer) === null) return;
        var q;
        if (n.given && typeof n.given === "object") {
          var g = n.given;
          var bits = Object.keys(g).filter(function (k) { return num(g[k]) !== null; })
            .map(function (k) { return k.charAt(0).toUpperCase() + k.slice(1) + " = ₹" + Number(g[k]).toLocaleString("en-IN"); });
          q = (n.transaction || bits.join(", ")) + ". Find the " + String(n.ask || "figure") + ".";
        } else {
          q = n.transaction || ("Find the " + String(n.ask || "figure") + ".");
        }
        var steps = Array.isArray(n.steps) && n.steps.length ? n.steps.join(" ") : "";
        var got = numerical("eq", "h-eq-en" + (n.id != null ? n.id : i + 1), q, n.answer,
          [steps, expl(n.explanation), expl(n.hint)].filter(Boolean).join("  "),
          n.difficulty, "site:equation.numericals");
        if (got) out.push(got);
      });
    })();

    /* -- BRS detective situations (answer = final balance) ---- */
    (function () {
      var c = ch(app, "brs");
      if (!c || !Array.isArray(c.detective)) return;
      c.detective.forEach(function (n, i) {
        if (!n || num(n.finalBalance) === null) return;
        var start = n.startingPoint || "Cash Book";
        var q = "Balance as per " + start + " is ₹" + Number(n.startingBalance || 0).toLocaleString("en-IN") +
                ". " + String(n.situation || "").trim() + " Find the " + String(n.targetLabel || "balance") + ".";
        var why = (Array.isArray(n.items) ? n.items.map(function (it) { return it && it.reasoning; }) : []).filter(Boolean).join(" ");
        var got = numerical("brs", "h-brs-bd" + (n.id != null ? n.id : i + 1), q, n.finalBalance,
          why || ("The correct " + String(n.targetLabel || "balance") + " is ₹" + Number(n.finalBalance).toLocaleString("en-IN") + "."),
          n.difficulty, "site:brs.detective");
        if (got) out.push(got);
      });
    })();

    /* -- GST detective bills (answer = invoice value) --------- */
    (function () {
      var c = ch(app, "gst");
      if (!c || !Array.isArray(c.detective)) return;
      c.detective.forEach(function (n, i) {
        if (!n || !Array.isArray(n.options)) return;
        var idx = n.options.indexOf(n.answerValue);
        if (idx < 0) return;
        var bt = n.billText && typeof n.billText === "object" ? n.billText : {};
        var desc = Object.keys(bt).map(function (k) {
          return k.replace(/([A-Z])/g, " $1").toLowerCase() + " " + bt[k];
        }).join(", ");
        var got = mcq("gst", "h-gst-gd" + (n.id != null ? n.id : i + 1),
          "Bill details: " + (desc || "as stated") + ". Find the final invoice value.",
          n.options.map(String), idx,
          (Array.isArray(n.steps) ? n.steps.join(" ") : "") + " Answer: ₹" + Number(n.answerValue).toLocaleString("en-IN") + ".",
          n.difficulty, "site:gst.detective", ["numerical"]);
        if (got) out.push(got);
      });
    })();

    /* -- case-shaped sources ---------------------------------- */
    (function () {
      var c = ch(app, "adj");
      if (!c || !Array.isArray(c.adjustmentCases)) return;
      c.adjustmentCases.forEach(function (n, i) {
        if (!n) return;
        var passage = (n.concept ? "Adjustment: " + n.concept + ". " : "") + String(n.adjustment || "").trim();
        var got = caseQ("adj", "h-adj-ac" + (n.id != null ? n.id : i + 1), passage,
          n.questions, n.difficulty, "site:adj.adjustmentCases");
        if (got) out.push(got);
      });
    })();
    (function () {
      /* the answer-revealing `errorDescription` is deliberately
         excluded from the passage — it would give the answer away */
      var c = ch(app, "roe");
      if (!c || !Array.isArray(c.auditCases)) return;
      c.auditCases.forEach(function (n, i) {
        if (!n) return;
        var passage = (n.title ? n.title + ". " : "") + (Array.isArray(n.records) ? n.records.join(" ") : "");
        var got = caseQ("roe", "h-roe-au" + (n.id != null ? n.id : i + 1), passage,
          n.questions, n.difficulty, "site:roe.auditCases");
        if (got) out.push(got);
      });
    })();
    (function () {
      var c = ch(app, "pres");
      if (!c || !Array.isArray(c.decisionLab)) return;
      c.decisionLab.forEach(function (n, i) {
        if (!n) return;
        var passage = (n.title ? n.title + ". " : "") + String(n.situation || "").trim();
        var got = caseQ("pres", "h-pres-dl" + (n.id != null ? n.id : i + 1), passage,
          n.steps, n.difficulty, "site:pres.decisionLab");
        if (got) out.push(got);
      });
    })();

    /* -- v83: Class 12 exam material ---------------------------
       Case sets (multi-part board-style problems) and numeric-answer
       questions (goodwill, ratios, cash flow) stored per chapter in
       the merged Class 12 content sections. */
    C12_HARVEST_IDS.forEach(function (cid) {
      var c = ch(app, cid);
      if (!c) return;
      if (Array.isArray(c.examCases)) {
        c.examCases.forEach(function (n, i) {
          if (!n) return;
          var passage = (n.title ? n.title + ". " : "") + String(n.passage || "").trim();
          var got = caseQ(cid, "h-" + cid + "-ec" + (n.id != null ? n.id : i + 1), passage,
            n.subs, n.difficulty || "Hard", "site:" + cid + ".examCases");
          if (got) out.push(got);
        });
      }
      if (Array.isArray(c.examNumericals)) {
        c.examNumericals.forEach(function (n, i) {
          if (!n) return;
          var got = numerical(cid, "h-" + cid + "-en" + (n.id != null ? n.id : i + 1),
            n.q, n.value, n.explanation, n.difficulty, "site:" + cid + ".examNumericals");
          if (got) out.push(got);
        });
      }
    });

    return out;
  }

  /* ---------- layer 4: descriptive material ------------------
     These are counted in the coverage report but never drawn into
     a machine-graded paper — free text cannot be marked honestly
     without a human. Their ids use the `iqb-` prefix so they can
     never collide with the UI's own `iq-` bookmark/solved keys. */
  function harvestDescriptive(app) {
    var out = [];
    if (app && app.importantQuestions && typeof app.importantQuestions === "object") {
      CHAPTER_IDS.forEach(function (cid) {
        var list = app.importantQuestions[cid];
        if (!Array.isArray(list)) return;
        list.forEach(function (n, i) {
          var got = descriptive(cid, "iqb-" + cid + "-" + (i + 1), n && n.q, n && n.answer,
            n && n.marks, null, "site:importantQuestions." + cid);
          if (got) out.push(got);
        });
      });
    }
    var lg = ch(app, "lg");
    if (lg && lg.examQuestions && typeof lg.examQuestions === "object") {
      /* shaped as { easy: [...], medium: [...], hard: [...] } */
      Object.keys(lg.examQuestions).forEach(function (band) {
        var list = lg.examQuestions[band];
        if (!Array.isArray(list)) return;
        list.forEach(function (n, i) {
          var got = descriptive("lg", "h-lg-le-" + band + "-" + (i + 1), n && n.q, n && n.a, 3,
            band.charAt(0).toUpperCase() + band.slice(1), "site:ledger.examQuestions");
          if (got) out.push(got);
        });
      });
    }
    return out;
  }

  /* ---------- assembly --------------------------------------- */
  function build(appData, expanded) {
    var app = appData || (typeof APP_DATA !== "undefined" ? APP_DATA : null);
    var extra = expanded ||
      (typeof EXAM_QUESTIONS_EXPANDED !== "undefined" ? EXAM_QUESTIONS_EXPANDED : null) ||
      (typeof window !== "undefined" && Array.isArray(window.EXAM_QUESTIONS_EXPANDED) ? window.EXAM_QUESTIONS_EXPANDED : null);

    var layers = [
      { name: "quiz", items: fromQuiz(app) },
      { name: "authored", items: fromExpanded(extra) },
      { name: "practice", items: harvest(app) },
      { name: "descriptive", items: harvestDescriptive(app) }
    ];

    var byId = {}, byFp = {}, all = [], duplicates = [], rejected = [];
    layers.forEach(function (layer) {
      layer.items.forEach(function (q) {
        if (!q || typeof q !== "object") return;
        if (q.id === undefined || q.id === null || q.id === "") { rejected.push({ id: "(none)", why: "missing id", layer: layer.name }); return; }
        if (byId[q.id]) { duplicates.push({ id: q.id, why: "duplicate id", layer: layer.name }); return; }
        var fp = fingerprint(q);
        if (fp) {
          if (byFp[fp]) { duplicates.push({ id: q.id, why: "duplicate wording", layer: layer.name, of: byFp[fp] }); return; }
          byFp[fp] = q.id;
        }
        byId[q.id] = q;
        all.push(q);
      });
    });

    return {
      questions: all,
      byId: byId,
      duplicates: duplicates,
      rejected: rejected,
      layerCounts: layers.reduce(function (m, l) { m[l.name] = l.items.length; return m; }, {})
    };
  }

  /* ---------- coverage report --------------------------------
     Only questions that pass ExamRules' answer-key check are
     counted, so nothing unvalidated, keyless or malformed can
     inflate the figures.
  ------------------------------------------------------------- */
  function coverage(built, ExamRules) {
    var per = {};
    function bucket(ch) {
      if (!per[ch]) per[ch] = {
        total: 0, mcq: 0, multi: 0, numerical: 0, matching: 0, case: 0,
        descriptive: 0, eligible: 0, image: 0, competency: 0, hots: 0,
        Easy: 0, Medium: 0, Hard: 0, authoredNew: 0, adapted: 0, authentic: 0,
        invalid: 0, oneMark: 0, multiMark: 0
      };
      return per[ch];
    }
    CHAPTER_IDS.forEach(bucket);

    built.questions.forEach(function (q) {
      var b = bucket(q.chapter);
      b.total++;
      var t = q.type || "mcq";
      if (b[t] !== undefined) b[t]++; else b.other = (b.other || 0) + 1;
      if (q.image) b.image++;
      if (Array.isArray(q.tags)) {
        if (q.tags.indexOf("competency") >= 0) b.competency++;
        if (q.tags.indexOf("hots") >= 0) b.hots++;
      }
      if (q.difficulty && b[q.difficulty] !== undefined) b[q.difficulty]++;
      var kind = (q.provenance && q.provenance.kind) || "unknown";
      if (kind === "new") b.authoredNew++;
      else if (kind === "authentic") b.authentic++;
      else b.adapted++;

      if (q.type === "descriptive") {
        /* counted, but deliberately not machine-gradable — it is
           never drawn into a paper and so is neither valid nor
           invalid as an examination question */
        return;
      }
      var valid = ExamRules ? ExamRules.questionKeyValid(q) : true;
      if (valid) {
        b.eligible++;
        if (ExamRules && ExamRules.isExamEligible(q)) {
          if (ExamRules.questionMarks(q) > 1) b.multiMark++; else b.oneMark++;
        }
      } else b.invalid++;
    });

    return per;
  }

  var cache = null;

  return {
    CHAPTER_IDS: CHAPTER_IDS,
    CONTENT_KEY: CONTENT_KEY,
    norm: norm,
    fingerprint: fingerprint,
    build: build,
    coverage: coverage,
    all: function () {
      if (!cache) cache = build();
      return cache.questions;
    },
    byId: function (id) {
      if (!cache) cache = build();
      return cache.byId[id] || null;
    },
    reset: function () { cache = null; },
    stats: function () {
      if (!cache) cache = build();
      return {
        total: cache.questions.length,
        layerCounts: cache.layerCounts,
        duplicates: cache.duplicates,
        rejected: cache.rejected
      };
    }
  };
});
