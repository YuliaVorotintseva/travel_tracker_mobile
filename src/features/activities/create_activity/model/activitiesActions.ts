import { supabase } from "@/src/shared/lib";
import { Activity } from "@/src/shared/types";

export const getTripActivities = async (tripId: string) => {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("trip_id", tripId)
    .order("start_time", { ascending: true, nullsFirst: true });

  if (!!error) {
    throw error;
  }

  return data as Activity[];
};

export const createActivity = async (
  tripId: string,
  data: Partial<Activity>,
) => {
  const { data: newActivity, error } = await supabase
    .from("activities")
    .insert({ trip_id: tripId, ...data })
    .select()
    .single();

  if (!!error) {
    throw error;
  }

  return newActivity as Activity;
};

export const deleteActivity = async (activityId: string) => {
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId);

  if (!!error) {
    throw error;
  }
};
