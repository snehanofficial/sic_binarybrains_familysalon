"use client";

import { useState } from "react";
import { Sparkles, MessageCircleCode } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle SalonSense AI Stylist"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-110 cursor-pointer ${
          isOpen
            ? "bg-[#C97C5D] text-white rotate-90"
            : "bg-[#5F8D6D] text-white hover:bg-[#4a7057]"
        }`}
      >
        {isOpen ? (
          <Sparkles className="w-6 h-6 animate-pulse" />
        ) : (
          <MessageCircleCode className="w-6 h-6" />
        )}
      </button>

      {/* Conditionally Render ChatWindow */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
