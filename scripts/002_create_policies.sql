-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Issues policies - public read, authenticated users can create
CREATE POLICY "issues_select_all" ON public.issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "issues_insert_authenticated" ON public.issues FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "issues_update_own" ON public.issues FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));
CREATE POLICY "issues_delete_own" ON public.issues FOR DELETE USING (auth.uid() = user_id);

-- Issue votes policies
CREATE POLICY "votes_select_all" ON public.issue_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "votes_insert_own" ON public.issue_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "votes_delete_own" ON public.issue_votes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "comments_select_all" ON public.comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "comments_insert_authenticated" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_update_own" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "comments_delete_own" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Issue updates policies
CREATE POLICY "updates_select_all" ON public.issue_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "updates_insert_authenticated" ON public.issue_updates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_insert_system" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
