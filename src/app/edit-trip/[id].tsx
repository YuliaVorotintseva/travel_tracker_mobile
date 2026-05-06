import { useLocalSearchParams } from "expo-router";

import { EditTrip } from "@/src/features/trips/edit-trip";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <EditTrip tripId={id} />;
};

export default Page;
