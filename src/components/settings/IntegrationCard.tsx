"use strict";
import React from "react";
import Image from "next/image";

import { KiteLogo } from "@/icon/kite";

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: string;
  status: "connected" | "disconnected";
  onConnect: () => void;
  onDisconnect: () => void;
  isLoading?: boolean;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  icon,
  status,
  onConnect,
  onDisconnect,
  isLoading = false,
}) => {
  const isConnected = status === "connected";

  return (
    <div className="relative group p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--brand-primary)]/10">
      {/* Gradient Border Background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[var(--surface-border)] via-transparent to-[var(--surface-border)] group-hover:from-[var(--brand-primary)]/50 group-hover:to-[var(--brand-primary)]/10 transition-all duration-500`} />
      
      {/* Card Content */}
      <div className="relative h-full bg-[var(--surface)]/90 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 group-hover:bg-[var(--surface)]/80">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            {/* Icon Container with Glow */}
            <div className="relative shrink-0">
              <div className={`absolute inset-0 bg-[var(--brand-primary)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative w-14 h-14 rounded-2xl bg-[var(--background)] flex items-center justify-center p-2.5 border border-[var(--surface-border)] shadow-inner">
                {icon === "kite_logo" ? (
               <KiteLogo className="w-full h-full text-[var(--foreground)]" />
            ) : icon.startsWith("/") || icon.startsWith("http") ? (
                  <Image
                    src={icon}
                    alt={`${name} icon`}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain drop-shadow-sm"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-bold text-[var(--foreground)]">{icon[0]}</span>
                )}
              </div>
            </div>
            
            <div className="pt-1">
              <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition-colors duration-300">
                {name}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mt-1 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--surface-border)]/50">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-colors duration-300 ${
            isConnected
              ? "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20 shadow-[0_0_10px_rgba(4,166,106,0.2)]"
              : "bg-[var(--surface-hover)] text-[var(--foreground-muted)] border-[var(--surface-border)]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-[var(--success)] animate-pulse" : "bg-[var(--foreground-muted)]"}`} />
            {isConnected ? "Connected" : "Not Connected"}
          </div>

          {isConnected ? (
            <button
              onClick={onDisconnect}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-[var(--error)] hover:bg-[var(--error-bg)] rounded-xl transition-all duration-300 disabled:opacity-50 hover:shadow-inner"
            >
              {isLoading ? "Updates..." : "Disconnect"}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={isLoading}
              className="relative px-5 py-2 text-sm font-semibold text-white bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] rounded-xl transition-all duration-300 shadow-lg shadow-[var(--brand-primary)]/20 hover:shadow-[var(--brand-primary)]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Connecting..." : "Connect"}
                {!isLoading && (
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
