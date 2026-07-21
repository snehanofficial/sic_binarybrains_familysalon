"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, Users, Calendar, Scissors, Tag, Sliders, ShieldAlert,
  Search, RefreshCw, Loader2, AlertCircle,
} from "lucide-react";
import {
  fetchAdminMetrics, fetchCustomers, updateCustomerStatus,
  fetchAdminSettings, fetchAuditLogs,
} from "../../../lib/apiServices";
import type { AdminMetrics, Customer } from "../../../lib/apiServices";
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

  // Initial load based on active tab
  useEffect(() => {
    if (activeTab === "overview") loadMetrics();
    if (activeTab === "customers") loadCustomers();
    if (activeTab === "settings") loadSettings();
    if (activeTab === "audit") loadAuditLogs();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

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

        {/* Placeholder tabs with clear message */}
        {["stylists", "services", "offers"].includes(activeTab) && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-black/5">
            <Sliders className="w-12 h-12 text-[#5F8D6D] mx-auto mb-3" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[#2B2B2B] capitalize mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              {activeTab === "stylists" ? "Stylist Management" : activeTab === "services" ? "Service Catalog" : "Offers & Packages"}
            </h3>
            <p className="text-sm text-[#6B7280]">Full management panel — use the API directly or the Prisma Studio for now.</p>
            <a
              href="http://localhost:5555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-xs text-[#5F8D6D] hover:underline"
            >
              Open Prisma Studio →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
