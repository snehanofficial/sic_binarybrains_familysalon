"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch, setAccessToken } from "../lib/api";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "../lib/apiServices";
import type { NotificationItem } from "../lib/apiServices";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (title: string, message: string, type?: string) => void;
  refreshNotifications: () => Promise<void>;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const refreshNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetchNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationRead(id).catch(() => {});
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead().catch(() => {});
  };

  const addNotification = (title: string, message: string, type: string = "INFO") => {
    const newItem: NotificationItem = {
      id: `local-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        addNotification,
        refreshNotifications,
        isDrawerOpen,
        toggleDrawer,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
}

export type { NotificationItem };
