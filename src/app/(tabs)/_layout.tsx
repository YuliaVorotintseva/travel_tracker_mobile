import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { TravelIcon } from "@/src/shared/icons";
import { HomeLocationIcon } from "@/src/shared/icons/home-location-icon";
import { useTheme } from "@/src/shared/lib";
import { useAuth } from "@/src/shared/lib/auth-context";
import { Styles } from "@/src/shared/styles";
import { HapticTab } from "@/src/shared/ui/haptic-tab";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

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
        tabBarStyle: {
          backgroundColor: Styles[theme].BgPrimary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <HomeLocationIcon />,
        }}
      />
      <Tabs.Screen
        name="my-trips"
        options={{
          title: "My trips",
          tabBarIcon: () => <TravelIcon />,
        }}
      />
    </Tabs>
  );
}
