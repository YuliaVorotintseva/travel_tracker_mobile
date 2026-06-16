import { useLocalSearchParams } from "expo-router";

import { Profile } from "@/src/entities/users/profiles/ui/profile";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Profile userId={id} />;
};

export default Page;
