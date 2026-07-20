"use client";

import { Award, ShieldCheck, Heart, Sparkles, Receipt } from "lucide-react";

const valueCards = [
  {
    icon: Award,
    title: "Certified Stylists",
    desc: "Our team undergoes ongoing training from top styling institutes, carrying 5+ years of family hair care mapping experience.",
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    desc: "We prioritize organic, botanical, and cruelty-free formulas that treat your hair and skin gently and naturally.",
  },
  {
    icon: Heart,
    title: "Family First Space",
    desc: "A thoughtfully zoned, tranquil layout designed to make every family member — from toddlers to seniors — feel completely at ease.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene First",
    desc: "Hospital-grade autoclaves sterilize all metal tools. We use strictly disposable sheets/towels for absolute safety.",
  },
  {
    icon: Receipt,
    title: "Transparent Pricing",
    desc: "Every service fee is displayed upfront. We enforce a strict zero-pushy-upsell policy so there are no surprises.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#A8BFA3] text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "Inter, sans-serif" }}>
            Our Cornerstones
          </span>
          <h2 
            className="text-3xl sm:text-4xl font-bold text-[#45533F] mt-3 font-poppins"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Why Families Choose Binary Brains
          </h2>
          <p 
            className="text-[#45533F]/70 text-sm max-w-md mx-auto mt-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            We structure our salon around comfort, top quality results, and complete client trust.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valueCards.map((card, i) => (
            <div 
              key={i} 
              className="bg-[#F8F5EF] rounded-3xl p-8 border border-[#ECE3D4] shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Icon container */}
              <div className="w-12 h-12 rounded-2xl bg-[#D8E6D2] group-hover:bg-[#45533F] text-[#45533F] group-hover:text-white flex items-center justify-center mb-6 transition-colors duration-300">
                <card.icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <h3 
                className="font-bold text-[#45533F] text-lg mb-3 font-poppins"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {card.title}
              </h3>

              {/* Desc */}
              <p 
                className="text-xs sm:text-sm text-[#45533F]/80 leading-relaxed font-inter"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
