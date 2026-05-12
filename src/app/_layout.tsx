import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "@/src/shared/lib";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../shared/lib/auth-context";
import { ThemeProvider } from "../shared/lib/theme-context";

const App = () => {
  const { theme } = useTheme();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="trip" />

        <Stack.Screen
          name="settings"
          options={{
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="create-trip"
          options={{
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="edit-trip"
          options={{
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="/users/my_profile"
          options={{
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
      </Stack>
      <StatusBar
        style={theme === "light" ? "light" : "dark"}
        backgroundColor="transparent"
        translucent={true}
      />
    </>
  );
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
