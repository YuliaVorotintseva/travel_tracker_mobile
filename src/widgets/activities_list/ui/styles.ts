import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const useGetStyles = (theme: Theme) => {
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      height: screenHeight,
      bottom: insets.bottom,
    },
    modalContent: {
      width: (screenWidth / 100) * 70,
      height: (screenHeight / 100) * 70,
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      backgroundColor: Styles[theme].BgPrimary,
    },
    activity: {
      backgroundColor: Styles[theme].BgSecondary,
      marginBottom: 10,
    },
    title: {
      color: Styles[theme].TextPrimary,
      fontSize: 16,
      fontWeight: 500,
    },
    info: {
      color: Styles[theme].TextPrimary,
    },
  });
};
