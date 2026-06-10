import { useMutation } from "@tanstack/react-query";

import { supabase } from "@/src/shared/lib";

export const useJoinViaInvite = () => {
  return useMutation({
    mutationFn: async ({ tripId, code }: { tripId: string; code: string }) => {
      const { data, error } = await supabase.rpc("join_via_invite_code", {
        p_trip_id: tripId,
        p_code: code,
      });

      if (!!error) {
        if (error.code === "PGRST204" || error.message?.includes("INVALID")) {
          throw new Error("INVALID_CODE");
        }
        throw error;
      }
      return data;
    },
    retry: false,
  });
};
