/* ============================================================
   classes.js — Accountancy By Abhinash (v83)
   Class registry: Class 11 + Class 12 as two chapters sets sharing
   ONE set of learning tools. Loaded after data.js and data-12*.js
   and before app.js.

   On load it installs the Class 12 material into APP_DATA under
   chapter-id-keyed sections (content, mindmaps, quiz, flashcards,
   importantQuestions) WITHOUT touching APP_DATA.chapters — that
   array stays exactly the original 18 Class 11 chapters, so every
   legacy consumer that reads it keeps its old behaviour. app.js
   then shows one class's chapters at a time through activeChapters().

   Pure data helpers only — no DOM, no storage. UMD: window.ClassRegistry
   in the browser, module.exports for tests and build tools.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ClassRegistry = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var CLASS_11 = "11";
  var CLASS_12 = "12";

  var CLASS_META = {
    "11": {
      id: CLASS_11,
      label: "Class 11 Accountancy",
      shortLabel: "Class 11",
      blurb: "Accountancy fundamentals — accounting process, subsidiary books, BRS, GST, trial balance, depreciation and financial statements of sole proprietorship."
    },
    "12": {
      id: CLASS_12,
      label: "Class 12 Accountancy",
      shortLabel: "Class 12",
      blurb: "Partnership firms and companies — fundamentals, goodwill, reconstitution, dissolution, share capital, debentures, company accounts, analysis, ratios, cash flow and computerised accounting."
    }
  };

  function normalizeClass(cls) {
    var c = String(cls == null ? "" : cls).trim();
    if (c === "11" || c === "XI" || c === "xi") return CLASS_11;
    if (c === "12" || c === "XII" || c === "xii") return CLASS_12;
    return null;
  }

  /* Chapter lists. C11 comes straight from APP_DATA.chapters (never
     copied or reordered); C12 from the C12_DATA registry. */
  function chaptersOf(cls) {
    var c = normalizeClass(cls);
    if (c === CLASS_12) {
      var d = (typeof C12_DATA !== "undefined") ? C12_DATA : null;
      return (d && Array.isArray(d.chapters)) ? d.chapters : [];
    }
    if (typeof APP_DATA !== "undefined" && Array.isArray(APP_DATA.chapters)) return APP_DATA.chapters;
    return [];
  }

  function chapterIdsOf(cls) {
    return chaptersOf(cls).map(function (c) { return c.id; });
  }

  function chapterMeta(id) {
    var all = chaptersOf(CLASS_11).concat(chaptersOf(CLASS_12));
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function classOfChapter(id) {
    var c = normalizeClass((chapterMeta(id) || {}).class);
    return c;   // C11 chapter objects may not carry .class — fall through below
  }

  /* Which class a chapter id belongs to (authoritative, list-based). */
  function classOfChapterId(id) {
    if (chapterIdsOf(CLASS_12).indexOf(id) !== -1) return CLASS_12;
    if (chapterIdsOf(CLASS_11).indexOf(id) !== -1) return CLASS_11;
    return null;
  }

  /* ----------------------------------------------------------
     install() — merge Class 12 material into APP_DATA once.
     APP_DATA.chapters is deliberately NOT extended: the runtime
     chapter list is chosen per class in app.js.
     ---------------------------------------------------------- */
  var installed = false;
  function install(target, c12) {
    target = target || (typeof APP_DATA !== "undefined" ? APP_DATA : null);
    c12 = c12 || (typeof C12_DATA !== "undefined" ? C12_DATA : null);
    if (!target || !c12) return false;
    if (installed) return true;
    installed = true;

    var warnings = [];
    var c11Ids = {};
    (target.chapters || []).forEach(function (c) { c11Ids[c.id] = true; });

    /* content sections keyed by chapter id */
    var content = c12.content || {};
    Object.keys(content).forEach(function (id) {
      if (c11Ids[id]) { warnings.push("C12 content collides with a Class 11 chapter id: " + id); return; }
      target[id] = content[id];
    });

    /* mind maps merge into the same lookup the chapter pages use */
    target.mindmaps = target.mindmaps || {};
    Object.keys(c12.mindmaps || {}).forEach(function (id) {
      if (c11Ids[id]) { warnings.push("C12 mindmap collides with a Class 11 chapter id: " + id); return; }
      target.mindmaps[id] = c12.mindmaps[id];
    });

    /* important questions merge into the same chapter-keyed map */
    target.importantQuestions = target.importantQuestions || {};
    Object.keys(c12.importantQuestions || {}).forEach(function (id) {
      if (c11Ids[id]) { warnings.push("C12 important-questions collide with a Class 11 chapter id: " + id); return; }
      var prev = target.importantQuestions[id];
      var next = c12.importantQuestions[id];
      target.importantQuestions[id] = (Array.isArray(prev) && Array.isArray(next)) ? prev.concat(next) : next;
    });

    /* quiz + flashcards are flat arrays tagged with their chapter id;
       Class 12 items use an id range that can never collide with the
       existing banks (Class 11 quiz ids run to ~1000s, flashcards from 4001). */
    if (Array.isArray(c12.quiz) && c12.quiz.length) target.quiz = (target.quiz || []).concat(c12.quiz);
    if (Array.isArray(c12.flashcards) && c12.flashcards.length) target.flashcards = (target.flashcards || []).concat(c12.flashcards);

    if (warnings.length && typeof console !== "undefined") {
      warnings.forEach(function (w) { console.warn("[ClassRegistry] " + w); });
    }
    return true;
  }

  /* Uniqueness audit used by tests: every chapter id across both
     classes is unique, every Class 12 keyed map points at a real
     Class 12 chapter (never a Class 11 id), and the Class 12
     quiz/flashcard banks are internally unique and never reuse a
     Class 11 id.

     Duplicate checks are deliberately scoped to the Class 12 arrays:
     the original Class 11 flashcard decks ship with per-deck local
     ids (v82 behaviour, byte-identical content) and this audit
     reports what v83 could have broken — not what v82 shipped with. */
  function auditIds(target, c12) {
    target = target || (typeof APP_DATA !== "undefined" ? APP_DATA : null);
    c12 = c12 || (typeof C12_DATA !== "undefined" ? C12_DATA : null);
    var errors = [];
    if (!target || !c12) { errors.push("APP_DATA / C12_DATA missing"); return errors; }

    var seen = {};
    (target.chapters || []).forEach(function (c) {
      if (seen[c.id]) errors.push("duplicate chapter id: " + c.id);
      seen[c.id] = "11";
    });
    (c12.chapters || []).forEach(function (c) {
      if (seen[c.id]) errors.push("duplicate chapter id across classes: " + c.id);
      seen[c.id] = "12";
      if (!c.short) errors.push("chapter " + c.id + " missing short label");
      if (!c.icon) errors.push("chapter " + c.id + " missing icon");
      if (!c.color) errors.push("chapter " + c.id + " missing color");
    });

    (c12.chapters || []).forEach(function (c) {
      if (!c12.content || !c12.content[c.id]) errors.push("chapter " + c.id + " has no content block");
      if (!c12.mindmaps || !c12.mindmaps[c.id]) errors.push("chapter " + c.id + " has no mind map");
    });

    /* chapter-keyed maps must reference real Class 12 chapters */
    function checkKeyed(mapName, map) {
      Object.keys(map || {}).forEach(function (id) {
        if (seen[id] === "11") errors.push(mapName + " collides with a Class 11 chapter id: " + id);
        else if (seen[id] !== "12") errors.push(mapName + " has no matching Class 12 chapter: " + id);
      });
    }
    checkKeyed("Class 12 content", c12.content);
    checkKeyed("Class 12 mind map", c12.mindmaps);
    checkKeyed("Class 12 important questions", c12.importantQuestions);

    /* flat banks: internally unique AND disjoint from the other class */
    function auditBank(name, c12List, allList) {
      var mine = {};
      (c12List || []).forEach(function (q) { if (q && q.id != null) mine[q.id] = (mine[q.id] || 0) + 1; });
      Object.keys(mine).forEach(function (id) {
        if (mine[id] > 1) errors.push("duplicate Class 12 " + name + " id: " + id);
      });
      var others = {};
      (allList || []).forEach(function (q) {
        if (q && q.id != null && (c12List || []).indexOf(q) < 0) others[q.id] = true;
      });
      Object.keys(mine).forEach(function (id) {
        if (others[id]) errors.push("Class 12 " + name + " id collides with a Class 11 id: " + id);
      });
    }
    auditBank("quiz", c12.quiz, target.quiz);
    auditBank("flashcard", c12.flashcards, target.flashcards);

    return errors;
  }

  return {
    CLASS_11: CLASS_11,
    CLASS_12: CLASS_12,
    CLASS_META: CLASS_META,
    normalizeClass: normalizeClass,
    chaptersOf: chaptersOf,
    chapterIdsOf: chapterIdsOf,
    chapterMeta: chapterMeta,
    classOfChapterId: classOfChapterId,
    install: install,
    auditIds: auditIds
  };
});

/* Self-install in the browser so APP_DATA carries the Class 12
   material before app.js reads it. Tools and tests call
   install()/auditIds() explicitly with their own fixtures. */
if (typeof window !== "undefined" && window.ClassRegistry) {
  window.ClassRegistry.install();
}
