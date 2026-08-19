"use client";

import MyBookingsPage from "../../components/booking/MyBookingsPage";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function MyBookingsContent() {
  const router = useRouter();

  return (
    <MyBookingsPage
      navigate={(p) => {
        if (p === "home") router.push("/");
        else router.push(`/${p}`);
      }}
    />
  );
}

export default function MyBookingsRoute() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#5F8D6D] flex items-center justify-center animate-pulse">
            <span className="text-white text-lg">✂</span>
          </div>
          <p className="text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>Loading appointments…</p>
        </div>
      </div>
    }>
      <MyBookingsContent />
    </Suspense>
  );
}
