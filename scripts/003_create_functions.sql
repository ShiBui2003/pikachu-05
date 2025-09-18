-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
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

-- Function to update issue upvotes count
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
    SET upvotes = upvotes - 1 
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

-- Function to create notifications for issue updates
CREATE OR REPLACE FUNCTION public.create_issue_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Notify issue creator when status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, issue_id)
    VALUES (
      NEW.user_id,
      'Issue Status Updated',
      'Your issue "' || NEW.title || '" status changed to ' || NEW.status,
      'issue_update',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for issue notifications
DROP TRIGGER IF EXISTS issue_notification_trigger ON public.issues;
CREATE TRIGGER issue_notification_trigger
  AFTER UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.create_issue_notification();
