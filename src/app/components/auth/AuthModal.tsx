"use client";

import { useState } from "react";
import { X, Lock, Mail, User, Phone, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

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

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Login failed");
        }
      } else if (mode === "register") {
        const res = await register({ email, password, name, phone });
        if (!res.success) {
          setErrorMsg(res.error || "Registration failed");
        }
      } else if (mode === "forgot") {
        setSuccessMsg("Password reset link sent to your registered email.");
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-black/5" style={{ fontFamily: "Inter, sans-serif" }}>
        <button
          onClick={closeAuthModal}
          className="absolute top-6 right-6 p-2 rounded-full text-[#6B7280] hover:bg-[#EEF5F1] hover:text-[#2B2B2B] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF5F1] text-[#5F8D6D] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#2B2B2B]" style={{ fontFamily: "Poppins, sans-serif" }}>
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
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-[#EEF5F1] text-[#5F8D6D] rounded-xl text-xs font-medium border border-[#5F8D6D]/20 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2B2B2B] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D]"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#2B2B2B]">Password</label>
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
                <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F7F5F2] border border-black/10 rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#5F8D6D]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C97C5D] text-white font-semibold py-3 rounded-xl hover:bg-[#b86b4c] transition-colors text-sm shadow-md mt-2 disabled:opacity-50"
          >
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
              ? "Login to Account"
              : mode === "register"
              ? "Register Account"
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-black/5 text-center text-xs text-[#6B7280]">
          {mode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button onClick={() => setMode("register")} className="text-[#5F8D6D] font-bold hover:underline">
                Register now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} className="text-[#5F8D6D] font-bold hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
