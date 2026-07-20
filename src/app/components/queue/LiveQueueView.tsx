"use client";

import { useQueue } from "../../../context/QueueContext";
import { Clock, Users, Scissors, Sparkles, CheckCircle2, UserCheck } from "lucide-react";

export default function LiveQueueView() {
  const { queueEntries, totalWaiting, currentlyServingCount, availableStylistsCount, averageWaitMinutes } = useQueue();

  const currentlyServing = queueEntries.filter((q) => q.status === "IN_SERVICE");
  const waitingList = queueEntries.filter((q) => q.status === "WAITING");

  return (
    <div className="pt-24 min-h-screen bg-[#F7F5F2] pb-16" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-[#EEF5F1] text-[#5F8D6D] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Live Salon Stream
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                Live Queue & Waiting Board
              </h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Real-time queue synchronization combining online appointments & walk-ins.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#EEF5F1] p-4 rounded-2xl border border-[#5F8D6D]/20">
              <Clock className="w-8 h-8 text-[#5F8D6D] animate-pulse" />
              <div>
                <div className="text-xs text-[#6B7280]">Est. Average Wait</div>
                <div className="text-xl font-bold text-[#5F8D6D]" style={{ fontFamily: "Poppins, sans-serif" }}>
                  ~{averageWaitMinutes} Minutes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] text-[#C97C5D] flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{totalWaiting}</div>
            <div className="text-xs text-[#6B7280]">Customers Waiting</div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5F1] text-[#5F8D6D] flex items-center justify-center mx-auto mb-2">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{currentlyServingCount}</div>
            <div className="text-xs text-[#6B7280]">Currently Serving</div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#FEF9EC] text-[#D97706] flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{availableStylistsCount}</div>
            <div className="text-xs text-[#6B7280]">Available Chairs</div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 text-center">
            <div className="w-10 h-10 rounded-xl bg-[#EEF5F1] text-[#5F8D6D] flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>100%</div>
            <div className="text-xs text-[#6B7280]">Sterilized Stations</div>
          </div>
        </div>

        {/* Serving Now Section */}
        <div className="mb-10" aria-live="polite">
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-4 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            <span className="w-3 h-3 rounded-full bg-[#5F8D6D] animate-ping inline-block" />
            Currently Being Served
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyServing.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[#5F8D6D]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#5F8D6D] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Chair Active
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#EEF5F1] text-[#5F8D6D] font-bold flex items-center justify-center">
                    {item.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B2B2B] text-base" style={{ fontFamily: "Poppins, sans-serif" }}>{item.customerName}</h3>
                    <span className="text-xs text-[#6B7280]">{item.entryType === "WALK_IN" ? "Walk-In Customer" : "Online Booking"}</span>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-[#6B7280]">
                  <div><span className="font-medium text-[#2B2B2B]">Services:</span> {item.serviceNames.join(", ")}</div>
                  <div><span className="font-medium text-[#2B2B2B]">Assigned Stylist:</span> {item.stylistName || "Senior Stylist"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Waiting Queue Timeline */}
        <div aria-live="polite">
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            Next in Queue ({waitingList.length})
          </h2>

          {waitingList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-[#6B7280] shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-[#5F8D6D] mx-auto mb-2" />
              <p className="font-medium text-base text-[#2B2B2B]">No Waiting Customers!</p>
              <p className="text-xs mt-1">Chairs are available immediately for walk-ins.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingList.map((item, idx) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] text-[#C97C5D] font-bold flex items-center justify-center text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#2B2B2B] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{item.customerName}</h4>
                      <p className="text-xs text-[#6B7280]">{item.serviceNames.join(" • ")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#EEF5F1] text-[#5F8D6D]">
                      {item.entryType}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-[#6B7280]">Est. Wait</div>
                      <div className="text-sm font-bold text-[#C97C5D]" style={{ fontFamily: "Poppins, sans-serif" }}>
                        ~{item.calculatedWaitMinutes || (idx + 1) * 15} mins
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
