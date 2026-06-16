import { StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      marginTop: 16,
      borderTopWidth: 1,
      borderColor: Styles[theme].BorderDefault,
      paddingTop: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 12,
      color: Styles[theme].TextPrimary,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      minHeight: 40,
      backgroundColor: Styles[theme].BgSecondary,
      color: Styles[theme].TextPrimary,
      borderColor: Styles[theme].BorderAccent,
    },
    sendBtn: {
      backgroundColor: Styles[theme].IconAccent,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      justifyContent: "center",
    },
    sendBtnDisabled: {
      backgroundColor: Styles[theme].IconDisabled,
    },
    sendText: {
      color: Styles[theme].TextOnColor,
      fontWeight: "600",
      fontSize: 13,
    },
    commentItem: {
      flexDirection: "row",
      padding: 10,
      borderRadius: 12,
      marginBottom: 8,
      gap: 10,
    },
    avatar: { width: 32, height: 32, borderRadius: 16 },
    commentBody: { flex: 1 },
    commentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    author: {
      fontSize: 13,
      fontWeight: "600",
      color: Styles[theme].TextPrimary,
    },
    date: {
      fontSize: 11,
      color: Styles[theme].TextSecondary,
    },
    content: {
      fontSize: 14,
      lineHeight: 20,
      color: Styles[theme].TextPrimary,
    },
    deleteBtn: { alignSelf: "flex-start", marginTop: 4 },
    deleteText: {
      fontSize: 11,
      color: Styles[theme].NegativeUniversal,
      fontWeight: "500",
    },
    empty: {
      textAlign: "center",
      fontSize: 13,
      paddingVertical: 16,
      color: Styles[theme].TextTertiary,
    },
  });
