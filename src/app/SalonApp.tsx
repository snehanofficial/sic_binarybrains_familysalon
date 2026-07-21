"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { QueueProvider } from "../context/QueueContext";
import { NotificationProvider } from "../context/NotificationContext";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthModal from "./components/auth/AuthModal";
import NotificationDrawer from "./components/notifications/NotificationDrawer";
import FloatingChatButton from "./components/chatbot/FloatingChatButton";

// Lazy-load heavy page components for better initial load performance
const HomePage = lazy(() => import("./components/home/HomePage"));
const ServicesPage = lazy(() => import("./components/services/ServicesPage"));
const BookingPage = lazy(() => import("./components/booking/BookingPage"));
const LiveQueueView = lazy(() => import("./components/queue/LiveQueueView"));
const StylistWorkspace = lazy(() => import("./components/stylist/StylistWorkspace"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const GalleryPage = lazy(() => import("./components/gallery/GalleryPage"));

type Page = "home" | "services" | "gallery" | "booking" | "queue" | "stylist" | "admin";
type ServiceCategory = "hair" | "skin" | "grooming" | "bridal" | "kids" | "senior";

// Full-page loading fallback (lightweight)
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#5F8D6D] flex items-center justify-center animate-pulse">
          <span className="text-white text-lg">✂</span>
        </div>
        <p className="text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>Loading…</p>
      </div>
    </div>
  );
}

function SalonContent() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [page, setPage] = useState<Page>("home");
  const [activeServiceCategory, setActiveServiceCategory] = useState<ServiceCategory>("hair");
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToBooking = useCallback((serviceId?: string) => {
    setPreSelectedServiceId(serviceId);
    navigate("booking");
  }, [navigate]);

  const setActiveCategory = useCallback((cat: ServiceCategory) => {
    setActiveServiceCategory(cat);
  }, []);

  // Show minimal loader until auth is initialized (prevents flash of unauthenticated state)
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="w-8 h-8 rounded-xl bg-[#5F8D6D] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F2] min-h-screen">
      <Navbar page={page} navigate={navigate} goToBooking={() => goToBooking()} />

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          {page === "home" && (
            <HomePage
              navigate={navigate as (p: "home" | "services" | "gallery" | "booking" | "queue") => void}
              goToBooking={goToBooking}
              setActiveCategory={setActiveCategory}
            />
          )}
          {page === "services" && (
            <ServicesPage
              goToBooking={goToBooking}
              initialCategory={activeServiceCategory}
            />
          )}
          {page === "gallery" && (
            <GalleryPage goToBooking={goToBooking} navigate={navigate} />
          )}
          {page === "booking" && (
            <BookingPage
              navigate={navigate as (p: "home" | "queue") => void}
              preSelectedServiceId={preSelectedServiceId}
            />
          )}
          {page === "queue" && <LiveQueueView />}
          {page === "stylist" && <StylistWorkspace />}
          {page === "admin" && <AdminDashboard />}
        </Suspense>
      </main>

      <Footer navigate={navigate} />

      {/* Global overlays */}
      <AuthModal />
      <NotificationDrawer />
      <FloatingChatButton />
    </div>
  );
}

export default function SalonApp() {
  return (
    <AuthProvider>
      <QueueProvider>
        <InnerApp />
      </QueueProvider>
    </AuthProvider>
  );
}

// Inner wrapper reads auth state to pass isAuthenticated to NotificationProvider
function InnerApp() {
  const { isAuthenticated } = useAuth();

  return (
    <NotificationProvider isAuthenticated={isAuthenticated}>
      <SalonContent />
    </NotificationProvider>
  );
}
