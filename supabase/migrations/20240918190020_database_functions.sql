-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update issue upvotes
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

-- Trigger for upvotes count
DROP TRIGGER IF EXISTS update_upvotes_trigger ON public.issue_votes;
CREATE TRIGGER update_upvotes_trigger
AFTER INSERT OR DELETE ON public.issue_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_issue_upvotes();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create update triggers for all tables with updated_at
CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_issues_modtime
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_comments_modtime
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();
