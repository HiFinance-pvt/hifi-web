"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Dither from "@/ui/components/Dither";
import { getCurrentUser } from "@/lib/firebase/firebase";
import { env } from "@/lib/env";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmail(email, password);
      toast.success("Successfully signed in!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      await signInWithGoogle();
      const token = await getCurrentUser()?.getIdToken();

      if (token) {
        localStorage.setItem(env.NEXT_PUBLIC_SSID, token);
        toast.success("Successfully signed in with Google!");
      } else {
        toast.error("Failed to get authentication token");
        router.push("/login");
        return;
      }
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(getErrorMessage(error.message));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "No account found with this email address":
        return "No account found with this email address";
      case "Incorrect password":
        return "Incorrect password";
      case "Invalid email address":
        return "Invalid email address";
      case "Too many failed attempts. Please try again later":
        return "Too many failed attempts. Please try again later";
      default:
        return "An error occurred. Please try again.";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-50">
        <Dither
          waveColor={[0.02, 0.41, 0.33]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={3}
          waveAmplitude={0.2}
          waveFrequency={2}
          waveSpeed={0.03}
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-transparent to-[var(--background)]" />

      {/* Main card */}
      <div className="relative w-full max-w-md">
        <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1 tracking-tight">
              Welcome to{" "}
              <span className="text-[var(--brand-primary)]">Hi-Fi</span>
            </h1>
            <p className="text-[var(--foreground-muted)] text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] 
                          rounded-xl text-[var(--foreground)] placeholder-[var(--foreground-subtle)] 
                          focus:outline-none focus:border-[var(--brand-primary)]
                          transition-colors duration-150"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground-secondary)] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] 
                          rounded-xl text-[var(--foreground)] placeholder-[var(--foreground-subtle)] 
                          focus:outline-none focus:border-[var(--brand-primary)]
                          transition-colors duration-150"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-2 rounded-xl font-medium text-white
                        bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors duration-150"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[var(--surface-border)]" />
            <span className="px-4 text-[var(--foreground-subtle)] text-xs font-medium">or</span>
            <div className="flex-1 border-t border-[var(--surface-border)]" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed 
                      text-gray-800 font-medium py-3 px-4 rounded-xl 
                      border border-gray-200
                      transition-colors duration-150 
                      flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-[var(--foreground-muted)] text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--brand-primary)] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
