"use client";

import { useState } from "react";
import { useQueue } from "../../../context/QueueContext";
import { Scissors, UserPlus, Play, CheckCircle, SkipForward, Power, Clock, UserCheck } from "lucide-react";

export default function StylistWorkspace() {
  const { queueEntries, updateQueueStatus, registerWalkIn } = useQueue();
  const [isAvailable, setIsAvailable] = useState(true);

  // Walk-in form state
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInService, setWalkInService] = useState("Hair Cut");

  const activeCustomer = queueEntries.find((q) => q.status === "IN_SERVICE");
  const waitingCustomers = queueEntries.filter((q) => q.status === "WAITING");

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName) return;
    await registerWalkIn({
      customerName: walkInName,
      customerPhone: walkInPhone,
      serviceNames: [walkInService],
    });
    setWalkInName("");
    setWalkInPhone("");
    setShowWalkInModal(false);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#F7F5F2] pb-16" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Stylist Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5F1] text-[#5F8D6D] flex items-center justify-center font-bold text-lg">
              SK
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Stylist Dashboard Workspace
              </h1>
              <p className="text-xs text-[#6B7280]">Assigned Appointments & Live Chair Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors ${
                isAvailable ? "bg-[#EEF5F1] text-[#5F8D6D] border border-[#5F8D6D]/30" : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              <Power className="w-4 h-4" />
              {isAvailable ? "Status: Available" : "Status: On Break"}
            </button>

            <button
              onClick={() => setShowWalkInModal(true)}
              className="bg-[#C97C5D] text-white px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-[#b86b4c] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" /> Register Walk-In
            </button>
          </div>
        </div>

        {/* Active Serving Card */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#2B2B2B] mb-4 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            <Scissors className="w-5 h-5 text-[#5F8D6D]" /> Active Customer in Chair
          </h2>

          {activeCustomer ? (
            <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-[#5F8D6D]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="bg-[#EEF5F1] text-[#5F8D6D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    In Service Now
                  </span>
                  <h3 className="text-2xl font-bold text-[#2B2B2B] mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {activeCustomer.customerName}
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Services: <span className="font-semibold text-[#2B2B2B]">{activeCustomer.serviceNames.join(", ")}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQueueStatus(activeCustomer.id, "COMPLETED")}
                    className="bg-[#5F8D6D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#4a7057] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <CheckCircle className="w-5 h-5" /> Mark Completed
                  </button>

                  <button
                    onClick={() => updateQueueStatus(activeCustomer.id, "SKIPPED")}
                    className="bg-gray-100 text-[#6B7280] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                  >
                    <SkipForward className="w-4 h-4" /> Skip
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm text-center text-[#6B7280] border border-black/5">
              <UserCheck className="w-12 h-12 text-[#5F8D6D] mx-auto mb-2" />
              <p className="font-semibold text-[#2B2B2B]">Chair Available</p>
              <p className="text-xs mt-1">Call the next waiting customer when ready.</p>
            </div>
          )}
        </div>

        {/* Waiting Queue List */}
        <div>
          <h2 className="text-lg font-bold text-[#2B2B2B] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Assigned Queue ({waitingCustomers.length})
          </h2>

          <div className="space-y-3">
            {waitingCustomers.map((c, idx) => (
              <div key={c.id} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF0EC] text-[#C97C5D] font-bold flex items-center justify-center text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2B2B2B] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{c.customerName}</h4>
                    <p className="text-xs text-[#6B7280]">{c.serviceNames.join(" • ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQueueStatus(c.id, "IN_SERVICE")}
                    className="bg-[#5F8D6D] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#4a7057] transition-colors flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Call Next
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Walk-in Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-black/5">
            <h3 className="text-xl font-bold text-[#2B2B2B] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
              Register Walk-In Customer
            </h3>
            <form onSubmit={handleWalkInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Service</label>
                <select
                  value={walkInService}
                  onChange={(e) => setWalkInService(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm"
                >
                  <option value="Hair Cut">Hair Cut (45 min)</option>
                  <option value="Beard Styling">Beard Styling (30 min)</option>
                  <option value="Classic Facial">Classic Facial (60 min)</option>
                  <option value="Grooming Package">Grooming Package (90 min)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="w-1/2 py-2.5 border border-black/10 rounded-xl text-xs font-semibold text-[#6B7280]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-[#C97C5D] text-white rounded-xl text-xs font-semibold hover:bg-[#b86b4c]"
                >
                  Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
