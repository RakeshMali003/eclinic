-- ============================================================================
-- SCRIPT TO REMOVE ROGUE TRIGGER (FINAL FIX)
-- ============================================================================

-- Any existing triggers on auth.users can block signups if they fail.
-- We found 'trg_insert_user_related' which calls 'insert_user_related_tables()'.
-- This script removes them.

DROP TRIGGER IF EXISTS trg_insert_user_related ON auth.users;
DROP FUNCTION IF EXISTS public.insert_user_related_tables();
DROP FUNCTION IF EXISTS auth.insert_user_related_tables(); -- Check both schemas just in case

-- Re-enable our safe trigger from before (optional but good practice)
-- If you want to rely purely on the app, you don't strictly need the next lines,
-- but having a basic profile created on signup is usually good.
-- Uncomment the below if you want to restore the basic 'handle_new_user' logic:

/*
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role, is_active)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'patient'),
    TRUE
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.users.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(public.users.avatar_url, EXCLUDED.avatar_url),
    updated_at = now();
    
  RETURN new;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/
