import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: NetInfoState["type"];
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: "unknown" as NetInfoState["type"],
  });

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => unsubscribe();
  }, []);

  return status;
};
