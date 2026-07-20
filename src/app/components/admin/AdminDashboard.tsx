"use client";

import { useState } from "react";
import {
  TrendingUp, Users, Calendar, Scissors, Tag, Sliders, ShieldAlert,
  Search, Check, X, Ban, RefreshCw, Plus, Edit, Trash2
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "customers" | "stylists" | "services" | "offers" | "settings" | "audit">("overview");

  // Mock Admin Data
  const metrics = {
    revenue: "₹48,250",
    bookingsCount: 24,
    waitingCount: 3,
    chairsAvailable: 4,
    peakHours: "2:00 PM - 5:00 PM",
  };

  const customersList = [
    { id: "c1", name: "Priya Sharma", email: "priya@example.com", phone: "+91 98765 11111", bookings: 8, status: "ACTIVE" },
    { id: "c2", name: "Rahul Mehta", email: "rahul@example.com", phone: "+91 98765 22222", bookings: 4, status: "ACTIVE" },
    { id: "c3", name: "Ananya Krishnan", email: "ananya@example.com", phone: "+91 98765 33333", bookings: 12, status: "ACTIVE" },
    { id: "c4", name: "Vikram Nair", email: "vikram@example.com", phone: "+91 98765 44444", bookings: 2, status: "DISABLED" },
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#F7F5F2] pb-16" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Dashboard Title & Tabs Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <span className="bg-[#FAF0EC] text-[#C97C5D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Enterprise Operating Platform
              </span>
              <h1 className="text-3xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Salon Operations & Admin Control
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-[#EEF5F1] text-[#5F8D6D] px-4 py-2 rounded-2xl text-xs font-semibold">
              <TrendingUp className="w-4 h-4" /> Live Revenue Tracker Active
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto border-b border-black/5 pb-2">
            {[
              { id: "overview", label: "Overview Metrics", icon: TrendingUp },
              { id: "customers", label: "Customers", icon: Users },
              { id: "stylists", label: "Stylists & Schedules", icon: Calendar },
              { id: "services", label: "Service Catalog", icon: Scissors },
              { id: "offers", label: "Offers & Packages", icon: Tag },
              { id: "settings", label: "Business Settings", icon: Sliders },
              { id: "audit", label: "Audit Logs", icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active ? "bg-[#5F8D6D] text-white shadow-sm" : "bg-[#F7F5F2] text-[#6B7280] hover:text-[#2B2B2B]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                <div className="text-xs text-[#6B7280] font-medium mb-1">Today&apos;s Revenue</div>
                <div className="text-3xl font-bold text-[#5F8D6D]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {metrics.revenue}
                </div>
                <div className="text-[11px] text-[#5F8D6D] mt-2 font-medium">↑ +14% vs yesterday</div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                <div className="text-xs text-[#6B7280] font-medium mb-1">Total Bookings Today</div>
                <div className="text-3xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {metrics.bookingsCount}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-2">18 Completed • 6 Confirmed</div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                <div className="text-xs text-[#6B7280] font-medium mb-1">Customers Waiting</div>
                <div className="text-3xl font-bold text-[#C97C5D]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {metrics.waitingCount}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-2">Avg wait ~15 mins</div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5">
                <div className="text-xs text-[#6B7280] font-medium mb-1">Peak Operating Hours</div>
                <div className="text-xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {metrics.peakHours}
                </div>
                <div className="text-[11px] text-[#5F8D6D] font-medium mt-1">4 Chairs Fully Occupied</div>
              </div>
            </div>

            {/* Popular Services Table */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
              <h3 className="text-lg font-bold text-[#2B2B2B] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                Top Performing Services Today
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Hair Cut & Styling", count: 14, revenue: "₹4,186" },
                  { name: "Classic Facial", count: 8, revenue: "₹6,392" },
                  { name: "Beard Styling", count: 11, revenue: "₹2,189" },
                  { name: "Bridal HD Makeup", count: 2, revenue: "₹17,998" },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#F7F5F2] rounded-2xl text-xs">
                    <div className="font-semibold text-[#2B2B2B] text-sm">{s.name}</div>
                    <div className="flex items-center gap-6">
                      <span className="text-[#6B7280]">{s.count} bookings</span>
                      <span className="font-bold text-[#5F8D6D]">{s.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customers Management */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Customer Database Management
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-9 pr-4 py-2 bg-[#F7F5F2] border border-black/10 rounded-xl text-xs w-64 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
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
                  {customersList.map((c) => (
                    <tr key={c.id}>
                      <td className="py-4 font-semibold text-[#2B2B2B]">{c.name}</td>
                      <td className="py-4 text-[#6B7280]">{c.email}</td>
                      <td className="py-4 text-[#6B7280]">{c.phone}</td>
                      <td className="py-4 font-bold text-[#5F8D6D]">{c.bookings} visits</td>
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
                          className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] ${
                            c.status === "ACTIVE"
                              ? "border border-red-200 text-red-600 hover:bg-red-50"
                              : "border border-[#5F8D6D] text-[#5F8D6D] hover:bg-[#EEF5F1]"
                          }`}
                        >
                          {c.status === "ACTIVE" ? "Disable" : "Restore"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs with clear feedback */}
        {["stylists", "services", "offers", "settings", "audit"].includes(activeTab) && (
          <div className="bg-white rounded-3xl p-12 text-center text-[#6B7280] shadow-sm border border-black/5">
            <Sliders className="w-12 h-12 text-[#5F8D6D] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#2B2B2B] capitalize" style={{ fontFamily: "Poppins, sans-serif" }}>
              {activeTab} Management Panel
            </h3>
            <p className="text-xs mt-1">Full control options connected to PostgreSQL backend API.</p>
          </div>
        )}
      </div>
    </div>
  );
}
