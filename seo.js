/* ============================================================
   ACCOUNTANCY BY ABINASH — RUNTIME SEO MANAGER
   ------------------------------------------------------------
   Keeps every search-relevant tag in sync while the student
   navigates the single-page app: document title, meta
   description, keywords, canonical URL, robots directive,
   Open Graph / Twitter tags, the visible breadcrumb bar, and
   the page's WebPage + BreadcrumbList JSON-LD.

   Depends on seo-config.js (window.SEO_CONFIG). Browser only —
   every entry point is guarded so Node tests can load it safely.
   ============================================================ */
(function (root) {
  "use strict";
  if (!root || !root.document) return;

  var doc = root.document;
  var CFG = root.SEO_CONFIG;

  function decodeEntities(s) {
    return String(s || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* --- meta tag helpers (create on first use, then reuse) --- */
  function setMeta(attr, key, value, where) {
    where = where || "head";
    var sel = where === "head"
      ? (attr === "name" ? 'meta[name="' + key + '"]' : 'meta[property="' + key + '"]')
      : selFor(where, attr, key);
    var el = doc.head ? doc.head.querySelector(sel) : null;
    if (!el) {
      el = doc.createElement("meta");
      el.setAttribute(attr, key);
      if (where === "body") el.setAttribute("data-seo-runtime", "1");
      (doc.head || doc.body).appendChild(el);
    }
    el.setAttribute("content", value);
    return el;
  }
  function selFor(where, attr, key) {
    if (where === "body-icon") return 'link[rel="' + key + '"]';
    return (attr === "name" ? 'meta[name="' + key + '"]' : 'meta[property="' + key + '"]');
  }
  function setCanonical(href) {
    var el = doc.head ? doc.head.querySelector('link[rel="canonical"]') : null;
    if (!el) {
      el = doc.createElement("link");
      el.setAttribute("rel", "canonical");
      if (doc.head) doc.head.appendChild(el);
    }
    el.setAttribute("href", href);
  }
  function removeCanonical() {
    var el = doc.head ? doc.head.querySelector('link[rel="canonical"]') : null;
    if (el && el.getAttribute("data-seo-runtime") !== "0") el.parentNode.removeChild(el);
  }

  /* --- visible breadcrumb bar (inside <main>, above the view) --- */
  function renderBreadcrumbs(route, cfg) {
    var bar = doc.getElementById("breadcrumbBar");
    if (!bar || !CFG) return;
    if (!cfg || !cfg.path) { bar.hidden = true; bar.innerHTML = ""; return; }
    var trail = CFG.breadcrumbFor(route);
    if (trail.length < 2) { bar.hidden = true; bar.innerHTML = ""; return; }
    var html = '<ol class="breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">';
    trail.forEach(function (crumb, i) {
      var li = "<li class='breadcrumb-item' itemprop='itemListElement' itemscope itemtype='https://schema.org/ListItem'>";
      var isLast = i === trail.length - 1;
      if (!isLast && crumb.path) {
        li += '<a itemprop="item" href="' + esc(crumb.path) + '"><span itemprop="name">' + esc(crumb.label) + "</span></a>";
      } else {
        li += '<span itemprop="name" aria-current="page">' + esc(crumb.label) + "</span>";
      }
      li += '<meta itemprop="position" content="' + (i + 1) + '" /></li>';
      html += li;
    });
    html += "</ol>";
    bar.innerHTML = html;
    bar.hidden = false;
  }

  /* --- page-level JSON-LD (WebPage + BreadcrumbList) --- */
  function updateJsonLd(route, cfg) {
    var host = doc.head || doc.body;
    if (!host) return;
    var script = doc.getElementById("seoJsonldPage");
    if (!script) {
      script = doc.createElement("script");
      script.type = "application/ld+json";
      script.id = "seoJsonldPage";
      host.appendChild(script);
    }
    if (!cfg || !cfg.path || !CFG) { script.textContent = ""; return; }
    var url = CFG.ORIGIN + cfg.path;
    var trail = CFG.breadcrumbFor(route);
    var crumbs = trail.map(function (c, i) {
      return {
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        item: CFG.ORIGIN + (c.path || "/")
      };
    });
    var data = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": url + "#webpage",
          url: url,
          name: decodeEntities(cfg.title || CFG.SITE.defaultTitle),
          description: cfg.description || CFG.SITE.defaultDescription,
          inLanguage: "en-IN",
          isPartOf: { "@type": "WebSite", "@id": CFG.ORIGIN + "#website", name: CFG.SITE.name, url: CFG.ORIGIN + "/" }
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: crumbs
        }
      ]
    };
    /* Keep the FAQ node in step with the static prerendered page, so a
       client-side navigation never leaves the JSON-LD stale or partial. */
    if (cfg.faq && cfg.faq.length) {
      data["@graph"].push({
        "@type": "FAQPage",
        mainEntity: cfg.faq.map(function (f) {
          return {
            "@type": "Question",
            name: decodeEntities(f.q),
            acceptedAnswer: { "@type": "Answer", text: decodeEntities(f.a) }
          };
        })
      });
    }
    script.textContent = JSON.stringify(data, null, 2);
  }

  /* --- main entry: apply everything for the current route --- */
  function applyRoute(route) {
    if (!CFG) return;
    var cfg = CFG.ROUTES[route];
    var site = CFG.SITE;

    /* Fallback for unknown/ad-hoc routes: stay on defaults, noindex. */
    if (!cfg) {
      doc.title = site.defaultTitle;
      setMeta("name", "robots", "noindex,follow");
      removeCanonical();
      renderBreadcrumbs(route, null);
      return;
    }

    var title = decodeEntities(cfg.title || site.defaultTitle);
    var desc = cfg.description || site.defaultDescription;

    doc.title = title;
    setMeta("name", "description", desc);
    if (cfg.keywords && cfg.keywords.length) setMeta("name", "keywords", cfg.keywords.join(", "));

    if (cfg.path && !cfg.noindex) {
      var canonical = CFG.ORIGIN + cfg.path;
      setCanonical(canonical);
      var robots = doc.head.querySelector('meta[name="robots"]');
      if (robots) robots.parentNode.removeChild(robots);
      setMeta("name", "robots", "index,follow, max-image-preview:large");
      setMeta("property", "og:title", title);
      setMeta("property", "og:description", desc);
      setMeta("property", "og:url", canonical);
      setMeta("property", "og:type", "website");
      setMeta("property", "og:locale", "en_IN");
      setMeta("property", "og:site_name", site.name);
      setMeta("property", "og:image", site.ogImage);
      setMeta("name", "twitter:card", "summary");
      setMeta("name", "twitter:title", title);
      setMeta("name", "twitter:description", desc);
      setMeta("name", "twitter:image", site.ogImage);
    } else {
      setMeta("name", "robots", "noindex,follow");
      removeCanonical();
    }

    renderBreadcrumbs(route, cfg);
    updateJsonLd(route, cfg);
  }

  root.Seo = {
    applyRoute: applyRoute,
    pathFor: function (route) { return CFG ? CFG.pathFor(route) : null; },
    routeForPath: function (p) { return CFG ? CFG.routeForPath(p) : null; }
  };
})(typeof window !== "undefined" ? window : null);
