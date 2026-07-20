"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";

const certificates = [
  { title: "Clinical Hygiene Excellence", authority: "KSPCB Clean Standards", year: "2025" },
  { title: "Best Family Salon Bangalore", authority: "TimeOut Awards", year: "2024" },
  { title: "Certified Organic Styling", authority: "L'Oréal Professionnel Partner", year: "2025" },
  { title: "Outstanding Senior Care Services", authority: "Senior Citizen Forum Kar.", year: "2024" },
];

export default function Awards() {
  return (
    <section className="py-24 bg-[#F8F5EF] px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Accent Details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#A8BFA3] text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "Inter, sans-serif" }}>
              Recognitions
            </span>
            <h2 
              className="text-3xl sm:text-4xl font-bold text-[#45533F] font-poppins leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Certified Excellence<br />
              & Industry Accolades
            </h2>
            <p 
              className="text-[#45533F]/80 text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              We prioritize customer safety and service depth. Our sanitization methodologies and styling practices have been honored with multiple state-level and brand awards.
            </p>
            <div className="flex items-center gap-3 p-4 bg-[#D8E6D2]/35 border border-[#A8BFA3]/20 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-[#C9A96A] flex-shrink-0" />
              <span className="text-xs text-[#45533F] font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                100% Autoclave sterilized tools & clinical hygiene compliance.
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {certificates.map((cert, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl p-6 border border-[#ECE3D4] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="text-3xl mb-4 text-[#C9A96A] font-bold">✦</div>
                <div>
                  <h3 
                    className="font-bold text-[#45533F] text-base mb-1 font-poppins"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {cert.title}
                  </h3>
                  <div className="text-[11px] text-[#45533F]/65 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
                    {cert.authority}
                  </div>
                </div>
                <div className="border-t border-[#ECE3D4] mt-4 pt-3 flex items-center justify-between text-[10px] font-bold text-[#C9A96A]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span>ANNUAL COMPLIANCE</span>
                  <span>{cert.year}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
