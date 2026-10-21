/* push-scheduler — Netlify SCHEDULED function (modern format).

   Runs every 15 minutes (cron is evaluated in UTC; the engine converts
   to each student's own time zone). The schedule is declared HERE, in
   code — netlify.toml intentionally has no schedule entry for it, so
   there is a single source of truth.

   Modern-format functions get the Netlify Blobs environment
   automatically, so no connect(event) call is needed.

   Scheduled functions run only on the PRODUCTION deploy (never on
   deploy previews or branch deploys) and are cut off after about
   30 seconds — runScheduler() keeps to a time budget for that reason.
   All logic lives in lib/run-scheduler.js. */

/* Static import (CommonJS module → default export) so Netlify's
   bundler can trace the whole dependency tree. */
import scheduler from "./lib/run-scheduler.js";
const { runScheduler } = scheduler;

export default async () => {
  const summary = await runScheduler();
  /* Counts only — never subscription endpoints or keys. */
  console.log("push-scheduler", JSON.stringify(summary));
  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = { schedule: "*/15 * * * *" };
