-- Drop existing foreign key constraints if they exist
ALTER TABLE IF EXISTS public.issues 
  DROP CONSTRAINT IF EXISTS issues_user_id_fkey;

ALTER TABLE IF EXISTS public.issues 
  DROP CONSTRAINT IF EXISTS issues_assigned_to_fkey;

-- Recreate foreign key constraints with proper references
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

-- Update the RLS policies to ensure they're properly set
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Recreate the trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the update trigger for issues
DROP TRIGGER IF EXISTS update_issues_modtime ON public.issues;
CREATE TRIGGER update_issues_modtime
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Ensure the function for updating upvotes exists
CREATE OR REPLACE FUNCTION public.update_issue_upvotes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.issues 
    SET upvotes = upvotes + 1 
    WHERE id = NEW.issue_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.issues 
    SET upvotes = GREATEST(0, upvotes - 1) 
    WHERE id = OLD.issue_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;
