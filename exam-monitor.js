/* ============================================================
   EXAM MONITOR — Accountancy by Abhinash (v89)

   The single, central exam-security controller for Exam Mode:

     * PRE-EXAM SECURITY CHECK — camera permission and a genuinely
       live video track, a non-blank picture, exactly one face, no
       phone-like object, a live microphone with a completed
       calibration, voice-detection readiness, fullscreen support
       and activation, the detection models, and answer-saving
       readiness. The student cannot start until every mandatory
       check is "ready".

     * LIVE MONITORING — camera health (track, new frames, not
       frozen, not blank), face presence, phone-like objects,
       microphone health, and voice/sound analysis, all running
       locally in the browser.

     * ONE violation engine with an explicit state machine
       (PRECHECK → READY → IN_PROGRESS → WARNING_SHOWN →
       TERMINATING → TERMINATED / SUBMITTED), a single warning per
       violation type, and a single idempotent termination path.

   HONEST LIMITS (also stated in EXAM-SECURITY-TESTING.md):
     * Face presence uses a real MediaPipe face-detection model and
       phone detection uses a real COCO object-detection model
       (the "cell phone" class). Neither identifies WHO is on
       camera; there is no face recognition, emotion analysis or
       biometric identification anywhere in this file.
     * Detection is probabilistic. A model can miss a phone, or
       mistake another dark rectangular object for one at low
       confidence. Confirmation windows (several consecutive
       detections) exist precisely because a single frame is not
       proof.
     * Voice detection is an engineered energy + pitch (voiced
       periodicity) detector, not a trained speech model. It is
       calibrated against the room's own ambient noise, but a loud
       tonal noise can still read as voiced and very quiet speech
       can fall below the gate.
     * No image, frame, audio sample or recording is stored or
       uploaded anywhere. Only violation type, timestamp, count and
       termination status are persisted (through the injected
       `persist` callback, which is the local examination store).

   Works in a browser (window.ExamMonitor) and in Node
   (module.exports) so every rule below is executed by real tests in
   tests/exam-monitor-tests.js with clearly identified mocks.
   ============================================================ */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ExamMonitor = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Captured synchronously while this classic script executes, when
     document.currentScript is still available. Runtimes are created later
     (lazily, after a user gesture), when currentScript is null and a
     location.href fallback would resolve "vendor/vision/" against
     prerendered sub-page routes such as
     /class-11-accountancy/exam-mode/ (404 → model load fails). */
  var SCRIPT_SRC =
    (typeof document !== "undefined" && document.currentScript && document.currentScript.src) || "";

  /* ============================================================
     CENTRAL CONFIGURATION — every threshold and timing the
     monitoring system uses lives here, nowhere else.
     ============================================================ */
  var CONFIG = {
    /* How often the live loops run. */
    inference: {
      frameIntervalMs: 500,        // luma sampling of the live picture
      faceIntervalMs: 700,         // face detection passes
      phoneIntervalMs: 700,        // phone detection passes
      audioIntervalMs: 100,        // audio analysis passes
      healthIntervalMs: 1000,      // track / loop health checks
      precheckSampleMs: 400,       // face pass cadence during the pre-check
      /* v91 Part 6 — ADAPTIVE FREQUENCY: the phone model is the
         expensive pass (EfficientDet vs BlazeFace), so its pre-check
         cadence is deliberately roomier. This bounds the main thread's
         inference duty cycle, which is exactly what keeps the camera
         sampler and frame presentation flowing between passes — no
         security floor moves: the phone verdict still refuses to pass
         on zero completed scans (never "no phone seen" from a run that
         never ran) and a confirmed hit still needs confirmCount. */
      precheckPhoneSampleMs: 700,  // phone pass cadence during the pre-check
      precheckBlankSampleMs: 250,  // blank sampling — its OWN loop, never delayed by inference
      /* v91 Part 4 — reads that saw NO new frame (sampler alive, video
         stalled) which declare the picture FROZEN when at most the
         baseline read was fresh: 4 × 250ms ≈ 1s of verified stall. A
         slow-but-live camera keeps delivering fresh frames between
         reads and is never called frozen. */
      precheckBlankFrozenReads: 4, // sustained frozen reads → the picture is frozen
      precheckWindowMs: 4000,      // observation window for pre-checks
      /* v91 — stages get their OWN timeouts (Part 7). A slow phone
         starting its camera is not the same failure as a frozen feed,
         and a hung inference must never hang the pre-check. None of
         these weaken a security threshold: they only decide how long
         each stage may take and HOW the outcome is reported. */
      precheckFeedTimeoutMs: 8000,     // stage: stream attached → first usable frame
      precheckMetadataTimeoutMs: 4000, // stage: stream attached → metadata + nonzero size
      /* v91 — the permission/device requests themselves are stages too
         (Part 7): getUserMedia stays pending forever on an unanswered
         prompt or a wedged driver, and a hung model fetch must not
         freeze the pre-check either. On timeout the stage FAILS with
         its own copy (retry remains available), and a stream that
         arrives after we gave up is stopped on arrival — never leaked. */
      precheckRequestTimeoutMs: 20000, // stage: camera/mic permission request
      precheckModelTimeoutMs: 20000,   // stage: detection model load
      inferTimeoutMs: 8000,            // stage: ONE inference pass (pre-check AND live)
      inferTimeoutGivesUp: 2,          // consecutive inference timeouts = detector hung
      frameFreshMs: 1000,          // a camera frame older than this counts as stale
      modelTimeoutMs: 45000        // a model that takes longer than this fails
    },

    /* A. Black / blank / covered camera.
       One dark frame or a lighting change never counts: a frame is
       only "suspect" when it is dark AND flat, or completely flat
       (covered lens), and the picture only counts as CONFIRMED when
       most samples inside a short observation window are suspect. */
    black: {
      darkLumaMax: 26,             // mean luma (0-255) at or below this = dark
      darkStdMax: 12,              // and flat (no detail) at or below this
      uniformStdMax: 7,            // flat at any brightness = covered lens
      windowMs: 3000,              // observation window
      minSamples: 8,               // need at least this many samples in it
      confirmRatio: 0.75,          // and this share of them suspect
      warnGraceMs: 2000,           // v93 — exactly 2s to restore the picture after a warning
      clearGapMs: 5000             // blank this long = the incident is over
    },

    /* B. Face / person presence (MediaPipe BlazeFace short range). */
    face: {
      minScore: 0.50,              // detection confidence
      mergeIou: 0.30,              // overlapping boxes = ONE face, not two
      precheckSamples: 8,          // samples taken before the exam starts
      precheckMinOk: 6,            // this many must show EXACTLY one face
      lostGraceMs: 4000,           // short gaps (movement) never trigger a warning
      warnGraceMs: 2000,           // v93 — exactly 2s to return to frame after a warning
      clearGapMs: 4000,            // absent this long = the incident is over
      /* MORE THAN ONE FACE — v89. One stray multi-face frame is not
         proof (a passer-by at the edge, a poster); the detector must
         see more than one person persistently (multipleConfirmMs)
         before the engine is told. From then on the standard
         one-warning policy applies: one warning, and if a second
         confirmed multi-face incident occurs — or the first one
         outlives its grace window — the attempt is terminated. */
      multipleConfirmMs: 3000,     // >1 face must persist this long to confirm
      multipleWarnGraceMs: 2000,   // v93 — exactly 2s to clear the extra person after a warning
      multipleClearGapMs: 4000,    // multi-face gone this long = incident over
      /* v93 Parts 4–5 — PROXIMITY. Face size is measured as a fraction
         of the camera frame (never a physical distance — a webcam
         cannot measure centimetres from one image). Two guards apply
         together: an ABSOLUTE floor (so a student who starts too far
         away cannot lock in an invalid baseline) and a RELATIVE rule
         (the live face must stay near the accepted baseline size and
         position). Thresholds are fractions, so they hold across
         webcams/resolutions. The 0.65 shrink ratio and 20% centre
         drift separate ordinary posture sway from a real move-away. */
      proxMinWidthFrac: 0.18,      // absolute floor: face width < 18% of frame = too far
      proxMinHeightFrac: 0.14,     // absolute floor on height (guards squat/tilt framing)
      proxShrinkRatio: 0.65,       // live width < 65% of baseline = moved away
      proxDriftFrac: 0.20,         // centre moved > 20% of frame from baseline = left position
      proxCentreMargin: 0.05,      // baseline centre must sit inside 5%…95% of the frame
      proxConfirmMs: 2000,         // must persist this long before the engine is told
      proxWarnGraceMs: 2000,       // v93 — exactly 2s to restore position after a warning
      proxClearGapMs: 4000         // in-position this long = the incident is over
    },

    /* C. Phone-like object (COCO object detector, "cell phone").
       v93 Part 6 — response latency target: the confirmation window is
       3s and the policy is `immediate`, so a genuine phone is
       confirmed in ~2s (needs confirmCount hits inside the window) and
       then terminates with NO extra grace. This is the smallest window
       that still refuses a single uncertain frame (a transient
       false-positive) as proof. */
    phone: {
      allowCategories: ["cell phone"],   // ONLY this class is ever acted on
      scoreThreshold: 0.45,        // below this a prediction is ignored
      confirmCount: 3,             // detections needed to confirm…
      confirmWindowMs: 3000,       // …within this window (one frame is never proof)
      warnGraceMs: 2000,           // (kept for the table; phone is `immediate` — no grace)
      clearGapMs: 4000             // out of view this long = the incident is over
    },

    /* D. Microphone, calibration, voice and other sound. */
    audio: {
      fftSize: 2048,               // analyser window
      calibMs: 3000,               // ambient calibration length
      calibMinFrames: 15,          // frames required for a valid calibration
      noisePercentile: 75,         // ambient level = this percentile of RMS
      speechGateMul: 3.0,          // speech gate = ambient × this…
      speechGateMin: 0.012,        // …but never below this absolute gate
      soundGateMul: 6.0,           // "significant sound" gate = ambient × this
      pitchMinHz: 70,              // voiced-periodicity search range
      pitchMaxHz: 400,
      pitchConfMin: 0.35,          // normalised autocorrelation needed for "voiced"
      voiceSustainMs: 900,         // voiced audio must last this long to confirm
      voiceGapResetMs: 500,        // unvoiced this long ends the current incident
      soundSustainMs: 800,         // significant non-speech sound must last this long
      soundGapResetMs: 500,
      /* v93 Part 8 — TIMING MATH (measured, not guessed):
         the watcher confirms a voice incident at onset + ~700ms
         (voiceSustainMs 900 minus the two frame steps back-dated into
         voiceSince) and a sound incident at onset + ~600ms
         (soundSustainMs 800, same back-dating). The engine then
         terminates at warnedAt + graceMs (checked on the 100ms audio
         loop). With a 2000ms grace the sustained event lasts
         700+2000+≤100 = 2.8s (voice) / 600+2000+≤100 = 2.7s (sound)
         from first detection — inside the required 2.5–3.0s band with
         margin on both ends — while the WARNING itself is exactly the
         uniform 2 seconds every violation uses. No extra multi-second
         grace follows a confirmed sustained event. */
      warnGraceVoiceMs: 2000,      // continuous speech → terminate exactly 2s after the warning
      warnGraceSoundMs: 2000,      // continuous significant sound → terminate exactly 2s after
      clearGapMs: 4000,
      digitalSilenceMs: 6000       // exactly-zero audio this long = microphone not working
    },

    /* Monitoring failure recovery windows (camera / mic / pipeline). */
    recovery: {
      cameraMs: 10000,
      microphoneMs: 10000,
      pipelineMs: 10000,
      frozenVideoMs: 4000,         // no new picture for this long = frozen
      maxDetectionFailures: 5      // this many inference errors in a row = broken
    },

    /* Fullscreen: the exam never starts, and never resumes, without
       a VERIFIED fullscreen element. */
    fullscreen: {
      verifyTimeoutMs: 1500        // how long we wait for the state to settle
    }
  };

  /* ============================================================
     VIOLATION TYPES — the single policy table for sensor events.
     `immediate` types terminate with NO warning; everything else
     warns exactly once and then terminates if the violation
     persists past its grace window or occurs again after the
     warning has been used.
     ============================================================ */
  var VIOLATIONS = {
    "camera-blank": {
      title: "Camera Not Visible",
      message: "Your camera feed appears blank or covered. Restore a clear camera view immediately. If the problem continues, your exam will end.",
      graceMs: function () { return CONFIG.black.warnGraceMs; },
      clearGapMs: function () { return CONFIG.black.clearGapMs; }
    },
    "face-missing": {
      title: "Face Not Detected",
      message: "Please remain visible in the camera frame. Your exam may be terminated if your face remains out of view.",
      graceMs: function () { return CONFIG.face.warnGraceMs; },
      clearGapMs: function () { return CONFIG.face.clearGapMs; }
    },
    "face-multiple": {
      title: "More Than One Person Detected",
      message: "More than one person has been detected in the camera frame. You must sit the exam alone in view of the camera. A second confirmed incident will end your exam.",
      graceMs: function () { return CONFIG.face.multipleWarnGraceMs; },
      clearGapMs: function () { return CONFIG.face.multipleClearGapMs; }
    },
    "face-proximity": {
      title: "Move Back Into Position",
      message: "You have moved too far from the position you were checked in at, or your face is no longer clearly in view. Return to your seat close to the camera. If you do not restore your position, your exam will end.",
      graceMs: function () { return CONFIG.face.proxWarnGraceMs; },
      clearGapMs: function () { return CONFIG.face.proxClearGapMs; }
    },
    "phone-detected": {
      title: "Mobile Phone Detected",
      message: "A mobile-phone-like object has been detected in the camera view. Remove it from the visible exam area immediately. A confirmed detection will end your exam.",
      immediate: true,             // v93 — confirmed phone = immediate termination, no grace
      graceMs: function () { return CONFIG.phone.warnGraceMs; },
      clearGapMs: function () { return CONFIG.phone.clearGapMs; }
    },
    "voice-detected": {
      title: "Voice Detected",
      message: "Speech has been detected during your exam. The exam will end if the voice continues or another speaking incident is detected.",
      graceMs: function () { return CONFIG.audio.warnGraceVoiceMs; },
      clearGapMs: function () { return CONFIG.audio.clearGapMs; }
    },
    "sound-detected": {
      title: "Prohibited Sound Detected",
      message: "A significant sound above your room's calibrated background level has been detected. Continued or repeated sound will end your exam.",
      graceMs: function () { return CONFIG.audio.warnGraceSoundMs; },
      clearGapMs: function () { return CONFIG.audio.clearGapMs; }
    },
    "camera-lost": {
      title: "Camera Unavailable",
      message: "Your camera stopped sending video. Restore your camera now — if monitoring cannot be restored shortly, your exam will end.",
      graceMs: function () { return CONFIG.recovery.cameraMs; },
      clearGapMs: function () { return CONFIG.recovery.cameraMs; }
    },
    "microphone-lost": {
      title: "Microphone Unavailable",
      message: "Your microphone stopped working. Restore it now — if monitoring cannot be restored shortly, your exam will end.",
      graceMs: function () { return CONFIG.recovery.microphoneMs; },
      clearGapMs: function () { return CONFIG.recovery.microphoneMs; }
    },
    "monitoring-failure": {
      title: "Monitoring Interrupted",
      message: "Exam monitoring could not read camera or audio data. It is being restarted — if it does not recover shortly, your exam will end.",
      graceMs: function () { return CONFIG.recovery.pipelineMs; },
      clearGapMs: function () { return CONFIG.recovery.pipelineMs; }
    }
  };

  /* The states an attempt's security controller can be in. */
  var STATES = ["PRECHECK", "READY", "IN_PROGRESS", "WARNING_SHOWN", "TERMINATING", "TERMINATED", "SUBMITTED"];

  /* Pre-exam check identifiers, in display order. */
  var CHECK_IDS = [
    "models", "camera", "camera-feed", "camera-blank", "face", "face-proximity", "phone",
    "mic", "mic-calibration", "voice-ready",
    "fullscreen-support", "fullscreen", "store", "controller"
  ];
  var CHECK_LABELS = {
    models: "Detection models",
    camera: "Camera permission & device",
    "camera-feed": "Live camera feed",
    "camera-blank": "Camera not blank or covered",
    face: "Exactly one person visible",
    "face-proximity": "Face clearly visible and close enough",
    phone: "No phone-like object",
    mic: "Microphone permission & device",
    "mic-calibration": "Microphone audio calibration",
    "voice-ready": "Voice detection readiness",
    "fullscreen-support": "Fullscreen support",
    fullscreen: "Fullscreen active",
    store: "Answer saving",
    controller: "Exam monitoring controller"
  };
  /* Checks that must read "ready" before the exam may start. `fullscreen`
     flips to ready only when it is actually entered (on the Begin click);
     `controller` is ready as soon as the engine exists. */
  var MANDATORY_CHECKS = CHECK_IDS.slice();

  /* Statuses a check may carry (the states the brief requires). */
  var STATUS = {
    CHECKING: "checking",
    READY: "ready",
    FAILED: "failed",
    PERMISSION: "permission",
    UNSUPPORTED: "unsupported",
    RETRY: "retry",
    PENDING: "pending",
    IDLE: "idle"
  };

  /* ============================================================
     SMALL PURE HELPERS (all covered by tests)
     ============================================================ */

  /* Luma statistics of a sampled frame. Accepts a single-channel
     array (0-255) or an RGBA buffer. Returns mean and population
     standard deviation — the two numbers blank detection needs. */
  function lumaStats(data, stride) {
    if (!data || !data.length) return null;
    var step = stride || 1;
    var n = Math.floor(data.length / step);
    if (n <= 0) return null;
    var sum = 0, i, v;
    for (i = 0; i < n; i++) { v = data[i * step]; sum += v; }
    var mean = sum / n;
    var varSum = 0;
    for (i = 0; i < n; i++) { v = data[i * step] - mean; varSum += v * v; }
    return { mean: mean, std: Math.sqrt(varSum / n), samples: n };
  }

  /* Is one frame suspect? Dark AND flat, or flat at any brightness
     (a covered lens is usually not black). One suspect frame proves
     nothing — only the rolling window does. */
  function isSuspectFrame(stats, cfg) {
    if (!stats) return false;
    var c = cfg || CONFIG.black;
    var flat = stats.std <= c.uniformStdMax;
    var darkFlat = stats.mean <= c.darkLumaMax && stats.std <= c.darkStdMax;
    return flat || darkFlat;
  }

  /* Rolling observation window of suspect/normal frames. */
  function createBlackWatcher(cfg) {
    var c = cfg || CONFIG.black;
    var seen = [];      // [{at, suspect}]
    function observe(stats, at) {
      seen.push({ at: at, suspect: isSuspectFrame(stats, c) });
      var cutoff = at - c.windowMs;
      while (seen.length && seen[0].at < cutoff) seen.shift();
      return seen[seen.length - 1];
    }
    function verdict(at) {
      var cutoff = at - c.windowMs;
      var inWindow = seen.filter(function (s) { return s.at >= cutoff; });
      if (inWindow.length < c.minSamples) return { confirmed: false, insufficient: true, ratio: 0, count: inWindow.length };
      var bad = inWindow.filter(function (s) { return s.suspect; }).length;
      var ratio = bad / inWindow.length;
      return { confirmed: ratio >= c.confirmRatio, insufficient: false, ratio: ratio, count: inWindow.length, bad: bad };
    }
    function reset() { seen = []; }
    return { observe: observe, verdict: verdict, reset: reset, size: function () { return seen.length; } };
  }

  /* Normalise a detection box to {x, y, width, height}. MediaPipe
     tasks-vision emits `boundingBox: {originX, originY, width, height}`
     while the test harness (and some adapters) emit {x, y, …}. Accept
     both so overlap-merging and proximity maths see one shape. */
  function normBox(b) {
    if (!b) return null;
    var x = typeof b.x === "number" ? b.x : (typeof b.originX === "number" ? b.originX : null);
    var y = typeof b.y === "number" ? b.y : (typeof b.originY === "number" ? b.originY : null);
    if (x === null || y === null) return null;
    return { x: x, y: y, width: b.width || 0, height: b.height || 0 };
  }

  /* Merge detection boxes that overlap enough — BlazeFace can emit
     two boxes for one face, which must never read as "two people". */
  function boxIou(a, b) {
    a = normBox(a); b = normBox(b);
    if (!a || !b) return 0;
    var x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
    var x2 = Math.min(a.x + (a.width || 0), b.x + (b.width || 0));
    var y2 = Math.min(a.y + (a.height || 0), b.y + (b.height || 0));
    var inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    if (inter <= 0) return 0;
    var areaA = Math.max(0, (a.width || 0)) * Math.max(0, (a.height || 0));
    var areaB = Math.max(0, (b.width || 0)) * Math.max(0, (b.height || 0));
    var union = areaA + areaB - inter;
    return union > 0 ? inter / union : 0;
  }

  /* Count DISTINCT faces above the confidence floor. */
  function countFaces(detections, cfg) {
    var c = cfg || CONFIG.face;
    var kept = [];
    (detections || []).forEach(function (d) {
      var score = d && typeof d.score === "number" ? d.score
        : (d && d.categories && d.categories[0] && d.categories[0].score) || 0;
      if (score < c.minScore) return;
      var box = d.box || d.boundingBox || null;
      if (!box) { kept.push(d); return; }
      box = normBox(box);
      if (!box) { kept.push(d); return; }
      for (var i = 0; i < kept.length; i++) {
        if (boxIou(box, kept[i].box || kept[i].boundingBox || null) >= c.mergeIou) {
          if (score > (kept[i].score || 0)) kept[i] = d;
          return;
        }
      }
      kept.push(d);
    });
    return kept.length;
  }

  /* Merge overlapping detections to DISTINCT faces and return the kept
     list (each with a normalised box). countFaces returns only the
     count; proximity needs the actual winning box. */
  function mergeFaceDetections(detections, cfg) {
    var c = cfg || CONFIG.face;
    var kept = [];
    (detections || []).forEach(function (d) {
      var score = d && typeof d.score === "number" ? d.score
        : (d && d.categories && d.categories[0] && d.categories[0].score) || 0;
      if (score < c.minScore) return;
      var box = normBox(d.box || d.boundingBox || null);
      var entry = { score: score, box: box };
      if (!box) { kept.push(entry); return; }
      for (var i = 0; i < kept.length; i++) {
        if (kept[i].box && boxIou(box, kept[i].box) >= c.mergeIou) {
          if (score > kept[i].score) kept[i] = entry;
          return;
        }
      }
      kept.push(entry);
    });
    return kept;
  }

  /* Proximity geometry from ONE normalised face box against a frame of
     known pixel size. All outputs are fractions so the same thresholds
     hold across webcams and resolutions:
       widthFrac / heightFrac — face size relative to the full frame
       centreX / centreY      — face centre as 0…1 of frame w/h
     Returns null when the box or frame size is unusable (never a
     silently-passing measurement). */
  function faceBoxMetrics(box, frameW, frameH) {
    var b = normBox(box);
    if (!b || !frameW || !frameH || frameW <= 0 || frameH <= 0) return null;
    if (!(b.width > 0) || !(b.height > 0)) return null;
    return {
      widthFrac: b.width / frameW,
      heightFrac: b.height / frameH,
      centreX: (b.x + b.width / 2) / frameW,
      centreY: (b.y + b.height / 2) / frameH
    };
  }

  /* Highest-confidence phone prediction in one frame, or null. */
  function bestPhoneDetection(detections, cfg) {
    var c = cfg || CONFIG.phone;
    var best = null;
    (detections || []).forEach(function (d) {
      var cats = d && d.categories ? d.categories : [];
      for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];
        var label = String(cat.label || cat.categoryName || "").toLowerCase();
        if (c.allowCategories.indexOf(label) === -1) continue;
        var score = typeof cat.score === "number" ? cat.score : 0;
        if (score < c.scoreThreshold) continue;
        if (!best || score > best.score) best = { score: score, label: label };
      }
    });
    return best;
  }

  /* Count phone detections of one sample list that fall in a window. */
  function countRecent(list, at, windowMs) {
    var cutoff = at - windowMs;
    return list.filter(function (x) { return x.at >= cutoff; }).length;
  }

  /* ---------- audio features ----------------------------------
     One analysis frame of raw time-domain samples. Returns:
       rms  — energy (0…1-ish)
       zcr  — zero-crossing rate (broadband-ness)
       conf — normalised autocorrelation peak in the voiced pitch
              range: high = a periodic (voiced) signal like speech,
              low = noise (keyboard, fan, clap).                */
  function audioFeatures(data, sampleRate, cfg) {
    if (!data || !data.length) return null;
    var c = cfg || CONFIG.audio;
    var n = data.length;
    var sum = 0, zc = 0, prev = data[0], i, v;
    var peak = 0;
    for (i = 0; i < n; i++) {
      v = data[i];
      sum += v * v;
      if (i > 0 && ((v >= 0) !== (prev >= 0))) zc++;
      prev = v;
      var av = v < 0 ? -v : v;
      if (av > peak) peak = av;
    }
    var rms = Math.sqrt(sum / n);
    var zcr = zc / Math.max(1, n - 1);

    /* Pitch search: normalised autocorrelation over the voiced range. */
    var sr = sampleRate || 44100;
    var lagMin = Math.max(2, Math.floor(sr / c.pitchMaxHz));
    var lagMax = Math.min(n - 8, Math.ceil(sr / c.pitchMinHz));
    var conf = 0, freq = 0;
    if (lagMax > lagMin) {
      var e0 = 0;
      for (i = 0; i < n; i++) e0 += data[i] * data[i];
      if (e0 > 1e-9) {
        for (var lag = lagMin; lag <= lagMax; lag++) {
          var acc = 0, m = n - lag;
          for (i = 0; i < m; i++) acc += data[i] * data[i + lag];
          var norm = acc / e0;
          if (norm > conf) { conf = norm; freq = sr / lag; }
        }
      }
    }
    return { rms: rms, zcr: zcr, conf: conf, freq: freq, peak: peak };
  }

  function percentile(values, p) {
    if (!values.length) return 0;
    var s = values.slice().sort(function (a, b) { return a - b; });
    var idx = Math.min(s.length - 1, Math.max(0, Math.round((p / 100) * (s.length - 1))));
    return s[idx];
  }

  /* ---------- the audio watcher -------------------------------
     Phase 1 (pre-exam): calibrate against the room's own ambient
     noise. Phase 2 (live): classify every frame as silence /
     ambient / voiced speech / other significant sound.          */
  function createAudioWatcher(cfg) {
    var c = cfg || CONFIG.audio;
    var calibrated = false;
    var noiseFloor = 0;
    var gate = c.speechGateMin;
    var soundGate = c.speechGateMin * 2;
    var calib = [];
    var voiceSince = null, voiceActive = false, lastVoiceAt = null;
    var soundSince = null, soundActive = false, lastSoundAt = null;
    var digitalSilenceSince = null;

    function addCalibrationFrame(f) {
      if (!f || !isFinite(f.rms)) return false;
      calib.push(f.rms);
      return true;
    }
    function finishCalibration() {
      if (calib.length < c.calibMinFrames) return { ok: false, reason: "not-enough-frames", frames: calib.length };
      var allZero = calib.every(function (r) { return r === 0; });
      if (allZero) return { ok: false, reason: "digital-silence", frames: calib.length };
      noiseFloor = Math.max(1e-5, percentile(calib, c.noisePercentile));
      gate = Math.max(noiseFloor * c.speechGateMul, c.speechGateMin);
      soundGate = Math.max(noiseFloor * c.soundGateMul, c.speechGateMin * 2);
      calibrated = true;
      calib = [];
      return { ok: true, noiseFloor: noiseFloor, gate: gate, soundGate: soundGate };
    }

    /* One live analysis frame. Returns flags + the reason codes the
       engine turns into violations. */
    function observe(f, at, frameMs) {
      if (!f || !isFinite(f.rms)) return { valid: false };
      var step = frameMs || c.audioIntervalMs || 100;

      /* Microphone pipeline health: EXACT zeros for a sustained
         stretch while the track claims to be live means no audio is
         actually arriving. */
      if (f.rms === 0 && f.peak === 0) {
        if (digitalSilenceSince === null) digitalSilenceSince = at;
      } else {
        digitalSilenceSince = null;
      }
      var micDead = digitalSilenceSince !== null && (at - digitalSilenceSince) >= c.digitalSilenceMs;

      var voiced = !!(calibrated && f.rms > gate && f.conf >= c.pitchConfMin);
      var loudNoise = !!(calibrated && f.rms > soundGate && f.conf < c.pitchConfMin);

      /* Voice incident. A voiced frame starts or continues a speaking
         turn; short unvoiced pauses INSIDE a turn (breaths between
         words) never reset it — only a real gap longer than
         voiceGapResetMs ends the incident, so a student cannot avoid
         detection by speaking in short bursts. The incident CONFIRMS
         once the turn has lasted voiceSustainMs. */
      if (voiced) {
        if (voiceSince === null) voiceSince = at - step;
        lastVoiceAt = at;
        voiceActive = (at - voiceSince + step) >= c.voiceSustainMs;
      } else if (voiceSince !== null && lastVoiceAt !== null && (at - lastVoiceAt) >= c.voiceGapResetMs) {
        voiceSince = null;
        voiceActive = false;
      }

      /* Significant non-speech sound incident — same hangover rules. */
      if (loudNoise) {
        if (soundSince === null) soundSince = at - step;
        lastSoundAt = at;
        soundActive = (at - soundSince + step) >= c.soundSustainMs;
      } else if (soundSince !== null && lastSoundAt !== null && (at - lastSoundAt) >= c.soundGapResetMs) {
        soundSince = null;
        soundActive = false;
      }

      return {
        valid: true,
        voiced: voiced,
        voiceEvent: voiceActive,
        soundEvent: soundActive,
        micDead: micDead,
        rms: f.rms,
        conf: f.conf
      };
    }

    function reset() { calib = []; voiceSince = null; voiceActive = false; lastVoiceAt = null; soundSince = null; soundActive = false; lastSoundAt = null; digitalSilenceSince = null; }

    /* Explicitly adopt a VALIDATED calibration produced by another
       watcher instance (the pre-check's), e.g. when the runtime had to
       create a fresh watcher after releaseAll(). The gates are
       sanity-checked: a corrupt or hostile value can never open the
       detector to noise (gate below the absolute floor) or silence it
       (non-finite / non-positive). Returns false — and changes
       nothing — if the calibration is not usable. */
    function applyCalibration(g) {
      if (!g || typeof g !== "object") return false;
      var nf = Number(g.noiseFloor), sg = Number(g.speechGate), sdg = Number(g.soundGate);
      if (!isFinite(nf) || nf <= 0) return false;
      if (!isFinite(sg) || sg < c.speechGateMin) return false;
      if (!isFinite(sdg) || sdg < sg) return false;
      noiseFloor = nf;
      gate = sg;
      soundGate = sdg;
      calibrated = true;
      calib = [];
      return true;
    }
    return {
      addCalibrationFrame: addCalibrationFrame,
      finishCalibration: finishCalibration,
      applyCalibration: applyCalibration,
      observe: observe,
      reset: reset,
      isCalibrated: function () { return calibrated; },
      gates: function () { return { noiseFloor: noiseFloor, speechGate: gate, soundGate: soundGate }; },
      calibFrames: function () { return calib.length; }
    };
  }

  /* ============================================================
     THE VIOLATION ENGINE — state machine, one warning per type,
     one idempotent termination path.
     ============================================================ */
  function createEngine(opts) {
    var o = opts || {};
    var now = typeof o.now === "function" ? o.now : function () { return Date.now(); };
    var persist = typeof o.persist === "function" ? o.persist : function () {};
    var onWarn = typeof o.onWarn === "function" ? o.onWarn : function () {};
    var onTerminate = typeof o.onTerminate === "function" ? o.onTerminate : function () {};
    var attemptId = o.attemptId || null;

    var state = "PRECHECK";
    var record = {
      attemptId: attemptId,
      state: state,
      startedAt: null,
      endedAt: null,
      warnings: {},              // {type: count} — NEVER resets on refresh/navigation
      violations: [],            // confirmed incidents that ended the exam
      termination: null,         // {reason, detail, at}
      submitted: false,
      monitoringFailures: []     // [{type, at, recovered}]
    };

    /* per-type live bookkeeping (rebuilt from the record on load) */
    var warned = {};             // type -> true once its ONE warning is used
    var warnedAt = {};           // type -> timestamp of that warning
    var unconfirmedSince = {};   // type -> when the violation last cleared
    var clearedAfterWarn = {};   // type -> violation cleared after the warning
    var lastConfirmed = {};      // type -> last confirmed timestamp

    function setRecordState(s) { state = s; record.state = s; }
    function save() { try { persist(cloneRecord()); } catch (e) { /* storage is best-effort */ } }
    function cloneRecord() { return JSON.parse(JSON.stringify(record)); }

    function markReady() {
      if (state === "PRECHECK") setRecordState("READY");
      save();
      return state;
    }

    function startAttempt(id) {
      /* v89 — ordering fixed: a terminal engine is never re-tagged
         with a new attempt id (that would pollute the old record and,
         via persist(), write the old termination onto the new
         attempt). */
      if (isTerminal()) return state;   // terminal, never revived
      if (id) { attemptId = id; record.attemptId = id; }
      record.startedAt = now();
      setRecordState("IN_PROGRESS");
      save();
      return state;
    }

    /* v89 — start a FRESH lifecycle for a new attempt (Part 4).
       Valid only when nothing live is being monitored: PRECHECK/READY
       (a check screen that never began) or a TERMINATED/SUBMITTED
       controller. An IN_PROGRESS / WARNING_SHOWN engine is never
       silently replaced — the caller must finish that attempt first.
       Every per-attempt structure is rebuilt: warnings, monitor
       bookkeeping, attempt id, calibration-adjacent timestamps. A
       new attempt can therefore never inherit the previous one's
       security state. */
    function reset(newAttemptId) {
      if (state === "IN_PROGRESS" || state === "WARNING_SHOWN" || state === "TERMINATING") {
        return { ok: false, state: state };
      }
      state = "PRECHECK";
      attemptId = (newAttemptId === undefined) ? null : newAttemptId;
      record = {
        attemptId: attemptId,
        state: state,
        startedAt: null,
        endedAt: null,
        warnings: {},
        violations: [],
        termination: null,
        submitted: false,
        monitoringFailures: []
      };
      warned = {};
      warnedAt = {};
      unconfirmedSince = {};
      clearedAfterWarn = {};
      lastConfirmed = {};
      return { ok: true, state: state };
    }

    /* Restore the persisted security record after a refresh: warning
       counts and prior incidents survive, so a warning can never be
       reset by reloading the page or moving between questions. */
    function load(persisted) {
      if (!persisted || typeof persisted !== "object") return record;
      /* v89 — a persisted record for a DIFFERENT attempt is never
         merged in (Part 4): warnings belong to exactly one attempt. */
      if (persisted.attemptId && record.attemptId && persisted.attemptId !== record.attemptId) return record;
      if (persisted.attemptId && !record.attemptId) { attemptId = persisted.attemptId; record.attemptId = persisted.attemptId; }
      if (Array.isArray(persisted.warnings)) {
        persisted.warnings.forEach(function (t) { record.warnings[t] = (record.warnings[t] || 0) + 1; });
      } else if (persisted.warnings && typeof persisted.warnings === "object") {
        Object.keys(persisted.warnings).forEach(function (t) { record.warnings[t] = persisted.warnings[t]; });
      }
      if (Array.isArray(persisted.violations)) record.violations = record.violations.concat(persisted.violations).slice(-20);
      if (Array.isArray(persisted.monitoringFailures)) record.monitoringFailures = persisted.monitoringFailures.slice(-20);
      if (persisted.termination && !record.termination) record.termination = persisted.termination;
      if (persisted.startedAt && !record.startedAt) record.startedAt = persisted.startedAt;
      Object.keys(record.warnings).forEach(function (t) { warned[t] = true; });
      if (persisted.termination) {
        record.termination = persisted.termination;
        record.endedAt = persisted.endedAt || (persisted.termination && persisted.termination.at) || record.endedAt;
        setRecordState("TERMINATED");
      } else if (persisted.submitted) {
        record.submitted = true;
        setRecordState("SUBMITTED");
      } else if (state === "PRECHECK" && record.startedAt) {
        setRecordState("IN_PROGRESS");
      }
      return record;
    }

    function isTerminal() { return state === "TERMINATED" || state === "SUBMITTED" || state === "TERMINATING"; }
    function isRunning() { return state === "IN_PROGRESS" || state === "WARNING_SHOWN"; }

    /* ---- warnings ------------------------------------------- */
    function noteMonitoringFailure(type, at) {
      var t = typeof at === "number" ? at : now();
      record.monitoringFailures.push({ type: type, at: t, recovered: false });
      record.monitoringFailures = record.monitoringFailures.slice(-20);
      save();
    }
    function noteMonitoringRecovered(type, at) {
      var t = typeof at === "number" ? at : now();
      for (var i = record.monitoringFailures.length - 1; i >= 0; i--) {
        if (record.monitoringFailures[i].type === type && !record.monitoringFailures[i].recovered) {
          record.monitoringFailures[i].recovered = true;
          record.monitoringFailures[i].recoveredAt = t;
          break;
        }
      }
      save();
    }

    /* THE one report path. `confirmed` says whether this cycle really
       shows the violation right now. Returns the action taken:
       "warn" | "terminate" | "ignore". */
    function report(type, confirmed, detail, at) {
      if (isTerminal()) return { action: "ignore", state: state };
      if (!isRunning()) return { action: "ignore", state: state };
      var policy = VIOLATIONS[type];
      if (!policy) return { action: "ignore", state: state, error: "unknown-violation" };
      var t = typeof at === "number" ? at : now();

      if (!confirmed) {
        /* The violation is not present this cycle. Only a SUSTAINED
           clear (past clearGapMs) counts as "the incident is over" —
           one missed frame must not let a used warning reset. */
        if (unconfirmedSince[type] === undefined || unconfirmedSince[type] === null) {
          unconfirmedSince[type] = t;
        } else if (t - unconfirmedSince[type] >= policy.clearGapMs()) {
          clearedAfterWarn[type] = true;
          unconfirmedSince[type] = null;
        }
        if (state === "WARNING_SHOWN" && !anyActiveWarning(t)) setRecordState("IN_PROGRESS");
        return { action: "ignore", state: state };
      }

      unconfirmedSince[type] = null;
      lastConfirmed[type] = t;

      /* v93 Part 6/7 — an `immediate` policy type terminates on its
         FIRST confirmed occurrence with NO warning window: a confirmed
         phone / prohibited device has no grace period. It still routes
         through the single terminate() path, so termination stays
         idempotent and duplicate detector results are ignored. */
      if (policy.immediate) {
        if (!warned[type]) warned[type] = true;   // counted once, no banner
        terminate(type, detail || (policy.title + " confirmed — no grace period applies."), t);
        return { action: "terminate", state: state };
      }

      if (!warned[type]) {
        /* FIRST confirmed incident → one warning, counted forever. */
        warned[type] = true;
        warnedAt[type] = t;
        record.warnings[type] = (record.warnings[type] || 0) + 1;
        if (state !== "WARNING_SHOWN") setRecordState("WARNING_SHOWN");
        save();
        var ev = {
          type: type, at: t,
          title: policy.title, message: policy.message,
          count: record.warnings[type],
          graceMs: policy.graceMs(),
          detail: detail || null
        };
        try { onWarn(ev); } catch (e) { /* UI errors never change the verdict */ }
        return { action: "warn", state: state, event: ev };
      }

      /* Warning already used: terminate when the violation RECURS
         after it cleared, or when it persists past its grace window. */
      var repeat = !!clearedAfterWarn[type];
      var persisted = t - (warnedAt[type] || t) >= policy.graceMs();
      if (repeat || persisted) {
        terminate(type, repeat
          ? (detail || (policy.title + " recurred after the warning was used."))
          : (detail || (policy.title + " persisted after the warning.")), t);
        return { action: "terminate", state: state };
      }
      return { action: "continue", state: state };
    }

    function anyActiveWarning(t) {
      var active = false;
      Object.keys(warned).forEach(function (type) {
        if (!warned[type]) return;
        var policy = VIOLATIONS[type];
        if (!policy) return;
        var cleared = clearedAfterWarn[type] && unconfirmedSince[type] === null && lastConfirmed[type] === undefined;
        if (!cleared) {
          if (lastConfirmed[type] !== undefined && t - (warnedAt[type] || 0) < policy.graceMs()) active = true;
        }
      });
      return active;
    }

    /* THE single termination path. Idempotent: only the first call
       for an attempt ever transitions, records and notifies. */
    function terminate(reason, detail, at) {
      if (isTerminal()) return { action: "ignore", state: state };
      var t = typeof at === "number" ? at : now();
      setRecordState("TERMINATING");
      record.termination = { reason: reason || "unknown", detail: detail || null, at: t };
      record.endedAt = t;
      record.violations.push({ type: reason || "unknown", detail: detail || null, at: t });
      record.violations = record.violations.slice(-20);
      save();
      var ev = { reason: reason || "unknown", detail: detail || null, at: t, title: (VIOLATIONS[reason] || {}).title || null };
      try { onTerminate(ev); } catch (e) { /* the app handler owns its own errors */ }
      setRecordState("TERMINATED");
      save();
      return { action: "terminate", state: state, event: ev };
    }

    function markSubmitted(at) {
      if (state === "TERMINATED" || state === "TERMINATING") return state;
      var t = typeof at === "number" ? at : now();
      record.submitted = true;
      record.endedAt = t;
      setRecordState("SUBMITTED");
      save();
      return state;
    }

    /* Terminal WITHOUT notifying — used when the app itself owns the
       termination (the central disqualification path fired directly,
       e.g. a confirmed tab switch recorded before the engine saw it).
       Records the reason for the persisted security record but never
       re-enters onTerminate, so the funnel stays single. */
    function markTerminated(reason, at) {
      if (isTerminal()) return state;
      var t = typeof at === "number" ? at : now();
      record.termination = { reason: reason || "unknown", detail: null, at: t };
      record.endedAt = t;
      setRecordState("TERMINATED");
      save();
      return state;
    }

    return {
      CONFIG: CONFIG,
      getState: function () { return state; },
      getRecord: cloneRecord,
      warningsFor: function (type) { return record.warnings[type] || 0; },
      wasWarned: function (type) { return !!warned[type]; },
      markReady: markReady,
      startAttempt: startAttempt,
      reset: reset,
      load: load,
      report: report,
      terminate: terminate,
      markSubmitted: markSubmitted,
      markTerminated: markTerminated,
      noteMonitoringFailure: noteMonitoringFailure,
      noteMonitoringRecovered: noteMonitoringRecovered,
      persist: save
    };
  }

  /* ============================================================
     PRE-EXAM SECURITY CHECK

     `runPrechecks` orchestrates the checks against INJECTED
     providers, so the exact same code path runs in the browser
     (real camera, real models) and in tests (clearly identified
     mocks). It never starts anything itself — it reports status
     and returns {ok, checks}.
     ============================================================ */
  function defaultReport() {}
  /* v90 — a re-entered pre-check abandons the previous window's
     sampling loops: their late results are dropped, never painted. */
  var observationGen = 0;
  /* v91 — ONE frozen-feed message (Part 8 wording) used everywhere a
     stopped feed is PROVEN: the feed wait, the blank window and the
     detector verdicts. */
  var MSG_FROZEN = "The camera feed is frozen — it is not updating and no new frames arrived. Restore the live camera feed (reconnect the camera or close other apps using it), then try again.";
  /* v91 — connection lost mid-check (track ended / video no longer
     decodable): a different failure from a frozen picture. */
  var MSG_FEED_LOST = "The camera connection was lost during the check — reconnect the camera (or close other apps using it), then try again.";
  function makeCheckState() {
    var checks = {};
    CHECK_IDS.forEach(function (id) {
      checks[id] = { id: id, label: CHECK_LABELS[id], status: STATUS.IDLE, detail: "" };
    });
    return checks;
  }

  function sleep(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  /* v91 — ONE inference pass may never hang the pre-check or silently
     stall live monitoring (Part 5: "Detection timed out" is its own
     state, never a missing face). Deliberately its OWN real
     setTimeout — never the providers' sleep, because test clocks that
     "sleep" instantly must not turn every healthy pass into a
     timeout. Resolves {value} / {error} / {timeout:true}. */
  function inferTimeout(promise, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        resolve({ timeout: true });
      }, ms);
      promise.then(function (v) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve({ value: v });
      }, function (e) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve({ error: e || new Error("inference failed") });
      });
    });
  }

  async function runPrechecks(opts) {
    var o = opts || {};
    var cfg = o.config || CONFIG;
    var report = typeof o.report === "function" ? o.report : defaultReport;
    var p = o.providers || {};
    var wait = typeof p.sleep === "function" ? p.sleep : sleep;
    var now = typeof p.now === "function" ? p.now : function () { return Date.now(); };
    var checks = makeCheckState();

    /* v91 — diagnostics (Part 8): SAFE technical facts only — numbers,
       stages, statuses and an error category. Never an image, audio
       data, a webcam frame or a secret. The UI renders it in a
       collapsible area when something fails. */
    var diag = {
      startedAt: Date.now(),
      stages: {},        // milliseconds per stage (models / camera / mic / feed / calibration / observation)
      video: null,       // video dimensions + track state
      frames: null,      // frame-acquisition counters
      models: null,      // model readiness
      face: null,        // pass counts + inference durations
      phone: null,
      lastError: null,   // category of the FIRST stage that failed
      configUsed: {
        windowMs: cfg.inference.precheckWindowMs,
        blankSamples: cfg.black.minSamples,
        blankWindowMs: cfg.black.windowMs,
        faceSamples: cfg.face.precheckSamples,
        faceMinOk: cfg.face.precheckMinOk,
        faceMinScore: cfg.face.minScore,
        inferTimeoutMs: cfg.inference.inferTimeoutMs
      }
    };
    function noteErr(cat) { if (!diag.lastError) diag.lastError = cat; }
    var stageT = Date.now();
    function stageDone(name) { diag.stages[name] = Math.max(0, Date.now() - stageT); stageT = Date.now(); }

    function set(id, status, detail) {
      checks[id].status = status;
      checks[id].detail = detail || "";
      report(checks[id]);
      return checks[id];
    }
    function ready(id, detail) { return set(id, STATUS.READY, detail); }
    function fail(id, status, detail) { return set(id, status || STATUS.FAILED, detail); }

    /* ---- 1. fullscreen capability (static, no gesture needed) ---- */
    if (!p.fullscreen || typeof p.fullscreen.supported !== "function" || !p.fullscreen.supported()) {
      fail("fullscreen-support", STATUS.UNSUPPORTED,
        "This browser or device does not provide the fullscreen API Exam Mode requires. Try the latest Chrome, Edge, Firefox or Safari on a computer.");
    } else {
      ready("fullscreen-support", "Fullscreen is available and will be verified when you begin.");
    }

    /* ---- 2. answer-saving readiness (the local examination store) ---- */
    try {
      var storeRes = p.store ? await p.store() : { ok: true };
      if (storeRes && storeRes.ok) ready("store", storeRes.detail || "Answers save locally on this device.");
      else fail("store", STATUS.FAILED, (storeRes && storeRes.detail) || "Browser storage is unavailable — answers cannot be saved, so the exam cannot start.");
    } catch (e) {
      fail("store", STATUS.FAILED, "Answer saving could not be verified.");
    }

    /* ---- 3. detection models ---- */
    var models = null;
    set("models", STATUS.CHECKING, "Loading face and phone detection models…");
    /* v91 — Part 8: while the model loads, the FACE check says so. A
       model that is still loading is never displayed as a missing
       student, and a load failure is a model error, not "no person". */
    set("face", STATUS.CHECKING, "The face-detection model is still loading — this can take a few seconds.");
    try {
      /* v91 — Part 7: the model load is a stage with its own timeout. */
      var rawModels = (p.models && typeof p.models.load === "function") ? p.models.load() : null;
      var mRes = (rawModels && typeof rawModels.then === "function")
        ? await inferTimeout(Promise.resolve(rawModels), cfg.inference.precheckModelTimeoutMs)
        : { value: rawModels };
      if (mRes && mRes.timeout) {
        /* the load keeps running in the background — the retry reuses
           whatever finishes; here the STAGE simply ran out of time */
        models = null;
        fail("models", STATUS.FAILED, "The detection models did not load in time — check your connection once and try again.");
        noteErr("model-load");
      } else if (mRes && mRes.error) {
        throw mRes.error;
      } else {
        models = mRes ? mRes.value : null;
        if (models && models.face && models.object) {
          ready("models", "Face detection and COCO object detection (cell phone) are loaded.");
        } else {
          fail("models", STATUS.FAILED, "The required detection models did not load. Check your connection once and try again.");
          noteErr("model-load");
        }
      }
    } catch (e) {
      fail("models", STATUS.FAILED, "Model assets could not be loaded (" + ((e && e.message) || "unknown error") + ").");
      noteErr("model-load");
    }
    stageDone("models");
    try {
      var ms = (p.models && typeof p.models.status === "function") ? p.models.status() : null;
      diag.models = ms
        ? { status: String(ms.status || ""), error: ms.error ? String(ms.error).slice(0, 120) : null, ready: !!ms.ready }
        : { status: models ? "ready" : "failed", error: null, ready: !!models };
    } catch (eM) {
      diag.models = { status: "unknown", error: null, ready: !!models };
    }

    /* ---- 4. camera permission + device ---- */
    var videoStream = null;
    set("camera", STATUS.CHECKING, "Allow camera access and keep this page open while the camera starts…");
    if (!p.camera || typeof p.camera.request !== "function") {
      fail("camera", STATUS.UNSUPPORTED, "This device does not expose a camera interface (mediaDevices unavailable).");
      noteErr("camera-unavailable");
    } else {
      try {
        /* v91 — Part 7: the permission/device request is a STAGE with
           its own timeout. getUserMedia stays pending forever on an
           unanswered prompt or a wedged driver — that must end as a
           failed stage with a working retry, never as a pre-check that
           can never finish. A stream arriving AFTER the deadline is
           stopped on arrival, so the abandoned request can never leak
           live tracks into the next try (Part 2/3 cleanup). */
        var camReq = p.camera.request();
        var camSettled = null, camGaveUp = false;
        var stopLateStream = function (s) {
          if (!s || typeof s.getTracks !== "function") return;
          try { s.getTracks().forEach(function (t) { t.stop(); }); } catch (eL) {}
        };
        Promise.resolve(camReq).then(function (s) { camSettled = s; if (camGaveUp) stopLateStream(s); },
          function () { camSettled = "err"; });
        var camRes = await inferTimeout(Promise.resolve(camReq), cfg.inference.precheckRequestTimeoutMs);
        if (camRes && camRes.timeout) {
          camGaveUp = true;
          if (camSettled && camSettled !== "err") stopLateStream(camSettled);
          fail("camera", STATUS.FAILED, "The camera request did not complete in time — check for a camera permission prompt (or another application using the camera), then try again.");
          noteErr("camera-timeout");
        } else {
          if (camRes && camRes.error) throw camRes.error;
          videoStream = camRes ? camRes.value : null;
          if (videoStream && p.camera.trackLive && !p.camera.trackLive(videoStream)) {
            fail("camera", STATUS.FAILED, "The camera track started but is not live. Check that no other app is using the camera.");
            noteErr("camera-device");
          } else {
            ready("camera", "Camera access granted and the video track is live.");
          }
        }
      } catch (e) {
        var errName = (e && e.name) || "";
        if (errName === "NotAllowedError" || errName === "SecurityError") {
          fail("camera", STATUS.PERMISSION, "Camera permission was denied. Allow the camera for this site, then try again.");
          noteErr("camera-permission-denied");
        } else if (errName === "NotFoundError" || errName === "OverconstrainedError") {
          fail("camera", STATUS.FAILED, "No usable camera was found on this device.");
          noteErr("camera-device");
        } else if (errName === "NotReadableError" || errName === "AbortError") {
          /* v91 — Part 2: a busy camera (another app/tab holds it) is
             its own condition, not an unexplained failure. */
          fail("camera", STATUS.FAILED, "The camera is already in use by another application. Close other camera apps or tabs, then try again.");
          noteErr("camera-busy");
        } else {
          fail("camera", STATUS.FAILED, "The camera could not be started (" + (errName || (e && e.message) || "unknown error") + ").");
          noteErr("camera-device");
        }
      }
    }
    stageDone("camera");

    /* ---- 5. microphone permission + device + calibration ---- */
    var audioStream = null;
    set("mic", STATUS.CHECKING, "Requesting microphone access…");
    if (!p.mic || typeof p.mic.request !== "function") {
      fail("mic", STATUS.UNSUPPORTED, "This device does not expose a microphone interface (mediaDevices unavailable).");
    } else {
      try {
        /* v91 — Part 7: same bounded stage as the camera request (an
           unanswered microphone prompt must not hang the run). */
        var micReq = p.mic.request();
        var micSettled = null, micGaveUp = false;
        Promise.resolve(micReq).then(function (s) { micSettled = s; if (micGaveUp && s && typeof s.getTracks === "function") {
            try { s.getTracks().forEach(function (t) { t.stop(); }); } catch (eL2) {}
          } }, function () { micSettled = "err"; });
        var micRes = await inferTimeout(Promise.resolve(micReq), cfg.inference.precheckRequestTimeoutMs);
        if (micRes && micRes.timeout) {
          micGaveUp = true;
          if (micSettled && micSettled !== "err" && micSettled && typeof micSettled.getTracks === "function") {
            try { micSettled.getTracks().forEach(function (t) { t.stop(); }); } catch (eL3) {}
          }
          fail("mic", STATUS.FAILED, "The microphone request did not complete in time — check for a microphone permission prompt, then try again.");
          noteErr("mic-timeout");
        } else {
          if (micRes && micRes.error) throw micRes.error;
          audioStream = micRes ? micRes.value : null;
          if (audioStream && p.mic.trackLive && !p.mic.trackLive(audioStream)) {
            fail("mic", STATUS.FAILED, "The microphone track started but is not live.");
          } else {
            ready("mic", "Microphone access granted and the audio track is live.");
          }
        }
      } catch (e) {
        var mErr = (e && e.name) || "";
        if (mErr === "NotAllowedError" || mErr === "SecurityError") {
          fail("mic", STATUS.PERMISSION, "Microphone permission was denied. Allow the microphone for this site, then try again.");
          noteErr("mic-permission-denied");
        } else if (mErr === "NotFoundError") {
          fail("mic", STATUS.FAILED, "No usable microphone was found on this device.");
          noteErr("mic-device");
        } else {
          fail("mic", STATUS.FAILED, "The microphone could not be started (" + (mErr || (e && e.message) || "unknown error") + ").");
          noteErr("mic-device");
        }
      }
    }
    stageDone("mic");

    /* ---- 6. live feed + calibration + model sampling window ---- */
    var cameraOk = checks.camera.status === STATUS.READY;
    var micOk = checks.mic.status === STATUS.READY;
    var watcher = createBlackWatcher(cfg.black);
    var faceSamples = [];        // [{at, faces}]
    var proxMetrics = [];        // v93 Part 4 — [{widthFrac, heightFrac, centreX, centreY}]
    var phoneDetections = [];    // [{at, score}]
    var feedOk = false, calibration = null, voiceReady = false;

    if (cameraOk) {
      set("camera-feed", STATUS.CHECKING, "Waiting for live camera frames — the camera is starting, keep this page open…");
      set("camera-blank", STATUS.CHECKING, "Watching the picture for a few seconds…");
      set("face", STATUS.CHECKING, "Checking that exactly one person is visible…");
      set("phone", STATUS.CHECKING, "Scanning for phone-like objects…");
      try {
        if (p.camera.attach) await p.camera.attach(videoStream);
        /* Wait for the video element to be genuinely READY before any
           analysis (v90): metadata AND a decoded current frame AND a
           frame counted as presented/new. Probes that report
           ready:false (no metadata / no decoded frame yet) keep us
           waiting — a delayed camera startup is normal, not a
           failure — and a repeat read of one frozen picture never
           passes this gate. v91: the wait runs for its OWN stage
           timeout (precheckFeedTimeoutMs), separate from model
           loading, calibration and the observation window. */
        var feedProbe = null;
        var deadline = now() + cfg.inference.precheckFeedTimeoutMs;
        while (now() < deadline) {
          var probe = p.camera.frameStats ? p.camera.frameStats() : null;
          feedProbe = probe;
          if (probe && probe.ready !== false && probe.stats &&
              (probe.fresh === true || (probe.presented || 0) > 0 || (probe.frames || 0) > 0)) {
            break;
          }
          await wait(120);
        }
        feedOk = !!(feedProbe && feedProbe.ready !== false && feedProbe.stats &&
                    ((feedProbe.presented || 0) > 0 || (feedProbe.frames || 0) > 0));
        if (feedOk) {
          ready("camera-feed", "Live camera frames are arriving.");
        } else if (feedProbe && feedProbe.ready && feedProbe.fresh === false) {
          fail("camera-feed", STATUS.FAILED, MSG_FROZEN);
          noteErr("frozen-video");
        } else if (feedProbe && feedProbe.reason === "read-failed") {
          fail("camera-feed", STATUS.FAILED, "The camera picture could not be analysed (the video frame could not be read) — please try again.");
          noteErr("frame-sampling");
        } else {
          /* v91 — Part 8: this is the "camera starting / frames not
             arriving" state. It is NEVER worded as a covered or
             disconnected camera until that is actually proven. */
          fail("camera-feed", STATUS.FAILED, "The camera is connected, but new video frames have not arrived yet. Keep the camera preview open and try again.");
          noteErr("no-video-frames");
        }
      } catch (e) {
        fail("camera-feed", STATUS.FAILED, "The camera preview could not start (" + ((e && e.message) || "unknown error") + ").");
        noteErr("camera-attach");
      }
    } else {
      fail("camera-feed", STATUS.FAILED, "Needs camera access first.");
      fail("camera-blank", STATUS.FAILED, "Needs camera access first.");
      fail("face", STATUS.FAILED, "Needs camera access first.");
      fail("phone", STATUS.FAILED, "Needs camera access first.");
    }
    stageDone("feed");

    if (micOk) {
      set("mic-calibration", STATUS.CHECKING, "Measuring your room's background noise…");
      set("voice-ready", STATUS.CHECKING, "Checking the voice detector…");
      try {
        if (p.mic.start) await p.mic.start(audioStream);
        /* CALIBRATION LIFECYCLE (v89): the watcher calibrated here is
           the watcher the LIVE monitor will observe with. If the
           runtime hands us its watcher instance (p.mic.watcher) we
           calibrate that exact object; otherwise (tests, or a
           runtime that recreated its watcher) we calibrate a local
           one and hand its validated gates back for adoption via
           result.calibration + runtime.mic.adoptCalibration(). The
           voice check is only "ready" when the watcher the live exam
           will use is demonstrably calibrated AND produced a valid
           live frame through the real observe() path. */
        var audioWatcher = (p.mic && p.mic.watcher) ? p.mic.watcher : createAudioWatcher(cfg.audio);
        var calibUntil = now() + cfg.audio.calibMs;
        while (now() < calibUntil) {
          var f = p.mic.features ? p.mic.features() : null;
          if (f) audioWatcher.addCalibrationFrame(f);
          await wait(Math.max(50, Math.min(150, cfg.audio.calibMs / cfg.audio.calibMinFrames)));
        }
        calibration = audioWatcher.finishCalibration();
        if (calibration.ok) {
          /* Prove the live path end-to-end: one REAL frame through
             the calibrated watcher's observe(). A watcher that cannot
             produce a valid verdict from live audio is not ready,
             however good its gates look on paper. */
          var liveProbe = null;
          try {
            var probeFeat = p.mic.features ? p.mic.features() : null;
            liveProbe = probeFeat ? audioWatcher.observe(probeFeat, now(), cfg.inference.audioIntervalMs) : null;
          } catch (eProbe) { liveProbe = null; }
          if (!liveProbe || !liveProbe.valid) {
            calibration = { ok: false, reason: "live-probe-failed" };
            fail("mic-calibration", STATUS.FAILED, "The microphone produced no usable audio analysis during the live check — the audio pipeline is not operational.");
            fail("voice-ready", STATUS.FAILED, "Voice detection cannot run: the live audio pipeline did not produce valid data.");
          } else {
            ready("mic-calibration", "Background noise measured — speech gate set to the room's own level.");
            voiceReady = true;
            ready("voice-ready", "Voice detection is analysing your microphone locally (energy + voiced-pitch).");
          }
        } else if (calibration.reason === "digital-silence") {
          fail("mic-calibration", STATUS.FAILED, "Your microphone delivered only digital silence — it is muted, blocked by another app, or not working.");
          fail("voice-ready", STATUS.FAILED, "Voice detection cannot run without real microphone audio.");
        } else {
          fail("mic-calibration", STATUS.RETRY, "Not enough audio was captured to calibrate — please try again.");
          fail("voice-ready", STATUS.RETRY, "Voice detection needs a completed calibration.");
        }
      } catch (e) {
        fail("mic-calibration", STATUS.FAILED, "Audio analysis failed to start (" + ((e && e.message) || "unknown error") + ").");
        fail("voice-ready", STATUS.FAILED, "The audio pipeline is unavailable.");
      }
    } else {
      fail("mic-calibration", STATUS.FAILED, "Needs microphone access first.");
      fail("voice-ready", STATUS.FAILED, "Needs microphone access first.");
    }
    stageDone("calibration");
    if (!diag.lastError &&
        (checks["mic-calibration"].status !== STATUS.READY || checks["voice-ready"].status !== STATUS.READY)) {
      noteErr("mic-calibration");
    }

    /* ---- the observation window: blank sampling, face and phone
       detection run CONCURRENTLY on their own cadences (v90).
       The v89 loop awaited face AND phone inference before taking each
       blank sample on a 400ms cadence, so a sample could only be taken
       every (400ms + face time + phone time) — on real hardware that
       is always slower than black.minSamples(8) within
       black.windowMs(3000), so the blank check could not reach its
       sample floor through no fault of the student, and the face check
       was starved of passes the same way. Now:
         * the blank sampler runs on its own tight cadence and counts
           ONLY genuinely new frames (frameStats().fresh),
         * each detector runs in its own loop at its own pace, skipping
           beats rather than queueing (never overlapping inference)
           and refusing passes while the picture is stale (fresh()),
         * results computed for an abandoned window are dropped. */
    if (feedOk) {
      var windowEnd = now() + cfg.inference.precheckWindowMs;
      var obsGen = ++observationGen;
      var freshFrames = 0, frozenReads = 0, pendingReads = 0, readFailures = 0, frozenRun = 0;
      var faceUnavailable = 0, faceErrs = 0, faceStaleSkips = 0, faceTimeouts = 0, faceHung = false;
      var faceDurations = [];                 // real ms per RESOLVED face pass
      var phoneValidRuns = 0, phoneErrs = 0, phoneTimeouts = 0, phoneHung = false;
      var phoneDurations = [];
      var feedW = 0, feedH = 0;                  // v93 Part 4 — live frame size for proximity
      var proximityBaseline = null;              // v93 Part 5 — accepted start position (measurements only)
      function isFresh() { return !(p.camera && typeof p.camera.fresh === "function") || p.camera.fresh(); }
      /* NOTE (v91): loop pacing and windows use the PROVIDER clock;
         durations/diagnostics use the real wall clock — advancing a
         fake test clock with extra reads would change the loop math. */

      var blankLoop = (async function () {
        var prevT = null;
        while (true) {
          var t = now();
          if (obsGen !== observationGen || t >= windowEnd) break;
          var s = null;
          try { s = p.camera.frameStats ? p.camera.frameStats() : null; } catch (eB) { s = null; }
          if (s) {
            if (s.width && s.height) { feedW = s.width; feedH = s.height; }   /* v93 — remember frame size for proximity */
            if (s.ready === false) { pendingReads++; frozenRun = 0; }
            else if (s.fresh === false) { frozenReads++; frozenRun++; }
            else if (s.stats) { watcher.observe(s.stats, t); freshFrames++; frozenRun = 0; }
            else { readFailures++; frozenRun = 0; }  /* v91: ready but un-analysable — a sampling failure, NOT a black picture */
          } else {
            readFailures++; frozenRun = 0;           /* v91: frameStats missing/throwing — named honestly, never as "blank" */
          }
          var pace = cfg.inference.precheckBlankSampleMs - (prevT === null ? 0 : (t - prevT));
          prevT = t;
          if (pace > 0) await wait(pace);
        }
      })();

      /* v91 — every detector pass is bounded by inferTimeoutMs. A pass
         that never settles is reported as "timed out" (its own state),
         the run stays bounded, and after inferTimeoutGivesUp
         consecutive hangs the detector is declared hung for this
         attempt. Runtime callers get the same protection inside
         runFaceDetection/runPhoneDetection (pre-check AND live). */
      var faceLoop = (async function () {
        if (!models || !p.runFaceDetection) return;
        /* v93 Part 4 — prefer the box-returning adapter so this SAME
           pass yields the face size/position used for the proximity
           calibration. Falls back to the count-only adapter, which
           still runs the face check but yields no proximity metrics
           (the proximity verdict then reports honestly). */
        var useBoxes = typeof p.runFaceDetections === "function";
        var prevT = null, timeoutsInARow = 0;
        while (true) {
          var t = now();
          if (obsGen !== observationGen || t >= windowEnd) break;
          if (checks.face.status !== STATUS.CHECKING) break;
          if (isFresh()) {
            /* Part 6 — a genuinely running inference is displayed as
               "Processing camera", never as a silent wait. */
            set("face", STATUS.CHECKING, "Processing camera — analysing a live frame for faces…");
            var fr = null;
            var fT0 = Date.now();
            try { fr = await inferTimeout(Promise.resolve(useBoxes ? p.runFaceDetections(models.face) : p.runFaceDetection(models.face)), cfg.inference.inferTimeoutMs); }
            catch (eF) { fr = { error: eF }; }
            var fDur = Date.now() - fT0;
            if (obsGen !== observationGen) break;  /* window abandoned — drop the stale result */
            var faces;
            if (fr && fr.timeout) faces = -3;
            else if (fr && fr.error !== undefined) faces = -2;
            else if (useBoxes && Array.isArray(fr && fr.value)) {
              /* box adapter: an array of merged faces (length = count) */
              var merged = fr.value;
              faces = merged.length;
              if (faces === 1 && merged[0] && merged[0].box && feedW && feedH) {
                var m = faceBoxMetrics(merged[0].box, feedW, feedH);
                if (m) proxMetrics.push(m);
              }
            }
            else faces = (typeof (fr && fr.value) === "number" ? fr.value : -2);

            faceSamples.push({ at: t, faces: faces });
            if (faces === -1) {
              faceUnavailable++;
              timeoutsInARow = 0;          /* a returned answer is proof it is not hung */
            } else if (faces === -3) {
              /* one classification for BOTH timeout sources: this
                 timer expiring, or the runtime answering -3 itself —
                 and either repeated can declare the detector hung */
              faceTimeouts++; faceErrs++; timeoutsInARow++;
              if (timeoutsInARow >= cfg.inference.inferTimeoutGivesUp) faceHung = true;
            } else if (typeof faces === "number" && faces < 0) {
              faceErrs++; timeoutsInARow = 0;
            } else {
              timeoutsInARow = 0;
              faceDurations.push(fDur);     /* completed inference only */
            }
            if (faceHung) break;
          } else {
            faceStaleSkips++;
          }
          var pace = cfg.inference.precheckSampleMs - (prevT === null ? 0 : (t - prevT));
          prevT = t;
          if (pace > 0) await wait(pace);
        }
      })();

      var phoneLoop = (async function () {
        if (!models || !p.runPhoneDetection) return;
        var prevT = null, timeoutsInARow = 0;
        while (true) {
          var t = now();
          if (obsGen !== observationGen || t >= windowEnd) break;
          if (checks.phone.status !== STATUS.CHECKING) break;
          if (isFresh()) {
            var pr = null;
            var pT0 = Date.now();
            try { pr = await inferTimeout(Promise.resolve(p.runPhoneDetection(models.object)), cfg.inference.inferTimeoutMs); }
            catch (eP) { pr = { error: eP }; }
            var pDur = Date.now() - pT0;
            if (obsGen !== observationGen) break;
            /* v91 — an inference that throws, times out or returns a
               failure code is a FAILED scan, never "no phone seen":
               a broken detector must not read as a clean picture. */
            if (pr && pr.timeout) {
              phoneErrs++; phoneTimeouts++; timeoutsInARow++;
              if (timeoutsInARow >= cfg.inference.inferTimeoutGivesUp) phoneHung = true;
            } else if (pr && pr.error !== undefined) {
              phoneErrs++; timeoutsInARow = 0;
            } else if (pr && typeof pr.value === "number") {
              phoneErrs++; if (pr.value === -3) phoneTimeouts++;
              timeoutsInARow = (pr.value === -3) ? timeoutsInARow + 1 : 0;
            } else if (pr && (pr.value === null || typeof pr.value === "object")) {
              phoneValidRuns++; timeoutsInARow = 0;
              phoneDurations.push(pDur);
              if (pr.value) phoneDetections.push({ at: t, score: pr.value.score });
            } else {
              phoneErrs++; timeoutsInARow = 0;
            }
            if (phoneHung) break;
          }
          /* v91 Part 6 — the phone pass runs on its OWN, roomier
             cadence (see CONFIG.precheckPhoneSampleMs): its duty cycle
             stays bounded so frame presentation and blank sampling get
             the main thread between passes. */
          var pace = (cfg.inference.precheckPhoneSampleMs || cfg.inference.precheckSampleMs) - (prevT === null ? 0 : (t - prevT));
          prevT = t;
          if (pace > 0) await wait(pace);
        }
      })();

      await Promise.all([blankLoop, faceLoop, phoneLoop]);
      stageDone("observation");

      /* v91 — the FROZEN discriminator (Part 4). The picture is frozen
         when the sampler stayed alive and analysable (no lost reads,
         no read failures) yet the video element delivered no NEW frame
         for a sustained run of reads right up to the end of the
         window, with at most the baseline read counted fresh. Testing
         only freshFrames === 0 was unreachable in production: the
         first read of a stalled picture always establishes a fresh
         baseline, so a camera that froze mid-check (driver stall,
         cable glitch, another app holding the device) reported "only
         N of 8 frames arrived — keep the page open", advice that only
         reconnecting the camera can act on. A merely SLOW camera keeps
         the honest insufficient-frames verdict: it delivers fresh
         frames throughout the window (freshFrames > 1), which the
         freshFrames <= 1 guard refuses to call frozen. */
      var frozenRunEnd = frozenRun;
      var pictureFrozen = ((freshFrames === 0 && frozenReads > 0 && pendingReads === 0) ||
        (freshFrames <= 1 && frozenRunEnd >= (cfg.inference.precheckBlankFrozenReads || 4) &&
         pendingReads === 0 && readFailures === 0));

      /* v91 — if the feed DIED during the window, the earlier "frames
         are arriving" state is corrected here: frozen vs lost vs
         sampling failure are told apart (Part 4), never lumped into
         "camera not started". */
      if (freshFrames === 0 || pictureFrozen) {
        if (pendingReads > 0) {
          fail("camera-feed", STATUS.FAILED, MSG_FEED_LOST);
          noteErr("camera-feed-lost");
        } else if (frozenReads > 0) {
          fail("camera-feed", STATUS.FAILED, MSG_FROZEN);
          noteErr("frozen-video");
        } else if (readFailures > 0) {
          fail("camera-feed", STATUS.FAILED, "The camera picture could not be analysed (the video frame could not be read) — please try again.");
          noteErr("frame-sampling");
        }
      }

      /* camera-blank verdict — distinct outcomes (v90/v91): frozen
         feed, lost connection, sampling failure, not enough genuinely
         fresh samples, a confirmed black picture, or a good picture.
         Insufficient FRESH FRAMES is a frame-acquisition error, never
         worded as a black camera (Part 4). */
      var v = watcher.verdict(now());
      if (v.insufficient) {
        if (pictureFrozen) {
          fail("camera-blank", STATUS.FAILED, MSG_FROZEN);
          noteErr("frozen-video");
        } else if (freshFrames === 0 && pendingReads > 0) {
          fail("camera-blank", STATUS.FAILED, MSG_FEED_LOST);
          noteErr("camera-feed-lost");
        } else if (freshFrames === 0 && readFailures > 0) {
          fail("camera-blank", STATUS.FAILED, "The camera picture could not be analysed (frame sampling failed) — please try again.");
          noteErr("frame-sampling");
        } else {
          /* v91 Part 8 — report the count the FLOOR was measured on:
             the watcher's in-window samples. Printing the raw window
             total could say "Only 9 of the required 8" — a count that
             passes the floor it claims to fail. */
          fail("camera-blank", STATUS.RETRY,
            "Only " + (typeof v.count === "number" ? v.count : freshFrames) + " of the required " + cfg.black.minSamples +
            " fresh camera frames arrived during the observation window — the picture could not be confirmed. " +
            "Keep this page open and in the foreground, then try again.");
          noteErr("frames-too-slow");
        }
      } else if (v.confirmed) {
        fail("camera-blank", STATUS.FAILED, "Your camera picture is blank, black or covered. Uncover the lens or fix the lighting.");
        noteErr("camera-blank");
      } else {
        ready("camera-blank", "Picture confirmed (" + v.count + " fresh frames sampled).");
      }

      /* face verdict — distinct outcomes (v90/v91): frozen feed, lost
         connection, model unavailable, inference failed, detection
         TIMED OUT, too few passes, exactly one person, multiple
         people, nobody, unreliable. Exactly one person is never
         marked READY on insufficient passes, a failed/unavailable/
         hung model, or stale/frozen frames — and a model error is
         never reported as a missing student (Part 5). */
      if (models && p.runFaceDetection) {
        var good = faceSamples.filter(function (s) { return s.faces === 1; });
        var none = faceSamples.filter(function (s) { return s.faces === 0; });
        var multi = faceSamples.filter(function (s) { return s.faces > 1; });
        var passes = faceSamples.length;
        var unavailable = faceSamples.filter(function (s) { return s.faces === -1; }).length;
        var faceTimed = faceSamples.filter(function (s) { return s.faces === -3; }).length;
        if (pictureFrozen) {
          fail("face", STATUS.FAILED, "The camera feed is frozen — face detection could not run on a stale picture. Restore the live camera feed, then try again.");
          noteErr("frozen-video");
        } else if (freshFrames === 0 && pendingReads > 0) {
          fail("face", STATUS.FAILED, "Face detection could not run — " + MSG_FEED_LOST);
          noteErr("camera-feed-lost");
        } else if (faceHung) {
          fail("face", STATUS.FAILED, "Face detection timed out — the detector could not finish processing the camera image. Please try again; if it keeps timing out, this device may be too slow for real-time detection.");
          noteErr("face-timeout");
        } else if (passes > 0 && unavailable === passes) {
          fail("face", STATUS.FAILED, "The face detector is unavailable — it could not process the camera image. Please try again. If the problem continues, check browser compatibility.");
          noteErr("face-unavailable");
        } else if (passes > 0 && (unavailable + faceErrs) === passes) {
          if (faceTimed > 0 && faceTimed === faceErrs) {
            fail("face", STATUS.FAILED, "Face detection timed out — the detector could not finish processing the camera image. Please try again; if it keeps timing out, this device may be too slow for real-time detection.");
            noteErr("face-timeout");
          } else {
            fail("face", STATUS.FAILED, "The face-detection model failed while analysing the camera picture — please try again.");
            noteErr("face-inference");
          }
        } else if (passes < cfg.face.precheckSamples / 2) {
          fail("face", STATUS.RETRY, "Face detection did not run enough passes to confirm exactly one person" +
            (faceStaleSkips > 0 ? " (the camera was not delivering new frames for part of the check)" : "") + " — please try again.");
          noteErr("face-insufficient");
        } else if (good.length >= cfg.face.precheckMinOk && faceErrs === 0) {
          ready("face", "The camera is working and one face has been consistently detected (confirmed in " +
            good.length + " of " + passes + " passes).");
        } else if (multi.length > none.length) {
          fail("face", STATUS.FAILED, "More than one person was detected in the camera frame. You must sit the exam alone in view of the camera.");
          noteErr("face-multiple");
        } else if (none.length > good.length) {
          fail("face", STATUS.FAILED, "No face was detected in the latest valid camera frames. Sit in front of the camera with your face clearly visible.");
          noteErr("face-none");
        } else {
          fail("face", STATUS.RETRY, "Face detection was unreliable — check your lighting and position, then try again.");
          noteErr("face-unreliable");
        }
      } else {
        fail("face", STATUS.FAILED, "The face-detection model is not available — it could not process the camera image, so the exam cannot start.");
        noteErr("face-unavailable");
      }

      /* v93 Part 4 — PROXIMITY verdict (mandatory). The exam starts only
         if the student is close enough that their face fills a real
         part of the frame. A student too far away can never establish a
         valid baseline. We reuse the face check's error states (frozen
         / lost feed / hung / unavailable) so the reason shown is the
         TRUE cause, and only compute geometry once a single face was
         reliably seen. Proximity is measured as a fraction of the frame
         — never a physical distance, which a webcam cannot infer. */
      if (!feedOk) {
        fail("face-proximity", STATUS.FAILED, "Needs a live camera feed first.");
      } else if (pictureFrozen) {
        fail("face-proximity", STATUS.FAILED, "The camera feed is frozen — the face position could not be measured. Restore the live camera feed, then try again.");
        noteErr("frozen-video");
      } else if (faceHung) {
        fail("face-proximity", STATUS.FAILED, "Face detection timed out — your position could not be measured. Please try again.");
        noteErr("face-timeout");
      } else if (!models || !p.runFaceDetections) {
        fail("face-proximity", STATUS.FAILED, "The face detector cannot report face position on this device, so a safe starting position cannot be confirmed — the exam cannot start.");
        noteErr("face-unavailable");
      } else if (good.length < cfg.face.precheckMinOk || faceErrs > 0) {
        /* the face check itself did not pass — proximity cannot be
           claimed on top of an unreliable face read. */
        fail("face-proximity", STATUS.RETRY, "A clear, single face could not be confirmed, so your position could not be measured. Check your lighting and sit centred, then try again.");
        noteErr("face-unreliable");
      } else if (proxMetrics.length === 0) {
        fail("face-proximity", STATUS.RETRY, "Your face position could not be measured from the camera frames. Sit facing the camera and try again.");
        noteErr("face-insufficient");
      } else {
        /* Use the median width/height/centre across the calibration
           samples — robust to a single stray frame. Then require BOTH
           the absolute closeness floor and a centred, in-frame face. */
        var medW = percentile(proxMetrics.map(function (m) { return m.widthFrac; }), 50);
        var medH = percentile(proxMetrics.map(function (m) { return m.heightFrac; }), 50);
        var medCX = percentile(proxMetrics.map(function (m) { return m.centreX; }), 50);
        var medCY = percentile(proxMetrics.map(function (m) { return m.centreY; }), 50);
        var margin = cfg.face.proxCentreMargin;
        var tooFar = medW < cfg.face.proxMinWidthFrac || medH < cfg.face.proxMinHeightFrac;
        var offCentre = medCX < margin || medCX > 1 - margin || medCY < margin || medCY > 1 - margin;
        if (tooFar) {
          fail("face-proximity", STATUS.FAILED, "Move Closer to the Camera — your face is too far away to meet the exam requirements. Move closer until your face clearly fills more of the camera picture, then try again.");
          noteErr("face-too-far");
        } else if (offCentre) {
          fail("face-proximity", STATUS.FAILED, "Move Into the Centre of the Camera — your face is too close to the edge of the frame. Sit centred and facing the camera, then try again.");
          noteErr("face-off-centre");
        } else {
          ready("face-proximity", "Position confirmed — your face is clearly visible and close enough (" + Math.round(medW * 100) + "% of the frame width).");
          /* v93 Part 5 — remember the accepted baseline so the live
             monitor can measure a later move-away against THIS
             position. Measurements only — no image is kept or stored. */
          proximityBaseline = { widthFrac: medW, heightFrac: medH, centreX: medCX, centreY: medCY };
        }
      }

      /* phone verdict — v91: an inference that never completed is a
         FAILED scan (never "no phone seen"), on top of the frozen /
         lost-feed / confirmed-phone outcomes. */
      if (pictureFrozen) {
        fail("phone", STATUS.FAILED, "The phone scan could not run — the camera feed is frozen and not updating. Restore the live camera feed, then try again.");
        noteErr("frozen-video");
      } else if (freshFrames === 0 && pendingReads > 0) {
        fail("phone", STATUS.FAILED, "The phone scan could not run — " + MSG_FEED_LOST);
        noteErr("camera-feed-lost");
      } else if (models && p.runPhoneDetection) {
        var conf = countRecent(phoneDetections, now(), cfg.phone.confirmWindowMs);
        if (phoneHung) {
          fail("phone", STATUS.FAILED, "Phone detection timed out — the detector could not finish processing the camera image. Please try again.");
          noteErr("phone-timeout");
        } else if (phoneValidRuns === 0 && phoneErrs > 0) {
          fail("phone", STATUS.FAILED, "The phone detector could not process the camera image (inference failed or timed out) — please try again.");
          noteErr("phone-inference");
        } else if (phoneValidRuns === 0) {
          fail("phone", STATUS.RETRY, "The phone scan did not run enough passes on live frames — please try again.");
          noteErr("phone-insufficient");
        } else if (conf >= cfg.phone.confirmCount) {
          var best = phoneDetections[phoneDetections.length - 1];
          fail("phone", STATUS.FAILED, "A phone-like object was detected in the camera view (confidence " + (best ? Math.round(best.score * 100) : 0) + "%). Remove it before starting.");
          noteErr("phone-detected");
        } else if (phoneDetections.length === 0) {
          ready("phone", "No phone-like object seen in the observation window.");
        } else {
          ready("phone", phoneDetections.length + " low-confidence hit(s) below the confirmation rule — not treated as a phone.");
        }
      } else {
        fail("phone", STATUS.FAILED, "The object-detection model is not available.");
      }
    } else {
      fail("camera-blank", STATUS.FAILED, "Needs a live camera feed first.");
      fail("face", STATUS.FAILED, "Needs a live camera feed first.");
      /* v93 — every camera-dependent mandatory check must land on an
         honest FAILED here, or its row would sit at "Not started"
         forever when the camera cannot start (denied / no device /
         attach failure). */
      fail("face-proximity", STATUS.FAILED, "Needs a live camera feed first.");
      fail("phone", STATUS.FAILED, "Needs a live camera feed first.");
      noteErr("no-camera-feed");
    }

    /* v91 — diagnostics payload (Part 8): safe technical facts only.
       Video dimensions, fresh-frame counts, model readiness,
       inference durations and the error category — no image, no
       audio, no raw frames. */
    if (feedOk) {
      diag.frames = {
        freshSamples: freshFrames,
        frozenReads: frozenReads,
        frozenRunAtEnd: frozenRunEnd,
        notReadyReads: pendingReads,
        readFailures: readFailures,
        pictureFrozen: pictureFrozen
      };
      var fAvg = faceDurations.length ? Math.round(faceDurations.reduce(function (a, b) { return a + b; }, 0) / faceDurations.length) : null;
      var fMax = faceDurations.length ? Math.max.apply(null, faceDurations) : null;
      diag.face = {
        passes: faceSamples.length,
        good: faceSamples.filter(function (s) { return s.faces === 1; }).length,
        unavailable: faceUnavailable,
        errors: faceErrs,
        timeouts: faceTimeouts,
        staleSkips: faceStaleSkips,
        hung: faceHung,
        avgMs: fAvg,
        maxMs: fMax
      };
      var pAvg = phoneDurations.length ? Math.round(phoneDurations.reduce(function (a, b) { return a + b; }, 0) / phoneDurations.length) : null;
      var pMax = phoneDurations.length ? Math.max.apply(null, phoneDurations) : null;
      diag.phone = {
        runs: phoneValidRuns,
        hits: phoneDetections.length,
        errors: phoneErrs,
        timeouts: phoneTimeouts,
        hung: phoneHung,
        avgMs: pAvg,
        maxMs: pMax
      };
    } else {
      diag.stages.observation = diag.stages.observation || 0;
      diag.frames = { freshSamples: 0, frozenReads: 0, notReadyReads: 0, readFailures: 0 };
      diag.face = { passes: 0, good: 0, unavailable: 0, errors: 0, timeouts: 0, staleSkips: 0, hung: false, avgMs: null, maxMs: null };
      diag.phone = { runs: 0, hits: 0, errors: 0, timeouts: 0, hung: false, avgMs: null, maxMs: null };
    }
    try {
      var endProbe = (p.camera && typeof p.camera.frameStats === "function") ? p.camera.frameStats() : null;
      var camInfo = (p.camera && typeof p.camera.info === "function") ? p.camera.info() : null;
      if (endProbe && typeof endProbe.presented === "number") diag.frames.presented = endProbe.presented;
      if (endProbe && typeof endProbe.freshIntervalMs === "number") diag.frames.freshIntervalMs = endProbe.freshIntervalMs;
      diag.video = {
        width: endProbe && typeof endProbe.width === "number" ? endProbe.width : (camInfo && camInfo.video ? camInfo.video.width : 0),
        height: endProbe && typeof endProbe.height === "number" ? endProbe.height : (camInfo && camInfo.video ? camInfo.video.height : 0),
        readyState: endProbe && typeof endProbe.readyState === "number" ? endProbe.readyState : null,
        reason: endProbe ? String(endProbe.reason || "") : "no-provider",
        trackState: camInfo && camInfo.trackState ? String(camInfo.trackState) : null,
        muted: camInfo ? !!camInfo.muted : null,
        rvfc: camInfo ? !!camInfo.hasRvfc : null,
        playError: camInfo && camInfo.playError ? String(camInfo.playError).slice(0, 80) : null,
        settings: (camInfo && camInfo.settings) ? {
          width: typeof camInfo.settings.width === "number" ? camInfo.settings.width : null,
          height: typeof camInfo.settings.height === "number" ? camInfo.settings.height : null,
          frameRate: typeof camInfo.settings.frameRate === "number" ? Math.round(camInfo.settings.frameRate * 10) / 10 : null,
          facingMode: camInfo.settings.facingMode ? String(camInfo.settings.facingMode) : null
        } : null
      };
    } catch (eD) { /* diagnostics are best-effort — never break the check over them */ }

    /* ---- controller + fullscreen entry slot ---- */
    set("controller", o.controllerReady ? STATUS.READY : STATUS.FAILED,
      o.controllerReady ? "The exam security controller is initialised and running." : "The exam security controller could not be initialised.");
    if (checks["fullscreen-support"].status === STATUS.READY) {
      set("fullscreen", STATUS.PENDING, "Press Begin Examination — fullscreen is entered and verified on that click.");
    }

    return {
      ok: precheckOk(checks),
      checks: checks,
      /* v91 — safe technical diagnostics for the collapsible
         troubleshooting area (Part 8). */
      diagnostics: diag,
      /* The validated audio calibration from THIS run, so the caller
         can confirm the live watcher holds the same gates (or adopt
         them onto a fresh watcher if the runtime recreated one). */
      calibration: (calibration && calibration.ok)
        ? { noiseFloor: calibration.noiseFloor, speechGate: calibration.gate, soundGate: calibration.soundGate }
        : null,
      /* v93 Part 5 — the accepted starting position (normalized face
         size + centre). Measurements only; carried into the live
         monitor so a move away from this position can be detected. */
      proximity: proximityBaseline
    };
  }

  /* Is the whole gate open? Used by the UI AND by the start path
     (defence in depth — the button state alone is never trusted). */
  function precheckOk(checks) {
    if (!checks) return false;
    for (var i = 0; i < MANDATORY_CHECKS.length; i++) {
      var c = checks[MANDATORY_CHECKS[i]];
      if (!c) return false;
      if (MANDATORY_CHECKS[i] === "fullscreen") {
        /* the fullscreen ACT check may still be pending (it happens
           on the Begin click) — everything else must be ready */
        if (c.status !== STATUS.READY && c.status !== STATUS.PENDING) return false;
        continue;
      }
      if (c.status !== STATUS.READY) return false;
    }
    return true;
  }

  /* All checks really entered (used after Begin, where fullscreen
     must now be READY rather than PENDING). */
  function beginOk(checks) {
    if (!precheckOk(checks)) return false;
    return checks.fullscreen && checks.fullscreen.status === STATUS.READY;
  }

  /* ============================================================
     LIVE MONITOR — camera/face/phone/audio loops. Every provider
     is injected, so tests drive the real loop logic with clearly
     identified fakes while the browser passes real DOM objects.
     ============================================================ */
  /* v93 Part 5 — evaluate ONE live face measurement against the
     accepted baseline. Returns "ok" | "moved" | "unknown".
       moved   — the face is confirmedly too small / shifted (moved away)
       ok      — comfortably within the baseline's tolerance
       unknown — no measurement, or no baseline to compare against
                 (a measurement with no baseline is NEVER "ok")
     The ABSOLUTE closeness floor applies on every measurement — even
     without a baseline, a face smaller than the pre-check's minimum
     size is policy-violatingly far away. The RELATIVE rule (shrink vs
     baseline + centre drift) needs the baseline and is deliberately
     loose (proxShrinkRatio / proxDriftFrac) so ordinary posture sway,
     leaning to write, and blinking never read as a move-away; only a
     sustained, meaningful departure past proxConfirmMs is confirmed. */
  function evalProximity(metrics, baseline, cfg) {
    if (!metrics) return "unknown";
    var c = (cfg || CONFIG).face;
    var belowFloor = metrics.widthFrac < c.proxMinWidthFrac ||
                     metrics.heightFrac < c.proxMinHeightFrac;
    if (belowFloor) return "moved";          /* absolute rule, baseline or not */
    if (!baseline) return "unknown";
    var widthRatio = metrics.widthFrac / (baseline.widthFrac || 1);
    var driftX = Math.abs(metrics.centreX - baseline.centreX);
    var driftY = Math.abs(metrics.centreY - baseline.centreY);
    var shrank = widthRatio < c.proxShrinkRatio;
    var drifted = driftX > c.proxDriftFrac || driftY > c.proxDriftFrac;
    return (shrank || drifted) ? "moved" : "ok";
  }

  function createLiveMonitor(opts) {
    var o = opts || {};
    var cfg = o.config || CONFIG;
    var engine = o.engine;
    var p = o.providers || {};
    var onStatus = typeof o.onStatus === "function" ? o.onStatus : defaultReport;
    var now = typeof p.now === "function" ? p.now : function () { return Date.now(); };
    var running = false;
    var timers = [];
    var statuses = {
      camera: "idle", face: "idle", phone: "idle", mic: "idle", fullscreen: "idle", monitoring: "idle"
    };
    var lastFaceOkAt = null, lastPhoneCheckAt = null;
    /* v93 Part 5 — PROXIMITY tracking against the accepted baseline
       from the pre-check. `p.proximityBaseline` is the measurement
       object {widthFrac, heightFrac, centreX, centreY}; `p.faceBoxes`
       is an optional provider returning merged faces WITH boxes so the
       SAME inference pass can be measured. If either is absent the
       relative move-away rule stays dormant — the mandatory pre-check
       already refused to start without a valid baseline, so in the real
       flow both are always present. */
    var proximityBaseline = o.proximityBaseline || p.proximityBaseline || null;
    var proxSince = null, proxClearedSince = null, proxLastOkAt = null;
    /* v89 — INDEPENDENT detector health (Part 3B). The face and phone
       detectors never share a counter: success on one must not erase
       the other's failure history. Each keeps its own consecutive
       failure count, last successful inference and status, and a
       detector whose model is unloaded/failing is displayed as FAIL —
       never as ok. */
    var detectorHealth = {
      face: { failures: 0, lastSuccessAt: null, status: "idle" },
      phone: { failures: 0, lastSuccessAt: null, status: "idle" }
    };
    /* v89 — multi-face confirmation window (Part 3A): >1 face must
       persist before the engine hears about it (one stray frame is
       not proof), and clearing it must also be sustained. */
    var multiFaceSince = null, multiFaceClearedSince = null;
    var phoneRecent = [];
    var frameTimes = { lastVideoTime: null, sinceChange: null };
    var started = 0;
    var blackWatcher = createBlackWatcher(cfg.black);

    function noteDetectorSuccess(kind, at) {
      var h = detectorHealth[kind];
      h.failures = 0;
      h.lastSuccessAt = at;
      if (h.status !== "ok") { h.status = "ok"; emit(); }
    }
    function noteDetectorFailure(kind) {
      var h = detectorHealth[kind];
      h.failures++;
      h.status = h.failures >= cfg.recovery.maxDetectionFailures ? "fail" : "degraded";
      if (h.failures === cfg.recovery.maxDetectionFailures) {
        setStatus("monitoring", "recovering", "The " + kind + " detection model is failing.");
        engine.report("monitoring-failure", true,
          "The " + kind + " detection model stopped producing results (" + h.failures + " consecutive failures).");
      }
      emit();
    }

    function setStatus(key, value, detail) {
      if (statuses[key] === value && !detail) return;
      statuses[key] = value;
      emit(detail);
    }
    function emit(detail) {
      try { onStatus({ statuses: Object.assign({}, statuses), state: engine ? engine.getState() : "n/a", detail: detail || null, warnings: engine ? engine.getRecord().warnings : {} }); } catch (e) { /* UI errors never stop monitoring */ }
    }
    function every(fn, ms) {
      var id = setInterval(function () { if (running) { try { fn(); } catch (e) { /* keep the loop alive */ } } }, ms);
      timers.push(id);
      return id;
    }
    function stopAll() {
      running = false;
      timers.forEach(function (t) { clearInterval(t); });
      timers = [];
    }

    function start() {
      if (running) return true;
      if (!engine || !p.camera || !p.audio) return false;
      running = true;
      started = now();
      lastFaceOkAt = now();
      lastPhoneCheckAt = now();
      blackWatcher.reset();
      /* v93 Part 5 — proximity tracking state, reset per attempt. */
      proxSince = null;
      proxClearedSince = null;
      proxLastOkAt = now();
      /* v89 — fresh per-attempt monitor state (Part 4): detector
         health, multi-face window and phone history are never carried
         over from a previous attempt. */
      detectorHealth = {
        face: { failures: 0, lastSuccessAt: null, status: "idle" },
        phone: { failures: 0, lastSuccessAt: null, status: "idle" }
      };
      multiFaceSince = null;
      multiFaceClearedSince = null;
      phoneRecent = [];
      frameTimes = { lastVideoTime: null, sinceChange: null };

      /* ---- camera health + black-frame sampling ----
         A single dark frame never reports anything: the rolling
         window (black.windowMs) must confirm a PERSISTENTLY blank
         or covered picture before the engine hears about it. */
      every(function () {
        if (!running) return;
        var health = p.camera.health ? p.camera.health() : { live: false, reason: "no-camera" };
        if (!health.live) {
          setStatus("camera", "fail", health.detail);
          setStatus("monitoring", "recovering");
          engine.report("camera-lost", true, health.detail || "The camera stopped sending video.");
          engine.report("camera-blank", false, null);
          return;
        }
        engine.report("camera-lost", false, null);
        var stats = p.camera.frameStats ? p.camera.frameStats() : null;
        if (stats && stats.stats) {
          blackWatcher.observe(stats.stats, now());
          var v = blackWatcher.verdict(now());
          setStatus("camera", v.confirmed ? "fail" : "ok", v.confirmed ? "The picture is blank or covered." : null);
          engine.report("camera-blank", v.confirmed, "The camera picture has stayed blank or covered.");
        } else {
          /* the track claims to be live but no picture can be read */
          setStatus("camera", "fail", "No camera frames can be read.");
          engine.report("camera-blank", false, null);
        }
        setStatus("monitoring", "active");
      }, cfg.inference.frameIntervalMs);

      /* ---- face presence (v89: FOUR distinct states) ----
         none | exactly-one | multiple | detector-failing.
         Exactly one face is the exam policy everywhere (pre-check
         and live). A missing face follows the standard one-warning
         policy; MORE THAN ONE face is confirmed only after persisting
         multipleConfirmMs (a single stray frame is never proof) and
         then follows the same one-warning-then-terminate policy via
         the "face-multiple" violation. A detector that throws or
         returns no verdict (-1) is a MODEL failure — counted in the
         face detector's own health, never misread as "no face". */
      every(async function () {
        if (!running || !p.runFaceDetection) return;
        try {
          /* v93 Part 5 — prefer the box-returning provider so this SAME
             pass yields the face measurement used for the proximity
             rule. Falls back to the count-only provider, which still
             runs the presence checks (proximity then reads "unknown"
             and never fires a false move-away). */
          var useBoxes = typeof p.runFaceDetections === "function";
          var faces, metrics = null;
          if (useBoxes) {
            var merged = await p.runFaceDetections();
            var atM = now();
            if (typeof merged !== "number") {
              faces = merged.length;
              if (faces === 1 && merged[0] && merged[0].box && p.camera && p.camera.frameSize) {
                var fs2 = p.camera.frameSize();
                if (fs2 && fs2.width && fs2.height) metrics = faceBoxMetrics(merged[0].box, fs2.width, fs2.height);
              }
            } else { faces = merged; }
          } else {
            faces = await p.runFaceDetection();
          }
          var atF = now();
          if (typeof faces !== "number" || faces < 0) {
            /* detector unavailable / repeatedly failing — its own
               counter, not shared with the phone detector */
            noteDetectorFailure("face");
            setStatus("face", detectorHealth.face.status === "fail" ? "fail" : "degraded",
              "Face detection is unavailable — retrying…");
            engine.report("face-missing", false, null);
            engine.report("face-multiple", false, null);
            return;
          }
          noteDetectorSuccess("face", atF);

          if (faces === 1) {
            /* the normal state: clears BOTH face incidents (sustained) */
            setStatus("face", "ok");
            lastFaceOkAt = atF;
            multiFaceSince = null;
            multiFaceClearedSince = atF;
            engine.report("face-missing", false, null);
            engine.report("face-multiple", false, null);
            /* v93 Part 5 — proximity against the accepted baseline. A
               brief inference gap or an unmeasurable frame is a
               MONITORING unknown (never a violation); only a measured,
               sustained move-away past proxConfirmMs is confirmed. The
               absolute closeness floor is evaluated on every measured
               frame even when no baseline exists; the relative
               shrink/drift rule needs the baseline. */
            if (!metrics) {
              proxSince = null;
              engine.report("face-proximity", false, null);
            } else {
              var verdict = evalProximity(metrics, proximityBaseline, cfg);
              if (verdict === "ok") {
                proxClearedSince = atF;
                proxSince = null;
                proxLastOkAt = atF;
                engine.report("face-proximity", false, null);
              } else if (verdict === "moved") {
                if (proxSince === null) proxSince = atF - cfg.inference.faceIntervalMs;
                var proxFor = atF - proxSince;
                var proxConfirmed = proxFor >= cfg.face.proxConfirmMs;
                var sizePct = Math.round(metrics.widthFrac * 100);
                var detail = proximityBaseline
                  ? ("The face moved away from the checked position for " + Math.round(proxFor / 1000) +
                     "s (face now " + Math.round((metrics.widthFrac / (proximityBaseline.widthFrac || 1)) * 100) + "% of the accepted size).")
                  : ("The face is too far from the camera for " + Math.round(proxFor / 1000) +
                     "s (face fills only " + sizePct + "% of the frame; at least " +
                     Math.round(cfg.face.proxMinWidthFrac * 100) + "% is required).");
                setStatus("face", proxConfirmed ? "fail" : "warn",
                  proxConfirmed
                    ? "You have moved away from your checked position."
                    : "Checking — you may have moved from your position…");
                engine.report("face-proximity", proxConfirmed, proxConfirmed ? detail : null);
              }
              /* "unknown" — leave any running window as-is; a brief
                 unmeasurable frame never clears or confirms a move. */
            }
          } else if (faces === 0) {
            /* NO face: tolerate short gaps (ordinary movement) — the
               violation is only CONFIRMED once the face has been
               missing past lostGraceMs. A zero face also clears any
               multi-face incident (the "second person" left first). */
            multiFaceSince = null;
            multiFaceClearedSince = atF;
            var absentFor = atF - (lastFaceOkAt || started);
            var missing = absentFor >= cfg.face.lostGraceMs;
            setStatus("face", missing ? "fail" : "ok",
              missing ? "No face visible" : "Looking for your face…");
            engine.report("face-missing", missing, "No person was visible in the camera frame.");
            engine.report("face-multiple", false, null);
            engine.report("face-proximity", false, null);   /* v93 — no face to measure; the missing rule governs */
          } else {
            /* MULTIPLE faces: a person IS visible (so face-missing is
               clear), but the exam requires exactly one. */
            setStatus("face", "ok");
            lastFaceOkAt = atF;
            engine.report("face-missing", false, null);
            engine.report("face-proximity", false, null);   /* v93 — a person is present; the multiple rule governs */
            multiFaceClearedSince = null;
            if (multiFaceSince === null) multiFaceSince = atF - cfg.inference.faceIntervalMs;
            var persistFor = atF - multiFaceSince;
            var multiConfirmed = persistFor >= cfg.face.multipleConfirmMs;
            setStatus("face", multiConfirmed ? "fail" : "warn",
              multiConfirmed
                ? "More than one person is visible in the camera frame."
                : "Checking — more than one person may be in frame…");
            engine.report("face-multiple", multiConfirmed, multiConfirmed
              ? ("More than one person was detected in the camera view for " + Math.round(persistFor / 1000) + "s.")
              : null);
          }
        } catch (e) {
          noteDetectorFailure("face");
        }
      }, cfg.inference.faceIntervalMs);

      /* ---- phone-like object (own detector health, v89/v91) ---- */
      every(async function () {
        if (!running || !p.runPhoneDetection) return;
        try {
          var hit = await p.runPhoneDetection();
          var at = now();
          /* v91 — the runtime answers -1 (unavailable) / -3 (timed
             out) as NUMBERS. A number is a detector FAILURE — never a
             phone hit (which is an object) and never a clean scan
             (which is null). Count it in this detector's own health so
             a dead/hung phone scan can never pass itself off as
             "nothing detected", and a permanently hung detector trips
             monitoring-failure just like a throwing one. */
          if (typeof hit === "number") {
            noteDetectorFailure("phone");
            setStatus("phone", detectorHealth.phone.status === "fail" ? "fail" : "degraded",
              "Phone detection is unavailable — retrying…");
            return;
          }
          noteDetectorSuccess("phone", at);
          if (hit) {
            phoneRecent.push({ at: at, score: hit.score });
            setStatus("phone", "warn", "Possible phone (checking…)");
          } else {
            setStatus("phone", "ok");
          }
          phoneRecent = phoneRecent.filter(function (x) { return x.at >= at - cfg.phone.confirmWindowMs; });
          var confirmed = phoneRecent.length >= cfg.phone.confirmCount;
          engine.report("phone-detected", confirmed, confirmed
            ? ("A phone-like object was confirmed in the camera view (" + phoneRecent.length + " detections within " + (cfg.phone.confirmWindowMs / 1000) + "s).")
            : null);
          if (!confirmed && !hit) phoneRecent = phoneRecent.filter(function (x) { return x.at >= at - cfg.phone.clearGapMs; });
        } catch (e) {
          noteDetectorFailure("phone");
        }
      }, cfg.inference.phoneIntervalMs);

      /* ---- audio ---- */
      every(function () {
        if (!running || !p.audio) return;
        var health = p.audio.health ? p.audio.health() : { live: false, reason: "no-audio" };
        if (!health.live) {
          setStatus("mic", "fail", health.detail);
          engine.report("microphone-lost", true, health.detail || "The microphone stopped working.");
          return;
        }
        var f = p.audio.features ? p.audio.features() : null;
        if (!f) {
          engine.report("monitoring-failure", true, "The audio analysis pipeline produced no data.");
          return;
        }
        setStatus("mic", "ok");
        var r = p.audio.watcher.observe(f, now(), cfg.inference.audioIntervalMs);
        if (!r.valid) { engine.report("monitoring-failure", true, "Audio analysis returned invalid data."); return; }
        if (r.micDead) engine.report("microphone-lost", true, "The microphone is delivering no audio (digital silence).");
        else engine.report("microphone-lost", false, null);
        engine.report("voice-detected", r.voiceEvent, "Speech was detected by the microphone.");
        engine.report("sound-detected", r.soundEvent, "A significant sound above the calibrated background level was detected.");
      }, cfg.inference.audioIntervalMs);

      /* ---- overall health: frozen picture, dead loops ---- */
      every(function () {
        if (!running) return;
        var health = p.camera.health ? p.camera.health() : { live: false };
        if (health.live) {
          /* new frames must be arriving */
          if (typeof health.videoTime === "number") {
            if (frameTimes.lastVideoTime === health.videoTime) {
              frameTimes.sinceChange = (frameTimes.sinceChange || now()) ;
              if (now() - frameTimes.sinceChange >= cfg.recovery.frozenVideoMs) {
                setStatus("camera", "fail", "The camera picture is frozen.");
                engine.report("camera-lost", true, "No new camera frames arrived — the feed appears frozen or disconnected.");
                return;
              }
            } else {
              frameTimes.lastVideoTime = health.videoTime;
              frameTimes.sinceChange = null;
            }
          }
        }
        if (engine.getState() === "IN_PROGRESS" || engine.getState() === "WARNING_SHOWN") {
          setStatus("monitoring", statuses.monitoring === "recovering" ? "recovering" : "active");
        }
      }, cfg.inference.healthIntervalMs);   /* v93 fix — this used to read an undefined cfg.recovery.* interval (became a ~1ms tight loop); the real constant lives under CONFIG.inference */

      emit();
      return true;
    }

    function stop() {
      stopAll();
      /* per-attempt state is cleared on stop as well as start: a
         stopped monitor never leaks flags into anything else */
      detectorHealth = {
        face: { failures: 0, lastSuccessAt: null, status: "idle" },
        phone: { failures: 0, lastSuccessAt: null, status: "idle" }
      };
      multiFaceSince = null;
      multiFaceClearedSince = null;
      phoneRecent = [];
      frameTimes = { lastVideoTime: null, sinceChange: null };
      proxSince = null;
      proxClearedSince = null;
      proxLastOkAt = null;
      statuses = { camera: "idle", face: "idle", phone: "idle", mic: "idle", fullscreen: "idle", monitoring: "idle" };
      emit();
    }

    return {
      start: start,
      stop: stop,
      isRunning: function () { return running; },
      statuses: function () { return Object.assign({}, statuses); },
      /* v89 — independent per-detector health (Part 3B), exposed for
         tests and diagnostics. */
      detectorHealth: function () {
        return {
          face: Object.assign({}, detectorHealth.face),
          phone: Object.assign({}, detectorHealth.phone)
        };
      }
    };
  }

  /* ============================================================
     BROWSER RUNTIME — real media devices, real models, real
     fullscreen. All of it lives behind this object so app.js stays
     a thin integration layer and tests can replace every part.
     ============================================================ */
  var modelCache = null;      // one load per page
  var modelCachePromise = null;
  /* v89 — model readiness is a first-class state (Part 3B): a failed
     or unloaded mandatory model is never displayed as ready. */
  var modelsState = { status: "idle", error: null, loadedAt: null };  // idle | loading | ready | failed

  function browserSupported() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return false;
    return typeof navigator.mediaDevices.getUserMedia === "function";
  }

  function createRuntime(opts) {
    var o = opts || {};
    var cfg = o.config || CONFIG;
    var doc = o.document || (typeof document !== "undefined" ? document : null);
    var nav = o.navigator || (typeof navigator !== "undefined" ? navigator : null);
    var visionBase = o.visionBase || null;    // absolute URL of vendor/vision/
    var videoEl = null, canvasEl = null, ctx2d = null;
    var videoStream = null, audioStream = null, audioCtx = null, analyser = null, timeBuf = null;
    var faceTask = null, objectTask = null;
    var visionMod = null;
    var sampleFrames = 0;
    /* v90 — genuinely-new-frame tracking. requestVideoFrameCallback
       counts only the frames the browser ACTUALLY presented; without
       it we watch currentTime advance. Blank sampling, the feed wait
       and the pre-check detector passes all use this, so a frozen or
       not-yet-ready picture is never counted as fresh evidence and
       repeated reads of one frame never look like new samples. */
    var presentedFrames = 0;
    var lastPresentedAt = 0;
    var hasRvfc = false, rvfcActive = false;
    var lastDrawnPresented = -1, lastObservedMediaTime = -1;
    /* v91 — non-rVFC fallback state (Part 3): the element's own decoded-
       frame counter is preferred when it works, currentTime only when
       it does not, and a counter that never moves while the clock does
       is eventually distrusted (in either direction). */
    var lastQuality = -1, qualityStalledAt = 0, qualityRejected = false;
    var lastPlayError = null;          // v91 — play() rejection, surfaced in diagnostics
    var lastFrameIntervalMs = null;    // v91 — ms between the last two presented frames
    var lastPresentedTick = 0;
    var lastStats = null;
    /* v91 — the PIXELS of the last analysed frame: freshness under a
       starved rVFC callback is decided by comparing these (Part 3). */
    var lastLuma = null;
    var watcher = createAudioWatcher(cfg.audio);

    function base() {
      if (visionBase) return visionBase;
      /* resolve vendor/vision/ next to this script — use the URL captured at
         module load (SCRIPT_SRC); never derive from location.href, which breaks
         on prerendered sub-page routes. */
      try {
        var here = SCRIPT_SRC || ((typeof location !== "undefined") ? location.href : "");
        if (!here) return "/vendor/vision/";
        return new URL("vendor/vision/", here).href;
      } catch (e) {
        return "/vendor/vision/";
      }
    }

    /* ---------- models ---------- */
    async function loadModels(onProgress) {
      if (modelCache) return modelCache;
      if (modelCachePromise) return modelCachePromise;
      if (typeof Promise === "undefined") return Promise.reject(new Error("no-promises"));
      modelsState = { status: "loading", error: null, loadedAt: null };
      modelCachePromise = (async function () {
        try {
          if (typeof onProgress === "function") onProgress("bundle");
          var vision;
          try {
            vision = await import(/* webpackIgnore: true */ new URL("vision_bundle.mjs", base()).href);
          } catch (e) {
            throw new Error("The vision runtime could not be loaded from " + base() + "vision_bundle.mjs — check your connection and reload.");
          }
          visionMod = vision;
          if (typeof onProgress === "function") onProgress("wasm");
          var fileset = await vision.FilesetResolver.forVisionTasks(new URL("wasm/", base()).href);
          if (typeof onProgress === "function") onProgress("face");
          /* DELEGATE IS PINNED TO CPU — deliberately, on verified grounds.
             On machines where the GPU delegate is used by default, the
             object detector was observed returning the SAME canned
             detections ("boat/person/surfboard" at a few percent) for
             every input, including a blank canvas — a stale/failed GPU
             buffer that never looks at the actual picture (verified in
             Chrome against the vendored efficientdet_lite0.tflite; the
             CPU delegate returned a real "cell phone" detection on a
             phone photograph and nothing on the blank canvas).
             A phone check that ignores its input could warn and terminate
             students for the GPU's leftovers, so CPU inference (small
             models, ~700ms intervals) is the only honest choice here. */
          var face = await vision.FaceDetector.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: new URL("models/blaze_face_short_range.tflite", base()).href, delegate: "CPU" },
            runningMode: "VIDEO",
            minDetectionConfidence: cfg.face.minScore
          });
          if (typeof onProgress === "function") onProgress("object");
          var object = await vision.ObjectDetector.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: new URL("models/efficientdet_lite0.tflite", base()).href, delegate: "CPU" },
            runningMode: "VIDEO",
            scoreThreshold: cfg.phone.scoreThreshold,
            maxResults: 5,
            classificationOptions: { scoreThreshold: cfg.phone.scoreThreshold, maxResults: 5, categoryAllowList: cfg.phone.allowCategories }
          });
          modelCache = { face: face, object: object, vision: vision };
          modelCachePromise = null;
          modelsState = { status: "ready", error: null, loadedAt: Date.now() };
          return modelCache;
        } catch (e) {
          modelsState = { status: "failed", error: (e && e.message) || "unknown error", loadedAt: null };
          throw e;
        }
      })();
      return modelCachePromise.catch(function (e) { modelCachePromise = null; throw e; });
    }
    function modelsStatus() {
      return { status: modelsState.status, error: modelsState.error, loadedAt: modelsState.loadedAt, ready: !!(modelCache && modelCache.face && modelCache.object) };
    }

    /* ---------- camera ---------- */
    async function requestCamera() {
      if (!nav || !nav.mediaDevices || !nav.mediaDevices.getUserMedia) throw Object.assign(new Error("mediaDevices unavailable"), { name: "UnsupportedError" });
      /* a retry must never leave a previous attempt's stream alive —
         stop the old tracks FIRST, before requesting the new camera */
      if (videoStream) { try { videoStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} }
      videoStream = null;
      /* v91 — PART 2: IDEAL-only constraints. facingMode, size and
         frame rate are PREFERENCES the device negotiates down (never
         `exact`), so a phone or webcam that cannot honour one of them
         still grants a camera. If a browser still rejects the
         dictionary (older engines, unusual webcam stacks), retry once
         with the barest possible request instead of failing the
         student — a working camera matters more than a resolution. */
      var want = {
        video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
        audio: false
      };
      try {
        videoStream = await nav.mediaDevices.getUserMedia(want);
      } catch (e) {
        var n = (e && e.name) || "";
        var retriable = (n === "OverconstrainedError" || n === "TypeError" || n === "NotSupportedError");
        /* permission denial / busy device are REAL answers — never retried */
        if (!retriable) throw e;
        videoStream = await nav.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      return videoStream;
    }
    function attachCamera(stream) {
      var s = stream || videoStream;
      if (!doc || !s) return Promise.reject(new Error("no document/stream"));
      if (!videoEl) {
        videoEl = doc.createElement("video");
        videoEl.setAttribute("playsinline", "");            // iOS/Android: inline, never takeover
        videoEl.setAttribute("disablePictureInPicture", "");
        videoEl.muted = true;                               // muted + playsinline → autoplay allowed
        videoEl.autoplay = true;
        videoEl.setAttribute("aria-hidden", "true");
      }
      /* a new stream starts a NEW frame history — nothing from a
         previous attempt may count as "already seen" (v90), and no
         play() rejection or frame-counter state may leak either (v91) */
      presentedFrames = 0; lastPresentedAt = 0;
      lastDrawnPresented = -1; lastObservedMediaTime = -1;
      lastQuality = -1; qualityStalledAt = 0; qualityRejected = false;
      lastPlayError = null; lastFrameIntervalMs = null; lastPresentedTick = 0;
      lastStats = null;
      videoEl.srcObject = s;
      watchPresentedFrames();
      var p;
      try { p = videoEl.play(); } catch (e) { p = null; lastPlayError = (e && e.name) || String(e); }
      return Promise.resolve(p)
        .catch(function (err) {
          /* v91 — a play() rejection is RECORDED for diagnostics, not
             silently swallowed: muted+playsinline streams normally
             still decode frames, and the feed stage decides the truth.
             The play promise itself never fails this call. */
          lastPlayError = (err && err.name) || String(err);
        })
        .then(function () { return waitForMetadata(); });
    }
    /* v91 — PART 2.9: after attaching, wait for metadata AND a nonzero
       frame size, bounded by precheckMetadataTimeoutMs. This ORIENTS
       the stages: the feed stage afterwards only has to wait for
       actual frames, and a camera that never reports dimensions is
       named at the right stage. Never throws — later stages report. */
    function waitForMetadata() {
      return new Promise(function (res) {
        if (!videoEl) return res(false);
        if (videoEl.readyState >= 1 && videoEl.videoWidth && videoEl.videoHeight) return res(true);
        var done = false, timer = null, iv = null;
        function finish(ok) {
          if (done) return;
          done = true;
          if (iv) clearInterval(iv);
          if (timer) clearTimeout(timer);
          try {
            videoEl.removeEventListener("loadedmetadata", onMeta);
            videoEl.removeEventListener("loadeddata", onMeta);
            videoEl.removeEventListener("canplay", onMeta);
          } catch (e) {}
          res(ok);
        }
        function onMeta() { finish(!!(videoEl && videoEl.videoWidth && videoEl.videoHeight)); }
        var haveEvents = false;
        try {
          videoEl.addEventListener("loadedmetadata", onMeta);
          videoEl.addEventListener("loadeddata", onMeta);
          videoEl.addEventListener("canplay", onMeta);
          haveEvents = true;
        } catch (e) { haveEvents = false; }
        iv = setInterval(function () {
          if (videoEl && videoEl.readyState >= 1 && videoEl.videoWidth && videoEl.videoHeight) finish(true);
        }, 100);
        timer = setTimeout(function () { finish(false); }, cfg.inference.precheckMetadataTimeoutMs);
        /* elements without event support: the immediate poll decides */
        if (!haveEvents && videoEl && videoEl.readyState >= 1 && videoEl.videoWidth && videoEl.videoHeight) finish(true);
      });
    }
    function trackLive(stream) {
      var s = stream || videoStream;
      if (!s) return false;
      var t = s.getVideoTracks ? s.getVideoTracks()[0] : null;
      return !!t && t.readyState === "live" && t.enabled !== false && !t.muted;
    }
    /* v90 — TRUE presented-frame watch: requestVideoFrameCallback
       fires only when a newly decoded frame is presented, so its
       ticks are proof the camera is delivering. currentTime is only
       a fallback clock: some pipelines advance it on a frozen
       picture, and re-reading the same element always looks "live"
       to a naive sampler. */
    function watchPresentedFrames() {
      if (!videoEl || typeof videoEl.requestVideoFrameCallback !== "function") return;
      if (rvfcActive) return;
      hasRvfc = true;
      var handle = function () {
        if (!videoEl || !rvfcActive) return;
        presentedFrames++;
        notePresentedTick();
        try { videoEl.requestVideoFrameCallback(handle); } catch (e) { rvfcActive = false; }
      };
      rvfcActive = true;
      try { videoEl.requestVideoFrameCallback(handle); } catch (e) { rvfcActive = false; }
    }
    function notePresentedTick() {
      var tn = Date.now();
      if (lastPresentedTick) lastFrameIntervalMs = tn - lastPresentedTick;
      lastPresentedTick = tn;
      lastPresentedAt = tn;
    }
    /* Fallback freshness bookkeeping (no rVFC, or a broken rVFC
       chain) — v91, the validated tier order (Part 3):
         1. getVideoPlaybackQuality().totalVideoFrames — the element's
            own decoded-frame counter, which moves ONLY when a frame is
            decoded (strongest non-rVFC signal);
         2. currentTime — used while the quality counter is absent,
            still at 0 (never populated) or has been proven dead
            (frozen while the clock kept advancing past 2×frameFreshMs);
         3. if the counter is frozen while the clock is ALSO frozen,
            nothing counts — that is simply a frozen picture.
       Every tier counts a frame only when its signal CHANGES — a
       re-read of one frame never becomes a new sample. */
    function noteFrameProgress() {
      if (!videoEl || (hasRvfc && rvfcActive)) return;
      if (videoEl.readyState < 2 || !videoEl.videoWidth) return;
      if (!qualityRejected) {
        var q = null;
        try { q = (typeof videoEl.getVideoPlaybackQuality === "function") ? videoEl.getVideoPlaybackQuality() : null; } catch (e) { q = null; }
        if (q && typeof q.totalVideoFrames === "number" && q.totalVideoFrames > 0) {
          if (lastQuality === -1) { lastQuality = q.totalVideoFrames; return; }   // seed on first usable read
          if (q.totalVideoFrames !== lastQuality) {
            lastQuality = q.totalVideoFrames;
            qualityStalledAt = 0;
            presentedFrames++;
            notePresentedTick();
            return;
          }
          /* counter frozen this read — did the media clock move? */
          if (videoEl.currentTime !== lastObservedMediaTime) {
            lastObservedMediaTime = videoEl.currentTime;
            if (!qualityStalledAt) qualityStalledAt = Date.now();
            else if (Date.now() - qualityStalledAt > 2 * cfg.inference.frameFreshMs) qualityRejected = true;
          } else {
            qualityStalledAt = 0;   // both frozen — consistent; no evidence against the counter
          }
          return;
        }
      }
      var t = videoEl.currentTime;
      if (t !== lastObservedMediaTime) {
        lastObservedMediaTime = t;
        presentedFrames++;
        notePresentedTick();
      }
    }
    /* Is there a picture newer than frameFreshMs? The pre-check uses
       this to refuse detector passes on a frozen or stale frame.
       v91 — a zero-SIZED frame (either dimension) is not fresh: if
       frameStats() refuses to analyse it, no detector may pass on it. */
    function framesFresh() {
      if (!videoEl || videoEl.readyState < 2 || !videoEl.videoWidth || !videoEl.videoHeight) return false;
      noteFrameProgress();
      if (!lastPresentedAt) return false;
      return (Date.now() - lastPresentedAt) <= cfg.inference.frameFreshMs;
    }
    /* v91 — exact pixel-luma equality (Part 3): two 64×48 luma arrays
       are equal only when NOTHING on screen changed. A live sensor's
       noise makes every real frame differ, so equality is a reliable
       "picture frozen" signal — and comparing pixels is the reliable
       way to tell rVFC callback LAG apart from a real freeze. */
    function lumaEqual(a, b) {
      if (!a || !b || a.length !== b.length) return false;
      for (var iL = 0; iL < a.length; iL++) if (a[iL] !== b[iL]) return false;
      return true;
    }
    function frameStats() {
      var out = { frames: sampleFrames, stats: null, raw: null, fresh: false, ready: false,
                  presented: presentedFrames, reason: "", freshIntervalMs: lastFrameIntervalMs };
      if (!videoEl) { out.reason = "no-video"; return out; }
      out.mediaTime = videoEl.currentTime;
      out.readyState = videoEl.readyState;
      out.width = videoEl.videoWidth || 0;
      out.height = videoEl.videoHeight || 0;
      /* v91 — a zero-SIZED frame (either dimension) is rejected: no
         metadata or a degenerate stream can never be analysed. */
      if (!videoEl.videoWidth || !videoEl.videoHeight) { out.reason = "no-metadata"; return out; }
      /* metadata alone is not enough: without a decoded current frame
         drawImage produces a blank/black picture (v90) */
      if (videoEl.readyState < 2) { out.reason = "no-current-frame"; return out; }
      out.ready = true;
      noteFrameProgress();
      out.presented = presentedFrames;
      /* the same picture as the last read is reported with its cached
         stats but fresh:false — a frozen frame is never counted as a
         new sample. v91 Part 3 — when the presented-frame counter did
         not move, the rVFC callback may simply be STARVED (it runs on
         the main thread, which inference can block for hundreds of
         ms) while the element already displays newer pixels. So the
         verdict is taken from the PIXELS themselves: identical pixels
         are a genuinely frozen picture (a live sensor's noise makes
         every real frame differ); changed pixels are a fresh sample
         no matter what the callback says. A draw failure falls back
         to the counter's verdict — the pre-existing behaviour. */
      if (!canvasEl) {
        canvasEl = doc.createElement("canvas");
        canvasEl.width = 64; canvasEl.height = 48;
        ctx2d = canvasEl.getContext("2d", { willReadFrequently: true });
      }
      if (presentedFrames === lastDrawnPresented && lastStats) {
        var px = null;
        try {
          ctx2d.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
          var imgP = ctx2d.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
          px = new Uint8ClampedArray((imgP.length / 4));
          for (var iP = 0, jP = 0; iP < imgP.length; iP += 4, jP++) {
            px[jP] = (imgP[iP] * 299 + imgP[iP + 1] * 587 + imgP[iP + 2] * 114) / 1000;
          }
        } catch (eP) { px = null; }
        if (px !== null && lastLuma && !lumaEqual(lastLuma, px)) {
          /* the pixels MOVED while the counter stood still — rVFC lag,
             not a frozen picture: analyse this fresh picture through
             the normal bookkeeping (reusing the luma just read) */
          lastDrawnPresented = presentedFrames;
          var stP = lumaStats(px, 3);
          if (!stP) { out.reason = "read-failed"; return out; }
          lastStats = stP;
          lastLuma = px;
          lastPresentedAt = Date.now();
          sampleFrames++;
          out.stats = stP;
          out.raw = px;
          out.frames = sampleFrames;
          out.fresh = true;
          return out;
        }
        out.stats = lastStats;
        out.reason = "same-frame";
        return out;
      }
      try {
        ctx2d.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        var img = ctx2d.getImageData(0, 0, canvasEl.width, canvasEl.height).data;
        /* RGBA → luma for every pixel — plenty for blank detection */
        var luma = new Uint8ClampedArray((img.length / 4));
        for (var i = 0, j = 0; i < img.length; i += 4, j++) {
          luma[j] = (img[i] * 299 + img[i + 1] * 587 + img[i + 2] * 114) / 1000;
        }
        var st = lumaStats(luma, 3);
        if (!st) { out.reason = "read-failed"; return out; }
        lastDrawnPresented = presentedFrames;
        lastStats = st;
        lastLuma = luma;
        lastPresentedAt = Date.now();
        sampleFrames++;
        out.stats = st;
        out.raw = luma;
        out.frames = sampleFrames;
        out.fresh = true;
        return out;
      } catch (e) {
        out.reason = "read-failed";
        return out;
      }
    }
    function cameraHealth() {
      if (!videoStream) return { live: false, reason: "no-camera", detail: "No camera stream is open." };
      var t = videoStream.getVideoTracks ? videoStream.getVideoTracks()[0] : null;
      if (!t) return { live: false, reason: "no-track", detail: "The camera has no video track." };
      if (t.readyState !== "live") return { live: false, reason: "ended", detail: "The camera track stopped (device disconnected or camera taken by another app)." };
      if (videoEl && !videoEl.videoWidth) return { live: false, reason: "no-frames", detail: "The camera is live but no frames are arriving." };
      return { live: true, videoTime: videoEl ? videoEl.currentTime : null, readyState: t.readyState };
    }
    /* v91 — safe camera facts for the diagnostics area (Part 8):
       track state, negotiated settings, element dimensions, which
       frame-timestamp mechanism is in use, and any play() rejection.
       Numbers and short strings only. */
    function cameraInfo() {
      var t = videoStream && videoStream.getVideoTracks ? videoStream.getVideoTracks()[0] : null;
      var st = null;
      try { st = (t && typeof t.getSettings === "function") ? t.getSettings() : null; } catch (e) { st = null; }
      return {
        trackState: t ? t.readyState : "none",
        muted: t ? !!t.muted : null,
        hasRvfc: hasRvfc,
        playError: lastPlayError,
        frameIntervalMs: lastFrameIntervalMs,
        video: videoEl ? { width: videoEl.videoWidth, height: videoEl.videoHeight, readyState: videoEl.readyState } : null,
        settings: st ? { width: st.width, height: st.height, frameRate: st.frameRate, facingMode: st.facingMode } : null
      };
    }

    /* ---------- microphone ---------- */
    async function requestMic() {
      if (!nav || !nav.mediaDevices || !nav.mediaDevices.getUserMedia) throw Object.assign(new Error("mediaDevices unavailable"), { name: "UnsupportedError" });
      if (audioStream) { try { audioStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {} }
      audioStream = await nav.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }, video: false });
      return audioStream;
    }
    async function startAudio(stream) {
      var s = stream || audioStream;
      if (!s) throw new Error("no audio stream");
      var Ctx = (typeof window !== "undefined") && (window.AudioContext || window.webkitAudioContext);
      if (!Ctx) throw Object.assign(new Error("Web Audio unavailable"), { name: "NotSupportedError" });
      if (audioCtx && audioCtx.state === "closed") audioCtx = null;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") { try { await audioCtx.resume(); } catch (e) { /* permission-gated resume can wait */ } }
      var src = audioCtx.createMediaStreamSource(s);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = cfg.audio.fftSize;
      analyser.smoothingTimeConstant = 0;
      src.connect(analyser);
      timeBuf = new Float32Array(analyser.fftSize);
      watcher.reset();
      return true;
    }
    function audioFeaturesNow() {
      if (!analyser || !timeBuf) return null;
      analyser.getFloatTimeDomainData(timeBuf);
      return audioFeatures(timeBuf, audioCtx ? audioCtx.sampleRate : 44100, cfg.audio);
    }
    function micHealth() {
      if (!audioStream) return { live: false, detail: "No microphone stream is open." };
      var t = audioStream.getAudioTracks ? audioStream.getAudioTracks()[0] : null;
      if (!t) return { live: false, detail: "The microphone has no audio track." };
      if (t.readyState !== "live") return { live: false, detail: "The microphone track stopped (device disconnected or permission revoked)." };
      if (!analyser) return { live: false, detail: "The audio analysis pipeline is not running." };
      return { live: true };
    }

    /* ---------- fullscreen ---------- */
    function fullscreenSupported() {
      if (!doc) return false;
      var el = doc.documentElement;
      return !!(el && typeof el.requestFullscreen === "function" && doc.addEventListener)
        || !!(el && (typeof el.webkitRequestFullscreen === "function"));
    }
    function fullscreenActive() {
      if (!doc) return false;
      return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
    }
    /* Request AND verify: calling the API never counts as success. */
    async function requestFullscreenVerified() {
      if (!fullscreenSupported()) return { ok: false, reason: "unsupported", detail: "Fullscreen is not supported on this browser or device." };
      var el = doc.documentElement;
      try {
        var req = doc.fullscreenEnabled === false ? null : (el.requestFullscreen || el.webkitRequestFullscreen);
        if (!req) return { ok: false, reason: "unsupported", detail: "This browser reports fullscreen as disabled." };
        await Promise.resolve(req.call(el));
      } catch (e) {
        return { ok: false, reason: "rejected", detail: "Fullscreen was rejected (" + ((e && e.name) || (e && e.message) || "permission denied") + ")." };
      }
      /* give the browser a moment to settle, then READ the real state */
      var waited = 0;
      while (waited < cfg.fullscreen.verifyTimeoutMs) {
        if (fullscreenActive()) return { ok: true, detail: "Fullscreen is active." };
        await sleep(50);
        waited += 50;
      }
      return { ok: false, reason: "not-entered", detail: "The fullscreen request completed but fullscreen is not actually active." };
    }
    async function exitFullscreen() {
      if (!doc || !fullscreenActive()) return;
      try {
        var exit = doc.exitFullscreen || doc.webkitExitFullscreen;
        if (exit) await Promise.resolve(exit.call(doc));
      } catch (e) { /* already gone */ }
    }

    /* ---------- detection adapters used by precheck + live ---------- */
    /* MediaPipe's detectForVideo REQUIRES strictly increasing
       timestamps; a wall clock can jump (suspension, clock skew) and a
       face/phone model silently returns nothing from then on. One
       shared monotonic counter feeds both detectors and can never go
       backwards or repeat. */
    var detClock = 0;
    function nextDetTs() {
      var base = (typeof performance !== "undefined" && performance.now) ? Math.round(performance.now()) : Date.now();
      if (base > detClock) detClock = base; else detClock += 1;
      return detClock;
    }
    /* v90/v91 — SINGLE-FLIGHT: one inference per detector at a time. If a
       pass is still running, the next caller JOINS it instead of
       stacking another detectForVideo on the same task (MediaPipe
       VIDEO mode misbehaves when overlapped, and queued passes would
       only analyse stale frames) — joining on the current frame IS the
       bounded "latest frame" strategy (Part 6). The video must also
       hold a decoded frame (readyState >= HAVE_CURRENT_DATA) before
       any pass runs.

       v91 — every pass is bounded by inferTimeoutMs (Parts 5/7):
         * on timeout the caller gets -3 ("detection timed out", its
           OWN state) instead of waiting forever;
         * the flight is NOT cleared on timeout — the underlying call
           may still settle later, and starting a second detectForVideo
           over a live one is exactly what must never happen;
         * a flight already older than inferTimeoutMs short-circuits
           future callers immediately, so a permanently hung model can
           never pile up waiting callers in the pre-check or live exam;
         * genuine rejections still PROPAGATE (the pre-check maps them
           to a model failure; the live monitor counts them). */
    var faceFlight = null, phoneFlight = null;
    function flightWait(flight) {
      var left = cfg.inference.inferTimeoutMs - (Date.now() - flight.startedAt);
      if (left <= 0) { flight.timedOut = true; return Promise.resolve({ timeout: true }); }
      return inferTimeout(flight.promise, left);
    }
    /* v91 — PART 6: ONE inference runs at a time across BOTH detectors.
       The pre-check's face loop and phone loop are separate tasks; the
       shared slot queues a pass behind whatever the other detector is
       doing (bounded: at most one queued pass per detector, and every
       waiter is still capped by inferTimeoutMs through its flight), so
       a weak device never executes two MediaPipe passes at once —
       the CPU spike, the frame starvation and the "processing camera"
       stalls all stay bounded to a single inference.

       Recovery: if the queued-against chain has been busy for longer
       than the timeout (a dead WASM call that never settles), the slot
       treats it as broken and starts anyway — mirroring the existing
       per-flight rule where an aged flight is short-circuited — so a
       hung call can never take BOTH detectors down permanently. */
    var inferBusy = null, inferBusyAt = 0;
    function inferSlot(work) {
      var stale = !inferBusy || (Date.now() - inferBusyAt) > (cfg.inference.inferTimeoutMs + 1000);
      var prev = stale ? Promise.resolve() : inferBusy;
      var run = prev.then(work, work);   /* a failed predecessor never blocks the next pass */
      inferBusy = run.then(function () {}, function () {});
      inferBusyAt = Date.now();
      return run;
    }
    async function facePass(taskOverride) {
      var flight = faceFlight;
      if (!flight) {
        var f = {
          startedAt: Date.now(),
          timedOut: false,
          promise: (async function () {
            var task = taskOverride || faceTask || (modelCache && modelCache.face);
            if (!task || !videoEl || !videoEl.videoWidth || videoEl.readyState < 2) return -1;
            noteFrameProgress();
            /* v91 — PART 6: this pass takes the shared inference slot,
               so face and phone inference never overlap on a device. */
            return inferSlot(async function () {
              var ts = nextDetTs();
              var res = await task.detectForVideo(videoEl, ts);
              return (res && res.detections) || [];
            });
          })()
        };
        /* clear the flight only when the underlying inference REALLY
           settles — never on timeout */
        f.promise.then(function () { if (faceFlight === f) faceFlight = null; },
                       function () { if (faceFlight === f) faceFlight = null; });
        faceFlight = f;
        flight = f;
      }
      var r = await flightWait(flight);
      if (r.timeout) return -3;
      if (r.error !== undefined) throw r.error;
      return r.value;
    }
    async function runFaceDetection(taskOverride) {
      var dets = await facePass(taskOverride);
      if (typeof dets !== "number") return countFaces(dets, cfg.face);
      return dets;
    }
    /* v93 Part 4 — the same single-flight inference, but returning the
       merged DISTINCT faces WITH their normalised boxes so proximity
       can measure size/position. Same -1 / -3 sentinels as the count
       variant, so callers treat failures identically. */
    async function runFaceDetections(taskOverride) {
      var dets = await facePass(taskOverride);
      if (typeof dets === "number") return dets;
      return mergeFaceDetections(dets, cfg.face);
    }
    async function runPhoneDetection(taskOverride) {
      var flight = phoneFlight;
      if (!flight) {
        var f = {
          startedAt: Date.now(),
          timedOut: false,
          promise: (async function () {
            var task = taskOverride || objectTask || (modelCache && modelCache.object);
            /* v91 — an unavailable detector answers -1, NEVER null:
               null means "inference completed, no phone seen" and an
               unavailable detector must not read as a clean scan. */
            if (!task || !videoEl || !videoEl.videoWidth || videoEl.readyState < 2) return -1;
            noteFrameProgress();
            /* v91 — PART 6: same shared slot as the face detector —
               strictly one MediaPipe pass in flight at any moment. */
            return inferSlot(async function () {
              var ts = nextDetTs();
              var res = await task.detectForVideo(videoEl, ts);
              return bestPhoneDetection((res && res.detections) || [], cfg.phone);
            });
          })()
        };
        f.promise.then(function () { if (phoneFlight === f) phoneFlight = null; },
                       function () { if (phoneFlight === f) phoneFlight = null; });
        phoneFlight = f;
        flight = f;
      }
      var r = await flightWait(flight);
      if (r.timeout) return -3;
      if (r.error !== undefined) throw r.error;
      return r.value;
    }

    function releaseAll() {
      /* v91 — PART 3.9: leaving the pre-check (Back, retry after a
         hard failure, termination) ABANDONS any in-flight pre-check
         observation window: its sampling loops see the generation
         change at their next check and exit, instead of running on
         against a screen — and a camera — that are already gone. */
      observationGen++;
      try { if (videoStream) videoStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      try { if (audioStream) audioStream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
      videoStream = null; audioStream = null;
      if (videoEl) { try { videoEl.srcObject = null; } catch (e) {} }
      analyser = null; timeBuf = null;
      if (audioCtx) { try { audioCtx.close(); } catch (e) {} audioCtx = null; }
      sampleFrames = 0;
      presentedFrames = 0; lastPresentedAt = 0;
      lastDrawnPresented = -1; lastObservedMediaTime = -1; lastStats = null;
      lastQuality = -1; qualityStalledAt = 0; qualityRejected = false;
      lastPlayError = null; lastFrameIntervalMs = null; lastPresentedTick = 0;
      rvfcActive = false;
      faceFlight = null; phoneFlight = null;
      watcher = createAudioWatcher(cfg.audio);
    }

    return {
      config: cfg,
      supported: browserSupported,
      loadModels: loadModels,
      modelsStatus: modelsStatus,
      camera: {
        request: requestCamera, attach: attachCamera, trackLive: trackLive,
        frameStats: frameStats, health: cameraHealth, fresh: framesFresh,
        info: cameraInfo,
        frameSize: function () { return { width: videoEl ? videoEl.videoWidth || 0 : 0, height: videoEl ? videoEl.videoHeight || 0 : 0 }; },
        stream: function () { return videoStream; },
        el: function () { return videoEl; }
      },
      mic: {
        request: requestMic, start: startAudio, trackLive: function (s) {
          var st = s || audioStream;
          if (!st) return false;
          var t = st.getAudioTracks ? st.getAudioTracks()[0] : null;
          return !!t && t.readyState === "live" && t.enabled !== false && !t.muted;
        },
        features: audioFeaturesNow, health: micHealth, stream: function () { return audioStream; },
        /* ALWAYS the current watcher instance. A plain property would
           go stale the moment releaseAll() created a fresh one, and
           the live monitor would then observe an orphan while the
           real pipeline fed a different object. */
        get watcher() { return watcher; },
        /* Adopt a validated calibration onto the CURRENT watcher (used
           when the runtime recreated its watcher after the pre-check
           calibrated a different instance). */
        adoptCalibration: function (gates) {
          return !!(watcher && watcher.applyCalibration && watcher.applyCalibration(gates));
        },
        isCalibrated: function () { return !!(watcher && watcher.isCalibrated()); },
        gates: function () { return watcher ? watcher.gates() : null; }
      },
      fullscreen: { supported: fullscreenSupported, active: fullscreenActive, request: requestFullscreenVerified, exit: exitFullscreen },
      runFaceDetection: runFaceDetection,
      runFaceDetections: runFaceDetections,
      runPhoneDetection: runPhoneDetection,
      releaseAll: releaseAll
    };
  }

  return {
    CONFIG: CONFIG,
    VIOLATIONS: VIOLATIONS,
    STATES: STATES,
    CHECK_IDS: CHECK_IDS,
    CHECK_LABELS: CHECK_LABELS,
    MANDATORY_CHECKS: MANDATORY_CHECKS,
    STATUS: STATUS,
    lumaStats: lumaStats,
    isSuspectFrame: isSuspectFrame,
    createBlackWatcher: createBlackWatcher,
    boxIou: boxIou,
    countFaces: countFaces,
    normBox: normBox,
    mergeFaceDetections: mergeFaceDetections,
    faceBoxMetrics: faceBoxMetrics,
    bestPhoneDetection: bestPhoneDetection,
    countRecent: countRecent,
    audioFeatures: audioFeatures,
    percentile: percentile,
    createAudioWatcher: createAudioWatcher,
    createEngine: createEngine,
    evalProximity: evalProximity,
    runPrechecks: runPrechecks,
    precheckOk: precheckOk,
    beginOk: beginOk,
    createLiveMonitor: createLiveMonitor,
    createRuntime: createRuntime
  };
});
