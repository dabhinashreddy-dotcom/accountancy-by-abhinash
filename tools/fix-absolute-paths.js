/* One-off: rewrite document-relative asset references as root-absolute.
   The site now serves prerendered nested pages (/class-11-accountancy/journal/),
   so "styles.css" would resolve to /class-11-accountancy/journal/styles.css.
   Run:  node tools/fix-absolute-paths.js   (idempotent)  */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

let changed = 0;

/* --- index.html: href="x…" / src="x…" that are local & relative --- */
{
  const file = path.join(ROOT, "index.html");
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/(href|src)="([^"]+)"/g, (m, attr, val) => {
    if (val.startsWith("/") || val.startsWith("#") || /^(https?:|data:|mailto:|tel:|blob:|\/\/)/.test(val)) return m;
    changed++;
    return attr + '="/' + val + '"';
  });
  /* service worker must always register from the root scope */
  const before = html;
  html = html.replace(/navigator\.serviceWorker\.register\("sw\.js"\)/g, 'navigator.serviceWorker.register("/sw.js")');
  if (html !== before) changed++;
  fs.writeFileSync(file, html, "utf8");
}

/* --- JS that builds HTML or fetches local files --- */
const jsEdits = {
  "app.js": [
    ['src="assets/brand/icon-192.png"', 'src="/assets/brand/icon-192.png"'],   // greeting + welcome mark
    ['src="assets/logo-full.png"', 'src="/assets/logo-full.png"'],
    ['poster="assets/video/about-website-poster.jpg"', 'poster="/assets/video/about-website-poster.jpg"'],
    ['src="assets/video/about-website.mp4"', 'src="/assets/video/about-website.mp4"'],
    ['fetch("app.js")', 'fetch("/app.js")']
  ],
  "certificate.js": [
    ['url("assets/cert-border-bg.jpg")', 'url("/assets/cert-border-bg.jpg")']
  ]
};
for (const [name, edits] of Object.entries(jsEdits)) {
  const file = path.join(ROOT, name);
  let src = fs.readFileSync(file, "utf8");
  for (const [from, to] of edits) {
    if (!src.includes(from)) { console.log("  skip (not found): " + name + " " + from); continue; }
    src = src.split(from).join(to);
    changed++;
  }
  fs.writeFileSync(file, src, "utf8");
}

console.log("fix-absolute-paths: " + changed + " replacement group(s) applied");
