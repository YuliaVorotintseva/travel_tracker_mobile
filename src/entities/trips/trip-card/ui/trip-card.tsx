import { FC } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useInviteLink } from "@/src/screens/invite";
import { useMyProfile } from "@/src/shared/hooks";
import { ShareIcon } from "@/src/shared/icons";
import { useTheme } from "@/src/shared/lib";
import { TripWithMembers } from "@/src/shared/types";
import { Profiles } from "@/src/shared/types/api/generated";
import { useRouter } from "expo-router";
import { getStyles } from "./styles";

export const TripCard: FC<{ trip: TripWithMembers }> = ({ trip }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { copyInviteLink } = useInviteLink(trip.id);
  const { profile } = useMyProfile();

  const handleShare = async () => {
    const success = await copyInviteLink();
    if (success) {
      console.log("SUCCESS COPIED");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>{trip.title}</Text>
        <Text style={styles.text}>
          {`Members: ${!!trip.trip_members ? trip.trip_members.length : 0}`}
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
          {!!(profile as Profiles).avatar_url ? (
            <Image
              source={{ uri: (profile as Profiles).avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={require("@/assets/images/account24.png")}
              style={styles.avatar}
            />
          )}
          <Text style={styles.text}>{(profile as Profiles).full_name}</Text>
        </View>
        <Pressable onPress={handleShare} style={styles.btns}>
          <ShareIcon />
        </Pressable>
      </View>
    </View>
  );
};
