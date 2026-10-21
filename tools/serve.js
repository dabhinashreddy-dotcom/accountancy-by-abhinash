/* Tiny zero-dependency static server, used only to verify the site
   locally in a real browser. Not part of the deployed site. */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.argv[2] || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  /* v89 — the vendored MediaPipe assets: browsers refuse to execute an
     ES module (or compile wasm) served with a non-JS / generic type,
     and Netlify serves all three correctly in production, so the local
     verifier must match it. */
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".tflite": "application/octet-stream"
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  let file = path.join(ROOT, urlPath);
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end("forbidden"); return; }
  /* Netlify-style resolution: a directory serves its index.html, and an
     extension-less path that names a directory redirects to the trailing
     slash — so local verification exercises the same URLs as production. */
  try {
    if (fs.statSync(file).isDirectory()) {
      if (!urlPath.endsWith("/")) { res.writeHead(301, { location: urlPath + "/" }); res.end(); return; }
      file = path.join(file, "index.html");
    }
  } catch {
    /* fall through — handled as 404 below */
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      /* Honest 404 like production: the custom page, with a 404 status. */
      fs.readFile(path.join(ROOT, "404.html"), (e2, nf) => {
        if (e2) { res.writeHead(404, { "content-type": "text/plain" }); res.end("not found"); return; }
        res.writeHead(404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
        res.end(nf);
      });
      return;
    }
    res.writeHead(200, {
      "content-type": TYPES[path.extname(file)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log("serving " + ROOT + " on http://127.0.0.1:" + PORT));
