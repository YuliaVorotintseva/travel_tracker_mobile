import { useRouter } from "expo-router";
import { useState } from "react";

import { supabase } from "@/src/shared/lib";
import { useAuth } from "@/src/shared/lib/auth-context";

export type SignInParams = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  const [customError, setCustomError] = useState<string | null>(null);
  const { setIsAuthenticated, loading } = useAuth();

  const login = async (input: SignInParams) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        throw error;
      }

      if (!!data.user && !!data.session.access_token) {
        setIsAuthenticated(true);
        router.replace("/(tabs)");
      }
    } catch (error: unknown) {
      setCustomError((error as { message: string }).message);
      console.error(JSON.stringify(error, null, 2));
    }
  };

  return {
    login,
    loading,
    error: customError,
  };
};
