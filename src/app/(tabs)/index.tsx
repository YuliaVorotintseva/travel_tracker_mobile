import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MyMap = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="My Marker"
          description="This is a marker"
        />
      </MapView>

      <Pressable
        style={{
          top: 100,
          left: 50,
          padding: 10,
          borderRadius: 8,
          backgroundColor: "white",
          alignSelf: "flex-start",
        }}
        onPress={() => router.push("/settings")}
      >
        <Text style={{ fontWeight: "600" }}>SETTINGS</Text>
      </Pressable>
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
});

export default MyMap;
