import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

const { width: screenWidth } = Dimensions.get("window");

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      backgroundColor: Styles[theme].BgPrimary,
    },
    header: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
    content: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
      width: screenWidth,
      gap: 40,
    },
    uploadImgArea: {
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      backgroundColor: Styles[theme].PrimaryDisabled,
      borderRadius: 80,
      width: (screenWidth / 100) * 43,
      height: 160,
      marginTop: 12,
    },
    previewImage: {
      width: (screenWidth / 100) * 43,
      height: 160,
      borderRadius: 80,
    },
    title: {
      color: Styles[theme].TextPrimary,
      fontWeight: "600",
      fontSize: 18,
    },
    text: {
      fontSize: 18,
      fontWeight: "500",
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
    confirmBtn: {
      position: "absolute",
      right: 0,
      borderBottomWidth: 2,
    },
    confirmBtnText: {
      fontSize: 16,
      fontWeight: "500",
    },
    error: {
      color: Styles[theme].TextNegative,
    },
  });
