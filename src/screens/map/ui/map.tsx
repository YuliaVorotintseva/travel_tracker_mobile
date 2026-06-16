import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { useGetCurrentLocation } from "@/src/shared/hooks";
import { useTheme } from "@/src/shared/lib";
import { Loader } from "@/src/shared/ui/loaders";
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
    return <Loader />;
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
        customMapStyle={
          theme === "dark"
            ? require("@/src/shared/styles/map_dark_style.json")
            : require("@/src/shared/styles/map_light_style.json")
        }
      >
        <Marker
          coordinate={{
            latitude: Number(data?.latitude.toFixed(6)),
            longitude: Number(data?.longitude.toFixed(6)),
          }}
          title="My location"
          description="Default location for trip maps"
          icon={require("@/assets/images/location.png")}
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
