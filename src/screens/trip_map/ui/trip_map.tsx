import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

import {
  CreateActivityModal,
  useActivitiesActions,
} from "@/src/features/activities/create_activity";
import { EditActivityModal } from "@/src/features/activities/edit_activity/ui/edit_activity";
import { useGetCurrentLocation } from "@/src/shared/hooks";
import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { Activity } from "@/src/shared/types";
import { Loader } from "@/src/shared/ui/loaders";
import { ActivitiesListModal } from "@/src/widgets/activities_list/ui/activities_list_modal";
import { Coordinate, fetchRoadRoute } from "../model/trip_map_actions";
import { useGetStyle } from "./styles";

export const TripMapScreen: FC<{ tripId: string }> = ({ tripId }) => {
  const router = useRouter();
  const {
    data: userLocation,
    loading: loadingFetchCurrentLocation,
    fetchLocation,
  } = useGetCurrentLocation();
  const [selectedCoord, setSelectedCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isCreateActivityModalVisible, setisCreateActivityModalVisible] =
    useState(false);
  const [isEditActivityModalVisible, setIsEditActivityModalVisible] =
    useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const [isActivitiesListOpen, setIsActivitiesListOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [roadPath, setRoadPath] = useState<Coordinate[] | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const mapRef = useRef<MapView>(null);
  const { theme } = useTheme();
  const styles = useGetStyle(theme);
  const {
    activities,
    loadingActivities,
    routePoints,
    fetchActivities,
    createActivity,
    updateActivity,
    clear,
  } = useActivitiesActions();

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (!tripId) return;

    fetchActivities(tripId);

    return () => clear();
  }, [tripId]);

  useEffect(() => {
    if (routePoints.length < 2) {
      setRoadPath(null);
      return;
    }

    let cancelled = false;
    setLoadingRoute(true);

    fetchRoadRoute(routePoints)
      .then((path) => {
        if (!cancelled) setRoadPath(path ?? routePoints);
      })
      .catch(() => {
        if (!cancelled) setRoadPath(routePoints);
      })
      .finally(() => {
        if (!cancelled) setLoadingRoute(false);
      });

    mapRef.current?.fitToCoordinates(roadPath || routePoints);

    return () => {
      cancelled = true;
    };
  }, [routePoints]);

  const initialRegion = useMemo<Region>(() => {
    if (routePoints.length > 0) {
      return { ...routePoints[0], latitudeDelta: 0.05, longitudeDelta: 0.05 };
    }

    return {
      latitude: Number(userLocation?.latitude),
      longitude: Number(userLocation?.longitude),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    } as Region;
  }, [routePoints, userLocation]);

  const handleMapPress = (event: any) => {
    setSelectedCoord(event.nativeEvent.coordinate);
    setisCreateActivityModalVisible(true);
  };

  const handleAddActivity = async (data: Partial<Activity>) => {
    if (!tripId || !selectedCoord) return;
    try {
      await createActivity(tripId, {
        ...data,
        location: { lat: selectedCoord.latitude, lng: selectedCoord.longitude },
      });
      setisCreateActivityModalVisible(false);
      setSelectedCoord(null);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleEditActivity = async (
    activityId: string,
    data: Partial<Activity>,
  ) => {
    try {
      await updateActivity(activityId, data);
      setIsEditActivityModalVisible(false);
      setSelectedActivity(null);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const fitToRoute = () => {
    if (routePoints.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(routePoints, {
        edgePadding: { top: 80, right: 60, bottom: 120, left: 60 },
        animated: true,
      });
    }
  };

  const hasPoints = routePoints.length > 0;
  const showEmptyState = activities.length === 0;

  if (
    loadingFetchCurrentLocation ||
    loadingActivities ||
    loadingRoute ||
    !userLocation
  ) {
    return (
      <View style={styles.loading}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        showsUserLocation={!!userLocation}
        customMapStyle={
          theme === "dark" ? require("@/src/shared/styles/map_style.json") : {}
        }
      >
        {activities
          .filter((a) => a.location)
          .map((activity, i) => (
            <Marker
              key={activity.id}
              coordinate={{
                latitude: activity.location!.lat,
                longitude: activity.location!.lng,
              }}
              title={`${i + 1}. ${activity.title}`}
              description={activity.type}
              icon={require("@/assets/images/location.png")}
            />
          ))}

        {showRoute && hasPoints && (
          <Polyline
            // coordinates={roadPath || routePoints}
            coordinates={routePoints}
            strokeColor={Styles[theme].BorderAccent}
            strokeWidth={1}
            lineCap="round"
            lineJoin="round"
            zIndex={10}
            tappable={false}
            geodesic={false}
          />
        )}
      </MapView>

      {showEmptyState && (
        <View style={styles.emptyState}>
          <MaterialIcons name="map" size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>Маршрут пуст</Text>
          <Text style={styles.emptyText}>
            Нажмите на любое место карты, чтобы добавить первую точку
          </Text>
        </View>
      )}

      <View style={styles.settings}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back to my trips</Text>
        </Pressable>
        <Pressable
          style={styles.activityListBtn}
          onPress={() => setIsActivitiesListOpen(true)}
        >
          <Text style={styles.btnText}>Activities list</Text>
        </Pressable>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={centerOnUser}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
          <Text style={styles.btnText}>My location</Text>
        </TouchableOpacity>

        {hasPoints && (
          <>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setShowRoute((p) => !p)}
            >
              <MaterialIcons size={20} color="#fff" />
              <Text style={styles.btnText}>
                {showRoute ? "Скрыть" : "Маршрут"}
              </Text>
            </TouchableOpacity>
            {routePoints.length > 1 && (
              <TouchableOpacity
                style={[styles.btn, styles.fitBtn]}
                onPress={fitToRoute}
              >
                <MaterialIcons
                  name="center-focus-strong"
                  size={20}
                  color="#fff"
                />
                <Text style={styles.btnText}>Group</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <CreateActivityModal
        visible={isCreateActivityModalVisible}
        onClose={() => setisCreateActivityModalVisible(false)}
        onSubmit={handleAddActivity}
        initialCoord={selectedCoord}
      />

      {selectedActivity && (
        <EditActivityModal
          visible={isEditActivityModalVisible}
          onClose={() => setIsEditActivityModalVisible(false)}
          onSubmit={handleEditActivity}
          activity={selectedActivity}
        />
      )}

      {isActivitiesListOpen && (
        <ActivitiesListModal
          onPressOverlay={() => setIsActivitiesListOpen(false)}
          onPressCloseIcon={() => setIsActivitiesListOpen(false)}
          onPressActivity={(item: Activity) => {
            setSelectedActivity(item);
            setIsEditActivityModalVisible(true);
          }}
          activities={activities}
        />
      )}
    </View>
  );
};
