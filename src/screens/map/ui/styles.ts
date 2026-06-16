import { StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Styles[theme].BgPrimary,
    },
    containerBtns: {
      gap: 20,
    },
    btn: {
      top: 50,
      left: 25,
      padding: 10,
      borderRadius: 8,
      backgroundColor: Styles[theme].BgPrimary,
      alignSelf: "flex-start",
    },
    text: {
      color: Styles[theme].TextButtonInitial,
      fontWeight: "600",
    },
  });
