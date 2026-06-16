import { StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    controlBtn: {
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    submitText: {
      color: Styles[theme].TextOnColor,
      fontSize: 16,
      fontWeight: "600",
    },
  });
