# Option: a language model that runs inside the browser (NOT added)

Without an API key the tutor answers with retrieval + rules + calculators + conversation memory. That is strong for
Class 11 Accountancy questions that this site's content covers, but it is **not** a general-purpose language model: it cannot
reason about arbitrary topics, rewrite explanations in truly free-form language, or understand a badly worded problem
the way a large model can. The tutor says so honestly instead of guessing.

## Could a local model be bundled?
Technically yes (WebGPU runtimes such as WebLLM, or transformers.js/ONNX on WASM). Practically, for this site:

| Concern | Reality |
|---|---|
| Download size | Small instruction-tuned models are still hundreds of MB to a few GB — far larger than this whole site (~10 MB) |
| Hardware | Needs WebGPU or a fast CPU; many students' phones/low-end laptops would be slow, hot, or unsupported |
| Quality | Very small models make arithmetic and accounting-rule mistakes — exactly what the deterministic solver prevents |
| Offline/PWA | The model must be cached; first use means a long download on mobile data |

**Recommendation:** do not ship one by default. If you later want it, make it strictly opt-in ("Download smarter offline
tutor (≈ 1 GB)"), and let it only *re-word* answers that the core has already computed and validated.

## Re-evaluation (October 2026) — conclusion unchanged
The question was re-checked against the current state of in-browser runtimes and the tutor as it now stands:

* **The gap a local model would fill has shrunk.** The API-free tutor now covers intent + reference resolution,
  role-aware retrieval with typo tolerance, validated calculation engines for every numerical chapter (including
  cash book, final accounts and rectification), graded step-by-step case questions, and follow-ups that keep context.
  What remains is *free-form rewording* — stylistic polish, not correctness.
* **The cost side has not improved enough.** The smallest models that reliably follow instructions are still
  ~0.5–1.5B parameters (≈ 0.4–1 GB in 4-bit form, several GB in higher quality), must be downloaded before first
  offline use, and still hallucinate accounting rules and arithmetic — the two failure modes this site's architecture
  exists to prevent.
* **Offline-first breaks.** The site works with zero network. A model fetched on demand does not, until it has been
  downloaded once — on a metered mobile connection, for a Class 11 study site, that is a bad default.
* **Verdict:** still not bundled. The integration point below remains the honest, cheap path if you ever want it:
  the model re-words a verified answer and can never supply the numbers.

## Where it would plug in
`aiOfflineRespond()` in `app.js` already runs: core answer → journal engine → pattern matcher. A model adapter would be a
final step that receives `{ understanding, retrievedBlocks, verifiedSolution, previousAnswer }` (the same object
`AICore.prepare()` builds) and returns text. Nothing else in the tutor would need to change.

## How to evaluate it yourself
`node tools/validate-knowledge.js` reports what the local brain knows (index size per chapter/section, retrieval
fixture results); `npm test` exercises the full tutor (solvers, retrieval, case pipeline, probes). Any candidate model
should be compared against those same fixtures before it is allowed to touch an answer.
