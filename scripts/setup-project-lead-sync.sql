-- Apply as a Supabase migration. Only the server service role can import.
create table if not exists public.project_lead_sync_runs (
  id bigint generated always as identity primary key,
  completed_at timestamptz not null default now(),
  report jsonb not null
);
alter table public.project_lead_sync_runs enable row level security;
revoke all on public.project_lead_sync_runs from anon, authenticated;
grant all on public.project_lead_sync_runs to service_role;
grant usage, select on sequence public.project_lead_sync_runs_id_seq to service_role;

create or replace function public.sync_project_leads(contacts jsonb, signals jsonb)
returns jsonb language plpgsql security invoker set search_path = public
as $$
declare
  item jsonb; company_uuid uuid; contact_uuid uuid; existing public.project_contacts;
  merged public.project_contacts; created_count integer := 0; updated_count integer := 0;
  report jsonb;
begin
  -- Serializes retries and overlapping scheduled/manual imports.
  perform pg_advisory_xact_lock(873120523);
  if jsonb_typeof(contacts) <> 'array' or jsonb_array_length(contacts) = 0
     or jsonb_typeof(signals) <> 'array' then raise exception 'Invalid source payload'; end if;
  for item in select value from jsonb_array_elements(contacts || signals) loop
    if nullif(btrim(item->>'company'), '') is null then raise exception 'Missing company'; end if;
    select id into company_uuid from public.companies
      where normalized_name = lower(btrim(item->>'company')) or lower(btrim(name)) = lower(btrim(item->>'company'))
      order by created_at, id limit 1;
    if company_uuid is null then
      insert into public.companies(name, normalized_name)
      values (btrim(item->>'company'), lower(btrim(item->>'company')))
      returning id into company_uuid;
    end if;
  end loop;
  for item in select value from jsonb_array_elements(contacts) loop
    if nullif(btrim(item->>'contact_name'), '') is null then raise exception 'Missing contact name'; end if;
    select id into company_uuid from public.companies
      where normalized_name = lower(btrim(item->>'company')) or lower(btrim(name)) = lower(btrim(item->>'company'))
      order by created_at, id limit 1;
    select * into existing from public.project_contacts
      where lower(btrim(contact_name)) = lower(btrim(item->>'contact_name'))
      and (company_id = company_uuid or lower(btrim(company)) = lower(btrim(item->>'company'))
        or (item->>'linkedin_url' is not null and
          regexp_replace(lower(linkedin_url), '/+$', '') = regexp_replace(lower(item->>'linkedin_url'), '/+$', '')))
      order by do_not_contact, created_at, id limit 1;
    contact_uuid := existing.id;
    -- Company renames/acquisitions can leave two names in the workbook.
    -- Keep the existing canonical company and the person's outreach history.
    if contact_uuid is not null and existing.company_id is not null then
      company_uuid := existing.company_id;
      item := item || jsonb_build_object('company',existing.company);
    end if;
    -- Allowlist source-owned fields; never touch assignments, progress, meetings,
    -- suppression flags, or fields that are blank/missing in the sheet.
    select jsonb_object_agg(key,value) into item from jsonb_each(item)
    where key = any(array['company','contact_name','title','industry','sector','priority','linkedin_url','email',
      'target_type_raw','outreach_angle','value_hypothesis','stakeholder_selection_reason',
      'linkedin_connect_message','intro_message','follow_up_message','email_subject',
      'email_intro_message','email_follow_up_1','email_follow_up_2','email_assumption_notice'])
      and value <> 'null'::jsonb and value <> '""'::jsonb;
    if contact_uuid is null then
      existing := null;
      merged := jsonb_populate_record(existing, item);
      insert into public.project_contacts(company,company_id,contact_name,title,industry,sector,priority,
        linkedin_url,email,target_type_raw,outreach_angle,value_hypothesis,stakeholder_selection_reason,
        linkedin_connect_message,intro_message,follow_up_message,email_subject,email_intro_message,
        email_follow_up_1,email_follow_up_2,email_assumption_notice,needs_research,do_not_contact)
      values(merged.company,company_uuid,merged.contact_name,merged.title,merged.industry,merged.sector,merged.priority,
        merged.linkedin_url,merged.email,merged.target_type_raw,merged.outreach_angle,merged.value_hypothesis,merged.stakeholder_selection_reason,
        merged.linkedin_connect_message,merged.intro_message,merged.follow_up_message,merged.email_subject,merged.email_intro_message,
        merged.email_follow_up_1,merged.email_follow_up_2,merged.email_assumption_notice,
        merged.linkedin_url is null and merged.email is null,false);
      created_count := created_count + 1;
    else
      merged := jsonb_populate_record(existing, item);
      if (to_jsonb(existing) || jsonb_build_object('company_id',company_uuid) || item) is distinct from to_jsonb(existing) then
        update public.project_contacts set company_id=company_uuid,
          company=merged.company, contact_name=merged.contact_name,title=merged.title,industry=merged.industry,sector=merged.sector,
          priority=merged.priority,linkedin_url=merged.linkedin_url,email=merged.email,target_type_raw=merged.target_type_raw,
          outreach_angle=merged.outreach_angle,value_hypothesis=merged.value_hypothesis,stakeholder_selection_reason=merged.stakeholder_selection_reason,
          linkedin_connect_message=merged.linkedin_connect_message,intro_message=merged.intro_message,follow_up_message=merged.follow_up_message,
          email_subject=merged.email_subject,email_intro_message=merged.email_intro_message,email_follow_up_1=merged.email_follow_up_1,
          email_follow_up_2=merged.email_follow_up_2,email_assumption_notice=merged.email_assumption_notice
        where id=contact_uuid;
        updated_count := updated_count + 1;
      end if;
    end if;
  end loop;
  for item in select value from jsonb_array_elements(signals) loop
    select id into company_uuid from public.companies where normalized_name=lower(btrim(item->>'company')) or lower(btrim(name))=lower(btrim(item->>'company')) order by created_at,id limit 1;
    insert into public.company_signals(company,company_id,role_title,posted_date,source_url,notes,lead_origin,opportunity_type,engagement_details,raw_lead_origin,raw_opportunity_type)
    values(item->>'company',company_uuid,item->>'role_title',(item->>'posted_date')::date,item->>'source_url',item->>'notes',item->>'lead_origin',item->>'opportunity_type',item->>'engagement_details',item->>'lead_origin',item->>'opportunity_type')
    on conflict(company,role_title,posted_date,source_url) do update set
      company_id=excluded.company_id,notes=excluded.notes,lead_origin=excluded.lead_origin,
      opportunity_type=excluded.opportunity_type,engagement_details=excluded.engagement_details;
  end loop;
  report := jsonb_build_object('source_contacts',jsonb_array_length(contacts),'source_signals',jsonb_array_length(signals),
    'created_contacts',created_count,'updated_contacts',updated_count);
  insert into public.project_lead_sync_runs(report) values(report);
  return report;
end;
$$;
revoke all on function public.sync_project_leads(jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.sync_project_leads(jsonb,jsonb) to service_role;
