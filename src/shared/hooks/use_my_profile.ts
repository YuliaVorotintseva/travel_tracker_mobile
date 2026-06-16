import { useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/src/shared/lib";
import { Profiles } from "@/src/shared/types/api/generated";
import { useOfflineMutation } from "./use_offline_mutation";

export const useMyProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      const { data, error: getProfileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .maybeSingle();

      if (!!authError || !!getProfileError) {
        throw authError ?? getProfileError;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const {
    mutateAsync: updateProfile,
    isPending: isUpdating,
    error: updateError,
  } = useOfflineMutation({
    table: "profiles",
    type: "update",
    getPayload: (updatedData) => {
      if (!updatedData) {
        throw new Error("Missing updated data");
      }
      return { ...updatedData };
    },
    getQueryKey: () => ["profiles"],
    mutationFn: async (updatedData: Partial<Profiles>) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Пользователь не авторизован");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: updatedData.full_name,
          avatar_url: updatedData.avatar_url,
        })
        .eq("id", session.user.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["profile"] });

      const previousData = queryClient.getQueryData<Profiles>(["profile"]);

      queryClient.setQueryData<Profiles>(["profile"], (old) => {
        if (!old) return old;
        return { ...old, ...newData };
      });

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["profile"], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdating,
    updateError,
  };
};
