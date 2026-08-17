"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, Users, Calendar, Scissors, Tag, Sliders, ShieldAlert,
  Search, RefreshCw, Loader2, AlertCircle, Plus, Trash2, Edit, Check, X,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  fetchAdminMetrics, fetchCustomers, updateCustomerStatus,
  fetchAdminSettings, fetchAuditLogs,
  fetchServices, fetchCategories, fetchStylists, fetchOffers,
  createService, updateService, deleteService,
  createStylist, updateStylist, deleteStylist,
  createOffer, updateOffer, deleteOffer,
} from "../../../lib/apiServices";
import type { AdminMetrics, Customer, Service, Stylist, Offer, Category } from "../../../lib/apiServices";
import { KPICardSkeleton, TableRowSkeleton } from "../ui/SalonSkeletons";
import { ErrorState } from "../ui/ErrorState";
import { showToast } from "../../../lib/toast";

type Tab = "overview" | "customers" | "stylists" | "services" | "offers" | "settings" | "audit";

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function AdminDashboard() {
  const { user, hasPermission } = useAuth();
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

  // Services state
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Stylists state
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [stylistsLoading, setStylistsLoading] = useState(false);
  const [stylistsError, setStylistsError] = useState(false);

  // Offers state
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [offersError, setOffersError] = useState(false);

  // Service form states
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [serviceEditId, setServiceEditId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceCategoryId, setServiceCategoryId] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceGender, setServiceGender] = useState("Unisex");
  const [serviceAgeGroup, setServiceAgeGroup] = useState("All");
  const [serviceImageUrl, setServiceImageUrl] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceBenefits, setServiceBenefits] = useState("");
  const [serviceEnabled, setServiceEnabled] = useState(true);

  // Stylist form states
  const [stylistFormOpen, setStylistFormOpen] = useState(false);
  const [stylistEditId, setStylistEditId] = useState<string | null>(null);
  const [stylistName, setStylistName] = useState("");
  const [stylistPhotoUrl, setStylistPhotoUrl] = useState("");
  const [stylistExperience, setStylistExperience] = useState("");
  const [stylistSpecialization, setStylistSpecialization] = useState("");
  const [stylistWorkingHours, setStylistWorkingHours] = useState("9:00 AM - 8:00 PM");
  const [stylistAvailable, setStylistAvailable] = useState(true);

  // Offer form states
  const [offerFormOpen, setOfferFormOpen] = useState(false);
  const [offerEditId, setOfferEditId] = useState<string | null>(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerCode, setOfferCode] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [offerDiscountType, setOfferDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
  const [offerDiscountValue, setOfferDiscountValue] = useState("");
  const [offerBadge, setOfferBadge] = useState("");
  const [offerCategory, setOfferCategory] = useState("");
  const [offerEnabled, setOfferEnabled] = useState(true);

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

  const loadServices = useCallback(async () => {
    setServicesLoading(true);
    setServicesError(false);
    const res = await fetchServices({ all: true });
    if (res.success && res.data) {
      setServices(res.data);
    } else {
      setServicesError(true);
    }
    setServicesLoading(false);
  }, []);

  const loadCategories = useCallback(async () => {
    const res = await fetchCategories();
    if (res.success && res.data) {
      setCategories(res.data);
    }
  }, []);

  const loadStylists = useCallback(async () => {
    setStylistsLoading(true);
    setStylistsError(false);
    const res = await fetchStylists();
    if (res.success && res.data) {
      setStylists(res.data);
    } else {
      setStylistsError(true);
    }
    setStylistsLoading(false);
  }, []);

  const loadOffers = useCallback(async () => {
    setOffersLoading(true);
    setOffersError(false);
    const res = await fetchOffers();
    if (res.success && res.data) {
      setOffers(res.data);
    } else {
      setOffersError(true);
    }
    setOffersLoading(false);
  }, []);

  // Initial load based on active tab
  useEffect(() => {
    if (!user || !hasPermission("reports:view")) return;
    if (activeTab === "overview") loadMetrics();
    if (activeTab === "customers") loadCustomers();
    if (activeTab === "settings") loadSettings();
    if (activeTab === "audit") loadAuditLogs();
    if (activeTab === "services") {
      loadServices();
      loadCategories();
    }
    if (activeTab === "stylists") loadStylists();
    if (activeTab === "offers") loadOffers();
  }, [activeTab, user, hasPermission]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Service handlers
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !serviceCategoryId || !servicePrice || !serviceDuration) {
      showToast.error("Validation error", "Please fill in all required fields.");
      return;
    }

    const payload = {
      name: serviceName,
      categoryId: serviceCategoryId,
      price: parseFloat(servicePrice),
      durationMinutes: parseInt(serviceDuration),
      targetGender: serviceGender,
      targetAgeGroup: serviceAgeGroup,
      imageUrl: serviceImageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=480&h=220&fit=crop",
      benefits: serviceBenefits.split(",").map(b => b.trim()).filter(b => b.length > 0),
      description: serviceDescription,
      isEnabled: serviceEnabled,
    };

    let res;
    if (serviceEditId) {
      res = await updateService(serviceEditId, payload);
    } else {
      res = await createService(payload);
    }

    if (res.success) {
      showToast.success(
        serviceEditId ? "Service updated" : "Service created",
        `${serviceName} has been saved successfully.`
      );
      setServiceFormOpen(false);
      resetServiceForm();
      loadServices();
    } else {
      showToast.error("Action failed", res.error?.message || "Could not save service.");
    }
  };

  const handleServiceEdit = (svc: Service) => {
    setServiceEditId(svc.id);
    setServiceName(svc.name);
    setServiceCategoryId(svc.category?.id || "");
    setServicePrice(String(svc.price));
    setServiceDuration(String(svc.durationMinutes));
    setServiceGender(svc.targetGender);
    setServiceAgeGroup(svc.targetAgeGroup);
    setServiceImageUrl(svc.imageUrl);
    setServiceDescription(svc.description);
    setServiceBenefits(svc.benefits.join(", "));
    setServiceEnabled(svc.isEnabled);
    setServiceFormOpen(true);
  };

  const handleServiceToggleActive = async (svc: Service) => {
    const res = await updateService(svc.id, { isEnabled: !svc.isEnabled });
    if (res.success) {
      showToast.success(
        !svc.isEnabled ? "Service activated" : "Service deactivated",
        `Catalog availability updated for ${svc.name}.`
      );
      loadServices();
    } else {
      showToast.error("Toggle failed", res.error?.message || "Could not update service status.");
    }
  };

  const handleServiceDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate ${name}?`)) return;
    const res = await deleteService(id);
    if (res.success) {
      showToast.success("Service deactivated", "This service has been soft-deleted.");
      loadServices();
    } else {
      showToast.error("Deactivation failed", res.error?.message || "Could not deactivate service.");
    }
  };

  const resetServiceForm = () => {
    setServiceEditId(null);
    setServiceName("");
    setServiceCategoryId("");
    setServicePrice("");
    setServiceDuration("");
    setServiceGender("Unisex");
    setServiceAgeGroup("All");
    setServiceImageUrl("");
    setServiceDescription("");
    setServiceBenefits("");
    setServiceEnabled(true);
  };

  // Stylist handlers
  const handleStylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stylistName.trim() || !stylistExperience || !stylistSpecialization) {
      showToast.error("Validation error", "Please fill in all required fields.");
      return;
    }

    const payload = {
      name: stylistName,
      photoUrl: stylistPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      experience: stylistExperience,
      specialization: stylistSpecialization,
      workingHours: stylistWorkingHours,
      isAvailable: stylistAvailable,
    };

    let res;
    if (stylistEditId) {
      res = await updateStylist(stylistEditId, payload);
    } else {
      res = await createStylist(payload);
    }

    if (res.success) {
      showToast.success(
        stylistEditId ? "Stylist updated" : "Stylist registered",
        `${stylistName} has been saved successfully.`
      );
      setStylistFormOpen(false);
      resetStylistForm();
      loadStylists();
    } else {
      showToast.error("Action failed", res.error?.message || "Could not save stylist.");
    }
  };

  const handleStylistEdit = (sty: Stylist) => {
    setStylistEditId(sty.id);
    setStylistName(sty.name);
    setStylistPhotoUrl(sty.photoUrl);
    setStylistExperience(sty.experience);
    setStylistSpecialization(sty.specialization);
    setStylistWorkingHours(sty.workingHours);
    setStylistAvailable(sty.isAvailable);
    setStylistFormOpen(true);
  };

  const handleStylistToggleAvailability = async (sty: Stylist) => {
    const res = await updateStylist(sty.id, { isAvailable: !sty.isAvailable });
    if (res.success) {
      showToast.success(
        !sty.isAvailable ? "Stylist available" : "Stylist unavailable",
        `Availability updated for ${sty.name}.`
      );
      loadStylists();
    } else {
      showToast.error("Toggle failed", res.error?.message || "Could not update availability.");
    }
  };

  const handleStylistDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    const res = await deleteStylist(id);
    if (res.success) {
      showToast.success("Stylist removed", res.data?.message || "Stylist status updated.");
      loadStylists();
    } else {
      showToast.error("Removal failed", res.error?.message || "Could not remove stylist.");
    }
  };

  const resetStylistForm = () => {
    setStylistEditId(null);
    setStylistName("");
    setStylistPhotoUrl("");
    setStylistExperience("");
    setStylistSpecialization("");
    setStylistWorkingHours("9:00 AM - 8:00 PM");
    setStylistAvailable(true);
  };

  // Offer handlers
  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim() || !offerCode.trim() || !offerDiscountValue) {
      showToast.error("Validation error", "Please fill in all required fields.");
      return;
    }

    const payload = {
      title: offerTitle,
      code: offerCode.toUpperCase().trim(),
      description: offerDescription,
      discountType: offerDiscountType,
      discountValue: parseFloat(offerDiscountValue),
      badge: offerBadge,
      category: offerCategory,
      isEnabled: offerEnabled,
    };

    let res;
    if (offerEditId) {
      res = await updateOffer(offerEditId, payload);
    } else {
      res = await createOffer(payload);
    }

    if (res.success) {
      showToast.success(
        offerEditId ? "Offer updated" : "Offer created",
        `${offerTitle} has been saved successfully.`
      );
      setOfferFormOpen(false);
      resetOfferForm();
      loadOffers();
    } else {
      showToast.error("Action failed", res.error?.message || "Could not save offer.");
    }
  };

  const handleOfferEdit = (off: Offer) => {
    setOfferEditId(off.id);
    setOfferTitle(off.title);
    setOfferCode(off.code);
    setOfferDescription(off.description);
    setOfferDiscountType(off.discountType);
    setOfferDiscountValue(String(off.discountValue));
    setOfferBadge(off.badge);
    setOfferCategory(off.category);
    setOfferEnabled(off.isEnabled);
    setOfferFormOpen(true);
  };

  const handleOfferToggleActive = async (off: Offer) => {
    const res = await updateOffer(off.id, { isEnabled: !off.isEnabled });
    if (res.success) {
      showToast.success(
        !off.isEnabled ? "Offer activated" : "Offer deactivated",
        `Offer ${off.code} status updated.`
      );
      loadOffers();
    } else {
      showToast.error("Toggle failed", res.error?.message || "Could not update offer status.");
    }
  };

  const handleOfferDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete offer ${code}?`)) return;
    const res = await deleteOffer(id);
    if (res.success) {
      showToast.success("Offer deleted", "Discount offer removed successfully.");
      loadOffers();
    } else {
      showToast.error("Deletion failed", res.error?.message || "Could not delete offer.");
    }
  };

  const resetOfferForm = () => {
    setOfferEditId(null);
    setOfferTitle("");
    setOfferCode("");
    setOfferDescription("");
    setOfferDiscountType("PERCENTAGE");
    setOfferDiscountValue("");
    setOfferBadge("");
    setOfferCategory("");
    setOfferEnabled(true);
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

  // Auth / Role protection render block
  if (!user || !hasPermission("reports:view")) {
    return (
      <div className="pt-24 min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-black/5 max-w-md mx-6">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" aria-hidden="true" />
          <h3 className="text-xl font-bold text-[#2B2B2B] mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            Access Denied
          </h3>
          <p className="text-sm text-[#6B7280]">
            You do not have the required permissions to access the Admin Control Centre. Please log in with admin credentials.
          </p>
        </div>
      </div>
    );
  }

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

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Service Catalog</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{services.length} total services</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { resetServiceForm(); setServiceFormOpen(true); }}
                  className="bg-[#5F8D6D] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#4E7659] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Service
                </button>
                <button onClick={loadServices} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280] hover:text-[#5F8D6D]" aria-label="Refresh services list">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {servicesLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)}</tbody>
                </table>
              </div>
            ) : servicesError ? (
              <ErrorState onRetry={loadServices} />
            ) : services.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No services found in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label="Service list">
                  <thead>
                    <tr className="border-b border-black/5 text-[#6B7280]">
                      <th className="pb-3 font-semibold">Service Name</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Price</th>
                      <th className="pb-3 font-semibold">Duration</th>
                      <th className="pb-3 font-semibold">Gender/Age</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {services.map((svc) => (
                      <tr key={svc.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={svc.imageUrl}
                              alt={svc.name}
                              className="w-10 h-10 rounded-xl object-cover border border-black/5"
                            />
                            <div>
                              <div className="font-semibold text-[#2B2B2B]">{svc.name}</div>
                              <div className="text-[10px] text-[#6B7280] max-w-[200px] truncate">{svc.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-[#6B7280] font-medium">{svc.category?.name || "Uncategorized"}</td>
                        <td className="py-4 font-bold text-[#C97C5D]">{formatCurrency(svc.price)}</td>
                        <td className="py-4 text-[#6B7280]">{svc.durationMinutes} mins</td>
                        <td className="py-4 text-[#6B7280]">{svc.targetGender} / {svc.targetAgeGroup}</td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              svc.isEnabled ? "bg-[#EEF5F1] text-[#5F8D6D]" : "bg-red-50 text-red-600"
                            }`}
                          >
                            {svc.isEnabled ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleServiceToggleActive(svc)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                svc.isEnabled
                                  ? "border-red-200 text-red-600 hover:bg-red-50"
                                  : "border-[#5F8D6D]/30 text-[#5F8D6D] hover:bg-[#EEF5F1]"
                              }`}
                              title={svc.isEnabled ? "Deactivate" : "Activate"}
                            >
                              {svc.isEnabled ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleServiceEdit(svc)}
                              className="p-1.5 rounded-lg border border-black/10 text-[#6B7280] hover:bg-[#F7F5F2] transition-colors"
                              title="Edit Properties"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleServiceDelete(svc.id, svc.name)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                              title="Deactivate / Soft-Delete"
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
                  onClick={() => { resetStylistForm(); setStylistFormOpen(true); }}
                  className="bg-[#5F8D6D] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#4E7659] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Stylist
                </button>
                <button onClick={loadStylists} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280] hover:text-[#5F8D6D]" aria-label="Refresh stylist list">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {stylistsLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>{Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
                </table>
              </div>
            ) : stylistsError ? (
              <ErrorState onRetry={loadStylists} />
            ) : stylists.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No stylists registered in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label="Stylist roster">
                  <thead>
                    <tr className="border-b border-black/5 text-[#6B7280]">
                      <th className="pb-3 font-semibold">Stylist</th>
                      <th className="pb-3 font-semibold">Specialization</th>
                      <th className="pb-3 font-semibold">Experience</th>
                      <th className="pb-3 font-semibold">Rating</th>
                      <th className="pb-3 font-semibold">Availability</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {stylists.map((sty) => (
                      <tr key={sty.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={sty.photoUrl}
                              alt={sty.name}
                              className="w-10 h-10 rounded-full object-cover border border-black/5"
                            />
                            <div className="font-semibold text-[#2B2B2B]">{sty.name}</div>
                          </div>
                        </td>
                        <td className="py-4 text-[#6B7280]">{sty.specialization}</td>
                        <td className="py-4 text-[#6B7280]">{sty.experience}</td>
                        <td className="py-4 text-[#5F8D6D] font-bold">★ {sty.rating.toFixed(1)}</td>
                        <td className="py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                              sty.isAvailable ? "bg-[#EEF5F1] text-[#5F8D6D] hover:bg-[#d9ede3]" : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                            onClick={() => handleStylistToggleAvailability(sty)}
                            title="Click to toggle availability status"
                          >
                            {sty.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleStylistEdit(sty)}
                              className="p-1.5 rounded-lg border border-black/10 text-[#6B7280] hover:bg-[#F7F5F2] transition-colors"
                              title="Edit Stylist"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStylistDelete(sty.id, sty.name)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Stylist"
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
                <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>Offers & Discounts</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">{offers.length} active coupons</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { resetOfferForm(); setOfferFormOpen(true); }}
                  className="bg-[#5F8D6D] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#4E7659] transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Offer
                </button>
                <button onClick={loadOffers} className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors text-[#6B7280] hover:text-[#5F8D6D]" aria-label="Refresh offers list">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {offersLoading ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>{Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
                </table>
              </div>
            ) : offersError ? (
              <ErrorState onRetry={loadOffers} />
            ) : offers.length === 0 ? (
              <p className="text-center text-sm text-[#6B7280] py-10">No discount offers found in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" aria-label="Offers list">
                  <thead>
                    <tr className="border-b border-black/5 text-[#6B7280]">
                      <th className="pb-3 font-semibold">Offer Title</th>
                      <th className="pb-3 font-semibold">Promo Code</th>
                      <th className="pb-3 font-semibold">Discount</th>
                      <th className="pb-3 font-semibold">Badge</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {offers.map((off) => (
                      <tr key={off.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-4">
                          <div>
                            <div className="font-semibold text-[#2B2B2B]">{off.title}</div>
                            <div className="text-[10px] text-[#6B7280] max-w-[200px] truncate">{off.description}</div>
                          </div>
                        </td>
                        <td className="py-4">
                          <code className="text-xs font-mono font-bold text-[#5F8D6D] bg-[#EEF5F1] px-2 py-0.5 rounded-lg border border-[#5F8D6D]/15">
                            {off.code}
                          </code>
                        </td>
                        <td className="py-4 font-bold text-[#C97C5D]">
                          {off.discountType === "PERCENTAGE"
                            ? `${off.discountValue}% OFF`
                            : `₹${off.discountValue} OFF`}
                        </td>
                        <td className="py-4">
                          <span className="px-2 py-0.5 bg-[#FAF0EC] text-[#C97C5D] rounded-lg font-semibold text-[10px]">
                            {off.badge}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              off.isEnabled ? "bg-[#EEF5F1] text-[#5F8D6D]" : "bg-red-50 text-red-600"
                            }`}
                          >
                            {off.isEnabled ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleOfferToggleActive(off)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                off.isEnabled
                                  ? "border-red-200 text-red-600 hover:bg-red-50"
                                  : "border-[#5F8D6D]/30 text-[#5F8D6D] hover:bg-[#EEF5F1]"
                              }`}
                              title={off.isEnabled ? "Deactivate" : "Activate"}
                            >
                              {off.isEnabled ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleOfferEdit(off)}
                              className="p-1.5 rounded-lg border border-black/10 text-[#6B7280] hover:bg-[#F7F5F2] transition-colors"
                              title="Edit Offer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOfferDelete(off.id, off.code)}
                              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete Offer"
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
      </div>

      {/* Services CRUD Modal Form */}
      {serviceFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative border border-black/5 overflow-y-auto max-h-[85vh]">
            <button
              onClick={() => { setServiceFormOpen(false); resetServiceForm(); }}
              className="absolute top-6 right-6 p-2 rounded-full text-[#6B7280] hover:bg-[#EEF5F1] hover:text-[#2B2B2B] transition-colors"
              aria-label="Close form modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#2B2B2B] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              {serviceEditId ? "Modify Salon Service" : "Add Salon Service"}
            </h3>
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Service Name *</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Hair Spa Treatment"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Category *</label>
                  <select
                    required
                    value={serviceCategoryId}
                    onChange={(e) => setServiceCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    placeholder="499"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Duration (mins) *</label>
                  <input
                    type="number"
                    required
                    min="5"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    placeholder="45"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Gender *</label>
                  <select
                    value={serviceGender}
                    onChange={(e) => setServiceGender(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Age Group *</label>
                  <select
                    value={serviceAgeGroup}
                    onChange={(e) => setServiceAgeGroup(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  >
                    <option value="All">All</option>
                    <option value="Adult">Adult</option>
                    <option value="Kids">Kids</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Image URL</label>
                <input
                  type="text"
                  value={serviceImageUrl}
                  onChange={(e) => setServiceImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Unsplash ID"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Description</label>
                <textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Provide a detailed description of the service..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Benefits (comma-separated)</label>
                <input
                  type="text"
                  value={serviceBenefits}
                  onChange={(e) => setServiceBenefits(e.target.value)}
                  placeholder="Hydrating treatment, Damage repair, Head massage"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="srv-enabled"
                  type="checkbox"
                  checked={serviceEnabled}
                  onChange={(e) => setServiceEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#5F8D6D]"
                />
                <label htmlFor="srv-enabled" className="text-xs font-semibold text-[#2B2B2B] select-none cursor-pointer">
                  Enable and show in client catalog
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => { setServiceFormOpen(false); resetServiceForm(); }}
                  className="w-1/2 border border-black/10 text-[#6B7280] font-semibold py-2.5 rounded-xl text-xs hover:bg-[#F7F5F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#5F8D6D] text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-[#4E7659] transition-colors"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stylists CRUD Modal Form */}
      {stylistFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-black/5">
            <button
              onClick={() => { setStylistFormOpen(false); resetStylistForm(); }}
              className="absolute top-6 right-6 p-2 rounded-full text-[#6B7280] hover:bg-[#EEF5F1] hover:text-[#2B2B2B] transition-colors"
              aria-label="Close stylist form modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#2B2B2B] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              {stylistEditId ? "Modify Stylist Profile" : "Register Salon Stylist"}
            </h3>
            <form onSubmit={handleStylistSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={stylistName}
                  onChange={(e) => setStylistName(e.target.value)}
                  placeholder="Karan Malhotra"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Experience *</label>
                  <input
                    type="text"
                    required
                    value={stylistExperience}
                    onChange={(e) => setStylistExperience(e.target.value)}
                    placeholder="7 years"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={stylistSpecialization}
                    onChange={(e) => setStylistSpecialization(e.target.value)}
                    placeholder="Beard & Haircuts"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Photo URL</label>
                <input
                  type="text"
                  value={stylistPhotoUrl}
                  onChange={(e) => setStylistPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Working Hours</label>
                <input
                  type="text"
                  value={stylistWorkingHours}
                  onChange={(e) => setStylistWorkingHours(e.target.value)}
                  placeholder="9:00 AM - 8:00 PM"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="sty-available"
                  type="checkbox"
                  checked={stylistAvailable}
                  onChange={(e) => setStylistAvailable(e.target.checked)}
                  className="w-4 h-4 accent-[#5F8D6D]"
                />
                <label htmlFor="sty-available" className="text-xs font-semibold text-[#2B2B2B] select-none cursor-pointer">
                  Mark as Available for Bookings
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => { setStylistFormOpen(false); resetStylistForm(); }}
                  className="w-1/2 border border-black/10 text-[#6B7280] font-semibold py-2.5 rounded-xl text-xs hover:bg-[#F7F5F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#5F8D6D] text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-[#4E7659] transition-colors"
                >
                  Save Stylist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offers CRUD Modal Form */}
      {offerFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-black/5">
            <button
              onClick={() => { setOfferFormOpen(false); resetOfferForm(); }}
              className="absolute top-6 right-6 p-2 rounded-full text-[#6B7280] hover:bg-[#EEF5F1] hover:text-[#2B2B2B] transition-colors"
              aria-label="Close offer form modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-[#2B2B2B] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              {offerEditId ? "Modify Coupon Offer" : "Create Coupon Offer"}
            </h3>
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Offer Title *</label>
                  <input
                    type="text"
                    required
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="Monsoon Glow Offer"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Promo Code *</label>
                  <input
                    type="text"
                    required
                    value={offerCode}
                    onChange={(e) => setOfferCode(e.target.value)}
                    placeholder="GLOW20"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Description *</label>
                <textarea
                  required
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  placeholder="Get flat 20% off on all facials above ₹500..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Discount Type *</label>
                  <select
                    value={offerDiscountType}
                    onChange={(e) => setOfferDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={offerDiscountValue}
                    onChange={(e) => setOfferDiscountValue(e.target.value)}
                    placeholder={offerDiscountType === "PERCENTAGE" ? "20" : "150"}
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Badge Text</label>
                  <input
                    type="text"
                    value={offerBadge}
                    onChange={(e) => setOfferBadge(e.target.value)}
                    placeholder="Monsoon"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5">Category Group</label>
                  <input
                    type="text"
                    value={offerCategory}
                    onChange={(e) => setOfferCategory(e.target.value)}
                    placeholder="Skin"
                    className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  id="off-enabled"
                  type="checkbox"
                  checked={offerEnabled}
                  onChange={(e) => setOfferEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#5F8D6D]"
                />
                <label htmlFor="off-enabled" className="text-xs font-semibold text-[#2B2B2B] select-none cursor-pointer">
                  Activate this promo code immediately
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => { setOfferFormOpen(false); resetOfferForm(); }}
                  className="w-1/2 border border-black/10 text-[#6B7280] font-semibold py-2.5 rounded-xl text-xs hover:bg-[#F7F5F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#5F8D6D] text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-[#4E7659] transition-colors"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

