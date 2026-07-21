"use client";

import { Scissors, MapPin, Phone, Mail, Clock } from "lucide-react";

type Page = "home" | "services" | "gallery" | "booking" | "queue" | "stylist" | "admin";

interface FooterProps {
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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-[#2B2B2B] text-white py-14" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <button
              onClick={() => navigate("home")}
              className="flex items-center gap-2.5 mb-4"
              aria-label="Go to homepage"
            >
              <div className="w-8 h-8 rounded-xl bg-[#5F8D6D] flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                Binary<span className="text-[#5F8D6D]">Brains</span>
              </span>
            </button>
            <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Your family&apos;s trusted grooming destination. Professional, hygienic, and welcoming — since 2009.
            </p>
            <div className="flex gap-2.5">
              {[InstagramIcon, FacebookIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#5F8D6D] transition-colors"
                  aria-label={i === 0 ? "Instagram" : "Facebook"}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="font-semibold text-sm mb-4 text-white/80" style={{ fontFamily: "Poppins, sans-serif" }}>
              Navigation
            </h4>
            <nav className="space-y-2.5" aria-label="Footer navigation">
              {(["home", "services", "gallery", "booking", "queue"] as Page[]).map((p) => (
                <button
                  key={p}
                  onClick={() => navigate(p)}
                  className="block text-sm text-white/50 hover:text-white transition-colors capitalize text-left"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {p === "queue" ? "Live Queue" : p === "booking" ? "Book Appointment" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="font-semibold text-sm mb-4 text-white/80" style={{ fontFamily: "Poppins, sans-serif" }}>
              Contact
            </h4>
            <address className="space-y-2.5 not-italic" style={{ fontFamily: "Inter, sans-serif" }}>
              <div className="flex items-start gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/30" aria-hidden="true" />
                <span>42, 1st Cross, Koramangala 4th Block, Bangalore — 560034</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Phone className="w-4 h-4 flex-shrink-0 text-white/30" aria-hidden="true" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Mail className="w-4 h-4 flex-shrink-0 text-white/30" aria-hidden="true" />
                <a href="mailto:hello@binarybrains.in" className="hover:text-white transition-colors">hello@binarybrains.in</a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Clock className="w-4 h-4 flex-shrink-0 text-white/30" aria-hidden="true" />
                <span>Mon–Sat: 9AM–8PM · Sun: 10AM–6PM</span>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            © 2026 Binary Brains. All rights reserved.
          </p>
          <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            Made with care in Bangalore ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
