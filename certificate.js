/* ============================================================
   CERTIFICATE SYSTEM — Accountancy by Abhinash
   A certificate is first issued LOCALLY by the browser (per-device
   sequence, ACC-MONTHYYYY-NNNN) from the examination store in app.js
   as a PROVISIONAL number, so the result works offline. The registered
   certificate id is allocated by the database (Supabase) when the
   attempt syncs; app.js then ADOPTS that exact id into the certificate
   (examAdoptServerCertificateId) — so once registration is confirmed,
   every surface here (view, register, PDF, PNG, print, share) shows
   exactly the id stored in Supabase. This file is the presentation
   half: it renders a certificate record, exports it to PNG/PDF
   and prints it. Every certificate surface first passes the
   certEligible() gate: a disqualified attempt can never render,
   download, print or share a certificate.

   A certificate is generated for EVERY successfully evaluated
   submission — pass or fail — with one of two titles:
     • CERTIFICATE OF ACHIEVEMENT              (resultStatus PASS)
     • CERTIFICATE OF EXAMINATION COMPLETION   (resultStatus FAIL)
   The student's actual result is always displayed explicitly.
   ============================================================ */

/* ---------- 1. Storage (the device's certificate register) --
   localStorage IS the register now: it holds every certificate
   this device has issued, so History / Progress / My Certificates
   all render instantly and work offline.
   Honest limit: the register is per-device — an ID issued here
   cannot be verified from another browser, and the records can
   be edited by anyone with developer tools.
   ------------------------------------------------------------ */
const CERT_STORE_KEY = "abhinash_certificates_v1";
const CERT_WEBSITE_NAME = "Accountancy by Abhinash";
const CERT_WEBSITE_URL = "https://accountancybyabhinash.netlify.app/";

/* Normalise any certificate record (local or legacy) to
   the single shape the renderer expects. */
function certNormalize(raw) {
  if (!raw) return null;
  const pct = Number(raw.percentage) || 0;
  const resultStatus = raw.resultStatus === "FAIL" ? "FAIL" : raw.resultStatus === "PASS" ? "PASS" : (pct >= 40 ? "PASS" : "FAIL");
  return {
    id: raw.id,
    status: raw.status || "valid",
    candidateName: raw.candidateName || raw.studentName || "Student",
    schoolName: raw.schoolName || null,
    examTitle: raw.examTitle || raw.title || "Examination",
    className: raw.className || "Class 11",
    subject: raw.subject || "Accountancy",
    syllabus: raw.syllabus || "",
    marksObtained: Number(raw.marksObtained) || 0,
    maxMarks: Number(raw.maxMarks) || 0,
    percentage: pct,
    grade: raw.grade || "—",
    performance: raw.performance || "",
    resultStatus,
    examDate: raw.examDate || raw.issuedAt || new Date().toISOString(),
    issuedAt: raw.issuedAt || new Date().toISOString(),
    timeTakenSeconds: Number(raw.timeTakenSeconds) || 0,
    attemptId: raw.attemptId || null
  };
}

function certLoadAll() {
  try {
    const raw = localStorage.getItem(CERT_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function certSaveAll(list) {
  try { localStorage.setItem(CERT_STORE_KEY, JSON.stringify(list)); } catch (e) { /* storage full/blocked */ }
}
function certFindById(id) {
  return certLoadAll().find((c) => c.id === id) || null;
}
/* Cache a newly issued record locally (idempotent by id, so
   reopening never duplicates or re-numbers). */
function certCacheRecord(raw) {
  const cert = certNormalize(raw);
  if (!cert || !cert.id) return null;
  const list = certLoadAll().filter((c) => c.id !== cert.id);
  list.push(cert);
  certSaveAll(list.slice(-60));
  return cert;
}

/* Certificate eligibility — the ONE check every certificate
   surface consults (view, download, print, share). A disqualified
   attempt never earns a certificate: examCertificateEligible
   (app.js) consults the attempt record in the store, so even an
   injected or legacy register entry for that attempt stays
   blocked. */
function certEligible(c){
  const cc = (c && c.id) ? c : certNormalize(c);
  try {
    if (cc && cc.attemptId && typeof examCertificateEligible === "function") return !!examCertificateEligible(cc.attemptId);
  } catch (e) { /* gate open only when nothing can be proven */ }
  return true;
}
function certGate(c){
  if (certEligible(c)) return true;
  toast("This attempt was disqualified for a violation of the examination rules — no certificate can be issued for it.", "error", "shield-alert");
  return false;
}

/* Certificate titles — the two mandated variants. */
function certTitleFor(cert) {
  return cert.resultStatus === "PASS" ? "Certificate of Achievement" : "Certificate of Examination Completion";
}

function certFormatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
function certFormatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) +
    " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
function certFormatTime(seconds) {
  const s = Math.max(0, Math.round(seconds || 0));
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}m ${sec}s`;
}

/* ---------- 2. Lazy-loaded export libraries (jsPDF + html2canvas) ---------- */
let certLibsPromise = null;
function certLoadScriptWithTimeout(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src="' + src + '"]')) return resolve();
    const s = document.createElement("script");
    s.src = src; s.async = true;
    const timer = setTimeout(() => reject(new Error("timeout loading " + src)), 8000);
    s.onload = () => { clearTimeout(timer); resolve(); };
    s.onerror = () => { clearTimeout(timer); reject(new Error("failed to load " + src)); };
    document.head.appendChild(s);
  });
}
function certLoadLibs() {
  if (certLibsPromise) return certLibsPromise;
  certLibsPromise = Promise.all([
    certLoadScriptWithTimeout("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"),
    certLoadScriptWithTimeout("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js")
  ]).catch((e) => { certLibsPromise = null; throw e; });
  return certLibsPromise;
}

/* ---------- 3. Certificate visuals (navy + gold, landscape A4) ---------- */
const CERT_CSS = [
  '.cert-sheet{position:relative;width:1123px;height:794px;margin:0 auto;background:#FFFEFB url("/assets/cert-border-bg.jpg") center center / cover no-repeat;font-family:"Inter",sans-serif;color:#14213D;overflow:hidden;box-shadow:0 24px 70px rgba(20,33,61,.22);border:1px solid #E3D9BE;-webkit-print-color-adjust:exact;print-color-adjust:exact;}',
  ".cert-content{position:absolute;top:84px;right:118px;bottom:175px;left:118px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}",
  ".cert-brandrow{display:flex;flex-direction:column;align-items:center;}",
  ".cert-brand{font-family:'Playfair Display',serif;font-weight:800;font-size:15px;letter-spacing:4px;color:#14213D;}",
  ".cert-brand-sub{font-size:9.5px;letter-spacing:4px;color:#8A7A4E;font-weight:600;margin-top:4px;text-transform:uppercase;}",
  ".cert-title-block{margin-top:14px;display:flex;align-items:center;gap:16px;}",
  ".cert-title-flourish{width:48px;height:1px;background:linear-gradient(90deg,transparent,#C9A227);}",
  ".cert-title-flourish.right{background:linear-gradient(90deg,#C9A227,transparent);}",
  ".cert-title{font-family:'Playfair Display',serif;font-weight:700;font-size:29px;letter-spacing:2.5px;color:#14213D;text-transform:uppercase;line-height:1.12;max-width:660px;}",
  ".cert-title.is-fail{font-size:22px;letter-spacing:1.8px;}",
  ".cert-title-rule{width:80px;height:2px;background:#C9A227;margin:10px auto 0;}",
  ".cert-msg-intro{font-style:italic;font-size:13px;letter-spacing:.3px;color:#5A6274;margin-top:12px;}",
  ".cert-name{font-family:'Playfair Display',serif;font-weight:700;color:#14213D;margin:8px 0 2px;padding:0 10px 6px;display:inline-block;max-width:820px;line-height:1.15;border-bottom:1.5px solid #C9A227;overflow-wrap:break-word;}",
  ".cert-school{font-size:12px;font-weight:600;color:#5A6274;margin-top:6px;letter-spacing:.4px;}",
  ".cert-msg{font-size:12.5px;line-height:1.65;max-width:720px;color:#2B3A55;margin-top:10px;}",
  ".cert-examline{font-size:12.5px;color:#14213D;margin-top:7px;max-width:780px;}",
  ".cert-divider{display:flex;align-items:center;gap:10px;width:100%;max-width:520px;margin:12px 0 0;}",
  ".cert-divider .line{flex:1;height:1px;background:#E3D9BE;}",
  ".cert-divider .dot{width:4px;height:4px;border-radius:50%;background:#C9A227;}",
  ".cert-statgrid{display:grid;grid-template-columns:repeat(4,1fr);width:100%;max-width:840px;margin-top:11px;}",
  ".cert-statgrid.row2{margin-top:0;}",
  ".cert-stat{padding:8px 6px 3px;border-right:1px solid #E9E1CB;border-top:1px solid #E3D9BE;}",
  ".cert-stat:last-child{border-right:none;}",
  ".cert-statgrid.row2 .cert-stat{border-top:none;padding-top:5px;}",
  ".cert-stat-label{font-size:8.5px;letter-spacing:1px;text-transform:uppercase;color:#8A7A4E;font-weight:600;}",
  ".cert-stat-value{font-family:'Poppins',sans-serif;font-weight:700;font-size:15px;color:#14213D;margin-top:3px;font-variant-numeric:tabular-nums;}",
  ".cert-resultpanel{display:flex;align-items:center;justify-content:center;gap:26px;margin-top:12px;padding:9px 26px;border:1px solid #E3D9BE;border-radius:6px;background:rgba(20,33,61,.03);}",
  ".cert-gradebar{display:flex;align-items:center;gap:11px;}",
  ".cert-grade-badge{position:relative;width:50px;height:50px;border-radius:50%;border:1.5px solid #C9A227;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:700;font-size:19px;color:#14213D;background:#FFF9E8;flex-shrink:0;}",
  ".cert-grade-badge::before{content:\"\";position:absolute;inset:-5px;border:1px solid rgba(201,162,39,.4);border-radius:50%;}",
  ".cert-grade-text{text-align:left;}",
  ".cert-grade-text .lbl{font-size:8.5px;letter-spacing:1.4px;text-transform:uppercase;color:#8A7A4E;font-weight:600;}",
  ".cert-grade-text .val{font-family:'Poppins',sans-serif;font-weight:700;font-size:12.5px;color:#14213D;margin-top:2px;}",
  ".cert-result-divider{width:1px;height:36px;background:#E3D9BE;}",
  ".cert-result-pill{padding:8px 22px;border-radius:3px;font-family:'Poppins',sans-serif;font-weight:700;font-size:13px;letter-spacing:2.5px;}",
  ".cert-result-pass{background:#EAF5EE;color:#1E7A46;border:1px solid #1E7A46;}",
  ".cert-result-fail{background:#FBEAE8;color:#B23A2F;border:1px solid #B23A2F;}",
  ".cert-footer{position:absolute;left:240px;right:240px;bottom:92px;padding-top:12px;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid #E3D9BE;}",
  ".cert-auth-block{text-align:left;min-width:200px;}",
  ".cert-auth-line1{font-family:'Poppins',sans-serif;font-weight:700;font-size:11px;letter-spacing:1.1px;color:#14213D;}",
  ".cert-auth-line2{font-size:9.5px;color:#6B6B6B;margin-top:2px;}",
  ".cert-auth-line3{font-size:8.5px;color:#8A7A4E;font-weight:500;margin-top:6px;letter-spacing:.2px;max-width:300px;line-height:1.5;}",
  ".cert-idblock{position:relative;text-align:center;display:flex;flex-direction:column;align-items:center;}",
  ".cert-sec{position:absolute;pointer-events:none;overflow:hidden;}",
  ".cert-idsec{position:absolute;left:50%;top:-11px;width:110px;height:9px;margin-left:-55px;pointer-events:none;}",
  ".cert-idsec svg{display:block;position:static;}",
  ".cert-idblock .cert-id-text{font-family:'JetBrains Mono',monospace;font-size:12px;color:#14213D;font-weight:700;letter-spacing:.3px;}",
  ".cert-idblock .cert-id-label{font-size:8px;color:#8A7A4E;letter-spacing:1.1px;text-transform:uppercase;margin-top:2px;}",
  ".cert-dateblock{text-align:right;min-width:170px;}",
  ".cert-dateblock .cert-date-label{font-size:8.5px;letter-spacing:1.1px;text-transform:uppercase;color:#8A7A4E;font-weight:600;}",
  ".cert-dateblock .cert-date-value{font-family:'Poppins',sans-serif;font-weight:700;font-size:12px;color:#14213D;margin-top:3px;}",
  ".cert-footnote{font-size:8px;color:#8A7A4E;margin-top:2px;letter-spacing:.3px;}",
  "@media (max-width:860px){.cert-sheet-scale-wrap{overflow-x:auto;}}",
  "body.cert-printing .topbar,body.cert-printing .sidebar,body.cert-printing .bottom-nav,body.cert-printing .floating-panel,body.cert-printing .toast-root,body.cert-printing .sidebar-overlay{display:none!important;}",
  "@media print{body.cert-printing > *:not(#certPrintArea){display:none!important;}}",
  "@media print{body.cert-printing #certPrintArea{display:block!important;position:static;}}",
  "@media print{.cert-print-page{width:297mm;height:210mm;overflow:hidden;position:relative;}}",
  "@media print{.cert-print-page .cert-sheet{position:absolute;top:0;left:0;transform:scale(0.9526);transform-origin:top left;box-shadow:none;margin:0;}}",
  "@media print{@page{size:A4 landscape;margin:0;}}"
].join("\n");

function certInjectStyles() {
  if (document.getElementById("certStylesTag")) return;
  if (!document.getElementById("certFontsTag")) {
    const fontLink = document.createElement("link");
    fontLink.id = "certFontsTag";
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&family=JetBrains+Mono:wght@500;700&display=swap";
    document.head.appendChild(fontLink);
  }
  const style = document.createElement("style");
  style.id = "certStylesTag";
  style.textContent = CERT_CSS;
  document.head.appendChild(style);
}

function certNameFontSize(name){const l=(name||"").length;return l<=16?40:l<=22?34:l<=30?28:l<=40?23:19;}

/* ---------- 3b. Certificate security details (microtext + hidden motif) ----------
   VISUAL-INSPECTION FEATURES ONLY — not cryptographic security. A certificate ID
   or decorative pattern is NOT proof of authenticity (the register is per-device).
   One deterministic spec (certSecuritySpec) drives BOTH the on-screen/PNG SVG layer
   and the PDF vector layer, so they always match. The same ID always yields the
   same pattern. Nothing here touches the existing layout (absolute, pointer-less). */
const CERT_SEC_INK = "#8A6A2A";
const CERT_SEC_TXT_A = "ACCOUNTANCY BY ABHINASH \u2022 ORIGINAL CERTIFICATE \u2022 AUTHENTIC EDUCATIONAL RECORD \u2022";
const CERT_SEC_TXT_B = "ACCOUNTANCY BY ABHINASH \u2022 CERTIFICATE SECURITY DETAIL \u2022 EDUCATIONAL ASSESSMENT \u2022";
const CERT_SEC_TXT_C = "ABA \u2022 ACCOUNTANCY BY ABHINASH \u2022";

function certHash(str){ let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
function certRng(seed){ let a = seed >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* A run of repeated text fitted EXACTLY to `len` px (whole repeats only). */
function certRun(ops, text, x, y, len, fs, rot, op){
  const unit = text.length * fs * 0.70 + fs * 0.6;           /* conservative natural width of one repeat */
  const n = Math.max(1, Math.floor(len / unit));
  ops.push({ t: "text", s: (text + " ").repeat(n).trim(), x: x, y: y, fs: fs, len: len, rot: rot || 0, fill: CERT_SEC_INK, op: op });
}

function certSecuritySpec(id){
  const ops = [], idOps = [];
  const rnd = certRng(certHash(String(id)));
  const FS = 3.4;

  /* C. background microtext pattern (drawn first = underneath everything) */
  const skip = (x0, y0, x1, y1) => {
    const z = [[0,0,222,200],[901,0,1123,200],[0,594,222,794],[901,594,1123,794],[452,0,672,78],[452,716,672,794],[0,312,92,482],[1031,312,1123,482]];
    return z.some((r) => x0 < r[2] && x1 > r[0] && y0 < r[3] && y1 > r[1]);
  };
  const TW = 76, PX = 132, PY = 30;
  for (let r = 0, y = 64; y < 736; r++, y += PY){
    for (let x = 72 + ((r % 2) ? PX / 2 : 0) + (r % 3) * 9; x + TW < 1052; x += PX){
      if (!skip(x, y - 4, x + TW, y + 1)) ops.push({ t: "text", s: CERT_SEC_TXT_C, x: x, y: y, fs: FS, len: TW, rot: 0, fill: "#A8873A", op: 0.13 });
    }
  }

  /* A. inner-border microtext — just inside the hairline, clear of every ornament */
  certRun(ops, CERT_SEC_TXT_A, 228, 46, 224, FS, 0, 0.62);             /* top, left of centre ornament  */
  certRun(ops, CERT_SEC_TXT_A, 672, 46, 224, FS, 0, 0.62);             /* top, right of centre ornament */
  certRun(ops, CERT_SEC_TXT_A, 272, 748, 160, FS, 0, 0.62);            /* bottom, left (monogram sits before it) */
  certRun(ops, CERT_SEC_TXT_A, 672, 748, 150, FS, 0, 0.62);            /* bottom, right (balance mark at its end)   */
  certRun(ops, CERT_SEC_TXT_A, 61, 312, 112, FS, -90, 0.62);           /* left edge, upper */
  certRun(ops, CERT_SEC_TXT_A, 61, 604, 112, FS, -90, 0.62);           /* left edge, lower */
  certRun(ops, CERT_SEC_TXT_A, 1062, 202, 112, FS, 90, 0.62);          /* right edge, upper */
  certRun(ops, CERT_SEC_TXT_A, 1062, 494, 112, FS, 90, 0.62);          /* right edge, lower */

  /* B. bottom security line — centred, inside the bottom border, below the footer */
  certRun(ops, CERT_SEC_TXT_B, 291, 715, 541, FS, 0, 0.58);

  /* E. corner marks: tiny ledger-square + balanced rules + ABA micro-run, mirrored x4 */
  [[150,128,1,1],[973,128,-1,1],[150,666,1,-1],[973,666,-1,-1]].forEach((c) => {
    const cx = c[0], cy = c[1], sx = c[2], sy = c[3];
    const bx = sx > 0 ? cx : cx - 6;
    const by = sy > 0 ? cy : cy - 6;
    ops.push({ t: "rect", x: bx, y: by, w: 6, h: 6, stroke: CERT_SEC_INK, sw: 0.35, op: 0.55 });
    ops.push({ t: "line", x1: bx + 3, y1: by, x2: bx + 3, y2: by + 6, sw: 0.3, stroke: CERT_SEC_INK, op: 0.55 });
    ops.push({ t: "line", x1: bx, y1: by + 3, x2: bx + 6, y2: by + 3, sw: 0.3, stroke: CERT_SEC_INK, op: 0.55 });
    const tx = sx > 0 ? cx + 9 : cx - 9 - 40;
    certRun(ops, "ABA \u2022", tx, by + 4.4, 40, FS, 0, 0.55);
  });

  /* HIDDEN MOTIF: miniature "ABA" monogram inside a tiny ledger grid (bottom-left of border);
     its ledger cells are filled deterministically from the certificate ID. */
  const mx = 214, my = 741;                       /* ledger box 24 x 9 */
  ops.push({ t: "rect", x: mx, y: my, w: 24, h: 9, stroke: CERT_SEC_INK, sw: 0.3, op: 0.6 });
  ops.push({ t: "line", x1: mx + 4, y1: my, x2: mx + 4, y2: my + 9, sw: 0.3, stroke: CERT_SEC_INK, op: 0.6 });   /* ledger margin */
  ops.push({ t: "line", x1: mx + 5.2, y1: my, x2: mx + 5.2, y2: my + 9, sw: 0.2, stroke: CERT_SEC_INK, op: 0.6 });
  const gl = (gx) => {                            /* letters drawn as vector strokes */
    return { A: [[gx, my + 7.2], [gx + 1.8, my + 1.8], [gx + 3.6, my + 7.2]], Ab: [[gx + 0.7, my + 5.4], [gx + 2.9, my + 5.4]],
             B: [[gx, my + 7.2], [gx, my + 1.8], [gx + 2.2, my + 1.8], [gx + 3, my + 2.7], [gx + 2.2, my + 4.4], [gx, my + 4.4], [gx + 2.4, my + 4.4], [gx + 3.2, my + 5.6], [gx + 2.4, my + 7.2], [gx, my + 7.2]] };
  };
  [["A", mx + 7], ["B", mx + 12.4], ["A", mx + 17]].forEach((p) => {
    const g = gl(p[1]);
    ops.push({ t: "poly", pts: g[p[0]], sw: 0.45, stroke: CERT_SEC_INK, op: 0.75 });
    if (p[0] === "A") ops.push({ t: "poly", pts: g.Ab, sw: 0.35, stroke: CERT_SEC_INK, op: 0.75 });
  });
  /* balanced-line motif (accounts must balance) at the end of the bottom-right run */
  const bx0 = 833, by0 = 745;
  ops.push({ t: "line", x1: bx0, y1: by0 + 1.2, x2: bx0 + 11, y2: by0 + 1.2, sw: 0.35, stroke: CERT_SEC_INK, op: 0.65 });
  ops.push({ t: "line", x1: bx0 + 13, y1: by0 + 1.2, x2: bx0 + 24, y2: by0 + 1.2, sw: 0.35, stroke: CERT_SEC_INK, op: 0.65 });
  ops.push({ t: "line", x1: bx0, y1: by0 + 3.4, x2: bx0 + 24, y2: by0 + 3.4, sw: 0.55, stroke: CERT_SEC_INK, op: 0.65 });
  ops.push({ t: "poly", pts: [[bx0 + 12, by0 + 3.4], [bx0 + 12, by0 - 1]], sw: 0.35, stroke: CERT_SEC_INK, op: 0.65 });
  /* ID-seeded ledger cells beside the monogram: 8 cells, filled where the hash bit is set */
  const hid = certHash("cell:" + id);
  for (let i = 0; i < 8; i++){
    ops.push({ t: "rect", x: mx + 26.5 + i * 2.6, y: my + 3, w: 2, h: 3, stroke: CERT_SEC_INK, sw: 0.2, fill: (hid >> i) & 1 ? CERT_SEC_INK : null, op: 0.6 });
  }

  /* D. certificate-ID security detail (placed relative to the ID block; coords local, 150 x 9) */
  const IDW = 110;
  idOps.push({ t: "text", s: "ABA \u2022 ABA \u2022 ABA \u2022 ABA \u2022 ABA \u2022 ABA \u2022 ABA \u2022 ABA \u2022 ABA \u2022", x: 0, y: 3.6, fs: 3.2, len: IDW, rot: 0, fill: CERT_SEC_INK, op: 0.65 });
  idOps.push({ t: "line", x1: 0, y1: 4.8, x2: IDW, y2: 4.8, sw: 0.3, stroke: CERT_SEC_INK, op: 0.5 });
  /* deterministic ledger-tick strip generated from the ID (same ID => same strip) */
  const r2 = certRng(certHash("tick:" + id));
  const cells = 22, cw = IDW / cells;
  for (let i = 0; i < cells; i++){
    const hgt = 1.2 + Math.floor(r2() * 3) * 0.9;
    idOps.push({ t: "rect", x: i * cw + 0.3, y: 5.6, w: cw - 0.6, h: hgt, fill: CERT_SEC_INK, op: 0.5 });
  }
  return { ops: ops, idOps: idOps, idW: IDW };
}

function certSecSvgBody(ops){
  const f = (n) => Math.round(n * 100) / 100;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/[^\x20-\x7e]/g, (ch) => "&#" + ch.charCodeAt(0) + ";");   /* ASCII-only markup: immune to any charset mix-up */
  return ops.map((o) => {
    if (o.t === "text"){
      const tr = o.rot ? ' transform="rotate(' + o.rot + ' ' + f(o.x) + ' ' + f(o.y) + ')"' : "";
      return '<text x="' + f(o.x) + '" y="' + f(o.y) + '" font-size="' + o.fs + '" textLength="' + f(o.len) + '" lengthAdjust="spacing" fill="' + o.fill + '" fill-opacity="' + o.op + '"' + tr + '>' + esc(o.s) + '</text>';
    }
    if (o.t === "rect") return '<rect x="' + f(o.x) + '" y="' + f(o.y) + '" width="' + f(o.w) + '" height="' + f(o.h) + '" fill="' + (o.fill || "none") + '" stroke="' + (o.stroke || "none") + '" stroke-width="' + (o.sw || 0) + '" fill-opacity="' + o.op + '" stroke-opacity="' + o.op + '"/>';
    if (o.t === "line") return '<line x1="' + f(o.x1) + '" y1="' + f(o.y1) + '" x2="' + f(o.x2) + '" y2="' + f(o.y2) + '" stroke="' + o.stroke + '" stroke-width="' + o.sw + '" stroke-opacity="' + o.op + '"/>';
    if (o.t === "poly") return '<polyline points="' + o.pts.map((p) => f(p[0]) + "," + f(p[1])).join(" ") + '" fill="none" stroke="' + o.stroke + '" stroke-width="' + o.sw + '" stroke-opacity="' + o.op + '" stroke-linejoin="round" stroke-linecap="round"/>';
    return "";
  }).join("");
}
function certSecSvg(w, h, ops, cls, style){
  return '<svg class="cert-sec ' + cls + '" xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" style="' + style + '" aria-hidden="true" focusable="false">' +
    '<g font-family="Helvetica,Arial,sans-serif" text-rendering="geometricPrecision">' + certSecSvgBody(ops) + '</g></svg>';
}

/* Draw the same spec as true vector text/lines into a jsPDF page (px -> mm). */
function certSecDrawPdf(pdf, ops, ox, oy){
  const k = 297 / 1123;
  const gs = (op) => { try { pdf.setGState(new pdf.GState({ opacity: op, "stroke-opacity": op })); } catch (e) { /* older jsPDF */ } };
  pdf.setFont("helvetica", "normal");
  ops.forEach((o) => {
    gs(o.op == null ? 1 : o.op);
    if (o.t === "text"){
      pdf.setFontSize(o.fs * k * 72 / 25.4);
      pdf.setTextColor(o.fill);
      const ps = o.s.replace(/\u2022/g, "\x95");
      const lenMm = o.len * k, w = pdf.getTextWidth(ps), n = ps.length;
      const cs = n > 1 ? Math.max(0, (lenMm - w) / (n - 1)) : 0;
      const opt = { charSpace: cs };
      if (o.rot) opt.angle = -o.rot;
      pdf.text(ps, (ox + o.x) * k, (oy + o.y) * k, opt);
    } else if (o.t === "rect"){
      pdf.setLineWidth((o.sw || 0.2) * k);
      if (o.fill){ pdf.setFillColor(o.fill); pdf.rect((ox + o.x) * k, (oy + o.y) * k, o.w * k, o.h * k, o.stroke ? "FD" : "F"); if (o.stroke) pdf.setDrawColor(o.stroke); }
      else { pdf.setDrawColor(o.stroke); pdf.rect((ox + o.x) * k, (oy + o.y) * k, o.w * k, o.h * k, "S"); }
    } else if (o.t === "line"){
      pdf.setLineWidth(o.sw * k); pdf.setDrawColor(o.stroke);
      pdf.line((ox + o.x1) * k, (oy + o.y1) * k, (ox + o.x2) * k, (oy + o.y2) * k);
    } else if (o.t === "poly"){
      pdf.setLineWidth(o.sw * k); pdf.setDrawColor(o.stroke); pdf.setLineCap("round"); pdf.setLineJoin("round");
      for (let i = 1; i < o.pts.length; i++) pdf.line((ox + o.pts[i-1][0]) * k, (oy + o.pts[i-1][1]) * k, (ox + o.pts[i][0]) * k, (oy + o.pts[i][1]) * k);
    }
  });
  gs(1);
}

/* Build the certificate DOM node at a fixed, non-responsive size so
   html2canvas captures a pixel-perfect A4-landscape layout regardless
   of the viewport. Title and result pill reflect PASS vs FAIL. */
function certBuildSheet(cert){
  certInjectStyles();
  const c = certNormalize(cert);
  const pass = c.resultStatus === "PASS";
  const title = certTitleFor(c);
  const pct = (typeof ExamRules !== "undefined" && ExamRules.roundPct) ? ExamRules.roundPct(c.percentage) : Math.round(c.percentage*100)/100;
  const wrap = document.createElement("div");
  wrap.className = "cert-sheet"; wrap.id = "certSheet-" + c.id;
  const sec = certSecuritySpec(c.id);
  wrap.innerHTML =
    certSecSvg(1123, 794, sec.ops, "cert-sec-main", "left:0;top:0;width:1123px;height:794px;")+
    '<div class="cert-content">'+
      '<div class="cert-brandrow"><div class="cert-brand">ACCOUNTANCY BY ABHINASH</div><div class="cert-brand-sub">Online Learning Platform</div></div>'+
      '<div class="cert-title-block"><div class="cert-title-flourish"></div><div class="cert-title '+(pass?"":"is-fail")+'">'+title+'</div><div class="cert-title-flourish right"></div></div>'+
      '<div class="cert-title-rule"></div>'+
      '<div class="cert-msg-intro">This is to certify that</div>'+
      '<div class="cert-name" style="font-size:'+certNameFontSize(c.candidateName)+'px;">'+escapeHtml(c.candidateName)+'</div>'+
      (c.schoolName?'<div class="cert-school">of '+escapeHtml(c.schoolName)+'</div>':'')+
      '<div class="cert-msg">has appeared for and completed the following '+escapeHtml(c.subject)+' examination conducted on the Accountancy By Abhinash online platform for '+escapeHtml(c.className)+'.</div>'+
      '<div class="cert-examline"><b>'+escapeHtml(c.examTitle)+'</b>'+(c.syllabus?' &middot; '+escapeHtml(c.syllabus):'')+'</div>'+
      '<div class="cert-divider"><div class="line"></div><div class="dot"></div><div class="line"></div></div>'+
      '<div class="cert-statgrid">'+
        '<div class="cert-stat"><div class="cert-stat-label">Marks Obtained</div><div class="cert-stat-value">'+c.marksObtained+' / '+c.maxMarks+'</div></div>'+
        '<div class="cert-stat"><div class="cert-stat-label">Percentage</div><div class="cert-stat-value">'+pct+'%</div></div>'+
        '<div class="cert-stat"><div class="cert-stat-label">Grade</div><div class="cert-stat-value">'+escapeHtml(c.grade)+'</div></div>'+
        '<div class="cert-stat"><div class="cert-stat-label">Time Taken</div><div class="cert-stat-value">'+certFormatTime(c.timeTakenSeconds)+'</div></div>'+
      '</div>'+
      '<div class="cert-statgrid row2">'+
        '<div class="cert-stat"><div class="cert-stat-label">Performance</div><div class="cert-stat-value" style="font-size:12px;">'+escapeHtml(c.performance||"—")+'</div></div>'+
        '<div class="cert-stat"><div class="cert-stat-label">Exam Date</div><div class="cert-stat-value" style="font-size:12px;">'+certFormatDate(c.examDate)+'</div></div>'+
        '<div class="cert-stat"><div class="cert-stat-label">Subject</div><div class="cert-stat-value" style="font-size:12px;">'+escapeHtml(c.subject)+'</div></div>'+
        '<div class="cert-stat"><div class="cert-stat-label">Result</div><div class="cert-stat-value" style="color:'+(pass?"#1E7A46":"#B23A2F")+';">'+c.resultStatus+'</div></div>'+
      '</div>'+
      '<div class="cert-resultpanel">'+
        '<div class="cert-gradebar"><div class="cert-grade-badge">'+escapeHtml(c.grade)+'</div><div class="cert-grade-text"><div class="lbl">Grade</div><div class="val">'+escapeHtml(c.grade)+' &middot; '+escapeHtml(c.performance||"")+'</div></div></div>'+
        '<div class="cert-result-divider"></div>'+
        '<div class="cert-result-pill '+(pass?"cert-result-pass":"cert-result-fail")+'">'+c.resultStatus+'</div>'+
      '</div>'+
    '</div>'+
    '<div class="cert-footer">'+
      '<div class="cert-auth-block"><div class="cert-auth-line1">ACCOUNTANCY BY ABHINASH</div><div class="cert-auth-line2">'+escapeHtml(c.subject)+' &middot; '+escapeHtml(c.className)+'</div><div class="cert-auth-line3">Issued by Accountancy By Abhinash. This is an independent educational assessment certificate and is not issued or endorsed by CBSE.</div></div>'+
      '<div class="cert-idblock"><div class="cert-idsec">'+certSecSvg(sec.idW, 9, sec.idOps, "cert-sec-id", "width:"+sec.idW+"px;height:9px;")+'</div>'+'<div class="cert-id-text">'+escapeHtml(c.id)+'</div><div class="cert-id-label">Certificate ID</div></div>'+
      '<div class="cert-dateblock"><div class="cert-date-label">Issued On</div><div class="cert-date-value">'+certFormatDate(c.issuedAt)+'</div><div class="cert-footnote">Digitally generated &middot; No signature required</div></div>'+
    '</div>';
  return wrap;
}


/* ---------- 4. Export actions (PNG / PDF / print / share) ---------- */
/* Export resolution. The sheet is 1123 CSS px wide = 297 mm (A4 landscape), so
   scale 3.125 => 3509 x 2481 px = 300 DPI at the printed size (was 2x = ~192 DPI).
   The CSS layout size is never changed — only the capture scale. */
const CERT_PRINT_SCALE = 3.125;   /* 300 DPI at A4 landscape */
const CERT_SHARE_SCALE = 2;       /* lighter file for sharing sheets */
function certRasterize(cert, opts){
  opts = opts || {};
  const offstage = document.createElement("div");
  offstage.style.cssText = "position:fixed;left:-99999px;top:0;";
  const sheet = certBuildSheet(cert);
  offstage.appendChild(sheet);
  document.body.appendChild(offstage);
  /* PDF: the security layer is drawn afterwards as true vector, so leave it out of the raster */
  if (opts.omitSecurity) sheet.querySelectorAll(".cert-sec").forEach((n) => { n.style.display = "none"; });
  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  const capture = (scale) => window.html2canvas(sheet, { scale: scale, backgroundColor: "#FFFEFB", useCORS: true, width: 1123, height: 794, windowWidth: 1123 });
  const want = opts.scale || CERT_PRINT_SCALE;
  return fontsReady
    .then(() => certLoadLibs())
    .then(() => capture(want).catch(() => capture(2)))   /* fall back if a device cannot allocate the big canvas */
    .finally(() => offstage.remove());
}
function certDownloadPNG(cert){
  if (!certGate(cert)) return;
  toast("Preparing your certificate…", "info", "loader");
  certRasterize(cert, { scale: CERT_PRINT_SCALE }).then((canvas)=>{
    canvas.toBlob((blob)=>{
      if (!blob) { toast("Couldn't generate the certificate — please try again.", "error", "alert-triangle"); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = certNormalize(cert).id + "-certificate.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Certificate downloaded (PNG, 300 DPI).", "success", "download");
    }, "image/png");
  }).catch(() => toast("Couldn't generate the certificate — check your connection and try again.", "error", "alert-triangle"));
}
function certDownloadPDF(cert){
  if (!certGate(cert)) return;
  toast("Preparing your certificate…", "info", "loader");
  const c = certNormalize(cert);
  certRasterize(cert, { scale: CERT_PRINT_SCALE, omitSecurity: true }).then((canvas)=>{
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
    const w = pdf.internal.pageSize.getWidth(), h = pdf.internal.pageSize.getHeight();
    /* 300 DPI base (background + body text); high-quality JPEG keeps the file a sane size */
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, w, h, undefined, "FAST");
    /* Security layer as real vector text & line art — razor sharp at any zoom / print size */
    try {
      const sec = certSecuritySpec(c.id);
      certSecDrawPdf(pdf, sec.ops, 0, 0);
      /* the ID detail sits above the ID text; its exact position is measured from the live layout so PDF == screen */
      const pos = certIdDetailPos(c);
      certSecDrawPdf(pdf, sec.idOps, pos.x, pos.y);
    } catch (e) { /* the raster already carries every visible element except the microtext */ }
    pdf.save(c.id + "-certificate.pdf");
    toast("Certificate downloaded (PDF, 300 DPI).", "success", "download");
  }).catch(() => toast("Couldn't generate the certificate — check your connection and try again.", "error", "alert-triangle"));
}
/* X/Y (px, sheet space) of the ID security detail, measured from the real layout so PDF == screen. */
function certIdDetailPos(c){
  const holder = document.createElement("div");
  holder.style.cssText = "position:fixed;left:-99999px;top:0;";
  const sheet = certBuildSheet(c); holder.appendChild(sheet); document.body.appendChild(holder);
  try {
    const svg = sheet.querySelector(".cert-sec-id"); const sr = sheet.getBoundingClientRect(); const r = svg.getBoundingClientRect();
    return { x: r.left - sr.left, y: r.top - sr.top };
  } finally { holder.remove(); }
}
function certPrint(cert){
  if (!certGate(cert)) return;
  const area = document.createElement("div"); area.id = "certPrintArea";
  const page = document.createElement("div"); page.className = "cert-print-page";
  page.appendChild(certBuildSheet(cert));
  area.appendChild(page); document.body.appendChild(area);
  toast("Preparing your certificate for print…", "info", "loader");
  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  fontsReady.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))).then(() => {
    document.body.classList.add("cert-printing");
    window.print();
    const cleanup = () => { document.body.classList.remove("cert-printing"); area.remove(); window.removeEventListener("afterprint", cleanup); };
    window.addEventListener("afterprint", cleanup);
  }).catch(() => { area.remove(); toast("Couldn't prepare the certificate for print — please try again.", "error", "alert-triangle"); });
}
function certShare(cert){
  if (!certGate(cert)) return;
  const c = certNormalize(cert);
  const title = c.resultStatus === "PASS" ? "Certificate of Achievement" : "Certificate of Examination Completion";
  const text = title + " — " + c.candidateName + " (" + c.resultStatus + ", Grade " + c.grade + ") via Accountancy by Abhinash. Certificate ID: " + c.id;
  function textOnly(){
    if (navigator.share) { navigator.share({ title: title, text: text }).catch(()=>{}); return; }
    if (navigator.clipboard) { navigator.clipboard.writeText(text).then(() => toast("Copied to clipboard.", "success", "link")); return; }
    prompt("Copy this to share:", text);
  }
  toast("Preparing your certificate to share…", "info", "loader");
  certRasterize(cert, { scale: CERT_SHARE_SCALE }).then((canvas) => new Promise((r) => canvas.toBlob(r, "image/png")))
    .then((blob) => {
      if (!blob) throw new Error("no blob");
      const file = new File([blob], c.id + "-certificate.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) return navigator.share({ files: [file], title: title, text: text }).catch(()=>{});
      textOnly();
    }).catch(textOnly);
}

/* ---------- 5. On-screen certificate view (scales to fit) ---------- */
function renderCertificateFullView(root, cert){
  const c = certNormalize(cert);
  if (!certGate(c)) return;
  root.appendChild(el("div", "hero",
    '<span class="hero-eyebrow">Achievement</span><h1>'+certTitleFor(c)+'</h1>'+
    '<p>'+escapeHtml(c.candidateName)+' &middot; '+escapeHtml(c.examTitle)+' &middot; '+c.resultStatus+' (Grade '+escapeHtml(c.grade)+'). Certificate ID <b>'+escapeHtml(c.id)+'</b>. Download or print it any time.</p>'));
  const actions = el("div", "");
  actions.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;";
  actions.innerHTML =
    '<button class="btn-primary ripple-surface" id="certPdfBtn"><i data-lucide="file-down"></i> Download PDF</button>'+
    '<button class="chip" id="certPngBtn"><i data-lucide="image-down"></i> Download PNG</button>'+
    '<button class="chip" id="certPrintBtn"><i data-lucide="printer"></i> Print</button>'+
    '<button class="chip" id="certShareBtn"><i data-lucide="share-2"></i> Share</button>';
  root.appendChild(actions);
  /* v95 — honest registration state for THIS certificate. Chrome only: the sheet itself, and every export of it (PDF/PNG/print), is untouched. While the id has NOT been confirmed by the server the note says "pending" — nothing ever claims "registered" early; the moment the registered id lands it is adopted into the certificate (examAdoptServerCertificateId in app.js) and this note flips to "registered". */
  if (typeof ExamRecords !== "undefined" && ExamRecords.configured && ExamRecords.configured() && c.attemptId) {
    const note = el("div", "");
    note.style.cssText = "margin:-8px 0 16px;font-size:0.8rem;line-height:1.55;display:flex;align-items:center;gap:6px;color:var(--ink-faint);";
    let noteUnsub = null;
    const paintNote = () => {
      if (typeof document !== "undefined" && document.body && !document.contains(note)) {
        if (noteUnsub) { noteUnsub(); noteUnsub = null; }
        return;
      }
      const s = ExamRecords.statusFor(c.attemptId);
      if (s && s.state === "synced" && s.certificateId === c.id) {
        note.innerHTML = '<i data-lucide="cloud-check" style="width:13px;height:13px;"></i> Registered in Abhinash&rsquo;s examination records — <b>' + escapeHtml(c.id) + '</b> is the registered certificate ID.';
      } else if (s && s.state === "synced") {
        note.innerHTML = '<i data-lucide="cloud-upload" style="width:13px;height:13px;"></i> Registered in Abhinash&rsquo;s examination records — reopening this certificate shows the registered certificate ID.';
      } else if (s && s.state === "queued") {
        note.innerHTML = '<i data-lucide="cloud-off" style="width:13px;height:13px;"></i> Registration in Abhinash&rsquo;s records is queued and will retry — the registered certificate ID replaces this one once confirmed.';
      } else if (s && s.state === "failed") {
        note.innerHTML = '<i data-lucide="cloud-alert" style="width:13px;height:13px;"></i> Registration in Abhinash&rsquo;s records did not succeed — this ID is not yet registered.';
      } else {
        note.innerHTML = '<i data-lucide="cloud-upload" style="width:13px;height:13px;"></i> Saving this certificate to Abhinash&rsquo;s examination records…';
      }
      if (icons) icons();
    };
    /* The node must be in the document BEFORE the first paint:
       paintNote()'s detach guard returns early on a node that is not
       yet attached (the same guard the sync line uses), which would
       leave this note blank forever whenever the status is already
       final — e.g. reopening a registered certificate. */
    root.appendChild(note);
    paintNote();
    if (typeof ExamRecords.onChange === "function") noteUnsub = ExamRecords.onChange((id) => { if (id === c.attemptId) paintNote(); });
  }
  const scaleWrap = el("div", "cert-sheet-scale-wrap");
  scaleWrap.style.cssText = "width:100%;display:flex;justify-content:center;";
  const inner = el("div", "");
  inner.style.cssText = "transform-origin:top center;width:1123px;max-width:100%;";
  scaleWrap.appendChild(inner); root.appendChild(scaleWrap);
  inner.appendChild(certBuildSheet(c));
  function fitScale(){ const avail = scaleWrap.clientWidth; const scale = Math.min(1, avail/1123); inner.style.transform = "scale("+scale+")"; inner.style.marginBottom = (794*scale - 794) + "px"; }
  fitScale();
  window.addEventListener("resize", fitScale);
  $("#certPdfBtn", actions).addEventListener("click", () => certDownloadPDF(c));
  $("#certPngBtn", actions).addEventListener("click", () => certDownloadPNG(c));
  $("#certPrintBtn", actions).addEventListener("click", () => certPrint(c));
  $("#certShareBtn", actions).addEventListener("click", () => certShare(c));
  if (icons) icons();
}

/* ---------- 6. Certificate list ("My Certificates") ---------- */
function renderCertificateList(root){
  root.appendChild(el("div", "hero", '<span class="hero-eyebrow">Your Certificates</span><h1>My Certificates</h1><p>Every examination you complete earns a certificate. Open, download, or print any of them.</p>'));
  const list = certLoadAll().slice().reverse();
  if (!list.length){
    root.appendChild(el("div", "card-solid", '<div class="cert-empty"><i data-lucide="award" style="width:34px;height:34px;opacity:.5;"></i><p><b>No certificates yet</b></p><p>Complete any examination to earn your first certificate.</p></div>'));
    if (icons) icons();
    return;
  }
  const wrap = el("div", "cert-list", "");
  wrap.style.cssText = "display:flex;flex-direction:column;gap:12px;";
  list.forEach((raw)=>{
    const c = certNormalize(raw);
    const pass = c.resultStatus === "PASS";
    const card = el("div", "card-solid cert-list-item", "");
    card.style.cssText = "padding:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;";
    card.innerHTML =
      '<i data-lucide="award" style="width:26px;height:26px;color:var(--gold);flex-shrink:0;"></i>'+
      '<div style="flex:1;min-width:200px;"><div style="font-weight:700;font-size:0.98rem;">'+escapeHtml(certTitleFor(c))+'</div>'+
      '<div style="font-size:0.8rem;color:var(--ink-faint);margin-top:3px;">'+escapeHtml(c.candidateName)+' &middot; '+escapeHtml(c.examTitle)+' &middot; '+escapeHtml(c.grade)+' ('+c.resultStatus+') &middot; '+escapeHtml(c.id)+'</div></div>'+
      '<span class="cert-result-chip '+ (pass?"pass":"fail") +'">'+c.resultStatus+'</span>'+
      '<button class="chip sm" data-act="open"><i data-lucide="eye"></i> Open</button>'+
      '<button class="chip sm" data-act="pdf"><i data-lucide="file-down"></i> PDF</button>';
    card.addEventListener("click", (e)=>{
      const b = e.target.closest("button[data-act]"); if (!b) return;
      if (b.dataset.act === "open"){ certCacheRecord(c); certOpenCert(c.id); }
      else if (b.dataset.act === "pdf"){ certDownloadPDF(c); }
    });
    wrap.appendChild(card);
  });
  root.appendChild(wrap);
  if (icons) icons();
}


/* ---------- 7. Result-page banner (pass AND fail both get one) ---------- */
function renderCertificateEarnedBanner(root, cert){
  const c = certNormalize(cert);
  const pass = c.resultStatus === "PASS";
  const banner = el("div", "card-solid cert-earned-banner", "");
  banner.style.cssText = "padding:20px; margin-top:18px; border:1.5px solid var(--gold); background:linear-gradient(135deg, var(--gold-soft), transparent);";
  banner.innerHTML =
    '<div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">'+
      '<i data-lucide="award" style="width:32px;height:32px; color:var(--gold); flex-shrink:0;"></i>'+
      '<div style="flex:1; min-width:200px;">'+
        '<div style="font-family:var(--font-head); font-weight:700; font-size:1.03rem;">'+certTitleFor(c)+'</div>'+
        '<div style="font-size:0.83rem; color:var(--ink-faint); margin-top:2px;">'+escapeHtml(c.examTitle)+' &middot; '+escapeHtml(c.id)+' &middot; '+c.resultStatus+'</div>'+
      '</div>'+
      '<button class="btn-primary ripple-surface" id="certViewBtn"><i data-lucide="award"></i> View Certificate</button>'+
    '</div>'+
    '<p style="font-size:0.8rem; color:var(--ink-faint); text-align:center; margin:14px 0 0; padding-top:12px; border-top:1px solid var(--line);">Your certificate is saved under <b>My Certificates</b> on your Progress page.</p>';
  root.appendChild(banner);
  $("#certViewBtn", banner).addEventListener("click", () => certOpenCert(c.id));
  if (icons) icons();
}

/* Open a certificate by id on the routed certificate view. */
function certOpenCert(id){
  certOpenCertId = id;
  navigate("certificate-view");
}

/* ---------- 8. Progress-page "My Certificates" section ----------
   Called from renderPerformance(); self-rendering otherwise.
   Falls back to an honest empty state when the register is
   empty (nothing has been issued on this device yet).
   ------------------------------------------------------------ */
function renderMyCertificatesSection(root){
  root.appendChild(sectionTitle("My Certificates"));
  const list = certLoadAll();
  if (!list.length){
    const empty = el("div", "card", "");
    empty.style.cssText = "padding:20px; text-align:center; color:var(--ink-faint); font-size:0.87rem;";
    empty.innerHTML = '<i data-lucide="award" style="width:22px;height:22px; opacity:0.5;"></i><p style="margin-top:8px;">No certificates on this device yet. Complete any examination — pass or fail — to earn one, and find every past certificate in <b>Exam Mode → My examination records</b>.</p>';
    root.appendChild(empty);
    if (icons) icons();
    return;
  }
  list.slice().reverse().forEach((raw) => {
    const c = certNormalize(raw);
    const pass = c.resultStatus === "PASS";
    const card = el("div", "card q-card", "");
    card.style.marginBottom = "12px";
    card.innerHTML =
      '<div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">'+
        '<i data-lucide="award" style="width:26px;height:26px; color:var(--gold); flex-shrink:0;"></i>'+
        '<div style="flex:1; min-width:190px;">'+
          '<div style="font-weight:700; font-size:0.95rem;">'+certTitleFor(c)+'</div>'+
          '<div style="font-size:0.78rem; color:var(--ink-faint); margin-top:2px;">'+escapeHtml(c.grade)+' &middot; '+c.percentage+'% &middot; <b style="color:'+(pass?"#1E7A46":"#B23A2F")+';">'+c.resultStatus+'</b> &middot; '+escapeHtml(c.id)+'</div>'+
        '</div>'+
        '<div style="display:flex; gap:8px; flex-wrap:wrap;">'+
          '<button class="chip sm" data-act="view" data-id="'+c.id+'"><i data-lucide="eye"></i> View</button>'+
          '<button class="chip sm" data-act="pdf" data-id="'+c.id+'"><i data-lucide="file-down"></i> PDF</button>'+
          '<button class="chip sm" data-act="print" data-id="'+c.id+'"><i data-lucide="printer"></i> Print</button>'+
        '</div>'+
      '</div>';
    card.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;
      const c2 = certFindById(btn.dataset.id);
      if (!c2) return;
      if (btn.dataset.act === "view") certOpenCert(c2.id);
      else if (btn.dataset.act === "pdf") certDownloadPDF(c2);
      else if (btn.dataset.act === "print") certPrint(c2);
    });
    root.appendChild(card);
  });
  if (icons) icons();
}

/* ---------- 9. Routed certificate view ---------------------- */
let certOpenCertId = null;
function renderCertificateViewRoute(root){
  const cert = certOpenCertId ? certFindById(certOpenCertId) : null;
  if (!cert){
    root.appendChild(el("div", "hero",
      '<h1>Certificate not found</h1><p>This certificate ID is not in this device\'s cache. Open it from your examination records (Exam Mode) or from My Certificates on your Progress page.</p>'));
    return;
  }
  if (!certEligible(cert)){
    root.appendChild(el("div", "hero",
      '<h1>Certificate blocked</h1><p>The attempt behind this certificate was disqualified for a violation of the examination rules, so no certificate can be issued or shown for it.</p>'));
    if (icons) icons();
    return;
  }
  renderCertificateFullView(root, cert);
}
