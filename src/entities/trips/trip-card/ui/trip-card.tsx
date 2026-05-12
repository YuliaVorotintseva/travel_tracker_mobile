import { FC, useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { ShareIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { TripWithMembers } from "@/src/shared/types";
import { User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { getStyles } from "./styles";

export const TripCard: FC<{ trip: TripWithMembers }> = ({ trip }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [author, setAuthor] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setAuthor(session?.user ?? null);
      })
      .catch((error: unknown) => {
        console.error((error as { message: string }).message);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{trip.title}</Text>
        <Text style={styles.text}>
          {`Members: ${trip.trip_members.length}`}
        </Text>
      </View>
      <View style={styles.content}>
        <Pressable
          style={styles.moveToMapBtn}
          onPress={() => router.push(`/trip/${trip.id}`)}
        >
          <Text style={styles.moveToMapBtnText}>Move to trip map</Text>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <View style={styles.userInfo}>
          {!!author?.user_metadata["avatar_url"] && (
            <Image
              source={{ uri: author?.user_metadata["avatar_url"] }}
              style={styles.avatar}
            />
          )}
          <Text style={styles.text}>{author?.user_metadata["full_name"]}</Text>
        </View>
        <View style={styles.btns}>
          <ShareIcon />
        </View>
      </View>
    </View>
  );
};
