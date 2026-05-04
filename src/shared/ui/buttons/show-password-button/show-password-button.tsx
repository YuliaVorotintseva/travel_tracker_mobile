import { FC } from "react";
import { Pressable, View } from "react-native";

import { HidePasswordIcon, ShowPasswordIcon } from "../../../icons";
import { useTheme } from "../../../lib/theme-context";
import { getStyles } from "./styles";

type ShowPasswordButtonProps = {
  showPassword: boolean;
  onPress: () => void;
  isValid: boolean;
};

export const ShowPasswordButton: FC<ShowPasswordButtonProps> = ({
  showPassword,
  onPress,
  isValid,
}) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.content}>
        {showPassword ? (
          <ShowPasswordIcon isValid={isValid} />
        ) : (
          <HidePasswordIcon isValid={isValid} />
        )}
      </Pressable>
    </View>
  );
};
