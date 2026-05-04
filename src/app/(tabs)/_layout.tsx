import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { useAuth } from "@/src/shared/lib/auth-context";
import { HapticTab } from "@/src/shared/ui/haptic-tab";
import { IconSymbol } from "@/src/shared/ui/icon-symbol";

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
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
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
