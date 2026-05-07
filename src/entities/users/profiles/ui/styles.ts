import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

const { width: screenWidth } = Dimensions.get("window");

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      backgroundColor: Styles[theme].BgPrimary,
    },
    header: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      width: screenWidth,
      gap: 40,
    },
    avatar: {
      width: (screenWidth / 100) * 80,
      borderRadius: 80,
    },
    title: {
      color: Styles[theme].TextPrimary,
      fontWeight: "600",
      fontSize: 18,
    },
    text: {
      fontSize: 18,
      fontWeight: "500",
      color: Styles[theme].TextPrimary,
    },
  });
