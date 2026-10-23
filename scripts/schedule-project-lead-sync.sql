-- Requires the deployed Edge Function and matching project_lead_sync_token in Vault.
-- The token is provisioned separately; never commit its plaintext value.
select cron.schedule('sync-project-leads', '*/15 * * * *', $job$
  select net.http_post(
    url := 'https://lihuwskumlfgvaltvmpl.supabase.co/functions/v1/sync-project-leads',
    headers := jsonb_build_object('Content-Type','application/json','x-sync-token',
      (select decrypted_secret from vault.decrypted_secrets where name='project_lead_sync_token')),
    body := '{}'::jsonb,
    timeout_milliseconds := 120000
  );
$job$);
