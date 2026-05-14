import { create } from "zustand";

import { supabase } from "@/src/shared/lib";
import { TripWithMembers } from "@/src/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

interface TripState {
  userId: string | null;
  trips: TripWithMembers[];
  loading: boolean;
  error: string | null;
  fetchTrips: (userId: string) => Promise<void>;
  addTrip: (trip: TripWithMembers) => void;
  updateTrip: (id: string, data: Partial<TripWithMembers>) => void;
  removeTrip: (id: string) => void;
  clear: () => void;
}

export const useMyTripsStore = create<TripState>()(
  persist(
    (set) => ({
      userId: null,
      trips: [],
      loading: false,
      error: null,

      fetchTrips: async (userId: string) => {
        set({ userId: userId, loading: true, error: null });
        try {
          const [tripsAsCreator, tripsAsMember] = await Promise.all([
            supabase
              .from("trips")
              .select(
                "id, title, start_date, end_date, description, destination, currency, created_by, trip_members(user_id, role)",
              )
              .eq("created_by", userId),
            supabase
              .from("trips")
              .select(
                "id, title, start_date, end_date, description, destination, currency, created_by, trip_members(user_id, role)",
              )
              .eq("trip_members.user_id", userId),
          ]);

          const error = tripsAsCreator.error || tripsAsMember.error;
          if (error) {
            console.error("Supabase fetch error:", error);
            return;
          }

          const uniqueTrips = Array.from(
            new Map(
              [...tripsAsCreator.data, ...tripsAsMember.data].map((t) => [
                t.id,
                t,
              ]),
            ).values(),
          );

          set({ trips: uniqueTrips || [] });
        } catch (error: unknown) {
          console.error(
            "Unexpected error: ",
            (error as { message: string }).message,
          );
        } finally {
          set({ loading: false });
        }
      },

      addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),

      updateTrip: (id, data) =>
        set((state) => ({
          trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),

      removeTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
        })),

      clear: () => set({ trips: [], userId: null, error: null }),
    }),
    {
      name: "trips",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        trips: state.trips,
        userId: state.userId,
      }),
    },
  ),
);
