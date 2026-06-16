import { useRouter } from "expo-router";
import { FC, useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyProfile } from "@/src/shared/hooks";
import { DarkThemeIcon, LightThemeIcon, LogOutIcon } from "@/src/shared/icons";
import { supabase, useAuth, useTheme } from "@/src/shared/lib";
import { Profiles } from "@/src/shared/types/api/generated";
import { getStyles } from "./styles";

export const Settings: FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const styles = getStyles(theme);
  const { profile, isLoading, updateProfile } = useMyProfile();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateProfile(session?.user! as Profiles);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    router.replace("/");
    await logout();
  };

  return (
    <Pressable style={styles.modalOverlay} onPress={() => router.back()}>
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.profileSettings}>
          {!isLoading && (
            <View style={styles.userInfo}>
              <Pressable onPress={() => router.push("/users/my_profile")}>
                {!!profile?.avatar_url ? (
                  <Image
                    source={{ uri: profile.avatar_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/account80.png")}
                    style={styles.avatar}
                  />
                )}
              </Pressable>
              <View>
                <Text style={styles.optionText}>
                  {profile?.full_name ? profile?.full_name : "unknown"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.options}>
            <Pressable onPress={handleLogout} style={styles.option}>
              <LogOutIcon />
              <Text style={styles.optionText}>Exit</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Pressable style={styles.option} onPress={toggleTheme}>
            {theme === "light" ? (
              <>
                <LightThemeIcon />
                <Text style={styles.optionText}>Light theme</Text>
              </>
            ) : (
              <>
                <DarkThemeIcon />
                <Text style={styles.optionText}>Dark theme</Text>
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </Pressable>
  );
};
