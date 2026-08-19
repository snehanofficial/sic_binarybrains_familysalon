/**
 * Centralized typed API service functions.
 * All functions return typed results with loading/error handling built in.
 */
import { apiFetch } from "./api";

// ── TYPES ─────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  _count?: { services: number };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  targetGender: string;
  targetAgeGroup: string;
  imageUrl: string;
  benefits: string[];
  isEnabled: boolean;
  category: Category;
}

export interface Stylist {
  id: string;
  name: string;
  photoUrl: string;
  experience: string;
  specialization: string;
  rating: number;
  isAvailable: boolean;
  workingHours: string;
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  badge: string;
  category: string;
  isEnabled: boolean;
  validUntil?: string;
}

export interface Review {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface BookingItem {
  id: string;
  serviceName: string;
  duration: number;
  price: number;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerType: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  totalDuration: number;
  totalPrice: number;
  totalDiscount: number;
  netPrice: number;
  notes?: string;
  bookingItems: BookingItem[];
  stylist?: Stylist;
  createdAt: string;
}

export interface CreateBookingPayload {
  customerName: string;
  customerPhone: string;
  customerType: string;
  serviceIds: string[];
  stylistId?: string;
  date: string;
  timeSlot: string;
  offerCode?: string;
  notes?: string;
}

export interface QueueData {
  totalWaiting: number;
  currentlyServingCount: number;
  availableStylistsCount: number;
  averageWaitMinutes: number;
  entries: QueueEntry[];
}

export interface QueueEntry {
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

export interface AdminMetrics {
  todayRevenue: number;
  todayBookingsCount: number;
  waitingCustomersCount: number;
  availableChairsCount: number;
  totalStylistsCount: number;
  peakHours: string;
  popularServices: { name: string; count: number }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
  _count: { bookings: number };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// ── API FUNCTIONS ──────────────────────────────────────────────────────────────

// Services & Catalog
export const fetchCategories = () =>
  apiFetch<Category[]>("/categories");

export const fetchServices = (params?: {
  category?: string;
  gender?: string;
  ageGroup?: string;
  search?: string;
  maxPrice?: number;
  all?: boolean;
}) => {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.gender) query.set("gender", params.gender);
  if (params?.ageGroup) query.set("ageGroup", params.ageGroup);
  if (params?.search) query.set("search", params.search);
  if (params?.maxPrice) query.set("maxPrice", String(params.maxPrice));
  if (params?.all) query.set("all", "true");
  const qs = query.toString();
  return apiFetch<Service[]>(`/services${qs ? `?${qs}` : ""}`);
};

export const fetchStylists = () =>
  apiFetch<Stylist[]>("/stylists");

export const fetchOffers = () =>
  apiFetch<Offer[]>("/offers");

export const fetchReviews = () =>
  apiFetch<Review[]>("/reviews");

// Bookings
export const createBooking = (payload: CreateBookingPayload) =>
  apiFetch<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchMyBookings = () =>
  apiFetch<Booking[]>("/bookings");

export const updateBookingStatus = (id: string, status: Booking["status"]) =>
  apiFetch<Booking>(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Queue
export const fetchQueue = () =>
  apiFetch<QueueData>("/queue");

export const registerWalkIn = (data: {
  customerName: string;
  customerPhone?: string;
  serviceNames: string[];
  stylistId?: string;
}) =>
  apiFetch<QueueEntry>("/queue/walkin", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateQueueStatus = (
  id: string,
  status: QueueEntry["status"]
) =>
  apiFetch<QueueEntry>(`/queue/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Admin
export const fetchAdminMetrics = () =>
  apiFetch<AdminMetrics>("/admin/metrics");

export const fetchCustomers = () =>
  apiFetch<Customer[]>("/admin/customers");

export const updateCustomerStatus = (
  id: string,
  status: "ACTIVE" | "DISABLED"
) =>
  apiFetch<Customer>(`/admin/customers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const fetchAdminSettings = () =>
  apiFetch<any>("/admin/settings");

export const fetchAuditLogs = () =>
  apiFetch<any[]>("/admin/audit-logs");

// Notifications
export const fetchNotifications = () =>
  apiFetch<NotificationItem[]>("/notifications");

export const markNotificationRead = (id: string) =>
  apiFetch<NotificationItem>(`/notifications/${id}/read`, { method: "PATCH" });

export const markAllNotificationsRead = () =>
  apiFetch("/notifications/read-all", { method: "PATCH" });

// Admin Catalog & Services Types
export interface AdminServicePayload {
  name: string;
  categoryId: string;
  description: string;
  durationMinutes: number;
  price: number;
  targetGender: string;
  targetAgeGroup: string;
  imageUrl: string;
  benefits: string[];
  isEnabled: boolean;
}

export interface AdminStylistPayload {
  name: string;
  photoUrl: string;
  experience: string;
  specialization: string;
  workingHours: string;
  isAvailable: boolean;
}

export interface AdminOfferPayload {
  title: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  badge: string;
  category: string;
  isEnabled: boolean;
  validUntil: string | null;
}

// Admin Catalog & Services
export const fetchAdminServices = () =>
  apiFetch<Service[]>("/admin/services");

export const createAdminService = (payload: AdminServicePayload) =>
  apiFetch<Service>("/admin/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminService = (id: string, payload: Partial<AdminServicePayload>) =>
  apiFetch<Service>(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminService = (id: string) =>
  apiFetch<{ success: boolean }>(`/admin/services/${id}`, {
    method: "DELETE",
  });

// Admin Stylists
export const fetchAdminStylists = () =>
  apiFetch<Stylist[]>("/admin/stylists");

export const createAdminStylist = (payload: AdminStylistPayload) =>
  apiFetch<Stylist>("/admin/stylists", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminStylist = (id: string, payload: Partial<AdminStylistPayload>) =>
  apiFetch<Stylist>(`/admin/stylists/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminStylist = (id: string) =>
  apiFetch<{ success: boolean }>(`/admin/stylists/${id}`, {
    method: "DELETE",
  });

// Admin Offers
export const fetchAdminOffers = () =>
  apiFetch<Offer[]>("/admin/offers");

export const createAdminOffer = (payload: AdminOfferPayload) =>
  apiFetch<Offer>("/admin/offers", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateAdminOffer = (id: string, payload: Partial<AdminOfferPayload>) =>
  apiFetch<Offer>(`/admin/offers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteAdminOffer = (id: string) =>
  apiFetch<{ success: boolean }>(`/admin/offers/${id}`, {
    method: "DELETE",
  });
