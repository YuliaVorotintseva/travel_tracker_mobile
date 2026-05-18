import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { supabase } from "@/src/shared/lib";
import { Profiles } from "@/src/shared/types/api/generated";

interface MyProfileState {
  myData: Profiles | null;
  loading: boolean;
  error: string | null;
  fetchMyData: () => void;
  updateMyData: (data: Profiles) => void;
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
          const {
            data: { session },
            error: authError,
          } = await supabase.auth.getSession();

          const { data: myProfile, error: getProfileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session?.user.id)
            .maybeSingle();

          if (!!authError || !!getProfileError) {
            throw authError ?? getProfileError;
          }

          set({ myData: myProfile });
        } catch (error: unknown) {
          set({ error: (error as { message: string }).message });
        } finally {
          set({ loading: false });
        }
      },

      updateMyData: async (updatedData: Profiles) => {
        set((state) => ({
          myData: { ...state.myData, ...updatedData },
          error: null,
        }));

        try {
          const { error } = await supabase
            .from("profiles")
            .update({
              full_name: updatedData.full_name,
            })
            .eq("id", updatedData.id)
            .select()
            .single();

          if (!!error) {
            throw error;
          }
        } catch (error: unknown) {
          set({ error: (error as { message: string }).message });
          console.error(error);
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
