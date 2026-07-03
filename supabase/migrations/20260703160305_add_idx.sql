CREATE INDEX idx_activity_comments_activity_id ON public.activity_comments(activity_id);
CREATE INDEX idx_activity_comments_created_at ON public.activity_comments(activity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON public.activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id_order ON public.activities(trip_id, route_order);
CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips(created_by);
CREATE INDEX idx_activities_route_order ON activities(trip_id, route_order);