import { Dimensions, StyleSheet } from "react-native";

import { Styles } from "@/src/shared/styles";
import { Theme } from "@/src/shared/types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("screen");

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: Styles[theme].BgPrimary,
      height: screenHeight,
    },
    header: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    content: {
      paddingTop: 28,
    },
    createdAt: {
      alignSelf: "center",
      color: Styles[theme].TextSecondary,
      fontSize: 14,
      marginBottom: 8,
    },
    uploadImgArea: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Styles[theme].BgSecondary,
      borderColor: Styles[theme].BorderDefault,
      borderStyle: "dashed",
      borderRadius: 24,
      borderWidth: 2,
      width: (screenWidth / 100) * 92,
      height: 166,
      marginBottom: 24,
    },
    previewImage: {
      width: (screenWidth / 100) * 92,
      height: 166,
      borderRadius: 24,
    },
    uploadIcon: {
      justifyContent: "center",
      alignItems: "center",
    },
    label: {
      color: Styles[theme].TextSecondary,
      fontWeight: "600",
      fontSize: 14,
    },
    inputs: {
      justifyContent: "space-between",
      gap: 20,
      marginBottom: 52,
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
