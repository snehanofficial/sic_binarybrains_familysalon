"use client";

import { useState, useEffect, useRef, memo } from "react";
import {
  Scissors, Menu, X, Bell, LogOut, User, ChevronDown,
  Calendar, LayoutDashboard, UserCheck,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNotifications } from "../../../context/NotificationContext";

type Page = "home" | "services" | "gallery" | "booking" | "queue" | "stylist" | "admin";

interface NavbarProps {
  page: Page;
  navigate: (p: Page) => void;
  goToBooking: () => void;
}

const navConfig: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "queue", label: "Live Queue" },
  { id: "gallery", label: "Gallery" },
  { id: "booking", label: "Book Appointment" },
];

function Navbar({ page, navigate, goToBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout, openAuthModal, hasPermission } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMobileOpen(false); setProfileOpen(false); }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleNav = (p: Page) => {
    navigate(p);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
  };

  const navLinks = [
    ...navConfig,
    ...(hasPermission("booking:view_assigned") ? [{ id: "stylist" as Page, label: "Stylist Workspace" }] : []),
    ...(hasPermission("reports:view") ? [{ id: "admin" as Page, label: "Admin" }] : []),
  ];

  const isTransparent = !isScrolled && page === "home";

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-2.5 flex-shrink-0"
          aria-label="Go to homepage"
        >
          <div className="w-8 h-8 rounded-xl bg-[#5F8D6D] flex items-center justify-center shadow-sm">
            <Scissors className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span
            className="font-bold text-lg text-[#2B2B2B] hidden sm:block"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Binary<span className="text-[#5F8D6D]">Brains</span>
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1" role="menubar">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => handleNav(l.id)}
              role="menuitem"
              aria-current={page === l.id ? "page" : undefined}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                page === l.id
                  ? "text-[#5F8D6D] bg-[#EEF5F1] font-semibold"
                  : "text-[#2B2B2B] hover:text-[#5F8D6D] hover:bg-[#EEF5F1]/50"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {/* Notifications Bell */}
          <button
            onClick={toggleDrawer}
            className="relative p-2 rounded-xl text-[#2B2B2B] hover:bg-[#EEF5F1] transition-colors"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="w-4.5 h-4.5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C97C5D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Auth — Profile Dropdown or Login */}
          {isAuthenticated ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF5F1] rounded-xl border border-[#5F8D6D]/20 hover:bg-[#D9EDE3] transition-colors"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <div className="w-6 h-6 rounded-full bg-[#5F8D6D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-[#5F8D6D] max-w-[100px] truncate" style={{ fontFamily: "Inter, sans-serif" }}>
                  {user?.name.split(" ")[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#5F8D6D] transition-transform ${profileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-black/[0.08] py-2 z-50 animate-fade-in-up">
                  <div className="px-4 py-2.5 border-b border-black/[0.06]">
                    <p className="text-xs font-semibold text-[#2B2B2B] truncate">{user?.name}</p>
                    <p className="text-[11px] text-[#6B7280] truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF5F1] text-[#5F8D6D]">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={() => { handleNav("booking"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2B2B2B] hover:bg-[#F7F5F2] transition-colors text-left"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <Calendar className="w-4 h-4 text-[#5F8D6D]" aria-hidden="true" />
                    My Bookings
                  </button>
                  {hasPermission("reports:view") && (
                    <button
                      onClick={() => { handleNav("admin"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2B2B2B] hover:bg-[#F7F5F2] transition-colors text-left"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#5F8D6D]" aria-hidden="true" />
                      Admin Dashboard
                    </button>
                  )}
                  {hasPermission("booking:view_assigned") && (
                    <button
                      onClick={() => { handleNav("stylist"); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2B2B2B] hover:bg-[#F7F5F2] transition-colors text-left"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <UserCheck className="w-4 h-4 text-[#5F8D6D]" aria-hidden="true" />
                      Stylist Workspace
                    </button>
                  )}
                  <div className="border-t border-black/[0.06] mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal("login")}
              className="border border-[#5F8D6D] text-[#5F8D6D] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#EEF5F1] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Login
            </button>
          )}

          <button
            onClick={goToBooking}
            className="bg-[#C97C5D] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-[#b86b4c] transition-colors shadow-sm"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book Now
          </button>
        </div>

        {/* Mobile: Bell + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleDrawer}
            className="relative p-2 rounded-xl text-[#2B2B2B] hover:bg-[#EEF5F1] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C97C5D] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl hover:bg-[#EEF5F1] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#2B2B2B]" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 text-[#2B2B2B]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-[#F0EDE9] px-4 pt-4 pb-6 shadow-md animate-fade-in-up"
        >
          <nav className="space-y-1 mb-4" aria-label="Mobile navigation">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                aria-current={page === l.id ? "page" : undefined}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  page === l.id
                    ? "bg-[#EEF5F1] text-[#5F8D6D] font-semibold"
                    : "text-[#2B2B2B] hover:bg-[#F7F5F2] hover:text-[#5F8D6D]"
                }`}
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2 pt-3 border-t border-[#F0EDE9]">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 bg-[#EEF5F1] rounded-xl mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#5F8D6D] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2B2B2B]">{user?.name}</p>
                    <p className="text-xs text-[#6B7280]">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { openAuthModal("login"); setMobileOpen(false); }}
                className="w-full border border-[#5F8D6D] text-[#5F8D6D] py-2.5 rounded-xl text-sm font-semibold hover:bg-[#EEF5F1] transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Login / Register
              </button>
            )}
            <button
              onClick={() => { goToBooking(); setMobileOpen(false); }}
              className="w-full bg-[#C97C5D] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#b86b4c] transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default memo(Navbar);
