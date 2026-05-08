import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { useTheme } from "@/src/shared/lib";
import { Loader } from "@/src/shared/ui/loaders";
import { useGetCurrentLocation } from "../model";
import { getStyles } from "./styles";

export const MapScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { data, loading, fetchLocation } = useGetCurrentLocation();

  useEffect(() => {
    fetchLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Number(data?.latitude.toFixed(6)),
          longitude: Number(data?.longitude.toFixed(6)),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: Number(data?.latitude.toFixed(6)),
            longitude: Number(data?.longitude.toFixed(6)),
          }}
          title="My Marker"
          description="This is a marker"
        />
      </MapView>

      <View style={styles.containerBtns}>
        <Pressable style={styles.btn} onPress={() => router.push("/settings")}>
          <Text style={styles.text}>SETTINGS</Text>
        </Pressable>

        <Pressable style={styles.btn} onPress={fetchLocation}>
          <Text style={styles.text}>GET MY LOCATION</Text>
        </Pressable>
      </View>
    </View>
  );
};
