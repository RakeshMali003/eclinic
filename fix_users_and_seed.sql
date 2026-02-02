-- ============================================================================
-- 1. FIX USERS TABLE
--    The code expects 'id' (UUID), but schema had 'user_id' (Integer).
--    We will recreate the table to match Supabase Auth standards.
-- ============================================================================

-- Drop existing table if it exists (WARNING: DELETES EXISTING USER DATA in public.users)
DROP TABLE IF EXISTS public.users CASCADE;

-- Create correct table
CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'patient', -- 'patient', 'doctor', 'clinic', 'admin'
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (Security Best Practice)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- ============================================================================
-- 2. AUTOMATIC TRIGGER FOR NEW USERS (Fixes Google Login Issue)
--    This ensures that whenever a user signs up (Google or Email),
--    a row is automatically created in public.users.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'patient') -- Default to patient if no role specified
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger (drop first to avoid errors if running multiple times)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================================
-- 3. SEED REFERENCE TABLES (As requested)
--    Populating common dropdown data if tables exist or creating them if useful.
-- ============================================================================

-- Ensure roles table exists and populate it
CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE
);

INSERT INTO public.roles (role_name) VALUES 
('patient'),
('doctor'),
('clinic'),
('admin'),
('reception'),
('nurse'),
('lab'),
('pharmacy')
ON CONFLICT (role_name) DO NOTHING;

-- Example: Common Specializations (Master List)
-- If you need a dropdown for specializations, it's good to have a master table.
CREATE TABLE IF NOT EXISTS public.specializations_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);

INSERT INTO public.specializations_master (name) VALUES 
('General Physician'),
('Cardiologist'),
('Dermatologist'),
('Pediatrician'),
('Gynecologist'),
('Neurologist'),
('Orthopedic Surgeon'),
('Psychiatrist'),
('Dentist'),
('ENT Specialist')
ON CONFLICT (name) DO NOTHING;

-- Example: Common Languages
CREATE TABLE IF NOT EXISTS public.languages_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

INSERT INTO public.languages_master (name) VALUES 
('English'),
('Hindi'),
('Spanish'),
('French'),
('German'),
('Mandarin'),
('Arabic')
ON CONFLICT (name) DO NOTHING;
