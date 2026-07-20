"use client";

import { X, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#5F8D6D] text-white border-b border-[#4a7057]">
      <div className="flex items-center gap-3">
        {/* Sparkles Icon Wrapper */}
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        
        {/* Text Details */}
        <div>
          <div className="font-bold text-sm leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
            SalonSense AI
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[10px] text-white/80 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
              Active Now · AI Stylist
            </span>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close Chat"
        className="p-1.5 rounded-xl hover:bg-white/10 text-white/95 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
