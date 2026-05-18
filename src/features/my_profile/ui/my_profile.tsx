import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { CloseIcon } from "@/src/shared/icons";
import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { IconBackButton } from "@/src/shared/ui";
import { AvatarPicker } from "@/src/shared/ui/avatar-picker/avatar-picker";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  defaultProfileValues,
  ProfileFormData,
  ProfileFormResolver,
} from "../lib/form-resolver";
import { useMyProfileStore } from "../model";
import { getStyles } from "./styles";

export const MyProfile: FC = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { myData, error, fetchMyData, updateMyData, clear } =
    useMyProfileStore();
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: defaultProfileValues,
    resolver: ProfileFormResolver,
    mode: "onChange",
  });

  useEffect(() => {
    fetchMyData();
    return () => clear();
  }, []);

  useEffect(() => {
    reset({
      full_name: !!myData ? myData?.full_name : "",
      email: !!myData ? myData?.email : "",
    });
  }, [myData]);

  const onSubmit = handleSubmit(async (input: ProfileFormData) => {
    if (!myData) return;

    const editedData = {
      ...myData,
      ...input,
    };

    updateMyData(editedData);
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <IconBackButton icon={<CloseIcon />} />
            <Text style={styles.title}>Profile</Text>
            <Pressable
              onPress={onSubmit}
              style={[
                styles.confirmBtn,
                {
                  borderBottomColor:
                    isDirty && !isSubmitting
                      ? Styles[theme].BorderDefault
                      : Styles[theme].BgPrimary,
                },
              ]}
              disabled={!isDirty || isSubmitting}
            >
              <Text
                style={[
                  styles.confirmBtnText,
                  {
                    color:
                      isDirty && !isSubmitting
                        ? Styles[theme].TextPositive
                        : Styles[theme].TextTertiary,
                  },
                ]}
              >
                Save
              </Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.formInputs}>
              <View style={styles.uploadImgArea}>
                <AvatarPicker
                  userId={myData?.id!}
                  currentAvatarUrl={myData?.avatar_url}
                />
              </View>

              <View style={styles.formInputs}>
                <Text style={styles.text}>Personal info</Text>
                <Controller
                  name="full_name"
                  control={control}
                  render={({
                    field: { onBlur, onChange, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <Text style={styles.label}>First name</Text>
                      <TextInput
                        placeholder="Enter your first name"
                        placeholderTextColor={Styles[theme].TextSecondary}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        style={styles.input}
                      />
                      {!!error && (
                        <Text style={styles.error}>{error.message}</Text>
                      )}
                    </View>
                  )}
                />
              </View>

              <Controller
                name="email"
                control={control}
                render={({
                  field: { onBlur, onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                      placeholder="Enter your e-mail"
                      placeholderTextColor={Styles[theme].TextSecondary}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                    {!!error && (
                      <Text style={styles.error}>{error.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
          <View>{!!error && <Text style={styles.error}>{error}</Text>}</View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
