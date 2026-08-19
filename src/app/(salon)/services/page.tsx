"use client";

import ServicesPage from "../../components/services/ServicesPage";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type ServiceCategory = "hair" | "skin" | "grooming" | "bridal" | "kids" | "senior";

function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = (searchParams.get("category") || "hair") as ServiceCategory;

  return (
    <ServicesPage
      goToBooking={(serviceId) => {
        if (serviceId) {
          router.push(`/booking?serviceId=${serviceId}`);
        } else {
          router.push("/booking");
        }
      }}
      initialCategory={category}
    />
  );
}

export default function ServicesRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#5F8D6D] flex items-center justify-center animate-pulse">
            <span className="text-white text-lg">✂</span>
          </div>
          <p className="text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>Loading…</p>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
