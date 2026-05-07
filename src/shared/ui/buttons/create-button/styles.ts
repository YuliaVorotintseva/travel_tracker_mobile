import { StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    content: {
      position: "absolute",
      right: 50,
      bottom: 0,
      height: 56,
      width: 56,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Styles[theme].TextButtonAccentInitial,
    },
  });
