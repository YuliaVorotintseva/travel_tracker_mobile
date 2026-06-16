import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { enqueueMutation } from "@/src/shared/lib/offline-context/offline_queue";
import { useNetworkStatus } from "./use_network_status";

export const useOfflineMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    table: string;
    type: "create" | "update" | "delete";
    getPayload: (vars: TVariables) => any;
    getQueryKey: (vars: TVariables) => string[];
  },
) => {
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOnline = isConnected && isInternetReachable !== false;

  const { mutationFn, onSettled, ...restOptions } = options;
  const originalMutationFn = mutationFn as
    | ((vars: TVariables) => Promise<TData>)
    | undefined;
  const originalOnSettled = onSettled as UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
  >["onSettled"];

  return useMutation({
    ...restOptions,

    mutationFn: async (variables: TVariables) => {
      if (!isOnline) {
        await enqueueMutation({
          type: options.type,
          table: options.table,
          payload: options.getPayload(variables),
          queryKey: options.getQueryKey(variables),
        });
        return {} as TData;
      }

      if (originalMutationFn) {
        return originalMutationFn(variables);
      }
      throw new Error("mutationFn is required");
    },

    onSettled: (data, error, variables, context, ...args) => {
      if (isOnline && originalOnSettled) {
        originalOnSettled(data, error, variables, context, ...args);
      }
    },
  });
};
