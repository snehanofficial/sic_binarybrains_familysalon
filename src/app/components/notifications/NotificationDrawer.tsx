"use client";

import { useNotifications } from "../../../context/NotificationContext";
import { X, Bell, CheckCircle2, Info, Tag } from "lucide-react";

export default function NotificationDrawer() {
  const { notifications, isDrawerOpen, toggleDrawer, markAllAsRead } = useNotifications();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between" style={{ fontFamily: "Inter, sans-serif" }}>
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-black/5 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#5F8D6D]" />
              <h3 className="font-bold text-lg text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
                In-App Notifications
              </h3>
            </div>
            <button onClick={toggleDrawer} className="p-1.5 rounded-full hover:bg-gray-100 text-[#6B7280]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#6B7280]">Recent updates & offers</span>
            <button onClick={markAllAsRead} className="text-xs text-[#5F8D6D] font-bold hover:underline">
              Mark all as read
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[75vh]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.read ? "bg-[#F7F5F2] border-black/5 opacity-75" : "bg-[#EEF5F1] border-[#5F8D6D]/30 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  {n.type === "SUCCESS" && <CheckCircle2 className="w-5 h-5 text-[#5F8D6D] shrink-0 mt-0.5" />}
                  {n.type === "OFFER" && <Tag className="w-5 h-5 text-[#C97C5D] shrink-0 mt-0.5" />}
                  {n.type === "INFO" && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}

                  <div>
                    <h4 className="font-semibold text-xs text-[#2B2B2B]">{n.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-1 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-[#6B7280] mt-2 block">{n.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={toggleDrawer}
          className="w-full bg-[#5F8D6D] text-white py-3 rounded-xl font-semibold text-xs hover:bg-[#4a7057]"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
