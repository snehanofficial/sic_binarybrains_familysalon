"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminDashboard from "../../components/admin/AdminDashboard";

export default function AdminRoute() {
  const { user, isInitialized, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.push("/");
      } else if (!hasPermission("reports:view")) {
        router.push("/");
      }
    }
  }, [user, isInitialized, hasPermission, router]);

  if (!isInitialized || !user || !hasPermission("reports:view")) {
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#5F8D6D] flex items-center justify-center animate-pulse">
            <span className="text-white text-lg">✂</span>
          </div>
          <p className="text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>Verifying Authorization…</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}
