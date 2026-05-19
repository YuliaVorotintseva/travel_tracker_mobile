import { FC, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
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

import { useMyProfile, useMyTrips } from "@/src/shared/hooks";
import { BackIcon } from "@/src/shared/icons";
import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { CURRENCIES, Currency } from "@/src/shared/types";
import { Profiles } from "@/src/shared/types/api/generated";
import { DatePickerModal, IconBackButton, SelectPicker } from "@/src/shared/ui";
import { getFormatDate, toLocalISODate } from "@/src/shared/utils";
import { useRouter } from "expo-router";
import { getStyles } from "./styles";

type CreateTripData = {
  title: string;
  description?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  currency: Currency;
};

export const CreateTrip: FC = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isFinishCalendarVisible, setIsFinishCalendarVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<CreateTripData>({
    defaultValues: {
      title: "",
      description: "",
      destination: "",
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      currency: "USD",
    },
    mode: "onBlur",
  });
  const { profile, error } = useMyProfile();
  const { addTrip } = useMyTrips((profile as Profiles).id);
  const startDate = useWatch({ control, name: "start_date" });

  const onSubmit = handleSubmit(async (input: CreateTripData) => {
    if (!profile) {
      return;
    }

    const newTripData = {
      ...input,
      created_by: profile.id,
    };

    try {
      await addTrip(newTripData);
      router.back();
    } catch (error: unknown) {
      console.error((error as { message: string }).message);
    }
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.header}>
            <IconBackButton icon={<BackIcon />} />
            <Text>Create trip</Text>
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
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      placeholder="Enter description of the trip"
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
                    <Text style={styles.label}>Destination</Text>
                    <TextInput
                      placeholder="Enter your destination"
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
                render={({ field: { onChange, value } }) => (
                  <View>
                    <DatePickerModal
                      visible={isStartCalendarVisible}
                      onClose={() => setIsStartCalendarVisible(false)}
                      onSelect={(date) => {
                        const localDate = toLocalISODate(new Date(date));
                        onChange(localDate);
                      }}
                      minDate={new Date()}
                    />

                    <Pressable onPress={() => setIsStartCalendarVisible(true)}>
                      <Text style={styles.label}>Start day</Text>
                      <TextInput
                        placeholder="Enter start day"
                        placeholderTextColor={Styles[theme].TextSecondary}
                        value={
                          !!value
                            ? getFormatDate(new Date(value))
                            : getFormatDate()
                        }
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
                render={({ field: { onChange, value } }) => (
                  <View>
                    <DatePickerModal
                      visible={isFinishCalendarVisible}
                      onClose={() => setIsFinishCalendarVisible(false)}
                      onSelect={(date) => {
                        const localDate = toLocalISODate(new Date(date));
                        onChange(localDate);
                      }}
                      minDate={!!startDate ? new Date(startDate) : new Date()}
                    />

                    <Pressable onPress={() => setIsFinishCalendarVisible(true)}>
                      <Text style={styles.label}>Finish day</Text>
                      <TextInput
                        placeholder="Enter start day"
                        placeholderTextColor={Styles[theme].TextSecondary}
                        value={
                          !!value
                            ? getFormatDate(new Date(value))
                            : getFormatDate()
                        }
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
                render={({ field: { onChange, value } }) => (
                  <View>
                    <Text style={styles.label}>Choose currency</Text>
                    <SelectPicker
                      value={value}
                      onChange={onChange}
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
                      ? Styles[theme].IconAccent
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
                Create
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};
