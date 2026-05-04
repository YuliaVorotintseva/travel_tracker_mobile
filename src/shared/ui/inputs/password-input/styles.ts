import { StyleSheet } from "react-native";

import { Styles } from "../../../styles";
import { Theme } from "../../../types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    label: {
      color: Styles[theme].TextSecondary,
      fontWeight: "600",
      fontSize: 14,
    },
    input: {
      borderBottomColor: Styles[theme].BorderDisabled,
      borderBottomWidth: 2,
      backgroundColor: Styles[theme].BgPrimary,
      color: Styles[theme].TextPrimary,
      paddingTop: 12,
      paddingBottom: 16,
      fontWeight: "400",
      fontSize: 16,
    },
    error: {
      color: Styles[theme].TextNegative,
      fontWeight: "400",
      fontSize: 14,
    },
  });
