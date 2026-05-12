import { useLocalSearchParams } from "expo-router";

import { TripMapScreen } from "@/src/screens/trip_map/ui/trip_map";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TripMapScreen tripId={id} />;
};

export default Page;
