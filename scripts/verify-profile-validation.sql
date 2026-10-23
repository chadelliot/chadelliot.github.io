begin;
do $$
declare probe_id uuid;
begin
  perform public.sync_project_leads('[{"company":"__profile_validation_probe__","contact_name":"Profile Test","title":"Scraped old role","email":"probe@example.invalid"}]','[]');
  select id into probe_id from public.project_contacts where company='__profile_validation_probe__';
  update public.project_contacts set needs_research=false where id=probe_id;
  if not exists(select 1 from public.project_contacts where id=probe_id and needs_research) then raise exception 'Unverified profile escaped hold'; end if;
  update public.project_contacts set profile_validation_status='current',profile_verified_at=now(),profile_verification_source='https://example.com/team',title='Verified new role',needs_research=false where id=probe_id;
  perform public.sync_project_leads('[{"company":"__profile_validation_probe__","contact_name":"Profile Test","title":"Scraped old role"}]','[]');
  if not exists(select 1 from public.project_contacts where id=probe_id and title='Verified new role' and not needs_research) then raise exception 'Sync replaced verified title or held fresh check'; end if;
  update public.project_contacts set profile_verified_at=now()-interval '31 days',needs_research=false where id=probe_id;
  if not exists(select 1 from public.project_contacts where id=probe_id and needs_research) then raise exception 'Expired check escaped hold'; end if;
  update public.project_contacts set profile_validation_status='departed',do_not_contact=false where id=probe_id;
  if not exists(select 1 from public.project_contacts where id=probe_id and do_not_contact) then raise exception 'Departed contact escaped suppression'; end if;
end $$;
select 'PASS: unverified/stale holds, departed suppression, and verified title protection' result;
rollback;
