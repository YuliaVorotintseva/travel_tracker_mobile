import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useGetStyle = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      marginBottom: insets.bottom,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: Styles[theme].TextPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: Styles[theme].TextSecondary,
      marginTop: 4,
    },
    error: {
      color: Styles[theme].TextNegative,
      marginVertical: 24,
      textAlign: "center",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
      backgroundColor: Styles[theme].BgSecondary,
      borderRadius: 12,
      marginBottom: 8,
    },
    itemActive: {
      backgroundColor: "#EFF6FF",
      borderWidth: 1,
      borderColor: Styles[theme].BorderUnderline,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: Styles[theme].TextSecondary,
    },
    itemMeta: {
      fontSize: 12,
      color: Styles[theme].TextTertiary,
      marginTop: 2,
    },
    orderBadge: {
      fontSize: 12,
      fontWeight: "700",
      color: Styles[theme].TextTertiary,
      backgroundColor: Styles[theme].BgSecondary,
      padding: 6,
      borderRadius: 8,
    },
    empty: {
      textAlign: "center",
      color: Styles[theme].TextTertiary,
      marginTop: 40,
      fontSize: 14,
    },
    footer: { flexDirection: "row", gap: 12, marginTop: "auto" },
    cancelBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: Styles[theme].BgSecondary,
      alignItems: "center",
    },
    cancelText: {
      color: Styles[theme].TextSecondary,
      fontWeight: "600",
    },
    saveBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      backgroundColor: Styles[theme].IconAccent,
      alignItems: "center",
    },
    saveBtnDisabled: { opacity: 0.6 },
    btnText: {
      color: Styles[theme].TextOnColor,
      fontWeight: "600",
    },
    closeBtn: {
      marginTop: 24,
      padding: 14,
      backgroundColor: Styles[theme].IconAccent,
      borderRadius: 12,
      alignItems: "center",
    },
  });
};
