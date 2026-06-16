import { StyleSheet } from "react-native";

import { Styles } from "../../../styles";
import { Theme } from "../../../types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 12,
      right: 0,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      height: 20,
      backgroundColor: Styles[theme].BgPrimary,
    },
  });
