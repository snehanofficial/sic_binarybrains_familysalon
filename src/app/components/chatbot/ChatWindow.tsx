"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message } from "../../../types/chatbot";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import TypingIndicator from "./TypingIndicator";

interface ChatWindowProps {
  onClose: () => void;
}

const GREETING_MESSAGE: Message = {
  id: "greeting",
  role: "assistant",
  content: "Hello! Welcome to **Binary Brains Family Salon**. 💇✨\n\nI'm **SalonSense AI**, your personal AI stylist. I can help recommend haircuts, beard shapes, hair coloring highlights, or skincare routines. What styling are you interested in today?",
  timestamp: new Date().toISOString(),
};

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([GREETING_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build the message history context (slice to keep context compact and under limit)
      const contextMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: contextMessages }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      
      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.reply || "I apologize, but I could not formulate a recommendation at this moment. Please feel free to book a direct appointment with one of our certified stylists!",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: "Oops! I ran into a minor connection glitch. Please check your network or select 'Book Appointment' to consult with our stylists in person.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] bg-[#F7F5F2] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-black/[0.08] transition-all duration-300 transform scale-100 origin-bottom-right">
      {/* Header */}
      <ChatHeader onClose={onClose} />

      {/* Messages Logs */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="self-start mr-auto flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-xl bg-[#5F8D6D] flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            </div>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips (only show when not loading to keep it clean) */}
      {!isLoading && (
        <SuggestedQuestions onSelectQuestion={handleSendMessage} />
      )}

      {/* Input controller */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
