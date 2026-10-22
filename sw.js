// Accountancy By Abhinash — service worker
// Bump CACHE_NAME whenever a deploy should force-refresh cached app files.
const CACHE_NAME = "aba-cache-v59";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./push-manager.js",
  "./ui-features.js",
  "./exam-security.js",
  "./exam-rules.js",
  "./exam-access-client.js",
  /* v89 — the exam monitoring engine (pre-checks, live camera /
     microphone / face / phone monitoring, violation engine). The
     large model + WASM assets under ./vendor/vision/ are fetched on
     first use and picked up by the runtime cache below; they are
     deliberately not precached for every visitor. */
  "./exam-monitor.js",
  /* v94 — Supabase exam-records client (server-side persistence of
     finished/terminated attempts; publishable key only). */
  "./exam-records-supabase.js",
  "./question-bank.js",
  "./questions-expanded.js",
  "./search-index.js",
  "./achievements.js",
  "./calculator.js",
  "./data.js",
  /* Class 12 registry + unit content + the installer that merges it
     into APP_DATA. Precached so the whole Class 12 experience works
     offline exactly like Class 11. */
  "./data-12.js",
  "./data-12a.js",
  "./data-12b.js",
  "./data-12c.js",
  "./data-12d.js",
  "./data-12e.js",
  /* v86 — additive expansion units; precached so the enlarged Class 12
     banks (25 practice / 25 quiz / 20 flashcards / 15 important
     questions per chapter) work offline too. */
  "./data-12f.js",
  "./data-12g.js",
  "./data-12h.js",
  "./data-12i.js",
  "./data-12j.js",
  "./data-12k.js",
  "./data-12l.js",
  "./classes.js",
  "./theory-upgrade.js",
  "./guided-learning.js",
  "./accounting-cycle.js",
  "./ai-calc.js",
  "./ai-knowledge.js",
  "./ai-solver.js",
  "./ai-tutor-core.js",
  "./tutor-engine.js",
  "./certificate.js",
  "./assets/cert-border-bg.jpg",
  "./manifest.json",
  "./assets/brand/icon-192.png",
  "./assets/brand/icon-512.png",
  /* Diagrams used by the image-based exam questions. Small (19 KB in
     total) and precached so those questions still render offline. */
  "./assets/questions/accounting-equation.svg",
  "./assets/questions/bank-reconciliation-flow.svg",
  "./assets/questions/cash-book-columns.svg",
  "./assets/questions/depreciation-methods.svg",
  "./assets/questions/final-accounts-structure.svg",
  "./assets/questions/journal-format.svg",
  "./assets/questions/ledger-t-account.svg",
  "./assets/questions/trial-balance-format.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Stale-while-revalidate: serve from cache instantly if we have it (so the
// app opens even with a flaky connection), but always fetch a fresh copy in
// the background and update the cache — so a student never gets stuck on a
// months-old version just because a service worker is installed.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  /* v87 — never intercept the push/backend functions: responses there
     are stateful (public key fetch, subscription checks) and must
     always hit the network, never a stale cache copy. */
  if (url.pathname.startsWith("/.netlify/")) return;
  if (url.origin !== self.location.origin && !url.hostname.includes("unpkg.com") && !url.hostname.includes("fonts.g")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

// ---------------------------------------------------------------------
// v87 — GENUINE server-side Web Push. The scheduled backend (Netlify
// Functions + web-push/VAPID) delivers JSON payloads of the shape:
//   { category, title, body, url, tag, actions: [{action,title,url}], timestamp }
// This worker receives them while the site is closed, renders the
// notification, and validates every destination against SAFE_ROUTES
// (mirrored from netlify/functions/lib/schedule.js) at both show and
// click time — a malformed payload can only ever open #home.
// ---------------------------------------------------------------------

const SAFE_ROUTES = [
  "home", "about", "chapters-list", "practice-hub", "mistake-book",
  "accounting-cycle", "more", "bookmarks", "quiz", "flashcards",
  "formula-sheet", "important-questions", "exam-mode", "performance",
  "settings", "ai-tutor", "certificate-view",
  "ch-intro", "ch-terms", "ch-tbase", "ch-basis", "ch-eq", "ch-dc",
  "ch-jr", "ch-lg", "ch-cb", "ch-sp2", "ch-brs", "ch-gst", "ch-tb",
  "ch-dep", "ch-pres", "ch-roe", "ch-fs", "ch-adj",
  /* Class 12 dynamic chapter routes (ch-<registry id>). */
  "ch-pf", "ch-gw", "ch-psr", "ch-adm", "ch-ret", "ch-dis", "ch-sc",
  "ch-deb", "ch-cfin", "ch-fsa", "ch-rat", "ch-cf", "ch-ca"
];

function safeRouteUrl(u) {
  const r = String(u || "").replace(/^\.\/#/, "").replace(/^#/, "").split("?")[0];
  return SAFE_ROUTES.indexOf(r) === -1 ? "./#home" : "./#" + r;
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    try { data = { body: event.data ? event.data.text() : "" }; } catch (e2) { data = {}; }
  }
  const title = String(data.title || "Accountancy By Abhinash").slice(0, 120);
  const opts = {
    body: String(data.body || "").slice(0, 300),
    icon: "./assets/brand/icon-192.png",
    badge: "./assets/brand/icon-192.png",
    tag: String(data.tag || "aba-push").slice(0, 64),
    data: { url: safeRouteUrl(data.url), category: String(data.category || "").slice(0, 32), actionUrls: {} }
  };
  if (Number.isFinite(data.timestamp) && data.timestamp > 0) opts.timestamp = data.timestamp;
  if (Array.isArray(data.actions) && data.actions.length) {
    /* At most two buttons; each destination re-validated here so the
       click handler only ever sees already-safe URLs. */
    opts.actions = data.actions.slice(0, 2).map((a) => {
      const action = String((a && a.action) || "open").slice(0, 24);
      if (a && a.url) opts.data.actionUrls[action] = safeRouteUrl(a.url);
      return { action: action, title: String((a && a.title) || "Open").slice(0, 40) };
    });
  }
  event.waitUntil(self.registration.showNotification(title, opts));
});

// Tapping the notification focuses an already-open tab/PWA window if one
// exists, instead of piling up duplicate windows, and otherwise opens one.
// Action buttons resolve through the pre-validated map; every URL is
// re-checked against SAFE_ROUTES before it is navigated to.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  let raw = data.url;
  if (event.action && data.actionUrls && data.actionUrls[event.action]) {
    raw = data.actionUrls[event.action];
  }
  const targetPath = safeRouteUrl(raw);
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          if ("navigate" in client) client.navigate(targetPath).catch(() => {});
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetPath);
    })
  );
});
