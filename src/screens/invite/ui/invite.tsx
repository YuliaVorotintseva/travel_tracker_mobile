import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";

import { useJoinViaInvite } from "@/src/shared/hooks/use_join_via_invite";
import { supabase } from "@/src/shared/lib";
import { Loader } from "@/src/shared/ui/loaders";

type Props = {
  trip_id: string;
  code: string;
};

export const InviteScreen: FC<Props> = ({ trip_id, code }) => {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { mutateAsync: joinTrip, isPending } = useJoinViaInvite();

  useEffect(() => {
    if (!trip_id || !code) {
      router.replace("/(tabs)/my-trips");
      return;
    }

    const handleJoin = async () => {
      setCheckingAuth(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push({
          pathname: "/",
          params: { redirect: "invite", trip_id, code },
        });
        return;
      }

      try {
        await joinTrip({ tripId: trip_id, code });
        console.log("SUCCESS");
        router.replace(`/trip/${trip_id}`);
      } catch (error: unknown) {
        console.error((error as { message: string }).message);
        router.replace("/(tabs)/my-trips");
      } finally {
        setCheckingAuth(false);
      }
    };

    handleJoin();
  }, [trip_id, code, joinTrip, router]);

  if (checkingAuth || isPending) {
    return <Loader />;
  }

  return null;
};
