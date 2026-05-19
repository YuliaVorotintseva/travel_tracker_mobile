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
      width: "70%",
      height: "50%",
      padding: 16,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      backgroundColor: Styles[theme].BgPrimary,
    },
    member: {
      backgroundColor: Styles[theme].BgSecondary,
      marginBottom: 10,
    },
    userInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    avatar: {
      width: 32,
      borderRadius: 8,
    },
    role: {},
  });
};
