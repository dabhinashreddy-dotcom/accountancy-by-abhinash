# Supabase Exam Records — Setup & Verification Guide

**Accountancy By Abhinash — v94 integration**
*Every completed examination and every security-terminated attempt is now preserved server-side, with a globally unique certificate id per attempt.*

---

## 1. What this integration does

The website has always stored examinations in the browser's `localStorage`. That is fast and works offline, but it means a result (or a disqualification) disappears if the student clears site data, changes device, or loses the phone.

This integration adds a **server-side record** inside your existing Supabase project:

| Event in the website | What is written to Supabase |
|---|---|
| An exam is submitted (PASS **or** FAIL) | One row in `exam_records`, `attempt_status = 'submitted'`, with a **server-allocated certificate id** (`ACC-<MONYYYY>-0001`, …) |
| An attempt is terminated by the proctoring engine (tab-switch, copy attempt, leaving fullscreen, camera/mic failure, …) | One row, `attempt_status = 'terminated'`, **`certificate_id = NULL`** — a disqualified attempt can never earn a certificate |
| An attempt is voided (paper never delivered) or still active | **Nothing** — only final outcomes are recorded |

Key guarantees, enforced **in the database** (not in JavaScript):

* **One row per attempt.** Both write functions are idempotent on `attempt_id`. A retry, a double-click, two tabs, or a replayed offline queue can never create a second row or a second certificate.
* **First final state wins.** If an attempt was already recorded as `submitted`, a later "terminated" write is refused (`already_submitted = true`). If it was already `terminated`, a submission cannot upgrade it.
* **Certificate ids are allocated atomically** by `next_certificate_id()` using the `certificate_counters` table — the exact same `ACC-OCT2026-0001` format the site already shows students (`ExamRules.certIdForDate`).
* **Anonymous visitors cannot read or write the tables.** Row Level Security is enabled on both tables with *no* policies for `anon`/`authenticated` — direct table access always returns empty/denied. The only entry points are the two RPCs below.

---

## 2. The live project (already created and migrated)

| Item | Value |
|---|---|
| Supabase organization | `yoltwtlkvapuzqcmyqpi` (account `dabhinashreddy@gmail.com`, FREE plan — the existing organization; no new one was created) |
| Project name | `accountancy-by-abhinash-exam-records` |
| Project ref | `jiioxnpamdfurnooglub` |
| Region | `ap-south-1` (Mumbai, India) |
| Project URL | `https://jiioxnpamdfurnooglub.supabase.co` |
| Publishable key (safe in the browser) | `sb_publishable_yvXuGbdKRUO_MrucNy_g5A_1-6G4tl0` |
| Secret / service-role key | **Never** leaves the Supabase dashboard. It is not in the website, the repository, or the ZIP. |
| Database password | Set at project creation; stored only in the Supabase dashboard. Not in the repository. |
| Migration status | **Applied and verified** — `exam_records` (23 columns) and `certificate_counters` exist with RLS enabled; `submit_exam_record` and `record_terminated_attempt` exist as `SECURITY DEFINER`; helper functions `norm_text`, `next_certificate_id` and the `exam_records_guard` trigger exist. |

The browser talks to the project with **only** the publishable key, which Supabase documents as safe to embed in client code (it is also in the already-deployed website's JavaScript by necessity). Even if someone extracts it, RLS still blocks all direct table access; they can only call the two validation-heavy write RPCs.

---

## 3. What changed in the website

Only these files were touched — every existing feature (exam engine, timer, grading, PASS/FAIL titles, attempts, security checks, PDF/print, history, dashboards, AI tutor, push, offline mode, Netlify Functions) is untouched:

| File | Change |
|---|---|
| `exam-records-supabase.js` | **NEW** — the Supabase client module (`ExamRecords`). Publishable key only, 12 s timeout, pending-sync queue in `localStorage`, retry with backoff, honest per-attempt status. |
| `app.js` | Three surgical edits: (1) the exam store's `submit` action calls `ExamRecords.syncSubmitted(rec)`; (2) the `disqualify` action calls `ExamRecords.syncTerminated(rec)`; (3) the result screen and the terminated screen show an **honest sync line** (see §6). All calls are fire-and-forget — the local attempt remains authoritative and a sync failure can never block, fail or alter a submission, result or certificate. |
| `index.html` | Loads `/exam-records-supabase.js?v=1` before `app.js`. |
| `sw.js` | New file precached; `CACHE_NAME` bumped `v56 → v57` so deployed browsers pick up the change. |
| `supabase/migrations/001_exam_records.sql` | **NEW** — the exact SQL applied to the live project (see §4). |
| `tests/exam-records-client-tests.js` | **NEW** — 63 assertions over the real module code (payload mapping, RPC names/headers, queue, retries, permanent rejections, replay safety, secret-leak scan). |
| `package.json` | New test suite added to `npm test`. |
| `SUPABASE-EXAM-RECORDS-SETUP.md` | This document. |

---

## 4. The migration (reproducible)

The whole database schema lives in **`supabase/migrations/001_exam_records.sql`**. It is idempotent (`create or replace`, `if not exists`, `drop … if exists` guards), so re-running it on the live project is safe. What it creates:

1. **`exam_records`** — one row per finished attempt:
   `attempt_id` (PK), `certificate_id` (unique, `NULL` for terminated), `attempt_status` (`submitted`/`terminated`), `result_status` (`PASS`/`FAIL`/`NULL`), candidate/school/class/subject/paper/title, marks, percentage, grade, `started_at`, `finished_at`, `time_taken_seconds`, `termination_reason`, `security_event_code`, `verification_status`, `source`, timestamps.
2. **`certificate_counters`** — per-month counter guaranteeing `ACC-<MONYYYY>-0001` style ids with no duplicates and no gaps under concurrency.
3. **`norm_text()`** — trims/collapses whitespace, strips control characters, caps length.
4. **`next_certificate_id(month_key)`** — `SECURITY DEFINER`, revoked from `public`/`anon`; the single allocator.
5. **`submit_exam_record(...)`** — `SECURITY DEFINER` RPC, executable by `anon`/`authenticated`/`service_role`. Validates every argument (`INVALID_ATTEMPT_ID`, `INVALID_CLASS_NAME`, `INVALID_RESULT_STATUS`, …), then inserts with `ON CONFLICT (attempt_id) DO NOTHING` — a second call returns the existing row and the **same** certificate id (`already_registered = true`).
6. **`record_terminated_attempt(...)`** — same pattern; stores `certificate_id = NULL`; if the attempt is already `submitted`, it reports `already_submitted = true` and stores nothing.
7. **`exam_records_guard` trigger** — a final net under the RPCs: a `submitted` row can never be flipped to `terminated` or lose its certificate id, and a `terminated` row can never become `submitted`.
8. **RLS** on both tables with **no** anon/authenticated policies.

### Re-applying (if ever needed)

* **Dashboard:** SQL Editor → paste the file → Run. Expected: `Success. No rows returned.`
* **Supabase CLI:** `supabase link --project-ref jiioxnpamdfurnooglub` then `supabase db push` (needs your Supabase access token; not required — the project is already migrated).

---

## 5. How to verify it is working (2 minutes)

**A. From the website (real end-to-end test):**
1. Open the site, complete any short exam, submit it.
2. On the result screen, under the action buttons, the sync line should turn into:
   *“ Recorded in Abhinash's examination records — certificate ACC-…”* (green-ish, cloud icon).
3. In the Supabase dashboard → Table Editor → `exam_records`: the new row is there, `attempt_status = submitted`, with its `certificate_id`.

**B. From the dashboard (the data itself):**
```sql
-- every recorded attempt, newest first
select attempt_id, certificate_id, attempt_status, result_status,
       candidate_name, paper_id, marks_obtained, max_marks,
       percentage, termination_reason, finished_at
from exam_records
order by finished_at desc
limit 50;

-- the certificate ledger (must be strictly +1 per month)
select * from certificate_counters order by month_key;

-- certificates issued this month
select certificate_id, candidate_name, percentage, grade
from exam_records
where attempt_status = 'submitted'
  and certificate_id is not null
order by certificate_id;
```

**C. Offline/retry behaviour:** submit an exam with the network off (DevTools → Network → Offline). The line reads *“…queued and will retry automatically when you are back online.”* Reconnect (or reopen the site later) — the queue drains, the row appears, the line flips to “Recorded…”.

---

## 6. Honest status wording (what students see)

The UI never claims a save that did not happen:

| Line shown | Meaning |
|---|---|
| “Saving this attempt to Abhinash's examination records…” | Request in flight |
| “Recorded in Abhinash's examination records — certificate ACC-…” | **The server confirmed the stored row** (only this may say “Recorded”) |
| “Saved on this device. The upload … is queued and will retry automatically when you are back online.” | Local result safe; server upload pending |
| “Saved on this device. Uploading … did not succeed (reason) — your local result and certificate are unaffected.” | Server rejected/failed; shown with the server's reason |
| “This attempt was already recorded.” | A termination race lost to an earlier submission (correctly not stored) |
| *(no line at all)* | Syncing disabled or unavailable — the UI is exactly as before |

---

## 7. Certificate ids: two issuers, one attempt id

* The **student-facing** certificate keeps being issued by the existing local issuer (`ExamRules.certIdForDate` → `store.certs`), so nothing about the current certificate flow changed.
* The **server** independently allocates its own id from `certificate_counters` for the same attempt (the database, not the browser, must own a *globally unique* sequence).
* Both ids belong to the same attempt — `attempt_id` is the join key, and the sync line shows the **server's** id so Abhinash's records and what a student sees can always be reconciled from the dashboard:
  ```sql
  -- find the server row for any locally issued certificate's attempt
  select * from exam_records where attempt_id = '<attempt id from the site>';
  ```
  In normal single-device use the two sequences start together and stay identical (`ACC-OCT2026-0001`, `-0002`, …); they can only drift if the local counter is reset (cleared site data) — the server sequence never restarts.

---

## 8. Limits, knobs and troubleshooting

* **Master switch:** in `exam-records-supabase.js`, set `CFG.enabled = false` — every sync becomes a no-op and the sync lines disappear (the old UI returns). No redeploy of anything else is needed.
* **“Queued” forever:** the queue lives in `localStorage` under `aba_exam_records_queue_v1` and retries on page load, on reconnect (`online` event), on tab focus, and on a 15 s → 10 min backoff while the page is open. A device that never comes back online keeps its local result — that is by design (local-first).
* **“Failed” status:** the server refused that payload (e.g. `INVALID_CLASS_NAME`) — it is *not* retried, because retrying identical data can never succeed. The reason is shown in the line and stored in `aba_exam_records_status_v1`.
* **CORS:** none needed — the RPCs are called on `*.supabase.co`, which allows browser origins by default (this is the standard PostgREST path used by every Supabase JS client).
* **Storage keys added:** `aba_exam_records_queue_v1`, `aba_exam_records_status_v1`. Nothing existing was renamed or removed.
* **Privacy:** rows contain only what the exam flow already shows on the certificate — candidate name, school, paper, marks, timing and (for terminations) the machine reason code. No camera frames, audio, images or IP data are stored server-side.
* **Verification status:** rows are honestly labelled `client_reported` — the browser reports them; the database guarantees uniqueness, atomic certificate allocation and immutability, but it does not (and cannot, from a static site) re-grade the paper server-side. `verification_status` exists for a future server-side re-grade to flip rows to `server_verified`.

---

## 9. Quick reference — the two RPCs

```
POST https://jiioxnpamdfurnooglub.supabase.co/rest/v1/rpc/submit_exam_record
Headers: apikey: <publishable key>   Authorization: Bearer <publishable key>
Body:    { "p_attempt_id": "...", "p_candidate_name": "...", "p_class_name": "Class 11|Class 12",
           "p_paper_id": "...", "p_exam_title": "...", "p_result_status": "PASS|FAIL",
           "p_marks_obtained": 42, "p_max_marks": 50, "p_percentage": 84, "p_grade": "A",
           "p_school_name": "...", "p_subject": "Accountancy", "p_started_at": "2026-10-21T…Z",
           "p_time_taken_seconds": 1500, "p_verification_status": "client_reported" }
Returns:  [ { "attempt_id": "...", "certificate_id": "ACC-OCT2026-0001", "already_registered": false } ]

POST …/rest/v1/rpc/record_terminated_attempt
Body:    { "p_attempt_id": "...", "p_candidate_name": "...", "p_class_name": "Class 11|Class 12",
           "p_paper_id": "...", "p_exam_title": "...", "p_termination_reason": "...",
           "p_security_event_code": "copy-attempt", "p_school_name": "...",
           "p_subject": "Accountancy", "p_started_at": "…Z", "p_time_taken_seconds": 300 }
Returns:  [ { "attempt_id": "...", "stored": true, "already_submitted": false } ]
```

Both can be pasted into the dashboard SQL Editor's API docs or called with `curl` using the publishable key — try it after your next exam to see the row appear.
