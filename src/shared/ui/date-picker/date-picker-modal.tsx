import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../lib";
import { getStyles } from "./styles";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate,
  minDate,
  maxDate,
}) => {
  const [tempDate, setTempDate] = useState(new Date());
  const { theme } = useTheme();
  const styles = getStyles(theme);

  useEffect(() => {
    if (visible) {
      setTempDate(initialDate ? new Date(initialDate) : new Date());
    }
  }, [visible, initialDate]);

  const handleClose = () => onClose();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") return handleClose();
      if (selectedDate) {
        onSelect(selectedDate.toDateString());
        handleClose();
      }
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onSelect(tempDate.toDateString());
    handleClose();
  };

  if (Platform.OS === "ios") {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={handleClose}
          />
          <View style={styles.sheet}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.btn}>
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Выберите дату</Text>
              <TouchableOpacity onPress={handleConfirm} style={styles.btn}>
                <Text style={styles.confirmText}>Готово</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleChange}
              minimumDate={minDate}
              maximumDate={maxDate}
              style={styles.picker}
            />
          </View>
        </View>
      </Modal>
    );
  }

  if (visible) {
    return (
      <DateTimePicker
        value={tempDate}
        mode="datetime"
        display="default"
        onChange={handleChange}
        minimumDate={minDate}
        maximumDate={maxDate}
      />
    );
  }

  return null;
};
