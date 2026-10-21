/* exam-access-client.js — v89 Part 6: SERVER-SIDE authorization for
   privileged codes (unlock codes, admin token).

   This module is the ONLY place in the browser that talks to
   /.netlify/functions/exam-access. The unlock codes and the admin
   token used to live in app.js in plaintext — any downloaded copy of
   the site held every secret. They now exist ONLY in Netlify
   environment variables, validated by the server function
   (netlify/functions/exam-access.js); this is the client half.

   It lives in its OWN client module, exactly like push-manager.js:
   the core shell files (app.js, index.html, sw.js and the AI engine)
   never fetch a Netlify Function, so their offline guarantee stays
   literal and testable. Network features are always reached through a
   dedicated client module loaded before app.js.

   Behaviour — one POST with a hard 8-second timeout, and an HONEST
   failure when the service is unreachable: offline (or a static-only
   deployment), the code box says the check needs a connection instead
   of pretending to judge the code locally. No secret ever exists in
   this file: it can only ask the server for a verdict.

   Expects: examCandidateId() from app.js (available by the time any
   unlock/admin action runs) and the browser's fetch. */
async function examAccessVerify(purpose, value) {
  const ctrl = (typeof AbortController !== "undefined") ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => { try { ctrl.abort(); } catch (e) {} }, 8000) : null;
  try {
    const payload = { purpose: purpose, candidateId: examCandidateId() };
    if (purpose === "unlock") payload.code = String(value || "");
    else payload.token = String(value || "");
    const res = await fetch("/.netlify/functions/exam-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    });
    let data = null;
    try { data = await res.json(); } catch (e) { data = null; }
    return {
      reachable: true, status: res.status,
      ok: !!(data && data.ok === true),
      grant: (data && (data.grant === "two" || data.grant === "unlimited")) ? data.grant : null,
      error: (data && typeof data.error === "string") ? data.error : null
    };
  } catch (e) {
    return { reachable: false, status: 0, ok: false, grant: null, error: "network" };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
