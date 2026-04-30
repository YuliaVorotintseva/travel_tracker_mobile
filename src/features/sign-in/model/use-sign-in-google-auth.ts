import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Platform } from "react-native";

import { ENV } from "@/src/shared/config";
import { supabase } from "@/src/shared/lib";

GoogleSignin.configure({
  webClientId: ENV.WEB_CLIENT_ID,
  iosClientId: ENV.IOS_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: false,
});

export const useSignInGoogleAuth = () => {
  const router = useRouter();
  const isSignIn = useRef(false);

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

        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });

        if (!!error) {
          throw error;
        }

        isSignIn.current = true;
        router.back();
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
