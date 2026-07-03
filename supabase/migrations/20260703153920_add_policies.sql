CREATE POLICY "View own membership" ON trip_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Owners view all members" ON trip_members FOR SELECT
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Only owners can delete trips" ON trips FOR DELETE
  USING (created_by = auth.uid());

CREATE OR REPLACE FUNCTION public.can_access_trip(check_trip_id UUID)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_members 
    WHERE trip_id = check_trip_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.trips 
    WHERE id = check_trip_id AND created_by = auth.uid()
  );
$$;

CREATE POLICY "trips_select" ON trips FOR SELECT
  USING (public.can_access_trip(id));

CREATE POLICY "trips_update" ON trips FOR UPDATE
  USING (public.can_access_trip(id) AND (
    created_by = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.trip_members 
      WHERE trip_id = id AND user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  ));

CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can read avatars" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Members can read activities" ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_id = activities.trip_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "activities_edit_owner_or_editor" ON activities
FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.trips WHERE id = activities.trip_id AND created_by = auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_id = activities.trip_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'editor')
  )
);

CREATE POLICY "activities_delete_owner_or_editor" ON activities
FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.trips WHERE id = activities.trip_id AND created_by = auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_id = activities.trip_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'editor')
  )
);

CREATE POLICY "activities_insert_owner_or_editor" ON activities
FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM public.trips WHERE id = activities.trip_id AND created_by = auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM public.trip_members
    WHERE trip_id = activities.trip_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'editor')
  )
);

CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Comments viewable by trip members" ON public.activity_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_members tm
      WHERE tm.trip_id = (SELECT trip_id FROM public.activities WHERE id = activity_comments.activity_id)
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Comments insertable by trip members" ON public.activity_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_members tm
      WHERE tm.trip_id = (SELECT trip_id FROM public.activities WHERE id = activity_comments.activity_id)
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Comments deletable by author" ON public.activity_comments
  FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can search profiles" 
ON profiles FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION find_profile_by_email(search_email TEXT)
RETURNS TABLE (id UUID, full_name TEXT, avatar_url TEXT) 
SECURITY DEFINER
LANGUAGE sql AS $$
  SELECT id, full_name, avatar_url 
  FROM profiles 
  WHERE email = search_email 
  AND EXISTS (
    SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid()
  );
$$;