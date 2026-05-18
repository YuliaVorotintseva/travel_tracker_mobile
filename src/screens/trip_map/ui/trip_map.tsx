import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";

import { CreateActivityModal } from "@/src/features/activities/create_activity";
import { EditActivityModal } from "@/src/features/activities/edit_activity/ui/edit_activity";
import { useGetCurrentLocation } from "@/src/shared/hooks";
import { supabase, useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { Activity, TripMember } from "@/src/shared/types";
import { Loader } from "@/src/shared/ui/loaders";
import { ActivitiesListModal } from "@/src/widgets/activities_list/ui/activities_list_modal";
import { useActivityStore } from "../model";
import { Coordinate, fetchRoadRoute } from "../model/trip_map_actions";
import { RouteBuilder } from "./route_builder";
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
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);
  const [userRole, setUserRole] = useState<TripMember["role"] | null>(null);
  const mapRef = useRef<MapView>(null);
  const { theme } = useTheme();
  const styles = useGetStyle(theme);
  const {
    activities,
    loading: loadingActivities,
    fetchActivities,
    addActivity,
    updateActivity,
    removeActivity,
    clear,
  } = useActivityStore();

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (!tripId) return;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUserId = session?.user.id || null;

      await Promise.all([
        fetchActivities(tripId),
        supabase
          .from("trip_members")
          .select("role")
          .eq("trip_id", tripId)
          .eq("user_id", currentUserId)
          .single()
          .then((data) => setUserRole(data.data?.role)),
      ]);
    })();

    return () => clear();
  }, [tripId]);

  const routePoints = useMemo(() => {
    return activities
      .filter((a) => a.location?.lat && a.location?.lng)
      .sort((a, b) => {
        if (a.route_order != null && b.route_order != null)
          return a.route_order - b.route_order;
        if (a.route_order != null) return -1;
        if (b.route_order != null) return 1;
        return (a.start_time || "").localeCompare(b.start_time || "");
      })
      .map((a) => ({ latitude: a.location!.lat, longitude: a.location!.lng }));
  }, [activities]);

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
      await addActivity(tripId, {
        ...data,
        location: { lat: selectedCoord.latitude, lng: selectedCoord.longitude },
      } as Activity);
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
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsEditActivityModalVisible(false);
      setSelectedActivity(null);
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
    return <Loader />;
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
          theme === "dark"
            ? require("@/src/shared/styles/map_dark_style.json")
            : require("@/src/shared/styles/map_light_style.json")
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

        <Pressable
          style={styles.routeBuilderBtn}
          onPress={() => setShowRouteBuilder(true)}
        >
          <MaterialIcons name="route" size={20} color="#fff" />
          <Text style={styles.btnText}>Построить маршрут</Text>
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
        onClose={() => {
          setisCreateActivityModalVisible(false);
          setSelectedActivity(null);
          setSelectedCoord(null);
        }}
        onSubmit={handleAddActivity}
        initialCoord={selectedCoord}
      />

      {showRouteBuilder && (
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowRouteBuilder(false)}
        >
          <View style={styles.modalSheet}>
            <RouteBuilder
              tripId={tripId!}
              userRole={userRole}
              onClose={() => setShowRouteBuilder(false)}
            />
          </View>
        </Pressable>
      )}

      {selectedActivity && (
        <EditActivityModal
          visible={isEditActivityModalVisible}
          onClose={() => {
            setIsEditActivityModalVisible(false);
            setSelectedActivity(null);
            setSelectedCoord(null);
          }}
          onSubmit={handleEditActivity}
          onDelete={() => {
            removeActivity(selectedActivity.id);
            setIsEditActivityModalVisible(false);
          }}
          activity={selectedActivity}
        />
      )}

      {isActivitiesListOpen && (
        <ActivitiesListModal
          onClose={() => {
            setIsActivitiesListOpen(false);
            setSelectedActivity(null);
            setSelectedCoord(null);
          }}
          onActivity={(item: Activity) => {
            setSelectedActivity(item);
            setIsEditActivityModalVisible(true);
          }}
          activities={activities}
        />
      )}
    </View>
  );
};
