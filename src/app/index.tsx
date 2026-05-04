import { useRouter } from "expo-router";
import { FC, useEffect } from "react";

import { SignInScreen } from "../screens/auth/sign-in";
import { useAuth } from "../shared/lib/auth-context";

const MainScreen: FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  return <SignInScreen />;
};

export default MainScreen;
