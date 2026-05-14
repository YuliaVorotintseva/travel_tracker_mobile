import { create } from "zustand";

import { supabase } from "@/src/shared/lib";
import { Activity } from "@/src/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { addAddressesToActivities } from "./trip_map_actions";

interface ActivityState {
  activities: Activity[];
  tripId: string | null;
  loading: boolean;
  error: string | null;
  fetchActivities: (tripId: string) => Promise<void>;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, data: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
  clear: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      tripId: null,
      loading: false,
      error: null,

      fetchActivities: async (tripId: string) => {
        set({ tripId: tripId, loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("activities")
            .select("*")
            .eq("trip_id", tripId)
            .order("start_time", { ascending: true, nullsFirst: true });

          if (!!error) throw error;

          const activitiesWithAddresses = await addAddressesToActivities(data);
          set({ activities: activitiesWithAddresses || [] });
        } catch (error: unknown) {
          set({ error: (error as { message: string }).message });
        } finally {
          set({ loading: false });
        }
      },

      addActivity: (activity) =>
        set((state) => ({ activities: [...state.activities, activity] })),

      updateActivity: (id, data) =>
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, ...data } : a,
          ),
        })),

      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),

      clear: () => set({ activities: [], tripId: null, error: null }),
    }),
    {
      name: "activities",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activities: state.activities,
        tripId: state.tripId,
      }),
    },
  ),
);
