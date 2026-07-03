CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.auto_add_trip_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner')
  ON CONFLICT (trip_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_auto_owner_trigger ON public.trips;
CREATE TRIGGER trips_auto_owner_trigger
  AFTER INSERT ON public.trips
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_add_trip_owner();

CREATE OR REPLACE FUNCTION public.set_activity_route_order()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_order INTEGER;
BEGIN
  IF NEW.route_order IS NULL OR NEW.route_order = 0 THEN
    SELECT COALESCE(MAX(route_order), 0) + 1
    INTO next_order
    FROM public.activities
    WHERE trip_id = NEW.trip_id;
    
    NEW.route_order := next_order;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS activities_set_order_trigger ON public.activities;
CREATE TRIGGER activities_set_order_trigger
  BEFORE INSERT ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_activity_route_order();