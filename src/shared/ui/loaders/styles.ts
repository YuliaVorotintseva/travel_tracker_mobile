import { StyleSheet } from "react-native";

import { Styles } from "../../styles";
import { Theme } from "../../types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Styles[theme].BgPrimary,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 50,
      width: "100%",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
  });
