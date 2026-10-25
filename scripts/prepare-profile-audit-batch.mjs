// Produce a bounded, reviewable SQL batch from researched evidence JSON.
// This command never connects to or writes a database.
import { readFileSync } from 'node:fs';
const [source, startText='0', sizeText='100'] = process.argv.slice(2);
if (!source) throw new Error('Usage: node scripts/prepare-profile-audit-batch.mjs evidence.json [offset] [size]');
const rows=JSON.parse(readFileSync(source,'utf8'));
const offset=Number(startText), size=Number(sizeText);
if (!Array.isArray(rows) || !Number.isInteger(offset) || offset<0 || !Number.isInteger(size) || size<1 || size>150) throw new Error('Invalid batch');
const allowed=new Set(['current','role_changed','retired','departed','needs_review','not_a_contact']);
const ids=new Set();
const records=rows.slice(offset,offset+size).map(row=>{
  if (!/^[0-9a-f-]{36}$/.test(row.id) || ids.has(row.id) || !allowed.has(row.action) || !row.company || !row.note || typeof row.release!=='boolean') throw new Error(`Invalid or duplicate audit record: ${row.id}`);
  ids.add(row.id);
  if (['current','role_changed','retired','departed'].includes(row.action) && !/^https:\/\//.test(row.evidence_url||'')) throw new Error(`Source evidence required for ${row.id}`);
  if (row.release && row.action!=='current') throw new Error(`Only a reviewed current role can be released: ${row.id}`);
  if (row.action==='current' && !row.current_title) throw new Error(`Missing verified title: ${row.id}`);
  for (const key of ['intro_message','outreach_angle','linkedin_connect_message','follow_up_message','email_intro_message']) {
    if (row[key] !== undefined && (typeof row[key] !== 'string' || !row[key].trim())) throw new Error(`Invalid corrected ${key}: ${row.id}`);
  }
  return {id:row.id,company:row.company,name:row.name||null,action:row.action,current_title:row.current_title||null,evidence_url:row.evidence_url||null,note:row.note,release:row.release,intro_message:row.intro_message||null,outreach_angle:row.outreach_angle||null,linkedin_connect_message:row.linkedin_connect_message||null,follow_up_message:row.follow_up_message||null,email_intro_message:row.email_intro_message||null};
});
if (!records.length) throw new Error('Empty batch');
const literal=JSON.stringify(records).replace(/'/g,"''");
process.stdout.write(`with evidence as (
  select * from jsonb_to_recordset('${literal}'::jsonb)
  as e(id uuid,company text,name text,action text,current_title text,evidence_url text,note text,release boolean,intro_message text,outreach_angle text,linkedin_connect_message text,follow_up_message text,email_intro_message text)
), changed as (
  update public.project_contacts p set
    title=case when e.action in ('current','role_changed') then coalesce(e.current_title,p.title) else p.title end,
    intro_message=coalesce(e.intro_message,p.intro_message),
    outreach_angle=coalesce(e.outreach_angle,p.outreach_angle),
    linkedin_connect_message=coalesce(e.linkedin_connect_message,p.linkedin_connect_message),
    follow_up_message=coalesce(e.follow_up_message,p.follow_up_message),
    email_intro_message=coalesce(e.email_intro_message,p.email_intro_message),
    profile_validation_status=e.action,
    profile_verified_at=now(),profile_verification_source=e.evidence_url,
    profile_validation_note='2026-10-24 audit: '||e.note,
    needs_research=not(e.action='current' and e.release and
      (coalesce(p.email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$',false) or coalesce(p.linkedin_url ~* '^https://([a-z]+[.])?linkedin[.]com/in/[^/?[:space:]]+',false))),
    do_not_contact=p.do_not_contact or e.action in ('retired','departed','not_a_contact')
  from evidence e where p.id=e.id and p.company=e.company
    and p.contact_name is not distinct from e.name and not p.do_not_contact
  returning p.id,p.profile_validation_status,p.do_not_contact,p.needs_research
)
select count(*) as updated,
 count(*) filter(where not do_not_contact and not needs_research) as released,
 count(*) filter(where do_not_contact) as suppressed,
 count(*) filter(where not do_not_contact and needs_research) as reviewed_still_held
from changed;\n`);
