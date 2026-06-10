import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared/lib";
import { TripWithMembers } from "@/src/shared/types";

export const useMyTrips = (userId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["trips", userId];

  const {
    data: trips,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const [tripsAsCreator, tripsAsMember] = await Promise.all([
        supabase
          .from("trips")
          .select(
            "id, title, start_date, end_date, description, destination, currency, created_by, trip_members(user_id, role)",
          )
          .eq("created_by", userId),
        supabase
          .from("trips")
          .select(
            "id, title, start_date, end_date, description, destination, currency, created_by, trip_members(user_id, role)",
          )
          .eq("trip_members.user_id", userId),
      ]);

      const error = tripsAsCreator.error || tripsAsMember.error;
      if (!!error) {
        throw error;
      }

      return Array.from(
        new Map(
          [...tripsAsCreator.data, ...tripsAsMember.data].map((t) => [t.id, t]),
        ).values(),
      );
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    retry: false,
    mutationFn: async (data: Omit<TripWithMembers, "id" | "trip_members">) => {
      const {
        id: _,
        trip_members: __,
        ...cleanData
      } = data as Record<string, any>;

      const { data: newTrip, error } = await supabase
        .from("trips")
        .insert(cleanData)
        .select("*")
        .single();

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

      return newTrip;
    },
    onMutate: async (trip) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<TripWithMembers[]>(queryKey) || [];
      const temp = { ...trip, id: `temp_${Date.now()}` } as TripWithMembers;
      queryClient.setQueryData(queryKey, [...previous, temp]);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    retry: false,
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TripWithMembers>;
    }) => {
      console.log("TO UPDATE: ", data);
      const { data: updatedData, error } = await supabase
        .from("trips")
        .update(data)
        .eq("id", id)
        .select("*")
        .single();

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

      console.log("UPDATED: ", updatedData);
      return updatedData;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TripWithMembers[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: TripWithMembers[]) =>
        prev?.map((a) => (a.id === id ? { ...a, ...data } : a)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const removeMutation = useMutation({
    retry: false,
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trips").delete().eq("id", id);

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TripWithMembers[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: TripWithMembers[]) =>
        prev?.filter((a) => a.id !== id),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    trips,
    isLoading,
    error,
    refetch,
    addTrip: addMutation.mutateAsync,
    updateTrip: updateMutation.mutateAsync,
    removeTrip: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
