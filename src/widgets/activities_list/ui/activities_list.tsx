import { FlashList } from "@shopify/flash-list";
import { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";

import { supabase } from "@/src/shared/lib";
import { Activities } from "@/src/shared/types/api/generated";
import { getFormatDate } from "@/src/shared/utils";

export const ActivitiesList: FC<{ tripId: string }> = ({ tripId }) => {
  const [activities, setActivities] = useState<Activities[] | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from("activities")
        .select(`id, title, type, start_time, end_time, location`)
        .eq("trip_id", tripId);

      if (error) throw error;
      setActivities((data as Activities[]) ?? null);
    };
    init();
  }, []);

  return (
    <View>
      {!!activities && activities.length ? (
        <View style={{ flex: 1 }}>
          <FlashList
            data={activities}
            renderItem={({ item }) => (
              <View>
                <View>
                  <Text>{item.title}</Text>
                  <Text>{item.type}</Text>
                  <Text>
                    {item.start_time &&
                      `Start time: ${getFormatDate(new Date(item.start_time))}`}
                  </Text>
                  <Text>
                    {item.start_time &&
                      item.end_time &&
                      `Start time: ${getFormatDate(new Date(item.end_time))}`}
                  </Text>
                  <Text>{item.notes}</Text>
                </View>
                {/* LOCATION */}
              </View>
            )}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0.5}
          />
        </View>
      ) : (
        <Text>There is no any activity</Text>
      )}
    </View>
  );
};
