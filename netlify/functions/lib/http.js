/* Tiny response helpers shared by every push function — one place for
   CORS (same-origin only is fine, but an explicit header avoids
   opaque failures if the site is ever served from a subdomain) and
   for never leaking internals to the client. */

function json(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    },
    body: JSON.stringify(body)
  };
}

function badRequest(reason) {
  return json(400, { ok: false, error: reason });
}

function tooMany() {
  return json(429, { ok: false, error: "rate-limited" });
}

function serverError() {
  return json(500, { ok: false, error: "server-error" });
}

/* Read and validate the JSON body in one step. */
const { parseJson, bodyTooLarge } = require("./validate");

function readBody(event) {
  const raw = (event && event.body) || "";
  if (bodyTooLarge(raw)) return { error: "body-too-large" };
  const body = parseJson(raw);
  if (!body) return { error: "invalid-json" };
  return { body: body };
}

module.exports = { json, badRequest, tooMany, serverError, readBody };
