import { useActivityStore } from "@/src/screens/trip_map/model";
import { supabase } from "@/src/shared/lib";
import { Activity } from "@/src/shared/types";
import { useMemo } from "react";

export const useActivitiesActions = () => {
  const {
    activities,
    loading: loadingActivities,
    fetchActivities,
    addActivity,
    updateActivity: updateActivityInStore,
    removeActivity,
    clear,
  } = useActivityStore();

  const createActivity = async (tripId: string, data: Partial<Activity>) => {
    const tempId = `temp_${Date.now()}`;
    addActivity(data as Activity);

    const { data: newActivity, error } = await supabase
      .from("activities")
      .insert({ trip_id: tripId, ...data })
      .select()
      .single();

    updateActivityInStore(tempId, newActivity);

    if (!!error) {
      throw error;
    }

    return newActivity as Activity;
  };

  const updateActivity = async (
    activityId: string,
    data: Partial<Activity>,
  ) => {
    updateActivityInStore(activityId, data);

    const { data: updatedActivity, error } = await supabase
      .from("activities")
      .update({ id: activityId, ...data })
      .eq("id", activityId)
      .select()
      .single();

    if (!!error) {
      throw error;
    }

    return updatedActivity;
  };

  const deleteActivity = async (activityId: string) => {
    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", activityId);

    if (!!error) {
      throw error;
    }
    removeActivity(activityId);
  };

  const routePoints = useMemo(() => {
    return activities
      .filter((a) => a.location?.lat && a.location?.lng)
      .sort((a, b) => {
        if (a.route_order != null && b.route_order != null)
          return a.route_order - b.route_order;
        if (a.route_order != null) return -1;
        if (b.route_order != null) return 1;
        return (a.start_time || "").localeCompare(b.start_time || "");
      })
      .map((a) => ({ latitude: a.location!.lat, longitude: a.location!.lng }));
  }, [activities]);

  return {
    activities,
    loadingActivities,
    routePoints,
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    clear,
  };
};
