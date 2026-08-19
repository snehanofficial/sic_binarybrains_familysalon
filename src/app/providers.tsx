"use client";

import React from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { QueueProvider } from "../context/QueueContext";
import { NotificationProvider } from "../context/NotificationContext";

function InnerProviders({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return (
    <NotificationProvider isAuthenticated={isAuthenticated}>
      {children}
    </NotificationProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueueProvider>
        <InnerProviders>{children}</InnerProviders>
      </QueueProvider>
    </AuthProvider>
  );
}
