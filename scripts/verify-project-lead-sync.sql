-- Transactional integration test: no fixture contacts survive this test.
begin;
do $$
declare first_report jsonb; second_report jsonb; probe_id uuid; actual_id uuid;
begin
  first_report := public.sync_project_leads('[{"company":"__sync_pipeline_probe__","contact_name":"Pipeline Probe","email":"probe@example.invalid","target_type_raw":"Target 1"}]','[]');
  select id into probe_id from project_contacts where company='__sync_pipeline_probe__';
  update project_contacts set do_not_contact=true, needs_research=true where id=probe_id;
  update contact_progress set status='connection_sent' where contact_id=probe_id;
  second_report := public.sync_project_leads('[{"company":"__sync_pipeline_probe__","contact_name":"Pipeline Probe","title":"Updated Title","email":""}]','[]');
  select id into actual_id from project_contacts where company='__sync_pipeline_probe__';
  if actual_id <> probe_id or (second_report->>'created_contacts')::int <> 0 then raise exception 'Duplicate import'; end if;
  if not exists(select 1 from project_contacts where id=probe_id and do_not_contact and needs_research and email='probe@example.invalid' and title='Updated Title') then raise exception 'Lost suppression or contact data'; end if;
  if not exists(select 1 from contact_progress where contact_id=probe_id and status='connection_sent') then raise exception 'Lost outreach history'; end if;
end $$;
select 'PASS: identity, suppression, blank-field preservation and outreach history' result;
rollback;
