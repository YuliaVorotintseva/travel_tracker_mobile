import { Activity } from "@/src/shared/types";
import * as Location from "expo-location";

export interface Coordinate {
  latitude: number;
  longitude: number;
}

const decodePolyline = (encoded: string): Coordinate[] => {
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;
  const coordinates: Coordinate[] = [];

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return coordinates;
};

export const fetchRoadRoute = async (
  points: Coordinate[],
  mode: "driving" | "walking" | "bicycling" = "walking",
): Promise<Coordinate[] | null> => {
  if (points.length < 2) return null;

  const url = `https://router.project-osrm.org/route/v1/walking/${points
    .map((p) => `${p.longitude},${p.latitude}`)
    .join(";")}?overview=full&geometries=polyline`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    if (json.code !== "Ok" || !json.routes?.[0]) {
      console.warn("Directions API:", json.code, json.error_message);
      return null;
    }

    const allCoords: Coordinate[] = [];
    for (const leg of json.routes[0].legs) {
      for (const step of leg.steps) {
        if (step.polyline?.points) {
          allCoords.push(...decodePolyline(step.polyline.points));
        }
      }
    }
    return allCoords;
  } catch (err) {
    console.error("Route fetch failed:", err);
    return null;
  }
};

const fetchAddress = async (
  lat: number,
  lng: number,
): Promise<string | null> => {
  try {
    const [place] = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });
    if (!place) return null;

    const parts = [place.name, place.street, place.city, place.region].filter(
      Boolean,
    );
    return parts.length > 0
      ? parts.join(", ")
      : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch (error: unknown) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};

export const addAddressesToActivities = async (
  activities: Activity[],
): Promise<Activity[]> => {
  const results = await Promise.allSettled(
    activities.map(async (activity) => {
      if (!activity.location?.lat || !activity.location.lng) return activity;
      const address = await fetchAddress(
        activity.location.lat,
        activity.location.lng,
      );
      return { ...activity, location: { ...activity.location, address } };
    }),
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<Activity> => r.status === "fulfilled",
    )
    .map((r) => r.value);
};
