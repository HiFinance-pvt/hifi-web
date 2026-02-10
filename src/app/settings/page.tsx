"use client";

import React from "react";
import { IntegrationCard } from "@/components/settings/IntegrationCard";
import { env } from "@/lib/env";
import { toast } from "sonner";
// We import local components and libs

import { useKiteConnect, useKiteIntegration } from "@/hooks/use-kite";

export default function SettingsPage() {
  const { mutate: connectToKite, isPending: isConnectingKite } = useKiteConnect();
  const { status: zerodhaStatus, disconnect: disconnectKite, isDisconnecting, lastVerifiedAt } = useKiteIntegration();

  const handleZerodhaConnect = () => {
    toast.info("Connecting to Zerodha...", {
        description: "Redirecting to secure login...",
    });
    connectToKite();
  };

  const handleZerodhaDisconnect = async () => {
      if (!confirm("Are you sure you want to disconnect your Zerodha account?")) {
          return;
      }
      disconnectKite();
  }

  return (
    <div className="relative min-h-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Background Ambient Glow */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-[var(--brand-primary)]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* Header Section */}
      <div className="relative border-b border-[var(--surface-border)] pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground-muted)] bg-clip-text text-transparent">
            Settings
          </span>
        </h1>
        <p className="text-lg text-[var(--foreground-muted)] mt-4 max-w-2xl font-light leading-relaxed">
          Manage your connected accounts, preferences, and system integrations all in one place.
        </p>
      </div>

      {/* Integrations Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              Integrations
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <IntegrationCard
                name="Zerodha Kite"
                description="Connect your Zerodha account to sync your portfolio, track positions, and execute trades seamlessly."
                icon="kite_logo"
                status={zerodhaStatus}
                onConnect={handleZerodhaConnect}
                onDisconnect={handleZerodhaDisconnect}
                isLoading={isConnectingKite || isDisconnecting}
            />
            
            {/* Placeholder for 'Coming Soon' Integration */}
            <div className="relative group p-[1px] rounded-2xl overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300">
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-border)] to-transparent" />
               <div className="relative h-full bg-[var(--surface)]/50 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-[var(--surface-border)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] flex items-center justify-center text-[var(--foreground-muted)]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[var(--foreground-secondary)]">More coming soon</h3>
                    <p className="text-sm text-[var(--foreground-muted)] mt-1">We are working on adding more brokers.</p>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
