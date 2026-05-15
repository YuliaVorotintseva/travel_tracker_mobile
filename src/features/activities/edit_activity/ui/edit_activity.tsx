import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { Activity, ACTIVITY_TYPES } from "@/src/shared/types";
import { DatePickerModal, SelectPicker } from "@/src/shared/ui";
import { ConfirmDeleteModal } from "@/src/shared/ui/confirm_delete_modal";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
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
  onSubmit: (activityId: string, data: Partial<Activity>) => void;
  onDelete: () => void;
  activity: Activity;
}

type EditActivityFormData = {
  title: string;
  type: Activity["type"];
  start_time: string;
  notes: string;
};

export const EditActivityModal = ({
  visible,
  onClose,
  onSubmit,
  onDelete,
  activity,
}: Props) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
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
      notes: activity.notes,
    },
    mode: "onBlur",
  });

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
                  visible={isCalendarVisible}
                  onClose={() => setIsCalendarVisible(false)}
                  onSelect={onChange}
                  minDate={new Date()}
                />

                <Pressable onPress={() => setIsCalendarVisible(true)}>
                  <Text style={styles.label}>Start day</Text>
                  <TextInput
                    placeholder="Enter start day"
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
            <Text style={styles.submitText}>Save changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={StyleSheet.compose(styles.controlBtn, {
              backgroundColor: isSubmitting
                ? Styles[theme].PrimaryDisabled
                : Styles[theme].NegativeUniversal,
            })}
            onPress={() => setIsConfirmDeleteModalOpen(true)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>Delete activity</Text>
          </TouchableOpacity>
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
