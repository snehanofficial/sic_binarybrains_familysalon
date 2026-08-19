"use client";

import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AuthModal from "../components/auth/AuthModal";
import NotificationDrawer from "../components/notifications/NotificationDrawer";
import FloatingChatButton from "../components/chatbot/FloatingChatButton";
import { usePathname } from "next/navigation";

type Page = "home" | "services" | "gallery" | "booking" | "queue" | "stylist" | "admin";

export default function SalonLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine current active page based on routing pathname
  let page: Page = "home";
  if (pathname === "/services") page = "services";
  else if (pathname === "/gallery") page = "gallery";
  else if (pathname === "/booking") page = "booking";
  else if (pathname === "/queue") page = "queue";
  else if (pathname === "/stylist") page = "stylist";
  else if (pathname === "/admin") page = "admin";

  return (
    <div className="bg-[#F7F5F2] min-h-screen">
      <Navbar page={page} />
      <main id="main-content">{children}</main>
      <Footer />

      {/* Global overlays */}
      <AuthModal />
      <NotificationDrawer />
      <FloatingChatButton />
    </div>
  );
}
