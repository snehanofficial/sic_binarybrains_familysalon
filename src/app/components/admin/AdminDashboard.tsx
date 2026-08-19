"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, Users, Calendar, Scissors, Tag, Sliders, ShieldAlert,
  Search, RefreshCw, Loader2, AlertCircle, Plus, Edit, Trash2, Check, X, Star,
} from "lucide-react";
import {
  fetchAdminMetrics, fetchCustomers, updateCustomerStatus,
  fetchAdminSettings, fetchAuditLogs,
  fetchAdminServices, createAdminService, updateAdminService, deleteAdminService,
  fetchAdminStylists, createAdminStylist, updateAdminStylist, deleteAdminStylist,
  fetchAdminOffers, createAdminOffer, updateAdminOffer, deleteAdminOffer,
  fetchCategories,
} from "../../../lib/apiServices";
import type { AdminMetrics, Customer, Stylist, Service, Offer, Category } from "../../../lib/apiServices";
import { KPICardSkeleton, TableRowSkeleton } from "../ui/SalonSkeletons";
import { ErrorState } from "../ui/ErrorState";
import { showToast } from "../../../lib/toast";

type Tab = "overview" | "customers" | "stylists" | "services" | "offers" | "settings" | "audit";

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Overview state
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(false);

  // Customers state
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const loadMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError(false);
    const res = await fetchAdminMetrics();
    if (res.success && res.data) {
      setMetrics(res.data);
    } else {
      setMetricsError(true);
    }
    setMetricsLoading(false);
  }, []);

  const loadCustomers = useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(false);
    const res = await fetchCustomers();
    if (res.success && res.data) {
      setCustomers(res.data);
    } else {
      setCustomersError(true);
    }
    setCustomersLoading(false);
  }, []);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    const res = await fetchAdminSettings();
    if (res.success && res.data) setSettings(res.data);
    setSettingsLoading(false);
  }, []);

  const loadAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    const res = await fetchAuditLogs();
    if (res.success && res.data) setAuditLogs(res.data);
    setAuditLoading(false);
  }, []);

  // Stylists management state
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [stylistsLoading, setStylistsLoading] = useState(false);
  const [stylistModalOpen, setStylistModalOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState<Stylist | null>(null);
  const [stylistForm, setStylistForm] = useState({
    name: "",
    photoUrl: "",
    experience: "",
    specialization: "",
    workingHours: "9:00 AM - 8:00 PM",
    isAvailable: true,
  });

  // Services management state
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    durationMinutes: 30,
    price: 199,
    targetGender: "Unisex",
    targetAgeGroup: "All",
    imageUrl: "",
    benefitsText: "",
    isEnabled: true,
  });

  // Offers management state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState({
    title: "",
    code: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
    discountValue: 10,
    badge: "Promo",
    category: "All",
    isEnabled: true,
    validUntil: "",
  });

  const loadStylists = useCallback(async () => {
    setStylistsLoading(true);
    const res = await fetchAdminStylists();
    if (res.success && res.data) setStylists(res.data);
    setStylistsLoading(false);
  }, []);

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    const res = await fetchAdminServices();
    if (res.success && res.data) setServices(res.data);
    setServicesLoading(false);
  }, []);

  const loadCategories = useCallback(async () => {
    const res = await fetchCategories();
    if (res.success && res.data) setCategories(res.data);
  }, []);

  const loadOffers = useCallback(async () => {
    setOffersLoading(true);
    const res = await fetchAdminOffers();
    if (res.success && res.data) setOffers(res.data);
    setOffersLoading(false);
  }, []);

  // Initial load based on active tab
  useEffect(() => {
    if (activeTab === "overview") loadMetrics();
    if (activeTab === "customers") loadCustomers();
    if (activeTab === "settings") loadSettings();
    if (activeTab === "audit") loadAuditLogs();
    if (activeTab === "stylists") loadStylists();
    if (activeTab === "services") { loadServices(); loadCategories(); }
    if (activeTab === "offers") loadOffers();
  }, [activeTab, loadMetrics, loadCustomers, loadSettings, loadAuditLogs, loadStylists, loadServices, loadCategories, loadOffers]);

  const handleToggleCustomerStatus = async (id: string, current: "ACTIVE" | "DISABLED") => {
    const newStatus = current === "ACTIVE" ? "DISABLED" : "ACTIVE";
    setUpdatingId(id);
    const res = await updateCustomerStatus(id, newStatus);
    setUpdatingId(null);
    if (res.success) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      showToast.success(
        newStatus === "DISABLED" ? "Customer disabled" : "Customer restored",
        newStatus === "DISABLED" ? "Account access has been revoked." : "Account access has been restored."
      );
    } else {
      showToast.error("Action failed", res.error?.message || "Could not update customer status.");
    }
  };

  // Stylists handlers
  const handleOpenStylistModal = (stylist: Stylist | null = null) => {
    if (stylist) {
      setEditingStylist(stylist);
      setStylistForm({
        name: stylist.name,
        photoUrl: stylist.photoUrl,
        experience: stylist.experience,
        specialization: stylist.specialization,
        workingHours: stylist.workingHours,
        isAvailable: stylist.isAvailable,
      });
    } else {
      setEditingStylist(null);
      setStylistForm({
        name: "",
        photoUrl: "",
        experience: "",
        specialization: "",
        workingHours: "9:00 AM - 8:00 PM",
        isAvailable: true,
      });
    }
    setStylistModalOpen(true);
  };

  const handleSaveStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStylist) {
      const res = await updateAdminStylist(editingStylist.id, stylistForm);
      if (res.success) {
        showToast.success("Stylist updated", "Stylist details have been saved.");
        setStylists((prev) => prev.map((s) => (s.id === editingStylist.id ? res.data! : s)));
        setStylistModalOpen(false);
      } else {
        showToast.error("Update failed", res.error?.message || "Could not update stylist.");
      }
    } else {
      const res = await createAdminStylist(stylistForm);
      if (res.success) {
        showToast.success("Stylist created", "New stylist has been added to roster.");
        setStylists((prev) => [res.data!, ...prev]);
        setStylistModalOpen(false);
      } else {
        showToast.error("Creation failed", res.error?.message || "Could not create stylist.");
      }
    }
  };

  const handleDeleteStylist = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this stylist?")) return;
    const res = await deleteAdminStylist(id);
    if (res.success) {
      showToast.success("Stylist deleted", "Stylist has been removed.");
      setStylists((prev) => prev.filter((s) => s.id !== id));
    } else {
      showToast.error("Delete failed", res.error?.message || "Could not delete stylist. They might have active bookings.");
    }
  };

  // Services handlers
  const handleOpenServiceModal = (service: Service | null = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        categoryId: service.category?.id || "",
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        targetGender: service.targetGender,
        targetAgeGroup: service.targetAgeGroup,
        imageUrl: service.imageUrl,
        benefitsText: service.benefits.join("\n"),
        isEnabled: service.isEnabled,
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: "",
        categoryId: categories[0]?.id || "",
        description: "",
        durationMinutes: 30,
        price: 199,
        targetGender: "Unisex",
        targetAgeGroup: "All",
        imageUrl: "",
        benefitsText: "",
        isEnabled: true,
      });
    }
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...serviceForm,
      benefits: serviceForm.benefitsText.split("\n").map(b => b.trim()).filter(Boolean),
    };
    if (editingService) {
      const res = await updateAdminService(editingService.id, payload);
      if (res.success) {
        showToast.success("Service updated", "Service details have been saved.");
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? res.data! : s)));
        setServiceModalOpen(false);
      } else {
        showToast.error("Update failed", res.error?.message || "Could not update service.");
      }
    } else {
      const res = await createAdminService(payload);
      if (res.success) {
        showToast.success("Service created", "New service has been added to catalog.");
        setServices((prev) => [res.data!, ...prev]);
        setServiceModalOpen(false);
      } else {
        showToast.error("Creation failed", res.error?.message || "Could not create service.");
      }
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    const res = await deleteAdminService(id);
    if (res.success) {
      showToast.success("Service deleted", "Service has been removed.");
      setServices((prev) => prev.filter((s) => s.id !== id));
    } else {
      showToast.error("Delete failed", res.error?.message || "Could not delete service. It may be part of past bookings.");
    }
  };

  // Offers handlers
  const handleOpenOfferModal = (offer: Offer | null = null) => {
    if (offer) {
      setEditingOffer(offer);
      setOfferForm({
        title: offer.title,
        code: offer.code,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        badge: offer.badge,
        category: offer.category,
        isEnabled: offer.isEnabled,
        validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split("T")[0] : "",
      });
    } else {
      setEditingOffer(null);
      setOfferForm({
        title: "",
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 10,
        badge: "Promo",
        category: "All",
        isEnabled: true,
        validUntil: "",
      });
    }
    setOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...offerForm,
      validUntil: offerForm.validUntil ? new Date(offerForm.validUntil).toISOString() : null,
    };
    if (editingOffer) {
      const res = await updateAdminOffer(editingOffer.id, payload);
      if (res.success) {
        showToast.success("Offer updated", "Promo offer details have been saved.");
        setOffers((prev) => prev.map((o) => (o.id === editingOffer.id ? res.data! : o)));
        setOfferModalOpen(false);
      } else {
        showToast.error("Update failed", res.error?.message || "Could not update offer.");
      }
    } else {
      const res = await createAdminOffer(payload);
      if (res.success) {
        showToast.success("Offer created", "New promo offer has been activated.");
        setOffers((prev) => [res.data!, ...prev]);
        setOfferModalOpen(false);
      } else {
        showToast.error("Creation failed", res.error?.message || "Could not create offer.");
      }
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    const res = await deleteAdminOffer(id);
    if (res.success) {
      showToast.success("Offer deleted", "Offer has been removed.");
      setOffers((prev) => prev.filter((o) => o.id !== id));
    } else {
      showToast.error("Delete failed", res.error?.message || "Could not delete offer.");
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "customers", label: "Customers", icon: Users },
    { id: "stylists", label: "Stylists", icon: Calendar },
    { id: "services", label: "Services", icon: Scissors },
    { id: "offers", label: "Offers", icon: Tag },
    { id: "settings", label: "Settings", icon: Sliders },
    { id: "audit", label: "Audit Logs", icon: ShieldAlert },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#F7F5F2] pb-16 page-transition" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="bg-[#FAF0EC] text-[#C97C5D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Admin Control Centre
              </span>
              <h1 className="text-3xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Salon Operations
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">Manage bookings, staff, services and business settings.</p>
            </div>
            <div className="flex items-center gap-2 bg-[#EEF5F1] text-[#5F8D6D] px-4 py-2 rounded-2xl text-xs font-semibold">
              <TrendingUp className="w-4 h-4" aria-hidden="true" /> Live Data
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Admin sections">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={active}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active ? "bg-[#5F8D6D] text-white shadow-sm" : "bg-[#F7F5F2] text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#EEF5F1]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {metricsLoading
                ? Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
                : metricsError
                ? (
                  <div className="col-span-4 bg-white rounded-3xl">
                    <ErrorState onRetry={loadMetrics} />
                  </div>
                )
                : metrics && (
                  <>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                      <div className="text-xs text-[#6B7280] font-medium mb-1">Today&apos;s Revenue</div>
                      <div className="text-3xl font-bold text-[#5F8D6D]" style={{ fontFamily: "Poppins, sans-serif" }}>{formatCurrency(metrics.todayRevenue)}</div>
                      <div className="text-[11px] text-[#5F8D6D] mt-2 font-medium">From completed bookings</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                      <div className="text-xs text-[#6B7280] font-medium mb-1">Total Bookings Today</div>
                      <div className="text-3xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{metrics.todayBookingsCount}</div>
                      <div className="text-[11px] text-[#6B7280] mt-2">Confirmed + Pending</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                      <div className="text-xs text-[#6B7280] font-medium mb-1">Customers Waiting</div>
                      <div className="text-3xl font-bold text-[#C97C5D]" style={{ fontFamily: "Poppins, sans-serif" }}>{metrics.waitingCustomersCount}</div>
                      <div className="text-[11px] text-[#6B7280] mt-2">{metrics.availableChairsCount} chairs available</div>
                    </div>
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                      <div className="text-xs text-[#6B7280] font-medium mb-1">Peak Hours</div>
                      <div className="text-xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>{metrics.peakHours}</div>
                      <div className="text-[11px] text-[#5F8D6D] font-medium mt-1">{metrics.totalStylistsCount} stylists on roster</div>
                    </div>
                  </>
                )
              }
            </div>

            {/* Popular Services */}
            {metrics && !metricsLoading && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Top Performing Services</h3>
                  <button onClick={loadMetrics} className="p-2 rounded-lg hover:bg-[#EEF5F1] transition-colors text-[#6B7280] hover:text-[#5F8D6D]" aria-label="Refresh metrics">
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {metrics.popularServices.length === 0 ? (
                  <p className="text-sm text-[#6B7280] text-center py-4">No booking data yet for today.</p>
                ) : (
                  <div className="space-y-3">
                    {metrics.popularServices.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-[#F7F5F2] rounded-2xl">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-[#EEF5F1] text-[#5F8D6D] text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-[#2B2B2B] text-sm">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[#6B7280] text-xs">{s.count} bookings</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Customer Management</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{customers.length} registered customers</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[#F7F5F2] border border-black/10 rounded-xl text-xs w-56 focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    aria-label="Search customers"
                  />
                </div>
                <button onClick={loadCustomers} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280] hover:text-[#5F8D6D]" aria-label="Refresh customer list">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {customersLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
                </table>
              </div>
            ) : customersError ? (
              <ErrorState onRetry={loadCustomers} />
            ) : filteredCustomers.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">
                {searchQuery ? `No customers found for "${searchQuery}"` : "No customers yet."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label="Customer list">
                  <thead>
                    <tr className="border-b border-black/5 text-[#6B7280]">
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Phone</th>
                      <th className="pb-3 font-semibold">Bookings</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-4 font-semibold text-[#2B2B2B]">{c.name}</td>
                        <td className="py-4 text-[#6B7280]">{c.email}</td>
                        <td className="py-4 text-[#6B7280]">{c.phone}</td>
                        <td className="py-4 font-bold text-[#5F8D6D]">{c._count.bookings} visits</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              c.status === "ACTIVE" ? "bg-[#EEF5F1] text-[#5F8D6D]" : "bg-red-50 text-red-600"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleToggleCustomerStatus(c.id, c.status)}
                            disabled={updatingId === c.id}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1.5 ml-auto transition-colors disabled:opacity-50 ${
                              c.status === "ACTIVE"
                                ? "border border-red-200 text-red-600 hover:bg-red-50"
                                : "border border-[#5F8D6D] text-[#5F8D6D] hover:bg-[#EEF5F1]"
                            }`}
                            aria-label={`${c.status === "ACTIVE" ? "Disable" : "Restore"} ${c.name}`}
                          >
                            {updatingId === c.id && <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />}
                            {c.status === "ACTIVE" ? "Disable" : "Restore"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <h3 className="text-xl font-bold text-[#2B2B2B] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>Business Settings</h3>
            {settingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : settings ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Opening Hours", value: settings.openingHours },
                  { label: "Closing Hours", value: settings.closingHours },
                  { label: "Contact Phone", value: settings.contactPhone },
                  { label: "Contact Email", value: settings.contactEmail },
                  { label: "Max Concurrent Bookings", value: String(settings.maxConcurrentBookings) },
                  { label: "Address", value: settings.address },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">{field.label}</label>
                    <div className="px-4 py-3 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B]">
                      {field.value}
                    </div>
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Working Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {(settings.workingDays || []).map((day: string) => (
                      <span key={day} className="px-3 py-1.5 bg-[#EEF5F1] text-[#5F8D6D] text-xs font-semibold rounded-lg">{day}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ErrorState onRetry={loadSettings} />
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === "audit" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Audit Logs</h3>
              <button onClick={loadAuditLogs} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280]" aria-label="Refresh audit logs">
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            {auditLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : auditLogs.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No audit logs recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log: any) => (
                  <div key={log.id} className="flex items-start justify-between p-4 bg-[#F7F5F2] rounded-2xl">
                    <div>
                      <span className="text-xs font-semibold text-[#2B2B2B]">{log.action}</span>
                      {log.entity && <span className="text-xs text-[#6B7280] ml-2">on {log.entity}</span>}
                      {log.user && <span className="text-xs text-[#5F8D6D] ml-2">by {log.user.name}</span>}
                    </div>
                    <span className="text-[10px] text-[#6B7280] flex-shrink-0 ml-4">
                      {new Date(log.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stylists Tab */}
        {activeTab === "stylists" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Stylist Roster</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{stylists.length} registered stylists</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenStylistModal()}
                  className="bg-[#5F8D6D] hover:bg-[#4a7057] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Stylist
                </button>
                <button onClick={loadStylists} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280]" aria-label="Refresh stylists">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {stylistsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-48 rounded-3xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : stylists.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No stylists added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {stylists.map((stylist) => (
                  <div key={stylist.id} className="bg-[#F7F5F2] border border-black/[0.04] rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={stylist.photoUrl}
                          alt={stylist.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#5F8D6D]/20"
                        />
                        <div>
                          <h4 className="font-semibold text-sm text-[#2B2B2B]">{stylist.name}</h4>
                          <span className="text-[10px] bg-[#EEF5F1] text-[#5F8D6D] font-bold px-2 py-0.5 rounded-full">{stylist.experience}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#6B7280] font-medium mb-2">{stylist.specialization}</p>
                      <div className="flex items-center gap-1 mb-2 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-xs font-bold">{stylist.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-[11px] text-[#6B7280] mb-4">Hours: {stylist.workingHours}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-black/[0.04]">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${stylist.isAvailable ? "text-[#5F8D6D]" : "text-[#6B7280]"}`}>
                        <span className={`w-2 h-2 rounded-full ${stylist.isAvailable ? "bg-[#5F8D6D]" : "bg-gray-400"}`}></span>
                        {stylist.isAvailable ? "Available" : "On Leave"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenStylistModal(stylist)}
                          className="p-1.5 bg-white border border-black/10 hover:border-[#5F8D6D] hover:text-[#5F8D6D] rounded-lg transition-colors"
                          title="Edit stylist"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStylist(stylist.id)}
                          className="p-1.5 bg-white border border-black/10 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors"
                          title="Remove stylist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Service Catalog</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{services.length} services available</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenServiceModal()}
                  className="bg-[#5F8D6D] hover:bg-[#4a7057] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Service
                </button>
                <button onClick={loadServices} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280]" aria-label="Refresh services">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {servicesLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No services added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label="Services list">
                  <thead>
                    <tr className="border-b border-black/5 text-[#6B7280]">
                      <th className="pb-3 font-semibold">Service</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Duration</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Target audience</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={service.imageUrl} alt={service.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <div>
                              <span className="font-semibold text-sm text-[#2B2B2B] block">{service.name}</span>
                              <span className="text-[10px] text-[#6B7280] line-clamp-1 max-w-[200px]">{service.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-medium text-[#2B2B2B] capitalize">{service.category?.name || "Uncategorized"}</td>
                        <td className="py-4 text-[#6B7280]">{service.durationMinutes} mins</td>
                        <td className="py-4 font-bold text-[#5F8D6D]">₹{service.price}</td>
                        <td className="py-4 text-[#6B7280]">{service.targetGender} • {service.targetAgeGroup}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${service.isEnabled ? "bg-[#EEF5F1] text-[#5F8D6D]" : "bg-red-50 text-red-600"}`}>
                            {service.isEnabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleOpenServiceModal(service)}
                              className="p-1.5 bg-white border border-black/10 hover:border-[#5F8D6D] hover:text-[#5F8D6D] rounded-lg transition-colors"
                              title="Edit service"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-1.5 bg-white border border-black/10 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === "offers" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Offers & Packages</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{offers.length} discount offers created</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenOfferModal()}
                  className="bg-[#5F8D6D] hover:bg-[#4a7057] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Offer
                </button>
                <button onClick={loadOffers} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280]" aria-label="Refresh offers">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {offersLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-44 rounded-3xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : offers.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No discount offers added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {offers.map((offer) => (
                  <div key={offer.id} className="bg-[#F7F5F2] border border-black/[0.04] rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-[#FAF0EC] text-[#C97C5D] text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide uppercase font-mono border border-[#C97C5D]/10">
                          {offer.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${offer.isEnabled ? "bg-[#EEF5F1] text-[#5F8D6D]" : "bg-red-50 text-red-600"}`}>
                          {offer.isEnabled ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-[#2B2B2B] mb-1">{offer.title}</h4>
                      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{offer.description}</p>
                      
                      <div className="bg-white rounded-2xl p-3 border border-black/[0.03] space-y-1 mb-4">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6B7280]">Discount:</span>
                          <span className="font-bold text-[#5F8D6D]">
                            {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% Off` : `₹${offer.discountValue} Off`}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#6B7280]">Applies To:</span>
                          <span className="font-medium text-[#2B2B2B]">{offer.category}</span>
                        </div>
                        {offer.validUntil && (
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#6B7280]">Expires:</span>
                            <span className="font-medium text-red-500">{new Date(offer.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-black/[0.04]">
                      <button
                        onClick={() => handleOpenOfferModal(offer)}
                        className="p-1.5 bg-white border border-black/10 hover:border-[#5F8D6D] hover:text-[#5F8D6D] rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold px-2.5"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-1.5 bg-white border border-black/10 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold px-2.5"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Stylist Create/Edit */}
        {stylistModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
              <div className="p-6 border-b border-black/[0.06] flex items-center justify-between bg-[#F7F5F2]">
                <h3 className="font-bold text-base text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {editingStylist ? "Edit Stylist" : "Add New Stylist"}
                </h3>
                <button onClick={() => setStylistModalOpen(false)} className="p-1 hover:bg-[#EEF5F1] rounded-lg transition-colors text-[#6B7280]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSaveStylist} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={stylistForm.name}
                    onChange={(e) => setStylistForm({ ...stylistForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Photo URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={stylistForm.photoUrl}
                    onChange={(e) => setStylistForm({ ...stylistForm, photoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Experience (e.g. 5 years)</label>
                    <input
                      type="text"
                      required
                      value={stylistForm.experience}
                      onChange={(e) => setStylistForm({ ...stylistForm, experience: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Working Hours</label>
                    <input
                      type="text"
                      required
                      value={stylistForm.workingHours}
                      onChange={(e) => setStylistForm({ ...stylistForm, workingHours: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Specialization</label>
                  <input
                    type="text"
                    required
                    placeholder="Hair Styling, Facials, Skincare..."
                    value={stylistForm.specialization}
                    onChange={(e) => setStylistForm({ ...stylistForm, specialization: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={stylistForm.isAvailable}
                    onChange={(e) => setStylistForm({ ...stylistForm, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-[#5F8D6D] border-black/10 rounded focus:ring-[#5F8D6D]"
                  />
                  <label htmlFor="isAvailable" className="text-xs font-semibold text-[#2B2B2B] select-none">Currently Available for Bookings</label>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setStylistModalOpen(false)}
                    className="px-4 py-2 border border-black/10 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5F8D6D] hover:bg-[#4a7057] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Service Create/Edit */}
        {serviceModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-lg my-8 overflow-hidden shadow-xl animate-fade-in-up">
              <div className="p-6 border-b border-black/[0.06] flex items-center justify-between bg-[#F7F5F2]">
                <h3 className="font-bold text-base text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {editingService ? "Edit Service Details" : "Add New Service Catalog Item"}
                </h3>
                <button onClick={() => setServiceModalOpen(false)} className="p-1 hover:bg-[#EEF5F1] rounded-lg transition-colors text-[#6B7280]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSaveService} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Service Name</label>
                    <input
                      type="text"
                      required
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Category</label>
                    <select
                      value={serviceForm.categoryId}
                      onChange={(e) => setServiceForm({ ...serviceForm, categoryId: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Description</label>
                  <textarea
                    required
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors min-h-[60px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Duration (minutes)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={serviceForm.durationMinutes}
                      onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Price (INR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Target Gender</label>
                    <select
                      value={serviceForm.targetGender}
                      onChange={(e) => setServiceForm({ ...serviceForm, targetGender: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    >
                      <option value="Unisex">Unisex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Target Age Group</label>
                    <select
                      value={serviceForm.targetAgeGroup}
                      onChange={(e) => setServiceForm({ ...serviceForm, targetAgeGroup: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    >
                      <option value="All">All Ages</option>
                      <option value="Adult">Adults Only</option>
                      <option value="Kids">Kids Only</option>
                      <option value="Senior">Senior Citizens</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={serviceForm.imageUrl}
                    onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Benefits (one per line)</label>
                  <textarea
                    placeholder="Premium products used&#10;Lasts up to 4 weeks&#10;Includes scalp massage"
                    value={serviceForm.benefitsText}
                    onChange={(e) => setServiceForm({ ...serviceForm, benefitsText: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors min-h-[80px]"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isEnabled"
                    checked={serviceForm.isEnabled}
                    onChange={(e) => setServiceForm({ ...serviceForm, isEnabled: e.target.checked })}
                    className="w-4 h-4 text-[#5F8D6D] border-black/10 rounded focus:ring-[#5F8D6D]"
                  />
                  <label htmlFor="isEnabled" className="text-xs font-semibold text-[#2B2B2B] select-none">Service is Active & Available for Booking</label>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="px-4 py-2 border border-black/10 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5F8D6D] hover:bg-[#4a7057] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Offer Create/Edit */}
        {offerModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-fade-in-up">
              <div className="p-6 border-b border-black/[0.06] flex items-center justify-between bg-[#F7F5F2]">
                <h3 className="font-bold text-base text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {editingOffer ? "Edit Coupon Offer" : "Create Promotional Offer"}
                </h3>
                <button onClick={() => setOfferModalOpen(false)} className="p-1 hover:bg-[#EEF5F1] rounded-lg transition-colors text-[#6B7280]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSaveOffer} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Offer Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Student Discount"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Promo Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. STUDENT20"
                      value={offerForm.code}
                      onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Description</label>
                  <textarea
                    required
                    placeholder="Get 20% off when you present your student badge..."
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full px-4 py-2 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors min-h-[60px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Discount Type</label>
                    <select
                      value={offerForm.discountType}
                      onChange={(e) => setOfferForm({ ...offerForm, discountType: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Discount Value</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={offerForm.discountValue}
                      onChange={(e) => setOfferForm({ ...offerForm, discountValue: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Badge/Tag Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Students"
                      value={offerForm.badge}
                      onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Applies to Category</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hair or All"
                      value={offerForm.category}
                      onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Valid Until (Optional)</label>
                    <input
                      type="date"
                      value={offerForm.validUntil}
                      onChange={(e) => setOfferForm({ ...offerForm, validUntil: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="offerEnabled"
                      checked={offerForm.isEnabled}
                      onChange={(e) => setOfferForm({ ...offerForm, isEnabled: e.target.checked })}
                      className="w-4 h-4 text-[#5F8D6D] border-black/10 rounded focus:ring-[#5F8D6D]"
                    />
                    <label htmlFor="offerEnabled" className="text-xs font-semibold text-[#2B2B2B] select-none">Offer is Active</label>
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setOfferModalOpen(false)}
                    className="px-4 py-2 border border-black/10 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5F8D6D] hover:bg-[#4a7057] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    Save Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
