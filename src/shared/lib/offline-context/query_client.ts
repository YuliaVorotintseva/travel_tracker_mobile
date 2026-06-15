import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";

const PERSIST_KEY = "traveltracker-query-cache";

export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: PERSIST_KEY,
  throttleTime: 1000,
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      networkMode: "offlineFirst",
    },
    mutations: {
      retry: 2,
      networkMode: "offlineFirst",
    },
  },
});

export const clearQueryCache = async () => {
  queryClient.clear();
  await AsyncStorage.removeItem(PERSIST_KEY);
};
