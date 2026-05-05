import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Theme } from "../types";

type SessionState = {
  theme: Theme;
};

type SessionActions = {
  deleteTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const initialState: SessionState = {
  theme: "light",
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...initialState,
      deleteTheme: () => set(initialState),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "session",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
      version: 1,
    },
  ),
);
