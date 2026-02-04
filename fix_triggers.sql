-- ============================================================================
-- SCRIPT TO CHECK AND REMOVE PROBLEMATIC TRIGGERS
-- ============================================================================
-- This script will help identify and remove any triggers causing the registration error

-- Step 1: Check all triggers on auth.users table
SELECT 
    trigger_schema,
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- Step 2: Check all functions that might be triggered
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname LIKE '%user%' 
  OR p.proname LIKE '%auth%'
ORDER BY n.nspname, p.proname;

-- Step 3: If you find a problematic trigger, uncomment and run this to remove it:
/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
*/

-- Step 4: Create a CORRECT trigger for patient auto-creation (optional)
/*
CREATE OR REPLACE FUNCTION public.handle_new_patient()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create patient record if this is a Google OAuth login (no password)
  -- and no auth_users record exists
  IF NOT EXISTS (
    SELECT 1 FROM public.auth_users WHERE email = NEW.email
  ) THEN
    INSERT INTO public.patients (
      patient_id,
      auth_user_id,
      full_name,
      phone
    ) VALUES (
      'PAT' || EXTRACT(EPOCH FROM NOW())::BIGINT || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5),
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'phone', '')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_patient
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_patient();
*/
