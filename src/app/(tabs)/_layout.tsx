import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/src/shared/constants/theme";
import { useColorScheme } from "@/src/shared/hooks/use-color-scheme";
import { HapticTab } from "@/src/shared/ui/haptic-tab";
import { IconSymbol } from "@/src/shared/ui/icon-symbol";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
