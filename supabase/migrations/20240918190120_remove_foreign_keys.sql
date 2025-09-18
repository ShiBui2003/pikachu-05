-- Remove foreign key constraints
ALTER TABLE public.issues 
  DROP CONSTRAINT IF EXISTS issues_user_id_fkey,
  DROP CONSTRAINT IF EXISTS issues_assigned_to_fkey;

-- Create a function to check if a user exists
CREATE OR REPLACE FUNCTION public.user_exists(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to ensure data integrity
DROP POLICY IF EXISTS "Users can only create issues with their own user_id" ON public.issues;
CREATE POLICY "Users can only create issues with their own user_id"
ON public.issues
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND public.user_exists(user_id));

-- Update the update_issue_upvotes function to handle missing users
CREATE OR REPLACE FUNCTION public.update_issue_upvotes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only update if the user exists
    IF public.user_exists(NEW.user_id) THEN
      UPDATE public.issues 
      SET upvotes = upvotes + 1 
      WHERE id = NEW.issue_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Only update if the user exists
    IF public.user_exists(OLD.user_id) THEN
      UPDATE public.issues 
      SET upvotes = GREATEST(0, upvotes - 1) 
      WHERE id = OLD.issue_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
