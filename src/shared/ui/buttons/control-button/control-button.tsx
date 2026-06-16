import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { FC } from "react";
import { getStyles } from "./styles";

type ControlButtonProps = {
  isDirty: boolean;
  isSubmitting: boolean;
  mode?: "save" | "delete";
  onSubmit: () => void;
};

export const ControlButton: FC<ControlButtonProps> = ({
  isDirty,
  isSubmitting,
  mode = "save",
  onSubmit,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.controlBtn, {
        backgroundColor:
          !isDirty || isSubmitting
            ? Styles[theme].PrimaryDisabled
            : mode === "save"
              ? Styles[theme].IconAccent
              : Styles[theme].NegativeUniversal,
      })}
      onPress={onSubmit}
      disabled={!isDirty || isSubmitting}
    >
      <Text style={styles.submitText}>
        {mode === "save" ? "Save" : "Delete"}
      </Text>
    </TouchableOpacity>
  );
};
