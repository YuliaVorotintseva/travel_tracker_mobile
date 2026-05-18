import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MyTripCard } from "@/src/entities/trips/my-trip-card/ui";
import { useMyProfileStore } from "@/src/features/my_profile";
import { supabase, useTheme } from "@/src/shared/lib";
import { CreateButton } from "@/src/shared/ui";
import { ConfirmDeleteModal } from "@/src/shared/ui/confirm_delete_modal";
import { Loader } from "@/src/shared/ui/loaders";
import { useMyTripsStore } from "../model/my_trips_store";
import { getStyles } from "./styles";

export const MyTripsScreen: FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const {
    trips: myTrips,
    loading,
    fetchTrips,
    removeTrip,
    clear: clearTrips,
  } = useMyTripsStore();
  const { myData, fetchMyData, clear: clearMyData } = useMyProfileStore();

  useEffect(() => {
    fetchMyData();
    return () => clearMyData();
  }, []);

  useEffect(() => {
    if (!myData?.id) return;

    const channel = supabase.channel(`trips-sync-${myData.id}`);

    fetchTrips(myData.id);

    const tables = ["trips", "trip_members"] as const;

    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => fetchTrips(myData.id),
      );
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") console.log("✅ Realtime подключён");
    });

    return () => {
      channel.unsubscribe();
      clearTrips();
    };
  }, [myData]);

  const handleDelete = async (tripId: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", tripId);
    removeTrip(tripId);

    if (!!error) {
      console.error(error);
    }
    console.log("Trip was successfully deleted!");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={{ flex: 1 }}>
        {!!myTrips?.length ? (
          <View style={{ flex: 1 }}>
            <FlashList
              data={myTrips}
              renderItem={({ item }) => (
                <MyTripCard
                  onPress={() => router.push(`/edit-trip/${item.id}`)}
                  onDelete={() => {
                    setSelectedTripId(item.id);
                    setIsConfirmDeleteModalOpen(true);
                  }}
                  trip={item}
                />
              )}
              keyExtractor={(item) => item.id}
              onEndReachedThreshold={0.5}
            />
          </View>
        ) : (
          <View style={styles.noPosts}>
            <Text>You did not create any trips yet</Text>
          </View>
        )}
        <CreateButton href="/create-trip" />
      </View>

      {isConfirmDeleteModalOpen && !!selectedTripId && (
        <ConfirmDeleteModal
          onClose={() => setIsConfirmDeleteModalOpen(false)}
          onDelete={() => {
            handleDelete(selectedTripId);
            setIsConfirmDeleteModalOpen(false);
          }}
          text="Are you sure you want to delete this trip?"
        />
      )}
    </SafeAreaView>
  );
};
