-- Person/employer/role verification is independent of source sync and job age.
alter table public.project_contacts
  add column if not exists profile_validation_status text not null default 'unverified',
  add column if not exists profile_verified_at timestamptz,
  add column if not exists profile_verification_source text,
  add column if not exists profile_validation_note text;

alter table public.project_contacts add constraint project_contacts_profile_validation_status_check
  check (profile_validation_status in ('unverified','current','role_changed','departed','retired','needs_review','not_a_contact'));
alter table public.project_contacts add constraint project_contacts_profile_evidence_check
  check (profile_validation_status not in ('current','role_changed','departed','retired')
    or (profile_verified_at is not null and nullif(btrim(profile_verification_source),'') is not null));

create or replace function public.enforce_contact_profile_hold()
returns trigger language plpgsql security invoker set search_path=public as $$
begin
  if new.profile_validation_status in ('retired','departed','not_a_contact') then new.do_not_contact := true; end if;
  if new.profile_validation_status <> 'current' or new.profile_verified_at is null
     or new.profile_verified_at < now()-interval '30 days'
     or new.profile_verified_at > now()+interval '5 minutes' then new.needs_research := true; end if;
  return new;
end;
$$;
revoke all on function public.enforce_contact_profile_hold() from public,anon,authenticated;
create trigger enforce_contact_profile_hold before insert or update on public.project_contacts
for each row execute function public.enforce_contact_profile_hold();

-- Hold unverified profiles; neither scraping nor syncing is verification.
update public.project_contacts set needs_research=true
where profile_validation_status <> 'current' or profile_verified_at is null
   or profile_verified_at < now()-interval '30 days';

-- Expiration only: this does NOT perform a new external profile check.
select cron.schedule('expire-contact-profile-checks','17 * * * *',$job$
  update public.project_contacts set needs_research=true
  where not needs_research and (profile_validation_status <> 'current'
    or profile_verified_at is null or profile_verified_at < now()-interval '30 days');
$job$);
