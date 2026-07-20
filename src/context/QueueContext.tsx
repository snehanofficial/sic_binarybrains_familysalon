"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../lib/api";

export interface QueueEntryItem {
  id: string;
  customerName: string;
  customerPhone?: string;
  serviceNames: string[];
  stylistName?: string;
  entryType: "ONLINE" | "WALK_IN";
  status: "WAITING" | "IN_SERVICE" | "COMPLETED" | "SKIPPED" | "CANCELLED";
  position: number;
  waitingTimeMinutes: number;
  calculatedWaitMinutes?: number;
  estimatedStartTime?: string;
}

interface QueueContextType {
  queueEntries: QueueEntryItem[];
  totalWaiting: number;
  currentlyServingCount: number;
  availableStylistsCount: number;
  averageWaitMinutes: number;
  isLoading: boolean;
  refreshQueue: () => Promise<void>;
  registerWalkIn: (data: { customerName: string; customerPhone?: string; serviceNames: string[]; stylistId?: string }) => Promise<{ success: boolean; error?: string }>;
  updateQueueStatus: (id: string, status: QueueEntryItem["status"]) => Promise<{ success: boolean; error?: string }>;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

// Initial fallback mock data for smooth offline/dev operation
const initialMockEntries: QueueEntryItem[] = [
  { id: "q1", customerName: "Rahul Sharma (Walk-in)", serviceNames: ["Hair Cut", "Beard Styling"], entryType: "WALK_IN", status: "IN_SERVICE", position: 1, waitingTimeMinutes: 0 },
  { id: "q2", customerName: "Ananya Krishnan", serviceNames: ["Classic Facial"], entryType: "ONLINE", status: "WAITING", position: 2, waitingTimeMinutes: 20 },
  { id: "q3", customerName: "Vikram Nair", serviceNames: ["Senior Haircut"], entryType: "ONLINE", status: "WAITING", position: 3, waitingTimeMinutes: 35 },
];

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queueEntries, setQueueEntries] = useState<QueueEntryItem[]>(initialMockEntries);
  const [totalWaiting, setTotalWaiting] = useState(2);
  const [currentlyServingCount, setCurrentlyServingCount] = useState(1);
  const [availableStylistsCount, setAvailableStylistsCount] = useState(4);
  const [averageWaitMinutes, setAverageWaitMinutes] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const refreshQueue = async () => {
    try {
      const res = await apiFetch("/queue");
      if (res.success && res.data) {
        setQueueEntries(res.data.entries || []);
        setTotalWaiting(res.data.totalWaiting || 0);
        setCurrentlyServingCount(res.data.currentlyServingCount || 0);
        setAvailableStylistsCount(res.data.availableStylistsCount || 4);
        setAverageWaitMinutes(res.data.averageWaitMinutes || 15);
      }
    } catch (err) {
      // Keep state resilient
    }
  };

  useEffect(() => {
    refreshQueue();
    const interval = setInterval(refreshQueue, 15000); // 15s poll
    return () => clearInterval(interval);
  }, []);

  const registerWalkIn = async (data: { customerName: string; customerPhone?: string; serviceNames: string[]; stylistId?: string }) => {
    const res = await apiFetch("/queue/walkin", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) {
      await refreshQueue();
      return { success: true };
    }

    // Local fallback update for demo
    const newEntry: QueueEntryItem = {
      id: `w-${Date.now()}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      serviceNames: data.serviceNames,
      entryType: "WALK_IN",
      status: "WAITING",
      position: queueEntries.length + 1,
      waitingTimeMinutes: (queueEntries.length - 1) * 15,
    };
    setQueueEntries((prev) => [...prev, newEntry]);
    setTotalWaiting((prev) => prev + 1);
    return { success: true };
  };

  const updateQueueStatus = async (id: string, status: QueueEntryItem["status"]) => {
    const res = await apiFetch(`/queue/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (res.success) {
      await refreshQueue();
      return { success: true };
    }

    // Local state fallback
    setQueueEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
    return { success: true };
  };

  return (
    <QueueContext.Provider
      value={{
        queueEntries,
        totalWaiting,
        currentlyServingCount,
        availableStylistsCount,
        averageWaitMinutes,
        isLoading,
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
