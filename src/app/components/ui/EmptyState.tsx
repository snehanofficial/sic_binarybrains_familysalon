"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  emoji?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, emoji, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {emoji ? (
        <div className="text-5xl mb-4" aria-hidden="true">{emoji}</div>
      ) : icon ? (
        <div className="w-16 h-16 rounded-2xl bg-[#EEF5F1] flex items-center justify-center mx-auto mb-4 text-[#5F8D6D]">
          {icon}
        </div>
      ) : null}
      <h3
        className="text-lg font-semibold text-[#2B2B2B] mb-2"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm text-[#6B7280] max-w-xs leading-relaxed"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 bg-[#5F8D6D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a7057] transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
