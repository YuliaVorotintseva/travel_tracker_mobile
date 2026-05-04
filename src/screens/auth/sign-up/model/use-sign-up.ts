import { useState } from "react";

import { supabase } from "@/src/shared/lib";
import { useAuth } from "@/src/shared/lib/auth-context";
import { useRouter } from "expo-router";

export type SignUpParams = {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
};

export const useLogup = () => {
  const [customError, setCustomError] = useState<string | null>(null);
  const { setToken, setIsAuthenticated } = useAuth();
  const router = useRouter();

  const logup = async (input: SignUpParams) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            avatar_url: input.avatarUrl,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) {
        throw error;
      }

      if (!!data.user && !!data.session?.access_token) {
        setToken(data.session.access_token);
        setIsAuthenticated(true);
        router.replace("/(tabs)");
      }
    } catch (error: unknown) {
      setCustomError((error as { message: string }).message);
      console.error(error);
    }
  };

  return {
    logup,
    error: customError,
  };
};
