/* Internal link checker — verifies every internal href/src in the HTML
   (index.html, prerendered route pages, 404.html) resolves to a real file
   on disk. Run:  node tools/check-links.js   Exits 1 if anything is broken. */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "netlify") continue;
    const abs = path.join(d, e.name);
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.endsWith(".html")) out.push(abs);
  }
  return out;
}

/* Resolves an internal URL path to a file that must exist on disk. */
function resolves(p) {
  const clean = p.split("#")[0].split("?")[0];
  if (clean === "/") return fs.existsSync(path.join(ROOT, "index.html"));
  if (clean.endsWith("/")) return fs.existsSync(path.join(ROOT, clean.slice(1), "index.html"));
  return fs.existsSync(path.join(ROOT, clean.slice(1)));
}

const problems = [];
const files = walk(ROOT);
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  const seen = new Set();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (!url.startsWith("/") || url.startsWith("//")) continue;       // external / relative
    if (url.startsWith("/assets/") || url.startsWith("/manifest")) {
      if (!fs.existsSync(path.join(ROOT, url.slice(1).split("?")[0]))) problems.push(rel + ": missing asset " + url);
      continue;
    }
    if (seen.has(url)) continue;
    seen.add(url);
    if (!resolves(url)) problems.push(rel + ": broken internal link " + url);
  }
}

if (problems.length) {
  console.log("BROKEN (" + problems.length + "):");
  problems.forEach((p) => console.log("  " + p));
  process.exit(1);
}
console.log("links ok — " + files.length + " HTML files checked");
