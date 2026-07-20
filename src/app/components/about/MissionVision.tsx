"use client";

import { Award, Compass } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="py-24 bg-[#F8F5EF] px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-[#D8E6D2]/40 rounded-3xl p-8 border border-[#A8BFA3]/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#45533F] rounded-2xl flex items-center justify-center mb-6">
              <Compass className="w-6 h-6 text-[#C9A96A]" />
            </div>
            <h3 
              className="text-2xl font-bold text-[#45533F] mb-4 font-poppins"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Mission
            </h3>
            <p 
              className="text-[#45533F]/80 text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              To offer a premier sanctuary for multi-generational styling where premium products, precise certified craftsmanship, and clinical-grade sterilization converge to deliver confidence, convenience, and comfort for every member of the family.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#ECE3D4]/50 rounded-3xl p-8 border border-[#ECE3D4] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#45533F] rounded-2xl flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-[#C9A96A]" />
            </div>
            <h3 
              className="text-2xl font-bold text-[#45533F] mb-4 font-poppins"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our Vision
            </h3>
            <p 
              className="text-[#45533F]/80 text-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              To establish Binary Brains as the absolute gold standard in family-centric grooming, pioneering intelligent digital integrations, premium organic care mapping, and clinical hygiene standards that set new benchmarks across the global salon industry.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
