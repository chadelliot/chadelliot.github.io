-- Run this after add_email_sequence_fields.sql if the new email_* columns
-- show data in Table Editor but the app still doesn't see them.
--
-- PostgREST (the API layer the app talks to) caches the table schema and
-- doesn't auto-detect columns added via ALTER TABLE through the SQL editor.
-- This tells it to reload immediately instead of waiting for its own
-- periodic refresh.
notify pgrst, 'reload schema';
