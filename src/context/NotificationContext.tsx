"use client";

import React, { createContext, useContext, useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "OFFER";
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (title: string, message: string, type?: NotificationItem["type"]) => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const initialNotifications: NotificationItem[] = [
  { id: "n1", title: "Booking Confirmed", message: "Your appointment for Hair Cut & Beard Styling is confirmed for tomorrow at 10:00 AM.", type: "SUCCESS", read: false, createdAt: "10 mins ago" },
  { id: "n2", title: "Queue Update", message: "Your estimated wait time is now 15 minutes. 1 customer ahead of you.", type: "INFO", read: false, createdAt: "25 mins ago" },
  { id: "n3", title: "Special Offer", message: "Flat 15% off on all bridal and family packages this week with code FAMILY15.", type: "OFFER", read: true, createdAt: "2 hours ago" },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string, type: NotificationItem["type"] = "INFO") => {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      createdAt: "Just now",
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
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
