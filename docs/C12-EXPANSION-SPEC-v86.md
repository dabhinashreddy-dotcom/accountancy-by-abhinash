# Class 12 Content Expansion — Authoring Spec (v86)

This is the contract every v86 Class 12 content unit must satisfy.
The units are additive: `data-12f.js` … `data-12l.js` extend the
chapters already registered by `data-12a.js` … `data-12e.js` through
`C12_DATA.register()`, which now **merges** instead of replacing (see
the `c12MergeContent` documentation in `data-12.js`).

Nothing in the original units is edited, replaced or renumbered.

---

## 1. Files and chapter ownership

| File | Chapters | Quiz id block | Flashcard id block |
|---|---|---|---|
| `data-12f.js` | `pf` Partnership Fundamentals | 70131–70145 | 71105–71116 |
| `data-12g.js` | `gw` Goodwill, `psr` Change in PSR | 70146–70175 | 71117–71140 |
| `data-12h.js` | `adm` Admission, `ret` Retirement & Death | 70176–70205 | 71141–71164 |
| `data-12i.js` | `dis` Dissolution, `sc` Share Capital | 70206–70235 | 71165–71188 |
| `data-12j.js` | `deb` Debentures, `cfin` Company FS | 70236–70265 | 71189–71212 |
| `data-12k.js` | `fsa` FS Analysis, `rat` Accounting Ratios | 70266–70295 | 71213–71236 |
| `data-12l.js` | `cf` Cash Flow, `ca` Computerised Accounting | 70296–70325 | 71249–71260 |

Chapter order inside a file must follow the table. Quiz ids run
consecutively per chapter (15 each); flashcard ids likewise (12 each).

## 2. Per-chapter minimums (enforced by `tools/validate-c12.js`)

| Section | Existing | Add | Total |
|---|---:|---:|---:|
| Practice Bank `numericals` | 10 | 15 (ids **11–25**) | 25 |
| Quiz `quiz` | 10 | 15 | 25 |
| Flashcards `flashcards` | 8 | 12 | 20 |
| Important Questions | 7 | 8 | 15 |
| Interactive activity cases | varies | to reach **≥ 8** | ≥ 8 |
| `examCases` | 1–2 | 2 | ≥ 3 |
| `examNumericals` | 1–4 | 3 | ≥ 4 |

## 3. Schemas

### Practice Bank question (`content[chId].numericals` — the array is MERGED, so only supply the new ones)

```js
{
  id: 11,                       // 11..25, unique inside the chapter
  difficulty: "Easy" | "Medium" | "Hard",
  question: "…",                // full question text
  options: ["…", "…", "…", "…"],// 3 or 4 options, all distinct
  answerIndex: 0,               // index into options of the RIGHT answer
  explanation: "…",             // must state the working AND the same
                                // figure/word the correct option shows
}
```

### Quiz MCQ (`quiz` — a flat array appended to `C12_DATA.quiz`)

```js
{ id: 70131, chapter: "pf", difficulty: "Easy", q: "…",
  options: ["…","…","…","…"], answerIndex: 0, explanation: "…" }
```

### Flashcard (`flashcards`)

```js
{ id: 71105, chapter: "pf", front: "Question / term", back: "Answer" }
```
Backs must stay short enough to read at a glance (1–4 sentences;
formulas and formats welcome). One learning objective per card.

### Important question (append to `importantQuestions[chId]`)

```js
{ type: "Short Answer" | "Long Answer" | "Case-Based" | "Assertion-Reason",
  marks: 3 | 4 | 6,
  q: "…",
  answer: "…full worked answer…" }
```

### Exam case (`examCases`)

```js
{ id: 4, title: "…", passage: "…(≥ 20 chars, no answer leakage)…",
  difficulty: "Medium" | "Hard",
  subs: [ { q: "…", options: ["…","…","…","…"], answerIndex: 0,
            reasoning: "…" }, … ] }        // ≥ 3 subs, every one keyed
```

### Exam numerical (`examNumericals`)

```js
{ id: 5, q: "…", value: 12345, explanation: "…working…",
  difficulty: "Easy" | "Medium" | "Hard" }
```

### Interactive activity cases — ONLY the case array is supplied

`register()` keeps the existing engine `type`, `title` and
`instruction` and concatenates the case list. So the expansion file
writes the **whole** activity object with the same `type`, `title`
and `instruction` string as the original unit, and the extra cases in
the engine's own key:

| Engine | Chapter | Case key | Case shape |
|---|---|---|---|
| `journal` | `pf`, `sc` | `entries` | `{ prompt, dr:[…], cr:[…], drAccount, crAccount, amount, note? }` |
| `calc` | `gw`, `psr`, `ret`, `deb`, `cf` | `problems` | `{ prompt, inputs:[{key,label,placeholder}], answers:{key:number}, formula?, working, note? }` |
| `statement` | `adm`, `dis`, `fsa` | `statements` | `{ title, prompt?, needsAmount?, head?, rows:[{label, options?, answer, amount?}], working? }` |
| `classify` | `cfin`, `ca` | `sets` | `{ title, prompt?, buckets:[…], items:[{label, bucket}], working? }` |
| `match` | `rat` | `sets` | `{ title, prompt?, pairs:[{left, right}], working? }` |

`type`, `title` and `instruction` MUST be copied verbatim from the
original unit file so the tab keeps its identity.

## 4. Content rules

1. **Original wording only.** Every question must be newly written.
   Do not restate, lightly paraphrase or re-number an existing
   question, a quiz MCQ, an important question or an exam case.
2. **CBSE Class 12, session 2026–27.** Follow
   `docs/CBSE-2026-27-CLASS12-SYLLABUS-CHECKLIST.md`. Nothing out of
   syllabus.
3. **Verify every number by hand before writing it down.** Recompute
   the figure, then make the option, the answer index and the
   explanation agree. The validator rejects an explanation that never
   states the figure the marked option shows.
4. **Mix the formats**: conceptual MCQs, calculation MCQs, journal-
   entry concepts, interpretation, error identification, short
   business scenarios, multi-step problems.
5. **Mix the difficulty**: roughly 5 Easy / 6 Medium / 4 Hard per
   15-question batch.
6. **Cover the whole chapter**, not one narrow topic. Read the
   chapter's `theory`, `concepts`, `formats` and `quickRevision`
   blocks first and distribute questions across them.
7. **Distractors must be plausible** — classic student mistakes
   (wrong ratio direction, forgetting to revalue, add instead of
   subtract, wrong year's purchase, wrong activity head), never
   obviously silly.
8. No duplicates inside or across banks. No duplicate option text in
   one question.

## 5. Workflow

```bash
node tools/validate-c12.js     # exit 0 required before finishing
```

The validator reports per-chapter counts, schema errors and any
explanation/answer disagreement. Fix every error it reports for your
own chapters.
