"use client";

import BookingPage from "../../components/booking/BookingPage";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId") || undefined;

  return (
    <BookingPage
      navigate={(p) => {
        if (p === "home") router.push("/");
        else router.push(`/${p}`);
      }}
      preSelectedServiceId={serviceId}
    />
  );
}

export default function BookingRoute() {
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
      <BookingContent />
    </Suspense>
  );
}
