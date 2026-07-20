"use client";

import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onBookClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onBookClick, onExploreClick }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-[#F8F5EF] overflow-hidden pt-20 px-6">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#D8E6D2] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ECE3D4] rounded-full blur-3xl opacity-65 pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Luxury Badge */}
        <div className="inline-flex items-center gap-2 bg-[#D8E6D2]/60 text-[#45533F] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] mb-8 animate-fade-in" style={{ fontFamily: "Inter, sans-serif" }}>
          <Sparkles className="w-3.5 h-3.5 text-[#C9A96A]" />
          A Legacy of Luxury Styling
        </div>

        {/* Title */}
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#45533F] leading-[1.1] mb-8 font-poppins"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Redefining Family Grooming<br />
          <span className="text-[#C9A96A] italic font-normal">With Precision Artistry</span>
        </h1>

        {/* Description */}
        <p 
          className="text-base sm:text-lg md:text-xl text-[#45533F]/80 max-w-2xl mx-auto leading-relaxed mb-10"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Step into a curated sanctuary where certified professionals deliver high-grade hygiene, bespoke styling treatments, and calm aesthetics tailored for every generation of your family.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onBookClick}
            className="w-full sm:w-auto bg-[#45533F] hover:bg-[#343f30] text-white px-8 py-4 rounded-2xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-[#45533F]/25 flex items-center justify-center gap-2 cursor-pointer"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book Appointment <ArrowRight className="w-4 h-4 text-[#C9A96A]" />
          </button>
          
          <button 
            onClick={onExploreClick}
            className="w-full sm:w-auto bg-white hover:bg-[#ECE3D4]/40 text-[#45533F] border border-[#45533F]/20 px-8 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Read Our Story
          </button>
        </div>
      </div>
    </section>
  );
}
