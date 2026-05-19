import { FlashList } from "@shopify/flash-list";
import { FC } from "react";
import { Image, Text, View } from "react-native";

import { useTripMembers } from "@/src/shared/hooks";
import { getFormatDate } from "@/src/shared/utils";
import { getStyles } from "./styles";

export const TripMembersList: FC<{ tripId: string }> = ({ tripId }) => {
  const styles = getStyles();
  const { members } = useTripMembers(tripId);

  return (
    <View>
      {!!members?.length && members.length > 0 && (
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
