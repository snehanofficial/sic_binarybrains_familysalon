"use client";

import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t border-[#F0EDE9]">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "SalonSense is typing..." : "Ask your AI stylist anything..."}
        disabled={disabled}
        className="flex-1 bg-[#F7F5F2] border border-black/[0.06] text-[#2B2B2B] text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#5F8D6D] focus:ring-1 focus:ring-[#5F8D6D] disabled:opacity-60 transition-all font-medium"
        style={{ fontFamily: "Inter, sans-serif" }}
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="w-10 h-10 rounded-xl bg-[#5F8D6D] hover:bg-[#4a7057] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-[#5F8D6D] cursor-pointer flex-shrink-0"
      >
        <SendHorizonal className="w-4 h-4" />
      </button>
    </div>
  );
}
