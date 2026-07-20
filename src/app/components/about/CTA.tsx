"use client";

import { ArrowRight, Scissors } from "lucide-react";

interface CTAProps {
  onBookClick: () => void;
}

export default function CTA({ onBookClick }: CTAProps) {
  return (
    <section className="py-24 bg-[#45533F] text-white px-6 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A8BFA3]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A96A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/5">
          <Scissors className="w-8 h-8 text-[#C9A96A]" />
        </div>
        
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 font-poppins leading-tight"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Elevate Your Family&apos;s<br />
          Grooming Standards
        </h2>
        
        <p 
          className="text-[#D8E6D2]/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-inter"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Book an appointment today with Bangalore&apos;s most trusted stylists. Seamless digital scheduling. Clinic-grade sanitization. Transparent pricing.
        </p>

        <button 
          onClick={onBookClick}
          className="bg-[#C9A96A] hover:bg-[#b59556] text-[#45533F] hover:text-white px-10 py-4 rounded-2xl text-sm font-semibold transition-all hover:shadow-xl hover:shadow-[#C9A96A]/20 inline-flex items-center gap-2.5 cursor-pointer font-inter"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Book Appointment Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
