-- ============================================================================
-- UPDATE: ADD INSERT POLICY
-- If the Trigger fails or you are an existing user, the Client App tries to 
-- create the user row directly. This requires an INSERT policy.
-- ============================================================================

-- Allow users to insert their *own* profile row (id must match auth.uid)
CREATE POLICY "Users can insert own profile" 
  ON public.users FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- VERIFICATION STEPS (FOR YOU TO DO MANUALLY)
-- ============================================================================
-- 1. Go to "Authentication" -> "Users" in Supabase Dashboard.
-- 2. DELETE your specific user (the one you are testing with).
--    (Why? Because the "Trigger" only fires when a *NEW* user is created.
--     If you are already in the Auth list, the trigger won't run again.)
-- 3. Run this SQL script.
-- 4. Go back to your App and "Login with Google" again.
-- 5. It should now appear in the 'public.users' table.
