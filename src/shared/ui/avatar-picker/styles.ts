import { StyleSheet } from "react-native";

import { Styles } from "../../styles";
import { Theme } from "../../types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    avatarWrapper: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: Styles[theme].BorderDefault,
      position: "relative",
    },
    avatar: { width: "100%", height: "100%" },
    editBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: Styles[theme].BgPrimary,
      borderRadius: 12,
      padding: 4,
    },
    editText: {
      color: Styles[theme].TextContrast,
      fontSize: 12,
    },
    error: {
      color: Styles[theme].TextNegative,
      marginTop: 8,
      textAlign: "center",
      fontSize: 12,
    },
    overlay: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
      backgroundColor: Styles[theme].BgPrimary,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingBottom: 24,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 16,
      color: Styles[theme].TextPrimary,
    },

    option: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: Styles[theme].BgSecondary,
      marginBottom: 8,
    },
    fallbackOption: {
      backgroundColor: Styles[theme].BgTertiary,
      borderLeftWidth: 3,
      borderLeftColor: Styles[theme].IconAccent,
    },
    optionIcon: { fontSize: 24, marginRight: 12 },
    optionText: {
      fontSize: 16,
      color: Styles[theme].TextSecondary,
    },
    cancelBtn: { marginTop: 12, padding: 14, alignItems: "center" },
    cancelText: {
      fontSize: 16,
      color: Styles[theme].TextTertiary,
      fontWeight: "500",
    },
  });
