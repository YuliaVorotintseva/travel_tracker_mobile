import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackIcon, CloseIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { Currency } from "@/src/shared/types";
import {
  DatePickerModal,
  IconBackButton,
  SelectOption,
  SelectPicker,
} from "../../../shared/ui";
import { getStyles } from "./styles";

type CreateTripData = {
  title: string;
  description?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  currency: Currency;
};

const formatDate = (date = new Date()) => {
  return date
    .toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(" at ", ", at ");
};

const CURRENCIES: SelectOption<Currency>[] = [
  { label: "USD 🇺🇸", value: "USD" },
  { label: "EUR 🇪🇺", value: "EUR" },
  { label: "RUB 🇷🇺", value: "RUB" },
  { label: "GBP 🇬🇧", value: "GBP" },
];

export const CreatePost: FC = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isStartCalendarFisible, setIsStartCalendarFisible] = useState(false);
  const [isFinishCalendarFisible, setIsFinishCalendarFisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<CreateTripData>({
    defaultValues: {
      title: "",
      description: "",
      destination: "",
      start_date: Date.now().toString(),
      end_date: Date.now().toString(),
      currency: "USD",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUserId(session?.user.id ?? null);
      })
      .catch((error: unknown) => {
        console.error((error as { message: string }).message);
      });
  }, []);

  const onSubmit = handleSubmit(async (input: CreateTripData) => {
    try {
      if (!userId) {
        return;
      }

      const newTripData = {
        ...input,
        created_by: userId,
      };

      const { data, error } = await supabase
        .from("trips")
        .insert([newTripData])
        .select()
        .single();
      console.log(data);

      if (!!error) {
        console.error((error as { message: string }).message);
      }

      reset();
    } catch (error: unknown) {
      setError((error as { message: string }).message);
      console.error(JSON.stringify(error, null, 2));
    }
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.header}>
            <IconBackButton icon={<BackIcon />} />
            <Text>Create trip</Text>
            <IconBackButton icon={<CloseIcon />} />
          </View>
          <View style={styles.content}>
            <View style={styles.inputs}>
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
                      placeholder="Enter title of trip"
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
              <Controller
                name="description"
                control={control}
                render={({
                  field: { onBlur, onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <Text style={styles.label}>Post</Text>
                    <TextInput
                      placeholder="Enter your post"
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
              <Controller
                name="destination"
                control={control}
                render={({
                  field: { onBlur, onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <Text style={styles.label}>Post</Text>
                    <TextInput
                      placeholder="Enter your post"
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
              <Controller
                name="start_date"
                control={control}
                render={({ field: { value } }) => (
                  <View>
                    <Text>Start trip date</Text>
                    <DatePickerModal
                      visible={isStartCalendarFisible}
                      onClose={() => setIsStartCalendarFisible(false)}
                      onSelect={(date) => {
                        setStartDate(date.toString());
                        if (!endDate) {
                          const next = new Date(date);
                          next.setDate(next.getDate() + 1);
                          setEndDate(next.toISOString().split("T")[0]);
                        }
                      }}
                      minDate={new Date()}
                    />

                    <Pressable onPress={() => setIsStartCalendarFisible(true)}>
                      <Text style={styles.label}>Start day</Text>
                      <TextInput
                        placeholder="Enter start day"
                        placeholderTextColor={Styles[theme].TextSecondary}
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
                name="end_date"
                control={control}
                render={({ field: { value } }) => (
                  <View>
                    <Text>Finish trip date</Text>
                    <DatePickerModal
                      visible={isFinishCalendarFisible}
                      onClose={() => setIsFinishCalendarFisible(false)}
                      onSelect={setEndDate}
                      minDate={startDate ? new Date(startDate) : new Date()}
                    />

                    <Pressable onPress={() => setIsStartCalendarFisible(true)}>
                      <Text style={styles.label}>Finish day</Text>
                      <TextInput
                        placeholder="Enter start day"
                        placeholderTextColor={Styles[theme].TextSecondary}
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
                name="currency"
                control={control}
                render={({ field: { value } }) => (
                  <View>
                    <Text>Choose currency</Text>
                    <SelectPicker
                      value={value}
                      onChange={setCurrency}
                      options={CURRENCIES}
                      searchable={false}
                    />
                  </View>
                )}
              />
            </View>
            {!!error && <Text style={styles.error}>{`Problem: ${error}`}</Text>}
            <Pressable
              onPress={onSubmit}
              style={[
                styles.publishBtn,
                {
                  backgroundColor:
                    isDirty && !isSubmitting
                      ? Styles[theme].PrimaryInitial
                      : Styles[theme].PrimaryDisabled,
                },
              ]}
              disabled={!isDirty || isSubmitting}
            >
              <Text
                style={{
                  color:
                    isDirty && !isSubmitting
                      ? Styles[theme].TextOnColor
                      : Styles[theme].TextDisabled,
                }}
              >
                Publish
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
