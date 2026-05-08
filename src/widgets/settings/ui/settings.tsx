import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import {
  DarkThemeIcon,
  LightThemeIcon,
  LogOutIcon,
  UserIcon,
} from "@/src/shared/icons";
import { supabase, useAuth, useTheme } from "@/src/shared/lib";
import { User } from "@supabase/supabase-js";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStyles } from "./styles";

export const Settings: FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const styles = getStyles(theme);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          setUser(session?.user ?? null);
        }
      })
      .catch((error: unknown) => {
        console.error((error as { message: string }).message);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    router.replace("/");
    await logout();
  };

  return (
    <Pressable style={styles.modalOverlay} onPress={() => router.back()}>
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.profileSettings}>
          {!loading && (
            <View style={styles.userInfo}>
              <Pressable onPress={() => router.push("/users/my_profile")}>
                {!!user?.user_metadata["avatar_url"] ? (
                  <Image
                    source={{ uri: user.user_metadata["avatar_url"] }}
                    style={styles.avatar}
                  />
                ) : (
                  <UserIcon width={80} theme={theme} />
                )}
              </Pressable>
              <View>
                <Text style={styles.optionText}>
                  {user?.user_metadata["full_name"]
                    ? user?.user_metadata["full_name"]
                    : "unknown"}
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
