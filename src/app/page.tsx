"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        {/* Subtle glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[200px] 
                        bg-[var(--brand-primary)]/10 rounded-full blur-3xl" />
        
        <div className="text-center relative z-10">
          {/* Loader */}
          <div className="relative mb-6">
            <div className="w-12 h-12 border-2 border-[var(--surface-border)] border-t-[var(--brand-primary)] 
                          rounded-full animate-spin mx-auto" />
          </div>
          
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-2 tracking-tight">
            <span className="text-[var(--brand-primary)]">Hi-Fi</span>
          </h1>
          
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading your financial assistant...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
