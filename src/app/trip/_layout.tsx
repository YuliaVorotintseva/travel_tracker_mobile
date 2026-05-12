import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import { useAuth } from "@/src/shared/lib";

export default function MyTripLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, []);

  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
