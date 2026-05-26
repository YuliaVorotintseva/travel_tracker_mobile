import { StyleSheet } from "react-native";

import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";

export const useGetStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 999,
    },
    modalContent: {
      width: "90%",
      height: "70%",
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      backgroundColor: Styles[theme].BgPrimary,
    },
    member: {
      justifyContent: "space-between",
      backgroundColor: Styles[theme].BgSecondary,
      borderRadius: 4,
      padding: 16,
      marginVertical: 10,
      color: Styles[theme].TextPrimary,
    },
    userInfo: {
      justifyContent: "space-between",
      gap: 10,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 20,
    },
    name: {
      color: Styles[theme].TextPrimary,
      marginLeft: 16,
      fontSize: 14,
      fontWeight: "600",
    },
    info: {
      color: Styles[theme].TextPrimary,
    },
  });
};
