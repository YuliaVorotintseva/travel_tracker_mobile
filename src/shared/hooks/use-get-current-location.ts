import * as Location from "expo-location";
import { useCallback, useState } from "react";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
};

export const useGetCurrentLocation = () => {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error(
          "Geolocation permission is not granted. Please enable it in settings",
        );
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setData({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        timestamp: loc.timestamp,
      });
    } catch (error: unknown) {
      setError((error as { message: string }).message);
    } finally {
      setLoading(false);
    }
  }, [data]);

  return { data, loading, error, fetchLocation };
};
