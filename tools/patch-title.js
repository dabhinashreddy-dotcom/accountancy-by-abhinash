/* One-off patch: route the page title/description/canonical updates through
   seo.js so metadata always matches the visible route. Run once from the
   project folder:  node tools/patch-title.js  */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "app.js");
let src = fs.readFileSync(file, "utf8");

if (src.includes("Seo.applyRoute(route)")) {
  console.log("already patched");
  process.exit(0);
}

const re = /^(  document\.title = `\$\{ROUTE_TITLES\[route\][^`]*`;)$/m;
const m = src.match(re);
if (!m) {
  console.error("target line not found");
  process.exit(1);
}
const needle = m[1];

const replacement = [
  "  /* Title, meta description, canonical, OG/Twitter tags, breadcrumbs and",
  "     JSON-LD are owned by seo.js so metadata always matches the route. */",
  "  if (window.Seo && Seo.applyRoute) {",
  "    Seo.applyRoute(route);",
  "  } else {",
  '    document.title = `${ROUTE_TITLES[route] || "Accountancy By Abinash"} | Accountancy By Abinash`;',
  "  }",
].join("\n");

src = src.replace(needle, function () { return replacement; });
fs.writeFileSync(file, src, "utf8");
console.log("patched");
