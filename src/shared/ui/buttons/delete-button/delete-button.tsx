import { FC } from "react";
import { Pressable, Text } from "react-native";

import { TrashIcon } from "@/src/shared/icons";
import styles from "./styles";

type DeleteButtonProps = {
  onPress: () => void;
};

export const DeleteButton: FC<DeleteButtonProps> = ({ onPress }) => (
  <Pressable onPress={onPress} style={styles.content}>
    <TrashIcon />
    <Text style={styles.text}>Delete</Text>
  </Pressable>
);
