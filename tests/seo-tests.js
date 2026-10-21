/* SEO / GEO regression suite.   Run:  node tests/seo-tests.js
   (Node 18+, no packages.)  Dev only, not loaded by the website.

     A  seo-config.js — one unique title/description/path per public route
     B  prerendered pages — metadata, canonical, headings, JSON-LD, content
     C  sitemap.xml — valid, complete, canonical-only, one entry per page
     D  robots.txt — allows crawling, references the real sitemap
     E  index.html — home metadata, crawlable nav, prerendered landing copy
     F  app.js / seo.js — client-side metadata stays in step with the route
     G  internal links — every href/src in every HTML file resolves
     H  no links to removed or invented routes; 404 page is honest
*/
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const CFG = require(path.join(ROOT, "seo-config.js"));
const BUILD = require(path.join(ROOT, "tools", "build-seo-pages.js"));

let pass = 0, fail = 0; const failures = [];
function ok(cond, name, detail) { if (cond) pass++; else { fail++; failures.push(name + (detail ? " — " + detail : "")); } }
function eq(a, b, name) { ok(a === b, name, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
function section(t) { console.log("\n" + t); }
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const exists = (f) => fs.existsSync(path.join(ROOT, f));
const attr = (html, re) => { const m = html.match(re); return m ? m[1] : null; };
/* HTML text is written escaped; compare it as the raw string the config holds. */
const decode = (s) => s == null ? s : String(s)
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

console.log("SEO / GEO suite");
console.log("=".repeat(60));

/* Fresh build first — tests must never pass on stale output. */
const built = BUILD.build();

const ORIGIN = CFG.ORIGIN;
const publicIds = CFG.publicRoutes();
const pageFile = (p) => (p === "/" ? "index.html" : p.replace(/^\/|\/$/g, "") + "/index.html");

/* ================= A. config ================= */
section("A. seo-config.js — route metadata");
ok(/^https:\/\//.test(ORIGIN), "ORIGIN is an https URL", ORIGIN);
eq(publicIds.length, built.publicRoutes, "build and config agree on the public route count");

const titles = new Map(), descs = new Map(), paths = new Map();
for (const id of publicIds) {
  const cfg = CFG.ROUTES[id];
  ok(!!cfg, `route ${id} exists in ROUTES`);
  if (!cfg) continue;
  ok(!!cfg.path, `${id} has a public path`, cfg.path);
  ok(typeof cfg.title === "string" && cfg.title.length > 10, `${id} has a real title`, cfg.title);
  ok(typeof cfg.description === "string" && cfg.description.length >= 50, `${id} has a substantive description`, String(cfg.description && cfg.description.length));
  ok(cfg.title.endsWith("| Accountancy By Abinash"), `${id} title carries the brand suffix`, cfg.title);
  ok(!/&[a-z]+;|&#\d+;/.test(cfg.title), `${id} title is raw text (no HTML entities — emitters escape at write time)`, cfg.title);
  ok(!/&[a-z]+;|&#\d+;/.test(cfg.description || ""), `${id} description is raw text`, cfg.description);
  ok(cfg.title.length <= 75, `${id} title length ${cfg.title.length} ≤ 75`, cfg.title);
  ok(!cfg.noindex, `${id} is not marked noindex`);
  if (cfg.path) {
    if (paths.has(cfg.path)) ok(false, `duplicate path ${cfg.path}`, id + " and " + paths.get(cfg.path));
    paths.set(cfg.path, id);
    ok(/^\/(?:[a-z0-9-]+\/)*$/.test(cfg.path), `${id} path is clean, trailing-slash, lowercase`, cfg.path);
  }
  if (titles.has(cfg.title)) ok(false, `duplicate title: ${cfg.title}`, id + " and " + titles.get(cfg.title));
  titles.set(cfg.title, id);
  if (descs.has(cfg.description)) ok(false, `duplicate description on ${id}`, descs.get(cfg.description));
  descs.set(cfg.description, id);
}
eq(titles.size, publicIds.length, "every public route has a unique title");
eq(descs.size, publicIds.length, "every public route has a unique description");
eq(paths.size, publicIds.length, "every public route has a unique path");

/* Private/utility routes must be noindex and absent from the sitemap. */
const privateIds = Object.keys(CFG.ROUTES).filter((id) => !CFG.ROUTES[id].path);
ok(privateIds.length > 0, "private routes exist (app still has hash-only views)");
for (const id of privateIds) {
  ok(CFG.ROUTES[id].noindex === true, `private route ${id} is explicitly noindex`);
}

/* ================= B. prerendered pages ================= */
section("B. Prerendered pages — metadata, headings, JSON-LD, content");
const allFiles = ["index.html"].concat(publicIds.filter((i) => i !== "home").map((i) => pageFile(CFG.ROUTES[i].path)));
eq(allFiles.length, publicIds.length, "one HTML file per public route");
const pageMeta = {};
for (const f of allFiles) {
  ok(exists(f), `${f} exists`);
  if (!exists(f)) continue;
  const html = read(f);
  const cfg = CFG.ROUTES[allFiles.indexOf(f) === 0 ? "home" : Object.keys(CFG.ROUTES).find((k) => CFG.ROUTES[k].path && pageFile(CFG.ROUTES[k].path) === f)];
  const title = decode(attr(html, /<title>([^<]*)<\/title>/));
  const desc = decode(attr(html, /<meta name="description" content="([^"]*)" \/>/));
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)" \/>/);
  pageMeta[f] = { title, desc, canonical };

  eq(title, cfg.title, `${f} <title> matches config`);
  eq(desc, cfg.description, `${f} meta description matches config`);
  eq(canonical, ORIGIN + cfg.path, `${f} canonical is ORIGIN + path`);
  ok(!/undefined\//.test(canonical || ""), `${f} canonical has no "undefined"`);
  ok((html.match(/<h1[ >]/g) || []).length === 1, `${f} has exactly one <h1>`);
  ok((html.match(/<h2[ >]/g) || []).length >= 2, `${f} has a real heading structure`);
  ok(!/<meta name="robots" content="noindex/.test(html), `${f} is not noindex`);
  ok(/<meta property="og:url" content="[^"]+">/.test(html), `${f} has og:url`);
  eq(attr(html, /<meta property="og:url" content="([^"]*)">/), canonical, `${f} og:url equals canonical`);
  eq(decode(attr(html, /<meta property="og:title" content="([^"]*)">/)), cfg.title, `${f} og:title equals title`);
  ok(/<meta name="twitter:card" content="summary">/.test(html), `${f} has twitter card`);
  ok(/^https:\/\//.test(attr(html, /<meta property="og:image" content="([^"]*)">/) || ""), `${f} og:image is absolute https`);

  /* JSON-LD: parses, and represents this exact page. */
  const ldBlocks = html.match(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g) || [];
  ok(ldBlocks.length >= 2, `${f} carries WebSite + page JSON-LD`);
  let graph = null;
  for (const b of ldBlocks) {
    try { const parsed = JSON.parse(b.replace(/<\/?script[^>]*>/g, "")); if (parsed["@graph"]) graph = parsed["@graph"]; }
    catch (e) { ok(false, `${f} JSON-LD parses`, e.message); }
  }
  ok(!!graph, `${f} page JSON-LD has a @graph`);
  if (graph) {
    const web = graph.find((n) => n["@type"] === "WebPage");
    ok(!!web, `${f} has WebPage node`);
    if (web) eq(web.url, canonical, `${f} WebPage.url equals canonical`);
    const crumb = graph.find((n) => n["@type"] === "BreadcrumbList");
    if (crumb) {
      const pos = crumb.itemListElement.map((x) => x.position);
      eq(pos.join(","), pos.map((_, i) => i + 1).join(","), `${f} breadcrumb positions are 1..n`);
      ok(crumb.itemListElement.every((x) => /^https:\/\//.test(x.item)), `${f} breadcrumb items are absolute URLs`);
    }
    const faq = graph.find((n) => n["@type"] === "FAQPage");
    if (cfg.faq && cfg.faq.length) {
      ok(!!faq, `${f} FAQ JSON-LD present because config has FAQs`);
      if (faq) eq(faq.mainEntity.length, cfg.faq.length, `${f} FAQ count matches config`);
    } else if (faq) {
      ok(false, `${f} has FAQ JSON-LD but no configured FAQ`);
    }
  }

  /* GEO: real crawlable educational content, not just tags. */
  const view = attr(html, /<div id="view-root" class="view-root">([\s\S]*?)<\/div>/);
  ok(!!view && view.replace(/<[^>]*>/g, "").trim().length > 400, `${f} has prerendered crawlable content`, view ? String(view.replace(/<[^>]*>/g, "").trim().length) : "none");
  ok(!/id="breadcrumbBar"|class="breadcrumb-list"/.test(html), `${f} has no visible breadcrumb strip`);
  ok(html.includes('href="/class-11-accountancy/') || html.includes('href="/class-12-accountancy/') || f === "index.html", `${f} links to related chapter pages`);
}
/* Cross-page uniqueness, as rendered. */
const rt = new Set(), rd = new Set(), rc = new Set();
let dup = 0;
for (const f of allFiles) {
  const m = pageMeta[f]; if (!m) continue;
  if (rt.has(m.title)) { dup++; failures.push("duplicate rendered title on " + f); }
  rt.add(m.title);
  if (rd.has(m.desc)) { dup++; failures.push("duplicate rendered description on " + f); }
  rd.add(m.desc);
  if (rc.has(m.canonical)) { dup++; failures.push("duplicate rendered canonical on " + f); }
  rc.add(m.canonical);
}
fail += dup; pass += dup ? 0 : 3;
ok(dup === 0, "rendered titles / descriptions / canonicals are all unique");

/* ================= C. sitemap ================= */
section("C. sitemap.xml");
const sm = read("sitemap.xml");
ok(sm.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "sitemap has an XML declaration");
ok(sm.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), "sitemap uses the sitemap.org namespace");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
eq(locs.length, publicIds.length, "sitemap lists every public route");
eq(new Set(locs).size, locs.length, "sitemap URLs are unique");
for (const u of locs) {
  ok(u.startsWith(ORIGIN + "/") || u === ORIGIN + "/", `sitemap URL on real origin`, u);
  ok(exists(pageFile(u.replace(ORIGIN, ""))), `sitemap URL has a real page`, u);
}
for (const m of sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1])) { ok(false, "sitemap lastmod is ISO date", m[1]); break; }
}
for (const id of privateIds) {
  ok(!sm.includes(CFG.ROUTES[id].title), `private route ${id} kept out of sitemap`);
}
/* Every canonical of an indexable page is in the sitemap. */
for (const f of allFiles) {
  if (pageMeta[f]) ok(locs.includes(pageMeta[f].canonical), `${f} canonical is in the sitemap`, pageMeta[f].canonical);
}

/* ================= D. robots.txt ================= */
section("D. robots.txt");
const rb = read("robots.txt");
ok(/User-agent: \*/.test(rb), "robots addresses all crawlers");
ok(/Allow: \/$/.test(rb) || /Allow: \/$/m.test(rb), "robots allows the site");
ok(!/Disallow: \s*\/\s*$/m.test(rb), "robots does not disallow the whole site");
ok(!/Disallow: \/((class-11-accountancy)|index\.js|styles\.css|app\.js)/.test(rb), "robots does not block pages or code assets");
ok(rb.includes("Sitemap: " + ORIGIN + "/sitemap.xml"), "robots references the deployed sitemap");
ok(!/(api[_-]?key|secret|token|password)/i.test(rb), "robots contains no credentials");

/* ================= E. index.html ================= */
section("E. index.html — home metadata, crawlable nav, landing copy");
const home = read("index.html");
eq(pageMeta["index.html"].title, CFG.ROUTES.home.title, "home title matches config");
eq(pageMeta["index.html"].canonical, ORIGIN + "/", "home canonical is the origin root");
ok(!/undefined\//.test(home), "home has no undefined URLs");
ok(home.includes("<script src=\"/seo.js"), "seo.js is loaded from the site root");
ok(/src="\/(app|data|seo-config)\.js/.test(home), "core scripts use root-absolute paths (nested routes load them)");
ok(!/(?:href|src)="(?!\/|#|https?:|data:|mailto:)[^"]+\.(?:js|css|png|svg|ico|json)/.test(home), "no document-relative asset references remain", "");
ok(home.includes("seo-config.js") || home.includes("seo.js"), "SEO config/module referenced");
const navAnchors = [...home.matchAll(/<a class="nav-item[^"]*" data-route="[^"]+" href="(\/[^"]*)"/g)];
ok(navAnchors.length >= 20, `sidebar exposes ${navAnchors.length} crawlable route links (≥20)`);
ok(/\.sidebar \.nav-item[\s\S]*?text-decoration:\s*none\s*!important/.test(read("styles.css")), "sidebar/hamburger links explicitly have no underline");
const navButtons = [...home.matchAll(/<button class="nav-item[^"]*" data-route="([^"]+)"/g)].map((m) => m[1]);
ok(navButtons.every((r) => CFG.ROUTES[r] && !CFG.ROUTES[r].path), `remaining nav buttons are private routes only`, navButtons.join(","));
const bottomAnchors = [...home.matchAll(/<a class="bottom-nav-item" data-route="[^"]+" href="(\/[^"]*)"/g)];
ok(bottomAnchors.length >= 3, `mobile bottom nav has ${bottomAnchors.length} crawlable links`);
ok(/<h1>Class 11 and Class 12 Accountancy Notes/.test(home), "home has its prerendered H1");
ok(home.includes("seo:view-start") && home.includes("seo:view-end"), "home prerendered content markers present");
ok(home.includes("Accountancy By Abhinash"), "compact footer brand present");
ok(home.includes("Designed &amp; Developed by <b>D. Abinash Reddy</b>"), "compact footer developer credit present");
ok(home.includes("@manikanta_257"), "compact footer Instagram handle present");
ok(home.includes("Report a Problem"), "compact footer problem-report link present");
ok(!home.includes("site-footer-directory"), "long footer study-material directory removed");
ok(!home.includes("All 18 Chapters &amp; Notes"), "long footer chapter quick links removed");
ok(!home.includes("mcq-quiz"), "no stale /mcq-quiz/ link");
const homeLd = home.match(/<script type="application\/ld\+json" id="seoJsonldPage">([\s\S]*?)<\/script>/);
ok(!!homeLd, "home page JSON-LD present");
try { JSON.parse(homeLd[1]); ok(true, "home JSON-LD parses"); } catch (e) { ok(false, "home JSON-LD parses", e.message); }

/* ================= F. app integration ================= */
section("F. app.js / seo.js — client-side metadata sync");
const app = read("app.js");
ok(app.includes("Seo.applyRoute(route)"), "renderRoute applies SEO metadata per route");
ok(app.includes("Seo.pathFor"), "navigate keeps the URL path in step with the route");
ok(app.includes("Seo.routeForPath"), "direct path loads resolve back to a route");
ok(app.includes("closest(\"a[href]\")"), "internal anchors are handled as in-app navigations");
const seo = read("seo.js");
ok(seo.includes("setCanonical"), "seo.js manages the canonical tag");
ok(seo.includes("updateJsonLd"), "seo.js updates JSON-LD on navigation");
ok(seo.includes("FAQPage"), "seo.js keeps the FAQ JSON-LD node on client navigation");
ok(seo.includes("CFG.ORIGIN"), "seo.js builds absolute URLs from the real origin");
ok(!/site\.ORIGIN/.test(seo), "seo.js has no dangling site.ORIGIN reference");
ok(!/site\.ORIGIN/.test(read(path.join("tools", "build-seo-pages.js"))), "build script has no dangling site.ORIGIN reference");

/* ================= G. internal links ================= */
section("G. Internal links resolve");
try {
  execFileSync(process.execPath, [path.join(ROOT, "tools", "check-links.js")], { stdio: "pipe" });
  ok(true, "tools/check-links.js: every internal href/src resolves");
} catch (e) {
  ok(false, "tools/check-links.js: every internal href/src resolves", (e.stdout || e.message).toString());
}

/* ================= H. removed routes / 404 honesty ================= */
section("H. Removed routes and honest 404");
for (const f of ["index.html", "404.html", "sitemap.xml"]) {
  const txt = read(f);
  ok(!/numerical-solver|\/solver\//.test(txt), `${f} has no link to the removed Numerical Solver`);
}
const nf = read("404.html");
ok(/<meta name="robots" content="noindex/.test(nf), "404 page is noindex");
ok((nf.match(/<a href="/g) || []).length >= 10, "404 page offers crawlable recovery links");
const toml = read("netlify.toml");
ok(!/\[\[redirects\]\][\s\S]*?from = "\/\*"[\s\S]*?status = 200/.test(toml), "netlify.toml has no catch-all 200 rewrite (no soft-404s)");
ok(toml.includes("build-seo-pages.js"), "netlify build command regenerates SEO output");
ok(exists("404.html"), "404.html shipped");

console.log("\n" + "=".repeat(60));
console.log(`SEO tests: ${pass} passed / ${fail} failed`);
if (failures.length) {
  console.log("\nFAILURES");
  failures.forEach((f) => console.log("  ✗ " + f));
  process.exit(1);
}
