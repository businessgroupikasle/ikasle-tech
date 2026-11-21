-- Careers portal: applications, their documents and status history, plus the private bucket for documents.
--
-- Run once in the Supabase dashboard (SQL Editor → paste → Run), or with the Supabase CLI (`supabase db push`).
-- Safe to run again: everything is "if not exists" / "or replace".
--
-- Access model: the website's server talks to Supabase with the SECRET key (service_role), which bypasses RLS.
-- RLS is enabled with no policies and anon/authenticated privileges are revoked, so the publishable key and
-- signed-in users can never read applications or download documents.

-- ---------- Tables ----------

create table if not exists public.career_applications (
  id            uuid primary key default gen_random_uuid(),
  reference     text not null unique,
  job_slug      text not null,
  job_title     text not null,
  status        text not null default 'new'
                check (status in ('new', 'under_review', 'shortlisted', 'interview_scheduled', 'selected', 'rejected')),
  full_name     text not null,
  email         text not null,
  phone         text not null,
  data          jsonb not null,
  admin_notes   text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists career_applications_created_idx on public.career_applications (created_at desc);
create index if not exists career_applications_status_idx on public.career_applications (status);
create index if not exists career_applications_job_idx on public.career_applications (job_slug);

-- Document metadata; the files themselves live in the private "career-documents" Storage bucket.
create table if not exists public.career_application_files (
  id              uuid primary key,
  application_id  uuid references public.career_applications (id) on delete cascade,
  draft_id        uuid not null,
  kind            text not null check (kind in ('resume', 'portfolio', 'work_sample', 'supporting')),
  file_name       text not null,
  mime_type       text not null,
  size_bytes      integer not null,
  storage_path    text not null unique,
  created_at      timestamptz not null default now()
);
create index if not exists career_application_files_app_idx on public.career_application_files (application_id);
create index if not exists career_application_files_draft_idx on public.career_application_files (draft_id);
create index if not exists career_application_files_orphan_idx on public.career_application_files (created_at) where application_id is null;

create table if not exists public.career_status_history (
  id              bigint generated always as identity primary key,
  application_id  uuid not null references public.career_applications (id) on delete cascade,
  status          text not null,
  changed_at      timestamptz not null default now()
);
create index if not exists career_status_history_app_idx on public.career_status_history (application_id, changed_at);

-- ---------- Lock down ----------

alter table public.career_applications enable row level security;
alter table public.career_application_files enable row level security;
alter table public.career_status_history enable row level security;

revoke all on public.career_applications, public.career_application_files, public.career_status_history from anon, authenticated;

-- ---------- Functions (atomic operations called by the server) ----------

-- Saves an application, attaches its uploaded documents and records the "new" status in one transaction.
-- p_files: [{"id": "<uuid>", "kind": "resume"}, ...]. Every file must belong to p_draft_id, be unattached and
-- be of the stated kind, otherwise nothing is saved (error code 'P0001', message 'files_not_found').
create or replace function public.create_career_application(
  p_reference text,
  p_job_slug  text,
  p_job_title text,
  p_full_name text,
  p_email     text,
  p_phone     text,
  p_data      jsonb,
  p_draft_id  uuid,
  p_files     jsonb
)
returns table (id uuid, created_at timestamptz)
language plpgsql
set search_path = public
as $$
#variable_conflict use_column
declare
  v_id       uuid;
  v_created  timestamptz;
  v_expected integer := jsonb_array_length(coalesce(p_files, '[]'::jsonb));
  v_attached integer;
begin
  insert into career_applications (reference, job_slug, job_title, full_name, email, phone, data)
  values (p_reference, p_job_slug, p_job_title, p_full_name, p_email, p_phone, p_data)
  returning career_applications.id, career_applications.created_at into v_id, v_created;

  update career_application_files f
     set application_id = v_id
    from jsonb_to_recordset(coalesce(p_files, '[]'::jsonb)) as x(id uuid, kind text)
   where f.id = x.id and f.kind = x.kind and f.draft_id = p_draft_id and f.application_id is null;
  get diagnostics v_attached = row_count;

  if v_attached <> v_expected then
    raise exception 'files_not_found' using errcode = 'P0001';
  end if;

  insert into career_status_history (application_id, status) values (v_id, 'new');
  return query select v_id, v_created;
end;
$$;

-- Changes status and/or notes; a status change is added to the history. Returns false if the id doesn't exist.
create or replace function public.update_career_application(p_id uuid, p_status text, p_notes text)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  v_before text;
begin
  select status into v_before from career_applications where id = p_id for update;
  if not found then
    return false;
  end if;

  update career_applications
     set status = coalesce(p_status, status),
         admin_notes = coalesce(p_notes, admin_notes),
         updated_at = now()
   where id = p_id;

  if p_status is not null and p_status <> v_before then
    insert into career_status_history (application_id, status) values (p_id, p_status);
  end if;
  return true;
end;
$$;

-- Number of applications per status (dashboard tiles).
create or replace function public.career_status_counts()
returns table (status text, count bigint)
language sql
stable
set search_path = public
as $$
  select status, count(*) from career_applications group by status;
$$;

revoke execute on function public.create_career_application(text, text, text, text, text, text, jsonb, uuid, jsonb) from public, anon, authenticated;
revoke execute on function public.update_career_application(uuid, text, text) from public, anon, authenticated;
revoke execute on function public.career_status_counts() from public, anon, authenticated;
grant execute on function public.create_career_application(text, text, text, text, text, text, jsonb, uuid, jsonb) to service_role;
grant execute on function public.update_career_application(uuid, text, text) to service_role;
grant execute on function public.career_status_counts() to service_role;

-- ---------- Storage ----------

-- Private bucket for resumes, portfolios and work samples (4 MB per file; the server also checks file contents).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'career-documents',
  'career-documents',
  false,
  4194304,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/zip'
  ]
)
on conflict (id) do nothing;
