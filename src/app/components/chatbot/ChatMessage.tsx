"use client";

import { Message } from "../../../types/chatbot";
import { Sparkles, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Parse custom highlights or line breaks in AI response to make it look premium
  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold rendering for simple markdown **bold**
      let formattedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add bolded text
        parts.push(
          <strong key={match.index} className="font-bold text-[#45533F]">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={i} className={i > 0 ? "mt-2" : ""}>
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 max-w-[85%] ${isUser ? "self-end ml-auto flex-row-reverse" : "self-start mr-auto"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isUser ? "bg-[#C97C5D]" : "bg-[#5F8D6D]"}`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Sparkles className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble Container */}
      <div className="flex flex-col gap-1">
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-[#5F8D6D] text-white rounded-tr-sm"
              : "bg-white text-[#2B2B2B] rounded-tl-sm border border-black/[0.05]"
          }`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {formatContent(message.content)}
        </div>
        
        {/* Timestamp */}
        <span className={`text-[10px] text-[#9CA3AF] px-1 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
