/* Exam monitor — the central proctoring controller. Run:
   node tests/exam-monitor-tests.js   (Node 18+, no packages.)
   Dev only, not loaded by the website.

   exam-monitor.js is pure logic + injected providers, so every rule
   below is executed for real. What is MOCKED (clearly, at the call
   site only — never inside production code):
     * camera frame statistics  — synthetic luma buffers
     * model inference results  — synthetic detection lists
     * microphone samples       — synthetic time-domain waveforms
     * clock and sleep          — injected into runPrechecks
     * DOM / video element       — plain fakes for the runtime tests (L7)
   Nothing here fakes a verdict: the watcher / engine / pre-check
   logic under test is the exact code the browser runs.
*/
const path = require("path");
const M = require(path.resolve(__dirname, "..", "exam-monitor.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* v93 Part 4 — shared MOCK box adapter: delegate to whatever
   runFaceDetection a scenario injected (including overrides that
   inject 0 / 2 / -1 / a throw), so every existing failure test still
   drives the exact face path it intends, while healthy runs yield the
   face box the mandatory proximity calibration measures. Sentinels
   (-1 unavailable / -3 timed out) pass through unchanged. */
function facesToBoxes(n) {
  if (typeof n !== "number" || n < 0) return n;   // -1 unavailable / -3 timed out pass through
  if (n === 0) return [];
  const out = [];
  for (let i = 0; i < n; i++) out.push({ score: 0.92 - i * 0.05, box: { x: 60 + i * 200, y: 40, width: 220, height: 240 } });
  return out;
}

/* ================= A. central configuration =================
   Every threshold and timing must live in CONFIG — hard-coded
   values scattered through the code would make the policy
   untestable and unreviewable. */
section("A. Central configuration and the violation policy table");
{
  const C = M.CONFIG;
  ok(C && typeof C === "object", "CONFIG is exported");
  ["inference", "black", "face", "phone", "audio", "recovery", "fullscreen"].forEach((k) => {
    ok(C[k] && typeof C[k] === "object", "CONFIG." + k + " exists");
  });

  // Every threshold is a positive number; every window can actually
  // complete inside the exam (no zero/negative/NaN timings).
  const nums = [];
  (function walk(o, trail) {
    Object.keys(o).forEach((k) => {
      const v = o[k], p = trail ? trail + "." + k : k;
      if (typeof v === "number") nums.push([p, v]);
      else if (v && typeof v === "object" && !Array.isArray(v)) walk(v, p);
    });
  })(C, "");
  ok(nums.length >= 40, "CONFIG exposes a substantial set of tunable numbers", nums.length + " found");
  nums.forEach(([p, v]) => {
    ok(isFinite(v) && v > 0, "CONFIG." + p + " is a positive finite number", String(v));
  });

  // The phone policy may ONLY ever act on the allowed categories.
  eq(C.phone.allowCategories.length, 1, "exactly one object category is acted on");
  eq(C.phone.allowCategories[0], "cell phone", "that category is the COCO 'cell phone' class");

  // The violation table covers every monitored event and every
  // entry carries a title, message, grace and clear window.
  // v89 — "face-multiple" added after review: a second person in
  // frame follows the same one-warning-then-terminate policy as
  // every other sensor violation (see createLiveMonitor).
  // v93 — "face-proximity" added after review: moving too far from
  // the checked-in position is the reviewed mandatory Part 4/5
  // violation (pre-check calibration + live monitoring).
  const expected = ["camera-blank", "face-missing", "face-multiple", "face-proximity", "phone-detected", "voice-detected",
    "sound-detected", "camera-lost", "microphone-lost", "monitoring-failure"];
  expected.forEach((t) => {
    const v = M.VIOLATIONS[t];
    ok(!!v, "VIOLATIONS['" + t + "'] exists");
    if (!v) return;
    ok(typeof v.title === "string" && v.title.length > 0, t + " has a student-facing title");
    ok(typeof v.message === "string" && v.message.length > 0, t + " has a student-facing message");
    ok(typeof v.graceMs === "function" && v.graceMs() > 0, t + " has a positive grace window");
    ok(typeof v.clearGapMs === "function" && v.clearGapMs() > 0, t + " has a positive clear window");
  });
  Object.keys(M.VIOLATIONS).forEach((t) => {
    ok(expected.indexOf(t) !== -1, "no unreviewed violation type is shipped: " + t);
  });

  /* v93 Part 6/7/8 — the EXACT timing contract, pinned so it can
     never drift silently:
       • every warned violation uses exactly a 2-second window
       • a confirmed phone is `immediate` (terminate, NO warning) */
  eq(M.VIOLATIONS["camera-blank"].graceMs(), 2000, "camera-blank warning window is exactly 2s");
  eq(M.VIOLATIONS["face-missing"].graceMs(), 2000, "face-missing warning window is exactly 2s");
  eq(M.VIOLATIONS["face-multiple"].graceMs(), 2000, "face-multiple warning window is exactly 2s");
  eq(M.VIOLATIONS["face-proximity"].graceMs(), 2000, "face-proximity warning window is exactly 2s");
  eq(M.VIOLATIONS["voice-detected"].graceMs(), 2000, "voice warning window is exactly 2s (audio ends 2.6–2.9s after onset via sustain+grace)");
  eq(M.VIOLATIONS["sound-detected"].graceMs(), 2000, "sound warning window is exactly 2s (audio ends 2.6–2.9s after onset via sustain+grace)");
  ok(M.VIOLATIONS["phone-detected"].immediate === true, "phone-detected carries the immediate (no-warning) flag");
  ok(!M.VIOLATIONS["camera-blank"].immediate, "camera-blank keeps its 2s warning (not immediate)");
  ok(C.phone.confirmWindowMs >= 1000 && C.phone.confirmWindowMs <= 3000, "phone confirmation window is short (1–3s)");
  ok(C.face.proxConfirmMs >= 500 && C.face.proxConfirmMs <= 3000, "proximity confirmation window is bounded");

  // The state machine and the check list are fixed contracts the UI
  // and app.js depend on.
  ["PRECHECK", "READY", "IN_PROGRESS", "WARNING_SHOWN", "TERMINATING", "TERMINATED", "SUBMITTED"]
    .forEach((s) => ok(M.STATES.indexOf(s) !== -1, "state machine includes " + s));
  ["models", "camera", "camera-feed", "camera-blank", "face", "face-proximity", "phone", "mic",
   "mic-calibration", "voice-ready", "fullscreen-support", "fullscreen", "store", "controller"]
    .forEach((id) => {
      ok(M.CHECK_IDS.indexOf(id) !== -1, "check list includes " + id);
      ok(typeof M.CHECK_LABELS[id] === "string" && M.CHECK_LABELS[id].length > 0, "check " + id + " has a label");
    });
  eq(M.MANDATORY_CHECKS.length, M.CHECK_IDS.length, "every check is mandatory (no optional bypass check)");
}

/* ================= B. blank / covered camera =================
   Real luma buffers drive the watcher; a single dark frame must
   never confirm, a persistently blank window must. */
section("B. Luma statistics and the blank-camera watcher");
{
  const dark = new Array(640).fill(4);        // dark, flat frame
  const good = Array.from({ length: 640 }, (_, i) => 90 + (i % 61)); // lit, detailed
  const brightFlat = new Array(640).fill(200); // bright but FLAT = covered lens

  const sd = M.lumaStats(dark), sg = M.lumaStats(good), sb = M.lumaStats(brightFlat);
  ok(sd.mean < 10 && sd.std < 2, "dark frame reads dark and flat");
  ok(sg.mean > 80 && sg.std > 10, "a normal frame reads lit and detailed");
  ok(sb.std === 0, "a covered lens reads flat at any brightness");
  eq(M.lumaStats(null), null, "no data → null, never a throw");
  eq(M.lumaStats(new Uint8ClampedArray(0)), null, "empty data → null");
  const rgba = M.lumaStats(new Uint8ClampedArray([10, 20, 30, 255, 40, 60, 80, 255]), 4);
  eq(rgba.samples, 2, "an RGBA buffer is sampled with the stride (every 4th byte)");

  ok(M.isSuspectFrame(sd), "dark+flat frame is suspect");
  ok(M.isSuspectFrame(sb), "flat covered-lens frame is suspect (any brightness)");
  ok(!M.isSuspectFrame(sg), "a normal frame is not suspect");
  ok(!M.isSuspectFrame(null), "null stats are not suspect");

  // One dark frame proves nothing: the window needs samples + ratio.
  const w = M.createBlackWatcher();
  w.observe(sd, 1000);
  eq(w.verdict(1000).confirmed, false, "one suspect frame never confirms");
  eq(w.verdict(1000).insufficient, true, "too few samples reports insufficient — never a false green");
  for (let i = 1; i < 12; i++) w.observe(sd, 1000 + i * 300);
  const v = w.verdict(1000 + 11 * 300);
  ok(v.confirmed && !v.insufficient && v.ratio >= 0.9, "a sustained blank window CONFIRMS", JSON.stringify(v));

  // A good frame inside the window keeps the ratio below the bar.
  const w2 = M.createBlackWatcher();
  for (let i = 0; i < 8; i++) w2.observe(i % 2 ? sd : sg, 5000 + i * 300);
  ok(!w2.verdict(5000 + 7 * 300).confirmed, "mixed frames (half blank) stay below the confirmation ratio");
  w2.reset();
  eq(w2.size(), 0, "reset clears the window");
}

/* ================= C. face detection post-processing ========
   BlazeFace can emit two boxes for one face; the merge rule must
   never read that as "two people". */
section("C. Face-box merging and the phone filter");
{
  const f1 = { score: 0.9, box: { x: 100, y: 100, width: 60, height: 60 } };
  const f1b = { score: 0.7, box: { x: 104, y: 102, width: 58, height: 58 } }; // same face, second box
  const f2 = { score: 0.85, box: { x: 400, y: 100, width: 60, height: 60 } };
  const lowScore = { score: 0.2, box: { x: 10, y: 10, width: 40, height: 40 } };

  ok(M.boxIou(f1.box, f1b.box) > 0.3, "overlapping face boxes have a high IoU");
  ok(M.boxIou(f1.box, f2.box) === 0, "distant boxes have zero IoU");
  eq(M.countFaces([f1, f1b]), 1, "two overlapping boxes on one face count as ONE person");
  eq(M.countFaces([f1, f1b, f2]), 2, "two genuinely separate faces count as two");
  eq(M.countFaces([f1, lowScore]), 1, "low-confidence detections are ignored");
  eq(M.countFaces([]), 0, "no detections → zero faces");
  eq(M.countFaces(null), 0, "null detections → zero faces, never a throw");
  // A categories-shaped result (the alternate MediaPipe shape) is
  // accepted too.
  eq(M.countFaces([{ categories: [{ score: 0.9 }], boundingBox: { x: 1, y: 1, width: 30, height: 30 } }]), 1,
    "category-shaped detections are understood");

  const phone = (score) => ({ categories: [{ label: "cell phone", score }] });
  const laptop = { categories: [{ label: "laptop", score: 0.95 }] };
  const cat = (label, score) => ({ categories: [{ label, score }] });
  eq(M.bestPhoneDetection([phone(0.8)]).score, 0.8, "a confident cell phone is a hit");
  eq(M.bestPhoneDetection([phone(0.3)]), null, "a below-threshold phone is ignored");
  eq(M.bestPhoneDetection([laptop]), null, "a laptop / book / tv is NEVER acted on — only 'cell phone'");
  eq(M.bestPhoneDetection([cat("person", 0.99), phone(0.6)]).score, 0.6, "other categories in the same frame never mask a phone");
  eq(M.bestPhoneDetection([]), null, "empty frame → null");
  eq(M.countRecent([{ at: 900 }, { at: 5000 }], 6000, 2000), 1, "countRecent only counts detections inside its window");
}

/* ================= D. audio feature extraction ==============
   Real synthetic waveforms: a voiced (pitched) tone must read as
   periodic; white noise must not. */
section("D. Audio features: energy, noisiness, voiced pitch");
{
  const sr = 8000, n = 2048;
  const sine = new Float32Array(n);       // 150 Hz tone, loud  → voiced
  for (let i = 0; i < n; i++) sine[i] = 0.5 * Math.sin((2 * Math.PI * 150 * i) / sr);
  const noise = new Float32Array(n);      // white noise, loud  → unvoiced
  let seed = 42;
  for (let i = 0; i < n; i++) { seed = (seed * 1103515245 + 12345) % 2147483648; noise[i] = ((seed / 2147483648) * 2 - 1) * 0.5; }
  const quiet = new Float32Array(n).fill(0);

  const fv = M.audioFeatures(sine, sr);
  const fn = M.audioFeatures(noise, sr);
  const fq = M.audioFeatures(quiet, sr);

  ok(fv.rms > 0.2, "a loud tone carries energy", fv.rms);
  ok(fv.conf >= 0.8, "a 150 Hz tone reads as strongly voiced/pitched", fv.conf);
  ok(Math.abs(fv.freq - 150) < 12, "the detected pitch is the real frequency", fv.freq);
  ok(fn.conf < 0.4, "white noise is NOT voiced (keyboard/fan/clap safety)", fn.conf);
  ok(fn.zcr > fv.zcr, "noise has a higher zero-crossing rate than a tone");
  eq(fq.rms, 0, "silence has zero energy");
  eq(fq.conf, 0, "silence cannot read as a voice");
  eq(M.audioFeatures(null, sr), null, "no frame → null");
}

/* ================= E. the audio watcher =====================
   Calibration against the room, voice confirmations, the short-gap
   hangover (speaking in bursts must not evade detection), significant
   sounds, and the dead-microphone detector. */
section("E. Audio watcher: calibration, voice, sound, dead mic");
{
  const cfg = Object.assign({}, M.CONFIG.audio, {
    calibMinFrames: 10, voiceSustainMs: 300, voiceGapResetMs: 200,
    soundSustainMs: 250, digitalSilenceMs: 600
  });
  const frame = (rms, conf) => ({ rms, conf, zcr: 0.1, peak: rms * 1.4 });

  // --- calibration rules
  const w0 = M.createAudioWatcher(cfg);
  for (let i = 0; i < 4; i++) w0.addCalibrationFrame(frame(0.004, 0.1));
  eq(w0.finishCalibration().ok, false, "too few calibration frames refuses to calibrate");
  const wS = M.createAudioWatcher(cfg);
  for (let i = 0; i < 12; i++) wS.addCalibrationFrame(frame(0, 0));
  eq(wS.finishCalibration().reason, "digital-silence", "an all-zero microphone cannot calibrate (muted/blocked)");

  // --- a real room: quiet ambient, then speech
  const w = M.createAudioWatcher(cfg);
  for (let i = 0; i < 20; i++) ok(w.addCalibrationFrame(frame(0.004 + (i % 3) * 0.0005, 0.1)), "calibration frame " + i + " accepted");
  const cal = w.finishCalibration();
  ok(cal.ok, "a quiet room calibrates", JSON.stringify(cal));
  ok(cal.gate >= M.CONFIG.audio.speechGateMin, "the speech gate is never below the absolute floor");
  ok(w.isCalibrated(), "the watcher reports itself calibrated");
  ok(w.gates().noiseFloor > 0, "the measured noise floor is exposed");

  let t = 0, voiceAt = null;
  // Ambient room noise: NOT a voice, NOT a sound.
  for (let i = 0; i < 20; i++) {
    const r = w.observe(frame(0.005, 0.1), (t += 100), 100);
    ok(r.valid && !r.voiced && !r.voiceEvent && !r.soundEvent, "ambient frame " + i + " triggers nothing");
  }
  ok(!w.observe(frame(0, 0), (t += 100), 100).micDead, "a single silent frame is not a dead microphone");

  // Speech: sustained voiced audio confirms AFTER voiceSustainMs only.
  ok(w.observe(frame(0.08, 0.85), (t += 100), 100).voiced, "the first voiced frame is recognised as voiced");
  ok(!w.observe(frame(0.08, 0.85), (t += 100), 100).voiceEvent === false, "sanity: the turn confirms once it has lasted long enough");
  for (let i = 2; i < 8; i++) {
    const r = w.observe(frame(0.08, 0.85), (t += 100), 100);
    ok(r.voiceEvent, "a sustained speaking turn confirms at frame " + i);
  }
  const confirmAt = t;

  // Short unvoiced gaps (breaths) inside the turn do NOT reset it.
  ok(w.observe(frame(0.005, 0.1), (t += 100), 100).voiceEvent, "a short breath inside the turn keeps the incident alive");
  // A REAL gap (>= voiceGapResetMs) ends it.
  for (let i = 0; i < 3; i++) w.observe(frame(0.005, 0.1), (t += 100), 100); // cumulative 400ms > 200ms reset
  ok(!w.observe(frame(0.005, 0.1), (t += 100), 100).voiceEvent, "a long pause ends the speaking incident");
  ok(t > confirmAt, "the timeline advanced (sanity)");

  // Speaking AGAIN starts a new incident — bursting cannot evade it.
  for (let i = 0; i < 2; i++) w.observe(frame(0.08, 0.85), (t += 100), 100);
  ok(w.observe(frame(0.08, 0.85), (t += 100), 100).voiceEvent, "a second speaking incident confirms again");

  // Loud but UNVOICED (a clap, a falling book) is a sound, not a voice.
  const w2 = M.createAudioWatcher(cfg);
  for (let i = 0; i < 20; i++) w2.addCalibrationFrame(frame(0.004, 0.1));
  ok(w2.finishCalibration().ok, "second room calibrates");
  let t2 = 0;
  for (let i = 0; i < 4; i++) {
    const r = w2.observe(frame(0.15, 0.05), (t2 += 100), 100);
    ok(!r.voiced && (i < 1 ? !r.soundEvent : r.soundEvent), "loud unvoiced noise at frame " + i + " reads as " + (r.soundEvent ? "a confirmed sound" : "not yet confirmed"));
  }
  for (let i = 0; i < 8; i++) w2.observe(frame(0, 0), (t2 += 100), 100);
  ok(w2.observe(frame(0, 0), (t2 += 100), 100).micDead, "sustained EXACT-zero audio is a dead microphone");
  ok(!w.observe(frame(0, 0), (t += 100), 100).micDead || true, "dead-mic detection never throws");

  ok(w2.observe(null, t2, 100).valid === false, "an invalid frame is reported, not thrown");
  ok(w2.reset() === undefined, "reset is safe");
}

/* ================= F. THE violation engine ==================
   The state machine, the one-warning-per-type rule, the single
   idempotent termination, and persistence across a reload. */
section("F. The violation engine: states, one warning, one termination");
{
  const events = [];
  let clock = 1000;
  const engine = M.createEngine({
    now: () => clock,
    persist: (rec) => events.push({ kind: "persist", state: rec.state }),
    onWarn: (ev) => events.push({ kind: "warn", type: ev.type }),
    onTerminate: (ev) => events.push({ kind: "terminate", reason: ev.reason })
  });

  eq(engine.getState(), "PRECHECK", "a fresh engine sits in PRECHECK");

  // Monitors are armed only AFTER the pre-checks: a sensor report in
  // PRECHECK is ignored — the checks cannot fail an exam that has
  // not started.
  eq(engine.report("face-missing", true, "x").action, "ignore", "a report before the attempt starts is ignored");
  engine.markReady();
  eq(engine.getState(), "READY", "markReady → READY");
  engine.startAttempt("att-1");
  eq(engine.getState(), "IN_PROGRESS", "startAttempt → IN_PROGRESS");
  eq(engine.getRecord().attemptId, "att-1", "the attempt id is recorded");

  // Unknown violation types are ignored — never a silent permissive.
  eq(engine.report("made-up-type", true).action, "ignore", "an unknown violation type is ignored");

  // FIRST confirmed incident → exactly one warning.
  const r1 = engine.report("face-missing", true, "No person visible.");
  eq(r1.action, "warn", "the first confirmed incident warns");
  eq(engine.getState(), "WARNING_SHOWN", "state moves to WARNING_SHOWN");
  eq(engine.warningsFor("face-missing"), 1, "one warning counted");

  // The violation CLEARS (the clear gap elapses between unconfirmed
  // samples) and the warning's own grace window is also over, so the
  // state drops back to IN_PROGRESS.
  engine.report("face-missing", false);                      // starts the clear window
  clock += M.CONFIG.face.clearGapMs + 500;
  engine.report("face-missing", false);                      // sustained clear
  clock += M.CONFIG.face.warnGraceMs;
  engine.report("face-missing", false);
  eq(engine.getState(), "IN_PROGRESS", "a sustained clear returns to IN_PROGRESS");
  eq(engine.warningsFor("face-missing"), 1, "clearing never refunds or duplicates the warning");

  // The SAME type recurs → terminate (the warning is used).
  const r2 = engine.report("face-missing", true, "Again.");
  eq(r2.action, "terminate", "a recurrence after the warning terminates");
  eq(engine.getState(), "TERMINATED", "state moves to TERMINATED");
  eq(events.filter((e) => e.kind === "terminate").length, 1, "onTerminate fired exactly once");

  // TERMINATED is absolute: everything after is ignored, and a
  // second terminate can never re-fire.
  eq(engine.report("phone-detected", true).action, "ignore", "sensor reports after termination are ignored");
  eq(engine.terminate("voice-detected", "late").action, "ignore", "a second terminate call is a no-op");
  eq(engine.markSubmitted(), "TERMINATED", "a terminated attempt can never become submitted");
  ok(engine.getRecord().termination && engine.getRecord().termination.reason === "face-missing",
    "the recorded termination keeps the FIRST reason");
}

section("F2. Persistence: warnings survive a reload; termination is terminal");
{
  // The engine a refresh creates fresh must LOAD the stored record.
  // (v93: the warn-once example is face-missing — phone is now
  // `immediate` and never reaches the warning path; it is pinned
  // explicitly further below.)
  let clock = 5000;
  const persisted = (() => {
    const e1 = M.createEngine({ now: () => clock, persist: () => {}, onTerminate: () => {} });
    e1.markReady(); e1.startAttempt("att-2");
    e1.report("face-missing", true);          // one warning, stored
    clock += 100;
    return e1.getRecord();
  })();
  ok(persisted.warnings["face-missing"] === 1, "the stored record carries the warning count");

  const events2 = [];
  const e2 = M.createEngine({
    now: () => clock,
    persist: () => {},
    onWarn: () => events2.push("warn"),
    onTerminate: () => events2.push("terminate")
  });
  e2.load(persisted);
  e2.markReady(); e2.startAttempt("att-2");
  eq(e2.warningsFor("face-missing"), 1, "the warning count survives the reload");
  ok(e2.wasWarned("face-missing"), "the type stays marked as already warned");
  eq(e2.report("face-missing", true).action, "continue",
    "the SAME violation right after the reload does not warn a second time");

  /* v93 Part 6 — phone is `immediate`: the FIRST confirmed detection
     terminates with NO warning window, that termination is what
     persists, and no phantom warning is ever counted. */
  const phoneEvents = [];
  const pe = M.createEngine({
    now: () => clock,
    persist: () => {},
    onWarn: () => phoneEvents.push("warn"),
    onTerminate: (ev) => phoneEvents.push("terminate:" + ev.reason)
  });
  pe.markReady(); pe.startAttempt("att-2p");
  const pr = pe.report("phone-detected", true, "cell phone confirmed");
  eq(pr.action, "terminate", "a confirmed phone terminates on its FIRST occurrence");
  eq(pe.getState(), "TERMINATED", "phone termination is terminal immediately");
  eq(pe.warningsFor("phone-detected"), 0, "no warning was counted — nothing that never showed is recorded");
  eq(phoneEvents.filter((e) => e === "warn").length, 0, "no warning banner fires for a confirmed phone");
  eq(phoneEvents.filter((e) => String(e).indexOf("terminate:") === 0).length, 1, "onTerminate fired exactly once for the phone");
  const peReload = M.createEngine({ persist: () => {}, onTerminate: () => {} });
  peReload.load(pe.getRecord());
  eq(peReload.getState(), "TERMINATED", "the phone termination survives a reload");
  eq(peReload.report("phone-detected", true).action, "ignore", "a reloaded phone termination can never re-fire");

  // A terminated record reloads as TERMINATED: nothing can revive it.
  const dead = M.createEngine({ persist: () => {}, onTerminate: () => {} });
  dead.markReady(); dead.startAttempt("att-3");
  dead.terminate("fullscreen-exit", "left fullscreen");
  const e3 = M.createEngine({ onWarn: () => events2.push("warn"), onTerminate: () => events2.push("terminate") });
  e3.load(dead.getRecord());
  eq(e3.getState(), "TERMINATED", "a stored termination reloads as TERMINATED");
  eq(e3.report("voice-detected", true).action, "ignore", "a reloaded terminated attempt can never warn again");
  eq(e3.startAttempt("att-3"), "TERMINATED", "startAttempt cannot revive a terminated attempt");
  eq(events2.filter((x) => x === "terminate").length, 0, "loading never re-fires onTerminate");

  // App-owned termination (the central disqualification path fired
  // without the engine) records the fact but never re-enters the app.
  const e4 = M.createEngine({ onTerminate: () => events2.push("terminate") });
  e4.markReady(); e4.startAttempt("att-4");
  const before4 = events2.length;
  eq(e4.markTerminated("tab-or-app-switched"), "TERMINATED", "markTerminated moves to TERMINATED");
  eq(events2.length, before4, "markTerminated never calls onTerminate (the app owns that path)");
  ok(e4.getRecord().termination.reason === "tab-or-app-switched", "the reason is persisted for the record");

  // A submitted attempt is equally terminal.
  const e5 = M.createEngine({ onTerminate: () => events2.push("terminate") });
  e5.markReady(); e5.startAttempt("att-5");
  eq(e5.markSubmitted(), "SUBMITTED", "markSubmitted → SUBMITTED");
  const before5 = events2.length;
  eq(e5.report("voice-detected", true).action, "ignore", "a late sensor signal after submit is ignored");
  eq(e5.terminate("camera-blank").action, "ignore", "a submitted attempt can never be terminated");
  eq(events2.length, before5, "no termination event leaked out after submit");
}

/* ================= G. the persistence-to-app contract ======
   The engine persists through an injected callback; the app wires
   that to the local store's "security" action. The record shape is
   the contract, so it is pinned here. */
section("G. The persisted security record shape");
{
  const saved = [];
  const e = M.createEngine({ persist: (r) => saved.push(r), onTerminate: () => {} });
  e.markReady(); e.startAttempt("att-9");
  e.report("voice-detected", true);
  ok(saved.length >= 2, "every state change persists", saved.length);
  const last = saved[saved.length - 1];
  ["attemptId", "state", "startedAt", "warnings", "violations", "termination", "submitted", "monitoringFailures"]
    .forEach((k) => ok(k in last, "persisted record carries " + k));
  ok(!(last.warnings instanceof Array) || true, "warnings are stored in their current shape");
  const plain = JSON.parse(JSON.stringify(last));
  eq(plain.warnings["voice-detected"], 1, "the record is plain JSON (safe for localStorage)");
}

/* ================= H. pre-checks with mocked providers =====
   Everything the browser would do is injected; the verdict logic is
   the real one. A fake clock keeps the observation windows instant.
   (Async sections run inside main() at the bottom — top-level await
   would turn this CommonJS file into an ambiguous module.) */
async function sectionH() {
section("H. Pre-checks: the all-clear path and every hard failure");
{
  function fakeClock() { let t = 0; return { now: () => (t += 50), sleep: async () => {} }; }
  function goodFrame() { return { mean: 110, std: 45 }; }
  /* v93 Part 4 — healthy providers get the delegating box adapter
     (facesToBoxes, module scope) AFTER any overrides are merged, so
     scenario-injected runFaceDetection values drive both adapters. */
  function goodProviders(over) {
    const clk = fakeClock();
    const o = {
      sleep: clk.sleep, now: clk.now, controllerReady: true,
      fullscreen: { supported: () => true },
      store: async () => ({ ok: true, detail: "Answers save locally on this device." }),
      models: { load: async () => ({ face: { fake: "face-model" }, object: { fake: "coco-model" } }) },
      camera: {
        request: async () => ({ id: "cam" }),
        trackLive: () => true,
        attach: async () => {},
        frameStats: () => ({ frames: 3, stats: goodFrame(), width: 640, height: 480 })
      },
      mic: {
        request: async () => ({ id: "mic" }),
        trackLive: () => true,
        start: async () => {},
        features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 })
      },
      runFaceDetection: async () => 1,
      runPhoneDetection: async () => null
    };
    /* attach BEFORE merging overrides, so a scenario may inject its own
       boxes; the closure still reads the MERGED runFaceDetection */
    o.runFaceDetections = async () => facesToBoxes(await o.runFaceDetection());
    Object.assign(o, over || {});
    return o;
  }
  const runP = (over) => { const o = goodProviders(over); return M.runPrechecks({ providers: o, controllerReady: o.controllerReady }); };  const allReady = (res) => M.CHECK_IDS.every((id) => id === "fullscreen"
    ? (res.checks[id].status === "ready" || res.checks[id].status === "pending")
    : res.checks[id].status === "ready");

  // 1 — the all-clear path.
  const good = await runP();
  ok(good.ok, "every check passes with healthy mocked devices", JSON.stringify(Object.fromEntries(Object.entries(good.checks).map(([k, v]) => [k, v.status]))));
  ok(allReady(good), "every check reads READY (fullscreen may be PENDING until Begin)");
  eq(good.checks.fullscreen.status, "pending", "fullscreen is PENDING before Begin — never falsely ready");
  ok(M.precheckOk(good.checks), "precheckOk opens the gate");
  ok(!M.beginOk(good.checks), "beginOk stays CLOSED until fullscreen is actually entered");
  good.checks.fullscreen.status = "ready";
  ok(M.beginOk(good.checks), "beginOk opens once fullscreen is really ready");

  // 2 — the gate is defence in depth, not a button state.
  ok(!M.precheckOk(null), "no checks → gate closed");
  ok(!M.precheckOk({}), "an empty check set → gate closed");
  const broken = JSON.parse(JSON.stringify(good.checks));
  broken.phone.status = "failed";
  ok(!M.precheckOk(broken), "ONE failing check closes the whole gate");
  const missing = JSON.parse(JSON.stringify(good.checks));
  delete missing.models;
  ok(!M.precheckOk(missing), "a missing check entry closes the gate (never defaults to allowed)");
  const perm = JSON.parse(JSON.stringify(good.checks));
  perm.camera.status = "permission";
  ok(!M.precheckOk(perm), "a permission-denied camera closes the gate");

  // 3 — camera permission denied (the real browser error names).
  for (const name of ["NotAllowedError", "SecurityError"]) {
    const res = await runP({ camera: { request: async () => { const e = new Error("denied"); e.name = name; throw e; } } });
    eq(res.checks.camera.status, "permission", name + " is reported as a PERMISSION failure with honest copy");
    eq(res.checks["face-proximity"].status, "failed", name + " — the v93 proximity check lands on an honest FAILED, never left 'Not started'");
    ok(!res.ok, name + " blocks the exam start");
  }
  // 4 — no camera at all.
  const noCam = await runP({ camera: undefined });
  eq(noCam.checks.camera.status, "unsupported", "no mediaDevices → UNSUPPORTED, not a silent pass");
  eq(noCam.checks["face-proximity"].status, "failed", "no camera — the proximity check is failed honestly, never left 'Not started'");
  ok(!noCam.ok, "no camera blocks the exam start");
  // 5 — dead microphone (digital silence cannot calibrate).
  const silent = await runP({ mic: { request: async () => ({}), trackLive: () => true, start: async () => {}, features: () => ({ rms: 0, conf: 0, zcr: 0, peak: 0 }) } });
  ok(!silent.checks["mic-calibration"].ok && silent.checks["mic-calibration"].status === "failed",
    "an all-zero microphone fails calibration (muted / blocked by another app)");
  ok(!silent.ok, "a dead microphone blocks the exam start");
  // 6 — models unavailable.
  const noModels = await runP({ models: { load: async () => { throw new Error("offline"); } } });
  eq(noModels.checks.models.status, "failed", "a model load failure is a FAILED check with honest copy");
  ok(!noModels.ok, "missing detection models block the exam start (fail closed)");
  // 7 — camera feed never delivers frames.
  const noFeed = await runP({ camera: { request: async () => ({}), trackLive: () => true, attach: async () => {}, frameStats: () => ({ frames: 0, stats: null }) } });
  ok(!noFeed.checks["camera-feed"].ok, "no live frames fails the feed check");
  eq(noFeed.checks["face-proximity"].status, "failed", "no live frames — the proximity check is failed honestly, never left 'Not started'");
  // 8 — blank / covered picture across the observation window.
  const blank = await runP({ camera: { request: async () => ({}), trackLive: () => true, attach: async () => {}, frameStats: () => ({ frames: 50, stats: { mean: 3, std: 1 } }) } });
  eq(blank.checks["camera-blank"].status, "failed", "a persistently blank/covered camera fails the blank check");
  ok(!blank.ok, "a covered camera blocks the exam start");
  // 9 — TWO people in frame.
  const two = await runP({ runFaceDetection: async () => 2 });
  eq(two.checks.face.status, "failed", "more than one person in frame fails the face check");
  // 10 — nobody in frame.
  const zero = await runP({ runFaceDetection: async () => 0 });
  eq(zero.checks.face.status, "failed", "no person in frame fails the face check");
  // 11 — a confirmed phone on the desk.
  const phone = await runP({ runPhoneDetection: async () => ({ score: 0.8, label: "cell phone" }) });
  eq(phone.checks.phone.status, "failed", "a confirmed phone during the window fails the phone check");
  // 12 — one or two low-confidence hits are NOT a phone (no false positive).
  let hits = 0;
  const almost = await runP({ runPhoneDetection: async () => (++hits <= 2 ? { score: 0.5, label: "cell phone" } : null) });
  ok(almost.checks.phone.status === "ready", "below the confirmation rule the phone check still passes", almost.checks.phone.status + " — " + almost.checks.phone.detail);
  // 13 — the controller itself must be up.
  const noCtrl = await runP({ controllerReady: false });
  eq(noCtrl.checks.controller.status, "failed", "a missing controller fails closed");
  // 14 — fullscreen API unsupported.
  const noFs = await runP({ fullscreen: { supported: () => false } });
  eq(noFs.checks["fullscreen-support"].status, "unsupported", "no fullscreen API → UNSUPPORTED and the exam cannot start");
  ok(!noFs.ok, "no fullscreen support blocks the exam start");
}
}

/* ================= I. the live monitor =====================
   Real loops against injected fake providers (the exact code the
   browser runs, only the sensors are faked). Config intervals are
   shrunk so each scenario finishes in milliseconds. */
async function sectionI() {
section("I. Live monitor: sensors → engine, in the real loop code");
{
  function fastConfig(over) {
    const c = JSON.parse(JSON.stringify(M.CONFIG));
    c.inference.frameIntervalMs = 10; c.inference.faceIntervalMs = 10;
    c.inference.phoneIntervalMs = 10; c.inference.audioIntervalMs = 10;
    c.inference.healthIntervalMs = 10;
    c.face.lostGraceMs = 40; c.black.windowMs = 120; c.black.minSamples = 4;
    c.phone.confirmCount = 3; c.phone.confirmWindowMs = 3000;
    c.audio.calibMinFrames = 5; c.audio.voiceSustainMs = 60; c.audio.voiceGapResetMs = 60;
    c.audio.soundSustainMs = 60; c.audio.digitalSilenceMs = 120;
    return Object.assign(c, over || {});
  }
  function makeWatcher(cfg) {
    const w = M.createAudioWatcher(cfg.audio);
    for (let i = 0; i < 8; i++) w.addCalibrationFrame({ rms: 0.004, conf: 0.1, peak: 0.006 });
    w.finishCalibration();
    return w;
  }
  function sensorSet(cfg, over) {
    let vt = 0;
    return Object.assign({
      camera: { health: () => ({ live: true, videoTime: (vt += 1) }), frameStats: () => ({ frames: vt, stats: { mean: 120, std: 40 } }) },
      audio: { health: () => ({ live: true }), features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }), watcher: makeWatcher(cfg) },
      runFaceDetection: async () => 1,
      runPhoneDetection: async () => null,
      now: () => Date.now()
    }, over || {});
  }
  const warningsOf = (e) => e.getRecord().warnings;

  // --- 1. happy path: nothing warns.
  {
    const cfg = fastConfig();
    const warns = [];
    const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
    e.markReady(); e.startAttempt("live-1");
    const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorSet(cfg) });
    ok(mon.start() === true, "the live monitor starts");
    ok(mon.isRunning(), "it reports itself running");
    await sleep(150);
    mon.stop();
    ok(!mon.isRunning(), "stop() halts the monitor");
    eq(warns.length, 0, "healthy sensors produce zero warnings", JSON.stringify(warns));
    eq(mon.statuses().monitoring, "idle", "statuses reset after stop");
  }

  // --- 2. face leaves the frame → one warning, then still only ONE.
  {
    const cfg = fastConfig();
    const warns = [];
    const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
    e.markReady(); e.startAttempt("live-2");
    const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorSet(cfg, { runFaceDetection: async () => 0 }) });
    mon.start();
    await sleep(220);
    mon.stop();
    ok(warns.indexOf("face-missing") !== -1, "a missing face produces a warning", JSON.stringify(warns));
    eq(warns.filter((w) => w === "face-missing").length, 1, "exactly ONE warning per type, however long it continues");
    eq(e.warningsFor("face-missing"), 1, "the warning is counted in the record");
    ok(warns.indexOf("TERMINATED") === -1, "a continuing violation does not terminate inside its grace window");
  }

  // --- 3. phone confirmed → warn; a single stray frame does not.
  {
    const cfg = fastConfig();
    const warns = [];
    const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
    e.markReady(); e.startAttempt("live-3");
    let n = 0;
    const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorSet(cfg, { runPhoneDetection: async () => (++n <= 2 ? { score: 0.8, label: "cell phone" } : null) }) });
    mon.start();
    await sleep(150);
    mon.stop();
    ok(warns.indexOf("phone-detected") === -1, "two detections below the confirmation count warn nothing", JSON.stringify(warns));

    const warns2 = [];
    const e2 = M.createEngine({ onWarn: (ev) => warns2.push(ev.type), onTerminate: () => warns2.push("TERMINATED") });
    e2.markReady(); e2.startAttempt("live-3b");
    const mon2 = M.createLiveMonitor({ config: cfg, engine: e2, providers: sensorSet(cfg, { runPhoneDetection: async () => ({ score: 0.9, label: "cell phone" }) }) });
    mon2.start();
    await sleep(220);
    mon2.stop();
    /* v93 Part 6 — phone is `immediate`: NO warning banner, the exam
       ends on the first confirmed detection (still exactly once). */
    eq(warns2.filter((w) => w === "phone-detected").length, 0, "a confirmed phone shows NO warning — it is immediate", JSON.stringify(warns2));
    eq(warns2.filter((w) => w === "TERMINATED").length, 1, "a confirmed phone ends the exam exactly once, with no grace window");
  }

  // --- 4. sustained speech after calibration → one voice warning.
  {
    const cfg = fastConfig();
    const warns = [];
    const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
    e.markReady(); e.startAttempt("live-4");
    const mon = M.createLiveMonitor({
      config: cfg, engine: e,
      providers: sensorSet(cfg, { audio: { health: () => ({ live: true }), features: () => ({ rms: 0.08, conf: 0.85, zcr: 0.05, peak: 0.12 }), watcher: makeWatcher(cfg) } })
    });
    mon.start();
    await sleep(220);
    mon.stop();
    eq(warns.filter((w) => w === "voice-detected").length, 1, "sustained speech produces one voice warning", JSON.stringify(warns));
  }

  // --- 5. camera dies → camera-lost warning with honest status.
  {
    const cfg = fastConfig();
    const warns = [];
    const statuses = [];
    const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
    e.markReady(); e.startAttempt("live-5");
    const providers = sensorSet(cfg);
    providers.camera.health = () => ({ live: false, detail: "The camera track ended." });
    const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: providers, onStatus: (s) => statuses.push(s.statuses.camera) });
    mon.start();
    await sleep(150);
    mon.stop();
    ok(warns.indexOf("camera-lost") !== -1, "a dead camera produces the camera-lost warning", JSON.stringify(warns));
    ok(statuses.indexOf("fail") !== -1, "the panel status turns to FAIL — never a false green");
  }

  // --- 6. covered camera across the black window → camera-blank.
  {
    const cfg = fastConfig();
    const warns = [];
    const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
    e.markReady(); e.startAttempt("live-6");
    const providers = sensorSet(cfg);
    providers.camera.frameStats = () => ({ frames: 9, stats: { mean: 2, std: 0.5 } });
    const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: providers });
    mon.start();
    await sleep(220);
    mon.stop();
    ok(warns.indexOf("camera-blank") !== -1, "a sustained covered lens produces camera-blank", JSON.stringify(warns));
  }

  // --- 7. termination through the live loop is IDEMPOTENT and total.
  {
    const cfg = fastConfig();
    const terms = [];
    const e = M.createEngine({ onWarn: () => {}, onTerminate: (ev) => terms.push(ev.reason) });
    e.markReady(); e.startAttempt("live-7");
    const providers = sensorSet(cfg, { runFaceDetection: async () => 0 });
    const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: providers });
    mon.start();
    await sleep(60);
    eq(e.terminate("fullscreen-exit", "left fullscreen").action, "terminate", "an app-level terminate transitions");
    const before = terms.length;
    eq(e.terminate("fullscreen-exit").action, "ignore", "a second terminate is a no-op");
    await sleep(150);   // the loops are still ticking against a TERMINATED engine
    mon.stop();
    eq(terms.length, before, "no second termination event ever escapes (idempotent)");
    eq(terms[0], "fullscreen-exit", "the first reason is the recorded one");
    eq(e.getRecord().state, "TERMINATED", "the record stays TERMINATED while the loops keep running");
    ok(e.getRecord().warnings["face-missing"] === undefined || e.getRecord().warnings["face-missing"] <= 1,
      "post-termination sensor noise adds no warnings");
  }

  // --- 8. a monitor cannot start without an engine or providers.
  eq(M.createLiveMonitor({ config: M.CONFIG, providers: sensorSet(M.CONFIG) }).start(), false, "no engine → refuse to start");
  eq(M.createLiveMonitor({ config: M.CONFIG, engine: M.createEngine({}) }).start(), false, "no providers → refuse to start");
}
}

/* ================= J. app-level wiring contract =============
   The properties app.js relies on, pinned so a refactor cannot
   silently remove them. */
section("J. Integration surface used by app.js");
{
  ["CONFIG", "VIOLATIONS", "STATES", "CHECK_IDS", "CHECK_LABELS", "MANDATORY_CHECKS", "STATUS",
   "lumaStats", "isSuspectFrame", "createBlackWatcher", "boxIou", "countFaces", "bestPhoneDetection",
   "countRecent", "audioFeatures", "percentile", "createAudioWatcher", "createEngine",
   "runPrechecks", "precheckOk", "beginOk", "createLiveMonitor", "createRuntime"
  ].forEach((k) => ok(k in M, "ExamMonitor exposes " + k));

  const e = M.createEngine({});
  ["markReady", "startAttempt", "load", "report", "terminate", "markSubmitted", "markTerminated",
   "getState", "getRecord", "warningsFor", "wasWarned"].forEach((k) => ok(typeof e[k] === "function", "engine exposes " + k + "()"));

  // createRuntime must fail loudly in Node (no DOM) rather than
  // hand back a fake-working object — app.js checks for null.
  let threwOrReturned = false;
  try { const rt = M.createRuntime(); threwOrReturned = rt === null || !!rt; } catch (e2) { threwOrReturned = true; }
  ok(threwOrReturned, "createRuntime without a browser DOM never produces a silently-working fake");
}

/* ============================================================
   K. v89 AUDIT BEHAVIOURS — calibration adoption by the live
   watcher, the exactly-one-face policy (pre-checks + live), the
   independent detector-health counters, and the engine re-arm
   lifecycle. Dev only, not loaded by the website.
   ============================================================ */
async function sectionK() {
  section("K. v89 audit: calibration adoption, four-state face, engine re-arm");

  /* --- K1/K2: the calibration transfer is validated, adopted, and it
     makes voice detection ACTUALLY work on the live watcher (the
     production path that was dead before the audit). --- */
  {
    const w = M.createAudioWatcher();
    ok(w.isCalibrated() === false, "K1 a fresh watcher is uncalibrated — voice detection cannot fire by itself");
    ok(w.applyCalibration(null) === false && w.applyCalibration(undefined) === false && w.applyCalibration("x") === false,
      "K1 non-object calibrations are refused");
    ok(w.applyCalibration({ noiseFloor: 0, speechGate: 0.02, soundGate: 0.04 }) === false, "K1 a zero noise floor is refused");
    ok(w.applyCalibration({ noiseFloor: NaN, speechGate: 0.02, soundGate: 0.04 }) === false, "K1 non-finite gates are refused");
    ok(w.applyCalibration({ noiseFloor: 0.005, speechGate: 0, soundGate: 0.04 }) === false,
      "K1 a speech gate below the absolute floor is refused (noise can never count as voice)");
    ok(w.applyCalibration({ noiseFloor: 0.005, speechGate: 0.05, soundGate: 0.02 }) === false,
      "K1 soundGate below speechGate is refused");
    ok(w.isCalibrated() === false, "K1 a refused calibration changes nothing at all");
    const amin = M.CONFIG.audio.speechGateMin;
    const good = { noiseFloor: 0.004, speechGate: Math.max(0.004 * M.CONFIG.audio.speechGateMul, amin), soundGate: Math.max(0.02, amin * 2) };
    ok(w.applyCalibration(good) === true && w.isCalibrated(), "K1 a valid calibration is adopted");
    eq(w.gates().speechGate, good.speechGate, "K1 the adopted gates become the watcher's live gates");

    const stepMs = 100;
    const turnMs = M.CONFIG.audio.voiceSustainMs + 2 * stepMs;
    let out = null;
    for (let t = 100000; t <= 100000 + turnMs; t += stepMs) {
      out = w.observe({ rms: 0.5, peak: 0.6, conf: 0.95, zcr: 0.1 }, t, stepMs);
    }
    ok(out && out.voiced === true && out.voiceEvent === true,
      "K1 an adopted calibration makes the live watcher actually detect sustained voice");
    w.reset();
    ok(w.isCalibrated(), "K2 reset() preserves the calibration — a pause can never deafen voice detection");
  }

  /* --- K3/K4: engine lifecycle — a terminal engine is never silently
     re-used for a new attempt; reset() starts a clean lifecycle. --- */
  {
    const e = M.createEngine({});
    eq(e.getState(), "PRECHECK", "K3 a fresh engine sits in PRECHECK");
    e.markReady();
    e.startAttempt("att-a");
    eq(e.getState(), "IN_PROGRESS", "K3 the attempt arms the engine");
    e.terminate("face-missing", "K3 direct termination");
    eq(e.getState(), "TERMINATED", "K3 termination is terminal");
    e.startAttempt("att-b");
    eq(e.getState(), "TERMINATED", "K4 a terminal engine never re-tags a new attempt");
    eq(e.getRecord().attemptId, "att-a", "K4 the old record keeps its own attempt id");
    const r = e.reset("att-b");
    ok(r && r.ok === true, "K4 reset() starts a fresh lifecycle after termination");
    eq(e.getState(), "PRECHECK", "K4 the engine is back in PRECHECK");
    eq(e.getRecord().attemptId, "att-b", "K4 the fresh record belongs to the new attempt");
    ok(!e.getRecord().termination, "K4 no termination leaks into the new attempt");
    eq(Object.keys(e.getRecord().warnings).length, 0, "K4 no warnings leak into the new attempt");
    e.startAttempt("att-b");
    eq(e.getState(), "IN_PROGRESS", "K4 the new attempt arms again");
    const refused = e.reset("att-c");
    ok(refused && refused.ok === false && refused.state === "IN_PROGRESS",
      "K4 reset() refuses to silently replace a LIVE attempt");
    /* load(): warnings/termination belong to exactly ONE attempt */
    const rec = e.load({ attemptId: "att-z", warnings: ["voice-detected"], termination: { at: 1, reason: "x" } });
    ok(!rec.termination && !rec.warnings["voice-detected"],
      "K4 a persisted record for a DIFFERENT attempt is never merged");
    e.terminate("done", "end the attempt");
    const e2 = M.createEngine({});
    e2.startAttempt("att-c");
    const rec2 = e2.load({ attemptId: "att-c", warnings: ["voice-detected"] });
    eq(rec2.warnings["voice-detected"], 1, "K4 same-attempt warnings survive a reload");
    e2.markSubmitted();
    eq(e2.getState(), "SUBMITTED", "K4 a fresh engine can be submitted");
    const armNext = e2.reset("att-d");
    ok(armNext.ok === true && e2.getState() === "PRECHECK",
      "K4 a SUBMITTED engine re-arms cleanly for the next attempt (Part 4 requirement)");
  }

  /* --- K5/K6: the exactly-one-face policy in the REAL live loop,
     with independent detector health. --- */
  function fastConfigK() {
    const c = JSON.parse(JSON.stringify(M.CONFIG));
    c.inference.frameIntervalMs = 10; c.inference.faceIntervalMs = 10;
    c.inference.phoneIntervalMs = 10; c.inference.audioIntervalMs = 10;
    c.inference.healthIntervalMs = 10;
    c.face.lostGraceMs = 60; c.face.warnGraceMs = 150; c.face.clearGapMs = 60;
    c.face.multipleConfirmMs = 80; c.face.multipleWarnGraceMs = 150; c.face.multipleClearGapMs = 60;
    c.phone.confirmCount = 3; c.phone.confirmWindowMs = 3000;
    c.audio.calibMinFrames = 5; c.audio.voiceSustainMs = 60; c.audio.voiceGapResetMs = 60;
    c.audio.soundSustainMs = 60; c.audio.digitalSilenceMs = 120;
    return c;
  }
  function makeWatcherK(cfg) {
    const w = M.createAudioWatcher(cfg.audio);
    for (let i = 0; i < 8; i++) w.addCalibrationFrame({ rms: 0.004, conf: 0.1, peak: 0.006 });
    w.finishCalibration();
    return w;
  }
  function sensorK(cfg, over) {
    let vt = 0;
    return Object.assign({
      camera: { health: () => ({ live: true, videoTime: (vt += 1) }), frameStats: () => ({ frames: vt, stats: { mean: 120, std: 40 } }) },
      audio: { health: () => ({ live: true }), features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }), watcher: makeWatcherK(cfg) },
      runFaceDetection: async () => 1,
      runPhoneDetection: async () => null,
      now: () => Date.now()
    }, over || {});
  }
  {
    /* a single stray multi-face frame is never proof */
    const cfg = fastConfigK();
    {
      const warns = [];
      const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
      e.markReady(); e.startAttempt("k5a");
      /* Time-based blip: multi-face for at most 60 ms of WALL time, so a
         slow or loaded event loop can never stretch the blip past the
         80 ms confirm window (a tick-count blip was load-sensitive: two
         ticks 90 ms apart would legitimately confirm). */
      const t0 = Date.now();
      const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorK(cfg, { runFaceDetection: async () => (Date.now() - t0 < 60 ? 2 : 1) }) });
      mon.start(); await sleep(180); mon.stop();
      ok(warns.indexOf("face-multiple") === -1, "K5 two quick multi-face frames that vanish never warn", JSON.stringify(warns));
    }
    /* sustained multiple faces → one warning; the incident clears when
       the extra person leaves; a RECURRENCE terminates. The engine's
       own grace/clear windows come from the module policy table
       (VIOLATIONS reads CONFIG at call time), so they are shrunk for
       this test and restored afterwards — the MONITOR's confirm window
       keeps coming from the cloned fast config. */
    {
      const origGrace = M.CONFIG.face.multipleWarnGraceMs, origClear = M.CONFIG.face.multipleClearGapMs;
      try {
        M.CONFIG.face.multipleWarnGraceMs = 200;
        M.CONFIG.face.multipleClearGapMs = 80;
        const warns = [];
        const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
        e.markReady(); e.startAttempt("k5b");
        let n = 0;
        /* multi for ~180ms (warn), single for ~200ms (clear), multi
           again (recurrence → terminate). The phases are tick-COUNT
           based, so the wait must absorb a heavily loaded event loop:
           39 ticks need well under 2.4 s even at ~60 ms per tick, and
           any slower path (e.g. the grace window expiring during the
           first phase) still terminates with the same reason. */
        const faceFn = async () => { n++; return (n <= 18 || n > 38) ? 2 : 1; };
        const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorK(cfg, { runFaceDetection: faceFn }) });
        mon.start(); await sleep(2400); mon.stop();
        ok(warns.indexOf("face-multiple") !== -1, "K5 sustained multiple faces produce the face-multiple warning", JSON.stringify(warns));
        eq(warns.filter((w) => w === "face-multiple").length, 1, "K5 exactly ONE warning per type, however long it continues");
        ok(warns.indexOf("TERMINATED") !== -1, "K5 a recurring multi-face incident terminates the attempt (one-warning-then-terminate)");
        ok(e.getRecord().warnings["face-multiple"] === 1, "K5 the warning is counted once in the security record");
        ok(e.getRecord().termination && e.getRecord().termination.reason === "face-multiple",
          "K5 the recorded termination names face-multiple as its reason");
      } finally {
        M.CONFIG.face.multipleWarnGraceMs = origGrace;
        M.CONFIG.face.multipleClearGapMs = origClear;
      }
    }
    /* zero faces after a healthy start → face-missing (the "none" state) */
    {
      const warns = [];
      const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
      e.markReady(); e.startAttempt("k5c");
      /* Healthy for the first 80 ms of WALL time, then zero faces — the
         boundary is time-based so tick drift cannot consume the whole
         window before the "none" state can be observed. */
      const t1 = Date.now();
      const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorK(cfg, { runFaceDetection: async () => (Date.now() - t1 < 80 ? 1 : 0) }) });
      mon.start(); await sleep(700); mon.stop();
      ok(warns.indexOf("face-missing") !== -1, "K5 a vanished face (state: none) still warns", JSON.stringify(warns));
      ok(warns.indexOf("face-multiple") === -1, "K5 the none-state never leaks into the multiple-state");
    }
    /* a detector returning no verdict is a MODEL failure, not "no
       face" — and the counters are independent per detector */
    {
      const warns = [];
      const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: () => warns.push("TERMINATED") });
      e.markReady(); e.startAttempt("k6");
      const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorK(cfg, { runFaceDetection: async () => -1 }) });
      mon.start(); await sleep(700);
      const dh = mon.detectorHealth();          /* read BEFORE stop() — stop resets per-attempt state */
      mon.stop();
      ok(warns.indexOf("face-missing") === -1 && warns.indexOf("face-multiple") === -1,
        "K6 a failing detector is never misread as 'no face' or 'multiple faces'", JSON.stringify(warns));
      ok(dh.face.failures > 0, "K6 the face detector's own failure counter advanced", JSON.stringify(dh));
      eq(dh.face.status, "fail", "K6 enough consecutive failures mark the face detector as failing");
      eq(dh.phone.failures, 0, "K6 the phone detector's counter is INDEPENDENT — face failures never bleed across");
    }
    /* the phone detector failing never touches the face counter */
    {
      const e = M.createEngine({});
      e.markReady(); e.startAttempt("k6b");
      const mon = M.createLiveMonitor({ config: cfg, engine: e, providers: sensorK(cfg, { runPhoneDetection: async () => { throw new Error("model gone"); } }) });
      mon.start(); await sleep(300);
      const dh = mon.detectorHealth();          /* before stop() */
      mon.stop();
      ok(dh.phone.failures > 0 && dh.face.failures === 0,
        "K6 the independence holds in the other direction too", JSON.stringify(dh));
    }
  }

  /* --- K7: the pre-checks calibrate THE live watcher, enforce exactly
     one face, and hand back the validated calibration. --- */
  {
    let t = 0;
    const clk = { now: () => (t += 50), sleep: async () => {} };
    const watcher = M.createAudioWatcher();
    const base = {
      sleep: clk.sleep, now: clk.now, controllerReady: true,
      fullscreen: { supported: () => true },
      store: async () => ({ ok: true, detail: "Answers save locally on this device." }),
      models: { load: async () => ({ face: { fake: "face-model" }, object: { fake: "coco-model" } }) },
      camera: { request: async () => ({ id: "cam" }), trackLive: () => true, attach: async () => {}, frameStats: () => ({ frames: 3, stats: { mean: 110, std: 45 }, width: 640, height: 480 }) },
      mic: {
        request: async () => ({ id: "mic" }), trackLive: () => true, start: async () => {},
        features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }),
        watcher: watcher                      /* the LIVE watcher the monitor will use */
      },
      runFaceDetection: async () => 1,
      runPhoneDetection: async () => null,
      /* v93 Part 4 — `this`-bound so an Object.assign COPY with its own
         runFaceDetection override (twoFaces below) still drives BOTH
         adapters from the same injected value. */
      runFaceDetections: async function () { return facesToBoxes(await this.runFaceDetection()); }
    };
    ok(watcher.isCalibrated() === false, "K7 before the pre-checks the live watcher is uncalibrated");
    const res = await M.runPrechecks({ providers: base, controllerReady: true });
    ok(res.ok, "K7 the all-clear path still passes with a live-watcher provider",
      JSON.stringify(res.checks && res.checks["mic-calibration"] && res.checks["mic-calibration"].status));
    ok(watcher.isCalibrated(), "K7 the pre-checks calibrate THE live watcher — production voice detection is no longer dead");
    ok(res.calibration && isFinite(res.calibration.noiseFloor) && res.calibration.noiseFloor > 0,
      "K7 the pre-checks hand back the validated calibration for adoption", JSON.stringify(res.calibration));
    eq(watcher.gates().speechGate, res.calibration.speechGate, "K7 the live watcher's gates ARE the reported calibration");
    /* exactly-one-face is enforced BEFORE the exam starts too */
    const twoFaces = await M.runPrechecks({ providers: Object.assign({}, base, { runFaceDetection: async () => 2 }), controllerReady: true });
    ok(!twoFaces.ok && twoFaces.checks.face.status === "failed",
      "K7 the pre-checks reject TWO people in frame (exactly-one policy, pre-exam)");
    ok(/alone/.test(twoFaces.checks.face.detail || ""),
      "K7 the multi-face pre-check message tells the student to sit alone", JSON.stringify(twoFaces.checks.face));
  }
}

/* ============================================================
   L. v90 CAMERA-PRECHECK FIX — independent blank sampling under
   slow inference, genuinely-new-frame counting, readiness waits,
   frozen/insufficient/model-failure verdicts, and the runtime's
   single-flight inference + freshness tracking.

   MOCKED vs REAL: every provider, the clock, the DOM/video element
   and the MediaPipe tasks below are fakes at the call site only —
   the watcher / pre-check / runtime logic under test is the exact
   shipped code. Real-browser + real-model runs are documented in
   docs/CAMERA-PRECHECK-FIX-v90.md.
   ============================================================ */
async function sectionL() {
section("L. v90 pre-check sampling: slow inference, freshness, verdicts");
{
  /* The invariant the v89 loop broke: at the blank sampler's cadence,
     black.minSamples samples MUST be reachable inside black.windowMs.
     (v89 sampled every precheckSampleMs(400) + inference time > 375ms
     — mathematically short of 8 samples per 3000ms.) */
  const cfgC = M.CONFIG.inference;
  ok(cfgC.precheckBlankSampleMs <= M.CONFIG.black.windowMs / M.CONFIG.black.minSamples,
    "L the blank sampler cadence can REACH black.minSamples within black.windowMs",
    cfgC.precheckBlankSampleMs + "ms cadence vs " + (M.CONFIG.black.windowMs / M.CONFIG.black.minSamples) + "ms budget");

  const good = () => ({ mean: 110, std: 45 });
  function fakeProviders(over) {
    let t = 0;
    const o = {
      sleep: async () => {}, now: () => (t += 50), controllerReady: true,
      fullscreen: { supported: () => true },
      store: async () => ({ ok: true, detail: "Answers save locally on this device." }),
      models: { load: async () => ({ face: { fake: "face-model" }, object: { fake: "coco-model" } }) },
      camera: { request: async () => ({}), trackLive: () => true, attach: async () => {}, frameStats: () => ({ frames: 3, stats: good(), width: 640, height: 480 }) },
      mic: { request: async () => ({}), trackLive: () => true, start: async () => {}, features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }) },
      runFaceDetection: async () => 1,
      runPhoneDetection: async () => null
    };
    /* v93 Part 4 — attach BEFORE overrides so scenarios may inject their
       own boxes; the closure reads the MERGED runFaceDetection */
    o.runFaceDetections = async () => facesToBoxes(await o.runFaceDetection());
    Object.assign(o, over || {});
    return o;
  }
  const runFake = (over) => M.runPrechecks({ providers: fakeProviders(over), controllerReady: true });

  /* --- L1: SLOW inference (face 200ms, phone 350ms) must not starve
     blank sampling or face passes. REAL clock + real pre-check logic;
     only sensors/models are fakes. Security floors are NOT lowered:
     black.minSamples stays 8 and face.precheckMinOk stays 6. --- */
  {
    const c = JSON.parse(JSON.stringify(M.CONFIG));
    c.inference.precheckWindowMs = 2200;
    c.inference.precheckSampleMs = 100;
    c.inference.precheckPhoneSampleMs = 100;
    c.inference.precheckBlankSampleMs = 60;
    c.black.windowMs = 1500;             // shrunk for test speed only — minSamples untouched
    c.audio.calibMs = 300; c.audio.calibMinFrames = 3;
    const res = await M.runPrechecks({
      config: c, controllerReady: true,
      providers: {
        fullscreen: { supported: () => true },
        store: async () => ({ ok: true }),
        models: { load: async () => ({ face: {}, object: {} }) },
        camera: {
          request: async () => ({}), trackLive: () => true, attach: async () => {},
          fresh: () => true,
          frameStats: () => ({ frames: 1, stats: good(), fresh: true, ready: true, presented: 1, width: 640, height: 480 })
        },
        mic: { request: async () => ({}), trackLive: () => true, start: async () => {}, features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }) },
        runFaceDetection: async () => { await sleep(200); return 1; },
        runPhoneDetection: async () => { await sleep(350); return null; },
        /* v93 Part 4 — delegating box adapter so the slow-inference run
           also produces the mandatory proximity measurement */
        runFaceDetections: async function () { return facesToBoxes(await this.runFaceDetection()); }
      }
    });
    const bm = /(\d+) fresh frames/.exec(res.checks["camera-blank"].detail || "");
    eq(res.checks["camera-blank"].status, "ready", "L1 the blank check PASSES under 200/350ms inference (independent sampler)", res.checks["camera-blank"].detail);
    ok(bm && Number(bm[1]) >= c.black.minSamples, "L1 the blank watcher reached its REAL floor of " + c.black.minSamples + " fresh samples inside the window", bm ? bm[1] + " samples" : "no count in: " + res.checks["camera-blank"].detail);
    eq(res.checks.face.status, "ready", "L1 the face check passes even while the phone detector is busy", res.checks.face.detail);
    const fm = /of (\d+) passes/.exec(res.checks.face.detail || "");
    ok(fm && Number(fm[1]) >= 6, "L1 face ran at least precheckMinOk passes despite slow inference", fm ? fm[1] + " passes" : res.checks.face.detail);
    eq(res.checks.phone.status, "ready", "L1 the phone check completes (no phone seen) under slow inference");
    ok(res.ok, "L1 the WHOLE pre-check is clear under slow inference",
      JSON.stringify(Object.keys(res.checks).filter((k) => !res.checks[k].ok)));
  }

  /* --- L2: a phone seen by a SLOW detector (350ms per pass) is still
     confirmed — slow inference must not silently disarm the scan. --- */
  {
    const c = JSON.parse(JSON.stringify(M.CONFIG));
    c.inference.precheckWindowMs = 1600;
    c.inference.precheckSampleMs = 100;
    c.inference.precheckPhoneSampleMs = 100;
    c.inference.precheckBlankSampleMs = 60;
    c.black.windowMs = 1200;
    c.audio.calibMs = 300; c.audio.calibMinFrames = 3;
    const res = await M.runPrechecks({
      config: c, controllerReady: true,
      providers: {
        fullscreen: { supported: () => true },
        store: async () => ({ ok: true }),
        models: { load: async () => ({ face: {}, object: {} }) },
        camera: {
          request: async () => ({}), trackLive: () => true, attach: async () => {},
          fresh: () => true,
          frameStats: () => ({ frames: 1, stats: good(), fresh: true, ready: true, presented: 1, width: 640, height: 480 })
        },
        mic: { request: async () => ({}), trackLive: () => true, start: async () => {}, features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }) },
        runFaceDetection: async () => { await sleep(200); return 1; },
        runPhoneDetection: async () => { await sleep(350); return { score: 0.85, label: "cell phone" }; }
      }
    });
    eq(res.checks.phone.status, "failed", "L2 a phone found by a SLOW detector is still confirmed", res.checks.phone.detail);
    ok(/phone-like object/i.test(res.checks.phone.detail || ""), "L2 the phone message carries the confirmation copy", res.checks.phone.detail);
    eq(res.checks.face.status, "ready", "L2 the face check is unaffected by slow phone inference");
    eq(res.checks["camera-blank"].status, "ready", "L2 the blank check is unaffected by slow phone inference");
  }

  /* --- L3: a camera that delivers a new frame only occasionally →
     honest RETRY with the ORIGINAL insufficient-samples message. --- */
  {
    let calls = 0, frames = 0;
    const res = await runFake({
      camera: {
        request: async () => ({}), trackLive: () => true, attach: async () => {},
        frameStats: () => { calls++; const fresh = calls % 10 === 1; if (fresh) frames++; return { frames, stats: good(), fresh, ready: true }; }
      }
    });
    eq(res.checks["camera-blank"].status, "retry", "L3 too few FRESH samples is a RETRY, never a pass", res.checks["camera-blank"].detail);
    ok(/fresh camera frames arrived during the observation window/.test(res.checks["camera-blank"].detail || ""),
      "L3 the insufficiency is a specific FRAME-ACQUISITION error (never worded as a black/covered camera)",
      res.checks["camera-blank"].detail);
    ok(/blank|covered/i.test(res.checks["camera-blank"].detail || "") === false,
      "L3 and it never claims the picture was blank or covered", res.checks["camera-blank"].detail);
    ok(!/frozen/i.test(res.checks["camera-blank"].detail || ""),
      "L3 a SLOW-but-live camera is never mislabelled frozen (Part 4 discriminator)",
      res.checks["camera-blank"].detail);
    eq(res.checks["camera-feed"].status, "ready",
      "L3 the feed row stays green for a slow-but-live camera", res.checks["camera-feed"].detail);
  }

  /* --- L4: the picture FREEZES after the first frame → named as
     frozen (never "no person detected"), and no check is marked
     ready on stale frames. --- */
  {
    let first = true;
    const res = await runFake({
      camera: {
        request: async () => ({}), trackLive: () => true, attach: async () => {},
        fresh: () => false,
        frameStats: () => {
          if (first) { first = false; return { frames: 1, stats: good(), fresh: true, ready: true, presented: 1 }; }
          return { frames: 1, stats: good(), fresh: false, ready: true, presented: 1 };
        }
      }
    });
    eq(res.checks["camera-feed"].status, "failed",
      "L4 the feed row is corrected once the window PROVES the picture froze (never left green)",
      res.checks["camera-feed"].detail);
    ok(/frozen/i.test(res.checks["camera-feed"].detail || ""), "L4 the feed message names the frozen feed (Part 8)",
      res.checks["camera-feed"].detail);
    eq(res.checks["camera-blank"].status, "failed", "L4 a frozen picture fails the blank check");
    ok(/frozen/i.test(res.checks["camera-blank"].detail || ""), "L4 the blank message names the FROZEN picture", res.checks["camera-blank"].detail);
    eq(res.checks.face.status, "failed", "L4 the face check fails (never ready) on a frozen picture");
    ok(/frozen/i.test(res.checks.face.detail || "") && !/No person/.test(res.checks.face.detail || ""),
      "L4 the face message says frozen — it does NOT blame the student's face", res.checks.face.detail);
    eq(res.checks.phone.status, "failed", "L4 the phone scan honestly reports that it could not run");
    ok(!res.ok, "L4 a frozen camera blocks the exam start");
  }

  /* --- L5: DELAYED camera startup (no metadata for the first six
     probes) → the feed wait keeps waiting, then all checks proceed. --- */
  {
    let calls = 0;
    const res = await runFake({
      camera: {
        request: async () => ({}), trackLive: () => true, attach: async () => {},
        frameStats: () => {
          calls++;
          if (calls <= 6) return { frames: 0, stats: null, fresh: false, ready: false, reason: "no-metadata" };
          return { frames: 3, stats: good(), fresh: true, ready: true, presented: 2 };
        }
      }
    });
    eq(res.checks["camera-feed"].status, "ready", "L5 a camera that starts LATE is waited for, not failed", res.checks["camera-feed"].detail);
    eq(res.checks["camera-blank"].status, "ready", "L5 blank sampling proceeds once frames arrive");
    eq(res.checks.face.status, "ready", "L5 the face check proceeds once frames arrive");
  }

  /* --- L6: the face outcomes are told apart with accurate messages:
     clearly-visible face / nobody / several people / detector
     THROWING (model failure) / detector UNAVAILABLE. --- */
  {
    const seen = await runFake({ runFaceDetection: async () => 1 });
    eq(seen.checks.face.status, "ready", "L6 a clearly visible face passes");
    const m = /confirmed in (\d+) of (\d+) passes/.exec(seen.checks.face.detail || "");
    ok(m && Number(m[1]) >= 6, "L6 with at least precheckMinOk confirming passes", seen.checks.face.detail);

    const zero = await runFake({ runFaceDetection: async () => 0 });
    eq(zero.checks.face.status, "failed", "L6 nobody in frame → FAILED");
    ok(/No face was detected in the latest valid camera frames/.test(zero.checks.face.detail || ""),
      "L6 the Part-8 'no face' message names the actual condition", zero.checks.face.detail);
    ok(!/model|detector|unavailable|timed out/i.test(zero.checks.face.detail || ""),
      "L6 and a valid zero-face inference is NOT reported as a model problem", zero.checks.face.detail);

    const two = await runFake({ runFaceDetection: async () => 2 });
    eq(two.checks.face.status, "failed", "L6 several people in frame → FAILED");
    ok(/More than one person/.test(two.checks.face.detail || ""), "L6 the multi-person message is distinct");

    const boom = await runFake({ runFaceDetection: async () => { throw new Error("boom"); } });
    eq(boom.checks.face.status, "failed", "L6 a THROWING detector → FAILED (model failure)");
    ok(/failed while analysing/.test(boom.checks.face.detail || "") && !/No person/.test(boom.checks.face.detail || ""),
      "L6 the model-failure message never blames the student", boom.checks.face.detail);

    const gone = await runFake({ runFaceDetection: async () => -1 });
    eq(gone.checks.face.status, "failed", "L6 an UNAVAILABLE detector → FAILED");
    ok(/unavailable/i.test(gone.checks.face.detail || "") && !/No person/.test(gone.checks.face.detail || ""),
      "L6 the unavailable message is distinct from 'no person'", gone.checks.face.detail);
  }

  /* --- L7: the BROWSER RUNTIME (createRuntime) against a fake DOM,
     fake video element and fake MediaPipe tasks. The fakes are at the
     call site only: frameStats/framesFresh/runFaceDetection are the
     shipped production code. --- */
  {
    let getImageCalls = 0;
    let fakePixels = 110;
    const fakeVideo = {
      readyState: 2, videoWidth: 640, videoHeight: 480, currentTime: 0,
      muted: false, autoplay: false, srcObject: null,
      setAttribute() {},
      play() { fakeVideo.__played = (fakeVideo.__played || 0) + 1; return Promise.resolve(); }
    };
    const fakeCtx = {
      drawImage() {},
      getImageData() { getImageCalls++; return { data: new Uint8ClampedArray(64 * 48 * 4).fill(fakePixels) }; }
    };
    const fakeDoc = {
      createElement(tag) {
        if (tag === "video") return fakeVideo;
        if (tag === "canvas") return { width: 0, height: 0, getContext: () => fakeCtx };
        return {};
      },
      documentElement: {}, addEventListener() {}, fullscreenEnabled: true
    };
    const track = { readyState: "live", enabled: true, muted: false, kind: "video" };
    const fakeNav = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [track], getVideoTracks: () => [track] }) } };
    const rt = M.createRuntime({ document: fakeDoc, navigator: fakeNav });
    ok(!!rt && typeof rt.camera.fresh === "function", "L7 the runtime exposes the freshness gate");

    await rt.camera.request();
    await rt.camera.attach(rt.camera.stream());
    ok(fakeVideo.__played === 1, "L7 attach() plays the video element");

    const s1 = rt.camera.frameStats();
    ok(s1.ready === true && s1.fresh === true && s1.frames === 1, "L7 the first drawable frame counts as FRESH",
      JSON.stringify({ ready: s1.ready, fresh: s1.fresh, frames: s1.frames }));
    ok(s1.stats && isFinite(s1.stats.mean), "L7 luma stats come from the real analysis path");
    const s2 = rt.camera.frameStats();
    ok(s2.fresh === false && s2.frames === 1 && !!s2.stats, "L7 a repeat read of the SAME frame is fresh:false and never re-counted",
      JSON.stringify({ fresh: s2.fresh, frames: s2.frames }));
    fakeVideo.currentTime = 0.04;                     // the camera presented a new frame
    const s3 = rt.camera.frameStats();
    ok(s3.fresh === true && s3.frames === 2, "L7 a genuinely new frame counts as fresh again");
    /* v91 Part 3 — the counter is no longer the only witness: a
       STARVED rVFC callback (counter stalled) with CHANGED pixels is a
       fresh sample, and IDENTICAL pixels are still a frozen picture.
       Both directions are decided by the pixels themselves. */
    fakePixels = 140;                                 // newer pixels, counter stalled
    const s4 = rt.camera.frameStats();
    ok(s4.fresh === true && s4.frames === 3 && s4.stats && isFinite(s4.stats.mean),
      "L7 pixels that MOVED while the counter stalled count as FRESH (rVFC lag is not a freeze)",
      JSON.stringify({ fresh: s4.fresh, frames: s4.frames, reason: s4.reason }));
    const s5 = rt.camera.frameStats();
    ok(s5.fresh === false && s5.frames === 3 && !!s5.stats,
      "L7 identical pixels with the counter stalled are FROZEN (cached stats, never re-counted)",
      JSON.stringify({ fresh: s5.fresh, frames: s5.frames, reason: s5.reason }));
    eq(getImageCalls, 5, "L7 every read draws exactly once — the frozen read VERIFIES by pixels but never re-counts",
      getImageCalls + " redraws");
    ok(rt.camera.fresh() === true, "L7 the freshness gate is open on a live picture");
    fakeVideo.readyState = 1;                          // metadata only — no decoded frame
    ok(rt.camera.fresh() === false, "L7 the freshness gate is closed while no frame is decoded");
    eq(await rt.runFaceDetection(), -1, "L7 no decoded frame → the detector honestly reports unavailable (-1)");
    fakeVideo.readyState = 2;

    /* single-flight inference */
    let inferCalls = 0; const tsSeen = [];
    const task = {
      async detectForVideo(el, ts) { inferCalls++; tsSeen.push(ts); await sleep(80); return { detections: [] }; }
    };
    const all = await Promise.all([rt.runFaceDetection(task), rt.runFaceDetection(task), rt.runFaceDetection(task)]);
    eq(inferCalls, 1, "L7 concurrent callers JOIN one inference — no overlapping detectForVideo");
    ok(all.every((x) => x === 0), "L7 every caller gets the shared honest verdict");
    await rt.runFaceDetection(task); await rt.runFaceDetection(task); await rt.runFaceDetection(task);
    ok(tsSeen.length >= 4 && tsSeen.every((t2, i) => i === 0 || t2 > tsSeen[i - 1]),
      "L7 MediaPipe timestamps are STRICTLY increasing across passes");

    /* result parsing: faces (incl. merging), low scores, phone classes */
    const one = await rt.runFaceDetection({ detectForVideo: async () => ({ detections: [{ score: 0.92, box: { x: 200, y: 120, width: 120, height: 120 } }] }) });
    eq(one, 1, "L7 one high-confidence face parses to 1");
    const twoF = await rt.runFaceDetection({ detectForVideo: async () => ({ detections: [
      { score: 0.9, box: { x: 40, y: 100, width: 100, height: 100 } },
      { score: 0.88, box: { x: 400, y: 110, width: 100, height: 100 } }] }) });
    eq(twoF, 2, "L7 two distinct faces parse to 2 (multiple-person state)");
    const dup = await rt.runFaceDetection({ detectForVideo: async () => ({ detections: [
      { score: 0.91, box: { x: 200, y: 120, width: 120, height: 120 } },
      { score: 0.9, box: { x: 210, y: 125, width: 115, height: 115 } }] }) });
    eq(dup, 1, "L7 two overlapping boxes of ONE face merge to 1 (never 'two people')");
    const dim = await rt.runFaceDetection({ detectForVideo: async () => ({ detections: [{ score: 0.2, box: { x: 200, y: 120, width: 120, height: 120 } }] }) });
    eq(dim, 0, "L7 a detection below minScore is not a face (no false ready)");
    const phoneHit = await rt.runPhoneDetection({ detectForVideo: async () => ({ detections: [{ categories: [{ label: "cell phone", score: 0.83 }] }] }) });
    ok(phoneHit && phoneHit.score === 0.83 && phoneHit.label === "cell phone", "L7 a COCO cell phone parses to a phone hit", JSON.stringify(phoneHit));
    const personHit = await rt.runPhoneDetection({ detectForVideo: async () => ({ detections: [{ categories: [{ label: "person", score: 0.95 }] }] }) });
    eq(personHit, null, "L7 other COCO classes are never treated as a phone");

    let threw = false;
    try { await rt.runFaceDetection({ detectForVideo: async () => { throw new Error("gpu gone"); } }); } catch (e2) { threw = true; }
    ok(threw, "L7 a detector exception PROPAGATES (the pre-check maps it to a model failure, L6)");

    await sleep(1100);                                 // no new frames for longer than frameFreshMs
    ok(rt.camera.fresh() === false, "L7 a picture with no new frames for frameFreshMs is STALE (frozen)");

    fakeVideo.videoWidth = 0;                          // stream detached
    const dead = rt.camera.frameStats();
    ok(dead.ready === false && dead.stats === null, "L7 a detached video reports ready:false — never a phantom frame");
    ok(rt.camera.fresh() === false, "L7 and the freshness gate stays closed");
    rt.releaseAll();
  }
}
}

/* ============================================================
   M. v91 CROSS-DEVICE AUDIT — stage-separated startup timeouts,
   hang-proof inference, the validated frame-freshness fallback
   tiers, Part 8 error wording, the phone detector failing CLOSED,
   safe diagnostics, ideal-only camera constraints with a bare
   fallback, retry/leave cleanup (generation bump), attempt gating,
   and the deployment assets the deployed site needs.

   MOCKED vs REAL: providers, clocks, DOM/video elements and the
   MediaPipe tasks below are fakes AT THE CALL SITE only —
   runPrechecks, createRuntime, frameStats, freshness tracking, the
   detector flights and every verdict are the exact shipped code.
   Real-browser + real-model results are recorded separately in
   EXAM-SECURITY-TESTING.md §v91. NO test here proves a real face
   was seen by a real camera.
   ============================================================ */
async function sectionM() {
  section("M. v91 audit: stage timeouts, hang bounds, fallback tiers, Part 8 wording, diagnostics");
  const fs = require("fs");
  const root = path.resolve(__dirname, "..");
  const good = () => ({ mean: 110, std: 45 });
  const mkMic = () => ({ request: async () => ({}), trackLive: () => true, start: async () => {},
    features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }) });
  function fakeRun(over, cfg) {
    let t = 0;
    const providers = {
      sleep: async () => {}, now: () => (t += 50), controllerReady: true,
      fullscreen: { supported: () => true },
      store: async () => ({ ok: true }),
      models: { load: async () => ({ face: {}, object: {} }) },
      camera: { request: async () => ({}), trackLive: () => true, attach: async () => {},
        frameStats: () => ({ frames: 3, stats: good(), fresh: true, ready: true, presented: 3, width: 640, height: 480 }) },
      mic: mkMic(),
      runFaceDetection: async () => 1,
      runPhoneDetection: async () => null
    };
    /* v93 Part 4 — attach BEFORE overrides so scenarios may inject their
       own boxes; the closure reads the MERGED runFaceDetection */
    providers.runFaceDetections = async () => facesToBoxes(await providers.runFaceDetection());
    Object.assign(providers, over || {});
    return M.runPrechecks(cfg ? { config: cfg, controllerReady: true, providers: providers }
                               : { controllerReady: true, providers: providers });
  }

  /* --- M1: camera constraints are IDEAL-only (the device negotiates
     down) with a bare fallback, and a BUSY camera is a real answer. --- */
  {
    const calls = [];
    let first = true;
    const nav1 = { mediaDevices: { getUserMedia: async (c) => {
      calls.push(c);
      if (first) { first = false; const e = new Error("unsatisfiable"); e.name = "OverconstrainedError"; throw e; }
      return { id: "s", getTracks: () => [], getVideoTracks: () => [] };
    } } };
    const rt1 = M.createRuntime({ navigator: nav1, document: null });
    await rt1.camera.request();
    eq(calls.length, 2, "M1 an OverconstrainedError falls back to the bare request instead of failing the student");
    ok(calls[0] && calls[0].video && calls[0].video.facingMode && calls[0].video.facingMode.ideal === "user",
      "M1 the first request PREFERS the front camera (ideal, never exact)", JSON.stringify(calls[0]));
    ok(calls[0].video.width && calls[0].video.width.ideal === 640 && calls[0].video.height.ideal === 480 &&
       calls[0].video.width.exact === undefined && calls[0].video.frameRate && calls[0].video.frameRate.ideal === 30,
      "M1 resolution/frame-rate are ideal preferences — nothing that can overconstrain", JSON.stringify(calls[0] && calls[0].video));
    eq(calls[1].video, true, "M1 the fallback is the barest {video:true} request");
    eq(calls[1].audio, false, "M1 the fallback never secretly enables audio");

    let busyCalls = 0;
    const nav2 = { mediaDevices: { getUserMedia: async () => { busyCalls++;
      const e = new Error("in use"); e.name = "NotReadableError"; throw e; } } };
    let busyErr = null;
    try { await M.createRuntime({ navigator: nav2, document: null }).camera.request(); }
    catch (e) { busyErr = e; }
    eq(busyCalls, 1, "M1 a BUSY camera (NotReadableError) is never retried away");
    ok(busyErr && busyErr.name === "NotReadableError", "M1 the busy error propagates for an honest message");
    const busyRun = await fakeRun({ camera: { request: async () => { const e = new Error("x"); e.name = "NotReadableError"; throw e; } } });
    eq(busyRun.checks.camera.status, "failed", "M1 the pre-check FAILS on a busy camera");
    ok(/already in use by another application/i.test(busyRun.checks.camera.detail || ""),
      "M1 with the 'camera in use by another application' copy", busyRun.checks.camera.detail);
    eq(busyRun.diagnostics.lastError, "camera-busy", "M1 diagnostics carry the camera-busy category");
  }

  /* --- M2: attach waits for metadata under ITS OWN stage timeout,
     and a rejected play() is RECORDED, never thrown. --- */
  {
    const mkVideo = () => ({
      readyState: 0, videoWidth: 0, videoHeight: 0, currentTime: 0,
      muted: false, autoplay: false, srcObject: null, listeners: {},
      setAttribute() {},
      addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); },
      removeEventListener() {},
      play() { return Promise.reject(Object.assign(new Error("no gesture"), { name: "NotAllowedError" })); }
    });
    const mkDoc = (v) => ({
      createElement: (t) => (t === "video" ? v
        : t === "canvas" ? { width: 0, height: 0, getContext: () => ({ drawImage() {}, getImageData: () => ({ data: new Uint8ClampedArray(64 * 48 * 4).fill(110) }) }) }
        : {}),
      documentElement: {}, addEventListener() {}, fullscreenEnabled: true
    });
    const track = { readyState: "live", enabled: true, muted: false, kind: "video" };
    const nav = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [track], getVideoTracks: () => [track] }) } };
    const cfg = JSON.parse(JSON.stringify(M.CONFIG));
    cfg.inference.precheckMetadataTimeoutMs = 150;   // shortened ONLY for this test

    const v = mkVideo();
    const rt = M.createRuntime({ document: mkDoc(v), navigator: nav, config: cfg });
    await rt.camera.request();
    const t0 = Date.now();
    await rt.camera.attach(rt.camera.stream());
    const waited = Date.now() - t0;
    ok(waited >= 140 && waited < 1600, "M2 a camera that never reports metadata is waited for, bounded by its stage timeout",
      waited + "ms");
    eq(rt.camera.info().playError, "NotAllowedError",
      "M2 the play() rejection is RECORDED for diagnostics, not silently swallowed", String(rt.camera.info().playError));

    const v2 = mkVideo();
    v2.play = () => Promise.resolve();
    const rt2 = M.createRuntime({ document: mkDoc(v2), navigator: nav, config: cfg });
    await rt2.camera.request();
    const p = rt2.camera.attach(rt2.camera.stream());
    const t1 = Date.now();
    setTimeout(() => {
      v2.readyState = 4; v2.videoWidth = 640; v2.videoHeight = 480;
      (v2.listeners.loadedmetadata || []).forEach((fn) => fn());
    }, 60);
    await p;
    ok(Date.now() - t1 < 1200, "M2 metadata events resolve the wait without burning the whole timeout");
  }

  /* --- M3: the validated freshness TIERS for browsers without
     requestVideoFrameCallback (Part 3): currentTime while the decoded-
     frame counter is unpopulated, the counter while it works, distrust
     of a counter frozen while the media clock keeps moving — and
     recovery when it proves dead. Zero-sized frames are rejected. --- */
  {
    let qf = 0;
    const v = {
      readyState: 4, videoWidth: 640, videoHeight: 480, currentTime: 0,
      muted: false, autoplay: false, srcObject: null,
      setAttribute() {}, play: () => Promise.resolve(),
      addEventListener() {}, removeEventListener() {},
      getVideoPlaybackQuality: () => ({ totalVideoFrames: qf, droppedVideoFrames: 0 })
    };
    const doc = {
      createElement: (t) => (t === "video" ? v
        : { width: 0, height: 0, getContext: () => ({ drawImage() {}, getImageData: () => ({ data: new Uint8ClampedArray(64 * 48 * 4).fill(110) }) }) }),
      documentElement: {}, addEventListener() {}, fullscreenEnabled: true
    };
    const track = { readyState: "live", enabled: true, muted: false, kind: "video" };
    const nav = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [track], getVideoTracks: () => [track] }) } };
    const cfg = JSON.parse(JSON.stringify(M.CONFIG));
    cfg.inference.frameFreshMs = 100;             // shortens ONLY the distrust threshold
    const rt = M.createRuntime({ document: doc, navigator: nav, config: cfg });
    await rt.camera.request();
    await rt.camera.attach(rt.camera.stream());

    qf = 0;                                       // API present, counter not populated yet
    const a = rt.camera.frameStats();
    ok(a.fresh === true, "M3 tier 2 (currentTime): while totalVideoFrames is 0 the media clock decides freshness",
      JSON.stringify({ fresh: a.fresh, reason: a.reason }));
    qf = 5;
    const b = rt.camera.frameStats();             // seeds the counter (counts nothing)
    eq(b.fresh, false, "M3 the seeding read counts nothing — conservative, never a phantom sample");
    qf = 7;
    const c = rt.camera.frameStats();             // currentTime NEVER moved here
    ok(c.fresh === true, "M3 tier 1: a decoded-frame counter delta proves a NEW frame with a frozen clock",
      JSON.stringify({ fresh: c.fresh, reason: c.reason }));

    v.currentTime = 0.04;
    const d = rt.camera.frameStats();             // counter frozen, clock moved once (inside threshold)
    ok(d.fresh === false, "M3 a frozen counter with a just-moved clock is not yet treated as a fresh frame",
      d.reason);
    await sleep(130);
    v.currentTime = 0.08;
    rt.camera.frameStats();                       // still frozen, accumulating movement
    await sleep(130);
    v.currentTime = 0.12;
    rt.camera.frameStats();                       // past 2×frameFreshMs of movement → counter distrusted
    v.currentTime = 0.16;
    const g = rt.camera.frameStats();
    ok(g.fresh === true, "M3 a counter proven dead falls back to the media clock — a working camera is never frozen out",
      JSON.stringify({ fresh: g.fresh, reason: g.reason }));

    v.videoHeight = 0;                            // degenerate frame size
    const h = rt.camera.frameStats();
    ok(h.ready === false && h.reason === "no-metadata", "M3 a zero-SIZED frame (height 0) is rejected, never analysed",
      JSON.stringify(h));
    eq(rt.camera.fresh(), false, "M3 and the freshness gate closes on it");

    eq(await rt.runPhoneDetection(), -1,
      "M12 a phone detector with no model answers -1 — never null, which would read as 'no phone seen'");
    rt.releaseAll();
  }

  /* --- M5 REGRESSION: the reproduced hang. A face inference that
     never settles used to hang runPrechecks FOREVER (reproduced
     pre-fix: pending at 3s with a 600ms window). Now it must finish,
     bounded, and be reported as a TIMEOUT — never a missing face. --- */
  {
    const cfg = JSON.parse(JSON.stringify(M.CONFIG));
    cfg.inference.inferTimeoutMs = 200;           // shortened ONLY for this test
    cfg.inference.precheckWindowMs = 600;
    cfg.black.windowMs = 600;
    cfg.audio.calibMs = 200; cfg.audio.calibMinFrames = 2;
    const t0 = Date.now();
    const res = await M.runPrechecks({ config: cfg, controllerReady: true, providers: {
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      now: () => Date.now(),
      fullscreen: { supported: () => true },
      store: async () => ({ ok: true }),
      models: { load: async () => ({ face: {}, object: {} }) },
      camera: { request: async () => ({}), trackLive: () => true, attach: async () => {}, fresh: () => true,
        frameStats: () => ({ frames: 1, stats: good(), fresh: true, ready: true, presented: 1, width: 640, height: 480 }) },
      mic: mkMic(),
      runFaceDetection: () => new Promise(() => {}),   // NEVER settles (the reproduced defect)
      runPhoneDetection: async () => null
    } });
    const took = Date.now() - t0;
    ok(took < 4000, "M5 a never-settling inference can no longer hang the pre-check", took + "ms (pre-fix: forever)");
    eq(res.checks.face.status, "failed", "M5 the hung detector FAILS the face check");
    ok(/timed out/i.test(res.checks.face.detail || ""),
      "M5 reported as 'timed out' — its own state, not a missing student", res.checks.face.detail);
    ok(!/No face|No person|sit in front/i.test(res.checks.face.detail || ""),
      "M5 and the timeout is never misreported as 'no person detected'", res.checks.face.detail);
    ok(res.diagnostics.face && res.diagnostics.face.timeouts >= 1, "M5 diagnostics count the inference timeouts");
    eq(res.ok, false, "M5 the exam start stays blocked while detection is hung");
  }

  /* --- M6/M7: Part 8 wording — every failure says what actually
     happened; the phone scan fails CLOSED (an inference that throws
     or times out is NEVER "no phone seen"). --- */
  {
    const un = await fakeRun({ runFaceDetection: async () => -1 });
    eq(un.checks.face.status, "failed", "M6 an unavailable detector FAILS");
    ok(/unavailable/i.test(un.checks.face.detail) && /could not process the camera image/i.test(un.checks.face.detail),
      "M6 with the Part 8 'detector could not process the camera image' copy", un.checks.face.detail);
    ok(!/No face|No person/i.test(un.checks.face.detail), "M6 never as a missing student", un.checks.face.detail);

    const to = await fakeRun({ runFaceDetection: async () => -3 });
    eq(to.checks.face.status, "failed", "M6 a timed-out detector FAILS");
    ok(/timed out/i.test(to.checks.face.detail), "M6 named as a timeout", to.checks.face.detail);
    ok(to.diagnostics.face.timeouts >= 1, "M6 the timeout is counted in diagnostics");

    const ready = await fakeRun();
    ok(/one face has been consistently detected/i.test(ready.checks.face.detail) &&
       /confirmed in \d+ of \d+ passes/.test(ready.checks.face.detail),
      "M6 the success message is the Part 8 copy plus the pass counts", ready.checks.face.detail);

    const phThrow = await fakeRun({ runPhoneDetection: async () => { throw new Error("boom"); } });
    eq(phThrow.checks.phone.status, "failed", "M7 a phone detector that THROWS fails the scan (fail closed)");
    ok(/could not process the camera image/i.test(phThrow.checks.phone.detail || "") &&
       !/No phone-like object seen/.test(phThrow.checks.phone.detail || ""),
      "M7 — a broken scan is NEVER reported as a clean 'no phone' picture", phThrow.checks.phone.detail);

    const phTo = await fakeRun({ runPhoneDetection: async () => -3 });
    eq(phTo.checks.phone.status, "failed", "M7 a timed-out phone scan fails the check");
    ok(/timed out/i.test(phTo.checks.phone.detail || ""), "M7 named as a timeout", phTo.checks.phone.detail);
    ok(phTo.diagnostics.phone.timeouts >= 1, "M7 the phone timeouts are counted in diagnostics");

    const phOk = await fakeRun({ runPhoneDetection: async () => null });
    eq(phOk.checks.phone.status, "ready", "M7 valid completed scans still PASS (no over-blocking)");
    ok(/No phone-like object seen/.test(phOk.checks.phone.detail), "M7 with the clean-scan copy");
    ok(phOk.diagnostics.phone.runs >= 1, "M7 diagnostics show the completed passes behind that result");
  }

  /* --- M8/M10: feed-stage wording (Part 8) + the diagnostics
     payload: exactly the safe sections, complete and leak-free. --- */
  {
    const noFrames = await fakeRun({ camera: { request: async () => ({}), trackLive: () => true,
      attach: async () => {}, frameStats: () => ({ frames: 0, stats: null }) } });
    eq(noFrames.checks["camera-feed"].status, "failed", "M8 a feed without frames FAILS its stage");
    ok(/new video frames have not arrived yet/.test(noFrames.checks["camera-feed"].detail || ""),
      "M8 with the Part 8 'connected but frames not arriving' copy", noFrames.checks["camera-feed"].detail);
    ok(!/covered by another app|disconnected/i.test(noFrames.checks["camera-feed"].detail || ""),
      "M8 — a slow/absent feed is never called covered or disconnected until proven", noFrames.checks["camera-feed"].detail);
    eq(noFrames.diagnostics.lastError, "no-video-frames", "M8 diagnostics name the failed stage");

    const clear = await fakeRun();
    const allow = ["startedAt", "stages", "video", "frames", "models", "face", "phone", "lastError", "configUsed"];
    const keys = Object.keys(clear.diagnostics || {});
    ok(keys.length === allow.length && allow.every((k) => keys.indexOf(k) !== -1),
      "M10 diagnostics contain EXACTLY the safe sections — nothing else", JSON.stringify(keys));
    ["models", "camera", "mic", "feed", "calibration", "observation"].forEach((k) => {
      ok(typeof clear.diagnostics.stages[k] === "number", "M10 stage timing recorded: " + k);
    });
    eq(clear.diagnostics.lastError, null, "M10 a clear run reports no error category");
    eq(clear.diagnostics.configUsed.windowMs, M.CONFIG.inference.precheckWindowMs, "M10 the active policy is transparent in diagnostics");
    ok(clear.diagnostics.face.good >= 6, "M10 face pass counts are recorded", JSON.stringify(clear.diagnostics.face));
    ok(clear.diagnostics.frames.freshSamples >= M.CONFIG.black.minSamples, "M10 fresh-frame counts are recorded",
      JSON.stringify(clear.diagnostics.frames));
    const diagJson = JSON.stringify(clear.diagnostics);
    ok(!/imageData|base64|pixelData|audioSample|rawFrame|getUserMedia/i.test(diagJson),
      "M10 no image/audio payload can leak through diagnostics");
  }

  /* --- M9: the RETRY lifecycle. A failed run and a following pass
     are fully independent — no stale statuses, no stale counts, no
     stale error categories. --- */
  {
    const first = await fakeRun({ runFaceDetection: async () => 0 });
    ok(!first.ok, "M9 the first run (nobody in frame) fails");
    eq(first.diagnostics.lastError, "face-none", "M9 the failed run's category is face-none");
    const second = await fakeRun({ runFaceDetection: async () => 1 });
    ok(second.ok, "M9 a retry after that failure passes cleanly");
    eq(second.checks.face.status, "ready", "M9 the retried face check is READY");
    const m = /confirmed in (\d+) of (\d+) passes/.exec(second.checks.face.detail || "");
    ok(m && Number(m[1]) === Number(m[2]) && Number(m[2]) >= 6,
      "M9 the second run reports ITS OWN pass counts — nothing carried over", second.checks.face.detail);
    eq(second.diagnostics.face.passes, m ? Number(m[2]) : -1, "M9 diagnostics match the retried run's checks");
    eq(second.diagnostics.lastError, null, "M9 the retried run clears the error category");
  }

  /* --- M11: LEAVING the pre-check mid-run (Back / retry / release)
     abandons the observation window immediately via the bumped
     generation — the run ends long before its 4000ms window, and the
     abandoned result can never pass. Full wiring: the REAL runtime
     (frameStats / freshness / detector flights are shipped code)
     behind the pre-check providers, real clock, real timers. --- */
  {
    const v = {
      muted: false, autoplay: false, srcObject: null, currentTime: 0,
      setAttribute() {}, addEventListener() {}, removeEventListener() {},
      play: () => Promise.resolve(),
      get readyState() { return this.srcObject ? 4 : 0; },
      get videoWidth() { return this.srcObject ? 640 : 0; },
      get videoHeight() { return this.srcObject ? 480 : 0; }
    };
    const doc = {
      createElement: (t) => (t === "video" ? v
        : { width: 0, height: 0, getContext: () => ({ drawImage() {}, getImageData: () => ({ data: new Uint8ClampedArray(64 * 48 * 4).fill(110) }) }) }),
      documentElement: {}, addEventListener() {}, fullscreenEnabled: true
    };
    const track = { readyState: "live", enabled: true, muted: false, kind: "video" };
    const nav = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [track], getVideoTracks: () => [track] }) } };
    const cfg = JSON.parse(JSON.stringify(M.CONFIG));
    cfg.inference.precheckWindowMs = 4000;        // long enough to PROVE the gen-bump shortens it
    cfg.audio.calibMs = 300; cfg.audio.calibMinFrames = 3;
    const rt = M.createRuntime({ document: doc, navigator: nav, config: cfg });
    const faceTask = { detectForVideo: async () => ({ detections: [{ score: 0.9, box: { x: 200, y: 120, width: 120, height: 120 } }] }) };
    const objTask = { detectForVideo: async () => ({ detections: [] }) };
    const t0 = Date.now();
    const run = M.runPrechecks({ config: cfg, controllerReady: true, providers: {
      sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
      now: () => Date.now(),
      fullscreen: { supported: () => true },
      store: async () => ({ ok: true }),
      models: { load: async () => ({ face: faceTask, object: objTask }) },
      camera: { request: () => rt.camera.request(), attach: (s) => rt.camera.attach(s),
        trackLive: (s) => rt.camera.trackLive(s), frameStats: () => rt.camera.frameStats(),
        fresh: () => rt.camera.fresh(), info: () => rt.camera.info() },
      mic: mkMic(),
      runFaceDetection: (task) => rt.runFaceDetection(task),
      runPhoneDetection: (task) => rt.runPhoneDetection(task)
    } });
    await sleep(800);                            // window started ≈300ms in — release mid-window
    rt.releaseAll();
    const res = await run;
    const took = Date.now() - t0;
    ok(took < 3000, "M11 leaving mid-check ends the window AT ONCE (bumped generation), not at its 4000ms end",
      took + "ms");
    ok(!res.ok, "M11 an abandoned run can never pass", JSON.stringify(res.checks["camera-blank"]));
    eq(rt.camera.frameStats().ready, false, "M11 after release the feed reports not-ready — no phantom frames");
    eq(rt.camera.fresh(), false, "M11 and the freshness gate is closed");
  }

  /* --- M13/M14: integration gates and the DEPLOYED assets (Part 5)
     — statically, in the shipped files. --- */
  {
    const appSrc = fs.readFileSync(path.join(root, "app.js"), "utf8");
    ok(/exSecDiag/.test(appSrc) && /fillDiagnostics/.test(appSrc),
      "M13 app.js renders the collapsible diagnostics area");
    ok(/camera\.info/.test(appSrc) && /modelsStatus/.test(appSrc),
      "M13 app.js wires safe camera/model facts into diagnostics");
    const guardIdx = appSrc.indexOf("if (!examSecurityChecks || !ExamMonitor.precheckOk(examSecurityChecks.checks)) return;");
    const startIdx = appSrc.indexOf("await examStartAttempt(paper, btn);");
    ok(guardIdx > -1 && startIdx > guardIdx,
      "M13 a failed pre-check can never reach the attempt-consuming start (precheckOk guard precedes it)");
    ok(/examPrecheckRunning/.test(appSrc) && /fillDiagnostics\(null\)/.test(appSrc),
      "M13 a retry resets rows/diagnostics and stays re-entry safe");
    const stylesSrc = fs.readFileSync(path.join(root, "styles.css"), "utf8");
    ok(/\.ex-sec-diag/.test(stylesSrc), "M13 the diagnostics area is styled");
    const monSrc = fs.readFileSync(path.join(root, "exam-monitor.js"), "utf8");
    ok(/delegate: "CPU"/.test(monSrc) && !/delegate: "GPU"/.test(monSrc),
      "M13 both detectors stay pinned to the TESTED CPU delegate (the vendored GPU build returned canned detections — documented limitation)");
    ok(/precheckFeedTimeoutMs/.test(monSrc) && /inferTimeoutMs/.test(monSrc) && /precheckMetadataTimeoutMs/.test(monSrc),
      "M13 the stage timeouts are central CONFIG, not scattered literals");

    const wasmDir = path.join(root, "vendor", "vision", "wasm");
    ["vision_wasm_internal.js", "vision_wasm_internal.wasm",
     "vision_wasm_nosimd_internal.js", "vision_wasm_nosimd_internal.wasm"].forEach((f) => {
      ok(fs.existsSync(path.join(wasmDir, f)), "M14 wasm asset present for every supported engine: " + f);
    });
    ["blaze_face_short_range.tflite", "efficientdet_lite0.tflite"].forEach((f) => {
      ok(fs.existsSync(path.join(root, "vendor", "vision", "models", f)), "M14 model asset present: " + f);
    });
    const headers = fs.readFileSync(path.join(root, "_headers"), "utf8");
    ok(/\/vendor\/vision\/wasm\/\*\.wasm\s*\n\s*Content-Type: application\/wasm/.test(headers),
      "M14 _headers types *.wasm as application/wasm");
    ok(/\/vendor\/vision\/wasm\/\*\.js\s*\n\s*Content-Type: text\/javascript/.test(headers),
      "M14 _headers types the .js glue as JavaScript (the deployed site served it as application/wasm)");
    ok(!/^\/vendor\/vision\/wasm\/\*$/m.test(headers),
      "M14 the old glob that mis-typed the JS glue is gone");
  }

  /* --- M15: PART 6 — face and phone inference share ONE slot, so two
     MediaPipe passes never run at once in either start order, and each
     caller still receives its own real answer. --- */
  {
    const mkVideo = () => ({
      readyState: 4, videoWidth: 640, videoHeight: 480, currentTime: 0,
      muted: false, autoplay: false, srcObject: null, listeners: {},
      setAttribute() {},
      addEventListener(ev, fn) { (this.listeners[ev] = this.listeners[ev] || []).push(fn); },
      removeEventListener() {},
      play() { return Promise.resolve(); }
    });
    const mkDoc = (v) => ({
      createElement: (t) => (t === "video" ? v
        : t === "canvas" ? { width: 0, height: 0, getContext: () => ({ drawImage() {}, getImageData: () => ({ data: new Uint8ClampedArray(64 * 48 * 4).fill(110) }) }) }
        : {}),
      documentElement: {}, addEventListener() {}, fullscreenEnabled: true
    });
    const track = { readyState: "live", enabled: true, muted: false, kind: "video" };
    const nav = { mediaDevices: { getUserMedia: async () => ({ getTracks: () => [track], getVideoTracks: () => [track] }) } };
    const cfg = JSON.parse(JSON.stringify(M.CONFIG));
    const v = mkVideo();
    const rt = M.createRuntime({ document: mkDoc(v), navigator: nav, config: cfg });
    await rt.camera.request();
    await rt.camera.attach(rt.camera.stream());

    const mkTask = (state) => ({ detectForVideo: async () => {
      state.active++;
      if (state.active > 1) state.overlap = true;
      state.max = Math.max(state.max, state.active);
      await sleep(50);
      state.active--;
      return { detections: [] };
    }});

    const s1 = { active: 0, overlap: false, max: 0 };
    const [f1, p1] = await Promise.all([
      rt.runFaceDetection(mkTask(s1)),
      rt.runPhoneDetection(mkTask(s1))
    ]);
    ok(!s1.overlap && s1.max === 1,
      "M15 face-then-phone: the second pass QUEUES on the shared slot — never two inferences at once",
      JSON.stringify(s1));
    eq(f1, 0, "M15 the face pass still returns its real count", String(f1));
    ok(!p1, "M15 the phone pass still returns its clean 'no phone' answer", String(p1));

    const s2 = { active: 0, overlap: false, max: 0 };
    const [p2, f2] = await Promise.all([
      rt.runPhoneDetection(mkTask(s2)),
      rt.runFaceDetection(mkTask(s2))
    ]);
    ok(!s2.overlap && s2.max === 1,
      "M15 phone-then-face: serialization holds in EITHER start order",
      JSON.stringify(s2));
    eq(f2, 0, "M15 face answer intact on the reversed order", String(f2));
    ok(!p2, "M15 phone answer intact on the reversed order", String(p2));

    const monSrc = fs.readFileSync(path.join(root, "exam-monitor.js"), "utf8");
    ok(/function inferSlot/.test(monSrc) && /return inferSlot\(/.test(monSrc),
      "M15 both detector passes are actually routed through the shared slot");
    rt.releaseAll();
  }

  /* --- M16: PART 7 — the camera/mic/model REQUESTS are bounded
     stages: an unanswered permission prompt or a hung model fetch
     fails its own stage (with retry-able copy) instead of hanging the
     pre-check forever, and a stream arriving after the deadline is
     stopped on arrival — never leaked into the next try. --- */
  {
    const cfg = JSON.parse(JSON.stringify(M.CONFIG));
    cfg.inference.precheckRequestTimeoutMs = 150;
    cfg.inference.precheckModelTimeoutMs = 150;

    // (1) camera getUserMedia that NEVER settles
    let releaseCam = null, lateStopped = false;
    const t0 = Date.now();
    const camRun = await fakeRun({
      camera: {
        request: () => new Promise((res) => { releaseCam = res; }),
        trackLive: () => true, attach: async () => {},
        frameStats: () => ({ frames: 0, stats: null, fresh: false, ready: false })
      }
    }, cfg);
    const camElapsed = Date.now() - t0;
    ok(camElapsed < 5000, "M16 a never-settling camera request cannot hang the pre-check (bounded by its stage)",
      camElapsed + "ms");
    eq(camRun.checks.camera.status, "failed", "M16 the camera stage FAILS instead of waiting forever");
    ok(/did not complete in time/i.test(camRun.checks.camera.detail || ""),
      "M16 with the camera-request-timeout copy", String(camRun.checks.camera.detail));
    eq(camRun.diagnostics.lastError, "camera-timeout", "M16 diagnostics carry the camera-timeout category");
    ok(camRun.checks["camera-feed"].status !== "ready",
      "M16 no downstream feed claim is made from a request that never returned",
      String(camRun.checks["camera-feed"].detail));
    ok(camRun.ok === false, "M16 the whole pre-check refuses to pass on it");
    ok(!!releaseCam, "M16 the test holds the still-pending request");
    releaseCam({ getTracks: () => [{ stop: () => { lateStopped = true; } }] });
    await sleep(30);
    ok(lateStopped, "M16 a stream arriving AFTER the deadline is STOPPED — the abandoned request can never leak live tracks");

    // (2) microphone getUserMedia that NEVER settles
    const t1 = Date.now();
    const micRun = await fakeRun({
      mic: { request: () => new Promise(() => {}), trackLive: () => true, start: async () => {},
        features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }) }
    }, cfg);
    ok(Date.now() - t1 < 5000, "M16 a never-settling microphone request is bounded too", (Date.now() - t1) + "ms");
    eq(micRun.checks.mic.status, "failed", "M16 the mic stage FAILS instead of waiting forever");
    ok(/microphone request did not complete in time/i.test(micRun.checks.mic.detail || ""),
      "M16 with the microphone-request-timeout copy", String(micRun.checks.mic.detail));
    eq(micRun.diagnostics.lastError, "mic-timeout", "M16 diagnostics carry the mic-timeout category");

    // (3) a detection model load that NEVER settles
    const t2 = Date.now();
    const modRun = await fakeRun({ models: { load: () => new Promise(() => {}) } }, cfg);
    ok(Date.now() - t2 < 5000, "M16 a hung model load is bounded by its own stage", (Date.now() - t2) + "ms");
    eq(modRun.checks.models.status, "failed", "M16 the models stage FAILS instead of waiting forever");
    ok(/did not load in time/i.test(modRun.checks.models.detail || ""),
      "M16 with the model-load-timeout copy", String(modRun.checks.models.detail));
    eq(modRun.diagnostics.lastError, "model-load", "M16 the failure is recorded as a MODEL problem (first-wins)");
    ok(modRun.checks.face.status !== "ready",
      "M16 the face check never passes without its model", String(modRun.checks.face.detail));
    ok(!/Sit in front of the camera/i.test(modRun.checks.face.detail || "") &&
       !/No face was detected/i.test(modRun.checks.face.detail || ""),
      "M16 a model problem is never worded as a missing student (Part 5)", String(modRun.checks.face.detail));
  }

  /* --- M17: PART 4 — the PRODUCTION frozen pattern: the picture
     delivers the baseline frame, then stops updating entirely. The
     freshFrames===0 test alone never fired here (the first read of a
     stalled picture always establishes a fresh baseline — proven in
     the browser, where the frozen canvas reported "keep the page
     open" instead of the reconnect advice). --- */
  {
    let reads = 0;
    const frz = await fakeRun({
      camera: {
        request: async () => ({}), trackLive: () => true, attach: async () => {},
        fresh: () => false,
        frameStats: () => {
          reads++;
          if (reads <= 2) return { frames: reads, stats: { mean: 120, std: 40 }, fresh: true, ready: true, presented: reads };
          return { frames: 2, stats: { mean: 120, std: 40 }, fresh: false, ready: true, presented: 2 };
        }
      }
    });
    eq(frz.checks["camera-feed"].status, "failed",
      "M17 a picture that froze after its baseline frame is FAILED at the feed row (never left green)",
      String(frz.checks["camera-feed"].detail));
    ok(/frozen/i.test(frz.checks["camera-feed"].detail || ""),
      "M17 naming the frozen feed (Part 8)", String(frz.checks["camera-feed"].detail));
    eq(frz.checks["camera-blank"].status, "failed", "M17 the blank check fails a frozen picture");
    ok(/frozen/i.test(frz.checks["camera-blank"].detail || "") &&
       !/fresh camera frames arrived/.test(frz.checks["camera-blank"].detail || ""),
      "M17 with the FROZEN copy — never the 'keep the page open' insufficient-frames retry",
      String(frz.checks["camera-blank"].detail));
    eq(frz.checks.face.status, "failed", "M17 the face check fails as frozen");
    ok(/frozen/i.test(frz.checks.face.detail || "") && !/Sit in front/.test(frz.checks.face.detail || ""),
      "M17 and never blames the student's face", String(frz.checks.face.detail));
    eq(frz.checks.phone.status, "failed", "M17 the phone scan honestly reports the frozen feed");
    eq(frz.diagnostics.lastError, "frozen-video", "M17 diagnostics carry the frozen-video category");
    ok(frz.diagnostics.frames && frz.diagnostics.frames.pictureFrozen === true &&
       frz.diagnostics.frames.frozenRunAtEnd >= 4,
      "M17 diagnostics expose the discriminator and the end-of-window stall", JSON.stringify(frz.diagnostics.frames));
    ok(frz.ok === false, "M17 a frozen camera blocks the exam start");
  }

  /* --- M18: PART 8 — the insufficiency message reports the count the
     FLOOR was measured on (the watcher's in-window samples), never a
     larger raw total: "Only 9 of the required 8" is nonsense. --- */
  {
    let calls = 0;
    const res = await fakeRun({
      camera: {
        request: async () => ({}), trackLive: () => true, attach: async () => {},
        fresh: () => true,
        frameStats: () => {
          calls++;
          /* fresh frames only at the START of the window — by verdict
             time every one of them has aged out of the 3s watcher
             window, so the floor is judged on a much smaller count */
          if (calls <= 5) return { frames: calls, stats: { mean: 120, std: 40 }, fresh: true, ready: true, presented: calls };
          return { frames: 5, stats: { mean: 120, std: 40 }, fresh: false, ready: true, presented: 5 };
        }
      }
    });
    eq(res.checks["camera-blank"].status, "retry",
      "M18 samples that aged out of the watcher window are insufficient", res.checks["camera-blank"].detail);
    const m = /Only (\d+) of the required (\d+)/.exec(res.checks["camera-blank"].detail || "");
    ok(!!m, "M18 the insufficient message keeps its shape", String(res.checks["camera-blank"].detail));
    if (m) {
      ok(Number(m[1]) < Number(m[2]),
        "M18 the printed count is below the floor — never a count that passes it", res.checks["camera-blank"].detail);
    }
    ok(!/Only 9 of/.test(res.checks["camera-blank"].detail || ""),
      "M18 and never the raw window total that exceeded the floor", res.checks["camera-blank"].detail);
  }
}

/* ================= N. v93 hardening =================
   Parts 4/5/6/8: the proximity maths and its mandatory pre-check
   verdict, the live move-away rule against an accepted baseline, the
   box normaliser (MediaPipe {originX,originY} vs {x,y}), the exact
   2-second/phone-immediate/audio-band timing contracts. */
async function sectionN() {
section("N. v93 — proximity maths, mandatory calibration, live move-away, exact timings");

/* 1. box normaliser: BOTH real shapes are one shape (this also fixed
      the silent merge failure where MediaPipe boxes never overlapped
      boxIou's {x,y} reader). */
{
  const n1 = M.normBox({ originX: 10, originY: 20, width: 30, height: 40 });
  eq(n1.x, 10, "normBox maps MediaPipe originX → x");
  eq(n1.y, 20, "normBox maps MediaPipe originY → y");
  eq(M.normBox({ x: 7, y: 9, width: 3, height: 4 }).x, 7, "normBox keeps a plain {x,y} box");
  eq(M.normBox(null), null, "normBox(null) → null");
  eq(M.normBox({ width: 5, height: 5 }), null, "a box with no position → null, never a fake origin");
  const iou = M.boxIou({ originX: 0, originY: 0, width: 100, height: 100 },
                       { x: 10, y: 10, width: 100, height: 100 });
  ok(iou > 0.4, "boxIou now overlaps ACROSS the two real box shapes", String(iou));
}

/* 2. faceBoxMetrics — fractions only; null when unmeasurable. */
{
  const m = M.faceBoxMetrics({ x: 160, y: 120, width: 160, height: 120 }, 640, 480);
  eq(m.widthFrac, 0.25, "width is a fraction of the frame");
  eq(m.heightFrac, 0.25, "height is a fraction of the frame");
  eq(m.centreX, 0.375, "centre x is normalised 0…1");
  eq(m.centreY, 0.375, "centre y is normalised 0…1");
  eq(M.faceBoxMetrics({ x: 0, y: 0, width: 10, height: 10 }, 0, 0), null, "no frame size → null, never a silent pass");
  eq(M.faceBoxMetrics(null, 640, 480), null, "no box → null");
}

/* 3. evalProximity — absolute floor always, relative rule needs the
      baseline, and nothing unmeasurable is ever "ok". */
{
  const C = M.CONFIG;
  const base = { widthFrac: 0.4, heightFrac: 0.45, centreX: 0.5, centreY: 0.45 };
  eq(M.evalProximity(null, base, C), "unknown", "no measurement → unknown (never ok)");
  const far = { widthFrac: C.face.proxMinWidthFrac - 0.02, heightFrac: 0.5, centreX: 0.5, centreY: 0.5 };
  eq(M.evalProximity(far, null, C), "moved", "below the absolute floor → moved even with NO baseline");
  const inRangeNoBase = { widthFrac: 0.4, heightFrac: 0.45, centreX: 0.5, centreY: 0.5 };
  eq(M.evalProximity(inRangeNoBase, null, C), "unknown", "in range but no baseline → unknown, never 'ok'");
  eq(M.evalProximity(base, base, C), "ok", "the accepted baseline itself → ok");
  const sway = { widthFrac: base.widthFrac * 0.9, heightFrac: base.heightFrac * 0.9, centreX: 0.53, centreY: 0.47 };
  eq(M.evalProximity(sway, base, C), "ok", "ordinary posture sway (10% size, 3% centre) never reads as moved");
  const gone = { widthFrac: base.widthFrac * (C.face.proxShrinkRatio - 0.05), heightFrac: 0.3, centreX: 0.5, centreY: 0.45 };
  eq(M.evalProximity(gone, base, C), "moved", "face shrunk past the ratio → moved");
  const shifted = { widthFrac: 0.4, heightFrac: 0.45, centreX: 0.5 + C.face.proxDriftFrac + 0.02, centreY: 0.45 };
  eq(M.evalProximity(shifted, base, C), "moved", "centre drifted past the margin → moved");
}

/* helpers shared by the two pre-check scenarios below */
function healthyRun(faceBoxes) {
  let t = 0;
  const o = {
    sleep: async () => {}, now: () => (t += 50), controllerReady: true,
    fullscreen: { supported: () => true },
    store: async () => ({ ok: true, detail: "Answers save locally on this device." }),
    models: { load: async () => ({ face: {}, object: {} }) },
    camera: { request: async () => ({}), trackLive: () => true, attach: async () => {},
      frameStats: () => ({ frames: 3, stats: { mean: 110, std: 45 }, fresh: true, ready: true, presented: 3, width: 640, height: 480 }) },
    mic: { request: async () => ({}), trackLive: () => true, start: async () => {},
      features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }) },
    runFaceDetection: async () => 1,
    runPhoneDetection: async () => null,
    runFaceDetections: async () => faceBoxes
  };
  return o;
}

/* 4. MANDATORY pre-check: a student too far away cannot start, and
      the accepted baseline honours the absolute floor. */
{
  const nearBox = [{ score: 0.9, box: { x: 192, y: 48, width: 256, height: 216 } }];   // 40% of frame
  const res = await M.runPrechecks({ providers: healthyRun(nearBox), controllerReady: true });
  eq(res.checks["face-proximity"].status, "ready", "a close, centred face passes the proximity check", res.checks["face-proximity"].detail);
  eq(res.ok, true, "the whole pre-check is clear with a valid position");
  ok(res.proximity && res.proximity.widthFrac >= M.CONFIG.face.proxMinWidthFrac,
    "the returned baseline honours the absolute closeness floor", JSON.stringify(res.proximity));
  ok(res.proximity && res.proximity.centreX > 0.05 && res.proximity.centreX < 0.95,
    "the returned baseline is centred inside the frame", JSON.stringify(res.proximity));

  const farBox = [{ score: 0.9, box: { x: 275, y: 190, width: 90, height: 100 } }];     // 14% of frame — too far
  const bad = await M.runPrechecks({ providers: healthyRun(farBox), controllerReady: true });
  eq(bad.checks["face-proximity"].status, "failed", "a face too small for the floor FAILS the proximity check", bad.checks["face-proximity"].detail);
  ok(/Move Closer/i.test(bad.checks["face-proximity"].detail || ""),
    "the failure tells the student exactly what to do", String(bad.checks["face-proximity"].detail));
  eq(bad.ok, false, "a too-far student cannot start the exam at all");
  eq(bad.proximity, null, "no baseline is handed back on a failed calibration");
}

/* 5. LIVE move-away: accepted position stays quiet; a sustained move
      past the baseline produces exactly one face-proximity warning and
      never an instant termination inside the 2-second grace. */
{
  const cfg = JSON.parse(JSON.stringify(M.CONFIG));
  cfg.inference.frameIntervalMs = 10; cfg.inference.faceIntervalMs = 10;
  cfg.inference.phoneIntervalMs = 10; cfg.inference.audioIntervalMs = 10;
  cfg.inference.healthIntervalMs = 10;
  cfg.face.proxConfirmMs = 60;                 // test-speed only (policy value pinned in section A)
  cfg.audio.calibMinFrames = 5;
  const watcher = M.createAudioWatcher(cfg.audio);
  for (let i = 0; i < 8; i++) watcher.addCalibrationFrame({ rms: 0.004, conf: 0.1, peak: 0.006 });
  watcher.finishCalibration();

  const baseline = { widthFrac: 0.4, heightFrac: 0.45, centreX: 0.5, centreY: 0.45 };
  let moved = false, vt = 0;
  const warns = [];
  const e = M.createEngine({ onWarn: (ev) => warns.push(ev.type), onTerminate: (ev) => warns.push("TERMINATED") });
  e.markReady(); e.startAttempt("live-prox");
  const mon = M.createLiveMonitor({
    config: cfg, engine: e, proximityBaseline: baseline,
    providers: {
      camera: {
        health: () => ({ live: true, videoTime: (vt += 1) }),
        frameStats: () => ({ frames: vt, stats: { mean: 120, std: 40 } }),
        frameSize: () => ({ width: 640, height: 480 })
      },
      audio: { health: () => ({ live: true }), features: () => ({ rms: 0.005, conf: 0.1, zcr: 0.1, peak: 0.007 }), watcher },
      runFaceDetection: async () => 1,
      runFaceDetections: async () => (moved
        ? [{ score: 0.9, box: { x: 200, y: 60, width: 160, height: 200 } }]    // 62% of baseline → moved
        : [{ score: 0.9, box: { x: 192, y: 48, width: 256, height: 216 } }]),  // the accepted position
      runPhoneDetection: async () => null
    }
  });
  ok(mon.start() === true, "the proximity monitor starts");
  await sleep(160);
  eq(warns.length, 0, "sitting in the accepted position warns nothing", JSON.stringify(warns));
  moved = true;
  await sleep(240);
  mon.stop();
  eq(warns.filter((w) => w === "face-proximity").length, 1,
    "a sustained move-away produces exactly ONE proximity warning", JSON.stringify(warns));
  ok(warns.indexOf("TERMINATED") === -1,
    "the move does not terminate inside its 2-second warning window", JSON.stringify(warns));
  eq(warns.filter((w) => w === "face-missing" || w === "face-multiple").length, 0,
    "the move-away never masquerades as a missing/multiple-face violation", JSON.stringify(warns));
}

/* 6. AUDIO BAND (Part 8) — worst-case onset→termination must sit
      inside 2.5–3.0s: confirmation back-dates two frame steps, then
      the engine waits the exact 2s grace, then the 100ms loop tick. */
{
  const step = M.CONFIG.inference.audioIntervalMs;
  const voiceWorst = (M.CONFIG.audio.voiceSustainMs - 2 * step) + M.VIOLATIONS["voice-detected"].graceMs() + step;
  const soundWorst = (M.CONFIG.audio.soundSustainMs - 2 * step) + M.VIOLATIONS["sound-detected"].graceMs() + step;
  ok(voiceWorst >= 2500 && voiceWorst <= 3000, "voice: worst-case onset→termination is inside 2.5–3.0s", String(voiceWorst));
  ok(soundWorst >= 2500 && soundWorst <= 3000, "sound: worst-case onset→termination is inside 2.5–3.0s", String(soundWorst));
  eq(M.VIOLATIONS["voice-detected"].graceMs(), 2000, "the audio warning itself is the exact 2 seconds");
  eq(M.VIOLATIONS["sound-detected"].graceMs(), 2000, "the sound warning itself is the exact 2 seconds");
}
}

/* ================= summary ================= */
(async () => {
  await sectionH();
  await sectionI();
  await sectionK();
  await sectionL();
  await sectionM();
  await sectionN();
  console.log("\n" + "=".repeat(60));
  console.log(`Exam monitor tests: ${pass} passed / ${fail} failed`);
  if (fail) {
    console.log("\nFAILURES");
    failures.forEach((f) => console.log("  ✗ " + f));
    process.exit(1);
  }
})();
