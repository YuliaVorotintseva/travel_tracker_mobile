import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/src/shared/lib";

const QUEUE_KEY = "offline-mutation-queue";

export interface QueuedMutation {
  id: string;
  type: "create" | "update" | "delete";
  table: string;
  payload: any;
  queryKey: string[];
  timestamp: number;
  retryCount: number;
}

export const enqueueMutation = async (
  mutation: Omit<QueuedMutation, "id" | "timestamp" | "retryCount">,
) => {
  try {
    const queue = await getQueue();
    const newMutation: QueuedMutation = {
      ...mutation,
      id: `${mutation.table}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    await AsyncStorage.setItem(
      QUEUE_KEY,
      JSON.stringify([...queue, newMutation]),
    );
    return newMutation;
  } catch (error: unknown) {
    console.error("Failed to enqueue mutation:", error);
    throw error;
  }
};

export const getQueue = async (): Promise<QueuedMutation[]> => {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const executeQueuedMutation = async (mutation: QueuedMutation) => {
  try {
    let result;

    switch (mutation.type) {
      case "create":
        result = await supabase
          .from(mutation.table)
          .insert(mutation.payload)
          .select()
          .single();
        break;
      case "update":
        result = await supabase
          .from(mutation.table)
          .update(mutation.payload)
          .eq("id", mutation.payload.id)
          .select()
          .single();
        break;
      case "delete":
        result = await supabase
          .from(mutation.table)
          .delete()
          .eq("id", mutation.payload.id);
        break;
    }

    if (result?.error) throw result.error;
    return { success: true, data: result.data };
  } catch (error: unknown) {
    console.error(`Failed to execute queued mutation ${mutation.id}:`, error);
    return { success: false, error };
  }
};

export const dequeueMutation = async (mutationId: string) => {
  try {
    const queue = await getQueue();
    const filtered = queue.filter((m) => m.id !== mutationId);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  } catch (error: unknown) {
    console.error("Failed to dequeue mutation:", error);
  }
};

export const syncOfflineQueue = async (
  onProgress?: (processed: number, total: number) => void,
) => {
  const queue = await getQueue();
  if (queue.length === 0) return { success: true, synced: 0 };

  let synced = 0;

  for (const mutation of queue) {
    const result = await executeQueuedMutation(mutation);

    if (result.success) {
      await dequeueMutation(mutation.id);
      synced++;
    } else {
      mutation.retryCount++;
      if (mutation.retryCount >= 5) {
        await dequeueMutation(mutation.id);
      } else {
        const updated = queue.map((m) => (m.id === mutation.id ? mutation : m));
        await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
      }
    }

    onProgress?.(synced, queue.length);
  }

  return { success: true, synced };
};
