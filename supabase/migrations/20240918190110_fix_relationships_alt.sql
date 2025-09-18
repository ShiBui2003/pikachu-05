-- First, let's check if we can access the auth schema
SELECT has_schema_privilege('auth', 'USAGE');

-- Check if we can query the auth.users table
SELECT has_table_privilege('auth.users', 'SELECT');

-- Create a new table that inherits from auth.users
-- This is a workaround for Supabase's RLS and schema visibility issues
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT id, email, created_at, updated_at
FROM auth.users;

-- Grant necessary permissions
GRANT SELECT ON public.user_profiles TO authenticated, anon;

-- Now create a new foreign key that references our view
ALTER TABLE public.issues 
  DROP CONSTRAINT IF EXISTS issues_user_id_fkey,
  ADD CONSTRAINT issues_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES public.user_profiles(id) 
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;

-- Also update the assigned_to foreign key
ALTER TABLE public.issues 
  DROP CONSTRAINT IF EXISTS issues_assigned_to_fkey,
  ADD CONSTRAINT issues_assigned_to_fkey 
  FOREIGN KEY (assigned_to) 
  REFERENCES public.user_profiles(id) 
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- Create a function to refresh the schema cache
CREATE OR REPLACE FUNCTION public.refresh_schema()
RETURNS void AS $$
BEGIN
  -- Refresh the PostgREST schema cache
  NOTIFY pgrst, 'reload schema';
  
  -- Refresh the Supabase API cache
  PERFORM
    pg_notify('supabase_realtime', 
      json_build_object(
        'event', 'SYSTEM',
        'action', 'REFRESH_SCHEMA_CACHE'
      )::text
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the refresh
SELECT public.refresh_schema();

-- Verify the constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM
  information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE
  tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'issues';
