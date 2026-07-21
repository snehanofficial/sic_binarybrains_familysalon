"use client";

import { useState, useEffect, useRef, memo } from "react";
import {
  Star, Shield, Award, Check, ArrowRight, Scissors,
  Sparkles, Heart, Baby, ChevronDown, ChevronRight,
  MessageCircle, Crown, User, Phone,
} from "lucide-react";
import { fetchReviews } from "../../../lib/apiServices";
import type { Review } from "../../../lib/apiServices";
import { ReviewCardSkeleton } from "../ui/SalonSkeletons";

type Page = "home" | "services" | "gallery" | "booking" | "queue";
type ServiceCategory = "hair" | "skin" | "grooming" | "bridal" | "kids" | "senior";

interface HomePageProps {
  navigate: (p: Page) => void;
  goToBooking: () => void;
  setActiveCategory: (c: ServiceCategory) => void;
}

const whyChooseUs = [
  { title: "Transparent Pricing", desc: "No hidden charges. Every service is priced upfront — what you see is what you pay.", icon: "💰" },
  { title: "Premium Hygiene", desc: "100% sterilized equipment, disposable towels, and hospital-grade sanitization after every client.", icon: "🧼" },
  { title: "Certified Professionals", desc: "Our stylists hold certifications and bring 5+ years of family grooming experience.", icon: "🎓" },
  { title: "Family Friendly", desc: "A calm, welcoming space designed for every family member — from toddlers to senior citizens.", icon: "👨‍👩‍👧‍👦" },
];

const featuredServices = [
  { name: "Hair", desc: "Cuts, colour, spa & styling for all hair types", icon: Scissors, image: "photo-1560066984-138dadb4c035", category: "hair" as ServiceCategory },
  { name: "Skin", desc: "Facials, cleanups & advanced skin treatments", icon: Sparkles, image: "photo-1570172619644-dfd03ed5d881", category: "skin" as ServiceCategory },
  { name: "Grooming", desc: "Beard styling, shaving & men's grooming packages", icon: User, image: "photo-1503951914875-452162b0f3f1", category: "grooming" as ServiceCategory },
  { name: "Bridal", desc: "Complete bridal packages for your most special day", icon: Crown, image: "photo-1519741497674-611481863552", category: "bridal" as ServiceCategory },
  { name: "Kids", desc: "Gentle cuts with child-safe products by trained stylists", icon: Baby, image: "photo-1560869713-da86bd3b8c49", category: "kids" as ServiceCategory },
  { name: "Senior Care", desc: "Priority service with extra comfort for senior citizens", icon: Heart, image: "photo-1573497701240-345a300b8d36", category: "senior" as ServiceCategory },
];

// Static fallback reviews shown when API has no data yet
const FALLBACK_REVIEWS: Review[] = [
  { id: "f1", customerName: "Priya Sharma", location: "Koramangala", rating: 5, comment: "Binary Brains is our family's go-to salon. The hygiene standards are exceptional and the stylists really listen. My kids actually look forward to haircuts now!", avatarUrl: "photo-1494790108377-be9c29b29330", isFeatured: true, createdAt: "" },
  { id: "f2", customerName: "Rahul Mehta", location: "HSR Layout", rating: 5, comment: "Transparent pricing and zero pushy upsells — exactly what I needed. My beard has never looked better. The ambience is genuinely calming.", avatarUrl: "photo-1500648767791-00dcc994a43e", isFeatured: true, createdAt: "" },
  { id: "f3", customerName: "Ananya Krishnan", location: "Indiranagar", rating: 5, comment: "Got my bridal package done here and I was blown away. The team was so patient and professional. Worth every rupee!", avatarUrl: "photo-1438761681033-6461ffad8d80", isFeatured: true, createdAt: "" },
  { id: "f4", customerName: "Vikram Nair", location: "Whitefield", rating: 5, comment: "As a senior citizen, I appreciate how comfortable and welcoming they made me feel. Priority seating and such gentle service. Highly recommend.", avatarUrl: "photo-1499996860823-5214fcc65f8f", isFeatured: true, createdAt: "" },
];

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const avatarSrc = review.avatarUrl?.startsWith("photo-")
    ? `https://images.unsplash.com/${review.avatarUrl}?w=80&h=80&fit=crop&auto=format`
    : review.avatarUrl || `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop`;

  return (
    <article className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <StarRow count={review.rating} />
      <p className="text-sm text-[#2B2B2B] leading-relaxed my-4 italic" style={{ fontFamily: "Inter, sans-serif" }}>
        &ldquo;{review.comment}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <img
          src={avatarSrc}
          alt={review.customerName}
          className="w-10 h-10 rounded-full object-cover bg-[#D8C4B6]"
          loading="lazy"
          width={40}
          height={40}
        />
        <div>
          <div className="font-semibold text-sm text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
            {review.customerName}
          </div>
          <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>
            {review.location}
          </div>
        </div>
      </div>
    </article>
  );
}

function HomePage({ navigate, goToBooking, setActiveCategory }: HomePageProps) {
  const [statsVisible, setStatsVisible] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);

  // Intersection observer for stats animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Fetch reviews from backend
  useEffect(() => {
    fetchReviews()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setReviews(res.data);
        } else {
          setReviews(FALLBACK_REVIEWS);
        }
      })
      .catch(() => setReviews(FALLBACK_REVIEWS))
      .finally(() => setReviewsLoading(false));
  }, []);

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero section">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&h=900&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F2]/97 via-[#F7F5F2]/80 to-[#F7F5F2]/20" />
        </div>
        <div className="absolute top-24 right-16 w-80 h-80 bg-[#5F8D6D]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-24 right-48 w-96 h-96 bg-[#D8C4B6]/30 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#5F8D6D]/10 text-[#5F8D6D] px-4 py-2 rounded-full text-sm font-medium mb-7" style={{ fontFamily: "Inter, sans-serif" }}>
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
              4.9 ★ — Bangalore&apos;s Most Trusted Family Salon
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-[#2B2B2B] leading-[1.1] mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
              Your Family&apos;s<br />
              <span className="text-[#5F8D6D]">Trusted Grooming</span><br />
              Destination
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed mb-10 max-w-lg" style={{ fontFamily: "Inter, sans-serif" }}>
              Professional grooming with transparent pricing, hygienic practices, and experienced stylists. A calm space where every family member feels at home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={goToBooking}
                className="bg-[#C97C5D] text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#b86b4c] transition-all hover:shadow-xl hover:shadow-[#C97C5D]/25 flex items-center justify-center gap-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Book Appointment <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => navigate("services")}
                className="bg-white text-[#2B2B2B] px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#F7F5F2] transition-colors border border-black/8 flex items-center justify-center gap-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore Services <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#6B7280]" aria-hidden="true">
          <span className="text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Trust Stats */}
      <section ref={statsRef} className="py-16 bg-white" aria-label="Trust statistics">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: "4.9★", label: "Google Rating", sub: "Based on 2,400+ reviews", bg: "#FEF9EC", color: "#D97706" },
              { value: "5000+", label: "Happy Customers", sub: "And growing every day", bg: "#EEF5F1", color: "#5F8D6D" },
              { value: "100%", label: "Sterilized Equipment", sub: "Hospital-grade hygiene", bg: "#FAF0EC", color: "#C97C5D" },
              { value: "15+", label: "Years Experience", sub: "Trusted since 2009", bg: "#EEF5F1", color: "#5F8D6D" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 text-center transition-all duration-700 ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ background: stat.bg, transitionDelay: `${i * 120}ms` }}
              >
                <div className="text-3xl lg:text-4xl font-bold mb-1.5" style={{ color: stat.color, fontFamily: "Poppins, sans-serif" }}>{stat.value}</div>
                <div className="font-semibold text-[#2B2B2B] text-sm mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.label}</div>
                <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#F7F5F2]" aria-label="Why choose us">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Why Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-3 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Why Families Choose Binary Brains</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              We built this salon around one question: What would make a family feel completely safe and at ease?
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 hover:shadow-md transition-shadow duration-300 group">
                <div className="text-4xl mb-5" aria-hidden="true">{item.icon}</div>
                <h3 className="font-semibold text-[#2B2B2B] text-base mb-3 group-hover:text-[#5F8D6D] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white" aria-label="Featured services">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Services</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-3 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Everything Your Family Needs</h2>
            <p className="text-[#6B7280] max-w-xl mx-auto text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              From haircuts to bridal packages — every grooming need under one hygienic roof.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <article
                  key={i}
                  onClick={() => { setActiveCategory(svc.category); navigate("services"); }}
                  className="group relative overflow-hidden rounded-3xl cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") { setActiveCategory(svc.category); navigate("services"); } }}
                  aria-label={`Explore ${svc.name} services`}
                >
                  <div className="relative h-64 bg-[#D8C4B6]/30">
                    <img
                      src={`https://images.unsplash.com/${svc.image}?w=600&h=340&fit=crop&auto=format`}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/85 via-[#2B2B2B]/20 to-transparent" aria-hidden="true" />
                    <div className="absolute top-4 left-4" aria-hidden="true">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{svc.name}</h3>
                    <p className="text-white/75 text-sm mb-4 leading-snug" style={{ fontFamily: "Inter, sans-serif" }}>{svc.desc}</p>
                    <div className="flex gap-2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={(e) => { e.stopPropagation(); goToBooking(); }}
                        className="bg-[#C97C5D] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#b86b4c] transition-colors"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Book Now
                      </button>
                      <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center" style={{ fontFamily: "Inter, sans-serif" }}>
                        Explore
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials */}
      <section className="py-20 bg-[#F7F5F2]" aria-label="Customer reviews">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Reviews</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-3 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden="true" />)}
              <span className="ml-2 font-semibold text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>4.9 / 5</span>
            </div>
            <span className="text-[#6B7280] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Based on 2,400+ Google Reviews</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviewsLoading
              ? Array.from({ length: 4 }).map((_, i) => <ReviewCardSkeleton key={i} />)
              : reviews.slice(0, 4).map((r) => <ReviewCard key={r.id} review={r} />)
            }
          </div>
        </div>
      </section>

      {/* Hygiene Promise */}
      <section className="py-20 bg-[#EEF5F1]" aria-label="Hygiene promise">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Hygiene Promise</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-3 mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>Cleanliness is Our<br />Core Promise</h2>
              <p className="text-[#6B7280] mb-8 leading-relaxed text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                Every tool is sterilized. Every surface is sanitized. Every towel is disposable. We follow protocols stricter than most clinics so you can sit back and relax completely.
              </p>
              <ul className="space-y-3.5">
                {["Autoclave sterilization for all metal tools", "Disposable towels — never reused", "Hospital-grade disinfectant sprays", "All stylists certified in hygiene protocols", "Daily deep cleaning of all surfaces"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#5F8D6D] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b7?w=700&h=520&fit=crop&auto=format"
                  alt="Clean salon environment showing sterilized equipment and pristine workspace"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-5 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF5F1] flex items-center justify-center" aria-hidden="true">
                    <Shield className="w-5 h-5 text-[#5F8D6D]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#2B2B2B] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>100% Certified</div>
                    <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>Hygiene Standards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-[#5F8D6D]" aria-label="Call to action">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Ready for Your Next Makeover?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Book your appointment today. No queues, no surprises — just great grooming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToBooking}
              className="bg-[#C97C5D] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#b86b4c] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Book Appointment
            </button>
            <a
              href="https://wa.me/919876543210"
              className="bg-white/15 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/25 transition-colors flex items-center justify-center gap-2"
              style={{ fontFamily: "Inter, sans-serif" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default memo(HomePage);
