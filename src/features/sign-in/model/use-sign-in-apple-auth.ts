import * as AppleAuth from "expo-apple-authentication";
import { useRouter } from "expo-router";

import { supabase } from "@/src/shared/lib";

export const useSignInAppleAuth = () => {
  const router = useRouter();

  const signInWithApple = async () => {
    try {
      const credendials = await AppleAuth.signInAsync({
        requestedScopes: [
          AppleAuth.AppleAuthenticationScope.EMAIL,
          AppleAuth.AppleAuthenticationScope.FULL_NAME,
        ],
      });

      if (!credendials.identityToken) {
        throw new Error("Apple id token is not received");
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credendials.identityToken,
      });

      if (!!error) {
        throw error;
      }

      router.back();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null) {
        console.error(error);
      }
    }
  };

  return { signInWithApple };
};
