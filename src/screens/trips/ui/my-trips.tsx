import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MyTripCard } from "@/src/entities/trips/my-trip-card/ui";
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
  const [userId, setUserId] = useState<string | null>(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const { trips: myTrips, loading, fetchTrips, removeTrip } = useMyTripsStore();

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUserId(session?.user.id ?? null);
      })
      .catch((error: unknown) => {
        console.error((error as { message: string }).message);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;
    const channel = supabase.channel(`trips-sync-${userId}`);

    fetchTrips(userId);

    const tables = ["trips", "trip_members"] as const;

    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => fetchTrips(userId),
      );
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") console.log("✅ Realtime подключён");
    });

    return () => {
      isMounted = false;
      channel.unsubscribe();
    };
  }, [userId]);

  const handleDelete = async (tripId: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", tripId);
    removeTrip(tripId);

    if (!!error) {
      console.error(error);
    }
    console.log("Trip was successfully deleted!");
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
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
