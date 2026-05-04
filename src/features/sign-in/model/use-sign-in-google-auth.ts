import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Platform } from "react-native";

import { ENV } from "@/src/shared/config";
import { supabase } from "@/src/shared/lib";
import { useAuth } from "@/src/shared/lib/auth-context";

GoogleSignin.configure({
  webClientId: ENV.WEB_CLIENT_ID,
  iosClientId: ENV.IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: false,
});

export const useSignInGoogleAuth = () => {
  const { setToken, setIsAuthenticated } = useAuth();
  const isSignIn = useRef(false);
  const router = useRouter();

  const signInWithGoogle = async () => {
    if (isSignIn.current) {
      return;
    }

    try {
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices();
      }

      const result = await GoogleSignin.signIn();

      if (result.type === "success" && !!result.data?.idToken) {
        const { idToken } = result.data;

        if (!idToken) {
          throw new Error("Google access token is not received");
        }

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });

        if (!!error) {
          throw error;
        }

        isSignIn.current = true;
        setToken(data.session.access_token);
        setIsAuthenticated(true);
        router.replace("/(tabs)");
      } else {
        throw new Error(
          "Google id token is not received or Google sign-in was cancelled",
        );
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      isSignIn.current = false;
    }
  };

  return { signInWithGoogle };
};
