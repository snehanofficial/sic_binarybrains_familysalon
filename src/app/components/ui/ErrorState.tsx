"use client";

import { RefreshCw, WifiOff } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please check your connection and try again.",
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <WifiOff className="w-7 h-7 text-red-400" />
      </div>
      <h3
        className="text-lg font-semibold text-[#2B2B2B] mb-2"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="text-sm text-[#6B7280] max-w-xs leading-relaxed"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 flex items-center gap-2 border border-[#5F8D6D] text-[#5F8D6D] px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF5F1] transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </button>
      )}
    </div>
  );
}
