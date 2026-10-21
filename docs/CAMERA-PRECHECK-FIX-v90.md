# Exam Pre-check Camera Fix (v90) — Root Cause, Changes, Tests, Limits

Fixes the two recurring Exam Mode pre-check errors:

1. *"Camera not blank or covered — Not enough camera frames were sampled…"*
2. *"Exactly one person visible — No person was detected in the camera frame…"*

No threshold was lowered. Every security floor (`black.minSamples` 8 in
`black.windowMs` 3000, `confirmRatio` 0.75, `face.precheckSamples` 8,
`face.precheckMinOk` 6, `face.minScore` 0.50, phone `confirmCount` 3) is
unchanged. Full regression suite: **10,585 assertions + 37 probes, 0 failed**
(previously 10,527; +58 from the new checks and CONFIG walk).

## 1. Root cause

Both errors came from one design flaw in the pre-check observation window
(`exam-monitor.js`, runPrechecks), not from the student's face or lighting.

**RC1 — blank sampling was mathematically starved.** The v89 loop was a
single sequence per tick:

```
sample the picture → await FACE inference → await PHONE inference → wait 400 ms
```

A blank sample could therefore only be taken every
`400 ms + faceTime + phoneTime`. The blank watcher needs ≥ 8 samples inside a
rolling 3000 ms, i.e. a cadence of ≤ 375 ms. The base wait alone (400 ms)
already exceeds that, so **on real hardware the check could never reach its
sample floor** — it always ended `insufficient` → *"Not enough camera frames
were sampled"*. Inference also starved the phone scan the same way (fewer
than `confirmCount` passes could let a phone through unconfirmed).

**RC2 — "waiting for frames" counted re-reads, not presented frames.**
`frameStats()` incremented its `frames` counter on *every call*, regardless
of whether the video element had actually presented a new frame, and the
feed wait loop passed on that counter. Inference then started as soon as
`videoWidth > 0` — before `readyState ≥ HAVE_CURRENT_DATA` — so early passes
could run on an empty/black picture and BlazeFace correctly returned zero
faces; if the video never started presenting (autoplay rejected, stalled
stream) every pass saw nothing, and the run reported *"No person was
detected"* — blaming the student for a camera/pipeline fault. There was also
no distinction between "no face", "not enough passes", "frozen frames",
"model failed" and "detector unavailable" (a thrown inference was recorded
as `-1`, indistinguishable from "unavailable"), and the live `setInterval`
loops could stack overlapping `detectForVideo` calls on the same MediaPipe
task.

## 2. What changed

`exam-monitor.js` (core fix), `app.js` (one provider line), version pins,
tests, docs. Nothing else.

**Independent, non-blocking observation window** (replaces the sequential
loop):
- The blank sampler runs in **its own loop** on `precheckBlankSampleMs`
  (250 ms → ~12 samples per 3000 ms) and counts a sample **only when
  `frameStats().fresh` is true** (genuinely new frame).
- Face and phone each run in **their own loop**, paced start-to-start at
  `precheckSampleMs` (a slow pass shortens the wait, never queues the next),
  skipping beats instead of overlapping inference. Face/phone passes are
  refused while `camera.fresh()` says the picture is stale.
- Each loop carries a generation tag: a result computed for an abandoned
  window is dropped, never reported.

**Genuinely-new-frame tracking** (browser runtime):
- `requestVideoFrameCallback` counts frames the browser *actually
  presented* (fallback: media-time advance). Repeated reads of one frozen
  picture return the cached stats with `fresh: false` and are never
  re-counted; a detached/not-ready video reports `ready: false`
  (`no-metadata` / `no-current-frame`) instead of a phantom frame.
- The feed wait now requires ready **and** a presented/new frame (up to the
  same 5 s timeout), so delayed camera startup is waited for and frozen
  feeds are named as frozen.
- `camera.fresh()` closes if no frame newer than `frameFreshMs` (1 s).

**Single-flight inference:** `runFaceDetection`/`runPhoneDetection` join an
in-flight pass instead of stacking another `detectForVideo` on the same
task (protects the live monitor's `setInterval` loops too); no pass runs
without a decoded frame (`readyState < 2` → `-1` unavailable).

**Distinct, accurate verdicts** (requirement 7):
- `camera-feed`: live / frozen ("no new frames arrived") / no frames.
- `camera-blank`: confirmed (≥8 fresh samples, ≥75% suspect) / **frozen** /
  unreadable / not-enough-fresh-samples (original RETRY message kept
  verbatim) / ready ("N fresh frames sampled").
- `face`: ready (≥6 fresh passes, exactly one face, zero model errors) /
  frozen (**never** "no person") / model unavailable / model failed /
  not-enough-passes / multiple people / no person / unreliable.
- `phone`: confirmed / no phone / **frozen** ("the scan could not run" —
  an empty result from a dead feed is no longer reported as a pass).
- Ready is impossible on insufficient samples, a failed model, or stale
  frames (requirement 8).

`app.js`: pre-check providers pass `fresh: () => rt.camera.fresh()` through.
Version pins bumped: `exam-monitor.js?v=3`, `app.js?v=67`, all sub-pages;
`sw.js` cache `aba-cache-v51`.

## 3. Tests actually performed

### 3a. Automated (Node) — MOCKED sensors, REAL logic

`tests/exam-monitor-tests.js` section **L** (56 new assertions; suite
439 → 497): the shipped `runPrechecks`/watcher/runtime code executes for
real; only providers, clock, DOM/video element and MediaPipe tasks are
fakes at the call site. Includes the invariant the old code violated
(blank cadence ≤ windowMs/minSamples). Scenarios: slow inference
(200/350 ms, real clock — blank reaches its real floor of 8, face ≥6
passes, whole pre-check clear); slow phone still confirms a phone;
insufficient fresh frames → RETRY with the original message; frozen →
frozen messages, never "no person"; delayed camera startup → waited for;
clearly visible face / nobody / several people / throwing detector /
unavailable detector → five distinct messages; runtime freshness
(first frame fresh, repeat read `fresh:false`, new frame fresh again, no
redraw of a frozen picture, gate closes after `frameFreshMs`, closes on
not-ready video); single-flight (3 concurrent callers → 1 inference);
strictly increasing MediaPipe timestamps; face/box parsing incl. overlap
merging and score floor; phone class allow-listing; detector exceptions
propagate.

Full suite: **10,585 assertions + 37 probes, 0 failed, exit 0** (`npm test`).

### 3b. Real browser (Chromium, local `tools/serve.js`) — REAL models + REAL frames

The automation browser's camera permission is **denied**
(`NotAllowedError`) and no permission-grant API is exposed, so the camera
source was a synthetic `canvas.captureStream` playing the public-domain
test fixture (`tests/fixture-face-public-domain.jpg`) with a moving
timestamp (every frame genuinely new). Everything else is real: the
shipped runtime, real MediaPipe wasm + BlazeFace short-range + EfficientDet
lite0 (loaded from `/vendor/vision/`, ~5.2 s), real `getUserMedia`
(intercepted only to substitute the source), real `requestVideoFrameCallback`
(~27 fps ticks), real luma analysis.

| Scenario | Result (real model, real frames) |
| --- | --- |
| Face visible → full pre-check | **`ok: true`**, 7.6 s — `camera-feed` ready, `camera-blank` *"Picture confirmed (**8** fresh frames sampled)"*, `face` *"Exactly one person confirmed in **15 of 15** passes"*, `phone` clean, mic calibrated |
| Nobody in frame | `face` FAILED *"No person was detected…"*; `camera-blank` still ready (8 fresh frames) — the checks are correctly distinguished |
| Frozen picture (live track, no new frames) | `camera-feed` ready (first frame real); `camera-blank`, `face`, `phone` all FAILED with *"The camera picture is frozen — no new frames arrived…"* — **not** "no person"; run failed fast (3.6 s); raw stats showed `ready:true, fresh:false, reason:"same-frame"` |
| Freshness machinery | first frame `fresh:true`, repeat read `fresh:false` (not re-counted), gate closed after 1.4 s of no frames, reopened when frames resumed |
| Direct single-pass inference | 4/4 passes → exactly 1 face on the fixture; phone detector 0 false positives |

Even under this automation tab's mildly throttled timers the blank floor
(8 samples/3 s) was reached — the old code could not reach it at any speed.

### 3c. Not verified here (honest limits)

- **Real hardware camera**: permission is denied in this environment, so the
  all-clear path ran with a synthetic camera source and real model
  inference. Check on real hardware: consent → all 13 checks ready.
- **iOS/Safari**: `requestVideoFrameCallback` fallback (media-time advance)
  is code-covered but not browser-tested; exam mode already discourages iOS.
- The frozen verdict depends on frames genuinely ceasing to be presented;
  some virtual-camera drivers keep presenting identical frames — those are
  caught by the blank watcher (identical luma stats) rather than the
  freshness gate, which is still fail-closed.

## 4. Files changed

- `exam-monitor.js` — CONFIG (`precheckBlankSampleMs`, `frameFreshMs`),
  runtime frame tracking (rVFC/fallback, `camera.fresh()`, readiness-aware
  `frameStats`), single-flight detectors, concurrent observation loops,
  distinct verdicts.
- `app.js` — pre-check provider: `fresh: () => rt.camera.fresh()`.
- `tests/exam-monitor-tests.js` — new section L (+56 assertions).
- `index.html` + 42 sub-page HTML files — script pins (`exam-monitor.js?v=3`,
  `app.js?v=67`); `sw.js` — cache `aba-cache-v51`.
- `EXAM-SECURITY-TESTING.md` — §2 rows 3–5 note (v90 sampling behaviour).
- `docs/CAMERA-PRECHECK-FIX-v90.md` — this report.
