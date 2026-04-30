import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

import { ENV } from "../config/env";

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Восстановление сессии при возврате в приложение
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  }
});
