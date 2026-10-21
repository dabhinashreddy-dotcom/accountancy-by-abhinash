/* ============================================================
   ACCOUNTANCY BY ABINASH — SEO PRERENDER BUILD
   ------------------------------------------------------------
   Reads index.html as the single template and generates:
     • <route path>/index.html — one crawlable page per public
       route, with unique title/description/canonical/OG tags,
       static breadcrumb, JSON-LD (WebPage + BreadcrumbList +
       FAQPage) and prerendered educational content in #view-root
     • sitemap.xml (public canonical URLs only)
     • robots.txt (crawl-allow + sitemap reference)
     • 404.html (custom not-found page with crawlable links)
   Also refreshes index.html's own head meta for the home route
   so template and config can never disagree.

   Run:  node tools/build-seo-pages.js
   Also required by tests/seo-tests.js (exports build()).
   No dependencies. Regenerate after editing seo-config.js or
   adding a chapter — Netlify's build command runs this too.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const CFG = require(path.join(ROOT, "seo-config.js"));

/* ---- chapter list from data.js (single source of truth) ---- */
function loadChapters() {
  const ctx = { console, localStorage: { getItem: () => null, setItem: () => {} }, window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + "\n;globalThis.__D=APP_DATA;", ctx);
  return ctx.__D.chapters; // [{ id, num, name, ... }]
}

/* v83 — Class 12 chapter directory from data-12.js (same technique). */
function loadChapters12() {
  if (!fs.existsSync(path.join(ROOT, "data-12.js"))) return [];
  const ctx = { console, localStorage: { getItem: () => null, setItem: () => {} }, window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "data-12.js"), "utf8") + "\n;globalThis.__D12=C12_DATA;", ctx);
  return (ctx.__D12 && ctx.__D12.chapters) || []; // [{ id, num, name, class, slug, ... }]
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function decode(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}

/* ---- head block for a route ---- */
function headMeta(routeId, cfg) {
  const site = CFG.SITE;
  const title = cfg.title || site.defaultTitle;
  const desc = cfg.description || site.defaultDescription;
  const url = cfg.path ? CFG.ORIGIN + cfg.path : CFG.ORIGIN + "/";
  const lines = [];
  lines.push(`<title>${esc(title)}</title>`);
  lines.push(`<meta name="description" content="${esc(desc)}" />`);
  if (cfg.keywords && cfg.keywords.length) lines.push(`<meta name="keywords" content="${esc(cfg.keywords.join(", "))}" />`);
  if (cfg.noindex) {
    lines.push(`<meta name="robots" content="noindex,follow" />`);
  } else {
    lines.push(`<meta name="robots" content="index,follow, max-image-preview:large" />`);
    lines.push(`<link rel="canonical" href="${url}" />`);
    lines.push(`<meta property="og:type" content="website">`);
    lines.push(`<meta property="og:site_name" content="${esc(site.name)}">`);
    lines.push(`<meta property="og:locale" content="en_IN">`);
    lines.push(`<meta property="og:title" content="${esc(title)}">`);
    lines.push(`<meta property="og:description" content="${esc(desc)}">`);
    lines.push(`<meta property="og:url" content="${url}">`);
    lines.push(`<meta property="og:image" content="${site.ogImage}">`);
    lines.push(`<meta name="twitter:card" content="summary">`);
    lines.push(`<meta name="twitter:title" content="${esc(title)}">`);
    lines.push(`<meta name="twitter:description" content="${esc(desc)}">`);
    lines.push(`<meta name="twitter:image" content="${site.ogImage}">`);
  }
  return lines.join("\n");
}

/* ---- page JSON-LD (WebPage + BreadcrumbList [+ FAQPage]) ---- */
function pageJsonLd(routeId, cfg) {
  const site = CFG.SITE;
  const url = CFG.ORIGIN + (cfg.path || "/");
  const trail = cfg.path ? CFG.breadcrumbFor(routeId) : null;
  const graph = [];
  graph.push({
    "@type": "WebPage",
    "@id": url + "#webpage",
    url: url,
    name: decode(cfg.title || site.defaultTitle),
    description: cfg.description || site.defaultDescription,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", "@id": CFG.ORIGIN + "#website", name: site.name, url: CFG.ORIGIN + "/" }
  });
  if (trail && trail.length > 1) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: trail.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: decode(c.label),
        item: CFG.ORIGIN + (c.path || "/")
      }))
    });
  }
  if (cfg.faq && cfg.faq.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: cfg.faq.map((f) => ({
        "@type": "Question",
        name: decode(f.q),
        acceptedAnswer: { "@type": "Answer", text: decode(f.a) }
      }))
    });
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);
}

/* ---- static breadcrumb bar markup ---- */
function breadcrumbHtml(routeId, cfg) {
  if (!cfg.path) return "";
  const trail = CFG.breadcrumbFor(routeId);
  if (trail.length < 2) return "";
  let html = '<ol class="breadcrumb-list">';
  trail.forEach((c, i) => {
    const isLast = i === trail.length - 1;
    html += "<li class='breadcrumb-item'>";
    html += isLast || !c.path
      ? `<span aria-current="page">${esc(c.label)}</span>`
      : `<a href="${c.path}">${esc(c.label)}</a>`;
    html += "</li>";
  });
  return html + "</ol>";
}

/* ---- prerendered educational content for #view-root ---- */
function chapterIndexHtml(chapters, heading) {
  let html = `<section class="seo-section"><h2>${heading || "All 18 Chapters (CBSE Class 11 Accountancy)"}</h2><ol class="seo-chapter-index">`;
  chapters.forEach((ch) => {
    const p = CFG.pathFor("ch-" + ch.id);
    if (p) html += `<li><a href="${p}">${ch.num}. ${esc(ch.name)}</a></li>`;
  });
  return html + "</ol></section>";
}

function viewHtml(routeId, cfg, chapters, chapters12) {
  chapters12 = chapters12 || [];
  if (!cfg.path) return "";
  const isChapter = routeId.indexOf("ch-") === 0 && routeId !== "chapters-list";
  const chapter = isChapter
    ? chapters.find((c) => "ch-" + c.id === routeId) || chapters12.find((c) => "ch-" + c.id === routeId)
    : null;
  let html = `<article class="seo-prerender" data-seo-route="${esc(routeId)}">`;
  if (chapter) {
    html += `<p class="seo-eyebrow">Chapter ${chapter.num} · CBSE Class ${String(chapter.class || "11")} Accountancy</p>`;
  }
  if (cfg.h1) html += `<h1>${cfg.h1}</h1>`;
  if (cfg.lead) html += `<p class="seo-lead">${cfg.lead}</p>`;
  if (cfg.includeChapterIndex) {
    // v83 — the index matches the class of the page it sits on.
    const mode = cfg.chapterIndexClass || (routeId === "chapters-list-12" ? "12" : "11");
    if (mode === "both") {
      html += chapterIndexHtml(chapters, "All 18 Chapters (CBSE Class 11 Accountancy)");
      html += chapterIndexHtml(chapters12, "All 13 Chapters (CBSE Class 12 Accountancy)");
    } else if (mode === "12") {
      html += chapterIndexHtml(chapters12, "All 13 Chapters (CBSE Class 12 Accountancy)");
    } else {
      html += chapterIndexHtml(chapters, "All 18 Chapters (CBSE Class 11 Accountancy)");
    }
  }
  (cfg.sections || []).forEach((s) => {
    html += `<section class="seo-section"><h2>${s.h2}</h2>${s.body}</section>`;
  });
  if (cfg.faq && cfg.faq.length) {
    html += `<section class="seo-section seo-faq"><h2>Frequently Asked Questions</h2>`;
    cfg.faq.forEach((f) => {
      html += `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`;
    });
    html += `</section>`;
  }
  if (cfg.related && cfg.related.length) {
    html += `<section class="seo-section seo-related"><h2>Related Resources</h2><ul>`;
    cfg.related.forEach((r) => {
      const p = CFG.pathFor(r.route);
      if (p) html += `<li><a href="${p}">${r.label}</a></li>`;
      else html += `<li>${r.label}</li>`;
    });
    html += `</ul></section>`;
  }
  html += `</article>`;
  return html;
}

/* ---- template surgery ---- */
function buildPage(template, routeId, cfg, chapters, chapters12) {
  let html = template;
  // 1. head meta block (everything between <title> and the theme-color meta)
  html = html.replace(
    /<title>[\s\S]*<meta name="twitter:(?:title|description|image)"[^>]*>/,
    headMeta(routeId, cfg)
  );
  // 2. page JSON-LD
  html = html.replace(
    /<script type="application\/ld\+json" id="seoJsonldPage">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="seoJsonldPage">\n${pageJsonLd(routeId, cfg)}\n</script>`
  );
  // 3. Remove the visible breadcrumb strip on every page. Breadcrumb structured data
  // remains in JSON-LD for search engines; the page UI stays clean and uncluttered.
  html = html.replace(/<nav id="breadcrumbBar"[^>]*>[\s\S]*?<\/nav>/, "");
  // 4. prerendered view content
  html = html.replace(
    /<!--seo:view-start-->[\s\S]*?<!--seo:view-end-->/,
    `<!--seo:view-start-->${viewHtml(routeId, cfg, chapters, chapters12)}<!--seo:view-end-->`
  );
  return html;
}

/* ---- sitemap / robots / 404 ---- */
function sitemapXml() {
  const urls = CFG.publicRoutes().map((id) => CFG.ROUTES[id]);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  urls.forEach((r) => {
    xml += "  <url>\n";
    xml += `    <loc>${CFG.ORIGIN}${r.path}</loc>\n`;
    xml += `    <lastmod>${CFG.SITE.releaseDate}</lastmod>\n`;
    xml += "  </url>\n";
  });
  xml += "</urlset>\n";
  return xml;
}

function robotsTxt() {
  return [
    "# Accountancy By Abinash — free CBSE Class 11 and Class 12 Accountancy learning platform",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${CFG.ORIGIN}/sitemap.xml`,
    ""
  ].join("\n");
}

function notFoundPage(chapters, chapters12) {
  chapters12 = chapters12 || [];
  const chaptersLink = CFG.pathFor("chapters-list");
  const chapters12Link = CFG.pathFor("chapters-list-12") || chaptersLink;
  const homeLink = "/";
  let links = "";
  chapters.forEach((ch) => {
    const p = CFG.pathFor("ch-" + ch.id);
    if (p) links += `<li><a href="${p}">${ch.num}. ${esc(ch.name)}</a></li>`;
  });
  let links12 = "";
  chapters12.forEach((ch) => {
    const p = CFG.pathFor("ch-" + ch.id);
    if (p) links12 += `<li><a href="${p}">${ch.num}. ${esc(ch.name)}</a></li>`;
  });
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Page Not Found | Accountancy By Abinash</title>
<meta name="robots" content="noindex,follow" />
<meta name="theme-color" content="#0B0A09" />
<style>
  body { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; background: #faf7f2; color: #221d18; margin: 0; padding: 40px 20px; line-height: 1.6; }
  main { max-width: 720px; margin: 0 auto; }
  h1 { font-size: 1.6rem; margin: 0 0 10px; }
  h2 { font-size: 1.05rem; margin: 24px 0 10px; color: #3c332b; }
  p { margin: 0 0 18px; color: #5a5048; }
  a { color: #8a4b1f; }
  ol { padding-left: 22px; columns: 2; column-gap: 28px; }
  li { break-inside: avoid; margin-bottom: 6px; }
  .back { display: inline-block; margin-bottom: 26px; font-weight: 600; }
  @media (max-width: 560px) { ol { columns: 1; } }
</style>
</head>
<body>
<main>
  <a class="back" href="${homeLink}">← Back to Accountancy By Abinash home</a>
  <h1>Page not found</h1>
  <p>The page you were looking for does not exist. It may have moved, or the link may be mistyped. Everything here is free — start again from the <a href="${chaptersLink}">Class 11 Accountancy chapter list</a> or the <a href="${chapters12Link}">Class 12 Accountancy chapter list</a>, or pick a chapter below.</p>
  ${links12 ? `<h2>Class 12 chapters</h2><ol class="c12">${links12}</ol>` : ""}
  <h2>Class 11 chapters</h2>
  <ol>${links}</ol>
</main>
</body>
</html>
`;
}

/* ---- main ---- */
function build() {
  const chapters = loadChapters();
  const chapters12 = loadChapters12();
  const template = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

  // Home: refresh index.html's own head/JSON-LD (breadcrumb hidden, view token untouched)
  const homeCfg = CFG.ROUTES.home;
  let home = template;
  home = home.replace(
    /<title>[\s\S]*<meta name="twitter:(?:title|description|image)"[^>]*>/,
    headMeta("home", homeCfg)
  );
  home = home.replace(
    /<script type="application\/ld\+json" id="seoJsonldPage">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="seoJsonldPage">\n${pageJsonLd("home", homeCfg)}\n</script>`
  );
  // Home also gets prerendered crawlable content (replaced by the SPA
  // dashboard at runtime) so crawlers see the real landing page.
  home = home.replace(
    /<!--seo:view-start-->[\s\S]*?<!--seo:view-end-->/,
    `<!--seo:view-start-->${viewHtml("home", homeCfg, chapters, chapters12)}<!--seo:view-end-->`
  );
  fs.writeFileSync(path.join(ROOT, "index.html"), home, "utf8");

  // Path pages
  let count = 0;
  CFG.publicRoutes().forEach((routeId) => {
    const cfg = CFG.ROUTES[routeId];
    if (!cfg.path || routeId === "home") return;
    const outDir = path.join(ROOT, "." + cfg.path); // "./class-11-accountancy/journal/"
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), buildPage(template, routeId, cfg, chapters, chapters12), "utf8");
    count++;
  });

  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemapXml(), "utf8");
  fs.writeFileSync(path.join(ROOT, "robots.txt"), robotsTxt(), "utf8");
  fs.writeFileSync(path.join(ROOT, "404.html"), notFoundPage(chapters, chapters12), "utf8");

  return { pages: count, publicRoutes: CFG.publicRoutes().length };
}

if (require.main === module) {
  const r = build();
  console.log(`SEO build: ${r.pages} prerendered pages (+home) from ${r.publicRoutes} public routes. Sitemap, robots.txt and 404.html written.`);
}

module.exports = { build, loadChapters, loadChapters12, pageJsonLd, headMeta };
