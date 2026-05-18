import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { supabase } from "@/src/shared/lib";

interface MyProfileState {
  myData: User | null;
  loading: boolean;
  error: string | null;
  fetchMyData: () => void;
  updateMyData: (data: User) => void;
  clear: () => void;
}

export const useMyProfileStore = create<MyProfileState>()(
  persist(
    (set) => ({
      myData: null,
      loading: false,
      error: null,

      fetchMyData: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.getSession();

          if (!!error) {
            throw error;
          }

          set({ myData: data.session?.user, error });
        } catch (error: unknown) {
          set({ error: (error as { message: string }).message });
        } finally {
          set({ loading: false });
        }
      },

      updateMyData: async (updatedData: User) => {
        set({ loading: true, error: null });

        try {
          const { data, error } = await supabase
            .from("profiles")
            .update(updatedData)
            .eq("id", updatedData.id)
            .select()
            .single();

          if (!!error) {
            throw error;
          }

          set({ myData: data.session?.user, error });
        } catch (error: unknown) {
          set({ error: (error as { message: string }).message });
        } finally {
          set({ loading: false });
        }
      },

      clear: () => set({ myData: null, error: null }),
    }),
    {
      name: "profile",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        myData: state.myData,
      }),
    },
  ),
);
