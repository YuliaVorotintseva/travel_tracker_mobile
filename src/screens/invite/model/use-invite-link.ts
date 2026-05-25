import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";

import { supabase } from "@/src/shared/lib";

export const useInviteLink = (tripId: string) => {
  const getInviteUrl = async (): Promise<string | null> => {
    const { data, error } = await supabase
      .from("trips")
      .select("invite_code")
      .eq("id", tripId)
      .single();

    if (!!error || !data?.invite_code) {
      console.error(error);
      return null;
    }

    const url = Linking.createURL(`invite`, {
      queryParams: { trip_id: tripId, code: data.invite_code },
    });
    return url;
  };

  const copyInviteLink = async (): Promise<boolean> => {
    const url = await getInviteUrl();
    if (!url) return false;
    await Clipboard.setStringAsync(url);
    return true;
  };

  return { getInviteUrl, copyInviteLink };
};
