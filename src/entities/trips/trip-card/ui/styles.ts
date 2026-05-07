import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types/types";

const { width: screenWidth } = Dimensions.get("screen");

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: Styles[theme].BgSecondary,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
      marginBottom: 4,
      width: screenWidth,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    content: {},
    img: {
      marginTop: 12,
      marginBottom: 20,
      borderRadius: 17,
      width: "100%",
      height: 226,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    userInfo: {
      flexDirection: "row",
      gap: 8,
    },
    btns: {
      flexDirection: "row",
      gap: 12,
    },
    text: {
      color: Styles[theme].TextPrimary,
    },
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 20,
    },
  });
