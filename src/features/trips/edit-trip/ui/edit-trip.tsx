import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMyTrips } from "@/src/screens/trips";
import { useMyProfile } from "@/src/shared/hooks";
import { BackIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import {
  CURRENCIES,
  Currency,
  TripMemberWithProfile,
  TripWithMembers,
} from "@/src/shared/types";
import { Profiles } from "@/src/shared/types/api/generated";
import {
  ControlButton,
  DatePickerModal,
  IconBackButton,
  SelectPicker,
} from "@/src/shared/ui";
import { Loader } from "@/src/shared/ui/loaders";
import { getFormatDate, toLocalISODate } from "@/src/shared/utils";
import { TripMembersListModal } from "@/src/widgets/trip_members_list";
import { useTripMembers } from "../model";
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
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);
  const [userRole, setUserRole] =
    useState<TripMemberWithProfile["role"]>("viewer");
  const { profile } = useMyProfile();
  const { trips, updateTrip } = useMyTrips((profile as Profiles).id);
  const { members, updateMember, removeMember } = useTripMembers(
    trip?.id ?? null,
  );
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
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      currency: "USD",
    },
    mode: "onBlur",
  });
  const startDate = useWatch({ control, name: "start_date" });
  const isHaveMembers = !!trip?.trip_members && trip.trip_members.length > 0;

  useEffect(() => {
    (async () => {
      supabase
        .from("trip_members")
        .select("role")
        .eq("trip_id", tripId)
        .eq("user_id", (profile as Profiles).id)
        .single()
        .then((data) => setUserRole(data.data?.role));
    })();
  }, []);

  useEffect(() => {
    if (!profile) return;

    const trip = trips?.find((t) => t.id === tripId);
    setTrip(trip ?? null);
  }, [profile]);

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

      const updatedTrip = await updateTrip({ id: tripId, data: editedData });
      setTrip(updatedTrip);
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
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    autoCapitalize="none"
                    style={styles.input}
                    editable={userRole !== "viewer"}
                    onFocus={
                      userRole === "viewer"
                        ? (e) => e.target?.blur()
                        : undefined
                    }
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
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    autoCapitalize="none"
                    style={styles.input}
                    editable={userRole !== "viewer"}
                    onFocus={
                      userRole === "viewer"
                        ? (e) => e.target?.blur()
                        : undefined
                    }
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
                    onChangeText={(text) => onChange(text)}
                    value={value}
                    autoCapitalize="none"
                    style={styles.input}
                    editable={userRole !== "viewer"}
                    onFocus={
                      userRole === "viewer"
                        ? (e) => e.target?.blur()
                        : undefined
                    }
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
                    onSelect={(date) => {
                      const localDate = toLocalISODate(new Date(date));
                      onChange(localDate);
                    }}
                    minDate={new Date()}
                  />

                  <Pressable
                    disabled={userRole === "viewer"}
                    onPress={() => setIsStartCalendarVisible(true)}
                  >
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
              disabled={userRole === "viewer"}
              render={({ field: { onChange, value } }) => (
                <View>
                  <DatePickerModal
                    visible={isFinishCalendarVisible}
                    onClose={() => setIsFinishCalendarVisible(false)}
                    onSelect={(date) => {
                      const localDate = toLocalISODate(new Date(date));
                      onChange(localDate);
                    }}
                    minDate={startDate ? new Date(startDate) : new Date()}
                  />

                  <Pressable
                    disabled={userRole === "viewer"}
                    onPress={() => setIsFinishCalendarVisible(true)}
                  >
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
                    disabled={userRole === "viewer"}
                  />
                </View>
              )}
            />
          </View>
          <View>
            <Pressable
              onPress={() => setIsMemberListOpen(true)}
              disabled={!isHaveMembers}
              style={[
                styles.memberBtn,
                {
                  backgroundColor: isHaveMembers
                    ? Styles[theme].PrimaryInitial
                    : Styles[theme].PrimaryDisabled,
                },
              ]}
            >
              <Text style={styles.memberBtnText}>
                {isHaveMembers
                  ? `Trip members(${trip?.trip_members?.length})`
                  : "There is no any member yet"}
              </Text>
            </Pressable>
          </View>

          {!!error && <Text style={styles.error}>{`Problem: ${error}`}</Text>}

          <ControlButton
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
          />
        </View>

        {members && members.length > 0 && isMemberListOpen ? (
          <TripMembersListModal
            members={members as TripMemberWithProfile[]}
            userRole={userRole || "viewer"}
            onClose={() => setIsMemberListOpen(false)}
            onMember={() => {}}
            onSelectRole={(userId, role) => updateMember({ userId, role })}
            onDelete={(userId: string) => removeMember(userId)}
          />
        ) : (
          isMemberListOpen && <Loader />
        )}
      </SafeAreaView>
    </ScrollView>
  );
};
