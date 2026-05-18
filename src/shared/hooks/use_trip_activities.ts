import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared/lib";
import type { Activity } from "@/src/shared/types";
import { addAddressesToActivities } from "../../screens/trip_map/model/trip_map_actions";

export const useTripActivities = (tripId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["activities", tripId];

  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Activity[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("trip_id", tripId!)
        .order("start_time", { ascending: true, nullsFirst: true });

      if (error) throw error;
      return await addAddressesToActivities(data || []);
    },
    enabled: !!tripId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    mutationFn: async (newActivity: Omit<Partial<Activity>, "id">) => {
      const { data, error } = await supabase
        .from("activities")
        .insert({ trip_id: tripId!, ...newActivity })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newActivity) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Activity[]>(queryKey) || [];
      const temp = { ...newActivity, id: `temp_${Date.now()}` } as Activity;
      queryClient.setQueryData(queryKey, [...previous, temp]);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Activity>;
    }) => {
      const { error } = await supabase
        .from("activities")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Activity[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: Activity[]) =>
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
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Activity[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: Activity[]) =>
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
    activities,
    isLoading,
    error,
    refetch,
    addActivity: addMutation.mutateAsync,
    updateActivity: updateMutation.mutateAsync,
    removeActivity: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
