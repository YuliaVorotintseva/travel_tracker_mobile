import { FlashList } from "@shopify/flash-list";
import { FC } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { CloseIcon } from "@/src/shared/icons";
import { TripMemberWithProfile } from "@/src/shared/types";
import { getFormatDateTime } from "@/src/shared/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetStyles } from "./styles";

type TripMembersListModalProps = {
  members: TripMemberWithProfile[];
  onClose: () => void;
  onMember?: () => void;
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
      <SafeAreaView style={styles.modalContent}>
        <Pressable onPress={onClose}>
          <CloseIcon />
        </Pressable>
        <View>
          {!!members && (
            <View style={{ flex: 1 }}>
              <FlashList
                data={members}
                renderItem={({ item }) => (
                  <Pressable onPress={onMember} style={styles.member}>
                    <View style={styles.userInfo}>
                      <Image
                        style={styles.avatar}
                        source={
                          !!item.profiles?.avatar_url
                            ? { uri: item.profiles.avatar_url }
                            : require("../../../../assets/images/account24.png")
                        }
                      />
                      <Text>
                        {!!item.profiles && !!item.profiles?.full_name
                          ? item.profiles.full_name
                          : "unknown"}
                      </Text>
                      <Text>{getFormatDateTime(new Date(item.joined_at))}</Text>
                    </View>
                    <Text style={styles.role}>{item.role}</Text>
                  </Pressable>
                )}
                keyExtractor={(item) => item.user_id}
                onEndReachedThreshold={0.5}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
