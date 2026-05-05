import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      height: screenHeight,
    },
    modalContent: {
      flexGrow: 1,
      justifyContent: "space-between",
      width: (screenWidth / 100) * 77,
      paddingTop: 80,
      paddingBottom: 40,
      paddingHorizontal: 32,
      backgroundColor: Styles[theme].BgPrimary,
    },
    profileSettings: {
      justifyContent: "space-between",
      gap: 60,
    },
    userInfo: {
      justifyContent: "space-between",
      gap: 12,
    },
    avatar: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 40,
      width: 80,
      height: 80,
    },
    options: {
      gap: 32,
    },
    option: {
      flexDirection: "row",
      gap: 8,
    },
    optionText: {
      fontSize: 18,
      color: Styles[theme].TextPrimary,
    },
  });
