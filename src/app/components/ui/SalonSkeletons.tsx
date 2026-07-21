"use client";

// Custom salon-specific skeleton loading components
// Note: uses the .skeleton CSS class from globals.css (shimmer animation)

interface SkeletonBlockProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full" | "2xl" | "3xl";
}

export function SkeletonBlock({ className = "", rounded = "lg" }: SkeletonBlockProps) {
  const roundedMap = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
  };
  return (
    <div
      className={`skeleton ${roundedMap[rounded]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
      <SkeletonBlock className="h-48 w-full" rounded="sm" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-5 w-16" />
        </div>
        <SkeletonBlock className="h-3.5 w-full" />
        <SkeletonBlock className="h-3.5 w-3/4" />
        <SkeletonBlock className="h-3.5 w-1/2" />
        <SkeletonBlock className="h-10 w-full mt-2" rounded="2xl" />
      </div>
    </div>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-3.5 w-full" />
      <SkeletonBlock className="h-3.5 w-full" />
      <SkeletonBlock className="h-3.5 w-2/3" />
      <div className="flex items-center gap-3 pt-2">
        <SkeletonBlock className="w-10 h-10 flex-shrink-0" rounded="full" />
        <div className="space-y-1.5 flex-1">
          <SkeletonBlock className="h-3.5 w-24" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-2">
      <SkeletonBlock className="h-3.5 w-28" />
      <SkeletonBlock className="h-9 w-20" rounded="lg" />
      <SkeletonBlock className="h-3 w-24" />
    </div>
  );
}

export function StylistCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border-2 border-black/[0.08] space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-12 h-12 flex-shrink-0" rounded="full" />
        <div className="space-y-1.5 flex-1">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </div>
      <SkeletonBlock className="h-3.5 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-black/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <SkeletonBlock className="h-4 w-24" />
        </td>
      ))}
    </tr>
  );
}
