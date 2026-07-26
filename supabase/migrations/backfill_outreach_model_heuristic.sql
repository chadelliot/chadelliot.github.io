-- Presets company_signals.outreach_model for every signal that doesn't
-- already have one, based on keyword patterns in the signal's own
-- role_title/notes text (the research already captured when the signal was
-- ingested - see the CSV ingestion script). This is a rules-based backfill,
-- not fresh external research on each company - see the accompanying chat
-- reply for why that distinction matters and what to do if Chad wants a
-- deeper per-company pass instead.
--
-- Idempotent and non-destructive: only ever fills a null, never overwrites
-- a model someone (or a prior run of this same script) already set.
create or replace function public.preset_outreach_model()
returns trigger as $$
begin
  if new.outreach_model is not null then
    return new;
  end if;

  if new.role_title ~* 'backfill'
    or new.notes ~* '(backfill|replac(e|ing|ement)|departe|departure|left the company|exited|stepped down|vacated|former (vp|director|head|ceo|cfo|coo|cmo))'
  then
    new.outreach_model := 'replace';
  elsif new.role_title ~* '(interim|temporary|temp\b)'
    or new.notes ~* '(interim|temporary|while (we|they) search|gap coverage|maternity|leave of absence|bridge)'
  then
    new.outreach_model := 'bridge';
  elsif new.notes ~* '(newly created|new (role|function|team|position)|first[- ]ever|building out|build out|scaling|expanding (the |our )?team|new department)'
  then
    new.outreach_model := 'build';
  elsif new.notes ~* '(consolidat|combin(e|ing) (roles|functions)|restructur|streamlin|wear(ing)? multiple hats|do(ing)? more with less)'
  then
    new.outreach_model := 'consolidate';
  else
    new.outreach_model := 'augment';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists preset_outreach_model_trigger on public.company_signals;
create trigger preset_outreach_model_trigger
  before insert on public.company_signals
  for each row
  execute function public.preset_outreach_model();

-- One-time backfill for signals already in the table before this trigger
-- existed - same logic, applied directly rather than via the trigger.
update public.company_signals
set outreach_model = case
  -- Replace: something in the notes points to a departure/backfill - the
  -- role exists because someone specific left, not because of growth.
  when role_title ~* 'backfill'
    or notes ~* '(backfill|replac(e|ing|ement)|departe|departure|left the company|exited|stepped down|vacated|former (vp|director|head|ceo|cfo|coo|cmo))'
    then 'replace'

  -- Bridge: explicitly interim/temporary coverage while a permanent search
  -- runs, or a leave-of-absence gap - a fractional/interim engagement is
  -- the most literal fit for this language.
  when role_title ~* '(interim|temporary|temp\b)'
    or notes ~* '(interim|temporary|while (we|they) search|gap coverage|maternity|leave of absence|bridge)'
    then 'bridge'

  -- Build: net-new function or first hire in an area, not backfilling or
  -- augmenting an existing team.
  when notes ~* '(newly created|new (role|function|team|position)|first[- ]ever|building out|build out|scaling|expanding (the |our )?team|new department)'
    then 'build'

  -- Consolidate: merging roles/functions or restructuring toward doing more
  -- with fewer people - a cost/efficiency-driven reason to hire, not growth.
  when notes ~* '(consolidat|combin(e|ing) (roles|functions)|restructur|streamlin|wear(ing)? multiple hats|do(ing)? more with less)'
    then 'consolidate'

  -- Augment: the default when nothing more specific is mentioned - "we just
  -- need more capacity on an existing team" is the most common baseline
  -- reason a company posts a role, and the safest generic assumption to
  -- open a cold outreach message with when the notes don't say more.
  else 'augment'
end
where outreach_model is null;

notify pgrst, 'reload schema';
