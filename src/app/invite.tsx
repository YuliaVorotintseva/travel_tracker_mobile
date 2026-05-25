import { useLocalSearchParams, useRouter } from "expo-router";

import { InviteScreen } from "../screens/invite/ui/invite";

const Page = () => {
  const params = useLocalSearchParams<{ trip_id: string; code: string }>();
  const router = useRouter();

  const trip_id =
    typeof params.trip_id === "string" ? params.trip_id : undefined;
  const code = typeof params.code === "string" ? params.code : undefined;

  if (!trip_id || !code) {
    router.replace("/(tabs)/my-trips");
    return null;
  }

  return <InviteScreen trip_id={trip_id} code={code} />;
};

export default Page;
