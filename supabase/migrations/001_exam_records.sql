-- ============================================================================
-- 001_exam_records.sql
-- Accountancy By Abhinash — Exam & Certificate Records
--
-- Reproducible migration for the Supabase project
--   name:      accountancy-by-abhinash-exam-records
--   reference: jiioxnpamdfurnooglub
--   region:    ap-south-1 (Mumbai)
-- This exact script was applied to the live project above and verified.
--
-- Creates:
--   * public.exam_records        — one final record per exam attempt
--   * public.certificate_counters — atomic monthly certificate-number counter
--   * public.submit_exam_record()   — idempotent RPC for a completed submission
--   * public.record_terminated_attempt() — idempotent RPC for a terminated attempt
--
-- Security model:
--   * RLS is ENABLED on every table with NO policies for anon/authenticated,
--     so the public website can never SELECT/UPDATE/DELETE exam rows directly.
--   * All writes go through SECURITY DEFINER functions that validate and
--     normalize every field, enforce status rules and allocate certificate
--     IDs atomically (one certificate per submitted attempt, never for
--     terminated attempts).
--
-- NOTE: This file contains no credentials or secret values.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Schema
-- ----------------------------------------------------------------------------
create table if not exists public.exam_records (
  id                    uuid primary key default gen_random_uuid(),
  attempt_id            text        not null unique,
  certificate_id        text        unique,
  attempt_status        text        not null,
  result_status         text,
  candidate_name        text        not null,
  school_name           text,
  class_name            text        not null,
  subject               text        not null default 'Accountancy',
  paper_id              text        not null,
  exam_title            text        not null,
  marks_obtained        numeric,
  max_marks             numeric,
  percentage            numeric,
  grade                 text,
  started_at            timestamptz not null,
  finished_at           timestamptz not null default now(),
  time_taken_seconds    integer,
  termination_reason    text,
  security_event_code   text,
  verification_status   text        not null default 'client_reported',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Status validation ------------------------------------------------------
  constraint exam_records_status_chk
    check (attempt_status in ('submitted', 'terminated')),

  -- PASS / FAIL only for submitted attempts; NULL result for terminated ----
  constraint exam_records_result_chk
    check (
      (attempt_status = 'submitted'  and result_status in ('PASS', 'FAIL'))
      or
      (attempt_status = 'terminated' and result_status is null)
    ),

  -- A terminated attempt must not carry a certificate or a result ---------
  constraint exam_records_terminated_no_cert_chk
    check (
      (attempt_status = 'terminated')
      or (certificate_id is not null)
    ),

  constraint exam_records_termination_reason_chk
    check (
      (attempt_status = 'terminated' and termination_reason is not null)
      or attempt_status = 'submitted'
    ),

  constraint exam_records_verification_status_chk
    check (verification_status in ('client_reported', 'server_verified')),

  constraint exam_records_percentage_range_chk
    check (percentage is null or (percentage >= 0 and percentage <= 100)),

  constraint exam_records_marks_nonneg_chk
    check (
      (marks_obtained is null or marks_obtained >= 0)
      and (max_marks is null or max_marks > 0)
    ),

  constraint exam_records_class_name_chk
    check (class_name in ('Class 11', 'Class 12')),

  constraint exam_records_subject_chk
    check (subject = 'Accountancy')
);

-- updated_at maintenance ------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists exam_records_set_updated_at on public.exam_records;
create trigger exam_records_set_updated_at
  before update on public.exam_records
  for each row execute function public.set_updated_at();

-- Indexes for dashboard lookups ---------------------------------------------
create unique index if not exists exam_records_attempt_id_key
  on public.exam_records (attempt_id);
create unique index if not exists exam_records_certificate_id_key
  on public.exam_records (certificate_id)
  where certificate_id is not null;
create index if not exists exam_records_created_at_idx
  on public.exam_records (created_at desc);
create index if not exists exam_records_class_paper_idx
  on public.exam_records (class_name, paper_id);

-- ----------------------------------------------------------------------------
-- 2. Row Level Security — no public read/write access at all
-- ----------------------------------------------------------------------------
alter table public.exam_records enable row level security;
-- Intentionally NO policies for anon / authenticated:
-- direct REST SELECT/UPDATE/DELETE on this table is denied for everyone.
revoke all on table public.exam_records from public, anon, authenticated;
grant select on table public.exam_records to service_role; -- dashboard/API only

-- ----------------------------------------------------------------------------
-- 3. Atomic monthly certificate counter (keeps ACC-OCT2026-0001 format)
-- ----------------------------------------------------------------------------
create table if not exists public.certificate_counters (
  month_key   text primary key,
  last_number integer not null default 0,
  updated_at  timestamptz not null default now()
);

alter table public.certificate_counters enable row level security;
revoke all on table public.certificate_counters from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 4. Shared helpers
-- ----------------------------------------------------------------------------
-- Trim + collapse whitespace, hard-limit length; returns NULL for blank input.
create or replace function public.norm_text(p_value text, p_max integer)
returns text
language sql
immutable
as $$
  select nullif(
    left(regexp_replace(trim(coalesce(p_value, '')), '\s+', ' ', 'g'), greatest(coalesce(p_max, 120), 1)),
  '');
$$;

-- Allocate the next certificate id for a month, atomically.
-- Format: ACC-<MON><YYYY>-<n>  (n is zero-padded to >= 4 digits), e.g. ACC-OCT2026-0001
create or replace function public.next_certificate_id(p_month_key text)
returns text
language plpgsql
as $$
declare
  v_number integer;
begin
  insert into public.certificate_counters (month_key, last_number)
  values (p_month_key, 1)
  on conflict (month_key)
  do update set last_number = public.certificate_counters.last_number + 1,
                updated_at  = now()
  returning last_number into v_number;

  return 'ACC-' || p_month_key || '-' || lpad(v_number::text, 4, '0');
end;
$$;

revoke all on function public.next_certificate_id(text) from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- 5. RPC: submit a completed (PASS or FAIL) examination — idempotent
-- ----------------------------------------------------------------------------
-- Guards enforced inside:
--   * attempt_status is always 'submitted'; result must be PASS or FAIL
--   * one row per attempt_id (second call returns the existing row)
--   * certificate_id is allocated here, atomically, exactly once per attempt
--   * a terminated attempt can never be upgraded to submitted
create or replace function public.submit_exam_record(
  p_attempt_id         text,
  p_candidate_name     text,
  p_class_name         text,
  p_paper_id           text,
  p_exam_title         text,
  p_result_status      text,
  p_marks_obtained     numeric default null,
  p_max_marks          numeric default null,
  p_percentage         numeric default null,
  p_grade              text    default null,
  p_school_name        text    default null,
  p_subject            text    default 'Accountancy',
  p_started_at         timestamptz default null,
  p_time_taken_seconds integer   default null,
  p_verification_status text    default 'client_reported'
)
returns table (attempt_id text, certificate_id text, already_registered boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing   public.exam_records%rowtype;
  v_cert       text;
  v_month_key  text;
  v_started    timestamptz;
begin
  -- ---- validate ----------------------------------------------------------
  p_attempt_id      := nullif(regexp_replace(trim(coalesce(p_attempt_id, '')), '\s+', '', 'g'), '');
  p_candidate_name  := left(public.norm_text(p_candidate_name, 120), 120);
  p_school_name     := left(public.norm_text(p_school_name, 160), 160);
  p_grade           := left(public.norm_text(p_grade, 20), 20);
  p_exam_title      := left(public.norm_text(p_exam_title, 160), 160);
  p_paper_id        := left(public.norm_text(p_paper_id, 80), 80);
  p_class_name      := left(public.norm_text(p_class_name, 20), 20);
  p_subject         := left(public.norm_text(p_subject, 60), 60);
  p_result_status   := upper(regexp_replace(trim(coalesce(p_result_status, '')), '\s+', '', 'g'));
  p_verification_status := coalesce(nullif(trim(p_verification_status), ''), 'client_reported');

  if p_attempt_id is null or length(p_attempt_id) < 8 or length(p_attempt_id) > 100 then
    raise exception 'INVALID_ATTEMPT_ID';
  end if;
  if p_candidate_name is null then
    raise exception 'INVALID_CANDIDATE_NAME';
  end if;
  if p_class_name not in ('Class 11', 'Class 12') then
    raise exception 'INVALID_CLASS_NAME';
  end if;
  if p_subject is distinct from 'Accountancy' then
    raise exception 'INVALID_SUBJECT';
  end if;
  if p_paper_id is null or p_exam_title is null then
    raise exception 'INVALID_PAPER';
  end if;
  if p_result_status not in ('PASS', 'FAIL') then
    raise exception 'INVALID_RESULT_STATUS';
  end if;
  if p_verification_status not in ('client_reported', 'server_verified') then
    raise exception 'INVALID_VERIFICATION_STATUS';
  end if;
  if p_max_marks is not null and p_max_marks <= 0 then
    raise exception 'INVALID_MAX_MARKS';
  end if;
  if p_marks_obtained is not null and p_max_marks is not null and p_marks_obtained > p_max_marks then
    raise exception 'MARKS_EXCEED_MAX';
  end if;
  if p_percentage is not null and (p_percentage < 0 or p_percentage > 100) then
    raise exception 'INVALID_PERCENTAGE';
  end if;

  v_started := coalesce(p_started_at, now());

  -- ---- idempotency: same attempt submitted again? -------------------------
  select * into v_existing from public.exam_records
    where exam_records.attempt_id = p_attempt_id
    for update;

  if found then
    if v_existing.attempt_status = 'terminated' then
      -- A terminated attempt must never become a submitted certificate record.
      return query select v_existing.attempt_id, v_existing.certificate_id, true;
      return;
    end if;
    -- Already submitted: return the SAME certificate id; do not issue another.
    return query select v_existing.attempt_id, v_existing.certificate_id, true;
    return;
  end if;

  -- ---- allocate certificate id (atomic, one per attempt) ------------------
  v_month_key := upper(to_char(v_started, 'MONYYYY'));
  v_cert := public.next_certificate_id(v_month_key);

  insert into public.exam_records (
    attempt_id, certificate_id, attempt_status, result_status,
    candidate_name, school_name, class_name, subject, paper_id, exam_title,
    marks_obtained, max_marks, percentage, grade,
    started_at, finished_at, time_taken_seconds, verification_status
  ) values (
    p_attempt_id, v_cert, 'submitted', p_result_status,
    p_candidate_name, p_school_name, p_class_name, p_subject, p_paper_id, p_exam_title,
    p_marks_obtained, p_max_marks, p_percentage, p_grade,
    v_started, now(), p_time_taken_seconds, p_verification_status
  )
  on conflict (attempt_id) do nothing
  returning exam_records.attempt_id, exam_records.certificate_id, false
    into attempt_id, certificate_id, already_registered;

  -- If the conflicting insert lost a race, return the winner's row instead.
  if attempt_id is null then
    return query
      select er.attempt_id, er.certificate_id, true
        from public.exam_records er
       where er.attempt_id = p_attempt_id;
    return;
  end if;

  return next;
end;
$$;

-- ----------------------------------------------------------------------------
-- 6. RPC: record a security-terminated attempt — idempotent
-- ----------------------------------------------------------------------------
-- "First final state wins":
--   * if the attempt was already submitted, the termination is NOT stored
--     (the submission won the race) and existing_certificate stays true;
--   * if the attempt is already terminated, nothing changes;
--   * otherwise a terminated row is stored with certificate_id = NULL.
create or replace function public.record_terminated_attempt(
  p_attempt_id         text,
  p_candidate_name     text,
  p_class_name         text,
  p_paper_id           text,
  p_exam_title         text,
  p_termination_reason text,
  p_security_event_code text default null,
  p_school_name        text default null,
  p_subject            text default 'Accountancy',
  p_started_at         timestamptz default null,
  p_time_taken_seconds integer   default null
)
returns table (attempt_id text, stored boolean, already_submitted boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.exam_records%rowtype;
begin
  p_attempt_id         := nullif(regexp_replace(trim(coalesce(p_attempt_id, '')), '\s+', '', 'g'), '');
  p_candidate_name     := left(public.norm_text(p_candidate_name, 120), 120);
  p_school_name        := left(public.norm_text(p_school_name, 160), 160);
  p_exam_title         := left(public.norm_text(p_exam_title, 160), 160);
  p_paper_id           := left(public.norm_text(p_paper_id, 80), 80);
  p_class_name         := left(public.norm_text(p_class_name, 20), 20);
  p_subject            := left(public.norm_text(p_subject, 60), 60);
  p_termination_reason := left(public.norm_text(p_termination_reason, 300), 300);
  p_security_event_code:= left(public.norm_text(p_security_event_code, 80), 80);

  if p_attempt_id is null or length(p_attempt_id) < 8 or length(p_attempt_id) > 100 then
    raise exception 'INVALID_ATTEMPT_ID';
  end if;
  if p_termination_reason is null then
    raise exception 'INVALID_TERMINATION_REASON';
  end if;
  if p_class_name is not null and p_class_name not in ('Class 11', 'Class 12') then
    p_class_name := null;
  end if;

  select * into v_existing from public.exam_records
    where exam_records.attempt_id = p_attempt_id
    for update;

  if found then
    if v_existing.attempt_status = 'submitted' then
      -- Submission already completed this attempt: keep it, skip termination.
      return query select v_existing.attempt_id, false, true;
      return;
    end if;
    return query select v_existing.attempt_id, true, false;
    return;
  end if;

  insert into public.exam_records (
    attempt_id, certificate_id, attempt_status, result_status,
    candidate_name, school_name, class_name, subject, paper_id, exam_title,
    started_at, finished_at, time_taken_seconds,
    termination_reason, security_event_code, verification_status
  ) values (
    p_attempt_id, null, 'terminated', null,
    nullif(p_candidate_name, ''), nullif(p_school_name, ''),
    nullif(p_class_name, ''), p_subject,
    nullif(p_paper_id, 'unknown'), nullif(p_exam_title, 'Accountancy Examination'),
    coalesce(p_started_at, now()), now(), p_time_taken_seconds,
    p_termination_reason, p_security_event_code, 'client_reported'
  )
  on conflict (attempt_id) do nothing
  returning exam_records.attempt_id into attempt_id;

  if attempt_id is null then
    -- Lost a concurrent race: report what the winner stored.
    return query
      select er.attempt_id,
             (er.attempt_status = 'terminated') as stored,
             (er.attempt_status = 'submitted')  as already_submitted
        from public.exam_records er
       where er.attempt_id = p_attempt_id;
    return;
  end if;

  stored := true;
  already_submitted := false;
  return next;
end;
$$;

-- ----------------------------------------------------------------------------
-- 7. Permissions on the RPCs
--    SECURITY DEFINER + fixed search_path; executable only by the roles the
--    website actually uses (anon = visitors without login, service_role for
--    admin/testing). Tables themselves stay unreadable/unwritable.
-- ----------------------------------------------------------------------------
revoke all on function public.submit_exam_record(text, text, text, text, text, text, numeric, numeric, numeric, text, text, text, timestamptz, integer, text) from public;
grant  execute on function public.submit_exam_record(text, text, text, text, text, text, numeric, numeric, numeric, text, text, text, timestamptz, integer, text) to anon, authenticated, service_role;

revoke all on function public.record_terminated_attempt(text, text, text, text, text, text, text, text, text, timestamptz, integer) from public;
grant  execute on function public.record_terminated_attempt(text, text, text, text, text, text, text, text, text, timestamptz, integer) to anon, authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 8. Hardening: a terminated record can never be flipped to submitted and a
--    submitted record can never lose its certificate or become terminated.
--    (Defense-in-depth on top of the RPC logic.)
-- ----------------------------------------------------------------------------
create or replace function public.exam_records_guard()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' then
    if old.attempt_status = 'terminated' then
      raise exception 'TERMINATED_ATTEMPT_IS_IMMUTABLE';
    end if;
    if old.attempt_status = 'submitted' then
      if new.attempt_status is distinct from 'submitted'
         or new.certificate_id is distinct from old.certificate_id then
        raise exception 'SUBMITTED_ATTEMPT_IS_IMMUTABLE';
      end if;
    end if;
  end if;
  if tg_op = 'DELETE' and old.attempt_status in ('submitted', 'terminated') then
    raise exception 'FINAL_RECORDS_CANNOT_BE_DELETED';
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists exam_records_guard on public.exam_records;
create trigger exam_records_guard
  before update or delete on public.exam_records
  for each row execute function public.exam_records_guard();

-- Done ------------------------------------------------------------------------
comment on table public.exam_records is
  'One final record per Accountancy By Abhinash exam attempt. Writes only via submit_exam_record()/record_terminated_attempt(). No public read access.';
comment on column public.exam_records.verification_status is
  'client_reported = result produced by browser-side grading; server_verified = confirmed by an authoritative server-side process.';
