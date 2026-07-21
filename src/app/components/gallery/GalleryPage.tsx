"use client";

import { useState, memo } from "react";

type Page = "home" | "services" | "gallery" | "booking" | "queue" | "stylist" | "admin";
type GalleryTab = "interior" | "team" | "transformations";

interface GalleryPageProps {
  goToBooking: () => void;
  navigate: (p: Page) => void;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const galleryInterior = [
  { id: "photo-1560066984-138dadb4c035", h: 300, label: "Main Styling Area" },
  { id: "photo-1582095133179-bfd08e2fb6b7", h: 350, label: "Reception & Waiting Lounge" },
  { id: "photo-1521590832167-7bcbfaa6381f", h: 280, label: "Premium Chair Setup" },
  { id: "photo-1522337360788-8b13dee7a37e", h: 320, label: "Hair Wash Station" },
  { id: "photo-1534161308652-fdfcf10f62c4", h: 260, label: "Skin Care Room" },
  { id: "photo-1595476108010-b4d1f102b1b1", h: 310, label: "Kids Corner" },
  { id: "photo-1615397349754-cfa2066a298e", h: 290, label: "Nail Bar" },
  { id: "photo-1580618672591-eb180b1a973f", h: 340, label: "Hygiene Station" },
  { id: "photo-1629904853893-c2c8981a1dc5", h: 270, label: "Bridal Suite" },
];

const galleryTeam = [
  { id: "photo-1494790108377-be9c29b29330", name: "Priya Verma", role: "Senior Stylist", spec: "Hair Colouring & Bridal" },
  { id: "photo-1500648767791-00dcc994a43e", name: "Arjun Nair", role: "Lead Barber", spec: "Beard Design & Grooming" },
  { id: "photo-1438761681033-6461ffad8d80", name: "Meena Reddy", role: "Skin Specialist", spec: "Advanced Facials & Cleanup" },
  { id: "photo-1507003211169-0a1dd7228f2d", name: "Ravi Kumar", role: "Style Expert", spec: "Men's Hair & Styling" },
];

const galleryTransformations = [
  { label: "Hair Colour Transformation", before: "photo-1567894340315-735d7c361db0", after: "photo-1492106087820-71f1a00d2b11" },
  { label: "Men's Style Makeover", before: "photo-1585747860715-2ba37e788b70", after: "photo-1503951914875-452162b0f3f1" },
  { label: "Bridal Look", before: "photo-1560869713-da86bd3b8c49", after: "photo-1519741497674-611481863552" },
];

function GalleryPage({ goToBooking, navigate }: GalleryPageProps) {
  const [galleryTab, setGalleryTab] = useState<GalleryTab>("interior");

  return (
    <div className="pt-20 min-h-screen bg-[#F7F5F2] page-transition">
      {/* Header */}
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
          <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Gallery</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-2 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>See for Yourself</h1>
          <p className="text-[#6B7280] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Visual proof of our hygiene, skill, and welcoming environment.</p>
          <div className="flex gap-1" role="tablist" aria-label="Gallery categories">
            {(["interior", "team", "transformations"] as GalleryTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setGalleryTab(tab)}
                role="tab"
                aria-selected={galleryTab === tab}
                aria-controls={`gallery-${tab}`}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-all rounded-t-xl ${
                  galleryTab === tab
                    ? "border-[#5F8D6D] text-[#5F8D6D] bg-[#EEF5F1]"
                    : "border-transparent text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#F7F5F2]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {tab === "interior" ? "Salon Interior" : tab === "team" ? "Our Team" : "Transformations"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Interior Masonry Grid */}
        {galleryTab === "interior" && (
          <div id="gallery-interior" role="tabpanel" className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {galleryInterior.map((img, i) => (
              <div key={i} className="break-inside-avoid group relative overflow-hidden rounded-3xl bg-[#D8C4B6]/30 cursor-pointer">
                <img
                  src={`https://images.unsplash.com/${img.id}?w=500&h=${img.h}&fit=crop&auto=format`}
                  alt={img.label}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5" aria-hidden="true">
                  <span className="text-white text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Grid */}
        {galleryTab === "team" && (
          <div id="gallery-team" role="tabpanel" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryTeam.map((member, i) => (
              <article key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-72 bg-[#D8C4B6]/30">
                  <img
                    src={`https://images.unsplash.com/${member.id}?w=400&h=320&fit=crop&auto=format`}
                    alt={`${member.name} — ${member.role}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="font-bold text-[#2B2B2B] mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{member.name}</div>
                  <div className="text-xs text-[#6B7280] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>{member.role}</div>
                  <div className="inline-block bg-[#EEF5F1] text-[#5F8D6D] text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: "Inter, sans-serif" }}>{member.spec}</div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Transformations */}
        {galleryTab === "transformations" && (
          <div id="gallery-transformations" role="tabpanel" className="space-y-6">
            {galleryTransformations.map((trans, i) => (
              <article key={i} className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-[#2B2B2B] text-lg mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>{trans.label}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden bg-[#D8C4B6]/30">
                    <img
                      src={`https://images.unsplash.com/${trans.before}?w=500&h=320&fit=crop&auto=format`}
                      alt="Before"
                      className="w-full h-52 object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 text-[#2B2B2B] text-xs font-bold px-3 py-1 rounded-full">Before</span>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden bg-[#D8C4B6]/30">
                    <img
                      src={`https://images.unsplash.com/${trans.after}?w=500&h=320&fit=crop&auto=format`}
                      alt="After"
                      className="w-full h-52 object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-[#5F8D6D] text-white text-xs font-bold px-3 py-1 rounded-full">After</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Instagram CTA */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-[#5F8D6D] to-[#4a7057] rounded-3xl p-10 text-center text-white">
          <InstagramIcon className="w-10 h-10 mx-auto mb-4 opacity-75" />
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Follow Us on Instagram</h3>
          <p className="text-white/70 mb-6 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>@binarybrainssalon — Daily transformations, tips, and offers</p>
          <a
            href="https://instagram.com"
            className="inline-block bg-white text-[#5F8D6D] px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm"
            style={{ fontFamily: "Inter, sans-serif" }}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Binary Brains on Instagram"
          >
            Follow @binarybrainssalon
          </a>
        </div>
      </div>
    </div>
  );
}

export default memo(GalleryPage);
