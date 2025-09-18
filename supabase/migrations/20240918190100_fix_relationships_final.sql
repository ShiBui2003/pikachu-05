-- First, check the current state of the issues table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'issues' AND table_schema = 'public';

-- Check for existing foreign keys
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

-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.issues 
  DROP CONSTRAINT IF EXISTS issues_user_id_fkey;

ALTER TABLE IF EXISTS public.issues 
  DROP CONSTRAINT IF EXISTS issues_assigned_to_fkey;

-- Recreate the foreign key constraints with explicit names and proper references
ALTER TABLE public.issues
  ADD CONSTRAINT issues_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.issues
  ADD CONSTRAINT issues_assigned_to_fkey 
  FOREIGN KEY (assigned_to) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- Create a function to refresh the schema cache
CREATE OR REPLACE FUNCTION public.refresh_schema_cache()
RETURNS void AS $$
BEGIN
  -- This will refresh the PostgREST schema cache
  NOTIFY pgrst, 'reload schema';
  
  -- Also refresh the Supabase API cache
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
SELECT public.refresh_schema_cache();

-- Verify the constraints are properly set up
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
