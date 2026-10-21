/* v93 — repairs UTF-8 -> CP1252 -> UTF-8 double-encoding (mojibake).

   Root cause being repaired: a file was produced by reading clean UTF-8
   text with an ANSI (CP1252) decoder and writing the result as UTF-8, so
   every multi-byte character became its CP1252 re-encoding (for example
   the em dash U+2014 stored as the three characters â, €, ").

   Two repair strategies, tried in order:
     1. Whole-file CP1252 round-trip — correct when EVERY non-ASCII char
        in the file is mojibake (uniformly corrupted file).
     2. Localized sequence map — for MIXED files that contain both
        mojibake and clean UTF-8 (e.g. index.html, where a generator
        later injected clean text into an already-corrupted template).
        A whole-file round-trip on such a file would corrupt the clean
        chars, so only the known corrupted sequences are rewritten.

   A UTF-8 BOM is treated as a corruption artifact (PowerShell 5.1
   Set-Content -Encoding UTF8 always writes one) and removed.

   Run with no arguments to repair the known-affected files, or pass
   explicit paths. Prints one result line per file. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

/* CP1252 0x80-0x9F specials: Unicode code point -> original byte. */
const CP1252_HIGH = {
  0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x84, 0x2026: 0x85, 0x2020: 0x86,
  0x2021: 0x87, 0x02C6: 0x88, 0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B,
  0x0152: 0x8C, 0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93,
  0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97, 0x2122: 0x99,
  0x0161: 0x9A, 0x203A: 0x9B, 0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F
};

/* Any of these characters in a run of 2+ is a mojibake smell. */
const MARKERS = /[ÃÂâ][\u0080-\u00BF\u00A0-\u00FF\u20AC\u2013-\u201E\u2020-\u2022\u2026\u2030\u2039\u2122\u0152-\u0161\u0178-\u017E\u02DC\u0192\u02C6\u203A]|\uFFFD/;

/* Localized corrupted-sequence -> correct-char map, for mixed files.
   Sequences were enumerated char-by-char from the affected files:
     â € "  = CP1252 E2 80 94 = U+2014 em dash
     â € ¦  = CP1252 E2 80 A6 = U+2026 ellipsis
     â € ¢  = CP1252 E2 80 A2 = U+2022 bullet
     â ‰ ¥  = CP1252 E2 89 A5 = U+2325 option key
     â Œ ˜  = CP1252 E2 8C 98 = U+2318 command key
     Â ·    = CP1252 C2 B7    = U+00B7 middle dot                        */
const LOCAL_SEQUENCES = [
  ["\u00E2\u20AC\u201D", "\u2014"],
  ["\u00E2\u20AC\u00A6", "\u2026"],
  ["\u00E2\u20AC\u00A2", "\u2022"],
  ["\u00E2\u2030\u00A5", "\u2325"],
  ["\u00E2\u02C6\u2019", "\u2212"],   /* v93: loader glyph minus, kept repaired */
  ["\u00E2\u0152\u02DC", "\u2318"],
  ["\u00C2\u00B7", "\u00B7"]
];

function toCp1252Bytes(s) {
  const out = [];
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (CP1252_HIGH[c] !== undefined) out.push(CP1252_HIGH[c]);
    else if (c <= 0xFF) out.push(c);
    else return null; // char cannot come from CP1252 => not this corruption
  }
  return Buffer.from(out);
}

function repair(file) {
  let raw = fs.readFileSync(file);
  const hadBom = raw.length >= 3 && raw[0] === 0xEF && raw[1] === 0xBB && raw[2] === 0xBF;
  if (hadBom) raw = raw.slice(3);
  const s = raw.toString("utf8");
  if (!MARKERS.test(s)) {
    if (hadBom) {
      fs.writeFileSync(file, s, "utf8");
      return { file, changed: true, note: "BOM stripped only" };
    }
    return { file, changed: false, note: "no markers" };
  }
  let fixed = null;
  let mode = null;
  // Strategy 1: whole-file round-trip (uniformly corrupted file).
  const cp = toCp1252Bytes(s);
  if (cp) {
    const rt = cp.toString("utf8");
    if (!rt.includes("\uFFFD") && !MARKERS.test(rt)) { fixed = rt; mode = "whole-file"; }
  }
  // Strategy 2: localized sequence map (mixed file).
  if (fixed === null) {
    let t = s;
    let n = 0;
    for (const pair of LOCAL_SEQUENCES) {
      while (t.indexOf(pair[0]) !== -1) { t = t.replace(pair[0], pair[1]); n++; }
    }
    if (!MARKERS.test(t)) { fixed = t; mode = "localized x" + n; }
  }
  if (fixed === null) return { file, changed: false, note: "UNREPAIRED - both strategies failed" };
  fs.writeFileSync(file, fixed, "utf8");
  return { file, changed: true, mode, bom: hadBom, before: s.length, after: fixed.length };
}

function main() {
  const args = process.argv.slice(2);
  const targets = args.length ? args : [
    path.join(ROOT, "index.html"),
    path.join(ROOT, "theory-upgrade.js"),
    path.join(ROOT, "styles.css"),
    path.join(ROOT, "docs", "DELIVERY-REPORT.md")
  ];
  let bad = 0;
  for (const t of targets) {
    let r;
    try { r = repair(t); } catch (e) { r = { file: t, changed: false, note: "ERROR " + e.message }; }
    if (!r.changed && r.note !== "no markers") bad++;
    console.log(
      (r.changed ? "REPAIRED" : "kept    ") + "  " + path.basename(t) +
      "  [" + (r.mode || r.note || "") + "]" +
      (r.bom ? "  (BOM removed)" : "") +
      (r.before !== undefined ? "  " + r.before + " -> " + r.after + " chars" : "")
    );
  }
  process.exit(bad ? 1 : 0);
}

if (require.main === module) main();
module.exports = { repair, MARKERS, LOCAL_SEQUENCES };
