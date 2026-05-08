import { StyleSheet } from "react-native";

export const getStyles = () =>
  StyleSheet.create({
    member: {
      gap: 10,
    },
    userInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    avatar: {
      width: 32,
      borderRadius: "50%",
    },
    role: {},
  });
