import { CloseIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { IconBackButton } from "@/src/shared/ui";
import { AvatarPicker } from "@/src/shared/ui/avatar-picker/avatar-picker";
import { User } from "@supabase/supabase-js";
import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { getStyles } from "./styles";

type EditProfileFormData = {
  full_name: string;
  email: string;
};

export const MyProfile: FC = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      full_name: "",
      email: "",
    },
  });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch((error: unknown) => {
        setError((error as { message: string }).message);
        console.error((error as { message: string }).message);
      });
  }, []);

  const onSubmit = handleSubmit(async (input: EditProfileFormData) => {
    const editedData = {
      id: user?.id,
      ...input,
    };
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
                  userId={user?.id!}
                  currentAvatarUrl={user?.user_metadata["avatar_url"]}
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
