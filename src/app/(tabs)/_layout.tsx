import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { useTheme } from "@/src/shared/lib";
import { useAuth } from "@/src/shared/lib/auth-context";
import { Styles } from "@/src/shared/styles";
import { HapticTab } from "@/src/shared/ui/haptic-tab";
import { IconSymbol } from "@/src/shared/ui/icon-symbol";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={Styles[theme].IconAccent}
            />
          ),
        }}
      />
    </Tabs>
  );
}
