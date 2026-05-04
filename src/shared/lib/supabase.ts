import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";

import { ENV } from "../config/env";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error: unknown) {
      console.error("Error getting item: ", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const parsed = JSON.parse(value) as AuthResponse;

      const accessToken = parsed.access_token || value;
      const accessKey = parsed.access_token ? "access_token" : key;
      await SecureStore.setItemAsync(accessKey, accessToken);

      const refreshToken = parsed.refresh_token || value;
      const refreshKey = parsed.refresh_token ? "refresh_token" : key;
      await SecureStore.setItemAsync(refreshKey, refreshToken);
    } catch (error: unknown) {
      console.error("Error setting item: ", error);
      throw error;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error: unknown) {
      console.error("Error removing item: ", error);
      throw error;
    }
  },
};

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Восстановление сессии при возврате в приложение
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  }
});
