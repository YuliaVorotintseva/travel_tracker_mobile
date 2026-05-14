import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useGetStyle = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return StyleSheet.create({
    overlay: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheet: {
      backgroundColor: Styles[theme].BgPrimary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 20,
      paddingBottom: insets.bottom + 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 4,
      color: Styles[theme].TextPrimary,
    },
    coordText: {
      fontSize: 13,
      color: Styles[theme].TextSecondary,
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: Styles[theme].BorderDefault,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      backgroundColor: Styles[theme].BgSecondary,
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: Styles[theme].TextSecondary,
      marginBottom: 6,
    },
    dateBtn: {
      borderWidth: 1,
      borderColor: Styles[theme].BorderDefault,
      borderRadius: 12,
      padding: 14,
      backgroundColor: Styles[theme].BgSecondary,
      marginBottom: 12,
    },
    dateText: {
      fontSize: 16,
      color: Styles[theme].TextSecondary,
    },
    submitBtn: {
      backgroundColor: Styles[theme].IconAccent,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
    },
    submitText: {
      color: Styles[theme].TextOnColor,
      fontSize: 16,
      fontWeight: "600",
    },
  });
};
