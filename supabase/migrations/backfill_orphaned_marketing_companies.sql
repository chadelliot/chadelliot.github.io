-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Fixes: the RevHub-Marketing import (import_revhub_marketing_batch.sql)
-- wrote project_contacts (and company_signals) rows keyed by a company
-- NAME string, but never created the corresponding companies row or
-- backfilled company_id - so those rows exist in the database but are
-- invisible to the app, which groups everything by companies.id /
-- project_contacts.company_id. Confirmed via information_schema that
-- companies only requires name + normalized_name (normalized_name is
-- lower(trim(name)) - checked against 15 existing rows before writing this).
--
-- Idempotent: the insert only creates a company if one doesn't already
-- exist for that name (case/whitespace-insensitive), and both updates only
-- touch rows that currently have company_id = null, so re-running this is
-- always a safe no-op after the first successful run.

insert into public.companies (name, normalized_name)
select distinct pc.company, lower(trim(pc.company))
from public.project_contacts pc
where pc.company_id is null
  and pc.company is not null
  and not exists (
    select 1 from public.companies c where lower(trim(c.name)) = lower(trim(pc.company))
  );

update public.project_contacts pc
set company_id = c.id
from public.companies c
where pc.company_id is null
  and lower(trim(c.name)) = lower(trim(pc.company));

update public.company_signals cs
set company_id = c.id
from public.companies c
where cs.company_id is null
  and lower(trim(c.name)) = lower(trim(cs.company));

-- Sanity check - should return 0 rows once this has run successfully.
select count(*) as still_orphaned_contacts
from public.project_contacts
where company_id is null;
