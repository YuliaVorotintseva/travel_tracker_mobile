import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/src/shared/lib";
import { Activity, ACTIVITY_TYPES } from "@/src/shared/types";
import { ControlButton, DatePickerModal, SelectPicker } from "@/src/shared/ui";
import { ConfirmDeleteModal } from "@/src/shared/ui/confirm_delete_modal";
import { toLocalDateTime } from "@/src/shared/utils";
import { useGetStyle } from "../../styles";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (activityId: string, data: Partial<Activity>) => void;
  onDelete: () => void;
  activity: Activity;
}

type EditActivityFormData = {
  title: string;
  type: Activity["type"];
  start_time: string;
  end_time: string;
  notes: string;
};

export const EditActivityModal = ({
  visible,
  onClose,
  onSubmit,
  onDelete,
  activity,
}: Props) => {
  const [isStartTimeCalendarVisible, setIsStartTimeCalendarVisible] =
    useState(false);
  const [isEndTimeCalendarVisible, setIsEndTimeCalendarVisible] =
    useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const { theme } = useTheme();
  const styles = useGetStyle(theme);
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<EditActivityFormData>({
    defaultValues: {
      title: activity.title,
      type: activity.type,
      start_time: activity.start_time,
      end_time: activity.end_time,
      notes: activity.notes,
    },
    mode: "onBlur",
  });
  const startDate = useWatch({ control, name: "start_time" });

  const handleSave = handleSubmit(async (input: EditActivityFormData) =>
    onSubmit(activity.id, input),
  );

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

        <KeyboardAvoidingView style={styles.sheet}>
          <Text style={styles.title}>Редактирование активности</Text>
          <Text style={styles.coordText}>
            {`📍 ${activity.location.lat.toFixed(4)}, ${activity.location.lng.toFixed(4)}`}
          </Text>

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
                  visible={isStartTimeCalendarVisible}
                  onClose={() => setIsStartTimeCalendarVisible(false)}
                  onSelect={(date) => {
                    const localDate = toLocalDateTime(new Date(date));
                    onChange(localDate);
                  }}
                  minDate={new Date()}
                />

                <Pressable onPress={() => setIsStartTimeCalendarVisible(true)}>
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
                  visible={isEndTimeCalendarVisible}
                  onClose={() => setIsEndTimeCalendarVisible(false)}
                  onSelect={(date) => {
                    const localDate = toLocalDateTime(new Date(date));
                    onChange(localDate);
                  }}
                  minDate={!!startDate ? new Date(startDate) : new Date()}
                />

                <Pressable onPress={() => setIsEndTimeCalendarVisible(true)}>
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
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  placeholder="Enter your notes"
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

          <ControlButton
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onSubmit={handleSave}
          />

          <ControlButton
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onSubmit={() => setIsConfirmDeleteModalOpen(true)}
            mode="delete"
          />
        </KeyboardAvoidingView>

        {isConfirmDeleteModalOpen && (
          <ConfirmDeleteModal
            onClose={() => setIsConfirmDeleteModalOpen(false)}
            onDelete={() => {
              onDelete();
              onClose();
            }}
            text="Are you sure you want to delete this activity?"
          />
        )}
      </View>
    </Modal>
  );
};
