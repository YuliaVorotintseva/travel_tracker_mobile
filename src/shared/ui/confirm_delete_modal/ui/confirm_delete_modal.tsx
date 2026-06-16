import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useGetStyles } from "./styles";

type Props = {
  onDelete: () => void;
  onClose: () => void;
  text: string;
};

export const ConfirmDeleteModal: FC<Props> = ({ onDelete, onClose, text }) => {
  const styles = useGetStyles();

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.modalContent}>
        <Text style={styles.title}>Attention!</Text>
        <Text style={styles.info}>{text}</Text>
        <View style={styles.controls}>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.textBtn}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.textBtn}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
