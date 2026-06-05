import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supabase } from "@/src/shared/lib";
import { ActivityComment } from "../types";

export const useActivityComments = (
  activityId: string | null,
  currentUserId: string | null,
) => {
  const queryClient = useQueryClient();
  const queryKey = ["activity_comments", activityId];

  useEffect(() => {
    if (!activityId) return;
    const channel = supabase
      .channel(`comments-${activityId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activity_comments",
          filter: `activity_id=eq.${activityId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, [activityId, queryClient]);

  const { data: comments = [], isLoading } = useQuery<ActivityComment[]>({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_comments")
        .select("*, profiles(id, full_name, avatar_url)")
        .eq("activity_id", activityId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!activityId,
    staleTime: 1000 * 60 * 2,
  });

  const addMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUserId) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("activity_comments")
        .insert({ activity_id: activityId!, user_id: currentUserId, content })
        .select("*, profiles(id, full_name, avatar_url)")
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<ActivityComment[]>(queryKey) || [];
      const temp: ActivityComment = {
        id: `temp_${Date.now()}`,
        activity_id: activityId!,
        user_id: currentUserId!,
        content,
        created_at: new Date().toISOString(),
        profiles: null, // Подгрузится после invalidate
      };
      queryClient.setQueryData(queryKey, [...previous, temp]);
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("activity_comments")
        .delete()
        .eq("id", commentId);
      if (error) throw error;
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ActivityComment[]>(queryKey);
      queryClient.setQueryData(queryKey, (prev: ActivityComment[]) =>
        prev?.filter((c) => c.id !== commentId),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    comments,
    isLoading,
    addComment: addMutation.mutateAsync,
    deleteComment: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
  };
};
