"use client";

import { Crown } from "lucide-react";

const teamMembers = [
  {
    name: "Preethi K",
    role: "Senior Master Stylist",
    exp: "8 Years",
    spec: "Hair Colouring & Bridal Styling",
    desc: "Renowned for custom balayage mapping and precision cuts that bring out natural elegance.",
    avatar: "photo-1494790108377-be9c29b29330",
  },
  {
    name: "Arjun M",
    role: "Grooming & Fade Specialist",
    exp: "6 Years",
    spec: "Classic Beard Design & Precision Fades",
    desc: "Crafts tailored beard profiles and classic scissor-cuts with attention to line work.",
    avatar: "photo-1500648767791-00dcc994a43e",
  },
  {
    name: "Sneha R",
    role: "Lead Skincare Specialist",
    exp: "5 Years",
    spec: "Advanced Facial Therapy & Cleanups",
    desc: "Certified skincare mapping expert offering organic therapies tailored for skin types.",
    avatar: "photo-1438761681033-6461ffad8d80",
  },
  {
    name: "Karthik S",
    role: "Beard Artist & Hair Consultant",
    exp: "7 Years",
    spec: "Precision Shaving & Hair Treatments",
    desc: "Specializes in scalp treatments, hot towel shaving rituals, and custom styling consults.",
    avatar: "photo-1499996860823-5214fcc65f8f",
  },
];

export default function Team() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#A8BFA3] text-xs font-bold uppercase tracking-[0.25em]" style={{ fontFamily: "Inter, sans-serif" }}>
            Artistry & Talent
          </span>
          <h2 
            className="text-3xl sm:text-4xl font-bold text-[#45533F] mt-3 font-poppins"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Meet Our Master Experts
          </h2>
          <p 
            className="text-[#45533F]/70 text-sm max-w-lg mx-auto mt-4"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Our certified stylists bring 5+ years of family grooming expertise and carry advanced style mappings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <div 
              key={i} 
              className="bg-[#F8F5EF] rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-[#ECE3D4] hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Photo Area */}
              <div className="h-64 bg-[#ECE3D4]/50 overflow-hidden relative">
                <img 
                  src={`https://images.unsplash.com/${member.avatar}?w=400&h=320&fit=crop&auto=format`} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5 text-[#C9A96A]" />
                  <span className="text-[10px] text-[#45533F] font-bold uppercase tracking-wider" style={{ fontFamily: "Inter, sans-serif" }}>
                    {member.exp}
                  </span>
                </div>
              </div>

              {/* Text Area */}
              <div className="p-6">
                <h3 
                  className="font-bold text-[#45533F] text-lg font-poppins"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {member.name}
                </h3>
                <div 
                  className="text-xs text-[#C9A96A] font-semibold tracking-wide mt-0.5 mb-3"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {member.role}
                </div>
                
                <div className="border-t border-[#ECE3D4] pt-3 mt-3">
                  <div className="text-[11px] text-[#45533F]/50 font-bold uppercase tracking-wider mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                    Specialization
                  </div>
                  <div className="text-xs text-[#45533F]/90 font-medium leading-relaxed mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                    {member.spec}
                  </div>
                  <p className="text-xs text-[#45533F]/75 leading-relaxed italic" style={{ fontFamily: "Inter, sans-serif" }}>
                    &quot;{member.desc}&quot;
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
