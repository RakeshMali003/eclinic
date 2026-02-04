-- ============================================================================
-- SCRIPT TO LIST ALL TRIGGERS ON AUTH.USERS (DEBUGGING STEP)
-- ============================================================================

SELECT 
    trigger_schema,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- Please RUN this script in Supabase SQL Editor.
-- The results will show us what triggers are still active.
