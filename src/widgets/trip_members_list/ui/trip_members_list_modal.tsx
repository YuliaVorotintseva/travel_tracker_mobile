import { FC } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CloseIcon } from "@/src/shared/icons";
import { TripMemberWithProfile } from "@/src/shared/types";
import { getFormatDateTime } from "@/src/shared/utils";
import { useGetStyles } from "./styles";

type TripMembersListModalProps = {
  members: TripMemberWithProfile[];
  onClose: () => void;
  onMember: () => void;
};

export const TripMembersListModal: FC<TripMembersListModalProps> = ({
  members,
  onClose,
  onMember,
}) => {
  const styles = useGetStyles();

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.modalContent}>
        <Pressable onPress={onClose}>
          <CloseIcon />
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {members.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={{ height: "100%" }}>
                {members.map((item) => (
                  <Pressable
                    onPress={onMember}
                    style={styles.member}
                    key={item.user_id}
                  >
                    <View style={styles.userInfo}>
                      <View style={styles.header}>
                        <Image
                          style={styles.avatar}
                          source={
                            !!item.profiles?.avatar_url
                              ? { uri: item.profiles.avatar_url }
                              : require("../../../../assets/images/account24.png")
                          }
                          onError={(e) =>
                            console.log("❌ Image error:", e.nativeEvent.error)
                          }
                        />
                        <Text style={styles.name}>
                          {!!item.profiles && !!item.profiles?.full_name
                            ? item.profiles.full_name
                            : "unknown"}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={styles.info}
                        >{`Invited: ${getFormatDateTime(new Date(item.joined_at))}`}</Text>
                        <Text style={styles.info}>{`Role: ${item.role}`}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : (
            <Text>There is no any member yet</Text>
          )}
        </View>
      </View>
    </View>
  );
};
