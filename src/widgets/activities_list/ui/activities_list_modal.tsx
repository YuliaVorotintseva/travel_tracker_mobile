import { FlashList } from "@shopify/flash-list";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CloseIcon } from "@/src/shared/icons";
import { useTheme } from "@/src/shared/lib";
import { Activity } from "@/src/shared/types";
import { getFormatDate } from "@/src/shared/utils";
import { useGetStyles } from "./styles";

type ActivitiesListModalProps = {
  onPressOverlay: () => void;
  onPressCloseIcon: () => void;
  onPressActivity: (activity: Activity) => void;
  activities: Activity[];
};

export const ActivitiesListModal: FC<ActivitiesListModalProps> = ({
  activities,
  onPressOverlay,
  onPressActivity,
  onPressCloseIcon,
}) => {
  const { theme } = useTheme();
  const styles = useGetStyles(theme);

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onPressOverlay} />
      <SafeAreaView style={styles.modalContent}>
        <Pressable onPress={onPressCloseIcon}>
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
                    onPress={() => onPressActivity(item)}
                  >
                    <Text style={styles.title}>{item.title}</Text>
                    <Text
                      style={styles.info}
                    >{`Address: ${item.location.address}`}</Text>
                    <Text style={styles.info}>{item.notes}</Text>
                    <Text style={styles.info}>
                      {item.start_time &&
                        `Start time: ${getFormatDate(new Date(item.start_time))}`}
                    </Text>
                    <Text style={styles.info}>
                      {item.start_time &&
                        item.end_time &&
                        `Start time: ${getFormatDate(new Date(item.end_time))}`}
                    </Text>
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
