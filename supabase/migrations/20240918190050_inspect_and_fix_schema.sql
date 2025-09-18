-- First, check the current structure of the issues table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'issues' AND table_schema = 'public';

-- Check for existing constraints
SELECT conname, conrelid::regclass, confrelid::regclass, conkey, confkey
FROM pg_constraint
WHERE conrelid = 'public.issues'::regclass;

-- Drop and recreate the issues table with proper constraints
BEGIN;
  -- Create a backup of the existing data
  CREATE TEMP TABLE issues_backup AS SELECT * FROM public.issues;
  
  -- Drop dependent objects
  DROP TRIGGER IF EXISTS update_issues_modtime ON public.issues;
  DROP TRIGGER IF EXISTS update_upvotes_trigger ON public.issue_votes;
  
  -- Drop the table and recreate it with proper constraints
  DROP TABLE IF EXISTS public.issues CASCADE;
  
  CREATE TABLE public.issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'submitted',
    location_address TEXT,
    location_lat DECIMAL,
    location_lng DECIMAL,
    image_url TEXT,
    user_id UUID NOT NULL,
    assigned_to UUID,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Explicitly name the constraints
    CONSTRAINT issues_user_id_fkey 
      FOREIGN KEY (user_id) 
      REFERENCES auth.users(id) 
      ON DELETE CASCADE,
      
    CONSTRAINT issues_assigned_to_fkey 
      FOREIGN KEY (assigned_to) 
      REFERENCES auth.users(id) 
      ON DELETE SET NULL
  );
  
  -- Restore the data
  INSERT INTO public.issues
  SELECT * FROM issues_backup
  WHERE user_id IN (SELECT id FROM auth.users);
  
  -- Recreate the triggers
  CREATE TRIGGER update_issues_modtime
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();
  
  CREATE TRIGGER update_upvotes_trigger
  AFTER INSERT OR DELETE ON public.issue_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_issue_upvotes();
  
  -- Drop the backup
  DROP TABLE issues_backup;
COMMIT;

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
