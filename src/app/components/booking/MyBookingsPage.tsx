"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, User, Scissors, CreditCard, AlertCircle,
  Loader2, Trash2, CalendarX, ArrowLeft, Star
} from "lucide-react";
import { fetchMyBookings, updateBookingStatus } from "../../../lib/apiServices";
import type { Booking } from "../../../lib/apiServices";
import { showToast } from "../../../lib/toast";
import { useAuth } from "../../../context/AuthContext";

interface MyBookingsPageProps {
  navigate: (path: string) => void;
}

export default function MyBookingsPage({ navigate }: MyBookingsPageProps) {
  const { isAuthenticated, user, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<"upcoming" | "past">("upcoming");

  const loadBookings = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    const res = await fetchMyBookings();
    if (res.success && res.data) {
      setBookings(res.data);
    } else {
      showToast.error("Failed to load bookings", res.error?.message || "Something went wrong.");
    }
    setLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loadBookings]);

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    setCancellingId(id);
    const res = await updateBookingStatus(id, "CANCELLED");
    setCancellingId(null);

    if (res.success) {
      showToast.success("Booking Cancelled", "Your appointment has been successfully cancelled.");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" as const } : b))
      );
    } else {
      showToast.error("Cancellation failed", res.error?.message || "Could not cancel booking.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-[#F7F5F2] flex items-center justify-center pt-24 px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-black/5">
          <CalendarX className="w-12 h-12 text-[#C97C5D] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Access Your Bookings</h2>
          <p className="text-sm text-[#6B7280] mb-6">Please log in to view your upcoming appointments and appointment history.</p>
          <button
            onClick={() => openAuthModal("login")}
            className="bg-[#5F8D6D] hover:bg-[#4a7057] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors w-full shadow-sm"
          >
            Login / Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Filter bookings into upcoming and past
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter((b) => {
    const isPastDate = new Date(b.date) < now;
    return !isPastDate && ["PENDING", "CONFIRMED", "IN_PROGRESS"].includes(b.status);
  });

  const pastBookings = bookings.filter((b) => {
    const isPastDate = new Date(b.date) < now;
    return isPastDate || ["COMPLETED", "CANCELLED"].includes(b.status);
  });

  const activeBookingsList = activeSubTab === "upcoming" ? upcomingBookings : pastBookings;

  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#EEF5F1] text-[#5F8D6D]";
      case "PENDING":
        return "bg-amber-50 text-amber-600";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-600";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600";
      case "CANCELLED":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const formatPrice = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatDuration = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return hrs > 0 ? `${hrs} hr ${m > 0 ? `${m} mins` : ""}` : `${m} mins`;
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F7F5F2] pb-16 page-transition" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 mb-8">
          <div className="flex items-center gap-2 text-[#6B7280] hover:text-[#5F8D6D] transition-colors mb-4 cursor-pointer text-xs font-semibold" onClick={() => navigate("home")}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </div>
          <h1 className="text-3xl font-bold text-[#2B2B2B] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            My Appointments
          </h1>
          <p className="text-sm text-[#6B7280]">
            Review, track, or cancel your salon reservations. Hello, {user?.name.split(" ")[0]}!
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6 border-b border-black/[0.04] pb-3" role="tablist">
          {[
            { id: "upcoming", label: `Upcoming (${upcomingBookings.length})` },
            { id: "past", label: `History (${pastBookings.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              role="tab"
              aria-selected={activeSubTab === tab.id}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === tab.id
                  ? "bg-[#5F8D6D] text-white shadow-sm"
                  : "bg-white text-[#6B7280] hover:text-[#2B2B2B] border border-black/5 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-44 rounded-3xl bg-white border border-black/5 animate-pulse p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-6 w-28 bg-gray-100 rounded-lg" />
                  <div className="h-6 w-16 bg-gray-100 rounded-lg" />
                </div>
                <div className="h-4 w-48 bg-gray-100 rounded-lg" />
                <div className="h-4 w-32 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : activeBookingsList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-black/5">
            <Calendar className="w-12 h-12 text-[#5F8D6D] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-[#2B2B2B] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              {activeSubTab === "upcoming" ? "No Upcoming Appointments" : "No Past Appointments"}
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              {activeSubTab === "upcoming"
                ? "You don't have any appointments booked for the future. Book one today!"
                : "You haven't completed any visits yet."}
            </p>
            {activeSubTab === "upcoming" && (
              <button
                onClick={() => navigate("booking")}
                className="bg-[#C97C5D] hover:bg-[#b86b4c] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                Book Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {activeBookingsList.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block mb-1">
                      Booking ID: {booking.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-[#2B2B2B]">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Details layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Services list */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-bold text-[#6B7280] flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5" /> Selected Services
                    </h4>
                    <div className="bg-[#F7F5F2] rounded-2xl p-4 border border-black/[0.03] space-y-3.5">
                      {booking.bookingItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-start text-xs">
                          <div>
                            <span className="font-semibold text-[#2B2B2B]">{item.serviceName}</span>
                            <span className="text-[10px] text-[#6B7280] block mt-0.5">{item.duration} mins</span>
                          </div>
                          <span className="font-bold text-[#2B2B2B]">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                      <div className="border-t border-black/[0.05] pt-3 flex justify-between items-center text-xs font-bold">
                        <span className="text-[#2B2B2B]">Net Price Paid:</span>
                        <span className="text-sm text-[#5F8D6D]">{formatPrice(booking.netPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Time and Stylist info */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#6B7280] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Schedule details
                      </h4>
                      <div className="text-xs text-[#2B2B2B] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-[#5F8D6D] flex-shrink-0" />
                          {new Date(booking.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#5F8D6D] flex-shrink-0" />
                          {booking.timeSlot} ({formatDuration(booking.totalDuration)})
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#6B7280] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Stylist
                      </h4>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={booking.stylist?.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format"}
                          alt={booking.stylist?.name || "Any Stylist"}
                          className="w-8 h-8 rounded-full object-cover border border-[#5F8D6D]/15"
                        />
                        <span className="text-xs font-semibold text-[#2B2B2B]">
                          {booking.stylist?.name || "Any Available Stylist"}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="space-y-1 bg-[#EEF5F1]/30 border border-[#5F8D6D]/10 rounded-xl p-3 text-[11px] text-[#6B7280]">
                        <span className="font-bold text-[#2B2B2B] block">Notes:</span>
                        {booking.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cancellation trigger */}
                {activeSubTab === "upcoming" && ["PENDING", "CONFIRMED"].includes(booking.status) && (
                  <div className="flex justify-end mt-4 pt-4 border-t border-black/[0.04]">
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" /> Cancelling…
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" /> Cancel Appointment
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
