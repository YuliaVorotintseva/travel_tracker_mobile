import { Link } from "expo-router";
import { FC } from "react";
import { View } from "react-native";

import { CreateIcon } from "../../../icons";
import { useTheme } from "../../../lib";
import { getStyles } from "./styles";

export const CreateButton: FC<{ href: "/create-trip" }> = ({ href }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.content}>
      <Link href={href}>
        <CreateIcon />
      </Link>
    </View>
  );
};
