import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AvatarSource, useAvatarUpload } from "../../hooks";
import { useTheme } from "../../lib";
import { getStyles } from "./styles";

interface AvatarPickerProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadSuccess?: (url: string) => void;
}

export const AvatarPicker = ({
  userId,
  currentAvatarUrl,
  onUploadSuccess,
}: AvatarPickerProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { upload, isUploading, error } = useAvatarUpload(userId);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const handleSourceSelect = async (source: AvatarSource) => {
    setModalVisible(false);
    const url = await upload(source);
    if (url && onUploadSuccess) onUploadSuccess(url);
  };

  const handleFallbackUpload = async () => {
    const url = await upload();
    if (url && onUploadSuccess) onUploadSuccess(url);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.avatarWrapper}
        onPress={() => setModalVisible(true)}
        disabled={isUploading}
        activeOpacity={0.7}
      >
        {isUploading ? (
          <View style={styles.avatar}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : (
          <Image
            source={
              currentAvatarUrl
                ? { uri: currentAvatarUrl }
                : require("@/assets/images/account80.png")
            }
            style={styles.avatar}
          />
        )}
        <View style={styles.editBadge}>
          <Text style={styles.editText}>✎</Text>
        </View>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}
      {(() => {
        if (!!error) console.error(error);
      })()}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select source</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSourceSelect("camera")}
            >
              <Text style={styles.optionIcon}>📷</Text>
              <Text style={styles.optionText}>Create photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSourceSelect("gallery")}
            >
              <Text style={styles.optionIcon}>🖼️</Text>
              <Text style={styles.optionText}>Select from gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, styles.fallbackOption]}
              onPress={handleFallbackUpload}
            >
              <Text style={styles.optionText}>
                ⚡ Quick selection (camera → gallery)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};
