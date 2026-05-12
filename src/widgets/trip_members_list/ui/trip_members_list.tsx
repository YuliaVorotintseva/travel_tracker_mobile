import { FlashList } from "@shopify/flash-list";
import { FC, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

import { supabase } from "@/src/shared/lib";
import { TripMemberWithProfile } from "@/src/shared/types";
import { getFormatDate } from "@/src/shared/utils";
import { getStyles } from "./styles";

export const TripMembersList: FC<{ tripId: string }> = ({ tripId }) => {
  const [members, setMembers] = useState<TripMemberWithProfile[] | null>(null);
  const styles = getStyles();

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from("trip_members")
        .select(`user_id, role, joined_at, profiles (full_name, avatar_url )`)
        .eq("trip_id", tripId);

      if (error) throw error;
      setMembers((data as TripMemberWithProfile[]) ?? null);
    };
    init();
  }, []);

  return (
    <View>
      {!!members && members.length && (
        <View style={{ flex: 1 }}>
          <FlashList
            data={members}
            renderItem={({ item }) => (
              <View style={styles.member}>
                <View style={styles.userInfo}>
                  <Image
                    style={styles.avatar}
                    source={
                      item.profiles[0].avatar_url ??
                      require("../../../../assets/images/user.svg")
                    }
                  />
                  <Text>{item.profiles[0].full_name}</Text>
                  <Text>{getFormatDate(new Date(item.joined_at))}</Text>
                </View>
                <Text style={styles.role}>{item.role}</Text>
              </View>
            )}
            keyExtractor={(item) => item.user_id}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}
    </View>
  );
};
