import { useRouter } from "expo-router";
import React, { FC } from "react";
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

import {
  useSignInAppleAuth,
  useSignInGoogleAuth,
} from "@/src/features/sign-in/model";
import { AppleIcon } from "@/src/shared/icons/apple-icon";
import { GoogleIcon } from "@/src/shared/icons/google-icon";
import { useTheme } from "@/src/shared/lib/theme-context";
import { Styles } from "@/src/shared/styles";
import { PasswordInput } from "@/src/shared/ui/inputs";
import { getStyles } from "../../styles";
import { SignInFormData, defaultSignInValues } from "../lib/form-resolver";
import { SignInParams, useLogin } from "../model";

export const SignInScreen: FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { signInWithGoogle } = useSignInGoogleAuth();
  const { signInWithApple } = useSignInAppleAuth();
  const { login, error } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: defaultSignInValues,
    mode: "onChange",
  });

  const onSubmit = handleSubmit(async (input: SignInParams) => {
    try {
      await login(input);
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
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.text}>
              You will be able to fully communicate
            </Text>
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
          </View>
          <View>{!!error && <Text style={styles.error}>{error}</Text>}</View>
          <View style={styles.providersConteiner}>
            <Pressable onPress={signInWithGoogle}>
              <GoogleIcon />
            </Pressable>

            <Pressable onPress={signInWithApple}>
              <AppleIcon />
            </Pressable>
          </View>
          <View style={styles.formBtns}>
            <View style={styles.auth}>
              <Text style={styles.text}>No account?</Text>
              <Pressable
                onPress={() => router.push("/sign-up")}
                style={styles.authBtn}
              >
                <Text style={styles.authBtnText}>Register</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={onSubmit}
              style={[
                styles.confirmBtn,
                {
                  backgroundColor:
                    isDirty && !isSubmitting
                      ? Styles[theme].SecondaryPressed
                      : Styles[theme].PrimaryDisabled,
                },
              ]}
              disabled={!isDirty || isSubmitting}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
