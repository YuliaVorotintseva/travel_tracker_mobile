import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { AppState } from "react-native";

import { ENV } from "../config/env";

// Адаптер для безопасного хранения сессий
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
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
