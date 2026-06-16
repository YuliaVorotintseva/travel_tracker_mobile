import { Dimensions, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../lib";
import { Styles } from "../../styles";

const { height } = Dimensions.get("window");

export const useGetStyles = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return StyleSheet.create({
    trigger: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: Styles[theme].BorderDefault,
      borderRadius: 12,
      padding: 14,
      backgroundColor: Styles[theme].BgPrimary,
    },
    triggerDisabled: {
      opacity: 0.5,
      backgroundColor: Styles[theme].BgTertiary,
    },
    triggerText: {
      fontSize: 16,
      color: Styles[theme].TextPrimary,
    },
    placeholder: {
      color: Styles[theme].TextSecondary,
    },
    arrow: {
      fontSize: 12,
      color: Styles[theme].TextTertiary,
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
      maxHeight: height * 0.65,
      paddingBottom: insets.bottom + 20,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: "700",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Styles[theme].BorderUnderline,
    },
    searchInput: {
      margin: 12,
      padding: 12,
      backgroundColor: Styles[theme].BgSecondary,
      borderRadius: 10,
      fontSize: 16,
    },
    list: { maxHeight: height * 0.45 },
    optionItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: Styles[theme].BorderUnderline,
    },
    optionItemSelected: {
      backgroundColor: Styles[theme].BgSecondary,
    },
    optionContent: { flexDirection: "row", alignItems: "center", gap: 10 },
    optionIcon: { fontSize: 18 },
    optionText: {
      fontSize: 16,
      color: Styles[theme].TextPrimary,
    },
    optionTextSelected: {
      color: Styles[theme].TextAccent,
      fontWeight: "600",
    },
    checkmark: {
      fontSize: 20,
      color: Styles[theme].IconAccent,
      fontWeight: "bold",
    },
    emptyText: {
      textAlign: "center",
      padding: 24,
      color: Styles[theme].TextSecondary,
      fontSize: 16,
    },
  });
};
