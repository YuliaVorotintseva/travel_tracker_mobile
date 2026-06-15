import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useOfflineMutation } from "@/src/shared/hooks";
import { supabase } from "@/src/shared/lib";
import type { Activity } from "@/src/shared/types";
import { addAddressesToActivities } from "./trip_map_actions";

export const useTripActivities = (tripId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["activities", tripId];

  useEffect(() => {
    if (!tripId) return;

    const channel = supabase.channel(
      `activities-${tripId}-${Math.random().toString(36).substring(2, 9)}`,
    );
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activities",
          filter: `trip_id=eq.${tripId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [tripId, queryClient]);

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

  const addMutation = useOfflineMutation({
    table: "activities",
    type: "create",
    getPayload: (newActivity: Omit<Partial<Activity>, "id">) => {
      if (!newActivity) {
        throw new Error("Missing newActivity");
      }

      return {
        trip_id: tripId,
        ...newActivity,
      };
    },
    getQueryKey: () => ["activities", tripId!],
    retry: false,
    mutationFn: async (newActivity: Omit<Partial<Activity>, "id">) => {
      const {
        id: _,
        trip_members: __,
        ...cleanData
      } = newActivity as Record<string, any>;

      const { data, error } = await supabase
        .from("activities")
        .insert({ trip_id: tripId!, ...cleanData })
        .select()
        .single();

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

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

  const updateMutation = useOfflineMutation({
    table: "activities",
    type: "update",
    getPayload: ({ id, data }) => {
      if (!id) {
        throw new Error("Missing activity id");
      }

      return {
        trip_id: tripId,
        activity_id: id,
        data,
      };
    },
    getQueryKey: () => ["activities", tripId!],
    retry: false,
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Activity>;
    }) => {
      const { data: updatedActivity, error } = await supabase
        .from("activities")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

      return updatedActivity;
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

  const removeMutation = useOfflineMutation({
    table: "activities",
    type: "delete",
    getPayload: (id) => {
      if (!id) {
        throw new Error("Missing activity id");
      }

      return {
        trip_id: tripId,
        activity_id: id,
      };
    },
    getQueryKey: () => ["activities", tripId!],
    retry: false,
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("activities").delete().eq("id", id);

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }
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
