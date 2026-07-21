"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchQueue, registerWalkIn as apiRegisterWalkIn, updateQueueStatus as apiUpdateQueueStatus } from "../lib/apiServices";
import type { QueueEntry, QueueData } from "../lib/apiServices";

export type { QueueEntry };

interface QueueContextType {
  queueEntries: QueueEntry[];
  totalWaiting: number;
  currentlyServingCount: number;
  availableStylistsCount: number;
  averageWaitMinutes: number;
  isLoading: boolean;
  error: string | null;
  refreshQueue: () => Promise<void>;
  registerWalkIn: (data: { customerName: string; customerPhone?: string; serviceNames: string[]; stylistId?: string }) => Promise<{ success: boolean; error?: string }>;
  updateQueueStatus: (id: string, status: QueueEntry["status"]) => Promise<{ success: boolean; error?: string }>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queueData, setQueueData] = useState<Omit<QueueData, "entries">>({
    totalWaiting: 0,
    currentlyServingCount: 0,
    availableStylistsCount: 4,
    averageWaitMinutes: 0,
  });
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshQueue = async () => {
    try {
      setError(null);
      const res = await fetchQueue();
      if (res.success && res.data) {
        const { entries, ...stats } = res.data;
        setQueueEntries(entries || []);
        setQueueData(stats);
      }
    } catch (err: any) {
      setError("Could not load queue data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshQueue();
    const interval = setInterval(refreshQueue, 15000); // 15s live polling
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerWalkIn = async (data: {
    customerName: string;
    customerPhone?: string;
    serviceNames: string[];
    stylistId?: string;
  }) => {
    const res = await apiRegisterWalkIn(data);
    if (res.success) {
      await refreshQueue();
      return { success: true };
    }
    return { success: false, error: res.error?.message || "Failed to register walk-in." };
  };

  const updateQueueStatus = async (id: string, status: QueueEntry["status"]) => {
    // Optimistic local update for immediate feedback
    setQueueEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    const res = await apiUpdateQueueStatus(id, status);
    if (res.success) {
      await refreshQueue(); // sync with server
      return { success: true };
    }
    // Revert on failure
    await refreshQueue();
    return { success: false, error: res.error?.message || "Failed to update status." };
  };

  return (
    <QueueContext.Provider
      value={{
        queueEntries,
        ...queueData,
        isLoading,
        error,
        refreshQueue,
        registerWalkIn,
        updateQueueStatus,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
}

export function useQueue() {
  const context = useContext(QueueContext);
  if (!context) throw new Error("useQueue must be used within a QueueProvider");
  return context;
}
