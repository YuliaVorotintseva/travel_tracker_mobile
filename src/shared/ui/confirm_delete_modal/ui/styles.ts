import { Dimensions, StyleSheet } from "react-native";

import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const useGetStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      height: screenHeight,
      zIndex: 999,
    },
    modalContent: {
      width: (screenWidth / 100) * 70,
      height: (screenHeight / 100) * 30,
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      backgroundColor: Styles[theme].BgPrimary,
      overflow: "hidden",
    },
    title: {
      color: Styles[theme].TextPrimary,
      fontSize: 24,
      fontWeight: 500,
      alignSelf: "center",
    },
    info: {
      color: Styles[theme].TextPrimary,
      fontSize: 16,
      textAlign: "center",
      flex: 1,
    },
    controls: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    closeBtn: {
      backgroundColor: Styles[theme].IconPositive,
      padding: 10,
      borderRadius: 8,
    },
    deleteBtn: {
      backgroundColor: Styles[theme].NegativeUniversal,
      padding: 10,
      borderRadius: 8,
    },
    textBtn: {
      color: Styles[theme].TextOnColor,
      fontWeight: 500,
      fontSize: 16,
    },
  });
};
