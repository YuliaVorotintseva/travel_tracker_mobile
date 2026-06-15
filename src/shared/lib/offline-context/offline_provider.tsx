import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { ReactNode, useMemo } from "react";

import { useOfflineSync } from "@/src/shared/hooks/use_offline_sync";
import {
  persister,
  queryClient,
} from "@/src/shared/lib/offline-context/query_client";
import { Loader } from "../../ui/loaders";

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({
  children,
}) => {
  const { isConnected, isInternetReachable } = useOfflineSync();

  const isOnline = useMemo(() => {
    return isConnected && isInternetReachable !== false;
  }, [isConnected, isInternetReachable]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: 1000 * 60 * 60 * 24 }} // 24 часа
      onSuccess={() => {
        queryClient.resumePausedMutations?.();
      }}
    >
      {isOnline ? children : <Loader />}
    </PersistQueryClientProvider>
  );
};
