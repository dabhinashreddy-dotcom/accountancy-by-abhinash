/* Builds the deliverable ZIP with no third-party packages.
   Implements the ZIP "store" and "deflate" formats directly (the same
   structure any unzip tool reads), so it works on a machine that has
   neither a `zip` binary nor an npm zip library installed. */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const OUT = process.argv[2] || path.join(require("os").homedir(), "Downloads", "accountancy-by-abhinash-v81.zip");
/* Derive the archive prefix from the output filename (e.g. …-v81.zip -> …-v81)
   so the folder inside the ZIP always matches the file you're extracting. */
const PREFIX = path.basename(OUT).replace(/\.zip$/i, "");

/* Nothing that is regenerated, fetched, or machine-local. */
const SKIP_DIRS = new Set(["node_modules", ".git", ".netlify", ".cache"]);
const SKIP_FILES = new Set(["package-lock.json", "yarn.lock"]);

function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;             // dotfiles/dot-dirs
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(abs, base, out);
    } else if (entry.isFile()) {
      if (SKIP_FILES.has(entry.name)) continue;
      if (/\.zip$/i.test(entry.name)) continue;            // never nest old archives
      out.push(path.relative(base, abs).split(path.sep).join("/"));
    }
  }
  return out;
}

/* CRC-32 (needed by the ZIP header). */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

const files = walk(ROOT).sort();
const localParts = [];
const centralParts = [];
let offset = 0;

for (const rel of files) {
  const data = fs.readFileSync(path.join(ROOT, rel));
  const crc = crc32(data);
  let method = 0, stored = data;
  try {
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    if (deflated.length < data.length) { method = 8; stored = deflated; }
  } catch (e) { /* fall back to store */ }

  const nameBuf = Buffer.from(`${PREFIX}/${rel}`, "utf8");
  const dosTime = 0, dosDate = 0x21;                     // 1980-01-01, deterministic

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034B50, 0);
  local.writeUInt16LE(20, 4);                            // version needed
  local.writeUInt16LE(0x0800, 6);                        // UTF-8 filenames
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(dosTime, 10);
  local.writeUInt16LE(dosDate, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(stored.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);
  localParts.push(local, nameBuf, stored);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014B50, 0);
  central.writeUInt16LE(20, 4);                          // version made by
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(dosTime, 12);
  central.writeUInt16LE(dosDate, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(stored.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt16LE(0, 30);                          // extra
  central.writeUInt16LE(0, 32);                          // comment
  central.writeUInt16LE(0, 34);                          // disk
  central.writeUInt16LE(0, 36);                          // internal attrs
  // external attrs: regular file, mode 0644. (0o100644 << 16) overflows a
  // signed 32-bit int, so build it as an unsigned number.
  central.writeUInt32LE(((0o100644 << 16) >>> 0), 38);
  central.writeUInt32LE(offset, 42);
  centralParts.push(central, nameBuf);

  offset += local.length + nameBuf.length + stored.length;
}

const centralBuf = Buffer.concat(centralParts);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054B50, 0);
eocd.writeUInt16LE(0, 4);
eocd.writeUInt16LE(0, 6);
eocd.writeUInt16LE(files.length, 8);
eocd.writeUInt16LE(files.length, 10);
eocd.writeUInt32LE(centralBuf.length, 12);
eocd.writeUInt32LE(offset, 16);
eocd.writeUInt16LE(0, 20);

fs.writeFileSync(OUT, Buffer.concat([...localParts, centralBuf, eocd]));

/* Verify what we just wrote by reading it back. */
const written = fs.readFileSync(OUT);
const listing = [];
for (let i = 0; i + 30 <= written.length;) {
  const sig = written.readUInt32LE(i);
  if (sig !== 0x04034B50) break;
  const m = written.readUInt16LE(i + 8);
  const compSize = written.readUInt32LE(i + 18);
  const nameLen = written.readUInt16LE(i + 26);
  const extraLen = written.readUInt16LE(i + 28);
  const name = written.slice(i + 30, i + 30 + nameLen).toString("utf8");
  listing.push({ name, method: m === 8 ? "deflate" : "store" });
  i += 30 + nameLen + extraLen + compSize;
}

console.log("Wrote: " + OUT);
console.log("Entries: " + listing.length + "   Size: " + (written.length / 1024).toFixed(0) + " KB");
console.log("Methods: " + listing.filter(f => f.method === "deflate").length + " deflated, " + listing.filter(f => f.method === "store").length + " stored");
console.log("\nKey files in archive:");
["app.js", "exam-security.js", "search-index.js", "achievements.js", "certificate.js",
 "index.html", "styles.css", "sw.js", "tests/exam-security-tests.js",
 "tests/exam-search-tests.js", "tests/achievements-tests.js"].forEach(k => {
  const hit = listing.find(f => f.name.endsWith("/" + k));
  console.log("  " + (hit ? "OK   " : "MISS ") + k);
});
console.log("\nSample: " + listing.slice(0, 6).map(f => f.name).join(", "));
