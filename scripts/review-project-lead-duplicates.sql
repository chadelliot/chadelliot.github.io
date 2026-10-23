-- Read-only preview of duplicates created by the initial import, across aliases.
-- Cleanup requires approval: retain the older contact and all its progress;
-- mark only these new, never-contacted duplicate rows do_not_contact=true.
select n.id, n.company, n.contact_name, n.created_at,
  (select o.id from public.project_contacts o
   where o.created_at < '2026-10-23T06:19:00Z'
     and lower(o.contact_name)=lower(n.contact_name)
     and regexp_replace(lower(o.linkedin_url),'/+$','')=regexp_replace(lower(n.linkedin_url),'/+$','')
   order by o.do_not_contact,o.created_at,o.id limit 1) retained_contact_id
from public.project_contacts n
where n.created_at >= '2026-10-23T06:19:00Z' and n.created_at < '2026-10-23T06:21:00Z'
  and exists(select 1 from public.project_contacts o
    where o.created_at < '2026-10-23T06:19:00Z' and lower(o.contact_name)=lower(n.contact_name)
      and regexp_replace(lower(o.linkedin_url),'/+$','')=regexp_replace(lower(n.linkedin_url),'/+$',''))
  and not exists(select 1 from public.contact_progress p where p.contact_id=n.id and p.status <> 'not_contacted')
order by n.company,n.contact_name;
