import { useRouter } from "expo-router";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useTheme } from "@/src/shared/lib/theme-context";
import { Styles } from "@/src/shared/styles";
import { PasswordInput } from "@/src/shared/ui/inputs";
import { getStyles } from "../../styles";
import { defaultSignUpValues, SignUpFormData } from "../lib";
import { SignUpParams, useLogup } from "../model";

export const SignUpScreen: FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { logup, error } = useLogup();
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: defaultSignUpValues,
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (input: SignUpParams) => {
    try {
      await logup(input);
    } catch (error: unknown) {
      console.error(error);
    }
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View>
            <Text style={styles.title}>Join us</Text>
          </View>
          <View style={styles.formInputs}>
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
                  {!!error && <Text style={styles.error}>{error.message}</Text>}
                </View>
              )}
            />
            <Controller
              name="fullName"
              control={control}
              render={({
                field: { onBlur, onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <Text style={styles.label}>Your name</Text>
                  <TextInput
                    placeholder="Enter your name"
                    placeholderTextColor={Styles[theme].TextSecondary}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  {!!error && <Text style={styles.error}>{error.message}</Text>}
                </View>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  field={field}
                  error={error?.message}
                  label="Password"
                  placeholder="Enter your password"
                />
              )}
            />
            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  field={field}
                  error={error?.message}
                  label="Confirm password"
                  placeholder="Confirm your password"
                />
              )}
            />
          </View>
          <View>{!!error && <Text style={styles.error}>{error}</Text>}</View>
          <View style={styles.formBtns}>
            <View style={styles.auth}>
              <Text style={styles.text}>Already have an account?</Text>
              <Pressable onPress={() => router.back()} style={styles.authBtn}>
                <Text style={styles.authBtnText}>Log in</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={onSubmit}
              style={[
                styles.confirmBtn,
                {
                  backgroundColor:
                    isDirty && !isSubmitting
                      ? Styles[theme].PrimaryInitial
                      : Styles[theme].PrimaryDisabled,
                },
              ]}
              disabled={!isDirty || isSubmitting}
            >
              <Text style={styles.confirmBtnText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
