/* ============================================================
   WEBSITE-WIDE SEARCH — Accountancy by Abhinash (v79)

   Pure, DOM-free search core: index construction, scoring,
   duplicate suppression and destination resolution. It lives
   apart from app.js so the behaviour students actually depend on
   (paste a question → get that question) can be executed and
   asserted by tests/exam-search-tests.js with no browser.

   Guarantees this module is written to provide:
     * COVERAGE — every question source in APP_DATA is indexed
       (quiz bank, chapter numericals, chapter theory, concepts,
       quick revision, important questions, flashcards, detective
       cases, checkpoints, ledger exam questions, journal patterns…).
     * EXACT MATCH — a pasted question normalises to the same string
       as the stored question and therefore outranks everything else.
     * NUMERICAL FIDELITY — normalisation lowercases and drops
       punctuation but NEVER drops digits, so questions that differ
       only in an amount stay distinct (₹7,200 ≠ ₹8,000) while
       Indian/Western digit grouping and the ₹ sign still match.
     * DUPLICATE SUPPRESSION — the same question reachable from two
       banks is returned once, deterministically.
     * WORKING DESTINATIONS — resolveSearchTarget() maps every result
       to a route that actually exists, re-renders when the student is
       already on the target page (the old code silently did nothing),
       and refuses to hand back a dead route.

   No third-party dependencies. Works in a browser (window.SiteSearch)
   and in Node (module.exports).
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SiteSearch = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Chapter id (route/progress key) → APP_DATA section key. v83:
     Class 12 content sections are installed into APP_DATA under their
     own chapter id by classes.js, so they map to themselves. */
  var CHAPTER_SECTION = {
    intro: "intro", terms: "terms", tbase: "tbase", basis: "basis",
    eq: "equation", dc: "debitCredit", jr: "journal", lg: "ledger",
    cb: "cashBook", sp2: "specialBooks2", brs: "brs", gst: "gst",
    tb: "tb", dep: "dep", pres: "pres", roe: "roe", fs: "fs", adj: "adj",
    pf: "pf", gw: "gw", psr: "psr", adm: "adm", ret: "ret", dis: "dis",
    sc: "sc", deb: "deb", cfin: "cfin", fsa: "fsa", rat: "rat",
    cf: "cf", ca: "ca"
  };

  /* Field order used when pulling the searchable sentence out of a
     stored question-like object. */
  var TEXT_FIELDS = ["q", "question", "prompt", "situation", "activity", "transaction", "statement"];

  /* Tie-break order for two results that score identically (lower
     wins), so a pasted question never lands on a vague index entry. */
  var PRIORITY = {
    chapterQuestion: 1,
    importantQuestion: 2,
    flashcard: 3,
    ledgerExam: 4,
    journalPattern: 5,
    concept: 6,
    revision: 7,
    page: 8,
    tool: 9
  };

  /* ----------------------------------------------------------
     Normalisation
     ---------------------------------------------------------- */
  function normalizeSearchText(value) {
    return String(value == null ? "" : value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[₹$€£]/g, " ")
      .replace(/(\d),(?=\d)/g, "$1")   // 1,00,000 / 8,000 → 100000 / 8000
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function compactSearchText(value) {
    return normalizeSearchText(value).replace(/\s+/g, "");
  }

  function shorten(text, n) {
    var s = String(text || "").replace(/\s+/g, " ").trim();
    var max = n || 90;
    return s.length > max ? s.slice(0, max).trim() + "…" : s;
  }

  /* ----------------------------------------------------------
     Index building
     ---------------------------------------------------------- */
  function buildSearchIndex(D, cfg) {
    D = D || {};
    cfg = cfg || {};
    var idx = [];

    function add(kind, title, route, aliases, extra) {
      if (!title) return null;
      var item = {
        kind: kind,
        title: String(title),
        route: route || null,
        aliases: Array.isArray(aliases) ? aliases.filter(Boolean) : [],
        text: null,
        source: "site",
        priority: PRIORITY.page
      };
      if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) item[k] = extra[k];
      idx.push(item);
      return item;
    }

    /* --- pages (navigation destinations) --- */
    (cfg.pages || []).forEach(function (p) {
      add("Page", p.title, p.route, p.aliases || [], { source: "pages", priority: PRIORITY.page });
    });

    /* --- floating tools --- */
    (cfg.tools || []).forEach(function (t) {
      add("Tool", t.title, null, t.aliases || [], {
        source: "tools", priority: PRIORITY.tool, action: t.action, toolId: t.toolId
      });
    });

    /* --- chapters --- */
    var chapters = D.chapters || [];
    chapters.forEach(function (ch) {
      add("Chapter", ch.name, "ch-" + ch.id, [
        ch.name.toLowerCase(),
        "chapter " + ch.num,
        ch.tagline || ""
      ].concat(chapterAliases(ch.id)), { source: "chapters", priority: PRIORITY.page });
    });

    /* --- generic array-of-questions indexer --- */
    function addArray(arr, opts) {
      if (!Array.isArray(arr)) return 0;
      var fields = opts.fields || TEXT_FIELDS;
      var n = 0;
      arr.forEach(function (raw) {
        if (!raw || typeof raw !== "object") return;
        var text = null;
        if (typeof opts.textOverride === "function") text = opts.textOverride(raw);
        if (!text) {
          for (var i = 0; i < fields.length; i++) {
            var f = fields[i];
            if (typeof raw[f] === "string" && raw[f].trim()) { text = raw[f].trim(); break; }
          }
        }
        if (!text) return;
        var aliases = [text];
        if (opts.aliasField && typeof raw[opts.aliasField] === "string") aliases.push(raw[opts.aliasField]);
        var title = opts.title ? opts.title(raw, text) : shorten(text, 90);
        var item = add(opts.kind, title, opts.route(raw), aliases, {
          text: text,
          source: opts.source,
          priority: opts.priority,
          detail: opts.detail ? opts.detail(raw) : null
        });
        // v83 — records can carry their chapter id so the app can scope
        // results to the active class (Class 11 / Class 12).
        if (item && opts.chapterField && raw[opts.chapterField] != null) item.chapter = raw[opts.chapterField];
        n++;
      });
      return n;
    }

    function addStrings(arr, opts) {
      if (!Array.isArray(arr)) return 0;
      var n = 0;
      arr.forEach(function (s) {
        if (typeof s !== "string" || s.trim().length < 15) return;
        add(opts.kind, shorten(s, 90), opts.route, [s], {
          text: s.trim(), source: opts.source, priority: opts.priority
        });
        n++;
      });
      return n;
    }

    function routeFor(chId) { return "ch-" + chId; }

  /* Accounting-equation numericals that have no sentence of their own:
     turn { given: {assets, liabilities…}, ask: "capital" } into real
     text, so a student searching the figures still finds the problem. */
  function equationText(raw) {
    if (!raw || typeof raw !== "object") return null;
    if (typeof raw.transaction === "string" && raw.transaction.trim()) return null;
    if (typeof raw.ask !== "string" || !raw.ask) return null;
    var given = raw.given;
    var parts = [];
    if (given && typeof given === "object") {
      Object.keys(given).forEach(function (k) {
        var v = given[k];
        parts.push(k + " " + (typeof v === "number" ? v.toLocaleString("en-IN") : String(v)));
      });
    }
    if (!parts.length) return "Find " + raw.ask;
    return parts.join(", ") + ". Find " + raw.ask + ".";
  }
    function idTitle(prefix) {
      return function (raw, text) {
        var n = raw && raw.id !== undefined ? raw.id + ": " : "";
        return prefix + n + shorten(text, 80);
      };
    }

    /* --- per-chapter content --- */
    chapters.forEach(function (ch) {
      var chId = ch.id;
      var sec = D[CHAPTER_SECTION[chId]];
      if (!sec) return;
      var route = routeFor(ch.id);
      var source = ch.id + ".";
      var chName = ch.name;

      // Theory headings + body text
      ["simple", "advanced"].forEach(function (key) {
        var list = sec.theory && sec.theory[key];
        if (!Array.isArray(list)) return;
        list.forEach(function (t) {
          if (!t || typeof t.h !== "string") return;
          add("Concept", shorten(t.h, 90), route, [t.h, t.p || ""], {
            text: t.h, source: source + "theory." + key, priority: PRIORITY.concept
          });
        });
      });

      // Glossary concepts
      addArray(sec.concepts, {
        kind: "Concept", fields: ["title"], aliasField: "body",
        route: function () { return route; },
        source: source + "concepts", priority: PRIORITY.concept
      });

      // Quick revision: a definition plus whatever list-shaped keys the
      // chapter uses (keyPoints, rules, balancingSteps, calculationSteps,
      // postingRules, addLessLogic, examPoints) and the object-shaped
      // blocks (formulas, formats, distinctions), flattened per entry.
      var qr = sec.quickRevision;
      if (qr && typeof qr === "object") {
        if (typeof qr.definition === "string" && qr.definition.trim()) {
          add("Quick Revision", shorten("Quick revision — " + chName, 90), route, [qr.definition], {
            text: qr.definition.trim(), source: source + "quickRevision", priority: PRIORITY.revision
          });
        }
        ["keyPoints", "rules", "balancingSteps", "calculationSteps", "postingRules", "addLessLogic", "examPoints"].forEach(function (listKey) {
          addStrings(qr[listKey], { kind: "Quick Revision", route: route, source: source + "quickRevision", priority: PRIORITY.revision });
        });
        // Object-shaped blocks: one searchable line per entry, so a formula
        // or a distinction column still turns up in search results.
        var flattenQRItems = function (items, kind, suffix) {
          if (!Array.isArray(items)) return;
          var texts = [];
          items.forEach(function (it) {
            if (typeof it === "string") { texts.push(it); return; }
            if (!it || typeof it !== "object") return;
            if (it.label && it.expr) { texts.push(it.label + ": " + it.expr); return; }
            var rows = Array.isArray(it.rows) ? it.rows : null;
            if (it.title || rows) {
              texts.push((it.title || "Format") + " — " + (rows || []).map(function (r) {
                return Array.isArray(r) ? r.join(" vs ") : String(r);
              }).join("; "));
            }
          });
          addStrings(texts, { kind: kind, route: route, source: source + "quickRevision" + suffix, priority: PRIORITY.revision });
        };
        flattenQRItems(qr.formulas, "Formula", ".formulas");
        flattenQRItems(qr.formats, "Quick Revision", ".formats");
        flattenQRItems(qr.distinctions, "Quick Revision", ".distinctions");
        if (Array.isArray(qr.commonMistakes)) {
          var mistakes = qr.commonMistakes.map(function (m) {
            if (typeof m === "string") return m;
            if (m && typeof m === "object") return m.text || m.mistake || m.title || "";
            return "";
          }).filter(Boolean);
          addStrings(mistakes, { kind: "Common Mistake", route: route, source: source + "commonMistakes", priority: PRIORITY.revision });
        }
      }

      // Chapter numericals — MCQ form (`question`) or transaction form.
      // Accounting-equation problems come in two shapes: a transaction
      // sentence, or a bare { given, ask } calculation. Both are given
      // real, searchable text so none of them end up as placeholders.
      if (Array.isArray(sec.numericals)) {
        addArray(sec.numericals, {
          kind: chId === "lg" ? "Ledger Posting" : "Numerical",
          fields: TEXT_FIELDS,
          route: function () { return route; },
          textOverride: function (raw) { return chId === "eq" ? equationText(raw) : null; },
          title: function (raw, text) {
            var n = raw && raw.id !== undefined ? "Q" + raw.id + ": " : "";
            return n + shorten(text, 80);
          },
          detail: function (raw) { return raw && raw.explanation ? raw.explanation : null; },
          source: source + "numericals", priority: PRIORITY.chapterQuestion
        });
      }
    });

    /* --- question sources that are not chapter sections --- */

    // Quiz bank (the multiple-choice paper the exam draws from)
    addArray(D.quiz || [], {
      kind: "Quiz Question",
      route: function (raw) { return routeFor(raw.chapter || ""); },
      title: function (raw, text) { return "Q" + raw.id + ": " + shorten(text, 80); },
      detail: function (raw) { return raw && raw.explanation ? raw.explanation : null; },
      source: "quiz", priority: PRIORITY.chapterQuestion
    });

    // Important Questions (board-pattern written practice)
    var important = D.importantQuestions || {};
    Object.keys(important).forEach(function (chId) {
      addArray(important[chId], {
        kind: "Important Question",
        route: function () { return "important-questions"; },
        title: function (raw, text) {
          var tag = raw && raw.type ? raw.type + " · " : "";
          return tag + shorten(text, 80);
        },
        detail: function (raw) { return raw && raw.answer ? raw.answer : null; },
        source: "importantQuestions." + chId, priority: PRIORITY.importantQuestion
      });
    });

    // Flashcards
    addArray(D.flashcards || [], {
      kind: "Flashcard", fields: ["front"],
      route: function () { return "flashcards"; },
      title: function (raw, text) { return shorten(text, 80); },
      detail: function (raw) { return raw && raw.back ? raw.back : null; },
      aliasField: "back",
      chapterField: "chapter",
      source: "flashcards", priority: PRIORITY.flashcard
    });

    // Ledger exam questions (theory + posting + balancing)
    var ledger = D.ledger || {};
    if (ledger.examQuestions) {
      ["easy", "medium", "hard"].forEach(function (level) {
        addArray(ledger.examQuestions[level], {
          kind: "Exam Question",
          route: function () { return "ch-lg"; },
          title: function (raw, text) { return shorten(text, 80); },
          detail: function (raw) { return raw && raw.marks ? String(raw.marks) + " marks" : null; },
          source: "ledger.examQuestions." + level, priority: PRIORITY.ledgerExam
        });
      });
    }
    addArray(ledger.extraPracticeTransactions, {
      kind: "Ledger Posting",
      route: function () { return "ch-lg"; },
      title: function (raw, text) { var n = raw && raw.id !== undefined ? "Q" + raw.id + ": " : ""; return n + shorten(text, 80); },
      source: "ledger.extraPractice", priority: PRIORITY.chapterQuestion
    });
    // The merged practice pool the Ledger page actually uses (chapter
    // bank + extra practice), passed in by the app.
    addArray(cfg.ledgerPool, {
      kind: "Ledger Posting",
      route: function () { return "ch-lg"; },
      title: function (raw, text) { var n = raw && raw.id !== undefined ? "Q" + raw.id + ": " : ""; return n + shorten(text, 80); },
      source: "ledger.practicePool", priority: PRIORITY.chapterQuestion
    });
    addArray(ledger.postingRules, {
      kind: "Concept", fields: ["title"], aliasField: "body",
      route: function () { return "ch-lg"; },
      source: "ledger.postingRules", priority: PRIORITY.concept
    });
    // The Ledger chapter stores its prose as { meaning, definition,
    // importance, relationship } rather than theory/concepts arrays.
    var ledgerIntro = ledger.intro || {};
    ["meaning", "definition", "importance", "relationship"].forEach(function (k) {
      var v = ledgerIntro[k];
      // Some of these are a single paragraph, others a list of bullets.
      if (typeof v === "string" && v.trim()) {
        add("Concept", shorten("Ledger " + k, 90), "ch-lg", [v], {
          text: v.trim(), source: "ledger.intro." + k, priority: PRIORITY.concept
        });
      } else if (Array.isArray(v)) {
        v.forEach(function (line) {
          if (typeof line !== "string" || line.trim().length < 15) return;
          add("Concept", shorten("Ledger " + k, 90), "ch-lg", [line], {
            text: line.trim(), source: "ledger.intro." + k, priority: PRIORITY.concept
          });
        });
      }
    });

    // Journal entry patterns (keyword → debit/credit)
    addArray(D.journalEntryPatterns || [], {
      kind: "Journal Entry", fields: ["narration"],
      route: function () { return "ch-jr"; },
      title: function (raw, text) {
        return shorten((raw && raw.debit ? raw.debit + " Dr / " + raw.credit + " Cr — " : "") + text, 80);
      },
      aliasField: "debit",
      source: "journalEntryPatterns", priority: PRIORITY.journalPattern
    });

    /* --- chapter-specific extras (cases, checkpoints, illustrations) --- */
    var EXTRAS = [
      { ch: "intro", path: ["actionLab"], kind: "Activity", fields: ["activity", "transaction"], priority: PRIORITY.chapterQuestion },
      { ch: "terms", path: ["termDetective", "cases"], kind: "Question", fields: ["prompt"], priority: PRIORITY.chapterQuestion },
      { ch: "tbase", path: ["conceptDetective", "cases"], kind: "Question", fields: ["prompt"], priority: PRIORITY.chapterQuestion },
      { ch: "basis", path: ["basisSwitch", "checkpoints"], kind: "Question", fields: ["q"], priority: PRIORITY.chapterQuestion },
      { ch: "dc", path: ["balanceSheetQuestions"], kind: "Balance Sheet Question", priority: PRIORITY.chapterQuestion },
      { ch: "dc", path: ["balanceSheetStatements"], kind: "Balance Sheet Question", fields: ["prompt"], priority: PRIORITY.chapterQuestion },
      { ch: "cb", path: ["illustrations"], kind: "Illustration", fields: ["title"], aliasField: "given", priority: PRIORITY.chapterQuestion },
      { ch: "brs", path: ["detective"], kind: "BRS Question", fields: ["situation"], priority: PRIORITY.chapterQuestion },
      { ch: "tb", path: ["checkpoint"], kind: "Trial Balance Checkpoint", fields: ["prompt"], priority: PRIORITY.chapterQuestion },
      { ch: "pres", path: ["decisionLab"], kind: "Decision Lab", fields: ["situation"], aliasField: "title", priority: PRIORITY.chapterQuestion },
      { ch: "roe", path: ["auditCases"], kind: "Error Detective", fields: ["errorDescription"], aliasField: "title", priority: PRIORITY.chapterQuestion },
      { ch: "fs", path: ["builderCases"], kind: "Statement Builder", fields: ["title"], aliasField: "asOn", priority: PRIORITY.chapterQuestion },
      { ch: "adj", path: ["adjustmentCases"], kind: "Adjustment", fields: ["adjustment"], aliasField: "concept", priority: PRIORITY.chapterQuestion }
    ];
    EXTRAS.forEach(function (spec) {
      var node = D[CHAPTER_SECTION[spec.ch]];
      spec.path.forEach(function (key) { node = node ? node[key] : null; });
      if (!Array.isArray(node)) return;
      addArray(node, {
        kind: spec.kind,
        fields: spec.fields,
        aliasField: spec.aliasField,
        route: function () { return routeFor(spec.ch); },
        title: function (raw, text) {
          var n = raw && raw.id !== undefined ? "Q" + raw.id + ": " : "";
          return n + shorten(text, 80);
        },
        source: spec.ch + "." + spec.path.join("."), priority: spec.priority
      });
    });

    return idx;
  }

  /* Aliases kept out of the route table so the navigation list stays
     the single source of truth for where a chapter lives. */
  function chapterAliases(id) {
    var extra = {
      cb: ["cash book", "special purpose books 1"],
      dc: ["debit credit", "debit and credit", "golden rules"],
      sp2: ["other books", "special purpose books 2", "special purpose books"],
      brs: ["bank reconciliation", "bank reconciliation statement", "pass book"],
      eq: ["accounting equation", "assets = capital + liabilities"],
      jr: ["journal", "book of original entry"],
      lg: ["ledger", "book of final entry"],
      tb: ["trial balance"],
      gst: ["gst", "goods and services tax"],
      dep: ["depreciation", "slm", "wdv"],
      intro: ["introduction to accounting", "accounting basics"],
      terms: ["accounting terms", "accountancy terms"],
      tbase: ["theory base", "gaap", "accounting standards"],
      basis: ["cash basis", "accrual basis", "bases of accounting"],
      pres: ["provisions", "reserves", "provision and reserve", "provisions and reserves", "sinking fund", "secret reserve"],
      roe: ["rectification", "rectification of errors", "suspense account", "suspense a/c", "errors"],
      fs: ["financial statements", "trading account", "profit and loss account", "balance sheet", "sole proprietorship"],
      adj: ["adjustments", "adjustment", "closing stock", "outstanding expenses", "prepaid expenses", "final accounts"]
    };
    return extra[id] || [];
  }

  /* ----------------------------------------------------------
     Scoring
     ---------------------------------------------------------- */
  function scoreSearchResult(item, query) {
    var q = normalizeSearchText(query);
    if (!q) return 0;
    var score = 0;
    var compactQ = q.replace(/\s+/g, "");

    // 1. The full stored question text — this is what a pasted
    //    question matches, and it must outrank everything else.
    if (item.text) {
      var t = normalizeSearchText(item.text);
      if (t) {
        var compactT = t.replace(/\s+/g, "");
        if (t === q) score += 6000;
        else if (compactT === compactQ) score += 5600;
        else if (q.length >= 14 && t.indexOf(q) === 0) score += 3200;   // paste + trailing junk
        else if (q.length >= 16 && t.indexOf(q) > 0) score += 2800;     // paste embedded in more text
        else {
          // every word of the query appears in the question text
          var words = q.split(" ").filter(function (w) { return w.length >= 3; });
          var hits = words.filter(function (w) { return t.indexOf(w) >= 0; }).length;
          if (words.length && hits === words.length) score += 700;
          else if (words.length && hits / words.length >= 0.75) score += 300;
        }
      }
    }

    // 2. Title / alias matching (navigation, concepts, tools)
    var hay = normalizeSearchText([item.title].concat(item.aliases || []).join(" "));
    var title = normalizeSearchText(item.title);
    if (title === q) score += 1000;
    else if (title.replace(/\s+/g, "") === compactQ) score += 950;
    else if (title.indexOf(q) === 0) score += 500;
    if (hay.indexOf(q) === 0) score += 350;
    if (title.indexOf(q) >= 0) score += 250;
    else if (hay.indexOf(q) >= 0) score += 150;

    q.split(" ").forEach(function (token) {
      if (token.length < 2) return;
      if (title.split(" ").some(function (w) { return w.indexOf(token) === 0; })) score += 80;
      if (hay.indexOf(token) >= 0) score += 25;
    });

    return score;
  }

  function dedupeKey(item) {
    if (item.text) return "t:" + normalizeSearchText(item.text);
    return "r:" + (item.route || item.toolId || "") + ":" + normalizeSearchText(item.title);
  }

  /* Score → filter → sort → suppress duplicates → cut to `limit`. */
  function selectSearchResults(index, query, limit) {
    var q = normalizeSearchText(query);
    if (!q || !Array.isArray(index)) return [];
    var max = typeof limit === "number" ? limit : 12;
    var seen = {};
    var out = [];
    var scored = [];
    index.forEach(function (item) {
      var s = scoreSearchResult(item, query);
      if (s > 0) scored.push({ item: item, score: s });
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      var pa = a.item.priority == null ? 99 : a.item.priority;
      var pb = b.item.priority == null ? 99 : b.item.priority;
      if (pa !== pb) return pa - pb;
      return String(a.item.title).localeCompare(String(b.item.title));
    });
    scored.forEach(function (x) {
      if (out.length >= max) return;
      var key = dedupeKey(x.item);
      if (seen[key]) return;
      seen[key] = true;
      out.push(x.item);
    });
    return out;
  }

  /* ----------------------------------------------------------
     Destination resolution — never return a dead link.
       ctx.currentRoute : route currently on screen
       ctx.hasRoute(r)  : does this route actually render?
     ---------------------------------------------------------- */
  function resolveSearchTarget(item, ctx) {
    ctx = ctx || {};
    if (!item) return { type: "none" };
    if (item.action === "openTool") return { type: "tool", toolId: item.toolId || null };
    if (!item.route) return { type: "none" };
    if (typeof ctx.hasRoute === "function" && !ctx.hasRoute(item.route)) {
      return { type: "navigate", route: "home", fallback: true, requested: item.route };
    }
    // Already looking at it: re-render rather than silently doing nothing.
    if (item.route === ctx.currentRoute) return { type: "rerender", route: item.route };
    return { type: "navigate", route: item.route };
  }

  /* Hint text for the empty state. */
  function noResultsHint() {
    return "Try a shorter or exact question, a chapter name, or a tool — e.g. cash book, trial balance, depreciation or whiteboard.";
  }

  return {
    CHAPTER_SECTION: CHAPTER_SECTION,
    PRIORITY: PRIORITY,
    normalizeSearchText: normalizeSearchText,
    compactSearchText: compactSearchText,
    buildSearchIndex: buildSearchIndex,
    scoreSearchResult: scoreSearchResult,
    selectSearchResults: selectSearchResults,
    dedupeKey: dedupeKey,
    resolveSearchTarget: resolveSearchTarget,
    noResultsHint: noResultsHint
  };
});
