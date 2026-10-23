# Contact freshness policy

Google Sheet synchronization, job-posting age and contact employment verification
are three separate checks. A direct LinkedIn URL is a contact method, not proof of
current employment. Search providers can lag: this audit found that Clay did not
return two FleetPride executives whom the current official leadership page lists.
Missing provider results must never be interpreted as retirement.

As requested October 23, 2026, unverified contacts are held out of active outreach.
The database stores profile_validation_status, profile_verified_at,
profile_verification_source and profile_validation_note on every contact.
New and legacy contacts default to unverified; imported timestamps do not count.

## Release requirements

1. Match the person's identity and current employer using their direct profile
   and/or a current official company biography or authoritative filing.
2. Check exact role and scope, effective dates and any later departure announcement.
3. Record the evidence URL, check time, exact current title and a short explanation.
4. A person who remains at the company in a different role is role_changed and
   held until stakeholder fit and outreach drafts are reviewed for the new role.
5. For a reviewed current contact, set status=current and needs_research=false.
   Existing do_not_contact suppression must never be cleared automatically.

Current checks expire after 30 days. An hourly database job applies research holds;
the frontend checks expiry immediately too. Retired/departed contacts remain
do_not_contact with history retained. This does not delete their audit history.

The queue puts verification holds before overdue or scheduled follow-ups, regardless
of whether the contact was previously messaged. The lead panel disables outreach
controls and displays the evidence/check date. Verification holds remain inspectable
via the queue's Verification holds filter. Company-detail contact tiers also respect
the same freshness predicate. A sheet import cannot overwrite an audited title.

## Audit coverage and limitations

Initial source-backed checks covered FleetPride, Kuehne+Nagel, Vestis,
AAA Cooper, Fastenal, Alta and the identified departed/retired contacts at
Air Partner/Wheels Up and Crown. Evidence is in contact-profile-audit-2026-10-23.json.
Thomas Kelly and Gerard Gifford were suppressed as retired; Mark Briffa as departed.
Dan Florness was updated to strategic adviser and removed from CEO targeting, not
incorrectly labeled fully retired. The old Jeff Watts alias and Craig Brubaker's
old role duplicate are suppressed; canonical current records remain.

The full 1,608-row historical database has NOT been individually re-verified.
Immediately after the initial audit, 1,319 nonsuppressed rows were held for research;
this includes legacy placeholders, not 1,319 unique real people. Twelve checked rows
also have a direct profile or email. Do not market the entire database as current.

The 15-minute import and hourly expiry are automated. External employment research
is not automated: no reliable live profile-validation provider is configured. Apollo's
free plan does not permit API searches, and provider-only matches are insufficient
for a primary-source verification. Held rows remain held until actual evidence is
reviewed; no process stamps the remaining list verified without research.

## Validation

- node --test scripts/profile-validation.test.mjs scripts/project-lead-sync.test.mjs
- scripts/verify-profile-validation.sql: transactional checks of default holds,
  stale checks, departure suppression, and preserving audited titles through sync.
- npm run build

Operational audit query:

    select company,contact_name,title,profile_validation_status,profile_verified_at,
      profile_verification_source,profile_validation_note
    from project_contacts where not do_not_contact and needs_research
    order by priority,company,contact_name;
