import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { Activity, ACTIVITY_TYPES } from "@/src/shared/types";
import { DatePickerModal, SelectPicker } from "@/src/shared/ui";
import { getFormatDate, toLocalISODate } from "@/src/shared/utils";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetStyle } from "../../styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Activity>) => void;
  initialCoord: { latitude: number; longitude: number } | null;
}

type CreateActivityFormData = {
  title: string;
  type: Activity["type"];
  start_time: string;
  end_time: string;
  notes: string;
};

export const CreateActivityModal = ({
  visible,
  onClose,
  onSubmit,
  initialCoord,
}: Props) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { theme } = useTheme();
  const styles = useGetStyle(theme);
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<CreateActivityFormData>({
    defaultValues: {
      title: "",
      type: "custom",
      start_time: getFormatDate(new Date(Date.now())),
      end_time: getFormatDate(new Date(Date.now())),
    },
    mode: "onBlur",
  });
  const startDate = useWatch({ control, name: "start_time" });

  const handleSave = handleSubmit(async (input: CreateActivityFormData) => {
    reset();
    onSubmit(input);
  });

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

          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { error },
            }) => (
              <View>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  placeholder="Enter title of activity"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={styles.input}
                />
                {!!error && <Text>{error.message}</Text>}
              </View>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.label}>Choose currency</Text>
                <SelectPicker
                  value={value}
                  onChange={onChange}
                  options={ACTIVITY_TYPES}
                  searchable={false}
                />
              </View>
            )}
          />

          <Controller
            name="start_time"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View>
                <DatePickerModal
                  visible={isCalendarVisible}
                  onClose={() => setIsCalendarVisible(false)}
                  onSelect={(date) => {
                    const localDate = toLocalISODate(new Date(date));
                    onChange(localDate);
                  }}
                  minDate={new Date()}
                />

                <Pressable onPress={() => setIsCalendarVisible(true)}>
                  <Text style={styles.label}>Start time</Text>
                  <TextInput
                    placeholder="Enter start time"
                    onChange={onChange}
                    value={value}
                    autoCapitalize="none"
                    style={styles.input}
                    editable={false}
                  />
                </Pressable>
              </View>
            )}
          />

          <Controller
            name="end_time"
            control={control}
            render={({ field: { onChange, value } }) => (
              <View>
                <DatePickerModal
                  visible={isCalendarVisible}
                  onClose={() => setIsCalendarVisible(false)}
                  onSelect={(date) => {
                    const localDate = toLocalISODate(new Date(date));
                    onChange(localDate);
                  }}
                  minDate={!!startDate ? new Date(startDate) : new Date()}
                />

                <Pressable onPress={() => setIsCalendarVisible(true)}>
                  <Text style={styles.label}>End time</Text>
                  <TextInput
                    placeholder="Enter end time"
                    value={value}
                    autoCapitalize="none"
                    style={styles.input}
                    editable={false}
                  />
                </Pressable>
              </View>
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({
              field: { onBlur, onChange, value },
              fieldState: { error },
            }) => (
              <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  placeholder="Enter description of the trip"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                  style={styles.input}
                />
                {!!error && <Text>{error.message}</Text>}
              </View>
            )}
          />

          <TouchableOpacity
            style={StyleSheet.compose(styles.controlBtn, {
              backgroundColor:
                !isDirty || isSubmitting
                  ? Styles[theme].PrimaryDisabled
                  : Styles[theme].IconAccent,
            })}
            onPress={handleSave}
            disabled={!isDirty || isSubmitting}
          >
            <Text style={styles.submitText}>Save activity</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
