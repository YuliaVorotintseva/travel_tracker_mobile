import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared/lib";
import { TripMemberWithProfile } from "../types";

export const useTripMembers = (tripId: string | null) => {
  const queryClient = useQueryClient();
  const queryKey = ["trip_members", tripId];

  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_members")
        .select("*, profiles(id, full_name, avatar_url)")
        .eq("trip_id", tripId!);

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

      return data;
    },
    enabled: !!tripId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addMutation = useMutation({
    retry: false,
    mutationFn: async ({
      user_id,
      role,
    }: {
      user_id: string;
      role: TripMemberWithProfile["role"];
    }) => {
      const { data: newMember, error } = await supabase
        .from("trip_members")
        .insert({ trip_id: tripId, user_id, role })
        .select("*, profiles(id, full_name, avatar_url)")
        .single();

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

      return newMember;
    },
    onMutate: async ({ user_id, role }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<TripMemberWithProfile[]>(queryKey) || [];
      const temp: TripMemberWithProfile = {
        user_id,
        role,
        joined_at: new Date().toISOString(),
        profiles: null,
      };
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
      userId,
      role,
    }: {
      userId: string;
      role: TripMemberWithProfile["role"];
    }) => {
      const { data: updatedMember, error } = await supabase
        .from("trip_members")
        .update({ role })
        .eq("user_id", userId)
        .select()
        .single();

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }

      return updatedMember;
    },
    onMutate: async ({ userId, role }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<TripMemberWithProfile[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: TripMemberWithProfile[]) =>
        prev?.map((u) => (u.user_id === userId ? { ...u, role } : u)),
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
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("trip_members")
        .delete()
        .eq("user_id", userId)
        .eq("trip_id", tripId!);

      if (error?.code || error?.message) {
        console.error(error);
        throw error;
      }
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<TripMemberWithProfile[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: TripMemberWithProfile[]) =>
        prev?.filter((u) => u.user_id !== userId),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember: addMutation.mutateAsync,
    updateMember: updateMutation.mutateAsync,
    removeMember: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
