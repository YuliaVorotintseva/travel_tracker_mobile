import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useGetStyle = (theme: Theme) => {
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    emptyState: {
      position: "absolute",
      top: "40%",
      left: 0,
      right: 0,
      alignItems: "center",
      padding: 24,
      backgroundColor: "rgba(255,255,255,0.95)",
      marginHorizontal: 32,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#0F172A",
      marginTop: 12,
    },
    emptyText: {
      fontSize: 14,
      color: "#64748B",
      textAlign: "center",
      marginTop: 6,
    },
    controls: {
      position: "absolute",
      bottom: insets.bottom + 16,
      left: 16,
      right: 16,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    btn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#0F172A",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    },
    fitBtn: { backgroundColor: Styles[theme].IconAccent },
    settings: {
      top: insets.top + 16,
      left: 16,
    },
    btnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Styles[theme].BgPrimary,
    },
    backBtn: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: "#000",
      alignSelf: "flex-start",
    },
    activityListBtn: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: Styles[theme].IconAccent,
      alignSelf: "flex-start",
    },
    routeBuilderBtn: {
      position: "absolute",
      top: 60,
      right: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: "#0F172A",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    },
    modalOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 1000,
      justifyContent: "flex-end",
    },
    modalSheet: {
      backgroundColor: Styles[theme].BgPrimary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: "65%",
      elevation: 10,
    },
  });
};
