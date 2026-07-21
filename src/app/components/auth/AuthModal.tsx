"use client";

import { useState, useEffect } from "react";
import { X, Lock, Mail, User, Phone, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { showToast } from "../../../lib/toast";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "forgot">(authMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync mode when authMode prop changes (fixes stale state bug)
  useEffect(() => {
    setMode(authMode);
    setErrorMsg("");
    setSuccessMsg("");
  }, [authMode]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setErrorMsg("");
      setSuccessMsg("");
      setShowPassword(false);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Basic validations
    if (mode === "register") {
      if (!name.trim()) { setErrorMsg("Please enter your full name."); return; }
      if (!phone.trim() || phone.replace(/\D/g, "").length < 10) { setErrorMsg("Please enter a valid 10-digit phone number."); return; }
      if (password.length < 8) { setErrorMsg("Password must be at least 8 characters."); return; }
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Invalid email or password. Please try again.");
        } else {
          showToast.success("Welcome back!", "You are now signed in.");
        }
      } else if (mode === "register") {
        const res = await register({ email, password, name, phone });
        if (!res.success) {
          setErrorMsg(res.error || "Registration failed. Please try again.");
        } else {
          showToast.success("Account created!", "Welcome to BinaryBrains.");
        }
      } else if (mode === "forgot") {
        // Simulated — no backend endpoint for password reset yet
        setSuccessMsg("If that email is registered, you'll receive a reset link shortly.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMsg("");
    setSuccessMsg("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-black/5" style={{ fontFamily: "Inter, sans-serif" }}>
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-full text-[#6B7280] hover:bg-[#EEF5F1] hover:text-[#2B2B2B] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5F1] text-[#5F8D6D] flex items-center justify-center mx-auto mb-3" aria-hidden="true">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
            {mode === "login" ? "Welcome Back" : mode === "register" ? "Create Account" : "Reset Password"}
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            {mode === "login"
              ? "Access your bookings, profile, and queue details"
              : mode === "register"
              ? "Join BinaryBrains Family Salon platform"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 text-center" role="alert">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#EEF5F1] text-[#5F8D6D] rounded-xl text-xs font-medium border border-[#5F8D6D]/20 text-center" role="status">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="auth-name">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" aria-hidden="true" />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="auth-phone">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" aria-hidden="true" />
                  <input
                    id="auth-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2B2B2B] mb-1.5" htmlFor="auth-email">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" aria-hidden="true" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#2B2B2B]" htmlFor="auth-password">Password *</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] text-[#5F8D6D] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" aria-hidden="true" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-2.5 text-[#6B7280] hover:text-[#2B2B2B] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "register" && (
                <p className="text-[11px] text-[#6B7280] mt-1.5">Minimum 8 characters</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C97C5D] text-white font-semibold py-3 rounded-xl hover:bg-[#b86b4c] transition-colors text-sm shadow-md mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
            {isSubmitting
              ? "Please wait…"
              : mode === "login"
              ? "Login to Account"
              : mode === "register"
              ? "Create Account"
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-black/5 text-center text-xs text-[#6B7280]">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button onClick={() => handleModeChange("register")} className="text-[#5F8D6D] font-bold hover:underline">
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => handleModeChange("login")} className="text-[#5F8D6D] font-bold hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
