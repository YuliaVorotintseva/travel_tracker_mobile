import { Loader } from "@/src/shared/ui/loaders";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useGetCurrentLocation } from "../model";

export const MapScreen = () => {
  const router = useRouter();
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerBtns: {
    gap: 20,
  },
  btn: {
    top: 50,
    left: 25,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
  },
});
