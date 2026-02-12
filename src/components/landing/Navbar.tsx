"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { currentUser } = useAuth();
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md border-b border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-[var(--brand-primary)] to-emerald-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
            HiFi
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white 
                       bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] 
                       transition-all duration-200 border border-[var(--brand-primary-active)]"
            >
              Dashboard
            </button>
          ) : (
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-black 
                         bg-white hover:bg-gray-100 
                         transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
