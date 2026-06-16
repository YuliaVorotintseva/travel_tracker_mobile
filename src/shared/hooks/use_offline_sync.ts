import { useEffect, useRef } from "react";

import { syncOfflineQueue } from "../lib/offline-context/offline_queue";
import { queryClient } from "../lib/offline-context/query_client";
import { useNetworkStatus } from "./use_network_status";

export const useOfflineSync = (enabled = true) => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const syncTimeoutRef = useRef<number | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    if (isConnected && isInternetReachable && !isSyncingRef.current) {
      isSyncingRef.current = true;

      syncOfflineQueue((processed, total) => {
        console.log(`Sync progress: ${processed}/${total}`);
      })
        .then(({ synced }) => {
          if (synced > 0) {
            queryClient.invalidateQueries();
            console.log(`Synced ${synced} offline mutations`);
          }
        })
        .catch((error: unknown) => {
          console.error("Sync failed:", error);
        })
        .finally(() => {
          isSyncingRef.current = false;
        });
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isConnected, isInternetReachable, enabled]);

  const triggerSync = async () => {
    if (isSyncingRef.current) return;
    return syncOfflineQueue();
  };

  return {
    isConnected,
    isInternetReachable,
    isSyncing: isSyncingRef.current,
    triggerSync,
  };
};
