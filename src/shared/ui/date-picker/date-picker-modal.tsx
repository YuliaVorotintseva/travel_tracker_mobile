import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../lib";
import { parseLocalDateTime } from "../../utils";
import { getStyles } from "./styles";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: string | Date;
  minDate?: Date;
  maxDate?: Date;
  mode?: "date" | "datetime" | "time";
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate,
  minDate,
  maxDate,
  mode = "datetime",
}) => {
  const [tempDate, setTempDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");
  const androidDatetimeRef = useRef<{ date: Date | null; time: Date | null }>({
    date: null,
    time: null,
  });
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const safeDismiss = () => {
    if (Platform.OS === "android" && showPicker) {
      try {
        const androidMode: "date" | "time" = mode === "time" ? "time" : "date";
        DateTimePickerAndroid.dismiss(androidMode);
      } catch (error: unknown) {
        console.error(error);
      }
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (visible) {
      const initDate =
        typeof initialDate === "string"
          ? parseLocalDateTime(initialDate)
          : initialDate;
      setTempDate(initDate ?? new Date());

      if (Platform.OS === "android") {
        setShowPicker(true);
        androidDatetimeRef.current = { date: null, time: null };
      }
    } else {
      safeDismiss();
      androidDatetimeRef.current = { date: null, time: null };
    }
  }, [visible, initialDate]);

  const handleClose = () => {
    safeDismiss();
    onClose();
  };

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        androidDatetimeRef.current = { date: null, time: null };
        safeDismiss();
        handleClose();
        return;
      }
      if (selectedDate) {
        if (!androidDatetimeRef.current.date) {
          androidDatetimeRef.current.date = selectedDate;
          setTimeout(() => {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: "time",
              display: "default",
              minimumDate: minDate,
              maximumDate: maxDate,
              onChange: (timeEvent, timeSelected) => {
                if (timeEvent.type === "set" && timeSelected) {
                  const finalDate = new Date(
                    androidDatetimeRef.current.date!.getFullYear(),
                    androidDatetimeRef.current.date!.getMonth(),
                    androidDatetimeRef.current.date!.getDate(),
                    timeSelected.getHours(),
                    timeSelected.getMinutes(),
                    timeSelected.getSeconds(),
                  );
                  onSelect(finalDate);
                }
                setShowPicker(false);
                handleClose();
              },
            });
          }, 100);
          return;
        }

        setShowPicker(false);
        if (event.type === "set" && selectedDate) {
          onSelect(selectedDate);
        }
        handleClose();
      }
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    onSelect(tempDate);
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
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Choose date</Text>
              <TouchableOpacity onPress={handleConfirm} style={styles.btn}>
                <Text style={styles.confirmText}>Ready</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode={mode}
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
        mode={mode === "datetime" ? "date" : mode}
        display="default"
        onChange={handleChange}
        minimumDate={minDate}
        maximumDate={maxDate}
      />
    );
  }

  return null;
};
