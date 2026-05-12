import { Activity, ACTIVITY_TYPES } from "@/src/shared/types";
import { DatePickerModal, SelectPicker } from "@/src/shared/ui";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Activity>) => void;
  initialCoord: { latitude: number; longitude: number } | null;
}

export const CreateActivityModal = ({
  visible,
  onClose,
  onSubmit,
  initialCoord,
}: Props) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Activity["type"]>("custom");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle("");
      setType("custom");
      setStartTime(new Date());
      setNotes("");
    }
  }, [visible]);

  const handleSubmit = () => {
    if (!title.trim())
      return Alert.alert("Ошибка", "Введите название мероприятия");

    onSubmit({
      title: title.trim(),
      type,
      start_time: startTime?.toISOString() ?? null,
      notes: notes.trim() || null,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.sheet}>
          <Text style={styles.title}>Добавить точку</Text>
          {initialCoord && (
            <Text style={styles.coordText}>
              📍 {initialCoord.latitude.toFixed(4)},{" "}
              {initialCoord.longitude.toFixed(4)}
            </Text>
          )}

          <TextInput
            placeholder="Название (например: Колизей)"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Тип</Text>
          <SelectPicker
            options={ACTIVITY_TYPES}
            value={type}
            onChange={setType}
          />

          <Text style={styles.label}>Время начала</Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setIsCalendarVisible(true)}
          >
            <Text style={styles.dateText}>
              {startTime ? startTime.toLocaleString("ru-RU") : "Выберите время"}
            </Text>
          </TouchableOpacity>

          {isCalendarVisible && (
            <DatePickerModal
              visible={isCalendarVisible}
              onClose={() => setIsCalendarVisible(false)}
              onSelect={(date) => {
                setIsCalendarVisible(false);
                if (date) setStartTime(new Date(date));
              }}
            />
          )}

          <TextInput
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { height: 80 }]}
            multiline
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Save activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
