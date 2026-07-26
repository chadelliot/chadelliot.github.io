-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run
-- Moves batch assignment ranking server-side so it can balance a rep's
-- batch evenly across lead-type categories ("Fractional", "Contract",
-- "Cold Outreach", etc.) without ever exposing canonical_lead_type to a
-- Member's session. That field is intentionally REVOKEd at the column
-- level from everyone but owners (see leadtype_phase1_foundation.sql) -
-- previously the client ranked companies using only has-a-signal + best
-- contact priority, which a Member's session can see, but that meant one
-- category could dominate an entire batch. This function reads the
-- owner-only signal fields internally (as the table owner, via SECURITY
-- DEFINER) purely to round-robin the ranking, and returns only company
-- ids - the category itself never leaves the database.

create or replace function public.assign_next_company_batch(p_rep_id uuid, p_batch_size int default 25)
returns table(company_id uuid)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with candidates as (
    select
      c.id,
      exists (select 1 from company_signals cs where cs.company_id = c.id) as has_signal,
      coalesce((
        select cs.opportunity_type from company_signals cs
        where cs.company_id = c.id and cs.opportunity_type is not null
        order by cs.posted_date desc nulls last
        limit 1
      ), 'Cold Outreach') as category,
      (
        select min(case pc.priority
          when 'A' then 0 when 'A/B' then 1 when 'B' then 2 when 'C' then 3 when 'D' then 4 else 6 end)
        from project_contacts pc where pc.company_id = c.id
      ) as best_priority,
      c.name
    from companies c
    where c.assigned_rep is null and c.company_stage = 'new_signal'
  ),
  ranked as (
    select
      cand.id,
      cand.has_signal,
      cand.best_priority,
      cand.name,
      -- 1st-best company in each category gets rank 1, 2nd-best gets rank
      -- 2, etc. Ordering primarily by this (rather than raw priority)
      -- across the whole candidate pool is what spreads the batch evenly
      -- across categories instead of letting one category's A-priority
      -- companies fill the entire batch before any other category gets a
      -- turn.
      row_number() over (
        partition by cand.category
        order by (cand.has_signal = false), cand.best_priority nulls last, cand.name
      ) as rank_in_category
    from candidates cand
  ),
  selected as (
    select id
    from ranked
    order by rank_in_category, (has_signal = false), best_priority nulls last, name
    limit p_batch_size
  )
  select s.id from selected s;

  update companies
    set assigned_rep = p_rep_id, updated_at = now()
    where id in (
      with candidates as (
        select
          c.id,
          exists (select 1 from company_signals cs where cs.company_id = c.id) as has_signal,
          coalesce((
            select cs.opportunity_type from company_signals cs
            where cs.company_id = c.id and cs.opportunity_type is not null
            order by cs.posted_date desc nulls last
            limit 1
          ), 'Cold Outreach') as category,
          (
            select min(case pc.priority
              when 'A' then 0 when 'A/B' then 1 when 'B' then 2 when 'C' then 3 when 'D' then 4 else 6 end)
            from project_contacts pc where pc.company_id = c.id
          ) as best_priority,
          c.name
        from companies c
        where c.assigned_rep is null and c.company_stage = 'new_signal'
      ),
      ranked as (
        select
          cand.id,
          cand.has_signal,
          cand.best_priority,
          cand.name,
          row_number() over (
            partition by cand.category
            order by (cand.has_signal = false), cand.best_priority nulls last, cand.name
          ) as rank_in_category
        from candidates cand
      )
      select id from ranked
      order by rank_in_category, (has_signal = false), best_priority nulls last, name
      limit p_batch_size
    );

  update contact_progress cp
    set assigned_to = p_rep_id
    from project_contacts pc
    where cp.contact_id = pc.id
      and pc.company_id in (select c.id from companies c where c.assigned_rep = p_rep_id)
      and pc.do_not_contact = false
      and cp.assigned_to is null;
end;
$$;

grant execute on function public.assign_next_company_batch(uuid, int) to authenticated;
