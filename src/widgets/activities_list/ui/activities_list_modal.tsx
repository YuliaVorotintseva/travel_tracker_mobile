import { FlashList } from "@shopify/flash-list";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityCommentsSection } from "@/src/features/activities/activity_comments/ui/activity_comment_section";
import { useMyProfile } from "@/src/shared/hooks";
import { CloseIcon } from "@/src/shared/icons";
import { useTheme } from "@/src/shared/lib";
import { Activity } from "@/src/shared/types";
import { Profiles } from "@/src/shared/types/api/generated";
import { getFormatDateTime, parseLocalDateTime } from "@/src/shared/utils";
import { useGetStyles } from "./styles";

type ActivitiesListModalProps = {
  onClose: () => void;
  onActivity: (activity: Activity) => void;
  activities: Activity[];
};

export const ActivitiesListModal: FC<ActivitiesListModalProps> = ({
  activities,
  onActivity,
  onClose,
}) => {
  const { theme } = useTheme();
  const styles = useGetStyles(theme);
  const { profile } = useMyProfile();

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <SafeAreaView style={styles.modalContent}>
        <Pressable onPress={onClose}>
          <CloseIcon />
        </Pressable>
        <View style={{ flex: 1 }}>
          {!!activities && activities.length > 0 ? (
            <View style={{ flex: 1 }}>
              <FlashList
                data={activities}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.activity}
                    onPress={() => onActivity(item)}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text
                      style={styles.info}
                    >{`Address: ${item.location.address}`}</Text>
                    <Text style={styles.info}>{item.notes}</Text>
                    <Text style={styles.info}>
                      {item.start_time &&
                        `Start time: ${getFormatDateTime(parseLocalDateTime(item.start_time))}`}
                    </Text>
                    <Text style={styles.info}>
                      {item.start_time &&
                        item.end_time &&
                        `End time: ${getFormatDateTime(parseLocalDateTime(item.end_time))}`}
                    </Text>
                    <ActivityCommentsSection
                      activityId={item.id}
                      currentUserId={(profile as Profiles).id}
                    />
                  </Pressable>
                )}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0.5}
              />
            </View>
          ) : (
            <Text>There is no any activity</Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
