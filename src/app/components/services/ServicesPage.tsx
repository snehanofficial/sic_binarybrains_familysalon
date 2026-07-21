"use client";

import { useState, useEffect, memo } from "react";
import { Check, Shield } from "lucide-react";
import { fetchCategories, fetchServices, fetchOffers } from "../../../lib/apiServices";
import type { Category, Service, Offer } from "../../../lib/apiServices";
import { ServiceCardSkeleton } from "../ui/SalonSkeletons";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";

interface ServicesPageProps {
  goToBooking: (serviceId?: string) => void;
  initialCategory?: string;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function ServiceCard({ service, onBook }: { service: Service; onBook: (id: string) => void }) {
  const imgSrc = service.imageUrl.startsWith("photo-")
    ? `https://images.unsplash.com/${service.imageUrl}?w=480&h=220&fit=crop&auto=format`
    : service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=480&h=220&fit=crop";

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative h-48 bg-[#D8C4B6]/30 overflow-hidden">
        <img
          src={imgSrc}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={480}
          height={220}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#2B2B2B] text-xs font-semibold px-3 py-1 rounded-full" style={{ fontFamily: "Inter, sans-serif" }}>
          {formatDuration(service.durationMinutes)}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#2B2B2B] text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{service.name}</h3>
          <span className="text-[#C97C5D] font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{formatPrice(service.price)}</span>
        </div>
        {service.description && (
          <p className="text-xs text-[#6B7280] mb-3 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{service.description}</p>
        )}
        <ul className="space-y-1.5 mb-4">
          {service.benefits.slice(0, 3).map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>
              <Check className="w-4 h-4 text-[#5F8D6D] flex-shrink-0" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
        <button
          onClick={() => onBook(service.id)}
          className="w-full bg-[#C97C5D] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#b86b4c] transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
          aria-label={`Book ${service.name}`}
        >
          Book Now
        </button>
      </div>
    </article>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const colorMap: Record<string, string> = {
    "hair": "#5F8D6D",
    "family": "#C97C5D",
    "bridal": "#5F8D6D",
    "members": "#5F8D6D",
    "referral": "#C97C5D",
    "seniors": "#5F8D6D",
  };
  const color = colorMap[offer.category?.toLowerCase()] || "#5F8D6D";

  return (
    <article className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow border border-black/[0.05]">
      <span
        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4"
        style={{ background: color }}
      >
        {offer.badge}
      </span>
      <h3 className="font-bold text-[#2B2B2B] text-base mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{offer.title}</h3>
      <p className="text-sm text-[#6B7280] mb-3" style={{ fontFamily: "Inter, sans-serif" }}>{offer.description}</p>
      <div className="flex items-center justify-between">
        <code className="text-xs font-mono font-bold text-[#5F8D6D] bg-[#EEF5F1] px-2.5 py-1 rounded-lg">
          {offer.code}
        </code>
        <span className="text-xs text-[#C97C5D] font-semibold">
          {offer.discountType === "PERCENTAGE"
            ? `${offer.discountValue}% OFF`
            : `₹${offer.discountValue} OFF`}
        </span>
      </div>
    </article>
  );
}

function ServicesPage({ goToBooking, initialCategory }: ServicesPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>(initialCategory || "");
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);

  // Load categories
  useEffect(() => {
    fetchCategories()
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
          if (!activeSlug && res.data.length > 0) {
            setActiveSlug(res.data[0].slug);
          }
        }
      })
      .finally(() => setCategoriesLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load services when category changes
  useEffect(() => {
    if (!activeSlug) return;
    setServicesLoading(true);
    setServicesError(false);
    fetchServices({ category: activeSlug })
      .then((res) => {
        if (res.success && res.data) {
          setServices(res.data);
        } else {
          setServicesError(true);
        }
      })
      .catch(() => setServicesError(true))
      .finally(() => setServicesLoading(false));
  }, [activeSlug]);

  // Load offers
  useEffect(() => {
    fetchOffers()
      .then((res) => {
        if (res.success && res.data) setOffers(res.data);
      })
      .finally(() => setOffersLoading(false));
  }, []);

  const handleBook = (serviceId?: string) => {
    goToBooking(serviceId);
  };

  return (
    <div className="pt-20 min-h-screen bg-[#F7F5F2] page-transition">
      {/* Header with category tabs */}
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
          <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Our Services</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-2 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Explore All Services</h1>
          <p className="text-[#6B7280] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Transparent pricing. No hidden charges. Book directly from here.</p>

          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto pb-px" role="tablist" aria-label="Service categories">
            {categoriesLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-11 w-24 rounded-t-xl bg-gray-100 animate-pulse flex-shrink-0" />
                ))
              : categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSlug(cat.slug)}
                    role="tab"
                    aria-selected={activeSlug === cat.slug}
                    aria-controls={`panel-${cat.slug}`}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all rounded-t-xl flex-shrink-0 ${
                      activeSlug === cat.slug
                        ? "border-[#5F8D6D] text-[#5F8D6D] bg-[#EEF5F1]"
                        : "border-transparent text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#F7F5F2]"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {cat.icon && <span aria-hidden="true">{cat.icon}</span>}
                    {cat.name}
                    {cat._count && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#EEF5F1] text-[#5F8D6D] font-bold">
                        {cat._count.services}
                      </span>
                    )}
                  </button>
                ))
            }
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div
        className="max-w-7xl mx-auto px-6 py-12"
        id={`panel-${activeSlug}`}
        role="tabpanel"
        aria-label={`${categories.find(c => c.slug === activeSlug)?.name || "Services"} list`}
      >
        {servicesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : servicesError ? (
          <div className="bg-white rounded-3xl">
            <ErrorState
              title="Couldn't load services"
              description="Please check your connection and try again."
              onRetry={() => { setServicesLoading(true); setActiveSlug(s => s); }}
            />
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-3xl">
            <EmptyState
              emoji="✂️"
              title="No services in this category"
              description="Check back soon or explore another category."
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc) => (
              <ServiceCard key={svc.id} service={svc} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>

      {/* No Hidden Charges Banner */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-[#EEF5F1] rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-[#5F8D6D] flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-[#2B2B2B] text-xl mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>No Hidden Charges — Ever</h3>
            <p className="text-[#6B7280] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>All prices listed are final. No service charge, no GST surprise, no add-on pressure. What you see is exactly what you pay.</p>
          </div>
          <button
            onClick={() => goToBooking()}
            className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#b86b4c] transition-colors flex-shrink-0"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Offers Section */}
      {(offersLoading || offers.length > 0) && (
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-7" style={{ fontFamily: "Poppins, sans-serif" }}>Special Offers</h2>
          {offersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 space-y-3 shadow-sm">
                  <div className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                  <div className="h-5 w-40 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(ServicesPage);
