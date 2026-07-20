"use client";

import { useState, useEffect } from "react";
import { Scissors, Menu, X, Phone, MessageCircle, Crown, MapPin, Mail, Clock } from "lucide-react";
import Hero from "../components/about/Hero";
import Story from "../components/about/Story";
import MissionVision from "../components/about/MissionVision";
import Team from "../components/about/Team";
import Timeline from "../components/about/Timeline";
import WhyChooseUs from "../components/about/WhyChooseUs";
import Awards from "../components/about/Awards";
import CTA from "../components/about/CTA";
import FloatingChatButton from "../components/chatbot/FloatingChatButton";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToHomeSPA = (pageParam?: string) => {
    if (pageParam) {
      window.location.href = `/?page=${pageParam}`;
    } else {
      window.location.href = "/";
    }
  };

  const navLinks = [
    { label: "Home", action: () => navigateToHomeSPA("home") },
    { label: "Services", action: () => navigateToHomeSPA("services") },
    { label: "Gallery", action: () => navigateToHomeSPA("gallery") },
    { label: "Book Appointment", action: () => navigateToHomeSPA("booking") },
    { label: "About", active: true, action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
  ];

  return (
    <div className="bg-[#F8F5EF] min-h-screen text-[#45533F]">
      
      {/* ── NAVBAR ────────────────────────────────────────────────────────────── */}
      <nav 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-[#F8F5EF]/95 backdrop-blur-md shadow-sm border-b border-[#ECE3D4]" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => navigateToHomeSPA()} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-[#45533F] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[#45533F]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Binary<span className="text-[#C9A96A]">Brains</span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  link.active 
                    ? "text-[#C9A96A] border-b-2 border-[#C9A96A] pb-0.5" 
                    : "text-[#45533F] hover:text-[#C9A96A]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Quick Contacts & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-1.5 text-sm text-[#45533F]/70 hover:text-[#45533F] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Phone className="w-4 h-4" /> Call
            </a>
            <button 
              onClick={() => navigateToHomeSPA("booking")}
              className="bg-[#C9A96A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#b59556] transition-colors cursor-pointer"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Book Now
            </button>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden p-2 rounded-xl hover:bg-[#ECE3D4]/40 transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6 text-[#45533F]" /> : <Menu className="w-6 h-6 text-[#45533F]" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#F8F5EF] border-t border-[#ECE3D4] px-6 py-4 space-y-3 shadow-md">
            {navLinks.map((link) => (
              <button 
                key={link.label} 
                onClick={() => { link.action(); setMobileOpen(false); }} 
                className={`block w-full text-left text-sm font-medium py-2 transition-colors ${
                  link.active ? "text-[#C9A96A]" : "text-[#45533F] hover:text-[#C9A96A]"
                }`} 
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {link.label}
              </button>
            ))}
            <button 
              onClick={() => { navigateToHomeSPA("booking"); setMobileOpen(false); }} 
              className="w-full bg-[#C9A96A] text-white py-3 rounded-xl text-sm font-semibold mt-2 cursor-pointer" 
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Book Now
            </button>
          </div>
        )}
      </nav>

      {/* ── SECTIONS ──────────────────────────────────────────────────────────── */}
      <Hero 
        onBookClick={() => navigateToHomeSPA("booking")} 
        onExploreClick={() => {
          document.getElementById("story-section")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <Story sectionId="story-section" />
      <MissionVision />
      <Team />
      <Timeline />
      <WhyChooseUs />
      <Awards />
      <CTA onBookClick={() => navigateToHomeSPA("booking")} />

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#2B2B2B] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Salon Details */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[#5F8D6D] flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Binary<span className="text-[#5F8D6D]">Brains</span>
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                Your family&apos;s trusted grooming destination. Professional, hygienic, and welcoming — since 2009.
              </p>
            </div>

            {/* Navigation links */}
            <div className="md:col-span-3">
              <h4 className="font-semibold text-sm mb-5 text-white/80" style={{ fontFamily: "Poppins, sans-serif" }}>
                Navigation
              </h4>
              <div className="space-y-3">
                <button onClick={() => navigateToHomeSPA("home")} className="block text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>Home</button>
                <button onClick={() => navigateToHomeSPA("services")} className="block text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>Services</button>
                <button onClick={() => navigateToHomeSPA("gallery")} className="block text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>Gallery</button>
                <button onClick={() => navigateToHomeSPA("booking")} className="block text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>Book Appointment</button>
                <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="block text-sm text-white/50 hover:text-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>About</button>
              </div>
            </div>

            {/* Location & Hours */}
            <div className="md:col-span-4">
              <h4 className="font-semibold text-sm mb-5 text-white/80" style={{ fontFamily: "Poppins, sans-serif" }}>
                Contact
              </h4>
              <div className="space-y-3 text-sm text-white/50" style={{ fontFamily: "Inter, sans-serif" }}>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/30" />
                  <span>42, 1st Cross, Koramangala 4th Block, Bangalore — 560034</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 flex-shrink-0 text-white/30" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 flex-shrink-0 text-white/30" />
                  <span>hello@binarybrains.in</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 flex-shrink-0 text-white/30" />
                  <span>Mon–Sat: 9AM–8PM · Sun: 10AM–6PM</span>
                </div>
              </div>
            </div>

          </div>

          {/* Copyrights */}
          <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>© 2026 Binary Brains. All rights reserved.</p>
            <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Made with care in Bangalore ✦</p>
          </div>
        </div>
      </footer>

      {/* ── CHATBOT ───────────────────────────────────────────────────────────── */}
      <FloatingChatButton />

    </div>
  );
}
