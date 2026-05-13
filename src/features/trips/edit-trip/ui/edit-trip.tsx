import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { CURRENCIES, Currency, TripWithMembers } from "@/src/shared/types";
import { DatePickerModal, IconBackButton, SelectPicker } from "@/src/shared/ui";
import { TripMembersList } from "@/src/widgets/trip_members_list";
import { useRouter } from "expo-router";
import { getStyles } from "./styles";

export type EditTripFormData = {
  title: string;
  description?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
  currency?: Currency;
};

export const EditTrip: FC<{ tripId: string }> = ({ tripId }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();
  const [trip, setTrip] = useState<TripWithMembers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStartCalendarVisible, setIsStartCalendarVisible] = useState(false);
  const [isFinishCalendarVisible, setIsFinishCalendarVisible] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm<EditTripFormData>({
    defaultValues: {
      title: "",
      description: "",
      destination: "",
      start_date: "--:--",
      end_date: "--:--",
      currency: "USD",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .maybeSingle();

      if (!!error) {
        setError((error as { message: string }).message);
        console.error(error);
      }

      setTrip(data);
    };
    init();
  }, []);

  useEffect(() => {
    if (trip) {
      reset({
        title: trip.title,
        description: trip.description,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        currency: trip.currency as Currency,
      });
    }
  }, [trip, reset]);

  const onSubmit = handleSubmit(async (input: EditTripFormData) => {
    try {
      const editedData = {
        id: tripId,
        ...input,
      };

      const { data: updatedTrip, error } = await supabase
        .from("trips")
        .update(editedData)
        .eq("id", tripId)
        .select()
        .single();

      if (!!error) {
        throw error;
      }

      setTrip(updatedTrip);
      console.log("Trip was successful updated!");
      router.back();
    } catch (error: unknown) {
      setError((error as { message: string }).message);
      console.error(JSON.stringify(error, null, 2));
    }
  });

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.header}>
          <IconBackButton icon={<BackIcon />} />
          <Text>Edit trip</Text>
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
                  {!!error && <Text style={styles.error}>{error.message}</Text>}
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
                  {!!error && <Text style={styles.error}>{error.message}</Text>}
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
                  {!!error && <Text style={styles.error}>{error.message}</Text>}
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
                    onSelect={onChange}
                    minDate={new Date()}
                  />

                  <Pressable onPress={() => setIsStartCalendarVisible(true)}>
                    <Text style={styles.label}>Start day</Text>
                    <TextInput
                      placeholder="Enter start day"
                      placeholderTextColor={Styles[theme].TextSecondary}
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
              name="end_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <View>
                  <DatePickerModal
                    visible={isFinishCalendarVisible}
                    onClose={() => setIsFinishCalendarVisible(false)}
                    onSelect={onChange}
                  />

                  <Pressable onPress={() => setIsFinishCalendarVisible(true)}>
                    <Text style={styles.label}>Finish day</Text>
                    <TextInput
                      placeholder="Enter start day"
                      placeholderTextColor={Styles[theme].TextSecondary}
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
          <View>
            <Text>
              {!!trip?.trip_members && trip.trip_members.length > 0
                ? `Trip members(${trip.trip_members.length}):`
                : "There is no any member yet"}
            </Text>
            {!!trip && trip.trip_members.length && (
              <TripMembersList tripId={tripId} />
            )}
          </View>
          {!!error && <Text style={styles.error}>{`Problem: ${error}`}</Text>}
          <Pressable onPress={onSubmit} style={styles.confirmBtn}>
            <Text
              style={{
                color:
                  isDirty && !isSubmitting
                    ? Styles[theme].TextAccent
                    : Styles[theme].TextDisabled,
              }}
            >
              Save
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
