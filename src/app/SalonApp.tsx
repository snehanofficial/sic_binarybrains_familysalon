"use client";

import { useState, useEffect, useRef } from "react";
import {
  Star, Users, Shield, Award, Phone, MessageCircle, Menu, X,
  Check, Clock, MapPin, Mail, ArrowRight, Scissors,
  Sparkles, Heart, Baby, ChevronDown, ChevronRight,
  User, Crown, CheckCircle2, Bell, LogOut, UserCheck
} from "lucide-react";
import FloatingChatButton from "./components/chatbot/FloatingChatButton";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { QueueProvider } from "../context/QueueContext";
import { NotificationProvider, useNotifications } from "../context/NotificationContext";

import AuthModal from "./components/auth/AuthModal";
import LiveQueueView from "./components/queue/LiveQueueView";
import StylistWorkspace from "./components/stylist/StylistWorkspace";
import AdminDashboard from "./components/admin/AdminDashboard";
import NotificationDrawer from "./components/notifications/NotificationDrawer";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

type Page = "home" | "services" | "gallery" | "booking" | "queue" | "stylist" | "admin";
type ServiceCategory = "hair" | "skin" | "grooming" | "bridal" | "kids" | "senior";
type GalleryTab = "interior" | "team" | "transformations";

// ── DATA ──────────────────────────────────────────────────────────────────────

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

const testimonials = [
  { name: "Priya Sharma", location: "Koramangala", rating: 5, text: "Binary Brains is our family's go-to salon. The hygiene standards are exceptional and the stylists really listen. My kids actually look forward to haircuts now!", avatar: "photo-1494790108377-be9c29b29330" },
  { name: "Rahul Mehta", location: "HSR Layout", rating: 5, text: "Transparent pricing and zero pushy upsells — exactly what I needed. My beard has never looked better. The ambience is genuinely calming.", avatar: "photo-1500648767791-00dcc994a43e" },
  { name: "Ananya Krishnan", location: "Indiranagar", rating: 5, text: "Got my bridal package done here and I was blown away. The team was so patient and professional. Worth every rupee!", avatar: "photo-1438761681033-6461ffad8d80" },
  { name: "Vikram Nair", location: "Whitefield", rating: 5, text: "As a senior citizen, I appreciate how comfortable and welcoming they made me feel. Priority seating and such gentle service. Highly recommend.", avatar: "photo-1499996860823-5214fcc65f8f" },
];

const hairServices = [
  { name: "Hair Cut", duration: "45 min", price: "₹299", benefits: ["Precision cut", "Style consultation", "Blow dry finish"], image: "photo-1560066984-138dadb4c035" },
  { name: "Hair Spa", duration: "60 min", price: "₹599", benefits: ["Deep conditioning", "Scalp massage", "Protein treatment"], image: "photo-1522337360788-8b13dee7a37e" },
  { name: "Hair Colour", duration: "90 min", price: "₹999", benefits: ["Premium colour brands", "Patch test included", "Style finish"], image: "photo-1492106087820-71f1a00d2b11" },
  { name: "Smoothening", duration: "120 min", price: "₹2,499", benefits: ["Frizz-free result", "Keratin treatment", "Long-lasting"], image: "photo-1562322140-8baeececf3df" },
  { name: "Hair Styling", duration: "30 min", price: "₹399", benefits: ["Occasion styling", "Product included", "Expert finish"], image: "photo-1605497788044-5a32c7078486" },
];

const skinServices = [
  { name: "Classic Facial", duration: "60 min", price: "₹799", benefits: ["Deep cleansing", "Hydration boost", "Glow finish"], image: "photo-1570172619644-dfd03ed5d881" },
  { name: "Cleanup", duration: "30 min", price: "₹349", benefits: ["Pore cleansing", "Blackhead removal", "Skin brightening"], image: "photo-1616394584738-fc6e612e71b9" },
  { name: "De-tan Treatment", duration: "45 min", price: "₹499", benefits: ["Tan removal", "Even skin tone", "Nourishing mask"], image: "photo-1596755389378-c31d21fd1273" },
  { name: "Skin Care Therapy", duration: "75 min", price: "₹1,199", benefits: ["Customised treatment", "Anti-aging", "Vitamin infusion"], image: "photo-1535914254981-b5012eebbd15" },
  { name: "Hydration Therapy", duration: "60 min", price: "₹899", benefits: ["Moisture lock", "Plumping effect", "Sensitive-skin safe"], image: "photo-1540555700478-4be289fbecef" },
];

const groomingServices = [
  { name: "Beard Styling", duration: "30 min", price: "₹199", benefits: ["Shape & define", "Beard oil treatment", "Clean edges"], image: "photo-1503951914875-452162b0f3f1" },
  { name: "Clean Shave", duration: "20 min", price: "₹149", benefits: ["Hot towel prep", "Precision blade", "Aftercare lotion"], image: "photo-1621605815971-fbc98d665033" },
  { name: "Hair Wash & Style", duration: "30 min", price: "₹249", benefits: ["Premium shampoo", "Scalp massage", "Style finish"], image: "photo-1605497788044-5a32c7078486" },
  { name: "Grooming Package", duration: "90 min", price: "₹799", benefits: ["Cut + Beard + Facial", "Best value", "Complete grooming"], image: "photo-1599351431202-1e0f0137899a" },
];

const bridalServices = [
  { name: "Bridal Makeup", duration: "180 min", price: "₹8,999", benefits: ["HD makeup", "Trial session included", "All-day lasting"], image: "photo-1519741497674-611481863552" },
  { name: "Reception Look", duration: "120 min", price: "₹5,999", benefits: ["Glamour finish", "Draping assistance", "Touch-up kit"], image: "photo-1537633552985-df8429e8048b" },
  { name: "Engagement Look", duration: "90 min", price: "₹3,999", benefits: ["Natural glow", "Hairstyling included", "HD finish"], image: "photo-1606216794074-735e91aa2c92" },
  { name: "Party Makeup", duration: "60 min", price: "₹1,999", benefits: ["Festive look", "Saree draping", "Premium products"], image: "photo-1522337360788-8b13dee7a37e" },
];

const kidsServices = [
  { name: "Kids Haircut", duration: "30 min", price: "₹199", benefits: ["Child-safe products", "Fun environment", "Patient stylists"], image: "photo-1560869713-da86bd3b8c49" },
  { name: "Kids Styling", duration: "20 min", price: "₹149", benefits: ["Gentle products", "Safe tools", "Happy experience"], image: "photo-1502086223501-7ea6ecd79368" },
];

const seniorServices = [
  { name: "Senior Haircut", duration: "45 min", price: "₹249", benefits: ["Comfort seating", "Gentle handling", "Priority service"], image: "photo-1573497701240-345a300b8d36" },
  { name: "Senior Skin Care", duration: "60 min", price: "₹599", benefits: ["Age-appropriate care", "Sensitive products", "Relaxing experience"], image: "photo-1570172619644-dfd03ed5d881" },
];

const serviceMap: Record<ServiceCategory, typeof hairServices> = {
  hair: hairServices,
  skin: skinServices,
  grooming: groomingServices,
  bridal: bridalServices,
  kids: kidsServices,
  senior: seniorServices,
};

const galleryInterior = [
  { id: "photo-1582095133179-bfd08e2fb6b7", label: "Main Salon Floor", h: 280 },
  { id: "photo-1521590832167-7bcbfaa6381f", label: "Styling Stations", h: 360 },
  { id: "photo-1633681926022-84c23e8cb2d6", label: "Wash Stations", h: 320 },
  { id: "photo-1604654894610-df63bc536371", label: "Reception Area", h: 260 },
  { id: "photo-1600948836101-f9ffda59d250", label: "Kids Corner", h: 340 },
  { id: "photo-1595476108010-b4d1f102b1b1", label: "Private Suite", h: 300 },
];

const galleryTeam = [
  { id: "photo-1494790108377-be9c29b29330", name: "Preethi K", role: "Senior Stylist · 8 yrs", spec: "Hair Colouring & Bridal" },
  { id: "photo-1500648767791-00dcc994a43e", name: "Arjun M", role: "Grooming Expert · 6 yrs", spec: "Beard & Men's Grooming" },
  { id: "photo-1438761681033-6461ffad8d80", name: "Sneha R", role: "Skincare Specialist · 5 yrs", spec: "Facials & Skin Therapy" },
  { id: "photo-1499996860823-5214fcc65f8f", name: "Karthik S", role: "Beard Artist · 7 yrs", spec: "Men's Precision Cuts" },
];

const galleryTransformations = [
  { before: "photo-1584308666744-24d5c474f2ae", after: "photo-1560066984-138dadb4c035", label: "Hair Transformation" },
  { before: "photo-1537633552985-df8429e8048b", after: "photo-1519741497674-611481863552", label: "Bridal Makeover" },
  { before: "photo-1503951914875-452162b0f3f1", after: "photo-1621605815971-fbc98d665033", label: "Grooming Transform" },
];

const stylists = [
  { name: "Preethi K", specialty: "Hair Colouring & Bridal", exp: "8 years", avatar: "photo-1494790108377-be9c29b29330" },
  { name: "Arjun M", specialty: "Grooming & Hair Cuts", exp: "6 years", avatar: "photo-1500648767791-00dcc994a43e" },
  { name: "Sneha R", specialty: "Skincare & Facials", exp: "5 years", avatar: "photo-1438761681033-6461ffad8d80" },
  { name: "Karthik S", specialty: "Beard & Men's Grooming", exp: "7 years", avatar: "photo-1499996860823-5214fcc65f8f" },
];

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const customerTypes = ["Adult Male", "Adult Female", "Kids", "Senior"];
const serviceOptions: Record<string, string[]> = {
  "Adult Male": ["Hair Cut", "Beard Styling", "Clean Shave", "Grooming Package", "Hair Spa", "Classic Facial"],
  "Adult Female": ["Hair Cut", "Hair Colour", "Hair Spa", "Hair Smoothening", "Classic Facial", "De-tan Treatment", "Bridal Makeup"],
  "Kids": ["Kids Haircut", "Kids Styling"],
  "Senior": ["Senior Haircut", "Senior Skin Care"],
};

const faqs = [
  { q: "Do I need to book in advance?", a: "We recommend booking at least 24 hours in advance, especially for weekends and bridal packages. Walk-ins are welcome for regular haircuts subject to availability." },
  { q: "Are your prices fixed or do they vary?", a: "All prices are fixed and displayed upfront with no hidden charges. What you see is what you pay." },
  { q: "Is it safe to bring my kids?", a: "Absolutely! We have a dedicated kids corner with child-safe products and specially trained stylists experienced with children of all ages." },
  { q: "What hygiene practices do you follow?", a: "We sterilize all equipment after every use, use disposable towels, maintain hospital-grade sanitation, and require all staff to follow strict hygiene protocols." },
  { q: "What payment methods do you accept?", a: "We accept cash, all UPI apps (GPay, PhonePe, Paytm), debit/credit cards, and net banking." },
  { q: "Can I cancel or reschedule my appointment?", a: "Yes, you can cancel or reschedule up to 2 hours before your appointment at no charge. Late cancellations may incur a small fee." },
  { q: "Do you offer senior citizen discounts?", a: "Yes! Senior citizens (60+) receive a flat 15% discount on all services and enjoy priority seating." },
  { q: "Is there parking available?", a: "Yes, we have dedicated parking for up to 20 vehicles right outside the salon." },
];

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function ServiceCard({ service, onBook }: { service: typeof hairServices[0]; onBook: () => void }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
      <div className="relative h-48 bg-[#D8C4B6]/30 overflow-hidden">
        <img
          src={`https://images.unsplash.com/${service.image}?w=480&h=220&fit=crop&auto=format`}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[#2B2B2B] text-xs font-semibold px-3 py-1 rounded-full" style={{ fontFamily: "Inter, sans-serif" }}>
          {service.duration}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#2B2B2B] text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{service.name}</h3>
          <span className="text-[#C97C5D] font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>{service.price}</span>
        </div>
        <ul className="space-y-1.5 mb-4">
          {service.benefits.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>
              <Check className="w-4 h-4 text-[#5F8D6D] flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <button
          onClick={onBook}
          className="w-full bg-[#C97C5D] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#b86b4c] transition-colors"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function StarRow({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

function SalonContent() {
  const [page, setPage] = useState<Page>("home");
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("hair");
  const [galleryTab, setGalleryTab] = useState<GalleryTab>("interior");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  // Hydration-safe mounted flag for date rendering
  const [mounted, setMounted] = useState(false);

  // Booking state
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({ customerType: "", service: "", stylist: "", date: "", time: "" });
  const bookingDone = bookingStep > 6;

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page") as Page;
      if (pageParam && ["home", "services", "gallery", "booking"].includes(pageParam)) {
        setPage(pageParam);
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const navigate = (p: Page) => { setPage(p); setMobileOpen(false); };
  const goToBooking = () => { setPage("booking"); setBookingStep(1); };

  // ── NAVBAR & AUTH INTEGRATION ─────────────────────────────────────────────
  const { user, isAuthenticated, logout, openAuthModal, hasPermission } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();

  const navLinks = [
    { id: "home", label: "Home", action: () => navigate("home") },
    { id: "about", label: "About", action: () => { window.location.href = "/about"; } },
    { id: "services", label: "Services", action: () => navigate("services") },
    { id: "queue", label: "Live Queue", action: () => navigate("queue") },
    { id: "gallery", label: "Gallery", action: () => navigate("gallery") },
    { id: "booking", label: "Book Appointment", action: () => navigate("booking") },
    ...(hasPermission("booking:view_assigned") ? [{ id: "stylist", label: "Stylist Workspace", action: () => navigate("stylist") }] : []),
    ...(hasPermission("reports:view") ? [{ id: "admin", label: "Admin Dashboard", action: () => navigate("admin") }] : []),
  ];

  const Navbar = () => (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled || page !== "home" ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("home")} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#5F8D6D] flex items-center justify-center shadow-xs">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
            Binary<span className="text-[#5F8D6D]">Brains</span>
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={l.action}
              className={`text-sm font-medium transition-colors cursor-pointer ${page === l.id ? "text-[#5F8D6D] font-semibold" : "text-[#2B2B2B] hover:text-[#5F8D6D]"}`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* In-App Notifications Bell */}
          <button
            onClick={toggleDrawer}
            className="p-2.5 rounded-xl bg-white border border-black/5 text-[#2B2B2B] hover:bg-[#EEF5F1] transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C97C5D] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Auth Profile Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF5F1] rounded-xl border border-[#5F8D6D]/20 text-xs font-semibold text-[#5F8D6D]">
                <UserCheck className="w-4 h-4 text-[#5F8D6D]" />
                <span>{user?.name.split(" ")[0]} ({user?.role})</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-[#6B7280] hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="border border-[#5F8D6D] text-[#5F8D6D] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#EEF5F1] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Login / Register
            </button>
          )}

          <button onClick={goToBooking} className="bg-[#C97C5D] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#b86b4c] transition-colors shadow-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Book Now
          </button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors">
          {mobileOpen ? <X className="w-6 h-6 text-[#2B2B2B]" /> : <Menu className="w-6 h-6 text-[#2B2B2B]" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#F0EDE9] px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <button key={l.id} onClick={() => { l.action(); setMobileOpen(false); }} className="block w-full text-left text-sm font-medium text-[#2B2B2B] py-2 hover:text-[#5F8D6D] transition-colors cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>
              {l.label}
            </button>
          ))}
          {!isAuthenticated && (
            <button onClick={() => { openAuthModal("login"); setMobileOpen(false); }} className="w-full border border-[#5F8D6D] text-[#5F8D6D] py-2.5 rounded-xl text-sm font-semibold mt-2">
              Login / Register
            </button>
          )}
          <button onClick={goToBooking} className="w-full bg-[#C97C5D] text-white py-3 rounded-xl text-sm font-semibold mt-2" style={{ fontFamily: "Inter, sans-serif" }}>
            Book Now
          </button>
        </div>
      )}
    </nav>
  );

  // ── HOME PAGE ────────────────────────────────────────────────────────────────
  const HomePage = () => (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&h=900&fit=crop&auto=format" alt="Binary Brains Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F2]/97 via-[#F7F5F2]/80 to-[#F7F5F2]/20" />
        </div>
        <div className="absolute top-24 right-16 w-80 h-80 bg-[#5F8D6D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-24 right-48 w-96 h-96 bg-[#D8C4B6]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#5F8D6D]/10 text-[#5F8D6D] px-4 py-2 rounded-full text-sm font-medium mb-7" style={{ fontFamily: "Inter, sans-serif" }}>
              <Star className="w-4 h-4 fill-current" />
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
              <button onClick={goToBooking} className="bg-[#C97C5D] text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#b86b4c] transition-all hover:shadow-xl hover:shadow-[#C97C5D]/25 flex items-center justify-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Book Appointment <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate("services")} className="bg-white text-[#2B2B2B] px-8 py-4 rounded-2xl text-base font-semibold hover:bg-[#F7F5F2] transition-colors border border-black/8 flex items-center justify-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
                Explore Services <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#6B7280]">
          <span className="text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Trust Stats */}
      <section ref={statsRef} className="py-16 bg-white">
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
      <section className="py-20 bg-[#F7F5F2]">
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
                <div className="text-4xl mb-5">{item.icon}</div>
                <h3 className="font-semibold text-[#2B2B2B] text-base mb-3 group-hover:text-[#5F8D6D] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
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
                <div
                  key={i}
                  onClick={() => { setActiveCategory(svc.category); navigate("services"); }}
                  className="group relative overflow-hidden rounded-3xl cursor-pointer"
                >
                  <div className="relative h-64 bg-[#D8C4B6]/30">
                    <img
                      src={`https://images.unsplash.com/${svc.image}?w=600&h=340&fit=crop&auto=format`}
                      alt={svc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/85 via-[#2B2B2B]/20 to-transparent" />
                    <div className="absolute top-4 left-4">
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
                      <button className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/25 transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                        Explore
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F7F5F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Reviews</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-3 mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>What Our Customers Say</h2>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 font-semibold text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>4.9 / 5</span>
            </div>
            <span className="text-[#6B7280] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Based on 2,400+ Google Reviews</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <StarRow />
                <p className="text-sm text-[#2B2B2B] leading-relaxed my-4 italic" style={{ fontFamily: "Inter, sans-serif" }}>&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <img src={`https://images.unsplash.com/${t.avatar}?w=60&h=60&fit=crop&auto=format`} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-[#D8C4B6]" />
                  <div>
                    <div className="font-semibold text-sm text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{t.name}</div>
                    <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="border border-[#5F8D6D] text-[#5F8D6D] px-8 py-3 rounded-xl font-semibold hover:bg-[#5F8D6D] hover:text-white transition-colors text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              View All Reviews
            </button>
          </div>
        </div>
      </section>

      {/* Hygiene */}
      <section className="py-20 bg-[#EEF5F1]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Hygiene Promise</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-3 mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>Cleanliness is Our<br />Core Promise</h2>
              <p className="text-[#6B7280] mb-8 leading-relaxed text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                Every tool is sterilized. Every surface is sanitized. Every towel is disposable. We follow protocols stricter than most clinics so you can sit back and relax completely.
              </p>
              <div className="space-y-3.5">
                {["Autoclave sterilization for all metal tools", "Disposable towels — never reused", "Hospital-grade disinfectant sprays", "All stylists certified in hygiene protocols", "Daily deep cleaning of all surfaces"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#5F8D6D] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1582095133179-bfd08e2fb6b7?w=700&h=520&fit=crop&auto=format" alt="Clean salon environment" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-5 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF5F1] flex items-center justify-center">
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
      <section className="py-20 bg-[#5F8D6D]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-6">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>Ready for Your Next Makeover?</h2>
          <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto" style={{ fontFamily: "Inter, sans-serif" }}>
            Book your appointment today. No queues, no surprises — just great grooming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goToBooking} className="bg-[#C97C5D] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#b86b4c] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
              Book Appointment
            </button>
            <a href="https://wa.me/919876543210" className="bg-white/15 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/25 transition-colors flex items-center justify-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );

  // ── SERVICES PAGE ────────────────────────────────────────────────────────────
  const ServicesPage = () => {
    const categories: { id: ServiceCategory; label: string; emoji: string }[] = [
      { id: "hair", label: "Hair", emoji: "✂️" },
      { id: "skin", label: "Skin", emoji: "✨" },
      { id: "grooming", label: "Grooming", emoji: "🪒" },
      { id: "bridal", label: "Bridal", emoji: "👰" },
      { id: "kids", label: "Kids", emoji: "🧒" },
      { id: "senior", label: "Senior Care", emoji: "👴" },
    ];

    return (
      <div className="pt-20 min-h-screen bg-[#F7F5F2]">
        <div className="bg-white border-b border-black/[0.06]">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
            <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Our Services</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-2 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Explore All Services</h1>
            <p className="text-[#6B7280] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Transparent pricing. No hidden charges. Book directly from here.</p>
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all rounded-t-xl ${activeCategory === cat.id ? "border-[#5F8D6D] text-[#5F8D6D] bg-[#EEF5F1]" : "border-transparent text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#F7F5F2]"}`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <span>{cat.emoji}</span>{cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(serviceMap[activeCategory] || []).map((svc, i) => (
              <ServiceCard key={i} service={svc} onBook={goToBooking} />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-10">
          <div className="bg-[#EEF5F1] rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#5F8D6D] flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-[#2B2B2B] text-xl mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>No Hidden Charges — Ever</h3>
              <p className="text-[#6B7280] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>All prices listed are final. No service charge, no GST surprise, no add-on pressure. What you see is exactly what you pay.</p>
            </div>
            <button onClick={goToBooking} className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#b86b4c] transition-colors flex-shrink-0" style={{ fontFamily: "Inter, sans-serif" }}>
              Book Now
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-7" style={{ fontFamily: "Poppins, sans-serif" }}>Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Student Offer", desc: "20% off on all hair services with a valid student ID.", badge: "Students", color: "#5F8D6D" },
              { title: "Family Package", desc: "Book 3+ services together and get 15% off the total.", badge: "Family", color: "#C97C5D" },
              { title: "Festival Special", desc: "Premium bridal and party look packages this festive season.", badge: "Festival", color: "#D8C4B6" },
              { title: "Membership Plan", desc: "Monthly plan — unlimited haircuts + 2 premium services.", badge: "Members", color: "#5F8D6D" },
              { title: "Referral Rewards", desc: "Refer a friend and both get ₹200 off your next visit.", badge: "Referral", color: "#C97C5D" },
              { title: "Senior Discount", desc: "Flat 15% off for all senior citizens. Always.", badge: "Seniors", color: "#5F8D6D" },
            ].map((offer, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-4" style={{ background: offer.color === "#D8C4B6" ? "#D8C4B6" : offer.color, color: offer.color === "#D8C4B6" ? "#2B2B2B" : "white", fontFamily: "Inter, sans-serif" }}>
                  {offer.badge}
                </span>
                <h3 className="font-bold text-[#2B2B2B] text-base mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{offer.title}</h3>
                <p className="text-sm text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── GALLERY PAGE ─────────────────────────────────────────────────────────────
  const GalleryPage = () => (
    <div className="pt-20 min-h-screen bg-[#F7F5F2]">
      <div className="bg-white border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-0">
          <span className="text-[#5F8D6D] text-xs font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: "Inter, sans-serif" }}>Gallery</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#2B2B2B] mt-2 mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>See for Yourself</h1>
          <p className="text-[#6B7280] text-sm mb-6" style={{ fontFamily: "Inter, sans-serif" }}>Visual proof of our hygiene, skill, and welcoming environment.</p>
          <div className="flex gap-1">
            {(["interior", "team", "transformations"] as GalleryTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setGalleryTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-all rounded-t-xl ${galleryTab === tab ? "border-[#5F8D6D] text-[#5F8D6D] bg-[#EEF5F1]" : "border-transparent text-[#6B7280] hover:text-[#2B2B2B] hover:bg-[#F7F5F2]"}`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {tab === "interior" ? "Salon Interior" : tab === "team" ? "Our Team" : "Transformations"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {galleryTab === "interior" && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {galleryInterior.map((img, i) => (
              <div key={i} className="break-inside-avoid group relative overflow-hidden rounded-3xl bg-[#D8C4B6]/30 cursor-pointer">
                <img
                  src={`https://images.unsplash.com/${img.id}?w=500&h=${img.h}&fit=crop&auto=format`}
                  alt={img.label}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                  <span className="text-white text-sm font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {galleryTab === "team" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryTeam.map((member, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-72 bg-[#D8C4B6]/30">
                  <img src={`https://images.unsplash.com/${member.id}?w=400&h=320&fit=crop&auto=format`} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="font-bold text-[#2B2B2B] mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>{member.name}</div>
                  <div className="text-xs text-[#6B7280] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>{member.role}</div>
                  <div className="inline-block bg-[#EEF5F1] text-[#5F8D6D] text-xs font-medium px-3 py-1 rounded-full" style={{ fontFamily: "Inter, sans-serif" }}>{member.spec}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {galleryTab === "transformations" && (
          <div className="space-y-6">
            {galleryTransformations.map((trans, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-[#2B2B2B] text-lg mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>{trans.label}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative rounded-2xl overflow-hidden bg-[#D8C4B6]/30">
                    <img src={`https://images.unsplash.com/${trans.before}?w=500&h=320&fit=crop&auto=format`} alt="Before" className="w-full h-52 object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 text-[#2B2B2B] text-xs font-bold px-3 py-1 rounded-full">Before</span>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden bg-[#D8C4B6]/30">
                    <img src={`https://images.unsplash.com/${trans.after}?w=500&h=320&fit=crop&auto=format`} alt="After" className="w-full h-52 object-cover" />
                    <span className="absolute top-3 left-3 bg-[#5F8D6D] text-white text-xs font-bold px-3 py-1 rounded-full">After</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-[#5F8D6D] to-[#4a7057] rounded-3xl p-10 text-center text-white">
          <InstagramIcon className="w-10 h-10 mx-auto mb-4 opacity-75" />
          <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>Follow Us on Instagram</h3>
          <p className="text-white/70 mb-6 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>@binarybrainssalon — Daily transformations, tips, and offers</p>
          <a href="https://instagram.com" className="inline-block bg-white text-[#5F8D6D] px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
            Follow @binarybrainssalon
          </a>
        </div>
      </div>
    </div>
  );

  // ── BOOKING PAGE ─────────────────────────────────────────────────────────────
  const BookingPage = () => {
    const stepLabels = ["Who", "Service", "Stylist", "Date", "Time", "Review"];

    return (
      <div className="pt-20 min-h-screen bg-[#F7F5F2]">
        {bookingDone ? (
          <div className="max-w-lg mx-auto px-6 py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-[#EEF5F1] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#5F8D6D]" />
            </div>
            <h1 className="text-3xl font-bold text-[#2B2B2B] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>Booking Confirmed!</h1>
            <p className="text-[#6B7280] mb-7 text-sm leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
              Your appointment has been booked. A confirmation will be sent to your WhatsApp shortly.
            </p>
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 text-left space-y-3.5">
              {[
                { label: "Customer Type", value: bookingData.customerType },
                { label: "Service", value: bookingData.service },
                { label: "Stylist", value: bookingData.stylist },
                { label: "Date", value: bookingData.date },
                { label: "Time", value: bookingData.time },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</span>
                  <span className="font-medium text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setBookingStep(1); setBookingData({ customerType: "", service: "", stylist: "", date: "", time: "" }); }} className="bg-[#5F8D6D] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#4a7057] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                Book Another
              </button>
              <button onClick={() => navigate("home")} className="border border-black/[0.08] text-[#2B2B2B] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-6 py-10">
            {/* Progress bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                {stepLabels.map((label, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i + 1 < bookingStep ? "bg-[#5F8D6D] text-white" : i + 1 === bookingStep ? "bg-[#C97C5D] text-white" : "bg-white text-[#6B7280] border border-black/10"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                      {i + 1 < bookingStep ? <Check className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] hidden sm:block font-medium ${i + 1 === bookingStep ? "text-[#C97C5D]" : "text-[#6B7280]"}`} style={{ fontFamily: "Inter, sans-serif" }}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-[#5F8D6D] rounded-full transition-all duration-500" style={{ width: `${((bookingStep - 1) / 5) * 100}%` }} />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm">
              {/* Step 1 — Customer type */}
              {bookingStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Who is this appointment for?</h2>
                  <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Select to personalise your experience</p>
                  <div className="grid grid-cols-2 gap-4">
                    {customerTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => { setBookingData({ ...bookingData, customerType: type, service: "" }); setBookingStep(2); }}
                        className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-[#5F8D6D] ${bookingData.customerType === type ? "border-[#5F8D6D] bg-[#EEF5F1]" : "border-black/[0.08]"}`}
                      >
                        <div className="text-4xl mb-3">{type === "Adult Male" ? "👨" : type === "Adult Female" ? "👩" : type === "Kids" ? "🧒" : "👴"}</div>
                        <div className="font-semibold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>{type}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 — Service */}
              {bookingStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose a Service</h2>
                  <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>For {bookingData.customerType}</p>
                  <div className="space-y-2.5">
                    {(serviceOptions[bookingData.customerType] || []).map((svc) => (
                      <button
                        key={svc}
                        onClick={() => { setBookingData({ ...bookingData, service: svc }); setBookingStep(3); }}
                        className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all hover:border-[#5F8D6D] ${bookingData.service === svc ? "border-[#5F8D6D] bg-[#EEF5F1]" : "border-black/[0.08]"}`}
                      >
                        <span className="font-medium text-[#2B2B2B] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{svc}</span>
                        <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setBookingStep(1)} className="mt-6 text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                </div>
              )}

              {/* Step 3 — Stylist */}
              {bookingStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose Your Stylist</h2>
                  <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Or we will assign the best match for you</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stylists.map((s) => (
                      <button
                        key={s.name}
                        onClick={() => { setBookingData({ ...bookingData, stylist: s.name }); setBookingStep(4); }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all hover:border-[#5F8D6D] ${bookingData.stylist === s.name ? "border-[#5F8D6D] bg-[#EEF5F1]" : "border-black/[0.08]"}`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img src={`https://images.unsplash.com/${s.avatar}?w=80&h=80&fit=crop&auto=format`} alt={s.name} className="w-12 h-12 rounded-full object-cover bg-[#D8C4B6]" />
                          <div>
                            <div className="font-semibold text-[#2B2B2B] text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>{s.name}</div>
                            <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{s.exp}</div>
                          </div>
                        </div>
                        <span className="text-xs text-[#5F8D6D] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{s.specialty}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setBookingStep(2)} className="mt-6 text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                </div>
              )}

              {/* Step 4 — Date (mounted guard prevents hydration mismatch from new Date()) */}
              {bookingStep === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose a Date</h2>
                  <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Select your preferred appointment date</p>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 mb-8" suppressHydrationWarning>
                    {mounted && Array.from({ length: 14 }, (_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + i + 1);
                      const dateStr = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
                      const selected = bookingData.date === dateStr;
                      const weekend = d.getDay() === 0 || d.getDay() === 6;
                      return (
                        <button
                          key={i}
                          onClick={() => setBookingData({ ...bookingData, date: dateStr })}
                          className={`p-2.5 rounded-2xl border-2 text-center transition-all ${selected ? "border-[#5F8D6D] bg-[#EEF5F1] text-[#5F8D6D]" : weekend ? "border-[#FAF0EC] bg-[#FAF0EC] text-[#C97C5D]" : "border-black/[0.08] hover:border-[#5F8D6D]"}`}
                        >
                          <div className="text-[10px] font-medium" style={{ fontFamily: "Inter, sans-serif" }}>{d.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                          <div className="text-base font-bold mt-0.5" style={{ fontFamily: "Poppins, sans-serif" }}>{d.getDate()}</div>
                          <div className="text-[10px]" style={{ fontFamily: "Inter, sans-serif" }}>{d.toLocaleDateString("en-IN", { month: "short" })}</div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setBookingStep(3)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                    <button onClick={() => setBookingStep(5)} disabled={!bookingData.date} className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#b86b4c] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5 — Time */}
              {bookingStep === 5 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Choose a Time</h2>
                  <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>{bookingData.date}</p>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setBookingData({ ...bookingData, time })}
                        className={`p-3.5 rounded-2xl border-2 text-sm font-medium transition-all ${bookingData.time === time ? "border-[#5F8D6D] bg-[#EEF5F1] text-[#5F8D6D]" : "border-black/[0.08] text-[#2B2B2B] hover:border-[#5F8D6D]"}`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setBookingStep(4)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                    <button onClick={() => setBookingStep(6)} disabled={!bookingData.time} className="bg-[#C97C5D] text-white px-6 py-3 rounded-xl font-semibold text-sm disabled:opacity-40 hover:bg-[#b86b4c] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6 — Review */}
              {bookingStep === 6 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2B2B] mb-1.5" style={{ fontFamily: "Poppins, sans-serif" }}>Review & Confirm</h2>
                  <p className="text-[#6B7280] text-sm mb-8" style={{ fontFamily: "Inter, sans-serif" }}>Here is a summary of your appointment</p>
                  <div className="space-y-3 mb-7">
                    {[
                      { label: "Customer", value: bookingData.customerType, emoji: "👤" },
                      { label: "Service", value: bookingData.service, emoji: "✂️" },
                      { label: "Stylist", value: bookingData.stylist, emoji: "💆" },
                      { label: "Date", value: bookingData.date, emoji: "📅" },
                      { label: "Time", value: bookingData.time, emoji: "⏰" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F5F2]">
                        <span className="text-xl">{item.emoji}</span>
                        <div>
                          <div className="text-xs text-[#6B7280] mb-0.5" style={{ fontFamily: "Inter, sans-serif" }}>{item.label}</div>
                          <div className="font-semibold text-[#2B2B2B] text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#EEF5F1] rounded-2xl p-4 mb-6 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#5F8D6D] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#5F8D6D]" style={{ fontFamily: "Inter, sans-serif" }}>Free cancellation up to 2 hours before your appointment. No hidden charges.</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button onClick={() => setBookingStep(5)} className="text-sm text-[#6B7280] hover:text-[#2B2B2B] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>← Back</button>
                    <button onClick={() => setBookingStep(7)} className="bg-[#C97C5D] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#b86b4c] transition-colors" style={{ fontFamily: "Inter, sans-serif" }}>
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { href: "https://maps.google.com", icon: MapPin, label: "Find Us", sub: "Get Directions", bg: "#EEF5F1", color: "#5F8D6D" },
                { href: "tel:+919876543210", icon: Phone, label: "Call Us", sub: "+91 98765 43210", bg: "#FAF0EC", color: "#C97C5D" },
                { href: "https://wa.me/919876543210", icon: MessageCircle, label: "WhatsApp", sub: "Chat with Us", bg: "#E8F8EF", color: "#25D366" },
              ].map((c) => (
                <a key={c.label} href={c.href} className="bg-white rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div>
                    <div className="text-xs text-[#6B7280]" style={{ fontFamily: "Inter, sans-serif" }}>{c.label}</div>
                    <div className="text-sm font-medium text-[#2B2B2B]" style={{ fontFamily: "Inter, sans-serif" }}>{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* FAQ */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-[#2B2B2B] mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>Frequently Asked Questions</h2>
              <div className="space-y-2.5">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-5 flex items-center justify-between text-left">
                      <span className="font-medium text-[#2B2B2B] text-sm pr-4" style={{ fontFamily: "Inter, sans-serif" }}>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-[#6B7280] flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5">
                        <p className="text-sm text-[#6B7280] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── FOOTER ───────────────────────────────────────────────────────────────────
  const Footer = () => (
    <footer className="bg-[#2B2B2B] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#5F8D6D] flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>Binary<span className="text-[#5F8D6D]">Brains</span></span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm" style={{ fontFamily: "Inter, sans-serif" }}>
              Your family&apos;s trusted grooming destination. Professional, hygienic, and welcoming — since 2009.
            </p>
            <div className="flex gap-3">
              {[InstagramIcon, FacebookIcon].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#5F8D6D] transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-semibold text-sm mb-5 text-white/80" style={{ fontFamily: "Poppins, sans-serif" }}>Navigation</h4>
            <div className="space-y-3 text-left">
              <button onClick={() => navigate("home")} className="block text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>Home</button>
              <button onClick={() => window.location.href = "/about"} className="block text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>About</button>
              <button onClick={() => navigate("services")} className="block text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>Services</button>
              <button onClick={() => navigate("gallery")} className="block text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>Gallery</button>
              <button onClick={() => navigate("booking")} className="block text-sm text-white/50 hover:text-white transition-colors text-left cursor-pointer" style={{ fontFamily: "Inter, sans-serif" }}>Book Appointment</button>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="font-semibold text-sm mb-5 text-white/80" style={{ fontFamily: "Poppins, sans-serif" }}>Contact</h4>
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

        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>© 2026 Binary Brains. All rights reserved.</p>
          <p className="text-white/30 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Made with care in Bangalore ✦</p>
        </div>
      </div>
    </footer>
  );

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F7F5F2] min-h-screen">
      <Navbar />
      {page === "home" && <HomePage />}
      {page === "services" && <ServicesPage />}
      {page === "gallery" && <GalleryPage />}
      {page === "booking" && <BookingPage />}
      {page === "queue" && <LiveQueueView />}
      {page === "stylist" && <StylistWorkspace />}
      {page === "admin" && <AdminDashboard />}
      <Footer />

      {/* Auth Modal & Notifications Drawer */}
      <AuthModal />
      <NotificationDrawer />

      {/* SalonSense AI Chatbot */}
      <FloatingChatButton />
    </div>
  );
}

export default function SalonApp() {
  return (
    <AuthProvider>
      <QueueProvider>
        <NotificationProvider>
          <SalonContent />
        </NotificationProvider>
      </QueueProvider>
    </AuthProvider>
  );
}
