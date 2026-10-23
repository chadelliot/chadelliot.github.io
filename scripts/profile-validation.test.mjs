import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// Bundle the actual production derivation, including its freshness predicate.
const root = fileURLToPath(new URL('../', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'profile-validation-'));
const bundle = join(dir, 'queue.mjs');
execFileSync(join(root,'node_modules/.bin/esbuild'),['src/lib/outreachQueue.ts','--bundle','--platform=node','--format=esm','--define:import.meta.env={}',`--outfile=${bundle}`],{cwd:root,stdio:'pipe'});
const { buildLeadRows, matchesFilter } = await import(pathToFileURL(bundle));
process.on('exit',()=>rmSync(dir,{recursive:true,force:true}));
const now = new Date('2026-10-23T16:00:00Z');
const base = {id:'probe',company:'Acme',company_id:'acme',contact_name:'Pat',email:'pat@example.invalid',needs_research:false,do_not_contact:false,profile_validation_status:'current',profile_verified_at:now.toISOString(),profile_verification_source:'https://example.com/leadership'};
function build(extra={}, progress={}) {
  return buildLeadRows({contacts:[{...base,...extra}],progress:{probe:{contact_id:'probe',status:'not_contacted',updated_at:now.toISOString(),...progress}},companies:[],signalsByCompanyId:{},meetingBlocks:{},followUpSupported:true,now})[0];
}
test('verified current contact can enter the action queue',()=>{
  assert.equal(build().urgency,'first_contact');assert.equal(matchesFilter(build(),'action'),true);
});
test('unverified, changed-role and expired contacts remain held even with overdue follow-ups',()=>{
  for(const extra of [{profile_validation_status:'unverified'},{profile_validation_status:'role_changed'},{profile_verified_at:'2026-09-22T16:00:00Z'},{profile_verification_source:null},{profile_verified_at:'2026-10-24T16:00:00Z'},{needs_research:true}]){
    const row=build(extra,{status:'introduction_sent',follow_up_at:'2026-10-01'});
    assert.equal(row.urgency,'needs_research');assert.equal(matchesFilter(row,'action'),false);
    assert.equal(matchesFilter(row,'needs_research'),true);
  }
});
test('suppressed contacts stay closed and no import age substitutes for verification',()=>{
  assert.equal(build({do_not_contact:true}).urgency,'closed');
  assert.equal(build({profile_validation_status:undefined,profile_verified_at:null}).urgency,'needs_research');
});
