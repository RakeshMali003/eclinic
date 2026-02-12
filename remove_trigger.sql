-- ============================================================================
-- SCRIPT TO REMOVE AUTH TRIGGER (DEBUGGING STEP)
-- ============================================================================

-- This script will remove the trigger that automatically creates a user profile.
-- Run this in Supabase SQL Editor to unblock login.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- After running this, try to "Sign in with Google".
-- If it works, the issue was definitely the trigger.
-- The application code has a fallback to create the user profile, so this is safe for now.
