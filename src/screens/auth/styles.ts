import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types/types";

const { width: screenWidth } = Dimensions.get("window");

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 16,
      backgroundColor: Styles[theme].BgPrimary,
      width: screenWidth,
      gap: 40,
    },
    providersConteiner: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 50,
    },
    title: {
      color: Styles[theme].TextAccent,
      fontWeight: "400",
      fontSize: 32,
    },
    text: {
      fontSize: 16,
      color: Styles[theme].TextPrimary,
    },
    formInputs: {
      justifyContent: "center",
      gap: 16,
      width: "100%",
    },
    label: {
      color: Styles[theme].TextSecondary,
      fontWeight: "600",
      fontSize: 14,
    },
    input: {
      borderBottomColor: Styles[theme].BorderDisabled,
      borderBottomWidth: 2,
      backgroundColor: Styles[theme].BgPrimary,
      color: Styles[theme].TextPrimary,
      paddingTop: 12,
      paddingBottom: 16,
      fontWeight: "400",
      fontSize: 16,
      width: "100%",
    },
    formBtns: {
      bottom: 0,
      justifyContent: "space-around",
      alignItems: "center",
      alignSelf: "center",
      gap: 20,
      width: screenWidth,
    },
    auth: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 4,
    },
    authText: {
      color: Styles[theme].TextSecondary,
    },
    confirmBtn: {
      width: (screenWidth / 100) * 92,
      height: 56,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmBtnText: {
      color: Styles[theme].TextContrast,
      fontWeight: "500",
      fontSize: 16,
    },
    authBtn: {
      backgroundColor: Styles[theme].BgPrimary,
      borderBottomColor: Styles[theme].BorderDefault,
      borderBottomWidth: 1,
    },
    authBtnText: {
      color: Styles[theme].TextAccent,
      fontWeight: "500",
      fontSize: 16,
    },
    error: {
      color: Styles[theme].TextNegative,
    },
  });
