import { FC, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { useTheme } from "@/src/shared/lib/theme-context";
import { Styles } from "@/src/shared/styles";
import { ShowPasswordButton } from "../../buttons";
import { getStyles } from "./styles";

type PasswordInputProps = {
  field: any;
  error?: string;
  label: string;
  placeholder: string;
};

export const PasswordInput: FC<PasswordInputProps> = ({
  field,
  error,
  label,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Styles[theme].TextSecondary}
          onBlur={field.onBlur}
          onChangeText={field.onChange}
          value={field.value}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <ShowPasswordButton
          showPassword={showPassword}
          onPress={() => setShowPassword(!showPassword)}
          isValid={!error}
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
