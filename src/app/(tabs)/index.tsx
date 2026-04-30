import { Pressable, Text, View } from "react-native";

import {
  useSignInAppleAuth,
  useSignInGoogleAuth,
} from "@/src/features/sign-in/model";

export default function HomeScreen() {
  const { signInWithGoogle } = useSignInGoogleAuth();
  const { signInWithApple } = useSignInAppleAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <Pressable onPress={signInWithGoogle}>
        <Text>Google</Text>
      </Pressable>
      <Pressable onPress={signInWithApple}>
        <Text>Apple</Text>
      </Pressable>
    </View>
  );
}
