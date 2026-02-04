-- ============================================================================
-- SCRIPT TO FIX ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- The 406 and 400 errors suggest RLS is blocking inserts/selects

-- Step 1: Check current RLS status on patients table
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'patients';

-- Step 2: Check existing policies on patients table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'patients';

-- Step 3: DISABLE RLS temporarily to test (ONLY FOR DEVELOPMENT)
-- Uncomment to disable RLS:
/*
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
*/

-- Step 4: OR create proper RLS policies (RECOMMENDED FOR PRODUCTION)
-- Uncomment to create proper policies:
/*
-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.patients;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.patients;
DROP POLICY IF EXISTS "Enable update for users based on auth_user_id" ON public.patients;

-- Enable RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own patient record
CREATE POLICY "Enable insert for authenticated users" 
ON public.patients 
FOR INSERT 
TO authenticated 
WITH CHECK (auth_user_id = auth.uid());

-- Allow users to read their own patient data
CREATE POLICY "Enable read for own data" 
ON public.patients 
FOR SELECT 
TO authenticated 
USING (auth_user_id = auth.uid());

-- Allow users to update their own patient data
CREATE POLICY "Enable update for own data" 
ON public.patients 
FOR UPDATE 
TO authenticated 
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- Similar policies for auth_users table
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for authenticated users" 
ON public.auth_users 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" 
ON public.auth_users 
FOR SELECT 
TO authenticated 
USING (true);

-- Policies for clinics table
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" 
ON public.clinics 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Policies for doctors table
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for authenticated users" 
ON public.doctors 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);
*/

-- Step 5: For DEVELOPMENT ONLY - Disable RLS on all tables
-- UNCOMMENT THIS BLOCK TO QUICKLY FIX THE ISSUE:
/*
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
*/
