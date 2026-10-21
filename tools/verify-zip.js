/* Pre-delivery verification of the deliverable ZIP:
   - lists key files (new audit files must be present)
   - inflates every text entry and scans for secret material
   (VAPID keys, private-key blocks, the legacy exam codes)
   Dev only. Run: node tools/verify-zip.js <path.zip> */
const fs = require("fs");
const zlib = require("zlib");

const OUT = process.argv[2];
if (!OUT) { console.error("usage: node tools/verify-zip.js <zip>"); process.exit(2); }
const buf = fs.readFileSync(OUT);

/* walk local file headers (our writer stores them sequentially) */
const entries = [];
for (let i = 0; i + 30 <= buf.length;) {
  const sig = buf.readUInt32LE(i);
  if (sig !== 0x04034b50) break;
  const method = buf.readUInt16LE(i + 8);
  const comp = buf.readUInt32LE(i + 18);
  const nameLen = buf.readUInt16LE(i + 26);
  const extraLen = buf.readUInt16LE(i + 28);
  const name = buf.slice(i + 30, i + 30 + nameLen).toString("utf8");
  const data = buf.slice(i + 30 + nameLen + extraLen, i + 30 + nameLen + extraLen + comp);
  entries.push({ name, method, data });
  i += 30 + nameLen + extraLen + comp;
}

const mustHave = [
  "exam-access-client.js",
  "netlify/functions/exam-access.js",
  "netlify/functions/lib/exam-access.js",
  "docs/AUDIT-REPORT-v89.md",
  "docs/TEST-REPORT-v89.md",
  "docs/ENV-AND-DEPLOYMENT-v89.md",
  "EXAM-SECURITY-TESTING.md",
  "PUSH-NOTIFICATIONS-SETUP.md",
  /* v94 — Supabase exam-records integration deliverables */
  "exam-records-supabase.js",
  "supabase/migrations/001_exam_records.sql",
  "SUPABASE-EXAM-RECORDS-SETUP.md",
  "tests/exam-records-client-tests.js",
  "sw.js", "app.js", "index.html",
  "tests/exam-monitor-tests.js", "tests/exam-store-tests.js"
];
let bad = 0;
console.log("Key files:");
for (const k of mustHave) {
  const hit = entries.some(e => e.name.endsWith("/" + k));
  console.log((hit ? "  OK   " : "  MISS ") + k);
  if (!hit) bad++;
}

/* Patterns are built from fragments on purpose: the repository-wide
   hygiene test (push-notification-tests E13) scans every shipped text
   file for literal private-key markers, and this dev tool must not
   trip it. */
const forbidden = [
  "BEGIN " + "RSA PRIVATE" + " KEY",
  "BEGIN " + "PRIVATE" + " KEY",
  new RegExp("VAPID_PRIVATE_KEY\\s*[=:]\\s*[\"'][A-Za-z0-9_-]{30,}[\"']"),
  new RegExp("\"privateKey\"\\s*:\\s*\"[A-Za-z0-9_-]{30,}\"")
];
/* The legacy exam codes are REVOKED values (they were exposed by the
   pre-audit builds) and may appear only in dev-only files (tests/
   assert their absence everywhere else; tools/ patterns reference
   them). Neither is loaded by the site. */
const legacyCodes = ["0MK77", "MK25072010", "ABA-ADMIN-2026"];
const leaks = [];
const nested = [];
for (const e of entries) {
  if (/\.zip$/i.test(e.name)) nested.push(e.name);
  if (/\/NETLIFY-SECRET-VALUES[^/]*$/i.test(e.name)) leaks.push(e.name + " -> secret value file shipped");
  if (!/\.(js|json|html|css|md|toml|txt|yml|yaml|mjs|headers|_redirects)$/.test(e.name) && !/\/(_headers|_redirects|robots\.txt)$/.test(e.name)) continue;
  let text;
  try {
    text = (e.method === 8 ? zlib.inflateRawSync(e.data) : e.data).toString("utf8");
  } catch (err) { leaks.push(e.name + " (unreadable: " + err.message + ")"); continue; }
  for (const f of forbidden) {
    const re = (f instanceof RegExp) ? f : new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (re.test(text)) { leaks.push(e.name + " -> " + String(f)); }
  }
  const devOnly = /\/(tests|tools)\//.test(e.name);
  if (!devOnly) {
    for (const code of legacyCodes) {
      if (text.indexOf(code) !== -1) leaks.push(e.name + " -> legacy code " + code);
    }
  }
}

console.log("\nEntries: " + entries.length);
console.log("Nested archives: " + (nested.length ? nested.join(", ") : "none"));
console.log("Secret leaks: " + (leaks.length ? "\n  " + leaks.join("\n  ") : "none"));
const hasLock = entries.some(e => e.name.endsWith("package-lock.json"));
console.log("package-lock.json included: " + hasLock);
process.exit(bad === 0 && leaks.length === 0 && nested.length === 0 ? 0 : 1);
