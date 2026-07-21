"use client";

import { useState, useEffect, useMemo, memo } from "react";
import {
  Check, ChevronDown, ChevronRight, Shield, CheckCircle2,
  MapPin, Phone, MessageCircle, Loader2, AlertCircle,
} from "lucide-react";
import { fetchStylists, fetchServices, createBooking } from "../../../lib/apiServices";
import type { Stylist, Service, Booking } from "../../../lib/apiServices";
import { StylistCardSkeleton } from "../ui/SalonSkeletons";
import { showToast } from "../../../lib/toast";
import { useAuth } from "../../../context/AuthContext";

interface BookingPageProps {
  navigate: (p: "home" | "queue") => void;
  preSelectedServiceId?: string;
}

interface BookingFormData {
  customerName: string;
  customerPhone: string;
  customerType: string;
  selectedServiceIds: string[];
  stylistId: string;
  date: string;
  timeSlot: string;
  offerCode: string;
  notes: string;
}

const CUSTOMER_TYPES = [
  { value: "Adult Male", emoji: "👨", label: "Adult Male" },
  { value: "Adult Female", emoji: "👩", label: "Adult Female" },
  { value: "Kids", emoji: "🧒", label: "Kids" },
  { value: "Senior", emoji: "👴", label: "Senior" },
];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const STEP_LABELS = ["Who", "Service", "Stylist", "Date", "Time", "Review"];

const GENDER_MAP: Record<string, string[]> = {
  "Adult Male": ["Male", "Unisex"],
  "Adult Female": ["Female", "Unisex"],
  "Kids": ["Unisex"],
  "Senior": ["Male", "Female", "Unisex"],
};

const AGE_MAP: Record<string, string[]> = {
  "Adult Male": ["Adult", "All"],
  "Adult Female": ["Adult", "All"],
  "Kids": ["Kids", "All"],
  "Senior": ["Senior", "All"],
};

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getNextDates(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
}

function BookingPage({ navigate, preSelectedServiceId }: BookingPageProps) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    customerName: "",
    customerPhone: "",
    customerType: "",
    selectedServiceIds: preSelectedServiceId ? [preSelectedServiceId] : [],
    stylistId: "",
    date: "",
    timeSlot: "",
    offerCode: "",
    notes: "",
  });

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [stylistsLoading, setStylistsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Hydration safety
  useEffect(() => { setIsMounted(true); }, []);

  // Pre-fill user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name,
        customerPhone: prev.customerPhone || user.phone,
      }));
    }
  }, [user]);

  // Load stylists
  useEffect(() => {
    setStylistsLoading(true);
    fetchStylists()
      .then((res) => { if (res.success && res.data) setStylists(res.data); })
      .finally(() => setStylistsLoading(false));
  }, []);

  // Load services when customer type changes
  useEffect(() => {
    if (!formData.customerType) return;
    setServicesLoading(true);
    fetchServices()
      .then((res) => { if (res.success && res.data) setAllServices(res.data); })
      .finally(() => setServicesLoading(false));
  }, [formData.customerType]);

  // Filter services for customer type
  const filteredServices = useMemo(() => {
    if (!formData.customerType || allServices.length === 0) return [];
    const allowedGenders = GENDER_MAP[formData.customerType] || ["Unisex"];
    const allowedAges = AGE_MAP[formData.customerType] || ["All"];
    return allServices.filter(
      (s) =>
        allowedGenders.includes(s.targetGender) &&
        allowedAges.includes(s.targetAgeGroup)
    );
  }, [allServices, formData.customerType]);

  // Selected service objects
  const selectedServices = allServices.filter((s) =>
    formData.selectedServiceIds.includes(s.id)
  );

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  const toggleService = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServiceIds: prev.selectedServiceIds.includes(id)
        ? prev.selectedServiceIds.filter((s) => s !== id)
        : [...prev.selectedServiceIds, id],
    }));
  };

  const handleConfirmBooking = async () => {
    if (!formData.customerName || !formData.customerPhone) {
      setSubmitError("Please provide your name and phone number.");
      return;
    }
    if (formData.selectedServiceIds.length === 0) {
      setSubmitError("Please select at least one service.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Convert date string to ISO format
    const dateObj = getNextDates(14).find(
      (d) => d.toISOString().split("T")[0] === formData.date
    );

    const res = await createBooking({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerType: formData.customerType,
      serviceIds: formData.selectedServiceIds,
      stylistId: formData.stylistId || undefined,
      date: formData.date,
      timeSlot: formData.timeSlot,
      offerCode: formData.offerCode || undefined,
      notes: formData.notes || undefined,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      setConfirmedBooking(res.data);
      showToast.success("Booking confirmed!", "We'll send you a confirmation shortly.");
      setStep(7);
    } else {
      const msg = res.error?.message || "Booking failed. Please try again.";
      setSubmitError(msg);
      showToast.error("Booking failed", msg);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setFormData({
      customerName: user?.name || "",
      customerPhone: user?.phone || "",
      customerType: "",
      selectedServiceIds: [],
      stylistId: "",
      date: "",
      timeSlot: "",
      offerCode: "",
      notes: "",
    });
    setConfirmedBooking(null);
    setSubmitError(null);
  };

  const isDone = step > 6;
  const nextDates = isMounted ? getNextDates(14) : [];

  return (
    <div className="pt-20 min-h-screen bg-[#F7F5F2] page-transition">
      {isDone && confirmedBooking ? (
        // ── Confirmation Screen ──────────────────────────────────────────────
        <div className="max-w-lg mx-auto px-6 py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-[#EEF5F1] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#5F8D6D]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-[#2B2B2B] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Booking Confirmed!</h1>
          <p className="text-[#6B7280] mb-7 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
            Your appointment has been confirmed. We look forward to seeing you!
          </p>
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 text-left space-y-4">
            <div className="border-b border-black/[0.06] pb-4">
              <p className="text-xs text-[#6B7280] mb-1" style={{ fontFamily: "Inter, sans-serif" }}>Booking ID</p>
              <code className="text-sm font-mono text-[#2B2B2B]">{confirmedBooking.id.slice(0, 8).toUpperCase()}</code>
            </div>
            {[
              { label: "Customer", value: confirmedBooking.customerName },
              { label: "Services", value: confirmedBooking.bookingItems.map((i) => i.serviceName).join(", ") },
              { label: "Date", value: new Date(confirmedBooking.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
              { label: "Time", value: confirmedBooking.timeSlot },
              { label: "Duration", value: formatDuration(confirmedBooking.totalDuration) },
              { label: "Total", value: formatPrice(confirmedBooking.netPrice) },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                <span className="font-medium text-[#2B2B2B] text-right max-w-[200px]" style={{ fontFamily: "Inter, sans-serif" }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetBooking}
              className="bg-[#5F8D6D] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#4a7057] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Book Another
            </button>
            <button
              onClick={() => navigate("home")}
              className="border border-black/[0.08] text-[#2B2B2B] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Progress stepper */}
          <div className="mb-10" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={6} aria-label="Booking progress">
            <div className="flex items-center justify-between mb-4">
              {STEP_LABELS.map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i + 1 < step
                        ? "bg-[#5F8D6D] text-white"
                        : i + 1 === step
                        ? "bg-[#C97C5D] text-white ring-4 ring-[#C97C5D]/20"
                        : "bg-white text-[#6B7280] border border-black/10"
                    }`}
                    aria-label={`Step ${i + 1}: ${label}${i + 1 < step ? " (completed)" : i + 1 === step ? " (current)" : ""}`}
                  >
                    {i + 1 < step ? <Check className="w-4 h-4" aria-hidden="true" /> : i + 1}
                  </div>
                  <span className={`text-[10px] hidden sm:block font-medium ${i + 1 === step ? "text-[#C97C5D]" : "text-[#6B7280]"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5F8D6D] rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {/* Step 1 — Contact Info + Customer Type */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Who is this appointment for?</h2>
                <p className="text-[#6B7280] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>We&apos;ll personalise your experience based on this.</p>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData((p) => ({ ...p, customerName: e.target.value }))}
                      placeholder="Priya Sharma"
                      required
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData((p) => ({ ...p, customerPhone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#2B2B2B] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>Customer Type *</p>
                <div className="grid grid-cols-2 gap-4">
                  {CUSTOMER_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setFormData((p) => ({ ...p, customerType: type.value, selectedServiceIds: [] }));
                        setStep(2);
                      }}
                      className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-[#5F8D6D] ${
                        formData.customerType === type.value
                          ? "border-[#5F8D6D] bg-[#EEF5F1]"
                          : "border-black/[0.08]"
                      }`}
                      aria-pressed={formData.customerType === type.value}
                    >
                      <div className="text-4xl mb-3" aria-hidden="true">{type.emoji}</div>
                      <div className="font-semibold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Service Selection */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose Services</h2>
                <p className="text-[#6B7280] text-sm mb-1" style={{ fontFamily: "Inter, sans-serif" }}>For {formData.customerType} · Select one or more</p>

                {formData.selectedServiceIds.length > 0 && (
                  <div className="flex items-center justify-between bg-[#EEF5F1] rounded-xl px-4 py-2.5 mb-4">
                    <span className="text-xs text-[#5F8D6D] font-medium">{formData.selectedServiceIds.length} selected · {formatDuration(totalDuration)} · {formatPrice(totalPrice)}</span>
                    <button onClick={() => setStep(3)} className="text-xs font-bold text-[#5F8D6D] hover:underline">Continue →</button>
                  </div>
                )}

                {servicesLoading ? (
                  <div className="space-y-2.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : filteredServices.length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-8">No services available for this category.</p>
                ) : (
                  <div className="space-y-2.5 mb-6 max-h-80 overflow-y-auto pr-1">
                    {filteredServices.map((svc) => {
                      const selected = formData.selectedServiceIds.includes(svc.id);
                      return (
                        <button
                          key={svc.id}
                          onClick={() => toggleService(svc.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all hover:border-[#5F8D6D] ${
                            selected ? "border-[#5F8D6D] bg-[#EEF5F1]" : "border-black/[0.08]"
                          }`}
                          aria-pressed={selected}
                        >
                          <div>
                            <span className="font-medium text-[#2B2B2B] text-sm block" style={{ fontFamily: "Inter, sans-serif" }}>{svc.name}</span>
                            <span className="text-xs text-[#6B7280]">{formatDuration(svc.durationMinutes)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-[#C97C5D] text-sm">{formatPrice(svc.price)}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? "bg-[#5F8D6D] border-[#5F8D6D]" : "border-[#D8C4B6]"}`} aria-hidden="true">
                              {selected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4">
                  <button onClick={() => setStep(1)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={formData.selectedServiceIds.length === 0}
                    className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#b86b4c] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Stylist */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose Your Stylist</h2>
                <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Or skip to let us assign the best match</p>
                {stylistsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <StylistCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Any stylist option */}
                    <button
                      onClick={() => { setFormData((p) => ({ ...p, stylistId: "" })); setStep(4); }}
                      className={`p-5 rounded-2xl border-2 text-left transition-all hover:border-[#5F8D6D] ${!formData.stylistId ? "border-[#5F8D6D] bg-[#EEF5F1]" : "border-black/[0.08]"}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#EEF5F1] flex items-center justify-center text-[#5F8D6D] text-xl mb-3" aria-hidden="true">✨</div>
                      <div className="font-semibold text-[#2B2B2B] text-sm mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Best Available</div>
                      <div className="text-xs text-[#6B7280]">Assigned by our team</div>
                    </button>
                    {stylists.filter((s) => s.isAvailable).map((s) => {
                      const photoSrc = s.photoUrl?.startsWith("photo-")
                        ? `https://images.unsplash.com/${s.photoUrl}?w=100&h=100&fit=crop&auto=format`
                        : s.photoUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop";
                      return (
                        <button
                          key={s.id}
                          onClick={() => { setFormData((p) => ({ ...p, stylistId: s.id })); setStep(4); }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all hover:border-[#5F8D6D] ${formData.stylistId === s.id ? "border-[#5F8D6D] bg-[#EEF5F1]" : "border-black/[0.08]"}`}
                          aria-pressed={formData.stylistId === s.id}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img src={photoSrc} alt={s.name} className="w-12 h-12 rounded-full object-cover bg-[#D8C4B6]" loading="lazy" />
                            <div>
                              <div className="font-semibold text-[#2B2B2B] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{s.name}</div>
                              <div className="text-xs text-[#6B7280]">{s.experience}</div>
                            </div>
                          </div>
                          <span className="text-xs text-[#5F8D6D] font-medium">{s.specialization}</span>
                          <span className="ml-2 text-[10px] text-amber-600">★ {s.rating.toFixed(1)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <button onClick={() => setStep(2)} className="mt-6 text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
              </div>
            )}

            {/* Step 4 — Date */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose a Date</h2>
                <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Select your preferred appointment date</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 mb-8" suppressHydrationWarning>
                  {isMounted && nextDates.map((d, i) => {
                    const dateStr = d.toISOString().split("T")[0];
                    const selected = formData.date === dateStr;
                    const weekend = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <button
                        key={i}
                        onClick={() => setFormData((p) => ({ ...p, date: dateStr }))}
                        aria-pressed={selected}
                        aria-label={d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                        className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                          selected ? "border-[#5F8D6D] bg-[#EEF5F1] text-[#5F8D6D]"
                          : weekend ? "border-[#FAF0EC] bg-[#FAF0EC] text-[#C97C5D]"
                          : "border-black/[0.08] hover:border-[#5F8D6D]"
                        }`}
                      >
                        <div className="text-[10px] font-medium">{d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                        <div className="text-base font-bold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{d.getDate()}</div>
                        <div className="text-[10px]">{d.toLocaleDateString("en-IN", { month: "short" })}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => setStep(3)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors">← Back</button>
                  <button
                    onClick={() => setStep(5)}
                    disabled={!formData.date}
                    className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#b86b4c] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 — Time */}
            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose a Time</h2>
                <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>
                  {formData.date ? new Date(formData.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) : ""}
                </p>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setFormData((p) => ({ ...p, timeSlot: time }))}
                      aria-pressed={formData.timeSlot === time}
                      className={`p-3.5 rounded-2xl border-2 text-sm font-medium transition-all ${
                        formData.timeSlot === time
                          ? "border-[#5F8D6D] bg-[#EEF5F1] text-[#5F8D6D]"
                          : "border-black/[0.08] text-[#2B2B2B] hover:border-[#5F8D6D]"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                {/* Optional notes */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="notes">Special Requests (optional)</label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Any special requests or allergies we should know about..."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors resize-none"
                  />
                </div>

                {/* Optional offer code */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="offerCode">Offer Code (optional)</label>
                  <input
                    id="offerCode"
                    type="text"
                    value={formData.offerCode}
                    onChange={(e) => setFormData((p) => ({ ...p, offerCode: e.target.value.toUpperCase() }))}
                    placeholder="e.g. FAMILY15"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] font-mono focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={() => setStep(4)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors">← Back</button>
                  <button
                    onClick={() => setStep(6)}
                    disabled={!formData.timeSlot}
                    className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#b86b4c] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 6 — Review & Confirm */}
            {step === 6 && (
              <div>
                <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Review & Confirm</h2>
                <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Here is a summary of your appointment</p>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Name", value: formData.customerName, emoji: "👤" },
                    { label: "Customer", value: formData.customerType, emoji: "🎯" },
                    {
                      label: "Services",
                      value: selectedServices.length > 0
                        ? selectedServices.map((s) => s.name).join(", ")
                        : "—",
                      emoji: "✂️",
                    },
                    {
                      label: "Stylist",
                      value: formData.stylistId
                        ? (stylists.find((s) => s.id === formData.stylistId)?.name || "—")
                        : "Best Available",
                      emoji: "💆",
                    },
                    {
                      label: "Date",
                      value: formData.date
                        ? new Date(formData.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                        : "—",
                      emoji: "📅",
                    },
                    { label: "Time", value: formData.timeSlot, emoji: "⏰" },
                    { label: "Duration", value: formatDuration(totalDuration), emoji: "⏱️" },
                    { label: "Total", value: formatPrice(totalPrice), emoji: "💳" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl bg-[#F7F5F2]">
                      <span className="text-xl flex-shrink-0" aria-hidden="true">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-[#6B7280] mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</div>
                        <div className="font-semibold text-[#2B2B2B] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#EEF5F1] rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#5F8D6D] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[#5F8D6D]" style={{ fontFamily: "Inter, sans-serif" }}>
                    Free cancellation up to 2 hours before your appointment. No hidden charges.
                  </p>
                </div>

                {submitError && (
                  <div className="mb-4 p-4 bg-red-50 rounded-2xl flex items-start gap-3" role="alert">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm text-red-600" style={{ fontFamily: "Inter, sans-serif" }}>{submitError}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button onClick={() => setStep(5)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}
                    className="bg-[#C97C5D] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#b86b4c] transition-colors disabled:opacity-60 flex items-center gap-2"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Confirming...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { href: "https://maps.google.com/?q=Koramangala+Bangalore", icon: MapPin, label: "Find Us", sub: "Get Directions", bg: "#EEF5F1", color: "#5F8D6D" },
              { href: "tel:+919876543210", icon: Phone, label: "Call Us", sub: "+91 98765 43210", bg: "#FAF0EC", color: "#C97C5D" },
              { href: "https://wa.me/919876543210", icon: MessageCircle, label: "WhatsApp", sub: "Chat with Us", bg: "#E8F8EF", color: "#25D366" },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.label}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                  <c.icon className="w-5 h-5" style={{ color: c.color }} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{c.label}</div>
                  <div className="text-sm font-medium text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>{c.sub}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(BookingPage);
