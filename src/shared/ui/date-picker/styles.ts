import { StyleSheet } from "react-native";

import { Styles } from "../../styles";
import { Theme } from "../../types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: Styles[theme].BgPrimary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Styles[theme].BorderUnderline,
    },
    title: {
      fontSize: 17,
      fontWeight: "600",
      color: Styles[theme].TextPrimary,
    },
    cancelText: {
      fontSize: 16,
      color: Styles[theme].TextNegative,
    },
    confirmText: {
      fontSize: 16,
      color: Styles[theme].TextPositive,
      fontWeight: "600",
    },
    picker: { height: 180, width: "100%" },
    btn: { padding: 4 },
  });
