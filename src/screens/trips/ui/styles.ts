import { StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: Styles[theme].BgPrimary,
    },
    noPosts: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loader: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
