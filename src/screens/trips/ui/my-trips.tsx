import { FlashList } from "@shopify/flash-list";
import { FC, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MyTripCard } from "@/src/entities/trips/my-trip-card/ui";
import { supabase, useTheme } from "@/src/shared/lib";
import { TripWithMembers } from "@/src/shared/types";
import { CreateButton } from "@/src/shared/ui";
import { useRouter } from "expo-router";
import { getStyles } from "./styles";

export const MyTripsScreen: FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [myTrips, setMyTrips] = useState<TripWithMembers[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
    if (!userId) {
      return;
    }

    const fetchTrips = async () => {
      try {
        const [tripsAsCreator, tripsAsMember] = await Promise.all([
          supabase
            .from("trips")
            .select(
              `id, title, start_date, end_date, destination, currency, created_by, trip_members(user_id, role)`,
            )
            .eq("created_by", userId),

          supabase
            .from("trips")
            .select(
              `id, title, start_date, end_date, destination, currency, created_by, trip_members(user_id, role)`,
            )
            .eq("trip_members.user_id", userId),
        ]);

        if (!!tripsAsCreator.error || !!tripsAsMember.error) {
          throw tripsAsCreator.error ?? tripsAsMember.error;
        }

        const uniqueTrips = Array.from(
          new Map(
            [...tripsAsCreator.data, ...tripsAsMember.data].map((t) => [
              t.id,
              t,
            ]),
          ).values(),
        );

        setMyTrips(uniqueTrips as TripWithMembers[]);
      } catch (error: unknown) {
        console.error(error);
      }
    };

    fetchTrips();

    const channel = supabase
      .channel("trips-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips" },
        fetchTrips,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trip_members" },
        fetchTrips,
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Realtime подключен");
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  const handleDelete = async (tripId: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", tripId);

    if (!!error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={{ flex: 1 }}>
        {!!myTrips?.length ? (
          <View style={{ flex: 1 }}>
            <FlashList
              data={myTrips}
              renderItem={({ item }) => (
                <MyTripCard
                  onDelete={() => handleDelete(item.id)}
                  onPress={() => router.push(`/edit-trip/${item.id}`)}
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
    </SafeAreaView>
  );
};
