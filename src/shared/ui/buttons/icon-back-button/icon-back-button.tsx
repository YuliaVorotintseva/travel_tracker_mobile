import { useRouter } from "expo-router";
import { FC, ReactNode } from "react";
import { Pressable } from "react-native";

export const IconBackButton: FC<{ icon: ReactNode }> = ({ icon }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.back()}
      style={{ position: "absolute", left: 0 }}
    >
      {icon}
    </Pressable>
  );
};
